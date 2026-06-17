# 🛒 PaxFunerar — WooCommerce Headless Integration Plan
> **For:** Claude Code sessions  
> **Stack:** Angular 19 (SSR) + WooCommerce REST API + WooCommerce Payments + Cash on Delivery + Hostico (cPanel)  
> **WordPress/WooCommerce host:** `wp.sellmotion.ro` (domain migration complete — WordPress now lives on the subdomain)  
> **Angular's future home:** `sellmotion.ro` root (currently on GitHub Pages demo; deploy only after confirming the root is fully free of the old WordPress install — see open item below)  
> **Read this file at the start of every session that touches shop/payment code.**

---

## 📐 Architecture Overview

### Current — domain migration complete, WooCommerce setup in progress

```
Angular 19  (GitHub Pages demo — still here; moves to sellmotion.ro root once
             the old WordPress files are confirmed cleared from that root)
      ↕  WooCommerce REST API  (JSON)
wp.sellmotion.ro  (WordPress + WooCommerce — Hostico, subdomain, LIVE)
      ├── /wp-admin                    ← client logs in here (products, orders, metrics)
      ├── WooCommerce Payments + COD   ← NOT YET enabled (next step, see 0.3)
      └── MySQL DB                     ← products, orders, customers (Hostico MySQL)

PHP Proxy  (proxy.php — to be uploaded to wp.sellmotion.ro root, NOT YET DONE)
      ← Angular calls this for authenticated WC operations (order creation)
      ← Holds WC consumer_key / consumer_secret server-side (never in JS bundle)
```

