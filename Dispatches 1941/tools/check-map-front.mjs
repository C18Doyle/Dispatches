#!/usr/bin/env node
// The report map (src/parts/37-map-front.jsx). Every place belongs to a report of its command and sits on the globe; a report beyond the sheet is named for its arrow;
// every drawn order matches one order of its report, once, and its arrows sit on the sheet; every note keeps to the style of the game; every front is dated, in order,
// watches regions that exist, has lines of at least two points on the sheet, and ends; the fronts can be worked out for the date of every report; and the claims
// register carries each front and the places and orders.
//   npm run check-map-front
import { readFileSync } from "node:fs";
import { loadGame } from "./audit-lib.mjs";

const game = await loadGame();
const { CAMPAIGNS, NODE_ATLAS, MAP_REGIONS, MAP_FRONT_SERIES, MAP_PLACES, MAP_OPS, MAP_OFF_MAP_NAMES, pacificXY, frontsOn, baselineStatuses, nodeDayKey, mapOrdersOf, PAC_VBW, PAC_VBH, logic } = game;
const claims = JSON.parse(readFileSync(new URL("../claims/map-front.json", import.meta.url), "utf8"));
const problems = [];
const ok = (c, m) => {
  if (!c) problems.push(m);
};
const wc = (s) => String(s || "").trim().split(/\s+/).filter(Boolean).length;
const onSheet = ([lo, la]) => {
  const [x, y] = pacificXY(lo, la);
  return x >= 0 && x <= PAC_VBW && y >= 0 && y <= PAC_VBH;
};
const sane = (p) => Array.isArray(p) && p.length >= 2 && Number.isFinite(p[0]) && Number.isFinite(p[1]) && p[0] >= -180 && p[0] <= 360 && p[1] >= -90 && p[1] <= 90;
let checked = 0;
let placed = 0;
let drawn = 0;
let arrowsN = 0;

