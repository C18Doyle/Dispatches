// UI-differential config for Dispatches 1914 (see packages/testkit/README.md).
import { JSDOM } from "jsdom";

// [id, text on the menu card, hard mode?]. The BEF, AOK and Ottoman cards are disabled (no content yet).
const CASES = [];
for (const [id, label] of [
  ["ohl", "Oberste"],
  ["gqg", "Grand Quartier"],
  ["stavka", "Stavka"],
])
  for (const hard of [false, true]) CASES.push([id, label, hard]);

export default {
  JSDOM,
  bundle: "dist/bundle.js",
  cases: CASES,
  seeds: [1, 2, 3, 4, 5, 6, 7, 8],
  // "open" runs are the standard game and match the pre-refactor baseline; "hard" runs (menu switch, added in 1.1)
  // were recorded when the switch was added.
  meta: ([id, , hard]) => ({ id: `${id}-${hard ? "hard" : "open"}`, campaignId: id, hard }),
  maxSteps: 400,
  saveCases: CASES, // a saved file for every campaign in both modes (npm run test:saves)
  saveClicks: 8,

  async setup(ctx, [id, label, hard]) {
    if (hard) {
      const sw = ctx.buttons().find((b) => ctx.lab(b) === "Hard mode");
      if (!sw) return "hard mode switch missing";
      await ctx.click(sw);
    }
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
