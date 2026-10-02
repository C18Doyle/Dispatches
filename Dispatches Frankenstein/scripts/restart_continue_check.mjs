// Regression test for the resumableSave staleness fix. The old code read
// localStorage once at mount into a useState with no setter, so
// "Continue Your Work" never re-checked localStorage again for the rest of
// the session. Concretely: load with an existing save -> resume it ->
// finish that run (which clears the save) -> Restart back to the menu ->
// the button would incorrectly still show, pointing at the now-cleared,
// already-finished run. This drives that exact sequence and asserts the
// button is gone once the run has actually finished.
import { chromium } from "playwright";
import path from "node:path";

const __dirname = "/home/claude/frankenstein-jam";
const filePath = "file://" + path.join(__dirname, "dist", "index.html");

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const context = await browser.newContext({ viewport: { width: 900, height: 1100 } });
const page = await context.newPage();
page.setDefaultTimeout(8000);

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

async function playToEnding() {
  for (let i = 0; i < 80; i++) {
    const continueBtn = page.getByRole("button", { name: "Continue" });
    if (await continueBtn.isVisible().catch(() => false)) {
      await continueBtn.click();
      await page.waitForTimeout(100);
      continue;
    }
    const turnPage = page.getByText("Turn the Page");
    if (await turnPage.isVisible().catch(() => false)) {
      await turnPage.click();
      await page.waitForTimeout(100);
      continue;
    }
    const playAgain = page.getByText("Begin a New Experiment");
    if (await playAgain.isVisible().catch(() => false)) return true;
    const conductBtn = page.getByRole("button", { name: "Conduct the Experiment" });
    if (await conductBtn.isVisible().catch(() => false)) {
      await conductBtn.click();
      // Conducting now opens a ~1.5s suspense phase before the roll actually
      // resolves and the screen moves on — wait it out.
      await page.waitForTimeout(1700);
      continue;
    }
    const btn = await clickFirstEnabledOption();
    if (!btn) return false;
    await btn.click();
    await page.waitForTimeout(100);
  }
  return false;
}

// 1. Fresh load, start a run, make one choice so a save exists.
await page.goto(filePath);
await page.getByRole("button", { name: "Begin the Work" }).click();
await page.getByRole("button", { name: "Continue" }).click();
await page.waitForSelector("text=To the Castle");
await page.getByRole("button", { name: "Enter" }).click();
await page.waitForSelector("text=The Anatomical Source");
// Options now take two taps to commit (the first just arms the card, the
// second — on the same still-first-in-DOM-order button — confirms it).
const firstBtn = await clickFirstEnabledOption();
await firstBtn.click();
await page.waitForTimeout(150);
await firstBtn.click();
await page.waitForTimeout(150);
await page.getByRole("button", { name: "Continue" }).click();
await page.waitForTimeout(200);
const earlyNewspaper = page.getByText("Turn the Page");
if (await earlyNewspaper.isVisible().catch(() => false)) {
  await earlyNewspaper.click();
  await page.waitForTimeout(200);
}

// 2. Reload so `resumableSave` picks up the mid-run save (this part of the
//    flow already worked before the fix).
await page.goto(filePath);
await page.waitForSelector("text=Begin the Work");
const resumeVisibleBeforeFinish = await page.getByRole("button", { name: "Continue Your Work" }).isVisible().catch(() => false);
console.log("Continue Your Work visible after reload (expect true):", resumeVisibleBeforeFinish);

// 3. Resume it and play all the way to an ending, then hit Restart —
//    entirely in-session, no further reloads.
await page.getByRole("button", { name: "Continue Your Work" }).click();
await page.waitForTimeout(200);
const reachedEnding = await playToEnding();
console.log("Reached an ending:", reachedEnding);
await page.getByRole("button", { name: "Begin a New Experiment" }).click();
await page.waitForSelector("text=Begin the Work");

// 4. This is the actual regression check: the save was cleared on reaching
//    the ending, so the button must now be gone WITHOUT another reload.
// resumableSave is corrected by a useEffect that fires after the MENU
// screen has already painted, not synchronously with the screen transition
// — so checking in the very same tick can catch a one-frame-stale value
// that's already on its way to correcting itself. A short settle wait
// avoids flagging that harmless race as the actual bug this test exists to
// catch (confirmed independently: a direct localStorage read at this same
// point is already empty, and the button reliably clears within ~400ms).
await page.waitForTimeout(400);
const resumeVisibleAfterRestart = await page.getByRole("button", { name: "Continue Your Work" }).isVisible().catch(() => false);
console.log("Continue Your Work visible after in-session Restart (expect false):", resumeVisibleAfterRestart);
await page.screenshot({ path: "dist/regression-restart-menu.png" });

const pass = resumeVisibleBeforeFinish === true && reachedEnding === true && resumeVisibleAfterRestart === false;
console.log(pass ? "PASS: Continue Your Work correctly disappears after an in-session Restart." : "FAIL: stale resumableSave regression is back.");

await browser.close();
process.exit(pass ? 0 : 1);
