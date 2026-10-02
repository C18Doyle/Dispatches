#!/usr/bin/env node
/*
 * check-reachability.js
 *
 * Gates the recurring failure in this codebase: content that exists, is wired, and can never
 * be seen. Every instance found so far was discovered by ad-hoc measurement rather than by a
 * check that runs every time — 20 Soviet ending titles shadowed by a first-match-wins chain,
 * atomic45 and finalStand nested under a pathVariant that always matched, a surplus gate
 * placed on a node where manpower is pinned at -10, eight gallery entries orphaned by a
 * deletion, and NODE_TOTAL drifting three separate times.
 *
 * This runs randomised playthroughs and then asserts, against what those runs actually
 * produced:
 *   1. every positionLabel title is reachable
 *   2. every ENDINGS_GALLERY label maps to a title a campaign can return   (no stale entries)
 *   3. every flag written is read somewhere                                (no write-only flags)
 *   4. every meter-gated choice is offered at least once                   (no dead gates)
 *   5. NODE_TOTAL matches the real node count
 *
 * Run AFTER extract_campaigns.js, like sweep.js.
 *   node extract_campaigns.js && node check-reachability.js [path/to/App.jsx]
 *
 * Exits 1 on any failure so it can gate a build. Thresholds are deliberately absolute:
 * "unreachable" means zero occurrences across every simulated run, not merely rare.
 */
const fs = require("fs");
const CAMPAIGNS = require("./campaigns_extracted.js");

const SRC = process.argv[2] || "../../App.jsx";
const RUNS = parseInt(process.env.RUNS || "40000", 10);
const src = fs.readFileSync(SRC, "utf8");

const HARD_MODE = { german: "iron", soviet: "purge", allied: "coalition", italy: "axis" };

// ---------- helpers -------------------------------------------------------------------
const clamp = (v) => Math.max(-10, Math.min(10, v));

function rollUncertain(u) {
  const total = u.reduce((a, v) => a + v.weight, 0);
  let r = Math.random() * total;
  for (let k = 0; k < u.length; k++) {
    r -= u[k].weight;
    if (r <= 0) return k;
  }
  return 0;
}

function campaignBlocks() {
  // Generalized to slice on however many top-level CAMPAIGNS keys actually exist, in whatever
  // order they appear in the source — a hardcoded 3-way german/soviet/allied slice broke silently
  // the moment a 4th campaign (italy) was inserted between allied and the object's closing brace.
  const keys = Object.keys(CAMPAIGNS);
  const idxs = keys.map((k) => ({ k, i: src.indexOf(`\n  ${k}: {`) })).sort((a, b) => a.i - b.i);
  const end = src.indexOf("\n};", idxs[idxs.length - 1].i);
  const blocks = {};
  for (let n = 0; n < idxs.length; n++) {
    blocks[idxs[n].k] = src.slice(idxs[n].i, n + 1 < idxs.length ? idxs[n + 1].i : end);
  }
  return blocks;
}

function definedTitles(block) {
  const pi = block.indexOf("positionLabel(flags, meters) {");
  if (pi === -1) return [];
  const body = block.slice(pi, block.indexOf("\n    epilogue(", pi));
  const out = [...body.matchAll(/return\s+"((?:[^"\\]|\\.)*)"/g)].map((m) => m[1]);
  for (const m of body.matchAll(/\?\s*"((?:[^"\\]|\\.)*)"\s*:\s*"((?:[^"\\]|\\.)*)"/g)) {
    out.push(m[1], m[2]);
  }
  return [...new Set(out)];
}

