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

// --- arrears -----------------------------------------------------------------------------------------------------
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
r = resolve(choice({ pipeline: -4 }), M(0, -8, 0));
check(r.meters.pipeline === -10 && r.flags.arrearsPipeline === 2, "a cost that takes a meter below -10 leaves the meter at -10 and the rest owed");
r = resolve(choice({ pipeline: 1 }), M(0, -10, 0), { arrearsPipeline: 2 });
check(r.meters.pipeline === -10 && r.flags.arrearsPipeline === 1, "a gain pays the arrears before it raises the meter");
r = resolve(choice({ pipeline: 3 }), M(0, -10, 0), { arrearsPipeline: 2 });
check(r.meters.pipeline === -9 && r.flags.arrearsPipeline === 0, "a gain larger than the arrears clears them and raises the meter by the rest");
r = resolve(choice({ pipeline: -5 }), M(0, -10, 0), { arrearsPipeline: 4 });
check(r.flags.arrearsPipeline === L.ARREARS_CAP, "arrears are capped");
r = resolve(choice({ pipeline: -2 }), M(0, 0, 0));
check(r.meters.pipeline === -2 && r.flags.arrearsPipeline === undefined, "an ordinary cost owes nothing");
r = resolve(choice({ readiness: -5, initiative: -3 }), M(-8, 0, -9));
check(r.meters.readiness === -10 && r.flags.arrearsReadiness === 3 && r.flags.arrearsInitiative === 2, "each meter keeps its own arrears");
check(L.arrearsOf({ arrearsPipeline: 3 }, "pipeline") === 3 && L.arrearsOf({}, "readiness") === 0, "arrearsOf reads the flag, and zero when there is none");

// --- strain ------------------------------------------------------------------------------------------------------
const stage = (c) => ({ choices: [c] });
check(L.strainOf({}, M(0, 0, 0)).points === 0, "no strain when nothing is short");
check(L.strainOf({}, M(0, -4, 0)).points === 0, "no strain at -4");
check(L.strainOf({}, M(0, -10, 0), "pipeline").points === 7 && eq(L.strainOf({}, M(-10, 0, 0), "pipeline").causes, []), "strain on one meter counts only that meter");
check(L.strainOf({}, M(0, -10, 0)).points === 7 && eq(L.strainOf({}, M(0, -10, 0)).causes, ["Pipeline"]), "Pipeline at -10 is 7 points of strain, and names the cause");
check(L.strainOf({ arrearsPipeline: 4 }, M(0, -10, 0)).points === 9, "arrears add to the strain");
check(L.strainOf({ arrearsReadiness: 6, arrearsPipeline: 6, arrearsInitiative: 6 }, M(-10, -10, -10)).points === 12, "strain is capped at 12 points");
const contested = choice({}, { uncertain: [{ weight: 60, impact: { readiness: 1 } }, { weight: 40, impact: { readiness: -2 } }] });
check(L.strainMeterOf(contested) === "readiness" && L.strainMeterOf(choice({}, { gateCheck: { label: "Pipeline" }, uncertain: [{ weight: 50, impact: { readiness: 2 } }, { weight: 50, impact: { readiness: -2 } }] })) === "pipeline" && L.strainMeterOf(choice({})) === null, "a decision is about the meter its check names, else the one its outcomes move most");
check(L.strainStage(stage(contested), {}, M(0, -10, 0)).choices[0] === contested, "a shortage of a meter the decision does not touch leaves it alone");
let st = L.strainStage(stage(contested), {}, M(-10, 0, 0));
let w = st.choices[0].uncertain.map((v) => v.weight);
check(Math.abs(w[0] - 53) < 1e-9 && Math.abs(w[1] - 47) < 1e-9 && st.choices[0].strain.points === 7, "strain moves points from the best outcome to the worst, and the choice says so");
check(L.strainStage(stage(contested), {}, M(0, 0, 0)).choices[0] === contested, "no strain leaves the choice untouched");
const battle = choice({}, { keyBattleSubgame: { id: "k" }, uncertain: [{ weight: 60, impact: { readiness: 1 } }, { weight: 40, impact: { readiness: -2 } }] });
check(L.strainStage(stage(battle), {}, M(-10, 0, 0)).choices[0] === battle, "a battle keeps its own arithmetic");
const flat = choice({}, { uncertain: [{ weight: 50, impact: { readiness: 1 } }, { weight: 50, impact: { readiness: 1 } }] });
check(L.strainStage(stage(flat), {}, M(-10, 0, 0)).choices[0] === flat, "outcomes that cost the same are left alone");
const nearly = choice({}, { uncertain: [{ weight: 6, impact: { readiness: 1 } }, { weight: 94, impact: { readiness: -2 } }] });
w = L.strainStage(stage(nearly), {}, M(-10, 0, 0)).choices[0].uncertain.map((v) => v.weight);
check(w[0] >= 5 - 1e-9 && Math.abs(w[0] + w[1] - 100) < 1e-9, "the best outcome is never drained below 5% and the weights still total the same");
r = L.resolveChoice({ stage: stage(L.strainStage(stage(contested), {}, M(-10, 0, 0)).choices[0]), index: 0, mode: "open", favor: 5, defiance: 0, flags: {}, meters: M(-10, 0, 0), rand: () => 0.55 });
check(r.rollIndex === 1, "the roll uses the strained weights (0.55 lands on the worse outcome at 53/47)");
r = L.resolveChoice({ stage: stage(contested), index: 0, mode: "open", favor: 5, defiance: 0, flags: {}, meters: M(-10, 0, 0), rand: () => 0.55 });
check(r.rollIndex === 0, "and the unstrained weights would have given the better one (60/40)");

if (fails.length) {
  console.error(`\n${fails.length} failure(s)`);
  process.exit(1);
}
console.log("\nlogic rules ok");
