// ---------- THE AMERICAN EFFORT SPLIT (Dispatches WW2) ----------
// (The heading keeps its old name for split.config.json.) The allocation of effort for four commands, the papers that follow a battle, and the
// bargain at Casablanca. The rules are in src/effort.ts and src/command.ts; these are the screens. Each allocation paper is shown before the
// year's first briefing while the year has no allocation, so a save, a resume or a rewind to before the choice shows it again. Each year's paper
// says what was argued and what the record did.
const EFFORT_PAPERS = {
  american: {
    1942: {
      title: "Germany First, in Principle",
      text: [
        "At Arcadia Roosevelt and Churchill have confirmed that Germany is to be beaten first. The Pacific is still burning: the Philippines are falling, the sea lanes to Australia lie open, and Admiral King wants ships, aircraft and men to hold the line from Hawaii to Australia. General Marshall wants the army's divisions gathered in Britain for a landing in France.",
        "In the record Germany came first in principle and the Pacific had about as much in fact. By the end of 1942 more American troops overseas faced Japan than faced Germany.",
      ],
    },
    1943: {
      title: "Fifteen Per Cent or Thirty",
      text: [
        "At Casablanca Admiral King tells the British that the war against Japan receives some fifteen per cent of the Allied effort, and that it needs thirty to keep the Japanese from digging in. The British want the Mediterranean and the bombing of Germany to come before anything else in the Pacific.",
        "In the record the two wars had roughly equal shares again: the Mediterranean in the spring and summer, and the Central Pacific drive from Tarawa in November.",
      ],
    },
    1944: {
      title: "The Year of Overlord",
      text: [
        "Overlord has first call on the year: on landing craft above all, and on the divisions and aircraft gathered in Britain. The Pacific fleets are larger than they have ever been, and Nimitz and MacArthur each want the main effort for their own road to Japan.",
        "In the record Germany came first. The landing craft were kept for Normandy and the south of France, and the Pacific advanced with what the shipyards added.",
      ],
    },
    1945: {
      title: "Redeployment",
      text: [
        "Germany is beaten in all but name, and the last campaign in the west still needs every division in France. The planners of the invasion of Japan want the first divisions on their way across the world before the spring is out.",
        "In the record Germany came first until the surrender in May, and only then did the armies begin to move to the Pacific.",
      ],
    },
  },
  german: {
    1942: {
      title: "The Second Summer",
      text: [
        "The army in the East has suffered more than a million casualties since June 1941, and the summer offensive in the south will need every replacement Germany can find. Rommel wants divisions and fuel to reach Suez; Raeder wants Malta taken first.",
        "In the record the East came first again. Case Blue had the reinforcements, and the Panzerarmee Afrika reached El Alamein at the end of a supply line it could not keep open.",
      ],
    },
    1943: {
      title: "Citadel or the West",
      text: [
        "The Sixth Army is gone and Tunisia is falling. The new Panthers and Tigers can be gathered for one more offensive at Kursk, or held back against the landing in the West that everyone expects.",
        "In the record the East had first call. Citadel took the new armour in July, while the West waited behind an Atlantic Wall that was still mostly on paper.",
      ],
    },
    1944: {
      title: "Directive 51",
      text: [
        "In November 1943 Hitler's Directive 51 says that the danger in the West is now the greater: the East has space to give up, and the West does not. The East still holds most of the army.",
        "In the record the West had first call on new armour and guns through the first half of 1944, and in the autumn the last reserves were gathered in the West for the Ardennes.",
      ],
    },
  },
  japan: {
    1942: {
      title: "The Navy's Year",
      text: [
        "After the first victories the Navy wants to go further: Port Moresby, Midway, and the islands toward Fiji and Samoa. The Army holds most of its strength in China and Manchuria and wants to keep it there.",
        "In the record the Navy had its way: the Coral Sea in May, Midway in June, and the long struggle for Guadalcanal from August.",
      ],
    },
    1943: {
      title: "Two Services, One Steel Ration",
      text: [
        "The Army and the Navy bid against each other for steel, aluminium and shipping. The Navy needs carriers and aircraft to replace those lost; the Army needs ships to carry divisions to New Guinea and the Solomons.",
        "In the record the two services shared the year's materials after months of bargaining, and neither had enough.",
      ],
    },
    1944: {
      title: "Ichi-Go and A-Go",
      text: [
        "The Army plans Ichi-Go, the largest offensive in its history, across China. The Navy gathers its carriers for A-Go, the decisive battle it expects in the Marianas or the Carolines.",
        "In the record both went ahead. Ichi-Go took the American air bases in eastern China, and A-Go ended in the Philippine Sea with most of the Navy's carrier aircraft lost.",
      ],
    },
    1945: {
      title: "Ketsu-Go",
      text: [
        "The fleet is nearly gone. The Army prepares Ketsu-Go, the defence of the home islands, and wants every aircraft, every gallon of fuel and every man for the beaches of Kyushu.",
        "In the record the Army's defence of the homeland came first. The Navy's remaining aircraft and its last ships were folded into the plan, many of them as special attack units.",
      ],
    },
  },
  soviet: {
    1942: {
      title: "The Reserve",
      text: [
        "The factories that went east are producing again. STAVKA can send every new tank and every new army to the fronts as they form, or hold armies back in reserve for a counter-offensive.",
        "In the record STAVKA formed new reserve armies through the summer and autumn, and committed them at Stalingrad in November.",
      ],
    },
    1943: {
      title: "Strike First, or Wait",
      text: [
        "The Germans are expected to strike at the Kursk salient. STAVKA can attack first, or dig in, wait, and hold a whole front in reserve behind the salient for the counter-stroke.",
        "In the record STAVKA waited. The salient was fortified in depth, and the Steppe Front went in only after the German attack had spent itself.",
      ],
    },
    1944: {
      title: "Bagration",
      text: [
        "The armies are larger and better equipped than ever, and they move on Lend-Lease trucks. STAVKA plans the summer offensive in Belorussia.",
        "In the record everything went forward: Bagration in June, and one offensive after another until the autumn.",
      ],
    },
    1945: {
      title: "Berlin",
      text: [
        "The fronts stand on the Oder and in Hungary, and the Western Allies are coming up to the Rhine. STAVKA can throw everything into the last offensives, or begin to hold strength back for what comes after, among it the war against Japan promised at Yalta.",
        "In the record everything went forward: the Berlin operation in April, with Zhukov's and Konev's fronts racing each other into the city, while armies began the journey east across Siberia for Manchuria.",
      ],
    },
  },
};

