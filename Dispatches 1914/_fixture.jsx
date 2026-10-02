/**
 * Dispatches 1918 — The Great War
 * Single-file React/JSX branching-narrative strategy game.
 *
 * ENGINE LAYER. The UI layer is deliberately absent: art direction is undecided
 * (spec §13.8) and the menu is the first surface that has to express it.
 *
 * Built clean-room from DISPATCHES_1918_DESIGN_SPEC.md. NOT ported from
 * dispatches-1922.jsx — that file was not available. Where this engine's
 * semantics differ from 1922's, 1922 is the authority and this file should be
 * reconciled against it before content work begins. Known points of possible
 * divergence are marked RECONCILE.
 *
 * Validators split this file on the UI_LAYER marker at the bottom.
 */

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
    tier: TIERS.MAJOR,
    name: "Stavka",
    shortName: "Russian Stavka",
    seat: "Supreme Command",
    calendar: "julian",
    flagPrefix: "stavka_",
    willLabel: "Home Stability",
    willMeaning: "The endurance of the political order behind the front.",
    span: { from: "1914-08-01", to: "1918-03-03" },
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
    tier: TIERS.MINOR,
    name: "Ottoman General Staff",
    shortName: "Ottoman command",
    seat: "War ministry and general staff",
    calendar: "rumi",
    flagPrefix: "otto_",
    willLabel: "Imperial Control",
    willMeaning: "Authority over provinces and territory.",
    span: { from: "1914-10-29", to: "1918-10-30" },
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


CAMPAIGNS.ohl.startNode = "ohl_1914_01_opening";
CAMPAIGNS.ohl.bulletinVoice = { source: "x", register: "y", defined: true };
CAMPAIGNS.ohl.commanders = [{ id: "a", name: "A", from: "1914-08-01", to: "1916-08-28" }];
CAMPAIGNS.ohl.advisors = [
  { id: "adv_ok",   name: "Present",   from: "1914-08-01", to: "1918-11-11", dossier: "..." },
  { id: "adv_gone", name: "Dismissed", from: "1914-08-01", to: "1915-01-01", dossier: "...", exitReason: "dismissed Jan 1915" },
];
CAMPAIGNS.ohl.nodes = {
  "ohl_1914_01_opening": {
    year: 1914, date: "1914-08-04", city: "Liege", title: "Opening",
    situation: "s", advisors: ["adv_ok"],
    choices: [
      { id: "a", label: "A", historical: true, next: "ohl_1915_02_middle" },
      { id: "b", label: "B", historical: true, next: "ohl_1915_02_middle" },
      { id: "c", label: "C", gate: (m) => m.manpower > 0, next: "ohl_1915_02_middle" },
      { id: "d", label: "D", gate: (m) => m.manpower > 99, disabledReason: "r", next: "ohl_1915_02_middle" },
    ],
  },
  "ohl_1915_02_middle": {
    year: 1915, date: "1916-02-21", city: "Verdun", title: "Middle",
    situation: "s", advisors: ["adv_gone"],
    choices: [
      { id: "a", label: "A", historical: true,
        uncertain: [{ weight: 40, next: "ohl_end_collapse" }, { weight: 40, next: "ohl_end_collapse" }],
        setFlags: { verdunPressed: true } },
      { id: "b", label: "B", next: "ohl_1917_09_missing" },
    ],
  },
  "ohl_end_collapse": {
    year: 1918, date: "1918-11-11", city: "Spa", title: "Collapse",
    situation: "s", advisors: ["adv_ok"], ending: { family: "home-front-collapse" },
  },
};

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

// =============================================================================
// HARD MODE — spec §7
// =============================================================================
//
// One erosion track. Six trigger conditions. A choice erodes only if it is
// tagged with the campaign's own trigger, so the same track behaves differently
// in each campaign rather than being one mechanic under six names.
// =============================================================================

export const EROSION_MAX = 10;

export function emptyHardState() {
  return { enabled: false, erosion: 0 };
}

export function erosionFromChoice(campaignId, choice) {
  const c = CAMPAIGNS[campaignId];
  if (!c || !choice || !choice.erodes) return 0;
  const triggers = Array.isArray(choice.erodes) ? choice.erodes : [choice.erodes];
  return triggers.includes(c.hardMode.trigger) ? (choice.erosionWeight ?? 1) : 0;
}

export function applyErosion(hardState, campaignId, choice) {
  if (!hardState.enabled) return hardState;
  const delta = erosionFromChoice(campaignId, choice);
  if (!delta) return hardState;
  return { ...hardState, erosion: Math.min(EROSION_MAX, hardState.erosion + delta) };
}

export function hardModeForcesEnding(hardState) {
  return hardState.enabled && hardState.erosion >= EROSION_MAX;
}

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

// =============================================================================
// CHOICE RESOLUTION
// =============================================================================

/** Weighted roll over choice.uncertain[]. Weights must sum to 100. */
export function rollUncertain(uncertain, rng = Math.random) {
  const total = uncertain.reduce((s, b) => s + b.weight, 0);
  let r = rng() * total;
  for (const branch of uncertain) {
    r -= branch.weight;
    if (r <= 0) return branch;
  }
  return uncertain[uncertain.length - 1];
}

/**
 * Apply a choice. Returns the next node id and updated state.
 *
 * Order matters and matches the handover's description of handleChoose:
 * impact is applied first, then nextIf is evaluated against POST-choice meters,
 * then next is the fallthrough.
 */
export function chooseNext(campaignId, choice, flags, meters, hardState, rng = Math.random) {
  let branch = null;
  if (choice.uncertain && choice.uncertain.length) {
    branch = rollUncertain(choice.uncertain, rng);
  }

  const impact = branch?.impact ?? choice.impact;
  const setFlags = { ...(choice.setFlags ?? {}), ...(branch?.setFlags ?? {}) };

  const nextMeters = applyImpact(meters, impact);
  const nextFlags = { ...flags, ...setFlags };
  const nextHard = applyErosion(hardState, campaignId, choice);

  let nextId = branch?.next ?? null;
  if (!nextId && typeof choice.nextIf === "function") {
    nextId = choice.nextIf(nextMeters, nextFlags) ?? null;
  }
  if (!nextId) nextId = choice.next ?? null;

  if (hardModeForcesEnding(nextHard)) {
    const forced = CAMPAIGNS[campaignId]?.hardMode?.forcedEndingId;
    if (forced) nextId = forced;
  }

  return {
    nextId,
    flags: nextFlags,
    meters: nextMeters,
    hardState: nextHard,
    branch,
    outcome: branch?.outcome ?? choice.outcome ?? null,
    aftermath: branch?.aftermath ?? choice.aftermath ?? null,
  };
}

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
    cur = hist[0].next ?? null;
  }
  return { path };
}

// =============================================================================
// NODE ID CONVENTION — spec §13.7
// =============================================================================

export const NODE_ID_PATTERN = /^(ohl|gqg|stavka|bef|aok|otto)_(19(?:1[4-8]))_(\d{2})_([a-z0-9]+)$/;
export const ENDING_ID_PATTERN = /^(ohl|gqg|stavka|bef|aok|otto)_end_([a-z0-9]+)$/;

export function isValidNodeId(id) {
  return NODE_ID_PATTERN.test(id) || ENDING_ID_PATTERN.test(id);
}

// =============================================================================
// UI_LAYER
// =============================================================================
//
// Deliberately empty. Blocked on art direction (spec §13.8). Validators split
// this file on the UI_LAYER marker above; everything below it is render code and
// is not evaluated by data validators.
// =============================================================================
