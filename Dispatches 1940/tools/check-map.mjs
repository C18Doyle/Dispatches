#!/usr/bin/env node
// check-map.mjs
//
// The checkpoint map's baseline is a dated timeline (MAP_TIMELINE in src/App.jsx): each region's status, from the
// day it began. This audit keeps it honest:
//   1. every region on the map has a timeline, in date order, every status a real one, starting before the war;
//   2. on 31 December of each year 1939-1945 the timeline agrees with the year-end table (MAP_YEAR_STATUS) that the
//      Continental Situation panel still draws, except for the refinements listed below (a dated timeline is
//      allowed to be more exact than a snapshot, never to contradict it silently);
//   3. every node date in all four campaigns parses to a day;
//   4. on a walk of each campaign the map moves: the regions a campaign's decisions are about change status
//      between nodes (Norway in the German and Allied campaigns in particular).
//
// `--report` prints, per campaign, every status change between consecutive nodes on the historical path, to read
// against what you know of the war.
// Usage: node tools/check-map.mjs [--report]   (run `npm run extract-campaigns` first, or use `npm run audit`)
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(path.join(ROOT, "src/App.jsx"), "utf8");
const require = createRequire(import.meta.url);
const camps = (() => {
  const c = require(path.join(ROOT, "tools/campaigns_extracted.js"));
  return c.CAMPAIGNS || c;
})();

function extractBalanced(text, markerIndex, open, close) {
  let depth = 0;
  let inString = null;
  for (let j = text.indexOf(open, markerIndex); j < text.length; j++) {
    const ch = text[j];
    if (inString) {
      if (ch === "\\") j++;
      else if (ch === inString) inString = null;
      continue;
    }
    if (ch === "/" && text[j + 1] === "/") {
      const nl = text.indexOf("\n", j);
      j = nl < 0 ? text.length : nl;
      continue;
    }
    if (ch === "/" && text[j + 1] === "*") {
      const end = text.indexOf("*/", j + 2);
      j = end < 0 ? text.length : end + 1;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      inString = ch;
      continue;
    }
    if (ch === open) depth++;
    else if (ch === close && --depth === 0) return text.slice(markerIndex, j + 1);
  }
  throw new Error("unbalanced from " + markerIndex);
}
const fromMarker = (marker, open, close) => {
  const i = src.indexOf(marker);
  if (i < 0) throw new Error("not found: " + marker);
  return extractBalanced(src, i, open, close);
};
const fn = (name) => {
  const i = src.indexOf(`function ${name}(`);
  if (i < 0) throw new Error("function not found: " + name);
  const params = extractBalanced(src, i + `function ${name}`.length, "(", ")");
  const bodyStart = i + `function ${name}`.length + params.length;
  const body = extractBalanced(src, bodyStart, "{", "}");
  return src.slice(i, src.indexOf(body, bodyStart) + body.length);
};
const code = [
  fromMarker("const MAP_TIMELINE = {", "{", "}") + ";",
  fromMarker("const MAP_MONTH_NUMBERS = {", "{", "}") + ";",
  fromMarker("const MAP_SEASON_STARTS = {", "{", "}") + ";",
  fromMarker("const MAP_YEAR_STATUS = {", "{", "}") + ";",
  fromMarker("const STATUS_COLORS = {", "{", "}") + ";",
  fromMarker("const MAP_REGIONS = [", "[", "]") + ";",
  fn("nodeDayKey"),
  fn("baselineStatuses"),
  fn("mapOverrides"),
]
  .join("\n")
  .replace(/\bconst\b/g, "var");
const sb = {};
vm.createContext(sb);
vm.runInContext(code, sb);

const problems = [];
const key = (d) => Number(d.replace(/-/g, ""));

