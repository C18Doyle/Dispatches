#!/usr/bin/env node
/*
 * check-endings.js
 *
 * Two things about the endings that no other check looks at.
 *
 * 1. How lopsided they are. check-reachability.js proves every ending title can be reached; it says nothing about how
 *    often. The Italian co-belligerent path used to end on one title in 97 runs in 100 (its meters sat on the floor from
 *    the middle of the war), so the other endings were reachable and never seen. This prints, for random play and for
 *    play that always takes the historical choice, the share of runs each ending takes, per campaign (Italy by path),
 *    with the tier it is worth. Random play is held to a limit: no single ending may take more than 85% of a group's
 *    runs (a failure) and a warning is printed above 60%. Historical play is only printed, because following history
 *    is allowed to lead to one ending.
 *
 * 2. Whether the command rank's ceilings are honest. The rank scores the ending against the best tier its path can
 *    award (ENDING_CEILING in src/logic.ts), so a command whose war could not be won can still earn a General.
 *    The table is checked against what the simulated runs actually reach: an ending that outranks its path's ceiling
 *    is a failure (the table is stale); a ceiling no simulated run reaches is a warning.
 *
 * Usage: npm run check-endings   (runs extract-campaigns first)   RUNS=20000 by default, per campaign and policy.
 * Exits 1 on a failure.
 */
const fs = require("fs");
const path = require("path");
const os = require("os");
const { buildSync } = require("esbuild");

const ROOT = path.join(__dirname, "..");
const SRC = process.argv[2] || path.join(ROOT, "src/App.jsx");
const CAMPAIGNS = require("./campaigns_extracted.js");
const RUNS = parseInt(process.env.RUNS || "20000", 10);

// logic.ts, compiled on the spot: the ceiling table and key function are the ones the game ships.
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "endings-"));
buildSync({ entryPoints: [path.join(ROOT, "src/logic.ts")], bundle: true, platform: "node", format: "cjs", outfile: path.join(tmp, "logic.cjs"), logLevel: "error" });
const L = require(path.join(tmp, "logic.cjs"));

// Ending tiers, from ENDINGS_GALLERY.
const src = fs.readFileSync(SRC, "utf8");
const galStart = src.indexOf("const ENDINGS_GALLERY");
const galBlock = src.slice(galStart, src.indexOf("const NODE_TOTAL", galStart));
const TIER = {};
for (const m of galBlock.matchAll(/label: "((?:[^"\\]|\\.)*)"[^\n]*?tier: "([^"]+)"/g)) TIER[m[1]] = m[2];
const POINTS = { "Major Victory": 30, "Minor Victory": 24, "Contested Outcome": 15, "Minor Defeat": 8, "Major Defeat": 2 };

const clamp = (v) => Math.max(-10, Math.min(10, v));
function roll(u) {
  const total = u.reduce((a, v) => a + v.weight, 0);
  let r = Math.random() * total;
  for (let k = 0; k < u.length; k++) {
    r -= u[k].weight;
    if (r <= 0) return k;
  }
  return 0;
}
function play(c, policy) {
  let pos = c.start;
  let flags = {};
  let m = { manpower: 0, fuel: 0, initiative: 0 };
  for (let steps = 0; steps < 400; steps++) {
    let node;
    try {
      node = c.resolveNode(pos, flags, m);
    } catch (e) {
      return null;
    }
    if (!node || !node.choices) return null;
    const avail = node.choices.filter((x) => !x.disabledReason);
    if (!avail.length) return null;
    let ch;
    if (policy === "historical") ch = avail.find((x) => x.historical) || avail[Math.floor(Math.random() * avail.length)];
    else ch = avail[Math.floor(Math.random() * avail.length)];
    const ri = ch.uncertain ? roll(ch.uncertain) : null;
    const mf = { ...flags, ...(ch.setFlags || {}), ...((ch.uncertain && ch.uncertain[ri].setFlags) || {}) };
    if (ch.suspicionDelta) mf.suspicion = (mf.suspicion || 0) + ch.suspicionDelta;
    const eff = ch.uncertain && ri != null ? ch.uncertain[ri].impact || ch.impact : ch.impact;
    if (eff) m = { manpower: clamp(m.manpower + (eff.manpower || 0)), fuel: clamp(m.fuel + (eff.fuel || 0)), initiative: clamp(m.initiative + (eff.initiative || 0)) };
    flags = mf;
    const next = (ch.uncertain && ri != null && ch.uncertain[ri].next) || ch.next;
    if (next === "END" || next === undefined) return { flags, title: c.positionLabel(flags, m) };
    pos = next;
  }
  return null;
}

