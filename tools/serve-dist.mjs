#!/usr/bin/env node
// Serves a built game folder so it can be opened in a browser (used by .claude/launch.json for the Claude Code
// preview pane, or by hand).  Usage: node tools/serve-dist.mjs "Dispatches 1940/dist/full" [port]
// Build the game first (npm run build:nozip in its folder).
import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";

const dir = resolve(process.argv[2] ?? ".");
const port = Number(process.argv[3] ?? 8765);
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".mp3": "audio/mpeg", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml" };
if (!existsSync(join(dir, "index.html"))) {
  console.error(`No index.html in ${dir}. Build the game first (npm run build:nozip in its folder).`);
  process.exit(1);
}
createServer((req, res) => {
  const rel = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)).split(/[\\/]+/).filter((s) => s && s !== "..").join("/");
  let file = join(dir, rel === "" ? "index.html" : rel);
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
  if (!existsSync(file)) {
    res.writeHead(404);
    res.end("not found");
    return;
  }
  res.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream", "cache-control": "no-store" });
  res.end(readFileSync(file));
}).listen(port, () => console.log(`Serving ${dir} at http://localhost:${port}/`));
