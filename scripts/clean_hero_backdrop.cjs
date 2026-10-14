const sharp = require('sharp');

async function buildPerfectHeroBackdrop() {
  const p = 'C:\\Users\\78432\\.gemini\\antigravity-ide\\brain\\0bafeef0-9093-4ca6-a65f-2f336cfed779\\scratch\\user_ref_image.jpg';
  
  // Hero card coordinates: left: 77, top: 194, width: 2160, height: 821
  const img = sharp(p).extract({ left: 77, top: 194, width: 2160, height: 821 });
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height, ch = info.channels;
  
  const bgR = 17, bgG = 17, bgB = 19;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * ch;

      // 1. Top text area (Title, Subtitle, Status, dashed line)
      // Paper plane is at x >= 1050, y >= 130
      // VPN lock is at x >= 1040, y >= 300
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

      // Transition between Line 1 and Line 2: y in [530, 555]. Cat arm is at x >= 1475.
      if (y >= 530 && y < 555 && x < 1460) {
        data[idx] = bgR;
        data[idx+1] = bgG;
        data[idx+2] = bgB;
        continue;
      }

      // Line 2: y in [555, 590]. Cat hand/flashlight starts at x >= 1410.
      if (y >= 555 && y < 590 && x < 1405) {
        data[idx] = bgR;
        data[idx+1] = bgG;
        data[idx+2] = bgB;
        continue;
      }

      // 3. Bottom left buttons area: y >= 590
      // Flashlight beam starts at (x=1360, y=590) and angles down to (x=930, y=820)
      // The beam left edge equation: x_beam(y) ≈ 1360 - (y - 590) * (1360 - 930) / (820 - 590)
      // ≈ 1360 - (y - 590) * 1.869
      // Buttons were at x < 900, y <= 770.
      if (y >= 590 && y <= 775) {
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

  console.log('Saved perfect clean hero backdrop to', outPath);
}

buildPerfectHeroBackdrop().catch(console.error);
