/** The ledger's pure functions: parsing is forgiving, recording adds up, and every flag a run can carry has a note. */
import { reduce, createInitialState } from "@dispatches/engine";
import type { GameState } from "@dispatches/engine";
import { def } from "../src/game";
import { carriedNotes, emptyLedger, parseLedger, recordRun, runRecord, summaryText } from "../src/ledger";

let failures = 0;
const check = (ok: boolean, what: string) => {
  if (!ok) {
    failures++;
    console.error("FAIL: " + what);
  }
};

check(JSON.stringify(parseLedger(null)) === JSON.stringify(emptyLedger()), "null reads as empty");
check(parseLedger("not json").runs.length === 0, "damaged text reads as empty");
check(parseLedger('{"version":2,"endings":{},"runs":[]}').runs.length === 0, "an unknown version reads as empty");
check(parseLedger('{"version":1,"endings":{"A":2,"B":"x","C":-1},"runs":[]}').endings.A === 2, "good counts survive");
check(Object.keys(parseLedger('{"version":1,"endings":{"A":2,"B":"x","C":-1},"runs":[]}').endings).length === 1, "bad counts are dropped");

// play one deterministic run to an ending
let s: GameState = createInitialState(def);
s = reduce(def, s, { type: "START_GAME" });
s = reduce(def, s, { type: "ADVANCE_PROLOGUE" });
s = reduce(def, s, { type: "ENTER_STORY" });
for (let i = 0; i < 400 && s.phase !== "ENDING"; i++) {
  if (s.phase === "NODE") {
    const node = def.content.nodes[s.currentNodeId];
    let done = false;
    for (let k = 0; k < node.options.length && !done; k++) {
      const next = reduce(def, s, { type: "SELECT_OPTION", optionIndex: k });
      if (next !== s) {
        s = next;
        done = true;
      }
    }
  } else if (s.phase === "ROLL") s = reduce(def, s, { type: "CONDUCT_EXPERIMENT", roll: 0.01 });
  else if (s.phase === "OUTCOME") s = reduce(def, s, { type: "CONTINUE_OUTCOME" });
  else if (s.phase === "INTERLUDE") s = reduce(def, s, { type: "DISMISS_INTERLUDE" });
  else break;
}
check(s.phase === "ENDING" && !!s.endingId, "the scripted run reaches an ending");

const run = runRecord(def, s);
check(run.choices === s.history.length, "choices come from the history");
check(run.experiments <= run.choices, "experiments are a subset of the choices");
let ledger = recordRun(emptyLedger(), run);
ledger = recordRun(ledger, run);
check(ledger.endings[run.endingId] === 2, "the same ending twice counts twice");
check(ledger.runs.length === 2, "both runs are kept");
for (let i = 0; i < 20; i++) ledger = recordRun(ledger, run);
check(ledger.runs.length === 10, "only the last ten runs are kept");
check(parseLedger(JSON.stringify(ledger)).endings[run.endingId] === 22, "a ledger survives storage");

const summary = summaryText(def, run, def.content.endings[run.endingId].title);
check(summary.includes(def.content.endings[run.endingId].title), "the summary names the ending");
check(summary.split("\n").length >= 2, "the summary has at least two lines");
check(carriedNotes(def, { flags: Object.keys(def.flavor.flagNotes ?? {}) }).length === Object.keys(def.flavor.flagNotes ?? {}).length, "every flag note is reachable");

if (failures) process.exit(1);
console.log("Ledger checks passed.");
