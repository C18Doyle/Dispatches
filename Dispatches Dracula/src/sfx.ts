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

// ---- the sounds of the place: all made here, none loaded ----

/** One pitch glide through the context: a voice or a creak. `points` is [seconds from now, hertz] in order. */
function glide(points: Array<[number, number]>, volume: number, type: OscillatorType, duration: number, opts: { vibrato?: number; lowpass?: number } = {}, delay = 0) {
  const c = getCtx();
  if (!c || volume <= 0) return;
  try {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    const now = c.currentTime + delay;
    osc.frequency.setValueAtTime(points[0][1], now);
    for (const [t, f] of points.slice(1)) osc.frequency.linearRampToValueAtTime(f, now + t);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + duration * 0.25);
    gain.gain.linearRampToValueAtTime(volume * 0.8, now + duration * 0.7);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    let tail: AudioNode = gain;
    if (opts.lowpass) {
      const lp = c.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = opts.lowpass;
      gain.connect(lp);
      tail = lp;
    }
    if (opts.vibrato) {
      const lfo = c.createOscillator();
      const depth = c.createGain();
      lfo.frequency.value = opts.vibrato;
      depth.gain.value = points[0][1] * 0.015;
      lfo.connect(depth).connect(osc.frequency);
      lfo.start(now);
      lfo.stop(now + duration + 0.05);
    }
    osc.connect(gain);
    tail.connect(c.destination);
    osc.start(now);
    osc.stop(now + duration + 0.05);
  } catch {
    /* audio is a nicety */
  }
}

/** A wolf a long way off: a rising, wavering call that falls away. */
export function playHowl(volume: number) {
  glide([[0, 300], [0.5, 470], [1.1, 520], [1.9, 380], [2.6, 300]], volume * 0.2, "triangle", 2.6, { vibrato: 5.5, lowpass: 1400 });
  glide([[0, 305], [0.5, 480], [1.1, 530], [1.9, 390], [2.6, 310]], volume * 0.1, "sine", 2.6, { vibrato: 6.2 }, 0.05);
}

/** A church bell struck: a few partials, long decay. `times` strokes, a second and a half apart. */
export function playBell(volume: number, times = 1) {
  const c = getCtx();
  if (!c || volume <= 0) return;
  for (let k = 0; k < times; k++) {
    for (const [mult, amp] of [[1, 1], [2.0, 0.55], [2.76, 0.4], [5.4, 0.2]] as Array<[number, number]>) tone(196 * mult, 3.2 / (1 + mult * 0.25), volume * 0.2 * amp, "sine", k * 1.6);
  }
}

/** A door on an old hinge. */
export function playCreak(volume: number) {
  glide([[0, 90], [0.25, 150], [0.45, 110], [0.8, 190], [1.1, 85]], volume * 0.12, "sawtooth", 1.15, { lowpass: 700 });
  noiseBurst(0.4, volume * 0.06, 500, 0.1);
}

/** Wings: a quick flutter of short bursts. */
export function playBats(volume: number) {
  for (let i = 0; i < 7; i++) noiseBurst(0.035, volume * 0.18, 3200 + (i % 3) * 400, i * 0.045);
}

/** Rats in the wall: scratching at uneven intervals. */
export function playScurry(volume: number) {
  const gaps = [0, 0.07, 0.19, 0.24, 0.41, 0.47, 0.52, 0.72, 0.79];
  gaps.forEach((d, i) => noiseBurst(0.03, volume * 0.14, 2200 + (i % 4) * 500, d));
}

/** Two low beats, a heart under the floor, for when a reserve is at its brink. */
export function playHeartbeat(volume: number) {
  tone(58, 0.22, volume * 0.5, "sine");
  tone(52, 0.26, volume * 0.38, "sine", 0.3);
}

/** A pen on paper. */
export function playScratch(volume: number) {
  for (let i = 0; i < 9; i++) noiseBurst(0.04 + (i % 3) * 0.015, volume * 0.1, 4200 + (i % 2) * 600, i * 0.09);
}
