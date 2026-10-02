// Structural content check (see packages/testkit/src/content-checks.mjs). Run: npm run check:structure
import { createRequire } from "node:module";
import { checkStructure, report } from "../../packages/testkit/src/content-checks.mjs";
import { loadCampaignsFromJsx } from "../../packages/testkit/src/load-campaigns.mjs";

const esbuild = createRequire(import.meta.url)("esbuild");
const CAMPAIGNS = loadCampaignsFromJsx(esbuild, "src/App.jsx");
const AXES = ["readiness", "pipeline", "initiative"];
const result = checkStructure(CAMPAIGNS, {
  axes: AXES,
  resolveNode: (camp, id, flags, meters) => camp.resolveNode(id, flags, meters),
  startOf: (camp) => camp.start,
  gated: (c) => !!c.disabledReason,
});
process.exit(report("1941", result, "tests/content-allowlist.json") ? 1 : 0);
