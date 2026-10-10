/**
 * Checks a game's JSON content against the contract in src/engine/schema.ts.
 * TypeScript cannot type-check JSON files, so this is the enforcement:
 * required fields, field types, no unknown fields, and every cross-reference
 * (resource ids, node ids, ending ids, interlude ids, flags used in conditions).
 *   npm run validate:schema            (defaults to frankenstein)
 *   npx tsx scripts/validate_schema.ts <game>
 * Keep the field tables below in step with schema.ts.
 */
import { loadDefinition } from "./load_definition";

const game = process.argv[2] ?? "frankenstein";
const def = loadDefinition(game);
const { config, content, flavor } = def;
let failures = 0;
const fail = (where: string, msg: string) => {
  failures++;
  console.error(`FAIL: ${where}: ${msg}`);
};

type Kind = "string" | "number" | "boolean" | "string[]" | "object" | "array";
type Fields = Record<string, Kind | `?${Kind}`>;

function shape(where: string, v: unknown, fields: Fields) {
  if (typeof v !== "object" || v === null || Array.isArray(v)) return fail(where, "expected an object");
  const o = v as Record<string, unknown>;
  for (const [k, spec] of Object.entries(fields)) {
    const optional = spec.startsWith("?");
    const kind = optional ? spec.slice(1) : spec;
    if (o[k] === undefined) {
      if (!optional) fail(where, `missing required field "${k}"`);
      continue;
    }
    const x = o[k];
    const okType =
      kind === "string[]" ? Array.isArray(x) && x.every((i) => typeof i === "string")
      : kind === "array" ? Array.isArray(x)
      : kind === "object" ? typeof x === "object" && x !== null && !Array.isArray(x)
      : typeof x === kind;
    if (!okType) fail(where, `field "${k}" should be ${kind}`);
  }
  for (const k of Object.keys(o)) if (!(k in fields)) fail(where, `unknown field "${k}" (not in schema.ts)`);
}

const resourceIds = new Set(config.resources.map((r) => r.id));
const axisIds = new Set(config.axes.map((a) => a.id));
const nodeIds = new Set(Object.keys(content.nodes));
const endingIds = new Set(Object.keys(content.endings));
const interludeIds = new Set(Object.keys(content.interludes));
const knownBranches = new Set(Object.values(content.nodes).map((n) => n.branch));

const checkStamps = (where: string, stamps: unknown) => {
  if (typeof stamps !== "object" || stamps === null) return fail(where, "stamps must be an object");
  for (const [k, v] of Object.entries(stamps)) {
    if (!resourceIds.has(k)) fail(where, `stamp for unknown resource "${k}"`);
    if (typeof v !== "number") fail(where, `stamp "${k}" must be a number`);
  }
};
const checkAxisDelta = (where: string, d: unknown) => {
  for (const k of Object.keys(d as object)) if (!axisIds.has(k)) fail(where, `axisDelta for unknown axis "${k}"`);
};
const checkTarget = (where: string, id: string) => {
  if (!(id.startsWith("ENDING_") ? endingIds.has(id) : nodeIds.has(id))) fail(where, `target "${id}" is not a node or ending`);
};

const flagsSet = new Set<string>();
const flagsRead = new Set<string>();
function checkCondition(where: string, c: unknown) {
  if (typeof c !== "object" || c === null) return fail(where, "condition must be an object");
  const o = c as Record<string, unknown>;
  if ("flag" in o) { flagsRead.add(String(o.flag)); return; }
  if ("resource" in o) { if (!resourceIds.has(String(o.resource))) fail(where, `unknown resource "${o.resource}"`); return; }
  if ("axis" in o) { if (!axisIds.has(String(o.axis))) fail(where, `unknown axis "${o.axis}"`); return; }
  if ("stat" in o) { if (o.stat !== "money") fail(where, `unknown stat "${o.stat}"`); return; }
  if ("branch" in o) { if (!knownBranches.has(String(o.branch))) fail(where, `unknown branch "${o.branch}"`); return; }
  if ("difficulty" in o) { if (!(String(o.difficulty) in config.difficulties)) fail(where, `unknown difficulty "${o.difficulty}"`); return; }
  if ("favorUsed" in o) return;
  if ("all" in o || "any" in o) { for (const x of (o.all ?? o.any) as unknown[]) checkCondition(where, x); return; }
  if ("not" in o) return checkCondition(where, o.not);
  fail(where, `unrecognised condition ${JSON.stringify(c)}`);
}

