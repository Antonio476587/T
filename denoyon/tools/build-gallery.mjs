// Builds the gallery of all 50 designs:
//   index.html                 full document for the repo (open locally)
//   gallery/thumbs/NN.jpg      900 px thumbnails
//   gallery/artifact.html      same page body, without the document wrapper, for publishing
// Run after build-prints + render-previews: node tools/build-gallery.mjs
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); } catch {
  console.error('Playwright is missing. Run: cd denoyon/tools && npm install && npm run setup');
  process.exit(1);
}

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const thumbs = path.join(root, 'gallery/thumbs');
fs.mkdirSync(thumbs, { recursive: true });

// ---- Collect the 50 entries ---------------------------------------------------
const items = [];
const { prints } = JSON.parse(fs.readFileSync(path.join(root, 'a-kittl/specs.json'), 'utf8'));
const seen = new Set();
for (const p of prints) {
  if (seen.has(p.design)) continue; seen.add(p.design);
  const base = path.basename(p.file, '.svg');
  const garments = p.garments.map((g) => g.name || g.id.replace('stock-', '') + ' stock').join(', ');
  items.push({
    n: p.design, cat: 'A', group: p.group, title: p.title,
    spec: `${p.artboard_mm[0]} × ${p.artboard_mm[1]} mm · ${p.inks.length} ink${p.inks.length > 1 ? 's' : ''} · ${garments}`,
    note: p.note, src: path.join(root, 'a-kittl/previews', base + '.png'),
    links: [['SVG', `a-kittl/prints/${base}.svg`], ['Films', `a-kittl/separations/${base}.${p.inks[0].id}.svg`]],
  });
}
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'b-canvas/designs.js'), 'utf8'), sandbox);
const groupB = (n) => n <= 24 ? 'Drop announcement' : n <= 28 ? 'Stock status' : n <= 31 ? 'Service & archive' : n <= 33 ? 'Texture & watermark' : 'Hero overlay';
for (const d of sandbox.window.DN_CANVAS.designs) {
  items.push({
    n: d.n, cat: 'B', group: groupB(d.n), title: d.title, spec: `${d.w} × ${d.h} px · PNG${d.transparent ? ', transparent' : ''}`,
    src: path.join(root, 'b-canvas/png', d.file), links: [['PNG', `b-canvas/png/${d.file}`], ['Live', 'b-canvas/index.html']],
  });
}
const groupC = (n) => n <= 38 ? 'Hero' : n <= 41 ? 'Product card' : n <= 44 ? 'Lookbook' : n <= 47 ? 'Size & fit' : 'Bag & checkout';
for (const f of fs.readdirSync(path.join(root, 'c-storefront')).filter((f) => /^\d\d-.*\.html$/.test(f)).sort()) {
  const html = fs.readFileSync(path.join(root, 'c-storefront', f), 'utf8');
  const title = html.match(/<title>\d+ · (.*?) — DE NOYON<\/title>/)[1];
  const n = +f.slice(0, 2);
  items.push({
    n, cat: 'C', group: groupC(n), title, spec: 'HTML + CSS · tokens only · 390–1440 px',
    src: path.join(root, 'c-storefront/previews', f.replace('.html', '.desktop.png')),
    links: [['Open', `c-storefront/${f}`]],
  });
}
items.sort((a, b) => a.n - b.n);
if (items.length !== 50) throw new Error(`expected 50 designs, got ${items.length}`);

// ---- Thumbnails (JPEG, 900 px long edge) -------------------------------------
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('file://' + root + '/');
for (const it of items) {
  const out = path.join(thumbs, `${String(it.n).padStart(2, '0')}.jpg`);
  const data = 'data:image/png;base64,' + fs.readFileSync(it.src).toString('base64');
  const jpg = await page.evaluate(async ({ data, bg }) => {
    const img = new Image(); img.src = data; await img.decode();
    const s = Math.min(1, 900 / Math.max(img.width, img.height));
    const c = document.createElement('canvas'); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
    const x = c.getContext('2d'); x.fillStyle = bg; x.fillRect(0, 0, c.width, c.height); x.drawImage(img, 0, 0, c.width, c.height);
    return c.toDataURL('image/jpeg', 0.84);
  }, { data, bg: it.n === 33 || it.n === 34 ? '#D2C9BB' : '#FAF6EF' });
  fs.writeFileSync(out, Buffer.from(jpg.split(',')[1], 'base64'));
  it.thumb = `gallery/thumbs/${path.basename(out)}`;
}
await browser.close();

// ---- Page ------------------------------------------------------------------------
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const CATS = { A: ['Print', 'Apparel prints · 1–20', 'Outlined vector artwork with spot-ink separations. Uploaded to Kittl as 300 dpi PNGs.'],
  B: ['Canvas', 'Social & marketing · 21–35', 'Drawn with the Canvas API from brand tokens. Each frame is data-driven.'],
  C: ['Storefront', 'Web components · 36–50', 'HTML and CSS on the design-system tokens. Responsive from 390 px.'] };