// 1. shape
for (const r of sb.MAP_REGIONS) {
  const t = sb.MAP_TIMELINE[r.id];
  if (!t || !t.length) {
    problems.push(`region ${r.id} has no timeline`);
    continue;
  }
  if (key(t[0][0]) > 19390901) problems.push(`${r.id}: timeline starts after the war began (${t[0][0]})`);
  for (let i = 0; i < t.length; i++) {
    if (!sb.STATUS_COLORS[t[i][1]]) problems.push(`${r.id}: unknown status "${t[i][1]}"`);
    if (i && key(t[i][0]) <= key(t[i - 1][0])) problems.push(`${r.id}: entries out of date order at ${t[i][0]}`);
  }
}
for (const id of Object.keys(sb.MAP_TIMELINE)) if (!sb.MAP_REGIONS.some((r) => r.id === id)) problems.push(`timeline for unknown region ${id}`);

// 2. year-end agreement. The refinements are the places where a dated timeline knows better than a snapshot.
const REFINED = new Set([
  "1939:poland", // the table has Poland "contested" at the end of 1939; the occupation was complete by 6 October
  "1940:egypt", // the Italian invasion of September 1940 was thrown back in December; the table keeps the whole year "contested"
  "1944:ussrNorth", "1944:ussrCenter", "1944:ussrSouth", // dated to the month each front was cleared
]);
let compared = 0;
for (let year = 1939; year <= 1945; year++) {
  const at = sb.baselineStatuses(year * 10000 + 1232);
  for (const r of sb.MAP_REGIONS) {
    compared++;
    const want = sb.MAP_YEAR_STATUS[year][r.id];
    if (at[r.id] !== want && !REFINED.has(`${year}:${r.id}`)) problems.push(`31 Dec ${year}: ${r.id} is "${at[r.id]}" in the timeline but "${want}" in the year-end table`);
  }
}

// 2b. decisions reach the map: the overrides, run on real dates, move the countries the decisions are about
const at = (flags, y, m, d) => {
  const day = y * 10000 + m * 100 + d;
  return { ...sb.baselineStatuses(day), ...sb.mapOverrides(y - 1, flags, {}, day).o };
};
const REACTS = [
  ["German Weserübung: limited landings leave Norway contested in 1941", { norway: "limited" }, [1941, 1, 1], "norway", "contested", "axis"],
  ["Allied Narvik: holding it keeps Norway contested in autumn 1940", { narvik40: "hold" }, [1940, 9, 1], "norway", "contested", "axis"],
  ["Case Anton declined: France stays Vichy in 1943", { vichy: "restrained" }, [1943, 3, 1], "france", "axisAllied", "axis"],
  ["Darlan refused: French North Africa still fighting in December 1942", { darlanDeal42: "refuse" }, [1942, 12, 1], "nwAfrica", "contested", "allied"],
  ["Turkey pressed: allied by autumn 1944", { turkishQuestion44: "press" }, [1944, 9, 1], "turkey", "allied", "neutral"],
  ["Early Dnieper: the south cleared by late 1943", { earlyDnieper43: true }, [1943, 12, 1], "ussrSouth", "soviet", "contested"],
];
for (const [what, flags, [y, m, d], region, want, normally] of REACTS) {
  if (at(flags, y, m, d)[region] !== want) problems.push(`${what}: ${region} reads "${at(flags, y, m, d)[region]}", wanted "${want}"`);
  if (at({}, y, m, d)[region] !== normally) problems.push(`${what}: with no decision made ${region} reads "${at({}, y, m, d)[region]}", expected "${normally}"`);
}
if (at({ norway: "limited" }, 1942, 6, 1).norway !== "axis") problems.push("limited landings: Norway should be occupied again by mid-1942");

