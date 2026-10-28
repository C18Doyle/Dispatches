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
    modes: { easy: "Big Bertha", hard: "The Pickelhaube" },
    title: "German Supreme Army Command",
    side: "central",
    quote: { text: "You will be home before the leaves have fallen from the trees.", by: "Kaiser Wilhelm II" },
    standing: [
      "Germany is at war with France and Russia, and from 4 August with Britain. The army has one plan for a war on two fronts and has rehearsed little else: beat France in a few weeks by a wide march through Belgium, then send the armies east by rail before Russia is ready. Every railway timetable in the country is written around it.",
      "The plan leaves little room to change course once the trains are running. Belgium's neutrality is guaranteed by treaty, and Britain is one of the guarantors.",
    ],
    seat: "You hold the seat of the Chief of the General Staff, and Moltke sits in it. Seven armies stand in the west, three of them massed on the right wing, and the Eighth stands alone in East Prussia. The Kaiser leaves the running of the army to the staff, and you reach the commanders only by wireless, telephone and the officers you send.",
  },
  gqg: {
    nation: "France",
    modes: { easy: "The Soixante-Quinze", hard: "The Red Trousers" },
    title: "French General Headquarters",
    side: "entente",
    quote: { text: "France will be heroically defended by all her sons, whose sacred union in the face of the enemy nothing will break.", by: "President Poincaré" },
    standing: [
      "France mobilised on 1 August and Germany declared war on 3 August. The army's Plan XVII sends its armies at the German frontier in Lorraine and towards the Ardennes, to recover the provinces lost in 1871. It rests on a doctrine of the offensive that shapes the army's training, its tactics and its officers' careers.",
      "France is bound to Russia, which has promised to take the field within weeks, and to Britain, whose small army is crossing the Channel. Neither can be commanded from Vitry.",
    ],
    seat: "You hold the seat of the Commander-in-Chief of the armies of the north-east, and Joffre sits in it. Five armies stand along the frontier from the Vosges to the Belgian border, with the cavalry and the reserve divisions behind them, and the British are still crossing the Channel. The government in Paris keeps the right to remove a general, and uses it.",
  },
  stavka: {
    nation: "Russia",
    modes: { easy: "The Ilya Muromets", hard: "The Shared Rifle" },
    title: "Russian Supreme Command",
    side: "entente",
    quote: { text: "Let Russia, rising like one man, repel the insolent assault of the enemy.", by: "Tsar Nicholas II" },
    standing: [
      "Russia has the largest army in Europe on paper and far fewer railways than its enemies to move it by. It mobilised at the end of July. By treaty, and by years of French loans, it is committed to attack Germany quickly, before its own concentration is finished.",
      "Its enemies are Germany in the north and Austria-Hungary in the south, and the front between the Baltic and the Carpathians is too long to be held everywhere.",
    ],
    seat: "You hold the seat of the Supreme Command, and the Grand Duke Nicholas sits in it. A peacetime army of about 1.3 million is being swollen by mobilisation towards 4.5 million, in a North-West Front facing Germany and a South-West Front facing Austria-Hungary.",
  },
  bef: {
    nation: "Britain",
    modes: { easy: "The Lee-Enfield", hard: "The Mark I" },
    title: "British Army and War Cabinet",
    side: "entente",
    quote: { text: "The lamps are going out all over Europe; we shall not see them lit again in our lifetime.", by: "Sir Edward Grey" },
    standing: [
      "Britain declared war on Germany on 4 August, over the invasion of Belgium. Its strength is the fleet, its money and its empire. Its army is small, professional and spread across the world, and it has promised to send a force to fight beside the French.",
      "The government has no plan for a long war, and the country has never raised a mass army without conscription.",
    ],
    seat: "You hold the seat that joins field command and the Cabinet: Sir John French commands the force, and Asquith and Kitchener decide what it is given. The army is six infantry divisions and five cavalry brigades on paper, of which four divisions and the cavalry cross first, and the Royal Navy is the largest in the world.",
  },
  aok: {
    nation: "Austria-Hungary",
    modes: { easy: "The Skoda Mortar", hard: "The Horse-Drawn Gun" },
    title: "Austro-Hungarian Army High Command",
    side: "central",
    quote: { text: "I have examined and weighed everything, and with a serene conscience I set out on the path to which my duty points.", by: "Emperor Franz Joseph" },
    standing: [
      "The monarchy declared war on Serbia on 28 July, after the assassination at Sarajevo. Russia's mobilisation has made it a war on two fronts. The army is short of guns and railways for the war it has planned, and it is made up of soldiers of many nationalities who speak many languages.",
      "Its plan divides the army in three: a group for Serbia, a larger one in Galicia for Russia, and a swing force that can go to either. Everything depends on Germany keeping its promise to engage Russia.",
    ],
    seat: "You hold the seat of the Chief of the General Staff, and Conrad von Hötzendorf sits in it. Six armies are mobilising: two for Serbia, three in Galicia against Russia, and the Second Army, which can go to either. The Emperor Franz Joseph, who is eighty-four, is above you, and the German ally beside you does not have the same war in mind.",
  },
  otto: {
    nation: "The Ottoman Empire",
    modes: { easy: "The Nusret", hard: "The Peabody-Martini" },
    title: "Ottoman General Staff",
    side: "central",
    quote: { text: "I did not wish to condemn the ships of an allied State to certain destruction.", by: "Enver Pasha" },
    standing: [
      "The empire has lost Libya and nearly all its European provinces in the wars of 1911 to 1913. It is poor, thinly industrialised, short of railways and short of trained officers. It has signed a secret alliance with Germany and is, for the moment, neutral.",
      "Two German warships, the Goeben and the Breslau, are at the mouth of the Dardanelles and have asked to be let in.",
    ],
    seat: "You hold the seat of the war ministry and general staff, and Enver Pasha sits in it. The army has begun a general mobilisation and the Third Army, at Erzurum, faces the Russian frontier. You share power with a small group of the Committee of Union and Progress and a German military mission, and you serve a Sultan who reigns and does not rule.",
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
      "Some orders do what they say. Others are contested: the result is rolled and the odds are shown in words. An outcome marked Not in the record is an alternative the game has modelled, not what happened.",
    ],
  },
  {
    id: "advisers",
    title: "Advisers and battles",
    paras: [
      "An order may carry an adviser's argument. An adviser who is overruled too often goes quiet and then asks to be relieved. Some contested orders open an Order of Battle, where you place your counters and, once the enemy is known, give the orders for the second day. You can switch the planning off when you set up a file.",
    ],
  },
  {
    id: "modes",
    title: "Modes",
    paras: [
      "Easy shows what each order does and lets you take back the last one. Hard adds a track for the pressure on the command, and a file in progress is kept on this device.",
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
