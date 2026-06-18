import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const iconsDir = join(root, "public", "icons");
const svg = await readFile(join(iconsDir, "icon.svg"));

await mkdir(iconsDir, { recursive: true });

async function writePng(name, size, padding = 0) {
  const inner = size - padding * 2;
  const png = await sharp(svg)
    .resize(inner, inner)
    .extend({
      top: padding,
      bottom: padding,
      left: padding,
      right: padding,
      background: { r: 23, g: 23, b: 23, alpha: 1 },
    })
    .png()
    .toBuffer();
  await writeFile(join(iconsDir, name), png);
}

await writePng("icon-192.png", 192);
await writePng("icon-512.png", 512);
await writePng("icon-maskable-512.png", 512, 64);

console.log("PWA icons generated in public/icons/");
