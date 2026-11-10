/**
 * Pure run logic for the Pacific commands of Dispatches WW2 (Dispatches 1941's rules, meters renamed to 1940's keys: Readiness is manpower, Pipeline is fuel), extracted from the React component so it can be
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
  manpower: number;
  fuel: number;
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
  gateCheck?: { meter?: string; threshold?: number; label?: string };
  checkLabel?: string;
  concealRoll?: boolean;
  strain?: Strain;
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

/**
 * A state-driven special event: a piece of context that the state of the file brings to a headquarters between two reports (a shortage,
 * a change of government, the first of a new weapon). It is not a decision and changes no meter. It is shown once, on its own screen, before
 * the first report whose date starts inside its window, if `when` holds for the file's state. The flag `ev_<id>` records that it was shown.
 */
export interface StateEvent {
  id: string;
  campaign: string;
  kind: string;
  /** A report inside the window, for the audit (tools/check-events.mjs) and the claims register. */
  anchor: string;
  /** The window, as "YYYY-MM", compared with the month a report's date starts in. */
  from: string;
  to: string;
  /** The date shown on the screen. */
  date: string;
  title: string;
  paras: string[];
  when: (flags: Flags, meters: Meters) => boolean;
}

export const STATE_EVENT_FLAG_PREFIX = "ev_";

const REPORT_MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

/**
 * The month a report's date starts in, as "YYYY-MM": "SEPTEMBER 1940" is 1940-09, "JUNE – JULY 1942" is 1942-06, "1943 – 1944" is 1943-01,
 * "LATE 1944" is 1944-01 (a date with no month is taken from the start of the year, so a window is never entered early by it). Null when the
 * date holds no year.
 */
export function reportStartMonth(date: string | undefined): string | null {
  if (typeof date !== "string") return null;
  const year = date.match(/(19\d{2})/);
  if (!year) return null;
  const month = date.toUpperCase().match(/JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC/);
  const mm = String((month ? REPORT_MONTHS.indexOf(month[0]) : 0) + 1).padStart(2, "0");
  return `${year[1]}-${mm}`;
}

/** The first event of the command, in list order, that has not been shown, whose window holds the report's start and whose condition holds. */
export function dueStateEvent(args: {
  campaignId: string;
  events: StateEvent[];
  nextDate: string | undefined;
  flags: Flags;
  meters: Meters;
}): StateEvent | null {
  const resignation = resignationEvent(args.flags, args.campaignId);
  if (resignation) return resignation;
  const start = reportStartMonth(args.nextDate);
  if (!start) return null;
  for (const e of args.events) {
    if (e.campaign !== args.campaignId || args.flags[STATE_EVENT_FLAG_PREFIX + e.id]) continue;
    if (start < e.from || start > e.to) continue;
    if (e.when(args.flags, args.meters)) return e;
  }
  return null;
}

// ---------- Advisers and trust ----------
// Each adviser who argues an order has a standing with the player, kept as a number of half-points in the flag tr_<name>: an order that
// follows the adviser earns two (a point), and every adviser whose order was passed over loses one (half a point), once for a decision.
// An adviser who has been overruled to -4 half-points (-2) goes quiet and the argument is no longer shown; at the floor the adviser asks to be
// relieved, once, and is gone for the rest of the file. An adviser trusted to +4 or more is marked, and brings a reconnaissance pass before a
// battle at no cost. Ported from Dispatches 1940.
export const TRUST_MIN = -6;
export const TRUST_MAX = 6;
export const TRUST_QUIET_AT = -4;
export const TRUST_TRUSTED_AT = 4;
export type Standing = "trusted" | "heard" | "quiet" | "gone";

const slugOf = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
export const trustKey = (name: string) => `tr_${slugOf(name)}`;
const goneKey = (name: string) => `trgone_${slugOf(name)}`;
const nameKey = (name: string) => `trn_${slugOf(name)}`;

/** The adviser's standing in half-points, from -6 to +6. */
export function trustOf(flags: Flags, name: string): number {
  return Number(flags[trustKey(name)]) || 0;
}

export function adviserStanding(flags: Flags, name: string): Standing {
  if (flags[goneKey(name)]) return "gone";
  const t = trustOf(flags, name);
  if (t <= TRUST_QUIET_AT) return "quiet";
  if (t >= TRUST_TRUSTED_AT) return "trusted";
  return "heard";
}

/** The advisers on this decision, once each, whose orders the player could have given. */
export function advisersOn(stage: Stage): string[] {
  const seen: string[] = [];
  for (const c of stage.choices) if (c.advisor && !c.disabledReason && !seen.includes(c.advisor.name)) seen.push(c.advisor.name);
  return seen;
}

/** The flags after the player gives the order at `index`: the adviser it follows gains, the others on the decision lose. */
export function trustAfter(flags: Flags, stage: Stage, index: number): Flags {
  const chosen = stage.choices[index] && stage.choices[index].advisor ? stage.choices[index].advisor!.name : null;
  let out = flags;
  for (const name of advisersOn(stage)) {
    if (out[goneKey(name)]) continue;
    const next = Math.max(TRUST_MIN, Math.min(TRUST_MAX, trustOf(out, name) + (name === chosen ? 2 : -1)));
    out = { ...out, [trustKey(name)]: next, [nameKey(name)]: name };
    if (next <= TRUST_MIN) out = { ...out, [goneKey(name)]: name };
  }
  return out;
}

