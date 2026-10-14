// check_seat.mjs: the hidden seat (Mina's campaign) still builds and plays to an ending through the real screens.
//   node scripts/check_seat.mjs [seat]        (default "mina"; build it first: npm run build:mina)
// Plays seeded runs through dist/<seat>/bundle.js in jsdom with the shared driver and tests/ui.config.mjs (which reads the seat's ui.json and flavor.json).
// Every run must end on an ending screen without a crash. The seat is not part of the shipped game, so this is the only thing that proves it still works.
import { readFileSync } from "node:fs";

const seat = process.argv[2] ?? "mina";
process.env.SEAT = seat;
const { playRun } = await import("../../packages/testkit/src/ui-driver.mjs");
const cfg = (await import("../tests/ui.config.mjs")).default;
const bundle = readFileSync(`dist/${seat}/bundle.js`, "utf8");

let failures = 0;
let ended = 0;
const cases = [["Easy"], ["Medium"], ["Hard"]];
for (const [i, c] of cases.entries()) {
  for (const seed of [1, 2]) {
    const r = await playRun(cfg, bundle, c, seed + i * 10);
    if (r.error || r.crashed) {
      failures++;
      console.error(`FAIL ${seat} ${c[0]} seed ${seed}: ${r.error ?? "crashed"}`);
    } else if (!r.stopped || r.stopped === "ended") ended++;
    else {
      failures++;
      console.error(`FAIL ${seat} ${c[0]} seed ${seed}: stopped at "${r.stopped}": ${String(r.lastText).slice(0, 80)}`);
    }
  }
}
console.log(`${seat}: ${ended} of ${cases.length * 2} runs reached an ending.`);
if (failures) process.exit(1);
console.log(`The ${seat} seat builds and plays.`);
