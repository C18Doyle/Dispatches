/**
 * Exhaustive structural + reachability validator for the Frankenstein node
 * graph. Runs the actual production data/engine code (not a re-implementation)
 * so this can't silently drift from what ships. Reports measured counts, per
 * Craig's own validation standard: never "looks good" without numbers.
 */
import { clampTo, isOptionLocked, isOptionFlagLocked } from "../src/engine/index";
import { loadDefinition } from "./lib/load_definition";

const def = loadDefinition("frankenstein");
const NODES = def.content.nodes;
const ENDINGS = def.content.endings;
const START_NODE_ID = def.content.startNodeId;
const triggerNodes = (id: string) => def.config.interludeTriggers.find((t) => t.interludeId === id)?.onEnterNodes ?? [];
const LORE_NODE_IDS = triggerNodes("LORE_YEAR_WITHOUT_SUMMER");
const ACT2_ENTRY_NODES = triggerNodes("TRANSITION_WILLIAM_MURDERED");
// All Frankenstein resources share one range and one failure level.
const { min: RES_MIN, max: RES_MAX, failAt: FAILURE_THRESHOLD = -10 } = def.config.resources[0];
const clamp = (n: number) => clampTo(n, RES_MIN, RES_MAX);
type Resource = string;
type Resources = Record<string, number>;

// Flags set by reducer logic outside the node graph (Fritz's Favor sets
// "fritzPatron" from a UI action, not from any option's setFlags), so the
// pure-graph DFS below cannot exercise them the way it exercises
// node-authored flags. Checked separately, by static cross-reference only.
const ENGINE_LEVEL_FLAGS = ["fritzPatron"];

const RESOURCES: Resource[] = def.config.resources.map((r) => r.id);
let failures = 0;

function fail(msg: string) {
  failures++;
  console.error(`FAIL: ${msg}`);
}
function ok(msg: string) {
  console.log(`OK:   ${msg}`);
}

// 1. Every nextNodeId resolves to a real node or a real ending — including a
//    roll branch's own override, when it names one instead of falling back
//    to the option's shared nextNodeId.
let danglingChecked = 0;
for (const node of Object.values(NODES)) {
  for (const opt of node.options) {
    const targets = opt.roll
      ? [opt.roll.success.nextNodeId ?? opt.nextNodeId, opt.roll.failure.nextNodeId ?? opt.nextNodeId]
      : [opt.nextNodeId];
    for (const target of targets) {
      danglingChecked++;
      const resolves = target.startsWith("ENDING_") ? !!ENDINGS[target] : !!NODES[target];
      if (!resolves) fail(`${node.id} option "${opt.label}" -> "${target}" does not resolve to any node or ending`);
    }
  }
}
ok(`${danglingChecked} option routes checked for dangling targets`);

// 2. Exhaustive DFS over real gameplay (gates enforced, failure overrides applied)
//    — mirrors engine.ts SELECT_OPTION exactly.
const reachableNodeIds = new Set<string>();
const reachableEndingIds = new Set<string>();
const gateEverSatisfied = new Map<string, boolean>();
const gateKeys: string[] = [];
const flagGateEverSatisfied = new Map<string, boolean>();
const flagGateKeys: string[] = [];
for (const node of Object.values(NODES)) {
  for (const opt of node.options) {
    if (opt.gate) {
      const key = `${node.id}:${opt.label}`;
      gateKeys.push(key);
      gateEverSatisfied.set(key, false);
    }
    if (opt.requiresFlag) {
      const key = `${node.id}:${opt.label}`;
      flagGateKeys.push(key);
      flagGateEverSatisfied.set(key, false);
    }
  }
}
const resourceExtremes: Record<string, { min: number; max: number }> = {};
for (const id of Object.keys(NODES)) resourceExtremes[id] = { min: 999, max: -999 };

let pathsExplored = 0;
let deepestDepth = 0;
let rollsForked = 0;

