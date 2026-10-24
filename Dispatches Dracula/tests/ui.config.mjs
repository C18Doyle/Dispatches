// UI-differential config for Dispatches: Dracula (see packages/testkit/README.md).
// Plays seeded random runs through dist/bundle.js in jsdom, on every difficulty, using the screens a player uses: the menu, the prologue,
// the difficulty card, the scenes (an option is armed by one tap and confirmed by a second), the venture, the outcome, the newspaper
// interludes, the adviser's panel (advice, remedy, table talk, his reading) and the endings.
// The labels come from the seat's own ui.json and flavor.json, so the same driver plays the hidden seat: `SEAT=mina BUNDLE=dist/mina/bundle.js` (scripts/check_seat.mjs).
import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";

const SEAT = process.env.SEAT ?? "dracula";
const read = (f) => JSON.parse(readFileSync(`src/content/${SEAT}/${f}`, "utf8"));
const ui = read("ui.json");
const flavor = read("flavor.json");
const exact = (s) => new RegExp("^" + s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$");
const starts = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// the difficulty card shows the names from flavor.json
const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const CARD = { Easy: exact(flavor.difficultyInfo.EASY.label), Medium: exact(flavor.difficultyInfo.MEDIUM.label), Hard: exact(flavor.difficultyInfo.HARD.label) };
const BEGIN = new RegExp("^" + starts(ui.beginLabel));
const ENDED = new RegExp(starts(ui.endText.newRun));
const PANEL = new RegExp("^(" + [ui.adviser.askLabel, ui.adviser.remedyLabel, ui.adviser.talkLabel, ui.adviser.readLabel].map(starts).join("|") + ")");
const OPEN = new RegExp("^" + starts(ui.adviser.openLabel));

export default {
  JSDOM,
  bundle: SEAT === "dracula" ? "dist/bundle.js" : `dist/${SEAT}/bundle.js`,
  cases: DIFFICULTIES.map((d) => [d]),
  seeds: [1, 2, 3, 4, 5, 6, 7, 8],
  meta: ([d]) => ({ id: `${SEAT}-${d.toLowerCase()}`, campaignId: SEAT, mode: d.toLowerCase() }),
  maxSteps: 160,
  stallLimit: 10,

  async setup(ctx, [difficulty]) {
    // The venture holds on a timed suspense screen with a phrase that changes every 380 ms; the shared settle() can return in a gap, so
    // wait it out.
    const baseSettle = ctx.settle;
    ctx.settle = async () => {
      await baseSettle();
      for (let i = 0; i < 400 && /Waiting…/.test(ctx.text()); i++) {
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
    return (await press(BEGIN)) || (await press(/^Continue$/)) || (await press(CARD[difficulty])) || (await press(/^Enter$/));
  },

  isCrashed: (ctx) => ctx.text().length < 20,
  isEnded: (ctx) => ENDED.test(ctx.text()),

  choose(ctx, policy) {
    const t = ctx.text();
    const bs = ctx.buttons().filter((b) => !/^Settings$/i.test(ctx.lab(b)));
    const by = (re) => bs.find((b) => re.test(ctx.lab(b)));
    if (/A Venture/.test(t)) return by(/^Take the Chance/) || null;
    if (by(/^Turn the Page/)) return by(/^Turn the Page/);
    const options = bs.filter((b) => b.classList.contains("group"));
    if (!options.length) return by(/^Continue/) || by(/^Enter/) || null;

    // an option that was armed by the last tap is confirmed
    const armed = options.find((b) => /Tap again to confirm/.test(b.textContent));
    if (armed) return armed;

    // the adviser: at most two calls on him per scene, so a run cannot loop in his panel
    const scene = t.slice(0, 160);
    if (policy.scene !== scene) {
      policy.scene = scene;
      policy.prof = 0;
    }
    const boost = bs.filter((b) => /^Boost /.test(ctx.lab(b)));
    if (boost.length) return boost[Math.floor(ctx.pick() * boost.length)];
    if (policy.prof < 2 && ctx.pick() < 0.35) {
      const panel = bs.filter((b) => PANEL.test(ctx.lab(b)));
      const open = by(OPEN);
      if (open) {
        policy.prof++;
        return open;
      }
      if (panel.length) {
        policy.prof++;
        return panel[Math.floor(ctx.pick() * panel.length)];
      }
    }
    return options[Math.floor(ctx.pick() * options.length)];
  },
};
