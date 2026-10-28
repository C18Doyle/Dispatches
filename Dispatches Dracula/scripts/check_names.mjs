// check_names.mjs: one name for one person. src/content/<seat>/names.json lists phrases that mean a particular person only in particular scenes (in the Count's text "the old man"
// is Mr Swales on the Whitby bench, and nobody else), and this fails when a phrase turns up anywhere it is not allowed. It reads every string in events.json and flavor.json.
//   node scripts/check_names.mjs            (GAME=<seat> picks the seat)
// names.json: { "rules": [ { "phrase": "the old man", "means": "Mr Swales", "allowedIn": ["10", "10-X", "11"], "instead": "the Professor" } ] }
// `allowedIn` names scenes by id; a phrase is also allowed in strings that are not in a scene when "allowedIn" contains "*other".
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const dir = join("src", "content", process.env.GAME ?? "dracula");
const file = join(dir, "names.json");
const rules = existsSync(file) ? JSON.parse(readFileSync(file, "utf8")).rules ?? [] : [];
const events = JSON.parse(readFileSync(join(dir, "events.json"), "utf8"));
const flavor = JSON.parse(readFileSync(join(dir, "flavor.json"), "utf8"));

const hits = []; // { scene, where, text }
const walk = (v, scene, where) => {
  if (typeof v === "string") hits.push({ scene, where, text: v });
  else if (Array.isArray(v)) v.forEach((x, i) => walk(x, scene, `${where}[${i}]`));
  else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) walk(x, scene, `${where}.${k}`);
};
for (const n of Object.values(events.nodes)) walk(n, n.id, `scene ${n.id}`);
for (const e of Object.values(events.endings)) walk(e, "*other", `ending ${e.id}`);
for (const i of Object.values(events.interludes)) walk(i, "*other", `document ${i.id}`);
for (const [k, v] of Object.entries(flavor)) {
  if (k === "flagNotes") for (const [flag, note] of Object.entries(v)) walk(note, `flagNote:${flag}`, `flag note ${flag}`);
  else walk(v, "*other", `flavor.${k}`);
}

let failures = 0;
for (const r of rules) {
  const re = new RegExp(r.phrase, "gi");
  for (const h of hits) {
    if (!re.test(h.text)) continue;
    re.lastIndex = 0;
    if (r.allowedIn.includes(h.scene)) continue;
    failures++;
    console.error(`FAIL "${r.phrase}" (it means ${r.means}) in ${h.where}: ...${h.text.slice(Math.max(0, h.text.search(re) - 25), h.text.search(re) + 60).replace(/\s+/g, " ")}... Use: ${r.instead}`);
    re.lastIndex = 0;
  }
}
if (failures) {
  console.error(`\n${failures} name(s) in the wrong place. Fix the text, or the rule in ${file} if the person really is meant.`);
  process.exit(1);
}
console.log(`Names check passed (${rules.length} rule${rules.length === 1 ? "" : "s"}).`);
