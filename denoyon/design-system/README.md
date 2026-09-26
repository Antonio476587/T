# DE NOYON — Design System

**DE NOYON** is a Paris-based women's ready-to-wear label selling *waving luxury*: garments cut on the bias so cloth falls in a single wave, made from vintage patterns (1948–1979), in luxury fabrics, in editions of twelve. Three ideas held in tension — **waving** (movement, drape, the body underneath), **luxury** (restraint, material, price without apology), **vintage** (archive patterns, warm paper, mono numerals like a care label).

The label sells direct: one storefront, one atelier, no wholesale.

## Reference & lineage

**Visual blueprint: Joseph Dirand.** The pioneer of modern Parisian minimalism is the anchor for every rule below — not as a mood, as a material method:

- **Cream as a material, not a background.** Dirand builds soaring monolithic fields of plaster, bone and off-white limestone and treats negative space as the most expensive thing in the room. Hence the 96–180px section rhythm, the 62ch text measure, and `--plaster` / `--limestone` as *surfaces*, not tints.
- **Black and square corners.** Razor-sharp geometry: vast airy fields anchored by ebony and black-veined marble trim cutting through the cream. Hence `--radius-0` everywhere, `--trim-ebony`, and `--marble-black`.
- **One brass hairline.** Not rococo gold leaf — an ultra-slim brass or gilded trim inserted into the seam of stone, catching daylight. Hence gold appears only as a 1–2px line (`--metal-hairline`, `--inlay-brass`, the wordmark rule, the active-tab underline) and never as a decorative field.

**The name: Saint Eligius of Noyon**, patron saint of goldsmiths, metalworkers and royal mint-masters. He made gold thrones for the Merovingian kings not by cluttering them with jewels but through mastery of metallurgy, structure and proportion. That is the brand's whole thesis: the goldsmith's discipline, where a single stroke of brass reads as sacred because everything else was withheld. Dirand is that goldsmith working architecturally — pure mathematical structure, one unyielding gilded line.

Sources cited by the client: brabbu.com's Paris interior designers survey; vaticannews.va, faith.nd.edu and arquus-defense.com on Saint Eligius.

**Working rule for anyone designing here:** if an element is not structure, cloth, or one brass line, delete it.

## Sources

**None were supplied.** No codebase, no Figma file, no deck, no photography, no logo files, no brand book. This system was authored from a written brief:

> Company name: DE NOYON — a clothing brand focused on selling waving luxury clothes; a mixture between three designs: waving, luxury and vintage.
>
> Logo direction: minimalist wordmark, no complex icon, the force is in the typography. DE NOYON in capitals, modern serif or geometric sans-serif. One differentiating element — a detail in colour, an underline, or the spacing. Palette: black + one accent (gold, dark red, or cream).

Everything here is therefore a **proposal built from that brief**, not a recreation. Where real material would normally drive a decision, the file says so. If you have any of the following, send it and this system should be re-derived from it: brand book, logo files (outlined), campaign and product photography, fabric scans, the live storefront's code or Figma file, existing copy (product descriptions, emails, care cards).

## Index

