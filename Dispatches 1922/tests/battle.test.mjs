// The Order of Battle. Two parts:
//  1. the arithmetic and the configs (src/battle.ts, src/parts/35-battles.jsx): the staff's plan plays the record's odds under every enemy setup and
//     every pool size, a plan that reads the enemy can beat it, the weights stay inside their bounds, and every config is wired to a real order,
//     a real report and real meters;
//  2. the screens: the badge, the planning screen, the after-action report, the echo in the next report, and the war-room switch that turns it off.
// Run after a build: npm run build && node tests/battle.test.mjs
import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { buildSync } from "esbuild";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
process.chdir(ROOT);
const require = createRequire(import.meta.url);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const fails = [];
const check = (ok, what) => {
  if (!ok) fails.push(what);
  console.log((ok ? "ok   " : "FAIL ") + what);
};

// ---- load the logic, the campaigns and the configs --------------------------------------------------------------
const dir = mkdtempSync(join(tmpdir(), "d1922-battle-"));
const logicPath = join(dir, "battle.mjs");
buildSync({ entryPoints: ["src/battle.ts"], outfile: logicPath, format: "esm", bundle: false });
const B = await import(pathToFileURL(resolve(logicPath)).href);
const app = readFileSync("src/App.jsx", "utf8");
const dataSrc = app.split("// PREVIEW SCREENS")[0].replace(/^export /gm, "") + "\nmodule.exports = { CAMPAIGNS };\n";
writeFileSync(join(dir, "data.cjs"), dataSrc);
const { CAMPAIGNS } = require(join(dir, "data.cjs"));
const part = readFileSync("src/parts/35-battles.jsx", "utf8");
const configSrc = part.slice(part.indexOf("const BATTLES = {};"), part.indexOf("/** The battle a choice hosts"));
const BATTLES = new Function(configSrc + "\nreturn BATTLES;")();

// ---- 1. arithmetic and configs ----------------------------------------------------------------------------------
const ids = Object.keys(BATTLES);
check(ids.length === 8, `eight battles are registered (${ids.join(", ")})`);
for (const [id, cfg] of Object.entries(BATTLES)) {
  const camp = CAMPAIGNS[cfg.campaign];
  const axes = camp.triangleAxes.map((a) => a.key);
  const armIds = cfg.categories.map((k) => k.id);
  // wiring
  const node = camp.resolveNode(cfg.host.node, {}, Object.fromEntries(axes.map((a) => [a, 0])));
  const choice = node && node.choices[cfg.host.choice];
  check(!!choice && choice.keyBattleSubgame && choice.keyBattleSubgame.id === id, `${id}: the order ${cfg.host.node}[${cfg.host.choice}] names this battle`);
  check(!!choice && Array.isArray(choice.uncertain) && choice.uncertain.length === 2, `${id}: the hosting order has exactly two contested outcomes`);
  check([].concat(cfg.echo.node).every((n) => camp.NODE_ATLAS.some((a) => a.id === n)), `${id}: the echo report(s) ${[].concat(cfg.echo.node).join(", ")} exist`);
  check(cfg.categories.every((k) => axes.includes(k.meter)) && axes.includes(cfg.cleanMeter), `${id}: every arm's meter and the clean meter are axes of ${cfg.campaign}`);
  check(Object.keys(cfg.effectiveness).sort().join() === [...armIds].sort().join(), `${id}: a weight for every arm and no other`);
  check((cfg.commanders || []).every((m) => armIds.includes(m.category)), `${id}: every officer leads a real arm`);
  check((cfg.approaches || []).every((a) => Object.keys(a.modifiers).every((k) => armIds.includes(k))), `${id}: approach modifiers name real arms`);
  check((cfg.postures || []).every((p) => Object.keys(p.modifiers).every((k) => armIds.includes(k))), `${id}: enemy setups name real arms`);
  check(typeof cfg.modelled === "string" && cfg.modelled.length > 40 && cfg.categories.every((k) => k.units.length && k.real && k.context), `${id}: every arm has formations, a record and a note, and the config says what is modelled`);
  check(!/[—–]/.test(JSON.stringify(cfg).replace(/Kursk–Kharkov/g, "")), `${id}: no long dashes in the text (docs/WRITING.md)`);

  // the staff's plan is the record's odds
  let worst = 0;
  let bestOver = 0;
  for (let pool = 4; pool <= 8; pool++) {
    const staff = B.staffPlanFor(cfg, pool);
    for (const posture of cfg.postures) {
      worst = Math.max(worst, Math.abs(B.battleBonus(cfg, staff, posture, pool)));
      // the best plan under this setup
      let best = -99;
      for (const alloc of B.allBattleAllocations(cfg.categories, pool)) {
        for (const ap of cfg.approaches) for (const cm of [null, ...cfg.commanders.map((m) => m.id)]) {
          best = Math.max(best, B.battleBonus(cfg, { allocation: alloc, commanderId: cm, approachId: ap.id }, posture, pool));
        }
      }
      bestOver = Math.max(bestOver, best);
      if (pool === 6) check(best >= 2 && best <= B.BATTLE_BONUS_CLAMP, `${id}/${posture.id}: reading the enemy can beat the staff (best plan moves the odds ${best} points)`);
    }
  }
  check(worst === 0, `${id}: the staff's plan moves the odds by exactly 0 under every setup and every pool size`);
  // a plan with everything in one arm and the wrong setup loses to the staff's
  const lopsided = { allocation: Object.fromEntries(armIds.map((k, i) => [k, i === 0 ? 6 : 0])), commanderId: null, approachId: cfg.approaches[0].id };
  const losses = cfg.postures.map((p) => B.battleBonus(cfg, lopsided, p, 6));
  check(losses.every((v) => v <= 0) && losses.some((v) => v < 0), `${id}: everything in one arm never beats the staff's plan, and loses to it under some setup (${losses.join(", ")})`);
  // the costs
  const staff6 = B.staffPlanFor(cfg, 6);
  const costs = B.battlePlanCosts(cfg, lopsided, cfg.postures[0], 6, false, axes);
  check(Object.values(costs.totals).every((v) => v >= -1 && v <= 1) && Object.values(costs.totals).reduce((a, v) => a + Math.min(0, v), 0) >= -2, `${id}: a plan's cost to the meters stays within one point a meter and two in all`);
  check(costs.grade === "total" || costs.grade === "marginal", `${id}: a lost, lopsided battle is graded marginal or total (${costs.grade})`);
  const won = B.battlePlanCosts(cfg, staff6, cfg.postures[0], 6, true, axes);
  check(won.grade === "clean" || won.grade === "costly", `${id}: a won battle is graded clean or costly (${won.grade})`);
}
// weights stay in bounds and keep their total
{
  const u = [{ weight: 30 }, { weight: 70 }];
  const hi = B.shiftToward(u, 0, 20);
  const lo = B.shiftToward(u, 0, -20);
  const huge = B.shiftToward([{ weight: 90 }, { weight: 10 }], 0, 20);
  check(hi[0].weight === 50 && hi[1].weight === 50 && lo[0].weight === 10 && lo[1].weight === 90, "shiftToward moves weight toward the better outcome and keeps the total");
  check(huge[0].weight === 95 && huge[1].weight === 5, "shiftToward keeps every weight inside [5, 95]");
  check(B.shiftToward([{ weight: 1 }, { weight: 2 }, { weight: 3 }], 0, 5).length === 3, "shiftToward leaves a three-way roll alone");
}
// intelligence is right about three times in four
{
  const cfg = BATTLES.orel;
  let seed = 7;
  const rng = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  let right = 0;
  const N = 4000;
  for (let i = 0; i < N; i++) {
    const p = B.pickBattlePosture(cfg, rng);
    if (B.battleIntel(cfg, p, rng).right) right++;
  }
  check(Math.abs(right / N - 0.75) < 0.03, `the intelligence summary is right about three times in four (${(right / N).toFixed(3)})`);
}

