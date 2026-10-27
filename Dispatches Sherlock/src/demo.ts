import type { GameDefinition } from "@dispatches/engine";

/** Set by esbuild (esbuild.config.mjs --demo). The demo is the same game, with the long case stopped at the choice of road. */
declare const __DEMO__: boolean;
export const IS_DEMO: boolean = typeof __DEMO__ !== "undefined" && __DEMO__;

/** The scenes of The Final Problem that lie beyond the choice of road. The four minor cases are complete in the demo. */
const ROAD_BRANCHES = ["YARD", "STREET", "CONTINENT", "MYCROFT", "HIATUS"];

/**
 * Does the demo stop the player on arriving at this scene? It does for the first scene of any road of the long case: they have played the whole
 * opening, including the choice of road, and none of what follows. (A gauge run to ruin still ends the story early, in the demo and in the full game.)
 */
export function isDemoStop(def: GameDefinition, nodeId: string): boolean {
  const node = def.content.nodes[nodeId];
  return !!node && ROAD_BRANCHES.includes(node.branch);
}
