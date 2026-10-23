// Writes dist/fonts.css: the game's fonts as base64 @font-face rules (Latin subset, from the @fontsource packages, all under the SIL Open Font
// License), so the single HTML file needs no network at play time. scripts/inline.mjs puts the result in the page.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const FACES = [
  ["Playfair Display", 700, "normal", "playfair-display"],
  ["Playfair Display", 900, "normal", "playfair-display"],
  ["Playfair Display", 700, "italic", "playfair-display"],
  ["Playfair Display", 900, "italic", "playfair-display"],
  ["Rokkitt", 500, "normal", "rokkitt"],
  ["Rokkitt", 700, "normal", "rokkitt"],
  ["Rokkitt", 800, "normal", "rokkitt"],
  ["Lora", 400, "normal", "lora"],
  ["Lora", 600, "normal", "lora"],
  ["Lora", 400, "italic", "lora"],
  ["Caveat", 500, "normal", "caveat"],
  ["Caveat", 600, "normal", "caveat"],
];

let css = "";
let bytes = 0;
for (const [family, weight, style, pkg] of FACES) {
  const file = `node_modules/@fontsource/${pkg}/files/${pkg}-latin-${weight}-${style}.woff2`;
  const data = readFileSync(file);
  bytes += data.length;
  css += `@font-face{font-family:"${family}";font-style:${style};font-weight:${weight};font-display:swap;src:url(data:font/woff2;base64,${data.toString("base64")}) format("woff2");}\n`;
}
mkdirSync("dist", { recursive: true });
writeFileSync("dist/fonts.css", css);
console.log(`fonts: ${FACES.length} faces, ${(bytes / 1024).toFixed(0)} KB of woff2 written to dist/fonts.css`);
