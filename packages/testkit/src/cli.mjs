#!/usr/bin/env node
// Entry point used by every game's npm scripts, run from the game folder:
//   node ../packages/testkit/src/cli.mjs <command> [args]
// It loads tests/ui.config.mjs from the current directory (override with UI_CONFIG=<path>), so the
// config can import the game's own jsdom.
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { main } from "./ui-driver.mjs";

const cfgPath = resolve(process.env.UI_CONFIG || "tests/ui.config.mjs");
const cfg = (await import(pathToFileURL(cfgPath).href)).default;
await main(cfg, process.argv.slice(2));
