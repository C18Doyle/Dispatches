// The pure rules of src/logic.ts that the UI depends on: the three readings under each meter and the Easy mode's start.
// Run: npm run test:logic
import { buildSync } from "esbuild";
import { createRequire } from "node:module";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(mkdtempSync(path.join(tmpdir(), "logic-")), "logic.cjs");
buildSync({ entryPoints: [path.join(ROOT, "src/logic.ts")], bundle: true, platform: "node", format: "cjs", outfile: out, logLevel: "error" });
const L = createRequire(import.meta.url)(out);

const fails = [];
const check = (ok, what) => {
  if (!ok) fails.push(what);
  console.log((ok ? "ok   " : "FAIL ") + what);
};

const choice = (impact, extra = {}) => ({ label: "x", impact, ...extra });
const resolve = (c, meters, flags = {}, mode = "open") => L.resolveChoice({ stage: { choices: [c] }, index: 0, mode, favor: 5, defiance: 0, flags, meters, rand: () => 0.5 });
const M = (readiness, pipeline, initiative) => ({ readiness, pipeline, initiative });

// --- which reading an impact falls on ----------------------------------------------------------------------------
check(L.strandOf("readiness", { label: "Rebuild the carrier air groups with newly trained pilots" }) === "trn", "training words file a readiness impact under Training");
check(L.strandOf("pipeline", { label: "Convoy the tankers from Palembang" }) === "oil" || L.strandOf("pipeline", { label: "Convoy the tankers from Palembang" }) === "shp", "oil and shipping words file a pipeline impact under a pipeline reading");
check(L.strandOf("pipeline", { label: "Convoy the tankers from Palembang to the home islands", outcome: "Fuel and oil arrive." }) === "oil", "the reading with the most words wins");
check(L.strandOf("initiative", { label: "Break the codes and read the intercepts" }) === "int", "intelligence words file an initiative impact under Intelligence");
check(L.strandOf("readiness", { label: "Nothing in particular" }) === "flt" && L.strandOf("pipeline", { label: "Nothing" }) === "shp" && L.strandOf("initiative", { label: "Nothing" }) === "tmp", "an impact whose text names nothing falls on the meter's default reading");

// --- the tallies and the bands -----------------------------------------------------------------------------------
let r = resolve(choice({ readiness: 2 }, { label: "Train new aircrews" }), M(0, 0, 0));
check(r.flags.rdyTrn === 2 && r.meters.readiness === 2, "an impact adds to its reading's tally and to the headline");
r = resolve(choice({ readiness: 1, pipeline: -2 }, { label: "Ship the tankers", outcome: "Fuel is short." }), M(0, 0, 0));
check(r.flags.pipOil === -2 && r.flags.pipShp === undefined, "each meter files its own impact");
r = resolve(choice({}), M(0, 0, 0));
check(Object.keys(r.flags).length === 0, "a choice with no impact leaves no tally");
let read = L.strandReadout("readiness", { rdyTrn: 4, rdyFlt: -2, rdyMor: -2 }, M(0, 0, 0));
check(read.length === 3 && read[0].score > read[1].score && read[1].score === read[2].score, "a reading above the average of its meter's tallies reads better than the others");
read = L.strandReadout("pipeline", {}, M(-10, -10, -10));
check(read.every((x) => x.level === 0) && read[0].band === "Exhausted", "a meter at the floor puts every reading at its worst band");
read = L.strandReadout("initiative", {}, M(0, 0, 10));
check(read.every((x) => x.level === 4), "a meter at the top puts every reading at its best band");
check(L.strandReadout("readiness", {}, M(-8, 0, 0))[0].level === 0 && L.strandReadout("readiness", {}, M(-7, 0, 0))[0].level === 1, "the worst band is reserved for -8 or below");

// --- modes -------------------------------------------------------------------------------------------------------
check(Object.keys(L.startFlags("easy")).length === 0 && Object.keys(L.startFlags("open")).length === 0, "Easy and Normal start with no flags");
check(L.startFlags("fanatical").hardMode === true && L.startFlags("coalition").hardMode === true, "the hard modes seed hardMode");
r = resolve(choice({ readiness: 1 }), M(0, 0, 0), {}, "easy");
check(r.meters.readiness === 1, "Easy resolves a choice exactly as Normal does");


// --- the command rank --------------------------------------------------------------------------------------------
const base = { tier: "Minor Victory", ceiling: "Major Victory", removed: false, total: 3, battles: [], judged: [{ sum: 2, histSum: 0 }], objectives: 2, mode: "open" };
let rk = L.commandRating(base);
check(rk.score >= 0 && rk.score <= 100 && L.COMMAND_RANKS[rk.rankIndex] === rk.rank, "the rank is a word from Private to General for a score from 0 to 100");
check(L.commandRating({ ...base, tier: "Major Defeat" }).score < rk.score, "a worse ending scores lower");
check(L.commandRating({ ...base, tier: "Major Victory", total: 10, judged: [{ sum: 5, histSum: 0 }], objectives: 4 }).rank === "General", "a major victory with a command left in good order, ahead of history, with the objectives, is a General");
rk = L.commandRating({ ...base, tier: "Major Victory", total: 10, removed: true });
check(rk.rankIndex <= 3 && rk.parts[0].points === 0, "being removed from command scores the ending at nothing and holds the rank at Lieutenant or below");
rk = L.commandRating({ ...base, tier: "Major Victory", total: 10, judged: [{ sum: 5, histSum: 0 }], objectives: 4, mode: "easy" });
check(rk.rankIndex <= 6 && rk.capped !== null, "Easy cannot reach General");
check(L.commandRating({ ...base, mode: "fanatical" }).score > L.commandRating(base).score && L.commandRating({ ...base, mode: "easy" }).score < L.commandRating(base).score, "a hard mode adds to the score and Easy takes from it");
rk = L.commandRating({ ...base, tier: "Contested Outcome", ceiling: "Contested Outcome" });
check(rk.parts[0].points === 30, "an ending that is the best open to the command earns the full thirty");
check(L.endingCeiling("japan") === "Major Victory" && L.endingCeiling("alliedPacific") === "Major Victory", "both Pacific commands are scored against a major victory");

if (fails.length) {
  console.error(`\n${fails.length} failure(s)`);
  process.exit(1);
}
console.log("\nlogic rules ok");
