// Plays seeded random runs through the reducer and writes each as a readable transcript (what a player would read: the scene, the echoes that apply, the choice,
// the outcome), so that a person can read a few for contradictions that no lint can find: a line that assumes something that did not happen on this path.
//   npx tsx scripts/transcripts.ts [count] [volume 0-4]      writes tests/transcripts/run-<n>.md (not committed)
import { mkdirSync, writeFileSync } from "node:fs";
import { createInitialState, reduce, isOptionUnavailable, evalCondition, type Action } from "@dispatches/engine";
import { loadDefinition } from "../../packages/engine/tools/load_definition";
import { makeRng } from "../../packages/engine/tools/projection";

const def = loadDefinition("sherlock");
const count = Number(process.argv[2] ?? 12);
const only = process.argv[3] === undefined ? undefined : Number(process.argv[3]);
mkdirSync("tests/transcripts", { recursive: true });

for (let n = 1; n <= count; n++) {
  const rng = makeRng(n * 104729);
  let s = createInitialState(def);
  const go = (a: Action) => (s = reduce(def, s, a));
  go({ type: "SET_DIFFICULTY", difficulty: "MEDIUM" });
  for (const t of ["START_GAME", "ADVANCE_PROLOGUE", "ENTER_STORY"] as const) go({ type: t });
  const lines: string[] = [`# Run ${n}`, ""];
  for (let i = 0; i < 400 && s.phase !== "ENDING"; i++) {
    if (s.phase === "NODE") {
      const node = def.content.nodes[s.currentNodeId];
      lines.push(`## ${node.id}: ${node.title}`, "", node.description, "");
      for (const e of node.echoes ?? []) if (evalCondition(e.when, s)) lines.push(`> (echo) ${e.text}`, "");
      lines.push(`_${Object.entries(s.resources).map(([k, v]) => `${k} ${v}`).join(", ")}_`, "");
      const open = node.options.map((_o, k) => k).filter((k) => !isOptionUnavailable(def, s, node.options[k]));
      let pick = open[Math.floor(rng() * open.length)];
      if (node.id === "0" && only !== undefined) pick = only;
      const o = node.options[pick];
      lines.push(`**Choice:** ${o.label}`, "");
      if (o.quote?.text) lines.push(`${o.quote.speaker}: "${o.quote.text}"`, "");
      go({ type: "SELECT_OPTION", optionIndex: pick });
    } else if (s.phase === "ROLL") {
      go({ type: "CONDUCT_EXPERIMENT", roll: rng() });
    } else if (s.phase === "OUTCOME") {
      if (s.pendingOutcomeText) lines.push(`${s.pendingOutcomeKind === "FAILURE" ? "(failed) " : ""}${s.pendingOutcomeText}`, "");
      go({ type: "CONTINUE_OUTCOME" });
    } else if (s.phase === "INTERLUDE") {
      const it = s.activeInterludeId ? def.content.interludes[s.activeInterludeId] : undefined;
      if (it) lines.push(`### [card] ${it.headline}`, "", it.bodyText, "");
      go({ type: "DISMISS_INTERLUDE" });
    } else break;
  }
  if (s.endingId) lines.push(`# ENDING: ${s.endingId}`, "", def.content.endings[s.endingId]?.text ?? "", "");
  writeFileSync(`tests/transcripts/run-${n}.md`, lines.join("\n"));
}
console.log(`wrote ${count} transcripts to tests/transcripts`);