// ── config ──
shape("config", config, {
  id: "string", title: "string", schemaVersion: "number", resources: "array", axes: "array", epilogue: "?object",
  difficulties: "object", defaultDifficulty: "string", startBranch: "string", interludeTriggers: "array", assist: "?object", strain: "?object", skipToNodeId: "?string",
});
if (config.strain) {
  shape("strain", config.strain, { threshold: "number", perPoint: "number", max: "number" });
  if (!(config.strain.perPoint > 0 && config.strain.max > 0 && config.strain.max < 1)) fail("strain", "perPoint must be above 0 and max within (0, 1)");
}
for (const r of config.resources) {
  shape(`resource ${r.id}`, r, {
    id: "string", label: "string", min: "number", max: "number", start: "number",
    crisisAt: "?number", crisisInterludeId: "?string", failAt: "?number", failureEndingId: "?string",
  });
  if (r.min >= r.max) fail(`resource ${r.id}`, "min must be below max");
  if (r.start < r.min || r.start > r.max) fail(`resource ${r.id}`, "start outside [min, max]");
  if (r.crisisInterludeId && !interludeIds.has(r.crisisInterludeId)) fail(`resource ${r.id}`, `crisisInterludeId "${r.crisisInterludeId}" not in interludes`);
  if (r.failureEndingId && !endingIds.has(r.failureEndingId)) fail(`resource ${r.id}`, `failureEndingId "${r.failureEndingId}" not in endings`);
  if ((r.crisisAt === undefined) !== (r.crisisInterludeId === undefined)) fail(`resource ${r.id}`, "crisisAt and crisisInterludeId go together");
  if ((r.failAt === undefined) !== (r.failureEndingId === undefined)) fail(`resource ${r.id}`, "failAt and failureEndingId go together");
}
for (const a of config.axes) shape(`axis ${a.id}`, a, { id: "string", label: "string", min: "number", max: "number", bucketThreshold: "number" });
for (const [name, d] of Object.entries(config.difficulties))
  shape(`difficulty ${name}`, d, { showPreview: "boolean", enforceMoney: "boolean", startingMoney: "number", adviceEnabled: "boolean" });
if (!(config.defaultDifficulty in config.difficulties)) fail("config", "defaultDifficulty is not in difficulties");
for (const d of ["EASY", "MEDIUM", "HARD"]) if (!(d in config.difficulties)) fail("config", `difficulties missing ${d}`);
if (!knownBranches.has(config.startBranch)) fail("config", `startBranch "${config.startBranch}" is not a branch used by any node`);
if (config.skipToNodeId && !nodeIds.has(config.skipToNodeId)) fail("config", `skipToNodeId "${config.skipToNodeId}" is not a node`);
for (const t of config.interludeTriggers) {
  shape(`trigger ${t.interludeId}`, t, { interludeId: "string", onEnterNodes: "string[]" });
  if (!interludeIds.has(t.interludeId)) fail(`trigger ${t.interludeId}`, "interlude does not exist");
  for (const n of t.onEnterNodes) if (!nodeIds.has(n)) fail(`trigger ${t.interludeId}`, `node "${n}" does not exist`);
}
if (config.epilogue) {
  shape("epilogue", config.epilogue, { axes: "string[]", inferredRules: "array" });
  if (config.epilogue.axes.length !== 2) fail("epilogue", "axes must name exactly two axes");
  for (const a of config.epilogue.axes) if (!axisIds.has(a)) fail("epilogue", `unknown axis "${a}"`);
  config.epilogue.inferredRules.forEach((r, i) => {
    shape(`epilogue rule ${i}`, r, { when: "object", delta: "object" });
    checkCondition(`epilogue rule ${i}`, r.when);
    checkAxisDelta(`epilogue rule ${i}`, r.delta);
  });
}
if (config.assist) {
  shape("assist", config.assist, { adviceLimit: "number", favors: "object", favorFlag: "string" });
  for (const [r, st] of Object.entries(config.assist.favors)) {
    if (!resourceIds.has(r)) fail("assist.favors", `unknown resource "${r}"`);
    checkStamps(`assist.favors.${r}`, st);
  }
  flagsSet.add(config.assist.favorFlag);
}

