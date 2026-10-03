#!/usr/bin/env node
// How much of each campaign game's content could already move to JSON (Frankenstein's model)?
// Evaluates every game's real campaigns and, per campaign, counts nodes that are pure data versus nodes
// that contain functions (gates, nextIf, computed text) or whose content changes with meters or flags. Those are
// what block a straight move to JSON: they need a declarative form first (Frankenstein's `Condition` in
// packages/engine/src/schema.ts). Nodes already stored as JSON (src/data/*.nodes.json) are counted separately.
//
//   node tools/data-readiness.mjs            all four campaign games
//   node tools/data-readiness.mjs 1922       one game
//
// "Changes with meters or flags" is tested by resolving each node at every meter level (-10..10, all meters together
// and each meter alone) and with every flag the choices can set switched to true, to a string, to a number and to each
// value the walk has seen. That is thorough but not a proof, so the percentages are an upper bound on what is plain data.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import { loadCampaignsFromDataSection, loadCampaignsFromJsx } from "../packages/testkit/src/load-campaigns.mjs";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const only = process.argv[2];
const esbuildFor = (game) => createRequire(join(ROOT, game, "package.json"))("esbuild");

function load1914() {
  const src = readFileSync(join(ROOT, "Dispatches 1914", "dispatches-greatwar.jsx"), "utf8").split("// UI_LAYER")[0].replace(/^export\s+/gm, "") + "\nmodule.exports = { CAMPAIGNS };\n";
  const sandbox = { module: { exports: {} }, console, process: { env: {} } };
  sandbox.exports = sandbox.module.exports;
  vm.runInNewContext(src, sandbox);
  return sandbox.module.exports.CAMPAIGNS;
}

const GAMES = [
  { name: "1914", dir: "Dispatches 1914", load: load1914 },
  { name: "1922", dir: "Dispatches 1922", load: () => loadCampaignsFromDataSection(join(ROOT, "Dispatches 1922", "src", "App.jsx")) },
  { name: "1941", dir: "Dispatches 1941", load: () => loadCampaignsFromJsx(esbuildFor("Dispatches 1941"), join(ROOT, "Dispatches 1941", "src", "App.jsx")) },
  { name: "1940", dir: "Dispatches 1940", load: () => loadCampaignsFromJsx(esbuildFor("Dispatches 1940"), join(ROOT, "Dispatches 1940", "src", "App.jsx")) },
].filter((g) => !only || g.name.includes(only));

/** Paths (field names, array indexes as []) of every function inside a value. */
function functionPaths(v, path = "", out = [], depth = 0) {
  if (typeof v === "function") out.push(path);
  else if (v && typeof v === "object" && depth < 12) {
    if (Array.isArray(v)) v.forEach((x) => functionPaths(x, path + "[]", out, depth + 1));
    else for (const k of Object.keys(v)) functionPaths(v[k], path ? `${path}.${k}` : k, out, depth + 1);
  }
  return out;
}

const ser = (n) => JSON.stringify(n, (k, v) => (typeof v === "function" ? "<fn>" : v));

/**
 * The nodes of a campaign as plain objects. 1914 stores them in camp.nodes; the other games build each node with
 * camp.resolveNode(id, flags, meters), so walk from camp.start along static next links and judge each node.
 */
