// =============================================================================
// COMMANDER SUCCESSION — spec §3.2, §13.3
// =============================================================================
//
// The player occupies the office, not the man. A seat change alters the document
// header, the voice register, and which advisors are present. It does not reset
// the run or multiply the roster.
// =============================================================================

function withinDate(date, from, to) {
  if (!date) return false;
  if (from && date < from) return false;
  if (to && date > to) return false;
  return true;
}

export function commanderAt(campaignId, date) {
  const c = CAMPAIGNS[campaignId];
  if (!c) return null;
  return c.commanders.find((cmd) => withinDate(date, cmd.from, cmd.to)) ?? null;
}

export function advisorsPresentAt(campaignId, date) {
  const c = CAMPAIGNS[campaignId];
  if (!c) return [];
  return c.advisors.filter((a) => withinDate(date, a.from, a.to));
}

export function isAdvisorPresent(campaignId, advisorId, date) {
  return advisorsPresentAt(campaignId, date).some((a) => a.id === advisorId);
}