> ✅ **Migration step 1 done:** WordPress was reinstalled fresh on `wp.sellmotion.ro`  
> (rather than file-moved from the root — see deviation #4 below). This means Phase 0  
> effectively restarted on the new install: WooCommerce is active and the setup wizard  
> has run, but REST API keys, the CORS mu-plugin, and payment gateways still need to be  
> configured on *this* install — they don't carry over from wherever they were set up before.
>
> ⚠️ **Open item:** confirm whether the old WordPress file set is still sitting on the  
> `sellmotion.ro` root. If it is, back it up and remove it before deploying Angular there  
> — the two cannot coexist on the same root.

### Target — once Angular moves to sellmotion.ro

```
sellmotion.ro          (Angular 19 — root)
      ↕  WooCommerce REST API
wp.sellmotion.ro        (WordPress + WooCommerce — already here ✅)
```

**Key principle:** Angular is the storefront only. WordPress admin is the client's tool.  
The Angular `products.data.ts` and `CartService` are replaced/extended — nothing else changes.

---

## 🔜 Domain Migration — Status

1. ✅ Subdomain `wp.sellmotion.ro` created in Hostico cPanel
2. ✅ WordPress installed fresh on `wp.sellmotion.ro` (via Softaculous — a clean install rather than moving the old file set, see deviation #4 below; this is why WooCommerce needs setting up again on this install)
3. ✅ WordPress site URL is `https://wp.sellmotion.ro` (correct by virtue of the fresh install)
4. ✅ Every domain reference in this document has been updated from `www.sellmotion.ro` → `wp.sellmotion.ro`
5. ⏳ **Still open:** confirm the old WordPress files at the `sellmotion.ro` root have been backed up and removed — don't skip this before Phase 7 deployment
6. ⏳ Not started: re-test the Phase 0–1 checklist items below against `wp.sellmotion.ro`, then deploy Angular per Phase 7.2/7.3 to the now-free `sellmotion.ro` root

---

## ✅ Progress Status

| Phase | Status | Notes |
|---|---|---|
| 0 | **In progress** | WooCommerce installed + setup wizard run; REST API keys generated (Read + Read/Write); 4 floral products created. CORS mu-plugin content finalized below, upload still pending. Payment gateways (0.3) intentionally deferred — not needed for the product listing. |
| 1 | **Deferred** | Only needed for order creation (checkout) — not blocking product display. Revisit once payments resume. |
| 2 | Not started | Next code task — read-only product fetch, no payment dependency |
| 3 | Not started | Magazin page — this is the immediate goal |
| 4–5 | **Deferred** | Cart→order and checkout depend on Phase 1/payment setup |
| 6–7 | Not started | |

**Deviations from original plan — all resolved below, no blockers:**
1. **0.5 CORS** — Hostico's File Manager hides `.htaccess` by default. Resolved with a WordPress-side fix (Option A in 0.5 below) that doesn't need `.htaccess` at all.
2. **0.7 Category base** — left as the default `product-category` instead of `categorie`. This is harmless for the headless setup — see updated 0.7 for why.
3. **Domain + payment gateway** — testing on `sellmotion.ro` (not `paxfunerar.ro` yet) using default WooCommerce Payments + Cash on Delivery instead of the Revolut plugin.
4. **Domain migration executed as a fresh install, not a file move** — WordPress on `wp.sellmotion.ro` was installed clean via Softaculous rather than moving the original file set from the `sellmotion.ro` root. Practical effect: none of the prior WooCommerce configuration (REST keys, CORS, payment gateways) carried over — it's being redone from scratch on this install.
5. **Payment setup deliberately deferred** — the immediate goal is getting the product listing live; checkout/payment work (Phases 0.3, 1, 4, 5) resumes later.

---

## 🎯 Immediate Next Steps

1. **Upload `pax-cors.php`** to `wp.sellmotion.ro/wp-content/mu-plugins/pax-cors.php` — finalized content is in 0.5 below, now includes `sellmotion.ro` as an allowed origin.
2. **Verify the REST endpoint** — `https://wp.sellmotion.ro/wp-json/wc/v3/products?consumer_key=...&consumer_secret=...` should return your 4 products as JSON, and the response headers should show `Access-Control-Allow-Origin` when called from an allowed origin.
3. **Fix the auth bug in `environment.ts`** before testing Phase 2/3 code — see the note in 2.1/2.3 below. The original draft set `consumer_secret` to an empty string, which causes every WooCommerce API call to fail with 401. Both the Read key *and* its secret need to go into Angular.
4. **Confirm the old WordPress install is gone from the `sellmotion.ro` root** before uploading the Angular build there — this is now urgent since you're deploying there directly rather than staying on GitHub Pages first. If it's still present, back it up and remove it first.
5. **Build Phase 2 (WooCommerceService) + Phase 3 (Magazin page)** — this is the actual code work for "make the products page work." Phases 1, 4, 5 (proxy, cart→order, checkout) stay deferred until payment setup resumes.
6. Whenever payment work resumes: come back to 0.3 (payment gateways), then Phase 1.

---

## 🗂️ Phase Overview

| Phase | What | Time estimate |
|---|---|---|
| 0 | WooCommerce setup on Hostico | 1–2 hours ✅ |
| 1 | CORS + PHP proxy on Hostico | 1 hour ⏳ |
| 2 | Angular WooCommerce service layer | 2–3 hours |
| 3 | Magazin page — live products from WC | 1–2 hours |
| 4 | Cart → WooCommerce order creation | 2 hours |
| 5 | Checkout page — COD + WooCommerce Payments redirect | 2–3 hours |
| 6 | i18n for product content | 1 hour |
| 7 | Environment config + deployment | 1 hour |

---

## ⚙️ Phase 0 — WooCommerce Setup on Hostico (manual, not code)

> Do this in Hostico cPanel **before any coding**. Claude Code cannot do this step.

### 0.1 Install WordPress via Softaculous ✅ DONE (post-migration)
1. Log into Hostico cPanel → **Softaculous Apps Installer**
2. Search for **WordPress** → Install
3. Installation URL used: `wp.sellmotion.ro` (subdomain) — this is the permanent location going forward, not a temporary one
   - Confirm the old install at the `sellmotion.ro` root has been backed up and removed before Angular deploys there — see the open item under "🔜 Domain Migration — Status" above
4. Note down: admin username, admin password, DB name

### 0.2 Install & configure WooCommerce ✅ DONE
1. WordPress Admin → Plugins → Add New → search **WooCommerce** → Install → Activate
2. Run the WooCommerce setup wizard:
   - Store location: Romania
   - Currency: RON (Romanian Leu)
   - Industry: Health & Beauty (closest option)
3. WooCommerce → Settings → General:
   - Selling locations: Romania (+ any others needed)
   - Enable taxes: YES (Romanian VAT 19%)

### 0.3 Enable Cash on Delivery + WooCommerce Payments ⏸️ DEFERRED (not blocking)

> **Deferred by choice:** payment gateways aren't needed to get the product listing  
> and Magazin page working — that only needs the Read key from 0.4. This step only  
> matters once checkout/Phase 5 is being built. Come back to it then.
1. WooCommerce → Settings → Payments
2. **Cash on delivery (COD)** → toggle Enabled. Optional: set instructions text shown to customer.
3. **WooCommerce Payments** → Enabled → follow the WooCommerce.com account connection wizard (this links a Stripe-backed account; no separate API keys to manage in this codebase — WooCommerce.com holds those, never your code)
4. Confirm both gateways show as **Enabled** in the Payments list
5. No live/sandbox toggle to worry about for COD. For WooCommerce Payments, confirm whether the connected account is in test mode or live mode inside the WooCommerce Payments settings screen before accepting real cards.

> **Note:** This replaces the Revolut plugin from the original plan. Default WooCommerce  
> gateways don't return a custom `payment_url` field from the REST API the way the Revolut  
> plugin did — Phase 5 below is written around that difference (COD never leaves Angular;  
> card payment redirects to WooCommerce's own order-pay page).

### 0.4 Configure WooCommerce REST API ✅ DONE
1. WordPress Admin → WooCommerce → Settings → Advanced → REST API
2. Click **Add Key**:
   - Description: `Angular Storefront Read`
   - User: your admin user
   - Permissions: **Read**
   - Generate → copy `consumer_key` (ck_...) and `consumer_secret` (cs_...)
3. Click **Add Key** again:
   - Description: `Angular Storefront Write`
   - Permissions: **Read/Write**
   - Generate → copy separately — this goes into the PHP proxy only, NEVER in Angular

### 0.5 Configure CORS — WordPress-side fix (no `.htaccess` needed) ✅ FINALIZED — upload pending

> **Why the original plan changed:** Hostico's File Manager hides dotfiles like  
> `.htaccess` by default — this is standard cPanel behavior, not Hostico-specific.  
> Rather than fighting the file manager, fix CORS inside WordPress itself. This is  
> actually more reliable than the `.htaccess` approach: it doesn't depend on Apache's  
> `mod_headers` module being enabled, and it survives WordPress regenerating  
> `.htaccess` after a permalink settings change. (Separately, the `.htaccess` file  
> itself has now been located on the `wp.sellmotion.ro` filesystem too — useful for  
> Phase 7.3 later, not needed for this fix.)

**Option A — mu-plugin (recommended, do this one)**

1. In Hostico File Manager, navigate to `wp.sellmotion.ro/wp-content/`
2. Create a new **folder** named `mu-plugins` — this is a regular folder, not a dotfile, so no hidden-files setting is needed to see or create it
3. Inside `mu-plugins`, create a new **file** named `pax-cors.php`:

```php
<?php
/**
 * Plugin Name: PAX CORS Fix
 * Description: Allows the Angular storefront to call the WooCommerce REST API.
 *
 * Upload to: wp.sellmotion.ro/wp-content/mu-plugins/pax-cors.php
 * See WOOCOMMERCE_INTEGRATION.md Phase 0.5 for context.
 */

add_action('rest_api_init', function () {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');

    add_filter('rest_pre_serve_request', function ($value) {
        // Whitelist, not a single origin. Angular's production target is
        // sellmotion.ro — both apex and www are listed since browsers treat
        // them as distinct origins for CORS. GitHub Pages + localhost stay
        // in for the demo/local-dev workflow; safe to drop gunrazer9.github.io
        // once sellmotion.ro is confirmed working end-to-end.
        $allowed_origins = [
            'https://sellmotion.ro',
            'https://www.sellmotion.ro',
            'https://gunrazer9.github.io', // GitHub Pages demo — verify this matches your actual Pages URL
            'http://localhost:4200',       // ng serve (local dev)
        ];

        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        if (in_array($origin, $allowed_origins, true)) {
            header('Access-Control-Allow-Origin: ' . $origin);
        }

        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        header('Access-Control-Allow-Credentials: true');

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            status_header(200);
            exit();
        }

        return $value;
    }, 15);
}, 15);
```

4. Save. Files placed in `mu-plugins` ("must-use" plugins) activate automatically —  
   there's nothing to switch on in the Plugins screen, and no theme file is touched  
   (so a future theme update can't wipe it out).
5. **Verify immediately:** open  
   `https://wp.sellmotion.ro/wp-json/wc/v3/products?consumer_key=ck_...&consumer_secret=cs_...`  
   directly in a browser tab. You should get raw JSON with no PHP errors. Then once  
   Phase 2 is built, check the browser console in `ng serve` — there should be no  
   `CORS policy` error on the network tab.

**Option B — reveal `.htaccess` (only needed for Phase 7 later, not for CORS)**

You'll need to see `.htaccess` eventually for Phase 7's Angular SPA routing rules,  
so it's worth knowing how even though Option A solves CORS without it:

1. cPanel → File Manager → **Settings** (top-right corner)
2. Check **Show Hidden Files (dotfiles)**
3. Save — `.htaccess` now appears in `public_html` and the WordPress root

> **Bottom line:** Use Option A for CORS now. Come back to Option B in Phase 7 when  
> you need to add SPA routing rules for the Angular build.

### 0.6 Create product catalog in WooCommerce 🟡 IN PROGRESS — 4 products created
- Products → Add New for each product
- Set: Name, Description, Short Description, Price, Category, Image
- Categories: Coroane, Jerbe, Aranjamente, Buchete — confirmed as the live catalog (floral only; the `lumânări/urne/fotoceramică/sicriu` set from the original `products.data.ts` is not part of the WooCommerce-backed shop)
- Publish each product
- **Before moving on:** open each of the 4 products and confirm the category, price, and image are all set — then check WooCommerce → Products → Categories for the exact slug of each. Angular filters by slug, so a mismatch here is the most common source of "category filter shows nothing" bugs later in Phase 3.

### 0.7 Product category slug — kept as default ✅ FINE AS-IS

> **Status:** left as the default `product-category` instead of customizing it to  
> `categorie`. **This is fine — no action needed.**

The category base only matters if visitors land on WooCommerce's own archive pages  
directly (e.g. `wp.sellmotion.ro/product-category/coroane/`). This headless setup  
never sends visitors there — Angular calls the REST API directly and filters by  
category **slug** (`coroane`, `jerbe`, etc.), which is a completely separate field  
from the URL base prefix. The `CATEGORIES` array built in Phase 3.1 already uses  
those slugs, not the base, so nothing in the Angular code needs to change because  
of this.

WordPress Settings → Permalinks → confirm **Post name** is selected → Save (this  
part still matters, for clean REST API URLs).

---

## 🛡️ Phase 1 — PHP Proxy on Hostico

> **Why a proxy?** WooCommerce Write API keys must never appear in the Angular JS bundle  
> (client-side JS is readable by anyone). The proxy runs server-side on Hostico and holds  
> the secret credentials.

### 1.1 Create `proxy.php` on Hostico

Upload this file to `https://wp.sellmotion.ro/proxy.php`:

```php
<?php
// WooCommerce API Proxy — holds credentials server-side
// NEVER expose consumer_secret in Angular

// ⚠️ Same whitelist as pax-cors.php — keep both in sync. (Phase 1 itself is
// deferred until payment work resumes, but this list is kept current so it's
// correct whenever that happens.)
$allowedOrigins = [
    'https://sellmotion.ro',
    'https://www.sellmotion.ro',
    'https://gunrazer9.github.io',
    'http://localhost:4200',
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
}
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ⚠️ Store these in a .env file or Hostico ENV vars — not hardcoded
define('WC_URL',    'https://wp.sellmotion.ro/wp-json/wc/v3');
define('WC_CK',     'ck_YOUR_WRITE_CONSUMER_KEY');
define('WC_CS',     'cs_YOUR_WRITE_CONSUMER_SECRET');

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'create_order':
        handleCreateOrder();
        break;
    case 'get_order':
        handleGetOrder($_GET['order_id'] ?? '');
        break;
    default:
        http_response_code(400);
        echo json_encode(['error' => 'Invalid action']);
}

function wcRequest(string $endpoint, string $method = 'GET', array $body = []): array {
    $ch = curl_init();
    $url = WC_URL . $endpoint;

    curl_setopt_array($ch, [
        CURLOPT_URL            => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_USERPWD        => WC_CK . ':' . WC_CS,
        CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
        CURLOPT_CUSTOMREQUEST  => $method,
    ]);

    if ($method === 'POST' && !empty($body)) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
    }

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return ['status' => $httpCode, 'body' => json_decode($response, true)];
}

function handleCreateOrder(): void {
    $input = json_decode(file_get_contents('php://input'), true);

    if (empty($input['line_items'])) {
        http_response_code(400);
        echo json_encode(['error' => 'line_items required']);
        return;
    }

    // 'cod' or 'card'. Angular sends this based on the radio the customer picked.
    $method = $input['payment_method'] ?? 'cod';
    $isCod  = $method === 'cod';

    $orderPayload = [
        'set_paid'       => false,
        // COD: nothing further to collect online → mark processing immediately.
        // Card: stays pending until the customer completes WooCommerce's own
        // order-pay page (see CheckoutComponent in Phase 5).
        'status'         => $isCod ? 'processing' : 'pending',
        'billing'        => $input['billing'] ?? [],
        'shipping'       => $input['billing'] ?? [], // same as billing for now
        'line_items'     => $input['line_items'],
        'shipping_lines' => [[
            'method_id'    => 'flat_rate',
            'method_title' => 'Livrare',
            'total'        => '25.00',
        ]],
        'meta_data'      => [
            ['key' => '_pax_lang', 'value' => $input['lang'] ?? 'ro'],
        ],
    ];

    if ($isCod) {
        // Setting this explicitly is safe and matches WooCommerce's own COD gateway ID.
        $orderPayload['payment_method']       = 'cod';
        $orderPayload['payment_method_title'] = 'Plată ramburs (la livrare)';
    }
    // For card: payment_method is intentionally left unset. WooCommerce Payments'
    // internal gateway ID can vary by plugin version — leaving it unset lets the
    // order-pay page show whichever online gateway is currently enabled, rather
    // than risk a hardcoded ID silently failing to match after a plugin update.

    $result = wcRequest('/orders', 'POST', $orderPayload);

    http_response_code($result['status']);
    echo json_encode($result['body']);
}

function handleGetOrder(string $orderId): void {
    if (empty($orderId) || !is_numeric($orderId)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid order_id']);
        return;
    }

    $result = wcRequest('/orders/' . intval($orderId));
    http_response_code($result['status']);
    echo json_encode($result['body']);
}
```

> **Security note:** Move the `WC_CK` and `WC_CS` constants to a PHP `.env` or a  
> `config.php` file outside the web root — never commit them to git.

---

## 🔧 Phase 2 — Angular WooCommerce Service Layer

### 2.1 Add environment variables

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  wcApiUrl: 'https://wp.sellmotion.ro/wp-json/wc/v3',
  wcConsumerKey: 'ck_YOUR_READ_ONLY_KEY',         // read-only, safe in Angular
  wcConsumerSecret: 'cs_YOUR_READ_ONLY_SECRET',   // ← also needed, see fix in 2.3 below
  proxyUrl: 'https://wp.sellmotion.ro/proxy.php', // for write operations
  apiUrl: 'http://localhost:3000/api',             // kept for future use
};

// src/environments/environment.prod.ts
export const environment = {
  production: true,
  wcApiUrl: 'https://wp.sellmotion.ro/wp-json/wc/v3',
  wcConsumerKey: 'ck_YOUR_READ_ONLY_KEY',
  wcConsumerSecret: 'cs_YOUR_READ_ONLY_SECRET',
  proxyUrl: 'https://wp.sellmotion.ro/proxy.php',
  apiUrl: 'https://wp.sellmotion.ro/api',
};
```

> Use the **Read-only** key pair you generated in 0.4 here — both the key and  
> its secret. These values are otherwise final for the testing phase — no more  
> domain swaps needed until the client's real domain replaces `sellmotion.ro`.

### 2.2 Create WooCommerce interfaces

Create `src/app/core/models/woocommerce.models.ts`:

```typescript
export interface WcImage {
  id: number;
  src: string;
  alt: string;
}

export interface WcCategory {
  id: number;
  name: string;
  slug: string;
}

export interface WcProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  description: string;         // full HTML description
  short_description: string;   // short HTML description
  price: string;               // string e.g. "150.00"
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  purchasable: boolean;
  stock_status: 'instock' | 'outofstock' | 'onbackorder';
  categories: WcCategory[];
  images: WcImage[];
  meta_data: Array<{ key: string; value: string }>;
}

export interface WcOrderLineItem {
  product_id: number;
  quantity: number;
  name?: string;              // populated in response
  price?: number;             // populated in response
  total?: string;             // populated in response
}

export interface WcBilling {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address_1?: string;
  city?: string;
  postcode?: string;
  country: string;            // 'RO'
}

export interface WcOrderPayload {
  line_items: WcOrderLineItem[];
  billing: WcBilling;
  payment_method: 'cod' | 'card';   // ← drives proxy.php branching, see Phase 1.1
  lang?: string;
}

export interface WcOrder {
  id: number;
  status: string;
  total: string;
  order_key: string;        // used to build the order-pay URL for card payments
  billing: WcBilling;
  line_items: WcOrderLineItem[];
}
```

### 2.3 Create WooCommerceService

Create `src/app/core/services/woocommerce.service.ts`:

```typescript
import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { WcProduct, WcCategory, WcOrderPayload, WcOrder } from '../models/woocommerce.models';

@Injectable({ providedIn: 'root' })
export class WooCommerceService {
  private readonly http = inject(HttpClient);
  private readonly platform = inject(PLATFORM_ID);

  // ── Auth params for read-only public API calls ──────────────────────
  // WooCommerce's REST API (/wc/v3/) always requires BOTH consumer_key and
  // consumer_secret — there's no anonymous/secret-less mode, regardless of
  // the key's permission level. "Read-only, safe in Angular" means the
  // *permission scope* is safe to expose, not that the secret can be omitted.
  // Leaving consumer_secret blank (as in earlier drafts of this file) causes
  // every request to fail with 401 Unauthorized.
  private get authParams(): HttpParams {
    return new HttpParams()
      .set('consumer_key', environment.wcConsumerKey)
      .set('consumer_secret', environment.wcConsumerSecret);
  }

  // ── Products ─────────────────────────────────────────────────────────

  getProducts(params: {
    category?: string;  // category slug
    per_page?: number;
    page?: number;
    lang?: string;
  } = {}): Observable<WcProduct[]> {
    let httpParams = this.authParams
      .set('per_page', params.per_page ?? 50)
      .set('page', params.page ?? 1)
      .set('status', 'publish');

    if (params.category) {
      httpParams = httpParams.set('category', params.category);
    }

    return this.http.get<WcProduct[]>(
      `${environment.wcApiUrl}/products`,
      { params: httpParams }
    );
  }

  getProduct(id: number): Observable<WcProduct> {
    return this.http.get<WcProduct>(
      `${environment.wcApiUrl}/products/${id}`,
      { params: this.authParams }
    );
  }

  getCategories(): Observable<WcCategory[]> {
    return this.http.get<WcCategory[]>(
      `${environment.wcApiUrl}/products/categories`,
      { params: this.authParams.set('per_page', 50) }
    );
  }

  // ── Price helper ──────────────────────────────────────────────────────

  parsePrice(product: WcProduct): number {
    return parseFloat(product.price || product.regular_price || '0');
  }

  // ── Orders (via PHP proxy — keeps Write key server-side) ──────────────

  createOrder(payload: WcOrderPayload): Observable<WcOrder> {
    return this.http.post<WcOrder>(
      `${environment.proxyUrl}?action=create_order`,
      payload
    );
  }

  getOrder(orderId: number): Observable<WcOrder> {
    return this.http.get<WcOrder>(
      `${environment.proxyUrl}?action=get_order&order_id=${orderId}`
    );
  }
}
```

---

## 🛍️ Phase 3 — Magazin Page Refactor

### 3.1 Update products.data.ts (keep as fallback/type reference)

The file `src/app/pages/magazin/products.data.ts` changes from being the source of truth  
to a type/category definition file only. Products now come from WooCommerce.

```typescript
// src/app/pages/magazin/products.data.ts
// Products are now fetched from WooCommerce — this file defines UI categories only.

export const CATEGORIES = [
  { id: 'all',        slug: '',              labelKey: 'shop.cat.all' },
  { id: 'coroane',    slug: 'coroane',       labelKey: 'shop.cat.coroane' },
  { id: 'jerbe',      slug: 'jerbe',         labelKey: 'shop.cat.jerbe' },
  { id: 'aranjamente',slug: 'aranjamente',   labelKey: 'shop.cat.aranjamente' },
  { id: 'buchete',    slug: 'buchete',       labelKey: 'shop.cat.buchete' },
];
```

### 3.2 Refactor MagazinComponent

`src/app/pages/magazin/magazin.component.ts` — full replacement:

```typescript
import { Component, inject, signal, computed, OnInit, DestroyRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CATEGORIES } from './products.data';
import { WooCommerceService } from '../../core/services/woocommerce.service';
import { WcProduct } from '../../core/models/woocommerce.models';
import { CartService } from '../../core/services/cart.service';
import { SeoService } from '../../core/services/seo.service';
import { AnimationService } from '../../core/services/animation.service';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';
import { DecimalPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'pax-magazin',
  standalone: true,
  imports: [RevealOnScrollDirective, DecimalPipe, TranslateModule],
  templateUrl: './magazin.component.html',
  styleUrl: './magazin.component.scss',
})
export class MagazinComponent implements OnInit {
  private readonly wc       = inject(WooCommerceService);
  private readonly cart     = inject(CartService);
  private readonly seo      = inject(SeoService);
  private readonly anim     = inject(AnimationService);
  private readonly route    = inject(ActivatedRoute);
  private readonly router   = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly categories      = CATEGORIES;
  readonly activeCategory  = signal<string>('all');
  readonly activeProduct   = signal<WcProduct | null>(null);
  readonly productQty      = signal<number>(1);

  // ── API state ──
  readonly allProducts     = signal<WcProduct[]>([]);
  readonly loading         = signal<boolean>(true);
  readonly error           = signal<string | null>(null);

  readonly filteredProducts = computed(() => {
    const cat = this.activeCategory();
    if (cat === 'all') return this.allProducts();
    const catEntry = CATEGORIES.find(c => c.id === cat);
    if (!catEntry?.slug) return this.allProducts();
    return this.allProducts().filter(p =>
      p.categories.some(c => c.slug === catEntry.slug)
    );
  });

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Magazin Floral | Casa Funerară PAX Târgu Mureș',
      description: 'Aranjamente florale funerare PAX: coroane, jerbe, buchete. Comandă online sau telefonic la 0741 115 864.',
      canonical: 'https://www.sellmotion.ro/magazin', // swap to the client's real domain at go-live
    });

    this.loadProducts();

    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        const cat = params.get('cat');
        this.activeCategory.set(
          cat && CATEGORIES.some(c => c.id === cat) ? cat : 'all'
        );
      });
  }

  private loadProducts(): void {
    this.loading.set(true);
    this.error.set(null);

    this.wc.getProducts({ per_page: 100 })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: products => {
          this.allProducts.set(products);
          this.loading.set(false);
          setTimeout(() => this.anim.staggerFadeUp('.product-card', 50), 50);
        },
        error: () => {
          this.error.set('shop.loadError');
          this.loading.set(false);
        },
      });
  }

  setCategory(id: string): void {
    this.activeCategory.set(id);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { cat: id === 'all' ? null : id },
      replaceUrl: true,
    });
    setTimeout(() => this.anim.staggerFadeUp('.product-card', 50), 50);
  }

  openProduct(product: WcProduct): void {
    this.productQty.set(1);
    this.activeProduct.set(product);
  }

  closeProduct(): void {
    this.activeProduct.set(null);
  }

  increment(): void { this.productQty.update(q => q + 1); }
  decrement(): void { this.productQty.update(q => Math.max(1, q - 1)); }

  getPrice(product: WcProduct): number {
    return this.wc.parsePrice(product);
  }

  getImage(product: WcProduct): string {
    return product.images?.[0]?.src ?? 'assets/images/placeholder.jpg';
  }

  addToCart(product: WcProduct): void {
    this.cart.addItem({
      productId:  String(product.id),
      wcProductId: product.id,           // needed for order creation
      name:       product.name,
      price:      this.wc.parsePrice(product),
      qty:        this.productQty(),
      image:      this.getImage(product),
    });
    this.closeProduct();
    this.cart.openDrawer();
  }

  addToCartDirect(product: WcProduct, event: MouseEvent): void {
    event.stopPropagation();
    this.cart.addItem({
      productId:  String(product.id),
      wcProductId: product.id,
      name:       product.name,
      price:      this.wc.parsePrice(product),
      qty:        1,
      image:      this.getImage(product),
    });
    this.cart.openDrawer();
  }

  onOverlayClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('product-modal-overlay')) {
      this.closeProduct();
    }
  }

  onKeydown(e: KeyboardEvent): void {
    if (e.key === 'Escape') this.closeProduct();
  }
}
```

### 3.3 Update magazin.component.html

Replace product card and modal sections to use `WcProduct` fields:

```html
<!-- Loading state -->
@if (loading()) {
  <div class="products-loading" aria-live="polite">
    <div class="loading-spinner" aria-hidden="true"></div>
    <p>{{ 'shop.loading' | translate }}</p>
  </div>
}

