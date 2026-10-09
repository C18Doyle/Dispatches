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
7. Look at the three readings under each meter, Matériel's among them (Fuel & Oil, Arms & Ammunition, Shipping & Rail). Did they mean anything to you? Did the three bars stay the same size as the figures changed?
8. Open the War Record and its Battle Record.
9. Part way through a battle press "Save and leave the field", close the page, come back and resume. Was it clear where you were and what had been kept? Did the planning screen or the report come back as you left it?
10. Read the advice on the choice buttons ("Halder argues: ..."). Did it read as people arguing, and did the six real quotations, which are in speech marks, feel different from the rest?
11. Open the three meters on the decision page (the buttons beside them). After a decision, did the green and red arrows tell you what you had done? Take one meter well below zero and say whether it felt dangerous, and whether the "Strain" note on a contested decision made sense.
12. Start a battle with "Start battle" and watch it run. Was the pace right? Did the decision stop it where you expected, and did the decisive hour and the counterattack tell you enough to choose?
13. At the end read the command rank and the reasons under it. Did it feel fair? Open "The decisions, in order". Press "Copy After-Action Summary" and paste it into a comment on the game's page, with whatever you want to say.
14. Soviet command: play the first year (June 1941 to May 1942) for the new decisions (the mechanized corps, Yelnya, the January 1942 general offensive, the Barvenkovo salient). To reach the speculative path, commit the Siberian divisions at Moscow, then in January 1942 choose "Concentrate everything on the Western axis" (it is unavailable if the December blow spent the reserve) and "Send the cavalry and the airborne corps ahead". If the ring closes at Vyazma there is no Rzhev summer offensive and Smolensk can be retaken before the thaw. Were the odds on the page honest about what you had banked earlier, and did the earlier choices feel as if they had mattered?
15. Italian command, co-belligerent path (follow the King south): play from Salerno to the end. Did the six new decisions (Monte Lungo, Ancona and Filottrano, the Combat Groups, the partisans' winter, who commands the Groups, the last offensive) read as the army's own war, and was it clear what each roll depended on? Note how early the manpower meter reaches its floor on this path, and whether the "owed" debts and the strain note were fair.
16. Allied command: play 1941 (February to December) for the new decisions. At "Tripoli or Athens" the two roads lead to different nodes: Greece (then the Thermopylae line and Crete) or the push for Tripoli, which can clear Libya and skips the Tobruk offensive. Did the Far East choice (Force Z) and the tanks for Moscow feel as if they mattered when Crusader and the Pacific bill arrived?
17. The five newest battles: Monte Lungo and Brody are the first choice of their reports (Monte Lungo on the Italian co-belligerent path, Brody in the first week of the Soviet war), Filottrano and the Senio are the "lead" choices on the same Italian path, and Vyazma is reached by concentrating on the Western axis in January 1942. Fight each once by hand and once with the staff. Did the order-of-battle sheets match what you know of the history? Did the field decision read as a real choice of that day, and did the result shift the odds you saw on the report before? At Monte Lungo and Brody the likelier outcome is the one history gave: was it clear that a good plan could earn the other?
18. The Eastern Front map: open the Theater Map at a few reports of the Soviet and German campaigns (June 1941, October 1941, September 1942, July 1943, June 1944) and read it against what you know. Is each front contested or held on the right date? Is a place on the wrong side of a zone line (the lines are coarse: 38°E, 46°E, 46.3°N)? On the concentrated path of the Soviet first year, did Smolensk in April 1942 and the second break in the centre show on the map?
19. The six newest battles: Kiev (German, at "Moscow or Kiev"), the Ardennes (German, December 1944), Kursk, the Stalingrad city fight and Seelow (Soviet), and Kharkov, which is a new report on the German path where Sixth Army was lost (take "Resupply by air; hold in place" at the pocket). Play each once by hand and once with your staff planning it. Did the arms and the enemy setups read as that battle? Was the field decision a real choice? Do the commanders' notes agree with what you know of them?
20. The new Soviet reports of 1944 and 1945: from the Dnieper the path now runs through Leningrad, Korsun and the Crimea before Bagration, then Romania, and later Budapest, Lake Balaton and Prague. Play from the autumn of 1943 to the end. Is any date, number or name wrong? Does each modeled alternative say plainly that it is one? Is the path too long, and is there a report you would cut?

## What the After-Action Summary contains
Plain lines: the command and difficulty, the rank, the ending and its tier, the standing at the end, how the decisions compared with the historical ones, then one line per battle (its result, the enemy setup, the commander, the field decisions, and whether you or the staff planned it), the contested outcomes, the advisers you heeded most and the objectives.

It carries nothing personal, and the enemy setups and decisions let a run be reconstructed and replayed.

## What to look for
- A choice whose consequence was not what its label suggested.
- A date, name, place or number that looks wrong (the battle or ending named in the summary tells us where to look).
- A battle that felt unfair, or one where nothing you did seemed to matter. Say which.
- An arm whose order-of-battle sheet contradicted what you know of the history.
- A screen where the text was too long for a phone, or a button you could not tell was disabled and why.
- Anything a screen reader read badly. Each new screen puts focus on its heading, the battle report is announced line by line, and focus moves to a decision when one comes up.
- A quotation or an adviser's position you know to be wrong. Five of the six quotations are logged as secondary (see `claims/quotations.json`) and want their primary source opened.

## Before trusting the results
Five or six testers is enough to find the big problems and too few to find the balance ones. Balance is measured by simulation
(`check-battle-balance` prints the average bonus a careless plan, the staff's plan and a player who reads the enemy each reach),
not by playtest.
