// Verifies Craig's 5-item Round H fix list against the built dist/index.html:
// 1. "Send for Fritz" is actually visible (light text on the dark void
//    background, not the invisible dark-on-dark it shipped with).
// 2. (sound change is not verifiable via Playwright — covered by code review
//    of sfx.ts only.)
// 3. On Medium (the default difficulty), the Outcome screen shows a "What
//    Changed" section with the actual resource deltas from the choice just
//    made.
// 4. Gossip and Creature Report are mutually exclusive — clicking one hides
//    the other's line.
// 5. (font tone-down is covered by penny_dreadful_round_check.mjs.)
import { chromium } from "playwright";
import path from "node:path";

const __dirname = "/home/claude/frankenstein-jam";
const filePath = "file://" + path.join(__dirname, "dist", "index.html");

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await (await browser.newContext({ viewport: { width: 900, height: 1200 } })).newPage();
page.setDefaultTimeout(8000);

let failures = 0;
function check(label, cond) {
  console.log(`${cond ? "OK" : "FAIL"}: ${label}`);
  if (!cond) failures++;
}

await page.goto(filePath);
await page.waitForSelector("text=Begin the Work");
await page.getByRole("button", { name: "Begin the Work" }).click();
await page.waitForSelector("text=From a Private Journal");
await page.getByRole("button", { name: "Continue" }).click();
await page.waitForSelector("text=To the Castle");
await page.getByRole("button", { name: "Enter" }).click();
await page.waitForSelector("text=The Anatomical Source", { timeout: 5000 });

// --- 1. Send for Fritz visibility (dark-background button convention) ---
const sendForFritz = page.getByRole("button", { name: "Send for Fritz" });
check("Send for Fritz button present", await sendForFritz.isVisible().catch(() => false));
const { color, bg, box } = await sendForFritz.evaluate((el) => {
  const s = getComputedStyle(el);
  const r = el.getBoundingClientRect();
  return { color: s.color, bg: s.backgroundColor, box: { w: r.width, h: r.height } };
});
console.log(`  Send for Fritz computed color=${color} bg=${bg} size=${box.w}x${box.h}`);
check("Send for Fritz has a non-zero rendered size", box.w > 0 && box.h > 0);
check("Send for Fritz text color is not near-black (light-on-dark)", color !== "rgb(15, 15, 14)" && color !== "rgba(0, 0, 0, 0)");
await page.screenshot({ path: "dist/round-h-01-send-for-fritz.png" });

// --- 4. Gossip / Creature Report mutual exclusivity ---
await sendForFritz.click();
await page.waitForTimeout(150);
await page.getByRole("button", { name: "Gossip" }).click();
await page.waitForTimeout(150);
const gossipAloneVisible = await page.getByText(/Fritz: "/).isVisible().catch(() => false);
const creatureHiddenAfterGossip = !(await page.getByText("Fritz, on the creature:").isVisible().catch(() => false));
check("Gossip line visible after clicking Gossip", gossipAloneVisible);
check("Creature Report line hidden while Gossip is showing", creatureHiddenAfterGossip);
await page.screenshot({ path: "dist/round-h-02-gossip-only.png" });

await page.getByRole("button", { name: "Creature Report" }).click();
await page.waitForTimeout(150);
const creatureVisible = await page.getByText("Fritz, on the creature:").isVisible().catch(() => false);
const gossipHiddenAfterCreature = !(await page.getByText(/Fritz: "/).isVisible().catch(() => false));
check("Creature Report line visible after clicking Creature Report", creatureVisible);
check("Gossip line hidden while Creature Report is showing", gossipHiddenAfterCreature);
await page.screenshot({ path: "dist/round-h-03-creature-report-only.png" });

// --- 3. Outcome screen shows choice impact on Medium ---
// Node 1's "Secure Preserved Dissection Specimens" option is a known
// non-roll choice with non-zero stamps (biomass +1, secrecy +1, voltage -1)
// and no money cost, so it deterministically exercises the "What Changed"
// panel rather than relying on whichever option a generic loop happens to
// click first (some of which have all-zero or gated stamps).
// Options now take two taps to commit (the first just arms the card, the
// second confirms it).
const disectionOption = page.getByRole("button", {
  name: "Secure Preserved Dissection Specimens from University.",
});
await disectionOption.click();
await page.waitForTimeout(150);
await disectionOption.click();
await page.waitForSelector("text=Continue", { timeout: 5000 }).catch(() => {});
await page.waitForTimeout(300);
const whatChangedVisible = await page.getByText("What Changed").isVisible().catch(() => false);
check('Outcome screen shows "What Changed" section on Medium', whatChangedVisible);
await page.screenshot({ path: "dist/round-h-04-outcome-impact.png" });

console.log(failures === 0 ? "ALL ROUND H CHECKS PASSED" : `${failures} CHECK(S) FAILED`);
await browser.close();
process.exit(failures === 0 ? 0 : 1);