<!-- Error state -->
@if (error()) {
  <div class="products-error">
    <p>{{ error()! | translate }}</p>
    <button type="button" class="cta-btn-ghost" (click)="loadProducts()">
      {{ 'shop.retry' | translate }}
    </button>
  </div>
}

<!-- Product grid — use WcProduct fields -->
@if (!loading() && !error()) {
  <div class="products-grid">
    @for (product of filteredProducts(); track product.id) {
      <article class="product-card"
        (click)="openProduct(product)"
        role="button" tabindex="0"
        (keydown.enter)="openProduct(product)">

        <div class="product-image-wrap">
          @if (product.images?.length) {
            <img [src]="getImage(product)"
                 [alt]="product.name"
                 loading="lazy"
                 class="product-img">
          } @else {
            <div class="product-image-placeholder" aria-hidden="true">💐</div>
          }
        </div>

        <div class="product-info">
          <h3 class="product-name">{{ product.name }}</h3>
          <p class="product-short"
             [innerHTML]="product.short_description"></p>
          <div class="product-footer">
            <span class="product-price">
              {{ getPrice(product) | number:'1.0-0' }} RON
            </span>
            <button type="button" class="add-btn"
              (click)="addToCartDirect(product, $event)"
              [attr.aria-label]="('common.addToCart' | translate) + ' ' + product.name">
              +
            </button>
          </div>
        </div>
      </article>
    }
  </div>
}

