#!/usr/bin/env node
// The front, the places and the ground on the map (src/parts/37-map-front.jsx).
//   - every front line is a list of points inside the map's world, with no jump of more than seven degrees between two points (a typing slip), each theatre's
//     entries are in date order, and the regions it watches are regions of the map;
//   - every report of every campaign has a place, and no place belongs to a report that does not exist;
//   - the lines of "meanwhile" are in date order, each with a place and a sentence in the house style;
//   - every ground mark names a flag and values that some order of its campaign really sets, and has a sentence in the house style;
//   - a front is drawn on the day it begins for a run that follows the record (the baseline statuses), so nothing in the data is dead.
//   node tools/check-map-front.mjs        (run npm run extract-campaigns first)
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(ROOT, "package.json"));
const CAMPAIGNS = require("./tools/campaigns_extracted.js");
const maps = readFileSync(join(ROOT, "src/parts/30-warroom-and-maps.jsx"), "utf8");
const front = readFileSync(join(ROOT, "src/parts/37-map-front.jsx"), "utf8");

// the data of the part, and the few functions of the map file that read it
const vichy = maps.slice(maps.indexOf("const VICHY_LINE = ["), maps.indexOf("];", maps.indexOf("const VICHY_LINE = [")) + 2);
const timeline = maps.slice(maps.indexOf("const MAP_TIMELINE = {"), maps.indexOf("// `dayKey` (from nodeDayKey)"));
const data = front.slice(front.indexOf("const FRONT_WATCH_EAST ="), front.indexOf("const MAP_COMMAND_SHORT"));
const fns = front.slice(front.indexOf("const mapIsoKey"), front.indexOf("/** What the other commands were doing"));
const M = new Function(vichy + "\n" + timeline + "\n" + data + "\n" + fns + "\nreturn { VICHY_LINE, MAP_TIMELINE, FRONT_SERIES, MAP_PLACES, MAP_MEANWHILE, MAP_GROUND, frontsOn, baselineStatuses };")();

