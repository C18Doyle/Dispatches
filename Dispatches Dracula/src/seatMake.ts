import type { GameDefinition } from "@dispatches/engine";
import type { SeatBook, SeatUi } from "./seat";

/** A playable point of view: its rules and story (`def`), the words around it (`ui`) and the novel's road for its ending screen (`book`). */
export interface Seat {
  id: string;
  def: GameDefinition;
  ui: SeatUi;
  book: SeatBook;
}

// JSON files are checked against schema.ts by `npm run validate:schema`; the casts only bridge TypeScript's widened JSON literal types.
export const makeSeat = (id: string, config: unknown, content: unknown, flavor: unknown, ui: unknown, book: unknown): Seat => ({
  id,
  def: { config, content, flavor } as unknown as GameDefinition,
  ui: ui as SeatUi,
  book: book as SeatBook,
});
