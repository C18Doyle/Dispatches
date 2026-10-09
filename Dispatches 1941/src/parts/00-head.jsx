import { useState, useEffect, useMemo, useRef, Component } from "react";
import * as Tone from "tone";
import {
  EMPTY_METERS,
  impactSum,
  effectiveChoice,
  applyDoctrineImpact,
  playableStage,
  resolveChoice,
  buildLogEntry,
  nextPosition,
  nextVisited,
  arrivalScreen,
  startFlags,
  strandReadout,
  commandRating,
  endingCeiling,
  COMMAND_RANKS,
} from "./logic";

// ---------- STORAGE POLYFILL (real-browser / Electron deployment) ----------
// window.storage.get/set/delete is a Claude-artifact-environment-specific API and
// does not exist in a real browser or in Electron — this file's save system (see
// saveActiveRun/saveRunRecord/clearActiveRun below) calls it directly and would
// silently fail every save on itch.io or the Windows build without this. Reproduces
// the same async interface backed by localStorage so none of the 6 call sites need
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
let rumbleSynth = null;
let rustleSynth = null;
let sfxBus = null;
// Background music: a small registry of Tone.Player instances (one for the menu,
// one per campaign), all routed through the same musicBus so they respond to the
// existing volume slider identically. Only one real track exists right now (see
// audio/theme.mp3, confirmed byte-identical to Dispatches 1940's own theme.mp3, and
// already proven as a working loop there) — no separate menu/IGHQ/CINCPAC
// compositions have been produced yet, so all three registry keys point at the same
// file rather than at three still-nonexistent stubs. Splitting this into distinct
// per-context tracks later is just a matter of pointing each key at its own file;
// nothing else about switchMusic/ensureSound needs to change.
const MUSIC_TRACK_SRC = "./audio/theme.mp3";
const MUSIC_TRACKS = {
  menu: MUSIC_TRACK_SRC,
  japan: MUSIC_TRACK_SRC,
  alliedPacific: MUSIC_TRACK_SRC,
};
let musicPlayers = {}; // trackKey -> Tone.Player
let currentMusicTrack = null;
let musicBus = null;
let currentSfxVolumeDb = -6; // 0 dB = full; see sfxPercentToDb()

function sfxPercentToDb(pct) {
  // 0% -> effectively silent, 100% -> 0dB (unity). Logarithmic-ish taper so the middle
  // of the slider doesn't feel abruptly loud, matching how volume perception actually works.
  if (pct <= 0) return -60;
  return -40 + (pct / 100) * 40;
}

function ensureSound() {
  if (soundReady) return;
  try {
    // Tone.js's default AudioContext latencyHint ("interactive", the lowest-latency
    // setting) is specifically implicated in documented Android WebView audio crackling
    // (see e.g. Tonejs/Tone.js#935 — glitches within half a second on Android WebView,
    // clean on the same device's Chrome browser). Capacitor wraps the game in exactly
    // that WebView on Android, so trade latency for buffer stability there specifically.
    // Left alone on web/Electron/iOS, which don't have this documented issue and
    // benefit from the lower default latency. Confirm this actually resolves crackling
    // on a real device before assuming it's sufficient — see audio-spike-test/.
    const isAndroidWebView = typeof window !== "undefined" && window.Capacitor && window.Capacitor.getPlatform && window.Capacitor.getPlatform() === "android";
    if (isAndroidWebView) {
      Tone.setContext(new Tone.Context({ latencyHint: "playback" }));
    }
    sfxBus = new Tone.Volume(currentSfxVolumeDb).toDestination();
    musicBus = new Tone.Volume(-12).toDestination();
    if (Object.keys(musicPlayers).length === 0) {
      Object.entries(MUSIC_TRACKS).forEach(([key, url]) => {
        musicPlayers[key] = new Tone.Player({
          url,
          loop: true,
          autostart: false,
          fadeIn: 1.5,
          fadeOut: 1.5,
        }).connect(musicBus);
      });
    }
    clackSynth = new Tone.MembraneSynth({ pitchDecay: 0.006, octaves: 1, envelope: { attack: 0.001, decay: 0.03, sustain: 0 }, volume: -20 }).connect(sfxBus);
    stampSynth = new Tone.MembraneSynth({ pitchDecay: 0.06, octaves: 3, envelope: { attack: 0.001, decay: 0.4, sustain: 0 }, volume: 0 }).connect(sfxBus);
    diceSynth = new Tone.NoiseSynth({ noise: { type: "white" }, envelope: { attack: 0.001, decay: 0.18, sustain: 0 }, volume: -10 }).connect(sfxBus);
    // Ambient severity SFX, tied to the same wearTier() thresholds the paper-wear visual
    // system already uses — a faint, low rumble under a max-severity reading, and a short
    // filtered noise burst standing in for a paper rustle on the redaction reveal.
    rumbleSynth = new Tone.NoiseSynth({
      noise: { type: "brown" },
      envelope: { attack: 1.2, decay: 0.3, sustain: 0.6, release: 1.5 },
    }).connect(new Tone.Filter(180, "lowpass").connect(sfxBus));
    rumbleSynth.volume.value = -22;
    rustleSynth = new Tone.NoiseSynth({
      noise: { type: "pink" },
      envelope: { attack: 0.01, decay: 0.25, sustain: 0, release: 0.05 },
    }).connect(new Tone.Filter(2400, "highpass").connect(sfxBus));
    rustleSynth.volume.value = -18;
    soundReady = true;
  } catch (e) {
    soundReady = false;
  }
}

