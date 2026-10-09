// Orphan check (see checkOrphans in packages/testkit/src/content-checks.mjs): atlas nodes no path reaches,
// reachable nodes missing from the atlas, NODE_TOTAL drift. Run: npm run check:orphans
import { createRequire } from "node:module";
import { checkOrphans, reportOrphans } from "../../packages/testkit/src/content-checks.mjs";
import { labelsInSource } from "./audit-lib.mjs";
import { loadFromJsx } from "../../packages/testkit/src/load-campaigns.mjs";

const esbuild = createRequire(import.meta.url)("esbuild");
const { CAMPAIGNS, NODE_ATLAS, NODE_TOTAL } = loadFromJsx(esbuild, "src/App.jsx", ["NODE_ATLAS", "NODE_TOTAL"]);
const result = checkOrphans(CAMPAIGNS, {
  axes: ["readiness","pipeline","initiative"],
  resolveNode: (camp, id, flags, meters) => camp.resolveNode(id, flags, meters),
  startOf: (camp) => camp.start,
  gated: (c) => !!c.disabledReason,
  atlasOf: (camp, cid) => (NODE_ATLAS[cid] || []).map((n) => n.id),
  // the ceilings of the hard modes set purged (IGHQ, fanatical) or relieved (CINCPAC, coalition), which the search does not model: try both
  labelOf: (camp, flags, meters) => [camp.positionLabel(flags, meters), camp.positionLabel({ ...flags, purged: true }, meters), camp.positionLabel({ ...flags, relieved: true }, meters)],
  labelsOf: (camp, cid) => labelsInSource(cid).filter((t) => t !== "A Different Command"), // the fallback is not an authored ending
  nodeTotal: NODE_TOTAL,
});
process.exit(reportOrphans("1941", result, "tests/orphans-allowlist.json") ? 1 : 0);
