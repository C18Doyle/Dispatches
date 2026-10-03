#!/usr/bin/env node
// Real-browser smoke test for every built game (Chromium and WebKit, the engine of iPhone Safari, via Playwright). jsdom, which the UI
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
//   BROWSERS=chromium node tools/smoke-browser.mjs   only one engine (default: chromium,webkit)
//   node tools/smoke-browser.mjs --record-a11y      accept the current accessibility findings as the new allowance
//
// Accessibility (axe-core, Chromium, phone viewport, on the opening screen and after clicking through): serious and
// critical violations are compared with tests/a11y-allowlist.json (rule -> most elements allowed, per game). A rule
// that is not listed, or more elements than listed, fails. Known debt is therefore visible and cannot grow silently.
// First run on a machine: npx playwright install chromium webkit
import { createServer } from "node:http";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, webkit } from "playwright";
import AxeBuilder from "@axe-core/playwright";

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
const A11Y_PATH = join(ROOT, "tests", "a11y-allowlist.json");
const A11Y = existsSync(A11Y_PATH) ? JSON.parse(readFileSync(A11Y_PATH, "utf8")).known ?? {} : {};
const LEVELS = ["minor", "moderate", "serious", "critical"];
const MIN_IMPACT = process.env.A11Y_LEVEL ?? "serious"; // A11Y_LEVEL=minor to see everything axe reports
const RECORD_A11Y = process.argv.includes("--record-a11y");
const ENGINES = (process.env.BROWSERS ?? "chromium,webkit").split(",").map((x) => x.trim()).filter(Boolean);
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

/** Serious/critical axe violations on the current page, merged into `into` as rule -> { impact, help, nodes }. */
async function axeScan(page, into) {
  const res = await new AxeBuilder({ page }).analyze();
  for (const v of res.violations) {
    if (LEVELS.indexOf(v.impact) < LEVELS.indexOf(MIN_IMPACT)) continue;
    const prev = into.get(v.id);
    if (!prev || v.nodes.length > prev.nodes) into.set(v.id, { impact: v.impact, help: v.help, nodes: v.nodes.length });
  }
}

async function checkGame(browser, engine, game, vp) {
  const dir = resolve(ROOT, game.dist);
  const problems = [];
  const a11y = new Map();
  const wantA11y = engine === "chromium" && vp.label === "phone";
  if (!existsSync(join(dir, "index.html"))) return { problems: [`no ${game.dist}/index.html: build the game first`], a11y };
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
      await page.screenshot({ path: join(shotsDir, `${game.name}-${engine}-${vp.label}-0-open.png`) });
    }
    if (wantA11y) await axeScan(page, a11y);
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
      if (SHOTS && i === 3) await page.screenshot({ path: join(shotsDir, `${game.name}-${engine}-${vp.label}-3-after-clicks.png`) });
    }
    if (wantA11y) await axeScan(page, a11y);
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
  return { problems, a11y };
}

const launchers = { chromium, webkit };
const recorded = {};
let failed = 0;
for (const engine of ENGINES) {
  if (!launchers[engine]) {
    console.error(`unknown browser "${engine}" (use chromium or webkit)`);
    process.exit(2);
  }
  let browser;
  try {
    browser = await launchers[engine].launch();
  } catch (e) {
    console.error(`could not start ${engine}: ${e.message.split("\n")[0]}\n  run: npx playwright install ${engine}  (or BROWSERS=chromium to skip it)`);
    process.exit(1);
  }
  for (const game of GAMES) {
    for (const vp of VIEWPORTS) {
      const { problems: all, a11y } = await checkGame(browser, engine, game, vp);
      const isKnown = (p) => ALLOW.some((a) => a.game === game.name && a.viewport === vp.label && p.includes(a.contains));
      const problems = all.filter((p) => !isKnown(p));
      const known = all.filter(isKnown);
      if (a11y.size) {
        recorded[game.name] = Object.fromEntries([...a11y].map(([rule, v]) => [rule, v.nodes]));
        for (const [rule, v] of a11y) {
          const allowed = A11Y[game.name]?.[rule];
          if (!RECORD_A11Y && (allowed === undefined || v.nodes > allowed)) problems.push(`accessibility (${v.impact}): ${rule} on ${v.nodes} element(s)${allowed === undefined ? "" : ` (allowed ${allowed})`}: ${v.help}`);
        }
      }
      const tag = `${game.name.padEnd(12)} ${engine.padEnd(8)} ${vp.label.padEnd(8)}`;
      if (problems.length === 0) console.log(` ok   ${tag}${known.length ? `  (${known.length} known issue(s) in tests/browser-allowlist.json)` : ""}${a11y.size ? `  (${a11y.size} known accessibility rule(s))` : ""}`);
      else {
        failed++;
        console.log(`FAIL  ${tag}`);
        for (const p of problems) console.log(`        - ${p}`);
      }
    }
  }
  await browser.close();
}
if (RECORD_A11Y) {
  const file = { _comment: "Serious/critical axe-core findings accepted for now: game -> rule id -> most elements allowed. Lower these as you fix things; a new rule or a higher count fails tools/smoke-browser.mjs. Re-record only on purpose: node tools/smoke-browser.mjs --record-a11y", known: recorded };
  writeFileSync(A11Y_PATH, JSON.stringify(file, null, 2) + "\n");
  console.log(`recorded accessibility allowance for ${Object.keys(recorded).length} game(s) in tests/a11y-allowlist.json`);
}
console.log(failed ? `\n${failed} browser check(s) failed` : "\nall browser checks passed");
process.exit(failed ? 1 : 0);
