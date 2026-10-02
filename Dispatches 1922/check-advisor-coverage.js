#!/usr/bin/env node
/**
 * check-advisor-coverage.js — Dispatches: Civil War advisor/dossier validator
 * =============================================================================
 *
 * WHY THIS EXISTS
 * ----------------
 * Two real bugs shipped in this file, both from the same underlying gap: a
 * choice's `advisor.name` field and the `ADVISOR_DOSSIERS` map are two
 * separate, unconnected pieces of data, and nothing checks that every
 * advisor who speaks in a node also has an entry in their campaign's
 * dossier collection.
 *
 *   1. Sakharov was given a speaking line in springOffensive19 (siberia)
 *      with no dossier at all. A player who opened his Command Dossier
 *      after hearing him argue for the central axis would find nobody
 *      there.
 *   2. Wrangel and Kutepov — White generals — were written as advisors on
 *      a Bolshevik campaign node (compressedEvacuation20), advising the
 *      Red player on how fast to load Wrangel's own evacuation ships. This
 *      is not a missing-dossier bug, it's a wrong-side bug, but the same
 *      check surfaces it: cross-reference every named advisor against
 *      their campaign's own dossier list, and an advisor from the wrong
 *      campaign shows up as "missing" because they were never meant to be
 *      in that campaign's list at all.
 *
 * Neither check-continuity.js, check-flag-values.js, nor walk-historical.js
 * can catch this class: the node is syntactically fine, every flag
 * resolves, and the historical spine may not even touch the affected node.
 *
 * WHAT THIS SCRIPT DOES
 * ----------------------
 * For each campaign: collects every distinct advisor.name used in any
 * choice across every atlas node, and checks it against the keys of that
 * campaign's ADVISOR_DOSSIERS map (case-insensitive, substring match on the
 * surname to tolerate "General Wrangel" vs "wrangel"). Reports any advisor
 * with no matching dossier entry, and which node(s) they speak at.
 *
 * Anonymous/generic roles (matching /unnamed|official|staff officer|
 * commissar/i) are excluded — those are deliberately not individuals and
 * don't need a dossier.
 *
 * LIMITATIONS
 * -----------
 * - Does not catch an advisor whose dossier exists but is factually wrong,
 *   only that one exists at all.
 * - Does not currently check `bio` figures who are mentioned in prose but
 *   never speak as an advisor — those can't structurally break anything
 *   the way a missing dossier for a speaking advisor can, so they're a
 *   lower-priority, editorial-judgment addition rather than a bug class.
 * - Substring matching on surnames could theoretically produce a false
 *   negative if two dossiers share a surname substring across campaigns —
 *   not currently the case, worth checking manually if it ever is.
 *
 * HOW TO RUN
 * ----------
 *   node check-advisor-coverage.js path/to/dispatches-1917.jsx
 *
 * WHEN TO RUN IT
 * --------------
 * After any round that adds or edits a choice's advisor, or edits any
 * ADVISOR_DOSSIERS map. Part of the standard sweep alongside
 * check-continuity.js, check-flag-values.js, and walk-historical.js.
 */

const fs = require("fs");
const path = require("path");

const filePath = process.argv[2];
if (!filePath) {
  console.error("Usage: node check-advisor-coverage.js path/to/dispatches-1917.jsx");
  process.exit(1);
}

let dataSrc = fs.readFileSync(filePath, "utf8").split("// PREVIEW SCREENS")[0];
dataSrc = dataSrc.replace(/^export /gm, "");
dataSrc += "\nmodule.exports = { CAMPAIGNS };\n";
const tmpPath = filePath + ".__advisor_check_tmp.js";
fs.writeFileSync(tmpPath, dataSrc);
const { CAMPAIGNS } = require(path.resolve(tmpPath));
fs.unlinkSync(tmpPath);

const ANONYMOUS_RE = /unnamed|official|staff officer|commissar/i;
let totalMissing = 0;

for (const [campaignId, camp] of Object.entries(CAMPAIGNS)) {
  const dossierKeys = Object.keys(camp.ADVISOR_DOSSIERS || {}).map((k) => k.toLowerCase());
  const named = new Map(); // advisor name -> [node ids]

  for (const entry of camp.NODE_ATLAS) {
    const node = camp.resolveNode(entry.id, {}, {});
    if (!node) continue;
    for (const choice of node.choices || []) {
      const name = choice.advisor && choice.advisor.name;
      if (!name) continue;
      if (!named.has(name)) named.set(name, []);
      named.get(name).push(entry.id);
    }
  }

  console.log(`\n=== ${campaignId} ===`);
  let campaignMissing = 0;
  for (const [name, nodes] of named) {
    if (ANONYMOUS_RE.test(name)) continue;
    const key = name.toLowerCase().replace(/[^a-z]/g, "");
    const hasDossier = dossierKeys.some((k) => key.includes(k) || k.includes(key));
    if (!hasDossier) {
      console.log(`  ✗ ${name} — no dossier, speaks at: ${nodes.join(", ")}`);
      campaignMissing++;
      totalMissing++;
    }
  }
  if (campaignMissing === 0) console.log("  clean — every speaking advisor has a dossier");
}

console.log(`\n${totalMissing} advisor(s) without a matching dossier across all campaigns.`);
console.log(
  "A missing dossier can mean two different things: an advisor nobody wrote a bio for yet, " +
  "or an advisor from the wrong campaign's roster entirely (check which before writing a fix)."
);
process.exit(totalMissing > 0 ? 1 : 0);