// ---- 2. the screens -----------------------------------------------------------------------------------------------
const { makeContext } = await import(pathToFileURL(join(ROOT, "../packages/testkit/src/ui-driver.mjs")).href);
const cfgUi = (await import(pathToFileURL(join(HERE, "ui.config.mjs")).href)).default;
const bundle = readFileSync("dist/bundle.js", "utf8");
const find = (ctx, re) => ctx.buttons().find((b) => re.test(ctx.lab(b)));
const orders = (ctx) => ctx.buttons().filter((b) => ctx.lab(b) === "ISSUE THE ORDER");

async function startSouth(planning) {
  const ctx = makeContext(cfgUi, bundle, 4);
  if (ctx.failed) throw new Error(ctx.failed);
  ctx.runCase = ["southRussia", "Armed Forces of South Russia", false];
  await sleep(300);
  await ctx.settle();
  // same set-up as the baseline, but stop at the war room to flip the switch
  await ctx.click(ctx.findText("SETTINGS"));
  const instant = ctx.buttons().find((b) => /INSTANT/i.test(b.parentElement?.parentElement?.textContent || "") && ctx.lab(b) === "OFF");
  await ctx.click(instant);
  await ctx.click(find(ctx, /^Close and go back$/));
  await ctx.click(ctx.findText("Armed Forces of South Russia"));
  await ctx.click(find(ctx, /^OPEN COMMAND$/));
  const box = ctx.d.querySelector("input[type=checkbox]");
  check(!!box && box.checked, "war room: battle planning is on by default");
  if (!planning) await ctx.click(box);
  await ctx.click(find(ctx, /^ENTER COMMAND/));
  return ctx;
}
/** Plays South Russia to the assault at Ekaterinodar (press the assault, then the order that hosts the battle). */
async function toAssault(ctx) {
  const o = orders(ctx);
  await ctx.click(o[1]); // press the assault
  for (let i = 0; i < 4 && !/One More Day/.test(ctx.text()); i++) {
    const next = find(ctx, /^CONTINUE$/);
    if (!next) break;
    await ctx.click(next);
  }
}
const cardWithBadge = (ctx) => ctx.buttons().find((b) => ctx.lab(b) === "ISSUE THE ORDER" && /LEADS TO BATTLE PLANNING/.test(b.parentElement?.textContent || ""));

