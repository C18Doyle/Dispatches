// Shared headless UI-differential test core for the Dispatches games.
//
// A game supplies a small config (see packages/testkit/README.md); this module supplies everything
// else: the jsdom page with seeded randomness, DOM-settled hashing, the step loop, recording,
// comparison against a baseline (with crash and known-difference allowances) and the CLI.
//
// Contract with the games' recorded baselines: a run is `case x seed`, its record holds one hash of
// the page text per click (`hashes`), and `compare` only trusts those hashes plus `crashed`/`error`.
// Keep that stable, or every game's baseline has to be re-recorded.
import { createHash } from "node:crypto";
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { recordSaves, verifySaves, reexpectSaves } from "./save-compat.mjs";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const mulberry = (seed) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/** Builds the page context handed to a game's hooks. */
export function makeContext(cfg, bundle, seed, storage) {
  const dom = new cfg.JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
    runScripts: "outside-only",
    pretendToBeVisual: true,
    url: "https://example.com/",
  });
  const w = dom.window;
  const d = w.document;
  // jsdom has no media playback, scrolling or real fetch; the games degrade gracefully without them.
  w.HTMLMediaElement.prototype.play = () => Promise.resolve();
  w.HTMLMediaElement.prototype.pause = () => {};
  w.HTMLMediaElement.prototype.load = () => {};
  w.scrollTo = () => {};
  w.Element.prototype.scrollIntoView = () => {};
  // fetch: serves files from cfg.assetRoot when the game fetches its own assets (e.g. map JSON); an
  // empty object otherwise.
  w.fetch = async (url) => {
    if (cfg.assetRoot) {
      try {
        const txt = readFileSync(join(cfg.assetRoot, String(url).split("?")[0]), "utf8");
        return { ok: true, json: async () => JSON.parse(txt), text: async () => txt };
      } catch {
        /* fall through to the empty stub */
      }
    }
    return { ok: true, json: async () => ({}) };
  };
  if (!w.matchMedia) w.matchMedia = (q) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
  // Seed the game's randomness inside the page.
  w.eval(`(function(){var a=${seed}>>>0;Math.random=function(){a=(a+0x6d2b79f5)>>>0;var t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296}})()`);

  const errors = [];
  w.addEventListener("error", (e) => errors.push(String(e.message)));
  const origErr = w.console.error;
  const origLog = w.console.log;
  w.console.error = (...a) => errors.push(a.map(String).join(" ").slice(0, 200));
  w.console.log = () => {};

  const ctx = {
    w,
    d,
    errors,
    pick: mulberry(seed ^ 0x9e3779b9),
    // Page text without <style>/<script>/<audio> contents.
    text() {
      const root = d.body.cloneNode(true);
      root.querySelectorAll("style,script,audio").forEach((n) => n.remove());
      return root.textContent.replace(/\s+/g, " ").trim();
    },
    hash() {
      // MASK=1 applies the game's cfg.maskText (used once to prove two builds differ only in fields that a
      // deliberate change touched). Never used for the committed baseline.
      const t = process.env.MASK && cfg.maskText ? cfg.maskText(ctx.text()) : ctx.text();
      return createHash("sha1").update(t).digest("base64url").slice(0, 8) + ":" + t.length;
    },
    async settle() {
      let last = ctx.hash();
      let stable = 0;
      for (let i = 0; i < 120 && stable < 3; i++) {
        await sleep(8);
        const h = ctx.hash();
        if (h === last) stable++;
        else {
          stable = 0;
          last = h;
        }
      }
    },
    async click(el) {
      el.dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
      await sleep(4);
      await ctx.settle();
    },
    lab: (b) => (b.getAttribute("aria-label") || b.textContent).trim().replace(/\s+/g, " "),
    buttons(selector = "button") {
      return [...d.querySelectorAll(selector)].filter((b) => !b.disabled);
    },
    /** Smallest element whose text contains `needle` (for clickable non-button elements). */
    findText(needle) {
      const c = [];
      (function walk(n) {
        if (n.nodeType !== 1 || n.tagName === "SCRIPT" || n.tagName === "STYLE") return;
        if ((n.textContent || "").trim().includes(needle)) c.push(n);
        for (const k of n.children) walk(k);
      })(d.body);
      c.sort((a, b) => a.textContent.trim().length - b.textContent.trim().length);
      return c[0];
    },
    restore() {
      w.console.error = origErr;
      w.console.log = origLog;
      w.close();
    },
  };
  // A saved game from an earlier build: put it in localStorage before the page script runs.
  if (storage) for (const [k, v] of Object.entries(storage)) w.localStorage.setItem(k, v);
  try {
    w.eval(bundle);
  } catch (e) {
    ctx.restore();
    return { failed: "bundle failed: " + e.message };
  }
  return ctx;
}