const ALLOCATION_LABELS = {
  germanyFirst: () => t("Germany First: the main weight of men, ships and aircraft goes to the war against Germany"),
  pacificFirst: () => t("Pacific First: the main weight of men, ships and aircraft goes to the war against Japan"),
  eastFirst: () => t("The East First: the main weight of men, tanks and aircraft goes to the war against the Soviet Union"),
  westFirst: () => t("The West First: the main weight goes to the Mediterranean, the Atlantic and the coast of France"),
  armyFirst: () => t("The Army First: the main weight of steel, aircraft and shipping goes to the army's war"),
  navyFirst: () => t("The Navy First: the main weight of steel, aircraft and shipping goes to the fleet"),
  frontFirst: () => t("The Front First: every new tank and division goes to the fronts as soon as it is ready"),
  factoriesFirst: () => t("Factories and Reserves First: production and reserve armies are built up for later"),
};
const evenLabel = (command) =>
  command === "american" ? t("An Even Hand: the two wars have about equal shares of the year's effort") : t("An Even Hand: the two claims have about equal shares of the year's effort");
const ALLOCATION_NAMES = {
  germanyFirst: () => t("Germany First"),
  even: () => t("An Even Hand"),
  pacificFirst: () => t("Pacific First"),
  eastFirst: () => t("The East First"),
  westFirst: () => t("The West First"),
  armyFirst: () => t("The Army First"),
  navyFirst: () => t("The Navy First"),
  frontFirst: () => t("The Front First"),
  factoriesFirst: () => t("Factories and Reserves First"),
};
const SIDE_NAMES = {
  europe: () => t("Europe"),
  pacific: () => t("the Pacific"),
  east: () => t("the East"),
  west: () => t("the West"),
  army: () => t("the army"),
  navy: () => t("the navy"),
  now: () => t("this year's battles"),
  later: () => t("next year's battles"),
};

/** "Europe as planned", "the Pacific one chit more", "the East two chits fewer". */
function chitText(side, n) {
  const name = SIDE_NAMES[side] ? SIDE_NAMES[side]() : side;
  if (!n) return t("{side} as planned", { side: name });
  return n > 0 ? t("{side} {n, plural, one {# chit} other {# chits}} more", { side: name, n }) : t("{side} {n, plural, one {# chit} other {# chits}} fewer", { side: name, n: -n });
}

