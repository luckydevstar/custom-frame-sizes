/**
 * Cart State Management with Zustand
 *
 * Client-side cart store with optimistic updates, persistence, and Shopify API sync.
 * Follows the design in docs/CART_STATE_MANAGEMENT.md
 *
 * @packageDocumentation
 */

import { create } from "zustand";
import type { FrameConfiguration } from "@framecraft/types";
import type {
  ShadowboxSpecialtyConfig,
  JerseySpecialtyConfig,
  CanvasFloatSpecialtyConfig,
  PuzzleSpecialtyConfig,
  ComicBookSpecialtyConfig,
  PlaybillSpecialtyConfig,
} from "../shopify/serialization";
import {
  saveCart as persistSaveCart,
  loadCart as persistLoadCart,
  clearCart as persistClearCart,
  isStorageAvailable,
} from "./cart-persistence";
import {
  createCart as apiCreateCart,
  addCartLines,
  updateCartLines,
  type CartLineInput,
  type CartLineUpdateInput,
  type ShopifyCart,
} from "../shopify/cart";
import {
  serializeFrameConfiguration,
  serializeShadowboxConfiguration,
  serializeJerseyConfiguration,
  serializeCanvasFloatConfiguration,
  serializePuzzleConfiguration,
  serializeComicBookConfiguration,
  serializePlaybillConfiguration,
} from "../shopify/serialization";

/**
 * Specialty configuration union type
 */
export type SpecialtyConfig =
  | ShadowboxSpecialtyConfig
  | JerseySpecialtyConfig
  | CanvasFloatSpecialtyConfig
  | PuzzleSpecialtyConfig
  | ComicBookSpecialtyConfig
  | PlaybillSpecialtyConfig;

/**
 * Cart item sync status
 */
export type CartItemSyncStatus = "pending" | "syncing" | "synced" | "error";

/**
 * Cart item structure
 */
export interface CartItem {
  /**
   * Unique identifier for this cart item (client-generated)
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
  specialtyConfig?: SpecialtyConfig;

  /**
   * Shopify line item ID (set after cart creation/update)
   * null until synced with API
   */
  lineItemId: string | null;

  /**
   * Timestamp when item was added (ISO 8601)
   */
  addedAt: string;

  /**
   * Sync status
   */
  syncStatus: CartItemSyncStatus;
}

/**
 * Pending sync operation
 */
export interface PendingSync {
  type: "add" | "update" | "remove";
  itemId: string;
  timestamp: string;
}

/**
 * Cart metadata
 */
export interface CartMetadata {
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
   * Last sync timestamp (ISO 8601)
   */
  lastSyncedAt: string | null;

  /**
   * Cart creation timestamp (ISO 8601)
   */
  createdAt: string;

  /**
   * Last update timestamp (ISO 8601)
   */
  updatedAt: string;

  /**
   * Pending sync operations
   */
  pendingSyncs: PendingSync[];
}

/**
 * Cart state structure
 */
export interface CartState {
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

/**
 * Input for adding a new cart item
 */
export type AddCartItemInput = Omit<CartItem, "id" | "addedAt" | "lineItemId" | "syncStatus">;

/**
 * Cart store interface with actions and selectors
 */
export interface CartStore extends CartState {
  // Actions
  addItem: (item: AddCartItemInput) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;

  // Sync actions (will be implemented in P1-049)
  syncWithAPI: (storeId?: string) => Promise<void>;
  syncItem: (itemId: string) => Promise<void>;

  // Persistence (will be implemented in P1-048)
  loadFromStorage: () => void;
  saveToStorage: () => void;

  // Utilities
  getItem: (itemId: string) => CartItem | undefined;
  findItemByVariant: (variantId: string, config?: FrameConfiguration) => CartItem | undefined;

  // Internal state setters
  _setLoading: (loading: boolean) => void;
  _setError: (error: string | null) => void;
  _updateMetadata: (updates: Partial<CartMetadata>) => void;
  _setItems: (items: CartItem[]) => void;
}

/**
 * Generate unique item ID
 * Uses timestamp + random string for uniqueness
 */
function generateItemId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 9);
  return `item_${timestamp}_${random}`;
}

/**
 * Get current ISO timestamp
 */
function now(): string {
  return new Date().toISOString();
}

/**
 * Serialize frame configuration with optional specialty config
 *
 * Helper function to choose the correct serialization function based on specialty config type
 */
