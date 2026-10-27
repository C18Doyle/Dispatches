import { def } from "./game";

/**
 * The shelf at the start of the game: one major case and four minor ones. The order is the order of the shelf scene's options (scene "0" in events.json),
 * so a volume's index here is the index of its option there. Endings are told to volumes by id; The Final Problem owns every ending the others do not.
 */
export interface Volume {
  id: string;
  title: string;
  year: string;
  major: boolean;
  /** The scene that opens the volume. */
  start: string;
  /** Branches whose scenes belong to it. */
  branches: string[];
  /** The endings that belong to a minor case (the major case owns the rest). */
  endings?: string[];
}

export const VOLUMES: Volume[] = [
  { id: "FINAL", title: "The Final Problem", year: "1891", major: true, start: "1", branches: ["WEB", "YARD", "STREET", "CONTINENT", "MYCROFT", "HIATUS"] },
  { id: "BAND", title: "The Speckled Band", year: "1883", major: false, start: "R1", branches: ["BAND"], endings: ["ENDING_THE_BAND_RETURNS", "ENDING_THE_WHISTLE_MISSED", "ENDING_THE_DOCTOR_LIVES", "ENDING_THE_ADDER_AT_THE_INQUEST"] },
  { id: "BOHEMIA", title: "A Scandal in Bohemia", year: "1888", major: false, start: "B1", branches: ["BOHEMIA"], endings: ["ENDING_THE_WOMAN", "ENDING_THE_STRONGBOX", "ENDING_THE_KING_WAITS", "ENDING_THE_UNDERTAKING"] },
  { id: "CARBUNCLE", title: "The Blue Carbuncle", year: "1889", major: false, start: "G1", branches: ["CARBUNCLE"], endings: ["ENDING_THE_CHRISTMAS_MERCY", "ENDING_THE_STONE_RETURNED", "ENDING_THE_STONE_LOST", "ENDING_THE_GOOSE_CLUB"] },
  { id: "LEAGUE", title: "The Red-Headed League", year: "1890", major: false, start: "L1", branches: ["LEAGUE"], endings: ["ENDING_THE_LEAGUE_DISSOLVED", "ENDING_THE_TUNNEL_OPEN", "ENDING_THE_ENCYCLOPAEDIA", "ENDING_THE_UMBRELLA"] },
];

export const MINOR_BRANCHES = VOLUMES.filter((v) => !v.major).flatMap((v) => v.branches);

/** The endings a volume owns: its own list, or for the major case everything that is left. */
export function endingsOf(volume: Volume): string[] {
  if (volume.endings) return volume.endings.filter((id) => def.content.endings[id]);
  const taken = new Set(VOLUMES.flatMap((v) => v.endings ?? []));
  return Object.keys(def.content.endings).filter((id) => !taken.has(id));
}

export function volumeOfEnding(endingId: string): Volume {
  return VOLUMES.find((v) => v.endings?.includes(endingId)) ?? VOLUMES[0];
}

export function volumeOfBranch(branch: string): Volume | undefined {
  return VOLUMES.find((v) => v.branches.includes(branch));
}

export interface VolumeStat {
  volume: Volume;
  found: number;
  total: number;
  /** At least one ending of the volume has been reached in this browser. */
  finished: boolean;
}

export function volumeStats(endingsSeen: Set<string>): VolumeStat[] {
  return VOLUMES.map((volume) => {
    const ids = endingsOf(volume);
    const found = ids.filter((id) => endingsSeen.has(id)).length;
    return { volume, found, total: ids.length, finished: found > 0 };
  });
}