/** Plays one run. Returns the record that is written to disk. */
export async function playRun(cfg, bundle, runCase, seed) {
  const meta = { ...cfg.meta(runCase), seed };
  const fail = (why) => ({ ...meta, error: why, n: 0, hashes: "", crashed: false });
  const ctx = makeContext(cfg, bundle, seed);
  if (ctx.failed) return fail(ctx.failed);
  ctx.runCase = runCase; // lets choose()/isEnded() see which case is being played

  await sleep(300);
  await ctx.settle();
  const setupError = await cfg.setup(ctx, runCase);
  if (setupError) {
    ctx.restore();
    return fail(setupError);
  }

  const maxSteps = cfg.maxSteps ?? 500;
  const stallLimit = cfg.stallLimit ?? 8;
  const hashes = [ctx.hash()];
  const trail = [];
  const policy = {}; // scratch state a game's choose() may keep between steps
  let crashed = false;
  let stalled = 0;
  let stopped = "";
  for (let i = 0; i < maxSteps; i++) {
    if (cfg.isCrashed(ctx)) {
      crashed = true;
      break;
    }
    if (cfg.isEnded && cfg.isEnded(ctx)) {
      stopped = "ended";
      break;
    }
    const b = cfg.choose(ctx, policy);
    if (!b) {
      stopped = "no-button";
      break;
    }
    trail.push(ctx.lab(b).slice(0, 22));
    if (process.env.TRACE) console.log(`  [${meta.id} s${seed}] ${i}: ${ctx.lab(b).slice(0, 30)} | ${ctx.text().slice(0, 90)}`);
    await ctx.click(b);
    // DUMP_STEP=<i> prints the full page text after click i (to diff two builds' screens).
    if (process.env.DUMP_STEP !== undefined && Number(process.env.DUMP_STEP) === i) console.log("TEXT:" + ctx.text());
    const h = ctx.hash();
    stalled = h === hashes[hashes.length - 1] ? stalled + 1 : 0;
    hashes.push(h);
    if (stalled >= stallLimit) {
      stopped = "stalled";
      break;
    }
  }
  if (cfg.isCrashed(ctx)) crashed = true;
  const out = {
    ...meta,
    n: hashes.length,
    stopped,
    ended: stopped === "ended" || stopped === "no-button",
    crashed,
    errors: ctx.errors.filter((e) => !/Not implemented/.test(e)).slice(0, 2),
    hashes: hashes.join(","),
    tail: trail.slice(-3),
    lastText: ctx.text().slice(0, Number(process.env.LAST_CHARS) || 1500),
  };
  ctx.restore();
  return out;
}

function casesOf(cfg) {
  const only = process.env.ONLY;
  return cfg.cases.filter((c) => !only || cfg.meta(c).id.startsWith(only));
}

export async function recordAll(cfg, bundlePath, outDir) {
  const bundle = readFileSync(bundlePath, "utf8");
  mkdirSync(outDir, { recursive: true });
  const summary = [];
  for (const c of casesOf(cfg))
    for (const seed of cfg.seeds) {
      const r = await playRun(cfg, bundle, c, seed);
      const name = `${cfg.meta(c).id}-${seed}`;
      writeFileSync(join(outDir, name + ".json"), JSON.stringify(r));
      summary.push(`${name} n=${r.n} ${r.stopped || ""}${r.crashed ? " CRASHED" : ""}${r.error ? " ERROR " + r.error : ""}`);
    }
  console.log(summary.join("\n"));
  console.log(`recorded ${summary.length} runs to ${outDir}`);
}

/**
 * Compares candidate runs with the baseline. A baseline run that CRASHED must match up to the crash
 * and the candidate must not crash. Runs listed in <baselineDir>/../known-diffs.json are allowed to
 * differ, but only from the recorded step and only if they still complete. Returns the failure count.
 */
