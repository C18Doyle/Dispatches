// Every battle is reachable and plays through the real UI. The seeded baseline runs rarely reach the late-war battles, so this starts
// a fresh page from a save that sits on each hosting report (the committed fixture with its position, flags and meters changed),
// takes the choice that leads to battle planning, plans and fights the battle with the shared driver, and checks that the next
// report opens without a crash. Several seeds are played so that both outcomes of the roll are seen.
//
// Run after a build: npm run build && npm run test:battle-hosts
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

const fixture = (id) => JSON.parse(readFileSync(join(HERE, "saves", id + ".json"), "utf8"));
const GOOD = { readiness: 3, pipeline: 3, initiative: 3 };

// host: the report the save sits on. outcomes: the first words of the two outcome texts shown on the After Action page (win first).
// next: the report that may open after it.
const HOSTS = [
  { battle: "watchtowerAllied42", fixture: "alliedPacific-open", position: "guadalcanalAllied42", flags: { midwayAlliedPath: "ambush", kokodaAlliedPath: "support" }, outcomes: ["The Marines take Tulagi and the unfinished airfield", "Speculative. The raids from Rabaul and the early loss"], next: /Savo Island/ },
  { battle: "shoGo44", fixture: "japan-open", position: "leyteGulf44", flags: {}, outcomes: ["The decoy works. Halsey", "Speculative. Halsey does not take the bait"], next: /Taffy 3|Iwo Jima: The Doctrine/ },
  { battle: "iwoJimaJapan45", fixture: "japan-open", position: "iwoJima45", flags: {}, outcomes: ["Of about 21,000 defenders", "Speculative. The guns are silenced in the first days"], next: /Okinawa: What's Left to Spend/ },
  { battle: "okinawaJapan45", fixture: "japan-open", position: "okinawa45", flags: { iwoJimaPath: "hold" }, outcomes: ["On April 7 American carrier aircraft sink Yamato", "Speculative. The squadron is found early"], next: /Largest Submarines/ },
  { battle: "iwoJimaAllied45", fixture: "alliedPacific-open", position: "iwoJimaAllied45", flags: {}, outcomes: ["The compressed bombardment fails", "Speculative. The guns on Suribachi"], next: /Okinawa: The Picket Line/ },
  { battle: "okinawaAllied45", fixture: "alliedPacific-open", position: "okinawaAllied45", flags: { iwoJimaAlliedPath: "compressed" }, outcomes: ["The picket destroyers absorb", "Speculative. The stations are overwhelmed"], next: /Incendiary Campaign/ },
];

function saveFor(h, seed) {
  const f = fixture(h.fixture);
  const active = JSON.parse(f.storage["ww2-command-active"]);
  active.position = h.position;
  active.flags = { ...active.flags, ...h.flags };
  active.meters = seed % 2 ? { ...GOOD } : { readiness: -2, pipeline: -2, initiative: -2 };
  active.visited = [h.position];
  active.history = [];
  active.log = [];
  return { "ww2-command-active": JSON.stringify(active) };
}

async function playOnce(h, seed) {
  const ctx = makeContext(cfg, bundle, seed, saveFor(h, seed));
  if (ctx.failed) throw new Error(ctx.failed);
  await sleep(200);
  await ctx.settle();
  const instant = ctx.buttons("button,[role=tab]").find((b) => /instant text: off/i.test(ctx.lab(b)));
  if (instant) await ctx.click(instant);
  const resume = ctx.buttons().find((b) => /War in Progress/.test(ctx.lab(b)));
  if (!resume) return { error: "no resume button", ctx };
  await ctx.click(resume);
  let sawBattle = false;
  let outcome = null;
  const policy = { approachChosen: true };
  for (let i = 0; i < 120; i++) {
    const t = ctx.text();
    if (/Battle Report|Before Committing/.test(t)) sawBattle = true;
    if (/^After Action Report/.test(t)) for (const o of h.outcomes) if (t.includes(o)) outcome = o;
    if (outcome && h.next.test(t) && !/^After Action Report/.test(t)) break;
    const b = ctx.buttons().find((x) => /Leads to battle planning/.test(ctx.lab(x))) || cfg.choose(ctx, policy);
    if (!b) break;
    await ctx.click(b);
  }
  const t = ctx.text();
  return { ctx, sawBattle, outcome, reachedNext: h.next.test(t), errors: ctx.errors.slice() };
}

for (const h of HOSTS) {
  const seen = new Set();
  for (let seed = 1; seed <= 16 && !(seed > 2 && seen.has(h.outcomes[0]) && seen.has(h.outcomes[1])); seed++) {
    let r;
    try {
      r = await playOnce(h, seed);
    } catch (e) {
      check(false, `${h.battle} seed ${seed}: threw ${e.message}`);
      continue;
    }
    if (r.error) {
      check(false, `${h.battle} seed ${seed}: ${r.error}`);
      continue;
    }
    check(r.sawBattle, `${h.battle} seed ${seed}: the choice opens the Order of Battle`);
    check(!!r.outcome, `${h.battle} seed ${seed}: the roll names one of its two outcomes`);
    check(r.reachedNext, `${h.battle} seed ${seed}: the next report opens`);
    check(r.errors.length === 0, `${h.battle} seed ${seed}: no console errors (${r.errors.slice(0, 2).join(" | ")})`);
    if (process.env.DEBUG) console.log(h.battle, seed, r.outcome);
    if (r.outcome) seen.add(r.outcome);
    r.ctx.restore && r.ctx.restore();
  }
  check(seen.has(h.outcomes[0]) && seen.has(h.outcomes[1]), `${h.battle}: both outcomes were played across the seeds (${[...seen].join("; ") || "none"})`);
}

if (fails.length) {
  console.log(`\n${fails.length} failure(s)`);
  process.exit(1);
}
console.log(`battle hosts ok (${HOSTS.length} battles)`);
