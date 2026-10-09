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
import { existsSync, readFileSync, writeFileSync } from "node:fs";

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

/**
 * Orphan check: content that exists, is listed, and can never be reached.
 *
 * Explores every (node, flags) state a player can reach from each campaign's start: at each node it resolves the
 * node under several meter states (gates are ignored, so this over-approximates), takes every choice and every roll
 * outcome, applies the flags they set, and follows `next`, the roll outcome's `next` and every destination
 * `nextIf` can return. Flags are tracked exactly, so combinations such as "chose X then it failed" are found;
 * meters are only sampled (zero, high, low, alternating). A node reported unreachable therefore has no path at all.
 *   - listed in the node atlas (the discovery list) but never reached          -> problem
 *   - reached but missing from the atlas (endings excepted)                    -> problem
 *   - atlas size differs from the game's NODE_TOTAL                            -> problem
 *   - an authored ending (endingsOf: an id, or {id, title} for endings reached through a redirecting node,
 *     matched by the resolved title) that no state reaches                     -> problem
 * `labelOf(camp, flags, meters)` (optional) names the ending of a run that stops at the given state, as a campaign's positionLabel does;
 *   with it the search records every label a run can end with at the meter samples, returned in info.labels[campaign], and `labelsOf(camp, cid)`
 *   (the labels the game promises) turns a promised label no state produces into a problem.
 * `startFlags` lists the flag sets a run can begin with (default one empty set; 1940 passes {} and { hardMode: true }, because
 * hard mode adds nodes only it reaches).
 * Not covered: endings that are labels computed from final state (1940's check-reachability.js plays runs for those).
 * If the exact search hits `maxStates` (many independent flags), that campaign falls back to `walks` seeded random
 * walks, and anything they never visit is reported as "never reached in N random walks" (strong evidence, not proof).
 */
