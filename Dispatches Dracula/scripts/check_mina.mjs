// check_mina.mjs: everything that keeps the hidden second seat (Mina's campaign, src/content/mina) honest. It is not in the shipped game and has no screen of its own
// on the title page, so these are the only things that would notice it rotting. Run: npm run check:mina (it is part of npm test).
//   schema, writing rules, repetition, the 240-run behaviour baseline (tests/fixtures/mina-baseline.json), the exhaustive validator, the balance check,
//   and a build of the seat plus a playthrough of it through the real screens.
// To bring the seat back into the game: see "The hidden seat" in CLAUDE.md.
import { spawnSync } from "node:child_process";

const win = process.platform === "win32";
const run = (label, cmd, args, env = {}) => {
  process.stdout.write(`\n>>> mina: ${label}\n`);
  const r = spawnSync(cmd, args, { stdio: "inherit", shell: win, env: { ...process.env, ...env } });
  if (r.status !== 0) {
    console.error(`mina: "${label}" failed`);
    process.exit(1);
  }
};
const npx = win ? "npx.cmd" : "npx";
run("schema", npx, ["tsx", "../packages/engine/tools/validate_schema.ts", "mina"]);
run("writing", "node", ["scripts/check_writing.mjs"], { GAME: "mina" });
run("repetition", "node", ["scripts/check_repetition.mjs", "--strict"], { GAME: "mina" });
run("names", "node", ["scripts/check_names.mjs"], { GAME: "mina" });
run("voice", "node", ["scripts/check_voice.mjs", "--strict"], { GAME: "mina" });
run("behaviour baseline", npx, ["tsx", "../packages/engine/tools/verify_baseline.ts", "mina"], { BASELINE: "tests/fixtures/mina-baseline.json" });
run("validator", npx, ["tsx", "scripts/validate.ts"], { GAME: "mina" });
run("balance", npx, ["tsx", "scripts/balance_check.ts"], { GAME: "mina" });
run("styles", npx, ["tailwindcss", "-i", "./src/index.css", "-o", "./dist/styles.css", "--minify"]);
run("build", "node", ["esbuild.config.mjs", "--seat=mina"]);
run("build (page)", "node", ["scripts/inline.mjs", "--seat=mina"]);
run("playthrough", "node", ["scripts/check_seat.mjs", "mina"]);
console.log("\nThe Mina seat is intact.");
