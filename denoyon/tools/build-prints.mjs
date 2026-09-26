// Apparel prints: 50 t-shirt graphics (1–50) plus five extras (X1–X5: neck label,
// hangtag, stickers, two posters).
// Output per design and part:
//   a-kittl/prints/NN-slug[-part][-on-dark].svg   composite artwork, text outlined, mm units
//   a-kittl/separations/<same>.<ink>.svg          one film positive per spot ink (100% black)
//   a-kittl/specs.json                            print spec + mockup placement for every file
// Run: node tools/build-prints.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { text, measure } from './type.mjs';
import { addTees, MOCK_CORE } from './designs-tees.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const outPrints = path.join(root, 'a-kittl', 'prints');
const outSeps = path.join(root, 'a-kittl', 'separations');
fs.mkdirSync(outPrints, { recursive: true });
fs.mkdirSync(outSeps, { recursive: true });
for (const dir of [outPrints, outSeps]) for (const f of fs.readdirSync(dir)) fs.rmSync(path.join(dir, f));

// ---- Brand tokens (design-system/tokens/colors.css) -------------------------
const INKS = {
  ink: { hex: '#0C0B0A', token: '--ink-900', ref: 'Pantone Black 6 C' },
  cream: { hex: '#F2EBDF', token: '--cream', ref: 'Custom mix to #F2EBDF — confirm with drawdown' },
  brass: { hex: '#B18A46', token: '--brass', ref: 'Pantone 871 C metallic (screen) · flat #B18A46 (DTG)' },
  oxblood: { hex: '#5E1B22', token: '--ox-600', ref: 'Custom mix to #5E1B22 — confirm with drawdown' },
};
const GARMENTS = {
  bone: { hex: '#FAF6EF', token: '--bone', name: 'Bone' },
  limestone: { hex: '#E6DFD3', token: '--limestone', name: 'Limestone' },
  ink: { hex: '#0C0B0A', token: '--ink-900', name: 'Ink' },
  oxblood: { hex: '#5E1B22', token: '--ox-600', name: 'Oxblood' },
};
const C = Object.fromEntries(Object.entries(INKS).map(([k, v]) => [k, v.hex]));

// ---- Print constraints ------------------------------------------------------
const HAIR = 0.4;   // mm — thinnest line anywhere (~1.1 pt); screen min is 0.25 mm, DTG 0.3 mm
const RULE = 0.8;   // mm — the brass wordmark rule on garments

// ---- Drawing helpers --------------------------------------------------------
const rect = (x, y, w, h, fill) => `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="${fill}"/>`;
const f = (n) => +n.toFixed(3);
const stroke = (d, color, w = HAIR, extra = '') =>
  `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="butt"${extra}/>`;
const frame = (x, y, w, h, color, sw = HAIR) =>
  `<rect x="${f(x + sw / 2)}" y="${f(y + sw / 2)}" width="${f(w - sw)}" height="${f(h - sw)}" fill="none" stroke="${color}" stroke-width="${sw}"/>`;

// Wordmark: DE NOYON, Jost Medium caps at 0.34em, one brass rule beneath.
function wordmark(cx, baseline, size, color, { rule = true, ruleColor = C.brass, ruleW } = {}) {
  const tr = 0.34;
  const w = measure('DE NOYON', { font: 'sans500', size, tracking: tr });
  const t = text('DE NOYON', { font: 'sans500', size, x: cx, y: baseline, anchor: 'middle', tracking: tr, fill: color });
  const rw = ruleW ?? w * 1.02;
  const r = rule ? rect(cx - rw / 2, baseline + size * 0.42, rw, Math.max(RULE, size * 0.05), ruleColor) : '';
  return { t, r, w };
}

// The bias wave: n hairlines gathered at the shoulder, fanned at the hem,
// so the cloth reads as falling in a single wave. One line may be brass.
function wavePaths(x, y, w, h, n = 12) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const sy = y + t * h * 0.08;
    const ey = y + h * 0.55 + t * h * 0.45;
    const d = `M${f(x)} ${f(sy)} C${f(x + w * 0.42)} ${f(sy - h * 0.06 + t * h * 0.02)} ${f(x + w * 0.38)} ${f(ey + h * 0.18 - t * h * 0.1)} ${f(x + w)} ${f(ey)}`;
    out.push(d);
  }
  return out;
}

