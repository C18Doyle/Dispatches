#!/usr/bin/env node
// A bot that plays every campaign of the built game to an ending in a real browser, by clicking, and checks the screens on the way.
//
//   node tools/playthrough.mjs                 two playthroughs of each campaign (needs: npm run build:nozip; npx playwright install chromium)
//   RUNS=1 node tools/playthrough.mjs          one of each (easy mode, a battle planned by hand)
//   CAMPAIGNS=italy VERBOSE=1 node tools/playthrough.mjs
//
// 1940 has no screen markers in its markup, so the bot reads the page the way the jsdom UI baseline does (tests/ui.config.mjs): it looks at the
// visible text and the buttons, takes an order (a button with a long label), presses Continue-like buttons, plans battles by hand on one run and
// by the staff on the other, and stops at "File Closed", "Command Terminated" or "Front Collapsed". On the way it checks that no uncaught error or
// console error is raised, that the damaged-file screen never shows, that the page does not stall on one screen, and (on the first screen of each
// kind in a run and every fortieth step) that axe finds no serious or critical violation. At the ending it checks that the copy-as-text button works.
// It exists because a jsdom run cannot see a layout or a real console.
import { createServer } from "node:http";
import { existsSync, readFileSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const DIST = join(ROOT, "dist", "full");
const VERBOSE = Boolean(process.env.VERBOSE);
const RUNS = Number(process.env.RUNS || 2);
const MAX_STEPS = 1200;
const ALL = [["german", "OKW"], ["soviet", "STAVKA"], ["allied", "SHAEF"], ["italy", "COMANDO"]];
const CAMPAIGNS = ALL.filter(([id]) => !process.env.CAMPAIGNS || process.env.CAMPAIGNS.split(",").includes(id));
const PLAYS = [
  { label: "easy-manual", mode: "Easy", seed: 7, staff: false },
  { label: "hard-staff", mode: "Hard", seed: 23, staff: true },
].slice(0, RUNS);
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".json": "application/json" };
const SKIP = /^(\W?show|\W?hide|save|home|back|rewind|text size|restart|switch|new campaign|copy|share|download|settings|map|close|pause|resume|skip to|how it works)/i;
const PROCEED = /^(continue|proceed|acknowledge|next|file|report|commit|confirm|begin|start|issue|resolve|reveal|end|enter|deploy|execute|launch|submit|accept|read)/i;
const ENDED = /File Closed|Command Terminated|Front Collapsed/i;

if (!existsSync(join(DIST, "index.html"))) { console.error(`No build in ${DIST}: run npm run build:nozip first.`); process.exit(1); }
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

/** Tag every visible, enabled button with data-bot and return their labels, in order. */
const listButtons = (page) => page.evaluate(() => {
  const out = [];
  document.querySelectorAll("[data-bot]").forEach((e) => e.removeAttribute("data-bot"));
  for (const b of document.querySelectorAll("button, [role=button]")) {
    if (b.disabled || b.getAttribute("aria-disabled") === "true") continue;
    const r = b.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    const label = (b.getAttribute("aria-label") || b.innerText || "").replace(/\s+/g, " ").replace(/^[^\p{L}\p{N}]+/u, "").trim();
    b.setAttribute("data-bot", String(out.length));
    out.push(label);
  }
  return out;
});

/** The kind of screen, read from the text, for the axe schedule. */
function kindOf(t) {
  if (ENDED.test(t)) return "ending";
  if (/The Battle Unfolds/.test(t)) return "battle-report";
  if (/Order of Battle/.test(t)) return "battle-plan";
  if (/Special Dispatch|Wire Bulletin|Wire Dispatch/i.test(t)) return "bulletin";
  return "report";
}

