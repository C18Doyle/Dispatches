import * as esbuild from "esbuild";
import { resolve } from "node:path";

// `node esbuild.config.mjs --demo` writes dist/demo/bundle.js: the same game, stopped at the first scene of Act II (src/demo.ts).
// `node esbuild.config.mjs --seat=mina` writes dist/mina/bundle.js: the other seat (Mina's campaign), which is not part of the shipped game.
const demo = process.argv.includes("--demo");
const seat = (process.argv.find((a) => a.startsWith("--seat=")) ?? "--seat=dracula").slice(7);
const outfile = demo ? "dist/demo/bundle.js" : seat === "dracula" ? "dist/bundle.js" : `dist/${seat}/bundle.js`;

await esbuild.build({
  entryPoints: ["src/main.tsx"],
  bundle: true,
  outfile,
  minify: true,
  sourcemap: false,
  target: ["es2020"],
  format: "iife",
  alias: { "@seat": resolve("src/content", seat) },
  define: { "process.env.NODE_ENV": '"production"', __DEMO__: demo ? "true" : "false" },
  loader: { ".tsx": "tsx", ".ts": "ts" },
});

console.log(`esbuild: bundle (${seat}) written to ${outfile}`);
