// Easy mode: the command has its own name, every order shows its effect on the meters, a contested order lists
// its outcomes with odds, and the last order can be taken back (the report comes back exactly as it was, and an
// ending seen only in the outcome is not left "discovered"). Standard and hard mode show none of it.
//
// Run after a build: npm run build && node tests/easy-mode.test.mjs
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const { makeContext } = await import(pathToFileURL(join(ROOT, "../packages/testkit/src/ui-driver.mjs")).href);
const cfg = (await import(pathToFileURL(join(HERE, "ui.config.mjs")).href)).default;
process.chdir(ROOT);
const bundle = readFileSync("dist/bundle.js", "utf8");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const fails = [];
const check = (ok, what) => {
  if (!ok) fails.push(what);
  console.log((ok ? "ok   " : "FAIL ") + what);
};

const SOUTH = ["southRussia", "Armed Forces of South Russia"];

async function play(mode, seed = 3) {
  const ctx = makeContext(cfg, bundle, seed);
  if (ctx.failed) throw new Error(ctx.failed);
  await sleep(300);
  await ctx.settle();
  const err = await cfg.setup(ctx, [SOUTH[0], SOUTH[1], mode]);
  if (err) throw new Error(err);
  return ctx;
}
const orders = (ctx) => ctx.buttons().filter((b) => ctx.lab(b) === "ISSUE THE ORDER");
const find = (ctx, re) => ctx.buttons().find((b) => re.test(ctx.lab(b)));

// --- easy: name, preview on every open order ------------------------------------------------------------
{
  const ctx = await play("easy");
  const text = ctx.text();
  check(/EASY: TACHANKA COMMAND/.test(text), "easy: the briefing names the command (Tachanka Command)");
  const n = orders(ctx).length;
  const previews = (text.match(/IF YOU ISSUE THIS ORDER/g) || []).length;
  check(n > 0 && previews === n, `easy: every open order shows a preview (${previews} of ${n})`);

  // rewind: issue the first order, take it back, the report must be exactly as before
  const before = ctx.hash();
  await ctx.click(orders(ctx)[0]);
  check(/OUTCOME/.test(ctx.text()), "easy: issuing an order reaches its outcome");
  const back = find(ctx, /^TAKE BACK THIS ORDER$/);
  check(!!back, "easy: the outcome offers to take the order back");
  await ctx.click(back);
  check(ctx.hash() === before, "easy: after taking it back the report is exactly as it was");
  check(!find(ctx, /^TAKE BACK THIS ORDER$/), "easy: no take-back button on the report itself");

  // the save keeps the mode
  const save = ctx.w.localStorage.getItem("dispatches1922_save_v1");
  check(!!save && JSON.parse(save).easyMode === true, "easy: the saved run records Easy mode");

  // a contested order lists every outcome with odds somewhere on the way
  let sawOdds = /Before the roll/.test(ctx.text());
  for (let i = 0; i < 60 && !sawOdds; i++) {
    const o = orders(ctx);
    if (o.length) await ctx.click(o[o.length - 1]);
    else {
      const next = find(ctx, /^(CONTINUE|PROCEED|NEXT)/i);
      if (!next) break;
      await ctx.click(next);
    }
    sawOdds = /Before the roll/.test(ctx.text());
  }
  check(sawOdds, "easy: a contested order lists its outcomes with odds");
  ctx.restore();
}

// --- an ending is not unlocked by looking at the outcome and taking the order back -----------------------
{
  const ctx = await play("easy", 5);
  let hit = null;
  for (let i = 0; i < 80 && !hit; i++) {
    const o = orders(ctx);
    if (o.length) {
      // a fresh view of the discovery log before the order
      const was = ctx.w.localStorage.getItem("dispatches1922_discovered_v1");
      await ctx.click(o[0]);
      const back = find(ctx, /^TAKE BACK THIS ORDER$/);
      if (back) {
        await ctx.click(back);
        const now = ctx.w.localStorage.getItem("dispatches1922_discovered_v1");
        check(now === was, "easy: taking an order back leaves the discovery log as it was");
        hit = true;
      }
    } else {
      const next = find(ctx, /^(CONTINUE|PROCEED|NEXT)/i);
      if (!next) break;
      await ctx.click(next);
    }
  }
  check(!!hit, "easy: the discovery check ran");
  ctx.restore();
}

// --- standard and hard: none of it ------------------------------------------------------------------------
for (const [mode, name] of [[false, "standard"], [true, "hard"]]) {
  const ctx = await play(mode);
  check(!/IF YOU ISSUE THIS ORDER/.test(ctx.text()), `${name}: no effect preview on the orders`);
  check(!/EASY: /.test(ctx.text()), `${name}: no Easy banner`);
  await ctx.click(orders(ctx)[0]);
  check(!find(ctx, /^TAKE BACK THIS ORDER$/), `${name}: no take-back button`);
  ctx.restore();
}

if (fails.length) {
  console.log(`\n${fails.length} failure(s)`);
  process.exit(1);
}
console.log("\neasy-mode: all checks passed");
