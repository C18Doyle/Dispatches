// check_demo.mjs: the demo build stops at the last choice of each track, and the full build never does.
//
// Plays seeded runs through the real screens (the same jsdom driver as verify:ui) on dist/demo/bundle.js and on dist/bundle.js. Run it after `npm run build`.
//   demo: every run ends on "Here the Demo Ends" or on a collapse ending (a resource run to ruin ends the story early in either build), never on a
//         narrative ending; and at least one run reaches the demo screen
//   full: no run ever shows the demo screen
// Also: the scenes the demo stops at are exactly the three climaxes (so a content change that moves an ending is noticed here).
import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import { playRun } from "../../packages/testkit/src/ui-driver.mjs";
import cfg from "../tests/ui.config.mjs";

const events = JSON.parse(readFileSync("src/content/frankenstein/events.json", "utf8"));
const climaxes = Object.entries(events.nodes)
  .filter(([, n]) => n.options.some((o) => o.nextNodeId.startsWith("ENDING_") || o.roll?.success.nextNodeId?.startsWith("ENDING_") || o.roll?.failure.nextNodeId?.startsWith("ENDING_")))
  .map(([id]) => id)
  .sort();
let failures = 0;
const fail = (m) => {
  failures++;
  console.error("FAIL: " + m);
};
if (climaxes.join(",") !== "15A,15B,15C") fail(`the demo stops at ${climaxes.join(", ")}; expected 15A, 15B, 15C (update this check if the climaxes moved on purpose)`);

const DEMO_TEXT = /Here the Demo Ends/;
const demoCfg = { ...cfg, JSDOM, isEnded: (ctx) => DEMO_TEXT.test(ctx.text()) || /Begin a New Experiment/.test(ctx.text()) };
const demoBundle = readFileSync("dist/demo/bundle.js", "utf8");
const fullBundle = readFileSync("dist/bundle.js", "utf8");

let atDemo = 0;
let collapsed = 0;
for (const seed of [1, 2, 3, 4, 5, 6, 7, 8]) {
  const r = await playRun(demoCfg, demoBundle, ["Medium"], seed);
  if (r.error || r.crashed) fail(`demo seed ${seed}: ${r.error ?? "crashed"}`);
  else if (DEMO_TEXT.test(r.lastText)) atDemo++;
  else if (/The Work Collapses/.test(r.lastText)) collapsed++;
  else fail(`demo seed ${seed}: ended somewhere other than the demo screen or a collapse: "${r.lastText.slice(0, 80)}"`);
}
if (!atDemo) fail("no demo run reached the demo screen");

for (const seed of [1, 2, 3, 4]) {
  const r = await playRun(cfg, fullBundle, ["Easy"], seed);
  if (DEMO_TEXT.test(r.lastText)) fail(`full seed ${seed}: the full build showed the demo screen`);
}
console.log(`demo: ${atDemo} of 8 runs stopped at the demo screen, ${collapsed} collapsed first; the full build never showed it.`);
if (failures) process.exit(1);
console.log("Demo build looks right.");