const eyebrow = (s, o) => text(s, { font: 'mono400', tracking: 0.24, ...o });
const fitSize = (str, font, maxW, tracking = 0) => maxW / measure(str, { font, size: 1, tracking });
const mono = (s, o) => text(s, { font: 'mono400', tracking: 0.04, ...o });

// ---- The 20 designs -----------------------------------------------------------
const designs = [];
const add = (d) => designs.push(d);

// 1 — Wordmark monument
add({
  n: 1, slug: 'wordmark-monument', title: 'Wordmark monument',
  group: 'Back print', placement: 'Centre back, top edge 90 mm below collar seam',
  garments: ['bone', 'limestone'], method: 'Screen, 2 spot (ink + brass metallic) · DTG alt.',
  w: 280, h: 70,
  build() {
    const wm = wordmark(140, 38, 30, C.ink, { ruleW: 250 });
    const cap = mono('PARIS · 1948 — 1979', { size: 4.2, x: 140, y: 64, anchor: 'middle', tracking: 0.3, fill: C.ink });
    return { ink: wm.t + cap, brass: wm.r };
  },
  note: 'The mark at architectural scale. Nothing else on the back.',
});

// 2 — The wave (twelve lines, one in brass)
add({
  n: 2, slug: 'twelve-lines', title: 'Twelve lines',
  group: 'Back print', placement: 'Centre back, top edge 110 mm below collar seam',
  garments: ['bone', 'limestone'], method: 'Screen, 2 spot · lines 0.5 mm, no halftone',
  w: 260, h: 320,
  build() {
    const ws = wavePaths(10, 20, 240, 230);
    const ink = ws.slice(0, 11).map((d) => stroke(d, C.ink, 0.5)).join('');
    const brass = stroke(ws[11], C.brass, 0.6);
    const cap = text('Twelve made.', { font: 'serif300i', size: 20, x: 130, y: 292, anchor: 'middle', fill: C.ink });
    const m = mono('COLLECTION 04 · CUT ON THE BIAS', { size: 3.6, x: 130, y: 310, anchor: 'middle', tracking: 0.24, fill: C.ink });
    return { ink: ink + cap + m, brass };
  },
  note: 'Edition of twelve drawn as twelve lines of cloth; the last is brass.',
});

// 3 — Eligius of Noyon (left-aligned, serif + mono)
add({
  n: 3, slug: 'eligius-colophon', title: 'Eligius of Noyon',
  group: 'Back print', placement: 'Centre back, top edge 100 mm below collar seam',
  garments: ['bone', 'ink'], method: 'Screen, 2 spot · on ink the cream plate is the underbase, brass flashed last',
  w: 250, h: 122, inkOnDark: true,
  build(fg) {
    let t = eyebrow('PATRON OF GOLDSMITHS', { size: 4.4, x: 2, y: 8, fill: fg });
    t += text('Eligius', { font: 'serif300i', size: 60, x: 0, y: 62, tracking: -0.015, fill: fg });
    t += text('of Noyon', { font: 'serif300i', size: 60, x: 0, y: 108, tracking: -0.015, fill: fg });
    return { fg: t, brass: rect(2, 118, 70, RULE, C.brass) };
  },
  note: 'The name’s origin as the whole message. One name, one brass line.',
});
// 4 — Pattern book index
add({
  n: 4, slug: 'pattern-book', title: 'From the pattern book',
  group: 'Back print', placement: 'Centre back, top edge 100 mm below collar seam',
  garments: ['limestone', 'bone'], method: 'Screen, 2 spot · mono numerals ≥ 7 mm cap',
  w: 240, h: 300,
  build() {
    let ink = eyebrow('ARCHIVE · 1948 — 1979', { size: 4.2, x: 0, y: 8, fill: C.ink });
    ink += text('From the pattern book.', { font: 'serif300', size: 24, x: 0, y: 40, tracking: -0.015, fill: C.ink });
    ink += rect(0, 54, 240, HAIR, C.ink);
    let brass = '';
    for (let i = 0; i < 32; i++) {
      const col = i % 4, row = Math.floor(i / 4);
      const yr = 1948 + i;
      const x = col * 62, y = 82 + row * 27;
      ink += mono(String(yr), { size: 10, x, y, tracking: 0.02, fill: C.ink });
      if (yr === 1974) brass += rect(x, y + 3.2, measure('1974', { font: 'mono400', size: 10, tracking: 0.02 }), RULE, C.brass);
    }
    ink += rect(0, 285, 240, HAIR, C.ink);
    ink += mono('THIS PIECE · 1974', { size: 3.6, x: 0, y: 297, tracking: 0.2, fill: C.ink });
    ink += mono('No. 04 OF 12', { size: 3.6, x: 240, y: 297, anchor: 'end', tracking: 0.2, fill: C.ink });
    return { ink, brass };
  },
  note: 'Thirty-two archive years; the cut used is underlined in brass.',
});

