// Prints a readable transcript of one scripted run, to read the game as a player would.
// usage (from the game folder): npx tsx <this file> <seed> <difficulty> <preferred option indexes comma separated, by node order>
import { createInitialState, reduce, isOptionUnavailable, evalCondition, resolveEnding } from "@dispatches/engine";
import { loadDefinition } from "../../packages/engine/tools/load_definition";
import { makeRng } from "../../packages/engine/tools/projection";

const def = loadDefinition(process.env.GAME ?? "dracula");
const seed = Number(process.argv[2] ?? 1);
const difficulty = (process.argv[3] ?? "MEDIUM") as "EASY" | "MEDIUM" | "HARD";
const prefs = (process.argv[4] ?? "").split(",").filter(Boolean).map(Number);
const rng = makeRng(seed);
let s = createInitialState(def);
const go = (a: Parameters<typeof reduce>[2]) => (s = reduce(def, s, a));
go({ type: "SET_DIFFICULTY", difficulty });
go({ type: "START_GAME" });
go({ type: "ADVANCE_PROLOGUE" });
go({ type: "ENTER_STORY" });
let step = 0;
for (let i = 0; i < 300 && s.phase !== "ENDING"; i++) {
  if (s.phase === "NODE") {
    const node = def.content.nodes[s.currentNodeId];
    console.log(`\n=== ${node.id} [${node.branch}] ${node.title}   (${def.config.resources.map((r) => r.id.slice(0, 3) + " " + s.resources[r.id]).join(", ")}; ${def.config.axes.map((a) => a.id + " " + s.axes[a.id]).join(", ")})`);
    console.log(node.description);
    for (const e of node.echoes ?? []) if (evalCondition(e.when, s)) console.log("  [echo] " + e.text);
    const open = node.options.map((_o, k) => k).filter((k) => !isOptionUnavailable(def, s, node.options[k]));
    const want = prefs[step++];
    const pick = want !== undefined && open.includes(want) ? want : open[Math.floor(rng() * open.length)];
    const opt = node.options[pick];
    console.log(`  options: ${node.options.map((o, k) => `${open.includes(k) ? "" : "(locked) "}${k}:${o.label.slice(0, 50)}`).join(" | ")}`);
    console.log(`  >> ${opt.label}${opt.roll ? "  [venture]" : ""}`);
    go({ type: "SELECT_OPTION", optionIndex: pick });
  } else if (s.phase === "ROLL") go({ type: "CONDUCT_EXPERIMENT", roll: rng() });
  else if (s.phase === "OUTCOME") {
    console.log(`  (${s.pendingOutcomeKind}) ${s.pendingOutcomeText}`);
    go({ type: "CONTINUE_OUTCOME" });
  } else if (s.phase === "INTERLUDE") {
    const it = def.content.interludes[s.activeInterludeId!];
    console.log(`  [interlude ${it.id}] ${it.headline}`);
    go({ type: "DISMISS_INTERLUDE" });
  } else break;
}
const r = resolveEnding(def, s);
console.log(`\n##### ${s.endingId}: ${r.title}\n${r.headline}\n${r.text}\n(${r.epilogueLabel})`);
