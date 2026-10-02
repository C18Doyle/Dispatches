// Ad-hoc BFS path finder over a campaign's node graph, for scripting a Playwright playtest to a
// specific target node without hand-tracing hundreds of `next` pointers. Not part of the build
// or test suite — a throwaway dev tool.
//
// Usage: node tools/find_path.js <campaignId> <targetNodeId>
const CAMPAIGNS = require("./campaigns_extracted.js");

const campId = process.argv[2];
const target = process.argv[3];
const campaign = CAMPAIGNS[campId];
if (!campaign) {
  console.error("Unknown campaign:", campId, "options:", Object.keys(CAMPAIGNS));
  process.exit(1);
}

const startMeters = { manpower: 0, fuel: 0, initiative: 0 };
const startFlags = {};

// BFS over (nodeId) using empty flags (approximation — some `next` are chosen via ternaries on
// flags, but most early-game choices are flag-independent enough for a first pass). Each edge
// records the choice label (or uncertain outcome title) needed to traverse it.
const visited = new Set();
const queue = [{ id: campaign.start, path: [] }];
visited.add(campaign.start);

function safeResolve(id, flags) {
  try {
    return campaign.resolveNode(id, flags, startMeters);
  } catch (e) {
    return null;
  }
}

let found = null;
while (queue.length) {
  const { id, path } = queue.shift();
  if (id === target) {
    found = path;
    break;
  }
  const node = safeResolve(id, startFlags);
  if (!node || !node.choices) continue;
  const choices = typeof node.choices === "function" ? node.choices() : node.choices;
  for (const ch of choices || []) {
    const edges = [];
    if (ch.next && ch.next !== "END") edges.push({ next: ch.next, label: ch.label });
    if (ch.uncertain) {
      for (const u of ch.uncertain) {
        if (u.next && u.next !== "END") edges.push({ next: u.next, label: ch.label, uncertainTitle: u.title });
      }
    }
    for (const e of edges) {
      if (!visited.has(e.next)) {
        visited.add(e.next);
        queue.push({ id: e.next, path: [...path, { from: id, to: e.next, label: e.label, uncertainTitle: e.uncertainTitle }] });
      }
    }
  }
}

if (!found) {
  console.log("NO PATH FOUND from", campaign.start, "to", target, "(visited", visited.size, "nodes)");
  process.exit(1);
}

console.log(`Path (${found.length} hops) from ${campaign.start} to ${target}:`);
for (const hop of found) {
  console.log(`  ${hop.from} -> ${hop.to}  via: "${hop.label}"${hop.uncertainTitle ? `  [uncertain: ${hop.uncertainTitle}]` : ""}`);
}
