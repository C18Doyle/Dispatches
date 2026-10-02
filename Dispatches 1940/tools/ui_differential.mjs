#!/usr/bin/env node
// Headless UI-differential test for Dispatches 1940 (jsdom; no browser needed).
//
// Plays seeded runs through the REAL built app (dist/full/bundle.js), hashing the page text after
// every click, and compares them to runs recorded from the pre-refactor build. Seeds drive both
// Math.random (rolls, wire headlines) and the choice picking, so a run is exactly reproducible.
//
//   node tools/ui_differential.mjs record <tag> [bundle=dist/full/bundle.js]  record runs to tests/ui-runs/<tag>/
//   node tools/ui_differential.mjs verify [bundle=dist/full/bundle.js]        record "candidate", compare to tests/baseline/ui
//   node tools/ui_differential.mjs compare <baselineDir> <candidateDir>
//   node tools/ui_differential.mjs one <campaign> <easy|open|hard> <seed>    (TRACE=1 prints each step)
//
// A baseline run that CRASHED (the game's "The File Was Damaged" screen) only has to match up to the
// crash; the candidate must not crash. Anything else that differs fails (exit 1).
import { JSDOM } from "jsdom";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// [id, card text prefix on the select screen]
const CAMPAIGNS = [
  ["german", "OKW"],
  ["soviet", "STAVKA"],
  ["allied", "SHAEF"],
  ["italy", "COMANDO"],
];
// The three buttons right after a campaign card, in order.
const MODES = ["easy", "open", "hard"];
const SEEDS = [1, 2, 3, 4];
const MAX_STEPS = 500;
const STALL_LIMIT = 8;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const mulberry = (seed) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

