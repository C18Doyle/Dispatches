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
export type Mode = "easy" | "open" | "fanatical" | "coalition" | "iron";

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
  keyBattleSubgame?: { id: string } & Record<string, unknown>;
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

/** Nudges a two-outcome roll by the Order of Battle bonus, clamped to [2, 98] each. */
export function subgameWeights(weights: number[], bonus: number): number[] {
  if (!bonus || weights.length !== 2) return weights;
  return [Math.max(2, Math.min(98, weights[0] + bonus)), Math.max(2, Math.min(98, weights[1] - bonus))];
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

// Each of the three meters is one number that the rules use. Under each sit three readings the player can see: where the
// choices they made put the weight. Readiness has Training, Forces and Morale; Pipeline has Fuel & Oil, Shipping and Industry;
// Initiative has Intelligence, Command and Tempo. A reading's band is the headline score plus how far its own running tally
// has drifted from the average of its meter's tallies. The tally is kept in flags (so saves and rewinds carry it) and is fed by
// each choice's impact on that meter, filed to a reading by what the choice's text is about. Five bands, worst first; the worst
// is reserved for a meter at -8 or below.
export type MeterKey = keyof Meters;

export interface StrandDef {
  id: string;
  flag: string;
  name: string;
  words: RegExp;
  /** Band words, worst first: [critical, short, strained, adequate, plentiful]. */
  bands: readonly [string, string, string, string, string];
}

export const READINESS_STRANDS: readonly StrandDef[] = [
  { id: "trn", flag: "rdyTrn", name: "Training", bands: ["Raw", "Green", "Thin", "Seasoned", "Veteran"], words: /\b(train\w*|pilots?|aircrews?|aviators?|veterans?|experienced?|instructors?|schools?|academy|cadres?|officers?|crews?|replacements?|recruits?|conscripts?|volunteers?|skilled|elite)\b/gi },
  { id: "flt", flag: "rdyFlt", name: "Forces", bands: ["Shattered", "Depleted", "Thin", "Sound", "Strong"], words: /\b(carriers?|battleships?|cruisers?|destroyers?|submarines?|fleet|fleets|aircraft|airframes?|squadrons?|air groups?|divisions?|garrisons?|tanks?|ships?|hulls?|armies|army|battalions?|brigades?|regiments?|bombers?|fighters?|task forces?)\b/gi },
  { id: "mor", flag: "rdyMor", name: "Morale", bands: ["Broken", "Worn", "Frayed", "Steady", "High"], words: /\b(morale|rest(?:ed|ing)?|fatigue\w*|exhaust\w*|disease|malaria|sick\w*|rations?|starv\w*|leave|rotat\w*|spirit|discipline|confidence|prisoners?|casualt\w+|resolve|public|opinion|home front|propaganda)\b/gi },
];

export const PIPELINE_STRANDS: readonly StrandDef[] = [
  { id: "oil", flag: "pipOil", name: "Fuel & Oil", bands: ["Exhausted", "Short", "Strained", "Adequate", "Plentiful"], words: /\b(fuel|oil|oilfields?|petrol|gasoline|tankers?|refiner(?:y|ies)|aviation spirit|palembang|balikpapan|crude)\b/gi },
  { id: "shp", flag: "pipShp", name: "Shipping", bands: ["Exhausted", "Short", "Strained", "Adequate", "Plentiful"], words: /\b(shipping|convoys?|tonnage|merchant|transports?|sealift|ports?|harbou?rs?|lend-lease|escorts?|supplies|supply|logistics?|mines?|mining|blockade|rail(?:way|ways|road)?)\b/gi },
  { id: "ind", flag: "pipInd", name: "Industry", bands: ["Idle", "Low", "Strained", "Steady", "Booming"], words: /\b(production|factor(?:y|ies)|industr\w+|steel|shipyards?|yards?|aluminum|aluminium|rubber|mills?|workers|bases?|airfields?|seabees|construction|engineers?|build\w*|materi[ae]l|raw materials?|resources?)\b/gi },
];

export const INITIATIVE_STRANDS: readonly StrandDef[] = [
  { id: "int", flag: "iniInt", name: "Intelligence", bands: ["Blind", "Poor", "Patchy", "Clear", "Penetrating"], words: /\b(intelligence|reconnaissance|recon|spy|spies|agents?|codebreak\w*|decrypt\w*|intercepts?|ciphers?|jn-25|magic|ultra|signals?|observation|scout\w*|informants?|radio|radar)\b/gi },
  { id: "cmd", flag: "iniCmd", name: "Command", bands: ["Paralysed", "Divided", "Uncertain", "Steady", "Decisive"], words: /\b(command\w*|directives?|authority|orders?|IGHQ|general staff|joint chiefs|coordinat\w*|coalition|alliance|allie[sd]|army and navy|services|cabinet|council|emperor|president|prime minister|decision\w*|doctrine)\b/gi },
  { id: "tmp", flag: "iniTmp", name: "Tempo", bands: ["Stalled", "Slow", "Sluggish", "Brisk", "Rapid"], words: /\b(offensives?|attacks?|advance\w*|pursuit|pursue\w*|momentum|speed\w*|rapid\w*|surprise|strikes?|timetable|schedule\w*|delay\w*|paus\w*|hasten\w*|accelerat\w*|landings?|invasions?|initiative|tempo)\b/gi },
];

export const METER_STRANDS: Record<MeterKey, readonly StrandDef[]> = {
  readiness: READINESS_STRANDS,
  pipeline: PIPELINE_STRANDS,
  initiative: INITIATIVE_STRANDS,
};

/** Where an impact on a meter lands when its text names none of the meter's readings. */
const STRAND_FALLBACK: Record<MeterKey, string> = { readiness: "flt", pipeline: "shp", initiative: "tmp" };

/** Which reading of `meter` a choice's impact falls on. */
export function strandOf(meter: MeterKey, choice: { label?: string; outcome?: string }, outcomeText?: string): string {
  const text = [choice.label ?? "", outcomeText ?? choice.outcome ?? ""].join(" ");
  let best: string | null = null;
  let bestN = 0;
  for (const s of METER_STRANDS[meter]) {
    const n = (text.match(s.words) || []).length;
    if (n > bestN) {
      bestN = n;
      best = s.id;
    }
  }
  return best ?? STRAND_FALLBACK[meter];
}

export interface StrandReading {
  id: string;
  name: string;
  /** The band word, e.g. "Short", "Veteran". */
  band: string;
  /** 0 critical, 1 short, 2 strained, 3 adequate, 4 plentiful. */
  level: number;
  score: number;
}

/** The three readings of one meter as the staff would put them, from the headline score and the tallies in `flags`. */
export function strandReadout(meter: MeterKey, flags: Flags, meters: Meters): StrandReading[] {
  const defs = METER_STRANDS[meter];
  const tallies = defs.map((d) => Number(flags[d.flag]) || 0);
  const mean = tallies.reduce((a, v) => a + v, 0) / defs.length;
  return defs.map((d, i) => {
    const score = Math.max(METER_MIN, Math.min(METER_MAX, Math.round(meters[meter] + (tallies[i] - mean))));
    const level = score <= -8 ? 0 : score <= -4 ? 1 : score <= -1 ? 2 : score <= 3 ? 3 : 4;
    return { id: d.id, name: d.name, band: d.bands[level], level, score };
  });
}

// ---------- Command rank ----------
// A single mark for how the war was commanded, from Private to General. It is built from five things the player can see and
// nothing hidden: how the war ended, the condition the command was left in, how the battles went (none are fought yet in this
// game, so that part follows the ending), how the decisions compare with the historical ones, and the objectives earned. Luck in
// the dice is not scored. Being removed from command caps the rank, and the training-wheels mode cannot reach General.
export const COMMAND_RANKS = ["Private", "Corporal", "Sergeant", "Lieutenant", "Captain", "Major", "Colonel", "General"] as const;
const RANK_FROM = [0, 20, 32, 44, 55, 65, 74, 83];

export interface RatingInput {
  /** The ending's tier ("Major Victory" ... "Major Defeat"), or null when it has none. */
  tier: string | null;
  /** The best tier any ending on this run's path can award (see endingCeiling). The ending is scored against it. */
  ceiling?: string | null;
  removed: boolean;
  /** Readiness + Pipeline + Initiative at the end. */
  total: number;
  battles: { grade: string; staff: boolean }[];
  judged: { sum: number; histSum: number }[];
  objectives: number;
  mode: string;
}
export interface RatingPart {
  id: string;
  label: string;
  points: number;
  max: number;
  word: "Strong" | "Fair" | "Weak";
  fact: string;
}
export interface Rating {
  score: number;
  rank: string;
  rankIndex: number;
  parts: RatingPart[];
  /** Why the rank was held down, or null. */
  capped: string | null;
}

const TIER_POINTS: Record<string, number> = { "Major Victory": 30, "Minor Victory": 24, "Contested Outcome": 15, "Minor Defeat": 8, "Major Defeat": 2 };
const TIER_FACT: Record<string, string> = {
  "Major Victory": "A major victory",
  "Minor Victory": "A minor victory",
  "Contested Outcome": "A contested outcome",
  "Minor Defeat": "A minor defeat",
  "Major Defeat": "A major defeat",
};
// The best tier any ending on a command's path can award. The ending is worth 30 of the 100 points and is scored against this
// ceiling. Both Pacific commands have a major victory among their endings, so both are scored as they stand. `npm run
// check-endings` fails if an ending outranks its command's ceiling, so the table cannot drift when an ending is added.
export const ENDING_CEILING: Record<string, string> = {
  japan: "Major Victory",
  alliedPacific: "Major Victory",
};
export function endingCeiling(campaignId: string): string {
  return ENDING_CEILING[campaignId] ?? "Major Victory";
}
const GRADE_POINTS: Record<string, number> = { clean: 1, costly: 0.75, marginal: 0.35, total: 0 };

export function commandRating(i: RatingInput): Rating {
  const word = (p: number, max: number): "Strong" | "Fair" | "Weak" => (p / max >= 0.65 ? "Strong" : p / max < 0.35 ? "Weak" : "Fair");
  const parts: RatingPart[] = [];

  const rawEnding = i.tier && TIER_POINTS[i.tier] != null ? TIER_POINTS[i.tier] : 15;
  const ceilingPts = i.ceiling && TIER_POINTS[i.ceiling] ? TIER_POINTS[i.ceiling] : 30;
  const endingPts = i.removed ? 0 : Math.round(Math.min(30, (30 * rawEnding) / ceilingPts) * 10) / 10;
  const endingFact = i.tier && TIER_FACT[i.tier] ? TIER_FACT[i.tier] : "An ending with no verdict of its own";
  parts.push({
    id: "ending",
    label: "How the war ended",
    points: endingPts,
    max: 30,
    word: word(endingPts, 30),
    fact: i.removed ? "Removed from command before the war was over" : endingFact,
  });

  const posPts = Math.max(0, Math.min(20, 10 + i.total));
  parts.push({
    id: "position",
    label: "The command's condition",
    points: posPts,
    max: 20,
    word: word(posPts, 20),
    fact: i.total >= 3 ? "Left in good order" : i.total <= -3 ? "Left spent" : "Left holding together",
  });

  // With no battle fought, or nothing to set against the record, those parts follow the ending: they cannot rescue a lost war or
  // lift a won one to the top.
  const endingShare = endingPts / 30;
  let batPts = Math.round(20 * endingShare * 0.7 * 10) / 10;
  let fact = "No battle was fought";
  if (i.battles.length) {
    const weights = i.battles.map((b) => (b.staff ? 0.85 : 1));
    const avg = i.battles.reduce((a, b, k) => a + (GRADE_POINTS[b.grade] ?? 0.35) * weights[k], 0) / i.battles.length;
    batPts = Math.round(20 * avg * 10) / 10;
    const wins = i.battles.filter((b) => b.grade === "clean" || b.grade === "costly").length;
    const staffN = i.battles.filter((b) => b.staff).length;
    fact = `Won ${wins} of ${i.battles.length} ${i.battles.length === 1 ? "battle" : "battles"}${staffN ? `, ${staffN} planned by the staff` : ""}`;
  }
  parts.push({ id: "battles", label: "The battles", points: batPts, max: 20, word: word(batPts, 20), fact });

  let judgePts = Math.round(20 * endingShare * 0.7 * 10) / 10;
  let judgeFact = "No decision could be set against the record";
  if (i.judged.length) {
    const each = i.judged.map((e) => (e.sum > e.histSum ? 1 : e.sum === e.histSum ? 0.6 : 0.25));
    judgePts = Math.round(20 * (each.reduce((a, v) => a + v, 0) / each.length) * 10) / 10;
    const out = i.judged.filter((e) => e.sum > e.histSum).length;
    judgeFact = `Out-positioned the historical choice at ${out} of ${i.judged.length} decisions`;
  }
  parts.push({ id: "judgement", label: "Judgement against history", points: judgePts, max: 20, word: word(judgePts, 20), fact: judgeFact });

  const objPts = Math.min(10, i.objectives * 3);
  parts.push({
    id: "objectives",
    label: "Objectives",
    points: objPts,
    max: 10,
    word: word(objPts, 10),
    fact: i.objectives === 0 ? "None achieved" : `${i.objectives} achieved`,
  });

  const modeAdj = i.mode === "easy" ? -8 : i.mode === "open" ? 0 : 6;
  const score = Math.round(Math.max(0, Math.min(100, parts.reduce((a, p) => a + p.points, 0) + modeAdj)));
  let rankIndex = 0;
  for (let k = 0; k < RANK_FROM.length; k++) if (score >= RANK_FROM[k]) rankIndex = k;
  let capped: string | null = null;
  if (i.removed && rankIndex > 3) {
    rankIndex = 3;
    capped = "Removed from command, which holds the rank at Lieutenant.";
  } else if (i.mode === "easy" && rankIndex > 6) {
    rankIndex = 6;
    capped = "Played with the training wheels on, which holds the rank at Colonel.";
  }
  return { score, rank: COMMAND_RANKS[rankIndex], rankIndex, parts, capped };
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
  /** Set only for a battle-resolved choice: the weights actually rolled, the pre-bonus weights, the plan costs. */
  battle: { weights: number[]; baseWeights: number[]; planCosts: PlanCosts | null } | null;
  /** True if the choice rolled dice (the caller plays the dice sound). */
  rolled: boolean;
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
  subgame?: SubgamePayload;
  planCostsFor?: (ri: number | null) => PlanCosts | null;
}): ChoiceResult | null {
  const { stage, index, mode, rand } = args;
  const choice = stage.choices[index];
  if (mode === "iron" && choice.favor && choice.favor > args.favor) return null;
  const favor = mode === "iron" && choice.favor ? args.favor - choice.favor : args.favor;

  const subgame = args.subgame;
  const isSubgameResolution = subgame !== undefined;
  const subgameBonus = subgame?.bonus ?? 0;
  let rollIndex: number | null = null;
  let resolvedWeights: number[] | null = null;
  let baseWeights: number[] | null = null;
  if (choice.uncertain) {
    let weights = choice.uncertain.map((u) => u.weight);
    baseWeights = weights.slice();
    if (isSubgameResolution && subgameBonus) weights = subgameWeights(weights, subgameBonus);
    if (isSubgameResolution) resolvedWeights = weights;
    rollIndex = pickWeighted(weights, rand(), ROLL);
  }
  const eff = effectiveChoice(choice, rollIndex);
  const planCosts = resolvedWeights && subgame && subgame.finalAllocation && args.planCostsFor ? args.planCostsFor(rollIndex) : null;

  let flags: Flags = { ...args.flags };
  if (choice.setFlags) flags = { ...flags, ...choice.setFlags };
  if (choice.uncertain && rollIndex != null && choice.uncertain[rollIndex].setFlags) {
    flags = { ...flags, ...choice.uncertain[rollIndex].setFlags };
  }
  // How a battle was fought, and how well (the plan's grade), carry into later node text.
  if (subgame && subgame.flagsOut) flags = { ...flags, ...subgame.flagsOut };
  if (planCosts && planCosts.grade && choice.keyBattleSubgame) flags = { ...flags, [`${choice.keyBattleSubgame.id}Grade`]: planCosts.grade };
  // The reading of each meter this choice's impact fell on (see METER_STRANDS).
  for (const mk of ["readiness", "pipeline", "initiative"] as const) {
    const delta = eff.impact ? eff.impact[mk] || 0 : 0;
    if (!delta) continue;
    const strand = METER_STRANDS[mk].find((x) => x.id === strandOf(mk, choice, eff.outcome));
    if (strand) flags = { ...flags, [strand.flag]: (Number(flags[strand.flag]) || 0) + delta };
  }
  // Hard-mode ceilings are a hard stop: hitting the cap is itself the event.
  flags = applyCeilings(mode, flags, CEILINGS);
  // Inert in the Pacific game (no mode sets choice.favor), inherited from the Europe file.
  let defiance = args.defiance;
  if (mode === "iron" && choice.favor) {
    defiance = args.defiance + 1;
    if (defiance >= 5 && !flags.dismissed) flags = { ...flags, dismissed: true };
  }

  // One clamp on the sum of the choice's impact and the battle plan's cost. A battle may not charge the same fault twice: where the
  // outcome itself already costs a meter two points or more, the plan's own charge on that meter is held to one.
  let impact: Impact | undefined = eff.impact;
  if (planCosts) {
    const imp = eff.impact || {};
    const plan = planCosts.totals;
    const stacked = (outcome: number, charge: number) => (outcome <= -2 ? Math.max(charge, -1) : charge);
    impact = {
      readiness: (imp.readiness || 0) + stacked(imp.readiness || 0, plan.readiness || 0),
      pipeline: (imp.pipeline || 0) + stacked(imp.pipeline || 0, plan.pipeline || 0),
      initiative: (imp.initiative || 0) + stacked(imp.initiative || 0, plan.initiative || 0),
    };
  }
  return {
    favor,
    defiance,
    flags,
    meters: applyImpact(args.meters, impact),
    rollIndex,
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
