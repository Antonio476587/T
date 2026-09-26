// Category B — 15 HTML5 Canvas designs (designs 21–35).
// Each design is { n, file, title, w, h, data, render(ctx, data) }.
// `data` is the dynamic part: edit it on index.html and the frame re-renders.
(function () {
  // ---- Tokens (design-system/tokens/colors.css) ------------------------------
  const T = {
    ink: '#0C0B0A', ink800: '#171614', ink700: '#221F1B', ink500: '#4A453E',
    sand400: '#8A8177', sand300: '#B4AAA0', sand200: '#D8CFC3',
    cream: '#F2EBDF', bone: '#FAF6EF', plaster: '#F0EAE0', limestone: '#E6DFD3', limestoneDeep: '#D2C9BB',
    ebony: '#141210', brass: '#B18A46', brassLight: '#CDAE72', gold600: '#A87F3B',
    ox600: '#5E1B22', ox700: '#43141A', sage600: '#4E5A4B',
    lineHair: 'rgba(12,11,10,.12)', lineStrong: 'rgba(12,11,10,.28)', lineOnDark: 'rgba(242,235,223,.18)',
  };
  const F = {
    serif: (px, it) => `${it ? 'italic ' : ''}300 ${px}px "Cormorant Garamond"`,
    sans: (px, w = 500) => `${w} ${px}px "Jost"`,
    mono: (px, w = 400) => `${w} ${px}px "IBM Plex Mono"`,
  };

  // ---- Helpers ---------------------------------------------------------------
  function txt(ctx, s, x, y, { font, color, align = 'left', track = 0, base = 'alphabetic', upper = false }) {
    ctx.save();
    ctx.font = font; ctx.fillStyle = color; ctx.textBaseline = base;
    const size = parseFloat(font.match(/(\d+(?:\.\d+)?)px/)[1]);
    ctx.letterSpacing = `${track * size}px`;
    const str = upper ? s.toUpperCase() : s;
    // letterSpacing adds trailing space after the last glyph; remove it for alignment
    const w = ctx.measureText(str).width - track * size;
    const x0 = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x;
    ctx.fillText(str, x0, y);
    ctx.restore();
    return w;
  }
  const eyebrow = (ctx, s, x, y, size, color, align) => txt(ctx, s, x, y, { font: F.sans(size), color, align, track: 0.24, upper: true });
  const mono = (ctx, s, x, y, size, color, align, track = 0.04) => txt(ctx, s, x, y, { font: F.mono(size), color, align, track });
  const rule = (ctx, x, y, w, h, color) => { ctx.fillStyle = color; ctx.fillRect(x, y, w, h); };
  const fill = (ctx, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(0, 0, w, h); };

  function wordmark(ctx, cx, y, size, color, withRule = true, ruleColor = T.brass) {
    const w = txt(ctx, 'DE NOYON', cx, y, { font: F.sans(size), color, align: 'center', track: 0.34 });
    if (withRule) rule(ctx, cx - w / 2, y + size * 0.42, w, Math.max(1, size * 0.05), ruleColor);
    return w;
  }

  // Twelve hairlines gathered at the shoulder, fanned at the hem.
  function wave(ctx, x, y, w, h, { n = 12, color = T.ink, accent = T.brass, accentIndex = 11, lw = 1.2, phase = 0 } = {}) {
    for (let i = 0; i < n; i++) {
      const t = n === 1 ? 0 : i / (n - 1);
      const sy = y + t * h * 0.08;
      const ey = y + h * 0.55 + t * h * 0.45;
      ctx.beginPath();
      ctx.moveTo(x, sy);
      ctx.bezierCurveTo(x + w * (0.42 + phase), sy - h * 0.06 + t * h * 0.02, x + w * (0.38 - phase), ey + h * 0.18 - t * h * 0.1, x + w, ey);
      ctx.strokeStyle = i === accentIndex ? accent : color;
      ctx.lineWidth = i === accentIndex ? lw * 1.25 : lw;
      ctx.stroke();
    }
  }

  // Paper grain, 5% (token --texture-grain-opacity). Seeded so exports are stable.
  function grain(ctx, w, h, alpha = 0.05, seed = 7) {
    let s = seed;
    const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    const img = ctx.getImageData(0, 0, w, h);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const v = (rnd() - 0.5) * 255 * alpha * 2;
      d[i] += v; d[i + 1] += v; d[i + 2] += v;
    }
    ctx.putImageData(img, 0, 0);
  }

  // ImageField: captioned placeholder naming the shot it needs (no photography exists).
  function imageField(ctx, x, y, w, h, caption, dark = false) {
    ctx.fillStyle = dark ? T.ink800 : T.limestone; ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = dark ? T.lineOnDark : T.lineHair; ctx.lineWidth = 1;
    ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
    const pad = Math.round(w * 0.04);
    eyebrow(ctx, 'Shot needed', x + pad, y + h - pad - 34, 14, dark ? T.sand300 : T.ink500);
    mono(ctx, caption, x + pad, y + h - pad, 17, dark ? T.cream : T.ink);
  }

  function strike(ctx, x, y, w, color, lw = 1.5) { rule(ctx, x, y, w, lw, color); }

  // ---- Designs --------------------------------------------------------------
  const D = [];

  // 21 — IG feed drop announcement (1080 × 1080)
  D.push({
    n: 21, file: '21-drop-feed.png', title: 'Drop announcement — feed', w: 1080, h: 1080,
    data: { collection: 'Collection 04', headline: ['Cut on', 'the bias.'], date: '02.10.2026', time: '10h00', city: 'Paris' },
    render(ctx, d) {
      fill(ctx, 1080, 1080, T.bone); grain(ctx, 1080, 1080);
      wordmark(ctx, 540, 118, 26, T.ink);
      eyebrow(ctx, d.collection, 96, 380, 18, T.ink500);
      d.headline.forEach((l, i) => txt(ctx, l, 90, 500 + i * 118, { font: F.serif(132), color: T.ink, track: -0.015 }));
      rule(ctx, 96, 880, 888, 1, T.lineStrong);
      mono(ctx, `Opens ${d.date} · ${d.time} ${d.city}`, 96, 936, 24, T.ink);
      mono(ctx, 'Twelve made.', 984, 936, 24, T.ink, 'right');
    },
  });

  // 22 — IG story drop (1080 × 1920), noir
  D.push({
    n: 22, file: '22-drop-story.png', title: 'Drop announcement — story', w: 1080, h: 1920,
    data: { line: 'Twelve made.', sub: 'The bias tee in silk-cotton jersey.', date: '02.10.2026 · 10h00 Paris' },
    render(ctx, d) {
      fill(ctx, 1080, 1920, T.ink);
      wordmark(ctx, 540, 190, 28, T.cream);
      wave(ctx, 90, 420, 900, 720, { color: T.cream, lw: 1.6 });
      txt(ctx, d.line, 540, 1420, { font: F.serif(120, true), color: T.cream, align: 'center', track: -0.015 });
      txt(ctx, d.sub, 540, 1500, { font: F.sans(30, 300), color: T.sand300, align: 'center' });
      rule(ctx, 440, 1590, 200, 1, T.brass);
      mono(ctx, d.date, 540, 1660, 26, T.cream, 'center');
    },
  });

  // 23 — IG feed product introduction with captioned shot (1080 × 1080)
  D.push({
    n: 23, file: '23-piece-feed.png', title: 'Piece introduction — feed', w: 1080, h: 1080,
    data: { name: 'Bias tee in silk-cotton jersey', price: '€ 280', facts: ['Milled in Como', '1974 pattern', 'Twelve made'], shot: 'Tee on form · ¾ back · window light' },
    render(ctx, d) {
      fill(ctx, 1080, 1080, T.bone);
      imageField(ctx, 0, 0, 640, 1080, d.shot);
      eyebrow(ctx, 'Collection 04', 700, 150, 16, T.ink500);
      const words = d.name.split(' ');
      const lines = []; let cur = '';
      words.forEach((w) => { const t = cur ? cur + ' ' + w : w; if (t.length > 14) { lines.push(cur); cur = w; } else cur = t; });
      lines.push(cur);
      lines.forEach((l, i) => txt(ctx, l, 700, 250 + i * 66, { font: F.serif(62), color: T.ink, track: -0.015 }));
      d.facts.forEach((f, i) => {
        const y = 640 + i * 64;
        rule(ctx, 700, y - 42, 300, 1, T.lineHair);
        mono(ctx, f, 700, y, 22, T.ink);
      });
      rule(ctx, 700, 830, 300, 1, T.lineHair);
      mono(ctx, d.price, 700, 930, 34, T.ink);
      wordmark(ctx, 850, 1020, 16, T.ink, false);
    },
  });

  // 24 — IG story edition registry (1080 × 1920)
  D.push({
    n: 24, file: '24-registry-story.png', title: 'Edition registry — story', w: 1080, h: 1920,
    data: { dispatched: 7, piece: 'Bias tee, 1974 cut' },
    render(ctx, d) {
      fill(ctx, 1080, 1920, T.plaster); grain(ctx, 1080, 1920);
      eyebrow(ctx, 'Edition registry', 96, 220, 18, T.ink500);
      txt(ctx, d.piece + '.', 90, 330, { font: F.serif(84), color: T.ink, track: -0.015 });
      for (let i = 1; i <= 12; i++) {
        const y = 520 + (i - 1) * 96;
        const done = i <= d.dispatched;
        mono(ctx, `No. ${String(i).padStart(2, '0')}`, 96, y, 30, done ? T.sand400 : T.ink);
        rule(ctx, 260, y - 10, 540, 1, done ? T.lineHair : T.lineStrong);
        mono(ctx, done ? 'Dispatched' : 'Open', 984, y, 22, done ? T.sand400 : T.ink, 'right', 0.14);
      }
      rule(ctx, 96, 1740, 120, 2, T.brass);
      mono(ctx, 'Numbers are assigned in order of dispatch.', 96, 1800, 24, T.ink500);
    },
  });

  // 25 — Edition closed, feed (1080 × 1080)
  D.push({
    n: 25, file: '25-edition-closed-feed.png', title: 'Edition closed — feed', w: 1080, h: 1080,
    data: { piece: 'The bias tee, 1974 cut.', numbers: 'No. 01 — 12' },
    render(ctx, d) {
      fill(ctx, 1080, 1080, T.limestone); grain(ctx, 1080, 1080);
      eyebrow(ctx, 'Edition closed', 540, 330, 18, T.ox600, 'center');
      txt(ctx, d.piece, 540, 470, { font: F.serif(72), color: T.ink, align: 'center', track: -0.015 });
      mono(ctx, d.numbers + ' · Dispatched', 540, 560, 24, T.ink500, 'center');
      rule(ctx, 490, 640, 100, 1, T.brass);
      txt(ctx, 'The pattern is retired.', 540, 740, { font: F.serif(44, true), color: T.ink, align: 'center' });
      wordmark(ctx, 540, 960, 18, T.ink, false);
    },
  });

  // 26 — Edition closed, story with struck sizes (1080 × 1920)
  D.push({
    n: 26, file: '26-edition-closed-story.png', title: 'Edition closed — story', w: 1080, h: 1920,
    data: { sizes: ['EU 34', 'EU 36', 'EU 38', 'EU 40', 'EU 42'], piece: 'Bias tee' },
    render(ctx, d) {
      fill(ctx, 1080, 1920, T.ink);
      wordmark(ctx, 540, 190, 28, T.cream);
      eyebrow(ctx, 'Edition closed', 540, 620, 20, T.sand300, 'center');
      txt(ctx, d.piece + '.', 540, 760, { font: F.serif(120), color: T.cream, align: 'center', track: -0.015 });
      const cellW = 160, gap = 16, total = d.sizes.length * cellW + (d.sizes.length - 1) * gap;
      d.sizes.forEach((s, i) => {
        const x = 540 - total / 2 + i * (cellW + gap);
        ctx.strokeStyle = T.lineOnDark; ctx.lineWidth = 1; ctx.strokeRect(x + 0.5, 900.5, cellW - 1, 88);
        const w = mono(ctx, s, x + cellW / 2, 956, 26, T.sand400, 'center');
        strike(ctx, x + cellW / 2 - w / 2 - 6, 946, w + 12, T.sand400, 1.5);
      });
      mono(ctx, 'Twelve made. Twelve dispatched.', 540, 1120, 26, T.cream, 'center');
      rule(ctx, 490, 1180, 100, 1, T.brass);
      txt(ctx, 'Enter the archive', 540, 1720, { font: F.sans(22), color: T.cream, align: 'center', track: 0.14, upper: true });
    },
  });

  // 27 — Available again (returns), feed (1080 × 1080)
  D.push({
    n: 27, file: '27-available-again.png', title: 'Available again — feed', w: 1080, h: 1080,
    data: { count: 'Two pieces', sizes: ['EU 36', 'EU 40'], piece: 'Bias tee, 1974 cut' },
    render(ctx, d) {
      fill(ctx, 1080, 1080, T.bone);
      rule(ctx, 96, 96, 888, 1, T.lineHair);
      eyebrow(ctx, 'Available again', 96, 200, 18, T.sage600);
      txt(ctx, `${d.count} returned`, 90, 330, { font: F.serif(96), color: T.ink, track: -0.015 });
      txt(ctx, 'to the atelier.', 90, 430, { font: F.serif(96), color: T.ink, track: -0.015 });
      mono(ctx, d.piece, 96, 540, 26, T.ink500);
      d.sizes.forEach((s, i) => {
        const x = 96 + i * 196;
        ctx.strokeStyle = T.ink; ctx.lineWidth = 1; ctx.strokeRect(x + 0.5, 640.5, 176, 96);
        mono(ctx, s, x + 88, 700, 28, T.ink, 'center');
      });
      rule(ctx, 96, 646 + 96 + 30, 120, 2, T.brass);
      mono(ctx, 'Pressed, inspected and renumbered.', 96, 900, 24, T.ink);
      wordmark(ctx, 880, 990, 16, T.ink, false);
    },
  });

  // 28 — Size availability link banner (1200 × 628), driven by stock data
  D.push({
    n: 28, file: '28-size-availability-banner.png', title: 'Size availability — link banner', w: 1200, h: 628,
    data: { piece: 'Bias tee in silk-cotton jersey', stock: { 'EU 34': 0, 'EU 36': 1, 'EU 38': 0, 'EU 40': 2, 'EU 42': 0 }, price: '€ 280' },
    render(ctx, d) {
      fill(ctx, 1200, 628, T.plaster);
      imageField(ctx, 0, 0, 440, 628, 'Tee flat · overhead');
      eyebrow(ctx, 'Sizes', 500, 110, 15, T.ink500);
      txt(ctx, d.piece, 496, 190, { font: F.serif(46), color: T.ink, track: -0.015 });
      const sizes = Object.entries(d.stock);
      sizes.forEach(([s, q], i) => {
        const x = 500 + i * 128, y = 280;
        ctx.strokeStyle = q ? T.ink : T.lineStrong; ctx.lineWidth = 1; ctx.strokeRect(x + 0.5, y + 0.5, 112, 72);
        const w = mono(ctx, s, x + 56, y + 45, 20, q ? T.ink : T.sand400, 'center');
        if (!q) strike(ctx, x + 56 - w / 2 - 4, y + 38, w + 8, T.sand400);
      });
      const open = sizes.filter(([, q]) => q).map(([s]) => s).join(' · ') || 'None';
      mono(ctx, `Available · ${open}`, 500, 420, 20, T.ink);
      rule(ctx, 500, 470, 620, 1, T.lineHair);
      mono(ctx, d.price, 500, 540, 30, T.ink);
      txt(ctx, 'Select a size', 1120, 540, { font: F.sans(18), color: T.ink, align: 'right', track: 0.14, upper: true });
      rule(ctx, 1120 - 150, 552, 150, 1, T.brass);
    },
  });

  // 29 — Complimentary alteration (1080 × 1350)
  D.push({
    n: 29, file: '29-complimentary-alteration.png', title: 'Complimentary alteration', w: 1080, h: 1350,
    data: { title: ['Altered in', 'the atelier.'], body: 'Hem and sleeve length adjusted to your measurements before dispatch.', term: 'Complimentary for every piece of Collection 04.' },
    render(ctx, d) {
      fill(ctx, 1080, 1350, T.bone);
      wordmark(ctx, 540, 130, 22, T.ink);
      eyebrow(ctx, 'Service', 96, 420, 18, T.ink500);
      d.title.forEach((l, i) => txt(ctx, l, 90, 540 + i * 118, { font: F.serif(124), color: T.ink, track: -0.015 }));
      ctx.font = F.sans(30, 300); ctx.fillStyle = T.ink;
      wrap(ctx, d.body, 96, 860, 760, 48);
      rule(ctx, 96, 1060, 888, 1, T.lineHair);
      mono(ctx, d.term, 96, 1120, 22, T.ink);
      txt(ctx, 'Book a fitting', 96, 1240, { font: F.sans(20), color: T.ink, track: 0.14, upper: true });
      rule(ctx, 96, 1254, 180, 1, T.brass);
    },
  });

  // 30 — Archive card (the brand's only price reduction) (1080 × 1080)
  D.push({
    n: 30, file: '30-archive-card.png', title: 'Archive — final pieces', w: 1080, h: 1080,
    data: { piece: 'Archive trench, 1972 cut', was: '€ 1,680', now: '€ 1,240', note: 'Final piece. Not returnable.' },
    render(ctx, d) {
      fill(ctx, 1080, 1080, T.ox600);
      eyebrow(ctx, 'Archive', 96, 150, 18, T.cream);
      txt(ctx, d.piece + '.', 90, 300, { font: F.serif(80), color: T.cream, track: -0.015 });
      rule(ctx, 96, 380, 120, 2, T.brass);
      const w = mono(ctx, d.was, 96, 520, 34, T.sand300);
      strike(ctx, 92, 508, w + 8, T.sand300, 2);
      mono(ctx, d.now, 96, 600, 56, T.cream);
      mono(ctx, d.note, 96, 700, 24, T.cream);
      rule(ctx, 96, 900, 888, 1, 'rgba(242,235,223,.24)');
      txt(ctx, 'Enter the archive', 96, 970, { font: F.sans(20), color: T.cream, track: 0.14, upper: true });
      wordmark(ctx, 880, 970, 16, T.cream, false);
    },
  });

  // 31 — Atelier fitting days (1080 × 1350)
  D.push({
    n: 31, file: '31-fitting-days.png', title: 'Atelier fitting days', w: 1080, h: 1350,
    data: { days: [['Thu 08.10', '10h00 — 18h00'], ['Fri 09.10', '10h00 — 18h00'], ['Sat 10.10', '11h00 — 16h00']], address: 'Paris, 8e · by appointment' },
    render(ctx, d) {
      fill(ctx, 1080, 1350, T.plaster); grain(ctx, 1080, 1350);
      eyebrow(ctx, 'Atelier', 96, 200, 18, T.ink500);
      txt(ctx, 'Fitting days.', 90, 340, { font: F.serif(124), color: T.ink, track: -0.015 });
      ctx.font = F.sans(30, 300); ctx.fillStyle = T.ink;
      wrap(ctx, 'The bias tee is cut in three lengths. Try each against the body before the edition is assigned.', 96, 460, 820, 48);
      d.days.forEach(([day, hrs], i) => {
        const y = 760 + i * 110;
        rule(ctx, 96, y - 60, 888, 1, T.lineStrong);
        mono(ctx, day, 96, y, 32, T.ink);
        mono(ctx, hrs, 984, y, 32, T.ink, 'right');
      });
      rule(ctx, 96, 760 + 3 * 110 - 60, 888, 1, T.lineStrong);
      mono(ctx, d.address, 96, 1180, 24, T.ink500);
      txt(ctx, 'Book a fitting', 984, 1180, { font: F.sans(20), color: T.ink, align: 'right', track: 0.14, upper: true });
      rule(ctx, 984 - 188, 1194, 188, 1, T.brass);
    },
  });

  // 32 — Generative bias twill texture, seamless tile (2048 × 2048)
  D.push({
    n: 32, file: '32-bias-twill-tile.png', title: 'Bias twill texture — seamless tile', w: 2048, h: 2048,
    data: { pitch: 16, ground: T.plaster, thread: 'rgba(12,11,10,.07)', seed: 11 },
    render(ctx, d) {
      fill(ctx, 2048, 2048, d.ground);
      let s = d.seed; const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
      ctx.strokeStyle = d.thread;
      // 45° lines whose pitch divides the tile; thread weights are indexed by
      // position modulo the tile so the edges repeat seamlessly
      const n = Math.round(2048 / d.pitch);
      const threads = Array.from({ length: n }, () => [0.6 + rnd() * 1.1, 0.55 + rnd() * 0.45]);
      for (let k = -2048; k < 2048 * 2; k += d.pitch) {
        const [lw, a] = threads[(((k / d.pitch) % n) + n) % n];
        ctx.lineWidth = lw;
        ctx.globalAlpha = a;
        ctx.beginPath(); ctx.moveTo(k, 0); ctx.lineTo(k + 2048, 2048); ctx.stroke();
      }
      ctx.globalAlpha = 1;
      grain(ctx, 2048, 2048, 0.035, d.seed);
    },
  });

  // 33 — Proof watermark overlay, transparent (2048 × 2048)
  D.push({
    n: 33, file: '33-proof-watermark.png', title: 'Proof watermark — transparent overlay', w: 2048, h: 2048, transparent: true,
    data: { label: 'DE NOYON · PROOF · NOT FOR PUBLICATION', opacity: 0.08, color: T.ink },
    render(ctx, d) {
      ctx.clearRect(0, 0, 2048, 2048);
      ctx.save(); ctx.globalAlpha = d.opacity;
      ctx.translate(1024, 1024); ctx.rotate(-Math.PI / 4);
      for (let r = -12; r <= 12; r++) {
        const off = (r % 2) * 400;
        for (let c = -3; c <= 3; c++) txt(ctx, d.label, c * 1100 + off, r * 150, { font: F.sans(28), color: d.color, align: 'center', track: 0.34 });
      }
      ctx.restore();
    },
  });

  // 34 — E-commerce hero overlay, transparent 21:9 (2560 × 1097)
  D.push({
    n: 34, file: '34-hero-overlay.png', title: 'Hero overlay — 21:9, transparent', w: 2560, h: 1097, transparent: true,
    data: { eyebrow: 'Collection 04', headline: ['Cut on the bias.'], cta: 'Shop the collection' },
    render(ctx, d) {
      ctx.clearRect(0, 0, 2560, 1097);
      // --scrim-bottom
      const g = ctx.createLinearGradient(0, 1097, 0, 0);
      g.addColorStop(0, 'rgba(12,11,10,.72)'); g.addColorStop(0.42, 'rgba(12,11,10,.28)'); g.addColorStop(0.78, 'rgba(12,11,10,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, 2560, 1097);
      eyebrow(ctx, d.eyebrow, 120, 760, 26, T.cream);
      d.headline.forEach((l, i) => txt(ctx, l, 112, 900 + i * 150, { font: F.serif(170), color: T.cream, track: -0.015 }));
      txt(ctx, d.cta, 120, 1000, { font: F.sans(26), color: T.cream, track: 0.14, upper: true });
      rule(ctx, 120, 1018, 300, 2, T.brass);
    },
  });

  // 35 — Collection header band (2560 × 800)
  D.push({
    n: 35, file: '35-collection-header.png', title: 'Collection header band', w: 2560, h: 800,
    data: { title: 'Collection 04.', sub: 'Eleven pieces cut on the bias from the 1974 pattern book.', count: '11 pieces' },
    render(ctx, d) {
      fill(ctx, 2560, 800, T.plaster); grain(ctx, 2560, 800, 0.04);
      wave(ctx, 1380, 120, 1060, 560, { lw: 1.6 });
      eyebrow(ctx, 'Collection', 120, 280, 24, T.ink500);
      txt(ctx, d.title, 112, 440, { font: F.serif(180), color: T.ink, track: -0.015 });
      txt(ctx, d.sub, 120, 540, { font: F.sans(36, 300), color: T.ink500 });
      mono(ctx, d.count, 120, 660, 28, T.ink);
      rule(ctx, 0, 799, 2560, 1, T.brass); // --inlay-brass
    },
  });

  function wrap(ctx, s, x, y, maxW, lh) {
    const words = s.split(' '); let line = '', yy = y;
    for (const w of words) {
      const t = line ? line + ' ' + w : w;
      if (ctx.measureText(t).width > maxW && line) { ctx.fillText(line, x, yy); line = w; yy += lh; } else line = t;
    }
    ctx.fillText(line, x, yy);
  }

  window.DN_CANVAS = { designs: D, tokens: T };
})();
