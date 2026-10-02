// =============================================================================
// METERS
// =============================================================================

export function emptyMeters() {
  return { manpower: 0, munitions: 0, will: 0 };
}

export function clampMeter(v) {
  return Math.max(METER_MIN, Math.min(METER_MAX, v));
}

export function applyImpact(meters, impact) {
  const next = { ...meters };
  if (!impact) return next;
  for (const axis of METER_AXES) {
    if (typeof impact[axis] === "number") {
      next[axis] = clampMeter(next[axis] + impact[axis]);
    }
  }
  return next;
}

/** Label the will axis for the campaign in play. Spec §4.4. */
export function meterLabels(campaignId) {
  const c = CAMPAIGNS[campaignId];
  return {
    manpower: "Manpower",
    munitions: "Munitions",
    will: c ? c.willLabel : "Will",
  };
}
