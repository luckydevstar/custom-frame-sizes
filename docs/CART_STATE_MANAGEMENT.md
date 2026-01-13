# Client-Side Cart State Management Design

**Ticket**: P1-046  
**Date**: January 9, 2026  
**Status**: Design Complete

---

## Overview

This document defines the architecture for client-side cart state management using Zustand. The cart system will handle local state management, persistence, and synchronization with Shopify Storefront API.

---

## Design Goals

1. **Local-First**: Cart works offline, syncs when online
2. **Optimistic Updates**: Immediate UI feedback, rollback on error
3. **Persistence**: Cart survives page reloads
4. **Multi-Store Support**: Cart is store-specific
5. **Type Safety**: Full TypeScript support
6. **Performance**: Efficient updates and minimal re-renders

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    React Components                          │
│  (Cart UI, Add to Cart buttons, Cart Summary)                │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Zustand Cart Store                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Cart State                                   │  │
│  │  - items: CartItem[]                                 │  │
│  │  - cartId: string | null                            │  │
│  │  - storeId: string                                  │  │
│  │  - metadata: CartMetadata                           │  │
│  └──────────────────────────────────────────────────────┘  │
│                       │                                     │
│  ┌────────────────────┴────────────────────┐                │
│  │                                        │                │
│  ▼                                        ▼                │
│  Actions                                 Selectors         │
│  - addItem()                             - totalQuantity   │
│  - removeItem()                          - totalPrice      │
│  - updateQuantity()                      - itemCount      │
│  - clearCart()                           - isEmpty         │
│  - syncWithAPI()                         - getItem()       │
└─────────────────────────────────────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
        ▼                             ▼
┌──────────────────┐        ┌──────────────────┐
│  Persistence      │        │  API Sync        │
│  (localStorage)   │        │  (Storefront API) │
└──────────────────┘        └──────────────────┘
```

---

## Cart State Structure

### CartItem Interface

```typescript
interface CartItem {
  /**
   * Unique identifier for this cart item
   * Generated client-side (UUID or timestamp-based)
   */
  id: string;

  /**
   * Shopify variant ID (GID format)
   * e.g., "gid://shopify/ProductVariant/12345678"
   */
  variantId: string;

  /**
   * Product handle (for display/links)
   */
  productHandle: string;

  /**
   * Product title
   */
  title: string;

  /**
   * Variant title (e.g., "Large / Red")
   */
  variantTitle: string;

  /**
   * Product image URL
   */
  imageUrl: string | null;

  /**
   * Unit price in cents
   */
  price: number;

  /**
   * Currency code (e.g., "USD")
   */
  currency: string;

  /**
   * Quantity
   */
  quantity: number;

  /**
   * Frame configuration (serialized as attributes)
   * Only present for custom frame items
   */
  configuration?: FrameConfiguration;

  /**
   * Specialty configuration (if applicable)
   */
  specialtyConfig?:
    | ShadowboxSpecialtyConfig
    | JerseySpecialtyConfig
    | CanvasFloatSpecialtyConfig
    | PuzzleSpecialtyConfig
    | ComicBookSpecialtyConfig
    | PlaybillSpecialtyConfig;

  /**
   * Shopify line item ID (set after cart creation/update)
   * null until synced with API
   */
  lineItemId: string | null;

  /**
   * Timestamp when item was added
   */
  addedAt: string;

  /**
   * Sync status
   */
  syncStatus: "pending" | "syncing" | "synced" | "error";
}

interface CartMetadata {
  /**
   * Shopify cart ID (GID format)
   * null until cart is created via API
   */
  cartId: string | null;

  /**
   * Checkout URL from Shopify
   * null until cart is created
   */
  checkoutUrl: string | null;

  /**
   * Store identifier
   */
  storeId: string;

  /**
   * Last sync timestamp
   */
  lastSyncedAt: string | null;

  /**
   * Cart creation timestamp
   */
  createdAt: string;

  /**
   * Last update timestamp
   */
  updatedAt: string;

  /**
   * Pending sync operations
   */
  pendingSyncs: Array<{
    type: "add" | "update" | "remove";
    itemId: string;
    timestamp: string;
  }>;
}

interface CartState {
  /**
   * Cart items
   */
  items: CartItem[];

  /**
   * Cart metadata
   */
  metadata: CartMetadata;

  /**
   * Loading state
   */
  isLoading: boolean;

  /**
   * Error state
   */
  error: string | null;
}
```

---

## Zustand Store Structure

### Store Interface

```typescript
interface CartStore extends CartState {
  // Actions
  addItem: (item: Omit<CartItem, "id" | "addedAt" | "lineItemId" | "syncStatus">) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;

