# Prompt: adapt the DE NOYON storefront design to Printify fulfilment (MedusaJS)

Copy everything below the line into the designer agent, and attach the tee mockups.

---

## Your task

You already have the DE NOYON design system. Use it as it is: its tokens, components, voice and rules. Do not restyle the brand.

The store is a **MedusaJS storefront that is already built**. The 50 DE NOYON graphic tees will be sold there and fulfilled by **Printify**: Printify prints each order on demand and ships it, and its products, variants, images, shipping and order status reach the storefront through Medusa.

Your job is to design every storefront screen and component a client touches when buying a tee, so that when the developers connect Printify to Medusa, **the design binds to real data with no redesign**. Design for the data, not for one perfect example: every value on screen must come from a named field, and every component must handle the cases that real data produces.

## What you are given

- **The tee mockups:** a front and back flat mockup of each of the 50 designs, in the garment colour it was designed for. Printify will also generate its own mockups per variant once products are created there. Design for both kinds of image.
- **The catalogue facts.**
  - 50 designs; three of them have two print areas:
    - 37: front and back
    - 38: front and back
    - 39: back-neck mark and sleeve, designed for a long-sleeve tee
  - Two design families: typographic (1–40) and engraving (41–50).
  - The four garment colours the designs were made for: Bone `#FAF6EF`, Limestone `#E6DFD3`, Ink `#0C0B0A`, Oxblood `#5E1B22`.

## How the data reaches the storefront

Design against this model. Field names follow Medusa v2 and the Printify API. Confirm them against the developers' implementation and the current documentation, and list any field you assumed.

**Product (Medusa `Product`, synced from a Printify product)**
- `title`, `handle`, `description`, `thumbnail`, `images[]`, `collection`, `categories`, `tags`, `metadata`.
- In Printify, a product is one blank (`blueprint_id`) printed by one provider (`print_provider_id`). Different designs may use different blanks, so **sizes, colours and fabric details differ between products**. Never assume one size range or one colour list.

**Options and variants**
- Options are usually **Color** and **Size** (Medusa `ProductOption` and `ProductOptionValue`; Printify `options[]` with `type` `color` or `size`).
- Printify colour values carry a hex code (`values[].colors[]`). Swatches must render from that hex, not from a hard-coded palette.
- Each variant (Medusa `ProductVariant`) is one colour and size combination. A combination may be:
  - enabled;
  - disabled by the shop (Printify `is_enabled: false`), which must be hidden;
  - temporarily unavailable at the provider (Printify `is_available: false`), which must be shown as unavailable.
- **There is no stock count.** Print-on-demand does not hold inventory, so never show "only N left" or a stock number.

**Prices**
- Prices come from Medusa per region and currency (`calculated_price`). Design for different currencies and number lengths (for example `€ 45`, `£ 39`, `$ 1,050`). Use mono numerals as the design system specifies.
- Never hard-code a price in a design. Use real field bindings, or `[PRICE]` in mock screens.

**Images**
- Printify images belong to variants (`variant_ids`), have a `position` (`front`, `back`, and on some blanks sleeves or other views) and one `is_default`.
- The product gallery must:
  - change with the selected colour;
  - label each view by its position;
  - cope with anything from 1 to around 10 images;
  - fall back to the design system's captioned image placeholder when an image is missing.

**Print areas**
- Printify `print_areas[].placeholders[].position` says where the design is printed. Show it to the client as a short fact on the product page: "Printed on the back.", "Printed front and back." or "Printed on the sleeve."

**Brand data in `metadata`**
Propose a small metadata schema so brand facts display without code changes, for example:
- `dn_design_no`: "41"
- `dn_family`: `typographic` or `engraving`
- `dn_colour_names`: a map from Printify colour names to brand names, such as `{ "Black": "Ink", "Natural": "Bone" }`, falling back to Printify's name.
- `dn_print_note`

Keep the schema short, and mark every field optional.

**Shipping**
- Shipping options and costs come from Medusa shipping options backed by Printify's shipping profiles. These differ by country and by number of items.
- Production time is added before dispatch.
- Show what the data provides: an option name, a price, and an estimate if one is available. Never invent delivery times.

**Orders**
Order and fulfilment status comes from Medusa, updated from Printify. Printify order statuses include:
- `pending`
- `on-hold`
- `payment-not-received`
- `sending-to-production`
- `in-production`
- `partially-fulfilled`
- `fulfilled`
- `canceled`
- `had-issues`

