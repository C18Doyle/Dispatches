// The battle rig (a build with DEV_RIG true, dist/rig/bundle.js), through the real screens (jsdom):
//   - the menu has a Battle rig entry, and the full game's menu has none
//   - the rig lists every Order of Battle, and a battle opens at once, with the enemy that was chosen
//   - the battle can be fought to its result, and the result goes back to the rig, leaving no file saved
//
// Run after a build: npm run build && node tests/rig.test.mjs
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
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fails = [];
const check = (ok, what) => { if (!ok) fails.push(what); console.log((ok ? "ok   " : "FAIL ") + what); };
const btn = (ctx, re) => ctx.buttons().find((b) => re.test(ctx.lab(b)));

const full = makeContext(cfg, readFileSync("dist/bundle.js", "utf8"), 11, {});
await sleep(150); await full.settle();
check(!btn(full, /^Battle rig/), "the full game's menu has no battle rig");
full.restore();

const ctx = makeContext(cfg, readFileSync("dist/rig/bundle.js", "utf8"), 11, {});
if (ctx.failed) throw new Error(ctx.failed);
await sleep(200); await ctx.settle();
check(!!btn(ctx, /^Battle rig/), "the rig build's menu has a battle rig");
await ctx.click(btn(ctx, /^Battle rig/));
const fights = ctx.buttons().filter((b) => /^Fight this battle/.test(ctx.lab(b)));
check(fights.length === Object.keys(E.BATTLES).length, "the rig lists every battle (" + fights.length + ")");
await ctx.click(fights[0]);
check(/Order of Battle/.test(ctx.text()) && !!btn(ctx, /Let the staff plan it/), "a battle opens at once on its planning screen");
await ctx.click(btn(ctx, /Let the staff plan it/));
await ctx.click(btn(ctx, /^Issue the plan/));
check(/The second day/.test(ctx.text()), "the plan opens the second day");
check(!!ctx.d.querySelector(".dg-sketch") && ctx.d.querySelectorAll(".dg-bulletins li").length === 4, "the second day opens on the morning's four bulletins and a sketch of the line");
await ctx.click(btn(ctx, /^Carry on to the second day/));
check(/After-action report/.test(ctx.text()), "the battle ends in its report");
check(ctx.d.querySelectorAll(".dg-day .dg-stage").length === 3 && ctx.d.querySelectorAll(".dg-day .dg-bulletins li").length === 12, "the report gives the morning, noon and evening bulletins, four each");
await ctx.click(btn(ctx, /^Continue$/));
check(ctx.buttons().filter((b) => /^Fight this battle/.test(ctx.lab(b))).length === fights.length, "the result goes back to the rig");
check(!ctx.w.localStorage.getItem("dispatches1914_save_v1"), "nothing of the battle is saved as a file");
ctx.restore();
console.log(fails.length ? `\n${fails.length} FAILED` : "\nThe battle rig behaves.");
process.exit(fails.length ? 1 : 0);
