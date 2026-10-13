#!/usr/bin/env node
// The special events (src/parts/35-events.jsx): every event has an id nobody else has, belongs to a campaign, is tied to reports that exist in that
// campaign, and is written to the house style (British spelling; here: no dashes, no quotation marks, a date in the dateline,
// two or three short paragraphs, a line saying what the record is). Every campaign has at least four, and no two are tied to the same report.
//   node tools/check-events.mjs        (run npm run extract-campaigns first)
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(ROOT, "package.json"));
const CAMPAIGNS = require("./tools/campaigns_extracted.js");
const src = readFileSync(join(ROOT, "src/parts/35-events.jsx"), "utf8");
const start = src.indexOf("const SPECIAL_EVENTS = ") + "const SPECIAL_EVENTS = ".length;
const end = src.indexOf("];\n\nfunction SpecialEventScreen");
const EVENTS = new Function("return " + src.slice(start, end + 1))();

const problems = [];
const ids = new Set();
const perCampaign = {};
const nodesUsed = new Map();
const words = (t) => t.trim().split(/\s+/).filter(Boolean).length;
for (const e of EVENTS) {
  const at = `event ${e.id}`;
  if (ids.has(e.id)) problems.push(`${at}: duplicate id`);
  ids.add(e.id);
  if (!/^[a-z0-9-]+$/.test(e.id)) problems.push(`${at}: the id is not lower-case words with hyphens`);
  const c = CAMPAIGNS[e.campaign];
  if (!c) { problems.push(`${at}: campaign "${e.campaign}" is not a campaign`); continue; }
  perCampaign[e.campaign] = (perCampaign[e.campaign] || 0) + 1;
  if (!Array.isArray(e.at) || !e.at.length) problems.push(`${at}: tied to no report`);
  for (const n of e.at || []) {
    let node = null;
    try { node = c.resolveNode(n, {}, { manpower: 0, fuel: 0, initiative: 0 }); } catch (err) { /* none */ }
    if (!node || !node.choices) problems.push(`${at}: "${n}" is not a report of ${e.campaign}`);
    const k = `${e.campaign}/${n}`;
    if (nodesUsed.has(k)) problems.push(`${at}: report ${n} also carries ${nodesUsed.get(k)}`);
    nodesUsed.set(k, e.id);
  }
  if (!/\b(1[89]\d\d|20\d\d)\b/.test(e.dateline || "")) problems.push(`${at}: the dateline names no year`);
  if (words(e.title || "") < 2 || words(e.title) > 9) problems.push(`${at}: the title is ${words(e.title || "")} words`);
  if (!Array.isArray(e.text) || e.text.length < 2 || e.text.length > 3) problems.push(`${at}: needs two or three paragraphs`);
  const total = (e.text || []).reduce((a, p) => a + words(p), 0);
  if (total < 45 || total > 170) problems.push(`${at}: ${total} words (45 to 170)`);
  if (!e.source || words(e.source) < 4) problems.push(`${at}: no line saying what the record is`);
  for (const t of [e.dateline, e.title, ...(e.text || []), e.source || ""]) {
    if (/[—–]/.test(t)) problems.push(`${at}: a dash in "${t.slice(0, 40)}"`);
    if (/["“”]/.test(t)) problems.push(`${at}: a quotation mark in "${t.slice(0, 40)}"`);
    if (/\b(color|armor|armored|defense|honor|labor|center|neighbor|harbor|kilometers|gray|theater)\b/i.test(t.replace(/Pearl Harbor/g, ""))) problems.push(`${at}: American spelling in "${t.slice(0, 40)}" (the new text is written in British English)`);
  }
}
for (const id of Object.keys(CAMPAIGNS)) if ((perCampaign[id] || 0) < 4) problems.push(`${id}: only ${perCampaign[id] || 0} events (at least four)`);
if (problems.length) {
  console.error("check-events: " + problems.length + " problem(s)");
  for (const p of problems) console.error("  " + p);
  process.exit(1);
}
console.log(`check-events: ${EVENTS.length} events across ${Object.keys(perCampaign).length} campaigns, all well formed`);
