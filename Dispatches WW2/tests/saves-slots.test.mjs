// Saves (part 45) and the in-run menu (part 47): every command keeps its own war in progress, saved after every decision; a save from
// before (the one key dispatches-ww2-active) moves into its command's place; two commands can be under way at once; a named slot saves
// at a briefing and resumes; a slot is deleted only on the second press; the war journal lists the orders given; and Escape, J and
// the number keys reach the menu, the journal and the orders.
// Run after a build: npm run build:nozip && npm run test:saves-slots
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const { makeContext } = await import(pathToFileURL(join(ROOT, "../packages/testkit/src/ui-driver.mjs")).href);
const cfg = (await import(pathToFileURL(join(HERE, "ui.config.mjs")).href)).default;
process.chdir(ROOT);
const bundle = readFileSync("dist/full/bundle.js", "utf8");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const fails = [];
const check = (ok, what) => {
  if (!ok) fails.push(what);
  console.log((ok ? "ok   " : "FAIL ") + what);
};
const find = (ctx, re) => ctx.buttons().find((b) => re.test(ctx.lab(b)));
async function boot(storage) {
  const ctx = makeContext(cfg, bundle, 7, storage);
  if (ctx.failed) throw new Error(ctx.failed);
  await sleep(300);
  await ctx.settle();
  return ctx;
}
function snapshot(ctx) {
  const o = {};
  for (let i = 0; i < ctx.w.localStorage.length; i++) {
    const k = ctx.w.localStorage.key(i);
    o[k] = ctx.w.localStorage.getItem(k);
  }
  return o;
}
async function key(ctx, k) {
  if (ctx.d.activeElement && ctx.d.activeElement.blur) ctx.d.activeElement.blur();
  ctx.d.dispatchEvent(new ctx.w.KeyboardEvent("keydown", { key: k, bubbles: true }));
  await sleep(60);
  await ctx.settle();
}
/** Plays `n` decisions with the UI runner's policy: the orders and whatever stands between them. */
async function play(ctx, n) {
  const policy = {};
  const start = (ctx.text().match(/· No\. (\d+)/i) || [])[1];
  for (let i = 0; i < 60; i++) {
    const m = ctx.text().match(/· No\. (\d+)/i);
    if (m && Number(m[1]) >= Number(start || 1) + n && !ctx.d.querySelector('[role="dialog"]')) return true;
    const b = cfg.choose(ctx, policy);
    if (!b) return false;
    await ctx.click(b);
  }
  return false;
}

// --- an old save moves into its command's place ----------------------------------------------------
const fixture = JSON.parse(readFileSync("tests/saves/german-easy.json", "utf8"));
const legacy = await boot(fixture.storage);
const legacyStore = snapshot(legacy);
check(!legacyStore["dispatches-ww2-active"] && !!legacyStore["dispatches-ww2-active-german"], "a save from before moves into the German command's place");
check(!!find(legacy, /War in Progress.*Wehrmacht/i), "and the opening screen offers to resume it");
legacy.restore();

// --- two commands under way at once ----------------------------------------------------------------
const ctx = await boot();
const err = await cfg.setup(ctx, ["japan", "IGHQ", "open"]);
if (err) throw new Error(err);
check(await play(ctx, 2), "IGHQ: two decisions played");
let store = snapshot(ctx);
const ighq = store["dispatches-ww2-active-japan"] ? JSON.parse(store["dispatches-ww2-active-japan"]) : null;
check(!!ighq && ighq.log.length === 2, "the war in progress is saved after every decision (2 on file, not every third)");

