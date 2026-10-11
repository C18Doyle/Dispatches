#!/usr/bin/env node
// Real-browser audit of the screens that tools/smoke-browser.mjs does not reach: a report in each command, the readings, the map dialog, the sealed
// cable and the outcome, the battle screen and the war record, in each colour theme, on a phone and (for the menu and a report) on a desktop.
//
//   node tools/audit-screens.mjs                 Chromium, three themes (needs: npm run build; npx playwright install chromium)
//   BROWSERS=chromium,webkit node tools/audit-screens.mjs
//   THEMES=night node tools/audit-screens.mjs    one theme only
//
// Per screen it checks: no uncaught error and no console.error; no horizontal scrolling; no serious or critical axe-core violation (which includes
// colour contrast); every button and link is at least 40 pixels tall (the phone tap target; WCAG's own minimum is 24). The map dialog must keep the
// focus inside it, close on Escape and give the focus back; the sealed cable must hand the focus on to the outcome when it is broken.
import { createServer } from "node:http";
import { existsSync, readFileSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, webkit } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const DIST = join(ROOT, "dist");
const THEMES = (process.env.THEMES ?? "paper,night,contrast").split(",");
const ENGINES = (process.env.BROWSERS ?? "chromium").split(",").map((x) => ({ chromium, webkit })[x.trim()]).filter(Boolean);
const MIN_TAP = 40;
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

let failures = 0;
let checks = 0;
const fail = (where, what) => { failures++; console.log(`FAIL ${where}: ${what}`); };
const ok = (where, what) => { checks++; if (process.env.VERBOSE) console.log(`ok   ${where}: ${what}`); };

async function scan(page, where, { viewport }) {
  checks++;
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (overflow > 1) fail(where, `scrolls sideways by ${overflow}px`);
  const res = await new AxeBuilder({ page }).analyze();
  for (const v of res.violations.filter((x) => x.impact === "serious" || x.impact === "critical")) {
    fail(where, `axe ${v.id} (${v.impact}): ${v.help}: ${v.nodes.slice(0, 3).map((n) => n.target.join(" ") + (n.any[0] && n.any[0].data && n.any[0].data.fgColor ? ` [${n.any[0].data.fgColor} on ${n.any[0].data.bgColor}, ${n.any[0].data.contrastRatio}]` : "")).join(" | ")}`);
  }
  if (viewport === "phone") {
    const small = await page.evaluate((min) => [...document.querySelectorAll("button, a[href], summary, input")]
      .filter((el) => { const box = el.tagName === "INPUT" && el.closest("label") ? el.closest("label") : el; const r = box.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && cs.visibility !== "hidden" && r.height < min && el.tagName !== "A" && !el.closest(".dg-gloss") && !el.classList.contains("dg-term"); })
      .map((el) => `${el.tagName.toLowerCase()}.${el.className} "${(el.textContent || "").trim().slice(0, 24)}" ${Math.round(el.getBoundingClientRect().height)}px`), MIN_TAP);
    for (const s of small.slice(0, 4)) fail(where, `tap target under ${MIN_TAP}px: ${s}`);
  }
}

async function click(page, name, opts = {}) {
  await page.getByRole("button", { name, ...opts }).first().click();
  await page.waitForTimeout(160);
}

/** Play a command's first reports with the first open order each time, until the heading says `title`. */
async function playTo(page, title) {
  for (let i = 0; i < 60; i++) {
    if ((await page.locator("h1").first().innerText()).includes(title)) return true;
    const seal = page.getByRole("button", { name: /^Break the seal$/ });
    if (await seal.count()) { await seal.click(); await page.waitForTimeout(120); continue; }
    const cont = page.getByRole("button", { name: /^Continue$/ });
    if (await cont.count()) { await cont.click(); await page.waitForTimeout(120); continue; }
    const order = page.locator("button.dg-choice:not([disabled]):not(.dg-opt):not(.dg-issue)").first();
    if (!(await order.count())) return false;
    await order.focus();
    await page.keyboard.press("Enter"); // a keyboard press signs at once
    await page.waitForTimeout(160);
  }
  return false;
}

