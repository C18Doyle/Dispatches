// check_fonts.mjs: the embedded fonts (src/fonts) are cut down to the characters in src/fonts/_chars.txt. This fails if any story, label or interface text uses a
// character that is not in that set (it would fall back to another font), so a new "é" or "§" is noticed before release. Fix: add the character to _chars.txt and run
// `node scripts/fetch_fonts.mjs`. Run from the game folder.
import { readFileSync } from "node:fs";

const have = new Set(readFileSync("src/fonts/_chars.txt", "utf8"));
const missing = new Map();
const scan = (v, where) => {
  if (typeof v === "string") {
    for (const ch of v) if (ch !== "\n" && ch !== "\r" && ch !== "\t" && !have.has(ch)) missing.set(ch, [...(missing.get(ch) ?? []), where].slice(0, 3));
  } else if (Array.isArray(v)) v.forEach((x, i) => scan(x, `${where}[${i}]`));
  else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) scan(x, `${where}.${k}`);
};
for (const seat of ["dracula", "mina"]) for (const f of ["config", "events", "flavor", "ui", "book"]) scan(JSON.parse(readFileSync(`src/content/${seat}/${f}.json`, "utf8")), `${seat}/${f}`);
if (missing.size) {
  for (const [ch, where] of missing) console.error(`missing glyph U+${ch.codePointAt(0).toString(16).toUpperCase().padStart(4, "0")} "${ch}": ${where.join(", ")}`);
  console.error("FAIL: the embedded fonts do not cover these characters (add them to src/fonts/_chars.txt and run node scripts/fetch_fonts.mjs).");
  process.exit(1);
}
console.log(`Fonts check passed: every character in the content (${have.size} in the set) is in the embedded fonts.`);
