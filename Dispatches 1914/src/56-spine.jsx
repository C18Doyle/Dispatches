// =============================================================================
// SPINE
// =============================================================================

/** Exactly one historical: true choice per node. Enforced by walk-historical.js. */
export function historicalChoice(node) {
  return (node.choices ?? []).filter((c) => c.historical);
}

export function walkSpine(campaignId, startId) {
  const c = CAMPAIGNS[campaignId];
  const start = startId ?? c.startNode;
  if (!start) return { path: [], noStartNode: true };
  const path = [];
  const seen = new Set();
  let cur = start;
  while (cur) {
    if (seen.has(cur)) return { path, cycleAt: cur };
    seen.add(cur);
    const node = c.nodes[cur];
    if (!node) return { path, missing: cur };
    path.push(cur);
    if (node.ending) break;
    const hist = historicalChoice(node);
    if (hist.length !== 1) return { path, badHistoricalCount: cur, count: hist.length };
    const ch = hist[0];
    if (ch.uncertain && ch.uncertain.length) {
      const hb = ch.uncertain.filter((b) => b.historicalBranch);
      if (hb.length !== 1) return { path, badHistoricalBranch: cur, count: hb.length };
      cur = hb[0].next ?? ch.next ?? null;
    } else {
      cur = ch.next ?? null;
    }
  }
  return { path };
}
