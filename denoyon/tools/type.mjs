// Text-to-outline helper. Every glyph in the print files is converted to a
// vector path so the artwork carries no font dependency at the printer.
import opentype from 'opentype.js';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const load = (f) => opentype.loadSync(path.join(here, '..', 'fonts', f));

export const FONTS = {
  serif300: load('CormorantGaramond-Light.ttf'),
  serif300i: load('CormorantGaramond-LightItalic.ttf'),
  serif400: load('CormorantGaramond-Regular.ttf'),
  serif400i: load('CormorantGaramond-Italic.ttf'),
  serif500: load('CormorantGaramond-Medium.ttf'),
  sans300: load('Jost-Light.ttf'),
  sans400: load('Jost-Regular.ttf'),
  sans500: load('Jost-Medium.ttf'),
  mono400: load('IBMPlexMono-Regular.ttf'),
  mono500: load('IBMPlexMono-Medium.ttf'),
  // display faces for the graphic tees (SIL OFL)
  anton: load('Anton-Regular.ttf'),
  bebas: load('BebasNeue-Regular.ttf'),
  playfair900: load('PlayfairDisplay-Black.ttf'),
  playfair900i: load('PlayfairDisplay-BlackItalic.ttf'),
  bodoni900: load('BodoniModa-Black.ttf'),
  script: load('PinyonScript-Regular.ttf'),
  serif700: load('CormorantGaramond-Bold.ttf'),
  serif700i: load('CormorantGaramond-BoldItalic.ttf'),
  sans800: load('Jost-ExtraBold.ttf'),
  oswald700: load('Oswald-Bold.ttf'),
};

function layout(str, font, size, tracking) {
  const scale = size / font.unitsPerEm;
  const glyphs = font.stringToGlyphs(str);
  const out = [];
  let x = 0;
  glyphs.forEach((g, i) => {
    if (g.index === 0) throw new Error(`Missing glyph "${str[i]}" in ${font.names.fullName.en}`);
    out.push({ g, x });
    x += g.advanceWidth * scale;
    if (i < glyphs.length - 1) {
      x += font.getKerningValue(g, glyphs[i + 1]) * scale + tracking * size;
    }
  });
  return { items: out, width: x };
}

export function measure(str, { font, size, tracking = 0 }) {
  return layout(str, FONTS[font], size, tracking).width;
}

// Returns an SVG <path> of the outlined string. x/y is the baseline anchor.
export function text(str, { font, size, x = 0, y = 0, anchor = 'start', tracking = 0, fill }) {
  const f = FONTS[font];
  const { items, width } = layout(str, f, size, tracking);
  const x0 = anchor === 'middle' ? x - width / 2 : anchor === 'end' ? x - width : x;
  const d = items.map(({ g, x: gx }) => g.getPath(x0 + gx, y, size).toPathData(3)).join('');
  return `<path d="${d}" fill="${fill}"/>`;
}

// Outlined text passed through a warp function (x, y) => [x, y], applied to every
// on-curve and control point. Used for arches, bulges and flag waves.
export function warpedText(str, { font, size, x = 0, y = 0, anchor = 'start', tracking = 0, fill }, warp) {
  const f = FONTS[font];
  const { items, width } = layout(str, f, size, tracking);
  const x0 = anchor === 'middle' ? x - width / 2 : anchor === 'end' ? x - width : x;
  const r = (n) => +n.toFixed(3);
  let d = '';
  for (const { g, x: gx } of items) {
    for (const c of g.getPath(x0 + gx, y, size).commands) {
      const P = (px, py) => warp(px, py).map(r).join(' ');
      if (c.type === 'M') d += `M${P(c.x, c.y)}`;
      else if (c.type === 'L') d += `L${P(c.x, c.y)}`;
      else if (c.type === 'Q') d += `Q${P(c.x1, c.y1)} ${P(c.x, c.y)}`;
      else if (c.type === 'C') d += `C${P(c.x1, c.y1)} ${P(c.x2, c.y2)} ${P(c.x, c.y)}`;
      else if (c.type === 'Z') d += 'Z';
    }
  }
  return `<path d="${d}" fill="${fill}"/>`;
}

// Text set along a circular arc, each glyph rotated to the tangent.
// cx, cy = circle centre; r = baseline radius; mid = angle (deg, 0 = up) of the string centre.
export function arcText(str, { font, size, cx, cy, r, mid = 0, tracking = 0, fill, inside = false }) {
  const f = FONTS[font];
  const { items, width } = layout(str, f, size, tracking);
  const scale = size / f.unitsPerEm;
  const dir = inside ? -1 : 1;
  const start = mid - (dir * (width / r) * 180) / Math.PI / 2;
  return items.map(({ g, x: gx }) => {
    const gw = g.advanceWidth * scale;
    const a = start + (dir * ((gx + gw / 2) / r) * 180) / Math.PI;
    const rad = (a * Math.PI) / 180;
    const px = cx + r * Math.sin(rad), py = cy - r * Math.cos(rad);
    const rot = inside ? a + 180 : a;
    const d = g.getPath(-gw / 2, 0, size).toPathData(3);
    return `<path transform="translate(${px.toFixed(3)} ${py.toFixed(3)}) rotate(${rot.toFixed(3)})" d="${d}" fill="${fill}"/>`;
  }).join('');
}
