// The @font-face rules for the game, with each font file embedded as a data URI, so the one HTML file looks right with no network (and inside itch.io's frame).
// The files are in src/fonts (scripts/fetch_fonts.mjs says where they came from). A variable font that serves several weights is embedded once, with a weight range.
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

export function fontCss() {
  const faces = JSON.parse(readFileSync("src/fonts/faces.json", "utf8"));
  const groups = new Map(); // key: family|style|content hash
  for (const f of faces) {
    const bin = readFileSync(`src/fonts/${f.file}`);
    const key = `${f.family}|${f.style}|${createHash("sha1").update(bin).digest("hex")}`;
    const g = groups.get(key) ?? { family: f.family, style: f.style, weights: [], bin };
    g.weights.push(Number(f.weight));
    groups.set(key, g);
  }
  return [...groups.values()]
    .map((g) => {
      const lo = Math.min(...g.weights);
      const hi = Math.max(...g.weights);
      const weight = lo === hi ? `${lo}` : `${lo} ${hi}`;
      return `@font-face{font-family:'${g.family}';font-style:${g.style};font-weight:${weight};font-display:swap;src:url(data:font/woff2;base64,${g.bin.toString("base64")}) format('woff2');}`;
    })
    .join("\n");
}