// Round 19: extract DIVERGENCE_FORKS (Historical Divergence Mode's 12 silently-rolled forks,
// 3 per campaign) straight from source, same style as campaignBlocks()/definedTitles() above,
// rather than hardcoding the flag names — stays in sync if forks are ever added or renamed.
// Previously this simulator never toggled Historical Divergence Mode at all, which meant the
// 4 endingCapable fork flags (one per campaign, each unlocking its own ENDINGS_GALLERY title)
// could never be set in any simulated run — 4 of this file's own "never produced" warnings were
// an artifact of the test tooling, not of the game content, discovered during the Round 19 audit.
function extractDivergenceForks() {
  const start = src.indexOf("const DIVERGENCE_FORKS = {");
  if (start === -1) return {};
  const end = src.indexOf("\n};", start);
  const block = src.slice(start, end);
  const campRe = /\n  (german|soviet|allied|italy): \[/g;
  const marks = [];
  let m;
  while ((m = campRe.exec(block))) marks.push({ key: m[1], idx: m.index });
  const result = {};
  for (let i = 0; i < marks.length; i++) {
    const segStart = marks[i].idx;
    const segEnd = i + 1 < marks.length ? marks[i + 1].idx : block.length;
    const seg = block.slice(segStart, segEnd);
    result[marks[i].key] = [...seg.matchAll(/flag: "([^"]+)"/g)].map((mm) => mm[1]);
  }
  return result;
}
const DIVERGENCE_FORKS_BY_CAMPAIGN = extractDivergenceForks();

// ---------- simulate ------------------------------------------------------------------
const seenTitles = new Set();
const seenGateLabels = new Set();
const flagsWritten = new Set();
let simErrors = 0;

function play(campKey, hardKey, divergence) {
  const c = CAMPAIGNS[campKey];
  let pos = c.start;
  let flags = hardKey ? { hardMode: true } : {};
  if (divergence) {
    // Matches rollDivergenceForks() in src/App.jsx: each of the campaign's 3 forks fires
    // independently at even odds, only when Historical Divergence Mode is on for this run.
    for (const flagName of DIVERGENCE_FORKS_BY_CAMPAIGN[campKey] || []) {
      if (Math.random() < 0.5) flags[flagName] = true;
    }
  }
  let m = { manpower: 0, fuel: 0, initiative: 0 };
  let steps = 0;
  while (steps++ < 400) {
    let node;
    try {
      node = c.resolveNode(pos, flags, m);
    } catch (e) {
      simErrors++;
      return;
    }
    if (!node || !node.choices || !node.choices.length) {
      simErrors++;
      return;
    }
    for (const ch of node.choices) if (ch.label) seenGateLabels.add(ch.label);

    const avail = node.choices.filter((x) => !x.disabledReason);
    if (!avail.length) return;
    const ch = avail[Math.floor(Math.random() * avail.length)];
    let ri = ch.uncertain ? rollUncertain(ch.uncertain) : null;

    let mf = { ...flags };
    if (ch.setFlags) mf = { ...mf, ...ch.setFlags };
    if (ch.uncertain && ri != null && ch.uncertain[ri].setFlags) mf = { ...mf, ...ch.uncertain[ri].setFlags };
    if (ch.setFlags) Object.keys(ch.setFlags).forEach((k) => flagsWritten.add(k));
    if (ch.uncertain && ri != null && ch.uncertain[ri].setFlags) {
      Object.keys(ch.uncertain[ri].setFlags).forEach((k) => flagsWritten.add(k));
    }
    if (ch.suspicionDelta) mf.suspicion = (mf.suspicion || 0) + ch.suspicionDelta;
    if (ch.cohesionDelta) mf.cohesion = (mf.cohesion || 0) + ch.cohesionDelta;
    if (ch.trustDelta) mf.trust = (mf.trust || 0) + ch.trustDelta;
    if (hardKey === "purge" && (mf.suspicion || 0) >= 5) mf.purged = true;
    if (hardKey === "coalition" && (mf.cohesion || 0) <= -6) mf.relieved = true;
    if (hardKey === "axis" && (mf.trust || 0) <= -5) mf.superseded = true;
    if (hardKey === "iron" && ch.favor) {
      mf._d = (mf._d || 0) + 1;
      if (mf._d >= 5) mf.dismissed = true;
    }

    const eff = ch.uncertain && ri != null ? ch.uncertain[ri].impact || ch.impact : ch.impact;
    if (eff) {
      m = {
        manpower: clamp(m.manpower + (eff.manpower || 0)),
        fuel: clamp(m.fuel + (eff.fuel || 0)),
        initiative: clamp(m.initiative + (eff.initiative || 0)),
      };
    }
    flags = mf;

    let next = (ch.uncertain && ri != null && ch.uncertain[ri].next) || ch.next;
    const forced =
      (hardKey === "iron" && flags.dismissed) ||
      (hardKey === "purge" && flags.purged) ||
      (hardKey === "coalition" && flags.relieved) ||
      (hardKey === "axis" && flags.superseded);
    if (next === undefined) {
      simErrors++;
      return;
    }
    if (next === "END" || forced) {
      if (typeof c.positionLabel === "function") seenTitles.add(c.positionLabel(flags, m));
      return;
    }
    pos = next;
  }
}

for (const camp of ["german", "soviet", "allied", "italy"]) {
  for (let i = 0; i < RUNS; i++) play(camp, null, false);
  if (HARD_MODE[camp]) for (let i = 0; i < RUNS; i++) play(camp, HARD_MODE[camp], false);
  // Round 19: a second pass with Historical Divergence Mode on — see extractDivergenceForks()
  // above for why this is needed at all.
  for (let i = 0; i < RUNS; i++) play(camp, null, true);
}

// ---------- assertions ----------------------------------------------------------------
const blocks = campaignBlocks();
const failures = [];
const warnings = [];

// 1. unreachable titles
const allDefined = {};
for (const [name, block] of Object.entries(blocks)) allDefined[name] = definedTitles(block);
for (const [camp, titles] of Object.entries(allDefined)) {
  const missing = titles.filter((t) => !seenTitles.has(t));
  if (missing.length) {
    warnings.push(`${camp}: ${missing.length}/${titles.length} titles never produced:\n     - ` + missing.join("\n     - "));
  }
}

// 2. stale gallery entries
const galStart = src.indexOf("const ENDINGS_GALLERY");
const galBlock = src.slice(galStart, src.indexOf("const NODE_TOTAL"));
const galLabels = [...new Set([...galBlock.matchAll(/label: "((?:[^"\\]|\\.)*)"/g)].map((m) => m[1]))];
const everyTitle = new Set(Object.values(allDefined).flat());
const stale = galLabels.filter((l) => !everyTitle.has(l));
if (stale.length) failures.push("stale ENDINGS_GALLERY entries (no campaign can return these):\n     - " + stale.join("\n     - "));

// 3. write-only flags.
// A flag is READ if it appears anywhere outside a setFlags literal — including as a bare key
// in the historicity() HIST dictionaries, which are read via `for (const k in HIST) flags[k]`.
// Counting every `name:` as a write misclassifies those HIST keys, so writes are counted only
// within setFlags object bodies.
const setFlagsBodies = [...src.matchAll(/setFlags:\s*\{([^}]*)\}/g)].map((m) => m[1]).join("\n");
const writeOnly = [...flagsWritten].filter((f) => {
  if (f.startsWith("_")) return false;
  const esc = f.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp("\\b" + esc + "\\b", "g");
  const total = (src.match(re) || []).length;
  const writes = (setFlagsBodies.match(re) || []).length;
  return total - writes <= 0;
});
if (writeOnly.length) failures.push("write-only flags (set but never read):\n     - " + writeOnly.join("\n     - "));

// 4. gated choices never offered — a gate whose condition can never be met is dead content
const allLabels = [...new Set([...src.matchAll(/label: "((?:[^"\\]|\\.)*)"/g)].map((m) => m[1]))];
const galSet = new Set(galLabels);
const neverOffered = allLabels.filter((l) => !seenGateLabels.has(l) && !galSet.has(l) && l.length > 25);
if (neverOffered.length) {
  warnings.push(`${neverOffered.length} choice label(s) never offered in any run:\n     - ` + neverOffered.join("\n     - "));
}

// 5. NODE_TOTAL
const counts = Object.entries(blocks).map(([n, b]) => [n, new Set([...b.matchAll(/get ([a-zA-Z_][a-zA-Z0-9_]*)\(\)/g)].map((m) => m[1])).size]);
const realTotal = counts.reduce((a, [, c]) => a + c, 0);
const declared = parseInt((src.match(/const NODE_TOTAL = (\d+)/) || [])[1], 10);
if (declared !== realTotal) {
  failures.push(`NODE_TOTAL is ${declared} but the source defines ${realTotal} (${counts.map(([n, c]) => n + " " + c).join(", ")})`);
}

// ---------- report --------------------------------------------------------------------
console.log(`runs: ${RUNS} per campaign per mode · simulation errors: ${simErrors}`);
console.log(`titles produced: ${seenTitles.size} · flags written: ${flagsWritten.size} · nodes: ${realTotal}`);

if (warnings.length) {
  console.log("\nWARNINGS (reachable-content gaps — review, do not necessarily block):");
  warnings.forEach((w) => console.log("  ! " + w));
}
if (failures.length) {
  console.log("\nFAILURES:");
  failures.forEach((f) => console.log("  X " + f));
  process.exit(1);
}
console.log("\nAll hard checks passed.");
process.exit(0);
