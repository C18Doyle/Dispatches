// The period details on the screens: letterhead, plate, document, quotation, staff and staff note on a report; terrain, operations, supply and
// place names on the front map; the hard mode keeps its dashboard free of the staff note.
//
// Run after a build: npm run build && node tests/period.test.mjs
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const { makeContext } = await import(pathToFileURL(join(ROOT, "../packages/testkit/src/ui-driver.mjs")).href);
const cfg = (await import(pathToFileURL(join(HERE, "ui.config.mjs")).href)).default;
process.chdir(ROOT);
const bundle = readFileSync("dist/bundle.js", "utf8");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const fails = [];
const check = (ok, what) => {
  if (!ok) fails.push(what);
  console.log((ok ? "ok   " : "FAIL ") + what);
};
const find = (ctx, re) => ctx.buttons().find((b) => re.test(ctx.lab(b)));

const CASES = {
  provisionalGov17: ["The Provisional Government", /THE PROVISIONAL GOVERNMENT/i, /Note to the Allied Governments/i, "Miliukov"],
  southRussia: ["Armed Forces of South Russia", /COMMAND OF THE VOLUNTEER ARMY/i, null, null],
  siberia: ["Provisional All-Russian Government", /COUNCIL OF MINISTERS OF THE RUSSIAN STATE|HEADQUARTERS OF THE SUPREME RULER/i, /Proclamation of the Supreme Ruler/i, "Boldyrev"],
  bolsheviks: ["Revolutionary Military Council of the Republic", /REVOLUTIONARY MILITARY COUNCIL OF THE REPUBLIC/i, /Decree declaring the Soviet Republic a military camp/i, null],
};

async function play(id, mode) {
  const ctx = makeContext(cfg, bundle, 3);
  if (ctx.failed) throw new Error(ctx.failed);
  await sleep(300);
  await ctx.settle();
  const err = await cfg.setup(ctx, [id, CASES[id][0], mode]);
  if (err) throw new Error(err);
  return ctx;
}

// --- the first report of each command ---------------------------------------------------------------------
for (const [id, [, organ, doc, person]] of Object.entries(CASES)) {
  const ctx = await play(id, false);
  const text = ctx.text();
  check(organ.test(text), `${id}: the report has its letterhead`);
  check(/ILLUSTRATION\./.test(text) && !!ctx.d.querySelector("figure svg[role=img]"), `${id}: the report has a captioned plate`);
  check(/WHAT THE STAFF SAY/.test(text), `${id}: each order carries a staff note`);
  if (doc) check(doc.test(text) && /RECONSTRUCTED: the layout is of the period/.test(text), `${id}: the document on the table says it is a reconstruction`);
  if (person) check(text.includes(person) && /AT THIS REPORT/.test(text), `${id}: ${person} is on the staff panel and at this report`);
  ctx.restore();
}

// --- the front map -------------------------------------------------------------------------------------------
{
  const ctx = await play("southRussia", false);
  await ctx.click(find(ctx, /VIEW FRONT MAP/));
  const text = ctx.text();
  check(/UNDER WAY THIS MONTH/.test(text) && /Ice March/i.test(text), "map: the operation under way in April 1918 is listed (the Ice March)");
  check(/WHAT THE COMMAND LIVES ON/.test(text) && /RAIL JUNCTIONS: \d+ OF \d+ HELD/.test(text) && /COAL: \d+ OF \d+ HELD/.test(text), "map: the supply picture counts junctions and coal");
  check(/PLACE NAMES THAT CHANGED/.test(text) && /Stalingrad from 1925/.test(text), "map: the place names that changed are noted");
  check(!!ctx.d.querySelector("svg path[stroke-linecap=round]"), "map: rivers are drawn");
  ctx.restore();
}

// --- hard mode has no dashboard, so no staff note ----------------------------------------------------------
{
  const ctx = await play("southRussia", true);
  check(!/WHAT THE STAFF SAY/.test(ctx.text()), "hard mode: no staff note");
  ctx.restore();
}

// --- Easy mode opens the note ---------------------------------------------------------------------------------
{
  const ctx = await play("southRussia", "easy");
  const open = ctx.d.querySelectorAll("details[open]").length;
  check(/THE STAFF'S FIGURES: IF YOU ISSUE THIS ORDER/.test(ctx.text()) && open >= 1, "easy: the staff note is open and the figures sit under it");
  ctx.restore();
}

if (fails.length) {
  console.log(`\n${fails.length} failure(s)`);
  process.exit(1);
}
console.log("\nperiod: all checks passed");
