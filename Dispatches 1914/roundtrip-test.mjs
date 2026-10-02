/**
 * The split is only safe if split -> assemble is byte-identical. If it ever is not,
 * the editing surface silently diverges from the artifact every validator reads.
 */
import fs from "fs";
import { execSync } from "child_process";

const F = "dispatches-greatwar.jsx";
const before = fs.readFileSync(F);
fs.writeFileSync("/tmp/original.jsx", before);

execSync("node split.mjs", { stdio: "pipe" });
execSync("node assemble.mjs", { stdio: "pipe" });

const after = fs.readFileSync(F);
if (Buffer.compare(before, after) === 0) {
  console.log(`roundtrip: IDENTICAL (${before.length} bytes)`);
  process.exit(0);
}
fs.writeFileSync(F, before); // restore rather than leave a corrupted artifact
console.log(`roundtrip: DIVERGED — ${before.length} bytes before, ${after.length} after. Original restored.`);
execSync(`diff <(cat /tmp/original.jsx) <(cat ${F}) | head -20 || true`, { shell: "/bin/bash", stdio: "inherit" });
process.exit(1);
