// =============================================================================
// THE STAFF'S READING: THE PANEL
// =============================================================================
//
// On a report that carries beliefs (68-intel.jsx): each belief with the grade the staff gave it, a button to check it, and, once checked (or at once, in
// easy mode), whether it held and what the truth was. The orders that rest on a belief say so.

const GRADE_TAG = { firm: "Reported as firm", doubtful: "Doubtful", poor: "Poor" };

function IntelPanel({ nodeId, flags, easy, hard, onCheck }) {
  const items = intelItemsAt(nodeId);
  if (!items.length) return null;
  const left = intelChecksLeft(flags, hard);
  return (
    <section className="dg-intel" aria-label="What the staff believes">
      <h2 className="dg-sect">What the staff believes</h2>
      <ul className="dg-bel">
        {items.map((it) => {
          const known = easy || intelChecked(flags, nodeId, it.id);
          return (
            <li key={it.id}>
              <span className={"dg-gtag dg-g-" + it.grade}>{GRADE_TAG[it.grade]}</span> {it.text} <span className="dg-bel-src">Source: {it.source}.</span>
              {known ? (
                <p className="dg-note"><b>{it.holds ? "The staff is divided, but the reports lean toward it." : "The staff is divided, and the reports lean against it."}</b> {it.truth}</p>
              ) : (
                <p><button className="dg-btn" disabled={left < 1} onClick={() => onCheck(it.id)}>{left < 1 ? "No checks left" : "Check it (" + left + " left)"}</button></p>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** The few conditions a report opens with: how old its news is, the usual weather, the state of the railways, the guns that were fired, and the advisers who are trusted or silent. */
function ConditionsStrip({ campaignId, node, flags, meters }) {
  if (!node || node.ending) return null;
  const iso = mapDate(campaignId, node.date);
  const age = reportAge(campaignId, iso, flags);
  const weather = usualWeather(campaignId, iso);
  const rail = strandReadout("munitions", flags || {}, meters).find((r) => r.id === "rail");
  const guns = bombardmentAt(node.id);
  const camp = CAMPAIGNS[campaignId];
  const names = (state) => (camp.advisors || []).filter((a) => advisersHere(node, a) && adviserState(flags || {}, a.id) === state).map((a) => a.name);
  const trusted = names("trusted");
  const quiet = names("quiet");
  return (
    <ul className="dg-cond" aria-label="Conditions">
      <li>News {age.text}</li>
      {weather && <li>Usually {weather.toLowerCase()}</li>}
      {rail && <li>Rail: {rail.band.toLowerCase()}</li>}
      {guns && <li className="dg-cond-guns">{guns}</li>}
      {trusted.length > 0 && <li>Trusted: {trusted.join(", ")}</li>}
      {quiet.length > 0 && <li>Silent: {quiet.join(", ")}</li>}
    </ul>
  );
}

/** Whether an adviser is at the headquarters on the report's date (the dossier's years, as 54-resolve's advisorsPresent reads them). */
function advisersHere(node, adviser) {
  return (node.advisorsPresent || []).some((a) => (typeof a === "string" ? a === adviser.id : a.id === adviser.id));
}

/** The line under an order that rests on a belief: that it does, and how it stands. "" when the order rests on none. */
function intelRests(nodeId, choice, flags, easy) {
  const items = intelItemsAt(nodeId).filter((it) => it.relied.includes(choice.id));
  if (!items.length) return "";
  const states = items.map((it) => (easy || intelChecked(flags, nodeId, it.id) ? (it.holds ? "held" : "wrong") : "open"));
  if (states.includes("wrong")) return "Rests on a belief the staff now doubts.";
  if (states.includes("open")) return "Rests on a belief the staff has not checked.";
  return "Rests on a belief the staff has come to trust.";
}
