# Shopify Integration Guide – Custom Frame Sizes

**Purpose:** Technical guide for integrating Shopify with the Custom Frame Sizes platform. Explains why we **do not** create a Shopify product for every custom frame configuration, and how the minimal-catalog + line-item-attributes approach works end-to-end.

Use with `docs/MIGRATION_STATUS_AND_SHOPIFY.md` for current gaps and implementation order.

---

## 1. What’s supported (headless) – no special plan needed

Our setup is **supported** by Shopify; it’s just not the default (theme) flow.

| What we do                                                                                                  | Shopify’s stance                                                |
| ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| **Storefront API** – create carts, add lines (variant + quantity + custom attributes), redirect to Checkout | Built for headless; standard, documented flows.                 |
| **Headless checkout** – our own frontend (e.g. Next.js), send users to Shopify’s **hosted Checkout**        | Supported, common pattern. We don’t use the Online Store theme. |
| **Custom data on the line** – one variant (e.g. “Custom Frame”) + full config in line item attributes       | Normal and supported.                                           |

**No special “headless plan”** is required for the API to work. Plan choice (e.g. Basic vs Plus) is about contract/commerce features (e.g. scripts, checkout extensibility), not “turning on” headless.

**“Not default” vs “not supported”:**

- **Default** = one Shopify store + Online Store (theme).
- **Our setup** = no theme; our own frontend + Storefront API + same (or multiple) Shopify store(s). That’s the non-default path, but it’s still a **supported** path. “Not supported” would be wrong — headless is explicitly supported.

**Where it can get non-standard:**

- **Multi-store:** One store with many storefronts = same API, fully supported. Multiple Shopify stores (e.g. one per brand) with **shared** catalog/inventory is a design choice; Shopify supports multiple stores, but “shared catalog” across stores is something you design (sync, same products in each store, etc.).
- **Pricing:** We calculate price in our app; by default Checkout shows the **variant** price. To charge our calculated price we need Draft Orders, a Plus script, or checkout extensibility (see section 5).

**One line for the meeting:**  
_“We’re going headless — our own storefront talking to Shopify via the Storefront API and sending customers to your hosted Checkout. My understanding is that’s a supported model, not the default theme flow. We’re here to confirm the right plan and multi-store setup for that.”_

---

## 2. Do we need a Shopify product per configuration?

**No.** We do **not** create a separate Shopify product (or variant) for every combination of size, frame style, mat, and glazing.

### Why not?

- **Infinite combinations:** Artwork size (e.g. 12.5" × 16.25"), frame style, mat type/colors, glass type, and specialty options produce millions of logical “configurations.” Shopify is not designed for millions of variants per catalog.
- **Pricing is dynamic:** Our pricing engine calculates price from dimensions, frame style, mat, and glazing. The price is computed in our app, not from a pre-set Shopify variant price.
- **Operational cost:** Managing and syncing a huge product catalog would be brittle and unnecessary.

### What we do instead

We use a **minimal product catalog** in Shopify and send the **full configuration on each line item** via **custom attributes**. Shopify holds the cart and checkout; our backend (or fulfillment) reads the attributes to know exactly what to build.

---

## 3. Payment: we use only Shopify’s

When the customer clicks through to **Shopify Checkout**, they pay with whatever payment methods that store has enabled (cards, Apple Pay, Google Pay, Shop Pay, etc.). Our app does **not** run its own payment UI; Shopify’s hosted checkout does. So from the customer’s perspective it’s “only” Shopify’s checkout and payment methods. We are **not** integrating a separate payment provider; all payment is through Shopify.

---

## 4. Minimal product catalog approach

### 4.1 Recommended product structure in Shopify

Create a **small set** of products that represent _categories_ of what we sell, not every configuration:

| Product in Shopify                | Purpose                                               | Variants                                                                                | Notes                                                                                                           |
| --------------------------------- | ----------------------------------------------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **Custom Picture Frame**          | Standard picture frames (any size, style, mat, glass) | 1 variant (e.g. “Default”) or a few (e.g. by frame category if you want different SKUs) | Price can be $0 or placeholder; real price shown in app and passed via attributes or calculated at fulfillment. |
| **Custom Canvas Float Frame**     | Canvas float frames                                   | 1 (or few) variants                                                                     | Same idea: one “bucket” product, config in attributes.                                                          |
| **Custom Shadowbox Frame**        | Shadowbox / display cases                             | 1 (or few) variants                                                                     | Depth, backing, etc. in attributes.                                                                             |
| **Component / supply** (optional) | Acrylic sheets, foam board, hardware, etc.            | One variant per SKU if you sell fixed-SKU components                                    | These _can_ be real products with real variant prices if they’re not fully custom.                              |

