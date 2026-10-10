#!/usr/bin/env node
// Checks itch.json: every push is "user/page:channel" (or still REPLACE_ME), nothing is pushed to the same page and channel twice, every variant a game's
// release builds is either pushed somewhere or listed as deliberately unpushed, and every variant itch.json names exists in the game's release config.
//   node tools/check-itch-config.mjs
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { PUSH_FORMAT, pushesFor, variantsOf } from "./lib/itch-config.mjs";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const itch = JSON.parse(readFileSync(join(ROOT, "itch.json"), "utf8"));
let failures = 0;
const fail = (m) => {
  failures++;
  console.error("FAIL: " + m);
};

for (const [game, cfg] of Object.entries(itch)) {
  if (game.startsWith("_")) continue;
  const dir = readdirSync(ROOT).find((d) => d.startsWith("Dispatches ") && d.toLowerCase().includes(game.toLowerCase()));
  if (!dir) {
    fail(`${game}: no game folder`);
    continue;
  }
  const pkgPath = join(ROOT, dir, "package.json");
  const built = existsSync(pkgPath) ? (JSON.parse(readFileSync(pkgPath, "utf8")).release?.variants ?? []).map((v) => v.name) : [];
  const named = variantsOf(cfg);
  for (const v of named) if (!built.includes(v)) fail(`${game}: itch.json names variant "${v}" but ${dir}/package.json release.variants has ${built.join(", ") || "none"}`);
  const unpushed = cfg.unpushed ?? [];
  for (const v of built) if (!named.includes(v) && !unpushed.includes(v)) fail(`${game}: the release builds "${v}" but itch.json neither pushes it nor lists it under "unpushed"`);
  const seen = new Set();
  for (const v of named) {
    const all = cfg.pushes ? (cfg.pushes[v] ?? []) : pushesFor(cfg, v).length ? pushesFor(cfg, v) : [];
    for (const p of all) {
      if (/REPLACE_ME/.test(p)) continue;
      if (!PUSH_FORMAT.test(p)) fail(`${game}/${v}: "${p}" is not user/page:channel`);
      if (seen.has(p)) fail(`${game}: "${p}" is pushed twice`);
      seen.add(p);
    }
  }
  const lines = named.map((v) => `${v} -> ${pushesFor(cfg, v).join(", ") || "(not set up)"}`);
  console.log(`${game}: ${lines.join("; ")}${unpushed.length ? `; unpushed: ${unpushed.join(", ")}` : ""}`);
}
if (failures) process.exit(1);
console.log("itch.json looks right.");
