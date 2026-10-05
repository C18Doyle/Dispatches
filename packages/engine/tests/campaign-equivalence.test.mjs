// Differential test: the engine's campaign primitives (packages/engine/src/campaign.ts) must give
// the same result as each game's own choice-resolution code, on every real choice of every real
// campaign, across meter samples and roll values. This is what lets the games move onto the engine
// without behaviour change.
//
//   node packages/engine/tests/campaign-equivalence.test.mjs        (from the repo root)
//
// Reference implementations compared: 1914 chooseNext (kept in its JSX engine layer), 1922
// src/logic.ts, 1941 src/logic.ts, 1940 src/logic.ts. Needs `npm install` in those four folders
// (esbuild comes from 1914's node_modules).
import { createRequire } from "node:module";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import vm from "node:vm";

const ROOT = resolve(import.meta.dirname, "..", "..", "..");
const G = (name) => join(ROOT, name);
const requireFrom = (dir) => createRequire(join(dir, "package.json"));
const esbuild = requireFrom(G("Dispatches 1914"))("esbuild");
const tmp = mkdtempSync(join(tmpdir(), "d-equiv-"));

async function compileTs(file, name) {
  const out = join(tmp, name + ".mjs");
  esbuild.buildSync({ entryPoints: [file], outfile: out, format: "esm", bundle: true, platform: "node", logLevel: "silent" });
  return import(pathToFileURL(out).href);
}

/** Evaluates a game's CAMPAIGNS: transpile the whole JSX with stubs for react/tone/assets (as the games' own extractors do). */
function loadCampaigns(appPath) {
  let src = readFileSync(appPath, "utf8").replace(/^import[\s\S]*?from\s+["'][^"']+["'];?[ \t]*$/gm, "").replace(/^import\s+["'][^"']+["'];?[ \t]*$/gm, "");
  const { code } = esbuild.transformSync(src, { loader: "jsx", jsx: "transform", jsxFactory: "React.createElement", jsxFragment: "React.Fragment", format: "cjs", target: "node18" });
  const prelude =
    `class StubComponent {};\n` +
    `const React = { createElement: () => null, Fragment: Symbol("F"), useState: () => [undefined, () => {}], useEffect() {}, useMemo: (f) => f(), useRef: () => ({ current: undefined }), useCallback: (f) => f, Component: StubComponent };\n` +
    `const useState = React.useState, useEffect = React.useEffect, useMemo = React.useMemo, useRef = React.useRef, useCallback = React.useCallback, Component = StubComponent;\n` +
    `const Tone = new Proxy({}, { get: () => new Proxy(function () {}, { get: () => () => ({}), apply: () => ({}) }) });\n` +
    `const THEME_MUSIC_DATA_URL = "", REGIONS_GEOMETRY = {};\n` +
    `const EMPTY_METERS = { manpower: 0, fuel: 0, initiative: 0, readiness: 0, pipeline: 0 };\n`;
  const sandbox = { module: { exports: {} }, console, process: { env: {} }, setTimeout, clearTimeout };
  sandbox.exports = sandbox.module.exports;
  vm.runInNewContext(prelude + code + `\nmodule.exports = { CAMPAIGNS };\n`, sandbox, { filename: appPath });
  return sandbox.module.exports.CAMPAIGNS;
}

const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const ROLLS = [0.001, 0.2, 0.45, 0.5, 0.74, 0.9, 0.999];
const meterSamples = (keys) => {
  const mk = (f) => Object.fromEntries(keys.map((k, i) => [k, f(i)]));
  return [mk(() => 0), mk(() => 5), mk(() => -5), mk(() => 9), mk(() => -9), mk((i) => ((i * 7) % 11) - 5), mk((i) => 4 - ((i * 5) % 9))];
};

let checked = 0;
let failures = 0;
const fail = (m) => {
  if (failures++ < 15) console.error("FAIL: " + m);
};
const engine = await compileTs(join(ROOT, "packages", "engine", "src", "campaign.ts"), "engine-campaign");

