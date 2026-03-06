## Project Roadmap: Shopify Migration, SEO, Codebase Organization, CMS

### Scope & Priorities

1. **Shopify migration (Cart Transform, Plus)** – highest priority
2. **SEO optimization** – site-wide technical and content SEO
3. **Code review and refactor** – maintainability, consistency, and future scalability
4. **Incremental CMS migration** – move from code-driven content to a flexible content layer

Each section below is structured as **Epics** with **splittable tickets** that can go into a tracker (Jira, Linear, GitHub issues, etc.).

---

## 1. Shopify Migration (Priority 1)

Goal: Move from “mock / direct checkout” to a **clean, Plus-based Cart Transform** flow, while keeping the custom pricing engine as the single source of truth.

### Epic 1.1 – Shopify Plus foundational setup

**S1 – Confirm Shopify Plus environment & access**

- **Type**: Setup
- **Description**: Verify that the primary Shopify store is on Plus and that the team has access to:
  - Shopify Functions
  - Cart Transform API
  - Storefront API
- **Acceptance criteria**:
  - Plus plan confirmed in admin
  - At least one Storefront access token created for the headless storefront
  - Function / Cart Transform section visible in admin

**S2 – Finalize “single store + markets” architecture**

- **Type**: Architecture / docs
- **Description**: Decide and document that 10 storefronts will be served via **one Shopify store + Markets + headless domains**, unless there’s a strong business reason otherwise.
- **Acceptance criteria**:
  - Short architecture doc: “One Shopify store + Markets” vs. alternatives
  - Mapping of markets → domains/subdomains
  - Clear decision logged (so future devs don’t re-open the question)

**S3 – Define base products / variants for configurator**

- **Type**: Product setup / contract
- **Description**: Configure the minimal Shopify catalog for custom frames:
  - e.g. products like “Custom Picture Frame”, “Custom Shadowbox Frame”, “Custom Jersey Frame”
  - Decide whether to use one variant per product or multiple variants (e.g. for service types).
- **Acceptance criteria**:
  - List of product IDs / variant IDs for each designer type
  - Stored in `.env` / config and referenced from code (no hardcoded IDs scattered)

---

### Epic 1.2 – Pricing contract & line item schema

**S4 – Define canonical frame configuration schema**

- **Type**: Design / docs
- **Description**: Freeze the **`FrameConfiguration`** shape as the single canonical config used by:
  - pricing engine
  - Shopify cart line attributes
  - order files / production files
- **Acceptance criteria**:
  - Schema documented (fields, types, constraints)
  - Decision on optional vs required fields (e.g. `brassNameplateConfig`, `bottomWeighted`)

**S5 – Line item attributes contract**

- **Type**: Design / docs
- **Description**: Design exactly what will be stored as **Shopify line item attributes (properties)**:
  - Human-readable fields (size, frame name, mat names)
  - Machine-readable fields:
    - `config_json` (minified JSON of `FrameConfiguration`)
    - `price_cents` (computed by backend)
    - `config_hash` or `signed_payload` for integrity
- **Acceptance criteria**:
  - Document listing all attributes (key, type, example value, purpose)
  - Strategy for hashing/signing `config_json` + `price_cents` agreed (e.g. HMAC with shared secret)

**S6 – Cart Transform pricing trust model**

- **Type**: Design / docs
- **Description**: Decide whether the Cart Transform function:
  - recomputes price purely from `config_json`, or
  - **validates and trusts a signed price** computed by the backend.
- **Acceptance criteria**:
  - Short design note: “We recompute” or “We validate signed price”
  - If signed price: algorithm + secret management documented

---

### Epic 1.3 – Backend Cart API & pricing integration

**S7 – BFF Cart API design**

- **Type**: Backend design
- **Description**: Design the BFF (backend-for-frontend) cart endpoints that the Next.js app will call:
  - `POST /api/cart` – create/fetch cart for current session
  - `POST /api/cart/lines` – add/update/remove lines
  - `GET /api/cart` – fetch summarized cart state for UI
- **Acceptance criteria**:
  - API contract written (URL, method, request/response JSON, error shapes)
  - Plan for session / cart ID persistence (cookie or header) documented

**S8 – Implement cart add/update backend endpoints**

- **Type**: Backend implementation
- **Description**: Implement the BFF endpoints using the Storefront API (or Admin if necessary), using the configuration schema:
  - Validate incoming `FrameConfiguration`
  - Call pricing engine
  - Attach attributes (including signed payload if chosen)
