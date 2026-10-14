// "Your war against the record": the ending screen lists every order given this run, says how many followed the record,
// shows what the record did at each departure, survives a save and resume, and is not left holding an order that was
// taken back in Easy mode.
//
// Run after a build: npm run build && node tests/record-panel.test.mjs
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

const CASES = {
  provisionalGov17: "The Provisional Government",
  bolsheviks: "Revolutionary Military Council of the Republic",
};

async function play(id, mode, seed) {
  const ctx = makeContext(cfg, bundle, seed);
  if (ctx.failed) throw new Error(ctx.failed);
  await sleep(300);
  await ctx.settle();
  const err = await cfg.setup(ctx, [id, CASES[id], mode]);
  if (err) throw new Error(err);
  return ctx;
}
const find = (ctx, re) => ctx.buttons().find((b) => re.test(ctx.lab(b)));

/** Plays to the end. `pickOrder(orders, n)` chooses among the open orders; returns how many orders were given. */
async function playOut(ctx, pickOrder) {
  let given = 0;
  for (let i = 0; i < 400; i++) {
    if (/ENDING REACHED/.test(ctx.text())) return given;
    const issue = find(ctx, /^ISSUE THE PLAN$/);
    if (issue) { await ctx.click(issue); continue; }
    const plan = find(ctx, /^LET THE STAFF PLAN IT$/);
    if (plan) { await ctx.click(plan); continue; }
    const orders = ctx.buttons().filter((b) => ctx.lab(b) === "ISSUE THE ORDER");
    if (orders.length) {
      await ctx.click(pickOrder(orders, given));
      given++;
      continue;
    }
    const next = find(ctx, /^(CONTINUE|PROCEED|NEXT|ACKNOWLEDGE)/i);
    if (!next) break;
    await ctx.click(next);
  }
  return /ENDING REACHED/.test(ctx.text()) ? given : -1;
}

// --- a full run: the panel counts every order -------------------------------------------------------------
for (const id of Object.keys(CASES)) {
  const ctx = await play(id, false, 4);
  const given = await playOut(ctx, (o) => o[0]);
  const text = ctx.text();
  check(given > 0, `${id}: the run reaches an ending (${given} orders)`);
  check(/Your war against the record/.test(text), `${id}: the ending shows "Your war against the record"`);
  const m = text.match(/You followed the historical record in (\d+) of (\d+) orders/);
  check(!!m && Number(m[2]) === given, `${id}: the panel counts every order given (${m ? m[2] : "none"} of ${given})`);
  const departures = (text.match(/A DEPARTURE FROM THE RECORD/g) || []).length;
  const withRecord = (text.match(/WITH THE RECORD/g) || []).length;
  check(!!m && departures + withRecord === Number(m[2]) && withRecord === Number(m[1]), `${id}: each order is marked with or against the record`);
  if (departures) check(/What the record did/.test(text), `${id}: a departure shows what the record did`);
  ctx.restore();
}

// --- following the record: "You never left it" ------------------------------------------------------------
{
  const ctx = await play("provisionalGov17", false, 2);
  // the historical order is the one whose button sits in a card marked historical in the record; find it through the run itself
  const given = await playOut(ctx, (o, n) => o[(n * 7) % o.length]);
  const text = ctx.text();
  check(given > 0 && /You followed the historical record in \d+ of \d+ orders\./.test(text), "a second run also reports its count");
  ctx.restore();
}

// --- a saved run keeps the orders --------------------------------------------------------------------------
{
  const ctx = await play("bolsheviks", false, 3);
  for (let i = 0; i < 3; i++) {
    const orders = ctx.buttons().filter((b) => ctx.lab(b) === "ISSUE THE ORDER");
    if (!orders.length) break;
    await ctx.click(orders[0]);
    const plan = find(ctx, /^LET THE STAFF PLAN IT$/);
    if (plan) await ctx.click(plan);
    const issue = find(ctx, /^ISSUE THE PLAN$/);
    if (issue) await ctx.click(issue);
    const next = find(ctx, /^(CONTINUE|PROCEED|NEXT)/i);
    if (next) await ctx.click(next);
  }
  const save = JSON.parse(ctx.w.localStorage.getItem("dispatches1922_save_v1") || "null");
  check(!!save && Array.isArray(save.decisions) && save.decisions.length >= 1, `the saved run keeps its orders (${save && save.decisions ? save.decisions.length : 0})`);
  check(!!save && save.decisions.every((d) => typeof d.label === "string" && typeof d.kept === "boolean"), "each saved order has its label and whether it kept to the record");
  ctx.restore();
}

// --- Easy mode: an order taken back is not in the list ------------------------------------------------------
{
  const ctx = await play("provisionalGov17", "easy", 5);
  const orders = ctx.buttons().filter((b) => ctx.lab(b) === "ISSUE THE ORDER");
  await ctx.click(orders[0]);
  const back = find(ctx, /^TAKE BACK THIS ORDER$/);
  if (back) await ctx.click(back);
  const save = JSON.parse(ctx.w.localStorage.getItem("dispatches1922_save_v1") || "null");
  check(!!back && !!save && save.decisions.length === 0, "easy: taking an order back removes it from the list");
  const given = await playOut(ctx, (o) => o[0]);
  const m = ctx.text().match(/in (\d+) of (\d+) orders/);
  check(given > 0 && !!m && Number(m[2]) === given, `easy: the list holds the orders given after the take-back (${m ? m[2] : "none"} of ${given})`);
  ctx.restore();
}

if (fails.length) {
  console.log(`\n${fails.length} failure(s)`);
  process.exit(1);
}
console.log("\nrecord-panel: all checks passed");