const problems = [];
const words = (t) => t.trim().split(/\s+/).filter(Boolean).length;
const isDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s));
const inWorld = (p) => Array.isArray(p) && p.length === 2 && p[0] >= -180 && p[0] <= 180 && p[1] >= -90 && p[1] <= 90;
const inTheatre = (p) => inWorld(p) && p[0] >= -15 && p[0] <= 65 && p[1] >= 25 && p[1] <= 72;
const style = (at, text, min, max) => {
  if (!text || words(text) < min || words(text) > max) problems.push(`${at}: the sentence is ${words(text || "")} words (${min} to ${max})`);
  if (!/[.]$/.test(text || "")) problems.push(`${at}: the sentence does not end with a full stop`);
  if (/[—–"“”]/.test(text || "")) problems.push(`${at}: a dash or a quotation mark`);
  if (/\b(color|armor|armored|defense|honor|labor|center|neighbor|harbor|kilometers|gray|theater|offense)\b/i.test(text || "")) problems.push(`${at}: American spelling (the new text is written in British English)`);
};

// ---- the regions of the map are the keys of the timeline ----
const regions = new Set(Object.keys(M.MAP_TIMELINE));

// ---- the fronts ----
const seen = new Set();
let lines = 0;
for (const th of M.FRONT_SERIES) {
  if (seen.has(th.id)) problems.push(`front ${th.id}: duplicate id`);
  seen.add(th.id);
  for (const r of th.watch || []) if (!regions.has(r)) problems.push(`front ${th.id}: watches "${r}", which is not a region`);
  let last = "";
  th.entries.forEach((e, i) => {
    const at = `front ${th.id} from ${e.from}`;
    if (!isDate(e.from)) problems.push(`${at}: not a date`);
    if (e.from <= last) problems.push(`${at}: not after the entry before it`);
    last = e.from;
    for (const r of e.watch || []) if (!regions.has(r)) problems.push(`${at}: watches "${r}", which is not a region`);
    if (e.lines === null) {
      if (i === 0) problems.push(`${at}: the first entry cannot end the theatre`);
      return;
    }
    if (!Array.isArray(e.lines) || !e.lines.length) { problems.push(`${at}: no lines`); return; }
    for (const ln of e.lines) {
      lines++;
      if (!Array.isArray(ln) || ln.length < 2) { problems.push(`${at}: a line of fewer than two points`); continue; }
      ln.forEach((p, k) => {
        if (!inTheatre(p)) problems.push(`${at}: [${p}] is not a longitude and latitude in the theatre`);
        else if (k && Math.max(Math.abs(p[0] - ln[k - 1][0]), Math.abs(p[1] - ln[k - 1][1])) > 7) problems.push(`${at}: a jump of more than seven degrees to [${p}]`);
      });
    }
  });
}
// a run that follows the record sees every front on the day after it begins, and none after the theatre has ended
let drawn = 0;
for (const th of M.FRONT_SERIES) {
  for (const e of th.entries) {
    if (!e.lines) continue;
    const day = Number(e.from.replace(/-/g, "")) + 1;
    const here = M.frontsOn(day, M.baselineStatuses(day)).find((f) => f.id === th.id);
    if (!here) problems.push(`front ${th.id} from ${e.from}: not drawn for a run that follows the record`);
    else if (here.projection) problems.push(`front ${th.id} from ${e.from}: drawn as a projection for a run that follows the record`);
    else drawn++;
  }
}

// ---- the reports of each campaign (the node getters of its file) ----
const FILES = { german: "10-campaign-german.jsx", soviet: "11-campaign-soviet.jsx", allied: "12-campaign-allied.jsx", italy: "13-campaign-italy.jsx" };
const ids = {};
for (const [cid, f] of Object.entries(FILES)) {
  const src = readFileSync(join(ROOT, "src/parts", f), "utf8");
  ids[cid] = [...new Set([...src.matchAll(/\bget (\w+)\(\) \{/g)].map((m) => m[1]))];
}
let placed = 0;
for (const cid of Object.keys(FILES)) {
  const table = M.MAP_PLACES[cid] || {};
  for (const id of ids[cid]) if (!table[id]) problems.push(`place ${cid}/${id}: the report has no place`);
  for (const [id, p] of Object.entries(table)) {
    placed++;
    if (!ids[cid].includes(id)) problems.push(`place ${cid}/${id}: not a report of ${cid}`);
    if (!inWorld(p)) problems.push(`place ${cid}/${id}: [${p}] is not a longitude and latitude`);
  }
}

// ---- meanwhile ----
let meanwhile = 0;
for (const cid of Object.keys(FILES)) {
  const rows = M.MAP_MEANWHILE[cid] || [];
  if (rows.length < 10) problems.push(`meanwhile ${cid}: only ${rows.length} entries (at least ten)`);
  let last = "";
  for (const e of rows) {
    meanwhile++;
    const at = `meanwhile ${cid} ${e.on}`;
    if (!isDate(e.on)) problems.push(`${at}: not a date`);
    if (e.on <= last) problems.push(`${at}: not after the entry before it`);
    last = e.on;
    if (!inWorld(e.at)) problems.push(`${at}: [${e.at}] is not a longitude and latitude`);
    style(at, e.text, 2, 20);
  }
}

// ---- the flags that the orders of each campaign set ----
const flagValues = {};
for (const cid of Object.keys(FILES)) {
  flagValues[cid] = {};
  for (const id of ids[cid]) {
    let node = null;
    try { node = CAMPAIGNS[cid].resolveNode(id, {}, { manpower: 0, fuel: 0, initiative: 0 }); } catch (e) { /* none */ }
    for (const c of (node && node.choices) || []) {
      for (const [k, v] of Object.entries(c.setFlags || {})) (flagValues[cid][k] = flagValues[cid][k] || new Set()).add(v);
      for (const o of c.outcomeVariants || []) for (const [k, v] of Object.entries(o.setFlags || {})) (flagValues[cid][k] = flagValues[cid][k] || new Set()).add(v);
    }
  }
}
const groundIds = new Set();
const perCampaign = {};
for (const g of M.MAP_GROUND) {
  const at = `ground ${g.id}`;
  if (groundIds.has(g.id)) problems.push(`${at}: duplicate id`);
  groundIds.add(g.id);
  perCampaign[g.campaign] = (perCampaign[g.campaign] || 0) + 1;
  if (!FILES[g.campaign]) { problems.push(`${at}: campaign "${g.campaign}" is not a campaign`); continue; }
  if (!["gained", "lost"].includes(g.kind)) problems.push(`${at}: kind "${g.kind}"`);
  if (!inWorld(g.at)) problems.push(`${at}: [${g.at}] is not a longitude and latitude`);
  if (!g.name) problems.push(`${at}: no name`);
  const set = flagValues[g.campaign][g.flag];
  if (!set) problems.push(`${at}: no order of ${g.campaign} sets the flag "${g.flag}"`);
  else for (const v of g.values) if (!set.has(v)) problems.push(`${at}: no order sets "${g.flag}" to ${JSON.stringify(v)}`);
  style(at, g.text, 8, 24);
}
for (const cid of Object.keys(FILES)) if ((perCampaign[cid] || 0) < 4) problems.push(`ground ${cid}: only ${perCampaign[cid] || 0} marks (at least four)`);

if (problems.length) {
  console.error(`check-map-front: ${problems.length} problem(s)`);
  for (const p of problems.slice(0, 60)) console.error("  " + p);
  if (problems.length > 60) console.error(`  ... and ${problems.length - 60} more`);
  process.exit(1);
}
console.log(`check-map-front: ${M.FRONT_SERIES.length} theatres, ${lines} lines (${drawn} fronts drawn for the record), ${placed} places, ${meanwhile} meanwhile entries, ${M.MAP_GROUND.length} ground marks: ok`);
