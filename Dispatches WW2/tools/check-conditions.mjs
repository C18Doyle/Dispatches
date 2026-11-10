#!/usr/bin/env node
// The conditions of a report (src/parts/38-conditions.jsx): the tables are whole and the figures are sourced.
//   - every command has an age of news by year (in order, in hours, none above 72), and every climate has twelve months of weather;
//   - every report with a place has a climate, or none by design (the Pacific, America, Asia), and every month of a report's date can be read;
//   - every bombardment names a report of its command and a source, and says "about" or "more than";
//   - the texts keep the house style (British spelling, no dashes, no quotation marks).
//   node tools/check-conditions.mjs        (run npm run extract-campaigns first)
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(ROOT, "package.json"));
const I18N_STUB = "const T = (s) => s; const t = (s, p) => String(s).replace(/\\{(\\w+)\\}/g, (m, k) => (p && p[k] != null ? p[k] : m));\n";
const CAMPAIGNS = require("./tools/campaigns_extracted.js");
const src = readFileSync(join(ROOT, "src/parts/38-conditions.jsx"), "utf8");
const front = readFileSync(join(ROOT, "src/parts/37-map-front.jsx"), "utf8");
const maps = readFileSync(join(ROOT, "src/parts/30-warroom-and-maps.jsx"), "utf8");
const data = src.slice(0, src.indexOf("/** The line about the guns on a report"));
const places = front.slice(front.indexOf("const MAP_PLACES = {"), front.indexOf("// ---- what the commands were doing on a date in the record ----"));
const C = new Function(`${I18N_STUB}${data}\n${places}\nreturn { COMMS, CLIMATES, climateOf, usualWeather, railReading, reportAge, BOMBARDMENTS, MAP_PLACES };`)();

const problems = [];
const words = (t) => t.trim().split(/\s+/).filter(Boolean).length;
const style = (at, t) => {
  if (/[—–"“”]/.test(t)) problems.push(`${at}: a dash or a quotation mark in "${t.slice(0, 50)}"`);
  if (/\b(color|armor|armored|defense|honor|labor|center|neighbor|harbor|kilometers|gray|theater|offense)\b/i.test(t)) problems.push(`${at}: American spelling in "${t.slice(0, 50)}"`);
};

for (const cid of Object.keys(CAMPAIGNS)) {
  const rows = C.COMMS[cid];
  if (!rows || !rows.length) { problems.push(`COMMS ${cid}: no row`); continue; }
  let last = 0;
  for (const [y, h] of rows) {
    if (y <= last) problems.push(`COMMS ${cid}: ${y} is not after ${last}`);
    if (!Number.isInteger(h) || h < 1 || h > 72) problems.push(`COMMS ${cid} ${y}: ${h} hours`);
    last = y;
  }
  for (const y of [1939, 1940, 1941, 1942, 1943, 1944, 1945]) {
    const a = C.reportAge(cid, y);
    if (!a.text) problems.push(`age ${cid} ${y}: no text`);
  }
}
for (const [name, months] of Object.entries(C.CLIMATES)) {
  if (months.length !== 12) problems.push(`climate ${name}: ${months.length} months`);
  for (const m of months) { if (!m) problems.push(`climate ${name}: an empty month`); style(`climate ${name}`, m); }
}
for (let f = -5; f <= 5; f++) if (!C.railReading(f)) problems.push(`rail reading at ${f}: empty`);

// every place has a climate, or is outside the tables on purpose
const outside = new Set();
let withClimate = 0;
for (const [cid, table] of Object.entries(C.MAP_PLACES)) {
  for (const [id, p] of Object.entries(table)) {
    const c = C.climateOf(p);
    if (c) withClimate++;
    else outside.add(`${cid}/${id}`);
    for (let m = 1; m <= 12 && c; m++) if (!C.usualWeather(p, m)) problems.push(`${cid}/${id}: no weather in month ${m}`);
  }
}
// a place outside the tables must really be outside Europe, Africa and the Near East (a typing slip would hide a place that should have weather)
for (const key of outside) {
  const [cid, id] = key.split("/");
  const [lon, lat] = C.MAP_PLACES[cid][id];
  if (lon > -12 && lon < 62 && lat > 24 && lat < 72) problems.push(`${key}: [${lon}, ${lat}] is inside the theatre but has no climate`);
}

for (const [key, b] of Object.entries(C.BOMBARDMENTS)) {
  const [cid, id] = key.split("/");
  const at = `bombardment ${key}`;
  let node = null;
  try { node = CAMPAIGNS[cid].resolveNode(id, {}, { manpower: 0, fuel: 0, initiative: 0 }); } catch (e) { /* none */ }
  if (!node || !node.choices) problems.push(`${at}: not a report of ${cid}`);
  if (!b.source || words(b.source) < 3) problems.push(`${at}: no source`);
  if (!/\b(about|more than|over)\b/i.test(b.text)) problems.push(`${at}: the figure is not marked about or more than`);
  style(at, b.text);
}

// how many date lines name no month or season: they get no weather line
let noMonth = 0;
let reports = 0;
for (const cid of Object.keys(CAMPAIGNS)) {
  const files = { german: "10-campaign-german.jsx", soviet: "11-campaign-soviet.jsx", allied: "12-campaign-allied.jsx", italy: "13-campaign-italy.jsx", japan: "14-campaign-japan.jsx", alliedPacific: "15-campaign-alliedpacific.jsx" };
  const text = readFileSync(join(ROOT, "src/parts", files[cid]), "utf8");
  const ids = [...new Set([...text.matchAll(/\bget (\w+)\(\) \{/g)].map((m) => m[1]))];
  for (const id of ids) {
    let node = null;
    try { node = CAMPAIGNS[cid].resolveNode(id, {}, { manpower: 0, fuel: 0, initiative: 0 }); } catch (e) { /* none */ }
    if (!node) continue;
    reports++;
    if (!/\b(JANUARY|FEBRUARY|MARCH|APRIL|MAY|JUNE|JULY|AUGUST|SEPTEMBER|OCTOBER|NOVEMBER|DECEMBER|SPRING|SUMMER|AUTUMN|FALL|WINTER)\b/i.test(node.date) && !/\b(LATE|MID|EARLY)\b/i.test(node.date)) noMonth++;
  }
}

if (problems.length) {
  console.error(`check-conditions: ${problems.length} problem(s)`);
  for (const p of problems.slice(0, 40)) console.error("  " + p);
  process.exit(1);
}
console.log(`check-conditions: ${Object.keys(C.COMMS).length} commands, ${Object.keys(C.CLIMATES).length} climates, ${withClimate} places with weather (${outside.size} outside the tables), ${Object.keys(C.BOMBARDMENTS).length} bombardments sourced; ${noMonth} of ${reports} date lines name no month or season (no weather line)`);
