# GraphQL Fragments Implementation Guide

**Tickets**: P1-035, P1-036, P1-037, P1-038  
**Status**: ✅ Complete

---

## Overview

This document explains the GraphQL fragments implementation for Shopify Storefront API integration. The fragments follow Shopify best practices and ensure consistent data structure across all queries.

---

## Design Principles

### 1. **Composability**

Fragments are designed to be composed together. For example:

- `CartFields` includes `ProductFields` and `VariantFields`
- `CollectionFields` includes `ProductFields`
- This ensures consistent data structure and reduces duplication

### 2. **Completeness**

Each fragment includes all fields needed for typical use cases:

- **ProductFields**: All product data including images, pricing, variants, SEO, metafields
- **VariantFields**: Complete variant data including pricing, availability, options
- **CartFields**: Full cart data including line items, costs, discounts
- **CollectionFields**: Collection data with product connection

### 3. **Type Safety**

Fragments are defined as TypeScript template literals, allowing:

- Type checking in queries
- IDE autocomplete support
- Compile-time validation

### 4. **Maintainability**

- Single source of truth for field selection
- Easy to update (change fragment, all queries update)
- Clear documentation for each fragment

---

## Fragment Details

### ProductFields Fragment

**Purpose**: Core product data for all product queries

**Key Fields**:

- Basic info: `id`, `title`, `handle`, `description`
- Pricing: `priceRange` (min/max across variants)
- Images: `images` connection + `featuredImage`
- Variants: Connection to variants (uses `VariantFields`)
- SEO: `seo` fields for search optimization
- Metafields: Custom data storage

**Usage Example**:

```typescript
import { ProductFields, VariantFields } from "@framecraft/core/shopify";

const query = `
  ${ProductFields}
  ${VariantFields}
  query GetProduct($handle: String!) {
    product(handle: $handle) {
      ...ProductFields
    }
  }
`;
```

**Why These Fields?**

- `id`: Required for all operations
- `handle`: Used for URL generation
- `priceRange`: Shows price range without loading all variants
- `images`: Product gallery
- `variants`: Full variant data for selection
- `seo`: Search engine optimization
- `metafields`: Custom frame-specific data

---

### VariantFields Fragment

**Purpose**: Product variant data (size, color, price, etc.)

**Key Fields**:

- Identity: `id`, `title`, `sku`, `barcode`
- Availability: `availableForSale`, `quantityAvailable`
- Pricing: `price`, `compareAtPrice` (for discounts)
- Options: `selectedOptions` (size, color, etc.)
- Image: Variant-specific image
- Product reference: Link back to parent product

**Usage Example**:

```typescript
import { VariantFields } from "@framecraft/core/shopify";

const query = `
  ${VariantFields}
  query GetVariant($id: ID!) {
    node(id: $id) {
      ... on ProductVariant {
        ...VariantFields
      }
    }
  }
`;
```

**Why These Fields?**

- `availableForSale`: Critical for cart operations
- `quantityAvailable`: Stock management
- `price`: Actual selling price
- `compareAtPrice`: Show discounts
- `selectedOptions`: Display variant options (e.g., "Large / Red")
- `image`: Variant-specific product image

---

### CartFields Fragment

**Purpose**: Complete cart data including line items

**Key Fields**:

- Cart info: `id`, `checkoutUrl`, `totalQuantity`
- Cost breakdown: `totalAmount`, `subtotalAmount`, `totalTaxAmount`
- Line items: Full product/variant data via `ProductFields` and `VariantFields`
- Custom attributes: Frame configuration data
- Discounts: Applied discount codes and allocations
- Buyer identity: Customer information

**Usage Example**:

```typescript
import { CartFields, ProductFields, VariantFields } from "@framecraft/core/shopify";

const query = `
  ${CartFields}
  ${ProductFields}
  ${VariantFields}
  query GetCart($id: ID!) {
    cart(id: $id) {
      ...CartFields
    }
  }
`;
```

**Why These Fields?**

- `checkoutUrl`: Direct link to Shopify checkout
- `totalQuantity`: Cart badge count
- `cost`: Complete pricing breakdown
- `lines.merchandise`: Full product/variant data for display
- `lines.attributes`: Frame configuration (serialized)
- `discountCodes`: Applied promotions

**Fragment Composition**:

- `CartFields` automatically includes `ProductFields` and `VariantFields` in its definition
- This ensures line items always have complete product data

---

### CollectionFields Fragment

**Purpose**: Collection/category data with products

**Key Fields**:

- Collection info: `id`, `title`, `handle`, `description`
- Image: Collection banner/hero image
- Products: Connection to products (uses `ProductFields`)
- SEO: Collection-level SEO
- Metafields: Custom collection data

**Usage Example**:

```typescript
import { CollectionFields, ProductFields, VariantFields } from "@framecraft/core/shopify";

const query = `
  ${CollectionFields}
  ${ProductFields}
  ${VariantFields}
  query GetCollection($handle: String!, $first: Int!, $after: String) {
    collection(handle: $handle) {
      ...CollectionFields
    }
  }
`;
```

**Why These Fields?**

- `handle`: URL-friendly identifier
- `products`: Browse products in collection
- `image`: Collection hero/banner
- `seo`: Collection page SEO

---

### Supporting Fragments

**PageInfoFields**: Pagination data (hasNextPage, cursors)  
**MoneyFields**: Currency/amount fields  
**ImageFields**: Image data with transformations  
**CheckoutFields**: Legacy checkout support (Cart is preferred)

---

