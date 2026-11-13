#!/usr/bin/env node
// The size budget of the built game (dist/full): fails when the bundle or the whole build grows past its budget, and prints what takes
// the room. The budgets sit a little above the size in November 2026, so growth is a decision, not an accident; raise one here, in the
// same commit as the change that needs it, and say why.
//   npm run build:nozip && node tools/size-budget.mjs
import { readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist", "full");
const MB = 1048576;
const BUDGET = {
  "bundle.js": 10.5 * MB, // the game itself: every command, both maps, every battle, eight languages
  total: 42 * MB, // everything a player downloads: the bundle, the maps, the photographs and the music
};
if (!existsSync(join(DIST, "bundle.js"))) {
  console.error("No build in dist/full: run npm run build:nozip first.");
  process.exit(1);
}
const sizeOf = (p) => {
  const s = statSync(p);
  return s.isDirectory() ? readdirSync(p).reduce((a, f) => a + sizeOf(join(p, f)), 0) : s.size;
};
const parts = readdirSync(DIST).map((f) => [f, sizeOf(join(DIST, f))]).sort((a, b) => b[1] - a[1]);
const assets = existsSync(join(DIST, "assets")) ? readdirSync(join(DIST, "assets")).map((f) => ["assets/" + f, sizeOf(join(DIST, "assets", f))]).sort((a, b) => b[1] - a[1]) : [];
const total = parts.reduce((a, [, s]) => a + s, 0);
const bundle = sizeOf(join(DIST, "bundle.js"));
const fmt = (n) => (n / MB).toFixed(2) + " MB";
console.log("size of dist/full:");
for (const [f, s] of [...parts.filter(([f]) => f !== "assets"), ...assets]) console.log(`  ${f.padEnd(20)} ${fmt(s)}`);
console.log(`  ${"total".padEnd(20)} ${fmt(total)}`);
const over = [];
if (bundle > BUDGET["bundle.js"]) over.push(`bundle.js is ${fmt(bundle)}, over its budget of ${fmt(BUDGET["bundle.js"])}`);
if (total > BUDGET.total) over.push(`the build is ${fmt(total)}, over its budget of ${fmt(BUDGET.total)}`);
if (over.length) {
  console.error("\nsize budget: " + over.join("; ") + ". Shrink it, or raise the budget in tools/size-budget.mjs and say why.");
  process.exit(1);
}
console.log(`\nsize budget: within budget (bundle ${fmt(bundle)} of ${fmt(BUDGET["bundle.js"])}, total ${fmt(total)} of ${fmt(BUDGET.total)})`);
