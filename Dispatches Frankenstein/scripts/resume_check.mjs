import { chromium } from "playwright";
import path from "node:path";
const __dirname = "/home/claude/frankenstein-jam";
const filePath = "file://" + path.join(__dirname, "dist", "index.html");

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const context = await browser.newContext({ viewport: { width: 900, height: 1100 } });
const page = await context.newPage();
page.setDefaultTimeout(8000);

await page.goto(filePath);
await page.waitForSelector("text=Begin the Work");
await page.getByRole("button", { name: "Begin the Work" }).click();
await page.waitForSelector("text=From a Private Journal");
await page.getByRole("button", { name: "Continue" }).click();
await page.waitForSelector("text=To the Castle");
await page.getByRole("button", { name: "Hard", exact: true }).click();
await page.getByRole("button", { name: "Enter" }).click();
await page.waitForSelector("text=The Anatomical Source", { timeout: 5000 });

// Matches the isFritzPanelButton set used by the other Playwright checks in
// this folder — this filter previously omitted "send for fritz",
// "gossip", and "progress report" (now "creature report"), which let it
// click into the Fritz panel and get stuck there instead of picking a real
// story option.
function isFritzPanelButton(text) {
  const t = text.toLowerCase();
  return (
    t.startsWith("ask fritz") ||
    t === "fritz's favor" ||
    t === "fritz has advised you" ||
    t.startsWith("boost ") ||
    t === "send for fritz" ||
    t === "gossip" ||
    t === "creature report"
  );
}

async function clickFirstEnabledOption() {
  const all = await page.locator("button").all();
  for (const b of all) {
    if (await b.isDisabled()) continue;
    const al = await b.getAttribute("aria-label");
    if (al === "Settings") continue;
    const t = (await b.innerText()).trim();
    if (!t || isFritzPanelButton(t)) continue;
    return b;
  }
  return null;
}
// Options now take two taps to commit (the first just arms the card, the
// second — on the same still-first-in-DOM-order button — confirms it).
const btn = await clickFirstEnabledOption();
await btn.click();
await page.waitForTimeout(150);
await btn.click();
await page.waitForTimeout(150);
await page.getByRole("button", { name: "Continue" }).click();
await page.waitForTimeout(200);
// A lore/crisis newspaper may interstitial here — dismiss it if present.
const turnPage = page.getByText("Turn the Page");
if (await turnPage.isVisible().catch(() => false)) {
  await turnPage.click();
  await page.waitForTimeout(200);
}
const savedTitleText = await page.locator("h2.font-heading").first().innerText();
console.log("Mid-run node before reload:", savedTitleText);

await page.goto(filePath);
await page.waitForSelector("text=Begin the Work");
const resumeVisible = await page.getByRole("button", { name: "Continue Your Work" }).isVisible().catch(() => false);
console.log("Continue Your Work button visible after reload:", resumeVisible);
await page.screenshot({ path: "dist/feature-05-resume-menu.png" });
if (resumeVisible) {
  await page.getByRole("button", { name: "Continue Your Work" }).click();
  await page.waitForTimeout(300);
  const resumedTitle = await page.locator("h2.font-heading").first().innerText().catch(() => "(none)");
  console.log("Node after resume:", resumedTitle, "| matches before:", resumedTitle === savedTitleText);
  await page.screenshot({ path: "dist/feature-06-resumed-node.png" });
}

await browser.close();
console.log("DONE");
