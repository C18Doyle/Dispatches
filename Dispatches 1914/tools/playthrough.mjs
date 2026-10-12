#!/usr/bin/env node
// A bot that plays every command of the built game to an ending in a real browser, by clicking, and checks each screen on the way.
//
//   node tools/playthrough.mjs                 three playthroughs of each command (needs: npm run build; npx playwright install chromium)
//   RUNS=1 node tools/playthrough.mjs          one playthrough of each (record, in easy mode)
//   COMMANDS=gqg,otto VERBOSE=1 node tools/playthrough.mjs
//
// The three playthroughs of a command are: the record (in easy mode, taking the order marked "the order the command gave" each time), and two seeded random
// ones (different orders, a battle planned by hand on one and by the staff on the other), in different colour themes. On every screen it checks that the page
// has one main landmark and a level-one heading, that no routing error is shown, and (on the first screen of each kind in a run, and every tenth) that axe finds
// no serious or critical violation. A run fails if it throws, logs a console error, or does not reach an ending within 160 screens. At the ending it checks the
// card and the text copy. It exists because a hover state that went dark on dark was found by luck: this plays enough of the game to find that class of fault.
import { createServer } from "node:http";
import { existsSync, readFileSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const DIST = join(ROOT, "dist");
const VERBOSE = Boolean(process.env.VERBOSE);
const RUNS = Number(process.env.RUNS || 3);
const MAX_SCREENS = 160;
const ALL = [[/Oberste/, "ohl"], [/Grand Quartier/, "gqg"], [/Stavka/, "stavka"], [/British Expeditionary/, "bef"], [/Armeeoberkommando/, "aok"], [/Ottoman General Staff/, "otto"]];
const COMMANDS = ALL.filter(([, id]) => !process.env.COMMANDS || process.env.COMMANDS.split(",").includes(id));
const PLAYS = [
  { label: "record", easy: true, theme: "sepia", seed: 0 },
  { label: "random-a", easy: false, theme: "paper", seed: 11, manualBattle: true },
  { label: "random-b", easy: false, theme: "night", seed: 29, manualBattle: false },
].slice(0, RUNS);
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png" };

const server = await new Promise((resolve) => {
  const s = createServer((req, res) => {
    const rel = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)).split(/[\\/]+/).filter((p) => p && p !== "..").join("/");
    const file = join(DIST, rel === "" ? "index.html" : rel);
    if (!existsSync(file)) return void res.writeHead(404).end("not found");
    res.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" }).end(readFileSync(file));
  }).listen(0, "127.0.0.1", () => resolve(s));
});
const URL_ = `http://127.0.0.1:${server.address().port}/`;
const rngFor = (seed) => { let s = seed >>> 0 || 1; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; };

