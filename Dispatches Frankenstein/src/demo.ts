import type { GameDefinition } from "@dispatches/engine";

/** Set by esbuild (esbuild.config.mjs --demo). The demo is the same game, stopped at the last choice of each track. */
declare const __DEMO__: boolean;
export const IS_DEMO: boolean = typeof __DEMO__ !== "undefined" && __DEMO__;

/**
 * Is this scene a climax, one whose choices end the story? The demo stops the player there, before the choice, so they have seen the whole
 * of Acts I and II and none of the endings. (A resource that runs to ruin still ends the story early, in the demo and in the full game.)
 */
export function isClimax(nodes: GameDefinition["content"]["nodes"], nodeId: string): boolean {
  const node = nodes[nodeId];
  if (!node) return false;
  return node.options.some(
    (o) => o.nextNodeId.startsWith("ENDING_") || o.roll?.success.nextNodeId?.startsWith("ENDING_") || o.roll?.failure.nextNodeId?.startsWith("ENDING_"),
  );
}
