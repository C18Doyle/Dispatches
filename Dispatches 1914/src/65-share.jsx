// =============================================================================
// THE SHAREABLE FILE
// =============================================================================
//
// What a closed file says about itself in a few lines: the command, the ending and how it is badged, the rank, how many orders were given and
// how many of them were contested or planned as battles, and the orders that left the record. The card on the ending screen (99-share-screen.jsx)
// shows it, copies it as text, saves it as an image or prints it. Nothing here is saved: it is read from the run that has just ended.
// =============================================================================

const SHARE_LABEL_MAX = 84;

/** A choice's label, cut to a single line for the card. */
function shareLabel(label) {
  const s = String(label || "").replace(/\s+/g, " ").trim();
  if (s.length <= SHARE_LABEL_MAX) return s;
  const cut = s.slice(0, SHARE_LABEL_MAX - 1);
  return cut.slice(0, Math.max(cut.lastIndexOf(" "), 40)).replace(/[,;:]$/, "") + "…";
}

/**
 * The summary of a closed file. `taken` is the run's list of { node, choice }, `flags` its flags (the fought battles leave bx_<id>_grade),
 * `rank` the result of rankFor and `mode` "easy", "standard" or "hard". Returns the lines for the card and the plain text.
 */
export function shareSummary({ campaignId, endingId, rank, taken, flags, mode }) {
  const camp = CAMPAIGNS[campaignId];
  const ending = camp.nodes[endingId];
  const orders = Array.isArray(taken) ? taken : [];
  let contested = 0;
  const departures = [];
  for (const t of orders) {
    const node = camp.nodes[t.node];
    const choice = node && (node.choices || []).find((c) => c.id === t.choice);
    if (!choice) continue;
    if (choice.uncertain && choice.uncertain.length) contested++;
    if (!choice.historical) departures.push({ node: node.title, label: shareLabel(choice.label) });
  }
  const battles = Object.keys(BATTLES).filter((id) => flags && flags[`bx_${id}_grade`]).length;
  const badge = ending && ending.ending ? BADGE_LABELS[ending.ending.badge] || "" : "";
  const modeWord = { easy: "easy mode", standard: "standard mode", hard: "hard mode" }[mode] || "standard mode";
  const facts = [
    `${orders.length} ${orders.length === 1 ? "order" : "orders"} given`,
    `${contested} contested`,
    `${battles} ${battles === 1 ? "battle" : "battles"} planned`,
    `${departures.length} ${departures.length === 1 ? "departure" : "departures"} from the record`,
  ];
  const shown = departures.slice(0, 3);
  const lines = {
    game: "Dispatches 1914",
    command: camp.name,
    ending: ending ? ending.title : "",
    badge,
    rank: rank ? rank.rank : "",
    score: rank ? rank.score : 0,
    mode: modeWord,
    facts,
    departures: shown,
    more: departures.length - shown.length,
  };
  const text = [
    `Dispatches 1914: ${lines.command}`,
    `Ending: ${lines.ending}${badge ? ` (${badge.toLowerCase()})` : ""}`,
    rank ? `Rank: ${lines.rank}, ${lines.score} out of 100 (${modeWord})` : `Played in ${modeWord}`,
    facts.join(", ") + ".",
    ...(shown.length ? ["", "Orders that left the record:", ...shown.map((d) => `- ${d.node}: ${d.label}`)] : []),
    ...(lines.more > 0 ? [`- and ${lines.more} more`] : []),
  ].join("\n");
  return { ...lines, text };
}
