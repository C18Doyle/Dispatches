#!/usr/bin/env node
// Headless UI-differential test for Dispatches 1914 (internally titled 1918) (jsdom; no browser needed).
//
// Plays seeded runs through the REAL built app (dist/bundle.js), hashing the page text after
// every click, and compares them to runs recorded from the pre-refactor build. Seeds drive both
// Math.random (rolls) and the choice picking, so a run is exactly reproducible.
//
//   node tools/ui_differential.mjs record <tag> [bundle=dist/bundle.js]   record runs to tests/ui-runs/<tag>/
//   node tools/ui_differential.mjs verify  [bundle=dist/bundle.js]         record "candidate", compare to tests/baseline/ui
//   node tools/ui_differential.mjs compare <baselineDir> <candidateDir>
//
// A baseline run that CRASHED (the page emptied) only has to match up to the crash; the candidate
// must not crash. Anything else that differs fails (exit 1).
import { JSDOM } from "jsdom";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// [id, text on the menu card]. The Ottoman, BEF and AOK cards are disabled (no content yet).
const CAMPAIGNS = [
  ["ohl", "Oberste"],
  ["gqg", "Grand Quartier"],
  ["stavka", "Stavka"],
];
const SEEDS = [1, 2, 3, 4, 5, 6, 7, 8];
const MAX_STEPS = 400;

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

async function playRun(bundle, [campaignId, label], hard, seed) {
  hard = false; // the 1914 UI has no hard-mode switch yet
  const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
    runScripts: "outside-only",
    pretendToBeVisual: true,
    url: "https://example.com/",
  });
  const w = dom.window;
  const d = w.document;
  // Seed the game's randomness inside the page.
  w.eval(`(function(){var a=${seed}>>>0;Math.random=function(){a=(a+0x6d2b79f5)>>>0;var t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296}})()`);
  const errors = [];
  w.addEventListener("error", (e) => errors.push(String(e.message)));
  const origErr = w.console.error;
  w.console.error = (...a) => errors.push(a.map(String).join(" ").slice(0, 200));
  w.eval(bundle);

  // Page text without <style>/<script> contents (the app injects its font @import as a style tag).
  const text = () => {
    const root = d.body.cloneNode(true);
    root.querySelectorAll("style,script").forEach((n) => n.remove());
    return root.textContent.replace(/\s+/g, " ").trim();
  };
  const hash = () => {
    const t = text();
    return createHash("sha1").update(t).digest("base64url").slice(0, 8) + ":" + t.length;
  };
  const settle = async () => {
    let last = hash();
    let stable = 0;
    for (let i = 0; i < 100 && stable < 3; i++) {
      await sleep(8);
      const h = hash();
      if (h === last) stable++;
      else {
        stable = 0;
        last = h;
      }
    }
  };
  const click = async (el) => {
    el.dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
    await sleep(4);
    await settle();
  };
  const buttons = () => [...d.querySelectorAll("button")].filter((b) => !b.disabled);
  const lab = (b) => b.textContent.trim().replace(/\s+/g, " ");
  const findText = (needle) => {
    const c = [];
    (function walk(n) {
      if (n.nodeType !== 1 || n.tagName === "SCRIPT" || n.tagName === "STYLE") return;
      if ((n.textContent || "").trim().includes(needle)) c.push(n);
      for (const k of n.children) walk(k);
    })(d.body);
    c.sort((a, b) => a.textContent.trim().length - b.textContent.trim().length);
    return c[0];
  };

  await settle();
  const pick = mulberry(seed ^ 0x9e3779b9);
  const fail = (why) => ({ campaignId, hard, seed, error: why, n: 0, hashes: "", crashed: false });

  // Menu: the campaign card is a button.
  const card = buttons().find((b) => lab(b).includes(label));
  if (!card) return fail("campaign card missing: " + label);
  await click(card);

  const hashes = [hash()];
  const trail = [];
  let crashed = false;
  let ended = false;
  for (let i = 0; i < MAX_STEPS; i++) {
    if (text().length < 20) {
      crashed = true; // the React root unmounted
      break;
    }
    const bs = buttons();
    const orders = bs.filter((x) => x.className === "dg-choice");
    let b;
    if (orders.length) b = orders[Math.floor(pick() * orders.length)];
    else b = bs.find((x) => lab(x) === "Continue");
    if (!b) {
      ended = true; // no way forward: an ending (or the end stub) screen
      break;
    }
    trail.push(lab(b).slice(0, 20));
    if (process.env.TRACE) console.log(`  [${campaignId} s${seed}] ${i}: ${lab(b).slice(0, 18)} | ${text().slice(0, 110)}`);
    await click(b);
    hashes.push(hash());
  }
  if (text().length < 20) crashed = true;
  const out = {
    campaignId,
    hard,
    seed,
    n: hashes.length,
    ended,
    crashed,
    errors: errors.slice(0, 2),
    hashes: hashes.join(","),
    tail: trail.slice(-3),
    lastText: text().slice(0, 1500),
  };
  w.console.error = origErr;
  w.close();
  return out;
}

async function recordAll(bundlePath, outDir) {
  const bundle = readFileSync(bundlePath, "utf8");
  mkdirSync(outDir, { recursive: true });
  const summary = [];
  for (const camp of CAMPAIGNS)
    for (const hard of [false])
      for (const seed of SEEDS) {
        const r = await playRun(bundle, camp, hard, seed);
        const name = `${camp[0]}-open-${seed}`;
        writeFileSync(join(outDir, name + ".json"), JSON.stringify(r));
        summary.push(`${name} n=${r.n} ended=${r.ended}${r.crashed ? " CRASHED" : ""}${r.error ? " ERROR " + r.error : ""}`);
      }
  console.log(summary.join("\n"));
  console.log(`recorded ${summary.length} runs to ${outDir}`);
}

function compare(baseDir, candDir) {
  let failures = 0;
  let identical = 0;
  let crashFixed = 0;
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
      const prefix = bh.length - 1; // the last hash is the page after the crashing click (empty root)
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
    else {
      const i = bh.findIndex((h, k) => h !== ch[k]);
      console.error(`FAIL ${name}: first difference at step ${i === -1 ? Math.min(bh.length, ch.length) : i} (baseline ${bh.length}, candidate ${ch.length}${cand.crashed ? ", CRASHED" : ""})`);
      failures++;
    }
  }
  console.log(`\n${files.length} runs: ${identical} identical, ${crashFixed} crash(es) fixed, ${failures} failure(s).`);
  return failures;
}

const [mode, a, b] = process.argv.slice(2);
if (mode === "record") {
  await recordAll(b ?? "dist/bundle.js", join("tests", "ui-runs", a ?? "candidate"));
} else if (mode === "verify") {
  await recordAll(a ?? "dist/bundle.js", join("tests", "ui-runs", "candidate"));
  process.exit(compare(join("tests", "baseline", "ui"), join("tests", "ui-runs", "candidate")) ? 1 : 0);
} else if (mode === "one") {
  const bundle = readFileSync("dist/bundle.js", "utf8");
  const r = await playRun(bundle, CAMPAIGNS.find((c) => c[0] === a), b === "hard", Number(process.argv[5]));
  console.log(r.n, r.crashed, r.errors);
} else if (mode === "compare") {
  process.exit(compare(a, b) ? 1 : 0);
} else {
  console.error("usage: record <tag> [bundle] | verify [bundle] | compare <baselineDir> <candidateDir>");
  process.exit(2);
}
