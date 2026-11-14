// The year's effort (src/effort.ts) and how a headquarters runs its war (src/command.ts), with the rivalries (src/rivals.ts): the year's new
// strength, the allocations of four commands, the command style, the timing of a battle, what a battle's result asks, the Casablanca bargain and
// the staff's estimate. Run: npm run test:logic
import { buildSync } from "esbuild";
import { createRequire } from "node:module";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = mkdtempSync(path.join(tmpdir(), "effort-"));
const load = (name) => {
  const out = path.join(dir, name + ".cjs");
  buildSync({ entryPoints: [path.join(ROOT, "src", name + ".ts")], bundle: true, platform: "node", format: "cjs", outfile: out, logLevel: "error" });
  return createRequire(import.meta.url)(out);
};
const E = load("effort");
const C = load("command");
const L = load("logic");
const P = load("logic-pacific");

const fails = [];
const check = (ok, what) => {
  if (!ok) fails.push(what);
  console.log((ok ? "ok   " : "FAIL ") + what);
};
const M = (manpower, fuel, initiative = 0) => ({ manpower, fuel, initiative });

// ---- The year's new strength ----
check(E.reportYear("JUNE 1942") === 1942 && E.reportYear("1943 – 1944") === 1943 && E.reportYear("") === null, "a report's year is the first year its date names");
let r = E.yearTurn({}, M(-8, -6), 1942, 1941);
check(r.meters.manpower === -6 && r.meters.fuel === -4 && r.flags.yearCounted === 1942, "a new year restores two points to a meter at -5 or lower");
r = E.yearTurn({}, M(-4, -9), 1942, 1941);
check(r.meters.manpower === -4 && r.meters.fuel === -7, "a meter above -5 is left alone");
r = E.yearTurn({ yearCounted: 1942 }, M(-8, -8), 1942, 1942);
check(r.meters.manpower === -8 && r.restored === null, "the same year is counted once");
r = E.yearTurn({}, M(-8, -8), 1941, 1941);
check(r.meters.manpower === -8 && r.flags.yearCounted === 1941, "the first report of the file's own year only sets the year");
r = E.yearTurn({ arrearsManpower: 1 }, M(-10, 0), 1943, 1942);
check(r.meters.manpower === -9 && r.flags.arrearsManpower === 0, "what is owed on a meter is paid first");
r = E.yearTurn({}, M(-9, -9, -9), 1943, 1942);
check(r.meters.initiative === -9, "Initiative is not made in factories");
check(E.restoredIn(r.flags, 1943).manpower === 2 && E.restoredIn(r.flags, 1944) === null, "what was restored is kept for the briefing");

// ---- The allocation of effort ----
for (const cmd of ["american", "german", "japan", "soviet"]) {
  const p = E.EFFORT_PLANS[cmd];
  for (const y of p.years) {
    const fx = E.allocationEffect(cmd, p.record[y], y);
    check(fx.first === 0 && fx.second === 0 && fx.materiel === 0, `${cmd} ${y}: the record's share (${p.record[y]}) moves nothing and costs nothing`);
  }
}
check(E.effortDue("american", {}, 1942) === null && E.effortDue("american", { trkOpen_E: true }, 1942) === 1942, "the Joint Chiefs' first allocation waits for the war in Europe to open");
check(E.effortDue("german", { barbarossa: "launched" }, 1942) === 1942 && E.effortDue("german", { barbarossa: "launched", effort_1942: "even" }, 1942) === null, "OKW's allocation is due once a year, from 1942");
check(E.effortDue("german", { barbarossa: "cancelled" }, 1942) === null && E.effortDue("german", {}, 1941) === null, "and only in a file whose war in the East began in 1941");
check(E.effortDue("japan", {}, 1942) === null && E.effortDue("japan", { openingVector: "pearlHarbor" }, 1942) === 1942, "IGHQ's waits for the war in the Pacific to open");
check(E.effortDue("italy", {}, 1942) === null && E.effortDue("british", {}, 1942) === null, "Comando Supremo and the War Cabinet have no allocation");
check(E.effortFlag("american", 1943) === "usEffort_1943" && E.effortFlag("japan", 1943) === "effort_1943", "the Joint Chiefs keep the flag their saves already use");