## Best Practices Implemented

### 1. **Fragment Composition**

```typescript
// ✅ GOOD: CartFields includes ProductFields and VariantFields
const CartFields = `
  fragment CartFields on Cart {
    lines {
      merchandise {
        ... on ProductVariant {
          ...VariantFields
          product {
            ...ProductFields
          }
        }
      }
    }
  }
`;
```

### 2. **Image Transformations**

```graphql
# ✅ GOOD: Optimize images at query time
url(transform: { maxWidth: 1024, maxHeight: 1024 })
```

### 3. **Pagination Support**

```graphql
# ✅ GOOD: Include pageInfo for all connections
variants(first: 100) {
  edges { ... }
  pageInfo {
    hasNextPage
    endCursor
  }
}
```

### 4. **Metafields for Custom Data**

```graphql
# ✅ GOOD: Support custom frame data via metafields
metafields(first: 10) {
  edges {
    node {
      namespace
      key
      value
    }
  }
}
```

---

## Helper Functions

### `combineFragments(...fragments)`

Combine multiple fragments for a query:

```typescript
const fragments = combineFragments(ProductFields, VariantFields);
```

### `getFragmentWithDependencies(fragment)`

Automatically include required dependencies:

```typescript
// Automatically includes ProductFields and VariantFields
const cartQuery = `
  ${getFragmentWithDependencies(CartFields)}
  query GetCart($id: ID!) {
    cart(id: $id) {
      ...CartFields
    }
  }
`;
```

---

## Usage Patterns

### Pattern 1: Single Product Query

```typescript
import { ProductFields, VariantFields } from "@framecraft/core/shopify";

const query = `
  ${ProductFields}
  ${VariantFields}
  query GetProduct($handle: String!) {
    product(handle: $handle) {
      ...ProductFields
    }
  }
`;

const result = await client.query(query, { handle: "custom-frame" });
```

### Pattern 2: Collection with Products

```typescript
import { CollectionFields, ProductFields, VariantFields } from "@framecraft/core/shopify";

const query = `
  ${CollectionFields}
  ${ProductFields}
  ${VariantFields}
  query GetCollection($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      ...CollectionFields
    }
  }
`;

const result = await client.query(query, {
  handle: "picture-frames",
  first: 20,
});
```

### Pattern 3: Cart with Line Items

```typescript
import { CartFields, ProductFields, VariantFields } from "@framecraft/core/shopify";

const query = `
  ${CartFields}
  ${ProductFields}
  ${VariantFields}
  query GetCart($id: ID!) {
    cart(id: $id) {
      ...CartFields
    }
  }
`;

const result = await client.query(query, { id: cartId });
```

---

## Type Safety

Fragments are defined as TypeScript template literals, which means:

- ✅ TypeScript can validate GraphQL syntax (with plugins)
- ✅ IDE autocomplete for fragment names
- ✅ Compile-time checking of fragment usage

**Future Enhancement**: Consider using `graphql-codegen` to generate TypeScript types from fragments.

---

## Performance Considerations

### 1. **Field Selection**

- Only request fields you need (fragments help with this)
- Avoid over-fetching unnecessary data

### 2. **Image Optimization**

- All images use `transform` to limit size
- Reduces bandwidth and improves load times

### 3. **Pagination**

- All connections support pagination
- Use `first` parameter to limit results
- Use `pageInfo` for cursor-based pagination

### 4. **Fragment Reuse**

- Fragments reduce query size
- Shopify can cache fragment results
- Consistent field selection improves cache hit rate

---

## Testing Fragments

### Syntax Validation

```typescript
// Test that fragments are valid GraphQL
const testQuery = `
  ${ProductFields}
  query Test {
    product(handle: "test") {
      ...ProductFields
    }
  }
`;
// Should not throw syntax errors
```

### Fragment Composition

```typescript
// Test that CartFields includes required fragments
const cartQuery = `
  ${CartFields}
  ${ProductFields}
  ${VariantFields}
  query Test {
    cart(id: "test") {
      ...CartFields
    }
  }
`;
// Should include all required fragments
```

---

## Migration from Existing Code

The existing codebase has inline GraphQL queries. Migration path:

1. **Replace inline queries** with fragment-based queries
2. **Use fragments** for consistent field selection
3. **Update response types** to match fragment structure
4. **Test thoroughly** to ensure no data loss

**Example Migration**:

```typescript
// ❌ OLD: Inline query
const query = `
  query GetProduct($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      # ... many more fields
    }
  }
`;

// ✅ NEW: Fragment-based
const query = `
  ${ProductFields}
  query GetProduct($handle: String!) {
    product(handle: $handle) {
      ...ProductFields
    }
  }
`;
```

---

## Future Enhancements

1. **Type Generation**: Use `graphql-codegen` to generate TypeScript types
2. **Fragment Validation**: Runtime validation of fragment syntax
3. **Fragment Versioning**: Track fragment versions for API compatibility
4. **Dynamic Fragments**: Generate fragments based on feature flags

---

## Summary

✅ **All 4 fragments created** (ProductFields, VariantFields, CartFields, CollectionFields)  
✅ **Supporting fragments** (PageInfoFields, MoneyFields, ImageFields, CheckoutFields)  
✅ **Helper functions** for fragment composition  
✅ **Comprehensive documentation**  
✅ **Best practices** followed (composability, completeness, type safety)  
✅ **Ready for use** in query functions (P1-039-P1-041)

---

**Next Steps**: Implement query functions (P1-039-P1-041) that use these fragments.
