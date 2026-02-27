## Shopify Plus Cart Transform Implementation Plan

**Purpose:** Detailed, implementation-focused plan for wiring our **configurator + computed pricing** into **Shopify Plus** using **Cart Transform** in this headless, multi-storefront project.

This document is written for the current `custom-frame-sizes` repo and should be used together with:

- `REQUIREMENTS_AND_PROJECT_CONTEXT.md`
- `SHOPIFY_CHECKOUT_PRICING_OPTIONS.md`

---

## 1. Scope & assumptions

- **Checkout model:** Headless Next.js frontend(s) → Shopify **Cart** → Shopify **hosted Checkout**.
- **Pricing:** Price is computed by our **own pricing engine** from the configuration (artwork size, frame style, mat, glazing, etc.).
- **Catalog strategy:** Minimal Shopify catalog (Pattern A) — a few base products (for example, “Custom Frame”) + configuration in **line item attributes/properties**.
- **Plan:** Shopify **Plus** on a **single primary store** powering multiple storefront domains (via Shopify Markets + Headless storefronts).
- **Goal:** At checkout, the customer is charged the **computed configurator price**, not the base variant price.

Out of scope: non-Plus fallback flows (Draft Orders, one-off variants).

---

## 2. High-level phases

1. **Shopify setup for Plus + headless**
2. **Data model & pricing contract** (what goes in line attributes, how the pricing engine is called)
3. **Backend/BFF integration** (cart APIs + pricing calculation + line attributes)
4. **Cart Transform Function implementation** (override line prices)
5. **Frontend integration** (configurator → cart)
6. **Multi-storefront rollout** (10 domains / markets)
7. **QA, logging, and monitoring**

Each phase below is written so it can be ticketed and executed incrementally.

---

## 3. Phase 1 – Shopify setup for Plus + headless

**Owner:** Shopify admin + backend lead  
**Goal:** Confirm Plus capabilities are active and headless storefront(s) are correctly configured.

- **1.1 Upgrade / confirm Plus**
  - Confirm the primary store is on a **Shopify Plus** plan (required for Cart Transform `update` price overrides).
  - Verify access to **Functions** and **Cart Transform** in the admin.

- **1.2 Headless channel & storefront tokens**
  - Install/enable the **Headless** channel.
  - Create one **custom storefront** per domain/experience we intend to serve (up to 10).
  - Generate **Storefront API tokens** for:
    - Current main storefront (e.g. CustomFrameSizes.com).
    - Any additional storefronts planned in the near term.
  - Store tokens as environment variables for the appropriate app(s)/deployments.

- **1.3 Markets and domains**
  - Configure **Shopify Markets**:
    - Define markets for regions / storefront groupings.
    - Attach domains/subdomains per market as needed.
  - Ensure DNS and SSL are ready for the target domains the Next.js apps will use.

- **1.4 Minimal catalog**
  - Create base products and variants needed for custom frames (for example, “Custom Frame – Wall”, “Custom Frame – Tabletop”).
  - Ensure each storefront app knows which **product/variant IDs** to treat as the base for the configurator.

Deliverable: One Plus store with Markets, Headless storefront(s), base products, and API tokens configured.

---

## 4. Phase 2 – Data model & pricing contract

**Owner:** Backend/domain logic lead  
**Goal:** Define how the **configuration** and **trusted price** move between frontend, BFF, Cart Transform, and fulfillment.

- **2.1 Configuration shape**
  - Define a **canonical configuration object** used across the stack, e.g.:
    - Artwork dimensions
    - Frame profile / color
    - Mat options (top/bottom, colors, window size)
    - Glazing type
    - Options (e.g. mounting, backing)
  - This should match the existing pricing engine’s input structure from the legacy system.

- **2.2 Line item attributes contract**
  - Decide which configuration fields are stored as **line item attributes** for:
    - Fulfillment (human-readable/deserializable config).
    - Cart Transform function (if needed to recalculate/validate).
  - Example attributes:
    - `config_json` – serialized configuration (compact JSON or similar).
    - `price_cents` – computed price from the BFF (for the function to read, not from client).
    - `quote_id` or `config_hash` – stable identifier to verify integrity.

