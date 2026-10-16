// =============================================================================
// SOUND
// =============================================================================
//
// Made in the browser, with no audio files: the settings have Off, Typewriter (the key click and the stamp, in playSound) and Atmosphere, which adds
// an ambience for the command in play (distant guns, wind, rain) and small sounds for a cable, a seal, a signature and a held order. Nothing here is
// needed to play; every call is guarded and silent when the browser has no audio or has not allowed it yet.

let audioMode = 0; // 0 off, 1 typewriter, 2 atmosphere
let AU = null; // { ctx, master, brown, white, amb }

// ---------- the soundtrack ----------
//
// One looping track (assets/theme.mp3), bundled as a data URL and handed over by entry.jsx as window.__DISPATCHES_THEME__. It is on by default and is
// played once the browser has seen a tap or a key, because no browser will start sound before that. The element goes through a Web Audio gain node,
// because an iPhone ignores the element's own volume; the volume setting turns that gain. Nothing here is needed to play: with no track, no audio, or a
// test page that has no sound, every call does nothing.

let MU = null; // { el, ctx, gain }
let musicWant = null; // the volume the music should have, or null when it should be off

function musicUp() {
  if (MU) return MU;
  try {
    const src = typeof window !== "undefined" ? window.__DISPATCHES_THEME__ : null;
    if (!src || /jsdom/i.test((typeof navigator !== "undefined" && navigator.userAgent) || "")) return null;
    const el = new Audio(src);
    el.loop = true;
    el.preload = "auto";
    let ctx = null;
    let gain = null;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) {
      ctx = new AC();
      gain = ctx.createGain();
      gain.gain.value = 0;
      ctx.createMediaElementSource(el).connect(gain).connect(ctx.destination);
    }
    MU = { el, ctx, gain };
  } catch (e) {
    MU = null;
  }
  return MU;
}

function musicLevel(mu, volume) {
  if (mu.gain) mu.gain.gain.setTargetAtTime(volume, mu.ctx.currentTime, 0.35);
  else mu.el.volume = volume;
}

/** Turns the music on at a volume from 0 to 1, or off. Safe to call before the browser has allowed sound: the first tap or key retries it. */
function musicApply(on, volume) {
  musicWant = on ? volume : null;
  const mu = on ? musicUp() : MU;
  if (!mu) return;
  try {
    if (!on) { mu.el.pause(); return; }
    if (mu.ctx && mu.ctx.state === "suspended") mu.ctx.resume().catch(() => {});
    musicLevel(mu, volume);
    const p = mu.el.play();
    if (p && p.catch) p.catch(() => {});
  } catch (e) { /* no sound here */ }
}

/** Called on the first tap or key: starts the music if it should be playing and the browser had refused it before. */
function musicResume() {
  if (musicWant === null) return;
  const mu = musicUp();
  if (!mu) return;
  try {
    if (mu.ctx && mu.ctx.state === "suspended") mu.ctx.resume().catch(() => {});
    if (mu.el.paused) { musicLevel(mu, musicWant); const p = mu.el.play(); if (p && p.catch) p.catch(() => {}); }
  } catch (e) { /* no sound here */ }
}

/** What each command sounds like: guns (a shell every so many seconds, on average; 0 for none), wind, rain and a low hum. */
const ATMOSPHERE = {
  ohl: { guns: 7, wind: 0.05, rain: 0, hum: 0.16 },
  gqg: { guns: 6, wind: 0.04, rain: 0.05, hum: 0.14 },
  stavka: { guns: 14, wind: 0.17, rain: 0, hum: 0.1 },
  bef: { guns: 5, wind: 0.04, rain: 0.09, hum: 0.14 },
  aok: { guns: 11, wind: 0.12, rain: 0.04, hum: 0.12 },
  otto: { guns: 16, wind: 0.14, rain: 0, hum: 0.08 },
};

function setAudioMode(m) {
  audioMode = m;
  if (m < 2) atmosphereStop();
}

function audioUp() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!AU) {
      const ctx = new AC();
      const master = ctx.createGain();
      master.gain.value = 0.75;
      master.connect(ctx.destination);
      const mk = (brown) => {
        const len = ctx.sampleRate * 2;
        const buf = ctx.createBuffer(1, len, ctx.sampleRate);
        const d = buf.getChannelData(0);
        let last = 0;
        for (let i = 0; i < len; i++) {
          const w = Math.random() * 2 - 1;
          if (brown) { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; } else d[i] = w;
        }
        return buf;
      };
      AU = { ctx, master, brown: mk(true), white: mk(false), amb: null };
    }
    if (AU.ctx.state === "suspended") AU.ctx.resume();
    return AU;
  } catch (e) {
    return null;
  }
}

function noiseSource(a, buf) {
  const src = a.ctx.createBufferSource();
  src.buffer = buf;
  src.loop = true;
  return src;
}

/** One shell, far off: a falling thump and a muffled burst, and a softer echo after it. */
function distantGun(a, level) {
  const { ctx } = a;
  const t = ctx.currentTime;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = "sine";
  o.frequency.setValueAtTime(70 + Math.random() * 25, t);
  o.frequency.exponentialRampToValueAtTime(26, t + 0.6);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(level, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
  o.connect(g);
  g.connect(a.master);
  o.start(t);
  o.stop(t + 1);
  const n = noiseSource(a, a.white);
  const f = ctx.createBiquadFilter();
  f.type = "lowpass";
  f.frequency.value = 260;
  const ng = ctx.createGain();
  ng.gain.setValueAtTime(level * 0.9, t);
  ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);
  n.connect(f);
  f.connect(ng);
  ng.connect(a.master);
  n.start(t);
  n.stop(t + 0.8);
}

