/**
 * Replays tests/fixtures/baseline.json (recorded by record_baseline.ts; the first recording was made from the legacy engine)
 * through the new pure reducer and compares a hash after every step.
 *   npm run verify:baseline
 * Exit code 1 on the first divergence, with the run, step and field diff.
 */
import { readFileSync } from "node:fs";
import { reduce, createInitialState, type Action, type GameDefinition } from "../src/index";
import { makeProject } from "./project_state";
import { hashProjection, type Baseline, type Projection, type RecordedAction } from "./projection";
import { loadDefinition } from "./load_definition";

const def: GameDefinition = loadDefinition(process.argv[2] ?? "frankenstein");
const baseline: Baseline = JSON.parse(readFileSync("tests/fixtures/baseline.json", "utf8"));

const project = makeProject(def);

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
console.log(`BASELINE MATCH: ${baseline.runs.length} runs, ${steps} steps identical to the recording.`);
