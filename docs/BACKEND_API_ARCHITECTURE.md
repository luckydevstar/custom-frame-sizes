# Backend API Architecture

**Date**: January 13, 2026  
**Phase**: 1.4 - Shopify Admin API Integration  
**Status**: Design Complete

---

## Overview

This document defines the serverless API architecture for the FrameCraft monorepo, designed for Vercel deployment with secure Shopify Admin API access.

### Design Goals

1. **Security**: Admin API credentials never exposed to client
2. **Scalability**: Serverless functions for automatic scaling
3. **Performance**: Optimized for cold start and response times
4. **Maintainability**: Clear separation of concerns, testable
5. **Multi-Store**: Support for multiple Shopify stores

---

## Architecture Pattern

### Backend-for-Frontend (BFF)

The API acts as a secure backend-for-frontend layer:

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Client    │────────▶│  API Routes  │────────▶│Shopify Admin│
│ (Browser)   │  HTTPS  │ (Serverless) │  HTTPS  │     API     │
└─────────────┘         └──────────────┘         └─────────────┘
                              │
                              ▼
                        ┌─────────────┐
                        │  Database   │
                        │  (Future)   │
                        └─────────────┘
```

**Benefits**:

- Admin API tokens stored server-side only
- Request validation and sanitization
- Rate limiting and abuse prevention
- Unified error handling
- Cookie-based session management

---

## Technology Stack

### Runtime

- **Platform**: Vercel Serverless Functions
- **Runtime**: Node.js 18+ (ESM modules)
- **Framework**: Standalone serverless functions (not Next.js)
- **Language**: TypeScript

### Key Dependencies

- `@shopify/shopify-api` - Official Shopify Admin API client
- `zod` - Runtime validation and type safety
- `cookie` - HTTP cookie parsing
- `@vercel/node` - Vercel serverless utilities

---

## Directory Structure

```
apps/api/
├── package.json              # API app dependencies
├── tsconfig.json             # TypeScript config
├── vercel.json               # Vercel configuration
├── README.md                 # API documentation
│
├── src/
│   ├── index.ts              # Entry point (if needed)
│   │
│   ├── routes/               # API route handlers
│   │   ├── cart/
│   │   │   ├── route.ts      # POST /api/cart
│   │   │   └── lines/
│   │   │       └── route.ts  # PATCH /api/cart/lines
│   │   ├── checkout/
│   │   │   └── route.ts      # POST /api/checkout
│   │   └── orders/
│   │       └── files/
│   │           ├── route.ts  # POST /api/orders/files
│   │           └── [id]/
│   │               └── route.ts # GET /api/orders/files/:id
│   │
│   ├── lib/                  # Shared utilities
│   │   ├── route-handler.ts  # Route handler wrapper
│   │   ├── validation.ts     # Request validation
│   │   ├── sanitization.ts   # Input sanitization
│   │   ├── rate-limit.ts     # Rate limiting
│   │   ├── admin-client.ts   # Shopify Admin API client
│   │   ├── cookies.ts        # Cookie utilities
│   │   └── errors.ts         # Error handling
│   │
│   └── types/                # TypeScript types
│       ├── requests.ts       # Request schemas
│       ├── responses.ts      # Response schemas
│       └── cart.ts           # Cart types
│
└── __tests__/                # Test files
    ├── cart.test.ts
    ├── validation.test.ts
    └── helpers.ts
```

---

## API Route Structure

### Vercel File-Based Routing

Vercel uses file-based routing for serverless functions:

- `src/routes/cart/route.ts` → `/api/cart`
- `src/routes/cart/lines/route.ts` → `/api/cart/lines`
- `src/routes/checkout/route.ts` → `/api/checkout`
- `src/routes/orders/files/route.ts` → `/api/orders/files`
- `src/routes/orders/files/[id]/route.ts` → `/api/orders/files/:id`

### Route Handler Pattern

Each route exports HTTP method handlers:

```typescript
// src/routes/cart/route.ts
import { VercelRequest, VercelResponse } from "@vercel/node";
import { withRouteHandler } from "../../lib/route-handler";

