// check-a11y.mjs: an accessibility check that plays the game the way the UI baseline does (seeded runs in jsdom, through dist/bundle.js) and, on every
// screen it reaches, fails on a control with no accessible name, a duplicated id, a skipped heading level, a screen with no level-1 heading, an image with
// no alt, an svg that names itself with a role but has no title, a meter with no name or value, a screen change that leaves focus on the page body, and (over
// the four skins declared in 30-screens.jsx, because jsdom has no styles) a text and background pair under its WCAG 2.1 contrast ratio.
// Run after a build: npm run build && npm run check:a11y
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
  for (const el of d.querySelectorAll("button,a[href],input,select,textarea,summary,[role='button'],[role='link'],[role='tab'],[role='radio'],[role='switch']")) {
    if (hidden(el)) continue;
    if (!nameOf(el, d)) note(`${where}: a ${el.tagName.toLowerCase()}${el.getAttribute("role") ? `[role=${el.getAttribute("role")}]` : ""} has no accessible name`);
  }
  const ids = new Map();
  for (const el of d.querySelectorAll("[id]")) ids.set(el.id, (ids.get(el.id) || 0) + 1);
  for (const [id, n] of ids) if (n > 1) note(`${where}: the id "${id}" is used ${n} times`);
  let prev = 0;
  for (const h of d.querySelectorAll("h1,h2,h3,h4,h5,h6,[role='heading']")) {
    if (hidden(h)) continue;
    const level = /^H[1-6]$/.test(h.tagName) ? Number(h.tagName[1]) : Number(h.getAttribute("aria-level")) || 2;
    if (prev && level > prev + 1) note(`${where}: a level-${level} heading follows a level-${prev} heading`);
    prev = level;
  }
  if (!d.querySelector("h1,[role='heading'][aria-level='1']")) note(`${where}: a screen with no level-1 heading`);
  if (!d.querySelector("main,[role='main']")) note(`${where}: a screen with no main landmark`);
  for (const img of d.querySelectorAll("img")) if (!hidden(img) && img.getAttribute("alt") === null) note(`${where}: an image has no alt`);
  for (const svg of d.querySelectorAll("svg[role='img']")) if (!hidden(svg) && !svg.querySelector("title") && !svg.getAttribute("aria-label")) note(`${where}: an svg with role img has no name`);
  for (const m of d.querySelectorAll("[role='meter']")) if (m.getAttribute("aria-valuenow") === null || !nameOf(m, d)) note(`${where}: a meter has no name or value`);
  // the meters of the run must be reachable as meters at all
  if (/METER|MANPOWER|AUTHORITY/.test(ctx.text()) && !d.querySelector("[role='meter']") && /ISSUE THE ORDER|OUTCOME/.test(ctx.text())) note(`${where}: the meters are drawn but not exposed as meters`);
}

