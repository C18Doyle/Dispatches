// check-glossary.mjs: the glossary is data the reader sees underlined. Fails on a duplicate term, an entry with no text or an unknown group, a term
// that appears in no report text (a dead entry; the "game" terms and `listOnly` terms are exempt), and a report whose first paragraph underlines more than 12 terms.
// Usage: node tools/check-glossary.mjs
import { createRequire } from "node:module";
import { loadFromJsx } from "../../packages/testkit/src/load-campaigns.mjs";
import { loadGame } from "./audit-lib.mjs";

const esbuild = createRequire(import.meta.url)("esbuild");
const g = loadFromJsx(esbuild, "src/App.jsx", ["GLOSSARY", "GLOSSARY_GROUPS", "glossarySpans"]);
const game = await loadGame();
const problems = [];
const groups = new Set(g.GLOSSARY_GROUPS.map((x) => x.id));
const seenTerms = new Set();
for (const e of g.GLOSSARY) {
  const all = [e.term, ...(e.also || [])];
  for (const t of all) {
    if (seenTerms.has(t)) problems.push(`duplicate term: ${t}`);
    seenTerms.add(t);
  }
  if (!e.text || e.text.length < 20) problems.push(`no real text for ${e.term}`);
  if (!groups.has(e.group)) problems.push(`unknown group for ${e.term}: ${e.group}`);
  if (/—/.test(e.text)) problems.push(`em dash in ${e.term}`);
}
// every text a reader sees
const texts = [];
for (const [cid, camp] of Object.entries(game.CAMPAIGNS)) {
  for (const a of game.NODE_ATLAS[cid] || []) {
    for (const flags of [{}]) {
      let st;
      try {
        st = camp.resolveNode(a.id, flags, { readiness: 0, pipeline: 0, initiative: 0 });
      } catch {
        continue;
      }
      if (!st) continue;
      texts.push(st.situation);
      for (const c of st.choices || []) texts.push(c.outcome || "", ...(c.uncertain || []).map((u) => u.outcome || ""));
    }
  }
}
const used = new Set();
let worst = 0;
for (const t of texts) {
  const spans = g.glossarySpans(t || "");
  spans.forEach((s) => used.add(s.idx));
  if ((t || "").length && spans.length > worst) worst = spans.length;
}
g.GLOSSARY.forEach((e, i) => {
  if (e.group !== "game" && !e.listOnly && !used.has(i)) problems.push(`never underlined in any report: ${e.term}`);
});
console.log(`Glossary: ${g.GLOSSARY.length} terms in ${g.GLOSSARY_GROUPS.length} groups, ${used.size} used in the reports, at most ${worst} underlined in one passage.`);
if (worst > 12) problems.push(`one passage underlines ${worst} terms (limit 12)`);
if (problems.length) {
  console.log(problems.map((p) => "  " + p).join("\n"));
  process.exit(1);
}
console.log("Glossary check passed.");
