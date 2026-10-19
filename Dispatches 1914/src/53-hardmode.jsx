// =============================================================================
// HARD MODE — spec §7
// =============================================================================
//
// One erosion track. Six trigger conditions. A choice erodes only if it is
// tagged with the campaign's own trigger, so the same track behaves differently
// in each campaign rather than being one mechanic under six names.
// =============================================================================

export const EROSION_MAX = 10; // fallback only; campaigns set their own

export function erosionMax(campaignId) {
  return CAMPAIGNS[campaignId]?.hardMode?.erosionMax ?? EROSION_MAX;
}

export function emptyHardState() {
  return { enabled: false, erosion: 0 };
}

export function erosionFromChoice(campaignId, choice) {
  const c = CAMPAIGNS[campaignId];
  if (!c || !choice) return 0;
  // an order that an ally would object to (choice.ally, the ally's name) costs a point of standing in Hard mode, whatever the command's own trigger
  const ally = choice.ally ? 1 : 0;
  if (!choice.erodes) return ally;
  const triggers = Array.isArray(choice.erodes) ? choice.erodes : [choice.erodes];
  return (triggers.includes(c.hardMode.trigger) ? (choice.erosionWeight ?? 1) : 0) + ally;
}

export function applyErosion(hardState, campaignId, choice) {
  if (!hardState.enabled) return hardState;
  const delta = erosionFromChoice(campaignId, choice);
  if (!delta) return hardState;
  const cap = erosionMax(campaignId);
  return { ...hardState, erosion: Math.min(cap, hardState.erosion + delta) };
}

export function hardModeForcesEnding(hardState, campaignId) {
  return hardState.enabled && hardState.erosion >= erosionMax(campaignId);
}
