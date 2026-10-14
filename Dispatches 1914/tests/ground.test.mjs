// The ground against the record, the file at its close, and the reading settings, played through the real screens (jsdom).
//   - an ending shows how the file went: the orders that left the record, the ground marked against the record, the staff
//   - the rank's ground part counts the ledger
//   - the expanded map lists the file's ground against the record
//   - the settings change the page (spacing, line length, motion) and "Easy reading" sets them together
//
// Run after a build: npm run build && node tests/ground.test.mjs
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const require = createRequire(join(ROOT, "package.json"));
const { loadEngine } = require("./_load.js");
const { makeContext } = await import(pathToFileURL(join(ROOT, "../packages/testkit/src/ui-driver.mjs")).href);
const cfg = (await import(pathToFileURL(join(HERE, "ui.config.mjs")).href)).default;
process.chdir(ROOT);
const E = loadEngine("dispatches-greatwar.jsx");
const bundle = readFileSync("dist/bundle.js", "utf8");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fails = [];
const check = (ok, what) => { if (!ok) fails.push(what); console.log((ok ? "ok   " : "FAIL ") + what); };
const btn = (ctx, re) => ctx.buttons().find((b) => re.test(ctx.lab(b)));
const orders = (ctx) => ctx.buttons().filter((b) => b.className === "dg-choice");

function savedAt(campaignId, nodeId, flags = {}, taken = []) {
  const snap = E.snapshotRun({ campaignId, nodeId, flags, meters: E.emptyMeters(), hardState: E.emptyHardState(), visited: [nodeId], easy: false, taken, history: [] });
  return { dispatches1914_save_v1: JSON.stringify(snap) };
}
async function boot(saved) {
  const ctx = makeContext(cfg, bundle, 11, saved);
  if (ctx.failed) throw new Error(ctx.failed);
  await sleep(200);
  await ctx.settle();
  return ctx;
}
async function resume(saved) {
  const ctx = await boot(saved);
  await ctx.click(btn(ctx, /^Resume file/));
  return ctx;
}

// --- an ending: how the file went -------------------------------------------------------------------------
{
  const flags = { ohl_serbia: "declined", ohl_lorraine: "reinforced" };
  const taken = [
    { node: "ohl_1915_15_serbia", choice: "wait" },
    { node: "ohl_1914_01_aufmarsch", choice: "right" },
  ];
  const ctx = await resume(savedAt("ohl", "ohl_end_armistice", flags, taken));
  const t = ctx.text();
  check(/How your file went/.test(t), "ending: the file strip is shown");
  check(/2 orders given: 1 followed the record and 1 left it/.test(t), "ending: it counts the orders that kept to the record and the one that left it");
  check(/Where the file left the record/.test(t) && /Serbia/.test(t), "ending: the order that left the record is listed");
  check(ctx.d.querySelectorAll(".dg-strip-maps svg").length === 2, "ending: the first day and the last day are drawn side by side");
  check(ctx.d.querySelectorAll(".dg-strip-maps .dg-ground-lost").length === 1 && ctx.d.querySelectorAll(".dg-strip-maps .dg-ground-gained").length === 1, "ending: the last map marks the ground lost and the ground held");
  check(/Speculative\. Serbia is not attacked/.test(t) && /Speculative\. Lorraine is reinforced/.test(t), "ending: the marks are written as speculative");
  check(/1 place held or taken beyond the record, 1 lost or not taken/.test(t), "ending: the rank's ground part counts the ledger");
  check(/No adviser ended trusted/.test(t) && /beliefs checked/.test(t), "ending: the staff line is shown");
  ctx.restore();
}

// --- a file with nothing against the record shows no ground ---------------------------------------------
{
  const ctx = await resume(savedAt("ohl", "ohl_end_armistice", {}, [{ node: "ohl_1915_15_serbia", choice: "serbia" }]));
  const t = ctx.text();
  check(/1 order given: 1 followed the record and 0 left it/.test(t), "ending: a file that kept to the record says so");
  check(!/Where the file left the record/.test(t) && !ctx.d.querySelector(".dg-strip .dg-groundlist"), "ending: and lists no departures and no ground");
  ctx.restore();
}

