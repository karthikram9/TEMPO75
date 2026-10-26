import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

function svgIcon(size, isMaskable = false) {
  const padding = isMaskable ? size * 0.1 : 0;
  const innerSize = size - padding * 2;
  const rx = isMaskable ? 0 : Math.round(size * 0.22);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <rect width="${size}" height="${size}" fill="#1A382B" />
  ${
    !isMaskable
      ? `<rect x="3" y="3" width="${size - 6}" height="${size - 6}" rx="${rx}" fill="#1A382B" stroke="#2B5742" stroke-width="4"/>`
      : ''
  }
  <g transform="translate(${padding}, ${padding}) scale(${innerSize / 512})">
    <!-- Top Aesthetic Accent Line -->
    <line x1="128" y1="108" x2="384" y2="108" stroke="#4E9665" stroke-width="10" stroke-linecap="round" />
    
    <!-- Bold Stylized Geometric T -->
    <path d="M148 144 H364 V204 H284 V388 H228 V204 H148 Z" fill="#F4F5F0" />
    
    <!-- Performance Capsule with 75 Protocol Mark -->
    <rect x="268" y="296" width="116" height="52" rx="14" fill="#244837" stroke="#3E7255" stroke-width="3" />
    <text x="326" y="330" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', monospace" font-size="28" font-weight="900" fill="#A2B8A0" text-anchor="middle" dominant-baseline="central" letter-spacing="1">75</text>
  </g>
</svg>`;
}

async function generate() {
  const iconsDir = path.join(process.cwd(), 'public', 'icons');
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  const svg512 = svgIcon(512);
  const svgMaskable512 = svgIcon(512, true);

  fs.writeFileSync(path.join(process.cwd(), 'public', 'favicon.svg'), svgIcon(64));
  fs.writeFileSync(path.join(iconsDir, 'icon-192.svg'), svgIcon(192));
  fs.writeFileSync(path.join(iconsDir, 'icon-512.svg'), svg512);

  // iOS Apple Touch Icon (180x180 png)
  await sharp(Buffer.from(svgIcon(180)))
    .png()
    .toFile(path.join(process.cwd(), 'public', 'apple-touch-icon.png'));

  await sharp(Buffer.from(svgIcon(180)))
    .png()
    .toFile(path.join(iconsDir, 'icon-180.png'));

  // Standard PWA manifest icons
  await sharp(Buffer.from(svgIcon(192)))
    .png()
    .toFile(path.join(iconsDir, 'icon-192.png'));

  await sharp(Buffer.from(svg512))
    .png()
    .toFile(path.join(iconsDir, 'icon-512.png'));

  await sharp(Buffer.from(svgMaskable512))
    .png()
    .toFile(path.join(iconsDir, 'icon-maskable-512.png'));

  console.log('All TEMPO 75 PWA icons generated successfully in public/ and public/icons/');
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
