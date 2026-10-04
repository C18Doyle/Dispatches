// Save-migration helper test (see packages/testkit/src/migration-check.mjs). Run: npm run test:migration
import { runMigrationCheck } from "../../packages/testkit/src/migration-check.mjs";
runMigrationCheck({ part: "src/58-persistence.jsx", idField: "nodeId", listField: "visited" });
