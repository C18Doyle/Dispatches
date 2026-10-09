// UI-differential config for Dispatches 1941 (see packages/testkit/README.md).
import { JSDOM } from "jsdom";

// [campaign id, text in the card's aria-label, mode]
const CASES = [];
for (const [id, card, modes] of [
  ["japan", "Imperial General Headquarters", ["open", "easy", "fanatical"]],
  ["alliedPacific", "Allied Pacific Command", ["open", "easy", "coalition"]],
])
  for (const mode of modes) CASES.push([id, card, mode]);
// One run per campaign with "Always let my staff plan battles" switched on, so the staff-plan path (an automatic plan and an
// automatic battle report) is covered by the same recorded playthroughs.
CASES.push(["japan", "Imperial General Headquarters", "open", "staff"], ["alliedPacific", "Allied Pacific Command", "open", "staff"]);

const SKIP = /^(\W?show|\W?hide|easy:|normal:|hard:|save|home|dossiers|records|settings|rewind|sound|menu|text size|reduced|instant|share|download|how it works|pause)/i;
const PROCEED = /^(proceed|continue|acknowledge|file|issue|begin|enter|next|open|sign|accept|brief|read|resume|commit|confirm|start|resolve|reveal|deploy|execute|launch|submit|see the full)/i;

export default {
  JSDOM,
  bundle: "dist/full/bundle.js",
  assetRoot: ".", // the app fetches assets/maps/pacific-regions.json at runtime
  cases: CASES,
  seeds: [1, 2, 3, 4, 5, 6],
  meta: ([id, , mode, staff]) => ({ id: `${id}-${mode}${staff ? "-staff" : ""}`, campaignId: id, mode }),
  maxSteps: 400,
  stallLimit: 8,

  async setup(ctx, [, card, mode, staff]) {
    const lab = ctx.lab;
    // A battle report plays itself line by line on timers and shows nothing to press between lines. The shared settle() returns after
    // 24 ms of unchanged text, which can fall in one of those gaps; where the page is that report with nothing to press, keep waiting.
    const baseSettle = ctx.settle;
    const pressable = () => ctx.buttons().some((b) => !SKIP.test(ctx.lab(b)) && !/rewind/i.test(ctx.lab(b)));
    ctx.settle = async () => {
      await baseSettle();
      for (let i = 0; i < 240 && /The Battle Unfolds/.test(ctx.text()) && !pressable(); i++) {
        await new Promise((r) => setTimeout(r, 25));
        await baseSettle();
      }
    };
    if (staff) ctx.w.localStorage.setItem("dispatches1941_staff_plans", "1");
    const vis = () => ctx.buttons("button,[role=tab]");
    // Settings tab: instant text on, so the typewriter cannot race the hash.
    const settings = vis().find((b) => /^settings$/i.test(lab(b)));
    if (!settings) return "no settings tab";
    await ctx.click(settings);
    const instant = vis().find((b) => /instant text: off/i.test(lab(b)));
    if (!instant) return "no instant-text toggle";
    await ctx.click(instant);
    // Expand the campaign card, take command, then pick the difficulty in the war room.
    const cardBtn = vis().find((b) => lab(b).includes(card) && /expand/i.test(lab(b)));
    if (!cardBtn) return "campaign card missing: " + card;
    await ctx.click(cardBtn);
    const takeBtn = vis().find((b) => /^take command/i.test(lab(b)));
    if (!takeBtn) return "take-command button missing";
    await ctx.click(takeBtn);
    // The difficulty is chosen in the war room; Normal is the default.
    if (mode !== "open") {
      const re = mode === "easy" ? /^easy:/i : /^hard:/i;
      const modeBtn = vis().find((b) => re.test(lab(b)));
      if (!modeBtn) return "difficulty button missing: " + mode;
      await ctx.click(modeBtn);
    }
    return null;
  },

  isCrashed: (ctx) => /File Was Damaged/.test(ctx.text()),
  isEnded: (ctx) => /File Closed/i.test(ctx.text()),

  choose(ctx, policy) {
    const lab = ctx.lab;
    const t = ctx.text();
    const bs = ctx.buttons("button,[role=tab]").filter((b) => !SKIP.test(lab(b)) && !/rewind|expand|collapse/i.test(lab(b)));
    if (/Order of Battle/.test(t) && bs.some((x) => /^Add effort/.test(lab(x)) || /Tactical Approach/.test(t))) {
      // The Order of Battle planning screen. Policy: commit if a commit-like button is live; otherwise choose a tactical approach once,
      // then spend effort at random, then commit.
      const chits = bs.filter((x) => /^Add effort/.test(lab(x)));
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
    const choices = bs.filter((b) => lab(b).length >= 45);
    if (choices.length) return choices[Math.floor(ctx.pick() * choices.length)];
    return bs.find((x) => PROCEED.test(lab(x))) || bs[0] || null;
  },
};
