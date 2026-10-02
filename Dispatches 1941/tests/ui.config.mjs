// UI-differential config for Dispatches 1941 (see packages/testkit/README.md).
import { JSDOM } from "jsdom";

// [campaign id, text in the card's aria-label, mode]
const CASES = [];
for (const [id, card, modes] of [
  ["japan", "Imperial General Headquarters", ["open", "fanatical"]],
  ["alliedPacific", "Allied Pacific Command", ["open", "coalition"]],
])
  for (const mode of modes) CASES.push([id, card, mode]);

const SKIP = /^(save|home|dossiers|records|settings|rewind|sound|menu|text size|reduced|instant|share|download)/i;
const PROCEED = /^(proceed|continue|acknowledge|file|issue|begin|enter|next|open|sign|accept|brief|read|resume)/i;

export default {
  JSDOM,
  bundle: "dist/full/bundle.js",
  assetRoot: ".", // the app fetches assets/maps/pacific-regions.json at runtime
  cases: CASES,
  seeds: [1, 2, 3, 4, 5, 6],
  meta: ([id, , mode]) => ({ id: `${id}-${mode}`, campaignId: id, mode }),
  maxSteps: 300,

  async setup(ctx, [, card, mode]) {
    const lab = ctx.lab;
    const vis = () => ctx.buttons("button,[role=tab]");
    // Settings tab: instant text on, so the typewriter cannot race the hash.
    const settings = vis().find((b) => /^settings$/i.test(lab(b)));
    if (!settings) return "no settings tab";
    await ctx.click(settings);
    const instant = vis().find((b) => /instant text: off/i.test(lab(b)));
    if (!instant) return "no instant-text toggle";
    await ctx.click(instant);
    // Expand the campaign card, then pick the mode button.
    const cardBtn = vis().find((b) => lab(b).includes(card) && /expand/i.test(lab(b)));
    if (!cardBtn) return "campaign card missing: " + card;
    await ctx.click(cardBtn);
    const re = mode === "fanatical" ? /fanatical/i : mode === "coalition" ? /coalition/i : /^open command/i;
    const modeBtn = vis().find((b) => re.test(lab(b)));
    if (!modeBtn) return "mode button missing: " + mode;
    await ctx.click(modeBtn);
    return null;
  },

  isCrashed: (ctx) => /File Was Damaged/.test(ctx.text()),
  isEnded: (ctx) => /File Closed/i.test(ctx.text()),

  choose(ctx) {
    const lab = ctx.lab;
    const bs = ctx.buttons("button,[role=tab]").filter((b) => !SKIP.test(lab(b)) && !/rewind|expand|collapse/i.test(lab(b)));
    const choices = bs.filter((b) => lab(b).length >= 45);
    if (choices.length) return choices[Math.floor(ctx.pick() * choices.length)];
    return bs.find((x) => PROCEED.test(lab(x))) || bs[0] || null;
  },
};