export default withRouteHandler({
  POST: async (req: VercelRequest, res: VercelResponse) => {
    // Handler implementation
  },
});
```

---

## Endpoint Specifications

### Cart Management

#### `POST /api/cart`

Create a new cart and return cart ID in HTTP-only cookie.

**Request**:

```typescript
{
  storeId: string;           // Store identifier
  lines?: CartLineInput[];   // Optional initial items
}
```

**Response**:

```typescript
{
  success: true;
  cartId: string;
  cart: ShopifyCart;
}
```

**Cookies**:

- `cart_id` (HTTP-only, Secure, SameSite=Strict)

---

#### `PATCH /api/cart/lines`

Update cart line items (add, update, remove).

**Request**:

```typescript
{
  operation: 'add' | 'update' | 'remove';
  lines: CartLineInput[] | CartLineUpdateInput[] | string[];
}
```

**Response**:

```typescript
{
  success: true;
  cart: ShopifyCart;
}
```

**Cookies**:

- Reads `cart_id` from cookie
- Updates cookie if cart ID changes

---

### Checkout

#### `POST /api/checkout`

Create checkout session and return checkout URL.

**Request**:

```typescript
{
  storeId: string;
  discountCode?: string;
  shippingAddress?: AddressInput;
  customerEmail?: string;
}
```

**Response**:

```typescript
{
  success: true;
  checkoutUrl: string;
  checkoutId: string;
}
```

---

### Order Files

#### `POST /api/orders/files`

Upload file for an order.

**Request**:

```typescript
{
  orderId: string;
  file: File;  // Multipart form data
  metadata?: Record<string, string>;
}
```

**Response**:

```typescript
{
  success: true;
  fileId: string;
  fileUrl: string;
}
```

---

#### `GET /api/orders/files/:id`

Retrieve file metadata and download URL.

**Response**:

```typescript
{
  success: true;
  file: {
    id: string;
    orderId: string;
    url: string;
    metadata: Record<string, string>;
    createdAt: string;
  }
}
```

---

## Request/Response Schemas

### Common Request Headers

```
Content-Type: application/json
Cookie: cart_id=<cart-id>  (for cart operations)
```

### Common Response Headers

```
Content-Type: application/json
Set-Cookie: cart_id=<cart-id>; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000
```

### Error Response Format

```typescript
{
  success: false;
  error: {
    code: string;        // Error code (e.g., 'VALIDATION_ERROR')
    message: string;     // Human-readable message
    details?: unknown;   // Additional error details
  };
}
```

### Standard HTTP Status Codes

- `200 OK` - Success
- `201 Created` - Resource created
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error
- `503 Service Unavailable` - Shopify API unavailable

---

## Authentication & Security

### Admin API Token Management

- **Storage**: Environment variables (Vercel)
- **Format**: `SHOPIFY_ADMIN_API_TOKEN_<STORE_ID>`
- **Access**: Server-side only, never exposed to client
- **Rotation**: Manual rotation via Vercel dashboard

### Cookie Security

- **Name**: `cart_id`
- **HttpOnly**: `true` (prevents XSS)
- **Secure**: `true` (HTTPS only)
- **SameSite**: `Strict` (CSRF protection)
- **Max-Age**: `2592000` (30 days)
- **Path**: `/`

### Request Validation

All requests validated using Zod schemas:

```typescript
import { z } from "zod";

const CartRequestSchema = z.object({
  storeId: z.string().min(1),
  lines: z.array(CartLineSchema).optional(),
});

// In route handler
const validated = CartRequestSchema.parse(req.body);
```

### Input Sanitization

- Strip HTML tags from string inputs
- Validate variant IDs format (GID format)
- Enforce quantity limits (1-999)
- Validate attribute keys/values

---

## Rate Limiting Strategy

### Implementation

- **Method**: In-memory store (Vercel Edge Config for production)
- **Window**: 1 minute sliding window
- **Limits**:
  - `/api/cart` (POST): 10 requests/minute per IP
  - `/api/cart/lines` (PATCH): 30 requests/minute per IP
  - `/api/checkout` (POST): 5 requests/minute per IP
  - `/api/orders/files` (POST): 20 requests/minute per IP

### Response Headers

```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 7
X-RateLimit-Reset: 1640000000
```

### Rate Limit Exceeded Response

```typescript
{
  success: false;
  error: {
    code: 'RATE_LIMIT_EXCEEDED',
    message: 'Too many requests. Please try again later.',
    retryAfter: 30,  // seconds
  };
}
```

---

## API Versioning

### Strategy

- **Current Version**: `v1` (implicit)
- **Versioning Method**: URL path (`/api/v1/cart`)
- **Future Versions**: `/api/v2/cart` when breaking changes needed

### Version Header (Optional)

```
API-Version: v1
```

### Breaking Changes Policy

- Major version bump for breaking changes
- Maintain previous version for 6 months
- Deprecation warnings in response headers

---

## Error Handling

### Error Categories

1. **Validation Errors** (400)
   - Invalid request format
   - Missing required fields
   - Type mismatches

2. **Authentication Errors** (401)
   - Missing/invalid cart ID
   - Expired session

3. **Business Logic Errors** (400/404)
   - Invalid variant ID
   - Cart not found
   - Out of stock

4. **Shopify API Errors** (502/503)
   - Shopify API unavailable
   - Rate limit exceeded
   - Invalid Admin API token

5. **Server Errors** (500)
   - Unexpected exceptions
   - Database errors

### Error Response Format

```typescript
{
  success: false;
  error: {
    code: 'VALIDATION_ERROR' | 'CART_NOT_FOUND' | 'SHOPIFY_API_ERROR' | ...;
    message: string;
    details?: {
      field?: string;
      reason?: string;
    };
  };
}
```

### Error Logging

- Log all errors to Vercel logs
- Include request ID for tracing
- Never expose sensitive data in responses

---

## Shopify Admin API Integration

### Client Initialization

```typescript
import { shopifyApi, LATEST_API_VERSION } from "@shopify/shopify-api";

