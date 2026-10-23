// A real houndstooth: the 2/2 twill with four threads of each colour (the weave's colour at (i, j) is the warp thread's if (i + j) % 4 < 2, else the weft's).
// `node scripts/houndstooth.mjs [dark] [light] [cell]` prints a CSS data URI for the tile; index.css and the itch artwork use it.
export function houndstooth(dark = "#241a11", light = "#3d2f20", cell = 3) {
  const thread = (k) => (k % 8 < 4 ? 1 : 0);
  const rects = [];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const warm = (i + j) % 4 < 2 ? thread(j) : thread(i);
      if (warm) rects.push(`M${j * cell} ${i * cell}h${cell}v${cell}h-${cell}z`);
    }
  }
  const size = 8 * cell;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'><rect width='${size}' height='${size}' fill='${dark}'/><path d='${rects.join("")}' fill='${light}'/></svg>`;
  return { svg, size, uri: `url("data:image/svg+xml,${svg.replace(/#/g, "%23").replace(/</g, "%3C").replace(/>/g, "%3E")}")` };
}

if (process.argv[1]?.endsWith("houndstooth.mjs")) {
  const [, , dark, light, cell] = process.argv;
  console.log(houndstooth(dark, light, cell ? Number(cell) : undefined).uri);
}
