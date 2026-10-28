// check_layout.mjs: layout problems found by looking at the real pages, not the markup. For both seats, in all four looks, at phone (375x812) and desktop (1280x800) widths, it
// plays the built game (dist/index.html) in Chromium through every kind of screen (the title, How To, Settings, the difficulty card, the prologue, scenes with the adviser's
// panel and the map open, ventures, outcomes, the newspapers and letters, the ending, the ledger) and on each one checks:
//   - nothing makes the page scroll sideways, and no text or control sticks out past the edge of the screen
//   - every control is big enough to tap (MIN_TAP pixels each way, 24 being the least WCAG 2.2 allows; the game asks for 44, the size Apple's guidelines set) and none sits on top of another
//   - no text is cut off by a box that hides its overflow (unless it is meant to end in an ellipsis)
//   - the settings button does not sit on top of words at the top of the page
//   - the page logs no error
//   node scripts/check_layout.mjs                 everything (build first: npm run build)
//   node scripts/check_layout.mjs --quick         one look (the seat's own) at both widths
//   MIN_TAP=48 node scripts/check_layout.mjs --quick    try a stricter size
//   SHOTS=1 node scripts/check_layout.mjs         also save a picture of each screen to tests/layout-shots/ (gitignored)
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";

const MIN_TAP = Number(process.env.MIN_TAP ?? 44);
const quick = process.argv.includes("--quick");
const SHOTS = process.env.SHOTS === "1";
const dist = join("dist", "index.html");
if (!existsSync(dist)) {
  console.error("No dist/index.html: run npm run build first.");
  process.exit(1);
}

const labels = JSON.parse(readFileSync("src/labels.json", "utf8"));
const uiOf = (seat) => JSON.parse(readFileSync(`src/content/${seat}/ui.json`, "utf8"));
const themes = JSON.parse(readFileSync("src/themes.json", "utf8")).themes.map((t) => t.id);
const SEATS = ["dracula", "mina"];
const VIEWPORTS = [
  { label: "phone", width: 375, height: 812 },
  { label: "desktop", width: 1280, height: 800 },
];

/** Runs in the page: every layout problem on the current screen. */
function audit({ minTap }) {
  const problems = [];
  const vw = document.documentElement.clientWidth;
  const name = (el) => {
    const t = (el.getAttribute("aria-label") || el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 40);
    return `<${el.tagName.toLowerCase()}${el.className && typeof el.className === "string" ? "." + el.className.split(" ")[0] : ""}> "${t}"`;
  };
  const shown = (el) => {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || Number(cs.opacity) === 0) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  if (document.documentElement.scrollWidth > vw + 1) problems.push(`the page scrolls sideways (${document.documentElement.scrollWidth}px in ${vw}px)`);

  const all = [...document.querySelectorAll("main *")].filter((el) => !el.closest("svg") && shown(el));
  // text sticking out of the screen
  for (const el of all) {
    const r = el.getBoundingClientRect();
    const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (hasText && (r.right > vw + 1 || r.left < -1)) problems.push(`text past the edge: ${name(el)} (${Math.round(r.left)} to ${Math.round(r.right)} of ${vw})`);
  }
  // controls
  const controls = all.filter((el) => el.matches("button, a[href], input, select, textarea, [role=radio], [role=button]") && !el.disabled);
  for (const el of controls) {
    const r = el.getBoundingClientRect();
    if (Math.min(r.width, r.height) < minTap) problems.push(`too small to tap (${Math.round(r.width)}x${Math.round(r.height)}): ${name(el)}`);
    if (r.right > vw + 1 || r.left < -1) problems.push(`control past the edge: ${name(el)}`);
  }
  for (let i = 0; i < controls.length; i++)
    for (let j = i + 1; j < controls.length; j++) {
      const a = controls[i];
      const b = controls[j];
      if (a.contains(b) || b.contains(a)) continue;
      const ra = a.getBoundingClientRect();
      const rb = b.getBoundingClientRect();
      const w = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left);
      const h = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top);
      if (w > 4 && h > 4) problems.push(`controls overlap: ${name(a)} and ${name(b)}`);
    }
  // text cut off by a box that hides overflow
  for (const el of all) {
    const cs = getComputedStyle(el);
    if (cs.overflowX === "hidden" && cs.textOverflow !== "ellipsis" && el.scrollWidth > el.clientWidth + 1 && el.clientWidth > 0 && [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()))
      problems.push(`text cut off: ${name(el)}`);
  }
  // the settings button over words
  const gear = document.querySelector('button[aria-label="Settings"]');
  if (gear && window.scrollY === 0) {
    const g = gear.getBoundingClientRect();
    const walker = document.createTreeWalker(document.querySelector("main"), NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const el = n.parentElement;
      if (!n.textContent.trim() || !el || gear.contains(el) || el.closest("svg") || !shown(el)) continue;
      const range = document.createRange();
      range.selectNodeContents(n);
      for (const r of range.getClientRects()) {
        const w = Math.min(r.right, g.right) - Math.max(r.left, g.left);
        const h = Math.min(r.bottom, g.bottom) - Math.max(r.top, g.top);
        if (w > 2 && h > 2) {
          problems.push(`the settings button sits on words: "${n.textContent.trim().slice(0, 30)}"`);
          return problems;
        }
      }
    }
  }
  return problems;
}

