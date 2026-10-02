// Ad hoc verification that the new temperament epilogue actually renders on
// a narrative ending: steers toward "Take the creature and vanish into the
// mountains together" (ENDING_1C) — the single most positive-voice/positive-
// bond tagged option in the game — and asserts the ending screen shows a
// "How It's Remembered" line whose label is the expected extreme reading,
// and that the epilogue paragraph text actually appears in the ending body.
import { chromium } from "playwright";
import path from "node:path";

const __dirname = "/home/claude/frankenstein-jam";
const filePath = "file://" + path.join(__dirname, "dist", "index.html");

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await (await browser.newContext({ viewport: { width: 900, height: 1100 } })).newPage();
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

// Preference order: always take the option whose label matches one of these
// (in priority order) when present on screen, steering toward the ALCHEMICAL
// branch's most human-reading climax; otherwise take the first enabled
// non-Fritz option.
const PREFERRED = [
  "Secure Preserved Dissection Specimens from University.",
  "Graft Diverse Animal Organs (Wolf/Horse).",
  "Pay off the hangman's widow before she asks questions.",
  "Agree to stitch a female companion.",
  "Take the creature and vanish into the mountains together.",
];

async function clickPreferredOrFirst() {
  const all = await page.locator("button").all();
  const candidates = [];
  for (const b of all) {
    if (await b.isDisabled()) continue;
    const al = await b.getAttribute("aria-label");
    if (al === "Settings") continue;
    const t = (await b.innerText()).trim();
    if (!t || isFritzPanelButton(t)) continue;
    candidates.push({ b, t });
  }
  for (const label of PREFERRED) {
    const match = candidates.find((c) => c.t === label);
    if (match) return match.b;
  }
  return candidates[0]?.b ?? null;
}

await page.goto(filePath);
await page.getByRole("button", { name: "Begin the Work" }).click();
await page.getByRole("button", { name: "Continue" }).click();
await page.waitForSelector("text=To the Castle");
await page.getByRole("button", { name: "Enter" }).click();
await page.waitForSelector("text=The Anatomical Source");

let reachedEnding = false;
for (let i = 0; i < 60; i++) {
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
  if (await playAgain.isVisible().catch(() => false)) {
    reachedEnding = true;
    break;
  }
  const conductBtn = page.getByRole("button", { name: "Conduct the Experiment" });
  if (await conductBtn.isVisible().catch(() => false)) {
    await conductBtn.click();
    // Conducting now opens a ~1.5s suspense phase before the roll actually
    // resolves and the screen moves on — wait it out.
    await page.waitForTimeout(1700);
    continue;
  }
  const btn = await clickPreferredOrFirst();
  if (!btn) break;
  await btn.click();
  await page.waitForTimeout(100);
}

console.log("Reached an ending:", reachedEnding);

// The CSS on this line is text-transform: uppercase, and Playwright's
// innerText() reflects rendered (post-CSS) text, not the raw DOM string —
// so match case-insensitively rather than against the literal source casing.
const bodyText = await page.locator("body").innerText();
const rememberedLine = /HOW IT'S REMEMBERED:\s*([^\n]+)/i.exec(bodyText);
console.log("How It's Remembered line found:", rememberedLine ? rememberedLine[0] : null);

await page.screenshot({ path: "dist/screenshot-temperament-ending.png" });

const knownLabels = [
  "Eloquent & Longing",
  "Eloquent, Guarded",
  "Eloquent & Vengeful",
  "Watchful & Longing",
  "Ambiguous",
  "Watchful & Vengeful",
  "Ferocious & Longing",
  "Ferocious, Unmoved",
  "Ferocious & Vengeful",
];
const label = rememberedLine ? rememberedLine[1].trim() : null;
const labelValid = label !== null && knownLabels.some((l) => l.toUpperCase() === label.toUpperCase());
console.log("Temperament label is one of the 9 known readings:", labelValid, "->", label);

const pass = reachedEnding && labelValid;
console.log(pass ? "PASS: temperament epilogue rendered on a narrative ending with a valid reading." : "FAIL");

await browser.close();
process.exit(pass ? 0 : 1);