/** Names of the advisers the player trusts, in the order they were first heard. */
export function trustedAdvisers(flags: Flags): string[] {
  return Object.keys(flags)
    .filter((k) => k.startsWith("tr_") && !flags[`trgone_${k.slice(3)}`] && Number(flags[k]) >= TRUST_TRUSTED_AT)
    .map((k) => String(flags[`trn_${k.slice(3)}`] || k.slice(3)));
}

/** An adviser who has asked to be relieved and has not yet been seen to go: a state event that the file writes for itself. */
export function resignationEvent(flags: Flags, campaignId: string): StateEvent | null {
  for (const [k, v] of Object.entries(flags)) {
    if (!k.startsWith("trgone_") || typeof v !== "string") continue;
    const id = `resigns_${k.slice(7)}`;
    if (flags[STATE_EVENT_FLAG_PREFIX + id]) continue;
    return {
      id,
      campaign: campaignId,
      kind: "The staff",
      anchor: "",
      from: "",
      to: "",
      date: "",
      title: `${v} asks to be relieved`,
      paras: [
        `${v} has put in a request to leave the staff. The orders you have given have passed over ${v}'s advice too often, and ${v} will not go on arguing a case that is not heard.`,
        `The request is granted. ${v}'s advice will not be put to you again, and the orders ${v} would have argued will have to stand on their own.`,
      ],
      when: () => true,
    };
  }
  return null;
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

export const EMPTY_METERS: Meters = { manpower: 0, fuel: 0, initiative: 0 };
export const METER_MIN = -10;
export const METER_MAX = 10;

export const clampMeter = (n: number): number => Math.max(METER_MIN, Math.min(METER_MAX, n));

// 1941's rules for the engine's campaign primitives.
const AXES: AxisSpec[] = (["manpower", "fuel", "initiative"] as const).map((key) => ({ key, min: METER_MIN, max: METER_MAX }));
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

/** Doctrine selection clamps manpower/fuel but (as shipped) not initiative. */
export function applyDoctrineImpact(meters: Meters, impact: Impact): Meters {
  return {
    manpower: clampMeter(meters.manpower + (impact.manpower || 0)),
    fuel: clampMeter(meters.fuel + (impact.fuel || 0)),
    initiative: meters.initiative + (impact.initiative || 0),
  };
}

// ---------- Arrears and strain ----------
// A meter stops at -10, so a long run of costs once the meter is already there used to vanish: the player could pile up ten points of debt, make
// one good decision and see the meter read -9. Arrears keep the debt. Whatever a decision takes from a meter below -10 is owed (up to ARREARS_CAP),
// and the next gains on that meter pay the debt before they raise it. They live in the flags, so saves and rewinds carry them.
export const ARREARS_CAP = 3;
export const ARREARS_FLAGS: Record<keyof Meters, string> = { manpower: "arrearsReadiness", fuel: "arrearsPipeline", initiative: "arrearsInitiative" };
export function arrearsOf(flags: Flags, meter: keyof Meters): number {
  return Math.max(0, Number(flags[ARREARS_FLAGS[meter]]) || 0);
}

// Strain: shortages change the odds. A meter below -4 takes points of probability off the best outcome of the contested decisions that put that
// meter at stake (not battles, which weigh their own shortages), and each point owed on it adds half a point more. Shown on the decision itself, so
// the player sees what the shortage is costing before choosing.
export interface Strain {
  points: number;
  causes: string[];
}
const STRAIN_MAX = 12;
const METER_LABELS: Record<keyof Meters, string> = { manpower: "Manpower", fuel: "Matériel", initiative: "Initiative" };
const CHECK_LABEL_METER: Record<string, keyof Meters> = { Readiness: "manpower", Pipeline: "fuel", Initiative: "initiative" };
const METER_KEYS: (keyof Meters)[] = ["manpower", "fuel", "initiative"];

/** The meter a contested choice puts at stake: the one its check names, else the one its outcomes move most. */
export function strainMeterOf(choice: Choice): keyof Meters | null {
  const label = (choice.gateCheck && choice.gateCheck.label) || choice.checkLabel;
  const named = label ? CHECK_LABEL_METER[label] : undefined;
  if (named) return named;
  const impacts = choice.uncertain && choice.uncertain.length ? choice.uncertain.map((u) => u.impact || choice.impact) : [choice.impact];
  const moved: Record<keyof Meters, number> = { manpower: 0, fuel: 0, initiative: 0 };
  for (const imp of impacts) for (const k of METER_KEYS) moved[k] += Math.abs((imp && imp[k]) || 0);
  const best = METER_KEYS.reduce((a, k) => (moved[k] > moved[a] ? k : a));
  return moved[best] > 0 ? best : null;
}

/** The strain on a decision. With `meter` it is the shortage of that meter alone (and what is owed on it); without, of all three. */
export function strainOf(flags: Flags, meters: Meters, meter?: keyof Meters | null): Strain {
  const lack = (v: number) => Math.max(0, -v - 4);
  const keys: (keyof Meters)[] = meter ? [meter] : METER_KEYS;
  const owed = keys.reduce((a, k) => a + arrearsOf(flags, k), 0);
  const raw = keys.reduce((a, k) => a + lack(meters[k]) * (k === "initiative" ? 0.6 : 1.2), 0) + owed * 0.5;
  const causes = keys.filter((k) => meters[k] <= -5 || arrearsOf(flags, k) > 0).map((k) => METER_LABELS[k]);
  return { points: Math.min(STRAIN_MAX, Math.round(raw)), causes };
}

/**
 * The stage with the odds of its contested choices worsened by strain: probability moves from the choice's best outcome (by the sum of its meter
 * impact) to its worst. Choices that open an Order of Battle keep their own arithmetic, and a choice whose outcomes cost the same is left alone.
 * The result is what the player is shown and what is rolled, so the two can never disagree.
 */
export function strainStage<T extends Stage | null | undefined>(stage: T, flags: Flags, meters: Meters): T {
  if (!stage || !stage.choices) return stage;
  const choices = stage.choices.map((choice): Choice => {
    const u = choice.uncertain;
    if (!u || u.length < 2 || choice.keyBattleSubgame) return choice;
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
    return { ...choice, uncertain, strain };
  });
  return { ...stage, choices } as T;
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
  manpower: READINESS_STRANDS,
  fuel: PIPELINE_STRANDS,
  initiative: INITIATIVE_STRANDS,
};

/** Where an impact on a meter lands when its text names none of the meter's readings. */
const STRAND_FALLBACK: Record<MeterKey, string> = { manpower: "flt", fuel: "shp", initiative: "tmp" };

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
  return (impact.manpower || 0) + (impact.fuel || 0) + (impact.initiative || 0);
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
  // Who was heard: the adviser the order follows gains trust, the others on the decision lose a little.
  flags = trustAfter(flags, stage, index);
  // How a battle was fought, and how well (the plan's grade), carry into later node text.
  if (subgame && subgame.flagsOut) flags = { ...flags, ...subgame.flagsOut };
  if (planCosts && planCosts.grade && choice.keyBattleSubgame) flags = { ...flags, [`${choice.keyBattleSubgame.id}Grade`]: planCosts.grade };
  // The reading of each meter this choice's impact fell on (see METER_STRANDS).
  for (const mk of ["manpower", "fuel", "initiative"] as const) {
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
      manpower: (imp.manpower || 0) + stacked(imp.manpower || 0, plan.manpower || 0),
      fuel: (imp.fuel || 0) + stacked(imp.fuel || 0, plan.fuel || 0),
      initiative: (imp.initiative || 0) + stacked(imp.initiative || 0, plan.initiative || 0),
    };
  }
  // Arrears: gains pay what is owed on a meter before they raise it, and what a cost takes below the floor is owed.
  let meters = args.meters;
  if (impact) {
    const settled: Meters = { manpower: impact.manpower || 0, fuel: impact.fuel || 0, initiative: impact.initiative || 0 };
    for (const mk of METER_KEYS) {
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
    meters = applyImpact(args.meters, settled);
  }
  return {
    favor,
    defiance,
    flags,
    meters,
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
  stateEvent: StateEvent | null;
}

/**
 * Decides which interstitial (if any) shows on arriving at nextPos: a Historical
 * Divergence reveal comes first, then a SPECIAL_EVENTS entry keyed to the node just left, then the
 * next briefing. A state-driven event the file has earned (STATE_EVENTS, one at a time) is returned
 * beside them: it takes the arrival when nothing else does, and otherwise follows the screen that did.
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
  /** State-driven events, with the date of the report being arrived at and the state on arrival. Omitted: none can fire. */
  stateEvents?: StateEvent[];
  nextDate?: string;
  meters?: Meters;
}): Arrival {
  const { dynamic, campaignId, flags } = args;
  const stateEvent =
    dynamic && args.stateEvents && args.meters
      ? dueStateEvent({ campaignId, events: args.stateEvents, nextDate: args.nextDate, flags, meters: args.meters })
      : null;
  const fork = dynamic
    ? (args.forks[campaignId] || []).find(
        (fk) => fk.revealNode === String(args.nextPos) && flags[fk.flag] && !args.seenReveals.includes(fk.id)
      )
    : null;
  const event = dynamic
    ? (args.events[campaignId] || []).find((e) => e.afterNode === args.position && (!e.condition || e.condition(flags)))
    : null;
  if (fork) return { screen: "divergence", divergenceForkId: fork.id, pressEvent: null, stateEvent };
  if (event) {
    return { screen: event.type, divergenceForkId: null, pressEvent: event.type === "press" ? event.pressEvent : null, stateEvent };
  }
  return { screen: stateEvent ? "stateEvent" : "briefing", divergenceForkId: null, pressEvent: null, stateEvent };
}