async function playRun(bundle, [campaignId, cardPrefix], mode, seed) {
  const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
    runScripts: "outside-only",
    pretendToBeVisual: true,
    url: "https://example.com/",
  });
  const w = dom.window;
  const d = w.document;
  // jsdom has no media playback, scrolling or real fetch; the game degrades gracefully without them.
  w.HTMLMediaElement.prototype.play = () => Promise.resolve();
  w.HTMLMediaElement.prototype.pause = () => {};
  w.HTMLMediaElement.prototype.load = () => {};
  w.scrollTo = () => {};
  w.Element.prototype.scrollIntoView = () => {};
  w.fetch = async () => ({ ok: true, json: async () => ({}) });
  w.eval(`(function(){var a=${seed}>>>0;Math.random=function(){a=(a+0x6d2b79f5)>>>0;var t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296}})()`);
  const errors = [];
  w.addEventListener("error", (e) => errors.push(String(e.message)));
  const origErr = w.console.error;
  const origLog = w.console.log;
  w.console.error = (...a) => errors.push(a.map(String).join(" ").slice(0, 200));
  w.console.log = () => {};
  try {
    w.eval(bundle);
  } catch (e) {
    return { campaignId, mode, seed, error: "bundle failed: " + e.message, n: 0, hashes: "", crashed: false };
  }

  const text = () => {
    const root = d.body.cloneNode(true);
    root.querySelectorAll("style,script,audio").forEach((n) => n.remove());
    return root.textContent.replace(/\s+/g, " ").trim();
  };
  const hash = () => {
    const t = text();
    return createHash("sha1").update(t).digest("base64url").slice(0, 8) + ":" + t.length;
  };
  const settle = async () => {
    let last = hash();
    let stable = 0;
    for (let i = 0; i < 120 && stable < 3; i++) {
      await sleep(8);
      const h = hash();
      if (h === last) stable++;
      else {
        stable = 0;
        last = h;
      }
    }
  };
  const lab = (b) => (b.getAttribute("aria-label") || b.textContent).trim().replace(/\s+/g, " ");
  const buttons = () => [...d.querySelectorAll("button")].filter((b) => !b.disabled);
  const click = async (el) => {
    el.dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
    await sleep(4);
    await settle();
  };
  const fail = (why) => ({ campaignId, mode, seed, error: why, n: 0, hashes: "", crashed: false });

  await sleep(300);
  await settle();
  const pick = mulberry(seed ^ 0x9e3779b9);

  // Settings on the select screen: instant text on, so the typewriter cannot race the hash.
  const instant = buttons().find((b) => lab(b) === "Off" && /instant/i.test(b.parentElement?.parentElement?.textContent || ""));
  if (instant) await click(instant);

  // Campaign card, then one of the three mode buttons that appear right after it.
  const card = buttons().find((b) => lab(b).startsWith(cardPrefix));
  if (!card) return fail("campaign card missing: " + cardPrefix);
  await click(card);
  const all = buttons();
  const at = all.indexOf(buttons().find((b) => lab(b).startsWith(cardPrefix)));
  const modeBtn = all[at + 1 + MODES.indexOf(mode)];
  if (!modeBtn) return fail("mode button missing: " + mode);
  await click(modeBtn);
  const enter = buttons().find((b) => /^Enter the War Room/i.test(lab(b)));
  if (!enter) return fail("no war room button; saw " + buttons().map(lab).join(" | ").slice(0, 160));
  await click(enter);

  const SKIP = /^(save|home|back|show|hide|rewind|text size|restart|switch|new campaign|copy|share|download|settings|map|close)/i;
  const PROCEED = /^(continue|proceed|acknowledge|next|file|report|commit|confirm|begin|issue|resolve|reveal|end|enter|deploy|execute|launch|submit|accept|read)/i;
  const hashes = [hash()];
  const trail = [];
  let crashed = false;
  let stalled = 0;
  let battleApproachChosen = false;
  let stopped = "";
  for (let i = 0; i < MAX_STEPS; i++) {
    const t = text();
    if (/The File Was Damaged/.test(t)) {
      crashed = true;
      break;
    }
    if (/File Closed/.test(t)) {
      stopped = "ended";
      break;
    }
    const bs = buttons().filter((b) => !SKIP.test(lab(b)) && !/rewind/i.test(lab(b)));
    let b;
    if (/Order of Battle/.test(t) && bs.some((x) => /^Add a chit/.test(lab(x)) || /Tactical Approach/.test(t))) {
      // Key Battle (Order of Battle) planning screen. Policy: commit if a commit-like button is live;
      // otherwise choose a tactical approach once, then spend chits at random, then commit.
      const chits = bs.filter((x) => /^Add a chit/.test(lab(x)));
      // Commander buttons all say "— favors ..."; the approaches (what chits unlock) do not.
      const others = bs.filter((x) => !/^Add a chit|favors|^No particular emphasis|Reconnaissance Pass/.test(lab(x)));
      const commit = others.find((x) => PROCEED.test(lab(x)));
      if (commit) b = commit;
      else if (!battleApproachChosen && others.length) {
        b = others[Math.floor(pick() * others.length)];
        battleApproachChosen = true;
      } else if (chits.length) b = chits[Math.floor(pick() * chits.length)];
      else b = others[0] || bs[0];
    } else {
      battleApproachChosen = false;
      const choices = bs.filter((x) => lab(x).length >= 45);
      if (choices.length) b = choices[Math.floor(pick() * choices.length)];
      else b = bs.find((x) => PROCEED.test(lab(x))) || bs[0];
    }
    if (!b) {
      stopped = "no-button";
      break;
    }
    // DEBUG_BUTTONS="<text>" dumps the live buttons the first time that text is on screen.
    if (process.env.DEBUG_BUTTONS && t.includes(process.env.DEBUG_BUTTONS) && !globalThis.__dbg) {
      globalThis.__dbg = 1;
      console.log("BUTTONS:", buttons().map((x) => lab(x).slice(0, 90)));
    }
    trail.push(lab(b).slice(0, 22));
    if (process.env.TRACE) console.log(`  [${campaignId}/${mode} s${seed}] ${i}: ${lab(b).slice(0, 30)} | ${t.slice(0, 90)}`);
    await click(b);
    const h = hash();
    stalled = h === hashes[hashes.length - 1] ? stalled + 1 : 0;
    hashes.push(h);
    if (stalled >= STALL_LIMIT) {
      stopped = "stalled";
      break;
    }
  }
  if (/The File Was Damaged/.test(text())) crashed = true;
  const out = {
    campaignId,
    mode,
    seed,
    n: hashes.length,
    stopped,
    crashed,
    errors: errors.filter((e) => !/Not implemented/.test(e)).slice(0, 2),
    hashes: hashes.join(","),
    tail: trail.slice(-3),
    lastText: text().slice(0, 1500),
  };
  w.console.error = origErr;
  w.console.log = origLog;
  w.close();
  return out;
}

