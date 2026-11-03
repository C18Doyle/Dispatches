// =============================================================================
// SPECIAL EVENTS: THE SCREEN
// =============================================================================
//
// One event, shown once between two reports (src/67-events.jsx). It has its own screen so that it reads as news from outside the war room and
// not as another decision: the date, a title, two short paragraphs, and a button back to the file. A paper's front page is set as the paper would set it: a
// masthead, a dateline with the weekday in the paper's language, a headline, a line saying whom it is from, two justified columns and a drop capital. The page says
// at its foot, in small type, that it is not in the record.

const PAPER_LANG = {
  "Le Temps": "fr", "Le Matin": "fr", "Le Figaro": "fr",
  "Corriere della Sera": "it", "Il Secolo": "it",
  "Berliner Tageblatt": "de", "Frankfurter Zeitung": "de", "The Frankfurter Zeitung": "de", "Neue Freie Presse": "de",
};
const PAPER_DAYS = {
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  fr: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"],
  it: ["domenica", "luned\u00EC", "marted\u00EC", "mercoled\u00EC", "gioved\u00EC", "venerd\u00EC", "sabato"],
  de: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
};
const PAPER_MONTHS = {
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  fr: ["janvier", "f\u00E9vrier", "mars", "avril", "mai", "juin", "juillet", "ao\u00FBt", "septembre", "octobre", "novembre", "d\u00E9cembre"],
  it: ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"],
  de: ["Januar", "Februar", "M\u00E4rz", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
};
const PAPER_BY = { en: "From our correspondent", fr: "De notre correspondant", it: "Dal nostro corrispondente", de: "Von unserem Korrespondenten" };

/** A date as the paper would print it: "Samedi 5 f\u00E9vrier 1916", "Saturday, 5 February 1916", "Samstag, den 5. Februar 1916". */
function paperDate(lang, iso) {
  const d = new Date(iso + "T12:00:00Z");
  const day = d.getUTCDate();
  const wd = PAPER_DAYS[lang][d.getUTCDay()];
  const mon = PAPER_MONTHS[lang][d.getUTCMonth()];
  const yr = d.getUTCFullYear();
  if (lang === "en") return `${wd}, ${day} ${mon} ${yr}`;
  if (lang === "de") return `${wd}, den ${day}. ${mon} ${yr}`;
  if (lang === "fr") return `${wd} ${day === 1 ? "1er" : day} ${mon} ${yr}`;
  return `${wd} ${day} ${mon} ${yr}`;
}

function EventScreen({ campaignId, event, onContinue }) {
  const c = CAMPAIGNS[campaignId];
  const lang = (event.paper && PAPER_LANG[event.paper.name]) || "en";
  const paras = event.paras.map((p, i) => (i === 0 ? p.replace(/^Speculative\.\s+/, "") : p));
  return (
    <main {...rootProps(campaignId, "event")}>
      <div style={{ position: "relative", height: 18 }}><Stamp>{c.seal}</Stamp></div>
      <div className="dg-docrow"><span>{c.docLabel}</span></div>
      {event.paper ? (
        <article className="dg-paper">
          <div className={"dg-paper-mast " + lang}>{event.paper.name.replace(/^The /, lang === "en" ? "The " : "")}</div>
          <div className="dg-paper-date"><span>{event.paper.place}</span><span>{paperDate(lang, mapDate(campaignId, event.date))}</span></div>
          <h1 className="dg-paper-title">{event.title}</h1>
          <p className="dg-paper-by">{PAPER_BY[lang]}</p>
          <div className="dg-paper-cols">
            {paras.map((p, i) => <p key={i} className={i === 0 ? "dg-paper-first" : ""}>{p}</p>)}
          </div>
          <p className="dg-paper-foot"><span className="dg-offrecord">Not in the record</span></p>
        </article>
      ) : (
        <>
          <p className="dg-kind dg-event-kind">{event.kind}</p>
          <div className="dg-node-date">{nodeDate(campaignId, event.date)}</div>
          <h1 className="dg-node-title">{event.title}</h1>
          {event.paras.map((p, i) => <p key={i} className={"dg-prose" + (i === 0 ? " dg-lede" : "")}>{p}</p>)}
        </>
      )}
      <button className="dg-btn dg-go" onClick={onContinue}>Continue</button>
    </main>
  );
}
