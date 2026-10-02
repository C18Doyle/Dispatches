// One-off screenshot pass for the Phase F ship checklist: Settings' new
// Dispatches section (full page, so the appended section is guaranteed
// visible regardless of viewport height), and the two new castle-specific
// flavor nodes (6-TOWER, 7-BATTLEMENTS) reached via their real routing.
import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = "file://" + path.join(__dirname, "..", "dist", "index.html");

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await (await browser.newContext({ viewport: { width: 900, height: 1000 } })).newPage();
page.setDefaultTimeout(8000);

await page.goto(filePath);
await page.waitForSelector("text=Begin the Work");

// Settings — Dispatches section
await page.getByRole("button", { name: "Settings", exact: true }).first().click();
await page.waitForSelector("text=Dispatches");
await page.getByText("See the Rest of the Series").scrollIntoViewIfNeeded();
await page.screenshot({ path: "dist/screenshot-settings-dispatches.png", fullPage: true });
await page.getByRole("button", { name: "Close" }).click();
await page.waitForSelector("text=Begin the Work");

// Route: Node 1 -> 2 -> ... -> Node 4 -> "Bar the West Tower Stair" -> 6-TOWER
await page.getByRole("button", { name: "Begin the Work" }).click();
await page.getByRole("button", { name: "Continue" }).click();
await page.waitForSelector("text=To the Castle");
await page.getByRole("button", { name: "Enter" }).click();
await page.waitForSelector("text=The Anatomical Source");

async function clickLabel(label) {
  // Options now take two taps to commit (the first just arms the card, the
  // second confirms it). Not `exact: true` — the whole option card is one
  // button now, so its accessible name is the label plus the detail and
  // quote text, not just the label; a substring match still pins it to one
  // specific option since these option labels don't overlap on this route.
  const option = page.getByRole("button", { name: label });
  await option.click();
  await page.waitForTimeout(150);
  await option.click();
  await page.waitForTimeout(150);
  const continueBtn = page.getByRole("button", { name: "Continue" });
  if (await continueBtn.isVisible().catch(() => false)) {
    await continueBtn.click();
    await page.waitForTimeout(150);
  }
  const turnPage = page.getByText("Turn the Page");
  if (await turnPage.isVisible().catch(() => false)) {
    await turnPage.click();
    await page.waitForTimeout(150);
  }
}

await clickLabel("Secure Preserved Dissection Specimens from University.");
await clickLabel("Route Charge Slowly Through Chemical Leyden Batteries.");
await clickLabel("Assemble a Fast Hound-Grafted Crawler.");
await page.waitForSelector("text=A folded notice arrives", { timeout: 5000 }).catch(() => {});
await clickLabel("Bar the West Tower Stair and Ignore the Order.");
await page.waitForSelector("text=The Barred Stair");
await page.screenshot({ path: "dist/screenshot-castle-6tower.png" });

await clickLabel("Release a Primitive Construct to Terrify Neighbors.");
await page.waitForSelector("text=What Walked the Battlements");
await page.screenshot({ path: "dist/screenshot-castle-7battlements.png" });

console.log("Screenshots captured: settings-dispatches, castle-6tower, castle-7battlements");
await browser.close();
process.exit(0);
