# 🧱 PaxFunerar — Angular → Plain PHP/WordPress Theme Conversion Plan
> **Version:** 1.1 | **Date:** 2026-06-18 | **Status:** Phases 0–5 BUILT · Phase 6 (host QA + cutover) pending
>
> Companion to `PROJECT_PLAN.md` (design system + content source of truth) and
> `WOOCOMMERCE_INTEGRATION.md` (now superseded for the frontend parts — WooCommerce
> stays, the REST/proxy layer goes). Read this file at the start of any session that
> touches theme code.

---

## ✅ Build Status (2026-06-18)

The theme is built at `pax-funerar-theme/` on branch **`wordpress-theme`**.
Phases 0–5 are complete and committed; **Phase 6 (visual QA + Lighthouse +
domain cutover) is the only remaining work and must run on the live WordPress
host** — there's no PHP/WordPress runtime in the dev sandbox, so nothing has been
render-tested. Templates were authored against the real Angular sources and
validated by i18n-key checks (all RO+HU keys resolve) and JS syntax checks.

**Decisions locked during the build:**
- **Service detail = Option B** — page editor (`the_content`) + a no-plugin meta
  box (teaser / benefits / icon) override **bilingual i18n fallbacks**; the
  long-form `servicePage.*` sections stay i18n-driven.
- **Page CSS is scoped under `.page-*` body classes** (not a flat global sheet) —
  several pages reuse `.section-title` / `.page-hero` / `.cta-inner` with
  different values, so a flat sheet would collide. This reproduces Angular's view
  encapsulation; shared components stay global. Cart-drawer SCSS was dropped
  (native WooCommerce cart replaces it).

**Operator docs / automation:**
- `pax-funerar-theme/README.md` — install + the full wp-admin cutover checklist.
- `pax-funerar-theme/bin/setup-wp.sh` — **WP-CLI script** that creates all 17
  Pages with correct slugs/parents/templates, renames the Shop slug to `magazin`,
  and flushes permalinks (idempotent). Run it on the host instead of clicking
  through wp-admin.

---

## 📌 Scope & Ground Rules (locked in this session)

- **Full native WordPress theme, plain PHP.** No purchased plugins. No page builder,
  no ACF, no Polylang/WPML, no SEO plugin, no form plugin. **WooCommerce is the one
  exception** — it's already installed on `wp.sellmotion.ro` with real products and
  isn't part of what's being "transformed." Only the front-end presentation layer
  changes.
- **This pass = structural port only.** Same HTML structure, same CSS (compiled from
  the same SCSS tokens), same anime.js interactions — just emitted by PHP instead of
  Angular. Content-editing tooling (ACF, Elementor, Polylang, etc.) is something you
  add yourself *after* this theme is live — nothing here is built around any of them,
  so adding them later is additive, not a rewrite.
- **The headless WooCommerce REST layer is fully scrapped** — `WooCommerceService`,
  `proxy.php`, `pax-cors.php`. The theme talks to WooCommerce directly in PHP. No
  REST API, no CORS, no proxy.
- **Design fidelity order of operations:** build pixel/animation-identical first. If a
  later Lighthouse pass flags performance problems, the fallback order is (1) trim
  anime.js stagger counts/durations, (2) defer below-fold animations to on-scroll
  only, (3) drop nonessential micro-interactions (button-hover glow etc.), (4) only as
  a last resort, simplify the visuals themselves.

---

## 🔁 The Core Idea

Angular's job was three things: render HTML from data, style it with SCSS, and animate
it with anime.js via signals/directives. None of that requires Angular specifically —
it just needs *something* to do the rendering. In WordPress that "something" is PHP
templates. Nothing here is conceptually new; there's just no Angular runtime sitting
in the middle anymore.

