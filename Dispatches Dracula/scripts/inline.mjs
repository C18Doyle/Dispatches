import { readFileSync, writeFileSync } from "node:fs";
import { fontCss } from "./lib/fonts.mjs";

// `node scripts/inline.mjs --demo` builds dist/demo/index.html from dist/demo/bundle.js; `--seat=<id>` does the same for another seat (dist/<id>)
const seat = (process.argv.find((a) => a.startsWith("--seat=")) ?? "--seat=dracula").slice(7);
const dir = process.argv.includes("--demo") ? "dist/demo" : seat === "dracula" ? "dist" : `dist/${seat}`;
const title = JSON.parse(readFileSync(`src/content/${seat}/config.json`, "utf8")).title;
const css = readFileSync("dist/styles.css", "utf8");
const js = readFileSync(`${dir}/bundle.js`, "utf8");

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <title>${title}</title>
    <style>
${fontCss()}
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
