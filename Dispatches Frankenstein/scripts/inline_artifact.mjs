// Builds the content fragment for the Artifact tool: title + style + body
// content only, NO doctype/html/head/body — the Artifact publish step wraps
// that skeleton itself.
import { readFileSync, writeFileSync } from "node:fs";

const css = readFileSync("dist/styles.css", "utf8");
const js = readFileSync("dist/bundle.js", "utf8");

const html = `<title>Frankenstein: The Modern Prometheus</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
<link
  href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Cinzel:wght@400;600;700&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Playfair+Display:ital,wght@0,700;0,900;1,700&display=swap"
  rel="stylesheet"
/>
<style>
${css}
</style>
<div id="root"></div>
<script>
${js}
</script>
`;

writeFileSync("dist/artifact.html", html, "utf8");
console.log(`inline_artifact: wrote dist/artifact.html (${(html.length / 1024).toFixed(1)} KB)`);