// ---- contrast over the skins -----------------------------------------------------------------------------------------
const lum = (hex) => {
  const c = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(c.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
const src = readFileSync("src/App.jsx", "utf8");
const block = src.match(/const SKINS = \{[\s\S]*?\n\};\n/);
if (!block) throw new Error("SKINS block not found in src/App.jsx");
const SKINS = new Function(block[0] + "\nreturn SKINS;")();
let pairs = 0;
const need = (label, fg, bg, min = 4.5) => {
  pairs++;
  if (!fg || !bg) return note(`palette: ${label} has no colour`);
  const r = ratio(fg, bg);
  if (r < min) note(`palette: ${label} is ${r.toFixed(2)}:1, under the ${min}:1 it needs`);
};
for (const [id, s] of Object.entries(SKINS)) {
  const page = s.dark ? s.ground : s.paper;
  need(`${id}: body text on the page`, s.dark ? s.paper : s.ink, page);
  need(`${id}: muted text on the page`, s.dark ? s.paperDim : s.inkMuted, page);
  need(`${id}: accent text on the page`, s.accent, page);
  need(`${id}: the accent button (page colour on accent)`, s.dark ? s.ground : s.paper, s.accent);
}
// the newspaper sheet (BulletinScreen) is the same on every skin
need("bulletin: small grey labels on the sheet", "#4a453c", "#f2ecdc");
need("bulletin: meanwhile text on the sheet", "#3a352c", "#f2ecdc");
need("bulletin: body on the sheet", "#1a1712", "#f2ecdc");

// ---- play ------------------------------------------------------------------------------------------------------------
const SOUTH = ["southRussia", "Armed Forces of South Russia"];
const RUNS = [
  [[...SOUTH, "easy"], 1],
  [["provisionalGov17", "The Provisional Government", false], 2],
  [["siberia", "Provisional All-Russian Government", true], 3],
  [["bolsheviks", "Revolutionary Military Council of the Republic", "easy"], 4],
];
let steps = 0;
for (const [runCase, seed] of RUNS) {
  const tag = `${runCase[0]}${runCase[2] === "easy" ? " (easy)" : runCase[2] ? " (hard)" : ""}`;
  const ctx = makeContext(cfg, bundle, seed);
  if (ctx.failed) throw new Error(ctx.failed);
  ctx.runCase = runCase;
  await sleep(300);
  await ctx.settle();
  checkPage(ctx, "menu");
  const err = await cfg.setup(ctx, runCase);
  if (err) throw new Error(err);
  for (let i = 0; i < 160; i++) {
    checkPage(ctx, tag);
    const b = cfg.choose(ctx, {});
    if (!b) break;
    const before = ctx.text().slice(0, 80);
    await ctx.click(b);
    steps++;
    // a new screen should put focus somewhere other than the page body
    if (ctx.text().slice(0, 80) !== before && ctx.d.activeElement === ctx.d.body) {
      note(`${tag}: focus is left on the page body after a screen change`);
    }
    if (cfg.isCrashed(ctx)) break;
  }
  ctx.restore();
}

// ---- the prelude of each command, and "What this game leaves out" reached from it -------------------------------------
for (const [id, label] of [["provisionalGov17", "The Provisional Government"], SOUTH, ["siberia", "Provisional All-Russian Government"], ["bolsheviks", "Revolutionary Military Council of the Republic"]]) {
  const ctx = makeContext(cfg, bundle, 7);
  if (ctx.failed) throw new Error(ctx.failed);
  ctx.stayOnPrelude = true;
  await sleep(300);
  await ctx.settle();
  const err = await cfg.setup(ctx, [id, label, false]);
  if (err) throw new Error(err);
  checkPage(ctx, id + " prelude");
  if (!/BACKGROUND, WRITTEN WITH HINDSIGHT/.test(ctx.text())) note(id + ": the prelude does not say it is written with hindsight");
  const hist = ctx.buttons().find((b) => ctx.lab(b) === "WHAT THIS GAME LEAVES OUT");
  if (!hist) note(id + ": the prelude has no way to \"What this game leaves out\"");
  else {
    await ctx.click(hist);
    checkPage(ctx, id + " what the game leaves out");
    if (!/Red Terror/.test(ctx.text()) || !/pogroms/.test(ctx.text())) note(id + ": the hard-history page is missing the terror or the pogroms");
    await ctx.click(ctx.buttons().find((b) => /^Close and go back$/.test(ctx.lab(b))));
    if (!/CONTINUE TO THE FIRST REPORT/.test(ctx.text())) note(id + ": closing the hard-history page does not return to the prelude");
  }
  ctx.restore();
}

// ---- the Order of Battle: the planning screen at each of its three steps, and the report ------------------------------------
{
  const runCase = [...SOUTH, false];
  const ctx = makeContext(cfg, bundle, 6);
  if (ctx.failed) throw new Error(ctx.failed);
  ctx.runCase = runCase;
  await sleep(300);
  await ctx.settle();
  const err = await cfg.setup(ctx, runCase);
  if (err) throw new Error(err);
  const orders = () => ctx.buttons().filter((b) => ctx.lab(b) === "ISSUE THE ORDER");
  await ctx.click(orders()[1]);
  for (let i = 0; i < 4 && !/One More Day/.test(ctx.text()); i++) {
    const next = ctx.buttons().find((b) => ctx.lab(b) === "CONTINUE");
    if (!next) break;
    await ctx.click(next);
  }
  const host = ctx.buttons().find((b) => ctx.lab(b) === "ISSUE THE ORDER" && /LEADS TO BATTLE PLANNING/.test(b.parentElement?.textContent || ""));
  if (!host) note("battle: the assault at Ekaterinodar no longer hosts a battle");
  else {
    await ctx.click(host);
    checkPage(ctx, "battle: officer step");
    for (const re of [/^NEXT: /, /^NEXT: /]) {
      const nx = ctx.buttons().find((b) => re.test(ctx.lab(b)));
      if (!nx) break;
      await ctx.click(nx);
      checkPage(ctx, "battle: next step");
    }
    await ctx.click(ctx.buttons().find((b) => ctx.lab(b) === "LET THE STAFF PLAN IT"));
    await ctx.click(ctx.buttons().find((b) => ctx.lab(b) === "ISSUE THE PLAN"));
    checkPage(ctx, "battle: report");
    if (!/AFTER-ACTION REPORT/.test(ctx.text())) note("battle: no after-action report on the outcome");
  }
  ctx.restore();
}

// ---- the Key Events screen, both views ------------------------------------------------------------------------------------
{
  const runCase = [...SOUTH, false];
  const ctx = makeContext(cfg, bundle, 5);
  if (ctx.failed) throw new Error(ctx.failed);
  ctx.runCase = runCase;
  await sleep(300);
  await ctx.settle();
  const err = await cfg.setup(ctx, runCase);
  if (err) throw new Error(err);
  const open = ctx.buttons().find((b) => /KEY EVENTS/.test(ctx.lab(b)));
  if (open) {
    await ctx.click(open);
    checkPage(ctx, "key events");
    const war = ctx.buttons().find((b) => ctx.lab(b) === "THE WAR AT LARGE");
    if (war) {
      await ctx.click(war);
      checkPage(ctx, "key events > the war at large");
    }
  }
  ctx.restore();
}

// ---- the menu screens (settings, war record, glossary, dossiers, endings, atlas, how to read) ---------------------------
{
  const ctx = makeContext(cfg, bundle, 9);
  if (ctx.failed) throw new Error(ctx.failed);
  await sleep(300);
  await ctx.settle();
  for (const entry of ["SETTINGS", "WAR RECORD"]) {
    const el = ctx.findText(entry);
    if (!el) continue;
    await ctx.click(el);
    checkPage(ctx, entry);
    for (const b of ctx.buttons().slice(0, 12)) {
      const label = ctx.lab(b);
      if (/^(✕|CLOSE|BACK)/i.test(label) || !/GLOSSARY|DOSSIER|ENDINGS|ATLAS|HOW TO|DISCOVERY|READ/i.test(label)) continue;
      await ctx.click(b);
      checkPage(ctx, `${entry} > ${label.slice(0, 20)}`);
      const close = ctx.buttons().find((x) => /^(✕|CLOSE|BACK)/i.test(ctx.lab(x)));
      if (close) await ctx.click(close);
    }
    const close = ctx.buttons().find((x) => /^(✕|CLOSE|BACK)/i.test(ctx.lab(x)));
    if (close) await ctx.click(close);
  }
  ctx.restore();
}

console.log(`a11y: ${steps} clicks played across ${RUNS.length} runs, ${seenScreens.size} distinct screens checked, ${pairs} palette pairs.`);
if (problems.size) {
  console.log(`!! ${problems.size} kind(s) of problem:`);
  for (const [m, n] of [...problems].slice(0, 60)) console.log(`   ${m}${n > 1 ? `  (x${n})` : ""}`);
  process.exit(1);
}
console.log("Accessibility check passed.");
