// The staff's reading and the advisers' trust, played through the real screens (jsdom), from saved files made here.
//   - a report that carries a belief lists it with its grade and a button to check it; the orders that rest on it say so
//   - a check says whether the belief held and what the truth was, and spends one of the file's checks
//   - an order that does not rest on a belief found false earns the staff's edge; the odds dial of a rolled order resting on a false belief says it is on the staff's reading
//   - easy mode shows the verdicts and no fog
//   - an adviser who has gone quiet or left says so on the orders; a trusted adviser is marked; passing an adviser over three times sends the adviser away, by an event
//
// Run after a build: npm run build && node tests/staff.test.mjs
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

/** A file saved at a report with the given flags. */
function savedAt(campaignId, nodeId, flags = {}, easy = false) {
  const snap = E.snapshotRun({ campaignId, nodeId, flags, meters: E.emptyMeters(), hardState: E.emptyHardState(), visited: [nodeId], easy, taken: [], history: [] });
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

// --- a belief that is wrong, on a settled order -----------------------------------------------------------------------
{
  const ctx = await resume(savedAt("gqg", "gqg_1914_01_frontieres"));
  let t = ctx.text();
  check(/What the staff believes/.test(t) && /reserve corps in the front line/.test(t), "the report lists the staff's belief");
  check(/Reported as firm/.test(t), "the belief carries the staff's grade");
  check(/Rests on a belief the staff has not checked/.test(t), "the order that rests on it says so");
  check(/Checks left in this file: 3/.test(t) && !!btn(ctx, /^Check it \(3 left\)/), "three checks are offered");
  await ctx.click(btn(ctx, /^Check it/));
  t = ctx.text();
  check(/Wrong\./.test(t) && /half as strong again/.test(t), "a check says the belief is wrong and gives the truth");
  check(/Checks left in this file: 2/.test(t), "a check spends one");
  check(/Rests on a belief that proved wrong/.test(t), "the order now says its belief proved wrong");
  // an order that does not rest on it
  const free = orders(ctx).find((b) => !/Rests on/.test(b.textContent));
  await ctx.click(free);
  t = ctx.text();
  check(/knew what it was facing/.test(t), "an order given on checked intelligence earns the staff's edge");
  ctx.restore();
}

// --- the same report, the order that rests on the belief ---------------------------------------------------------------
{
  const ctx = await resume(savedAt("gqg", "gqg_1914_01_frontieres"));
  const relies = orders(ctx).find((b) => /Rests on a belief the staff has not checked/.test(b.textContent));
  await ctx.click(relies);
  check(!/knew what it was facing/.test(ctx.text()), "an order that rests on the belief earns no edge");
  ctx.restore();
}

// --- the dial, and easy mode ------------------------------------------------------------------------------------------
{
  const ctx = await resume(savedAt("otto", "otto_1914_03_sarikamis"));
  let t = ctx.text();
  check(/Odds: [A-Za-z ]+, on the staff's reading/.test(t), "a rolled order resting on a false belief shows the odds on the staff's reading");
  await ctx.click(btn(ctx, /^Check it/));
  check(!/on the staff's reading/.test(ctx.text()), "after the check the dial shows the real odds");
  ctx.restore();
  const easy = await resume(savedAt("otto", "otto_1914_03_sarikamis", {}, true));
  t = easy.text();
  check(/Wrong\./.test(t) && !btn(easy, /^Check it/) && !/on the staff's reading/.test(t), "easy mode shows the verdict and no fog");
  easy.restore();
}

// --- a belief that held ----------------------------------------------------------------------------------------------
{
  const ctx = await resume(savedAt("gqg", "gqg_1916_04_verdun"));
  await ctx.click(btn(ctx, /^Check it/));
  check(/Confirmed\./.test(ctx.text()), "a check can confirm a belief");
  const first = orders(ctx)[0];
  await ctx.click(first);
  check(!/knew what it was facing/.test(ctx.text()), "checking a belief that held earns no edge");
  ctx.restore();
}

// --- the advisers: two orders from one adviser passed over together cost half a point, not a point each ----------------------------------------------------------------------------------------------------
{
  const node = E.CAMPAIGNS.gqg.nodes.gqg_1914_01_frontieres;
  const ids = node.choices.map((c) => E.adviserIdFor("gqg", c.advisor && c.advisor.name));
  const a = ids[0];
  const names = Object.fromEntries(E.CAMPAIGNS.gqg.advisors.map((x) => [x.id, x.name]));
  let ctx = await resume(savedAt("gqg", "gqg_1914_01_frontieres", { ["tr_" + a]: -2 }));
  check(new RegExp(names[a].replace(/ .*/, "") + ".* has gone quiet").test(ctx.text()), "an adviser at -2 has gone quiet on the orders");
  ctx.restore();
  ctx = await resume(savedAt("gqg", "gqg_1914_01_frontieres", { ["tr_" + a]: -3, ["tr_" + a + "_gone"]: true }));
  check(/has left the staff/.test(ctx.text()), "an adviser who has gone has left the staff");
  ctx.restore();
  ctx = await resume(savedAt("gqg", "gqg_1914_01_frontieres", { ["tr_" + a]: 3 }));
  check(/\(trusted\) argues/.test(ctx.text()), "a trusted adviser is marked");
  ctx.restore();
  // passing an adviser over for the third time
  const b = ids.findIndex((id) => id && id !== a);
  ctx = await resume(savedAt("gqg", "gqg_1914_01_frontieres", { ["tr_" + a]: -2.5 }));
  const pick = orders(ctx).find((x) => x.textContent.includes(node.choices[b].label.slice(0, 30)));
  await ctx.click(pick);
  if (btn(ctx, /^Break the seal$/)) await ctx.click(btn(ctx, /^Break the seal$/));
  await ctx.click(btn(ctx, /^Continue$/));
  check(/Asks to Be Relieved/.test(ctx.text()), "passing an adviser over once too often sends the adviser away, by an event");
  ctx.restore();
}

console.log(fails.length ? `\n${fails.length} failure(s).` : "\nThe staff's reading and the advisers' trust behave.");
process.exit(fails.length ? 1 : 0);
