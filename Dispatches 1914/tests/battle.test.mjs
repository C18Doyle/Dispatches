// The Order of Battle, played through the real screens (jsdom).
//   - the menu offers "Take control of battle planning", on by default
//   - an order that hosts a battle (the French attack on the Marne) opens the planning screen, with an intelligence line, a pool of chits and the formations
//   - the plan cannot be issued until the pool is placed and an approach chosen; the staff can plan it
//   - issuing it ends in the outcome with an after-action report, and the next report reads how the battle was fought
//   - "Back to the order" returns to the order without spending it
//   - with the planning switched off the same order resolves at once, with no screen and no report
//   - a file saved on the outcome screen resumes with its report
//
// Run after a build: npm run build && node tests/battle.test.mjs
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

async function boot(storage) {
  const ctx = makeContext(cfg, bundle, 11, storage);
  if (ctx.failed) throw new Error(ctx.failed);
  await sleep(200);
  await ctx.settle();
  return ctx;
}
const btn = (ctx, re) => ctx.buttons().find((b) => re.test(ctx.lab(b)));
const orders = (ctx) => ctx.buttons().filter((b) => b.className === "dg-choice");
const snapshot = (ctx) => {
  const o = {};
  for (let i = 0; i < ctx.w.localStorage.length; i++) {
    const k = ctx.w.localStorage.key(i);
    o[k] = ctx.w.localStorage.getItem(k);
  }
  return o;
};
/** Play GQG up to the Marne node, taking the first order each time. */
async function toMarne(ctx) {
  await ctx.click(ctx.buttons().find((b) => ctx.lab(b).includes("Grand Quartier")));
  for (let i = 0; i < 40 && !/The Flank in the Open/.test(ctx.text()); i++) {
    const o = orders(ctx);
    if (o.length) await ctx.click(o.find((b) => !b.disabled) || o[0]);
    else await ctx.click(btn(ctx, /^Continue$/));
  }
  return /The Flank in the Open/.test(ctx.text());
}

// --- the menu ----------------------------------------------------------------------------------------------
{
  const ctx = await boot();
  const box = ctx.d.querySelector('input[type="checkbox"]');
  check(!!box && box.checked, "the menu offers battle planning, switched on");
  check(/Take control of battle planning/.test(ctx.text()), "the menu names it");
  ctx.restore();
}

// --- the planning screen -----------------------------------------------------------------------------------
const ctx = await boot();
check(await toMarne(ctx), "the Marne node is reached");
await ctx.click(orders(ctx).find((b) => /Turn and attack/.test(ctx.lab(b))));
let t = ctx.text();
check(/ORDER OF BATTLE/.test(t) && /Order of Battle: the Marne/.test(t), "the attack opens the planning screen");
check(/INTELLIGENCE SUMMARY/.test(t), "the screen gives an intelligence line");
check(/6 of 6 chits left/.test(t) || /\d of \d chits left/.test(t), "the pool is shown");
const issue = () => btn(ctx, /^Issue the plan/);
{ const i = ctx.d.querySelector(".dg-issue"); check(!!i && i.disabled, "the plan cannot be issued with the pool unplaced"); }
check(ctx.d.querySelectorAll(".dg-bt-arm").length === 4, "four arms are listed");
check(/Maunoury's Sixth Army/.test(ctx.d.querySelector(".dg-bt-arm details").textContent), "an arm lists its real formations");
await ctx.click(btn(ctx, /^More in The Sixth Army/));
check(/5 of 6 chits left/.test(ctx.text()), "placing a chit uses the pool");
await ctx.click(btn(ctx, /^Clear the plan/));
check(/6 of 6 chits left/.test(ctx.text()), "the plan can be cleared");

// back to the order, nothing spent
await ctx.click(btn(ctx, /^Back to the order/));
check(orders(ctx).some((b) => /Turn and attack/.test(ctx.lab(b))), "back to the order returns to the node with its orders");

// the staff plan, then issue
await ctx.click(orders(ctx).find((b) => /Turn and attack/.test(ctx.lab(b))));
await ctx.click(btn(ctx, /^Let the staff plan it/));
check(/All 6 chits are placed/.test(ctx.text()), "the staff places the whole pool");
check(!issue().disabled, "the plan can be issued once the pool is placed and an approach chosen");
await ctx.click(issue());
t = ctx.text();
check(/After-action report/.test(t) && /The enemy's setup was this/.test(t), "the outcome carries an after-action report");
check(/did as the staff's would have/.test(t), "the staff's plan plays the record's odds");
const saved = snapshot(ctx);
await ctx.click(btn(ctx, /^Continue$/));
check(/battle on the Marne|plan on the Marne/.test(ctx.text()), "the next report reads how the battle was fought");
ctx.restore();

// --- a file saved on the outcome screen resumes with its report --------------------------------------------
{
  const r = await boot(saved);
  await r.click(btn(r, /Resume file/));
  check(/After-action report/.test(r.text()), "a saved file resumes on the outcome with its report");
  r.restore();
}

// --- the planning switched off -----------------------------------------------------------------------------
{
  const off = await boot();
  await off.click(off.d.querySelector('input[type="checkbox"]'));
  check(!off.d.querySelector('input[type="checkbox"]').checked, "the planning can be switched off");
  check(await toMarne(off), "the Marne node is reached with planning off");
  await off.click(orders(off).find((b) => /Turn and attack/.test(off.lab(b))));
  const o = off.text();
  check(!/ORDER OF BATTLE/.test(o) && !/After-action report/.test(o), "with planning off the order resolves at once, with no screen and no report");
  off.restore();
}

console.log(fails.length ? `\n${fails.length} failure(s).` : "\nThe Order of Battle behaves.");
process.exit(fails.length ? 1 : 0);
