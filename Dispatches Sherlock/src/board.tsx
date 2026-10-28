import type { GameState } from "@dispatches/engine";
import { def } from "./game";

/**
 * The board tab: what the case has pinned up so far (clues, people, moves), the Professor's web with the arms you have found and cut, and the
 * questions you cannot yet answer. Everything is read from the run's flags; the text is the flag notes in flavor.json.
 */

interface Section {
  title: string;
  flags: string[];
}

export const BOARD_SECTIONS: Section[] = [
  {
    title: "Traces",
    flags: ["clueHeel", "clueCab", "fitchNamed", "dogcart", "yardLearned", "clueDoor", "clueGuide", "studyRead", "ledger", "routeKnown", "followed", "moranHabits", "moranMarked", "ledgeKnown", "clueBook", "clueTitle", "cipherBroken", "buyerNamed", "knowsDeparture", "wharfTide", "wharfMarks", "wharfOil", "wharfPolice", "registerRead", "guideTalks", "formsRead", "pathRead", "cleftSeen"],
  },
  {
    title: "People",
    flags: ["larchTalks", "larchLost", "secretaryTalks", "pawnbrokerTalks", "moleUsed", "moleExposed", "governessSafe", "governessBait", "boyFound", "boyLost", "greavesKnown", "fofClerk", "ministerTurned", "ministerHeld", "printerTurns", "adlerMet", "adlerAbroad", "mycroftAlone", "adlerStatement", "adlerWarned", "adlerDecoy", "adlerWatch", "wharfCarter"],
  },
  {
    title: "What Went Wrong",
    flags: ["raidsEarly", "tideMissed", "professorEarly", "cabinetStarted", "answeredCabs", "answeredMole", "answeredBank", "answeredPaper", "answeredCables"],
  },
  {
    title: "Moves",
    flags: ["houseTaken", "docksTaken", "bankRun", "rivalry", "cabStopped", "moranDown", "warrantsSworn", "watchSet", "homeOfficeWarrant", "readSecond", "lawClause", "crownTerms", "adlerBait", "dsPriest", "dsSailor", "dsClerk", "dayInHand"],
  },
];

interface Question {
  text: string;
  /** Answered once any of these flags is set. */
  answeredBy: string[];
  /** Shown only on these roads (branch ids); absent means all. */
  roads?: string[];
  /** Asked only once this flag is set. */
  after?: string;
}

export const QUESTIONS: Question[] = [
  { text: "Where does the Professor keep his accounts?", answeredBy: ["ledger"] },
  { text: "Who drives the cab that waited in the mews?", answeredBy: ["fitchNamed"] },
  { text: "Where is the Colonel to be found?", answeredBy: ["moranMarked", "moranHabits", "moranDown"] },
  { text: "Who is passing the Yard's secrets?", answeredBy: ["moleExposed", "moleUsed"], roads: ["YARD"] },
  { text: "Where has the Professor gone from his study?", answeredBy: ["studyRead", "cabStopped"], roads: ["YARD"] },
  { text: "What is in the second ledger?", answeredBy: ["readSecond", "cleanHands"], roads: ["MYCROFT"] },
  { text: "How is the Professor's cipher kept?", answeredBy: ["cipherBroken", "clueBook"], roads: ["MYCROFT"] },
  { text: "What does the Professor mean to burn?", answeredBy: ["wharfOil"], roads: ["STREET"] },
  { text: "Who has written the message that will call Watson away?", answeredBy: ["formsRead", "adlerWarned"], roads: ["CONTINENT"] },
  { text: "Where will the Professor sail from?", answeredBy: ["knowsDeparture"], roads: ["MYCROFT"] },
  { text: "Who is buying the Adler letters?", answeredBy: ["buyerNamed"], after: "adlerMet" },
  { text: "Where do the Professor's men drink?", answeredBy: ["routeKnown", "boySent"], roads: ["STREET"] },
  { text: "Where will the Professor go after Monday?", answeredBy: ["watsonStays", "noteLeft", "ledgeKnown"], roads: ["CONTINENT"] },
];

interface Arm {
  id: string;
  name: string;
  /** Flags that say you know of this arm. */
  known: string[];
  /** Flags that say you have cut it. */
  cut: string[];
  /** What he does about it, once it is cut. */
  answer: string;
  /** Some answers have a cost in play (an event in the story): the flag it sets, and the flag that makes you ready for it. */
  answeredBy?: string;
  readyWith?: string;
}

