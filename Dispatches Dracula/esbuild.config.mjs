import * as esbuild from "esbuild";

// `node esbuild.config.mjs --demo` writes dist/demo/bundle.js: the same game, stopped at the first scene of Act II (src/demo.ts).
// `node esbuild.config.mjs --seat=mina` writes dist/mina/bundle.js: the same game, but a fresh browser starts on Mina's seat (both seats are in every bundle; src/seats.ts).
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
  define: { "process.env.NODE_ENV": '"production"', __DEMO__: demo ? "true" : "false", __SEAT__: JSON.stringify(seat) },
  loader: { ".tsx": "tsx", ".ts": "ts" },
});

console.log(`esbuild: bundle (${seat}) written to ${outfile}`);
