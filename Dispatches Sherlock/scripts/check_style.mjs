// A style lint, for the habits that read as machine-written or as careless: phrase budgets, very long sentences, each speaker's voice, the conventions for
// labels and titles, the glossary of terms, and the names that speakers go by. check_prose.mjs holds the hard rules (dashes, dates, spellings); this holds
// the softer ones as budgets: a count that may not grow. When a rewrite brings a count down, lower the budget here so that the gain is kept.
// Run: node scripts/check_style.mjs [--counts]       (npm run check:style; part of npm test)
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { CONTRACTIONS, KEEP, VOICES } from "../gen/voices.mjs";

const dir = "src/content/sherlock";
const events = JSON.parse(readFileSync(join(dir, "events.json"), "utf8"));
const showCounts = process.argv.includes("--counts");

// ───────────── the prose the budgets are counted over ─────────────
const isCaps = (s) => /[A-Z]/.test(s) && s === s.toUpperCase();
const body = [];
const add = (t) => {
  if (typeof t === "string" && t && !isCaps(t)) body.push(t);
};
for (const n of Object.values(events.nodes)) {
  add(n.description);
  for (const e of n.echoes ?? []) add(e.text);
  for (const o of n.options) {
    add(o.detail);
    add(o.outcome);
    add(o.roll?.success.outcome);
    add(o.roll?.failure.outcome);
    add(o.quote?.text);
  }
}
for (const e of Object.values(events.endings)) {
  add(e.text);
  for (const v of e.variants ?? []) add(v.text);
}
for (const i of Object.values(events.interludes)) add(i.bodyText);
const text = body.join("\n");
const count = (re) => (text.match(re) ?? []).length;

