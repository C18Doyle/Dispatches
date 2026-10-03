// Orphan check (see checkOrphans in packages/testkit/src/content-checks.mjs): nodes no path reaches and endings no
// path reaches. 1914 keeps its nodes in camp.nodes (no separate atlas), so the node list is the atlas.
// Run: npm run check:orphans   (add --record to accept today's findings into tests/orphans-allowlist.json)
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { checkOrphans, reportOrphans } from "../../packages/testkit/src/content-checks.mjs";

// The engine layer of the assembled file is plain JS once `export` is stripped (same as the game's validators).
const src = readFileSync("dispatches-greatwar.jsx", "utf8").split("// UI_LAYER")[0].replace(/^export\s+/gm, "") + "\nmodule.exports = { CAMPAIGNS, resolveNode, METER_AXES };\n";
const sandbox = { module: { exports: {} }, console, process: { env: {} } };
sandbox.exports = sandbox.module.exports;
vm.runInNewContext(src, sandbox);
const { CAMPAIGNS, resolveNode, METER_AXES } = sandbox.module.exports;

// Hard mode forces one ending per campaign (hardMode.forcedEndingId); no ordinary path leads there.
const isEnding = (camp, id) => !!camp.nodes[id]?.ending;
const forced = (camp, id) => id === camp.hardMode?.forcedEndingId;
const result = checkOrphans(CAMPAIGNS, {
  axes: METER_AXES,
  resolveNode: (camp, id, flags, meters) => resolveNode(id, flags, meters),
  startOf: (camp) => (Object.keys(camp.nodes || {}).length ? camp.startNode : null), // campaigns with no content yet are skipped
  atlasOf: (camp) => Object.keys(camp.nodes).filter((id) => !isEnding(camp, id) || !forced(camp, id)).filter((id) => !forced(camp, id)),
  endingsOf: (camp) => Object.keys(camp.nodes).filter((id) => isEnding(camp, id) && !forced(camp, id)),
  gated: (c) => !!c.blocked,
});
process.exit(reportOrphans("1914", result, "tests/orphans-allowlist.json") ? 1 : 0);
