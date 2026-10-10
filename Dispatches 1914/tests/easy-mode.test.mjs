// The easy mode, the command rank and the glossary, played through the real screens (jsdom).
//   - easy mode: the menu names it, each order shows its effect on the meters, the order the command gave is marked, and the last order can be taken back
//   - standard mode shows none of that
//   - a saved easy run resumes as an easy run, with its take-back history
//   - a file played to its end shows the rank and its parts
//   - a glossary term in the story text can be pressed for its definition
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
/** One step of play: take the first order or press Continue. Returns false when neither is there (a file has closed). */
async function step(ctx, pick = 0) {
  const o = orders(ctx);
  if (o.length) {
    await ctx.click(o[Math.min(pick, o.length - 1)]);
    return true;
  }
  const c = btn(ctx, /^Continue$/);
  if (c) {
    await ctx.click(c);
    return true;
  }
  return false;
}

// --- standard mode: none of the easy extras ---------------------------------------------------------------
{
  const ctx = await boot();
  await ctx.click(btn(ctx, /^Standard$/));
  await ctx.click(ctx.buttons().find((b) => ctx.lab(b).includes("Oberste")));
  const t = ctx.text();
  check(orders(ctx).length >= 2, "standard: a node offers orders");
  check(!ctx.d.querySelector(".dg-preview") && !ctx.d.querySelector(".dg-record-mark"), "standard: no effect preview and no record mark");
  check(!btn(ctx, /Take back/), "standard: no take-back button");
  check(!/Easy:/.test(t), "standard: no easy name");
  ctx.restore();
}

// --- easy mode ---------------------------------------------------------------------------------------------
const easy = await boot();
await easy.click(btn(easy, /^Easy mode$/));
check(/Easy: Big Bertha Command/.test(easy.text()), "easy: the German card names the mode (Big Bertha)");
check(/Easy: Soixante-Quinze Command/.test(easy.text()), "easy: the French card names the mode");
await easy.click(easy.buttons().find((b) => easy.lab(b).includes("Oberste")));
const first = easy.text();
check(easy.d.querySelectorAll(".dg-preview").length === orders(easy).length, "easy: every order shows its effect on the meters");
check(/Manpower|Munitions|Home Front/.test(easy.d.querySelector(".dg-preview").textContent), "easy: the preview names the meters");
check(easy.d.querySelectorAll(".dg-record-mark").length === 1, "easy: exactly one order is marked as the one the command gave");
check(!btn(easy, /Take back/), "easy: nothing to take back before the first order");

await step(easy); // an order: the outcome screen
await step(easy); // continue to the next node
check(!!btn(easy, /Take back the last order/), "easy: after an order, the last order can be taken back");
const second = easy.text();
await easy.click(btn(easy, /Take back the last order/));
check(easy.text() === first, "easy: taking it back returns to the same node, exactly as it was");
check(!btn(easy, /Take back/), "easy: and there is nothing further to take back");
// give two orders, then save
await step(easy);
await step(easy);
await step(easy);
await step(easy);
const afterTwo = easy.text();
const saved = snapshot(easy);
const run = JSON.parse(saved["dispatches1914_save_v1"]);
check(run.easy === true && run.taken.length === 2 && run.history.length === 2, "easy: the save records easy, the two orders taken and the history");
easy.restore();

const back = await boot(saved);
const resume = btn(back, /^Resume file$/);
check(!!resume, "easy: a fresh page offers to resume");
check(/easy mode/.test(back.text()), "easy: the resume banner says easy mode");
await back.click(resume);
check(back.text() === afterTwo, "easy: resume lands on the same node");
check(!!btn(back, /Take back the last order/) && !!back.d.querySelector(".dg-preview"), "easy: a resumed easy run still previews and can take back");
await back.click(btn(back, /Take back the last order/));
await back.click(btn(back, /Take back the last order/));
check(!btn(back, /Take back/), "easy: the history from before the save can be taken back all the way to the first order");

// --- play a file to its end: the rank panel; and press a glossary term ------------------------------------------
let termChecked = false;
for (let i = 0; i < 400; i++) {
  if (!termChecked) {
    const term = back.d.querySelector(".dg-term");
    if (term) {
      check(term.getAttribute("aria-expanded") === "false" && !back.d.querySelector(".dg-defn"), "glossary: a term starts closed");
      await back.click(term);
      const defn = back.d.querySelector(".dg-defn");
      check(!!defn && defn.textContent.length > 30 && term.getAttribute("aria-expanded") === "true", "glossary: pressing a term shows its definition");
      await back.click(back.d.querySelector(".dg-term"));
      check(!back.d.querySelector(".dg-defn"), "glossary: pressing it again hides the definition");
      termChecked = true;
    }
  }
  if (!(await step(back))) break;
}
check(termChecked, "glossary: a term turned up in the story text on the way");
const end = back.text();
check(/Your command/.test(end) && /out of 100/.test(end), "rank: a closed file shows the command rank and its score");
check(/Standing at the close/.test(end) && /The mode/.test(end) && /easy mode/.test(end), "rank: and the parts it is made of");
check(!/Field Marshal/.test(end), "rank: an easy file cannot reach the top rank");
back.restore();

console.log(fails.length ? `\n${fails.length} FAILED` : "\nEasy mode, rank and glossary behave.");
process.exit(fails.length ? 1 : 0);
