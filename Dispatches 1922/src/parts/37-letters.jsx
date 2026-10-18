// LETTERS AND DOCUMENTS
// The letterhead of each command, the documents on the table, the quotations, the terms in a report, the staff and the staff note.
// All of it is keyed by a report, a campaign or a choice, and nothing here changes what a report says or what an order does.

const reportMonth = (node) => firstMonthKey(node && node.date);

// ---------------------------------------------------------------------------------------------------------------------
// LETTERHEAD: who is writing, from where, and how the commander is addressed. The forms follow the usage of each side on the date.
function letterheadFor(campaignId, node, nodeId) {
  const month = reportMonth(node) || 0;
  const cid = NODE_TO_CITY[nodeId];
  const place = (cid && placeName(cid, month || null)) || { southRussia: "Ekaterinodar", siberia: "Omsk", bolsheviks: "Moscow", provisionalGov17: "Petrograd" }[campaignId];
  switch (campaignId) {
    case "southRussia":
      return {
        organ: month < 191901 ? "Command of the Volunteer Army" : month < 192006 ? "Command of the Armed Forces of South Russia" : "Command of the Russian Army",
        initials: month < 191901 ? "VA" : month < 192006 ? "AFSR" : "RA",
        place,
        salutation: "Your Excellency,",
      };
    case "siberia":
      return { organ: month < 191811 ? "Council of Ministers of the Russian State" : "Headquarters of the Supreme Ruler", initials: "SR", place, salutation: month < 191811 ? "Your Excellency," : "Supreme Ruler," };
    case "bolsheviks":
      return { organ: "Revolutionary Military Council of the Republic", initials: "RVS", place, salutation: "Comrade Chairman," };
    default:
      return { organ: "The Provisional Government", initials: "PG", place, salutation: "Citizen Minister," };
  }
}

