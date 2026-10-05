/**
 * Words that did not exist yet, or did not mean that yet, on the date of the node that uses them.
 * Spec §8 ("no invented claims") and §11 (commander timing): the same failure class as an adviser speaking after
 * dismissal, applied to titles, ranks, place names and terms.
 *
 * Two severities:
 *   ERROR   high confidence, fails the check (a rank held before it was conferred; a state that did not exist yet;
 *           a term from after the war).
 *   REVIEW  plausible but arguable (a technology, a name that has a legitimate earlier use): printed for a human to
 *           read, never fails. Silence one with an entry in REVIEW_OK below once it has been read.
 *
 * Every rule states the fact it relies on. Add a rule only for a fact you are certain of; a wrong rule is worse than none.
 * Node dates are the campaign's own calendar (Stavka is Julian), so Russian rules use the Julian date of the event.
 *
 * Text is collected from each node as it resolves under many flag states, so branches written inside functions are read too.
 */
const { loadEngine, fileArg } = require("./_load.js");
const E = loadEngine(fileArg());

// [severity, pattern, not-valid-before (ISO) or null, not-valid-after (ISO) or null, the fact]
const RULES = [
  ["ERROR", /\bMarshal Joffre\b|\bMarshal of France Joffre\b/, "1916-12-26", null, "Joffre was made Marshal of France on 26 December 1916"],
  ["ERROR", /\bMarshal Foch\b|\bMarshal of France Foch\b/, "1918-08-06", null, "Foch was made Marshal of France on 6 August 1918"],
  ["ERROR", /\bMarshal Haig\b|\bField Marshal (Sir )?Douglas Haig\b|\bField Marshal Haig\b/, "1917-01-01", null, "Haig was promoted Field Marshal on 1 January 1917"],
  ["ERROR", /\bField Marshal (Paul )?von Hindenburg\b|\bField Marshal Hindenburg\b|\bGeneralfeldmarschall (Paul )?(von )?Hindenburg\b|\bMarshal Hindenburg\b/, "1914-11-27", null, "Hindenburg was promoted Generalfeldmarschall on 27 November 1914"],
  ["ERROR", /\bsoviets?\b/i, "1917-02-27", null, "the Petrograd Soviet was formed on 27 February 1917 (Old Style); before that the word is not in use in this sense"],
  ["ERROR", /\b(First|1st) World War\b|\bWorld War (I|One|1)\b|\bWWI\b|\bSecond World War\b|\bWorld War (II|Two|2)\b/, null, null, "contemporaries called it the Great War or the European war; the numbered World Wars are later names"],
  ["ERROR", /\bThird Reich\b|\bNazi(s)?\b/, null, null, "later terms"],
  ["ERROR", /\bLeningrad\b|\bStalingrad\b|\bVolgograd\b|\bIstanbul\b/, null, null, "later names (Petrograd 1914-24; Tsaritsyn until 1925; Constantinople as the usual name until 1930)"],
  ["ERROR", /\bCzechoslovakia\b|\bCzechoslovak (state|republic)\b/i, "1918-10-28", null, "Czechoslovakia was proclaimed on 28 October 1918"],
  ["ERROR", /\bYugoslavia\b/, null, null, "the state was called the Kingdom of Serbs, Croats and Slovenes from December 1918 and Yugoslavia from 1929"],
  ["ERROR", /\bRAF\b|\bRoyal Air Force\b/, "1918-04-01", null, "the Royal Air Force was formed on 1 April 1918"],
  ["ERROR", /\bPetrograd\b/, "1914-08-18", null, "St Petersburg was renamed Petrograd on 18 August 1914 (Old Style)"],
  // Arguable: printed for review.
  ["REVIEW", /\bSt\.? Petersburg\b/, "1914-08-18", null, "after the renaming Russians said Petrograd; a retrospective mention can be fine"],
  ["REVIEW", /\btanks?\b/i, null, "1916-09-14", "the tank first went into action on 15 September 1916; 'tank' may mean something else"],
  ["REVIEW", /\b(chlorine|poison gas|gas attack|gas shell)\b/i, null, "1915-04-21", "the first large-scale gas attack was at Ypres on 22 April 1915; tear-gas shells were used earlier"],
  ["REVIEW", /\bfascis(m|t)s?\b/i, null, "1919-03-22", "the word's modern political meaning begins in 1919"],
  ["REVIEW", /\bblitzkrieg\b/i, null, null, "a later term"],
];