// 5 — Cut on the bias (grainline)
add({
  n: 5, slug: 'bias-grainline', title: 'Cut on the bias',
  group: 'Back print', placement: 'Centre back, top edge 120 mm below collar seam',
  garments: ['bone', 'limestone'], method: 'Screen, 2 spot',
  w: 280, h: 280,
  build() {
    const g = (s) => `<g transform="rotate(-45 140 140)">${s}</g>`;
    const L = 300;
    const arrow = (x) => `M${x} 140 l6 -3.2 v6.4 z`;
    const brass = g(rect(140 - L / 2 + 6, 140 - 0.4, L - 12, RULE, C.brass) +
      `<path d="${arrow(140 - L / 2)}" fill="${C.brass}"/>` +
      `<path d="M${140 + L / 2} 140 l-6 -3.2 v6.4 z" fill="${C.brass}"/>`);
    let ink = text('Cut on the bias.', { font: 'serif300', size: 26, x: 140, y: 128, anchor: 'middle', tracking: -0.015, fill: C.ink });
    ink += mono('GRAIN · 45°', { size: 4.2, x: 140, y: 156, anchor: 'middle', tracking: 0.24, fill: C.ink });
    // pattern notches
    ink += [-100, 100].map((dx) => `<path d="M${140 + dx - 3} 140 h6 l-3 5 z" fill="${C.ink}"/>`).join('');
    return { ink: g(ink), brass };
  },
  note: 'Pattern-maker’s grainline at 45°, the brand’s whole construction in one mark.',
});

