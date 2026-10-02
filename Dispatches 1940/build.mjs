#!/usr/bin/env node
// Build script — reconstructed this session (like tools/extract_campaigns.js and
// src/main.jsx before it): referenced by a comment in src/App.jsx ("esbuild replaces the
// __DEMO_BUILD__ token at build time (see build.mjs `define`)") but not among the delivered
// V6 files, even though the three itch.io zips in builds/ are clearly its output. Diffing
// those zips shows there are really only TWO distinct build variants — "full" and "demo" —
// not three: dispatches-1940-itch.zip and dispatches-1940-UNLISTED-browser-full.zip are
// byte-identical (same bundle.js, index.html, output.css), just uploaded to two different
// itch.io listing slots. This script reproduces that: it builds "full" once and writes it to
// both of those zip names, plus a separate "demo" build.
//
// Usage: node build.mjs
//   Produces dist/<variant>/{index.html,bundle.js,output.css} and builds/*.zip for each.
// Usage: node build.mjs --dev
//   Also builds dist/dev/ — same as "full" but with Grand Campaign AND the Key Battle Subgame
//   prototype enabled (__GRAND_CAMPAIGN__ = true, __KEY_BATTLE_SUBGAME__ = true; see
//   GRAND_CAMPAIGN_ENABLED / KEY_BATTLE_SUBGAME_ENABLED in src/App.jsx). This is the prototype
//   build: it is NEVER zipped into builds/ and never touches the itch.io outputs — it exists
//   purely so in-progress features can be built and tested for real without ever being
//   reachable from the shipped itch full/demo builds. Plain `node build.mjs` (no flag) is
//   unaffected and remains exactly the itch release pipeline.

import { build } from "esbuild";
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, rmSync, existsSync, copyFileSync, readdirSync, cpSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(ROOT, "dist");
const BUILDS = path.join(ROOT, "builds");
const ASSETS = path.join(ROOT, "assets");
// Static assets copied verbatim into every build variant, alongside index.html/bundle.js/
// output.css. theme.mp3 used to live here, but it's now inlined into bundle.js as a base64
// data: URL (see the THEME_MUSIC_DATA_URL import in src/App.jsx and the ".mp3": "dataurl"
// esbuild loader below) so a standalone copy is no longer needed — shipping both would just be
// ~4MB of dead weight in every zip.
const STATIC_ASSETS = [];
// Directories (as opposed to single files) copied verbatim into every build variant's
// assets/ subpath. Currently just the Checkpoint Map's per-campaign, per-year placeholder
// art (see CheckpointMap in src/App.jsx, which loads `assets/maps/<campaignId>/<year>.png`
// relative to index.html).
const STATIC_ASSET_DIRS = ["maps"];

const HTML_META = {
  full: {
    title: "Dispatches 1940",
    description:
      "A historically-grounded WWII strategy game. Command the German OKW, Soviet STAVKA, or Western Allied SHAEF campaign.",
  },
  demo: {
    title: "Dispatches 1940 — Free Demo",
    description:
      "A historically-grounded WWII strategy game. Free demo: command the German OKW campaign. Soviet and Allied commands available in the full version.",
  },
  dev: {
    title: "Dispatches 1940 — DEV (Grand Campaign + Key Battle Subgame)",
    description: "Internal prototype build. Not for distribution.",
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
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Courier+Prime&family=IBM+Plex+Mono:wght@400;500;700&family=Caveat:wght@500;600&display=swap" rel="stylesheet" />
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

async function buildVariant(name, { isDemo = false, grandCampaign = false, keyBattleSubgame = false } = {}) {
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
      __DEMO_BUILD__: isDemo ? "true" : "false",
      __GRAND_CAMPAIGN__: grandCampaign ? "true" : "false",
      __KEY_BATTLE_SUBGAME__: keyBattleSubgame ? "true" : "false",
    },
    outfile: path.join(outDir, "bundle.js"),
    // .mp3 -> dataurl: inlines theme.mp3 as a base64 data: URL at build time instead of a
    // runtime fetch/external file (see THEME_MUSIC_DATA_URL in src/App.jsx). .json needs no
    // entry — esbuild bundles JSON imports as JS objects by default, no loader needed.
    loader: { ".mp3": "dataurl" },
    logLevel: "info",
  });

  // Run the CLI through node (not the .bin shim) so this works on Windows too.
  execFileSync(
    process.execPath,
    [path.join(ROOT, "node_modules/@tailwindcss/cli/dist/index.mjs"), "-i", path.join(ROOT, "src/tailwind.css"), "-o", path.join(outDir, "output.css"), "--minify"],
    { stdio: "inherit" }
  );

  writeFileSync(path.join(outDir, "index.html"), indexHtml(HTML_META[name]));

  for (const asset of STATIC_ASSETS) {
    const src = path.join(ASSETS, asset);
    if (existsSync(src)) copyFileSync(src, path.join(outDir, asset));
  }

  for (const dir of STATIC_ASSET_DIRS) {
    const src = path.join(ASSETS, dir);
    if (existsSync(src)) cpSync(src, path.join(outDir, "assets", dir), { recursive: true });
  }
}

function zipDir(dir, zipPath) {
  if (existsSync(zipPath)) rmSync(zipPath);
  // Top-level files are added with -j (junk the directory paths) so the zip contains
  // index.html/bundle.js/output.css (and any static assets) at its root — matching the
  // delivered builds/*.zip layout — rather than dist/<variant>/.... Asset directories (e.g.
  // assets/maps/) are added separately, cwd'd into `dir`, so their internal structure is
  // preserved (assets/maps/<campaign>/<year>.png), matching the relative paths the app
  // requests them at.
  const files = [path.join(dir, "index.html"), path.join(dir, "bundle.js"), path.join(dir, "output.css")];
  for (const asset of STATIC_ASSETS) {
    const assetPath = path.join(dir, asset);
    if (existsSync(assetPath)) files.push(assetPath);
  }
  execFileSync("zip", ["-j", "-q", zipPath, ...files]);

  const assetDirRoot = path.join(dir, "assets");
  if (existsSync(assetDirRoot)) {
    execFileSync("zip", ["-rq", zipPath, "assets"], { cwd: dir });
  }
}

async function main() {
  mkdirSync(BUILDS, { recursive: true });

  console.log("Building full variant...");
  await buildVariant("full", { isDemo: false, keyBattleSubgame: true });
  console.log("Building demo variant...");
  await buildVariant("demo", { isDemo: true, keyBattleSubgame: true });

  // Zipping needs the `zip` CLI. Pass --no-zip (or run where zip is missing, e.g. stock Windows) to
  // build dist/ only.
  if (process.argv.includes("--no-zip")) {
    console.log("--no-zip: skipping builds/*.zip");
  } else {
    zipDir(path.join(DIST, "full"), path.join(BUILDS, "dispatches-1940-itch.zip"));
    // Full build, re-zipped under the second itch.io listing's filename — see the note above
    // on why this isn't a third build.
    zipDir(path.join(DIST, "full"), path.join(BUILDS, "dispatches-1940-UNLISTED-browser-full.zip"));
    zipDir(path.join(DIST, "demo"), path.join(BUILDS, "dispatches-1940-demo-itch.zip"));
  }

  if (process.argv.includes("--dev")) {
    console.log("Building dev variant (Grand Campaign + Key Battle Subgame prototypes, not distributed)...");
    await buildVariant("dev", { isDemo: false, grandCampaign: true, keyBattleSubgame: true });
    console.log("Dev build in dist/dev/ — not zipped, not part of builds/.");
  }

  console.log("Done. Output in dist/ and builds/.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
