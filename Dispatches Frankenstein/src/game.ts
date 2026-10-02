/**
 * Glue between this game's content files and the generic engine.
 * The one place that names Frankenstein. Not part of src/engine/ (it imports JSON).
 */
import type { GameDefinition } from "./engine/index";
import config from "./content/frankenstein/config.json";
import content from "./content/frankenstein/events.json";
import flavor from "./content/frankenstein/flavor.json";

// JSON files are checked against schema.ts by `npm run validate`; the cast
// only bridges TypeScript's widened JSON literal types.
export const def = { config, content, flavor } as unknown as GameDefinition;
