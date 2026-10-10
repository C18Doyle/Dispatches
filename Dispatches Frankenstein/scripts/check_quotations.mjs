// check_quotations.mjs: every line the game marks as Mary Shelley's own must be in her book, in the place it says.
//
// A quotation in events.json is `imagined` unless it carries kind "novel", a `source` ("Vol. I, ch. 4": the 1818 text's own volumes and chapters, or
// "Letter 4") and a speaker the novel gives the words to (Victor or The Creature). For each "novel" line this finds the text in
// claims/source/frankenstein-1818.txt (Project Gutenberg #41445, public domain; whitespace, quotation marks and dashes are normalised before comparing) and
// checks it falls in the chapter named by `source`. An imagined line may not carry a source. Also reports how many lines are real and how many are not.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const events = JSON.parse(readFileSync(join(ROOT, "src/content/frankenstein/events.json"), "utf8"));
const raw = readFileSync(join(ROOT, "claims/source/frankenstein-1818.txt"), "utf8").replace(/\r\n/g, "\n");

const norm = (t) => t.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[—–]/g, "-").replace(/\s+/g, " ").trim();
const ROMAN = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7, VIII: 8, IX: 9 };

// The novel's text only: from the first letter to the end of the third volume's last chapter, split by volume and chapter.
const lines = raw.split("\n");
const segments = [];
let vol = 0;
let current = null;
for (const l of lines) {
  if (/^\s*VOL\. I\.?\s*$/i.test(l)) vol = 1;
  else if (/^\s*VOL\. II\.?\s*$/i.test(l)) vol = 2;
  else if (/^\s*VOL\. III\.?\s*$/i.test(l)) vol = 3;
  const m = /^\s*(CHAPTER|LETTER) ([IVX]+)\.?\s*$/i.exec(l);
  if (m) {
    const n = ROMAN[m[2].toUpperCase()];
    current = { label: m[1].toUpperCase() === "LETTER" ? `Letter ${n}` : `Vol. ${"I".repeat(vol)}, ch. ${n}`, text: "" };
    segments.push(current);
  } else if (current) current.text += l + "\n";
}
if (segments.length < 27) {
  console.error(`could not read the book's chapters from claims/source/frankenstein-1818.txt (found ${segments.length}, expected the 4 letters and 23 chapters)`);
  process.exit(2);
}
for (const s of segments) s.text = norm(s.text);

let failures = 0;
const fail = (m) => {
  failures++;
  console.error("FAIL: " + m);
};
let real = 0;
let imagined = 0;
for (const [id, node] of Object.entries(events.nodes)) {
  node.options.forEach((o, i) => {
    const q = o.quote;
    const where = `${id}[${i}] (${q.speaker})`;
    if (q.kind !== "novel") {
      imagined++;
      if (q.source) fail(`${where}: an imagined line may not carry a source`);
      return;
    }
    real++;
    if (!q.source) return fail(`${where}: a novel quotation needs a source`);
    if (!["Victor", "The Creature"].includes(q.speaker)) fail(`${where}: the novel gives these words to Victor or the creature, not "${q.speaker}"`);
    const wanted = norm(q.text);
    if (wanted.length < 25) fail(`${where}: a quotation of fewer than 25 characters proves nothing`);
    const hits = segments.filter((s) => s.text.includes(wanted));
    if (!hits.length) return fail(`${where}: not found in the book: "${q.text.slice(0, 70)}"`);
    if (!hits.some((s) => s.label === q.source)) fail(`${where}: found in ${hits.map((s) => s.label).join(" and ")}, not in "${q.source}"`);
  });
}
console.log(`quotations: ${real} lines are Mary Shelley's (checked against the 1818 text), ${imagined} are imagined.`);
if (failures) process.exit(1);
console.log("Quotations look sound.");
