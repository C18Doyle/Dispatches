# The grand Soviet campaign: the consultant's tree for 1942

Status: experimental. Opt in with `?grand=soviet` on the page (or `localStorage.dispatches1940_experimental = "grand-soviet"`). Nothing changes for anyone else, and the four campaigns and their baselines are untouched. The code is `src/parts/46-grand-soviet.jsx`, the graph check is `npm run check-grand-soviet`.

## What the tree is

Six images of a flow chart, December 1941 to February 1943: rectangles are reports (a date and a title), ovals are orders (an adviser and a label, with OTL for "on the real timeline"), a diamond is a "mega battle" and clouds are speculative ends. There are 58 reports and about 130 orders. It replaces the Soviet campaign's 14 or so reports for the same months (`winterGeneral42` to `southernPursuit43`, with `lendLease42`, `kharkov42`, `order227_42`, `rzhevSummer42` and the rest), and rejoins at `kharkov43` (February to March 1943).

## Review

**What works.** The grammar is the game's: one adviser per order, the record marked, an order's label saying what is done. The theatres (Moscow, Demyansk, Lyuban and Leningrad, Crimea, Barvenkovo and Kharkov, the Don and Stalingrad, Rzhev) are the right ones, and the Rzhev, Kharkov and Stalingrad threads are drawn with a real sense of where the record could have gone differently. The terminal clouds are honest about being speculative, and the Army Group Centre cloud is the same fork we discussed earlier (a Vyazma envelopment that works).

**The main structural problem: the January 1942 reports are drawn as siblings, but a player is in one report at a time.** Under Shaposhnikov's "from the Baltic to the Black Sea" order there are seven January reports side by side (Lyuban, Moscow, Kerch and Feodosia, Demyansk, Sevastopol, Barvenkovo, Kursk), each with its own chain through 1942. A tree cannot be played that way: either the player takes one of them and the rest vanish, or the tree has to hold every combination. The build solves it by interleaving: an order says which reports it opens and which it closes, the reports opened and not yet played wait in a queue ordered by date, and the earliest comes next. Zhukov's "Moscow only" order opens only two reports, so that plan plays about 13 reports and the wide plan about 33 (24 to 40). The tree itself is unchanged; it becomes a set of threads.

**Length.** The wide plan is 33 reports for 14 months, where the whole Soviet campaign has 71 for six years. That may be right for a "grand" campaign, but it is a decision. The cheapest way to shorten it is to fold the Crimea thread (6 reports) into two.

**Dead ends and loose ends** (the tree stops; I made a choice, listed below): Sevastopol storm, Demyansk and Kursk have no drawn successor; the Rzhev branch "Wirbelwind" has no successor; "Rostov is ours" and "Winterstorm at the brink" end with orders and no report after them; "Buffel early" and "Smolensk by Christmas?" lead nowhere; the clouds have no way back into the main line. I joined them all to the queue, so each ends at the Soviet campaign's `kharkov43`, and the clouds set a flag (`gsVariant`) for an alternate spine to hang on.

**Orders per report.** Five reports have five orders (Stalingrad approaches, Lyuban Bulge, Stalingrad stands among them). The game keeps to two to four, so five is a strain on the reader; one of Stalingrad approaches is a joke ("RAAAAH", Chuikov) and I have written a plain placeholder.

**Historical checks for the consultant** (names and dates that look wrong, or that I could not confirm):
- Purkayev commanded the Kalinin Front from October 1942, so "Stop and defend" in February 1942 is early for him; Konev held that front until August 1942.
- Chernyakhovsky commanded a tank division and then the 60th Army, not a front, in January 1942.
- "Buffel" was the German withdrawal from Rzhev in February to March 1943; "Buffel early" in October to November 1942 is a stated counterfactual, which is fine if the report says so.
- "Alexander" (Sevastopol northern port) is not a name I can place. "Shcherbakov" at Rzhev in July 1942 is also unclear (there was an Alexander Shcherbakov in the Political Directorate).
- Spellings: Rokossovsky (three ways), Vatutin ("Valutin"), Budyonny, Fedyuninsky, Sychevka, "assessment".
- Where Slavyansk and Balakleya are both named, they are both on the Barvenkovo side, so I moved Malinovsky's order to the Barvenkovo report.

**What is missing.** The Soviet state side (evacuation, industry, Order 227, Lend-Lease, the Special Section) is absent from the tree and is dropped from the grand path; `order227_42` and `lendLease42` are the two worth grafting in at July 1942 and spring 1942. There is no Black Sea fleet or Caucasus defence decision other than the retreat orders, and no Baltic or Finnish front.

## How it is built

- `GS_REPORTS`: each report is `gsR(id, day, date, title, situation, orders)`; an order is `gsO(adviser, label, then, more)` with `otl`, `drop`, `flags` and `rolls` (a dice outcome, used for the Great Battle of Kharkov and Mars) as options.
- `gsAfter` computes the queue and the next report. A report is never played twice, and an order can close another report (`drop`), which is how "Timoshenko: forestall Kharkov" cancels the second battle of Kharkov.
- Texts are all drafts that follow the consultant's labels; the impacts are all zero until the tree is balanced.
- `gsMakeCampaign` wraps the Soviet campaign: the two reports that led to the defence of Moscow now lead to `gsDec41`, and everything else is the Soviet campaign.

## Where I guessed the edges

Zhukov's "Moscow only" opens Rzhev and Vyazma and the crisis report. Sevastopol storm joins the Kerch direction report. Barvenkovo and Kursk both open "Urban crawling", Moscow and Demyansk both open "Overall exhaustion". The three Kharkov reports that carry "Timoshenko" in the second battle open the Great Battle. The Rzhev orders: "Zhukov, continue flanking" opens the Sychevka report, "Surprise them, flank Gzhatsk" opens Buffel early, and the rest go to the God of War. The Stalingrad orders: Vatutin, Moskalenko and Chuikov lead to "Stalingrad stands", Yeremenko and Gordov to "Stalingrad cracks". A short note from the consultant on these would settle them.

## Next

1. The consultant confirms the edges above and the historical checks.
2. Write the prose, a report at a time, starting with the ones every wide path plays (the Moscow and Kharkov reports); balance the impacts with `npm run balance`.
3. Decide the length: wide plan at 33 reports, or fold the Crimea and Lyuban threads.
4. Write the alternate spines the clouds point to (Army Group Centre destroyed, Kharkov like Kursk), using the engine's path-variant flag.
5. Extend the tree past February 1943 (the consultant's next images) in the same form, and move the rejoin point.
