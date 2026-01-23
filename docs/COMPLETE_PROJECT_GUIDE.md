# Complete Project Guide: Headless Shopify Multi-Store Platform

## 📋 Table of Contents

1. [What This Project Is About](#what-this-project-is-about)
2. [Current Structure (Original Codebase)](#current-structure-original-codebase)
3. [The Goal & Vision](#the-goal--vision)
4. [What Needs to Be Done](#what-needs-to-be-done)
5. [Step-by-Step Implementation Guide](#step-by-step-implementation-guide)
6. [Shopify Setup Guide](#shopify-setup-guide)

---

## What This Project Is About

### The Business Context

**Anthony** is rebuilding his e-commerce platform from a single-site custom solution into a **headless Shopify multi-store architecture**.

**Key Requirements:**

- **10+ branded storefronts** (e.g., CustomFrameSizes.com, and 9+ other domains)
- **Shared codebase** - All stores use the same frame designer/configurator
- **Per-domain branding** - Each store can have different colors, logos, navigation
- **Headless Shopify** - Frontend is React/TypeScript, backend is Shopify APIs
- **Vercel deployment** - Each storefront deployed separately on Vercel
- **SEO migration** - Need to preserve SEO rankings when migrating existing sites

### The Technical Challenge

You need to transform a **single-brand application** into a **multi-tenant monorepo** where:

- 10+ storefronts share 90% of the code
- Each storefront can override branding/config per domain
- All stores use the same frame designer but with different branding
- Shopify handles payments, inventory, and order management
- Vercel hosts each storefront independently

---

## Current Structure (Original Codebase)

### What Exists: `CustomFrameSizes-CODE`

This is a **production-ready single-brand custom frame designer** built with:

#### Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js server
- **Database**: PostgreSQL with Drizzle ORM
- **UI**: Tailwind CSS + Shadcn/ui components
- **State**: Zustand + TanStack Query
- **Routing**: Wouter (lightweight React router)
- **Styling**: Tailwind CSS with custom theme

#### Key Features Already Built

1. **Frame Designer** (`client/src/components/FrameDesigner.tsx`)
   - Real-time preview with customizable dimensions
   - Frame style selection
   - Mat board customization (single/double)
   - Glass/acrylic options
   - Dynamic pricing calculation

2. **Specialty Designers** (`client/src/components/specialty/`)
   - Shadowbox Designer (military memorabilia)
   - Jersey Frame Designer
   - Canvas Float Designer
   - Puzzle Frame Designer
   - Comic Book Frame Designer
   - Playbill Frame Designer
   - And more...

3. **Pricing Engine** (`client/src/services/pricing.ts`)
   - Per-linear-inch calculations
   - Oversize fees
   - Mat pricing (single vs double)
   - Glass upgrade pricing

4. **Product Data** (`data/`)
   - `frames.json` - Frame styles with pricing
   - `mats.json` - Mat board colors
   - `glass.json` - Glass/acrylic options
   - `pricing-config.json` - Pricing rules

5. **Shopify Integration (Scaffold)** (`client/src/services/shopify.ts`)
   - Basic Storefront API client
   - Mock mode when credentials not configured
   - Checkout creation with custom attributes
   - **NOT production-ready** - needs full implementation

6. **Brand Configuration** (`shared/brand.config.ts`)
   - Single brand config for CustomFrameSizes.com
   - Site name, contact info, metadata
   - **Needs to become multi-store system**

7. **Backend API** (`server/`)
   - Express routes for file uploads
   - Order file management
   - Image processing
   - **Needs Shopify Admin API integration**

#### Current Architecture Problems

1. **Single Brand Only** - Hardcoded to CustomFrameSizes.com
2. **No Monorepo** - Everything in one app
3. **Shopify Integration Incomplete** - Only basic scaffold exists
4. **No Multi-Store Support** - Can't run multiple domains
5. **No Shared Packages** - Code not organized for reuse
6. **Deployment** - Currently on Replit, needs Vercel migration

---

## The Goal & Vision

### End State: Multi-Store Monorepo

```
framecraft-monorepo/
├── apps/                          # Individual storefronts
│   ├── customframesizes/          # CustomFrameSizes.com
│   ├── store-b/                   # Second store
│   ├── store-c/                   # Third store
│   └── ...                        # 10+ stores total
│
├── packages/                      # Shared code
│   ├── ui/                        # Shared UI components
│   ├── core/                      # Business logic (pricing, products)
│   ├── config/                    # Configuration system
│   ├── shopify/                   # Shopify API clients
│   ├── data/                      # Product catalogs
│   └── types/                     # TypeScript types
│
├── apps/api/                      # Serverless API (Vercel functions)
│   ├── cart/                      # Cart management endpoints
│   ├── checkout/                  # Checkout endpoints
│   └── orders/                    # Order management
│
└── content/                       # Shared content (blog, pages)
```

### How It Works

1. **Shared Frame Designer**
   - One codebase in `packages/ui/`
   - All stores import and use it
   - Changes propagate to all stores automatically

2. **Per-Store Branding**
   - Each store has `apps/{store-name}/src/brand.config.ts`
   - Overrides colors, logos, navigation
   - Can disable/enable features per store

3. **Shopify Integration**
   - **Storefront API** (client-side): Product queries, cart creation
   - **Admin API** (server-side): Secure cart management, order processing
   - Each store connects to its own Shopify store

4. **Vercel Deployment**
   - Each store = separate Vercel project
   - Shared API = one Vercel project with multiple routes
   - Environment variables per store

---

## What Needs to Be Done

### Phase 1: Foundation (Weeks 1-4)

1. **Create Monorepo Structure**
   - Set up npm/pnpm workspaces
   - Configure Turborepo for builds
   - Create package structure

2. **Extract Shared Packages**
   - Move UI components to `packages/ui/`
   - Move business logic to `packages/core/`
   - Move config system to `packages/config/`
   - Move product data to `packages/data/`

3. **Build Shopify Integration**
   - Complete Storefront API implementation
   - Build Admin API server-side layer
   - Create GraphQL query fragments
   - Implement cart management

4. **Multi-Store Configuration System**
   - Design config schema
   - Build theme override system
   - Create component override mechanism

### Phase 2: First Store Launch (Weeks 5-8)

1. **Create First Store App**
   - Set up Next.js or Vite app
   - Configure branding
   - Connect to Shopify

2. **Deploy to Vercel**
   - Set up Vercel project
   - Configure environment variables
   - Deploy and test

### Phase 3: Scale (Weeks 9+)

1. **Launch Additional Stores**
   - Replicate successful pattern
   - Configure per-store branding
   - Deploy each independently

2. **SEO Migration**
   - Set up redirects
   - Migrate content
   - Preserve rankings

---

## Step-by-Step Implementation Guide

### Step 1: Understand the Current Codebase

**What to Review:**

1. **Frame Designer** - `CustomFrameSizes-CODE/client/src/components/FrameDesigner.tsx`
   - This is the core product - understand how it works
   - Note all dependencies and state management

2. **Pricing Service** - `CustomFrameSizes-CODE/client/src/services/pricing.ts`
   - Understand pricing calculation logic
   - Note all pricing rules and fees

3. **Product Data** - `CustomFrameSizes-CODE/data/`
   - Review frames.json, mats.json, glass.json
   - Understand data structure

4. **Shopify Service** - `CustomFrameSizes-CODE/client/src/services/shopify.ts`
   - See what's already implemented (basic scaffold)
   - Understand what's missing

5. **Brand Config** - `CustomFrameSizes-CODE/shared/brand.config.ts`
   - See current single-brand structure
   - Plan how to make it multi-store

**Action Items:**

- [ ] Read through FrameDesigner.tsx
- [ ] Review pricing.ts logic
- [ ] Examine data files structure
- [ ] Review shopify.ts to see what exists
- [ ] Understand brand.config.ts structure

---

### Step 2: Set Up Monorepo Foundation

**Create New Repository Structure:**

```bash
# Create new monorepo directory
mkdir framecraft-monorepo
cd framecraft-monorepo

# Initialize npm workspace
npm init -y

# Create directory structure
mkdir -p apps packages content data docs
mkdir -p apps/api apps/customframesizes
mkdir -p packages/ui packages/core packages/config packages/shopify packages/data packages/types
```

**Root `package.json`:**

```json
{
  "name": "framecraft-monorepo",
  "version": "0.1.0",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint",
    "type-check": "turbo run type-check"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "typescript": "^5.6.0"
  }
}
```

**Install Turborepo:**

```bash
npm install -D turbo
npx turbo init
```

**Create `turbo.json`:**

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "type-check": {}
  }
}
```

**Action Items:**

- [ ] Create monorepo directory structure
- [ ] Set up npm workspaces
- [ ] Install and configure Turborepo
- [ ] Create base TypeScript config
- [ ] Set up ESLint/Prettier

---

### Step 3: Extract Shared Packages

#### 3.1 Create `packages/data` Package

**Purpose:** Product catalogs (frames, mats, glass, pricing config)

```bash
cd packages/data
npm init -y
```

**Structure:**

```
packages/data/
├── package.json
├── src/
│   ├── frames.ts          # Export frames.json
│   ├── mats.ts            # Export mats.json
│   ├── glass.ts           # Export glass.json
│   ├── pricing.ts         # Export pricing-config.json
│   └── index.ts           # Barrel export
└── data/                  # Copy from CustomFrameSizes-CODE/data/
    ├── frames.json
    ├── mats.json
    ├── glass.json
    └── pricing-config.json
```

**`packages/data/package.json`:**

```json
{
  "name": "@framecraft/data",
  "version": "0.1.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts"
  }
}
```

#### 3.2 Create `packages/types` Package

**Purpose:** Shared TypeScript type definitions

```bash
cd packages/types
npm init -y
```

**Structure:**

```
packages/types/
├── package.json
└── src/
    ├── products.ts        # Frame, mat, glass types
    ├── pricing.ts         # Pricing types
    ├── shopify.ts        # Shopify API types
    └── index.ts
```

**Copy types from:** `CustomFrameSizes-CODE/client/src/types/products.ts`

#### 3.3 Create `packages/core` Package

**Purpose:** Business logic (pricing, products, validation)

```bash
cd packages/core
npm init -y
```

**Structure:**

```
packages/core/
├── package.json
└── src/
    ├── services/
    │   ├── pricing.ts     # Copy from CustomFrameSizes-CODE
    │   ├── products.ts    # Copy from CustomFrameSizes-CODE
    │   └── validation.ts  # Copy from CustomFrameSizes-CODE
    ├── utils/
    │   └── dimensions.ts  # Copy dimension utilities
    └── index.ts
```

**Dependencies:**

- `@framecraft/data` - For product catalogs
- `@framecraft/types` - For type definitions

#### 3.4 Create `packages/ui` Package

**Purpose:** Shared UI components (Frame Designer, specialty designers)

```bash
cd packages/ui
npm init -y
```

**Structure:**

```
packages/ui/
├── package.json
└── src/
    ├── components/
    │   ├── FrameDesigner.tsx      # Main designer
    │   ├── ShadowboxDesigner.tsx
    │   ├── JerseyDesigner.tsx
    │   └── ... (all specialty designers)
    ├── components/ui/              # Shadcn components
    └── index.ts
```

**Dependencies:**

- React, React DOM
- Tailwind CSS
- Shadcn/ui components
- `@framecraft/core` - For business logic
- `@framecraft/types` - For types

#### 3.5 Create `packages/config` Package

**Purpose:** Multi-store configuration system

```bash
cd packages/config
npm init -y
```

**Structure:**

```
packages/config/
├── package.json
└── src/
    ├── brand-config.ts    # Brand config types & utilities
    ├── theme.ts           # Theme system
    ├── features.ts        # Feature flags
    └── index.ts
```

**Action Items:**

- [ ] Create packages/data and copy product data
- [ ] Create packages/types and extract types
- [ ] Create packages/core and move business logic
- [ ] Create packages/ui and extract components
- [ ] Create packages/config for multi-store system
- [ ] Set up package dependencies between packages

---

### Step 4: Build Shopify Integration

#### 4.1 Create `packages/shopify` Package

**Purpose:** Shopify API clients (Storefront + Admin)

```bash
cd packages/shopify
npm init -y
```

**Structure:**

```
packages/shopify/
├── package.json
└── src/
    ├── storefront/        # Storefront API (client-side)
    │   ├── client.ts      # GraphQL client
    │   ├── queries.ts     # Product queries
    │   ├── mutations.ts   # Cart mutations
    │   └── fragments.ts   # GraphQL fragments
    ├── admin/            # Admin API (server-side)
    │   ├── client.ts      # Admin API client
    │   └── mutations.ts   # Admin mutations
    └── index.ts
```

#### 4.2 Implement Storefront API

**File: `packages/shopify/src/storefront/client.ts`**

```typescript
export class ShopifyStorefrontClient {
  private domain: string;
  private token: string;
  private endpoint: string;

  constructor(domain: string, token: string) {
    this.domain = domain;
    this.token = token;
    this.endpoint = `https://${domain}/api/2024-01/graphql.json`;
  }

  async query<T>(query: string, variables?: Record<string, any>): Promise<T> {
    const response = await fetch(this.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": this.token,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
    }

    return data.data as T;
  }
}
```

**File: `packages/shopify/src/storefront/fragments.ts`**

```typescript
// Reusable GraphQL fragments for products
export const PRODUCT_FIELDS = `
  fragment ProductFields on Product {
    id
    title
    description
    handle
    images(first: 10) {
      edges {
        node {
          url
          altText
        }
      }
    }
    variants(first: 100) {
      edges {
        node {
          id
          title
          price {
            amount
            currencyCode
          }
          availableForSale
        }
      }
    }
  }
`;

export const CART_FIELDS = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      totalAmount {
        amount
        currencyCode
      }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              price {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
`;
```

**File: `packages/shopify/src/storefront/queries.ts`**

```typescript
import { PRODUCT_FIELDS } from "./fragments";

export async function getProductByHandle(client: ShopifyStorefrontClient, handle: string) {
  const query = `
    ${PRODUCT_FIELDS}
    query GetProductByHandle($handle: String!) {
      product(handle: $handle) {
        ...ProductFields
      }
    }
  `;

  return client.query<{ product: Product }>(query, { handle });
}

export async function getProducts(client: ShopifyStorefrontClient, first: number = 50) {
  const query = `
    ${PRODUCT_FIELDS}
    query GetProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            ...ProductFields
          }
        }
      }
    }
  `;

  return client.query<{ products: { edges: Array<{ node: Product }> } }>(query, { first });
}
```

