/** Advisor dossiers. Spec §13.3. Every named advisor has a dossier; roster sized to tier. */
const { loadEngine, report, fileArg } = require("./_load.js");
const E = loadEngine(fileArg());

const problems = [];
let checked = 0;

for (const cid of E.CAMPAIGN_IDS) {
  const c = E.CAMPAIGNS[cid];
  if (!Object.keys(c.nodes).length) continue;

  const [lo, hi] = c.tier === "major" ? [10, 11] : [7, 8];
  if (c.advisors.length < lo || c.advisors.length > hi) {
    problems.push(`${cid}: ${c.advisors.length} advisors, target ${lo}-${hi} for a ${c.tier} campaign`);
  }
  const used = new Set();
  for (const node of Object.values(c.nodes)) for (const a of node.advisors ?? []) used.add(a);

  for (const a of c.advisors) {
    checked++;
    if (!a.dossier) problems.push(`${cid}/${a.id}: advisor with no dossier`);
    if (!a.from || !a.to) problems.push(`${cid}/${a.id}: advisor with no entry/exit dates`);
    if (!used.has(a.id)) problems.push(`${cid}/${a.id}: dossier written but advisor never appears at a node`);
  }
}
process.exit(report("check-advisor-coverage", problems, checked) ? 1 : 0);
