import type { GameDefinition } from "@dispatches/engine";

/** Set by esbuild (esbuild.config.mjs --demo). The demo is the same game, locked at the end of Act I. */
declare const __DEMO__: boolean;
export const IS_DEMO: boolean = typeof __DEMO__ !== "undefined" && __DEMO__;

/**
 * Is this scene the first of Act II? Act I is every scene on the starting branch (the foundation, before the player has chosen a track), so the
 * demo stops the player on arriving at a scene of any other branch: they have played all of Act I, including the choice that decides the track,
 * and none of Act II. (A resource that runs to ruin still ends the story early, in the demo and in the full game.)
 */
export function isDemoStop(def: GameDefinition, nodeId: string): boolean {
  const node = def.content.nodes[nodeId];
  return !!node && node.branch !== def.config.startBranch;
}
