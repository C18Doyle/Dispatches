// check_repetition.mjs: the habits that make machine-written prose recognisable, counted. docs/WRITING.md says what to avoid; this measures how often the text does it.
//   node scripts/check_repetition.mjs            report
//   node scripts/check_repetition.mjs --strict   also fail when a count passes its limit (part of npm test, so a new habit cannot creep in)
// It reports: phrases of five or more words that occur in more than one place; words used far more often than they need to be; how many sentences open with the same
// word; "It is a/an ..." sentences; the sentences that close a passage on a short saying (a final sentence of eight words or fewer that starts "It is", "That is" or
// "Nobody", or that has no verb of action); and option `detail` lines that are sayings and not descriptions. Limits are at the top of the file.
// Run from the game folder; GAME=<seat> picks the seat.
import { readFileSync } from "node:fs";
import { join } from "node:path";

const seat = process.env.GAME ?? "dracula";
const strict = process.argv.includes("--strict");
const dir = join("src", "content", seat);
const events = JSON.parse(readFileSync(join(dir, "events.json"), "utf8"));
const flavor = JSON.parse(readFileSync(join(dir, "flavor.json"), "utf8"));
const checks = JSON.parse(readFileSync(join(dir, "checks.json"), "utf8"));
const alternatives = checks.alternativeNodes ?? []; // groups of scenes that are the same moment told two ways, never both in one run
const decisionNodes = checks.decisionNodes ?? []; // the same decision offered from two scenes: only the first is counted

// limits for --strict (a count above the limit fails)
const LIMITS = {
  sharedPhrases: 0, // six-word phrases that appear in two or more different passages (quotes and echoes excepted)
  veryPer1000: 2.5, // "very" per thousand words
  greatDealPer1000: 0.6, // "a great deal", "a good deal"
  nobodyPer1000: 1.6, // "nobody", "no one"
  itIsAPer1000: 2.5, // sentences opening "It is a/an/the ..."
  sayingClosers: 15, // passages whose last sentence is a short saying
  sayingDetails: 5, // option details that are sayings
};

// A passage has a track (branch): a player sees one track, so two passages on different tracks are alternatives, not repetition. "ANY" is seen by every track.
const trackOfEnding = (id) => (/^ENDING_1/.test(id) ? "QUIET" : /^ENDING_2/.test(id) ? "COURT" : /^ENDING_3/.test(id) ? "STORM" : "ANY");
const passages = []; // { where, scene, track, text, kind }
const add = (where, scene, track, text, kind) => passages.push({ where, scene, track, text, kind });
const seenDecisionText = new Set();
for (const n of Object.values(events.nodes)) {
  const track = n.branch === "UNIVERSAL" ? "ANY" : n.branch;
  add(`${n.id} description`, n.id, track, n.description, "prose");
  n.options.forEach((o, i) => {
    const dup = decisionNodes.includes(n.id) && seenDecisionText.has(o.detail);
    if (decisionNodes.includes(n.id)) seenDecisionText.add(o.detail);
    if (!dup) {
      add(`${n.id}.${i} detail`, n.id, track, o.detail, "detail");
      if (o.outcome) add(`${n.id}.${i} outcome`, n.id, track, o.outcome, "prose");
    }
    if (o.roll) for (const r of ["success", "failure"]) add(`${n.id}.${i} ${r}`, n.id, track, o.roll[r].outcome, "prose");
  });
}
for (const e of Object.values(events.endings)) {
  add(`${e.id}`, e.id, trackOfEnding(e.id), e.text, "prose");
  (e.variants ?? []).forEach((v, i) => add(`${e.id} variant ${i}`, e.id, trackOfEnding(e.id), v.text, "prose"));
}
for (const it of Object.values(events.interludes)) add(`${it.id}`, it.id, "ANY", it.bodyText, "prose");
for (const p of flavor.prologue) add("prologue", "prologue", "ANY", p, "prose");
for (const r of Object.values(flavor.epilogueReadings)) add(`epilogue ${r.label}`, "epilogue", "ANY", r.epilogue, "prose");
const together = (a, b) => a.scene !== b.scene && !alternatives.some((g) => g.includes(a.scene) && g.includes(b.scene)) && (a.track === b.track || a.track === "ANY" || b.track === "ANY");