<!-- Product modal — same structure, WcProduct fields -->
@if (activeProduct(); as p) {
  <div class="product-modal-overlay"
       (click)="onOverlayClick($event)"
       tabindex="-1" aria-hidden="true"></div>

  <div class="product-modal-panel"
       role="dialog"
       [attr.aria-label]="p.name"
       tabindex="0"
       (keydown)="onKeydown($event)">

    <button class="modal-close" type="button"
      (click)="closeProduct()"
      [attr.aria-label]="'common.close' | translate">✕</button>

    <div class="product-modal-body">
      <div class="product-modal-image">
        @if (p.images?.length) {
          <img [src]="getImage(p)" [alt]="p.name" class="modal-img">
        } @else {
          <span aria-hidden="true">💐</span>
        }
      </div>
      <div class="product-modal-info">
        <h2>{{ p.name }}</h2>
        <p class="product-modal-price">{{ getPrice(p) | number:'1.0-0' }} RON</p>
        <div [innerHTML]="p.description" class="product-modal-desc"></div>

        <div class="qty-row">
          <button type="button" class="qty-btn" (click)="decrement()"
            [attr.aria-label]="'cart.decreaseQty' | translate">−</button>
          <span class="qty-val" aria-live="polite">{{ productQty() }}</span>
          <button type="button" class="qty-btn" (click)="increment()"
            [attr.aria-label]="'cart.increaseQty' | translate">+</button>
        </div>

        <button type="button" class="cta-btn-primary full-w"
          (click)="addToCart(p)">
          {{ 'common.addToCart' | translate }}
          — {{ getPrice(p) * productQty() | number:'1.0-0' }} RON
        </button>
      </div>
    </div>
  </div>
}
```

---

## 🛒 Phase 4 — CartService Update

### 4.1 Add `wcProductId` to CartItem

Update `src/app/core/services/cart.service.ts`:

```typescript
export interface CartItem {
  productId:    string;
  wcProductId:  number;    // ← NEW: WooCommerce product ID for order creation
  name:         string;
  price:        number;
  qty:          number;
  image:        string;
}
// ... rest of CartService unchanged
```

---

## 💳 Phase 5 — Checkout Page

### 5.1 Add checkout route to `app.routes.ts`

```typescript
{
  path: 'checkout',
  loadComponent: () =>
    import('./pages/checkout/checkout.component').then(m => m.CheckoutComponent),
},
{
  path: 'payment/result',
  loadComponent: () =>
    import('./pages/payment-result/payment-result.component').then(m => m.PaymentResultComponent),
},
```

### 5.2 Create CheckoutComponent

> **How this differs from a Revolut-style flow:** default WooCommerce gateways don't  
> return a custom checkout URL from the REST API. So the two payment methods now  
> branch completely:
> - **COD** — nothing to pay online. Order is created as `processing`, customer never  
>   leaves Angular, success page shows immediately.
> - **Card (WooCommerce Payments)** — order is created as `pending`, then the browser  
>   redirects to WooCommerce's own native order-pay page, where the WooCommerce  
>   Payments card form actually lives ("the classic way" — Angular doesn't build a  
>   custom Stripe Elements form). The customer completes payment there and lands on  
>   WooCommerce's own thank-you page, not back on Angular's `/payment/result` — see  
>   the note after the code for an optional enhancement if you want that bounce-back.

Create `src/app/pages/checkout/checkout.component.ts`:

```typescript
import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DecimalPipe } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { WooCommerceService } from '../../core/services/woocommerce.service';
import { TranslationService } from '../../core/services/translation.service';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'pax-checkout',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule, DecimalPipe],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent implements OnInit {
  private readonly fb     = inject(FormBuilder);
  private readonly cart   = inject(CartService);
  private readonly wc     = inject(WooCommerceService);
  private readonly i18n   = inject(TranslationService);
  private readonly router = inject(Router);
  private readonly seo    = inject(SeoService);

  readonly cartItems   = this.cart.cartItems;
  readonly subtotal    = this.cart.subtotal;
  readonly deliveryFee = this.cart.deliveryFee;
  readonly total       = this.cart.total;

  readonly submitting  = signal(false);
  readonly error       = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    first_name:     ['', [Validators.required, Validators.minLength(2)]],
    last_name:      ['', [Validators.required, Validators.minLength(2)]],
    email:          ['', [Validators.required, Validators.email]],
    phone:          ['', Validators.required],
    address_1:      [''],
    city:           [''],
    postcode:       [''],
    payment_method: ['cod' as 'cod' | 'card', Validators.required],
  });

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Finalizează Comanda | Casa Funerară PAX',
      description: 'Finalizează comanda ta online.',
    });

    // Redirect to shop if cart is empty
    if (this.cart.itemCount() === 0) {
      this.router.navigate(['/magazin']);
    }
  }

  submit(): void {
    if (this.form.invalid || this.submitting()) return;

    this.submitting.set(true);
    this.error.set(null);

    const v = this.form.getRawValue();

    const orderPayload = {
      billing: {
        first_name: v.first_name,
        last_name:  v.last_name,
        email:      v.email,
        phone:      v.phone,
        address_1:  v.address_1,
        city:       v.city,
        postcode:   v.postcode,
        country:    'RO',
      },
      line_items: this.cart.cartItems().map(item => ({
        product_id: item.wcProductId,
        quantity:   item.qty,
      })),
      payment_method: v.payment_method,
      lang: this.i18n.currentLang(),
    };

    this.wc.createOrder(orderPayload).subscribe({
      next: (order) => {
        this.cart.clear();

        if (v.payment_method === 'cod') {
          // Nothing to pay online — stay inside Angular and show success directly.
          this.router.navigate(['/payment/result'], {
            queryParams: { status: 'success', orderId: order.id },
          });
        } else {
          // Card — hand off to WooCommerce's own order-pay page (WooCommerce
          // Payments form lives there). This is the final host now that the
          // domain migration to wp.sellmotion.ro is complete.
          window.location.href =
            `https://wp.sellmotion.ro/checkout/order-pay/${order.id}/?pay_for_order=true&key=${order.order_key}`;
        }
      },
      error: () => {
        this.error.set('checkout.orderError');
        this.submitting.set(false);
      },
    });
  }
}
```

Add the payment method radios to `checkout.component.html` (alongside the existing form fields):

```html
<fieldset class="payment-method-group">
  <legend>{{ 'checkout.paymentMethod' | translate }}</legend>

  <label class="payment-option">
    <input type="radio" formControlName="payment_method" value="cod">
    <span>{{ 'checkout.cod' | translate }}</span>
  </label>

  <label class="payment-option">
    <input type="radio" formControlName="payment_method" value="card">
    <span>{{ 'checkout.card' | translate }}</span>
  </label>
