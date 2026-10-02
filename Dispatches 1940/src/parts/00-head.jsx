import { useState, useEffect, useMemo, useRef, Component } from "react";
import * as Tone from "tone";
import { EMPTY_METERS, impactSum, effectiveChoice, playableStage, startFlags, resolveChoice, buildLogEntry, nextPosition, nextVisited, arrivalFork } from "./logic";
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

// ---------- SOUND ENGINE (default off; lazily initialized on user gesture) ----------
let soundReady = false;
let clackSynth = null;
let stampSynth = null;
let diceSynth = null;

function ensureSound() {
  if (soundReady) return;
  try {
    clackSynth = new Tone.MembraneSynth({ pitchDecay: 0.006, octaves: 1, envelope: { attack: 0.001, decay: 0.03, sustain: 0 }, volume: -26 }).toDestination();
    stampSynth = new Tone.MembraneSynth({ pitchDecay: 0.06, octaves: 3, envelope: { attack: 0.001, decay: 0.4, sustain: 0 }, volume: -6 }).toDestination();
    diceSynth = new Tone.NoiseSynth({ noise: { type: "white" }, envelope: { attack: 0.001, decay: 0.18, sustain: 0 }, volume: -16 }).toDestination();
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

// ---------- DATA ----------
const CAMPAIGNS = {
