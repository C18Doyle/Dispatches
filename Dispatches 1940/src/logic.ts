/**
 * Pure run logic for Dispatches 1940, extracted from WW2CommandInner(). No React, no DOM, no
 * storage, no sound, no Math.random (randomness comes in as `rand`). Content (campaigns,
 * divergence forks, battle cost calculators) is passed in, never imported.
 *
 * Meter axes here are manpower / fuel / initiative, all clamped to [-10, 10].
 *
 * The arithmetic (weighted roll, clamped impact, hard-mode ceilings, end flags) is the shared engine's
 * campaign primitives (@dispatches/engine); this file holds only 1940's rules for them, the battle
 * subgame's roll nudge and the screen-flow glue.
 */
import { applyCeilings, applyImpact as engineApplyImpact, endsRun, pickWeighted as enginePickWeighted } from "@dispatches/engine";
import type { AxisSpec, Ceiling, EndFlag, RollRule } from "@dispatches/engine";

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
  /** Optional explicit strand of Matériel this choice's impact falls on; otherwise read from the text (see strandOf). */
  matStrand?: string;
  /** The meter the choice is checked against ("Manpower", "Matériel" or "Initiative"), where it names one. */
  checkLabel?: string;
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

// 1940's rules for the engine's campaign primitives.
const AXIS_SPECS: AxisSpec[] = AXES.map((key) => ({ key, min: METER_MIN, max: METER_MAX }));
const ROLL: RollRule = { scale: "total", fallback: "first" };
const CEILINGS: Ceiling[] = [
  { mode: "purge", flag: "suspicion", op: "gte", threshold: 5, unless: "purged", set: { purged: true, purgedAt: "suspicionCeiling" } },
  { mode: "coalition", flag: "cohesion", op: "lte", threshold: -6, unless: "relieved", set: { relieved: true } },
  { mode: "axis", flag: "trust", op: "lte", threshold: -5, unless: "superseded", set: { superseded: true } },
];
const END_FLAGS: EndFlag[] = [
  { mode: "purge", flag: "purged" },
  { mode: "coalition", flag: "relieved" },
  { mode: "iron", flag: "dismissed" },
  { mode: "axis", flag: "superseded" },
];

export const clampMeter = (n: number): number => Math.max(METER_MIN, Math.min(METER_MAX, n));

export function impactSum(impact: Impact | undefined): number {
  if (!impact) return 0;
  return (impact.manpower || 0) + (impact.fuel || 0) + (impact.initiative || 0);
}

// Each of the three meters is one number that the rules use. Under each sit micro-states the player can read:
// where the choices they made put the weight. Matériel (whose key is still `fuel`, so old saves keep working)
// has three strands (Fuel & Oil, Arms & Ammunition, Shipping & Rail); Manpower has Organisation, Experience and
// Readiness; Initiative has Intelligence, Command and Tempo. Every meter has exactly three, so the panel is the same
// shape under each. A micro-state's band is the headline score plus how far its own running tally has drifted from the
// average of its meter's tallies. The tally is kept in flags (so saves and rewinds carry it) and is fed by each
// choice's impact on that meter, filed to a micro-state by what the choice's text is about (or by `matStrand`
// for Matériel). Five bands, worst first; the worst is reserved for a meter at -8 or below.
export type MeterKey = keyof Meters;

export interface StrandDef {
  id: string;
  flag: string;
  name: string;
  words: RegExp;
  /** Older save flags whose tallies count toward this strand (a strand that absorbed two earlier ones). */
  legacy?: readonly string[];
  /** Band words, worst first: [critical, short, strained, adequate, plentiful]. */
  bands: readonly [string, string, string, string, string];
}

export const MATERIEL_STRANDS: readonly StrandDef[] = [
  { id: "oil", flag: "matOil", name: "Fuel & Oil", bands: ["Exhausted", "Short", "Strained", "Adequate", "Plentiful"], words: /\b(fuel|oil|oilfields?|petrol|gasoline|tankers?|refiner(?:y|ies)|synthetic|aviation spirit|ploesti|baku|maikop|coal)\b/gi },
  { id: "arms", flag: "matArms", legacy: ["matAmmo", "matSteel"], name: "Arms & Ammunition", bands: ["Exhausted", "Short", "Strained", "Adequate", "Plentiful"], words: /\b(ammunition|shells?|munitions|artillery|ordnance|rounds|bombs?|torpedoes|steel|tanks?|panzers?|armou?r(?:ed)?|production|factor(?:y|ies)|industr(?:y|ial)|armaments?|arms|weapons?|output|tungsten|wolfram|rearmw*|equipment|aircraft)\b/gi },
  { id: "ship", flag: "matShip", name: "Shipping & Rail", bands: ["Exhausted", "Short", "Strained", "Adequate", "Plentiful"], words: /\b(shipping|convoys?|rail(?:way|ways|road)?|ports?|tonnage|transport|lend-lease|logistics?|supplies|supply|merchant|trains?|locomotives?|lifeline|ships?)\b/gi },
];