| Angular did this | PHP/WordPress equivalent |
|---|---|
| `*.component.html` | a `.php` template (or `template-parts/*.php`) emitting the **same markup, same class names** |
| `*.component.scss` | the **same SCSS rules**, compiled once into the theme's `style.css` |
| Angular Router (`app.routes.ts`) | WordPress's own page hierarchy / Template Hierarchy — no router needed |
| `*ngFor` / `*ngIf` | PHP `foreach` / `if`, same logic, swapped syntax |
| `{{ value }}` | `<?= esc_html($value) ?>` |
| `[src]="x"`, `[routerLink]` | `<?= esc_url($x) ?>` in a normal `href`/`src` attribute |
| `(click)="openModal()"` | `addEventListener('click', ...)` in plain JS |
| `AnimationService` (anime.js wrapper) | `assets/js/animations.js` — same function names, same anime() calls, just not an `@Injectable` |
| `RevealOnScrollDirective` | `assets/js/reveal.js` — an `IntersectionObserver` looking for a `data-reveal` attribute |
| `CartService` (signals) | WooCommerce's own session-based cart (`WC()->cart`) + its built-in AJAX fragments — **no custom state code needed** |
| `TranslationService` + `ro.json`/`hu.json` | a tiny `pax_t()` PHP helper reading the **same two JSON files**, keyed by a cookie/query param instead of localStorage |
| `SeoService` | a `pax_seo()` helper called at the top of each template, output via `wp_head` |
| `ServiceCardComponent` / `ServiceDetailModalComponent` | `template-parts/service-card.php` / `template-parts/service-modal.php`, included via `get_template_part()` |

---

## 📁 New Theme Folder Structure

```
wp-content/themes/pax-funerar-theme/
├── style.css                    # WP theme header comment (required by WP)
├── functions.php                # setup, enqueues, theme_support, helper includes
├── header.php
├── footer.php
├── front-page.php               # ported from home.component.html
├── page-servicii-funerare.php   # listing — parent page, card grid + modals
├── page-service-detail.php      # one template, assigned to all 10 child pages
├── page-contact.php
├── page-despre-noi.php
├── page.php                     # fallback for legal pages
├── template-parts/
│   ├── service-card.php
│   ├── service-modal.php
│   ├── product-card.php         # used inside the WooCommerce override
│   ├── faq-accordion.php
│   ├── testimonial-slider.php
│   ├── phone-sticky.php
│   └── nav.php
├── woocommerce/                 # WooCommerce template overrides — see Phase 5
│   ├── archive-product.php      # this IS the /magazin page, no extra wrapper needed
│   ├── content-product.php      # single product card + its quick-view modal
│   └── single-product.php
├── inc/
│   ├── services-data.php        # literal port of SERVICES from services.data.ts
│   ├── content-data.php         # testimonials + FAQ, ported from ro.json
│   ├── i18n.php                 # pax_t() helper
│   ├── seo.php                  # pax_seo() helper
│   └── contact-form.php         # POST handler for the contact form
└── assets/
    ├── scss/                    # _variables.scss, _typography.scss, _animations.scss,
    │                             # _utilities.scss, styles.scss — same files, same content
    ├── css/style.css            # compiled output — this is what actually ships
    ├── js/
    │   ├── animations.js        # ported AnimationService
    │   ├── reveal.js            # ported RevealOnScrollDirective
    │   ├── modals.js            # ported modal open/close logic
    │   ├── nav.js                # mobile hamburger
    │   └── lang-switch.js        # sets ?lang= → cookie
    └── icons/                   # same SVGs as today
```

---

## 🎨 SCSS → CSS: the literal conversion step

1. Copy the five SCSS partials into `assets/scss/` **unchanged** — colors, typography
   scale, spacing scale, and animation tokens from `PROJECT_PLAN.md` don't need to
   change at all.
2. Compile once locally (this never runs on the Hostico server — it's a dev-time step,
   same role Angular CLI used to play):
   ```bash
   npm install -D sass          # only on your dev machine / Claude's sandbox
   npx sass assets/scss/styles.scss assets/css/style.css --style=compressed
   ```
