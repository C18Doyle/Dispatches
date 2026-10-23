// check_quotations.mjs: a choice's quotation marked as Stoker's own must be his.
//   node scripts/check_quotations.mjs
// For every quote of kind "novel" in the Count's seat (src/content/dracula/events.json) and in Mina's, the words must appear in the 1897 text, in the chapter named in
// `source` ("Chapter II"), and the speaker must be one the novel gives the words to. Imagined quotes carry no kind and are not checked (the how-to page says which is which).
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ROMAN_NUMERALS, chaptersWith } from "./lib/novel.mjs";

const SPEAKERS = new Set(["The Count", "Jonathan Harker", "Mina", "Renfield", "Van Helsing", "Dr Seward", "Lucy", "Captain's log", "Mr Swales", "Old Mr Swales"]);
let failures = 0;
let checked = 0;
const fail = (m) => {
  failures++;
  console.error("FAIL: " + m);
};
for (const seat of ["dracula", "mina"]) {
  const events = JSON.parse(readFileSync(join("src", "content", seat, "events.json"), "utf8"));
  for (const node of Object.values(events.nodes)) {
    node.options.forEach((o, i) => {
      const q = o.quote;
      if (q.kind !== "novel") return;
      checked++;
      const where = `${seat} ${node.id} option ${i}`;
      const m = /^Chapter ([IVXL]+)$/.exec(q.source ?? "");
      if (!m) return fail(`${where}: a novel quote needs a source like "Chapter II" (got "${q.source}")`);
      const chapter = ROMAN_NUMERALS.indexOf(m[1]);
      if (chapter < 1) return fail(`${where}: "${q.source}" is not a chapter of the novel`);
      if (!SPEAKERS.has(q.speaker)) fail(`${where}: "${q.speaker}" is not a speaker the check knows; add one only if the novel gives these words to that person`);
      const found = chaptersWith(q.text);
      if (!found.length) fail(`${where}: not in the novel: "${q.text}"`);
      else if (!found.includes(chapter)) fail(`${where}: the words are in chapter ${found.join(", ")}, not ${chapter}`);
    });
  }
}
console.log(`${checked} novel quotation(s) checked against the 1897 text.`);
if (failures) process.exit(1);
console.log("Quotations check passed.");
