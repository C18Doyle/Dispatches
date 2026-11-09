// Plays the real build in a browser at phone width and photographs the same screens in each theme (the stylesheet is swapped in place, so the
// game's own state carries on). Needs the build served on :4181 (node scripts/serve_dist.mjs). Writes art/themes/shots/<theme>-<screen>.png and
// contact sheets.  node art/themes/shoot.mjs
import { chromium } from "file:///C:/dev/Dispatches/node_modules/playwright/index.mjs";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { THEMES } from "./themes.mjs";

const OUT = "art/themes/shots";
mkdirSync(OUT, { recursive: true });
const ids = Object.keys(THEMES);
const css = Object.fromEntries(ids.map((id) => [id, readFileSync(`art/themes/css/${id}.css`, "utf8")]));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto("http://localhost:4181/");
const original = await page.evaluate(() => document.querySelector("style").textContent);
const btn = (re) => page.getByRole("button", { name: re }).first();
let first = true;

async function cycle(screen, scrollY = 0) {
  for (const id of ids) {
    await page.evaluate((c) => {
      document.querySelector("style").textContent = c;
    }, css[id]);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(first ? 2500 : 700);
    first = false;
    await page.evaluate((y) => window.scrollTo(0, y), scrollY);
    await page.waitForTimeout(150);
    await page.screenshot({ path: `${OUT}/${id}-${screen}.png` });
  }
  await page.evaluate((c) => {
    document.querySelector("style").textContent = c;
  }, original);
  await page.evaluate(() => window.scrollTo(0, 0));
}

await cycle("menu");
await btn(/Begin the Case/).click();
await cycle("prologue");
await btn(/^Continue$/).click();
await cycle("card");
await btn(/The Consulting Detective/).click();
await btn(/^Enter$/).click();
await page.waitForTimeout(200);
await cycle("scene");
await cycle("choices", 640);
const opts = page.locator("button.group");
await opts.nth(1).click();
await cycle("armed", 640);
await opts.nth(1).click();
await page.waitForTimeout(200);
await cycle("outcome");
await btn(/^Continue$/).click();
await page.waitForTimeout(250);
await cycle("interlude");
await btn(/Turn the Page/).click();
await page.waitForTimeout(250);
await page.getByRole("tab", { name: "Company" }).click();
await cycle("company");

// play on at random to an ending
let a = 5;
const rnd = () => {
  a = (a + 0x6d2b79f5) >>> 0;
  let t = a;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
for (let i = 0; i < 900; i++) {
  await page.waitForTimeout(30);
  const text = await page.locator("main").innerText();
  if (/open a new case/i.test(text)) break;
  if (await btn(/Turn the Page/).count()) { await btn(/Turn the Page/).click(); continue; }
  if (await btn(/Play the Gambit/).count()) { await btn(/Play the Gambit/).click(); await page.waitForTimeout(1700); continue; }
  const o = page.locator("button.group");
  const n = await o.count();
  if (n) {
    const ok = [];
    for (let k = 0; k < n; k++) if (await o.nth(k).isEnabled()) ok.push(k);
    const pick = ok[Math.floor(rnd() * ok.length)];
    await o.nth(pick).click();
    await o.nth(pick).click().catch(() => {});
    continue;
  }
  const c = btn(/^Continue$/);
  if (await c.count()) await c.click();
}
await cycle("ending");

// contact sheets: one per theme (menu, scene, choices, interlude, ending) and one comparing a screen across themes
const sheet = async (name, files, caption) => {
  const html = `<html><body style="margin:0;background:#222;font:14px sans-serif;color:#eee"><div style="display:flex;gap:12px;padding:12px;align-items:flex-start">${files
    .map((f, i) => `<div><div style="padding:0 0 6px">${caption[i]}</div><img src="file:///${process.cwd().split(String.fromCharCode(92)).join("/")}/${OUT}/${f}" width="390" style="display:block"/></div>`)
    .join("")}</div></body></html>`;
  writeFileSync(`${OUT}/_${name}.html`, html);
  const p = await browser.newPage({ viewport: { width: 12 + files.length * 402, height: 920 } });
  await p.goto(`file:///${process.cwd().split(String.fromCharCode(92)).join("/")}/${OUT}/_${name}.html`);
  await p.waitForTimeout(600);
  await p.screenshot({ path: `${OUT}/sheet-${name}.png`, fullPage: true });
  await p.close();
};
for (const id of ids) {
  const screens = ["menu", "scene", "choices", "interlude", "ending"];
  await sheet(id, screens.map((s) => `${id}-${s}.png`), screens.map((s) => `${THEMES[id].name}: ${s}`));
}
await sheet("compare-scene", ids.map((id) => `${id}-scene.png`), ids.map((id) => THEMES[id].name));
await sheet("compare-choices", ids.map((id) => `${id}-choices.png`), ids.map((id) => THEMES[id].name));
await browser.close();
console.log("done");
