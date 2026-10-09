// UI-differential config for Dispatches 1940 (see packages/testkit/README.md).
import { JSDOM } from "jsdom";

// [campaign id, card text prefix on the select screen]
const CAMPAIGNS = [
  ["german", "OKW"],
  ["soviet", "STAVKA"],
  ["allied", "SHAEF"],
  ["italy", "COMANDO"],
];
// The three difficulties, by the order of the cases below.
const MODES = ["easy", "open", "hard"];
const CASES = [];
for (const [id, prefix] of CAMPAIGNS) for (const mode of MODES) CASES.push([id, prefix, mode]);
// One run per campaign with "Always let my staff plan battles" switched on, so the staff-plan path (an
// automatic plan and an automatic battle report) is covered by the same recorded playthroughs.
for (const [id, prefix] of CAMPAIGNS) CASES.push([id, prefix, "open", "staff"]);

const SKIP = /^(save|home|back|show|hide|rewind|text size|restart|switch|new campaign|copy|share|download|settings|map|close|pause|resume|skip to|how it works)/i;
const PROCEED = /^(continue|proceed|acknowledge|next|file|report|commit|confirm|begin|start|issue|resolve|reveal|end|enter|deploy|execute|launch|submit|accept|read)/i;

export default {
  JSDOM,
  bundle: "dist/full/bundle.js",
  cases: CASES,
  seeds: [1, 2, 3, 4],
  meta: ([id, , mode, staff]) => ({ id: `${id}-${mode}${staff ? "-staff" : ""}`, campaignId: id, mode }),
  maxSteps: 500,
  // Used only with MASK=1: hides the figures the 2026-10 log-odds fix changed (percentages and the
  // parenthesised counts in "Passed over most often") to prove nothing else differs.
  maskText: (t) => t.replace(/[0-9]+%/g, "N%").replace(/\([0-9]+\)/g, "(N)"),
  stallLimit: 8,

  async setup(ctx, [, prefix, mode, staff]) {
    const lab = ctx.lab;
    // A battle report plays itself line by line on timers and shows nothing to press between lines. The shared
    // settle() returns after 24 ms of unchanged text, which can fall in one of those gaps: on a fast machine one
    // recorded run (italy-open-staff-1) stopped there with "no-button" one time in three, and ran on to the end
    // the other two. Where the page is that report with nothing to press, keep waiting for the next line.
    const baseSettle = ctx.settle;
    const pressable = () => ctx.buttons().some((b) => !SKIP.test(ctx.lab(b)) && !/rewind/i.test(ctx.lab(b)));
    ctx.settle = async () => {
      await baseSettle();
      for (let i = 0; i < 240 && /The Battle Unfolds/.test(ctx.text()) && !pressable(); i++) {
        await new Promise((r) => setTimeout(r, 25));
        await baseSettle();
      }
    };
    if (staff) ctx.w.localStorage.setItem("dispatches1940_staff_plans", "1");
    // Instant text on, so the typewriter cannot race the hash.
    const instant = ctx.buttons().find((b) => lab(b) === "Off" && /instant/i.test(b.parentElement?.parentElement?.textContent || ""));
    if (instant) await ctx.click(instant);
    // Campaign card, then the difficulty screen: its three "Take command" buttons, in the order easy, standard, hard.
    const card = ctx.buttons().find((b) => lab(b).startsWith(prefix));
    if (!card) return "campaign card missing: " + prefix;
    await ctx.click(card);
    // The war room holds the difficulty: Normal is already selected; Easy and Hard are buttons with those names.
    if (mode !== "open") {
      const modeBtn = ctx.buttons().find((b) => lab(b).startsWith(mode === "easy" ? "Easy" : "Hard"));
      if (!modeBtn) return "mode button missing: " + mode;
      await ctx.click(modeBtn);
    }
    const enter = ctx.buttons().find((b) => /^Enter the War Room/i.test(lab(b)));
    if (!enter) return "no war room button; saw " + ctx.buttons().map(lab).join(" | ").slice(0, 160);
    await ctx.click(enter);
    return null;
  },

  isCrashed: (ctx) => /The File Was Damaged/.test(ctx.text()),
  isEnded: (ctx) => /File Closed|Command Terminated|Front Collapsed/.test(ctx.text()),

  choose(ctx, policy) {
    const lab = ctx.lab;
    const t = ctx.text();
    const bs = ctx.buttons().filter((b) => !SKIP.test(lab(b)) && !/rewind/i.test(lab(b)));
    if (/Order of Battle/.test(t) && bs.some((x) => /^Add effort/.test(lab(x)) || /Tactical Approach/.test(t))) {
      // Key Battle (Order of Battle) planning screen. Policy: commit if a commit-like button is live;
      // otherwise choose a tactical approach once, then spend chits at random, then commit.
      const chits = bs.filter((x) => /^Add effort/.test(lab(x)));
      // Commander buttons all say "— favors ..."; the approaches (what chits unlock) do not.
      const others = bs.filter((x) => !/^Add effort|favors|^(✓ )?No particular emphasis|Reconnaissance Pass|^Spread effort|^Clear all effort|^Ask the staff|^Let Your Staff Plan It/.test(lab(x)));
      const commit = others.find((x) => PROCEED.test(lab(x)));
      if (commit) return commit;
      if (!policy.approachChosen && others.length) {
        policy.approachChosen = true;
        return others[Math.floor(ctx.pick() * others.length)];
      }
      if (chits.length) return chits[Math.floor(ctx.pick() * chits.length)];
      return others[0] || bs[0] || null;
    }
    policy.approachChosen = false;
    const choices = bs.filter((x) => lab(x).length >= 45);
    if (choices.length) return choices[Math.floor(ctx.pick() * choices.length)];
    return bs.find((x) => PROCEED.test(lab(x))) || bs[0] || null;
  },
};
