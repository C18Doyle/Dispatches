// =============================================================================
// BRITISH EMPIRE — BEF AND WAR CABINET — HISTORICAL SPINE
// =============================================================================
//
// DESIGN. The seat is hybrid by design (spec §2.4). The office hears two kinds of
// voice: the field commander's (French, then Haig) and the Cabinet's (Asquith, then
// Lloyd George). Cabinet-level nodes are dated and framed as the Cabinet's decision
// reaching this office; no node puts the office in operational command of a theatre
// it did not command. The first node says so.
//
// SOURCING NOTE. Advisors carry `position`, not `quote`. A position is attributed to
// a named person only where the record supports it; where it does not, the choice
// carries no adviser. Claims are logged in claims/bef.json.
// =============================================================================

CAMPAIGNS.bef.startNode = "bef_1914_01_warcouncil";

CAMPAIGNS.bef.commanders = [
  { id: "french", name: "Sir John French", title: "Commander-in-Chief, British Expeditionary Force",
    from: "1914-08-04", to: "1915-12-20" },
  { id: "haig", name: "Sir Douglas Haig", title: "Commander-in-Chief, British Armies in France",
    from: "1915-12-21", to: "1918-11-11" },
];

CAMPAIGNS.bef.advisors = [
  { id: "french", name: "Sir John French", from: "1914-08-04", to: "1915-12-20",
    dossier: { role: "Commander-in-Chief, British Expeditionary Force, 1914-1915",
      bio: "A cavalry officer who commanded the BEF from its landing. Quarrelled with the French commander on the left of the line, wished to take the army out of it after Le Cateau, and gave a newspaper correspondent the facts about the shell shortage in May 1915.",
      fate: "Replaced in December 1915 and made Commander-in-Chief of the Home Forces. Lord Lieutenant of Ireland from 1918." } },
  { id: "haig", name: "Sir Douglas Haig", from: "1914-08-04", to: "1918-11-11",
    dossier: { role: "Corps and army commander; Commander-in-Chief from December 1915",
      bio: "Commanded I Corps in 1914 and the First Army at Loos. Believed throughout in the possibility of a decisive breakthrough in the west, and in the duty of the army to keep attacking. Mistrusted by Lloyd George from the start of his premiership.",
      fate: "Created Earl Haig in 1919. Led the veterans' movement that became the British Legion until his death in 1928." } },
  { id: "kitchener", name: "Lord Kitchener", from: "1914-08-05", to: "1916-06-05",
    dossier: { role: "Secretary of State for War, 1914-1916",
      bio: "Came to the War Office on 5 August 1914, expected a long war and began raising a new army. Sent the first divisions to France in fewer numbers than promised and kept control of the rest.",
      fate: "Drowned on 5 June 1916 when HMS Hampshire was sunk on the way to Russia." } },
  { id: "asquith", name: "Asquith", from: "1914-08-04", to: "1916-12-05",
    dossier: { role: "Prime Minister, 1908-1916",
      bio: "Led the Liberal government into the war and the coalition that followed in May 1915. Presided over a Cabinet that decided by agreement and was criticised for it.",
      fate: "Resigned on 5 December 1916 and was succeeded by Lloyd George. Never held office again." } },
  { id: "lloydgeorge", name: "Lloyd George", from: "1914-08-04", to: "1918-11-11",
    dossier: { role: "Chancellor, Minister of Munitions, Secretary of State for War, then Prime Minister from December 1916",
      bio: "Built the Ministry of Munitions from nothing in 1915. As Prime Minister distrusted the generals' judgement and tried to hold the army's manpower and strategy in civil hands.",
      fate: "Prime Minister until 1922." } },
  { id: "robertson", name: "Robertson", from: "1914-08-04", to: "1918-02-11",
    dossier: { role: "Quartermaster-General and Chief of Staff of the BEF; Chief of the Imperial General Staff from December 1915",
      bio: "Rose from the ranks. As Chief of the Imperial General Staff he was the Cabinet's principal military adviser and an advocate of concentrating in France. Backed Haig against Lloyd George until the Supreme War Council divided them.",
      fate: "Forced to resign as Chief of the Imperial General Staff in February 1918. Field Marshal in 1920." } },
  { id: "wilson", name: "Henry Wilson", from: "1914-08-04", to: "1918-11-11",
    dossier: { role: "Sub-Chief of Staff of the BEF; liaison with the French; Chief of the Imperial General Staff from February 1918",
      bio: "Drew up the pre-war plans with the French staff, and was close to them throughout. Lloyd George's military favourite after 1917, and Robertson's successor.",
      fate: "Field Marshal in 1919. Shot dead outside his London home in June 1922." } },
  { id: "jellicoe", name: "Jellicoe", from: "1914-08-04", to: "1917-12-24",
    dossier: { role: "Commander-in-Chief of the Grand Fleet; First Sea Lord from December 1916",
      bio: "Commanded the fleet at Jutland. As First Sea Lord in the spring of 1917 was the Admiralty's head when the submarine campaign was at its worst and the convoy system was adopted.",
      fate: "Dismissed from the Admiralty in December 1917. Governor-General of New Zealand 1920 to 1924." } },
  { id: "churchill", name: "Churchill", from: "1914-08-04", to: "1918-11-11",
    dossier: { role: "First Lord of the Admiralty to May 1915; Minister of Munitions from July 1917",
      bio: "The chief advocate of the naval attack on the Dardanelles, and its political casualty. Served on the Western Front in 1915 and 1916 and returned to the government in July 1917.",
      fate: "Prime Minister in the next war." } },
  { id: "rawlinson", name: "Rawlinson", from: "1914-08-04", to: "1918-11-11",
    dossier: { role: "Corps commander; Fourth Army commander at the Somme and at Amiens",
      bio: "Planned the Somme as a series of limited advances, and was told by Haig to aim higher. Directed the Fourth Army's attack at Amiens on 8 August 1918.",
      fate: "Commander-in-Chief in India from 1920. Died there in 1925." } },
  { id: "milner", name: "Milner", from: "1916-12-09", to: "1918-11-11",
    dossier: { role: "Member of the War Cabinet; Secretary of State for War from April 1918",
      bio: "A member of Lloyd George's five-man War Cabinet from its formation. Sent to France by the Prime Minister on 24 March 1918 and signed for Britain at Doullens.",
      fate: "Colonial Secretary 1919 to 1921." } },
];

CAMPAIGNS.bef.bulletinVoice = {
  source: "General Headquarters communiqué, as released through the Press Bureau and printed in the London papers",
  register: "Terse and hopeful, giving ground and prisoners in place of losses, with no word about casualties",
  defined: true,
};

CAMPAIGNS.bef.hardMode.forcedEndingId = "bef_end_relieved";
// Set from measurement (montecarlo.js hard, check-historical-ending.js): the historical line carries four erosion-tagged choices and survives at 5; about one random run in eleven is relieved.
CAMPAIGNS.bef.hardMode.erosionMax = 5;

