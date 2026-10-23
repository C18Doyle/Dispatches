/**
 * The game's music, made in the browser with the Web Audio API: no audio file is shipped. A low drone, a little wind and an occasional bell, with a heartbeat
 * under a venture. `setMood` follows the screen and the state of the reserves; the track (a branch id) colours it: the Storm has more wind, the Quiet Colony fewer
 * bells, the Court a fuller chord. Nothing here runs unless the player has turned music on and touched the page (browsers will not start audio before that), and
 * where Web Audio does not exist (a test run in jsdom) every call does nothing.
 */
export type ScoreMood = "menu" | "calm" | "dread" | "venture" | "crisis" | "ending" | "failure";

interface MoodSpec {
  drone: number; // gain of the drone
  wind: number; // gain of the wind
  cutoff: number; // the drone's low-pass, in Hz: the lower, the darker
  bellMs: number; // mean time between bells; 0 for none
  heart: number; // heartbeats a minute; 0 for none
  sour: boolean; // add a flat second to the bell notes
}

const MOODS: Record<ScoreMood, MoodSpec> = {
  menu: { drone: 0.5, wind: 0.05, cutoff: 520, bellMs: 9000, heart: 0, sour: false },
  calm: { drone: 0.45, wind: 0.06, cutoff: 480, bellMs: 8000, heart: 0, sour: false },
  dread: { drone: 0.6, wind: 0.1, cutoff: 360, bellMs: 5500, heart: 0, sour: true },
  venture: { drone: 0.55, wind: 0.08, cutoff: 420, bellMs: 0, heart: 66, sour: true },
  crisis: { drone: 0.7, wind: 0.14, cutoff: 300, bellMs: 4000, heart: 90, sour: true },
  ending: { drone: 0.4, wind: 0.04, cutoff: 600, bellMs: 6000, heart: 0, sour: false },
  failure: { drone: 0.3, wind: 0.12, cutoff: 240, bellMs: 12000, heart: 0, sour: true },
};

const ROOT = 73.42; // D2
const BELL_NOTES = [293.66, 329.63, 349.23, 392, 440, 523.25, 587.33]; // D dorian from D4
const SOUR_NOTE = 311.13; // E flat 4

const TRACK: Record<string, { wind: number; bell: number; fifth: number }> = {
  QUIET: { wind: 1, bell: 1.5, fifth: 0.5 },
  COURT: { wind: 1, bell: 1, fifth: 1.2 },
  STORM: { wind: 2.2, bell: 0.8, fifth: 0.5 },
};

class Score {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private droneGain: GainNode | null = null;
  private fifthGain: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private windGain: GainNode | null = null;
  private mood: ScoreMood = "menu";
  private branch = "UNIVERSAL";
  private volume = 0.45;
  private on = false;
  private timer: ReturnType<typeof setInterval> | null = null;
  private nextBell = 0;
  private nextBeat = 0;

  private get supported(): boolean {
    return typeof window !== "undefined" && !!(window.AudioContext || (window as unknown as { webkitAudioContext?: unknown }).webkitAudioContext);
  }

  /** Begins (or resumes) the music. Call it from a click; it is safe to call again. */
  start(): void {
    if (!this.supported) return;
    this.on = true;
    try {
      if (!this.ctx) this.build();
      void this.ctx?.resume();
      this.apply();
      if (!this.timer) this.timer = setInterval(() => this.tick(), 200);
    } catch {
      /* music is a keepsake, never a requirement */
    }
  }

