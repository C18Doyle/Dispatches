#!/usr/bin/env node
/**
 * walk-historical.js — traces the historical-choice spine of each campaign.
 * At every node, picks the choice flagged historical:true (if more than one
 * is historical, or none is, that's flagged loudly rather than guessed at
 * silently). Where a choice resolves via `uncertain` (a weighted roll),
 * rolls it for real using the stated weights. Walks to END and prints the
 * full node sequence, so convergence questions can be checked against what
 * the canonical playthrough actually passes through, not just prose read
 * in isolation.
 */
const fs = require("fs");
const filePath = process.argv[2];
let dataSrc = fs.readFileSync(filePath, "utf8").split("// PREVIEW SCREENS")[0];
dataSrc = dataSrc.replace(/^export /gm, "");
dataSrc += "\nmodule.exports = { CAMPAIGNS };\n";
const tmpPath = filePath + ".__walk_tmp.js";
fs.writeFileSync(tmpPath, dataSrc);
const { CAMPAIGNS } = require(require("path").resolve(tmpPath));
fs.unlinkSync(tmpPath);

for (const [campaignId, camp] of Object.entries(CAMPAIGNS)) {
  console.log(`\n=== ${campaignId} (start: ${camp.start}) ===`);
  let nodeId = camp.start;
  let flags = {};
  let meters = {};
  const seen = [];
  let steps = 0;
  while (nodeId && nodeId !== "END" && nodeId !== "END_STUB" && steps < 200) {
    steps++;
    const node = camp.resolveNode(nodeId, flags, meters);
    if (!node) { console.log(`  ! resolveNode returned nothing for ${nodeId}`); break; }
    if (node.isEnding) { console.log(`  -> ENDING: ${nodeId}`); break; }
    seen.push(nodeId);
    const historicalChoices = (node.choices || []).filter((c) => c.historical);
    if (historicalChoices.length !== 1) {
      console.log(`  ! ${nodeId}: ${historicalChoices.length} historical:true choices (expected 1) — stopping`);
      break;
    }
    const choice = historicalChoices[0];
    flags = { ...flags, ...(choice.setFlags || {}) };
    console.log(`  ${nodeId} --[${choice.label.slice(0, 50)}]--> ${choice.next}`);
    if (choice.uncertain) {
      const roll = Math.random() * 100;
      let acc = 0;
      let picked = null;
      for (const branch of choice.uncertain) {
        acc += branch.weight;
        if (roll <= acc) { picked = branch; break; }
      }
      picked = picked || choice.uncertain[choice.uncertain.length - 1];
      flags = { ...flags, ...(picked.setFlags || {}) };
      console.log(`      [roll ${roll.toFixed(1)} -> "${picked.title}"] flags: ${JSON.stringify(picked.setFlags || {})}`);
    }
    nodeId = choice.next;
  }
  console.log(`  path length: ${seen.length} nodes`);
  console.log(`  final flags: ${JSON.stringify(flags)}`);
}
