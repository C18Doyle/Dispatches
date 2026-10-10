/** Ending text, hidden-axis epilogue reading, and the non-mechanical random-line pools. */
import { evalCondition } from "./conditions";
import { clampTo } from "./rules";
import type { GameDefinition, GameState } from "./schema";

/** Live axes plus the config's inferred rules (flags / resource extremes), clamped to axis bounds. */
export function computeFinalAxes(def: GameDefinition, state: GameState): Record<string, number> {
  const out: Record<string, number> = { ...state.axes };
  for (const rule of def.config.epilogue?.inferredRules ?? []) {
    if (!evalCondition(rule.when, state)) continue;
    for (const [axis, d] of Object.entries(rule.delta)) out[axis] = (out[axis] ?? 0) + (d ?? 0);
  }
  for (const a of def.config.axes) out[a.id] = clampTo(out[a.id] ?? 0, a.min, a.max);
  return out;
}

export function bucket(n: number, threshold: number): "pos" | "neutral" | "neg" {
  if (n >= threshold) return "pos";
  if (n <= -threshold) return "neg";
  return "neutral";
}

/** "<bucket>_<bucket>" key for the epilogue axes, or null if the game has no epilogue. */
export function epilogueKey(def: GameDefinition, state: GameState): string | null {
  const ep = def.config.epilogue;
  if (!ep) return null;
  const final = computeFinalAxes(def, state);
  const [a, b] = ep.axes.map((id) => {
    const axis = def.config.axes.find((x) => x.id === id);
    return bucket(final[id] ?? 0, axis?.bucketThreshold ?? 2);
  });
  return `${a}_${b}`;
}

export function resolveEnding(
  def: GameDefinition,
  state: GameState
): { headline: string; title: string; text: string; epilogueLabel: string | null } {
  const ending = state.endingId ? def.content.endings[state.endingId] : undefined;
  if (!ending) return { headline: "", title: "Unknown", text: "", epilogueLabel: null };

  let { headline, text } = ending;
  const match = ending.variants?.find((v) => (v.when ? evalCondition(v.when, state) : !!(v.flag && state.flags[v.flag])));
  if (match) ({ headline, text } = match);

  if (ending.kind === "narrative") {
    const key = epilogueKey(def, state);
    const reading = key ? def.flavor.epilogueReadings[key] : undefined;
    if (reading) return { headline, title: ending.title, text: `${text}\n\n${reading.epilogue}`, epilogueLabel: reading.label };
  }
  return { headline, title: ending.title, text, epilogueLabel: null };
}

/** All gossip lines whose condition currently holds (entries without `when` always apply). */
export function gossipPool(def: GameDefinition, state: GameState): string[] {
  return def.flavor.gossip.filter((g) => !g.when || evalCondition(g.when, state)).flatMap((g) => g.lines);
}

export function creatureReportPool(def: GameDefinition, state: GameState): string[] {
  const key = epilogueKey(def, state);
  const lines = def.flavor.creatureReportLines;
  return (key && lines[key]) || lines["neutral_neutral"] || [];
}

/** r is a uniform sample in [0, 1) from the caller's RNG. Returns null for an empty pool. */
export function pickLine(pool: string[], r: number): string | null {
  return pool.length ? pool[Math.floor(r * pool.length)] : null;
}
