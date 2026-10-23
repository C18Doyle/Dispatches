/** The ground ledger (src/43-map-ground.jsx). Every mark names a flag that an order sets and values that order sets, lies in the world, says what it is in a sentence,
 *  and no two marks share an id; every command has some marks; and the marks are reachable: each marking value is set by an order in that command. */
const { loadEngine, report, fileArg } = require("./_load.js");
const E = loadEngine(fileArg());
const problems = [];
let checked = 0;
const okPoint = (p) => Array.isArray(p) && p.length === 2 && p[0] > -15 && p[0] < 70 && p[1] > 15 && p[1] < 70;
const seen = new Set();
for (const cid of E.CAMPAIGN_IDS) {
  const list = E.MAP_GROUND[cid] || [];
  checked++;
  if (list.length < 8) problems.push(`${cid}: only ${list.length} ground marks`);
  const setBy = {};
  for (const { node } of Object.values(E.CAMPAIGNS[cid].nodes).map((n) => ({ node: n }))) {
    for (const ch of node.choices || []) for (const [k, v] of Object.entries(ch.setFlags || {})) (setBy[k] = setBy[k] || new Set()).add(v);
  }
  for (const g of list) {
    checked++;
    if (seen.has(g.id)) problems.push(`${g.id}: duplicate id`);
    seen.add(g.id);
    if (!okPoint(g.at)) problems.push(`${g.id}: not in the world`);
    if (!["gained", "lost"].includes(g.kind)) problems.push(`${g.id}: kind "${g.kind}"`);
    if (!g.text || g.text.length < 20 || g.text.length > 110) problems.push(`${g.id}: the text should be 20 to 110 characters`);
    if (/—|–/.test(g.text + g.name)) problems.push(`${g.id}: a dash in the text`);
    if (!/\.$/.test(g.text)) problems.push(`${g.id}: the text should be a sentence ending in a full stop`);
    if (!setBy[g.flag]) problems.push(`${g.id}: no order of ${cid} sets ${g.flag}`);
    else for (const v of g.values) if (!setBy[g.flag].has(v)) problems.push(`${g.id}: no order sets ${g.flag} to "${v}"`);
  }
}
// the tally and the ledger work
checked++;
const probe = E.groundOf("ohl", { ohl_serbia: "declined", ohl_verdun: "attrition" });
if (probe.length !== 1 || probe[0].id !== "ohl-belgrade") problems.push("groundOf does not read the flags");
const t = E.groundTally("ohl", { ohl_serbia: "declined", ohl_lorraine: "reinforced" });
if (t.gained !== 1 || t.lost !== 1 || t.net !== 0) problems.push("groundTally is wrong");
process.exit(report("check-ground", problems, checked) ? 1 : 0);
