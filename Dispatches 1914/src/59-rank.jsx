// =============================================================================
// EASY MODE NAMES AND THE COMMAND RANK
// =============================================================================
//
// The easy mode is named for a famous machine of each army, as the other games' easy modes are. The rank is a score out of
// 100 in seven parts, shown on the end screen with its parts, so a player can see what it was made of. Most of it is territory and
// power: the ground the command holds at the close and the three meters it has left. It is a judgment about how the command fared, not
// a historical claim: the ground and the tier given to each ending below are the game's own reading of how that ending left the army and
// the state, and they are checked (check-rank.js) so that every ending has both.
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
  gqg_end_negotiated: 2,
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

/**
 * The ground the command holds when the file closes, judged against its own territory at the start of the war: 0 the heartland invaded or the
 * capital lost, 1 a large part of the territory lost or given up, 2 the homeland held with some border, colonial or imperial losses, 3 all of its
 * own ground held or recovered. A game judgment from each ending's text, not a map measurement (the front on the map is drawn from the record).
 */
export const ENDING_GROUND = {
  ohl_end_armistice: 2,
  ohl_end_homefirst: 2,
  ohl_end_armyfirst: 1,
  ohl_end_holdout: 2,
  ohl_end_negotiated: 3,
  ohl_end_worseterms: 1,
  ohl_end_intact: 2,
  ohl_end_dictated: 2,
  ohl_end_relieved: 1,
  gqg_end_victory: 3,
  gqg_end_armybreaks: 0,
  gqg_end_coalitionfails: 1,
  gqg_end_costlier: 3,
  gqg_end_intact: 3,
  gqg_end_defensive: 2,
  gqg_end_negotiated: 1,
  gqg_end_paris: 0,
  gqg_end_relieved: 1,
  stavka_end_brest: 1,
  stavka_end_disintegration: 1,
  stavka_end_dissolved: 0,
  stavka_end_civilwar: 0,
  stavka_end_holds: 2,
  stavka_end_separate: 2,
  stavka_end_steadied: 3,
  stavka_end_alliance: 2,
  stavka_end_relieved: 1,
  bef_end_victory: 3,
  bef_end_ports: 0,
  bef_end_haigsacked: 3,
  bef_end_shipping: 1,
  bef_end_easterners: 2,
  bef_end_bitehold: 2,
  bef_end_reserve: 3,
  bef_end_volunteers: 2,
  bef_end_relieved: 2,
  aok_end_dissolution: 1,
  aok_end_separate: 1,
  aok_end_satellite: 1,
  aok_end_galiciafirst: 2,
  aok_end_piave: 2,
  aok_end_relieved: 1,
  otto_end_mudros: 1,
  otto_end_straits: 0,
  otto_end_core: 2,
  otto_end_stand: 1,
  otto_end_overextended: 0,
};

// the endings added in 45-more-endings.jsx carry their own tier and ground
for (const e of MORE_ENDINGS) {
  ENDING_TIER[e.id] = e.tier;
  ENDING_GROUND[e.id] = e.ground;
}

/** The staff part of the rank: a base of 6, two points for each of two trusted advisers, and a loss for each adviser who has gone or gone quiet. */
export const STAFF_SCORE = { base: 6, trusted: 2, trustedMax: 2, gone: 3, quiet: 1.5, max: 10 };

