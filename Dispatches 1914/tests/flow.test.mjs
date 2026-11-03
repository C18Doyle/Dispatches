// The front screens and the special events, played through the real screens (jsdom).
//   - the menu groups the six commands by side and names each nation; difficulty is not on it
//   - a command opens its briefing (where things stand, the seat, the question, the file's set-up) and the war room follows
//   - How to play and Settings are screens, reached from the menu and returned from; text size is a three-stop slider; the calendar is stated
//   - dates are the UK form in the Western calendar (the Russian command's first report is 17 August)
//   - a special event comes before the report its window holds, once, and is not a decision
//
// Run after a build: npm run build && node tests/flow.test.mjs
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
const check = (ok, what) => { if (!ok) fails.push(what); console.log((ok ? "ok   " : "FAIL ") + what); };
async function boot() {
  const ctx = makeContext(cfg, bundle, 11);
  if (ctx.failed) throw new Error(ctx.failed);
  await sleep(200);
  await ctx.settle();
  return ctx;
}
const btn = (ctx, re) => ctx.buttons().find((b) => re.test(ctx.lab(b)));
const orders = (ctx) => ctx.buttons().filter((b) => b.className === "dg-choice");
/** One click of a plain playthrough: the first open order, the staff's plan on a battle screen, the seal, Continue. */
async function step(ctx) {
  const carry = btn(ctx, /^Carry on to the second day/);
  if (carry && !carry.disabled) return ctx.click(carry);
  const issue = btn(ctx, /^Issue the plan/);
  const staff = btn(ctx, /Let the staff plan it/);
  if (staff) return ctx.click(issue && !issue.disabled ? issue : staff);
  const o = orders(ctx);
  if (o.length) return ctx.click(o.find((b) => !b.disabled) || o[0]);
  return ctx.click(btn(ctx, /^Break the seal$/) || btn(ctx, /^Continue$/));
}

// --- the menu and the briefing ----------------------------------------------------------------------------------
{
  const ctx = await boot();
  const t = ctx.text();
  check(/The Central Powers/.test(t) && /The Entente/.test(t), "the menu groups the commands by side");
  check(["Germany", "France", "Russia", "Britain", "Austria-Hungary", "The Ottoman Empire"].every((n) => t.includes(n)), "each card names its nation");
  check(!btn(ctx, /Hard mode$/) && !/Take control of battle planning/.test(t), "difficulty and battle planning are not on the menu");
  check(!/feedback/i.test(t), "there is no feedback option");
  await ctx.click(btn(ctx, /Russia/));
  const b = ctx.text();
  check(/Where things stand/.test(b) && /Your seat/.test(b) && !/What you will be asked/.test(b) && /Set up the file/.test(b), "a command opens its briefing");
  check(/1 August 1914/.test(b), "the Russian command's prelude is dated in the Western calendar (19 July Old Style is 1 August)");
  check(/Old Style|Julian/.test(b) === false || /thirteen days/.test(b), "the briefing explains the calendar if it mentions it");
  await ctx.click(btn(ctx, /^Back$/));
  check(/The Central Powers/.test(ctx.text()), "Back returns from the briefing to the menu");
  await ctx.click(btn(ctx, /Germany/));
  await ctx.click(btn(ctx, /^Enter the war room$/));
  check(/1 August 1914/.test(ctx.text()) && /The Kaiser's Question/.test(ctx.text()) && orders(ctx).length >= 2, "the war room opens on the command's prelude, with its orders");
  const text = ctx.d.querySelector("main").textContent;
  check(text.indexOf("Kaiser's Question") < text.indexOf("Issue Order"), "the orders come last");
  await ctx.click(orders(ctx)[0]);
  await ctx.click(btn(ctx, /^Continue$/));
  check(/4 August 1914/.test(ctx.text()) && /The Weight on the Right/.test(ctx.text()), "the prelude leads to the first report of the record");
  ctx.restore();
}

// --- how to play and settings -----------------------------------------------------------------------------------
{
  const ctx = await boot();
  check(!btn(ctx, /^How to play/), "the menu has no How to play: it is in Settings");
  await ctx.click(btn(ctx, /^Settings/));
  await ctx.click(btn(ctx, /^How to play/));
  const t = ctx.text();
  check(/Reading a report/.test(t) && /Orders and risk/.test(t) && /What the game leaves out/.test(t) && /Armenians/.test(t), "How to play holds the sections and what the game leaves out");
  await ctx.click(btn(ctx, /^Back$/));
  check(/Calendar: United Kingdom/.test(ctx.text()), "Back from How to play returns to Settings");
  const s = ctx.d.getElementById("dg-size");
  check(!!s && s.min === "0" && s.max === "2" && s.step === "1", "text size is a slider with three stops");
  check(/Calendar: United Kingdom/.test(ctx.text()), "Settings states the calendar");
  await ctx.click(btn(ctx, /^Hold to sign$/));
  check((ctx.w.localStorage.getItem("dispatches1914_settings_v1") || "").includes('"signHold":true'), "a setting is stored");
  await ctx.click(btn(ctx, /^Return all settings to the defaults$/));
  check((ctx.w.localStorage.getItem("dispatches1914_settings_v1") || "").includes('"signHold":false'), "the defaults can be restored, and a tap signs by default");
  ctx.restore();
}

// --- a special event --------------------------------------------------------------------------------------------
{
  const ctx = await boot();
  await ctx.click(btn(ctx, /France/));
  await ctx.click(btn(ctx, /^Enter the war room$/));
  let seen = 0;
  let sawEventTitle = false;
  for (let i = 0; i < 12; i++) {
    if (ctx.d.querySelector('[data-screen="event"]')) {
      seen++;
      sawEventTitle = /Casualty Lists of 22 August/.test(ctx.text());
      check(orders(ctx).length === 0 && !!btn(ctx, /^Continue$/), "an event offers no order, only Continue");
      check(!/changes no meter/.test(ctx.text()), "an event carries no note about the meters");
      await ctx.click(btn(ctx, /^Continue$/));
      break;
    }
    await step(ctx);
  }
  check(seen === 1 && sawEventTitle, "the French command meets the casualty lists of 22 August before its next report");
  check(!ctx.d.querySelector('[data-screen="event"]') && orders(ctx).length >= 1, "after the event the report follows");
  // and not again
  let again = 0;
  for (let i = 0; i < 6; i++) {
    if (ctx.d.querySelector('[data-screen="event"]') && /Casualty Lists/.test(ctx.text())) again++;
    await step(ctx);
  }
  check(again === 0, "an event is shown once");
  ctx.restore();
}

console.log(fails.length ? `\n${fails.length} failure(s).` : "\nThe front screens and the events behave.");
process.exit(fails.length ? 1 : 0);
