/**
 * Concatenate src/ back into the single-file game.
 *
 * src/ is the editing surface; the single file is the distribution artifact and
 * what every validator reads. Run this after editing anything in src/.
 */
import fs from "fs";
import path from "path";

const SRC = "src";
const OUT = "dispatches-greatwar.jsx";

const manifest = JSON.parse(fs.readFileSync(path.join(SRC, "MANIFEST.json"), "utf8"));
const parts = manifest.map((f) => fs.readFileSync(path.join(SRC, f), "utf8"));
fs.writeFileSync(OUT, parts.join("\n"));
console.log(`assembled ${manifest.length} files -> ${OUT} (${parts.join("\n").split("\n").length} lines)`);
