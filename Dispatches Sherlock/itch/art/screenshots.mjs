// Plays the built game in a phone-shaped browser and saves the itch.io screenshots to itch/screenshots/.
//   npm run build && node scripts/serve_dist.mjs &    then    node itch/art/screenshots.mjs
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const out = join(dirname(fileURLToPath(import.meta.url)), "..", "screenshots");
mkdirSync(out, { recursive: true });
const URL = process.env.URL ?? "http://localhost:4181/";
const browser = await chromium.launch();

async function session(fn) {
  const page = await browser.newPage({ viewport: { width: 600, height: 900 }, deviceScaleFactor: 2 });
  await page.goto(URL);
  const btn = (re) => page.getByRole("button", { name: re }).first();
  const shot = (n, full = false) => page.screenshot({ path: join(out, `${n}.png`), fullPage: full });
  const top = () => page.evaluate(() => window.scrollTo(0, 0));
  const settle = async (stopAt) => {
    for (let k = 0; k < 40; k++) {
      if (await page.locator("button.group").count()) return true;
      for (const re of [/Play the gambit/i, /^Continue$/, /Turn the page/i]) {
        const b = btn(re);
        if (await b.count()) {
          if (stopAt && stopAt(re)) return false;
          await b.click();
          await page.waitForTimeout(350);
          break;
        }
      }
      await page.waitForTimeout(150);
    }
    return false;
  };
  const pick = async (i) => {
    if (!(await settle())) throw new Error("no options on screen");
    const o = page.locator("button.group");
    const n = Math.min(i, (await o.count()) - 1);
    await o.nth(n).click();
    await o.nth(n).click().catch(() => {});
    await page.waitForTimeout(250);
  };
  const begin = async () => {
    await btn(/Begin the Case/).click();
    await btn(/^Continue$/).click();
    await btn(/The Consulting Detective/).click();
    await btn(/^Enter$/).click();
    await page.waitForTimeout(400);
  };
  await fn({ page, btn, shot, settle, pick, begin, top });
  await page.close();
}

// the long case: title, shelf, a scene with the Strand, the board, the calendar, the map
await session(async ({ page, shot, pick, settle, begin }) => {
  await page.waitForTimeout(500);
  await shot("01-title");
  await begin();
  await shot("02-case-book");
  await pick(0);
  for (let n = 0; n < 8; n++) await pick(0);
  await settle();
  await page.evaluate(() => window.scrollTo(0, 0));
  await shot("03-the-final-problem");
  await page.getByRole("tab", { name: "Board" }).click();
  await page.waitForTimeout(300);
  await shot("04-the-board");
  await page.getByRole("tab", { name: "Calendar" }).click();
  await page.waitForTimeout(300);
  await shot("05-the-calendar");
  await page.getByRole("tab", { name: "Map" }).click();
  await page.waitForTimeout(300);
  await shot("06-the-map");
});

// the speckled band: the telegram
await session(async ({ page, btn, shot, pick, begin }) => {
  await begin();
  const o = page.locator("button.group");
  await o.nth(1).click();
  await o.nth(1).click().catch(() => {});
  for (let k = 0; k < 10; k++) {
    if (await btn(/Turn the page/i).count()) break;
    const c = btn(/^Continue$/);
    if (await c.count()) await c.click();
    await page.waitForTimeout(250);
  }
  await page.waitForTimeout(300);
  await shot("07-a-telegram");
});

// a scandal in bohemia: a gambit and an ending
await session(async ({ page, btn, shot, pick, settle, begin }) => {
  await begin();
  await pick(2);
  await pick(0);
  await pick(0);
  await settle();
  const o = page.locator("button.group");
  await o.nth(0).click();
  await o.nth(0).click().catch(() => {});
  await page.waitForTimeout(500);
  await shot("08-a-gambit");
  for (let k = 0; k < 6; k++) {
    const g = btn(/Play the gambit/i);
    if (await g.count()) await g.click();
    await page.waitForTimeout(400);
    const c = btn(/^Continue$/);
    if (await c.count()) {
      await c.click();
      await page.waitForTimeout(300);
    }
    if (await page.locator("button.group").count()) break;
  }
  await pick(0);
  for (let k = 0; k < 12; k++) {
    const c = btn(/^Continue$/);
    if (await c.count()) await c.click();
    await page.waitForTimeout(350);
    if (await page.getByText(/Play again|The ending|How it's remembered/i).count()) break;
  }
  await page.waitForTimeout(600);
  await shot("09-an-ending");
});

// the paper look: the same parlour in daylight
await session(async ({ page, btn, shot, pick, begin }) => {
  await btn(/^Settings$/).click();
  await page.getByRole("button", { name: /Look: paper/ }).click();
  await page.waitForTimeout(200);
  await page.keyboard.press("Escape");
  const back = btn(/Close|Back|Done/i);
  if (await back.count()) await back.click();
  await page.waitForTimeout(300);
  await begin();
  await page.waitForTimeout(300);
  await shot("10-the-paper-look");
});

await browser.close();
console.log("screenshots written to itch/screenshots");
