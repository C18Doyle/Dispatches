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
    "snapshotRun", "validateSave", "emptyRecord", "noteNodeSeen", "MAP_CITIES", "MAP_VIEW", "MAP_NEAR", "MAP_LAND_PATH", "MAP_COUNTRIES", "mapFor", "MAP_ALLEGIANCE", "MAP_OVERLAYS", "sideOfCountry", "activeOverlays", "mapDate", "meanwhileAt", "noteEnding", "noteRank", "noteBattle", "noteEchoes", "echoSeed", "ECHOES", "sanitizeSettings", "defaultSettings", "SAVE_SCHEMA_VERSION",
    "NODE_ID_PATTERN", "ENDING_ID_PATTERN", "isValidNodeId",
    "STRAIN", "strainMeterOf", "strainedUncertain", "previewImpact", "REWIND_LIMIT",
    "EASY_NAMES", "ENDING_TIER", "RANKS", "EASY_RANK_CAP", "modeOf", "costlyOrders", "rankFor",
    "GLOSSARY", "LEAVES_OUT",
    "THEME_IDS", "THEME_LABELS", "THEME_TOKENS", "THEME_PAIRS", "THEME_MIN_RATIO", "CAMPAIGN_BANDS", "contrastRatio", "tokensFor", "themeCss", "sepiaCss", "ASKS", "shareSummary", "BRIEFINGS", "HOW_TO", "ukDate", "nodeDate", "EVENTS", "dueEvent", "DEFAULT_THEME", "resolveTheme",
    "BATTLES", "BATTLE_COMMANDER_BONUS", "BATTLE_NEGLECT_PENALTY", "BATTLE_BONUS_CLAMP", "BATTLE_SCALE", "BATTLE_INTEL_ERROR", "BATTLE_WEIGHT_BOUNDS",
    "battleOf", "battlePoolSize", "pickBattlePosture", "battleIntel", "battleArmWeight", "battleContributions", "allBattleAllocations", "staffPlanFor",
    "battleBonus", "battlePlanOdds", "BATTLE_STANCES", "BATTLE_PRESS", "BATTLE_STEADY", "BATTLE_SHIFT_MAX", "BATTLE_SHIFT_COST", "BATTLE_SECOND_GAIN", "battleSecondPlan", "battleFinalBonus", "shiftToward", "battlePlanCosts", "battleFlagsOut", "battleEchoText", "battleRoll",
    "ODDS_BANDS", "orderOdds", "METER_STRANDS", "strandOf", "strandReadout", "tallyStrands", "meterChanges",
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
