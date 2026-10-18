/** Short interface copy. A note or a subtitle on a screen (a paragraph of class dg-note, dg-sub or dg-demo-note whose text is written out in the source) stays under
 *  seventeen words: the screens say what they have to and no more. The how-to text and the list of what the game leaves out (src/66-briefings.jsx) are the places for
 *  longer explanation, and the reports themselves are not interface copy. */
const fs = require("fs");
const path = require("path");
const { report } = require("./_load.js");

const MAX = 16;
const problems = [];
let checked = 0;
const dir = path.join(__dirname, "src");
for (const f of fs.readdirSync(dir).filter((x) => /^9[0-9]-.*\.jsx$/.test(x))) {
  const s = fs.readFileSync(path.join(dir, f), "utf8");
  const re = /<(?:p|div|span)[^>]*className="(?:dg-note|dg-sub|dg-demo-note)[^"]*"[^>]*>([^<]{12,})</g;
  let m;
  while ((m = re.exec(s))) {
    if (/[`$]/.test(m[1])) continue; // built from the file's state, and counted where it is written
    checked++;
    const text = m[1].replace(/\{[^}]*\}/g, "X").replace(/\s+/g, " ").trim();
    const words = text.split(" ").length;
    if (words > MAX) problems.push(`${f}:${s.slice(0, m.index).split("\n").length}: a note of ${words} words (the limit is ${MAX}): ${text.slice(0, 90)}`);
  }
}
process.exit(report("check-ui-copy", problems, checked) ? 1 : 0);
