// Static preview server with a recording endpoint for the UI-differential tests.
// Usage: node tools/serve.mjs [dir=dist/full] [port=4174]
//   POST /__record/<tag>/<name>  writes the body to tests/ui-runs/<tag>/<name>.json
import { createServer } from "node:http";
import { readFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { extname, join, normalize } from "node:path";

const dir = process.argv[2] ?? "dist/full";
const port = Number(process.argv[3] ?? 4174);
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".mp3": "audio/mpeg", ".png": "image/png" };
const safe = (s) => s.replace(/[^A-Za-z0-9_.-]/g, "_");

createServer((req, res) => {
  const url = new URL(req.url, "http://x");
  const pathname = decodeURIComponent(url.pathname);
  if (req.method === "POST" && pathname.startsWith("/__record/")) {
    const [, , tag, name] = pathname.split("/");
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      const outDir = join("tests", "ui-runs", safe(tag));
      mkdirSync(outDir, { recursive: true });
      writeFileSync(join(outDir, safe(name) + ".json"), Buffer.concat(chunks));
      res.writeHead(200, { "access-control-allow-origin": "*" }).end("ok");
    });
    return;
  }
  if (pathname === "/__driver") {
    res.writeHead(200, { "content-type": "text/javascript", "access-control-allow-origin": "*" }).end(readFileSync("tools/ui_driver.js"));
    return;
  }
  const rel = normalize(pathname).split(/[\\/]+/).filter((s) => s && s !== "..").join("/");
  const file = join(dir, rel === "" ? "index.html" : rel);
  if (!existsSync(file)) {
    res.writeHead(404).end("not found");
    return;
  }
  res.writeHead(200, { "content-type": types[extname(file)] ?? "application/octet-stream" }).end(readFileSync(file));
}).listen(port, () => console.log(`serving ${dir} on ${port}`));