**File: `packages/shopify/src/storefront/mutations.ts`**

```typescript
import { CART_FIELDS } from "./fragments";

export async function createCart(
  client: ShopifyStorefrontClient,
  lineItems: Array<{
    variantId: string;
    quantity: number;
    customAttributes?: Array<{ key: string; value: string }>;
  }>
) {
  const mutation = `
    ${CART_FIELDS}
    mutation CartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          ...CartFields
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const result = await client.query<{
    cartCreate: {
      cart: Cart | null;
      userErrors: Array<{ field: string[]; message: string }>;
    };
  }>(mutation, {
    input: {
      lines: lineItems,
    },
  });

  if (result.cartCreate.userErrors.length > 0) {
    throw new Error(
      `Cart creation failed: ${result.cartCreate.userErrors.map((e) => e.message).join(", ")}`
    );
  }

  if (!result.cartCreate.cart) {
    throw new Error("Cart creation returned null");
  }

  return result.cartCreate.cart;
}

export async function updateCart(
  client: ShopifyStorefrontClient,
  cartId: string,
  lines: Array<{ id: string; quantity: number }>
) {
  const mutation = `
    ${CART_FIELDS}
    mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          ...CartFields
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const result = await client.query<{
    cartLinesUpdate: {
      cart: Cart | null;
      userErrors: Array<{ field: string[]; message: string }>;
    };
  }>(mutation, {
    cartId,
    lines,
  });

  if (result.cartLinesUpdate.userErrors.length > 0) {
    throw new Error(
      `Cart update failed: ${result.cartLinesUpdate.userErrors.map((e) => e.message).join(", ")}`
    );
  }

  return result.cartLinesUpdate.cart;
}
```

#### 4.3 Implement Admin API (Server-Side)

**File: `packages/shopify/src/admin/client.ts`**

```typescript
export class ShopifyAdminClient {
  private domain: string;
  private accessToken: string;
  private endpoint: string;

  constructor(domain: string, accessToken: string) {
    this.domain = domain;
    this.accessToken = accessToken;
    this.endpoint = `https://${domain}/admin/api/2024-01/graphql.json`;
  }

  async query<T>(query: string, variables?: Record<string, any>): Promise<T> {
    const response = await fetch(this.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": this.accessToken,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(`Shopify Admin API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
    }

    return data.data as T;
  }
}
```

**Action Items:**

- [ ] Create packages/shopify structure
- [ ] Implement Storefront API client
- [ ] Create GraphQL fragments
- [ ] Build product query functions
- [ ] Implement cart mutations
- [ ] Build Admin API client (server-side)
- [ ] Create secure cart management endpoints

---

### Step 5: Build Multi-Store Configuration System

#### 5.1 Design Configuration Schema

**File: `packages/config/src/brand-config.ts`**

```typescript
export interface BrandConfig {
  // Identity
  siteName: string;
  legalName: string;
  siteUrl: string;