function setSfxVolume(pct) {
  currentSfxVolumeDb = sfxPercentToDb(pct);
  if (sfxBus) {
    try {
      sfxBus.volume.value = currentSfxVolumeDb;
    } catch (e) {}
  }
}

function setMusicVolume(pct) {
  if (musicBus) {
    try {
      musicBus.volume.value = pct <= 0 ? -60 : -30 + (pct / 100) * 30;
    } catch (e) {}
  }
}

function switchMusic(trackKey) {
  if (!soundReady) return;
  if (currentMusicTrack === trackKey) return; // already playing this track, no-op
  const prev = currentMusicTrack ? musicPlayers[currentMusicTrack] : null;
  const next = musicPlayers[trackKey];
  currentMusicTrack = trackKey;
  try {
    if (prev && prev.state === "started") prev.stop();
  } catch (e) {}
  if (!next) return;
  try {
    if (next.loaded && next.state !== "started") {
      next.start();
    } else if (!next.loaded) {
      // Same retry-on-load pattern as before, per track rather than one global player.
      next.load(MUSIC_TRACKS[trackKey]).then(() => {
        if (currentMusicTrack === trackKey && next.state !== "started") next.start();
      }).catch(() => {});
    }
  } catch (e) {}
}

function startMusic() {
  // Backward-compatible entry point: resumes whatever track was last selected, or
  // falls back to the menu theme if nothing has been chosen yet.
  switchMusic(currentMusicTrack || "menu");
}

