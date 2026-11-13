#!/usr/bin/env node
// Re-encodes the archive photographs (assets/photos/*.jpg) as WebP with Chromium's own encoder, so nothing has to be installed, and removes
// the JPEG when the WebP is smaller. Every browser the game supports reads WebP (Safari from version 14). Run it after adding a photograph:
//   node tools/optimise-photos.mjs            (quality 0.8; --quality=0.7 to change)
import { chromium } from "playwright";
import { readdirSync, readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIR = join(ROOT, "assets", "photos");
const Q = Number((process.argv.find((a) => a.startsWith("--quality=")) || "--quality=0.8").slice(10));
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent("<html><body></body></html>");
let before = 0;
let after = 0;
for (const f of readdirSync(DIR).filter((x) => x.endsWith(".jpg")).sort()) {
  const jpg = readFileSync(join(DIR, f));
  const b64 = await page.evaluate(
    async ([data, q]) => {
      const img = new Image();
      img.src = "data:image/jpeg;base64," + data;
      await img.decode();
      const c = document.createElement("canvas");
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      c.getContext("2d").drawImage(img, 0, 0);
      return c.toDataURL("image/webp", q).split(",")[1];
    },
    [jpg.toString("base64"), Q]
  );
  const webp = Buffer.from(b64, "base64");
  before += jpg.length;
  if (webp.length < jpg.length) {
    writeFileSync(join(DIR, f.replace(/\.jpg$/, ".webp")), webp);
    unlinkSync(join(DIR, f));
    after += webp.length;
    console.log(`${f}: ${(jpg.length / 1024).toFixed(0)} KB -> ${(webp.length / 1024).toFixed(0)} KB webp`);
  } else {
    after += jpg.length;
    console.log(`${f}: kept as JPEG (WebP was not smaller)`);
  }
}
await browser.close();
console.log(`\nphotos: ${(before / 1048576).toFixed(2)} MB -> ${(after / 1048576).toFixed(2)} MB`);
