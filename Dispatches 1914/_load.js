/**
 * Shared loader for the Dispatches 1918 validators.
 *
 * Extracts the engine layer from the JSX file and evaluates it as a CommonJS
 * module. Splits on the UI_LAYER marker so render code is never evaluated.
 *
 * This is real execution, not text parsing. Regex-based node analysis produces
 * false positives; every validator here calls the actual engine.
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const SPLIT_MARKER = "// UI_LAYER";

function loadEngine(file) {
  const abs = path.resolve(file);
  let src = fs.readFileSync(abs, "utf8");

  const idx = src.indexOf(SPLIT_MARKER);
  if (idx !== -1) src = src.slice(0, idx);

  src = src.replace(/^export\s+/gm, "");

  const exported = [
    "CAMPAIGNS", "CAMPAIGN_IDS", "MAPS", "MAP_TOKENS", "CALENDARS", "BADGES",
    "BADGE_LABELS", "TIERS", "METER_AXES", "METER_MIN", "METER_MAX",
    "EROSION_TRIGGERS", "EROSION_MAX",
    "allNodes", "buildNodeAtlas", "buildNodeToCity", "buildEndings",
    "nodeTotal", "nodeTotalsByCampaign",
    "emptyMeters", "clampMeter", "applyImpact", "meterLabels",
    "commanderAt", "advisorsPresentAt", "isAdvisorPresent",
    "emptyHardState", "erosionMax", "erosionFromChoice", "applyErosion", "hardModeForcesEnding",
    "findNode", "resolveNode", "rollUncertain", "chooseNext",
    "historicalChoice", "walkSpine", "historicalNote",
    "snapshotRun", "validateSave", "emptyRecord", "noteNodeSeen", "noteEnding", "sanitizeSettings", "defaultSettings", "SAVE_SCHEMA_VERSION",
    "NODE_ID_PATTERN", "ENDING_ID_PATTERN", "isValidNodeId",
  ];

  src += `\nmodule.exports = { ${exported.join(", ")} };\n`;

  const module_ = { exports: {} };
  const context = vm.createContext({ module: module_, exports: module_.exports, console });
  new vm.Script(src, { filename: abs }).runInContext(context);
  return module_.exports;
}

/** Consistent reporting. Every validator reports counts, not assertions. */
function report(name, problems, checked) {
  const n = problems.length;
  console.log(`${name}: ${checked} checked, ${n} problem${n === 1 ? "" : "s"}`);
  for (const p of problems) console.log(`  - ${p}`);
  return n;
}

function fileArg(fallback = "dispatches-greatwar.jsx") {
  return process.argv[2] || fallback;
}

module.exports = { loadEngine, report, fileArg };
