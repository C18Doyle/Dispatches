// =============================================================================
// SPECIAL EVENTS: THE SCREEN
// =============================================================================
//
// One event, shown once between two reports (src/67-events.jsx). It has its own screen so that it reads as news from outside the war room and
// not as another decision: the kind of event, the date, a title, two short paragraphs, and a button back to the file.

function EventScreen({ campaignId, event, onContinue }) {
  const c = CAMPAIGNS[campaignId];
  return (
    <main {...rootProps(campaignId, "event")}>
      <div style={{ position: "relative", height: 18 }}><Stamp>{c.seal}</Stamp></div>
      <div className="dg-docrow"><span>{c.docLabel}</span></div>
      <p className="dg-kind dg-event-kind">Special event · {event.kind}</p>
      <div className="dg-node-date">{nodeDate(campaignId, event.date)}</div>
      <h1 className="dg-node-title">{event.title}</h1>
      {event.paras.map((p, i) => <p key={i} className={"dg-prose" + (i === 0 ? " dg-lede" : "")}>{p}</p>)}
      <p className="dg-note">This is not a decision, and it changes no meter. The file will remember it.</p>
      <button className="dg-btn dg-go" onClick={onContinue}>Continue</button>
    </main>
  );
}