const cards = items.map((it) => `
      <article class="card" data-cat="${it.cat}">
        <a class="card__img" href="${it.links[0][1]}"><img src="${it.thumb}" alt="${esc(it.title)}" loading="lazy" width="900" height="900"></a>
        <div class="card__meta">
          <span class="card__n">${String(it.n).padStart(2, '0')}</span>
          <span class="card__group">${esc(it.group)}</span>
        </div>
        <h3>${esc(it.title)}</h3>
        <p class="card__spec">${esc(it.spec)}</p>
        <p class="card__links">${it.links.map(([l, h]) => `<a href="${h}">${l}</a>`).join('')}</p>
      </article>`).join('');

const sections = Object.entries(CATS).map(([k, [short, h, p]]) => `
    <section class="cat" id="cat-${k}" data-cat="${k}">
      <header class="cat__head"><div><span class="eyebrow">${short}</span><h2>${h}</h2></div><p>${p}</p></header>
      <div class="grid">${cards.split('</article>').filter((c) => c.includes(`data-cat="${k}"`)).map((c) => c + '</article>').join('')}
      </div>
    </section>`).join('');

const style = `
<style>
:root{
  --paper:#FAF6EF; --paper-2:#F0EAE0; --stone:#E6DFD3; --ink:#0C0B0A; --ink-2:#4A453E; --muted:#8A8177;
  --line:rgba(12,11,10,.12); --line-strong:rgba(12,11,10,.28); --brass:#B18A46; --brass-text:#8A6A2F;
  --serif:"Cormorant Garamond",Didot,"Times New Roman",serif; --sans:"Jost","Helvetica Neue",Helvetica,sans-serif; --mono:"IBM Plex Mono",ui-monospace,monospace;
}
@media (prefers-color-scheme: dark){ :root:not([data-theme="light"]){
  --paper:#0C0B0A; --paper-2:#171614; --stone:#221F1B; --ink:#F2EBDF; --ink-2:#B4AAA0; --muted:#8A8177;
  --line:rgba(242,235,223,.14); --line-strong:rgba(242,235,223,.32); --brass-text:#CDAE72; color-scheme:dark; } }
:root[data-theme="dark"]{
  --paper:#0C0B0A; --paper-2:#171614; --stone:#221F1B; --ink:#F2EBDF; --ink-2:#B4AAA0; --muted:#8A8177;
  --line:rgba(242,235,223,.14); --line-strong:rgba(242,235,223,.32); --brass-text:#CDAE72; color-scheme:dark; }
*,*::before,*::after{box-sizing:border-box}
body{margin:0;background:var(--paper);color:var(--ink);font:300 16px/1.62 var(--sans);-webkit-font-smoothing:antialiased}
.wrap{max-width:1360px;margin:0 auto;padding-inline:40px;padding-block:0 96px}
@media (max-width:720px){.wrap{padding-inline:16px}}
.eyebrow{font:500 11px/1.2 var(--sans);letter-spacing:.24em;text-transform:uppercase;color:var(--ink-2)}
.top{display:flex;justify-content:space-between;align-items:center;gap:16px;height:78px;border-bottom:1px solid var(--line)}
.wm{font:500 17px/1 var(--sans);letter-spacing:.34em;text-transform:uppercase;padding-bottom:5px;box-shadow:inset 0 -1px 0 var(--brass)}
.top .mono{font:400 12px/1.4 var(--mono);color:var(--muted)}
.hero{display:grid;grid-template-columns:7fr 5fr;gap:24px;padding-block:96px 64px;align-items:end}
.hero h1{margin:16px 0 0;font:300 clamp(48px,7vw,112px)/.96 var(--serif);letter-spacing:-.015em;text-wrap:balance}
.hero p{margin:0;color:var(--ink-2);max-width:46ch}
.facts{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid var(--line-strong);border-bottom:1px solid var(--line);margin-bottom:24px}
.facts div{padding:16px 0;display:grid;gap:4px}
.facts b{font:400 28px/1 var(--mono);font-variant-numeric:tabular-nums;font-weight:400}
.facts span{font:400 12px/1.4 var(--mono);color:var(--muted)}
nav.filter{display:flex;gap:24px;flex-wrap:wrap;padding-block:16px 8px;position:sticky;top:env(safe-area-inset-top,0px);background:var(--paper);z-index:2;border-bottom:1px solid var(--line)}
nav.filter button{background:none;border:0;padding:0 0 8px;cursor:pointer;color:var(--ink-2);font:500 11px/1.2 var(--sans);letter-spacing:.14em;text-transform:uppercase}
nav.filter button[aria-pressed="true"]{color:var(--ink);box-shadow:inset 0 -1px 0 var(--brass)}
nav.filter button:focus-visible,a:focus-visible{outline:1px solid var(--brass);outline-offset:3px}
.cat{padding-top:64px}
.cat__head{display:flex;justify-content:space-between;align-items:end;gap:24px;flex-wrap:wrap;margin-bottom:32px}
.cat__head h2{margin:8px 0 0;font:300 clamp(30px,3.4vw,44px)/1.1 var(--serif);letter-spacing:-.015em}
.cat__head p{margin:0;max-width:44ch;color:var(--ink-2);font-size:14px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:48px 24px}
.card h3{margin:6px 0 2px;font:300 21px/1.2 var(--serif);text-wrap:balance}
.card__img{display:block;aspect-ratio:1;background:var(--paper-2);overflow:hidden;border:1px solid var(--line)}
.card__img img{width:100%;height:100%;object-fit:contain;display:block;transition:transform .52s cubic-bezier(.19,1,.22,1)}
.card__img:hover img{transform:scale(1.03)}
.card__meta{display:flex;justify-content:space-between;gap:8px;margin-top:12px;font:400 12px/1.4 var(--mono);color:var(--muted)}
.card__n{color:var(--brass-text)}
.card__spec{margin:0;font:400 12px/1.5 var(--mono);color:var(--ink-2)}
.card__links{margin:8px 0 0;display:flex;gap:16px}
.card__links a{font:500 11px/1.2 var(--sans);letter-spacing:.14em;text-transform:uppercase;color:var(--ink);text-decoration:none;border-bottom:1px solid var(--line-strong);padding-bottom:3px}
.card__links a:hover{color:var(--brass-text);border-color:var(--brass)}
.notes{margin-top:96px;display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:24px;border-top:1px solid var(--line-strong);padding-top:32px}
.notes h4{margin:0 0 8px;font:500 11px/1.2 var(--sans);letter-spacing:.14em;text-transform:uppercase}
.notes p{margin:0;font-size:14px;color:var(--ink-2)}
@media (max-width:860px){.hero{grid-template-columns:1fr;padding-block:48px 40px}}
@media (prefers-reduced-motion:reduce){.card__img img{transition:none}}
</style>`;

