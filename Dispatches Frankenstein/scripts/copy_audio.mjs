import { mkdirSync, copyFileSync } from "node:fs";
mkdirSync("dist/audio", { recursive: true });
copyFileSync("audio/lament.mp3", "dist/audio/lament.mp3");
