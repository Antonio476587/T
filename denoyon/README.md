# DE NOYON — 50 t-shirt designs

Fifty print-ready t-shirt graphics built from the DE NOYON design system (`design-system/`, copied from the supplied zip). Open `index.html` to browse them as front and back tee mockups.

## Rules every design follows

- **One idea per shirt.** Each design has one hero element: a word, a number, the wave, a pattern draft. Supporting text is one mono line at most.
- **Two typefaces at most.** Cormorant Garamond as the display face and IBM Plex Mono as the supporting face. Jost appears only as the wordmark, which is treated as the logo.
- **Gold only as a line.** Brass (`#B18A46`) is a rule, a grainline or a frame, never a fill.
- **Asymmetric by default.** Layouts are left-aligned on a grid unless the idea itself is symmetrical, as with a label or a stamp.
- **No invented facts.** Every word comes from the design system: Paris, 8e; one atelier, no wholesale; the 1948–1979 pattern books and the 1974 cut; twelve made; No. 04 of 12; Collection 04 and its piece names; cut on the bias; waving luxury; Eligius of Noyon, patron of goldsmiths; “When they are gone the pattern is retired.”

## The 50

| # | Design | Placement | Shown on |
| --- | --- | --- | --- |
| 1 | Wordmark monument | Back | Bone |
| 2 | Twelve lines | Back | Bone |
| 3 | Eligius of Noyon | Back | Ink |
| 4 | From the pattern book | Back | Limestone |
| 5 | Cut on the bias (grainline) | Back | Bone |
| 6 | Label, enlarged | Back | Limestone |
| 7 | Paris, 8e. | Back | Ink |
| 8 | Edition registry | Back | Oxblood |
| 9 | Stacked pocket mark | Left chest | Bone |
| 10 | Edition mark | Left chest | Ink |
| 11 | *waving luxury* | Centre front | Bone |
| 12 | Square plate | Left chest | Limestone |
| 13 | Sleeve run | Long sleeve | Bone |
| 14 | Hood and back-neck mark | Back neck | Limestone |
| 15 | Hem inlay | Front hem | Bone |
| 16 | The pattern, drafted | Back | Bone |
| 17 | 12 | Back | Limestone |
| 18 | Wave field | Back | Ink |
| 19 | Wordmark, full width | Back | Oxblood |
| 20 | Hallmarks | Back | Bone |
| 21 | Pattern book spine | Back, down the spine | Bone |
| 22 | Warp, weft, bias | Back | Limestone |
| 23 | When they are gone | Back | Bone |
| 24 | Gold, by proportion | Back | Ink |
| 25 | One atelier. | Back | Limestone |
| 26 | Archive. | Back | Oxblood |
| 27 | Tailor’s tape | Back | Bone |
| 28 | Wave, cropped | Back | Limestone |
| 29 | The twelve | Back | Ink |
| 30 | Cut on the bias, diagonal | Back | Bone |
| 31 | *waving luxury*, oversized | Front | Oxblood |
| 32 | Selvedge | Back, across the shoulders | Bone |
| 33 | Cutting marker | Back | Bone |
| 34 | No. 04 | Back | Bone |
| 35 | Chest wordmark | Front | Ink |
| 36 | Twelve made, with wave | Front | Bone |
| 37 | Cut on the bias, front | Front | Bone |
| 38 | Hallmark strip | Left chest | Limestone |
| 39 | Side wordmark | Front side | Ink |
| 40 | 1974 | Front | Limestone |
| 41 | 45° | Front | Ink |
| 42 | Pocket wave | Left chest | Bone |
| 43 | Grainline | Front | Bone |
| 44 | Sleeve tape | Sleeve | Bone |
| 45 | Back yoke | Back yoke | Limestone |
| 46 | Hem band | Front hem | Bone |
| 47 | DE, NOYON | Front and back | Bone |
| 48 | Cut on, the bias | Front and back | Ink |
| 49 | Atelier stamp | Back, lower right | Bone |
| 50 | Collection 04 | Back | Bone |

Designs with a light and a dark version (ink print for bone and limestone, cream print for ink and oxblood) have both files. The version shown in the mockup is the one uploaded to Kittl.

## Files

| Path | What it is |
| --- | --- |
| `a-kittl/mockups/NN-slug.png` / `.svg` | Front and back tee mockup, print at real size and position |
| `a-kittl/prints/NN-slug[-front\|-back][-on-dark].svg` | Print master: every glyph outlined, units in mm, one `<g id="sep-…">` layer per spot ink |
| `a-kittl/separations/…<ink>.svg` | One 100% black film positive per ink |
| `a-kittl/png-300dpi/*.png` | Transparent 300 dpi PNGs (long edge capped at 4800 px), the files uploaded to Kittl |
| `a-kittl/specs.json` | Artboard, placement, method, garments, inks, separations and mockup placement for every file |
| `a-kittl/kittl-manifest.json` | Kittl upload IDs and folders |

**Print constraints.** The thinnest line is 0.4 mm, except the pocket wave (42) at 0.3 mm, which is screen only. Inks are Ink (Pantone Black 6 C), Cream (custom mix to `#F2EBDF`), Brass (Pantone 871 C metallic for screen, flat `#B18A46` for DTG) and Oxblood (custom mix to `#5E1B22`); confirm the custom mixes with a drawdown. On ink and oxblood garments the cream plate is the underbase and brass prints last. The largest artboard is 300 × 420 mm.

**Kittl.** All 50 are in the Kittl upload folder **DE NOYON — T-shirts 01–50**: 52 files, because 47 and 48 each have a front and a back. The first-round versions of 3, 4, 6, 7 and 8 are in **DE NOYON — Superseded**. The label, hangtag, stickers and posters are in **DE NOYON — Extras**. No AI generation was run and no Kittl tokens were spent.

## Also in the repository

- **Extras (X1–X5):** neck label, hangtag, packaging stickers and two posters, built with the same inks. They're not counted among the 50.
- **`b-canvas/` and `c-storefront/`:** social frames and storefront components from the first round. They're kept but not part of the t-shirt set, and some of their copy (dates, prices, cloth details) is sample content to replace.

## Rebuild

Needs Node 18 or newer. From the repository root:

```sh
cd denoyon/tools
npm install          # opentype.js + Playwright
npm run setup        # one-time: downloads the Chromium build Playwright uses
npm run build        # prints → mockups → previews → Kittl PNGs → gallery
```

Single steps, still inside `denoyon/tools`: `npm run prints`, `npm run mockups`, `npm run previews`, `npm run kittl`, `npm run gallery`. The t-shirt designs live in `tools/designs-tees.mjs` (16–50) and `tools/build-prints.mjs` (1–15 and the extras).

Fonts in `fonts/` are Cormorant Garamond, Jost and IBM Plex Mono from Google Fonts, all under the SIL Open Font License.