// ───────────── 1. phrase budgets ─────────────
// [name, pattern, budget]. The budgets are the counts at the time of the 0.7.0 copy-edit, with a little room; the first column of the report is the
// count before it, for the record.
const BUDGETS = [
  ["very", /\bvery\b/gi, 55, 316],
  ["a good deal", /\ba good deal\b/gi, 30, 49],
  ["perfectly", /\bperfectly\b/gi, 16, 27],
  ["quite or rather", /\b(?:quite|rather)\b/gi, 60, 104],
  ["a man who", /\ba man who\b/gi, 110, 140],
  ["the air of a man who", /\b(?:air|expression|face|look|manner|step|voice|eyes) of a man (?:who|to)\b/gi, 12, 25],
  ["It is the most/first/only/best/last", /\bIt (?:is|was) the (?:most|first|only|best|last)\b/g, 30, 62],
  ["you find that you", /\byou find that you\b/gi, 8, 15],
  ["negation openers (you/he/she do not)", /\b(?:you|he|she|they) (?:do|does) not\b/gi, 150, 181],
  ["for the first time", /\bfor the first time\b/gi, 32, 30],
  ["not at all", /\bnot at all\b/gi, 45, 41],
  ["extraordinary", /\bextraordinar/gi, 10, 7],
];
// sentences over 40 words (a long list is allowed; a run-on is not)
const sentences = body.flatMap((t) => t.split(/(?<=[.!?]["”]?)\s+/));
const long = sentences.filter((s) => s.split(/\s+/).length > 40).length;
const longest = Math.max(...sentences.map((s) => s.split(/\s+/).length));
let failures = 0;
const fail = (m) => {
  failures++;
  console.error("FAIL: " + m);
};
for (const [name, re, budget, was] of BUDGETS) {
  const n = count(re);
  if (showCounts) console.log(`${name.padEnd(40)} ${String(n).padStart(4)}  (budget ${budget}, was ${was})`);
  if (n > budget) fail(`"${name}" appears ${n} times (budget ${budget}): vary the wording, or if it is deliberate raise the budget in scripts/check_style.mjs`);
}
if (showCounts) console.log(`sentences over 40 words ${String(long).padStart(4)}  (budget 55, was 95); longest ${longest}`);
if (long > 55) fail(`${long} sentences are over 40 words (budget 55): split the run-ons`);
if (longest > 80) fail(`a sentence is ${longest} words long (limit 80)`);

// ───────────── 5. voices ─────────────
const contracts = (t) => /n't\b|'(?:ll|re|ve|d|m)\b|\b(?:it|that|there|he|she|what|who|here|let)'s\b/i.test(t);
const bySpeaker = {};
for (const [id, n] of Object.entries(events.nodes)) {
  n.options.forEach((o, i) => {
    if (!o.quote?.speaker) return;
    (bySpeaker[o.quote.speaker] ??= []).push({ key: `${id}:${i}`, text: o.quote.text });
  });
}
for (const [speaker, v] of Object.entries(VOICES)) {
  for (const q of bySpeaker[speaker] ?? []) {
    const w = q.text.split(/\s+/).length;
    if (v.maxWords && w > v.maxWords * 1.3 && !KEEP.has(q.key)) fail(`${speaker}, ${q.key}: ${w} words is too long for this speaker (limit ${v.maxWords}): ${v.why}`);
    if (v.noSemicolon && q.text.includes(";")) fail(`${speaker}, ${q.key}: a semicolon (${v.why})`);
    if (v.noExclaim && q.text.includes("!")) fail(`${speaker}, ${q.key}: an exclamation mark (${v.why})`);
  }
}
for (const [speaker, rule] of Object.entries(CONTRACTIONS)) {
  const qs = bySpeaker[speaker] ?? [];
  if (!qs.length) continue;
  const share = qs.filter((q) => contracts(q.text)).length / qs.length;
  if (showCounts) console.log(`${speaker.padEnd(22)} contractions in ${(share * 100).toFixed(0)}% of ${qs.length} quotes`);
  if (rule.atLeast !== undefined && share < rule.atLeast) fail(`${speaker} contracts in ${(share * 100).toFixed(0)}% of quotes (at least ${rule.atLeast * 100}%)`);
  if (rule.atMost !== undefined && share > rule.atMost) fail(`${speaker} contracts in ${(share * 100).toFixed(0)}% of quotes (at most ${rule.atMost * 100}%): this speaker does not contract`);
}

// ───────────── 7. labels, titles and the glossary ─────────────
const SMALL = new Set("a an the of to in on for and but or at by with from into over as up is if nor so yet off out per via".split(" "));
const titleCase = (s) =>
  s
    .replace(/[.?!:;,]+$/, "")
    .split(/\s+/)
    .every((w, i) => {
      const core = w.replace(/^[^A-Za-z0-9]+/, "");
      if (!core) return true;
      if (i > 0 && SMALL.has(core.toLowerCase())) return true;
      return /^[A-Z0-9]/.test(core);
    });
for (const [id, n] of Object.entries(events.nodes)) {
  if (!titleCase(n.title) || /[.?!]$/.test(n.title)) fail(`scene ${id}: the title "${n.title}" is not in Title Case without a full stop`);
  for (const [i, o] of n.options.entries()) {
    if (!/[.?]$/.test(o.label)) fail(`scene ${id} option ${i}: the label does not end with a full stop or a question mark: "${o.label}"`);
    if (!titleCase(o.label)) fail(`scene ${id} option ${i}: the label is not in Title Case: "${o.label}"`);
    if (o.label.length > 100) fail(`scene ${id} option ${i}: the label is ${o.label.length} characters long (limit 100)`);
    if (!/[.?!]$/.test(o.detail)) fail(`scene ${id} option ${i}: the detail does not end in punctuation`);
  }
}
for (const [id, e] of Object.entries(events.endings)) {
  if (!titleCase(e.title)) fail(`ending ${id}: the title "${e.title}" is not in Title Case`);
  if (!isCaps(e.headline)) fail(`ending ${id}: the headline is not in capitals`);
}
for (const [id, i] of Object.entries(events.interludes)) if (!isCaps(i.headline)) fail(`interlude ${id}: the headline is not in capitals`);

// the glossary: one name for each thing, and the names that must not drift
const GLOSSARY = [
  [/\b[Cc]ase[ -]?[Bb]ook\b(?!s)/g, (m) => m !== "Case-Book" && m !== "case-book", "the shelf is the Case-Book (one word, hyphenated, capitals)"],
  [/\bcasebooks?\b/gi, () => true, "write case-book (hyphenated), or Case-Book for the shelf"],
  [/\b(?:Mrs|Mr|Dr|St|Mme|Messrs)\./g, () => true, "UK style: Mrs Norton, Mr Holmes, Dr Watson with no full stop"],
  [/\bIrene Adler\b/g, () => true, "she is Mrs Norton in 1891; Irene Adler is named only where the story must say who she was (allowed in the K7 and K8 scenes and the Bohemia case)"],
];
const ADLER_OK = new Set(["K7", "K8", "B1", "B2", "B3", "B4", "AY", "AC"]);
for (const [id, n] of Object.entries(events.nodes)) {
  const all = [n.description, ...(n.echoes ?? []).map((e) => e.text), ...n.options.flatMap((o) => [o.detail, o.outcome, o.quote?.text ?? "", o.roll?.success.outcome ?? "", o.roll?.failure.outcome ?? ""])].join("\n");
  for (const [re, bad, why] of GLOSSARY) {
    for (const m of all.match(re) ?? []) {
      if (!bad(m)) continue;
      if (re.source.includes("Irene Adler") && ADLER_OK.has(id)) continue;
      fail(`scene ${id}: "${m}": ${why}`);
      break;
    }
  }
}
// the same glossary holds the interface: the screens may not say "Case Book" or "casebook", and the shelf's name is not used for the endings record
for (const f of ["App", "board", "calendar", "map", "casebook", "ledger"]) {
  const src = readFileSync(`src/${f}.ts${f === "casebook" || f === "ledger" ? "" : "x"}`, "utf8").replace(/\/\/.*$/gm, "").replace(/from "[^"]*"/g, "");
  for (const m of src.match(/[Cc]ase[ -]?[Bb]ook/g) ?? []) if (m !== "Case-Book" && m !== "case-book") fail(`interface (${f}): "${m}": the shelf is the Case-Book`);
}
// every speaker has one spelling: no two speakers that differ only in a title's full stop, case or a leading "The"
const names = Object.keys(bySpeaker);
const norm = (s) => s.toLowerCase().replace(/[.']/g, "").replace(/^the /, "");
const seenNames = new Map();
for (const s of names) {
  const k = norm(s);
  if (seenNames.has(k) && seenNames.get(k) !== s) fail(`the speakers "${seenNames.get(k)}" and "${s}" look like one person under two names`);
  seenNames.set(k, s);
}
// in the Bohemia case (1888) she speaks as Irene Adler; everywhere else she is Mrs Norton
for (const [id, n] of Object.entries(events.nodes)) for (const o of n.options) if (o.quote?.speaker === "Irene Adler" && n.branch !== "BOHEMIA") fail(`scene ${id}: Irene Adler speaks outside the Bohemia case; she is Mrs Norton in 1891`);
const ALIASES = { "Adler": "Mrs Norton", "Mycroft": "Mycroft Holmes", "Holmes": "Sherlock Holmes", "Lestrade": "Inspector Lestrade", "Watson": "Dr Watson", "Moriarty": "Professor Moriarty" };
for (const s of names) if (ALIASES[s]) fail(`the speaker "${s}" should be "${ALIASES[s]}"`);

if (failures) {
  console.error(`\nStyle check FAILED: ${failures} problem(s).`);
  process.exit(1);
}
console.log(`Style check passed: ${BUDGETS.length} phrase budgets, ${long} long sentences (budget 55), ${Object.keys(VOICES).length} voices, labels, titles and the glossary.`);