for (const engine of ENGINES) {
  const browser = await engine.launch();
  for (const theme of THEMES) {
    for (const vp of [{ label: "phone", width: 375, height: 812, mobile: true }, { label: "desktop", width: 1280, height: 800, mobile: false }]) {
      const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: { width: vp.width, height: vp.height }, hasTouch: vp.mobile, isMobile: vp.mobile && engine === chromium });
      await ctx.addInitScript(([t]) => { try { localStorage.setItem("dispatches1914_settings_v1", JSON.stringify({ schemaVersion: 1, textSize: "s", sound: false, atmosphere: false, battles: true, holdToSign: true, theme: t, font: "typewriter" })); } catch (e) { /* none */ } }, [theme]);
      const page = await ctx.newPage();
      const errors = [];
      page.on("pageerror", (e) => errors.push(String(e)));
      page.on("console", (m) => { if (m.type() === "error" && !/AudioContext|autoplay|favicon|404/i.test(m.text())) errors.push(m.text()); });
      const at = (s) => `${engine.name()}/${theme}/${vp.label}/${s}`;
      await page.goto(URL_);
      await page.waitForSelector("main");
      await scan(page, at("menu"), { viewport: vp.label });
      await page.locator("details summary", { hasText: /SETTINGS/ }).first().click();
      await scan(page, at("menu settings"), { viewport: vp.label });
      if (vp.label === "desktop") { await ctx.close(); continue; }

      // a report in each command
      for (const [card, label] of [[/Oberste/, "ohl"], [/Grand Quartier/, "gqg"], [/Stavka/, "stavka"], [/British Expeditionary/, "bef"], [/Armeeoberkommando/, "aok"], [/Ottoman General Staff/, "otto"]]) {
        await page.goto(URL_);
        await page.waitForSelector("main");
        const discard = page.getByRole("button", { name: /^Discard$/ });
        if (await discard.count()) await discard.click();
        await click(page, card);
        await scan(page, at(`report ${label}`), { viewport: vp.label });
      }

      // the readings, the map dialog and its focus
      await page.goto(URL_);
      await page.waitForSelector("main");
      const d2 = page.getByRole("button", { name: /^Discard$/ });
      if (await d2.count()) await d2.click();
      await click(page, /Grand Quartier/);
      const reached = await playTo(page, "The Flank in the Open");
      if (!reached) fail(at("walk"), "could not reach the Marne report");
      else {
        await page.locator(".dg-meter-btn").first().click();
        await scan(page, at("readings open"), { viewport: vp.label });
        const opener = page.getByRole("button", { name: /Expand the map/ });
        await opener.focus();
        await page.keyboard.press("Enter");
        await page.waitForSelector('[role="dialog"]');
        await scan(page, at("map dialog"), { viewport: vp.label });
        let inside = true;
        for (let i = 0; i < 14; i++) {
          await page.keyboard.press("Tab");
          if (!(await page.evaluate(() => !!document.activeElement && !!document.activeElement.closest('[role="dialog"]')))) inside = false;
        }
        checks++;
        if (!inside) fail(at("map dialog"), "Tab leaves the dialog");
        await page.keyboard.press("Escape");
        await page.waitForTimeout(120);
        checks++;
        if (await page.locator('[role="dialog"]').count()) fail(at("map dialog"), "Escape does not close it");
        else if (!(await page.evaluate(() => document.activeElement && /Expand the map/.test(document.activeElement.textContent || "")))) fail(at("map dialog"), "the focus is not given back to the Expand button");

        // the contested order opens the battle screen; plan it, sign it, break the seal
        const attack = page.getByRole("button", { name: /Turn and attack/ });
        await attack.focus();
        await page.keyboard.press("Enter");
        await page.waitForSelector("text=Order of Battle");
        await scan(page, at("battle screen"), { viewport: vp.label });
        await click(page, /Let the staff plan it/);
        await click(page, /^Issue the plan/);
        await scan(page, at("sealed cable"), { viewport: vp.label });
        await click(page, /^Break the seal$/);
        checks++;
        const focused = await page.evaluate(() => (document.activeElement ? document.activeElement.tagName + ":" + (document.activeElement.textContent || "").slice(0, 40) : ""));
        if (/^BODY/.test(focused) || /Break the seal/.test(focused)) fail(at("outcome"), `the focus is lost when the seal is broken (${focused})`);
        await scan(page, at("outcome"), { viewport: vp.label });
      }

      // the war record
      await page.goto(URL_);
      await page.waitForSelector("main");
      await click(page, /WAR RECORD/);
      for (const tab of ["Service", "Dossiers", "Endings", "Atlas", "Battles", "Glossary"]) {
        await click(page, new RegExp(`^${tab}$`));
        await scan(page, at(`record ${tab}`), { viewport: vp.label });
      }
      checks++;
      if (errors.length) fail(at("console"), errors.slice(0, 3).join(" | "));
      await ctx.close();
    }
  }
  await browser.close();
}
server.close();
console.log(`audit-screens: ${checks} checks, ${failures} failure${failures === 1 ? "" : "s"}`);
process.exit(failures ? 1 : 0);