function atmosphereStop() {
  if (!AU || !AU.amb) return;
  const amb = AU.amb;
  AU.amb = null;
  try {
    amb.clear();
    const t = AU.ctx.currentTime;
    amb.out.gain.cancelScheduledValues(t);
    amb.out.gain.setValueAtTime(amb.out.gain.value, t);
    amb.out.gain.linearRampToValueAtTime(0.0001, t + 1.2);
    setTimeout(() => { try { amb.sources.forEach((s) => s.stop()); amb.out.disconnect(); } catch (e) { /* already stopped */ } }, 1400);
  } catch (e) { /* silent */ }
}

/** Start the ambience for a command, fading out whatever was playing. */
function atmosphereStart(campaignId) {
  if (audioMode < 2) return;
  const a = audioUp();
  if (!a) return;
  if (a.amb && a.amb.campaign === campaignId) return;
  atmosphereStop();
  const p = ATMOSPHERE[campaignId] || ATMOSPHERE.ohl;
  const { ctx } = a;
  const out = ctx.createGain();
  out.gain.value = 0.0001;
  out.connect(a.master);
  out.gain.linearRampToValueAtTime(1, ctx.currentTime + 2.5);
  const sources = [];
  const add = (src, filters, level) => {
    let node = src;
    for (const f of filters) { node.connect(f); node = f; }
    const g = ctx.createGain();
    g.gain.value = level;
    node.connect(g);
    g.connect(out);
    src.start();
    sources.push(src);
    return g;
  };
  const bp = (freq, q) => { const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = freq; f.Q.value = q; return f; };
  const lp = (freq) => { const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = freq; return f; };
  const hp = (freq) => { const f = ctx.createBiquadFilter(); f.type = "highpass"; f.frequency.value = freq; return f; };
  if (p.hum) add(noiseSource(a, a.brown), [lp(140)], p.hum);
  if (p.wind) {
    const wg = add(noiseSource(a, a.brown), [bp(520, 0.7)], p.wind);
    const lfo = ctx.createOscillator();
    const depth = ctx.createGain();
    lfo.frequency.value = 0.07 + Math.random() * 0.06;
    depth.gain.value = p.wind * 0.8;
    lfo.connect(depth);
    depth.connect(wg.gain);
    lfo.start();
    sources.push(lfo);
  }
  if (p.rain) add(noiseSource(a, a.white), [hp(2400), lp(9000)], p.rain);
  let timer = null;
  const schedule = () => {
    timer = setTimeout(() => {
      if (!AU || !AU.amb || AU.amb.campaign !== campaignId) return;
      const level = 0.12 + Math.random() * 0.2;
      distantGun(a, level);
      if (Math.random() < 0.45) setTimeout(() => { if (AU && AU.amb) distantGun(a, level * 0.5); }, 280 + Math.random() * 500);
      schedule();
    }, (p.guns * 1000) * (0.4 + Math.random() * 1.2));
  };
  a.amb = { campaign: campaignId, out, sources, clear: () => { if (timer) clearTimeout(timer); timer = null; } };
  if (p.guns) schedule();
}

/** A short sound: "telegraph" (a bulletin arrives), "seal" (a cable is opened), "sign" (an order is given), "hold" and "release" (an order held down). */
function atmosphereFx(name) {
  if (audioMode < 2) return;
  const a = audioUp();
  if (!a) return;
  try {
    const { ctx } = a;
    const t = ctx.currentTime;
    if (name === "telegraph") {
      let at = t + 0.05;
      for (let i = 0; i < 9; i++) {
        const dur = Math.random() < 0.5 ? 0.045 : 0.13;
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "square";
        o.frequency.value = 620;
        g.gain.setValueAtTime(0.0001, at);
        g.gain.exponentialRampToValueAtTime(0.035, at + 0.005);
        g.gain.setValueAtTime(0.035, at + dur);
        g.gain.exponentialRampToValueAtTime(0.0001, at + dur + 0.01);
        o.connect(g);
        g.connect(a.master);
        o.start(at);
        o.stop(at + dur + 0.02);
        at += dur + 0.06 + Math.random() * 0.05;
      }
    } else if (name === "seal" || name === "sign") {
      const n = noiseSource(a, a.white);
      const f = ctx.createBiquadFilter();
      f.type = name === "seal" ? "highpass" : "bandpass";
      if (name === "seal") f.frequency.value = 2800;
      else { f.Q.value = 2.2; f.frequency.setValueAtTime(1300, t); f.frequency.linearRampToValueAtTime(3400, t + 0.4); }
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      if (name === "seal") {
        for (let i = 0; i < 7; i++) { const at = t + i * 0.025 + Math.random() * 0.012; g.gain.setValueAtTime(0.05 + Math.random() * 0.05, at); g.gain.exponentialRampToValueAtTime(0.004, at + 0.02); }
      } else {
        g.gain.exponentialRampToValueAtTime(0.05, t + 0.04);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
      }
      n.connect(f);
      f.connect(g);
      g.connect(a.master);
      n.start(t);
      n.stop(t + 0.5);
    } else if (name === "hold") {
      if (a.hold) return;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "triangle";
      o.frequency.setValueAtTime(95, t);
      o.frequency.linearRampToValueAtTime(210, t + 0.9);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.05, t + 0.12);
      o.connect(g);
      g.connect(a.master);
      o.start(t);
      a.hold = { o, g };
    } else if (name === "release" && a.hold) {
      const { o, g } = a.hold;
      a.hold = null;
      g.gain.cancelScheduledValues(t);
      g.gain.setValueAtTime(g.gain.value, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
      o.stop(t + 0.15);
    }
  } catch (e) { /* silent */ }
}
