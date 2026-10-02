#!/usr/bin/env node
// Runs every game's tests from the repo root.
//   node tools/run-all.mjs --fast          each game's `test:fast` (minutes) + the engine equivalence test
//   node tools/run-all.mjs --slow          each game's `test:slow` (long behaviour baselines), where defined
//   node tools/run-all.mjs --install       npm ci (or install) in every game folder
//   node tools/run-all.mjs --fast "1941"   only games whose folder name contains the text
// Prints one line per step and a table at the end; exits 1 if anything failed. Games keep running after a failure.
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const args = process.argv.slice(2);
const mode = args.find((a) => a.startsWith("--")) ?? "--fast";
const filter = args.find((a) => !a.startsWith("--"));
const GAMES = ["Dispatches Frankenstein", "Dispatches 1914", "Dispatches 1922", "Dispatches 1941", "Dispatches 1940"].filter((g) => !filter || g.includes(filter));

const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const rows = [];

function run(label, cmd, cmdArgs, cwd) {
  const t0 = Date.now();
  process.stdout.write(`\n>>> ${label}\n`);
  const r = spawnSync(cmd, cmdArgs, { cwd, stdio: "inherit", shell: process.platform === "win32" && cmd.endsWith(".cmd") });
  const secs = ((Date.now() - t0) / 1000).toFixed(0);
  rows.push({ label, ok: r.status === 0, secs });
}

if (mode === "--install") {
  for (const g of GAMES) run(`${g}: install`, npm, [existsSync(join(ROOT, g, "package-lock.json")) ? "ci" : "install", "--no-audit", "--no-fund"], join(ROOT, g));
} else {
  const script = mode === "--slow" ? "test:slow" : "test:fast";
  for (const g of GAMES) {
    const pkg = JSON.parse(readFileSync(join(ROOT, g, "package.json"), "utf8"));
    if (!pkg.scripts?.[script]) {
      rows.push({ label: `${g}: ${script}`, ok: true, secs: "-", skipped: true });
      continue;
    }
    run(`${g}: ${script}`, npm, ["run", script], join(ROOT, g));
  }
  if (mode !== "--slow" && !filter) run("engine: campaign equivalence", process.execPath, [join(ROOT, "packages", "engine", "tests", "campaign-equivalence.test.mjs")], ROOT);
}

console.log("\n──────── summary ────────");
for (const r of rows) console.log(`${r.skipped ? "skip" : r.ok ? " ok " : "FAIL"}  ${String(r.secs).padStart(4)}s  ${r.label}`);
process.exit(rows.some((r) => !r.ok) ? 1 : 0);
