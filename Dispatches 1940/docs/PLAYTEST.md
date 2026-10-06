# Playtesting Dispatches 1940

**Status, stated plainly: no human playtest of the Order of Battle changes, the adviser lines, the save-in-battle or the outcome feedback has been run.** Everything below is how to run
one. What has been done instead is automated: 64 seeded playthroughs replay identically (`npm run verify:baseline`; sixteen
of them run with the staff planning every battle), every battle is checked for balance against every enemy setup, every
Matériel strand reading and every field decision (`npm run check-battle-balance`), and every node and ending is reachable
(`npm run check:orphans`). None of that says whether the game is clear, fair or worth playing.

## What to ask a tester to do
1. Play one command to an ending on a phone, in standard mode, without help. Note where you stopped reading.
2. Meet your first Order of Battle. Did the "How an Order of Battle works" guide help? Could you tell what to do next?
3. In one battle, open the order-of-battle sheet under an arm, spend an Initiative on the Reconnaissance Pass, the Map Exercise or
   the Staff Assessment, and say which of the three told you most.
4. Make the field decision in the middle of a battle. Did the options read as real alternatives of that day?
5. In another battle press "Let Your Staff Plan It". Was it clear what you had given up?
6. Play a command in its hard mode (Führer, NKVD, Coalition or Axis). Were the orders from above clear, and did they feel fair?
7. Look at the four readings under Matériel (Fuel & Oil, Ammunition, Armour & Steel, Shipping & Rail). Did they mean anything to you?
8. Open the War Record and its Battle Record.
9. Part way through a battle press "Save and leave the field", close the page, come back and resume. Was it clear where you were and what had been kept? Did the planning screen or the report come back as you left it?
10. Read the advice on the choice buttons ("Halder argues: ..."). Did it read as people arguing, and did the six real quotations, which are in speech marks, feel different from the rest?
11. After a decision look at "Where you stand now": did the bars moving, and a Matériel reading changing band, tell you what you had done? Try it once with the Sound setting on and say whether the battle sounds helped or grated.
12. At the end open "A note for the author" and paste the line into a comment on the game's page, with whatever you want to say.

## What the note contains
`Dispatches 1940 | <command> | <mode> | ending <title> | decisions <n> | manpower m, materiel m, initiative m | battles <battle>:<grade>:<enemy setup(s)>:<commander>:<field decision(s)>:<own or staff> ; ...`

Each battle is one entry: its id, the grade (clean, costly, marginal or total), the enemy setup or setups met, the commander named,
the field decision taken, and whether you planned it yourself or the staff did. It carries nothing personal, and the
mix of enemy setups and decisions lets a run be reconstructed and replayed.

## What to look for
- A choice whose consequence was not what its label suggested.
- A date, name, place or number that looks wrong (the battle's id in the note tells us where to look).
- A battle that felt unfair, or one where nothing you did seemed to matter. Say which.
- An arm whose order-of-battle sheet contradicted what you know of the history.
- A screen where the text was too long for a phone, or a button you could not tell was disabled and why.
- Anything a screen reader read badly. Each new screen puts focus on its heading, the battle report is announced line by line, and focus moves to a decision when one comes up.
- A quotation or an adviser's position you know to be wrong. Five of the six quotations are logged as secondary (see `claims/quotations.json`) and want their primary source opened.

## Before trusting the results
Five or six testers is enough to find the big problems and too few to find the balance ones. Balance is measured by simulation
(`check-battle-balance` prints the average bonus a careless plan, the staff's plan and a player who reads the enemy each reach),
not by playtest.
