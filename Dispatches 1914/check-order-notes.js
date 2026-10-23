/** The notes under orders that no adviser argues for (src/47-order-notes.jsx). Every order with no adviser has one, every key names an order, and a note keeps to the
 *  style of the game: one sentence, British spelling, no long dash, no quotation mark. */
const { loadEngine, report, fileArg } = require("./_load.js");
const E = loadEngine(fileArg());
const problems = [];
let checked = 0;
for (const cid of E.CAMPAIGN_IDS) {
  for (const [nodeId, node] of Object.entries(E.CAMPAIGNS[cid].nodes)) {
    for (const ch of node.choices || []) {
      checked++;
      const note = E.orderNote(nodeId, ch.id);
      if (!ch.advisor && !note) problems.push(`${nodeId}|${ch.id}: an order with no adviser and no note`);
      if (ch.advisor && note) problems.push(`${nodeId}|${ch.id}: has an adviser and a note (the note is only for an order with no adviser)`);
    }
  }
}
for (const [key, note] of Object.entries(E.ORDER_NOTES)) {
  checked++;
  const [nodeId, orderId] = key.split("|");
  const f = E.findNode(nodeId);
  if (!f || !(f.node.choices || []).some((c) => c.id === orderId)) problems.push(`${key}: no such order`);
  if (/[—–]/.test(note)) problems.push(`${key}: a long dash`);
  if (/["“”]/.test(note)) problems.push(`${key}: a quotation mark`);
  if (/\b(color|armor|defense|center|honor|labor|gray|realize|organize|neighbor)\b/i.test(note)) problems.push(`${key}: a US spelling`);
  if ((note.match(/[.!?]/g) || []).length !== 1 || !/[.]$/.test(note)) problems.push(`${key}: not one sentence ending in a full stop`);
  if (note.split(/\s+/).length > 32) problems.push(`${key}: over 32 words`);
}
process.exit(report("check-order-notes", problems, checked) ? 1 : 0);