export const ARMS: Arm[] = [
  { id: "moran", name: "The Colonel", known: ["moranSeen", "moranMarked", "moranHabits"], cut: ["moranDown"], answer: "He has told the Colonel's cousin to walk behind the Colonel, and the Colonel to walk where he cannot be seen." },
  { id: "cabs", name: "The cab-yard", known: ["fitchNamed", "yardLearned", "dogcart"], cut: ["cabStopped"], answer: "He has bought the cab-yard through a third name and put its foremen on wages, so that none of them is anybody's man but his.", answeredBy: "answeredCabs", readyWith: "watchSet" },
  { id: "paper", name: "The printer", known: ["governessSafe", "governessBait"], cut: ["printerTurns"], answer: "He has changed his printer. The new one has no machine, only a very good memory.", answeredBy: "answeredPaper", readyWith: "boysStand" },
  { id: "bank", name: "The bank", known: ["ledger", "larchTalks"], cut: ["bankRun"], answer: "He has moved his account to a bank that keeps no book, and told his lieutenants to carry what they need.", answeredBy: "answeredBank", readyWith: "routeKnown" },
  { id: "clerks", name: "The clerks", known: ["larchTalks", "larchLost"], cut: ["secretaryTalks", "pawnbrokerTalks"], answer: "He has made his clerks write to one another in cipher, and has stopped them speaking at the table." },
  { id: "mole", name: "The Yard's man", known: ["moleUsed"], cut: ["moleExposed"], answer: "He has let the Yard's man go with an excellent reference, and bought the next one before the first had cleared his desk.", answeredBy: "answeredMole", readyWith: "warrantsSworn" },
  { id: "docks", name: "The warehouse", known: ["routeKnown", "wharfMarks", "wharfTide"], cut: ["docksTaken"], answer: "He has changed the hour at the wharf, and left the lamp-oil out in the open, as one leaves bait." },
  { id: "house", name: "The study", known: ["clueDoor", "clueGuide"], cut: ["houseTaken", "studyRead"], answer: "He has moved the study's papers to the second house, and left in the first a drawer of very convincing nothing." },
  { id: "men", name: "The lieutenants", known: ["secretaryTalks", "pawnbrokerTalks"], cut: ["rivalry"], answer: "He has put his lieutenants on separate floors, and made each one afraid of the next." },
  { id: "minister", name: "The minister", known: ["ministerHeld", "ministerTurned"], cut: ["readSecond"], answer: "He has written to the Minister, kindly, and enclosed a small and very precise list of dates." },
  { id: "cables", name: "The cables", known: ["clueBook", "clueTitle"], cut: ["cipherBroken"], answer: "He has begun to alter his cipher every Monday, which is the sort of thing a man does who has been read.", answeredBy: "answeredCables", readyWith: "lawClause" },
];

/** What the Professor does about the arms you have cut: the web is his, and he notices. */
export function reaction(cut: number, known: number): string {
  if (cut >= 8) return "He has stopped writing letters. He has begun to write to you.";
  if (cut >= 6) return "He has moved his private papers out of the study, and his violin into the cab.";
  if (cut >= 4) return "He has doubled the watch on his own street, and does not sleep before three.";
  if (cut >= 2) return "He has noticed a draught. He has sent a clerk to find the window.";
  if (cut >= 1) return "One thread has gone slack. He does not yet know which.";
  if (known >= 3) return "He does not yet know that you are looking.";
  return "He knows nothing of you, or wishes it thought so.";
}

const has = (state: GameState, flags: string[]) => flags.some((f) => state.flags[f]);

export function armStatus(state: GameState, arm: Arm): "unknown" | "known" | "cut" {
  if (has(state, arm.cut)) return "cut";
  if (has(state, arm.known)) return "known";
  return "unknown";
}

