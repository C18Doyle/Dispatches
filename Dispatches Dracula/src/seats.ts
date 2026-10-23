/**
 * Every seat (playable point of view) the build contains, and which one is playing. The Count and Mina are both in the full build; the choice is kept in
 * localStorage and read once when the page loads, so switching seats reloads the page and each seat keeps its own saves, ledger, settings and theme (their keys
 * start with the seat's config id). The build says which seat a fresh browser starts on (esbuild.config.mjs --seat=<id>, default "dracula"). The demo build is the
 * Count's Act I only: Mina's module is replaced by a stub, so her story is not even in the file.
 */
import draculaConfig from "./content/dracula/config.json";
import draculaEvents from "./content/dracula/events.json";
import draculaFlavor from "./content/dracula/flavor.json";
import draculaUi from "./content/dracula/ui.json";
import draculaBook from "./content/dracula/book.json";
import { minaSeat } from "@mina-seat";
import { makeSeat } from "./seatMake";
import type { Seat } from "./seatMake";

export type { Seat } from "./seatMake";

declare const __SEAT__: string;
declare const __DEMO__: boolean;

export const SEATS: Record<string, Seat> = {
  dracula: makeSeat("dracula", draculaConfig, draculaEvents, draculaFlavor, draculaUi, draculaBook),
  ...(minaSeat ? { mina: minaSeat } : {}),
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
