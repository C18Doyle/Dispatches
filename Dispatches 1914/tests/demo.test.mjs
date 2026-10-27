// The free demo (a build with DEMO_BUILD true, dist/demo/bundle.js), played through the real screens (jsdom):
//   - the menu lists the German command as the one that can be played, and the other five (the French among them) as locked
//   - the briefing has no difficulty choice
//   - the German command plays on past six orders to one of its endings, and the ending links to the full game
//
// Run after a build: npm run build && node tests/demo.test.mjs
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const { makeContext } = await import(pathToFileURL(join(ROOT, "../packages/testkit/src/ui-driver.mjs")).href);
const cfg = (await import(pathToFileURL(join(HERE, "ui.config.mjs")).href)).default;
process.chdir(ROOT);
const bundle = readFileSync("dist/demo/bundle.js", "utf8");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fails = [];
const check = (ok, what) => { if (!ok) fails.push(what); console.log((ok ? "ok   " : "FAIL ") + what); };
const btn = (ctx, re) => ctx.buttons().find((b) => re.test(ctx.lab(b)));

const ctx = makeContext(cfg, bundle, 11, {});
if (ctx.failed) throw new Error(ctx.failed);
await sleep(200);
await ctx.settle();
check(/Free demo/.test(ctx.text()) && /German command is open in full/.test(ctx.text()), "the menu says it is the free demo and that the German command is open");
const cards = [...ctx.d.querySelectorAll("button.dg-cmd")];
check(cards.length === 6 && cards.filter((b) => !b.disabled).length === 1, "six commands are listed and one can be played");
const card = (re) => cards.find((x) => re.test(x.textContent));
check(!card(/Germany/).disabled && card(/France/).disabled, "Germany is the command that opens, and France is locked");
check((ctx.text().match(/In the full game/g) || []).length === 5, "the other five say they are in the full game");
await ctx.click(btn(ctx, /Germany/));
check(!btn(ctx, /Easy mode$/) && !btn(ctx, /Hard mode$/), "the briefing offers no difficulty choice");
await ctx.click(btn(ctx, /^Enter the war room/));
let given = 0; // the orders given: each shows its result, and the result's Continue is counted
for (let i = 0; i < 400 && !ctx.d.querySelector(".dg-badge"); i++) {
  const staff = btn(ctx, /Let the staff plan it/);
  if (staff) { await ctx.click(staff); await ctx.click(btn(ctx, /^Issue the plan/)); await ctx.click(btn(ctx, /^Carry on to the second day/)); continue; }
  const cont = btn(ctx, /^Continue$/);
  if (cont) { if (ctx.d.querySelector('[data-screen="outcome"]')) given++; await ctx.click(cont); continue; }
  const order = ctx.buttons().find((b) => b.className === "dg-choice" && !b.disabled);
  if (!order) break;
  await ctx.click(order);
}
check(given > 6, "the German command goes on past six orders (" + given + ")");
check(!!ctx.d.querySelector(".dg-badge"), "and reaches one of its endings");
const link = ctx.d.querySelector("a.dg-link");
check(!!link && /dispatches\.itch\.io\/dispatches-1914/.test(link.href), "the ending links to the full game");
ctx.restore();
console.log(fails.length ? `\n${fails.length} FAILED` : "\nThe free demo behaves.");
process.exit(fails.length ? 1 : 0);