// 6 — Label, enlarged (facts from the system only)
add({
  n: 6, slug: 'care-label', title: 'Label, enlarged',
  group: 'Back print', placement: 'Centre back, top edge 90 mm below collar seam',
  garments: ['limestone', 'bone'], method: 'Screen, 2 spot · the 2 mm frame is the label edge',
  w: 200, h: 250,
  build() {
    let ink = frame(0, 0, 200, 250, C.ink, 2);
    ink += `<path d="M12 24 H188" stroke="${C.ink}" stroke-width="${HAIR}" stroke-dasharray="3 2.4"/>`;
    const wm = wordmark(100, 118, 17, C.ink, { ruleW: 130 });
    ink += wm.t;
    ink += mono('No. 04 OF 12', { size: 9, x: 100, y: 190, anchor: 'middle', tracking: 0.04, fill: C.ink });
    ink += mono('PARIS', { size: 4.4, x: 100, y: 222, anchor: 'middle', tracking: 0.3, fill: C.ink });
    return { ink, brass: wm.r };
  },
  note: 'The woven label at back-print scale: the mark, the edition number, the city. Nothing invented.',
});
// 7 — Paris, 8e (tonal on ink)
add({
  n: 7, slug: 'atelier-coordinates', title: 'Paris, 8e.',
  group: 'Back print', placement: 'Centre back, top edge 120 mm below collar seam',
  garments: ['ink'], method: 'Screen, 2 spot on ink · cream is the underbase plate, brass flashed over it',
  w: 270, h: 100, dark: true,
  build() {
    const size = fitSize('Paris, 8e.', 'serif300', 268, -0.015);
    let cream = text('Paris, 8e.', { font: 'serif300', size, x: 0, y: size * 0.72, tracking: -0.015, fill: C.cream });
    cream += eyebrow('THE ATELIER', { size: 4.4, x: 84, y: 97, fill: C.cream });
    return { cream, brass: rect(2, 94, 70, RULE, C.brass) };
  },
  note: 'One atelier, stated as an address. The city is the hero.',
});
// 8 — Edition registry
add({
  n: 8, slug: 'edition-registry', title: 'Edition registry',
  group: 'Back print', placement: 'Centre back, top edge 100 mm below collar seam',
  garments: ['ink', 'oxblood'], method: 'Screen, 2 spot on dark · cream is the underbase plate',
  w: 200, h: 290, dark: true,
  build() {
    let cream = text('Twelve made.', { font: 'serif300', size: 26, x: 0, y: 26, tracking: -0.015, fill: C.cream });
    cream += eyebrow('EDITION REGISTRY · COLLECTION 04', { size: 3.8, x: 0, y: 42, fill: C.cream });
    let brass = '';
    for (let i = 1; i <= 12; i++) {
      const y = 70 + (i - 1) * 18.5;
      const s = `No. ${String(i).padStart(2, '0')}`;
      const own = i === 4;
      const t = mono(s, { size: 6, x: 0, y, tracking: 0.06, fill: own ? C.brass : C.cream });
      const line = rect(34, y - 2, 166, own ? RULE : HAIR, own ? C.brass : C.cream);
      if (own) brass += t + line; else cream += t + line;
    }
    return { cream, brass };
  },
  note: 'Twelve numbered rules; the wearer’s number is the brass one (variable per piece).',
});

// 9 — Stacked pocket wordmark
add({
  n: 9, slug: 'pocket-stacked', title: 'Stacked pocket mark',
  group: 'Front chest', placement: 'Left chest, centre 95 mm from centre front, 70 mm below shoulder seam',
  garments: ['bone', 'limestone', 'ink'], method: 'Screen, 2 spot · DTG alt.',
  w: 70, h: 40, inkOnDark: true,
  build(fg) {
    const a = text('DE', { font: 'sans500', size: 9, x: 35, y: 12, anchor: 'middle', tracking: 0.34, fill: fg });
    const b = text('NOYON', { font: 'sans500', size: 9, x: 35, y: 26, anchor: 'middle', tracking: 0.34, fill: fg });
    const w = measure('NOYON', { font: 'sans500', size: 9, tracking: 0.34 });
    return { fg: a + b, brass: rect(35 - w / 2, 32, w, RULE, C.brass) };
  },
  note: 'The stacked lockup at minimum-plus size (≥ 72 px rule applies on screen; 50 mm wide here).',
});

// 10 — Edition mark
add({
  n: 10, slug: 'edition-mark', title: 'Edition mark',
  group: 'Front chest', placement: 'Left chest pocket position, 80 mm below shoulder seam',
  garments: ['bone', 'ink', 'oxblood'], method: 'Screen, 1–2 spot · numeral plate is variable',
  w: 70, h: 26, inkOnDark: true,
  build(fg) {
    const a = text('DE NOYON', { font: 'sans500', size: 3.6, x: 35, y: 5, anchor: 'middle', tracking: 0.34, fill: fg });
    const b = mono('No. 04 of 12', { size: 7.2, x: 35, y: 18, anchor: 'middle', tracking: 0.02, fill: fg });
    return { fg: a + b, brass: rect(20, 23, 30, RULE, C.brass) };
  },
  note: 'Edition number as the only chest graphic. Numeral swapped per piece.',
});

