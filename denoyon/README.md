# DE NOYON — 50 design deliverables

Built strictly from the DE NOYON design system (`design-system/`, copied from the supplied zip): ink and paper for roughly 95% of every surface, square corners, gold only as a 1–2 px brass line, Cormorant Garamond / Jost / IBM Plex Mono, and museum-label copy.

Open `index.html` for the gallery of all 50.

| Range | Category | Where | Format |
| --- | --- | --- | --- |
| 1–20 | Apparel prints (Kittl) | `a-kittl/` | Outlined SVG (mm), one film per spot ink, 300 dpi PNG, print spec |
| 21–35 | Social & marketing (Canvas) | `b-canvas/` | Canvas API renderers + exported PNGs |
| 36–50 | Storefront components | `c-storefront/` | Standalone HTML/CSS on the system tokens |

## A · Prints 1–20

| # | Design | Placement | Garments |
| --- | --- | --- | --- |
| 1 | Wordmark monument | Centre back | Bone, Limestone |
| 2 | Twelve lines (the wave, one brass line) | Centre back | Bone, Limestone |
| 3 | Eligius of Noyon colophon | Centre back | Bone · Ink variant |
| 4 | From the pattern book (1948–1979) | Centre back | Limestone, Bone |
| 5 | Cut on the bias (45° grainline) | Centre back | Bone, Limestone |
| 6 | Care label, enlarged | Centre back | Limestone, Bone |
| 7 | Atelier coordinates, Paris 8e | Centre back | Ink |
| 8 | Edition registry, No. 01–12 | Centre back | Ink, Oxblood |
| 9 | Stacked pocket mark | Left chest | All · dark variant |
| 10 | Edition mark, No. 04 of 12 | Left chest | All · dark variant |
| 11 | *waving luxury* | Centre front | Bone, Limestone |
| 12 | Square plate | Left chest | All · dark variant |
| 13 | Sleeve run | Left sleeve | Bone · dark variant |
| 14 | Hood & back-neck mark | Hood / back neck | Limestone · dark variant |
| 15 | Hem inlay | Front left hem | All · dark variant |
| 16 | Printed neck label (tagless) | Inside back neck | All · dark variant |
| 17 | Hangtag, front and back | 55 × 95 mm board | — |
| 18 | Tissue seal and box band | Stickers | — |
| 19 | Collection 04 poster | A2 | Bone stock |
| 20 | Archive poster, 1974 cut retired | A2 | Oxblood stock |

- `prints/*.svg`: composite artwork. Every glyph is converted to a path, so no fonts are needed at the printer. Units are millimetres. Each spot ink is a `<g id="sep-…">` layer.
- `separations/*.svg`: one 100% black film positive per ink, plus the dieline for 17 and 18.
- `specs.json`: artboard, placement, method, garment and ink tokens, and the separation list for every file.
- **Print constraints:** thinnest line is 0.4 mm. Inks are Ink (Pantone Black 6 C), Cream (custom mix to `#F2EBDF`), Brass (Pantone 871 C metallic for screen, flat `#B18A46` for DTG) and Oxblood (custom mix to `#5E1B22`). Confirm each custom mix with a drawdown. On dark garments the cream plate is the underbase and brass prints last.
- **Kittl:** the 20 primary prints are saved as 300 dpi transparent PNGs (`png-300dpi/`) in the Kittl upload folder **DE NOYON — Prints 01–20**. Upload IDs are in `kittl-manifest.json`. No AI generation was run and no Kittl tokens were spent. Kittl's upload API accepts only raster files, so the SVGs remain the master artwork.

## B · Canvas 21–35

`b-canvas/designs.js` holds one `render(ctx, data)` per design. Open `b-canvas/index.html`, expand **Data** under any frame and edit the JSON; the frame redraws live. Exports are in `b-canvas/png/`.

| # | Design | Size |
| --- | --- | --- |
| 21 / 22 | Drop announcement, feed / story | 1080² / 1080 × 1920 |
| 23 / 24 | Piece introduction feed · edition registry story | 1080² / 1080 × 1920 |
| 25 / 26 | Edition closed, feed / story | 1080² / 1080 × 1920 |
| 27 / 28 | Available again · size availability banner (stock-driven) | 1080² / 1200 × 628 |
| 29 / 30 / 31 | Complimentary alteration · Archive card · Fitting days | 1080 × 1350 / 1080² / 1080 × 1350 |
| 32 / 33 | Bias twill seamless tile · proof watermark (transparent) | 2048² |
| 34 / 35 | Hero overlay 21:9 (transparent) · collection header band | 2560 × 1097 / 2560 × 800 |

## C · Storefront 36–50

Each page links `components.css`, which imports the design-system tokens and self-hosts the three font families. No component hard-codes a colour.

36 full-bleed hero · 37 split hero · 38 noir hero with notice form · 39 product tiles with garment swatches · 40 product decision card · 41 compact product rows · 42 lookbook grid · 43 editorial story · 44 lookbook rail · 45 size-guide modal (cm/in) · 46 fit predictor · 47 measurements and fitting booking · 48 bag drawer · 49 bag drawer, edition held · 50 checkout service banners.

## Where the brief was adapted to the brand

The system forbids discount codes, countdowns, urgency badges and emoji, so the brief's streetwear slots were translated:

- **"Flash sale / discount" (29–31)** became a complimentary alteration, an Archive card (the system's only reduced price, shown as a struck-through was-price) and atelier fitting days.
- **"Sold out / back in stock" (25–28)** became *Edition closed* (the pattern is retired) and *Available again* (returned pieces).
- **"Checkout promo banners" (50)** became service banners. The only code field accepts a gift card, not a promo code.

No photography exists, so every image well is a captioned placeholder that names the shot it needs, as the system requires.

The product facts and story copy are sample content to replace with real data: weights, finishing times, measurements, the return window and the story in 43.

## Rebuild

Needs Node 18 or newer. Run from the repository root:

```sh
cd denoyon/tools
npm install          # opentype.js + Playwright
npm run setup        # one-time: downloads the Chromium build Playwright uses
npm run build        # everything below, in order
```

Or one step at a time, still inside `denoyon/tools`:

```sh
npm run prints       # 1–20: SVG, separations, specs.json
npm run previews     # print previews, canvas PNGs, storefront screenshots
npm run kittl        # 300 dpi PNGs for Kittl
npm run gallery      # index.html + thumbnails
```

The scripts resolve every path from their own location, so `node denoyon/tools/build-prints.mjs` also works from the repository root.

Fonts in `fonts/` are Cormorant Garamond, Jost and IBM Plex Mono from Google Fonts, all under the SIL Open Font License.
