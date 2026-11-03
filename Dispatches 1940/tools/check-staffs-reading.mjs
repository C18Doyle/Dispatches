#!/usr/bin/env node
// The staff's reading (src/parts/42-staffs-reading.jsx). Every belief belongs to a report of its command and names the orders that rest on it; a false belief has an
// order that does not rest on it; the text keeps to the style of the game; the claims register carries each belief; the checks are counted right; and nothing in the
// rules reads the reading (no part but 42 and the two places that mount it names `ix_` or the intel functions).
//   npm run check-staffs-reading   (extracts the campaigns first)
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(ROOT, "package.json"));
const src = readFileSync(join(ROOT, "src/parts/42-staffs-reading.jsx"), "utf8");
const code = src.slice(0, src.indexOf("const INTEL_GRADE_TAG"));
const M = new Function(code + "\nreturn { INTEL, INTEL_ITEMS, intelItemsAt, intelChecked, intelChecksLeft, intelCheck };")();
const CAMPAIGNS = require(join(ROOT, "tools/campaigns_extracted.js"));
const claims = JSON.parse(readFileSync(join(ROOT, "claims/staffs-reading.json"), "utf8"));

const problems = [];
const ok = (c, m) => { if (!c) problems.push(m); };
const wc = (s) => String(s || "").trim().split(/\s+/).filter(Boolean).length;
let checked = 0;
let count = 0;
for (const cid of Object.keys(CAMPAIGNS)) {
  ok(Object.keys(M.INTEL_ITEMS[cid] || {}).length > 0, `${cid}: no report carries a belief`);
  checked++;
}
for (const [cid, nodes] of Object.entries(M.INTEL_ITEMS)) {
  for (const [nodeId, items] of Object.entries(nodes)) {
    let node = null;
    try { node = CAMPAIGNS[cid].resolveNode(nodeId, {}, { manpower: 0, fuel: 0, initiative: 0 }); } catch (e) { /* none */ }
    ok(node, `${cid}/${nodeId}: no such report`);
    if (!node) continue;
    const seen = new Set();
    for (const it of items) {
      checked++;
      count++;
      const where = `${cid}/${nodeId}/${it.id}`;
      ok(!seen.has(it.id), `${where}: duplicate id`);
      seen.add(it.id);
      ok(["firm", "doubtful", "poor"].includes(it.grade), `${where}: grade must be firm, doubtful or poor`);
      ok(typeof it.holds === "boolean", `${where}: holds must be true or false`);
      ok(wc(it.text) >= 8 && wc(it.truth) >= 10 && wc(it.source) >= 2, `${where}: the belief, the truth or the source is too short`);
      for (const s of [it.text, it.truth, it.source]) {
        ok(!/[–—]/.test(s), `${where}: a long dash`);
        ok(!/["“”]/.test(s), `${where}: a quotation mark`);
      }
      const n = (node.choices || []).length;
      ok(Array.isArray(it.relied) && it.relied.length > 0, `${where}: no order rests on it`);
      for (const i of it.relied || []) ok(Number.isInteger(i) && i >= 0 && i < n, `${where}: order ${i} does not exist (${n} orders)`);
      if (!it.holds) ok((node.choices || []).some((_, i) => !(it.relied || []).includes(i)), `${where}: every order rests on it, so there is no informed alternative`);
      ok(claims.some((c) => c.id === `ix-${nodeId}-${it.id}`), `${where}: no claim ix-${nodeId}-${it.id} in claims/staffs-reading.json`);
    }
  }
}
for (const c of claims) ok(/^ix-/.test(c.id) && c.where && c.claim && c.status && c.source, `claim ${c.id}: incomplete`);
// the checks
checked += 5;
const f0 = {};
ok(M.intelChecksLeft(f0, false) === M.INTEL.checks && M.intelChecksLeft(f0, true) === M.INTEL.hardChecks, "the allowance of checks is wrong");
let f = f0;
const [cid0] = Object.keys(M.INTEL_ITEMS);
const [node0] = Object.keys(M.INTEL_ITEMS[cid0]);
const id0 = M.INTEL_ITEMS[cid0][node0][0].id;
f = M.intelCheck(f, node0, id0, false);
ok(M.intelChecksLeft(f, false) === M.INTEL.checks - 1, "a check does not spend one");
ok(M.intelCheck(f, node0, id0, false) === f, "a belief can be checked twice");
let g = {};
for (let i = 0; i < M.INTEL.checks + 2; i++) g = M.intelCheck(g, "n" + i, "x", false);
ok(M.intelChecksLeft(g, false) === 0 && g.ix_used === M.INTEL.checks, "more checks than the allowance can be spent");
ok(M.intelChecksLeft({ ix_used: 99 }, true) === 0, "the checks left go below none");
// nothing in the rules reads it
const parts = join(ROOT, "src/parts");
for (const file of readdirSync(parts)) {
  if (file.startsWith("42-")) continue;
  const text = readFileSync(join(parts, file), "utf8");
  checked++;
  const uses = (text.match(/\bix_|intelItemsAt|intelChecked|intelChecksLeft|intelCheck\b|intelRests|IntelPanel/g) || []);
  const allowedNames = file.startsWith("40-") ? ["IntelPanel", "intelRests"] : file.startsWith("50-") ? ["intelCheck"] : [];
  const bad = uses.filter((u) => !allowedNames.includes(u));
  ok(bad.length === 0, `${file}: reads the staff's reading outside the screens that show it (${bad.join(", ")})`);
}
console.log(`check-staffs-reading: ${count} beliefs in ${Object.keys(M.INTEL_ITEMS).length} commands, ${checked} checks${problems.length ? "" : ": ok"}`);
if (problems.length) {
  for (const p of problems) console.error("  " + p);
  console.error(`${problems.length} problem(s)`);
  process.exit(1);
}
