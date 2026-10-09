// JSON-backed nodes stay consistent with the code that serves them (see tools/extract-json-nodes.mjs and
// docs/DATA_MIGRATION.md). For every src/data/*.nodes.json: the head part inlines the file, each id has exactly one
// `dataNode(<DATA>, "id", meters)` stub in the parts, each stub has a JSON entry, and every entry looks like a node.
// Run: npm run test:json
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const problems = [];
const all = readdirSync("src/parts").map((f) => readFileSync(join("src/parts", f), "utf8").replace(/\r\n/g, "\n")).join("\n");
const STUB = /dataNode\((\w+), "([A-Za-z0-9_]+)", meters\)/g;
let total = 0;
if (existsSync("src/data")) {
  for (const f of readdirSync("src/data").filter((x) => x.endsWith(".nodes.json"))) {
    const path = `src/data/${f}`;
    const data = JSON.parse(readFileSync(path, "utf8"));
    const ids = Object.keys(data);
    total += ids.length;
    // `const NAME = /*@inline-json <path>*/null;` — find NAME without a regex built from the path.
    const marker = `/*@inline-json ${path}*/null;`;
    const at = all.indexOf(marker);
    let name = null;
    if (at < 0) problems.push(`${path}: no ${marker} directive in the parts, so the data is never loaded`);
    else {
      const lineStart = all.lastIndexOf("\n", at) + 1;
      const words = all.slice(lineStart, at).trim().split(/\s+/); // ["const", "NAME", "="]
      name = words[1] ?? null;
    }
    const stubs = [...all.matchAll(STUB)].filter((s) => s[1] === name).map((s) => s[2]);
    for (const id of ids) {
      const n = stubs.filter((s) => s === id).length;
      if (n !== 1) problems.push(`${path}: "${id}" has ${n} stub(s) in the parts (expected exactly 1)`);
    }
    for (const id of new Set(stubs)) if (!(id in data)) problems.push(`${path}: the parts serve "${id}" from JSON but the file has no such node`);
    for (const [id, node] of Object.entries(data)) {
      if (!node || typeof node !== "object" || (!Array.isArray(node.choices) && !node.isEnding)) problems.push(`${path}: "${id}" is not a node (no choices)`);
      else if (typeof node.title !== "string" || !node.title) problems.push(`${path}: "${id}" has no title`);
    }
  }
}
for (const p of problems) console.error("FAIL: " + p);
console.log(problems.length ? `${problems.length} JSON node problem(s)` : `json nodes ok (${total} node(s) stored as JSON)`);
process.exit(problems.length ? 1 : 0);
