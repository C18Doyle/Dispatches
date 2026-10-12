// The order screens (src/96-order-screens.jsx), played through the real screens (jsdom).
//   - a meter can be pressed to show the three readings it is made of
//   - a contested order shows an odds dial, a settled one does not
//   - a contested order is signed by holding it: a mouse click does not sign, a held press does, a keyboard press signs at once
//   - with "Tap to sign" a click signs
//   - the result of a contested order comes in a sealed cable, and the report lists what the order did to each meter
//
// Run after a build: npm run build && node tests/dynamic.test.mjs
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
const orders = (ctx) => ctx.buttons().filter((b) => b.className.startsWith("dg-choice"));
async function toMarne(ctx) {
  await ctx.click(ctx.buttons().find((b) => ctx.lab(b).includes("Grand Quartier")));
  await ctx.click(ctx.buttons().find((b) => ctx.lab(b) === "Enter the war room"));
  for (let i = 0; i < 40 && !/The Flank in the Open/.test(ctx.text()); i++) {
    const o = orders(ctx);
    if (o.length) await ctx.click(o.find((b) => !b.disabled) || o[0]);
    else await ctx.click(btn(ctx, /^Break the seal$/) || btn(ctx, /^Continue$/));
  }
  return /The Flank in the Open/.test(ctx.text());
}
const fire = (ctx, el, type, extra = {}) => el.dispatchEvent(new ctx.w.Event(type, { bubbles: true, ...extra }));
const mouseClick = (ctx, el) => el.dispatchEvent(new ctx.w.MouseEvent("click", { bubbles: true, detail: 1 }));

// --- the first node: a settled order, and the readings -------------------------------------------------------
{
  const ctx = await boot();
  await ctx.click(ctx.buttons().find((b) => ctx.lab(b).includes("Oberste")));
  await ctx.click(ctx.buttons().find((b) => ctx.lab(b) === "Enter the war room"));
  check(/Odds:/.test(ctx.text()), "the prelude offers a contested order with an odds dial");
  await ctx.click(ctx.buttons().find((b) => ctx.lab(b).startsWith("Tell the Kaiser"))); // the settled order of the prelude
  await ctx.click(ctx.buttons().find((b) => ctx.lab(b) === "Continue"));
  check(!/Odds:/.test(ctx.text()), "a settled order shows no odds dial");
  check(!ctx.d.querySelector(".dg-readings"), "the readings start closed");
  const m = ctx.d.querySelector(".dg-meter-btn");
  check(!!m && m.getAttribute("aria-expanded") === "false", "a meter is a button that is closed");
  await ctx.click(m);
  const panel = ctx.d.querySelector(".dg-readings");
  check(!!panel && panel.querySelectorAll(".dg-reading").length === 3, "pressing a meter shows three readings");
  check(/Organisation/.test(panel.textContent) && /Experience/.test(panel.textContent) && /Readiness/.test(panel.textContent), "manpower is made of organisation, experience and readiness");
  await ctx.click(m);
  check(!ctx.d.querySelector(".dg-readings"), "pressing it again closes it");
  ctx.restore();
}

// --- the Marne: a contested order ------------------------------------------------------------------------------
{
  const ctx = await boot();
  check(await toMarne(ctx), "the Marne node is reached");
  check(/Odds: (Long odds|Against us|Even|Favourable|Strong)/.test(ctx.text()), "the contested order shows an odds dial with a word");
  check(/Hold to sign/.test(ctx.text()), "it says to hold to sign");
  const attack = orders(ctx).find((b) => /Turn and attack/.test(ctx.lab(b)));
  mouseClick(ctx, attack);
  await ctx.settle();
  check(/The Flank in the Open/.test(ctx.text()) && !/ORDER OF BATTLE/.test(ctx.text()), "a mouse click does not sign a contested order");
  fire(ctx, attack, "pointerdown");
  await sleep(300);
  fire(ctx, attack, "pointerup");
  await sleep(900);
  check(/The Flank in the Open/.test(ctx.text()) && !/ORDER OF BATTLE/.test(ctx.text()), "letting go early does not sign it");
  fire(ctx, attack, "pointerdown");
  await sleep(1200);
  await ctx.settle();
  check(/ORDER OF BATTLE/.test(ctx.text()), "holding it down signs it (and a battle order opens its planning screen)");
  ctx.restore();
}

// --- a keyboard press, and the setting ----------------------------------------------------------------------------
{
  const ctx = await boot();
  await toMarne(ctx);
  await ctx.click(orders(ctx).find((b) => /Turn and attack/.test(ctx.lab(b)))); // detail 0: a keyboard or assistive press
  check(/ORDER OF BATTLE/.test(ctx.text()), "a keyboard press signs at once");
  ctx.restore();
}
{
  const ctx = await boot();
  const det = ctx.d.querySelector("details");
  await ctx.click(btn(ctx, /Settings/)); await ctx.click(btn(ctx, /^Tap to sign$/)); await ctx.click(btn(ctx, /^Back$/));
  await toMarne(ctx);
  check(!/Hold to sign/.test(ctx.text()), "with tap to sign there is no hold hint");
  mouseClick(ctx, orders(ctx).find((b) => /Turn and attack/.test(ctx.lab(b))));
  await ctx.settle();
  check(/ORDER OF BATTLE/.test(ctx.text()), "with tap to sign a click signs");
  ctx.restore();
}