/** What kind of screen is showing, from the buttons on it. */
async function kindOf(page) {
  return page.evaluate((l) => {
    const texts = [...document.querySelectorAll("main button:not([disabled]), main a")].map((b) => (b.textContent || "").replace(/\s+/g, " ").trim());
    const has = (s) => texts.some((t) => t.startsWith(s));
    const body = document.querySelector("main")?.innerText ?? "";
    if (document.querySelector("main button.group")) return "scene";
    if (has(l.takeChance) || has(l.waiting)) return "venture";
    if (has(l.turnPage)) return "paper";
    if (has(l.copySummary)) return "ending";
    if (has(l.enter)) return "difficulty";
    if (has(l.continue)) return body.includes(l.whatChanged) || /Venture|Outcome/.test(body.slice(0, 80)) ? "outcome" : "prologue";
    if (has(l.howTo)) return "menu";
    return "other";
  }, labels);
}

async function run(browser, seat, theme, vp) {
  const found = [];
  const seen = new Map();
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1 });
  await context.addInitScript(
    ([seatId, themeId]) => {
      try {
        localStorage.setItem("dispatches_dracula_seat", seatId);
        localStorage.setItem(`${seatId}_theme`, themeId);
        localStorage.setItem(`${seatId}_settings`, JSON.stringify({ fontSize: "medium", musicEnabled: false, musicVolume: 0, sfxEnabled: false, sfxVolume: 0 }));
      } catch {
        /* nothing to set */
      }
    },
    [seat, theme],
  );
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  page.on("console", (m) => {
    if (m.type() === "error" && !/AudioContext|autoplay|favicon|Failed to load resource/i.test(m.text())) errors.push("console.error: " + m.text());
  });
  await page.goto(pathToFileURL(dist).href, { waitUntil: "load" });
  await page.waitForTimeout(300);

  let shot = 0;
  const check = async (kind) => {
    const n = (seen.get(kind) ?? 0) + 1;
    seen.set(kind, n);
    if (n > 3) return;
    for (const p of await page.evaluate(audit, { minTap: MIN_TAP })) found.push(`${seat}/${theme}/${vp.label} on the ${kind} screen: ${p}`);
    if (SHOTS) {
      mkdirSync("tests/layout-shots", { recursive: true });
      await page.screenshot({ path: `tests/layout-shots/${seat}-${theme}-${vp.label}-${String(++shot).padStart(2, "0")}-${kind}.png` });
    }
  };
  const click = async (re, nth = 0) => {
    const b = page.locator("main button:not([disabled]), main a", { hasText: re }).nth(nth);
    if ((await b.count()) === 0) return false;
    await b.click({ timeout: 5000 });
    await page.waitForTimeout(60);
    return true;
  };
  const starts = (s) => new RegExp("^\\s*" + s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

  // the title, How To and Settings
  await check("menu");
  if (await click(starts(labels.howTo))) {
    await check("how to");
    await click(starts(labels.back));
  }
  if (await click(starts(labels.settings))) {
    await check("settings");
    await click(starts(labels.close));
  }
  // begin: the first button on the title page that is not one of the small ones is the seat's own "begin"
  await page.locator("main button.btn-gothic").first().click();
  await page.waitForTimeout(100);

  let openedPanel = false;
  for (let step = 0; step < 160; step++) {
    const kind = await kindOf(page);
    if (kind === "ending") {
      await check("ending");
      // a new run: the title page then offers the ledger
      if (await click(starts(uiOf(seat).endText.newRun))) {
        await check("menu after an ending");
        if (await click(starts(labels.ledger))) await check("ledger");
      }
      break;
    }
    await check(kind);
    if (kind === "scene" && !openedPanel) {
      openedPanel = true;
      // the map and the adviser's panel
      if (await click(starts(labels.map))) await check("scene with the map open");
      const panel = page.locator("main button", { hasText: starts(uiOf(seat).adviser.openLabel) }).first();
      if ((await panel.count()) > 0) {
        await panel.click();
        await check("scene with the adviser's panel open");
      }
    }
    if (kind === "scene") {
      const options = page.locator("main button.group:not([disabled])");
      const count = await options.count();
      if (!count) break;
      const pick = options.nth(step % count);
      await pick.click({ timeout: 5000 });
      await page.waitForTimeout(40);
      // the second tap confirms; if the first already moved the story on there is nothing left to tap
      await pick.click({ timeout: 1500 }).catch(() => {});
    } else if (kind === "venture") await click(starts(labels.takeChance));
    else if (kind === "paper") await click(starts(labels.turnPage));
    else if (kind === "difficulty") await click(starts(labels.enter));
    else if (kind === "prologue" || kind === "outcome") await click(starts(labels.continue));
    else break;
    await page.waitForTimeout(kind === "venture" ? 1900 : 60);
  }
  for (const e of errors) found.push(`${seat}/${theme}/${vp.label}: ${e}`);
  await context.close();
  return { found, kinds: [...seen.keys()] };
}

