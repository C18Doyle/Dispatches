import { useState, useEffect, useMemo, useRef, Component } from "react";
import * as Tone from "tone";
import { EMPTY_METERS, impactSum, effectiveChoice, playableStage, startFlags, resolveChoice, materielReadout, materielStrandOf, MATERIEL_STRANDS, METER_STRANDS, STRAND_ALIAS, strandOf, strandReadout, commandRating, endingCeiling, COMMAND_RANKS, arrearsOf, strainStage, strainOf, buildLogEntry, nextPosition, nextVisited, arrivalFork } from "./logic";
// Bundled at build time (esbuild's "dataurl"/JSON loaders — see build.mjs) rather than fetched
// at runtime. A player who downloads the full/demo zip and opens index.html directly is using
// the file:// protocol, under which both fetch() of a relative path and a MediaElementAudioSource
// built from a plain file:// <audio src> are blocked by Chrome's CORS/opaque-origin rules — the
// former throws outright ("URL scheme file is not supported"), the latter silently plays silence
// ("outputs zeroes due to CORS access restrictions"). Inlining both as data straight into the JS
// bundle sidesteps the restriction entirely (no cross-origin resource load happens at all) and
// works identically whether the game is served over HTTP (itch.io's browser embed, the itch app)
// or opened as a bare local file — which a paying customer who just unzips the download is
// entirely likely to do.
import THEME_MUSIC_DATA_URL from "../assets/theme.mp3";
import REGIONS_GEOMETRY from "../assets/maps/regions.json";

// ---------- STORAGE POLYFILL (real-browser / Electron deployment) ----------
// window.storage.get/set/delete is a Claude-artifact-environment-specific API and
// does not exist in a real browser or in Electron — this file's save system (see
// saveActiveRun/saveRunRecord/clearActiveRun below) calls it directly and would
// silently fail every save on itch.io or the Windows build without this. Reproduces
// the same async interface backed by localStorage so none of the call sites need
// to change, with an in-memory Map fallback if localStorage itself throws (some
// privacy modes, some restrictive webviews), so a save failure degrades to "no
// persistence this session" rather than crashing the app on every autosave.
if (typeof window !== "undefined" && !window.storage) {
  const memoryFallback = new Map();
  let localStorageAvailable = true;
  try {
    const testKey = "__dispatches_storage_test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
  } catch (e) {
    localStorageAvailable = false;
  }
  // Failure contract: this file's own save architecture (saveActiveRun / clearActiveRun
  // / withRetry, see below) detects failure ONLY via a thrown exception — it does not
  // check this API's resolved return value for truthiness. An earlier version of this
  // polyfill caught every internal error and returned null instead of throwing, which
  // silently defeated that retry-and-report logic: saveActiveRun would report success
  // even when a write genuinely failed (e.g. quota exceeded on a specific write, distinct
  // from localStorage being unavailable at all), and withRetry would never actually retry
  // since fn() never appeared to fail. get() is unaffected — its callers already handle
  // both a thrown exception and a null/missing result, so either behavior is safe there.
  window.storage = {
    async get(key) {
      try {
        const value = localStorageAvailable ? window.localStorage.getItem(key) : memoryFallback.has(key) ? memoryFallback.get(key) : null;
        if (value === null || value === undefined) return null;
        return { key, value, shared: false };
      } catch (e) {
        return null;
      }
    },
    async set(key, value) {
      // localStorage being unavailable AT ALL (checked once, above) is a stable, known
      // degraded mode — fall back to memory silently, matches the original design intent.
      if (!localStorageAvailable) {
        memoryFallback.set(key, value);
        return { key, value, shared: false };
      }
      // localStorage being available in general but THIS specific write failing (quota
      // exceeded, etc.) is the case that must throw, not silently degrade, so the
      // existing retry/failure-reporting architecture actually sees it.
      window.localStorage.setItem(key, value);
      return { key, value, shared: false };
    },
    async delete(key) {
      if (!localStorageAvailable) {
        memoryFallback.delete(key);
        return { key, deleted: true, shared: false };
      }
      window.localStorage.removeItem(key);
      return { key, deleted: true, shared: false };
    },
  };
}

// ---------- SOUND ENGINE (default off; lazily initialized on user gesture) ----------
let soundReady = false;
let clackSynth = null;
let stampSynth = null;
let diceSynth = null;
// Round 24 (battle sounds). Quiet by design and only ever heard with the Sound setting on, which is off until
// asked for. None of them carries information the screen does not also give in words.
let tickSynth = null;
let radioSynth = null;
let rumbleSynth = null;
let paperSynth = null;
let chimeSynth = null;