3. Commit the compiled `assets/css/style.css`. Enqueue it from `functions.php`.
4. Add a one-line `package.json` script (`"build:css": "sass assets/scss/styles.scss assets/css/style.css --style=compressed"`)
   so re-compiling after a design tweak is a single command, not a manual step.

This is the entire "SCSS → CSS transformation" — same source, same output values, just
compiled standalone instead of by the Angular build.

---

## 🗂️ Content Data — plain PHP arrays for now

`inc/services-data.php` — a direct port:

```php
<?php
return [
    [
        'slug' => 'transport-funerar',
        'icon' => 'assets/icons/transport.svg',
        'name' => 'Transport Funerar',
        'teaser' => 'Vehicule specializate și personal calificat pentru un transport demn.',
        'description' => 'Oferim servicii de transport funerar de înaltă calitate...',
        'benefits' => ['Vehicule autorizate', 'Disponibilitate 24/7', 'Transport local și național', 'Personal specializat'],
    ],
    // ...the remaining 9 entries, copied straight from services.data.ts
];
```

`inc/content-data.php` — same idea for `TESTIMONIALS` and `FAQ`, values pulled
directly from `ro.json`'s `testimonials` and `faq` sections.

**Routing for service detail pages — no custom rewrite code needed.** Create 11 real
WordPress Pages: "Servicii Funerare" (slug `servicii-funerare`, template
`page-servicii-funerare.php`) as the parent, and the 10 services as **child pages** of
it (slug = the same slug as in `services-data.php`, e.g. `transport-funerar`),
each assigned the `page-service-detail.php` template via the normal "Page Attributes →
Template" dropdown. WordPress's own hierarchical permalinks give you
`/servicii-funerare/transport-funerar/` automatically — exactly the routing table from
`PROJECT_PLAN.md`, zero rewrite rules.

`page-service-detail.php` then just needs:
```php
<?php
$slug = get_post_field('post_name');
$service = current(array_filter(require __DIR__ . '/inc/services-data.php', fn($s) => $s['slug'] === $slug));
if (!$service) { /* show serviceDetail.notFound from pax_t() */ }
```

**Two ways to handle the page body**, pick based on how soon you want any
admin-editability before adding a real content plugin:

- **Option A — fastest, zero admin UI:** the page's WordPress content stays empty;
  the template ignores `the_content()` entirely and renders everything from the array
  above. Fully matches "plain and simple" for this pass — editing copy later means
  editing PHP.
- **Option B — barely more setup, a head start on editing:** type the long
  `description` into the normal WordPress editor (`the_content()`) for each of the 10
  pages, and use a small `add_meta_box()` (plain theme PHP, no plugin) for `icon`,
  `teaser`, and `benefits` (textarea, one per line). Gets you real wp-admin editing for
  the bulk of the content immediately, with zero plugins, and ACF later just absorbs
  these same fields.

Either is fine — flag whichever you want Claude Code to default to.

---

## 🛍️ WooCommerce — reuse the existing markup verbatim

WooCommerce itself doesn't change; only its *templates* get overridden inside the
theme (this is WooCommerce's own standard override mechanism — copying files into
`wp-content/themes/pax-funerar-theme/woocommerce/`, not a new plugin).

1. Copy `archive-product.php`, `content-product.php`, `single-product.php` from
   `wp-content/plugins/woocommerce/templates/` into the theme's `woocommerce/` folder.
2. Edit only the **markup and class names** inside so they match the Angular
   `magazin.component.html` structure exactly — `.products-grid`, `.product-card`,
   `.product-image-wrap`, `.product-info`, `.product-price`, `.add-btn`, etc. The goal
   is the compiled CSS doesn't need a single new selector.
3. `archive-product.php` **is** the `/magazin` page — rename WooCommerce's
   auto-created "Shop" page slug to `magazin` (Settings → Advanced → Page setup), no
   extra wrapper template needed.
4. Cart badge/pulse: WooCommerce ships AJAX add-to-cart and cart-fragment updates out
   of the box once `add_theme_support('woocommerce')` is declared. Listen for the
   `added_to_cart` jQuery event WooCommerce already fires and call the same pulse
   animation from `animations.js` — no custom cart state needed at all.
