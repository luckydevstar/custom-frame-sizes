"use client";

import { useState, useId, ReactNode } from "react";
import { ShoppingCart, Copy, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "./button";
import { Card } from "./card";
import { Label } from "./label";
import { Separator } from "./separator";
import { QuantitySelector } from "./quantity-selector";

export interface PriceLineItem {
  label: string;
  amount: number;
  /** If true, shows "Included" instead of $0.00 */
  isIncluded?: boolean;
  /** If true, shows amount in green with negative sign (discount) */
  isDiscount?: boolean;
  testId?: string;
}

export interface PriceBoxProps {
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
  /** Itemized price breakdown (if provided, enables collapsible mode) */
  priceItems?: PriceLineItem[];
  /** Warning messages to display above buttons */
  warnings?: ReactNode[];
  /** Additional CSS classes for the Card wrapper */
  className?: string;
  /** Test ID prefix for elements */
  testIdPrefix?: string;
  /** Hide the Copy Link button */
  hideCopyLink?: boolean;
  /** Custom content to render before the Add to Cart button (e.g., sticky copyright checkbox) */
  beforeButtons?: ReactNode;
}

/**
 * Standardized price box component used across all frame designers.
 * Supports both collapsible mode (with itemized pricing) and non-collapsible mode.
 *
 * @example
 * // Non-collapsible mode (simple)
 * <PriceBox
 *   totalPrice={161.00}
 *   quantity={1}
 *   onQuantityChange={setQuantity}
 *   onAddToCart={handleCheckout}
 * />
 *
 * @example
 * // Collapsible mode (with itemized pricing)
 * <PriceBox
 *   totalPrice={161.00}
 *   quantity={1}
 *   onQuantityChange={setQuantity}
 *   onAddToCart={handleCheckout}
 *   priceItems={[
 *     { label: "Frame", amount: 89.00 },
 *     { label: "Mat Board (single)", amount: 35.00 },
 *     { label: "Standard Glass", amount: 0, isIncluded: true },
 *     { label: "Oversize Fee", amount: 37.00 }
 *   ]}
 *   warnings={[
 *     <div>This frame is oversized...</div>
 *   ]}
 * />
 */
export function PriceBox({
  totalPrice,
  quantity,
  onQuantityChange,
  onAddToCart,
  onCopyLink,
  isProcessing = false,
  disabled = false,
  priceItems,
  warnings,
  className = "",
  testIdPrefix = "",
  hideCopyLink = false,
  beforeButtons,
}: PriceBoxProps) {
  const [showPricingDetails, setShowPricingDetails] = useState(false);
  const pricingDetailsId = useId();

  const hasItemizedPricing = priceItems && priceItems.length > 0;
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
    <Card className={`hidden md:block md:sticky md:bottom-4 p-3 ${className}`}>
      <div className="space-y-2">
        {/* Total with Optional Toggle */}
        <div className="flex justify-between items-center">
          {hasItemizedPricing ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPricingDetails(!showPricingDetails)}
              className="flex items-center gap-1 text-sm font-semibold hover:text-primary p-0 h-auto"
              data-testid={`${testIdPrefix}button-toggle-pricing-details`}
              aria-expanded={showPricingDetails}
              aria-controls={pricingDetailsId}
            >
              <span>Total</span>
              {showPricingDetails ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </Button>
          ) : (
            <span className="text-sm font-semibold">Total</span>
          )}
          <span className="text-lg font-bold" data-testid={`${testIdPrefix}text-total-price`}>
            ${finalTotal.toFixed(2)}
          </span>
        </div>

        {/* Collapsible Pricing Details */}
        {hasItemizedPricing && showPricingDetails && (
          <>
            <Separator />
            <div id={pricingDetailsId} className="space-y-2">
              {priceItems.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  {item.isIncluded ? (
                    <span data-testid={item.testId} className="text-muted-foreground">
                      Included
                    </span>
                  ) : (
                    <span
                      data-testid={item.testId}
                      className={item.isDiscount ? "text-green-600" : ""}
                    >
                      {item.isDiscount && item.amount < 0 ? "-" : ""}$
                      {Math.abs(item.amount).toFixed(2)}
                    </span>
                  )}
                </div>
              ))}
            </div>
            <Separator />
          </>
        )}

        {/* Quantity Selector */}
        <div className="flex items-center justify-between">
          <Label htmlFor="quantity" className="text-xs font-medium">
            Quantity
          </Label>
          <QuantitySelector
            value={quantity}
            onChange={onQuantityChange}
            className="w-20"
            testId={`${testIdPrefix}select-quantity`}
          />
        </div>

        {/* Warning Messages */}
        {warnings && warnings.map((warning, index) => <div key={index}>{warning}</div>)}

        {/* Custom Content Before Buttons (e.g., sticky copyright checkbox) */}
        {beforeButtons}

        {/* Add to Cart Button */}
        <Button
          className="w-full"
          onClick={onAddToCart}
          disabled={disabled || isProcessing}
          data-testid={`${testIdPrefix}button-add-to-cart`}
        >
          {isProcessing ? (
            <>Processing...</>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </>
          )}
        </Button>

        {/* Copy Link Button */}
        {!hideCopyLink && (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleCopyLink}
            data-testid={`${testIdPrefix}button-copy-link`}
          >
            <Copy className="h-3 w-3 mr-1" />
            Copy Link
          </Button>
        )}
      </div>
    </Card>
  );
}
