#!/usr/bin/env node
/*
 * check-pace-text.js
 *
 * Regression check for the bug a player reported: a campaign finished EARLIER than the
 * historical May 1945 (high initiative) but the ending prose called it "slower ... the price
 * of caution" — the dateClause text in the epilogue had been hand-written with the initiative
 * branches swapped relative to what projectedEnd() actually computes.
 *
 * This doesn't re-derive the date logic; it treats projectedEnd()'s own output as ground
 * truth and checks that the epilogue's prose agrees with it: whatever end date a given
 * initiative value produces, the sentence describing that date must call it "earlier/faster"
 * when it's chronologically before May 1945 and "later/slower" when it's chronologically
 * after — for every initiative-dependent campaign, at both the high and low end of the range.
 *
 * Usage: node check-pace-text.js [path/to/App.jsx]
 * Exit 1 if any campaign's prose disagrees with its own computed date.
 */
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const SRC = process.argv[2] || "../src/App.jsx";
const EXTRACTED = path.join(__dirname, "campaigns_extracted.js");

// Always regenerate — this check is only meaningful against the current source.
execFileSync("node", [path.join(__dirname, "extract_campaigns.js"), SRC, EXTRACTED], { stdio: "inherit" });
delete require.cache[require.resolve(EXTRACTED)];
const CAMPAIGNS = require(EXTRACTED);

const MONTHS = ["JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE","JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"];
const HISTORICAL_MAY_1945 = 1945 * 12 + 4; // May = index 4

function monthIndex(prose) {
  // prose is like "March 1945" or "May 8, 1945" or a non-calendar string ("the coalition
  // withdrawing its confidence") — return null when it isn't a plain "Month Year" we can order.
  const m = prose.match(/([A-Za-z]+)[^0-9]*?(\d{4})/);
  if (!m) return null;
  const mi = MONTHS.indexOf(m[1].toUpperCase());
  if (mi === -1) return null;
  return parseInt(m[2], 10) * 12 + mi;
}

// Deliberately narrow: the verdict word immediately follows an em-dash and precedes
// "than the historical" — this is the actual template both campaigns use, and it avoids
// false positives from other "faster"/"slower" mentions elsewhere in the same sentence
// (e.g. "bought with a faster, costlier advance" describing the ALTERNATIVE not taken).
const VERDICT_RE = /—\s*(earlier|later|faster|slower)\s+than\s+the\s+historical/i;
const EARLY_VERDICTS = new Set(["earlier", "faster"]);
const LATE_VERDICTS = new Set(["later", "slower"]);

let failures = 0;
let checked = 0;

for (const [key, c] of Object.entries(CAMPAIGNS)) {
  if (typeof c.epilogue !== "function" || typeof c.projectedEnd !== "function") continue;
  for (const initiative of [3, -3]) {
    const meters = { manpower: 0, fuel: 0, initiative };
    const flags = {};
    let end, epilogueText;
    try {
      end = c.projectedEnd(flags, meters);
      epilogueText = c.epilogue(flags, meters);
    } catch (e) {
      continue; // not every campaign's epilogue is safe to call with bare flags; skip those
    }
    if (!end || end.exact) continue;
    const idx = monthIndex(end.prose);
    if (idx == null) continue; // speculative/branch dates aren't calendar-comparable here

    // Find the sentence in the epilogue that actually names this date, so we're checking the
    // clause that describes THIS end.prose rather than some unrelated "earlier/later" in the text.
    const proseEsc = end.prose.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const clauseMatch = epilogueText.match(new RegExp(`[^.]*${proseEsc}[^.]*\\.`, "i"));
    if (!clauseMatch) continue; // date not quoted verbatim in prose (e.g. only in the stamp) — nothing to check
    const clause = clauseMatch[0];

    const verdictMatch = clause.match(VERDICT_RE);
    if (!verdictMatch) continue; // no directional claim in the expected template, nothing to check
    const verdict = verdictMatch[1].toLowerCase();
    const saysEarly = EARLY_VERDICTS.has(verdict);
    const saysLate = LATE_VERDICTS.has(verdict);

    checked++;
    const isChronologicallyEarly = idx < HISTORICAL_MAY_1945;
    const isChronologicallyLate = idx > HISTORICAL_MAY_1945;
    const ok = (isChronologicallyEarly && saysEarly) || (isChronologicallyLate && saysLate);
    if (!ok) {
      failures++;
      console.log(`X ${key}: initiative=${initiative} -> projectedEnd "${end.prose}" (${isChronologicallyEarly ? "before" : isChronologicallyLate ? "after" : "same as"} May 1945), but epilogue says:\n    "${clause.trim()}"`);
    }
  }
}

console.log(`\nchecked ${checked} initiative/campaign combination(s) with a directional date claim.`);
if (failures) {
  console.log(`${failures} disagreement(s) between the computed date and the prose describing it.`);
  process.exit(1);
}
console.log("All directional date claims agree with their own computed dates.");
process.exit(0);