For **fully custom frames**, one product per _type_ (picture, canvas, shadowbox) with **one or a handful of variants** is enough. Each cart line still has:

- `merchandiseId` → that variant’s GID
- `quantity`
- `attributes` → full configuration (dimensions, frame style, mat, glass, etc.)

### 4.2 Where the real “product” lives

- **Catalog and options:** In our app and in static/data packages (frame styles, mat colors, glass types, sizes). We do **not** need to mirror all options as Shopify products.
- **Pricing:** In our pricing engine. We can either:
  - Send a **price in attributes** (e.g. `Line Item Price` or `_custom_price`) and use a Draft Order or script to apply it, or
  - Use a **single variant price** as a deposit and settle true price at fulfillment, or
  - Use Shopify’s **selling plan** or **custom pricing** features only where they fit (e.g. fixed-price components).

The current codebase is set up to pass **configuration** via attributes; exact pricing flow can be chosen during implementation (see Gap #2 in MIGRATION_STATUS_AND_SHOPIFY.md).

---

## 5. How configuration reaches Shopify: line item attributes

### 5.1 Storefront API cart line input

When we add a line to the cart we send:

- **merchandiseId** – GID of the Shopify variant (e.g. our “Custom Picture Frame – Default”).
- **quantity** – Number of units.
- **attributes** – Array of `{ key: string, value: string }` for that line.

Shopify stores these on the line item and shows them in the cart and in the order in Admin. They are also available to checkout extensions and to the backend when the order is created.

### 5.2 What we put in attributes (existing implementation)

The repo already has **serialization** from frame config → attributes in `packages/core/src/shopify/serialization.ts`:

- **Service type** (e.g. frame-only, frame + mat)
- **Dimensions** (artwork width/height)
- **Frame style** (frame ID from our catalog)
- **Mat** (type, border, reveal, colors)
- **Glass type**
- **Specialty options** (e.g. shadowbox depth, canvas float depth, jersey mount, etc.)

So one cart line = one variant (e.g. “Custom Picture Frame”) + many attributes that describe the exact custom frame. No need for a new product or variant per configuration.

### 5.3 Attributes in Admin and at fulfillment

- In **Shopify Admin**, staff see the attribute keys and values on the line item.
- For **fulfillment**, our backend or an integration can read the same attributes (from the order via Admin API or webhooks) and drive production/assembly.

---

## 6. End-to-end flow (target state)

1. **Customer** configures a frame in our app (size, style, mat, glass, etc.).
2. **App** computes price with our pricing engine and shows it in the UI.
3. **App** calls the **BFF** (e.g. `POST /api/cart` or `PATCH /api/cart/lines`) with:
   - `storeId`
   - `lines`: `[{ merchandiseId, quantity, attributes }]`  
     Attributes = output of `serializeFrameConfiguration(config)` (and any extra fields like display title or internal reference).
4. **BFF** uses **Storefront API** (cart create / cart lines add or update), stores cart ID in an HTTP-only cookie, returns success (and optionally updated cart).
5. **Checkout:** Customer goes to cart and clicks Checkout, or we redirect to checkout. **BFF** can provide the checkout URL from the Storefront API (e.g. `cart.checkoutUrl`) or via `POST /api/checkout`.
6. **Order in Shopify** contains line items with the same variant + attributes. Fulfillment or backend reads attributes and builds the frame.

No step requires creating a new Shopify product or variant per configuration.

---

## 7. Sending the price to Shopify (so customer pays what we calculated)

**Default behavior:** With a normal Storefront API cart, the line item price comes from the **product variant** in Shopify. So if our variant is $0 or $50, that’s what Checkout shows — even if our app calculated $89.99. By default, Shopify does **not** use a price we “send” from the app; it uses the variant price.

To have Shopify **charge** the price we calculated, we need one of these:

| Option                                 | How it works                                                                                                                                                                                                                                                                  | Tradeoff                                                                                                                                                                               |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A. Draft Orders (Admin API)**        | Backend calculates price, creates a **Draft Order** via Admin API with a line item whose price is exactly what we calculated. We send the customer to that draft order’s checkout URL. Customer pays exactly the price we sent.                                               | Flow is “create draft order → redirect to its checkout”, not “add to cart → cart → checkout”. Different integration than the current Storefront API cart flow. More to build/maintain. |
| **B. Line item script (Shopify Plus)** | We keep the current flow: add to cart with a custom attribute that carries our calculated price (e.g. `calculated_price: "89.99"`). On **Shopify Plus**, a line item script at checkout reads that attribute and sets the line item’s price. Customer pays the price we sent. | Requires **Shopify Plus** and writing/maintaining a script. Higher plan cost.                                                                                                          |
| **C. Checkout extensibility**          | Newer checkout extensions may allow adjusting prices or applying discounts from our data. Whether we can **set the full line price from an attribute** depends on current capabilities (often used for discounts or limited adjustments).                                     | Worth asking Shopify on the call what’s possible on our plan.                                                                                                                          |

**Summary:** We _can_ send the price and have Shopify charge it — but not with the default “variant price only” behavior. We need either **Draft Orders** (different flow) or **Plus + line item script** (same cart flow, script sets price from attribute), or we confirm **checkout extensibility** options.

---

## 8. Choosing the right approach: cost vs development/maintenance

Goal: pick the approach that keeps **cost** and **development/maintenance** as low as possible while still meeting the business (customer pays the configured frame price, multi-store if needed).

| Decision               | Cheaper / less to build & maintain                                                                              | More cost or more to maintain                                                                                |
| ---------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| **Payment**            | Use only Shopify Checkout (what we’re doing) → no PCI, no payment integration to maintain.                      | Building our own payment UI + order storage.                                                                 |
| **Pricing**            | **Variant price only** (e.g. one fixed “Custom Frame” price or a few tiers) → no Draft Orders, no Plus scripts. | Draft Orders (different flow to build/maintain) or Plus + line item script (Plus cost + script maintenance). |
| **Stores**             | **One Shopify store, many storefronts** → one subscription, one admin.                                          | Multiple Shopify stores → more subscriptions, more sync/ops.                                                 |
| **Catalog in Shopify** | **Minimal:** one (or few) “container” products/variants + attributes.                                           | Many products/variants in Shopify that mirror our app catalog.                                               |

**One line for the call:**  
_“We’re trying to choose the approach that minimizes both our Shopify cost and our long-term development and maintenance — so we want to align on the simplest setup that still supports headless, our pricing model, and multi-store.”_

---

## 9. Multi-store and “one catalog”

- **Per-store products:** Each Shopify store (e.g. store A, store B) has its own product catalog. So “one product catalog across all stores” in the sense of _one logical catalog_ usually means:
  - Either **one primary Shopify store** that all storefronts use for checkout (single catalog, single inventory), or
  - **Multiple Shopify stores** with catalog/inventory synced by a third-party or custom sync (more complex).
- **Centralized inventory:** If we want “one catalog, one inventory” across all storefronts, we need to confirm with Shopify whether that’s done by (a) using a single Shopify store for all storefronts, or (b) using a multi-store/inventory sync solution on standard plans. That’s a key topic for the **Shopify team call** (see SHOPIFY_TEAM_CALL_PREP.md).

---

## 10. What to create in Shopify (practical checklist)

1. **One Shopify store** (or more if multi-store from day one).
2. **Products** (as in section 2.1):
   - e.g. “Custom Picture Frame” (1 variant), “Custom Canvas Float Frame” (1 variant), “Custom Shadowbox Frame” (1 variant).
   - Optional: real products/variants for components (acrylic, foam board, hardware) with real prices.
3. **Variant GIDs** noted and wired into the app (e.g. `NEXT_PUBLIC_SHOPIFY_FRAME_VARIANT_ID` or per-frame `shopifyVariantId` in data if you map by category).
4. **Storefront API** access (public storefront token for cart/checkout; no Admin API in the browser).
5. **BFF** (already stubbed in `apps/api`) with env for store domain and Storefront token, creating/updating cart and returning checkout URL.
6. **Storefront** (store-a) calling the BFF for cart/checkout instead of legacy checkout-create; cookie domain and CORS set so the cart cookie is sent to the BFF.

---

## 11. Env and config (reference)

- **BFF / API:** `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_TOKEN` (and per-store overrides if multi-store).
- **Storefront (if ever needed for direct Storefront calls):** `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`, `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN` (only if we keep a client-side cart path; preferred is BFF-only with no token in browser).
- **Variant IDs:** From Shopify Admin (Products → variant → “Copy variant ID” or via API). Use GID format in API calls (e.g. `gid://shopify/ProductVariant/...`).

---

## 12. Related docs

- **Current gaps and migration order:** `docs/MIGRATION_STATUS_AND_SHOPIFY.md`
- **Shopify team call (centralized inventory, standard plans):** `docs/SHOPIFY_TEAM_CALL_PREP.md`
- **GraphQL fragments and cart types:** `packages/core/src/shopify/FRAGMENTS_GUIDE.md`, `packages/core/src/shopify/cart.ts`
- **Serialization (config → attributes):** `packages/core/src/shopify/serialization.ts`
