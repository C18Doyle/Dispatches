import type { Condition } from "@dispatches/engine";

/**
 * The words around a seat's story that the engine does not model: titles, menu and button labels, the adviser's panel, the end-screen headings.
 * Each seat (a playable point of view) has a folder under src/content/ with config.json, events.json, flavor.json, ui.json (this shape), checks.json and book.json.
 * Every seat is in the bundle (src/seats.ts); the player picks one with the switch on the title page. `--seat=<id>` says which a fresh browser starts on.
 */
export interface SeatUi {
  title: string;
  subtitle: string;
  tagline: string;
  beginLabel: string;
  continueLabel: string;
  prologueHeading: string;
  skipLabel: string;
  settingsTitle: string;
  seriesBlurb: string;
  branchLabels: Record<string, string>;
  suspensePhrases: string[];
  /** `format` has {n} for the amount. */
  money: { format: string; label: string; left: string };
  endText: { collapsed: string; closed: string; remembered: string; newRun: string; novelHeading: string };
  adviser: {
    name: string;
    openLabel: string;
    askLabel: string;
    advisedLabel: string;
    advisedNote: string;
    remedyLabel: string;
    remedyNote: string;
    talkLabel: string;
    talkPrefix: string;
    readLabel: string;
    readPrefix: string;
  };
  /** Badge text for an option's `tag` (for example dawn: "Before dawn"). A tag with no entry shows no badge. */
  tags?: Record<string, string>;
  /** The ending screen's plain account of the people the run touched: for each person, the first line whose condition holds. */
  account?: { heading: string; intro: string; people: { name: string; lines: { when: Condition; text: string }[] }[] };
  /** A sketch map of the seat's journey, redrawn from the state. */
  map?: SeatMap;
  /** The button on the title page that switches to the other seat. */
  switchSeat?: { to: string; label: string; note: string };
  /** Each Act II track: a plate shown on its first scene (picture, epigraph) and the colour the page glow takes while it is played. */
  tracks?: Record<string, { epigraph: string; place: string; tint: string }>;
  /** Any of the shared screen labels (src/labels.json) this seat says in its own words. */
  labels?: Partial<Record<string, unknown>>;
  /** The theme a first-time player of this seat sees (themes.json id). */
  defaultTheme?: string;
  /** Pictures for seats with no map: the place each scene is set in (`at`, `defaultAt`), a place for each ending (`endings`), and the title picture. */
  art?: { at: Record<string, string>; defaultAt: string; endings?: Record<string, string>; title?: "castle" | "cliff" };
}

export interface SeatMap {
  heading: string;
  note: string;
  places: { id: string; label: string; x: number; y: number }[];
  routes: [string, string][];
  /** Which place a scene happens at; `defaultAt` for the rest. */
  at: Record<string, string>;
  defaultAt: string;
  /** In order; the last whose condition holds decides a place's state. */
  states: { place: string; when: Condition; state: "held" | "sealed" | "safe" }[];
  stateLabels: Record<"held" | "sealed" | "safe", string>;
}

/** Where the novel's own events and the player's choices part: the option (or options) that match what the book does, scene by scene. */
export interface SeatBook {
  heading: string;
  intro: string;
  road: Record<string, { options: number[]; note: string; claim: string }>;
}
