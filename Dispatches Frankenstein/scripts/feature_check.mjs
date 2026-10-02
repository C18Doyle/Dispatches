import { chromium } from "playwright";
import path from "node:path";
const __dirname = "/home/claude/frankenstein-jam";
const filePath = "file://" + path.join(__dirname, "dist", "index.html");

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const context = await browser.newContext({ viewport: { width: 900, height: 1100 } });
const page = await context.newPage();
const errors = [];
// Sandbox-only: this Playwright-launched Chromium doesn't route the Google
// Fonts CSS request through the environment's agent proxy, so it fails here
// specifically (confirmed in prior rounds to be the sandbox's networking,
// not the app — the published Artifact's font host is allowlisted and loads
// fine in a real browser). The failure surfaces as a generic
// ERR_TUNNEL_CONNECTION_FAILED resource-load message, not one that mentions
// fonts.googleapis.com by name, so both need filtering — matching the same
// two-part check smoke.mjs already uses.
page.on("console", (msg) => {
  if (msg.type() !== "error") return;
  const text = msg.text();
  if (text.includes("fonts.googleapis.com") || text.includes("ERR_TUNNEL_CONNECTION_FAILED")) return;
  errors.push(text);
});
page.on("pageerror", (err) => errors.push("pageerror: " + err.message));

// This filter previously omitted "send for fritz", "gossip", and
// "progress report" (now "creature report") — leaving the loop below free
// to click into the Fritz panel and then get stuck re-clicking
// Gossip/Creature Report forever (neither advances the node), never
// reaching an ending inside the 40-step budget. Aligned with the
// isFritzPanelButton set used by the other Playwright checks in this
// folder.
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

// --- Run 1: play to an ending on Easy, verify run summary + endings counter ---
await page.goto(filePath);
await page.waitForSelector("text=Begin the Work");
await page.getByRole("button", { name: "Begin the Work" }).click();
await page.waitForSelector("text=From a Private Journal");
await page.getByRole("button", { name: "Continue" }).click();
await page.waitForSelector("text=To the Castle");
await page.getByRole("button", { name: "Easy", exact: true }).click();
await page.getByRole("button", { name: "Enter" }).click();
await page.waitForSelector("text=The Anatomical Source", { timeout: 5000 });

// Budget doubled from 40: options now take two taps to commit (arm, then
// confirm), which roughly doubles the number of loop iterations a full
// playthrough needs.
for (let i = 0; i < 80; i++) {
  if (await page.getByText("Begin a New Experiment").isVisible().catch(() => false)) break;
  const continueBtn = page.getByRole("button", { name: "Continue" });
  if (await continueBtn.isVisible().catch(() => false)) { await continueBtn.click(); await page.waitForTimeout(80); continue; }
  const turnPage = page.getByText("Turn the Page");
  if (await turnPage.isVisible().catch(() => false)) { await turnPage.click(); await page.waitForTimeout(80); continue; }
  const conductBtn = page.getByRole("button", { name: "Conduct the Experiment" });
  if (await conductBtn.isVisible().catch(() => false)) { await conductBtn.click(); await page.waitForTimeout(1700); continue; }
  const btn = await clickFirstEnabledOption();
  if (!btn) break;
  await btn.click();
  await page.waitForTimeout(80);
}
await page.waitForSelector("text=Begin a New Experiment", { timeout: 5000 });
await page.screenshot({ path: "dist/feature-01-ending-summary.png", fullPage: true });
const recordText = await page.locator("text=Your Record").isVisible().catch(() => false);
console.log("Run summary card visible:", recordText);

// Back to menu, verify endings counter
await page.getByRole("button", { name: "Begin a New Experiment" }).click();
await page.waitForSelector("text=Begin the Work");
await page.screenshot({ path: "dist/feature-02-menu-counter.png" });
const counterVisible = await page.getByText("1 / 12 Endings Discovered").isVisible().catch(() => false);
console.log("Endings counter shows 1/12:", counterVisible);

// Chapter card should now offer Skip to the Laboratory
await page.getByRole("button", { name: "Begin the Work" }).click();
await page.waitForSelector("text=From a Private Journal");
await page.getByRole("button", { name: "Continue" }).click();
await page.waitForSelector("text=To the Castle");
await page.screenshot({ path: "dist/feature-03-chapter-skip-button.png" });
const skipVisible = await page.getByRole("button", { name: "Skip to the Laboratory" }).isVisible().catch(() => false);
console.log("Skip to the Laboratory button visible:", skipVisible);
if (skipVisible) {
  await page.getByRole("button", { name: "Skip to the Laboratory" }).click();
  await page.waitForSelector("text=The Galvanic Method", { timeout: 5000 });
  console.log("Skip landed on: The Galvanic Method (node 5) - OK");
  await page.screenshot({ path: "dist/feature-04-skip-landing.png" });
}

console.log("Console/page errors so far:", errors.length, errors.join(" | "));
await browser.close();
