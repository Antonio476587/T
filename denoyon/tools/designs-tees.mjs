// T-shirt graphics 16–50. Each design has one hero element, at most one display
// face plus IBM Plex Mono (the Jost wordmark counts as the logo), brass only as a
// line, and only facts supplied by the design system:
//   Paris · 8e · one atelier, no wholesale · patterns 1948–1979 · the 1974 pattern book
//   twelve made · No. 04 of 12 · Collection 04 · cut on the bias · waving luxury
//   Eligius of Noyon, patron of goldsmiths · "When they are gone the pattern is retired."
//   Collection 04 piece names from the storefront kit.
//
// `mock` places each artboard on the tee mockup, in mm: x = centre (+ is the
// viewer's right), y = top edge measured from the high shoulder point.
// Front neckline sits at y 80, back neckline at y 20, hem at y 690.

export function addTees(h) {
  const { add, text, measure, fitSize, wordmark, wavePaths, rect, stroke, frame, eyebrow, mono, C, HAIR, RULE, f } = h;

  // A tee body piece and a sleeve piece, drawn as pattern outlines.
  const bodyPath = (x, y, w, hh, drop) => [
    `M${f(x + w * 0.32)} ${f(y)}`, `L${f(x)} ${f(y + hh * 0.07)}`,
    `C${f(x + w * 0.1)} ${f(y + hh * 0.14)} ${f(x + w * 0.09)} ${f(y + hh * 0.24)} ${f(x + w * 0.05)} ${f(y + hh * 0.3)}`,
    `L${f(x + w * 0.03)} ${f(y + hh)}`, `L${f(x + w * 0.97)} ${f(y + hh)}`, `L${f(x + w * 0.95)} ${f(y + hh * 0.3)}`,
    `C${f(x + w * 0.91)} ${f(y + hh * 0.24)} ${f(x + w * 0.9)} ${f(y + hh * 0.14)} ${f(x + w)} ${f(y + hh * 0.07)}`,
    `L${f(x + w * 0.68)} ${f(y)}`,
    `C${f(x + w * 0.64)} ${f(y + drop)} ${f(x + w * 0.36)} ${f(y + drop)} ${f(x + w * 0.32)} ${f(y)}`, 'Z'].join(' ');
  const sleevePath = (x, y, w, hh) =>
    `M${f(x)} ${f(y + hh)} L${f(x + w * 0.08)} ${f(y + hh * 0.42)} C${f(x + w * 0.25)} ${f(y - hh * 0.08)} ${f(x + w * 0.75)} ${f(y - hh * 0.08)} ${f(x + w * 0.92)} ${f(y + hh * 0.42)} L${f(x + w)} ${f(y + hh)} Z`;
  const grain = (cx, cy, len, color, w = 0.5, ang = -45) => {
    const a = 3.2;
    return `<g transform="rotate(${ang} ${f(cx)} ${f(cy)})">${rect(cx - len / 2 + a * 1.6, cy - w / 2, len - a * 3.2, w, color)}` +
      `<path d="M${f(cx - len / 2)} ${f(cy)} l${a * 1.8} -${a} v${a * 2} z" fill="${color}"/>` +
      `<path d="M${f(cx + len / 2)} ${f(cy)} l-${a * 1.8} -${a} v${a * 2} z" fill="${color}"/></g>`;
  };
  const back = (y, x = 0) => [{ view: 'back', x, y }];
  const front = (y, x = 0) => [{ view: 'front', x, y }];

  // 16 — The pattern, drafted
  add({
    n: 16, slug: 'pattern-draft', title: 'The pattern, drafted',
    group: 'Back print', placement: 'Centre back, top edge 95 mm below collar seam',
    garments: ['bone', 'limestone'], method: 'Screen, 2 spot · outlines 0.6 mm, seam lines 0.4 mm dashed',
    w: 300, h: 380, mock: { g: 'bone', place: back(115) },
    build() {
      let ink = '';
      const piece = (d) => `<path d="${d}" fill="none" stroke="${C.ink}" stroke-width="0.6" stroke-linejoin="round"/>`;
      ink += piece(bodyPath(0, 0, 140, 230, 26)) + piece(bodyPath(160, 0, 140, 230, 8));
      ink += piece(sleevePath(0, 262, 118, 78)) + piece(sleevePath(140, 262, 118, 78));
      ink += `<rect x="270" y="262" width="30" height="96" fill="none" stroke="${C.ink}" stroke-width="0.6"/>`;
      ink += mono('FRONT', { size: 5, x: 70, y: 118, anchor: 'middle', tracking: 0.2, fill: C.ink });
      ink += mono('BACK', { size: 5, x: 230, y: 118, anchor: 'middle', tracking: 0.2, fill: C.ink });
      ink += mono('SLEEVE', { size: 4, x: 59, y: 325, anchor: 'middle', tracking: 0.2, fill: C.ink });
      ink += mono('SLEEVE', { size: 4, x: 199, y: 325, anchor: 'middle', tracking: 0.2, fill: C.ink });
      ink += `<g transform="rotate(90 285 310)">${mono('NECKBAND', { size: 3.4, x: 285, y: 311, anchor: 'middle', tracking: 0.2, fill: C.ink })}</g>`;
      ink += mono('DE NOYON · 1974 PATTERN · CUT ON THE BIAS', { size: 4, x: 0, y: 378, tracking: 0.14, fill: C.ink });
      const brass = grain(70, 170, 90, C.brass) + grain(230, 170, 90, C.brass) + grain(59, 300, 42, C.brass) + grain(199, 300, 42, C.brass);
      return { ink, brass };
    },
    note: 'The garment’s own pattern is the graphic. Every grainline sits at 45°: that is the bias.',
  });

  // 17 — 12
  add({
    n: 17, slug: 'twelve-numeral', title: '12',
    group: 'Back print', placement: 'Centre back, top edge 100 mm below collar seam',
    garments: ['bone', 'limestone', 'ink'], method: 'Screen, 2 spot · solid numeral, no halftone',
    w: 280, h: 330, inkOnDark: true, mock: { g: 'limestone', place: back(120) },
    build(fg) {
      const size = fitSize('12', 'serif300', 262, -0.04);
      let t = text('12', { font: 'serif300', size, x: -4, y: size * 0.66, tracking: -0.04, fill: fg });
      t += text('Twelve made.', { font: 'serif300i', size: 22, x: 0, y: size * 0.66 + 48, fill: fg });
      t += mono('WHEN THEY ARE GONE THE PATTERN IS RETIRED.', { size: 4, x: 0, y: size * 0.66 + 66, tracking: 0.1, fill: fg });
      return { fg: t, brass: rect(0, size * 0.66 + 20, 90, RULE, C.brass) };
    },
    note: 'The edition size at full scale. Scale is the whole idea.',
  });

  // 18 — Wave field
  add({
    n: 18, slug: 'wave-field', title: 'Wave field',
    group: 'Back print', placement: 'Centre back, top edge 90 mm below collar seam',
    garments: ['bone', 'ink'], method: 'Screen, 2 spot · 36 lines at 0.4 mm, 1.4 mm apart minimum',
    w: 300, h: 400, inkOnDark: true, mock: { g: 'ink', place: back(110) },
    build(fg) {
      const ws = wavePaths(0, 12, 300, 370, 36);
      const t = ws.slice(0, 35).map((d) => stroke(d, fg, 0.4)).join('') +
        text('DE NOYON', { font: 'sans500', size: 5, x: 0, y: 398, tracking: 0.34, fill: fg });
      return { fg: t, brass: stroke(ws[35], C.brass, 0.6) };
    },
    note: 'Thirty-six lines of cloth falling as one wave. The last line is brass.',
  });

  // 19 — The wordmark, full width
  add({
    n: 19, slug: 'wordmark-full-width', title: 'Wordmark, full width',
    group: 'Back print', placement: 'Centre back, top edge 110 mm below collar seam',
    garments: ['bone', 'ink', 'oxblood'], method: 'Screen, 2 spot',
    w: 300, h: 92, inkOnDark: true, mock: { g: 'oxblood', place: back(130) },
    build(fg) {
      const size = fitSize('NOYON', 'sans500', 300, 0.34);
      const nw = measure('NOYON', { font: 'sans500', size, tracking: 0.34 });
      let t = text('DE', { font: 'sans500', size, x: 0, y: size * 0.72, tracking: 0.34, fill: fg });
      t += text('NOYON', { font: 'sans500', size, x: 0, y: size * 1.72, tracking: 0.34, fill: fg });
      return { fg: t, brass: rect(0, size * 1.72 + 8, nw, 1, C.brass) };
    },
    note: 'The mark at the width of the back, left-aligned, the brass rule under it at full length.',
  });

  // 20 — Hallmarks
  add({
    n: 20, slug: 'hallmarks', title: 'Hallmarks',
    group: 'Back print', placement: 'Centre back, top edge 110 mm below collar seam',
    garments: ['limestone', 'bone'], method: 'Screen, 2 spot · punch frames 1.2 mm',
    w: 290, h: 88, mock: { g: 'bone', place: back(130) },
    build() {
      const marks = ['PARIS', '1974', 'No.04', '45°', 'XII'];
      let ink = '', brass = '';
      marks.forEach((m, i) => {
        const x = i * 60, own = i === 2;
        const fr = frame(x, 0, 50, 50, own ? C.brass : C.ink, 1.2);
        if (own) brass += fr; else ink += fr;
        const size = Math.min(12, fitSize(m, 'mono500', 38, 0.02));
        ink += text(m, { font: 'mono500', size, x: x + 25, y: 25 + size * 0.36, anchor: 'middle', tracking: 0.02, fill: C.ink });
      });
      ink += mono('ELIGIUS OF NOYON · PATRON OF GOLDSMITHS', { size: 4.2, x: 0, y: 72, tracking: 0.14, fill: C.ink });
      return { ink, brass };
    },
    note: 'Assay punches, the goldsmith’s signature. The edition punch is struck in brass.',
  });

  // 21 — Spine
  add({
    n: 21, slug: 'spine', title: 'Pattern book spine',
    group: 'Back print', placement: 'Centre back, running down the spine, top 90 mm below collar seam',
    garments: ['bone', 'ink'], method: 'Screen, 2 spot',
    w: 60, h: 420, inkOnDark: true, mock: { g: 'bone', place: back(110) },
    build(fg) {
      const s = '1948 — 1979';
      const size = fitSize(s, 'serif300i', 400, -0.01);
      let t = `<g transform="translate(${f(size * 0.72)} 0) rotate(90)">${text(s, { font: 'serif300i', size, x: 0, y: 0, tracking: -0.01, fill: fg })}</g>`;
      t += `<g transform="translate(58 0) rotate(90)">${mono('FROM THE PATTERN BOOK', { size: 4, x: 0, y: 0, tracking: 0.24, fill: fg })}</g>`;
      return { fg: t, brass: rect(size * 0.72 + 10, 120, RULE, 300, C.brass) };
    },
    note: 'Thirty-one years of patterns set down the spine like the back of a book.',
  });

  // 22 — Bias grid
  add({
    n: 22, slug: 'bias-grid', title: 'Warp, weft, bias',
    group: 'Back print', placement: 'Centre back, top edge 110 mm below collar seam',
    garments: ['bone', 'limestone'], method: 'Screen, 2 spot · grid 0.35 mm at 13 mm pitch',
    w: 270, h: 290, mock: { g: 'limestone', place: back(125) },
    build() {
      const S = 260, o = 10; // square at (o, 0)
      let ink = frame(o, 0, S, S, C.ink, 0.6);
      for (let k = 13; k < S; k += 13) {
        ink += rect(o + k - 0.175, 0, 0.35, S, C.ink); // warp
        ink += rect(o, k - 0.175, S, 0.35, C.ink);     // weft
      }
      ink += `<g transform="rotate(-90 4 ${S})">${mono('WARP', { size: 4.2, x: 4, y: S + 2, tracking: 0.24, fill: C.ink })}</g>`;
      ink += mono('WEFT', { size: 4.2, x: o, y: S + 12, tracking: 0.24, fill: C.ink });
      ink += mono('BIAS · 45°', { size: 4.2, x: o + S, y: S + 12, anchor: 'end', tracking: 0.24, fill: C.ink });
      const brass = `<path d="M${o} ${S} L${o + S} 0" stroke="${C.brass}" stroke-width="0.9"/>`;
      return { ink, brass };
    },
    note: 'A swatch of cloth drawn as a diagram: the true bias runs corner to corner in brass.',
  });

  // 23 — When they are gone
  add({
    n: 23, slug: 'pattern-retired', title: 'When they are gone',
    group: 'Back print', placement: 'Centre back, top edge 110 mm below collar seam',
    garments: ['bone', 'ink'], method: 'Screen, 2 spot',
    w: 280, h: 200, inkOnDark: true, mock: { g: 'bone', place: back(130) },
    build(fg) {
      const lines = ['When they', 'are gone', 'the pattern', 'is retired.'];
      const size = fitSize('the pattern', 'serif300', 280, -0.015);
      let t = lines.map((l, i) => text(l, { font: i === 3 ? 'serif300i' : 'serif300', size, x: 0, y: size * 0.74 + i * size * 0.98, tracking: -0.015, fill: fg })).join('');
      const y = size * 0.74 + 3 * size * 0.98;
      t += text('DE NOYON', { font: 'sans500', size: 4.6, x: 280, y: y + 20, anchor: 'end', tracking: 0.34, fill: fg });
      return { fg: t, brass: rect(0, y + 14, 60, RULE, C.brass) };
    },
    note: 'The house rule on scarcity, stated once, at the size of the back.',
  });

  // 24 — Gold, by proportion
  add({
    n: 24, slug: 'gold-by-proportion', title: 'Gold, by proportion',
    group: 'Back print', placement: 'Centre back, top edge 110 mm below collar seam',
    garments: ['ink', 'bone'], method: 'Screen, 2 spot on ink · cream underbase plate',
    w: 280, h: 150, inkOnDark: true, mock: { g: 'ink', place: back(130) },
    build(fg) {
      const size = fitSize('proportion.', 'serif300', 280, -0.015);
      let t = text('Gold, by', { font: 'serif300', size, x: 0, y: size * 0.74, tracking: -0.015, fill: fg });
      t += text('proportion.', { font: 'serif300i', size, x: 0, y: size * 1.72, tracking: -0.015, fill: fg });
      t += mono('ELIGIUS OF NOYON · PATRON OF GOLDSMITHS', { size: 4.2, x: 0, y: size * 1.72 + 26, tracking: 0.14, fill: fg });
      return { fg: t, brass: rect(0, size * 1.72 + 12, 70, RULE, C.brass) };
    },
    note: 'Eligius made thrones by proportion, not jewels. The brand thesis in three words.',
  });

  // 25 — One atelier
  add({
    n: 25, slug: 'one-atelier', title: 'One atelier.',
    group: 'Back print', placement: 'Centre back, top edge 120 mm below collar seam',
    garments: ['ink', 'limestone'], method: 'Screen, 2 spot',
    w: 270, h: 120, inkOnDark: true, mock: { g: 'limestone', place: back(140) },
    build(fg) {
      const size = fitSize('atelier.', 'serif300', 270, -0.015);
      let t = text('One', { font: 'serif300', size, x: 0, y: size * 0.74, tracking: -0.015, fill: fg });
      t += text('atelier.', { font: 'serif300', size, x: 0, y: size * 1.7, tracking: -0.015, fill: fg });
      t += mono('PARIS · NO WHOLESALE', { size: 4.4, x: 270, y: size * 0.74, anchor: 'end', tracking: 0.24, fill: fg });
      return { fg: t, brass: rect(0, size * 1.7 + 10, 50, RULE, C.brass) };
    },
    note: 'Direct to client, one storefront, one atelier.',
  });

  // 26 — Archive.
  add({
    n: 26, slug: 'archive', title: 'Archive.',
    group: 'Back print', placement: 'Centre back, top edge 110 mm below collar seam',
    garments: ['oxblood'], method: 'Screen, 2 spot on oxblood · cream underbase plate',
    w: 280, h: 110, dark: true, mock: { g: 'oxblood', place: back(130) },
    build() {
      const size = fitSize('Archive.', 'serif300', 280, -0.02);
      let cream = text('Archive.', { font: 'serif300', size, x: 0, y: size * 0.74, tracking: -0.02, fill: C.cream });
      cream += mono('PATTERNS 1948 — 1979', { size: 4.4, x: 80, y: size * 0.74 + 20, tracking: 0.24, fill: C.cream });
      return { cream, brass: rect(0, size * 0.74 + 16, 64, RULE, C.brass) };
    },
    note: 'Oxblood means archive in this system. The word and the colour say the same thing.',
  });

  // 27 — The tape
  add({
    n: 27, slug: 'tailors-tape', title: 'Tailor’s tape',
    group: 'Back print', placement: 'Centre back, top edge 90 mm below collar seam',
    garments: ['bone', 'limestone'], method: 'Screen, 2 spot · ticks 0.35 mm',
    w: 70, h: 410, mock: { g: 'bone', place: back(110, -60) },
    build() {
      let ink = frame(0, 0, 32, 410, C.ink, 0.5);
      for (let cm = 0; cm <= 40; cm++) {
        for (let mm = 0; mm < 10 && cm * 10 + mm <= 400; mm++) {
          const y = 5 + cm * 10 + mm;
          const len = mm === 0 ? 12 : mm === 5 ? 8 : 4;
          if (mm % 1 === 0 && (mm === 0 || mm === 5 || mm % 2 === 0)) ink += rect(0, y - 0.15, len, 0.3, C.ink);
        }
        if (cm > 0) ink += mono(String(cm), { size: 5, x: 29, y: 5 + cm * 10 + 1.8, anchor: 'end', tracking: 0, fill: C.ink });
      }
      const y12 = 5 + 120;
      const brass = rect(0, y12 - 0.45, 70, 0.9, C.brass);
      ink += `<g transform="rotate(90 40 ${y12 + 6})">${mono('TWELVE MADE', { size: 4, x: 40, y: y12 + 6, tracking: 0.24, fill: C.ink })}</g>`;
      return { ink, brass };
    },
    note: 'A cutter’s tape down the back, with one brass mark at twelve.',
  });

  // 28 — Wave, cropped
  add({
    n: 28, slug: 'wave-cropped', title: 'Wave, cropped',
    group: 'Back print', placement: 'Centre back, top edge 90 mm below collar seam; the wave bleeds off the print area',
    garments: ['limestone', 'bone'], method: 'Screen, 2 spot · lines 0.7 mm',
    w: 300, h: 400, mock: { g: 'limestone', place: back(110) },
    build() {
      // drawn at 1.9× and clipped by the artboard, so the wave leaves the frame
      const ws = wavePaths(-40, 40, 620, 560, 12);
      const ink = ws.slice(0, 11).map((d) => stroke(d, C.ink, 0.7)).join('') +
        text('DE NOYON', { font: 'sans500', size: 5, x: 0, y: 12, tracking: 0.34, fill: C.ink });
      return { ink, brass: stroke(ws[11], C.brass, 0.9), clip: true };
    },
    note: 'The twelve lines at a scale the back cannot hold. The crop is the idea.',
  });

  // 29 — The twelve, as a grid
  add({
    n: 29, slug: 'twelve-grid', title: 'The twelve',
    group: 'Back print', placement: 'Centre back, top edge 100 mm below collar seam',
    garments: ['ink', 'bone'], method: 'Screen, 2 spot',
    w: 270, h: 363, inkOnDark: true, mock: { g: 'ink', place: back(120) },
    build(fg) {
      let t = '', brass = '';
      for (let i = 0; i < 12; i++) {
        const x = (i % 3) * 93, y = Math.floor(i / 3) * 93, own = i === 3;
        const fr = frame(x, y, 84, 84, own ? C.brass : fg, own ? 1 : 0.5);
        if (own) brass += fr; else t += fr;
        t += text(String(i + 1).padStart(2, '0'), { font: 'serif300', size: 44, x: x + 8, y: y + 76, tracking: -0.01, fill: fg });
      }
      return { fg: t, brass };
    },
    note: 'Twelve squares, one per piece. The wearer’s is framed in brass (variable).',
  });

  // 30 — Cut on the bias, across the back
  add({
    n: 30, slug: 'bias-diagonal', title: 'Cut on the bias, diagonal',
    group: 'Back print', placement: 'Centre back, top edge 100 mm below collar seam',
    garments: ['bone', 'ink'], method: 'Screen, 2 spot',
    w: 300, h: 400, inkOnDark: true, mock: { g: 'bone', place: back(115) },
    build(fg) {
      const s = 'Cut on the bias.';
      const size = fitSize(s, 'serif300', 440, -0.015);
      const t = `<g transform="rotate(-53.13 150 200)">${text(s, { font: 'serif300', size, x: 150, y: 200 + size * 0.3, anchor: 'middle', tracking: -0.015, fill: fg })}</g>`;
      const brass = `<g transform="rotate(-53.13 150 200)">${rect(150 - 220, 200 + size * 0.3 + 14, 440, RULE, C.brass)}</g>`;
      return { fg: t, brass };
    },
    note: 'The sentence runs the diagonal of the print area, the way the cut runs the cloth.',
  });

  // 31 — waving luxury, oversized
  add({
    n: 31, slug: 'waving-luxury-oversized', title: 'waving luxury, oversized',
    group: 'Front print', placement: 'Centre front, top edge 70 mm below collar seam',
    garments: ['oxblood', 'ink'], method: 'Screen, 2 spot on dark · cream underbase plate',
    w: 280, h: 190, dark: true, mock: { g: 'oxblood', place: front(150) },
    build() {
      const size = fitSize('waving', 'serif300i', 280, -0.02);
      let cream = text('waving', { font: 'serif300i', size, x: 0, y: size * 0.62, tracking: -0.02, fill: C.cream });
      cream += text('luxury', { font: 'serif300i', size, x: 40, y: size * 1.36, tracking: -0.02, fill: C.cream });
      return { cream, brass: rect(0, size * 1.36 + 10, 40, RULE, C.brass) };
    },
    note: 'The two words at chest-wide scale, offset like cloth folding over.',
  });

  // 32 — Selvedge
  add({
    n: 32, slug: 'selvedge', title: 'Selvedge',
    group: 'Back print', placement: 'Across the shoulder blades, top edge 70 mm below collar seam',
    garments: ['bone', 'limestone', 'ink'], method: 'Screen, 2 spot · pin holes 1 mm',
    w: 300, h: 24, inkOnDark: true, mock: { g: 'bone', place: back(90) },
    build(fg) {
      const unit = 'DE NOYON · PARIS · CUT ON THE BIAS · ';
      let s = ''; while (measure(s + unit, { font: 'mono400', size: 4.4, tracking: 0.14 }) < 300) s += unit;
      let t = mono(s.trim().replace(/·$/, '').trim(), { size: 4.4, x: 0, y: 11, tracking: 0.14, fill: fg });
      for (let x = 2; x < 300; x += 8) t += `<circle cx="${x}" cy="20" r="0.6" fill="${fg}"/>`;
      return { fg: t, brass: rect(0, 0, 300, RULE, C.brass) };
    },
    note: 'The finished edge of the cloth, printed where a yoke would sit.',
  });

  // 33 — Cutting marker
  add({
    n: 33, slug: 'cutting-marker', title: 'Cutting marker',
    group: 'Back print', placement: 'Centre back, top edge 95 mm below collar seam',
    garments: ['limestone', 'bone'], method: 'Screen, 2 spot · cloth edge 0.4 mm dashed',
    w: 290, h: 400, mock: { g: 'bone', place: back(115) },
    build() {
      let ink = `<rect x="0.2" y="0.2" width="289.6" height="380" fill="none" stroke="${C.ink}" stroke-width="${HAIR}" stroke-dasharray="4 3"/>`;
      const piece = (d) => `<path d="${d}" fill="none" stroke="${C.ink}" stroke-width="0.6" stroke-linejoin="round"/>`;
      ink += `<g transform="rotate(-45 145 190)">` +
        piece(bodyPath(40, 30, 110, 180, 20)) + piece(bodyPath(160, 30, 110, 180, 6)) +
        piece(sleevePath(70, 230, 90, 60)) + piece(sleevePath(170, 230, 90, 60)) + `</g>`;
      ink += mono('MARKER · BIAS TEE · 1974 PATTERN', { size: 4, x: 0, y: 396, tracking: 0.14, fill: C.ink });
      const brass = rect(279, 20, 0.8, 340, C.brass) + `<path d="M279.4 14 l-3 6 h6 z" fill="${C.brass}"/>`;
      return { ink, brass };
    },
    note: 'The cutting layout: every piece turned 45° to the warp, marked in brass.',
  });

  // 34 — No. 04
  add({
    n: 34, slug: 'number-04', title: 'No. 04',
    group: 'Back print', placement: 'Centre back, top edge 110 mm below collar seam',
    garments: ['bone', 'ink', 'oxblood'], method: 'Screen, 2 spot · numeral plate is variable per piece',
    w: 280, h: 130, inkOnDark: true, mock: { g: 'bone', place: back(130) },
    build(fg) {
      const size = fitSize('No. 04', 'mono400', 280, -0.02);
      let t = text('No. 04', { font: 'mono400', size, x: 0, y: size * 0.74, tracking: -0.02, fill: fg });
      t += text('of twelve.', { font: 'mono400', size: 9, x: 280, y: size * 0.74 + 26, anchor: 'end', tracking: 0.02, fill: fg });
      return { fg: t, brass: rect(0, size * 0.74 + 14, 280, RULE, C.brass) };
    },
    note: 'Each back carries its own number. Printed per piece, 01 to 12.',
  });

  // 35 — Chest wordmark, full width
  add({
    n: 35, slug: 'chest-wordmark', title: 'Chest wordmark',
    group: 'Front print', placement: 'Centre front, top edge 75 mm below collar seam',
    garments: ['bone', 'ink', 'limestone'], method: 'Screen, 2 spot',
    w: 250, h: 30, inkOnDark: true, mock: { g: 'ink', place: front(155) },
    build(fg) {
      const size = fitSize('DE NOYON', 'sans500', 250, 0.34);
      const wm = wordmark(125, size * 0.72, size, fg, { ruleW: 250 });
      return { fg: wm.t, brass: wm.r };
    },
    note: 'The logo across the chest at the width of the print area, nothing else.',
  });

  // 36 — Twelve made, with the small wave
  add({
    n: 36, slug: 'twelve-made-wave', title: 'Twelve made, with wave',
    group: 'Front print', placement: 'Centre front, top edge 80 mm below collar seam',
    garments: ['bone', 'limestone'], method: 'Screen, 2 spot',
    w: 200, h: 150, mock: { g: 'bone', place: front(160) },
    build() {
      const ws = wavePaths(0, 0, 200, 100, 12);
      const ink = ws.slice(0, 11).map((d) => stroke(d, C.ink, 0.45)).join('') +
        text('Twelve made.', { font: 'serif300i', size: 20, x: 200, y: 146, anchor: 'end', fill: C.ink });
      return { ink, brass: stroke(ws[11], C.brass, 0.6) };
    },
    note: 'The wave with its caption, set right to balance the fall of the lines.',
  });

  // 37 — Cut on / the bias.
  add({
    n: 37, slug: 'cut-on-the-bias-front', title: 'Cut on the bias, front',
    group: 'Front print', placement: 'Centre front, top edge 80 mm below collar seam',
    garments: ['bone', 'ink'], method: 'Screen, 2 spot',
    w: 230, h: 110, inkOnDark: true, mock: { g: 'bone', place: front(160) },
    build(fg) {
      const size = fitSize('the bias.', 'serif300', 230, -0.015);
      let t = text('Cut on', { font: 'serif300', size, x: 0, y: size * 0.74, tracking: -0.015, fill: fg });
      t += text('the bias.', { font: 'serif300', size, x: 0, y: size * 1.7, tracking: -0.015, fill: fg });
      return { fg: t, brass: rect(0, size * 1.7 + 10, 40, RULE, C.brass) };
    },
    note: 'The construction, stated. Two lines, left-aligned.',
  });

  // 38 — Hallmark strip, chest
  add({
    n: 38, slug: 'hallmark-strip', title: 'Hallmark strip',
    group: 'Front print', placement: 'Left chest, centre 95 mm from centre front, 90 mm below shoulder seam',
    garments: ['limestone', 'bone', 'ink'], method: 'Screen, 2 spot · frames 0.7 mm',
    w: 96, h: 18, inkOnDark: true, mock: { g: 'limestone', place: [{ view: 'front', x: 95, y: 100 }] },
    build(fg) {
      const marks = ['PARIS', '1974', 'No.04', '45°', 'XII'];
      let t = '', brass = '';
      marks.forEach((m, i) => {
        const x = i * 19.5, own = i === 2;
        const fr = frame(x, 0, 18, 18, own ? C.brass : fg, 0.7);
        if (own) brass += fr; else t += fr;
        const size = Math.min(5, fitSize(m, 'mono500', 14, 0));
        t += text(m, { font: 'mono500', size, x: x + 9, y: 9 + size * 0.36, anchor: 'middle', fill: fg });
      });
      return { fg: t, brass };
    },
    note: 'The five punches at chest size, read like a maker’s mark.',
  });

  // 39 — Side wordmark
  add({
    n: 39, slug: 'side-wordmark', title: 'Side wordmark',
    group: 'Front print', placement: 'Front, wearer’s right side, running from 160 mm below the shoulder to the hem',
    garments: ['bone', 'ink'], method: 'Screen, 2 spot · side platen',
    w: 30, h: 420, inkOnDark: true, mock: { g: 'ink', place: [{ view: 'front', x: -205, y: 230 }] },
    build(fg) {
      const size = fitSize('DE NOYON', 'sans500', 300, 0.34);
      const t = `<g transform="translate(${f(size * 0.36 + 2)} 0) rotate(90)">${text('DE NOYON', { font: 'sans500', size, x: 0, y: size * 0.36, tracking: 0.34, fill: fg })}</g>`;
      return { fg: t, brass: rect(size * 0.36 + 4, 318, RULE, 102, C.brass) };
    },
    note: 'The mark runs down the side seam and hands over to one brass line at the hem.',
  });

  // 40 — 1974
  add({
    n: 40, slug: 'nineteen-seventy-four', title: '1974',
    group: 'Front print', placement: 'Centre front, top edge 80 mm below collar seam',
    garments: ['limestone', 'bone', 'oxblood'], method: 'Screen, 2 spot',
    w: 230, h: 104, inkOnDark: true, mock: { g: 'limestone', place: front(160) },
    build(fg) {
      const size = fitSize('1974', 'serif300', 230, -0.02);
      let t = text('1974', { font: 'serif300', size, x: 0, y: size * 0.7, tracking: -0.02, fill: fg });
      t += mono('THE PATTERN BOOK', { size: 4.2, x: 230, y: size * 0.7 + 14, anchor: 'end', tracking: 0.24, fill: fg });
      return { fg: t, brass: rect(0, size * 0.7 + 10, 50, RULE, C.brass) };
    },
    note: 'The year of the pattern, set as the only thing on the chest.',
  });

  // 41 — 45°
  add({
    n: 41, slug: 'forty-five-degrees', title: '45°',
    group: 'Front print', placement: 'Centre front, top edge 80 mm below collar seam',
    garments: ['bone', 'ink'], method: 'Screen, 2 spot',
    w: 200, h: 130, inkOnDark: true, mock: { g: 'ink', place: front(160) },
    build(fg) {
      const size = fitSize('45°', 'serif300', 170, -0.02);
      const t = text('45°', { font: 'serif300', size, x: 0, y: size * 0.7, tracking: -0.02, fill: fg });
      const brass = `<path d="M0 ${f(size * 0.7 + 30)} L${f(size * 0.7 + 30)} 0" stroke="${C.brass}" stroke-width="0.8"/>`;
      return { fg: t, brass };
    },
    note: 'The angle of the cut as a number, crossed by the line it describes.',
  });

  // 42 — Pocket wave
  add({
    n: 42, slug: 'pocket-wave', title: 'Pocket wave',
    group: 'Front print', placement: 'Left chest, centre 95 mm from centre front, 80 mm below shoulder seam',
    garments: ['bone', 'limestone', 'ink'], method: 'Screen, 2 spot · lines 0.3 mm (DTG not advised)',
    w: 60, h: 60, inkOnDark: true, mock: { g: 'bone', place: [{ view: 'front', x: 95, y: 95 }] },
    build(fg) {
      const ws = wavePaths(0, 2, 60, 56, 12);
      return { fg: ws.slice(0, 11).map((d) => stroke(d, fg, 0.3)).join(''), brass: stroke(ws[11], C.brass, 0.4) };
    },
    note: 'The twelve lines at pocket scale, no words.',
  });

  // 43 — Grainline, front
  add({
    n: 43, slug: 'grainline-front', title: 'Grainline',
    group: 'Front print', placement: 'Front, full print area, top edge 70 mm below collar seam',
    garments: ['bone', 'limestone'], method: 'Screen, 1 spot (brass) + ink label',
    w: 300, h: 400, mock: { g: 'bone', place: front(150) },
    build() {
      const len = Math.hypot(300, 400) - 20;
      const brass = grain(150, 200, len, C.brass, 0.9, -53.13);
      const ink = mono('GRAIN · BIAS', { size: 4.4, x: 300, y: 398, anchor: 'end', tracking: 0.24, fill: C.ink });
      return { ink, brass };
    },
    note: 'One brass line, hem to shoulder, marked as a pattern grainline. The thesis, literally.',
  });

  // 44 — Sleeve tape
  add({
    n: 44, slug: 'sleeve-tape', title: 'Sleeve tape',
    group: 'Sleeve', placement: 'Left sleeve, parallel to the sleeve hem, 25 mm above it',
    garments: ['bone', 'limestone'], method: 'Screen, 2 spot · sleeve platen',
    w: 76, h: 22, mock: { g: 'bone', place: [{ view: 'front', sleeve: true }] },
    build() {
      let ink = frame(0, 0, 76, 16, C.ink, 0.4);
      for (let mm = 0; mm <= 70; mm += 2) {
        const len = mm % 10 === 0 ? 6 : mm % 5 === 0 ? 4 : 2.5;
        ink += rect(3 + mm - 0.15, 0, 0.3, len, C.ink);
        if (mm % 10 === 0 && mm) ink += mono(String(mm / 10), { size: 3.4, x: 3 + mm, y: 13, anchor: 'middle', tracking: 0, fill: C.ink });
      }
      return { ink, brass: rect(3 + 40 - 0.4, 0, 0.8, 22, C.brass) };
    },
    note: 'Seven centimetres of tape on the sleeve, brass at the fourth. No. 04.',
  });

  // 45 — Back yoke
  add({
    n: 45, slug: 'back-yoke', title: 'Back yoke',
    group: 'Back print', placement: 'Back yoke, top edge 45 mm below collar seam',
    garments: ['limestone', 'ink'], method: 'Screen, 2 spot',
    w: 300, h: 14, inkOnDark: true, mock: { g: 'limestone', place: back(60) },
    build(fg) {
      const size = 8.4;
      const w = measure('DE NOYON', { font: 'sans500', size, tracking: 0.34 });
      const t = text('DE NOYON', { font: 'sans500', size, x: 0, y: 8, tracking: 0.34, fill: fg });
      return { fg: t, brass: rect(w + 10, 4.6, 300 - w - 10, RULE, C.brass) };
    },
    note: 'The mark at the yoke, then the brass seam running to the shoulder.',
  });

  // 46 — Hem band
  add({
    n: 46, slug: 'hem-band', title: 'Hem band',
    group: 'Hem', placement: 'Front hem, baseline 20 mm above hem stitch, full print width',
    garments: ['bone', 'ink'], method: 'Screen, 2 spot',
    w: 300, h: 12, inkOnDark: true, mock: { g: 'bone', place: front(660) },
    build(fg) {
      const unit = 'TWELVE MADE · ';
      let s = ''; while (measure(s + unit, { font: 'mono400', size: 4.4, tracking: 0.24 }) < 300) s += unit;
      const t = mono(s.replace(/ · $/, ''), { size: 4.4, x: 0, y: 11, tracking: 0.24, fill: fg });
      return { fg: t, brass: rect(0, 0, 300, RULE, C.brass) };
    },
    note: 'The edition size repeated along the hem, under a brass seam.',
  });

  // 47 — DE / NOYON, front and back
  add({
    n: 47, slug: 'split-wordmark', title: 'DE, NOYON',
    group: 'Front & back', placement: 'Front: “DE” centre front 80 mm below collar · Back: “NOYON” centre back 110 mm below collar',
    garments: ['bone', 'ink'], method: 'Screen, 2 spot, two placements',
    inkOnDark: true, mock: { g: 'bone', place: [{ view: 'front', part: 'front', x: -60, y: 160 }, { view: 'back', part: 'back', x: 0, y: 130 }] },
    parts: [
      { key: 'front', w: 120, h: 50, build(fg) {
        const size = fitSize('NOYON', 'sans500', 300, 0.34);
        return { fg: text('DE', { font: 'sans500', size, x: 0, y: size * 0.72, tracking: 0.34, fill: fg }) };
      } },
      { key: 'back', w: 300, h: 60, build(fg) {
        const size = fitSize('NOYON', 'sans500', 300, 0.34);
        return { fg: text('NOYON', { font: 'sans500', size, x: 0, y: size * 0.72, tracking: 0.34, fill: fg }), brass: rect(0, size * 0.72 + 8, 300, 1, C.brass) };
      } },
    ],
    note: 'The name split by the body: read the front, turn, read the back.',
  });

  // 48 — Cut on / the bias., front and back
  add({
    n: 48, slug: 'split-sentence', title: 'Cut on, the bias',
    group: 'Front & back', placement: 'Front: centre front 80 mm below collar · Back: centre back 110 mm below collar',
    garments: ['limestone', 'ink'], method: 'Screen, 2 spot, two placements',
    inkOnDark: true, mock: { g: 'ink', place: [{ view: 'front', part: 'front', x: 0, y: 160 }, { view: 'back', part: 'back', x: 0, y: 130 }] },
    parts: [
      { key: 'front', w: 240, h: 80, build(fg) {
        const size = fitSize('the bias.', 'serif300', 280, -0.015);
        return { fg: text('Cut on', { font: 'serif300', size, x: 0, y: size * 0.74, tracking: -0.015, fill: fg }) };
      } },
      { key: 'back', w: 280, h: 90, build(fg) {
        const size = fitSize('the bias.', 'serif300', 280, -0.015);
        return { fg: text('the bias.', { font: 'serif300i', size, x: 0, y: size * 0.74, tracking: -0.015, fill: fg }), brass: rect(0, size * 0.74 + 12, 60, RULE, C.brass) };
      } },
    ],
    note: 'The sentence starts on the chest and ends on the back.',
  });

  // 49 — Atelier stamp
  add({
    n: 49, slug: 'atelier-stamp', title: 'Atelier stamp',
    group: 'Back print', placement: 'Back, lower right, 110 mm above hem, 60 mm in from the side seam',
    garments: ['bone', 'limestone'], method: 'Screen, 1 spot (ink) + brass inner frame',
    w: 90, h: 90, mock: { g: 'bone', place: [{ view: 'back', x: 110, y: 470, rot: -6 }] },
    build() {
      let ink = frame(0, 0, 90, 90, C.ink, 1.4);
      ink += mono('ATELIER', { size: 5, x: 45, y: 30, anchor: 'middle', tracking: 0.3, fill: C.ink });
      ink += text('DE NOYON', { font: 'sans500', size: 7.4, x: 45, y: 50, anchor: 'middle', tracking: 0.34, fill: C.ink });
      ink += mono('PARIS, 8e', { size: 5, x: 45, y: 68, anchor: 'middle', tracking: 0.2, fill: C.ink });
      return { ink, brass: frame(5, 5, 80, 80, C.brass, 0.5) };
    },
    note: 'The atelier’s stamp struck off-centre near the hem, the way a cutter marks cloth.',
  });

  // 50 — Collection 04
  add({
    n: 50, slug: 'collection-04', title: 'Collection 04',
    group: 'Back print', placement: 'Centre back, top edge 90 mm below collar seam',
    garments: ['bone', 'ink'], method: 'Screen, 2 spot',
    w: 280, h: 330, inkOnDark: true, mock: { g: 'bone', place: back(110) },
    build(fg) {
      const size = fitSize('Collection 04.', 'serif300', 280, -0.015);
      let t = text('Collection 04.', { font: 'serif300', size, x: 0, y: size * 0.74, tracking: -0.015, fill: fg });
      const pieces = ['Bias silk coat', 'Draped wool gilet', 'Waving pleat skirt', 'Hand-finished cashmere scarf', 'Column dress in silk-viscose', 'Tailored crepe trouser'];
      const y0 = size * 0.74 + 50;
      pieces.forEach((p, i) => {
        const y = y0 + i * 36;
        t += mono(String(i + 1).padStart(2, '0'), { size: 4.4, x: 0, y, tracking: 0.04, fill: fg });
        t += text(p, { font: 'serif300', size: 14, x: 22, y, fill: fg });
        t += rect(0, y + 12, 280, HAIR, fg);
      });
      return { fg: t, brass: rect(0, size * 0.74 + 16, 70, RULE, C.brass) };
    },
    note: 'The collection listed on the back, the way a tour shirt lists dates.',
  });
}

