/** Contested rolls. Spec §13.6. Weights sum to 100; every roll cites its dispute. */
const { loadEngine, report, fileArg } = require("./_load.js");
const E = loadEngine(fileArg());

const problems = [];
let checked = 0;
const perCampaign = {};

for (const { campaignId, nodeId, node } of E.allNodes()) {
  perCampaign[campaignId] = perCampaign[campaignId] || 0;
  for (const ch of node.choices ?? []) {
    if (!ch.uncertain || !ch.uncertain.length) continue;
    checked++;
    perCampaign[campaignId]++;

    const sum = ch.uncertain.reduce((s, b) => s + (b.weight ?? 0), 0);
    if (sum !== 100) problems.push(`${nodeId}/${ch.id}: weights sum to ${sum}, must be 100`);

    if (!ch.dispute || !String(ch.dispute).trim()) {
      problems.push(`${nodeId}/${ch.id}: uncertain[] with no dispute field — a roll must cite the disagreement it represents`);
    }
    for (const [i, b] of ch.uncertain.entries()) {
      if (b.next && !E.findNode(b.next)) problems.push(`${nodeId}/${ch.id} branch ${i}: next "${b.next}" does not resolve`);
    }
    if (node.ending) problems.push(`${nodeId}/${ch.id}: roll on an ending node`);
  }
}

for (const cid of E.CAMPAIGN_IDS) {
  const c = E.CAMPAIGNS[cid];
  if (!Object.keys(c.nodes).length) continue;
  const floor = c.tier === "major" ? 3 : 2;
  const n = perCampaign[cid] ?? 0;
  if (n < floor) problems.push(`${cid}: ${n} contested rolls, floor for a ${c.tier} campaign is ${floor}`);
}
process.exit(report("check-rolls", problems, checked) ? 1 : 0);
