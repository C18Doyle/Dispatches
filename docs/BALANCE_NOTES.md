# Balance notes for Dispatches 1914

`docs/BALANCE.md` is generated (`node tools/balance.mjs 4000 --write`, after `npm run build`). This page records what the first pass found and what was changed. Thresholds are set from the measured distributions, never from intuition (`Dispatches 1914/CLAUDE.md`).

## What the report measures

For each command, in standard mode and with a seeded generator: how six styles of play end (random; the record, always the historical order; the first order; the last; the order with the best immediate effect on the meters, called greedy; and a gambler who takes a contested order whenever there is one), how often each ending is reached under random play, the rank score of each style, the decisions where one order scores more than 12 points above another, and how often each detour is entered.

## Findings, October 2026 (after the forks and Orders of Battle were added)

1. **Gates.** Eight gates were almost never closed or almost never open. Availability was measured at the node (random play, 6,000 runs), and each threshold was moved to where roughly a third to three quarters of runs can take the order. The historical order is never gated, and `check-historical-ending` and `walk-historical` still pass.

   | order | gate before | open before | gate after | open after |
   |---|---|---|---|---|
   | gqg_1916_04_verdun / shorten | will ≥ 2 | 1% | will ≥ −2 | 37% |
   | gqg_1917_09_malmaison / exploit | munitions ≥ −3 | 4% | munitions ≥ −5 | 46% |
   | gqg_1914_02_marne / continue | manpower ≥ −2 | 96% | manpower ≥ −1 | 75% |
   | stavka_1914_04_lodz / silesia | will ≥ −3 | 97% | will ≥ −1 | 76% |
   | stavka_1915_06_chantilly / decline | munitions ≤ −2 | 99% | munitions ≤ −6 | 62% |
   | stavka_1916_14_romfront / limit | manpower ≤ −2 | 97% | manpower ≤ −5 | 76% |
   | otto_1915_02_gallipoli / forward | manpower ≥ −3 | 97% | manpower ≥ −1 | 76% |
   | otto_1916_01_erzurum / withdraw | will ≥ −4 | 98% | will ≥ −1 | 65% |

2. **The record is the modal path.** Playing the historical order every time reaches the settled ending in 60% (Stavka) to 100% of runs; where a roll can divert it, the historical branch carries the weight. No ending other than the hard-mode ones falls under 2% of random runs except one in the French command (`intact`, 1.9%).

3. **Greedy play is rewarded.** Taking the order with the best immediate effect on the meters scores far higher than the record in the German command (about 82 against 54) and the British (66 against 53), and, in the German command, reaches `negotiated`, an ending the rank counts as better than the record, every time. These orders are mostly the speculative alternatives, so this is the counterfactual payoff, and it is deliberate: the rank rewards leaving the record when it is paid for. It does mean that a player who simply keeps the meters high needs little judgment in those two commands. The way to change it is the rank's parts and the tier of an ending, not the gates.

4. **Dominant orders.** None to three decisions in each command score more than 12 points above their alternative. All are late, gated choices that lead straight to an ending (for example `gqg_1917_08_mutinies` report against discipline); they are meant to be the end of a line of play, and are listed in `BALANCE.md` for review when the endings are next rewritten.

5. **Depth.** The forks added in this pass are entered by about a third of random runs (31% to 39%, one per command), so a detour is part of an ordinary playthrough and not a corner. A random run now meets about 3 to 7 three-way decisions (about one before) and 1 to 4 contested rolls; the record meets 3 to 5 rolls.
6. **The Ottoman command is still the shallowest**: about 13 decisions a run against 20 to 24 elsewhere.

## How to re-run

```bash
cd "Dispatches 1914"
npm run build
node tools/balance.mjs 4000 --write       # about two minutes
```

A change to a gate, an impact or a roll weight should be followed by this, and then by `node check-historical-ending.js` and `node walk-historical.js`.

## Second wave (2026-10-12)
After the preludes, eleven more third orders, three Ottoman reports and four battles (187 nodes, 52 three-way decisions, 46 rolls, 15 battles) the tool reports no dominant decision in Stavka, the Austro-Hungarian command or the Ottoman command, and one each in the German, French and British. Two things to watch: a file that takes the record's order every time reaches the settled ending only 60 per cent of the time in Stavka (its rolls on the record's own orders are many), and the Ottoman command, at 18 decisions, is still the shallowest. Random play enters the Sarikamis detour about a third of the time and no other detour often.
