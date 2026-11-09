const PACIFIC_MAP = (() => {
// ---------- THE PACIFIC MAP (from Dispatches 1941) ----------
// Dispatches 1941's map layer, unchanged: its regions, dated timeline, report places, fronts and orders, the report map under each report
// (ReportMap) and the theatre map (PacificMap). It is kept inside this closure because many of its names are also the European map's
// (MAP_REGIONS, MAP_TIMELINE, MAP_PLACES, ReportMap and others): inside, 1941's shadow WW2's; outside, only PACIFIC_MAP is new.
// The Pacific commands (rules.ts: PACIFIC_COMMANDS) mount PACIFIC_MAP.ReportMap and PACIFIC_MAP.PacificMap; the European ones never see it.
// The geometry is fetched at runtime from assets/maps/pacific-regions.json, as in 1941.

const THEATERS = [
  { label: "HOME WATERS", lines: ["HOME WATERS"], ids: ["japan", "formosa", "okinawa"] },
  { label: "NORTHEAST ASIA", lines: ["NORTHEAST ASIA"], ids: ["northChina", "eastChina", "southChina", "hunanGuangxi", "freeChina", "yanan", "farWest", "manchuria"] },
  { label: "SOUTHEAST ASIA & CBI", lines: ["SOUTHEAST ASIA", "& CBI"], ids: ["indochina", "thailand", "burma", "india"] },
  { label: "MARITIME SOUTHEAST ASIA", lines: ["MARITIME S.E. ASIA"], ids: ["malaya", "sumatra", "java", "borneo", "celebes", "eastIndies", "luzon", "visayas", "mindanao"] },
  { label: "SOUTHWEST PACIFIC", lines: ["SOUTHWEST PACIFIC"], ids: ["newGuinea", "solomons", "australia"] },
  { label: "CENTRAL PACIFIC", lines: ["CENTRAL PACIFIC"], ids: ["gilberts", "marshalls", "marianas", "iwoJima"] },
];

// China, the Dutch East Indies and the Philippines are not one region each but zones (tools/split-pacific-zones.mjs cuts them from the
// country outlines along straight lines, so the borders are schematic): Manchukuo, North, East, South and Free China, Hunan-Guangxi (the ground of
// Ichi-Go), Yan'an (the Communist base area) and the far west; Sumatra, Java, Borneo, Celebes and the Moluccas and Timor; Luzon, the Visayas and
// Mindanao. The Manchuria pin became the Manchukuo polygon under the same id.
//
// Used to be x/y too (real equirectangular-projection positions, not schematic
// guesses — same projection: scaleX≈7.15, scaleY≈7.19, origin 79°E/53°N). Superseded by
// PacificMap's real coastline/border geometry (assets/maps/pacific-regions.json, built
// by tools/build_pacific_map_geometry.py from Natural Earth data): 17 of these 24 ids
// now render as real country-shaped polygons, with a label/edge-anchor point computed
// from that real geometry (the polygon's own area-weighted centroid) rather than a
// hand-placed guess; the other 7 — kind: "pin" below — have no clean modern
// country-level polygon (Manchuria isn't a country any more, Okinawa/Iwo Jima are
// sub-national Japanese territory, Pearl Harbor/Midway/Attu are small features a
// country-outline dataset doesn't resolve) and stay as status-colored discs, same as
// every region used to be, just now positioned by real verified lat/long instead of a
// schematic guess — see PIN_SOURCES in that same build script for the coordinates.
const MAP_REGIONS = [
  { id: "japan", name: "Japan", kind: "polygon" },
  { id: "formosa", name: "Formosa", kind: "polygon" },
  { id: "okinawa", name: "Okinawa", kind: "pin" },
  { id: "manchuria", name: "Manchukuo", kind: "polygon" },
  { id: "northChina", name: "North China", kind: "polygon" },
  { id: "eastChina", name: "East China", kind: "polygon" },
  { id: "southChina", name: "Guangdong", kind: "polygon" },
  { id: "hunanGuangxi", name: "Hunan-Guangxi", kind: "polygon" },
  { id: "freeChina", name: "Free China", kind: "polygon" },
  { id: "yanan", name: "Yan'an", kind: "polygon" },
  { id: "farWest", name: "Tibet & Xinjiang", kind: "polygon" },
  { id: "indochina", name: "Indochina", kind: "polygon" },
  { id: "thailand", name: "Thailand", kind: "polygon" },
  { id: "burma", name: "Burma", kind: "polygon" },
  { id: "india", name: "India", kind: "polygon" },
  { id: "malaya", name: "Malaya", kind: "polygon" },
  { id: "sumatra", name: "Sumatra", kind: "polygon" },
  { id: "java", name: "Java", kind: "polygon" },
  { id: "borneo", name: "Borneo", kind: "polygon" },
  { id: "celebes", name: "Celebes", kind: "polygon" },
  { id: "eastIndies", name: "Moluccas & Timor", kind: "polygon" },
  { id: "luzon", name: "Luzon", kind: "polygon" },
  { id: "visayas", name: "Visayas", kind: "polygon" },
  { id: "mindanao", name: "Mindanao", kind: "polygon" },
  { id: "newGuinea", name: "New Guinea", kind: "polygon" },
  { id: "solomons", name: "Solomons", kind: "polygon" },
  { id: "australia", name: "Australia", kind: "polygon" },
  { id: "gilberts", name: "Gilberts", kind: "polygon" },
  { id: "marshalls", name: "Marshalls", kind: "polygon" },
  { id: "marianas", name: "Marianas", kind: "polygon" },
  { id: "iwoJima", name: "Iwo Jima", kind: "pin" },
  { id: "pearlHarbor", name: "Pearl Harbor", kind: "pin" },
  { id: "midway", name: "Midway", kind: "pin" },
  { id: "attu", name: "Attu / Aleutians", kind: "pin" },
  { id: "sovietFarEast", name: "Vladivostok", kind: "pin" },
  { id: "palau", name: "Palau", kind: "polygon" },
];

// Circa-1940 population, driving node size. Two figures verified by search this
// project (Formosa ≈35,800 km² land / Philippines ≈300,000 km² land were the
// land-area figures checked earlier; population figures below for China, India,
// Japan, Indies, Thailand, Philippines, Burma, Indochina, and Australia came from a
// checked circa-1939/40 population table). Palau added later, also checked by
// search: by 1941 the Japanese South Seas Mandate population there was roughly
// 24,000 settlers against about 6,000 native Palauans, a real, documented ~4:1
// ratio — total below reflects that combined figure. The rest — small islands,
// outposts, and Vladivostok — are documented general-knowledge figures, not
// individually re-searched. china/india use whole-country totals standing in for a
// theater within them, a real scale mismatch worth knowing about, not hidden.
const POPULATION = {
  attu: 45, midway: 200, pearlHarbor: 500, iwoJima: 1100, palau: 30000, marshalls: 12000, gilberts: 32000,
  solomons: 120000, marianas: 130000, sovietFarEast: 206000, okinawa: 574000, newGuinea: 1500000,
  malaya: 4300000, formosa: 5870000, australia: 7100000, burma: 15500000, philippines: 16100000,
  thailand: 16400000, indochina: 24664000, manchuria: 43000000, indies: 68000000, japan: 73000000,
  india: 395000000, china: 500000000,
};

function sizeTier(id) {
  if (POPULATION[id] >= 200000000) return "massive"; // China, India — a real 5-7x gap over anything else here
  const rest = Object.entries(POPULATION).filter(([k]) => POPULATION[k] < 200000000).sort((a, b) => a[1] - b[1]).map((e) => e[0]);
  const idx = rest.indexOf(id);
  const third = Math.ceil(rest.length / 3);
  if (idx < third) return "small";
  if (idx < third * 2) return "medium";
  return "large";
}
// Australia's population genuinely lands it at "medium," but a continent reading as a
// small dot next to countries a fraction of its landmass looked wrong regardless of
// what the population figure says — a disclosed exception, not a data change.
const SIZE_OVERRIDE = { australia: "large" };
function tierFor(id) { return SIZE_OVERRIDE[id] || sizeTier(id); }
function mapRadiusFor(tier) { return tier === "massive" ? 38 : tier === "large" ? 22 : tier === "medium" ? 15 : 10; }

// Schematic connectivity graph, not real historical convoy routes — a plausible
// network, classified land vs. sea by whether the two regions actually share a land
// border. sovietFarEast's two edges tie directly to the five Kantokuen/Soviet nodes.
const MAP_EDGES = [
  ["manchuria", "northChina", "land"], ["northChina", "japan", "water"], ["eastChina", "japan", "water"], ["japan", "formosa", "water"],
  ["formosa", "eastChina", "water"], ["formosa", "southChina", "water"], ["northChina", "eastChina", "land"], ["eastChina", "southChina", "land"],
  ["eastChina", "hunanGuangxi", "land"], ["hunanGuangxi", "southChina", "land"], ["hunanGuangxi", "freeChina", "land"], ["freeChina", "yanan", "land"],
  ["yanan", "northChina", "land"], ["freeChina", "indochina", "land"], ["hunanGuangxi", "indochina", "land"], ["freeChina", "burma", "land"],
  ["formosa", "okinawa", "water"], ["okinawa", "japan", "water"], ["indochina", "thailand", "land"],
  ["thailand", "burma", "land"], ["burma", "india", "land"], ["indochina", "malaya", "land"], ["malaya", "sumatra", "water"],
  ["sumatra", "java", "water"], ["java", "borneo", "water"], ["borneo", "celebes", "water"], ["celebes", "eastIndies", "water"],
  ["borneo", "mindanao", "water"], ["mindanao", "visayas", "water"], ["visayas", "luzon", "water"], ["luzon", "formosa", "water"],
  ["eastIndies", "newGuinea", "land"],
  ["newGuinea", "solomons", "water"], ["solomons", "australia", "water"], ["japan", "iwoJima", "water"], ["iwoJima", "marianas", "water"],
  ["marianas", "marshalls", "water"], ["marshalls", "gilberts", "water"], ["gilberts", "solomons", "water"], ["marianas", "luzon", "water"],
  ["japan", "attu", "water"], ["pearlHarbor", "midway", "water"], ["midway", "marianas", "water"], ["pearlHarbor", "solomons", "water"],
  ["sovietFarEast", "manchuria", "land"], ["sovietFarEast", "japan", "water"],
  ["mindanao", "palau", "water"], ["palau", "newGuinea", "water"],
];

// A route only functions for a side if both ends are actually held (or safely
// puppet-held) by that side; mixed control or either end contested severs it.
function edgeViability(statusA, statusB) {
  const axisSide = (s) => s === "axis" || s === "axisAllied";
  const alliedSide = (s) => s === "allied";
  if (axisSide(statusA) && axisSide(statusB)) return "axis";
  if (alliedSide(statusA) && alliedSide(statusB)) return "allied";
  return "severed";
}

const STATUS_COLORS = {
  axis: "#5c1a1a",
  axisAllied: "#a8562b",
  allied: "#28497a",
  neutral: "#a8a08c",
  contested: "#c9a227",
};

const STATUS_LABELS = {
  axis: "Japanese-controlled",
  axisAllied: "Japanese puppet / occupied ally",
  allied: "Allied-controlled / liberated",
  neutral: "Neutral / not yet contested",
  contested: "Contested",
};

// The baseline map follows the calendar. Each region has a list of [date, status] entries, the date being the day the status began; a report's
// map shows the state on the day the report opens (see nodeDayKey), so nothing is shown that the report is about to decide and nothing is left out
// that had already happened. Run-specific changes come from mapOverrides. Sources and what is still unchecked: claims/map-dates-round1.json.
// The year-end table below (MAP_YEAR_STATUS) is derived from this one. 'axisAllied' is a Japanese puppet or an occupied ally, 'contested' a front
// running through the region. China is eight zones, and the dates are those of the standard accounts:
//  - Manchukuo is a Japanese puppet throughout; the Soviet offensive opens on 9 August 1945.
//  - North and East China and Guangdong are Japanese-held throughout (the Nanjing and North China puppet governments were not independent); they
//    become 'contested' on 15 August 1945, when the race to accept the surrender begins.
//  - Hunan-Guangxi: Nanning had fallen in November 1939 and the Japanese left it on 28 October 1940; Ichi-Go's Henan phase opens on 17 April 1944,
//    Guilin and Liuzhou fall on 10 November 1944, Nanning is retaken on 26 May 1945.
//  - Free China (Chongqing's) and the Yan'an base area are never Japanese-held; Tibet and Xinjiang are outside the war.
const MAP_TIMELINE = {
  japan: [["1940-01-01", "axis"], ["1945-04-01", "contested"]],
  formosa: [["1940-01-01", "axis"], ["1945-01-03", "contested"]],
  okinawa: [["1940-01-01", "axis"], ["1945-04-01", "contested"], ["1945-06-22", "allied"]],
  manchuria: [["1940-01-01", "axisAllied"], ["1945-08-09", "contested"]],
  northChina: [["1940-01-01", "axis"], ["1945-08-15", "contested"]],
  eastChina: [["1940-01-01", "axis"], ["1945-08-15", "contested"]],
  southChina: [["1940-01-01", "axis"], ["1945-08-15", "contested"]],
  hunanGuangxi: [["1940-01-01", "contested"], ["1940-10-28", "allied"], ["1944-04-17", "contested"], ["1944-11-10", "axis"], ["1945-05-26", "contested"], ["1945-08-15", "allied"]],
  freeChina: [["1940-01-01", "allied"]],
  yanan: [["1940-01-01", "allied"]],
  farWest: [["1940-01-01", "neutral"]],
  indochina: [["1940-01-01", "neutral"], ["1940-09-22", "axisAllied"], ["1941-07-28", "axis"], ["1945-03-09", "contested"]],
  thailand: [["1940-01-01", "neutral"], ["1941-12-08", "axisAllied"], ["1944-07-24", "contested"]],
  burma: [["1940-01-01", "neutral"], ["1942-01-20", "contested"], ["1942-05-20", "axis"], ["1942-12-21", "contested"], ["1945-05-03", "allied"]],
  india: [["1940-01-01", "allied"]],
  malaya: [["1940-01-01", "neutral"], ["1941-12-08", "contested"], ["1942-02-15", "axis"], ["1945-08-15", "contested"]],
  sumatra: [["1940-01-01", "neutral"], ["1942-02-14", "contested"], ["1942-03-28", "axis"], ["1945-08-17", "contested"]],
  java: [["1940-01-01", "neutral"], ["1942-02-27", "contested"], ["1942-03-09", "axis"], ["1945-08-17", "contested"]],
  borneo: [["1940-01-01", "neutral"], ["1942-01-11", "contested"], ["1942-03-01", "axis"], ["1945-05-01", "contested"]],
  celebes: [["1940-01-01", "neutral"], ["1942-01-11", "contested"], ["1942-02-09", "axis"], ["1945-08-17", "contested"]],
  eastIndies: [["1940-01-01", "neutral"], ["1942-01-31", "contested"], ["1942-04-19", "axis"], ["1944-04-22", "contested"]],
  luzon: [["1940-01-01", "neutral"], ["1941-12-08", "contested"], ["1942-05-06", "axis"], ["1945-01-09", "contested"], ["1945-07-05", "allied"]],
  visayas: [["1940-01-01", "neutral"], ["1942-04-10", "contested"], ["1942-05-10", "axis"], ["1944-10-20", "contested"], ["1945-04-20", "allied"]],
  mindanao: [["1940-01-01", "neutral"], ["1941-12-20", "contested"], ["1942-05-10", "axis"], ["1945-03-10", "contested"], ["1945-07-05", "allied"]],
  newGuinea: [["1940-01-01", "neutral"], ["1942-01-23", "contested"], ["1944-04-22", "allied"]],
  solomons: [["1940-01-01", "neutral"], ["1942-03-30", "contested"], ["1944-03-25", "allied"]],
  australia: [["1940-01-01", "allied"]],
  gilberts: [["1940-01-01", "neutral"], ["1941-12-10", "contested"], ["1942-01-01", "axis"], ["1943-11-20", "contested"], ["1943-11-28", "allied"]],
  marshalls: [["1940-01-01", "axis"], ["1944-01-31", "contested"], ["1944-02-23", "allied"]],
  marianas: [["1940-01-01", "axis"], ["1944-06-15", "contested"], ["1944-08-10", "allied"]],
  // Palau: the Peleliu and Angaur landings (Operation Stalemate II) began on 15 September 1944; it stays "contested" to the end rather than flipping
  // to "allied", because Babeldaob and the mandate capital at Koror, where most of the garrison was, were bypassed and never formally retaken.
  palau: [["1940-01-01", "axis"], ["1944-09-15", "contested"]],
  iwoJima: [["1940-01-01", "axis"], ["1945-02-19", "contested"], ["1945-03-26", "allied"]],
  pearlHarbor: [["1940-01-01", "allied"]],
  midway: [["1940-01-01", "allied"]],
  attu: [["1940-01-01", "neutral"], ["1942-06-07", "axis"], ["1943-05-11", "contested"], ["1943-05-30", "allied"]],
  sovietFarEast: [["1940-01-01", "neutral"], ["1945-08-09", "allied"]],
};

const MAP_MONTH_NUMBERS = { JANUARY: 1, FEBRUARY: 2, MARCH: 3, APRIL: 4, MAY: 5, JUNE: 6, JULY: 7, AUGUST: 8, SEPTEMBER: 9, OCTOBER: 10, NOVEMBER: 11, DECEMBER: 12 };
const MAP_SEASON_STARTS = { SPRING: [3, 21], SUMMER: [6, 21], AUTUMN: [9, 22], FALL: [9, 22], WINTER: [12, 21] };
const MAP_MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// A node date as a sortable day number (YYYYMMDD), or null when it holds no year. "APRIL 1942" counts as the first of the month, "LATE MAY 1940"
// as the 21st, "AUGUST 6, 1945" as the 6th, a season as the day it begins, a bare year as 1 January.
function nodeDayKey(date) {
  const up = String(date || "").toUpperCase();
  const ym = up.match(/\b(19[34]\d)\b/);
  if (!ym) return null;
  const year = Number(ym[1]);
  let month = null;
  let at = Infinity;
  for (const [name, n] of Object.entries(MAP_MONTH_NUMBERS)) {
    const i = up.indexOf(name);
    if (i >= 0 && i < at) {
      month = n;
      at = i;
    }
  }
  let day = 1;
  if (month) {
    const dm = up.slice(at).match(/^[A-Z]+\s+(\d{1,2})(?!\d)/);
    if (dm && Number(dm[1]) >= 1 && Number(dm[1]) <= 31) day = Number(dm[1]);
    else if (/\bLATE\b/.test(up.slice(0, at))) day = 21;
    else if (/\bMID\b/.test(up.slice(0, at))) day = 15;
  } else {
    let sAt = Infinity;
    for (const [name, [m, d]] of Object.entries(MAP_SEASON_STARTS)) {
      const i = up.indexOf(name);
      if (i >= 0 && i < sAt) {
        sAt = i;
        month = m;
        day = d;
      }
    }
    if (!month) {
      if (/\bLATE\b/.test(up)) month = 10;
      else if (/\bMID\b/.test(up)) {
        month = 6;
        day = 15;
      } else month = 1;
    }
  }
  return year * 10000 + month * 100 + day;
}

// Every region's status on the day just before dayKey (a report's own events are never in its own map).
function baselineStatuses(dayKey) {
  const out = {};
  for (const [id, entries] of Object.entries(MAP_TIMELINE)) {
    let status = entries[0][1];
    for (const [d, s] of entries) {
      if (Number(d.replace(/-/g, "")) < dayKey) status = s;
      else break;
    }
    out[id] = status;
  }
  return out;
}

// Year-end snapshots, derived from the timeline.
const MAP_YEAR_STATUS = Object.fromEntries([1940, 1941, 1942, 1943, 1944, 1945].map((y) => [y, baselineStatuses((y + 1) * 10000 + 101)]));

// Tier 2 — the map reads the run's own divergences. First-slice coverage: the major
// named forks this build currently has content for. Extend as more nodes are added.
function mapOverrides(year, flags, meters) {
  flags = flags || {};
  meters = meters || {};
  const o = {};
  const notes = [];
  const regionNotes = {}; // region id -> explanation text, for tap-to-explain on individual chits
  function setAll(regions, status, note) {
    for (const r of regions) o[r] = status;
    if (note) {
      notes.push(note);
      for (const r of regions) regionNotes[r] = note;
    }
  }
  function set(region, status, note) {
    o[region] = status;
    if (note) {
      notes.push(note);
      regionNotes[region] = note;
    }
  }
  if (flags.openingVector === "southBlitz" && year === 1941) {
    set("luzon", "contested", "No Pearl Harbor strike on this path: the Pacific Fleet's battleships and carriers remain intact at Hawaii (projection).");
  }
  if (flags.midwayResult === "disaster" && year >= 1942) {
    if (year >= 1943) set("solomons", "allied", "Four Japanese fleet carriers and their veteran air crews were lost in a single morning at Midway: a loss the carrier air training pipeline never fully replaces.");
    else notes.push("Four Japanese fleet carriers and their veteran air crews were lost in a single morning at Midway: a loss the carrier air training pipeline never fully replaces.");
  }
  if (flags.midwayPath === "diverted" && year === 1942) {
    set("solomons", "contested", "The carrier force struck at the Australia supply line instead of Midway: an undefeated Japanese carrier fleet remains at large (projection).");
    set("australia", "allied", "The carrier force struck at the Australia supply line instead of Midway: an undefeated Japanese carrier fleet remains at large (projection).");
  }
  if (flags.midwayAlliedResult === "decisive" && year >= 1942) {
    notes.push("Midway's decisive result, as it happened: four Japanese fleet carriers destroyed for one American loss.");
  }
  if (flags.midwayAlliedPath === "conservative" && year === 1942) {
    notes.push("The Midway ambush was declined: Japan's carrier fleet sails home undefeated (projection).");
  }
  if (flags.leytePath === "abandonPhilippines" && year >= 1944) {
    setAll(["luzon", "visayas", "mindanao"], "axis", "The Philippines were conceded without a fleet action at Leyte: the oil route from the Indies is cut months ahead of the historical timetable (projection).");
    setAll(["sumatra", "borneo"], "contested", "The Philippines were conceded without a fleet action at Leyte: the oil route from the Indies is cut months ahead of the historical timetable (projection).");
  }
  if (flags.philippinesPath === "bypassFormosa" && year >= 1944) {
    setAll(["luzon", "visayas", "mindanao"], "contested", "Formosa was seized in place of the Philippines: Filipino civilians remain under occupation through the war's final year (projection).");
    set("formosa", "contested", "Formosa was seized in place of the Philippines: Filipino civilians remain under occupation through the war's final year (projection).");
  }
  if (flags.endgamePath === "surrenderInquiry" && year === 1945)
    notes.push("A conditional surrender inquiry opened through neutral channels ahead of the historical timetable (projection).");
  if (flags.endgameAlliedPath === "blockade" && year === 1945) {
    set("japan", "contested", "Operation Downfall was set aside for naval encirclement and air blockade: no invasion of the home islands was attempted (projection).");
  }
  // Correctness fix, not just an enrichment: the 1945 baseline unconditionally shows Iwo
  // Jima as allied-controlled, which is true for the compressed/extended/fullSupport
  // branches (all of which are real invasions, just on different timelines or with
  // different naval-gunfire support) but false for "skipped" — King's real historical
  // argument, acted on here, means nobody lands on the island at all. Without this
  // override the map would show a location as captured that the game's own narrative
  // explicitly says was bypassed.
  if (flags.iwoJimaAlliedPath === "skipped" && year >= 1945) {
    set("iwoJima", "axis", "Iwo Jima was bypassed entirely rather than invaded: King's real argument that the island wasn't worth the cost, acted on here. Kuribayashi's tunnel network was never tested because nobody landed to test it.");
  }
  // Guadalcanal/Solomons: all three guadalcanalPath branches (commit, earlyWithdraw,
  // drumResupply) eventually route toward Japan losing the island — this matches the
  // real history and the baseline's own eventual 1944 shift to allied control, so most
  // of these don't need a status override, only notes for texture. The one genuine
  // timeline shift is earlyWithdraw, whose own outcome text says explicitly that
  // conceding early hands the Americans a forward airfield "months ahead of schedule" —
  // earlyPerimeter43 (the node this branch routes to) is dated 1943, not 1944, so the
  // map should reflect the region flipping a full year earlier on this specific branch.
  if (flags.guadalcanalPath === "earlyWithdraw" && year >= 1943) {
    set("solomons", "allied", "Guadalcanal was conceded early rather than fought over for six months: the perimeter falls back to Bougainville and Rabaul, handing American planners a forward airfield roughly a year ahead of the historical timetable (projection).");
  }
  if (flags.guadalcanalNavalResult === "disaster" && year === 1942) {
    notes.push("The November 1942 naval battles for Guadalcanal went worse than history's own close-run version: reinforcement convoys caught with less warning, more of the destroyer force lost in a single week than the historical campaign's attrition rate.");
  }
  if (flags.guadalcanalPath === "drumResupply" && year === 1943) {
    notes.push("Destroyer resupply runs to Guadalcanal were abandoned entirely in favor of improvised drum-floats, a real historical method: the garrison held on at the barest possible margin before the eventual withdrawal.");
  }
  // Kantokuen/Siberia: the single largest territorial divergence this game models —
  // Japan invading the Soviet Far East instead of, or in addition to, the Southern
  // Operation — had zero map representation before this pass, despite being a real,
  // years-long alternate front with its own full node cluster
  // (hokushinDebate41 -> kantokuenOffensive41 -> siberianReckoning42 -> twoFrontStrain44
  // -> kantokuenFinalWord46). sovietFarEast is "neutral" in the baseline for every year
  // except 1945 (the real Soviet declaration of war) — on this branch it should show
  // Japan actually crossing into and fighting over that territory years earlier.
  if (flags.hokushinPath === "north" && year === 1941) {
    set("sovietFarEast", "contested", "The Kwantung Army crosses into Soviet territory instead of standing Kantokuen down: the single largest departure from the historical record this whole counterfactual makes (projection).");
  }
  if (flags.siberianPath === "holdGains" && year >= 1942) {
    set("sovietFarEast", "axis", "Japan dug in to hold its Siberian gains through the winter rather than withdraw: a real, ongoing second front against the Soviet Union, fought alongside the war against America and Britain (projection).");
  }
  if (flags.siberianPath === "pressWest" && year >= 1942) {
    set("sovietFarEast", "axis", "The Kwantung Army pressed west toward a Trans-Siberian rail link-up with German forces, a real Axis war aim (per Ribbentrop's own July 1941 telegram) neither side's actual logistics could reach: the deepest push into Soviet territory this counterfactual makes (projection).");
  }
  if (flags.siberianPath === "withdraw" && year >= 1942) {
    set("sovietFarEast", "neutral", "The Kwantung Army withdrew back to the original Manchurian border after a single hard winter: the gamble conceded without the underlying argument for it ever being conceded (projection).");
  }
  // China: the baseline holds China flat at "contested" every year regardless of what
  // actually happens there, but this game models a real, well-documented divergence —
  // a fully-resourced Ichi-Go (mainlandPath, japan side) creates "the largest
  // contiguous Japanese-held territory of the entire war" per ichiGoTriumph44's own
  // text, a real overland corridor from Manchuria to French Indochina, larger than the
  // historical partial version. All three mainlandPath values (both/ichiGoOnly/
  // bothResourced) achieve this same stronger-than-historical Ichi-Go — the difference
  // between them is what happens to the Burma front (U-Go), not to China itself.
  if (flags.mainlandPath && year >= 1944) {
    setAll(["hunanGuangxi"], "axis", "A fully-resourced Ichi-Go offensive creates the largest contiguous Japanese-held territory of the entire war: an overland corridor from Manchuria to French Indochina, larger than the historical partial version (projection).");
  }
  // Allied-side China: chinaCrisisResult reflects whether material support to
  // Communist forces actually blunted Ichi-Go's advance or arrived too late to matter.
  if (flags.chinaCrisisResult === "blunted" && year >= 1944) {
    setAll(["hunanGuangxi"], "contested", "Material support reaching Communist forces in the north blunts, though doesn't stop, Ichi-Go's advance: real pressure on Japanese supply lines that slows the offensive below its historical scale (projection).");
  }
  if (flags.chinaCrisisResult === "tooLittle" && year >= 1944) {
    setAll(["hunanGuangxi"], "axis", "Material support to Communist forces arrives too late and too thin to meaningfully change a five-hundred-thousand-man offensive's trajectory: Ichi-Go succeeds largely as it did historically (projection).");
  }
  // Burma: rangoonAlliedPath/rangoonDefendResult and overlandPath are deliberately
  // notes-only, not status overrides — both nodes' own situation text says the
  // territorial outcome (Rangoon falls in 1942, Burma is reconquered by 1945) happens
  // regardless of the choice made. A color override here would misrepresent what the
  // game's own narrative says is actually contested: cost and timing, not control.
  if (flags.rangoonAlliedPath === "defend" && flags.rangoonDefendResult === "worthIt" && year === 1942) {
    notes.push("The Chinese divisions committed to Rangoon's defense bought real extra weeks before the city fell, letting more of the wider Burma garrison reach India intact than the historical retreat managed.");
  }
  if (flags.rangoonAlliedPath === "defend" && flags.rangoonDefendResult === "wasted" && year === 1942) {
    notes.push("Rangoon fell on very nearly the historical timetable regardless: the Chinese divisions committed to its defense were mauled holding a city British planning had already written off.");
  }
  if (flags.overlandPath === "ledoRoad" && year === 1945) {
    notes.push("The Ledo Road reached China in early 1945, a genuine engineering achievement, though one that arrived so late its actual strategic contribution was modest against the Hump airlift's own tonnage.");
  }
  // Australia: the baseline hardcodes "allied" every year, correct for every branch
  // except one — the japan-side Australia invasion thread's "beachhead" result, whose
  // own outcome text says Japanese troops hold a strip of coastline for "several
  // weeks" before it's overrun. Year-level granularity can't represent "several weeks"
  // precisely, but showing 1942 specifically as contested (not extending further,
  // since the text is explicit the beachhead doesn't last) is the closer approximation
  // — the alternative, leaving Australia "allied" throughout, would flatly contradict
  // this branch's own established outcome.
  if (flags.australiaResult === "beachhead" && year === 1942) {
    set("australia", "contested", "A Japanese beachhead near Darwin holds for several weeks before Allied forces overrun it: a real, if temporary, foothold no supply line could have sustained indefinitely (projection).");
  }
  if (flags.australiaResult === "disaster" && year === 1942) {
    notes.push("A Japanese landing attempt near Darwin fails before establishing anything: escort thinned past the point of covering the transports, the operation collapsing before it could commit.");
  }
  // Palau region added since this note was first written — see MAP_REGIONS,
  // POPULATION, MAP_EDGES, and MAP_YEAR_STATUS above for the new territory itself.
  // peleliuPath === "cancelled" means "the Palaus garrison... stays exactly where it
  // is, bypassed" — nobody ever lands, so unlike the baseline (which shows "contested"
  // for 1944–1945, reflecting the real historical Peleliu/Angaur landings), this
  // branch should show the region staying "axis" straight through, since neither
  // Peleliu nor any part of Palau is ever invaded on this path.
  if (flags.peleliuPath === "cancelled" && year >= 1944) {
    set("palau", "axis", "Halsey's recommendation to cancel the landing is acted on: the roughly 10,900-man Japanese garrison across the Palaus is never invaded at all, bypassed and left to wither without supply or reinforcement, unlike the historical Peleliu/Angaur landings this projection replaces.");
  }
  // ironBottomPath (the accelerated-Iwo-Jima consequence of Peleliu's cancellation) DOES
  // map cleanly onto the existing iwoJima region, since it's a timing shift on a place
  // already on the map. Both accelerated outcomes (success/costly) end with the same
  // territorial result — Japan loses the island — just months ahead of the historical
  // February 1945 date and at different cost; only "held" (Nimitz's caution) keeps the
  // original historical timetable, which already matches the baseline.
  if (flags.ironBottomPath === "accelerated" && flags.ironBottomResult === "success" && year === 1944) {
    set("iwoJima", "allied", "Iwo Jima is taken months ahead of the historical February 1945 date, using the divisions freed by Peleliu's cancellation while the garrison's tunnel network is still unfinished (projection).");
  }
  if (flags.ironBottomPath === "accelerated" && flags.ironBottomResult === "costly" && year === 1944) {
    set("iwoJima", "allied", "Iwo Jima is taken months ahead of the historical February 1945 date, but at close to the same cost as the historical assault: the reasons the original timetable waited turn out to have been real ones (projection).");
  }
  return { o, notes, regionNotes };
}

// ---------- MAP: NODE-TO-REGION CONTEXT ----------
// Which theater a given briefing node is actually about, so the map can highlight the
// region under discussion instead of presenting every territory at equal visual weight.
// Deliberately a partial list — only nodes with an unambiguous single-region focus are
// included; nodes about doctrine, personnel, or multi-theater strategy are left unmapped
// rather than forced into a misleading highlight.
const NODE_REGION_HINTS = {
  // Added in this pass — each checked against title/context, and the less-obvious
  // ones (Ichi-Go, Doolittle airmen, Typhoon Cobra) verified against real sources
  // rather than guessed from the title alone. Deliberately NOT exhaustive: nodes about
  // Washington/Tokyo policy decisions with no single theater (Tripartite Pact, the Hull
  // Note, Casablanca, Tehran, internment, Pacific-First doctrine debates) are left
  // unhinted on purpose — forcing a region onto a node that isn't about one would be
  // the same dishonesty flagged earlier about inventing addressee data.
  chinaPeaceQuestion40: ["eastChina", "freeChina"],
  hokushinDebate41: ["manchuria", "sovietFarEast"],
  doolittleAirmen42: ["eastChina"], // verified: captured crews came down in Zhejiang/Jiangxi
  coralSea42: ["newGuinea"], // Port Moresby is the actual objective in this node
  keGoWithdrawal43: ["solomons"], // Ke-Go was the Guadalcanal evacuation
  yamamotoDeath43: ["solomons"], // shot down over Bougainville
  ichiGoTriumph44: ["hunanGuangxi", "northChina", "southChina"], // verified: fought across Henan/Hunan/Guangxi
  kantokuenFinalWord46: ["manchuria", "sovietFarEast"],
  curtinsTurn42: ["australia"], // Curtin was Australia's wartime PM
  coralSeaMidwayAllied42: ["midway"], // despite the id, this node's title and content are about Midway itself (Station HYPO, Yorktown's 72-hour repair), not Coral Sea/Port Moresby — the prior hint here ("newGuinea") and the comment claiming "Midway itself has no MAP_REGIONS entry" were both stale; midway has had its own MAP_REGIONS entry all along
  bismarckSea43: ["newGuinea"], // convoy destroyed en route to Lae
  halseyTyphoon44: ["visayas"], // verified: 300mi east of the Philippines, supporting the Leyte invasion
  halseyAftermath44: ["visayas"],
  yamamotoIntercept43: ["solomons"], // intercepted near Bougainville
  yamamotoSurvives43: ["pearlHarbor"], // CINCPAC staff-level policy question, not tied to a battle location
  stilwellUltimatum44: ["freeChina"],
  stilwellPreserved44: ["freeChina"],
  hiroshima45: ["japan"],
  kyotoTargetDebate45: ["japan"],
  kyotoStruck45: ["japan"],
  nagasaki45: ["japan"],
  nagasakiDelayed45: ["japan"],
  radiationDisclosure45: ["japan"],
  peleliuDecision44: ["palau"],
  peleliuForcesRedirected44: ["palau"],
  pearlHarbor41: ["pearlHarbor"],
  midway42: ["midway"],
  attu43: ["attu"],
  kokodaTrail42: ["newGuinea"],
  kokodaTrailAllied42: ["newGuinea"],
  guadalcanal42: ["solomons"],
  guadalcanalAllied42: ["solomons"],
  earlyPerimeter43: ["solomons"],
  australiaLanding42: ["australia"],
  wakeIslandRelief41: ["marshalls"],
  burmaRangoon42: ["burma"],
  burmaRoad40: ["burma", "freeChina"],
  nomonhan39: ["manchuria", "sovietFarEast"],
  indochinaMission40: ["indochina", "freeChina"],
  fleetAtHawaii40: ["pearlHarbor"],
  richardsonObjection40: ["pearlHarbor"],
  atlanticTransfer41: ["pearlHarbor"],
  neutralityPact41: ["manchuria", "sovietFarEast"],
  indianOceanRaid42: ["india"], // Ceylon has no region of its own; India is the nearest on the map
  chinaAirForce41: ["freeChina"],
  stilwellInChungking42: ["freeChina", "burma"],
  vladivostokRoute42: ["sovietFarEast"],
  rangoonRetreatAllied42: ["burma"],
  burmaReconquest45: ["burma"],
  theMainlandCrisis44: ["hunanGuangxi", "burma", "india"], // Ichi-Go and U-Go (this hint was keyed to a node id that does not exist)
  chinaCrisisAllied44: ["hunanGuangxi", "freeChina"],
  chinasWarAlone43: ["freeChina", "eastChina"],
  britainsCalculus43: ["india", "burma"],
  japanUnopposed43: ["japan"],
  chinaCivilWarShadow43: ["yanan", "freeChina"],
  dutchExileCalculus44: ["java", "sumatra", "borneo", "celebes", "eastIndies"],
  warWithoutAmerica45: ["manchuria"],
  philippineSea44: ["marianas"],
  philippineSeaAllied44: ["marianas"],
  onishiKamikaze44: ["luzon"],
  leyteGulf44: ["visayas"],
  kuritaAtLeyte44: ["visayas"],
  leyteBeachheadAftermath44: ["visayas"],
  philippinesFormosaAllied44: ["luzon", "formosa"],
  quezonsSuccessor44: ["visayas"],
  corregidorEvacuation42: ["luzon"],
  macArthurTension44: ["luzon", "visayas"],
  macArthurAftermath44: ["luzon", "visayas"],
  iwoJima45: ["iwoJima"],
  iwoJimaAllied45: ["iwoJima"],
  okinawa45: ["okinawa"],
  okinawaAllied45: ["okinawa"],
  siberianReckoning42: ["manchuria", "sovietFarEast"],
  kantokuenOffensive41: ["manchuria", "sovietFarEast"],
  indochinaOccupation41: ["indochina"],
  centralPacificDrive43: ["gilberts", "marshalls"],
  theTarawaQuestion43: ["gilberts"],
  savoIslandReckoning42: ["solomons"],
  operationFsCulmination42: ["australia"],
  severSupplyLine42: ["australia"],
  unhinderedSouth42: ["java", "sumatra", "borneo", "malaya"],
  japanStrikesAgain42: ["java", "sumatra", "borneo", "malaya"],
  sovietHokkaido45: ["japan", "sovietFarEast"],
  newWorldOrder45: ["japan"],
  coldWarOpening48: ["japan"],
  aQuietEmpire45: ["java", "sumatra", "borneo", "malaya"],
};

// Real coastline/border/region geometry for PacificMap, fetched once and cached —
// built ahead of time by tools/build_pacific_map_geometry.py from Natural Earth data
// into assets/maps/pacific-regions.json (see that script's own header comment for the
// full account of what's a direct real-country match, what's a historical grouping of
// more than one modern country, and what's a status-colored disc rather than a
// polygon). Same fetch-and-cache pattern Dispatches 1940 uses for its own
// assets/maps/regions.json, for the same reason: this geometry never changes at
// runtime, so there's no reason to pay for or repeat the fetch/parse per mount.
let pacificRegionGeometryPromise = null;
function loadPacificRegionGeometry() {
  if (!pacificRegionGeometryPromise) {
    pacificRegionGeometryPromise = fetch("assets/maps/pacific-regions.json")
      .then((r) => r.json())
      .catch((e) => {
        pacificRegionGeometryPromise = null; // let the next mount retry rather than sticking on a failed fetch
        throw e;
      });
  }
  return pacificRegionGeometryPromise;
}

// Builds an SVG path "d" string from a set of already-projected [x,y] rings — the
// geometry JSON stores pixel coordinates directly (pre-projected at build time by the
// same script), so unlike 1940's regionPathD this needs no live lon/lat math, just the
// ring-to-path join.
function ringsPathD(rings) {
  return (rings || [])
    .map((ring) => (ring.length ? `M${ring[0][0]},${ring[0][1]} L${ring.map((p) => `${p[0]},${p[1]}`).join(" ")} Z` : ""))
    .filter(Boolean)
    .join(" ");
}

// `date` is the report's own date (the map shows the state on the day it opens); `atEnd` shows the war as it ended; `year` is the fallback for a
// caller with only a year. The slider steps back month by month to January 1940.
function PacificMap({ year, date, atEnd, accent, flags, meters, nodeId, report }) {
  const MIN_MONTH = 1940 * 12;
  const maxKey = atEnd ? 19451231 : nodeDayKey(date) || (year ? Math.max(1940, Math.min(1945, year)) * 10000 + 101 : 19450101);
  const monthOf = (key) => Math.floor(key / 10000) * 12 + (Math.floor(key / 100) % 100) - 1;
  const maxMonth = Math.max(MIN_MONTH, monthOf(maxKey));
  const [scrubMonth, setScrubMonth] = useState(maxMonth);
  const month = Math.max(MIN_MONTH, Math.min(maxMonth, scrubMonth));
  const dayKey = month === maxMonth ? maxKey : Math.floor(month / 12) * 10000 + ((month % 12) + 1) * 100 + 1;
  const monthLabel = atEnd && month === maxMonth ? "The war as it ended" : `${MAP_MONTH_NAMES[month % 12]} ${Math.floor(month / 12)}`;
  const clampedYear = Math.floor(dayKey / 10000);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const uid = useId().replace(/:/g, "");
  const [geometry, setGeometry] = useState(null);
  const [geometryFailed, setGeometryFailed] = useState(false);
  useEffect(() => {
    let cancelled = false;
    loadPacificRegionGeometry()
      .then((g) => { if (!cancelled) setGeometry(g); })
      .catch(() => { if (!cancelled) setGeometryFailed(true); });
    return () => { cancelled = true; };
  }, []);
  const base = baselineStatuses(dayKey);
  const { o, notes, regionNotes } = mapOverrides(clampedYear, flags, meters);
  const statuses = { ...base, ...o };
  const usedStatuses = [...new Set(Object.values(statuses))];
  const nameOf = (id) => (MAP_REGIONS.find((r) => r.id === id) || {}).name || id;
  const highlightRegions = (nodeId && NODE_REGION_HINTS[nodeId]) || [];
  // Labels flagged to render below the region instead of above, to keep the crowded
  // Japan/Formosa/Okinawa/Iwo Jima/Attu cluster legible — checked by actual pixel
  // distance during prototyping, not eyeballed.
  const LABEL_BELOW = { formosa: true, thailand: true, iwoJima: true, attu: true };

  const VBW = 960;
  const VBH = 650;
  // On a report's own map (ReportMap, 37-map-front.jsx) the sheet can be framed on a window, the regions stand still, and the fronts, the place of the report and its orders are drawn.
  const passive = !!(report && report.passive);
  const view = report && report.frame ? report.frame : { x: 0, y: 0, w: VBW, h: VBH };
  const markScale = Math.max(0.55, Math.min(1, (view.w / VBW) * 1.5));
  const fronts = frontsOn(dayKey, statuses);

  const header = (
    <div
      className="text-[11px] uppercase tracking-widest text-[#000000] font-semibold mb-1 flex items-center justify-between flex-wrap gap-2"
      style={{ fontFamily: "'IBM Plex Mono', monospace" }}
    >
      <span>Pacific Situation · {monthLabel} · Theater Map</span>
      {maxMonth > MIN_MONTH && (
        <span className="flex items-center gap-2 normal-case tracking-normal font-normal">
          <input
            type="range"
            min={MIN_MONTH}
            max={maxMonth}
            value={month}
            onChange={(e) => { setScrubMonth(Number(e.target.value)); setSelectedRegion(null); }}
            aria-label={`View month: ${monthLabel}`}
            aria-valuetext={monthLabel}
            className="w-28 sm:w-40 accent-current"
            style={{ accentColor: accent }}
          />
          {month !== maxMonth && (
            <button
              onClick={() => setScrubMonth(maxMonth)}
              className="text-[10px] uppercase tracking-widest border px-2 py-[2px]"
              style={{ borderColor: accent, color: accent, fontFamily: "'IBM Plex Mono', monospace" }}
            >
              Back to {atEnd ? "the end" : `${MAP_MONTH_NAMES[maxMonth % 12]} ${Math.floor(maxMonth / 12)}`}
            </button>
          )}
        </span>
      )}
    </div>
  );

  // Real coastline geometry hasn't arrived (or failed to load) yet — the region label
  // points, polygon shapes, and pin positions below all come from it, so there's
  // nothing honest to draw without it. Fails safe to a plain loading/error state rather
  // than falling back to the old schematic dot positions, which would silently
  // contradict this map's own "real geography" framing.
  if (!geometry) {
    return (
      <div className="mb-2">
        {header}
        <div
          className="w-full border-[3px] flex items-center justify-center"
          style={{ background: "#e3d5ae", borderColor: "#3a2a18", aspectRatio: `${VBW} / ${VBH}` }}
        >
          <p className="text-[12px] text-[#3a2a18]" style={{ fontFamily: "'Courier Prime', monospace" }}>
            {geometryFailed ? "Theater map unavailable this session." : "Loading theater map…"}
          </p>
        </div>
      </div>
    );
  }

  const regionById = {};
  MAP_REGIONS.forEach((r) => {
    const src = r.kind === "pin" ? geometry.pins[r.id] : geometry.regions[r.id];
    if (src) regionById[r.id] = { ...r, label: src.label, rings: src.rings };
  });

  return (
    <div className="mb-2">
      {header}
      <svg viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`} role="group" aria-label={`Pacific theater map, ${monthLabel}`} className="w-full border-[3px]" style={{ background: "#e3d5ae", borderColor: "#3a2a18" }}>
        <defs>
          <pattern id={`hexTexture${uid}`} width="16" height="27.7" patternUnits="userSpaceOnUse">
            <path
              d="M8 0 L16 4.6 L16 13.85 L8 18.5 L0 13.85 L0 4.6 Z M8 18.5 L16 23.1 L16 27.7 M0 23.1 L8 18.5 M8 0 L8 -4.6"
              fill="none"
              stroke="#3a2a1830"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>

        {/* Ocean */}
        <rect x="0" y="0" width={VBW} height={VBH} fill="#e3d5ae" />
        <rect x="0" y="0" width={VBW} height={VBH} fill={`url(#hexTexture${uid})`} opacity="0.25" />

        {/* Real coastlines/borders for every landmass in view that isn't itself one of
            this game's colorable regions: geographic context, not interactive. */}
        {geometry.backdrop.map((country) => (
          <path key={country.name} d={ringsPathD(country.rings)} fill="#d8cba8" stroke="#8a7a5c" strokeWidth="0.6" />
        ))}

        {/* Faint lat/long reference grid: also a real WWII navigational-chart convention */}
        {[100, 120, 140, 160, 180, 200].map((lon) => {
          const x = 40 + (lon - 79) * 7.15;
          return <line key={lon} x1={x} y1={0} x2={x} y2={VBH} stroke="#3a2a18" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.15" />;
        })}
        {[-20, 0, 20, 40].map((lat) => {
          const y = 30 + (53 - lat) * 7.19;
          return (
            <line
              key={lat}
              x1={0}
              y1={y}
              x2={VBW}
              y2={y}
              stroke="#3a2a18"
              strokeWidth={lat === 0 ? "0.75" : "0.5"}
              strokeDasharray={lat === 0 ? "" : "2 4"}
              opacity={lat === 0 ? "0.25" : "0.15"}
            />
          );
        })}

        {[
          [4, 4, 1, 1],
          [VBW - 4, 4, -1, 1],
          [4, VBH - 4, 1, -1],
          [VBW - 4, VBH - 4, -1, -1],
        ].map(([x, y, dx, dy], i) => (
          <path
            key={i}
            d={`M ${x} ${y + dy * 20} L ${x} ${y} L ${x + dx * 20} ${y}`}
            fill="none"
            stroke="#3a2a18"
            strokeWidth="3"
          />
        ))}

        {MAP_EDGES.map(([a, b, kind], i) => {
          const ra = regionById[a], rb = regionById[b];
          if (!ra || !rb) return null;
          const viability = edgeViability(statuses[a] || "neutral", statuses[b] || "neutral");
          const stroke = viability === "axis" ? "#5c1a1a" : viability === "allied" ? "#28497a" : "#5b6472";
          const opacity = viability === "severed" ? 0.35 : 0.75;
          return (
            <line
              key={i}
              x1={ra.label[0]} y1={ra.label[1]} x2={rb.label[0]} y2={rb.label[1]}
              stroke={stroke}
              strokeWidth={kind === "land" ? 2.5 : 2}
              strokeDasharray={kind === "water" ? "4 4" : ""}
              opacity={opacity}
            />
          );
        })}

        {/* The 17 regions with a real country-shaped polygon: status-colored fill,
            country border redrawn on top of the color so it stays legible. */}
        {MAP_REGIONS.filter((r) => r.kind === "polygon").map((region) => {
          const id = region.id;
          const reg = regionById[id];
          if (!reg) return null;
          const status = statuses[id] || "neutral";
          const isHighlighted = highlightRegions.includes(id);
          const hasNote = !passive && !!regionNotes[id];
          const d = ringsPathD(reg.rings);
          const [lx, ly] = reg.label;
          const labelBelow = LABEL_BELOW[id];
          const labelY = labelBelow ? ly + 16 : ly - 10;
          return (
            <g
              key={id}
              onClick={() => hasNote && setSelectedRegion(selectedRegion === id ? null : id)}
              onKeyDown={(e) => {
                if (hasNote && (e.key === "Enter" || e.key === " " || e.key === "Spacebar")) {
                  e.preventDefault();
                  setSelectedRegion(selectedRegion === id ? null : id);
                }
              }}
              style={{ cursor: hasNote ? "pointer" : "default" }}
              role={hasNote ? "button" : undefined}
              tabIndex={hasNote ? 0 : undefined}
              aria-label={hasNote ? `${nameOf(id)}: ${STATUS_LABELS[status]}. Tap for why.` : `${nameOf(id)}: ${STATUS_LABELS[status]}`}
            >
              <title>{`${nameOf(id)}: ${STATUS_LABELS[status]}${hasNote ? " (tap for why)" : ""}`}</title>
              <path d={d} fill={STATUS_COLORS[status]} fillOpacity="0.88" stroke="#241a10" strokeWidth="1" />
              {isHighlighted && <path d={d} fill="none" stroke={accent} strokeWidth="3" strokeDasharray="6 3" />}
              {hasNote && <circle cx={lx + 12} cy={ly - 10} r="4" fill="#241a10" opacity="0.85" />}
            </g>
          );
        })}

        {/* The labels are drawn after every zone, so that a neighbouring zone's fill cannot cover one (Guangdong under Hunan-Guangxi). */}
        <g aria-hidden="true" pointerEvents="none">
          {MAP_REGIONS.filter((r) => r.kind === "polygon" && regionById[r.id]).map((region) => {
            const [lx, ly] = regionById[region.id].label;
            return (
              <text
                key={region.id}
                x={lx}
                y={LABEL_BELOW[region.id] ? ly + 16 : ly - 10}
                textAnchor="middle"
                fontSize="9"
                fontWeight="700"
                fill="#241a10"
                stroke="#f6efdf"
                strokeWidth="3"
                strokeLinejoin="round"
                paintOrder="stroke"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                {nameOf(region.id)}
              </text>
            );
          })}
        </g>

        {/* The 7 regions with no clean modern-country polygon (see MAP_REGIONS'
            comment): same status-colored disc every region used to be, positioned by
            real verified lat/long over the real coastline backdrop instead of a
            schematic guess over blank paper. */}
        {MAP_REGIONS.filter((r) => r.kind === "pin").map((region) => {
          const id = region.id;
          const reg = regionById[id];
          if (!reg) return null;
          const status = statuses[id] || "neutral";
          const lightFill = status === "neutral" || status === "contested";
          const tier = tierFor(id);
          const r = mapRadiusFor(tier);
          const isHighlighted = highlightRegions.includes(id);
          const hasNote = !passive && !!regionNotes[id];
          const [x, y] = reg.label;
          const labelBelow = LABEL_BELOW[id];
          const labelY = labelBelow ? y + r + 12 : y - r - 6;
          return (
            <g
              key={id}
              onClick={() => hasNote && setSelectedRegion(selectedRegion === id ? null : id)}
              onKeyDown={(e) => {
                if (hasNote && (e.key === "Enter" || e.key === " " || e.key === "Spacebar")) {
                  e.preventDefault();
                  setSelectedRegion(selectedRegion === id ? null : id);
                }
              }}
              style={{ cursor: hasNote ? "pointer" : "default" }}
              role={hasNote ? "button" : undefined}
              tabIndex={hasNote ? 0 : undefined}
              aria-label={hasNote ? `${nameOf(id)}: ${STATUS_LABELS[status]}. Tap for why.` : `${nameOf(id)}: ${STATUS_LABELS[status]}`}
            >
              <title>{`${nameOf(id)}: ${STATUS_LABELS[status]}${hasNote ? " (tap for why)" : ""}`}</title>
              {isHighlighted && (
                <circle cx={x} cy={y} r={r + 5} fill="none" stroke={accent} strokeWidth="3" strokeDasharray="6 3" />
              )}
              <circle cx={x} cy={y} r={r} fill={STATUS_COLORS[status]} stroke="#241a10" strokeWidth="1.5" />
              <text
                x={x} y={labelY}
                textAnchor="middle"
                fontSize="9"
                fontWeight="700"
                fill="#241a10"
                stroke="#f6efdf"
                strokeWidth="3"
                strokeLinejoin="round"
                paintOrder="stroke"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                {nameOf(id)}
              </text>
              {hasNote && <circle cx={x + r - 3} cy={y - r + 3} r="4" fill={lightFill ? "#241a10" : "#f0e6cc"} opacity="0.85" />}
            </g>
          );
        })}

        <PacificFronts fronts={fronts} s={markScale} />
        {report && month === maxMonth && <PacificMarks marks={report.marks} arrows={report.arrows} accent={accent} view={view} />}

        {!(report && report.frame) && (
          <g>
            <rect x={VBW - 230} y={VBH - 56} width="216" height="42" fill="#e3d5ae" stroke="#3a2a18" strokeWidth="2" />
            <text x={VBW - 220} y={VBH - 40} fontSize="9" fontWeight="700" fill="#3a2a18" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
              THEATER MAP
            </text>
            <text x={VBW - 220} y={VBH - 27} fontSize="8" fill="#3a2a18" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
              REAL COASTLINES · SMALLER POINTS SIZED BY POPULATION
            </text>
          </g>
        )}
      </svg>
      <p className="sr-only">
        {`The map on ${monthLabel}. `}
        {report && report.marks && report.marks.name ? `This report is set at ${report.marks.name}. ` : ""}
        {Object.entries(
          MAP_REGIONS.reduce((acc, r) => {
            const st = statuses[r.id] || "neutral";
            (acc[st] = acc[st] || []).push(r.name);
            return acc;
          }, {})
        )
          .map(([st, names]) => `${STATUS_LABELS[st]}: ${names.join(", ")}.`)
          .join(" ")}
      </p>
      {selectedRegion && regionNotes[selectedRegion] && (
        <div
          className="mt-2 p-3 border-2 text-[12px] leading-relaxed"
          style={{ borderColor: accent, backgroundColor: "#f6efdf", fontFamily: "'Courier Prime', monospace" }}
        >
          <strong style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{nameOf(selectedRegion)}:</strong> {regionNotes[selectedRegion]}
        </div>
      )}
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
        {usedStatuses.map((s) => (
          <div key={s} className="flex items-center gap-1 text-[11px] text-[#000000]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            <span
              className="inline-block w-3 h-3 border border-black"
              style={{ background: STATUS_COLORS[s] }}
            />
            {STATUS_LABELS[s]}
          </div>
        ))}
      </div>
      {notes.map((n, i) => (
        <p
          key={i}
          className="text-[11px] mt-1 text-[#000000] font-semibold border-l-4 pl-2"
          style={{ borderColor: accent || "#7a2e2e", fontFamily: "'Courier Prime', monospace" }}
        >
          ◈ {n}
        </p>
      ))}
    </div>
  );
}


const PAC_VBW = 960;
const PAC_VBH = 650;
/** [longitude, latitude] to the map's sheet (the projection PacificMap draws its coastlines with). Longitudes east of the date line are written above 180, so Pearl Harbor is 202.03. */
const pacificXY = (lo, la) => [40 + (lo - 79) * 7.15, 30 + (53 - la) * 7.19];

// The front through time, the place of each report, and the orders drawn on the map (ported from Dispatches 1940's report map).
//
// MAP_FRONT_SERIES: for each land theatre, the front as a list of entries; an entry holds from the day it begins until the next one (null lines end the theatre).
// A line is a list of [longitude, latitude] points, drawn from the course of the fighting and not surveyed: the map says so. A front is drawn on a day only if the
// regions it runs through (`watch`) stand as the record had them, or are still being fought over: a run that has departed from the record there gets the record's
// line drawn dashed in red, and none at all if no fighting is left. tools/check-map-front.mjs checks the data.
//
// MAP_PLACES: where each report is set, by command and report, as [longitude, latitude, name]. The map marks the report's place and the last few places before it.
// MAP_OFF_MAP: the reports set beyond the sheet, with the name of the place; the map draws an arrow at the edge.
// MAP_OPS: the orders of some reports, drawn on the map when the player picks one from the list under it.

const MAP_FRONT_SERIES = [
  {
    id: "china",
    watch: ["hunanGuangxi", "eastChina", "northChina"],
    entries: [
      { from: "1940-01-01", lines: [[[111.0, 40.6], [111.2, 38.0], [110.4, 35.0], [112.4, 34.6], [114.0, 33.5], [115.0, 31.8], [114.2, 30.6], [113.1, 29.4], [115.8, 28.7], [117.5, 28.4], [119.5, 28.0]], [[113.0, 23.4], [114.4, 23.2]]] },
      { from: "1944-04-17", lines: [[[111.0, 40.6], [111.2, 38.0], [110.4, 35.0], [111.6, 34.5], [113.7, 34.5], [114.0, 33.5], [115.0, 31.8], [114.2, 30.6], [113.1, 29.4], [115.8, 28.7], [117.5, 28.4], [119.5, 28.0]], [[113.0, 23.4], [114.4, 23.2]]] },
      { from: "1944-06-20", lines: [[[111.0, 40.6], [111.2, 38.0], [110.4, 35.0], [111.6, 34.5], [113.7, 34.5], [114.0, 33.5], [115.0, 31.8], [113.4, 30.0], [112.9, 28.2], [114.0, 27.0], [115.8, 28.7], [117.5, 28.4], [119.5, 28.0]], [[113.0, 23.4], [114.4, 23.2]]] },
      { from: "1944-08-10", lines: [[[111.0, 40.6], [111.2, 38.0], [110.4, 35.0], [111.6, 34.5], [113.7, 34.5], [114.0, 33.5], [115.0, 31.8], [113.4, 30.0], [112.6, 26.9], [113.6, 25.1], [115.8, 28.7], [117.5, 28.4], [119.5, 28.0]], [[113.0, 23.4], [114.4, 23.2]]] },
      { from: "1944-12-10", lines: [[[111.0, 40.6], [111.2, 38.0], [110.4, 35.0], [111.6, 34.5], [113.7, 34.5], [114.0, 33.5], [115.0, 31.8], [113.4, 30.0], [112.6, 26.9], [111.3, 25.3], [109.4, 24.3], [108.3, 22.8], [106.0, 21.5]]] },
      { from: "1945-05-26", lines: [[[111.0, 40.6], [111.2, 38.0], [110.4, 35.0], [111.6, 34.5], [113.7, 34.5], [114.0, 33.5], [115.0, 31.8], [113.4, 30.0], [112.6, 26.9], [113.6, 25.1], [115.8, 28.7], [117.5, 28.4], [119.5, 28.0]]] },
      { from: "1945-08-15", lines: null },
    ],
  },
  {
    id: "burma",
    watch: ["burma"],
    entries: [
      { from: "1942-01-20", lines: [[[98.6, 18.4], [97.6, 16.5], [98.2, 14.0]]] },
      { from: "1942-03-08", lines: [[[96.4, 18.9], [96.1, 16.8], [95.0, 17.3]]] },
      { from: "1942-05-20", lines: [[[96.3, 27.3], [94.8, 26.0], [94.4, 24.2], [93.8, 21.9], [92.9, 20.2]]] },
      { from: "1944-03-08", lines: [[[96.3, 27.3], [94.6, 25.4], [93.9, 24.8], [93.8, 23.4], [93.2, 21.5], [92.9, 20.2]]] },
      { from: "1944-07-05", lines: [[[97.4, 25.4], [95.5, 24.6], [94.5, 23.5], [94.3, 22.0], [93.5, 20.8], [92.9, 20.2]]] },
      { from: "1945-03-03", lines: [[[98.0, 24.0], [96.2, 22.0], [95.9, 20.9], [94.7, 19.9], [94.5, 18.5], [95.0, 17.3]]] },
      { from: "1945-05-03", lines: null },
    ],
  },
  {
    id: "newGuinea",
    watch: ["newGuinea"],
    entries: [
      { from: "1942-07-21", lines: [[[148.4, -8.65], [147.73, -8.88]]] },
      { from: "1942-09-17", lines: [[[148.4, -8.65], [147.55, -9.15]]] },
      { from: "1943-01-22", lines: [[[148.3, -8.7], [147.0, -7.0], [146.4, -6.0]]] },
      { from: "1943-09-16", lines: [[[147.85, -6.6], [146.8, -6.7], [145.8, -5.2]]] },
      { from: "1944-04-22", lines: [[[145.8, -5.2], [143.6, -3.6]]] },
      { from: "1945-01-01", lines: null },
    ],
  },
];

// ---- where each report is set ----
const MAP_PLACES = {
  japan: {
    nomonhan39: [119.0, 47.7, "Nomonhan"], chinaPeaceQuestion40: [118.8, 32.05, "Nanking"], indochinaMission40: [105.85, 21.03, "Hanoi"], burmaRoad40: [102.7, 25.04, "Kunming"],
    tripartitePact40: [139.7, 35.7, "Tokyo"], neutralityPact41: [37.6, 55.75, "Moscow"], unificationQuestion40: [139.7, 35.7, "Tokyo"], hokushinDebate41: [139.7, 35.7, "Tokyo"], kantokuenOffensive41: [125.3, 43.9, "Hsinking"],
    siberianReckoning42: [131.9, 43.1, "Vladivostok"], indochinaOccupation41: [106.7, 10.8, "Saigon"], novemberUltimatum41: [139.7, 35.7, "Tokyo"], pearlHarbor41: [202.03, 21.35, "Pearl Harbor"],
    burmaRangoon42: [96.15, 16.8, "Rangoon"], indianOceanRaid42: [79.85, 6.93, "Colombo"], burmaRangoon42Delayed: [96.15, 16.8, "Rangoon"], bataanPOWQuestion42: [120.45, 14.45, "Bataan"],
    doolittleRaid42: [139.7, 35.7, "Tokyo"], doolittleAirmen42: [121.5, 31.2, "Shanghai"], coralSea42: [147.15, -9.45, "Port Moresby"], midway42: [182.63, 28.2, "Midway"],
    yamamotoAscendant42: [202.03, 21.35, "Pearl Harbor"], aPacificWonTwice43: [79.85, 6.93, "Colombo"], earlyPeaceQuestion42: [139.7, 35.7, "Tokyo"], aStrongerHandToPlay42: [139.7, 35.7, "Tokyo"],
    aPeaceNooneExpected42: [139.7, 35.7, "Tokyo"], earlyPeaceChannel42: [139.7, 35.7, "Tokyo"], earlyPeaceOutcome42: [139.7, 35.7, "Tokyo"], kokodaTrail42: [147.73, -8.88, "Kokoda"],
    guadalcanal42: [160.0, -9.43, "Henderson Field"], keGoWithdrawal43: [159.8, -9.2, "Cape Esperance"], yamamotoDeath43: [155.7, -6.8, "Buin"], attu43: [172.9, 52.9, "Attu"],
    theMainlandCrisis44: [112.6, 26.9, "Hengyang"], ichiGoTriumph44: [110.3, 25.3, "Guilin"], philippineSea44: [145.75, 15.2, "Saipan"], onishiKamikaze44: [120.55, 15.2, "Clark Field"],
    leyteGulf44: [125.2, 11.0, "Leyte Gulf"], kuritaAtLeyte44: [126.0, 11.5, "Samar"], leyteBeachheadAftermath44: [124.9, 11.2, "Leyte"], iwoJima45: [141.3, 24.78, "Iwo Jima"],
    okinawa45: [127.9, 26.3, "Okinawa"], theSubmarineCarriersQuestion45: [139.8, 10.0, "Ulithi"], ketsuGo45: [139.7, 35.7, "Tokyo"], afterHiroshima45: [132.45, 34.4, "Hiroshima"],
    afterNagasaki45: [129.87, 32.75, "Nagasaki"], sacredDecision45: [139.7, 35.7, "Tokyo"], ketsuGoFinalStand45: [139.7, 35.7, "Tokyo"], theDeadlockHolds45: [139.7, 35.7, "Tokyo"],
    termsWorthHaving45: [139.7, 35.7, "Tokyo"], unhinderedSouth42: [106.8, -6.2, "Batavia"], australiaLanding42: [130.85, -12.46, "Darwin"], washingtonDecides42: [283.0, 38.9, "Washington"],
    perimeterDoctrine42: [152.2, -4.2, "Rabaul"], severSupplyLine42: [166.45, -22.27, "Noumea"], operationFsCulmination42: [178.4, -18.1, "Suva"], earlyPerimeter43: [155.2, -6.2, "Bougainville"],
    theLongWarFooting45: [139.7, 35.7, "Tokyo"], moscowMediates45: [37.6, 55.75, "Moscow"], surrenderInquiry45: [139.7, 35.7, "Tokyo"], twoFrontStrain44: [103.85, 1.3, "Singapore"],
    theDelayedStrike44: [202.03, 21.35, "Pearl Harbor"], theUnbloodiedFleets45: [145.75, 15.2, "Saipan"], theUndemolishedFields44: [104.75, -2.98, "Palembang"], theFuelLedger44: [139.7, 35.7, "Tokyo"],
    aSecondArmisticeQuestion44: [139.7, 35.7, "Tokyo"], theBelatedReckoning45: [139.7, 35.7, "Tokyo"], kantokuenFinalWord46: [139.7, 35.7, "Tokyo"], americaDecides44: [283.0, 38.9, "Washington"],
    aQuietEmpire45: [139.7, 35.7, "Tokyo"], newWorldOrder45: [139.7, 35.7, "Tokyo"], coldWarOpening48: [139.7, 35.7, "Tokyo"], theRommelQuestion43: [13.4, 52.5, "Berlin"],
  },
  alliedPacific: {
    fleetAtHawaii40: [202.03, 21.35, "Pearl Harbor"], richardsonObjection40: [202.03, 21.35, "Pearl Harbor"], atlanticTransfer41: [202.03, 21.35, "Pearl Harbor"], americanEmbargoResponse41: [283.0, 38.9, "Washington"],
    chinaAirForce41: [102.7, 25.04, "Kunming"], aStandoffInsteadOfAWar41: [283.0, 38.9, "Washington"], theSlowerDeclaration42: [283.0, 38.9, "Washington"], warBeginsLate42: [283.0, 38.9, "Washington"],
    theUnopposedConsolidation42: [103.85, 1.3, "Singapore"], twoForcesNeitherTested43: [160.0, -9.43, "Guadalcanal"], chinasWarAlone43: [106.55, 29.56, "Chungking"], britainsCalculus43: [-0.13, 51.5, "London"],
    japanUnopposed43: [103.85, 1.3, "Singapore"], chinaCivilWarShadow43: [109.5, 36.6, "Yan'an"], dutchExileCalculus44: [106.8, -6.2, "Batavia"], warWithoutAmerica45: [125.3, 43.9, "Hsinking"],
    wakeIslandRelief41: [166.63, 19.3, "Wake"], arcadia41: [283.0, 38.9, "Washington"], internmentQuestion42: [283.0, 38.9, "Washington"], stilwellInChungking42: [106.55, 29.56, "Chungking"],
    rangoonRetreatAllied42: [96.15, 16.8, "Rangoon"], curtinsTurn42: [149.1, -35.3, "Canberra"], corregidorEvacuation42: [120.58, 14.38, "Corregidor"], doolittleRaidAllied42: [153.0, 35.0, "The launch point"],
    carrierRequest42: [-0.13, 51.5, "London"], coralSeaMidwayAllied42: [182.63, 28.2, "Midway"], kokodaTrailAllied42: [147.73, -8.88, "Kokoda"], guadalcanalAllied42: [160.0, -9.43, "Lunga"],
    savoIslandReckoning42: [159.8, -9.15, "Savo Island"], vladivostokRoute42: [131.9, 43.1, "Vladivostok"], unconditionalSurrender43: [-7.6, 33.6, "Casablanca"], torpedoCrisis43: [202.03, 21.35, "Pearl Harbor"],
    theBatBombQuestion43: [283.0, 38.9, "Washington"], bismarckSea43: [148.0, -7.3, "The Bismarck Sea"], yamamotoIntercept43: [160.0, -9.43, "Henderson Field"], yamamotoSurvives43: [151.8, 7.4, "Truk"],
    tehransPromise43: [51.4, 35.7, "Tehran"], centralPacificDrive43: [173.0, 1.43, "Tarawa"], theTarawaQuestion43: [173.0, 1.43, "Tarawa"], macArthurTension44: [153.0, -27.5, "Brisbane"],
    macArthurAftermath44: [140.7, -2.55, "Hollandia"], philippineSeaAllied44: [145.75, 15.2, "Saipan"], chinaCrisisAllied44: [106.55, 29.56, "Chungking"], stilwellUltimatum44: [106.55, 29.56, "Chungking"],
    stilwellPreserved44: [106.55, 29.56, "Chungking"], peleliuDecision44: [134.25, 7.0, "Peleliu"], peleliuForcesRedirected44: [134.25, 7.0, "Peleliu"], aDifferentPacific45: [202.03, 21.35, "Pearl Harbor"],
    aDifferentPacificFinalWord45: [283.0, 38.9, "Washington"], portChicago44: [238.0, 38.05, "Port Chicago"], philippinesFormosaAllied44: [202.03, 21.35, "Pearl Harbor"], quezonsSuccessor44: [125.0, 11.25, "Tacloban"],
    halseyTyphoon44: [127.0, 14.0, "The Philippine Sea"], halseyAftermath44: [139.8, 10.0, "Ulithi"], burmaReconquest45: [97.4, 25.38, "Myitkyina"], cabanatuanRaid45: [121.05, 15.5, "Cabanatuan"],
    iwoJimaAllied45: [141.3, 24.78, "Iwo Jima"], okinawaAllied45: [127.9, 26.3, "Okinawa"], strategicBombingAllied45Delayed: [139.7, 35.7, "Tokyo"], atomicDemonstration45: [283.0, 38.9, "Washington"],
    targetSelection45: [145.63, 15.0, "Tinian"], kyotoTargetDebate45: [135.77, 35.01, "Kyoto"], kyotoStruck45: [135.77, 35.01, "Kyoto"], hiroshima45: [132.45, 34.4, "Hiroshima"],
    nagasaki45: [129.87, 32.75, "Nagasaki"], nagasakiDelayed45: [129.87, 32.75, "Nagasaki"], radiationDisclosure45: [132.45, 34.4, "Hiroshima"], indianapolisSinking45: [133.5, 12.0, "The Philippine Sea"],
    indianapolisReview45: [283.0, 38.9, "Washington"], downfallOrBlockade45: [130.55, 31.6, "Kyushu"], gasWarfareQuestion45: [283.0, 38.9, "Washington"], combinedPressureCollapse45: [139.7, 35.7, "Tokyo"],
    sovietHokkaido45: [141.67, 45.4, "Wakkanai"], theEmperorQuestion45: [139.7, 35.7, "Tokyo"], occupationAuthority45: [139.7, 35.7, "Tokyo"], pacificFirstGamble42: [283.0, 38.9, "Washington"],
    conservativePacific42: [202.03, 21.35, "Pearl Harbor"], japanStrikesAgain42: [166.45, -22.27, "Noumea"],
  },
};

const mapArrow = (kind, from, to) => ({ kind, from, to });
const mapStand = (at) => ({ kind: "hold", at });

// ---- the orders on the map ----
// For a report, each order that can be given is drawn when the player picks it from the list under the map: a solid arrow for an attack, a dashed one for a move,
// a dotted one for a withdrawal, a ring for a stand. The drawing is schematic: it shows where the weight goes, not a line of advance. An order is found by the
// start of its label (`match`), so a report whose orders change with the file still finds the ones it has. tools/check-map-front.mjs checks every entry.
const MAP_OPS = {
  japan: {
    hokushinDebate41: [
      { match: "Hold to the Southern Operation: the resources", note: "The weight stays on the south: the army gathers in Indochina for Malaya and the Indies.", arrows: [mapStand([106.7, 10.8]), mapArrow("move", [106.7, 10.8], [103.85, 1.3])] },
      { match: "Execute Kantokuen", note: "The Kwantung Army attacks north and east from Manchukuo towards Vladivostok and the Amur.", arrows: [mapArrow("attack", [129.6, 44.6], [131.9, 43.1]), mapArrow("attack", [127.5, 50.3], [135.1, 48.5])] },
      { match: "Hold to the Southern Operation, but run", note: "The south stays the main effort, and a limited probe goes across the eastern border.", arrows: [mapStand([106.7, 10.8]), mapArrow("attack", [129.6, 44.6], [130.6, 43.9])] },
    ],
    kantokuenOffensive41: [
      { match: "Push deep", note: "The drive goes for the railway itself, at Vladivostok, Khabarovsk and Svobodny.", arrows: [mapArrow("attack", [129.6, 44.6], [131.9, 43.1]), mapArrow("attack", [133.0, 47.7], [135.1, 48.5]), mapArrow("attack", [127.5, 50.3], [128.1, 51.4])] },
      { match: "Limit the objective", note: "The army takes the border country on the eastern side and goes no further.", arrows: [mapArrow("attack", [129.6, 44.6], [131.0, 44.0]), mapStand([131.0, 44.0])] },
    ],
    indochinaOccupation41: [
      { match: "Proceed with the full occupation", note: "Troops come south by sea, from Hainan to Saigon and the naval base at Cam Ranh.", arrows: [mapArrow("move", [109.5, 18.3], [106.7, 10.8]), mapArrow("move", [109.5, 18.3], [109.2, 11.9])] },
      { match: "Negotiate limited basing", note: "Japan asks for bases and the right of transit, and keeps its troops in the north.", arrows: [mapStand([105.85, 21.03]), mapStand([106.7, 10.8])] },
      { match: "Occupy in stages", note: "The ports and airfields are taken first, around Saigon and Cam Ranh, and the rest is held back.", arrows: [mapArrow("move", [109.5, 18.3], [106.7, 10.8]), mapStand([109.2, 11.9])] },
    ],
    pearlHarbor41: [
      { match: "Execute the Pearl Harbor strike as planned", note: "The carriers sail from the Kuriles by the northern route and strike Oahu from the north.", arrows: [mapArrow("move", [147.9, 43.5], [198.0, 33.0]), mapArrow("attack", [198.0, 33.0], [202.03, 21.35])] },
      { match: "Bypass Oahu", note: "No carrier goes east. All of them go to the south, for the Philippines, Malaya and the Indies.", arrows: [mapArrow("move", [139.7, 35.7], [125.0, 18.0]), mapArrow("attack", [125.0, 18.0], [120.98, 14.6]), mapArrow("attack", [125.0, 18.0], [103.85, 1.3])] },
      { match: "Execute the strike with orders for a follow-up", note: "The same approach, with a second strike held ready for the dockyards and the oil tanks.", arrows: [mapArrow("move", [147.9, 43.5], [198.0, 33.0]), mapArrow("attack", [198.0, 33.0], [202.03, 21.35]), mapStand([198.0, 33.0])] },
    ],
    burmaRangoon42: [
      { match: "Press the jungle drive", note: "The 15th Army drives from Moulmein straight at Rangoon.", arrows: [mapArrow("attack", [97.63, 16.5], [96.15, 16.8])] },
      { match: "Advance methodically along the coast", note: "The advance goes along the coast with the guns of the navy beside it.", arrows: [mapArrow("move", [97.63, 16.5], [96.15, 16.8])] },
      { match: "Send a second column north", note: "A second column goes north to Toungoo and Lashio, to cut the Burma Road.", arrows: [mapArrow("attack", [97.63, 16.5], [96.15, 16.8]), mapArrow("attack", [96.15, 16.8], [96.43, 18.93]), mapArrow("attack", [96.43, 18.93], [97.75, 22.93])] },
    ],
    indianOceanRaid42: [
      { match: "Send the five carriers into the Indian Ocean", note: "The carriers cross from the Celebes to strike Colombo and the ships at Ceylon.", arrows: [mapArrow("attack", [122.9, -4.0], [79.85, 6.93])] },
      { match: "Raid in strength", note: "The same raid, with the force kept in the ocean to hunt for the Eastern Fleet.", arrows: [mapArrow("attack", [122.9, -4.0], [79.85, 6.93]), mapArrow("attack", [122.9, -4.0], [81.2, 8.57])] },
      { match: "Skip the raid", note: "The carriers go home to rest before the next operation.", arrows: [mapArrow("withdraw", [122.9, -4.0], [139.7, 35.7])] },
    ],
    coralSea42: [
      { match: "Accept the decisive battle", note: "The fleet is committed to Midway, from the Inland Sea.", arrows: [mapArrow("attack", [132.3, 34.2], [182.63, 28.2])] },
      { match: "Consolidate", note: "The fleet holds what the south has won, at Rabaul and the Solomons.", arrows: [mapStand([152.2, -4.2])] },
      { match: "Cancel the Aleutian operation", note: "The light carriers join the Midway force, and nothing goes to the Aleutians.", arrows: [mapArrow("attack", [132.3, 34.2], [182.63, 28.2])] },
    ],
    midway42: [
      { match: "Proceed with the plan as built", note: "The carriers and the invasion force go for Midway, and a diversion goes to the Aleutians.", arrows: [mapArrow("attack", [132.3, 34.2], [182.63, 28.2]), mapArrow("attack", [141.15, 40.8], [193.5, 53.9])] },
      { match: "Redirect at sea", note: "The carrier force turns south, for Fiji and Samoa and the American supply line.", arrows: [mapArrow("attack", [152.2, -4.2], [178.4, -18.1]), mapArrow("attack", [178.4, -18.1], [188.3, -13.8])] },
      { match: "Proceed with the plan, and bring", note: "The same plan, with the battleships of the Main Body brought up close behind the carriers.", arrows: [mapArrow("attack", [132.3, 34.2], [182.63, 28.2]), mapStand([180.0, 29.8])] },
    ],
    kokodaTrail42: [
      { match: "Press the final push", note: "The detachment goes on from Ioribaiwa towards Port Moresby, at the end of its supply line.", arrows: [mapArrow("attack", [147.55, -9.15], [147.15, -9.45])] },
      { match: "Order an earlier withdrawal", note: "The detachment falls back over the track to Kokoda and the coast at Buna.", arrows: [mapArrow("withdraw", [147.55, -9.15], [147.73, -8.88]), mapArrow("withdraw", [147.73, -8.88], [148.4, -8.65])] },
      { match: "Halt at Ioribaiwa", note: "The detachment stops on the high ground and waits for the supply line to be rebuilt.", arrows: [mapStand([147.55, -9.15])] },
    ],
    guadalcanal42: [
      { match: "Commit destroyers and remaining naval air", note: "Destroyers and aircraft from the Shortlands and Rabaul go against Henderson Field.", arrows: [mapArrow("attack", [155.8, -7.1], [160.0, -9.43]), mapArrow("attack", [152.2, -4.2], [160.0, -9.43])] },
      { match: "Concede Guadalcanal early", note: "The garrison is brought out, to a line at Bougainville and Rabaul.", arrows: [mapArrow("withdraw", [160.0, -9.43], [155.7, -6.8]), mapStand([152.2, -4.2])] },
      { match: "Commit the Army's 2nd and 38th", note: "Two divisions go in a single lift from Rabaul, in place of battalions by destroyer.", arrows: [mapArrow("attack", [152.2, -4.2], [160.0, -9.43])] },
    ],
    philippineSea44: [
      { match: "Commit the fleet to the decisive battle", note: "The Mobile Fleet sails from the Philippines to meet the American carriers off Saipan.", arrows: [mapArrow("attack", [122.0, 10.5], [145.75, 15.2])] },
      { match: "Decline the fleet action", note: "The fleet stays away, and Saipan is left to its garrison.", arrows: [mapArrow("withdraw", [145.75, 15.2], [127.9, 26.3]), mapStand([145.75, 15.2])] },
    ],
    leyteGulf44: [
      { match: "Execute Sho-Go as planned", note: "The carriers sail from Japan as a decoy, while the battleships come through San Bernardino and Surigao Straits.", arrows: [mapArrow("move", [132.3, 34.2], [127.0, 19.5]), mapArrow("attack", [114.95, 4.9], [124.2, 12.5]), mapArrow("attack", [119.0, 8.5], [125.4, 10.1])] },
      { match: "Concentrate what remains on Formosa", note: "The fleet is kept back for Formosa and the home approaches, and the Philippines are given up.", arrows: [mapStand([121.0, 23.7]), mapArrow("withdraw", [125.2, 11.0], [121.0, 23.7])] },
      { match: "Send the Southern Force through San Bernardino", note: "The Southern Force follows Kurita through San Bernardino Strait in one column.", arrows: [mapArrow("attack", [114.95, 4.9], [124.2, 12.5]), mapArrow("attack", [124.2, 12.5], [125.2, 11.0])] },
    ],
    iwoJima45: [
      { match: "Reinforce and hold", note: "The garrison stays on the island to the end, with no way out.", arrows: [mapStand([141.3, 24.78])] },
      { match: "Decline further reinforcement", note: "The island is left as it is, and the spare strength goes to Okinawa.", arrows: [mapStand([141.3, 24.78]), mapArrow("move", [139.7, 35.7], [127.9, 26.3])] },
    ],
    okinawa45: [
      { match: "Commit everything", note: "Yamato sails from the Inland Sea, and the kamikaze aircraft fly from Kyushu, against the fleet off Okinawa.", arrows: [mapArrow("attack", [131.8, 34.0], [127.9, 26.3]), mapArrow("attack", [130.6, 31.4], [127.9, 26.3])] },
      { match: "Withhold Yamato", note: "Yamato and the aircraft are kept in Japan for the defence of the home islands.", arrows: [mapStand([131.8, 34.0]), mapStand([130.6, 31.4])] },
    ],
    australiaLanding42: [
      { match: "Force the landing", note: "Troops go ashore at Darwin from Timor, with the escort thinning.", arrows: [mapArrow("attack", [123.6, -10.17], [130.85, -12.46])] },
      { match: "Abort the landing", note: "The fleet is turned back from Darwin to Timor.", arrows: [mapArrow("withdraw", [127.0, -11.0], [123.6, -10.17])] },
    ],
  },
  alliedPacific: {
    wakeIslandRelief41: [
      { match: "Recall the relief force", note: "The carrier turns back for Pearl Harbor and Wake is left alone.", arrows: [mapArrow("withdraw", [185.0, 19.8], [202.03, 21.35])] },
      { match: "Send the relief force onward", note: "The carrier goes on to Wake, towards a Japanese force that is already converging on it.", arrows: [mapArrow("move", [202.03, 21.35], [166.63, 19.3])] },
      { match: "Use the carriers to raid the Marshalls", note: "The carriers strike the Marshalls as a diversion, and Wake is left alone.", arrows: [mapArrow("attack", [202.03, 21.35], [171.4, 7.1]), mapStand([166.63, 19.3])] },
    ],
    rangoonRetreatAllied42: [
      { match: "Order a fighting retreat", note: "The army falls back from Rangoon north towards the Indian border at Imphal.", arrows: [mapArrow("withdraw", [96.15, 16.8], [93.9, 24.8])] },
      { match: "Commit the Chinese divisions", note: "The army stands in Rangoon with the Chinese divisions beside it.", arrows: [mapStand([96.15, 16.8])] },
    ],
    corregidorEvacuation42: [
      { match: "Comply with the order", note: "MacArthur leaves Corregidor by PT boat for Mindanao, and goes on by air to Australia.", arrows: [mapArrow("move", [120.58, 14.38], [124.7, 8.5]), mapArrow("move", [124.7, 8.5], [130.85, -12.46])] },
      { match: "Defy the order", note: "MacArthur stays on Corregidor with the garrison and does not leave for Australia.", arrows: [mapStand([120.58, 14.38])] },
    ],
    doolittleRaidAllied42: [
      { match: "Launch immediately", note: "The bombers take off far out at sea, strike Tokyo, and fly on towards China.", arrows: [mapArrow("attack", [153.0, 35.0], [139.7, 35.7]), mapArrow("move", [139.7, 35.7], [119.0, 29.0])] },
      { match: "Abort the mission", note: "The task force turns away and the bombers do not fly.", arrows: [mapArrow("withdraw", [153.0, 35.0], [170.0, 34.0])] },
    ],
    coralSeaMidwayAllied42: [
      { match: "Commit all three available carriers", note: "The carriers wait north east of Midway, out of sight, for the Japanese force to come in.", arrows: [mapArrow("move", [202.03, 21.35], [184.5, 32.5]), mapArrow("attack", [184.5, 32.5], [180.0, 31.3])] },
      { match: "Play conservative", note: "The carriers stay at Hawaii, and the Australia route is guarded instead.", arrows: [mapStand([202.03, 21.35]), mapStand([166.45, -22.27])] },
      { match: "Commit all three carriers, and hold", note: "The same ambush, with a reserve group held back to follow it up.", arrows: [mapArrow("move", [202.03, 21.35], [184.5, 32.5]), mapArrow("attack", [184.5, 32.5], [180.0, 31.3]), mapStand([186.0, 30.5])] },
    ],
    kokodaTrailAllied42: [
      { match: "Back Blamey", note: "The Australians fall back along the track and fight as they go.", arrows: [mapArrow("withdraw", [147.73, -8.88], [147.55, -9.15]), mapArrow("withdraw", [147.55, -9.15], [147.15, -9.45])] },
      { match: "Demand an immediate stand", note: "The line is ordered to stand at Kokoda.", arrows: [mapStand([147.73, -8.88])] },
      { match: "Send the American 32nd Division", note: "The American division goes up the track from Port Moresby to take over the line.", arrows: [mapArrow("move", [147.15, -9.45], [147.73, -8.88])] },
    ],
    guadalcanalAllied42: [
      { match: "Land the Marines immediately", note: "The force gathers in the South Pacific and the Marines land at Lunga on the seventh of August.", arrows: [mapArrow("attack", [166.45, -22.27], [160.0, -9.43])] },
      { match: "Delay three months", note: "The force stays at its bases in the South Pacific while shipping, aircraft and supply are built up.", arrows: [mapStand([166.45, -22.27])] },
    ],
    peleliuDecision44: [
      { match: "Proceed with the landing", note: "The invasion force sails for Peleliu, and Angaur is attacked with it.", arrows: [mapArrow("attack", [147.3, -2.0], [134.25, 7.0])] },
      { match: "Cancel Stalemate II", note: "The force is recalled before it lands, and Peleliu is left alone.", arrows: [mapStand([147.3, -2.0])] },
    ],
    philippinesFormosaAllied44: [
      { match: "Liberate the Philippines", note: "The advance goes from New Guinea to Leyte and then to Luzon.", arrows: [mapArrow("attack", [140.7, -2.55], [125.0, 11.0]), mapArrow("attack", [125.0, 11.0], [120.3, 16.0])] },
      { match: "Bypass the Philippines", note: "The advance goes from the Marianas to Formosa.", arrows: [mapArrow("attack", [145.75, 15.2], [121.0, 23.7])] },
    ],
    burmaReconquest45: [
      { match: "Force the Ledo Road", note: "The road is built on from Ledo to join the Burma Road at Wanting.", arrows: [mapArrow("move", [95.9, 27.3], [98.1, 24.0])] },
      { match: "Rely permanently on the Hump", note: "Supplies keep going by air from Assam to Kunming.", arrows: [mapArrow("move", [95.2, 27.5], [102.7, 25.04])] },
    ],
    iwoJimaAllied45: [
      { match: "Accept the compressed", note: "The landing force sails from the Marianas on the planned date.", arrows: [mapArrow("attack", [145.7, 15.0], [141.3, 24.78])] },
      { match: "Insist on the full extended", note: "The landing force waits in the Marianas while the guns fire longer.", arrows: [mapStand([145.7, 15.0])] },
    ],
    okinawaAllied45: [
      { match: "Hold the radar picket line", note: "Destroyers stand on picket stations to the north of the island, in the path of the aircraft.", arrows: [mapStand([128.0, 28.5]), mapStand([129.3, 27.6])] },
      { match: "Pull the picket line back", note: "The stations are drawn back, and the warning comes later.", arrows: [mapArrow("withdraw", [128.0, 28.5], [127.5, 27.2])] },
    ],
    downfallOrBlockade45: [
      { match: "Prepare Operation Downfall", note: "Landings are prepared on Kyushu and then on the Kanto plain, from Okinawa.", arrows: [mapArrow("attack", [127.9, 26.3], [130.55, 31.6]), mapArrow("attack", [127.9, 26.3], [140.0, 35.5])] },
      { match: "Pursue Operation Starvation", note: "Mines and aircraft close the straits and the ports, and there is no landing.", arrows: [mapStand([130.9, 33.95]), mapStand([135.2, 34.5])] },
      { match: "Accelerate Downfall's timetable", note: "The landings go in earlier, on Kyushu and the Kanto plain, before the force is ready.", arrows: [mapArrow("attack", [127.9, 26.3], [130.55, 31.6]), mapArrow("attack", [127.9, 26.3], [140.0, 35.5])] },
    ],
    sovietHokkaido45: [
      { match: "Refuse the Soviet occupation zone", note: "All of Hokkaido stays under American administration, with no Soviet troops on it.", arrows: [mapStand([141.35, 43.06])] },
      { match: "Grant a limited Soviet occupation zone", note: "Soviet troops cross from Sakhalin into the north of Hokkaido.", arrows: [mapArrow("move", [142.7, 46.6], [141.67, 45.4])] },
    ],
  },
};

const mapIsoKey = (iso) => Number(iso.replace(/-/g, ""));

/**
 * The fronts drawn on a day: each theatre's latest entry that began before the day. A theatre whose regions stand as the record had them draws the record's
 * line; one that has departed from the record draws it dashed in red if some fighting is still going on there, and nothing if there is none.
 */
function frontsOn(dayKey, statuses) {
  if (dayKey == null || !statuses) return [];
  const base = baselineStatuses(dayKey);
  const out = [];
  for (const theatre of MAP_FRONT_SERIES) {
    let hit = null;
    for (const e of theatre.entries) {
      if (mapIsoKey(e.from) < dayKey) hit = e;
      else break;
    }
    if (!hit || !hit.lines) continue;
    const watch = hit.watch || theatre.watch;
    const moved = watch.some((r) => statuses[r] !== base[r]);
    if (moved && !watch.some((r) => statuses[r] === "contested")) continue;
    out.push({ id: theatre.id, lines: hit.lines, projection: moved });
  }
  return out;
}

/** The window of a framed map in sheet units around some places, at the shape of the window (width over height), or null if the places are too far apart or off the sheet. */
function pacificFrame(points, aspect = 2) {
  const ps = points.filter(Boolean).map(([lo, la]) => pacificXY(lo, la)).filter(([x, y]) => x > -30 && x < PAC_VBW + 30 && y > -30 && y < PAC_VBH + 30);
  if (!ps.length) return null;
  const xs = ps.map((p) => p[0]);
  const ys = ps.map((p) => p[1]);
  let w = Math.max(Math.max(...xs) - Math.min(...xs) + 220, 330);
  let h = w / aspect;
  const need = Math.max(Math.max(...ys) - Math.min(...ys) + 150, 165);
  if (h < need) {
    h = need;
    w = h * aspect;
  }
  if (w > PAC_VBW || h > PAC_VBH) return null;
  const x = Math.max(0, Math.min(PAC_VBW - w, (Math.min(...xs) + Math.max(...xs)) / 2 - w / 2));
  const y = Math.max(0, Math.min(PAC_VBH - h, (Math.min(...ys) + Math.max(...ys)) / 2 - h / 2));
  return { x, y, w, h };
}

const pacificPoints = (pts) => pts.map(([lo, la]) => pacificXY(lo, la).map((n) => n.toFixed(1)).join(",")).join(" ");

/** The fronts, drawn over the land: a pale halo and an ink line, red and dashed where the run has departed from the record. */
function PacificFronts({ fronts, s = 1 }) {
  if (!fronts || !fronts.length) return null;
  return (
    <g style={{ pointerEvents: "none" }} aria-hidden="true">
      {fronts.flatMap((f) =>
        f.lines.map((line, i) => (
          <g key={f.id + i}>
            <polyline points={pacificPoints(line)} fill="none" stroke="#f2ead9" strokeWidth={5.4 * s} strokeOpacity={0.85} strokeLinejoin="round" strokeLinecap="round" />
            <polyline points={pacificPoints(line)} fill="none" stroke={f.projection ? "#7a2e2e" : "#1a1410"} strokeWidth={2.4 * s} strokeDasharray={f.projection ? `${7 * s},${4 * s}` : undefined} strokeLinejoin="round" strokeLinecap="round" />
          </g>
        ))
      )}
    </g>
  );
}

/** One drawn order: an arrow (attack solid, move dashed, withdrawal dotted) or a ring (a stand). */
function PacificArrow({ a, accent, past, s }) {
  const color = accent || "#7a2e2e";
  const opacity = past ? 0.35 : 1;
  if (a.kind === "hold") {
    const [x, y] = pacificXY(a.at[0], a.at[1]);
    return (
      <g opacity={opacity}>
        <circle cx={x} cy={y} r={11 * s} fill="none" stroke="#f2ead9" strokeWidth={5.4 * s} />
        <circle cx={x} cy={y} r={11 * s} fill="none" stroke={color} strokeWidth={2.4 * s} />
      </g>
    );
  }
  const [x1, y1] = pacificXY(a.from[0], a.from[1]);
  const [x2, y2] = pacificXY(a.to[0], a.to[1]);
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const ux = (x2 - x1) / len;
  const uy = (y2 - y1) / len;
  const head = Math.min(13 * s, len * 0.5);
  const bx = x2 - ux * head;
  const by = y2 - uy * head;
  const wing = head * 0.5;
  const dash = a.kind === "attack" ? undefined : a.kind === "withdraw" ? `${2 * s},${5 * s}` : `${7 * s},${5 * s}`;
  const tip = `${x2.toFixed(1)},${y2.toFixed(1)} ${(bx - uy * wing).toFixed(1)},${(by + ux * wing).toFixed(1)} ${(bx + uy * wing).toFixed(1)},${(by - ux * wing).toFixed(1)}`;
  return (
    <g opacity={a.kind === "withdraw" ? opacity * 0.8 : opacity} strokeLinecap="round" strokeLinejoin="round">
      <line x1={x1} y1={y1} x2={bx} y2={by} stroke="#f2ead9" strokeWidth={6 * s} />
      <polygon points={tip} fill="#f2ead9" stroke="#f2ead9" strokeWidth={3 * s} />
      <line x1={x1} y1={y1} x2={bx} y2={by} stroke={color} strokeWidth={2.6 * s} strokeDasharray={dash} />
      <polygon points={tip} fill={color} />
    </g>
  );
}

/**
 * The report's place and the places before it, and the orders drawn on the map. `view` is the window being shown, in sheet units, so an arrow for a place beyond
 * it sits on the window's nearest edge. Everything here is for the eye; the map's text version is the sentence under it.
 */
function PacificMarks({ marks, arrows, accent, view }) {
  const s = Math.max(0.55, Math.min(1, (view.w / PAC_VBW) * 1.5));
  const font = { fontFamily: "'IBM Plex Mono', monospace" };
  const label = { fill: "#241d12", stroke: "#f2ead9", strokeWidth: 2.6 * s, paintOrder: "stroke", style: { ...font, fontWeight: 600 } };
  const inView = ([x, y]) => x > view.x + 6 && x < view.x + view.w - 6 && y > view.y + 6 && y < view.y + view.h - 6;
  const here = marks && marks.here ? pacificXY(marks.here[0], marks.here[1]) : null;
  const route = ((marks && marks.trail) || []).filter(Boolean);
  const color = accent || "#7a2e2e";
  return (
    <g style={{ pointerEvents: "none" }} aria-hidden="true">
      {route.length > 1 && (
        <g>
          <polyline points={pacificPoints(route)} fill="none" stroke="#f2ead9" strokeWidth={4.4 * s} strokeOpacity={0.8} strokeLinejoin="round" />
          <polyline points={pacificPoints(route)} fill="none" stroke={color} strokeWidth={1.8 * s} strokeDasharray={`${2 * s},${4 * s}`} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
      {route.slice(0, -1).map((p, i) => {
        const [x, y] = pacificXY(p[0], p[1]);
        return inView([x, y]) ? <circle key={"v" + i} cx={x} cy={y} r={3.2 * s} fill="#f2ead9" stroke={color} strokeWidth={1.4 * s} /> : null;
      })}
      {(arrows || []).map((a, i) => (
        <PacificArrow key={i} a={a} accent={accent} past={a.past} s={s} />
      ))}
      {here && !inView(here) && marks.offLabel && (() => {
        // the report is set beyond the window: an arrow on the nearest edge, pointing the way, with the name of the place
        const cx = view.x + view.w / 2;
        const cy = view.y + view.h / 2;
        const dx = here[0] - cx;
        const dy = here[1] - cy;
        const m = 22 * s;
        const t = Math.min(dx !== 0 ? (view.w / 2 - m) / Math.abs(dx) : Infinity, dy !== 0 ? (view.h / 2 - m) / Math.abs(dy) : Infinity);
        const ex = cx + dx * t;
        const ey = cy + dy * t;
        const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
        const right = ex > cx + view.w * 0.2;
        const left = ex < cx - view.w * 0.2;
        return (
          <g transform={`translate(${ex} ${ey})`}>
            <g transform={`rotate(${ang})`}>
              <path d={`M${10 * s},0 L${-8 * s},${-9 * s} L${-8 * s},${9 * s} Z`} fill={color} stroke="#f2ead9" strokeWidth={2 * s} />
            </g>
            <text x={left ? 14 * s : right ? -14 * s : 0} y={dy < 0 && !left && !right ? 22 * s : dy > 0 && !left && !right ? -14 * s : 4 * s} textAnchor={left ? "start" : right ? "end" : "middle"} fontSize={10 * s} {...label}>{marks.offLabel}</text>
          </g>
        );
      })()}
      {here && inView(here) && (
        <g transform={`translate(${here[0]} ${here[1]})`}>
          <circle r={12 * s} fill="none" stroke="#f2ead9" strokeWidth={6 * s} />
          <circle r={12 * s} fill="none" stroke={color} strokeWidth={2.6 * s}>
            <animate attributeName="r" values={`${12 * s};${19 * s};${12 * s}`} dur="1.4s" repeatCount="3" />
            <animate attributeName="stroke-opacity" values="1;0.2;1" dur="1.4s" repeatCount="3" />
          </circle>
          <rect x={-4.4 * s} y={-4.4 * s} width={8.8 * s} height={8.8 * s} fill={color} stroke="#f2ead9" strokeWidth={1.4 * s} />
          {marks.name && (
            <text x={here[0] > view.x + view.w - 130 * s ? -16 * s : 16 * s} y={-10 * s} textAnchor={here[0] > view.x + view.w - 130 * s ? "end" : "start"} fontSize={10 * s} {...label}>{marks.name}</text>
          )}
        </g>
      )}
    </g>
  );
}

/** The places before this report that have a place on the map, newest last, once each in a row. */
function mapTrail(campaignId, history, nodeId) {
  const places = MAP_PLACES[campaignId] || {};
  const trail = [];
  for (const h of history || []) {
    const p = places[h.position];
    const last = trail[trail.length - 1];
    if (h.position !== nodeId && p && !(last && last[0] === p[0] && last[1] === p[1])) trail.push(p);
  }
  return trail.slice(-4);
}

/** The orders of a report that can be given and have a drawing: { index, label, op }. */
function mapOrdersOf(campaignId, nodeId, choices) {
  const ops = (MAP_OPS[campaignId] || {})[nodeId];
  if (!ops) return [];
  return choices
    .map((c, index) => ({ index, label: c.label, op: c.disabledReason ? null : ops.find((o) => c.label.startsWith(o.match)) || null }))
    .filter((x) => x.op);
}

const mapOrderName = (label) => {
  const head = label.split(":")[0];
  return head.length <= 58 ? head : head.split(" ").slice(0, 8).join(" ") + "...";
};

/**
 * The map under the title of a report: a wide window framed on the report's place and the places before it, with the front on the day, and below it the orders of
 * this report that can be drawn on it, one at a time, and the last few orders given, faint. A button opens the whole theatre, with the notes on each region.
 */
function ReportMap({ campaign, stage, nodeId, flags, meters, history, log }) {
  const [whole, setWhole] = useState(false);
  const [focus, setFocus] = useState(null);
  const place = ((MAP_PLACES[campaign.id] || {})[nodeId]) || null;
  const here = place ? [place[0], place[1]] : null;
  const trail = mapTrail(campaign.id, history, nodeId);
  const orders = mapOrdersOf(campaign.id, nodeId, stage.choices || []);
  const focused = orders.find((x) => x.index === focus) || null;
  const past = [];
  const hist = history || [];
  const given = (log || []);
  for (let k = Math.max(0, hist.length - 3); k < hist.length - 1; k++) {
    const e = given[k];
    const ops = (MAP_OPS[campaign.id] || {})[hist[k].position] || [];
    const op = e && ops.find((o) => e.label.startsWith(o.match));
    if (op) for (const a of op.arrows) past.push({ ...a, past: true });
  }
  const arrows = [...past, ...(focused ? focused.op.arrows : [])];
  const offLabel = MAP_OFF_MAP_NAMES[campaign.id + "/" + nodeId] || (place && place[2]) || null;
  const framePoints = [here, ...trail.slice(-3), ...arrows.flatMap((a) => (a.kind === "hold" ? [a.at] : [a.from, a.to]))];
  const frame = whole ? null : pacificFrame(framePoints, 2);
  const mono = { fontFamily: "'IBM Plex Mono', monospace" };
  const button = (on) => `border-2 border-black px-2 py-1 text-[10px] uppercase tracking-widest font-bold hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f] ${on ? "bg-[#000000] text-[#ffffff]" : "text-[#000000]"}`;
  const marks = { here, trail, name: place ? place[2] : null, offLabel };
  return (
    <div className="mb-4" role="group" aria-label="The map on the day of this report">
      <PacificMap
        date={stage.date}
        year={yearFrom(stage.date, 1941)}
        flags={flags}
        meters={meters}
        accent={campaign.accent}
        nodeId={nodeId}
        report={{ marks, arrows, frame, passive: !whole }}
      />
      <div className="flex flex-wrap items-center gap-2 mt-2">
        {(frame || whole) && (
          <button onClick={() => setWhole(!whole)} aria-pressed={whole} className={button(whole)} style={mono}>
            {whole ? "Show this report's place" : "Show the whole theater"}
          </button>
        )}
      </div>
      {orders.length > 0 && (
        <div className="mt-2" role="group" aria-label="Orders drawn on the map">
          <div className="text-[10px] uppercase tracking-widest font-bold text-[#000000] mb-1" style={mono}>Show an order on the map</div>
          <div className="flex flex-wrap gap-2">
            {orders.map((o) => (
              <button key={o.index} onClick={() => setFocus(focus === o.index ? null : o.index)} aria-pressed={focus === o.index} className={button(focus === o.index)} style={mono}>
                {`Show order ${o.index + 1}`}
              </button>
            ))}
          </div>
          {focused && (
            <p className="text-[12px] leading-snug mt-2" style={{ fontFamily: "'Courier Prime', monospace" }}>
              <span className="font-bold">{mapOrderName(focused.label)}:</span> {focused.op.note}
            </p>
          )}
        </div>
      )}
      <p className="text-[11px] leading-snug mt-2 opacity-80" style={{ fontFamily: "'Courier Prime', monospace" }}>
        Front lines and arrows are drawn from the course of the fighting. They are not surveyed.
      </p>
    </div>
  );
}

// The reports set beyond the sheet, named for the arrow at its edge. A report whose place is on the sheet needs no entry.
const MAP_OFF_MAP_NAMES = {};
for (const [cid, places] of Object.entries(MAP_PLACES)) {
  for (const [id, p] of Object.entries(places)) {
    const [x, y] = pacificXY(p[0], p[1]);
    if (x < -30 || x > PAC_VBW + 30 || y < -30 || y > PAC_VBH + 30) MAP_OFF_MAP_NAMES[cid + "/" + id] = p[2];
  }
}


return { PacificMap, ReportMap, MAP_PLACES, MAP_OPS, MAP_FRONT_SERIES, MAP_REGIONS, MAP_TIMELINE, MAP_EDGES, MAP_YEAR_STATUS, MAP_OFF_MAP_NAMES, NODE_REGION_HINTS, nodeDayKey, baselineStatuses, mapOverrides, frontsOn, pacificXY, mapOrdersOf, PAC_VBW, PAC_VBH };
})();