function recordExtremes(nodeId: string, resources: Resources) {
  const total = resources.voltage + resources.biomass + resources.secrecy; // cheap scalar for reporting only
  const e = resourceExtremes[nodeId];
  if (e) {
    e.min = Math.min(e.min, total);
    e.max = Math.max(e.max, total);
  }
}

function dfs(nodeId: string, resources: Resources, flags: Record<string, boolean>, depth: number) {
  pathsExplored++;
  deepestDepth = Math.max(deepestDepth, depth);
  reachableNodeIds.add(nodeId);
  recordExtremes(nodeId, resources);
  const node = NODES[nodeId];
  if (!node) return;

  for (const opt of node.options) {
    const locked = isOptionLocked(resources, opt.gate);
    if (locked) continue;
    const flagLocked = isOptionFlagLocked(flags, opt.requiresFlag);
    if (flagLocked) continue;
    if (opt.gate) gateEverSatisfied.set(`${nodeId}:${opt.label}`, true);
    if (opt.requiresFlag) flagGateEverSatisfied.set(`${nodeId}:${opt.label}`, true);

    if (opt.roll) {
      // Fork the DFS on both branches of the roll. Each branch may name its
      // own nextNodeId (a real structural payoff for the gamble); falls back
      // to the option's shared nextNodeId when it doesn't.
      rollsForked++;
      for (const branch of [opt.roll.success, opt.roll.failure]) {
        const next: Resources = { ...resources };
        for (const r of RESOURCES) {
          const delta = branch.stamps[r] ?? 0;
          if (delta !== 0) next[r] = clamp(next[r] + delta);
        }
        const failedResource = RESOURCES.find((r) => next[r] <= FAILURE_THRESHOLD);
        if (failedResource) {
          reachableEndingIds.add(`ENDING_CRISIS_${failedResource.toUpperCase()}`);
          continue; // terminal
        }
        const target = branch.nextNodeId ?? opt.nextNodeId;
        if (target.startsWith("ENDING_")) {
          reachableEndingIds.add(target);
          continue;
        }
        const nextFlags = branch.setFlags
          ? { ...flags, ...Object.fromEntries(branch.setFlags.map((f) => [f, true])) }
          : flags;
        dfs(target, next, nextFlags, depth + 1);
      }
      continue;
    }

    const next: Resources = { ...resources };
    for (const r of RESOURCES) {
      const delta = opt.stamps[r] ?? 0;
      if (delta !== 0) next[r] = clamp(next[r] + delta);
    }

    const failedResource = RESOURCES.find((r) => next[r] <= FAILURE_THRESHOLD);
    if (failedResource) {
      reachableEndingIds.add(`ENDING_CRISIS_${failedResource.toUpperCase()}`);
      continue; // terminal
    }

    const target = opt.nextNodeId;
    if (target.startsWith("ENDING_")) {
      reachableEndingIds.add(target);
      continue;
    }

    const nextFlags = opt.setFlags ? { ...flags, ...Object.fromEntries(opt.setFlags.map((f) => [f, true])) } : flags;
    dfs(target, next, nextFlags, depth + 1);
  }
}

dfs(START_NODE_ID, { voltage: 0, biomass: 0, secrecy: 0 }, {}, 0);

ok(`${pathsExplored} distinct game-states explored (max depth ${deepestDepth}) via exhaustive DFS, forking ${rollsForked} roll option encounter(s) into success/failure branches`);

// 3. Every defined node is actually reachable under real gate constraints.
const allNodeIds = Object.keys(NODES);
const unreachableNodes = allNodeIds.filter((id) => !reachableNodeIds.has(id));
if (unreachableNodes.length) {
  fail(`${unreachableNodes.length} node(s) unreachable under real play: ${unreachableNodes.join(", ")}`);
} else {
  ok(`all ${allNodeIds.length} nodes reachable under real play (gates enforced)`);
}

