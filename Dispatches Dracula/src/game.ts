/**
 * Glue between the playing seat's content files and the generic engine (src/seats.ts says which seat is playing).
 * `def` is the engine's GameDefinition, `ui` the words around the story, `book` the novel's road for the ending screen.
 */
import { SEATS, chosenSeatId } from "./seats";

const seat = SEATS[chosenSeatId()];
export const def = seat.def;
export const ui = seat.ui;
export const book = seat.book;
