/**
 * The rules a run plays by. Dispatches WW2 joins two games whose rules differ in detail: the European commands
 * (German, Soviet, Allied, Italian) keep Dispatches 1940's rules (`./logic`), and the Pacific commands (Japanese,
 * Allied Pacific) keep Dispatches 1941's (`./logic-pacific`, with 1941's Readiness and Pipeline renamed to
 * Manpower and Matériel). Each command therefore plays exactly as it did in its own game, and the two can be brought
 * together one rule at a time later, with the UI baseline as the proof of each step.
 *
 * App.jsx imports everything from here instead of from `./logic`. `selectRules(campaignId)` picks the rules; the
 * app calls it whenever the command is set (a new file, a resumed save, the war room). The tables exported as `let`
 * are ES module live bindings, so every importer sees the switch.
 */
import * as europe from "./logic";
import * as pacific from "./logic-pacific";

/** Commands whose reports are drawn on the Pacific map (1941's map layer, PACIFIC_MAP). */
export const PACIFIC_COMMANDS: readonly string[] = ["japan", "alliedPacific"];
/** Commands that play by 1941's rules: the Pacific commands, and the American command (most of its reports are CINCPAC's). */
export const PACIFIC_RULES: readonly string[] = ["japan", "alliedPacific", "american"];

type Rules = typeof europe | typeof pacific;
// The two rule modules have the same function shapes (an extra optional argument on one side is ignored by the other),
// so calls go through this untyped handle.
let R: any = europe;
let current = "german";

export let METER_STRANDS: any = europe.METER_STRANDS;
export let MATERIEL_STRANDS: any = europe.MATERIEL_STRANDS;
export let STRAND_ALIAS: Record<string, string> = europe.STRAND_ALIAS;
export let COMMAND_RANKS: any = europe.COMMAND_RANKS;
export const EMPTY_METERS = europe.EMPTY_METERS;

/** The rule set a command plays by. */
export function rulesOf(campaignId: string | null | undefined): Rules {
  return campaignId && PACIFIC_RULES.includes(campaignId) ? pacific : europe;
}

/** Selects the rules for a command. Cheap and idempotent, so it may be called on every render. */
export function selectRules(campaignId: string | null | undefined): void {
  const id = campaignId || "german";
  if (id === current) return;
  current = id;
  const r = rulesOf(id);
  R = r;
  METER_STRANDS = r.METER_STRANDS;
  MATERIEL_STRANDS = r === pacific ? pacific.PIPELINE_STRANDS : europe.MATERIEL_STRANDS;
  STRAND_ALIAS = r === pacific ? {} : europe.STRAND_ALIAS;
  COMMAND_RANKS = r.COMMAND_RANKS;
}

export const impactSum = (...a: any[]) => R.impactSum(...a);
export const effectiveChoice = (...a: any[]) => R.effectiveChoice(...a);
export const playableStage = (...a: any[]) => R.playableStage(...a);
export const startFlags = (...a: any[]) => R.startFlags(...a);
export const resolveChoice = (...a: any[]) => R.resolveChoice(...a);
export const strandOf = (...a: any[]) => R.strandOf(...a);
export const strandReadout = (...a: any[]) => R.strandReadout(...a);
export const commandRating = (...a: any[]) => R.commandRating(...a);
export const endingCeiling = (...a: any[]) => R.endingCeiling(...a);
export const arrearsOf = (...a: any[]) => R.arrearsOf(...a);
export const strainStage = (...a: any[]) => R.strainStage(...a);
export const strainOf = (...a: any[]) => R.strainOf(...a);
export const buildLogEntry = (...a: any[]) => R.buildLogEntry(...a);
export const nextPosition = (...a: any[]) => R.nextPosition(...a);
export const nextVisited = (...a: any[]) => R.nextVisited(...a);
export const adviserStanding = (...a: any[]) => R.adviserStanding(...a);
export const trustedAdvisers = (...a: any[]) => R.trustedAdvisers(...a);

/** The Matériel readings: 1940's helper, or the general one for the Pacific rules (which have no Matériel-specific helper). */
export const materielReadout = (flags: any, meters: any) => (R === pacific ? pacific.strandReadout("fuel", flags, meters) : europe.materielReadout(flags, meters));
export const materielStrandOf = (choice: any, outcomeText?: string) => (R === pacific ? pacific.strandOf("fuel", choice, outcomeText) : europe.materielStrandOf(choice, outcomeText));

// The wire's divergence reveal and the report-keyed special dispatches are 1940's screens; the Pacific commands use them too
// (1941 showed a divergence on its own screen; here it is a wire headline, as in the European commands).
export const arrivalFork = europe.arrivalFork;
export const dueEvent = europe.dueEvent;
export const eventSeenKey = europe.eventSeenKey;

// 1941's state-driven events (a shortage, a change of government), shown between two reports of a Pacific command.
export const dueStateEvent = pacific.dueStateEvent;
