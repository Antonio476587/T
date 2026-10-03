# Prompt: adapt the DE NOYON storefront UI/UX to a Printify-fulfilled tee shop

Copy everything below the line into the designer model, and attach the files listed in "What you are given".

---

## Role

You are a senior e-commerce product designer and front-end designer. Your job is to adapt an existing luxury storefront design system to a print-on-demand t-shirt shop fulfilled by Printify. You keep the brand intact and change only what print-on-demand makes untrue or impossible. You design for production, not for a moodboard: every screen you deliver must be buildable in the chosen sales channel and must carry only facts that are true for a Printify-fulfilled product.

## The brand in one paragraph

DE NOYON is a Paris-based label whose idea is *waving luxury*: cloth cut on the bias so it falls in a single wave, vintage patterns (1948–1979), and restraint. The visual blueprint is Joseph Dirand: cream and limestone treated as materials, ebony and black trim, square corners, and one brass hairline as the only ornament. The name comes from Saint Eligius of Noyon, patron of goldsmiths. The working rule is: **if an element is not structure, cloth, or one brass line, delete it.** The voice is a museum label, not a marketer: state the fact and stop.

## What you are given

All paths are relative to the `denoyon/` folder of the repository.

| Path | What it is | How to use it |
| --- | --- | --- |
| `design-system/README.md` | Brand rules, voice, vocabulary, CTA set | Read it first. It is the authority on tone and copy. |
| `design-system/tokens/*.css` | Colour, type, spacing, surfaces, motion tokens | Use these tokens only. Never hard-code a hex value. |
| `design-system/assets/logo*.svg` | Wordmark lockups | Do not redraw or restyle the wordmark. |
| `c-storefront/36–50*.html` + `components.css` | The current storefront components (heroes, product tile, product card, lookbook, size guide, fit tools, bag drawer, checkout banners) | This is the UI/UX you are adapting. |
| `c-storefront/previews/` | Desktop and mobile screenshots of each component | Visual reference for the current state. |
| `a-kittl/mockups/NN-slug.png` | Front and back flat mockup of each of the 50 tees, in its garment colour | Product imagery until real photography exists. |
| `a-kittl/png-300dpi/*.png` | Transparent 300 dpi print files (53 tee files + 5 extras) | The files that go to Printify. |
| `a-kittl/specs.json` | Per design: title, garment colours, placement, inks, artboard size in mm | Your product data source. |
| `README.md` | The list of 50 tees with names and garment colours | Your catalogue. |
| `index.html` | A gallery of all 50 tees | A quick overview. |

## Goal

Design the complete storefront for selling the 50 DE NOYON graphic tees through Printify, by adapting the existing components rather than inventing a new look. A client should feel they are in the same house as the original storefront. The owner should be able to build it in the chosen channel without guessing.

## Decision 1: the sales channel

Printify is a fulfilment platform. It is not a full storefront builder. It connects to a sales channel, and the channel sets how much of this design can be built. Recommend one channel, say why, and design for it:

- **Shopify (default recommendation).** Full theme control through Online Store 2.0 sections and blocks, so it is the only option where this design system survives intact. Checkout styling is limited on standard plans (logo, colours, fonts, banner image); deeper checkout changes need Shopify Plus. Design the checkout within those limits.
- **Etsy.** You control listing images, the shop banner, the shop icon and copy, not the layout. If chosen, the deliverable becomes a listing-image system and copy, not page templates.
- **Printify Pop-Up Store.** Limited theme settings (logo, colours, banner and a few options). If chosen, deliver a settings sheet and an asset pack, not page templates.

Verify each channel's current limits in its own documentation before you commit, and state any limit you relied on.

## Non-negotiable brand rules

1. **Tokens only.** Colours, type, spacing, radii and motion come from `design-system/tokens`. In a Shopify theme, map them to theme settings or CSS custom properties. Do not introduce new colours.
2. **Typefaces.** Storefront UI: Cormorant Garamond (display), Jost (UI and wordmark), IBM Plex Mono (numbers, sizes, prices, codes). The display faces in the tee graphics (Anton, Bodoni Moda, Playfair, Pinyon Script, Oswald) belong to the garments, not the interface.
3. **Square corners.** `--radius-0` on controls, cards and images. Pills only for the small count badge.
4. **One brass line.** Brass (`--brass` / `--gold-500`) appears as a 1–2 px line: wordmark rule, active tab, focus ring, link underline. It is never a decorative field, with one exception: the single primary purchase action per view may use the brass-filled button (`.dn-btn--reserve`).
5. **Elevation** is a hairline or a paper tint, almost never a drop shadow.
6. **Voice and vocabulary** from `design-system/README.md`: sentence case; uppercase only for eyebrows, buttons, nav and labels; full stops everywhere; no exclamation marks, no emoji, no "discover", "elevate", "must-have", "hurry". Use the brand's words: *piece*, *cut*, *cloth*, *client*, *dispatch*, *complimentary*. Numbers are set in mono: `EU 38`, `No. 04`, `1974`.
7. **CTA set**, uppercase, and nothing else: Add to bag · Select a size · Continue to payment · Shop the collection · All pieces · Join. Drop "Book a fitting" and "Enter the archive" unless the owner confirms those services exist for the tees.

