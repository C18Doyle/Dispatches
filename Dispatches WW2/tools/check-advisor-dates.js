#!/usr/bin/env node
/*
 * check-advisor-dates.js
 *
 * Catches the bug class where a named historical figure speaks in a node dated after their
 * real death, execution, suicide, capture or removal from the post they are speaking in.
 * One instance of this shipped (Rommel and Model quoted in a node dated after Rommel's
 * wounding and while Model was still on the Eastern Front) and was only caught by eye.
 *
 * Method: parse ADVISOR_DOSSIERS' free-prose `fate` field for a terminal year, parse every
 * node's `date` field for a year, then flag any advisor quote whose node year exceeds the
 * advisor's terminal year.
 *
 * The fate field is prose, not structured, so extraction is heuristic. Findings are
 * CANDIDATES for review, not confirmed bugs — read each one. False positives are expected
 * where a fate mentions a postwar year before the terminal event.
 *
 * Usage: node check-advisor-dates.js [path/to/App.jsx]
 * Exit 1 if any candidate is found, so it can gate a build.
 *
 * A quote with no ADVISOR_DOSSIERS entry can't be date-checked at all, which is its own risk:
 * an un-dossiered *named* person could say something anachronistic and this script would never
 * catch it. So a quote with no dossier is only safe to leave un-dossiered when the "speaker" is
 * genuinely anonymous or institutional (a staff, a cable, "unnamed in the record") rather than
 * a real historical figure who just hasn't been given a dossier yet. ANONYMOUS_VOICE_ALLOWLIST
 * below is that reviewed list — exactly the undossiered speakers as of the last audit, each
 * checked by hand to confirm none of them names a real person. Any NEW undossiered name that
 * isn't already on this list is treated as a bug (exit 1): either it needs a dossier entry, or,
 * if it's genuinely anonymous, it needs to be added here after review.
 */
const fs = require("fs");

const ANONYMOUS_VOICE_ALLOWLIST = new Set([
  "the OKW staff",
  "Guderian's doctrine, invoked by staff",
  "a staff officer, unnamed in the record",
  "Stauffenberg's own proclamation, relayed",
  "a loyalist colonel, unnamed in the record",
  "Rundstedt's staff",
  "a State Department cable, unsigned",
  "Goerdeler's own circle, relayed",
  "a Kreisau Circle voice, relayed",
  // Added 2026-09-21 (Key Battle Subgame round 10), reviewed by hand: the unnamed staff voice on
  // omahaIsolated44's dev-only "stalled" path, used precisely so as NOT to put a new line in
  // Eisenhower's mouth. Names no real person.
  "SHAEF staff",
]);

const SRC = process.argv[2] || "App.jsx";
const src = fs.readFileSync(SRC, "utf8");

// ---- 1. Advisor terminal years -------------------------------------------------------
// Phrases that indicate the advisor stops being available, paired with a year.
// Terminal-event keywords. The `fate` field is prose and phrases these many ways — "died",
// but also "took his own life", "forced to take poison", "mortally wounded". The first pass of
// this script matched only the obvious verbs and therefore silently skipped Rommel, Model,
// Kluge and Vatutin: precisely the advisors whose misdating shipped. If a fate matches any of
// these, the FIRST year in the fate string is taken as terminal, since the prose runs
// chronologically and the terminal event is what the field is describing.
const TERMINAL_WORDS = /\b(died|dying|death|executed|hanged|shot|suicide|killed|poison|took his own life|take his own life|mortally wounded|murdered|assassinated|perished|captured|imprisoned|arrested|dismissed|relieved|recalled|sidelined|cashiered)\b/i;

const dossierStart = src.indexOf("const ADVISOR_DOSSIERS");
if (dossierStart === -1) {
  console.error("ADVISOR_DOSSIERS not found in " + SRC);
  process.exit(2);
}
const dossierBlock = src.slice(dossierStart, src.indexOf("\n};", dossierStart));

const advisors = {};
const entryRe = /^\s{2}(?:"((?:[^"\\]|\\.)*)"|([A-Za-zÀ-ÿ'\-]+)):\s*\{([\s\S]*?)\},\s*$/gm;
let m;
while ((m = entryRe.exec(dossierBlock)) !== null) {
  const name = m[1] || m[2];
  const body = m[3];
  const fate = (body.match(/fate:\s*"((?:[^"\\]|\\.)*)"/) || [])[1] || "";
  let terminal = null;
  if (TERMINAL_WORDS.test(fate)) {
    const years = fate.match(/\b(19\d{2})\b/g);
    if (years) terminal = parseInt(years[0], 10);
  }
  advisors[name] = { fate, terminal };
}

// ---- 2. Node dates and the advisors quoted inside them --------------------------------
// Walk the CAMPAIGNS source, tracking the most recent `date:` seen before each advisor quote.
const campStart = src.indexOf("\n  german: {");
const campEnd = src.indexOf("\n};", src.indexOf("\n  allied: {"));
const camp = src.slice(campStart, campEnd);

