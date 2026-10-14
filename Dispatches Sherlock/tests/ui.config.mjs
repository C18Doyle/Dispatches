// UI-differential config for Dispatches: Sherlock (see packages/testkit/README.md).
// Plays seeded random runs through dist/bundle.js in jsdom, on every difficulty, using the screens a player uses: the menu, the journal
// prologue, the difficulty card, the scenes (an option is armed by one tap and confirmed by a second), the gambit, the outcome, the
// newspaper interludes, the Baker Street panel (advice, favour, overheard talk, Watson's notebook) and the endings.
import { JSDOM } from "jsdom";

// the difficulty card shows the names from flavor.json
const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const CARD = { Easy: /^Watson's Account$/, Medium: /^The Consulting Detective$/, Hard: /^The Empty Purse$/ };

export default {
  JSDOM,
  bundle: "dist/bundle.js",
  cases: DIFFICULTIES.map((d) => [d]),
  seeds: [1, 2, 3, 4, 5, 6, 7, 8],
  meta: ([d]) => ({ id: `sherlock-${d.toLowerCase()}`, campaignId: "sherlock", mode: d.toLowerCase() }),
  maxSteps: 160,
  stallLimit: 10,

  async setup(ctx, [difficulty]) {
    // The gambit holds on a timed suspense screen with a phrase that changes every 380 ms; the shared settle() can return in a gap, so
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
    return (await press(/^Begin the Case/)) || (await press(/^Continue$/)) || (await press(CARD[difficulty])) || (await press(/^Enter$/));
  },

  isCrashed: (ctx) => ctx.text().length < 20,
  isEnded: (ctx) => /Open a New Case/.test(ctx.text()),

  choose(ctx, policy) {
    const t = ctx.text();
    const bs = ctx.buttons().filter((b) => !/^Settings$/i.test(ctx.lab(b)));
    const by = (re) => bs.find((b) => re.test(ctx.lab(b)));
    if (/A Gambit/.test(t)) return by(/^Play the Gambit/) || null;
    if (by(/^Turn the Page/)) return by(/^Turn the Page/);
    const options = bs.filter((b) => b.classList.contains("group"));
    if (!options.length) return by(/^Continue/) || by(/^Enter/) || null;

    // an option that was armed by the last tap is confirmed
    const armed = options.find((b) => /Tap again to confirm/.test(b.textContent));
    if (armed) return armed;

    // Baker Street: at most two calls on it per scene, so a run cannot loop in its panel
    const scene = t.slice(0, 160);
    if (policy.scene !== scene) {
      policy.scene = scene;
      policy.house = 0;
    }
    const boost = bs.filter((b) => /^Boost /.test(ctx.lab(b)));
    if (boost.length) return boost[Math.floor(ctx.pick() * boost.length)];
    if (policy.house < 2 && ctx.pick() < 0.35) {
      const panel = bs.filter((b) => /^(Ask Watson's Advice|Mycroft's Favour|Overheard|Watson's Notebook)/.test(ctx.lab(b)));
      const open = by(/^Baker Street$/);
      if (panel.length) {
        policy.house++;
        return panel[Math.floor(ctx.pick() * panel.length)];
      }
      if (open) {
        policy.house++;
        return open;
      }
    }
    return options[Math.floor(ctx.pick() * options.length)];
  },
};
