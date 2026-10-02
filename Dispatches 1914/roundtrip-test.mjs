/**
 * The split is only safe if split -> assemble is byte-identical. If it ever is not,
 * the editing surface silently diverges from the artifact every validator reads.
 */
import fs from "fs";
import os from "os";
import path from "path";
import { execSync } from "child_process";

const F = "dispatches-greatwar.jsx";
const before = fs.readFileSync(F);
fs.writeFileSync(path.join(os.tmpdir(), "dispatches-1914-original.jsx"), before);

execSync("node split.mjs", { stdio: "pipe" });
execSync("node assemble.mjs", { stdio: "pipe" });

const after = fs.readFileSync(F);
if (Buffer.compare(before, after) === 0) {
  console.log(`roundtrip: IDENTICAL (${before.length} bytes)`);
  process.exit(0);
}
fs.writeFileSync(F, before); // restore rather than leave a corrupted artifact
let i = 0;
while (i < Math.min(before.length, after.length) && before[i] === after[i]) i++;
console.log(`roundtrip: DIVERGED — ${before.length} bytes before, ${after.length} after, first difference at byte ${i}. Original restored.`);
process.exit(1);