// 4. Every defined ending is actually reachable.
const allEndingIds = Object.keys(ENDINGS);
const unreachableEndings = allEndingIds.filter((id) => !reachableEndingIds.has(id));
if (unreachableEndings.length) {
  fail(`${unreachableEndings.length} ending(s) unreachable under real play: ${unreachableEndings.join(", ")}`);
} else {
  ok(`all ${allEndingIds.length} endings reachable under real play (${reachableEndingIds.size} confirmed: ${[...reachableEndingIds].sort().join(", ")})`);
}

// 5. Every gate is satisfiable by at least one real path (not dead-code).
const deadGates = gateKeys.filter((k) => !gateEverSatisfied.get(k));
if (deadGates.length) {
  fail(`${deadGates.length} gate(s) never satisfiable by any real path: ${deadGates.join(" | ")}`);
} else {
  ok(`all ${gateKeys.length} gated options are satisfiable by at least one real path`);
}

// 5b. Every requiresFlag option is reachable while UNLOCKED by at least one
// real path — i.e. some path actually sets the flag before arriving back at
// this option, not just that the option exists.
const deadFlagGates = flagGateKeys.filter((k) => !flagGateEverSatisfied.get(k));
if (deadFlagGates.length) {
  fail(`${deadFlagGates.length} requiresFlag option(s) never unlockable by any real path: ${deadFlagGates.join(" | ")}`);
} else {
  ok(`all ${flagGateKeys.length} requiresFlag callback options are unlockable by at least one real path`);
}

// 6. Flag read/write coverage — every setFlags value is referenced by some ending variant.
const flagsWritten = new Set<string>();
for (const node of Object.values(NODES)) {
  for (const opt of node.options) {
    opt.setFlags?.forEach((f) => flagsWritten.add(f));
    opt.roll?.success.setFlags?.forEach((f) => flagsWritten.add(f));
    opt.roll?.failure.setFlags?.forEach((f) => flagsWritten.add(f));
  }
}
const flagsRead = new Set<string>();
for (const ending of Object.values(ENDINGS)) ending.variants?.forEach((v) => flagsRead.add(v.flag));

// 6b. Engine-level flags (set by a UI action, not by any option's setFlags)
// can't be exercised by this graph-only DFS. Checked by static
// cross-reference instead: each must still be referenced by some ending
// variant, so a typo between engine.ts and data.ts doesn't ship silently.
const unreferencedEngineFlags = ENGINE_LEVEL_FLAGS.filter((f) => !flagsRead.has(f));
if (unreferencedEngineFlags.length) {
  fail(`${unreferencedEngineFlags.length} engine-level flag(s) not referenced by any ending variant (static check only — not DFS-proven): ${unreferencedEngineFlags.join(", ")}`);
} else {
  ok(`all ${ENGINE_LEVEL_FLAGS.length} engine-level flag(s) (${ENGINE_LEVEL_FLAGS.join(", ")}) are referenced by an ending variant (static cross-reference only — the DFS can't exercise a UI-triggered flag, so this doesn't prove reachability the way the other checks do)`);
}

// A flag used as some option's requiresFlag has its own payoff already
// proven reachable by check 5b (the unlocked callback option itself) — it
// doesn't also need to flavor an ending, so it's exempt from this check.
const flagsUsedAsRequires = new Set<string>();
for (const node of Object.values(NODES)) {
  for (const opt of node.options) {
    if (opt.requiresFlag) flagsUsedAsRequires.add(opt.requiresFlag);
  }
}
const unreadFlags = [...flagsWritten].filter((f) => !flagsRead.has(f) && !flagsUsedAsRequires.has(f));
if (unreadFlags.length) {
  fail(`${unreadFlags.length} flag(s) written but never read by any ending variant nor consumed as a requiresFlag: ${unreadFlags.join(", ")}`);
} else {
  ok(`all ${flagsWritten.size} flags (${[...flagsWritten].join(", ")}) are read by an ending variant or consumed as a requiresFlag`);
}

