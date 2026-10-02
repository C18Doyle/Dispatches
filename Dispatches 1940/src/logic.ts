/**
 * Pure run logic for Dispatches 1940, extracted from WW2CommandInner(). No React, no DOM, no
 * storage, no sound, no Math.random (randomness comes in as `rand`). Content (campaigns,
 * divergence forks, battle cost calculators) is passed in, never imported.
 *
 * Meter axes here are manpower / fuel / initiative, all clamped to [-10, 10].
 */

export interface Meters {
  manpower: number;
  fuel: number;
  initiative: number;
}
export type Impact = Partial<Meters>;
export type Flags = Record<string, unknown>;
export type Mode = "easy" | "open" | "iron" | "purge" | "coalition" | "axis";

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
  advisor?: { name: string };
  keyBattleSubgame?: { id: string } & Record<string, unknown>;
}

export interface Stage {
  date?: string;
  title?: string;
  choices: Choice[];
  [k: string]: unknown;
}

export interface DivergenceFork {
  id: string;
  flag: string;
  revealNode: string;
}

/** What the Order of Battle screen hands back when a battle is resolved. */
export interface SubgamePayload {
  bonus?: number;
  flagsOut?: Flags;
  finalAllocation?: unknown;
  poolSize?: number;
  contributions?: unknown;
  reservesHeld?: number;
  counter?: unknown;
  notes?: unknown;
}

export interface PlanCosts {
  grade?: string;
  totals: Meters;
}

export const EMPTY_METERS: Meters = { manpower: 0, fuel: 0, initiative: 0 };
export const METER_MIN = -10;
export const METER_MAX = 10;
const AXES: (keyof Meters)[] = ["manpower", "fuel", "initiative"];

export const clampMeter = (n: number): number => Math.max(METER_MIN, Math.min(METER_MAX, n));

export function impactSum(impact: Impact | undefined): number {
  if (!impact) return 0;
  return (impact.manpower || 0) + (impact.fuel || 0) + (impact.initiative || 0);
}

export function effectiveChoice(choice: Choice, rollIndex: number | null) {
  if (choice.uncertain && rollIndex != null && choice.uncertain[rollIndex]) {
    const v = choice.uncertain[rollIndex];
    return { impact: v.impact || choice.impact, outcome: v.outcome, variantTitle: v.title };
  }
  return { impact: choice.impact, outcome: choice.outcome, variantTitle: null as string | null | undefined };
}

/** Flags every hard mode seeds at the start of a run. */
export function startFlags(mode: Mode): Flags {
  return mode === "purge" || mode === "coalition" || mode === "axis" ? { hardMode: true } : {};
}

/**
 * Führer Mode (iron) necessity rule: a node can never dead-end with every choice blocked.
 * A choice blocked only by capital gets its cost waived; otherwise the first choice is forced open.
 * Other modes return the stage unchanged.
 */
export function playableStage(stage: Stage | null | undefined, mode: Mode, favor: number): Stage | null | undefined {
  if (!stage || mode !== "iron" || !stage.choices || !stage.choices.length) return stage;
  const isBlocked = (c: Choice) => (!!c.favor && c.favor > favor) || !!c.disabledReason;
  if (!stage.choices.every(isBlocked)) return stage;
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
  return {
    ...stage,
    choices: stage.choices.map((c, i) => (i === 0 ? { ...c, favor: undefined, disabledReason: undefined } : c)),
  };
}

/** Nudges a two-outcome roll by the Order of Battle bonus, clamped to [2, 98] each. */
export function subgameWeights(weights: number[], bonus: number): number[] {
  if (!bonus || weights.length !== 2) return weights;
  return [Math.max(2, Math.min(98, weights[0] + bonus)), Math.max(2, Math.min(98, weights[1] - bonus))];
}

/** u is a uniform sample in [0, 1). Picks an outcome index by weight. */
export function pickWeighted(weights: number[], u: number): number {
  const total = weights.reduce((a, v) => a + v, 0);
  let roll = u * total;
  let ri = 0;
  for (let k = 0; k < weights.length; k++) {
    roll -= weights[k];
    if (roll <= 0) {
      ri = k;
      break;
    }
  }
  return ri;
}

export interface ChoiceResult {
  favor: number;
  defiance: number;
  flags: Flags;
  meters: Meters;
  rollIndex: number | null;
  choiceIndex: number;
  /** Set only for a battle-resolved choice: the weights actually rolled, the pre-bonus weights, the plan costs. */
  battle: { weights: number[]; baseWeights: number[]; planCosts: PlanCosts | null } | null;
  /** True if the choice rolled dice (the caller plays the dice sound). */
  rolled: boolean;
}

