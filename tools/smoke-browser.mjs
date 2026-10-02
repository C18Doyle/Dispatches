#!/usr/bin/env node
// Real-browser smoke test for every built game (Chromium via Playwright). jsdom, which the UI
// baselines use, cannot see layout, CSS or a real console; this does.
//
//   node tools/smoke-browser.mjs            all games (each must already be built: npm run build in the game)
//   node tools/smoke-browser.mjs 1941       only games whose name contains the text
//   node tools/smoke-browser.mjs --dir=<folder> [--name=label]   one arbitrary folder (used on an unzipped release)
//   SHOTS=0 node tools/smoke-browser.mjs    skip screenshots (default: saved to tests/browser-shots/, gitignored)
//
// Per game and per viewport (phone 375x812, desktop 1280x800) it checks:
//   - the page loads with no uncaught error and no console.error
//   - something is rendered (non-trivial body text)
//   - no horizontal scrolling (the mobile rule: container max-width 600px, overflow-x hidden)
//   - on desktop the text sits in a column at most 600px wide (mobile-first: phones get the full width)
//   - it can click through five buttons without an error, and the page keeps rendering
// First run on a machine: npx playwright install chromium
import { createServer } from "node:http";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const dirArg = process.argv.find((a) => a.startsWith("--dir="));
const positional = process.argv.slice(2).find((a) => !a.startsWith("--"));
const GAMES = dirArg ? [{ name: process.argv.find((a) => a.startsWith("--name="))?.slice(7) ?? "folder", dist: dirArg.slice(6) }] : [
  { name: "Frankenstein", dist: "Dispatches Frankenstein/dist" },
  { name: "1914", dist: "Dispatches 1914/dist" },
  { name: "1922", dist: "Dispatches 1922/dist" },
  { name: "1941", dist: "Dispatches 1941/dist/full" },
  { name: "1940", dist: "Dispatches 1940/dist/full" },
].filter((g) => dirArg || !positional || g.name.includes(positional));
const VIEWPORTS = [
  { label: "phone", width: 375, height: 812 },
  { label: "desktop", width: 1280, height: 800 },
];
const ALLOW = JSON.parse(readFileSync(join(ROOT, "tests", "browser-allowlist.json"), "utf8")).known;
const SHOTS = process.env.SHOTS !== "0";
const shotsDir = join(ROOT, "tests", "browser-shots");
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".mp3": "audio/mpeg", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml", ".json": "application/json", ".woff2": "font/woff2" };

function serve(dir) {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      const pathname = decodeURIComponent(new URL(req.url, "http://x").pathname);
      const rel = normalize(pathname).split(/[\\/]+/).filter((s) => s && s !== "..").join("/");
      const file = join(dir, rel === "" ? "index.html" : rel);
      if (!existsSync(file)) return void res.writeHead(404).end("not found");
      res.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" }).end(readFileSync(file));
    }).listen(0, "127.0.0.1", () => resolve({ server, url: `http://127.0.0.1:${server.address().port}/` }));
  });
}

// Browser noise that is not a game bug: autoplay policy, audio context, missing favicon.
const IGNORED = [/AudioContext/i, /autoplay/i, /favicon/i, /Failed to load resource.*(404|favicon)/i, /download the React DevTools/i];
const ignored = (t) => IGNORED.some((re) => re.test(t));

