// Orphan check (see checkOrphans in packages/testkit/src/content-checks.mjs): atlas nodes no path reaches,
// reachable nodes missing from the atlas, per-campaign NODE_TOTAL drift, authored endings no path reaches.
// Run: npm run check:orphans
import { checkOrphans, reportOrphans } from "../../packages/testkit/src/content-checks.mjs";
import { loadCampaignsFromDataSection } from "../../packages/testkit/src/load-campaigns.mjs";

const CAMPAIGNS = loadCampaignsFromDataSection("src/App.jsx");
let failures = 0;
// Each campaign has its own axes and its own atlas/total, so check them one at a time and merge.
const merged = { problems: [], info: { campaigns: 0, reached: 0, atlas: 0, states: 0, truncated: [], walked: [] } };
for (const [cid, camp] of Object.entries(CAMPAIGNS)) {
  const r = checkOrphans({ [cid]: camp }, {
    axes: camp.triangleAxes.map((a) => a.key),
    resolveNode: (c, id, flags, meters) => c.resolveNode(id, flags, meters),
    startOf: (c) => c.start,
    atlasOf: (c) => (c.NODE_ATLAS || []).map((n) => n.id),
    endingsOf: (c) => (c.ENDINGS_GALLERY || []).filter((e) => e.id !== c.hardMode?.maxEndingId), // {id, title}: some endings are reached through a redirecting node, so they are matched by title
    nodeTotal: camp.NODE_TOTAL,
  });
  merged.problems.push(...r.problems);
  for (const k of ["campaigns", "reached", "atlas", "states"]) merged.info[k] += r.info[k];
  merged.info.truncated.push(...r.info.truncated);
  merged.info.walked.push(...r.info.walked);
}
failures = reportOrphans("1922", merged, "tests/orphans-allowlist.json");
process.exit(failures ? 1 : 0);