{
  const ctx = await startSouth(true);
  await toAssault(ctx);
  check(/One More Day/.test(ctx.text()), "ui: the run reaches the assault at Ekaterinodar");
  const card = cardWithBadge(ctx);
  check(!!card, "ui: the order that hosts the battle carries the badge");
  const others = orders(ctx).filter((b) => b !== card);
  check(others.every((b) => !/LEADS TO BATTLE PLANNING/.test(b.parentElement?.textContent || "")), "ui: the other order does not");
  await ctx.click(card);
  check(/ORDER OF BATTLE/.test(ctx.text()) && /INTELLIGENCE SUMMARY/.test(ctx.text()), "ui: the order opens the planning screen with its intelligence summary");
  check(!find(ctx, /^ISSUE THE PLAN$/), "ui: the plan cannot be issued before it is complete");
  await ctx.click(find(ctx, /^BACK TO THE ORDER$/));
  check(/One More Day/.test(ctx.text()) && orders(ctx).length === 2, "ui: back to the order returns to the report with the order unissued");
  await ctx.click(cardWithBadge(ctx));
  await ctx.click(find(ctx, /^LET THE STAFF PLAN IT$/));
  const issue = find(ctx, /^ISSUE THE PLAN$/);
  check(!!issue, "ui: letting the staff plan it completes the plan");
  await ctx.click(issue);
  const t = ctx.text();
  check(/AFTER-ACTION REPORT/.test(t) && /OUTCOME/.test(t), "ui: the outcome carries the after-action report");
  check(/The plan did as the staff's would have: the odds were the record's\./.test(t), "ui: the staff's plan plays the record's odds");
  await ctx.click(find(ctx, /^CONTINUE$/));
  for (let i = 0; i < 3 && !/What the Collapse Cost|Foothold Bought|What the/.test(ctx.text()); i++) {
    const next = find(ctx, /^CONTINUE$/);
    if (!next) break;
    await ctx.click(next);
  }
  check(/The assault was planned|The assault was won|The plan held together and the city did not fall|The assault was fought with arms left bare/.test(ctx.text()), "ui: the next report echoes how the battle was fought");
  ctx.restore();
}
{
  const ctx = await startSouth(false);
  await toAssault(ctx);
  check(!/LEADS TO BATTLE PLANNING/.test(ctx.text()), "ui: with planning off there is no badge");
  await ctx.click(orders(ctx)[0]);
  check(/OUTCOME/.test(ctx.text()) && !/AFTER-ACTION REPORT/.test(ctx.text()) && !/ORDER OF BATTLE/.test(ctx.text()), "ui: with planning off the order goes straight to its outcome, at the record's odds");
  ctx.restore();
}

// ---- every other campaign reaches a battle, plans it and gets its report ------------------------------------------------
for (const [id, label] of [
  ["siberia", "Provisional All-Russian Government"],
  ["bolsheviks", "Revolutionary Military Council of the Republic"],
  ["provisionalGov17", "The Provisional Government"],
]) {
  const ctx = makeContext(cfgUi, bundle, 11);
  if (ctx.failed) throw new Error(ctx.failed);
  ctx.runCase = [id, label, false];
  await sleep(300);
  await ctx.settle();
  const err = await cfgUi.setup(ctx, [id, label, false]);
  if (err) throw new Error(err);
  let reached = false;
  for (let i = 0; i < 120 && !reached; i++) {
    const host = cardWithBadge(ctx);
    if (host) {
      reached = true;
      await ctx.click(host);
      check(/ORDER OF BATTLE/.test(ctx.text()), `${id}: the order opens the planning screen`);
      await ctx.click(find(ctx, /^LET THE STAFF PLAN IT$/));
      await ctx.click(find(ctx, /^ISSUE THE PLAN$/));
      check(/AFTER-ACTION REPORT/.test(ctx.text()), `${id}: the outcome carries the after-action report`);
      await ctx.click(find(ctx, /^CONTINUE$/));
      check(!/ORDER OF BATTLE/.test(ctx.text()), `${id}: the run goes on after the battle`);
      break;
    }
    const o = orders(ctx);
    if (o.length) await ctx.click(o[0]);
    else {
      const next = find(ctx, /^(CONTINUE|PROCEED|NEXT)/i);
      if (!next) break;
      await ctx.click(next);
    }
  }
  check(reached, `${id}: a run reaches a battle (first order each time)`);
  ctx.restore();
}

if (fails.length) {
  console.log(`\n${fails.length} failure(s)`);
  process.exit(1);
}
console.log("\nbattle: all checks passed");
