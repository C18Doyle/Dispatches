#!/usr/bin/env node
// Steam store screenshots, taken by a bot from the built game (dist/full): the same screens every time, at the store's size, so they can
// be redone whenever the art changes. Steam asks for 1920x1080 (16:9); a phone set at 1080x1920 is taken with --phone.
//   npm run build:nozip && node tools/store-screenshots.mjs [--phone] [--night] [--out=store-shots]
// The bot clicks through the page itself (element.click()), picks the first order unless a step asks for something else, and gives up on
// a shot it cannot reach, saying which. Nothing here is uploaded anywhere.
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFileSync, existsSync, mkdirSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist", "full");
const args = process.argv.slice(2);
const PHONE = args.includes("--phone");
const NIGHT = args.includes("--night");
const OUT = join(ROOT, (args.find((a) => a.startsWith("--out=")) || "--out=store-shots").slice(6));
const VIEW = PHONE ? { width: 1080, height: 1920 } : { width: 1920, height: 1080 };
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".ogg": "audio/ogg", ".opus": "audio/ogg", ".mp3": "audio/mpeg", ".svg": "image/svg+xml" };

if (!existsSync(join(DIST, "index.html"))) {
  console.error("No build in dist/full: run npm run build:nozip first.");
  process.exit(1);
}
mkdirSync(OUT, { recursive: true });
const server = createServer((req, res) => {
  const rel = decodeURIComponent(new URL(req.url, "http://x").pathname).replace(/^\/+/, "") || "index.html";
  const file = join(DIST, rel);
  if (!file.startsWith(DIST) || !existsSync(file)) return void res.writeHead(404).end();
  res.writeHead(200, { "content-type": MIME[extname(file)] || "application/octet-stream" }).end(readFileSync(file));
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const URL_ = `http://127.0.0.1:${server.address().port}/`;

// ---- page helpers, run inside the page ----
const SKIP = String(/^(\W?show|\W?hide|save|home|back|rewind|text size|restart|switch|new campaign|copy|share|download|settings|map|close|pause|resume|skip to|how it works|delete)/i);
async function press(page, pattern) {
  return page.evaluate((src) => {
    const re = new RegExp(src.slice(1, src.lastIndexOf("/")), src.slice(src.lastIndexOf("/") + 1));
    const lab = (b) => (b.getAttribute("aria-label") || b.innerText || "").replace(/\s+/g, " ").replace(/^[^\p{L}\p{N}]+/u, "").trim();
    const b = [...document.querySelectorAll("button")].find((x) => !x.disabled && x.getBoundingClientRect().width && re.test(lab(x)));
    if (!b) return false;
    b.click();
    return true;
  }, String(pattern));
}
/** One step of play: the first order, else a continue-type button. In a battle the staff plans it. Returns false when stuck. */
async function step(page, prefer) {
  return page.evaluate(
    ([skipSrc, preferSrc]) => {
      const skip = new RegExp(skipSrc.slice(1, skipSrc.lastIndexOf("/")), "i");
      const lab = (b) => (b.getAttribute("aria-label") || b.innerText || "").replace(/\s+/g, " ").replace(/^[^\p{L}\p{N}]+/u, "").trim();
      const bs = [...document.querySelectorAll("button")].filter((b) => !b.disabled && b.getBoundingClientRect().width && !skip.test(lab(b)));
      const text = document.body.innerText;
      let pick = null;
      if (/Order of Battle/.test(text)) pick = bs.find((b) => /^Let Your Staff Plan It/i.test(lab(b))) || bs.find((b) => /^(Commit to Battle|Start battle|Continue)/i.test(lab(b)));
      // The battle report plays itself line by line: go straight to the verdict.
      if (!pick && /The Battle Unfolds/.test(text)) pick = [...document.querySelectorAll("button")].find((b) => !b.disabled && /^Skip to the verdict/i.test(lab(b))) || null;
      if (!pick && preferSrc) {
        const re = new RegExp(preferSrc, "i");
        pick = bs.find((b) => re.test(lab(b)));
      }
      if (!pick) {
        const orders = bs.filter((b) => lab(b).length >= 45 && !b.hasAttribute("aria-pressed") && !/Activate to see|diverged/i.test(lab(b)));
        pick = orders[0] || bs.find((b) => /^(continue|next|proceed|begin|start|commit|read|enter|acknowledge|resolve|reveal|germany first|an even hand)/i.test(lab(b))) || null;
      }
      if (!pick) return false;
      pick.click();
      return true;
    },
    [SKIP, prefer || ""]
  );
}
const has = (page, sel) => page.evaluate((s) => !!document.querySelector(s), sel);
const textHas = (page, src) => page.evaluate((s) => new RegExp(s, "i").test(document.body.innerText), src);
async function playUntil(page, test, max = 400, prefer) {
  for (let i = 0; i < max; i++) {
    if (await test()) return true;
    if (!(await step(page, prefer))) return false;
    await page.waitForTimeout(120);
  }
  return test();
}
async function newGame(browser) {
  const ctx = await browser.newContext({ viewport: VIEW, deviceScaleFactor: 1, reducedMotion: "reduce" });
  await ctx.addInitScript(([night]) => {
    try {
      localStorage.setItem("dispatchesWW2_instant_text", "true");
      localStorage.setItem("dispatchesWW2_music", "false");
      localStorage.setItem("dispatchesWW2_night", night ? "1" : "0");
    } catch (e) {
      /* none */
    }
  }, [NIGHT]);
  const page = await ctx.newPage();
  await page.goto(URL_, { waitUntil: "load" });
  await page.waitForTimeout(800);
  return { ctx, page };
}
async function startCommand(page, seal) {
  await press(page, new RegExp("^" + seal));
  await page.waitForTimeout(300);
}
async function enter(page) {
  await press(page, /^Enter the War Room/i);
  await page.waitForTimeout(500);
}
async function shot(page, name, note) {
  await page.evaluate(() => document.fonts && document.fonts.ready);
  await page.waitForTimeout(500);
  const file = join(OUT, `${name}${PHONE ? "-phone" : ""}${NIGHT ? "-night" : ""}.png`);
  await page.screenshot({ path: file, fullPage: false });
  console.log(`ok   ${name}: ${note}`);
}
async function scrollTo(page, sel) {
  await page.evaluate((s) => {
    const el = document.querySelector(s);
    if (el) el.scrollIntoView({ block: "center" });
  }, sel);
  await page.waitForTimeout(300);
}

const browser = await chromium.launch();
const missed = [];
const attempt = async (name, fn) => {
  try {
    if (!(await fn())) missed.push(name);
  } catch (e) {
    missed.push(`${name} (${String(e.message).split("\n")[0].slice(0, 80)})`);
  }
};

await attempt("01-opening", async () => {
  const { ctx, page } = await newGame(browser);
  await shot(page, "01-opening", "the six commands");
  await ctx.close();
  return true;
});
await attempt("02-war-room / 03-briefing / 04-photo / 05-order-of-battle / 08-end", async () => {
  const { ctx, page } = await newGame(browser);
  await startCommand(page, "OKW");
  await shot(page, "02-war-room", "the OKW war room");
  await enter(page);
  await shot(page, "03-briefing", "the first German report");
  const photo = await playUntil(page, () => has(page, 'figure img[src*="photos/"]'), 60);
  if (photo) {
    await scrollTo(page, "figure");
    await shot(page, "04-photo-report", "a report with its archive photograph");
  } else missed.push("04-photo-report");
  const battle = await playUntil(page, () => textHas(page, "Order of Battle[:—] Before Committing"), 200, "Leads to battle planning");
  if (battle) await shot(page, "05-order-of-battle", "the Order of Battle");
  else missed.push("05-order-of-battle");
  const ended = await playUntil(page, () => textHas(page, "Command rank"), 600);
  if (ended) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await shot(page, "08-end-screen", "the end of the war");
  } else missed.push("08-end-screen");
  await ctx.close();
  return true;
});
await attempt("06-pacific-briefing", async () => {
  const { ctx, page } = await newGame(browser);
  await startCommand(page, "IGHQ");
  await enter(page);
  await shot(page, "06-pacific-briefing", "an IGHQ report on the Pacific map");
  await ctx.close();
  return true;
});
await attempt("07-allocation", async () => {
  const { ctx, page } = await newGame(browser);
  await startCommand(page, "JOINT CHIEFS");
  await enter(page);
  const ok = await playUntil(page, () => textHas(page, "ALLOCATION OF EFFORT"), 80);
  if (ok) await shot(page, "07-allocation", "the Joint Chiefs' allocation of effort");
  await ctx.close();
  return ok;
});

await browser.close();
server.close();
console.log(`\nstore screenshots in ${OUT}${missed.length ? `; not reached: ${missed.join(", ")}` : ""}`);
process.exit(missed.length ? 1 : 0);
