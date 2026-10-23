// =============================================================================
// THE CONDITIONS OF A REPORT
// =============================================================================
//
// What a headquarters knew about the state of things when a report reached it, apart from the decision: how old the news was, the weather the month usually brings,
// the guns that had been fired. These tables are MODELLED, not recorded: the age of the reports is a figure for the means of communication of each command in each
// period (telephone and wireless on the German and French fronts, couriers and a wireless sent in the clear on the Russian, long distances for the Ottoman staff),
// and the weather is the usual weather of the command's main theatre in the month, not the weather of the day. The guns are different: each is a figure from the
// histories, with the source named, and is shown only on the report it belongs to. check-conditions.js proves the tables are whole and the figures sourced.
// =============================================================================

/** Hours that the news a headquarters acts on has already been travelling, by command: [from this year, hours]. */
export const COMMS = {
  ohl: [[1914, 8], [1916, 6], [1917, 5]],
  gqg: [[1914, 10], [1916, 6], [1917, 5]],
  stavka: [[1914, 30], [1915, 24], [1917, 36]],
  bef: [[1914, 10], [1916, 6], [1917, 5]],
  aok: [[1914, 20], [1915, 14], [1917, 12]],
  otto: [[1914, 48], [1916, 40], [1917, 60]],
};
/** A file that sends its signals in the clear gets its news this much sooner (and is overheard: see SIGNALS_EXPOSURE in 55-choose.jsx). */
export const CLEAR_SPEEDUP = 0.7;

/** How old the news is on a report, for a command, on a date (Western calendar), for a file with these flags: { hours, text }. */
export function reportAge(campaignId, iso, flags) {
  const rows = COMMS[campaignId] || [[1914, 12]];
  const year = Number(String(iso).slice(0, 4));
  let hours = rows[0][1];
  for (const [from, h] of rows) if (year >= from) hours = h;
  if (flags && flags.sig_clear) hours = Math.round(hours * CLEAR_SPEEDUP);
  const text = hours < 24 ? hours + " hours old" : hours < 36 ? "a day old" : hours < 60 ? "two days old" : "more than two days old";
  return { hours, text };
}

/** The usual weather of each command's main theatre, month by month. */
const WEST = ["Hard frost", "Frost and fog", "Thaw and mud", "Showers", "Fine, with showers", "Warm", "Warm", "Warm, with storms", "Fine, cooling", "Rain", "Rain and mud", "Frost"];
const EAST = ["Hard frost", "Hard frost and snow", "Thaw and mud", "Mud: the roads are rivers", "Fine", "Warm", "Hot", "Hot", "Fine", "Rain: the rasputitsa begins", "Mud and the first frost", "Frost and snow"];
const ANATOLIA = ["Snow and deep cold", "Snow and deep cold", "Snow melting", "Rain", "Fine", "Hot", "Very hot", "Very hot", "Hot and dry", "Cool, snow in the hills", "Snow on the passes", "Snow and deep cold"];
export const WEATHER = { ohl: WEST, gqg: WEST, bef: WEST, stavka: EAST, aok: EAST, otto: ANATOLIA };

/** The usual weather for the month on a date (Western calendar), in the command's main theatre. */
export function usualWeather(campaignId, iso) {
  const m = Number(String(iso).slice(5, 7)) - 1;
  const table = WEATHER[campaignId];
  return table && m >= 0 && m < 12 ? table[m] : "";
}

/**
 * The guns of the great bombardments, on the report where the order to fire them is given: [the report, what was fired, the source]. Each is a figure from the
 * histories (the sources disagree a little, and the line says "about" or "more than"), shown on that report only.
 */
export const BOMBARDMENTS = {
  bef_1916_11_somme: { text: "Over 1.5 million shells in the week before the attack, about two thirds of them shrapnel", source: "Imperial War Museum, the Somme" },
  ohl_1918_09_michael: { text: "More than a million shells in the first five hours", source: "Mental Floss, from the German accounts (1.16 million; another count gives 1.1 million)" },
  bef_1917_15_ypres3: { text: "About 4.25 million shells since 18 July", source: "Long Way to Tipperary, University of Limerick (other sources give 4.5 million and a start on the 15th or 16th)" },
};

/** The line about the guns on a report, or "". */
export function bombardmentAt(nodeId) {
  return BOMBARDMENTS[nodeId] ? BOMBARDMENTS[nodeId].text : "";
}