const client = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY!,
  apiSecretKey: process.env.SHOPIFY_ADMIN_API_TOKEN!,
  scopes: ["read_orders", "write_orders"],
  hostName: process.env.SHOPIFY_STORE_DOMAIN!,
  apiVersion: LATEST_API_VERSION,
});
```

### Store Configuration

- Store-specific Admin API tokens
- Multi-store support via `storeId` parameter
- Token lookup: `SHOPIFY_ADMIN_API_TOKEN_${storeId}`

### GraphQL Queries

Use Shopify Admin GraphQL API for:

- Cart creation/updates
- Checkout creation
- Order management

### REST API (Alternative)

Use REST API for:

- File uploads
- Simple operations

---

## Performance Optimization

### Cold Start Mitigation

- Minimize dependencies
- Use ES modules
- Lazy load heavy modules
- Keep functions small (< 1MB)

### Caching Strategy

- Cache store configurations
- Cache Shopify API responses (short TTL)
- Use Vercel Edge Config for static data

### Timeout Configuration

- **Hobby Plan**: 10 seconds max
- **Pro Plan**: 60 seconds max
- Set appropriate timeouts per endpoint

---

## Testing Strategy

### Unit Tests

- Route handlers
- Validation schemas
- Utility functions
- Error handling

### Integration Tests

- End-to-end API flows
- Shopify API mocking
- Cookie management
- Rate limiting

### Test Tools

- `vitest` - Test runner
- `supertest` - HTTP assertions
- `@shopify/shopify-api` - Mock Shopify client

---

## Monitoring & Observability

### Logging

- Request/response logging
- Error logging with stack traces
- Performance metrics
- Shopify API call logging

### Metrics

- Request count per endpoint
- Error rate
- Response time (p50, p95, p99)
- Shopify API latency

### Alerts

- High error rate (> 5%)
- Shopify API failures
- Rate limit violations
- Slow responses (> 2s)

---

## Deployment

### Vercel Configuration

```json
{
  "functions": {
    "apps/api/src/routes/**/*.ts": {
      "runtime": "nodejs18.x",
      "maxDuration": 10
    }
  },
  "env": {
    "SHOPIFY_ADMIN_API_TOKEN_STORE_A": "...",
    "SHOPIFY_ADMIN_API_TOKEN_STORE_B": "..."
  }
}
```

### Environment Variables

- `SHOPIFY_ADMIN_API_TOKEN_<STORE_ID>` - Admin API tokens
- `SHOPIFY_STORE_DOMAIN_<STORE_ID>` - Store domains
- `NODE_ENV` - Environment (development/production)

---

## Future Enhancements

1. **Database Integration**
   - Store cart metadata
   - Order history
   - File metadata

2. **Webhook Support**
   - Order status updates
   - Payment confirmations

3. **Analytics**
   - Cart abandonment tracking
   - Conversion metrics

4. **Caching Layer**
   - Redis for rate limiting
   - Response caching

---

## Related Documents

- [Storefront API Architecture](./STOREFRONT_API_ARCHITECTURE.md)
- [Multi-Store Configuration](./MULTI_STORE_CONFIG.md) (future)
- [Phase 1 Tickets](./PHASE1_TICKETS.md)

---

**Last Updated**: January 13, 2026  
**Status**: ✅ Design Complete - Ready for Implementation
