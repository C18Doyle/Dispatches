// The American effort split (src/effort.ts): when an allocation is due, how far it moves the odds in each theatre, and that the record's
// allocation leaves the written odds alone. Run: npm run test:logic
import { buildSync } from "esbuild";
import { createRequire } from "node:module";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(mkdtempSync(path.join(tmpdir(), "effort-")), "effort.cjs");
buildSync({ entryPoints: [path.join(ROOT, "src/effort.ts")], bundle: true, platform: "node", format: "cjs", outfile: out, logLevel: "error" });
const E = createRequire(import.meta.url)(out);

const fails = [];
const check = (ok, what) => {
  if (!ok) fails.push(what);
  console.log((ok ? "ok   " : "FAIL ") + what);
};
const F = (year, a) => ({ [E.effortFlag(year)]: a });
const contested = { choices: [{ label: "x", uncertain: [{ title: "good", weight: 50, impact: { manpower: 2 } }, { title: "bad", weight: 50, impact: { manpower: -2 } }] }] };
const weights = (s) => s.choices[0].uncertain.map((v) => v.weight);

check(E.reportYear("JUNE 1942") === 1942 && E.reportYear("1943 – 1944") === 1943 && E.reportYear("") === null, "a report's year is the first year its date names");
check(E.effortDue({}, 1942, true) === 1942, "1942's allocation is due once the war in Europe has opened");
check(E.effortDue({}, 1942, false) === null, "and not before (or in the file where the United States stays out)");
check(E.effortDue({}, 1941, true) === null && E.effortDue({}, 1946, true) === null, "only 1942 to 1945 are allocated");
check(E.effortDue(F(1942, "even"), 1942, true) === null && E.effortDue(F(1942, "even"), 1943, true) === 1943, "an allocated year is not asked again; the next year is");

for (const y of E.EFFORT_YEARS) {
  const rec = E.RECORD_ALLOCATION[y];
  const fx = E.allocationEffect(rec, y);
  check(fx.europe === 0 && fx.pacific === 0, `${y}: the record's allocation (${rec}) leaves the odds as written`);
}
check(E.allocationEffect("pacificFirst", 1942).pacific === 6 && E.allocationEffect("pacificFirst", 1942).europe === -6, "1942, Pacific first: the Pacific 6 points better, Europe 6 worse");
check(E.allocationEffect("germanyFirst", 1943).europe === 6 && E.allocationEffect("germanyFirst", 1943).pacific === -6, "1943, Germany first: Europe 6 points better, the Pacific 6 worse");
check(E.allocationEffect("pacificFirst", 1944).pacific === 12 && E.allocationEffect("pacificFirst", 1944).europe === -12, "1944, Pacific first is two steps from the record: 12 points each way");

let s = E.effortStage(contested, F(1942, "pacificFirst"), "pacific", 1942);
check(JSON.stringify(weights(s)) === "[56,44]" && s.choices[0].effort.points === 6 && s.choices[0].effort.theatre === "pacific", "more effort moves probability from the worst outcome to the best");
s = E.effortStage(contested, F(1942, "pacificFirst"), "europe", 1942);
check(JSON.stringify(weights(s)) === "[44,56]" && s.choices[0].effort.points === -6, "less effort moves it from the best to the worst");
s = E.effortStage(contested, F(1942, "even"), "pacific", 1942);
check(s === contested, "the record's allocation leaves the stage untouched");
s = E.effortStage(contested, {}, "pacific", 1942);
check(s === contested, "an unallocated year leaves the stage untouched");
const lopsided = { choices: [{ label: "x", uncertain: [{ title: "good", weight: 92, impact: { fuel: 3 } }, { title: "bad", weight: 8, impact: { fuel: -3 } }] }] };
s = E.effortStage(lopsided, F(1944, "pacificFirst"), "pacific", 1944);
check(Math.abs(weights(s)[1] - 5) < 1e-9 && s.choices[0].effort.points === 3, "an outcome never falls below 5%, and the note says how far the odds really moved");
const battle = { choices: [{ ...contested.choices[0], keyBattleSubgame: "midway" }] };
check(E.effortStage(battle, F(1942, "pacificFirst"), "pacific", 1942).choices[0] === battle.choices[0], "an order that opens an Order of Battle keeps its own arithmetic");
const flat = { choices: [{ label: "x", impact: { manpower: 1 }, uncertain: [{ title: "a", weight: 50 }, { title: "b", weight: 50 }] }] };
check(E.effortStage(flat, F(1942, "pacificFirst"), "pacific", 1942).choices[0] === flat.choices[0], "a choice whose outcomes cost the same is left alone");
const rows = E.allocationRecord({ ...F(1942, "even"), ...F(1943, "pacificFirst") });
check(rows.length === 2 && rows[1].chosen === "pacificFirst" && rows[1].record === "even", "the record of the file lists each allocated year against the record's");

if (fails.length) {
  console.log(`\n${fails.length} check(s) failed`);
  process.exit(1);
}
console.log("\neffort split: all checks passed");
