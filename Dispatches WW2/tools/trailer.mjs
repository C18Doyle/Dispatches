#!/usr/bin/env node
// A trailer recorded from the built game (dist/full), the same way every time, for the Steam store page: a bot plays the scenes below in a
// real browser at 1920x1080 with motion on, Playwright records each, and ffmpeg cuts the marked moments out, puts the title cards between
// them, lays the opening of Holst's Mars under it (the game's own public-domain recording) and writes one H.264 file.
//   npm run build:nozip && node tools/trailer.mjs [--out=store-shots/trailer] [--no-music] [--no-cards]
// ffmpeg is found on the PATH or through FFMPEG=<path to ffmpeg>. Without it the raw clips and the cut list (cuts.json) are left in the
// output folder. Nothing is uploaded anywhere. The scenes:
//   the title; the six commands; OKW's war room (a command style chosen) and a report typed out, an order given and its outcome;
//   an Order of Battle planned by hand and played out to its verdict; an IGHQ report on the Pacific map; the Joint Chiefs' allocation of
//   effort; the title again.
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFileSync, existsSync, mkdirSync, writeFileSync, rmSync, statSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist", "full");
const args = process.argv.slice(2);
const OUT = join(ROOT, (args.find((a) => a.startsWith("--out=")) || "--out=store-shots/trailer").slice(6));
const MUSIC = !args.includes("--no-music");
const CARDS = !args.includes("--no-cards");
const VIEW = { width: 1920, height: 1080 };
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".opus": "audio/ogg", ".svg": "image/svg+xml" };
if (!existsSync(join(DIST, "index.html"))) {
  console.error("No build in dist/full: run npm run build:nozip first.");
  process.exit(1);
}
rmSync(OUT, { recursive: true, force: true });
mkdirSync(join(OUT, "raw"), { recursive: true });
const server = createServer((req, res) => {
  const rel = decodeURIComponent(new URL(req.url, "http://x").pathname).replace(/^\/+/, "") || "index.html";
  const file = join(DIST, rel);
  if (!file.startsWith(DIST) || !existsSync(file)) return void res.writeHead(404).end();
  res.writeHead(200, { "content-type": MIME[extname(file)] || "application/octet-stream" }).end(readFileSync(file));
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const URL_ = `http://127.0.0.1:${server.address().port}/`;

// ---- helpers (the same reading of the page as tools/store-screenshots.mjs) ----
const SKIP = String(/^(\W?show|\W?hide|save|home|back|rewind|text size|restart|switch|new campaign|copy|share|download|settings|map|close|pause|resume|skip to|how it works|delete)/i);
const lab = "(b) => (b.getAttribute('aria-label') || b.innerText || '').replace(/\\s+/g, ' ').replace(/^[^\\p{L}\\p{N}]+/u, '').trim()";
async function press(page, pattern) {
  return page.evaluate(
    ([src, labSrc]) => {
      const lab = eval(labSrc);
      const re = new RegExp(src.slice(1, src.lastIndexOf("/")), src.slice(src.lastIndexOf("/") + 1));
      const b = [...document.querySelectorAll("button")].find((x) => !x.disabled && x.getBoundingClientRect().width && re.test(lab(x)));
      if (!b) return false;
      b.scrollIntoView({ block: "center" });
      b.click();
      return true;
    },
    [String(pattern), lab]
  );
}
async function step(page, prefer) {
  return page.evaluate(
    ([skipSrc, preferSrc, labSrc]) => {
      const lab = eval(labSrc);
      const skip = new RegExp(skipSrc.slice(1, skipSrc.lastIndexOf("/")), "i");
      const bs = [...document.querySelectorAll("button")].filter((b) => !b.disabled && b.getBoundingClientRect().width && !skip.test(lab(b)));
      let pick = null;
      if (preferSrc) pick = bs.find((b) => new RegExp(preferSrc, "i").test(lab(b)));
      if (!pick) {
        const orders = bs.filter((b) => lab(b).length >= 45 && !b.hasAttribute("aria-pressed") && !/Activate to see|diverged/i.test(lab(b)));
        pick = orders[0] || bs.find((b) => /^(continue|next|proceed|begin|start|commit|read|enter|acknowledge|resolve|reveal|germany first|an even hand|the ask)/i.test(lab(b))) || bs.find((b) => /^\d/.test(b.getAttribute("data-hotkey") || "")) || null;
      }
      if (!pick) return false;
      pick.click();
      return true;
    },
    [SKIP, prefer || "", lab]
  );
}
const textHas = (page, src) => page.evaluate((s) => new RegExp(s, "i").test(document.body.innerText), src);
async function playUntil(page, test, max = 300, prefer) {
  for (let i = 0; i < max; i++) {
    if (await test()) return true;
    if (!(await step(page, prefer))) return false;
    await page.waitForTimeout(100);
  }
  return test();
}
async function setInstant(page, on) {
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  const now = await page.evaluate(() => document.querySelector('[aria-labelledby="menu-setting-instant-label"]')?.getAttribute("aria-pressed"));
  if (now != null && (now === "true") !== on) await page.click('[aria-labelledby="menu-setting-instant-label"]');
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
}

const browser = await chromium.launch();
const clips = [];
/** A recorded take: `fn(page, mark)` plays it; mark(name) starts a cut and mark(null) ends it. */
async function take(name, fn, { instant = true } = {}) {
  const ctx = await browser.newContext({ viewport: VIEW, deviceScaleFactor: 1, recordVideo: { dir: join(OUT, "raw"), size: VIEW } });
  await ctx.addInitScript((instantText) => {
    try {
      localStorage.setItem("dispatchesWW2_instant_text", instantText ? "true" : "false");
      localStorage.setItem("dispatchesWW2_music", "false");
      localStorage.setItem("dispatchesWW2_staff_plans", "0");
      // The page drawn larger, so the paper fills the frame and reads at a store page's size (zoom keeps the text sharp).
      document.addEventListener("DOMContentLoaded", () => (document.documentElement.style.zoom = "1.6"));
    } catch (e) {
      /* none */
    }
  }, instant);
  const page = await ctx.newPage();
  const t0 = Date.now();
  const cuts = [];
  let open = null;
  const mark = (label) => {
    const at = (Date.now() - t0) / 1000;
    if (open) cuts.push({ ...open, to: at });
    open = label ? { label, from: at } : null;
  };
  let ok = true;
  try {
    await page.goto(URL_, { waitUntil: "load" });
    await page.evaluate(() => document.fonts && document.fonts.ready);
    await page.waitForTimeout(700);
    ok = (await fn(page, mark)) !== false;
  } catch (e) {
    ok = false;
    console.log(`     ${name}: ${String(e.message).split("\n")[0].slice(0, 100)}`);
  }
  mark(null);
  // A moment more, so the last marked frames are written before the recording stops.
  await page.waitForTimeout(1200);
  const video = page.video();
  // The recording ends when the context closes but starts a moment after the page is made, by a different amount each time: the cut
  // measures that from the end (closeAt less the clip's length).
  const closeAt = (Date.now() - t0) / 1000;
  await ctx.close();
  const path = video ? await video.path() : null;
  clips.push({ name, path, cuts, closeAt });
  console.log(`${ok && cuts.length ? "ok  " : "MISS"} ${name}: ${cuts.map((c) => `${c.label} ${(c.to - c.from).toFixed(1)} s`).join(", ") || "nothing cut"}`);
}
/** A title card, recorded in the game's own page so it has the game's typefaces. */
async function card(name, line1, line2, seconds = 3) {
  if (!CARDS) return;
  await take(name, async (page, mark) => {
    await page.evaluate(
      ([a, b]) => {
        document.body.innerHTML = "";
        const d = document.createElement("div");
        d.style.cssText = "position:fixed;inset:0;background:#000;color:#f3efe6;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 160px;opacity:0;transform:scale(0.985);transition:opacity 900ms ease-out, transform 4000ms linear";
        d.innerHTML = `<div style="font-family:Oswald,sans-serif;font-weight:700;font-size:96px;letter-spacing:0.04em;text-transform:uppercase">${a}</div>` + (b ? `<div style="font-family:'IBM Plex Mono',monospace;font-size:34px;margin-top:28px;letter-spacing:0.08em">${b}</div>` : "");
        document.body.appendChild(d);
        // A slow fade and drift: it looks better, and the recorder writes frames only while something on the page changes.
        requestAnimationFrame(() => requestAnimationFrame(() => ((d.style.opacity = "1"), (d.style.transform = "scale(1)"))));
      },
      [line1, line2 || ""]
    );
    await page.waitForTimeout(150);
    mark(name);
    await page.waitForTimeout(seconds * 1000);
  });
}

// ---- the scenes ----
await card("title", "Dispatches WW2", "The Second World War from six high commands", 3.5);
await take("opening", async (page, mark) => {
  mark("opening");
  await page.waitForTimeout(2200);
  for (let i = 0; i < 6; i++) {
    await page.mouse.wheel(0, 220);
    await page.waitForTimeout(350);
  }
  await page.waitForTimeout(600);
});
await card("card-record", "Every report a decision", "What the record did, and the orders it did not give", 3);
await take("okw", async (page, mark) => {
  await press(page, /^OKW/);
  await page.waitForTimeout(600);
  mark("war room");
  await page.waitForTimeout(1500);
  await press(page, /^Audacious/i);
  await page.waitForTimeout(1500);
  await press(page, /^Enter the War Room/i);
  await page.waitForTimeout(400);
  mark("report");
  await page.waitForTimeout(9000);
  mark(null);
  if (!(await step(page))) return false;
  await page.waitForTimeout(600);
  mark("outcome");
  await page.waitForTimeout(4000);
}, { instant: false });
await card("card-battle", "Plan the battles", "Commit the effort, then watch it play out", 3);
await take("battle", async (page, mark) => {
  await press(page, /^OKW/);
  await page.waitForTimeout(400);
  await press(page, /^Enter the War Room/i);
  await page.waitForTimeout(400);
  const at = await playUntil(page, () => textHas(page, "Order of Battle[:—] Before Committing"), 250, "Leads to battle planning");
  if (!at) return false;
  await setInstant(page, false);
  await page.evaluate(() => window.scrollTo(0, 0));
  mark("order of battle");
  await page.waitForTimeout(1500);
  // Place the effort by hand, a chit at a time, round the arms.
  for (let k = 0; k < 8; k++) {
    const placed = await page.evaluate((k) => {
      const adds = [...document.querySelectorAll('button[aria-label^="Add effort to"]')].filter((b) => !b.disabled);
      if (!adds.length) return false;
      const b = adds[k % adds.length];
      b.scrollIntoView({ block: "center" });
      b.click();
      return true;
    }, k);
    if (!placed) break;
    await page.waitForTimeout(350);
  }
  // The tactical approach (a toggle, aria-pressed): the first one that is not a timing or an emphasis.
  await page.evaluate(() => {
    const not = /^(✓ )?No particular emphasis|favors|At the planned hour|Wait a day|Go in before the plan|Wait for the full picture|Instant|Show|Hide/i;
    const b = [...document.querySelectorAll('button[aria-pressed="false"]')].find((x) => !x.disabled && x.getBoundingClientRect().width && !not.test((x.innerText || "").trim()));
    if (b) {
      b.scrollIntoView({ block: "center" });
      b.click();
    }
  });
  await page.waitForTimeout(1200);
  mark(null);
  if (!(await press(page, /^Commit to Battle/i))) return false;
  await page.waitForTimeout(500);
  await press(page, /^Start battle/i);
  await page.waitForTimeout(300);
  await page.evaluate(() => window.scrollTo(0, 0));
  // One poll of the battle: a field decision (its panel takes the focus) is answered with its first order; "skip" also presses Skip to the
  // verdict. Returns "running", or "done" once neither the skip button nor a decision is left.
  const poll = (skip) =>
    page.evaluate((skip) => {
      const bs = [...document.querySelectorAll("button")].filter((x) => !x.disabled && x.getBoundingClientRect().width);
      const f = document.activeElement;
      const panel = f && f !== document.body && !/^H[1-3]$/.test(f.tagName) ? f : null;
      const decision = panel ? [...panel.querySelectorAll("button")].find((x) => !x.disabled && x.getBoundingClientRect().width) : null;
      if (decision) return decision.click(), "running";
      const skipButton = bs.find((b) => /^Skip to the verdict/i.test((b.innerText || "").trim()));
      if (!skipButton) return "done";
      if (skip) skipButton.click();
      return "running";
    }, skip);
  mark("battle");
  for (let i = 0; i < 35; i++) {
    if ((await poll(false)) === "done") break;
    await page.waitForTimeout(400);
  }
  mark(null);
  let quiet = 0;
  for (let i = 0; i < 60 && quiet < 2; i++) {
    quiet = (await poll(true)) === "done" ? quiet + 1 : 0;
    await page.waitForTimeout(300);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);
  mark("verdict");
  await page.waitForTimeout(4000);
  return quiet >= 2;
});
await card("card-theatres", "Two theatres", "Europe and the Pacific, on maps that follow your war", 3);
await take("pacific", async (page, mark) => {
  await press(page, /^IGHQ/);
  await page.waitForTimeout(400);
  await press(page, /^Enter the War Room/i);
  await page.waitForTimeout(600);
  const scrolled = await page.evaluate(() => {
    const m = document.querySelector("svg[role='img'], figure svg, svg");
    if (!m) return false;
    m.scrollIntoView({ block: "center" });
    return true;
  });
  await page.waitForTimeout(800);
  mark("pacific map");
  await page.waitForTimeout(5000);
  return scrolled;
});
await take("allocation", async (page, mark) => {
  await press(page, /^JOINT CHIEFS/);
  await page.waitForTimeout(400);
  await press(page, /^Enter the War Room/i);
  await page.waitForTimeout(400);
  if (!(await playUntil(page, () => textHas(page, "ALLOCATION OF EFFORT"), 80))) return false;
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  mark("allocation");
  await page.waitForTimeout(4500);
});
await card("end", "Dispatches WW2", "", 3);

await browser.close();
server.close();
writeFileSync(join(OUT, "cuts.json"), JSON.stringify(clips, null, 2));

// ---- the cut ----
const FFMPEG = process.env.FFMPEG || "ffmpeg";
let haveFfmpeg = true;
try {
  execFileSync(FFMPEG, ["-version"], { stdio: "ignore" });
} catch (e) {
  haveFfmpeg = false;
}
if (!haveFfmpeg) {
  console.log(`\nNo ffmpeg (set FFMPEG=<path>): the raw clips and cuts.json are in ${OUT}`);
  process.exit(0);
}
const FFPROBE = FFMPEG.replace(/ffmpeg(\.exe)?$/i, (m) => m.replace("ffmpeg", "ffprobe"));
const lengthOf = (file) => Number(execFileSync(FFPROBE, ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file]).toString().trim()) || 0;
const parts = [];
let n = 0;
for (const c of clips) {
  if (!c.path || !existsSync(c.path)) continue;
  // The recording starts a moment after the page is made, so a mark can run a little past its clip's end: cut to what is there.
  const clipLength = lengthOf(c.path);
  const shift = Math.max(0, (c.closeAt || clipLength) - clipLength);
  for (const marked of c.cuts) {
    const cut = { ...marked, from: Math.max(0, marked.from - shift), to: marked.to - shift };
    const to = Math.min(cut.to, clipLength - 0.05);
    if (to - cut.from < 0.5) {
      console.log(`     ${c.name}: ${cut.label} is outside the recording and is left out`);
      continue;
    }
    const d = to - cut.from;
    const out = join(OUT, `part-${String(n++).padStart(2, "0")}.mp4`);
    const fade = Math.min(0.35, d / 4);
    execFileSync(FFMPEG, ["-y", "-loglevel", "error", "-ss", cut.from.toFixed(2), "-t", d.toFixed(2), "-i", c.path, "-vf", `fps=30,scale=1920:1080,format=yuv420p,fade=t=in:st=0:d=${fade},fade=t=out:st=${(d - fade).toFixed(2)}:d=${fade}`, "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "18", out]);
    parts.push(out);
  }
}
const list = join(OUT, "parts.txt");
writeFileSync(list, parts.map((p) => `file '${p.replace(/\\/g, "/")}'`).join("\n") + "\n");
const silent = join(OUT, "trailer-silent.mp4");
execFileSync(FFMPEG, ["-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", list, "-c", "copy", silent]);
const final = join(OUT, "trailer.mp4");
if (MUSIC) {
  const length = lengthOf(silent) || 60;
  execFileSync(FFMPEG, ["-y", "-loglevel", "error", "-i", silent, "-i", join(ROOT, "assets/music/menu-mars.opus"), "-filter_complex", `[1:a]atrim=0:${length.toFixed(2)},afade=t=in:st=0:d=1,afade=t=out:st=${Math.max(0, length - 3).toFixed(2)}:d=3,loudnorm=I=-16:TP=-1.5[a]`, "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", final]);
} else {
  execFileSync(FFMPEG, ["-y", "-loglevel", "error", "-i", silent, "-c", "copy", final]);
}
console.log(`\ntrailer: ${final} (${(statSync(final).size / 1e6).toFixed(1)} MB, ${parts.length} cuts${MUSIC ? ", with Mars" : ""})`);
