#!/usr/bin/env node
// Reduced motion, in a real browser (the built game, dist/full): a German file played with the keys, twice, once with the system asking for
// reduced motion (prefers-reduced-motion: reduce) and once with the game's own setting on. On every screen it reaches it checks that:
//   * no CSS animation or transition runs for longer than a few milliseconds (document.getAnimations());
//   * nothing scrolls smoothly (scrollIntoView, scrollTo and scrollBy are watched, and the page's scroll-behavior);
//   * no script runs an animation loop while nobody touches anything (requestAnimationFrame is counted over a quiet second);
//   * the text does not keep growing on its own (a typewriter or a battle played out beat by beat).
// The opening screen, the war room, the menu and the war journal are checked as well.
//   npm run build:nozip && node tools/motion-check.mjs
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist", "full");
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".opus": "audio/ogg" };
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
const MAX_STEPS = Number(process.argv.find((a) => /^\d+$/.test(a)) || 400);

// Installed before the page's own scripts: counts animation frames and records smooth scrolling.
function watch() {
  window.__motion = { raf: 0, smooth: [] };
  const raf = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = (cb) => {
    window.__motion.raf++;
    return raf(cb);
  };
  const note = (what, opts) => {
    if (opts && typeof opts === "object" && opts.behavior === "smooth") window.__motion.smooth.push(what);
  };
  const siv = Element.prototype.scrollIntoView;
  Element.prototype.scrollIntoView = function (o) {
    note("scrollIntoView on " + this.tagName.toLowerCase() + "." + String(this.className || "").split(" ")[0], o);
    return siv.call(this, o);
  };
  for (const m of ["scrollTo", "scrollBy"]) {
    const f = window[m].bind(window);
    window[m] = (a, b) => (note("window." + m, a), f(a, b));
    const ef = Element.prototype[m];
    if (ef) Element.prototype[m] = function (a, b) { note(m + " on " + this.tagName.toLowerCase(), a); return ef.call(this, a, b); };
  }
}

const problems = [];
const browser = await chromium.launch();

async function check(page, where, label) {
  const found = new Set();
  // Animations and transitions running longer than a few milliseconds.
  const anims = await page.evaluate(() =>
    document
      .getAnimations()
      .filter((a) => a.playState === "running")
      .map((a) => {
        const d = a.effect && a.effect.getComputedTiming ? a.effect.getComputedTiming().duration : 0;
        const el = a.effect && a.effect.target;
        const name = a.animationName || a.transitionProperty || "animation";
        return { d: typeof d === "number" ? d : 0, what: `${name} on ${el ? el.tagName.toLowerCase() + "." + String(el.className || "").split(" ").slice(0, 2).join(".") : "?"}` };
      })
      .filter((a) => a.d > 5)
  );
  for (const a of anims) found.add(`a ${Math.round(a.d)} ms ${a.what}`);
  const behavior = await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior);
  if (behavior === "smooth") found.add("the page scrolls smoothly (scroll-behavior: smooth)");
  // A quiet second: animation frames and growing text.
  const before = await page.evaluate(() => ((window.__motion.raf = 0), (window.__motion.smooth = []), document.body.innerText.length));
  await page.waitForTimeout(1000);
  const after = await page.evaluate(() => ({ raf: window.__motion.raf, smooth: window.__motion.smooth, len: document.body.innerText.length }));
  if (after.raf > 10) found.add(`${after.raf} animation frames requested in a quiet second (a script animates)`);
  for (const s of after.smooth) found.add(`smooth scrolling: ${s}`);
  if (after.len > before + 20) found.add(`the text grew by ${after.len - before} characters on its own (a typewriter or a battle played beat by beat)`);
  for (const f of found) problems.push(`${where}: ${label}: ${f}`);
  return found.size;
}

const text = (page) => page.evaluate(() => document.body.innerText);
const has = (page, sel) => page.evaluate((s) => [...document.querySelectorAll(s)].some((e) => !e.disabled && e.getBoundingClientRect().width > 0), sel);
const screenName = (t) => (t.match(/^[^\n]{0,60}/) || [""])[0].replace(/\s+/g, " ").trim();
async function key(page, k) {
  await page.evaluate(() => document.activeElement && document.activeElement.blur && document.activeElement.blur());
  await page.keyboard.press(k);
  await page.waitForTimeout(120);
}

