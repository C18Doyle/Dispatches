#!/usr/bin/env node
/**
 * check-continuity.js — Dispatches: Civil War continuity validator
 * =================================================================
 *
 * WHY THIS EXISTS
 * ----------------
 * A real bug shipped in this file: two different upstream choices at
 * tsaritsynCrisis18 — "let it stand, fully unaddressed" and "discipline
 * Voroshilov specifically, leave Stalin alone" — both routed to the same
 * downstream node, tsaritsynAftermath18. That node's situation text
 * unconditionally said "Stalin and Voroshilov's command... left unchecked,"
 * which was accurate for the first path and flatly wrong for the second
 * (Voroshilov had just been disciplined). The structural validators used
 * all session (atlas/total sync, dangling next, zero-baseline, weight sums,
 * impact-key validity) never catch this class of bug, because the node
 * DOES exist, IS reachable, and every field is individually well-formed.
 * The bug is semantic — the prose contradicts one of the paths that can
 * reach it — and none of the earlier checks read prose.
 *
 * WHAT THIS SCRIPT DOES
 * ----------------------
 * It can't read prose for meaning. What it CAN do reliably: find every
 * node reached by more than one distinct upstream (node, choice) pair,
 * check whether resolveNode's own source contains a conditional branch
 * for that node id (a `flags.` check inside that case), and if a node is
 * a real convergence point WITHOUT visible conditional logic, flag it as
 * a candidate for manual continuity review. Not every flagged node is a
 * bug — plenty of convergence points are fine because the content
 * genuinely doesn't depend on which path led there. But every node that
 * doesn't get flagged and IS a real bug is a false negative, so err
 * toward flagging, not toward silence.
 *
 * SECOND CHECK, added after a real gap shipped: every NODE_ATLAS node and
 * every ENDINGS_GALLERY ending must also have a NODE_TO_CITY entry — the
 * fourth of the four places HANDOVER.md says a new node must be registered.
 * Missing one doesn't crash anything (FrontMapScreen/EndingScreen just skip
 * the lookup), which is exactly why it's dangerous — 7 entries went missing
 * silently and none of the other five validators would ever have caught it,
 * since none of them read NODE_TO_CITY at all. This is a completeness check,
 * not a correctness one: it confirms every id IS registered, not that the
 * city it's registered to is the right one — that still needs a human read
 * of the node against the map.
 *
 * HOW TO RUN
 * ----------
 *   node scripts/check-continuity.js path/to/dispatches-1917.jsx
 *
 * WHEN TO RUN IT
 * --------------
 * After any round that adds or edits a `next` target, or edits which
 * upstream choices point at a shared node. It's cheap — run it as part
 * of the standard validation sweep going forward, not as a special case.
 */

const fs = require("fs");

const filePath = process.argv[2];
if (!filePath) {
  console.error("Usage: node check-continuity.js path/to/dispatches-1917.jsx");
  process.exit(1);
}

const rawSource = fs.readFileSync(filePath, "utf8");

// Load the data layer the same way the rest of this project's validators do
// — strip the JSX/preview-screen portion, since we only need CAMPAIGNS.
let dataSrc = rawSource.split("// PREVIEW SCREENS")[0];
dataSrc = dataSrc.replace(/^export /gm, "");
dataSrc += "\nmodule.exports = { CAMPAIGNS };\n";
const tmpPath = filePath + ".__continuity_check_tmp.js";
fs.writeFileSync(tmpPath, dataSrc);
const { CAMPAIGNS } = require(require("path").resolve(tmpPath));
fs.unlinkSync(tmpPath);

// NODE_TO_CITY lives AFTER the "// PREVIEW SCREENS" split point (it's read by
// the screen components), so it needs its own extraction — brace-matched out
// of the raw source directly rather than trusting the CAMPAIGNS-only slice.
function extractTopLevelObject(source, constName) {
  const marker = `const ${constName} = {`;
  const startIdx = source.indexOf(marker);
  if (startIdx === -1) return null;
  let i = startIdx + marker.length - 1; // sits on the opening '{'
  let depth = 0, endIdx = -1;
  for (; i < source.length; i++) {
    if (source[i] === "{") depth++;
    else if (source[i] === "}") {
      depth--;
      if (depth === 0) { endIdx = i; break; }
    }
  }
  if (endIdx === -1) return null;
  const objText = source.slice(startIdx + `const ${constName} = `.length, endIdx + 1);
  // eslint-disable-next-line no-eval
  return eval("(" + objText + ")");
}
const NODE_TO_CITY = extractTopLevelObject(rawSource, "NODE_TO_CITY") || {};

let totalFlagged = 0;

