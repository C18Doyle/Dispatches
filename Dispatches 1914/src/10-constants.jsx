// =============================================================================
// CONSTANTS
// =============================================================================

export const METER_MIN = -10;
export const METER_MAX = 10;

/** The logistical triangle. Spec §4. `will` is labelled per campaign. */
export const METER_AXES = ["manpower", "munitions", "will"];

/** Accuracy badges. Spec §5. Every ending carries exactly one. */
export const BADGES = {
  SETTLED: "settled",
  CONTESTED: "contested",
  SPECULATIVE: "speculative",
};

export const BADGE_LABELS = {
  settled: "Settled record",
  contested: "Contested judgment",
  speculative: "Speculative counterfactual",
};

export const TIERS = { MAJOR: "major", MINOR: "minor" };

/** Calendar conventions. Spec §13.1. Stated on the campaign select screen. */
export const CALENDARS = {
  gregorian: {
    id: "gregorian",
    label: "Gregorian (New Style)",
    note: "Dates as reckoned in Western Europe.",
  },
  julian: {
    id: "julian",
    label: "Julian (Old Style)",
    note:
      "Dates as reckoned by the Russian command until February 1918. Thirteen " +
      "days behind the Western calendar. Western dates appear in parentheses on " +
      "first mention.",
  },
  rumi: {
    id: "rumi",
    label: "Rumi",
    note: "RESEARCH GATE — confirm Ottoman general staff document dating before use.",
    researchGate: true,
  },
};

/** Hard-mode erosion triggers. Spec §7.1. Each campaign erodes differently. */
export const EROSION_TRIGGERS = {
  SPEND_WILL: "spend_will", // buying operational gain with the will axis
  COSTLY_OFFENSIVE: "costly_offensive", // manpower-expensive attacks
  EXPOSE_REGIME: "expose_regime", // tying the regime to military outcomes
  DEFY_AUTHORITY: "defy_authority", // circumventing civil control
  CEDE_SOVEREIGNTY: "cede_sovereignty", // accepting allied command integration
  OVEREXTEND: "overextend", // commitments beyond supply
};
