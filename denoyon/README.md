# DE NOYON — 50 graphic tees

Fifty bold, full-canvas t-shirt graphics for DE NOYON, in the manner of the Kittl reference board: heavy display type, script over block lettering, arches and laurels, seals, repeated words, warped type and worn print texture. Open `index.html` to see them as front and back tee mockups.

The brand stays in the details: the house colours (ink, cream, brass, oxblood on bone, limestone, ink and oxblood garments), and copy taken only from the design system.

## How each design is built

- **One hero element at full scale.** A word, a number or an engraving fills the print area.
- **Stark scale contrast.** Hero, then a secondary element (script, laurel, brass rule), then one small mono line as the signature.
- **Brand colours used boldly.** Brass is a fill now (ribbons, box logo, the fourth "TWELVE"), not only a hairline.
- **Worn finish.** A vector knockout mask of specks and scratches is applied to every ink, so the films carry the texture and nothing is rasterised.
- **Only supplied facts.** Every word comes from the design system: DE NOYON, Paris, 8e; one atelier, one storefront, no wholesale; waving luxury; cut on the bias, 45°; twelve made, No. 04 of 12, each numbered on the facing; the 1948–1979 pattern books and the 1974 cut; Eligius of Noyon, patron of goldsmiths, mint-master; Collection 04 and its piece names; plaster, limestone, ebony, brass; “When they are gone the pattern is retired.”; “The luxury comes from what is left out.”; the working rule “structure, cloth, one brass line”.

## Typefaces

Display faces are for the tees only; the storefront keeps the system fonts. All are Google Fonts under the SIL Open Font License, and every glyph is outlined in the print files.

| Role | Face |
| --- | --- |
| Condensed block | Anton, Oswald Bold |
| Didone display | Bodoni Moda Black, Playfair Display Black / Black Italic |
| Script | Pinyon Script |
| Signature line | IBM Plex Mono Medium |
| Wordmark | Jost Medium |

## The 50

1–40 are typographic. 41–50 are anchored by Kittl engravings (see below).

| # | Design | Garment | # | Design | Garment |
| --- | --- | --- | --- | --- | --- |
| 1 | Waving luxury, script across | Bone | 26 | Collection 04 list | Ink |
| 2 | TWELVE ×12, fourth in brass | Ink | 27 | Plaster, limestone, ebony, brass | Bone |
| 3 | DE / NO / YON | Oxblood | 28 | Noyon & Paris | Oxblood |
| 4 | Atelier, Paris crest | Bone | 29 | Postmark, Paris 8e | Bone |
| 5 | *cut on the* BIAS | Ink | 30 | Falls in a single wave | Limestone |
| 6 | Cut on the bias, waving | Limestone | 31 | Arched chest | Bone |
| 7 | Four-sided frame | Bone | 32 | Chest wordmark, heavy | Ink |
| 8 | One atelier, stars | Ink | 33 | Paris, pocket script | Ink |
| 9 | When they are gone | Ink | 34 | Twelve made, script | Oxblood |
| 10 | 1948 *to* 1979 | Limestone | 35 | Box logo | Bone |
| 11 | Paris grid | Bone | 36 | 1974, chest | Limestone |
| 12 | Edition seal | Oxblood | 37 | CUT ON / THE BIAS. (front / back) | Ink |
| 13 | 45° | Bone | 38 | No. 04 / OF TWELVE (front / back) | Bone |
| 14 | Varsity, waving luxury | Ink | 39 | Sleeve, waving luxury | Ink |
| 15 | The 1974 cut | Limestone | 40 | Twelve numerals | Oxblood |
| 16 | No. 04 *of* 12 | Bone | 41 | Bust, waving luxury | Ink |
| 17 | Paris, reflected | Ink | 42 | Eligius, patron of goldsmiths | Bone |
| 18 | Heavy wave | Oxblood | 43 | Shears, cut on the bias | Limestone |
| 19 | No wholesale | Bone | 44 | The form, Collection 04 | Bone |
| 20 | Eligius crest | Ink | 45 | Finished by hand | Oxblood |
| 21 | Structure, cloth, one brass line | Limestone | 46 | Silk, one wave | Ink |
| 22 | What is left out | Bone | 47 | The throne, gold by proportion | Ink |
| 23 | Spine wordmark | Ink | 48 | Paris 8e facade | Limestone |
| 24 | Collection 04 shield | Bone | 49 | The mint coin, mint master | Oxblood |
| 25 | Bias field | Limestone | 50 | Archive iris, 1948–1979 | Bone |

## Kittl engravings (41–50)

Each of 41–50 is laid out around an engraving generated with Kittl's **Engraving** style (Seedream 4, 10 tokens each). The prompt for each is in `a-kittl/specs.json` (`kittl_prompt`). All ten are generated, downloaded to `art/kittl/<name>.svg` as one-colour vectors, and recoloured to a single ink by the build.

Two need a touch-up before production:

- **Coin (#49):** the rim carries garbled pseudo-lettering from the model. Mask the rim or redraw it before printing.
- **Dress form (#44):** the engraving came with a heavy black frame. It reads as a deliberate box, but you can crop it if you want the form free-standing.

The workspace's Kittl tokens are now used up (100 of 100), so any new engraving needs more tokens.

## Files

| Path | What it is |
| --- | --- |
| `a-kittl/mockups/NN-slug.png` / `.svg` | Front and back tee mockup, print at real size and position |
| `a-kittl/prints/NN-slug[-part].svg` | Print master: text outlined, mm units, one `<g id="sep-…">` per ink in overprint order |
| `a-kittl/separations/…<ink>.svg` | One 100% black film per ink, texture included |
| `a-kittl/png-300dpi/*.png` | Transparent 300 dpi PNGs for Kittl |
| `a-kittl/specs.json` | Artboard, placement, inks, garment, mockup placement, Kittl prompt, pending flag |

**Print.** Back prints are up to 300 × 420 mm and need a large platen or screen. Inks are Ink (Pantone Black 6 C), Cream (custom mix to `#F2EBDF`), Brass (Pantone 871 C metallic for screen, flat `#B18A46` for DTG) and Oxblood (custom mix to `#5E1B22`); confirm the custom mixes with a drawdown. On ink and oxblood garments, print a cream or white underbase under brass fills.

## Also in the repository

- **Extras (X1–X5):** neck label, hangtag, stickers and two posters.
- **`b-canvas/`, `c-storefront/`:** social frames and storefront components from the first round.
- **`tools/legacy/`:** the quiet first t-shirt set. It's in git history and no longer built.

## Rebuild

Needs Node 18 or newer. From the repository root:

```sh
cd denoyon/tools
npm install
npm run setup        # one-time: Chromium for Playwright
npm run build        # prints → mockups → previews → Kittl PNGs → gallery
```

The tee designs live in `tools/designs-graphic.mjs`.