// 11 — waving luxury
add({
  n: 11, slug: 'waving-luxury', title: 'waving luxury',
  group: 'Front chest', placement: 'Centre front, top edge 85 mm below collar seam',
  garments: ['bone', 'limestone'], method: 'Screen, 2 spot',
  w: 120, h: 30,
  build() {
    const t = text('waving luxury', { font: 'serif300i', size: 20, x: 60, y: 18, anchor: 'middle', fill: C.ink });
    return { ink: t, brass: rect(40, 26, 40, RULE, C.brass) };
  },
  note: 'The brand idea in italic serif, lowercase as a phrase, not a slogan.',
});

// 12 — Square plate
add({
  n: 12, slug: 'square-plate', title: 'Square plate',
  group: 'Front chest', placement: 'Left chest, 75 mm below shoulder seam',
  garments: ['limestone', 'bone', 'ink'], method: 'Screen, 2 spot',
  w: 56, h: 56, inkOnDark: true,
  build(fg) {
    let t = frame(0, 0, 56, 56, fg, 0.6);
    t += text('DE NOYON', { font: 'sans500', size: 4.4, x: 28, y: 22, anchor: 'middle', tracking: 0.34, fill: fg });
    t += mono('PARIS', { size: 3.4, x: 28, y: 36, anchor: 'middle', tracking: 0.3, fill: fg });
    t += mono('1948 — 1979', { size: 3.4, x: 28, y: 44, anchor: 'middle', tracking: 0.06, fill: fg });
    return { fg: t, brass: rect(16, 26, 24, RULE, C.brass) };
  },
  note: 'A stone plate with an ebony frame and a brass seam. Square, never round.',
});

// 13 — Sleeve run
add({
  n: 13, slug: 'sleeve-run', title: 'Sleeve run',
  group: 'Sleeve', placement: 'Left sleeve (long-sleeve), running shoulder → cuff, centred on outer seam line',
  garments: ['bone', 'ink'], method: 'Screen, 2 spot · sleeve platen',
  w: 14, h: 260, inkOnDark: true,
  build(fg) {
    const s = 'DE NOYON · PARIS · COLLECTION 04';
    const t = text(s, { font: 'sans500', size: 6, x: 0, y: 0, tracking: 0.34, fill: fg });
    const L = measure(s, { font: 'sans500', size: 6, tracking: 0.34 });
    return {
      fg: `<g transform="translate(9.5 4) rotate(90)">${t}</g>`,
      brass: rect(5, 4 + L + 10, RULE, 260 - (L + 18), C.brass),
    };
  },
  note: 'Type runs down the arm, then continues as one brass line to the cuff.',
});

// 14 — Hood / back-neck yoke
add({
  n: 14, slug: 'back-neck-yoke', title: 'Hood & back-neck mark',
  group: 'Hood', placement: 'Hoodie: centre of hood panel seam-side, 60 mm from hood edge · Tee: back neck, 25 mm below collar',
  garments: ['limestone', 'ink'], method: 'Screen, 2 spot · small-format platen',
  w: 80, h: 20, inkOnDark: true,
  build(fg) {
    const wm = wordmark(40, 8, 6.4, fg, { ruleW: 60 });
    const m = mono('PARIS, 8e', { size: 3.4, x: 40, y: 19, anchor: 'middle', tracking: 0.3, fill: fg });
    return { fg: wm.t + m, brass: wm.r };
  },
  note: 'Seen only when the hood is down or the hair is up.',
});

// 15 — Hem inlay
add({
  n: 15, slug: 'hem-inlay', title: 'Hem inlay',
  group: 'Hem', placement: 'Front left hem, baseline 18 mm above hem stitch, left edge 30 mm from side seam',
  garments: ['bone', 'limestone', 'ink'], method: 'Screen, 2 spot',
  w: 150, h: 8, inkOnDark: true,
  build(fg) {
    const m = mono('BIAS · 45° · No. 04 / 12', { size: 3.4, x: 150, y: 5, anchor: 'end', tracking: 0.14, fill: fg });
    const mw = measure('BIAS · 45° · No. 04 / 12', { font: 'mono400', size: 3.4, tracking: 0.14 });
    return { fg: m, brass: rect(0, 3.6, 150 - mw - 6, RULE, C.brass) };
  },
  note: 'A brass seam in the stone — Dirand’s inlay, set at the hem.',
});

