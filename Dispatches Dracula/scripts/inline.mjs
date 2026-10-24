import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fontCss } from "./lib/fonts.mjs";

// `node scripts/inline.mjs --demo` builds dist/demo/index.html from dist/demo/bundle.js; `--seat=<id>` does the same for another seat (dist/<id>)
const seat = (process.argv.find((a) => a.startsWith("--seat=")) ?? "--seat=dracula").slice(7);
const pwa = process.argv.includes("--pwa"); // the downloadable copy: a manifest link and a service worker for an https host
const dir = pwa ? "dist/download" : process.argv.includes("--demo") ? "dist/demo" : seat === "dracula" ? "dist" : `dist/${seat}`;
const jsDir = pwa ? "dist" : dir;
const title = JSON.parse(readFileSync(`src/content/${seat}/config.json`, "utf8")).title;
const css = readFileSync("dist/styles.css", "utf8");
const js = readFileSync(`${jsDir}/bundle.js`, "utf8");
const head = pwa
  ? `    <meta name="theme-color" content="#0b0708" />
    <link rel="manifest" href="manifest.webmanifest" />
    <link rel="icon" href="icon-192.png" />
    <link rel="apple-touch-icon" href="icon-192.png" />
`
  : "";
const register = pwa
  ? `
    <script>
      if ("serviceWorker" in navigator && location.protocol.indexOf("http") === 0 && window.top === window) navigator.serviceWorker.register("sw.js").catch(function () {});
    </script>`
  : "";

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <title>${title}</title>
${head}    <style>
${fontCss()}
${css}
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script>
${js}
    </script>${register}
  </body>
</html>
`;

mkdirSync(dir, { recursive: true });
writeFileSync(`${dir}/index.html`, html, "utf8");
console.log(`inline: wrote ${dir}/index.html (${(html.length / 1024).toFixed(1)} KB)`);
