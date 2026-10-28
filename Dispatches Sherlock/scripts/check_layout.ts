// A layout check in a real browser (Chromium through Playwright), because the headless UI tests have no layout. It walks the screens a player sees at the three
// widths that matter on a phone and a desktop column (320, 375 and 600 pixels) and fails on:
//   - horizontal scroll (the page is wider than the window)          - an element that sticks out past the right edge of the window
//   - a button or tab shorter than 36 px (too small to tap)           - visible text under 9 px
// It also saves a screenshot of every screen to tests/visual/last/ (not committed) and compares each screen's height with tests/visual/metrics.json, so that a
// change that makes a screen much longer or shorter is noticed. It needs a browser, so it is not part of `npm test`; run it after a UI change:
//   npm run build && npx tsx scripts/check_layout.ts [--record]      (--record rewrites tests/visual/metrics.json)
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { createServer } from "node:http";
import { chromium, type Page } from "playwright";
import { createInitialState, reduce } from "@dispatches/engine";
import type { GameState } from "@dispatches/engine";
import { loadDefinition } from "../../packages/engine/tools/load_definition";
import { serializeRunSave } from "../src/runSave";

const def = loadDefinition("sherlock");
const record = process.argv.includes("--record");
const WIDTHS = [320, 375, 600];
mkdirSync("tests/visual/last", { recursive: true });

// a saved run standing at a scene, for the screens that are deep in the game
function saveAt(nodeId: string, branch: string, resources: Record<string, number> = {}, flags: Record<string, boolean> = {}): string {
  let s: GameState = createInitialState(def);
  for (const t of ["START_GAME", "ADVANCE_PROLOGUE", "ENTER_STORY"] as const) s = reduce(def, s, { type: t });
  s = { ...s, currentNodeId: nodeId, activeBranch: branch, resources: { ...s.resources, ...resources }, flags: { ...s.flags, ...flags }, history: [{ nodeId: "1", optionIndex: 0 } as never] };
  return serializeRunSave(s);
}
const VOLUME = (branch: string) => (["WEB", "YARD", "STREET", "CONTINENT", "MYCROFT", "HIATUS"].includes(branch) ? "FINAL" : branch);

// the page, served from dist/ on a free port
const html = readFileSync("dist/index.html");
const server = createServer((_req, res) => {
  res.setHeader("content-type", "text/html; charset=utf-8");
  res.end(html);
});
await new Promise<void>((r) => server.listen(0, r));
const port = (server.address() as { port: number }).port;
const base = `http://127.0.0.1:${port}/`;

type Step = { name: string; run: (p: Page) => Promise<void> };
const btn = (p: Page, re: RegExp) => p.getByRole("button", { name: re }).first();
const resume = async (p: Page, nodeId: string, branch: string, resources?: Record<string, number>, flags?: Record<string, boolean>) => {
  await p.goto(base);
  const v = VOLUME(branch);
  await p.evaluate(([key, val]) => (localStorage.setItem(`sherlock_run_save_v2:${key}`, val), localStorage.setItem("sherlock_run_save_v2:latest", key)), [v, saveAt(nodeId, branch, resources, flags)] as [string, string]);
  await p.reload();
  await btn(p, /Resume the Case/).click();
  await p.waitForTimeout(250);
};
const armAndConfirm = async (p: Page, i: number) => {
  const o = p.locator("button.group");
  await o.nth(i).click();
  await o.nth(i).click().catch(() => {});
  await p.waitForTimeout(250);
};
const STEPS: Step[] = [
  { name: "title", run: async (p) => void (await p.goto(base)) },
  { name: "settings", run: async (p) => (await p.goto(base), await btn(p, /^Settings$/).click()) },
  { name: "how-to", run: async (p) => (await p.goto(base), await btn(p, /^How To$/).click()) },
  {
    name: "shelf",
    run: async (p) => {
      await p.goto(base);
      await btn(p, /Begin the Case/).click();
      await btn(p, /^Continue$/).click();
      await btn(p, /The Consulting Detective/).click();
      await btn(p, /^Enter$/).click();
    },
  },
  { name: "scene", run: async (p) => resume(p, "6", "WEB", { evidence: 2, standing: -1, nerve: -4, hours: -1, hands: 0, wires: 5 }) },
  {
    name: "scene-scrolled",
    run: async (p) => {
      await resume(p, "6", "WEB", { evidence: 2, nerve: -4, hours: -3 });
      await p.evaluate(() => window.scrollTo(0, 900));
      await p.waitForTimeout(300);
    },
  },
  { name: "company", run: async (p) => (await resume(p, "6", "WEB"), await p.getByRole("tab", { name: "Company" }).click()) },
  { name: "board", run: async (p) => (await resume(p, "6", "WEB", {}, { clueHeel: true, clueCab: true, fitchNamed: true }), await p.getByRole("tab", { name: "Board" }).click()) },
  { name: "map", run: async (p) => (await resume(p, "6", "WEB"), await p.getByRole("tab", { name: "Map" }).click()) },
  { name: "calendar", run: async (p) => (await resume(p, "6", "WEB", { hours: -3 }), await p.getByRole("tab", { name: "Calendar" }).click()) },
  { name: "gambit", run: async (p) => (await resume(p, "6", "WEB"), await armAndConfirm(p, 0)) },
  {
    name: "deadline-card",
    run: async (p) => {
      await resume(p, "Y4", "YARD", { hours: -4 });
      await armAndConfirm(p, 0);
      for (let k = 0; k < 6 && !(await btn(p, /Turn the page/i).count()); k++) {
        const c = btn(p, /^Continue$/);
        if (await c.count()) await c.click();
        await p.waitForTimeout(300);
      }
    },
  },
  {
    name: "ending",
    run: async (p) => {
      await resume(p, "B4", "BOHEMIA");
      await armAndConfirm(p, 0);
      for (let k = 0; k < 6; k++) {
        const c = btn(p, /^Continue$/);
        if (await c.count()) await c.click();
        await p.waitForTimeout(300);
      }
    },
  },
];

