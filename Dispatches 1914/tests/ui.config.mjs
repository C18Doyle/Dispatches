// UI-differential config for Dispatches 1914 (see packages/testkit/README.md).
import { JSDOM } from "jsdom";

// [id, text on the menu card]. The BEF, AOK and Ottoman cards are disabled (no content yet).
const CASES = [
  ["ohl", "Oberste"],
  ["gqg", "Grand Quartier"],
  ["stavka", "Stavka"],
];

export default {
  JSDOM,
  bundle: "dist/bundle.js",
  cases: CASES,
  seeds: [1, 2, 3, 4, 5, 6, 7, 8],
  // The 1914 UI has no hard-mode switch yet, so each campaign is one case.
  meta: ([id]) => ({ id: `${id}-open`, campaignId: id, hard: false }),
  maxSteps: 400,

  async setup(ctx, [id, label]) {
    const card = ctx.buttons().find((b) => ctx.lab(b).includes(label));
    if (!card) return "campaign card missing: " + label;
    await ctx.click(card);
    return null;
  },

  isCrashed: (ctx) => ctx.text().length < 20,

  choose(ctx) {
    const bs = ctx.buttons();
    const orders = bs.filter((x) => x.className === "dg-choice");
    if (orders.length) return orders[Math.floor(ctx.pick() * orders.length)];
    return bs.find((x) => ctx.lab(x) === "Continue") || null;
  },
};
