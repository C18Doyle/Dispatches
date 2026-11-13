// Compiles each theme against the real stylesheet: node art/themes/build.mjs (from the game folder). Writes art/themes/css/<id>.css.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { THEMES } from "./themes.mjs";

const BACKSLASH = String.fromCharCode(92);
const root = process.cwd().split(BACKSLASH).join("/");
mkdirSync("art/themes/css", { recursive: true });
mkdirSync("art/themes/_tmp", { recursive: true });
const base = readFileSync("src/index.css", "utf8");
for (const [id, t] of Object.entries(THEMES)) {
  writeFileSync(`art/themes/_tmp/${id}.in.css`, base + "\n" + t.css);
  writeFileSync(
    `art/themes/_tmp/${id}.tailwind.cjs`,
    `module.exports = { content: [${JSON.stringify(root + "/src/**/*.{ts,tsx,html}")}], theme: { extend: { colors: ${JSON.stringify(t.colors)}, fontFamily: ${JSON.stringify(t.fonts)} } }, plugins: [] };\n`,
  );
  const r = spawnSync("npx", ["tailwindcss", "-c", `art/themes/_tmp/${id}.tailwind.cjs`, "-i", `art/themes/_tmp/${id}.in.css`, "-o", `art/themes/css/${id}.css`, "--minify"], { stdio: "inherit", shell: true });
  if (r.status !== 0) process.exit(1);
  const css = readFileSync(`art/themes/css/${id}.css`, "utf8");
  writeFileSync(`art/themes/css/${id}.css`, `@import url("${t.fontUrl}");\n` + css);
  console.log("built", id);
}
