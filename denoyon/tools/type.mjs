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
