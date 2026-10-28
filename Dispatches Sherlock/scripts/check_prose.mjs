// A writing lint for everything a player can read (events.json, flavor.json, the labels in config.json). It holds the house rules that were kept by hand:
//   no dashes on screen (an em dash, an en dash or a spaced hyphen), UK order for dates (4 January 1891, never January 4), UK spellings, no leftover
//   placeholders, no doubled spaces. It also warns (without failing) about a scene or an option that has grown very long.
// Run: node scripts/check_prose.mjs        (npm run check:prose; part of npm test)
import { readFileSync } from "node:fs";
import { join } from "node:path";

const dir = "src/content/sherlock";
const read = (f) => JSON.parse(readFileSync(join(dir, f), "utf8"));
const events = read("events.json");
const flavor = read("flavor.json");
const config = read("config.json");

/** Every string in a value, with the path that leads to it. */
function* strings(value, path) {
  if (typeof value === "string") yield [path, value];
  else if (Array.isArray(value)) for (let i = 0; i < value.length; i++) yield* strings(value[i], `${path}[${i}]`);
  else if (value && typeof value === "object") for (const [k, v] of Object.entries(value)) yield* strings(v, path ? `${path}.${k}` : k);
}

// the parts of each file that a player reads (ids, flags, conditions and engine keys are not prose)
const PROSE_KEYS = new Set([
  "title", "description", "label", "detail", "text", "outcome", "headline", "source", "bodyText", "requiresHint", "requiresFlagHint", "speaker", "note",
  "heading", "body",
]);
const prose = [];
function collect(value, path, inProse) {
  if (typeof value === "string") {
    if (inProse) prose.push([path, value]);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((v, i) => collect(v, `${path}[${i}]`, inProse));
    return;
  }
  if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) collect(v, path ? `${path}.${k}` : k, inProse || PROSE_KEYS.has(k));
  }
}
collect(events, "events", false);
// flavor.json is nearly all prose: every string in it
for (const [p, s] of strings(flavor, "flavor")) prose.push([p, s]);
for (const [p, s] of strings(config.coupling ?? [], "config.coupling")) if (p.endsWith(".label")) prose.push([p, s]);
for (const [p, s] of strings(config.resources ?? [], "config.resources")) if (p.endsWith(".label")) prose.push([p, s]);

const MONTHS = "January|February|March|April|May|June|July|August|September|October|November|December";
const RULES = [
  { id: "dash", re: /[–—]|\s-\s/, why: "no dashes in on-screen text (use a comma, a colon or a full stop)" },
  { id: "us-date", re: new RegExp(`\\b(?:${MONTHS}) \\d{1,2}(?:st|nd|rd|th)?\\b(?!\\d)(?:,| \\d{4}|\\b)`), why: "dates are written the UK way: 4 January 1891" },
  { id: "us-spelling", re: /\b(?:color|gray|honor|favor|neighbor|center|theater|defense|realize[sd]?|organize[sd]?|recognize[sd]?|apologize[sd]?|jewelry|plow|traveler|traveled|labors?\b|armor|odor|vapor|mold|skeptic|mustache|catalog\b|analyze[sd]?|license\b)/i, why: "UK spelling" },
  { id: "placeholder", re: /\b(?:TODO|FIXME|XXX|lorem ipsum|REPLACE_ME)\b/i, why: "leftover placeholder" },
  { id: "double-space", re: / {2,}/, why: "doubled space" },
  { id: "space-before-punct", re: / [,;:.!?](?!\.)/, why: "space before punctuation" },
];
// text that matches a rule but is right, and what to read it as: the League's advertisement, as Doyle printed it
const ALLOW = [[/Lebanon, Pennsylvania, U\.S\.A\./, "Lebanon"]];

let failures = 0;
const seen = new Set();
for (const [path, text] of prose) {
  const probe = ALLOW.reduce((t, [re, as]) => t.replace(re, as), text);
  for (const rule of RULES) {
    const m = probe.match(rule.re);
    if (!m) continue;
    const key = `${rule.id}|${path}`;
    if (seen.has(key)) continue;
    seen.add(key);
    failures++;
    const at = Math.max(0, (m.index ?? 0) - 25);
    console.error(`FAIL [${rule.id}] ${path}: ${rule.why}: "...${probe.slice(at, at + 70).replace(/\n/g, " ")}..."`);
  }
}

// warnings: length
let warned = 0;
for (const [id, node] of Object.entries(events.nodes ?? {})) {
  if (node.description.length > 1500) {
    warned++;
    console.warn(`warn: scene ${id} is ${node.description.length} characters long (over 1500)`);
  }
  for (const [i, o] of node.options.entries()) {
    if ((o.detail ?? "").length > 300) {
      warned++;
      console.warn(`warn: scene ${id} option ${i} has a ${o.detail.length} character detail (over 300)`);
    }
  }
}

if (failures) {
  console.error(`\nProse check FAILED: ${failures} problem(s) in ${prose.length} strings.`);
  process.exit(1);
}
console.log(`Prose check passed: ${prose.length} strings read (dashes, UK dates, UK spellings, placeholders, spacing)${warned ? `; ${warned} length warning(s)` : ""}.`);
