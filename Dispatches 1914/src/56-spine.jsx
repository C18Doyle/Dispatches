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

/**
 * What the player is told, after an order, about the historical record. Pure data in, text out.
 * - The order the command really gave is marked `historical: true` on the node (exactly one per node).
 * - A choice whose roll represents a real disagreement carries a `dispute` (spec §13.6): it is shown as written.
 * Returns null on an ending node. Used by the outcome screen and by smoke.js.
 */
export function historicalNote(node, choice) {
  if (!node || !choice || node.ending) return null;
  const hist = (node.choices ?? []).find((c) => c.historical);
  if (!hist) return null;
  const parts = [];
  if (choice.historical) {
    parts.push("The command gave this order.");
  } else {
    parts.push(`The command did not give this order. The historical command chose: ${hist.label.replace(/[.!?]+$/, "")}.`);
  }
  if (choice.dispute) {
    parts.push(`Where the record divides.\n${choice.dispute}`);
  }
  return { historical: Boolean(choice.historical), historicalLabel: hist.label, dispute: choice.dispute ?? null, text: parts.join("\n\n") };
}
