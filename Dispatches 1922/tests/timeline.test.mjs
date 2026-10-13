// The Key Events screen: "This run" lists the run's own reports; "The war at large" lists what every command was deciding, month by month,
// up to the month this run has reached. Nothing later than that month is shown, and a report this run did not visit never appears for its own
// command. Run after a build: npm run build && node tests/timeline.test.mjs
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
const MONTHS = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

async function start(campaign) {
  const ctx = makeContext(cfg, bundle, 4);
  if (ctx.failed) throw new Error(ctx.failed);
  ctx.runCase = [campaign[0], campaign[1], false];
  await sleep(300);
  await ctx.settle();
  const err = await cfg.setup(ctx, [campaign[0], campaign[1], false]);
  if (err) throw new Error(err);
  return ctx;
}
async function openWar(ctx) {
  await ctx.click(find(ctx, /KEY EVENTS/));
  await ctx.click(find(ctx, /^THE WAR AT LARGE$/));
}
const months = (text) => [...text.matchAll(new RegExp("(" + MONTHS.join("|") + ") (19\\d\\d)", "g"))].map((m) => parseInt(m[2], 10) * 100 + MONTHS.indexOf(m[1]) + 1);

// --- the 1917 opening: no other command has a report yet -----------------------------------------------------
{
  const ctx = await start(["provisionalGov17", "The Provisional Government"]);
  await openWar(ctx);
  const t = ctx.text();
  check(/THE WAR AT LARGE — UP TO APRIL 1917/.test(t), "1917 opening: the view says it runs up to April 1917");
  check(/No other command has a report dated this early/.test(t), "1917 opening: no other command is listed yet");
  check(/APRIL 1917 · YOU ARE HERE/.test(t) && /your command/.test(t), "1917 opening: the player's own report is marked");
  ctx.restore();
}

// --- South Russia two reports in: earlier months of the other commands, nothing later, no unvisited branch ----
{
  const ctx = await start(["southRussia", "Armed Forces of South Russia"]);
  // call off the assault (the first order), which skips "One More Day"
  const orders = ctx.buttons().filter((b) => ctx.lab(b) === "ISSUE THE ORDER");
  await ctx.click(orders[0]);
  await ctx.click(find(ctx, /^CONTINUE$/));
  let guard = 0;
  while (!/ISSUE THE ORDER/.test(ctx.text()) && guard++ < 4) {
    const next = find(ctx, /^CONTINUE$/);
    if (!next) break;
    await ctx.click(next);
  }
  await openWar(ctx);
  const t = ctx.text();
  const ks = months(t.slice(t.indexOf("THE WAR AT LARGE — UP TO")));
  const header = (t.match(/UP TO (\w+) (19\d\d)/) || []);
  const reached = header.length ? parseInt(header[2], 10) * 100 + MONTHS.indexOf(header[1]) + 1 : 0;
  check(reached >= 191804, `south russia: the view runs up to ${header[1]} ${header[2]}`);
  check(ks.length > 0 && ks.every((k) => k <= reached), "south russia: no month later than the one reached is listed");
  check(/The Note That Became Public/.test(t),"south russia: the 1917 command's earlier reports are listed");
  check(!/One More Day/.test(t), "south russia: an unvisited branch of the player's own command is not listed");
  // the other view still works
  await ctx.click(find(ctx, /^THIS RUN$/));
  check(/IN ORDER/.test(ctx.text()), "south russia: the run's own list is still there");
  ctx.restore();
}

if (fails.length) {
  console.log(`\n${fails.length} failure(s)`);
  process.exit(1);
}
console.log("\ntimeline: all checks passed");