  // Sync actions
  syncWithAPI: (storeId?: string) => Promise<void>;
  syncItem: (itemId: string) => Promise<void>;

  // Persistence
  loadFromStorage: () => void;
  saveToStorage: () => void;

  // Utilities
  getItem: (itemId: string) => CartItem | undefined;
  findItemByVariant: (variantId: string, config?: FrameConfiguration) => CartItem | undefined;

  // Internal
  _setLoading: (loading: boolean) => void;
  _setError: (error: string | null) => void;
  _updateMetadata: (updates: Partial<CartMetadata>) => void;
}
```

### Selectors

```typescript
// Computed selectors (outside store for performance)
const selectors = {
  totalQuantity: (state: CartState) => state.items.reduce((sum, item) => sum + item.quantity, 0),

  totalPrice: (state: CartState) =>
    state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),

  itemCount: (state: CartState) => state.items.length,

  isEmpty: (state: CartState) => state.items.length === 0,

  hasPendingSyncs: (state: CartState) => state.metadata.pendingSyncs.length > 0,

  getItem: (state: CartState, itemId: string) => state.items.find((item) => item.id === itemId),

  findItemByVariant: (state: CartState, variantId: string, config?: FrameConfiguration) =>
    state.items.find((item) => {
      if (item.variantId !== variantId) return false;
      if (!config && !item.configuration) return true;
      if (config && item.configuration) {
        return JSON.stringify(config) === JSON.stringify(item.configuration);
      }
      return false;
    }),
};
```

---

## Actions Design

### addItem

**Purpose**: Add item to cart (optimistic update)

**Flow**:

1. Generate unique item ID
2. Add item to state immediately (optimistic)
3. Mark item as `syncStatus: "pending"`
4. Add to `pendingSyncs` queue
5. Attempt API sync in background
6. On success: update `lineItemId`, set `syncStatus: "synced"`
7. On error: keep item but mark `syncStatus: "error"`

**Signature**:

```typescript
addItem: (item: {
  variantId: string;
  productHandle: string;
  title: string;
  variantTitle: string;
  imageUrl: string | null;
  price: number;
  currency: string;
  quantity: number;
  configuration?: FrameConfiguration;
  specialtyConfig?: SpecialtyConfig;
}) => void;
```

**Optimistic Update**: ✅ Yes - item appears immediately

---

### removeItem

**Purpose**: Remove item from cart

**Flow**:

1. Remove item from state immediately
2. If item has `lineItemId`, add to `pendingSyncs` as "remove"
3. Attempt API sync in background
4. On error: restore item and show error

**Signature**:

```typescript
removeItem: (itemId: string) => void;
```

**Optimistic Update**: ✅ Yes - item disappears immediately

---

### updateQuantity

**Purpose**: Update item quantity

**Flow**:

1. Update quantity in state immediately
2. If quantity is 0, call `removeItem` instead
3. If item has `lineItemId`, add to `pendingSyncs` as "update"
4. Attempt API sync in background
5. On error: revert quantity and show error

**Signature**:

```typescript
updateQuantity: (itemId: string, quantity: number) => void;
```

**Optimistic Update**: ✅ Yes - quantity updates immediately

---

### clearCart

**Purpose**: Clear all items from cart

**Flow**:

1. Clear items from state immediately
2. Clear `cartId` and `checkoutUrl`
3. Clear `pendingSyncs` queue
4. Attempt to delete cart via API (if `cartId` exists)
5. Clear persistence storage

**Signature**:

```typescript
clearCart: () => void;
```

**Optimistic Update**: ✅ Yes - cart clears immediately

---

## Optimistic Updates Strategy

### Principles

1. **Immediate UI Feedback**: All actions update state immediately
2. **Background Sync**: API calls happen asynchronously
3. **Error Recovery**: Rollback on API failure
4. **Retry Logic**: Failed syncs are retried automatically
5. **Queue Management**: Pending syncs are processed in order

### Implementation Pattern

```typescript
// Example: addItem with optimistic update
addItem: (item) => {
  // 1. Optimistic update
  const newItem: CartItem = {
    ...item,
    id: generateId(),
    addedAt: new Date().toISOString(),
    lineItemId: null,
    syncStatus: "pending",
  };

  set((state) => ({
    items: [...state.items, newItem],
    metadata: {
      ...state.metadata,
      pendingSyncs: [
        ...state.metadata.pendingSyncs,
        { type: "add", itemId: newItem.id, timestamp: new Date().toISOString() },
      ],
      updatedAt: new Date().toISOString(),
    },
  }));

  // 2. Background sync (non-blocking)
  syncItem(newItem.id).catch((error) => {
    // 3. Error handling (mark as error, keep in cart)
    set((state) => ({
      items: state.items.map((item) =>
        item.id === newItem.id
          ? { ...item, syncStatus: "error" }
          : item
      ),
      error: error.message,
    }));
  });
},
```

### Rollback Strategy

When API sync fails:

- **addItem**: Keep item but mark as `syncStatus: "error"`, show error message
- **removeItem**: Restore item, show error message
- **updateQuantity**: Revert to previous quantity, show error message
- **clearCart**: Restore items from backup (if available)

---

## Persistence Strategy

### Storage Location

**Primary**: `localStorage` (persists across sessions)  
**Fallback**: `sessionStorage` (if localStorage unavailable)

### Storage Key Format

```
framecraft:cart:{storeId}
```

Example: `framecraft:cart:store-a`

### Storage Structure

```typescript
interface StoredCart {
  items: CartItem[];
  metadata: CartMetadata;
  version: number; // For migration support
  expiresAt: string; // Cart expiration timestamp
}
```

### Persistence Triggers

- **Save**: After every cart mutation (add, remove, update, clear)
- **Load**: On store initialization (if storeId matches)
- **Clear**: On `clearCart()` or cart expiration

### Expiration Logic

- **Default TTL**: 30 days
- **Expired carts**: Automatically cleared on load
- **Expiration check**: On store initialization and before sync

### Migration Support

- **Version field**: Allows future schema changes
- **Migration functions**: Convert old formats to new
- **Backward compatibility**: Handle missing fields gracefully

---

## Cart Sync with Storefront API

### Sync Flow

```
Local Cart State
    │
    ├─→ Has cartId?
    │   │
    │   ├─→ Yes: Update existing cart
    │   │   └─→ cartLinesAdd/Update/Remove mutations
    │   │
    │   └─→ No: Create new cart
    │       └─→ cartCreate mutation
    │
    └─→ Update local state with API response
        └─→ Set cartId, checkoutUrl, lineItemIds
