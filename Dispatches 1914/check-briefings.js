/** The briefings, the How to play text and the calendar (src/66-briefings.jsx). Every command has a briefing with its parts, the text keeps to the
 *  style of the game (no long dash, no US spelling of the commonest words), the dates come out in the UK form and the Russian command's Old Style
 *  dates are converted. */
const { loadEngine, report, fileArg } = require("./_load.js");
const E = loadEngine(fileArg());
const problems = [];
let checked = 0;
const wc = (s) => String(s || "").trim().split(/\s+/).filter(Boolean).length;
const style = (where, s) => {
  if (/[—–]/.test(s)) problems.push(`${where}: a long dash`);
  if (/\b(color|armor|defense|center|honor|labor|gray|realize|organize|neighbor)\b/i.test(s)) problems.push(`${where}: a US spelling`);
  if (/"/.test(s)) problems.push(`${where}: a quotation mark (advisers and sources are given in indirect speech)`);
};
for (const id of E.CAMPAIGN_IDS) {
  const b = E.BRIEFINGS[id];
  checked++;
  if (!b) { problems.push(`${id}: no briefing`); continue; }
  for (const k of ["nation", "title", "seat"]) if (!b[k] || typeof b[k] !== "string") problems.push(`${id}: no ${k}`);
  if (!b.quote || typeof b.quote.text !== "string" || typeof b.quote.by !== "string") problems.push(`${id}: no quote with text and by`);
  else if (/[—–]/.test(b.quote.text + b.quote.by) || /"/.test(b.quote.text + b.quote.by)) problems.push(`${id}: the quote has a long dash or a quotation mark (they are added on screen)`);
  if (!b.modes || typeof b.modes.easy !== "string" || typeof b.modes.hard !== "string") problems.push(`${id}: no names for the easy and hard files`);
  if (!["central", "entente"].includes(b.side)) problems.push(`${id}: side must be central or entente`);
  if (!Array.isArray(b.standing) || b.standing.length < 2) problems.push(`${id}: standing needs two paragraphs`);
  const all = [b.nation, b.title, b.seat, ...(b.standing || [])];
  all.forEach((s, i) => style(`${id} part ${i}`, s));
  if (wc(b.standing && b.standing.join(" ")) > 150) problems.push(`${id}: the standing text is over 150 words`);
  if (wc(b.seat) > 90) problems.push(`${id}: the seat text is over 90 words`);
}
const ids = new Set();
for (const s of E.HOW_TO) {
  checked++;
  if (ids.has(s.id)) problems.push(`how to: duplicate section ${s.id}`);
  ids.add(s.id);
  [s.title, ...s.paras].forEach((p, i) => style(`how to ${s.id} ${i}`, p));
}
// the calendar
checked += 4;
if (E.ukDate("1914-08-04") !== "4 August 1914") problems.push("ukDate: 1914-08-04 does not read 4 August 1914");
if (E.ukDate("1914-08-04", true) !== "4 Aug 1914") problems.push("ukDate: the short form is wrong");
if (E.ukDate("1914-08") !== "August 1914") problems.push("ukDate: a month alone is wrong");
if (E.nodeDate("stavka", "1914-08-04") !== "17 August 1914") problems.push("nodeDate: the Russian command's 4 August is not 17 August in the West");
// no date in the game is written the American way (June 4, 1944) or with an ordinal (4th June)
checked++;
const src = require("fs").readFileSync(fileArg(), "utf8");
const MONTH = "(January|February|March|April|May|June|July|August|September|October|November|December)";
const us = src.match(new RegExp(MONTH + " [0-9]{1,2}(st|nd|rd|th)?, [0-9]{4}", "g"));
if (us) problems.push("a date written the American way: " + [...new Set(us)].slice(0, 3).join("; "));
const ord = src.match(new RegExp("\b[0-9]{1,2}(st|nd|rd|th) " + MONTH, "g"));
if (ord) problems.push("a date with an ordinal: " + [...new Set(ord)].slice(0, 3).join("; "));
process.exit(report("check-briefings", problems, checked) ? 1 : 0);