for (const cid of Object.keys(CAMPAIGNS)) {
  const ids = new Set((NODE_ATLAS[cid] || []).map((e) => e.id));
  const places = MAP_PLACES[cid] || {};
  for (const [id, p] of Object.entries(places)) {
    checked++;
    placed++;
    ok(ids.has(id), `${cid}/${id}: a place for a report that does not exist`);
    ok(sane(p) && typeof p[2] === "string" && p[2].length >= 3, `${cid}/${id}: the place needs [longitude, latitude, name]`);
  }
  const noPlace = [...ids].filter((id) => !places[id]);
  console.log(`${cid}: ${placed} of ${ids.size} reports have a place${noPlace.length ? "; none for " + noPlace.length : ""}`);
  placed = 0;
  for (const [id, ops] of Object.entries((MAP_OPS || {})[cid] || {})) {
    ok(ids.has(id), `${cid}/${id}: orders drawn for a report that does not exist`);
    ok(places[id], `${cid}/${id}: orders are drawn for a report with no place`);
    let node = null;
    try {
      node = CAMPAIGNS[cid].resolveNode(id, logic.startFlags("open"), { readiness: 3, pipeline: 3, initiative: 3 });
    } catch (e) {
      /* none */
    }
    if (!node) {
      problems.push(`${cid}/${id}: no such report`);
      continue;
    }
    const hits = new Set();
    for (const o of ops) {
      checked++;
      drawn++;
      const where = `${cid}/${id}/${o.match}`;
      const matching = node.choices.map((c, i) => (c.label.startsWith(o.match) ? i : -1)).filter((i) => i >= 0);
      ok(matching.length === 1, `${where}: matches ${matching.length} orders (needs exactly one)`);
      for (const i of matching) {
        ok(!hits.has(i), `${where}: two drawings for order ${i + 1}`);
        hits.add(i);
      }
      ok(wc(o.note) >= 8 && wc(o.note) <= 40, `${where}: the note should be 8 to 40 words`);
      ok(!/[—]/.test(o.note) && !/["“”]/.test(o.note), `${where}: an em dash or a quotation mark in the note`);
      ok(Array.isArray(o.arrows) && o.arrows.length > 0, `${where}: no arrows`);
      for (const a of o.arrows || []) {
        arrowsN++;
        ok(["attack", "move", "withdraw", "hold"].includes(a.kind), `${where}: unknown arrow kind ${a.kind}`);
        const pts = a.kind === "hold" ? [a.at] : [a.from, a.to];
        for (const p of pts) ok(sane(p) && onSheet(p), `${where}: a point is off the sheet or not a position`);
        if (a.kind !== "hold") ok(a.from && a.to && (a.from[0] !== a.to[0] || a.from[1] !== a.to[1]), `${where}: an arrow that goes nowhere`);
      }
    }
    ok(ops.length >= 1 && ops.length === hits.size, `${cid}/${id}: the drawings do not map one to one onto orders`);
    ok(mapOrdersOf(cid, id, node.choices).length === ops.length, `${cid}/${id}: the app finds a different number of drawn orders than the data has`);
  }
}

// the names of the reports beyond the sheet
checked++;
for (const [key, name] of Object.entries(MAP_OFF_MAP_NAMES)) {
  const [cid, id] = key.split("/");
  const p = (MAP_PLACES[cid] || {})[id];
  ok(p && !onSheet(p) && p[2] === name, `${key}: the off-map name does not match its place`);
}

// the fronts
const regions = new Set(MAP_REGIONS.map((r) => r.id));
const seenTheatre = new Set();
for (const t of MAP_FRONT_SERIES) {
  checked++;
  ok(!seenTheatre.has(t.id), `front ${t.id}: duplicate id`);
  seenTheatre.add(t.id);
  ok(t.watch && t.watch.length > 0 && t.watch.every((r) => regions.has(r)), `front ${t.id}: watches a region that does not exist`);
  ok(t.entries.length >= 3, `front ${t.id}: too few entries`);
  ok(t.entries[t.entries.length - 1].lines === null, `front ${t.id}: the last entry must end the theatre (lines: null)`);
  let prev = 0;
  for (const e of t.entries) {
    const key = Number(String(e.from).replace(/-/g, ""));
    ok(/^\d{4}-\d{2}-\d{2}$/.test(e.from) && key > prev, `front ${t.id}/${e.from}: dates must be ISO and in order`);
    prev = key;
    for (const w of e.watch || []) ok(regions.has(w), `front ${t.id}/${e.from}: watches an unknown region ${w}`);
    for (const line of e.lines || []) {
      ok(Array.isArray(line) && line.length >= 2, `front ${t.id}/${e.from}: a line needs at least two points`);
      for (const p of line) ok(sane(p) && onSheet(p), `front ${t.id}/${e.from}: a point is off the sheet`);
    }
  }
  ok(claims.some((c) => c.id === `front-${t.id}`), `front ${t.id}: no claim front-${t.id} in claims/map-front.json`);
}
ok(claims.some((c) => c.id === "places-and-orders"), "no claim places-and-orders in claims/map-front.json");
for (const c of claims) ok(c.id && c.where && c.claim && c.status && c.source, `claim ${c.id}: incomplete`);

// the fronts can be worked out for the date of every report, on the record's own statuses
checked++;
for (const cid of Object.keys(CAMPAIGNS)) {
  for (const e of NODE_ATLAS[cid] || []) {
    const day = nodeDayKey(e.date);
    if (day == null) continue;
    try {
      const fronts = frontsOn(day, baselineStatuses(day));
      for (const f of fronts) ok(!f.projection, `${cid}/${e.id}: the record's own statuses draw a projection of the front ${f.id}`);
    } catch (err) {
      problems.push(`${cid}/${e.id}: the fronts cannot be worked out: ${err.message}`);
    }
  }
}

console.log(`report map: ${drawn} orders drawn with ${arrowsN} arrows, ${MAP_FRONT_SERIES.length} fronts, ${checked} checks; ${problems.length} problem(s)`);
for (const p of problems) console.log("  " + p);
process.exit(problems.length ? 1 : 0);