for (const [campaignId, camp] of Object.entries(CAMPAIGNS)) {
  const nodeIds = camp.NODE_ATLAS.map((n) => n.id);
  const endingIds = camp.ENDINGS_GALLERY.map((e) => e.id);

  // Build the reverse map: downstream node id -> list of {fromNode, label, setFlags}
  const incoming = {};
  for (const nid of nodeIds) {
    const node = camp.resolveNode(nid, {}, {});
    if (!node) continue;
    for (const choice of node.choices) {
      const target = choice.next;
      if (!target || target === "END" || target === "END_STUB") continue;
      if (!incoming[target]) incoming[target] = [];
      incoming[target].push({
        fromNode: nid,
        label: choice.label,
        setFlags: choice.setFlags || {},
      });
    }
  }

  // Also count checkpoint targets (finalReckoning20-style nodes not in the
  // atlas) — these route via this.resolveNode(...) calls inside the case
  // body, which the reverse map above already captures since it walks every
  // atlas node's own choices, not the checkpoint nodes themselves. That's
  // fine: checkpoints are pure routing and don't have prose of their own to
  // contradict.

  console.log(`\n=== ${campaignId} ===`);
  let campaignFlags = 0;

  for (const [targetId, sources] of Object.entries(incoming)) {
    // Only real convergence points matter: 2+ DISTINCT upstream choices.
    if (sources.length < 2) continue;

    // Does resolveNode's source contain a flags-conditional branch for this
    // specific case? Search for the case block's own text and check for a
    // `flags.` reference inside it — a rough but effective heuristic, since
    // every conditional node built this session used that exact pattern.
    const caseMarker = `case "${targetId}":`;
    const caseStart = rawSource.indexOf(caseMarker);
    let hasConditional = false;
    if (caseStart !== -1) {
      // Look at the next ~3000 chars after the case label — enough to cover
      // any single node body without bleeding into the next case in
      // practice, without needing a full parser.
      const slice = rawSource.slice(caseStart, caseStart + 3000);
      const nextCaseIdx = slice.indexOf("\n        case ", 10);
      const nextCaseIdxAlt = slice.indexOf("\n      case ", 10);
      const boundary =
        nextCaseIdx === -1 && nextCaseIdxAlt === -1
          ? slice.length
          : Math.min(...[nextCaseIdx, nextCaseIdxAlt].filter((n) => n !== -1));
      const body = slice.slice(0, boundary);
      hasConditional = /flags\.\w+/.test(body);
    }

    if (!hasConditional) {
      campaignFlags++;
      totalFlagged++;
      console.log(`  ⚠ ${targetId} — reached by ${sources.length} distinct choices, no visible flags-conditional branch`);
      for (const s of sources) {
        const flagSummary = Object.keys(s.setFlags).length
          ? JSON.stringify(s.setFlags)
          : "(no flags set)";
        console.log(`      from ${s.fromNode}: "${s.label.slice(0, 60)}${s.label.length > 60 ? "…" : ""}" ${flagSummary}`);
      }
    }
  }

  if (campaignFlags === 0) {
    console.log("  none — every convergence point either has a single source or a visible conditional branch");
  }
}

console.log(`\n${totalFlagged} node(s) flagged for manual continuity review across all campaigns.`);
console.log("A flag is not automatically a bug — it means the content should be read against every path that reaches it, the way the Stalin/Voroshilov case should have been.");

// ---------------------------------------------------------------------------
// NODE_TO_CITY completeness — see file header. Every atlas node and every
// ending, across all campaigns that actually use the shared front-map/city
// system, must have an entry. A campaign that opts out of that system
// entirely (hasFrontMap: false — Petrograd 1917 is one city, not a
// multi-front war the shared map was built to show) has nothing to
// register: FrontMapScreen is never reachable for it in the first place,
// so flagging every one of its nodes here would just be noise the
// "doesn't crash anything" note above already says not to worry about.
// ---------------------------------------------------------------------------
console.log("\n=== NODE_TO_CITY registration ===");
let missingCity = [];
for (const [campaignId, camp] of Object.entries(CAMPAIGNS)) {
  if (camp.hasFrontMap === false) continue;
  for (const n of camp.NODE_ATLAS) {
    if (!(n.id in NODE_TO_CITY)) missingCity.push(`${campaignId}/${n.id} (atlas node)`);
  }
  for (const e of camp.ENDINGS_GALLERY) {
    if (!(e.id in NODE_TO_CITY)) missingCity.push(`${campaignId}/${e.id} (ending)`);
  }
}
if (missingCity.length === 0) {
  console.log("  clean — every atlas node and every ending has a NODE_TO_CITY entry");
} else {
  console.log(`  ${missingCity.length} missing:`);
  missingCity.forEach((m) => console.log(`    - ${m}`));
}
console.log(`${missingCity.length} NODE_TO_CITY registration gap(s).`);
