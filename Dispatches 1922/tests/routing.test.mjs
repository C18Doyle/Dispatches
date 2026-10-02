// Roll routing test: every choice whose roll outcomes name their own `next` must route there.
// Loads the real CAMPAIGNS (data section of src/App.jsx, as the validators do) and the real
// src/logic.ts, then forces each roll outcome in turn.
//   node tests/routing.test.mjs
import { readFileSync, writeFileSync, unlinkSync, mkdtempSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { buildSync } from "esbuild";

const require = createRequire(import.meta.url);
const dir = mkdtempSync(join(tmpdir(), "d1922-"));

// CAMPAIGNS + helpers from the data section.
const data = readFileSync("src/App.jsx", "utf8").split("// PREVIEW SCREENS")[0].replace(/^export /gm, "") + "\nmodule.exports = { CAMPAIGNS, applyImpact, clampTriangle };\n";
const dataPath = join(dir, "data.cjs");
writeFileSync(dataPath, data);
const { CAMPAIGNS, applyImpact, clampTriangle } = require(dataPath);

// logic.ts compiled to a temp ES module.
const logicPath = join(dir, "logic.mjs");
buildSync({ entryPoints: ["src/logic.ts"], outfile: logicPath, format: "esm", bundle: false });
const { resolveChoice } = await import(pathToFileURL(resolve(logicPath)).href);

let checked = 0;
let failures = 0;
const fail = (m) => {
  failures++;
  console.error("FAIL: " + m);
};

for (const [campaignId, camp] of Object.entries(CAMPAIGNS)) {
  const seen = new Set();
  const queue = [camp.start];
  while (queue.length) {
    const nodeId = queue.pop();
    if (!nodeId || seen.has(nodeId)) continue;
    seen.add(nodeId);
    const node = camp.resolveNode(nodeId, {}, camp.initialMeters);
    if (!node) continue;
    for (const choice of node.choices || []) {
      if (choice.next) queue.push(choice.next);
      for (const u of choice.uncertain || []) if (u.next) queue.push(u.next);
      if (!choice.uncertain || !choice.uncertain.some((u) => u.next)) continue;
      // Force each outcome: pick a roll value inside that outcome's cumulative band.
      let cum = 0;
      const total = choice.uncertain.reduce((a, v) => a + v.weight, 0);
      choice.uncertain.forEach((u, idx) => {
        const lo = cum;
        cum += u.weight;
        const roll = idx === choice.uncertain.length - 1 ? Math.min(99.9, lo + 0.01) : (lo + cum) / 2;
        const res = resolveChoice({
          choice,
          meters: camp.initialMeters,
          campaign: camp,
          hardModeEnabled: false,
          hardModeValue: 0,
          rand: () => roll / 100,
          helpers: { applyImpact, clampTriangle },
        });
        checked++;
        const expected = u.next || choice.next;
        // nextIf may legitimately divert on a catastrophic meter state; initial meters never trigger it here.
        if (res.destination !== expected) fail(`${campaignId}/${nodeId} outcome ${idx} ("${u.title}") routed to ${res.destination}, expected ${expected}`);
      });
      void total;
    }
  }
}
unlinkSync(dataPath);
unlinkSync(logicPath);
if (failures) {
  console.error(`\nROUTING FAILED: ${failures} of ${checked} outcome(s).`);
  process.exit(1);
}
console.log(`ROUTING OK: ${checked} roll outcome(s) with their own destination route correctly.`);
