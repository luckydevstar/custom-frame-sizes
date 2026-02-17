# Migration Status & Shopify Readiness

**Purpose:** Single place for current migration status and Shopify migration plan. Use with `docs/REQUIREMENTS_AND_PROJECT_CONTEXT.md` for full context.

---

## 1. Project scan summary

### 1.1 Apps

| App         | Purpose                                   | Notes                                                                                                                                                            |
| ----------- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **store-a** | Next.js storefront (CustomFrameSizes.com) | 63 page routes; local API routes: `/api/asset`, `/api/frames/[sku]/photos`, `/api/business-quote`. No `/api/cart` or `/api/checkout`.                            |
| **api**     | Vercel serverless BFF                     | Cart + checkout: `POST /api/cart`, `PATCH /api/cart/lines`, `POST /api/checkout`. Uses `@framecraft/core` Storefront API; `ensureStoreConfig(storeId)` from env. |

### 1.2 Packages

| Package    | Role                                                                                                                                                                                                       |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **core**   | Products (from data + Shopify helpers), pricing, **Shopify** (storefront client, cart, products, fragments, serialization), cart store (Zustand), services (shopify.ts: addToCart, isShopifyEnabled, etc.) |
| **ui**     | Shared UI and all specialty designers (Frame, Shadowbox, Canvas, Certificate, Diploma, etc.)                                                                                                               |
| **data**   | Static JSON: frames.json, mats.json, glass.json, pricing-config.json. All frames have `shopifyVariantId: null`.                                                                                            |
| **types**  | Frame, mat, product, cart-related types; `shopifyVariantId` on product types.                                                                                                                              |
| **config** | Store/config and theming.                                                                                                                                                                                  |
| **db**     | Schema and migrations (e.g. order_files with shopify_order_id).                                                                                                                                            |

### 1.3 Page migration (UI)

- **Migrated (UI):** Frames (colors, sizes, styles), shadowbox, canvas, diploma/certificate, specialty (jersey, puzzle, comic, playbill, record album, etc.), picture-frames, samples, military, components, content (about, blog, contact, FAQ, policies, etc.). Dozens of pages under `apps/store-a/src/app/`.
- **Data source:** All product/catalog data is from **static JSON** (`@framecraft/data`). No pages currently fetch products or collections from Shopify Storefront API.

---

## 2. Shopify: what’s already there

### 2.1 Core Storefront layer (`packages/core/src/shopify/`)

- **storefront-client.ts** – GraphQL client (query/mutation), retries, errors.
- **store-config.ts** – In-memory registry (storeId → domain, accessToken, apiVersion). Populated server-side by API’s `ensureStoreConfig(storeId)` from env; **not** populated in the browser unless store-a (or another app) registers config from `NEXT_PUBLIC_*`.
- **fragments.ts** – GraphQL fragments for product, variant, collection, cart.
- **products.ts** – `getProductByHandle`, `getCollection`, `searchProducts` (and raw variants). Ready for when catalog is in Shopify.
- **cart.ts** – `createCart`, `addCartLines`, `updateCartLines`, `removeCartLines`, `getCart`. Used by API and by **cart-store** (see below).
- **serialization.ts** – Frame/specialty config → line item attributes for cart.

### 2.2 API BFF (`apps/api`)

- **POST /api/cart** – Creates cart via Storefront API; sets HTTP-only cookie with cart ID; accepts `storeId` + optional `lines`.
- **PATCH /api/cart/lines** – Add/update/remove lines; reads cart ID from cookie; requires `storeId` (body or `X-Store-ID`).
- **POST /api/checkout** – Returns checkout URL for current cart (from cookie); optional discount code and email.
- Env: `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_TOKEN` (and per-store `_store_a` variants). No token in browser.

### 2.3 Cart store (`packages/core/src/stores/cart-store.ts`)

- Zustand store: add/remove/update quantity, persistence, **sync with Shopify**.
- **Sync implementation:** Calls `createCart`, `addCartLines`, `updateCartLines`, `removeCartLines` from `@framecraft/core` **directly** (i.e. from the client). So it expects either (a) Storefront config registered in the browser, or (b) to be refactored to call the BFF (`/api/cart`, `/api/cart/lines`) instead. Today no store-a bootstrap registers store config for the client.

### 2.4 “Add to cart” in designers (`packages/core/src/services/shopify.ts`)