// 16 — Printed neck label (tagless)
add({
  n: 'X1', slug: 'neck-label', title: 'Printed neck label',
  group: 'Label', placement: 'Inside back neck, top edge 18 mm below collar seam',
  garments: ['bone', 'limestone', 'ink'], method: 'Tagless screen transfer, 1 spot (ink on light, cream on dark) · 80% soft-hand',
  w: 50, h: 44, inkOnDark: true, oneInk: true,
  build(fg) {
    let t = text('DE NOYON', { font: 'sans500', size: 4.2, x: 25, y: 5, anchor: 'middle', tracking: 0.34, fill: fg });
    t += rect(10, 7.4, 30, 0.4, fg);
    t += mono('EU 38', { size: 9, x: 25, y: 20, anchor: 'middle', tracking: 0.02, fill: fg });
    t += mono('No. 04 / 12', { size: 3.2, x: 25, y: 27, anchor: 'middle', tracking: 0.06, fill: fg });
    t += mono('PARIS', { size: 2.6, x: 25, y: 36, anchor: 'middle', tracking: 0.3, fill: fg });
    return { fg: t };
  },
  note: 'One ink so it never shows through the cloth. Size and number are variable fields.',
});

// 17 — Hangtag (front + back)
add({
  n: 'X2', slug: 'hangtag', title: 'Hangtag, front and back',
  group: 'Hangtag', placement: '55 × 95 mm on 600 gsm cotton board, cream',
  garments: ['stock-cream'], method: 'Letterpress 1 spot (ink) + brass hot foil · dieline on its own layer',
  w: 120, h: 95,
  build() {
    const P = (x) => x; // panel offsets: front 0, back 65
    let ink = '', brass = '', die = '';
    [0, 65].forEach((ox) => {
      die += frame(ox, 0, 55, 95, '#EC008C', 0.25);
      die += `<circle cx="${ox + 27.5}" cy="9" r="2.2" fill="none" stroke="#EC008C" stroke-width="0.25"/>`;
    });
    // front
    ink += text('DE', { font: 'sans500', size: 6.4, x: P(27.5), y: 46, anchor: 'middle', tracking: 0.34, fill: C.ink });
    ink += text('NOYON', { font: 'sans500', size: 6.4, x: P(27.5), y: 56, anchor: 'middle', tracking: 0.34, fill: C.ink });
    brass += rect(12, 60.5, 31, 0.6, C.brass);
    ink += mono('PARIS', { size: 2.8, x: 27.5, y: 86, anchor: 'middle', tracking: 0.3, fill: C.ink });
    // back
    const bx = 65 + 6;
    ink += text('Bias tee', { font: 'serif300', size: 7, x: bx, y: 28, fill: C.ink });
    const rows = [['PATTERN', '1974'], ['EDITION', 'No. 04 / 12'], ['SIZE', 'EU 38']];
    rows.forEach(([k, v], i) => {
      const y = 44 + i * 8;
      ink += mono(k, { size: 2.5, x: bx, y, tracking: 0.14, fill: C.ink });
      ink += mono(v, { size: 2.5, x: 65 + 49, y, anchor: 'end', tracking: 0.04, fill: C.ink });
      ink += rect(bx, y + 2.2, 43, 0.25, C.ink);
    });
    brass += rect(bx, 76, 12, 0.6, C.brass);
    return { ink, brass, dieline: die };
  },
  note: 'Board, not plastic. Price in mono with a space after the currency.',
});

