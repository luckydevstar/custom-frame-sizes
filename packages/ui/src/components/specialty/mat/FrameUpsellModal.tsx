"use client";

/**
 * FrameUpsellModal – upsell frame when user has mat-only design.
 * Migrated from CustomFrameSizes-CODE client/src/features/mat/FrameUpsellModal.tsx.
 * App provides onAddFrame to navigate to frame designer (e.g. /designer or /frames/...).
 */

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import { Separator } from "../../ui/separator";
import { useMatStore } from "./store";
import { useMatPricing } from "./useMatPricing";

export interface FrameUpsellModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called when user clicks "Add Frame & Save 10%". App should navigate to frame designer with mat params. */
  onAddFrame?: () => void;
}

export function FrameUpsellModal({ open, onOpenChange, onAddFrame }: FrameUpsellModalProps) {
  const config = useMatStore((s) => s.config);
  const pricing = useMatPricing();
  const frameEstimate = pricing.total * 1.5;
  const discount = (pricing.total + frameEstimate) * 0.1;
  const finalTotal = pricing.total + frameEstimate - discount;

  const handleAddFrame = () => {
    onAddFrame?.();
    onOpenChange(false);
  };

  const handleJustMat = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="modal-frame-upsell">
        <DialogHeader>
          <DialogTitle>Complete Your Custom Frame</DialogTitle>
          <DialogDescription>
            Add a professional frame to your custom mat and save 10%!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Card className="p-4 bg-muted/50">
            <div className="aspect-video flex items-center justify-center text-muted-foreground">
              <svg viewBox="0 0 200 150" className="w-full h-full">
                <rect
                  x="10"
                  y="10"
                  width="180"
                  height="130"
                  fill="white"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <rect
                  x="50"
                  y="40"
                  width="100"
                  height="70"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="4"
                />
                <text x="100" y="80" textAnchor="middle" className="text-xs" fill="currentColor">
                  Your Mat Design
                </text>
              </svg>
            </div>
          </Card>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Custom mat ({config.singleOrDouble})</span>
              <span>{pricing.formatPrice(pricing.total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Professional frame (estimated)</span>
              <span>{pricing.formatPrice(frameEstimate)}</span>
            </div>
            <div className="flex justify-between text-green-600 dark:text-green-400">
              <span>Bundle discount (10%)</span>
              <span>-{pricing.formatPrice(discount)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total with frame</span>
              <span>{pricing.formatPrice(finalTotal)}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleJustMat} data-testid="button-just-mat">
            Just Mat
          </Button>
          <Button onClick={handleAddFrame} data-testid="button-add-frame" disabled={!onAddFrame}>
            Add Frame & Save 10%
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
