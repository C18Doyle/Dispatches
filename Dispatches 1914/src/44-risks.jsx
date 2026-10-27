// =============================================================================
// ORDERS THAT CAN FAIL
// =============================================================================
//
// An order that the record did not give was written with one outcome. Most of them are ambitious ones (an attack, a transfer of divisions, a refusal
// of a superior) and an ambitious order can fail, so each order listed here is turned into a contested one when the commands are built: the outcome
// it had becomes the branch that works, and a second branch, written here, is the order failing. The order's own impact stays as the working branch's;
// the failing branch has its own. Its flags and the report it leads to are the order's, so a failure changes the cost and the telling, not the road.
// Every failing branch is speculative and begins "Speculative." The key is "<report>/<order>"; check-risks.js proves each names a real order that was not
// contested already and that the weights, impacts, texts and disputes are sound. A roll must cite the disagreement it represents, so each order also has
// a line in DISPUTES saying which argument in the histories it stands for.
// =============================================================================

const R = (win, winTitle, loseTitle, loseImpact, loseOutcome) => ({ win, winTitle, loseTitle, loseImpact, loseOutcome });

export const RISKS = {
  // German Supreme Army Command
  "ohl_1914_14_timetable/half": R(60, "The trains are turned in good order", "The re-routed trains tangle at the junctions",
    { manpower: -2, munitions: -1, will: -1 },
    "Speculative. Trains already made up for the west are sent east at Cologne and Hanover, and the junctions cannot sort them. Units arrive in the wrong order, guns and their horses on different days, and the right wing is thinner and later than it was meant to be, while the east gets reinforcement it cannot yet use."),
  "ohl_1915_14_gorlice/envelop": R(45, "The wide blow gets through the thin line", "The envelopment stalls in the spring mud",
    { manpower: -3, munitions: -2, will: 0 },
    "Speculative. The army goes out of East Prussia and Courland in the thaw, with roads that have turned to mud and railways that stop at the frontier. The Russians fall back faster than the Germans can follow, the wide blow closes on nothing, and the divisions that were drawn east for it are a long way from where they were needed."),
  "ohl_1916_05_relief/press": R(40, "The winter attacks gain ground", "The winter attacks are broken on a reinforced line",
    { manpower: -3, munitions: -3, will: -1 },
    "Speculative. The attacks go in against a front that has had the whole autumn to dig, and it has been fed more guns than the Germans have shells. They are stopped on the first day and again on the third, and the army's reserve is spent on ground that is of no use to it."),
  "ohl_1917_06_pless/sharpened": R(55, "The wider zone cuts the traffic and Washington does not move", "A neutral ship goes down and the Americans are angered",
    { manpower: 0, munitions: -1, will: -2 },
    "Speculative. Inside the wider zone a ship that is armed, as the Navy was told, is sunk without warning, and a neutral one is sunk with it by mistake. The American press takes it up and the President's note is sharper than any before it. The sharpened war has brought the Americans nearer without giving the Navy the numbers it wanted."),
  "ohl_1918_09_michael/amiens": R(45, "The advance reaches the junction and holds it", "The advance is stopped short of Amiens",
    { manpower: -3, munitions: -3, will: -1 },
    "Speculative. Everything is put into the road to Amiens and diversions are refused, and the army is stopped on the Somme a few kilometres short, with the reserves it had held back already used. The salient it has made is longer than the line behind it can feed, and it is open on both flanks."),
  "ohl_1918_14_blackday/offensive": R(40, "A new blow is ready before the Americans come", "The new blow is found out and met",
    { manpower: -3, munitions: -2, will: -1 },
    "Speculative. Divisions are taken from the quiet sectors to prepare another attack, and the quiet sectors are not quiet for long. French and British patrols find the new troops, the guns are counted from the air, and the attack goes in against an enemy who is waiting for it. The reserve that was meant to be kept for the winter is now in the line, and the army begins the autumn with nothing behind it."),
  "ohl_1918_11_request/openterms": R(55, "The approach is heard and terms are named", "The approach is taken for weakness and the terms harden",
    { manpower: 0, munitions: 0, will: -2 },
    "Speculative. The approach is made, and the Allies read it as the first crack. They do not refuse to talk, but they ask for more than they would have asked of an army that was still fighting, and an offer made from strength has been answered as one made from fear. The terms are the Allies' to set, and the army has nothing to bargain with."),
  "ohl_1918_10_salient/shorten": R(60, "The line is shortened in good order", "The retirement is taken for a defeat at home",
    { manpower: 1, munitions: 0, will: -4 },
    "Speculative. The armies come back to the shorter line, and the retirement is reported in the papers as a defeat. The reserve that was gained is real, but the Chancellor and the Reichstag are told by their own constituents that the front is going back, and the Supreme Command spends its credit at home to explain what it has done on the map."),

  // British Expeditionary Force
  "bef_1914_01_warcouncil/six": R(60, "All six divisions cross and the French are heartened", "The invasion scare is not laid and the army is short at home",
    { manpower: -2, munitions: -1, will: 0 },
    "Speculative. All six divisions go over, and the two held for home defence are missed almost at once. A German raid on the east coast, small and ill-planned, sets off a panic in the Cabinet, and the Prime Minister asks why the whole of the regular army is in France. The Cabinet agrees that the risk was real and was run on purpose, and that nobody had expected it to be tested so soon."),
  "bef_1915_07_reserves/release": R(55, "The reserve goes forward in the first hours", "The reserve is lost in the traffic behind the line",
    { manpower: -3, munitions: -1, will: -1 },
    "Speculative. XI Corps is put close behind the attack and starts forward in the first hours. The roads are choked with the wounded and with ammunition limbers, the corps arrives piecemeal and tired, and it goes into the battle in time to share in its losses and too late to change its course. Haig says the reserve was sent in too late, and French says it was released too soon."),
  "bef_1915_08_evacuate/stay": R(45, "The army is reinforced and holds through the winter", "The reinforced army is cut off by the storm and the guns",
    { manpower: -3, munitions: -2, will: 0 },
    "Speculative. Divisions are sent that were wanted in France, and the beaches are held. The winter storms and the Turkish guns above them make the landing places unreliable, the supply of the army is a matter of luck and of the weather, and the divisions sent are as hard to get out as they were to put in."),
  "bef_1916_11_somme/bitehold": R(60, "Each bite is taken and held", "The bites are taken and cannot be held",
    { manpower: -2, munitions: -2, will: -1 },
    "Speculative. The limited advances are made on the first days and the ground is taken, and the German counter-attacks come at once, in the places the bites have made. The army holds some of what it took and loses the rest, and the cost of each yard is as high as it was before the method was adopted."),
  "bef_1916_12_tanks/tested": R(55, "A dozen tanks show what the machine can do", "The dozen tanks break down and the secret is gone",
    { manpower: 0, munitions: -1, will: -2 },
    "Speculative. A dozen go forward and most of them stop in the first shell holes. The Germans see what they are and a few of them are photographed. The mass attack that was to come as a surprise now comes against an enemy who has had the first look and a winter to think about it."),
  "bef_1917_13_calais/refuse": R(55, "The French give way and coordination is agreed", "The Prime Minister is angered and the French are insulted",
    { manpower: 0, munitions: 0, will: -2 },
    "Speculative. The army will not serve under Nivelle and says so, and the Cabinet is asked to choose between its general and its ally. The Prime Minister, who had promised the French, takes it badly, and the French staff has a grievance that it will bring up every time the armies have to work together."),
  "bef_1917_15_ypres3/limited": R(60, "The plateau is taken and the attack stops", "The limit is passed and the attack goes on",
    { manpower: -3, munitions: -2, will: -1 },
    "Speculative. The attack takes the plateau, and the first success is so near that the army cannot bring itself to stop. A second step is ordered, then a third, and the limit that Haig accepted in writing is passed one local order at a time. The Cabinet learns from the newspapers that the limit has gone, and the Prime Minister is told that the army has not exceeded its orders."),
  "bef_1917_16_plateau/cambrai": R(55, "The tanks and guns come south unseen", "The Cambrai plan is seen from the air and the surprise is lost",
    { manpower: -1, munitions: -2, will: -1 },
    "Speculative. The Flanders offensive is closed and the army moves its tanks and guns south by night. The move is seen, and the Germans reinforce the sector in the last days. The attack that was meant to open the line is a hard fight from the first hour. The tanks are used in the sector that was chosen for them, and the army learns what surprise is worth when it is gone."),
  "bef_1918_16_manpower/oise": R(60, "The French take the rest when the reinforcements arrive", "The line is held thin and the French complain",
    { manpower: -2, munitions: 0, will: -2 },
    "Speculative. The British take over as far as the Oise and no farther. The sector they hold is thin and the sector next to it, which the French promised to hold, is thinner. The French say they were promised more, and the British say they were promised reinforcements, and neither is wrong. The two commanders-in-chief exchange letters on the boundary, and the letters are read later by those who study the spring."),

  // French Grand Quartier General
  "gqg_1914_01_frontieres/week": R(60, "The week shows where the Germans are", "The week is lost and the Germans move first",
    { manpower: 0, munitions: 0, will: -3 },
    "Speculative. The attack is held for a week and the aeroplanes go up, and the reports they bring are partial and contradictory. The staff cannot decide what they mean, and the Germans, who have not waited, are across the Meuse before the French have chosen what to do about them. The week is not recovered, and the army goes into the first battles with its plan unchanged and its information no better than before it waited."),
  "gqg_1914_12_retreat/stand": R(40, "The stand holds on the Sambre and the Meuse", "The stand is outflanked and the armies are cut",
    { manpower: -3, munitions: -2, will: -1 },
    "Speculative. The armies fight where they stand, and the Germans who come round their open flank do so in better order than the French can turn to meet them. The line is broken in two places, and the retreat that was refused is made in a worse state than it would have been. The commanders who ordered the stand are blamed for it, and the commanders who would have ordered the retreat are not asked their opinion."),
  "gqg_1914_02_marne/continue": R(45, "The army is rested and strikes a week later", "The withdrawal goes on and the Germans reach Paris",
    { manpower: -2, munitions: -1, will: -4 },
    "Speculative. The withdrawal goes on past the Marne and the gap the Germans have left in their line closes. The army is not rested, only farther back, and the German advance, which was coming apart, is given another week to put itself right before the armies meet again. The government, which had been told that the army was being preserved, is told within the week that Paris will have to be defended."),
  "gqg_1917_09_malmaison/exploit": R(40, "The objective is taken and the advance goes on", "The advance goes past the guns and is stopped",
    { manpower: -3, munitions: -2, will: -3 },
    "Speculative. The attack takes its objective and goes beyond it, and the guns that made the first success cannot move forward in time. The infantry are on open ground and under the German guns, and the losses of the second day are heavier than those of the first. The army is told that the first day was the success and the second day the mistake."),
  "gqg_1918_12_link/allin": R(55, "The reserve goes north and the junction holds", "The reserve is committed and the French front is open",
    { manpower: -3, munitions: -1, will: -1 },
    "Speculative. Every division that can be moved goes north, and the junction with the British holds for the moment. The German offensive then strikes the part of the French line that has been stripped to feed it, and there is no reserve left to meet it. The Chief of the General Staff reports to the Premier that the junction was held at a price that nobody had asked the country whether it could pay."),
  "gqg_1918_13_aisne/depth": R(60, "The front is thinned and the depth holds", "The commanders ignore the order and the line is packed",
    { manpower: -2, munitions: 0, will: -2 },
    "Speculative. The order for defence in depth is given, and the Sixth Army's commander finds reasons to put his divisions forward as he always has. The Germans' first bombardment falls on a line that is full of men, and the army that was to be spared is destroyed in the first hours. The commander is relieved, and the order that he ignored is quoted in the inquiry as the one thing that was done correctly."),
  "gqg_1918_11_counteroffensive/hold": R(55, "The reserve is held and the offensives run out", "The reserve is held too long and the Marne is crossed",
    { manpower: -2, munitions: -1, will: -2 },
    "Speculative. The reserve is kept in hand and the offensives are allowed to exhaust themselves, and the Germans are given the time to cross the Marne in strength. When the reserve is used it is used to close a gap, not to open a counter-stroke, and the initiative stays on the other side. The delay is explained as prudence, and the staff that urged it is not asked why the Marne had to be crossed first."),
  "gqg_1916_06_nivelle/petain": R(55, "Petain's doctrine is applied a year early", "The army is cautious and the Germans are not",
    { manpower: -1, munitions: -1, will: -2 },
    "Speculative. Limited objectives become the rule, and the army learns them, but the Germans have had a year to learn the defence in depth that they are about to use. Each attack takes its objective and no more, and the government, which had hoped for a victory, asks what the limited method will win. The Chamber that had hoped for a victory in the spring asks for the old plan, and the new doctrine has to be defended against its own critics."),

  // Austro-Hungarian Army High Command
  "aok_1914_01_serbia/galicia": R(55, "The swing force reaches Galicia in time", "The swing force arrives in pieces and too late",
    { manpower: -2, munitions: -1, will: -1 },
    "Speculative. The force is sent north at once, and the railways that were timed for the Balkans cannot be turned in a week. The divisions arrive in the wrong order and in different days, and the armies they were to strengthen fight the first battles with the old numbers. The staff in Vienna blames the railways, the railwaymen blame the staff, and the first battles in Galicia are fought without the help."),
  "aok_1914_03_galicia/cover": R(55, "The flank is covered and the blow goes north", "The covering force is too weak and the flank is turned",
    { manpower: -2, munitions: 0, will: -1 },
    "Speculative. The Third Army is held at the San to cover the flank, and the Russians attack where the covering force is thinnest. The blow in the north goes on regardless, and the armies there learn in the second week what has happened behind them. The commander of the Third Army says that he was left with too little, and the others say that he was left with enough."),
  "aok_1915_07_przemysl/third": R(40, "The third relief reaches the fortress", "The third relief is lost in the passes",
    { manpower: -3, munitions: -1, will: -1 },
    "Speculative. The attack goes through the passes at the end of the winter with what the second left of the army, and it is stopped by snow and by an enemy who has had time to prepare. The fortress falls on the same day as it did, and the army that tried to save it is smaller by a corps."),
  "aok_1915_06_isonzo/attack": R(40, "The blow across the frontier gets ahead of the Italians", "The Italians are ready and the blow is met on the heights",
    { manpower: -4, munitions: -2, will: -1 },
    "Speculative. A strong force is sent south and attacks in the first weeks, and the Italians are less ready than they will be but readier than the staff had said. The heights above the Isonzo are held, the force is bled on them, and the divisions that were sent are away from Galicia when the Russians come."),
  "aok_1916_08_brusilov/continue": R(40, "The Trentino attack goes on and Galicia is held", "Galicia is not held and the Trentino attack is stopped",
    { manpower: -4, munitions: -2, will: -1 },
    "Speculative. The offensive in the south is kept up and the Germans are asked to hold the east, and they do what they can with what they have. It is not enough. The Russians go on, and the Trentino attack, which has used itself up, is stopped on the plateau at the moment the east most needs the divisions."),
  "aok_1916_08_brusilov/split": R(55, "Half the divisions reach Galicia in time", "The divisions are split and neither half is enough",
    { manpower: -3, munitions: -1, will: 0 },
    "Speculative. Half the divisions go back to Galicia by rail, and the half in the Tyrol is too small to hold what it has taken. The half in Galicia arrives after the front has broken. Both halves are used and neither makes enough difference. The army in the Tyrol is told to hold and the army in Galicia to retreat, and each is told it by a different headquarters."),
  "aok_1918_14_ukraine/partial": R(60, "Two divisions bring the grain", "The two divisions are swallowed in the countryside",
    { manpower: -1, munitions: 0, will: -1 },
    "Speculative. Two divisions go east to the railway towns where the grain is loaded, and the countryside round them has its own ideas about who has the grain. The divisions are scattered in small garrisons and ambushed on the roads, and what they send home is a fraction of what was promised. The grain that is sent home is counted at the Ministry of Food and found to be a fraction of what was promised to the cities."),
  "aok_1914_05_kolubara/limited": R(55, "Potiorek reaches the Kolubara and halts", "Potiorek goes past the Kolubara and is checked",
    { manpower: -2, munitions: -1, will: -1 },
    "Speculative. Potiorek is told to advance to the Kolubara and stop, and the temptation to go on is too strong for a general who has been waiting for this. He goes on, the Serbs counter-attack on the winter ground, and the army that was to hold a limit finds that it has lost the limit and the ground together."),

  // Russian Stavka
  "stavka_1914_03_przemysl/storm": R(45, "The assault takes the fortress before the Austrians return", "The assault fails on the wire and the guns",
    { manpower: -3, munitions: -1, will: -1 },
    "Speculative. The assault goes in before the heavy guns are up, against forts that are better than the staff supposed. It is broken on the wire in the first days, and the army that was to have taken the fortress is held round it for the winter, as it was, with fewer men. The assault is repeated once and not a third time, and the fortress is left to starve in its own time."),
  "stavka_1914_04_lodz/silesia": R(40, "The Fifth Army crosses the frontier", "The Second Army is cut off at Lodz",
    { manpower: -3, munitions: -1, will: 0 },
    "Speculative. The Fifth Army goes into Silesia and the Second is left at Lodz to meet the Ninth German Army with what it has. The Germans come between the two, the Second is surrounded for some days, and the army that was to have entered Silesia has to turn back to get it out. The Fifth Army comes back to the Vistula with its strength intact, and the Second comes out with the loss of its baggage and many of its guns."),
  "stavka_1916_05_brusilov/support": R(50, "The other fronts attack and the Austrians are pulled apart", "The other fronts attack badly and the gain is lost",
    { manpower: -4, munitions: -3, will: 0 },
    "Speculative. The other fronts are made to attack and they do, with the guns they have and the shells that were meant for something else. The attacks are broken one after another against the Germans, and the supporting armies lose more men than Brusilov's army gains. Brusilov is told that the other fronts have done what they could, and his own army is left to hold what it won."),
  "stavka_1916_12_kovel/lemberg": R(55, "The weight shifts south and Lemberg is threatened", "The weight arrives late and the Germans are ready",
    { manpower: 0, munitions: -1, will: -1 },
    "Speculative. The weight of the front shifts south toward Lemberg and Halicz, and the move takes weeks that the Germans use. When the attack goes in, the enemy has brought up reserves to meet it, and the front that was winning has been weakened to feed one that is not. The Guards are moved south and arrive in the rain, and the front that they left is the weaker for their going."),
  "stavka_1916_13_romania/army": R(45, "A Russian army reaches Romania in time", "The army is too late and the Romanians are already beaten",
    { manpower: -3, munitions: -2, will: 0 },
    "Speculative. A Russian army is sent in the first weeks and shortens the line in Galicia to find the men. It reaches the Carpathians by single track and arrives in time to share the retreat, and the line it left behind in Galicia is a little thinner. The Romanian government asks what the army was for, and the Russian answer is that it did what it was able to do."),

  // Ottoman General Staff
  "otto_1915_01_suez/raid": R(50, "The raiding column crosses Sinai and fires on the canal", "The raiding column is lost in Sinai",
    { manpower: -1, munitions: -1, will: -1 },
    "Speculative. The column sets out across the desert and finds the wells that were marked are dry or held. It reaches the canal with men half-dead of thirst, fires a few rounds, and is driven off by the first British patrol. The raid that was to alarm the British has taught them nothing they did not know."),
  "otto_1915_03_kut/storm": R(45, "The assault takes Kut before the relief arrives", "The assault is thrown back and the siege goes on",
    { manpower: -3, munitions: -3, will: 0 },
    "Speculative. The Sixth Army attacks the town in strength and the garrison, which is hungry but not beaten, throws the first assaults back. The losses are heavy and the army that was to take the town in a week is held round it for the months it would have taken to starve it out. Khalil is thanked by the staff for his energy, and the German advisers say privately that it was spent on the wrong day."),
  "otto_1917_01_yildirim/both": R(50, "Both halves are in time", "The army group is divided and neither half is strong",
    { manpower: -2, munitions: -2, will: -1 },
    "Speculative. The army group is divided between Palestine and the Euphrates, and the German officers who came to command it find themselves in charge of two small forces that cannot support each other. Neither is strong enough to do what the whole was meant to do. Falkenhayn says that the divided command was the Ottoman staff's choice, and Enver says that it was Falkenhayn's, and both are partly right."),
};

