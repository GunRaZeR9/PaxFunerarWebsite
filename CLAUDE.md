# PaxFunerar — Project Context

**Read PROJECT_PLAN.md first** — it is the master plan (routes, design system, specs, phases).

## Stack
- Angular 19 standalone components + signals, SCSS, SSR (`@angular/ssr`, prerender on)
- anime.js v3 (`import anime from 'animejs'`) — NO `@angular/animations`
- @ngx-translate v16 for RO/HU i18n — JSON files in `public/assets/i18n/`
- Lucide / inline SVG icons

## Conventions
- Component selector prefix in shared/pages: `pax-` (root stays `app-root`)
- Design tokens: `src/styles/_variables.scss` (CSS custom props + SCSS breakpoints `$bp-sm`…`$bp-2xl`)
- Use `@use '.../styles/variables' as *;` in component SCSS
- Animate ONLY `transform` + `opacity`; always check `AnimationService.prefersReducedMotion`
- Elements animated in start with class `reveal-hidden` (opacity 0; reset by reduced-motion CSS)
- Mobile-first, 375px minimum viewport; touch targets ≥ 44×44px
- New control-flow syntax (`@if` / `@for`), `input()` signals, `inject()`

## Key services (src/app/core/services/)
- `cart.service.ts` — signal-based cart, frontend-only, fixed 25 RON delivery
- `translation.service.ts` — wraps TranslateService; localStorage key `pax-lang`; RO default
- `animation.service.ts` — anime.js orchestration + motionTokens
- `seo.service.ts` — title/meta/canonical/JSON-LD per page

## Shop / Payment (WooCommerce)
- Revolut Pay has been dropped. Payments go through headless WooCommerce — WooCommerce Payments (card) + Cash on Delivery.
- Read `WOOCOMMERCE_INTEGRATION.md` (project root) before touching shop/payment/order code — it's the authoritative phase plan.
- WooCommerce + PHP proxy (`proxy.php`) run on Hostico (`www.sellmotion.ro`, temporary testing domain). Write API key lives only in `proxy.php`, never in Angular.
- No `backend/` Express server for payment — WooCommerce Payments' account lives on WooCommerce.com.

## Deploy
- GitHub Pages demo: push to main → `.github/workflows/deploy.yml` → https://gunrazer9.github.io/PaxFunerarWebsite/
- Build output: `dist/pax-funerar/browser`; 404.html SPA trick for routing
- Production (later): SSR host + backend host TBD

## Status
- Phase 0 (setup) done: scaffold, tokens, services, navbar/footer, home stub, CI
- Next: Phase 1 — Home page full sections, servicii-funerare listing + detail, contact, despre-noi