/**
 * Resolves the player's pick. Returns null if not allowed (iron-mode capital). `rand` is called at
 * most once, only for an uncertain choice. `planCostsFor(ri)` computes the battle plan's campaign
 * cost once the roll is known (it needs ri to know whether the battle was won).
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
  subgame?: SubgamePayload;
  planCostsFor?: (ri: number | null) => PlanCosts | null;
}): ChoiceResult | null {
  const { stage, index, mode, rand } = args;
  const choice = stage.choices[index];
  if (mode === "iron" && choice.favor && choice.favor > args.favor) return null;

  const subgame = args.subgame;
  const isSubgameResolution = subgame !== undefined;
  const subgameBonus = subgame?.bonus ?? 0;
  const favor = mode === "iron" && choice.favor ? args.favor - choice.favor : args.favor;

  let ri: number | null = null;
  let resolvedWeights: number[] | null = null;
  let baseWeights: number[] | null = null;
  if (choice.uncertain) {
    let weights = choice.uncertain.map((u) => u.weight);
    baseWeights = weights.slice();
    if (isSubgameResolution && subgameBonus) weights = subgameWeights(weights, subgameBonus);
    if (isSubgameResolution) resolvedWeights = weights;
    ri = pickWeighted(weights, rand());
  }
  const eff = effectiveChoice(choice, ri);

  const planCosts = resolvedWeights && subgame && subgame.finalAllocation && args.planCostsFor ? args.planCostsFor(ri) : null;

  let flags: Flags = { ...args.flags };
  if (choice.setFlags) flags = { ...flags, ...choice.setFlags };
  if (choice.uncertain && ri != null && choice.uncertain[ri].setFlags) flags = { ...flags, ...choice.uncertain[ri].setFlags };
  // How a battle was fought, and how well (the plan's grade), carry into later node text.
  if (subgame && subgame.flagsOut) flags = { ...flags, ...subgame.flagsOut };
  if (planCosts && planCosts.grade && choice.keyBattleSubgame) flags = { ...flags, [`${choice.keyBattleSubgame.id}Grade`]: planCosts.grade };
  // Hard-mode ceilings are a hard stop: hitting the cap is itself the event.
  if (mode === "purge" && ((flags.suspicion as number) || 0) >= 5 && !flags.purged) flags = { ...flags, purged: true, purgedAt: "suspicionCeiling" };
  if (mode === "coalition" && ((flags.cohesion as number) || 0) <= -6 && !flags.relieved) flags = { ...flags, relieved: true };
  if (mode === "axis" && ((flags.trust as number) || 0) <= -5 && !flags.superseded) flags = { ...flags, superseded: true };
  let defiance = args.defiance;
  if (mode === "iron" && choice.favor) {
    defiance = args.defiance + 1;
    if (defiance >= 5 && !flags.dismissed) flags = { ...flags, dismissed: true };
  }

  let meters = args.meters;
  if (eff.impact || planCosts) {
    const imp = eff.impact || {};
    const plan = planCosts ? planCosts.totals : EMPTY_METERS;
    meters = {
      manpower: clampMeter(args.meters.manpower + (imp.manpower || 0) + plan.manpower),
      fuel: clampMeter(args.meters.fuel + (imp.fuel || 0) + plan.fuel),
      initiative: clampMeter(args.meters.initiative + (imp.initiative || 0) + plan.initiative),
    };
  }

  return {
    favor,
    defiance,
    flags,
    meters,
    rollIndex: ri,
    choiceIndex: index,
    battle: resolvedWeights ? { weights: resolvedWeights, baseWeights: baseWeights as number[], planCosts } : null,
    rolled: !!choice.uncertain,
  };
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
    if ((mode === "purge" && flags.purged) || (mode === "coalition" && flags.relieved) || (mode === "iron" && flags.dismissed) || (mode === "axis" && flags.superseded)) {
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

/** The Historical Divergence reveal (if any) that fires on arriving at nextPos. It wins over a real wire bulletin. */
export function arrivalFork(args: {
  dynamic: boolean;
  campaignId: string;
  nextPos: string | number;
  flags: Flags;
  forks: Record<string, DivergenceFork[]>;
  seenWireIds: string[];
}): DivergenceFork | null {
  if (!args.dynamic) return null;
  return (
    (args.forks[args.campaignId] || []).find(
      (fk) => fk.revealNode === String(args.nextPos) && args.flags[fk.flag] && !args.seenWireIds.includes(fk.id)
    ) || null
  );
}

/** Meter axes, exported for callers that iterate them. */
export const METER_AXES = AXES;
