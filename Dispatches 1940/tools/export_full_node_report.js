#!/usr/bin/env node
/*
 * export_full_node_report.js
 *
 * One-off export for Craig: every node across all four campaigns, its situation text, every
 * choice's label/outcome text/next-node link (including uncertain[] branches), and each
 * choice/branch's Manpower/Fuel/Initiative ("logistics triangle") deltas — as a flat row list,
 * ready to render into a table.
 *
 * Reuses extract_campaigns.js's own transpile approach (esbuild, JSX stripped only, react/tone
 * stubbed) since CAMPAIGNS' node getters call module-scope helpers that plain require() can't
 * see through a .jsx file.
 *
 * Node-id enumeration deliberately does NOT use NODE_ATLAS: that table turned out to hold only
 * 205 entries (86/44/43/32 per campaign) against NODE_TOTAL's documented 250 (99/49/51/51,
 * "counted from the CAMPAIGNS getters, not estimated") — NODE_ATLAS is a curated subset (the
 * legacy schematic map's own node list), not a complete node index, and using it here would have
 * silently dropped 45 real nodes from this export. Instead this scans each CAMPAIGNS.<key> block
 * for every `get <nodeId>() {` getter directly (the same method the project's own campaign-
 * boundary verification already uses elsewhere), which reproduces NODE_TOTAL's 99/49/51/51
 * exactly.
 *
 * Usage: node export_full_node_report.js [path/to/App.jsx] [path/to/output.json]
 */
const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");

const SRC = process.argv[2] || "../src/App.jsx";
const OUT = process.argv[3] || path.join(__dirname, "full_node_report.json");

const src = fs.readFileSync(SRC, "utf8");
if (!src.includes("const CAMPAIGNS = {")) {
  console.error('Could not find "const CAMPAIGNS = {" in ' + SRC);
  process.exit(2);
}
const stripped = src.replace(/^import\s.*$/gm, "");
const { code } = esbuild.transformSync(stripped, {
  loader: "jsx",
  jsx: "transform",
  jsxFactory: "React.createElement",
  jsxFragment: "React.Fragment",
  format: "cjs",
  target: "node18",
});

const wrapped =
  `class StubComponent {};\n` +
  `const React = { createElement: () => null, Fragment: Symbol("Fragment"), useState: () => [undefined, () => {}], useEffect: () => {}, useMemo: (fn) => fn(), useRef: () => ({ current: undefined }), Component: StubComponent };\n` +
  `const useState = React.useState, useEffect = React.useEffect, useMemo = React.useMemo, useRef = React.useRef, Component = StubComponent;\n` +
  `const Tone = new Proxy({}, { get: () => new Proxy(function () {}, { get: () => () => ({}), apply: () => ({}) }) });\n` +
  code +
  `\nmodule.exports = { CAMPAIGNS: typeof CAMPAIGNS !== "undefined" ? CAMPAIGNS : undefined };\n`;

const tmpPath = path.join(__dirname, "._export_full_node_report.tmp.js");
fs.writeFileSync(tmpPath, wrapped);

let CAMPAIGNS;
try {
  delete require.cache[require.resolve(path.resolve(tmpPath))];
  const mod = require(path.resolve(tmpPath));
  CAMPAIGNS = mod.CAMPAIGNS;
  if (!CAMPAIGNS) {
    console.error("Transpiled module evaluated but CAMPAIGNS was not defined at module scope.");
    process.exit(2);
  }
} finally {
  fs.unlinkSync(tmpPath);
}