- **addToCart(config, price, quantity)** – Uses **deprecated** `checkoutCreate` mutation and redirects to `checkout.webUrl`. Does **not** use the Cart API or the BFF. Variant ID from `NEXT_PUBLIC_SHOPIFY_FRAME_VARIANT_ID` or `frame.shopifyVariantId` (all null in data).
- **isShopifyEnabled()** – True when `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` and `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN` are set.
- Certificate/Diploma designers: when Shopify is **disabled** they call `apiRequest("POST", "/api/cart", config)`. Store-a has **no** `/api/cart` route, so that request would 404 unless the frontend is pointed at the API app.

---

## 3. Gaps for Shopify migration

| Gap                                 | Detail                                                                                                                                                                                                                                                                      |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1. Products in Shopify**          | Frames/mats/etc. exist only in static JSON. No Shopify products/variants created yet (or not linked). `shopifyVariantId` is null for all frames.                                                                                                                            |
| **2. Variant ID for checkout**      | Need at least one Shopify product/variant for “Custom Frame” (and optionally mat, etc.) and set `NEXT_PUBLIC_SHOPIFY_FRAME_VARIANT_ID` or populate `shopifyVariantId` in data.                                                                                              |
| **3. Store-a → BFF wiring**         | Store-a does not expose `/api/cart` or `/api/checkout`. Options: (a) add rewrites in store-a to proxy to the API app, or (b) deploy API under same origin. Cookie domain must allow the storefront to send cart cookie to the API.                                          |
| **4. Single cart/checkout path**    | Designers currently use legacy `addToCart` (checkoutCreate + redirect). Target: use BFF (create/update cart via API, then redirect using POST /api/checkout URL). Cart store can either call BFF or remain client-side with Storefront token; architecture doc prefers BFF. |
| **5. Cart store vs BFF**            | Cart store syncs by calling core’s Shopify cart APIs from the client. For “server-side BFF only” the store should call `/api/cart` and `/api/cart/lines` and use the cookie set by the API.                                                                                 |
| **6. Certificate/Diploma fallback** | When Shopify is off they POST to `/api/cart` with a **config** object; BFF expects `{ storeId, lines }` with `merchandiseId`, `quantity`, `attributes`. Payload and route need aligning.                                                                                    |

---

## 4. Recommended order for Shopify migration

1. **Shopify catalog (product/variant)**  
   Create at least one product in Shopify (e.g. “Custom Picture Frame”) with one variant. Note the variant GID and set `NEXT_PUBLIC_SHOPIFY_FRAME_VARIANT_ID` (and/or start filling `shopifyVariantId` in data if you map per frame).

2. **Wire store-a to the API BFF**
   - Either: rewrites in store-a so `/api/cart` and `/api/cart/lines` and `/api/checkout` proxy to the deployed API app (same domain or CORS + cookie domain).
   - Or: mount API routes under the same Next.js app (e.g. route handlers that call the same serverless logic).  
     Ensure the cookie set by the API is sent on subsequent requests from the storefront.

3. **Unify checkout flow on BFF**
   - Replace designer “add to cart” usage of `addToCart` (checkoutCreate) with:
     - Call BFF to create or update cart (add line with variant ID + serialized attributes), then either redirect to checkout URL from BFF or open cart and then “Checkout” → POST /api/checkout → redirect.
   - Optionally use the existing cart store as the source of truth and have it call the BFF instead of core’s Storefront client.

4. **Optional: product/collection from Shopify**  
   When you want dynamic catalog: use `getProductByHandle` / `getCollection` from core for key pages and gradually replace static JSON where it makes sense (e.g. PDP, collection listings). Keep static data as fallback or for non-Shopify fields until full cutover.

5. **SEO / redirects**  
   Per requirements: URL parity, 301 map, canonicals, meta and structured data (can be done in parallel or after cart/checkout works).

---

## 5. Quick reference

- **Requirements & context:** `docs/REQUIREMENTS_AND_PROJECT_CONTEXT.md`
- **Original (behavior/content):** CustomFrameSizes-CODE
- **Migrated (implementation):** this repo (`custom-frame-sizes`)
- **Env examples:** `env.example`, `apps/store-a/.env.local.example`, `apps/api/README.md`

---

_Last updated from full project scan – use this doc to start Shopify migration and align cart/checkout with the BFF._
