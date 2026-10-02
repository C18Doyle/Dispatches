/** Advisor and commander timing. Spec §11, §13.3.
 *  1922 shipped Gajda speaking after dismissal, Kappel after incapacitation,
 *  and Wrangel and Kutepov advising the opposing command. */
const { loadEngine, report, fileArg } = require("./_load.js");
const E = loadEngine(fileArg());

const problems = [];
let checked = 0;

for (const { campaignId, nodeId, node } of E.allNodes()) {
  const c = E.CAMPAIGNS[campaignId];
  const roster = new Set(c.advisors.map((a) => a.id));

  if (Object.keys(c.nodes).length && !E.commanderAt(campaignId, node.date)) {
    problems.push(`${nodeId}: no commander holds the seat on ${node.date}`);
  }

  for (const aid of node.advisors ?? []) {
    checked++;
    if (!roster.has(aid)) {
      problems.push(`${nodeId}: advisor "${aid}" is not on the ${campaignId} roster`);
      continue;
    }
    if (!E.isAdvisorPresent(campaignId, aid, node.date)) {
      const a = c.advisors.find((x) => x.id === aid);
      problems.push(`${nodeId}: advisor "${aid}" speaks on ${node.date}, outside ${a.from}..${a.to}${a.exitReason ? ` (${a.exitReason})` : ""}`);
    }
  }
}
process.exit(report("check-commander-timing", problems, checked) ? 1 : 0);
