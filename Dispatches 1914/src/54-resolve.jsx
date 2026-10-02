// =============================================================================
// NODE RESOLUTION
// =============================================================================
//
// RECONCILE: 1922's resolveNode(nodeId, flags, meters) returns the whole node
// with situation/context/bulletin/epilogue optionally built from flags. This
// reproduces that contract from the handover description. Verify against the
// real implementation before content work.
// =============================================================================

function resolveField(field, ctx) {
  return typeof field === "function" ? field(ctx.flags, ctx.meters, ctx) : field;
}

export function findNode(nodeId) {
  for (const cid of CAMPAIGN_IDS) {
    const n = CAMPAIGNS[cid].nodes[nodeId];
    if (n) return { campaignId: cid, node: n };
  }
  return null;
}

export function resolveNode(nodeId, flags = {}, meters = emptyMeters(), hardState = emptyHardState()) {
  const found = findNode(nodeId);
  if (!found) return null;
  const { campaignId, node } = found;
  const ctx = { flags, meters, hardState, campaignId, nodeId };

  const choices = (node.choices ?? []).map((ch) => {
    const blocked = typeof ch.gate === "function" ? !ch.gate(meters, flags) : false;
    return {
      ...ch,
      blocked,
      disabledReason: blocked ? ch.disabledReason ?? null : null,
      label: resolveField(ch.label, ctx),
    };
  });

  return {
    ...node,
    id: nodeId,
    campaignId,
    commander: commanderAt(campaignId, node.date),
    advisorsPresent: advisorsPresentAt(campaignId, node.date),
    meterLabels: meterLabels(campaignId),
    situation: resolveField(node.situation, ctx),
    context: resolveField(node.context, ctx),
    bulletin: resolveField(node.bulletin, ctx),
    epilogue: resolveField(node.epilogue, ctx),
    choices,
    allChoicesBlocked: choices.length > 0 && choices.every((c) => c.blocked),
  };
}