```

### Sync Operations

#### 1. Cart Creation

**When**: First item added, no `cartId` exists

**Mutation**: `cartCreate`

**Input**:

```graphql
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
```

**After Success**:

- Set `metadata.cartId`
- Set `metadata.checkoutUrl`
- Set `item.lineItemId` for added item
- Update `metadata.lastSyncedAt`

#### 2. Add Line Item

**When**: Item added, `cartId` exists

**Mutation**: `cartLinesAdd`

**Input**:

```graphql
mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
  cartLinesAdd(cartId: $cartId, lines: $lines) {
    cart {
      ...CartFields
    }
    userErrors {
      field
      message
    }
  }
}
```

#### 3. Update Line Item

**When**: Quantity changed, `lineItemId` exists

**Mutation**: `cartLinesUpdate`

**Input**:

```graphql
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
```

#### 4. Remove Line Item

**When**: Item removed, `lineItemId` exists

**Mutation**: `cartLinesRemove`

**Input**:

```graphql
mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
  cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
    cart {
      ...CartFields
    }
    userErrors {
      field
      message
    }
  }
}
```

### Sync Queue Management

**Queue Structure**:

```typescript
pendingSyncs: Array<{
  type: "add" | "update" | "remove";
  itemId: string;
  timestamp: string;
}>;
```

**Processing**:

- Process queue in order (FIFO)
- Retry failed syncs with exponential backoff
- Max retries: 3
- Failed syncs remain in queue for manual retry

**Batch Operations**:

- Group multiple pending syncs of same type
- Batch API calls when possible
- Reduce API calls for better performance

---

## Error Handling Strategy

### Error Types

1. **Network Errors**: Connection failures, timeouts
   - **Strategy**: Retry with backoff, fallback to local-only mode
   - **User Impact**: Show warning, cart works locally

2. **API Errors**: Invalid requests, rate limits
   - **Strategy**: Show error message, keep item in cart
   - **User Impact**: Item marked as error, can retry

3. **Validation Errors**: Invalid item data
   - **Strategy**: Remove invalid item, show error
   - **User Impact**: Item removed, error message shown

4. **Storage Errors**: localStorage unavailable
   - **Strategy**: Fallback to sessionStorage, or in-memory only
   - **User Impact**: Cart may not persist across sessions

### Error Recovery

**Automatic Recovery**:

- Retry failed syncs on next user action
- Retry on page visibility change (user returns to tab)
- Retry on network reconnection

**Manual Recovery**:

- "Retry Sync" button in cart UI
- "Clear Cart" option if sync fails repeatedly

**Fallback Mode**:

- If API unavailable: Cart works locally only
- Items stored in localStorage
- Sync attempted when API available
- Checkout redirects to Shopify with serialized config

---

## Performance Considerations

### State Updates

- **Immutability**: Use Zustand's built-in immutability
- **Selective Updates**: Only update changed items
- **Memoization**: Use selectors to prevent unnecessary re-renders

### Re-render Optimization

```typescript
// ✅ Good: Use selector to prevent re-renders
const totalQuantity = useCartStore((state) =>
  state.items.reduce((sum, item) => sum + item.quantity, 0)
);

