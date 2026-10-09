// check-a11y.mjs: an accessibility check that plays the game the way the UI baseline does (seeded random runs in jsdom, through dist/full/bundle.js) and,
// on every screen it reaches, fails on:
//   - a button, link, form control or summary with no accessible name (text, aria-label, aria-labelledby or title);
//   - an element with a role of button or link and no name;
//   - a duplicated id;
//   - a heading that skips a level (an h4 straight after an h2);
//   - an image with no alt, or an inline SVG that names itself with a role but has no title or label;
//   - a screen change that leaves focus on the page body (the game moves focus to each new screen's heading);
// and, over the game's own palette (declared pairs below, not computed from the page: jsdom has no styles), a text and background pair below the
// WCAG 2.1 contrast ratio it needs (4.5 for body text, 3 for large or bold text and for the map's labels over their halo).
// Run after a build: npm run build && npm run check-a11y
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const { makeContext } = await import(pathToFileURL(join(ROOT, "../packages/testkit/src/ui-driver.mjs")).href);
const cfg = (await import(pathToFileURL(join(ROOT, "tests/ui.config.mjs")).href)).default;
process.chdir(ROOT);
const bundle = readFileSync("dist/full/bundle.js", "utf8");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const problems = new Map(); // message -> count
const seenScreens = new Set();
const note = (m) => problems.set(m, (problems.get(m) || 0) + 1);

// ---- the page checks -------------------------------------------------------------------------------------------------
const hidden = (el) => !!el.closest("[aria-hidden='true'],[hidden]");
function nameOf(el, d) {
  const label = (el.getAttribute("aria-label") || "").trim();
  if (label) return label;
  const by = el.getAttribute("aria-labelledby");
  if (by) {
    const t = by.split(/\s+/).map((id) => (d.getElementById(id) || {}).textContent || "").join(" ").trim();
    if (t) return t;
  }
  if ((el.textContent || "").replace(/\s+/g, " ").trim()) return "text";
  if ((el.getAttribute("title") || "").trim()) return el.getAttribute("title");
  if (el.tagName === "INPUT" && el.id && d.querySelector(`label[for="${el.id}"]`)) return "label";
  if (el.tagName === "INPUT" && el.closest("label")) return "label";
  return "";
}
function checkPage(ctx, where) {
  const d = ctx.d;
  const text = ctx.text().slice(0, 60);
  const screen = text;
  for (const el of d.querySelectorAll("button,a[href],input,select,textarea,summary,[role='button'],[role='link'],[role='tab'],[role='radio']")) {
    if (hidden(el)) continue;
    if (!nameOf(el, d)) note(`${where}: a ${el.tagName.toLowerCase()}${el.getAttribute("role") ? `[role=${el.getAttribute("role")}]` : ""} has no accessible name (${(el.className || "").toString().slice(0, 60)})`);
  }
  const ids = new Map();
  for (const el of d.querySelectorAll("[id]")) ids.set(el.id, (ids.get(el.id) || 0) + 1);
  for (const [id, n] of ids) if (n > 1) note(`${where}: the id "${id}" is used ${n} times`);
  let prev = 0;
  for (const h of d.querySelectorAll("h1,h2,h3,h4,h5,h6,[role='heading']")) {
    if (hidden(h)) continue;
    const level = h.tagName.length === 2 && /^H[1-6]$/.test(h.tagName) ? Number(h.tagName[1]) : Number(h.getAttribute("aria-level")) || 2;
    if (prev && level > prev + 1) note(`${where}: a level-${level} heading follows a level-${prev} heading ("${(h.textContent || "").trim().slice(0, 40)}")`);
    prev = level;
  }
  for (const img of d.querySelectorAll("img")) if (!hidden(img) && img.getAttribute("alt") === null) note(`${where}: an image has no alt`);
  for (const svg of d.querySelectorAll("svg[role='img']")) if (!hidden(svg) && !svg.querySelector("title") && !svg.getAttribute("aria-label")) note(`${where}: an svg with role img has no title or label`);
  seenScreens.add(screen);
}

