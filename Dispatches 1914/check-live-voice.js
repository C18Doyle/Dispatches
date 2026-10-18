/** The live voice. A report, an order's outcome, a bulletin, an event or a newspaper is written from inside the war room, on the day: it does not look back at the
 *  record, name historians, say what a person will remember or learn, or wonder what would have happened. Hindsight has its own places, which are exempt: the epilogue
 *  ("What actually happened"), an adviser's dossier (bio and fate), the after-action line of a battle (real) and the notes of src/44-risks.jsx that only the
 *  validators read (DISPUTES and each order's dispute). Each flagged sentence is printed with its file and line.
 *  Also holds the text to a few lengths: a menu quotation, a briefing's seat and a note under an order stay short (a situation is as long as it needs to be). */
const fs = require("fs");
const path = require("path");
const { report } = require("./_load.js");

const FILES = [
  "30-campaign-ohl.jsx", "31-campaign-gqg.jsx", "32-campaign-stavka.jsx", "33-campaign-bef.jsx", "34-campaign-aok.jsx", "35-campaign-otto.jsx",
  "44-risks.jsx", "45-more-endings.jsx", "62-battles.jsx", "66-briefings.jsx", "67-events.jsx", "70-newspapers.jsx",
];
const EXEMPT_KEYS = new Set(["epilogue", "bio", "fate", "real", "context", "dossier", "label", "dispute"]);
const HINDSIGHT = [
  [/\bhistorians?\b/i, "names historians"],
  [/\bafterwards?\b/i, "says afterwards"],
  [/\bas it was (always )?going to\b/i, "says what was always going to happen"],
  [/\bwould later\b/i, "says what would happen later"],
  [/\byears? later\b/i, "says years later"],
  [/\bas it turned out\b/i, "says how it turned out"],
  [/\bwas to (become|prove|remain)\b/i, "says what someone was to become"],
  [/\b(no one|nobody) (will|would|can|could) (ever )?(know|say|be able)\b/i, "says no one will ever know"],
  [/\bwill (never )?(remember|be remembered)\b/i, "says what will be remembered"],
  [/\b(does|do|will|would) not learn\b/i, "says what the army does not learn"],
  [/\bthe war goes into\b/i, "says how long the war will go on"],
  [/\bwhether .{0,70}\b(could|would|might) have\b/i, "wonders what would have happened"],
  [/\bonly the .{1,50} (could|can) (answer|settle|say|decide)\b/i, "leaves the question to the future"],
  [/\b(it )?will last (four|three|two|another|for)\b|\bthe war that follows\b|\blasts? to the end of the war\b|\bsets? back .{0,50} until\b/i, "says how long something will last"],
  [/\bpostwar\b|\bin retrospect\b|\bwith hindsight\b|\bin the long run\b/i, "looks back"],
];
const KEY = /\b(dispute|situation|outcome|epilogue|bio|fate|real|context|aftermath|bulletin|dossier|position|label|headline|title|note|paras|desc|description|def|quote|text)\s*:/g;

const problems = [];
const dump = [];
let checked = 0;
const ROOT = __dirname;
for (const f of FILES) {
  const src = fs.readFileSync(path.join(ROOT, "src", f), "utf8");
  // a string literal's text, from its opening quote on, as one run of the file: strip the concatenation so that a sentence broken across lines is found
  const blank = (t) => t.replace(/[^\n]/g, " "); // a comment becomes blanks of the same length, so that line numbers still count
  const flat = src.replace(/\/\*[\s\S]*?\*\//g, blank).replace(/^\s*\/\/.*$/gm, blank).replace(/"\s*\+\s*\n\s*"/g, "").replace(/`\s*\+\s*\n\s*`/g, "");
  const disputesAt = flat.indexOf("const DISPUTES = {");
  const keyAt = (idx) => {
    let last = null;
    KEY.lastIndex = 0;
    let m;
    while ((m = KEY.exec(flat)) && m.index < idx) last = m[1];
    return last;
  };
  for (const [re, why] of HINDSIGHT) {
    const g = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
    let m;
    while ((m = g.exec(flat))) {
      checked++;
      if (disputesAt >= 0 && m.index > disputesAt) continue;
      const key = keyAt(m.index);
      if (key && EXEMPT_KEYS.has(key)) continue;
      const line = flat.slice(0, m.index).split("\n").length;
      // the sentence: from the stop, line break (a literal backslash n) or quote before the match to its own full stop
      const before = Math.max(flat.lastIndexOf(". ", m.index) + 2, flat.lastIndexOf("? ", m.index) + 2, flat.lastIndexOf("\\n", m.index) + 2, flat.lastIndexOf('"', m.index) + 1);
      const ends = [flat.indexOf(". ", m.index), flat.indexOf('."', m.index), flat.indexOf("\\n", m.index), flat.indexOf("? ", m.index)].filter((i) => i >= 0);
      const stop = ends.length ? Math.min(...ends) : before + 140;
      const sentence = flat.slice(before, flat[stop] === "." || flat[stop] === "?" ? stop + 1 : stop);
      dump.push({ file: f, line, why, key: key || "?", sentence });
      problems.push(`${f}:${line}: ${why} (${key || "?"}): ${sentence.replace(/\s+/g, " ").slice(0, 170)}`);
    }
  }
}
// the lengths that keep the front screens short
const E = require("./_load.js").loadEngine(process.argv[2] || "dispatches-greatwar.jsx");
const wc = (s) => String(s || "").trim().split(/\s+/).filter(Boolean).length;
for (const id of E.CAMPAIGN_IDS) {
  checked += 3;
  const b = E.BRIEFINGS[id];
  if (wc(b.quote.text) > 24) problems.push(`${id}: the menu quotation is over 24 words`);
  if (wc(b.seat) > 75) problems.push(`${id}: the seat text is over 75 words`);
  for (const [k, n] of Object.entries(E.ORDER_NOTES)) if (k.startsWith(id + "_") && wc(n) > 26) problems.push(`${k}: the note under the order is over 26 words`);
}
if (process.env.LIVE_VOICE_JSON) fs.writeFileSync(process.env.LIVE_VOICE_JSON, JSON.stringify(dump, null, 1));
process.exit(report("check-live-voice", problems, checked) ? 1 : 0);
