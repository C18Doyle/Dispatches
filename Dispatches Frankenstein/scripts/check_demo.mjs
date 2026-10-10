// check_demo.mjs: the demo build locks at the end of Act I, and the full build never does.
//
// Plays seeded runs through the real screens (the same jsdom driver as verify:ui) on dist/demo/bundle.js and on dist/bundle.js. Run it after `npm run build`.
//   demo: every run ends on "Here the Demo Ends" or on a collapse ending (a resource run to ruin ends the story early in either build), never on a
//         narrative ending; and at least one run reaches the demo screen
//   full: no run ever shows the demo screen
// Also: the scenes the demo stops at are the scenes a starting-branch (Act I) choice leads into on another branch, so a content change that moves the
// act boundary is noticed here.
import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import { playRun } from "../../packages/testkit/src/ui-driver.mjs";
import cfg from "../tests/ui.config.mjs";

const events = JSON.parse(readFileSync("src/content/frankenstein/events.json", "utf8"));
const config = JSON.parse(readFileSync("src/content/frankenstein/config.json", "utf8"));
const targets = (o) => [o.nextNodeId, o.roll?.success.nextNodeId, o.roll?.failure.nextNodeId].filter(Boolean);
const lockScenes = new Set();
for (const n of Object.values(events.nodes))
  if (n.branch === config.startBranch) for (const o of n.options) for (const t of targets(o)) if (events.nodes[t] && events.nodes[t].branch !== config.startBranch) lockScenes.add(t);
const climaxes = [...lockScenes].sort();
let failures = 0;
const fail = (m) => {
  failures++;
  console.error("FAIL: " + m);
};
if (climaxes.join(",") !== "8A,8B,8B-SURGE,8C") fail(`the demo locks on ${climaxes.join(", ")}; expected 8A, 8B, 8B-SURGE, 8C (update this check if the act boundary moved on purpose)`);

const DEMO_TEXT = /End of Act I/;
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