| Path | What it is |
| --- | --- |
| `styles.css` | The only file consumers link. `@import` list, nothing else. |
| `tokens/` | `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `surfaces.css`, `motion.css`, `base.css` |
| `components/core/` | Icon, Button, IconButton, Badge, Tag |
| `components/forms/` | Input, Select, Checkbox, Radio, Switch |
| `components/layout/` | Card, SectionHeading, ImageField |
| `components/navigation/` | Tabs, Breadcrumb |
| `components/feedback/` | Dialog, Toast, Tooltip |
| `ui_kits/storefront/` | The de noyon.com storefront — five click-through screens (`README.md` inside) |
| `guidelines/` | Foundation specimen cards (Colors, Type, Spacing, Brand) |
| `assets/` | Wordmark lockups + `README.md` listing what is missing |
| `prompts/` | Ready-to-run briefs. `tshirt-funnel.TCG-REI.md` — the t-shirt ecommerce funnel brief (Task, Context, Goal, References, Evaluate, Iterate). |
| `SKILL.md` | Agent-Skills entry point |

### Components

Icon · Button · IconButton · Badge · Tag · Input · Select · Checkbox · Radio · Switch · Card · SectionHeading · ImageField · Tabs · Breadcrumb · Dialog · Toast · Tooltip

Each has a sibling `.d.ts` (props contract) and `.prompt.md` (what & when, usage, variants). Import styling from CSS custom properties only — no component hard-codes a hex value.

**Intentional additions** (no source defined an inventory, so a standard set was authored; these four are brand-specific rather than generic):
- `Icon` — a wrapper over the Lucide CDN set, so no one hand-rolls SVG.
- `ImageField` — ratio-locked image well that renders a *captioned placeholder* when no photography exists. Given the brand has none yet, this is load-bearing.
- `PriceTag`, `SizeSelector`, `ProductCard` (`components/commerce/`) — a clothing label cannot be prototyped without them.

Not built, deliberately: Accordion, Pagination, Stepper, Avatar, Table, DatePicker. Ask before adding — this brand's surfaces are small.

---

## CONTENT FUNDAMENTALS

**The voice is a museum label, not a marketer.** State the fact, stop. The luxury comes from what is left out.

- **Person.** Third person and imperative. "We" only when describing the atelier's own hands ("We work from a private archive"). "You" only for the client's own things — *your bag*, *your measurements*. Never "you'll love", never "discover".
- **Sentence length.** Short declaratives, often verbless fragments. "Twelve made. Each numbered on the facing."
- **Full stops everywhere**, including single-line toasts and captions: "Address saved." No exclamation marks. No question marks in headings.
- **Casing.** Sentence case for headings and body. UPPERCASE, tracked at 0.14–0.24em, for eyebrows, buttons, nav and labels — that is the *only* place capitals appear. Never Title Case. The wordmark is DE NOYON; in running text it is set with the `.dn-wordmark` class, which uppercases it.
- **Numbers are facts and get mono type.** Prices, sizes, edition numbers, dates, measurements: `€ 1,480` · `EU 38` · `No. 04 of 12` · `1974`. Space after the currency symbol. European time as `14h00`, cities as `Paris, 8e`.
- **Vocabulary.** *piece* (not item/product), *cloth* and *cloth name* (not material), *cut* (not design), *atelier* (not studio/workshop), *client* (not customer), *archive* (not sale), *dispatch* (not shipping out), *complimentary* (not free). Fabrics are always named with their mill or year when known: "milled in Como from a 1974 pattern book".
- **Scarcity is stated, never sold.** "Twelve made." "When they are gone the pattern is retired." Never "Hurry", never a countdown, never "limited edition!".
- **Emoji: never.** Not in UI, email, or social captions. Unicode is used only for the slash in breadcrumbs and the middle dot separating mono facts.
- **Product name pattern:** `[cut] + [in] + [cloth]` — "Bias silk coat", "Column dress in silk-viscose", "Archive trench, 1972 cut".
- **CTA set** (uppercase, no more): Add to bag · Select a size · Continue to payment · Book a fitting · Shop the collection · All pieces · Enter the archive · Join.
- **Error tone** is flat and non-apologetic: "Payment declined." "Enter a valid card number." No "Oops", no "Something went wrong".

Do: "A coat cut on the bias so the cloth falls in a single wave from the shoulder. Twelve made."
Don't: "Elevate your wardrobe with our stunning must-have coat! ✨"

---

## VISUAL FOUNDATIONS

**One line summary:** monolithic cream, ebony trim, one brass hairline, square corners, vast empty space, long slow motion — Dirand's rooms translated to screen. Anything glossy, rounded, bright or bouncy is off-brand.

**Materials before colour.** Five: plaster (`#F0EAE0`), limestone (`#E6DFD3`), ebony (`#141210`), black-veined marble (`#1A1917`, with `--marble-vein` at 22% cream), brass (`#B18A46`). Surfaces are stone fields divided by `--seam-stone` (7% ink joint) or `--trim-ebony`; the brass appears as `--inlay-brass`, a 1px seam set into the bottom edge. Utilities: `.dn-plaster`, `.dn-limestone`, `.dn-inlay`.