5. Product "quick view" modal: since `content-product.php` already has the full
   product object per loop iteration, render the same modal markup the Angular
   `ProductModalComponent` used directly alongside the card (hidden via the existing
   CSS class), toggled by `modals.js` — same card→modal pattern, no AJAX.
6. Checkout stays 100% native WooCommerce — Cash on Delivery / WooCommerce Payments
   keep working exactly as you already configured them in wp-admin. Nothing to
   rebuild here.

---

## 🎬 Animation & Interactivity — vanilla JS port

```javascript
// assets/js/animations.js — literal port of AnimationService
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
export function fadeUp(targets, delay = 0) {
  if (prefersReducedMotion()) return;
  anime({ targets, opacity: [0, 1], translateY: [30, 0],
    duration: 600, delay, easing: 'cubicBezier(0.16, 1, 0.3, 1)' });
}
export function staggerFadeUp(targets, stagger = 80) {
  if (prefersReducedMotion()) return;
  anime({ targets, opacity: [0, 1], translateY: [40, 0],
    duration: 500, delay: anime.stagger(stagger), easing: 'cubicBezier(0.16, 1, 0.3, 1)' });
}
```

```javascript
// assets/js/reveal.js — replaces RevealOnScrollDirective
import { fadeUp } from './animations.js';
document.querySelectorAll('[data-reveal]').forEach(el => {
  new IntersectionObserver(([entry], obs) => {
    if (entry.isIntersecting) { fadeUp(el); obs.disconnect(); }
  }, { threshold: 0.2 }).observe(el);
});
```

```javascript
// assets/js/modals.js — same anime.js timeline values as ServiceDetailModalComponent
function openModal(panel, overlay) {
  panel.classList.add('is-open');
  anime({ targets: panel, translateY: ['100%', '0%'], opacity: [0, 1], duration: 350,
    easing: 'cubicBezier(0.16, 1, 0.3, 1)' });
  anime({ targets: overlay, opacity: [0, 1], duration: 200, easing: 'linear' });
}
function closeModal(panel, overlay, onComplete) {
  anime({ targets: panel, translateY: ['0%', '60px'], opacity: [1, 0], duration: 250,
    easing: 'cubicBezier(0.4, 0, 1, 1)', complete: onComplete });
}
```

Same timing values, same easing curves, same trigger logic — just `addEventListener`
instead of Angular's `(click)`. Enqueued via `wp_enqueue_script()`, no bundler needed
for files this small.

---

## 🌐 i18n — plain PHP, zero plugins

Copy `ro.json` and `hu.json` into the theme unchanged (`assets/i18n/`).

```php
<?php
// inc/i18n.php
function pax_current_lang(): string {
    if (isset($_GET['lang']) && in_array($_GET['lang'], ['ro', 'hu'], true)) {
        setcookie('pax_lang', $_GET['lang'], time() + YEAR_IN_SECONDS, '/');
        return $_GET['lang'];
    }
    return $_COOKIE['pax_lang'] ?? 'ro';
}

function pax_t(string $key): string {
    static $cache = [];
    $lang = pax_current_lang();
    if (!isset($cache[$lang])) {
        $cache[$lang] = json_decode(
            file_get_contents(get_template_directory() . "/assets/i18n/{$lang}.json"),
            true
        );
    }
    $value = $cache[$lang];
    foreach (explode('.', $key) as $segment) {
        $value = $value[$segment] ?? null;
        if ($value === null) return $key; // fallback: show the key, easy to spot
    }
    return $value;
}
```

Same priority order `PROJECT_PLAN.md` already specified for ngx-translate (explicit
choice → browser language → default RO), just a cookie standing in for localStorage.
Templates call `pax_t('nav.home')` exactly where Angular called
`{{ 'nav.home' | translate }}` — same keys, same JSON, same content.

---

