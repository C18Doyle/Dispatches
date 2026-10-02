#!/usr/bin/env node
/**
 * monte-carlo.js — ad hoc gate-bite-rate / reachability simulator.
 * Not persisted from an earlier round (none was found on disk), rewritten
 * to replicate handleChoose()'s actual logic (uncertain roll, applyImpact,
 * clampTriangle, nextIf diversion) closely enough for a fair before/after
 * comparison on the bolsheviks gate-threshold change.
 *
 * "Gate bite" definition (matches the recommendations doc's framing): a run
 * "hits a gate" if, at any node visited along its path, at least one choice
 * at that node was gated AND that gate evaluated false against the meters
 * in hand at the time (i.e. a choice the player could see was actually
 * unavailable to them at that moment) — not just that a gate exists on the
 * node somewhere in the abstract.
 *
 * Usage: node monte-carlo.js path/to/dispatches-1917.jsx [runsPerCampaign]
 */
const fs = require("fs");
const path = require("path");

const filePath = process.argv[2];
const RUNS = parseInt(process.argv[3] || "20000", 10);
if (!filePath) {
  console.error("Usage: node monte-carlo.js path/to/dispatches-1917.jsx [runs]");
  process.exit(1);
}

const raw = fs.readFileSync(filePath, "utf8");
let dataSrc = raw.split("// PREVIEW SCREENS")[0];
dataSrc = dataSrc.replace(/^export /gm, "");
dataSrc += "\nmodule.exports = { CAMPAIGNS, applyImpact, clampTriangle };\n";
const tmpPath = filePath + ".__mc_tmp.js";
fs.writeFileSync(tmpPath, dataSrc);
const { CAMPAIGNS, applyImpact, clampTriangle } = require(path.resolve(tmpPath));
fs.unlinkSync(tmpPath);

function simulateOne(camp) {
  let meters = { ...camp.initialMeters };
  let flags = {};
  let nodeId = camp.start;
  let hitGate = false;
  let steps = 0;
  const seen = new Set();
  while (nodeId && nodeId !== "END_STUB" && steps < 200) {
    if (seen.has(nodeId) && steps > 60) break; // safety valve against accidental loops
    seen.add(nodeId);
    const node = camp.resolveNode(nodeId, flags, meters);
    if (!node) break;
    if (node.isEnding) break;
    const choices = node.choices || [];
    if (!choices.length) break;
    const gatedOut = choices.filter((c) => typeof c.gate === "function" && !c.gate(meters));
    const available = choices.filter((c) => !(typeof c.gate === "function" && !c.gate(meters)));
    if (gatedOut.length > 0) hitGate = true;
    if (!available.length) break; // softlock, shouldn't happen per check-gates.js
    const choice = available[Math.floor(Math.random() * available.length)];

    let impact = choice.impact || {};
    let newFlags = { ...(choice.setFlags || {}) };
    if (choice.uncertain) {
      const roll = Math.random() * 100;
      let cumulative = 0;
      let picked = choice.uncertain[choice.uncertain.length - 1];
      for (const entry of choice.uncertain) {
        cumulative += entry.weight;
        if (roll <= cumulative) { picked = entry; break; }
      }
      impact = { ...impact };
      for (const k of Object.keys(picked.impact || {})) {
        impact[k] = (impact[k] || 0) + picked.impact[k];
      }
      newFlags = { ...newFlags, ...(picked.setFlags || {}) };
    }
    const nextMeters = applyImpact(meters, impact);
    meters = clampTriangle(nextMeters, camp.triangleAxes.map((a) => a.key));
    flags = { ...flags, ...newFlags };

    let destination = choice.next;
    if (typeof choice.nextIf === "function") {
      const diverted = choice.nextIf(meters);
      if (diverted) destination = diverted;
    }
    nodeId = destination;
    steps++;
  }
  return hitGate;
}

console.log(`Monte Carlo: ${RUNS} runs per campaign\n`);
for (const [id, camp] of Object.entries(CAMPAIGNS)) {
  let bites = 0;
  for (let i = 0; i < RUNS; i++) {
    if (simulateOne(camp)) bites++;
  }
  const pct = ((bites / RUNS) * 100).toFixed(1);
  console.log(`${id.padEnd(14)} gate-bite rate: ${pct}%  (${bites}/${RUNS})`);
}