const browser = await chromium.launch();
let problems = [];
const kindsSeen = new Set();
const started = Date.now();
for (const seat of SEATS) {
  const lookList = quick ? [seat === "mina" ? "journal" : "blood"] : themes;
  for (const theme of lookList)
    for (const vp of VIEWPORTS) {
      const r = await run(browser, seat, theme, vp);
      problems = problems.concat(r.found);
      r.kinds.forEach((k) => kindsSeen.add(k));
      console.log(`${r.found.length ? "!!" : "ok"} ${seat} / ${theme} / ${vp.label}: ${r.kinds.length} kinds of screen, ${r.found.length} problem(s)`);
    }
}
await browser.close();

// the same complaint on many screens is one problem: say it once, with how often
const counted = new Map();
for (const p of problems) {
  const key = p.replace(/^[^:]*? on the [^:]*? screen: /, "").replace(/^[^:]*?: /, "");
  counted.set(key, (counted.get(key) ?? []).concat(p.split(" on the ")[0]));
}
if (counted.size) {
  console.error("");
  for (const [what, where] of counted) console.error(`  ${what}\n      (${where.length} times, first at ${where[0]})`);
  console.error(`\nFAIL: ${counted.size} kind(s) of layout problem. Fix the screens above, or raise MIN_TAP's allowance with a reason.`);
  process.exit(1);
}
console.log(`\nLayout check passed: ${kindsSeen.size} kinds of screen (${[...kindsSeen].join(", ")}) in ${Math.round((Date.now() - started) / 1000)} s.`);