const words = (t) => t.toLowerCase().replace(/[‘’]/g, "'").match(/[a-z']+/g) ?? [];
const sentences = (t) => t.replace(/\s+/g, " ").split(/(?<=[.!?])\s+(?=[A-Z"“])/).filter(Boolean);
const total = passages.reduce((n, p) => n + words(p.text).length, 0);
const per1000 = (count) => (1000 * count) / total;
let failures = 0;
const over = (label, value, limit, fmt = (x) => x) => {
  const bad = value > limit;
  console.log(`${bad ? "!!" : "ok"} ${label}: ${fmt(value)} (limit ${limit})`);
  if (bad && strict) failures++;
};

console.log(`${passages.length} passages, ${total} words (${seat}).\n`);

// 1. phrases of five words that occur in more than one passage
const grams = new Map();
for (const p of passages) {
  const w = words(p.text);
  const seenHere = new Set();
  for (let i = 0; i + 6 <= w.length; i++) {
    const g = w.slice(i, i + 6).join(" ");
    if (seenHere.has(g)) continue;
    seenHere.add(g);
    grams.set(g, [...(grams.get(g) ?? []), p]);
  }
}
// recurring names for the same people and places are meant to repeat
const ALLOW = ["the three in the east wing"];
const shared = [...grams]
  .filter(([g]) => !ALLOW.some((a) => a.includes(g)))
  .filter(([, ps]) => ps.some((a, i) => ps.slice(i + 1).some((b) => together(a, b))))
  .map(([g, ps]) => [g, ps.map((p) => p.where)]);
// merge overlapping phrases: keep the first of each run
const reported = [];
for (const [g, where] of shared) if (!reported.some(([h]) => h.includes(g) || g.includes(h))) reported.push([g, where]);
over("six-word phrases used in more than one scene", reported.length, LIMITS.sharedPhrases);
reported.slice(0, 200).forEach(([g, where]) => console.log(`     "${g}": ${[...new Set(where)].slice(0, 4).join(", ")}`));

// 2. overused words and shapes
const all = passages.map((p) => p.text).join(" ");
const count = (re) => (all.match(re) ?? []).length;
over('"very"', per1000(count(/\bvery\b/gi)), LIMITS.veryPer1000, (x) => x.toFixed(1) + " per 1000 words");
over('"a great deal / a good deal"', per1000(count(/\ba (great|good) deal\b/gi)), LIMITS.greatDealPer1000, (x) => x.toFixed(1) + " per 1000");
over('"nobody / no one"', per1000(count(/\b(nobody|no one)\b/gi)), LIMITS.nobodyPer1000, (x) => x.toFixed(1) + " per 1000");
const sents = passages.flatMap((p) => sentences(p.text));
over('sentences opening "It is/was a, an, the"', per1000(sents.filter((s) => /^It (is|was) (a|an|the|not)\b/.test(s)).length), LIMITS.itIsAPer1000, (x) => x.toFixed(1) + " per 1000 words");
const openers = new Map();
for (const s of sents) {
  const w = s.split(/\s+/)[0].replace(/[^A-Za-z']/g, "");
  openers.set(w, (openers.get(w) ?? 0) + 1);
}
console.log("   most common first words: " + [...openers].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([w, n]) => `${w} ${((100 * n) / sents.length).toFixed(0)}%`).join(", "));

// 3. passages that close on a saying
const sayingCloser = (text) => {
  const ss = sentences(text);
  const last = ss[ss.length - 1] ?? "";
  const n = words(last).length;
  return ss.length > 1 && n <= 9 && /^(It is|It was|That is|That was|Nobody|No one|There is nothing|Whatever|You are not|You do not|He is|She is|What)\b/.test(last);
};
const closers = passages.filter((p) => p.kind === "prose" && sayingCloser(p.text));
over("passages that end on a short saying", closers.length, LIMITS.sayingClosers);
closers.slice(0, 30).forEach((p) => console.log(`     ${p.where}: "${sentences(p.text).slice(-1)[0]}"`));

// 4. option details that are sayings: short, no number or capitalised name, general words
const generalWord = /\b(a|an|the) (man|thing|house|story|city|door|word|town|hunter|mind|night|book|name|storm|court|doctor|servant|girl|woman)\b/i;
const sayings = passages.filter((p) => {
  if (p.kind !== "detail") return false;
  const w = words(p.text);
  const hasSpecific = /[0-9]/.test(p.text) || /\b[A-Z][a-z]+/.test(p.text.replace(/^[A-Z]/, "x"));
  return w.length <= 16 && !hasSpecific && (/^(A|An|The|Nobody|No one|Every|Anyone|Whatever|It|Fear|Patience|Money|Anger)\b/.test(p.text) || generalWord.test(p.text)) && /\b(is|are|does|do|can|will)\b/.test(p.text);
});
over("option details that read as sayings", sayings.length, LIMITS.sayingDetails);
sayings.slice(0, 60).forEach((p) => console.log(`     ${p.where}: "${p.text}"`));

if (failures) {
  console.error(`\nFAIL: ${failures} limit(s) passed. Rewrite the passages above (docs/WRITING.md), or raise a limit in this file with a reason.`);
  process.exit(1);
}
console.log("\nRepetition check done.");
