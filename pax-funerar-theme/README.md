# PaxFunerar — WordPress Theme

Plain-PHP WordPress theme ported 1:1 from the Angular build
(see `../WORDPRESS_CONVERSION_PLAN.md`). No page builder, no purchased plugins;
WooCommerce is the only dependency, for the shop. Same SCSS tokens, same anime.js
timings, same `ro.json` / `hu.json` content.

## Install

1. Copy `pax-funerar-theme/` into `wp-content/themes/` on the WordPress host.
2. **Appearance → Themes → Activate** "PaxFunerar".
3. Activate **WooCommerce** (already installed with products on the host).

## Required wp-admin setup (one-time cutover)

### Pages + templates
Create these Pages (Pages → Add New) and assign templates via
**Page Attributes → Template**:

| Page title | Slug | Template | Parent |
|---|---|---|---|
| Servicii Funerare | `servicii-funerare` | *Servicii Funerare* (auto by slug) | — |
| Întocmirea Actelor | `intocmirea-actelor` | **Service Detail** | Servicii Funerare |
| Transport Funerar | `transport-funerar` | **Service Detail** | Servicii Funerare |
| Îmbălsămare | `imbalsamare` | **Service Detail** | Servicii Funerare |
| Servicii Ceremoniale | `servicii-ceremoniale` | **Service Detail** | Servicii Funerare |
| Servicii de Catering | `servicii-de-catering` | **Service Detail** | Servicii Funerare |
| Repatriere Decedați | `repatriere-decedati` | **Service Detail** | Servicii Funerare |
| Capelă | `capela` | **Service Detail** | Servicii Funerare |
| Pregătire Loc de Veci | `pregatire-loc-de-veci` | **Service Detail** | Servicii Funerare |
| Incinerare | `incinerare` | **Service Detail** | Servicii Funerare |
| Fotoceramică | `fotoceramica` | **Service Detail** | Servicii Funerare |
| Contact | `contact` | *Contact* (auto by slug) | — |
| Despre Noi | `despre-noi` | *Despre Noi* (auto by slug) | — |
| Politica de confidențialitate | `politica-de-confidentialitate` | **Legal Page** | — |
| Politica de cookies | `politica-de-cookies` | **Legal Page** | — |
| Termeni și condiții | `termeni-si-conditii` | **Legal Page** | — |
| Politica de reclamații | `politica-de-reclamatii` | **Legal Page** | — |
| Politica clienți | `politica-clienti` | **Legal Page** | — |

The child-page slugs **must** match the service slugs above — that's what gives
`/servicii-funerare/transport-funerar/` and loads the right content. The slug is
also how `page-servicii-funerare.php` / `page-contact.php` / `page-despre-noi.php`
auto-attach (WordPress template hierarchy `page-{slug}.php`).

### Home page
**Settings → Reading → Your homepage displays → A static page** is *optional* —
`front-page.php` renders the homepage regardless. (Leave "Your latest posts" and
it still works.)

### Shop
**Settings → Advanced / WooCommerce → Settings → Advanced → Page setup**: set the
Shop page, then rename its slug to **`magazin`**. Product categories should use the
slugs `coroane`, `jerbe`, `aranjamente`, `buchete` so the `?cat=` filters work.

### Permalinks
**Settings → Permalinks → Post name** (or any pretty-permalink option), then Save
to flush rewrite rules.

## Editing content

- **UI strings, service/legal/home copy:** `assets/i18n/ro.json` + `hu.json` —
  same keys as the Angular build, edited directly (until Polylang/ACF is added).
- **Service detail pages (Option B):** the page's **editor** drives the long
  description; a **"Detalii serviciu (PAX)"** meta box drives Teaser / Benefits
  (one per line) / Icon. Anything left blank falls back to the bilingual JSON, so
  RO + HU work out of the box.
- **Products / prices / images:** WooCommerce admin (Products).

## Rebuilding CSS after a SCSS change

From the repo root:

```bash
npm install -D sass     # once
npm run build:css       # assets/scss/styles.scss → assets/css/style.css
npm run watch:css       # auto-rebuild while editing
```

`style.css` at the theme root is **only** the WordPress theme header — the real
styles ship from `assets/css/style.css`.

## Architecture notes

- **Page styles are scoped** under `.page-*` body classes (set per template)
  because several pages reuse class names (`.section-title`, `.page-hero`,
  `.cta-inner`) with different values — this reproduces Angular's view
  encapsulation. Shared components (navbar, footer, cards, modals, faq) stay
  global.
- **i18n:** `pax_t('key')` reads the same JSON; language chosen by `?lang=ro|hu`
  (sets a cookie) → cookie → browser → RO default. Switch links need no JS.
- **Animations:** anime.js v3 (`assets/js/vendor/anime.min.js`) + ES modules
  `animations.js` / `reveal.js` / `modals.js` (loaded `type="module"`), plus the
  classic `nav.js` behaviours and `cart.js` (WC pages). All honour
  `prefers-reduced-motion`.
- **Cart:** native WooCommerce session cart + AJAX fragments; the cart badge is a
  `woocommerce_add_to_cart_fragments` fragment so its count updates automatically.