// 3. every node date parses
const dates = new Map();
function nodesOf(c) {
  const out = [];
  const seen = new Set();
  const queue = [c.start];
  while (queue.length) {
    const id = queue.pop();
    if (!id || id === "END" || seen.has(id)) continue;
    seen.add(id);
    let node;
    try {
      node = c.resolveNode(id, {}, { manpower: 0, fuel: 0, initiative: 0 });
    } catch {
      continue;
    }
    if (!node) continue;
    out.push({ id, date: node.date, title: node.title });
    for (const ch of node.choices || []) {
      if (ch.next) queue.push(ch.next);
      for (const u of ch.uncertain || []) if (u.next) queue.push(u.next);
    }
  }
  return out;
}
for (const [cid, c] of Object.entries(camps)) {
  for (const n of nodesOf(c)) {
    if (sb.nodeDayKey(n.date) == null) problems.push(`${cid}/${n.id}: date "${n.date}" holds no year the map can use`);
    dates.set(`${cid}/${n.id}`, n.date);
  }
}

// 4. the map moves along a historical walk
function historicalWalk(c) {
  const out = [];
  let pos = c.start;
  let flags = {};
  let meters = { manpower: 0, fuel: 0, initiative: 0 };
  for (let step = 0; step < 80 && pos; step++) {
    let node;
    try {
      node = c.resolveNode(pos, flags, meters);
    } catch {
      break;
    }
    if (!node || !node.choices || !node.choices.length) break;
    out.push({ id: pos, date: node.date, title: node.title });
    const ch = node.choices.find((x) => x.historical) || node.choices[0];
    const v = ch.uncertain && ch.uncertain.length ? ch.uncertain[0] : null;
    flags = { ...flags, ...(ch.setFlags || {}), ...((v && v.setFlags) || {}) };
    const imp = (v && v.impact) || ch.impact || {};
    meters = { manpower: (meters.manpower || 0) + (imp.manpower || 0), fuel: (meters.fuel || 0) + (imp.fuel || 0), initiative: (meters.initiative || 0) + (imp.initiative || 0) };
    const nx = (v && v.next) || ch.next;
    pos = nx && nx !== "END" ? nx : null;
  }
  return out;
}
const report = process.argv.includes("--report");
for (const [cid, c] of Object.entries(camps)) {
  const walk = historicalWalk(c);
  const moved = new Set();
  let prev = null;
  let latest = 0;
  let outOfOrder = 0;
  if (report) console.log(`\n== ${cid}: ${walk.length} nodes on the historical path`);
  for (const n of walk) {
    const k = sb.nodeDayKey(n.date);
    if (k < latest) outOfOrder++;
    latest = Math.max(latest, k);
    const at = sb.baselineStatuses(latest);
    if (prev) {
      const changes = sb.MAP_REGIONS.filter((r) => at[r.id] !== prev[r.id]).map((r) => `${r.id}: ${prev[r.id]} -> ${at[r.id]}`);
      for (const r of sb.MAP_REGIONS) if (at[r.id] !== prev[r.id]) moved.add(r.id);
      if (report) console.log(`${String(n.date).padEnd(28)} ${String(n.id).padEnd(26)} ${changes.join("; ") || "-"}`);
    } else if (report) console.log(`${String(n.date).padEnd(28)} ${String(n.id).padEnd(26)} (start)`);
    prev = at;
  }
  if (cid === "german" || cid === "allied") if (!moved.has("norway")) problems.push(`${cid}: Norway never changes status along the historical path`);
  if (walk.length < 10) problems.push(`${cid}: the historical walk reached only ${walk.length} nodes`);
  if (moved.size < 8) problems.push(`${cid}: only ${moved.size} regions change along the historical path`);
  console.log(`${cid.padEnd(8)} nodes ${String(walk.length).padStart(3)}  regions that change status along the path: ${moved.size}  nodes filed out of date order: ${outOfOrder} (the map keeps the latest date seen)`);
}
console.log(`regions ${sb.MAP_REGIONS.length}, year-end comparisons ${compared}, node dates checked ${dates.size}`);
if (problems.length) {
  console.log("\n!! " + problems.join("\n!! "));
  process.exit(1);
}
console.log("\nThe map timeline looks sound.");