// Reviewed and accepted: "nodeId|text fragment". Add here only after reading the finding.
const REVIEW_OK = new Set(["bef_1916_12_tanks|Tanks", "bef_1916_12_tanks|tanks", "bef_1916_12_tanks|tank"]); // the node is dated two days before the first action; the staff knew the machines and their code name was "tank"

function collect(node) {
  const out = [];
  const add = (label, v) => { if (typeof v === "string" && v.trim()) out.push([label, v]); };
  add("title", node.title);
  add("situation", node.situation);
  add("context", node.context);
  add("epilogue", node.epilogue);
  if (node.bulletin && typeof node.bulletin === "object") { add("bulletin", node.bulletin.text); add("bulletin source", node.bulletin.source); }
  for (const ch of node.choices ?? []) {
    add(`choice ${ch.id} label`, ch.label);
    add(`choice ${ch.id} outcome`, ch.outcome);
    if (ch.advisor) add(`choice ${ch.id} advisor`, ch.advisor.position);
    add(`choice ${ch.id} dispute`, ch.dispute);
    for (const b of ch.uncertain ?? []) { add(`choice ${ch.id} roll title`, b.title); add(`choice ${ch.id} roll outcome`, b.outcome); }
  }
  return out;
}

// Flag states: none, and each flag set to each value it is ever given.
const flagValues = new Map();
for (const { node } of E.allNodes()) {
  for (const ch of node.choices ?? []) {
    for (const sf of [ch.setFlags, ...(ch.uncertain ?? []).map((b) => b.setFlags)]) {
      for (const [k, v] of Object.entries(sf || {})) {
        if (!flagValues.has(k)) flagValues.set(k, new Set());
        flagValues.get(k).add(v);
      }
    }
  }
}
const contexts = [{}];
for (const [k, vals] of flagValues) for (const v of vals) contexts.push({ [k]: v });

const errors = [];
const reviews = [];
let nodesChecked = 0;
let strings = 0;
for (const { nodeId, node: raw } of E.allNodes()) {
  nodesChecked++;
  const seen = new Set();
  for (const flags of contexts) {
    const node = E.resolveNode(nodeId, flags, E.emptyMeters(), E.emptyHardState());
    for (const [label, text] of collect(node)) {
      const key = label + "|" + text;
      if (seen.has(key)) continue;
      seen.add(key);
      strings++;
      for (const [sev, re, from, to, fact] of RULES) {
        const m = re.exec(text);
        if (!m) continue;
        if (from && raw.date >= from) continue; // valid from this date on
        if (to && raw.date > to) continue; // only suspicious up to this date
        const id = `${nodeId}|${m[0]}`;
        if (sev === "REVIEW" && REVIEW_OK.has(id)) continue;
        const line = `${nodeId} (${raw.date}) ${label}: "${m[0]}": ${fact}`;
        (sev === "ERROR" ? errors : reviews).push(line);
      }
    }
  }
}
console.log(`check-anachronisms: ${nodesChecked} nodes, ${strings} strings read under ${contexts.length} flag states, ${errors.length} error${errors.length === 1 ? "" : "s"}, ${reviews.length} for review`);
for (const e of errors) console.log("  ERROR  " + e);
for (const r of reviews) console.log("  review " + r);
process.exit(errors.length ? 1 : 0);
