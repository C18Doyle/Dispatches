#!/usr/bin/env node
/**
 * check-bulletins.js — Dispatches 1922 newspaper-bulletin validator
 * ==================================================================
 *
 * WHY THIS EXISTS
 * ---------------
 * Bulletins are interstitials that fire on ARRIVAL at a node — i.e. BEFORE
 * the player makes that node's decision. Three real bugs came from forgetting
 * that:
 *
 *   1. wrangelsDismissal20's bulletin said the command "settles its own
 *      dispute with a critical general" — the dispute this node exists to
 *      let the player decide. It announced the outcome on the way in.
 *   2. sevastopolCouncil20's said "the same week this command's own
 *      succession is settled" — again, the very thing the node decides.
 *   3. chelyabinskGrinder19's described "a rail junction whose loss opens a
 *      year-long retreat", telling the player they had lost a battle they
 *      were about to be asked whether to fight.
 *
 * None of these are catchable by tsc, by the flag validators, or by the
 * historical walker. The node resolves, the text renders, every field is
 * well-formed — it just tells the player the future.
 *
 * WHAT THIS CHECKS
 * ----------------
 * A. STRUCTURE: every bulletin has headline + body, and its `meanwhile`
 *    keys match EXACTLY the other two campaigns' ids. A meanwhile keyed to
 *    the campaign it appears in, or to a typo'd id, renders nothing at all
 *    and fails silently.
 * B. CHRONOLOGY: no bulletin node is reachable from a node with a LATER
 *    date. A bulletin describing "this month" is wrong if the player got
 *    there from six months in the future.
 * C. PRESUPPOSITION: scans bulletin text for phrasing that asserts the
 *    outcome of a decision not yet taken. Heuristic and deliberately
 *    conservative — it cannot read meaning, only catch the specific
 *    constructions that have already caused bugs here.
 *
 * NOTE ON CONDITIONAL BULLETINS
 * -----------------------------
 * Bulletins live on the object returned by resolveNode, which already
 * receives `flags` — so a bulletin CAN be made conditional on prior
 * decisions with no engine change, exactly like `situation` and `context`.
 * sevastopolCouncil20's bulletin does this: it reports Wrangel's February
 * status differently depending on what the player actually decided then.
 * Prefer that over neutral phrasing when the fact is genuinely knowable.
 *
 * HOW TO RUN
 *   node check-bulletins.js path/to/dispatches-1917.jsx
 */

const fs = require("fs");
const path = require("path");

const filePath = process.argv[2];
if (!filePath) {
  console.error("Usage: node check-bulletins.js path/to/dispatches-1917.jsx");
  process.exit(1);
}

let dataSrc = fs.readFileSync(filePath, "utf8").split("// PREVIEW SCREENS")[0];
dataSrc = dataSrc.replace(/^export /gm, "");
dataSrc += "\nmodule.exports = { CAMPAIGNS };\n";
const tmpPath = filePath + ".__bulletincheck_tmp.js";
fs.writeFileSync(tmpPath, dataSrc);
const { CAMPAIGNS } = require(path.resolve(tmpPath));
fs.unlinkSync(tmpPath);

const MONTHS = {
  JANUARY: 1, FEBRUARY: 2, MARCH: 3, APRIL: 4, MAY: 5, JUNE: 6,
  JULY: 7, AUGUST: 8, SEPTEMBER: 9, OCTOBER: 10, NOVEMBER: 11, DECEMBER: 12,
};
function toYYYYMM(dateStr) {
  if (!dateStr) return null;
  const up = dateStr.toUpperCase();
  const year = (up.match(/\b(19\d{2})\b/) || [])[1];
  if (!year) return null;
  let month = 1;
  for (const [name, num] of Object.entries(MONTHS)) {
    if (up.includes(name)) { month = num; break; }
  }
  return parseInt(year, 10) * 100 + month;
}

