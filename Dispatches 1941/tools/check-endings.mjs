// check-endings.mjs: how lopsided the endings are. check-orphans proves every ending title can be reached; it says nothing about how often.
// This prints, per campaign, the share of wars each ending takes under random play and under play that always takes the historical choice.
// Random play is held to a limit: no ending may take more than 85% of a campaign's wars (a failure) and a warning is printed above 60%.
// Historical play is only printed, because following history is allowed to lead to one ending.
// Usage: node tools/check-endings.mjs   (RUNS=n, default 10000 per campaign and policy)
import { loadGame, playWar, seeded } from "./audit-lib.mjs";

const RUNS = parseInt(process.env.RUNS || "10000", 10);
const game = await loadGame();
const { logic } = game;
let failed = false;

function historicalWar(cid) {
  // always the historical choice where there is one, else the first open choice; rolls by the game's weights
  const camp = game.CAMPAIGNS[cid];
  const rnd = seeded(5);
  let flags = logic.startFlags("open");
  let meters = { ...logic.EMPTY_METERS };
  let pos = camp.start;
  for (let steps = 0; pos && pos !== "END" && steps < 400; steps++) {
    const stage = logic.playableStage(camp.resolveNode(pos, flags, meters), "open", 5);
    const open = stage.choices.map((c, i) => [c, i]).filter(([c]) => !c.disabledReason);
    const [, index] = open.find(([c]) => c.historical) || open[0];
    const res = logic.resolveChoice({ stage, index, mode: "open", favor: 5, defiance: 0, flags, meters, rand: rnd });
    flags = res.flags;
    meters = res.meters;
    const { nextPos, isEnd } = logic.nextPosition({ dynamic: true, position: pos, choice: stage.choices[index], rollIndex: res.rollIndex, mode: "open", flags });
    pos = isEnd ? "END" : nextPos;
  }
  return camp.positionLabel(flags, meters);
}

for (const cid of ["japan", "alliedPacific"]) {
  const rnd = seeded(8675309);
  const counts = {};
  for (let i = 0; i < RUNS; i++) {
    const w = playWar(game, cid, "open", rnd);
    counts[w.label] = (counts[w.label] || 0) + 1;
  }
  const rows = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  console.log(`\n${cid}: random play, ${RUNS} wars, ${rows.length} distinct endings`);
  for (const [label, n] of rows.slice(0, 5)) console.log(`  ${((100 * n) / RUNS).toFixed(1).padStart(5)}%  ${label}`);
  const top = rows[0][1] / RUNS;
  if (top > 0.85) {
    console.error(`  FAIL: "${rows[0][0]}" takes ${(top * 100).toFixed(0)}% of random wars (limit 85%)`);
    failed = true;
  } else if (top > 0.6) console.log(`  warning: "${rows[0][0]}" takes ${(top * 100).toFixed(0)}% of random wars`);
  console.log(`  historical play: ${historicalWar(cid)}`);
}
if (failed) process.exit(1);
console.log("\nEndings check passed.");
