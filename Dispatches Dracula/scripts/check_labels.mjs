// check_labels.mjs: the screens carry no words of their own. Every heading, button and note comes from src/labels.json (shared) or a seat's ui.json / flavor.json, so one copy deck
// holds the wording and one capitalisation style (Title Case for headings and buttons, sentence case for notes). This fails when a screen file has words typed into its JSX
// (text between tags, or a label, title, placeholder or alt attribute), or when a label in labels.json has a `{hole}` that its users do not fill.
import { readFileSync } from "node:fs";
import ts from "typescript";

const FILES = ["src/App.tsx", "src/RouteMap.tsx"];
const PROPS = new Set(["aria-label", "title", "placeholder", "alt", "aria-description"]);
let failures = 0;

for (const file of FILES) {
  const sf = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const line = (n) => sf.getLineAndCharacterOfPosition(n.getStart()).line + 1;
  const visit = (n) => {
    if (n.kind === ts.SyntaxKind.JsxText) {
      const t = n.getText().replace(/\s+/g, " ").trim();
      // symbols and punctuation between tags are fine; words are not
      if (/[A-Za-z]{2}/.test(t)) {
        console.error(`${file}:${line(n)}: words typed into the screen: "${t.slice(0, 60)}"`);
        failures++;
      }
    } else if (n.kind === ts.SyntaxKind.JsxAttribute && n.initializer?.kind === ts.SyntaxKind.StringLiteral && PROPS.has(n.name.getText())) {
      console.error(`${file}:${line(n)}: ${n.name.getText()} typed into the screen: "${n.initializer.text}"`);
      failures++;
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);
}

const labels = JSON.parse(readFileSync("src/labels.json", "utf8"));
const source = FILES.map((f) => readFileSync(f, "utf8")).join("\n");
for (const [key, value] of Object.entries(labels)) {
  if (typeof value === "string" && !new RegExp(`\\bL\\.${key}\\b`).test(source)) {
    console.error(`labels.json: "${key}" is not used by any screen`);
    failures++;
  }
}

if (failures) {
  console.error(`\nFAIL: ${failures} problem(s). Put the words in src/labels.json and read them with L.<key>.`);
  process.exit(1);
}
console.log(`Labels check passed (${Object.keys(labels).length} labels, no words typed into ${FILES.join(" or ")}).`);