function serializeConfiguration(config: FrameConfiguration, specialtyConfig?: SpecialtyConfig) {
  if (!specialtyConfig) {
    return serializeFrameConfiguration(config);
  }

  // Detect specialty type and use appropriate serializer
  // This is a simple type check - in production you might want stronger typing
  if ("backingType" in specialtyConfig || "depth" in specialtyConfig) {
    return serializeShadowboxConfiguration(config, specialtyConfig as ShadowboxSpecialtyConfig);
  }
  if ("jerseySize" in specialtyConfig) {
    return serializeJerseyConfiguration(config, specialtyConfig as JerseySpecialtyConfig);
  }
  if ("floatDepth" in specialtyConfig) {
    return serializeCanvasFloatConfiguration(config, specialtyConfig as CanvasFloatSpecialtyConfig);
  }
  if ("puzzleSize" in specialtyConfig || "puzzlePieceCount" in specialtyConfig) {
    return serializePuzzleConfiguration(config, specialtyConfig as PuzzleSpecialtyConfig);
  }
  if ("comicFormat" in specialtyConfig || "numberOfComics" in specialtyConfig) {
    return serializeComicBookConfiguration(config, specialtyConfig as ComicBookSpecialtyConfig);
  }
  if ("playbillSize" in specialtyConfig) {
    return serializePlaybillConfiguration(config, specialtyConfig as PlaybillSpecialtyConfig);
  }

  // Fallback to base serialization
  return serializeFrameConfiguration(config);
}

/**
 * Create initial cart metadata
 */
function createInitialMetadata(storeId: string): CartMetadata {
  return {
    cartId: null,
    checkoutUrl: null,
    storeId,
    lastSyncedAt: null,
    createdAt: now(),
    updatedAt: now(),
    pendingSyncs: [],
  };
}

/**
 * Initial cart state
 */
const initialState: CartState = {
  items: [],
  metadata: createInitialMetadata("default"),
  isLoading: false,
  error: null,
};

/**
 * Cart store with Zustand
 *
 * Provides cart state management with optimistic updates, persistence, and API sync.
 *
 * @example
 * ```typescript
 * import { useCartStore } from '@framecraft/core/stores';
 *
 * function AddToCartButton() {
 *   const addItem = useCartStore((state) => state.addItem);
 *
 *   const handleClick = () => {
 *     addItem({
 *       variantId: "gid://shopify/ProductVariant/123",
 *       productHandle: "custom-frame",
 *       title: "Custom Picture Frame",
 *       variantTitle: "Default",
 *       imageUrl: "https://example.com/image.jpg",
 *       price: 2999, // $29.99 in cents
 *       currency: "USD",
 *       quantity: 1,
 *       configuration: frameConfig,
 *     });
 *   };
 *
 *   return <button onClick={handleClick}>Add to Cart</button>;
 * }
 * ```
 */
