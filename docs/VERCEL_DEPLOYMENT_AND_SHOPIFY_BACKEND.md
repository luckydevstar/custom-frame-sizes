# Vercel Deployment & Shopify Backend Checkout

This guide covers:

1. **Deploying the monorepo on Vercel** (store-a + API as separate projects)
2. **Implementing business checkout via the backend** (cart + checkout with Shopify)

---

## 1. Architecture Overview

- **Store A** (`apps/store-a`): Next.js storefront. Users configure frames and add to cart; checkout can go through your backend API or (currently) client-side Shopify.
- **API** (`apps/api`): Vercel serverless API. Creates Shopify carts and checkout URLs using the **Storefront API** (credentials stay server-side). Sets cart ID in HTTP-only cookie; frontend redirects to `checkoutUrl`.

**Checkout flow with backend:**

1. User clicks “Add to Cart” in a frame designer.
2. Frontend sends frame config to **POST /api/cart** (your API) with `storeId` and cart `lines` (variant ID + quantity + custom attributes).
3. API creates a cart via Shopify Storefront API, sets cart ID cookie, returns `cartId` and `checkoutUrl`.
4. Frontend redirects to `checkoutUrl` (Shopify-hosted checkout) or stores cart and later calls **POST /api/checkout** to get the URL.

---

## 2. Vercel Setup: Two Projects (Recommended)

Use **two Vercel projects** in the same repo: one for the storefront, one for the API.

### Project 1: Storefront (Store A)

1. In Vercel: **Add New Project** → Import your repo.
2. **Root Directory:** `apps/store-a`
3. **Framework Preset:** Next.js
4. **Build Command:** `npm run build` (or leave default; run from repo root with `turbo run build --filter=@framecraft/store-a` if you build from root)
5. **Install Command:** `npm install` (from repo root so workspaces resolve: set **Root Directory** to repo root and **Override** build to `cd apps/store-a && npm install && npm run build`, or use Vercel’s monorepo detection)

**Recommended:** Set **Root Directory** to the repo root (leave empty or `.`). Then:

- **Build Command:** `npx turbo run build --filter=@framecraft/store-a`
- **Output Directory:** `apps/store-a/.next`
- **Install Command:** `npm install`

(If your Turbo is set up to build store-a and output to `apps/store-a/.next`, use that. Otherwise set Root Directory to `apps/store-a`, Build Command `npm run build`, and Vercel will run `npm install` in `apps/store-a`.)

6. **Environment variables** (Vercel → Project → Settings → Environment Variables):
   - `NEXT_PUBLIC_SITE_ID=store-a`
   - `NEXT_PUBLIC_API_URL=https://<your-api-project>.vercel.app` (see Project 2)
   - `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=<store>.myshopify.com`
   - `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=<token>`
   - `NEXT_PUBLIC_SHOPIFY_API_VERSION=2024-01`
   - `NEXT_PUBLIC_SHOPIFY_FRAME_VARIANT_ID=gid://shopify/ProductVariant/xxxxx` (optional; for custom frame product)
   - Any CDN/Sentry vars from `apps/store-a/.env.local.example`

### Project 2: API (Backend for Cart/Checkout)

1. **Add New Project** again → same repo.
2. **Root Directory:** `apps/api`
3. **Framework Preset:** Other (or leave default).
4. **Build Command:** `npm run build` (or `npx turbo run build --filter=@framecraft/api` if root is repo root).
5. **Output Directory:** leave empty (serverless).
6. **Environment variables** (required for Shopify):
   - `SHOPIFY_STORE_DOMAIN=<store>.myshopify.com`
   - `SHOPIFY_STOREFRONT_TOKEN=<Storefront API access token>`
   - `SHOPIFY_API_VERSION=2024-01` (optional; default 2024-01)

   For **multiple stores** (e.g. store-a and store-b):
   - `SHOPIFY_STORE_DOMAIN_store_a=<store-a>.myshopify.com`
   - `SHOPIFY_STOREFRONT_TOKEN_store_a=<token-for-store-a>`
   - (same with `store_b`, etc.; store ID in URL is normalized: `store-a` → `store_a` in env key.)

7. **CORS:** If the storefront is on a different domain, configure CORS in the API (e.g. in `route-handler` or per-route) to allow the storefront origin.

After deployment, set the storefront’s `NEXT_PUBLIC_API_URL` to the API project URL (e.g. `https://your-api.vercel.app`). No path prefix needed if API routes are at `/api/cart`, `/api/checkout` (your `vercel.json` rewrites `/api/:path*` to the route handlers).

---

## 3. API Routes and Store Config

The API uses **serverless functions** under `apps/api/src/routes/`:

- **POST /api/cart** – Create cart (body: `storeId`, optional `lines[]` with `merchandiseId`, `quantity`, `attributes[]`). Sets HTTP-only cookie with cart ID.
- **PATCH /api/cart/lines** – Add/update/remove lines (body: `storeId`, `operation`, `lines`). Requires cart ID in cookie.
- **POST /api/checkout** – Return checkout URL for the cart (body: `storeId`, optional `discountCode`, `customerEmail`). Requires cart ID in cookie.

