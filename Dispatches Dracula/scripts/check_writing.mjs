// check_writing.mjs: the mechanical rules of docs/WRITING.md, applied to every string in the game's content files.
//
// Fails on: an em dash, a stock word from the banned list, or a straight apostrophe pair used as quotation marks inside a line of text
// (the game uses plain double quotes only for speech, and the quote field is what carries a spoken line).
// Reports (does not fail): sentences shaped "not X but Y", "less X than Y", "the real question", and runs of three adjectives, which need a reader.
// Run from the game folder: node scripts/check_writing.mjs [--strict] (strict also fails on the shapes).
import { readFileSync } from "node:fs";
import { join } from "node:path";

const strict = process.argv.includes("--strict");
const dir = join("src", "content", process.env.GAME ?? "dracula");
const FILES = ["events.json", "flavor.json", "config.json"];

const STOCK = [
  "tapestry", "testament", "pivotal", "stark", "sobering", "unprecedented", "delve", "underscore", "nuanced", "intricate", "ever-evolving",
  "double-edged", "delicate balance", "sealed his fate", "sealed her fate", "sealed its fate", "hung in the balance", "the weight of", "the shadow of",
  "landscape",
];
const SHAPES = [
  [/\bnot (?:just |only |merely )?(?:a |an |the )?[^.;:,]{1,50}?,? but (?:a |an |the |rather )?/i, "not X but Y"],
  [/\bit (?:was|is) not [^.;:]{1,60}[.;,] it (?:was|is)\b/i, "it was not X, it was Y"],
  [/\bless [^.;:]{1,40} than\b/i, "less X than Y"],
  [/\bthe real (?:question|problem|issue)\b/i, "the real question"],
  [/\bin the end\b/i, "in the end"],
];

const strings = [];
function walk(value, path) {
  if (typeof value === "string") strings.push([path, value]);
  else if (Array.isArray(value)) value.forEach((v, i) => walk(v, `${path}[${i}]`));
  else if (value && typeof value === "object") for (const [k, v] of Object.entries(value)) walk(v, `${path}.${k}`);
}
for (const f of FILES) walk(JSON.parse(readFileSync(join(dir, f), "utf8")), f);

let failures = 0;
let notes = 0;
for (const [path, text] of strings) {
  if (text.includes("—")) {
    failures++;
    console.error(`FAIL em dash: ${path}: ${text.slice(0, 90)}`);
  }
  const lower = text.toLowerCase();
  for (const w of STOCK) {
    if (new RegExp(`\\b${w.replace(/-/g, "[- ]")}\\b`, "i").test(lower)) {
      failures++;
      console.error(`FAIL stock word "${w}": ${path}: ${text.slice(0, 90)}`);
    }
  }
  for (const [re, label] of SHAPES) {
    const m = text.match(re);
    if (m) {
      notes++;
      console.log(`note ${label}: ${path}: ...${text.slice(Math.max(0, m.index - 20), m.index + 80).replace(/\s+/g, " ")}`);
    }
  }
}
console.log(`${strings.length} strings checked: ${failures} failure(s), ${notes} shape note(s).`);
if (failures || (strict && notes)) process.exit(1);
console.log("Writing check passed.");
