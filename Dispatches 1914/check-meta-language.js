/** Fourth-wall language and prose tics. Spec §8. Case-insensitive: the 1922
 *  first pass missed every capitalised sentence-start. */
const fs = require("fs");
const { fileArg } = require("./_load.js");

const META = ["this campaign", "this run", "the player", "this telling", "playthrough"];
const TICS = ["genuinely", "for once", "the question is", "historians of this counterfactual",
              "a reasoned projection of"];

const src = fs.readFileSync(fileArg(), "utf8").split("\n");
const problems = [];
src.forEach((line, i) => {
  if (/^\s*(\/\/|\*|\/\*)/.test(line)) return; // comments exempt
  const l = line.toLowerCase();
  for (const m of META) if (l.includes(m)) problems.push(`line ${i + 1}: meta-language "${m}"`);
  for (const t of TICS) if (l.includes(t)) problems.push(`line ${i + 1}: blocklisted tic "${t}"`);
});
console.log(`check-meta-language: ${src.length} lines checked, ${problems.length} problems`);
for (const p of problems) console.log(`  - ${p}`);
process.exit(problems.length ? 1 : 0);
