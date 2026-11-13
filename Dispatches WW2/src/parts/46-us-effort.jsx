// ---------- THE AMERICAN EFFORT SPLIT (Dispatches WW2) ----------
// Once a year from 1942, once Arcadia has opened the war in Europe, the Joint Chiefs share the year's effort between Germany and Japan
// (src/effort.ts holds the arithmetic). The screen is shown before the year's first briefing while the year has no allocation, so a save, a
// resume or a rewind to before the choice shows it again. Each year's paper says what was argued and what the record did.
const EFFORT_PAPERS = {
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
};

const ALLOCATION_LABELS = {
  germanyFirst: () => t("Germany First: the main weight of men, ships and aircraft goes to the war against Germany"),
  even: () => t("An Even Hand: the two wars have about equal shares of the year's effort"),
  pacificFirst: () => t("Pacific First: the main weight of men, ships and aircraft goes to the war against Japan"),
};
const ALLOCATION_NAMES = {
  germanyFirst: () => t("Germany First"),
  even: () => t("An Even Hand"),
  pacificFirst: () => t("Pacific First"),
};

/** "odds as written", "odds 6 points better", "odds 6 points worse". */
function effortOddsText(n) {
  if (!n) return t("odds as written");
  return n > 0 ? t("odds {n} points better", { n }) : t("odds {n} points worse", { n: -n });
}

function EffortScreen({ campaign, year, onChoose }) {
  const paper = EFFORT_PAPERS[year];
  const tint = "#eef2f6";
  const headingRef = useRef(null);
  useEffect(() => {
    if (headingRef.current) headingRef.current.focus();
  }, [year]);
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
            <div className="text-[11px] text-[#444] mt-0.5">{t("Joint Chiefs of Staff, {year}", { year })}</div>
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
            {t("The share moves the odds of this year's contested orders in both theatres. The meters do not move.")}
          </div>
        </div>
        <div className="wire-tear wire-tear-bottom" style={{ "--wire-paper": tint }}></div>
        <div role="group" aria-label={t("Allocation of effort, {year}", { year })} className="mt-4 flex flex-col gap-2">
          {ALLOCATIONS.map((a) => {
            const eff = allocationEffect(a, year);
            const isRecord = RECORD_ALLOCATION[year] === a;
            return (
              <button
                key={a}
                data-hotkey={String(ALLOCATIONS.indexOf(a) + 1)}
                onClick={() => onChoose(a)}
                className="text-left border-2 px-4 py-3 text-[#000000] hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f] group"
                style={{ borderColor: campaign.accent, background: tint, fontFamily: "'Courier Prime', monospace" }}
              >
                <span className="block text-[15px] font-bold">{ALLOCATION_LABELS[a]()}</span>
                <span className="block mt-1 text-[12px]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                  {t("In Europe, {europe}. In the Pacific, {pacific}.", { europe: effortOddsText(eff.europe), pacific: effortOddsText(eff.pacific) })}
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

/** The allocations of the file, year by year, for the end of the war: what the Joint Chiefs chose, and what the record did. */
function EffortRecord({ flags, accent }) {
  const rows = allocationRecord(flags);
  if (!rows.length) return null;
  return (
    <div>
      <ul className="text-[13px] text-[#000000]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
        {rows.map((r) => (
          <li key={r.year} className="py-1" style={{ borderBottom: `1px solid ${accent}33` }}>
            {r.chosen === r.record
              ? t("{year}: {chosen}, as the record did", { year: r.year, chosen: ALLOCATION_NAMES[r.chosen]() })
              : t("{year}: {chosen}; the record: {record}", { year: r.year, chosen: ALLOCATION_NAMES[r.chosen](), record: ALLOCATION_NAMES[r.record]() })}
          </li>
        ))}
      </ul>
    </div>
  );
}

