/**
 * Re-records tests/fixtures/baseline.json from the current reducer: seeded random runs (240: 80 a difficulty), each a list of actions and
 * the hash of the projection after every one. Run it only after an intentional change to the rules or the content, and say so in the
 * game's CHANGELOG: the first recording (240 runs, 7,917 steps) was made from the legacy engine and proved the refactor changed nothing.
 *   npm run record:baseline            (from the game folder)
 */
import { writeFileSync } from "node:fs";
import { reduce, createInitialState, isOptionUnavailable, type Action, type GameState } from "../src/index";
import { hashProjection, makeRng, type Baseline, type RecordedAction, type RecordedRun } from "./projection";
import { loadDefinition } from "./load_definition";
import { makeProject } from "./project_state";

const def = loadDefinition(process.argv[2] ?? "frankenstein");
const project = makeProject(def);
const difficulties = ["EASY", "MEDIUM", "HARD"] as const;
const resources = def.config.resources.map((r) => r.id);
const RUNS = 240;
const coverage: Record<string, number> = {};
const bump = (k: string) => (coverage[k] = (coverage[k] ?? 0) + 1);

const runs: RecordedRun[] = [];
for (let seed = 1; seed <= RUNS; seed++) {
  const rng = makeRng(seed);
  const difficulty = difficulties[(seed - 1) % 3];
  const actions: RecordedAction[] = [{ type: "SET_DIFFICULTY", difficulty }, { type: "START_GAME" }, { type: "ADVANCE_PROLOGUE" }, { type: "ENTER_STORY" }];
  let s: GameState = createInitialState(def);
  const hashes: string[] = [];
  const apply = (a: RecordedAction) => {
    s = reduce(def, s, a as unknown as Action);
    hashes.push(hashProjection(project(s)));
  };
  for (const a of actions) apply(a);
  bump(`difficulty:${difficulty}`);
  for (let i = 0; i < 400 && s.phase !== "ENDING"; i++) {
    let a: RecordedAction;
    if (s.phase === "NODE") {
      const node = def.content.nodes[s.currentNodeId];
      const open = node.options.map((_o, k) => k).filter((k) => !isOptionUnavailable(def, s, node.options[k]));
      const r = rng();
      if (r < 0.12 && !s.adviceRevealed && s.adviceUsesLeft > 0 && def.config.difficulties[s.difficulty].adviceEnabled) {
        a = { type: "ASK_ADVICE" };
        bump("adviceAsked");
      } else if (r < 0.2 && !s.favorUsed && def.config.assist) {
        a = { type: "USE_FAVOR", resource: resources[Math.floor(rng() * resources.length)] };
        bump("favorTried");
      } else {
        a = { type: "SELECT_OPTION", optionIndex: open[Math.floor(rng() * open.length)] };
      }
    } else if (s.phase === "ROLL") {
      a = { type: "CONDUCT_EXPERIMENT", roll: rng() };
    } else if (s.phase === "OUTCOME") {
      a = { type: "CONTINUE_OUTCOME" };
    } else if (s.phase === "INTERLUDE") {
      a = { type: "DISMISS_INTERLUDE" };
    } else {
      throw new Error(`seed ${seed}: stuck in phase ${s.phase}`);
    }
    actions.push(a);
    apply(a);
    if (s.phase === "OUTCOME") {
      if (s.pendingOutcomeKind === "SUCCESS") bump("rollSuccess");
      if (s.pendingOutcomeKind === "FAILURE") bump("rollFailure");
    }
    if (s.phase === "INTERLUDE" && s.activeInterludeId) bump(`interlude:${s.activeInterludeId}`);
  }
  if (s.phase !== "ENDING") throw new Error(`seed ${seed}: the run did not end`);
  bump(`ending:${s.endingId}`);
  runs.push({ seed, actions, hashes });
}
const baseline: Baseline = { generatedBy: "engine reducer (packages/engine/tools/record_baseline.ts), recorded 2026-10", runs, coverage };
writeFileSync("tests/fixtures/baseline.json", JSON.stringify(baseline));
console.log(`recorded ${runs.length} runs, ${runs.reduce((a, r) => a + r.actions.length, 0)} steps. Coverage:`);
for (const k of Object.keys(coverage).sort()) console.log(`  ${k}: ${coverage[k]}`);
