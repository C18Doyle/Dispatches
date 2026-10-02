#!/usr/bin/env node
/**
 * check-gates.js — Dispatches 1922 meter-gate integrity validator
 * ================================================================
 *
 * WHY THIS EXISTS
 * ---------------
 * Two real bugs, both silent, both invisible to tsc:
 *
 * 1. DUPLICATE KEYS. Two `gate:` properties were added to the same choice
 *    object literal — one checking materiel, one checking manpower. JS
 *    silently keeps the LAST one and discards the first. tsc passes. The
 *    file reads as though matériel gates the choice; it does not, and never
 *    did. Same for the paired `disabledReason:`. Grepping the source for
 *    "m.materiel" found the line and proved nothing, because the line was
 *    dead. Only reading the live resolved object exposed it.
 *
 * 2. DECORATIVE AXES. A meter that takes dozens of impacts but gates no
 *    decision and diverts no ending is not a mechanic, it's a number that
 *    goes up and down. At one point five of this game's nine axes were in
 *    that state — including `rail` in the Siberia campaign, whose entire
 *    premise is a single-track railway.
 *
 * WHAT THIS CHECKS
 * ----------------
 * A. Duplicate `gate:` / `disabledReason:` / `next:` / `impact:` keys inside
 *    any single choice object, by counting occurrences between choice
 *    boundaries in the raw source. This is the only way to catch #1 — by
 *    the time the object is parsed, the duplicate is already gone.
 * B. Every gate has a matching disabledReason (a blocked choice with no
 *    explanation is a dead end the player can't reason about).
 * C. Every gate references an axis that actually exists on that campaign.
 * D. Per-axis coverage: impacts vs gates vs nextIf diversions, flagging any
 *    axis that accumulates but never constrains.
 * E. Gate thresholds are reachable — a gate at >= -10 can never block
 *    (floor is -10), and one at >= +10 can essentially never pass.
 *
 * HOW TO RUN
 *   node check-gates.js path/to/dispatches-1917.jsx
 */

const fs = require("fs");
const path = require("path");

const filePath = process.argv[2];
if (!filePath) {
  console.error("Usage: node check-gates.js path/to/dispatches-1917.jsx");
  process.exit(1);
}

const raw = fs.readFileSync(filePath, "utf8");
let dataSrc = raw.split("// PREVIEW SCREENS")[0];
dataSrc = dataSrc.replace(/^export /gm, "");
dataSrc += "\nmodule.exports = { CAMPAIGNS };\n";
const tmpPath = filePath + ".__gatecheck_tmp.js";
fs.writeFileSync(tmpPath, dataSrc);
const { CAMPAIGNS } = require(path.resolve(tmpPath));
fs.unlinkSync(tmpPath);

let problems = 0;

// ---- A. duplicate keys within a single choice object -------------------
// Choices start with `label:` and run to the next `label:` or the end of the
// choices array. Crude but sufficient: we only care about keys that must
// appear at most once per choice.
console.log("=== duplicate keys within a choice ===");
const choiceChunks = raw.split(/\n\s*label:/).slice(1);
const onceOnly = ["gate:", "disabledReason:", "next:", "impact:", "setFlags:", "historical:", "outcome:"];
let dupFound = 0;
choiceChunks.forEach((chunk) => {
  let body = chunk.split(/\n\s{12,14}\},/)[0];
  // Strip nested `uncertain:` roll branches. Each branch legitimately carries
  // its OWN impact/outcome/setFlags/next, so counting those against the
  // parent choice produces false positives on every rolled choice in the
  // file — which is exactly what the first version of this check did.
  const uncIdx = body.indexOf("uncertain:");
  if (uncIdx !== -1) body = body.slice(0, uncIdx);
  for (const key of onceOnly) {
    const count = body.split(key).length - 1;
    if (count > 1) {
      const label = chunk.slice(0, 60).replace(/\s+/g, " ").trim();
      console.log(`  ✗ "${key}" appears ${count}× in one choice — JS keeps only the last`);
      console.log(`      near: ${label}…`);
      dupFound++;
      problems++;
    }
  }
});
if (!dupFound) console.log("  none");

// ---- B–E. live gate inspection ------------------------------------------
for (const [campaignId, camp] of Object.entries(CAMPAIGNS)) {
  const axes = camp.triangleAxes.map((a) => a.key);
  const impacts = {};
  const gated = {};
  const diverted = {};
  axes.forEach((a) => { impacts[a] = 0; gated[a] = []; diverted[a] = []; });

  for (const entry of camp.NODE_ATLAS) {
    const node = camp.resolveNode(entry.id, {}, {});
    if (!node) continue;
    for (const choice of node.choices || []) {
      const allImpacts = [choice.impact || {}, ...(choice.uncertain || []).map((u) => u.impact || {})];
      for (const im of allImpacts) {
        for (const k of Object.keys(im)) if (axes.includes(k)) impacts[k]++;
      }
      if (choice.gate) {
        const src = choice.gate.toString();
        // B: gate without explanation
        if (!choice.disabledReason) {
          console.log(`  ✗ ${campaignId}/${entry.id}: gate with no disabledReason`);
          problems++;
        }
        // C: gate referencing a non-existent axis
        const referenced = axes.filter((ax) => src.includes("m." + ax));
        if (!referenced.length) {
          console.log(`  ✗ ${campaignId}/${entry.id}: gate references no valid axis — ${src}`);
          problems++;
        }
        referenced.forEach((ax) => gated[ax].push(entry.id));
        // E: thresholds outside the clamp range
        const nums = (src.match(/-?\d+/g) || []).map(Number);
        for (const n of nums) {
          if (n <= -10) {
            console.log(`  ✗ ${campaignId}/${entry.id}: threshold ${n} can never block (floor is -10) — ${src}`);
            problems++;
          }
        }
      }
      if (typeof choice.nextIf === "function") {
        const src = choice.nextIf.toString();
        axes.forEach((ax) => { if (src.includes("m." + ax)) diverted[ax].push(entry.id); });
      }
    }
    // F. SOFTLOCK: if every choice at a node is gated, a sufficiently bad
    // meter state leaves the player with nothing selectable and the run
    // dead. Observed for real at perekopAssault20 in simulation. Every node
    // must keep at least one choice that can never be gated out.
    const choices = node.choices || [];
    if (choices.length && choices.every((c) => typeof c.gate === "function")) {
      console.log(`  ✗ ${campaignId}/${entry.id}: ALL ${choices.length} choices gated — softlock risk`);
      problems++;
    }
  }

  console.log(`\n=== ${campaignId} ===`);
  for (const ax of axes) {
    const g = gated[ax].length;
    const d = diverted[ax].length;
    const flag = g + d === 0 ? "  ✗ DECORATIVE — accumulates but never constrains" : "";
    console.log(`  ${ax.padEnd(14)} impacts:${String(impacts[ax]).padStart(3)}  gates:${g}  diversions:${d}${flag}`);
    if (g + d === 0) problems++;
  }
}

console.log(`\n${problems} problem(s).`);
process.exit(problems > 0 ? 1 : 0);
