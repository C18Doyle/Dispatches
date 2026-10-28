// =============================================================================
// MORE ENDINGS
// =============================================================================
//
// Endings that a file earns by the combination of departures from the record it carries to the last reports, four more for each command. Each is
// an ordinary ending (a node with an epilogue that says what actually happened, a badge, a family, a rank tier and a ground rating) and is reached by
// a rule: at the named orders of the last reports, once the command's own routes to an ending have had their say, the flags the file carries are read,
// and the first rule that holds sends the file to its ending. A rule needs at least one flag that the record does not set, so a file that gives the
// record's orders never meets one. Every ending is speculative, and its epilogue ends with what actually happened. `at` is a list of "<report>/<order>".
// =============================================================================

const MORE = (campaign, id, o) => ({ id: `${campaign}_end_${id}`, campaign, badge: "SPECULATIVE", ...o });

export const MORE_ENDINGS = [
  // ---- the German Supreme Army Command ----
  MORE("ohl", "civilgov", {
    title: "A Government That Governs", year: 1918, date: "1918-11-11", city: "Spa", advisors: ["hindenburg"],
    family: "civil-government-survives", tier: 3, ground: 2,
    at: ["ohl_1918_15_wilson/accept", "ohl_1918_15_wilson/order"],
    when: (m, f) => f.ohl_chancellor === "kept",
    situation:
      "The Chancellor was not removed in July, and the Reichstag's resolution was not buried. When the notes come from Washington it is the government that answers them, and the Supreme Command has learned since the summer that it is told what it may do. The army asks for nothing in its own name.\n\nThe ministers who sign are the ministers who have governed since 1917. They can say to a Reichstag that has been consulted what the army can and cannot do.",
    epilogue:
      "Speculative. The request goes forward from a Chancellor who still governs, and the later claim that civilians betrayed the army has less to feed on.\n\nWhat actually happened: Bethmann Hollweg was forced out in July 1917, in the crisis over the Reichstag's peace resolution, at the insistence of the Supreme Command, and the governments that followed were weaker. Prince Max of Baden became Chancellor on 3 October 1918 and the request to President Wilson went out in the first days of that month. The armistice was signed on 11 November, and within a year the account of an army betrayed at home was in print.",
  }),
  MORE("ohl", "mediation", {
    title: "A Neutral in the Chair", year: 1918, date: "1918-09-30", city: "Spa", advisors: ["hindenburg"],
    family: "mediated-peace", tier: 3, ground: 3,
    at: ["ohl_1918_11_request/openterms"],
    when: (m, f) => f.ohl_usw === "restricted" || f.ohl_usw === "sharpened",
    situation:
      "The Americans never came to the war, and the President is still a neutral with opinions about the peace. The approach from Spa goes to Washington not as a request to an enemy but as a proposal to a mediator who has been offering himself for two years.\n\nThe terms he would put forward are not those that an enemy in the field would offer, and he has no army on the Marne to say otherwise. The Allies have to decide whether to take his terms or go on.",
    epilogue:
      "Speculative. No American army is in France, and what Wilson can offer depends on whether the Allies listen to a neutral.\n\nWhat actually happened: the United States declared war on Germany on 6 April 1917, after the resumption of unrestricted submarine warfare, and American divisions were in the line in France in the spring of 1918. The German request of October 1918 went to the President as the leader of an enemy, who answered it three times and set conditions that included the end of the monarchy's power and terms that left Germany unable to renew the war. The Germans' note of early October 1918 asked for an armistice and for peace on the basis of the Fourteen Points that Wilson had set out in January.",
  }),
  MORE("ohl", "viennafirst", {
    title: "Vienna Goes First", year: 1918, date: "1918-10-28", city: "Spa", advisors: ["hindenburg"],
    family: "ally-collapses-first", tier: 1, ground: 1,
    at: ["ohl_1918_11_request/military", "ohl_1918_11_request/fight", "ohl_1918_11_request/openterms"],
    when: (m, f) => f.ohl_serbia === "declined" && f.ohl_caporetto === "refused",
    situation:
      "No German army went to Serbia and none went to the Isonzo. The monarchy has been left to its own resources, and its resources are gone. Austria-Hungary asks for terms on its own account before Germany has decided what to ask for, and the army in the west finds the southern frontier of the Reich open behind it.\n\nThe Supreme Command is told by its ally, and not by its enemy, that the war is over for one of the two.",
    epilogue:
      "Speculative. Austria-Hungary breaks first, and the Supreme Command has less time to decide what to ask for.\n\nWhat actually happened: Austria-Hungary asked for an armistice at the end of October 1918, after the Italian victory at Vittorio Veneto, and it was signed at the Villa Giusti on 3 November, to take effect the next day. The monarchy dissolved into its successor states in the following weeks, and Germany signed its own armistice a week after the Austrian one.\n\nIn the real days that followed, the German staff did look at the open southern frontier, and Bavarian officers feared an Allied advance from Austria.",
  }),
  MORE("ohl", "easternpeace", {
    title: "A Hard Peace Both Ways", year: 1918, date: "1918-11-11", city: "Spa", advisors: ["hindenburg"],
    family: "eastern-gains-kept", tier: 2, ground: 3,
    at: ["ohl_1918_15_wilson/accept", "ohl_1918_15_wilson/order"],
    when: (m, f) => f.ohl_brest === "maximal" && f.ohl_faust === "advanced" && f.ohl_michael === "amiensfirst",
    situation:
      "The treaty with Russia was taken to its widest, the advance went on to Kiev, and the divisions that hold the east have been kept there. In the west the army has come nearer to Amiens than it ever did.\n\nThe armistice is asked for from a map that shows the German army farther from home than in any week of the war. It is the last time that it will.",
    epilogue:
      "Speculative. The armistice is requested while German troops stand deep in Russia and close to Amiens, and the Allies decide what that is worth.\n\nWhat actually happened: Brest-Litovsk was signed on 3 March 1918, the German advance in the east took Kiev on 2 March, and the spring offensive in the west took ground and was stopped short of Amiens. The armistice of 11 November annulled the treaty and called for the withdrawal of German troops from the former Russian territories when the Allies judged the moment suitable. Dozens of German divisions stayed in the east in the spring of 1918, to hold Ukraine and the Baltic provinces.",
  }),

  // ---- the French Grand Quartier General ----
  MORE("gqg", "pursuit", {
    title: "The Pursuit to the Rhine", year: 1918, date: "1918-11-11", city: "Compiègne", advisors: ["petain", "foch"],
    family: "pursuit-to-the-rhine", tier: 3, ground: 3,
    at: ["gqg_1918_16_senlis/bridgeheads", "gqg_1918_16_senlis/moderate"],
    when: (m, f) => f.gqg_malmaison === "exploited" && f.gqg_americans === "army",
    situation:
      "The army exploited the success at Malmaison in 1917 and learned from it that an attack can go on when the guns can follow. In the autumn of 1918 the lesson is applied on a larger scale: the offensives do not stop at the first objective, and the Germans are not given the weeks they need to build another line.\n\nThe terms are asked for with French divisions already in the Palatinate.",
    epilogue:
      "Speculative. French divisions reach the German frontier before the armistice, and the terms asked for reflect where they stand.\n\nWhat actually happened: the attack at La Malmaison on 23 October 1917 took its objective and stopped, as it was designed to. The armistice of 11 November 1918 was signed with French troops still on the Belgian and French side of the frontier, and the occupation of the left bank of the Rhine began in December.\n\nThe same lesson was written into the French army's regulations in the last year of the war, and the attacks of the autumn were planned as a series that could be carried on from one objective to the next.",
  }),
  MORE("gqg", "mutinyspreads", {
    title: "The Refusals Do Not End", year: 1918, date: "1918-09-30", city: "Paris", advisors: ["petain"],
    family: "mutinies-widen", tier: 0, ground: 1,
    at: ["gqg_1918_16_senlis/bridgeheads", "gqg_1918_16_senlis/moderate"],
    when: (m, f) => f.gqg_mutinyResponse === "discipline" && f.gqg_chemin === "continued",
    situation:
      "Discipline came before the grievances, and the leave that was promised and the rest that was owed were not given. The refusals of 1917 went quiet and did not end. In September 1918, with the Germans in retreat, whole regiments decline to go forward at the second attack of the month.\n\nThe terms are asked for by a government that is no longer sure of its own army.",
    epilogue:
      "Speculative. The refusals of 1917 return in the autumn of 1918, and whole regiments decline the second attack of September.\n\nWhat actually happened: the refusals of May and June 1917 spread through a large part of the French army. About 3,400 men were tried, 554 were condemned to death and between 26 and 49, by different counts, were shot, and Pétain's remedies were regular leave, better rest and the end of the great offensives. The army that fought in 1918 was held together by the same remedies.\n\nPétain's handling of the refusals is counted among the things that held the army to the end, and the court-martial figures were kept from the public for years.",
  }),
  MORE("gqg", "generals", {
    title: "A Command That Was Never Changed", year: 1918, date: "1918-11-11", city: "Chantilly", advisors: ["foch"],
    family: "command-never-reformed", tier: 1, ground: 2,
    at: ["gqg_1918_16_senlis/bridgeheads", "gqg_1918_16_senlis/moderate"],
    when: (m, f) => f.gqg_sack === "kept" && f.gqg_retreat === "stand",
    situation:
      "The commanders who failed in August 1914 were kept, and the stand on the Sambre was tried. The army learned from its own losses and not from the changing of its generals, and it learned late. The war is won in the end, but the command that wins it is the command that lost the first battles.\n\nThe armistice finds the army victorious and the staff unreformed.",
    epilogue:
      "Speculative. The generals of 1914 stay in post, and the army learns more slowly and at a higher cost in men.\n\nWhat actually happened: Joffre relieved many generals in August and September 1914, among them the commander of the Fifth Army, Lanrezac, whom he replaced on 3 September, and the practice of dismissing unsuccessful commanders went on through the war. The armistice was signed on 11 November 1918.\n\nThe practice had its critics from the first, who said that it made commanders afraid to report bad news, and its defenders, who said that an army cannot keep generals who lose battles.",
  }),
  MORE("gqg", "waiting", {
    title: "Waiting Until Spring", year: 1918, date: "1918-11-11", city: "Chantilly", advisors: ["petain", "foch"],
    family: "allied-offensive-1919", tier: 2, ground: 2,
    at: ["gqg_1918_16_senlis/bridgeheads", "gqg_1918_16_senlis/moderate"],
    when: (m, f) => f.gqg_americans === "split" && f.gqg_grand === "limited",
    situation:
      "The American divisions were put into the French and British armies, and the autumn attacks went on one front at a time, each on its own date. The line has moved a long way and has not broken, and nobody on the Allied side believes that the war will be over before the winter.\n\nThe terms are discussed at Senlis by commanders who each have a plan for 1919, and the terms asked for are those of armies that expect to be stronger in the spring.",
    epilogue:
      "Speculative. The Allied armies attack one front at a time, and the staffs begin to plan for 1919.\n\nWhat actually happened: the American First Army was formed on 10 August 1918, Pershing having refused to have his divisions distributed among the Allied armies, and Foch's general offensive of 26 September attacked along the whole front from the Meuse to the sea. The German army was driven back through October, and the plans for a campaign in 1919 had been prepared and were not needed.\n\nThe Allied staffs had agreed in the summer that the armies would be stronger in 1919 and that the decisive effort would be made then, and the German collapse came a year earlier than any of them had planned.",
  }),

  // ---- the Russian Stavka ----
  MORE("stavka", "unspent", {
    title: "An Army That Was Not Asked to Die", year: 1918, date: "1918-03-03", city: "Mogilev", advisors: [],
    family: "army-not-spent", tier: 2, ground: 2,
    at: ["stavka_1917_14_armistice/refuse", "stavka_1917_14_armistice/obey"],
    when: (m, f) => f.stavka_kerensky === "refused" && f.stavka_deathpenalty === "refused",
    situation:
      "The offensive of the summer was not made, and the death penalty at the front was not restored. The army has not been bled in Galicia and has not been shot back into the line, and when the new government's order to open talks comes it finds the army tired, hungry and still an army.\n\nIt is not enough to change the order. It changes what the order costs the men who carry it out.",
    epilogue:
      "Speculative. The summer offensive is never made and the death penalty is not restored, so the army enters the winter intact but tired.\n\nWhat actually happened: the Russian offensive of the summer of 1917 gained a little ground in Galicia and was thrown back by a German counter-stroke in July, and the army's discipline broke in the retreat. The death penalty was restored at the front on 12 July. The armistice was signed at Brest-Litovsk in December and the treaty on 3 March 1918.\n\nThe Provisional Government's offensive was the last of the old army's operations and the first in which the committees voted whether to obey.",
  }),
  MORE("stavka", "rigaheld", {
    title: "Riga Holds", year: 1918, date: "1918-03-03", city: "Mogilev", advisors: [],
    family: "riga-held", tier: 2, ground: 2,
    at: ["stavka_1917_14_armistice/refuse", "stavka_1917_14_armistice/obey"],
    when: (m, f) => f.stavka_riga === "held" && f.stavka_october === "standdown",
    situation:
      "The Twelfth Army was ordered to hold Riga and held it, for longer than anyone had thought it could, and the line of the Daugava is still Russian when the new government is declared. The German divisions that would have gone on to the gates of Petrograd have been kept at the river.\n\nWhat the army holds is a line that the government in Petrograd will soon decide not to need.",
    epilogue:
      "Speculative. Riga holds through the autumn, and the line of the Daugava is still Russian when the new government declares itself.\n\nWhat actually happened: the Germans took Riga in September 1917 in an operation that crossed the Daugava with a short, heavy bombardment, and the Twelfth Army fell back. The German advance was resumed in February 1918 and the treaty was signed at Brest-Litovsk on 3 March, which gave up the Baltic provinces.\n\nThe fall of Riga in September 1917 was a military defeat that the Russian staff described at the time as a withdrawal, and it was followed by the German landing on the islands of the Gulf of Riga in October.",
  }),
  MORE("stavka", "grandduke", {
    title: "The Grand Duke's Army", year: 1917, date: "1917-11-20", city: "Mogilev", advisors: [],
    family: "army-under-the-grand-duke", tier: 1, ground: 1,
    at: ["stavka_1917_08_october/resist"],
    when: (m, f) => f.stavka_command === "grandduke",
    situation:
      "The Grand Duke was not removed from the supreme command, and the Emperor stayed in Petrograd. When the new authority was declared in October the headquarters at Mogilev did not recognise it, and there was a commander at its head with a name that some of the army would follow.\n\nIt is a smaller following than he needs and a larger one than the Bolsheviks like, and the army divides along the line of whom its men will obey.",
    epilogue:
      "Speculative. The Grand Duke commands at Mogilev when the Bolsheviks take power, and part of the army follows him and part does not.\n\nWhat actually happened: Nicholas II took the supreme command himself on 5 September 1915, sending the Grand Duke to the Caucasus, and the Grand Duke was never recalled. After the October rising the headquarters at Mogilev was occupied by Bolshevik forces on 3 December 1917, and General Dukhonin, the Chief of Staff, was killed by soldiers on the same day.\n\nThe Grand Duke was in the Caucasus until the monarchy fell in March 1917, and he was relieved by the Provisional Government in the spring of 1917.",
  }),
  MORE("stavka", "winners", {
    title: "At the Table in 1918", year: 1918, date: "1918-03-03", city: "Mogilev", advisors: [],
    family: "russia-among-the-victors", tier: 3, ground: 3,
    at: ["stavka_1917_14_armistice/refuse", "stavka_1917_14_armistice/obey"],
    when: (m, f) => f.stavka_petrograd === "promised" && f.stavka_brusilov === "supported" && f.stavka_romania === "army",
    situation:
      "The offensives of 1916 were supported and not left to one front, an army was sent to Romania in time to matter, and the promise to the Allied missions in 1917 was kept with something to show for it. Russia comes to the end of 1917 tired and short of everything, and still in the war.\n\nThe order in November is an order to sign nothing.",
    epilogue:
      "Speculative. Russia stays in the war through 1917 with an army in the field, and the revolution comes to it there.\n\nWhat actually happened: Brusilov's offensive of June 1916 was made without any serious support from the other fronts, Romania entered the war on 27 August 1916 and Bucharest fell on 6 December, and the Allied conference at Petrograd in January and February 1917 ended without a Russian date. The armistice was signed in December 1917 and the treaty at Brest-Litovsk on 3 March 1918.\n\nThe Allies did not count Russia among the powers at the peace table in 1919, and the Allied intervention in the Russian civil war was fought on Russian soil by Allied troops and White armies.",
  }),

  // ---- the British Expeditionary Force ----
  MORE("bef", "surprise", {
    title: "The Spring That Came Early", year: 1918, date: "1918-11-11", city: "London", advisors: ["wilson"],
    family: "tanks-in-mass", tier: 3, ground: 3,
    at: ["bef_1918_21_armistice/moderate", "bef_1918_21_armistice/hard"],
    when: (m, f) => f.bef_tanks === "held" && f.bef_ypres3 === "vetoed",
    situation:
      "The tanks were held back in 1916 and the offensive in Flanders was vetoed in 1917, and the army that comes to the spring of 1918 has a great many of the first and has not been spent on the second. The attack at Cambrai in November 1917 is the first of many, and it is made with more than anyone had planned.\n\nThe army ends the war with its method intact and with fewer dead behind it.",
    epilogue:
      "Speculative. The tanks are kept back until they can be used in mass, and the attack at Cambrai is made on a larger scale than it was.\n\nWhat actually happened: tanks were first used on 15 September 1916 at Flers-Courcelette, in small numbers. The attack at Cambrai on 20 November 1917 used some 400 tanks on firm ground and made a deep advance on the first day. The Flanders offensive of 1917 ran from 31 July to 10 November and ended at Passchendaele.\n\nThe battle of Cambrai was a success on the first day and a disappointment by the tenth, when the Germans counter-attacked and retook much of the ground.",
  }),
  MORE("bef", "wheat", {
    title: "Wheat Before Guns", year: 1918, date: "1918-03-15", city: "London", advisors: ["lloydgeorge"],
    family: "shipping-and-manpower-crisis", tier: 1, ground: 1, first: true,
    at: ["bef_1918_21_armistice/moderate", "bef_1918_21_armistice/hard"],
    when: (m, f) => f.bef_convoy === "delayed" && f.bef_conscription === "voluntary" && m.will > -6,
    situation:
      "The convoy came late and the voluntary system was kept, and by the spring of 1918 the country is short both of ships and of men. The army in France is told to expect fewer drafts, and the Ministry of Food is told to expect fewer cargoes.\n\nThe armistice is asked for by a government that has counted the loaves and the battalions and found that neither is enough.",
    epilogue:
      "Speculative. Ships and recruits are both short in the spring of 1918, and the government cannot supply the army and the cities in full.\n\nWhat actually happened: the first convoy sailed from Gibraltar on 10 May 1917 and losses fell through the summer. The Military Service Act of January 1916 introduced conscription for single men, and a second Act in May extended it to married men. Food rationing came in 1918, without starvation.\n\nThe Admiralty adopted the convoy against its own judgment and under pressure from the Prime Minister, and the figures for May and June 1917 showed that it worked.",
  }),
  MORE("bef", "calaisrow", {
    title: "Two Armies and Two Commanders", year: 1918, date: "1918-11-11", city: "London", advisors: ["haig", "lloydgeorge"],
    family: "separate-commands", tier: 1, ground: 2,
    at: ["bef_1918_21_armistice/moderate", "bef_1918_21_armistice/hard"],
    when: (m, f) => f.bef_calais === "refused" && f.bef_doullens === "national",
    situation:
      "The British army would not serve under Nivelle in 1917 and would not serve under Foch in 1918, and the two commanders-in-chief coordinate by agreement and by telegram. The war is won, and it is not won by a single plan.\n\nThe armistice is signed by the army that won it, in two halves.",
    epilogue:
      "Speculative. The British and French armies are never put under one command, and each crisis is settled by letters between the two headquarters.\n\nWhat actually happened: at the Calais conference in February 1917 the British accepted Nivelle's direction for the spring offensive, and the arrangement was dropped after its failure. At Doullens on 26 March 1918 Foch was given the coordination of the Allied armies, and he was named Allied commander-in-chief in April.\n\nThe relations between Haig and Nivelle at Calais were strained, and the relations between Haig and Foch in 1918 were correct but not warm. The Supreme War Council at Versailles had been created in November 1917 to improve coordination without putting the armies under one commander.",
  }),
  MORE("bef", "groundgiven", {
    title: "The Army That Gave Up the Ground", year: 1918, date: "1918-11-11", city: "London", advisors: ["haig"],
    family: "ground-given-up", tier: 1, ground: 1,
    at: ["bef_1918_21_armistice/moderate", "bef_1918_21_armistice/hard"],
    when: (m, f) => f.bef_seine === "withdrew" && f.bef_ypres === "withdrew",
    situation:
      "The army went back to the Seine in September 1914 and back from Ypres in October, and it has gone on going back where the line was hard to hold. The war goes on from a line nearer the coast than the one that was held, and the army has learned that ground can be given up without the war being lost.\n\nIt has learned also that the French do not forget who left them.",
    epilogue:
      "Speculative. The army falls back where the line is hard to hold, and the French do not forget it.\n\nWhat actually happened: in the first days of September 1914 the British commander wished to withdraw behind the Seine, and Kitchener went to Paris on 1 September to insist that the army stay in the line. The British army held the Ypres salient through the First Battle of Ypres, from October to November 1914.\n\nThe first battle of Ypres was fought by the army that had been in France for three months, and it was held at a cost of much of the old regular army.",
  }),

  // ---- the Austro-Hungarian Army High Command ----
  MORE("aok", "independent", {
    title: "An Independent Monarchy", year: 1918, date: "1918-11-03", city: "Baden", advisors: ["karl"],
    family: "monarchy-independent", tier: 2, ground: 2,
    at: ["aok_1918_13_vittorio/armistice", "aok_1918_13_vittorio/german", "aok_1918_13_vittorio/hungarians"],
    when: (m, f) => f.aok_sixtus === "separate" && f.aok_supreme === "refused",
    situation:
      "The monarchy never gave its armies to the German command, and the Emperor let Berlin know in 1917 that the war was a burden it meant to be rid of. In the autumn of 1918 the monarchy asks for terms on its own account, as a state that has kept its own army and its own foreign policy to the last.\n\nIt asks as a defeated power, and it is heard as one that has not been a German province.",
    epilogue:
      "Speculative. The monarchy keeps its own command to the end and asks for terms as an independent power, and is heard as one.\n\nWhat actually happened: Franz Joseph accepted German overall command of the Central Powers' armies in September 1916, Karl's letter to Prince Sixtus of 24 March 1917 was published in April 1918 and led to Czernin's resignation, and the monarchy broke up into its successor states after the armistice of Villa Giusti on 3 November 1918.\n\nThe monarchy's armies were put under German direction for most operations after 1916, and the Emperor's attempts to treat for peace were known to the German command and to the Allies.",
  }),
  MORE("aok", "grain", {
    title: "Grain Enough", year: 1918, date: "1918-11-03", city: "Baden", advisors: ["karl"],
    family: "winter-fed", tier: 2, ground: 2,
    at: ["aok_1918_13_vittorio/armistice", "aok_1918_13_vittorio/german", "aok_1918_13_vittorio/hungarians"],
    when: (m, f) => f.aok_ukraine === "partial" && m.will >= -6,
    situation:
      "Two divisions went east for the grain and came back with enough to matter. The towns of the monarchy are not starving this winter, and the army in Italy is fed. The strikes of January did not become the revolution that some had feared.\n\nThe monarchy is no stronger, but it is better fed than it was, and it asks for terms from a table that has bread on it.",
    epilogue:
      "Speculative. The towns are fed through the winter of 1918 and the January strikes do not spread, though the monarchy's other troubles remain.\n\nWhat actually happened: Austro-Hungarian forces occupied parts of Ukraine from February 1918, after the treaty of Brest-Litovsk with the Ukrainian People's Republic, and Odessa was taken by Austro-Hungarian troops in the spring. The grain that came out was far less than had been promised, and the monarchy was hungry in the summer.\n\nThe Ukrainian grain that the monarchy was promised under the treaty of February 1918 was a small part of what the cities needed, and the hunger of that summer was one of the causes of the strikes and the mutinies that followed.",
  }),
  MORE("aok", "italybeaten", {
    title: "Italy Beaten Early", year: 1918, date: "1918-11-03", city: "Baden", advisors: ["boroevic"],
    family: "italy-beaten-early", tier: 3, ground: 3,
    at: ["aok_1918_13_vittorio/armistice", "aok_1918_13_vittorio/german", "aok_1918_13_vittorio/hungarians"],
    when: (m, f) => f.aok_isonzo === "attacked" && f.aok_strafe === "launched",
    situation:
      "The first blow in 1915 fell on Italy before she was ready, and the Trentino offensive of 1916 was made at full strength. The Italian army has been beaten on the plateau and driven back from the Isonzo, and the monarchy has a front it can hold with fewer divisions than it used.\n\nThe monarchy comes to the last autumn with an enemy that has been taught what it costs.",
    epilogue:
      "Speculative. Italy is beaten early, and the monarchy's last battles are fought elsewhere.\n\nWhat actually happened: Italy declared war on Austria-Hungary on 23 May 1915 and the Isonzo front was fought through eleven battles before the Austro-German victory at Caporetto in October 1917. The Trentino offensive of May 1916 took part of the Asiago plateau and was broken off when the Russians attacked in Galicia.\n\nThe Italian army was reformed after Caporetto under Diaz and grew in strength through 1918, and the battle of Vittorio Veneto in October broke the Austro-Hungarian front. Hundreds of thousands of Italian soldiers were taken prisoner at Caporetto in 1917, and the army was rebuilt under Diaz.",
  }),
  MORE("aok", "southfirst", {
    title: "The Southern War", year: 1918, date: "1918-11-03", city: "Baden", advisors: ["arz"],
    family: "balkan-war-won", tier: 2, ground: 2,
    at: ["aok_1918_13_vittorio/armistice", "aok_1918_13_vittorio/german", "aok_1918_13_vittorio/hungarians"],
    when: (m, f) => f.aok_kolubara === "limited" && f.aok_montenegro === "attacked",
    situation:
      "Serbia was not invaded again in the winter of 1914 but only as far as the Kolubara, and Montenegro was attacked when the time came. The war in the south has been a limited one and has been won in the way that limited wars are won, with fewer men spent on it than the first plan asked.\n\nThe army that is left is tired but is not the army that the south consumed.",
    epilogue:
      "Speculative. The campaigns in the south stay limited, and fewer divisions are lost in Serbia and Montenegro.\n\nWhat actually happened: Potiorek's second invasion of Serbia took Belgrade in December 1914 and was thrown back by the Serbian counterattack at the Kolubara, and Potiorek was relieved on 22 December. Montenegro was attacked in January 1916 and Mount Lovcen was taken on 11 January, and the country surrendered within the month.\n\nThe Serbian army was not destroyed in 1914 and was driven out only in the autumn of 1915, by a combined Austro-German and Bulgarian offensive. Serbia was overrun in the autumn of 1915, and the army that escaped through Albania was carried to Corfu by the Allied fleets.",
  }),

  // ---- the Ottoman General Staff ----
  MORE("otto", "neutral", {
    title: "The Empire Stays Out", year: 1918, date: "1918-10-30", city: "Constantinople", advisors: ["izzet"],
    family: "empire-neutral", tier: 3, ground: 3,
    at: ["otto_1918_03_mudros/sign", "otto_1918_03_mudros/refuse"],
    when: (m, f) => f.otto_straits === "closed" && f.otto_offer === "entente",
    situation:
      "The Straits were closed to the German ships in August 1914, and the offer to the Entente was heard. The empire is neutral in October 1918, and it has an army that was never sent to the Caucasus or to Sinai and a treasury that was not emptied for a war.\n\nThe armistice is signed on the same day by the empires that were at war.",
    epilogue:
      "Speculative. The empire stays neutral and keeps its provinces, and what becomes of them is argued in other people's treaties.\n\nWhat actually happened: the German cruisers Goeben and Breslau were admitted to the Straits on 10 August 1914 and transferred to the Ottoman navy, and the empire entered the war on 29 October 1914 after the raid on the Russian Black Sea ports. The Armistice of Mudros was signed on 30 October 1918 and the empire lost its Arab provinces.\n\nThe empire's entry into the war was decided by a small group in Constantinople and by the German naval mission, and the Cabinet as a whole was not consulted.",
  }),
  MORE("otto", "shorter", {
    title: "A Shorter Empire", year: 1918, date: "1918-10-30", city: "Mudros", advisors: ["izzet"],
    family: "empire-shortened", tier: 2, ground: 2,
    at: ["otto_1918_03_mudros/sign", "otto_1918_03_mudros/refuse"],
    when: (m, f) => f.otto_aqaba === "abandoned" && f.otto_medina === "evacuated",
    situation:
      "Aqaba was given up in 1917 and Medina evacuated in 1916, and the empire has drawn its line where it could defend it. The Arabs are not fought for in the deserts, and the army that would have been consumed there stands on the line of Syria.\n\nThe armistice is signed by a delegation that represents a smaller empire than the one that went to war, and a more compact one.",
    epilogue:
      "Speculative. The empire gives up Medina and Aqaba and holds a shorter line in Syria.\n\nWhat actually happened: Aqaba was taken from the land side by the Arab forces on 6 July 1917, and the garrison of Medina held out until 10 January 1919, after the armistice. The Arab Revolt, begun in June 1916, tied down tens of thousands of Ottoman troops along the Hejaz railway.\n\nThe Hejaz railway was the long thread on which the empire's hold on the Arabian provinces hung, and the Arab Revolt of 1916 cut it again and again. The Ottoman army in Syria fell back after Megiddo in September 1918, and Aleppo fell on 26 October.",
  }),
  MORE("otto", "baghdad", {
    title: "Baghdad Retaken", year: 1918, date: "1918-10-30", city: "Mudros", advisors: ["izzet"],
    family: "baghdad-retaken", tier: 2, ground: 2,
    at: ["otto_1918_03_mudros/sign", "otto_1918_03_mudros/refuse"],
    when: (m, f) => f.otto_yildirim === "baghdad",
    situation:
      "The Yildirim army group went down the Euphrates in 1917 and took Baghdad back, and the British in Mesopotamia are on the defensive. Palestine has been thinned to feed the army in the east, and it is Palestine that has paid.\n\nThe armistice is signed with the Tigris held and Syria half lost.",
    epilogue:
      "Speculative. Baghdad is retaken, and Palestine is held more thinly to pay for it.\n\nWhat actually happened: Baghdad fell to the British on 11 March 1917, and the Yildirim army group, formed in 1917 under German command, was sent to Palestine and not to Mesopotamia. Jerusalem fell on 9 December 1917, and the British entered Damascus on 1 October 1918.\n\nThe Yildirim army group was a German project that failed to retake Baghdad because it was sent to Palestine and was too weak when it got there, and the British advanced on both fronts in 1917. British forces in Mesopotamia went on north after Baghdad and took Mosul only after the armistice, in the middle of November 1918.",
  }),
  MORE("otto", "jerusalem", {
    title: "Jerusalem Held", year: 1918, date: "1918-10-30", city: "Mudros", advisors: ["izzet"],
    family: "jerusalem-held", tier: 2, ground: 2,
    at: ["otto_1918_03_mudros/sign", "otto_1918_03_mudros/refuse"],
    when: (m, f) => f.otto_jerusalem === "held",
    situation:
      "The army dug in before the city, and the British guns were not enough, and the winter was spent with the line a few miles north of the Holy City. The city is spared a battle in its streets and the army is spared the retreat from them.\n\nThe armistice is signed with Jerusalem still in Ottoman hands, as the last of the great cities to be lost or kept.",
    epilogue:
      "Speculative. Jerusalem is held through the winter of 1917, and the British must fight for the city.\n\nWhat actually happened: the Ottoman army withdrew from Jerusalem and the city surrendered to the British on 9 December 1917, after a battle for the outer defences from 7 December, and Allenby entered on foot on 11 December. The front in Palestine held through the winter and broke at Megiddo in September 1918.\n\nThe loss of Jerusalem in December 1917 was a blow to Ottoman prestige and to the Sultan's claim to the caliphate, and it was celebrated in London as the Christmas gift of the nation.",
  }),
];

