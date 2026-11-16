import { evalCondition, isOptionConditionLocked, isOptionFlagLocked } from "@dispatches/engine";
import type { Condition, GameDefinition, GameState, Option } from "@dispatches/engine";

/**
 * Says in words why an option is shut, or what opened it, by naming the earlier choice (from the flag notes) and the people and gauges behind it.
 * The hand-written hint on the badge stays the short form; this is the long form shown under the option.
 */

const bare = (note: string) => note.replace(/\.$/, "");

function axisName(def: GameDefinition, id: string): string {
  const label = def.config.axes.find((a) => a.id === id)?.label ?? id;
  return id.startsWith("trust") ? `${label}'s trust` : `your ${label}`;
}

function resourceName(def: GameDefinition, id: string): string {
  return (def.config.resources.find((r) => r.id === id)?.label ?? id).toLowerCase();
}

const wantsMore = (op: string) => op === ">=" || op === ">";

/** What a shut condition still asks for, as a phrase after "Needs". */
function need(def: GameDefinition, state: GameState, c: Condition, joiner = " and "): string {
  const notes = def.flavor.flagNotes ?? {};
  if ("flag" in c) return `the earlier choice “${bare(notes[c.flag] ?? c.flag)}”`;
  if ("axis" in c) return `${wantsMore(c.op) ? "more" : "less"} of ${axisName(def, c.axis)}`;
  if ("resource" in c) return `${wantsMore(c.op) ? "more" : "less"} ${resourceName(def, c.resource)}`;
  if ("all" in c) return c.all.filter((x) => !evalCondition(x, state)).map((x) => need(def, state, x)).join(joiner);
  if ("any" in c) return `one of: ${c.any.map((x) => need(def, state, x, " together with ").replace(/^the earlier choice /, "")).join(" or ")}`;
  return "";
}

/** What an open condition rests on. */
function because(def: GameDefinition, state: GameState, c: Condition): string {
  const notes = def.flavor.flagNotes ?? {};
  if ("flag" in c) return bare(notes[c.flag] ?? c.flag);
  if ("axis" in c) return `${axisName(def, c.axis)} is ${wantsMore(c.op) ? "high" : "low"} enough`;
  if ("resource" in c) return `${resourceName(def, c.resource)} is ${wantsMore(c.op) ? "high" : "low"} enough`;
  if ("all" in c) return c.all.map((x) => because(def, state, x)).join("; ");
  if ("any" in c) {
    const first = c.any.find((x) => evalCondition(x, state));
    return first ? because(def, state, first) : "";
  }
  return "";
}

export interface LockWhy {
  locked: boolean;
  text: string;
}

/** Undefined when the option has no condition of its own (a gate or a cost says its own piece on the badge). */
export function lockWhy(def: GameDefinition, state: GameState, option: Option): LockWhy | undefined {
  const shutParts: string[] = [];
  const openParts: string[] = [];
  const notes = def.flavor.flagNotes ?? {};
  if (option.requiresFlag) {
    const note = bare(notes[option.requiresFlag] ?? option.requiresFlag);
    if (isOptionFlagLocked(state.flags, option.requiresFlag)) shutParts.push(`the earlier choice “${note}”`);
    else openParts.push(note);
  }
  if (option.requires) {
    if (isOptionConditionLocked(state, option)) shutParts.push(need(def, state, option.requires));
    else openParts.push(because(def, state, option.requires));
  }
  if (shutParts.length) return { locked: true, text: `Needs ${shutParts.filter(Boolean).join(", and ")}.` };
  const open = openParts.filter(Boolean);
  return open.length ? { locked: false, text: `${open.join("; ")}.` } : undefined;
}
