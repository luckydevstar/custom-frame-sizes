/**
 * Cart Store Tests
 *
 * Tests for cart state management with Zustand.
 * Tests optimistic updates, selectors, and state mutations.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useCartStore, cartSelectors, type AddCartItemInput } from "../cart-store";

// Mock the persistence module
vi.mock("../cart-persistence", () => ({
  saveCart: vi.fn(() => true),
  loadCart: vi.fn(() => null),
  clearCart: vi.fn(),
  isStorageAvailable: vi.fn(() => true),
}));

// Mock the Shopify cart API
vi.mock("../../shopify/cart", () => ({
  createCart: vi.fn(),
  addCartLines: vi.fn(),
  updateCartLines: vi.fn(),
  removeCartLines: vi.fn(),
}));

describe("Cart Store", () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useCartStore.setState({
      items: [],
      metadata: {
        cartId: null,
        checkoutUrl: null,
        storeId: "test-store",
        lastSyncedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        pendingSyncs: [],
      },
      isLoading: false,
      error: null,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("addItem", () => {
    it("should add an item to the cart", () => {
      const input: AddCartItemInput = {
        variantId: "gid://shopify/ProductVariant/123",
        productHandle: "custom-frame",
        title: "Custom Frame",
        variantTitle: "Default",
        imageUrl: "https://example.com/image.jpg",
        price: 2999,
        currency: "USD",
        quantity: 1,
      };

      useCartStore.getState().addItem(input);

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].variantId).toBe("gid://shopify/ProductVariant/123");
      expect(state.items[0].title).toBe("Custom Frame");
      expect(state.items[0].quantity).toBe(1);
      expect(state.items[0].syncStatus).toBe("pending");
      expect(state.items[0].id).toMatch(/^item_/);
    });

    it("should add item with configuration", () => {
      const config = {
        serviceType: "frame-only" as const,
        artworkWidth: 12,
        artworkHeight: 16,
        frameStyleId: "black-classic",
        matType: "single" as const,
        matBorderWidth: 2.5,
        matRevealWidth: 0,
        matColorId: "white",
        glassTypeId: "standard",
      };

      const input: AddCartItemInput = {
        variantId: "gid://shopify/ProductVariant/456",
        productHandle: "custom-frame",
        title: "Custom Frame",
        variantTitle: "Default",
        imageUrl: null,
        price: 4999,
        currency: "USD",
        quantity: 1,
        configuration: config,
      };

      useCartStore.getState().addItem(input);

      const state = useCartStore.getState();
      expect(state.items[0].configuration).toEqual(config);
    });

    it("should add pending sync operation when adding item", () => {
      const input: AddCartItemInput = {
        variantId: "gid://shopify/ProductVariant/789",
        productHandle: "test",
        title: "Test",
        variantTitle: "Default",
        imageUrl: null,
        price: 1000,
        currency: "USD",
        quantity: 1,
      };

      useCartStore.getState().addItem(input);

      const state = useCartStore.getState();
      expect(state.metadata.pendingSyncs).toHaveLength(1);
      expect(state.metadata.pendingSyncs[0].type).toBe("add");
    });
  });

  describe("removeItem", () => {
    beforeEach(() => {
      // Add an item first
      useCartStore.setState({
        items: [
          {
            id: "item_test_123",
            variantId: "gid://shopify/ProductVariant/123",
            productHandle: "custom-frame",
            title: "Custom Frame",
            variantTitle: "Default",
            imageUrl: null,
            price: 2999,
            currency: "USD",
            quantity: 1,
            lineItemId: null,
            addedAt: new Date().toISOString(),
            syncStatus: "pending",
          },
        ],
        metadata: {
          cartId: null,
          checkoutUrl: null,
          storeId: "test-store",
          lastSyncedAt: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          pendingSyncs: [],
        },
        isLoading: false,
        error: null,
      });
    });

    it("should remove an item from the cart", () => {
      useCartStore.getState().removeItem("item_test_123");

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
    });

    it("should warn but not throw when removing non-existent item", () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      useCartStore.getState().removeItem("non-existent");

      expect(warnSpy).toHaveBeenCalled();
      expect(useCartStore.getState().items).toHaveLength(1);

      warnSpy.mockRestore();
    });
  });

  describe("updateQuantity", () => {
    beforeEach(() => {
      useCartStore.setState({
        items: [
          {
            id: "item_test_456",
            variantId: "gid://shopify/ProductVariant/456",
            productHandle: "custom-frame",
            title: "Custom Frame",
            variantTitle: "Default",
            imageUrl: null,
            price: 2999,
            currency: "USD",
            quantity: 1,
            lineItemId: null,
            addedAt: new Date().toISOString(),
            syncStatus: "synced",
          },
        ],
        metadata: {
          cartId: null,
          checkoutUrl: null,
          storeId: "test-store",
          lastSyncedAt: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          pendingSyncs: [],
        },
        isLoading: false,
        error: null,
      });
    });

    it("should update item quantity", () => {
      useCartStore.getState().updateQuantity("item_test_456", 3);

      const state = useCartStore.getState();
      expect(state.items[0].quantity).toBe(3);
    });

    it("should remove item when quantity is 0", () => {
      useCartStore.getState().updateQuantity("item_test_456", 0);

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
    });

    it("should remove item when quantity is negative", () => {
      useCartStore.getState().updateQuantity("item_test_456", -1);

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
    });

    it("should mark item as pending after quantity update", () => {
      useCartStore.getState().updateQuantity("item_test_456", 5);

      const state = useCartStore.getState();
      expect(state.items[0].syncStatus).toBe("pending");
    });
  });

  describe("clearCart", () => {
    beforeEach(() => {
      useCartStore.setState({
        items: [
          {
            id: "item_1",
            variantId: "gid://shopify/ProductVariant/1",
            productHandle: "frame-1",
            title: "Frame 1",
            variantTitle: "Default",
            imageUrl: null,
            price: 1000,
            currency: "USD",
            quantity: 1,
            lineItemId: null,
            addedAt: new Date().toISOString(),
            syncStatus: "synced",
          },
          {
            id: "item_2",
            variantId: "gid://shopify/ProductVariant/2",
            productHandle: "frame-2",
            title: "Frame 2",
            variantTitle: "Default",
            imageUrl: null,
            price: 2000,
            currency: "USD",
            quantity: 2,
            lineItemId: null,
            addedAt: new Date().toISOString(),
            syncStatus: "synced",
          },
        ],
        metadata: {
          cartId: "gid://shopify/Cart/abc123",
          checkoutUrl: "https://checkout.shopify.com/abc123",
          storeId: "test-store",
          lastSyncedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          pendingSyncs: [],
        },
        isLoading: false,
        error: null,
      });
    });

    it("should clear all items from cart", () => {
      useCartStore.getState().clearCart();

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
    });

    it("should clear cart ID and checkout URL", () => {
      useCartStore.getState().clearCart();

      const state = useCartStore.getState();
      expect(state.metadata.cartId).toBeNull();
      expect(state.metadata.checkoutUrl).toBeNull();
    });

    it("should clear pending syncs", () => {
      useCartStore.setState((state) => ({
        ...state,
        metadata: {
          ...state.metadata,
          pendingSyncs: [{ type: "add", itemId: "item_1", timestamp: new Date().toISOString() }],
        },
      }));

      useCartStore.getState().clearCart();

      const state = useCartStore.getState();
      expect(state.metadata.pendingSyncs).toHaveLength(0);
    });
  });

  describe("getItem", () => {
    beforeEach(() => {
      useCartStore.setState({
        items: [
          {
            id: "item_abc",
            variantId: "gid://shopify/ProductVariant/abc",
            productHandle: "frame-abc",
            title: "Frame ABC",
            variantTitle: "Default",
            imageUrl: null,
            price: 3000,
            currency: "USD",
            quantity: 1,
            lineItemId: null,
            addedAt: new Date().toISOString(),
            syncStatus: "synced",
          },
        ],
        metadata: {
          cartId: null,
          checkoutUrl: null,
          storeId: "test-store",
          lastSyncedAt: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          pendingSyncs: [],
        },
        isLoading: false,
        error: null,
      });
    });

    it("should return item by ID", () => {
      const item = useCartStore.getState().getItem("item_abc");

      expect(item).toBeDefined();
      expect(item?.title).toBe("Frame ABC");
    });

    it("should return undefined for non-existent item", () => {
      const item = useCartStore.getState().getItem("non-existent");

      expect(item).toBeUndefined();
    });
  });

  describe("findItemByVariant", () => {
    beforeEach(() => {
      useCartStore.setState({
        items: [
          {
            id: "item_var1",
            variantId: "gid://shopify/ProductVariant/var1",
            productHandle: "frame",
            title: "Frame",
            variantTitle: "Default",
            imageUrl: null,
            price: 1000,
            currency: "USD",
            quantity: 1,
            lineItemId: null,
            addedAt: new Date().toISOString(),
            syncStatus: "synced",
          },
          {
            id: "item_var2",
            variantId: "gid://shopify/ProductVariant/var2",
            productHandle: "frame",
            title: "Frame with Config",
            variantTitle: "Default",
            imageUrl: null,
            price: 2000,
            currency: "USD",
            quantity: 1,
            configuration: {
              serviceType: "frame-only",
              artworkWidth: 12,
              artworkHeight: 16,
              frameStyleId: "black",
              matType: "none",
              matBorderWidth: 0,
              matRevealWidth: 0,
              matColorId: "",
              glassTypeId: "standard",
            },
            lineItemId: null,
            addedAt: new Date().toISOString(),
            syncStatus: "synced",
          },
        ],
        metadata: {
          cartId: null,
          checkoutUrl: null,
          storeId: "test-store",
          lastSyncedAt: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          pendingSyncs: [],
        },
        isLoading: false,
        error: null,
      });
    });

    it("should find item by variant ID", () => {
      const item = useCartStore.getState().findItemByVariant("gid://shopify/ProductVariant/var1");

      expect(item).toBeDefined();
      expect(item?.id).toBe("item_var1");
    });

    it("should find item by variant ID and matching config", () => {
      const config = {
        serviceType: "frame-only" as const,
        artworkWidth: 12,
        artworkHeight: 16,
        frameStyleId: "black",
        matType: "none" as const,
        matBorderWidth: 0,
        matRevealWidth: 0,
        matColorId: "",
        glassTypeId: "standard",
      };

      const item = useCartStore
        .getState()
        .findItemByVariant("gid://shopify/ProductVariant/var2", config);

      expect(item).toBeDefined();
      expect(item?.id).toBe("item_var2");
    });

    it("should return undefined when variant not found", () => {
      const item = useCartStore
        .getState()
        .findItemByVariant("gid://shopify/ProductVariant/nonexistent");

      expect(item).toBeUndefined();
    });
  });
});

describe("Cart Selectors", () => {
  beforeEach(() => {
    useCartStore.setState({
      items: [
        {
          id: "item_1",
          variantId: "gid://shopify/ProductVariant/1",
          productHandle: "frame-1",
          title: "Frame 1",
          variantTitle: "Default",
          imageUrl: null,
          price: 1000, // $10.00
          currency: "USD",
          quantity: 2,
          lineItemId: null,
          addedAt: new Date().toISOString(),
          syncStatus: "synced",
        },
        {
          id: "item_2",
          variantId: "gid://shopify/ProductVariant/2",
          productHandle: "frame-2",
          title: "Frame 2",
          variantTitle: "Default",
          imageUrl: null,
          price: 2500, // $25.00
          currency: "USD",
          quantity: 1,
          lineItemId: null,
          addedAt: new Date().toISOString(),
          syncStatus: "pending",
        },
        {
          id: "item_3",
          variantId: "gid://shopify/ProductVariant/3",
          productHandle: "frame-3",
          title: "Frame 3",
          variantTitle: "Default",
          imageUrl: null,
          price: 500, // $5.00
          currency: "USD",
          quantity: 3,
          lineItemId: "gid://shopify/CartLine/3",
          addedAt: new Date().toISOString(),
          syncStatus: "error",
        },
      ],
      metadata: {
        cartId: "gid://shopify/Cart/test",
        checkoutUrl: null,
        storeId: "test-store",
        lastSyncedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        pendingSyncs: [{ type: "update", itemId: "item_2", timestamp: new Date().toISOString() }],
      },
      isLoading: false,
      error: null,
    });
  });

  describe("totalQuantity", () => {
    it("should return total quantity of all items", () => {
      const state = useCartStore.getState();
      const total = cartSelectors.totalQuantity(state);

      expect(total).toBe(6); // 2 + 1 + 3
    });
  });

  describe("totalPrice", () => {
    it("should return total price in cents", () => {
      const state = useCartStore.getState();
      const total = cartSelectors.totalPrice(state);

      // (1000 * 2) + (2500 * 1) + (500 * 3) = 2000 + 2500 + 1500 = 6000
      expect(total).toBe(6000);
    });
  });

  describe("itemCount", () => {
    it("should return number of unique items", () => {
      const state = useCartStore.getState();
      const count = cartSelectors.itemCount(state);

      expect(count).toBe(3);
    });
  });

  describe("isEmpty", () => {
    it("should return false when cart has items", () => {
      const state = useCartStore.getState();
      const isEmpty = cartSelectors.isEmpty(state);

      expect(isEmpty).toBe(false);
    });

    it("should return true when cart is empty", () => {
      useCartStore.setState({ items: [] });
      const state = useCartStore.getState();
      const isEmpty = cartSelectors.isEmpty(state);

      expect(isEmpty).toBe(true);
    });
  });

  describe("hasPendingSyncs", () => {
    it("should return true when there are pending syncs", () => {
      const state = useCartStore.getState();
      const hasPending = cartSelectors.hasPendingSyncs(state);

      expect(hasPending).toBe(true);
    });

    it("should return false when no pending syncs", () => {
      useCartStore.setState((state) => ({
        ...state,
        metadata: { ...state.metadata, pendingSyncs: [] },
      }));
      const state = useCartStore.getState();
      const hasPending = cartSelectors.hasPendingSyncs(state);

      expect(hasPending).toBe(false);
    });
  });

  describe("isSynced", () => {
    it("should return false when items have non-synced status", () => {
      const state = useCartStore.getState();
      const isSynced = cartSelectors.isSynced(state);

      expect(isSynced).toBe(false);
    });

    it("should return true when all items are synced and cart has ID", () => {
      useCartStore.setState((state) => ({
        ...state,
        items: state.items.map((item) => ({ ...item, syncStatus: "synced" as const })),
      }));
      const state = useCartStore.getState();
      const isSynced = cartSelectors.isSynced(state);

      expect(isSynced).toBe(true);
    });
  });

  describe("errorItems", () => {
    it("should return items with error status", () => {
      const state = useCartStore.getState();
      const errors = cartSelectors.errorItems(state);

      expect(errors).toHaveLength(1);
      expect(errors[0].id).toBe("item_3");
    });
  });

  describe("pendingItems", () => {
    it("should return items with pending status", () => {
      const state = useCartStore.getState();
      const pending = cartSelectors.pendingItems(state);

      expect(pending).toHaveLength(1);
      expect(pending[0].id).toBe("item_2");
    });
  });
});