export function checkOrphans(CAMPAIGNS, { axes, resolveNode, startOf, atlasOf, endingsOf, labelOf, labelsOf, nodeTotal, maxStates = 150000, counterClamp = 3, walks = 30000, gated, startFlags = [{}] }) {
  const problems = [];
  const info = { campaigns: 0, reached: 0, atlas: 0, states: 0, truncated: [], walked: [] };
  // Meter states tried at every node: all zero, all high, all low, alternating, and each axis alone at its extremes
  // (so a threshold on one meter is met while the others are neutral).
  const meterSamples = (keys) => {
    const zero = Object.fromEntries(keys.map((k) => [k, 0]));
    const out = [zero, Object.fromEntries(keys.map((k) => [k, 6])), Object.fromEntries(keys.map((k) => [k, -6])), Object.fromEntries(keys.map((k, i) => [k, i % 2 ? 9 : -9]))];
    for (const k of keys) for (const v of [-10, 10]) out.push({ ...zero, [k]: v });
    return out;
  };
  const stable = (o) => JSON.stringify(Object.keys(o).sort().map((k) => [k, o[k]]));
  // Counters (a flag set to its old value + 1) would make the state space unbounded, so numbers are clamped to
  // +-counterClamp; flags that nothing ever reads (found by watching reads in a first pass) are dropped from the state.
  const clampNum = (v) => (typeof v === "number" ? Math.max(-counterClamp, Math.min(counterClamp, v)) : v);
  const project = (f, keep) => {
    const o = {};
    for (const k of Object.keys(f)) if (!keep || keep.has(k)) o[k] = clampNum(f[k]);
    return o;
  };
  const watched = (f, reads) => new Proxy(f, { get: (t, k) => (typeof k === "string" && reads.add(k), t[k]), has: (t, k) => (typeof k === "string" && reads.add(k), k in t) });
  let atlasTotal = 0;
  for (const [cid, camp] of Object.entries(CAMPAIGNS)) {
    const start = startOf(camp);
    if (!start) continue; // a campaign with no content yet
    info.campaigns++;
    const meters = meterSamples(typeof axes === "function" ? axes(camp) : axes);
    const explore = (keep, reads, limit) => {
      const seen = new Set();
      const reached = new Set();
      const endIds = new Set();
      const endTitles = new Set();
      const labels = new Set();
      const stack = startFlags.map((f) => ({ nid: start, flags: project(f, keep) }));
      for (const e of stack) seen.add(start + "|" + stable(e.flags));
      let truncated = false;
      while (stack.length) {
        if (seen.size > limit) {
          truncated = true;
          break;
        }
        const { nid, flags } = stack.pop();
        for (const m of meters) {
          let st;
          try {
            st = resolveNode(camp, nid, reads ? watched(flags, reads) : flags, m);
          } catch {
            continue;
          }
          if (!st) continue;
          reached.add(nid);
          if (st.isEnding || st.ending) {
            endIds.add(nid);
            if (st.title) endTitles.add(st.title);
            continue;
          }
          for (const ch of st.choices || []) {
            for (const u of ch.uncertain && ch.uncertain.length ? ch.uncertain : [null]) {
              const nf = project({ ...flags, ...(ch.setFlags || {}), ...((u && u.setFlags) || {}) }, keep);
              const dests = [(u && u.next) || ch.next];
              if (typeof ch.nextIf === "function") {
                for (const mm of meters) {
                  try {
                    dests.push(ch.nextIf(mm, reads ? watched(nf, reads) : nf));
                  } catch {
                    /* needs state we do not model: that destination stays unknown */
                  }
                }
              }
              for (const d of dests) {
                if (typeof d === "string" && END.has(d) && labelOf) {
                  for (const mm of meters) {
                    try {
                      const lab = labelOf(camp, reads ? watched(nf, reads) : nf, mm);
                      if (lab) labels.add(lab);
                    } catch {
                      /* a label that needs state we do not model */
                    }
                  }
                }
                if (typeof d !== "string" || END.has(d)) continue;
                const key = d + "|" + stable(nf);
                if (seen.has(key)) continue;
                seen.add(key);
                stack.push({ nid: d, flags: nf });
              }
            }
          }
        }
      }
      return { seen, reached, endIds, endTitles, labels, truncated };
    };
    // Fallback when the exact search is too big (many independent flags): seeded random walks. Flags are exact along
    // each walk, meters are random every step. Not a proof: a node no walk visits is reported as "never reached in N walks".
    const walkSearch = () => {
      let seed = 0x9e3779b9;
      const rnd = () => {
        seed = (seed + 0x6d2b79f5) >>> 0;
        let t = seed;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
      const keys = Object.keys(meters[0]);
      // One time in ten an axis is drawn at its extreme (-10 or 10), as the exact search does: a threshold on a clamped
      // meter ("manpower <= -10") is otherwise never met.
      const draw = () => (rnd() < 0.1 ? (rnd() < 0.5 ? -10 : 10) : Math.floor(rnd() * 19) - 9);
      const reached = new Set();
      const endIds = new Set();
      const endTitles = new Set();
      const labels = new Set();
      for (let w = 0; w < walks; w++) {
        let nid = start;
        let flags = { ...startFlags[w % startFlags.length] };
        for (let step = 0; step < 250 && nid; step++) {
          const m = Object.fromEntries(keys.map((k) => [k, draw()]));
          let st;
          try {
            st = resolveNode(camp, nid, flags, m);
          } catch {
            break;
          }
          if (!st) break;
          reached.add(nid);
          if (st.isEnding || st.ending) {
            endIds.add(nid);
            if (st.title) endTitles.add(st.title);
            break;
          }
          const all = st.choices || [];
          const open = gated ? all.filter((c) => !gated(c, m)) : all;
          const pool = open.length ? open : all;
          if (!pool.length) break;
          const ch = pool[Math.floor(rnd() * pool.length)];
          let u = null;
          if (ch.uncertain && ch.uncertain.length) {
            const total = ch.uncertain.reduce((a, x) => a + (x.weight || 0), 0) || 1;
            let r = rnd() * total;
            u = ch.uncertain[ch.uncertain.length - 1];
            for (const x of ch.uncertain) {
              r -= x.weight || 0;
              if (r <= 0) {
                u = x;
                break;
              }
            }
          }
          flags = { ...flags, ...(ch.setFlags || {}), ...((u && u.setFlags) || {}) };
          let dest = (u && u.next) || ch.next;
          if (typeof ch.nextIf === "function") {
            try {
              // The engine evaluates nextIf on the meters AFTER the choice's impact, and the exact search tries every
              // meter value there. Gate and nextIf meters are therefore drawn independently, otherwise a branch whose
              // condition sits just beyond its own gate (1914's "seek terms early") can never be taken by a walk.
              const after = Object.fromEntries(keys.map((k) => [k, draw()]));
              dest = ch.nextIf(after, flags) || dest;
            } catch {
              /* keep the static destination */
            }
          }
          if (labelOf && (typeof dest !== "string" || END.has(dest))) {
            try {
              const lab = labelOf(camp, flags, Object.fromEntries(keys.map((k) => [k, draw()])));
              if (lab) labels.add(lab);
            } catch {
              /* ignore */
            }
          }
          nid = typeof dest === "string" && !END.has(dest) ? dest : null;
        }
      }
      return { reached, endIds, endTitles, labels };
    };
    // Pass 1 (bounded): which flags are ever read? Pass 2: exact search over only those flags.
    const reads = new Set();
    explore(null, reads, 20000);
    const exact = explore(reads, null, maxStates);
    const { seen } = exact;
    let { reached, endIds, endTitles, labels } = exact;
    const how = exact.truncated ? `never reached in ${walks} random walks` : "not reached by any path from the start";
    if (exact.truncated) {
      info.walked.push(cid);
      ({ reached, endIds, endTitles, labels } = walkSearch());
    }
    if (labelOf) (info.labels || (info.labels = {}))[cid] = [...labels];
    for (const t of labelsOf ? labelsOf(camp, cid) : []) if (!labels.has(t)) problems.push(`${cid}: ending title "${t}": ${how}`);
    info.states += seen.size;
    info.reached += reached.size;
    const atlas = atlasOf ? atlasOf(camp, cid) : null;
    if (atlas) {
      info.atlas += atlas.length;
      atlasTotal += atlas.length;
      const listed = new Set(atlas);
      for (const id of atlas) if (!reached.has(id)) problems.push(`${cid}/${id}: listed in the node atlas but ${how}`);
      for (const id of reached) if (!listed.has(id) && !endIds.has(id)) problems.push(`${cid}/${id}: reachable but missing from the node atlas`);
    }
    for (const e of endingsOf ? endingsOf(camp, cid) : []) {
      const id = typeof e === "string" ? e : e.id;
      const title = typeof e === "string" ? null : e.title;
      const ok = title ? endTitles.has(title) || reached.has(id) : reached.has(id);
      if (!ok) problems.push(`${cid}/${id}: authored ending: ${how}`);
    }
  }
  if (nodeTotal !== undefined && nodeTotal !== null && info.atlas && nodeTotal !== atlasTotal) problems.push(`NODE_TOTAL is ${nodeTotal} but the node atlases list ${atlasTotal}`);
  return { problems, info };
}

/** Prints an orphan-check result and applies the game's allowlist (exact problem strings). Returns the number of new problems. */
export function reportOrphans(name, result, allowlistPath) {
  if (process.argv.includes("--record")) {
    // Accept today's findings on purpose (they stay visible in the file; new ones still fail).
    writeFileSync(allowlistPath, JSON.stringify(result.problems.slice().sort(), null, 2) + "\n");
    console.log(`recorded ${result.problems.length} finding(s) in ${allowlistPath}`);
    return 0;
  }
  const allow = new Set(existsSync(allowlistPath) ? JSON.parse(readFileSync(allowlistPath, "utf8")) : []);
  const fresh = result.problems.filter((p) => !allow.has(p));
  const stale = [...allow].filter((a) => !result.problems.includes(a));
  const i = result.info;
  console.log(`${name} orphans: ${i.campaigns} campaigns, ${i.reached} nodes reached from the starts${i.atlas ? `, ${i.atlas} in the atlases` : ""}; ${i.states} states explored${i.walked.length ? ` (exact search too large for ${i.walked.join(", ")}: seeded random walks used there)` : ""}; ${result.problems.length} problem(s), ${allow.size} allowlisted.`);
  for (const p of fresh) console.error("  FAIL: " + p);
  for (const s of stale) console.log("  note: allowlisted problem no longer occurs (remove it): " + s);
  return fresh.length;
}
