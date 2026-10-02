import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = "file://" + path.join(__dirname, "..", "dist", "index.html");
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage({ viewport: { width: 900, height: 900 } });
await page.goto(filePath);

async function dismissIfNewspaper() {
  const btn = page.getByText("Turn the Page");
  if (await btn.isVisible().catch(() => false)) { await btn.click(); await page.waitForTimeout(100); }
}
async function continueIfOutcome() {
  const label = page.getByText("The Outcome");
  if (await label.isVisible().catch(() => false)) {
    await page.getByRole("button", { name: "Continue" }).click();
    await page.waitForTimeout(100);
  }
}
async function click(text) {
  await dismissIfNewspaper();
  await continueIfOutcome();
  // Options now take two taps to commit (the first just arms the card, the
  // second confirms it).
  const option = page.getByRole("button", { name: text, exact: false }).first();
  await option.click();
  await page.waitForTimeout(100);
  await option.click();
  await page.waitForTimeout(100);
  await continueIfOutcome();
  await dismissIfNewspaper();
}

await page.getByRole("button", { name: "Begin the Work" }).click();
await page.getByRole("button", { name: "Continue" }).click();
await page.getByRole("button", { name: "Enter" }).click();
await page.waitForSelector("text=The Anatomical Source");

await click("Raid the Local Executioner's Scaffold");
await click("Elevate Copper Roof Spires");
await click("Stitch a Heavy Draft-Worker Frame");
await click("Bribe the Dean's Clerk with Research Funds");
await page.waitForSelector("text=The Secrecy Network");
await page.screenshot({ path: "dist/screenshot-04-node6-gate.png" });
await browser.close();