## 🔍 SEO — hand-rolled, no plugin

```php
<?php
// inc/seo.php
function pax_seo(string $title, string $description, ?string $canonical = null): void {
    global $pax_seo_data;
    $pax_seo_data = compact('title', 'description', 'canonical');
}
add_action('wp_head', function () {
    global $pax_seo_data;
    if (empty($pax_seo_data)) return;
    echo '<title>' . esc_html($pax_seo_data['title']) . '</title>' . "\n";
    echo '<meta name="description" content="' . esc_attr($pax_seo_data['description']) . '">' . "\n";
    if (!empty($pax_seo_data['canonical'])) {
        echo '<link rel="canonical" href="' . esc_url($pax_seo_data['canonical']) . '">' . "\n";
    }
});
```

Same `setPage()` call pattern at the top of each template; the homepage/contact page
also print the FuneralHome JSON-LD block from `PROJECT_PLAN.md` verbatim (values
unchanged) inside the same `wp_head` hook.

---

## ✉️ Contact Form — plain PHP, no plugin

Same fields as `PROJECT_PLAN.md`: Nume, Email, Telefon, Serviciu (dropdown), Mesaj,
honeypot, submit.

- `?service=` query param read server-side (`$_GET['service']`) to pre-select the
  dropdown option — same idea as Angular's `route.snapshot.queryParamMap.get('service')`.
- POST handled inline at the top of `page-contact.php`: check
  `$_SERVER['REQUEST_METHOD'] === 'POST'`, validate required fields, reject if the
  honeypot field isn't empty, `wp_mail()` to `contact@paxfunerar.ro`, redirect to
  `?sent=1`. Success copy comes from `pax_t('contact.success.title')` /
  `pax_t('contact.success.text')`.

---

## 🌍 Domain & Hosting — the other big win

Once this theme replaces Angular entirely, nothing needs the `sellmotion.ro` root
except WordPress. Recommend moving the existing WordPress install from
`wp.sellmotion.ro` back to the `sellmotion.ro` root (the reverse of the migration
`WOOCOMMERCE_INTEGRATION.md` originally planned) once the theme is confirmed working —
that frees you from the dual-domain split entirely. And since there's no Node process
running anymore, **the Passenger/CageFS `process.stdin` bug stops being relevant at
all** — there's nothing left for it to break.

---

## 🗑️ Decommission Checklist

