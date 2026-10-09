#!/usr/bin/env node
// check-writing.mjs: enforces the one mechanical rule of docs/WRITING.md, no em dashes in on-screen text.
//
// Usage: node tools/check-writing.mjs "<game folder>" [--strict]
// Reads <game>/src (and src/parts), skipping the assembled App.jsx when parts exist. Comments, `attested:` quotation lines, a
// dash that stands alone as a placeholder and a dash that opens a line of text (a quotation's attribution) are not counted.
// Without --strict it only reports; with it, any dash fails the check.
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const strict = args.includes("--strict");
const game = args.find((a) => !a.startsWith("--"));
if (!game) {
  console.error('usage: node tools/check-writing.mjs "<game folder>" [--strict]');
  process.exit(2);
}
const src = path.join(game, "src");
if (!existsSync(src)) {
  console.error("no src folder in " + game);
  process.exit(2);
}
const hasParts = existsSync(path.join(src, "parts"));
const files = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name === "assets" || name === "node_modules") continue;
      walk(p);
    } else if (/\.(jsx?|tsx?|mjs)$/.test(name)) {
      if (hasParts && dir === src && name === "App.jsx") continue;
      files.push(p);
    }
  }
})(src);

const found = [];
for (const f of files) {
  readFileSync(f, "utf8")
    .split("\n")
    .forEach((line, i) => {
      if (!line.includes("—")) return;
      const t = line.trim();
      if (t.startsWith("//") || t.startsWith("*") || t.startsWith("/*") || /attested:/.test(line)) return;
      let code = line;
      const ci = line.lastIndexOf(" // ");
      if (ci > 0) {
        const prefix = line.slice(0, ci);
        if ((prefix.match(/"/g) || []).length % 2 === 0 && (prefix.match(/`/g) || []).length % 2 === 0) code = prefix;
      }
      for (const m of code.matchAll(/—/g)) {
        const before = m.index > 0 ? code[m.index - 1] : "";
        const after = m.index + 1 < code.length ? code[m.index + 1] : "";
        const lead = code.slice(0, m.index).trim();
        if (lead === "" || before === ">" || (/["'`(\[>]/.test(before) && /["'`)\]<{]/.test(after))) continue;
        found.push(`${f}:${i + 1}: ${t.slice(0, 120)}`);
        break;
      }
    });
}
if (found.length) {
  console.log(found.slice(0, 40).join("\n"));
  console.log(`\n${found.length} line(s) with an em dash in on-screen text (docs/WRITING.md, rule 1).`);
  if (strict) process.exit(1);
} else {
  console.log("Writing check: no em dashes in on-screen text.");
}