/** The disagreement each contested order stands for: an order is made to fail only where the histories of the war argue about whether it could have worked. */
const DISPUTES = {
  "ohl_1914_14_timetable/half": "Historians dispute whether the western deployment could have been varied in the first days of August 1914 without ruining it, or whether the railway timetable allowed no change at all.",
  "ohl_1915_14_gorlice/envelop": "Hindenburg and Ludendorff argued for a wide envelopment out of the north and Falkenhayn for a breakthrough at Gorlice, and historians still argue whether the wider plan could have worked with the railways available.",
  "ohl_1916_05_relief/press": "Whether a winter offensive in the west in 1916 and 1917 could have gained anything, or would only have spent the reserves that the army needed, is argued in the histories of the Supreme Command.",
  "ohl_1917_06_pless/sharpened": "Historians differ on whether a middle course between prize rules and unrestricted warfare was ever available, or whether it would have produced the very incidents that brought America in.",
  "ohl_1918_09_michael/amiens": "Whether Ludendorff was wrong to widen the offensive of March 1918 and not drive at Amiens is one of the standing arguments about the offensive.",
  "ohl_1918_14_blackday/offensive": "Historians disagree on whether the German army in August 1918 had the strength for another offensive, or was already too weak to attempt one.",
  "ohl_1918_11_request/openterms": "It is argued whether an approach for terms before the autumn of 1918 would have found the Allies willing to treat, or whether they would have asked more of an army that had not been beaten in the field.",
  "ohl_1918_10_salient/shorten": "Historians differ on whether a voluntary withdrawal from the salients in July 1918 would have saved the reserve, or only shown the army and the country that the offensives had failed.",
  "bef_1914_01_warcouncil/six": "Whether the Cabinet's decision to keep two divisions at home in August 1914 was prudence or timidity is still argued, and so is how much difference two more divisions would have made.",
  "bef_1915_07_reserves/release": "The place of the reserve at Loos is a famous dispute: Haig and French blamed each other, and historians differ on whether closer reserves would have changed the battle.",
  "bef_1915_08_evacuate/stay": "Whether the army could have been supplied and reinforced through a winter at Gallipoli, and what the campaign could then have gained, is argued in every account of the evacuation.",
  "bef_1916_11_somme/bitehold": "Historians differ on whether Rawlinson's method of bite and hold could have been applied in full on the Somme, given the guns and the shells then available.",
  "bef_1916_12_tanks/tested": "It is argued whether using a few tanks in September 1916 gave away a surprise that Haig could have kept for a larger attack, or taught lessons that were worth the loss.",
  "bef_1917_13_calais/refuse": "Historians differ on whether Haig and Lloyd George were right to resist Nivelle's command in February 1917, and on how far the arrangement could have worked.",
  "bef_1917_15_ypres3/limited": "Whether the Cabinet could have held Haig to a limited attack on the Gheluvelt plateau, and whether he would have stopped, is argued in the accounts of the summer of 1917.",
  "bef_1917_16_plateau/cambrai": "Historians differ on whether a surprise attack with massed tanks could have been prepared in secret in the autumn of 1917, and on what it could have won.",
  "bef_1918_16_manpower/oise": "The extension of the British line in early 1918 was disputed between the two commanders-in-chief, and accounts differ on how far it weakened the Fifth Army.",
  "gqg_1914_01_frontieres/week": "Historians argue whether a week's delay for reconnaissance in August 1914 would have shown the French staff the weight of the German right, or whether the Germans would have been across the Meuse before the reports came in.",
  "gqg_1914_12_retreat/stand": "It is argued whether the French armies could have held on the Sambre and the Meuse in August 1914, or whether the retreat saved them.",
  "gqg_1914_02_marne/continue": "Whether the French armies could have turned in September 1914 or needed more time, and whether the German advance would have stalled anyway, is discussed in every account of the Marne.",
  "gqg_1916_06_nivelle/petain": "Historians differ on whether the doctrine of limited objectives could have been adopted a year before it was, and on whether the German defence would have beaten it.",
  "gqg_1917_09_malmaison/exploit": "Petain insisted on limited objectives at Malmaison, and historians differ on whether an exploitation beyond them could have succeeded or would have repeated the failures of the Chemin des Dames.",
  "gqg_1918_12_link/allin": "The decision of March 1918 about how many French divisions to send north to the British is disputed, and so is whether the junction could have been held at a higher cost.",
  "gqg_1918_13_aisne/depth": "Whether defence in depth, if enforced on the Sixth Army, would have saved the Chemin des Dames in May 1918 is argued, and so is how far its commander could have been made to apply it.",
  "gqg_1918_11_counteroffensive/hold": "Historians disagree about whether Foch's counterattack of July 1918 was made at the right time, and whether waiting for the Americans would have cost or saved lives.",
  "stavka_1914_03_przemysl/storm": "It is argued whether the Russian army could have taken Przemysl by assault in the autumn of 1914, or whether the fortress was too strong without heavy guns.",
  "stavka_1914_04_lodz/silesia": "Historians differ on whether the Russian offensive into Silesia in the autumn of 1914 could have succeeded, and on whether the army at Lodz could have been held.",
  "stavka_1916_05_brusilov/support": "Whether the other Russian fronts could have supported Brusilov's offensive in the summer of 1916 with the guns and the shells they had is argued in the accounts of that summer.",
  "stavka_1916_12_kovel/lemberg": "The decision to go on at Kovel in July 1916 and not toward Lemberg is argued, and so is whether the Guards could have done better elsewhere.",
  "stavka_1916_13_romania/army": "Whether a Russian army could have reached Romania in time in 1916, over the railways that existed, is disputed.",
  "aok_1914_01_serbia/galicia": "Conrad's plan sent the swing force to Serbia first, and historians differ on whether sending it to Galicia from the start was possible within the railway plan.",
  "aok_1914_03_galicia/cover": "Whether the Third Army could have covered the flank while the blow went north is argued, and so is how thin it would have been.",
  "aok_1915_07_przemysl/third": "A third relief of Przemysl in the winter of 1914 to 1915 is held by some historians to have had no chance and by others to have had a slight one.",
  "aok_1915_06_isonzo/attack": "Historians differ on whether Austria-Hungary could have attacked Italy in the first weeks of the war, and on what it could have won.",
  "aok_1916_08_brusilov/continue": "Whether the Trentino offensive of 1916 could have been kept up while the Russians attacked in Galicia is disputed.",
  "aok_1916_08_brusilov/split": "Historians differ on whether splitting the divisions between the Tyrol and Galicia would have helped either front.",
  "aok_1918_14_ukraine/partial": "How much grain the monarchy could have had from Ukraine in 1918 with a small force is disputed, and so is whether any force could have taken more.",
  "aok_1914_05_kolubara/limited": "Whether Potiorek could have been held to a limited advance to the Kolubara in the autumn of 1914 is argued, and so is what that would have changed.",
  "otto_1915_01_suez/raid": "Whether a small raid on the Suez Canal in 1915 could have done more than alarm the British is argued.",
  "otto_1915_03_kut/storm": "Historians differ on whether the Sixth Army could have taken Kut by assault, or whether the siege was the better course.",
  "otto_1917_01_yildirim/both": "Whether the Yildirim army group could have been divided between Palestine and Mesopotamia without being too weak for either is disputed.",
};

/**
 * Make each listed order contested. Called once when the commands are built: the order's outcome becomes the branch that works (weight win) and the
 * failing branch is added with the rest of its weight. An order that is already contested or has no outcome is left as it is (check-risks.js fails).
 */
function applyRisks() {
  for (const [key, r] of Object.entries(RISKS)) {
    const [nodeId, choiceId] = key.split("/");
    const campaignId = nodeId.split("_")[0];
    const node = CAMPAIGNS[campaignId] && CAMPAIGNS[campaignId].nodes[nodeId];
    const choice = node && (node.choices || []).find((c) => c.id === choiceId);
    if (!choice || (choice.uncertain && choice.uncertain.length) || !choice.outcome) continue;
    choice.uncertain = [
      { weight: r.win, title: r.winTitle, impact: choice.impact, outcome: choice.outcome },
      { weight: 100 - r.win, title: r.loseTitle, impact: r.loseImpact, outcome: r.loseOutcome },
    ];
    delete choice.outcome;
    if (!choice.dispute) choice.dispute = DISPUTES[key];
  }
}
applyRisks();