export const MANPOWER_STRANDS: readonly StrandDef[] = [
  { id: "org", flag: "manOrg", name: "Organisation", bands: ["Shattered", "Disordered", "Strained", "Sound", "Tight"], words: /\b(reorgani[sz]\w*|restructur\w*|regroup\w*|reform(?:ed|ing)?|consolidat\w*|amalgamat\w*|merg(?:e|ed|es|ing)|disband\w*|cohesi\w+|discipline|order of battle|encircle\w*|pockets?|rout\w*|collaps\w*|frontage|fortress\w*)\b/gi },
  { id: "exp", flag: "manExp", name: "Experience", bands: ["Raw recruits", "Green", "Thin", "Seasoned", "Veteran"], words: /\b(veterans?|experienced?|trained|training|trainers?|instructors?|schools?|academy|cadres?|officers?|officer corps|ncos?|conscripts?|recruits?|volunteers?|draftees?|skilled|elite|paratroop\w*|airborne|mountain troops|specialists?|purg(?:e|ed|es|ing)|dismiss\w*|generals?|marshals?|commanders?|leadership|staff college)\b/gi },
  { id: "rdy", flag: "manRdy", name: "Readiness", bands: ["Spent", "Exhausted", "Worn", "Ready", "Fresh"], words: /\b(rest(?:ed|ing)?|refit\w*|rotat\w*|fatigue\w*|exhaust\w*|winter|clothing|rations?|health|sick\w*|disease|leave|replacements?|reinforce\w*|reserves?|fresh|reliev\w*|casualt\w*|losses|wounded|attrition|manpower|strength|understrength|depleted)\b/gi },
];

export const INITIATIVE_STRANDS: readonly StrandDef[] = [
  { id: "int", flag: "iniInt", name: "Intelligence", bands: ["Blind", "Poor", "Patchy", "Clear", "Penetrating"], words: /\b(intelligence|reconnaissance|recon|spy|spies|agents?|ultra|enigma|ciphers?|decrypt\w*|intercepts?|signals?|observation|scout\w*|informants?|abwehr|gehlen|estimates?|assessments?|warnings?|deception|maskirovka|espionage|codebreak\w*|aerial photograph\w*|radar)\b/gi },
  { id: "cmd", flag: "iniCmd", name: "Command", bands: ["Paralysed", "Divided", "Uncertain", "Steady", "Decisive"], words: /\b(command\w*|directives?|authority|orders?|f[uü]hrer|hitler|stavka|okw|okh|shaef|comando supremo|coordinat\w*|coalition|alliance|allies|allied|diplomat\w*|negotiat\w*|overrul\w*|dismiss\w*|appoint\w*|relieved of|unified|political|agreement|treaty|armistice|council|conference|cabinet)\b/gi },
  { id: "tmp", flag: "iniTmp", name: "Tempo", bands: ["Stalled", "Slow", "Sluggish", "Brisk", "Rapid"], words: /\b(offensives?|attacks?|advance\w*|pursuit|pursue\w*|momentum|speed\w*|rapid\w*|surprise|strikes?|blitz\w*|timetable|schedule\w*|delay\w*|paus\w*|halt\w*|rush\w*|tempo|pace|launch\w*|counteroffensives?|breakthrough|exploit\w*|spearhead\w*)\b/gi },
];

export const METER_STRANDS: Record<MeterKey, readonly StrandDef[]> = {
  manpower: MANPOWER_STRANDS,
  fuel: MATERIEL_STRANDS,
  initiative: INITIATIVE_STRANDS,
};

/** The two Matériel strands that became one: battle arms still name "ammo" or "steel"; both read the Arms & Ammunition strand. */
export const STRAND_ALIAS: Record<string, string> = { ammo: "arms", steel: "arms" };

/** Where an impact on a meter lands when its text names none of the meter's micro-states. Matériel has none: it moves them all. */
const STRAND_FALLBACK: Partial<Record<MeterKey, string>> = { manpower: "rdy", initiative: "tmp" };

