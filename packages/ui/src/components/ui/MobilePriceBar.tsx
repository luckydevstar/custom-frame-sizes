import { Copy } from "lucide-react";
import { Button } from "./button";
import { Label } from "./label";
import { QuantitySelector } from "./quantity-selector";

export interface MobilePriceBarProps {
  /** Total price per item (before quantity multiplier) */
  totalPrice: number;
  /** Current quantity */
  quantity: number;
  /** Callback when quantity changes */
  onQuantityChange: (quantity: number) => void;
  /** Callback when Add to Cart is clicked */
  onAddToCart: () => void;
  /** Callback when Copy Link is clicked */
  onCopyLink?: () => void;
  /** Whether the checkout is processing */
  isProcessing?: boolean;
  /** Whether the Add to Cart button should be disabled */
  disabled?: boolean;
  /** Test ID prefix for elements */
  testIdPrefix?: string;
  /** Hide the Copy Link button */
  hideCopyLink?: boolean;
  /** When true, uses absolute positioning instead of fixed */
  absolute?: boolean;
}

/**
 * Standardized mobile sticky price bar used across all frame designers.
 * Displays at the bottom of the screen on mobile devices.
 *
 * @example
 * <MobilePriceBar
 *   totalPrice={161.00}
 *   quantity={1}
 *   onQuantityChange={setQuantity}
 *   onAddToCart={handleCheckout}
 * />
 */
export function MobilePriceBar({
  totalPrice,
  quantity,
  onQuantityChange,
  onAddToCart,
  onCopyLink,
  isProcessing = false,
  disabled = false,
  testIdPrefix = "",
  hideCopyLink = false,
  absolute = false,
}: MobilePriceBarProps) {
  const finalTotal = totalPrice * quantity;

  const handleCopyLink = () => {
    if (onCopyLink) {
      onCopyLink();
    } else {
      const url = window.location.href;
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div
      className={`${absolute ? "absolute" : "fixed"} bottom-0 left-0 right-0 bg-card border-t shadow-lg z-40 lg:hidden`}
    >
      <div className="px-4 py-3">
        <div className="flex items-center gap-2">
          {/* Total Price Display */}
          <div className="flex flex-col gap-0.5 min-w-[60px]">
            <span className="text-xs text-muted-foreground">Total</span>
            <span
              className="font-bold text-sm"
              data-testid={`${testIdPrefix}text-mobile-total-price`}
            >
              ${finalTotal.toFixed(2)}
            </span>
          </div>

          {/* Quantity Input */}
          <div className="flex flex-col gap-0.5">
            <Label htmlFor="quantity-mobile" className="text-xs text-muted-foreground">
              Qty
            </Label>
            <QuantitySelector
              value={quantity}
              onChange={onQuantityChange}
              className="w-14 h-7 text-xs text-center p-0"
              testId={`${testIdPrefix}input-quantity-mobile`}
            />
          </div>

          {/* Copy Link Button - Icon Only */}
          {!hideCopyLink && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopyLink}
              className="h-7 w-7 flex-shrink-0"
              data-testid={`${testIdPrefix}button-copy-link-mobile`}
              aria-label="Copy link to this design"
            >
              <Copy className="h-4 w-4" />
            </Button>
          )}

          {/* Add to Cart Button - Compact */}
          <Button
            size="default"
            onClick={onAddToCart}
            disabled={disabled || isProcessing}
            data-testid={`${testIdPrefix}button-add-to-cart-mobile`}
            className="flex-1 text-xs min-w-0 min-h-11"
          >
            {isProcessing ? "Adding..." : "Add to Cart"}
          </Button>
        </div>
      </div>
    </div>
  );
}
