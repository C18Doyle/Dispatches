// find_in_novel.mjs: which chapters contain a passage, with a little context.   node scripts/find_in_novel.mjs "passage" ["another" ...]
// Case, quotation marks and dashes do not matter. Prints the chapter numbers and up to two snippets for each passage.
import { loadNovel, normalise } from "./lib/novel.mjs";

const { chapters } = loadNovel();
for (const q of process.argv.slice(2)) {
  const p = normalise(q);
  const hits = [];
  for (const [n, t] of Object.entries(chapters)) {
    let i = t.indexOf(p);
    let k = 0;
    while (i >= 0 && k < 2) {
      hits.push(`  ch ${n}: ...${t.slice(Math.max(0, i - 90), i + p.length + 110)}...`);
      i = t.indexOf(p, i + p.length);
      k++;
    }
  }
  console.log(`\n"${q}": ${hits.length ? hits.length + " hit(s)" : "NOT FOUND"}`);
  hits.slice(0, 5).forEach((h) => console.log(h));
}