async function playOne(browser, [card, id], play) {
  const where = `${id}/${play.label}`;
  const problems = [];
  const rnd = rngFor(play.seed + id.length * 101);
  const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 430, height: 900 }, acceptDownloads: true });
  await ctx.addInitScript(([t]) => { try { localStorage.setItem("dispatches1914_settings_v1", JSON.stringify({ schemaVersion: 1, textSize: "s", sound: false, atmosphere: false, battles: true, holdToSign: true, theme: t, font: "theme" })); } catch (e) { /* none */ } }, [play.theme]);
  ctx.setDefaultTimeout(8000);
  const page = await ctx.newPage();
  page.on("pageerror", (e) => problems.push(`${where}: uncaught error: ${String(e).slice(0, 160)}`));
  page.on("console", (m) => { if (m.type() === "error" && !/favicon|AudioContext|autoplay/i.test(m.text())) problems.push(`${where}: console error: ${m.text().slice(0, 160)}`); });
  const seen = new Set();
  let screens = 0, orders = 0, battles = 0, events = 0, ended = false;
  try {
    await page.goto(URL_);
    await page.waitForSelector("main");
    await page.getByRole("button", { name: card }).first().click();
    await page.waitForSelector("main");
    if (!(await page.getByText("Where things stand").count())) problems.push(`${where}: the command does not open its briefing`);
    if (play.easy) await page.getByRole("button", { name: /^Easy mode$/ }).click();
    await page.getByRole("button", { name: /^Enter the war room$/ }).click();
    await page.waitForSelector("main");

    for (let step = 0; step < MAX_SCREENS && !ended; step++) {
      const mains = await page.locator("main").count();
      if (mains !== 1) { problems.push(`${where}: step ${step}: ${mains} main landmarks`); break; }
      const screen = await page.locator("main").getAttribute("data-screen");
      if (!(await page.locator("h1").count())) problems.push(`${where}: step ${step} (${screen}): no level-one heading`);
      if (await page.getByText(/does not resolve/).count()) { problems.push(`${where}: step ${step}: a routing error is shown`); break; }
      screens++;
      if (!seen.has(screen) || step % 10 === 0) {
        seen.add(screen);
        const res = await new AxeBuilder({ page }).analyze();
        for (const v of res.violations.filter((x) => x.impact === "serious" || x.impact === "critical")) {
          problems.push(`${where}: step ${step} (${screen}): axe ${v.id} on ${v.nodes.length} element(s): ${v.nodes[0].target.join(" ")}`);
        }
      }
      if (screen === "node") {
        if (await page.getByText("Share this file").count()) {
          ended = true;
          if (!(await page.locator(".dg-sharecard").innerText()).includes(await page.locator(".dg-sc-cmd").innerText())) problems.push(`${where}: the share card does not name the command`);
          await page.getByRole("button", { name: /Copy as text/ }).click();
          try { await page.waitForFunction(() => (document.querySelector(".dg-share .dg-note")?.textContent || "").trim().length > 0, null, { timeout: 4000 }); } catch (e) { problems.push(`${where}: copying as text says nothing`); }
          break;
        }
        // the ending reached without a card means no rank was computed: a fault
        if (await page.locator(".dg-badge").count()) { problems.push(`${where}: an ending with no share card`); ended = true; break; }
        const all = page.locator("button.dg-choice:not([disabled]):not(.dg-opt):not(.dg-issue)");
        const n = await all.count();
        if (!n) { problems.push(`${where}: step ${step}: a decision with no order that can be given`); break; }
        let pick = all.nth(Math.floor(rnd() * n));
        if (play.easy) { const rec = page.locator("button.dg-choice:not([disabled]):has(.dg-record-mark)"); if (await rec.count()) pick = rec.first(); }
        orders++;
        await pick.focus();
        await page.keyboard.press("Enter");
      } else if (screen === "outcome") {
        const seal = page.getByRole("button", { name: /^Break the seal$/ });
        if (await seal.count()) await seal.click();
        else await page.getByRole("button", { name: /^Continue$/ }).click();
      } else if (screen === "event") {
        events++;
        await page.getByRole("button", { name: /^Continue$/ }).click();
      } else if (screen === "battle") {
        battles++;
        if (!play.manualBattle) {
          await page.getByRole("button", { name: /Let the staff plan it/ }).click();
        } else {
          const officers = page.locator('[aria-label="Commander"] button.dg-opt');
          if (await officers.count()) { await officers.nth(Math.floor(rnd() * (await officers.count()))).click(); await page.getByRole("button", { name: /^Next: / }).first().click(); }
          const approaches = page.locator('[aria-label="Approach"] button.dg-opt');
          if (await approaches.count()) { await approaches.nth(Math.floor(rnd() * (await approaches.count()))).click(); await page.getByRole("button", { name: /^Next: / }).first().click(); }
          for (let k = 0; k < 12; k++) {
            const left = await page.locator(".dg-bt-bar").innerText();
            if (/Counters\s*0 left/.test(left)) break;
            const more = page.locator('button[aria-label^="More in"]:not([disabled])');
            const m = await more.count();
            if (!m) break;
            await more.nth(Math.floor(rnd() * m)).click();
          }
        }
        const issue = page.getByRole("button", { name: /^Issue the plan/ });
        if (await issue.isDisabled()) problems.push(`${where}: the battle plan cannot be issued after planning`);
        await issue.click();
        // the second day: a stance chosen by the bot's own dice, a counter moved now and then
        const stances = page.locator('[aria-label="Stance"] button');
        if (await stances.count()) await stances.nth(Math.floor(rnd() * (await stances.count()))).click();
        if (rnd() < 0.5) {
          const out = page.locator('button[aria-label^="Take a counter out of"]:not([disabled])');
          if (await out.count()) {
            await out.nth(Math.floor(rnd() * (await out.count()))).click();
            const into = page.locator('button[aria-label^="Put a counter into"]:not([disabled])');
            if (await into.count()) await into.nth(Math.floor(rnd() * (await into.count()))).click();
          }
        }
        const carry = page.getByRole("button", { name: /^Carry on to the second day/ });
        if (await carry.isDisabled()) problems.push(`${where}: the second day cannot be carried on`);
        await carry.click();
      } else {
        problems.push(`${where}: step ${step}: unexpected screen "${screen}"`);
        break;
      }
      if (VERBOSE) console.log(`  ${where} step ${step} ${screen}`);
    }
    if (!ended && !problems.length) problems.push(`${where}: no ending within ${MAX_SCREENS} screens`);
  } catch (e) {
    problems.push(`${where}: the bot stopped: ${String(e.message).split("\n")[0].slice(0, 200)}`);
  } finally {
    await ctx.close();
  }
  console.log(`${problems.length ? "FAIL" : "ok  "} ${where}: ${screens} screens, ${orders} orders, ${battles} battles, ${events} events${ended ? ", ended" : ""}`);
  return problems;
}

const browser = await chromium.launch();
const jobs = [];
for (const c of COMMANDS) for (const p of PLAYS) jobs.push([c, p]);
const all = [];
const LANES = 3;
let next = 0;
await Promise.all(Array.from({ length: LANES }, async () => {
  while (next < jobs.length) {
    const [c, p] = jobs[next++];
    all.push(...(await playOne(browser, c, p)));
  }
}));
await browser.close();
server.close();
for (const p of all) console.log("  - " + p);
console.log(`playthrough: ${jobs.length} runs, ${all.length} problem${all.length === 1 ? "" : "s"}`);
process.exit(all.length ? 1 : 0);