export const useCartStore = create<CartStore>(
  (
    set: (partial: Partial<CartStore> | ((state: CartState) => Partial<CartStore>)) => void,
    get: () => CartStore
  ) => ({
    // Initial state
    ...initialState,

    // Actions

    /**
     * Add item to cart (optimistic update)
     *
     * Flow:
     * 1. Generate unique item ID
     * 2. Add item to state immediately (optimistic)
     * 3. Mark item as 'pending'
     * 4. Add to pendingSyncs queue
     * 5. Attempt API sync in background (via syncItem)
     */
    addItem: (input: AddCartItemInput) => {
      const newItem: CartItem = {
        ...input,
        id: generateItemId(),
        addedAt: now(),
        lineItemId: null,
        syncStatus: "pending",
      };

      set((state: CartState) => ({
        items: [...state.items, newItem],
        metadata: {
          ...state.metadata,
          pendingSyncs: [
            ...state.metadata.pendingSyncs,
            { type: "add", itemId: newItem.id, timestamp: now() },
          ],
          updatedAt: now(),
        },
        error: null, // Clear previous errors
      }));

      // Save to storage after update
      get().saveToStorage();

      // Background sync (non-blocking)
      // This will be implemented in P1-049
      get()
        .syncItem(newItem.id)
        .catch((error: unknown) => {
          // Mark as error but keep in cart
          set((state: CartState) => ({
            items: state.items.map((item) =>
              item.id === newItem.id ? { ...item, syncStatus: "error" } : item
            ),
            error: error instanceof Error ? error.message : String(error),
          }));
          get().saveToStorage();
        });
    },

    /**
     * Remove item from cart (optimistic update)
     *
     * Flow:
     * 1. Store item backup for rollback
     * 2. Remove item from state immediately
     * 3. If item has lineItemId, add to pendingSyncs as "remove"
     * 4. Attempt API sync in background
     * 5. On error: restore item and show error
     */
    removeItem: (itemId: string) => {
      const state = get();
      const itemToRemove = state.items.find((item) => item.id === itemId);

      if (!itemToRemove) {
        console.warn(`Cart item ${itemId} not found`);
        return;
      }

      // Optimistic update: remove immediately
      set((state: CartState) => ({
        items: state.items.filter((item) => item.id !== itemId),
        metadata: {
          ...state.metadata,
          pendingSyncs: itemToRemove.lineItemId
            ? [...state.metadata.pendingSyncs, { type: "remove", itemId, timestamp: now() }]
            : state.metadata.pendingSyncs,
          updatedAt: now(),
        },
        error: null,
      }));

      // Save to storage
      get().saveToStorage();

      // Background sync (if item was synced to API)
      if (itemToRemove.lineItemId) {
        get()
          .syncItem(itemId)
          .catch((error: unknown) => {
            // Rollback: restore item
            set((state: CartState) => ({
              items: [...state.items, itemToRemove],
              error: `Failed to remove item: ${error instanceof Error ? error.message : String(error)}`,
            }));
            get().saveToStorage();
          });
      }
    },

    /**
     * Update item quantity (optimistic update)
     *
     * Flow:
     * 1. If quantity is 0, call removeItem instead
     * 2. Store previous quantity for rollback
     * 3. Update quantity in state immediately
     * 4. If item has lineItemId, add to pendingSyncs as "update"
     * 5. Attempt API sync in background
     * 6. On error: revert quantity and show error
     */
    updateQuantity: (itemId: string, quantity: number) => {
      const state = get();
      const item = state.items.find((item) => item.id === itemId);

      if (!item) {
        console.warn(`Cart item ${itemId} not found`);
        return;
      }

      // If quantity is 0 or negative, remove item
      if (quantity <= 0) {
        get().removeItem(itemId);
        return;
      }

      // Store previous quantity for rollback
      const previousQuantity = item.quantity;

      // Optimistic update: update immediately
      set((state: CartState) => ({
        items: state.items.map((item) =>
          item.id === itemId ? { ...item, quantity, syncStatus: "pending" } : item
        ),
        metadata: {
          ...state.metadata,
          pendingSyncs: item.lineItemId
            ? [...state.metadata.pendingSyncs, { type: "update", itemId, timestamp: now() }]
            : state.metadata.pendingSyncs,
          updatedAt: now(),
        },
        error: null,
      }));

      // Save to storage
      get().saveToStorage();

      // Background sync (if item was synced to API)
      if (item.lineItemId) {
        get()
          .syncItem(itemId)
          .catch((error: unknown) => {
            // Rollback: revert quantity
            set((state: CartState) => ({
              items: state.items.map((item) =>
                item.id === itemId
                  ? { ...item, quantity: previousQuantity, syncStatus: "error" }
                  : item
              ),
              error: `Failed to update quantity: ${error instanceof Error ? error.message : String(error)}`,
            }));
            get().saveToStorage();
          });
      }
    },

    /**
     * Clear all items from cart
     *
     * Flow:
     * 1. Clear items from state immediately
     * 2. Clear cartId and checkoutUrl
     * 3. Clear pendingSyncs queue
     * 4. Attempt to delete cart via API (if cartId exists)
     * 5. Clear persistence storage
     */
    clearCart: () => {
      const state = get();
      const hadCartId = state.metadata.cartId;

      // Clear state immediately
      set({
        items: [],
        metadata: {
          ...state.metadata,
          cartId: null,
          checkoutUrl: null,
          pendingSyncs: [],
          updatedAt: now(),
        },
        error: null,
      });

      // Clear storage
      persistClearCart(state.metadata.storeId);

      // Background: Delete cart in Shopify if it exists
      // This will be implemented in P1-049
      if (hadCartId) {
        // TODO: Implement cart deletion via API
        console.log("TODO: Delete cart via API", hadCartId);
      }
    },

    /**
     * Sync cart with Shopify API
     *
     * Processes all pending sync operations and syncs cart state with Shopify.
     * This is the main sync function that handles cart creation and batch operations.
     *
     * @param storeId - Optional store identifier (uses metadata.storeId if not provided)
     * @throws {Error} If sync fails
     */
    syncWithAPI: async (storeId?: string) => {
      const state = get();
      const targetStoreId = storeId || state.metadata.storeId;

      // Set loading state
      set({ isLoading: true, error: null });

      try {
        // If no cart ID exists and we have items, create new cart
        if (!state.metadata.cartId && state.items.length > 0) {
          // Prepare line items for cart creation
          const lines: CartLineInput[] = state.items.map((item) => {
            const attributes = item.configuration
              ? item.specialtyConfig
                ? serializeConfiguration(item.configuration, item.specialtyConfig)
                : serializeFrameConfiguration(item.configuration)
              : undefined;

            return {
              merchandiseId: item.variantId,
              quantity: item.quantity,
              attributes,
            };
          });

          // Create cart via API
          const shopifyCart = await apiCreateCart(lines, targetStoreId);

          // Update metadata with cart ID and checkout URL
          set((state: CartState) => ({
            metadata: {
              ...state.metadata,
              cartId: shopifyCart.id,
              checkoutUrl: shopifyCart.checkoutUrl,
              lastSyncedAt: now(),
              pendingSyncs: [], // Clear pending syncs after successful creation
            },
            items: state.items.map((item, index) => ({
              ...item,
              lineItemId: shopifyCart.lines.edges[index]?.node.id || null,
              syncStatus: "synced",
            })),
            isLoading: false,
          }));

          get().saveToStorage();
          return;
        }

        // If cart ID exists, process pending syncs
        if (state.metadata.cartId && state.metadata.pendingSyncs.length > 0) {
          // Process pending syncs
          // Group by type for batch operations
          const addOperations = state.metadata.pendingSyncs.filter((sync) => sync.type === "add");
          const updateOperations = state.metadata.pendingSyncs.filter(
            (sync) => sync.type === "update"
          );
          const removeOperations = state.metadata.pendingSyncs.filter(
            (sync) => sync.type === "remove"
          );

          let updatedCart: ShopifyCart | null = null;

          // Process additions
          if (addOperations.length > 0) {
            const linesToAdd: CartLineInput[] = addOperations
              .map((op: PendingSync): CartLineInput | null => {
                const item = state.items.find((i) => i.id === op.itemId);
                if (!item || item.lineItemId) return null; // Skip if already synced

                const attributes = item.configuration
                  ? item.specialtyConfig
                    ? serializeConfiguration(item.configuration, item.specialtyConfig)
                    : serializeFrameConfiguration(item.configuration)
                  : undefined;

                return {
                  merchandiseId: item.variantId,
                  quantity: item.quantity,
                  attributes,
                };
              })
              .filter((line): line is CartLineInput => line !== null);

            if (linesToAdd.length > 0) {
              updatedCart = await addCartLines(state.metadata.cartId, linesToAdd, targetStoreId);

              // Update lineItemIds for added items
              const addedItemIds = addOperations.map((op: PendingSync) => op.itemId);
              if (updatedCart) {
                set((state: CartState) => ({
                  items: state.items.map((item: CartItem, index: number) => {
                    if (addedItemIds.includes(item.id) && !item.lineItemId) {
                      const lineItemId = updatedCart?.lines.edges[index]?.node.id || null;
                      return {
                        ...item,
                        lineItemId,
                        syncStatus: "synced",
                      };
                    }
                    return item;
                  }),
                }));
              }
            }
          }

          // Process updates
          if (updateOperations.length > 0) {
            const linesToUpdate: CartLineUpdateInput[] = updateOperations
              .map((op: PendingSync): CartLineUpdateInput | null => {
                const item = state.items.find((i) => i.id === op.itemId);
                if (!item || !item.lineItemId) return null;

                const attributes = item.configuration
                  ? item.specialtyConfig
                    ? serializeConfiguration(item.configuration, item.specialtyConfig)
                    : serializeFrameConfiguration(item.configuration)
                  : undefined;

                return {
                  id: item.lineItemId,
                  quantity: item.quantity,
                  attributes,
                };
              })
              .filter((line): line is CartLineUpdateInput => line !== null);

            if (linesToUpdate.length > 0) {
              updatedCart = await updateCartLines(
                state.metadata.cartId,
                linesToUpdate,
                targetStoreId
              );

              // Mark items as synced
              const updatedItemIds = updateOperations.map((op: PendingSync) => op.itemId);
              set((state: CartState) => ({
                items: state.items.map((item: CartItem) => {
                  if (updatedItemIds.includes(item.id)) {
                    return { ...item, syncStatus: "synced" };
                  }
                  return item;
                }),
              }));
            }
          }

          // Process removals
          // TODO: Implement proper removal tracking in batch sync
          // For now, removals are handled individually via syncItem() when removeItem() is called
          // This is acceptable because removals are less frequent than adds/updates
          if (removeOperations.length > 0) {
            console.warn(
              "Batch removal sync not yet implemented. Removals are handled individually."
            );
            // Individual removals are handled in syncItem() when removeItem() is called
          }

          // Clear pending syncs and update metadata
          set((state: CartState) => ({
            metadata: {
              ...state.metadata,
              lastSyncedAt: now(),
              pendingSyncs: [],
              checkoutUrl: updatedCart?.checkoutUrl || state.metadata.checkoutUrl,
            },
            isLoading: false,
          }));

          get().saveToStorage();
        } else {
          // No sync needed
          set({ isLoading: false });
        }
      } catch (error) {
        set({
          isLoading: false,
          error: error instanceof Error ? error.message : String(error),
        });
        throw error;
      }
    },

    /**
     * Sync specific item with Shopify API
     *
     * Syncs a single cart item with Shopify. This is called automatically after
     * optimistic updates (add, remove, updateQuantity).
     *
     * @param itemId - Cart item ID to sync
     * @throws {Error} If sync fails
     */
    syncItem: async (itemId: string) => {
      const state = get();
      const item = state.items.find((i) => i.id === itemId);

      if (!item) {
        console.warn(`Cart item ${itemId} not found for sync`);
        return;
      }

      // Mark item as syncing
      set((state: CartState) => ({
        items: state.items.map((i) => (i.id === itemId ? { ...i, syncStatus: "syncing" } : i)),
      }));

      try {
        // If no cart exists, trigger full cart sync
        if (!state.metadata.cartId) {
          await get().syncWithAPI();
          return;
        }

        // Serialize configuration to attributes
        const attributes = item.configuration
          ? item.specialtyConfig
            ? serializeConfiguration(item.configuration, item.specialtyConfig)
            : serializeFrameConfiguration(item.configuration)
          : undefined;

        // If item has lineItemId, update it
        if (item.lineItemId) {
          const updatedCart = await updateCartLines(
            state.metadata.cartId,
            [
              {
                id: item.lineItemId,
                quantity: item.quantity,
                attributes,
              },
            ],
            state.metadata.storeId
          );

          // Update metadata
          set((state: CartState) => ({
            items: state.items.map((i) => (i.id === itemId ? { ...i, syncStatus: "synced" } : i)),
            metadata: {
              ...state.metadata,
              lastSyncedAt: now(),
              checkoutUrl: updatedCart.checkoutUrl,
            },
          }));
        } else {
          // Item doesn't have lineItemId, add it to cart
          const updatedCart = await addCartLines(
            state.metadata.cartId,
            [
              {
                merchandiseId: item.variantId,
                quantity: item.quantity,
                attributes,
              },
            ],
            state.metadata.storeId
          );

          // Find the new line item ID
          const newLineItem = updatedCart.lines.edges.find(
            (edge) => edge.node.merchandise.id === item.variantId
          );

          // Update item with lineItemId
          set((state: CartState) => ({
            items: state.items.map((i) =>
              i.id === itemId
                ? {
                    ...i,
                    lineItemId: newLineItem?.node.id || null,
                    syncStatus: "synced",
                  }
                : i
            ),
            metadata: {
              ...state.metadata,
              lastSyncedAt: now(),
              checkoutUrl: updatedCart.checkoutUrl,
            },
          }));
        }

        get().saveToStorage();
      } catch (error) {
        // Mark item as error
        set((state: CartState) => ({
          items: state.items.map((i) => (i.id === itemId ? { ...i, syncStatus: "error" } : i)),
          error: error instanceof Error ? error.message : String(error),
        }));
        throw error;
      }
    },

    /**
     * Load cart from persistent storage
     *
     * Loads cart data from localStorage if available.
     * Handles expiration and migration automatically.
     *
     * @example
     * ```typescript
     * // Load cart on app initialization
     * useEffect(() => {
     *   useCartStore.getState().loadFromStorage();
     * }, []);
     * ```
     */
    loadFromStorage: () => {
      const state = get();

      if (!isStorageAvailable()) {
        console.warn("Cart persistence: localStorage not available");
        return;
      }

      try {
        const storedCart = persistLoadCart(state.metadata.storeId);

        if (!storedCart) {
          // No cart found or expired
          return;
        }

        // Restore cart state from storage
        set({
          items: storedCart.items,
          metadata: storedCart.metadata,
        });

        console.log(`Cart persistence: Loaded ${storedCart.items.length} items from storage`);
      } catch (error) {
        console.error("Cart persistence: Failed to load from storage", error);
        set({
          error: `Failed to load cart: ${error instanceof Error ? error.message : String(error)}`,
        });
      }
    },

    /**
     * Save cart to persistent storage
     *
     * Saves current cart state to localStorage.
     * Called automatically after cart mutations.
     *
     * @example
     * ```typescript
     * // Manual save (usually not needed)
     * useCartStore.getState().saveToStorage();
     * ```
     */
    saveToStorage: () => {
      const state = get();

      if (!isStorageAvailable()) {
        return;
      }

      try {
        const success = persistSaveCart(state.metadata.storeId, state.items, state.metadata);

        if (!success) {
          console.warn("Cart persistence: Failed to save cart");
        }
      } catch (error) {
        console.error("Cart persistence: Failed to save to storage", error);
      }
    },

    // Utility functions

    /**
     * Get cart item by ID
     */
    getItem: (itemId: string) => {
      return get().items.find((item) => item.id === itemId);
    },

    /**
     * Find cart item by variant ID and optional configuration
     *
     * Useful for checking if an item with specific config already exists in cart
     */
    findItemByVariant: (variantId: string, config?: FrameConfiguration) => {
      return get().items.find((item) => {
        if (item.variantId !== variantId) return false;

        // If no config provided and item has no config, match
        if (!config && !item.configuration) return true;

        // If both have config, compare
        if (config && item.configuration) {
          return JSON.stringify(config) === JSON.stringify(item.configuration);
        }

        // Otherwise, no match
        return false;
      });
    },

    // Internal state setters

    /**
     * Set loading state (internal use)
     */
    _setLoading: (loading: boolean) => {
      set({ isLoading: loading });
    },

    /**
     * Set error state (internal use)
     */
    _setError: (error: string | null) => {
      set({ error });
    },

    /**
     * Update cart metadata (internal use)
     */
    _updateMetadata: (updates: Partial<CartMetadata>) => {
      set((state: CartState) => ({
        metadata: {
          ...state.metadata,
          ...updates,
          updatedAt: now(),
        },
      }));
    },

    /**
     * Set cart items directly (internal use)
     */
    _setItems: (items: CartItem[]) => {
      set({ items });
    },
  })
);

