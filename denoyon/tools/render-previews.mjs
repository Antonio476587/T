// Renders PNG previews of every print on its garment colour (a-kittl/previews/)
// and exports every Canvas design to PNG (b-canvas/png/).
// Run: node tools/render-previews.mjs [prints|canvas]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const which = process.argv[2];
const browser = await chromium.launch();

if (!which || which === 'prints') {
  const { prints } = JSON.parse(fs.readFileSync(path.join(root, 'a-kittl/specs.json'), 'utf8'));
  const out = path.join(root, 'a-kittl/previews');
  fs.mkdirSync(out, { recursive: true });
  const page = await browser.newPage({ viewport: { width: 1000, height: 1000 } });
  for (const p of prints) {
    const g = p.garments[0].hex || ({ 'stock-cream': '#F2EBDF', 'stock-bone': '#FAF6EF', 'stock-oxblood': '#5E1B22' })[p.garments[0].id];
    const svg = fs.readFileSync(path.join(root, 'a-kittl', p.file), 'utf8');
    const [w, h] = p.artboard_mm;
    const fit = Math.min(760 / w, 760 / h);
    await page.setContent(`<body style="margin:0;background:${g};display:grid;place-items:center;height:1000px">
      <div style="width:${w * fit}px;height:${h * fit}px">${svg.replace(/width="[^"]+" height="[^"]+"/, 'width="100%" height="100%"')}</div></body>`);
    await page.screenshot({ path: path.join(out, path.basename(p.file, '.svg') + '.png') });
  }
  console.log(`previews: ${prints.length}`);
}

if (!which || which === 'canvas') {
  const out = path.join(root, 'b-canvas/png');
  fs.mkdirSync(out, { recursive: true });
  const page = await browser.newPage();
  await page.goto('file://' + path.join(root, 'b-canvas/index.html') + '?export=1');
  await page.waitForFunction('window.DN_READY === true', null, { timeout: 30000 });
  const list = await page.evaluate('window.DN_EXPORT()');
  for (const { file, data } of list) {
    fs.writeFileSync(path.join(out, file), Buffer.from(data.split(',')[1], 'base64'));
  }
  console.log(`canvas: ${list.length}`);
}

if (!which || which === 'storefront') {
  const dir = path.join(root, 'c-storefront');
  const out = path.join(dir, 'previews');
  fs.mkdirSync(out, { recursive: true });
  const pages = fs.readdirSync(dir).filter((f) => /^\d\d-.*\.html$/.test(f)).sort();
  for (const [vw, vh, tag] of [[1440, 900, 'desktop'], [390, 844, 'mobile']]) {
    const page = await browser.newPage({ viewport: { width: vw, height: vh } });
    for (const f of pages) {
      await page.goto('file://' + path.join(dir, f));
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(700); // drawers and dialogs settle
      await page.screenshot({ path: path.join(out, f.replace('.html', `.${tag}.png`)) });
    }
    await page.close();
  }
  console.log(`storefront: ${pages.length} pages × 2 viewports`);
}

if (which === 'kittl') {
  // Transparent 300 dpi PNGs of each primary print, for upload to the Kittl library
  // (Kittl's upload accepts PNG/JPEG/WebP, not SVG).
  const { prints } = JSON.parse(fs.readFileSync(path.join(root, 'a-kittl/specs.json'), 'utf8'));
  const out = path.join(root, 'a-kittl/png-300dpi');
  fs.mkdirSync(out, { recursive: true });
  const seen = new Set();
  for (const p of prints) {
    if (seen.has(p.design)) continue; seen.add(p.design);
    const [w, h] = p.artboard_mm;
    const px = 300 / 25.4, scale = Math.min(1, 4800 / Math.max(w * px, h * px)); // cap long edge at 4800 px
    const W = Math.round(w * px * scale), H = Math.round(h * px * scale);
    const page = await browser.newPage({ viewport: { width: W, height: H } });
    const svg = fs.readFileSync(path.join(root, 'a-kittl', p.file), 'utf8').replace(/width="[^"]+" height="[^"]+"/, `width="${W}" height="${H}"`)
      .replace(/<g id="sep-dieline"[\s\S]*?<\/g>/, '');
    await page.setContent(`<body style="margin:0;background:transparent">${svg}</body>`);
    await page.screenshot({ path: path.join(out, path.basename(p.file, '.svg') + '.png'), omitBackground: true });
    await page.close();
  }
  console.log(`kittl pngs: ${seen.size}`);
}

await browser.close();
