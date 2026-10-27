// Screenshot comparison of the main screens, in two themes at phone and desktop width, for looking at what a change did to the page itself and not only to its text
// (an overlap, a clipped word, a colour that fails on a dark page). The images come from this machine's fonts, so the baseline is kept per platform in
// tests/visual/ and is not committed.
//   node tools/visual.mjs --accept      take the screens and keep them as the baseline
//   node tools/visual.mjs               take the screens and compare them with the baseline; a screen that changed by more than 0.6 per cent of its pixels (or that
//                                       changed size) is listed, with a picture of the difference in tests/visual/diff/. Exits 1 if any did.
// Run after a build: npm run build && node tools/visual.mjs
import { createServer } from "node:http";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const require = createRequire(join(ROOT, "package.json"));
const { loadEngine } = require("./_load.js");
process.chdir(ROOT);
const E = loadEngine("dispatches-greatwar.jsx");
const ACCEPT = process.argv.includes("--accept");
const LIMIT = 0.006;
const BASE = join(ROOT, "tests", "visual", "baseline-" + process.platform);
const NOW = join(ROOT, "tests", "visual", "current-" + process.platform);
const DIFF = join(ROOT, "tests", "visual", "diff");
for (const d of [BASE, NOW, DIFF]) mkdirSync(d, { recursive: true });
for (const f of readdirSync(NOW)) rmSync(join(NOW, f));
for (const f of readdirSync(DIFF)) rmSync(join(DIFF, f));

const server = await new Promise((resolve) => {
  const s = createServer((req, res) => {
    const rel = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)).split(/[\\/]+/).filter((p) => p && p !== "..").join("/");
    const file = join(ROOT, "dist", rel === "" ? "index.html" : rel);
    if (!existsSync(file)) return void res.writeHead(404).end("not found");
    res.writeHead(200, { "content-type": extname(file) === ".html" ? "text/html" : "text/javascript" }).end(readFileSync(file));
  }).listen(0, "127.0.0.1", () => resolve(s));
});
const URL_ = `http://127.0.0.1:${server.address().port}/`;
const browser = await chromium.launch();

const save = (campaignId, nodeId, flags = {}) => JSON.stringify(E.snapshotRun({ campaignId, nodeId, flags, meters: E.emptyMeters(), hardState: E.emptyHardState(), visited: [nodeId], easy: false, taken: [], history: [] }));
const click = (p, re) => p.getByRole("button", { name: re }).first().click();
const SCENES = [
  { id: "menu", run: async () => {} },
  { id: "briefing", run: async (p) => { await click(p, /France/); } },
  { id: "report", save: save("gqg", "gqg_1914_02_marne") },
  { id: "document", save: save("ohl", "ohl_1917_06_pless") },
  { id: "outcome", save: save("gqg", "gqg_1914_01_frontieres"), run: async (p) => { await p.locator("button.dg-choice:not([disabled])").first().click(); } },
  { id: "battle", save: save("gqg", "gqg_1914_02_marne"), run: async (p) => { await click(p, /Turn and attack/); await p.waitForSelector("text=Order of Battle"); await p.locator(".dg-step").last().click(); await p.locator(".dg-sk-hit").nth(0).click(); await p.locator(".dg-sk-hit").nth(2).click(); } },
  { id: "newspaper", save: save("ohl", "ohl_1915_15_serbia"), run: async (p) => { await click(p, /^Decline the Balkan commitment/); await click(p, /^Continue$/); } },
  { id: "record", run: async (p) => { await click(p, /^War record/); await click(p, /^Dossiers$/); } },
  { id: "settings", run: async (p) => { await click(p, /^Settings/); } },
];
const THEMES = ["night", "paper"];
const VIEWS = [{ id: "phone", w: 390, h: 844 }, { id: "desktop", w: 1280, h: 800 }];

