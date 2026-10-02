import { readFileSync, writeFileSync } from "node:fs";

const css = readFileSync("dist/styles.css", "utf8");
const js = readFileSync("dist/bundle.js", "utf8");

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <title>Frankenstein: The Modern Prometheus</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
    <link
      href="https://fonts.googleapis.com/css2?family=Pirata+One&family=Cinzel:wght@400;600;700&family=IM+Fell+English:ital@0;1&family=Playfair+Display:ital,wght@0,700;0,900;1,700&display=swap"
      rel="stylesheet"
    />
    <style>
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

writeFileSync("dist/index.html", html, "utf8");
console.log(`inline: wrote dist/index.html (${(html.length / 1024).toFixed(1)} KB)`);
