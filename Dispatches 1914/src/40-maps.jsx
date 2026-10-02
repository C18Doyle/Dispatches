// =============================================================================
// MAPS — spec §13.4
// =============================================================================

export const MAPS = {
  europe: {
    id: "europe",
    label: "Europe and the Near Approaches",
    holds: ["Western Front", "Eastern Front", "Italian Front", "Balkans", "Dardanelles"],
  },
  nearEast: {
    id: "nearEast",
    label: "Anatolia, the Levant, Mesopotamia and the Caucasus",
    holds: ["Caucasus", "Palestine", "Mesopotamia", "Hejaz"],
  },
};

/**
 * Marker colour is a token, never a literal.
 * Carried-forward fix: 1922 shipped white markers invisible against a cream page.
 */
export const MAP_TOKENS = {
  markerDefault: "var(--map-marker)",
  markerActive: "var(--map-marker-active)",
  markerVisited: "var(--map-marker-visited)",
  markerContrastAgainst: "var(--page-bg)",
};
