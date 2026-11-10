const SHARE_CARD_W = 1200;
// THE SHARE CARD: one picture of an ended file for itch.io or a post: the command, the rank, the ending, the judgement against the record and the map at the end of the war.
// It is drawn as an SVG of its own (system fonts only, since a picture made of SVG cannot load the page's web fonts), turned into a PNG on a canvas, and either
// shared as a file (where the browser can) or saved. tools/check-share-card.mjs proves the SVG is well formed and escapes what it prints.

const SHARE_CARD_H = 630;

const xmlEscape = (t) => String(t == null ? "" : t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** A line of text broken into lines of at most `chars` characters at the spaces, at most `max` lines (the last ends with an ellipsis when the text is cut). */
function shareWrap(text, chars, max) {
  const words = String(text || "").split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  for (const w of words) {
    if ((line + " " + w).trim().length > chars && line) {
      lines.push(line);
      line = w;
    } else line = (line + " " + w).trim();
  }
  if (line) lines.push(line);
  if (lines.length > max) {
    const kept = lines.slice(0, max);
    kept[max - 1] = kept[max - 1].replace(/[ ,.;:]+$/, "") + "…";
    return kept;
  }
  return lines;
}

/**
 * The card as an SVG string. d = { campaign: { name, seal, accent, id }, modeLabel, rank, score, ending, tier, endStamp, matched, comparable, outperformed,
 * statuses: { regionId: status } or null, geometry, bbox }.
 */
function shareCardSvg(d) {
  const mono = "'Courier New', Courier, monospace";
  const serif = "Georgia, 'Times New Roman', serif";
  const accent = (d.campaign && d.campaign.accent) || "#7a2e2e";
  let regions = "";
  if (d.statuses && d.geometry && d.bbox) {
    for (const r of MAP_REGIONS) {
      const entry = d.geometry[r.id];
      const status = d.statuses[r.id];
      const fill = status === "divided" ? STATUS_COLORS.allied : STATUS_COLORS[status];
      const path = fill && entry && regionPathD(entry.rings, d.bbox);
      if (path) regions += `<path d="${path}" fill="${fill}" fill-opacity="0.85" stroke="#2a2015" stroke-width="1.4" stroke-opacity="0.7"/>`;
    }
  }
  const ending = shareWrap(d.ending, 30, 3);
  const judgement = d.comparable > 0 ? shareWrap(t("Chose the historical option at {matched} of {comparable} comparable decisions and out-positioned it at {outperformed}.", { matched: d.matched, comparable: d.comparable, outperformed: d.outperformed }), 46, 3) : [];
  let y = 150;
  let text = "";
  const put = (s, size, font, fill, weight, spacing) => {
    text += `<text x="64" y="${y}" font-family="${font}" font-size="${size}" font-weight="${weight || 400}" fill="${fill}"${spacing ? ` letter-spacing="${spacing}"` : ""}>${xmlEscape(s)}</text>`;
  };
  put("DISPATCHES 1940", 20, mono, "#241d12", 700, "5");
  y += 38;
  put(`${d.campaign.seal} · ${d.campaign.name}`, 20, mono, accent, 700);
  y += 26;
  if (d.modeLabel) {
    put(d.modeLabel, 16, mono, "#241d12", 400);
    y += 34;
  } else y += 8;
  if (d.rank) {
    put(t("COMMAND RANK"), 14, mono, "#241d12", 700, "4");
    y += 50;
    put(`${d.rank}`, 54, serif, "#1a1410", 700);
    y += 28;
    put(t("{score} of 100", { score: d.score }), 16, mono, "#241d12", 400);
    y += 40;
  }
  for (const l of ending) {
    put(l, 28, serif, "#1a1410", 700);
    y += 34;
  }
  if (d.tier) {
    put(d.tier.toUpperCase(), 14, mono, accent, 700, "3");
    y += 26;
  }
  if (d.endStamp) {
    put(t("End of hostilities: {endStamp}", { endStamp: d.endStamp }), 14, mono, "#241d12", 400);
    y += 26;
  }
  for (const l of judgement) {
    put(l, 15, mono, "#241d12", 400);
    y += 21;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SHARE_CARD_W}" height="${SHARE_CARD_H}" viewBox="0 0 ${SHARE_CARD_W} ${SHARE_CARD_H}">` +
    `<rect width="${SHARE_CARD_W}" height="${SHARE_CARD_H}" fill="#0b0b0b"/>` +
    `<rect x="24" y="24" width="${SHARE_CARD_W - 48}" height="${SHARE_CARD_H - 48}" fill="#f2ead9" stroke="#1a1410" stroke-width="3"/>` +
    `<rect x="64" y="64" width="150" height="46" fill="none" stroke="${accent}" stroke-width="4" transform="rotate(-2 139 87)"/>` +
    `<text x="139" y="96" text-anchor="middle" font-family="${mono}" font-size="24" font-weight="700" fill="${accent}" letter-spacing="3" transform="rotate(-2 139 87)">${xmlEscape(d.campaign.seal)}</text>` +
    `<rect x="632" y="104" width="520" height="390" fill="#b7c9c6" stroke="#1a1410" stroke-width="3"/>` +
    `<clipPath id="card-map"><rect x="632" y="104" width="520" height="390"/></clipPath><g clip-path="url(#card-map)"><g transform="translate(632 104) scale(0.65)">${regions}</g></g>` +
    `<text x="632" y="524" font-family="${mono}" font-size="13" fill="#241d12">${xmlEscape(t("The map at the end of the war (approximate)"))}</text>` +
    text +
    `</svg>`;
}

/** The card as a PNG blob, or null where the browser cannot make one. */
async function shareCardBlob(svg) {
  try {
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
    });
    const canvas = document.createElement("canvas");
    canvas.width = SHARE_CARD_W;
    canvas.height = SHARE_CARD_H;
    canvas.getContext("2d").drawImage(img, 0, 0);
    return await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  } catch (e) {
    return null;
  }
}

/** The button under an ended file: shares the card as a file where the browser can, and saves it where it cannot. */
function ShareCardButton({ build, name, accent }) {
  const [state, setState] = useState("idle");
  const go = async () => {
    setState("working");
    const blob = await shareCardBlob(shareCardSvg(build()));
    if (!blob) {
      setState("failed");
      return;
    }
    try {
      const file = new File([blob], name, { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: "Dispatches 1940" });
        setState("done");
        return;
      }
    } catch (e) {
      /* declined or not supported: save it instead */
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    setState("done");
  };
  return (
    <button
      onClick={go}
      disabled={state === "working"}
      className="border-2 px-5 py-2 uppercase tracking-widest text-sm hover:bg-[#000000] hover:text-[#ffffff] transition-colors duration-150 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#b08d3f]"
      style={{ borderColor: accent, fontFamily: "Oswald, sans-serif" }}
    >
      {state === "working" ? t("Drawing…") : state === "done" ? t("✓ Share card") : state === "failed" ? t("Share card failed: retry") : t("Share Card")}
    </button>
  );
}
