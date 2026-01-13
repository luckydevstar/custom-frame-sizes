/**
 * Cart Persistence
 *
 * Handles saving and loading cart data to/from localStorage.
 * Includes expiration logic and version migration support.
 *
 * @packageDocumentation
 */

import type { CartItem, CartMetadata } from "./cart-store";

/**
 * Storage version for migration support
 */
const STORAGE_VERSION = 1;

/**
 * Default cart expiration (30 days)
 */
const DEFAULT_TTL_DAYS = 30;

/**
 * Storage key prefix
 */
const STORAGE_KEY_PREFIX = "framecraft:cart";

/**
 * Stored cart structure
 */
export interface StoredCart {
  /**
   * Storage version for migration support
   */
  version: number;

  /**
   * Cart items
   */
  items: CartItem[];

  /**
   * Cart metadata
   */
  metadata: CartMetadata;

  /**
   * Expiration timestamp (ISO 8601)
   */
  expiresAt: string;
}

/**
 * Generate storage key for a specific store
 *
 * @param storeId - Store identifier
 * @returns Storage key
 */
export function getStorageKey(storeId: string): string {
  return `${STORAGE_KEY_PREFIX}:${storeId}`;
}

/**
 * Calculate expiration timestamp
 *
 * @param days - Number of days until expiration (default: 30)
 * @returns ISO 8601 timestamp
 */
function calculateExpiration(days: number = DEFAULT_TTL_DAYS): string {
  const now = new Date();
  now.setDate(now.getDate() + days);
  return now.toISOString();
}

/**
 * Check if cart is expired
 *
 * @param expiresAt - Expiration timestamp (ISO 8601)
 * @returns true if expired, false otherwise
 */
function isExpired(expiresAt: string): boolean {
  const now = new Date();
  const expires = new Date(expiresAt);
  return now >= expires;
}

/**
 * Check if storage is available
 *
 * Tests if localStorage is accessible and functional.
 * Returns false if storage is unavailable (private mode, disabled, etc.)
 *
 * @returns true if storage is available, false otherwise
 */
export function isStorageAvailable(): boolean {
  try {
    if (typeof window === "undefined" || !window.localStorage) {
      return false;
    }

    // Test write/read/delete
    const testKey = "__storage_test__";
    window.localStorage.setItem(testKey, "test");
    const result = window.localStorage.getItem(testKey);
    window.localStorage.removeItem(testKey);

    return result === "test";
  } catch {
    return false;
  }
}

/**
 * Save cart to localStorage
 *
 * Serializes cart data and saves to localStorage with expiration timestamp.
 *
 * @param storeId - Store identifier
 * @param items - Cart items
 * @param metadata - Cart metadata
 * @param ttlDays - Time to live in days (default: 30)
 * @returns true if save succeeded, false if failed
 */
export function saveCart(
  storeId: string,
  items: CartItem[],
  metadata: CartMetadata,
  ttlDays: number = DEFAULT_TTL_DAYS
): boolean {
  if (!isStorageAvailable()) {
    console.warn("Cart persistence: localStorage not available");
    return false;
  }

  try {
    const storedCart: StoredCart = {
      version: STORAGE_VERSION,
      items,
      metadata,
      expiresAt: calculateExpiration(ttlDays),
    };

    const key = getStorageKey(storeId);
    const serialized = JSON.stringify(storedCart);

    window.localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error("Cart persistence: Failed to save cart", error);
    return false;
  }
}

/**
 * Load cart from localStorage
 *
 * Loads and deserializes cart data from localStorage.
 * Returns null if:
 * - Storage not available
 * - Cart not found
 * - Cart expired
 * - Parse error
 *
 * @param storeId - Store identifier
 * @returns Stored cart or null
 */
export function loadCart(storeId: string): StoredCart | null {
  if (!isStorageAvailable()) {
    return null;
  }

  try {
    const key = getStorageKey(storeId);
    const serialized = window.localStorage.getItem(key);

    if (!serialized) {
      return null;
    }

    const storedCart = JSON.parse(serialized) as StoredCart;

    // Check expiration
    if (isExpired(storedCart.expiresAt)) {
      console.log("Cart persistence: Cart expired, clearing");
      clearCart(storeId);
      return null;
    }

    // Migrate if needed
    const migratedCart = migrateCart(storedCart);

    return migratedCart;
  } catch (error) {
    console.error("Cart persistence: Failed to load cart", error);
    return null;
  }
}

/**
 * Clear cart from localStorage
 *
 * Removes cart data for a specific store.
 *
 * @param storeId - Store identifier
 * @returns true if clear succeeded, false if failed
 */
export function clearCart(storeId: string): boolean {
  if (!isStorageAvailable()) {
    return false;
  }

  try {
    const key = getStorageKey(storeId);
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error("Cart persistence: Failed to clear cart", error);
    return false;
  }
}

/**
 * Migrate cart data to current version
 *
 * Handles schema migrations for backward compatibility.
 * Currently only supports version 1, but structure is in place for future migrations.
 *
 * @param storedCart - Stored cart data
 * @returns Migrated cart data
 */
function migrateCart(storedCart: StoredCart): StoredCart {
  // No migration needed for version 1
  if (storedCart.version === STORAGE_VERSION) {
    return storedCart;
  }

  // Future migrations would go here
  // Example:
  // if (storedCart.version === 1) {
  //   return migrateV1ToV2(storedCart);
  // }

  console.warn(`Cart persistence: Unknown storage version ${storedCart.version}, using as-is`);
  return storedCart;
}

/**
 * Get all cart storage keys
 *
 * Returns all framecraft cart storage keys in localStorage.
 * Useful for debugging or cleanup operations.
 *
 * @returns Array of storage keys
 */
export function getAllCartKeys(): string[] {
  if (!isStorageAvailable()) {
    return [];
  }

  const keys: string[] = [];

  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
        keys.push(key);
      }
    }
  } catch (error) {
    console.error("Cart persistence: Failed to get cart keys", error);
  }

  return keys;
}

/**
 * Clear all framecraft carts from localStorage
 *
 * Removes all cart data for all stores.
 * Use with caution!
 *
 * @returns Number of carts cleared
 */
export function clearAllCarts(): number {
  const keys = getAllCartKeys();
  let cleared = 0;

  for (const key of keys) {
    try {
      window.localStorage.removeItem(key);
      cleared++;
    } catch (error) {
      console.error(`Cart persistence: Failed to clear cart ${key}`, error);
    }
  }

  return cleared;
}

/**
 * Get cart size in bytes
 *
 * Returns the size of the stored cart data in bytes.
 * Useful for monitoring storage usage.
 *
 * @param storeId - Store identifier
 * @returns Size in bytes, or 0 if cart not found
 */
export function getCartSize(storeId: string): number {
  if (!isStorageAvailable()) {
    return 0;
  }

  try {
    const key = getStorageKey(storeId);
    const serialized = window.localStorage.getItem(key);

    if (!serialized) {
      return 0;
    }

    // Calculate size in bytes
    return new Blob([serialized]).size;
  } catch (error) {
    console.error("Cart persistence: Failed to get cart size", error);
    return 0;
  }
}

/**
 * Check if cart exists in storage
 *
 * @param storeId - Store identifier
 * @returns true if cart exists, false otherwise
 */
export function hasCart(storeId: string): boolean {
  if (!isStorageAvailable()) {
    return false;
  }

  try {
    const key = getStorageKey(storeId);
    return window.localStorage.getItem(key) !== null;
  } catch (error) {
    return false;
  }
}
