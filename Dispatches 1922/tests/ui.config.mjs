// UI-differential config for Dispatches 1922 (see packages/testkit/README.md).
import { JSDOM } from "jsdom";

// [campaign id, label on the records list, hard mode?]
const CASES = [];
for (const [id, label] of [
  ["provisionalGov17", "The Provisional Government"],
  ["southRussia", "Armed Forces of South Russia"],
  ["siberia", "Provisional All-Russian Government"],
  ["bolsheviks", "Revolutionary Military Council of the Republic"],
])
  for (const mode of [false, true, "easy"]) CASES.push([id, label, mode]);

export default {
  JSDOM,
  bundle: "dist/bundle.js",
  cases: CASES,
  seeds: [1, 2, 3, 4, 5, 6],
  meta: ([id, , mode]) => ({ id: `${id}-${mode === "easy" ? "easy" : mode ? "hard" : "open"}`, campaignId: id, hard: mode === true }),
  maxSteps: 400,

  async setup(ctx, [, label, mode]) {
    const lab = ctx.lab;
    // Settings: instant text on (so the typewriter cannot race the hash), then back.
    const settings = ctx.findText("SETTINGS");
    if (!settings) return "no settings entry on the records screen";
    await ctx.click(settings);
    const instant = ctx.buttons().find((b) => /INSTANT/i.test(b.parentElement?.parentElement?.textContent || "") && lab(b) === "OFF");
    if (!instant) return "no instant-text toggle";
    await ctx.click(instant);
    await ctx.click(ctx.buttons().find((b) => /^Close and go back$/.test(lab(b))));
    // Open the campaign, pick the mode, enter command.
    await ctx.click(ctx.findText(label));
    const modeBtn = ctx.buttons().find((b) => (mode === "easy" ? /^EASY: /.test(lab(b)) : mode ? /^✕ .*MODE$/.test(lab(b)) : lab(b) === "OPEN COMMAND"));
    if (!modeBtn) return "mode button missing";
    await ctx.click(modeBtn);
    const enter = ctx.buttons().find((b) => /^ENTER COMMAND/.test(lab(b)));
    if (!enter) return "no ENTER COMMAND";
    await ctx.click(enter);
    return null;
  },

  isCrashed: (ctx) => ctx.text().length < 20,

  choose(ctx) {
    const lab = ctx.lab;
    const bs = ctx.buttons();
    // Easy mode: now and then take the last order back, so the rewind is part of the recorded behaviour.
    const back = bs.find((x) => lab(x) === "TAKE BACK THIS ORDER");
    if (back && (ctx.rewinds || 0) < 2 && ctx.pick() < 0.35) {
      ctx.rewinds = (ctx.rewinds || 0) + 1;
      return back;
    }
    const orders = bs.filter((b) => lab(b) === "ISSUE THE ORDER");
    if (orders.length) {
      // In hard mode, usually pick a capital-spending order (its card says "COSTS 1") so the capital
      // counter and the collapse ending get exercised.
      const hard = ctx.runCase[2] === true;
      const capital = hard ? orders.filter((x) => /COSTS 1/.test(x.parentElement?.textContent || "")) : [];
      const pool = capital.length && ctx.pick() < 0.75 ? capital : orders;
      return pool[Math.floor(ctx.pick() * pool.length)];
    }
    return bs.find((x) => lab(x) === "CONTINUE") || bs.find((x) => /^(CONTINUE|PROCEED|NEXT|ACKNOWLEDGE|RETURN)/i.test(lab(x))) || null;
  },
};
