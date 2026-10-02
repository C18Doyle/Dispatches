// Structural content check (see packages/testkit/src/content-checks.mjs). Run: npm run check:structure
import { checkStructure, report } from "../../packages/testkit/src/content-checks.mjs";
import { loadCampaignsFromDataSection } from "../../packages/testkit/src/load-campaigns.mjs";

const CAMPAIGNS = loadCampaignsFromDataSection("src/App.jsx");
// Each campaign has its own triangle axes, so the samples are built per campaign inside one pass.
let problems = 0;
const merged = { problems: [], info: { campaigns: 0, nodes: 0, choices: 0, noHistorical: [], multiHistorical: [] } };
for (const [cid, camp] of Object.entries(CAMPAIGNS)) {
  const keys = camp.triangleAxes.map((a) => a.key);
  const r = checkStructure({ [cid]: camp }, {
    axes: keys,
    resolveNode: (c, id, flags, meters) => c.resolveNode(id, flags, meters),
    startOf: (c) => c.start,
    gated: (ch, meters) => typeof ch.gate === "function" && !ch.gate(meters),
  });
  merged.problems.push(...r.problems);
  for (const k of ["campaigns", "nodes", "choices"]) merged.info[k] += r.info[k];
  merged.info.noHistorical.push(...r.info.noHistorical);
  merged.info.multiHistorical.push(...r.info.multiHistorical);
}
problems = report("1922", merged, "tests/content-allowlist.json");
process.exit(problems ? 1 : 0);
