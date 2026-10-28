// A continuity check against the bible in claims/continuity.json, for the contradictions that a lint of single scenes cannot see.
//   1. time: no option leads from a scene to one dated earlier, inside one volume (the date table is src/calendar_dates.ts)
//   2. introductions: a character named in a scene's description (which every player reads) must have been introduced on every path that reaches it:
//      the scenes that introduce them are removed from the graph, and any scene that mentions the name and can still be reached is a contradiction
//   3. facts: a scene that names a fixed fact of the bible (a fee, an address, an age) must agree with it
// Run: node scripts/check_continuity.mjs [--names]     (--names lists where each person is first named; npm run check:continuity, part of npm test)
import { readFileSync } from "node:fs";

const events = JSON.parse(readFileSync("src/content/sherlock/events.json", "utf8"));
const bible = JSON.parse(readFileSync("claims/continuity.json", "utf8"));
const nodes = events.nodes;
const START = events.startNodeId;
let failures = 0;
const fail = (m) => {
  failures++;
  console.error("FAIL: " + m);
};

const targets = (o) => [o.nextNodeId, o.roll?.success.nextNodeId, o.roll?.failure.nextNodeId].filter(Boolean);
const out = (id) => [...new Set(nodes[id].options.flatMap(targets))].filter((t) => nodes[t]);

// the volume a scene belongs to: its branch's volume, with the long case's branches together
const LONG = new Set(["WEB", "YARD", "STREET", "CONTINENT", "MYCROFT", "HIATUS"]);
const volume = (id) => (LONG.has(nodes[id].branch) ? "FINAL" : nodes[id].branch);

// ───────────── 1. time ─────────────
const dates = {};
for (const m of readFileSync("src/calendar_dates.ts", "utf8").matchAll(/^\s*"?([A-Za-z0-9]+)"?:\s*"(\d{4}-\d{2}-\d{2})"/gm)) dates[m[1]] = m[2];
let edges = 0;
for (const id of Object.keys(nodes)) {
  for (const t of out(id)) {
    if (volume(t) !== volume(id) || t === id) continue;
    edges++;
    if (!dates[id] || !dates[t]) continue;
    if (dates[t] < dates[id]) fail(`time: ${id} (${dates[id]}) leads to ${t} (${dates[t]}), which is earlier`);
  }
}

// ───────────── 2. introductions ─────────────
const mentions = (re, id) => re.test(nodes[id].description) || re.test(nodes[id].title);
if (process.argv.includes("--names")) {
  // breadth-first from the start: the order in which a player can first meet each name
  const order = [];
  const seen = new Set([START]);
  const queue = [START];
  while (queue.length) {
    const id = queue.shift();
    order.push(id);
    for (const t of out(id)) if (!seen.has(t)) (seen.add(t), queue.push(t));
  }
  for (const p of bible.people) {
    const re = new RegExp(p.pattern);
    console.log(p.name.padEnd(16), order.filter((id) => mentions(re, id)).slice(0, 12).join(" ") || "(never in a description)");
  }
  process.exit(0);
}
const starts = [START];
for (const p of bible.people) {
  if (p.introducedAt === "canon") continue; // known to every reader of the stories: a name needs no introduction
  const re = new RegExp(p.pattern);
  const intro = new Set(p.introducedAt);
  for (const id of intro) if (!nodes[id]) fail(`bible: ${p.name} is introduced at "${id}", which is not a scene`);
  // reach every scene that can be got to without passing an introduction
  const seen = new Set();
  const stack = starts.filter((s) => !intro.has(s));
  while (stack.length) {
    const id = stack.pop();
    if (seen.has(id)) continue;
    seen.add(id);
    if (p.volumes && !p.volumes.includes(volume(id))) continue;
    for (const t of out(id)) if (!intro.has(t)) stack.push(t);
  }
  for (const id of seen) {
    if (intro.has(id) || p.except?.includes(id)) continue;
    if (p.volumes && !p.volumes.includes(volume(id))) continue;
    if (mentions(re, id)) fail(`introductions: scene ${id} ("${nodes[id].title}") names ${p.name} in its description, but a player can reach it without having met them (introduced at ${p.introducedAt.join(", ")})`);
  }
}

// ───────────── 3. facts ─────────────
for (const f of bible.facts ?? []) {
  const re = new RegExp(f.pattern, "i");
  const bad = new RegExp(f.contradicts, "i");
  for (const [id, n] of Object.entries(nodes)) {
    const all = [n.description, ...(n.echoes ?? []).map((e) => e.text), ...n.options.flatMap((o) => [o.detail, o.outcome, o.quote?.text ?? ""])].join("\n");
    if (re.test(all) && bad.test(all)) fail(`facts: scene ${id}: ${f.what}`);
  }
}

if (failures) {
  console.error(`\nContinuity check FAILED: ${failures} problem(s).`);
  process.exit(1);
}
console.log(`Continuity check passed: ${edges} links in time, ${bible.people.length} people, ${(bible.facts ?? []).length} fixed facts.`);