// ── events ──
shape("content", content, { startNodeId: "string", nodes: "object", interludes: "object", endings: "object" });
if (!nodeIds.has(content.startNodeId)) fail("content", `startNodeId "${content.startNodeId}" is not a node`);

for (const [key, node] of Object.entries(content.nodes)) {
  const nw = `node ${key}`;
  shape(nw, node, { id: "string", branch: "string", title: "string", description: "string", options: "array", echoes: "?array" });
  node.echoes?.forEach((en, ei) => {
    shape(`${nw} echo ${ei}`, en, { when: "object", text: "string" });
    checkCondition(`${nw} echo ${ei}`, en.when);
  });
  if (node.id !== key) fail(nw, `id "${node.id}" does not match its key`);
  if (!node.options.length) fail(nw, "has no options");
  node.options.forEach((o, i) => {
    const ow = `${nw} option ${i}`;
    shape(ow, o, {
      label: "string", detail: "string", stamps: "object", quote: "object", outcome: "string", gate: "?object", moneyCost: "?number",
      moneyDelta: "?number", roll: "?object", nextNodeId: "string", setFlags: "?string[]", axisDelta: "?object", requiresFlag: "?string", requiresFlagHint: "?string",
      requires: "?object", requiresHint: "?string", showWhen: "?object",
    });
    if (o.requires) checkCondition(`${ow} requires`, o.requires);
    if (o.showWhen) checkCondition(`${ow} showWhen`, o.showWhen);
    if (o.requires && !o.requiresHint) fail(ow, "a `requires` option needs a requiresHint");
    shape(`${ow} quote`, o.quote, { speaker: "string", text: "string", kind: "?string", source: "?string" });
    if (o.quote.kind && !["novel", "imagined"].includes(o.quote.kind)) fail(ow, `quote kind "${o.quote.kind}" is not novel or imagined`);
    checkStamps(ow, o.stamps);
    checkTarget(ow, o.nextNodeId);
    if (o.axisDelta) checkAxisDelta(ow, o.axisDelta);
    if (o.gate) {
      shape(`${ow} gate`, o.gate, { resource: "string", minThreshold: "number" });
      if (!resourceIds.has(o.gate.resource)) fail(ow, `gate on unknown resource "${o.gate.resource}"`);
    }
    o.setFlags?.forEach((f) => flagsSet.add(f));
    if (o.requiresFlag) flagsRead.add(o.requiresFlag);
    if (o.roll) {
      shape(`${ow} roll`, o.roll, { chance: "number", scaling: "?object", about: "?string", success: "object", failure: "object" });
      if (o.roll.about && !resourceIds.has(o.roll.about)) fail(ow, `roll.about names unknown resource "${o.roll.about}"`);
      if (o.roll.chance < 0 || o.roll.chance > 1) fail(ow, "roll.chance must be within 0..1");
      if (o.roll.scaling) {
        shape(`${ow} scaling`, o.roll.scaling, { resource: "string", perPoint: "number", min: "?number", max: "?number" });
        if (!resourceIds.has(o.roll.scaling.resource)) fail(ow, `scaling on unknown resource "${o.roll.scaling.resource}"`);
      }
      for (const side of ["success", "failure"] as const) {
        const r = o.roll[side];
        shape(`${ow} roll.${side}`, r, { outcome: "string", stamps: "object", setFlags: "?string[]", nextNodeId: "?string" });
        checkStamps(`${ow} roll.${side}`, r.stamps);
        if (r.nextNodeId) checkTarget(`${ow} roll.${side}`, r.nextNodeId);
        r.setFlags?.forEach((f) => flagsSet.add(f));
      }
    }
  });
}
for (const [key, it] of Object.entries(content.interludes)) {
  shape(`interlude ${key}`, it, { id: "string", source: "string", headline: "string", bodyText: "string", kind: "string" });
  if (it.id !== key) fail(`interlude ${key}`, "id does not match its key");
  if (!["lore", "crisis", "transition"].includes(it.kind)) fail(`interlude ${key}`, `unknown kind "${it.kind}"`);
}
for (const [key, e] of Object.entries(content.endings)) {
  shape(`ending ${key}`, e, { id: "string", title: "string", kind: "string", headline: "string", text: "string", variants: "?array" });
  if (e.id !== key) fail(`ending ${key}`, "id does not match its key");
  if (!key.startsWith("ENDING_")) fail(`ending ${key}`, 'ids must start with "ENDING_" (the reducer routes on that prefix)');
  if (!["narrative", "failure"].includes(e.kind)) fail(`ending ${key}`, `unknown kind "${e.kind}"`);
  e.variants?.forEach((v, i) => {
    shape(`ending ${key} variant ${i}`, v, { flag: "?string", when: "?object", headline: "string", text: "string" });
    if (!v.flag && !v.when) fail(`ending ${key} variant ${i}`, "needs a flag or a when");
    if (v.flag) flagsRead.add(v.flag);
    if (v.when) checkCondition(`ending ${key} variant ${i}`, v.when);
  });
}