/** Rank titles by the score they start at. The easy mode cannot rise past EASY_RANK_CAP (an index into RANKS). */
export const RANKS = [
  { min: 0, title: "Staff Captain" },
  { min: 35, title: "Major" },
  { min: 50, title: "Colonel" },
  { min: 65, title: "General" },
  { min: 82, title: "Field Marshal" },
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

/** The staff part: { points, note } from the file's trust flags (69-trust.jsx). */
export function staffScore(campaignId, flags) {
  const list = (CAMPAIGNS[campaignId] && CAMPAIGNS[campaignId].advisors) || [];
  let trusted = 0, gone = 0, quiet = 0;
  for (const adv of list) {
    const st = adviserState(flags || {}, adv.id);
    if (st === "trusted") trusted++;
    else if (st === "gone") gone++;
    else if (st === "quiet") quiet++;
  }
  const raw = STAFF_SCORE.base + STAFF_SCORE.trusted * Math.min(trusted, STAFF_SCORE.trustedMax) - STAFF_SCORE.gone * gone - STAFF_SCORE.quiet * quiet;
  const points = Math.max(0, Math.min(STAFF_SCORE.max, Math.round(raw)));
  const bits = [];
  if (trusted) bits.push(`${trusted} trusted`);
  if (quiet) bits.push(`${quiet} gone quiet`);
  if (gone) bits.push(`${gone} relieved`);
  return { points, note: bits.length ? bits.join(", ") : "no adviser trusted or lost" };
}

/**
 * The command rank for a closed file. `taken` is the list of { node, choice } the run gave, `flags` the file's flags (the advisers' trust).
 * Returns { score, rank, parts }, where each part is { id, label, points, max, note }. Seven parts, 100 at their best: the ground held
 * (30, the ending's rating and up to two places either way from the ledger in 43-map-ground.jsx) and the power left (20, and 10 for nothing run dry) are most of it; the staff kept (10), the ending's tier (10), restraint (10) and
 * the mode (10) make up the rest.
 */
export function rankFor({ campaignId, endingId, meters, hardState, easy, taken, flags }) {
  const m = meters || emptyMeters();
  const mode = modeOf(hardState, easy);
  const sum = METER_AXES.reduce((s, a) => s + m[a], 0);
  const power = Math.max(0, Math.min(20, Math.round((sum + 30) / 3)));
  const ground = ENDING_GROUND[endingId] ?? 1;
  const tally = groundTally(campaignId, flags);
  const groundPoints = Math.max(0, Math.min(30, ground * 10 + Math.max(-4, Math.min(4, 2 * tally.net))));
  const tier = ENDING_TIER[endingId] ?? 1;
  const dry = METER_AXES.filter((a) => m[a] <= -5).length;
  const reserves = Math.max(0, 10 - 4 * dry);
  const costly = costlyOrders(campaignId, taken);
  const restraint = Math.max(0, 10 - 2 * costly);
  const modePoints = { easy: 4, standard: 7, hard: 10 }[mode];
  const staff = staffScore(campaignId, flags);
  const parts = [
    { id: "territory", label: "Ground held", points: groundPoints, max: 30, note: ["the heartland invaded or the capital lost", "a large part of the territory lost", "the homeland held, with some losses", "all of its own ground held or recovered"][ground] + (tally.gained || tally.lost ? `; ${tally.gained} place${tally.gained === 1 ? "" : "s"} held or taken beyond the record, ${tally.lost} lost or not taken` : "") },
    { id: "power", label: "Power at the close", points: power, max: 20, note: `the three meters together stood at ${sum > 0 ? "+" : ""}${sum}` },
    { id: "reserves", label: "Nothing run dry", points: reserves, max: 10, note: dry ? `${dry} meter${dry === 1 ? "" : "s"} ended at -5 or worse` : "no meter ended at -5 or worse" },
    { id: "staff", label: "The staff kept", points: staff.points, max: 10, note: staff.note },
    { id: "ending", label: "The ending", points: Math.round((tier * 10) / 3), max: 10, note: ["a ruin", "a poor ending", "an ending near the record", "better than the record"][tier] },
    { id: "restraint", label: "Restraint", points: restraint, max: 10, note: costly ? `${costly} order${costly === 1 ? "" : "s"} that cost the command standing` : "no order that cost the command standing" },
    { id: "mode", label: "The mode", points: modePoints, max: 10, note: { easy: "easy mode", standard: "standard mode", hard: "hard mode" }[mode] },
  ];
  const score = parts.reduce((s, p) => s + p.points, 0);
  let idx = 0;
  RANKS.forEach((r, i) => {
    if (score >= r.min) idx = i;
  });
  if (mode === "easy") idx = Math.min(idx, EASY_RANK_CAP);
  return { score, rank: RANKS[idx].title, parts, mode };
}
