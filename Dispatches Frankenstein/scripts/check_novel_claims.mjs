// check_novel_claims.mjs: what the game says the novel does, claim by claim, against the 1818 text.
//
// claims/novel-notes.json lists the claims behind every "In the Novel" note (flavor.json novelNotes). A "fact" or "reading" claim carries a passage that must be
// in the chapter it names (or on the title page); an "absence" claim ("the book has no such scene") cannot be shown by a passage, so it carries how it was
// checked, and is counted but not proved. Also: every ending has at least one claim, and a "(Vol. X, ch. Y)" in a note must be one of that ending's claims.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT, loadNovel, norm } from "./lib/novel.mjs";

const file = JSON.parse(readFileSync(join(ROOT, "claims/novel-notes.json"), "utf8"));
const flavor = JSON.parse(readFileSync(join(ROOT, "src/content/frankenstein/flavor.json"), "utf8"));
const { whole, segments } = loadNovel();

let failures = 0;
const fail = (m) => {
  failures++;
  console.error("FAIL: " + m);
};
const counts = { fact: 0, reading: 0, absence: 0 };
for (const c of file.claims) {
  const tag = `${c.ending}: "${c.claim.slice(0, 50)}"`;
  if (!(c.kind in counts)) {
    fail(`${tag}: unknown kind "${c.kind}"`);
    continue;
  }
  counts[c.kind]++;
  if (!flavor.novelNotes[c.ending]) fail(`${tag}: ${c.ending} has no novelNote`);
  if (c.kind === "absence") {
    if (!c.how) fail(`${tag}: an absence claim says how it was checked`);
    continue;
  }
  const wanted = norm(c.evidence ?? "");
  if (wanted.length < 12) fail(`${tag}: evidence is too short to prove anything`);
  if (c.where === "title page") {
    if (!whole.includes(wanted)) fail(`${tag}: not found in the book`);
    continue;
  }
  const seg = segments.find((s) => s.label === c.where);
  if (!seg) fail(`${tag}: no such place "${c.where}"`);
  else if (!seg.text.includes(wanted)) fail(`${tag}: not in ${c.where}: "${c.evidence}"`);
}
for (const [id, note] of Object.entries(flavor.novelNotes)) {
  const mine = file.claims.filter((c) => c.ending === id);
  if (!mine.length) fail(`${id}: its novelNote has no claims in claims/novel-notes.json`);
  for (const m of note.matchAll(/\((Vol\. [IVX]+, ch\. \d+|Letter \d+)\)/g)) {
    if (!mine.some((c) => c.where === m[1])) fail(`${id}: the note cites ${m[1]}, which none of its claims names`);
  }
}
console.log(`novel claims: ${counts.fact} facts and ${counts.reading} readings checked against the 1818 text; ${counts.absence} absences listed for a reader to confirm.`);
if (failures) process.exit(1);
console.log("Novel claims look sound.");
