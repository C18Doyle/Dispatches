// =============================================================================
// NODE ID CONVENTION — spec §13.7
// =============================================================================

export const NODE_ID_PATTERN = /^(ohl|gqg|stavka|bef|aok|otto)_(19(?:1[4-8]))_(\d{2})_([a-z0-9]+)$/;
export const ENDING_ID_PATTERN = /^(ohl|gqg|stavka|bef|aok|otto)_end_([a-z0-9]+)$/;

export function isValidNodeId(id) {
  return NODE_ID_PATTERN.test(id) || ENDING_ID_PATTERN.test(id);
}
