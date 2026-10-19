// package_download.mjs: gathers the downloadable copy into dist/download: the game page built with --pwa (scripts/inline.mjs --pwa), the manifest, the service
// worker, the icons and a README. The version in sw.js and README.txt comes from package.json. The release zips this folder (package.json "release").
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const version = JSON.parse(readFileSync("package.json", "utf8")).version;
mkdirSync("dist/download", { recursive: true });
for (const f of ["manifest.webmanifest", "icon-192.png", "icon-512.png"]) copyFileSync(`src/pwa/${f}`, `dist/download/${f}`);
for (const f of ["sw.js", "README.txt"]) writeFileSync(`dist/download/${f}`, readFileSync(`src/pwa/${f}`, "utf8").replaceAll("__VERSION__", version));
console.log(`package_download: dist/download for ${version}`);
