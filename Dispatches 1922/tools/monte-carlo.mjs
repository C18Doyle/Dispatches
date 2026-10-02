#!/usr/bin/env node
// Monte Carlo over the real 1922 rules: random play through every campaign using src/logic.ts
// (resolveChoice / afterOutcome), so routing, roll stacking, hard mode and nextIf diversion are the
// shipped ones, not a copy. Reports, per campaign:
//   gate-bite rate  share of runs that, at some node, saw a gated choice that was unavailable
//   endings         which endings were reached, and any authored ending that no run reached
//
//   node tools/monte-carlo.mjs [runsPerCampaign=5000] [--hard] [--seed=N]
import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { buildSync } from "esbuild";

const args = process.argv.slice(2);
const RUNS = parseInt(args.find((a) => /^\d+$/.test(a)) || "5000", 10);
const HARD = args.includes("--hard");
const seedArg = args.find((a) => a.startsWith("--seed="));
let seed = seedArg ? parseInt(seedArg.slice(7), 10) >>> 0 : 20260101;
const rand = () => {
  // mulberry32: deterministic so two runs of the tool agree
  seed = (seed + 0x6d2b79f5) >>> 0;
  let t = seed;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const require = createRequire(import.meta.url);
const dir = mkdtempSync(join(tmpdir(), "d1922-mc-"));
const data = readFileSync("src/App.jsx", "utf8").split("// PREVIEW SCREENS")[0].replace(/^export /gm, "") + "\nmodule.exports = { CAMPAIGNS, applyImpact, clampTriangle };\n";
const dataPath = join(dir, "data.cjs");
writeFileSync(dataPath, data);
const { CAMPAIGNS, applyImpact, clampTriangle } = require(dataPath);
const logicPath = join(dir, "logic.mjs");
buildSync({ entryPoints: ["src/logic.ts"], outfile: logicPath, format: "esm", bundle: false });
const { resolveChoice, afterOutcome } = await import(pathToFileURL(resolve(logicPath)).href);
const helpers = { applyImpact, clampTriangle };

function simulate(camp) {
  let meters = { ...camp.initialMeters };
  let flags = {};
  let hardValue = 0;
  let nodeId = camp.start;
  let bitGate = false;
  for (let steps = 0; steps < 300; steps++) {
    const node = camp.resolveNode(nodeId, flags, meters);
    if (!node) return { bitGate, ending: "(dead end: no node)" };
    if (node.isEnding) return { bitGate, ending: nodeId };
    const choices = node.choices || [];
    const open = choices.filter((c) => !(typeof c.gate === "function" && !c.gate(meters)));
    if (open.length < choices.length) bitGate = true;
    if (!open.length) return { bitGate, ending: "(softlock: every choice gated)" };
    const choice = open[Math.floor(rand() * open.length)];
    const r = resolveChoice({ choice, meters, campaign: camp, hardModeEnabled: HARD, hardModeValue: hardValue, rand, helpers });
    meters = r.meters;
    flags = { ...flags, ...r.newFlags };
    hardValue = r.hardModeValue;
    const next = afterOutcome({ campaign: camp, nodeId: r.destination, flags, meters, hardModeMaxed: r.hardModeMaxed });
    if (next.screen === "ending") return { bitGate, ending: next.endingId };
    if (next.screen === "end") return { bitGate, ending: "(END_STUB)" };
    nodeId = r.destination;
  }
  return { bitGate, ending: "(no ending in 300 steps)" };
}

console.log(`Monte Carlo: ${RUNS} runs per campaign${HARD ? ", hard mode" : ""}, seed ${seedArg ? seedArg.slice(7) : "default"}\n`);
for (const [id, camp] of Object.entries(CAMPAIGNS)) {
  let bites = 0;
  const endings = new Map();
  for (let i = 0; i < RUNS; i++) {
    const { bitGate, ending } = simulate(camp);
    if (bitGate) bites++;
    endings.set(ending, (endings.get(ending) || 0) + 1);
  }
  console.log(`${id}: gate-bite rate ${((bites / RUNS) * 100).toFixed(1)}% (${bites}/${RUNS})`);
  const authored = Object.keys(camp.ENDING_CLASSIFICATION || {});
  const sorted = [...endings.entries()].sort((a, b) => b[1] - a[1]);
  for (const [e, n] of sorted) console.log(`    ${String(n).padStart(6)}  ${e}`);
  const never = authored.filter((e) => !endings.has(e));
  if (never.length) console.log(`    never reached in ${RUNS} random runs: ${never.join(", ")}`);
  console.log();
}