function nodesOf(camp) {
  if (camp.nodes && Object.keys(camp.nodes).length) return Object.entries(camp.nodes).map(([id, node]) => ({ id, node, dependent: false }));
  if (typeof camp.resolveNode !== "function" || !camp.start) return [];
  const base = camp.initialMeters ?? camp.triangleAxes?.reduce((o, a) => ({ ...o, [a.key]: 0 }), {}) ?? { a: 0, b: 0, c: 0 };
  const keys = Object.keys(base);
  const mk = (v) => Object.fromEntries(keys.map((k) => [k, v]));
  const meterStates = [];
  for (let v = -10; v <= 10; v++) meterStates.push(mk(v));
  for (const k of keys) for (let v = -10; v <= 10; v++) if (v !== 0) meterStates.push({ ...mk(0), [k]: v });
  const zero = mk(0);

  // Pass 1: walk the static graph, collecting nodes and every value each flag is ever set to.
  const flagVals = new Map();
  const noteFlags = (sf) => {
    for (const [k, v] of Object.entries(sf || {})) {
      const arr = flagVals.get(k) ?? [];
      if (!arr.some((x) => Object.is(x, v))) arr.push(v);
      flagVals.set(k, arr);
    }
  };
  const seen = new Set();
  const out = [];
  const queue = [camp.start];
  while (queue.length) {
    const id = queue.pop();
    if (!id || seen.has(id)) continue;
    seen.add(id);
    let node;
    try {
      node = camp.resolveNode(id, {}, zero);
    } catch {
      continue;
    }
    if (!node) continue;
    out.push({ id, node, dependent: false });
    for (const ch of node.choices ?? []) {
      noteFlags(ch.setFlags);
      if (typeof ch.next === "string") queue.push(ch.next);
      for (const u of ch.uncertain ?? []) {
        noteFlags(u.setFlags);
        if (typeof u.next === "string") queue.push(u.next);
      }
    }
  }

  // Pass 2: does any node change with the flag or meter state?
  const flagKeys = [...flagVals.keys()];
  const maxVals = Math.max(1, ...[...flagVals.values()].map((v) => v.length));
  const flagStates = [{}, ...[true, "zz", 3].map((v) => Object.fromEntries(flagKeys.map((k) => [k, v])))];
  for (let i = 0; i < maxVals; i++) flagStates.push(Object.fromEntries(flagKeys.map((k) => [k, flagVals.get(k)[Math.min(i, flagVals.get(k).length - 1)]])));
  for (const o of out) {
    const first = ser(o.node);
    try {
      o.dependent = !flagStates.every((f) => meterStates.every((m) => ser(camp.resolveNode(o.id, f, m)) === first));
    } catch {
      o.dependent = true;
    }
  }
  return out;
}

const jsonBacked = (dir) => {
  const d = join(ROOT, dir, "src", "data");
  if (!existsSync(d)) return 0;
  return readdirSync(d)
    .filter((f) => f.endsWith(".nodes.json"))
    .reduce((a, f) => a + Object.keys(JSON.parse(readFileSync(join(d, f), "utf8"))).length, 0);
};

const pct = (a, b) => (b ? ((a / b) * 100).toFixed(0) + "%" : "-");
const totals = [];
for (const g of GAMES) {
  let campaigns;
  try {
    campaigns = g.load();
  } catch (e) {
    console.log(`${g.name}: could not load campaigns (${e.message.split("\n")[0]})`);
    continue;
  }
  console.log(`\n=== ${g.name} ===`);
  let nodes = 0;
  let pure = 0;
  let bytes = 0;
  const fieldCounts = new Map();
  for (const [cid, camp] of Object.entries(campaigns)) {
    const entries = nodesOf(camp);
    let campPure = 0;
    for (const { node, dependent } of entries) {
      const fns = functionPaths(node);
      if (dependent) fieldCounts.set("(content changes with meters or flags)", (fieldCounts.get("(content changes with meters or flags)") ?? 0) + 1);
      if (fns.length === 0 && !dependent) campPure++;
      for (const p of new Set(fns)) fieldCounts.set(p, (fieldCounts.get(p) ?? 0) + 1);
      bytes += ser(node).length;
    }
    nodes += entries.length;
    pure += campPure;
    console.log(`  ${cid.padEnd(18)} ${String(entries.length).padStart(4)} nodes, ${String(campPure).padStart(4)} pure data (${pct(campPure, entries.length)})`);
  }
  const top = [...fieldCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([p, n]) => `${p} x${n}`).join(", ");
  const inJson = jsonBacked(g.dir);
  console.log(`  total: ${nodes} nodes, ${pure} pure data (${pct(pure, nodes)}); ~${Math.round(bytes / 1024)} KB of node data as JSON; ${inJson} node(s) already stored as JSON`);
  if (top) console.log(`  most common blockers (nodes containing them): ${top}`);
  totals.push({ name: g.name, nodes, pure, inJson });
}
if (totals.length > 1) {
  const n = totals.reduce((a, t) => a + t.nodes, 0);
  const p = totals.reduce((a, t) => a + t.pure, 0);
  const j = totals.reduce((a, t) => a + t.inJson, 0);
  console.log(`\nAll games: ${n} nodes, ${p} pure data (${pct(p, n)}); ${j} stored as JSON.`);
}
