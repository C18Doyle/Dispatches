/**
 * Pure run logic for Dispatches 1941, extracted from the React component so it can be
 * tested and later moved into the shared engine. No React, no DOM, no storage, no sound,
 * no Math.random (randomness is passed in as `rand`). Content (campaigns, divergence
 * forks, special events) is always passed in, never imported.
 *
 * The arithmetic (weighted roll, clamped impact, hard-mode ceilings, end flags) is the shared engine's
 * campaign primitives (@dispatches/engine); this file holds only 1941's rules for them and its
 * screen-flow glue.
 */
import { applyCeilings, applyImpact as engineApplyImpact, endsRun, pickWeighted } from "@dispatches/engine";
import type { AxisSpec, Ceiling, EndFlag, RollRule } from "@dispatches/engine";

export interface Meters {
  readiness: number;
  pipeline: number;
  initiative: number;
}
export type Impact = Partial<Meters>;
export type Flags = Record<string, unknown>;
export type Mode = "open" | "fanatical" | "coalition" | "iron";

export interface Variant {
  weight: number;
  title?: string;
  impact?: Impact;
  outcome?: string;
  next?: string;
  setFlags?: Flags;
}

export interface Choice {
  label: string;
  impact?: Impact;
  outcome?: string;
  next?: string;
  setFlags?: Flags;
  uncertain?: Variant[];
  favor?: number;
  disabledReason?: string;
  historical?: boolean;
  advisor?: { name: string; quote?: string };
}

export interface Stage {
  date?: string;
  title?: string;
  choices: Choice[];
  historicalRecord?: boolean;
  [k: string]: unknown;
}

export interface SpecialEvent {
  type: string;
  afterNode: string | number;
  condition?: (flags: Flags) => boolean;
  pressEvent?: unknown;
}

export interface DivergenceFork {
  id: string;
  flag: string;
  revealNode: string;
}

export const EMPTY_METERS: Meters = { readiness: 0, pipeline: 0, initiative: 0 };
export const METER_MIN = -10;
export const METER_MAX = 10;

export const clampMeter = (n: number): number => Math.max(METER_MIN, Math.min(METER_MAX, n));

// 1941's rules for the engine's campaign primitives.
const AXES: AxisSpec[] = (["readiness", "pipeline", "initiative"] as const).map((key) => ({ key, min: METER_MIN, max: METER_MAX }));
const ROLL: RollRule = { scale: "total", fallback: "first" };
const CEILINGS: Ceiling[] = [
  { mode: "fanatical", flag: "suspicion", op: "gte", threshold: 5, unless: "purged", set: { purged: true, purgedAt: "suspicionCeiling" } },
  { mode: "coalition", flag: "cohesion", op: "lte", threshold: -6, unless: "relieved", set: { relieved: true } },
];
const END_FLAGS: EndFlag[] = [
  { mode: "fanatical", flag: "purged" },
  { mode: "coalition", flag: "relieved" },
];

/** Applies a choice's impact to the meters, clamping all three to [-10, 10]. */
export function applyImpact(meters: Meters, impact: Impact | undefined): Meters {
  return engineApplyImpact(meters as unknown as Record<string, number>, impact as Record<string, number> | undefined, AXES) as unknown as Meters;
}

/** Doctrine selection clamps readiness/pipeline but (as shipped) not initiative. */
export function applyDoctrineImpact(meters: Meters, impact: Impact): Meters {
  return {
    readiness: clampMeter(meters.readiness + (impact.readiness || 0)),
    pipeline: clampMeter(meters.pipeline + (impact.pipeline || 0)),
    initiative: meters.initiative + (impact.initiative || 0),
  };
}

export function impactSum(impact: Impact | undefined): number {
  if (!impact) return 0;
  return (impact.readiness || 0) + (impact.pipeline || 0) + (impact.initiative || 0);
}

