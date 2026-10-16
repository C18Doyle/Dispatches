// =============================================================================
// SPECIAL EVENTS: THE SCREEN
// =============================================================================
//
// One event, shown once between two reports (src/67-events.jsx). It has its own screen so that it reads as news from outside the war room and
// not as another decision: the date, a title, two short paragraphs, and a button back to the file. A paper's front page has a masthead, a dateline, a
// headline, a stamp that says it is speculative, and two columns of text.

function EventScreen({ campaignId, event, onContinue }) {
  const c = CAMPAIGNS[campaignId];
  const speculative = /^Speculative\.\s/.test(event.paras[0] || "");
  const paras = event.paras.map((p, i) => (i === 0 && speculative ? p.replace(/^Speculative\.\s+/, "") : p));
  return (
    <main {...rootProps(campaignId, "event")}>
      <div style={{ position: "relative", height: 18 }}><Stamp>{c.seal}</Stamp></div>
      <div className="dg-docrow"><span>{c.docLabel}</span></div>
      {event.paper ? (
        <article className="dg-paper">
          <div className="dg-paper-mast">{event.paper.name}</div>
          <div className="dg-paper-date"><span>{event.paper.place}</span><span>{nodeDate(campaignId, event.date)}</span></div>
          {speculative && <span className="dg-paper-stamp">Speculative</span>}
          <h1 className="dg-paper-title">{event.title}</h1>
          <div className="dg-paper-cols">
            {paras.map((p, i) => <p key={i} className={i === 0 ? "dg-paper-first" : ""}>{p}</p>)}
          </div>
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
