// check-events.mjs: the state-driven special events (STATE_EVENTS in src/parts/20-registries-and-gallery.jsx, rule in src/logic.ts).
// Each belongs to a command, has a window of months that holds its anchor report, a condition that is a function of the file's flags and meters,
// two short paragraphs in the game's plain style, and claims in claims/events-round1.json under its id. Some state must make it due in the
// window, it must not be due before or after the window, and it must not come twice. Run: npm run check-events
import { readFileSync } from "node:fs";
import { loadGame } from "./audit-lib.mjs";

const game = await loadGame();
const { logic } = game;
const events = game.STATE_EVENTS || [];
const problems = [];
let checked = 0;
const words = (s) => String(s || "").trim().split(/\s+/).filter(Boolean).length;
const claims = JSON.parse(readFileSync(new URL("../claims/events-round1.json", import.meta.url), "utf8"));
const ids = new Set();
const month = (ym, d) => {
  const [y, m] = ym.split("-").map(Number);
  const t = y * 12 + (m - 1) + d;
  return `${Math.floor(t / 12)}-${String((t % 12) + 1).padStart(2, "0")}`;
};
const levels = [-10, -4, -2, 0, 2, 4, 10];
const states = [];
for (const readiness of levels) for (const pipeline of levels) for (const initiative of levels) states.push({ readiness, pipeline, initiative });

for (const e of events) {
  checked++;
  const where = `event ${e.id}`;
  if (ids.has(e.id)) problems.push(`${where}: duplicate id`);
  ids.add(e.id);
  const camp = game.CAMPAIGNS[e.campaign];
  if (!camp) {
    problems.push(`${where}: no such command "${e.campaign}"`);
    continue;
  }
  const prefix = e.campaign === "japan" ? "japan_" : "allied_";
  if (!e.id.startsWith(prefix)) problems.push(`${where}: the id must start with ${prefix}`);
  if (typeof e.when !== "function") problems.push(`${where}: no condition`);
  if (!/^\d{4}-\d{2}$/.test(e.from) || !/^\d{4}-\d{2}$/.test(e.to) || e.from > e.to) problems.push(`${where}: a bad window (${e.from} to ${e.to})`);
  if (!e.title || !e.kind || !e.date) problems.push(`${where}: no title, kind or date`);
  if (!Array.isArray(e.paras) || e.paras.length !== 2) problems.push(`${where}: two paragraphs needed`);
  const text = [e.title, e.kind, ...(e.paras || [])].join(" ");
  if (/[—]/.test(text)) problems.push(`${where}: an em dash (docs/WRITING.md)`);
  if (/["“”]/.test(text)) problems.push(`${where}: a quotation mark (events are narrated, not spoken)`);
  if (words((e.paras || []).join(" ")) > 120) problems.push(`${where}: over 120 words`);
  if ((e.paras || []).some((p) => words(p) > 70)) problems.push(`${where}: a paragraph over 70 words`);

  // the anchor falls in the window, by the atlas and by the report itself
  const atlas = (game.NODE_ATLAS[e.campaign] || []).find((n) => n.id === e.anchor);
  if (!atlas) problems.push(`${where}: the anchor ${e.anchor} is not in the atlas`);
  else {
    const start = logic.reportStartMonth(atlas.date);
    if (!start || start < e.from || start > e.to) problems.push(`${where}: the anchor ${e.anchor} (${atlas.date}) starts outside the window`);
    let stage = null;
    try {
      stage = camp.resolveNode(e.anchor, logic.startFlags("open"), { ...logic.EMPTY_METERS });
    } catch (err) {
      problems.push(`${where}: the anchor does not resolve: ${err.message}`);
    }
    if (stage && stage.date !== atlas.date) problems.push(`${where}: the anchor's date "${stage.date}" differs from the atlas "${atlas.date}"`);
  }

  // claims
  if (!claims.some((c) => c.node === e.id)) problems.push(`${where}: no claims in claims/events-round1.json`);

  // it can be due: some state, on the anchor's own date, makes it due when it is the only event
  const flags = logic.startFlags("open");
  const dueAt = (date, f, m) => logic.dueStateEvent({ campaignId: e.campaign, events: [e], nextDate: date, flags: f, meters: m });
  const anchorDate = atlas && atlas.date;
  if (anchorDate && !states.some((m) => dueAt(anchorDate, flags, m))) problems.push(`${where}: no state makes it due on ${anchorDate}`);
  // not outside the window, not twice
  const before = `JANUARY ${month(e.from, -1).slice(0, 4)}`;
  const monthName = (ym) => ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"][Number(ym.slice(5)) - 1] + " " + ym.slice(0, 4);
  if (states.some((m) => dueAt(monthName(month(e.from, -1)), flags, m))) problems.push(`${where}: due the month before its window`);
  if (states.some((m) => dueAt(monthName(month(e.to, 1)), flags, m))) problems.push(`${where}: due the month after its window`);
  if (anchorDate && states.some((m) => dueAt(anchorDate, { ...flags, ["ev_" + e.id]: true }, m))) problems.push(`${where}: due again after it was shown`);
  void before;
}
// the list is a precedence order; two events that share an anchor would starve each other
const byAnchor = {};
for (const e of events) (byAnchor[e.anchor] = byAnchor[e.anchor] || []).push(e.id);
for (const [a, list] of Object.entries(byAnchor)) if (list.length > 1) console.log(`note: ${list.join(", ")} share the anchor ${a}; the later one waits for another report in its window`);

console.log(`events: ${events.length} state-driven events, ${checked} checked; ${problems.length} problem(s)`);
for (const p of problems) console.log("  " + p);
process.exit(problems.length ? 1 : 0);
