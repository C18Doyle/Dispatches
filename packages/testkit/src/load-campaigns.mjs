// Evaluates a game's CAMPAIGNS in Node: transpile the whole JSX with stubs for react/tone/assets (the
// way the games' own extractors do), or, for 1922, evaluate only the data section above the marker.
import { readFileSync } from "node:fs";
import vm from "node:vm";

/** `esbuild` is passed in so this file needs no dependencies of its own. */
export function loadCampaignsFromJsx(esbuild, appPath) {
  return loadFromJsx(esbuild, appPath, []).CAMPAIGNS;
}

/** Like loadCampaignsFromJsx, but also returns the named top-level constants (undefined when a game has none), e.g. ["NODE_ATLAS", "NODE_TOTAL"]. */
export function loadFromJsx(esbuild, appPath, names = []) {
  const src = readFileSync(appPath, "utf8").replace(/^import[\s\S]*?from\s+["'][^"']+["'];?[ \t]*$/gm, "").replace(/^import\s+["'][^"']+["'];?[ \t]*$/gm, "");
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
  const extra = names.map((n) => `, ${n}: typeof ${n} === "undefined" ? undefined : ${n}`).join("");
  vm.runInNewContext(prelude + code + `\nmodule.exports = { CAMPAIGNS${extra} };\n`, sandbox, { filename: appPath });
  return sandbox.module.exports;
}

/** 1922: the data section (above "// PREVIEW SCREENS") is plain JS once `export` is stripped. */
export function loadCampaignsFromDataSection(appPath) {
  const src = readFileSync(appPath, "utf8").split("// PREVIEW SCREENS")[0].replace(/^export /gm, "") + "\nmodule.exports = { CAMPAIGNS };\n";
  const sandbox = { module: { exports: {} }, console, process: { env: {} } };
  sandbox.exports = sandbox.module.exports;
  vm.runInNewContext(src, sandbox, { filename: appPath });
  return sandbox.module.exports.CAMPAIGNS;
}
