/**
 * Every seat (playable point of view) the game contains, and which one is playing. Both seats' words and rules are in the one bundle; the choice is kept in
 * localStorage and read once when the page loads, so switching seats reloads the page and each seat keeps its own saves, ledger, settings and theme (their keys
 * start with the seat's config id). The build says which seat a fresh browser starts on (esbuild.config.mjs --seat=<id>, default "dracula"), and the demo build
 * is the Count only.
 */
import type { GameDefinition } from "@dispatches/engine";
import draculaConfig from "./content/dracula/config.json";
import draculaEvents from "./content/dracula/events.json";
import draculaFlavor from "./content/dracula/flavor.json";
import draculaUi from "./content/dracula/ui.json";
import draculaBook from "./content/dracula/book.json";
import minaConfig from "./content/mina/config.json";
import minaEvents from "./content/mina/events.json";
import minaFlavor from "./content/mina/flavor.json";
import minaUi from "./content/mina/ui.json";
import minaBook from "./content/mina/book.json";
import type { SeatBook, SeatUi } from "./seat";

declare const __SEAT__: string;
declare const __DEMO__: boolean;

export interface Seat {
  id: string;
  def: GameDefinition;
  ui: SeatUi;
  book: SeatBook;
}

// JSON files are checked against schema.ts by `npm run validate:schema`; the casts only bridge TypeScript's widened JSON literal types.
const make = (id: string, config: unknown, content: unknown, flavor: unknown, ui: unknown, book: unknown): Seat => ({
  id,
  def: { config, content, flavor } as unknown as GameDefinition,
  ui: ui as SeatUi,
  book: book as SeatBook,
});

export const SEATS: Record<string, Seat> = {
  dracula: make("dracula", draculaConfig, draculaEvents, draculaFlavor, draculaUi, draculaBook),
  mina: make("mina", minaConfig, minaEvents, minaFlavor, minaUi, minaBook),
};

const KEY = "dispatches_dracula_seat";
const BUILD_DEFAULT: string = typeof __SEAT__ !== "undefined" ? __SEAT__ : "dracula";
const IS_DEMO_BUILD: boolean = typeof __DEMO__ !== "undefined" && __DEMO__;

/** The seat playing now: the stored choice, else the build's default. The demo is always the Count. */
export function chosenSeatId(): string {
  if (IS_DEMO_BUILD) return "dracula";
  try {
    const id = localStorage.getItem(KEY);
    if (id && SEATS[id]) return id;
  } catch {
    /* storage blocked: the default seat */
  }
  return SEATS[BUILD_DEFAULT] ? BUILD_DEFAULT : "dracula";
}

/** Can the player switch? Not in the demo. */
export const CAN_SWITCH_SEAT = !IS_DEMO_BUILD && Object.keys(SEATS).length > 1;

/** Remember the choice and reload, so everything that reads the seat at start-up (the rules, the saves, the theme) reads the new one. */
export function switchSeat(id: string): void {
  if (!SEATS[id]) return;
  try {
    localStorage.setItem(KEY, id);
  } catch {
    /* if it cannot be kept, the reload shows the build's default */
  }
  window.location.reload();
}
