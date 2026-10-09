// check-advisor-dates.mjs: a named person shown advising in a node dated after they died, were removed or captured, or before they took the post,
// or shown under a title that was not true in that month. Reads tests/adviser-tenures.json (reviewed table); every named adviser must have an entry,
// so a new adviser cannot be added without someone checking the dates. A node's date is a range (a month, a span of months or a year); only a
// range that lies wholly outside the tenure is reported, so a year-only date never causes a false alarm.
// Usage: node tools/check-advisor-dates.mjs
import { readFileSync, existsSync } from "node:fs";
import { loadGame, parseRange, monthName } from "./audit-lib.mjs";

const table = JSON.parse(readFileSync("tests/adviser-tenures.json", "utf8"));
const allow = existsSync("tests/audit-allowlist.json") ? JSON.parse(readFileSync("tests/audit-allowlist.json", "utf8")).adviserDates || [] : [];
const ym = (s) => {
  const [y, m] = s.split("-").map(Number);
  return y * 12 + (m - 1);
};
const game = await loadGame();
const found = [];
let checked = 0;
const names = new Set();
for (const [cid, camp] of Object.entries(game.CAMPAIGNS)) {
  for (const a of game.NODE_ATLAS[cid] || []) {
    const seenHere = new Set();
    // resolve under several meter states and flag sets so conditional advisers (behind a meter gate or a flag) are seen too
    for (const m of [0, 5, -5]) {
      for (const flags of [{}, { hardMode: true }]) {
        let st;
        try {
          st = camp.resolveNode(a.id, flags, { readiness: m, pipeline: m, initiative: m });
        } catch {
          continue;
        }
        if (!st) continue;
        const r = parseRange(st.date);
        for (const c of st.choices || []) {
          for (const who of [c.advisor && c.advisor.name, c.attested && c.attested.by]) {
            if (!who || seenHere.has(who + c.label)) continue;
            seenHere.add(who + c.label);
            names.add(who);
            if (table.anonymous.includes(who)) continue;
            const t = table.tenures[who];
            const where = `${cid}/${a.id} (${st.date})`;
            if (!t) {
              found.push(`NO_TENURE ${who}: no entry in tests/adviser-tenures.json (${where})`);
              continue;
            }
            checked++;
            if (!r) {
              found.push(`NO_DATE ${who}: node date has no year (${where})`);
              continue;
            }
            if (t.until && r.start > ym(t.until)) found.push(`SPEAKS_AFTER_FATE ${who}: ${where} is after ${monthName(ym(t.until))} (${t.note || ""})`);
            if (t.from && r.end < ym(t.from)) found.push(`SPEAKS_BEFORE_POST ${who}: ${where} is before ${monthName(ym(t.from))}`);
            const title = game.ADVISOR_TITLE[who];
            if (title && t.titlePeriods && t.titlePeriods.length) {
              const ok = t.titlePeriods.some(([f, u]) => r.start <= ym(u) && r.end >= ym(f));
              if (!ok) found.push(`TITLE ${who}: shown as "${title}" in ${where}, but the post was held ${t.titlePeriods.map((p) => p.join(" to ")).join("; ")}${t.note ? " (" + t.note + ")" : ""}`);
            }
          }
        }
      }
    }
  }
}
const unique = [...new Set(found)];
const fresh = unique.filter((f) => !allow.includes(f));
const stale = allow.filter((f) => !unique.includes(f));
console.log(`Adviser dates: ${names.size} named advisers, ${checked} appearances checked against ${Object.keys(table.tenures).length} reviewed tenures; ${unique.length} finding(s), ${allow.length} allowlisted.`);
for (const s of stale) console.log("  note: allowlisted finding no longer occurs (remove it): " + s);
if (fresh.length) {
  console.log(fresh.map((f) => "  " + f).join("\n"));
  process.exit(1);
}
console.log("Adviser dates check passed.");
