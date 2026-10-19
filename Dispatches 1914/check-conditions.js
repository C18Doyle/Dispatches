/** The conditions of a report (src/48-conditions.jsx), the beliefs' sources and the orders an ally would object to. The tables are whole: every command has an age of news
 *  for each period and twelve months of weather; each bombardment names a report that exists and a source; every belief names the evidence it rests on; and an order
 *  tagged with an ally names a real order in a real report. Text keeps to the style of the game (no long dash, no US spelling). */
const { loadEngine, report, fileArg } = require("./_load.js");
const E = loadEngine(fileArg());
const problems = [];
let checked = 0;
const style = (where, s) => {
  checked++;
  if (/[—–]/.test(s)) problems.push(`${where}: a long dash`);
  if (/\b(color|armor|defense|center|honor|labor|gray|realize|organize|neighbor)\b/i.test(s)) problems.push(`${where}: a US spelling`);
  if (/"/.test(s)) problems.push(`${where}: a quotation mark`);
};
for (const cid of E.CAMPAIGN_IDS) {
  checked += 2;
  if (!E.COMMS[cid] || !E.COMMS[cid].length) problems.push(`${cid}: no age of news in COMMS`);
  else if (E.COMMS[cid][0][0] > 1914) problems.push(`${cid}: COMMS must start in 1914`);
  if (!E.WEATHER[cid] || E.WEATHER[cid].length !== 12) problems.push(`${cid}: WEATHER needs twelve months`);
  else E.WEATHER[cid].forEach((w, i) => style(`${cid} weather month ${i + 1}`, w));
  for (const y of [1914, 1915, 1916, 1917, 1918]) {
    const a = E.reportAge(cid, y + "-06-15", {});
    const b = E.reportAge(cid, y + "-06-15", { sig_clear: true });
    if (!(a.hours > 0) || !(b.hours < a.hours)) problems.push(`${cid} ${y}: signals in the clear must bring the news sooner (${a.hours} against ${b.hours})`);
  }
}
for (const [nodeId, b] of Object.entries(E.BOMBARDMENTS)) {
  const f = E.findNode(nodeId);
  if (!f) problems.push(`${nodeId}: no such report`);
  if (!b.text || !b.source) problems.push(`${nodeId}: a bombardment needs its text and its source`);
  style(nodeId + " bombardment", b.text || "");
}
for (const [nodeId, items] of Object.entries(E.INTEL_ITEMS)) {
  for (const it of items) {
    checked++;
    if (!it.source || typeof it.source !== "string") problems.push(`${nodeId}/${it.id}: a belief must name the evidence it rests on (source)`);
    else style(`${nodeId}/${it.id} source`, it.source);
  }
}
let allies = 0;
for (const cid of E.CAMPAIGN_IDS) {
  for (const [nodeId, node] of Object.entries(E.CAMPAIGNS[cid].nodes)) {
    for (const ch of node.choices || []) {
      if (!ch.ally) continue;
      allies++;
      style(`${nodeId}|${ch.id} ally`, ch.ally);
      if (E.erosionFromChoice(cid, ch) < 1) problems.push(`${nodeId}|${ch.id}: an order an ally would object to must cost standing in Hard mode`);
    }
  }
}
if (allies < 6) problems.push(`only ${allies} orders name an ally (expected at least 6)`);
process.exit(report("check-conditions", problems, checked) ? 1 : 0);