// 18 — Packaging stickers
add({
  n: 'X3', slug: 'packaging-stickers', title: 'Tissue seal and box band',
  group: 'Sticker', placement: 'Seal 50 × 50 mm closes the tissue · band 110 × 26 mm wraps the box lid',
  garments: ['stock-cream'], method: 'Uncoated cream label stock · 1 spot + brass foil · kiss-cut dieline',
  w: 176, h: 50,
  build() {
    let ink = '', brass = '', die = '';
    die += frame(0, 0, 50, 50, '#EC008C', 0.25);
    ink += text('DE NOYON', { font: 'sans500', size: 4.4, x: 25, y: 23, anchor: 'middle', tracking: 0.34, fill: C.ink });
    brass += rect(12, 27, 26, 0.6, C.brass);
    ink += mono('No. 04 / 12', { size: 2.8, x: 25, y: 37, anchor: 'middle', tracking: 0.06, fill: C.ink });
    const bx = 60;
    die += frame(bx, 12, 116, 26, '#EC008C', 0.25);
    ink += text('DE NOYON', { font: 'sans500', size: 5, x: bx + 8, y: 27.2, tracking: 0.34, fill: C.ink });
    const mw = measure('DE NOYON', { font: 'sans500', size: 5, tracking: 0.34 });
    brass += rect(bx + 8 + mw + 6, 25.3, 116 - 16 - mw - 6 - 26, 0.6, C.brass);
    ink += mono('PARIS', { size: 3, x: bx + 108, y: 27, anchor: 'end', tracking: 0.3, fill: C.ink });
    return { ink, brass, dieline: die };
  },
  note: 'Square seal, never round. The band repeats the wordmark-and-seam idea horizontally.',
});

// 19 — Capsule poster
add({
  n: 'X4', slug: 'capsule-poster', title: 'Collection 04 poster',
  group: 'Poster', placement: 'A2, 420 × 594 mm, uncoated bone 300 gsm',
  garments: ['stock-bone'], method: 'Offset or screen, 2 spot (ink + brass metallic)',
  w: 420, h: 594,
  build() {
    let ink = eyebrow('COLLECTION 04', { size: 6, x: 36, y: 50, fill: C.ink });
    ink += text('Cut on', { font: 'serif300', size: 82, x: 30, y: 150, tracking: -0.02, fill: C.ink });
    ink += text('the bias.', { font: 'serif300', size: 82, x: 30, y: 226, tracking: -0.02, fill: C.ink });
    const ws = wavePaths(36, 270, 348, 190);
    ink += ws.slice(0, 11).map((d) => stroke(d, C.ink, 0.7)).join('');
    let brass = stroke(ws[11], C.brass, 0.9);
    ink += rect(36, 520, 348, HAIR, C.ink);
    ink += mono('1974 PATTERN · TWELVE MADE', { size: 5, x: 36, y: 540, tracking: 0.12, fill: C.ink });
    const wm = wordmark(330, 568, 9, C.ink, { ruleW: 100 });
    ink += wm.t; brass += wm.r;
    return { ink, brass };
  },
  note: 'Typographic poster — no photography exists, so the wave carries the image.',
});

// 20 — Archive poster (edition closed)
add({
  n: 'X5', slug: 'archive-poster', title: 'Archive — 1974 cut retired',
  group: 'Poster', placement: 'A2, 420 × 594 mm, oxblood-dyed 300 gsm stock (or printed flood)',
  garments: ['stock-oxblood'], method: 'Screen, 2 spot on dyed stock (cream + brass metallic)',
  w: 420, h: 594, dark: true,
  build() {
    let cream = eyebrow('ARCHIVE', { size: 6, x: 36, y: 50, fill: C.cream });
    cream += text('The 1974 cut,', { font: 'serif300', size: 60, x: 32, y: 130, tracking: -0.02, fill: C.cream });
    cream += text('retired.', { font: 'serif300i', size: 60, x: 32, y: 190, tracking: -0.02, fill: C.cream });
    let brass = rect(36, 216, 110, 1, C.brass);
    for (let i = 1; i <= 12; i++) {
      const y = 262 + (i - 1) * 22;
      const s = `No. ${String(i).padStart(2, '0')}`;
      cream += mono(s, { size: 8, x: 36, y, tracking: 0.04, fill: C.cream });
      cream += rect(80, y - 3, 304, HAIR, C.cream);
      cream += mono('DISPATCHED', { size: 4.2, x: 384, y: y - 6, anchor: 'end', tracking: 0.2, fill: C.cream });
    }
    cream += mono('When they are gone the pattern is retired.', { size: 5.2, x: 36, y: 548, tracking: 0.02, fill: C.cream });
    const wm = wordmark(330, 572, 9, C.cream, { ruleW: 100 });
    cream += wm.t; brass += wm.r;
    return { cream, brass };
  },
  note: 'Scarcity stated as fact after the event, never before it.',
});