CAMPAIGNS.bef.nodes = {

  // ---------------------------------------------------------------- 1914-08
  bef_1914_01_warcouncil: {
    year: 1914, date: "1914-08-12", city: "London",
    title: "Where the Army Lands",
    advisors: ["kitchener", "wilson", "asquith"],
    situation:
      "The Cabinet has decided that the Expeditionary Force will go to France, and on " +
      "6 August it decided that the first force would be four infantry divisions and the " +
      "cavalry division, not the six that had been promised. What is left to settle is " +
      "where it is to assemble.\n\n" +
      "The General Staff's plan, drawn up with the French by Henry Wilson, puts the " +
      "British on the left of the French armies, at Maubeuge, close to the frontier and " +
      "to the Belgians. Kitchener, who came to the War Office on 5 August, thinks the " +
      "army too small and too precious to be put so far forward, and would have it " +
      "assemble at Amiens, farther back, where it could strike once the route of the " +
      "German advance is known. Haig takes the same view.",
    context:
      "The office that sits at this table hears the Cabinet and the field commanders " +
      "both. It has no army of its own to command. It decides what the Cabinet decides, " +
      "and what the Cabinet can be made to hear from the generals, in the order they " +
      "arrive.",
    choices: [
      {
        id: "maubeuge",
        label: "Assemble at Maubeuge, on the French left, as the General Staff's plan says",
        historical: true,
        advisor: { name: "Henry Wilson", position:
          "The plan was made with the French, and the French have built theirs on it. Move the army and the left of their line is left to guess." },
        impact: { manpower: 0, munitions: 0, will: 0 },
        setFlags: { bef_landing: "maubeuge" },
        next: "bef_1914_02_seine",
        outcome:
          "After a three-hour meeting on 12 August in which Kitchener argues his case, the " +
          "Prime Minister overrules him, and the army assembles at Maubeuge. It takes its " +
          "place on the left of the French Fifth Army, and fights its first battle at Mons " +
          "on 23 August and begins the retreat that night. The soldiers who landed on the " +
          "French left are the ones who will bear the first German blow, and have no one " +
          "behind them to take it.",
      },
      {
        id: "amiens",
        label: "Assemble at Amiens, farther back, as Kitchener wants",
        advisor: { name: "Lord Kitchener", position:
          "Put the army where it can counterattack once the German line of march is known. In Belgium it would have to retreat almost at once and abandon its supplies." },
        impact: { manpower: 1, munitions: 0, will: -1 },
        setFlags: { bef_landing: "amiens" },
        next: "bef_1914_02_seine",
        outcome:
          "Speculative. The army assembles at Amiens and takes the field some days later " +
          "and some distance behind the French left. It is fresher and less exposed when " +
          "the Germans arrive, and the French Fifth Army has the British for neighbours at " +
          "a later date than it expected. The French staff, who built their plan on " +
          "Maubeuge, are told by their ally that the army will not be there.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1914-09
  bef_1914_02_seine: {
    year: 1914, date: "1914-09-01", city: "Paris",
    title: "Behind the Seine",
    advisors: ["french", "kitchener"],
    bulletin: {
      voice: "bef", date: "1914-08-31", source: "Communiqué of General Headquarters",
      text:
        "The British force continues to co-operate with the French armies in " +
        "the movements now in progress. The troops are in good heart.",
    },
    situation: (flags) =>
      "The army has fought at Mons and at Le Cateau and has been marching south for " +
      "nine days. " +
      (flags.bef_landing === "amiens"
        ? "It came into the line later than the French armies, and fresher. "
        : "") +
      "Sir John French, shaken by his losses and by the failure of the French on his " +
      "right to support him, is considering taking the army out of the line to refit " +
      "behind the Seine.\n\n" +
      "Joffre has urged him not to, and so has the President of the Republic, through " +
      "the British ambassador. Kitchener has crossed to Paris to see him, in the " +
      "uniform of a field marshal, and has put the matter in front of the Cabinet.",
    context:
      "The army has been the whole of Britain's land force in the field. Taking it out " +
      "of the line, even for a week, tells the French that the British are leaving the " +
      "alliance's battle at its worst moment.",
    choices: [
      {
        id: "stay",
        label: "Keep the army in the line, taking care not to be outflanked",
        historical: true,
        advisor: { name: "Lord Kitchener", position:
          "The army must stay in the line with the French. It can take care not to be outflanked, but it cannot leave." },
        attested: { by: "Kitchener", text: "an instruction",
          source: "Telegram to the Cabinet, 1 September 1914" },
        impact: { manpower: -1, munitions: 0, will: 0 },
        setFlags: { bef_seine: "stayed" },
        dispute:
          "No independent account exists of what passed between French and Kitchener " +
          "when they spoke alone at the embassy on 1 September. French recorded it " +
          "afterwards as an agreement. Kitchener's telegram to the Cabinet records an " +
          "instruction. What is not disputed is that the army stayed in the line and that " +
          "each man had a different view of what had been said.",
        next: "bef_1914_03_ypres",
        outcome:
          "Kitchener telegraphs the Cabinet that the army will remain in the line, taking " +
          "care not to be outflanked, and tells French to regard the telegram as an " +
          "instruction. The retreat goes on for four more days. On 6 September the army " +
          "turns with the French. The commander of the BEF has been told by his own " +
          "government that he is not free to leave the alliance, and does not forget it.",
      },
      {
        id: "seine",
        label: "Withdraw behind the Seine to refit before returning to the line",
        gate: (m) => m.will >= 0,
        disabledReason: "The Cabinet will not allow the army to leave the line at this moment",
        impact: { manpower: 1, munitions: 0, will: -3 },
        setFlags: { bef_seine: "withdrew" },
        next: "bef_1914_03_ypres",
        outcome:
          "Speculative. The army leaves the line and marches for the Seine. The French " +
          "Fifth Army's left is open for a week at the moment that the Germans are turning " +
          "inside Paris, and the opening has to be filled from the French reserves. The " +
          "British are rested, and are told by their ally that they have left the line " +
          "at the hour they were most needed.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1914-10
  bef_1914_03_ypres: {
    year: 1914, date: "1914-10-21", city: "Saint-Omer",
    title: "The Last of the Old Army",
    advisors: ["french", "haig"],
    situation:
      "The army has been moved north from the Aisne to Flanders, to defend the Channel " +
      "ports and to join the Belgians and the French in a line to the sea. General " +
      "Foch commands the northern group of French armies without formal authority over " +
      "the British or the Belgians, and he and French agreed on 10 October to combine " +
      "their forces north and east of Lille.\n\n" +
      "Today German reserve corps made up of volunteers have begun to attack at " +
      "Langemarck in dense columns. They lose very heavily and gain little. Behind them " +
      "the German command is assembling fresh divisions for a larger blow.",
    context:
      "The ports are the army's supply line. A line farther back would be easier to " +
      "hold and would give up Ypres, and the Belgian coast with it.",
    choices: [
      {
        id: "hold",
        label: "Hold the Ypres line and the line to the coast with everything that arrives",
        historical: true,
        advisor: { name: "Haig", position:
          "The line has to be held where it stands. A step back at Ypres lets the Germans in front of the ports." },
        impact: { manpower: -1, munitions: -1, will: 0 },
        setFlags: { bef_ypres: "held" },
        next: "bef_1915_04_dardanelles",
        outcome:
          "The line holds through the battle, which runs from 19 October to 22 November. " +
          "British losses between 14 October and the end of November are about 58,000. " +
          "Of the eighty-four infantry battalions that went to France in August, seventy-five " +
          "are under three hundred strong by 3 November, and eighteen are under one hundred. " +
          "The pre-war regular army has been spent, and the Channel ports are still in " +
          "Allied hands.",
      },
      {
        id: "coast",
        label: "Fall back toward the coast and shorten the line to cover Dunkirk and Calais",
        gate: (m) => m.will >= -1,
        disabledReason: "The French and the Belgians cannot be told that Ypres is to be given up",
        impact: { manpower: 1, munitions: 1, will: -2 },
        setFlags: { bef_ypres: "withdrew" },
        next: "bef_1915_04_dardanelles",
        outcome:
          "Speculative. The army withdraws toward a shorter line nearer the coast. Fewer " +
          "men are lost in the first weeks, and the Germans take Ypres and the high ground " +
          "round it, with the Belgian coast behind them. The ports are covered, and are " +
          "within range of guns that were not there before. The Belgian army, which has " +
          "been told to stand on the Yser, learns that its ally has stepped back.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1915-03
  bef_1915_04_dardanelles: {
    year: 1915, date: "1915-03-10", city: "London",
    title: "The Last Regular Division",
    advisors: ["kitchener", "churchill", "asquith"],
    situation: (flags) =>
      "The Navy is attacking the Dardanelles, in the belief that ships alone can force " +
      "the Straits, and an Anglo-French fleet has been bombarding the forts since 19 " +
      "February. " +
      (flags.bef_ypres === "withdrew"
        ? "The old army was not spent at Ypres, and there are formations that could be spared."
        : "The old army was spent at Ypres, and what is left at home is the new army, still in training.") +
      "\n\nOn 16 February Kitchener agreed to send the 29th Division, the last regular " +
      "division in Britain, to Lemnos as a back-up if the fleet should need an army. " +
      "Four days later he delayed its departure, and the War Council was not told. It " +
      "has still not sailed. Its release is the Cabinet's to give.",
    context:
      "The Navy's attack needs no soldiers. If it succeeds, the army was not wanted. If " +
      "it fails, the army is the only way left to try again, and it will have to go " +
      "by sea to a coast the enemy has had weeks to prepare.",
    choices: [
      {
        id: "release",
        label: "Release the 29th Division and prepare an army for the Dardanelles in case the fleet fails",
        historical: true,
        advisor: { name: "Lord Kitchener", position:
          "If the fleet goes through, the army is there to occupy what it takes. If it does not, there is no other way." },
        impact: { manpower: -1, munitions: -1, will: 1 },
        setFlags: { bef_dardanelles: "army" },
        next: "bef_1915_05_shells",
        outcome:
          "The division sails on 10 March. The fleet attacks on the 18th and loses three " +
          "battleships, and its commander calls off the attempt. The decision to try " +
          "again by land has been taken in effect before the fleet has failed, and the " +
          "troops go ashore on 25 April. The Cabinet has started a campaign in a second " +
          "theatre while the first is short of shells.",
      },
      {
        id: "hold",
        label: "Keep the division at home for France and leave the Dardanelles to the Navy",
        advisor: { name: "Winston Churchill", position:
          "The ships can do it alone, and if they cannot, then it is a decision the Cabinet can take when it sees what they have done." },
        impact: { manpower: 1, munitions: 0, will: -1 },
        setFlags: { bef_dardanelles: "navy" },
        next: "bef_1915_05_shells",
        outcome:
          "Speculative. The 29th Division stays in England and goes to France in due " +
          "course. The Navy attacks on 18 March and fails with no army within reach to " +
          "follow it, and the enterprise ends with the fleet withdrawing. The Cabinet " +
          "has spent three battleships and a good deal of prestige on an attempt it was " +
          "not prepared to follow up.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1915-05
  bef_1915_05_shells: {
    year: 1915, date: "1915-05-14", city: "Saint-Omer",
    title: "The Times Prints It",
    advisors: ["french", "kitchener", "lloydgeorge"],
    bulletin: {
      voice: "bef", date: "1915-05-12", source: "Communiqué of General Headquarters",
      text:
        "Our troops have gained ground at several points on the front north of " +
        "Festubert. The artillery has done good work. The operations continue.",
    },
    situation:
      "On 9 May the British attacked at Aubers Ridge and were stopped with heavy " +
      "losses. Sir John French holds that the failure was due to a shortage of " +
      "high-explosive shells, and he has told so to Colonel Repington, the military " +
      "correspondent of The Times, who is at his headquarters.\n\n" +
      "The article will be in tomorrow's paper. The government has said the supply is " +
      "in hand. The Admiralty is in a quarrel over the Dardanelles that has already " +
      "put the Cabinet under strain.",
    context:
      "The shortage is real, and the War Office has not made it known. A statement " +
      "from the army to the press that the government is failing it is an act of war " +
      "against the government, whether it is meant as one or not.",
    choices: [
      {
        id: "tell",
        label: "Let the correspondent tell the country about the shortage",
        historical: true,
        advisor: { name: "Sir John French", position:
          "The army has been sent into battle without the shells to win it, and the country should be told who is responsible." },
        impact: { manpower: 0, munitions: 2, will: 0 },
        setFlags: { bef_shells: "told" },
        erodes: "defy_authority",
        dispute:
          "French's reasons for giving Repington the information are argued. One view " +
          "holds that he wished to bring the shortage before the country, which is what " +
          "followed. Another holds that he was looking for an explanation of the failure at " +
          "Aubers Ridge that did not fall on his own plans. Both can be true.",
        next: "bef_1915_06_loos",
        outcome:
          "The Times prints it on 14 May under a headline blaming the limited supply for " +
          "the checked attacks. On 15 May Fisher resigns as First Sea Lord over the " +
          "Dardanelles, and on the 17th the Liberal government gives way to a coalition. " +
          "Lloyd George becomes Minister of Munitions on 25 May, and the Munitions of War " +
          "Act follows. The army has the shells it wanted within a year, and has told the " +
          "country that the government was neglecting it.",
      },
      {
        id: "private",
        label: "Keep the shortage between General Headquarters and the War Office",
        advisor: { name: "Lord Kitchener", position:
          "The supply is being dealt with. A public quarrel between the army and the government helps nobody but the enemy." },
        impact: { manpower: 0, munitions: -1, will: 1 },
        setFlags: { bef_shells: "private" },
        next: "bef_1915_06_loos",
        outcome:
          "Speculative. The shortage is pressed in letters and in conversation, and the " +
          "country is not told. The coalition does not come in May, and the Ministry of " +
          "Munitions is created later or not at all. The army goes on fighting with the " +
          "shells it has through the summer, and the quarrel between the Commander-in-Chief " +
          "and the Secretary of State goes on out of sight.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1915-08
  bef_1915_06_loos: {
    year: 1915, date: "1915-08-21", city: "London",
    title: "An Attack on Ground the Army Does Not Want",
    advisors: ["kitchener", "french", "haig"],
    situation: (flags) =>
      "Joffre is planning a great offensive in Artois and in Champagne for the autumn, " +
      "and has asked the British to attack beside him at Loos, south of the La Bassee " +
      "canal. French and Haig both regard the ground as unsuitable: it is flat, " +
      "overlooked by slag-heaps, and held by a line that has been fortified for a " +
      "year.\n\n" +
      (flags.bef_shells === "told"
        ? "The Ministry of Munitions is a few weeks old, and its first output has not reached the front. "
        : "The shell supply is still the army's chief grievance. ") +
      "Kitchener's view on 21 August is that the British must support the French " +
      "offensive, whatever the army thinks of the ground.",
    context:
      "The alliance is under strain. The French have been carrying most of the war " +
      "on the Western Front for a year, and have made it clear what they think of " +
      "British commitment.",
    choices: [
      {
        id: "attack",
        label: "Attack at Loos as Joffre asks, with the new divisions and with gas",
        historical: true,
        advisor: { name: "Lord Kitchener", position:
          "We must support the French offensive, even if we dislike the ground. The alliance matters more than the terrain." },
        impact: { manpower: -1, munitions: -2, will: 0 },
        setFlags: { bef_loos: "attacked" },
        next: "bef_1915_07_reserves",
        outcome:
          "Kitchener overrules French and Haig on 21 August, and the attack is made. " +
          "The first British use of gas on the Western Front is on 25 September, and " +
          "it fails to silence the defenders and in places drifts back over the " +
          "British lines. The two commanders go into the battle against their own " +
          "advice, and each knows that the other will be asked who was responsible " +
          "for what happens.",
      },
      {
        id: "limited",
        label: "Refuse the ground at Loos and offer a smaller operation elsewhere",
        advisor: { name: "Haig", position:
          "The ground at Loos is bad. It would be better to attack somewhere else, or not to attack at all." },
        gate: (m) => m.will >= 0,
        disabledReason: "The Secretary of State has already given the order",
        impact: { manpower: 0, munitions: 0, will: -2 },
        setFlags: { bef_loos: "refused" },
        erodes: "defy_authority",
        next: "bef_1915_08_evacuate",
        outcome:
          "Speculative. The army tells Kitchener that it will not attack at Loos and " +
          "offers a smaller operation farther north. The French are given less than " +
          "they asked for, and say so. The army saves the casualties of the battle and " +
          "pays for them in the French staff's opinion of its ally. The Secretary of " +
          "State, who gave the order, has been told by his own generals that it will " +
          "not be carried out, and has to decide what to do about it.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1915-09
  bef_1915_07_reserves: {
    year: 1915, date: "1915-09-25", city: "Saint-Omer",
    title: "Where the Reserve Stands",
    advisors: ["french", "haig"],
    bulletin: {
      voice: "bef", date: "1915-09-24", source: "Communiqué of General Headquarters",
      text:
        "The bombardment on the front south of the La Bassee canal has been " +
        "maintained for several days. The weather is favourable.",
    },
    situation:
      "The attack at Loos has opened with success at the start. The general reserve, " +
      "XI Corps, three divisions made up of the Guards and the 21st and 24th, is " +
      "under the Commander-in-Chief's own hand and is held some four and a half miles " +
      "behind the line.\n\n" +
      "Haig, whose First Army is making the attack, wants the reserve close behind it, " +
      "so that it can go through if the line breaks. Foch has the same view. The two " +
      "new divisions have only just landed in France and have marched a long way.",
    context:
      "A reserve that is near can be used when the opening comes. One that is far has to " +
      "march to it, and the opening is not there when it arrives.",
    choices: [
      {
        id: "keep",
        label: "Keep XI Corps under the Commander-in-Chief's own hand until the break is certain",
        historical: true,
        advisor: { name: "Sir John French", position:
          "A reserve placed in the front line's hands is a reserve spent. I will release it when I know what is wanted." },
        impact: { manpower: -1, munitions: -1, will: -1 },
        setFlags: { bef_reserves: "held" },
        dispute:
          "Responsibility for the late arrival of the reserves is still argued. French's " +
          "account puts it on Haig's request, which he says came too late. Haig's account " +
          "puts it on French's decision to keep the reserve so far back. Both accounts " +
          "agree on the result: the reserves crossed their start line at about six in the " +
          "evening.",
        uncertain: [
          { weight: 60, title: "The reserves arrive too late to use the opening", historicalBranch: true,
            impact: { manpower: -1 },
            setFlags: { bef_reservesResult: "late" },
            next: "bef_1915_08_evacuate",
            outcome:
              "The reserves do not reach the front until the evening of the first day, " +
              "and go into the attack tired, in the dark, against a German second line " +
              "that has been reinforced. British casualties at Loos by 8 October are " +
              "59,247. French's handling of the reserve is the main charge made against " +
              "him afterwards, and it is made by the army commanders under him, in " +
              "letters to the King's household." },
          { weight: 40, title: "The reserves arrive in time and are stopped by the second line",
            impact: { will: 1 },
            setFlags: { bef_reservesResult: "stopped" },
            next: "bef_1915_08_evacuate",
            outcome:
              "Speculative. The reserves reach the front earlier than they did, and meet " +
              "the German second position held in strength. They are stopped there with " +
              "the divisions that went before them, and the opening, if there was one, is " +
              "not used. The argument about where the reserve should have stood is lost " +
              "for both commanders, and the casualty list is longer." },
        ],
      },
      {
        id: "release",
        label: "Put XI Corps at Haig's disposal close behind the attack",
        advisor: { name: "Haig", position:
          "The reserve has to be where the commander of the attack can use it the moment the line gives way." },
        impact: { manpower: -2, munitions: -1, will: 1 },
        setFlags: { bef_reserves: "released" },
        next: "bef_1915_08_evacuate",
        outcome:
          "Speculative. The reserve stands close behind the first line and goes forward " +
          "in the first hours. Whether it takes the German second position, or is " +
          "stopped in front of it with the first divisions, is not something the record " +
          "can answer. The Commander-in-Chief has given up control of the one force that " +
          "he might have used to exploit a success of his own.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1915-11
  bef_1915_08_evacuate: {
    year: 1915, date: "1915-11-22", city: "London",
    title: "A Campaign That Has Stopped",
    advisors: ["kitchener", "churchill", "asquith"],
    situation: (flags) =>
      "The landing at Gallipoli in April was followed by months of fighting on three " +
      "small beachheads, and the army is held on ground that it cannot leave and cannot " +
      "advance from. General Hamilton has been replaced by General Monro, who proposed " +
      "evacuation on arrival. Kitchener has gone out to see the ground for himself and " +
      "has come to agree. " +
      (flags.bef_dardanelles === "navy"
        ? "No army was ever landed, and the question that is put to the Cabinet is different: whether to begin a campaign at all."
        : "Winter is coming, and the Cabinet has to decide whether to stay.") +
      "\n\nThe army in Gallipoli numbers some 93,000 men and 200 guns. The alternative " +
      "to evacuating is to reinforce it, with divisions that France and Salonika are also " +
      "asking for.",
    context:
      "The decision belongs to the Cabinet, and this office carries it out. An " +
      "evacuation in the face of the enemy is the hardest operation in war, and the " +
      "estimates of what it would cost run as high as half the force.",
    choices: [
      {
        id: "evacuate",
        label: "Evacuate Anzac and Suvla now, and Helles when the others are clear",
        historical: true,
        advisor: { name: "Lord Kitchener", position:
          "Having seen the ground myself, I do not believe the army can do more there than hold, and holding it through the winter is not worth the price." },
        impact: { manpower: 0, munitions: 0, will: 1 },
        setFlags: { bef_evacuate: "evacuated" },
        next: "bef_1915_09_succession",
        outcome:
          "The Cabinet decides on 22 November to evacuate Anzac and Suvla. The evacuation " +
          "of Anzac begins on 15 December, with 36,000 men taken off in five nights, and " +
          "the last party leaves in the early hours of 20 December. The British leave " +
          "Helles on the night of 8 January 1916. Some hundred thousand men are taken off " +
          "secretly and with very small loss, which is the most successful part of the " +
          "whole campaign, and which is also its end.",
      },
      {
        id: "stay",
        label: "Reinforce the army and stay through the winter",
        advisor: { name: "Winston Churchill", position:
          "The campaign has not yet been given the force it needed. To leave now is to say that everything spent has been spent for nothing." },
        gate: (m) => m.manpower >= -2,
        disabledReason: "The divisions for another attempt are not there, and France is asking for them",
        impact: { manpower: -2, munitions: -1, will: 1 },
        setFlags: { bef_evacuate: "stayed" },
        erodes: "defy_authority",
        next: "bef_1915_09_succession",
        outcome:
          "Speculative. Divisions are sent to the Dardanelles that would otherwise go to " +
          "France or Salonika, and the army stays on three beachheads through the winter. " +
          "Whether the reinforced army can do what the first could not is not something " +
          "the record can say. Kitchener, who has seen the ground, has been overruled " +
          "by the people who have not.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1915-12
  bef_1915_09_succession: {
    year: 1915, date: "1915-12-15", city: "London",
    title: "A New Commander-in-Chief",
    advisors: ["asquith", "robertson", "haig", "french"],
    situation:
      "Loos has been fought and lost, and the charge against Sir John French is that he " +
      "mishandled the reserves. Haig has written to the King's household about it. The " +
      "Prime Minister and the Secretary of State have decided that the Commander-in-Chief " +
      "has to go.\n\n" +
      "French is offered the chance to resign. The officers under him have given " +
      "their opinion of who should take his place, and the opinion of the army " +
      "commanders is for Haig. The other name is Robertson's, who is Chief of Staff of " +
      "the army and has no wish to leave the War Office.",
    context:
      "A change of Commander-in-Chief changes what the army will be asked to do. Haig " +
      "believes more strongly than French in the possibility of a decisive blow, and " +
      "is less willing to be told otherwise.",
    choices: [
      {
        id: "haig",
        label: "Accept French's resignation and appoint Haig",
        historical: true,
        advisor: { name: "Robertson", position:
          "The army has lost faith in its Commander-in-Chief. The right man to follow him is the one the army trusts." },
        impact: { manpower: 0, munitions: 0, will: 0 },
        setFlags: { bef_succession: "haig" },
        next: "bef_1916_10_conscription",
        outcome:
          "French resigns on 15 December and goes home as Commander-in-Chief of the Home " +
          "Forces. Haig takes over on 21 December, and Robertson goes to the War Office as " +
          "Chief of the Imperial General Staff two days later. The new Commander-in-Chief " +
          "has been chosen by the army and not by the Cabinet, and the Cabinet will remember " +
          "that when it has cause to disagree with him.",
      },
      {
        id: "keep",
        label: "Keep French in command through the winter and decide in the spring",
        advisor: { name: "Sir John French", position:
          "My handling of the reserves was my own judgment, and the army has not suffered by it so much as my critics say." },
        gate: (m) => m.will >= 1,
        disabledReason: "The Prime Minister cannot keep a commander the army's own generals are writing against",
        impact: { manpower: 0, munitions: 0, will: -2 },
        setFlags: { bef_succession: "french" },
        next: "bef_1916_10_conscription",
        outcome:
          "Speculative. French stays through the winter and is replaced in the spring " +
          "if the army still wants it. The planning for the summer is done by a " +
          "Commander-in-Chief whose own army commanders have lost confidence in him, " +
          "and who has been told so. The letters that Haig and others have been writing " +
          "go on, and the Cabinet has shown that it will not act on them. The Prime " +
          "Minister keeps a commander he does not trust, and the army knows it.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1916-01
  bef_1916_10_conscription: {
    year: 1916, date: "1916-01-05", city: "London",
    title: "Compulsion",
    advisors: ["asquith", "lloydgeorge", "kitchener", "robertson"],
    situation:
      "The army has been raised by volunteers, and the volunteers are running out. The " +
      "Derby scheme, a canvass of every man of military age in the country, has produced " +
      "fewer men than were expected, and many of the unmarried men who attested have " +
      "not come forward.\n\n" +
      "Asquith has promised that married men will not be called before the single ones " +
      "are, and he is about to bring in a Bill to compel the single. Many Liberals and " +
      "the whole of the Labour movement are against compulsion on principle, and the " +
      "Home Secretary is going to resign.",
    context:
      "The army needs men for the offensive that has been agreed with the French for the " +
      "summer. Compulsion is the way to get them, and a political price must be paid " +
      "for it.",
    choices: [
      {
        id: "compel",
        label: "Bring in a Bill to compel the unmarried men",
        historical: true,
        advisor: { name: "Robertson", position:
          "The army cannot be kept up to strength by volunteers. If we are to fight the war that we are fighting, the men will have to be called." },
        impact: { manpower: 3, munitions: 0, will: -1 },
        setFlags: { bef_conscription: "compulsion" },
        next: "bef_1916_11_somme",
        outcome:
          "The Military Service Act receives the royal assent on 27 January and takes effect " +
          "on 17 February. Thirty-five Liberal members vote against it, with thirteen " +
          "Labour members and the Irish Nationalists, and the Home Secretary, Sir John " +
          "Simon, resigns. A second Act in May extends liability to married men. The army " +
          "has its drafts for the summer, and the Cabinet has spent some of the goodwill " +
          "it had in the country.",
      },
      {
        id: "voluntary",
        label: "Keep to the voluntary system and extend the Derby scheme",
        advisor: { name: "Asquith", position:
          "A promise has been given to the country and the Labour movement, and a government that breaks it may not be able to govern." },
        impact: { manpower: -2, munitions: 0, will: 1 },
        setFlags: { bef_conscription: "voluntary" },
        next: "bef_1916_11_somme",
        outcome:
          "Speculative. The voluntary system is kept, and the Derby scheme is extended with " +
          "more pressure on the men who have not come forward. The Cabinet keeps the " +
          "peace with the Labour movement and the Liberals. The army reaches the summer " +
          "with fewer men than it was told to expect, and the offensive is planned for " +
          "an army of a smaller size.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1916-05
  bef_1916_11_somme: {
    year: 1916, date: "1916-05-16", city: "Montreuil",
    title: "A Breakthrough, or a Bite",
    advisors: ["haig", "rawlinson", "robertson"],
    bulletin: {
      voice: "bef", date: "1916-05-14", source: "Communiqué of General Headquarters",
      text:
        "There is nothing of importance to report on the British front. Our patrols " +
        "have been active, and the enemy's artillery has been less so.",
    },
    situation:
      "The offensive agreed at Chantilly is to be made on the Somme, with the British " +
      "to the north of the river and the French to the south. Haig, who has commanded " +
      "the army for five months, wants a great breakthrough, followed by cavalry " +
      "pouring through the gap into open country.\n\n" +
      "Rawlinson, whose Fourth Army will make the attack, has little faith in a " +
      "breakthrough. His plan is for limited advances to take the high ground, a pause " +
      "to break up the German counter-attacks, and then another advance. He has " +
      "submitted it and Haig has said it is not ambitious enough.",
    context:
      "A plan that tries for a breakthrough needs more men, more guns and more reserves " +
      "than the army has, and is judged by whether the gap opens. One that tries for " +
      "a bite is judged by the ground it holds, and is a smaller thing to promise.",
    choices: [
      {
        id: "compromise",
        label: "Approve Rawlinson's plan, with the cavalry ready for exploitation if the line breaks",
        historical: true,
        advisor: { name: "Haig", position:
          "The plan must aim at a real success. If the line breaks, the cavalry must be there to go through it." },
        impact: { manpower: -2, munitions: -2, will: 0 },
        setFlags: { bef_somme: "compromise" },
        dispute:
          "Whether the Somme was an exercise in futility or a necessary stage in wearing " +
          "down the German army is disputed, and has been since 1916. Critics point to " +
          "the cost of the first day and the lack of any breakthrough. Defenders point to " +
          "the strain placed on the German army, and to the lessons that the British army " +
          "learned. The plan itself is usually described as an uneasy compromise between " +
          "two different ideas of what the attack was for.",
        uncertain: [
          { weight: 70, title: "A costly first day and no breakthrough", historicalBranch: true,
            impact: { manpower: -1 },
            setFlags: { bef_sommeResult: "attrition" },
            next: "bef_1916_12_tanks",
            outcome:
              "The plan that emerges is a compromise between the two ideas, and Rawlinson " +
              "has in practice ignored much of what the Commander-in-Chief asked for. The " +
              "attack opens on 1 July after a week of bombardment, and the first day " +
              "costs the army some 57,000 casualties, nearly 20,000 of them killed. The " +
              "battle goes on until November without a breakthrough. It is the largest " +
              "British battle of the war so far, and the biggest the army has ever " +
              "fought." },
          { weight: 30, title: "The bombardment does more than the record shows",
            impact: { will: 1 },
            setFlags: { bef_sommeResult: "gain" },
            next: "bef_1916_12_tanks",
            outcome:
              "Speculative. The bombardment does more damage to the German wire and " +
              "dugouts than it did, and the infantry reach their first objectives along " +
              "more of the front. The gains are real and are not followed by a " +
              "breakthrough, and the cavalry are not used. The Commander-in-Chief has a " +
              "better first day to report, and the same argument about what it was for." },
        ],
      },
      {
        id: "bitehold",
        label: "Adopt Rawlinson's method in full: limited advances, and no attempt at a breakthrough",
        advisor: { name: "Rawlinson", position:
          "The army is not able to break the line in one blow. It can take the high ground and hold it, and then do it again." },
        impact: { manpower: -1, munitions: -1, will: -1 },
        setFlags: { bef_somme: "bitehold" },
        next: "bef_1916_12_tanks",
        outcome:
          "Speculative. The plan aims only at the ground that can be taken and held, with " +
          "the cavalry kept back. The first day's attack is smaller in its aims and not " +
          "necessarily smaller in its cost, since the German positions are what they are. " +
          "The Commander-in-Chief has decided that his army is not what he thought it " +
          "was, and tells the French that their ally will make a smaller contribution " +
          "than the one agreed at Chantilly.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1916-09
  bef_1916_12_tanks: {
    year: 1916, date: "1916-09-13", city: "Montreuil",
    title: "Forty-Nine Tanks",
    advisors: ["haig", "lloydgeorge"],
    situation:
      "The first tanks are in France: some sixty of them, of which forty-nine are " +
      "ready to fight. Lloyd George, when he was Minister of Munitions, ordered a " +
      "hundred of them in February. The officers who built them, with Colonel Swinton " +
      "at their head, want them held back until enough are ready for a mass attack on " +
      "ground that has been chosen for them, so that the first use is a surprise.\n\n" +
      "The Somme has been going on for ten weeks, and the army needs a success. Haig is " +
      "eager to try the new machines as soon as they are ready, and the Fourth Army's " +
      "attack on the 15th is the next chance.",
    context:
      "A weapon can be used once for the first time. Spent in small numbers on a " +
      "difficult field, it teaches the enemy what to expect, and held back, it is " +
      "not available when it is needed.",
    choices: [
      {
        id: "now",
        label: "Use the forty-nine tanks in the attack of 15 September",
        historical: true,
        advisor: { name: "Haig", position:
          "The machines are ready, and the army needs every help it can get. They should go in as soon as there are enough to make a difference." },
        impact: { manpower: 0, munitions: -1, will: 1 },
        setFlags: { bef_tanks: "used" },
        dispute:
          "Whether the first use of the tanks on the Somme was premature is argued. " +
          "Swinton and others held that it threw away the surprise for a limited success. " +
          "Haig's defenders hold that the army could not wait, and that the lessons of the " +
          "first use were what made the later successes possible. Both agree that the " +
          "results on the day were mixed.",
        uncertain: [
          { weight: 60, title: "A limited success, and the surprise is gone", historicalBranch: true,
            impact: { will: 0 },
            setFlags: { bef_tanksResult: "spent" },
            next: "bef_1917_13_calais",
            outcome:
              "Forty-nine tanks go into the attack at Flers and Courcelette on 15 " +
              "September, and many break down or are ditched before they reach the German " +
              "line. A few help in the capture of Flers and give the infantry some help " +
              "where they reach it. The Germans learn what the new weapon is. The tank's " +
              "first battle is a limited success, and its surprise is gone for good." },
          { weight: 40, title: "The lessons outweigh the lost surprise",
            impact: { will: 1 },
            setFlags: { bef_tanksResult: "lessons" },
            next: "bef_1917_13_calais",
            outcome:
              "Speculative. The first use teaches the staff more than the enemy. The " +
              "crews, the infantry and the gunners learn how the machines can be used " +
              "together, and the improvements that follow make the later attacks " +
              "possible. The Germans, who have seen a few tanks, are slow to see what " +
              "they mean. The surprise was spent, and it bought what a surprise could " +
              "not." },
        ],
      },
      {
        id: "wait",
        label: "Hold the tanks until enough are ready for a surprise attack on chosen ground",
        advisor: { name: "Colonel Swinton", position:
          "A weapon used in handfuls on a bad field is a weapon thrown away. Wait until there are enough to make a surprise." },
        impact: { manpower: -1, munitions: 0, will: -1 },
        setFlags: { bef_tanks: "held" },
        next: "bef_1917_13_calais",
        outcome:
          "Speculative. The tanks are held back, and the attack of 15 September goes in " +
          "without them. The army has to fight on the Somme with what it had before, " +
          "and the tanks are kept for a mass attack the following year, on ground " +
          "chosen for them. The Germans do not see the machine until it comes in force.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1917-02
  bef_1917_13_calais: {
    year: 1917, date: "1917-02-26", city: "Calais",
    title: "Under a French General",
    advisors: ["lloydgeorge", "haig", "robertson"],
    bulletin: {
      voice: "bef", date: "1917-02-24", source: "Communiqué of General Headquarters",
      text:
        "Local operations on the Ancre front have been carried out by our " +
        "troops with satisfactory results. The enemy is retiring at some " +
        "points.",
    },
    situation: (flags) =>
      "Lloyd George has been Prime Minister for eleven weeks. He does not believe " +
      "in the Somme policy, and has accepted a plan of Nivelle's that offers a quick " +
      "decision at the Aisne. " +
      (flags.bef_somme === "bitehold"
        ? "The army made a smaller attack on the Somme, and is stronger than it would have been."
        : "The army is tired after the Somme.") +
      "\n\nThe conference at Calais is called, on the face of it, to discuss the railways " +
      "that will carry the spring offensive. Lloyd George, with the approval of the " +
      "War Cabinet, has a different purpose: to place the British army under Nivelle for " +
      "the duration of the offensive. He has not told Haig or Robertson.",
    context:
      "A Prime Minister who can put the army under a foreign general is a Prime " +
      "Minister who can put it under anyone. Haig and Robertson have to decide what " +
      "they will accept, and what they will resign over.",
    choices: [
      {
        id: "accept",
        label: "Accept the arrangement for the duration of the offensive, under protest",
        historical: true,
        advisor: { name: "Lloyd George", position:
          "The Allies have spent two years losing separately. Under a single direction for one campaign, the army will at least be used as part of a whole." },
        impact: { manpower: 0, munitions: 0, will: -1 },
        setFlags: { bef_calais: "accepted", xc_calais: "accepted" },
        erodes: "defy_authority",
        next: "bef_1917_14_convoy",
        outcome:
          "By the Calais agreement of 27 February Haig is formally subordinated to Nivelle " +
          "for the duration of the offensive. The next day Haig and Robertson tell the " +
          "Prime Minister that they will resign rather than carry it out, and the " +
          "arrangement is watered down, with more freedom for the British. The conference " +
          "leaves mistrust between the British government and its generals that lasts " +
          "to the end of the war, and sets back the cause of unified command until " +
          "the spring of 1918.",
      },
      {
        id: "refuse",
        label: "Refuse the subordination and offer to coordinate by agreement",
        advisor: { name: "Robertson", position:
          "The army cannot be placed under the orders of a foreign general by a Prime Minister who has not consulted its own commander." },
        impact: { manpower: 0, munitions: 0, will: 1 },
        setFlags: { bef_calais: "refused", xc_calais: "refused" },
        next: "bef_1917_14_convoy",
        outcome:
          "Speculative. The Cabinet is told that the army will not serve under Nivelle, " +
          "and the Prime Minister has to decide whether to overrule his generals or " +
          "give way. The offensive goes forward with the British under their own " +
          "commander, and the French are told they have an ally who will cooperate " +
          "and will not obey. Lloyd George's opinion of his generals is confirmed.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1917-04
  bef_1917_14_convoy: {
    year: 1917, date: "1917-04-30", city: "London",
    title: "The Admiralty and the Convoy",
    advisors: ["lloydgeorge", "jellicoe"],
    bulletin: {
      voice: "bef", date: "1917-04-28", source: "Communiqué of the Admiralty",
      text:
        "The weekly return of arrivals and sailings of merchant vessels at ports of the " +
        "United Kingdom shows that shipping continues to move in the usual volume.",
    },
    situation: (flags) =>
      (flags.xc_usw === "restricted"
        ? "The Germans are keeping to prize rules, and the losses at sea are a fraction of what the Admiralty feared, but they are as high as the country can bear, and the case for convoy is being argued on arithmetic and not on alarm. "
        : "April has been the worst month of the war at sea: 373 ships of 873,754 tons " +
          "sunk, Allied and neutral, and the rate has not eased. ") +
      (flags.bef_dardanelles === "navy"
        ? "The Navy's strength has not been drawn off to a second theatre, and the escorts exist in greater numbers."
        : "The Navy's destroyers are spread across several theatres.") +
      "\n\nThe Admiralty has argued for two years against convoy: that it would " +
      "bunch the ships into targets, that there are not enough escorts, and that the " +
      "ports could not handle the arrivals. Its anti-submarine division has " +
      "recommended it, and the First Sea Lord, Jellicoe, has approved a trial. The Prime " +
      "Minister is going to the Admiralty to see for himself.",
    context:
      "Britain has some weeks of wheat in the country. A decision about convoy is a " +
      "decision about whether the war can be kept going at all, and the Cabinet has " +
      "to decide how hard to press it.",
    choices: [
      {
        id: "convoy",
        label: "Order the convoy system tried at once, in the Atlantic trade",
        historical: true,
        advisor: { name: "Lloyd George", position:
          "The losses are such that it must be tried. Whatever the objections, we cannot go on losing ships at this rate." },
        impact: { manpower: 0, munitions: 1, will: 2 },
        setFlags: { bef_convoy: "adopted" },
        dispute:
          "Lloyd George later said that he forced convoy on an unwilling Admiralty. The " +
          "Admiralty's own anti-submarine division had recommended it on 26 April, and " +
          "Jellicoe had approved the plan on the 27th, three days before the visit. " +
          "Historians differ over how much the Prime Minister's pressure changed what the " +
          "Admiralty was already doing.",
        next: "bef_1917_15_ypres3",
        outcome:
          "The first convoy leaves Gibraltar on 10 May, seventeen ships with two " +
          "escorts, and arrives safely in Britain twelve days later. The system is " +
          "extended through the summer, and the losses fall. The decision that mattered " +
          "most was made in the same week as the visit, and its credit is argued over " +
          "by the people who made it. It is among the few decisions of the war whose " +
          "effect is clear.",
      },
      {
        id: "patrols",
        label: "Leave the matter to the Admiralty and continue with patrols and sweeps",
        advisor: { name: "Jellicoe", position:
          "Convoy needs escorts that we have not got, and a system of ports that cannot take the arrivals. We must try the other methods first." },
        impact: { manpower: 0, munitions: -2, will: -2 },
        setFlags: { bef_convoy: "delayed" },
        nextIf: (m) => (m.will <= -5 ? "bef_end_shipping" : null),
        next: "bef_1917_15_ypres3",
        outcome:
          "Speculative. The Admiralty goes on with patrols, sweeps and hunting groups, " +
          "and convoy is tried later. Shipping losses continue at about the April rate " +
          "through the summer, and the stock of wheat in the country falls. The Prime " +
          "Minister has asked the Admiralty to hurry and been told that it is doing " +
          "all it can.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1917-07
  bef_1917_15_ypres3: {
    year: 1917, date: "1917-07-25", city: "London",
    title: "Flanders Again",
    advisors: ["haig", "robertson", "lloydgeorge", "milner"],
    bulletin: {
      voice: "bef", date: "1917-07-23", source: "Communiqué of General Headquarters",
      text:
        "Our artillery has been active on the Ypres front, and has dealt " +
        "effectively with the enemy's batteries. Aerial reconnaissance has been " +
        "continuous.",
    },
    situation: (flags) =>
      "Haig wants an offensive in Flanders, to break out of the Ypres salient, take " +
      "the Belgian coast and the submarine bases on it, and relieve the French, whose " +
      "army has not recovered from the spring. " +
      (flags.bef_calais === "accepted"
        ? "The Calais arrangement is a few months old, and its memory is not a good one."
        : "The Prime Minister's confidence in his generals is not high.") +
      "\n\nLloyd George does not believe it can succeed. The Allies have only a small " +
      "superiority in Flanders and parity in artillery, and the Americans are coming. " +
      "He would rather wait. Robertson backs Haig, and is the Cabinet's military " +
      "adviser.",
    context:
      "A Prime Minister can veto an offensive. He cannot replace the Commander-in-Chief " +
      "and the Chief of the Imperial General Staff together without a political " +
      "crisis, and the War Cabinet is divided about whether it would be worth one.",
    choices: [
      {
        id: "authorise",
        label: "Allow Haig's offensive in Flanders to go ahead",
        historical: true,
        advisor: { name: "Robertson", position:
          "The army has to be allowed to fight. A veto means taking the responsibility for a campaign that the Cabinet will not conduct itself." },
        impact: { manpower: -2, munitions: -2, will: -1 },
        setFlags: { bef_ypres3: "authorised" },
        dispute:
          "Whether the Third Battle of Ypres was justified is disputed. Its defenders " +
          "point to the strain it put on the German army and the need to relieve the " +
          "French. Its critics point to the cost, the mud and the small ground gained. " +
          "The casualty figures for both sides are themselves argued over.",
        next: "bef_1918_16_manpower",
        outcome:
          "Lloyd George grudgingly withdraws his veto, and the offensive opens on 31 July. " +
          "It runs until 10 November, in rain and mud that the guns have made, and ends " +
          "with the village of Passchendaele taken and the Belgian coast still in German " +
          "hands. The Prime Minister's distrust of Haig, and of Robertson who backed him, " +
          "is now settled, and he begins to look for a way to deal with both.",
      },
      {
        id: "veto",
        label: "Veto the offensive and wait for the American army",
        advisor: { name: "Lloyd George", position:
          "I will not be a party to another Somme. The army should wait until the Americans are in the line and then attack with enough men." },
        gate: (m) => m.will >= 1,
        disabledReason: "A Prime Minister cannot veto the Commander-in-Chief and the Chief of the Imperial General Staff together",
        impact: { manpower: 2, munitions: 1, will: -3 },
        setFlags: { bef_ypres3: "vetoed" },
        erodes: "defy_authority",
        next: "bef_1918_16_manpower",
        outcome:
          "Speculative. The Flanders offensive is not allowed, and the army spends the " +
          "summer on smaller operations. The French, who were expecting the British to " +
          "relieve them, are told that they must wait. The Prime Minister has used his " +
          "authority over the generals once, and has made it clear that he will use it " +
          "again. Haig and Robertson have to decide whether to accept the decision or " +
          "to resign, and the Cabinet has to decide what it will do if they do.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1918-01
  bef_1918_16_manpower: {
    year: 1918, date: "1918-01-09", city: "London",
    title: "The Line and the Men",
    advisors: ["lloydgeorge", "haig", "robertson"],
    situation: (flags) =>
      "The army is about 70,000 men short, and expects a German offensive in the spring. " +
      "The War Cabinet has decided to send 100,000 men of the best category to France " +
      "in the next months, against the 615,000 the army has asked for, and to hold " +
      "another 120,000 at home as a reserve. " +
      (flags.bef_ypres3 === "vetoed"
        ? "The army was spared the losses of a long autumn, and is stronger than it would have been."
        : "The losses of the autumn in Flanders have not been made good.") +
      "\n\nPetain has asked the British to take over more of the French front, down " +
      "to Barisis, a line that would need six more divisions in the front. The French " +
      "have been carrying the war for longer and are in worse condition." +
      (flags.xc_usw === "restricted" ? "\n\nThe Americans are not coming. The United States is not at war with Germany, and the Allies cannot count on a single division from her in 1918." : ""),
    context:
      "To take the front is to go into the spring with a longer line and fewer men to " +
      "hold it. To refuse is to tell the French that their ally is keeping its men " +
      "for itself.",
    choices: [
      {
        id: "extend",
        label: "Take over the line to Barisis as Petain asks, with the men the Cabinet allows",
        historical: true,
        advisor: { name: "Haig", position:
          "The French are asking what they need. We will take the line, and I will ask the Cabinet for the men to hold it." },
        impact: { manpower: -2, munitions: 0, will: 0 },
        setFlags: { bef_manpower: "extended" },
        dispute:
          "Whether the Cabinet's holding back of men left the Fifth Army too weak to " +
          "stand in March is one of the oldest quarrels of the war. The Prime Minister " +
          "said afterwards that the army had more men than it had a year before. Haig's " +
          "supporters said that the men were in the wrong places and the line was " +
          "longer. The figures can be read either way.",
        next: "bef_1918_17_reserve",
        outcome:
          "The British take over the sector as far as Barisis, a front needing six " +
          "more divisions. Between January and the end of March the army receives " +
          "174,379 men, some 32,000 of them Dominion troops, and does not reach its strength. " +
          "The Fifth Army, which holds the longest and weakest part of the line, has " +
          "a front of forty-two miles with fourteen infantry divisions.",
      },
      {
        id: "refuse",
        label: "Refuse the extension until the reinforcements arrive",
        advisor: { name: "Robertson", position:
          "The army cannot take on a longer line without more men. The French must wait until the men are in France." },
        gate: (m) => m.will >= -1,
        disabledReason: "The Cabinet has already told the French that the line will be taken over",
        impact: { manpower: 1, munitions: 0, will: -2 },
        setFlags: { bef_manpower: "refused" },
        erodes: "defy_authority",
        next: "bef_1918_17_reserve",
        outcome:
          "Speculative. The extension is delayed, and the French are told that they " +
          "must hold what they have for some weeks longer. The British line is shorter " +
          "when the German offensive comes, and the French line is longer. Clemenceau " +
          "and Petain say what they think of an ally who takes the French armies' " +
          "losses and gives them nothing in return.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1918-03
  bef_1918_17_reserve: {
    year: 1918, date: "1918-03-01", city: "Montreuil",
    title: "A Reserve for the Whole Front",
    advisors: ["haig", "wilson"],
    situation: (flags) =>
      "At the Rapallo conference in November the Allied governments set up a Supreme " +
      "War Council at Versailles, with a general reserve under an executive committee " +
      "to be chaired by Foch. Lloyd George hoped that it would limit the authority of " +
      "Haig and of Robertson. " +
      (flags.bef_manpower === "extended"
        ? "Robertson resigned on 11 February and Henry Wilson is Chief of the Imperial General Staff."
        : "Robertson resigned on 11 February over the general reserve, and Henry Wilson is Chief of the Imperial General Staff.") +
      "\n\nThe Council has asked each army to contribute divisions to the general " +
      "reserve. Haig has been told to find them, from an army that is short of men " +
      "and holding a longer front than it did. Petain and Clemenceau are against the " +
      "scheme too.",
    context:
      "A Commander-in-Chief who refuses a decision of the Supreme War Council is " +
      "refusing the government that sent him. He has Petain and Clemenceau on his " +
      "side, and the Prime Minister has to decide whether to dismiss him.",
    choices: [
      {
        id: "refuse",
        label: "Decline to give up divisions for the general reserve",
        historical: true,
        advisor: { name: "Haig", position:
          "I cannot give up divisions to a committee that will decide where they go, when the German attack is expected on my own front." },
        impact: { manpower: 0, munitions: 0, will: 0 },
        setFlags: { bef_reserve: "refused" },
        erodes: "defy_authority",
        next: "bef_1918_18_doullens",
        outcome:
          "In the first days of March Haig refuses to carry out the Council's order. " +
          "With Petain and Clemenceau, who also oppose the measure, he defeats the " +
          "scheme. The Prime Minister decides it is too late, with a great German " +
          "attack expected, to replace him. The general reserve is never formed, and " +
          "the offensive opens on 21 March against armies that have no common reserve.",
      },
      {
        id: "comply",
        label: "Give up the divisions asked for and accept Foch's committee",
        advisor: { name: "Henry Wilson", position:
          "A reserve under a single direction can be moved to wherever the blow falls. Without one, each army will be fighting alone." },
        impact: { manpower: -2, munitions: 0, will: 1 },
        setFlags: { bef_reserve: "complied" },
        next: "bef_1918_18_doullens",
        outcome:
          "Speculative. The British divisions are put into the general reserve, and the " +
          "French and Italian contributions follow. The reserve exists when the German " +
          "offensive opens, and can be sent to the threatened sector. It is under a " +
          "committee, and the army that gave the divisions has fewer in its own line on " +
          "21 March. Whether the committee moves them in time, and in the right " +
          "direction, is the thing that nobody can say beforehand.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1918-03
  bef_1918_18_doullens: {
    year: 1918, date: "1918-03-26", city: "Doullens",
    title: "Somebody to Coordinate",
    advisors: ["haig", "milner", "wilson"],
    situation: (flags) =>
      "The German offensive has driven the Fifth Army back across the old Somme " +
      "battlefield, and the British and French armies are being pushed apart. " +
      (flags.bef_reserve === "complied"
        ? "The general reserve exists, but it is under a committee, and the committee has to agree."
        : "There is no general reserve, and each army is fighting for itself.") +
      "\n\nHaig asked on 25 March for Wilson and Milner to come to France at once, and " +
      "said that he wanted General Foch, or some other determined general, given " +
      "supreme command of the operations. Milner has been sent by the Prime Minister, " +
      "with the powers to settle the matter.",
    context:
      "A British Commander-in-Chief who accepts a French general's orders is " +
      "giving up what no British commander has given up before. The alternative is " +
      "two armies falling back in different directions.",
    choices: [
      {
        id: "foch",
        label: "Accept Foch to coordinate the operations of all the armies",
        historical: true,
        advisor: { name: "Milner", position:
          "There must be one man to direct the whole battle, and Foch is the man the Prime Minister and the French government will accept." },
        impact: { manpower: 0, munitions: 0, will: 1 },
        setFlags: { bef_doullens: "foch", xc_command1918: "unified" },
        next: "bef_1918_19_backs",
        outcome:
          "At the Hotel de Ville at Doullens on 26 March, Haig accepts the appointment of " +
          "Foch to coordinate the reserves of all nationalities wherever he sees fit, " +
          "and Milner, using the powers the Prime Minister has given him, agrees for " +
          "the British government. The decision means that no commander will again be " +
          "able to hold back his divisions because of national feeling, and that Haig " +
          "must now ask rather than order.",
      },
      {
        id: "national",
        label: "Keep the British command independent and coordinate with the French by agreement",
        advisor: { name: "Haig", position:
          "The army is fighting for its life, and it must be commanded by the man who knows it best." },
        gate: (m) => m.will >= -2,
        disabledReason: "The government has already sent Milner to settle the matter",
        impact: { manpower: -2, munitions: 0, will: 0 },
        setFlags: { bef_doullens: "national", xc_command1918: "national" },
        erodes: "defy_authority",
        nextIf: (m) => (m.manpower <= -8 ? "bef_end_ports" : null),
        next: "bef_1918_19_backs",
        outcome:
          "Speculative. The two armies go on conferring and agreeing, and the British " +
          "Commander-in-Chief keeps his own command. The gap between the armies is a " +
          "matter of goodwill under shellfire, and each army considers its own line of " +
          "retreat first. The Germans have the time that the Allied headquarters take " +
          "to agree, and use it. Milner, who was sent to settle the matter, goes home " +
          "without having settled it, and has to say why.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1918-04
  bef_1918_19_backs: {
    year: 1918, date: "1918-04-11", city: "Montreuil",
    title: "With Our Backs to the Wall",
    advisors: ["haig", "wilson"],
    bulletin: {
      voice: "bef", date: "1918-04-09", source: "Communiqué of General Headquarters",
      text:
        "Fighting has been in progress since the early morning north and south of " +
        "Armentieres. The enemy's attacks have been met by our troops, and the " +
        "situation is being dealt with.",
    },
    situation:
      "The German attack on 9 April on the Lys, where the Portuguese were holding the " +
      "line, has driven the British back and brought the Germans within reach of the " +
      "Channel ports. The army has been fighting for three weeks, and the reserves " +
      "that were to have come from France are not yet in the line.\n\n" +
      "The commanders in the north are asking for orders. The ports are not far away.",
    context:
      "An order that forbids any retirement may save a position and may waste a " +
      "division that was holding it. An order that permits one may be read as a " +
      "signal that the whole line is giving way.",
    choices: [
      {
        id: "order",
        label: "Issue an order to the army: every position held, and no retirement",
        historical: true,
        advisor: { name: "Haig", position:
          "The army has to be told that there is nowhere to go. A withdrawal now would not stop at one line." },
        attested: { by: "Haig", text: "Every position must be held to the last man: there must be no retirement.",
          source: "Special Order of the Day, 11 April 1918" },
        impact: { manpower: -1, munitions: 0, will: 1 },
        setFlags: { bef_backs: "order" },
        next: "bef_1918_20_hundreddays",
        outcome:
          "The Special Order of the Day is issued on 11 April. It says that there must be " +
          "no retirement, that with our backs to the wall and believing in the justice " +
          "of our cause each man must fight on to the end, and that the French Army is " +
          "moving rapidly to our support. The line holds in front of the ports, and " +
          "the German offensive on the Lys is brought to a halt before the end of the " +
          "month.",
      },
      {
        id: "withdraw",
        label: "Authorise a withdrawal in Flanders to a shorter line, giving up the ground won in 1917",
        advisor: { name: "Henry Wilson", position:
          "A shorter line is a stronger line. The ground at Ypres was won at great cost and is of no use if the army is lost holding it." },
        impact: { manpower: 1, munitions: 0, will: -2 },
        setFlags: { bef_backs: "withdrew" },
        next: "bef_1918_20_hundreddays",
        outcome:
          "Speculative. The army falls back in Flanders to a line nearer the coast, " +
          "giving up the ground that was taken at so great a cost in 1917. The line " +
          "is shorter and fewer men are needed to hold it. The Germans reach the " +
          "ground that the Third Battle of Ypres was fought to win, and the ports lie " +
          "within gun range of a line that has not been tested.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1918-09
  bef_1918_20_hundreddays: {
    year: 1918, date: "1918-09-01", city: "Montreuil",
    title: "The Cabinet Grows Anxious",
    advisors: ["haig", "wilson", "rawlinson"],
    bulletin: {
      voice: "bef", date: "1918-08-30", source: "Communiqué of General Headquarters",
      text:
        "Our troops have made progress east of Bapaume and north of the Somme. " +
        "Prisoners to the number of several thousand have been taken in the " +
        "past week.",
    },
    situation: (flags) =>
      "Since the attack at Amiens on 8 August the British armies have been advancing " +
      "almost without a pause. " +
      (flags.bef_doullens === "foch"
        ? "Foch directs the whole front, and his plan is for a series of attacks that will not let the Germans rest."
        : "The French and British commanders are coordinating the advance by agreement.") +
      "\n\nOn 31 August Henry Wilson sent Haig a personal telegram, warning him against " +
      "taking unnecessary losses in storming the Hindenburg Line. The War Cabinet, he " +
      "said, would become anxious if the army suffered heavy punishment in attacking it " +
      "without success. The Cabinet is also worried about keeping troops at home, " +
      "because of a police strike.",
    context:
      "To pause is to give the Germans time to fall back and consolidate behind the " +
      "strongest line on the front. To go on is to attack the Hindenburg Line against " +
      "the wishes of the Cabinet that the army serves.",
    choices: [
      {
        id: "attack",
        label: "Go on attacking, and prepare the assault on the Hindenburg Line",
        historical: true,
        advisor: { name: "Haig", position:
          "To stop now would cost more than to go on. The enemy has to be given no time to settle behind the Hindenburg Line." },
        attested: { by: "Haig", text: "wretched lot",
          source: "Haig on the War Cabinet, in reply to Wilson, 1 September 1918" },
        impact: { manpower: -1, munitions: -1, will: -1 },
        setFlags: { bef_hundreddays: "attacked" },
        erodes: "defy_authority",
        dispute:
          "How far the Hundred Days were won by the British army, and how far by the " +
          "whole weight of the coalition and the collapse of the German army, is " +
          "argued. The British armies took a very large share of the prisoners and the " +
          "guns. Their critics say that the German army was already beaten when the " +
          "attacks of September began.",
        next: "bef_1918_21_armistice",
        outcome:
          "Haig answers Wilson the next day, calling the War Cabinet a wretched lot, and " +
          "argues that attacking the Germans now will cost less than letting them " +
          "consolidate. Byng, Horne and Rawlinson all agree. On 29 September the British " +
          "Fourth Army and the French First attack across the Saint-Quentin canal and " +
          "break the Hindenburg Line. The Cabinet's anxiety has been set aside, and is not " +
          "vindicated by what follows.",
      },
      {
        id: "pause",
        label: "Heed the Cabinet and halt the attacks while the army is rested",
        advisor: { name: "Henry Wilson", position:
          "The Cabinet does not want the army to take heavy losses attacking the Hindenburg Line without success. A pause would give time to prepare." },
        gate: (m) => m.will >= -2,
        disabledReason: "Foch has ordered the attacks to go on",
        attested: { by: "Wilson", text: "the war cabinet would become anxious",
          source: "Telegram to Haig, 31 August 1918" },
        impact: { manpower: 1, munitions: 1, will: 1 },
        setFlags: { bef_hundreddays: "paused" },
        next: "bef_1918_21_armistice",
        outcome:
          "Speculative. The attacks are halted for some weeks and the army rests, and " +
          "the Cabinet is relieved. The Germans use the time to reach the Hindenburg " +
          "Line and settle behind it. The assault on it, when it comes, comes against a " +
          "line that is held, with the winter near. Foch, who has ordered the attacks " +
          "to go on, has to be told that the British are not going to attack, and has " +
          "to decide what to make of the news.",
      },
    ],
  },

  // ---------------------------------------------------------------- 1918-10
  bef_1918_21_armistice: {
    year: 1918, date: "1918-10-19", city: "London",
    title: "What to Ask For",
    advisors: ["lloydgeorge", "haig", "milner"],
    situation:
      "The Germans have asked President Wilson for an armistice, and the Allied " +
      "governments are asking their commanders what the armies would need. Haig has " +
      "been asked by the War Cabinet what terms he would advise.\n\n" +
      "His view is that the German army is far from beaten. It has retreated in order " +
      "and has fought hard, and its command still has men and guns. The French and " +
      "the Americans, he believes, are asking for more than the Germans will " +
      "accept. His advice is moderate.",
    context:
      "Terms that are too hard will be refused and the war will go on into the winter. " +
      "Terms that are too soft will be called a betrayal by the people who have " +
      "carried it for four years, and a pause for the German army to recover in.",
    choices: [
      {
        id: "moderate",
        label: "Advise moderation: terms the German army can accept, and no more",
        historical: true,
        advisor: { name: "Haig", position:
          "The German army is not beaten, and a peace that asks for more than it will give will not be signed. It is better to take what is offered." },
        impact: { manpower: 0, munitions: 0, will: 0 },
        setFlags: { bef_armistice: "moderate" },
        nextIf: (m, flags) =>
          m.will <= -6 ? "bef_end_haigsacked"
          : flags.bef_evacuate === "stayed" ? "bef_end_easterners"
          : (flags.bef_somme === "bitehold" && flags.bef_ypres3 === "vetoed") ? "bef_end_bitehold"
          : flags.bef_reserve === "complied" ? "bef_end_reserve"
          : flags.bef_conscription === "voluntary" ? "bef_end_volunteers"
          : null,
        next: "bef_end_victory",
        outcome:
          "Haig tells the War Cabinet on 19 October that the German army is far from " +
          "beaten, and urges moderation. At Senlis, on 25 October, Foch asks the " +
          "commanders for their views, and then, with Clemenceau's agreement, makes his " +
          "own list of terms, which includes the occupation of the Rhine bridgeheads. " +
          "The British government accepts what the Allies decide.",
      },
      {
        id: "hard",
        label: "Support the harder terms the French and Americans want",
        advisor: { name: "Lloyd George", position:
          "The Germans must be left unable to resume the war. A line on the Rhine would do that." },
        impact: { manpower: 0, munitions: 0, will: 1 },
        setFlags: { bef_armistice: "hard" },
        nextIf: (m, flags) =>
          m.will <= -6 ? "bef_end_haigsacked"
          : flags.bef_evacuate === "stayed" ? "bef_end_easterners"
          : (flags.bef_somme === "bitehold" && flags.bef_ypres3 === "vetoed") ? "bef_end_bitehold"
          : flags.bef_reserve === "complied" ? "bef_end_reserve"
          : flags.bef_conscription === "voluntary" ? "bef_end_volunteers"
          : null,
        next: "bef_end_victory",
        outcome:
          "Speculative. The British government joins the French and the Americans in " +
          "asking for terms that leave the German army unable to resume the war. The " +
          "armistice is harder to sign, and it is signed. The Commander-in-Chief has " +
          "given his advice and been overruled, and the army that he commanded is " +
          "asked to occupy the ground that the terms require.",
      },
    ],
  },

  // ---------------------------------------------------------------- endings
  bef_end_victory: {
    year: 1918, date: "1918-11-11", city: "London",
    title: "The Hundred Days",
    advisors: ["haig", "lloydgeorge"],
    situation:
      "The armistice comes into force at eleven in the morning. The British armies, " +
      "which began the year holding the longest line in France and short of men, have " +
      "ended it advancing on a broad front, with a large share of the prisoners and guns " +
      "taken since August to their credit.\n\n" +
      "The army that landed in August 1914 has been replaced several times over, and " +
      "the Cabinet that sent it has been replaced twice. The argument between the " +
      "generals and the politicians is not over, and will be carried on in print for " +
      "the next twenty years.",
    ending: { family: "victory-and-an-argument", badge: BADGES.SETTLED },
    epilogue: (flags) =>
      "Landing, August 1914: " + (flags.bef_landing === "amiens" ? "assembled at Amiens." : "assembled at Maubeuge.") + "\n" +
      "The Seine, September 1914: " + (flags.bef_seine === "withdrew" ? "the army withdrew to refit." : "the army kept to the line.") + "\n" +
      "Ypres, 1914: " + (flags.bef_ypres === "withdrew" ? "the line was shortened toward the coast." : "the line was held.") + "\n" +
      "The Dardanelles, March 1915: " + (flags.bef_dardanelles === "navy" ? "left to the Navy." : "the 29th Division released.") + "\n" +
      "The shortage of shells: " + (flags.bef_shells === "private" ? "kept inside the army." : "told to the press.") + "\n" +
      "Loos: " + (flags.bef_loos === "refused" ? "the ground was refused." : flags.bef_reserves === "released" ? "attacked, with the reserve close behind." : "attacked, with the reserve held back" + (flags.bef_reservesResult === "stopped" ? ", and stopped by the second line." : ", and arriving too late.")) + "\n" +
      "Gallipoli, November 1915: " + (flags.bef_evacuate === "stayed" ? "reinforced." : "evacuated.") + "\n" +
      "December 1915: " + (flags.bef_succession === "french" ? "French kept for the winter." : "Haig appointed.") + "\n" +
      "1916: " + (flags.bef_conscription === "voluntary" ? "the voluntary system kept." : "compulsion for single men.") + "\n" +
      "The Somme: " + (flags.bef_somme === "bitehold" ? "limited advances only." : flags.bef_sommeResult === "gain" ? "a compromise plan, with larger first-day gains than the record shows." : "a compromise plan, and a costly first day.") + "\n" +
      "The tanks: " + (flags.bef_tanks === "held" ? "held back." : flags.bef_tanksResult === "lessons" ? "used on 15 September, to the lasting benefit of the staff." : "used on 15 September, and the surprise spent.") + "\n" +
      "Calais, February 1917: " + (flags.bef_calais === "refused" ? "the subordination refused." : "accepted under protest.") + "\n" +
      "Convoy: " + (flags.bef_convoy === "delayed" ? "left to patrols." : "tried from May 1917.") + "\n" +
      "Flanders, 1917: " + (flags.bef_ypres3 === "vetoed" ? "vetoed." : "authorised.") + "\n" +
      "January 1918: " + (flags.bef_manpower === "refused" ? "the extension of the line refused." : "the line extended to Barisis.") + "\n" +
      "The general reserve: " + (flags.bef_reserve === "complied" ? "divisions given." : "refused.") + "\n" +
      "Doullens: " + (flags.bef_doullens === "national" ? "national command kept." : "Foch accepted to coordinate.") + "\n" +
      "April 1918: " + (flags.bef_backs === "withdrew" ? "a withdrawal in Flanders authorised." : "an order that there be no retirement.") + "\n" +
      "September 1918: " + (flags.bef_hundreddays === "paused" ? "the attacks paused." : "the attacks continued against the Hindenburg Line.") + "\n" +
      "The armistice terms: " + (flags.bef_armistice === "hard" ? "the harder terms supported." : "moderation advised.") + "\n\n" +
      "What actually happened: The armistice came into force at eleven o'clock on 11 November 1918. The British Army had lost some 673,000 dead and missing in the war, and 1.6 million wounded. Haig was made an earl, and Lloyd George won an election in December. The quarrel over Passchendaele, the manpower of 1918 and the Somme became part of the national memory of the war.",
  },

  bef_end_ports: {
    year: 1918, date: "1918-04-04", city: "Montreuil",
    title: "The Ports",
    advisors: ["haig"],
    situation:
      "The two armies went on consulting and agreeing while the German attack went " +
      "on. The British fell back toward the ports, which were their supply, and the French " +
      "fell back toward Paris, which was their capital, and the gap between them " +
      "widened with every day that the two staffs spent in agreeing about it.\n\n" +
      "Neither army was beaten. The ground between them was, and it was ground that " +
      "neither was willing to be responsible for.",
    ending: { family: "coalition-fracture", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. Unified command was accepted in the same week at Doullens, with " +
      "the British Prime Minister's representative present, and for the very reason " +
      "that this ending describes. Everyone concerned could see what the " +
      "alternative was. What actually happened: Foch was given the coordination of " +
      "the Allied armies on 26 March 1918 and the title of Commander-in-Chief of " +
      "the Allied armies in April, and the line held in front of Amiens. The " +
      "Germans' offensive on the Lys, in April, was held short of the ports. The " +
      "two retreats of this ending did not take place. The Allied front was never " +
      "so close to splitting as it was in the last week of March, and the " +
      "arrangement made at Doullens was a pragmatic one, which survived because it " +
      "worked. Haig accepted Foch's coordination and found that it cost him little.",
  },

  bef_end_haigsacked: {
    year: 1918, date: "1918-10-24", city: "London",
    title: "The Prime Minister Chooses",
    advisors: ["lloydgeorge"],
    situation:
      "The Prime Minister had been looking for a way to be rid of the Commander-in-Chief " +
      "since the autumn of 1917, and had been told each time that it was not the moment. " +
      "The Cabinet's account of what the army had been given and what it had done with it " +
      "was now a matter of record, and his political capital was spent.\n\n" +
      "The government falls, or the Commander-in-Chief does. In this version it is " +
      "the Commander-in-Chief.",
    ending: { family: "civil-authority-prevails", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. Lloyd George considered replacing Haig more than once and never " +
      "did it. What actually happened: the Prime Minister's distrust of the " +
      "Commander-in-Chief lasted to the end of the war, and he gave Robertson's " +
      "post to Wilson and made the Supreme War Council at Versailles, but Haig was " +
      "never dismissed. Haig remained in command to the armistice. After the war " +
      "Haig was given a peerage and £100,000, while Lloyd George's memoirs spent a " +
      "great many pages on the generals. The Prime Minister's quarrel with the " +
      "generals was carried on in the Maurice debate of May 1918, in which he was " +
      "accused of misleading the House about the army's strength, and he won it. It " +
      "left him with the government and Haig with the army, and neither forgave the " +
      "other.",
  },

  bef_end_shipping: {
    year: 1917, date: "1917-08-30", city: "London",
    title: "A Winter's Wheat",
    advisors: ["lloydgeorge"],
    situation:
      "The convoy was tried late, and by then the stock of wheat in the country was " +
      "down to a few weeks. Food was rationed by the voluntary scheme, and then by " +
      "a compulsory one, and the Cabinet found itself discussing the arithmetic of " +
      "shipping tonnage in the place of the strategy of the war.\n\n" +
      "The army was kept at its strength in France, and the country that fed it was " +
      "being asked to eat less.",
    ending: { family: "shipping-crisis-deepens", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. Convoy was tried in May 1917, and losses fell through the " +
      "summer. What actually happened: the first convoy left Gibraltar on 10 May " +
      "and arrived twelve days later; the system was extended to the Atlantic " +
      "trade, and by the end of the year the monthly losses were a fraction of " +
      "April's. Food was rationed in 1918 and the country was never close to " +
      "starvation. The delay that this ending supposes would have cost a good many " +
      "ships and a good deal of the Cabinet's confidence in the Admiralty. " +
      "Britain's wheat reserves were low in the spring of 1917, and the margin was " +
      "a matter of weeks. The Cabinet's anxiety was real, and the decision that " +
      "relieved it was taken by the Admiralty and the Prime Minister at about the " +
      "same time, for reasons that the two men afterwards gave differently.",
  },

  bef_end_easterners: {
    year: 1918, date: "1918-11-11", city: "London",
    title: "Another Front",
    advisors: ["churchill"],
    situation:
      "The army stayed at Gallipoli through the winter and was reinforced from " +
      "the divisions that would have gone to France. The campaign in the East became " +
      "the second front of the war for Britain, and the Western Front was held with " +
      "what the Eastern one left over.\n\n" +
      "When the end came it was in France, as it was always going to be, and the " +
      "armies that finished it were smaller than they might have been.",
    ending: { family: "the-other-strategy", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. The Cabinet voted to evacuate Gallipoli, and did so with very " +
      "small loss. What actually happened: the evacuation of Anzac and Suvla was " +
      "completed on 20 December 1915 and of Helles on 8 and 9 January 1916, after " +
      "which the troops went to Egypt and to France. The Gallipoli campaign cost " +
      "about a quarter of a million casualties on each side, and the argument about " +
      "whether another strategy could have succeeded began in 1915 and is not " +
      "settled. The argument between the men who wanted to win the war in France " +
      "and those who wanted a different front was never settled by the result. " +
      "Churchill and Lloyd George held the second view and Robertson and Haig the " +
      "first, and both sides could point to something that supported them.",
  },

  bef_end_bitehold: {
    year: 1918, date: "1918-11-11", city: "London",
    title: "Smaller Battles",
    advisors: ["rawlinson"],
    situation:
      "The Somme was fought as a series of limited advances, and Flanders was not " +
      "fought at all. The army that came to the spring of 1918 was stronger than the " +
      "one that did, and the Prime Minister had less to hold against the " +
      "Commander-in-Chief.\n\n" +
      "The war ended in the same month. It cost fewer lives to get there.",
    ending: { family: "attrition-without-the-great-battles", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. Rawlinson's plan for the Somme was a series of limited " +
      "advances, and it was modified by Haig. What actually happened: the battle " +
      "began on 1 July 1916 with 57,000 casualties on the first day, nearly 20,000 " +
      "of them dead, and went on until November. The Third Battle of Ypres ran from " +
      "31 July to 10 November 1917. The army's casualty figures for those two " +
      "campaigns are among the most argued about in British history, and the " +
      "counterfactual in this ending is the one that critics of Haig have been " +
      "proposing since. Rawlinson's own method, which he applied at Amiens in " +
      "August 1918 with tanks and aircraft and a great weight of guns, was a series " +
      "of bites with the pauses reduced, and was the method by which the Hundred " +
      "Days were fought. Whether it could have been used earlier is the question " +
      "the critics ask.",
  },

  bef_end_reserve: {
    year: 1918, date: "1918-11-11", city: "London",
    title: "A Reserve for the Whole Front",
    advisors: ["wilson"],
    situation:
      "The general reserve was formed, under Foch's committee at Versailles, and it " +
      "was there on 21 March. Divisions were moved to the threatened sector within " +
      "days, and the German attack met a line that had a second line behind it.\n\n" +
      "The British army had given up men that it was short of, and the Commander-in-Chief " +
      "had lost an argument with the Prime Minister. The war ended in November.",
    ending: { family: "unified-reserve", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. The general reserve was proposed by the Supreme War Council and " +
      "defeated by Haig, Petain and Clemenceau. What actually happened: Robertson, " +
      "who opposed it, was forced to resign on 11 February 1918 and replaced by " +
      "Wilson. In the first days of March Haig refused to carry out the order. " +
      "After the German offensive began on 21 March, Foch was given the " +
      "coordination of the reserves at Doullens, which did what the general reserve " +
      "was meant to do. Foch's coordination of the reserves after Doullens, and the " +
      "transfer of French divisions to the British front in the spring, did in " +
      "practice what the general reserve had been meant to do, and the Supreme War " +
      "Council's committee at Versailles was never again the centre of Allied " +
      "strategy.",
  },

  bef_end_volunteers: {
    year: 1918, date: "1918-11-11", city: "London",
    title: "An Army of Volunteers",
    advisors: ["lloydgeorge"],
    situation:
      "The voluntary system was kept. The Derby scheme was extended and the " +
      "recruiting posters were reprinted, and the army at the front was kept " +
      "up to strength by the men who came forward.\n\n" +
      "It was a smaller army. The Cabinet had kept the peace with the Labour " +
      "movement, and the army had paid the price in the summer of 1916.",
    ending: { family: "no-conscription", badge: BADGES.SPECULATIVE },
    epilogue: () =>
      "Speculative. The Military Service Act was passed in January 1916, and a " +
      "second in May extended it to married men. What actually happened: the Act " +
      "received the royal assent on 27 January and came into force on 17 February; " +
      "thirty-five Liberals voted against it, and the Home Secretary, Sir John " +
      "Simon, resigned. A third Act in 1918 raised the upper age to fifty-one. " +
      "Without compulsion the army could not have been kept up to the strength that " +
      "the war required. Britain was the only one of the great powers to fight the " +
      "first two years of the war without conscription. The army that the voluntary " +
      "system produced, the largest ever raised in Britain, was the army that " +
      "fought on the Somme, and its losses there were what made compulsion " +
      "unavoidable.",
  },

  bef_end_relieved: {
    year: 1918, date: "1918-05-01", city: "London",
    title: "The Cabinet Decides",
    advisors: ["lloydgeorge"],
    situation:
      "There is no single act that did this. There is a file, and in it a Commander-in-Chief " +
      "who had told the press what the Cabinet had not, refused an order of the " +
      "Supreme War Council, and attacked against the Cabinet's anxiety and its wishes. " +
      "Each one could be defended, and the sum of them could not.\n\n" +
      "The Prime Minister decides that it is the moment, and the Commander-in-Chief is " +
      "told that he is to hand over.",
    ending: { family: "hard-mode-relieved", badge: BADGES.CONTESTED, hardModeOnly: true },
    epilogue: () =>
      "What actually happened: Lloyd George wanted to be rid of Haig and did not do " +
      "it. He removed Robertson in February 1918 and Jellicoe in December 1917, but " +
      "kept Haig through the German offensive and the Hundred Days. Haig remained " +
      "in command until the armistice and was made an earl in 1919. The order to " +
      "relieve him is the one that this office could have given, and the one that " +
      "was never given. The Commander-in-Chief's position was never as secure as it " +
      "appeared, and the Prime Minister's power to remove him was not in doubt. " +
      "What kept Haig in command was the Cabinet's own sense that it could not " +
      "afford a crisis with the German offensive about to come and the army behind " +
      "him.",
  },
};