// 7. No self-referencing / immediate infinite loop options (including a
//    roll branch's own override target, not just the option's shared one).
let selfRefs = 0;
for (const node of Object.values(NODES)) {
  for (const opt of node.options) {
    const targets = opt.roll
      ? [opt.roll.success.nextNodeId ?? opt.nextNodeId, opt.roll.failure.nextNodeId ?? opt.nextNodeId]
      : [opt.nextNodeId];
    for (const target of targets) {
      if (target === node.id) {
        selfRefs++;
        fail(`${node.id} option "${opt.label}" routes back to itself`);
      }
    }
  }
}
if (selfRefs === 0) ok(`0 self-referencing options found`);

// 8. Hard mode never fully locks a player out of a node: every node must
//    keep at least one option that is neither resource-gated nor
//    money-gated, so a player with insufficient resources AND insufficient
//    money can always still act. (Money itself is only enforced in Hard,
//    but this check is difficulty-independent by construction — it holds
//    regardless of resources or money on hand.)
const nodesWithoutFreeOption: string[] = [];
for (const node of Object.values(NODES)) {
  const hasFreeOption = node.options.some((opt) => !opt.gate && !opt.moneyCost);
  if (!hasFreeOption) nodesWithoutFreeOption.push(node.id);
}
if (nodesWithoutFreeOption.length) {
  fail(`${nodesWithoutFreeOption.length} node(s) have no gate-free/money-free option, risking a hard lockout: ${nodesWithoutFreeOption.join(", ")}`);
} else {
  ok(`all ${allNodeIds.length} nodes retain at least one gate-free, money-free option (no difficulty can hard-lock a player out of a node)`);
}

// 9. Roll structural discipline: chance is a real probability, and the
//    option carries no top-level stamps/outcome that would be silently
//    ignored (the real content must live under roll.success/roll.failure).
let rollOptionsChecked = 0;
const rollStructuralIssues: string[] = [];
for (const node of Object.values(NODES)) {
  for (const opt of node.options) {
    if (!opt.roll) continue;
    rollOptionsChecked++;
    if (!(opt.roll.chance > 0 && opt.roll.chance < 1)) {
      rollStructuralIssues.push(`${node.id} option "${opt.label}" has out-of-range roll.chance ${opt.roll.chance}`);
    }
    if (opt.roll.scaling) {
      const { resource, perPoint, min = 0.1, max = 0.95 } = opt.roll.scaling;
      if (!RESOURCES.includes(resource)) {
        rollStructuralIssues.push(`${node.id} option "${opt.label}" has roll.scaling.resource "${resource}", which is not a real Resource`);
      }
      if (!Number.isFinite(perPoint) || perPoint === 0) {
        rollStructuralIssues.push(`${node.id} option "${opt.label}" has a non-finite or zero roll.scaling.perPoint (${perPoint}) — scaling that never moves the odds isn't scaling`);
      }
      if (!(min > 0 && min < 1 && max > 0 && max < 1 && min < max)) {
        rollStructuralIssues.push(`${node.id} option "${opt.label}" has an invalid roll.scaling range [${min}, ${max}] — both bounds must sit strictly inside (0, 1) with min < max, so the effective chance can never leave a sane probability`);
      }
    }
    if (Object.keys(opt.stamps).length > 0) {
      rollStructuralIssues.push(`${node.id} option "${opt.label}" has top-level stamps that will never apply (roll options must use roll.success/failure.stamps)`);
    }
    if (opt.outcome !== "") {
      rollStructuralIssues.push(`${node.id} option "${opt.label}" has a top-level outcome string that will never be shown (roll options must use roll.success/failure.outcome)`);
    }
  }
}
if (rollStructuralIssues.length) {
  rollStructuralIssues.forEach((m) => fail(m));
} else {
  ok(`all ${rollOptionsChecked} roll options have in-range chances and no dead top-level stamps/outcome`);
}

