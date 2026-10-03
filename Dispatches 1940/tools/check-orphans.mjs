// Orphan check (see checkOrphans in packages/testkit/src/content-checks.mjs): atlas nodes no path reaches,
// reachable nodes missing from the atlas, NODE_TOTAL drift. Run: npm run check:orphans
import { createRequire } from "node:module";
import { checkOrphans, reportOrphans } from "../../packages/testkit/src/content-checks.mjs";
import { loadFromJsx } from "../../packages/testkit/src/load-campaigns.mjs";

const esbuild = createRequire(import.meta.url)("esbuild");
const { CAMPAIGNS, NODE_ATLAS, NODE_TOTAL } = loadFromJsx(esbuild, "src/App.jsx", ["NODE_ATLAS", "NODE_TOTAL"]);
const result = checkOrphans(CAMPAIGNS, {
  axes: ["manpower","fuel","initiative"],
  resolveNode: (camp, id, flags, meters) => camp.resolveNode(id, flags, meters),
  startOf: (camp) => camp.start,
  startFlags: [{}, { hardMode: true }], // hard mode sets flags.hardMode and unlocks nodes only it reaches
  gated: (c) => !!c.disabledReason,
  atlasOf: (camp, cid) => (NODE_ATLAS[cid] || []).map((n) => n.id),
  nodeTotal: NODE_TOTAL,
});
process.exit(reportOrphans("1940", result, "tests/orphans-allowlist.json") ? 1 : 0);
