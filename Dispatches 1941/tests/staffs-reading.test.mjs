// The staff's reading and the advisers' standing, through the real screens. Starts a fresh page from a save on the Midway report of IGHQ (a report with a
// belief, an adviser the player trusts and one overruled to silence), and checks: the belief is shown with its grade and source; the orders that rest on it say
// so; showing the evidence spends a check and gives the verdict; easy mode shows the verdict at once; a trusted adviser is marked and a silent one says so;
// and an adviser who has gone leaves by an event screen, once.
//
// Run after a build: npm run build && npm run test:staffs-reading
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const { makeContext } = await import(pathToFileURL(join(ROOT, "../packages/testkit/src/ui-driver.mjs")).href);
const cfg = (await import(pathToFileURL(join(HERE, "ui.config.mjs")).href)).default;
process.chdir(ROOT);
const bundle = readFileSync("dist/full/bundle.js", "utf8");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const fails = [];
const check = (ok, what) => {
  if (!ok) fails.push(what);
  if (!ok || process.env.VERBOSE) console.log((ok ? "ok   " : "FAIL ") + what);
};
const fixture = JSON.parse(readFileSync(join(HERE, "saves", "japan-open.json"), "utf8"));

async function open(flags, mode = "open") {
  const active = JSON.parse(fixture.storage["ww2-command-active"]);
  active.position = "midway42";
  active.mode = mode;
  active.flags = { ...active.flags, ...flags };
  active.meters = { readiness: 3, pipeline: 3, initiative: 3 };
  active.visited = ["midway42"];
  active.history = [];
  active.log = [];
  const ctx = makeContext(cfg, bundle, 1, { "ww2-command-active": JSON.stringify(active) });
  if (ctx.failed) throw new Error(ctx.failed);
  await sleep(150);
  await ctx.settle();
  const instant = ctx.buttons("button,[role=tab]").find((b) => /instant text: off/i.test(ctx.lab(b)));
  if (instant) await ctx.click(instant);
  await ctx.click(ctx.buttons().find((b) => /War in Progress/.test(ctx.lab(b))));
  return ctx;
}

// ---- standard mode: the belief, the line under the order, a check ----
{
  const ctx = await open({ tr_nagumo: 4, trn_nagumo: "Nagumo", tr_ugaki: -4, trn_ugaki: "Ugaki" });
  let t = ctx.text();
  check(t.includes("What the staff believes") && t.includes("Reported as firm"), "the report shows the belief and the grade the staff gave it");
  check(t.includes("Source: the Combined Fleet staff's plan"), "and its source");
  check(t.includes("Show the evidence (3 left)"), "and offers to show the evidence, with the checks left");
  check(t.includes("Rests on a belief the staff has not tested"), "an order that rests on the belief says so");
  check(!t.includes("The evidence leans against it."), "the verdict is not shown before the evidence is");
  check(/Trusted\s*Nagumo argues/.test(t) || (t.includes("Trusted") && t.includes("Nagumo argues")), "a trusted adviser is marked");
  check(t.includes("Ugaki says little now") && !t.includes("Ugaki argues"), "an adviser overruled to silence says little and does not argue");
  const show = ctx.buttons().find((b) => /^Show the evidence/.test(ctx.lab(b)));
  await ctx.click(show);
  t = ctx.text();
  check(t.includes("The evidence leans against it.") && t.includes("Station HYPO had read the plan"), "showing the evidence gives the verdict and the truth");
  check(!/Show the evidence \(/.test(t), "and the button is gone once the belief is checked");
  check(t.includes("Rests on a belief the evidence goes against"), "the order that rests on it now says the evidence goes against it");
  check(ctx.errors.length === 0, `no console errors (${ctx.errors.slice(0, 2).join(" | ")})`);
  ctx.restore && ctx.restore();
}

// ---- easy mode: the verdict from the start, at no cost ----
{
  const ctx = await open({}, "easy");
  const t = ctx.text();
  check(t.includes("The evidence leans against it.") && !/Show the evidence \(/.test(t), "in easy mode the verdict is shown from the start and no check is offered");
  ctx.restore && ctx.restore();
}

// ---- an adviser who has gone leaves by an event, once ----
{
  const ctx = await open({ tr_ugaki: -6, trn_ugaki: "Ugaki", trgone_ugaki: "Ugaki" });
  const order = ctx.buttons().find((b) => /Proceed with the plan as built/.test(ctx.lab(b)));
  check(!!order, "the report still offers the orders");
  await ctx.click(order);
  let shown = false;
  for (let k = 0; k < 12 && !shown; k++) {
    const t = ctx.text();
    shown = t.includes("Special event") && t.includes("Ugaki asks to be relieved");
    if (shown) break;
    const b = ctx.buttons().find((x) => /^(Next Report|Continue|Proceed)/.test(ctx.lab(x))) || cfg.choose(ctx, { approachChosen: true });
    if (!b) break;
    await ctx.click(b);
  }
  check(shown, "the adviser's resignation is shown on its own screen after the next order");
  if (shown) {
    check(ctx.text().includes("will not go on arguing a case that is not heard"), "with its reason");
    await ctx.click(ctx.buttons().find((x) => /^Continue/.test(ctx.lab(x))));
    check(!ctx.text().includes("asks to be relieved"), "and Continue returns to the file");
  }
  check(ctx.errors.length === 0, `no console errors on the resignation (${ctx.errors.slice(0, 2).join(" | ")})`);
  ctx.restore && ctx.restore();
}

if (fails.length) {
  console.log(`\n${fails.length} failure(s)`);
  process.exit(1);
}
console.log("staff's reading and standing ok");