Shipments carry a carrier, a tracking number and a tracking URL. Map these to a short client-facing timeline: **Received · In production · Dispatched · Delivered**, plus **Cancelled** and **Needs attention**. Show which raw statuses feed each step, and how a partial dispatch and multiple tracking links are shown.

## Screens and components to deliver

Adapt the existing design-system components wherever possible. Each item below lists what that screen or component must handle.

1. **Collection page.**
   - A grid of product tiles: image, title, price from the data, and colour swatches from the data, with "+N" when there are more than fit.
   - Filters built from data: colour, design family, and print placement (front, back, or front and back).
   - Sorting.
   - Empty and loading states.
2. **Product page**, shown for one typographic tee and one engraving tee:
   - **Gallery:** follows the selected variant, with position labels.
   - **Buy box:** title, price, colour selector, size selector, Add to bag, the print-placement line, and a "Printed to order." line.
   - **States:** unselected, selected, unavailable, unavailable after a size is chosen, loading and adding.
   - **Below the fold:** description, fabric and care pulled from the blank's data, and the size guide entry point.
3. **Size guide.** A modal that renders a size table from data, with any number of rows and columns and the units given. Size charts differ per blank, so it must never contain fixed measurements.
4. **Cart drawer and cart page.** Line items show:
   - variant image, title, colour (brand name if mapped), size, quantity, line price;
   - remove, and quantity change;
   - subtotal, and a note that shipping is calculated at checkout;
   - empty and error states.
5. **Checkout.** Address, shipping options from data with an empty state ("No shipping to this country."), payment, review and confirmation. The flow has to fit the existing Medusa checkout steps.
6. **Order confirmation and order detail.** The status timeline above, items, totals, shipping address, and tracking links.
7. **Transactional emails.** Order received, dispatched with tracking, and order issue, using the same status language.
8. **Global states.** 404, a product removed or unavailable everywhere, network error, and slow image loading.

Drop the design-system components that print-on-demand makes untrue: the fit predictor, the fitting appointment card, and the "edition reserved" bag drawer. Say this in your hand-off.

## Truth rules

- **Never invent facts the data does not supply:** prices, delivery times, stock levels, reviews, ratings, discounts, dates or claims. In mock screens, use clearly marked placeholders such as `[PRICE]`, and list them.
- **No edition or scarcity claims on tee pages.**
  - Some designs print "No. 04 of 12" or "Twelve made" as artwork. The tees are print-on-demand and unlimited, so the product copy must never present them as a real edition.
  - There must be no countdowns and no "limited".
- **No making or origin claims for the tee itself.**
  - Don't say "made in Paris", "made by the atelier", "cut on the bias" or "dispatched from Paris".
  - The tee is a blank printed by Printify's provider, and it ships from there.
  - The brand story can still say what DE NOYON is.
- **Brass on garments prints as flat `#B18A46`.** Do not call it gold, metallic or foil.

## What to hand over

1. **Screens:** each screen above at desktop 1440 px and mobile 390 px, with every state.
2. **Component specs, for each component:**
   - its **props contract** as a TypeScript interface that names the Medusa field each prop comes from (for example `price: CalculatedPrice` from `variant.calculated_price`);
   - its states;
   - its tokens;
   - its behaviour when data is missing, long or unusual: long titles, 1 versus 12 colours, 3 versus 9 sizes, no images, odd currencies.
3. **The metadata schema** you propose, with an example for one product.
4. **The order-status mapping table:** Printify status → Medusa state → client-facing step and copy.
5. **Copy deck:** every interface string in the brand voice, with placeholders listed.
6. **Assumptions and questions:** every field name you assumed and every decision that belongs to the owner.

## Check your own work before handing over

- Every value on every screen is bound to a named field or marked as a placeholder.
- Every component survives these cases:
  - one colour and one size;
  - many colours and many sizes;
  - an unavailable variant;
  - a missing image;
  - a long title;
  - a three-digit price in another currency.
- No stock counts, edition claims, origin claims or invented delivery times appear anywhere.
- The design system is used as it is: tokens only, square corners, one brass line, one primary action per view, AA contrast for all text, visible focus, labelled swatches and sizes, and reduced motion respected.
- A developer could connect Printify-synced products to these components without asking you anything.
