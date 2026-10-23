// check_novel_claims.mjs: every statement the game makes about the novel is held to the 1897 text.
//   node scripts/check_novel_claims.mjs
// claims/novel-notes.json lists each fact with the passage(s) that show it and the chapter they are in; each passage must be found there (case, quotation marks and
// dashes ignored). An absence claim lists terms that must not occur anywhere in the text. A claim a passage cannot show is listed as "to be confirmed by a reader"
// and is only reported. Fails if a passage is missing or in a different chapter, or if an absent term occurs.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { chaptersWith, loadNovel, normalise } from "./lib/novel.mjs";

const claims = JSON.parse(readFileSync(join("claims", "novel-notes.json"), "utf8"));
const { whole } = loadNovel();
let failures = 0;
const fail = (m) => {
  failures++;
  console.error("FAIL: " + m);
};

let passages = 0;
for (const c of claims.facts) {
  if (!c.passages?.length) {
    fail(`${c.id}: a fact needs at least one passage`);
    continue;
  }
  for (const p of c.passages) {
    passages++;
    const where = chaptersWith(p.text);
    if (!where.length) fail(`${c.id}: not in the novel: "${p.text}"`);
    else if (!where.includes(p.chapter)) fail(`${c.id}: "${p.text.slice(0, 60)}..." is in chapter ${where.join(", ")}, not ${p.chapter}`);
  }
}
let unconfirmed = 0;
for (const a of claims.absences) {
  for (const t of a.absent ?? []) if (whole.includes(normalise(t))) fail(`${a.id}: the term "${t}" occurs in the novel, so the absence claim is wrong`);
  if (!(a.absent ?? []).length) {
    unconfirmed++;
    console.log(`note ${a.id}: to be confirmed by a reader: ${a.claim}`);
  }
}
// the book's road (src/content/dracula/book.json) rests on these claims: every scene and option it names must exist, and every claim it cites must be here
const book = JSON.parse(readFileSync(join("src", "content", "dracula", "book.json"), "utf8"));
const events = JSON.parse(readFileSync(join("src", "content", "dracula", "events.json"), "utf8"));
const factIds = new Set(claims.facts.map((c) => c.id));
for (const [scene, r] of Object.entries(book.road)) {
  if (!events.nodes[scene]) fail(`book road: no scene ${scene}`);
  else for (const i of r.options) if (!events.nodes[scene].options[i]) fail(`book road: scene ${scene} has no option ${i}`);
  if (!factIds.has(r.claim)) fail(`book road: scene ${scene} cites the claim "${r.claim}", which is not in claims/novel-notes.json`);
}
console.log(`${Object.keys(book.road).length} scenes on the book's road checked.`);
console.log(`${claims.facts.length} facts (${passages} passages) and ${claims.absences.length} absence claims checked against the text; ${unconfirmed} left for a reader.`);
if (failures) process.exit(1);
console.log("Novel claims check passed.");