function Web({ state }: { state: GameState }) {
  const cx = 150;
  const cy = 112;
  const R = 82;
  const status = ARMS.map((a) => armStatus(state, a));
  const cut = status.filter((s) => s === "cut").length;
  const known = status.filter((s) => s !== "unknown").length;
  return (
    <figure className="m-0">
      <svg
        viewBox="0 0 300 224"
        className="w-full h-auto text-ink"
        role="img"
        aria-label={`The Professor's web: ${known} of ${ARMS.length} arms found, ${cut} cut.`}
      >
        {[0.4, 0.7, 1].map((k) => (
          <polygon
            key={k}
            points={ARMS.map((_a, i) => {
              const ang = (i / ARMS.length) * Math.PI * 2 - Math.PI / 2;
              return `${cx + Math.cos(ang) * R * k},${cy + Math.sin(ang) * R * k * 0.88}`;
            }).join(" ")}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.25"
          />
        ))}
        {ARMS.map((a, i) => {
          const ang = (i / ARMS.length) * Math.PI * 2 - Math.PI / 2;
          const x = cx + Math.cos(ang) * R;
          const y = cy + Math.sin(ang) * R * 0.88;
          const s = status[i];
          const color = s === "cut" ? "#7b2a1d" : s === "known" ? "#b8893f" : "currentColor";
          const anchor = Math.cos(ang) > 0.35 ? "start" : Math.cos(ang) < -0.35 ? "end" : "middle";
          const lx = anchor === "start" ? x + 11 : anchor === "end" ? x - 11 : x;
          const ly = anchor === "middle" ? (Math.sin(ang) > 0 ? y + 19 : y - 14) : y + 3;
          return (
            <g key={a.id}>
              <line x1={cx} y1={cy} x2={x} y2={y} stroke={color} strokeWidth={s === "cut" ? 1.6 : 0.9} strokeDasharray={s === "cut" ? "3 4" : s === "known" ? "0" : "2 3"} opacity={s === "unknown" ? 0.4 : 1} />
              <circle cx={x} cy={y} r="8" fill={s === "unknown" ? "none" : s === "cut" ? "#7b2a1d" : "#f1e8d3"} stroke={color} strokeWidth="1.4" opacity={s === "unknown" ? 0.55 : 1} />
              {s === "cut" && <path d={`M${x - 4} ${y - 4}l8 8M${x + 4} ${y - 4}l-8 8`} stroke="#f1e8d3" strokeWidth="1.5" />}
              {s === "unknown" && (
                <text x={x} y={y + 3} fontSize="9" textAnchor="middle" fill="currentColor" opacity="0.55">
                  ?
                </text>
              )}
              <text x={lx} y={ly} fontSize="7.5" textAnchor={anchor} fill={s === "cut" ? "#7b2a1d" : "currentColor"} opacity={s === "unknown" ? 0.45 : 1} style={{ fontFamily: "Rokkitt, Georgia, serif", fontWeight: 700 }}>
                {s === "unknown" ? "Not yet found" : a.name}
              </text>
            </g>
          );
        })}
        <circle cx={cx} cy={cy} r="13" fill="#241b13" />
        <text x={cx} y={cy + 3} fontSize="9" textAnchor="middle" fill="#f1e8d3" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900 }}>
          M
        </text>
      </svg>
      <figcaption className="font-heading text-[0.62rem] uppercase tracking-[0.2em] text-ink-soft mt-1">
        {known} of {ARMS.length} arms found, {cut} cut
      </figcaption>
      <p className="text-sm italic text-ink/85 mt-1">{reaction(cut, known)}</p>
    </figure>
  );
}

export function BoardView({ state, road }: { state: GameState; road: string }) {
  const notes = def.flavor.flagNotes ?? {};
  const pinned = BOARD_SECTIONS.map((s) => ({ ...s, shown: s.flags.filter((f) => state.flags[f] && notes[f]) }));
  const total = pinned.reduce((n, s) => n + s.shown.length, 0);
  const open = QUESTIONS.filter((q) => (!q.roads || q.roads.includes(road)) && (!q.after || state.flags[q.after]) && !has(state, q.answeredBy));
  let k = 0;
  return (
    <div className="space-y-5">
      <div>
        <p className="font-heading text-[0.65rem] uppercase tracking-[0.25em] text-blood font-bold mb-2">Pinned Up</p>
        <div className="cork p-3">
          {total === 0 ? (
            <p className="pin-note text-sm italic text-ink/70">Nothing yet. What you find will be pinned here.</p>
          ) : (
            pinned
              .filter((s) => s.shown.length)
              .map((s) => (
                <div key={s.title} className="mb-3 last:mb-0">
                  <p className="font-heading text-[0.6rem] uppercase tracking-[0.25em] text-parchment font-bold mb-2 drop-shadow">{s.title}</p>
                  <div className="grid grid-cols-2 gap-3">
                    {s.shown.map((f) => {
                      const tilt = ((k++ * 7) % 5) - 2;
                      return (
                        <p key={f} className="pin-note text-[0.82rem] leading-snug text-ink font-hand" style={{ transform: `rotate(${tilt * 0.9}deg)`, fontSize: "1.02rem" }}>
                          {notes[f]}
                        </p>
                      );
                    })}
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
      <div>
        <p className="font-heading text-[0.65rem] uppercase tracking-[0.25em] text-blood font-bold mb-2">The Professor's Web</p>
        <Web state={state} />
        {ARMS.some((a) => armStatus(state, a) === "cut") && (
          <div className="mt-3">
            <p className="font-heading text-[0.6rem] uppercase tracking-[0.25em] text-ink-soft font-bold mb-1">What He Did About It</p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-ink/90">
              {ARMS.filter((a) => armStatus(state, a) === "cut").map((a) => (
                <li key={a.id}>
                  <span className="font-semibold">{a.name}:</span> {a.answer}
                  {a.answeredBy && state.flags[a.answeredBy] ? " It cost you." : a.readyWith && state.flags[a.readyWith] ? " You had made ready for it, and it came to nothing." : ""}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div>
        <p className="font-heading text-[0.65rem] uppercase tracking-[0.25em] text-blood font-bold mb-2">What You Do Not Know</p>
        {open.length ? (
          <ul className="list-disc pl-5 space-y-1 text-sm text-ink/90">
            {open.map((q) => (
              <li key={q.text}>{q.text}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm italic text-ink/70">Nothing that you have not, at least, a guess at.</p>
        )}
      </div>
    </div>
  );
}
