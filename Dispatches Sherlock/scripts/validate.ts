/**
 * Exhaustive structural + reachability validator for the Sherlock node
 * graph. Runs the actual production data/engine code (not a re-implementation)
 * so this can't silently drift from what ships. Reports measured counts, per
 * Craig's own validation standard: never "looks good" without numbers.
 */
import { isOptionLocked, isOptionFlagLocked, isOptionHidden, isOptionConditionLocked, applyAxisDelta, applyStamps, reduce, createInitialState, isOptionUnavailable, evalCondition } from "@dispatches/engine";
import type { Condition, Difficulty, GameState } from "@dispatches/engine";
import { loadDefinition } from "../../packages/engine/tools/load_definition";

const def = loadDefinition("sherlock");
const NODES = def.content.nodes;
const ENDINGS = def.content.endings;
const START_NODE_ID = def.content.startNodeId;
const RESOURCE_DEFS = def.config.resources;
const failureOf = (resources: Record<string, number>) => RESOURCE_DEFS.find((r) => r.failAt !== undefined && resources[r.id] <= r.failAt)?.failureEndingId;
type Resource = string;
type Resources = Record<string, number>;

// Flags set by reducer logic outside the node graph (Mycroft's Favour sets
// "mycroftFavour" from a UI action, not from any option's setFlags), so the
// pure-graph DFS below cannot exercise them the way it exercises
// node-authored flags. Checked separately, by static cross-reference only.
const ENGINE_LEVEL_FLAGS = [def.config.assist?.favorFlag ?? "mycroftFavour"];

const RESOURCES: Resource[] = def.config.resources.map((r) => r.id);
// Triggers with a condition and consequences (a deadline, an enemy's answer) fire on arriving at a scene; the search applies them as the engine does.
const TRIGGERS = def.config.interludeTriggers;
let failures = 0;

// An option whose conditions ask for "at most" or "not set" (a repair for a low gauge, a consequence of low trust) is not part of the dominance search:
// a higher state is not better for it. Such options are left out of the search and checked two other ways: each must lead only to scenes and set only
// flags that the rest of the graph already reaches (so leaving it out loses nothing), and each must be shown in a witness run on the real reducer.
const nonMonotone = (c: Condition | undefined, pos = true): boolean => {
  if (!c) return false;
  if ("resource" in c || "axis" in c) {
    const up = c.op === ">=" || c.op === ">";
    const down = c.op === "<=" || c.op === "<";
    return !((up && pos) || (down && !pos));
  }
  if ("flag" in c) return !pos;
  if ("not" in c) return nonMonotone(c.not, !pos);
  if ("all" in c) return c.all.some((x) => nonMonotone(x, pos));
  if ("any" in c) return c.any.some((x) => nonMonotone(x, pos));
  if ("stat" in c || "favorUsed" in c) {
    console.error("FAIL: option conditions may not use the purse or the favour: " + JSON.stringify(c));
    process.exit(1);
  }
  return false;
};
const NONMONO = new Set<object>();
for (const node of Object.values(NODES)) for (const opt of node.options) if (nonMonotone(opt.requires) || nonMonotone(opt.showWhen)) NONMONO.add(opt);

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
const condGateEverSatisfied = new Map<string, boolean>(); // `requires` options, unlocked at least once
const condGateKeys: string[] = [];
const shownWhenEverShown = new Map<string, boolean>(); // `showWhen` options, shown at least once
const shownWhenKeys: string[] = [];
const DIFFICULTIES = Object.keys(def.config.difficulties) as Difficulty[];
for (const node of Object.values(NODES)) {
  for (const opt of node.options) {
    if (NONMONO.has(opt)) continue;
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
    if (opt.requires) {
      const key = `${node.id}:${opt.label}`;
      condGateKeys.push(key);
      condGateEverSatisfied.set(key, false);
    }
    if (opt.showWhen) {
      const key = `${node.id}:${opt.label}`;
      shownWhenKeys.push(key);
      shownWhenEverShown.set(key, false);
    }
  }
}
const resourceExtremes: Record<string, { min: number; max: number }> = {};
for (const id of Object.keys(NODES)) resourceExtremes[id] = { min: 999, max: -999 };

let pathsExplored = 0;
let deepestDepth = 0;
let rollsForked = 0;

function recordExtremes(nodeId: string, resources: Resources) {
  const total = RESOURCES.reduce((a, r) => a + resources[r], 0); // cheap scalar for reporting only
  const e = resourceExtremes[nodeId];
  if (e) {
    e.min = Math.min(e.min, total);
    e.max = Math.max(e.max, total);
  }
}

