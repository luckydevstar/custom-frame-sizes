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

Required environment variables (set in Vercel):

- `SHOPIFY_ADMIN_API_TOKEN_<STORE_ID>` - Admin API tokens
- `SHOPIFY_STORE_DOMAIN_<STORE_ID>` - Store domains
- `NODE_ENV` - Environment (development/production)

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
