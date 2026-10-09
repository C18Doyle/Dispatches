// The pure rules added in round 24, checked directly against src/logic.ts: arrears, strain, the stack cap on a
// battle's charges, the five micro-state bands and the command rank. Run: npm run test:logic
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
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const choice = (impact, extra = {}) => ({ label: "x", impact, ...extra });
const stage = (c) => ({ choices: [c] });
const resolve = (c, meters, flags = {}, extra = {}) => L.resolveChoice({ stage: stage(c), index: 0, mode: "open", favor: 5, defiance: 0, flags, meters, rand: () => 0.5, ...extra });
const M = (manpower, fuel, initiative) => ({ manpower, fuel, initiative });

// --- arrears -----------------------------------------------------------------------------------------------------
let r = resolve(choice({ fuel: -3 }), M(0, -9, 0));
check(r.meters.fuel === -10 && r.flags.arrearsFuel === 2, "a cost that takes a meter below -10 leaves the meter at -10 and the rest owed");
r = resolve(choice({ fuel: 1 }), M(0, -10, 0), { arrearsFuel: 2 });
check(r.meters.fuel === -10 && r.flags.arrearsFuel === 1, "a gain pays the arrears before it raises the meter");
r = resolve(choice({ fuel: 3 }), M(0, -10, 0), { arrearsFuel: 2 });
check(r.meters.fuel === -9 && r.flags.arrearsFuel === 0, "a gain larger than the arrears clears them and raises the meter by the rest");
r = resolve(choice({ fuel: -5 }), M(0, -10, 0), { arrearsFuel: 4 });
check(r.flags.arrearsFuel === L.ARREARS_CAP, "arrears are capped");
r = resolve(choice({ fuel: -2 }), M(0, 0, 0));
check(r.meters.fuel === -2 && r.flags.arrearsFuel === undefined, "an ordinary cost owes nothing");
r = resolve(choice({ manpower: -4, initiative: -1 }), M(-8, 0, -10));
check(r.meters.manpower === -10 && r.flags.arrearsManpower === 2 && r.flags.arrearsInitiative === 1, "each meter keeps its own arrears");
check(L.arrearsOf({ arrearsFuel: 3 }, "fuel") === 3 && L.arrearsOf({}, "manpower") === 0, "arrearsOf reads the flag, and zero when there is none");

// --- strain ------------------------------------------------------------------------------------------------------
check(L.strainOf({}, M(0, 0, 0)).points === 0, "no strain when nothing is short");
check(L.strainOf({}, M(0, -4, 0)).points === 0, "no strain at -4");
check(L.strainOf({}, M(0, -10, 0), "fuel").points === 7 && eq(L.strainOf({}, M(-10, 0, 0), "fuel").causes, []), "strain on one meter counts only that meter");
check(L.strainOf({}, M(0, -10, 0)).points === 7 && eq(L.strainOf({}, M(0, -10, 0)).causes, ["Matériel"]), "Matériel at -10 is 7 points of strain, and names the cause");
check(L.strainOf({ arrearsFuel: 4 }, M(0, -10, 0)).points === 9, "arrears add to the strain");
check(L.strainOf({ arrearsManpower: 6, arrearsFuel: 6, arrearsInitiative: 6 }, M(-10, -10, -10)).points === 12, "strain is capped at 12 points");
const contested = choice({}, { uncertain: [{ weight: 60, impact: { manpower: 1 } }, { weight: 40, impact: { manpower: -2 } }] });
check(L.strainMeterOf(contested) === "manpower" && L.strainMeterOf(choice({}, { checkLabel: "Matériel", uncertain: [{ weight: 50, impact: { manpower: 2 } }, { weight: 50, impact: { manpower: -2 } }] })) === "fuel" && L.strainMeterOf(choice({})) === null, "a decision is strained by the meter it names, else the one its outcomes move most");
check(L.strainStage(stage(contested), {}, M(0, -10, 0)).choices[0] === contested, "a shortage of a meter the decision does not touch leaves it alone");
let st = L.strainStage(stage(contested), {}, M(-10, 0, 0));
let w = st.choices[0].uncertain.map((v) => v.weight);
check(Math.abs(w[0] - 53) < 1e-9 && Math.abs(w[1] - 47) < 1e-9 && st.choices[0].strain.points === 7, "strain moves points from the best outcome to the worst, and the choice says so");
check(L.strainStage(stage(contested), {}, M(0, 0, 0)).choices[0] === contested, "no strain leaves the choice untouched");
const battle = choice({}, { keyBattleSubgame: { id: "k" }, uncertain: [{ weight: 60, impact: { manpower: 1 } }, { weight: 40, impact: { manpower: -2 } }] });
check(L.strainStage(stage(battle), {}, M(-10, 0, 0)).choices[0] === battle, "a battle keeps its own arithmetic");
const flat = choice({}, { uncertain: [{ weight: 50, impact: { manpower: 1 } }, { weight: 50, impact: { manpower: 1 } }] });
check(L.strainStage(stage(flat), {}, M(-10, 0, 0)).choices[0] === flat, "outcomes that cost the same are left alone");
const nearly = choice({}, { uncertain: [{ weight: 6, impact: { manpower: 1 } }, { weight: 94, impact: { manpower: -2 } }] });
w = L.strainStage(stage(nearly), {}, M(-10, 0, 0)).choices[0].uncertain.map((v) => v.weight);
check(w[0] >= 5 - 1e-9 && Math.abs(w[0] + w[1] - 100) < 1e-9, "the best outcome is never drained below 5% and the weights still total the same");
r = resolve(L.strainStage(stage(contested), {}, M(-10, 0, 0)).choices[0], M(-10, 0, 0), {}, { rand: () => 0.55 });
check(r.rollIndex === 1, "the roll uses the strained weights (0.55 lands on the worse outcome at 53/47)");
r = resolve(contested, M(-10, 0, 0), {}, { rand: () => 0.55 });
check(r.rollIndex === 0, "and the unstrained weights would have given the better one (60/40)");

