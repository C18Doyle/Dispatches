#!/usr/bin/env node
/*
 * extract-claims.js
 *
 * Source-verifying 189 nodes as one task is not tractable. This makes it tractable by
 * pulling every sentence containing a *checkable* assertion — a figure, a date, a named
 * person, a named operation, a casualty or production number — into a CSV, one row per
 * claim, with the campaign, node and node date attached.
 *
 * The output is a work queue, not a verdict. Nothing here is validated; the script has no
 * idea whether any claim is true. What it does is turn "check the history" into a finite
 * list you can work through, sort by risk, and mark off — and it re-runs, so after the
 * first pass you can diff to find only claims added since.
 *
 * Priority is a crude risk heuristic, not a judgment of importance:
 *   HIGH   - a specific number (casualties, tonnages, dates with a day, production figures).
 *            These are the claims that are precisely wrong or precisely right, and the ones
 *            a reviewer will check first.
 *   MED    - a named person or operation with a year attached.
 *   LOW    - everything else flagged.
 *
 * Usage: node extract-claims.js [path/to/App.jsx] > claims.csv
 */
const fs = require("fs");

const SRC = process.argv[2] || "../../App.jsx";
const src = fs.readFileSync(SRC, "utf8");

// Generalized to however many top-level CAMPAIGNS keys actually exist, in source order — a
// hardcoded german/soviet/allied 3-way slice silently mislabeled every Italy claim as "allied"
// once a 4th campaign was inserted between allied's block and the object's closing brace.
const CAMPAIGN_KEYS = ["german", "soviet", "allied", "italy"];
const campIdxs = CAMPAIGN_KEYS.map((k) => [k, src.indexOf(`\n  ${k}: {`)])
  .filter(([, i]) => i !== -1)
  .sort((a, b) => a[1] - b[1]);
const campEnd = src.indexOf("\n};", campIdxs[campIdxs.length - 1][1]);
const bounds = campIdxs.map(([k, i], n) => [k, i, n + 1 < campIdxs.length ? campIdxs[n + 1][1] : campEnd]);

const campaignAt = (idx) => (bounds.find(([, a, b]) => idx >= a && idx < b) || [])[0] || "shared";

// Track the enclosing node and its date by scanning forward.
const marks = [];
for (const m of src.matchAll(/get ([a-zA-Z_][a-zA-Z0-9_]*)\(\)|date:\s*"([^"]*)"/g)) {
  marks.push({ idx: m.index, node: m[1], date: m[2] });
}
function contextAt(idx) {
  let node = null;
  let date = null;
  for (const mk of marks) {
    if (mk.idx > idx) break;
    if (mk.node) {
      node = mk.node;
      date = null;
    }
    if (mk.date) date = mk.date;
  }
  return { node, date };
}

// Prose-bearing fields worth checking. Labels and titles are excluded: they are framing,
// not assertion.
const FIELD = /(situation|outcome|bio|fate|quote):\s*\n?\s*"((?:[^"\\]|\\.)*)"/g;

const NUMBER = /\b\d{1,3}(?:,\d{3})+\b|\b\d+(?:\.\d+)?\s?(?:million|billion|thousand|tons?|tonnes?|per cent|percent|%)\b|\b\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\b|\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}\b/;
const OPERATION = /\bOperation\s+[A-Z][a-z]+|\b(?:Barbarossa|Overlord|Bagration|Uranus|Citadel|Market Garden|Torch|Husky|Sea Lion|Valkyrie|Achse|Anton|Herkules|Shingle|Dynamo|Thunderclap|Silverplate|Manhattan)\b/;
const PERSON = /\b(?:Hitler|Stalin|Churchill|Roosevelt|Eisenhower|Rommel|Manstein|Zhukov|Chuikov|Koniev|Rokossovsky|Guderian|Kesselring|Model|Kluge|Speer|Göring|Heisenberg|Ribbentrop|Molotov|Montgomery|Patton|Bradley|Dönitz|Halder|Vatutin|Khrulev|Heinrici|Galland|Bothe|Kleist|Clauss|Alexandrov|Ponomarenko|Vlasov|Darlan|Bulganin|Antonov|Timoshenko)\b/;
const YEAR = /\b19[3-4]\d\b/;

const rows = [];
let m;
while ((m = FIELD.exec(src)) !== null) {
  const field = m[1];
  const text = m[2].replace(/\\n/g, " ").replace(/\\"/g, '"');
  const { node, date } = contextAt(m.index);
  const campaign = campaignAt(m.index);

  // Split into sentences so each row is one checkable assertion rather than a whole block.
  const sentences = text.split(/(?<=[.?!])\s+(?=[A-Z“"'])/);
  for (const s of sentences) {
    const hasNum = NUMBER.test(s);
    const hasOp = OPERATION.test(s);
    const hasPerson = PERSON.test(s);
    const hasYear = YEAR.test(s);
    if (!hasNum && !hasOp && !hasPerson && !hasYear) continue;

    let priority = "LOW";
    if (hasNum) priority = "HIGH";
    else if ((hasPerson || hasOp) && hasYear) priority = "MED";

    rows.push({ priority, campaign, node: node || "", date: date || "", field, claim: s.trim() });
  }
}

const order = { HIGH: 0, MED: 1, LOW: 2 };
rows.sort((a, b) => order[a.priority] - order[b.priority] || a.campaign.localeCompare(b.campaign));

const esc = (v) => '"' + String(v).replace(/"/g, '""') + '"';
console.log(["priority", "campaign", "node", "node_date", "field", "claim", "verdict", "source", "notes"].join(","));
for (const r of rows) {
  console.log([r.priority, r.campaign, r.node, r.date, r.field, r.claim, "", "", ""].map(esc).join(","));
}

const counts = rows.reduce((a, r) => ((a[r.priority] = (a[r.priority] || 0) + 1), a), {});
console.error(`claims extracted: ${rows.length}  (HIGH ${counts.HIGH || 0}, MED ${counts.MED || 0}, LOW ${counts.LOW || 0})`);
