#!/usr/bin/env node
// Text overflow in every language: German, French and Japanese labels run longer than the English ones they were written against. Opens the
// built game (dist/full) in each of the nine languages, at the Steam Deck's 1280x800 and at a phone's 375x812, walks through the opening
// screen, the war room, the first briefing and the in-run menu, and fails when
//   * the page is wider than the screen (something pushes it sideways), or
//   * a button, label or heading cuts its own text off (its content is wider than its box and the overflow is hidden or clipped).
//   npm run build:nozip && node tools/overflow-check.mjs        (in CI's browser job; screenshots of each failure in tests/browser-shots/overflow/)
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFileSync, existsSync, mkdirSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist", "full");
const OUT = join(ROOT, "..", "tests", "browser-shots", "overflow");
const LANGS = ["en", "de", "fr", "es", "it", "pt-BR", "ru", "zh-Hans", "ja"];
const SIZES = [
  { name: "deck", width: 1280, height: 800 },
  { name: "phone", width: 375, height: 812 },
];
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".ogg": "audio/ogg", ".opus": "audio/ogg" };
if (!existsSync(join(DIST, "index.html"))) {
  console.error("No build in dist/full: run npm run build:nozip first.");
  process.exit(1);
}
mkdirSync(OUT, { recursive: true });
const server = createServer((req, res) => {
  const rel = decodeURIComponent(new URL(req.url, "http://x").pathname).replace(/^\/+/, "") || "index.html";
  const file = join(DIST, rel);
  if (!file.startsWith(DIST) || !existsSync(file)) return void res.writeHead(404).end();
  res.writeHead(200, { "content-type": MIME[extname(file)] || "application/octet-stream" }).end(readFileSync(file));
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const URL_ = `http://127.0.0.1:${server.address().port}/`;

// Presses the first enabled button whose label matches (the seals and "Enter" are the same in every language: the seals are not translated,
// and the war room's button is found by its data-hotkey).
const pressSeal = (page, seal) =>
  page.evaluate((s) => {
    const b = [...document.querySelectorAll("button")].find((x) => !x.disabled && (x.innerText || "").trim().toUpperCase().startsWith(s));
    if (b) b.click();
    return !!b;
  }, seal);
const pressHotkey = (page, key) =>
  page.evaluate((k) => {
    const b = document.querySelector(`[data-hotkey="${k}"]`);
    if (b) b.click();
    return !!b;
  }, key);

/** What overflows on the page as it stands. */
const measure = (page) =>
  page.evaluate(() => {
    const found = [];
    const wide = document.documentElement.scrollWidth - window.innerWidth;
    if (wide > 1) found.push(`the page is ${wide}px wider than the screen`);
    for (const el of document.querySelectorAll("button, label, h1, h2, h3, summary, [role=radio], [role=heading]")) {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || cs.display === "none" || el.closest(".sr-only")) continue;
      const clips = /(hidden|clip)/.test(cs.overflowX) || /(hidden|clip)/.test(cs.overflow) || cs.textOverflow === "ellipsis";
      if (clips && el.scrollWidth > el.clientWidth + 1) found.push(`cut off: "${(el.innerText || el.getAttribute("aria-label") || "").trim().slice(0, 60)}"`);
      else if (r.right > window.innerWidth + 1 && cs.position !== "fixed") found.push(`off the screen: "${(el.innerText || "").trim().slice(0, 60)}"`);
    }
    return found;
  });

const STEPS = [
  { name: "opening", go: async () => true },
  { name: "war room", go: (p) => pressSeal(p, "STAVKA") },
  { name: "briefing", go: (p) => pressHotkey(p, "enter") },
  { name: "menu", go: (p) => p.evaluate(() => { const b = document.querySelector("button[aria-label]") && [...document.querySelectorAll(".dg-shell-buttons button")][1]; if (b) b.click(); return !!b; }) },
];

const browser = await chromium.launch();
const failures = [];
for (const size of SIZES) {
  for (const lang of LANGS) {
    const ctx = await browser.newContext({ viewport: { width: size.width, height: size.height }, deviceScaleFactor: 1, reducedMotion: "reduce" });
    await ctx.addInitScript((l) => {
      try {
        localStorage.setItem("dispatchesWW2_language", l);
        localStorage.setItem("dispatchesWW2_instant_text", "true");
        localStorage.setItem("dispatchesWW2_music", "false");
      } catch (e) {
        /* none */
      }
    }, lang);
    const page = await ctx.newPage();
    await page.goto(URL_, { waitUntil: "load" });
    await page.waitForTimeout(600);
    for (const step of STEPS) {
      if (!(await step.go(page))) {
        failures.push(`${size.name} ${lang} ${step.name}: could not reach the screen`);
        break;
      }
      await page.waitForTimeout(400);
      const found = [...new Set(await measure(page))];
      if (found.length) {
        const file = `${size.name}-${lang}-${step.name.replace(/\s+/g, "-")}.png`;
        await page.screenshot({ path: join(OUT, file), fullPage: true });
        for (const f of found) failures.push(`${size.name} ${lang} ${step.name}: ${f} (${file})`);
      }
    }
    console.log(`${size.name} ${lang}: checked`);
    await ctx.close();
  }
}
await browser.close();
server.close();
if (failures.length) {
  console.error(`\noverflow check: ${failures.length} problem(s)`);
  for (const f of failures) console.error("  " + f);
  process.exit(1);
}
console.log("\noverflow check: no text runs off its box or the screen in any of the nine languages");
