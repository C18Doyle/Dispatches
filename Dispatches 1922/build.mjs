#!/usr/bin/env node
// Builds Dispatches 1922 into dist/:
//   dist/bundle.js    the minified app bundle (iife)
//   dist/output.css   Tailwind output
//   dist/index.html   the single playable file (prelude + css + root + bundle), what ships to itch.io
// Usage: node build.mjs
import { build } from "esbuild";
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.dirname(fileURLToPath(import.meta.url));

// src/parts/ is the editing surface; src/App.jsx is the artifact (validators read it). Assemble before
// building so an edit to a part cannot be left out of the bundle, and refuse if the artifact was
// edited by hand instead.
{
  const splitCli = path.join(ROOT, "..", "packages", "testkit", "src", "split.mjs");
  const run = (cmd) => execFileSync(process.execPath, [splitCli, cmd], { cwd: ROOT, stdio: "inherit" });
  try {
    run("check");
  } catch {
    process.exit(1);
  }
  run("assemble");
}
const DIST = path.join(ROOT, "dist");
mkdirSync(DIST, { recursive: true });

await build({
  entryPoints: [path.join(ROOT, "src/main.jsx")],
  bundle: true,
  minify: true,
  format: "iife",
  platform: "browser",
  target: "es2020",
  jsx: "automatic",
  define: { "process.env.NODE_ENV": '"production"' },
  outfile: path.join(DIST, "bundle.js"),
  logLevel: "info",
});

execFileSync(
  process.execPath,
  [path.join(ROOT, "node_modules/tailwindcss/lib/cli.js"), "-i", path.join(ROOT, "src/input.css"), "-o", path.join(DIST, "output.css"), "--minify"],
  { stdio: "inherit", cwd: ROOT }
);

const prelude = readFileSync(path.join(ROOT, "src/prelude.html"), "utf8");
const css = readFileSync(path.join(DIST, "output.css"), "utf8");
const js = readFileSync(path.join(DIST, "bundle.js"), "utf8");
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">\n${prelude}\n<style>${css}</style></head><body><div id="root"></div><script>${js.replace(/<\/script/gi, "<\\/script")}</script></body></html>\n`;
writeFileSync(path.join(DIST, "index.html"), html);
console.log(`built dist/index.html (${(html.length / 1024).toFixed(0)} KB)`);