- **Acceptance criteria**:
  - Unit tests for pricing + attribute-building
  - Cart API can be hit locally and returns expected structure
  - Logging (non-sensitive) for debugging pricing mismatches

**S9 – Wire frontend designers to BFF Cart API**

- **Type**: Frontend integration
- **Description**: Replace direct `addToCart`/checkout with:
  - `POST /api/cart/lines` using `FrameConfiguration`
  - Update local cart store from BFF response (so header/cart page stay in sync)
- **Acceptance criteria**:
  - From any designer, “Add to Cart”:
    - updates local cart store
    - updates Shopify cart via BFF
  - No direct `addToCart` → `createCheckout` calls left except in a migration shim (if needed)

---

### Epic 1.4 – Shopify Functions: Cart Transform

**S10 – Implement Cart Transform function skeleton**

- **Type**: Shopify Function implementation
- **Description**: Create a Cart Transform function app (or extension) that:
  - reads line attributes
  - logs relevant data
  - _initially_ does not change prices (no-op transform)
- **Acceptance criteria**:
  - Function is deployed and attached to cart
  - Logs show attributes for sample cart lines

**S11 – Price override logic in Cart Transform**

- **Type**: Shopify Function implementation
- **Description**: Based on the chosen model (recompute or signed price):
  - Parse `config_json` (and/or `signed_payload`)
  - Compute / validate expected price
  - Use `update` operations to override line prices
- **Acceptance criteria**:
  - For a known configuration, line price in cart matches backend price (± rounding rules)
  - Edge cases (missing/invalid attributes) fall back to safe behavior (e.g. leave base price)

**S12 – Error handling & observability for Cart Transform**

- **Type**: Observability
- **Description**: Add logging / metrics (within Shopify limits) for:
  - mismatched or invalid payloads
  - suspicious price differences
- **Acceptance criteria**:
  - Clear log messages in Shopify function logs for bad data
  - Documented “what to check” when a merchant reports a bad price

---

### Epic 1.5 – Checkout flow and UX

**S13 – Cart page → Shopify checkout link**

- **Type**: Frontend integration
- **Description**: Ensure the cart page:
  - shows accurate subtotal (matches Shopify)
  - uses Shopify cart’s `checkoutUrl` for “Proceed to checkout”
- **Acceptance criteria**:
  - Clicking “Proceed to checkout” uses the Shopify checkout URL
  - Cart Transform–adjusted prices are visible in checkout

**S14 – Migration toggle & rollback strategy**

- **Type**: Operations
- **Description**: Provide an easy flag to:
  - switch between current “mock”/old checkout and new Cart Transform flow (for QA)
- **Acceptance criteria**:
  - Config flag (env or feature toggle) that can disable the function-based override or BFF usage
  - Documented rollback steps

---

## 2. SEO Optimization (Priority 2)

Goal: Use Next.js App Router features and structured data to maximize organic visibility.

### Epic 2.1 – Technical SEO baseline

**SEO1 – Canonical URLs & route groups verification**

- **Type**: Audit + small fixes
- **Description**: Verify that every important route:
  - has a **canonical URL** (Next.js `metadata.alternates.canonical`)
  - is not duplicated across multiple URLs (especially after route grouping)
- **Acceptance criteria**:
  - Audit sheet listing key URLs and their canonical tags
  - Any missing/wrong canonicals fixed

**SEO2 – XML sitemap & robots.txt**

- **Type**: Implementation
- **Description**: Implement:
  - `app/sitemap.ts` or `app/sitemap.xml/route.ts` to generate a sitemap from available routes and frame/slug data
  - `app/robots.txt/route.ts` with sensible defaults (allow main site, disallow admin-only or API)
- **Acceptance criteria**:
  - `/sitemap.xml` lists core pages, designers, and key landing pages
  - `/robots.txt` is valid and references the sitemap

**SEO3 – Performance & Core Web Vitals audit**

- **Type**: Audit + tasks
- **Description**: Run Lighthouse / WebPageTest on:
  - home
  - main designer
  - key category pages
- **Acceptance criteria**:
  - Document with LCP, CLS, TBT metrics and a prioritized list of fixes (e.g. image optimization, font loading, JS bundle size)
  - Separate tickets created if heavy work needed

---

### Epic 2.2 – On-page SEO for key pages

**SEO4 – Designer pages (FrameDesigner, MatDesigner, specialty)**

