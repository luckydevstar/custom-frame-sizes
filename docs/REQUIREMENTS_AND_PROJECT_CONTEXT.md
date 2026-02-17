# Client Requirements & Project Context

**Purpose:** This document is the single source of context for the Custom Frame Sizes / FrameCraft project. Share it at the start of any new Cursor chat so the agent understands the client’s requirements, the agreed architecture, and the current codebase without re-sharing full conversation history.

---

## 1. Project overview

- **Client:** Anthony.
- **Business:** E‑commerce for custom framing (CustomFrameSizes.com and future storefronts).
- **Initiative:** Rebuild the entire e‑commerce platform into a **headless Shopify** setup with a **custom React/TypeScript frontend**, supporting **multiple storefronts** that share most of the code but can override branding and config per domain.

---

## 2. Original client questions (architecture)

Anthony’s initial technical questions that shaped the architecture:

1. **Shopify Storefront API (GraphQL)**  
   Have you worked with it? How would you structure reusable product/variant queries for a **multi-store** setup?

2. **Secure server-side layer for cart**  
   How would you design a secure server-side layer for cart creation/updates using the **Admin API**?

3. **Monorepo for ~10 storefronts**  
   How would you structure a monorepo where ~10 storefronts **share most of the code** but can **override branding/config per domain**?

4. **SEO-safe migration (Magento → Shopify)**  
   How would you approach URL parity, redirects, and canonical logic?

5. **Vercel deployment**  
   How would you separate environments and manage builds for multiple storefronts?

---

## 3. Agreed architectural approach (John’s response)

- **Storefront API:**  
  Typed data-access layer so the frontend doesn’t touch raw GraphQL. Functions like `getProductByHandle(storeId, handle)` / `getCollection(storeId, handle, pagination)` with a `storeId` that maps to the correct Storefront API URL, token, locale, and currency. Shared **GraphQL fragments** for product, pricing, media, variants so all pages use the same base definition.

- **Cart & Admin API:**  
  **Server-side BFF only.** Admin tokens never in the browser. Endpoints such as `/api/cart` and `/api/cart/lines` for cart create/update; client sends variant IDs and quantities; server validates and calls Storefront/Admin APIs. Cart/store identifiers in HTTP-only cookies or user session; rate limiting and input validation on these endpoints. Storefront cart API for normal flows; Admin API for privileged/internal use only.

- **Monorepo (~10 storefronts):**  
  **pnpm workspaces** with **Turborepo or Nx**. Separate app folders per storefront; shared packages for UI, domain logic, and config. Each app uses a shared design system and a shared “core” package (product mappers, hooks, API clients). Branding via **configuration and theming** (logos, colors, typography). Per-store overrides only where a store truly needs a custom component; otherwise one implementation, many configs.

- **SEO migration (Magento → Shopify):**  
  Export and audit existing Magento URLs (products, categories, CMS). Design Shopify URL structure for **URL parity** where possible. **301 redirect map** for any changed URLs (in Shopify or at the edge). **Canonical URL** tags on primary pages. Migrate titles, meta descriptions, structured data (e.g. product schema). Post-launch: monitor Search Console and analytics for 404s and traffic drops.

- **Vercel:**  
  One repo, **multiple Vercel projects** (one per storefront). Each project has its own root (app directory), domains, and env vars. Main branch → production; PR previews per store. Env vars (Storefront/Admin tokens, base URLs) scoped per project and per environment. Turborepo (or similar) so shared package changes rebuild only affected storefronts.

---

## 4. Kickoff details from Anthony

- **Original/canonical codebase:**  
  **GitHub: CustomFrameSizes-CODE** — this is the source of truth for behavior, pages, and content before migration.

- **New/migrated codebase:**  
  **custom-frame-sizes** (this repo) — monorepo with shared packages and at least one storefront app (e.g. store-a for CustomFrameSizes.com).

- **Access & setup (at kickoff):**
  - **Vercel:** Project created; lead added to team.
  - **Shopify:** Headless Storefront app created and installed; Admin API credentials in place; Storefront API enabled.
  - **Replit:** View/reference access for the full image library. **GitHub remains source of truth;** Replit is for assets/reference only.

- **Naming:**  
  “FrameCraft” appears in the original codebase as the working name. The **production site name** for the first storefront is **CustomFrameSizes.com**. Naming can be normalized during monorepo cleanup.

- **Pricing:**  
  Anthony provided **pricing documentation** that reflects the current pricing engine logic. It should be treated as **authoritative** when mapping pricing services and tests.

- **Assets:**  
  Asset library is **large (~20GB+)**. Asset extraction and hosting strategy are left to the team. Client can set up **Cloudflare R2** or **AWS S3/CloudFront** for image hosting per recommendation.

- **Initial Vercel deploy:**  
  An early deploy failed due to expected dependency conflicts (npm/peer deps). Noted for context only.

---

## 5. Codebase reference (for Cursor)

| Role                                                                  | Repository / path         | Notes                                                                                                                     |
| --------------------------------------------------------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **Original (source of truth for pre-migration behavior and content)** | **CustomFrameSizes-CODE** | React + Vite client, Express server, etc. Use for “what should this page do / say?”                                       |
| **Migrated (current work)**                                           | **custom-frame-sizes**    | Monorepo: apps (e.g. store-a), shared packages (core, ui, data, config, etc.). Use for “where do I implement / fix this?” |

When the client says “migrate the exact thing” or “match the original,” the **original** repo (CustomFrameSizes-CODE) defines the desired structure, copy, and sections; the **custom-frame-sizes** repo is where implementation lives.

---

## 6. Current state (as of this doc)

- **Most pages have been migrated successfully** from the original codebase into the new monorepo (e.g. store-a). UI migration is largely complete.
- **Shopify migration** is the next focus: BFF (cart/checkout API) and core Storefront layer exist, but store-a is not yet wired to the BFF, product/variant data in Shopify is not set up, and designers still use the legacy checkout flow. See **`docs/MIGRATION_STATUS_AND_SHOPIFY.md`** for a full scan of the repo, what’s in place, gaps, and recommended Shopify migration order.
- Other remaining work may include: full component configurators, Samples page, browse-by (style/size) pages, navigation links, SEO/redirects, and asset hosting rollout.
- For **per-page migration details** (what’s done, what’s next, section order, URLs), use or create a separate migration/checklist doc in this repo and reference it from here if needed.

---

## 7. How to use this in a new Cursor session

1. At the start of a new chat, say something like:  
   **“Read `docs/CLIENT_REQUIREMENTS_AND_PROJECT_CONTEXT.md` for full project and client context.”**  
   Or attach that file.

2. Then give your specific task (e.g. “add the Samples page,” “match the original Canvas page structure,” “fix shadowbox colors export”).

This gives the agent: who the client is, what the product is, the agreed architecture, the kickoff setup, which repo is original vs migrated, and current state—without re-pasting the whole conversation.
