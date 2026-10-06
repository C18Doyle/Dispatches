// A battle can be put down and picked up again. Plays the German war to its first Order of Battle, builds a
// plan, saves and leaves, then loads that save into a FRESH page and checks the planning screen comes back
// exactly as it was (same plan, same intelligence, same readings, Initiative as it stood, same hidden enemy
// setup). Then commits, saves mid-report, resumes again and checks the report starts over with the orders
// intact. Finally corrupts the saved battle and checks the game falls back to the briefing instead of failing.
//
// Run after a build: npm run build:nozip && npm run test:battle-resume
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

// --- play to the first planning screen -----------------------------------------------------------
const ctx1 = await boot();
const err = await cfg.setup(ctx1, ["german", "OKW", "open"]);
if (err) throw new Error(err);
const policy = {};
let reached = false;
for (let i = 0; i < 200 && !reached; i++) {
  if (/Order of Battle — Before Committing/.test(ctx1.text())) {
    reached = true;
    break;
  }
  // The first choice that leads to battle planning, so the test does not depend on which way a random walk goes.
  const b = ctx1.buttons().find((x) => /Leads to battle planning/.test(ctx1.lab(x))) || cfg.choose(ctx1, policy);
  if (!b) break;
  await ctx1.click(b);
}
check(reached, "reached an Order of Battle planning screen");
if (!reached) process.exit(1);

// Build a plan and buy some information so there is state worth keeping.
for (let k = 0; k < 3; k++) await ctx1.click(ctx1.buttons().filter((b) => /^Add effort/.test(ctx1.lab(b)))[k % 2]);
const approachHead = [...ctx1.d.querySelectorAll("[role=heading]")].find((h) => /Tactical Approach/.test(h.textContent));
const approach = approachHead ? [...approachHead.parentElement.querySelectorAll("button")].find((b) => !b.disabled && b.getAttribute("aria-pressed") === "false") : null;
check(!!approach, "the planning screen offers a tactical approach to choose");
if (approach) await ctx1.click(approach);
const recon = find(ctx1, /Reconnaissance Pass/);
if (recon) await ctx1.click(recon);
// The first-time guide opens by itself the first time, and a resumed page has seen it; close it so the two screens can be compared.
const guide = find(ctx1, /^How it works/);
if (guide && guide.getAttribute("aria-expanded") === "true") await ctx1.click(guide);
const before = ctx1.text();
check(/Initiative now:/.test(before), "planning screen shows Initiative");

const saveBtn = find(ctx1, /^Save and leave the field/);
check(!!saveBtn, "planning screen offers Save and leave the field");
await ctx1.click(saveBtn);
check(/War in Progress/.test(ctx1.text()) && /part way through/.test(ctx1.text()), "menu offers the war and names the battle");
const saved1 = snapshot(ctx1);
const run1 = JSON.parse(saved1["ww2-command-active"]);
check(run1.battle && run1.battle.stage === "allocation" && run1.battle.draft && run1.battle.draft.postureId !== undefined, "the save carries the planning draft and the enemy setup");
ctx1.restore();

// --- resume it in a fresh page ---------------------------------------------------------------------
const ctx2 = await boot(saved1);
const resume = find(ctx2, /War in Progress/);
check(!!resume, "fresh page offers to resume");
await ctx2.click(resume);
const after = ctx2.text();
check(/Order of Battle — Before Committing/.test(after), "resume lands on the planning screen, not the briefing");
check(after === before, "the planning screen is exactly as it was left (plan, intelligence, readings, Initiative)");

// --- commit, play into the report, save mid-report --------------------------------------------------
let report = false;
const policy2 = { approachChosen: true };
for (let i = 0; i < 40 && !report; i++) {
  if (/Battle Report/.test(ctx2.text())) {
    report = true;
    break;
  }
  const t = ctx2.text();
  let b = ctx2.buttons().find((x) => /^Commit to Battle/.test(ctx2.lab(x)));
  if (!b) b = cfg.choose(ctx2, policy2);
  if (!b) break;
  await ctx2.click(b);
}
check(report, "committing the resumed plan opens the battle report");
const commitSave = JSON.parse(snapshot(ctx2)["ww2-command-active"]);
check(commitSave.battle && commitSave.battle.stage === "report" && commitSave.battle.plan, "committing the plan saves it at once");
const first = ctx2.text();
check(!!find(ctx2, /^Start battle/), "the report opens with a Start battle button at the top");
await ctx2.click(find(ctx2, /^Start battle/));
check(!!find(ctx2, /^Pause/) && /The attack goes in|Contact|came|dawn|moves|advance|go/i.test(ctx2.text()), "starting the battle shows the first dispatch and a Pause button");
const leave2 = find(ctx2, /^Save and leave the field/);
check(!!leave2, "the battle report offers Save and leave the field");
await ctx2.click(leave2);
const saved2 = snapshot(ctx2);
ctx2.restore();

const ctx3 = await boot(saved2);
// Instant text on, so the report does not wait between dispatches while the test plays it through.
const instant = ctx3.buttons().find((b) => ctx3.lab(b) === "Off" && /instant/i.test(b.parentElement?.parentElement?.textContent || ""));
if (instant) await ctx3.click(instant);
await ctx3.click(find(ctx3, /War in Progress/));
const back = ctx3.text();
check(/Battle Report/.test(back) && /back at the front/.test(back), "resume lands on the battle report with a note that it starts again");
const NOTE = "You are back at the front. Your orders stand as you gave them, and the report begins again from its first line.";
check(back.replace(NOTE, "") === first, "the report starts over from its first line with the same orders");
// ...and plays through to its verdict and on.
let verdict = false;
for (let i = 0; i < 40 && !verdict; i++) {
  if (/See the Full Report/.test(ctx3.text())) {
    verdict = true;
    break;
  }
  const b = ctx3.buttons().find((x) => /^Start battle/.test(ctx3.lab(x))) || cfg.choose(ctx3, { approachChosen: true });
  if (!b || /^Save/.test(ctx3.lab(b))) break;
  await ctx3.click(b);
}
check(verdict, "the resumed battle plays through to a verdict");
check(!find(ctx3, /^Save and leave the field/), "no save-and-leave once the verdict is in (the roll has been made)");
check(!/The File Was Damaged/.test(ctx3.text()) && ctx3.errors.length === 0, "no crash or console error along the way");
ctx3.restore();

// --- a damaged battle section must not strand the player --------------------------------------------
const bad = { ...saved1 };
const broken = JSON.parse(bad["ww2-command-active"]);
broken.battle.draft.allocation = { nonsense: 1 };
bad["ww2-command-active"] = JSON.stringify(broken);
const ctx4 = await boot(bad);
await ctx4.click(find(ctx4, /War in Progress/));
check(!/Order of Battle — Before Committing/.test(ctx4.text()) && !/The File Was Damaged/.test(ctx4.text()), "a damaged battle section falls back to the briefing");
ctx4.restore();

if (fails.length) {
  console.log(`\n${fails.length} check(s) failed`);
  process.exit(1);
}
console.log("\nbattle resume: all checks passed");
process.exit(0);
