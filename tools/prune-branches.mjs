#!/usr/bin/env node
// Lists the remote branches that are safe to delete (fully merged into main, no open pull request) and the ones that need a decision (not merged).
// It deletes nothing. It prints a report and, with --script, the `git push origin --delete` commands to run yourself (in batches of ten).
//   node tools/prune-branches.mjs             the report
//   node tools/prune-branches.mjs --script    the report, then the delete commands
// Needs the `gh` CLI for the list of open pull requests.
import { spawnSync } from "node:child_process";

const run = (cmd, args) => {
  const r = spawnSync(cmd, args, { encoding: "utf8" });
  if (r.status !== 0) throw new Error(`${cmd} ${args.join(" ")}: ${r.stderr}`);
  return r.stdout;
};
run("git", ["fetch", "origin", "--prune", "-q"]);
const lines = (s) => s.split("\n").map((l) => l.trim()).filter(Boolean);
const strip = (b) => b.replace(/^origin\//, "");
const merged = new Set(lines(run("git", ["branch", "-r", "--merged", "origin/main"])).filter((b) => !b.includes("->")).map(strip));
const all = lines(run("git", ["branch", "-r"])).filter((b) => !b.includes("->")).map(strip);
const open = new Set(JSON.parse(run("gh", ["pr", "list", "--state", "open", "--limit", "200", "--json", "headRefName"])).map((p) => p.headRefName));
const date = (b) => run("git", ["log", "-1", "--format=%cs", `origin/${b}`]).trim();
const KEEP = new Set(["main"]);

const safe = all.filter((b) => !KEEP.has(b) && merged.has(b) && !open.has(b) && !b.startsWith("dependabot/"));
const unmerged = all.filter((b) => !KEEP.has(b) && !merged.has(b));
const withPr = all.filter((b) => open.has(b));

console.log(`Safe to delete (merged into main, no open pull request): ${safe.length}`);
for (const b of safe) console.log(`  ${date(b)}  ${b}`);
console.log(`\nNot merged (a decision for the owner): ${unmerged.length}`);
for (const b of unmerged) console.log(`  ${date(b)}  ${b}${open.has(b) ? "  (open PR)" : ""}`);
console.log(`\nOpen pull requests: ${withPr.length}`);
if (process.argv.includes("--script")) {
  console.log("\n# run these yourself:");
  for (let i = 0; i < safe.length; i += 10) console.log(`git push origin --delete ${safe.slice(i, i + 10).join(" ")}`);
}