// --- a battle may not charge the same fault twice ------------------------------------------------------------------------
const rolled = (impact) => choice({}, { keyBattleSubgame: { id: "k" }, uncertain: [{ weight: 50, impact: { manpower: 1 } }, { weight: 50, impact }] });
const lose = { rand: () => 0.9, subgame: { finalAllocation: {}, poolSize: 6, bonus: 0 } };
r = resolve(rolled({ manpower: -2 }), M(0, 0, 0), {}, { ...lose, planCostsFor: () => ({ totals: M(-2, -1, 0), grade: "costly" }) });
check(r.meters.manpower === -3, "where the outcome already costs 2, the plan adds at most 1 (outcome -2, plan -2 gives -3)");
check(r.meters.fuel === -1, "a meter the outcome did not hit takes the plan's whole charge");
r = resolve(rolled({ manpower: -1 }), M(0, 0, 0), {}, { ...lose, planCostsFor: () => ({ totals: M(-2, 0, 0), grade: "costly" }) });
check(r.meters.manpower === -3, "a small outcome impact does not trigger the cap");

// --- the five bands ---------------------------------------------------------------------------------------------------------
const bandsAt = (v) => L.strandReadout("fuel", {}, M(0, v, 0))[0].band;
check(bandsAt(-10) === "Exhausted" && bandsAt(-8) === "Exhausted", "Matériel at -8 or below reads Exhausted");
check(bandsAt(-7) === "Short" && bandsAt(-4) === "Short" && bandsAt(-3) === "Strained" && bandsAt(-1) === "Strained" && bandsAt(0) === "Adequate" && bandsAt(3) === "Adequate" && bandsAt(4) === "Plentiful", "the other four bands keep their edges");
check(L.strandReadout("manpower", {}, M(-10, 0, 0))[1].band === "Raw recruits" && L.strandReadout("initiative", {}, M(0, 0, 10))[0].band === "Penetrating", "Manpower and Initiative have their own words at each end");
let flags = {};
const veteran = choice({ manpower: 2 }, { label: "Raise veteran cadres and train the officers" });
flags = resolve(veteran, M(0, 0, 0), flags).flags;
check(flags.manExp === 2, "a Manpower impact about veterans and training is filed to Experience");
const intel = choice({ initiative: 1 }, { label: "Send reconnaissance and break the codes" });
check(resolve(intel, M(0, 0, 0)).flags.iniInt === 1, "an Initiative impact about intelligence is filed to Intelligence");

