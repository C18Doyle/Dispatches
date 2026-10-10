// =============================================================================
// CAMPAIGN CONFIGURATION
// =============================================================================
//
// Node sets are empty. Content is written per campaign, in the build order at
// spec §12: OHL -> GQG -> STAVKA -> BEF -> AOK -> OTTO. Each campaign passes its
// own ship gate (§11) before the next begins.
//
// `advisors` carries entry/exit dates because advisors come and go with the seat
// (§13.3) and check-commander-timing.js validates against these.
// =============================================================================

export const CAMPAIGNS = {
  ohl: {
    id: "ohl",
    seal: "OHL",
    docLabel: "LAGEBERICHT",
    accent: "#7a2e2e",
    documentTreatment: "Wilhelmine German",
    tier: TIERS.MAJOR,
    name: "Oberste Heeresleitung",
    shortName: "German OHL",
    seat: "Chief of the General Staff",
    calendar: "gregorian",
    flagPrefix: "ohl_",
    willLabel: "Home Front",
    willMeaning: "Blockade, food supply, political durability.",
    span: { from: "1914-08-01", to: "1918-11-11" },
    targetNodes: [34, 38],
    targetEndings: [9, 11],
    map: "europe",
    bulletinVoice: {
      source: "Official communiqué and the national press under wartime censorship",
      register: "TO BE DEFINED IN CONTENT BRIEF",
      defined: false,
    },
    hardMode: {
      id: "ohl_hard",
      name: null, // Deferred by decision. Spec §7.2.
      trigger: EROSION_TRIGGERS.SPEND_WILL,
      forcedEndingId: null,
      description: "The war effort consuming the country that sustains it.",
    },
    startNode: null, // set with the campaign's first written node
    commanders: [],
    advisors: [],
    nodes: {},
  },

  gqg: {
    id: "gqg",
    seal: "GQG",
    docLabel: "COMPTE RENDU",
    accent: "#2f4858",
    documentTreatment: "French Republican",
    tier: TIERS.MAJOR,
    name: "Grand Quartier Général",
    shortName: "French GQG",
    seat: "Commander-in-Chief",
    calendar: "gregorian",
    flagPrefix: "gqg_",
    willLabel: "Army Morale",
    willMeaning: "The cohesion and obedience of the army itself.",
    span: { from: "1914-08-01", to: "1918-11-11" },
    targetNodes: [34, 38],
    targetEndings: [9, 11],
    map: "europe",
    bulletinVoice: {
      source: "TO BE DEFINED IN CONTENT BRIEF",
      register: "TO BE DEFINED IN CONTENT BRIEF",
      defined: false,
    },
    hardMode: {
      id: "gqg_hard",
      name: null,
      trigger: EROSION_TRIGGERS.COSTLY_OFFENSIVE,
      forcedEndingId: null,
      description: "Political survival of the commander.",
    },
    startNode: null, // set with the campaign's first written node
    commanders: [],
    advisors: [],
    nodes: {},
  },

  stavka: {
    id: "stavka",
    seal: "STAVKA",
    docLabel: "SVODKA",
    accent: "#5c3a21",
    documentTreatment: "Imperial Russian",
    tier: TIERS.MAJOR,
    name: "Stavka",
    shortName: "Russian Stavka",
    seat: "Supreme Command",
    calendar: "julian",
    flagPrefix: "stavka_",
    willLabel: "Home Stability",
    willMeaning: "The endurance of the political order behind the front.",
    span: { from: "1914-07-19", to: "1918-03-03" },
    targetNodes: [34, 38],
    targetEndings: [9, 11],
    map: "europe",
    bulletinVoice: {
      source: "TO BE DEFINED IN CONTENT BRIEF",
      register: "TO BE DEFINED IN CONTENT BRIEF",
      defined: false,
    },
    hardMode: {
      id: "stavka_hard",
      name: null,
      trigger: EROSION_TRIGGERS.EXPOSE_REGIME,
      forcedEndingId: null,
      description: "Court interference in command.",
    },
    startNode: null, // set with the campaign's first written node
    commanders: [],
    advisors: [],
    nodes: {},
    /** Spec §2.3, §3.4. Terminal nodes hand into Dispatches 1922. */
    handsOffTo: "dispatches-1922",
  },

  bef: {
    id: "bef",
    seal: "GHQ",
    docLabel: "SITUATION REPORT",
    accent: "#3d4a2f",
    documentTreatment: "British service",
    tier: TIERS.MAJOR,
    name: "British Expeditionary Force & War Cabinet",
    shortName: "British Empire",
    seat: "Field command and Cabinet",
    calendar: "gregorian",
    flagPrefix: "bef_",
    willLabel: "Political Capital",
    willMeaning: "Standing with the Cabinet and the country.",
    span: { from: "1914-08-04", to: "1918-11-11" },
    targetNodes: [34, 38],
    targetEndings: [9, 11],
    map: "europe",
    bulletinVoice: {
      source: "TO BE DEFINED IN CONTENT BRIEF",
      register: "TO BE DEFINED IN CONTENT BRIEF",
      defined: false,
    },
    hardMode: {
      id: "bef_hard",
      name: null,
      trigger: EROSION_TRIGGERS.DEFY_AUTHORITY,
      forcedEndingId: null,
      description: "The civil-military struggle turned hostile.",
    },
    startNode: null, // set with the campaign's first written node
    commanders: [],
    advisors: [],
    nodes: {},
  },

  aok: {
    id: "aok",
    seal: "AOK",
    docLabel: "LAGEBERICHT",
    accent: "#6b4a2f",
    documentTreatment: "Habsburg bureaucratic",
    tier: TIERS.MINOR,
    name: "Armeeoberkommando",
    shortName: "Austro-Hungarian AOK",
    seat: "Chief of the General Staff",
    calendar: "gregorian",
    flagPrefix: "aok_",
    willLabel: "Imperial Cohesion",
    willMeaning: "The reliability of a multi-national army.",
    span: { from: "1914-07-28", to: "1918-11-03" },
    targetNodes: [16, 20],
    targetEndings: [5, 6],
    map: "europe",
    bulletinVoice: {
      source: "TO BE DEFINED IN CONTENT BRIEF",
      register: "TO BE DEFINED IN CONTENT BRIEF",
      defined: false,
    },
    hardMode: {
      id: "aok_hard",
      name: null,
      trigger: EROSION_TRIGGERS.CEDE_SOVEREIGNTY,
      forcedEndingId: null,
      description: "Sovereignty spent to stay in the war.",
    },
    researchGate: {
      open: true,
      note:
        "English-language operational sourcing for AOK is materially thinner " +
        "than for OHL/GQG/BEF. Confirm spine sourcing before content. If a spine " +
        "node cannot be sourced, cut the node — do not write around it.",
    },
    startNode: null, // set with the campaign's first written node
    commanders: [],
    advisors: [],
    nodes: {},
  },

  otto: {
    id: "otto",
    seal: "OGS",
    docLabel: "HARP RAPORU",
    accent: "#5a4a6b",
    documentTreatment: "Ottoman staff",
    tier: TIERS.MINOR,
    name: "Ottoman General Staff",
    shortName: "Ottoman command",
    seat: "War ministry and general staff",
    calendar: "rumi",
    flagPrefix: "otto_",
    willLabel: "Imperial Control",
    willMeaning: "Authority over provinces and territory.",
    span: { from: "1914-08-02", to: "1918-11-08" },
    targetNodes: [16, 20],
    targetEndings: [5, 6],
    map: "nearEast",
    bulletinVoice: {
      source: "TO BE DEFINED IN CONTENT BRIEF",
      register: "TO BE DEFINED IN CONTENT BRIEF",
      defined: false,
    },
    hardMode: {
      id: "otto_hard",
      name: null,
      trigger: EROSION_TRIGGERS.OVEREXTEND,
      forcedEndingId: null,
      description: "An empire fighting in more places than it can hold.",
    },
    researchGate: {
      open: true,
      note:
        "Sourcing gate as AOK, plus the §9 blocking issue. Build last. Do not " +
        "begin content until §9 is resolved and recorded here.",
    },
    /** Spec §9. Blocks content generation for this campaign entirely. */
    blockingIssue: {
      resolved: false,
      ref: "DISPATCHES_1918_DESIGN_SPEC.md §9",
    },
    startNode: null, // set with the campaign's first written node
    commanders: [],
    advisors: [],
    nodes: {},
  },
};

export const CAMPAIGN_IDS = Object.keys(CAMPAIGNS);