function Letterhead({ campaign, node, nodeId, skin }) {
  const lh = letterheadFor(campaign.id, node, nodeId);
  const ink = skin.dark ? skin.paper : skin.ink;
  const kind = skin.headerStyle;
  const frame =
    kind === "seal" ? { border: "3px solid #111", outline: "1px solid #111", outlineOffset: "-7px" } : kind === "telegram" ? { borderTop: `4px double ${skin.accent}`, borderBottom: `4px double ${skin.accent}` } : { borderTop: `3px solid ${skin.accent}`, borderBottom: `1px solid ${skin.accent}` };
  return (
    <div className="mb-3 p-3" style={{ ...frame, ...monoFontStyle(skin) }}>
      <div className="flex items-center gap-3">
        <svg width="56" height="56" viewBox="-28 -28 56 56" aria-hidden="true" style={{ flexShrink: 0 }}>
          {kind === "seal" && (
            <g>
              <circle r="24" fill={skin.accent} />
              <circle r="19" fill="none" stroke={skin.paper} strokeWidth="1.2" />
              <text y="5" textAnchor="middle" fontSize="13" fontWeight="bold" fill={skin.paper} style={{ fontFamily: skin.displayFont }}>{lh.initials}</text>
              <path d="M -10 24 L -14 34 L -6 30 M 10 24 L 14 34 L 6 30" stroke={skin.accent} strokeWidth="3" fill="none" />
            </g>
          )}
          {kind === "railmarker" && (
            <g>
              <path d="M -24 20 H 24 M -18 20 V -16 M 18 20 V -16 M -24 -10 H 24 M -24 -2 H 24" stroke={ink} strokeWidth="2" fill="none" />
              <circle cx="-18" cy="-18" r="3.5" fill={skin.accent} />
              <circle cx="18" cy="-18" r="3.5" fill={skin.accent} />
              <path d="M -24 6 Q 0 14 24 6" stroke={skin.accent} strokeWidth="1.6" fill="none" />
            </g>
          )}
          {kind === "stamp" && (
            <g>
              <circle r="24" fill="none" stroke={skin.accent} strokeWidth="3" />
              <path d="M 0 -17 L 4.5 -5.5 L 16.5 -5 L 7.2 2.8 L 10.2 14.8 L 0 8 L -10.2 14.8 L -7.2 2.8 L -16.5 -5 L -4.5 -5.5 Z" fill={skin.accent} />
            </g>
          )}
          {kind === "telegram" && (
            <g>
              <rect x="-24" y="-14" width="48" height="28" fill="none" stroke={skin.accent} strokeWidth="2.2" />
              <path d="M -24 -14 L 0 4 L 24 -14" fill="none" stroke={skin.accent} strokeWidth="2" />
              <path d="M -18 20 h4 m4 0 h10 m4 0 h4 m4 0 h6" stroke={ink} strokeWidth="2" strokeLinecap="round" />
            </g>
          )}
        </svg>
        <div style={{ minWidth: 0 }}>
          <div className="font-bold uppercase tracking-wide" style={{ ...displayFontStyle(skin), ...accentTextStyle(skin), fontSize: "15px", lineHeight: 1.15 }}>{lh.organ}</div>
          <div className="text-xs mt-1" style={mutedTextStyle(skin)}>{lh.place.toUpperCase()}</div>
        </div>
      </div>
      <div className="text-xs mt-2" style={mutedTextStyle(skin)}>{lh.salutation}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------------------------------------------------
// DOCUMENTS on the table at a report. The layout is a reconstruction of the form; the text is a summary of the document, never a
// transcript, and a line in quotation marks is a real quotation with its translation noted. `basis` says where the summary comes from.
const DOCUMENTS = {
  aprilCrisis17: {
    kind: "NOTE", title: "Note to the Allied Governments", from: "P. N. Miliukov, Minister of Foreign Affairs", to: "The Allied governments", date: "1 May 1917",
    lines: ["Repeats the Provisional Government's declaration of 9 April on the aims of the war: no domination over other peoples.", "States the government's intention to carry the war to a decisive victory and to keep its obligations to the Allies.", "The Soviet's Executive Committee had spent weeks obtaining the phrase \"peace without annexations\". It is not in the Note."],
    basis: "The Note of 1 May 1917 (18 April, Old Style) and the declaration of 9 April (27 March, Old Style). See claims/documents-round1.md.",
  },
  armyCommissars17: {
    kind: "DECLARATION", title: "Declaration of the Rights of the Soldier", from: "A. F. Kerensky, Minister of War", to: "The army", date: "11 May 1917",
    lines: ["Gives the soldier the civil rights of other citizens when he is off duty, including the right to belong to political organisations.", "Keeps military discipline in the ranks and on duty."],
    basis: "The Declaration of 11 May 1917 (29 April, Old Style). See claims/documents-round1.md.",
  },
  kornilovAffair17: {
    kind: "TELEGRAM", title: "Order to General Kornilov", from: "A. F. Kerensky, Minister-President", to: "General L. G. Kornilov, Supreme Commander", date: "9 September 1917",
    lines: ["Orders Kornilov to hand over the post of Supreme Commander to General Lukomsky and to come to Petrograd.", "Kornilov answered the same day that he would not."],
    basis: "Kerensky's telegram and Kornilov's reply of 27 August, Old Style (9 September). Browder and Kerensky, The Russian Provisional Government, 1917: Documents, vol. 3. See claims/documents-round1.md.",
  },
  moscowDirective19: {
    kind: "DIRECTIVE", title: "Directive No. 08878", from: "General A. I. Denikin, Commander-in-Chief", to: "The armies of the Armed Forces of South Russia", date: "3 July 1919",
    lines: ["“With the aim of seizing the heart of Russia, Moscow, I order:” (translation)", "The Volunteer Army, under General May-Maevsky, is to advance on Moscow by Kursk, Orel and Tula.", "The Don Army and the Caucasus Army have their own axes. The directive gave no time for the start of the offensive."],
    basis: "Denikin's directive of 20 June (3 July). Translation of the opening line from a Markovtsy campaign history; directive number from RBTH. See claims/documents-round1.md.",
  },
  wrangelsDismissal20: {
    kind: "ORDER", title: "Order removing General Wrangel", from: "General A. I. Denikin, Commander-in-Chief", to: "The Armed Forces of South Russia", date: "8 February 1920",
    lines: ["Removes Lieutenant-General Wrangel from his command.", "Wrangel left for Constantinople at the end of the month."],
    basis: "Order of 8 February 1920; the departure date is from the fact-check pass (claims/south-russia-round1.md).",
  },
  omskCoup18: {
    kind: "PROCLAMATION", title: "Proclamation of the Supreme Ruler", from: "Admiral A. V. Kolchak", to: "The population of Russia", date: "18 November 1918",
    lines: ["The Council of Ministers hands its powers to Admiral Kolchak, who takes the title of Supreme Ruler of the Russian State.", "The first act of the new ruler is an address that says he will follow neither reaction nor party politics. It is quoted at the foot of this report."],
    basis: "The coup of 18 November 1918. See claims/documents-round1.md.",
  },
  revvoensovietFormed18: {
    kind: "DECREE", title: "Decree declaring the Soviet Republic a military camp", from: "The All-Russian Central Executive Committee", to: "The Republic", date: "2 September 1918",
    lines: ["Declares the Soviet Republic a military camp.", "Creates the Revolutionary Military Council of the Republic with Trotsky as its chairman.", "Places the fronts under one commander-in-chief, answerable to the chairman. The first was Ioakim Vatsetis."],
    basis: "VTsIK decree of 2 September 1918. See claims/documents-round1.md.",
  },
  grainRequisition18: {
    kind: "DECREE", title: "Decree on the requisition of grain and fodder", from: "The Council of People's Commissars", to: "The provinces", date: "11 January 1919",
    lines: ["Fixes a quota of grain for each province, county and village, to be delivered in full.", "Grain is taken at fixed prices."],
    basis: "Decree of 11 January 1919 introducing the prodrazverstka. See claims/documents-round1.md.",
  },
  polishWar20: {
    kind: "ORDER", title: "Order of the day to the Western Front", from: "M. N. Tukhachevsky, commanding the Western Front", to: "The armies of the Western Front", date: "2 July 1920",
    lines: ["Announces the advance on Warsaw and calls the army to carry the revolution westward through Poland.", "Ends with the words \"To the West!\""],
    basis: "Order of 2 July 1920; translations of its middle passage differ, so only its sense is given. See claims/documents-round1.md.",
  },
  kronstadt21: {
    kind: "RESOLUTION", title: "The Petropavlovsk resolution", from: "A general meeting of the ships' crews at Kronstadt", to: "The garrison and the Soviet government", date: "1 March 1921",
    lines: ["Fifteen demands. The first is new elections to the Soviets by secret ballot, after free electoral propaganda.", "Freedom of speech and of the press for workers and peasants, for anarchists and for the left socialist parties.", "A meeting of 15,000 to 16,000 passed it. Two Bolshevik officials voted against."],
    basis: "The resolution of 1 March 1921, as given by Mett, Avrich and the anarchist FAQ. See claims/documents-round1.md.",
  },
};

function DocumentCard({ doc, skin }) {
  const ink = skin.dark ? skin.paper : skin.ink;
  return (
    <details className="mt-4" style={monoFontStyle(skin)}>
      <summary className="cursor-pointer text-xs font-bold tracking-widest" style={accentTextStyle(skin)}>▸ THE DOCUMENT ON THE TABLE: {doc.title.toUpperCase()}</summary>
      <div className="mt-2 p-3" style={{ border: `1px solid ${ink}`, background: skin.dark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.55)", boxShadow: `3px 3px 0 ${skin.paperDim}` }}>
        <div className="flex justify-between text-xs" style={mutedTextStyle(skin)}>
          <span className="tracking-widest font-bold">{doc.kind}</span>
          <span>{doc.date}</span>
        </div>
        <div className="font-bold mt-2" style={{ ...displayFontStyle(skin), fontSize: "17px" }}>{doc.title}</div>
        <div className="text-xs mt-2"><b>FROM:</b> {doc.from}</div>
        <div className="text-xs"><b>TO:</b> {doc.to}</div>
        <div className="border-t my-2" style={{ borderColor: skin.paperDim }} />
        {doc.lines.map((l, i) => (
          <p key={i} className="text-sm mt-2 leading-relaxed" style={{ fontFamily: BODY_FONT }}>{l}</p>
        ))}
        <div className="border-t mt-3 pt-2 text-xs" style={{ borderColor: skin.paperDim, ...mutedTextStyle(skin) }}>
          RECONSTRUCTED: the layout is of the period. The text is a summary, not a transcript. {doc.basis}
        </div>
      </div>
    </details>
  );
}

// ---------------------------------------------------------------------------------------------------------------------
// QUOTATIONS: real words, short, each logged in claims/quotations.json with its translation and source (tools/check-quotations.mjs).
// QUOTES-BEGIN
const QUOTES = [
  { id: "q-kornilov-1917", node: "kornilovAffair17", who: "General Lavr Kornilov", when: "27 August 1917 (Old Style), to Kerensky", text: "Russian people, the life of your motherland is in your hands!" },
  { id: "q-kolchak-1918", node: "omskCoup18", who: "Admiral Alexander Kolchak", when: "18 November 1918, on taking power", text: "I will not follow the path of reaction or the disastrous path of partisanship. My main goal is to create a combat-ready army, defeat the Bolsheviks, and reestablish law and order." },
  { id: "q-denikin-1919", node: "moscowDirective19", who: "General Anton Denikin", when: "Directive of 3 July 1919", text: "With the aim of seizing the heart of Russia, Moscow, I order:" },
  { id: "q-wrangel-directive", node: "moscowDirective19", who: "Baron Pyotr Wrangel", when: "Later, on the Directive", text: "a death sentence to the armies of the South of Russia" },
  { id: "q-kronstadt-1921", node: "kronstadt21", who: "The Petropavlovsk resolution", when: "1 March 1921, first demand", text: "Immediate new elections to the Soviets. The present Soviets no longer express the wishes of the workers and peasants. The new elections should be by secret ballot, and should be preceded by free electoral propaganda." },
];
// QUOTES-END

function QuoteStrip({ nodeId, skin }) {
  const list = QUOTES.filter((q) => q.node === nodeId);
  if (!list.length) return null;
  return (
    <div className="mt-4">
      <div className="text-xs font-bold tracking-widest" style={{ ...monoFontStyle(skin), ...accentTextStyle(skin) }}>FROM THE RECORD</div>
      {list.map((q) => (
        <figure key={q.id} className="border-l-4 pl-3 mt-2" style={{ borderColor: skin.accent, margin: 0 }}>
          <blockquote className="text-sm leading-relaxed" style={{ margin: 0, fontFamily: BODY_FONT }}>{"“" + q.text + "”"}</blockquote>
          <figcaption className="text-xs mt-1" style={{ ...monoFontStyle(skin), ...mutedTextStyle(skin) }}>{q.who}, {q.when}. A translation; sources in claims/quotations.json.</figcaption>
        </figure>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------------------------------------------------
// TERMS in a report: every glossary entry the report uses, so the player does not have to leave the page.
function termsIn(text) {
  const found = [];
  for (const g of GLOSSARY) {
    const esc = g.term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (new RegExp("(^|[^A-Za-z])" + esc + "([^A-Za-z]|$)", "i").test(text)) found.push(g);
  }
  return found;
}
function TermsInReport({ node, skin }) {
  const text = [node.situation, node.context, ...(node.choices || []).map((c) => c.label)].filter(Boolean).join(" \n ");
  const list = React.useMemo(() => termsIn(text), [text]);
  if (!list.length) return null;
  return (
    <details className="mt-4 text-xs" style={monoFontStyle(skin)}>
      <summary className="cursor-pointer font-bold tracking-widest" style={accentTextStyle(skin)}>TERMS IN THIS REPORT ({list.length})</summary>
      <dl className="mt-2">
        {list.map((g) => (
          <div key={g.term} className="mb-2">
            <dt className="font-bold">{g.term}</dt>
            <dd style={{ margin: 0, ...mutedTextStyle(skin) }}>{g.definition}</dd>
          </div>
        ))}
      </dl>
    </details>
  );
}

// ---------------------------------------------------------------------------------------------------------------------
// STAFF: the people who return, where they stand on this run. A rule applies from its month (YYYYMM), and when it names a flag, only
// if the run has that flag at that value; the last rule that applies is the one shown. A person is "at this report" where it lists them.
const CAST = {
  southRussia: [
    { id: "wrangel", name: "Lieutenant-General Pyotr Wrangel", role: "Commands the Caucasus Army", appears: ["moscowDirective19", "volgaThrust19", "volgaOverextension19", "volgaCossackDesertion19", "wrangelsDismissal20", "wrangelsReassignment20", "sevastopolCouncil20", "landLawDecision20", "northernTauride20", "wrangelsEnvoy20"], rules: [
      { from: 191907, text: "Commands the Caucasus Army on the Volga." },
      { from: 192002, flag: "wrangelDismissal", value: "dismissed", text: "Dismissed by your order." },
      { from: 192002, flag: "wrangelDismissal", value: "retained", text: "Kept in his command." },
      { from: 192002, flag: "wrangelDismissal", value: "reassigned", text: "Reassigned to a field command." },
    ] },
    { id: "maimaevsky", name: "Lieutenant-General Vladimir May-Maevsky", role: "Commands the Volunteer Army", appears: ["moscowDirective19", "kievConvergence19", "orelCulmination19", "cossackDesertion19"], rules: [
      { from: 191907, text: "Commands the Volunteer Army on the Moscow axis." },
      { from: 191912, text: "Replaced in command of the Volunteer Army in late November 1919, by Wrangel." },
    ] },
  ],
  siberia: [
    { id: "boldyrev", name: "General Vasily Boldyrev", role: "Commander-in-chief of the Directory", appears: ["omskCoup18", "boldyrevsFirstWeek18"], rules: [
      { from: 191811, text: "In Omsk, offered an office he did not ask for." },
      { from: 191811, flag: "boldyrevFirstWeek", value: "reinstatement_pressed", text: "You pressed for his reinstatement." },
      { from: 191811, flag: "boldyrevFirstWeek", value: "expulsion_accepted", text: "You accepted his expulsion." },
    ] },
    { id: "diterichs", name: "General Mikhail Diterichs", role: "Commands the Third Army", appears: ["chelyabinskGrinder19", "diterichsOverruled19"], rules: [
      { from: 191907, text: "Commands the Third Army at Chelyabinsk." },
      { from: 191908, flag: "diterichsHandling", value: "retained", text: "Kept in command." },
      { from: 191908, flag: "diterichsHandling", value: "released", text: "Released from his command." },
    ] },
    { id: "janin", name: "General Maurice Janin", role: "Allied commander in Siberia", appears: ["janinsWord19", "irkutskUltimatum20"], rules: [
      { from: 191811, text: "Commands the Allied and Czechoslovak forces." },
      { from: 191912, flag: "janinChoice", value: "accepted", text: "You took his word." },
      { from: 191912, flag: "janinChoice", value: "declined", text: "You declined his word." },
    ] },
    { id: "semyonov", name: "Ataman Grigory Semyonov", role: "Controls the railway at Chita", appears: ["reluctanceAftermath18", "semyonovResponse18", "semyonovMerger20", "chitaFall20"], rules: [
      { from: 191811, text: "Holds Chita and the line east of Lake Baikal." },
      { from: 192003, flag: "semyonovChoice", value: "merged", text: "Merged with your command." },
      { from: 192003, flag: "semyonovChoice", value: "refused", text: "Refused; he stays apart." },
    ] },
  ],
  bolsheviks: [
    { id: "stalin", name: "Joseph Stalin", role: "Political commissar on the Southern Front", appears: ["tsaritsynCrisis18", "tsaritsynAftermath18", "stalinsRecall18", "stalinsNewPosting18"], rules: [
      { from: 191810, text: "At Tsaritsyn." },
      { from: 191812, flag: "stalinRecallHandling", value: "reassigned", text: "Recalled and reassigned." },
      { from: 191812, flag: "stalinRecallHandling", value: "unresolved", text: "Recalled; the question is left open." },
    ] },
    { id: "smirnov", name: "Ivan Smirnov", role: "Member of the Military Opposition", appears: ["militaryOppositionCongress19", "congressFallout19", "smirnovReassignment19"], rules: [
      { from: 191903, text: "Speaks for the Military Opposition." },
      { from: 191903, flag: "smirnovAssignment", value: "sidelined", text: "Kept from field command." },
      { from: 191903, flag: "smirnovAssignment", value: "field_command", text: "Given a field command." },
    ] },
    { id: "voroshilov", name: "Kliment Voroshilov", role: "Commands at Tsaritsyn", appears: ["tsaritsynCrisis18", "tsaritsynAftermath18"], rules: [
      { from: 191810, text: "Commands the Tenth Army at Tsaritsyn." },
      { from: 191811, flag: "voroshilovCompliance", value: "smooth", text: "Complies with the centre." },
      { from: 191811, flag: "voroshilovCompliance", value: "friction", text: "Complies with friction." },
    ] },
    { id: "budyonny", name: "Semyon Budyonny", role: "Commands the Red cavalry", appears: ["cavalryArmyDebate19", "distributedPursuit19", "polishWar20"], rules: [
      { from: 191911, text: "Commands the cavalry corps." },
      { from: 191911, flag: "cavalryDoctrine", value: "unified", text: "Your doctrine: one cavalry army." },
      { from: 191911, flag: "cavalryDoctrine", value: "reinforced_corps", text: "Your doctrine: reinforced corps." },
      { from: 191911, flag: "cavalryDoctrine", value: "distributed", text: "Your doctrine: cavalry spread across the armies." },
    ] },
  ],
  provisionalGov17: [
    { id: "miliukov", name: "Pavel Miliukov", role: "Minister of Foreign Affairs", appears: ["aprilCrisis17"], rules: [
      { from: 191705, text: "At the Foreign Ministry." },
      { from: 191705, flag: "aprilCrisisChoice", value: "coalition", text: "Out of the Cabinet; a coalition takes his place." },
      { from: 191705, flag: "aprilCrisisChoice", value: "standFirm", text: "Still at the Foreign Ministry." },
    ] },
    { id: "kornilov", name: "General Lavr Kornilov", role: "Supreme Commander", appears: ["supremeCommand17", "moscowConference17", "kornilovAffair17"], rules: [
      { from: 191707, text: "Commands the Southwestern Front." },
      { from: 191707, flag: "supremeCommand", value: "on_his_terms", text: "Supreme Commander, on his own terms." },
      { from: 191707, flag: "supremeCommand", value: "written_pledge", text: "Supreme Commander, under a written pledge." },
      { from: 191709, flag: "kornilovOutcome", value: "garrisonHeld", text: "His march on Petrograd was stopped." },
      { from: 191709, flag: "kornilovOutcome", value: "cityFell", text: "His troops took Petrograd." },
    ] },
  ],
};

function castStatus(person, month, flags) {
  let out = null;
  for (const r of person.rules) {
    if (month < r.from) continue;
    if (r.flag && (flags || {})[r.flag] !== r.value) continue;
    out = r.text;
  }
  return out;
}

function CastPanel({ campaignId, nodeId, node, flags, skin }) {
  const list = CAST[campaignId] || [];
  const month = reportMonth(node) || 0;
  const rows = list.map((p) => ({ p, status: castStatus(p, month, flags), here: p.appears.includes(nodeId) })).filter((r) => r.status);
  if (!rows.length) return null;
  const here = rows.filter((r) => r.here).length;
  return (
    <details className="mt-4 text-xs" style={monoFontStyle(skin)} open={here > 0}>
      <summary className="cursor-pointer font-bold tracking-widest" style={accentTextStyle(skin)}>YOUR STAFF AND COMMANDERS{here ? ` (${here} AT THIS REPORT)` : ""}</summary>
      <ul style={{ listStyle: "none", padding: 0 }} className="mt-2">
        {rows.map(({ p, status, here: h }) => (
          <li key={p.id} className="py-2 border-t" style={{ borderColor: skin.paperDim }}>
            <div className="font-bold">{p.name}{h ? "  ◆ AT THIS REPORT" : ""}</div>
            <div style={mutedTextStyle(skin)}>{p.role}</div>
            <div>{status}</div>
          </li>
        ))}
      </ul>
    </details>
  );
}

// ---------------------------------------------------------------------------------------------------------------------
// STAFF NOTE: what the staff would say about an order, worked out from its own data: the likely result, the best case and the risk.
// It is the data the order already carries (its meter effects and the outcomes of its roll), put in words, so it works in every mode.
const STAFF_OFFICE = { southRussia: "The Operations Section", siberia: "The Staff Section", bolsheviks: "The Operations Section", provisionalGov17: "The Cabinet Chancery" };
function axisPhrase(campaign, impact) {
  const label = (k) => ((campaign.triangleAxes.find((a) => a.key === k) || {}).label || k).toLowerCase();
  const gains = Object.entries(impact || {}).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]).map(([k]) => label(k));
  const costs = Object.entries(impact || {}).filter(([, v]) => v < 0).sort((a, b) => a[1] - b[1]).map(([k]) => label(k));
  const join = (xs) => (xs.length <= 1 ? xs.join("") : xs.slice(0, -1).join(", ") + " and " + xs[xs.length - 1]);
  const parts = [];
  if (gains.length) parts.push("gains in " + join(gains));
  if (costs.length) parts.push("costs in " + join(costs));
  return parts.length ? parts.join(", with ") : "";
}
const outcomeTotal = (choice, e) => Object.values(addImpacts(choice.impact, e.impact)).reduce((s, v) => s + v, 0);
function staffNoteFor(choice, campaign) {
  const lines = [];
  if (choice.uncertain && choice.uncertain.length > 1) {
    const byOdds = [...choice.uncertain].sort((a, b) => b.weight - a.weight);
    const byValue = [...choice.uncertain].sort((a, b) => outcomeTotal(choice, b) - outcomeTotal(choice, a));
    const tenths = (e) => Math.max(1, Math.min(9, Math.round(e.weight / 10)));
    lines.push(["LIKELY", `${byOdds[0].title}. About ${tenths(byOdds[0])} in 10.`]);
    if (byValue[0] !== byOdds[0]) lines.push(["BEST CASE", `${byValue[0].title}. About ${tenths(byValue[0])} in 10.`]);
    const worst = byValue[byValue.length - 1];
    if (worst !== byOdds[0] || byValue[0] === byOdds[0]) lines.push(["RISK", `${worst.title}. About ${tenths(worst)} in 10.`]);
    const base = axisPhrase(campaign, choice.impact);
    if (base) lines.push(["BEFORE THE ROLL", base.charAt(0).toUpperCase() + base.slice(1) + "."]);
  } else {
    const ph = axisPhrase(campaign, choice.impact);
    lines.push(["LIKELY", ph ? ph.charAt(0).toUpperCase() + ph.slice(1) + "." : "The order is carried out as written. The command's standing does not change."]);
    const top = Object.entries(choice.impact || {}).sort((a, b) => b[1] - a[1])[0];
    const low = Object.entries(choice.impact || {}).sort((a, b) => a[1] - b[1])[0];
    const label = (k) => ((campaign.triangleAxes.find((a) => a.key === k) || {}).label || k).toLowerCase();
    if (top && top[1] > 0) lines.push(["BEST CASE", `The most it gives is ${label(top[0])}.`]);
    if (low && low[1] < 0) lines.push(["RISK", `The most it costs is ${label(low[0])}.`]);
    else lines.push(["RISK", "The staff can see no cost on the meters. What it does to the situation is not on them."]);
  }
  return lines;
}
function StaffNote({ choice, campaign, skin, open }) {
  const lines = staffNoteFor(choice, campaign);
  return (
    <details className="mt-2 text-xs" style={monoFontStyle(skin)} open={open}>
      <summary className="cursor-pointer font-bold" style={accentTextStyle(skin)}>▸ WHAT THE STAFF SAY</summary>
      <div className="mt-1 pl-3 border-l-2" style={{ borderColor: skin.paperDim }}>
        <div style={mutedTextStyle(skin)}>{STAFF_OFFICE[campaign.id]} reports:</div>
        {lines.map(([k, t]) => (
          <div key={k} className="mt-1"><b>{k}.</b> {t}</div>
        ))}
      </div>
    </details>
  );
}
