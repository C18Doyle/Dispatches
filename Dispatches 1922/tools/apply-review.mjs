#!/usr/bin/env node
// Applies a review file saved from claims/review.html to the record.
//
//   node tools/apply-review.mjs review-<name>-<date>.json [--dry]
//
// For each statement the reviewer answered:
//   Confirmed    status becomes "independent" (checked by someone other than the author); the reviewer's source is added to claims/sources.json
//                and to the claim, and the note records who checked and when.
//   Wrong        status becomes "disputed" and the note keeps what the reviewer said is right: the text of the report must then be fixed by hand.
//   Needs source the status is kept and the note records that a reviewer could not find one.
// Unknown ids, a missing reviewer name or a "Confirmed" without a source are refused. Nothing is applied if anything is refused.
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const file = process.argv[2];
const dry = process.argv.includes("--dry");
if (!file || !existsSync(file)) {
  console.error("usage: node tools/apply-review.mjs <review file> [--dry]");
  process.exit(2);
}
const review = JSON.parse(readFileSync(file, "utf8"));
const CAMPAIGNS = ["southRussia", "siberia", "bolsheviks", "provisionalGov17"];
const files = Object.fromEntries(CAMPAIGNS.map((c) => [c, JSON.parse(readFileSync(`claims/${c}.json`, "utf8"))]));
const sources = JSON.parse(readFileSync("claims/sources.json", "utf8"));
const byId = new Map();
for (const list of Object.values(files)) for (const c of list) byId.set(c.id, c);

const problems = [];
if (!review.reviewer || !String(review.reviewer).trim()) problems.push("the review has no reviewer's name");
const date = review.date || new Date().toISOString().slice(0, 10);
const plan = [];
let srcN = Object.keys(sources).filter((k) => k.startsWith("rev-")).length;
for (const r of review.claims || []) {
  const c = byId.get(r.id);
  if (!c) { problems.push(`unknown claim ${r.id}`); continue; }
  if (r.verdict === "confirmed" && !String(r.text || "").trim()) { problems.push(`${r.id}: confirmed without a source`); continue; }
  plan.push(r);
}
if (problems.length) {
  console.error("refused:\n  " + problems.join("\n  "));
  process.exit(1);
}
const urlOf = (t) => (String(t).match(/https?:\/\/\S+/) || [""])[0];
const changes = { independent: 0, disputed: 0, needs: 0 };
for (const r of plan) {
  const c = byId.get(r.id);
  const by = `Reviewed by ${review.reviewer} on ${date}`;
  if (r.verdict === "confirmed") {
    srcN += 1;
    const sid = `rev-${srcN}`;
    sources[sid] = { title: String(r.text).trim().slice(0, 200), kind: "reviewer's source", url: urlOf(r.text), read: "reviewer" };
    c.sources = [...(c.sources || []), sid];
    c.status = "independent";
    c.note = [c.note, `${by}: confirmed.`].filter(Boolean).join(" ");
    changes.independent++;
  } else if (r.verdict === "wrong") {
    c.status = "disputed";
    c.note = [c.note, `${by}: WRONG. ${String(r.text || "").trim()}`].filter(Boolean).join(" ");
    changes.disputed++;
  } else if (r.verdict === "needs") {
    c.note = [c.note, `${by}: no source found. ${String(r.text || "").trim()}`].filter(Boolean).join(" ");
    changes.needs++;
  }
}
console.log(`review by ${review.reviewer}, ${date}: ${changes.independent} confirmed (now independent), ${changes.disputed} wrong (now disputed; the report must be fixed by hand), ${changes.needs} without a source.`);
if (dry) {
  console.log("(dry run: nothing written)");
  process.exit(0);
}
for (const [cid, list] of Object.entries(files)) writeFileSync(`claims/${cid}.json`, JSON.stringify(list, null, 1) + "\n");
writeFileSync("claims/sources.json", JSON.stringify(sources, null, 2) + "\n");
console.log("written. Run: npm run check:claims, then node tools/claims-review.mjs to refresh claims/review.html.");