const metricsPath = "tests/visual/metrics.json";
const previous: Record<string, number> = existsSync(metricsPath) ? JSON.parse(readFileSync(metricsPath, "utf8")) : {};
const metrics: Record<string, number> = {};
let failures = 0;
const fail = (m: string) => {
  failures++;
  console.error("FAIL: " + m);
};

const browser = await chromium.launch();
for (const width of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width, height: 800 }, deviceScaleFactor: 1 });
  await ctx.addInitScript("window.__name = (f) => f;"); // tsx wraps functions with a helper that the page does not have
  for (const step of STEPS) {
    const page = await ctx.newPage();
    try {
      await step.run(page);
      await page.waitForTimeout(350);
    } catch (e) {
      fail(`${step.name} at ${width}px: could not reach the screen (${(e as Error).message.split("\n")[0]})`);
      await page.close();
      continue;
    }
    const probe = await page.evaluate(() => {
      const vw = window.innerWidth;
      const hidden = (el: Element) => !!el.closest("[aria-hidden='true']");
      const out: string[] = [];
      const small: string[] = [];
      const short: string[] = [];
      for (const el of Array.from(document.querySelectorAll("body *"))) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        const cs = getComputedStyle(el);
        if (cs.visibility === "hidden" || cs.display === "none" || el.closest("svg")) continue;
        if (r.right > vw + 1 && cs.position !== "fixed") out.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)} right ${Math.round(r.right)}`);
        const own = Array.from(el.childNodes).some((n) => n.nodeType === 3 && (n.textContent ?? "").trim().length > 1);
        if (own && !hidden(el) && parseFloat(cs.fontSize) < 9) small.push(`${(el.textContent ?? "").trim().slice(0, 24)} ${cs.fontSize}`);
        if ((el.tagName === "BUTTON" || el.getAttribute("role") === "tab") && !hidden(el) && r.height < 36) short.push(`${(el.textContent ?? "").trim().slice(0, 24)} ${Math.round(r.height)}px`);
      }
      return { scrollW: document.documentElement.scrollWidth, vw, height: document.documentElement.scrollHeight, out: out.slice(0, 4), small: small.slice(0, 4), short: short.slice(0, 4), strip: !!document.querySelector(".fixed.top-0") };
    });
    const key = `${step.name}@${width}`;
    metrics[key] = probe.height;
    await page.screenshot({ path: `tests/visual/last/${step.name}-${width}.png`, fullPage: false });
    if (probe.scrollW > probe.vw + 1) fail(`${key}: horizontal scroll (page ${probe.scrollW}px in a ${probe.vw}px window)`);
    if (probe.out.length) fail(`${key}: sticks out past the right edge: ${probe.out.join("; ")}`);
    if (probe.short.length) fail(`${key}: buttons under 36px tall: ${probe.short.join("; ")}`);
    if (probe.small.length) fail(`${key}: text under 9px: ${probe.small.join("; ")}`);
    if (step.name === "scene-scrolled" && !probe.strip) fail(`${key}: the gauge strip did not appear after scrolling past the gauges`);
    const was = previous[key];
    if (!record && was && Math.abs(probe.height - was) > was * 0.15) fail(`${key}: the screen is ${probe.height}px tall, was ${was}px (more than 15% different; re-record if intended: --record)`);
    await page.close();
  }
  await ctx.close();
}
await browser.close();
server.close();
if (record) {
  mkdirSync("tests/visual", { recursive: true });
  writeFileSync(metricsPath, JSON.stringify(metrics, null, 2) + "\n");
  console.log(`recorded ${Object.keys(metrics).length} screen heights to ${metricsPath}`);
}
if (failures) process.exit(1);
console.log(`Layout check passed: ${STEPS.length} screens at ${WIDTHS.join(", ")} px; screenshots in tests/visual/last.`);
