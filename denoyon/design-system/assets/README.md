# assets

No brand assets were supplied by the client. Everything here is typeset, not drawn:

- `logo.svg` / `logo-cream.svg` — horizontal wordmark: DE NOYON set in Jost Medium, 0.34em tracking, with the single differentiating element — a 2px gold hairline rule beneath the word. Ink on light, cream on dark.
- `logo-stacked.svg` — two-line lockup for narrow spaces (labels, app icon, care tags).
- The SVGs embed a Google Fonts `@import`; that only resolves when the SVG is **inlined** in a document. For `<img src>` use, or for print, request outlined (path) versions from the brand owner.
- In HTML, prefer live type: `<span class="dn-wordmark">De&nbsp;Noyon</span>` (see `tokens/base.css`).

**Missing:** photography (campaign, lookbook, product), fabric/texture scans, outlined logo files, icon set. Product imagery in the UI kits uses neutral placeholder fields, never generated art.
