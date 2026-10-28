// =============================================================================
// THE FRONT THROUGH TIME
// =============================================================================
//
// What the front map draws on a given date. The country outlines are modern (Natural Earth), so each country is given the side it stood on
// by date (MAP_ALLEGIANCE), and the territory that changed hands inside a country is an overlay (MAP_OVERLAYS): a polygon, clipped to the
// countries it names, that holds from one date to another and takes the side that held it. An overlay's `line` is the front it draws. Lines are
// approximate, drawn from the course of the fighting and not surveyed: the map says so. Dates are Western; the Russian command's are
// brought to them (13 days) by mapDate. Coordinates are [longitude, latitude].
//
// side: "cp" (the Central Powers), "ent" (the Entente and its associates), "neu" (neutral or independent).
// =============================================================================

const POLY = (line, close) => [...line, ...close];

/** Which side a country stood on, by date: [[from, side], ...] in order. A country not listed here is neutral. */
export const MAP_ALLEGIANCE = {
  Germany: [["1914-01-01", "cp"]], Austria: [["1914-01-01", "cp"]], Hungary: [["1914-01-01", "cp"]], Czechia: [["1914-01-01", "cp"]],
  Slovakia: [["1914-01-01", "cp"]], Slovenia: [["1914-01-01", "cp"]], Croatia: [["1914-01-01", "cp"]], "Bosnia and Herz.": [["1914-01-01", "cp"]],
  Turkey: [["1914-01-01", "cp"]], Syria: [["1914-01-01", "cp"]], Lebanon: [["1914-01-01", "cp"]], Israel: [["1914-01-01", "cp"]],
  Palestine: [["1914-01-01", "cp"]], Jordan: [["1914-01-01", "cp"]], Iraq: [["1914-01-01", "cp"]],
  Bulgaria: [["1914-01-01", "neu"], ["1915-10-14", "cp"], ["1918-09-30", "neu"]],
  Luxembourg: [["1914-01-01", "neu"], ["1914-08-02", "cp"], ["1918-11-11", "neu"]],
  France: [["1914-01-01", "ent"]], "United Kingdom": [["1914-01-01", "ent"]], Ireland: [["1914-01-01", "ent"]], "Isle of Man": [["1914-01-01", "ent"]],
  Belgium: [["1914-01-01", "ent"]], Russia: [["1914-01-01", "ent"]], Belarus: [["1914-01-01", "ent"]], Poland: [["1914-01-01", "ent"]],
  Lithuania: [["1914-01-01", "ent"]], Latvia: [["1914-01-01", "ent"]], Estonia: [["1914-01-01", "ent"]], Moldova: [["1914-01-01", "ent"]],
  Georgia: [["1914-01-01", "ent"]], Armenia: [["1914-01-01", "ent"]], Azerbaijan: [["1914-01-01", "ent"]], Kazakhstan: [["1914-01-01", "ent"]],
  Ukraine: [["1914-01-01", "ent"], ["1918-03-01", "cp"], ["1918-11-12", "neu"]],
  Finland: [["1914-01-01", "ent"], ["1917-12-06", "neu"]],
  Serbia: [["1914-01-01", "ent"], ["1915-11-30", "cp"], ["1918-11-01", "ent"]],
  Montenegro: [["1914-01-01", "ent"], ["1916-01-17", "cp"], ["1918-11-01", "ent"]],
  Kosovo: [["1914-01-01", "ent"], ["1915-10-15", "cp"], ["1918-09-30", "ent"]],
  Macedonia: [["1914-01-01", "ent"], ["1915-10-15", "cp"], ["1918-09-30", "ent"]],
  Italy: [["1914-01-01", "neu"], ["1915-05-23", "ent"]],
  Romania: [["1914-01-01", "neu"], ["1916-08-27", "ent"]],
  Greece: [["1914-01-01", "neu"], ["1917-06-29", "ent"]],
  Egypt: [["1914-01-01", "ent"]], Cyprus: [["1914-01-01", "ent"]], "N. Cyprus": [["1914-01-01", "ent"]], Libya: [["1914-01-01", "neu"], ["1915-05-23", "ent"]],
  Sudan: [["1914-01-01", "ent"]],
};