// Node-id enumeration: slice each CAMPAIGNS.<key> block out of the raw source (same technique
// check-reachability.js's campaignBlocks() uses) and regex every `get <id>() {` getter inside it,
// in source order. This is what actually reproduces NODE_TOTAL's 99/49/51/51 — see header note.
const CAMPAIGN_KEYS = ["german", "soviet", "allied", "italy"];
function campaignBlocks() {
  const idxs = CAMPAIGN_KEYS.map((k) => ({ k, i: src.indexOf(`\n  ${k}: {`) })).sort((a, b) => a.i - b.i);
  const end = src.indexOf("\n};", idxs[idxs.length - 1].i);
  const blocks = {};
  for (let n = 0; n < idxs.length; n++) {
    blocks[idxs[n].k] = src.slice(idxs[n].i, n + 1 < idxs.length ? idxs[n + 1].i : end);
  }
  return blocks;
}
const BLOCKS = campaignBlocks();
const NODE_IDS_BY_CAMPAIGN = {};
for (const key of CAMPAIGN_KEYS) {
  NODE_IDS_BY_CAMPAIGN[key] = [...BLOCKS[key].matchAll(/get (\w+)\(\) \{/g)].map((m) => m[1]);
}

const rows = [];
const errors = [];
const unreached = [];
const clamp = (v) => Math.max(-10, Math.min(10, v));

for (const key of CAMPAIGN_KEYS) {
  const c = CAMPAIGNS[key];
  const ids = NODE_IDS_BY_CAMPAIGN[key] || [];
  const idSet = new Set(ids);

  // Resolving every node at flags={} (a first pass did this) produces real garbage: several
  // nodes' situation text is keyed off an upstream flag (e.g. tannenbaum40's opening clause is
  // `{commit: "...", attrition: "...", ...}[flags.sealion] + " the Balkans..."`) that is only
  // ever unset if you resolve the node in isolation — in real play, whichever choice sets it
  // always fires first. Unset, the lookup returns undefined and JS quietly renders "undefined
  // the Balkans..." — not a game bug, an artifact of resolving nodes out of context.
  //
  // A single-path BFS (a second pass tried this) fixes that but under-covers the graph: several
  // `next` targets are themselves flag-conditional ternaries (e.g. elAlamein/maltaAftermath/
  // stalingradPocket all hang off one `flags.med42 === ...` choice), and freezing a decision node
  // at whichever flags first reached it means the BFS can only ever discover ONE of its several
  // possible destinations — 40 real, reachable nodes (including three actual Key Battle Subgame
  // battles: elAlamein, stalingradPocket, and Italy's herculesExecution41) were lost this way.
  //
  // Fixed by reusing the project's own established methodology for exactly this problem —
  // check-reachability.js already runs thousands of randomized playthroughs per campaign to prove
  // reachability; this does the same, at a smaller scale, and keeps the FIRST real (non-buggy)
  // resolution of each node encountered across all those runs as its canonical export record.
  function rollUncertain(u) {
    const total = u.reduce((a, v) => a + (v.weight || 0), 0);
    let r = Math.random() * total;
    for (let k = 0; k < u.length; k++) {
      r -= u[k].weight || 0;
      if (r <= 0) return k;
    }
    return 0;
  }
  const visited = new Map(); // nodeId -> { node, flags, meters }
  const RUNS = 25000;
  for (let run = 0; run < RUNS; run++) {
    let pos = c.start;
    let flags = run % 3 === 0 ? { hardMode: true } : {}; // a third of runs under hard mode, in case a hard-mode-only flag ever gates a next target
    let meters = { manpower: 0, fuel: 0, initiative: 0 };
    let steps = 0;
    while (steps++ < 400) {
      if (!idSet.has(pos)) break;
      let node;
      try {
        node = c.resolveNode(pos, flags, meters);
      } catch (e) {
        if (!visited.has(pos)) errors.push({ campaign: key, id: pos, error: String((e && e.message) || e) });
        break;
      }
      if (!node) break;
      if (!visited.has(pos)) visited.set(pos, { node, flags, meters });
      const choices = node.choices || [];
      const avail = choices.filter((x) => !x.disabledReason);
      if (!avail.length) break;
      const ch = avail[Math.floor(Math.random() * avail.length)];
      const ri = ch.uncertain && ch.uncertain.length ? rollUncertain(ch.uncertain) : null;
      const branch = ri != null ? ch.uncertain[ri] : null;
      const mf = { ...flags, ...(ch.setFlags || {}), ...((branch && branch.setFlags) || {}) };
      const impact = (branch && branch.impact) || ch.impact || {};
      meters = {
        manpower: clamp(meters.manpower + (impact.manpower || 0)),
        fuel: clamp(meters.fuel + (impact.fuel || 0)),
        initiative: clamp(meters.initiative + (impact.initiative || 0)),
      };
      flags = mf;
      const next = (branch && branch.next) || ch.next;
      if (!next || next === "END") break;
      pos = next;
    }
  }
  for (const nodeId of ids) if (!visited.has(nodeId)) unreached.push({ campaign: key, id: nodeId });

  for (const nodeId of ids) {
    const v = visited.get(nodeId);
    if (!v) continue; // recorded in `unreached` above; resolveNode/graph errors recorded in `errors`
    const { node } = v;
    const choices = node.choices || [];
    if (!choices.length) {
      rows.push({
        campaign: key,
        nodeId: nodeId,
        date: node.date || "",
        title: node.title || "",
        situation: node.situation || "",
        choiceLabel: "(no choices resolved along the first-reached path — likely an END node or fully flag-gated)",
        branchNote: "",
        outcome: "",
        next: node.next || "END",
        manpower: "",
        fuel: "",
        initiative: "",
      });
      continue;
    }
    for (const ch of choices) {
      const baseRow = {
        campaign: key,
        nodeId: nodeId,
        date: node.date || "",
        title: node.title || "",
        situation: node.situation || "",
        choiceLabel: ch.label || "",
      };
      if (ch.uncertain && ch.uncertain.length) {
        const totalWeight = ch.uncertain.reduce((a, u) => a + (u.weight || 0), 0) || 1;
        for (const branch of ch.uncertain) {
          const impact = branch.impact || ch.impact || {};
          rows.push({
            ...baseRow,
            branchNote:
              (branch.title ? branch.title + " " : "") +
              "(~" + Math.round(((branch.weight || 0) / totalWeight) * 100) + "% at the meters when first reached)",
            outcome: branch.outcome || "",
            next: branch.next || ch.next || "END",
            manpower: impact.manpower || 0,
            fuel: impact.fuel || 0,
            initiative: impact.initiative || 0,
          });
        }
      } else {
        const impact = ch.impact || {};
        rows.push({
          ...baseRow,
          branchNote: ch.disabledReason ? "(disabled when first reached: " + ch.disabledReason + ")" : "",
          outcome: ch.outcome || "",
          next: ch.next || "END",
          manpower: impact.manpower || 0,
          fuel: impact.fuel || 0,
          initiative: impact.initiative || 0,
        });
      }
    }
  }
}

fs.writeFileSync(
  OUT,
  JSON.stringify(
    { rows, errors, unreached, counts: Object.fromEntries(CAMPAIGN_KEYS.map((k) => [k, (NODE_IDS_BY_CAMPAIGN[k] || []).length])) },
    null,
    2
  )
);
console.error(`Wrote ${rows.length} rows from ${CAMPAIGN_KEYS.map((k) => (NODE_IDS_BY_CAMPAIGN[k] || []).length + " " + k).join(", ")} nodes.`);
if (errors.length) console.error(`${errors.length} node(s) threw or resolved to nothing:`, errors);
if (unreached.length) console.error(`${unreached.length} node(s) never reached by the BFS from campaign.start (likely orphaned/unreachable getters):`, unreached);
