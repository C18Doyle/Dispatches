// fetch_fonts.mjs: downloads the game's fonts from Google Fonts (all are SIL Open Font Licence), cut down to the characters the game uses, into src/fonts/.
//   node scripts/fetch_fonts.mjs
// Run it again if the game starts using a character that is not in src/fonts/_chars.txt (the build prints a warning for those) or a new family. The woff2 files are committed;
// `npm run build` turns them into @font-face rules inside the one HTML file (scripts/build_fonts.mjs), so the game needs no network to look right.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const chars = readFileSync("src/fonts/_chars.txt", "utf8");
const FAMILIES = [
  ["Pirata One", "Pirata+One"],
  ["Cinzel", "Cinzel:wght@400;600;700"],
  ["Cinzel Decorative", "Cinzel+Decorative:wght@700"],
  ["IM Fell English", "IM+Fell+English:ital@0;1"],
  ["IM Fell English SC", "IM+Fell+English+SC"],
  ["Playfair Display", "Playfair+Display:ital,wght@0,700;0,900;1,700"],
  ["Special Elite", "Special+Elite"],
];
// Google serves woff2 to a current browser
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
mkdirSync("src/fonts", { recursive: true });
const faces = [];
for (const [name, spec] of FAMILIES) {
  const url = `https://fonts.googleapis.com/css2?family=${spec}&text=${encodeURIComponent(chars)}&display=swap`;
  const css = await (await fetch(url, { headers: { "User-Agent": UA } })).text();
  const blocks = css.match(/@font-face\s*\{[^}]*\}/g) ?? [];
  if (!blocks.length) throw new Error(`no @font-face for ${name}:\n${css.slice(0, 300)}`);
  for (const b of blocks) {
    const style = /font-style:\s*(\w+)/.exec(b)?.[1] ?? "normal";
    const weight = /font-weight:\s*([\d ]+)/.exec(b)?.[1].trim() ?? "400";
    const src = /url\((https:[^)]+)\)/.exec(b)?.[1];
    if (!src) throw new Error(`no url for ${name}`);
    const file = `${name.toLowerCase().replace(/ /g, "-")}-${weight.replace(/ /g, "_")}-${style}.woff2`;
    const bin = Buffer.from(await (await fetch(src)).arrayBuffer());
    writeFileSync(`src/fonts/${file}`, bin);
    faces.push({ family: name, style, weight, file, bytes: bin.length });
    console.log(`${file}: ${bin.length} bytes`);
  }
}
writeFileSync("src/fonts/faces.json", JSON.stringify(faces, null, 2) + "\n");
console.log(`${faces.length} files, ${faces.reduce((n, f) => n + f.bytes, 0)} bytes in all.`);
