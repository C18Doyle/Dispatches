// Shared by the 1941 audits (check-reachability, check-advisor-dates, check-outcome-sign, check-endings):
// loads the campaigns and the rules the game itself uses, and plays seeded random wars the way the app does.
import { createRequire } from "node:module";
import { readFileSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { loadFromJsx } from "../../packages/testkit/src/load-campaigns.mjs";

const esbuild = createRequire(import.meta.url)("esbuild");

export const MODES = ["open", "fanatical", "coalition"];
export const AXES = ["readiness", "pipeline", "initiative"];
export const MONTHS = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

export function loadGame() {
  const game = loadFromJsx(esbuild, "src/App.jsx", ["ENDINGS_GALLERY", "ADVISOR_DOSSIERS", "ADVISOR_TITLE", "NODE_ATLAS", "NODE_TOTAL", "advisorAttribution", "classifyEnding", "ENDING_CLASSIFICATION", "evaluateObjectives"]);
  // The game's own rules (logic.ts), bundled once into a temp module so the audits cannot drift from the app.
  const out = esbuild.buildSync({ entryPoints: ["src/logic.ts"], bundle: true, format: "esm", platform: "node", write: false, logLevel: "silent" });
  const dir = mkdtempSync(path.join(tmpdir(), "dispatches1941-"));
  const file = path.join(dir, "logic.mjs");
  writeFileSync(file, out.outputFiles[0].text);
  return import(pathToFileURL(file).href).then((logic) => ({ ...game, logic }));
}

export function seeded(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Reads of a flag anywhere in the game's source, for the write-only-flag check. */
export function sourceText() {
  const parts = ["00-head", "10-campaign-japan", "11-campaign-alliedpacific", "20-registries-and-gallery", "25-battle-subgame", "26-battles-pacific", "30-screens", "35-battle-screens", "40-app"];
  let t = parts.map((p) => readFileSync(`src/parts/${p}.jsx`, "utf8")).join("\n");
  t += "\n" + readFileSync("src/data/alliedPacific.nodes.json", "utf8");
  return t;
}

/**
 * A node date as a range of months (year*12 + month). "SEPTEMBER 1940" is one month, "JUNE – JULY 1942" two, "1943 – 1944" two years, "1945" the whole
 * year. Returns null when the date holds no year.
 */
export function parseRange(date) {
  if (typeof date !== "string") return null;
  const years = [...date.matchAll(/(19\d{2})/g)].map((m) => parseInt(m[1], 10));
  if (!years.length) return null;
  const months = [...date.toUpperCase().matchAll(new RegExp(MONTHS.join("|"), "g"))].map((m) => MONTHS.indexOf(m[0]));
  const y0 = years[0];
  const y1 = years[years.length - 1];
  const start = y0 * 12 + (months.length ? months[0] : 0);
  const end = y1 * 12 + (months.length ? months[months.length - 1] : 11);
  return { start, end: Math.max(start, end) };
}

export const monthName = (v) => `${MONTHS[v % 12].slice(0, 3)} ${Math.floor(v / 12)}`;

/**
 * Plays one war with a random policy: every choice that is not blocked is equally likely, uncertain choices roll with the
 * game's own weights. Returns what the audits need: the nodes seen with their state, the label and the final state.
 */
export function playWar(game, campaignId, mode, rnd, { onChoice, uniformRolls = false, greedy = 0 } = {}) {
  const { CAMPAIGNS, logic } = game;
  const camp = CAMPAIGNS[campaignId];
  let flags = logic.startFlags(mode);
  let meters = { ...logic.EMPTY_METERS };
  let pos = camp.start;
  const seen = [];
  let steps = 0;
  while (pos && pos !== "END" && steps++ < 400) {
    let stage = camp.resolveNode(pos, flags, meters);
    if (!stage) throw new Error(`${campaignId}: node ${pos} does not resolve`);
    stage = logic.playableStage(stage, mode, 5);
    const open = stage.choices.map((c, i) => [c, i]).filter(([c]) => !c.disabledReason);
    // greedy > 0: with that probability take the choice that helps the meters most (reaches the branches gated on strong meters)
    const worth = (c) => (c.uncertain && c.uncertain.length ? c.uncertain.reduce((a, v) => a + logic.impactSum(v.impact || c.impact), 0) / c.uncertain.length : logic.impactSum(c.impact));
    const [, index] = rnd() < greedy ? open.reduce((b, o) => (worth(o[0]) > worth(b[0]) ? o : b)) : open[Math.floor(rnd() * open.length)];
    // uniformRolls gives every outcome of an uncertain choice the same chance, so rare branches are visited too
    let rand = rnd;
    const unc = stage.choices[index].uncertain;
    if (uniformRolls && unc && unc.length) {
      const k = Math.floor(rnd() * unc.length);
      const total = unc.reduce((a, v) => a + v.weight, 0);
      const u = total > 0 ? (unc.slice(0, k).reduce((a, v) => a + v.weight, 0) + unc[k].weight / 2) / total : 0;
      rand = () => u;
    }
    const res = logic.resolveChoice({ stage, index, mode, favor: 5, defiance: 0, flags, meters, rand });
    if (!res) break;
    seen.push({ id: pos, stage, index, rollIndex: res.rollIndex, flagsBefore: flags, metersBefore: meters });
    if (onChoice) onChoice(pos, stage, index, res);
    flags = res.flags;
    meters = res.meters;
    const choice = stage.choices[index];
    const { nextPos, isEnd } = logic.nextPosition({ dynamic: true, position: pos, choice, rollIndex: res.rollIndex, mode, flags });
    if (isEnd) {
      pos = "END";
      break;
    }
    pos = nextPos;
  }
  const label = camp.positionLabel ? camp.positionLabel(flags, meters) : null;
  return { seen, flags, meters, label, ended: pos === "END" };
}

/** The titles a campaign's positionLabel() can return: every `return "..."` between it and epilogue(), in the campaign's part file. */
export function labelsInSource(campaignId) {
  const file = { japan: "10-campaign-japan", alliedPacific: "11-campaign-alliedpacific" }[campaignId];
  const text = readFileSync(`src/parts/${file}.jsx`, "utf8");
  const start = text.indexOf("positionLabel(flags, meters) {");
  if (start === -1) return [];
  const end = text.indexOf("\n    epilogue(", start);
  return [...new Set([...text.slice(start, end === -1 ? undefined : end).matchAll(/return\s+"([^"]+)"/g)].map((m) => m[1]))];
}
