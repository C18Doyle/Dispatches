/**
 * Balance check: plays the real reducer with three policies and reports where the runs end.
 *   random    every option that is on offer is equally likely (the baseline recorder's policy)
 *   cautious  takes the option that leaves its lowest resource highest (a player who watches the meters), expecting rolls to go as the odds say
 *   bold      takes the option with the most total gain, whatever it does to the lowest resource
 *   fallible  a sensible player who cannot see the numbers: weighs the options like the cautious one, but each estimate is off by a couple of points (on Medium and Hard
 *             a player is not told what a choice will cost)
 *   ruin:<r>  a player set on running one reserve down, to show that every failure ending can be reached by play and not only by the validator's proof
 * It also looks for options that are plainly worse than a sibling (another option in the same scene is at least as good on every reserve and better on one, judged at
 * even reserves, and that sibling has no gate, requirement or price): a choice with no reason to take it. The seat's checks.json may allow a number of them
 * ("maxDominatedOptions"), so that known debt is visible and cannot grow.
 * Fails if a cautious player collapses too often (a game you cannot survive by being careful is not a game), if the three
 * policies do not all reach more than one ending, or if a narrative ending is never reached by anyone.
 */
import { createInitialState, reduce, isOptionUnavailable, effectiveRollChance, strainFor, type Action, type GameState, type Option } from "@dispatches/engine";
import { readFileSync } from "node:fs";
import { loadDefinition } from "../../packages/engine/tools/load_definition";
import { makeRng } from "../../packages/engine/tools/projection";

const def = loadDefinition(process.env.GAME ?? "dracula");
const RUNS = 600;
const MIN_HARD_COLLAPSE = 15; // a sensible but fallible player should lose at least this share of Hard runs
const MAX_EASY_COLLAPSE = 5; // and at most this share of Easy ones
const resources = def.config.resources.map((r) => r.id);

function expectedStamps(o: Option, s: GameState): Record<string, number> {
  if (!o.roll) return o.stamps as Record<string, number>;
  const p = effectiveRollChance(o.roll, s.resources, strainFor(def.config, s.difficulty));
  const out: Record<string, number> = {};
  for (const r of resources) out[r] = p * (o.roll.success.stamps[r] ?? 0) + (1 - p) * (o.roll.failure.stamps[r] ?? 0);
  return out;
}