async function take(scene, theme, view) {
  const ctx = await browser.newContext({ viewport: { width: view.w, height: view.h }, deviceScaleFactor: 1, isMobile: view.id === "phone", hasTouch: view.id === "phone", reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.addInitScript(() => { let t = 7; Math.random = () => { t = (t + 0x6d2b79f5) | 0; let r = Math.imul(t ^ (t >>> 15), 1 | t); r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r; return ((r ^ (r >>> 14)) >>> 0) / 4294967296; }; }); // the same dice on every run
  await page.addInitScript(([settings, run]) => {
    try { localStorage.setItem("dispatches1914_settings_v1", settings); if (run) localStorage.setItem("dispatches1914_save_v1", run); } catch (e) { /* none */ }
  }, [JSON.stringify({ schemaVersion: 1, theme, themeSet: true, music: false, battles: true, motion: "reduced" }), scene.save || null]);
  await page.goto(URL_);
  await page.waitForSelector("main");
  if (scene.save) { await page.getByRole("button", { name: /^Resume file/ }).click(); await page.waitForTimeout(300); }
  if (scene.run) await scene.run(page);
  await page.waitForTimeout(500);
  const buf = await page.screenshot({ fullPage: true });
  await ctx.close();
  return buf;
}

const cmp = await browser.newPage();
await cmp.setContent("<canvas id=a></canvas><canvas id=b></canvas><canvas id=d></canvas>");
/** Compares two PNGs in the browser: { sameSize, ratio, diffPng }. A pixel counts as changed when any channel moves by more than 24. */
async function compare(aBuf, bBuf) {
  return cmp.evaluate(async ([a, b]) => {
    const load = (s) => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = "data:image/png;base64," + s; });
    const [ia, ib] = await Promise.all([load(a), load(b)]);
    const w = Math.max(ia.width, ib.width), h = Math.max(ia.height, ib.height);
    const draw = (img, id) => { const c = document.getElementById(id); c.width = w; c.height = h; const x = c.getContext("2d"); x.fillStyle = "#ff00ff"; x.fillRect(0, 0, w, h); x.drawImage(img, 0, 0); return x.getImageData(0, 0, w, h); };
    const da = draw(ia, "a"), db = draw(ib, "b");
    const dc = document.getElementById("d"); dc.width = w; dc.height = h;
    const dx = dc.getContext("2d"); const out = dx.createImageData(w, h);
    let changed = 0;
    for (let i = 0; i < da.data.length; i += 4) {
      const m = Math.max(Math.abs(da.data[i] - db.data[i]), Math.abs(da.data[i + 1] - db.data[i + 1]), Math.abs(da.data[i + 2] - db.data[i + 2]));
      if (m > 24) { changed++; out.data[i] = 255; out.data[i + 1] = 0; out.data[i + 2] = 0; out.data[i + 3] = 255; }
      else { const g = Math.round((da.data[i] + da.data[i + 1] + da.data[i + 2]) / 3); out.data[i] = out.data[i + 1] = out.data[i + 2] = 255 - (255 - g) * 0.25; out.data[i + 3] = 255; }
    }
    dx.putImageData(out, 0, 0);
    return { sameSize: ia.width === ib.width && ia.height === ib.height, ratio: changed / (w * h), diffPng: dc.toDataURL("image/png").split(",")[1] };
  }, [aBuf.toString("base64"), bBuf.toString("base64")]);
}

let shots = 0, bad = 0, missing = 0;
for (const scene of SCENES) for (const theme of THEMES) for (const view of VIEWS) {
  const name = `${scene.id}-${theme}-${view.id}.png`;
  let buf;
  try { buf = await take(scene, theme, view); } catch (e) { console.log(`FAIL ${name}: ${e.message.split("\n")[0]}`); bad++; continue; }
  shots++;
  writeFileSync(join(NOW, name), buf);
  if (ACCEPT) { writeFileSync(join(BASE, name), buf); continue; }
  if (!existsSync(join(BASE, name))) { console.log(`new  ${name}: no baseline (run with --accept)`); missing++; continue; }
  const r = await compare(readFileSync(join(BASE, name)), buf);
  if (!r.sameSize || r.ratio > LIMIT) {
    bad++;
    writeFileSync(join(DIFF, name), Buffer.from(r.diffPng, "base64"));
    console.log(`DIFF ${name}: ${(r.ratio * 100).toFixed(2)} per cent of the pixels changed${r.sameSize ? "" : ", and the page changed size"}`);
  }
}
await browser.close();
server.close();
console.log(ACCEPT ? `visual: ${shots} screens kept as the baseline in tests/visual/baseline-${process.platform}` : `visual: ${shots} screens, ${bad} changed, ${missing} without a baseline`);
process.exit(bad ? 1 : 0);