// --- the expanded map lists the ground --------------------------------------------------------------------
{
  const ctx = await resume(savedAt("ohl", "ohl_1916_14_somme", { ohl_serbia: "declined" }, [{ node: "ohl_1915_15_serbia", choice: "wait" }]));
  await ctx.click(btn(ctx, /Expand the map/));
  const t = ctx.text();
  check(/Your file against the record/.test(t) && /Lost or not taken: Belgrade/.test(t), "map: the expanded map lists the ground lost against the record");
  check(ctx.d.querySelectorAll(".dg-modal .dg-ground-lost").length >= 1, "map: and draws it");
  ctx.restore();
}

// --- a newspaper special, earned by a speculative order -------------------------------------------------
{
  const ctx = await resume(savedAt("ohl", "ohl_1915_15_serbia", {}, []));
  await ctx.click(btn(ctx, /^Decline the Balkan commitment/));
  await ctx.click(btn(ctx, /^Continue$/));
  const t = ctx.text();
  check(/Special event/.test(t) && /Le Temps/.test(t) && /Salonika Army Finds No Enemy/.test(t), "newspaper: a speculative order brings a front page from another front before the next report");
  check(/Speculative\./.test(t) && !!ctx.d.querySelector(".dg-paper"), "newspaper: it has a masthead and is written as speculative");
  await ctx.click(btn(ctx, /^Continue$/));
  check(!/Le Temps/.test(ctx.text()) && /The Meuse/.test(ctx.text()) && orders(ctx).length >= 1, "newspaper: and then the report follows, and the paper is not shown again");
  ctx.restore();
}
// a file that kept to the record sees no newspaper
{
  const ctx = await resume(savedAt("ohl", "ohl_1915_15_serbia", {}, []));
  const record = ctx.buttons().find((b) => b.className === "dg-choice" && !/^Decline the Balkan/.test(ctx.lab(b)));
  await ctx.click(record);
  await ctx.click(btn(ctx, /^Continue$/));
  check(!/The newspapers/.test(ctx.text()), "newspaper: a file that gave the record's order sees none");
  ctx.restore();
}

// --- the reading settings ------------------------------------------------------------------------------
{
  const ctx = await boot();
  const root = ctx.d.documentElement;
  check(root.getAttribute("data-spacing") === null || root.getAttribute("data-spacing") === "standard", "settings: spacing starts standard");
  await ctx.click(btn(ctx, /^Settings/));
  await ctx.click(btn(ctx, /^Wide$/));
  check(root.getAttribute("data-spacing") === "wide", "settings: line spacing wide is set on the page");
  await ctx.click(btn(ctx, /^Narrow$/));
  check(root.getAttribute("data-measure") === "narrow", "settings: a narrow line is set on the page");
  await ctx.click(btn(ctx, /^Reduce motion$/));
  check(root.getAttribute("data-motion") === "reduced", "settings: reduced motion is set on the page");
  await ctx.click(btn(ctx, /^Standard$/ ));
  await ctx.click(btn(ctx, /^Follow my device$/));
  await ctx.click(btn(ctx, /Easy reading/));
  check(root.getAttribute("data-font") === "plain" && root.getAttribute("data-spacing") === "roomy" && root.getAttribute("data-measure") === "narrow" && root.getAttribute("data-motion") === "reduced", "settings: Easy reading sets type, spacing, line length and motion together");
  await ctx.click(btn(ctx, /Return all settings to the defaults/));
  check(root.getAttribute("data-spacing") === "standard" && root.getAttribute("data-motion") === "auto" && root.getAttribute("data-measure") === "standard", "settings: the defaults put them back");
  ctx.restore();
}

console.log(fails.length ? `\n${fails.length} FAILED` : "\nThe ground, the file's close and the reading settings behave.");
process.exit(fails.length ? 1 : 0);
