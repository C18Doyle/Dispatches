/**
 * Fuzz run: plays many random runs through the real reducer, the way the app drives it (the shelf, a change of difficulty on the shelf, every
 * kind of screen), and checks what a person at the screen would feel as a bug but the validator cannot see:
 *   - every run reaches an ending in a sane number of steps
 *   - a scene is never a dead end (at least one option is on offer and open)
 *   - gauges, axes and the purse stay inside their bounds
 *   - a save made at any point reads back to the same state, and playing on from the read-back state goes on to an ending
 *   - nothing throws
 * `npm test` runs a short version; run a long one before a release:
 *   npx tsx scripts/fuzz.ts 20000 [firstSeed]
 */
import { createInitialState, reduce, isOptionUnavailable, isOptionHidden, type Action } from "@dispatches/engine";
import { loadDefinition } from "../../packages/engine/tools/load_definition";
import { makeRng } from "../../packages/engine/tools/projection";
import { IN_RUN_SCREENS, parseRunSave, serializeRunSave } from "../src/runSave";

const def = loadDefinition("sherlock");
const RUNS = Number(process.argv[2] ?? 400);
const FIRST = Number(process.argv[3] ?? 1);
const MAX_STEPS = 900;
const nodes = def.content.nodes;
const bounds = new Map(def.config.resources.map((r) => [r.id, [r.min, r.max] as const]));
const axisBounds = new Map(def.config.axes.map((a) => [a.id, [a.min, a.max] as const]));

const problems: string[] = [];
const endings = new Map<string, number>();
let longest = 0;
let roundTrips = 0;
let resumes = 0;

function run(seed: number): void {
  const rng = makeRng(seed * 15485863);
  const pickOf = (n: number) => Math.floor(rng() * n);
  const fail = (msg: string) => problems.push(`seed ${seed}: ${msg}`);
  let s = createInitialState(def);
  const go = (a: Action) => (s = reduce(def, s, a));
  go({ type: "SET_DIFFICULTY", difficulty: (["EASY", "MEDIUM", "HARD"] as const)[pickOf(3)] });
  // the start the app now makes: straight to the shelf
  for (const t of ["START_GAME", "ADVANCE_PROLOGUE", "ENTER_STORY"] as const) go({ type: t });
  let steps = 0;
  try {
    for (; steps < MAX_STEPS && s.phase !== "ENDING"; steps++) {
      // bounds
      for (const [id, [lo, hi]] of bounds) {
        const v = s.resources[id];
        if (typeof v !== "number" || Number.isNaN(v) || v < lo || v > hi) fail(`${id} is ${v} (bounds ${lo} to ${hi}) at ${s.currentNodeId}`);
      }
      for (const [id, [lo, hi]] of axisBounds) {
        const v = s.axes?.[id] ?? 0;
        if (typeof v !== "number" || Number.isNaN(v) || v < lo || v > hi) fail(`axis ${id} is ${v} (bounds ${lo} to ${hi}) at ${s.currentNodeId}`);
      }
      if (!(s.money >= 0) || !Number.isFinite(s.money)) fail(`the purse is ${s.money} at ${s.currentNodeId}`);

      // a save at any point reads back the same; now and then the run goes on from the read-back state
      if (IN_RUN_SCREENS.has(s.phase) && rng() < 0.15) {
        const raw = serializeRunSave(s);
        const back = parseRunSave(raw, nodes);
        roundTrips++;
        if (!back) fail(`a save at ${s.phase} ${s.currentNodeId} did not read back`);
        else if (JSON.stringify(back) !== JSON.stringify(s)) fail(`a save at ${s.phase} ${s.currentNodeId} read back different`);
        else if (rng() < 0.2) {
          s = back;
          resumes++;
        }
      }

      if (s.phase === "NODE") {
        const node = nodes[s.currentNodeId];
        if (!node) {
          fail(`no scene ${s.currentNodeId}`);
          return;
        }
        const open = node.options.map((_o, k) => k).filter((k) => !isOptionHidden(s, node.options[k]) && !isOptionUnavailable(def, s, node.options[k]));
        if (!open.length) {
          fail(`dead end at ${s.currentNodeId} (${node.options.length} options, none open)`);
          return;
        }
        if (s.currentNodeId === "0") {
          // what the shelf lets a player do: change the difficulty (which begins again from the shelf), skip ahead as a returning player, or open a volume
          const roll = rng();
          if (roll < 0.15) {
            go({ type: "SET_DIFFICULTY", difficulty: (["EASY", "MEDIUM", "HARD"] as const)[pickOf(3)] });
            go({ type: "ENTER_STORY" });
            continue;
          }
          if (roll < 0.25 && def.config.skipToNodeId) {
            go({ type: "SKIP_TO_ACT2" });
            continue;
          }
        }
        go({ type: "SELECT_OPTION", optionIndex: open[pickOf(open.length)] });
      } else if (s.phase === "ROLL") go({ type: "CONDUCT_EXPERIMENT", roll: rng() });
      else if (s.phase === "OUTCOME") go({ type: "CONTINUE_OUTCOME" });
      else if (s.phase === "INTERLUDE") go({ type: "DISMISS_INTERLUDE" });
      else {
        fail(`stuck in phase ${s.phase} at ${s.currentNodeId}`);
        return;
      }
    }
  } catch (e) {
    fail(`threw at ${s.phase} ${s.currentNodeId}: ${(e as Error).message}`);
    return;
  }
  longest = Math.max(longest, steps);
  if (s.phase !== "ENDING") fail(`no ending after ${MAX_STEPS} steps (at ${s.currentNodeId})`);
  else {
    const id = s.endingId ?? "NONE";
    if (!def.content.endings[id]) fail(`ending ${id} does not exist`);
    endings.set(id, (endings.get(id) ?? 0) + 1);
  }
}

for (let n = 0; n < RUNS; n++) run(FIRST + n);

const all = Object.keys(def.content.endings);
const missed = all.filter((id) => !endings.has(id));
console.log(`fuzz: ${RUNS} runs from seed ${FIRST}, longest ${longest} steps, ${roundTrips} saves read back (${resumes} played on), ${endings.size} of ${all.length} endings reached`);
if (missed.length && RUNS >= 5000) console.log(`not reached by chance: ${missed.map((m) => m.replace("ENDING_", "")).join(", ")}`);
if (problems.length) {
  for (const p of problems.slice(0, 15)) console.error(`FAIL: ${p}`);
  if (problems.length > 15) console.error(`... and ${problems.length - 15} more`);
  process.exit(1);
}
console.log("Fuzz run passed.");