// Constructions that have actually caused bugs in this file.
const PRESUPPOSES = /\b(whose loss|is settled|settles its own|having (chosen|decided)|after (choosing|deciding)|now that (this|the) command)\b/i;

let problems = 0;
let totalBulletins = 0;

// Campaigns whose entire playable timeline is already over before another
// campaign's own earliest node happens don't need a fresh "meanwhile" line
// in every one of that later campaign's bulletins forever — that isn't the
// live scene-setting this device exists for, it's the same "already fallen"
// sentence restated dozens of times with no new information in it. Rule A
// otherwise treats "the other N-1 campaign ids" as fixed regardless of
// when either campaign's own nodes are actually set, which was fine when
// every campaign in the file overlapped in time (1918-1922) and stopped
// being fine the moment one campaign (provisionalGov17, April-October
// 1917) doesn't. Documented exception, not a loosened rule: this still
// requires provisionalGov17 to reference the other three from ITS OWN
// side (correctly — they don't exist yet, which is itself worth saying
// once per bulletin), and requires every other still-live pairing exactly
// as before.
const CONCLUDED_BEFORE_OTHERS = { provisionalGov17: true };

for (const [campaignId, camp] of Object.entries(CAMPAIGNS)) {
  const otherIds = Object.values(CAMPAIGNS)
    .filter((o) => o.id !== camp.id)
    .filter((o) => !CONCLUDED_BEFORE_OTHERS[o.id] || CONCLUDED_BEFORE_OTHERS[camp.id])
    .map((o) => o.id)
    .sort();

  // reverse map for chronology check
  const inbound = {};
  for (const entry of camp.NODE_ATLAS) {
    const node = camp.resolveNode(entry.id, {}, {});
    if (!node) continue;
    for (const choice of node.choices || []) {
      const targets = [choice.next, ...(choice.uncertain || []).map((u) => u.next)].filter(Boolean);
      for (const t of targets) {
        if (!inbound[t]) inbound[t] = new Set();
        inbound[t].add(entry.id);
      }
    }
  }

  let count = 0;
  for (const entry of camp.NODE_ATLAS) {
    const node = camp.resolveNode(entry.id, {}, {});
    if (!node || !node.bulletin) continue;
    count++;
    totalBulletins++;
    const b = node.bulletin;

    // A. structure
    if (!b.headline || !b.body) {
      console.log(`  ✗ ${campaignId}/${entry.id}: bulletin missing headline or body`);
      problems++;
    }
    const keys = Object.keys(b.meanwhile || {}).sort();
    if (JSON.stringify(keys) !== JSON.stringify(otherIds)) {
      console.log(`  ✗ ${campaignId}/${entry.id}: meanwhile keys ${JSON.stringify(keys)} — expected ${JSON.stringify(otherIds)}`);
      problems++;
    }

    // B. chronology
    const own = toYYYYMM(node.date);
    for (const srcId of inbound[entry.id] || []) {
      const srcNode = camp.resolveNode(srcId, {}, {});
      const srcDate = toYYYYMM(srcNode && srcNode.date);
      if (own && srcDate && srcDate > own) {
        console.log(`  ✗ ${campaignId}/${entry.id} (${node.date}) reachable from ${srcId} (${srcNode.date}) — bulletin would be anachronistic`);
        problems++;
      }
    }

    // C. presupposition
    const text = b.body + " " + Object.values(b.meanwhile || {}).join(" ");
    const m = text.match(PRESUPPOSES);
    if (m) {
      console.log(`  ✗ ${campaignId}/${entry.id}: bulletin presupposes an undecided outcome — "${m[0]}"`);
      problems++;
    }
  }
  console.log(`  ${campaignId}: ${count} bulletins across ${camp.NODE_ATLAS.length} nodes`);
}

console.log(`\n${totalBulletins} bulletin(s) checked, ${problems} problem(s).`);
process.exit(problems > 0 ? 1 : 0);