// ───────────────────────── 1914: chooseNext ─────────────────────────
{
  const { loadEngine } = requireFrom(G("Dispatches 1914"))("./_load.js");
  const e = loadEngine(join(G("Dispatches 1914"), "dispatches-greatwar.jsx"));
  const axes = e.METER_AXES.map((key) => ({ key, min: e.METER_MIN, max: e.METER_MAX }));
  const rules = { axes, impact: "replace", roll: { scale: "total", fallback: "last" }, routing: "roll-then-nextIf-then-choice" };
  for (const cid of e.CAMPAIGN_IDS) {
    for (const node of Object.values(e.CAMPAIGNS[cid].nodes)) {
      for (const choice of node.choices || []) {
        for (const meters of meterSamples(e.METER_AXES)) {
          for (const u of ROLLS) {
            const flags = { seeded: true };
            const ref = e.chooseNext(cid, choice, flags, meters, e.emptyHardState(), () => u);
            const got = engine.resolveChoice({ choice, meters, flags, rules, rand: () => u });
            checked++;
            if (!eq(ref.meters, got.meters) || !eq(ref.flags, got.flags) || (ref.nextId ?? null) !== (got.destination ?? null) || ref.branch !== got.variant)
              fail(`1914 ${cid}/${node.id ?? "?"} u=${u}: ref ${JSON.stringify([ref.meters, ref.nextId])} vs engine ${JSON.stringify([got.meters, got.destination])}`);
          }
        }
      }
    }
  }
}

// ───────────────────────── 1922: logic.ts resolveChoice ─────────────────────────
{
  const dir = G("Dispatches 1922");
  const data = readFileSync(join(dir, "src", "App.jsx"), "utf8").split("// PREVIEW SCREENS")[0].replace(/^export /gm, "") + "\nmodule.exports = { CAMPAIGNS, applyImpact, clampTriangle };\n";
  const dataPath = join(tmp, "d1922-data.cjs");
  writeFileSync(dataPath, data);
  const { CAMPAIGNS, applyImpact, clampTriangle } = createRequire(import.meta.url)(dataPath);
  const logic = await compileTs(join(dir, "src", "logic.ts"), "logic1922");
  for (const [cid, camp] of Object.entries(CAMPAIGNS)) {
    const axesKeys = camp.triangleAxes.map((a) => a.key);
    const rules = { axes: axesKeys.map((key) => ({ key, min: -10, max: 10 })), impact: "stack", roll: { scale: 100, fallback: "last" }, routing: "nextIf-overrides" };
    const seen = new Set();
    const queue = [camp.start];
    while (queue.length) {
      const nid = queue.pop();
      if (!nid || seen.has(nid)) continue;
      seen.add(nid);
      let node;
      try {
        node = camp.resolveNode(nid, {}, camp.initialMeters);
      } catch {
        continue;
      }
      if (!node) continue;
      for (const choice of node.choices || []) {
        if (choice.next) queue.push(choice.next);
        for (const u of choice.uncertain || []) if (u.next) queue.push(u.next);
        for (const meters of meterSamples(axesKeys)) {
          for (const u of ROLLS) {
            const ref = logic.resolveChoice({ choice, meters, campaign: camp, hardModeEnabled: false, hardModeValue: 0, rand: () => u, helpers: { applyImpact, clampTriangle } });
            const got = engine.resolveChoice({ choice, meters, flags: {}, rules, rand: () => u });
            checked++;
            if (!eq(ref.meters, got.meters) || !eq({ ...ref.newFlags }, got.flags) || (ref.destination ?? null) !== (got.destination ?? null))
              fail(`1922 ${cid}/${nid} u=${u}: ref ${JSON.stringify([ref.meters, ref.destination])} vs engine ${JSON.stringify([got.meters, got.destination])}`);
          }
        }
      }
    }
  }
}