const failures = [];
const warnings = [];
const produced = {}; // ceiling key -> best tier points seen, over both policies
const bestTitles = {}; // ceiling key -> the titles that reached it

for (const cid of ["german", "soviet", "allied", "italy"]) {
  const c = CAMPAIGNS[cid];
  for (const policy of ["random", "historical"]) {
    const groups = {};
    let n = 0;
    for (let i = 0; i < RUNS; i++) {
      const r = play(c, policy);
      if (!r || r.flags.purged) continue;
      n++;
      const key = L.endingCeilingKey(cid, r.flags);
      const g = (groups[key] ||= { n: 0, titles: {} });
      g.n++;
      g.titles[r.title] = (g.titles[r.title] || 0) + 1;
      const pts = POINTS[TIER[r.title]] ?? 0;
      if (pts > (produced[key] ?? -1)) { produced[key] = pts; bestTitles[key] = new Set(); }
      if (pts === produced[key]) bestTitles[key].add(r.title);
    }
    for (const [key, g] of Object.entries(groups)) {
      if (g.n < 50) continue;
      const rows = Object.entries(g.titles).sort((a, b) => b[1] - a[1]);
      const top = rows[0];
      const share = top[1] / g.n;
      console.log(`\n${key} · ${policy} play · ${g.n} runs (${Math.round((100 * g.n) / n)}% of the campaign's)`);
      for (const [t, k] of rows.slice(0, 5)) console.log(`   ${((100 * k) / g.n).toFixed(1).padStart(5)}%  ${(TIER[t] || "no tier").padEnd(18)} ${t}`);
      if (policy === "random") {
        if (share > 0.85) failures.push(`${key}: "${top[0]}" takes ${(100 * share).toFixed(0)}% of random-play runs (limit 85%)`);
        else if (share > 0.6) warnings.push(`${key}: "${top[0]}" takes ${(100 * share).toFixed(0)}% of random-play runs (above 60%)`);
      }
    }
  }
}

console.log("\nrank ceilings (the best tier a path can award), against what the simulated runs reached:");
for (const [key, tier] of Object.entries(L.ENDING_CEILING)) {
  const best = produced[key];
  const tag = best === undefined ? "no runs" : best > POINTS[tier] ? "OUTRANKS THE CEILING" : best < POINTS[tier] ? "ceiling not reached" : "ok";
  console.log(`   ${key.padEnd(20)} ceiling ${tier.padEnd(18)} best reached ${best === undefined ? "-" : Object.keys(POINTS).find((k) => POINTS[k] === best) || best}  ${tag}${best !== undefined && best !== POINTS[tier] ? "  (" + [...bestTitles[key]].slice(0, 3).join("; ") + ")" : ""}`);
  if (best !== undefined && best > POINTS[tier]) failures.push(`${key}: an ending of ${Object.keys(POINTS).find((k) => POINTS[k] === best)} was reached but the ceiling in ENDING_CEILING is ${tier}`);
  else if (best !== undefined && best < POINTS[tier]) warnings.push(`${key}: no simulated run reached the ceiling (${tier}); fine if that ending is rare, stale if it no longer exists`);
}
for (const key of Object.keys(produced)) if (!(key in L.ENDING_CEILING)) failures.push(`${key}: a path with no entry in ENDING_CEILING`);

if (warnings.length) {
  console.log("\nWARNINGS:");
  warnings.forEach((w) => console.log("  ! " + w));
}
if (failures.length) {
  console.log("\nFAILURES:");
  failures.forEach((f) => console.log("  X " + f));
  process.exit(1);
}
console.log("\nEnding distribution and rank ceilings look sound.");
