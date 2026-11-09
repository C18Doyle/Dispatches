#!/usr/bin/env node
// The staff's reading (src/parts/36-staffs-reading.jsx). Every belief belongs to a report of its command and names the orders that rest on it; a false belief has an
// order that does not rest on it; the text keeps to the style of the game; the claims register carries each belief; the checks are counted right; and nothing in the
// rules reads the reading (no part but 36 and the two places that mount it names ix_ or the intel functions).
//   npm run check-staffs-reading
import { readFileSync } from "node:fs";
import { loadGame } from "./audit-lib.mjs";

const game = await loadGame();
const { CAMPAIGNS, INTEL, INTEL_ITEMS, intelChecked, intelChecksLeft, intelCheck, logic } = game;
const claims = JSON.parse(readFileSync(new URL("../claims/staffs-reading.json", import.meta.url), "utf8"));
const problems = [];
const ok = (c, m) => {
  if (!c) problems.push(m);
};
const wc = (s) => String(s || "").trim().split(/\s+/).filter(Boolean).length;
let checked = 0;
let count = 0;

for (const cid of Object.keys(CAMPAIGNS)) {
  checked++;
  ok(Object.keys(INTEL_ITEMS[cid] || {}).length > 0, `${cid}: no report carries a belief`);
}
for (const [cid, nodes] of Object.entries(INTEL_ITEMS)) {
  for (const [nodeId, items] of Object.entries(nodes)) {
    let node = null;
    try {
      node = CAMPAIGNS[cid].resolveNode(nodeId, logic.startFlags("open"), { readiness: 3, pipeline: 3, initiative: 3 });
    } catch (e) {
      /* none */
    }
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
        ok(!/[—]/.test(s), `${where}: an em dash`);
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
ok(intelChecksLeft(f0, false) === INTEL.checks && intelChecksLeft(f0, true) === INTEL.hardChecks, "the allowance of checks is wrong");
const first = Object.entries(INTEL_ITEMS)[0];
const [nodeId0, items0] = Object.entries(first[1])[0];
const f1 = intelCheck(f0, nodeId0, items0[0].id, false);
ok(intelChecked(f1, nodeId0, items0[0].id) && intelChecksLeft(f1, false) === INTEL.checks - 1, "a check is not counted");
ok(intelCheck(f1, nodeId0, items0[0].id, false) === f1, "a belief can be checked twice");
let f = f0;
for (let k = 0; k < INTEL.checks + 2; k++) f = intelCheck(f, "n" + k, "x", false);
ok(intelChecksLeft(f, false) === 0 && Object.keys(f).filter((k) => k.startsWith("ix_n")).length === INTEL.checks, "more checks are allowed than the allowance");
ok(INTEL.hardChecks <= INTEL.checks, "the hard modes have more checks than the standard mode");

// nothing in the rules reads the reading
checked++;
const parts = ["00-head", "10-campaign-japan", "11-campaign-alliedpacific", "20-registries-and-gallery", "25-battle-subgame", "26-battles-pacific", "30-screens", "35-battle-screens", "40-app"];
const mentions = /\bix_|intelCheck|intelChecked|intelChecksLeft|intelRests|IntelPanel|INTEL_ITEMS|intelItemsAt/;
const allowed = new Set(["30-screens", "40-app"]);
for (const p of parts) {
  const text = readFileSync(new URL(`../src/parts/${p}.jsx`, import.meta.url), "utf8");
  if (mentions.test(text) && !allowed.has(p)) problems.push(`${p}: names the staff's reading, which only the screens and the app may do`);
}
ok(!mentions.test(readFileSync(new URL("../src/logic.ts", import.meta.url), "utf8")), "logic.ts names the staff's reading");

console.log(`staff's reading: ${count} beliefs, ${checked} checks; ${problems.length} problem(s)`);
for (const p of problems) console.log("  " + p);
process.exit(problems.length ? 1 : 0);
