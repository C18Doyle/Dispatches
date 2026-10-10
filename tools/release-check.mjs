#!/usr/bin/env node
// Is this game ready to be released as its package.json version?   node tools/release-check.mjs <game> [--notes]
//   - package.json "version" is plain semver (1.2.3), with no -src / -dev leftovers (a pre-release such as 1.2.3-rc.1 is
//     allowed only with --allow-prerelease, which the release rehearsal uses)
//   - the game's CHANGELOG.md has a "## <version>" heading (the release notes are that section)
//   - warns when the "## Unreleased" section still has entries (they belong under the version being released)
//   - tells you whether itch.json has a target for the game (informational: an unset target only skips the itch.io push)
// With --notes it prints the changelog section for that version to stdout (used for the GitHub release body).
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { isSetUp, pagesOf } from "./lib/itch-config.mjs";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const args = process.argv.slice(2);
const game = args.find((a) => !a.startsWith("--"));
if (!game) {
  console.error("usage: node tools/release-check.mjs <game, e.g. 1941> [--notes] [--allow-prerelease]");
  process.exit(2);
}
const dir = readdirSync(ROOT).find((d) => d.startsWith("Dispatches ") && d.toLowerCase().includes(game.toLowerCase()));
if (!dir) {
  console.error(`no game folder matching "${game}"`);
  process.exit(2);
}
const version = JSON.parse(readFileSync(join(ROOT, dir, "package.json"), "utf8")).version;
const changelog = readFileSync(join(ROOT, dir, "CHANGELOG.md"), "utf8").replace(/\r\n/g, "\n");

/** The text under "## <heading starting with title>" up to the next "## ". */
function section(titleStart) {
  const lines = changelog.split("\n");
  const i = lines.findIndex((l) => l.startsWith("## ") && l.slice(3).trim().startsWith(titleStart));
  if (i < 0) return null;
  let j = i + 1;
  while (j < lines.length && !lines[j].startsWith("## ")) j++;
  return lines.slice(i + 1, j).join("\n").trim();
}

if (args.includes("--notes")) {
  const body = section(version);
  if (body === null) {
    console.error(`${dir}/CHANGELOG.md has no "## ${version}" section`);
    process.exit(1);
  }
  console.log(`# ${dir} ${version}\n\n${body}\n`);
  process.exit(0);
}

const problems = [];
const allowPre = args.includes("--allow-prerelease");
const plain = /^\d+\.\d+\.\d+$/.test(version);
const pre = /^\d+\.\d+\.\d+-[0-9A-Za-z.]+$/.test(version);
if (!plain && !(allowPre && pre)) problems.push(`package.json version "${version}" is not plain semver (1.2.3). Remove -src/-dev, or bump it for this release`);
if (section(version) === null) problems.push(`CHANGELOG.md has no "## ${version}" heading: rename "## Unreleased" to it (and add the date)`);
const unreleased = section("Unreleased");
const unreleasedEntries = unreleased ? unreleased.split("\n").filter((l) => l.startsWith("- ")).length : 0;
if (unreleasedEntries) console.log(`warning: "## Unreleased" still has ${unreleasedEntries} entr${unreleasedEntries === 1 ? "y" : "ies"}; if they ship in this release they belong under "## ${version}"`);
const itch = existsSync(join(ROOT, "itch.json")) ? JSON.parse(readFileSync(join(ROOT, "itch.json"), "utf8"))[game.toLowerCase()] : null;
console.log(isSetUp(itch) ? `itch.io pages: ${pagesOf(itch).join(", ")}` : "note: no itch.io page set in itch.json for this game (the itch.io push will be skipped)");

for (const p of problems) console.error("FAIL: " + p);
console.log(problems.length ? `${dir} ${version}: not ready` : `${dir} ${version}: ready to release`);
process.exit(problems.length ? 1 : 0);
