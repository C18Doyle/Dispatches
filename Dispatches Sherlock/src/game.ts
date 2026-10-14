/**
 * Glue between this game's content files and the generic engine.
 * The one place that names Sherlock. Not part of the engine (it imports JSON).
 */
import type { GameDefinition } from "@dispatches/engine";
import config from "./content/sherlock/config.json";
import content from "./content/sherlock/events.json";
import flavor from "./content/sherlock/flavor.json";

// JSON files are checked against schema.ts by `npm run validate:schema`; the cast
// only bridges TypeScript's widened JSON literal types.
export const def = { config, content, flavor } as unknown as GameDefinition;
