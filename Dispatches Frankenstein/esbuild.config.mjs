import * as esbuild from "esbuild";

// `node esbuild.config.mjs --demo` writes dist/demo/bundle.js: the same game, stopped at each track's last choice (src/demo.ts).
const demo = process.argv.includes("--demo");
const outfile = demo ? "dist/demo/bundle.js" : "dist/bundle.js";

await esbuild.build({
  entryPoints: ["src/main.tsx"],
  bundle: true,
  outfile,
  minify: true,
  sourcemap: false,
  target: ["es2020"],
  format: "iife",
  define: { "process.env.NODE_ENV": '"production"', __DEMO__: demo ? "true" : "false" },
  loader: { ".tsx": "tsx", ".ts": "ts" },
});

console.log(`esbuild: bundle written to ${outfile}`);
