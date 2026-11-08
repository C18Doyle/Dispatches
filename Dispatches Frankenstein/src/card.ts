/**
 * The saved card: a picture of an ending to keep or post. Drawn on a canvas with no library, from what the ending screen already shows (the title and
 * headline, how it is remembered, the record, what the run carried) and the game's own colours. Nothing is sent anywhere: the card is a file the player
 * saves or hands to the system share sheet.
 */

export interface CardData {
  kindLabel: string;
  title: string;
  headline: string;
  remembered?: string;
  stats: { label: string; value: string }[];
  reserves: { label: string; value: string }[];
  carried: string[];
  challenge?: string;
  footer: string;
}

const W = 1080;
const H = 1350;
const C = { void: "#0a0a0a", void2: "#141414", parchment: "#EDEAE0", brass: "#8f887a", brassBright: "#b8b2a2", ash: "#a39e92", blood: "#BE2A26" };

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(next).width > maxWidth) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

/** Draw wrapped, centred text from y downward; returns the y below the last line. */
function paragraph(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number, maxLines = 99): number {
  ctx.textAlign = "center";
  for (const l of wrap(ctx, text, maxWidth).slice(0, maxLines)) {
    ctx.fillText(l, x, y);
    y += lineHeight;
  }
  return y;
}

/** The card as a PNG, or null where there is no canvas (an old browser, a test page). */
export async function makeCard(data: CardData): Promise<Blob | null> {
  try {
    await Promise.all(["700 40px Cinzel", "400 40px 'IM Fell English'", "italic 400 40px 'IM Fell English'", "400 60px 'Pirata One'"].map((f) => document.fonts.load(f)));
  } catch {
    /* fonts are a nicety: the fallback faces draw the card */
  }
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, C.void2);
  g.addColorStop(1, C.void);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = C.brass;
  ctx.lineWidth = 3;
  ctx.strokeRect(34, 34, W - 68, H - 68);
  ctx.lineWidth = 1;
  ctx.strokeRect(46, 46, W - 92, H - 92);
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "center";

  ctx.fillStyle = C.brass;
  ctx.font = "600 26px Cinzel, Georgia, serif";
  ctx.fillText("A  D I S P A T C H E S  C H R O N I C L E", W / 2, 112);
  ctx.fillStyle = C.parchment;
  ctx.font = "400 78px 'Pirata One', Georgia, serif";
  ctx.fillText("Frankenstein", W / 2, 214);
  ctx.fillStyle = C.brass;
  ctx.font = "400 24px Cinzel, Georgia, serif";
  ctx.fillText("T H E   M O D E R N   P R O M E T H E U S", W / 2, 258);

  let y = 360;
  ctx.fillStyle = data.kindLabel === "" ? C.brass : C.blood;
  ctx.font = "600 26px Cinzel, Georgia, serif";
  ctx.fillText(data.kindLabel.toUpperCase().split("").join(" "), W / 2, y);
  y += 96;
  ctx.fillStyle = C.parchment;
  ctx.font = "700 76px Cinzel, Georgia, serif";
  y = paragraph(ctx, data.title, W / 2, y, W - 200, 88, 3);
  ctx.fillStyle = C.ash;
  ctx.font = "600 23px Cinzel, Georgia, serif";
  y = paragraph(ctx, data.headline.toUpperCase(), W / 2, y + 14, W - 220, 34, 4);
  if (data.remembered) {
    y += 26;
    ctx.fillStyle = C.parchment;
    ctx.font = "italic 400 34px 'IM Fell English', Georgia, serif";
    y = paragraph(ctx, data.remembered, W / 2, y, W - 220, 44, 2);
  }

  // what the run carried
  if (data.carried.length) {
    y += 34;
    ctx.fillStyle = C.brass;
    ctx.font = "600 20px Cinzel, Georgia, serif";
    ctx.fillText("W H A T   Y O U   C A R R I E D", W / 2, y);
    y += 40;
    ctx.fillStyle = C.brassBright;
    ctx.font = "italic 400 28px 'IM Fell English', Georgia, serif";
    for (const line of data.carried.slice(0, 3)) y = paragraph(ctx, line, W / 2, y, W - 240, 38, 2);
  }

  // the record
  const ry = Math.max(y + 60, H - 340);
  ctx.strokeStyle = "rgba(143,136,122,0.5)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(140, ry - 38);
  ctx.lineTo(W - 140, ry - 38);
  ctx.stroke();
  const row = (items: { label: string; value: string }[], yy: number) => {
    const col = (W - 240) / items.length;
    items.forEach((it, i) => {
      const cx = 120 + col * i + col / 2;
      ctx.textAlign = "center";
      ctx.fillStyle = C.ash;
      ctx.font = "400 20px Cinzel, Georgia, serif";
      ctx.fillText(it.label.toUpperCase(), cx, yy);
      ctx.fillStyle = C.parchment;
      ctx.font = "700 34px Cinzel, Georgia, serif";
      ctx.fillText(it.value, cx, yy + 44);
    });
  };
  row(data.stats, ry);
  row(data.reserves, ry + 112);
  if (data.challenge) {
    ctx.fillStyle = C.blood;
    ctx.font = "600 22px Cinzel, Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText(data.challenge.toUpperCase(), W / 2, ry + 214);
  }

  ctx.fillStyle = C.brass;
  ctx.font = "400 22px Cinzel, Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText(data.footer, W / 2, H - 78);

  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), "image/png"));
}

/** Hand the card to the system share sheet when there is one that takes files, else save it as a download. Returns what happened, in a few words. */
export async function shareOrSave(blob: Blob, fileName: string, title: string): Promise<string> {
  const file = new File([blob], fileName, { type: "image/png" });
  const nav = navigator as Navigator & { canShare?: (d: { files: File[] }) => boolean };
  try {
    if (nav.canShare?.({ files: [file] }) && nav.share) {
      await nav.share({ files: [file], title });
      return "Shared.";
    }
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") return "";
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  return "Card saved.";
}
