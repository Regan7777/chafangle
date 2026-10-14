const sharp = require('sharp');

async function buildBreakoutHeroBackdrop() {
  const p = 'C:\\Users\\78432\\.gemini\\antigravity-ide\\brain\\0bafeef0-9093-4ca6-a65f-2f336cfed779\\scratch\\user_ref_image.jpg';
  
  // Crop full hero including breakout feet and beam:
  // left: 77, top: 194, width: 2160, height: 896
  const img = sharp(p).extract({ left: 77, top: 194, width: 2160, height: 896 });
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height, ch = info.channels;
  
  const bgR = 17, bgG = 17, bgB = 19;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * ch;

      // 1. Top text area (Title, Subtitle, Status, dashed line)
      if (y < 445 && x < 1030) {
        data[idx] = bgR;
        data[idx+1] = bgG;
        data[idx+2] = bgB;
        continue;
      }

      // 2. Middle text lines:
      // Line 1: y in [445, 530]. Cat arm outline is at x >= 1515.
      if (y >= 445 && y < 530 && x < 1500) {
        data[idx] = bgR;
        data[idx+1] = bgG;
        data[idx+2] = bgB;
        continue;
      }

      // Transition: y in [530, 555]. Cat arm outline is at x >= 1475.
      if (y >= 530 && y < 555 && x < 1460) {
        data[idx] = bgR;
        data[idx+1] = bgG;
        data[idx+2] = bgB;
        continue;
      }

      // Line 2: y in [555, 625]. Cat hand/flashlight handle is at x >= 1410 down to x >= 1305.
      if (y >= 555 && y <= 625) {
        const maxX = Math.round(1435 - (y - 560) * 2.15);
        if (x < maxX) {
          data[idx] = bgR;
          data[idx+1] = bgG;
          data[idx+2] = bgB;
          continue;
        }
      }

      // 3. Bottom left buttons area: y > 625 and y <= 805
      // Old buttons were at x < 900.
      if (y > 625 && y <= 805) {
        const beamSafeX = Math.round(1360 - (y - 590) * 1.85) - 25;
        if (x < Math.min(920, beamSafeX)) {
          data[idx] = bgR;
          data[idx+1] = bgG;
          data[idx+2] = bgB;
          continue;
        }
      }
    }
  }

  const outPath = 'public/images/hero-card-clean-backdrop.png';
  await sharp(data, { raw: { width: w, height: h, channels: ch } })
    .png({ quality: 100 })
    .toFile(outPath);

  console.log('Saved breakout clean hero backdrop to', outPath);
}

buildBreakoutHeroBackdrop().catch(console.error);