export function effectiveChoice(choice: Choice, rollIndex: number | null) {
  if (choice.uncertain && rollIndex != null && choice.uncertain[rollIndex]) {
    const v = choice.uncertain[rollIndex];
    return { impact: v.impact || choice.impact, outcome: v.outcome, variantTitle: v.title };
  }
  return { impact: choice.impact, outcome: choice.outcome, variantTitle: null as string | null | undefined };
}

/** u is a uniform sample in [0, 1). Picks a variant index by weight. */
export function pickRollIndex(uncertain: Variant[], u: number): number {
  return pickWeighted(uncertain.map((v) => v.weight), u, ROLL);
}

export function startFlags(mode: Mode): Flags {
  return mode === "fanatical" || mode === "coalition" ? { hardMode: true } : {};
}

/**
 * Necessity rule: a node can never dead-end with every choice blocked. In iron mode a
 * choice blocked only by capital gets its cost waived; otherwise the first choice is
 * forced open as a last resort.
 */
export function playableStage(stage: Stage | null | undefined, mode: Mode, favor: number): Stage | null | undefined {
  if (!stage || !stage.choices || !stage.choices.length) return stage;
  const isBlocked = (c: Choice) => (mode === "iron" && !!c.favor && c.favor > favor) || !!c.disabledReason;
  if (!stage.choices.every(isBlocked)) return stage;
  if (mode === "iron") {
    const capitalOnly = stage.choices.filter((c) => !c.disabledReason);
    if (capitalOnly.length) {
      const minFav = Math.min(...capitalOnly.map((c) => c.favor || 0));
      let waived = false;
      return {
        ...stage,
        choices: stage.choices.map((c) => {
          if (!waived && !c.disabledReason && (c.favor || 0) === minFav) {
            waived = true;
            return { ...c, favor: undefined };
          }
          return c;
        }),
      };
    }
  }
  return {
    ...stage,
    choices: stage.choices.map((c, i) => (i === 0 ? { ...c, favor: undefined, disabledReason: undefined } : c)),
  };
}

export interface ChoiceResult {
  favor: number;
  defiance: number;
  flags: Flags;
  meters: Meters;
  rollIndex: number | null;
  choiceIndex: number;
}

/**
 * Resolves the player's pick. Returns null if the pick is not allowed (iron-mode capital).
 * `rand` is called at most once, and only if the choice is uncertain.
 */
export function resolveChoice(args: {
  stage: Stage;
  index: number;
  mode: Mode;
  favor: number;
  defiance: number;
  flags: Flags;
  meters: Meters;
  rand: () => number;
}): ChoiceResult | null {
  const { stage, index, mode, rand } = args;
  const choice = stage.choices[index];
  if (mode === "iron" && choice.favor && choice.favor > args.favor) return null;
  const favor = mode === "iron" && choice.favor ? args.favor - choice.favor : args.favor;

  const rollIndex = choice.uncertain ? pickRollIndex(choice.uncertain, rand()) : null;
  const eff = effectiveChoice(choice, rollIndex);

  let flags: Flags = { ...args.flags };
  if (choice.setFlags) flags = { ...flags, ...choice.setFlags };
  if (choice.uncertain && rollIndex != null && choice.uncertain[rollIndex].setFlags) {
    flags = { ...flags, ...choice.uncertain[rollIndex].setFlags };
  }
  // Hard-mode ceilings are a hard stop: hitting the cap is itself the event.
  flags = applyCeilings(mode, flags, CEILINGS);
  // Inert in the Pacific game (no mode sets choice.favor), inherited from the Europe file.
  let defiance = args.defiance;
  if (mode === "iron" && choice.favor) {
    defiance = args.defiance + 1;
    if (defiance >= 5 && !flags.dismissed) flags = { ...flags, dismissed: true };
  }

  return { favor, defiance, flags, meters: applyImpact(args.meters, eff.impact), rollIndex, choiceIndex: index };
}

