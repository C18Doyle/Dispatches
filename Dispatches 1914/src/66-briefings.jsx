// =============================================================================
// THE BRIEFINGS, THE HOW TO, AND THE CALENDAR
// =============================================================================
//
// What a player is told before a file opens: which command this is, where it stands on the first day, what seat they hold and what they are
// about to be asked (BRIEFINGS, shown by the briefing screen in 91-menu-screens.jsx); how the game works and what it leaves out (HOW_TO, the
// How to play screen); and the one calendar the whole game is written to. check-briefings.js enforces the shape and the style.
//
// THE CALENDAR. Every date shown is a date in the Western (Gregorian) calendar, written as it is in the United Kingdom: 4 August 1914. The
// Russian command's own dates stay Old Style in its data (thirteen days behind until February 1918) and are converted by mapDate(); the Ottoman
// command's are Western already. A date in the prose of a report may name the Old Style date once, as a note.
// =============================================================================

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** "1914-08-04" as the UK writes it: "4 August 1914". A month alone ("1914-08") reads "August 1914". */
export function ukDate(iso, short = false) {
  const m = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(String(iso || ""));
  if (!m) return "";
  const name = MONTHS[Number(m[2]) - 1];
  const month = short ? name.slice(0, 3) : name;
  return m[3] ? `${Number(m[3])} ${month} ${m[1]}` : `${month} ${m[1]}`;
}

/** A node's date as it is shown: the Western date, in the UK form. */
export function nodeDate(campaignId, iso, short = false) {
  return ukDate(mapDate(campaignId, iso), short);
}

export const BRIEFINGS = {
  ohl: {
    nation: "Germany",
    title: "German Supreme Army Command",
    side: "central",
    pitch: "Carry out the plan that has to win in weeks, then decide what a longer war is for.",
    standing: [
      "Germany is at war with France and Russia, and from 4 August with Britain. The army has one plan for a war on two fronts and has rehearsed little else: beat France in a few weeks by a wide march through Belgium, then send the armies east by rail before Russia is ready. Every railway timetable in the country is written around it.",
      "The plan leaves little room to change course once the trains are running. Belgium's neutrality is guaranteed by treaty, and Britain is one of the guarantors.",
    ],
    seat: "You hold the seat of the Chief of the General Staff, whoever sits in it: Moltke when the file opens, Falkenhayn after him, and from 1916 Hindenburg and Ludendorff. The army is the Kaiser's to command and he leaves its running to the staff. You advise the Chancellor on what the army can do, and you reach the army commanders only by wireless, telephone and the officers you send.",
    question: "How strong the right wing must be, and what to do about Lorraine.",
  },
  gqg: {
    nation: "France",
    title: "French General Headquarters",
    side: "entente",
    pitch: "Win by attacking, or learn in the first fortnight what attacking costs.",
    standing: [
      "France mobilised on 1 August and Germany declared war on 3 August. The army's Plan XVII sends its armies at the German frontier in Lorraine and towards the Ardennes, to recover the provinces lost in 1871. It rests on a doctrine of the offensive that shapes the army's training, its tactics and its officers' careers.",
      "France is bound to Russia, which has promised to take the field within weeks, and to Britain, whose small army is crossing the Channel. Neither can be commanded from Vitry.",
    ],
    seat: "You hold the seat of the Commander-in-Chief of the armies of the north-east: Joffre when the file opens, Nivelle from December 1916 and Petain from May 1917. The government in Paris keeps the right to remove a general, and it uses it. The army commanders are strong men, and you hold them by the confidence you can keep.",
    question: "Whether to go on attacking along the frontier when the first reports say the German right is very strong.",
  },
  stavka: {
    nation: "Russia",
    title: "Russian Supreme Command",
    side: "entente",
    pitch: "Hold the longest front in Europe together, and see whether a creaking state outlasts the war.",
    standing: [
      "Russia has the largest army in Europe on paper and far fewer railways than its enemies to move it by. It mobilised at the end of July. By treaty, and by years of French loans, it is committed to attack Germany quickly, before its own concentration is finished.",
      "Its enemies are Germany in the north and Austria-Hungary in the south, and the front between the Baltic and the Carpathians is too long to be held everywhere.",
    ],
    seat: "You hold the seat of the Supreme Command, whoever sits in it: the Grand Duke Nicholas when the file opens, the Tsar himself from September 1915, and after the revolution of 1917 the Provisional Government's command. The ministries are behind you and the court is above you; they do not always agree about what the army has. Russia's own calendar runs thirteen days behind the West's until February 1918, and this game gives every date in the Western one.",
    question: "Whether to invade East Prussia now, before the concentration is finished.",
  },
  bef: {
    nation: "Britain",
    title: "British Army and War Cabinet",
    side: "entente",
    pitch: "Raise a great army from a small one, and decide where to spend it.",
    standing: [
      "Britain declared war on Germany on 4 August, over the invasion of Belgium. Its strength is the fleet, its money and its empire. Its army is small, professional and spread across the world, and it has promised to send a force to fight beside the French.",
      "The government has no plan for a long war, and the country has never raised a mass army without conscription. The army that fights from 1916 will not be the army that lands in 1914.",
    ],
    seat: "You hold the seat that joins field command and the Cabinet: the generals who command the force (Sir John French, then Sir Douglas Haig) and the ministers who decide what they are given (Asquith and Kitchener, then Lloyd George). Each wants something different from the army, and the French want a fourth thing.",
    question: "Where the first four divisions and the cavalry are to assemble.",
  },
  aok: {
    nation: "Austria-Hungary",
    title: "Austro-Hungarian Army High Command",
    side: "central",
    pitch: "Hold together an empire of many peoples through a war it started.",
    standing: [
      "The monarchy declared war on Serbia on 28 July, after the assassination at Sarajevo. Russia's mobilisation has made it a war on two fronts. The army is short of guns and railways for the war it has planned, and it is made up of soldiers of many nationalities who speak many languages.",
      "Its plan divides the army in three: a group for Serbia, a larger one in Galicia for Russia, and a swing force that can go to either. Everything depends on Germany keeping its promise to engage Russia.",
    ],
    seat: "You hold the seat of the Chief of the General Staff: Conrad von Hotzendorf when the file opens, and Arz von Straussenburg after him. The Emperor Franz Joseph, who is eighty-four, is above you, the Austrian and Hungarian governments behind you, and the German ally beside you, and none of them has the same war in mind.",
    question: "Where the swing force is to go first.",
  },
  otto: {
    nation: "The Ottoman Empire",
    title: "Ottoman General Staff",
    side: "central",
    pitch: "Decide whether a poor empire can survive a world war, and what it will pay to try.",
    standing: [
      "The empire has lost Libya and nearly all its European provinces in the wars of 1911 to 1913. It is poor, thinly industrialised, short of railways and short of trained officers. It has signed a secret alliance with Germany and is, for the moment, neutral.",
      "Two German warships, the Goeben and the Breslau, are at the mouth of the Dardanelles and have asked to be let in.",
    ],
    seat: "You hold the seat of the war ministry and general staff: Enver Pasha when the file opens, and Ahmed Izzet Pasha at the end. You share power with a small group of politicians of the Committee of Union and Progress and with a German military mission, and you serve a Sultan who reigns and does not rule. The Rumi calendar of the General Staff is converted: this game gives every date in the Western one.",
    question: "Whether to open the Straits to the two German ships.",
  },
};

