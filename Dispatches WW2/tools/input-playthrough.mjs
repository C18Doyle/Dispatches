#!/usr/bin/env node
// The keyboard and the controller, in a real browser (part 47's useInputControls). Two runs of the built game (dist/full):
//   keyboard: a German file played to its ending with keys only: 1 for the first order, Enter to go on, Tab and Enter where a screen has
//             no marked button. Escape opens the menu and closes it again, J opens the war journal. The staff plan the battles.
//   pad:      a simulated controller (navigator.getGamepads is stubbed): the D-pad moves the focus to an order, A presses it, and
//             Start and B open and close the menu, for the first reports of an IGHQ file.
// Both fail on a console error, the damaged-file screen, or a key that does nothing.
//   npm run build:nozip && node tools/input-playthrough.mjs
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist", "full");
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".ogg": "audio/ogg", ".opus": "audio/ogg" };
if (!existsSync(join(DIST, "index.html"))) {
  console.error("No build in dist/full: run npm run build:nozip first.");
  process.exit(1);
}
const server = createServer((req, res) => {
  const rel = decodeURIComponent(new URL(req.url, "http://x").pathname).replace(/^\/+/, "") || "index.html";
  const file = join(DIST, rel);
  if (!file.startsWith(DIST) || !existsSync(file)) return void res.writeHead(404).end();
  res.writeHead(200, { "content-type": MIME[extname(file)] || "application/octet-stream" }).end(readFileSync(file));
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const URL_ = `http://127.0.0.1:${server.address().port}/`;

const problems = [];
const browser = await chromium.launch();
async function open(initScript) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
  await ctx.addInitScript(() => {
    try {
      localStorage.setItem("dispatchesWW2_instant_text", "true");
      localStorage.setItem("dispatchesWW2_music", "false");
      localStorage.setItem("dispatchesWW2_staff_plans", "1");
    } catch (e) {
      /* none */
    }
  });
  if (initScript) await ctx.addInitScript(initScript);
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e).slice(0, 160)));
  page.on("console", (m) => {
    if (m.type() === "error" && !/favicon|AudioContext|autoplay|Failed to load resource|fonts\.g/i.test(m.text())) errors.push(m.text().slice(0, 160));
  });
  await page.goto(URL_, { waitUntil: "load" });
  await page.waitForTimeout(800);
  return { ctx, page, errors };
}
const text = (page) => page.evaluate(() => document.body.innerText);
const reportNo = async (page) => Number(((await text(page)).match(/· No\. (\d+)/i) || [])[1] || 0);
const has = (page, sel) => page.evaluate((s) => [...document.querySelectorAll(s)].some((e) => !e.disabled && e.getBoundingClientRect().width > 0), sel);
const dialogOpen = (page) => page.evaluate(() => !!document.querySelector('[role="dialog"][aria-modal="true"]'));
async function blur(page) {
  await page.evaluate(() => document.activeElement && document.activeElement.blur && document.activeElement.blur());
}
async function key(page, k) {
  await blur(page);
  await page.keyboard.press(k);
  await page.waitForTimeout(90);
}
/** Focus a command's card on the opening screen and press Enter on it, then Enter again in the war room. */
async function openCommand(page, seal) {
  await page.evaluate((s) => {
    const b = [...document.querySelectorAll("button")].find((x) => (x.innerText || "").trim().startsWith(s));
    if (b) b.focus();
  }, seal);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(300);
  await key(page, "Enter");
  await page.waitForTimeout(300);
}

// ---- keyboard ----
{
  const where = "keyboard/german";
  const { ctx, page, errors } = await open();
  await openCommand(page, "OKW");
  if ((await reportNo(page)) !== 1) problems.push(`${where}: Enter on the OKW card and Enter in the war room did not open report 1`);
  await key(page, "Escape");
  if (!(await dialogOpen(page))) problems.push(`${where}: Escape did not open the menu`);
  await key(page, "Escape");
  if (await dialogOpen(page)) problems.push(`${where}: Escape did not close the menu`);
  await key(page, "j");
  if (!/War Journal/i.test(await text(page))) problems.push(`${where}: J did not open the war journal`);
  await key(page, "Escape");
  let ended = false;
  let stalls = 0;
  let last = "";
  for (let i = 0; i < 1500 && !ended; i++) {
    const t = await text(page);
    if (/File Closed|Command Terminated|Front Collapsed/i.test(t)) {
      ended = true;
      break;
    }
    if (/The File Was Damaged/.test(t)) {
      problems.push(`${where}: the damaged-file screen at step ${i}`);
      break;
    }
    if (await has(page, '[data-hotkey="1"]')) await key(page, "1");
    else if (await has(page, '[data-hotkey="enter"]')) await key(page, "Enter");
    else {
      // A screen without a marked button (the battle report, a staff plan): Tab to the first button and press it.
      await blur(page);
      await page.keyboard.press("Tab");
      await page.keyboard.press("Enter");
      await page.waitForTimeout(150);
    }
    const sig = t.length + ":" + t.slice(0, 120);
    stalls = sig === last ? stalls + 1 : 0;
    last = sig;
    if (stalls > 25) {
      problems.push(`${where}: stuck at step ${i}: ${t.slice(0, 100).replace(/\s+/g, " ")}`);
      break;
    }
  }
  if (!ended && !problems.some((p) => p.startsWith(where))) problems.push(`${where}: no ending within 1500 key presses`);
  for (const e of errors) problems.push(`${where}: ${e}`);
  console.log(`${ended ? "ok  " : "FAIL"} ${where}: ${ended ? "played to its ending with keys only" : "did not reach an ending"}`);
  await ctx.close();
}