**Colour.** Ink (`#0C0B0A`) and warm paper (`--bone #FAF6EF`, `--cream #F2EBDF`) carry ~95% of every surface. Gold (`--gold-500 #B18A46`) is the single accent and appears as *line and small type only* — the wordmark rule, an active tab underline, a required asterisk, an edition badge, one bag pip. Gold as a large fill is permitted for exactly one element per view (a bag toast, a "Reserve" button) and never two. Oxblood (`#5E1B22`) means archive / final sale / error; sage (`#4E5A4B`) means made-to-order or sustainable. Neutrals are warm-grey (`--sand-*`), never blue-grey. A `[data-theme="noir"]` scope flips page to ink for editorial and email.

**Type.** Two families plus a numeral voice. *Cormorant Garamond Light* (display serif) for anything above 24px — hero, collection titles, product names, pull-quotes (italic); tracked in at −0.015em because it is set large. *Jost* (geometric sans) at Light 300 for body, and at Medium 500 uppercase for every label, button and nav item — tracking 0.14em (labels) to 0.34em (wordmark). *IBM Plex Mono* for prices, sizes, SKUs, dates and helper text. Body is 16/1.62; the display line-height is 1.06 and hero is 0.94–0.96, so headlines stack tightly against generous white space. Never mix serif and sans inside one line.

**Layout.** 1360px max container, 40px page gutters, 12 columns, 24px grid gap. Sections are separated by 96px (`--section-y`), landmark sections by 180px. Text measure caps at 62ch. Product grids are 4-up on home, 3-up on collection and related rows. The header is sticky at 78px on a three-column grid — nav left, centred wordmark, utilities right — transparent over a hero and hairline-bordered everywhere else. Buy columns and order summaries are `position: sticky; top: 100px`. Nothing else is fixed; no floating chat bubbles, no sticky bars.

**Backgrounds.** Flat fields only — paper or ink. **No gradients as decoration, ever.** Gradients exist solely as protection scrims over photography (`--scrim-bottom`, `--scrim-top`, `--scrim-flat`). Full-bleed imagery is used for the home hero (660px tall, 21:9 crops elsewhere) with copy sitting in the bottom-left over the scrim. A 5% SVG paper grain (`--texture-grain`, class `.dn-grain`) may be laid over flat cream to age it — one element per page, never over photography or text.

**Imagery.** Warm and quiet: natural window light, 35mm grain, cream/sand/ink wardrobe, no colour pops, no props, no smiling-to-camera. Ratios: 3/4 grid, 4/5 editorial, 4/3 atelier, 21/9 full-bleed. Black-and-white is permitted for archive stories. Cropping favours cloth in motion over faces. **No photography exists yet** — every image in this system is an `ImageField` placeholder captioned with the shot it needs, which is deliberate; do not substitute stock or generated art.

**Corner radii.** `0` — buttons, inputs, cards, images, dialogs, toasts. The only exceptions: `Tag` and `Switch` and the bag count pip use `--radius-pill`, as deliberate contrast. There is no 4px/8px "soft" radius in this system.

**Borders and cards.** A card is a white or sand rectangle with a 1px `rgba(12,11,10,.12)` hairline — no shadow, no radius, no coloured left border. `--line-strong` (28% ink) is for emphasis rules and secondary-button outlines. Product tiles have *no* card chrome at all: the image edge is the card.

**Shadows.** Effectively none. `--shadow-lift` (a 1px seat plus a wide, very soft 32px lift) appears on hover for clickable tiles only; `--shadow-overlay` is reserved for `Dialog`. Elevation is otherwise expressed as a hairline or a paper tint, not depth.

**Transparency and blur.** Rare. Ink scrims at 34–72% over imagery, a 62% ink scrim behind modals, and `--blur-veil` (18px) available for a mobile menu sheet. No frosted glass on cards, no translucent headers over content.

