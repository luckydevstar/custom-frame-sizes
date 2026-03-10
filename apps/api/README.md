# FrameCraft API

Serverless API for Shopify Admin API integration, deployed on Vercel.

## Overview

This API provides secure backend-for-frontend endpoints for:

- Cart management
- Checkout creation
- Order file management

All Admin API operations are performed server-side to keep credentials secure.

## Architecture

See [Backend API Architecture](../../docs/BACKEND_API_ARCHITECTURE.md) for detailed design.

## Directory Structure

```
apps/api/
├── api/                 # Vercel serverless functions (file-based routing)
│   ├── health.ts        # GET /api/health
│   ├── cart.ts          # POST /api/cart
│   ├── cart/lines.ts    # PATCH /api/cart/lines
│   ├── checkout.ts      # POST /api/checkout
│   └── orders/files/    # GET,POST /api/orders/files and GET /api/orders/files/:id
├── shared/              # Shared code (included in function bundle; no leading _)
│   ├── lib/             # Utilities (route-handler, errors, cart-utils, etc.)
│   └── types/           # TypeScript types (requests, order-files, responses)
└── __tests__/           # Test files
```

## Route Structure

Routes use Vercel's `api/` file-based routing:

- `api/health.ts` → `/api/health`
- `api/cart.ts` → `/api/cart`
- `api/cart/lines.ts` → `/api/cart/lines`
- `api/checkout.ts` → `/api/checkout`
- `api/orders/files.ts` → `/api/orders/files`
- `api/orders/files/[id].ts` → `/api/orders/files/:id`

## Development

### Local Development

```bash
# Install dependencies
npm install

# Type check
npm run type-check

# Lint
npm run lint

# Run tests
npm run test
```

### Route Handler Pattern

All route handlers use the `withRouteHandler` wrapper from `shared/lib/route-handler.ts`:

```typescript
import { withRouteHandler, sendSuccess } from "../shared/lib/route-handler";

export default applyRateLimit(
  "endpoint",
  withRouteHandler({
    POST: async (req, res) => {
      // Handler implementation
      sendSuccess(res, { data: "result" });
    },
  })
);
```

## Environment Variables

Set these in Vercel (Project → Settings → Environment Variables).

**Required for cart/checkout (Storefront API):**

- `SHOPIFY_STORE_DOMAIN` – Shopify store domain (e.g. `your-store.myshopify.com`)
- `SHOPIFY_STOREFRONT_TOKEN` – Storefront API access token (from Shopify Admin → Settings → Apps → Develop apps → [App] → Storefront API)

**Optional:**

- `SHOPIFY_API_VERSION` – API version (default `2024-01`)

**Multi-store:** For multiple stores (e.g. store-a, store-b), use per-store vars. Store ID in the key uses underscores (e.g. `store-a` → `store_a`):

- `SHOPIFY_STORE_DOMAIN_store_a` – domain for store "store-a"
- `SHOPIFY_STOREFRONT_TOKEN_store_a` – Storefront token for store "store-a"

The API registers store config from these env vars when handling requests (see `shared/lib/store-config.ts`).

## Deployment

Deploy to Vercel:

```bash
vercel deploy
```

Routes are automatically deployed as serverless functions.

## Testing

```bash
# Run tests
npm run test

# Watch mode
npm run test:watch
```

## Related Documentation

- [Backend API Architecture](../../docs/BACKEND_API_ARCHITECTURE.md)
- [Phase 1 Tickets](../../docs/PHASE1_TICKETS.md)
