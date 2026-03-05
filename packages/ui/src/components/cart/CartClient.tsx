"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCartStore, cartSelectors } from "@framecraft/core/stores";
import { formatPrice } from "@framecraft/core";
import { Button } from "../ui/button";
import { CartItemCard } from "./CartItemCard";

export interface CartClientProps {
  /** Optional callback when checkout is clicked (e.g. sync then redirect). When not set, button is disabled with "Checkout coming soon". */
  onCheckout?: () => void | Promise<void>;
  /** Show a link back to designer or home */
  continueShoppingHref?: string;
  className?: string;
}

/**
 * Full cart page content: list of items, subtotal, checkout.
 * Reads from cart store; ready for Shopify Plus Cart Transform (checkout will sync then redirect).
 */
export function CartClient({
  onCheckout,
  continueShoppingHref = "/designer",
  className,
}: CartClientProps) {
  const items = useCartStore((state) => state.items);
  const totalPriceCents = useCartStore(cartSelectors.totalPrice);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const isLoading = useCartStore((state) => state.isLoading);
  const error = useCartStore((state) => state.error);

  const isEmpty = items.length === 0;

  return (
    <div className={className}>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold tracking-tight">Shopping Cart</h1>
        <p className="mt-1 text-muted-foreground">
          Review your custom frames and proceed to checkout.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
          <ShoppingCart className="h-12 w-12 text-muted-foreground/50" aria-hidden />
          <h2 className="mt-4 text-lg font-semibold">Your cart is empty</h2>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Add a custom frame from our designer or browse picture frames to get started.
          </p>
          <Button asChild className="mt-6" size="lg">
            <Link href={continueShoppingHref}>Design a frame</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <ul className="space-y-4">
            {items.map((item) => (
              <li key={item.id}>
                <CartItemCard item={item} onQuantityChange={updateQuantity} onRemove={removeItem} />
              </li>
            ))}
          </ul>

          <div className="flex flex-col items-end gap-4 border-t pt-6">
            <p className="text-lg font-semibold">Subtotal: {formatPrice(totalPriceCents / 100)}</p>
            <p className="text-xs text-muted-foreground">
              Tax and shipping calculated at checkout.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline" size="lg">
                <Link href={continueShoppingHref}>Continue shopping</Link>
              </Button>
              <Button
                size="lg"
                disabled={isLoading || !onCheckout}
                onClick={onCheckout}
                data-testid="button-cart-checkout"
              >
                {isLoading
                  ? "Processing…"
                  : onCheckout
                    ? "Proceed to checkout"
                    : "Checkout (coming soon)"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
