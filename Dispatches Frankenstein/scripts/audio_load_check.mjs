// Verifies the <audio src="audio/lament.mp3"> element actually resolves and
// buffers over real HTTP (not file://, which resolves relative paths a bit
// too permissively to be a trustworthy stand-in for itch.io's CDN). Also
// confirms music only starts after a genuine click (the itch.io "audio
// starts after first tap" checklist item), not on page load.
import { chromium } from "playwright";

const BASE = process.env.BASE_URL || "http://localhost:8765";

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage({ viewport: { width: 900, height: 1000 } });
const requests = [];
page.on("requestfinished", (req) => {
  if (req.url().includes("lament.mp3")) requests.push({ url: req.url(), method: req.method() });
});
const failures = [];
page.on("requestfailed", (req) => {
  if (req.url().includes("lament.mp3")) failures.push(req.url() + " :: " + (req.failure()?.errorText ?? "?"));
});

await page.goto(BASE + "/index.html");
await page.waitForSelector("text=Begin the Work");

const readyStateBeforeClick = await page.evaluate(() => {
  const el = document.querySelector("audio");
  return el ? el.readyState : -1;
});
const pausedBeforeClick = await page.evaluate(() => {
  const el = document.querySelector("audio");
  return el ? el.paused : null;
});

await page.getByRole("button", { name: "Begin the Work" }).click();
await page.waitForTimeout(500);

const pausedAfterClick = await page.evaluate(() => {
  const el = document.querySelector("audio");
  return el ? el.paused : null;
});
const networkStateAfterClick = await page.evaluate(() => {
  const el = document.querySelector("audio");
  return el ? el.networkState : -1;
});

console.log("audio requests seen:", requests.length, requests);
console.log("audio load failures:", failures.length, failures);
console.log("readyState before any click (expect could be >=1, buffering underway):", readyStateBeforeClick);
console.log("paused before click (expect true — no autoplay before interaction):", pausedBeforeClick);
console.log("paused after 'Begin the Work' click (expect false — plays after first tap):", pausedAfterClick);
console.log("networkState after click (0=EMPTY,1=IDLE,2=LOADING,3=NO_SOURCE):", networkStateAfterClick);

const pass = failures.length === 0 && pausedBeforeClick === true && pausedAfterClick === false && networkStateAfterClick !== 3;
console.log(pass ? "PASS: audio file resolves over HTTP and only starts after a real user gesture." : "FAIL");

await browser.close();
process.exit(pass ? 0 : 1);
