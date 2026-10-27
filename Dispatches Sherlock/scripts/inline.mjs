import { readFileSync, writeFileSync } from "node:fs";

// Builds dist/index.html from dist/styles.css, dist/fonts.css (scripts/fonts.mjs) and dist/bundle.js: one file, no network at play time.
// `--demo` builds dist/demo/index.html from dist/demo/bundle.js; otherwise dist/index.html (and dist/README.txt for the download).
const demo = process.argv.includes("--demo");
const dir = demo ? "dist/demo" : "dist";
const fonts = readFileSync("dist/fonts.css", "utf8");
const css = readFileSync("dist/styles.css", "utf8");
const js = readFileSync(`${dir}/bundle.js`, "utf8");

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <title>Sherlock Holmes: The Final Problem${demo ? " (demo)" : ""}</title>
    <style>
${fonts}
${css}
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script>
${js}
    </script>
  </body>
</html>
`;

writeFileSync(`${dir}/index.html`, html, "utf8");
console.log(`inline: wrote ${dir}/index.html (${(html.length / 1024).toFixed(1)} KB)`);

if (!demo) {
  const version = JSON.parse(readFileSync("package.json", "utf8")).version;
  const nl = String.fromCharCode(10);
  const readme = [
    `Sherlock Holmes: The Final Problem (version ${version})`,
    "",
    "Open index.html in any modern browser. It is one file and needs no network: the fonts and the story are inside it.",
    "Your saved cases and your settings live in the browser that you open it with, and stay there; they are not in this folder.",
    "",
    "The Case-Book holds one major case (The Final Problem, 1891) and four minor cases. Tap a choice once to mark it and again to confirm it.",
    "",
    "Part of the Dispatches series: https://dispatches.itch.io",
    "",
  ].join(nl);
  writeFileSync("dist/README.txt", readme, "utf8");
  console.log("inline: wrote dist/README.txt");
}