// --- the sealed cable ---------------------------------------------------------------------------------------------
{
  const ctx = await boot();
  await ctx.click(btn(ctx, /Settings/)); await ctx.click(btn(ctx, /^Tap to sign$/)); await ctx.click(btn(ctx, /^Back$/));
  await ctx.click(ctx.buttons().find((b) => ctx.lab(b).includes("Oberste")));
  await ctx.click(ctx.buttons().find((b) => ctx.lab(b) === "Enter the war room"));
  let sealed = false;
  for (let i = 0; i < 30 && !sealed; i++) {
    const o = orders(ctx);
    if (!o.length) break;
    const risky = o.find((b) => /Odds:/.test(b.textContent) && !b.disabled);
    if (risky) {
      await ctx.click(risky);
      sealed = !!btn(ctx, /^Break the seal$/);
      break;
    }
    await ctx.click(o.find((b) => !b.disabled) || o[0]);
    const s = btn(ctx, /^Break the seal$/);
    if (s) { sealed = true; break; }
    const c = btn(ctx, /^Continue$/);
    if (c) await ctx.click(c);
  }
  check(sealed, "a contested order comes back in a sealed cable");
  if (sealed) {
    check(!ctx.d.querySelector(".dg-cable") === false && !/Continue/.test(ctx.text()), "the outcome is not shown until the seal is broken");
    await ctx.click(btn(ctx, /^Break the seal$/));
    check(!ctx.d.querySelector(".dg-cable") && !!btn(ctx, /^Continue$/), "breaking the seal shows the outcome");
    check(ctx.d.querySelectorAll(".dg-changes li").length >= 1, "the report lists what the order did to the meters");
    check(!!ctx.d.querySelector(".dg-meters"), "the report shows the meters");
  }
  ctx.restore();
}

// --- the map ------------------------------------------------------------------------------------------------------
{
  const ctx = await boot();
  await toMarne(ctx);
  check(!!ctx.d.querySelector(".dg-mapcard svg.dg-map"), "the report has its map on the page, not behind a toggle");
  check(!ctx.d.querySelector(".dg-modal"), "the whole-theatre map starts closed");
  check(ctx.d.querySelectorAll(".dg-country").length > 20 && !!ctx.d.querySelector(".dg-front"), "the map draws the countries and a front");
  await ctx.click(btn(ctx, /^Expand the map$/));
  const dlg = ctx.d.querySelector('.dg-modal[role="dialog"]');
  check(!!dlg && /Meanwhile/.test(dlg.textContent) && /Central Powers/.test(dlg.textContent), "expanding opens the whole theatre with a key and the other commands' news");
  check(dlg.querySelectorAll(".dg-meanwhile li").length >= 3, "the meanwhile lists what other commands were doing");
  check(/OHL/.test(dlg.querySelector(".dg-meanwhile").textContent) && !/GQG/.test(dlg.querySelector(".dg-meanwhile").textContent), "the meanwhile names the others and not this command");
  ctx.d.dispatchEvent(new ctx.w.KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  await ctx.settle();
  check(!ctx.d.querySelector(".dg-modal"), "Escape closes it");
  await ctx.click(btn(ctx, /^Expand the map$/));
  await ctx.click(btn(ctx, /^Close the map$/));
  check(!ctx.d.querySelector(".dg-modal"), "Close the map closes it");
  ctx.restore();
}

// --- sound ------------------------------------------------------------------------------------------------------------
{
  const ctx = await boot();
  await ctx.click(btn(ctx, /Settings/)); // the sound is chosen on the Settings screen
  await ctx.click(btn(ctx, /^Atmosphere$/));
  const st = ctx.w.localStorage.getItem("dispatches1914_settings_v1") || "";
  check(st.includes('"sound":true') && st.includes('"atmosphere":true'), "Atmosphere can be chosen and is stored");
  await ctx.click(btn(ctx, /^Off$/));
  check((ctx.w.localStorage.getItem("dispatches1914_settings_v1") || "").includes('"sound":false'), "Off turns it all off");
  await ctx.click(btn(ctx, /^Atmosphere$/));
  await ctx.click(btn(ctx, /^Back$/));
  await toMarne(ctx); // no audio in the test browser: every sound call stays silent and nothing crashes
  check(/The Flank in the Open/.test(ctx.text()), "a run plays through with the atmosphere on and no audio available");
  ctx.restore();
}

console.log(fails.length ? `\n${fails.length} failure(s).` : "\nThe order screens behave.");
process.exit(fails.length ? 1 : 0);