/** Which micro-state of `meter` a choice's impact falls on, or null when the text does not say. */
export function strandOf(meter: MeterKey, choice: Choice, outcomeText?: string): string | null {
  if (meter === "fuel" && choice.matStrand) return STRAND_ALIAS[choice.matStrand] || choice.matStrand;
  const text = [choice.label, outcomeText ?? choice.outcome ?? ""].join(" ");
  let best: string | null = null;
  let bestN = 0;
  for (const s of METER_STRANDS[meter]) {
    const n = (text.match(s.words) || []).length;
    if (n > bestN) {
      bestN = n;
      best = s.id;
    }
  }
  return best ?? STRAND_FALLBACK[meter] ?? null;
}

/** Which Matériel strand a choice's impact falls on, or null when the text does not say. */
export function materielStrandOf(choice: Choice, outcomeText?: string): string | null {
  return strandOf("fuel", choice, outcomeText);
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
export type MaterielReading = StrandReading;

/** The micro-states of one meter as the staff would put them, from the headline score and the tallies in `flags`. */
export function strandReadout(meter: MeterKey, flags: Flags, meters: Meters): StrandReading[] {
  const defs = METER_STRANDS[meter];
  const tallies = defs.map((s) => (Number(flags[s.flag]) || 0) + (s.legacy || []).reduce((a, k) => a + (Number(flags[k]) || 0), 0));
  const mean = tallies.reduce((a, v) => a + v, 0) / defs.length;
  return defs.map((s, i) => {
    const score = Math.max(METER_MIN, Math.min(METER_MAX, Math.round(meters[meter] + (tallies[i] - mean))));
    const level = score <= -8 ? 0 : score <= -4 ? 1 : score <= -1 ? 2 : score <= 3 ? 3 : 4;
    return { id: s.id, name: s.name, band: s.bands[level], level, score };
  });
}

/** The four Matériel strands. */
export function materielReadout(flags: Flags, meters: Meters): StrandReading[] {
  return strandReadout("fuel", flags, meters);
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
  return enginePickWeighted(weights, u, ROLL);
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
  // The micro-state of each meter this choice's impact fell on (see METER_STRANDS).
  for (const mk of AXES) {
    const delta = eff.impact ? eff.impact[mk] || 0 : 0;
    if (!delta) continue;
    const strand = METER_STRANDS[mk].find((x) => x.id === strandOf(mk, choice, eff.outcome));
    if (strand) flags = { ...flags, [strand.flag]: (Number(flags[strand.flag]) || 0) + delta };
  }
  // Hard-mode ceilings are a hard stop: hitting the cap is itself the event.
  flags = applyCeilings(mode, flags, CEILINGS);
  let defiance = args.defiance;
  if (mode === "iron" && choice.favor) {
    defiance = args.defiance + 1;
    if (defiance >= 5 && !flags.dismissed) flags = { ...flags, dismissed: true };
  }

  let meters = args.meters;
  if (eff.impact || planCosts) {
    const imp = eff.impact || {};
    const plan = planCosts ? planCosts.totals : EMPTY_METERS;
    // One clamp on the sum of the choice's impact and the battle plan's cost.
    // A battle may not charge the same fault twice: where the outcome itself already costs a meter two points or
    // more, the plan's own charge on that meter is held to one.
    const stacked = (outcome: number, charge: number) => (outcome <= -2 ? Math.max(charge, -1) : charge);
    const total = {
      manpower: (imp.manpower || 0) + stacked(imp.manpower || 0, plan.manpower),
      fuel: (imp.fuel || 0) + stacked(imp.fuel || 0, plan.fuel),
      initiative: (imp.initiative || 0) + stacked(imp.initiative || 0, plan.initiative),
    };
    // Arrears: gains pay what is owed on a meter before they raise it, and what a cost takes below the floor is owed.
    const settled: Record<MeterKey, number> = { manpower: total.manpower, fuel: total.fuel, initiative: total.initiative };
    for (const mk of AXES) {
      const key = ARREARS_FLAGS[mk];
      const owedBefore = arrearsOf(flags, mk);
      let owed = owedBefore;
      if (settled[mk] > 0 && owed > 0) {
        const pay = Math.min(owed, settled[mk]);
        settled[mk] -= pay;
        owed -= pay;
      }
      const raw = args.meters[mk] + settled[mk];
      if (raw < METER_MIN) owed = Math.min(ARREARS_CAP, owed + (METER_MIN - raw));
      if (owed !== owedBefore) flags = { ...flags, [key]: owed };
    }
    meters = engineApplyImpact(args.meters as unknown as Record<string, number>, settled, AXIS_SPECS) as unknown as Meters;
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

// ---------- Command rank ----------
// A single mark for how the war was commanded, from Private to General. It is built from five things the
// player can see and nothing hidden: how the war ended, the condition the command was left in, how the battles
// went, how the decisions compare with the historical ones, and the objectives earned. Luck in the dice is not
// scored. Being removed from command caps the rank, and the training-wheels mode cannot reach General.
export const COMMAND_RANKS = ["Private", "Corporal", "Sergeant", "Lieutenant", "Captain", "Major", "Colonel", "General"] as const;
const RANK_FROM = [0, 20, 32, 44, 55, 65, 74, 83];

export interface RatingInput {
  /** The ending's tier ("Major Victory" ... "Major Defeat"), or null when it has none. */
  tier: string | null;
  /** The best tier any ending on this run's path can award (see endingCeiling). The ending is scored against it. */
  ceiling?: string | null;
  removed: boolean;
  /** Manpower + Matériel + Initiative at the end. */
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
// The best tier any ending on a command's path can award. The ending is worth 30 of the 100 points, and it is scored
// against this ceiling, so a command whose war could not be won (the Italian co-belligerent path, the Salò Republic,
// a German command) is not held below General by the outcome alone: its best ending earns the full 30. Soviet and
// Allied commands can win outright, so theirs are scored as they stand. `npm run check-endings` fails if any
// ending on a path outranks its ceiling, so the table cannot drift when an ending is added.
export const ENDING_CEILING: Record<string, string> = {
  german: "Minor Victory",
  soviet: "Major Victory",
  allied: "Major Victory",
  "italy:coBelligerent": "Contested Outcome",
  "italy:rsi": "Minor Defeat",
  "italy:neutral": "Minor Victory",
  "italy:coup": "Contested Outcome",
  "italy:other": "Contested Outcome",
};
/** Which path a run is on, for the ceiling: Italy splits at the armistice, the other commands are one path each. */
export function endingCeilingKey(campaignId: string, flags: Record<string, unknown>): string {
  if (campaignId !== "italy") return campaignId;
  if (flags.italyPath === "coBelligerent") return "italy:coBelligerent";
  if (flags.italyPath === "rsi") return "italy:rsi";
  if (flags.italyEntry === "neutral") return "italy:neutral";
  if (flags.coupResponse === "backMussolini") return "italy:coup";
  return "italy:other";
}
export function endingCeiling(campaignId: string, flags: Record<string, unknown>): string {
  return ENDING_CEILING[endingCeilingKey(campaignId, flags)] ?? "Major Victory";
}
const GRADE_POINTS: Record<string, number> = { clean: 1, costly: 0.75, marginal: 0.35, total: 0 };

export function commandRating(i: RatingInput): Rating {
  const word = (p: number, max: number): "Strong" | "Fair" | "Weak" => (p / max >= 0.65 ? "Strong" : p / max < 0.35 ? "Weak" : "Fair");
  const parts: RatingPart[] = [];

  const rawEnding = i.tier && TIER_POINTS[i.tier] != null ? TIER_POINTS[i.tier] : 15;
  const ceilingPts = i.ceiling && TIER_POINTS[i.ceiling] ? TIER_POINTS[i.ceiling] : 30;
  const endingPts = i.removed ? 0 : Math.round(Math.min(30, (30 * rawEnding) / ceilingPts) * 10) / 10;
  let endingFact = i.tier && TIER_FACT[i.tier] ? TIER_FACT[i.tier] : "An ending with no verdict of its own";
  if (ceilingPts < 30 && i.ceiling && i.tier && TIER_FACT[i.tier] && TIER_FACT[i.ceiling]) {
    const best = TIER_FACT[i.ceiling].charAt(0).toLowerCase() + TIER_FACT[i.ceiling].slice(1);
    endingFact = i.tier === i.ceiling ? `${endingFact}, the best ending open to this command` : `${endingFact} (the best ending open to this command is ${best})`;
  }
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

  // With no battle fought, or nothing to set against the record, those parts follow the ending: they cannot rescue a
  // lost war or lift a won one to the top.
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

// ---------- Arrears and strain ----------
// A meter stops at -10, so a long run of costs once the meter is already there used to vanish: the player could pile
// up ten points of debt, make one good decision and see the meter read -9. Arrears keep the debt. Whatever a decision
// takes from a meter below -10 is owed (up to ARREARS_CAP), and the next gains on that meter pay the debt before they
// raise it. They live in the flags, so saves and rewinds carry them.
export const ARREARS_CAP = 3;
export const ARREARS_FLAGS: Record<MeterKey, string> = { manpower: "arrearsManpower", fuel: "arrearsFuel", initiative: "arrearsInitiative" };
export function arrearsOf(flags: Flags, meter: MeterKey): number {
  return Math.max(0, Number(flags[ARREARS_FLAGS[meter]]) || 0);
}

// Strain: shortages change the odds. A meter below -4 takes points of probability off the best outcome of the contested
// decisions that put that meter at stake (not battles, which weigh their own shortages), and each point owed on it adds
// half a point more. Shown on the decision itself, so the player sees what the shortage is costing before choosing.
export interface Strain {
  points: number;
  causes: string[];
}
const STRAIN_MAX = 12;
const METER_LABELS: Record<MeterKey, string> = { manpower: "Manpower", fuel: "Matériel", initiative: "Initiative" };
const CHECK_LABEL_METER: Record<string, MeterKey> = { Manpower: "manpower", Matériel: "fuel", Initiative: "initiative" };

/** The meter a contested choice puts at stake: the one its check label names, else the one its outcomes move most. */
export function strainMeterOf(choice: Choice): MeterKey | null {
  const named = choice.checkLabel ? CHECK_LABEL_METER[choice.checkLabel] : undefined;
  if (named) return named;
  const impacts = choice.uncertain && choice.uncertain.length ? choice.uncertain.map((u) => u.impact || choice.impact) : [choice.impact];
  const moved: Record<MeterKey, number> = { manpower: 0, fuel: 0, initiative: 0 };
  for (const imp of impacts) for (const k of AXES) moved[k] += Math.abs((imp && imp[k]) || 0);
  const best = AXES.reduce((a, k) => (moved[k] > moved[a] ? k : a));
  return moved[best] > 0 ? best : null;
}

/** The strain on a decision. With `meter` it is the shortage of that meter alone (and what is owed on it); without, of all three. */
export function strainOf(flags: Flags, meters: Meters, meter?: MeterKey | null): Strain {
  const lack = (v: number) => Math.max(0, -v - 4);
  const keys: MeterKey[] = meter ? [meter] : ["manpower", "fuel", "initiative"];
  const owed = keys.reduce((a, k) => a + arrearsOf(flags, k), 0);
  const raw = keys.reduce((a, k) => a + lack(meters[k]) * (k === "initiative" ? 0.6 : 1.2), 0) + owed * 0.5;
  const causes = keys.filter((k) => meters[k] <= -5 || arrearsOf(flags, k) > 0).map((k) => METER_LABELS[k]);
  return { points: Math.min(STRAIN_MAX, Math.round(raw)), causes };
}

export interface StrainedChoice extends Choice {
  strain?: Strain;
}

/**
 * The stage with the odds of its contested choices worsened by strain: probability moves from the choice's best
 * outcome (by the sum of its meter impact) to its worst. Choices that open an Order of Battle keep their own
 * arithmetic, and a choice whose outcomes cost the same is left alone. The result is what the player is shown and what
 * is rolled, so the two can never disagree. When the player has left the battles to the game (`planBattles` false) a battle choice is
 * an ordinary contested choice, so it is strained like one.
 */
export function strainStage<T extends Stage | null | undefined>(stage: T, flags: Flags, meters: Meters, planBattles = true): T {
  if (!stage || !stage.choices) return stage;
  const choices = stage.choices.map((choice): Choice => {
    const u = choice.uncertain;
    if (!u || u.length < 2 || (planBattles && choice.keyBattleSubgame)) return choice;
    // Round 27: the strain on a decision is the shortage of the meter that decision is about, not of whichever meter is lowest.
    const strain = strainOf(flags, meters, strainMeterOf(choice));
    if (!strain.points) return choice;
    const sums = u.map((v) => impactSum(v.impact || choice.impact));
    const best = sums.indexOf(Math.max(...sums));
    const worst = sums.indexOf(Math.min(...sums));
    if (best === worst || sums[best] === sums[worst]) return choice;
    const total = u.reduce((a, v) => a + v.weight, 0);
    const moved = Math.min(u[best].weight - total * 0.05, (total * strain.points) / 100);
    if (moved <= 0) return choice;
    const uncertain = u.map((v, i) => (i === best ? { ...v, weight: v.weight - moved } : i === worst ? { ...v, weight: v.weight + moved } : v));
    return { ...choice, uncertain, strain } as StrainedChoice;
  });
  return { ...stage, choices } as T;
}