// ---- the Western Front: territory held by the Central Powers, east of the line (France, Belgium, Luxembourg) ----
const WEST_MASK = ["France", "Belgium", "Luxembourg"];
const WEST_CLOSE = [[9.5, 47.3], [9.5, 52.0], [2.0, 52.0]];
const westFront = (id, from, to, line) => ({ id, side: "cp", from, to, mask: WEST_MASK, poly: POLY(line, WEST_CLOSE), line });

// ---- the Eastern Front: territory held by the Central Powers, west of the line ----
const EAST_MASK = ["Poland", "Lithuania", "Latvia", "Estonia", "Belarus", "Ukraine", "Moldova", "Russia"];
const EAST_CLOSE = [[10.0, 44.0], [10.0, 59.0]];
const eastFront = (id, from, to, line) => ({ id, side: "cp", from, to, mask: EAST_MASK, poly: POLY(line, EAST_CLOSE), line });

// Near East: territory held by the Entente, on the far side of a line (to the south and east).
const iraqFront = (id, from, to, line, close) => ({ id, side: "ent", from, to, mask: ["Iraq"], poly: POLY(line, close), line });
const palFront = (id, from, to, line, close) => ({ id, side: "ent", from, to, mask: ["Israel", "Palestine", "Jordan", "Lebanon", "Syria"], poly: POLY(line, close), line });