function stopMusic() {
  if (!currentMusicTrack) return;
  const player = musicPlayers[currentMusicTrack];
  try {
    if (player && player.state === "started") player.stop();
  } catch (e) {}
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
// meters -> ambient rumble, keyed off the same wearTier() severity bands as the visual
// paper-wear system (tier -1 = max severity). Only the worst tier gets a sound at all —
// this is meant to be felt occasionally, not on every screen.
function playAmbientRumble(meters) {
  if (!soundReady || !rumbleSynth || !meters) return;
  const worstTier = Math.min(wearTier(meters.readiness || 0), wearTier(meters.pipeline || 0));
  if (worstTier > -1) return;
  try {
    rumbleSynth.triggerAttackRelease("2n");
  } catch (e) {}
}
function playPaperRustle() {
  if (!soundReady || !rustleSynth) return;
  try {
    rustleSynth.triggerAttackRelease("8n");
  } catch (e) {}
}

// ---------- DATA ----------
// ---------- DOCTRINE SELECTION ----------
// A one-time strategic posture pick made before the first situation report, giving the
// logistical triangle a real starting shape instead of always opening at zero-zero-zero.
// Framed as an actual pre-war planning decision, not a skill tree — each option is
// something the real command structure genuinely debated, with a real tradeoff, applied
// once as a starting infusion rather than a recurring per-turn bonus (keeping the core
// meter logic untouched and the payoff legible: what you picked is what you see on the
// very first situation report).
const DOCTRINES = {
  japan: [
    {
      id: "kantaiKessen",
      title: "Kantai Kessen",
      subtitle: "Decisive Battle Doctrine",
      advisor: "Yamamoto",
      position: "Give the fleet one real chance at the American carriers and it can end the war in an afternoon, and deny it that chance and a decade may not be enough.",
      description: "Commit the fleet to drawing the Americans into one decisive battle. Momentum builds fast and fuel burns fast.",
      impact: { readiness: 0, pipeline: -2, initiative: 3 },
    },
    {
      id: "shubiIchi",
      title: "Shubi-Ichi",
      subtitle: "Defense-in-Depth Doctrine",
      advisor: "Sugiyama",
      position: "The Navy can chase its one decisive afternoon, while the army makes every mile the Americans take cost more than the last until they stop thinking it worth the cost.",
      description: "Dig in, absorb the first blow and make every mile expensive. Momentum builds slowly, and the line is hard to dislodge.",
      impact: { readiness: 3, pipeline: 0, initiative: -2 },
    },
    {
      id: "jikyuJisoku",
      title: "Jikyu Jisoku",
      subtitle: "Self-Sufficiency Doctrine",
      advisor: "Nagano",
      position: "Neither the fleet's decisive battle nor the army's defensive line survives a war the Navy cannot fuel, so the resource area's output comes first.",
      description: "Put the output of the Southern Resource Area ahead of any single battle plan, so that readiness is built on a position that can sustain a long war.",
      impact: { readiness: -2, pipeline: 3, initiative: 0 },
    },
  ],
  alliedPacific: [
    {
      id: "islandHopping",
      title: "Island Hopping",
      subtitle: "Bypass Doctrine",
      advisor: "Nimitz",
      position: "Not every fortified island between here and Tokyo needs taking, only the ones that matter, and the rest can be left to starve.",
      description: "Skip the heavily fortified islands, strike where the enemy is weak and let bypassed garrisons wither. It is fast, and it strains the supply lines that have to keep pace.",
      impact: { readiness: 0, pipeline: -2, initiative: 3 },
    },
    {
      id: "combinedArms",
      title: "Combined Arms",
      subtitle: "Overwhelming Force Doctrine",
      advisor: "MacArthur",
      position: "Landing before the guns and the air support are in place costs men, so nothing moves until the fleet can guarantee what it puts ashore.",
      description: "Nothing moves until naval gunfire, air support and logistics are in place. Momentum comes late, and is hard to stall once it has come.",
      impact: { readiness: 3, pipeline: 0, initiative: -2 },
    },
    {
      id: "logisticsCorps",
      title: "Logistics Corps",
      subtitle: "Industrial Doctrine",
      advisor: "King",
      position: "Every admiral wants his decisive battle, and none gets one without a supply line that reaches the fleet, so the supply line is built first.",
      description: "Put the supply chain, the Seabees, the forward bases and the shipping tonnage ahead of any single early offensive.",
      impact: { readiness: -2, pipeline: 3, initiative: 0 },
    },
  ],
};

// ---------- SPECIAL EVENTS ----------
// General-purpose hook for one-off "event" screens inserted at specific points in a
// campaign, rather than tied to game start. Each entry names the node ID that, once
// completed, triggers the event before the player sees the next situation report.
// `type` selects which special-screen component handles it — currently only "doctrine",
// but built this way so future pacing events (a council vote, a resource audit, whatever
// comes next) can register here without touching the core node-transition logic again.
const SPECIAL_EVENTS = {
  japan: [
    { afterNode: "unificationQuestion40", type: "doctrine" },
    // Anchored to pearlHarbor41 itself (not a downstream node) for correct timing — the
    // player sees this "breaking news" bulletin immediately after committing to the
    // strike, not months later after an unrelated node. Both of pearlHarbor41's choices
    // are made FROM the same node, so afterNode alone can't distinguish them the way the
    // alliedPacific entry below relies on incidental node-uniqueness; the condition check
    // is what keeps this from firing on the "southBlitz" bypass branch, where Pearl Harbor
    // never happens. PRESS_CONTENT.pearlHarbor.japan has been fully written since this
    // file's creation but had no trigger registered anywhere — this bulletin has never
    // actually been shown to a player before this fix.
    { afterNode: "pearlHarbor41", type: "press", pressEvent: "pearlHarbor", condition: (flags) => flags.openingVector === "pearlHarbor" },
    // doolittleRaid42's two choices (accelerate Midway vs. measured response) both happen
    // after the raid already occurred — the situation text opens with "have just dropped
    // bombs on Tokyo" — so unlike Pearl Harbor, no condition is needed here.
    { afterNode: "doolittleRaid42", type: "press", pressEvent: "doolittle" },
    // midway42 has a second choice (Redirect to Fiji-Samoa) that never sets midwayResult at
    // all, and the committed choice's own uncertain roll has three possible outcomes
    // (decisive/survived/disaster) — the condition restricts this bulletin to the historical
    // "disaster" result specifically, the one this game's own narrative repeatedly calls the
    // likeliest of the three. The other two outcomes get no bulletin under this scope rather
    // than a bulletin that doesn't match what actually happened; a mismatched "great victory"
    // headline over the four-carriers-lost outcome would be a real correctness bug, not just
    // a missed opportunity.
    { afterNode: "midway42", type: "press", pressEvent: "midway", condition: (flags) => flags.midwayResult === "disaster" },
    // afterHiroshima45's two choices are both post-bombing decisions (surrender now vs.
    // hold position) — the bombing itself already happened by the time either choice is
    // made, so unlike Pearl Harbor and Midway, no condition is needed here.
    { afterNode: "afterHiroshima45", type: "press", pressEvent: "hiroshima" },
  ],
  alliedPacific: [
    { afterNode: "arcadia41", type: "doctrine" },
    // wakeIslandRelief41 is only reachable when Pearl Harbor actually happened this
    // playthrough — the no-Pearl-Harbor branch (americanEmbargoResponse41's rare
    // "avoided" roll -> aStandoffInsteadOfAWar41) diverges earlier and never rejoins
    // the tree here, so this naturally never fires in that branch without needing an
    // explicit flag check.
    { afterNode: "wakeIslandRelief41", type: "press", pressEvent: "pearlHarbor" },
    // doolittleRaidAllied42 has an "Abort the mission" choice (doolittleAlliedPath: "abort")
    // where the raid never actually launches — the fuel-shortened-range dilemma is resolved
    // by turning back rather than bombing Japan. The condition restricts this bulletin to
    // the "launch" branch specifically; without it, the abort branch would incorrectly show
    // a "bombers strike Tokyo" headline for a raid that never happened.
    { afterNode: "doolittleRaidAllied42", type: "press", pressEvent: "doolittle", condition: (flags) => flags.doolittleAlliedPath === "launch" },
    // Same scoping decision as the japan-side entry above: only the "decisive" result gets
    // a bulletin. "decisiveExploited" (the gated fourth choice's enhanced variant) and
    // "costly" both go without one under this scope, rather than risk a mismatched headline.
    { afterNode: "coralSeaMidwayAllied42", type: "press", pressEvent: "midway", condition: (flags) => flags.midwayAlliedResult === "decisive" },
    // Same reasoning as the japan-side entry: hiroshima45's two choices are both
    // post-bombing decisions, so no condition is needed.
    { afterNode: "hiroshima45", type: "press", pressEvent: "hiroshima" },
    // downfallOrBlockade45 is the correct anchor, verified by tracing every one of its
    // choices (Downfall, Starvation under both blockadeResult outcomes, Accelerated, and
    // the gated "both" choice including its early-END sub-branch) through to their actual
    // resolution — all confirmed to reach a surrender, either directly or via
    // sovietHokkaido45's explicit "Japan's surrender is imminent" framing. No condition
    // needed: unlike Pearl Harbor and Midway, there is no sibling choice at this node that
    // avoids the surrender the bulletin describes. See the longer note above PRESS_CONTENT.vjDay
    // for why this event has no japan-side counterpart.
    { afterNode: "downfallOrBlockade45", type: "press", pressEvent: "vjDay" },
  ],
};

// Content for PressReportScreen, keyed by event then campaign id. Original copy written for
// this game, grounded in the real facts of each event, not a reproduction of any actual
// period reporting. The CINCPAC edition hedges everywhere the real story wasn't known yet
// that morning; the IGHQ edition states everything as settled fact issued top-down, no
// hedging — that structural difference is deliberate, not just a tone choice, reflecting
// that an IGHQ bulletin was an announcement, not reporting.
const PRESS_CONTENT = {
  pearlHarbor: {
    alliedPacific: {
      volLine: "Vol. LXXII: No. 341", dateLine: "Monday, December 8, 1941", priceLine: "Five Cents",
      theWord: "The", masthead: "Pacific Command Dispatch", mastheadSub: "Honolulu · San Francisco · Washington",
      kicker: "Extra: Filed 0800 Hawaii Time",
      headline: "JAPAN STRIKES PEARL HARBOR",
      deck: "Surprise dawn attack batters Pacific Fleet at anchor; Congress to convene as President prepares address",
      bylineLeft: "By The Associated Press, Honolulu", bylineRight: "Casualties Not Yet Confirmed",
      columns: [
        {
          head: "Attack Came Without Warning",
          paras: [
            "Japanese carrier aircraft struck the naval base at Pearl Harbor shortly before eight o'clock Sunday morning, catching the Pacific Fleet at anchor and without any declaration of war having reached Washington beforehand.",
            "Naval sources describe waves of dive bombers and torpedo planes striking Battleship Row in succession, with heavy damage reported among vessels moored along Ford Island. Official channels remain guarded on the full extent of losses, though early and unconfirmed reports describe fires visible across the harbor for hours after the last enemy aircraft departed.",
          ],
        },
        {
          head: "Congress to Convene",
          paras: [
            "Leaders on Capitol Hill say both chambers will meet in joint session within the day. A declaration of war is expected to follow with little dissent, ending years of public argument over the country's involvement.",
            "The President is said to be preparing remarks for delivery before Congress, the content of which has not been made public. The fate of the Pacific Fleet's aircraft carriers, absent from harbor at the time of the attack, is being watched closely by naval planners as the one piece of good news in an otherwise grim accounting.",
          ],
        },
      ],
      photoCaption: "Caption redacted pending Fleet Intelligence review.",
      photoLabel: "PHOTOGRAPH WITHHELD: NAVAL CENSOR",
    },
    japan: {
      volLine: "昭和十六年", dateLine: "December 8, Shōwa 16", priceLine: "IGHQ Naval Bulletin",
      theWord: "大東亜戦争", masthead: "Imperial Navy Bulletin", mastheadSub: "Tokyo: Issued by Imperial General Headquarters",
      kicker: "Special Announcement: Naval Section",
      headline: "NAVY STRIKES DECISIVE BLOW AT HAWAII",
      deck: "Combined Fleet air units devastate American Pacific Fleet at Pearl Harbor; Empire declares war on United States and Britain",
      bylineLeft: "Imperial General Headquarters via Domei Tsushin", bylineRight: "8:00 AM Announcement",
      columns: [
        {
          head: "Surprise Achieved in Full",
          paras: [
            "Naval air units of the Combined Fleet struck the American naval base at Pearl Harbor before dawn, achieving complete surprise against a fleet that had taken no precaution against attack.",
            "Imperial General Headquarters reports the American battle line struck heavily, with losses among the enemy's capital ships described as severe. Losses among Imperial naval air units are described as light, a result attributed to the thoroughness of the operation's planning and the skill of the aircrews involved.",
          ],
        },
        {
          head: "A War Long Prepared For",
          paras: [
            "Imperial General Headquarters states the operation had been prepared over many months, and frames the outcome as confirmation of the fleet's readiness after years of training for exactly this contingency.",
            "No mention is made in this bulletin of the American aircraft carriers, whose location at the time of the attack is not addressed. Further bulletins on the day's operations across the Pacific are promised as they become available.",
          ],
        },
      ],
      photoCaption: "Image cleared for publication by Imperial General Headquarters.",
      photoLabel: "PHOTOGRAPH: RELEASED BY NAVAL PRESS SECTION",
    },
  },
  doolittle: {
    alliedPacific: {
      volLine: "Vol. LXXII: No. 452", dateLine: "Saturday, April 18, 1942", priceLine: "Five Cents",
      theWord: "The", masthead: "Pacific Command Dispatch", mastheadSub: "Honolulu · San Francisco · Washington",
      kicker: "Extra: First Strike on Japan",
      headline: "ARMY BOMBERS STRIKE TOKYO",
      deck: "First raid on Japanese home islands since war began; President declines to say where planes came from",
      bylineLeft: "By The Associated Press, Washington", bylineRight: "Origin of Aircraft Not Disclosed",
      columns: [
        {
          head: "Tokyo Bombed",
          paras: [
            "Army bombers struck Tokyo and several other Japanese cities today in the first American raid on the home islands since the war began, four months to the week after Pearl Harbor. The War Department confirmed the raid occurred but declined to describe its scale, the units involved, or the point from which the aircraft launched.",
            "Asked directly at today's press conference where the bombers had come from, the President said only that they had come from 'Shangri-La,' a reply reporters in the room took, correctly, as a refusal to say rather than an answer.",
          ],
        },
        {
          head: "First Good News in Months",
          paras: [
            "The raid comes after a string of reversals across the Pacific since December, and officials made no attempt to downplay its significance as a morale story even while declining to discuss it militarily. Crews and aircraft involved in the mission have not been accounted for publicly.",
            "Japanese radio, monitored by American listening posts, has so far described the raid only briefly and without acknowledging significant damage.",
          ],
        },
      ],
      photoCaption: "No photographs available for publication at this time.",
      photoLabel: "PHOTOGRAPH NOT RELEASED",
    },
    japan: {
      volLine: "昭和十七年", dateLine: "April 18, Shōwa 17", priceLine: "IGHQ Special Bulletin",
      theWord: "本土空襲", masthead: "Imperial News Bulletin", mastheadSub: "Tokyo: Issued by Imperial General Headquarters",
      kicker: "Special Announcement",
      headline: "ENEMY RAIDERS ATTACK HOMELAND, INFLICT LITTLE DAMAGE",
      deck: "Small number of enemy aircraft bomb civilian areas; military and industrial targets largely unaffected",
      bylineLeft: "Imperial General Headquarters via Domei Tsushin", bylineRight: "April 18 Announcement",
      columns: [
        {
          head: "Damage Described as Minor",
          paras: [
            "Imperial General Headquarters announces that a small number of enemy aircraft, of a type not yet fully identified, carried out scattered bombing over Tokyo and several other cities today. Military and industrial installations were largely unaffected, with the bulk of reported damage confined to civilian and residential areas.",
            "The origin of the attacking aircraft has not been determined. Imperial General Headquarters states the enemy's evident willingness to bomb civilian neighborhoods rather than targets of military value speaks for itself.",
          ],
        },
        {
          head: "Homeland Defenses to Be Reviewed",
          paras: [
            "Naval and Army authorities state that homeland air defenses will be reviewed in light of today's incident, though officials caution against overstating the significance of an attack that inflicted negligible material damage.",
            "The public is urged to remain calm and to trust that the fleet's own operations, proceeding on schedule, are unaffected by today's events.",
          ],
        },
      ],
      photoCaption: "No photographs available for publication at this time.",
      photoLabel: "PHOTOGRAPH NOT RELEASED",
    },
  },
  midway: {
    alliedPacific: {
      volLine: "Vol. LXXII: No. 507", dateLine: "Monday, June 8, 1942", priceLine: "Five Cents",
      theWord: "The", masthead: "Pacific Command Dispatch", mastheadSub: "Honolulu · San Francisco · Washington",
      kicker: "Extra: Nimitz Communiqué",
      headline: "NAVY SMASHES JAPANESE FLEET AT MIDWAY",
      deck: "Four enemy carriers reported sunk in decisive Pacific battle; Navy calls turning point in war six months after Pearl Harbor",
      bylineLeft: "By The Associated Press, Pearl Harbor", bylineRight: "Official Communiqué Pending Full Confirmation",
      columns: [
        {
          head: "Four Carriers Lost",
          paras: [
            "Navy sources report American carrier aircraft caught the core of the Japanese carrier force in the midst of rearming Thursday morning near Midway atoll, sinking four fleet carriers in exchange for one of our own. Officials describe the loss to the enemy's naval air arm, its trained pilots and ground crews as much as its ships, as one no fleet recovers from quickly.",
            "The victory follows a running Navy effort, not publicly detailed, to anticipate Japanese intentions in advance of the attack. Officials would say only that fleet dispositions reflected 'a high degree of confidence' in the target and timing.",
          ],
        },
        {
          head: "A War Six Months In",
          paras: [
            "The engagement comes almost exactly six months after Pearl Harbor, the first major reversal of a war that has, until now, run entirely on the enemy's schedule. Navy officials were notably restrained in victory statements, cautioning that a single battle, however consequential, does not by itself shorten a war fought across an ocean this wide.",
            "Casualty figures for our own forces, including the carrier lost in the engagement, have not been released pending notification of next of kin.",
          ],
        },
      ],
      photoCaption: "Caption withheld pending Fleet Intelligence review.",
      photoLabel: "PHOTOGRAPH WITHHELD: NAVAL CENSOR",
    },
    japan: {
      volLine: "昭和十七年", dateLine: "June 10, Shōwa 17", priceLine: "IGHQ Naval Bulletin",
      theWord: "大海戦", masthead: "Imperial Navy Bulletin", mastheadSub: "Tokyo: Issued by Imperial General Headquarters",
      kicker: "Special Announcement: Naval Section",
      headline: "GREAT NAVAL VICTORY AT MIDWAY",
      deck: "Combined Fleet engages American carrier force in decisive battle; two enemy carriers confirmed sunk",
      bylineLeft: "Imperial General Headquarters via Domei Tsushin", bylineRight: "June 10 Announcement",
      columns: [
        {
          head: "Enemy Carrier Force Struck",
          paras: [
            "Imperial General Headquarters announces a great victory over American naval forces near Midway Island, with two enemy carriers confirmed sunk and a third damaged. Losses to the Combined Fleet are described as within expected bounds for an engagement of this scale.",
            "The operation is characterized as part of the continuing effort to secure the Pacific against American interference, with further operations to extend the Empire's defensive perimeter proceeding as planned.",
          ],
        },
        {
          head: "Fleet Returns to Base",
          paras: [
            "Combined Fleet units have returned to home waters to prepare for future operations. Naval Division sources decline to specify losses among Japanese vessels beyond confirming the operation's objectives were substantially achieved.",
            "Wounded personnel from the engagement are being received at naval hospitals under standard procedure. Further details of the battle will not be released at this time.",
          ],
        },
      ],
      photoCaption: "No photographs available for publication at this time.",
      photoLabel: "PHOTOGRAPH NOT RELEASED",
    },
  },
  hiroshima: {
    alliedPacific: {
      volLine: "Vol. LXXIII: No. 574", dateLine: "Monday, August 6, 1945", priceLine: "Five Cents",
      theWord: "The", masthead: "Pacific Command Dispatch", mastheadSub: "Honolulu · San Francisco · Washington",
      kicker: "Extra: President Addresses Nation",
      headline: "ATOMIC BOMB DROPPED ON JAPAN",
      deck: "President announces new weapon 'harnessing the basic power of the universe'; single bomb said to equal thousands of tons of conventional explosive",
      bylineLeft: "By The Associated Press, Washington", bylineRight: "Text of Presidential Statement Follows Separately",
      columns: [
        {
          head: "A New Kind of Weapon",
          paras: [
            "The White House announced today that an American aircraft has dropped a single bomb of an entirely new type on the Japanese city of Hiroshima, a weapon developed in secret over several years by a program the President's statement described only as employing the basic power of the sun against those who brought war to the Far East.",
            "The statement gave no casualty estimate and did not describe conditions in the city itself, saying only that the full effects would take time to assess. It said additional weapons of the same type exist and would be used against Japan's capacity to wage war if the government did not accept the terms already set out at Potsdam.",
          ],
        },
        {
          head: "Years of Secret Work",
          paras: [
            "Officials said the weapon was the product of a research and production effort employing hundreds of thousands of workers across the country, conducted with a degree of secrecy that kept its existence unknown even to most of those who built its components.",
            "No further statement on the weapon's use is expected today. Congressional leaders briefed after the announcement described the development as changing the terms on which the war's end will be discussed, without elaborating further.",
          ],
        },
      ],
      photoCaption: "No photographs of the target city available for publication.",
      photoLabel: "PHOTOGRAPH NOT RELEASED",
    },
    japan: {
      volLine: "昭和二十年", dateLine: "August 7, Shōwa 20", priceLine: "IGHQ Special Bulletin",
      theWord: "新型爆弾", masthead: "Imperial News Bulletin", mastheadSub: "Tokyo: Issued by Imperial General Headquarters",
      kicker: "Special Announcement",
      headline: "ENEMY EMPLOYS NEW TYPE OF BOMB AGAINST HIROSHIMA",
      deck: "Damage still being assessed; Imperial Headquarters states enemy claims regarding the weapon's nature cannot yet be confirmed",
      bylineLeft: "Imperial General Headquarters via Domei Tsushin", bylineRight: "Preliminary Report: August 7",
      columns: [
        {
          head: "Reports Remain Fragmentary",
          paras: [
            "Imperial General Headquarters states that a small number of enemy aircraft attacked the city of Hiroshima yesterday morning with what appears to have been a new type of bomb, producing considerable damage. Communications with the city remain severely disrupted, and a full accounting of the attack's effects has not yet been possible.",
            "Enemy broadcasts claim the weapon draws on an entirely new source of destructive power. Imperial General Headquarters states this claim cannot be verified at this time and cautions against accepting enemy propaganda regarding the attack's true nature without confirmation.",
          ],
        },
        {
          head: "Investigation Underway",
          paras: [
            "A military and scientific delegation has been dispatched to Hiroshima to assess conditions directly. Findings will be reported once confirmed.",
            "Imperial General Headquarters states that whatever the nature of this new weapon, the Empire's determination to continue the war remains unchanged.",
          ],
        },
      ],
      photoCaption: "No photographs available for publication at this time.",
      photoLabel: "PHOTOGRAPH NOT RELEASED",
    },
  },
  // V-J Day is deliberately Allied-only. The japan campaign's own endgame nodes
  // (surrenderInquiry45 and everything positionLabel() checks) never resolve to a
  // confirmed, historical-style surrender from Japan's own perspective — every ending
  // is either an early negotiated peace, an unresolved "war continues" state, or a
  // fleet's-last-stand outcome, and even the one choice that explicitly says "move to
  // surrender now" isn't checked anywhere in positionLabel, falling through to the
  // generic default ending. There is no node in that campaign's tree where IGHQ
  // receives confirmed news of an actual surrender, so there is nowhere safe to anchor
  // a japan-side V-J Day bulletin without inventing a resolution the campaign itself
  // deliberately declines to depict.
  //
  // On the alliedPacific side, every traced path from downfallOrBlockade45 (Downfall,
  // Starvation regardless of blockadeResult, Accelerated, and the gated "both" choice
  // including its early-END "shortened" sub-branch) converges on either a direct END
  // with a confirmed surrender in its own outcome text, or sovietHokkaido45, which
  // states outright that "Japan's surrender is imminent... in the days immediately
  // around the surrender itself." No other node earlier in the campaign makes that
  // claim, so downfallOrBlockade45 — reached only this late, only after the invasion
  // question is actually being decided — is the correct, verified anchor. No condition
  // is needed on this entry specifically because every branch from it was traced and
  // confirmed to resolve toward the surrender, unlike Pearl Harbor and Midway where a
  // sibling choice at the same node explicitly avoids the event the bulletin describes.
  vjDay: {
    alliedPacific: {
      volLine: "Vol. LXXIII: No. 580", dateLine: "Tuesday, August 14, 1945", priceLine: "Five Cents",
      theWord: "The", masthead: "Pacific Command Dispatch", mastheadSub: "Honolulu · San Francisco · Washington",
      kicker: "Extra: President Announces Japanese Surrender",
      headline: "JAPAN SURRENDERS",
      deck: "War ends after three years, eight months; crowds fill streets from Honolulu to Washington as President calls for formal ceremony at sea",
      bylineLeft: "By The Associated Press, Washington", bylineRight: "Formal Signing Awaits Fleet Arrival in Tokyo Bay",
      columns: [
        {
          head: "Terms Accepted",
          paras: [
            "The President announced tonight that the Japanese government has accepted the terms of surrender set out at Potsdam, bringing to a close a war that began for this country at Pearl Harbor three years and eight months ago. The announcement, delivered from the White House shortly after seven o'clock, triggered immediate celebration in every city reached by wire before the statement had finished.",
            "A formal signing ceremony aboard a naval vessel in Tokyo Bay is expected within weeks, once occupation forces are in position. Until then, the President's statement said, American forces in the Pacific remain under orders to continue operations against any Japanese units not yet informed of, or not yet complying with, the surrender.",
          ],
        },
        {
          head: "Three Years and Eight Months",
          paras: [
            "Crowds gathered spontaneously outside newspaper offices and public buildings from Honolulu to Washington within the hour, a scene wire correspondents on the ground described as unlike anything in living memory. Bells rang in cities that still had bells to ring; strangers embraced in streets that had spent nearly four years rationing everything from gasoline to sugar.",
            "Military officials cautioned that formal hostilities do not end until the ceremony in Tokyo Bay is complete, and that scattered fighting could continue in the meantime. For tonight, in most of the country, that distinction went largely unheeded.",
          ],
        },
      ],
      photoCaption: "Caption to follow pending wire transmission.",
      photoLabel: "PHOTOGRAPH PENDING: WIRE TRANSMISSION DELAYED BY VOLUME",
    },
  },
};

// ---------- HISTORICAL DIVERGENCE MODE ----------
// A per-campaign War Room checkbox ("Historically Accurate Opponent," ticked by default).
// Unticking it silently rolls each of this campaign's forks at even odds — moments where the
// OTHER side does something other than what actually happened, unrelated to anything the
// player chose. Never announced when rolled: each fork's flag is only discovered in play, at
// its own revealNode, via a lightweight DivergenceRevealScreen (distinct from the full
// PressReportScreen newspaper mockups above — those are reserved for the five fixed
// historical beats every playthrough passes through; a divergence reveal is closer to a
// signals-intelligence footnote than a front page, and writing six of those as full mocked-up
// newspapers wasn't proportionate to what they actually are).
//
// Ported from Dispatches 1940's own Historical Divergence Mode, same mechanism, new research:
// both forks below are real, sourced contingencies, not invented what-ifs (see the flag
// comments). Two forks exist so far, one per campaign — more can be added the same way, each
// needing its own real source, not just a plausible-sounding guess.
const DIVERGENCE_FORKS = {
  japan: [
    // Real: Yorktown's Coral Sea damage was estimated at 90 days' repair; Nimitz demanded
    // three, and the Pearl Harbor yard delivered — 1,400 men working around the clock,
    // standard safety protocol waived, one plate welded over the worst of the hull damage
    // rather than a proper repair. The dockyard officer who got the order is recorded as
    // having "gulped" before saying it could be done. This was a genuinely contingent,
    // scrambled effort, not a foregone conclusion — a divergence where it drags past three
    // days or fails outright is real, not invented. (Source: Defense Media Network, "You've
    // Got Three Days: Repairing the Yorktown After Coral Sea.")
    { id: "yorktownDelayed", flag: "forkYorktownDelayed", revealNode: "coralSea42", endingCapable: false },
  ],
  alliedPacific: [
    // Real: the Japanese cruiser Tone's No. 4 scout plane launched roughly 30 minutes late on
    // the morning of Midway, cutting its search leg short — popularly blamed for the Japanese
    // defeat. Naval historians' actual assessment inverts that: had it launched on schedule
    // and flown the full prescribed leg, it would have missed the American task force
    // entirely. The late, shortened search was "one of Nagumo's few lucky breaks," not a
    // costly mistake — a real, ironic, well-documented contingency. (Source: Naval History
    // and Heritage Command, H-Gram 006.)
    { id: "toneOnTime", flag: "forkToneOnTime", revealNode: "kokodaTrailAllied42", endingCapable: false },
  ],
};

// Reveal copy for DivergenceRevealScreen — framed as an uncertain intelligence footnote
// (signals analysis, a debrief, a rumor), not a confirmed press bulletin, since unlike
// PRESS_CONTENT's five beats, nobody at the time announced any of this.
const DIVERGENCE_HEADLINES = {
  yorktownDelayed: {
    id: "yorktownDelayed",
    year: 1942,
    month: "JUNE",
    headline: "Naval Intelligence: American Carrier Repair Efforts Reportedly Faltering",
    dek: "Reports reaching this staff describe difficulty within the American Pacific Fleet returning its Coral Sea casualty to service on the timetable earlier intercepts suggested. Whether this changes the number of flight decks actually opposing this command's next operation cannot yet be confirmed with certainty.",
  },
  toneOnTime: {
    id: "toneOnTime",
    year: 1942,
    month: "JUNE",
    headline: "Signals Analysis: Japanese Scout Pattern May Have Flown as Originally Planned",
    dek: "A postwar-style review of the intercepted search pattern flown ahead of the Midway engagement suggests the cruiser-launched scout aircraft credited with the contact report may in fact have held to its original assigned leg rather than the shortened one earlier accounts described. Fleet intelligence notes the distinction matters less for what was found than for how easily, on this specific morning, it might not have been.",
  },
};

function rollDivergenceForks(campaignId) {
  const forks = DIVERGENCE_FORKS[campaignId] || [];
  const flags = {};
  forks.forEach((f) => {
    if (Math.random() < 0.5) flags[f.flag] = true;
  });
  return flags;
}

// ---------- WAR ROOM: LEADER QUOTE ----------
// One line shown before the player commits to a campaign. The Allied line is FDR's own
// words, genuinely short enough to quote directly (see the copyright discipline this file
// follows throughout — under 15 words, one quote, no reproduction of the full address).
// The Japan line is not a verbatim quote: several of the famous English-language lines
// attributed to Yamamoto ("sleeping giant," "run wild for six months") are historically
// disputed or outright fabricated, traced to postwar screenwriters rather than any primary
// source. Rather than risk repeating one of those as fact, this line is original but
// grounded in his real, well-documented correspondence, a January 1941 letter to Diet
// member Ryoichi Sasakawa arguing that defeating the United States would require marching
// on Washington itself, and his real, recorded skepticism about a protracted war, not
// a translation of any single letter.
const LEADER_QUOTES = {
  japan: {
    name: "Yamamoto",
    quote: "In the first six months to a year of war with the United States and Britain I will run wild and win victory after victory. But then, if the war continues after that, I have no expectation of success.",
  },
  alliedPacific: {
    name: "President Roosevelt",
    quote: "Yesterday, December 7, 1941, a date which will live in infamy.",
  },
};

// A node stored as JSON: a fresh copy per call, as a getter returned a fresh object before.
// A choice with `rollMeter` has a two-outcome roll whose first weight is nudged by that meter (modWeight), as the code nodes do.
const dataNode = (data, id, meters) => {
  const node = JSON.parse(JSON.stringify(data[id]));
  if (meters) {
    for (const c of node.choices || []) {
      if (c.rollMeter && c.uncertain && c.uncertain.length === 2) {
        const w = modWeight(c.uncertain[0].weight, meters[c.rollMeter]);
        c.uncertain[0].weight = w;
        c.uncertain[1].weight = Math.max(5, 100 - w);
      }
    }
  }
  return node;
};
// alliedPacific: nodes that are plain data live in src/data/alliedPacific.nodes.json (inlined at assembly). Nodes that read flags or meters stay code in the campaign part.
const ALLIED_PACIFIC_DATA = /*@inline-json src/data/alliedPacific.nodes.json*/null;

const CAMPAIGNS = {
