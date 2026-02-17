# Shopify Team Call – Prep & Interview Guide

**Purpose:** Prep for the call with Shopify’s team (e.g. solutions engineer). Keeps the conversation focused on **best technical approach**, **lowest cost and maintenance**, and **centralized inventory** so we can avoid a custom contract if standard plans support our needs.

**Bottom line:** Headless (our storefront + Storefront API + hosted Checkout) is **supported** — not the default theme flow, but not “exotic.” The call is to confirm the **right plan and structure**, not to get headless “approved.”

---

## 1. Call objectives (from client)

- **Best technical approach** for headless multi-storefront setup (custom React/TS frontend, Shopify for cart/checkout and possibly catalog).
- **Lowest cost and maintenance** – prefer standard plans; avoid overcomplication.
- **Centralized inventory** – **primary goal:** understand if there’s a **clean way to manage one product catalog across all stores without maintaining separate inventory on each store/plan**. If the solutions engineer confirms this is doable on basic/standard plans, we skip a custom contract entirely.
- **Outcome:** Either “we can do this on standard plans” (and how) or “we need a custom contract” (and why).
- **Overarching goal:** Choose the approach that **minimizes both Shopify cost and long-term development/maintenance** — align on the simplest setup that still supports headless, our pricing model, and multi-store.

**One line to use in the meeting:**  
_“We’re trying to choose the approach that minimizes both our Shopify cost and our long-term development and maintenance — so we want to align on the simplest setup that still supports headless, our pricing model, and multi-store.”_

---

## 2. Opening: headless is supported (set the frame)

Use this so they know we’re not asking “can we go headless?” but “what’s the right plan and structure?”:

_“We’re going headless — our own storefront talking to Shopify via the Storefront API and sending customers to your hosted Checkout. My understanding is that’s a supported model, not the default theme flow. We’re here to confirm the right plan and multi-store setup for that.”_

---

## 3. Key questions to ask Shopify

### 3.1 Centralized catalog & inventory

- “We plan to run **multiple storefronts** (different domains/brands) that share the **same product catalog and inventory**. What’s the recommended way to do that on **standard Shopify plans**?”
- “If we use **multiple Shopify stores** (one per brand/domain), can we keep **one source of truth** for products and inventory (e.g. one ‘master’ store or external system) and sync to the others without duplicating manual work?”
- “Are there **built-in** or **partner app** options for **multi-store catalog sync** or **centralized inventory** that work on **Basic/Shopify/Advanced** plans, without a custom enterprise contract?”
- “If we use **one Shopify store** and multiple custom storefront domains pointing to it (headless), is that supported on standard plans? Any limits on domains or storefronts?”

### 3.2 Headless & Storefront API

- “For a **headless** setup (custom React frontend, Storefront API for cart and checkout), what’s the **recommended** pattern for cart and checkout on standard plans? Any limits on API usage or number of storefronts?”
- “Do **checkout extensibility** and **custom line item attributes** (for configurable products like custom frames) work the same on all standard plans?”

### 3.3 Pricing: sending our calculated price to Checkout

We calculate price in our app; by default Checkout shows the **variant** price. To have the customer pay **our** calculated price we need one of: Draft Orders, a Plus line item script, or checkout extensibility. Ask:

- “We need the **line item price at checkout** to match the price we **calculate in our app** (we send it in a line item attribute). What’s the **recommended** way on standard plans — **Draft Orders** vs **checkout extensibility** vs something else? Do we need **Plus** and a line item script to set price from an attribute?”
- “If we use **checkout extensibility** (non-Plus), can we **set the full line item price** from a custom attribute, or is it only for discounts / limited adjustments?”
- “For **Draft Orders**: we’d create the order server-side with our price and send the customer to the draft’s checkout URL. Any limits or gotchas on standard plans?”

### 3.4 Cost and plans

- “What’s the **simplest plan** that supports: (1) Storefront API for headless cart/checkout, (2) custom line item attributes, (3) multiple sales channels or multiple storefront domains if we need them?”
- “Is there any **per-store** or **per-domain** fee that would make ‘one store, many storefronts’ clearly cheaper than ‘many stores, synced catalog’?”

### 3.5 Operational constraints

- “For **fulfillment**, we need to read **line item custom attributes** (dimensions, frame style, etc.) from orders. Is that available via Admin API and webhooks on standard plans?”
- “Any **rate limits** or **best practices** we should know for Storefront API cart mutations and Admin API order reading?”

---

## 4. What we want to hear (success criteria)

- **Ideal:** “You can do **one product catalog and one inventory** across your storefronts on **standard plans**” with a clear pattern (e.g. one store + multiple headless storefronts, or a specific sync approach).
- **Acceptable:** “You need multiple stores, but **X app** or **Y approach** gives you a single catalog/inventory source without a custom contract.”
- **Red flag:** “That requires a custom/enterprise contract” – then we need a short, clear explanation of _why_ and what we’d get for the extra cost.

---

## 5. Short context to share with Shopify (if needed)

- **Product:** Custom framing (picture frames, canvas float frames, shadowbox frames). Highly configurable (size, frame style, mat, glass); we do **not** create a Shopify product per configuration – we use a **small set of products** and pass full config via **line item custom attributes**.
- **Architecture:** Custom React/TypeScript frontend (Next.js), headless. Cart and checkout via Storefront API (or BFF in front of it). Multiple storefronts planned (~10), same catalog and shared inventory desired.
- **Goal:** Standard plans, minimal custom contracts, one place to manage catalog and inventory if possible.

---

## 6. Agenda suggestion (30–45 min)

| Block     | Topic                                                                                         | Owner             |
| --------- | --------------------------------------------------------------------------------------------- | ----------------- |
| 2 min     | Intro: who we are, headless multi-storefront, custom configurable products                    | Us                |
| 5 min     | How we use Shopify: minimal product set + line item attributes                                | Us                |
| 15–20 min | **Centralized catalog/inventory:** one catalog across stores on standard plans?               | Them + discussion |
| 10 min    | **Pricing:** Send calculated price to Checkout (Draft Orders vs Plus script vs extensibility) | Them + discussion |
| 5 min     | Headless best practices, plan limits, Storefront API                                          | Them              |
| 5 min     | Next steps: docs, POC, or “we’ll send a proposal”                                             | Them              |
| 5 min     | Q&A                                                                                           | Both              |

---

## 7. After the call

- **Capture:** Which approach they recommended (one store vs multi-store, any apps, any custom requirements).
- **Decision:** If standard plans + one catalog/inventory is confirmed → no custom contract. If not → document what would require custom and at what level of effort/cost.
- **Share:** Update this doc or a short “Shopify call notes” file with outcomes and any links they provide (e.g. multi-store guides, inventory sync apps).

---

## 8. Related docs

- **Why we don’t create a product per configuration:** `docs/SHOPIFY_INTEGRATION_GUIDE.md`
- **Current migration status and Shopify gaps:** `docs/MIGRATION_STATUS_AND_SHOPIFY.md`
- **Client requirements and project context:** `docs/CLIENT_REQUIREMENTS_AND_PROJECT_CONTEXT.md`