- [ ] Archive (don't delete) the Angular repo/branch for reference
- [ ] Remove the Node.js app (`nodeapps/pax-funerar`) from cPanel once the theme is live
- [ ] Retire the GitHub Pages Actions workflow — no Angular build to deploy anymore
- [ ] Delete `proxy.php` and `wp-content/mu-plugins/pax-cors.php` from the server
- [ ] Revoke the WooCommerce REST API keys — nothing calls them once the theme talks to WC directly in PHP

---

## 🚀 Implementation Phases (for Claude Code)

### Phase 0 — Theme scaffold ✅
```
[x] functions.php: theme_support (woocommerce, title-tag, post-thumbnails), enqueues
[x] header.php / footer.php skeleton (nav, phone-sticky, cookie banner, footer markup)
[~] Confirm theme activates with no PHP errors — verify on the host (no local PHP)
```

### Phase 1 — SCSS → CSS + static sanity check ✅
```
[x] Copy SCSS partials in, compile to assets/css/style.css (npm run build:css; 53 KB)
[x] All component + page SCSS aggregated; page styles scoped under .page-* classes
[~] Pixel-diff vs live Angular site — deferred to Phase 6 (needs host render)
```

### Phase 2 — Content data + helpers ✅
```
[x] inc/services-data.php (+ PAGE_SPECS port), inc/content-data.php, inc/legal-data.php
[x] inc/i18n.php + pax_t()/pax_t_array(), copied ro.json/hu.json into assets/i18n/
[x] inc/seo.php + pax_seo() + FuneralHome JSON-LD + <title> filter
```

### Phase 3 — Core page templates ✅
```
[x] front-page.php (real content via pax_t() + content-data.php)
[x] page-servicii-funerare.php (card grid + per-card hidden modals)
[x] page-service-detail.php (Template: Service Detail) — Option B + meta box
[x] page-despre-noi.php, page-legal.php (5 legal pages), page.php fallback
[x] page-contact.php + inc/contact-form.php (validate / honeypot / wp_mail / ?sent=1)
[x] template-parts/: service-card.php, service-modal.php, faq-accordion.php
```

### Phase 4 — Interactivity/animation ✅
```
[x] animations.js (+ per-page hero intro), reveal.js, modals.js, nav.js, cart.js
    (lang-switch.js NOT needed — language switch is server-side anchor links)
[x] Wired data-reveal + modal triggers (data-modal-open/data-modal) into templates
[x] All anime.js durations/easings ported verbatim; prefers-reduced-motion honoured
```

### Phase 5 — WooCommerce template overrides ✅
```
[x] archive-product.php (IS /magazin), content-product.php (card + quick-view
    modal), single-product.php (WC content in theme shell, on-brand styled)
[x] inc/woocommerce.php: ?cat= filter, page-magazin body class, price helper
[x] Cart badge as woocommerce_add_to_cart_fragments → count auto-updates
[x] Wired added_to_cart → cart badge pulse (cart.js) + quick-view qty stepper
[~] Rename Shop page slug to magazin — done by bin/setup-wp.sh at cutover
```

### Phase 6 — QA + cutover ⏳ (remaining — host only)
```
[ ] Install theme on host, activate, confirm no PHP errors (covers Phase 0's [~])
[ ] Run `bash pax-funerar-theme/bin/setup-wp.sh` (WP-CLI) to create the 17 Pages,
    assign templates, rename Shop slug → magazin, flush permalinks
[ ] Page-by-page visual diff against the live Angular build
[ ] Mobile breakpoint check (375/390/430px)
[ ] Lighthouse pass (use the website-optimizer skill) — apply the fallback ladder
    from "Scope & Ground Rules" only if needed
[ ] Move WordPress from wp.sellmotion.ro → sellmotion.ro root
[ ] Run the Decommission Checklist
```

---

## 🔮 Adding Plugins Later (out of scope for this pass, noted for continuity)

When you're ready: ACF/Pods can absorb `services-data.php` into real custom fields in
one straightforward import (the array already has the exact shape a field group would
want — not a redesign). Polylang/WPML can take over translating the WooCommerce
products and the 10 service pages, while `pax_t()` keeps handling static UI strings
either way. A page builder (Elementor or the native block editor) can take over
`despre-noi`/legal page content without touching anything built in this pass. None of
this requires revisiting the templates above.

---

## 📋 Session Resume Template

```
Project: PaxFunerar — Angular → Plain PHP WordPress theme conversion
Plan: See WORDPRESS_CONVERSION_PLAN.md in project root
Current phase: [FILL IN]
Last file worked: [FILL IN]
Blocked by: [FILL IN or "nothing"]
Next task: [FILL IN]

Key facts:
- Plain PHP theme, no purchased plugins, WooCommerce untouched (already has products)
- Headless REST integration (WooCommerceService, proxy.php, pax-cors.php) is SCRAPPED
- Same SCSS tokens, same anime.js timings, same ro.json/hu.json content — structural
  port only, no redesign
- Service detail pages = WP child pages of "Servicii Funerare", using
  page-service-detail.php, content from inc/services-data.php (Option A) or
  the native editor + a meta box (Option B) — confirm which was chosen
- i18n via pax_t() cookie/query-param helper, not a plugin
- Domain consolidation (wp.sellmotion.ro → sellmotion.ro root) happens at Phase 6,
  resolves the Passenger/CageFS bug for good
- Real current Angular .component.html/.scss files live in Paul's actual repo — open
  and port those directly, don't rely solely on the skeletons in this plan
```

---

*Last updated: 2026-06-18*
