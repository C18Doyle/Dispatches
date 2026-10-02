// Structural content checks for the code-defined-content games (1922, 1940, 1941; 1914 has its own
// validators). Real execution, not text parsing: every reachable node is resolved for real, at several
// meter samples, and every choice is inspected.
//
// Hard problems (fail the check unless listed in the game's allowlist):
//   - a `next` target (choice or roll outcome) that does not resolve to a node (END / END_STUB excepted)
//   - a reachable node whose resolveNode throws or returns nothing
//   - a node with choices where EVERY choice is gated off at every sampled meter state (softlock)
//   - roll outcomes whose weights do not sum to 100, or a non-positive weight
//   - a choice with no label
// Info (reported, never failing): nodes with zero or several `historical: true` choices.
import { existsSync, readFileSync } from "node:fs";

const END = new Set(["END", "END_STUB"]);

export function checkStructure(CAMPAIGNS, { axes, resolveNode, startOf, gated }) {
  const problems = [];
  const info = { campaigns: 0, nodes: 0, choices: 0, noHistorical: [], multiHistorical: [] };
  const zero = Object.fromEntries(axes.map((k) => [k, 0]));
  const samples = [zero, Object.fromEntries(axes.map((k) => [k, 6])), Object.fromEntries(axes.map((k) => [k, -6])), Object.fromEntries(axes.map((k, i) => [k, i % 2 ? 9 : -9]))];
  for (const [cid, camp] of Object.entries(CAMPAIGNS)) {
    info.campaigns++;
    const seen = new Set();
    const queue = [startOf(camp)];
    while (queue.length) {
      const nid = queue.pop();
      if (!nid || END.has(nid) || seen.has(nid)) continue;
      seen.add(nid);
      const stages = [];
      for (const meters of samples) {
        try {
          const st = resolveNode(camp, nid, {}, meters);
          if (st) stages.push({ st, meters });
        } catch (e) {
          problems.push(`${cid}/${nid}: resolveNode throws at meters ${JSON.stringify(meters)}: ${String(e.message).slice(0, 80)}`);
          break;
        }
      }
      if (!stages.length) {
        problems.push(`${cid}/${nid}: node does not resolve`);
        continue;
      }
      info.nodes++;
      const first = stages[0].st;
      const choices = first.choices || [];
      if (first.isEnding || !choices.length) continue;
      const hist = choices.filter((c) => c.historical).length;
      if (hist === 0) info.noHistorical.push(`${cid}/${nid}`);
      else if (hist > 1) info.multiHistorical.push(`${cid}/${nid} (${hist})`);

      // Softlock: some sampled meter state must leave at least one choice open.
      if (gated && !stages.some(({ st, meters }) => (st.choices || []).some((c) => !gated(c, meters)))) problems.push(`${cid}/${nid}: every choice is gated off at every sampled meter state`);

      for (const { st } of stages) {
        for (const ch of st.choices || []) {
          if (ch.next && !END.has(ch.next)) queue.push(ch.next);
          for (const u of ch.uncertain || []) if (u.next && !END.has(u.next)) queue.push(u.next);
        }
      }
      for (const ch of choices) {
        info.choices++;
        if (!ch.label) problems.push(`${cid}/${nid}: a choice has no label`);
        if (!ch.next && !(ch.uncertain || []).some((u) => u.next) && !ch.nextIf) problems.push(`${cid}/${nid}: choice "${String(ch.label).slice(0, 40)}" has no destination`);
        if (ch.uncertain && ch.uncertain.length) {
          const sum = ch.uncertain.reduce((a, u) => a + u.weight, 0);
          if (ch.uncertain.some((u) => !(u.weight > 0))) problems.push(`${cid}/${nid}: roll weight <= 0 in "${String(ch.label).slice(0, 40)}"`);
          if (Math.abs(sum - 100) > 0.5) problems.push(`${cid}/${nid}: roll weights sum to ${sum}, not 100 ("${String(ch.label).slice(0, 40)}")`);
        }
      }
    }
    // Dangling targets are found by resolving every queued target above; anything unresolved is reported there.
  }
  return { problems, info };
}

/** Runs a check and applies the game's allowlist (tests/content-allowlist.json: an array of exact problem strings). */
export function report(name, result, allowlistPath) {
  const allow = new Set(existsSync(allowlistPath) ? JSON.parse(readFileSync(allowlistPath, "utf8")) : []);
  const fresh = result.problems.filter((p) => !allow.has(p));
  const stale = [...allow].filter((a) => !result.problems.includes(a));
  const i = result.info;
  console.log(`${name}: ${i.campaigns} campaigns, ${i.nodes} nodes, ${i.choices} choices; ${result.problems.length} problem(s), ${allow.size} allowlisted.`);
  console.log(`  info: ${i.noHistorical.length} node(s) with no historical choice, ${i.multiHistorical.length} with several.`);
  for (const p of fresh) console.error("  FAIL: " + p);
  for (const s of stale) console.log("  note: allowlisted problem no longer occurs (remove it): " + s);
  return fresh.length;
}