</fieldset>
```

> **Optional enhancement (not required for testing):** to bring card-paying  
> customers back to Angular's nicer `/payment/result` page instead of WooCommerce's  
> native thank-you page, hook `woocommerce_thankyou` in a small mu-plugin and  
> `wp_redirect()` to wherever Angular's `/payment/result` route is actually reachable —  
> during testing that's the GitHub Pages demo  
> (`https://gunrazer9.github.io/PaxFunerarWebsite/payment/result?status=success&orderId={id}`),  
> and `https://sellmotion.ro/payment/result?...` once Angular deploys to the root domain.  
> Worth doing closer to client go-live, skip it for now.

### 5.3 Create PaymentResultComponent

Create `src/app/pages/payment-result/payment-result.component.ts`:

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'pax-payment-result',
  standalone: true,
  imports: [RouterLink, TranslateModule],
  template: `
    <section class="result-page container">
      @if (status === 'success') {
        <div class="result-success">
          <span class="result-icon" aria-hidden="true">✓</span>
          <h1>{{ 'checkout.successTitle' | translate }}</h1>
          <p>{{ 'checkout.successText' | translate }}</p>
          <a routerLink="/" class="cta-btn-primary">{{ 'nav.home' | translate }}</a>
        </div>
      } @else {
        <div class="result-failure">
          <span class="result-icon result-icon--fail" aria-hidden="true">✕</span>
          <h1>{{ 'checkout.failTitle' | translate }}</h1>
          <p>{{ 'checkout.failText' | translate }}</p>
          <a routerLink="/magazin" class="cta-btn-primary">{{ 'nav.shop' | translate }}</a>
        </div>
      }
    </section>
  `,
  styles: [`
    .result-page {
      min-height: 60vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-block: var(--space-16);
    }
    .result-success, .result-failure {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: var(--space-6);
    }
    .result-icon {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: rgba(74,124,89,0.2);
      color: var(--color-success);
      font-size: var(--text-3xl);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .result-icon--fail {
      background: rgba(139,58,58,0.2);
      color: var(--color-error);
    }
  `],
})
export class PaymentResultComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  status = 'success';

  ngOnInit(): void {
    this.status = this.route.snapshot.queryParamMap.get('status') ?? 'success';
  }
}
```

---

## 🌐 Phase 6 — i18n for Product Content

> **Status check:** the live `ro.json`/`hu.json` still have the *original* shop category  
> keys (`lumanari`, `coroane`, `urne`, `fotoceramica`, `sicrie`, `accesorii`) from the  
> pre-WooCommerce `products.data.ts` catalog — `jerbe`, `aranjamente`, and `buchete`  
> aren't in there yet, and there's no `checkout.*` block at all. The JSON below is what  
> needs merging into the existing `shop` object (don't delete the old category keys yet  
> in case the original product set is reused elsewhere — just add the new ones alongside).

Products in WooCommerce are stored in Romanian by default (the primary language).  
The Angular i18n system (`ngx-translate`) handles UI strings only.  
Product names and descriptions come directly from WooCommerce in Romanian.

### 6.1 Add new i18n keys to `ro.json` and `hu.json`

Add to `src/assets/i18n/ro.json`:

```json
{
  "shop": {
    "loading": "Se încarcă produsele...",
    "loadError": "Nu s-au putut încărca produsele. Vă rugăm reîncercați.",
    "retry": "Reîncercați",
    "floralNote": "Aranjamente florale: 0741 115 864",
    "cat": {
      "all": "Toate",
      "coroane": "Coroane Florale",
      "jerbe": "Jerbe",
      "aranjamente": "Aranjamente",
      "buchete": "Buchete"
    },
    "products": {}
  },
  "checkout": {
    "title": "Finalizează Comanda",
    "firstName": "Prenume",
    "lastName": "Nume",
    "email": "Email",
    "phone": "Telefon",
    "address": "Adresă (opțional)",
    "city": "Oraș (opțional)",
    "postcode": "Cod Poștal (opțional)",
    "paymentMethod": "Metoda de plată",
    "cod": "Plată ramburs (la livrare)",
    "card": "Card online",
    "orderSummary": "Sumar Comandă",
    "placeOrder": "Plătește",
    "orderError": "A apărut o eroare. Vă rugăm reîncercați sau contactați-ne.",
    "successTitle": "Comandă plasată cu succes!",
    "successText": "Veți primi un email de confirmare în scurt timp.",
    "failTitle": "Plata nu a fost procesată",
    "failText": "Comanda nu a fost finalizată. Vă rugăm încercați din nou."
  }
}
```

Add Hungarian equivalents to `hu.json`.

---

## 🚀 Phase 7 — Deployment Configuration

### 7.1 WooCommerce checkout/thank-you pages

With the default gateways there are no custom success/cancel redirect URLs to  
configure (that was specific to the Revolut plugin). WooCommerce uses its own  
built-in pages:

- WooCommerce Admin → Settings → Advanced → Page setup: confirm **Checkout** and  
  **Cart** pages exist (created automatically on WooCommerce install, no changes needed)
- Card payments land the customer on WooCommerce's own `/checkout/order-received/{id}/`  
  page after WooCommerce Payments processes the card — this is expected with the  
  "classic" approach and is fine for testing
- COD never reaches these pages at all — Angular shows its own `/payment/result` directly

If you later add the optional `woocommerce_thankyou` redirect hook mentioned in  
Phase 5.2, this is also where you'd point it back at Angular's domain.

### 7.2 Angular build for Hostico

```bash
# Build for production
ng build --configuration production

