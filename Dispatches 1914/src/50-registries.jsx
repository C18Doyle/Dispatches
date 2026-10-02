// =============================================================================
// DERIVED REGISTRIES
// =============================================================================
//
// Spec §5 requires every ending registered in four places, and notes that a
// missed registration is silent. Rather than maintain four hand-edited tables,
// all four are DERIVED from node data. A node cannot be in the game and absent
// from the atlas, because the atlas is built from the game.
//
// This removes the entire four-place-registration bug class rather than
// validating against it. NODE_TOTAL is never hand-edited because it cannot be.
// =============================================================================

export function allNodes() {
  const out = [];
  for (const cid of CAMPAIGN_IDS) {
    const c = CAMPAIGNS[cid];
    for (const nid of Object.keys(c.nodes)) {
      out.push({ campaignId: cid, nodeId: nid, node: c.nodes[nid] });
    }
  }
  return out;
}

export function buildNodeAtlas() {
  const atlas = {};
  for (const { campaignId, nodeId, node } of allNodes()) {
    atlas[nodeId] = {
      campaignId,
      year: node.year,
      date: node.date,
      city: node.city ?? null,
      title: node.title,
      isEnding: Boolean(node.ending),
    };
  }
  return atlas;
}

export function buildNodeToCity() {
  const map = {};
  for (const { nodeId, node } of allNodes()) {
    if (node.city) map[nodeId] = node.city;
  }
  return map;
}

export function buildEndings() {
  const out = [];
  for (const { campaignId, nodeId, node } of allNodes()) {
    if (!node.ending) continue;
    out.push({
      id: nodeId,
      campaignId,
      title: node.title,
      family: node.ending.family ?? null,
      badge: node.ending.badge,
      badgeLabel: BADGE_LABELS[node.ending.badge] ?? null,
      hardModeOnly: Boolean(node.ending.hardModeOnly),
    });
  }
  return out;
}

export function nodeTotal() {
  return allNodes().length;
}

export function nodeTotalsByCampaign() {
  const out = {};
  for (const cid of CAMPAIGN_IDS) {
    const nodes = Object.values(CAMPAIGNS[cid].nodes);
    out[cid] = {
      nodes: nodes.length,
      endings: nodes.filter((n) => n.ending).length,
      advisors: CAMPAIGNS[cid].advisors.length,
      bulletins: nodes.filter((n) => n.bulletin).length,
      spine: nodes.filter((n) =>
        (n.choices ?? []).some((ch) => ch.historical)
      ).length,
    };
  }
  return out;
}
