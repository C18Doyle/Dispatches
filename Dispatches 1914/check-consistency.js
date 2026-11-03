/** The game written one way. Names keep their accents (a list of the plain-ASCII spellings that must not come back), the ways out of a screen are Menu, Back and Close, and
 *  the interface's font sizes are the sizes of one scale, and long prose does not close on a tidy line. */
const fs = require("fs");
const path = require("path");
const { report, loadEngine } = require("./_load.js");
const problems = [];
let checked = 0;
const dir = path.join(__dirname, "src");
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".jsx"));
const BANNED_NAMES = [
  ["Petain", "Pétain"], ["Poincare", "Poincaré"], ["Painleve", "Painlevé"], ["Duchene", "Duchêne"], ["Hotzendorf", "Hötzendorf"], ["d'Esperey", "d'Espèrey"],
  ["Przemysl", "Przemyśl"], ["Sarikamis", "Sarıkamış"], ["Koprukoy", "Köprüköy"], ["Boroevic", "Boroević"], ["Compiegne", "Compiègne"],
  ["Lodz", "Łódź"], ["Krasnik", "Kraśnik"], ["Tarnow", "Tarnów"],
];
const BANNED_NAV = ["Home", "Return to file", "Back to the commands", "Back to the order", "Close the map"];
const SCALE = new Set([10, 11, 12, 13, 14, 16, 20, 24, 28, 32, 40, 48]);
const lineOf = (s, i) => s.slice(0, i).split("\n").length;
for (const f of files) {
  const s = fs.readFileSync(path.join(dir, f), "utf8");
  for (const [bad, good] of BANNED_NAMES) {
    checked++;
    const m = new RegExp("(?<![A-Za-z_])" + bad + "(?![a-z])").exec(s);
    if (m) problems.push(`${f}:${lineOf(s, m.index)}: "${bad}" should be "${good}"`);
  }
  if (/^9[0-9]-/.test(f)) {
    for (const nav of BANNED_NAV) {
      checked++;
      const m = new RegExp(">" + nav + "<").exec(s);
      if (m) problems.push(`${f}:${lineOf(s, m.index)}: a button called "${nav}" (the ways out are Menu, Back and Close)`);
    }
  }
  if (f === "90-ui.jsx" || f === "63-themes.jsx") {
    for (const m of s.matchAll(/font-size:([0-9.]+)px/g)) {
      checked++;
      if (!SCALE.has(Number(m[1]))) problems.push(`${f}:${lineOf(s, m.index)}: font-size ${m[1]}px is not on the scale (${[...SCALE].join(", ")})`);
    }
  }
}

// Long prose does not close on a tidy line: a paragraph of two or more sentences may not end on a short sentence that names nothing (no name, no figure, no place).
const E = loadEngine(path.join(__dirname, "dispatches-greatwar.jsx"));
const sentences = (p) => p.trim().split(/(?<=[.!?])\s+(?=[A-Z])/);
function closer(where, text) {
  if (typeof text !== "string") return;
  for (const para of text.split(/\n\n+/)) {
    if (/\n/.test(para)) continue; // a list of lines, not a paragraph
    const ss = sentences(para);
    if (ss.length < 2) continue;
    const last = ss[ss.length - 1];
    checked++;
    if (last.split(/\s+/).length <= 9 && !/[A-Z0-9]/.test(last.slice(1))) problems.push(`${where}: closes on "${last}"`);
  }
}
for (const cid of E.CAMPAIGN_IDS) {
  for (const [id, n] of Object.entries(E.CAMPAIGNS[cid].nodes)) {
    if (n.ending) closer(id, E.resolveNode(id, {}, E.emptyMeters(), E.emptyHardState()).epilogue);
  }
}
for (const h of E.HOW_TO) for (const p of h.paras) closer("HOW_TO/" + h.id, p);
for (const p of E.LEAVES_OUT) closer("LEAVES_OUT", p);
process.exit(report("check-consistency", problems, checked) ? 1 : 0);
