/**
 * The share card: a picture of an ending to save or post. Drawn on a canvas, with no library, from what the ending screen already shows: the ending's plate (the
 * live SVG, with the theme's colours written into it, since a standalone SVG cannot read the page's CSS variables), the title and headline, the record, and a footer.
 * Nothing is sent anywhere: the card is a file the player saves or hands to the system share sheet.
 */

export interface CardData {
  seatTitle: string;
  seatSubtitle: string;
  kindLabel: string;
  title: string;
  headline: string;
  remembered?: string;
  stats: { label: string; value: string }[];
  reserves: { label: string; value: string }[];
  footer: string;
}

const W = 1080;
const H = 1350;

const css = (name: string): string => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
const rgb = (name: string, alpha = 1): string => `rgb(${css(name).split(" ").join(" ")} / ${alpha})`;

/** The plate: the banner SVG on the page, cloned, with the artwork's classes given literal colours. */
async function plateImage(svg: SVGSVGElement | null): Promise<HTMLImageElement | null> {
  if (!svg) return null;
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("width", String(W - 120));
  clone.setAttribute("height", String(Math.round(((W - 120) * 120) / 400)));
  const a = (n: string) => css(`--a-${n}`);
  const style = document.createElementNS("http://www.w3.org/2000/svg", "style");
  style.textContent = [
    `.a-moon{fill:${a("moon")}}`,
    `.a-far{fill:${a("far")}}`,
    `.a-sil{fill:${a("sil")}}`,
    `.a-win-fill{fill:${a("win")}}`,
    `.a-fog-fill{fill:${a("fog")}}`,
    `.a-stroke{stroke:${a("sil")}}`,
    `.a-wave{stroke:${a("moon")}}`,
    `.a-st-top{stop-color:${a("skyTop")}}`,
    `.a-st-mid{stop-color:${a("skyMid")}}`,
    `.a-st-low{stop-color:${a("skyLow")}}`,
    `.a-st-moon{stop-color:${a("moon")}}`,
    `.a-st-win{stop-color:${a("win")}}`,
    `.a-st-glow{stop-color:${a("glow")}}`,
    `.a-st-fog{stop-color:${a("fog")}}`,
    `.a-st-blood{stop-color:${rgb("--c-blood-bright")}}`,
    `.a-st-void{stop-color:${rgb("--c-void")}}`,
  ].join("");
  clone.insertBefore(style, clone.firstChild);
  const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(clone));
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

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

/** Draw wrapped text from y downward; returns the y below the last line. */
function paragraph(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number, align: CanvasTextAlign = "center"): number {
  ctx.textAlign = align;
  for (const l of wrap(ctx, text, maxWidth)) {
    ctx.fillText(l, x, y);
    y += lineHeight;
  }
  return y;
}

export async function makeCard(data: CardData, plateSvg: SVGSVGElement | null): Promise<Blob | null> {
  try {
    await Promise.all(["700 40px Cinzel", "400 40px 'IM Fell English'", "italic 400 40px 'IM Fell English'"].map((f) => document.fonts.load(f)));
    const display = css("--font-display") || "'Pirata One'";
    await document.fonts.load(`700 60px ${display}`);
  } catch {
    /* fonts are a nicety: the fallback faces draw the card */
  }
  const display = css("--font-display") || "'Pirata One'";
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // ground, and a double gilt rule
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, rgb("--c-void2"));
  g.addColorStop(1, rgb("--c-void"));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = rgb("--c-brass", 0.9);
  ctx.lineWidth = 3;
  ctx.strokeRect(34, 34, W - 68, H - 68);
  ctx.lineWidth = 1;
  ctx.strokeRect(46, 46, W - 92, H - 92);

  const ink = rgb("--c-bone");
  const brass = rgb("--c-brass");
  const dim = rgb("--c-ash");
  ctx.textBaseline = "alphabetic";

  // heading
  ctx.fillStyle = brass;
  ctx.font = "600 26px Cinzel, Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText(data.seatTitle.toUpperCase().split("").join(" "), W / 2, 112);
  ctx.fillStyle = dim;
  ctx.font = "400 22px Cinzel, Georgia, serif";
  ctx.fillText(data.seatSubtitle.toUpperCase().split("").join(" "), W / 2, 146);

  // the plate
  const plate = await plateImage(plateSvg);
  const px = 60;
  const py = 180;
  const pw = W - 120;
  const ph = Math.round((pw * 120) / 400);
  if (plate) {
    ctx.drawImage(plate, px, py, pw, ph);
    ctx.strokeStyle = rgb("--c-brass", 0.85);
    ctx.lineWidth = 2;
    ctx.strokeRect(px, py, pw, ph);
  }

  // the ending
  let y = py + ph + 90;
  ctx.fillStyle = brass;
  ctx.font = "600 26px Cinzel, Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText(data.kindLabel.toUpperCase().split("").join(" "), W / 2, y);
  y += 90;
  ctx.fillStyle = ink;
  ctx.font = `700 92px ${display}, Georgia, serif`;
  y = paragraph(ctx, data.title, W / 2, y, W - 220, 100);
  y += 6;
  ctx.fillStyle = dim;
  ctx.font = "600 24px Cinzel, Georgia, serif";
  y = paragraph(ctx, data.headline.toUpperCase(), W / 2, y + 14, W - 200, 36);
  if (data.remembered) {
    y += 30;
    ctx.fillStyle = ink;
    ctx.font = "italic 400 36px 'IM Fell English', Georgia, serif";
    y = paragraph(ctx, data.remembered, W / 2, y, W - 220, 46);
  }

  // the record
  const ry = Math.max(y + 56, H - 330);
  ctx.strokeStyle = rgb("--c-brass", 0.5);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(140, ry - 36);
  ctx.lineTo(W - 140, ry - 36);
  ctx.stroke();
  const row = (items: { label: string; value: string }[], yy: number) => {
    const col = (W - 240) / items.length;
    items.forEach((it, i) => {
      const cx = 120 + col * i + col / 2;
      ctx.textAlign = "center";
      ctx.fillStyle = dim;
      ctx.font = "400 20px Cinzel, Georgia, serif";
      ctx.fillText(it.label.toUpperCase(), cx, yy);
      ctx.fillStyle = ink;
      ctx.font = "700 36px Cinzel, Georgia, serif";
      ctx.fillText(it.value, cx, yy + 46);
    });
  };
  row(data.stats, ry);
  row(data.reserves, ry + 120);

  // footer
  ctx.fillStyle = brass;
  ctx.font = "400 24px Cinzel, Georgia, serif";
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
