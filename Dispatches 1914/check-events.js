/** Special events (src/67-events.jsx). Each belongs to a command, has a window of dates that holds its anchor report, a condition that is a function of
 *  the state, two short paragraphs in the game's style, and claims in the command's register. Some event must be able to fire in the window, and a
 *  fresh file must not see an event before its window. */
const fs = require("fs");
const path = require("path");
const { loadEngine, report, fileArg } = require("./_load.js");
const E = loadEngine(fileArg());
const problems = [];
let checked = 0;
const wc = (s) => String(s || "").trim().split(/\s+/).filter(Boolean).length;
const claimsOf = (cid) => { try { return JSON.parse(fs.readFileSync(path.join(__dirname, "claims", cid + ".json"), "utf8")); } catch { return []; } };
const ids = new Set();
for (const e of E.EVENTS) {
  checked++;
  const where = `event ${e.id}`;
  if (ids.has(e.id)) problems.push(`${where}: duplicate id`);
  ids.add(e.id);
  if (!/^[a-z]+_[a-z0-9]+$/.test(e.id) || !e.id.startsWith(e.campaign + "_")) problems.push(`${where}: the id must be <command>_<name>`);
  const camp = E.CAMPAIGNS[e.campaign];
  if (!camp) { problems.push(`${where}: no such command`); continue; }
  if (typeof e.when !== "function") problems.push(`${where}: no condition`);
  if (!e.from || !e.to || e.from > e.to) problems.push(`${where}: a bad window`);
  const anchor = camp.nodes[e.anchor];
  if (!anchor) problems.push(`${where}: the anchor report ${e.anchor} does not exist`);
  else if (anchor.date < e.from || anchor.date > e.to) problems.push(`${where}: the anchor ${e.anchor} (${anchor.date}) is outside the window`);
  if (e.date < e.from || e.date > e.to) problems.push(`${where}: its date is outside its window`);
  if (!e.title || !e.kind) problems.push(`${where}: no title or kind`);
  if (!Array.isArray(e.paras) || e.paras.length !== 2) problems.push(`${where}: two paragraphs needed`);
  if (e.paper && (!e.paper.name || !e.paper.place)) problems.push(`${where}: a newspaper event needs a paper name and a place`);
  if (e.paper && !/^Speculative. /.test((e.paras || [])[0] || "")) problems.push(`${where}: a newspaper event is speculative and its first paragraph begins "Speculative."`);
  const text = [e.title, e.kind, ...(e.paras || [])].join(" ");
  if (/[—–]/.test(text)) problems.push(`${where}: a long dash`);
  if (/["“”]/.test(text)) problems.push(`${where}: a quotation mark (events are narrated)`);
  if (/\b(color|armor|defense|center|honor|labor|neighbor)\b/i.test(text)) problems.push(`${where}: a US spelling`);
  if (wc((e.paras || []).join(" ")) > 120) problems.push(`${where}: over 120 words`);
  if (!claimsOf(e.campaign).some((c) => c.id.startsWith(e.id + "-"))) problems.push(`${where}: no claims in claims/${e.campaign}.json (ids ${e.id}-1, ...)`);
  // it can fire: some report in the window, with a state that meets the condition (every meter at its worst, then at its best)
  const worst = { manpower: E.METER_MIN, munitions: E.METER_MIN, will: E.METER_MIN };
  const best = { manpower: E.METER_MAX, munitions: E.METER_MAX, will: E.METER_MAX };
  const inWindow = Object.entries(camp.nodes).filter(([, n]) => !n.ending && n.date >= e.from && n.date <= e.to).map(([id]) => id);
  if (!inWindow.length) problems.push(`${where}: no report falls in its window`);
  else if (![worst, best].some((m) => E.dueEvent(e.campaign, inWindow[0], e.fires || {}, m) !== null)) problems.push(`${where}: it cannot fire on any state`);
  // not before the window, not twice
  const early = Object.entries(camp.nodes).find(([, n]) => !n.ending && n.date < e.from && E.dueEvent(e.campaign, n.id || "", {}, worst) && E.dueEvent(e.campaign, n.id || "", {}, worst).id === e.id);
  if (early) problems.push(`${where}: due before its window`);
  if (inWindow.length && E.dueEvent(e.campaign, inWindow[0], { ["ev_" + e.id]: true }, worst) && E.dueEvent(e.campaign, inWindow[0], { ["ev_" + e.id]: true }, worst).id === e.id) problems.push(`${where}: it can be shown twice`);
}
process.exit(report("check-events", problems, checked) ? 1 : 0);