- **2.3 Pricing trust model for Cart Transform**
  - Decide how Cart Transform gets a **trusted price**:
    - **Option A:** Cart Transform re-computes price from configuration only using in-function logic.
    - **Option B (likely for this project):** BFF calls the pricing engine, writes a **signed payload** into attributes (e.g. `signed_price_payload`), and Cart Transform:
      - Validates the signature.
      - Reads the price from the payload and uses `update` to set the line price.
  - Document the hashing/signing approach (no external HTTP calls from Functions).

Deliverable: Short schema/contract doc (can be added here or a separate `PRICING_CONTRACT.md`) that defines attributes and signatures used by Cart Transform and fulfillment.

---

## 5. Phase 3 – Backend/BFF integration

**Owner:** Backend/BFF team  
**Goal:** Ensure cart operations go through our BFF, which:

1. Validates configuration.
2. Computes pricing.
3. Writes the correct attributes into the cart line.

- **3.1 BFF endpoints**
  - Implement or adapt endpoints such as:
    - `POST /api/cart` – create or fetch a Shopify cart for the current session.
    - `POST /api/cart/lines` – add/update/remove lines.
  - Enforce:
    - Admin/Storefront tokens **only on the server**.
    - Input validation for configuration payloads.

- **3.2 Pricing integration**
  - When a request to add a configurator line comes in:
    - Validate the configuration against current rules.
    - Call the pricing engine/library to compute price.
    - Construct the **signed payload** (if using signing) and the canonical attribute set.
  - Pass to Shopify’s Cart API:
    - `merchandiseId` (base variant).
    - `quantity`.
    - `attributes` including the configuration, signed payload, and any display text for the cart drawer.

- **3.3 Cart storage & session**
  - Use an HTTP-only cookie or session mechanism to store the **Shopify cart ID** per user.
  - Ensure all storefront apps use the same cart identifier model to share logic.

Deliverable: BFF routes that produce cart lines with the precise attributes Cart Transform expects.

---

## 6. Phase 4 – Cart Transform Function implementation

**Owner:** Shopify Functions / backend engineer  
**Goal:** Implement and deploy a Cart Transform Function that overrides line item prices based on our configuration/pricing contract.

- **4.1 Function project setup**
  - Use Shopify’s recommended tooling (e.g. Shopify CLI) to:
    - Initialize a **Cart Transform Function** for the Plus store.
    - Configure it to run on applicable markets/channels (Headless storefronts).

- **4.2 Input parsing & validation**
  - Read cart lines and their attributes:
    - Extract `config_json` / `signed_price_payload` or equivalent.
  - Validate:
    - Signature/hash (if using signed payload).
    - Price is non-negative and within reasonable thresholds.
  - Decide which lines to transform (e.g. only base custom-frame products).