## Truth rules (most important)

**Never invent details that were not supplied.** That includes prices, discounts, shipping costs and times, return windows, stock counts, review counts and star ratings, testimonials, press quotes, statistics, dates, social handles, URLs, certifications and sustainability claims. Where one is needed, put a visible placeholder in square brackets, such as `[PRICE]`, `[DISPATCH TIME]` or `[RETURNS POLICY]`, and list every placeholder in your hand-off.

The existing storefront components contain example values (for example `€ 280` and "Complimentary dispatch" in component 40). Treat these as placeholders, not facts, and do not carry them over.

**Print-on-demand changes what is true.** The original brand copy describes the women's ready-to-wear line. For Printify-fulfilled tees, the following claims are **not true** and must not appear on tee pages, tee emails or tee ads unless the owner confirms otherwise:

- "Twelve made", "Each numbered on the facing", "No. 04 of 12" as an edition claim, or any limited edition or scarcity claim. A print-on-demand product can be ordered without limit. Designs 16, 38 and others *print* the words "No. 04 of 12" as a graphic; the product copy must not present that as a real edition. If the owner wants real editions, they must cap orders manually, and you should design that flow (a numbered counter set by the owner, not by you) as an optional add-on.
- "When they are gone the pattern is retired", unless the owner commits to unpublishing a design.
- "Made in the atelier", "Made in Paris", "One atelier", "Cut on the bias" or any claim about how the tee itself is made. The tees are blanks printed by a Printify print provider. The brand story may say what DE NOYON is, but a tee page must not say the tee was made by DE NOYON in Paris.
- "Dispatched from Paris" or any origin of shipping. Orders ship from the print provider's location.
- Fabric, weight, fit and care details, unless taken from the chosen Printify blank's own product page.

What is true and can be said: the graphic is a DE NOYON design; the tee is printed to order; the brand's story and references (Dirand, Eligius, the archive years 1948–1979 as the source of the brand's patterns) at brand level.

## Component mapping

Adapt each existing component to its role in the tee shop. For each one, say **keep**, **adapt** or **drop**, and why.

| Component | Expected role |
| --- | --- |
| 36 Hero, full bleed / 37 Hero, split | Home hero. Use the tee mockups or a single hero graphic while no photography exists. |
| 38 Hero, noir with notice form | New-drop notice ("Join."), only if the owner runs an email list. No countdown. |
| 39 Product tile with garment swatches | Collection grid tile. Swatches = the garment colours actually offered for that design. |
| 40 Product decision card | Product page buy box: title, `[PRICE]`, colour, size, Add to bag, print placement (front, back, front and back, sleeve), and a "Printed to order" line. Remove edition and "complimentary dispatch" claims. |
| 41 Compact product rows | Cart line items and "also in this colour" rows. |
| 42 Lookbook grid / 44 Lookbook rail | Home and collection storytelling with mockups; real photography slots marked as placeholders. |
| 43 Editorial story grid | Brand story page (Dirand, Eligius, waving luxury), clearly separated from product claims. |
| 45 Size guide modal | Keep, but fill it **only** with the chosen blank's real size chart from Printify. Never reuse the dress measurements. |
| 46 Fit predictor / 47 Measurements and fitting card | Drop by default. A tee does not need a fit predictor, and fittings do not exist for print-on-demand. |
| 48 Bag drawer | Keep as the cart drawer. |
| 49 Bag drawer, edition reserved | Drop, unless the owner adopts manual editions. |
| 50 Checkout banners | Adapt to what the channel's checkout allows. |

Add what a tee shop needs and the set lacks: collection filters (garment colour, placement: front, back or both, design family: typographic or engraving), a product gallery (front, back and detail of the print), a print-placement indicator, an empty cart, a 404 page, and the policy pages as placeholder shells (shipping, returns, privacy, terms).

## Catalogue and product data

- **50 designs, 53 print files.** Designs 37 and 38 have a front and a back print; design 39 has a back-neck mark and a sleeve run. Treat each design as **one product**, with multiple print areas where needed, not as separate products.
- **Titles.** Use the design names from `README.md`. Pattern: design name, then garment, for example "Bust, waving luxury tee". No invented descriptions: each product description is one or two factual lines in the brand voice, drawn only from the design's title and the brand facts in `design-system/README.md`.
- **Variants.** Sizes and colours come from the Printify blank you choose; do not assume a size range.
- **Garment colours.** The designs were made for four garment colours: Bone `#FAF6EF`, Limestone `#E6DFD3`, Ink `#0C0B0A`, Oxblood `#5E1B22`. Printify blanks come in fixed colours, so map each to the closest available colour on the chosen blank (likely candidates: Bone → natural or cream, Limestone → sand, Ink → black, Oxblood → maroon or burgundy), show the mapping as a table with the blank's real colour names, and flag any design whose contrast suffers on the substitute.

