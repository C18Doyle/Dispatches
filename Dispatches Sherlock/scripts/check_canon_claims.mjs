// Holds the "In the Canon" notes to a register. Every ending that has a note needs at least one claim behind it; every claim has a source and a
// status. Prints the count of claims still resting on the author's memory, which a human reader should check against the public-domain texts.
import { readFileSync } from "node:fs";

const flavor = JSON.parse(readFileSync("src/content/sherlock/flavor.json", "utf8"));
const events = JSON.parse(readFileSync("src/content/sherlock/events.json", "utf8"));
const register = JSON.parse(readFileSync("claims/canon-notes.json", "utf8"));
const STATUS = new Set(["primary", "secondary", "memory", "invented"]);
let failures = 0;
const fail = (m) => {
  failures++;
  console.error("FAIL: " + m);
};

const ids = new Set();
for (const c of register.claims) {
  if (ids.has(c.id)) fail(`duplicate claim id ${c.id}`);
  ids.add(c.id);
  if (!STATUS.has(c.status)) fail(`claim ${c.id} has unknown status ${c.status}`);
  if (!c.source) fail(`claim ${c.id} has no source`);
  if (!c.statement) fail(`claim ${c.id} has no statement`);
  for (const e of c.endings) if (!events.endings[e]) fail(`claim ${c.id} names unknown ending ${e}`);
}
for (const e of Object.keys(flavor.novelNotes ?? {})) {
  if (!register.claims.some((c) => c.endings.includes(e))) fail(`ending ${e} has an In the Canon note but no claim behind it`);
}
const tally = {};
for (const c of register.claims) tally[c.status] = (tally[c.status] ?? 0) + 1;
if (failures) process.exit(1);
console.log(`Canon claims OK: ${register.claims.length} claims (${Object.entries(tally).map(([k, v]) => `${v} ${k}`).join(", ")}). Claims marked "memory" still need a human check against the texts.`);
