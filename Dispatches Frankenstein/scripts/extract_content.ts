/**
 * One-off: converts the legacy src/data.ts into the three JSON content files.
 *   npx tsx scripts/extract_content.ts
 * Text is copied programmatically (never retyped). The only hand-written part is
 * the Condition list for gossip and the axis rules, which were code in data.ts.
 */
import { writeFileSync } from "node:fs";
import {
  NODES, NEWSPAPER_EVENTS, ENDINGS, START_NODE_ID, LORE_NODE_IDS, LORE_EVENT_ID, TRANSITION_EVENT_ID,
  ACT2_ENTRY_NODES, ACT2_SKIP_NODE_ID, PROLOGUE_TEXT, CHAPTER_CARD, HOW_TO_PLAY, GOSSIP_POOL,
  TEMPERAMENT_READINGS, CREATURE_REPORT_LINES,
} from "../src/data";
import type { GameConfig, GameContent, FlavorContent, Condition, GameNode, Option, ResourceDef } from "../src/engine/schema";

const OUT = "src/content/frankenstein";
const write = (name: string, v: unknown) => writeFileSync(`${OUT}/${name}`, JSON.stringify(v, null, 2) + "\n");

// ── events.json ──
const renameOption = (o: Option & { temperamentDelta?: unknown }): Option => {
  const { temperamentDelta, ...rest } = o as Option & { temperamentDelta?: Record<string, number> };
  return temperamentDelta ? ({ ...rest, axisDelta: temperamentDelta } as Option) : (rest as Option);
};
const nodes: Record<string, GameNode> = {};
for (const [id, n] of Object.entries(NODES)) nodes[id] = { ...n, options: n.options.map((o) => renameOption(o as never)) };
const content: GameContent = {
  startNodeId: START_NODE_ID,
  nodes,
  interludes: Object.fromEntries(
    Object.entries(NEWSPAPER_EVENTS).map(([id, e]) => [id, { id: e.id, source: e.masthead, headline: e.headline, bodyText: e.bodyText, kind: e.type }])
  ),
  endings: ENDINGS,
};
write("events.json", content);

// ── config.json ──
const res = (id: string, label: string): ResourceDef => ({
  id, label, min: -10, max: 10, start: 0,
  crisisAt: -7, crisisInterludeId: `CRISIS_${id.toUpperCase()}`,
  failAt: -10, failureEndingId: `ENDING_CRISIS_${id.toUpperCase()}`,
});
const lt = (resource: string, value: number): Condition => ({ resource, op: "<=", value });
const gt = (resource: string, value: number): Condition => ({ resource, op: ">=", value });
const config: GameConfig = {
  id: "frankenstein",
  title: "Frankenstein: The Modern Prometheus",
  schemaVersion: 1,
  resources: [res("voltage", "Voltage"), res("biomass", "Biomass"), res("secrecy", "Secrecy")],
  axes: [
    { id: "voice", label: "Voice", min: -8, max: 8, bucketThreshold: 2 },
    { id: "bond", label: "Bond", min: -8, max: 8, bucketThreshold: 2 },
  ],
  epilogue: {
    axes: ["voice", "bond"],
    inferredRules: [
      { when: { flag: "executedOrigin" }, delta: { voice: -1 } },
      { when: { flag: "waldmanDebt" }, delta: { voice: -1 } },
      { when: { flag: "constructSighted" }, delta: { voice: -1 } },
      { when: { flag: "superConstruct" }, delta: { bond: -1 } },
      { when: { flag: "galvanicOvercharge" }, delta: { voice: -1 } },
      { when: { flag: "fritzPatron" }, delta: { bond: 1 } },
      { when: lt("secrecy", -4), delta: { voice: -1, bond: -1 } },
      { when: gt("secrecy", 5), delta: { voice: 1 } },
      { when: lt("voltage", -4), delta: { voice: -1 } },
      { when: gt("voltage", 5), delta: { voice: 1 } },
      { when: lt("biomass", -4), delta: { bond: -1 } },
      { when: gt("biomass", 5), delta: { bond: 1 } },
    ],
  },
  difficulties: {
    EASY: { showPreview: true, enforceMoney: false, startingMoney: 0, adviceEnabled: false },
    MEDIUM: { showPreview: false, enforceMoney: false, startingMoney: 0, adviceEnabled: true },
    HARD: { showPreview: false, enforceMoney: true, startingMoney: 50, adviceEnabled: true },
  },
  defaultDifficulty: "MEDIUM",
  startBranch: "UNIVERSAL",
  interludeTriggers: [
    { interludeId: LORE_EVENT_ID, onEnterNodes: LORE_NODE_IDS },
    { interludeId: TRANSITION_EVENT_ID, onEnterNodes: ACT2_ENTRY_NODES },
  ],
  assist: {
    adviceLimit: 3,
    favors: {
      voltage: { voltage: 3, secrecy: -2 },
      biomass: { biomass: 3, secrecy: -2 },
      secrecy: { secrecy: 3, biomass: -1, voltage: -1 },
    },
    favorFlag: "fritzPatron",
  },
  skipToNodeId: ACT2_SKIP_NODE_ID,
};
write("config.json", config);

// ── flavor.json ──
// Same order as GOSSIP_POOL in data.ts; length is asserted so a drift fails loudly.
const flag = (f: string): Condition => ({ flag: f });
const gossipWhen: (Condition | undefined)[] = [
  flag("executedOrigin"), flag("waldmanDebt"), flag("constructSighted"), flag("galvanicOvercharge"), flag("superConstruct"),
  lt("secrecy", -4), gt("secrecy", 5), lt("voltage", -4), gt("voltage", 5), lt("biomass", -4), gt("biomass", 5),
  { all: [{ difficulty: "HARD" }, { stat: "money", op: "<=", value: 10 }] },
  { branch: "ALCHEMICAL" }, { branch: "GALVANIC" }, { branch: "PROMETHEUS" },
  { favorUsed: true },
  undefined,
];
if (GOSSIP_POOL.length !== gossipWhen.length) throw new Error(`GOSSIP_POOL has ${GOSSIP_POOL.length} entries, expected ${gossipWhen.length}`);
const flavor: FlavorContent = {
  prologue: PROLOGUE_TEXT,
  chapterCard: CHAPTER_CARD,
  howToPlay: HOW_TO_PLAY,
  gossip: GOSSIP_POOL.map((g, i) => ({ ...(gossipWhen[i] ? { when: gossipWhen[i] } : {}), lines: g.lines })),
  epilogueReadings: TEMPERAMENT_READINGS,
  creatureReportLines: CREATURE_REPORT_LINES,
};
write("flavor.json", flavor);
console.log(`nodes=${Object.keys(nodes).length} endings=${Object.keys(ENDINGS).length} interludes=${Object.keys(content.interludes).length} gossip=${flavor.gossip.length}`);