export const MAP_OVERLAYS = {
  europe: [
    // Belgium, first days
    westFront("w0", "1914-08-04", "1914-08-19", [[5.0, 51.45], [5.2, 50.5], [5.8, 49.6]]),
    westFront("w1", "1914-08-20", "1914-09-13", [[2.9, 51.2], [2.6, 50.6], [2.2, 49.9], [2.5, 49.3], [3.0, 48.95], [3.9, 48.85], [4.9, 48.8], [5.5, 48.6], [6.4, 48.55], [6.9, 48.2], [7.3, 47.8], [7.5, 47.55]]),
    westFront("w2", "1914-09-14", "1918-03-20", [[2.75, 51.13], [2.88, 50.85], [2.9, 50.62], [2.8, 50.3], [2.7, 50.0], [2.95, 49.9], [3.0, 49.6], [3.3, 49.4], [4.0, 49.3], [4.9, 49.2], [5.4, 49.15], [5.55, 48.9], [6.0, 48.95], [6.5, 48.6], [7.0, 48.1], [7.3, 47.75], [7.5, 47.55]]),
    westFront("w3", "1918-03-21", "1918-07-17", [[2.75, 51.13], [2.85, 50.7], [2.6, 50.4], [2.35, 49.95], [2.55, 49.6], [3.0, 49.35], [3.45, 49.04], [4.1, 49.1], [5.0, 49.1], [5.55, 48.9], [6.0, 48.95], [6.5, 48.6], [7.0, 48.1], [7.3, 47.75], [7.5, 47.55]]),
    westFront("w4", "1918-07-18", "1918-09-30", [[2.85, 51.1], [2.95, 50.7], [3.0, 50.3], [3.2, 49.9], [3.4, 49.55], [3.7, 49.35], [4.2, 49.3], [5.0, 49.2], [5.55, 48.9], [6.0, 48.95], [6.5, 48.6], [7.0, 48.1], [7.3, 47.75], [7.5, 47.55]]),
    westFront("w5", "1918-10-01", "1918-11-11", [[3.2, 51.2], [3.5, 50.7], [3.8, 50.4], [4.2, 50.1], [4.7, 49.8], [5.2, 49.5], [5.5, 49.1], [5.6, 48.9], [6.0, 48.95], [6.5, 48.6], [7.0, 48.1], [7.3, 47.75], [7.5, 47.55]]),
    // Eastern Front
    eastFront("e1", "1914-08-01", "1914-09-02", [[21.07, 56.0], [21.07, 55.35], [22.55, 54.64], [22.9, 54.2], [22.3, 53.7], [20.3, 53.5], [19.9, 52.8], [19.0, 52.7], [18.1, 52.0], [18.6, 51.0], [19.4, 50.4], [20.5, 50.3], [21.5, 50.3], [22.7, 50.4], [24.0, 50.45], [25.3, 50.1], [26.2, 49.55], [26.4, 48.5], [26.6, 48.2]]),
    eastFront("e2", "1914-09-03", "1915-04-30", [[21.07, 56.0], [21.1, 55.4], [22.3, 54.7], [22.9, 54.2], [22.3, 53.6], [20.8, 53.2], [20.2, 52.4], [20.2, 51.6], [20.5, 50.7], [20.9, 50.1], [22.0, 49.9], [22.7, 49.3], [23.4, 48.8], [24.8, 48.4], [26.0, 48.0]]),
    eastFront("e3", "1915-05-01", "1915-08-04", [[21.07, 56.0], [21.4, 55.3], [22.6, 54.7], [23.2, 54.2], [22.5, 53.7], [21.9, 53.0], [21.3, 52.2], [21.8, 51.2], [22.2, 50.6], [23.0, 50.2], [24.0, 49.9], [24.6, 49.3], [25.4, 48.6], [26.0, 48.2]]),
    eastFront("e4", "1915-08-05", "1916-06-03", [[23.5, 57.1], [24.2, 56.7], [25.5, 56.0], [26.5, 55.7], [26.2, 54.7], [25.3, 54.3], [25.0, 53.5], [26.1, 52.1], [26.0, 51.1], [25.5, 50.3], [25.6, 49.5], [26.2, 48.3]]),
    eastFront("e5", "1916-06-04", "1916-11-30", [[23.5, 57.1], [24.2, 56.7], [25.5, 56.0], [26.5, 55.7], [26.2, 54.7], [25.3, 54.3], [25.0, 53.5], [26.1, 52.1], [25.5, 51.2], [25.3, 50.7], [25.6, 49.7], [25.4, 48.9], [25.9, 48.3]]),
    eastFront("e6", "1916-12-01", "1917-08-31", [[23.5, 57.1], [24.2, 56.7], [25.5, 56.0], [26.5, 55.7], [26.2, 54.7], [25.3, 54.3], [25.0, 53.5], [26.1, 52.1], [25.5, 51.2], [25.3, 50.7], [25.6, 49.7], [25.9, 48.5], [27.0, 47.5], [27.3, 45.8], [28.0, 45.3]]),
    eastFront("e7", "1917-09-01", "1918-02-17", [[24.0, 58.0], [24.6, 57.3], [25.6, 56.4], [26.5, 55.7], [26.2, 54.7], [25.3, 54.3], [25.0, 53.5], [26.1, 52.1], [25.5, 51.2], [25.3, 50.7], [25.6, 49.7], [25.9, 48.5], [27.0, 47.5], [27.3, 45.8], [28.0, 45.3]]),
    eastFront("e8", "1918-02-18", "1918-11-11", [[28.0, 59.4], [28.5, 57.6], [29.5, 56.0], [30.8, 54.5], [31.6, 52.6], [31.2, 50.6], [32.8, 49.0], [34.5, 47.6], [35.0, 46.2]]),
    // the Italian front: the Austrian lands that were Italian in name, and the ground lost at Caporetto
    { id: "trentino", side: "cp", from: "1914-08-01", to: "1918-11-03", mask: ["Italy"], poly: [[10.4, 46.0], [10.4, 47.1], [12.5, 47.1], [12.3, 46.5], [11.95, 46.0], [11.2, 45.7]] },
    { id: "trieste", side: "cp", from: "1914-08-01", to: "1918-11-03", mask: ["Italy"], poly: [[13.2, 45.55], [13.2, 46.15], [13.95, 46.1], [13.95, 45.5]] },
    { id: "piave", side: "cp", from: "1917-10-28", to: "1918-11-03", mask: ["Italy"], line: [[11.7, 46.5], [11.9, 46.0], [12.2, 45.85], [12.45, 45.7], [12.6, 45.5]], poly: POLY([[11.7, 46.5], [11.9, 46.0], [12.2, 45.85], [12.45, 45.7], [12.6, 45.5]], [[14.5, 45.4], [14.5, 46.8], [11.7, 46.8]]) },
    // Transylvania was Hungarian; the south and west of Romania fell in 1916
    { id: "transylvania", side: "cp", from: "1914-08-01", to: "1918-11-09", mask: ["Romania"], poly: [[20.2, 46.3], [21.5, 47.9], [23.0, 48.0], [25.0, 47.9], [26.7, 47.6], [26.5, 46.0], [25.5, 45.4], [24.0, 45.2], [22.5, 44.7], [21.2, 44.9], [20.3, 45.3]] },
    { id: "romania16", side: "cp", from: "1916-12-06", to: "1918-11-09", mask: ["Romania"], line: [[26.6, 47.9], [27.0, 46.5], [27.3, 45.6], [28.4, 45.0]], poly: POLY([[26.6, 47.9], [27.0, 46.5], [27.3, 45.6], [28.4, 45.0]], [[28.4, 43.0], [20.0, 43.0], [20.0, 48.5]]) },
    // East Prussia: Russian in the modern atlas
    { id: "prussia", side: "cp", from: "1914-08-01", to: "1918-11-11", mask: ["Russia"], poly: [[19.5, 54.2], [19.5, 55.4], [22.9, 55.4], [22.9, 54.2]] },
  ],
  nearEast: [
    // Mesopotamia
    iraqFront("m1", "1914-11-22", "1915-09-27", [[46.1, 30.2], [47.0, 31.3], [48.6, 31.4]], [[51, 30], [51, 28], [46, 28]]),
    iraqFront("m2", "1915-09-28", "1916-04-28", [[45.2, 32.0], [46.2, 32.6], [47.4, 32.6], [48.5, 31.5]], [[51, 30], [51, 28], [45, 28]]),
    iraqFront("m3", "1916-04-29", "1917-03-10", [[46.2, 31.7], [47.3, 32.0], [48.6, 31.6]], [[51, 30], [51, 28], [46, 28]]),
    iraqFront("m4", "1917-03-11", "1918-10-22", [[43.6, 34.0], [45.5, 34.4], [47.0, 33.9]], [[51, 33], [51, 28], [43, 28]]),
    iraqFront("m5", "1918-10-23", "1918-11-13", [[41.5, 37.0], [45.0, 37.5]], [[51, 37], [51, 28], [41, 28]]),
    // Sinai and Palestine
    palFront("p1", "1917-11-01", "1917-11-15", [[34.3, 31.6], [34.9, 31.35], [35.4, 31.2]], [[36, 30], [33, 29]]),
    palFront("p2", "1917-11-16", "1917-12-08", [[34.0, 32.2], [35.2, 32.0], [35.6, 31.6], [36.0, 31.2]], [[36.2, 29.5], [33, 29.5]]),
    palFront("p3", "1917-12-09", "1918-09-18", [[34.5, 32.12], [35.3, 32.05], [35.7, 31.9], [36.2, 31.5]], [[36.2, 29.5], [33, 29.5]]),
    palFront("p4", "1918-09-19", "1918-09-30", [[34.0, 32.8], [36.2, 32.7], [36.6, 31.5]], [[36.2, 29.5], [33, 29.5]]),
    palFront("p5", "1918-10-01", "1918-10-25", [[34.5, 34.3], [37.0, 34.4], [38.0, 33.0]], [[38.0, 30], [33, 29.5]]),
    palFront("p6", "1918-10-26", "1918-11-13", [[35.5, 36.4], [38.0, 36.5], [39.0, 35.0]], [[39.0, 30], [33, 29.5]]),
    // the Hejaz: Ottoman until the revolt, and then the coast is the Sharif's while Medina holds
    { id: "hejaz", side: "cp", from: "1914-08-01", to: "1918-11-13", mask: ["Saudi Arabia"], poly: [[34.5, 29.4], [37.0, 30.6], [39.0, 28.5], [42.0, 25.5], [43.0, 22.0], [34.0, 22.0]] },
    { id: "revolt", side: "ent", from: "1916-06-10", to: "1919-01-09", mask: ["Saudi Arabia"], line: [[34.8, 29.0], [36.5, 28.0], [38.5, 24.0], [40.0, 22.0]], poly: POLY([[34.8, 29.0], [36.5, 28.0], [38.5, 24.0], [40.0, 22.0]], [[35.5, 22.0]]) },
    // the Caucasus: Russian ground in Anatolia, and the Ottoman advance of 1918
    { id: "van", side: "ent", from: "1915-05-01", to: "1916-02-15", mask: ["Turkey"], line: [[42.5, 40.5], [42.0, 39.0], [42.6, 38.3], [44.0, 37.5]], poly: POLY([[42.5, 40.5], [42.0, 39.0], [42.6, 38.3], [44.0, 37.5]], [[45, 37.3], [45, 41.0]]) },
    { id: "erzurum", side: "ent", from: "1916-02-16", to: "1918-03-11", mask: ["Turkey"], line: [[39.3, 41.3], [40.2, 40.0], [41.0, 39.0], [41.8, 38.5], [43.5, 37.3]], poly: POLY([[39.3, 41.3], [40.2, 40.0], [41.0, 39.0], [41.8, 38.5], [43.5, 37.3]], [[45, 37.0], [45, 41.5]]) },
    { id: "batum", side: "cp", from: "1918-04-14", to: "1918-06-03", mask: ["Georgia", "Armenia"], line: [[41.5, 42.2], [42.5, 41.4], [43.5, 40.5], [44.0, 39.8]], poly: POLY([[41.5, 42.2], [42.5, 41.4], [43.5, 40.5], [44.0, 39.8]], [[40.0, 39.0], [40.0, 42.5]]) },
    { id: "tiflis", side: "cp", from: "1918-06-04", to: "1918-09-14", mask: ["Georgia", "Armenia", "Azerbaijan"], line: [[44.8, 42.0], [45.2, 41.0], [45.0, 40.0], [44.6, 39.5]], poly: POLY([[44.8, 42.0], [45.2, 41.0], [45.0, 40.0], [44.6, 39.5]], [[40.0, 39.0], [40.0, 42.5]]) },
    { id: "baku", side: "cp", from: "1918-09-15", to: "1918-10-31", mask: ["Georgia", "Armenia", "Azerbaijan"], line: [[50.5, 41.5], [49.8, 40.0], [48.5, 39.0]], poly: POLY([[50.5, 41.5], [49.8, 40.0], [48.5, 39.0]], [[40.0, 39.0], [40.0, 43.0]]) },
  ],
};

