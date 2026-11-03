#!/usr/bin/env node
// The sketch of the ground (src/parts/39-battle-sketch.jsx): its statuses are read off the plan and agree with the verdict.
//   - an arm that contributes nothing is breaking and one that contributes at least the average of the contributing arms is gaining;
//   - an arm is reported only once its dispatch has come in, and not before the report starts;
//   - the counterattack sets the arm it fell on (repulsed gaining, held at a cost holding, broke breaking);
//   - at a won verdict no arm that contributes is breaking, and at a lost one no arm is gaining;
//   - an arm's name is cut to its sector in whole words.
//   node tools/check-battle-sketch.mjs
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const I18N_STUB = "const T = (s) => s; const t = (s, p) => String(s).replace(/\\{(\\w+)\\}/g, (m, k) => (p && p[k] != null ? p[k] : m));\n";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(ROOT, "src/parts/39-battle-sketch.jsx"), "utf8");
const code = src.slice(0, src.indexOf("/** The sketch. "));
const B = new Function(I18N_STUB + code + "\nreturn { battleArmStatus, battleMeanPositive, battleArmStatuses, battleArmLabel, BS_STATUS_WORD };")();

const problems = [];
const ok = (cond, msg) => { if (!cond) problems.push(msg); };
const cats = [{ id: "a", name: "Assault Infantry & Pioneers" }, { id: "b", name: "Air" }, { id: "c", name: "Artillery Preparation" }, { id: "d", name: "Bridging" }];
const beats = [{ kind: "open" }, { kind: "contact" }, ...cats.map((c, i) => ({ kind: "cat", catId: c.id, catOrder: i })), { kind: "reserve" }, { kind: "counter" }];
const last = beats.length - 1;
let n = 0;
let seed = 7;
const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
for (let t = 0; t < 4000; t++) {
  const planContrib = {};
  for (const c of cats) planContrib[c.id] = rnd() < 0.25 ? -1.5 * rnd() : 3 * rnd();
  const finalContrib = { ...planContrib };
  const results = ["repulsed", "heldAtCost", "broke", "gaveGround"];
  const counter = { result: results[Math.floor(rnd() * 4)] };
  const cc = cats[Math.floor(rnd() * 4)].id;
  const mean = B.battleMeanPositive(cats, planContrib);
  // the plan's own statuses
  for (const c of cats) {
    const s = B.battleArmStatus(planContrib[c.id], mean);
    ok(planContrib[c.id] > 0 || s === "breaking", "an arm that contributes nothing is " + s);
    ok(planContrib[c.id] <= 0 || (planContrib[c.id] >= mean) === (s === "gaining"), "an arm at or above the average is not the only one gaining");
  }
  // before the arms have reported
  const early = B.battleArmStatuses({ categories: cats, planContrib, finalContrib, beats, shownIndex: 1, counter: null, counterCategory: null, done: false, won: false });
  ok(Object.keys(early).length === 0, "an arm is reported before its dispatch");
  // part way: only the arms reported are in
  const part = B.battleArmStatuses({ categories: cats, planContrib, finalContrib, beats, shownIndex: 3, counter: null, counterCategory: null, done: false, won: false });
  ok(Object.keys(part).length === 2, "after two dispatches " + Object.keys(part).length + " arms are reported");
  // the counterattack
  const withCounter = B.battleArmStatuses({ categories: cats, planContrib, finalContrib, beats, shownIndex: last, counter, counterCategory: cc, done: false, won: false });
  const want = counter.result === "repulsed" ? "gaining" : counter.result === "heldAtCost" ? "holding" : "breaking";
  ok(withCounter[cc] === want, "the counterattack " + counter.result + " left the arm " + withCounter[cc]);
  // the verdict
  for (const won of [true, false]) {
    const end = B.battleArmStatuses({ categories: cats, planContrib, finalContrib, beats, shownIndex: last, counter: null, counterCategory: null, done: true, won });
    for (const c of cats) {
      ok(Boolean(end[c.id]), "no status for an arm at the verdict");
      if (won) ok(planContrib[c.id] <= 0 || end[c.id] !== "breaking", "a won battle leaves a contributing arm breaking");
      else ok(end[c.id] !== "gaining", "a lost battle leaves an arm gaining");
    }
  }
  n++;
}
// the labels
for (const [name, chars] of [["Assault Infantry & Pioneers", 16], ["Artillery Preparation", 13], ["Air", 8], ["Bridging & Traffic", 11]]) {
  const l = B.battleArmLabel(name, chars);
  ok(l.length <= chars + 1, "label " + l + " is longer than " + chars);
  ok(/^[A-Za-z]/.test(l), "label " + l);
}
if (problems.length) {
  console.error("check-battle-sketch: " + problems.length + " problem(s)");
  for (const p of [...new Set(problems)].slice(0, 20)) console.error("  " + p);
  process.exit(1);
}
console.log("check-battle-sketch: " + n + " random plans, statuses, counterattacks and verdicts agree");
