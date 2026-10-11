/** The glossary (60-glossary.jsx).
 *  Every term has a definition and an id; none is defined twice; every term is used in the story text at least once (so a dead entry is
 *  noticed); and a term is found by the same rule the game uses (whole word, first mention). Text read: every node's situation, context,
 *  title, epilogue and each choice's outcome and aftermath, with function-valued prose evaluated on empty flags. */
const { loadEngine, report, fileArg } = require("./_load.js");
const E = loadEngine(fileArg());

const problems = [];
let checked = 0;

const ids = new Set();
const terms = new Set();
for (const g of E.GLOSSARY) {
  checked++;
  if (!g.id || !g.term) problems.push(`entry without an id or term: ${JSON.stringify(g).slice(0, 60)}`);
  if (typeof g.def !== "string" || g.def.length < 25) problems.push(`${g.id}: definition missing or too short`);
  if (g.def && /\s—\s|—/.test(g.def)) problems.push(`${g.id}: a dash in the definition (the writing rules keep dashes out of on-screen text)`);
  if (ids.has(g.id)) problems.push(`${g.id}: defined twice`);
  ids.add(g.id);
  if (terms.has(g.term.toLowerCase())) problems.push(`${g.term}: two entries for the same term`);
  terms.add(g.term.toLowerCase());
}

const texts = [];
const add = (v) => {
  if (typeof v === "function") {
    try { v = v({}, E.emptyMeters(), {}); } catch (e) { return; }
  }
  if (typeof v === "string") texts.push(v);
  else if (v && typeof v === "object") {
    for (const k of Object.keys(v)) if (k !== "gate" && k !== "nextIf") add(v[k]);
  }
};
for (const cid of E.CAMPAIGN_IDS) {
  const c = E.CAMPAIGNS[cid];
  for (const n of Object.values(c.nodes)) {
    for (const k of ["title", "situation", "context", "epilogue"]) add(n[k]);
    for (const ch of n.choices || []) {
      add(ch.outcome);
      add(ch.aftermath);
      for (const b of ch.uncertain || []) { add(b.outcome); add(b.aftermath); }
    }
  }
}
const all = texts.join("\n");
for (const g of E.GLOSSARY) {
  checked++;
  const esc = g.term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`(^|[^\\p{L}\\p{N}_-])(${g.match || esc})(?![\\p{L}\\p{N}_-])`, g.ci ? "iu" : "u");
  if (!re.test(all)) problems.push(`${g.id}: "${g.term}" is not used in any story text (remove it, or fix its match)`);
}

for (const p of E.LEAVES_OUT) {
  checked++;
  if (/—/.test(p)) problems.push("a dash in LEAVES_OUT");
}

process.exit(report("check-glossary", problems, checked) ? 1 : 0);
