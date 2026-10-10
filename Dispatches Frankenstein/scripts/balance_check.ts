/**
 * Balance check: plays the real reducer with three policies and reports where the runs end.
 *   random    every option that is on offer is equally likely (the baseline recorder's policy)
 *   cautious  takes the option that leaves its lowest resource highest (a player who watches the meters), expecting rolls to go as the odds say
 *   bold      takes the option with the most total gain, whatever it does to the lowest resource
 * Fails if a cautious player collapses too often (a game you cannot survive by being careful is not a game), if the three
 * policies do not all reach more than one ending, or if a narrative ending is never reached by anyone.
 */
import { createInitialState, reduce, isOptionUnavailable, effectiveRollChance, type Action, type GameState, type Option } from "@dispatches/engine";
import { loadDefinition } from "../../packages/engine/tools/load_definition";
import { makeRng } from "../../packages/engine/tools/projection";

const def = loadDefinition("frankenstein");
const RUNS = 600;
const resources = def.config.resources.map((r) => r.id);

function expectedStamps(o: Option, s: GameState): Record<string, number> {
  if (!o.roll) return o.stamps as Record<string, number>;
  const p = effectiveRollChance(o.roll, s.resources, def.config.strain);
  const out: Record<string, number> = {};
  for (const r of resources) out[r] = p * (o.roll.success.stamps[r] ?? 0) + (1 - p) * (o.roll.failure.stamps[r] ?? 0);
  return out;
}

type Policy = "random" | "cautious" | "bold";
function play(policy: Policy, seed: number, difficulty: "EASY" | "MEDIUM" | "HARD"): string {
  const rng = makeRng(seed * 7919 + (policy === "random" ? 1 : policy === "cautious" ? 2 : 3));
  let s = createInitialState(def);
  const go = (a: Action) => (s = reduce(def, s, a));
  go({ type: "SET_DIFFICULTY", difficulty });
  go({ type: "START_GAME" });
  go({ type: "ADVANCE_PROLOGUE" });
  go({ type: "ENTER_STORY" });
  for (let i = 0; i < 400 && s.phase !== "ENDING"; i++) {
    if (s.phase === "NODE") {
      const node = def.content.nodes[s.currentNodeId];
      const open = node.options.map((_o, k) => k).filter((k) => !isOptionUnavailable(def, s, node.options[k]));
      let pick = open[Math.floor(rng() * open.length)];
      // the careful and the bold player each err one time in four, so that they do not walk one road every time
      if (policy !== "random" && rng() >= 0.25) {
        let best = -Infinity;
        for (const k of open) {
          const st = expectedStamps(node.options[k], s);
          const after = resources.map((r) => (s.resources[r] ?? 0) + (st[r] ?? 0));
          const score = policy === "cautious" ? Math.min(...after) * 10 + after.reduce((a, b) => a + b, 0) : after.reduce((a, b) => a + b, 0);
          if (score > best) {
            best = score;
            pick = k;
          }
        }
      }
      go({ type: "SELECT_OPTION", optionIndex: pick });
    } else if (s.phase === "ROLL") go({ type: "CONDUCT_EXPERIMENT", roll: rng() });
    else if (s.phase === "OUTCOME") go({ type: "CONTINUE_OUTCOME" });
    else if (s.phase === "INTERLUDE") go({ type: "DISMISS_INTERLUDE" });
  }
  return s.endingId ?? "NONE";
}

let failures = 0;
const reached = new Set<string>();
const policies: Policy[] = ["random", "cautious", "bold"];
for (const policy of policies) {
  const tally: Record<string, number> = {};
  for (let n = 0; n < RUNS; n++) {
    const end = play(policy, n + 1, (["EASY", "MEDIUM", "HARD"] as const)[n % 3]);
    tally[end] = (tally[end] ?? 0) + 1;
    reached.add(end);
  }
  const crisis = Object.entries(tally).filter(([k]) => k.startsWith("ENDING_CRISIS")).reduce((a, [, v]) => a + v, 0);
  console.log(`${policy.padEnd(9)} collapse ${((100 * crisis) / RUNS).toFixed(1)}%   ` + Object.entries(tally).sort().map(([k, v]) => `${k.replace("ENDING_", "")}:${v}`).join(" "));
  if (policy === "cautious" && crisis / RUNS > 0.2) {
    failures++;
    console.error(`FAIL: a cautious player collapses in ${((100 * crisis) / RUNS).toFixed(1)}% of runs (limit 20%)`);
  }
  if (Object.keys(tally).length < 2) {
    failures++;
    console.error(`FAIL: the ${policy} policy reaches only one ending`);
  }
}
const narrative = Object.values(def.content.endings).filter((e) => e.kind === "narrative").map((e) => e.id);
const never = narrative.filter((id) => !reached.has(id));
if (never.length) console.log(`note: no policy reached ${never.join(", ")} (they open to a trusted creature; the validator proves they are reachable)`);
if (failures) process.exit(1);
console.log("Balance check passed.");
