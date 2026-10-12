// The orders on the map, played through the real screens (jsdom).
//   - a report that has its orders drawn shows them lightly on the map, and the order the keyboard is on is drawn in the accent
//   - the order given is drawn on its outcome, and the last orders given are drawn faintly on the next reports
//   - a report whose orders are not drawn shows no arrows
//
// Run after a build: npm run build && node tests/map.test.mjs
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const require = createRequire(join(ROOT, "package.json"));
const { loadEngine } = require("./_load.js");
const { makeContext } = await import(pathToFileURL(join(ROOT, "../packages/testkit/src/ui-driver.mjs")).href);
const cfg = (await import(pathToFileURL(join(HERE, "ui.config.mjs")).href)).default;
process.chdir(ROOT);
const E = loadEngine("dispatches-greatwar.jsx");
const bundle = readFileSync("dist/bundle.js", "utf8");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fails = [];
const check = (ok, what) => { if (!ok) fails.push(what); console.log((ok ? "ok   " : "FAIL ") + what); };
const btn = (ctx, re) => ctx.buttons().find((b) => re.test(ctx.lab(b)));
const orders = (ctx) => ctx.buttons().filter((b) => b.className === "dg-choice");
const count = (ctx, sel) => ctx.d.querySelectorAll(sel).length;

function savedAt(campaignId, nodeId, flags = {}, taken = []) {
  const snap = E.snapshotRun({ campaignId, nodeId, flags, meters: E.emptyMeters(), hardState: E.emptyHardState(), visited: [nodeId], easy: false, taken, history: [] });
  return { dispatches1914_save_v1: JSON.stringify(snap) };
}
async function resume(saved) {
  const ctx = makeContext(cfg, bundle, 11, saved);
  if (ctx.failed) throw new Error(ctx.failed);
  await sleep(200);
  await ctx.settle();
  await ctx.click(btn(ctx, /^Resume file/));
  return ctx;
}
const fire = (ctx, el, type) => el.dispatchEvent(new ctx.w.Event(type, { bubbles: true }));

{
  const ctx = await resume(savedAt("gqg", "gqg_1914_01_frontieres"));
  check(count(ctx, ".dg-op-cand") >= 3, "a report with its orders drawn shows them lightly on the map");
  check(count(ctx, ".dg-op-focus") === 0, "no order is in view at first");
  const attack = orders(ctx)[0];
  attack.focus();
  fire(ctx, attack, "focusin");
  await ctx.settle();
  check(count(ctx, ".dg-op-focus") >= 1, "the order the keyboard is on is drawn in the accent");
  attack.blur();
  fire(ctx, attack, "focusout");
  await ctx.settle();
  check(count(ctx, ".dg-op-focus") === 0, "and not when the focus has left it");
  await ctx.click(attack);
  check(count(ctx, ".dg-op-done") >= 1, "the order given is drawn on its outcome");
  check(count(ctx, ".dg-op-cand") === 0, "the outcome does not draw the orders not given");
  for (let i = 0; i < 3 && !orders(ctx).length; i++) await ctx.click(btn(ctx, /^Continue$/)); // the outcome, and an event if one is due
  check(count(ctx, ".dg-op-past") >= 1, "the order given is drawn faintly on the next report");
  ctx.restore();
}

{
  // a report that has no orders drawn: the gqg report on the Aisne detour has none
  const nodeId = Object.keys(E.CAMPAIGNS.gqg.nodes).find((id) => !E.CAMPAIGNS.gqg.nodes[id].ending && !Object.keys(E.mapOpsOf(id)).length);
  const ctx = await resume(savedAt("gqg", nodeId));
  check(count(ctx, ".dg-op-cand") === 0 && count(ctx, ".dg-op-focus") === 0, "a report whose orders are not drawn shows no arrows");
  ctx.restore();
}

console.log(fails.length ? `\n${fails.length} failure(s).` : "\nThe orders on the map behave.");
process.exit(fails.length ? 1 : 0);