const usPac42 = { usEffort_1942: "pacificFirst" };
check(E.chitsForBattle("american", usPac42, "midwayAllied42", 1942) === 1 && E.chitsForBattle("american", usPac42, "omaha", 1942) === -1, "Pacific first in 1942: a Pacific battle has a chit more, a European one a chit fewer");
check(E.chitsForBattle("american", usPac42, "omaha", 1943) === -1, "what was not shipped last year is still missing this year");
check(E.chitsForBattle("american", usPac42, "omaha", 1944) === 0, "and two years on it has been made up");
const usPac2 = { usEffort_1943: "pacificFirst", usEffort_1944: "pacificFirst" };
check(E.chitsForBattle("american", usPac2, "philippineSea44", 1944) === 2 && E.chitsForBattle("american", usPac2, "bastogne44", 1944) === -2, "never more than two chits either way");
check(E.chitsForBattle("american", usPac42, "notListed", 1942) === 0, "a battle on neither side is left alone");
check(E.allocationMateriel("american", "pacificFirst", 1942) === -1 && E.allocationMateriel("american", "pacificFirst", 1944) === -2, "moving effort between theatres costs a point of Matériel a step");
const sovFactories43 = { effort_1943: "factoriesFirst" };
check(E.chitsForBattle("soviet", sovFactories43, "kurskSoviet43", 1943) === -1 && E.chitsForBattle("soviet", sovFactories43, "bagrationSoviet44", 1944) === 1, "STAVKA, the factories first: this year's battles a chit short, next year's a chit ahead");
check(E.allocationMateriel("soviet", "factoriesFirst", 1943) === 1 && E.allocationMateriel("soviet", "frontFirst", 1943) === -1, "and the factories add Matériel while the front costs it");
check(E.chitsForBattle("german", { effort_1942: "even" }, "elAlamein", 1942) === 1 && E.chitsForBattle("german", { effort_1942: "even" }, "stalingrad", 1942) === -1, "OKW, an even hand in 1942: the desert gains what Stalingrad loses");
check(E.chitsForBattle("japan", { effort_1945: "even" }, "okinawaJapan45", 1945) === -1, "IGHQ, an even hand in 1945: the army's battles a chit short");
const rows = E.allocationRecord("american", { usEffort_1942: "even", usEffort_1943: "pacificFirst" });
check(rows.length === 2 && rows[1].chosen === "pacificFirst" && rows[1].record === "even", "the record of the file lists each allocated year against the record's");
check(E.reckoningAt("american", { usEffort_1942: "pacificFirst", usEffort_1943: "pacificFirst", usEffort_1944: "even" }, "yaltaFeb45") === -3, "at Yalta the European shortfall costs Initiative, a point a step");
check(E.reckoningAt("american", { usEffort_1942: "pacificFirst", usEffort_1943: "pacificFirst", usEffort_1944: "pacificFirst", usEffort_1945: "pacificFirst" }, "yaltaFeb45") === -3, "at most three");
check(E.reckoningAt("american", { usEffort_1942: "germanyFirst" }, "yaltaFeb45") === 0, "giving Europe more than the record did owes nothing");
check(E.reckoningAt("american", { usEffort_1942: "pacificFirst", reckoned_yaltaFeb45: -1 }, "yaltaFeb45") === 0 && E.reckoningAt("american", { usEffort_1942: "pacificFirst" }, "elbe45") === 0, "counted once, and only at Yalta");