type Axes = Record<string, number>;
// What a Condition is evaluated against while searching: resources, axes, flags, the difficulty and the branch are tracked; the purse is not
// (conditions on money are rejected below), and the favour is never used here.
function stateOf(resources: Resources, axes: Axes, flags: Record<string, boolean>, difficulty: Difficulty, branch: string): GameState {
  return { resources, axes, flags, difficulty, activeBranch: branch, money: 0, favorUsed: false } as unknown as GameState;
}

// Only a flag or axis that some option reads (requiresFlag, requires, showWhen) can change what is on offer, so the search key holds only those.
// Reachability of scenes, endings and unlockable options is unchanged by flags that merely flavour an ending; those are checked statically below.
const condFlagsOf = (c: Condition | undefined, into: Set<string>) => {
  if (!c) return;
  if ("flag" in c) into.add(c.flag);
  else if ("all" in c) c.all.forEach((x) => condFlagsOf(x, into));
  else if ("any" in c) c.any.forEach((x) => condFlagsOf(x, into));
  else if ("not" in c) condFlagsOf(c.not, into);
};
const condAxesOf = (c: Condition | undefined, into: Set<string>) => {
  if (!c) return;
  if ("axis" in c) into.add(c.axis);
  else if ("all" in c) c.all.forEach((x) => condAxesOf(x, into));
  else if ("any" in c) c.any.forEach((x) => condAxesOf(x, into));
  else if ("not" in c) condAxesOf(c.not, into);
};
const KEY_FLAGS = new Set<string>();
const KEY_AXES = new Set<string>();
for (const node of Object.values(NODES)) {
  for (const opt of node.options) {
    if (NONMONO.has(opt)) continue;
    if (opt.requiresFlag) KEY_FLAGS.add(opt.requiresFlag);
    condFlagsOf(opt.requires, KEY_FLAGS);
    condFlagsOf(opt.showWhen, KEY_FLAGS);
    condAxesOf(opt.requires, KEY_AXES);
    condAxesOf(opt.showWhen, KEY_AXES);
  }
}
for (const t of TRIGGERS) condFlagsOf(t.when, KEY_FLAGS);
const keyFlags = [...KEY_FLAGS].sort();
const keyAxes = [...KEY_AXES].sort();

// The search prunes a state that another state at the same scene dominates (every gauge and every gating axis at least as high, every gating flag already
// set). That is sound because every option left in the search asks only for "at least" or "set". Coupling rules only ever subtract while a gauge is short, so a
// higher gauge is still never worse, and the ruin endings (where lower is the point) are proven by witness runs below.
for (const c of def.config.coupling ?? []) for (const v of Object.values(c.add)) if ((v ?? 0) > 0) { console.error("FAIL: coupling must only subtract (a higher gauge must never be worse)"); process.exit(1); }
const flagBit = new Map(keyFlags.map((f, i) => [f, 1n << BigInt(i)]));
type Entry = { res: number[]; ax: number[]; mask: bigint };