function ensureSound() {
  if (soundReady) return;
  try {
    clackSynth = new Tone.MembraneSynth({ pitchDecay: 0.006, octaves: 1, envelope: { attack: 0.001, decay: 0.03, sustain: 0 }, volume: -26 }).toDestination();
    stampSynth = new Tone.MembraneSynth({ pitchDecay: 0.06, octaves: 3, envelope: { attack: 0.001, decay: 0.4, sustain: 0 }, volume: -6 }).toDestination();
    diceSynth = new Tone.NoiseSynth({ noise: { type: "white" }, envelope: { attack: 0.001, decay: 0.18, sustain: 0 }, volume: -16 }).toDestination();
    tickSynth = new Tone.MembraneSynth({ pitchDecay: 0.004, octaves: 1.5, envelope: { attack: 0.001, decay: 0.05, sustain: 0 }, volume: -24 }).toDestination();
    radioSynth = new Tone.NoiseSynth({ noise: { type: "pink" }, envelope: { attack: 0.001, decay: 0.09, sustain: 0 }, volume: -22 }).connect(new Tone.Filter(2400, "bandpass").toDestination());
    rumbleSynth = new Tone.NoiseSynth({ noise: { type: "brown" }, envelope: { attack: 0.03, decay: 0.8, sustain: 0 }, volume: -16 }).connect(new Tone.Filter(180, "lowpass").toDestination());
    paperSynth = new Tone.NoiseSynth({ noise: { type: "white" }, envelope: { attack: 0.005, decay: 0.14, sustain: 0 }, volume: -28 }).connect(new Tone.Filter(3200, "highpass").toDestination());
    chimeSynth = new Tone.Synth({ oscillator: { type: "triangle" }, envelope: { attack: 0.005, decay: 0.32, sustain: 0, release: 0.2 }, volume: -22 }).toDestination();
    soundReady = true;
  } catch (e) {
    soundReady = false;
  }
}

async function enableSound() {
  try {
    await Tone.start();
    ensureSound();
    return soundReady;
  } catch (e) {
    return false;
  }
}

function playClack() {
  if (!soundReady || !clackSynth) return;
  try {
    clackSynth.triggerAttackRelease("C2", "64n");
  } catch (e) {}
}
function playStamp() {
  if (!soundReady || !stampSynth) return;
  try {
    stampSynth.triggerAttackRelease("G1", "8n");
  } catch (e) {}
}
function playDice() {
  if (!soundReady || !diceSynth) return;
  try {
    diceSynth.triggerAttackRelease("16n");
    setTimeout(() => {
      try {
        diceSynth.triggerAttackRelease("32n");
      } catch (e) {}
    }, 90);
  } catch (e) {}
}

// Effort placed or taken back on the planning screen: a soft click, higher going in, lower coming out.
function playTick(up) {
  if (!soundReady || !tickSynth) return;
  try {
    tickSynth.triggerAttackRelease(up ? "E4" : "A3", "64n");
  } catch (e) {}
}
// A report coming in over the radio: two short bursts of band-limited noise.
function playRadio() {
  if (!soundReady || !radioSynth) return;
  try {
    radioSynth.triggerAttackRelease("32n");
    setTimeout(() => {
      try {
        radioSynth.triggerAttackRelease("64n");
      } catch (e) {}
    }, 110);
  } catch (e) {}
}
// Guns a long way off: the battle opening, and a beat that swings hard against you.
function playRumble() {
  if (!soundReady || !rumbleSynth) return;
  try {
    rumbleSynth.triggerAttackRelease("4n");
  } catch (e) {}
}
// Paper on a map table, for the staff exercise.
function playPaper() {
  if (!soundReady || !paperSynth) return;
  try {
    paperSynth.triggerAttackRelease("16n");
  } catch (e) {}
}
// The verdict: two notes rising on a win, two sinking on a loss.
function playVerdict(won) {
  if (!soundReady || !chimeSynth) return;
  try {
    chimeSynth.triggerAttackRelease(won ? "G4" : "D4", "8n");
    setTimeout(() => {
      try {
        chimeSynth.triggerAttackRelease(won ? "D5" : "Ab3", "8n");
      } catch (e) {}
    }, 220);
  } catch (e) {}
}
// A meter moving on the outcome screen, in step with its bar.
function playMeter(up) {
  if (!soundReady || !chimeSynth) return;
  try {
    chimeSynth.triggerAttackRelease(up ? "C5" : "F4", "16n");
  } catch (e) {}
}

// ---------- DATA ----------
const CAMPAIGNS = {
