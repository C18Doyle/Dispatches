// =============================================================================
// THE BRIEFINGS, THE HOW TO, AND THE CALENDAR
// =============================================================================
//
// What a player is told before a file opens: which command this is, a quotation from the day, where it stands on the first day, what seat they hold
// and what they are first asked (BRIEFINGS, shown by the briefing screen in 91-menu-screens.jsx); how the game works and what it leaves out (HOW_TO, the
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
    quote: { text: "You will be home before the leaves have fallen from the trees.", by: "Kaiser Wilhelm II, August 1914 (attributed)" },
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
    quote: { text: "France will be heroically defended by all her sons, whose sacred union in the face of the enemy nothing will break.", by: "President Poincare, message to Parliament, 4 August 1914" },
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
    quote: { text: "Let Russia, rising like one man, repel the insolent assault of the enemy.", by: "Nicholas II, manifesto of 2 August 1914" },
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
    quote: { text: "The lamps are going out all over Europe; we shall not see them lit again in our lifetime.", by: "Sir Edward Grey, 3 August 1914, as he recalled it" },
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
    quote: { text: "I have examined and weighed everything, and with a serene conscience I set out on the path to which my duty points.", by: "Franz Joseph, To My Peoples, 28 July 1914" },
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
    quote: { text: "The Imperial Ottoman Government has decided to observe strict neutrality in the European conflict now being waged.", by: "Ottoman note to the United States, 8 August 1914" },
    standing: [
      "The empire has lost Libya and nearly all its European provinces in the wars of 1911 to 1913. It is poor, thinly industrialised, short of railways and short of trained officers. It has signed a secret alliance with Germany and is, for the moment, neutral.",
      "Two German warships, the Goeben and the Breslau, are at the mouth of the Dardanelles and have asked to be let in.",
    ],
    seat: "You hold the seat of the war ministry and general staff: Enver Pasha when the file opens, and Ahmed Izzet Pasha at the end. You share power with a small group of politicians of the Committee of Union and Progress and with a German military mission, and you serve a Sultan who reigns and does not rule. The Rumi calendar of the General Staff is converted: this game gives every date in the Western one.",
    question: "Whether to open the Straits to the two German ships.",
  },
};

/** The sections of the How to play screen, kept short: { id, title, paras }. What the game leaves out (LEAVES_OUT) follows them on the screen. */
export const HOW_TO = [
  {
    id: "game",
    title: "What you do",
    paras: [
      "A file opens on a real day in 1914. Each report puts a decision to a headquarters of the First World War and you give the order. Orders cost manpower, munitions or the will to go on, and the file ends in one of the endings the command could have had.",
    ],
  },
  {
    id: "report",
    title: "Reading a report",
    paras: [
      "A report gives the date and place, the situation, a map and the orders. Press a meter to see what it is made of. Open the map to see the whole theatre and what the other commands were doing that week.",
      "Some reports list what the staff believes. You can check a few of those beliefs in each file, though the staff will not agree about what a check shows.",
    ],
  },
  {
    id: "orders",
    title: "Orders and risk",
    paras: [
      "Some orders do what they say. Others are contested: the result is rolled and the odds are shown in words. An outcome that begins Speculative is an alternative the game has modelled, not what happened.",
    ],
  },
  {
    id: "advisers",
    title: "Advisers and battles",
    paras: [
      "An order may carry an adviser's argument. An adviser who is overruled too often goes quiet and then asks to be relieved. Some contested orders open an Order of Battle, where you place your counters and may move some of them on the second day. You can switch the planning off when you set up a file.",
    ],
  },
  {
    id: "modes",
    title: "Modes",
    paras: [
      "Easy shows what each order does and lets you take back the last one. Hard adds a track for the pressure on the command. A file in progress is kept on this device.",
    ],
  },
  {
    id: "calendar",
    title: "Dates and endings",
    paras: [
      "Dates are in the Western calendar, written as in the United Kingdom, whatever the command used at the time. A file closes on an ending, a rank, and a card that you can copy or save.",
    ],
  },
];
