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
              <span className={"dg-gtag dg-g-" + it.grade}>{GRADE_TAG[it.grade]}</span> {it.text}
              {known ? (
                <p className="dg-note"><b>{it.holds ? "The staff is divided, but the reports lean toward it." : "The staff is divided, and the reports lean against it."}</b> {it.truth}</p>
              ) : (
                <p><button className="dg-btn" disabled={left < 1} onClick={() => onCheck(it.id)}>{left < 1 ? "No checks left" : "Check it (" + left + " left)"}</button></p>
              )}
            </li>
          );
        })}
      </ul>
      {!easy && <p className="dg-note">The staff's grade is no guide: firm reports have been wrong and doubtful ones right. A check never settles a belief: the staff argues over what it shows. Checks left in this file: {left}.</p>}
    </section>
  );
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
