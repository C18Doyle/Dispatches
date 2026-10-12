// =============================================================================
// THE SHAREABLE FILE: THE CARD
// =============================================================================
//
// Shown under the rank when a file closes. The card is the summary of 65-share.jsx drawn as a page; it can be copied as text, saved as a picture
// (drawn on a canvas, never uploaded) or printed. Where the clipboard is not available the text is shown to be selected by hand.

/** Draw the card on a canvas and return it. The picture is always the dark page, whatever the colours chosen in the settings. */
function drawShareCard(sum) {
  const W = 1080;
  const H = 1350;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const g = canvas.getContext("2d");
  if (!g) return null;
  const serif = '"EB Garamond","Iowan Old Style","Palatino Linotype",Palatino,"Book Antiqua",Georgia,serif';
  const INK = "#ece5d0";
  const SOFT = "#b8ad90";
  const RULE = "#867d68";
  g.fillStyle = "#0a0908";
  g.fillRect(0, 0, W, H);
  g.strokeStyle = INK;
  g.lineWidth = 3;
  g.strokeRect(48, 48, W - 96, H - 96);
  g.strokeStyle = RULE;
  g.lineWidth = 1;
  g.strokeRect(62, 62, W - 124, H - 124);
  const wrap = (text, x, y, maxW, lh, font, color) => {
    g.font = font;
    g.fillStyle = color;
    const words = String(text).split(" ");
    let line = "";
    for (const w of words) {
      const t = line ? line + " " + w : w;
      if (g.measureText(t).width > maxW && line) { g.fillText(line, x, y); y += lh; line = w; } else line = t;
    }
    if (line) { g.fillText(line, x, y); y += lh; }
    return y;
  };
  g.textAlign = "center";
  g.fillStyle = SOFT;
  g.font = `28px ${serif}`;
  g.fillText("A  G A M E  O F  T H E  S T A F F  T A B L E", W / 2, 150);
  g.fillStyle = INK;
  g.font = `bold 84px ${serif}`;
  g.fillText(sum.game.toUpperCase(), W / 2, 250);
  g.fillStyle = RULE;
  g.fillRect(140, 285, W - 280, 2);
  g.textAlign = "left";
  let y = wrap(sum.command, 120, 370, W - 240, 52, `38px ${serif}`, SOFT);
  y = wrap(sum.ending, 120, y + 40, W - 240, 84, `bold 76px ${serif}`, INK);
  if (sum.badge) {
    g.font = `30px ${serif}`;
    const bw = g.measureText(sum.badge.toUpperCase()).width + 48;
    g.strokeStyle = "#e8664e";
    g.lineWidth = 4;
    g.strokeRect(120, y + 10, bw, 58);
    g.fillStyle = "#e8664e";
    g.fillText(sum.badge.toUpperCase(), 144, y + 50);
    y += 110;
  }
  if (sum.rank) {
    g.fillStyle = INK;
    g.font = `bold 64px ${serif}`;
    g.fillText(sum.rank, 120, y + 50);
    g.fillStyle = SOFT;
    g.font = `34px ${serif}`;
    g.fillText(`${sum.score} out of 100, ${sum.mode}`, 120, y + 100);
    y += 150;
  }
  g.fillStyle = RULE;
  g.fillRect(120, y, W - 240, 2);
  y += 60;
  y = wrap(sum.facts.join(", ") + ".", 120, y, W - 240, 46, `34px ${serif}`, INK);
  if (sum.departures.length) {
    y += 34;
    g.fillStyle = SOFT;
    g.font = `28px ${serif}`;
    g.fillText("ORDERS THAT LEFT THE RECORD", 120, y);
    y += 20;
    for (const d of sum.departures) {
      g.fillStyle = INK;
      g.font = `bold 32px ${serif}`;
      y += 54;
      g.fillText(d.node, 120, y);
      y = wrap(d.label, 120, y + 40, W - 240, 40, `italic 30px ${serif}`, SOFT);
    }
    if (sum.more > 0) { g.fillStyle = SOFT; g.font = `italic 30px ${serif}`; g.fillText(`and ${sum.more} more`, 120, y + 20); }
  }
  g.textAlign = "center";
  g.fillStyle = RULE;
  g.font = `26px ${serif}`;
  g.fillText("This file is kept on this device only.", W / 2, H - 100);
  return canvas;
}

function ShareCard({ campaignId, endingId, rank, taken, flags, mode }) {
  const sum = useMemo(() => shareSummary({ campaignId, endingId, rank, taken, flags, mode }), [campaignId, endingId, rank, taken, flags, mode]);
  const [note, setNote] = useState("");
  const [showText, setShowText] = useState(false);
  const area = useRef(null);
  const copy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(sum.text);
        setNote("Copied.");
        return;
      }
    } catch (e) { /* the clipboard was refused */ }
    setShowText(true);
    setNote("Select the text below and copy it.");
  };
  useEffect(() => { if (showText && area.current) { area.current.focus(); area.current.select(); } }, [showText]);
  const save = () => {
    let canvas = null;
    try { canvas = drawShareCard(sum); } catch (e) { canvas = null; }
    if (!canvas || !canvas.toBlob) { setNote("This browser cannot draw the picture. Copy the text instead."); return; }
    canvas.toBlob((blob) => {
      if (!blob) { setNote("The picture could not be made."); return; }
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `dispatches-1914-${campaignId}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      setNote("Saved as a picture.");
    }, "image/png");
  };
  const print = () => { try { window.print(); } catch (e) { setNote("This browser cannot print from here."); } };
  return (
    <section className="dg-share" aria-label="Share this file">
      <h2 className="dg-order">Share this file</h2>
      <div className="dg-sharecard">
        <div className="dg-sc-top">{sum.game}</div>
        <div className="dg-sc-cmd">{sum.command}</div>
        <div className="dg-sc-end">{sum.ending}</div>
        {sum.badge && <div className="dg-sc-badge">{sum.badge}</div>}
        {sum.rank && <div className="dg-sc-rank"><b>{sum.rank}</b> {sum.score} out of 100, {sum.mode}</div>}
        <p className="dg-sc-facts">{sum.facts.join(", ")}.</p>
        {sum.departures.length > 0 && (
          <>
            <div className="dg-sc-h">Orders that left the record</div>
            <ul className="dg-sc-list">
              {sum.departures.map((d, i) => <li key={i}><b>{d.node}.</b> {d.label}</li>)}
              {sum.more > 0 && <li>and {sum.more} more</li>}
            </ul>
          </>
        )}
      </div>
      <div className="dg-share-btns">
        <button className="dg-btn" onClick={copy}>Copy as text</button>
        <button className="dg-btn" onClick={save}>Save as a picture</button>
        <button className="dg-btn" onClick={print}>Print</button>
      </div>
      <p className="dg-note" role="status" aria-live="polite">{note}</p>
      {showText && <textarea ref={area} className="dg-share-text" readOnly aria-label="The file as text" value={sum.text} onFocus={(e) => e.target.select()} />}
    </section>
  );
}
