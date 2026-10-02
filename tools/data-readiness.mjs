#!/usr/bin/env node
// How much of each campaign game's content could already move to JSON (Frankenstein's model)?
// Evaluates every game's real CAMPAIGNS and, per campaign, counts nodes that are pure data versus nodes
// that contain functions (gates, nextIf, computed text). Functions are what block a straight move to
// JSON: they need a declarative form first (Frankenstein's `Condition` in packages/engine/src/schema.ts).
//
//   node tools/data-readiness.mjs            all four campaign games
//   node tools/data-readiness.mjs 1922       one game
import { readFileSync } from "node:fs";
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
  { name: "1914", load: load1914 },
  { name: "1922", load: () => loadCampaignsFromDataSection(join(ROOT, "Dispatches 1922", "src", "App.jsx")) },
  { name: "1941", load: () => loadCampaignsFromJsx(esbuildFor("Dispatches 1941"), join(ROOT, "Dispatches 1941", "src", "App.jsx")) },
  { name: "1940", load: () => loadCampaignsFromJsx(esbuildFor("Dispatches 1940"), join(ROOT, "Dispatches 1940", "src", "App.jsx")) },
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

/**
 * The nodes of a campaign as plain objects. 1914 stores them in camp.nodes; the other games build
 * each node with camp.resolveNode(id, flags, meters), so walk from camp.start along static next links,
 * and call a node "context-dependent" if resolving it under different meters, or with every flag the choices
 * can set switched on, changes its content. (Flag values other than true are not tried, so this can still
 * under-report: treat the percentages as an upper bound on how much is already pure data.)
 */
function nodesOf(camp) {
  if (camp.nodes && Object.keys(camp.nodes).length) return Object.entries(camp.nodes).map(([id, node]) => ({ id, node, dependent: false }));
  if (typeof camp.resolveNode !== "function" || !camp.start) return [];
  const meters = camp.initialMeters ?? {};
  const shifted = (d) => Object.fromEntries(Object.keys(meters).map((k) => [k, d]));
  const contexts = [{ flags: {}, meters }, { flags: {}, meters: shifted(5) }, { flags: {}, meters: shifted(-5) }];
  const seen = new Set();
  const out = [];
  const flagKeys = new Set();
  const queue = [camp.start];
  while (queue.length) {
    const id = queue.pop();
    if (!id || seen.has(id)) continue;
    seen.add(id);
    let node;
    const variants = [];
    try {
      for (const c of contexts) variants.push(camp.resolveNode(id, c.flags, c.meters));
      node = variants[0];
    } catch {
      continue;
    }
    if (!node) continue;
    const ser = (n) => JSON.stringify(n, (k, v) => (typeof v === "function" ? "<fn>" : v));
    out.push({ id, node, dependent: new Set(variants.map(ser)).size > 1 });
    for (const v of variants) for (const ch of v.choices ?? []) {
      for (const k of Object.keys(ch.setFlags ?? {})) flagKeys.add(k);
      for (const u of ch.uncertain ?? []) for (const k of Object.keys(u.setFlags ?? {})) flagKeys.add(k);
      if (typeof ch.next === "string") queue.push(ch.next);
      for (const u of ch.uncertain ?? []) if (typeof u.next === "string") queue.push(u.next);
    }
  }
  // Second pass: with every flag the choices can set switched on, does the node change?
  const allFlags = Object.fromEntries([...flagKeys].map((k) => [k, true]));
  const ser = (n) => JSON.stringify(n, (k, v) => (typeof v === "function" ? "<fn>" : v));
  for (const o of out) {
    if (o.dependent || flagKeys.size === 0) continue;
    try {
      if (ser(camp.resolveNode(o.id, allFlags, meters)) !== ser(o.node)) o.dependent = true;
    } catch {
      o.dependent = true;
    }
  }
  return out;
}

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
      for (const p of new Set(fns.map((x) => x.replace(/\[\]/g, "[]")))) fieldCounts.set(p, (fieldCounts.get(p) ?? 0) + 1);
      bytes += JSON.stringify(node, (k, v) => (typeof v === "function" ? undefined : v)).length;
    }
    nodes += entries.length;
    pure += campPure;
    console.log(`  ${cid.padEnd(18)} ${String(entries.length).padStart(4)} nodes, ${String(campPure).padStart(4)} pure data (${pct(campPure, entries.length)})`);
  }
  const top = [...fieldCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([p, n]) => `${p} x${n}`).join(", ");
  console.log(`  total: ${nodes} nodes, ${pure} pure data (${pct(pure, nodes)}); ~${Math.round(bytes / 1024)} KB of node data as JSON`);
  if (top) console.log(`  most common function fields (nodes containing them): ${top}`);
  totals.push({ name: g.name, nodes, pure });
}
if (totals.length > 1) {
  const n = totals.reduce((a, t) => a + t.nodes, 0);
  const p = totals.reduce((a, t) => a + t.pure, 0);
  console.log(`\nAll games: ${n} nodes, ${p} pure data (${pct(p, n)}).`);
}
