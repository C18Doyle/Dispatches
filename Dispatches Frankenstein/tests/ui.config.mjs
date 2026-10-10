// UI-differential config for Dispatches: Frankenstein (see packages/testkit/README.md).
// Plays seeded random runs through dist/bundle.js in jsdom, on every difficulty, using the screens a player uses: the menu, the prologue,
// the difficulty card, the scenes (an option is armed by one tap and confirmed by a second), the experiment, the outcome, the newspaper
// interludes, Fritz's panel (advice, favor, gossip, the creature report) and the endings.
import { JSDOM } from "jsdom";

const DIFFICULTIES = ["Easy", "Medium", "Hard"];

export default {
  JSDOM,
  bundle: "dist/bundle.js",
  cases: DIFFICULTIES.map((d) => [d]),
  seeds: [1, 2, 3, 4, 5, 6, 7, 8],
  meta: ([d]) => ({ id: `frankenstein-${d.toLowerCase()}`, campaignId: "frankenstein", mode: d.toLowerCase() }),
  maxSteps: 160,
  stallLimit: 10,

  async setup(ctx, [difficulty]) {
    // The experiment holds on a timed suspense screen with a phrase that changes every 380 ms; the shared settle() can return in a gap, so
    // wait it out.
    const baseSettle = ctx.settle;
    ctx.settle = async () => {
      await baseSettle();
      for (let i = 0; i < 400 && /Holding Its Breath/.test(ctx.text()); i++) {
        await new Promise((r) => setTimeout(r, 25));
        await baseSettle();
      }
    };
    const press = async (re) => {
      const b = ctx.buttons().find((x) => re.test(ctx.lab(x)));
      if (!b) return `button missing: ${re}`;
      await ctx.click(b);
      return null;
    };
    return (await press(/^Begin the Work/)) || (await press(/^Continue$/)) || (await press(new RegExp(`^${difficulty}$`, "i"))) || (await press(/^Enter$/));
  },

  isCrashed: (ctx) => ctx.text().length < 20,
  isEnded: (ctx) => /Begin a New Experiment/.test(ctx.text()),

  choose(ctx, policy) {
    const t = ctx.text();
    const bs = ctx.buttons().filter((b) => !/^Settings$/i.test(ctx.lab(b)));
    const by = (re) => bs.find((b) => re.test(ctx.lab(b)));
    if (/An Experiment/.test(t)) return by(/^Conduct the Experiment/) || null;
    if (by(/^Turn the Page/)) return by(/^Turn the Page/);
    const options = bs.filter((b) => b.classList.contains("group"));
    if (!options.length) return by(/^Continue/) || by(/^Enter/) || null;

    // an option that was armed by the last tap is confirmed
    const armed = options.find((b) => /Tap again to confirm/.test(b.textContent));
    if (armed) return armed;

    // Fritz: at most two calls on him per scene, so a run cannot loop in his panel
    const scene = t.slice(0, 160);
    if (policy.scene !== scene) {
      policy.scene = scene;
      policy.fritz = 0;
    }
    const boost = bs.filter((b) => /^Boost /.test(ctx.lab(b)));
    if (boost.length) return boost[Math.floor(ctx.pick() * boost.length)];
    if (policy.fritz < 2 && ctx.pick() < 0.35) {
      const panel = bs.filter((b) => /^(Ask Fritz's Advice|Fritz's Favor|Gossip|Creature Report)/.test(ctx.lab(b)));
      const open = by(/^Send for Fritz/);
      if (open) {
        policy.fritz++;
        return open;
      }
      if (panel.length) {
        policy.fritz++;
        return panel[Math.floor(ctx.pick() * panel.length)];
      }
    }
    return options[Math.floor(ctx.pick() * options.length)];
  },
};