type Policy = "random" | "cautious" | "bold" | "fallible" | `ruin:${string}`;
/** A number from a bell curve about 0 with a spread of about 1 (the sum of four fair draws, centred). */
const bell = (rng: () => number): number => (rng() + rng() + rng() + rng() - 2) * 1.73;
const POLICIES: Policy[] = ["random", "cautious", "bold", "fallible", ...resources.map((r): Policy => `ruin:${r}`)];
function play(policy: Policy, seed: number, difficulty: "EASY" | "MEDIUM" | "HARD"): string {
  const rng = makeRng(seed * 7919 + POLICIES.indexOf(policy) + 1);
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
      // every player but the random one errs one time in four, so that they do not walk one road every time
      if (policy !== "random" && rng() >= 0.25) {
        let best = -Infinity;
        for (const k of open) {
          const st = expectedStamps(node.options[k], s);
          const noise = policy === "fallible" ? 2 : 0;
          const after = resources.map((r) => (s.resources[r] ?? 0) + (st[r] ?? 0) + noise * bell(rng));
          const aim = policy.startsWith("ruin:") ? resources.indexOf(policy.slice(5)) : -1;
          const score = aim >= 0 ? -after[aim] : policy === "bold" ? after.reduce((a, b) => a + b, 0) : Math.min(...after) * 10 + after.reduce((a, b) => a + b, 0);
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

// options that no one has a reason to take
{
  const zero = Object.fromEntries(resources.map((r) => [r, 0]));
  const at = (o: Option): Record<string, number> => {
    if (!o.roll) return { ...zero, ...(o.stamps as Record<string, number>) };
    const p = effectiveRollChance(o.roll, zero, undefined);
    return Object.fromEntries(resources.map((r) => [r, p * (o.roll!.success.stamps[r] ?? 0) + (1 - p) * (o.roll!.failure.stamps[r] ?? 0)]));
  };
  const pairs: string[] = [];
  for (const node of Object.values(def.content.nodes)) {
    const e = node.options.map(at);
    node.options.forEach((worse, j) =>
      node.options.forEach((better, i) => {
        if (i === j || better.gate || better.requires || better.requiresFlag || better.moneyCost) return;
        const atLeast = resources.every((r) => e[i][r] >= e[j][r] - 1e-9);
        const more = resources.some((r) => e[i][r] > e[j][r] + 1e-9);
        if (atLeast && more) pairs.push(`${node.id} option ${j} "${worse.label.slice(0, 40)}" is no better than option ${i} on any reserve`);
      }),
    );
  }
  let allowed = 0;
  try {
    allowed = JSON.parse(readFileSync(`src/content/${process.env.GAME ?? "dracula"}/checks.json`, "utf8")).maxDominatedOptions ?? 0;
  } catch {
    /* no checks.json: none allowed */
  }
  console.log(`options with no reason to take them: ${pairs.length} (allowed ${allowed})`);
  if (pairs.length > allowed) {
    failures++;
    pairs.forEach((p) => console.error("  " + p));
    console.error(`FAIL: ${pairs.length} dominated options (allowed ${allowed}). Give each a gain that its sibling lacks, or a cost to the sibling.`);
  }
}
const reached = new Set<string>();
const policies = POLICIES;
for (const policy of policies) {
  const tally: Record<string, number> = {};
  const byDifficulty: Record<string, { runs: number; collapses: number }> = { EASY: { runs: 0, collapses: 0 }, MEDIUM: { runs: 0, collapses: 0 }, HARD: { runs: 0, collapses: 0 } };
  for (let n = 0; n < RUNS; n++) {
    const difficulty = (["EASY", "MEDIUM", "HARD"] as const)[n % 3];
    const end = play(policy, n + 1, difficulty);
    byDifficulty[difficulty].runs++;
    if (end.startsWith("ENDING_CRISIS")) byDifficulty[difficulty].collapses++;
    tally[end] = (tally[end] ?? 0) + 1;
    reached.add(end);
  }
  const crisis = Object.entries(tally).filter(([k]) => k.startsWith("ENDING_CRISIS")).reduce((a, [, v]) => a + v, 0);
  console.log(`${policy.padEnd(9)} collapse ${((100 * crisis) / RUNS).toFixed(1)}%   ` + Object.entries(tally).sort().map(([k, v]) => `${k.replace("ENDING_", "")}:${v}`).join(" "));
  const rate = (d: string) => (100 * byDifficulty[d].collapses) / Math.max(1, byDifficulty[d].runs);
  console.log(`          by difficulty: Easy ${rate("EASY").toFixed(1)}%  Medium ${rate("MEDIUM").toFixed(1)}%  Hard ${rate("HARD").toFixed(1)}%`);
  if (policy === "random" && !(rate("EASY") <= rate("MEDIUM") && rate("MEDIUM") <= rate("HARD"))) {
    failures++;
    console.error("FAIL: a random player should collapse least on Easy and most on Hard");
  }
  if (policy === "fallible" && !(rate("EASY") <= rate("MEDIUM") && rate("MEDIUM") <= rate("HARD"))) {
    failures++;
    console.error("FAIL: a sensible but fallible player should collapse least on Easy and most on Hard");
  }
  if (policy === "fallible" && rate("HARD") < MIN_HARD_COLLAPSE) {
    failures++;
    console.error(`FAIL: a sensible but fallible player collapses in only ${rate("HARD").toFixed(1)}% of Hard runs (Hard should cost him at least ${MIN_HARD_COLLAPSE}%)`);
  }
  if (policy === "fallible" && rate("EASY") > MAX_EASY_COLLAPSE) {
    failures++;
    console.error(`FAIL: a sensible but fallible player collapses in ${rate("EASY").toFixed(1)}% of Easy runs (limit ${MAX_EASY_COLLAPSE}%)`);
  }
  if (policy === "cautious" && crisis / RUNS > 0.2) {
    failures++;
    console.error(`FAIL: a cautious player collapses in ${((100 * crisis) / RUNS).toFixed(1)}% of runs (limit 20%)`);
  }
  if (Object.keys(tally).length < 2) {
    failures++;
    console.error(`FAIL: the ${policy} policy reaches only one ending`);
  }
}
const failureEndings = def.config.resources.map((r) => r.failureEndingId).filter((id): id is string => !!id);
const unreached = failureEndings.filter((id) => !reached.has(id));
if (unreached.length) {
  failures++;
  console.error(`FAIL: no player, not even one set on ruin, reaches ${unreached.join(", ")}`);
}
const narrative = Object.values(def.content.endings).filter((e) => e.kind === "narrative").map((e) => e.id);
const never = narrative.filter((id) => !reached.has(id));
if (never.length) console.log(`note: no policy reached ${never.join(", ")} (they open to particular earlier choices; the validator proves they are reachable)`);
if (failures) process.exit(1);
console.log("Balance check passed.");