- **4.3 Price override logic**
  - For each eligible line:
    - Derive the **trusted unit price** in the cart currency.
    - Build an `update` operation that:
      - Sets the **line item price** (unit price).
      - Optionally updates title or image to reflect configuration (e.g. “Custom Frame – 18\" × 24\"”).
  - Ensure tax and discount behavior is correct when using overridden prices.

- **4.4 Registration, environments, and toggles**
  - Register the function in Shopify admin and bind it to:
    - The Headless channel.
    - Specific markets if necessary.
  - Add feature toggles/env config so we can:
    - Enable/disable Cart Transform per environment (dev, staging, prod).
    - Gradually roll out to markets or storefronts.

Deliverable: Deployed Cart Transform Function that reliably overrides prices for custom-frame lines in carts.

---

## 7. Phase 5 – Frontend integration (Next.js apps)

**Owner:** Frontend team  
**Goal:** Wire the configurator UI in the Next.js app(s) to the BFF/cart endpoints and reflect pricing accurately.

- **5.1 Configurator → add-to-cart flow**
  - On “Add to Cart” / “Update Cart”:
    - Gather the configuration from the UI.
    - Call the BFF (Phase 3) instead of directly calling Shopify.
  - Do **not** compute final price in the browser as the source of truth; it’s for display only.

- **5.2 Cart UI**
  - In the cart drawer/page:
    - Display the **computed price** returned from the BFF (matches what the Function will enforce).
    - Show key configuration details (size, frame style, mats, glass).
  - Ensure that when the Cart Transform Function runs, the cart totals in Shopify’s checkout match what the user saw in the UI.

- **5.3 Multi-storefront awareness**
  - Make sure each storefront app:
    - Uses its own Storefront API token and environment settings.
    - Calls shared BFF endpoints consistently (hosted once or per-region as required).
  - Route by **hostname** to load correct branding and any market-specific pricing rules before sending configuration to the BFF.

Deliverable: A fully wired configurator flow in at least one storefront, using the BFF and compatible with Cart Transform.

---

## 8. Phase 6 – Multi-storefront rollout (10 storefronts)

**Owner:** Tech lead + DevOps  
**Goal:** Repeatable pattern to enable Cart Transform pricing across all storefronts with minimal per-store customization.

- **6.1 Shared core vs overrides**
  - Keep pricing contract and BFF endpoints **shared** across all storefronts.
  - Allow per-storefront overrides only where truly necessary:
    - Different base products.
    - Market-specific rules (e.g. extra fees in some regions).

- **6.2 Environment & config**
  - For each storefront:
    - Add its Storefront API token and URLs to environment config.
    - Confirm it uses the same Cart Transform Function in the Plus store.
  - If needed, parameterize behavior inside the Function via:
    - Market ID.
    - Domain or any attribute that differentiates storefronts.

- **6.3 Rollout strategy**
  - Start with **one storefront** (CustomFrameSizes.com) as a pilot.
  - Then roll out to additional storefronts in waves, monitoring:
    - Error rates in the Function.
    - Pricing mismatches (cart vs checkout).
    - Conversion metrics.

Deliverable: All target storefronts use the same Cart Transform-based pricing model, with configuration managed via environment and Markets.

---

## 9. Phase 7 – QA, logging, and monitoring

**Owner:** QA + engineering  
**Goal:** Ensure pricing is correct, stable, and observable.

- **7.1 Test matrix**
  - Cases:
    - Common frame sizes, very large and very small sizes.
    - Different frame styles, mats, glazing, and edge options.
    - Multi-line carts (multiple custom frames, mixed with non-configurable products if applicable).
    - Different currencies/markets.
  - Verify:
    - Configurator UI price = cart UI price = checkout price.
    - Taxes and discounts behave as expected.

- **7.2 Logging & observability**
  - In the BFF:
    - Log configuration + computed price + cart line IDs (with PII-safe practices).
  - In the Function:
    - Use built-in diagnostics where available (or conservative fallback behavior on errors).
  - Add alarms/alerts for:
    - Function failures or invalid signatures.
    - Discrepancies detected between expected and actual prices (if we build such checks).

- **7.3 Fallback behavior**
  - Define what happens if:
    - Cart Transform fails for a line.
    - A configuration payload is invalid or unsigned.
  - Typical strategy:
    - Block checkout for invalid lines with a clear error message, **or**
    - Fallback to base variant price only where it is safe and clearly communicated.

Deliverable: Documented test plan, active logging, and clear fallback rules so Plus + Cart Transform pricing is safe to run in production.

---

## 10. Where to capture decisions

As we refine this plan, record concrete decisions in:

- `SHOPIFY_CHECKOUT_PRICING_OPTIONS.md` → **“Chosen approach”** section (Cart Transform selected).
- This file (`SHOPIFY_PLUS_CART_TRANSFORM_PLAN.md`) → update individual phases as tasks are completed or design choices change.