- **Type**: Content + metadata
- **Description**: For each main designer route:
  - ensure unique `title`, `description`, `openGraph`, `twitter` metadata
  - add targeted H1/H2 headings and intro copy with relevant keywords
- **Acceptance criteria**:
  - A table listing each key designer route and its final SEO metadata
  - Pages visibly contain clear H1s and supporting headings

**SEO5 – Category and landing pages**

- **Type**: Content + internal links
- **Description**: For picture-frame categories (e.g. `/picture-frames`, `/canvas-frames`, `/shadowbox-frames`, etc.):
  - refine copy to clearly describe products / use-cases
  - ensure internal links to relevant designers, FAQ, and guides
- **Acceptance criteria**:
  - Each category page has:
    - 1–2 paragraphs of descriptive copy
    - internal links to at least 2–3 related guides/designers
  - No thin pages that are essentially “empty listings”

**SEO6 – Blog integration and schema**

- **Type**: Content SEO
- **Description**: Audit existing blog markdown and:
  - ensure titles and meta descriptions are tuned
  - add `Article` or `BlogPosting` structured data for posts
- **Acceptance criteria**:
  - Blog pages output JSON-LD per post
  - Each post has a strong title, description, and H1

---

### Epic 2.3 – Structured data & rich results

**SEO7 – Product / Offer structured data**

- **Type**: Implementation
- **Description**: For product-like pages (e.g. specific frame styles, jersey frames):
  - add `Product` JSON-LD with price range, availability, URL, brand
  - integrate with pricing engine / Shopify data where feasible
- **Acceptance criteria**:
  - Key product pages validate in Google’s Rich Results Test
  - No schema errors/warnings on those pages

**SEO8 – Breadcrumbs & sitewide schema**

- **Type**: Implementation
- **Description**:
  - Add `BreadcrumbList` JSON-LD for key hierarchical pages (e.g. `/picture-frames` → `/frames/[frameSlug]`)
  - Ensure Organization schema (already present) is accurate and centralized
- **Acceptance criteria**:
  - Breadcrumb JSON-LD present and valid on selected pages
  - Organization schema is not duplicated in conflicting ways

---

## 3. Code Review & Refactor (Priority 3)

Goal: Make the monorepo easier to reason about and safer to extend.

### Epic 3.1 – Module boundaries and shared code

**R1 – Validate package boundaries (`core`, `ui`, `config`, `data`, `types`)**

- **Type**: Architecture review
- **Description**: Inspect imports and ensure:
  - `@framecraft/core` exposes services/utils/hooks, not React page code
  - `@framecraft/ui` is mostly UI components, not business logic
  - `@framecraft/config` holds brand/site/env-specific config
  - `@framecraft/data` has pure data JSON and minimal helpers
- **Acceptance criteria**:
  - Short doc listing “allowed” import directions
  - A TODO list of obvious violations (not yet fixed)

**R2 – Centralize pricing & export logic docs**

- **Type**: Documentation
- **Description**: Document the pricing pipeline and export pipeline:
  - which functions are canonical (e.g. `calculatePricing`, `exportFramePreview`)
  - how image proxying, mat tiling, and frame images interact
- **Acceptance criteria**:
  - `docs/PRICING_ENGINE.md` and `docs/EXPORT_PREVIEW_PIPELINE.md` (or similar)
  - References to those docs from key modules

---

### Epic 3.2 – Designers & previews consistency

**R3 – Unify preview components usage**

- **Type**: Refactor plan
- **Description**: Catalog how each designer renders its preview:
  - `FramePreview`, `MatPreviewCanvas`, specialty preview canvases
  - Identify duplication / divergence (frame rails, mat rendering, image scaling)
- **Acceptance criteria**:
  - Matrix: designer vs preview component vs behaviors
  - Proposed target: “One canonical way” per preview type (frame-only, mat-only, specialty)

**R4 – Mat designer & mat preview parity with other designers**

- **Type**: Refactor
- **Description**: Compare mat designer implementation against original repo and:
  - highlight any remaining mismatches (URL sync, V-groove, nameplates, etc.)
  - outline steps to make it follow the same patterns used in currency/other designers
- **Acceptance criteria**:
  - Checklist of behaviors “done / missing / not needed”
  - Planned refactor tasks (not necessarily executed yet)

---

### Epic 3.3 – Testing & quality gates

**R5 – Unit tests for pricing & Cart Transform integration**

- **Type**: Testing
- **Description**: Add focused tests for:
  - `calculatePricing` for representative configs
  - `convertImageToDataURL` and export image scaling
  - Cart Transform price override logic (in isolation)