  // SEO
  defaultTitle: string;
  defaultDescription: string;
  ogImage?: string;

  // Contact
  contactEmail: string;
  contactPhone?: string;

  // Theme
  theme?: {
    colors?: {
      primary?: string;
      accent?: string;
      // ... more color overrides
    };
    fonts?: {
      heading?: string;
      body?: string;
    };
  };

  // Features
  features?: {
    enableShadowbox?: boolean;
    enableJersey?: boolean;
    enableCanvas?: boolean;
    // ... feature flags
  };

  // Navigation
  navigation?: {
    items?: Array<{ label: string; path: string }>;
  };

  // Shopify
  shopify: {
    domain: string;
    storefrontToken: string;
    adminToken?: string; // Server-side only
  };
}

export function mergeBrandConfig(base: BrandConfig, overrides: Partial<BrandConfig>): BrandConfig {
  return {
    ...base,
    ...overrides,
    theme: {
      ...base.theme,
      ...overrides.theme,
      colors: {
        ...base.theme?.colors,
        ...overrides.theme?.colors,
      },
    },
    features: {
      ...base.features,
      ...overrides.features,
    },
  };
}
```

#### 5.2 Create Store Context Provider

**File: `packages/config/src/store-context.tsx`**

```typescript
import React, { createContext, useContext } from 'react';
import type { BrandConfig } from './brand-config';

