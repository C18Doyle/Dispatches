/**
 * Synthesized sound effects via the Web Audio API — no external audio files,
 * so there's nothing to source, license, or fail to load. Every effect is a
 * short oscillator/noise burst with a gain envelope. Volume is 0-1 and is
 * always multiplied down per-effect so nothing clips or overwhelms the music.
 */

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    return ctx;
  } catch {
    return null;
  }
}

function tone(freq: number, duration: number, volume: number, type: OscillatorType, delay = 0) {
  const c = getCtx();
  if (!c || volume <= 0) return;
  try {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    const now = c.currentTime + delay;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(gain).connect(c.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  } catch {
    /* audio is a nicety — never let it throw into the render path */
  }
}

function noiseBurst(duration: number, volume: number, filterFreq: number, delay = 0) {
  const c = getCtx();
  if (!c || volume <= 0) return;
  try {
    const bufferSize = Math.max(1, Math.floor(c.sampleRate * duration));
    const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    const src = c.createBufferSource();
    src.buffer = buffer;
    const filter = c.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = filterFreq;
    const gain = c.createGain();
    const now = c.currentTime + delay;
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    src.connect(filter).connect(gain).connect(c.destination);
    src.start(now);
  } catch {
    /* ignore */
  }
}

// A soft, period-appropriate tap for routine navigation (settings, back,
// continue) — a muted paper/wood contact rather than a digital blip. This
// fires on nearly every button in the game, so it stays quiet on purpose;
// the previous 720Hz square-wave tone read as a distinctly modern,
// "electronic and plinky" 8-bit blip.
export function playClick(volume: number) {
  noiseBurst(0.035, volume * 0.18, 1000);
}

// A touch more weight than playClick for actually committing to a story
// choice — still an era-appropriate contact sound, not a digital chime.
export function playSelect(volume: number) {
  noiseBurst(0.05, volume * 0.24, 700);
  tone(180, 0.07, volume * 0.1, "sine", 0.015);
}

export function playPageTurn(volume: number) {
  noiseBurst(0.2, volume * 0.5, 1800);
}

export function playUnlock(volume: number) {
  tone(340, 0.09, volume * 0.35, "square");
  tone(560, 0.12, volume * 0.32, "square", 0.06);
}

// A single low, dissonant drone struck once when the Experiment screen's
// suspense phase begins — sustained roughly as long as that phase runs, so
// it reads as one held breath rather than a repeating tick.
export function playTension(volume: number) {
  tone(90, 1.5, volume * 0.22, "sawtooth");
  tone(93, 1.5, volume * 0.18, "sawtooth", 0.4);
}

export function playSuccess(volume: number) {
  tone(440, 0.15, volume * 0.4, "triangle");
  tone(660, 0.2, volume * 0.4, "triangle", 0.09);
  tone(880, 0.22, volume * 0.3, "triangle", 0.18);
}

export function playFailure(volume: number) {
  tone(220, 0.3, volume * 0.4, "sawtooth");
  tone(155, 0.4, volume * 0.35, "sawtooth", 0.08);
}

export function playCrisis(volume: number) {
  tone(110, 0.55, volume * 0.5, "sawtooth");
  tone(116, 0.55, volume * 0.4, "sawtooth", 0.18);
}

export function playEnding(volume: number) {
  tone(220, 0.7, volume * 0.32, "sine");
  tone(330, 0.8, volume * 0.28, "sine", 0.12);
  tone(440, 1.0, volume * 0.24, "sine", 0.28);
}

// A distinct, unresolved sting for the crisis/failure endings — playEnding's
// rising major triad reads as a resolution, which is wrong for "The Work
// Collapses." This falls instead of rises, and lands on a dissonant minor
// second rather than settling.
export function playEndingCrisis(volume: number) {
  tone(196, 0.9, volume * 0.38, "sawtooth");
  tone(147, 1.0, volume * 0.32, "sawtooth", 0.15);
  tone(139, 1.2, volume * 0.3, "sawtooth", 0.32);
}

// ───────────── atmosphere ─────────────
// A quiet bed under the whole game: a low two-note drone, a slow wind of filtered noise, and now and then a distant clock chime. It is
// made from oscillators like every other sound here, so there is no file to load, and it is off until the player has clicked once (browsers
// refuse sound before that) and whenever the Atmosphere setting is off.
let ambient: { master: GainNode; stop: () => void } | null = null;

export function startAmbient(volume: number) {
  if (ambient) {
    setAmbientVolume(volume);
    return;
  }
  const c = getCtx();
  if (!c || volume <= 0) return;
  try {
    const master = c.createGain();
    master.gain.value = 0;
    master.gain.linearRampToValueAtTime(volume * 0.2, c.currentTime + 3);
    master.connect(c.destination);
    const stoppers: Array<() => void> = [];

    // the drone: two low notes a fifth apart, through a soft low-pass, breathing slowly
    const droneGain = c.createGain();
    droneGain.gain.value = 0.5;
    const low = c.createBiquadFilter();
    low.type = "lowpass";
    low.frequency.value = 220;
    droneGain.connect(low).connect(master);
    for (const f of [55, 82.4]) {
      const o = c.createOscillator();
      o.type = "triangle";
      o.frequency.value = f;
      o.connect(droneGain);
      o.start();
      stoppers.push(() => o.stop());
    }
    const lfo = c.createOscillator();
    lfo.frequency.value = 0.06;
    const lfoDepth = c.createGain();
    lfoDepth.gain.value = 0.25;
    lfo.connect(lfoDepth).connect(droneGain.gain);
    lfo.start();
    stoppers.push(() => lfo.stop());

    // the fog: four seconds of noise, looped, band-passed and held low
    const len = c.sampleRate * 4;
    const buf = c.createBuffer(1, len, c.sampleRate);
    const d = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      last = last * 0.96 + (Math.random() * 2 - 1) * 0.04;
      d[i] = last * 6;
    }
    const src = c.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const band = c.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = 380;
    band.Q.value = 0.4;
    const fog = c.createGain();
    fog.gain.value = 0.35;
    src.connect(band).connect(fog).connect(master);
    src.start();
    stoppers.push(() => src.stop());

    // a clock chime, far off, every so often
    let timer = 0;
    const chime = () => {
      tone(523.25, 3.2, volume * 0.07, "sine");
      tone(1046.5, 2.2, volume * 0.02, "sine", 0.01);
      timer = window.setTimeout(chime, 35000 + Math.random() * 40000);
    };
    timer = window.setTimeout(chime, 20000);

    ambient = {
      master,
      stop: () => {
        window.clearTimeout(timer);
        try {
          master.gain.cancelScheduledValues(c.currentTime);
          master.gain.setValueAtTime(master.gain.value, c.currentTime);
          master.gain.linearRampToValueAtTime(0.0001, c.currentTime + 0.8);
          window.setTimeout(() => stoppers.forEach((s) => s()), 900);
        } catch {
          /* ignore */
        }
      },
    };
  } catch {
    ambient = null;
  }
}

