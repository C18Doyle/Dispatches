// novel.mjs: the 1897 text of Dracula (Project Gutenberg #345, claims/source/dracula-1897.txt), split into chapters and normalised for searching.
// Used by check_quotations.mjs, check_novel_claims.mjs and scripts/find_in_novel.mjs. Pure text handling; nothing in the file is ever executed.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
export const NOVEL_PATH = join(HERE, "..", "..", "claims", "source", "dracula-1897.txt");

const ROMAN = { I: 1, V: 5, X: 10, L: 50 };
export function fromRoman(s) {
  let n = 0;
  for (let i = 0; i < s.length; i++) {
    const v = ROMAN[s[i]];
    n += v < (ROMAN[s[i + 1]] ?? 0) ? -v : v;
  }
  return n;
}

/** Quotation marks, apostrophes and dashes made plain; runs of whitespace made one space; lower case. */
export function normalise(text) {
  return text
    .replace(/[‘’‛]/g, "'")
    .replace(/[“”„]/g, '"')
    .replace(/[–—―]/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/ /g, " ")
    .replace(/_/g, "")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .trim();
}

let cache;
/** { chapters: { 1: normalised text, ... 27 }, whole: normalised text of every chapter } */
export function loadNovel() {
  if (cache) return cache;
  const raw = readFileSync(NOVEL_PATH, "utf8").replace(/\r\n/g, "\n");
  const lines = raw.split("\n");
  // chapter headings in the body are a line that is only "CHAPTER <roman>" (the contents list has the title on the same line)
  const starts = [];
  lines.forEach((l, i) => {
    const m = l.match(/^CHAPTER ([IVXL]+)\s*$/);
    if (m) starts.push({ n: fromRoman(m[1]), at: i });
  });
  const end = lines.findIndex((l) => /^\*\*\* END OF THE PROJECT GUTENBERG EBOOK/.test(l));
  const chapters = {};
  starts.forEach((s, k) => {
    const to = k + 1 < starts.length ? starts[k + 1].at : end > 0 ? end : lines.length;
    chapters[s.n] = normalise(lines.slice(s.at + 1, to).join(" "));
  });
  cache = { chapters, whole: normalise(Object.values(chapters).join(" ")) };
  return cache;
}

/** The chapters (numbers) whose text contains the passage, after normalising it. */
export function chaptersWith(passage) {
  const { chapters } = loadNovel();
  const p = normalise(passage);
  return Object.entries(chapters).filter(([, t]) => t.includes(p)).map(([n]) => Number(n));
}

export const ROMAN_NUMERALS = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI", "XXII", "XXIII", "XXIV", "XXV", "XXVI", "XXVII"];