// ---- Command style ----
const bold = { label: "attack", uncertain: [{ title: "won", weight: 50, impact: { initiative: 2 } }, { title: "lost", weight: 50, impact: { manpower: -2 } }] };
const careful = { label: "hold", uncertain: [{ title: "held", weight: 50, impact: { manpower: 1 } }, { title: "broke", weight: 50, impact: { manpower: -2 } }] };
const stage = { choices: [bold, careful] };
const w = (c) => c.uncertain.map((v) => Math.round(v.weight));
check(C.isBold(bold) && !C.isBold(careful), "an order whose best outcome raises Initiative is bold");
check(C.styleStage(stage, {}) === stage && C.styleStage(stage, { style: "steady" }) === stage, "a steady command leaves every roll as written");
let s = C.styleStage(stage, { style: "audacious" });
check(JSON.stringify(w(s.choices[0])) === "[56,44]" && JSON.stringify(w(s.choices[1])) === "[46,54]", "audacious: bold orders 6 points better, careful ones 4 worse");
s = C.styleStage(stage, { style: "cautious" });
check(JSON.stringify(w(s.choices[0])) === "[46,54]" && JSON.stringify(w(s.choices[1])) === "[56,44]" && s.choices[1].style.points === 6, "cautious: the other way round, and the briefing is told");
check(C.styleStage({ choices: [{ ...bold, keyBattleSubgame: { id: "x" } }] }, { style: "audacious" }).choices[0].style === undefined, "an Order of Battle keeps its own arithmetic");
check(C.styleYearCost({ style: "audacious" }).manpower === -1 && C.styleYearCost({ style: "cautious" }).initiative === -1 && !Object.keys(C.styleYearCost({})).length, "each new year an audacious command spends men and a cautious one tempo");
check(C.timingsFor({}).map((x) => x.id).join() === "now,wait" && C.timingsFor({ style: "audacious" }).some((x) => x.id === "early") && C.timingsFor({ style: "cautious" }).some((x) => x.id === "long"), "each style opens a timing of its own");

// ---- After a battle, the conference, the estimate ----
check(C.followUpFor("clean").kind === "exploit" && C.followUpFor("total").kind === "withdraw" && C.followUpFor("costly") === null && C.followUpFor("marginal") === null, "a clean win offers the pursuit, a heavy loss forces the withdrawal, anything between asks nothing");
check(C.bargainChance(M(0, 0, 0)) === 50 && C.bargainChance(M(0, 0, 10)) === 80 && C.bargainChance(M(0, 0, -10)) === 20, "the other delegation's yes: 50%, five points a point of Initiative, 20 to 80");
check(C.conferenceDue("british", {}, "casablanca43") && !C.conferenceDue("british", { conf_british: "record" }, "casablanca43") && !C.conferenceDue("german", {}, "casablanca43"), "the bargain is offered once, before the conference report");
check(C.conferenceChits("british", { conf_british: "mediterranean" }, "anzio44") === 1 && C.conferenceChits("british", { conf_british: "refused" }, "anzio44") === 0, "a bargain that lands moves chits; a refused one does not");
const est = C.staffEstimate({ uncertain: [{ title: "a", weight: 37 }, { title: "b", weight: 63 }] });
check(est[0].percent === 40 && est[1].percent === 60, "the staff's estimate is rounded to ten per cent");

// ---- Rivalries ----
const st = { choices: [{ label: "x", advisor: { name: "Rommel", position: "" } }, { label: "y", advisor: { name: "Halder", position: "" } }] };
for (const [name, R] of [["1940's rules", L], ["1941's rules", P]]) {
  const met = R.trustAfter({}, { choices: [{ label: "k", advisor: { name: "Kesselring", position: "" } }] }, 0);
  const after = R.trustAfter(met, st, 0);
  check(R.trustOf(after, "Kesselring") === R.trustOf(met, "Kesselring") - 1, `${name}: following Rommel costs Kesselring half a point, though he did not argue the decision`);
  const unmet = R.trustAfter({}, st, 0);
  check(R.trustOf(unmet, "Kesselring") === 0, `${name}: a rival not yet heard in the file is left alone`);
}

if (fails.length) {
  console.log(`\n${fails.length} check(s) failed`);
  process.exit(1);
}
console.log("\nthe year's effort, command style and rivalries: all checks passed");