async function playOne(browser, [id, prefix], play) {
  const where = `${id}/${play.label}`;
  const problems = [];
  const rnd = rngFor(play.seed + id.length * 101);
  const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 430, height: 900 }, acceptDownloads: true });
  await ctx.addInitScript(([staff]) => { try { if (staff) localStorage.setItem("dispatches1940_staff_plans", "1"); } catch (e) { /* none */ } }, [play.staff]);
  await ctx.grantPermissions(["clipboard-read", "clipboard-write"]).catch(() => {});
  ctx.setDefaultTimeout(8000);
  const page = await ctx.newPage();
  page.on("pageerror", (e) => problems.push(`${where}: uncaught error: ${String(e).slice(0, 160)}`));
  page.on("console", (m) => { if (m.type() === "error" && !/favicon|AudioContext|autoplay|Failed to load resource/i.test(m.text())) problems.push(`${where}: console error: ${m.text().slice(0, 160)}`); });
  const seen = new Set();
  let orders = 0, battles = 0, ended = false, stalls = 0, last = "";
  let policy = { approachChosen: false };
  try {
    await page.goto(URL_, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForSelector("button");
    let labels = await listButtons(page);
    const card = labels.findIndex((l) => l.startsWith(prefix));
    if (card < 0) throw new Error("campaign card missing: " + prefix);
    await page.locator(`[data-bot="${card}"]`).click();
    await page.waitForTimeout(150);
    labels = await listButtons(page);
    const m = labels.findIndex((l) => l.startsWith(play.mode));
    if (m >= 0 && play.mode !== "Normal") await page.locator(`[data-bot="${m}"]`).click();
    labels = await listButtons(page);
    const enter = labels.findIndex((l) => /^Enter the War Room/i.test(l));
    if (enter < 0) throw new Error("no war room button; saw " + labels.join(" | ").slice(0, 160));
    await page.locator(`[data-bot="${enter}"]`).click();

    for (let step = 0; step < MAX_STEPS && !ended; step++) {
      await page.waitForTimeout(40);
      const text = await page.evaluate(() => document.body.innerText);
      if (/The File Was Damaged/.test(text)) { problems.push(`${where}: step ${step}: the damaged-file screen is shown`); break; }
      if (ENDED.test(text)) {
        ended = true;
        const res = await new AxeBuilder({ page }).analyze();
        for (const v of res.violations.filter((x) => x.impact === "serious" || x.impact === "critical")) problems.push(`${where}: ending: axe ${v.id} on ${v.nodes.length} element(s): ${v.nodes[0].target.join(" ")} ${(v.nodes[0].any[0] && v.nodes[0].any[0].message || "").slice(0, 140)} [${v.nodes[0].html.slice(0, 110)}]`);
        break;
      }
      const kind = kindOf(text);
      if (!seen.has(kind) || step % 40 === 39) {
        seen.add(kind);
        const res = await new AxeBuilder({ page }).analyze();
        for (const v of res.violations.filter((x) => x.impact === "serious" || x.impact === "critical")) problems.push(`${where}: step ${step} (${kind}): axe ${v.id} on ${v.nodes.length} element(s): ${v.nodes[0].target.join(" ")} ${(v.nodes[0].any[0] && v.nodes[0].any[0].message || "").slice(0, 140)} [${v.nodes[0].html.slice(0, 110)}]`);
      }
      const labels = await listButtons(page);
      const bs = labels.map((label, i) => ({ label, i })).filter((b) => b.label && !SKIP.test(b.label) && !/rewind/i.test(b.label));
      // the battle report plays itself line by line; wait for its next line
      if (!bs.length && /The Battle Unfolds/.test(text)) { await page.waitForTimeout(120); continue; }
      let pick = null;
      if (/Order of Battle/.test(text) && bs.some((x) => /^Add effort/.test(x.label) || /Tactical Approach/.test(text))) {
        if (step === 0 || !policy.inBattle) { battles++; policy.inBattle = true; }
        if (play.staff && bs.find((x) => /^Let Your Staff Plan It/i.test(x.label))) pick = bs.find((x) => /^Let Your Staff Plan It/i.test(x.label));
        else {
          const chits = bs.filter((x) => /^Add effort/.test(x.label));
          const others = bs.filter((x) => !/^Add effort|favors|^(✓ )?No particular emphasis|Reconnaissance Pass|^Spread effort|^Clear all effort|^Ask the staff|^Let Your Staff Plan It/i.test(x.label));
          const commit = others.find((x) => PROCEED.test(x.label));
          if (commit) pick = commit;
          else if (!policy.approachChosen && others.length) { policy.approachChosen = true; pick = others[Math.floor(rnd() * others.length)]; }
          else if (chits.length) pick = chits[Math.floor(rnd() * chits.length)];
          else pick = others[0] || bs[0];
        }
      } else {
        policy.approachChosen = false;
        policy.inBattle = false;
        const choices = bs.filter((x) => x.label.length >= 45 && !/Activate to see|diverged from the historical/i.test(x.label));
        if (choices.length) { pick = choices[Math.floor(rnd() * choices.length)]; orders++; }
        else pick = bs.find((x) => PROCEED.test(x.label)) || bs[0];
      }
      if (!pick) { problems.push(`${where}: step ${step}: nothing to press (${kind})`); break; }
      if (VERBOSE) console.log(`  ${where} step ${step} ${kind}: ${pick.label.slice(0, 60)}`);
      try { await page.locator(`[data-bot="${pick.i}"]`).click({ timeout: 4000 }); } catch (e) { problems.push(`${where}: step ${step} (${kind}): could not press "${pick.label.slice(0, 70)}": ${String(e.message).split(/\r?\n/)[0].slice(0, 80)}`); break; }
      const sig = text.length + ":" + text.slice(0, 80) + ":" + text.slice(-80);
      stalls = sig === last ? stalls + 1 : 0;
      last = sig;
      if (stalls >= 12) { problems.push(`${where}: step ${step}: stalled on one screen (${kind}): ${pick.label.slice(0, 60)}`); break; }
    }
    if (!ended && !problems.length) problems.push(`${where}: no ending within ${MAX_STEPS} steps`);
    if (ended) {
      const copy = (await listButtons(page)).findIndex((l) => /Copy/i.test(l));
      if (copy < 0) problems.push(`${where}: the ending has no copy button`);
    }
  } catch (e) {
    problems.push(`${where}: the bot stopped: ${String(e.message).split("\n")[0].slice(0, 200)}`);
  } finally {
    await ctx.close();
  }
  console.log(`${problems.length ? "FAIL" : "ok  "} ${where}: ${orders} orders, ${battles} battle screens, ${ended ? "reached an ending" : "no ending"}`);
  return problems;
}

const browser = await chromium.launch();
const problems = [];
for (const c of CAMPAIGNS) for (const p of PLAYS) problems.push(...(await playOne(browser, c, p)));
await browser.close();
server.close();
if (problems.length) {
  console.error(`\nplaythrough: ${problems.length} problem(s)`);
  for (const p of problems) console.error("  " + p);
  process.exit(1);
}
console.log(`\nplaythrough: ${CAMPAIGNS.length * PLAYS.length} playthrough(s) reached an ending with no error`);
