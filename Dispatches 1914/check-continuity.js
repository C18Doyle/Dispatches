/** Convergence points. Spec §11. Not bugs by default — each needs reading
 *  against every path that reaches it. Reports for manual review. */
const { loadEngine, report, fileArg } = require("./_load.js");
const E = loadEngine(fileArg());

const inbound = new Map();
for (const { nodeId, node } of E.allNodes()) {
  const targets = [];
  for (const ch of node.choices ?? []) {
    if (ch.next) targets.push(ch.next);
    for (const b of ch.uncertain ?? []) if (b.next) targets.push(b.next);
  }
  for (const t of targets) {
    if (!inbound.has(t)) inbound.set(t, []);
    if (!inbound.get(t).includes(nodeId)) inbound.get(t).push(nodeId);
  }
}

const review = [];
for (const [target, sources] of inbound) {
  if (sources.length < 2) continue;
  const found = E.findNode(target);
  if (!found) continue;
  const node = found.node;
  const conditional =
    typeof node.situation === "function" ||
    typeof node.context === "function" ||
    typeof node.bulletin === "function";
  if (!conditional) {
    review.push(`${target}: ${sources.length} inbound paths (${sources.join(", ")}) but no conditional prose`);
  }
}
console.log(`check-continuity: ${inbound.size} targets checked, ${review.length} convergence points for review`);
for (const r of review) console.log(`  ~ ${r}`);
process.exit(0);