addTees({ add, text, measure, fitSize, wordmark, wavePaths, rect, stroke, frame, eyebrow, mono, C, HAIR, RULE, f });
for (const d of designs) if (MOCK_CORE[d.n]) d.mock = MOCK_CORE[d.n];

// ---- Emit --------------------------------------------------------------------
const INK_ORDER = ['cream', 'ink', 'oxblood', 'brass', 'dieline']; // print order: underbase/cream first, metallic last
const DARK = ['ink', 'oxblood'];
const specs = [];
const idOf = (n) => (typeof n === 'number' ? String(n).padStart(2, '0') : n.toLowerCase());

for (const d of designs) {
  const variants = d.inkOnDark ? [{ key: '', fg: 'ink' }, { key: '-on-dark', fg: 'cream' }] : [{ key: '', fg: null }];
  const parts = d.parts || [{ key: '', w: d.w, h: d.h, build: d.build }];
  for (const v of variants) {
    for (const part of parts) {
      const built = part.build(v.fg ? C[v.fg] : undefined);
      const clip = built.clip; delete built.clip;
      const layers = {};
      for (const [k, val] of Object.entries(built)) if (val) layers[k === 'fg' ? v.fg : k] = val;
      const inks = INK_ORDER.filter((k) => layers[k]);
      const cp = clip ? ' clip-path="url(#artboard)"' : '';
      const defs = clip ? `<defs><clipPath id="artboard"><rect width="${part.w}" height="${part.h}"/></clipPath></defs>\n` : '';
      const groups = inks.map((k) =>
        `<g id="sep-${k}"${cp} data-ink="${k === 'dieline' ? 'Dieline — do not print' : `${INKS[k].hex} · ${INKS[k].ref}`}">${layers[k]}</g>`).join('\n');
      const file = `${idOf(d.n)}-${d.slug}${part.key ? '-' + part.key : ''}${v.key}`;
      const head = `<svg xmlns="http://www.w3.org/2000/svg" width="${part.w}mm" height="${part.h}mm" viewBox="0 0 ${part.w} ${part.h}">`;
      const title = `<title>DE NOYON — Design ${d.n}: ${d.title}${part.key ? ` (${part.key})` : ''}${v.key ? ' (dark garment)' : ''}</title>`;
      fs.writeFileSync(path.join(outPrints, file + '.svg'), `${head}\n${title}\n${defs}${groups}\n</svg>\n`);
      for (const k of inks) {
        const film = layers[k].replaceAll(/#[0-9A-Fa-f]{6}/g, '#000000');
        fs.writeFileSync(path.join(outSeps, `${file}.${k}.svg`), `${head}<title>Film positive — ${k}</title>${defs}<g${cp}>${film}</g></svg>\n`);
      }
      specs.push({
        design: d.n, id: idOf(d.n), file: `prints/${file}.svg`, part: part.key || null, variant: v.key ? 'dark' : 'light',
        title: d.title, group: d.group, artboard_mm: [part.w, part.h], placement: d.placement, method: d.method,
        garments: (v.key ? DARK : d.inkOnDark ? d.garments.filter((g) => !DARK.includes(g)) : d.garments)
          .map((g) => GARMENTS[g] ? { ...GARMENTS[g], id: g } : { id: g }),
        inks: inks.filter((k) => k !== 'dieline').map((k) => ({ id: k, ...INKS[k] })),
        separations: inks.map((k) => `separations/${file}.${k}.svg`),
        min_line_mm: HAIR, text: 'outlined', note: d.note,
        mock: d.mock || null,
      });
    }
  }
}

fs.writeFileSync(path.join(root, 'a-kittl', 'specs.json'), JSON.stringify({ inks: INKS, garments: GARMENTS, prints: specs }, null, 2));
console.log(`${designs.length} designs → ${specs.length} print files`);
