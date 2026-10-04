/**
 * Text that renders wrongly. Found by reading the shipped game: seven ending screens showed a literal backslash-n
 * where a paragraph break was meant (a doubled escape in the source). Nothing else caught it, because the text was
 * valid and the build was green.
 *
 * Checks every resolved string of every node (under each flag state a flag is ever given) for:
 *   - a literal backslash followed by n (a doubled newline escape)
 *   - "undefined", "null", "NaN" or "[object" (a missing flag or field interpolated into prose)
 *   - doubled spaces, and leading or trailing spaces on a paragraph
 *   - three or more newlines in a row
 *   - a straight double quote opened and never closed within one string
 */
const { loadEngine, fileArg } = require("./_load.js");
const E = loadEngine(fileArg());

const BS = String.fromCharCode(92);
const LITERAL_NEWLINE = BS + "n";

function collect(node) {
  const out = [];
  const add = (label, v) => { if (typeof v === "string" && v.length) out.push([label, v]); };
  add("title", node.title);
  add("situation", node.situation);
  add("context", node.context);
  add("epilogue", node.epilogue);
  if (node.bulletin && typeof node.bulletin === "object") { add("bulletin", node.bulletin.text); add("bulletin source", node.bulletin.source); }
  for (const ch of node.choices ?? []) {
    add(`choice ${ch.id} label`, ch.label);
    add(`choice ${ch.id} outcome`, ch.outcome);
    if (ch.advisor) add(`choice ${ch.id} advisor`, ch.advisor.position);
    add(`choice ${ch.id} dispute`, ch.dispute);
    for (const b of ch.uncertain ?? []) { add(`choice ${ch.id} roll title`, b.title); add(`choice ${ch.id} roll outcome`, b.outcome); }
  }
  return out;
}

const flagValues = new Map();
for (const { node } of E.allNodes()) {
  for (const ch of node.choices ?? []) {
    for (const sf of [ch.setFlags, ...(ch.uncertain ?? []).map((b) => b.setFlags)]) {
      for (const [k, v] of Object.entries(sf || {})) {
        if (!flagValues.has(k)) flagValues.set(k, new Set());
        flagValues.get(k).add(v);
      }
    }
  }
}
const contexts = [{}];
for (const [k, vals] of flagValues) for (const v of vals) contexts.push({ [k]: v });

const problems = [];
let strings = 0;
const seen = new Set();
for (const { nodeId } of E.allNodes()) {
  for (const flags of contexts) {
    const node = E.resolveNode(nodeId, flags, E.emptyMeters(), E.emptyHardState());
    for (const [label, text] of collect(node)) {
      const key = nodeId + "|" + label + "|" + text;
      if (seen.has(key)) continue;
      seen.add(key);
      strings++;
      const where = `${nodeId} ${label}`;
      if (text.includes(LITERAL_NEWLINE)) problems.push(`${where}: literal backslash-n in the text (a doubled escape: it will show on screen)`);
      const m = /\bundefined\b|\bNaN\b|\[object |\bnull\b/.exec(text);
      if (m) problems.push(`${where}: "${m[0]}" in the text (a missing value was interpolated)`);
      if (/ {2,}/.test(text)) problems.push(`${where}: doubled spaces`);
      if (/\n{3,}/.test(text)) problems.push(`${where}: three or more line breaks in a row`);
      for (const para of text.split("\n")) if (para.length && para !== para.trim()) problems.push(`${where}: a paragraph with leading or trailing space`);
      if ((text.match(/"/g) || []).length % 2 === 1) problems.push(`${where}: an unclosed straight double quote`);
    }
  }
}
const unique = [...new Set(problems)];
console.log(`check-text-integrity: ${E.allNodes().length} nodes, ${strings} strings under ${contexts.length} flag states, ${unique.length} problem${unique.length === 1 ? "" : "s"}`);
for (const p of unique) console.log("  - " + p);
process.exit(unique.length ? 1 : 0);
