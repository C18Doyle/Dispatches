// check-a11y.mjs: an accessibility check that plays the game the way the UI baseline does (seeded random runs in jsdom, through dist/bundle.js) and, on every
// screen it reaches, fails on a control with no accessible name, a duplicated id, a skipped heading level, an image with no alt, an svg that names itself
// with a role but has no title, a screen change that leaves focus on the page body, and (over the palette in tailwind.config.js, declared below because
// jsdom has no styles) a text and background pair under its WCAG 2.1 contrast ratio. Run after a build: npm run build && npm run check-a11y
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const { makeContext } = await import(pathToFileURL(join(ROOT, "../packages/testkit/src/ui-driver.mjs")).href);
const cfg = (await import(pathToFileURL(join(ROOT, "tests/ui.config.mjs")).href)).default;
process.chdir(ROOT);
const bundle = readFileSync("dist/bundle.js", "utf8");
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
  seenScreens.add(ctx.text().slice(0, 60));
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
    const level = /^H[1-6]$/.test(h.tagName) ? Number(h.tagName[1]) : Number(h.getAttribute("aria-level")) || 2;
    if (prev && level > prev + 1) note(`${where}: a level-${level} heading follows a level-${prev} heading ("${(h.textContent || "").trim().slice(0, 40)}")`);
    prev = level;
  }
  if (!d.querySelector("h1,[role='heading'][aria-level='1']")) note(`${where}: a screen with no level-1 heading ("${ctx.text().slice(0, 40)}")`);
  for (const img of d.querySelectorAll("img")) if (!hidden(img) && img.getAttribute("alt") === null) note(`${where}: an image has no alt`);
  for (const svg of d.querySelectorAll("svg[role='img']")) if (!hidden(svg) && !svg.querySelector("title") && !svg.getAttribute("aria-label")) note(`${where}: an svg with role img has no title or label`);
  // the meters: a name and a value a screen reader can read
  for (const m of d.querySelectorAll("[role='meter']")) if (!m.getAttribute("aria-valuenow") || !nameOf(m, d)) note(`${where}: a meter has no name or value`);
}

// ---- the palette (tailwind.config.js) --------------------------------------------------------------------------------
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
const C = {
  void: "#0a0a0a", parchment: "#EDEAE0", "parchment-dim": "#d7d2c4", ink: "#0f0f0e", "ink-soft": "#3a3a37", blood: "#8a231f", "blood-bright": "#BE2A26",
  verdigris: "#3d5c45", "verdigris-bright": "#3A754A", brass: "#8f887a", "brass-bright": "#b8b2a2", "brass-dim": "#4a463f", ash: "#847f74",
};
const pairs = [];
const P = C.parchment;
// text on the parchment cards (App.tsx opacities: ink/90, /80, /75, /70)
for (const a of [1, 0.9, 0.8, 0.75, 0.7]) pairs.push([`ink at ${a * 100}% on parchment`, mix(C.ink, P, a), P, 4.5]);
pairs.push(["ink-soft on parchment", C["ink-soft"], P, 4.5]);
pairs.push(["blood on parchment", C.blood, P, 4.5]);
pairs.push(["blood-bright on parchment (armed option, failure)", C["blood-bright"], P, 4.5]);
pairs.push(["verdigris-bright on parchment (a gain badge)", C["verdigris-bright"], P, 4.5]);
pairs.push(["brass-dim on parchment (labels)", C["brass-dim"], P, 4.5]);
// text on the dark ground
pairs.push(["parchment on void", P, C.void, 4.5]);
pairs.push(["brass on void", C.brass, C.void, 4.5]);
pairs.push(["brass-bright on void", C["brass-bright"], C.void, 4.5]);
pairs.push(["ash on void", C.ash, C.void, 4.5]);
pairs.push(["ash on void (the endings counter)", C.ash, C.void, 4.5]);
// buttons
pairs.push(["parchment on ink (a primary button)", P, C.ink, 4.5]);
pairs.push(["parchment on blood (the red button)", P, C.blood, 4.5]);
pairs.push(["ink on brass (a selected difficulty)", C.ink, C.brass, 4.5]);
for (const [label, fg, bg, need] of pairs) {
  const r = ratio(fg, bg);
  if (r < need) note(`palette: ${label} is ${r.toFixed(2)}:1, under the ${need}:1 it needs`);
}

// ---- play ------------------------------------------------------------------------------------------------------------
let steps = 0;
for (const [runCase, seed] of [[["Easy"], 1], [["Medium"], 2], [["Hard"], 3], [["Hard"], 4]]) {
  const ctx = makeContext(cfg, bundle, seed);
  if (ctx.failed) throw new Error(ctx.failed);
  await sleep(300);
  await ctx.settle();
  checkPage(ctx, "menu");
  const err = await cfg.setup(ctx, runCase);
  if (err) throw new Error(err);
  const policy = {};
  for (let i = 0; i < 140; i++) {
    if (cfg.isEnded(ctx)) {
      checkPage(ctx, `${runCase[0]} ending`);
      break;
    }
    if (cfg.isCrashed(ctx)) break;
    checkPage(ctx, `${runCase[0]}`);
    const b = cfg.choose(ctx, policy);
    if (!b) break;
    const before = ctx.text().slice(0, 80);
    await ctx.click(b);
    steps++;
    // a new screen should put focus somewhere other than the page body
    if (ctx.text().slice(0, 80) !== before && ctx.d.activeElement === ctx.d.body && !/Tap again to confirm/.test(ctx.text())) {
      note(`${runCase[0]}: focus is left on the page body after a screen change`);
    }
  }
  ctx.restore();
}

console.log(`a11y: ${steps} clicks played across 4 runs, ${seenScreens.size} distinct screens checked, ${pairs.length} palette pairs.`);
if (problems.size) {
  console.log(`!! ${problems.size} kind(s) of problem:`);
  for (const [m, n] of [...problems].slice(0, 60)) console.log(`   ${m}${n > 1 ? `  (x${n})` : ""}`);
  process.exit(1);
}
console.log("Accessibility check passed.");