  stop(): void {
    this.on = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.ctx && this.master) {
      this.master.gain.setTargetAtTime(0, this.ctx.currentTime, 0.4);
      const ctx = this.ctx;
      setTimeout(() => {
        if (!this.on) void ctx.suspend();
      }, 1500);
    }
  }

  setVolume(v: number): void {
    this.volume = Math.min(1, Math.max(0, v));
    this.apply();
  }

  setMood(mood: ScoreMood, branch: string): void {
    this.mood = mood;
    this.branch = branch;
    this.apply();
  }

  private build(): void {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctor();
    this.ctx = ctx;
    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    this.master = master;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 480;
    filter.Q.value = 0.7;
    filter.connect(master);
    this.filter = filter;

    // the drone: two sawtooth voices a fifth apart, the second a shade out of tune, and a slow breathing in the filter
    const droneGain = ctx.createGain();
    droneGain.gain.value = 0;
    droneGain.connect(filter);
    this.droneGain = droneGain;
    const fifthGain = ctx.createGain();
    fifthGain.gain.value = 0;
    fifthGain.connect(filter);
    this.fifthGain = fifthGain;
    const root = ctx.createOscillator();
    root.type = "sawtooth";
    root.frequency.value = ROOT;
    root.connect(droneGain);
    const root2 = ctx.createOscillator();
    root2.type = "sawtooth";
    root2.frequency.value = ROOT;
    root2.detune.value = 7;
    root2.connect(droneGain);
    const fifth = ctx.createOscillator();
    fifth.type = "sawtooth";
    fifth.frequency.value = ROOT * 1.5;
    fifth.connect(fifthGain);
    const breath = ctx.createOscillator();
    breath.frequency.value = 0.07;
    const breathDepth = ctx.createGain();
    breathDepth.gain.value = 110;
    breath.connect(breathDepth);
    breathDepth.connect(filter.frequency);
    for (const o of [root, root2, fifth, breath]) o.start();

    // the wind: filtered noise, rising and falling
    const length = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    const band = ctx.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = 420;
    band.Q.value = 0.6;
    const windGain = ctx.createGain();
    windGain.gain.value = 0;
    noise.connect(band);
    band.connect(windGain);
    windGain.connect(master);
    this.windGain = windGain;
    const gust = ctx.createOscillator();
    gust.frequency.value = 0.13;
    const gustDepth = ctx.createGain();
    gustDepth.gain.value = 0.04;
    gust.connect(gustDepth);
    gustDepth.connect(windGain.gain);
    noise.start();
    gust.start();
  }

  /** Moves the sound towards what the mood and the volume ask for. */
  private apply(): void {
    const ctx = this.ctx;
    if (!ctx || !this.master || !this.droneGain || !this.fifthGain || !this.filter || !this.windGain) return;
    const m = MOODS[this.mood];
    const t = TRACK[this.branch] ?? { wind: 1, bell: 1, fifth: 0.8 };
    const now = ctx.currentTime;
    this.master.gain.setTargetAtTime(this.on ? this.volume * 0.55 : 0, now, 0.6);
    this.droneGain.gain.setTargetAtTime(m.drone * 0.18, now, 1.2);
    this.fifthGain.gain.setTargetAtTime(m.drone * 0.1 * t.fifth, now, 1.2);
    this.filter.frequency.setTargetAtTime(m.cutoff, now, 1.5);
    this.windGain.gain.setTargetAtTime(Math.min(0.3, m.wind * t.wind), now, 1.5);
  }

  private tick(): void {
    const ctx = this.ctx;
    if (!ctx || !this.on || ctx.state !== "running") return;
    const m = MOODS[this.mood];
    const t = TRACK[this.branch] ?? { wind: 1, bell: 1, fifth: 0.8 };
    const now = ctx.currentTime;
    if (m.bellMs > 0 && now >= this.nextBell) {
      this.bell(m.sour);
      this.nextBell = now + (m.bellMs / 1000) * t.bell * (0.6 + Math.random() * 0.8);
    }
    if (m.heart > 0 && now >= this.nextBeat) {
      this.beat();
      this.nextBeat = now + 60 / m.heart;
    }
  }

  private bell(sour: boolean): void {
    const ctx = this.ctx;
    if (!ctx || !this.master) return;
    const notes = sour ? [...BELL_NOTES, SOUR_NOTE] : BELL_NOTES;
    const f = notes[Math.floor(Math.random() * notes.length)];
    const now = ctx.currentTime;
    for (const [mult, level, decay] of [[1, 0.1, 6], [2.76, 0.03, 2.5]] as const) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = f * mult;
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(level, now + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, now + decay);
      osc.connect(g);
      g.connect(this.master);
      osc.start(now);
      osc.stop(now + decay + 0.1);
    }
  }

  private beat(): void {
    const ctx = this.ctx;
    if (!ctx || !this.master) return;
    const now = ctx.currentTime;
    for (const delay of [0, 0.22]) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(70, now + delay);
      osc.frequency.exponentialRampToValueAtTime(42, now + delay + 0.12);
      g.gain.setValueAtTime(0.0001, now + delay);
      g.gain.exponentialRampToValueAtTime(delay ? 0.12 : 0.2, now + delay + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.18);
      osc.connect(g);
      g.connect(this.master);
      osc.start(now + delay);
      osc.stop(now + delay + 0.25);
    }
  }
}

export const score = new Score();
