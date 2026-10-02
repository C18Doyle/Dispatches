/**
 * Enforces the architectural boundaries from CLAUDE.md with a source scan.
 *   npm run check:boundaries
 * 1. src/engine/** imports nothing outside src/engine (no react, no node:, no JSON, no DOM/UI).
 * 2. src/engine/** never touches DOM globals, storage, time or Math.random.
 * 3. UI files (src/**.tsx, excluding src/engine) never assign into engine state.
 * 4. Nothing outside src/engine reaches into engine internals except through src/engine/index.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

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

const engineFiles = walk("src/engine").filter((f) => f.endsWith(".ts"));
const DOM_GLOBALS = /\b(document|window|localStorage|sessionStorage|navigator|fetch|setTimeout|setInterval|requestAnimationFrame|Audio|alert)\b/;
for (const f of engineFiles) {
  const src = strip(readFileSync(f, "utf8"));
  for (const m of src.matchAll(/(?:import|export)[^'"]*?from\s+["']([^"']+)["']/g)) {
    const spec = m[1];
    if (!spec.startsWith("./")) fail(f, `imports "${spec}" — engine may only import sibling engine files`);
    if (spec.endsWith(".json")) fail(f, `imports JSON "${spec}" — content is passed in as a GameDefinition`);
  }
  if (DOM_GLOBALS.test(src)) fail(f, `uses a DOM/browser global (${src.match(DOM_GLOBALS)[0]})`);
  if (/Math\.random|Date\.now|new Date|performance\.now/.test(src)) fail(f, "uses randomness or time — take it as an argument instead");
  if (/\.tsx?["']/.test(src) && /from\s+["']\.\.\//.test(src)) fail(f, "reaches out of src/engine");
}

const uiFiles = walk("src").filter((f) => /\.tsx$/.test(f) && !f.startsWith(join("src", "engine")));
for (const f of uiFiles) {
  const src = strip(readFileSync(f, "utf8"));
  if (/\bstate\.[\w.\[\]]+\s*(=(?!=)|\+=|-=|\+\+|--)/.test(src)) fail(f, "assigns into engine state — dispatch an action instead");
  if (/\bstate\.[\w.]+\.(push|splice|pop|shift|unshift|sort|reverse)\(/.test(src)) fail(f, "mutates engine state arrays — dispatch an action instead");
}

for (const f of walk("src").filter((p) => /\.tsx?$/.test(p) && !p.startsWith(join("src", "engine")))) {
  const src = strip(readFileSync(f, "utf8"));
  for (const m of src.matchAll(/from\s+["']([^"']*engine\/[^"']+)["']/g)) {
    if (!m[1].endsWith("engine/index")) fail(f, `imports engine internals "${m[1]}" — use "./engine/index"`);
  }
}

if (failures) {
  console.error(`\nBOUNDARY CHECK FAILED: ${failures} violation(s).`);
  process.exit(1);
}
console.log(`BOUNDARIES OK: ${engineFiles.length} engine files, ${uiFiles.length} UI files scanned.`);