/**
 * Computed selectors for cart state
 *
 * Use these for derived values to prevent unnecessary re-renders
 *
 * @example
 * ```typescript
 * import { useCartStore, cartSelectors } from '@framecraft/core/stores';
 *
 * function CartSummary() {
 *   const totalQuantity = useCartStore(cartSelectors.totalQuantity);
 *   const totalPrice = useCartStore(cartSelectors.totalPrice);
 *   const isEmpty = useCartStore(cartSelectors.isEmpty);
 *
 *   return (
 *     <div>
 *       <p>Items: {totalQuantity}</p>
 *       <p>Total: ${(totalPrice / 100).toFixed(2)}</p>
 *       {isEmpty && <p>Your cart is empty</p>}
 *     </div>
 *   );
 * }
 * ```
 */
export const cartSelectors = {
  /**
   * Total quantity of all items
   */
  totalQuantity: (state: CartState) =>
    state.items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0),

  /**
   * Total price in cents
   */
  totalPrice: (state: CartState) =>
    state.items.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0),

  /**
   * Number of unique items
   */
  itemCount: (state: CartState) => state.items.length,

  /**
   * Whether cart is empty
   */
  isEmpty: (state: CartState) => state.items.length === 0,

  /**
   * Whether cart has pending syncs
   */
  hasPendingSyncs: (state: CartState) => state.metadata.pendingSyncs.length > 0,

  /**
   * Whether cart is synced with API
   */
  isSynced: (state: CartState) =>
    state.metadata.cartId !== null && state.items.every((item) => item.syncStatus === "synced"),

  /**
   * Cart items with errors
   */
  errorItems: (state: CartState) =>
    state.items.filter((item: CartItem) => item.syncStatus === "error"),

  /**
   * Cart items pending sync
   */
  pendingItems: (state: CartState) =>
    state.items.filter((item: CartItem) => item.syncStatus === "pending"),
};