# Deploy to Hostico via FTP or cPanel File Manager
# Upload dist/pax-funerar/browser/ contents to public_html/
```

For SSR on Hostico, check if your plan supports Node.js. If not, build as SPA:

```bash
# SPA-only build (no SSR) — works on any PHP hosting
ng build --configuration production --no-ssr
```

Update `angular.json` base href if deploying to a subfolder:

```json
"baseHref": "/"
```

### 7.3 `.htaccess` for Angular SPA routing on sellmotion.ro

> Now that WordPress has moved to `wp.sellmotion.ro`, nothing under `/wp/`, `/wp-json/`,  
> or `/proxy.php` should exist on the `sellmotion.ro` root anymore (confirm this — see  
> the open item under "🔜 Domain Migration — Status"), so the rules below don't need  
> to exclude them.

Create/update `public_html/.htaccess` (use Option B from 0.5 to reveal it if needed):

```apache
# Angular SPA routing
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Serve existing files/dirs directly
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]

  # Route everything else to Angular
  RewriteRule ^ index.html [L]
</IfModule>
```

---

## 🔐 Security Checklist

Before going live, verify:

- [ ] WC Write consumer_secret is ONLY in `proxy.php`, never in Angular source
- [ ] `proxy.php` validates input before passing to WC API (done in Phase 1)
- [ ] `proxy.php` is not accessible from wp-admin directory listing
- [ ] WooCommerce Payments uses its own WooCommerce.com-connected account — confirm no Stripe/API keys ever get typed into Angular code or `proxy.php`
- [ ] `.env` or `config.php` with credentials is above the web root or denied in `.htaccess`
- [ ] WooCommerce → Settings → Advanced → REST API: Read key uses minimum permissions
- [ ] `pax-cors.php` and `proxy.php` whitelists are in sync and only contain origins you actually use (no `*`)
- [ ] SSL certificate active on `wp.sellmotion.ro` (confirm HTTPS resolves with no certificate warnings)

---

## 🧪 Testing Checklist Per Phase

### Phase 0 (WooCommerce)
- [ ] `wp.sellmotion.ro/wp-admin` loads and is accessible
- [ ] WooCommerce is active, RON currency set
- [ ] Cash on Delivery enabled in WooCommerce → Settings → Payments
- [ ] WooCommerce Payments connected via WooCommerce.com and showing Enabled
- [ ] At least 3 test products created with images and prices
- [ ] REST API keys generated (Read key + Write key noted separately)
- [ ] `GET wp.sellmotion.ro/wp-json/wc/v3/products?consumer_key=ck_...` returns product JSON
- [ ] `wp-content/mu-plugins/pax-cors.php` created and saved
- [ ] Same `GET` request above shows `Access-Control-Allow-Origin` header in browser dev tools (Network tab → response headers) when called from an origin in the whitelist

### Phase 1 (Proxy)
- [ ] `POST wp.sellmotion.ro/proxy.php?action=create_order` with `payment_method: 'cod'` returns a WC order with status `processing`
- [ ] Same call with `payment_method: 'card'` returns a WC order with status `pending` plus an `order_key`
- [ ] CORS headers present on both: `Access-Control-Allow-Origin` matching the calling origin

### Phase 2–3 (Angular)
- [ ] `ng serve` — Magazin page shows real products from WooCommerce
- [ ] Category filters work
- [ ] Product images load
- [ ] Product modal opens with correct price and description
- [ ] "Add to cart" opens drawer with correct item

### Phase 4–5 (Checkout)
- [ ] Checkout page shows cart summary and a payment method choice (COD / Card)
- [ ] **COD path:** submitting creates the order, cart clears, and Angular navigates straight to `/payment/result?status=success` — no redirect to WordPress at all
- [ ] **Card path:** submitting creates the order, cart clears, then the browser redirects to `wp.sellmotion.ro/checkout/order-pay/{id}/...`
- [ ] On that page, WooCommerce Payments' card form is visible and a test card completes payment
- [ ] WooCommerce admin shows both test orders (COD and card) with correct statuses

### Phase 7 (Production)
- [ ] Old WordPress files removed from the `sellmotion.ro` root (the migration itself is already done) before this phase begins
- [ ] Production build deployed to `sellmotion.ro` root
- [ ] All Angular routes work (`.htaccess` SPA routing)
- [ ] Shop loads real products from `wp.sellmotion.ro`
- [ ] Full checkout flow works end-to-end for both COD and card on the live domain

---

## 🐛 Known Issues & Solutions

| Issue | Cause | Fix |
|---|---|---|
| `.htaccess` missing from File Manager | Hostico hides dotfiles by default (standard cPanel behavior) | Use the `mu-plugins/pax-cors.php` fix in 0.5 — avoids `.htaccess` entirely. For Phase 7 SPA routing, enable "Show Hidden Files (dotfiles)" in File Manager Settings |
| CORS error on product fetch | No CORS headers on REST API responses, or calling origin isn't in the whitelist | Confirm `pax-cors.php` is saved inside `wp-content/mu-plugins/` (not `wp-content/plugins/`), and that the calling origin is listed in both `pax-cors.php` and `proxy.php` |
| Order-pay page shows 404 | WooCommerce permalinks not flushed after WordPress migration | WordPress Settings → Permalinks → Save (no changes needed, just re-saving flushes the rewrite rules) |
| Card payment redirect lands on wrong domain | `proxy.php`/Angular still pointing at the pre-migration host | Re-check `proxy.php`, `pax-cors.php`, `environment.ts`/`environment.prod.ts`, and the `CheckoutComponent` redirect — all should read `wp.sellmotion.ro` now |
| Products not showing | REST API key wrong | Test with Postman first using full URL + keys |
| SSR fails on Hostico | No Node.js on shared hosting | Build with `--no-ssr` flag |
| Cart items missing `wcProductId` | Old CartItem interface | Run Phase 4 update before Phase 5 |
| Images not loading | Hostico SSL on subdomain | Ensure the WordPress host has SSL active |

---

## 📋 Session Resume Template

```
Project: PaxFunerar WooCommerce Integration
Plan: See WOOCOMMERCE_INTEGRATION.md in project root
Current phase: Phase 0 — domain migration done, WooCommerce reconfigured on the
  new install; REST API keys + CORS + payment gateways still pending
