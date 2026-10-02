import * as esbuild from "esbuild";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const DEMO_BUILD = process.env.DEMO_BUILD === "true";
const GAME = "dispatches-greatwar.jsx";

// src/ is the editing surface; the single file is the artifact. Assemble before
// building so a src/ edit cannot be silently left out of the bundle.
//
// Guard: if the single file is NEWER than everything in src/, somebody edited the
// artifact directly and assembling would destroy that work. Stop instead.
if (fs.existsSync("src/MANIFEST.json")) {
  const gameTime = fs.statSync(GAME).mtimeMs;
  const srcTime = Math.max(...fs.readdirSync("src").map((f) => fs.statSync(path.join("src", f)).mtimeMs));
  const manifest = JSON.parse(fs.readFileSync("src/MANIFEST.json", "utf8"));
  const assembled = manifest.map((f) => fs.readFileSync(path.join("src", f), "utf8")).join(String.fromCharCode(10));
  // Hand-edited only if the artifact differs from what src/ assembles to AND is newer than src/.
  if (fs.readFileSync(GAME, "utf8") !== assembled && gameTime > srcTime) {
    console.error(`${GAME} is newer than src/. Either run "node split.mjs" to bring src/ up to date, or revert the direct edit. Not assembling.`);
    process.exit(1);
  }
  execSync("node assemble.mjs", { stdio: "inherit" });
}
// The typeof process guard must NEVER wrap a define-substituted build flag.
const common = { entryPoints: ["entry.jsx"], bundle: true, format: "iife",
  jsx: "automatic", define: { DEMO_BUILD: JSON.stringify(DEMO_BUILD) } };
// Both artifacts are built every time. A stale unminified bundle once made the
// render test pass against content that had already been deleted.
await esbuild.build({ ...common, outfile: "dist/bundle.js", minify: false });
await esbuild.build({ ...common, outfile: "dist/bundle.min.js", minify: true });
const js = fs.readFileSync("dist/bundle.min.js", "utf8");
fs.writeFileSync("dist/index.html",
`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Dispatches 1918</title>
<style>html,body{margin:0;padding:0;background:#f4efe2;min-height:100%}#root{max-width:760px;margin:0 auto}</style>
</head><body><div id="root"></div><script>${js}</script></body></html>`);
console.log(`built dist/index.html (DEMO_BUILD=${DEMO_BUILD})`);
