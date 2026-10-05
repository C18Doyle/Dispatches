/** Front map. Every node's city must have coordinates on the map, inside its view. A missing city shows no map. */
const { loadEngine, report, fileArg } = require("./_load.js");
const E = loadEngine(fileArg());
const problems = [];
let checked = 0;
for (const { nodeId, node } of E.allNodes()) {
  checked++;
  if (!node.city) { problems.push(`${nodeId}: no city`); continue; }
  const p = E.MAP_CITIES[node.city];
  if (!p) problems.push(`${nodeId}: city "${node.city}" has no entry in MAP_CITIES (src/40-maps.jsx)`);
  else if (p[0] < 0 || p[0] > E.MAP_VIEW.width || p[1] < 0 || p[1] > E.MAP_VIEW.height) problems.push(`${nodeId}: city "${node.city}" lies outside the map view`);
}
process.exit(report("check-maps", problems, checked) ? 1 : 0);
