#!/usr/bin/env node
// How much Decree/Authority/Cohesion capital can a run actually spend? Plays seeded random runs on the real
// src/logic.ts, always taking a capital-spending choice when one is open, and reports, per campaign:
//   the distribution of capital spent by the end of a run (the cap must be reachable: spent >= maxCap)
//   every node that offers a capital-spending choice, with how often a run visits it
//
//   node tools/capital-reach.mjs [runsPerCampaign=2000]
import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { buildSync } from "esbuild";

const RUNS = parseInt(process.argv.slice(2).find((a) => /^\d+$/.test(a)) || "2000", 10);
let seed = 20260101;
const rand = () => {
  seed = (seed + 0x6d2b79f5) >>> 0;
  let t = seed;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const require = createRequire(import.meta.url);
const dir = mkdtempSync(join(tmpdir(), "d1922-cap-"));
const data = readFileSync("src/App.jsx", "utf8").split("// PREVIEW SCREENS")[0].replace(/^export /gm, "") + "\nmodule.exports = { CAMPAIGNS, applyImpact, clampTriangle };\n";
writeFileSync(join(dir, "data.cjs"), data);
const { CAMPAIGNS, applyImpact, clampTriangle } = require(join(dir, "data.cjs"));
const logicPath = join(dir, "logic.mjs");
buildSync({ entryPoints: ["src/logic.ts"], outfile: logicPath, format: "esm", bundle: false });
const { resolveChoice, afterOutcome } = await import(pathToFileURL(resolve(logicPath)).href);
const helpers = { applyImpact, clampTriangle };

function run(camp, offered, visited) {
  let meters = { ...camp.initialMeters };
  let flags = {};
  let hardValue = 0;
  let nodeId = camp.start;
  let maxSpent = 0;
  for (let steps = 0; steps < 300; steps++) {
    const node = camp.resolveNode(nodeId, flags, meters);
    if (!node || node.isEnding) break;
    visited.set(nodeId, (visited.get(nodeId) || 0) + 1);
    const open = (node.choices || []).filter((c) => !(typeof c.gate === "function" && !c.gate(meters)));
    if (!open.length) break;
    const spenders = open.filter((c) => c.costsCapital === true);
    if (spenders.length) offered.set(nodeId, (offered.get(nodeId) || 0) + 1);
    const pool = spenders.length ? spenders : open;
    const choice = pool[Math.floor(rand() * pool.length)];
    const r = resolveChoice({ choice, meters, campaign: camp, hardModeEnabled: true, hardModeValue: hardValue, rand, helpers });
    meters = r.meters;
    flags = { ...flags, ...r.newFlags };
    hardValue = r.hardModeValue;
    maxSpent = Math.max(maxSpent, hardValue);
    const next = afterOutcome({ campaign: camp, nodeId: r.destination, flags, meters, hardModeMaxed: false });
    if (next.screen === "ending" || next.screen === "end") break;
    nodeId = r.destination;
  }
  return maxSpent;
}

for (const [id, camp] of Object.entries(CAMPAIGNS)) {
  const offered = new Map();
  const visited = new Map();
  const spent = new Map();
  for (let i = 0; i < RUNS; i++) {
    const s = run(camp, offered, visited);
    spent.set(s, (spent.get(s) || 0) + 1);
  }
  const dist = [...spent.entries()].sort((a, b) => a[0] - b[0]).map(([k, v]) => `${k}:${((v / RUNS) * 100).toFixed(0)}%`).join("  ");
  console.log(`${id}  maxCap ${camp.hardMode.maxCap}  capital spent at the end of a run (greedy): ${dist}`);
  for (const [n, c] of [...offered.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`    offers capital: ${n.padEnd(28)} on ${((c / RUNS) * 100).toFixed(0)}% of runs`);
  }
  console.log();
}