// ---- controller ----
{
  const where = "pad/japan";
  const stub = () => {
    const state = { buttons: Array.from({ length: 17 }, () => ({ pressed: false, value: 0 })), axes: [0, 0, 0, 0] };
    const pad = { id: "test pad", index: 0, connected: true, mapping: "standard", timestamp: 0, buttons: state.buttons, axes: state.axes };
    window.__pad = state;
    navigator.getGamepads = () => [pad];
  };
  const { ctx, page, errors } = await open(stub);
  await page.evaluate(() => window.dispatchEvent(new Event("gamepadconnected")));
  const pressPad = async (i) => {
    await page.evaluate((n) => (window.__pad.buttons[n].pressed = true), i);
    await page.waitForTimeout(120);
    await page.evaluate((n) => (window.__pad.buttons[n].pressed = false), i);
    await page.waitForTimeout(120);
  };
  /** D-pad down until the focus is on an element matching sel (at most 60 presses). */
  const focusOn = async (sel) => {
    for (let i = 0; i < 60; i++) {
      if (await page.evaluate((s) => !!document.activeElement && document.activeElement.matches(s), sel)) return true;
      await pressPad(13);
    }
    return false;
  };
  if (!(await focusOn("button"))) problems.push(`${where}: the D-pad did not move the focus`);
  if ((await page.evaluate(() => document.documentElement.dataset.input)) !== "pad") problems.push(`${where}: the page did not switch to controller mode`);
  // the IGHQ card, then Enter the War Room
  for (const target of ['button:not([data-hotkey])', '[data-hotkey="enter"]']) {
    const ok = target.includes("enter")
      ? await focusOn('[data-hotkey="enter"]')
      : await page.evaluate(() => {
          const b = [...document.querySelectorAll("button")].find((x) => (x.innerText || "").trim().startsWith("IGHQ"));
          if (b) b.focus();
          return !!b;
        });
    if (!ok) problems.push(`${where}: could not reach ${target}`);
    await pressPad(0);
    await page.waitForTimeout(300);
  }
  const start = await reportNo(page);
  if (start !== 1) problems.push(`${where}: A on the card and on Enter the War Room did not open report 1 (at ${start})`);
  await pressPad(9);
  if (!(await dialogOpen(page))) problems.push(`${where}: Start did not open the menu`);
  await pressPad(1);
  if (await dialogOpen(page)) problems.push(`${where}: B did not close the menu`);
  for (let r = 0; r < 4; r++) {
    const before = await reportNo(page);
    if (!(await focusOn('[data-hotkey="1"]'))) {
      problems.push(`${where}: report ${before}: could not reach the first order with the D-pad`);
      break;
    }
    await pressPad(0);
    await page.waitForTimeout(200);
    for (let k = 0; k < 6 && (await reportNo(page)) === 0; k++) {
      if (await focusOn('[data-hotkey="enter"]')) await pressPad(0);
      await page.waitForTimeout(200);
    }
    const after = await reportNo(page);
    if (after <= before) {
      problems.push(`${where}: report ${before}: A on the order and on Next did not move the file on (at ${after})`);
      break;
    }
  }
  for (const e of errors) problems.push(`${where}: ${e}`);
  console.log(`${problems.some((p) => p.startsWith(where)) ? "FAIL" : "ok  "} ${where}: four reports played with the D-pad and A, menu with Start and B`);
  await ctx.close();
}

await browser.close();
server.close();
if (problems.length) {
  console.error(`\ninput playthrough: ${problems.length} problem(s)`);
  for (const p of problems) console.error("  " + p);
  process.exit(1);
}
console.log("\ninput playthrough: keyboard and controller behave");
