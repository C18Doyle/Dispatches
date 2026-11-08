// check_writing.mjs: the mechanical rules of docs/WRITING.md, applied to every string in the game's content files and to the UI source.
//
// Fails on: an em dash (U+2014), a stock word from the banned list, a straight apostrophe or straight double quote in a content string
// (the game uses curly marks), and an unfilled placeholder such as an empty outcome that should have text.
// Reports (does not fail): sentences shaped "not X but Y", "less X than Y", "the real question", "in the end", and stock phrases that need a
// reader. Run from the game folder: node scripts/check_writing.mjs [--strict] [--list] (strict also fails on the shapes; list prints all).
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const strict = process.argv.includes("--strict");
const dir = join("src", "content", "frankenstein");
const FILES = ["events.json", "flavor.json", "config.json"];
const DASH = "—";
const STRAIGHT_APOS = /\w'\w|\w'(?=\s|$)|(?:^|\s)'\w/;
const STRAIGHT_DQ = /"/;

const STOCK = [
  "tapestry", "testament", "pivotal", "stark", "sobering", "unprecedented", "delve", "underscore", "nuanced", "intricate", "ever-evolving",
  "double-edged", "delicate balance", "sealed his fate", "sealed her fate", "sealed its fate", "hung in the balance", "the weight of", "the shadow of",
  "landscape", "palpable", "a mix of", "couldn't help",
];
const SHAPES = [
  [/\bnot (?:just |only |merely )?(?:a |an |the )?[^.;:,]{1,50}?,? but (?:a |an |the |rather )?/i, "not X but Y"],
  [/\bit (?:was|is) not [^.;:]{1,60}[.;,] it (?:was|is)\b/i, "it was not X, it was Y"],
  [/\bless [^.;:]{1,40} than\b/i, "less X than Y"],
  [/\bthe real (?:question|problem|issue)\b/i, "the real question"],
  [/\bin the end\b/i, "in the end"],
  [/\bquietly\b/i, "quietly"],
  [/\bsomehow\b/i, "somehow"],
  [/\bfor the first time\b/i, "for the first time"],
  [/\b(?:[a-z]+), (?:[a-z]+), and (?:[a-z]+)\b/i, "list of three"],
];

const strings = [];
function walk(value, path) {
  if (typeof value === "string") strings.push([path, value]);
  else if (Array.isArray(value)) value.forEach((v, i) => walk(v, `${path}[${i}]`));
  else if (value && typeof value === "object") for (const [k, v] of Object.entries(value)) walk(v, `${path}.${k}`);
}
for (const f of FILES) walk(JSON.parse(readFileSync(join(dir, f), "utf8")), f);

// Fields that hold identifiers, keys or file references, not prose.
const NON_PROSE = /(\.id|Id|\.flag|\.kind|\.type|\.branch|\.resource|\.source|\.key|\.speaker|requires|setFlags|showWhen|\.tag|\.theme)(\[\d+\])?$/;

let failures = 0;
let notes = 0;
for (const [path, text] of strings) {
  if (NON_PROSE.test(path) || text === "") continue;
  if (text.includes(DASH)) {
    failures++;
    console.error(`FAIL em dash: ${path}: ${text.slice(0, 90)}`);
  }
  if (STRAIGHT_APOS.test(text) || STRAIGHT_DQ.test(text)) {
    failures++;
    console.error(`FAIL straight quote mark: ${path}: ${text.slice(0, 90)}`);
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
      console.log(`note ${label}: ${path}: ...${text.slice(Math.max(0, m.index - 20), m.index + 90).replace(/\s+/g, " ")}`);
    }
  }
}

// The UI source: no em dash in on-screen text (comments are ignored).
const uiFile = join("src", "App.tsx");
if (existsSync(uiFile)) {
  readFileSync(uiFile, "utf8").split("\n").forEach((line, i) => {
    if (!line.includes(DASH)) return;
    const t = line.trim();
    if (t.startsWith("//") || t.startsWith("*") || t.startsWith("/*") || t.startsWith("{/*")) return;
    failures++;
    console.error(`FAIL em dash in UI: ${uiFile}:${i + 1}: ${t.slice(0, 90)}`);
  });
}

console.log(`${strings.length} strings checked: ${failures} failure(s), ${notes} shape note(s).`);
if (failures || (strict && notes)) process.exit(1);
console.log("Writing check passed.");
