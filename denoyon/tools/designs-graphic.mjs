// DE NOYON graphic tees, 1–50. Bold, full-canvas compositions in the manner of the
// Kittl reference board: one hero element, stark scale contrast, a supporting line,
// a small signature. Brand colours used as fills; copy only from the design system.
//
// 1–40 are typographic. 41–50 are anchored by Kittl-generated engravings that are
// placed from art/kittl/<name>.svg; until a file exists the slot shows a
// labelled placeholder and the design is marked `pending`.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ART = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'art', 'kittl');

export function addGraphic(h) {
  const { add, text, measure, warpedText, arcText, FONTS, rect, frame, C, f, wavePaths } = h;

  // ---- helpers ---------------------------------------------------------------
  const cap = (font, size) => (FONTS[font].tables.os2.sCapHeight / FONTS[font].unitsPerEm) * size;
  const fit = (str, font, w, tracking = 0) => w / measure(str, { font, size: 1, tracking });
  // A line fitted to width w, top of caps at yTop. Returns svg + baseline + size.
  const line = (str, font, x, yTop, w, fill, { tracking = 0, anchor = 'start', max = Infinity } = {}) => {
    const size = Math.min(max, fit(str, font, w, tracking));
    const base = yTop + cap(font, size);
    const xx = anchor === 'middle' ? x + w / 2 : anchor === 'end' ? x + w : x;
    return { svg: text(str, { font, size, x: xx, y: base, anchor, tracking, fill }), base, size };
  };
  const outline = (svg, color, sw = 0.6) =>
    svg.replace(/fill="[^"]+"/g, `fill="none" stroke="${color}" stroke-width="${sw}" stroke-linejoin="round"`);
  const mono = (s, o) => text(s, { font: 'mono500', tracking: 0.16, ...o });
  const star = (cx, cy, r, fill) => {
    const k = r * 0.22;
    return `<path d="M${f(cx)} ${f(cy - r)} Q${f(cx + k)} ${f(cy - k)} ${f(cx + r)} ${f(cy)} Q${f(cx + k)} ${f(cy + k)} ${f(cx)} ${f(cy + r)} Q${f(cx - k)} ${f(cy + k)} ${f(cx - r)} ${f(cy)} Q${f(cx - k)} ${f(cy - k)} ${f(cx)} ${f(cy - r)}Z" fill="${fill}"/>`;
  };
  // Half a laurel: leaves along a circular arc from a0 to a1 (deg, 0 = up, clockwise).
  const laurel = (cx, cy, r, a0, a1, fill, n = 11, leaf = 7) => {
    let s = '';
    const pts = [];
    for (let i = 0; i <= 40; i++) {
      const a = ((a0 + ((a1 - a0) * i) / 40) * Math.PI) / 180;
      pts.push([cx + r * Math.sin(a), cy - r * Math.cos(a)]);
    }
    s += `<path d="M${pts.map((p) => p.map(f).join(' ')).join(' L')}" fill="none" stroke="${fill}" stroke-width="1.2"/>`;
    const dir = Math.sign(a1 - a0);
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) / n;
      const a = a0 + (a1 - a0) * t;
      const rad = (a * Math.PI) / 180;
      const x = cx + r * Math.sin(rad), y = cy - r * Math.cos(rad);
      for (const side of [-1, 1]) {
        const rot = a + dir * 90 + side * 38;
        const sc = leaf * (0.75 + 0.25 * Math.sin(t * Math.PI));
        s += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(sc)}" ry="${f(sc * 0.38)}" transform="rotate(${f(rot - 90)} ${f(x)} ${f(y)}) translate(${f(sc * 0.8)} 0)" fill="${fill}"/>`;
      }
    }
    return s;
  };
  const ribbon = (cx, cy, w, hh, fill) => {
    const n = hh * 0.5, x0 = cx - w / 2, x1 = cx + w / 2;
    return `<path d="M${f(x0 - 14)} ${f(cy - hh / 2 + 5)} H${f(x0)} V${f(cy + hh / 2 + 5)} H${f(x0 - 14)} L${f(x0 - 14 + n)} ${f(cy + 5)} Z" fill="${fill}" opacity="1"/>` +
      `<path d="M${f(x1 + 14)} ${f(cy - hh / 2 + 5)} H${f(x1)} V${f(cy + hh / 2 + 5)} H${f(x1 + 14)} L${f(x1 + 14 - n)} ${f(cy + 5)} Z" fill="${fill}"/>` +
      rect(x0, cy - hh / 2, w, hh, fill);
  };
  // Vintage print wear: a mask that knocks tiny specks out of every ink.
  const grain = (id, w, hh, seed = 3, density = 0.035) => {
    let s = seed;
    const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    let dots = '';
    const n = Math.round(w * hh * density);
    for (let i = 0; i < n; i++) {
      const r = 0.18 + rnd() ** 3 * 1.1;
      dots += `<circle cx="${f(rnd() * w)}" cy="${f(rnd() * hh)}" r="${f(r)}"/>`;
    }
    for (let i = 0; i < 14; i++) {
      const x = rnd() * w, y = rnd() * hh, l = 8 + rnd() * 30, a = rnd() * 180;
      dots += `<rect x="${f(x)}" y="${f(y)}" width="${f(l)}" height="0.35" transform="rotate(${f(a)} ${f(x)} ${f(y)})"/>`;
    }
    return `<mask id="${id}" maskUnits="userSpaceOnUse" x="0" y="0" width="${w}" height="${hh}"><rect width="${w}" height="${hh}" fill="#fff"/><g fill="#000">${dots}</g></mask>`;
  };
  // Engraving slot: recolours art/kittl/<name>.svg to one ink, or draws a placeholder.
  const engraving = (name, x, y, w, hh, fill) => {
    const file = path.join(ART, `${name}.svg`);
    if (fs.existsSync(file)) {
      const src = fs.readFileSync(file, 'utf8');
      const vb = (src.match(/viewBox="([^"]+)"/) || [])[1] || `0 0 ${w} ${hh}`;
      const inner = src.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')
        .replace(/fill="(#?[0-9a-fA-F]{3,6}|rgb[^"]*|black)"/g, (m, c) => (isLight(c) ? 'fill="none"' : `fill="${fill}"`))
        .replace(/fill:\s*(#?[0-9a-fA-F]{3,6})/g, (m, c) => (isLight(c) ? 'fill:none' : `fill:${fill}`));
      return { svg: `<svg x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(hh)}" viewBox="${vb}" preserveAspectRatio="xMidYMid meet">${inner}</svg>`, pending: false };
    }
    const lab = `KITTL ENGRAVING · ${name.toUpperCase()}`;
    return {
      svg: `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(hh)}" fill="none" stroke="${fill}" stroke-width="0.8" stroke-dasharray="4 3"/>` +
        mono(lab, { size: Math.min(5, fit(lab, 'mono500', w - 16, 0.16)), x: x + w / 2, y: y + hh / 2, anchor: 'middle', fill }),
      pending: true,
    };
  };
  const isLight = (c) => {
    if (c === 'black') return false;
    const m = c.replace('#', '');
    if (!/^[0-9a-fA-F]+$/.test(m)) return false;
    const hex = m.length === 3 ? m.split('').map((x) => x + x).join('') : m;
    const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
    return 0.299 * r + 0.587 * g + 0.114 * b > 150;
  };
  const back = (y = 105) => ({ view: 'back', x: 0, y });
  const front = (y = 150, x = 0) => ({ view: 'front', x, y });
  const W = 300, H = 400; // standard back print area (mm)

  // ============================================================================
  // 1 — WAVING / LUXURY, script across
  add({ n: 1, slug: 'waving-luxury-stack', title: 'Waving luxury', group: 'Back print', g: 'bone', w: W, h: 330,
    build() {
      const a = line('WAVING', 'anton', 0, 0, W, C.ink);
      const b = line('LUXURY', 'anton', 0, a.base + 14, W, C.ink);
      const s = text('Paris', { font: 'script', size: 150, x: W / 2 + 8, y: a.base + 70, anchor: 'middle', fill: C.brass });
      const m = mono('DE NOYON · PARIS · COLLECTION 04', { size: 5.2, x: W / 2, y: b.base + 22, anchor: 'middle', fill: C.ink });
      return { ink: a.svg + b.svg + m, brass: `<g transform="rotate(-8 150 ${f(a.base + 40)})">${s}</g>`, grain: true };
    } });

  // 2 — TWELVE ×12, the fourth in brass
  add({ n: 2, slug: 'twelve-times-twelve', title: 'Twelve, twelve times', group: 'Back print', g: 'ink', w: 250, h: 400,
    build() {
      const size = 29.5 / cap('anton', 1); let cream = '', brass = '';
      for (let i = 0; i < 12; i++) {
        const y = i * 31.6 + cap('anton', size);
        const t = text('TWELVE', { font: 'anton', size, x: 125, y, anchor: 'middle', tracking: 0.02, fill: C.cream });
        if (i === 3) brass += t.replace(C.cream, C.brass);
        else cream += i === 0 || i === 11 ? t : outline(t, C.cream, 0.7);
      }
      return { cream, brass, grain: true };
    } });

  // 3 — DE / NO / YON, monumental
  add({ n: 3, slug: 'de-no-yon', title: 'DE / NO / YON', group: 'Back print', g: 'oxblood', w: W, h: 390,
    build() {
      const lines = ['DE', 'NO', 'YON']; let y = 0, cream = '';
      const size = fit('YON', 'bodoni900', W, -0.02);
      for (const s of lines) { cream += text(s, { font: 'bodoni900', size, x: 0, y: y + cap('bodoni900', size), tracking: -0.02, fill: C.cream }); y += cap('bodoni900', size) + 12; }
      cream += mono('THE HOUSE OF THE GOLDSMITH · PARIS', { size: 5, x: 0, y: y + 6, fill: C.cream });
      return { cream, brass: rect(0, y - 4, W, 2.2, C.brass), grain: true };
    } });

  // 4 — Collegiate arch, PARIS, laurels
  add({ n: 4, slug: 'atelier-paris-crest', title: 'Atelier, Paris crest', group: 'Back print', g: 'bone', w: W, h: 330,
    build() {
      let ox = arcText('DE NOYON ATELIER', { font: 'anton', size: 34, cx: 150, cy: 250, r: 190, mid: 0, tracking: 0.04, fill: C.oxblood });
      const p = line('PARIS', 'playfair900', 40, 118, 220, C.oxblood, { anchor: 'middle' });
      ox += p.svg;
      ox += mono('1948', { size: 9, x: 22, y: p.base - 12, fill: C.oxblood }) + mono('1979', { size: 9, x: 278, y: p.base - 12, anchor: 'end', fill: C.oxblood });
      let brass = laurel(150, 200, 105, 200, 250, C.brass, 9, 8) + laurel(150, 200, 105, 160, 110, C.brass, 9, 8);
      brass += ribbon(150, 290, 170, 26, C.brass);
      ox += text('THE PATTERN BOOKS', { font: 'anton', size: 14, x: 150, y: 296, anchor: 'middle', tracking: 0.12, fill: C.oxblood });
      return { oxblood: ox, brass, grain: true };
    } });

  // 5 — cut on the BIAS (script over block)
  add({ n: 5, slug: 'bias-script-over-block', title: 'cut on the BIAS', group: 'Back print', g: 'ink', w: W, h: 300,
    build() {
      const b = line('BIAS', 'anton', 0, 40, W, C.cream);
      const s = text('cut on the', { font: 'script', size: 96, x: 150, y: 110, anchor: 'middle', fill: C.brass });
      const m = mono('45° TO THE GRAIN · COLLECTION 04', { size: 5.4, x: 150, y: b.base + 24, anchor: 'middle', fill: C.cream });
      return { cream: b.svg + m, brass: `<g transform="rotate(-7 150 90)">${s}</g>`, grain: true };
    } });

  // 6 — CUT ON THE BIAS, flowing flag warp
  add({ n: 6, slug: 'bias-flag-warp', title: 'Cut on the bias, waving', group: 'Back print', g: 'limestone', w: W, h: 300,
    build() {
      const wave = (x, y) => [x, y + 16 * Math.sin((x / W) * Math.PI * 2 - 0.6)];
      const s1 = fit('CUT ON', 'anton', W), s2 = fit('THE BIAS', 'anton', W);
      let ink = warpedText('CUT ON', { font: 'anton', size: s1, x: 0, y: 30 + cap('anton', s1) }, wave);
      ink = ink.replace('fill="undefined"', `fill="${C.ink}"`);
      let ink2 = warpedText('THE BIAS', { font: 'anton', size: s2, x: 0, y: 30 + cap('anton', s1) + 16 + cap('anton', s2), fill: C.ink }, wave);
      const y3 = 30 + cap('anton', s1) + 16 + cap('anton', s2) + 36;
      const m = mono('FALLS IN A SINGLE WAVE · DE NOYON', { size: 5.4, x: 0, y: y3 + 14, fill: C.ink });
      const brass = `<path d="M0 ${f(y3)} ${Array.from({ length: 31 }, (_, i) => { const x = (i / 30) * W; return `L${f(x)} ${f(y3 + 6 * Math.sin((x / W) * Math.PI * 2 - 0.6))}`; }).join(' ').slice(1)}" fill="none" stroke="${C.brass}" stroke-width="2.4"/>`;
      return { ink: ink + ink2 + m, brass, grain: true };
    } });

  // 7 — four-sided frame, WAVING LUXURY, 04 in the centre
  add({ n: 7, slug: 'four-sided-frame', title: 'Four-sided frame', group: 'Back print', g: 'bone', w: 290, h: 290,
    build() {
      const S = 290, band = 34, s = 'WAVING LUXURY';
      const size = fit(s, 'anton', S - 2 * band - 8, 0.03);
      const edge = (rot) => `<g transform="rotate(${rot} ${S / 2} ${S / 2})">${text(s, { font: 'anton', size, x: S / 2, y: band / 2 + cap('anton', size) / 2, anchor: 'middle', tracking: 0.03, fill: C.ink })}</g>`;
      const ink = edge(0) + edge(90) + edge(180) + edge(270);
      const ox = rect(band + 6, band + 6, S - 2 * band - 12, S - 2 * band - 12, C.oxblood);
      const n = line('04', 'bodoni900', band + 30, band + 44, S - 2 * band - 60, C.cream, { anchor: 'middle' });
      const m = mono('No. 04 OF 12', { size: 6, x: S / 2, y: S - band - 22, anchor: 'middle', fill: C.cream });
      return { ink, oxblood: ox, cream: n.svg + m, brass: frame(band + 12, band + 12, S - 2 * band - 24, S - 2 * band - 24, C.brass, 1.2) };
    } });

  // 8 — ONE ATELIER., stars and corner notes (black tee)
  add({ n: 8, slug: 'one-atelier-stars', title: 'One atelier', group: 'Back print', g: 'ink', w: 280, h: 280,
    build() {
      const a = line('ONE', 'playfair900', 40, 86, 200, C.cream, { anchor: 'middle' });
      const b = line('ATELIER.', 'playfair900', 20, a.base + 12, 240, C.cream, { anchor: 'middle' });
      let cream = a.svg + b.svg;
      cream += mono('PARIS, 8e', { size: 4.6, x: 0, y: 8, fill: C.cream }) + mono('NO WHOLESALE', { size: 4.6, x: 280, y: 8, anchor: 'end', fill: C.cream });
      cream += mono('ONE STOREFRONT', { size: 4.6, x: 0, y: 278, fill: C.cream }) + mono('DE NOYON', { size: 4.6, x: 280, y: 278, anchor: 'end', fill: C.cream });
      cream += rect(0, 20, 0.8, 240, C.cream) + rect(279.2, 20, 0.8, 240, C.cream);
      const brass = star(140, 50, 10, C.brass) + star(140, b.base + 40, 10, C.brass);
      return { cream, brass };
    } });

  // 9 — WHEN THEY / are gone / THE PATTERN / IS RETIRED.
  add({ n: 9, slug: 'when-they-are-gone', title: 'When they are gone', group: 'Back print', g: 'ink', w: 280, h: 380,
    build() {
      const a = line('WHEN THEY', 'anton', 0, 0, 280, C.cream);
      const s = text('are gone', { font: 'script', size: 110, x: 140, y: a.base + 78, anchor: 'middle', fill: C.brass });
      const b = line('THE PATTERN', 'anton', 0, a.base + 104, 280, C.cream);
      const c = line('IS RETIRED.', 'anton', 0, b.base + 12, 280, C.cream);
      const m = mono('TWELVE MADE · DE NOYON · PARIS', { size: 5.2, x: 140, y: c.base + 22, anchor: 'middle', fill: C.cream });
      return { cream: a.svg + b.svg + c.svg + m, brass: s, grain: true };
    } });

  // 10 — 1948 to 1979
  add({ n: 10, slug: '1948-to-1979', title: '1948 to 1979', group: 'Back print', g: 'limestone', w: W, h: 330,
    build() {
      const a = line('1948', 'bodoni900', 0, 0, W, C.ink, { tracking: -0.02 });
      const b = line('1979', 'bodoni900', 0, a.base + 58, W, C.ink, { tracking: -0.02 });
      const s = text('to', { font: 'script', size: 90, x: 150, y: a.base + 58, anchor: 'middle', fill: C.brass });
      const m = mono('THE PATTERN BOOKS OF DE NOYON', { size: 5.6, x: 150, y: b.base + 24, anchor: 'middle', fill: C.ink });
      return { ink: a.svg + b.svg + m, brass: s, grain: true };
    } });

  // 11 — PARIS grid, solid and outline
  add({ n: 11, slug: 'paris-grid', title: 'Paris grid', group: 'Back print', g: 'bone', w: 280, h: 390,
    build() {
      let ink = '';
      const size = fit('PARIS', 'anton', 240, 0.02);
      const ch = cap('anton', size);
      for (let i = 0; i < 5; i++) {
        const y = 18 + i * (ch + 10) + ch;
        const t = text('PARIS', { font: 'anton', size, x: 20, y, tracking: 0.02, fill: C.ink });
        ink += i % 2 ? outline(t, C.ink, 0.9) : t;
      }
      ink += `<g transform="rotate(-90 8 195)">${mono('DE NOYON · ATELIER · PARIS 8e', { size: 5, x: 8, y: 197, anchor: 'middle', fill: C.ink })}</g>`;
      ink += `<g transform="rotate(90 272 195)">${mono('ONE STOREFRONT · NO WHOLESALE', { size: 5, x: 272, y: 197, anchor: 'middle', fill: C.ink })}</g>`;
      return { ink, brass: rect(20, 18 + 5 * (ch + 10) + 2, 240, 2.4, C.brass), grain: true };
    } });

  // 12 — circle badge, 12
  add({ n: 12, slug: 'edition-seal', title: 'Edition seal', group: 'Back print', g: 'oxblood', w: 280, h: 280,
    build() {
      let cream = `<circle cx="140" cy="140" r="138" fill="none" stroke="${C.cream}" stroke-width="2"/><circle cx="140" cy="140" r="100" fill="none" stroke="${C.cream}" stroke-width="0.9"/>`;
      cream += arcText('DE NOYON · PARIS · DE NOYON · PARIS ·', { font: 'anton', size: 22, cx: 140, cy: 140, r: 110, mid: 0, tracking: 0.12, fill: C.cream });
      const n = line('12', 'bodoni900', 70, 78, 140, C.cream, { anchor: 'middle' });
      cream += n.svg + mono('EDITION OF TWELVE', { size: 6, x: 140, y: n.base + 22, anchor: 'middle', fill: C.cream });
      return { cream, brass: star(140, 60, 8, C.brass) + star(66, 140, 5, C.brass) + star(214, 140, 5, C.brass) };
    } });

  // 13 — 45°, the line it names
  add({ n: 13, slug: 'forty-five-bold', title: '45°', group: 'Back print', g: 'bone', w: W, h: 300,
    build() {
      const a = line('45°', 'bodoni900', 0, 20, W, C.ink, { tracking: -0.03 });
      const brass = `<path d="M-2 ${f(a.base + 30)} L${W + 2} ${f(a.base + 30 - W)}" stroke="${C.brass}" stroke-width="4"/>`;
      const m = mono('CUT ON THE BIAS · THE WHOLE CONSTRUCTION IN ONE ANGLE', { size: 5, x: 0, y: a.base + 32, fill: C.ink });
      return { ink: a.svg + m, brass, grain: true };
    } });

  // 14 — varsity: WAVING solid, LUXURY outline
  add({ n: 14, slug: 'varsity-waving-luxury', title: 'Varsity, waving luxury', group: 'Back print', g: 'ink', w: W, h: 320,
    build() {
      const top = arcText('DE NOYON · PARIS', { font: 'anton', size: 20, cx: 150, cy: 420, r: 400, mid: 0, tracking: 0.2, fill: C.brass });
      const a = line('WAVING', 'oswald700', 0, 42, W, C.cream);
      const b = line('LUXURY', 'oswald700', 0, a.base + 12, W, C.cream);
      const m = mono('COLLECTION 04', { size: 6, x: 150, y: b.base + 24, anchor: 'middle', fill: C.cream });
      return { cream: a.svg + outline(b.svg, C.cream, 1.2) + m, brass: top, grain: true };
    } });

  // 15 — THE 1974 CUT over bold pattern pieces
  add({ n: 15, slug: '1974-cut-pieces', title: 'The 1974 cut', group: 'Back print', g: 'limestone', w: W, h: 390,
    build() {
      const a = line('THE 1974 CUT', 'anton', 0, 0, W, C.ink);
      const body = (x, y, w, hh, drop) => `M${f(x + w * 0.32)} ${f(y)} L${f(x)} ${f(y + hh * 0.07)} C${f(x + w * 0.1)} ${f(y + hh * 0.14)} ${f(x + w * 0.09)} ${f(y + hh * 0.24)} ${f(x + w * 0.05)} ${f(y + hh * 0.3)} L${f(x + w * 0.03)} ${f(y + hh)} L${f(x + w * 0.97)} ${f(y + hh)} L${f(x + w * 0.95)} ${f(y + hh * 0.3)} C${f(x + w * 0.91)} ${f(y + hh * 0.24)} ${f(x + w * 0.9)} ${f(y + hh * 0.14)} ${f(x + w)} ${f(y + hh * 0.07)} L${f(x + w * 0.68)} ${f(y)} C${f(x + w * 0.64)} ${f(y + drop)} ${f(x + w * 0.36)} ${f(y + drop)} ${f(x + w * 0.32)} ${f(y)} Z`;
      const y0 = a.base + 22;
      let brass = `<path d="${body(0, y0, 140, 250, 30)}" fill="${C.brass}"/>`;
      let ink = `<path d="${body(160, y0, 140, 250, 10)}" fill="${C.ink}"/>`;
      ink += `<g transform="rotate(-45 70 ${f(y0 + 140)})">${rect(10, y0 + 139, 120, 1.6, C.ink)}</g>`;
      ink += mono('FRONT · CUT ON THE BIAS', { size: 5, x: 0, y: y0 + 268, fill: C.ink }) + mono('BACK', { size: 5, x: 300, y: y0 + 268, anchor: 'end', fill: C.ink });
      return { ink: a.svg + ink, brass, grain: true };
    } });

  // 16 — No. 04 OF 12
  add({ n: 16, slug: 'no-04-of-12', title: 'No. 04 of 12', group: 'Back print', g: 'bone', w: W, h: 330,
    build() {
      const a = line('No. 04', 'anton', 0, 0, W, C.ink);
      const s = text('of', { font: 'script', size: 100, x: 40, y: a.base + 70, fill: C.oxblood });
      const b = line('12', 'anton', 110, a.base + 16, 190, C.ink, { anchor: 'end' });
      const p1 = mono('TWELVE MADE. EACH NUMBERED ON THE FACING.', { size: 5.2, x: 0, y: b.base + 22, fill: C.ink });
      return { ink: a.svg + b.svg + p1, oxblood: s, brass: rect(0, b.base + 8, 90, 2.4, C.brass), grain: true };
    } });

  // 17 — PARIS reflected
  add({ n: 17, slug: 'paris-reflection', title: 'Paris, reflected', group: 'Back print', g: 'ink', w: W, h: 260,
    build() {
      const a = line('PARIS', 'bodoni900', 0, 10, W, C.cream, { tracking: -0.01 });
      const mir = `<g transform="translate(0 ${f(2 * a.base + 18)}) scale(1 -1)">${outline(a.svg, C.cream, 0.8)}</g>`;
      return { cream: a.svg + mir + mono('ATELIER · 8e ARRONDISSEMENT', { size: 5.2, x: 150, y: 256, anchor: 'middle', fill: C.cream }), brass: rect(0, a.base + 8, W, 2.2, C.brass), grain: true };
    } });

  // 18 — heavy wave with WAVING knocked in
  add({ n: 18, slug: 'heavy-wave', title: 'Heavy wave', group: 'Back print', g: 'oxblood', w: W, h: 345,
    build() {
      const ws = wavePaths(0, 8, W, 205, 12);
      const cream = ws.slice(0, 11).map((d) => `<path d="${d}" fill="none" stroke="${C.cream}" stroke-width="3.2"/>`).join('');
      const a = line('WAVING', 'anton', 0, 245, W, C.cream);
      return { cream: cream + a.svg, brass: `<path d="${ws[11]}" fill="none" stroke="${C.brass}" stroke-width="4"/>`, grain: true };
    } });

  // 19 — NO WHOLESALE, bulged
  add({ n: 19, slug: 'no-wholesale-bulge', title: 'No wholesale', group: 'Back print', g: 'bone', w: W, h: 300,
    build() {
      const size = fit('WHOLESALE', 'anton', W);
      const y0 = 60, hh = cap('anton', size);
      const bulge = (x, y) => { const u = (x / W) * 2 - 1; const k = 1 + 0.5 * (1 - u * u); const cy = y0 + 70 + hh / 2; return [x, cy + (y - cy) * k]; };
      const a = warpedText('NO', { font: 'anton', size: size * 0.6, x: 150, y: 50, anchor: 'middle', fill: C.ink }, (x, y) => [x, y]);
      const b = warpedText('WHOLESALE', { font: 'anton', size, x: 0, y: y0 + 70 + hh, fill: C.ink }, bulge);
      const m = mono('ONE STOREFRONT · ONE ATELIER · PARIS', { size: 5.4, x: 150, y: 290, anchor: 'middle', fill: C.ink });
      return { ink: a + b + m, brass: rect(110, 60, 80, 2.4, C.brass), grain: true };
    } });

  // 20 — ELIGIUS crest (type only)
  add({ n: 20, slug: 'eligius-crest', title: 'Eligius crest', group: 'Back print', g: 'ink', w: W, h: 320,
    build() {
      let cream = arcText('PATRON OF GOLDSMITHS', { font: 'anton', size: 26, cx: 150, cy: 240, r: 180, mid: 0, tracking: 0.08, fill: C.cream });
      const e = line('ELIGIUS', 'playfair900', 36, 110, 228, C.cream, { anchor: 'middle' });
      cream += e.svg;
      let brass = laurel(150, 180, 110, 205, 250, C.brass, 9, 7.5) + laurel(150, 180, 110, 155, 110, C.brass, 9, 7.5);
      brass += ribbon(150, 272, 130, 24, C.brass);
      const ink = text('OF NOYON', { font: 'anton', size: 15, x: 150, y: 279, anchor: 'middle', tracking: 0.16, fill: C.ink });
      return { cream, brass, ink, grain: true };
    } });

  // 21 — STRUCTURE. CLOTH. ONE BRASS LINE.
  add({ n: 21, slug: 'structure-cloth-brass', title: 'Structure, cloth, one brass line', group: 'Back print', g: 'limestone', w: W, h: 330,
    build() {
      const a = line('STRUCTURE.', 'anton', 0, 0, W, C.ink);
      const b = line('CLOTH.', 'anton', 0, a.base + 12, W * 0.62, C.ink);
      const c = line('ONE BRASS LINE.', 'anton', 0, b.base + 12, W, C.brass);
      const m = mono('IF AN ELEMENT IS NOT ONE OF THESE, DELETE IT.', { size: 5.2, x: 0, y: c.base + 22, fill: C.ink });
      return { ink: a.svg + b.svg + m, brass: c.svg, grain: true };
    } });

  // 22 — the luxury comes from what is left out
  add({ n: 22, slug: 'left-out-quote', title: 'What is left out', group: 'Back print', g: 'bone', w: 280, h: 300,
    build() {
      const q = text('“', { font: 'playfair900', size: 180, x: -6, y: 150, fill: C.brass });
      const lines = ['The luxury', 'comes from', 'what is', 'left out.'];
      let ink = '', y = 70;
      lines.forEach((l, i) => { const L = line(l, 'playfair900i', 0, y, i === 3 ? 280 : 250, C.ink, { max: 52 }); ink += L.svg; y = L.base + 12; });
      ink += mono('DE NOYON · PARIS', { size: 5.4, x: 0, y: y + 12, fill: C.ink });
      return { ink, brass: q, grain: true };
    } });

  // 23 — DE NOYON down the spine
  add({ n: 23, slug: 'spine-wordmark', title: 'Spine wordmark', group: 'Back print', g: 'ink', w: 120, h: 420,
    build() {
      const size = fit('DE NOYON', 'anton', 420, 0.02);
      const cream = `<g transform="rotate(90)">${text('DE NOYON', { font: 'anton', size, x: 0, y: 0, tracking: 0.02, fill: C.cream })}</g>`;
      const x2 = cap('anton', size) + 10;
      const brass = rect(x2, 0, 3, 420, C.brass);
      const m = `<g transform="translate(${f(x2 + 14)} 0) rotate(90)">${mono('WAVING LUXURY · PARIS · COLLECTION 04', { size: 6, x: 0, y: 0, fill: C.cream })}</g>`;
      return { cream: cream + m, brass, grain: true };
    } });

  // 24 — Collection 04 shield
  add({ n: 24, slug: 'collection-shield', title: 'Collection 04 shield', group: 'Back print', g: 'bone', w: 240, h: 300,
    build() {
      const shield = 'M20 10 H220 V170 C220 240 160 272 120 290 C80 272 20 240 20 170 Z';
      const ox = `<path d="${shield}" fill="${C.oxblood}"/>`;
      const n = line('04', 'bodoni900', 50, 60, 140, C.cream, { anchor: 'middle' });
      const t = mono('COLLECTION', { size: 9, x: 120, y: 42, anchor: 'middle', fill: C.cream });
      const b = mono('DE NOYON · PARIS', { size: 6, x: 120, y: n.base + 30, anchor: 'middle', fill: C.cream });
      return { oxblood: ox, cream: n.svg + t + b, brass: `<path d="${shield}" fill="none" stroke="${C.brass}" stroke-width="2.4" transform="translate(12 12) scale(0.9)"/>`, grain: true };
    } });

  // 25 — BIAS repeated on the diagonal (clipped)
  add({ n: 25, slug: 'bias-diagonal-field', title: 'Bias field', group: 'Back print', g: 'limestone', w: W, h: H, clip: true,
    build() {
      let ink = '', brass = '';
      const size = 34, ch = cap('anton', size);
      for (let r = -8; r < 16; r++) {
        let row = ''; for (let k = 0; k < 8; k++) row += 'BIAS ';
        const y = r * (ch + 8);
        const t = text(row.trim(), { font: 'anton', size, x: -200 + (r % 2) * 40, y, tracking: 0.04, fill: C.ink });
        if (r === 4) brass += t.replace(C.ink, C.brass); else ink += r % 3 ? outline(t, C.ink, 0.6) : t;
      }
      return { ink: `<g transform="rotate(-45 150 200)">${ink}</g>`, brass: `<g transform="rotate(-45 150 200)">${brass}</g>`, grain: true };
    } });

  // 26 — Collection 04, piece list (tour-shirt format)
  add({ n: 26, slug: 'collection-list-bold', title: 'Collection 04 list', group: 'Back print', g: 'ink', w: W, h: 390,
    build() {
      const a = line('COLLECTION 04', 'anton', 0, 0, W, C.cream);
      const pieces = ['Bias silk coat', 'Draped wool gilet', 'Waving pleat skirt', 'Hand-finished cashmere scarf', 'Column dress in silk-viscose', 'Tailored crepe trouser'];
      let cream = a.svg, y = a.base + 44;
      pieces.forEach((p, i) => {
        cream += text(String(i + 1).padStart(2, '0'), { font: 'anton', size: 20, x: 0, y, fill: C.cream });
        cream += text(p, { font: 'playfair900i', size: Math.min(22, fit(p, 'playfair900i', 250)), x: 40, y, fill: C.cream });
        y += 42;
      });
      return { cream, brass: rect(0, a.base + 12, W, 2.4, C.brass), grain: true };
    } });

  // 27 — PLASTER / LIMESTONE / EBONY / BRASS
  add({ n: 27, slug: 'materials', title: 'Materials', group: 'Back print', g: 'bone', w: W, h: 390,
    build() {
      const a = line('PLASTER', 'anton', 0, 0, W, C.ink);
      const b = line('LIMESTONE', 'anton', 0, a.base + 12, W, C.ink);
      const c = line('EBONY', 'anton', 0, b.base + 12, W, C.ink);
      const d = line('BRASS', 'anton', 0, c.base + 12, W, C.brass);
      return { ink: outline(a.svg, C.ink, 0.9) + outline(b.svg, C.ink, 0.9) + c.svg + mono('THE FIVE MATERIALS OF THE HOUSE · MARBLE IMPLIED', { size: 5, x: 0, y: d.base + 20, fill: C.ink }), brass: d.svg, grain: true };
    } });

  // 28 — NOYON & PARIS
  add({ n: 28, slug: 'noyon-and-paris', title: 'Noyon & Paris', group: 'Back print', g: 'oxblood', w: W, h: 345,
    build() {
      const a = line('NOYON', 'anton', 30, 0, 240, C.cream, { anchor: 'middle' });
      const amp = text('&', { font: 'playfair900i', size: 150, x: 150, y: a.base + 118, anchor: 'middle', fill: C.brass });
      const b = line('PARIS', 'anton', 30, a.base + 132, 240, C.cream, { anchor: 'middle' });
      const m = mono('THE SAINT’S NAME · THE HOUSE’S CITY', { size: 5.4, x: 150, y: b.base + 22, anchor: 'middle', fill: C.cream });
      return { cream: a.svg + b.svg + m, brass: amp, grain: true };
    } });

  // 29 — postmark
  add({ n: 29, slug: 'postmark', title: 'Postmark, Paris 8e', group: 'Back print', g: 'bone', w: W, h: 220,
    build() {
      let ink = `<circle cx="100" cy="110" r="96" fill="none" stroke="${C.ink}" stroke-width="3"/><circle cx="100" cy="110" r="70" fill="none" stroke="${C.ink}" stroke-width="1.2"/>`;
      ink += arcText('DE NOYON · ATELIER ·', { font: 'anton', size: 20, cx: 100, cy: 110, r: 76, mid: 0, tracking: 0.14, fill: C.ink });
      ink += arcText('PARIS', { font: 'anton', size: 20, cx: 100, cy: 110, r: 76, mid: 180, tracking: 0.3, fill: C.ink, inside: true });
      ink += text('8e', { font: 'bodoni900', size: 70, x: 100, y: 134, anchor: 'middle', fill: C.ink });
      let brass = '';
      for (let i = 0; i < 6; i++) { const y = 60 + i * 20; brass += `<path d="M150 ${y} ${Array.from({ length: 16 }, (_, k) => `L${f(150 + k * 10)} ${f(y + 6 * Math.sin(k * 0.9))}`).join(' ').slice(1)}" fill="none" stroke="${C.brass}" stroke-width="2.4"/>`; }
      return { ink, brass, grain: true };
    } });

  // 30 — FALLS IN A SINGLE WAVE, italic slab
  add({ n: 30, slug: 'single-wave-slant', title: 'Falls in a single wave', group: 'Back print', g: 'limestone', w: W, h: 330,
    build() {
      const lines = ['FALLS', 'IN A SINGLE', 'WAVE.']; let ink = '', y = 0;
      lines.forEach((l, i) => { const L = line(l, 'anton', i === 2 ? 50 : 0, y, i === 2 ? 180 : 230, i === 2 ? C.brass : C.ink); if (i === 2) ink += `<g data-brass>${L.svg}</g>`; else ink += L.svg; y = L.base + 12; });
      const parts = ink.split('<g data-brass>');
      const m = mono('A PIECE CUT ON THE BIAS · DE NOYON', { size: 5.2, x: 0, y: y + 12, fill: C.ink });
      return { ink: `<g transform="translate(62 0) skewX(-10)">${parts[0]}</g>` + m, brass: `<g transform="translate(62 0) skewX(-10)">${parts[1].replace('</g>', '')}</g>`, grain: true };
    } });

  // ---- front and combo placements ---------------------------------------------
  // 31 — WAVING LUXURY arched across the chest
  add({ n: 31, slug: 'chest-arch', title: 'Arched chest', group: 'Front print', g: 'bone', w: 260, h: 110, place: [front(150)],
    build() {
      const ink = arcText('WAVING LUXURY', { font: 'anton', size: 40, cx: 130, cy: 340, r: 320, mid: 0, tracking: 0.04, fill: C.ink });
      const s = text('Paris', { font: 'script', size: 50, x: 130, y: 100, anchor: 'middle', fill: C.brass });
      return { ink, brass: s };
    } });

  // 32 — DE NOYON, full chest
  add({ n: 32, slug: 'chest-wordmark-heavy', title: 'Chest wordmark, heavy', group: 'Front print', g: 'ink', w: 280, h: 70, place: [front(150)],
    build() {
      const a = line('DE NOYON', 'anton', 0, 0, 280, C.cream, { tracking: 0.08 });
      return { cream: a.svg, brass: rect(0, a.base + 8, 280, 4, C.brass), grain: true };
    } });

  // 33 — Paris, pocket script
  add({ n: 33, slug: 'pocket-script', title: 'Paris, pocket', group: 'Front print', g: 'ink', w: 90, h: 50, place: [front(95, 95)],
    build() {
      const s = text('Paris', { font: 'script', size: 44, x: 45, y: 32, anchor: 'middle', fill: C.brass });
      return { brass: s, cream: mono('DE NOYON · 8e', { size: 4, x: 45, y: 46, anchor: 'middle', fill: C.cream }) };
    } });

  // 34 — Twelve made., chest script
  add({ n: 34, slug: 'twelve-made-script', title: 'Twelve made, script', group: 'Front print', g: 'oxblood', w: 260, h: 110, place: [front(150)],
    build() {
      const s = text('Twelve made.', { font: 'script', size: 70, x: 130, y: 64, anchor: 'middle', fill: C.cream });
      return { cream: s + mono('No. 04 OF 12 · DE NOYON', { size: 5.4, x: 130, y: 100, anchor: 'middle', fill: C.cream }), brass: rect(90, 80, 80, 2, C.brass) };
    } });

  // 35 — box logo
  add({ n: 35, slug: 'box-logo', title: 'Box logo', group: 'Front print', g: 'bone', w: 200, h: 56, place: [front(150)],
    build() {
      const size = fit('DE NOYON', 'anton', 170, 0.08);
      const t = text('DE NOYON', { font: 'anton', size, x: 100, y: 28 + cap('anton', size) / 2, anchor: 'middle', tracking: 0.08, fill: C.ink });
      return { brass: rect(0, 0, 200, 56, C.brass), ink: t };
    } });

  // 36 — 1974, chest
  add({ n: 36, slug: 'chest-1974', title: '1974, chest', group: 'Front print', g: 'limestone', w: 240, h: 110, place: [front(155)],
    build() {
      const a = line('1974', 'bodoni900', 0, 0, 240, C.ink, { tracking: -0.02 });
      return { ink: a.svg + mono('THE PATTERN · CUT ON THE BIAS', { size: 5, x: 240, y: a.base + 16, anchor: 'end', fill: C.ink }), brass: rect(0, a.base + 10, 70, 2.4, C.brass), grain: true };
    } });

  // 37 — CUT ON (front) / THE BIAS. (back)
  add({ n: 37, slug: 'split-cut-on-the-bias', title: 'Cut on / the bias', group: 'Front & back', g: 'ink',
    place: [{ view: 'front', part: 'front', x: 0, y: 160 }, { view: 'back', part: 'back', x: 0, y: 110 }],
    parts: [
      { key: 'front', w: 220, h: 80, build() { const a = line('CUT ON', 'anton', 0, 0, 220, C.cream); return { cream: a.svg }; } },
      { key: 'back', w: W, h: 330, build() {
        const a = line('THE', 'anton', 0, 0, 140, C.cream);
        const b = line('BIAS.', 'anton', 0, a.base + 12, W, C.cream);
        return { cream: a.svg + b.svg + mono('45° TO THE GRAIN · DE NOYON', { size: 5.4, x: 0, y: b.base + 22, fill: C.cream }), brass: rect(150, a.base - 6, 150, 3, C.brass), grain: true };
      } },
    ] });

  // 38 — No. 04 (front pocket) / OF TWELVE (back)
  add({ n: 38, slug: 'split-number', title: 'No. 04 / of twelve', group: 'Front & back', g: 'bone',
    place: [{ view: 'front', part: 'front', x: 95, y: 95 }, { view: 'back', part: 'back', x: 0, y: 110 }],
    parts: [
      { key: 'front', w: 80, h: 40, build() { const a = line('No. 04', 'anton', 0, 0, 80, C.ink); return { ink: a.svg, brass: rect(0, a.base + 5, 30, 1.6, C.brass) }; } },
      { key: 'back', w: W, h: 330, build() {
        const a = line('OF', 'anton', 0, 0, 110, C.ink);
        const b = line('TWELVE', 'anton', 0, a.base + 12, W, C.ink);
        return { ink: a.svg + b.svg + mono('EACH NUMBERED ON THE FACING', { size: 5.4, x: 0, y: b.base + 22, fill: C.ink }), brass: rect(125, a.base - 6, 175, 3, C.brass), grain: true };
      } },
    ] });

  // 39 — long sleeve: WAVING LUXURY down the sleeve, small back mark
  add({ n: 39, slug: 'sleeve-waving-luxury', title: 'Sleeve, waving luxury', group: 'Sleeve', g: 'ink', long: true,
    place: [{ view: 'front', part: 'sleeve', sleeveRun: true }, { view: 'back', part: 'back', x: 0, y: 45 }],
    parts: [
      { key: 'sleeve', w: 24, h: 380, build() {
        const size = Math.min(fit('WAVING LUXURY', 'anton', 380, 0.04), 21 / cap('anton', 1));
        return { cream: `<g transform="translate(2 0) rotate(90)">${text('WAVING LUXURY', { font: 'anton', size, x: 0, y: 0, tracking: 0.04, fill: C.cream })}</g>` };
      } },
      { key: 'back', w: 90, h: 22, build() { const a = line('DE NOYON', 'anton', 0, 0, 90, C.cream, { tracking: 0.1 }); return { cream: a.svg, brass: rect(0, a.base + 5, 90, 1.6, C.brass) }; } },
    ] });

  // 40 — twelve numerals, one in brass
  add({ n: 40, slug: 'twelve-numerals', title: 'Twelve numerals', group: 'Back print', g: 'oxblood', w: 282, h: 380,
    build() {
      let cream = '', brass = '';
      for (let i = 0; i < 12; i++) {
        const col = i % 3, row = Math.floor(i / 3), x = col * 96, y = row * 96;
        const s = String(i + 1).padStart(2, '0');
        const L = line(s, 'bodoni900', x + 6, y + 14, 78, C.cream, { anchor: 'middle', tracking: -0.02 });
        if (i === 3) brass += rect(x, y, 90, 90, C.brass) + L.svg.replace(C.cream, C.oxblood);
        else cream += L.svg + frame(x, y, 90, 90, C.cream, 0.8);
      }
      return { cream, brass, grain: true };
    } });

  // ---- 41–50: engraving-led --------------------------------------------------------
  const IMG = [
    { n: 41, slug: 'bust-waving-luxury', name: 'bust-drape', title: 'The bust, waving luxury', g: 'ink',
      prompt: 'Classical marble bust of a woman, silk cloth draped over one shoulder falling in a single wave' },
    { n: 42, slug: 'eligius-portrait', name: 'eligius', title: 'Eligius, patron of goldsmiths', g: 'bone',
      prompt: 'Saint Eligius, medieval bishop and goldsmith, portrait bust holding a small hammer' },
    { n: 43, slug: 'shears', name: 'shears', title: 'Shears', g: 'limestone',
      prompt: 'Open tailor’s shears, large, at 45 degrees' },
    { n: 44, slug: 'dress-form', name: 'dress-form', title: 'The form', g: 'bone',
      prompt: 'Dressmaker’s form with a length of cloth draped on the bias' },
    { n: 45, slug: 'hand-and-needle', name: 'hand-needle', title: 'Finished by hand', g: 'oxblood',
      prompt: 'A hand holding a needle drawing a thread, close crop' },
    { n: 46, slug: 'silk-ribbon', name: 'silk-wave', title: 'Silk, one wave', g: 'ink',
      prompt: 'A single length of silk falling in one soft wave' },
    { n: 47, slug: 'gold-throne', name: 'throne', title: 'The throne', g: 'ink',
      prompt: 'Merovingian gilded throne, frontal, ornate metalwork' },
    { n: 48, slug: 'paris-facade', name: 'paris-facade', title: 'Paris, 8e facade', g: 'limestone',
      prompt: 'Haussmann apartment facade in Paris with wrought-iron balconies' },
    { n: 49, slug: 'mint-coin', name: 'coin', title: 'The mint coin', g: 'oxblood',
      prompt: 'Antique gold coin with a profile portrait, medieval mint' },
    { n: 50, slug: 'iris-archive', name: 'iris', title: 'Archive iris', g: 'bone',
      prompt: 'Botanical iris flower with long stem and leaves' },
  ];
  for (const d of IMG) {
    add({ n: d.n, slug: d.slug, title: d.title, group: 'Back print', g: d.g, w: W, h: H, kittl: d,
      build() {
        const dark = ['ink', 'oxblood'].includes(d.g);
        const fgKey = dark ? 'cream' : 'ink', fg = C[fgKey];
        const im = engraving(d.name, 20, 70, 260, 250, fg);
        const heads = {
          41: ['WAVING', 'LUXURY'], 42: ['ELIGIUS', 'OF NOYON'], 43: ['CUT ON', 'THE BIAS'], 44: ['COLLECTION', '04'],
          45: ['FINISHED', 'BY HAND'], 46: ['ONE', 'WAVE'], 47: ['GOLD, BY', 'PROPORTION'], 48: ['PARIS', '8e'],
          49: ['MINT', 'MASTER'], 50: ['ARCHIVE', '1948 — 1979'],
        }[d.n];
        const a = line(heads[0], 'anton', 0, 0, W, fg);
        const b = line(heads[1], d.n === 50 ? 'bodoni900' : 'anton', 0, 330, W, C.brass, { max: 60 });
        const m = mono('DE NOYON · PARIS', { size: 5, x: 150, y: 396, anchor: 'middle', fill: fg });
        return { [fgKey]: a.svg + im.svg + m, brass: b.svg, grain: true, pending: im.pending };
      } });
  }
  return IMG;
}
