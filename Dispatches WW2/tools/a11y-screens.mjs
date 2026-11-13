#!/usr/bin/env node
// Accessibility check (axe-core) of the screens a player spends a war on, not only the opening screen the smoke test covers: the war
// room, a briefing, an outcome, a special dispatch, the in-run menu with its settings, the war journal, the American allocation, a report
// with an archive photograph, the Order of Battle and the end of the war. Serious and critical findings fail the run; the others are listed.
//   npm run build:nozip && node tools/a11y-screens.mjs
import { chromium } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";
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

const SKIP = "^(\\W?show|\\W?hide|save|home|back|rewind|text size|restart|switch|new campaign|copy|share|download|settings|map|close|pause|resume|skip to|how it works|delete)";
/** One step of play, as the store screenshots bot plays: the first order, else a continue button; the staff plan battles. */
const step = (page, prefer = "") =>
  page.evaluate(
    ([skipSrc, preferSrc]) => {
      const skip = new RegExp(skipSrc, "i");
      const lab = (b) => (b.getAttribute("aria-label") || b.innerText || "").replace(/\s+/g, " ").replace(/^[^\p{L}\p{N}]+/u, "").trim();
      const bs = [...document.querySelectorAll("button")].filter((b) => !b.disabled && b.getBoundingClientRect().width && !skip.test(lab(b)));
      const text = document.body.innerText;
      let pick = null;
      if (/Order of Battle/.test(text)) pick = bs.find((b) => /^Let Your Staff Plan It/i.test(lab(b))) || bs.find((b) => /^(Commit to Battle|Start battle|Continue)/i.test(lab(b)));
      if (!pick && /The Battle Unfolds/.test(text)) pick = [...document.querySelectorAll("button")].find((b) => !b.disabled && /^Skip to the verdict/i.test(lab(b))) || null;
      if (!pick && preferSrc) pick = bs.find((b) => new RegExp(preferSrc, "i").test(lab(b))) || null;
      if (!pick) {
        const orders = bs.filter((b) => lab(b).length >= 45 && !b.hasAttribute("aria-pressed") && !/Activate to see|diverged/i.test(lab(b)));
        pick = orders[0] || bs.find((b) => /^(continue|next|proceed|begin|start|commit|read|enter|acknowledge|resolve|reveal|final|see the full|germany first|an even hand)/i.test(lab(b))) || null;
      }
      if (!pick) return false;
      pick.click();
      return true;
    },
    [SKIP, prefer]
  );
const press = (page, src) =>
  page.evaluate((s) => {
    const re = new RegExp(s, "i");
    const b = [...document.querySelectorAll("button")].find((x) => !x.disabled && re.test((x.getAttribute("aria-label") || x.innerText || "").trim()));
    if (b) b.click();
    return !!b;
  }, src);
const textHas = (page, src) => page.evaluate((s) => new RegExp(s, "i").test(document.body.innerText), src);
async function playUntil(page, test, max = 300, prefer = "") {
  for (let i = 0; i < max; i++) {
    if (await test()) return true;
    if (!(await step(page, prefer))) {
      console.log("  (stopped: nothing to press on " + JSON.stringify((await page.evaluate(() => document.body.innerText)).slice(0, 140)) + ")");
      return false;
    }
    await page.waitForTimeout(100);
  }
  const ok = await test();
  if (!ok) console.log("  (gave up after " + max + " steps on " + JSON.stringify((await page.evaluate(() => document.body.innerText)).slice(0, 140)) + ")");
  return ok;
}

const browser = await chromium.launch();
const problems = [];
const advisory = [];
const seen = new Set();
async function scan(page, name) {
  await page.waitForTimeout(300);
  const res = await new AxeBuilder({ page }).analyze();
  for (const v of res.violations) {
    const line = `${name}: ${v.id} (${v.impact}) on ${v.nodes.length} element(s): ${v.nodes[0].target.join(" ")}`;
    if (v.impact === "serious" || v.impact === "critical") problems.push(line);
    else advisory.push(line);
  }
  seen.add(name);
}
async function fresh(night = false, staff = true) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
  await ctx.addInitScript(([n, st]) => {
    try {
      localStorage.setItem("dispatchesWW2_instant_text", "true");
      localStorage.setItem("dispatchesWW2_music", "false");
      if (st) localStorage.setItem("dispatchesWW2_staff_plans", "1");
      else localStorage.removeItem("dispatchesWW2_staff_plans");
      localStorage.setItem("dispatchesWW2_night", n ? "1" : "0");
    } catch (e) {
      /* none */
    }
  }, [night, staff]);
  const page = await ctx.newPage();
  await page.goto(URL_, { waitUntil: "load" });
  await page.waitForTimeout(700);
  return { ctx, page };
}

// A German war: war room, briefing, outcome, a dispatch, the menu, the journal, a photograph, the Order of Battle, the end.
{
  const { ctx, page } = await fresh();
  await press(page, "^OKW");
  await page.waitForTimeout(300);
  await scan(page, "war room");
  await press(page, "^Enter the War Room");
  await page.waitForTimeout(400);
  await scan(page, "briefing");
  await step(page);
  await page.waitForTimeout(300);
  await scan(page, "outcome");
  await press(page, "^Settings and menu");
  await scan(page, "menu and settings");
  await press(page, "^Close");
  await press(page, "^Show the war journal");
  await scan(page, "war journal");
  await press(page, "^Close");
  if (await playUntil(page, () => textHas(page, "SPECIAL DISPATCH"), 60)) await scan(page, "special dispatch");
  if (await playUntil(page, () => page.evaluate(() => !!document.querySelector('figure img[src*="photos/"]')), 60)) await scan(page, "report with a photograph");
  if (await playUntil(page, () => textHas(page, "Command rank"), 700)) await scan(page, "end of the war");
  await ctx.close();
}
// The American allocation, at night.
{
  const { ctx, page } = await fresh(true);
  await press(page, "^JOINT CHIEFS");
  await page.waitForTimeout(300);
  await press(page, "^Enter the War Room");
  await page.waitForTimeout(400);
  await scan(page, "briefing at night (Pacific map)");
  if (await playUntil(page, () => textHas(page, "ALLOCATION OF EFFORT"), 80)) await scan(page, "allocation of effort");
  await ctx.close();
}
// The Order of Battle, planned by hand.
{
  const { ctx, page } = await fresh(false, false);
  await press(page, "^OKW");
  await page.waitForTimeout(300);
  await press(page, "^Enter the War Room");
  await page.waitForTimeout(400);
  const reached = await playUntil(
    page,
    () => textHas(page, "Order of Battle[:—] Before Committing"),
    200,
    "Leads to battle planning"
  );
  if (reached) await scan(page, "Order of Battle");
  await ctx.close();
}

await browser.close();
server.close();
const wanted = ["war room", "briefing", "outcome", "menu and settings", "war journal", "special dispatch", "report with a photograph", "end of the war", "briefing at night (Pacific map)", "allocation of effort", "Order of Battle"];
const missed = wanted.filter((w) => !seen.has(w));
console.log(`a11y screens: ${seen.size} screens checked${missed.length ? `; not reached: ${missed.join(", ")}` : ""}`);
for (const a of advisory) console.log("  (advisory) " + a);
if (problems.length) {
  console.error(`\na11y screens: ${problems.length} serious or critical finding(s)`);
  for (const p of problems) console.error("  " + p);
  process.exit(1);
}
console.log("a11y screens: no serious or critical findings");