const body = `
<div class="wrap">
  <div class="top"><span class="wm">De Noyon</span><span class="mono">Design engine · 50 pieces</span></div>
  <section class="hero">
    <div><span class="eyebrow">Collection 04 · the bias tee</span><h1>Fifty pieces, one brass line.</h1></div>
    <p>Prints, social frames and storefront components built strictly from the DE NOYON system: ink and paper, square corners, gold only as a hairline, scarcity stated as fact.</p>
  </section>
  <div class="facts">
    <div><b>20</b><span>Print files · SVG + films</span></div>
    <div><b>15</b><span>Canvas frames · PNG</span></div>
    <div><b>15</b><span>Storefront components</span></div>
  </div>
  <nav class="filter" aria-label="Filter by category">
    <button type="button" data-f="all" aria-pressed="true">All 50</button>
    <button type="button" data-f="A" aria-pressed="false">Prints · 20</button>
    <button type="button" data-f="B" aria-pressed="false">Canvas · 15</button>
    <button type="button" data-f="C" aria-pressed="false">Storefront · 15</button>
  </nav>
  ${sections}
  <div class="notes">
    <div><h4>Print constraints</h4><p>All text outlined. Thinnest line 0.4 mm. Spot inks: ink, cream, brass metallic, oxblood. Dark garments print cream as the underbase plate; brass is flashed last.</p></div>
    <div><h4>Brand rules held</h4><p>No discount codes, countdowns or “only 2 left”. Sale is Archive. Promotions are services: alteration, fitting days, gift wrapping.</p></div>
    <div><h4>Photography</h4><p>None exists yet. Every image well is a captioned placeholder naming the shot it needs, per the system.</p></div>
  </div>
</div>
<script>
  const btns = document.querySelectorAll('nav.filter button');
  const secs = document.querySelectorAll('.cat');
  function show(f){ btns.forEach(b => b.setAttribute('aria-pressed', b.dataset.f === f)); secs.forEach(s => { s.hidden = !(f === 'all' || s.dataset.cat === f); }); }
  btns.forEach(b => b.addEventListener('click', () => show(b.dataset.f)));
  const h = (location.hash || '').replace('#', '');
  if (['A','B','C'].includes(h)) show(h);
</script>`;

const fonts = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300&family=Jost:wght@300;500&family=IBM+Plex+Mono:wght@400&display=swap">';
const title = '<title>DE NOYON Design Engine</title>';
fs.writeFileSync(path.join(root, 'index.html'),
  `<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n${title}\n${fonts}\n${style}\n</head>\n<body>${body}\n</body>\n</html>\n`);
fs.writeFileSync(path.join(root, 'gallery/artifact.html'), `${title}\n${fonts}\n${style}\n${body}\n`);
console.log('gallery: 50 cards');
