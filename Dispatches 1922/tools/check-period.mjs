// Checks the period details in src/parts/36-period.jsx, 37-letters.jsx and 38-plates.jsx against the campaigns and the registers.
//
//   - every plate, document, quotation and cast entry names a real report (or ending) of its campaign, and every plate names a scene that exists
//   - every quotation in QUOTES is in claims/quotations.json with the same text, and its sources are in claims/sources.json
//   - every flag a cast rule or a map effect reads is set somewhere in the campaign, with that value
//   - every operation joins two cities that exist, in the years of the war
//   - the text of documents, operations, cast and place notes has no em dash (docs/WRITING.md rule 1)
// Run: npm run check:period
import { existsSync, readFileSync } from "node:fs";
import { loadCampaignsFromDataSection } from "../../packages/testkit/src/load-campaigns.mjs";

const CAMPAIGNS = loadCampaignsFromDataSection("src/App.jsx");
const read = (f) => readFileSync(f, "utf8");
const parts = { period: read("src/parts/36-period.jsx"), letters: read("src/parts/37-letters.jsx"), plates: read("src/parts/38-plates.jsx") };
const campaignFiles = { southRussia: "10-campaign-southrussia", siberia: "11-campaign-siberia", bolsheviks: "12-campaign-bolsheviks", provisionalGov17: "13-campaign-provisionalgov17" };
const problems = [];

/** Evaluates `const NAME = <literal>;` from a part. */
function literal(text, name) {
  const start = text.indexOf(`const ${name} = `);
  if (start < 0) throw new Error(`${name} not found`);
  const open = text.indexOf("\n", start) >= 0 ? start + `const ${name} = `.length : start;
  const bodyStart = open;
  const isArr = text[bodyStart] === "[";
  const close = (isArr ? "\n];" : "\n};");
  const end = text.indexOf(close, bodyStart);
  if (end < 0) throw new Error(`end of ${name} not found`);
  return new Function("return " + text.slice(bodyStart, end + 2))();
}
const DOCUMENTS = literal(parts.letters, "DOCUMENTS");
const QUOTES = literal(parts.letters, "QUOTES");
const CAST = literal(parts.letters, "CAST");
const PLATE_FOR = literal(parts.plates, "PLATE_FOR");
const OPERATIONS = literal(parts.period, "OPERATIONS");
const MAP_EFFECTS = literal(parts.period, "MAP_EFFECTS");
const CITY_ASSETS = literal(parts.period, "CITY_ASSETS");
const CITY_LATER = literal(parts.period, "CITY_LATER");
const sceneIds = [...parts.plates.matchAll(/^  ([a-z]+): \{ caption:/gm)].map((m) => m[1]);
const cityIds = new Set([...read("src/parts/30-screens.jsx").matchAll(/^  ([a-z]+): \{ name: "/gm)].map((m) => m[1]));

const allIds = new Set();
const idsByCampaign = {};
for (const [cid, camp] of Object.entries(CAMPAIGNS)) {
  idsByCampaign[cid] = new Set([...camp.NODE_ATLAS.map((n) => n.id), ...camp.ENDINGS_GALLERY.map((e) => e.id)]);
  for (const i of idsByCampaign[cid]) allIds.add(i);
}
const flagsSet = {};
for (const [cid, file] of Object.entries(campaignFiles)) {
  const text = read(`src/parts/${file}.jsx`);
  const set = {};
  for (const m of text.matchAll(/setFlags: \{([^}]*)\}/g)) for (const kv of m[1].matchAll(/([A-Za-z0-9_]+):\s*("([^"]*)"|true|false)/g)) (set[kv[1]] ||= new Set()).add(kv[3] !== undefined ? kv[3] : kv[2]);
  flagsSet[cid] = set;
}

for (const [id, scene] of Object.entries(PLATE_FOR)) {
  if (!allIds.has(id)) problems.push(`plate for "${id}": not a report or ending of any campaign`);
  if (!sceneIds.includes(scene)) problems.push(`plate for "${id}": the scene "${scene}" does not exist`);
}
for (const [id, d] of Object.entries(DOCUMENTS)) {
  if (!allIds.has(id)) problems.push(`document for "${id}": not a report`);
  for (const k of ["kind", "title", "from", "to", "date", "lines", "basis"]) if (!d[k] || (Array.isArray(d[k]) && !d[k].length)) problems.push(`document for "${id}": no ${k}`);
}
const reg = existsSync("claims/quotations.json") ? JSON.parse(read("claims/quotations.json")) : [];
const sources = JSON.parse(read("claims/sources.json"));
for (const q of QUOTES) {
  if (!allIds.has(q.node)) problems.push(`quotation ${q.id}: "${q.node}" is not a report`);
  const r = reg.find((x) => x.id === q.id);
  if (!r) problems.push(`quotation ${q.id}: not in claims/quotations.json`);
  else {
    if (r.text !== q.text) problems.push(`quotation ${q.id}: the text differs from claims/quotations.json`);
    if (!r.translation) problems.push(`quotation ${q.id}: no translation note`);
    if (!r.sources || !r.sources.length) problems.push(`quotation ${q.id}: no source`);
    for (const s of r.sources || []) if (!sources[s]) problems.push(`quotation ${q.id}: unknown source ${s}`);
  }
}
for (const r of reg) if (!QUOTES.find((q) => q.id === r.id)) problems.push(`claims/quotations.json has ${r.id}, which no report shows`);
for (const [cid, people] of Object.entries(CAST)) {
  if (!CAMPAIGNS[cid]) problems.push(`cast: unknown campaign ${cid}`);
  for (const p of people) {
    for (const n of p.appears) if (!idsByCampaign[cid] || !idsByCampaign[cid].has(n)) problems.push(`cast ${cid}/${p.id}: "${n}" is not a report of the campaign`);
    for (const r of p.rules) if (r.flag && !(flagsSet[cid][r.flag] && flagsSet[cid][r.flag].has(r.value))) problems.push(`cast ${cid}/${p.id}: nothing sets ${r.flag} = ${r.value}`);
  }
}
for (const e of MAP_EFFECTS) {
  const ok = Object.values(flagsSet).some((f) => f[e.flag] && f[e.flag].has(e.value));
  if (!ok) problems.push(`map effect: nothing sets ${e.flag} = ${e.value}`);
  if (!cityIds.has(e.city)) problems.push(`map effect: unknown city ${e.city}`);
}
for (const o of OPERATIONS) {
  if (!cityIds.has(o.from) || !cityIds.has(o.to)) problems.push(`operation ${o.id}: unknown city`);
  if (o.start > o.end || o.start < 191701 || o.end > 192212) problems.push(`operation ${o.id}: dates out of order or out of the war`);
}
for (const c of Object.keys(CITY_ASSETS)) if (!cityIds.has(c)) problems.push(`assets: unknown city ${c}`);
for (const c of Object.keys(CITY_LATER)) if (!cityIds.has(c)) problems.push(`later names: unknown city ${c}`);

const texts = JSON.stringify([DOCUMENTS, OPERATIONS, CAST, CITY_LATER]);
if (texts.includes("—")) problems.push("an em dash in the text of the documents, operations, staff or place names (docs/WRITING.md rule 1)");

console.log(`period: ${Object.keys(PLATE_FOR).length} plates (${sceneIds.length} scenes), ${Object.keys(DOCUMENTS).length} documents, ${QUOTES.length} quotations, ${Object.values(CAST).reduce((s, l) => s + l.length, 0)} staff, ${OPERATIONS.length} operations; ${problems.length} problem(s).`);
for (const p of problems) console.log("  " + p);
process.exit(problems.length ? 1 : 0);
