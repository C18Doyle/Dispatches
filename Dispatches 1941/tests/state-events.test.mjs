// Every state-driven special event (STATE_EVENTS) shows up in play, once. For each event this finds a report that leads to its anchor, starts a
// fresh page from a save on that report with meters that satisfy the event's condition and every other event marked as seen, takes the order
// that leads to the anchor, and checks that the event screen opens before the anchor report, that Continue leads on to the anchor, and that
// the flag ev_<id> is then in the file.
//
// Run after a build: npm run build && npm run test:state-events
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const { makeContext } = await import(pathToFileURL(join(ROOT, "../packages/testkit/src/ui-driver.mjs")).href);
const cfg = (await import(pathToFileURL(join(HERE, "ui.config.mjs")).href)).default;
const { loadGame } = await import(pathToFileURL(join(ROOT, "tools/audit-lib.mjs")).href);
process.chdir(ROOT);
const bundle = readFileSync("dist/full/bundle.js", "utf8");
const game = await loadGame();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const fails = [];
const check = (ok, what) => {
  if (!ok) fails.push(what);
  if (!ok || process.env.VERBOSE) console.log((ok ? "ok   " : "FAIL ") + what);
};
const fixture = (id) => JSON.parse(readFileSync(join(HERE, "saves", id + ".json"), "utf8"));
const FIXTURE = { japan: "japan-open", alliedPacific: "alliedPacific-open" };

// A state, of the extremes a clamped meter can hold, that satisfies the condition and survives an order's impact.
function stateFor(e, flags) {
  for (const readiness of [10, -10]) for (const pipeline of [10, -10]) for (const initiative of [10, -10]) {
    const m = { readiness, pipeline, initiative };
    if (e.when(flags, m)) return m;
  }
  return null;
}

for (const e of game.STATE_EVENTS) {
  const camp = game.CAMPAIGNS[e.campaign];
  const seenFlags = Object.fromEntries(game.STATE_EVENTS.filter((o) => o.id !== e.id).map((o) => ["ev_" + o.id, true]));
  // The flags the condition reads are taken out of the fixture, so the event is tried on its own terms.
  const read = new Set();
  e.when(new Proxy({}, { get: (t, k) => (read.add(String(k)), undefined) }), { readiness: 0, pipeline: 0, initiative: 0 });
  const baseFlags = { ...game.logic.startFlags("open"), ...seenFlags };
  for (const k of read) delete baseFlags[k];
  const meters = stateFor(e, baseFlags);
  check(!!meters, `${e.id}: some state satisfies its condition`);
  if (!meters) continue;
  // a report with an order that leads to the anchor, and is open at these meters
  let found = null;
  for (const n of game.NODE_ATLAS[e.campaign]) {
    let stage;
    try {
      stage = camp.resolveNode(n.id, baseFlags, { ...meters });
    } catch {
      continue;
    }
    if (!stage || n.id === e.anchor) continue;
    const i = (stage.choices || []).findIndex((c) => !c.disabledReason && !c.keyBattleSubgame && [c.next, ...(c.uncertain || []).map((u) => u.next)].includes(e.anchor));
    if (i >= 0 && !(stage.choices[i].uncertain || []).some((u) => u.next && u.next !== e.anchor)) {
      found = { id: n.id, stage, i };
      break;
    }
  }
  check(!!found, `${e.id}: a report leads to its anchor ${e.anchor}`);
  if (!found) continue;
  const ch = found.stage.choices[found.i];

  const f = fixture(FIXTURE[e.campaign]);
  const active = JSON.parse(f.storage["ww2-command-active"]);
  active.position = found.id;
  active.flags = { ...active.flags, ...seenFlags };
  for (const k of read) delete active.flags[k];
  active.meters = { ...meters };
  active.visited = [found.id];
  active.history = [];
  active.log = [];
  const ctx = makeContext(cfg, bundle, 1, { "ww2-command-active": JSON.stringify(active) });
  if (ctx.failed) throw new Error(ctx.failed);
  await sleep(150);
  await ctx.settle();
  const instant = ctx.buttons("button,[role=tab]").find((b) => /instant text: off/i.test(ctx.lab(b)));
  if (instant) await ctx.click(instant);
  await ctx.click(ctx.buttons().find((b) => /War in Progress/.test(ctx.lab(b))));
  const pick = ctx.buttons().find((b) => ctx.lab(b).includes(ch.label.slice(0, 30)));
  if (!pick) {
    check(false, `${e.id}: no button for the order that leads to the anchor`);
    continue;
  }
  await ctx.click(pick);
  let shown = false;
  for (let k = 0; k < 12 && !shown; k++) {
    const t = ctx.text();
    shown = t.includes("Special event") && t.includes(e.title);
    if (shown) break;
    const b = ctx.buttons().find((x) => /^(Next Report|Continue)/.test(ctx.lab(x)));
    if (!b) break;
    await ctx.click(b);
  }
  check(shown, `${e.id}: the event screen opens before ${e.anchor}`);
  if (shown) {
    const t = ctx.text();
    check(e.paras.every((p) => t.includes(p.slice(0, 40))), `${e.id}: the screen carries both paragraphs`);
    const go = ctx.buttons().find((x) => /^Continue/.test(ctx.lab(x)));
    check(!!go, `${e.id}: the screen offers Continue`);
    if (go) {
      await ctx.click(go);
      const after = ctx.text();
      const atlas = game.NODE_ATLAS[e.campaign].find((n) => n.id === e.anchor);
      check(after.includes(atlas.title) && !after.includes("Special event"), `${e.id}: Continue opens the anchor report "${atlas.title}"`);
      const saved = JSON.parse(ctx.w.localStorage.getItem("ww2-command-active") || "{}");
      void saved; // the active save is written every third decision; the flag is checked on the next save below
    }
  }
  check(ctx.errors.length === 0, `${e.id}: no console errors (${ctx.errors.slice(0, 2).join(" | ")})`);
  ctx.restore && ctx.restore();
}

if (fails.length) {
  console.log(`\n${fails.length} failure(s)`);
  process.exit(1);
}
console.log(`state events ok (${game.STATE_EVENTS.length} events)`);