export interface LogEntry {
  date?: string;
  title?: string;
  label: string;
  sum: number;
  histSum: number | null;
  histLabel: string | null;
  isHistorical: boolean;
  advisor: string | null;
  notTakenAdvisors: string[];
  rollP: number | null;
}

/** The after-action log line for a decision. `stage` must be the stage the player actually saw. */
export function buildLogEntry(stage: Stage, choiceIndex: number, rollIndex: number | null): LogEntry {
  const choice = stage.choices[choiceIndex];
  const eff = effectiveChoice(choice, rollIndex);
  const histChoice = stage.choices.find((c) => c.historical);
  return {
    date: stage.date,
    title: stage.title,
    label: choice.label + (eff.variantTitle ? ` (${eff.variantTitle})` : ""),
    sum: impactSum(eff.impact),
    histSum: histChoice ? impactSum(histChoice.impact) : null,
    histLabel: histChoice ? histChoice.label : null,
    isHistorical: !!choice.historical,
    advisor: choice.advisor ? choice.advisor.name : null,
    notTakenAdvisors: stage.choices.filter((c, idx) => idx !== choiceIndex && c.advisor).map((c) => c.advisor!.name),
    rollP:
      choice.uncertain && rollIndex != null
        ? choice.uncertain[rollIndex].weight / choice.uncertain.reduce((a, v) => a + v.weight, 0)
        : null,
  };
}

/** Where the run goes after the outcome screen. Dynamic campaigns route by `next`; "END" finishes. */
export function nextPosition(args: {
  dynamic: boolean;
  length?: number;
  position: string | number;
  choice: Choice;
  rollIndex: number | null;
  mode: Mode;
  flags: Flags;
}): { nextPos: string | number; isEnd: boolean } {
  const { choice, rollIndex, mode, flags } = args;
  if (args.dynamic) {
    let nextPos: string | number =
      (choice.uncertain && rollIndex != null && choice.uncertain[rollIndex].next) || (choice.next as string);
    let isEnd = nextPos === "END";
    // A hard-mode ceiling break ends the run immediately, wherever the choice would route.
    if (endsRun(mode, flags, END_FLAGS)) {
      nextPos = "END";
      isEnd = true;
    }
    return { nextPos, isEnd };
  }
  const nextPos = (args.position as number) + 1;
  return { nextPos, isEnd: nextPos >= (args.length ?? 0) };
}

export function nextVisited(visited: string[], nextPos: string | number): string[] {
  return visited.includes(String(nextPos)) ? visited : [...visited, String(nextPos)];
}

export interface Arrival {
  screen: string;
  divergenceForkId: string | null;
  pressEvent: unknown;
}

/**
 * Decides which interstitial (if any) shows on arriving at nextPos: a Historical
 * Divergence reveal wins outright; otherwise a SPECIAL_EVENTS entry keyed to the node
 * just left; otherwise the next briefing.
 */
export function arrivalScreen(args: {
  dynamic: boolean;
  campaignId: string;
  position: string | number;
  nextPos: string | number;
  flags: Flags;
  forks: Record<string, DivergenceFork[]>;
  events: Record<string, SpecialEvent[]>;
  seenReveals: string[];
}): Arrival {
  const { dynamic, campaignId, flags } = args;
  const fork = dynamic
    ? (args.forks[campaignId] || []).find(
        (fk) => fk.revealNode === String(args.nextPos) && flags[fk.flag] && !args.seenReveals.includes(fk.id)
      )
    : null;
  const event = dynamic
    ? (args.events[campaignId] || []).find((e) => e.afterNode === args.position && (!e.condition || e.condition(flags)))
    : null;
  if (fork) return { screen: "divergence", divergenceForkId: fork.id, pressEvent: null };
  return {
    screen: event ? event.type : "briefing",
    divergenceForkId: null,
    pressEvent: event && event.type === "press" ? event.pressEvent : null,
  };
}