async function recordAll(bundlePath, outDir) {
  const bundle = readFileSync(bundlePath, "utf8");
  mkdirSync(outDir, { recursive: true });
  const summary = [];
  // ONLY=<campaign id> re-records just that campaign into the existing directory.
  for (const camp of CAMPAIGNS.filter((c) => !process.env.ONLY || c[0] === process.env.ONLY))
    for (const mode of MODES)
      for (const seed of SEEDS) {
        const r = await playRun(bundle, camp, mode, seed);
        const name = `${camp[0]}-${mode}-${seed}`;
        writeFileSync(join(outDir, name + ".json"), JSON.stringify(r));
        summary.push(`${name} n=${r.n} ${r.stopped || ""}${r.crashed ? " CRASHED" : ""}${r.error ? " ERROR " + r.error : ""}`);
      }
  console.log(summary.join("\n"));
  console.log(`recorded ${summary.length} runs to ${outDir}`);
}

function compare(baseDir, candDir) {
  let failures = 0;
  let identical = 0;
  let crashFixed = 0;
  let knownFixed = 0;
  const knownPath = join(baseDir, "..", "known-diffs.json");
  const known = existsSync(knownPath) ? JSON.parse(readFileSync(knownPath, "utf8")) : {};
  const files = readdirSync(baseDir).filter((f) => f.endsWith(".json")).sort();
  for (const f of files) {
    const name = f.replace(".json", "");
    if (!existsSync(join(candDir, f))) {
      console.error(`FAIL ${name}: no candidate run`);
      failures++;
      continue;
    }
    const base = JSON.parse(readFileSync(join(baseDir, f), "utf8"));
    const cand = JSON.parse(readFileSync(join(candDir, f), "utf8"));
    if (base.error || cand.error) {
      console.error(`FAIL ${name}: driver error (${base.error || cand.error})`);
      failures++;
      continue;
    }
    const bh = base.hashes.split(",");
    const ch = cand.hashes.split(",");
    if (base.crashed) {
      const prefix = bh.length - 1; // the last hash is the damaged-file screen
      const same = bh.slice(0, prefix).every((h, i) => h === ch[i]);
      if (!same || cand.crashed) {
        console.error(`FAIL ${name}: baseline crashed; candidate ${cand.crashed ? "also crashes" : "diverges before the crash"}`);
        failures++;
      } else {
        crashFixed++;
        console.log(`fixed ${name}: baseline crashed after ${prefix} steps; candidate continues for ${ch.length}`);
      }
      continue;
    }
    if (bh.length === ch.length && bh.every((h, i) => h === ch[i]) && !cand.crashed) identical++;
    else if (known[name] && !cand.crashed && bh.findIndex((h, k) => h !== ch[k]) === known[name].firstDiff) {
      // A documented, intentional correction (see tests/baseline/known-diffs.json). Allowed only when
      // the first difference is exactly at the recorded step and the run still completes.
      knownFixed++;
      console.log(`known correction ${name}: differs from step ${known[name].firstDiff} (${known[name].reason})`);
    } else {
      const i = bh.findIndex((h, k) => h !== ch[k]);
      console.error(`FAIL ${name}: first difference at step ${i === -1 ? Math.min(bh.length, ch.length) : i} (baseline ${bh.length}, candidate ${ch.length}${cand.crashed ? ", CRASHED" : ""})`);
      failures++;
    }
  }
  console.log(`\n${files.length} runs: ${identical} identical, ${crashFixed} crash(es) fixed, ${failures} failure(s).`);
  return failures;
}

const DEFAULT_BUNDLE = join("dist", "full", "bundle.js");
const [mode, a, b] = process.argv.slice(2);
if (mode === "record") {
  await recordAll(b ?? DEFAULT_BUNDLE, join("tests", "ui-runs", a ?? "candidate"));
} else if (mode === "verify") {
  await recordAll(a ?? DEFAULT_BUNDLE, join("tests", "ui-runs", "candidate"));
  process.exit(compare(join("tests", "baseline", "ui"), join("tests", "ui-runs", "candidate")) ? 1 : 0);
} else if (mode === "compare") {
  process.exit(compare(a, b) ? 1 : 0);
} else if (mode === "one") {
  const r = await playRun(readFileSync(process.env.BUNDLE || DEFAULT_BUNDLE, "utf8"), CAMPAIGNS.find((c) => c[0] === a), b, Number(process.argv[5]));
  console.log(r.n, r.stopped, r.crashed, r.error, r.errors);
} else {
  console.error("usage: record <tag> [bundle] | verify [bundle] | compare <baselineDir> <candidateDir> | one <campaign> <mode> <seed>");
  process.exit(2);
}
