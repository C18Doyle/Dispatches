// Follows the historical record through each campaign on the real rules (src/logic.ts), and measures how well the game keeps to it.
//
// The spine is the path that takes the choice flagged `historical: true` at every report. At every contested roll on the spine the tool branches on each
// outcome with its weight (as the roll stands at that point), so it reports every ending a player who follows the record can reach, with its probability.
// Hard failures (a game that cannot follow its own record):
//   - a report on the spine has no historical choice, or more than one
//   - the historical choice is gated (unavailable) at that point of the spine
//   - the spine dead-ends, loops, or ends at no ending
//   - the most likely ending of the spine is not a historical ending
// Reported, and ratcheted in tests/spine-baseline.json (it may go up, never down by more than a point):
//   - the share of spine runs that end at a historical ending
//   - the share of random runs that end at a historical ending, and where random runs first leave the record
//
//   node tools/historical-spine.mjs [--random=3000] [--write-baseline]
import { readFileSync, writeFileSync, mkdtempSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { buildSync } from "esbuild";

const args = process.argv.slice(2);
const RANDOM = Number((args.find((a) => a.startsWith("--random=")) || "--random=3000").slice(9));
const WRITE = args.includes("--write-baseline");

const require = createRequire(import.meta.url);
const dir = mkdtempSync(join(tmpdir(), "d1922-spine-"));
const data = readFileSync("src/App.jsx", "utf8").split("// PREVIEW SCREENS")[0].replace(/^export /gm, "") + "\nmodule.exports = { CAMPAIGNS, applyImpact, clampTriangle };\n";
require("node:fs").writeFileSync(join(dir, "data.cjs"), data);
const { CAMPAIGNS, applyImpact, clampTriangle } = require(join(dir, "data.cjs"));
buildSync({ entryPoints: ["src/logic.ts"], outfile: join(dir, "logic.mjs"), format: "esm", bundle: false });
const { resolveChoice, afterOutcome } = await import(pathToFileURL(resolve(join(dir, "logic.mjs"))).href);
const helpers = { applyImpact, clampTriangle };

let seed = 20261014;
const rand = () => {
  seed = (seed + 0x6d2b79f5) >>> 0;
  let t = seed;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const problems = [];
const report = {};
const baselinePath = "tests/spine-baseline.json";
const baseline = existsSync(baselinePath) ? JSON.parse(readFileSync(baselinePath, "utf8")) : {};

// An ending id can name a checkpoint report that resolves to the real ending from the flags and meters, so endings are keyed by what they resolve to.
function resolveEnding(camp, id, flags, meters) {
  const n = camp.resolveNode(id, flags, meters) || {};
  return { key: (n.title || id) + "|" + (n.classification || (camp.ENDING_CLASSIFICATION || {})[id] || "?"), title: n.title || id, historical: (n.classification || (camp.ENDING_CLASSIFICATION || {})[id]) === "historical" };
}

/** Every ending reachable by following the record, with its probability. */
function spine(cid, camp) {
  const out = new Map(); // ending id -> probability
  const spineNodes = new Set();
  let paths = 0;
  function walk(nodeId, meters, flags, hardValue, p, depth, trail) {
    if (depth > 120) {
      problems.push(`${cid}: the spine does not end (120 reports) after ${trail.slice(-4).join(" > ")}`);
      return;
    }
    const node = camp.resolveNode(nodeId, flags, meters);
    if (!node) {
      problems.push(`${cid}: ${nodeId} resolves to nothing`);
      return;
    }
    if (node.isEnding) {
      const e = resolveEnding(camp, nodeId, flags, meters);
      out.set(e.key, { ...e, p: (out.get(e.key)?.p || 0) + p });
      paths++;
      return;
    }
    spineNodes.add(nodeId);
    const hist = (node.choices || []).filter((c) => c.historical === true);
    if (hist.length !== 1) {
      problems.push(`${cid}/${nodeId}: ${hist.length} historical choices on the spine (expected 1)`);
      return;
    }
    const choice = hist[0];
    if (typeof choice.gate === "function" && !choice.gate(meters)) {
      problems.push(`${cid}/${nodeId}: the historical choice is gated at this point of the record (${choice.disabledReason ? choice.disabledReason.slice(0, 60) : "no reason given"})`);
      return;
    }
    const roll = choice.uncertain && choice.uncertain.length ? choice.uncertain : null;
    const outcomes = roll ? roll.map((u, i) => ({ i, weight: u.weight })) : [{ i: -1, weight: 100 }];
    const total = outcomes.reduce((s, o) => s + o.weight, 0) || 100;
    for (const o of outcomes) {
      // a roll value that lands in this outcome's band
      const before = outcomes.slice(0, o.i < 0 ? 0 : o.i).reduce((s, x) => s + x.weight, 0);
      const r = o.i < 0 ? 0.5 : (before + o.weight / 2) / total;
      const res = resolveChoice({ choice, meters, campaign: camp, hardModeEnabled: false, hardModeValue: hardValue, rand: () => r, helpers });
      const next = afterOutcome({ campaign: camp, nodeId: res.destination, flags: { ...flags, ...res.newFlags }, meters: res.meters, hardModeMaxed: res.hardModeMaxed });
      const pp = p * (o.weight / total);
      if (next.screen === "ending") {
        const e = resolveEnding(camp, next.endingId, { ...flags, ...res.newFlags }, res.meters);
        out.set(e.key, { ...e, p: (out.get(e.key)?.p || 0) + pp });
        paths++;
      } else if (next.screen === "end") {
        problems.push(`${cid}/${nodeId}: the spine reaches END_STUB`);
      } else {
        walk(res.destination, res.meters, { ...flags, ...res.newFlags }, res.hardModeValue, pp, depth + 1, [...trail, nodeId]);
      }
    }
  }
  walk(camp.start, { ...camp.initialMeters }, {}, 0, 1, 0, []);
  return { out, spineNodes, paths };
}

/** Random play (seeded): how often does a run end at a historical ending, and at which report does it first leave the record? */
function randomRuns(camp, runs) {
  let hist = 0;
  const leave = new Map();
  for (let i = 0; i < runs; i++) {
    let meters = { ...camp.initialMeters };
    let flags = {};
    let hard = 0;
    let nodeId = camp.start;
    let left = null;
    for (let step = 0; step < 200; step++) {
      const node = camp.resolveNode(nodeId, flags, meters);
      if (!node || node.isEnding) break;
      const open = (node.choices || []).filter((c) => !(typeof c.gate === "function" && !c.gate(meters)));
      if (!open.length) break;
      const choice = open[Math.floor(rand() * open.length)];
      if (!left && choice.historical !== true) left = nodeId;
      const res = resolveChoice({ choice, meters, campaign: camp, hardModeEnabled: false, hardModeValue: hard, rand, helpers });
      meters = res.meters;
      flags = { ...flags, ...res.newFlags };
      hard = res.hardModeValue;
      const next = afterOutcome({ campaign: camp, nodeId: res.destination, flags, meters, hardModeMaxed: res.hardModeMaxed });
      if (next.screen === "ending") {
        if (resolveEnding(camp, next.endingId, flags, meters).historical) hist++;
        break;
      }
      nodeId = res.destination;
    }
    leave.set(left || "(never)", (leave.get(left || "(never)") || 0) + 1);
  }
  return { hist: hist / runs, leave: [...leave.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([n, c]) => `${n} ${Math.round((c / runs) * 100)}%`) };
}

for (const [cid, camp] of Object.entries(CAMPAIGNS)) {
  const { out, spineNodes, paths } = spine(cid, camp);
  const ranked = [...out.values()].sort((a, b) => b.p - a.p);
  const histShare = ranked.filter((e) => e.historical).reduce((s, e) => s + e.p, 0);
  if (!ranked.length) problems.push(`${cid}: the spine reaches no ending`);
  else if (!ranked[0].historical) problems.push(`${cid}: the most likely ending of the record is "${ranked[0].title}", which is not a historical ending`);
  const rnd = randomRuns(camp, RANDOM);
  const nodes = camp.NODE_ATLAS.length;
  report[cid] = { spineReports: spineNodes.size, reports: nodes, spineEndings: ranked.map((e) => ({ ending: e.title, historical: e.historical, p: Math.round(e.p * 1000) / 1000 })), spineHistoricalShare: Math.round(histShare * 1000) / 1000, randomHistoricalShare: Math.round(rnd.hist * 1000) / 1000, firstLeave: rnd.leave, paths };
  const b = baseline[cid];
  if (b && histShare < b.spineHistoricalShare - 0.01) problems.push(`${cid}: a player following the record now reaches the historical ending ${(histShare * 100).toFixed(1)}% of the time, down from ${(b.spineHistoricalShare * 100).toFixed(1)}%`);
  if (b && spineNodes.size < b.spineReports) problems.push(`${cid}: the spine is shorter (${spineNodes.size} reports, was ${b.spineReports})`);
}

for (const [cid, r] of Object.entries(report)) {
  console.log(`${cid}: the record runs through ${r.spineReports} of ${r.reports} reports`);
  for (const e of r.spineEndings) console.log(`    ${(e.p * 100).toFixed(1).padStart(5)}%  ${e.historical ? "historical " : "speculative"}  ${e.ending}`);
  console.log(`    following the record ends at a historical ending ${(r.spineHistoricalShare * 100).toFixed(1)}% of the time; random play ${(r.randomHistoricalShare * 100).toFixed(1)}%; random play first leaves the record at: ${r.firstLeave.join(", ")}`);
}
if (WRITE) {
  const out = Object.fromEntries(Object.entries(report).map(([cid, r]) => [cid, { spineReports: r.spineReports, spineHistoricalShare: r.spineHistoricalShare, randomHistoricalShare: r.randomHistoricalShare }]));
  writeFileSync(baselinePath, JSON.stringify(out, null, 2) + "\n");
  console.log("wrote " + baselinePath);
}
console.log(`\nspine: ${problems.length} problem(s).`);
for (const p of problems) console.log("  " + p);
process.exit(problems.length ? 1 : 0);
