#!/usr/bin/env node
/*
 * check-quotations.js
 *
 * Advisers on a choice carry `position`: what the named person argued, in the third person. They never
 * carry invented speech, so there is no `quote` field. A choice may also carry one `attested` line,
 * words a named person is on record as having said or written, shown on screen as "On the record" with
 * its source. Rules this check enforces on the campaign parts in src/parts:
 *
 *   1. No `{ name, quote }` adviser anywhere (a regression to invented speech).
 *   2. Every adviser has a non-empty `position`.
 *   3. Every `attested` has `by`, `text` and `source`; the text is 25 words or fewer; `by` is the adviser
 *      shown on the same choice.
 *   4. Every `attested` is in claims/quotations.json with the same node, speaker, text and source, and a
 *      status of "primary" or "secondary". The register carries a note saying what a fact-checker should
 *      open. An entry the game no longer uses is flagged too.
 *
 * `--selftest` (always run first) proves the check fails on a fake quotation, an unlogged one, a
 * mismatched source, a speaker who is not the adviser, and a regression to `quote`.
 *
 * Usage: node tools/check-quotations.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const PARTS = ["10-campaign-german", "11-campaign-soviet", "12-campaign-allied", "13-campaign-italy"];
const STR = '"(?:[^"\\\\]|\\\\.)*"';
const STATUSES = new Set(["primary", "secondary"]);

function check(sources, register) {
  const problems = [];
  const found = [];
  let advisers = 0;
  for (const [file, src] of Object.entries(sources)) {
    const nodeAt = (idx) => {
      const all = [...src.slice(0, idx).matchAll(/\n\s+get (\w+)\(\) \{/g)];
      return all.length ? all[all.length - 1][1] : "?";
    };
    for (const m of src.matchAll(new RegExp("\\{ name: " + STR + ", quote: " + STR + " \\}", "g"))) {
      problems.push(`${file}: invented speech: ${m[0].slice(0, 70)}... (advisers carry position, not quote)`);
    }
    for (const m of src.matchAll(new RegExp("\\{ name: (" + STR + "), position: (" + STR + ") \\}", "g"))) {
      advisers++;
      if (!JSON.parse(m[2]).trim()) problems.push(`${file}: empty position for ${JSON.parse(m[1])}`);
    }
    for (const m of src.matchAll(new RegExp("attested: \\{ by: (" + STR + "), text: (" + STR + "), source: (" + STR + ") \\}", "g"))) {
      const by = JSON.parse(m[1]);
      const text = JSON.parse(m[2]);
      const source = JSON.parse(m[3]);
      const node = nodeAt(m.index);
      found.push({ file, node, by, text, source });
      const where = `${file} ${node}`;
      if (!by.trim() || !text.trim() || !source.trim()) problems.push(`${where}: attested needs by, text and source`);
      if (text.trim().split(/\s+/).length > 25) problems.push(`${where}: attested text over 25 words; quote the fragment that matters`);
      const before = src.slice(Math.max(0, m.index - 900), m.index);
      const adv = [...before.matchAll(new RegExp("advisor: \\{ name: (" + STR + ")", "g"))].pop();
      if (!adv || JSON.parse(adv[1]) !== by) problems.push(`${where}: attested speaker "${by}" is not the adviser shown on that choice`);
      const entry = register.find((r) => r.text === text);
      if (!entry) problems.push(`${where}: "${text}" is not logged in claims/quotations.json`);
      else {
        if (entry.node !== node) problems.push(`${where}: register says node ${entry.node}`);
        if (entry.by !== by) problems.push(`${where}: register says speaker ${entry.by}`);
        if (entry.source !== source) problems.push(`${where}: register source differs from the one on screen`);
        if (!STATUSES.has(entry.status)) problems.push(`${where}: register status must be primary or secondary`);
        if (!entry.note || entry.note.length < 20) problems.push(`${where}: register note should say what to open to verify`);
      }
    }
  }
  for (const r of register) if (!found.some((f) => f.text === r.text)) problems.push(`claims/quotations.json: "${r.text.slice(0, 50)}" is not used in the game`);
  return { problems, found, advisers };
}

function selftest(sources, register) {
  const first = Object.keys(sources)[0];
  const real = register[0];
  const cases = [];
  const plus = (extra) => ({ ...sources, [first]: sources[first] + "\n" + extra });
  const att = (by, text, source) => `advisor: { name: ${JSON.stringify(by)}, position: "x" },\n attested: { by: ${JSON.stringify(by)}, text: ${JSON.stringify(text)}, source: ${JSON.stringify(source)} }`;
  cases.push(["a fake quotation", check(plus(att("Rommel", "We shall win because we must.", "Somewhere")), register)]);
  cases.push(["an unlogged real-looking quotation", check(plus(att("Churchill", "We shall never surrender.", "House of Commons, 4 June 1940")), register)]);
  cases.push(["a source that differs from the register", check(plus(att(real.by, real.text, "A memoir, p. 1")), register)]);
  cases.push(["a speaker who is not the adviser", check(plus(`advisor: { name: "Halder", position: "x" },\n attested: { by: ${JSON.stringify(real.by)}, text: ${JSON.stringify(real.text)}, source: ${JSON.stringify(real.source)} }`), register)]);
  cases.push(["an over-long quotation", check(plus(att("Rommel", new Array(30).fill("word").join(" "), "x")), register)]);
  cases.push(["a regression to quote", check(plus(`{ name: "Halder", quote: "I would rather win in October." }`), register)]);
  let bad = 0;
  for (const [what, r] of cases) {
    if (!r.problems.length) {
      console.log(`!! selftest: the check did not fail on ${what}`);
      bad++;
    }
  }
  return bad;
}

const sources = {};
for (const p of PARTS) sources[p + ".jsx"] = fs.readFileSync(path.join(ROOT, "src/parts", p + ".jsx"), "utf8");
const register = JSON.parse(fs.readFileSync(path.join(ROOT, "claims/quotations.json"), "utf8"));

const bad = selftest(sources, register);
const { problems, found, advisers } = check(sources, register);
const secondary = register.filter((r) => r.status === "secondary").length;
console.log(`advisers with a position: ${advisers}`);
console.log(`attested quotations: ${found.length} (${register.length - secondary} primary, ${secondary} secondary: wording relayed by a secondary source, see the register notes)`);
console.log(`selftest: ${bad ? "FAILED" : "the check fails on fakes, unlogged and mismatched quotations"}`);
if (advisers < 500) problems.push(`only ${advisers} advisers found; the pattern or the parts changed`);
if (bad || problems.length) {
  for (const p of problems) console.log("!! " + p);
  process.exit(1);
}
console.log("\nQuotations look sound.");