WC URL (live): https://wp.sellmotion.ro
WC REST API base: https://wp.sellmotion.ro/wp-json/wc/v3
Proxy URL: https://wp.sellmotion.ro/proxy.php (not yet created — Phase 1, blocked
  on the write key from 0.4)
Angular currently on: GitHub Pages demo (moves to sellmotion.ro root once the old
  WordPress files there are confirmed removed)
Products created: 4 floral products (Coroane, Jerbe, Aranjamente, Buchete) on
  wp.sellmotion.ro — verify category slugs before building Phase 3.1's
  CATEGORIES array
Last interface step done: WooCommerce plugin install + setup wizard on
  wp.sellmotion.ro
Blocked by: nothing — next 3 steps are manual wp-admin work (0.3 payment
  gateways, 0.4 REST API keys, 0.5 CORS mu-plugin), not code
Next task: once REST API keys exist, build proxy.php per Phase 1.1, then start
  Phase 2 (Angular service layer)

Key facts:
- Read-only WC key is safe in Angular (environment.ts)
- Write WC key ONLY in proxy.php on Hostico — never in Angular
- Payment methods: Cash on Delivery + WooCommerce Payments (no Revolut plugin,
  no custom API keys to manage — WooCommerce Payments account lives on
  WooCommerce.com)
