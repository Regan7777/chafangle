const sharp = require('sharp');
const path = require('path');

const srcPath = 'C:\\Users\\78432\\.gemini\\antigravity-ide\\brain\\0bafeef0-9093-4ca6-a65f-2f336cfed779\\scratch\\user_ref_image.jpg';
const outPath = 'public/images/comic-strip-hd.png';

async function perfectComic() {
  // In user_ref_image.jpg:
  // Comic panels start around y = 1100 (speech bubble 4 top is at y=1103)
  // And ends at y = 1755 (bottom caption)
  // Left: 75, width: 2245, top: 1100, height: 655
  const img = sharp(srcPath);
  const { data, info } = await img
    .extract({ left: 75, top: 1095, width: 2245, height: 660 })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const w = info.width, h = info.height, ch = info.channels;
  const creamR = 244, creamG = 242, creamB = 235;

  // Let's clean any black card remnants or yellow beam remnants at y < 50
  // Specifically:
  // Panel 1 bubble starts at y=35 (x=120..350)
  // Panel 2 bubble starts at y=60 (x=750..950)
  // Panel 3 stamp starts at y=130 (x=1150..1350)
  // Panel 4 bubble starts at y=8 (x=1850..2150)
  // Everything at y < 5 outside panel 4 bubble is cream background!
  for (let y = 0; y < 80; y++) {
    for (let x = 0; x < w; x++) {
      // Is this inside panel 4 speech bubble? (around x=1860..2150, y >= 8)
      const inBubble4 = (x >= 1860 && x <= 2160 && y >= 8);
      // Is this inside panel 1 speech bubble? (around x=130..360, y >= 32)
      const inBubble1 = (x >= 130 && x <= 360 && y >= 32);

      if (!inBubble4 && !inBubble1) {
        const idx = (y * w + x) * ch;
        // If not cream background:
        const r = data[idx], g = data[idx+1], b = data[idx+2];
        if (r < 210 || b < 200) {
          data[idx] = creamR;
          data[idx+1] = creamG;
          data[idx+2] = creamB;
        }
      }
    }
  }

  await sharp(data, { raw: { width: w, height: h, channels: ch } })
    .png({ quality: 100 })
    .toFile(outPath);
  console.log('Saved perfect comic strip to', outPath);
}

perfectComic().catch(console.error);