- **Acceptance criteria**:
  - Test suite that can be run in CI and locally
  - Clear coverage of “we charge the same the user saw”

**R6 – Lint + TypeScript hygiene**

- **Type**: Tooling / cleanup
- **Description**: Ensure:
  - TypeScript strict-enough settings for critical packages (`core`, `types`)
  - ESLint config catches unsafe patterns (e.g. `any`, unused, missing deps)
- **Acceptance criteria**:
  - Baseline lint/tsconfig documented
  - No high-priority lint/TS errors in `core` and `types` packages

---

## 4. CMS & Content Strategy (Priority 4)

Goal: Move from “content in code/JSON” to a flexible, editor-friendly content model, **without** destabilizing the product configuration logic.

### Epic 4.1 – Content audit & classification

**CMS1 – Inventory of content and owners**

- **Type**: Audit
- **Description**: List all content sources:
  - `brand.config` (global)
  - `heroImages.json`, `testimonials.json`
  - blog markdown content
  - hard-coded copy in pages/layouts
- **Acceptance criteria**:
  - Table of content types with:
    - where they live in code
    - who owns them (marketing vs dev)
    - update frequency

**CMS2 – Choose CMS & integration pattern**

- **Type**: Decision
- **Description**: Decide if the project will use **Strapi** (or similar) and:
  - how it will be hosted (self-hosted vs cloud)
  - how the Next.js app fetches data (build-time vs on-demand with caching)
- **Acceptance criteria**:
  - Short design doc “CMS choice and integration strategy”
  - High-level data model sketch (Global settings, Hero, Testimonial, BlogPost, etc.)

---

### Epic 4.2 – Phase 1 CMS integration: marketing content

**CMS3 – Move hero images + testimonials to CMS**

- **Type**: CMS integration
- **Description**: Create content types in CMS:
  - `Hero` (title, subtitle, image, CTA, segment)
  - `Testimonial` (name, quote, avatar, rating, tags)
  - Migrate existing JSON content
- **Acceptance criteria**:
  - Home page uses CMS data for hero and testimonials
  - Fallback/local JSON is still possible as a safety net (feature flag)

**CMS4 – Global site settings in CMS**

- **Type**: CMS integration
- **Description**: Add a `GlobalSettings` schema:
  - site name, SEO defaults, footer links, contact info
- **Acceptance criteria**:
  - `brand.config` becomes thin, pulling from CMS (with caching)
  - Non-devs can adjust default SEO text and contact info

---

### Epic 4.3 – Phase 2 CMS: blog and educational content

**CMS5 – Blog posts from CMS**

- **Type**: CMS integration
- **Description**: Migrate blog markdown to CMS:
  - keep markdown fields or rich text fields
  - maintain slugs and redirects if URLs change
- **Acceptance criteria**:
  - `/blog` and `/blog/[slug]` render from CMS data
  - Old URLs (if any changed) redirect properly

**CMS6 – Guides & learn pages from CMS**

- **Type**: CMS integration
- **Description**: Gradually move `/learn`, guides, and FAQs to CMS-based content, while leaving designers and core product configs in code.
- **Acceptance criteria**:
  - At least core guides (how-to-measure, glazing, mat board) served from CMS
  - Authors can edit content and preview changes without a code deploy

---

### Epic 4.4 – Optional Phase 3 CMS: product catalog

**CMS7 – Evaluate moving frames/mats to CMS**

- **Type**: Feasibility / design
- **Description**: Analyze pros/cons of moving:
  - `frames.json`, `mats.json`, `glass.json`
  - pricing-config metadata
  - into CMS (or keeping them in `@framecraft/data` + Shopify)
- **Acceptance criteria**:
  - Clear decision: “We keep product catalog in code/Shopify” vs “We manage some attributes in CMS”
  - If moving, a phased plan that doesn’t break pricing or export logic

---

## 5. Execution Order & Risk Management

- **Execution order**:
  1. Ship Shopify migration (Cart Transform, BFF Cart API, updated checkout flow).
  2. Implement SEO baseline + key on-page improvements.
  3. Stabilize/refactor core modules and designers with tests.
  4. Introduce CMS incrementally, starting with marketing content.

- **Risk management**:
  - Use **feature flags** for new checkout and CMS-driven content.
  - Keep **backward-compatible fallbacks** (e.g., local JSON) while rolling out CMS or Cart Transform.
  - Add **logging and monitoring** especially around pricing, image export, and checkout.