- COD orders never leave Angular (status set to "processing" immediately,
  Angular shows success directly)
- Card orders redirect to WooCommerce's own order-pay page — that's where the
  WooCommerce Payments card form lives, not a custom Angular form
- CartItem needs a wcProductId: number field added (Phase 4 — not done yet)
- Products come from WC API, not products.data.ts
- i18n: UI strings in ngx-translate, product text from WooCommerce in RO; ro.json/
  hu.json still need the Phase 6 additions merged in (shop.loading/loadError/
  retry/floralNote, shop.cat.jerbe/aranjamente/buchete, and the whole checkout.*
  block) — not done yet
- CORS fix is the wp-content/mu-plugins/pax-cors.php approach (not .htaccess —
  Hostico hides dotfiles in File Manager by default); uses an origin whitelist
  since Angular currently calls from both GitHub Pages and localhost — needs
  uploading fresh to wp.sellmotion.ro, doesn't carry over from before
- Product category base left as default "product-category" — confirmed harmless
- Domain migration is DONE: WordPress lives on wp.sellmotion.ro (fresh install,
  not a file move). Open item: confirm the old install at the sellmotion.ro root
  has been removed before Angular deploys there.
```

---

*Last updated: 2026-06-17 — PaxFunerar WooCommerce Headless Integration Plan*