const tokenRe = /date:\s*"([^"]*)"|advisor:\s*\{\s*name:\s*"([^"]+)"|get ([a-zA-Z0-9_]+)\(\)/g;
let currentDate = null;
let currentDateYear = null;
let currentNode = null;
const findings = [];
const quotesChecked = [];

while ((m = tokenRe.exec(camp)) !== null) {
  if (m[3]) {
    currentNode = m[3];
  } else if (m[1] !== undefined) {
    currentDate = m[1];
    // Take the LAST year mentioned in the date string, so ranges like
    // "OCTOBER 1943 – JANUARY 1944" are judged at their late end (most permissive).
    const years = currentDate.match(/(19\d{2})/g);
    currentDateYear = years ? parseInt(years[years.length - 1], 10) : null;
  } else if (m[2]) {
    const name = m[2];
    quotesChecked.push({ name, node: currentNode, date: currentDate });
    const a = advisors[name];
    if (!a) {
      findings.push({
        kind: "NO_DOSSIER",
        name,
        node: currentNode,
        date: currentDate,
        note: "advisor quoted but has no ADVISOR_DOSSIERS entry — cannot be date-checked",
      });
      continue;
    }
    if (a.terminal && currentDateYear && currentDateYear > a.terminal) {
      findings.push({
        kind: "SPEAKS_AFTER_FATE",
        name,
        node: currentNode,
        date: currentDate,
        terminal: a.terminal,
        note: a.fate.slice(0, 150),
      });
    }
  }
}

// ---- 3. Report ------------------------------------------------------------------------
const named = Object.keys(advisors).length;
const withTerminal = Object.values(advisors).filter((a) => a.terminal).length;

console.log(`advisors in dossiers: ${named} (terminal year extracted for ${withTerminal})`);
console.log(`advisor quotes checked: ${quotesChecked.length}`);

const afterFate = findings.filter((f) => f.kind === "SPEAKS_AFTER_FATE");
const noDossier = findings.filter((f) => f.kind === "NO_DOSSIER");

if (afterFate.length) {
  console.log(`\n!! ${afterFate.length} quote(s) dated after the advisor's terminal year:`);
  for (const f of afterFate) {
    console.log(`   ${f.name} in ${f.node} (${f.date}) — terminal ${f.terminal}`);
    console.log(`      fate: ${f.note}`);
  }
} else {
  console.log("\nNo advisor quoted after their recorded terminal year.");
}

let unexpectedUndossiered = [];
if (noDossier.length) {
  const uniq = [...new Set(noDossier.map((f) => f.name))];
  console.log(`\n${noDossier.length} quote(s) from ${uniq.length} advisor(s) with no dossier entry:`);
  console.log("   " + uniq.join(", "));
  console.log("   (These cannot be date-checked. Adding dossiers brings them under this audit.)");

  unexpectedUndossiered = uniq.filter((name) => !ANONYMOUS_VOICE_ALLOWLIST.has(name));
  if (unexpectedUndossiered.length) {
    console.log(
      `\n!! ${unexpectedUndossiered.length} undossiered speaker(s) NOT on the reviewed anonymous-voice allowlist:`
    );
    for (const name of unexpectedUndossiered) console.log(`   ${name}`);
    console.log(
      "   Either give this speaker an ADVISOR_DOSSIERS entry, or — only if it's genuinely an\n" +
        "   anonymous/institutional voice, not a real person — add it to ANONYMOUS_VOICE_ALLOWLIST\n" +
        "   in this script after confirming that by hand."
    );
  }

  const staleAllowlistEntries = [...ANONYMOUS_VOICE_ALLOWLIST].filter((name) => !uniq.includes(name));
  if (staleAllowlistEntries.length) {
    console.log(
      `\n${staleAllowlistEntries.length} allowlist entr(y/ies) no longer appear undossiered (fine — e.g. a dossier was added since):`
    );
    console.log("   " + staleAllowlistEntries.join(", "));
  }
} else {
  const staleAllowlistEntries = [...ANONYMOUS_VOICE_ALLOWLIST];
  if (staleAllowlistEntries.length) {
    console.log(
      `\nNo undossiered quotes at all now — every ANONYMOUS_VOICE_ALLOWLIST entry is stale (fine, just cleanup):`
    );
    console.log("   " + staleAllowlistEntries.join(", "));
  }
}

const advisorsNoTerminal = Object.entries(advisors)
  .filter(([, a]) => !a.terminal)
  .map(([n]) => n);
if (advisorsNoTerminal.length) {
  console.log(`\n${advisorsNoTerminal.length} dossier(s) with no extractable terminal year (not checkable):`);
  console.log("   " + advisorsNoTerminal.join(", "));
}

process.exit(afterFate.length || unexpectedUndossiered.length ? 1 : 0);
