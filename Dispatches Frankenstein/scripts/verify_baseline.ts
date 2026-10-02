/**
 * Replays tests/fixtures/baseline.json (recorded from the legacy engine)
 * through the new pure reducer and compares a hash after every step.
 *   npm run verify:baseline
 * Exit code 1 on the first divergence, with the run, step and field diff.
 */
import { readFileSync } from "node:fs";
import {
  reduce, createInitialState, resolveEnding, gossipPool, creatureReportPool,
  type Action, type GameDefinition, type GameState,
} from "../src/engine/index";
import { hashProjection, type Baseline, type Projection, type RecordedAction } from "./lib/projection";
import { loadDefinition } from "./lib/load_definition";

const def: GameDefinition = loadDefinition("frankenstein");
const baseline: Baseline = JSON.parse(readFileSync("tests/fixtures/baseline.json", "utf8"));

const distinctSorted = (lines: string[]) => [...new Set(lines)].sort();

function project(s: GameState): Projection {
  const ending = s.phase === "ENDING" ? resolveEnding(def, s) : null;
  return {
    phase: s.phase,
    difficulty: s.difficulty,
    money: s.money,
    currentNodeId: s.currentNodeId,
    activeBranch: s.activeBranch,
    resources: { ...s.resources },
    axes: { ...s.axes },
    flags: Object.keys(s.flags).filter((k) => s.flags[k]).sort(),
    activeInterludeId: s.activeInterludeId,
    pendingTarget: s.pendingTarget,
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
    adviceUsesLeft: s.adviceUsesLeft,
    adviceRevealed: s.adviceRevealed,
    favorUsed: s.favorUsed,
    ending: ending && { headline: ending.headline, title: ending.title, text: ending.text, temperamentLabel: ending.epilogueLabel },
    gossipPool: s.phase === "NODE" ? distinctSorted(gossipPool(def, s)) : null,
    reportPool: s.phase === "NODE" ? distinctSorted(creatureReportPool(def, s)) : null,
  };
}

let steps = 0;
for (const run of baseline.runs) {
  let s = createInitialState(def);
  for (let i = 0; i < run.actions.length; i++) {
    s = reduce(def, s, run.actions[i] as RecordedAction as Action);
    steps++;
    if (hashProjection(project(s)) !== run.hashes[i]) {
      console.error(`DIVERGED: run seed=${run.seed} step=${i} action=${JSON.stringify(run.actions[i])}`);
      console.error(JSON.stringify(project(s), null, 1).slice(0, 3000));
      process.exit(1);
    }
  }
}
console.log(`BASELINE MATCH: ${baseline.runs.length} runs, ${steps} steps identical to the legacy engine.`);