// the war journal and the menu, by key
await key(ctx, "j");
const journal = ctx.d.querySelector('[role="dialog"]');
check(!!journal && /War Journal/i.test(journal.textContent) && (journal.textContent.match(/\d+\. /g) || []).length >= 2, "J opens the war journal with the orders given");
await key(ctx, "Escape");
check(!ctx.d.querySelector('[role="dialog"]'), "Escape closes it");
await key(ctx, "Escape");
const menu = ctx.d.querySelector('[role="dialog"]');
check(!!menu && /Save to a slot/i.test(menu.textContent), "Escape opens the menu, with the save slots");
const nameBox = menu.querySelector('input[aria-label="Name for slot 2"]');
// A digit typed into the name box, or 3 pressed while the menu is open, must not give an order on the briefing behind it.
nameBox.focus();
nameBox.dispatchEvent(new ctx.w.KeyboardEvent("keydown", { key: "1", bubbles: true }));
await sleep(60);
await ctx.settle();
check(!!ctx.d.querySelector('[role="dialog"]') && /Situation Report/i.test(ctx.text()) && !/After Action Report/i.test(ctx.text()), "a digit typed into a slot name gives no order");
const setter = Object.getOwnPropertyDescriptor(ctx.w.HTMLInputElement.prototype, "value").set;
setter.call(nameBox, "Before Pearl Harbor");
nameBox.dispatchEvent(new ctx.w.Event("input", { bubbles: true }));
await ctx.settle();
const saveHere = [...menu.querySelectorAll("button")].filter((b) => /Save here/i.test(b.textContent))[1];
await ctx.click(saveHere);
await sleep(200);
await ctx.settle();
store = snapshot(ctx);
const slot2 = store["dispatches-ww2-slot-2"] ? JSON.parse(store["dispatches-ww2-slot-2"]) : null;
check(!!slot2 && slot2.slotName === "Before Pearl Harbor" && slot2.campaignId === "japan", "a briefing saves to slot 2 under the name given");
await ctx.click([...ctx.d.querySelector('[role="dialog"]').querySelectorAll("button")].find((b) => /Save and return/i.test(b.textContent)));
await sleep(200);
await ctx.settle();

// a second command, then both are on the opening screen
const card = find(ctx, /^OKW/);
await ctx.click(card);
await ctx.click(find(ctx, /^Enter the War Room/i));
check(await play(ctx, 1), "OKW: a decision played");
await key(ctx, "Escape");
await ctx.click([...ctx.d.querySelector('[role="dialog"]').querySelectorAll("button")].find((b) => /Save and return/i.test(b.textContent)));
await sleep(200);
await ctx.settle();
const cards = ctx.buttons().filter((b) => /War in Progress/i.test(ctx.lab(b)));
check(cards.length === 2 && cards.some((b) => /Wehrmacht/.test(ctx.lab(b))) && cards.some((b) => /Imperial General/.test(ctx.lab(b))), "the opening screen offers both wars in progress");
check(!!find(ctx, /Resume slot 2: Before Pearl Harbor/i), "and the named slot");
store = snapshot(ctx);
ctx.restore();

// --- resume the slot in a fresh page, then delete it (two presses) ---------------------------------
const ctx2 = await boot(store);
await ctx2.click(find(ctx2, /Resume slot 2/i));
check(/IGHQ/.test(ctx2.text()) && /No\. 3/i.test(ctx2.text()), "the slot resumes IGHQ at the briefing it was saved at");
await key(ctx2, "Escape");
await key(ctx2, "1");
check(!ctx2.d.querySelector('[role="dialog"]') && /Situation Report/i.test(ctx2.text()) && !/After Action Report/i.test(ctx2.text()), "1 in the menu goes back to the file and gives no order");
await key(ctx2, "1");
check(/AFTER ACTION REPORT/i.test(ctx2.text()), "the 1 key gives the first order");
await key(ctx2, "Enter");
check(!/After Action Report/i.test(ctx2.text()) && !/· No\. 5/i.test(ctx2.text()), "Enter goes on from the outcome, once");
ctx2.restore();
const ctx3 = await boot(store);
const del = () => ctx3.buttons().find((b) => /delete slot 2/i.test(ctx3.lab(b)));
await ctx3.click(del());
check(!!snapshot(ctx3)["dispatches-ww2-slot-2"], "one press on delete only asks");
await ctx3.click(del());
await sleep(200);
await ctx3.settle();
check(!snapshot(ctx3)["dispatches-ww2-slot-2"] && !find(ctx3, /Resume slot 2/i), "the second press deletes the slot");
check(!/The File Was Damaged/.test(ctx3.text()), "no crash along the way");
ctx3.restore();

if (fails.length) {
  console.log(`\n${fails.length} check(s) failed`);
  process.exit(1);
}
console.log("\nsaves and slots: all checks passed");
