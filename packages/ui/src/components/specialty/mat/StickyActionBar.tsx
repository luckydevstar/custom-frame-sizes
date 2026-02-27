"use client";

/**
 * StickyActionBar – mobile-only bottom bar: Total, Qty, Copy link, Add to Cart.
 * Migrated from CustomFrameSizes-CODE client/src/features/mat/StickyActionBar.tsx.
 * Add to Cart calls optional onAddToCart(config, totalCents) when provided.
 */

import { useState } from "react";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { Copy } from "lucide-react";
import { useMatStore } from "./store";
import { useMatPricing } from "./useMatPricing";
import { MatQuantitySelector } from "./MatQuantitySelector";
import type { MatConfig } from "./types";

export interface StickyActionBarProps {
  /** When provided, Add to Cart calls this with current config and total (quantity * unit price) in dollars. */
  onAddToCart?: (config: MatConfig, totalDollars: number) => void | Promise<void>;
  /** Optional callback for copy-link success (e.g. toast). */
  onCopyLink?: () => void;
  /** Optional: disable Add to Cart when design is invalid (e.g. min borders). */
  isValid?: boolean;
  /** Optional: hide Add to Cart when mat is too large for manufacturing. */
  isUnmanufacturable?: boolean;
}

export function StickyActionBar({
  onAddToCart,
  onCopyLink,
  isValid = true,
  isUnmanufacturable = false,
}: StickyActionBarProps) {
  const config = useMatStore((s) => s.config);
  const setQuantity = useMatStore((s) => s.setQuantity);
  const pricing = useMatPricing();
  const unitTotal = config.selectedFrameId ? pricing.grandTotal : pricing.total;
  const totalDollars = unitTotal * config.quantity;
  const totalDisplay = pricing.formatPrice(totalDollars);

  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!onAddToCart || !isValid || isUnmanufacturable) return;
    setIsAdding(true);
    try {
      await onAddToCart(config, totalDollars);
    } finally {
      setIsAdding(false);
    }
  };

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      onCopyLink?.();
    }
  };

  const addDisabled = !onAddToCart || !isValid || isUnmanufacturable || isAdding;

  return (
    <div className="fixed left-0 right-0 bottom-0 bg-background/95 backdrop-blur-sm border-t shadow-lg md:hidden z-50 safe-area-bottom">
      <div className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex flex-col gap-0.5 min-w-[60px]">
            <span className="text-xs text-muted-foreground">Total</span>
            <span className="font-bold text-sm" data-testid="text-mobile-sticky-total-price">
              {totalDisplay}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <Label htmlFor="quantity-sticky" className="text-xs text-muted-foreground">
              Qty
            </Label>
            <MatQuantitySelector
              value={config.quantity}
              onChange={setQuantity}
              className="w-20 h-8 text-xs"
              testId="select-quantity-sticky"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleCopyLink}
            data-testid="button-copy-link-mobile"
            className="h-11 w-11"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            size="default"
            onClick={handleAddToCart}
            disabled={addDisabled}
            data-testid="button-add-to-cart-mobile"
            className="flex-1 text-xs min-w-0 min-h-11"
          >
            {isAdding ? "Adding…" : "Add to Cart"}
          </Button>
        </div>
        {isUnmanufacturable && (
          <div className="mt-2 bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">
            <p className="text-xs text-destructive font-medium">Too large for online ordering</p>
          </div>
        )}
      </div>
    </div>
  );
}
