/** The orders on the map (src/42-map-ops.jsx). Every key names a real report and one of its orders, every arrow has a place to go and a length that can be
 *  seen, the places lie in the world, and a good share of the decisions have their orders drawn (a report with some orders drawn has them all drawn). */
const { loadEngine, report, fileArg } = require("./_load.js");
const E = loadEngine(fileArg());
const problems = [];
let checked = 0;
const KINDS = ["attack", "move", "withdraw", "hold"];
const okPoint = (p) => Array.isArray(p) && p.length === 2 && p[0] > -15 && p[0] < 70 && p[1] > 15 && p[1] < 70;
const byNode = {};
for (const [key, arrows] of Object.entries(E.MAP_OPS)) {
  checked++;
  const [nodeId, choiceId] = key.split("/");
  const f = E.findNode(nodeId);
  if (!f) { problems.push(`${key}: no such report`); continue; }
  if (!(f.node.choices || []).some((c) => c.id === choiceId)) problems.push(`${key}: no such order`);
  (byNode[nodeId] = byNode[nodeId] || new Set()).add(choiceId);
  if (!Array.isArray(arrows) || !arrows.length) problems.push(`${key}: no arrows`);
  for (const a of arrows || []) {
    if (!KINDS.includes(a.kind)) { problems.push(`${key}: kind "${a.kind}"`); continue; }
    if (a.kind === "hold") { if (!okPoint(a.at)) problems.push(`${key}: a stand is not in the world`); continue; }
    if (!okPoint(a.from) || !okPoint(a.to)) problems.push(`${key}: an arrow is not in the world`);
    else if (Math.hypot(a.to[0] - a.from[0], a.to[1] - a.from[1]) < 0.12) problems.push(`${key}: an arrow too short to be seen`);
  }
}
// a report with some orders drawn has all its orders drawn
for (const [nodeId, have] of Object.entries(byNode)) {
  const f = E.findNode(nodeId);
  if (!f) continue;
  checked++;
  const missing = (f.node.choices || []).filter((c) => !have.has(c.id)).map((c) => c.id);
  if (missing.length) problems.push(`${nodeId}: orders not drawn: ${missing.join(", ")}`);
}
// the coverage
let decisions = 0;
for (const { node } of E.allNodes()) if (!node.ending) decisions++;
checked++;
if (Object.keys(byNode).length < 100) problems.push(`only ${Object.keys(byNode).length} reports have their orders drawn`);
for (const cid of E.CAMPAIGN_IDS) {
  checked++;
  const n = Object.keys(byNode).filter((id) => E.findNode(id).campaignId === cid).length;
  if (n < 6) problems.push(`${cid}: only ${n} reports have their orders drawn`);
}
process.exit(report("check-mapops", problems, checked) ? 1 : 0);