## Print-production adaptation (Printify)

Verify each item in Printify for the chosen blank and print provider, and record the values you used:

- **Print area size varies by blank and provider.** Several back prints were designed at up to 300 × 420 mm, which can exceed a standard DTG back area. Scale to fit the provider's print area, keep the safe margin, and never crop the wordmark or text.
- **File format.** Use the transparent 300 dpi PNGs in `a-kittl/png-300dpi/`. Re-export at the provider's recommended pixel size if Printify asks for a different resolution.
- **No metallic ink.** DTG cannot print Pantone 871 metallic brass; brass prints as flat `#B18A46`. Do not describe it as gold, metallic or foil.
- **Dark garments.** DTG uses a white underbase on dark garments; check that the distressed texture and thin lines survive it (the print specs list a minimum line of about 0.4 mm).
- **Sleeve and neck prints** (design 39 and the neck label X1) are available only on some blanks and providers. If not available, propose the nearest alternative and say so. Design 39 was conceived for a long-sleeve tee.
- **Colour accuracy.** On-screen colours and Printify mockups will not match the printed garment exactly. Recommend ordering samples of a few key designs (one per garment colour) before launch.

## Imagery

No product photography exists. Until it does:

- Use Printify's generated mockups for the product gallery, because they show the real blank. Use the brand's flat mockups (`a-kittl/mockups/`) for editorial and collection art, where a consistent look matters more.
- Use the existing `ImageField` pattern (a ratio-locked well with a caption) for every slot that should eventually hold photography, so the owner can see what to shoot.
- Specify image ratios per slot (for example, product gallery 4:5, hero 16:9 desktop and 4:5 mobile) and keep them consistent across the shop.

## UX and accessibility requirements

- **Mobile first.** Most traffic will be on phones. The buy box must show title, price, colour, size and Add to bag without scrolling past the first image on a 390 px-wide screen.
- **Contrast.** Several current tokens fail WCAG AA for small text on the bone page colour: brass `#B18A46` (2.96:1), `--text-accent` / gold-600 `#A87F3B` (3.38:1), and `--text-muted` / sand-400 `#8A8177` (3.55:1). Use them only for lines, large display text or non-essential decoration. For small text, use `--gold-700` `#8A6A2F` (4.66:1) or `--ink-500` `#4A453E` (8.81:1). Brass on ink passes (6.17:1).
- **Keyboard and screen readers.** Visible focus (the brass focus ring), labelled swatches (colour names, not only colour fields), size buttons with selected and unavailable states, a cart drawer that traps focus and closes with Esc, and alt text for every mockup that names the design and garment colour.
- **Motion.** Use the token durations; honour `prefers-reduced-motion`.
- **Performance.** Lazy-load below-the-fold images; serve WebP or AVIF; no autoplay video.
- **States.** Design loading, empty, error and sold-out/unavailable variant states, all in the brand voice ("Size unavailable.", "Your bag is empty.").

## Deliverables

1. **Channel recommendation:** one page, with the limits you verified.
2. **Page designs, desktop (1440) and mobile (390):** home, collection, product (one typographic tee and one engraving tee), size guide, cart drawer, checkout (within channel limits), brand story, 404, empty cart and policy-page shell.
3. **Component inventory:** every component with keep/adapt/drop, its states, and the tokens it uses.
4. **Theme spec:** how tokens map to theme settings or CSS variables in the chosen channel; for Shopify, the sections and blocks needed per template.
5. **Product data sheet:** one row per design with title, description (factual, brand voice), garment colours mapped to blank colours, print areas used, print file names, and any production flag.
6. **Copy deck:** every interface string, in the brand voice, with all `[PLACEHOLDERS]` listed separately.
7. **Printify production sheet:** the blank, the print provider, the print area sizes and the scaling applied per design, and the designs to sample first.
8. **Open questions for the owner:** only what blocks the build, such as price, blank choice, whether manual editions are wanted, shipping and returns policy, and whether an email list exists.

## How to check your own work

Before handing over, go through every screen and confirm:

- Every claim on a tee page is true for a Printify-fulfilled tee, and every unsupplied fact is a `[PLACEHOLDER]`.
- No edition, scarcity, "made in Paris" or "made by the atelier" claim appears on a tee page.
- Only tokens are used; the radius is 0; brass appears only as a line or as the one primary purchase button per view.
- All text meets WCAG AA contrast; focus is visible; swatches and sizes are labelled.
- Each view has one clear primary action and one visual path.
- Every screen is buildable in the chosen channel without custom code it does not support, or the custom code is called out.
- The shop still reads as DE NOYON: if an element is not structure, cloth or one brass line, it has been removed.
