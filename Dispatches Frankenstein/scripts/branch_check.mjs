// Covers two things: (1) node 1's 3rd option still forks to the reworded
// "2-DARK" node with its own distinct title/text, and (2) the LORE_NODE_IDS
// regression fix — the Year-Without-a-Summer newspaper used to silently
// never fire on this path (it only checked for exact node id "2"), and now
// must fire here same as the ordinary "2" path does.
import { chromium } from "playwright";
import path from "node:path";
const __dirname = "/home/claude/frankenstein-jam";
const filePath = "file://" + path.join(__dirname, "dist", "index.html");

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await (await browser.newContext({ viewport: { width: 900, height: 1100 } })).newPage();
page.setDefaultTimeout(8000);

await page.goto(filePath);
await page.waitForSelector("text=Begin the Work");
await page.getByRole("button", { name: "Begin the Work" }).click();
await page.waitForSelector("text=From a Private Journal");
await page.getByRole("button", { name: "Continue" }).click();
await page.waitForSelector("text=To the Castle");
await page.getByRole("button", { name: "Easy", exact: true }).click();
await page.getByRole("button", { name: "Enter" }).click();
await page.waitForSelector("text=The Anatomical Source", { timeout: 5000 });

// Node 1's 3rd option: "Raid the Local Executioner's Scaffold." -> "2-DARK"
// Options now take two taps to commit (the first just arms the card, the
// second confirms it), so click it twice.
const raidOption = page.getByText("Raid the Local Executioner's Scaffold.");
await raidOption.click();
await page.waitForTimeout(150);
await raidOption.click();
await page.waitForTimeout(150);
await page.getByRole("button", { name: "Continue" }).click();
await page.waitForTimeout(200);

const newspaperVisible = await page.getByText("THE YEAR WITHOUT A SUMMER").isVisible().catch(() => false);
console.log("LORE newspaper fired on the 2-DARK path (expect true):", newspaperVisible);
await page.screenshot({ path: "dist/regression-2dark-newspaper.png" });
if (newspaperVisible) {
  await page.getByText("Turn the Page").click();
  await page.waitForTimeout(200);
}

const heading = await page.locator("h2.font-heading").first().innerText().catch(() => "(none)");
const bodyText = await page.locator("p.text-\\[1\\.05rem\\]").first().innerText().catch(() => "");
console.log("Node reached:", heading);
console.log("Distinct guilt-flavored text present:", bodyText.includes("gallows"));
await page.screenshot({ path: "dist/regression-2dark-node.png" });

const pass = newspaperVisible === true && heading === "The Storm After the Gallows" && bodyText.includes("gallows");
console.log(pass ? "PASS: LORE newspaper fires on the 2-DARK path and the node has its own distinct title/text." : "FAIL");

await browser.close();
process.exit(pass ? 0 : 1);