// ── flavor ──
shape("flavor", flavor, { prologue: "string[]", chapterCard: "object", howToPlay: "array", gossip: "array", epilogueReadings: "object", creatureReportLines: "object", difficultyInfo: "?object", novelNotes: "?object", endingHints: "?object", flagNotes: "?object" });
for (const [name, table] of [["novelNotes", flavor.novelNotes], ["endingHints", flavor.endingHints]] as const) {
  if (!table) continue;
  for (const id of Object.keys(table)) if (!endingIds.has(id)) fail(`flavor.${name}`, `"${id}" is not an ending`);
  for (const id of endingIds) if (!table[id]) fail(`flavor.${name}`, `no entry for ${id}`);
}
if (flavor.flagNotes) {
  for (const id of Object.keys(flavor.flagNotes)) if (!flagsSet.has(id)) fail("flavor.flagNotes", `"${id}" is not a flag anything sets`);
  for (const id of flagsSet) if (!flavor.flagNotes[id]) fail("flavor.flagNotes", `no note for the flag "${id}"`);
}
if (flavor.difficultyInfo) for (const d of ["EASY", "MEDIUM", "HARD"] as const) shape(`difficultyInfo ${d}`, flavor.difficultyInfo[d], { label: "string", blurb: "string" });
flavor.gossip.forEach((g, i) => {
  shape(`gossip ${i}`, g, { when: "?object", lines: "string[]" });
  if (g.when) checkCondition(`gossip ${i}`, g.when);
  if (!g.lines.length) fail(`gossip ${i}`, "has no lines");
});
if (config.epilogue) {
  const buckets = ["pos", "neutral", "neg"];
  for (const a of buckets) for (const b of buckets) {
    const key = `${a}_${b}`;
    if (!flavor.epilogueReadings[key]) fail("flavor.epilogueReadings", `missing "${key}"`);
    if (!flavor.creatureReportLines[key]?.length) fail("flavor.creatureReportLines", `missing or empty "${key}"`);
  }
}

// ── flags read but never set anywhere ──
for (const f of flagsRead) if (!flagsSet.has(f)) fail("flags", `flag "${f}" is read but no option, roll or assist ever sets it`);

if (failures) {
  console.error(`\nSCHEMA VALIDATION FAILED: ${failures} problem(s).`);
  process.exit(1);
}
console.log(
  `SCHEMA OK (${game}): ${resourceIds.size} resources, ${axisIds.size} axes, ${nodeIds.size} nodes, ${endingIds.size} endings, ${interludeIds.size} interludes, ${flagsSet.size} flags, ${flavor.gossip.length} gossip entries.`
);