// ───────────────────────── 1941 and 1940: logic.ts resolveChoice + nextPosition ─────────────────────────
// 1940 keeps four running Matériel strand tallies in its flags (matOil, matAmmo, matSteel, matShip: where each
// choice's Matériel impact fell, for the readings under the meter). They are a 1940 addition to the shared rules, so
// they are set aside here and the rest of the flags must still match the engine exactly.
const TALLY_FLAGS = new Set(["matOil", "matAmmo", "matSteel", "matShip"]);
const withoutTallies = (flags) => Object.fromEntries(Object.entries(flags).filter(([k]) => !TALLY_FLAGS.has(k)));
for (const [game, modes, ceilings, endFlags, axes] of [
  [
    "Dispatches 1941",
    ["open", "fanatical", "coalition"],
    [
      { mode: "fanatical", flag: "suspicion", op: "gte", threshold: 5, unless: "purged", set: { purged: true, purgedAt: "suspicionCeiling" } },
      { mode: "coalition", flag: "cohesion", op: "lte", threshold: -6, unless: "relieved", set: { relieved: true } },
    ],
    [
      { mode: "fanatical", flag: "purged" },
      { mode: "coalition", flag: "relieved" },
    ],
    ["readiness", "pipeline", "initiative"],
  ],
  [
    "Dispatches 1940",
    ["open", "purge", "coalition", "axis"],
    [
      { mode: "purge", flag: "suspicion", op: "gte", threshold: 5, unless: "purged", set: { purged: true, purgedAt: "suspicionCeiling" } },
      { mode: "coalition", flag: "cohesion", op: "lte", threshold: -6, unless: "relieved", set: { relieved: true } },
      { mode: "axis", flag: "trust", op: "lte", threshold: -5, unless: "superseded", set: { superseded: true } },
    ],
    [
      { mode: "purge", flag: "purged" },
      { mode: "coalition", flag: "relieved" },
      { mode: "iron", flag: "dismissed" },
      { mode: "axis", flag: "superseded" },
    ],
    ["manpower", "fuel", "initiative"],
  ],
]) {
  const dir = G(game);
  const CAMPAIGNS = loadCampaigns(join(dir, "src", "App.jsx"));
  const logic = await compileTs(join(dir, "src", "logic.ts"), "logic-" + game.replace(/\D/g, ""));
  const rules = { axes: axes.map((key) => ({ key, min: -10, max: 10 })), impact: "replace", roll: { scale: "total", fallback: "first" }, routing: "roll-then-choice", ceilings, endFlags };
  for (const [cid, camp] of Object.entries(CAMPAIGNS)) {
    if (!camp.dynamic) continue;
    const seen = new Set();
    const queue = [camp.start];
    while (queue.length) {
      const nid = queue.pop();
      if (!nid || nid === "END" || seen.has(nid)) continue;
      seen.add(nid);
      let stage;
      try {
        stage = camp.resolveNode(nid, {}, Object.fromEntries(axes.map((k) => [k, 0])));
      } catch {
        continue;
      }
      if (!stage || !stage.choices) continue;
      stage.choices.forEach((choice, index) => {
        if (choice.next) queue.push(choice.next);
        for (const u of choice.uncertain || []) if (u.next) queue.push(u.next);
        for (const meters of meterSamples(axes)) {
          for (const u of ROLLS) {
            for (const mode of modes) {
              const flags = { suspicion: 4, cohesion: -5, trust: -4 };
              const ref = logic.resolveChoice({ stage, index, mode, favor: 5, defiance: 0, flags, meters, rand: () => u });
              if (!ref) continue;
              const refNext = logic.nextPosition({ dynamic: true, position: nid, choice, rollIndex: ref.rollIndex, mode, flags: ref.flags });
              const got = engine.resolveChoice({ choice, meters, flags, mode, rules, rand: () => u });
              const gotNext = engine.endsRun(mode, got.flags, rules.endFlags) ? "END" : got.destination;
              checked++;
              if (!eq(ref.meters, got.meters) || !eq(withoutTallies(ref.flags), got.flags) || ref.rollIndex !== got.rollIndex || (refNext.nextPos ?? null) !== (gotNext ?? null))
                fail(`${game} ${cid}/${nid}#${index} mode=${mode} u=${u}: ref ${JSON.stringify([ref.meters, refNext.nextPos])} vs engine ${JSON.stringify([got.meters, gotNext])}`);
            }
          }
        }
      });
    }
  }
}

if (failures) {
  console.error(`\nCAMPAIGN EQUIVALENCE FAILED: ${failures} mismatch(es) of ${checked} comparisons.`);
  process.exit(1);
}
console.log(`CAMPAIGN EQUIVALENCE OK: ${checked} comparisons across 1914, 1922, 1941, 1940 (engine == each game's own logic).`);
