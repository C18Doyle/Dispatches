// check_voice.mjs: the habits that make prose read as machine-written, measured on everything a player reads in prose (scene descriptions, outcomes, endings, documents, prologue, epilogues,
// the epigraphs and notes in ui.json and book.json). docs/WRITING.md says what to avoid; check_repetition.mjs finds repeated wording; this finds repeated *shape*.
//   node scripts/check_voice.mjs            report
//   node scripts/check_voice.mjs --strict   also fail when a measure passes its limit (part of npm test)
// Measures, each with a limit at the top of the file (GAME=<seat> picks the seat; limits below are for both):
//   stacked "You"   passages with three or more sentences in a row that begin "You" (a drumbeat of actions)
//   lists of three  "A, B and C" lists of short items, per thousand words (the commonest machine-written rhythm)
//   flat rhythm     passages of four or more sentences whose lengths hardly vary
//   one opener      the share of all sentences that begin with the same word ("The", "You")
//   closing stings  passages of three or more sentences that end on a sentence of five words or fewer (the neat last line)
import { readFileSync } from "node:fs";
import { join } from "node:path";

const seat = process.env.GAME ?? "dracula";
const strict = process.argv.includes("--strict");
const dir = join("src", "content", seat);
const read = (f) => JSON.parse(readFileSync(join(dir, f), "utf8"));
const events = read("events.json");
const flavor = read("flavor.json");
const ui = read("ui.json");
const book = read("book.json");

const LIMITS = {
  stackedYouPassages: 4, // passages with three or more "You ..." sentences in a row
  listsPer1000: 6.5, // three-item lists per thousand words
  flatPassages: 8, // passages whose sentence lengths hardly vary
  openerShare: 0.2, // no single opening word begins more than this share of sentences
  stingPassages: 55, // passages that end on a very short sentence
};

const passages = []; // { where, text }
const add = (where, text) => {
  if (typeof text === "string" && text.trim().length > 40) passages.push({ where, text });
};
for (const n of Object.values(events.nodes)) {
  add(`${n.id} description`, n.description);
  n.options.forEach((o, i) => {
    add(`${n.id}.${i} outcome`, o.outcome);
    if (o.roll) for (const r of ["success", "failure"]) add(`${n.id}.${i} ${r}`, o.roll[r].outcome);
  });
}
for (const e of Object.values(events.endings)) {
  add(e.id, e.text);
  (e.variants ?? []).forEach((v, i) => add(`${e.id} variant ${i}`, v.text));
}
for (const it of Object.values(events.interludes)) add(it.id, it.bodyText);
flavor.prologue.forEach((p, i) => add(`prologue ${i}`, p));
for (const r of Object.values(flavor.epilogueReadings)) add(`epilogue ${r.label}`, r.epilogue);
for (const [k, t] of Object.entries(ui.tracks ?? {})) add(`ui.tracks.${k}`, t.epigraph);
for (const [k, r] of Object.entries(book.road ?? {})) add(`book ${k}`, r.note);

const sentences = (t) => t.replace(/\s+/g, " ").split(/(?<=[.!?])\s+(?=[A-Z"“])/).filter(Boolean);
const words = (t) => t.match(/[A-Za-z']+/g) ?? [];
const total = passages.reduce((n, p) => n + words(p.text).length, 0);

let failures = 0;
const over = (label, value, limit, fmt = (x) => x) => {
  const bad = value > limit;
  console.log(`${bad ? "!!" : "ok"} ${label}: ${fmt(value)} (limit ${limit})`);
  if (bad && strict) failures++;
};

console.log(`${passages.length} passages, ${total} words (${seat}).\n`);

// stacked "You"
const stacked = passages.filter((p) => {
  let run = 0;
  for (const s of sentences(p.text)) {
    run = /^You\b/.test(s) ? run + 1 : 0;
    if (run >= 3) return true;
  }
  return false;
});
over('passages with three "You" sentences in a row', stacked.length, LIMITS.stackedYouPassages);
stacked.slice(0, 12).forEach((p) => console.log(`     ${p.where}`));

// lists of three short items: "a, b and c" / "a, b, and c" / "a, b or c"
const ITEM = "[A-Za-z'\\u2019-]+(?: [A-Za-z'\\u2019-]+){0,3}";
const LIST = new RegExp(`(?:^|[ (])(${ITEM}), (${ITEM}),? (?:and|or) (${ITEM})(?=[ .;:,)]|$)`, "g");
const lists = [];
for (const p of passages)
  for (const m of p.text.matchAll(LIST)) {
    const items = [m[1], m[2], m[3]];
    // a list in the sense meant: the three items are alike in length and none is a long clause
    if (items.every((x) => words(x).length <= 3)) lists.push({ where: p.where, text: m[0].trim() });
  }
over("lists of three short items per 1000 words", (1000 * lists.length) / total, LIMITS.listsPer1000, (x) => x.toFixed(1));
lists.slice(0, 10).forEach((l) => console.log(`     ${l.where}: "${l.text}"`));

// flat rhythm
const sd = (a) => {
  const m = a.reduce((x, y) => x + y, 0) / a.length;
  return Math.sqrt(a.reduce((x, y) => x + (y - m) ** 2, 0) / a.length) / m;
};
const flat = passages.filter((p) => {
  const lens = sentences(p.text).map((s) => words(s).length);
  return lens.length >= 4 && sd(lens) < 0.22;
});
over("passages with flat sentence rhythm", flat.length, LIMITS.flatPassages);
flat.slice(0, 12).forEach((p) => console.log(`     ${p.where}`));

// one opener
const opener = new Map();
let nS = 0;
for (const p of passages)
  for (const s of sentences(p.text)) {
    const w = (s.replace(/^["“\s]+/, "").split(/\s+/)[0] ?? "").replace(/[^A-Za-z']/g, "");
    opener.set(w, (opener.get(w) ?? 0) + 1);
    nS++;
  }
const top = [...opener].sort((a, b) => b[1] - a[1]).slice(0, 4);
console.log("   most common openers: " + top.map(([w, n]) => `${w} ${((100 * n) / nS).toFixed(0)}%`).join(", "));
over(`share of sentences that open with "${top[0][0]}"`, top[0][1] / nS, LIMITS.openerShare, (x) => (100 * x).toFixed(1) + "%");

// closing stings
const stings = passages.filter((p) => {
  const ss = sentences(p.text);
  return ss.length >= 3 && words(ss[ss.length - 1]).length <= 5;
});
over("passages that end on a sentence of five words or fewer", stings.length, LIMITS.stingPassages);
stings.slice(0, 8).forEach((p) => console.log(`     ${p.where}: "${sentences(p.text).slice(-1)[0]}"`));

if (failures) {
  console.error(`\nFAIL: ${failures} limit(s) passed. Rewrite the passages above (docs/WRITING.md: vary the shape, not only the words), or raise a limit with a reason.`);
  process.exit(1);
}
console.log("\nVoice check done.");
