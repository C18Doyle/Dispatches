// Regression test for the Fritz's Favor "Boost Secrecy" fix. The old code
// applied `{ [resource]: 3, secrecy: -2 }` — a duplicate object key when
// resource === "secrecy", so the +3 was silently discarded and the option
// netted a flat -2 (the opposite of what the panel promised). This reads
// the three meter values directly from the DOM before and after clicking
// "Boost Secrecy" and asserts the exact deltas Craig specified: secrecy
// +3, biomass -1, voltage -1.
import { chromium } from "playwright";
import path from "node:path";

const __dirname = "/home/claude/frankenstein-jam";
const filePath = "file://" + path.join(__dirname, "dist", "index.html");

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await (await browser.newContext({ viewport: { width: 900, height: 1100 } })).newPage();
page.setDefaultTimeout(8000);

// Positional, not text-matched: the three <Meter> components render in
// fixed JSX order (voltage, biomass, secrecy) inside one flex-nowrap
// container, and several other badges on this screen also contain the word
// "VOLTAGE"/"SECRECY" (gate requirements, stamp previews), which would make
// a text-based lookup ambiguous.
async function readMeters() {
  const meterDivs = page.locator(".flex.flex-nowrap > div");
  const order = ["voltage", "biomass", "secrecy"];
  const values = {};
  for (let i = 0; i < order.length; i++) {
    const valueText = await meterDivs.nth(i).locator("span").nth(1).innerText();
    values[order[i]] = parseInt(valueText.replace("+", ""), 10);
  }
  return values;
}

await page.goto(filePath);
await page.getByRole("button", { name: "Begin the Work" }).click();
await page.getByRole("button", { name: "Continue" }).click();
await page.waitForSelector("text=To the Castle");
await page.getByRole("button", { name: "Enter" }).click();
await page.waitForSelector("text=The Anatomical Source");

const before = await readMeters();
console.log("Before:", before);

await page.getByRole("button", { name: "Send for Fritz" }).click();
await page.getByRole("button", { name: "Fritz's Favor" }).click();
await page.waitForSelector("text=Boost Secrecy");
await page.getByRole("button", { name: "Boost Secrecy" }).click();
await page.waitForTimeout(200);

const after = await readMeters();
console.log("After:", after);

const deltas = {
  voltage: after.voltage - before.voltage,
  biomass: after.biomass - before.biomass,
  secrecy: after.secrecy - before.secrecy,
};
console.log("Deltas:", deltas);

const expected = { voltage: -1, biomass: -1, secrecy: 3 };
const pass = deltas.voltage === expected.voltage && deltas.biomass === expected.biomass && deltas.secrecy === expected.secrecy;
console.log(pass ? "PASS: Boost Secrecy applies +3 secrecy / -1 biomass / -1 voltage as specified." : "FAIL: deltas do not match the specified fix.");

await browser.close();
process.exit(pass ? 0 : 1);
