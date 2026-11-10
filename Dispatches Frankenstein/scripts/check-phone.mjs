// check-phone.mjs: the built game at phone width (375 x 812) in a real browser, in each reading mode.
//
// For the menu, How to Play, Settings and a scene, in the default look, Plain Type and High Contrast, it fails if the page scrolls sideways, if a
// meter label is cut off, or if any text is under 12 px. It also runs axe (WCAG 2 A and AA) on each screen and lists what it finds: those are advisory
// (they fail the run only with --strict), because the contrast of the engraved look is judged by eye as well.
// Needs a build first (npm run build) and Playwright's Chromium. Run from the game folder: node scripts/check-phone.mjs [--strict]
import { createRequire } from "node:module";
import { existsSync } from "node:fs";
import { pathToFileURL } from "node:url";
import path from "node:path";

const strict = process.argv.includes("--strict");
const file = path.resolve("dist/index.html");
if (!existsSync(file)) {
  console.error("no dist/index.html: run npm run build first");
  process.exit(2);
}
const require = createRequire(path.resolve("../package.json"));
const { chromium } = require("playwright");
let AxeBuilder = null;
try {
  AxeBuilder = require("@axe-core/playwright").default ?? require("@axe-core/playwright");
} catch {
  console.log("note: @axe-core/playwright is not installed, so the axe step is skipped");
}

const MODES = [
  ["default", {}],
  ["plain type", { plainType: true }],
  ["high contrast", { highContrast: true }],
];

let hard = 0;
let advisory = 0;
const browser = await chromium.launch();
try {
  for (const [name, reading] of MODES) {
    const context = await browser.newContext({ viewport: { width: 375, height: 812 } });
    await context.addInitScript((r) => {
      try {
        localStorage.setItem("frankenstein_reading", JSON.stringify(r));
      } catch {
        /* storage unavailable */
      }
    }, reading);
    const page = await context.newPage();
    await page.goto(pathToFileURL(file).href);

    const check = async (screen) => {
      await page.waitForTimeout(600); // let the colour transitions on buttons finish, or axe reads a colour half way
      const r = await page.evaluate(() => ({
        over: document.documentElement.scrollWidth - window.innerWidth,
        clipped: [...document.querySelectorAll('[role="meter"] span')].filter((e) => e.scrollWidth > e.clientWidth + 1).map((e) => e.textContent),
        small: [...document.querySelectorAll("body *")]
          .filter((e) => e.children.length === 0 && e.textContent.trim() && parseFloat(getComputedStyle(e).fontSize) < 12)
          .map((e) => e.textContent.trim().slice(0, 24)),
      }));
      const bad = r.over > 0 || r.clipped.length || r.small.length;
      if (bad) {
        hard++;
        console.error(`FAIL ${name} / ${screen}: sideways scroll ${r.over}px, clipped meters ${JSON.stringify(r.clipped)}, text under 12px ${JSON.stringify(r.small.slice(0, 4))}`);
      }
      if (AxeBuilder) {
        const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
        for (const v of results.violations) {
          advisory++;
          const where = v.nodes.slice(0, 3).map((n) => `${n.target.join(" ")} [${(n.any[0]?.message ?? "").slice(0, 90)}]`).join("; ");
          console.log(`axe  ${name} / ${screen}: ${v.id} (${v.impact}) on ${v.nodes.length} element(s): ${v.help}. ${where}`);
        }
      }
    };

    // the mode really is on (the page reads it from storage), or this run proves nothing about it
    const on = await page.evaluate(() => ({
      plain: document.documentElement.classList.contains("plain-type"),
      contrast: document.documentElement.classList.contains("high-contrast"),
    }));
    if (on.plain !== !!reading.plainType || on.contrast !== !!reading.highContrast) {
      hard++;
      console.error(`FAIL ${name}: the reading mode was not applied (${JSON.stringify(on)})`);
    }

    await check("menu");
    await page.getByRole("button", { name: "How to Play" }).click();
    await check("how to play");
    await page.getByRole("button", { name: "Close" }).click();
    await page.getByRole("button", { name: "Settings" }).click();
    await check("settings");
    await page.getByRole("button", { name: "Close" }).click();
    await page.getByRole("button", { name: /Begin the Work/ }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("button", { name: "Enter" }).click();
    await check("scene");
    await context.close();
  }
} finally {
  await browser.close();
}

console.log(`phone check: ${hard} layout failure(s), ${advisory} axe finding(s) (advisory).`);
if (hard || (strict && advisory)) process.exit(1);
console.log("Phone check passed.");
