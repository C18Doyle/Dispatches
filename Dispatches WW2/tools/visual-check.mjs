#!/usr/bin/env node
// Screenshot comparison: a few fixed screens of the built game (dist/full), compared pixel by pixel with accepted images in
// tests/visual-baseline/. Catches what the text hashes of the UI baseline cannot see: a layout that breaks, a map whose tones drift, a
// photograph that stops loading, night reading that stops darkening.
//   npm run build:nozip && node tools/visual-check.mjs             compare (a screen with no accepted image is recorded and passes)
//   node tools/visual-check.mjs --update                            accept every screen as it is now
// A screen fails when more than MAX_DIFF of its pixels differ by more than TOLERANCE in any channel. The comparison runs inside Chromium
// (the PNGs are decoded on a canvas), so there is no image library to install. Differences and the new screens are written to
// tests/browser-shots/visual/ (the CI job keeps that folder). Fonts differ between Windows and Linux, so the accepted images are the ones
// CI (ubuntu-24.04) takes: accept them from the CI artifact, not from a Windows machine.
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist", "full");
const BASE = join(ROOT, "tests", "visual-baseline");
const OUT = join(ROOT, "..", "tests", "browser-shots", "visual");
const UPDATE = process.argv.includes("--update");
const TOLERANCE = 40;
const MAX_DIFF = 0.003;
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".ogg": "audio/ogg", ".opus": "audio/ogg" };
if (!existsSync(join(DIST, "index.html"))) {
  console.error("No build in dist/full: run npm run build:nozip first.");
  process.exit(1);
}
mkdirSync(BASE, { recursive: true });
mkdirSync(OUT, { recursive: true });
const server = createServer((req, res) => {
  const rel = decodeURIComponent(new URL(req.url, "http://x").pathname).replace(/^\/+/, "") || "index.html";
  const file = join(DIST, rel);
  if (!file.startsWith(DIST) || !existsSync(file)) return void res.writeHead(404).end();
  res.writeHead(200, { "content-type": MIME[extname(file)] || "application/octet-stream" }).end(readFileSync(file));
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const URL_ = `http://127.0.0.1:${server.address().port}/`;

const press = (page, src) =>
  page.evaluate((s) => {
    const re = new RegExp(s, "i");
    const b = [...document.querySelectorAll("button")].find((x) => !x.disabled && re.test((x.getAttribute("aria-label") || x.innerText || "").trim()));
    if (b) b.click();
    return !!b;
  }, src);
// The screens: each opens a fresh page and gets there by itself.
const SCREENS = [
  { name: "opening", night: false, go: async () => true },
  { name: "opening-night", night: true, go: async () => true },
  { name: "war-room-okw", night: false, go: async (p) => press(p, "^OKW") },
  { name: "briefing-okw-1", night: false, go: async (p) => (await press(p, "^OKW")) && (await p.waitForTimeout(300), press(p, "^Enter the War Room")) },
  { name: "briefing-ighq-1-night", night: true, go: async (p) => (await press(p, "^IGHQ")) && (await p.waitForTimeout(300), press(p, "^Enter the War Room")) },
];

const browser = await chromium.launch();
const failures = [];
for (const s of SCREENS) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
  await ctx.addInitScript((night) => {
    try {
      localStorage.setItem("dispatchesWW2_instant_text", "true");
      localStorage.setItem("dispatchesWW2_music", "false");
      localStorage.setItem("dispatchesWW2_night", night ? "1" : "0");
    } catch (e) {
      /* none */
    }
  }, s.night);
  const page = await ctx.newPage();
  await page.goto(URL_, { waitUntil: "load" });
  await page.waitForTimeout(700);
  if (!(await s.go(page))) {
    failures.push(`${s.name}: could not reach the screen`);
    await ctx.close();
    continue;
  }
  await page.waitForTimeout(700);
  await page.evaluate(async () => {
    if (document.fonts) await document.fonts.ready;
    await Promise.all([...document.images].filter((i) => !i.complete).map((i) => new Promise((r) => (i.onload = i.onerror = r))));
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(300);
  const png = await page.screenshot({ fullPage: false });
  writeFileSync(join(OUT, `${s.name}.png`), png);
  const basePath = join(BASE, `${s.name}.png`);
  if (UPDATE || !existsSync(basePath)) {
    writeFileSync(basePath, png);
    console.log(`${UPDATE ? "accepted" : "recorded"} ${s.name} (no accepted image before)`);
    await ctx.close();
    continue;
  }
  // Compare on a blank page: both images decoded on a canvas, the differing pixels painted red into a diff image.
  const cmp = await ctx.newPage();
  await cmp.setContent("<html><body></body></html>");
  const result = await cmp.evaluate(
    async ([a, b, tol]) => {
      const load = (b64) => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = "data:image/png;base64," + b64; });
      const [ia, ib] = await Promise.all([load(a), load(b)]);
      if (ia.width !== ib.width || ia.height !== ib.height) return { sizeMismatch: `${ia.width}x${ia.height} against ${ib.width}x${ib.height}` };
      const w = ia.width, h = ia.height;
      const ca = document.createElement("canvas"); ca.width = w; ca.height = h;
      const xa = ca.getContext("2d"); xa.drawImage(ia, 0, 0);
      const da = xa.getImageData(0, 0, w, h);
      const cb = document.createElement("canvas"); cb.width = w; cb.height = h;
      const xb = cb.getContext("2d"); xb.drawImage(ib, 0, 0);
      const db = xb.getImageData(0, 0, w, h);
      let diff = 0;
      const out = xb.createImageData(w, h);
      for (let k = 0; k < da.data.length; k += 4) {
        const d = Math.max(Math.abs(da.data[k] - db.data[k]), Math.abs(da.data[k + 1] - db.data[k + 1]), Math.abs(da.data[k + 2] - db.data[k + 2]));
        if (d > tol) { diff++; out.data[k] = 255; out.data[k + 1] = 0; out.data[k + 2] = 0; out.data[k + 3] = 255; }
        else { const g = (db.data[k] + db.data[k + 1] + db.data[k + 2]) / 3; out.data[k] = out.data[k + 1] = out.data[k + 2] = g; out.data[k + 3] = 90; }
      }
      xb.putImageData(out, 0, 0);
      return { ratio: diff / (w * h), diffPng: cb.toDataURL("image/png").split(",")[1] };
    },
    [readFileSync(basePath).toString("base64"), png.toString("base64"), TOLERANCE]
  );
  if (result.sizeMismatch) failures.push(`${s.name}: size changed (${result.sizeMismatch})`);
  else {
    const pct = (result.ratio * 100).toFixed(2);
    if (result.ratio > MAX_DIFF) {
      writeFileSync(join(OUT, `${s.name}-diff.png`), Buffer.from(result.diffPng, "base64"));
      failures.push(`${s.name}: ${pct}% of the pixels differ (more than ${(MAX_DIFF * 100).toFixed(1)}%); see ${s.name}-diff.png`);
      console.log(`FAIL ${s.name}: ${pct}% differ`);
    } else console.log(`ok   ${s.name}: ${pct}% differ`);
  }
  await ctx.close();
}
await browser.close();
server.close();
if (failures.length) {
  console.error(`\nvisual check: ${failures.length} screen(s) changed. If the change is meant, accept the CI images (tests/browser-shots/visual/) into tests/visual-baseline/.`);
  for (const f of failures) console.error("  " + f);
  process.exit(1);
}
console.log("\nvisual check: every screen matches its accepted image (or was recorded for the first time)");