/** The side of a country on a date: "cp", "ent" or "neu". */
export function sideOfCountry(name, date) {
  const rows = MAP_ALLEGIANCE[name];
  if (!rows) return "neu";
  let side = "neu";
  for (const [from, s] of rows) if (date >= from) side = s;
  return side;
}

/** The overlays that hold on a date, for a map ("europe" or "nearEast"). */
export function activeOverlays(mapId, date) {
  return (MAP_OVERLAYS[mapId] || []).filter((o) => date >= o.from && date <= o.to);
}

const addDays = (iso, n) => {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};

/** A node's date in the Western calendar. The Russian command keeps Old Style until February 1918 (thirteen days behind). */
export function mapDate(campaignId, iso) {
  if (CAMPAIGNS[campaignId] && CAMPAIGNS[campaignId].calendar === "julian" && iso < "1918-02-01") return addDays(iso, 13);
  return iso;
}

/**
 * What the other commands were doing: for each of them, its latest report on or before this node's date (Western calendar), as
 * { campaignId, nodeId, title, city, date, daysAgo }. A command with no report yet is left out.
 */
export function meanwhileAt(campaignId, node) {
  const now = mapDate(campaignId, node.date);
  const out = [];
  for (const cid of CAMPAIGN_IDS) {
    if (cid === campaignId) continue;
    const c = CAMPAIGNS[cid];
    let best = null;
    for (const [nid, n] of Object.entries(c.nodes)) {
      if (n.ending) continue;
      const d = mapDate(cid, n.date);
      if (d <= now && (!best || d > best.date)) best = { campaignId: cid, nodeId: nid, title: n.title, city: n.city, date: d, context: WIRE[nid] };
    }
    if (best) {
      best.daysAgo = Math.round((new Date(now + "T00:00:00Z") - new Date(best.date + "T00:00:00Z")) / 86400000);
      out.push(best);
    }
  }
  return out;
}
