// UI-differential config for Dispatches 1914 (see packages/testkit/README.md).
import { JSDOM } from "jsdom";

// [id, text on the menu card, hard mode?].
const CASES = [];
for (const [id, label] of [
  ["ohl", "Oberste"],
  ["gqg", "Grand Quartier"],
  ["stavka", "Stavka"],
  ["bef", "British Expeditionary"],
  ["aok", "Armeeoberkommando"],
  ["otto", "Ottoman General Staff"],
])
  for (const hard of [false, true]) CASES.push([id, label, hard]);
// The easy mode (1.3.0), one run per campaign and seed. Kept apart from CASES so the saved-file cases stay as they were.
const EASY_CASES = CASES.filter(([, , hard]) => !hard).map(([id, label]) => [id, label, "easy"]);

export default {
  JSDOM,
  bundle: "dist/bundle.js",
  cases: [...CASES, ...EASY_CASES],
  seeds: [1, 2, 3, 4, 5, 6, 7, 8],
  // "open" runs are the standard game and match the pre-refactor baseline; "hard" runs (menu switch, added in 1.1)
  // were recorded when the switch was added.
  meta: ([id, , hard]) => ({ id: `${id}-${hard === "easy" ? "easy" : hard ? "hard" : "open"}`, campaignId: id, hard }),
  maxSteps: 400,
  saveCases: CASES, // a saved file for every campaign in both modes (npm run test:saves)
  saveClicks: 8,

  async setup(ctx, [id, label, hard]) {
    if (hard) {
      const sw = ctx.buttons().find((b) => ctx.lab(b) === (hard === "easy" ? "Easy mode" : "Hard mode"));
      if (!sw) return "mode switch missing";
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
    // The Order of Battle screen: let the staff plan it, then issue the plan.
    const staff = bs.find((x) => ctx.lab(x) === "Let the staff plan it");
    if (staff) {
      const issue = bs.find((x) => ctx.lab(x).startsWith("Issue the plan"));
      return issue && !issue.disabled ? issue : staff;
    }
    const orders = bs.filter((x) => x.className === "dg-choice");
    if (orders.length) return orders[Math.floor(ctx.pick() * orders.length)];
    return bs.find((x) => ctx.lab(x) === "Continue") || null;
  },
};
