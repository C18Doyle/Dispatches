/** Node-side loader: reads a game's three JSON files into a GameDefinition. Scripts only; the app imports the JSON directly. */
import { readFileSync } from "node:fs";
import type { GameDefinition } from "../src/index";

export function loadDefinition(game: string): GameDefinition {
  const read = (f: string) => JSON.parse(readFileSync(`src/content/${game}/${f}`, "utf8"));
  return { config: read("config.json"), content: read("events.json"), flavor: read("flavor.json") };
}