**Motion.** Two speeds. Controls: 180ms, `cubic-bezier(.22,.61,.36,1)` — colour, border and opacity only. Reveals: 520–900ms, `--ease-drape cubic-bezier(.19,1,.22,1)` — a 16px rise plus fade for sections and images, easing out very long, like cloth settling. Images scale to 1.03 on hover over 520ms. **No bounce, no spring, no parallax, no carousel auto-advance, no counters.** `prefers-reduced-motion` zeroes all durations.

**Hover states.** Text and links → gold-700/gold-600 (never underline-on-hover; links carry a permanent hairline underline that turns gold). Primary button → ink-900 lightens to ink-700. Secondary button → *inverts* to a full ink fill. Ghost → gold text. Images → 1.03 scale. Product tile → name shifts to gold-700, sizes fade in over the bottom scrim, save heart appears. Cards → `--shadow-lift`, only if clickable.

**Press states.** `transform: scale(0.985)` over 90ms. No colour change on press, no ripple.

**Focus.** `1px solid var(--gold-500)` outline at 3px offset. Inputs replace their hairline border with a gold hairline on focus — no glow, no thickening.

**Disabled.** `--state-disabled-bg` sand-100 fill with sand-300 text, `cursor: not-allowed`. Sold-out sizes stay visible and get a strike-through instead of disappearing.

**Selection.** `::selection` is gold-300 on ink.

---

## ICONOGRAPHY

No icon set was supplied. **Substitution flagged:** the system uses **Lucide** (`lucide-static@0.544.0`, fetched and inlined by the `Icon` component so strokes inherit `currentColor`) as the closest match to the brand's needs — 1.5px uniform stroke, square-ish terminals, geometric, no fill, no rounded-cartoon corners. It sits correctly beside Jost. If the brand later commissions a bespoke set, replace `BASE` in `components/core/Icon.jsx` and nothing else changes.

Rules:
- Icons are **utility only**: search, user, shopping-bag, heart, x, chevron-down, arrow-right, check, info, truck, credit-card, calendar, triangle-alert. That list is close to complete; a new glyph needs a reason.
- Never decorative. No icon beside a heading, no icon in a marketing card, no icon grid explaining values.
- Sizes: 14px inline with mono text, 16px inside buttons, 18px default in the header, 22px only in `IconButton size="lg"`.
- Colour is always inherited (`currentColor`); icons are ink, cream on dark, gold only on hover of an interactive parent. Stroke weight is 1.5 (`strokeWidth` prop).
- **No emoji, anywhere.** No unicode symbols as icons; the only unicode used editorially is `/` in breadcrumbs and `·` between mono facts.
- Care symbols (wash/press glyphs) are *not* in Lucide — request real artwork from the mill; until then care instructions are written as text.
- The wordmark is not an icon: there is no monogram, no crest, no favicon glyph beyond the stacked lockup in `assets/logo-stacked.svg`.

## Logo

No logo files were supplied, so the mark is **typeset, not drawn**, following the brief exactly: DE NOYON in Jost Medium capitals at 0.34em tracking, with one differentiating element — a 2px gold rule beneath the word. Lockups in `assets/` (horizontal ink, horizontal cream, stacked). Clear space equals twice the cap height on all sides. Minimum width 120px horizontal / 72px stacked. Never condense, never add a tagline inside the lockup, never place it on a busy area of an image without a scrim.

## Fonts — substitution flagged

No licensed brand fonts were provided. All three families are Google Fonts, loaded by CSS `@import` in `tokens/fonts.css` (no binaries are vendored, so there is nothing to self-host yet):

| Role | Using | If you have a licence, likely intended |
| --- | --- | --- |
| Display serif | Cormorant Garamond | Didot, Canela, Editorial New, ITC Caslon |
| Sans / wordmark | Jost | Futura, Neue Haas Grotesk Display, Söhne |
| Mono / numerals | IBM Plex Mono | Söhne Mono, ABC Diatype Mono |

**Please send font files** if the brand owns type licences; the token names will not change.
