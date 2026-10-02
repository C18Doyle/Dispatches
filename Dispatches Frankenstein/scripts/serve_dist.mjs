// Static server for dist/ (local preview only). PORT env or 4173.
import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { extname, join, normalize } from "node:path";

const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".mp3": "audio/mpeg", ".png": "image/png" };
const port = Number(process.env.PORT ?? 4173);

createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, "http://x").pathname);
  const rel = normalize(pathname).split(/[\\/]+/).filter((s) => s && s !== "..").join("/");
  const file = join("dist", rel === "" ? "index.html" : rel);
  if (!existsSync(file)) {
    res.writeHead(404).end("not found");
    return;
  }
  res.writeHead(200, { "content-type": types[extname(file)] ?? "application/octet-stream" }).end(readFileSync(file));
}).listen(port, () => console.log("serving dist on", port));
