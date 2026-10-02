/** Historical spine. Spec §8. Exactly one historical:true choice per node. */
const { loadEngine, report, fileArg } = require("./_load.js");
const E = loadEngine(fileArg());

const problems = [];
let checked = 0;

for (const cid of E.CAMPAIGN_IDS) {
  const c = E.CAMPAIGNS[cid];
  if (!Object.keys(c.nodes).length) continue;

  for (const [nid, node] of Object.entries(c.nodes)) {
    if (node.ending) continue;
    checked++;
    const h = E.historicalChoice(node);
    if (h.length === 0) problems.push(`${nid}: no historical:true choice`);
    if (h.length > 1) problems.push(`${nid}: ${h.length} historical:true choices — must be exactly 1`);
  }

  const r = E.walkSpine(cid);
  if (r.noStartNode) problems.push(`${cid}: startNode is not set — spine cannot be walked`);
  if (r.cycleAt) problems.push(`${cid}: spine cycles at ${r.cycleAt}`);
  if (r.missing) problems.push(`${cid}: spine references missing node ${r.missing}`);
  if (r.badHistoricalCount) problems.push(`${cid}: spine broke at ${r.badHistoricalCount} (${r.count} historical choices)`);
  const last = r.path[r.path.length - 1];
  if (last && !c.nodes[last]?.ending) problems.push(`${cid}: spine ends at ${last}, which is not an ending`);
  console.log(`  ${cid} spine: ${r.path.length} nodes`);
}
process.exit(report("walk-historical", problems, checked) ? 1 : 0);
