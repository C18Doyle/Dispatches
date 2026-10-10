// The 1818 text of the novel (claims/source/frankenstein-1818.txt, Project Gutenberg #41445), split into its letters and chapters.
// Shared by check_quotations.mjs and check_novel_claims.mjs.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

/** Quotation marks, dashes and whitespace flattened, so a quotation compares with the book however either is typeset. */
export const norm = (t) => t.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[—–]/g, "-").replace(/\s+/g, " ").trim();

const ROMAN = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7, VIII: 8, IX: 9 };

/**
 * { whole, segments: [{ label, text }] }. Labels are "Letter 4" and "Vol. II, ch. 2" (the 1818 edition's own volumes and
 * chapters; the 1831 text numbers them differently). `whole` is the entire file, normalised, for the title page.
 */
export function loadNovel() {
  const raw = readFileSync(join(ROOT, "claims/source/frankenstein-1818.txt"), "utf8").replace(/\r\n/g, "\n");
  const segments = [];
  let vol = 0;
  let current = null;
  for (const l of raw.split("\n")) {
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
  return { whole: norm(raw), segments };
}
