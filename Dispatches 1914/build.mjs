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
`<!DOCTYPE html><html lang="en" data-theme="sepia"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23f4efe2'/%3E%3Crect x='6' y='6' width='52' height='52' fill='none' stroke='%231c1a17' stroke-width='3'/%3E%3Ctext x='32' y='42' text-anchor='middle' font-family='Georgia,serif' font-weight='700' font-size='26' fill='%237a2e2e'%3E14%3C/text%3E%3C/svg%3E">
<title>Dispatches 1914</title>
<meta name="theme-color" content="#0a0908">
<style>html,body{margin:0;padding:0;background:#d8cfb6;background-image:radial-gradient(ellipse at 50% 0,#e6dec9,#d2c8ad 70%);min-height:100%}#root{max-width:600px;margin:0 auto;overflow-x:hidden;min-height:100vh;background:#f4efe2;box-shadow:0 0 0 1px rgba(28,26,23,.14),0 12px 44px rgba(28,26,23,.22)}
html[data-theme="sepia"],html[data-theme="sepia"] body{background:#060504;background-image:none}html[data-theme="sepia"] #root{background:#0a0908;box-shadow:0 0 0 1px rgba(236,229,208,.1),0 12px 44px rgba(0,0,0,.7)}
html[data-theme="paper"],html[data-theme="paper"] body{background:#d8cfb6;background-image:radial-gradient(ellipse at 50% 0,#e6dec9,#d2c8ad 70%)}html[data-theme="paper"] #root{background:#f4efe2;box-shadow:0 0 0 1px rgba(28,26,23,.14),0 12px 44px rgba(28,26,23,.22)}
html[data-theme="night"],html[data-theme="night"] body{background:#0e0c09;background-image:none}html[data-theme="night"] #root{background:#1b1814;box-shadow:0 0 0 1px rgba(255,255,255,.08),0 12px 44px rgba(0,0,0,.6)}
html[data-theme="contrast"],html[data-theme="contrast"] body{background:#fff;background-image:none}html[data-theme="contrast"] #root{background:#fff;box-shadow:none}</style>
<script>try{var s=JSON.parse(localStorage.getItem("dispatches1914_settings_v1")||"{}"),t=s.theme,m=function(q){return window.matchMedia&&matchMedia(q).matches};if(t==="auto")t=m("(prefers-contrast: more)")?"contrast":m("(prefers-color-scheme: dark)")?"night":"paper";if(t==="paper"||t==="night"||t==="contrast"||t==="sepia")document.documentElement.setAttribute("data-theme",t)}catch(e){}</script>
</head><body><div id="root"></div><script>${js}</script></body></html>`);
console.log(`built dist/index.html (DEMO_BUILD=${DEMO_BUILD})`);