// 10. One-shot newspaper trigger completeness. These lists exist because a
//     new node can quietly reroute around the node a trigger was written
//     against (this happened twice: node 1's scaffold option was repointed
//     to "2-DARK" without LORE_NODE_IDS knowing about it, and node 5's
//     array-roll success was repointed to "8B-SURGE" without
//     ACT2_ENTRY_NODES knowing about it — both skipped a one-shot newspaper
//     for real players before this check existed). Rather than re-asserting
//     the two known-good ids, this derives the "should be covered" set
//     directly from the graph, so a *future* reroute trips it too.
const node1Targets = new Set((NODES["1"]?.options ?? []).map((o) => o.nextNodeId));
const uncoveredLoreTargets = [...node1Targets].filter((id) => !LORE_NODE_IDS.includes(id));
if (uncoveredLoreTargets.length) {
  fail(`node "1" routes to ${uncoveredLoreTargets.join(", ")}, which LORE_NODE_IDS does not include — the Year-Without-a-Summer newspaper would silently never fire for players who pick that option`);
} else {
  ok(`LORE_NODE_IDS covers every destination node "1" can route to (${[...node1Targets].join(", ")})`);
}

const branchDecisionNodeIds = ["5", "5-HYBRID"];
const act2Candidates = new Set<string>();
for (const bid of branchDecisionNodeIds) {
  const node = NODES[bid];
  if (!node) continue;
  for (const opt of node.options) {
    const targets = opt.roll ? [opt.nextNodeId, opt.roll.success.nextNodeId, opt.roll.failure.nextNodeId] : [opt.nextNodeId];
    for (const t of targets) {
      if (t && t.startsWith("8")) act2Candidates.add(t);
    }
  }
}
const uncoveredAct2Targets = [...act2Candidates].filter((id) => !ACT2_ENTRY_NODES.includes(id));
if (uncoveredAct2Targets.length) {
  fail(`the branch-decision node(s) route to ${uncoveredAct2Targets.join(", ")}, which ACT2_ENTRY_NODES does not include — the William-murdered transition newspaper would silently never fire on that path`);
} else {
  ok(`ACT2_ENTRY_NODES covers every Act II destination reachable from ${branchDecisionNodeIds.join("/")} (${[...act2Candidates].join(", ")})`);
}

// 11. No two nodes share the exact same on-screen title. This is what let
//     8 of 9 new "consequence" nodes ship with their base node's unchanged
//     heading — the one place on screen a player would notice a branch
//     actually happened, and it looked identical to the node it replaced.
const titleOwners = new Map<string, string[]>();
for (const node of Object.values(NODES)) {
  const owners = titleOwners.get(node.title) ?? [];
  owners.push(node.id);
  titleOwners.set(node.title, owners);
}
const duplicateTitles = [...titleOwners.entries()].filter(([, ids]) => ids.length > 1);
if (duplicateTitles.length) {
  duplicateTitles.forEach(([title, ids]) => fail(`title "${title}" is reused by nodes ${ids.join(", ")} — a player can't tell them apart on screen`));
} else {
  ok(`all ${allNodeIds.length} node titles are unique`);
}

console.log("\n--- resource-total extremes per node (sanity check, not a pass/fail) ---");
for (const id of allNodeIds) {
  const e = resourceExtremes[id];
  if (e.min !== 999) console.log(`  node ${id}: total resource range seen [${e.min}, ${e.max}]`);
}

console.log(`\n${failures === 0 ? "VALIDATION PASSED" : "VALIDATION FAILED"}: ${failures} failure(s), ${pathsExplored} states explored, ${allNodeIds.length} nodes, ${allEndingIds.length} endings, ${gateKeys.length} gates.`);
process.exit(failures === 0 ? 0 : 1);
