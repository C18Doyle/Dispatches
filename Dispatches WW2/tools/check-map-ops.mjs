#!/usr/bin/env node
// The orders on the map (src/parts/36-map-ops.jsx). Every entry is a report of its campaign; every order it draws is matched by the start of its label
// to exactly one order of that report, and a report with some orders drawn has all of them drawn; every arrow starts and ends inside the map's frame, is
// long enough to be seen, and has a known kind; every order has a note of a sentence or two in the house style; and a fair share of the decisions have
// their orders drawn (at least eight reports in each campaign).
//   node tools/check-map-ops.mjs        (run npm run extract-campaigns first)
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(ROOT, "package.json"));
const CAMPAIGNS = require("./tools/campaigns_extracted.js");
const maps = readFileSync(join(ROOT, "src/parts/30-warroom-and-maps.jsx"), "utf8");
const src = readFileSync(join(ROOT, "src/parts/36-map-ops.jsx"), "utf8");
const MAP_OPS = new Function(src + "\nreturn MAP_OPS;")();

// the frame of each map, read from the game's own table
const BBOX = {};
for (const m of maps.matchAll(/^\s*(german|soviet|allied|italy): \{ llcrnrlat: (-?\d+), urcrnrlat: (-?\d+), llcrnrlon: (-?\d+), urcrnrlon: (-?\d+) \},/gm)) {
  BBOX[m[1]] = { llcrnrlat: +m[2], urcrnrlat: +m[3], llcrnrlon: +m[4], urcrnrlon: +m[5] };
}
const mercY = (lat) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
const project = (p, b) => [((p[0] - b.llcrnrlon) / (b.urcrnrlon - b.llcrnrlon)) * 800, (1 - (mercY(p[1]) - mercY(b.llcrnrlat)) / (mercY(b.urcrnrlat) - mercY(b.llcrnrlat))) * 600];
const KINDS = ["attack", "move", "withdraw", "hold"];
const words = (t) => t.trim().split(/\s+/).filter(Boolean).length;

const problems = [];
let checked = 0;
const perCampaign = {};
for (const cid of Object.keys(CAMPAIGNS)) {
  const bbox = BBOX[cid];
  if (!bbox) { problems.push(`${cid}: no map frame found in 30-warroom-and-maps.jsx`); continue; }
  for (const [nodeId, ops] of Object.entries(MAP_OPS[cid] || {})) {
    checked++;
    perCampaign[cid] = (perCampaign[cid] || 0) + 1;
    let node = null;
    try { node = CAMPAIGNS[cid].resolveNode(nodeId, {}, { manpower: 0, fuel: 0, initiative: 0 }); } catch (e) { /* none */ }
    if (!node || !node.choices) { problems.push(`${cid}/${nodeId}: not a report`); continue; }
    const labels = node.choices.map((c) => c.label);
    const hit = new Set();
    for (const op of ops) {
      const at = `${cid}/${nodeId} "${op.match}"`;
      const found = labels.map((l, i) => (l.startsWith(op.match) ? i : -1)).filter((i) => i >= 0);
      if (found.length !== 1) problems.push(`${at}: matches ${found.length} orders (needs exactly one)`);
      else if (hit.has(found[0])) problems.push(`${at}: the order is drawn twice`);
      else hit.add(found[0]);
      if (!op.note || words(op.note) < 8 || words(op.note) > 34) problems.push(`${at}: the note is ${words(op.note || "")} words (8 to 34)`);
      if (/[—–"“”]/.test(op.note || "")) problems.push(`${at}: a dash or a quotation mark in the note`);
      if (/\b(color|armor|armored|defense|honor|labor|center|neighbor|harbor|kilometers|gray|theater)\b/i.test(op.note || "")) problems.push(`${at}: American spelling in the note (the new text is written in British English)`);
      if (!Array.isArray(op.arrows) || !op.arrows.length) { problems.push(`${at}: nothing drawn`); continue; }
      for (const a of op.arrows) {
        checked++;
        if (!KINDS.includes(a.kind)) { problems.push(`${at}: kind "${a.kind}"`); continue; }
        const pts = a.kind === "hold" ? [a.at] : [a.from, a.to];
        for (const p of pts) {
          if (!Array.isArray(p) || p.length !== 2) { problems.push(`${at}: a point is not [longitude, latitude]`); continue; }
          if (p[0] < bbox.llcrnrlon + 0.3 || p[0] > bbox.urcrnrlon - 0.3 || p[1] < bbox.llcrnrlat + 0.3 || p[1] > bbox.urcrnrlat - 0.3) problems.push(`${at}: [${p}] is outside the frame of the ${cid} map`);
        }
        if (a.kind !== "hold" && pts.every(Array.isArray)) {
          const [x1, y1] = project(a.from, bbox), [x2, y2] = project(a.to, bbox);
          if (Math.hypot(x2 - x1, y2 - y1) < 8) problems.push(`${at}: an arrow only ${Math.hypot(x2 - x1, y2 - y1).toFixed(1)} px long cannot be seen`);
        }
      }
    }
    // a report with some orders drawn has all of them drawn
    labels.forEach((l, i) => { if (!hit.has(i)) problems.push(`${cid}/${nodeId}: the order "${l.slice(0, 40)}" is not drawn`); });
  }
  if ((perCampaign[cid] || 0) < 8) problems.push(`${cid}: only ${perCampaign[cid] || 0} reports have their orders drawn (at least eight)`);
}
for (const cid of Object.keys(MAP_OPS)) if (!CAMPAIGNS[cid]) problems.push(`${cid}: not a campaign`);
if (problems.length) {
  console.error("check-map-ops: " + problems.length + " problem(s)");
  for (const p of problems) console.error("  " + p);
  process.exit(1);
}
console.log(`check-map-ops: ${Object.values(perCampaign).reduce((a, v) => a + v, 0)} reports drawn (${Object.entries(perCampaign).map(([k, v]) => k + " " + v).join(", ")}), ${checked} entries checked`);