/**
 * Add each ending to its command and give the last reports' orders the rules that lead to them. Called once when the commands are built. The command's own
 * route to an ending (the order's nextIf) comes first: only when it has nothing to say are the new rules read, in the order they are listed. A rule marked first is
 * read before it, and guards against a collapse by its own meters (a rule that needs two orders of the file to have cost standing would otherwise never be reached).
 */
function applyMoreEndings() {
  const byOrder = {};
  for (const e of MORE_ENDINGS) {
    const camp = CAMPAIGNS[e.campaign];
    if (!camp || camp.nodes[e.id]) continue;
    camp.nodes[e.id] = {
      year: e.year, date: e.date, city: e.city, title: e.title, advisors: e.advisors,
      situation: e.situation,
      ending: { family: e.family, badge: BADGES[e.badge] },
      epilogue: () => e.epilogue,
    };
    for (const key of e.at) (byOrder[key] = byOrder[key] || []).push(e);
  }
  for (const [key, list] of Object.entries(byOrder)) {
    const [nodeId, choiceId] = key.split("/");
    const campaignId = nodeId.split("_")[0];
    const node = CAMPAIGNS[campaignId] && CAMPAIGNS[campaignId].nodes[nodeId];
    const choice = node && (node.choices || []).find((c) => c.id === choiceId);
    if (!choice) continue;
    const orig = choice.nextIf;
    choice.nextIf = (m, f) => {
      for (const e of list) if (e.first && e.when(m, f || {})) return e.id;
      const own = typeof orig === "function" ? orig(m, f) : null;
      if (own) return own;
      for (const e of list) if (!e.first && e.when(m, f || {})) return e.id;
      return null;
    };
  }
}
applyMoreEndings();
