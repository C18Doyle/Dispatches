/** Node ID convention. Spec §13.7. Structured IDs make careless find-and-replace fail loudly. */
const { loadEngine, report, fileArg } = require("./_load.js");
const E = loadEngine(fileArg());

const problems = [];
const seen = new Map();
let checked = 0;

for (const { campaignId, nodeId, node } of E.allNodes()) {
  checked++;
  if (!E.isValidNodeId(nodeId)) {
    problems.push(`${nodeId}: does not match {campaign}_{year}_{seq}_{slug} or {campaign}_end_{slug}`);
    continue;
  }
  if (seen.has(nodeId)) problems.push(`${nodeId}: duplicate (also in ${seen.get(nodeId)})`);
  seen.set(nodeId, campaignId);

  if (!nodeId.startsWith(campaignId + "_")) {
    problems.push(`${nodeId}: ID prefix does not match its campaign (${campaignId})`);
  }
  const m = E.NODE_ID_PATTERN.exec(nodeId);
  if (m && node.year !== undefined && Number(m[2]) !== Number(node.year)) {
    problems.push(`${nodeId}: ID year ${m[2]} != node.year ${node.year}`);
  }
  if (E.ENDING_ID_PATTERN.test(nodeId) && !node.ending) {
    problems.push(`${nodeId}: named as an ending but has no ending block`);
  }
  if (node.ending && !E.ENDING_ID_PATTERN.test(nodeId)) {
    problems.push(`${nodeId}: is an ending but not named {campaign}_end_{slug}`);
  }
}
process.exit(report("check-node-ids", problems, checked) ? 1 : 0);
