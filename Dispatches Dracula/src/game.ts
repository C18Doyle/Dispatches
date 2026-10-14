/**
 * Glue between this game's content files and the generic engine.
 * The one place that binds a seat's JSON to the engine. `@seat/*` is the folder of the seat being built (tsconfig paths for the
 * type-checker and the scripts, an esbuild alias for the bundle): the Count (src/content/dracula) unless the build says otherwise.
 */
import type { GameDefinition } from "@dispatches/engine";
import config from "@seat/config.json";
import content from "@seat/events.json";
import flavor from "@seat/flavor.json";
import seatUi from "@seat/ui.json";
import seatBook from "@seat/book.json";
import type { SeatBook, SeatUi } from "./seat";

// JSON files are checked against schema.ts by `npm run validate:schema`; the cast
// only bridges TypeScript's widened JSON literal types.
export const def = { config, content, flavor } as unknown as GameDefinition;
export const ui = seatUi as unknown as SeatUi;
export const book = seatBook as unknown as SeatBook;