/** The paper on which a command shares the year's effort. */
function EffortScreen({ campaign, command, year, flags, onChoose }) {
  const plan = effortPlan(command);
  const paper = (EFFORT_PAPERS[command] || {})[year];
  const tint = "#eef2f6";
  const headingRef = useRef(null);
  useEffect(() => {
    if (headingRef.current) headingRef.current.focus();
  }, [year]);
  if (!plan || !paper) return null;
  return (
    <div className="min-h-screen w-full bg-[#000000] flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        <h1 ref={headingRef} tabIndex={-1} className="sr-only outline-none">
          {t("Allocation of effort, {year}", { year })}
        </h1>
        <div className="wire-tear" style={{ "--wire-paper": tint }}></div>
        <div className="px-5 py-5" style={{ backgroundColor: tint }}>
          <div className="pb-2 mb-3" style={{ borderBottom: `2px solid ${campaign.accent}`, fontFamily: "'IBM Plex Mono', monospace" }}>
            <div className="text-xs font-bold tracking-[0.16em]" style={{ color: campaign.accent }}>
              {t("ALLOCATION OF EFFORT")}
            </div>
            <div className="text-[11px] text-[#444] mt-0.5">{t("{seal}, {year}", { seal: campaign.seal, year })}</div>
          </div>
          <h2 className="text-2xl uppercase leading-tight mb-3 text-[#16130f]" style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700 }}>
            {paper.title}
          </h2>
          {paper.text.map((p, i) => (
            <p key={i} className="text-[14px] leading-relaxed mb-3 text-[#2a2622]" style={{ fontFamily: "'Courier Prime', monospace" }}>
              {p}
            </p>
          ))}
          <div className="text-[11px] pt-2 text-[#555]" style={{ borderTop: "1px dashed #ccc4b8", fontFamily: "'IBM Plex Mono', monospace" }}>
            {plan.kind === "time"
              ? t("The share moves forces, not luck. The factories first leave this year's Orders of Battle a chit short, put next year's a chit ahead and add Matériel; the front first does the opposite.")
              : t("The share moves forces, not luck: each Order of Battle on a side starts with more or fewer effort chits, this year and the next. Moving effort between theatres costs Matériel, and the odds of ordinary orders do not move.")}
          </div>
        </div>
        <div className="wire-tear wire-tear-bottom" style={{ "--wire-paper": tint }}></div>
        <div role="group" aria-label={t("Allocation of effort, {year}", { year })} className="mt-4 flex flex-col gap-2">
          {plan.options.map((a, k) => {
            const eff = allocationEffect(command, a, year, flags);
            const isRecord = plan.record[year] === a;
            const label = a === "even" ? evenLabel(command) : ALLOCATION_LABELS[a]();
            return (
              <button
                key={a}
                data-hotkey={String(k + 1)}
                onClick={() => onChoose(a, eff.materiel)}
                className="text-left border-2 px-4 py-3 bg-[#eef2f6] text-[#000000] hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f] group"
                style={{ borderColor: campaign.accent, fontFamily: "'Courier Prime', monospace" }}
              >
                <span className="block text-[15px] font-bold">{label}</span>
                <span className="block mt-1 text-[12px]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                  {t("Orders of Battle: {a}; {b}.", { a: chitText(plan.sides[0], eff.first), b: chitText(plan.sides[1], eff.second) })}
                  {eff.materiel !== 0 && " " + t("Matériel {n}.", { n: eff.materiel > 0 ? `+${eff.materiel}` : `−${-eff.materiel}` })}
                </span>
                {isRecord && (
                  <span className="inline-block mt-2 text-[11px] uppercase tracking-widest font-bold border border-current px-2 py-[2px]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                    {t("The record")}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** The allocations of the file, year by year, for the end of the war and the journal: what the command chose, and what the record did. */
function EffortRecord({ command, flags, accent }) {
  const rows = allocationRecord(command, flags);
  if (!rows.length) return null;
  const name = (a) => (ALLOCATION_NAMES[a] ? ALLOCATION_NAMES[a]() : a);
  return (
    <div>
      <ul className="text-[13px] text-[#000000]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
        {rows.map((r) => (
          <li key={r.year} className="py-1" style={{ borderBottom: `1px solid ${accent}33` }}>
            {r.chosen === r.record
              ? t("{year}: {chosen}, as the record did", { year: r.year, chosen: name(r.chosen) })
              : t("{year}: {chosen}; the record: {record}", { year: r.year, chosen: name(r.chosen), record: name(r.record) })}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** A staff paper with numbered orders, and then what came of the one given (the papers after a battle, the conference). */
function StaffPaper({ campaign, kicker, dateline, title, text, orders, onChoose, result, onContinue }) {
  const tint = "#f3efe6";
  const headingRef = useRef(null);
  useEffect(() => {
    if (headingRef.current) headingRef.current.focus();
  }, [result]);
  return (
    <div className="min-h-screen w-full bg-[#000000] flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        <h1 ref={headingRef} tabIndex={-1} className="sr-only outline-none">
          {title}
        </h1>
        <div className="wire-tear" style={{ "--wire-paper": tint }}></div>
        <div className="px-5 py-5" style={{ backgroundColor: tint }}>
          <div className="pb-2 mb-3" style={{ borderBottom: `2px solid ${campaign.accent}`, fontFamily: "'IBM Plex Mono', monospace" }}>
            <div className="text-xs font-bold tracking-[0.16em]" style={{ color: campaign.accent }}>
              {kicker}
            </div>
            {dateline && <div className="text-[11px] text-[#444] mt-0.5">{dateline}</div>}
          </div>
          <h2 className="text-2xl uppercase leading-tight mb-3 text-[#16130f]" style={{ fontFamily: "Oswald, sans-serif", fontWeight: 700 }}>
            {title}
          </h2>
          {text.map((p, i) => (
            <p key={i} className="text-[14px] leading-relaxed mb-3 text-[#2a2622]" style={{ fontFamily: "'Courier Prime', monospace" }}>
              {p}
            </p>
          ))}
          {result && (
            <p role="status" className="text-[14px] leading-relaxed mt-2 pt-2 font-bold text-[#16130f]" style={{ borderTop: "1px dashed #ccc4b8", fontFamily: "'Courier Prime', monospace" }}>
              {result}
            </p>
          )}
        </div>
        <div className="wire-tear wire-tear-bottom" style={{ "--wire-paper": tint }}></div>
        {result ? (
          <button
            data-hotkey="enter"
            onClick={onContinue}
            className="w-full border-2 mt-4 px-4 py-3 text-sm uppercase tracking-[0.2em] font-bold transition-colors duration-150"
            style={{ borderColor: campaign.accent, color: campaign.accent, fontFamily: "'IBM Plex Mono', monospace", background: tint }}
          >
            {t("Continue")}
          </button>
        ) : (
          <div role="group" aria-label={title} className="mt-4 flex flex-col gap-2">
            {orders.map((o, k) => (
              <button
                key={o.id}
                data-hotkey={String(k + 1)}
                onClick={() => onChoose(o.id)}
                className="text-left border-2 px-4 py-3 bg-[#f3efe6] text-[#000000] hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f]"
                style={{ borderColor: campaign.accent, fontFamily: "'Courier Prime', monospace" }}
              >
                <span className="block text-[15px] font-bold">{o.label}</span>
                {o.note && (
                  <span className="block mt-1 text-[12px]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                    {o.note}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/** "Initiative +2, Matériel −1". */
function impactText(impact) {
  const names = { manpower: t("Manpower"), fuel: t("Matériel"), initiative: t("Initiative") };
  return ["manpower", "fuel", "initiative"]
    .filter((k) => impact[k])
    .map((k) => `${names[k]} ${impact[k] > 0 ? "+" + impact[k] : "−" + -impact[k]}`)
    .join(", ");
}

const FOLLOW_UP_TEXT = {
  exploit: {
    kicker: () => t("AFTER THE BATTLE"),
    title: (battle) => t("After {battle}: The Pursuit", { battle }),
    text: () => [t("The enemy is beaten and falling back. The staff ask whether to drive on while the enemy is broken, or to rest the forces and bring up supplies.")],
  },
  withdraw: {
    kicker: () => t("AFTER THE BATTLE"),
    title: (battle) => t("After {battle}: The Order to Withdraw", { battle }),
    text: () => [t("The plan has given out, and the forces that fought are badly hurt. They must be pulled back and re-formed, or ordered to hold where they stand.")],
  },
};
const FOLLOW_UP_ORDERS = {
  pursue: () => t("Pursue: drive on while the enemy is broken"),
  consolidate: () => t("Consolidate: rest the forces and bring up supplies"),
  withdraw: () => t("Withdraw and re-form the forces that fought"),
  hold: () => t("Hold where they stand"),
};

/** The paper a battle's result forces before the next report (src/command.ts, followUpFor). */
function FollowUpScreen({ campaign, followUp, onDone }) {
  const f = followUpFor(followUp.grade);
  const words = FOLLOW_UP_TEXT[f.kind];
  const battle = String(followUp.battle || "").replace(/^Order of Battle:\s*/, "");
  return (
    <StaffPaper
      campaign={campaign}
      kicker={words.kicker()}
      title={words.title(battle)}
      text={words.text()}
      orders={f.orders.map((o) => ({ id: o.id, label: FOLLOW_UP_ORDERS[o.id](), note: impactText(o.impact) }))}
      onChoose={(id) => onDone(id, f.orders.find((o) => o.id === id).impact)}
    />
  );
}

// The bargain at Casablanca, from each chair (src/command.ts, CONFERENCES). Claims: claims/rivalries-and-effort-round1.json.
const CONFERENCE_PAPERS = {
  british: {
    title: "Casablanca: The Date and the Mediterranean",
    text: [
      "In January 1943 the Combined Chiefs of Staff meet at Casablanca. General Marshall wants a firm commitment to a landing in France. Brooke and the British staff want Sicily next and the Mediterranean kept open, and Admiral King says the war against Japan receives some fifteen per cent of the Allied effort and needs more.",
      "In the record the British carried Sicily, and the date for France was fixed at the next conference, in Washington in May: May 1944.",
    ],
    orders: {
      record: { label: "Sicily now, and a date for France in 1944", note: "The record's compromise." },
      mediterranean: { label: "Press for the Mediterranean first, with no date for France", note: "Anzio: one chit more; Arnhem: one fewer; Initiative +1. The Americans may refuse ({chance}% they accept); refused, Initiative −2." },
      france: { label: "Give Marshall a landing in France in 1943", note: "Anzio: one chit fewer; Arnhem: one more; Manpower −1." },
    },
  },
  american: {
    title: "Casablanca: Sicily, France and Thirty Per Cent",
    text: [
      "In January 1943 the Combined Chiefs of Staff meet at Casablanca. The British want Sicily next. Marshall wants the landing in France, and King wants thirty per cent of the Allied effort for the war against Japan, not fifteen.",
      "In the record the Americans accepted Sicily, the Pacific had about as much as King asked for in fact if not on paper, and the date for France was fixed in May: May 1944.",
    ],
    orders: {
      record: { label: "Accept Sicily, and a date for France in 1944", note: "The record's compromise." },
      france: { label: "Hold out for France in 1943, and no Sicily", note: "The Bulge: one chit more; Manpower −1. The British may refuse ({chance}% they accept); refused, Initiative −1." },
      pacific: { label: "Concede the Mediterranean for thirty per cent of the effort for the Pacific", note: "The Philippine Sea: one chit more; the Bulge: one fewer. The British may refuse ({chance}% they accept); refused, Initiative −1." },
    },
  },
};

/** The paper before the conference report: an order, a roll if it is a bargain, and what came of it. */
function ConferenceScreen({ campaign, command, conference, meters, onDone }) {
  const paper = CONFERENCE_PAPERS[command];
  const chance = bargainChance(meters);
  const [outcome, setOutcome] = useState(null);
  function choose(id) {
    const o = conference.options.find((x) => x.id === id);
    const accepted = !o.roll || Math.random() * 100 < chance;
    setOutcome({ id, accepted, result: accepted ? o.result : "refused", impact: accepted ? o.impact : conference.refused });
  }
  const resultText = outcome
    ? outcome.id === "record"
      ? t("The compromise is agreed, as it was in the record.")
      : outcome.accepted
      ? t("The other delegation accepts.") + (impactText(outcome.impact) ? " " + impactText(outcome.impact) + "." : "")
      : t("The other delegation refuses, and the record's compromise stands.") + " " + impactText(outcome.impact) + "."
    : null;
  return (
    <StaffPaper
      campaign={campaign}
      kicker={t("THE CONFERENCE")}
      dateline={t("January 1943")}
      title={paper.title}
      text={paper.text}
      orders={conference.options.map((o) => ({ id: o.id, label: paper.orders[o.id].label, note: paper.orders[o.id].note.replace("{chance}", String(chance)) }))}
      onChoose={choose}
      result={resultText}
      onContinue={() => onDone(outcome.result, outcome.impact)}
    />
  );
}
