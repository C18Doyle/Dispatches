// Save-compatibility test: a saved run written by an earlier build must still load and resume in
// the current build. Players have saves in their browsers; a refactor that renames a field or key
// would silently lose or corrupt them.
//
//   saves-record   play a few clicks of one run per case with the CURRENT build, snapshot localStorage
//                  into tests/saves/<case>.json, then load that snapshot in a fresh page, press the
//                  game's resume control and record what the page shows. Commit the fixtures.
//   saves-verify   for every committed fixture: load the OLD snapshot into the new build and check the
//                  same things happen (a resume control appears, no error, same page after resume).
//
// Re-record the fixtures only on purpose, when a save format change is intended and migrated, never to
// make a failing verify pass. (A new save format must still load the old fixtures: add a migration.)
//
// Optional config fields: saveCases (default: first case of each campaign id), saveClicks (default 8),
// resumePattern (default /resume|continue (run|campaign|mission)|load (run|game)/i), seed (default 1).
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { makeContext } from "./ui-driver.mjs";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const DEFAULT_RESUME = /resume|continue (run|campaign|mission)|load (run|game)/i;

function casesToSave(cfg) {
  if (cfg.saveCases) return cfg.saveCases;
  const seen = new Set();
  const out = [];
  for (const c of cfg.cases) {
    const m = cfg.meta(c);
    const key = m.campaignId ?? m.id.replace(/-(open|hard|[a-z]+)$/, "");
    if (!seen.has(key)) {
      seen.add(key);
      out.push(c);
    }
  }
  return out;
}

function snapshot(w) {
  const o = {};
  for (let i = 0; i < w.localStorage.length; i++) {
    const k = w.localStorage.key(i);
    o[k] = w.localStorage.getItem(k);
  }
  return o;
}

async function play(cfg, bundle, runCase, seed, clicks) {
  const ctx = makeContext(cfg, bundle, seed);
  if (ctx.failed) throw new Error(ctx.failed);
  ctx.runCase = runCase;
  await sleep(300);
  await ctx.settle();
  const err = await cfg.setup(ctx, runCase);
  if (err) throw new Error("setup: " + err);
  for (let i = 0; i < clicks; i++) {
    if (cfg.isCrashed(ctx) || (cfg.isEnded && cfg.isEnded(ctx))) break;
    const b = cfg.choose(ctx, (ctx.policy ??= {}));
    if (!b) break;
    await ctx.click(b);
  }
  const saved = snapshot(ctx.w);
  ctx.restore();
  return saved;
}

/** Waits until the page text has not changed for 500ms (typewriter text keeps growing after the click). */
async function quiet(ctx, maxMs = 15000) {
  let last = ctx.hash();
  let since = Date.now();
  const t0 = since;
  while (Date.now() - since < 500 && Date.now() - t0 < maxMs) {
    await sleep(25);
    const h = ctx.hash();
    if (h !== last) {
      last = h;
      since = Date.now();
    }
  }
}

/** Loads `storage` into a fresh page of `bundle`, presses resume if present. */
async function loadAndResume(cfg, bundle, storage, seed) {
  const ctx = makeContext(cfg, bundle, seed, storage);
  if (ctx.failed) return { error: ctx.failed };
  await sleep(300);
  await ctx.settle();
  await quiet(ctx);
  const out = { menuHash: ctx.hash() };
  if (cfg.isCrashed(ctx)) {
    ctx.restore();
    return { ...out, error: "page is blank after loading the save" };
  }
  const pattern = cfg.resumePattern ?? DEFAULT_RESUME;
  // Usually a button; some games use a styled div, so fall back to the smallest element whose text matches.
  let control = ctx.buttons().find((b) => pattern.test(ctx.lab(b)));
  if (!control) {
    let best = null;
    (function walk(n) {
      if (n.nodeType !== 1 || n.tagName === "SCRIPT" || n.tagName === "STYLE") return;
      const t = (n.textContent || "").trim().replace(/\s+/g, " ");
      if (t.length < 80 && pattern.test(t) && (!best || t.length < best.t.length)) best = { n, t };
      for (const k of n.children) walk(k);
    })(ctx.d.body);
    if (best) control = best.n;
  }
  out.resumeControl = control ? ctx.lab(control).slice(0, 40) : null;
  if (control) {
    await ctx.click(control);
    await quiet(ctx);
    out.afterResumeHash = ctx.hash();
    if (cfg.isCrashed(ctx)) out.error = "page is blank after resume";
  }
  out.errors = ctx.errors.filter((e) => !/Not implemented/.test(e)).slice(0, 2);
  ctx.restore();
  return out;
}

export async function recordSaves(cfg, bundlePath, dir) {
  const bundle = readFileSync(bundlePath, "utf8");
  mkdirSync(dir, { recursive: true });
  const seed = cfg.seed ?? 1;
  for (const c of casesToSave(cfg)) {
    const id = cfg.meta(c).id;
    const storage = await play(cfg, bundle, c, seed, cfg.saveClicks ?? 8);
    if (Object.keys(storage).length === 0) {
      console.log(`${id}: no localStorage written after ${cfg.saveClicks ?? 8} clicks, so this game keeps no saved state; nothing to record`);
      continue;
    }
    const result = await loadAndResume(cfg, bundle, storage, seed);
    writeFileSync(join(dir, id + ".json"), JSON.stringify({ id, seed, storage, expect: result }, null, 1));
    console.log(`${id}: ${Object.keys(storage).length} storage key(s); resume control: ${result.resumeControl ?? "none found"}${result.error ? "  ERROR " + result.error : ""}`);
  }
}

/** Returns the number of failures. */
export async function verifySaves(cfg, bundlePath, dir) {
  if (!existsSync(dir)) {
    console.error(`no save fixtures in ${dir}: run "saves-record" once with a known-good build`);
    return 1;
  }
  const bundle = readFileSync(bundlePath, "utf8");
  let failures = 0;
  const files = readdirSync(dir).filter((f) => f.endsWith(".json")).sort();
  for (const f of files) {
    const fx = JSON.parse(readFileSync(join(dir, f), "utf8"));
    const got = await loadAndResume(cfg, bundle, fx.storage, fx.seed);
    const problems = [];
    if (got.error) problems.push(got.error);
    if ((got.resumeControl ?? null) !== (fx.expect.resumeControl ?? null)) problems.push(`resume control was "${fx.expect.resumeControl}", now "${got.resumeControl}"`);
    if (got.errors && got.errors.length) problems.push("page errors: " + got.errors.join(" | "));
    if (fx.expect.afterResumeHash && got.afterResumeHash !== fx.expect.afterResumeHash) problems.push("the page after resume differs from the recorded one: the old save no longer restores the same screen");
    if (problems.length) {
      failures++;
      console.error(`FAIL ${fx.id}:\n  - ` + problems.join("\n  - "));
    } else console.log(`ok ${fx.id}: old save loads${got.resumeControl ? ` and "${got.resumeControl}" restores the same screen` : " (no resume control in this game)"}`);
  }
  console.log(`\n${files.length} save fixture(s), ${failures} failure(s).`);
  return failures;
}
