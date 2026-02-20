"use client";

/**
 * Bulk Pricing Modal – Mat Designer volume pricing guide.
 * Migrated from CustomFrameSizes-CODE client/src/features/mat/BulkPricingModal.tsx
 */

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";

export interface BulkPricingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Per-mat base price (e.g. total/quantity). Optional until mat pricing is available in store. */
  basePrice?: number;
}

const BULK_TIERS = [
  { quantity: 1, savings: null, label: "Single Mat" },
  { quantity: 2, savings: null, label: "2-Pack" },
  { quantity: 4, savings: 5, label: "4-Pack" },
  { quantity: 10, savings: 15, label: "10-Pack" },
  { quantity: 25, savings: 25, label: "25-Pack" },
  { quantity: 50, savings: 30, label: "50-Pack" },
] as const;

export function BulkPricingModal({
  open,
  onOpenChange,
  basePrice: _basePrice,
}: BulkPricingModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" data-testid="modal-bulk-pricing">
        <DialogHeader>
          <DialogTitle data-testid="heading-bulk-pricing-modal">Volume Pricing Guide</DialogTitle>
          <DialogDescription data-testid="text-bulk-pricing-description">
            Save more when you order multi-packs.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <div className="border rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b">
                  <th className="text-left p-3 font-medium" data-testid="header-quantity">
                    Quantity
                  </th>
                  <th className="text-right p-3 font-medium" data-testid="header-savings">
                    Savings
                  </th>
                </tr>
              </thead>
              <tbody>
                {BULK_TIERS.map((tier, index) => (
                  <tr
                    key={tier.quantity}
                    className={index !== BULK_TIERS.length - 1 ? "border-b" : ""}
                    data-testid={`row-bulk-tier-${tier.quantity}`}
                  >
                    <td className="p-3" data-testid={`text-quantity-${tier.quantity}`}>
                      {tier.label}
                    </td>
                    <td
                      className={`text-right p-3 ${
                        tier.savings
                          ? "text-green-600 dark:text-green-500 font-medium"
                          : "text-muted-foreground"
                      }`}
                      data-testid={`text-savings-${tier.quantity}`}
                    >
                      {tier.savings != null ? `${tier.savings}%` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-muted-foreground mt-4" data-testid="text-bulk-pricing-note">
            Volume pricing is applied automatically when you select a pack size. Perfect for
            photographers, artists, and galleries who need multiple mats.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
