#!/usr/bin/env node
// Build script, modelled on Dispatches 1940's build.mjs. Writes dist/<variant>/ for two
// variants: "full" and "demo". The source file reads the literal expression
// `process.env.DEMO_BUILD`, which esbuild replaces with true/false via `define`.
//
// Usage: node build.mjs            (both variants)
//        node build.mjs full       (one variant)
import { build } from "esbuild";
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, copyFileSync, cpSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(ROOT, "dist");

const HTML_META = {
  full: {
    title: "Dispatches 1941",
    description: "A historically-grounded Pacific war strategy game. Command Japan's IGHQ or the Allied CINCPAC.",
  },
  demo: {
    title: "Dispatches 1941: Free Demo",
    description: "Free demo of Dispatches 1941: the first decisions of Japan's IGHQ campaign.",
  },
};

function indexHtml(meta) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${meta.title}</title>
<meta name="description" content="${meta.description}" />
<link rel="stylesheet" href="output.css" />
<style>
  html, body { margin: 0; padding: 0; background: #000; }
  #root { min-height: 100vh; }
</style>
</head>
<body>
<div id="root"></div>
<script src="bundle.js"></script>
</body>
</html>
`;
}

// src/parts/ is the editing surface; src/App.jsx is the artifact. Assemble before building so an edit
// to a part cannot be left out of the bundle, and refuse if the artifact was edited by hand instead.
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

async function buildVariant(name, isDemo) {
  const outDir = path.join(DIST, name);
  mkdirSync(outDir, { recursive: true });

  await build({
    entryPoints: [path.join(ROOT, "src/main.jsx")],
    bundle: true,
    minify: true,
    format: "iife",
    target: "es2020",
    jsx: "automatic",
    jsxImportSource: "react",
    define: {
      "process.env.DEMO_BUILD": isDemo ? "true" : "false",
      "process.env.NODE_ENV": '"production"',
    },
    outfile: path.join(outDir, "bundle.js"),
    logLevel: "info",
  });

  const tailwindBin = path.join(ROOT, "node_modules/@tailwindcss/cli/dist/index.mjs");
  execFileSync(process.execPath, [tailwindBin, "-i", path.join(ROOT, "src/tailwind.css"), "-o", path.join(outDir, "output.css"), "--minify"], {
    stdio: "inherit",
  });

  writeFileSync(path.join(outDir, "index.html"), indexHtml(HTML_META[name]));

  // Runtime-fetched assets: the map geometry JSON and the music track.
  cpSync(path.join(ROOT, "assets"), path.join(outDir, "assets"), { recursive: true });
  if (existsSync(path.join(ROOT, "audio"))) cpSync(path.join(ROOT, "audio"), path.join(outDir, "audio"), { recursive: true });
  console.log(`built dist/${name}`);
}

const only = process.argv[2];
if (!only || only === "full") await buildVariant("full", false);
if (!only || only === "demo") await buildVariant("demo", true);
