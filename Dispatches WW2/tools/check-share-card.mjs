#!/usr/bin/env node
// The share card (src/parts/41-share-card.jsx): the SVG is well formed for every kind of ending, escapes what it prints, keeps its text inside the card and
// draws the regions that it is given.
//   node tools/check-share-card.mjs
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(ROOT, "package.json"));
const I18N_STUB = "const T = (s) => s; const t = (s, p) => String(s).replace(/\\{(\\w+)\\}/g, (m, k) => (p && p[k] != null ? p[k] : m));\n";
const { JSDOM } = require("jsdom");
const src = readFileSync(join(ROOT, "src/parts/41-share-card.jsx"), "utf8");
const code = src.slice(0, src.indexOf("/** The card as a PNG blob"));
const stubs = `const MAP_REGIONS = [{ id: "france" }, { id: "poland" }, { id: "none" }];
const STATUS_COLORS = { axis: "#5c1a1a", allied: "#28497a", soviet: "#c62828", divided: "url(#x)" };
const regionPathD = (rings) => (rings && rings.length ? "M0,0L10,0L10,10Z" : "");`;
const C = new Function(I18N_STUB + stubs + "\n" + code + "\nreturn { shareCardSvg, shareWrap, xmlEscape, SHARE_CARD_W, SHARE_CARD_H };")();

const problems = [];
const ok = (c, m) => { if (!c) problems.push(m); };
const parse = (svg) => {
  const dom = new JSDOM("", { contentType: "text/html" });
  const doc = new dom.window.DOMParser().parseFromString(svg, "image/svg+xml");
  return doc.querySelector("parsererror") ? null : doc;
};
const campaign = { name: "Wehrmacht High Command", seal: "OKW", accent: "#7a2e2e", id: "german" };
const geometry = { france: { rings: [[[0, 0]]] }, poland: { rings: [[[0, 0]]] } };
const cases = [
  { campaign, modeLabel: "Standard Issue Command", rank: "Colonel", score: 71, ending: "A Peace Made in the West & the East Held", tier: "Minor Victory", endStamp: "MAY 1945", matched: 12, comparable: 20, outperformed: 7, statuses: { france: "axis", poland: "soviet", none: "axis" }, geometry, bbox: {} },
  { campaign, modeLabel: "", rank: null, score: null, ending: "<The Reich Stands> \"alone\" and 'unbroken', with a very long title that has to be broken over several lines of the card and still be cut at three", tier: null, endStamp: null, matched: 0, comparable: 0, outperformed: 0, statuses: null, geometry: null, bbox: null },
  { campaign: { ...campaign, name: "Soviet & Allied <High> Command", seal: "COMANDO SUPREMO" }, modeLabel: "F\u00fchrer Mode", rank: "General", score: 100, ending: "x", tier: "Major Victory", endStamp: "1946", matched: 3, comparable: 3, outperformed: 3, statuses: { france: "divided" }, geometry, bbox: {} },
];
for (const [i, c] of cases.entries()) {
  const svg = C.shareCardSvg(c);
  const doc = parse(svg);
  ok(!!doc, "case " + i + ": the SVG does not parse");
  if (!doc) continue;
  ok(!/undefined|null|NaN/.test(svg), "case " + i + ": the SVG prints undefined, null or NaN");
  const texts = [...doc.querySelectorAll("text")].map((t) => t.textContent);
  ok(texts.some((t) => t.includes(c.campaign.seal)), "case " + i + ": the seal is missing");
  for (const t of texts) ok(t.length <= 80, "case " + i + ": a line of " + t.length + " characters");
  const paths = doc.querySelectorAll("g path").length;
  ok(paths === (c.statuses && c.geometry ? Object.keys(c.statuses).filter((k) => k !== "none" && c.geometry[k]).length : 0), "case " + i + ": " + paths + " regions drawn");
  ok(svg.includes('width="' + C.SHARE_CARD_W + '"') && svg.includes('height="' + C.SHARE_CARD_H + '"'), "case " + i + ": the size");
}
ok(C.shareWrap("one two three four five six seven", 10, 2).length === 2, "shareWrap does not cut at the line limit");
ok(C.shareWrap("one two three four five six seven", 10, 2)[1].endsWith("\u2026"), "shareWrap does not mark the cut");
ok(C.xmlEscape('a & b < c > "d"') === "a &amp; b &lt; c &gt; &quot;d&quot;", "xmlEscape");
if (problems.length) { console.error("check-share-card: " + problems.length + " problem(s)"); for (const p of problems) console.error("  " + p); process.exit(1); }
console.log("check-share-card: " + cases.length + " cards parse, escape and keep to the card");
