// Compares a candidate set of recorded UI runs against the baseline recorded from the
// pre-refactor build.
//   node tools/verify_baseline.mjs [baselineDir=tests/baseline/ui] [candidateDir=tests/ui-runs/candidate]
//
// Rule per run: every per-step page hash must be identical, with one allowance. Where the
// BASELINE run crashed (the shipped game's "The File Was Damaged" screen), the candidate must
// match everything before the crashing click and is expected not to crash. Anything else that
// differs is a regression and fails the check (exit 1).
//
// Record runs with the browser driver (tools/ui_driver.js): serve a build with
// `node tools/serve.mjs <dist dir> <port>`, open it, then run __matrix("<tag>").
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const baseDir = process.argv[2] ?? "tests/baseline/ui";
const candDir = process.argv[3] ?? "tests/ui-runs/candidate";
if (!existsSync(baseDir) || !existsSync(candDir)) {
  console.error(`missing directory: ${!existsSync(baseDir) ? baseDir : candDir}`);
  process.exit(2);
}

let failures = 0;
let identical = 0;
let crashFixed = 0;
const files = readdirSync(baseDir).filter((f) => f.endsWith(".json")).sort();
for (const f of files) {
  const name = f.replace(".json", "");
  if (!existsSync(join(candDir, f))) {
    console.error(`FAIL ${name}: no candidate run recorded`);
    failures++;
    continue;
  }
  const base = JSON.parse(readFileSync(join(baseDir, f), "utf8"));
  const cand = JSON.parse(readFileSync(join(candDir, f), "utf8"));
  const bh = base.hashes.split(",");
  const ch = cand.hashes.split(",");
  if (base.crashed) {
    const prefix = bh.length - 1; // the last hash is the damaged-file screen
    const same = bh.slice(0, prefix).every((h, i) => h === ch[i]);
    if (!same) {
      console.error(`FAIL ${name}: diverges before the legacy crash point (step ${bh.slice(0, prefix).findIndex((h, i) => h !== ch[i])})`);
      failures++;
    } else if (cand.crashed) {
      console.error(`FAIL ${name}: candidate still crashes (${(cand.crash || [])[0]})`);
      failures++;
    } else {
      crashFixed++;
      console.log(`fixed ${name}: legacy crashed after ${prefix} steps (${(base.crash || [])[0]}); candidate continues for ${ch.length} steps`);
    }
    continue;
  }
  if (bh.length === ch.length && bh.every((h, i) => h === ch[i]) && !cand.crashed) {
    identical++;
  } else {
    const i = bh.findIndex((h, k) => h !== ch[k]);
    console.error(`FAIL ${name}: first difference at step ${i === -1 ? Math.min(bh.length, ch.length) : i} (baseline ${bh.length} steps, candidate ${ch.length}${cand.crashed ? ", CRASHED" : ""})`);
    failures++;
  }
}

console.log(`\n${files.length} runs: ${identical} identical, ${crashFixed} legacy-crash runs now complete, ${failures} failure(s).`);
process.exit(failures ? 1 : 0);
