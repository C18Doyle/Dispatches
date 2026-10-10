// "Take control of battle planning" (the war room stamp). Ticked, a choice that leads to battle planning opens the Order of Battle. Unticked, the same
// choice is made like any other: no badge, no planning screen, an outcome straight away; and the setting survives a save and a resume.
// Plays the same seeded German run twice (same seed, same policy), once with the stamp and once without, up to the first battle choice.
//
// Run after a build: npm run build:nozip && node tests/battle-toggle.test.mjs
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
const PLANNING = /Order of Battle[:—] Before Committing/;

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
const stampBox = (ctx, title) => [...ctx.d.querySelectorAll("label")].find((l) => l.textContent.includes(title))?.querySelector("input[type=checkbox]");

/** Starts the German war on Normal, optionally lifting the battle stamp first. Returns an error string or null. */
async function start(ctx, planBattles) {
  const card = ctx.buttons().find((b) => ctx.lab(b).startsWith("OKW"));
  if (!card) return "campaign card missing";
  await ctx.click(card);
  const box = stampBox(ctx, "Take Control of Battle Planning");
  if (!box) return "the war room has no battle stamp";
  if (!box.checked) return "the battle stamp is not ticked by default";
  if (!planBattles) await ctx.click(box);
  if (box.checked !== planBattles) return "the stamp did not change";
  const enter = ctx.buttons().find((b) => /^Enter the War Room/i.test(ctx.lab(b)));
  await ctx.click(enter);
  return null;
}

// --- with the stamp: the first battle choice, and the step at which it appears ------------------------
const withCtx = await boot();
check(!(await start(withCtx, true)), "ticked by default; the war begins");
const policy = {};
let step = -1;
let label = "";
for (let i = 0; i < 200; i++) {
  const b = withCtx.buttons().find((x) => /Leads to battle planning/.test(withCtx.lab(x)));
  if (b) {
    step = i;
    label = withCtx.lab(b).replace(/\s*Leads to battle planning.*/i, "").trim();
    await withCtx.click(b);
    break;
  }
  const next = cfg.choose(withCtx, policy);
  if (!next) break;
  await withCtx.click(next);
}
check(step >= 0, `a battle choice is reached (step ${step})`);
check(PLANNING.test(withCtx.text()), "with the stamp, that choice opens the Order of Battle");
withCtx.restore();

// --- without it: same seed, same policy, same step --------------------------------------------------
const offCtx = await boot();
check(!(await start(offCtx, false)), "the stamp can be lifted; the war begins");
const policy2 = {};
let sawBadge = false;
let battleButton = null;
for (let i = 0; i < 200; i++) {
  if (/Leads to battle planning/.test(offCtx.text())) sawBadge = true;
  if (i === step) {
    battleButton = offCtx.buttons().find((x) => offCtx.lab(x).startsWith(label.slice(0, 40)));
    break;
  }
  const next = cfg.choose(offCtx, policy2);
  if (!next) break;
  await offCtx.click(next);
}
check(!sawBadge, "without the stamp, no choice says it leads to battle planning");
check(!!battleButton, "the same choice is on the page at the same step");
if (battleButton) {
  const before = offCtx.text();
  await offCtx.click(battleButton);
  const after = offCtx.text();
  check(!PLANNING.test(after) && !/Order of Battle/.test(after), "without the stamp, choosing it does not open the Order of Battle");
  check(after !== before && !!find(offCtx, /Continue|Next|Proceed|Return|Brief/i), "without the stamp, choosing it goes straight to an outcome");
}
offCtx.restore();

// --- the setting survives a save and a resume -------------------------------------------------------
// Saved on the briefing just before the battle choice, resumed in a fresh page, then that same choice is made.
const saveCtx = await boot();
check(!(await start(saveCtx, false)), "a second war begins with the stamp lifted");
const policy3 = {};
for (let i = 0; i < step; i++) {
  const next = cfg.choose(saveCtx, policy3);
  if (!next) break;
  await saveCtx.click(next);
}
let storedSave = null;
const saveButton = find(saveCtx, /^Save/);
check(!!saveButton, "the briefing offers a save");
if (saveButton) {
  await saveCtx.click(saveButton);
  const stored = snapshot(saveCtx);
  storedSave = stored;
  const run = stored["ww2-command-active"] ? JSON.parse(stored["ww2-command-active"]) : null;
  check(!!run && run.controlBattles === false, "the save records that the player does not plan battles");
  saveCtx.restore();
  const back = await boot(stored);
  const resume = find(back, /War in Progress/);
  check(!!resume, "a fresh page offers to resume");
  if (resume) {
    await back.click(resume);
    const choice = back.buttons().find((x) => back.lab(x).startsWith(label.slice(0, 40)));
    check(!!choice, "the resumed briefing holds the battle choice");
    check(!/Leads to battle planning/.test(back.text()), "after a resume the choice does not say it leads to battle planning");
    if (choice) {
      await back.click(choice);
      check(!/Order of Battle/.test(back.text()), "after a resume, choosing it still does not open the Order of Battle");
    }
  }
}
// ...and an older save, written before the stamp existed, means "plan the battles"
if (storedSave) {
  const old = { ...storedSave, "ww2-command-active": JSON.stringify({ ...JSON.parse(storedSave["ww2-command-active"]), controlBattles: undefined }) };
  const oldCtx = await boot(old);
  const resumeOld = find(oldCtx, /War in Progress/);
  check(!!resumeOld, "a save without the setting still resumes");
  if (resumeOld) {
    await oldCtx.click(resumeOld);
    check(/Leads to battle planning/.test(oldCtx.text()), "a save without the setting plans its battles, as before");
  }
}

console.log(fails.length ? `\n${fails.length} FAILED` : "\nBattle toggle behaves.");
process.exit(fails.length ? 1 : 0);