const StoreContext = createContext<BrandConfig | null>(null);

export function StoreProvider({
  config,
  children,
}: {
  config: BrandConfig;
  children: React.ReactNode;
}) {
  return (
    <StoreContext.Provider value={config}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStoreConfig(): BrandConfig {
  const config = useContext(StoreContext);
  if (!config) {
    throw new Error('useStoreConfig must be used within StoreProvider');
  }
  return config;
}
```

**Action Items:**

- [ ] Design brand config schema
- [ ] Create theme merge utilities
- [ ] Build StoreProvider component
- [ ] Create useStoreConfig hook
- [ ] Document configuration options

---

### Step 6: Create First Store Application

#### 6.1 Set Up Next.js App (or Vite)

**Option A: Next.js (Recommended for SEO)**

```bash
cd apps/customframesizes
npx create-next-app@latest . --typescript --tailwind --app
```

**Option B: Vite (Faster, simpler)**

```bash
cd apps/customframesizes
npm create vite@latest . -- --template react-ts
```

#### 6.2 Install Shared Packages

**`apps/customframesizes/package.json`:**

```json
{
  "name": "@framecraft/customframesizes",
  "version": "0.1.0",
  "dependencies": {
    "@framecraft/ui": "workspace:*",
    "@framecraft/core": "workspace:*",
    "@framecraft/config": "workspace:*",
    "@framecraft/shopify": "workspace:*",
    "@framecraft/data": "workspace:*",
    "@framecraft/types": "workspace:*",
    "react": "^18.3.0",
    "react-dom": "^18.3.0"
  }
}
```

#### 6.3 Create Store Brand Config

**File: `apps/customframesizes/src/brand.config.ts`:**

```typescript
import type { BrandConfig } from "@framecraft/config";

export const brandConfig: BrandConfig = {
  siteName: "CustomFrameSizes.com",
  legalName: "CustomPictureFrames LLC",
  siteUrl: "https://customframesizes.com",
  defaultTitle: "Custom Picture Frames - Exact Sizes",
  defaultDescription: "Design custom picture frames...",
  contactEmail: "hello@customframesizes.com",
  contactPhone: "1 (888) 874-7156",

  shopify: {
    domain: process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN!,
    storefrontToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!,
  },

  features: {
    enableShadowbox: true,
    enableJersey: true,
    enableCanvas: true,
    // ... all features enabled
  },
};
```

#### 6.4 Set Up App with Store Provider

**File: `apps/customframesizes/src/app/layout.tsx` (Next.js):**

```typescript
import { StoreProvider } from '@framecraft/config';
import { brandConfig } from '../brand.config';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <StoreProvider config={brandConfig}>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
```

#### 6.5 Use Frame Designer

**File: `apps/customframesizes/src/app/page.tsx`:**

```typescript
import { FrameDesigner } from '@framecraft/ui';
import { useStoreConfig } from '@framecraft/config';

export default function HomePage() {
  const config = useStoreConfig();

  return (
    <div>
      <h1>{config.siteName}</h1>
      <FrameDesigner />
    </div>
  );
}
```

**Action Items:**

- [ ] Create Next.js or Vite app
- [ ] Install shared packages
- [ ] Create brand.config.ts
- [ ] Set up StoreProvider
- [ ] Import and use FrameDesigner
- [ ] Test locally

---

### Step 7: Build Server-Side API

#### 7.1 Create API Package

**Structure:**

```
apps/api/
├── package.json
└── src/
    ├── routes/
    │   ├── cart/
    │   │   ├── create.ts      # POST /api/cart
    │   │   └── update.ts      # PATCH /api/cart/lines
    │   ├── checkout/
    │   │   └── create.ts       # POST /api/checkout
    │   └── orders/
    │       └── files.ts        # POST /api/orders/files
    └── lib/
        ├── shopify-admin.ts    # Admin API client
        └── validation.ts       # Request validation
```

#### 7.2 Implement Cart Endpoint

**File: `apps/api/src/routes/cart/create.ts` (Vercel Serverless Function):**

```typescript
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { ShopifyAdminClient } from "@framecraft/shopify";
import { z } from "zod";

const createCartSchema = z.object({
  lineItems: z.array(
    z.object({
      variantId: z.string(),
      quantity: z.number().int().positive(),
      customAttributes: z
        .array(
          z.object({
            key: z.string(),
            value: z.string(),
          })
        )
        .optional(),
    })
  ),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Validate request
    const body = createCartSchema.parse(req.body);

    // Get Shopify credentials from environment
    const domain = process.env.SHOPIFY_DOMAIN!;
    const adminToken = process.env.SHOPIFY_ADMIN_TOKEN!;

    // Create Admin API client
    const adminClient = new ShopifyAdminClient(domain, adminToken);

    // Create cart using Admin API
    // (Implementation depends on Admin API cart mutations)

    // Set HTTP-only cookie with cart ID
    res.setHeader("Set-Cookie", `cart_id=${cartId}; HttpOnly; Secure; SameSite=Strict; Path=/`);

    return res.status(200).json({ cartId, checkoutUrl });
  } catch (error) {
    console.error("Cart creation error:", error);
    return res.status(500).json({ error: "Failed to create cart" });
  }
}
```

**Action Items:**

- [ ] Create apps/api structure
- [ ] Implement cart creation endpoint
- [ ] Implement cart update endpoint
- [ ] Implement checkout endpoint
- [ ] Add request validation
- [ ] Add error handling
- [ ] Set up HTTP-only cookies

---

### Step 8: Set Up Vercel Deployment

#### 8.1 Configure Vercel Projects

**For Each Store:**

1. Create new Vercel project
2. Connect GitHub repository
3. Set root directory: `apps/customframesizes`
4. Configure build command: `npm run build`
5. Set environment variables

**Environment Variables Per Store:**

```
NEXT_PUBLIC_SHOPIFY_DOMAIN=store-name.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=your_storefront_token
SHOPIFY_ADMIN_TOKEN=your_admin_token (server-side only)
```

#### 8.2 Configure API Project

1. Create separate Vercel project for API
2. Root directory: `apps/api`
3. Configure serverless functions
4. Set environment variables for each store's Shopify credentials

**Action Items:**

- [ ] Create Vercel project for first store
- [ ] Configure build settings
- [ ] Set environment variables
- [ ] Deploy and test
- [ ] Set up custom domain
- [ ] Configure API project separately

---

## Shopify Setup Guide

### Current State: Empty Shopify Store

You mentioned your Shopify store is empty - just the basic structure. Here's what you need to set up:

### Step 1: Create Products in Shopify

#### 1.1 Create "Custom Picture Frame" Product

1. Go to **Products** → **Add product**
2. **Title**: "Custom Picture Frame"
3. **Description**: "Custom picture frame with your exact dimensions"
4. **Price**: $0.00 (pricing is calculated dynamically)
5. **Variants**: Create one variant (e.g., "Standard")
6. **Save** and note the **Variant ID** (looks like `gid://shopify/ProductVariant/12345678`)

#### 1.2 Create Additional Products (Optional)

- "Custom Mat Board" - For mat-only orders
- "Shadowbox Frame" - For shadowbox orders
- "Jersey Frame" - For jersey orders
- etc.

### Step 2: Set Up Storefront API

#### 2.1 Create Storefront API Access Token

1. Go to **Settings** → **Apps and sales channels**
2. Click **Develop apps** → **Create an app**
3. Name it: "Headless Storefront"
4. Go to **API credentials** → **Storefront API**
5. Click **Configure** and enable:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_write_checkouts`
   - `unauthenticated_read_checkouts`
6. Click **Save** → **Install app**
7. **Copy the Storefront API access token**

#### 2.2 Set Up Admin API (For Server-Side)

1. In the same app, go to **Admin API integration**
2. Enable scopes:
   - `write_orders`
   - `read_orders`
   - `write_products` (if needed)
3. **Install app** and **copy Admin API access token**

### Step 3: Configure Environment Variables

**In Vercel (or local `.env`):**

```bash
# Storefront API (client-side, safe to expose)
NEXT_PUBLIC_SHOPIFY_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=your_storefront_token_here

# Admin API (server-side only, NEVER expose)
SHOPIFY_ADMIN_TOKEN=your_admin_token_here

# Product Variant IDs
NEXT_PUBLIC_SHOPIFY_FRAME_VARIANT_ID=gid://shopify/ProductVariant/12345678
NEXT_PUBLIC_SHOPIFY_MAT_VARIANT_ID=gid://shopify/ProductVariant/12345679
```

### Step 4: Test Integration

1. **Test Product Query:**
   - Use Storefront API to fetch products
   - Verify product data structure

2. **Test Cart Creation:**
   - Create cart with frame configuration
   - Verify custom attributes are attached

3. **Test Checkout:**
   - Complete checkout flow
   - Verify order appears in Shopify admin
   - Check custom attributes in order

---

## Next Steps Summary

### Immediate Actions (This Week)

1. **Review Current Codebase**
   - Understand FrameDesigner structure
   - Review pricing logic
   - Examine Shopify service

2. **Set Up Monorepo**
   - Create directory structure
   - Configure npm workspaces
   - Set up Turborepo

3. **Extract First Package**
   - Start with `packages/data`
   - Copy product data files
   - Test package import

4. **Shopify Setup**
   - Create products in Shopify
   - Generate API tokens
   - Test basic API calls

### Week 2-3

1. **Extract All Packages**
   - Complete packages extraction
   - Set up dependencies
   - Test package imports

2. **Build Shopify Integration**
   - Complete Storefront API
   - Build Admin API layer
   - Test cart/checkout flow

3. **Multi-Store Config**
   - Design config system
   - Build theme system
   - Create StoreProvider

### Week 4+

1. **First Store App**
   - Create Next.js app
   - Connect shared packages
   - Deploy to Vercel

2. **Test & Iterate**
   - Test full flow
   - Fix issues
   - Optimize

3. **Scale**
   - Launch additional stores
   - Refine process
   - Document everything

---

## Key Concepts to Understand

### 1. Monorepo vs Multi-Repo

**Monorepo (This Project):**

- All code in one repository
- Shared packages used by multiple apps
- Single source of truth
- Easier to maintain consistency

**Multi-Repo (Alternative):**

- Separate repo per store
- Code duplication
- Harder to keep in sync

### 2. Headless Commerce

**Traditional:**

- Shopify theme handles everything
- Limited customization

**Headless (This Project):**

- Custom React frontend
- Shopify handles payments/orders
- Full design control
- Better performance

### 3. Multi-Tenant Architecture

**Single Tenant (Current):**

- One app = one brand
- Hardcoded configuration

**Multi-Tenant (Goal):**

- One codebase = many brands
- Configuration per domain
- Shared features, unique branding

### 4. Workspace Protocol

**`workspace:*` in package.json:**

- Tells npm/pnpm to use local package
- No version numbers needed
- Always uses latest from workspace

---

## Common Questions

### Q: Why not just copy the code for each store?

**A:** Because:

- Bug fixes need to be applied 10+ times
- Features need to be built 10+ times
- Inconsistencies between stores
- Maintenance nightmare

### Q: Can stores have different features?

**A:** Yes! Use feature flags:

```typescript
const config = useStoreConfig();
if (config.features?.enableShadowbox) {
  // Show shadowbox designer
}
```

### Q: How do I deploy updates?

**A:**

1. Update shared package
2. Run `npm run build` in monorepo
3. Vercel auto-deploys all stores
4. All stores get the update

### Q: What if one store needs custom code?

**A:** Two options:

1. **Component Override** - Store can override specific components
2. **Feature Flag** - Add feature, enable only for that store

---

## Resources

### Documentation to Read

1. **Shopify Storefront API**: https://shopify.dev/docs/api/storefront
2. **Shopify Admin API**: https://shopify.dev/docs/api/admin-graphql
3. **Turborepo**: https://turbo.build/repo/docs
4. **npm Workspaces**: https://docs.npmjs.com/cli/v7/using-npm/workspaces
5. **Vercel Deployment**: https://vercel.com/docs

### Tools You'll Need

- **Node.js** 18+
- **npm** or **pnpm**
- **Git**
- **Vercel CLI** (optional)
- **Shopify CLI** (optional, for testing)

---

## Getting Help

If you get stuck:

1. **Review the code** - The original codebase has working examples
2. **Check Shopify docs** - API documentation is comprehensive
3. **Test incrementally** - Build one piece at a time
4. **Use TypeScript** - It will catch many errors early

---

**Good luck! This is a complex but rewarding project. Take it step by step, and you'll have a powerful multi-store platform.**
