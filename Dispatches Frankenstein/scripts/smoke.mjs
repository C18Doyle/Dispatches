import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = "file://" + path.join(__dirname, "..", "dist", "index.html");

const errors = [];
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" }).catch(() => chromium.launch());
const page = await browser.newPage({ viewport: { width: 900, height: 1000 } });
page.on("console", (msg) => {
  if (msg.type() !== "error") return;
  const text = msg.text();
  // This sandbox's Playwright-launched Chromium doesn't route through the
  // environment's agent proxy the way Bash/WebFetch do, so the Google
  // Fonts CSS request fails here specifically. Confirmed (debug script,
  // prior phase) to be the sandbox's networking, not the app: the published
  // Artifact's fonts.googleapis.com host is allowlisted and loads fine in a
  // real browser, and the page degrades to serif fallbacks in the meantime.
  if (text.includes("fonts.googleapis.com") || text.includes("ERR_TUNNEL_CONNECTION_FAILED")) return;
  errors.push(text);
});
page.on("pageerror", (err) => errors.push("pageerror: " + err.message));

await page.goto(filePath);

// --- Main Menu ---
await page.waitForSelector("text=Begin the Work", { timeout: 5000 });
await page.screenshot({ path: "dist/screenshot-00-menu.png" });

// How To round-trip
await page.getByRole("button", { name: "How To" }).click();
await page.waitForSelector("text=How to Play");
await page.screenshot({ path: "dist/screenshot-00a-research.png" });
await page.getByRole("button", { name: "Back" }).click();
await page.waitForSelector("text=Begin the Work");

// Settings round-trip (font size + music)
await page.getByRole("button", { name: "Settings", exact: true }).first().click();
await page.waitForSelector("text=The Ledger's Print");
await page.screenshot({ path: "dist/screenshot-00b-settings.png" });
await page.getByRole("button", { name: "large", exact: true }).click();
// Music and Sound Effects sections each have their own On/Off pair now —
// exercise both, disambiguating by position (Music first, SFX second).
await page.getByRole("button", { name: "On", exact: true }).first().click();
await page.getByRole("button", { name: "On", exact: true }).nth(1).click();
await page.getByRole("button", { name: "Close" }).click();
await page.waitForSelector("text=Begin the Work");

await page.getByRole("button", { name: "Begin the Work" }).click();

// --- Prologue ---
await page.waitForSelector("text=From a Private Journal");
await page.screenshot({ path: "dist/screenshot-00c-prologue.png" });
await page.getByRole("button", { name: "Continue" }).click();

// --- Chapter card: pick Hard so money + purse HUD get exercised ---
await page.waitForSelector("text=To the Castle");
await page.getByRole("button", { name: "Hard", exact: true }).click();
await page.waitForSelector("text=fifty Thaler");
await page.waitForTimeout(250); // let the button's CSS color transition settle before capturing
await page.screenshot({ path: "dist/screenshot-00d-chapter.png" });
await page.getByRole("button", { name: "Enter" }).click();

// --- Node 1 ---
await page.waitForSelector("text=The Anatomical Source", { timeout: 5000 });
await page.screenshot({ path: "dist/screenshot-01-node1.png" });

function isFritzPanelButton(text) {
  // innerText() reflects the rendered (CSS text-transform: uppercase) text,
  // not the raw DOM string, so compare case-insensitively.
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
  // Skip the persistent settings gear (aria-label, no text content), the
  // Fritz advice/favor panel (exercised separately, once, below), and any
  // other chrome buttons — only click real story-option buttons.
  const all = await page.locator("button").all();
  for (const b of all) {
    const disabled = await b.isDisabled();
    if (disabled) continue;
    const ariaLabel = await b.getAttribute("aria-label");
    if (ariaLabel === "Settings") continue;
    const text = (await b.innerText()).trim();
    if (!text) continue;
    if (isFritzPanelButton(text)) continue;
    return b;
  }
  return null;
}

