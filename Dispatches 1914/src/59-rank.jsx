// =============================================================================
// EASY MODE NAMES AND THE COMMAND RANK
// =============================================================================
//
// The easy mode is named for a famous machine of each army, as the other games' easy modes are. The rank is a score out of
// 100 in five parts, shown on the end screen with its parts, so a player can see what it was made of. It is a judgment
// about how the command fared, not a historical claim: the tier given to each ending below is the game's own reading of how
// that ending left the army and the state, and it is checked (check-rank.js) so that every ending has one.
// =============================================================================

/** The easy mode of each command, by the gun, aeroplane or vehicle the army was known for. */
export const EASY_NAMES = {
  ohl: "Big Bertha",
  gqg: "Soixante-Quinze",
  stavka: "Ilya Muromets",
  bef: "Mother",
  aok: "Skoda",
  otto: "Yildirim",
};

/**
 * How each ending left the command: 0 ruin, 1 poor, 2 as the record left it (or an acceptable counterfactual), 3 better than the
 * record. A game judgment, not a claim about history.
 */
export const ENDING_TIER = {
  ohl_end_armistice: 2,
  ohl_end_homefirst: 1,
  ohl_end_armyfirst: 1,
  ohl_end_holdout: 1,
  ohl_end_negotiated: 3,
  ohl_end_worseterms: 1,
  ohl_end_intact: 3,
  ohl_end_dictated: 2,
  ohl_end_relieved: 0,
  gqg_end_victory: 2,
  gqg_end_armybreaks: 0,
  gqg_end_coalitionfails: 1,
  gqg_end_costlier: 1,
  gqg_end_intact: 3,
  gqg_end_defensive: 2,
  gqg_end_negotiated: 3,
  gqg_end_paris: 0,
  gqg_end_relieved: 0,
  stavka_end_brest: 2,
  stavka_end_disintegration: 1,
  stavka_end_dissolved: 0,
  stavka_end_civilwar: 0,
  stavka_end_holds: 3,
  stavka_end_separate: 1,
  stavka_end_steadied: 3,
  stavka_end_alliance: 2,
  stavka_end_relieved: 0,
  bef_end_victory: 2,
  bef_end_ports: 0,
  bef_end_haigsacked: 2,
  bef_end_shipping: 1,
  bef_end_easterners: 2,
  bef_end_bitehold: 2,
  bef_end_reserve: 3,
  bef_end_volunteers: 1,
  bef_end_relieved: 0,
  aok_end_dissolution: 2,
  aok_end_separate: 1,
  aok_end_satellite: 1,
  aok_end_galiciafirst: 2,
  aok_end_piave: 2,
  aok_end_relieved: 0,
  otto_end_mudros: 2,
  otto_end_straits: 0,
  otto_end_core: 2,
  otto_end_stand: 1,
  otto_end_overextended: 0,
};

/** Rank titles by the score they start at. The easy mode cannot rise past EASY_RANK_CAP (an index into RANKS). */
export const RANKS = [
  { min: 0, title: "Staff Captain" },
  { min: 35, title: "Major" },
  { min: 50, title: "Colonel" },
  { min: 65, title: "General" },
  { min: 80, title: "Field Marshal" },
];
export const EASY_RANK_CAP = 3;

/** "easy", "hard" or "standard": the mode a run was played in. */
export function modeOf(hardState, easy) {
  return hardState && hardState.enabled ? "hard" : easy ? "easy" : "standard";
}

/** The orders a run gave that the command's own hard-mode track counts against it (the same tag the erosion track uses). */
export function costlyOrders(campaignId, taken) {
  const c = CAMPAIGNS[campaignId];
  if (!c || !Array.isArray(taken)) return 0;
  let n = 0;
  for (const t of taken) {
    const node = c.nodes[t && t.node];
    const choice = node && (node.choices || []).find((ch) => ch.id === t.choice);
    if (choice && erosionFromChoice(campaignId, choice)) n += 1;
  }
  return n;
}

/**
 * The command rank for a closed file. `taken` is the list of { node, choice } the run gave. Returns { score, rank, parts }, where each
 * part is { id, label, points, max, note }.
 */
export function rankFor({ campaignId, endingId, meters, hardState, easy, taken }) {
  const m = meters || emptyMeters();
  const mode = modeOf(hardState, easy);
  const sum = METER_AXES.reduce((s, a) => s + m[a], 0);
  const standing = Math.max(0, Math.min(30, Math.round((sum + 30) / 2)));
  const tier = ENDING_TIER[endingId] ?? 1;
  const dry = METER_AXES.filter((a) => m[a] <= -5).length;
  const reserves = Math.max(0, 15 - 5 * dry);
  const costly = costlyOrders(campaignId, taken);
  const restraint = Math.max(0, 10 - 2 * costly);
  const modePoints = { easy: 5, standard: 10, hard: 15 }[mode];
  const parts = [
    { id: "standing", label: "Standing at the close", points: standing, max: 30, note: `the three meters together stood at ${sum > 0 ? "+" : ""}${sum}` },
    { id: "ending", label: "The ending", points: tier * 10, max: 30, note: ["a ruin", "a poor ending", "an ending near the record", "better than the record"][tier] },
    { id: "reserves", label: "Nothing run dry", points: reserves, max: 15, note: dry ? `${dry} meter${dry === 1 ? "" : "s"} ended at -5 or worse` : "no meter ended at -5 or worse" },
    { id: "restraint", label: "Restraint", points: restraint, max: 10, note: costly ? `${costly} order${costly === 1 ? "" : "s"} that cost the command standing` : "no order that cost the command standing" },
    { id: "mode", label: "The mode", points: modePoints, max: 15, note: { easy: "easy mode", standard: "standard mode", hard: "hard mode" }[mode] },
  ];
  const score = parts.reduce((s, p) => s + p.points, 0);
  let idx = 0;
  RANKS.forEach((r, i) => {
    if (score >= r.min) idx = i;
  });
  if (mode === "easy") idx = Math.min(idx, EASY_RANK_CAP);
  return { score, rank: RANKS[idx].title, parts, mode };
}
