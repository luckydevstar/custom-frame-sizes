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
├── src/
│   ├── routes/          # API route handlers
│   ├── lib/            # Shared utilities
│   └── types/          # TypeScript types
└── __tests__/          # Test files
```

## Route Structure

Routes use Vercel's file-based routing:

- `src/routes/cart/route.ts` → `/api/cart`
- `src/routes/cart/lines/route.ts` → `/api/cart/lines`
- `src/routes/checkout/route.ts` → `/api/checkout`

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

All route handlers use the `withRouteHandler` wrapper:

```typescript
import { withRouteHandler, sendSuccess } from "../../lib/route-handler";

export default withRouteHandler({
  POST: async (req, res) => {
    // Handler implementation
    sendSuccess(res, { data: "result" });
  },
});
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

The API registers store config from these env vars when handling requests (see `src/lib/store-config.ts`).

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
