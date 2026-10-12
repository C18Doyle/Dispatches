/** The decisions in a line (src/64-asks.jsx). Every decision node has one, no node that is not a decision has one, and each is a single question of a
 *  readable length without a long dash (docs/WRITING.md). */
const { loadEngine, report, fileArg } = require("./_load.js");
const E = loadEngine(fileArg());
const problems = [];
let checked = 0;
const wc = (s) => String(s || "").trim().split(/\s+/).filter(Boolean).length;
const decisions = new Set();
for (const { nodeId, node } of E.allNodes()) {
  if (node.ending) continue;
  decisions.add(nodeId);
  checked++;
  const a = E.ASKS[nodeId];
  if (!a) { problems.push(`${nodeId}: no line in ASKS`); continue; }
  if (!/\?$/.test(a)) problems.push(`${nodeId}: the line must end with a question mark`);
  if (/[—–]/.test(a)) problems.push(`${nodeId}: no long dash in the line`);
  const n = wc(a);
  if (n < 8 || n > 28) problems.push(`${nodeId}: the line is ${n} words (8 to 28)`);
  if (/\b(you|your|the player|manpower|munitions|meter)\b/i.test(a)) problems.push(`${nodeId}: the line speaks to the player or of the mechanics`);
}
for (const id of Object.keys(E.ASKS)) {
  if (!decisions.has(id)) problems.push(`ASKS names "${id}", which is not a decision node`);
}
process.exit(report("check-asks", problems, checked) ? 1 : 0);