for (const mode of [
  { where: "system", context: { reducedMotion: "reduce" }, storage: {} },
  { where: "in-game setting", context: { reducedMotion: "no-preference" }, storage: { dispatchesWW2_reduced_motion: "true" } },
  // The control: motion left on. The check must find something here, or it is blind.
  { where: "control", context: { reducedMotion: "no-preference" }, storage: {}, control: true, steps: 30 },
]) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, ...mode.context });
  await ctx.addInitScript((s) => {
    try {
      localStorage.setItem("dispatchesWW2_music", "false");
      localStorage.setItem("dispatchesWW2_staff_plans", "1");
      for (const [k, v] of Object.entries(s)) localStorage.setItem(k, v);
    } catch (e) {
      /* none */
    }
  }, mode.storage);
  await ctx.addInitScript(watch);
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e).slice(0, 160)));
  await page.goto(URL_, { waitUntil: "load" });
  await page.waitForTimeout(800);
  let screens = 0;
  await check(page, mode.where, "the opening screen");
  screens++;
  await page.evaluate(() => [...document.querySelectorAll("button")].find((x) => (x.innerText || "").trim().startsWith("OKW"))?.focus());
  await page.keyboard.press("Enter");
  await page.waitForTimeout(400);
  await check(page, mode.where, "the war room");
  screens++;
  await key(page, "Enter");
  await page.waitForTimeout(300);
  await key(page, "Escape");
  await check(page, mode.where, "the menu");
  await key(page, "Escape");
  await key(page, "j");
  await check(page, mode.where, "the war journal");
  await key(page, "Escape");
  screens += 2;
  let last = "";
  let stalls = 0;
  let ended = false;
  for (let i = 0; i < (mode.steps || MAX_STEPS); i++) {
    const t = await text(page);
    const sig = t.length + ":" + t.slice(0, 160);
    if (sig !== last) {
      await check(page, mode.where, screenName(t) || `step ${i}`);
      screens++;
      stalls = 0;
    } else stalls++;
    last = sig;
    if (/File Closed|Command Terminated|Front Collapsed/i.test(t)) {
      ended = true;
      break;
    }
    if (stalls > 25) {
      problems.push(`${mode.where}: stuck at step ${i}: ${screenName(t)}`);
      break;
    }
    if (await has(page, '[data-hotkey="1"]')) await key(page, "1");
    else if (await has(page, '[data-hotkey="enter"]')) await key(page, "Enter");
    else {
      await page.keyboard.press("Tab");
      await page.keyboard.press("Enter");
      await page.waitForTimeout(150);
    }
  }
  for (const e of errors) problems.push(`${mode.where}: ${e}`);
  if (mode.control) {
    // What the control found is the proof the check can see motion, not a problem.
    const seen = problems.filter((p) => p.startsWith("control:"));
    for (const p of seen) problems.splice(problems.indexOf(p), 1);
    if (!seen.length) problems.push("control: with motion left on the check found nothing moving: it is blind");
    console.log(`${seen.length ? "ok  " : "FAIL"} control: with motion on, ${seen.length} moving thing(s) found (${seen.slice(0, 2).map((p) => p.split(": ").slice(2).join(": ")).join("; ")})`);
    await ctx.close();
    continue;
  }
  const mine = problems.filter((p) => p.startsWith(mode.where + ":")).length;
  console.log(`${mine ? "FAIL" : "ok  "} ${mode.where}: ${screens} screens checked${ended ? " to the end of the file" : ""}${mine ? `, ${mine} problem(s)` : ", nothing moves"}`);
  await ctx.close();
}

await browser.close();
server.close();
if (problems.length) {
  console.error(`\nmotion check: ${problems.length} problem(s)`);
  for (const p of [...new Set(problems)].slice(0, 60)) console.error("  " + p);
  process.exit(1);
}
console.log("\nmotion check: with reduced motion asked for, nothing on screen moves on its own");