/** The sections of the How to play screen: { id, title, paras }. The last is the list of what the game leaves out (LEAVES_OUT). */
export const HOW_TO = [
  {
    id: "game",
    title: "What you are doing",
    paras: [
      "You sit at a headquarters of the First World War. A file opens on a real day in 1914, and from then on a report arrives whenever the command had a decision to make: where the army was to assemble, whether an attack was to go on, whether a general was to be dismissed. You read it, and you give an order.",
      "Each order has a cost, and the costs are kept in three meters. Most reports end in a historical order, the one the command gave, and one or two that it did not. A file ends in one of the endings its command could have had, from the armistice of 1918 to an earlier collapse.",
    ],
  },
  {
    id: "report",
    title: "Reading a report",
    paras: [
      "A report gives the date and the place, then the decision in a single line, with a button that goes straight to the orders. Below that are the map, any bulletin that came over the wire, the situation, the context, the three meters, and the orders.",
      "Press a meter to see what it is made of. The map can be opened to the whole theatre, with a list of what the other commands were doing the same week.",
    ],
  },
  {
    id: "orders",
    title: "Orders and risk",
    paras: [
      "Some orders are certain: they do what they say. Others are contested: the order is given and the result is rolled. The odds are shown in words (Long odds, Against us, Even, Favourable, Strong) and a contested order is signed by holding the button for a moment. A sealed cable then carries the result, and you break the seal.",
      "An order that is not the one the command gave begins its outcome with the word Speculative. It is a modelled alternative: the game states what happened in fact whenever the two differ.",
    ],
  },
  {
    id: "battles",
    title: "Battles",
    paras: [
      "Some contested orders open an Order of Battle. You name a commander, choose an approach and place your counters, and the staff's plan is always one press away. The odds you see are the odds of the plan on what the intelligence says the enemy has; the enemy may have something else. The result is graded, and the next report says how the battle was fought.",
      "You can switch the planning off when you set up a file, and every battle is then rolled at the odds of the staff's plan.",
    ],
  },
  {
    id: "modes",
    title: "Easy, Standard and Hard",
    paras: [
      "Easy mode shows what each order will do to the meters, marks the order the command really gave, and lets you take back the last order. It cannot reach the highest rank.",
      "Standard mode shows nothing in advance. Hard mode adds an erosion track particular to each command: the pressure its office was under. At the limit, your freedom to choose ends and a fixed ending follows.",
    ],
  },
  {
    id: "ends",
    title: "Endings, rank and the war record",
    paras: [
      "A file closes on an ending, stamped as the record, a near thing, or not as it happened. The command rank is given for the file as a whole, and a card of the file can be copied, saved as a picture or printed. A file in progress is kept on this device, and the war record (dossiers, atlas, endings, battles) is kept with it. Nothing leaves your device.",
    ],
  },
  {
    id: "calendar",
    title: "Dates",
    paras: [
      "Every date in the game is a date in the Western calendar, written as it is in the United Kingdom: 4 August 1914. Russia kept the Julian calendar, thirteen days behind, until February 1918, and the Ottoman state its own Rumi reckoning; those commands' dates are converted, and a report mentions the original date once where it matters.",
    ],
  },
];
