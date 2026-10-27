// check_demo.mjs: the demo build locks the long case at the choice of road, and the full build never does.
//
// Plays seeded runs through the real screens (the same jsdom driver as verify:ui) on dist/demo/bundle.js and on dist/bundle.js. Run it after `npm run build`.
//   demo: every run ends on "The Case Continues" (the long case reached a road), or on an ending of a minor case, or on a ruin ending (a gauge run
//         to ruin ends the story early in either build); never on an ending of the long case; and at least one run reaches the demo screen
//   full: no run ever shows the demo screen
// Odd seeds open the long case at the shelf and even seeds take a random volume, so that both builds see plenty of the long case.
import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import { playRun } from "../../packages/testkit/src/ui-driver.mjs";
import cfg from "../tests/ui.config.mjs";

const events = JSON.parse(readFileSync("src/content/sherlock/events.json", "utf8"));
const MINOR = ["BAND", "BOHEMIA", "CARBUNCLE", "LEAGUE"];
const ROADS = ["YARD", "STREET", "CONTINENT", "MYCROFT", "HIATUS"];
let failures = 0;
const fail = (m) => {
  failures++;
  console.error("FAIL: " + m);
};

// the endings the demo may end on besides the demo screen: the minor cases' own, and the ruin endings
const targets = (o) => [o.nextNodeId, o.roll?.success.nextNodeId, o.roll?.failure.nextNodeId].filter(Boolean);
const allowedIds = new Set(Object.keys(events.endings).filter((id) => id.startsWith("ENDING_CRISIS")));
for (const n of Object.values(events.nodes)) if (MINOR.includes(n.branch)) for (const o of n.options) for (const t of targets(o)) if (t.startsWith("ENDING_")) allowedIds.add(t);
const allowedTitles = [...allowedIds].map((id) => events.endings[id].title);

// the scenes the demo stops at: the first scene of a road, reached from a scene that is not on a road
const locks = new Set();
for (const n of Object.values(events.nodes)) if (!ROADS.includes(n.branch)) for (const o of n.options) for (const t of targets(o)) if (events.nodes[t] && ROADS.includes(events.nodes[t].branch)) locks.add(t);
if (!locks.size) fail("no scene leads from the opening of the long case onto a road, so the demo would never stop");

const DEMO_TEXT = /The Case Continues/;
const major = (base) => ({
  ...base,
  choose(ctx, policy) {
    if (/Choose a volume/i.test(ctx.text()) && policy.volume === undefined) {
      policy.volume = ctx.seedIsMajor ? 0 : -1;
    }
    if (/The Major Case/.test(ctx.text()) && ctx.seedIsMajor) {
      const first = ctx.buttons().find((b) => b.classList.contains("group"));
      if (first) return first;
    }
    return base.choose(ctx, policy);
  },
});
const withSeed = (base, seed) => {
  const c = major(base);
  const choose = c.choose;
  c.choose = (ctx, policy) => {
    ctx.seedIsMajor = seed % 2 === 1;
    return choose(ctx, policy);
  };
  return c;
};

const demoBundle = readFileSync("dist/demo/bundle.js", "utf8");
const fullBundle = readFileSync("dist/bundle.js", "utf8");
let atDemo = 0;
let minorEnd = 0;
let ruin = 0;
for (const seed of Array.from({ length: 16 }, (_v, i) => i + 1)) {
  const base = { ...cfg, JSDOM, maxSteps: 220, isEnded: (ctx) => DEMO_TEXT.test(ctx.text()) || /Open a New Case/.test(ctx.text()) };
  const r = await playRun(withSeed(base, seed), demoBundle, ["Medium"], seed);
  if (r.error || r.crashed) fail(`demo seed ${seed}: ${r.error ?? "crashed"}`);
  else if (DEMO_TEXT.test(r.lastText)) atDemo++;
  else if (allowedTitles.some((t) => r.lastText.includes(t))) (/Strand Snaps|Collapses|Discredited|Black Dog/.test(r.lastText) ? ruin++ : minorEnd++);
  else fail(`demo seed ${seed}: ended somewhere other than the demo screen, a minor case or a ruin: "${r.lastText.slice(0, 80)}"`);
}
if (!atDemo) fail("no demo run reached the demo screen");

for (const seed of [1, 3, 5, 7, 9, 11]) {
  const base = { ...cfg, JSDOM, maxSteps: 220 };
  const r = await playRun(withSeed(base, seed), fullBundle, ["Easy"], seed);
  if (DEMO_TEXT.test(r.lastText)) fail(`full seed ${seed}: the full build showed the demo screen`);
}
console.log(`demo: ${atDemo} of 16 runs stopped at the demo screen, ${minorEnd} ended a minor case, ${ruin} collapsed first; the full build never showed it (${locks.size} road scenes lock it: ${[...locks].sort().join(", ")}).`);
if (failures) process.exit(1);
