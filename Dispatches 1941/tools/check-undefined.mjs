// check-undefined.mjs
//
// App.jsx is assembled from parts that share one scope, and nothing at build time says a name used in one part is declared in another: a
// missing import or a mistyped registry name is a ReferenceError only when that screen is reached (a battle's, say). This type-checks the
// assembled file as plain JavaScript and fails on any "Cannot find name" (TS2304 / TS2552). Every other diagnostic is ignored: the file
// is not typed, and most of them are about that.
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = [
  "tsc", "--ignoreConfig", "--noEmit", "--allowJs", "--checkJs", "--jsx", "preserve", "--skipLibCheck",
  "--target", "es2022", "--module", "esnext", "--moduleResolution", "bundler", "--types", "", "--lib", "es2022,dom,dom.iterable",
  "src/App.jsx",
];
const run = spawnSync("npx", args, { cwd: root, encoding: "utf8", shell: true, env: { ...process.env, NODE_NO_WARNINGS: "1" }, maxBuffer: 64 * 1024 * 1024 });
if (run.error) {
  console.error("could not run tsc: " + run.error.message);
  process.exit(2);
}
const out = (run.stdout || "") + (run.stderr || "");
if (!/error TS\d+/.test(out) && run.status !== 0) {
  console.error(out.slice(0, 2000));
  process.exit(2);
}
const missing = out.split("\n").filter((l) => /error TS(2304|2552):/.test(l));
if (missing.length) {
  console.log(`!! ${missing.length} name(s) used but never declared in src/App.jsx:`);
  for (const l of missing.slice(0, 40)) console.log("   " + l.slice(0, 200));
  process.exit(1);
}
console.log("check-undefined: every name used in src/App.jsx is declared.");
