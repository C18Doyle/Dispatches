#!/usr/bin/env node
// Builds a game's release artifacts from the repo: tests, build, zips, and a manifest.
//   node ../packages/testkit/src/release.mjs [--skip-tests]      (run from the game folder; `npm run release`)
//
// Reads "release" from the game's package.json:
//   { "build": "npm run build", "variants": [ { "name": "full", "from": "dist/full", "zip": "dispatches-1941-full.zip", "include": ["index.html"] } ] }
// Writes releases/<version>/<zip> for each variant plus releases/<version>/RELEASE.json (game, version,
// git commit, date, sha256 and size of every zip). No dependencies: the zip writer is built in.
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { deflateRawSync } from "node:zlib";

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const cfg = pkg.release;
if (!cfg) {
  console.error('package.json has no "release" section');
  process.exit(2);
}
const skipTests = process.argv.includes("--skip-tests");
const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const sh = (cmd, args) => spawnSync(cmd, args, { stdio: "inherit", shell: process.platform === "win32" }).status === 0;

// ── CRC32 + minimal ZIP writer (deflate) ──
const CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
const crc32 = (buf) => {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
function listFiles(dir, include) {
  const out = [];
  const walk = (d) => {
    for (const name of readdirSync(d).sort()) {
      const p = join(d, name);
      if (statSync(p).isDirectory()) walk(p);
      else out.push(p);
    }
  };
  walk(dir);
  const rel = out.map((p) => relative(dir, p).split("\\").join("/"));
  return include ? rel.filter((r) => include.some((i) => r === i || r.startsWith(i + "/"))) : rel;
}
function writeZip(dir, files, zipPath) {
  const parts = [];
  const central = [];
  let offset = 0;
  const DOS_TIME = 0x0000;
  const DOS_DATE = 0x5821; // 2024-01-01: fixed so identical inputs give identical zips
  for (const name of files) {
    const data = readFileSync(join(dir, name));
    const comp = deflateRawSync(data, { level: 9 });
    const nameBuf = Buffer.from(name, "utf8");
    const crc = crc32(data);
    const lh = Buffer.alloc(30);
    lh.writeUInt32LE(0x04034b50, 0);
    lh.writeUInt16LE(20, 4);
    lh.writeUInt16LE(0x0800, 6); // utf-8 names
    lh.writeUInt16LE(8, 8);
    lh.writeUInt16LE(DOS_TIME, 10);
    lh.writeUInt16LE(DOS_DATE, 12);
    lh.writeUInt32LE(crc, 14);
    lh.writeUInt32LE(comp.length, 18);
    lh.writeUInt32LE(data.length, 22);
    lh.writeUInt16LE(nameBuf.length, 26);
    parts.push(lh, nameBuf, comp);
    const ch = Buffer.alloc(46);
    ch.writeUInt32LE(0x02014b50, 0);
    ch.writeUInt16LE(20, 4);
    ch.writeUInt16LE(20, 6);
    ch.writeUInt16LE(0x0800, 8);
    ch.writeUInt16LE(8, 10);
    ch.writeUInt16LE(DOS_TIME, 12);
    ch.writeUInt16LE(DOS_DATE, 14);
    ch.writeUInt32LE(crc, 16);
    ch.writeUInt32LE(comp.length, 20);
    ch.writeUInt32LE(data.length, 24);
    ch.writeUInt16LE(nameBuf.length, 28);
    ch.writeUInt32LE(offset, 42);
    central.push(ch, nameBuf);
    offset += lh.length + nameBuf.length + comp.length;
  }
  const centralBuf = Buffer.concat(central);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(files.length, 8);
  end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(centralBuf.length, 12);
  end.writeUInt32LE(offset, 16);
  writeFileSync(zipPath, Buffer.concat([...parts, centralBuf, end]));
}

// ── release ──
if (!skipTests && pkg.scripts?.["test:fast"] && !sh(npm, ["run", "test:fast"])) {
  console.error("\nrelease aborted: test:fast failed (use --skip-tests only if you know why)");
  process.exit(1);
}
const [buildCmd, ...buildArgs] = (cfg.build || "npm run build").split(" ");
if (!sh(buildCmd === "npm" ? npm : buildCmd, buildArgs)) {
  console.error("\nrelease aborted: build failed");
  process.exit(1);
}
const commit = spawnSync("git", ["rev-parse", "--short", "HEAD"], { encoding: "utf8" }).stdout.trim() || "unknown";
const dirty = (spawnSync("git", ["status", "--porcelain", "--", "."], { encoding: "utf8" }).stdout || "").trim() !== "";
const outDir = join("releases", pkg.version);
mkdirSync(outDir, { recursive: true });
const manifest = { game: pkg.name, version: pkg.version, commit, dirty, date: new Date().toISOString(), testsRun: !skipTests, files: [] };
for (const v of cfg.variants) {
  const files = listFiles(v.from, v.include);
  if (!files.length) {
    console.error(`variant ${v.name}: nothing to zip in ${v.from}`);
    process.exit(1);
  }
  const zipPath = join(outDir, v.zip);
  writeZip(v.from, files, zipPath);
  const bytes = readFileSync(zipPath);
  manifest.files.push({ variant: v.name, zip: v.zip, files: files.length, bytes: bytes.length, sha256: createHash("sha256").update(bytes).digest("hex") });
  console.log(`wrote ${zipPath} (${files.length} files, ${(bytes.length / 1024).toFixed(0)} KB)`);
}
writeFileSync(join(outDir, "RELEASE.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(`release ${pkg.name} ${pkg.version} @ ${commit}${dirty ? " (working tree has uncommitted changes)" : ""} -> ${outDir}`);
