// Tests a game's save-migration helper (NODE_ALIASES / SAVE_MIGRATIONS / migrateSave, see docs/SAVES.md) without
// running the game. The helper is cut out of the game's source part, its two tables are replaced with test ones and
// SAVE_SCHEMA_VERSION is pretended to be 3, so what is tested is the real code that ships.
//
//   import { checkMigrationHelper } from "../../packages/testkit/src/migration-check.mjs";
//   checkMigrationHelper({ part: "src/parts/40-app.jsx", idField: "nodeId", listField: "visitedNodes" })
//
// Checks: a version-1 save is upgraded through every step in order; renamed nodes are rewritten in the id field and
// the list field; a save from a newer build, an unversioned save and a save with a missing migration step are all
// refused (null) rather than half-loaded.
import { readFileSync } from "node:fs";
import vm from "node:vm";

export function checkMigrationHelper({ part, idField, listField }) {
  const src = readFileSync(part, "utf8").replace(/\r\n/g, "\n");
  const start = src.indexOf("const NODE_ALIASES = {};");
  const fn = src.indexOf("function migrateSave(");
  if (start < 0 || fn < 0) return [`${part}: no NODE_ALIASES / migrateSave helper found (see docs/SAVES.md)`];
  const end = src.indexOf("\n}\n", fn) + 3;
  const helper = src.slice(start, end);
  if (!helper.includes("const SAVE_MIGRATIONS = {};")) return [`${part}: SAVE_MIGRATIONS table not found next to NODE_ALIASES`];

  const run = (migrations) => {
    const code =
      "const SAVE_SCHEMA_VERSION = 3;\n" +
      helper.replace("const NODE_ALIASES = {};", 'const NODE_ALIASES = { oldNode: "newNode" };').replace("const SAVE_MIGRATIONS = {};", `const SAVE_MIGRATIONS = ${migrations};`) +
      "\nmodule.exports = { migrateSave };";
    const sandbox = { module: { exports: {} } };
    vm.runInNewContext(code, sandbox);
    return sandbox.module.exports.migrateSave;
  };
  const both = "{ 1: (s) => ({ ...s, flags: { ...s.flags, step1: true } }), 2: (s) => ({ ...s, flags: { ...s.flags, step2: true } }) }";
  const save = (v) => ({ schemaVersion: v, flags: {}, [idField]: "oldNode", [listField]: ["a", "oldNode", "b"] });
  const problems = [];
  const expect = (cond, msg) => cond || problems.push(`${part}: ${msg}`);

  const migrate = run(both);
  const up = migrate(save(1));
  expect(up && up.schemaVersion === 3, "a version-1 save should come out at the current version");
  expect(up && up.flags.step1 && up.flags.step2, "every migration step should run, in order");
  expect(up && up[idField] === "newNode", `a renamed node should be rewritten in ${idField}`);
  expect(up && JSON.stringify(up[listField]) === JSON.stringify(["a", "newNode", "b"]), `a renamed node should be rewritten in ${listField}`);
  const current = migrate(save(3));
  expect(current && current[idField] === "newNode", "a current-version save should still get node aliases applied");
  expect(migrate(save(4)) === null, "a save from a newer build should be refused");
  expect(migrate({ ...save(3), schemaVersion: undefined }) === null, "an unversioned save should be refused");
  expect(migrate(null) === null && migrate("x") === null, "a non-object save should be refused");
  expect(run("{ 2: (s) => s }")(save(1)) === null, "a save with a missing migration step should be refused, not half-loaded");
  return problems;
}

/** CLI wrapper used by the games' tests: prints and exits non-zero on problems. */
export function runMigrationCheck(opts) {
  const problems = checkMigrationHelper(opts);
  for (const p of problems) console.error("FAIL: " + p);
  console.log(problems.length ? `${problems.length} migration problem(s)` : `${opts.part}: save migration helper ok`);
  process.exit(problems.length ? 1 : 0);
}