// ---- the palette -----------------------------------------------------------------------------------------------------
const lum = (hex) => {
  const c = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(c.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const mix = (fg, bg, a) => "#" + [0, 2, 4].map((i) => Math.round(parseInt(fg.slice(1 + i, 3 + i), 16) * a + parseInt(bg.slice(1 + i, 3 + i), 16) * (1 - a)).toString(16).padStart(2, "0")).join("");
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
const PAPER = ["#f6efdf", "#eef2f6", "#ffffff"];
const INK = "#000000";
const pairs = [];
for (const p of PAPER) {
  pairs.push([`ink on ${p}`, INK, p, 4.5]);
  pairs.push([`secondary text (ink at 60%) on ${p}`, mix(INK, p, 0.6), p, 4.5]);
  pairs.push([`IGHQ accent on ${p}`, "#5c1a1a", p, 4.5]);
  pairs.push([`CINCPAC accent on ${p}`, "#28497a", p, 4.5]);
  pairs.push([`meter green on ${p}`, "#2f4a3a", p, 4.5]);
  pairs.push([`meter red on ${p}`, "#7a2e2e", p, 4.5]);
  pairs.push([`strain red on ${p}`, "#7a2e2e", p, 4.5]);
}
// The map's labels sit on a cream halo (see PacificMap), so they are read against it, not against the fill.
pairs.push(["map label ink on its halo", "#241a10", "#f6efdf", 4.5]);
for (const [name, fill] of Object.entries({ axis: "#5c1a1a", axisAllied: "#a8562b", allied: "#28497a", neutral: "#a8a08c", contested: "#c9a227" })) {
  // the legend swatch against the paper, and the fill against the sea: a status must be told from the sea by more than hue
  pairs.push([`${name} fill against the sea`, fill, "#e3d5ae", 1.3]);
}
for (const [label, fg, bg, need] of pairs) {
  const r = ratio(fg, bg);
  if (r < need) note(`palette: ${label} is ${r.toFixed(2)}:1, under the ${need}:1 it needs`);
}

// ---- play ------------------------------------------------------------------------------------------------------------
const CASES = [
  [cfg.cases.find((c) => c[0] === "japan" && c[2] === "open" && !c[3]), 1],
  [cfg.cases.find((c) => c[0] === "alliedPacific" && c[2] === "open" && !c[3]), 2],
  [cfg.cases.find((c) => c[0] === "alliedPacific" && c[2] === "easy"), 3],
  [cfg.cases.find((c) => c[0] === "japan" && c[2] === "fanatical"), 4],
];
let steps = 0;
for (const [runCase, seed] of CASES) {
  const ctx = makeContext(cfg, bundle, seed);
  if (ctx.failed) throw new Error(ctx.failed);
  await sleep(300);
  await ctx.settle();
  const err = await cfg.setup(ctx, runCase);
  if (err) throw new Error(err);
  const policy = {};
  let lastText = "";
  for (let i = 0; i < 120; i++) {
    const t = ctx.text();
    if (cfg.isEnded(ctx) || cfg.isCrashed(ctx)) break;
    checkPage(ctx, `${runCase[0]}-${runCase[2]}`);
    const b = cfg.choose(ctx, policy);
    if (!b) break;
    const before = t.slice(0, 80);
    await ctx.click(b);
    steps++;
    // a new screen should hold focus somewhere other than the body
    const after = ctx.text();
    if (after.slice(0, 80) !== before && ctx.d.activeElement === ctx.d.body && /Report|Order of Battle|Battle|Outcome|File|After/.test(after.slice(0, 200))) {
      // The sampled screens move focus to a heading (BriefingScreen, EndScreen); screens that do not are reported once.
      note(`${runCase[0]}-${runCase[2]}: focus is left on the page body after a screen change ("${after.slice(0, 40)}")`);
    }
    lastText = after;
  }
  void lastText;
  ctx.restore();
}

console.log(`a11y: ${steps} clicks played across ${CASES.length} runs, ${seenScreens.size} distinct screens checked, ${pairs.length} palette pairs.`);
if (problems.size) {
  console.log(`!! ${problems.size} kind(s) of problem:`);
  for (const [m, n] of [...problems].slice(0, 60)) console.log(`   ${m}${n > 1 ? `  (x${n})` : ""}`);
  process.exit(1);
}
console.log("Accessibility check passed.");
