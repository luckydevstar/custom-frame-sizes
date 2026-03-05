"use client";

import { useEffect } from "react";
import { useCartStore } from "@framecraft/core/stores";

/**
 * Hydrates the cart store from localStorage on mount so the cart page and header
 * show persisted items after a full reload.
 */
export function CartHydration() {
  useEffect(() => {
    useCartStore.getState().loadFromStorage();
  }, []);
  return null;
}
