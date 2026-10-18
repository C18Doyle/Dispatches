import { readFileSync, writeFileSync } from "node:fs";

// Builds dist/index.html from dist/styles.css, dist/fonts.css (scripts/fonts.mjs) and dist/bundle.js: one file, no network at play time.
const dir = "dist";
const fonts = readFileSync("dist/fonts.css", "utf8");
const css = readFileSync("dist/styles.css", "utf8");
const js = readFileSync(`${dir}/bundle.js`, "utf8");

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <title>Sherlock Holmes: The Final Problem</title>
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
