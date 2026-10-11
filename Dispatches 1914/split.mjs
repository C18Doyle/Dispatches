/**
 * Split the single-file game into per-module source files under src/.
 *
 * The single file stays the distribution artifact — the series convention and the
 * thing the validators read. src/ is the editing surface: a session that changes
 * one campaign loads one file instead of 3,700 lines.
 *
 * assemble.mjs concatenates src/ back. The round trip is byte-identical and
 * verified by roundtrip-test.mjs; if it ever stops being byte-identical, the split
 * is a liability rather than a convenience and must be fixed or abandoned.
 */
import fs from "fs";
import path from "path";

const SRC = "dispatches-greatwar.jsx";
const OUT = "src";

// Split points are the banner lines, matched on their title. Order is file order.
// Each entry becomes one file containing everything from its banner up to the next.
const SECTIONS = [
  { title: null, file: "00-header.jsx" }, // everything before the first banner
  { title: "CONSTANTS", file: "10-constants.jsx" },
  { title: "CAMPAIGN CONFIGURATION", file: "20-campaign-config.jsx" },
  { title: "GERMAN OHL — HISTORICAL SPINE", file: "30-campaign-ohl.jsx" },
  { title: "FRENCH GQG — HISTORICAL SPINE", file: "31-campaign-gqg.jsx" },
  { title: "RUSSIAN STAVKA — HISTORICAL SPINE", file: "32-campaign-stavka.jsx" },
  { title: "BRITISH EMPIRE — BEF AND WAR CABINET — HISTORICAL SPINE", file: "33-campaign-bef.jsx" },
  { title: "AUSTRO-HUNGARIAN AOK — HISTORICAL SPINE", file: "34-campaign-aok.jsx" },
  { title: "MAPS — spec §13.4", file: "40-maps.jsx" },
  { title: "DERIVED REGISTRIES", file: "50-registries.jsx" },
  { title: "METERS", file: "51-meters.jsx" },
  { title: "COMMANDER SUCCESSION — spec §3.2, §13.3", file: "52-succession.jsx" },
  { title: "HARD MODE — spec §7", file: "53-hardmode.jsx" },
  { title: "NODE RESOLUTION", file: "54-resolve.jsx" },
  { title: "CHOICE RESOLUTION", file: "55-choose.jsx" },
  { title: "SPINE", file: "56-spine.jsx" },
  { title: "NODE ID CONVENTION — spec §13.7", file: "57-nodeids.jsx" },
  { title: "SAVES, RECORD AND SETTINGS — docs/SAVES.md", file: "58-persistence.jsx" },
  { title: "EASY MODE NAMES AND THE COMMAND RANK", file: "59-rank.jsx" },
  { title: "GLOSSARY", file: "60-glossary.jsx" },
  { title: "UI_LAYER", file: "90-ui.jsx" },
];

const BANNER = /^\/\/ ={70,}$/;

const lines = fs.readFileSync(SRC, "utf8").split("\n");

// A banner block is: rule line, title line, rule line. Find the start index of each
// section's banner by its title.
const starts = [];
for (let i = 0; i < lines.length - 1; i++) {
  if (BANNER.test(lines[i]) && lines[i + 1].startsWith("// ")) {
    const title = lines[i + 1].slice(3).trim();
    const idx = SECTIONS.findIndex((s) => s.title === title);
    if (idx > 0 && !starts.some((s) => s.idx === idx)) starts.push({ idx, line: i });
  }
}
starts.sort((a, b) => a.line - b.line);

const missing = SECTIONS.filter((s, i) => i > 0 && !starts.some((st) => st.idx === i));
if (missing.length) {
  console.error("Banners not found for:", missing.map((m) => m.title).join(", "));
  process.exit(1);
}
const outOfOrder = starts.some((s, i) => i > 0 && s.idx < starts[i - 1].idx);
if (outOfOrder) {
  console.error("Sections appear in a different order than SECTIONS declares.");
  process.exit(1);
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const bounds = [0, ...starts.map((s) => s.line), lines.length];
const order = [SECTIONS[0], ...starts.map((s) => SECTIONS[s.idx])];

const manifest = [];
for (let i = 0; i < order.length; i++) {
  const chunk = lines.slice(bounds[i], bounds[i + 1]).join("\n");
  fs.writeFileSync(path.join(OUT, order[i].file), chunk);
  manifest.push(order[i].file);
  const n = chunk.split("\n").length;
  console.log(`  ${order[i].file.padEnd(26)} ${String(n).padStart(5)} lines`);
}
fs.writeFileSync(path.join(OUT, "MANIFEST.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(`split -> ${OUT}/ (${manifest.length} files)`);
