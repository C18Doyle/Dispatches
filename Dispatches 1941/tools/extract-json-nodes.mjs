// One-time (and repeatable) converter: moves a campaign's plain-data nodes out of code and into a JSON file.
//
//   node tools/extract-json-nodes.mjs alliedPacific            convert (build first: it reads the assembled src/App.jsx)
//   node tools/extract-json-nodes.mjs alliedPacific --dry-run  only report what would move
//
// A node is plain data when its source never mentions flags or meters, contains no function, and resolving it gives
// the same result under every flag and meter state tried. For each such node the converter
//   - writes it to src/data/<campaign>.nodes.json (id -> node), and
//   - replaces its getter in the campaign part with `return dataNode(<DATA>, "<id>", meters);`.
// The head part gets `const <DATA> = /*@inline-json src/data/<campaign>.nodes.json*/null;`; assembly inlines the JSON
// (packages/testkit/src/split.mjs), so the assembled artifact is plain JS and every validator reads it as before.
// Nodes that read flags or meters stay as code. Equivalence is proved by tests/json-nodes.test.mjs.
import { createRequire } from "node:module";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { loadCampaignsFromJsx } from "../../packages/testkit/src/load-campaigns.mjs";

const campaignId = process.argv[2];
const dry = process.argv.includes("--dry-run");
const CONFIG = {
  alliedPacific: { part: "src/parts/11-campaign-alliedpacific.jsx", data: "ALLIED_PACIFIC_DATA", file: "src/data/alliedPacific.nodes.json" },
  japan: { part: "src/parts/10-campaign-japan.jsx", data: "JAPAN_DATA", file: "src/data/japan.nodes.json" },
}[campaignId];
if (!CONFIG) {
  console.error("usage: node tools/extract-json-nodes.mjs <alliedPacific|japan> [--dry-run]");
  process.exit(2);
}
const HEAD = "src/parts/00-head.jsx";
const esbuild = createRequire(import.meta.url)("esbuild");
const camp = loadCampaignsFromJsx(esbuild, "src/App.jsx")[campaignId];

const read = (f) => readFileSync(f, "utf8").replace(/\r\n/g, "\n");
const partLines = read(CONFIG.part).split("\n");
const headerRe = /^ {8}get ([A-Za-z0-9_]+)\(\) \{$/;
const getters = [];
partLines.forEach((line, i) => {
  const m = headerRe.exec(line);
  if (m) {
    let j = i + 1;
    while (j < partLines.length && partLines[j] !== "        },") j++;
    getters.push({ id: m[1], from: i, to: j });
  }
});

// Flag and meter states to try: none, every flag true / a string / a number, and every meter level.
const flagKeys = new Set();
const meterKeys = Object.keys(camp.resolveNode(camp.start, {}, { readiness: 0, pipeline: 0, initiative: 0 }) ? { readiness: 0, pipeline: 0, initiative: 0 } : {});
const mk = (v) => Object.fromEntries(meterKeys.map((k) => [k, v]));
// Every uniform meter level -10..10, plus each meter alone at every level: a threshold anywhere in the range is hit.
const meterStates = [];
for (let v = -10; v <= 10; v++) meterStates.push(mk(v));
for (const k of meterKeys) for (let v = -10; v <= 10; v++) if (v !== 0) meterStates.push({ ...mk(0), [k]: v });
meterStates.push(Object.fromEntries(meterKeys.map((k, i) => [k, i % 2 ? 9 : -9])), Object.fromEntries(meterKeys.map((k, i) => [k, i % 2 ? -9 : 9])));
const ser = (n) => JSON.stringify(n, (k, v) => (typeof v === "function" ? "<fn>" : v));
for (const g of getters) {
  try {
    const n = camp.resolveNode(g.id, {}, meterStates[0]);
    for (const c of n?.choices ?? []) {
      for (const k of Object.keys(c.setFlags ?? {})) flagKeys.add(k);
      for (const u of c.uncertain ?? []) for (const k of Object.keys(u.setFlags ?? {})) flagKeys.add(k);
    }
  } catch {
    /* judged below */
  }
}
const flagStates = [{}, ...[true, "zz", 3].map((v) => Object.fromEntries([...flagKeys].map((k) => [k, v])))];

const pure = [];
const code = [];
for (const g of getters) {
  let base;
  try {
    base = camp.resolveNode(g.id, {}, meterStates[0]);
  } catch {
    code.push(g.id);
    continue;
  }
  if (!base) {
    code.push(g.id);
    continue;
  }
  // Source test first: a getter that mentions flags or meters, or contains a function, is code however it samples (a flag
  // value nobody sets in the walk can still change its text, as the first attempt at this converter learned the hard way).
  // Strip string literals first: prose says "this" and "function" all the time.
  const stripped = partLines.slice(g.from, g.to + 1).join("\n").replace(/"(?:[^"\\]|\\.)*"/g, '""');
  if (/\b(flags|meters|this)\b|=>|\bfunction\b/.test(stripped)) {
    code.push(g.id);
    continue;
  }
  const first = ser(base);
  const stable = !first.includes('"<fn>"') && flagStates.every((f) => meterStates.every((m) => {
    try {
      return ser(camp.resolveNode(g.id, f, m)) === first;
    } catch {
      return false;
    }
  }));
  (stable ? pure : code).push(g.id);
}
console.log(`${campaignId}: ${getters.length} nodes in the part; ${pure.length} plain data (move to JSON), ${code.length} read flags or meters (stay code)`);
if (dry) process.exit(0);

// 1. the JSON file (id -> node), in source order
const data = {};
for (const g of getters) if (pure.includes(g.id)) data[g.id] = JSON.parse(JSON.stringify(camp.resolveNode(g.id, {}, meterStates[0])));
mkdirSync("src/data", { recursive: true });
writeFileSync(CONFIG.file, JSON.stringify(data, null, 2) + "\n");

// 2. replace the getters, last to first so earlier line numbers stay valid
const out = partLines.slice();
for (const g of getters.slice().reverse()) {
  if (!pure.includes(g.id)) continue;
  out.splice(g.from, g.to - g.from + 1, `        get ${g.id}() {`, `          return dataNode(${CONFIG.data}, "${g.id}", meters);`, "        },");
}
writeFileSync(CONFIG.part, out.join("\n"));

// 3. the data constant and helper in the head part (once per campaign; the helper once)
let head = read(HEAD);
const decl = `const ${CONFIG.data} = /*@inline-json ${CONFIG.file}*/null;\n`;
if (!head.includes(decl)) {
  const helper = head.includes("const dataNode = ") ? "" : "// A node stored as JSON: a fresh copy per call, as a getter returned a fresh object before.\nconst dataNode = (data, id) => JSON.parse(JSON.stringify(data[id]));\n";
  const note = `// ${campaignId}: nodes that are plain data live in ${CONFIG.file} (inlined at assembly). Nodes that read flags or meters stay code in the campaign part.\n`;
  head = head.replace("const CAMPAIGNS = {", `${helper}${note}${decl}\nconst CAMPAIGNS = {`);
  writeFileSync(HEAD, head);
}
console.log(`wrote ${CONFIG.file} (${pure.length} nodes), rewrote ${CONFIG.part}, updated ${HEAD}`);
