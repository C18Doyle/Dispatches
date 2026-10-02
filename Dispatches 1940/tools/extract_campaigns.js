#!/usr/bin/env node
/*
 * extract_campaigns.js
 *
 * check-reachability.js needs to `require()` the CAMPAIGNS object from the game source, but
 * the source file is JSX and can't be required directly by plain Node, and CAMPAIGNS' own
 * node getters call plain-JS helper functions (modWeight, clamp, formatDateForCampaign, etc.)
 * that are declared elsewhere at module scope. So this doesn't slice out just the CAMPAIGNS
 * block — it transpiles the WHOLE source file with esbuild (stripping JSX only, leaving
 * everything else untouched) so every top-level const/function CAMPAIGNS depends on is still
 * in scope, stubs out the two things the file imports (react, tone) since nothing at
 * module-evaluation time actually needs a working audio engine or a real React runtime, runs
 * the result, and exports whatever the module scope ends up calling CAMPAIGNS.
 *
 * Usage: node extract_campaigns.js [path/to/App.jsx] [path/to/campaigns_extracted.js]
 * Run this before check-reachability.js, which requires ./campaigns_extracted.js by default.
 */
const fs = require("fs");
const path = require("path");
const Module = require("module");
const esbuild = require("esbuild");

const SRC = process.argv[2] || "../src/App.jsx";
const OUT = process.argv[3] || path.join(__dirname, "campaigns_extracted.js");

const src = fs.readFileSync(SRC, "utf8");

if (!src.includes("const CAMPAIGNS = {")) {
  console.error("Could not find 'const CAMPAIGNS = {' in " + SRC);
  process.exit(2);
}

// Strip the two import lines (react, tone) — we stub both instead of installing them, since
// nothing CAMPAIGNS touches at module-eval time needs a working implementation of either.
const stripped = src.replace(/^import\s.*$/gm, "");

const { code } = esbuild.transformSync(stripped, {
  loader: "jsx",
  jsx: "transform",
  jsxFactory: "React.createElement",
  jsxFragment: "React.Fragment",
  format: "cjs",
  target: "node18",
});

const wrapped =
  `class StubComponent {};\n` +
  `const React = { createElement: () => null, Fragment: Symbol("Fragment"), useState: () => [undefined, () => {}], useEffect: () => {}, useMemo: (fn) => fn(), useRef: () => ({ current: undefined }), Component: StubComponent };\n` +
  `const useState = React.useState, useEffect = React.useEffect, useMemo = React.useMemo, useRef = React.useRef, Component = StubComponent;\n` +
  `const Tone = new Proxy({}, { get: () => new Proxy(function () {}, { get: () => () => ({}), apply: () => ({}) }) });\n` +
  code +
  `\nmodule.exports = { CAMPAIGNS: typeof CAMPAIGNS !== "undefined" ? CAMPAIGNS : undefined };\n`;

const tmpPath = OUT + ".checktmp.js";
fs.writeFileSync(tmpPath, wrapped);

try {
  delete require.cache[require.resolve(path.resolve(tmpPath))];
  const mod = require(path.resolve(tmpPath));
  const CAMPAIGNS = mod.CAMPAIGNS;
  if (!CAMPAIGNS) {
    console.error("Transpiled module evaluated but CAMPAIGNS was not defined at module scope.");
    process.exit(2);
  }
  const missing = ["german", "soviet", "allied", "italy"].filter((k) => !CAMPAIGNS[k]);
  if (missing.length) {
    console.error("Extracted CAMPAIGNS is missing campaign(s): " + missing.join(", "));
    process.exit(2);
  }

  // Smoke-test: resolve the start node of each campaign so a broken reference (like a helper
  // function that only exists inside a React component, not at module scope) fails loudly
  // here instead of silently inflating check-reachability.js's simulation-error count.
  for (const key of ["german", "soviet", "allied", "italy"]) {
    const c = CAMPAIGNS[key];
    const node = c.resolveNode(c.start, {}, { manpower: 0, fuel: 0, initiative: 0 });
    if (!node || !node.choices || !node.choices.length) {
      throw new Error(`${key}: start node "${c.start}" did not resolve to a node with choices`);
    }
  }

  // The transpiled module already works and exports { CAMPAIGNS }; just point
  // campaigns_extracted.js at that same code with module.exports narrowed to CAMPAIGNS itself,
  // since that's the shape check-reachability.js expects.
  fs.copyFileSync(tmpPath, OUT);
  fs.appendFileSync(OUT, "\nmodule.exports = module.exports.CAMPAIGNS;\n");
  fs.unlinkSync(tmpPath);
  console.log(`Wrote ${OUT} (campaigns: ${Object.keys(CAMPAIGNS).join(", ")})`);
} catch (e) {
  console.error("Failed to build a working CAMPAIGNS module: " + e.stack);
  process.exit(2);
}