// Exercise the collapsed Fritz panel, advice, gossip, and favor mechanics
// once, on the first node screen, before falling into the normal
// click-first-option loop (which skips these buttons so it doesn't get
// stuck on them for 80 iterations).
const sendForFritz = page.getByRole("button", { name: "Send for Fritz" });
if (await sendForFritz.isVisible().catch(() => false)) {
  await sendForFritz.click();
  await page.waitForTimeout(150);
}
const adviceBtn = page.getByRole("button", { name: /Ask Fritz's Advice/ });
if (await adviceBtn.isVisible().catch(() => false)) {
  await adviceBtn.click();
  await page.waitForTimeout(150);
}
const gossipBtn = page.getByRole("button", { name: "Gossip" });
if (await gossipBtn.isVisible().catch(() => false)) {
  await gossipBtn.click();
  await page.waitForTimeout(150);
}
const creatureReportBtn = page.getByRole("button", { name: "Creature Report" });
if (await creatureReportBtn.isVisible().catch(() => false)) {
  await creatureReportBtn.click();
  await page.waitForTimeout(150);
}
const favorToggle = page.getByRole("button", { name: "Fritz's Favor" });
if (await favorToggle.isVisible().catch(() => false)) {
  await favorToggle.click();
  await page.waitForTimeout(150);
  await page.screenshot({ path: "dist/screenshot-01b-fritz-panel.png" });
  const boostBtn = page.getByRole("button", { name: "Boost Voltage" });
  if (await boostBtn.isVisible().catch(() => false)) {
    await boostBtn.click();
    await page.waitForTimeout(150);
  }
}

let storySteps = 0;
let experimentsConducted = 0;
let outcomesSeen = 0;
let sawOutcomeScreenshot = false;
let sawExperimentScreenshot = false;
for (let i = 0; i < 80; i++) {
  // Outcome screen (either a plain choice's outcome, or an experiment's
  // success/failure result) always shows a "Continue" button and nothing
  // else clickable — check for it directly rather than matching its label
  // text, since the label differs by pendingOutcomeKind.
  const continueBtn = page.getByRole("button", { name: "Continue" });
  if (await continueBtn.isVisible().catch(() => false)) {
    outcomesSeen++;
    if (!sawOutcomeScreenshot) {
      await page.screenshot({ path: "dist/screenshot-02b-outcome.png" });
      sawOutcomeScreenshot = true;
    }
    await continueBtn.click();
    await page.waitForTimeout(120);
    continue;
  }
  const turnPage = page.getByText("Turn the Page");
  if (await turnPage.isVisible().catch(() => false)) {
    await turnPage.click();
    await page.waitForTimeout(120);
    continue;
  }
  const playAgain = page.getByText("Begin a New Experiment");
  if (await playAgain.isVisible().catch(() => false)) {
    console.log(
      `Reached an ending after ${storySteps} option clicks + ${experimentsConducted} experiments conducted (${outcomesSeen} outcome screens).`
    );
    await page.screenshot({ path: "dist/screenshot-03-ending.png" });
    break;
  }
  const conductBtn = page.getByRole("button", { name: "Conduct the Experiment" });
  if (await conductBtn.isVisible().catch(() => false)) {
    if (!sawExperimentScreenshot) {
      await page.screenshot({ path: "dist/screenshot-02c-experiment.png" });
      sawExperimentScreenshot = true;
    }
    await conductBtn.click();
    experimentsConducted++;
    // Conducting now opens a ~1.5s suspense phase (button disables, label
    // changes to "Holding Its Breath…") before CONDUCT_EXPERIMENT actually
    // dispatches and the screen moves to Outcome — wait it out rather than
    // the usual short settle delay, or the next loop iteration finds no
    // enabled button at all and breaks early.
    await page.waitForTimeout(1700);
    continue;
  }
  const btn = await clickFirstEnabledOption();
  if (!btn) break;
  await btn.click();
  storySteps++;
  await page.waitForTimeout(120);
  if (storySteps === 1) await page.screenshot({ path: "dist/screenshot-02-midgame.png" });
}

await browser.close();

console.log(`Story option clicks: ${storySteps}`);
console.log(`Experiments conducted: ${experimentsConducted}`);
console.log(`Outcome screens shown: ${outcomesSeen}`);
console.log(`Console/page errors: ${errors.length}`);
if (errors.length) {
  console.log(errors.join("\n"));
  process.exit(1);
}
// Every story-option commitment leads to exactly one Outcome screen:
// directly for a plain choice, or via one intervening Experiment screen +
// Conduct click for a roll option (which is why experimentsConducted is
// tracked but not added here — it does not add extra Outcome screens, it's
// the second half of the roll option's single Outcome). Options now take
// two taps to commit (the first just arms the card — a color change with
// no dispatch — the second, on the same still-first-in-DOM-order button,
// confirms it), so each commit costs 2 of the counted option clicks.
if (outcomesSeen !== storySteps / 2) {
  console.log(`MISMATCH: expected one outcome screen per two option-card taps (${storySteps} taps / 2), saw ${outcomesSeen}`);
  process.exit(1);
}
process.exit(0);
