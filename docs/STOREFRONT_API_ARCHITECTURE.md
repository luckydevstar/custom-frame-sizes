# Storefront API Client Architecture Design

**Ticket**: P1-032  
**Date**: January 8, 2026  
**Status**: Design Complete

---

## Executive Summary

This document outlines the architecture for the Shopify Storefront API client that will handle all client-side Shopify interactions in the FrameCraft multi-store platform. The design supports multiple Shopify stores, provides robust error handling, and integrates seamlessly with the existing monorepo structure.

---

## Architecture Overview

### Design Goals

1. **Multi-Store Support**: Single client class that works with multiple Shopify stores
2. **Type Safety**: Full TypeScript support with proper GraphQL response types
3. **Error Resilience**: Comprehensive error handling with retry logic
4. **Developer Experience**: Clean API with intuitive method names
5. **Performance**: Request caching and efficient GraphQL query composition
6. **Maintainability**: Modular design with clear separation of concerns

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
│  (React Components, Hooks, Services)                         │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Storefront API Client Layer                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         StorefrontClient (Base Class)                 │  │
│  │  - query<T>(query, variables)                        │  │
│  │  - mutation<T>(mutation, variables)                  │  │
│  │  - Error handling & retries                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                       │                                     │
│  ┌────────────────────┴────────────────────┐                │
│  │                                        │                │
│  ▼                                        ▼                │
│  Product Queries              Cart Mutations                │
│  - getProductByHandle         - createCart                  │
│  - getCollection              - addToCart                  │
│  - searchProducts             - updateCart                  │
└─────────────────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Store Configuration Layer                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         StoreConfigRegistry                          │  │
│  │  - getStoreConfig(storeId)                           │  │
│  │  - validateConfig()                                  │  │
│  │  - defaultConfig                                     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              GraphQL Layer                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         GraphQL Fragments                            │  │
│  │  - ProductFields                                     │  │
│  │  - VariantFields                                     │  │
│  │  - CartFields                                        │  │
│  │  - CollectionFields                                   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Shopify Storefront API                          │
│         (External - Shopify's GraphQL API)                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Design

### 1. StorefrontClient (Base Class)

**Location**: `packages/core/src/shopify/storefront-client.ts`

**Responsibilities**:

- Execute GraphQL queries and mutations
- Handle authentication (Storefront API token)
- Manage request/response transformation
- Implement error handling and retries
- Provide logging capabilities

**Class Structure**:

```typescript
class StorefrontClient {
  private domain: string;
  private accessToken: string;
  private apiVersion: string;
  private endpoint: string;

  constructor(config: StoreConfig);
  query<T>(query: string, variables?: Record<string, unknown>): Promise<T>;
  mutation<T>(mutation: string, variables?: Record<string, unknown>): Promise<T>;
  private executeRequest<T>(body: GraphQLRequest): Promise<T>;
  private handleErrors(response: GraphQLResponse): void;
  private retryRequest<T>(request: () => Promise<T>): Promise<T>;
}
```

**Key Features**:

- Accepts `StoreConfig` in constructor (from store mapping system)
- Automatic endpoint construction from domain
- Built-in retry logic for transient failures
- Comprehensive error handling with typed errors
- Optional request/response logging

### 2. Store Configuration System

**Location**: `packages/core/src/shopify/store-config.ts`

**Purpose**: Map store identifiers to Shopify store configurations

**Interface**:

```typescript
interface StoreConfig {
  storeId: string;
  domain: string; // e.g., "store-a.myshopify.com"
  accessToken: string; // Storefront API access token
  apiVersion?: string; // Default: "2024-01"
  features?: {
    enableCaching?: boolean;
    enableLogging?: boolean;
  };
}

interface StoreConfigRegistry {
  getStoreConfig(storeId: string): StoreConfig;
  validateConfig(config: StoreConfig): boolean;
  getDefaultConfig(): StoreConfig;
}
```

**Configuration Sources**:

1. **Environment Variables** (primary): Per-store env vars
2. **Runtime Configuration**: Loaded from API/config service
3. **Default Fallback**: Development/test configuration

**Store ID Resolution**:

- From domain name (e.g., `store-a.example.com` → `store-a`)
- From environment variable (`STORE_ID`)
- From runtime context (React context provider)
- Default to single-store mode if not specified

### 3. GraphQL Fragment System

**Location**: `packages/core/src/shopify/fragments.ts`

**Purpose**: Reusable GraphQL fragments for consistent data structure

**Fragments**:

- `ProductFields`: Core product data (id, title, handle, description, images, priceRange)
- `VariantFields`: Variant data (id, title, sku, price, availableForSale)
- `CartFields`: Cart data (id, checkoutUrl, totalQuantity, cost, lines)
- `CollectionFields`: Collection data (id, title, handle, description, products)

**Fragment Composition**:

- Fragments can be composed together
- CartFields includes ProductFields and VariantFields
- Ensures consistent data structure across queries

### 4. Response Transformation Layer

**Purpose**: Transform Shopify GraphQL responses to internal types

**Location**: `packages/core/src/shopify/transformers.ts`

**Transformations**:

- Shopify Product → Internal Product type
- Shopify Variant → Internal Variant type
- Shopify Cart → Internal Cart type
- Handle null/undefined values gracefully
- Normalize data structures

---

## Error Handling Strategy

### Error Types

1. **Network Errors**: Connection failures, timeouts
   - **Strategy**: Retry with exponential backoff (3 attempts)
   - **User Impact**: Show retry button, log error

2. **GraphQL Errors**: Invalid queries, missing fields
   - **Strategy**: No retry, log error with query details
   - **User Impact**: Show error message, log for debugging

3. **API Errors**: Rate limiting, authentication failures
   - **Strategy**: Retry with backoff for rate limits, fail fast for auth
   - **User Impact**: Show appropriate error message

4. **Validation Errors**: Invalid input data
   - **Strategy**: No retry, return typed error
   - **User Impact**: Show validation error message

### Error Handling Flow

```
Request → Execute → Check Response
                      │
        ┌─────────────┴─────────────┐
        │                           │
    Success                      Error
        │                           │
        │              ┌────────────┴────────────┐
        │              │                        │
        │         Network Error            GraphQL Error
        │              │                        │
        │         Retry Logic              No Retry
        │              │                        │
        │         ┌────┴────┐                  │
        │         │         │                  │
        │    Success    Max Retries         Log & Return
        │         │         │                  │
        │         │    Return Error            │
        │         │         │                  │
        └─────────┴─────────┴──────────────────┘
                    │
                    ▼
              Return Result
```

### Retry Strategy

- **Max Retries**: 3 attempts
- **Backoff Strategy**: Exponential (1s, 2s, 4s)
- **Retryable Errors**: Network errors, 5xx status codes, rate limits
- **Non-Retryable**: 4xx errors (except rate limits), GraphQL errors

---

## GraphQL Query/Mutation Structure

### Query Pattern

```typescript
const query = `
  ${ProductFields}
  query GetProduct($handle: String!) {
    product(handle: $handle) {
      ...ProductFields
    }
  }
`;
```

### Mutation Pattern

```typescript
const mutation = `
  ${CartFields}
  mutation CreateCart($input: CartInput!) {
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
```

### Fragment Usage

- Fragments defined once, reused across queries
- Ensures consistent field selection
- Reduces query complexity
- Makes updates easier (change fragment, all queries update)

---

## Store Identifier Mapping

### Mapping Strategy

**Option 1: Domain-Based (Recommended)**

- Extract store ID from domain name
- `store-a.example.com` → `store-a`
- `store-b.example.com` → `store-b`
- Works well with Vercel multi-domain setup

**Option 2: Environment Variable**

- `STORE_ID` environment variable
- Explicit store identification
- Good for development/testing

**Option 3: Runtime Context**

- Store ID from React context (Section 1.5)
- Dynamic store switching
- Best for multi-store admin interfaces

**Option 4: URL Parameter**

- `?store=store-a` query parameter
- Useful for testing/development
- Not recommended for production

### Implementation Priority

1. **Primary**: Domain-based mapping (production)
2. **Secondary**: Environment variable (development)
3. **Tertiary**: Runtime context (when Section 1.5 complete)
4. **Fallback**: Default single-store config

---

## Response Transformation

### Transformation Goals

1. **Type Safety**: Convert Shopify types to internal types
2. **Null Safety**: Handle nullable fields gracefully
3. **Normalization**: Consistent data structure
4. **Simplification**: Remove unnecessary nesting

### Example Transformation

**Shopify Response**:

```json
{
  "data": {
    "product": {
      "id": "gid://shopify/Product/123",
      "title": "Custom Frame",
      "handle": "custom-frame",
      "priceRange": {
        "minVariantPrice": {
          "amount": "29.99",
          "currencyCode": "USD"
        }
      }
    }
  }
}
```

**Internal Type**:

```typescript
{
  id: "123",
  title: "Custom Frame",
  handle: "custom-frame",
  price: 29.99,
  currency: "USD"
}
```

---

## Caching Strategy

### Query Result Caching

**Location**: `packages/core/src/shopify/cache.ts`

**Cache Strategy**:

- **Product Queries**: Cache for 5 minutes (products don't change frequently)
- **Collection Queries**: Cache for 2 minutes
- **Cart Queries**: No caching (always fresh)
- **Search Queries**: Cache for 1 minute

**Cache Key Format**:

```
shopify:${storeId}:${queryHash}:${variablesHash}
```

**Cache Invalidation**:

- Manual invalidation via `invalidateCache(key)`
- Time-based expiration
- Cache size limits (LRU eviction)

**Implementation**:

- Use browser `Map` for in-memory cache (client-side)
- Optional: Integrate with React Query for advanced caching

---

## Logging Strategy

### Log Levels

1. **Debug**: All requests/responses (development only)
2. **Info**: Successful operations, cache hits
3. **Warn**: Retries, rate limit warnings
4. **Error**: Failed requests, GraphQL errors

### Log Format

```typescript
{
  level: 'info' | 'warn' | 'error',
  storeId: string,
  operation: 'query' | 'mutation',
  queryName: string,
  duration: number,
  timestamp: string,
  error?: Error
}
```

### Logging Implementation

- **Development**: Console logging with full details
- **Production**: Structured logging (JSON format)
- **Optional**: Integration with logging service (Sentry, LogRocket)

---

## Integration Points

### With Existing Code

1. **@framecraft/config**: Store configuration from Section 1.5
2. **@framecraft/types**: Type definitions for products, carts
3. **@framecraft/core/services**: Integration with products service
4. **React Query**: Optional integration for advanced caching

### With Future Sections

1. **Section 1.4 (Admin API)**: Server-side cart management
2. **Section 1.5 (Multi-Store Config)**: Store configuration loading
3. **Section 1.6 (Database)**: Store configuration persistence

---

## Security Considerations

### Token Management

- **Storefront API Token**: Public token (safe for client-side)
- **Token Storage**: Environment variables (never in code)
- **Token Rotation**: Support for token updates without code changes

### Request Security

- **HTTPS Only**: All requests over HTTPS
- **CORS**: Handled by Shopify (Storefront API allows browser requests)
- **Input Validation**: Validate all variables before sending
- **Rate Limiting**: Respect Shopify rate limits, implement client-side throttling

---

## Testing Strategy

### Unit Tests

- Test StorefrontClient class methods
- Test error handling and retries
- Test response transformation
- Test store configuration mapping

### Integration Tests

- Test with Shopify GraphQL API (test store)
- Test multi-store scenarios
- Test error scenarios (network failures, API errors)

### Mock Strategy

- Mock fetch API for unit tests
- Use Shopify's test store for integration tests
- Mock mode when credentials not configured (development)

---

## Performance Considerations

### Query Optimization

- Use fragments to reduce query size
- Request only needed fields
- Batch multiple queries when possible
- Use pagination for large collections

### Network Optimization

- Implement request deduplication
- Use HTTP/2 when available
- Compress request bodies
- Cache query results appropriately

### Bundle Size

- Tree-shake unused GraphQL queries
- Code-split Shopify client (lazy load)
- Minimize dependencies

---

## Migration from Existing Code

### Current Implementation

The existing codebase has a basic Shopify client in `CustomFrameSizes-CODE/client/src/services/shopify.ts`:

- ✅ Basic GraphQL client implementation
- ✅ Query and mutation support
- ✅ Error handling
- ❌ No multi-store support
- ❌ No store configuration mapping
- ❌ No fragment system
- ❌ Limited error handling

### Migration Path

1. **Extract** existing Shopify client code
2. **Enhance** with multi-store support
3. **Add** store configuration mapping
4. **Implement** fragment system
5. **Improve** error handling and retries
6. **Add** response transformation
7. **Integrate** with new package structure

---

## Design Decisions

### Decision 1: Client-Side Only

**Decision**: Storefront API client runs only on client-side (browser)

**Rationale**:

- Storefront API is designed for client-side use
- Public token is safe for browser
- Reduces server load
- Better performance (direct API calls)

**Alternative Considered**: Server-side proxy

- **Rejected**: Adds unnecessary complexity, Storefront API is safe for client-side

### Decision 2: Class-Based Client

**Decision**: Use class-based StorefrontClient instead of functional approach

**Rationale**:

- Encapsulates configuration (domain, token)
- Easier to extend and test
- Clear instance lifecycle
- Better TypeScript support

**Alternative Considered**: Functional approach

- **Rejected**: Less flexible, harder to maintain state

### Decision 3: Store Configuration Registry

**Decision**: Centralized store configuration registry

**Rationale**:

- Single source of truth for store configs
- Easy to add new stores
- Validation in one place
- Supports multiple configuration sources

**Alternative Considered**: Per-request configuration

- **Rejected**: Less efficient, harder to manage

### Decision 4: Fragment-Based Queries

**Decision**: Use GraphQL fragments for all queries

**Rationale**:

- Ensures consistent field selection
- Reduces query complexity
- Makes updates easier
- Industry best practice

**Alternative Considered**: Inline field selection

- **Rejected**: More error-prone, harder to maintain

---

## Implementation Plan

### Phase 1: Core Client (P1-033)

1. Create StorefrontClient base class
2. Implement query and mutation methods
3. Add basic error handling
4. Write unit tests

### Phase 2: Store Mapping (P1-034)

1. Design store configuration interface
2. Implement store configuration registry
3. Add store ID resolution
4. Integrate with StorefrontClient

### Phase 3: GraphQL Fragments (P1-035-P1-038)

1. Create ProductFields fragment
2. Create VariantFields fragment
3. Create CartFields fragment
4. Create CollectionFields fragment

### Phase 4: Query Functions (P1-039-P1-041)

1. Implement getProductByHandle
2. Implement getCollection with pagination
3. Implement searchProducts

### Phase 5: Configuration Serialization (P1-042-P1-045)

1. Design serialization format
2. Implement frame configuration serializer
3. Implement specialty designer serializers
4. Implement deserializer

### Phase 6: Cart Management (P1-046-P1-050)

1. Design cart state management
2. Implement Zustand store
3. Add cart persistence
4. Implement cart sync
5. Add error recovery

---

## Success Criteria

✅ **Architecture Design Complete**:

- [x] Client class structure defined
- [x] Store mapping approach documented
- [x] Error handling strategy defined
- [x] GraphQL structure planned
- [x] Design decisions documented
- [x] Integration points identified
- [x] Migration path defined

---

## Next Steps

1. **P1-033**: Implement StorefrontClient base class
2. **P1-034**: Implement store configuration mapping
3. **P1-035-P1-038**: Create GraphQL fragments
4. **P1-039-P1-041**: Implement query functions

---

**Document Status**: ✅ Complete  
**Ready for Implementation**: Yes  
**Dependencies**: None (can start immediately)
