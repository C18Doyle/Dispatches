#!/usr/bin/env node
/**
 * check-flag-values.js — Dispatches: Civil War flag integrity validator
 * ======================================================================
 *
 * WHY THIS EXISTS
 * ---------------
 * Two real bugs shipped in this file, both introduced while ADDING
 * connective text rather than by an original author error:
 *
 *   flags.kubanQuotaTest === "tested"          // only ever set to "ordered"
 *   flags.novorossiyskPolicy === "cossack_priority"
 *                                              // only ever set to
 *                                              // "volunteer_priority" /
 *                                              // "extended_perimeter"
 *
 * Both are SILENT failures. The syntax is valid, tsc passes, resolveNode
 * returns a well-formed node, nothing throws. The only symptom is that a
 * block of prose written for a specific player path never appears, ever,
 * for anyone. This is the project's recurring "content exists but is never
 * wired" anti-pattern in its most invisible form: the wiring is present and
 * looks correct, but compares against a value that does not exist.
 *
 * Neither check-continuity.js nor walk-historical.js can see this.
 * Continuity only looks at whether a conditional branch EXISTS for a node;
 * a branch comparing against a bogus value still counts as existing. The
 * historical walker only follows historical:true choices, so it never sets
 * most speculative-branch flags at all.
 *
 * WHAT THIS SCRIPT DOES
 * ---------------------
 * 1. Walks every atlas node in every campaign and collects, for each flag,
 *    the complete set of values it is ever assigned — via choice.setFlags
 *    and via uncertain[].setFlags (roll outcomes).
 * 2. Scans the raw source for every `flags.X === <literal>` comparison.
 * 3. Reports any comparison whose literal is never actually assigned, and
 *    any comparison against a flag that is never set anywhere.
 * 4. Reports write-only flags — set by a choice but never read anywhere.
 *    These aren't bugs, but each one is a decision the player made that the
 *    game never refers to again, so the count is a useful backlog measure.
 *
 * LIMITATIONS (read before trusting a clean run)
 * ----------------------------------------------
 * - Only catches `===` comparisons against a literal. Truthiness checks
 *   (`if (flags.x)`), `!==`, `switch`, and comparisons against a variable
 *   are not checked.
 * - Flags set outside atlas nodes (e.g. only inside a conditional-node
 *   branch that {} flags don't reach) may be under-collected, which could
 *   produce a false positive. Verify before "fixing" a reported mismatch.
 *
 * HOW TO RUN
 * ----------
 *   node check-flag-values.js path/to/dispatches-1917.jsx
 *
 * WHEN TO RUN IT
 * --------------
 * After ANY round that adds or edits a flags-conditional branch. Cheap.
 * Run it in the standard sweep next to check-continuity.js.
 */

const fs = require("fs");
const path = require("path");

const filePath = process.argv[2];
if (!filePath) {
  console.error("Usage: node check-flag-values.js path/to/dispatches-1917.jsx");
  process.exit(1);
}

const raw = fs.readFileSync(filePath, "utf8");

let dataSrc = raw.split("// PREVIEW SCREENS")[0];
dataSrc = dataSrc.replace(/^export /gm, "");
dataSrc += "\nmodule.exports = { CAMPAIGNS };\n";
const tmpPath = filePath + ".__flagcheck_tmp.js";
fs.writeFileSync(tmpPath, dataSrc);
const { CAMPAIGNS } = require(path.resolve(tmpPath));
fs.unlinkSync(tmpPath);

// 1. Collect every value each flag is ever SET to.
const setVals = {};
const setAt = {};
for (const [campaignId, camp] of Object.entries(CAMPAIGNS)) {
  for (const entry of camp.NODE_ATLAS) {
    const node = camp.resolveNode(entry.id, {}, {});
    if (!node) continue;
    const record = (obj) => {
      for (const [k, v] of Object.entries(obj || {})) {
        (setVals[k] = setVals[k] || new Set()).add(JSON.stringify(v));
        (setAt[k] = setAt[k] || new Set()).add(entry.id);
      }
    };
    for (const choice of node.choices || []) {
      record(choice.setFlags);
      for (const u of choice.uncertain || []) record(u.setFlags);
    }
  }
}

// 2. Check every `flags.X === literal` comparison in the source.
const cmpRe = /flags\.(\w+)\s*===\s*("[^"]*"|true|false|-?\d+)/g;
let m;
let total = 0;
let problems = 0;
while ((m = cmpRe.exec(raw)) !== null) {
  total++;
  const [, flag, literal] = m;
  if (!setVals[flag]) {
    console.log(`  ✗ flags.${flag} === ${literal}  — flag is NEVER SET anywhere`);
    problems++;
  } else if (!setVals[flag].has(literal)) {
    console.log(
      `  ✗ flags.${flag} === ${literal}  — never assigned; actual values: ${[...setVals[flag]].join(", ")}`
    );
    problems++;
  }
}
console.log(`\n${total} flag comparison(s) checked, ${problems} problem(s).`);

// 3. Write-only flags — set but never read. Not bugs; a backlog measure.
const writeOnly = Object.keys(setVals).filter(
  (k) => !new RegExp("flags\\." + k + "\\b").test(raw)
);
console.log(
  `${Object.keys(setVals).length} flags written, ${writeOnly.length} never read back:`
);
for (const k of writeOnly.sort()) {
  console.log(`  · ${k}  (set at ${[...setAt[k]].join(", ")})`);
}

process.exit(problems > 0 ? 1 : 0);