Shopify credentials are **not** in the frontend. The API registers store config from env when handling a request (see `apps/api/src/lib/store-config.ts`):

- `ensureStoreConfig(storeId)` reads `SHOPIFY_STORE_DOMAIN` / `SHOPIFY_STOREFRONT_TOKEN` (or `SHOPIFY_STORE_DOMAIN_<store_id>`, `SHOPIFY_STOREFRONT_TOKEN_<store_id>` for multi-store) and registers the store with `@framecraft/core` so cart/checkout calls work.

---

## 4. Business Checkout Logic: Use the Backend

To run **all** checkout logic through your backend (recommended for business rules, validation, logging):

### 4.1 Frontend: Call API Instead of Client-Side Shopify

- **Add to cart:**
  - Serialize the frame configuration into Shopify line items (variant ID + quantity + custom attributes for options).
  - `POST` to `NEXT_PUBLIC_API_URL/cart` with `{ storeId: "store-a", lines: [ { merchandiseId, quantity, attributes } ] }`.
  - API creates the cart, sets the cookie, returns `cartId` and `checkoutUrl`.
  - Redirect the user to `checkoutUrl` (or show “View cart” and later “Checkout”).

- **Checkout:**
  - To only get the URL (e.g. after cart updates): `POST` to `NEXT_PUBLIC_API_URL/checkout` with `{ storeId: "store-a", discountCode?, customerEmail? }`.
  - Cart is identified by the cookie; response includes `checkoutUrl`.

The **frame config → line items** mapping is already implemented in `@framecraft/core` (e.g. serialization for frame options). Use that to build `lines` for the API.

### 4.2 Backend: What’s Already There

- **Cart creation** – `apps/api/src/routes/cart/route.ts` uses `createCartWithStorefront(storeId, lines)` and sets the cart ID cookie.
- **Checkout URL** – `apps/api/src/routes/checkout/route.ts` uses the cart from the cookie and returns Shopify’s checkout URL.
- **Store config** – `ensureStoreConfig(storeId)` in `apps/api/src/lib/store-config.ts` loads credentials from env so the core Storefront API client works.

You can extend the API with:

- Validation of frame config and pricing before creating the cart.
- Logging/analytics for cart and checkout.
- Rate limiting (already stubbed in the route handlers).
- Optional: call Shopify Admin API from the backend (e.g. order webhooks, inventory) using Admin API tokens in env (separate from Storefront token).

### 4.3 Cookie and CORS

- Cart ID is set in an **HTTP-only** cookie by the API. For the storefront on a different domain to send this cookie to the API, the API must:
  - Set the cookie with `SameSite=None; Secure` and the storefront’s domain (or use a shared parent domain), and
  - Respond with `Access-Control-Allow-Origin: <storefront-origin>` and `Access-Control-Allow-Credentials: true`.

If the storefront and API are on the same Vercel project (e.g. storefront at `/` and API at `/api`), use one project and deploy the Next.js app with the API as rewrites to the same origin; then the cookie and CORS are simpler.

---

## 5. Single Vercel Project (Alternative)

To serve both the Next.js app and the API from one deployment:

- Use the **storefront** as the main app (Root Directory = repo root or `apps/store-a`).
- Either:
  - Move or duplicate the API route handlers into **Next.js API routes** under `apps/store-a/src/app/api/...`, and call the same `createCartWithStorefront` / checkout helpers from there; or
  - Use Vercel rewrites so that e.g. `https://your-site.com/api/*` is proxied to the `apps/api` serverless functions (more complex with a single project and two apps).

The two-project setup (Section 2) is usually simpler and keeps the API and storefront builds and envs separate.

---

## 6. Checklist

- [ ] Create Shopify store (or use dev store) and get Storefront API access token.
- [ ] Create a “Custom Frame” product in Shopify and note the variant GID for `NEXT_PUBLIC_SHOPIFY_FRAME_VARIANT_ID` and for API `lines[].merchandiseId`.
- [ ] Deploy **API** project on Vercel; set `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_TOKEN` (and optionally per-store vars).
- [ ] Deploy **Store A** on Vercel; set `NEXT_PUBLIC_API_URL` to the API project URL and all `NEXT_PUBLIC_*` Shopify vars.
- [ ] In the storefront, implement “Add to Cart” to call `POST /api/cart` with serialized frame config and redirect to the returned `checkoutUrl` (or to a cart page that later calls `POST /api/checkout`).
- [ ] If storefront and API are on different domains, configure CORS and cookie `SameSite`/`Secure`/domain so the cart cookie is sent to the API.

For Shopify setup details (Storefront API scopes, product/variant), see [SHOPIFY_SETUP_GUIDE.md](./SHOPIFY_SETUP_GUIDE.md).