// ❌ Bad: Access entire state (causes re-render on any change)
const { items } = useCartStore();
const totalQuantity = items.reduce(...);
```

### API Call Optimization

- **Debouncing**: Debounce rapid quantity updates (wait 500ms)
- **Batching**: Batch multiple sync operations
- **Deduplication**: Skip sync if item already synced
- **Caching**: Cache cart data to reduce API calls

---

## Multi-Store Support

### Store-Specific Carts

- **Separate Storage**: Each store has its own cart in localStorage
- **Store ID**: Cart metadata includes `storeId`
- **Isolation**: Carts don't mix between stores
- **Switch Store**: Clear current cart, load store-specific cart

### Storage Key Strategy

```
framecraft:cart:{storeId}
```

**Example**:

- `framecraft:cart:store-a` → Store A's cart
- `framecraft:cart:store-b` → Store B's cart

### Store Switching

When user switches stores:

1. Save current cart to storage (if storeId exists)
2. Load new store's cart from storage
3. If no cart exists, create empty cart
4. Update `metadata.storeId`

---

## Usage Patterns

### Basic Usage

```typescript
import { useCartStore } from '@framecraft/core/stores';

function CartButton() {
  const addItem = useCartStore((state) => state.addItem);
  const totalQuantity = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  const handleAddToCart = () => {
    addItem({
      variantId: "gid://shopify/ProductVariant/123",
      productHandle: "custom-frame",
      title: "Custom Picture Frame",
      variantTitle: "Default",
      imageUrl: "https://...",
      price: 2999, // $29.99 in cents
      currency: "USD",
      quantity: 1,
      configuration: frameConfig,
    });
  };

  return (
    <button onClick={handleAddToCart}>
      Add to Cart ({totalQuantity})
    </button>
  );
}
```

### Cart Display

```typescript
function CartSummary() {
  const items = useCartStore((state) => state.items);
  const totalPrice = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  );
  const checkoutUrl = useCartStore((state) => state.metadata.checkoutUrl);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  return (
    <div>
      {items.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          onRemove={() => removeItem(item.id)}
          onUpdateQuantity={(qty) => updateQuantity(item.id, qty)}
        />
      ))}
      <div>Total: ${(totalPrice / 100).toFixed(2)}</div>
      {checkoutUrl && (
        <a href={checkoutUrl}>Checkout</a>
      )}
    </div>
  );
}
```

---

## Testing Strategy

### Unit Tests

- Test all actions (add, remove, update, clear)
- Test selectors (totals, counts, finders)
- Test optimistic updates
- Test error handling
- Test persistence (save/load)

### Integration Tests

- Test API sync flow
- Test error recovery
- Test multi-store isolation
- Test expiration logic

### E2E Tests

- Test full cart flow (add → sync → checkout)
- Test offline mode
- Test error scenarios
- Test persistence across reloads

---

## Migration from Existing Code

The existing codebase has `addToCart` functions that directly call Shopify API. Migration path:

1. **Replace direct API calls** with cart store actions
2. **Update components** to use `useCartStore` hook
3. **Add persistence** for cart survival across reloads
4. **Add optimistic updates** for better UX
5. **Test thoroughly** to ensure no regressions

---

## Success Criteria

✅ **Design Complete**:

- [x] Cart state structure defined
- [x] Store interface designed
- [x] Actions planned with optimistic updates
- [x] Persistence strategy defined
- [x] API sync strategy planned
- [x] Error handling strategy defined
- [x] Multi-store support designed
- [x] Performance considerations documented
- [x] Usage patterns documented

---

**Document Status**: ✅ Complete  
**Ready for Implementation**: Yes (P1-047)  
**Dependencies**: Zustand library, Storefront API client (P1-033)
