// T-shirt mockups for designs 1–50: front and back of a flat tee in the garment
// colour, each print placed at its real size and position (1 unit = 1 mm).
// Output: a-kittl/mockups/NN-slug.svg and .png
// Run after build-prints: node tools/build-mockups.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { text } from './type.mjs';

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); } catch {
  console.error('Playwright is missing. Run: cd denoyon/tools && npm install && npm run setup');
  process.exit(1);
}

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'a-kittl/mockups');
fs.mkdirSync(out, { recursive: true });
for (const f of fs.readdirSync(out)) fs.rmSync(path.join(out, f));
const { prints, garments } = JSON.parse(fs.readFileSync(path.join(root, 'a-kittl/specs.json'), 'utf8'));
const DARK = ['ink', 'oxblood'];
const INK = '#0C0B0A', STAGE = '#D2C9BB';

// Tee outline, centred on x = 0, y = 0 at the high shoulder point, hem at y = 690.
function tee(view, long) {
  const neck = view === 'front' ? 'C85 107 -85 107 -90 0' : 'C85 27 -85 27 -90 0';
  const L = long ? [[-235, 42], [-330, 650], [-272, 662], [-250, 215]] : [[-235, 42], [-348, 182], [-262, 232], [-248, 210]];
  const R = [...L].reverse().map(([x, y]) => [-x, y]);
  return `M-90 0 ${L.map(([x, y]) => `L${x} ${y}`).join(' ')} L-255 690 L255 690 ${R.map(([x, y]) => `L${x} ${y}`).join(' ')} L90 0 ${neck} Z`;
}

function nest(spec, pl) {
  const [w, h] = spec.artboard_mm;
  let body = fs.readFileSync(path.join(root, 'a-kittl', spec.file), 'utf8').replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/<title>[\s\S]*?<\/title>/, '');
  const uid = 'c' + Math.random().toString(36).slice(2, 8);
  body = body.replace(/id="artboard"/g, `id="${uid}"`).replace(/url\(#artboard\)/g, `url(#${uid})`);
  let x, y, rot = pl.rot || 0, cx, cy;
  if (pl.sleeve) { cx = 292; cy = 176; rot = -30.2; x = cx - w / 2; y = cy - h / 2; }
  else if (pl.sleeveRun) { cx = 262; cy = 120; rot = -4.2; x = cx - w / 2; y = cy; }
  else { x = pl.x - w / 2; y = pl.y; cx = pl.x; cy = pl.y + h / 2; }
  return `<g transform="rotate(${rot} ${cx} ${cy})"><svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" overflow="visible">${body}</svg></g>`;
}

function teeView(view, g, long, placed) {
  const hex = garments[g].hex, dark = DARK.includes(g);
  const line = dark ? 'rgba(242,235,223,.22)' : 'rgba(12,11,10,.28)';
  const stitch = dark ? 'rgba(242,235,223,.18)' : 'rgba(12,11,10,.18)';
  const d = tee(view, long);
  const sleeveHem = long
    ? [[-330, 650, -272, 662], [330, 650, 272, 662]]
    : [[-348, 182, -262, 232], [348, 182, 262, 232]];
  const hems = sleeveHem.map(([x1, y1, x2, y2]) => {
    const s = Math.sign(x1), ox = long ? 0 : -s * 4.7, oy = long ? -12 : -11;
    return `<path d="M${x1 + ox} ${y1 + oy} L${x2 + ox} ${y2 + oy}" stroke="${stitch}" stroke-width="1" stroke-dasharray="3 2.5"/>`;
  }).join('');
  const inside = view === 'front'
    ? `<path d="M-90 0 C-85 27 85 27 90 0 C85 107 -85 107 -90 0 Z" fill="rgba(12,11,10,${dark ? 0.35 : 0.14})"/>`
    : '';
  const rib = view === 'front' ? 'M90 0 C85 107 -85 107 -90 0' : 'M90 0 C85 27 -85 27 -90 0';
  return `<g>
    <path d="${d}" fill="${hex}" filter="url(#shadow)"/>
    <path d="${d}" fill="url(#fold)"/>
    ${inside}
    <path d="${rib}" fill="none" stroke="rgba(12,11,10,${dark ? 0.25 : 0.07})" stroke-width="16" transform="translate(0 7)"/>
    <path d="${rib}" fill="none" stroke="${stitch}" stroke-width="1" stroke-dasharray="3 2.5" transform="translate(0 15)"/>
    <path d="M-255 676 L255 676" stroke="${stitch}" stroke-width="1" stroke-dasharray="3 2.5"/>
    ${hems}
    <path d="${d}" fill="none" stroke="${line}" stroke-width="1.2" stroke-linejoin="round"/>
    ${placed}
  </g>`;
}

const byDesign = new Map();
for (const p of prints) {
  if (typeof p.design !== 'number') continue;
  if (!byDesign.has(p.design)) byDesign.set(p.design, []);
  byDesign.get(p.design).push(p);
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 960 }, deviceScaleFactor: 1.25 });
let count = 0;
for (const [n, specs] of byDesign) {
  const m = specs[0].mock;
  const want = DARK.includes(m.g) && specs.some((s) => s.variant === 'dark') ? 'dark' : 'light';
  const pick = (part) => specs.find((s) => s.variant === want && (s.part || null) === (part || null)) || specs.find((s) => (s.part || null) === (part || null));
  const views = { front: '', back: '' };
  for (const pl of m.place) views[pl.view] += nest(pick(pl.part), pl);
  const slug = path.basename(specs[0].file, '.svg').replace(/-on-dark$/, '').replace(/-(front|back)$/, '');
  const title = `${String(n).padStart(2, '0')}  ${specs[0].title}`;
  const cap = (s, x) => text(s, { font: 'mono400', size: 13, x, y: 915, anchor: 'middle', tracking: 0.24, fill: INK });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="960" viewBox="0 0 1600 960">
<title>DE NOYON — Mockup ${title}</title>
<defs>
  <filter id="shadow" x="-10%" y="-10%" width="120%" height="125%"><feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#0C0B0A" flood-opacity="0.16"/></filter>
  <linearGradient id="fold" x1="-360" x2="360" y1="0" y2="0" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="#0C0B0A" stop-opacity="0.06"/><stop offset="0.3" stop-color="#0C0B0A" stop-opacity="0"/>
    <stop offset="0.7" stop-color="#0C0B0A" stop-opacity="0"/><stop offset="1" stop-color="#0C0B0A" stop-opacity="0.06"/>
  </linearGradient>
</defs>
<rect width="1600" height="960" fill="${STAGE}"/>
${text(title, { font: 'serif300', size: 34, x: 60, y: 70, tracking: -0.01, fill: INK })}
${text(garments[m.g].name.toUpperCase(), { font: 'mono400', size: 13, x: 1540, y: 66, anchor: 'end', tracking: 0.24, fill: INK })}
<g transform="translate(410 130) scale(1.06)">${teeView('front', m.g, m.long, views.front)}</g>
<g transform="translate(1190 130) scale(1.06)">${teeView('back', m.g, m.long, views.back)}</g>
${cap('FRONT', 410)}${cap('BACK', 1190)}
</svg>`;
  fs.writeFileSync(path.join(out, `${slug}.svg`), svg);
  await page.setContent(`<body style="margin:0">${svg}</body>`);
  await page.screenshot({ path: path.join(out, `${slug}.png`) });
  count++;
}
await browser.close();
console.log(`mockups: ${count}`);
