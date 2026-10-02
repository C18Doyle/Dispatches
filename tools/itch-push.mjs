#!/usr/bin/env node
// Pushes a game's release zips to itch.io with butler. Used by .github/workflows/release.yml, or by hand:
//   BUTLER_API_KEY=... node tools/itch-push.mjs 1941 [version]
//   node tools/itch-push.mjs 1941 --dry-run          print the butler commands, push nothing
// Targets live in itch.json at the repo root: { "1941": { "target": "user/game-slug", "channels": { "full": "web-full", "demo": "web-demo" } } }
// (channel is chosen by the release variant name). A target of null or "REPLACE_ME/..." is skipped, so the
// release workflow never fails just because itch.io is not configured yet.
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const args = process.argv.slice(2);
const dry = args.includes("--dry-run");
const [game, versionArg] = args.filter((a) => !a.startsWith("--"));
if (!game) {
  console.error("usage: node tools/itch-push.mjs <game> [version] [--dry-run]");
  process.exit(2);
}
const cfg = JSON.parse(readFileSync(join(ROOT, "itch.json"), "utf8"))[game];
if (!cfg || !cfg.target || /REPLACE_ME/.test(cfg.target)) {
  console.log(`itch.io target for "${game}" is not set in itch.json: skipping the itch.io push.`);
  process.exit(0);
}
if (!dry && !process.env.BUTLER_API_KEY) {
  console.log("BUTLER_API_KEY is not set: skipping the itch.io push.");
  process.exit(0);
}
const gameDir = readdirSync(ROOT).find((d) => d.startsWith("Dispatches ") && d.toLowerCase().includes(game.toLowerCase()));
const relRoot = join(ROOT, gameDir, "releases");
const version = versionArg ?? readdirSync(relRoot).filter((v) => existsSync(join(relRoot, v, "RELEASE.json"))).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).at(-1);
const manifest = JSON.parse(readFileSync(join(relRoot, version, "RELEASE.json"), "utf8"));
let failed = 0;
for (const f of manifest.files) {
  const channel = cfg.channels?.[f.variant];
  if (!channel) {
    console.log(`no channel for variant "${f.variant}" in itch.json: not pushed`);
    continue;
  }
  const cmd = ["push", join(relRoot, version, f.zip), `${cfg.target}:${channel}`, "--userversion", version];
  console.log(`butler ${cmd.join(" ")}`);
  if (dry) continue;
  const r = spawnSync("butler", cmd, { stdio: "inherit" });
  if (r.status !== 0) failed++;
}
process.exit(failed ? 1 : 0);
