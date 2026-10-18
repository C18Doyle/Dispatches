// The free demo (a build with DEMO_BUILD true, dist/demo/bundle.js), played through the real screens (jsdom):
//   - the menu lists the French command as the one that can be played, and the other five as locked
//   - the briefing has no difficulty choice
//   - after six orders the demo ends on its own screen, with a link to the full game, and nothing is left to resume
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
check(/Free demo/.test(ctx.text()), "the menu says it is the free demo");
const cards = [...ctx.d.querySelectorAll("button.dg-cmd")];
check(cards.length === 6 && cards.filter((b) => !b.disabled).length === 1, "six commands are listed and one can be played");
const card = (re) => cards.find((x) => re.test(x.textContent));
check(card(/Germany/).disabled && !card(/France/).disabled, "France is the command that opens");
check((ctx.text().match(/In the full game/g) || []).length === 5, "the other five say they are in the full game");
await ctx.click(btn(ctx, /France/));
check(!btn(ctx, /Easy mode$/) && !btn(ctx, /Hard mode$/), "the briefing offers no difficulty choice");
await ctx.click(btn(ctx, /^Enter the war room/));
let given = 0; // the orders given: each shows its result, and the result's Continue is counted
for (let i = 0; i < 120 && !/The demo ends here/.test(ctx.text()); i++) {
  const staff = btn(ctx, /Let the staff plan it/);
  if (staff) { await ctx.click(staff); await ctx.click(btn(ctx, /^Issue the plan/)); await ctx.click(btn(ctx, /^Carry on to the second day/)); continue; }
  const cont = btn(ctx, /^Continue$/);
  if (cont) { if (ctx.d.querySelector('[data-screen="outcome"]')) given++; await ctx.click(cont); continue; }
  const order = ctx.buttons().find((b) => b.className === "dg-choice" && !b.disabled);
  if (!order) break;
  await ctx.click(order);
}
const t = ctx.text();
check(/The demo ends here/.test(t), "the demo ends on its own screen after six orders");
check(given === 6, "exactly six orders were given (" + given + ")");
const link = ctx.d.querySelector("a.dg-link");
check(!!link && /dispatches\.itch\.io\/dispatches-1914/.test(link.href), "the end screen links to the full game");
check(!ctx.w.localStorage.getItem("dispatches1914_save_v1"), "no file is left to resume");
await ctx.click(btn(ctx, /^Back to the commands/));
check(!btn(ctx, /^Resume file/) && /Free demo/.test(ctx.text()), "back at the menu there is nothing to resume");
ctx.restore();
console.log(fails.length ? `\n${fails.length} FAILED` : "\nThe free demo behaves.");
process.exit(fails.length ? 1 : 0);
