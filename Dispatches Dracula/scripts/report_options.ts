/**
 * Option report: plays the real reducer many times under three policies and says which options and endings nobody chooses or reaches.
 *   npm run report:options             prints the report
 *   npm run report:options -- --strict also fails if an option that is offered often is never chosen by the random player (a sign it is dead weight)
 * What it lists: scenes no run visited; options offered at least 100 times to the random player and chosen in under 2% of those (they read as traps or as
 * filler); scenes where one option takes more than 70% of the cautious or the bold player's choices (the others are not competing); and where each policy
 * ends. Options that are gated or hidden are counted only from the times they were on offer. Run from the game folder; GAME=<seat> for the other seat.
 */
import { createInitialState, reduce, isOptionUnavailable, effectiveRollChance, type Action, type GameState, type Option } from "@dispatches/engine";
import { loadDefinition } from "../../packages/engine/tools/load_definition";
import { makeRng } from "../../packages/engine/tools/projection";

const def = loadDefinition(process.env.GAME ?? "dracula");
const strict = process.argv.includes("--strict");
const RUNS = 1500;
const resources = def.config.resources.map((r) => r.id);

type Policy = "random" | "cautious" | "bold";
interface Tally {
  offered: Record<string, number>;
  chosen: Record<string, number>;
  visits: Record<string, number>;
  endings: Record<string, number>;
}
const key = (node: string, i: number) => `${node}#${i}`;
const newTally = (): Tally => ({ offered: {}, chosen: {}, visits: {}, endings: {} });
const tallies: Record<Policy, Tally> = { random: newTally(), cautious: newTally(), bold: newTally() };

function expected(o: Option, s: GameState): Record<string, number> {
  if (!o.roll) return o.stamps as Record<string, number>;
  const p = effectiveRollChance(o.roll, s.resources, def.config.strain);
  const out: Record<string, number> = {};
  for (const r of resources) out[r] = p * (o.roll.success.stamps[r] ?? 0) + (1 - p) * (o.roll.failure.stamps[r] ?? 0);
  return out;
}

function play(policy: Policy, seed: number, difficulty: "EASY" | "MEDIUM" | "HARD"): void {
  const t = tallies[policy];
  const rng = makeRng(seed * 104729 + (policy === "random" ? 1 : policy === "cautious" ? 2 : 3));
  let s = createInitialState(def);
  const go = (a: Action) => (s = reduce(def, s, a));
  go({ type: "SET_DIFFICULTY", difficulty });
  go({ type: "START_GAME" });
  go({ type: "ADVANCE_PROLOGUE" });
  go({ type: "ENTER_STORY" });
  for (let i = 0; i < 500 && s.phase !== "ENDING"; i++) {
    if (s.phase === "NODE") {
      const node = def.content.nodes[s.currentNodeId];
      t.visits[node.id] = (t.visits[node.id] ?? 0) + 1;
      const open = node.options.map((_o, k) => k).filter((k) => !isOptionUnavailable(def, s, node.options[k]));
      for (const k of open) t.offered[key(node.id, k)] = (t.offered[key(node.id, k)] ?? 0) + 1;
      let pick = open[Math.floor(rng() * open.length)];
      if (policy !== "random" && rng() >= 0.25) {
        let best = -Infinity;
        for (const k of open) {
          const st = expected(node.options[k], s);
          const after = resources.map((r) => (s.resources[r] ?? 0) + (st[r] ?? 0));
          const score = policy === "cautious" ? Math.min(...after) * 10 + after.reduce((a, b) => a + b, 0) : after.reduce((a, b) => a + b, 0);
          if (score > best) {
            best = score;
            pick = k;
          }
        }
      }
      t.chosen[key(node.id, pick)] = (t.chosen[key(node.id, pick)] ?? 0) + 1;
      go({ type: "SELECT_OPTION", optionIndex: pick });
    } else if (s.phase === "ROLL") go({ type: "CONDUCT_EXPERIMENT", roll: rng() });
    else if (s.phase === "OUTCOME") go({ type: "CONTINUE_OUTCOME" });
    else if (s.phase === "INTERLUDE") go({ type: "DISMISS_INTERLUDE" });
  }
  const end = s.endingId ?? "NONE";
  t.endings[end] = (t.endings[end] ?? 0) + 1;
}

const DIFFS = ["EASY", "MEDIUM", "HARD"] as const;
for (const policy of ["random", "cautious", "bold"] as Policy[]) for (let n = 0; n < RUNS; n++) play(policy, n + 1, DIFFS[n % 3]);

let failures = 0;
const pct = (a: number, b: number) => (b ? ((100 * a) / b).toFixed(1) + "%" : "-");
const allNodes = Object.keys(def.content.nodes);

console.log(`Option report for "${def.config.id}": ${RUNS} runs for each of three policies.\n`);

const unseen = allNodes.filter((id) => !Object.values(tallies).some((t) => t.visits[id]));
console.log(unseen.length ? `Scenes no run visited (${unseen.length}): ${unseen.join(", ")}` : "Every scene was visited by some run.");

console.log("\nOptions offered 100 or more times to the random player and chosen in under 2% of them:");
let rare = 0;
for (const id of allNodes) {
  def.content.nodes[id].options.forEach((o, i) => {
    const offered = tallies.random.offered[key(id, i)] ?? 0;
    const chosen = tallies.random.chosen[key(id, i)] ?? 0;
    if (offered >= 100 && chosen / offered < 0.02) {
      rare++;
      console.log(`  ${id} option ${i} "${o.label.slice(0, 60)}": ${chosen} of ${offered}`);
      if (strict && chosen === 0) failures++;
    }
  });
}
if (!rare) console.log("  none");

console.log("\nScenes where one option takes more than 70% of the careful or the bold player's choices (scenes visited 200 or more times):");
let dominant = 0;
for (const policy of ["cautious", "bold"] as Policy[]) {
  const t = tallies[policy];
  for (const id of allNodes) {
    if ((t.visits[id] ?? 0) < 200) continue;
    const opts = def.content.nodes[id].options;
    const counts = opts.map((_o, i) => t.chosen[key(id, i)] ?? 0);
    const total = counts.reduce((a, b) => a + b, 0);
    const top = Math.max(...counts);
    if (total && top / total > 0.7) {
      dominant++;
      const i = counts.indexOf(top);
      console.log(`  ${policy} ${id}: option ${i} "${opts[i].label.slice(0, 50)}" takes ${pct(top, total)}`);
    }
  }
}
if (!dominant) console.log("  none");

console.log("\nEndings by policy (share of runs):");
const endingIds = Object.keys(def.content.endings);
for (const id of endingIds) {
  const cells = (["random", "cautious", "bold"] as Policy[]).map((p) => pct(tallies[p].endings[id] ?? 0, RUNS).padStart(6));
  console.log(`  ${id.padEnd(28)} ${cells.join("  ")}`);
}
const never = endingIds.filter((id) => !(["random", "cautious", "bold"] as Policy[]).some((p) => tallies[p].endings[id]));
console.log(never.length ? `\nNo policy reached: ${never.join(", ")} (the validator proves each is reachable; these need particular choices).` : "\nEvery ending was reached by some policy.");

if (failures) {
  console.error(`\nFAIL: ${failures} option(s) offered often and never chosen by the random player.`);
  process.exit(1);
}
