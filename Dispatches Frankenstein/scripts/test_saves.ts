/**
 * Save-compatibility test. tests/saves/*.json are runs saved by an earlier build (raw localStorage
 * strings, exactly what App.tsx wrote). Each one must still be accepted by parseRunSave and must play on
 * to an ending with the current engine and content, without throwing.
 *
 *   npm run test:saves             verify the committed saves
 *   npm run test:saves -- record   write fresh fixtures from the current build (only on purpose: when a
 *                                  save format change is intended and migrated, never to make verify pass)
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { reduce, createInitialState } from "@dispatches/engine";
import type { Action, GameState } from "@dispatches/engine";
import { def } from "../src/game";
import { IN_RUN_SCREENS, parseRunSave } from "../src/runSave";

const dir = join("tests", "saves");
const NODES = def.content.nodes;

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** One step of a simple deterministic player. Returns null when the run is over or stuck. */
function step(s: GameState, rand: () => number): GameState | null {
  const go = (a: Action) => reduce(def, s, a);
  switch (s.phase) {
    case "MENU":
      return go({ type: "START_GAME" });
    case "PROLOGUE":
      return go({ type: "ADVANCE_PROLOGUE" });
    case "CHAPTER_CARD":
      return go({ type: "ENTER_STORY" });
    case "NODE": {
      const n = NODES[s.currentNodeId]?.options.length ?? 0;
      const first = Math.floor(rand() * n);
      for (let k = 0; k < n; k++) {
        const next = reduce(def, s, { type: "SELECT_OPTION", optionIndex: (first + k) % n });
        if (next !== s) return next;
      }
      return null;
    }
    case "ROLL":
      return go({ type: "CONDUCT_EXPERIMENT", roll: rand() });
    case "OUTCOME":
      return go({ type: "CONTINUE_OUTCOME" });
    case "INTERLUDE":
      return go({ type: "DISMISS_INTERLUDE" });
    default:
      return null; // ENDING or an unknown phase
  }
}

if (process.argv[2] === "record") {
  mkdirSync(dir, { recursive: true });
  const rand = rng(7);
  let s = createInitialState(def);
  const seen = new Set<string>();
  for (let i = 0; i < 400; i++) {
    const next = step(s, rand);
    if (!next) break;
    s = next;
    // Keep the first save seen in each resumable phase, plus one late in the run.
    if (IN_RUN_SCREENS.has(s.phase) && (!seen.has(s.phase) || i === 60)) {
      seen.add(s.phase);
      writeFileSync(join(dir, `step-${String(i).padStart(3, "0")}-${s.phase.toLowerCase()}.json`), JSON.stringify(s));
    }
  }
  console.log(`recorded ${readdirSync(dir).length} save(s) in ${dir}: ${[...seen].join(", ")}`);
  process.exit(0);
}

if (!existsSync(dir)) {
  console.error(`no saves in ${dir}: run "npm run test:saves -- record" once with a known-good build`);
  process.exit(1);
}
let failures = 0;
const files = readdirSync(dir).filter((f) => f.endsWith(".json")).sort();
for (const f of files) {
  const raw = readFileSync(join(dir, f), "utf8");
  const saved = parseRunSave(raw, NODES);
  if (!saved) {
    console.error(`FAIL ${f}: the current build refuses this old save (parseRunSave returned null)`);
    failures++;
    continue;
  }
  try {
    let s = reduce(def, createInitialState(def), { type: "HYDRATE", state: saved });
    const rand = rng(11);
    let steps = 0;
    for (; steps < 3000; steps++) {
      const next = step(s, rand);
      if (!next) break;
      s = next;
    }
    if (s.phase !== "ENDING") {
      console.error(`FAIL ${f}: resumed run stopped in phase ${s.phase} at node ${s.currentNodeId} instead of reaching an ending`);
      failures++;
    } else console.log(`ok ${f}: resumes in ${saved.phase}, plays ${steps} steps to an ending`);
  } catch (e) {
    console.error(`FAIL ${f}: threw while playing on: ${(e as Error).message}`);
    failures++;
  }
}
console.log(`\n${files.length} save(s), ${failures} failure(s).`);
process.exit(failures ? 1 : 0);
