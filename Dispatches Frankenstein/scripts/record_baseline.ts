/**
 * Records the LEGACY engine's behaviour as a fixture. Run once, before the
 * refactor lands; the fixture is then the contract the new reducer must meet.
 *   npx tsx scripts/record_baseline.ts
 * Needs legacy src/engine.ts + src/data.ts (still in git history after they are removed).
 */
import { writeFileSync } from "node:fs";
import { reducer, initialState, resolveEndingText, isOptionUnavailable } from "../src/engine";
import { NODES, getFritzGossip, getFritzCreatureReport } from "../src/data";
import type { GameState } from "../src/types";
import { hashProjection, makeRng, type Baseline, type Projection, type RecordedAction, type RecordedRun } from "./lib/projection";

const RUNS = 240;
const MAX_STEPS = 600;

const SCREEN_TO_PHASE: Record<string, string> = { EXPERIMENT: "ROLL", NEWSPAPER: "INTERLUDE" };

function lineSet(fn: (s: GameState) => string, s: GameState): string[] {
  const seen = new Set<string>();
  const saved = Math.random;
  for (let i = 0; i < 100; i++) {
    Math.random = () => (i + 0.5) / 100;
    seen.add(fn(s));
  }
  Math.random = saved;
  return [...seen].sort();
}

function project(s: GameState): Projection {
  const onNode = s.screen === "NODE";
  const onEnding = s.screen === "ENDING";
  return {
    phase: SCREEN_TO_PHASE[s.screen] ?? s.screen,
    difficulty: s.difficulty,
    money: s.money,
    currentNodeId: s.currentNodeId,
    activeBranch: s.activeBranch,
    resources: { ...s.resources },
    axes: { voice: s.temperament.voice, bond: s.temperament.bond },
    flags: Object.keys(s.flags).filter((k) => s.flags[k]).sort(),
    activeInterludeId: s.activeNewspaper?.id ?? null,
    pendingTarget: s.pendingAfterNewspaper,
    pendingOutcomeText: s.pendingOutcomeText,
    pendingOutcomeKind: s.pendingOutcomeKind,
    pendingOutcomeStamps: s.pendingOutcomeStamps as Record<string, number> | null,
    pendingRoll: s.pendingRoll,
    pendingOptionLabel: s.pendingOptionLabel,
    pendingOptionQuote: s.pendingOptionQuote,
    shownCrises: [...s.shownCrises],
    shownOneShot: [...s.shownOneShot],
    endingId: s.endingId,
    history: s.history.map((h) => ({ ...h })),
    adviceUsesLeft: s.fritzAdviceUsesLeft,
    adviceRevealed: s.fritzAdviceRevealed,
    favorUsed: s.fritzFavorUsed,
    ending: onEnding ? resolveEndingText(s) : null,
    gossipPool: onNode ? lineSet(getFritzGossip, s) : null,
    reportPool: onNode ? lineSet(getFritzCreatureReport, s) : null,
  };
}

/** Recorded action (new vocabulary) -> legacy action. */
function toLegacy(a: RecordedAction): Parameters<typeof reducer>[1] {
  switch (a.type) {
    case "DISMISS_INTERLUDE":
      return { type: "DISMISS_NEWSPAPER" };
    case "ASK_ADVICE":
      return { type: "ASK_FRITZ_ADVICE" };
    case "USE_FAVOR":
      return { type: "USE_FRITZ_FAVOR", resource: a.resource as "voltage" };
    case "SET_DIFFICULTY":
      return { type: "SET_DIFFICULTY", difficulty: a.difficulty as "EASY" };
    default:
      return a as Parameters<typeof reducer>[1];
  }
}

function chooseAction(s: GameState, rng: () => number, tendency: number): RecordedAction | null {
  switch (s.screen) {
    case "MENU": return { type: "START_GAME" };
    case "PROLOGUE": return { type: "ADVANCE_PROLOGUE" };
    case "CHAPTER_CARD": return rng() < 0.15 ? { type: "SKIP_TO_ACT2" } : { type: "ENTER_STORY" };
    case "OUTCOME": return { type: "CONTINUE_OUTCOME" };
    case "NEWSPAPER": return { type: "DISMISS_INTERLUDE" };
    case "EXPERIMENT": return { type: "CONDUCT_EXPERIMENT", roll: rng() };
    case "NODE": {
      const r = rng();
      if (r < 0.06) return { type: "ASK_ADVICE" };
      if (r < 0.1) return { type: "USE_FAVOR", resource: ["voltage", "biomass", "secrecy"][Math.floor(rng() * 3)] };
      const node = NODES[s.currentNodeId];
      const n = node.options.length;
      // 85% pick among options currently available, 15% any (exercises the "unavailable" guard)
      const avail = node.options.map((o, i) => (isOptionUnavailable(s.resources, s.money, s.difficulty, s.flags, o) ? -1 : i)).filter((i) => i >= 0);
      const pool = rng() < 0.85 && avail.length ? avail : [...Array(n).keys()];
      // tendency biases toward first/last option so runs spread across branches
      const idx = tendency < 0.33 ? pool[0] : tendency < 0.66 ? pool[pool.length - 1] : pool[Math.floor(rng() * pool.length)];
      return { type: "SELECT_OPTION", optionIndex: rng() < 0.5 ? idx : pool[Math.floor(rng() * pool.length)] };
    }
    case "ENDING": return null;
    default: return null;
  }
}

const runs: RecordedRun[] = [];
const coverage: Record<string, number> = {};
const bump = (k: string) => (coverage[k] = (coverage[k] ?? 0) + 1);
const DIFFS = ["EASY", "MEDIUM", "HARD"];

for (let seed = 1; seed <= RUNS; seed++) {
  const rng = makeRng(seed * 7919);
  const tendency = rng();
  const difficulty = DIFFS[seed % 3];
  let s = initialState();
  const actions: RecordedAction[] = [{ type: "SET_DIFFICULTY", difficulty }];
  const hashes: string[] = [];
  s = reducer(s, toLegacy(actions[0]));
  hashes.push(hashProjection(project(s)));

  for (let step = 0; step < MAX_STEPS; step++) {
    const a = chooseAction(s, rng, tendency);
    if (!a) break;
    actions.push(a);
    s = reducer(s, toLegacy(a));
    hashes.push(hashProjection(project(s)));
    if (a.type === "SKIP_TO_ACT2") bump("skipToAct2");
    if (a.type === "ASK_ADVICE") bump("adviceAsked");
    if (a.type === "USE_FAVOR") bump("favorTried");
    if (a.type === "CONDUCT_EXPERIMENT") bump(s.pendingOutcomeKind === "SUCCESS" ? "rollSuccess" : "rollFailure");
    if (s.screen === "NEWSPAPER" && s.activeNewspaper) bump(`interlude:${s.activeNewspaper.id}`);
  }
  if (s.screen === "ENDING" && s.endingId) bump(`ending:${s.endingId}`);
  else bump("unfinished");
  bump(`difficulty:${difficulty}`);
  runs.push({ seed, actions, hashes });
}

const baseline: Baseline = { generatedBy: "legacy src/engine.ts + src/data.ts", runs, coverage };
writeFileSync("tests/fixtures/baseline.json", JSON.stringify(baseline));
const steps = runs.reduce((n, r) => n + r.actions.length, 0);
console.log(`Recorded ${runs.length} runs, ${steps} steps.`);
for (const k of Object.keys(coverage).sort()) console.log(`  ${k}: ${coverage[k]}`);