export function setAmbientVolume(volume: number) {
  const c = getCtx();
  if (!ambient || !c) return;
  try {
    ambient.master.gain.cancelScheduledValues(c.currentTime);
    ambient.master.gain.linearRampToValueAtTime(Math.max(0.0001, volume * 0.2), c.currentTime + 0.4);
  } catch {
    /* ignore */
  }
}

export function stopAmbient() {
  if (!ambient) return;
  ambient.stop();
  ambient = null;
}

// ───────────── stings ─────────────
/** A held, vibrato note on two slightly detuned strings: the sound of the path above the Falls. */
export function playViolin(volume: number) {
  const c = getCtx();
  if (!c || volume <= 0) return;
  try {
    const now = c.currentTime;
    const out = c.createGain();
    out.gain.setValueAtTime(0, now);
    out.gain.linearRampToValueAtTime(volume * 0.16, now + 0.35);
    out.gain.setValueAtTime(volume * 0.16, now + 2.2);
    out.gain.exponentialRampToValueAtTime(0.0001, now + 3.4);
    const filter = c.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 2400;
    out.connect(filter).connect(c.destination);
    const vibrato = c.createOscillator();
    vibrato.frequency.value = 5.4;
    const vibratoDepth = c.createGain();
    vibratoDepth.gain.value = 7;
    vibrato.connect(vibratoDepth);
    for (const [freq, detune] of [[659.25, 0], [659.25, 6], [329.63, -3]] as const) {
      const o = c.createOscillator();
      o.type = "sawtooth";
      o.frequency.setValueAtTime(freq * 0.97, now);
      o.frequency.exponentialRampToValueAtTime(freq, now + 0.4);
      o.detune.value = detune;
      vibratoDepth.connect(o.detune);
      o.connect(out);
      o.start(now);
      o.stop(now + 3.5);
    }
    vibrato.start(now);
    vibrato.stop(now + 3.5);
  } catch {
    /* ignore */
  }
}

/** One sound for each gauge falling into crisis: a dry paper rustle, a low bell, a heartbeat. */
export function playGaugeCrisis(volume: number, index: number) {
  if (index === 0) {
    noiseBurst(0.12, volume * 0.5, 2400);
    noiseBurst(0.1, volume * 0.4, 2000, 0.16);
    noiseBurst(0.09, volume * 0.3, 1600, 0.3);
    tone(130, 0.5, volume * 0.25, "sawtooth", 0.1);
  } else if (index === 1) {
    tone(164, 1.6, volume * 0.4, "sine");
    tone(328, 1.2, volume * 0.14, "sine", 0.01);
    tone(122, 1.6, volume * 0.22, "sine", 0.5);
  } else if (index === 3) {
    // Hours: a clock, running down
    for (let i = 0; i < 6; i++) tone(i % 2 ? 880 : 740, 0.05, volume * (0.32 - i * 0.03), "square", i * 0.28);
  } else if (index === 4) {
    // Hands: footsteps going away
    for (let i = 0; i < 5; i++) noiseBurst(0.09, volume * (0.5 - i * 0.08), 380, i * 0.34);
  } else if (index === 5) {
    // Wires: a key tapping out nothing
    for (const [d, len] of [[0, 0.05], [0.12, 0.12], [0.34, 0.05], [0.46, 0.05], [0.7, 0.12]] as const) tone(620, len, volume * 0.28, "square", d);
  } else {
    for (let i = 0; i < 4; i++) {
      tone(58, 0.16, volume * 0.55, "sine", i * 0.5);
      tone(52, 0.14, volume * 0.4, "sine", i * 0.5 + 0.2);
    }
  }
}
