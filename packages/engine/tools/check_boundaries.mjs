/**
 * Enforces the architectural boundaries from CLAUDE.md with a source scan.
 * Run from a game folder:   node ../packages/engine/tools/check_boundaries.mjs
 *   argv[2] engine src dir  (default ../packages/engine/src)
 *   argv[3] game src dir    (default src)
 * 1. The engine imports nothing but its own sibling files (no react, node:, JSON, DOM/UI).
 * 2. The engine never touches DOM globals, storage, timers, time or Math.random.
 * 3. Game UI files (*.tsx) never assign into engine state.
 * 4. Game code reaches the engine only through "@dispatches/engine", never deep paths or relative paths.
 */
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

const engineDir = process.argv[2] ?? "../packages/engine/src";
const gameDir = process.argv[3] ?? "src";
if (!existsSync(engineDir)) {
  console.error(`engine dir not found: ${engineDir} (run from a game folder)`);
  process.exit(1);
}

const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
const strip = (src) => src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");

let failures = 0;
const fail = (file, msg) => {
  failures++;
  console.error(`FAIL: ${relative(".", file)}: ${msg}`);
};

const engineFiles = walk(engineDir).filter((f) => f.endsWith(".ts"));
const DOM_GLOBALS = /\b(document|window|localStorage|sessionStorage|navigator|fetch|setTimeout|setInterval|requestAnimationFrame|Audio|alert)\b/;
for (const f of engineFiles) {
  const src = strip(readFileSync(f, "utf8"));
  for (const m of src.matchAll(/(?:import|export)[^'"]*?from\s+["']([^"']+)["']/g)) {
    const spec = m[1];
    if (!spec.startsWith("./")) fail(f, `imports "${spec}" — the engine may only import sibling engine files`);
    if (spec.endsWith(".json")) fail(f, `imports JSON "${spec}" — content is passed in as a GameDefinition`);
  }
  if (DOM_GLOBALS.test(src)) fail(f, `uses a DOM/browser global (${src.match(DOM_GLOBALS)[0]})`);
  if (/Math\.random|Date\.now|new Date|performance\.now/.test(src)) fail(f, "uses randomness or time — take it as an argument instead");
}

const gameFiles = walk(gameDir).filter((p) => /\.tsx?$/.test(p));
const uiFiles = gameFiles.filter((f) => f.endsWith(".tsx"));
for (const f of uiFiles) {
  const src = strip(readFileSync(f, "utf8"));
  if (/\bstate\.[\w.\[\]]+\s*(=(?!=)|\+=|-=|\+\+|--)/.test(src)) fail(f, "assigns into engine state — dispatch an action instead");
  if (/\bstate\.[\w.]+\.(push|splice|pop|shift|unshift|sort|reverse)\(/.test(src)) fail(f, "mutates engine state arrays — dispatch an action instead");
}
for (const f of gameFiles) {
  const src = strip(readFileSync(f, "utf8"));
  for (const m of src.matchAll(/from\s+["']([^"']+)["']/g)) {
    const spec = m[1];
    if (/packages\/engine|\/engine\/(src|index)|^\.\.?\/engine/.test(spec)) fail(f, `imports the engine by path "${spec}" — use "@dispatches/engine"`);
    if (spec.startsWith("@dispatches/engine/")) fail(f, `deep import "${spec}" — use "@dispatches/engine"`);
  }
}

if (failures) {
  console.error(`\nBOUNDARY CHECK FAILED: ${failures} violation(s).`);
  process.exit(1);
}
console.log(`BOUNDARIES OK: ${engineFiles.length} engine files, ${uiFiles.length} UI files scanned.`);