// --- the command rank --------------------------------------------------------------------------------------------------------
const rate = (o) => L.commandRating({ tier: "Contested Outcome", removed: false, total: 0, battles: [], judged: [], objectives: 0, mode: "open", ...o });
check(rate({ tier: "Major Defeat", total: -12 }).rank === "Private", "a heavy defeat with a spent command and nothing else to judge is a Private");
check(rate({ tier: "Major Victory", total: 6 }).rankIndex < 7, "a victory with no battles and nothing to judge cannot reach General");
check(rate({ tier: "Major Victory", total: 8, battles: [{ grade: "clean", staff: false }, { grade: "clean", staff: false }], judged: [{ sum: 2, histSum: 0 }, { sum: 1, histSum: 0 }], objectives: 4 }).rank === "General", "a major victory with clean battles and sound judgement is a General");
check(rate({ removed: true, tier: "Major Victory", total: 10, battles: [{ grade: "clean", staff: false }], judged: [{ sum: 3, histSum: 0 }], objectives: 5 }).rankIndex === 3, "being removed from command caps the rank at Lieutenant");
check(rate({ mode: "easy", tier: "Major Victory", total: 10, battles: [{ grade: "clean", staff: false }], judged: [{ sum: 3, histSum: 0 }], objectives: 5 }).rankIndex <= 6, "the training-wheels mode cannot reach General");
const same = { tier: "Minor Victory", total: 3, battles: [{ grade: "costly", staff: false }], judged: [{ sum: 1, histSum: 1 }], objectives: 1 };
check(rate({ ...same, mode: "iron" }).score > rate({ ...same, mode: "open" }).score && rate({ ...same, mode: "open" }).score > rate({ ...same, mode: "easy" }).score, "a harder mode scores higher than standard, which scores higher than easy");
check(rate({ battles: [{ grade: "clean", staff: true }] }).parts.find((p) => p.id === "battles").points < rate({ battles: [{ grade: "clean", staff: false }] }).parts.find((p) => p.id === "battles").points, "a battle the staff planned scores a little less than one the player planned");
check(rate({}).parts.length === 5 && rate({}).score >= 0 && rate({}).score <= 100, "five parts, and a score between 0 and 100");

// --- the ending is scored against the best ending open to the command's path --------------------------------------------------
const perfect = { total: 8, battles: [{ grade: "clean", staff: false }, { grade: "clean", staff: false }], judged: [{ sum: 2, histSum: 0 }, { sum: 1, histSum: 0 }], objectives: 4, mode: "open" };
const endingPoints = (o) => rate(o).parts.find((p) => p.id === "ending").points;
check(endingPoints({ ...perfect, tier: "Contested Outcome", ceiling: "Contested Outcome" }) === 30, "the best ending open to a path earns the full 30 points");
check(rate({ ...perfect, tier: "Contested Outcome", ceiling: "Contested Outcome" }).rank === "General", "a flawless command on a path whose best ending is a contested outcome can be a General");
check(rate({ ...perfect, tier: "Minor Defeat", ceiling: "Minor Defeat" }).rank === "General", "so can one whose best ending is a minor defeat (the Salò Republic's best)");
check(rate({ ...perfect, tier: "Minor Defeat" }).rank !== "General", "without a ceiling the same ending cannot (the old scale: 76 at best)");
check(rate({ ...perfect, tier: "Major Defeat", ceiling: "Contested Outcome" }).rank !== "General", "a spent army on the same path still cannot");
check(endingPoints({ tier: "Minor Victory", ceiling: "Major Victory" }) === 24, "a path that can win outright is scored as before");
check(rate({ tier: "Minor Defeat", ceiling: "Contested Outcome" }).parts.find((p) => p.id === "ending").fact.includes("the best ending open to this command is a contested outcome"), "the rank panel says what the best open ending was");
check(L.endingCeilingKey("italy", { italyPath: "coBelligerent" }) === "italy:coBelligerent" && L.endingCeilingKey("italy", { italyPath: "rsi" }) === "italy:rsi" && L.endingCeilingKey("italy", { italyEntry: "neutral" }) === "italy:neutral" && L.endingCeilingKey("italy", {}) === "italy:other" && L.endingCeilingKey("soviet", {}) === "soviet", "the ceiling key follows Italy's split at the armistice");
check(L.endingCeiling("soviet", {}) === "Major Victory" && L.endingCeiling("italy", { italyPath: "rsi" }) === "Minor Defeat", "ceilings are read from the table");

if (fails.length) {
  console.log(`\n${fails.length} check(s) failed`);
  process.exit(1);
}
console.log("\nlogic rules: all checks passed");