async function checkGame(browser, game, vp) {
  const dir = resolve(ROOT, game.dist);
  const problems = [];
  if (!existsSync(join(dir, "index.html"))) return [`no ${game.dist}/index.html: build the game first`];
  const { server, url } = await serve(dir);
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  page.on("console", (m) => {
    if (m.type() === "error" && !ignored(m.text())) errors.push("console.error: " + m.text());
  });
  try {
    await page.goto(url, { waitUntil: "load", timeout: 30000 });
    await page.waitForTimeout(500);
    const text = (await page.evaluate(() => document.body.innerText)).trim();
    if (text.length < 40) problems.push(`renders almost nothing (${text.length} characters of text)`);

    const overflow = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
    if (overflow.scroll > overflow.client + 1) problems.push(`horizontal overflow: page is ${overflow.scroll}px wide in a ${overflow.client}px viewport`);

    if (vp.label === "desktop") {
      // How wide is the column the text actually sits in? (Backgrounds may be full-width; text must not be.)
      const extent = await page.evaluate(() => {
        let left = Infinity;
        let right = -Infinity;
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        for (let n = walker.nextNode(); n; n = walker.nextNode()) {
          const el = n.parentElement;
          if (!n.textContent.trim() || !el || /^(SCRIPT|STYLE|NOSCRIPT)$/.test(el.tagName)) continue;
          const cs = getComputedStyle(el);
          if (cs.visibility === "hidden" || cs.display === "none") continue;
          const range = document.createRange();
          range.selectNodeContents(n);
          for (const r of range.getClientRects()) {
            if (r.width < 1 || r.height < 1) continue;
            left = Math.min(left, r.left);
            right = Math.max(right, r.right);
          }
        }
        return right > left ? Math.round(right - left) : null;
      });
      if (extent !== null && extent > 600) problems.push(`text spans ${extent}px on desktop: the content column should be at most 600px wide`);
    }

    if (SHOTS) {
      mkdirSync(shotsDir, { recursive: true });
      await page.screenshot({ path: join(shotsDir, `${game.name}-${vp.label}-0-open.png`) });
    }
    for (let i = 1; i <= 5; i++) {
      const buttons = page.locator("button:visible");
      const n = await buttons.count();
      if (n === 0) break;
      // avoid destructive/navigation-away controls; take the first that is not rewind/restart/exit/mute
      let target = null;
      for (let b = 0; b < n; b++) {
        const label = ((await buttons.nth(b).innerText().catch(() => "")) || "").trim();
        if (!/rewind|restart|reset|exit|quit|mute|delete|clear/i.test(label)) {
          target = buttons.nth(b);
          break;
        }
      }
      if (!target) break;
      await target.click({ timeout: 5000 }).catch((e) => problems.push(`click ${i} failed: ${e.message.split("\n")[0]}`));
      await page.waitForTimeout(250);
      if (SHOTS && i === 3) await page.screenshot({ path: join(shotsDir, `${game.name}-${vp.label}-3-after-clicks.png`) });
    }
    const after = (await page.evaluate(() => document.body.innerText)).trim();
    if (after.length < 40) problems.push("page went blank after clicking through");
    const overflow2 = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (overflow2 > 1) problems.push(`horizontal overflow after clicking through (${overflow2}px)`);
  } catch (e) {
    problems.push("test crashed: " + e.message.split("\n")[0]);
  } finally {
    for (const e of errors) problems.push(e);
    await context.close();
    server.close();
  }
  return problems;
}

const browser = await chromium.launch();
let failed = 0;
for (const game of GAMES) {
  for (const vp of VIEWPORTS) {
    const all = await checkGame(browser, game, vp);
    const isKnown = (p) => ALLOW.some((a) => a.game === game.name && a.viewport === vp.label && p.includes(a.contains));
    const problems = all.filter((p) => !isKnown(p));
    const known = all.filter(isKnown);
    const tag = `${game.name.padEnd(12)} ${vp.label.padEnd(8)}`;
    if (problems.length === 0) console.log(` ok   ${tag}${known.length ? `  (${known.length} known issue(s) in tests/browser-allowlist.json)` : ""}`);
    else {
      failed++;
      console.log(`FAIL  ${tag}`);
      for (const p of problems) console.log(`        - ${p}`);
    }
  }
}
await browser.close();
console.log(failed ? `\n${failed} browser check(s) failed` : "\nall browser checks passed");
process.exit(failed ? 1 : 0);