// Mockup placements for designs 1–15.
export const MOCK_CORE = {
  1: { g: 'bone', place: [{ view: 'back', x: 0, y: 110 }] },
  2: { g: 'bone', place: [{ view: 'back', x: 0, y: 125 }] },
  3: { g: 'ink', place: [{ view: 'back', x: 0, y: 125 }] },
  4: { g: 'limestone', place: [{ view: 'back', x: 0, y: 115 }] },
  5: { g: 'bone', place: [{ view: 'back', x: 0, y: 125 }] },
  6: { g: 'limestone', place: [{ view: 'back', x: 0, y: 110 }] },
  7: { g: 'ink', place: [{ view: 'back', x: 0, y: 140 }] },
  8: { g: 'oxblood', place: [{ view: 'back', x: 0, y: 115 }] },
  9: { g: 'bone', place: [{ view: 'front', x: 95, y: 95 }] },
  10: { g: 'ink', place: [{ view: 'front', x: 95, y: 100 }] },
  11: { g: 'bone', place: [{ view: 'front', x: 0, y: 165 }] },
  12: { g: 'limestone', place: [{ view: 'front', x: 95, y: 90 }] },
  13: { g: 'bone', long: true, place: [{ view: 'front', sleeveRun: true }] },
  14: { g: 'limestone', place: [{ view: 'back', x: 0, y: 45 }] },
  15: { g: 'bone', place: [{ view: 'front', x: 150, y: 664 }] },
};
