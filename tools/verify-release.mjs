#!/usr/bin/env node
// Verifies the release zips of a game exactly as itch.io would serve them.
//   node tools/verify-release.mjs 1941        newest releases/<version>/ of "Dispatches 1941"
//   node tools/verify-release.mjs 1941 1.0.0  a specific version
//   SKIP_BROWSER=1 ...                        skip the Chromium load (zip checks only)
// For every zip listed in RELEASE.json it checks: the file exists, its sha256 and size match the manifest,
// index.html is at the zip root (itch.io requires this), no path escapes the zip, the file count and size
// are within itch.io's HTML5 limits (1000 files, 500 MB unpacked), then it unpacks the zip to a temp
// folder and loads it in Chromium on a phone and a desktop viewport (tools/smoke-browser.mjs --dir).
// Dependency-free zip reader (the release zipper in packages/testkit writes plain deflate zips).
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { inflateRawSync } from "node:zlib";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const [, , gameArg, versionArg] = process.argv;
if (!gameArg) {
  console.error("usage: node tools/verify-release.mjs <game, e.g. 1941> [version]");
  process.exit(2);
}
const gameDir = readdirSync(ROOT).find((d) => d.startsWith("Dispatches ") && d.toLowerCase().includes(gameArg.toLowerCase()));
if (!gameDir) {
  console.error(`no game folder matching "${gameArg}"`);
  process.exit(2);
}
const relDir = join(ROOT, gameDir, "releases");
if (!existsSync(relDir)) {
  console.error(`${gameDir} has no releases/ folder: run "npm run release" in it first`);
  process.exit(1);
}
const versions = readdirSync(relDir).filter((v) => existsSync(join(relDir, v, "RELEASE.json")));
const version = versionArg ?? [...versions].sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).at(-1);
if (!version || !versions.includes(version)) {
  console.error(`no release${versionArg ? " " + versionArg : ""} with a RELEASE.json in ${relDir}`);
  process.exit(1);
}
const dir = join(relDir, version);
const manifest = JSON.parse(readFileSync(join(dir, "RELEASE.json"), "utf8"));
console.log(`${gameDir} ${version}: ${manifest.zips?.length ?? manifest.files?.length ?? 0} zip(s), commit ${manifest.commit ?? "?"}`);

function readZip(buf) {
  let eocd = -1;
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 65557); i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) throw new Error("not a zip (no end-of-central-directory record)");
  const count = buf.readUInt16LE(eocd + 10);
  let p = buf.readUInt32LE(eocd + 16);
  const entries = [];
  for (let n = 0; n < count; n++) {
    if (buf.readUInt32LE(p) !== 0x02014b50) throw new Error("corrupt central directory");
    const method = buf.readUInt16LE(p + 10);
    const csize = buf.readUInt32LE(p + 20);
    const usize = buf.readUInt32LE(p + 24);
    const nameLen = buf.readUInt16LE(p + 28);
    const extraLen = buf.readUInt16LE(p + 30);
    const commentLen = buf.readUInt16LE(p + 32);
    const local = buf.readUInt32LE(p + 42);
    const name = buf.toString("utf8", p + 46, p + 46 + nameLen);
    entries.push({ name, method, csize, usize, local });
    p += 46 + nameLen + extraLen + commentLen;
  }
  return entries.map((e) => {
    const start = e.local + 30 + buf.readUInt16LE(e.local + 26) + buf.readUInt16LE(e.local + 28);
    const raw = buf.subarray(start, start + e.csize);
    const data = e.method === 0 ? raw : e.method === 8 ? inflateRawSync(raw) : null;
    return { ...e, data };
  });
}

let failed = 0;
const fail = (m) => {
  failed++;
  console.error("  FAIL " + m);
};
const zips = manifest.zips ?? manifest.files ?? [];
if (zips.length === 0) fail("RELEASE.json lists no zips");
for (const z of zips) {
  const name = z.name ?? z.file ?? z.zip;
  console.log(`\n${name}`);
  const path = join(dir, name);
  if (!existsSync(path)) {
    fail("file missing");
    continue;
  }
  const buf = readFileSync(path);
  const sha = createHash("sha256").update(buf).digest("hex");
  if (z.sha256 && z.sha256 !== sha) fail(`sha256 differs from RELEASE.json (${sha.slice(0, 12)}… vs ${String(z.sha256).slice(0, 12)}…)`);
  if (z.bytes ?? z.size) if ((z.bytes ?? z.size) !== buf.length) fail(`size ${buf.length} differs from RELEASE.json ${z.bytes ?? z.size}`);
  let entries;
  try {
    entries = readZip(buf);
  } catch (e) {
    fail(e.message);
    continue;
  }
  const files = entries.filter((e) => !e.name.endsWith("/"));
  const total = files.reduce((a, e) => a + e.usize, 0);
  console.log(`  ${files.length} files, ${(total / 1048576).toFixed(1)} MB unpacked, ${(buf.length / 1048576).toFixed(1)} MB zipped`);
  if (!files.some((e) => e.name === "index.html")) fail("index.html is not at the zip root (itch.io HTML5 games need it there)");
  for (const e of files) {
    if (e.name.startsWith("/") || e.name.split("/").includes("..") || e.name.includes("\\")) fail(`unsafe path in zip: ${e.name}`);
    if (e.data === null) fail(`unsupported compression in ${e.name}`);
    else if (e.data.length !== e.usize) fail(`size mismatch inside zip: ${e.name}`);
  }
  if (files.length > 1000) fail(`${files.length} files (itch.io HTML5 limit is 1000)`);
  if (total > 500 * 1048576) fail(`${(total / 1048576).toFixed(0)} MB unpacked (itch.io HTML5 limit is 500 MB)`);
  if (failed === 0 && process.env.SKIP_BROWSER !== "1") {
    const out = mkdtempSync(join(tmpdir(), "dispatches-release-"));
    for (const e of files) {
      const target = join(out, e.name);
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, e.data);
    }
    const r = spawnSync(process.execPath, [join(ROOT, "tools", "smoke-browser.mjs"), `--dir=${out}`, `--name=${gameArg}-${name}`], { stdio: "inherit" });
    if (r.status !== 0) fail("the unpacked zip does not load cleanly in Chromium");
  }
}
console.log(failed ? `\n${failed} problem(s) in the release` : "\nrelease verified");
process.exit(failed ? 1 : 0);