// CAPS: for each scene and each gauge or axis in the key, the value above which nothing the rest of the game can do will matter. It is the highest threshold any
// option, coupling rule or ruin asks about, plus the most that the rest of the game could take off (the longest run of losses from this scene to any ending).
// A state whose value is above the cap can never fall to a threshold, so it plays out exactly as one at the cap does, and two such states are one state.
// The scenes that can still be reached from each scene (itself included): only what is read there or later can change what the rest of the game offers.
const FUT = new Map<string, Set<string>>();
{
  const succ = (id: string) => NODES[id].options.flatMap((o) => (o.roll ? [o.roll.success.nextNodeId ?? o.nextNodeId, o.roll.failure.nextNodeId ?? o.nextNodeId] : [o.nextNodeId])).filter((t) => !t.startsWith("ENDING_") && NODES[t]);
  for (const id of Object.keys(NODES)) {
    const seen = new Set<string>([id]);
    const stack = [id];
    while (stack.length) for (const t of succ(stack.pop()!)) if (!seen.has(t)) { seen.add(t); stack.push(t); }
    FUT.set(id, seen);
  }
}
const liveFlagsAt = new Map<string, bigint>();
const liveAxesAt = new Map<string, boolean[]>();
const thresholdOf = (id: string, kind: "res" | "ax", scope?: Set<string>): number => {
  let t = -Infinity;
  const consider = (c: Condition | undefined) => {
    if (!c) return;
    if (kind === "res" && "resource" in c && c.resource === id) t = Math.max(t, c.op === ">" || c.op === "<=" ? c.value + 1 : c.value);
    else if (kind === "ax" && "axis" in c && c.axis === id) t = Math.max(t, c.op === ">" ? c.value + 1 : c.value);
    else if ("all" in c) c.all.forEach(consider);
    else if ("any" in c) c.any.forEach(consider);
  };
  for (const node of Object.values(NODES)) for (const opt of node.options) {
    if (scope && !scope.has(node.id)) continue;
    if (NONMONO.has(opt)) continue;
    consider(opt.requires);
    consider(opt.showWhen);
    if (kind === "res" && opt.gate?.resource === id) t = Math.max(t, opt.gate.minThreshold);
  }
  for (const tr of TRIGGERS) if (!scope || tr.onEnterNodes.some((n) => scope.has(n))) consider(tr.when);
  if (kind === "res") {
    for (const c of def.config.coupling ?? []) if (c.when.resource === id) t = Math.max(t, c.when.atOrBelow + 1);
    const r = RESOURCE_DEFS.find((x) => x.id === id);
    if (r?.failAt !== undefined) t = Math.max(t, r.failAt + 1);
  }
  return Number.isFinite(t) ? t : 0;
};
const dropMemo = new Map<string, number>();
const couplingExtra = (id: string) => (def.config.coupling ?? []).reduce((m, c) => Math.max(m, -(c.add[id] ?? 0)), 0);
/** The most that can be taken off gauge or axis `id` between this scene (inclusive) and any ending. */
function maxDrop(nodeId: string, id: string, kind: "res" | "ax", stack: string[] = []): number {
  const key = `${kind}:${id}:${nodeId}`;
  const hit = dropMemo.get(key);
  if (hit !== undefined) return hit;
  if (stack.includes(nodeId)) return 0;
  let best = 0;
  for (const opt of NODES[nodeId].options) {
    if (NONMONO.has(opt)) continue;
    const lists = opt.roll ? [opt.roll.success.stamps, opt.roll.failure.stamps] : [opt.stamps];
    let here = 0;
    for (const st of lists) {
      if (kind === "res") {
        const d = st[id] ?? 0;
        // a gain can also be shrunk by a coupling rule, so it may take one point off as well
        here = Math.max(here, d < 0 ? -d : 0, couplingExtra(id));
      }
    }
    if (kind === "ax") here = Math.max(here, -(opt.axisDelta?.[id] ?? 0));
    const targets = opt.roll ? [opt.roll.success.nextNodeId ?? opt.nextNodeId, opt.roll.failure.nextNodeId ?? opt.nextNodeId] : [opt.nextNodeId];
    let after = 0;
    for (const t of targets) if (t !== nodeId && !t.startsWith("ENDING_") && NODES[t]) after = Math.max(after, maxDrop(t, id, kind, [...stack, nodeId]));
    best = Math.max(best, here + after);
  }
  // a trigger on arriving here can take something off too
  let trigDrop = 0;
  if (kind === "res") for (const tr of TRIGGERS) if (tr.onEnterNodes.includes(nodeId) && tr.stamps) trigDrop = Math.max(trigDrop, -(tr.stamps[id] ?? 0), couplingExtra(id));
  dropMemo.set(key, best + trigDrop);
  return best + trigDrop;
}
const CAPS = new Map<string, { res: number[]; ax: number[] }>();
{
  for (const id of Object.keys(NODES)) {
    const scope = FUT.get(id)!;
    CAPS.set(id, { res: RESOURCES.map((r) => thresholdOf(r, "res", scope) + maxDrop(id, r, "res")), ax: keyAxes.map((a) => thresholdOf(a, "ax", scope) + maxDrop(id, a, "ax")) });
    // flags and axes that nothing from here on reads cannot matter, so states differing only in them are one state
    let live = 0n;
    const liveAx = keyAxes.map(() => false);
    for (const sid of scope) for (const tr of TRIGGERS) {
      if (!tr.onEnterNodes.includes(sid)) continue;
      const fs = new Set<string>();
      condFlagsOf(tr.when, fs);
      for (const f of fs) live |= flagBit.get(f)!;
    }
    for (const sid of scope) for (const opt of NODES[sid].options) {
      if (NONMONO.has(opt)) continue;
      const fs = new Set<string>();
      if (opt.requiresFlag) fs.add(opt.requiresFlag);
      condFlagsOf(opt.requires, fs);
      condFlagsOf(opt.showWhen, fs);
      for (const f of fs) live |= flagBit.get(f)!;
      const as = new Set<string>();
      condAxesOf(opt.requires, as);
      condAxesOf(opt.showWhen, as);
      keyAxes.forEach((a, i) => { if (as.has(a)) liveAx[i] = true; });
    }
    liveFlagsAt.set(id, live);
    liveAxesAt.set(id, liveAx);
  }
}
const frontier = new Map<string, Entry[]>();
let pruned = 0;
/** Does `e` do at least as well as `n` on every dimension that matters? */
function covers(e: Entry, n: Entry): boolean {
  if ((e.mask & n.mask) !== n.mask) return false;
  for (let i = 0; i < n.res.length; i++) if (e.res[i] < n.res[i]) return false;
  for (let i = 0; i < n.ax.length; i++) if (e.ax[i] < n.ax[i]) return false;
  return true;
}
/** True if an already searched state at this scene dominates this one; otherwise records it (dropping any state it dominates). */
function dominated(difficulty: string, nodeId: string, resources: Resources, axes: Axes, flags: Record<string, boolean>): boolean {
  let mask = 0n;
  for (const f of keyFlags) if (flags[f]) mask |= flagBit.get(f)!;
  mask &= liveFlagsAt.get(nodeId) ?? ~0n;
  const liveAx = liveAxesAt.get(nodeId);
  // Values far above every threshold that the rest of the game could bring them down to are equivalent, so they are compared capped (see CAPS).
  const cap = CAPS.get(nodeId);
  const n: Entry = {
    res: RESOURCES.map((r, i) => Math.min(resources[r], cap ? cap.res[i] : Infinity)),
    ax: keyAxes.map((a, i) => (liveAx && !liveAx[i] ? 0 : Math.min(axes[a], cap ? cap.ax[i] : Infinity))),
    mask,
  };
  const k = `${difficulty}|${nodeId}`;
  let list = frontier.get(k);
  if (!list) frontier.set(k, (list = []));
  for (const e of list) if (covers(e, n)) return true;
  for (let i = list.length - 1; i >= 0; i--) if (covers(n, list[i])) list.splice(i, 1);
  list.push(n);
  return false;
}
// Everything this validator proves is "some real path does it", so the search stops the moment every scene, ending (the ruin endings are shown by the witness
// runs below) and option has been seen to be reachable. A scene, ending or option still unseen sends the search on, up to the whole space.
class AllReached extends Error {}
const RUIN_ENDINGS = new Set(RESOURCE_DEFS.map((r) => r.failureEndingId).filter(Boolean) as string[]);
const goalMaps = [gateEverSatisfied, flagGateEverSatisfied, condGateEverSatisfied, shownWhenEverShown];
function everythingReached(): boolean {
  if (reachableNodeIds.size < Object.keys(NODES).length) return false;
  for (const e of Object.keys(ENDINGS)) if (!RUIN_ENDINGS.has(e) && !reachableEndingIds.has(e)) return false;
  for (const m of goalMaps) for (const v of m.values()) if (!v) return false;
  return true;
}
let stoppedEarly = false;
// how many scenes reachable from a scene (itself included) have not been seen yet; recomputed whenever a new scene is first reached
let unreachedVersion = -1;
const unreachedAhead = new Map<string, number>();
function unreachedFrom(id: string): number {
  if (unreachedVersion !== reachableNodeIds.size) {
    unreachedAhead.clear();
    unreachedVersion = reachableNodeIds.size;
  }
  let n = unreachedAhead.get(id);
  if (n === undefined) {
    n = 0;
    for (const x of FUT.get(id) ?? []) if (!reachableNodeIds.has(x)) n++;
    unreachedAhead.set(id, n);
  }
  return n;
}
const unseenTarget = (t: string) => (t.startsWith("ENDING_") ? !reachableEndingIds.has(t) : !reachableNodeIds.has(t));
/** Arriving at a scene can fire a trigger with consequences: apply it as the engine does, then search from there. */
function enter(target: string, resources: Resources, axes: Axes, flags: Record<string, boolean>, depth: number, difficulty: Difficulty) {
  const node = NODES[target];
  if (node) {
    const here = stateOf(resources, axes, flags, difficulty, node.branch);
    const trig = TRIGGERS.find((t) => t.onEnterNodes.includes(target) && (!t.when || evalCondition(t.when, here)));
    if (trig && (trig.stamps || trig.setFlags)) {
      const after = trig.stamps ? applyStamps(def, resources, trig.stamps) : resources;
      const ending = trig.stamps ? failureOf(after) : undefined;
      if (ending) {
        reachableEndingIds.add(ending);
        return;
      }
      const flags2 = trig.setFlags ? { ...flags, ...Object.fromEntries(trig.setFlags.map((f) => [f, true])) } : flags;
      dfs(target, after, axes, flags2, depth, difficulty);
      return;
    }
  }
  dfs(target, resources, axes, flags, depth, difficulty);
}
function dfs(nodeId: string, resources: Resources, axes: Axes, flags: Record<string, boolean>, depth: number, difficulty: Difficulty) {
  if (dominated(difficulty, nodeId, resources, axes, flags)) {
    pruned++;
    return;
  }
  pathsExplored++;
  if (process.env.TRACE && pathsExplored % 20000 === 0) {
    const open: string[] = [];
    for (const id of Object.keys(NODES)) if (!reachableNodeIds.has(id)) open.push("node " + id);
    for (const e of Object.keys(ENDINGS)) if (!RUIN_ENDINGS.has(e) && !reachableEndingIds.has(e)) open.push("ending " + e);
    for (const m of goalMaps) for (const [k, v] of m.entries()) if (!v) open.push(k);
    console.log(`  [trace] ${pathsExplored} expanded; ${open.length} goals open: ${open.slice(0, 8).join(" | ")}`);
  }
  if (pathsExplored % 64 === 0 && everythingReached()) {
    stoppedEarly = true;
    throw new AllReached();
  }
  deepestDepth = Math.max(deepestDepth, depth);
  reachableNodeIds.add(nodeId);
  recordExtremes(nodeId, resources);
  const node = NODES[nodeId];
  if (!node) return;

  const here = stateOf(resources, axes, flags, difficulty, node.branch);
  // options that lead somewhere not yet seen, or that unlock something not yet seen, go first
  const goalKey = (o: (typeof node.options)[number]) => `${nodeId}:${o.label}`;
  const fresh = (o: (typeof node.options)[number]) => {
    const ts = o.roll ? [o.roll.success.nextNodeId ?? o.nextNodeId, o.roll.failure.nextNodeId ?? o.nextNodeId] : [o.nextNodeId];
    return ts.some(unseenTarget) || [gateEverSatisfied, flagGateEverSatisfied, condGateEverSatisfied, shownWhenEverShown].some((m) => m.get(goalKey(o)) === false);
  };
  // among those, the one with the least still unseen ahead of it first: a small volume is finished before the long case is searched
  const cost = (o: (typeof node.options)[number]) => {
    if (!fresh(o)) return Infinity;
    const ts = o.roll ? [o.roll.success.nextNodeId ?? o.nextNodeId, o.roll.failure.nextNodeId ?? o.nextNodeId] : [o.nextNodeId];
    return Math.min(...ts.map((t) => (NODES[t] ? unreachedFrom(t) : 0)));
  };
  const costs = new Map(node.options.map((o) => [o, cost(o)] as const));
  const ordered = [...node.options].sort((a, b) => (costs.get(a)! === costs.get(b)! ? 0 : costs.get(a)! < costs.get(b)! ? -1 : 1));
  for (const opt of ordered) {
    if (NONMONO.has(opt)) continue;
    if (opt.showWhen) {
      if (isOptionHidden(here, opt)) continue;
      shownWhenEverShown.set(`${nodeId}:${opt.label}`, true);
    }
    const locked = isOptionLocked(resources, opt.gate);
    if (locked) continue;
    const flagLocked = isOptionFlagLocked(flags, opt.requiresFlag);
    if (flagLocked) continue;
    if (opt.requires) {
      if (isOptionConditionLocked(here, opt)) continue;
      condGateEverSatisfied.set(`${nodeId}:${opt.label}`, true);
    }
    if (opt.gate) gateEverSatisfied.set(`${nodeId}:${opt.label}`, true);
    if (opt.requiresFlag) flagGateEverSatisfied.set(`${nodeId}:${opt.label}`, true);
    const nextAxes = applyAxisDelta(def, axes, opt.axisDelta);

    if (opt.roll) {
      // Fork the DFS on both branches of the roll. Each branch may name its
      // own nextNodeId (a real structural payoff for the gamble); falls back
      // to the option's shared nextNodeId when it doesn't.
      rollsForked++;
      for (const branch of [opt.roll.success, opt.roll.failure]) {
        const next: Resources = applyStamps(def, resources, branch.stamps);
        const failureEnding = failureOf(next);
        if (failureEnding) {
          reachableEndingIds.add(failureEnding);
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
        enter(target, next, nextAxes, nextFlags, depth + 1, difficulty);
      }
      continue;
    }

    const next: Resources = applyStamps(def, resources, opt.stamps);

    const failureEnding = failureOf(next);
    if (failureEnding) {
      reachableEndingIds.add(failureEnding);
      continue; // terminal
    }

    const target = opt.nextNodeId;
    if (target.startsWith("ENDING_")) {
      reachableEndingIds.add(target);
      continue;
    }

    const nextFlags = opt.setFlags ? { ...flags, ...Object.fromEntries(opt.setFlags.map((f) => [f, true])) } : flags;
    enter(target, next, nextAxes, nextFlags, depth + 1, difficulty);
  }
}

// One search, on the hardest setting: it offers every option the easier ones do (the search ignores the purse) and the options only it shows, so what is
// reachable on Easy or Medium is reachable here. (The check below is that something is reachable on some difficulty, which is what it always was.)
try {
  for (const difficulty of ["HARD" as Difficulty]) dfs(START_NODE_ID, Object.fromEntries(def.config.resources.map((r) => [r.id, r.start])), Object.fromEntries(def.config.axes.map((a) => [a.id, 0])), {}, 0, difficulty);
} catch (e) {
  if (!(e instanceof AllReached)) throw e;
}

ok(`${pathsExplored} game-states expanded (${pruned} pruned as dominated; max depth ${deepestDepth}) by DFS on the hardest setting (a superset of the others), forking ${rollsForked} roll option encounter(s) into success/failure branches; ${stoppedEarly ? "stopped once every scene, ending and option had been reached" : "the whole space was searched"}`);

// Low-state options (see NONMONO): leaving them out of the search must lose nothing, and each must be shown by some real run.
{
  const setBy = new Set<string>([def.config.assist?.favorFlag ?? ""]);
  for (const node of Object.values(NODES)) for (const opt of node.options) {
    if (NONMONO.has(opt)) continue;
    opt.setFlags?.forEach((f) => setBy.add(f));
    opt.roll?.success.setFlags?.forEach((f) => setBy.add(f));
    opt.roll?.failure.setFlags?.forEach((f) => setBy.add(f));
  }
  const lost: string[] = [];
  for (const node of Object.values(NODES)) for (const opt of node.options) {
    if (!NONMONO.has(opt)) continue;
    const targets = opt.roll ? [opt.roll.success.nextNodeId ?? opt.nextNodeId, opt.roll.failure.nextNodeId ?? opt.nextNodeId] : [opt.nextNodeId];
    for (const t of targets) {
      if (t === node.id) continue;
      if (t.startsWith("ENDING_") ? !reachableEndingIds.has(t) : !reachableNodeIds.has(t)) lost.push(`${node.id}:${opt.label} leads to ${t}, which only it reaches`);
    }
    const flagsOf = [...(opt.setFlags ?? []), ...(opt.roll?.success.setFlags ?? []), ...(opt.roll?.failure.setFlags ?? [])];
    // a flag that only hides the option itself (rest once, vouch once) needs no other setter
    const selfHiding = new Set<string>();
    const hides = (c: Condition | undefined, pos = true): void => {
      if (!c) return;
      if ("not" in c) hides(c.not, !pos);
      else if ("flag" in c) { if (!pos) selfHiding.add(c.flag); }
      else if ("all" in c) c.all.forEach((x) => hides(x, pos));
      else if ("any" in c) c.any.forEach((x) => hides(x, pos));
    };
    hides(opt.showWhen);
    for (const f of flagsOf) if (!setBy.has(f) && !selfHiding.has(f)) lost.push(`${node.id}:${opt.label} is the only thing that sets ${f}`);
  }
  if (lost.length) fail(`left out of the search but not redundant: ${lost.join(" | ")}`);
  else ok(`${NONMONO.size} low-state options are redundant for reachability (every target and flag is reached or set elsewhere)`);

  const rngW = (seed: number) => {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
  // each witness player pushes one or two things: a gauge or a trust down, or a gauge down while a trust goes up (the repair options need exactly that)
  const trustIds = def.config.axes.filter((a) => a.id.startsWith("trust")).map((a) => a.id);
  const targets: [string, number][][] = [...RESOURCES.map((r) => [[r, 1]] as [string, number][]), ...trustIds.map((a) => [[a, 1]] as [string, number][]), ...RESOURCES.flatMap((r) => trustIds.map((a) => [[r, 1], [a, -1]] as [string, number][])), []];
  const seen = new Set<object>();
  for (let seed = 1; seed <= 20000 && seen.size < NONMONO.size; seed++) {
    const target = targets[seed % targets.length];
    const rand = rngW(seed * 17 + 3);
    let st = createInitialState(def);
    st = reduce(def, st, { type: "SET_DIFFICULTY", difficulty: DIFFICULTIES[seed % DIFFICULTIES.length] });
    for (const t of ["START_GAME", "ADVANCE_PROLOGUE", "ENTER_STORY"] as const) st = reduce(def, st, { type: t });
    for (let i = 0; i < 500 && st.phase !== "ENDING"; i++) {
      if (st.phase === "NODE") {
        const node = NODES[st.currentNodeId];
        for (const opt of node.options) if (NONMONO.has(opt) && !isOptionUnavailable(def, st, opt)) seen.add(opt);
        const open = node.options.map((_o, k) => k).filter((k) => !isOptionUnavailable(def, st, node.options[k]));
        const score = (k: number) => {
          const o = node.options[k];
          let sum = 0;
          for (const [t, w] of target) {
            if (t in (st.resources as object)) sum += w * (o.roll ? Math.min(o.roll.success.stamps[t] ?? 0, o.roll.failure.stamps[t] ?? 0) : o.stamps[t] ?? 0);
            else sum += w * (o.axisDelta?.[t] ?? 0);
          }
          return sum;
        };
        open.sort((x, y) => score(x) - score(y));
        const pick = !target.length || rand() < 0.3 ? open[Math.floor(rand() * open.length)] : open[0];
        st = reduce(def, st, { type: "SELECT_OPTION", optionIndex: pick });
      } else if (st.phase === "ROLL") st = reduce(def, st, { type: "CONDUCT_EXPERIMENT", roll: rand() });
      else if (st.phase === "OUTCOME") st = reduce(def, st, { type: "CONTINUE_OUTCOME" });
      else if (st.phase === "INTERLUDE") st = reduce(def, st, { type: "DISMISS_INTERLUDE" });
      else break;
    }
  }
  const unseen: string[] = [];
  for (const node of Object.values(NODES)) for (const opt of node.options) if (NONMONO.has(opt) && !seen.has(opt)) unseen.push(`${node.id}:${opt.label}`);
  if (unseen.length) fail(`low-state options never shown in the witness runs: ${unseen.join(" | ")}`);
  else ok(`all ${NONMONO.size} low-state options were shown in a witness run`);
}

// Ruin endings: witness runs on the real reducer. A player who always takes the option worst for one gauge (with some noise, and the worse side of every
// gambit) must reach that gauge's ruin ending on some difficulty.
{
  const rngWitness = (seed: number) => {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
  for (const r of RESOURCES) {
    const target = RESOURCE_DEFS.find((x) => x.id === r)!.failureEndingId;
    if (!target || reachableEndingIds.has(target)) continue;
    outer: for (const difficulty of DIFFICULTIES) {
      for (let seed = 1; seed <= 3000; seed++) {
        const rand = rngWitness(seed * 31 + r.length);
        let st = createInitialState(def);
        st = reduce(def, st, { type: "SET_DIFFICULTY", difficulty });
        st = reduce(def, st, { type: "START_GAME" });
        st = reduce(def, st, { type: "ADVANCE_PROLOGUE" });
        st = reduce(def, st, { type: "ENTER_STORY" });
        for (let i = 0; i < 400 && st.phase !== "ENDING"; i++) {
          if (st.phase === "NODE") {
            const node = NODES[st.currentNodeId];
            const open = node.options.map((_o, k) => k).filter((k) => !isOptionUnavailable(def, st, node.options[k]));
            const worst = (k: number) => {
              const o = node.options[k];
              return o.roll ? Math.min(o.roll.success.stamps[r] ?? 0, o.roll.failure.stamps[r] ?? 0) : o.stamps[r] ?? 0;
            };
            open.sort((x, y) => worst(x) - worst(y));
            const pick = rand() < 0.25 ? open[Math.floor(rand() * open.length)] : open[0];
            st = reduce(def, st, { type: "SELECT_OPTION", optionIndex: pick });
          } else if (st.phase === "ROLL") {
            const roll = st.pendingRoll!;
            st = reduce(def, st, { type: "CONDUCT_EXPERIMENT", roll: (roll.success.stamps[r] ?? 0) < (roll.failure.stamps[r] ?? 0) ? 0 : 0.999 });
          } else if (st.phase === "OUTCOME") st = reduce(def, st, { type: "CONTINUE_OUTCOME" });
          else if (st.phase === "INTERLUDE") st = reduce(def, st, { type: "DISMISS_INTERLUDE" });
          else break;
        }
        if (st.endingId === target) {
          reachableEndingIds.add(target);
          ok(`ruin ending ${target} demonstrated by a witness run (${difficulty}, seed ${seed})`);
          break outer;
        }
      }
    }
  }
}

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

// 5c. Every `requires` option (an axis, a resource, a flag...) is unlockable by some real path, and every `showWhen` option is shown by one.
const deadCond = condGateKeys.filter((k) => !condGateEverSatisfied.get(k));
if (deadCond.length) fail(`${deadCond.length} \`requires\` option(s) never unlockable by any real path: ${deadCond.join(" | ")}`);
else ok(`all ${condGateKeys.length} \`requires\` options (axis, resource and flag conditions) are unlockable by at least one real path`);
const neverShown = shownWhenKeys.filter((k) => !shownWhenEverShown.get(k));
if (neverShown.length) fail(`${neverShown.length} \`showWhen\` option(s) never shown on any difficulty: ${neverShown.join(" | ")}`);
else ok(`all ${shownWhenKeys.length} \`showWhen\` options are shown on at least one difficulty`);
// Conditions on the purse cannot be searched (money is not tracked), so they are not allowed on options.
const moneyConds: string[] = [];
const hasMoney = (c: Condition): boolean => ("stat" in c ? true : "all" in c ? c.all.some(hasMoney) : "any" in c ? c.any.some(hasMoney) : "not" in c ? hasMoney(c.not) : false);
for (const node of Object.values(NODES)) for (const opt of node.options) for (const c of [opt.requires, opt.showWhen]) if (c && hasMoney(c)) moneyConds.push(`${node.id}:${opt.label}`);
if (moneyConds.length) fail(`conditions on money are not allowed on options (the search cannot prove them): ${moneyConds.join(" | ")}`);

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
const condFlags = (c: Condition | undefined, into: Set<string>) => {
  if (!c) return;
  if ("flag" in c) into.add(c.flag);
  else if ("all" in c) c.all.forEach((x) => condFlags(x, into));
  else if ("any" in c) c.any.forEach((x) => condFlags(x, into));
  else if ("not" in c) condFlags(c.not, into);
};
for (const ending of Object.values(ENDINGS)) {
  ending.variants?.forEach((v) => {
    if (v.flag) flagsRead.add(v.flag);
    condFlags(v.when, flagsRead);
  });
}
// a flag read by a scene's echo is read too
for (const node of Object.values(NODES)) node.echoes?.forEach((e) => condFlags(e.when, flagsRead));

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
    condFlags(opt.requires, flagsUsedAsRequires);
    condFlags(opt.showWhen, flagsUsedAsRequires);
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
      // a repair option that sets the flag hiding it returns to its own scene on purpose (rest once, then read the scene again)
      if (target === node.id && opt.showWhen && opt.setFlags?.length) continue;
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
  const hasFreeOption = node.options.some((opt) => !opt.gate && !opt.moneyCost && !opt.requires && !opt.showWhen);
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

// 10. Every branch is entered through a scene that a one-shot card announces.
const branchEntry = def.config.interludeTriggers.flatMap((t) => t.onEnterNodes);
const NON_START_BRANCHES = [...new Set(Object.values(NODES).map((n) => n.branch))].filter((b) => b !== def.config.startBranch);
for (const b of NON_START_BRANCHES) {
  const entries = Object.values(NODES).filter((n) => n.branch === b && Object.values(NODES).some((m) => m.branch !== b && m.options.some((o) => o.nextNodeId === n.id)));
  const uncovered = entries.filter((n) => !branchEntry.includes(n.id));
  if (uncovered.length) fail(`branch ${b} is entered at ${uncovered.map((n) => n.id).join(", ")}, which no interlude trigger announces`);
  else ok(`every entrance to branch ${b} (${entries.map((n) => n.id).join(", ")}) is announced by an interlude`);
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
