import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["src/main.tsx"],
  bundle: true,
  outfile: "dist/bundle.js",
  minify: true,
  sourcemap: false,
  target: ["es2020"],
  format: "iife",
  define: { "process.env.NODE_ENV": '"production"' },
  loader: { ".tsx": "tsx", ".ts": "ts" },
});

console.log("esbuild: bundle written to dist/bundle.js");
