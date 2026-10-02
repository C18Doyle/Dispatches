#!/usr/bin/env node
// Splits a game's huge single source file into campaign-sized parts, and assembles it back.
//
// Why: Claude Code (and people) should open one campaign, not a 1-2 MB file. The assembled file stays
// in place because validators, extractors and the build read it; the parts are the editing surface.
//
//   node ../packages/testkit/src/split.mjs split      single file -> parts (use after editing the artifact directly)
//   node ../packages/testkit/src/split.mjs assemble   parts -> single file (the build does this first)
//   node ../packages/testkit/src/split.mjs roundtrip  proves split -> assemble is byte-identical (touches nothing)
//   node ../packages/testkit/src/split.mjs check      exits 1 if the artifact is newer than every part (edited by hand)
//
// Config (split.config.json in the game folder):
//   { "artifact": "src/App.jsx", "partsDir": "src/parts",
//     "parts": [ { "name": "00-head" },
//                { "name": "10-campaign-a", "start": "^  a: \\{", "after": "^const CAMPAIGNS = \\{" }, ... ] }
// The first part starts at offset 0. Every later part starts at the first line matching `start`
// (searched after the first line matching `after`, if given, and always after the previous part's start).
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const cfgPath = resolve(process.env.SPLIT_CONFIG || "split.config.json");
const cfg = JSON.parse(readFileSync(cfgPath, "utf8"));
const artifact = resolve(cfg.artifact);
const partsDir = resolve(cfg.partsDir);
const partFile = (p) => join(partsDir, p.name + (cfg.ext ?? ".jsx"));

function cut(text) {
  const starts = [0];
  let from = 0;
  for (const p of cfg.parts.slice(1)) {
    let searchFrom = from;
    if (p.after) {
      const m = new RegExp(p.after, "m").exec(text.slice(from));
      if (!m) throw new Error(`part ${p.name}: "after" pattern not found: ${p.after}`);
      searchFrom = from + m.index;
    }
    const m = new RegExp(p.start, "m").exec(text.slice(searchFrom));
    if (!m) throw new Error(`part ${p.name}: start pattern not found: ${p.start}`);
    const at = searchFrom + m.index;
    if (at <= starts[starts.length - 1]) throw new Error(`part ${p.name}: starts before the previous part`);
    starts.push(at);
    from = at;
  }
  return cfg.parts.map((p, i) => ({ p, text: text.slice(starts[i], i + 1 < starts.length ? starts[i + 1] : text.length) }));
}

function assembleText() {
  return cfg.parts.map((p) => readFileSync(partFile(p), "utf8")).join("");
}

const cmd = process.argv[2];
if (cmd === "split") {
  const pieces = cut(readFileSync(artifact, "utf8"));
  mkdirSync(partsDir, { recursive: true });
  for (const f of readdirSync(partsDir)) rmSync(join(partsDir, f)); // drop parts a config change no longer lists
  for (const { p, text } of pieces) writeFileSync(partFile(p), text);
  console.log(`split ${cfg.artifact} into ${pieces.length} parts in ${cfg.partsDir}: ` + pieces.map(({ p, text }) => `${p.name} (${text.split("\n").length} lines)`).join(", "));
} else if (cmd === "assemble") {
  writeFileSync(artifact, assembleText());
  console.log(`assembled ${cfg.parts.length} parts -> ${cfg.artifact}`);
} else if (cmd === "roundtrip") {
  const original = readFileSync(artifact, "utf8");
  const rebuilt = cut(original).map((x) => x.text).join("");
  if (rebuilt === original) console.log(`roundtrip: IDENTICAL (${Buffer.byteLength(original)} bytes, ${cfg.parts.length} parts)`);
  else {
    let i = 0;
    while (i < original.length && original[i] === rebuilt[i]) i++;
    console.error(`roundtrip: DIVERGED at character ${i}`);
    process.exit(1);
  }
} else if (cmd === "check") {
  // Guard against editing the artifact directly: assembling would destroy that work.
  if (!existsSync(partsDir)) process.exit(0);
  const newestPart = Math.max(...cfg.parts.map((p) => statSync(partFile(p)).mtimeMs));
  if (statSync(artifact).mtimeMs > newestPart + 1000) {
    console.error(`${cfg.artifact} is newer than every part in ${cfg.partsDir}. Run "split" to bring the parts up to date (or revert the direct edit). Not assembling.`);
    process.exit(1);
  }
} else {
  console.error("usage: split | assemble | roundtrip | check");
  process.exit(2);
}
