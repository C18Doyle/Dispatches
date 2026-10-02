/** Pure evaluation of schema Conditions against a GameState. */
import type { Comparator, Condition, GameState } from "./schema";

function compare(a: number, op: Comparator, b: number): boolean {
  switch (op) {
    case "<": return a < b;
    case "<=": return a <= b;
    case ">": return a > b;
    case ">=": return a >= b;
    case "==": return a === b;
  }
}

export function evalCondition(c: Condition, s: GameState): boolean {
  if ("flag" in c) return !!s.flags[c.flag];
  if ("resource" in c) return compare(s.resources[c.resource] ?? 0, c.op, c.value);
  if ("axis" in c) return compare(s.axes[c.axis] ?? 0, c.op, c.value);
  if ("stat" in c) return compare(s.money, c.op, c.value);
  if ("branch" in c) return s.activeBranch === c.branch;
  if ("difficulty" in c) return s.difficulty === c.difficulty;
  if ("favorUsed" in c) return s.favorUsed === c.favorUsed;
  if ("all" in c) return c.all.every((x) => evalCondition(x, s));
  if ("any" in c) return c.any.some((x) => evalCondition(x, s));
  return !evalCondition(c.not, s);
}