export function compare(baseDir, candDir) {
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
      const prefix = bh.length - 1; // the last hash is the page after the crashing click
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
    const firstDiff = bh.findIndex((h, k) => h !== ch[k]);
    if (bh.length === ch.length && firstDiff === -1 && !cand.crashed) identical++;
    else if (known[name] && !cand.crashed && firstDiff === known[name].firstDiff) {
      knownFixed++;
      console.log(`known correction ${name}: differs from step ${known[name].firstDiff} (${known[name].reason})`);
    } else {
      console.error(`FAIL ${name}: first difference at step ${firstDiff === -1 ? Math.min(bh.length, ch.length) : firstDiff} (baseline ${bh.length}, candidate ${ch.length}${cand.crashed ? ", CRASHED" : ""})`);
      failures++;
    }
  }
  console.log(`\n${files.length} runs: ${identical} identical, ${knownFixed} known correction(s), ${crashFixed} crash(es) fixed, ${failures} failure(s).`);
  return failures;
}

/** CLI: argv = [command, ...]. See packages/testkit/README.md. */
export async function main(cfg, argv) {
  const [mode, a, b, c] = argv;
  const baseline = cfg.baselineDir ?? join("tests", "baseline", "ui");
  const runs = cfg.runsDir ?? join("tests", "ui-runs");
  const bundleDefault = cfg.bundle;
  if (mode === "record") {
    await recordAll(cfg, b ?? bundleDefault, join(runs, a ?? "candidate"));
  } else if (mode === "verify") {
    await recordAll(cfg, a ?? bundleDefault, join(runs, "candidate"));
    process.exit(compare(baseline, join(runs, "candidate")) ? 1 : 0);
  } else if (mode === "compare") {
    process.exit(compare(a ?? baseline, b ?? join(runs, "candidate")) ? 1 : 0);
  } else if (mode === "accept") {
    // Makes the last `verify` run (tests/ui-runs/candidate) the new baseline, after you have read the diff.
    const cand = join(runs, "candidate");
    if (!existsSync(cand)) {
      console.error('no candidate runs: run "npm run verify:baseline" first (it fails when screens changed), read the differences, then accept');
      process.exit(2);
    }
    const names = readdirSync(cand).filter((f) => f.endsWith(".json"));
    let changed = 0;
    let crashes = 0;
    const toCopy = [];
    for (const f of names) {
      const c = JSON.parse(readFileSync(join(cand, f), "utf8"));
      if (c.crashed || c.error) crashes++;
      const old = existsSync(join(baseline, f)) ? JSON.parse(readFileSync(join(baseline, f), "utf8")) : null;
      if (!old || old.hashes !== c.hashes || old.crashed !== c.crashed) {
        changed++;
        toCopy.push(f);
      }
    }
    if (crashes && !process.argv.includes("--allow-crashes")) {
      console.error(`${crashes} candidate run(s) crashed or errored: fix that first (or pass --allow-crashes if a crash is the intended new baseline)`);
      process.exit(1);
    }
    // Only runs whose screens changed are rewritten (a minimal diff); runs no longer produced are removed.
    mkdirSync(baseline, { recursive: true });
    for (const f of toCopy) cpSync(join(cand, f), join(baseline, f));
    for (const f of readdirSync(baseline).filter((x) => x.endsWith(".json") && !names.includes(x))) rmSync(join(baseline, f));
    console.log(`baseline updated: ${changed} of ${names.length} runs changed. Review "git diff --stat ${baseline}" and commit it with the change and a CHANGELOG line.`);
  } else if (mode === "saves-record") {
    await recordSaves(cfg, a ?? bundleDefault, join("tests", "saves"));
  } else if (mode === "saves-reexpect") {
    process.exit(await reexpectSaves(cfg, a ?? bundleDefault, join("tests", "saves")));
  } else if (mode === "saves-verify") {
    process.exit((await verifySaves(cfg, a ?? bundleDefault, join("tests", "saves"))) ? 1 : 0);
  } else if (mode === "one") {
    const rc = cfg.cases.find((x) => cfg.meta(x).id === a);
    if (!rc) {
      console.error("unknown case: " + a + " (have " + cfg.cases.map((x) => cfg.meta(x).id).join(", ") + ")");
      process.exit(2);
    }
    const r = await playRun(cfg, readFileSync(process.env.BUNDLE || bundleDefault, "utf8"), rc, Number(b));
    console.log(r.n, r.stopped, r.crashed, r.error, r.errors);
  } else {
    console.error("usage: record <tag> [bundle] | verify [bundle] | accept | saves-record [bundle] | saves-verify [bundle] | saves-reexpect [bundle] | compare [baselineDir] [candidateDir] | one <case id> <seed>");
    process.exit(2);
  }
  void c;
}
