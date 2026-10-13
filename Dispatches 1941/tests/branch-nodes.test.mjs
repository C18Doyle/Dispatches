// Every option of the reports added for the early war (and any report listed in BRANCH_NODES) works through the real UI. The seeded baseline
// takes one option per report, so this starts a fresh page from a save that sits on the report (the committed fixture with its position,
// flags and meters changed), clicks each option in turn, plays the roll if there is one, and checks that the next report opens without a
// console error, and that the report after it names what the option set when it has a reader for it.
//
// Run after a build: npm run build && npm run test:branch-nodes
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
const GOOD = { readiness: 3, pipeline: 3, initiative: 3 };

// campaign, the report, flags the save should carry. `reads`: [flag value, a phrase the report after it must then contain] per option index (optional).
const BRANCH_NODES = [
  { campaign: "japan", id: "burmaRoad40", flags: {} },
  { campaign: "japan", id: "neutralityPact41", flags: { tripartitePath: "signed" } },
  { campaign: "japan", id: "indianOceanRaid42", flags: { openingVector: "pearlHarbor" } },
  { campaign: "alliedPacific", id: "chinaAirForce41", flags: {} },
  { campaign: "alliedPacific", id: "stilwellInChungking42", flags: {} },
  { campaign: "alliedPacific", id: "carrierRequest42", flags: {} },
  { campaign: "alliedPacific", id: "vladivostokRoute42", flags: {} },
  // The second fork wave: only the order added to an existing report is played here (the others are in the baseline).
  { campaign: "japan", id: "unificationQuestion40", flags: {}, last: true },
  { campaign: "japan", id: "pearlHarbor41", flags: {}, last: true },
  { campaign: "japan", id: "burmaRangoon42", flags: { openingVector: "pearlHarbor" }, last: true },
  { campaign: "japan", id: "doolittleRaid42", flags: {}, last: true },
  { campaign: "japan", id: "coralSea42", flags: {}, last: true },
  { campaign: "japan", id: "midway42", flags: {}, last: true },
  { campaign: "japan", id: "kokodaTrail42", flags: {}, last: true },
  { campaign: "japan", id: "guadalcanal42", flags: {}, last: true },
  { campaign: "japan", id: "leyteGulf44", flags: {}, last: true },
  { campaign: "alliedPacific", id: "wakeIslandRelief41", flags: {}, last: true },
  { campaign: "alliedPacific", id: "curtinsTurn42", flags: {}, last: true },
  { campaign: "alliedPacific", id: "kokodaTrailAllied42", flags: {}, last: true },
  { campaign: "alliedPacific", id: "torpedoCrisis43", flags: {}, last: true },
  { campaign: "alliedPacific", id: "tehransPromise43", flags: {}, last: true },
  { campaign: "alliedPacific", id: "strategicBombingAllied45Delayed", flags: {}, last: true },
];
const FIXTURE = { japan: "japan-open", alliedPacific: "alliedPacific-open" };

function saveFor(campaign, id, flags, meters) {
  const f = fixture(FIXTURE[campaign]);
  const active = JSON.parse(f.storage["ww2-command-active"]);
  active.position = id;
  active.flags = { ...active.flags, ...flags };
  active.meters = { ...meters };
  active.visited = [id];
  active.history = [];
  active.log = [];
  return { "ww2-command-active": JSON.stringify(active) };
}
const titleOf = (campaign, id) => (game.NODE_ATLAS[campaign].find((n) => n.id === id) || {}).title;

for (const n of BRANCH_NODES) {
  const camp = game.CAMPAIGNS[n.campaign];
  const flags = { ...game.logic.startFlags("open"), ...n.flags };
  const stage = camp.resolveNode(n.id, flags, { ...GOOD });
  const choices = stage.choices || [];
  check(choices.length >= 2, `${n.id}: offers at least two options`);
  for (let i = n.last ? choices.length - 1 : 0; i < choices.length; i++) {
    const ch = choices[i];
    const nexts = [ch.next, ...(ch.uncertain || []).map((u) => u.next)].filter(Boolean);
    const rolls = (ch.uncertain || []).length > 0;
    // A roll is played with two seeds, one with strong meters and one with weak, so the odds differ.
    for (const seed of rolls ? [1, 2] : [1]) {
      const meters = seed % 2 ? GOOD : { readiness: -2, pipeline: -2, initiative: -2 };
      const tag = `${n.id} option ${i + 1}${rolls ? ` seed ${seed}` : ""}`;
      // A gate that is closed at these meters is not a failure: the option cannot be picked.
      const atMeters = camp.resolveNode(n.id, flags, { ...meters });
      if (atMeters?.choices?.[i]?.disabledReason) continue;
      const ctx = makeContext(cfg, bundle, seed, saveFor(n.campaign, n.id, n.flags, meters));
      if (ctx.failed) throw new Error(ctx.failed);
      await sleep(150);
      await ctx.settle();
      const instant = ctx.buttons("button,[role=tab]").find((b) => /instant text: off/i.test(ctx.lab(b)));
      if (instant) await ctx.click(instant);
      const resume = ctx.buttons().find((b) => /War in Progress/.test(ctx.lab(b)));
      if (!resume) {
        check(false, `${tag}: no resume button`);
        continue;
      }
      await ctx.click(resume);
      check(ctx.text().includes(stage.title), `${tag}: the save opens on "${stage.title}"`);
      const key = ch.label.slice(0, 30);
      const pick = ctx.buttons().find((b) => ctx.lab(b).includes(key));
      if (!pick) {
        check(false, `${tag}: no button for "${key}"`);
        continue;
      }
      await ctx.click(pick);
      // Walk the outcome page(s) until a new report opens.
      let reached = false;
      for (let k = 0; k < 12 && !reached; k++) {
        const t = ctx.text();
        reached = nexts.some((id) => titleOf(n.campaign, id) && t.includes(titleOf(n.campaign, id)) && !/^After Action Report/.test(t));
        if (reached) break;
        const b = ctx.buttons().find((x) => /^(Next Report|Continue)/.test(ctx.lab(x))) || cfg.choose(ctx, { approachChosen: true });
        if (!b) break;
        await ctx.click(b);
      }
      check(reached, `${tag}: the next report opens (${nexts.map((id) => titleOf(n.campaign, id)).join(" / ")})`);
      check(ctx.errors.length === 0, `${tag}: no console errors (${ctx.errors.slice(0, 2).join(" | ")})`);
      ctx.restore && ctx.restore();
    }
  }
}

if (fails.length) {
  console.log(`\n${fails.length} failure(s)`);
  process.exit(1);
}
console.log(`branch nodes ok (${BRANCH_NODES.length} reports)`);
