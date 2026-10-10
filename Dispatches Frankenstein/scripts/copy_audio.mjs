import { mkdirSync, copyFileSync } from "node:fs";
// `--demo` copies into dist/demo/audio as well, so the demo folder is a complete page
const dirs = process.argv.includes("--demo") ? ["dist/demo/audio"] : ["dist/audio"];
for (const d of dirs) {
  mkdirSync(d, { recursive: true });
  copyFileSync("audio/lament.mp3", d + "/lament.mp3");
}
