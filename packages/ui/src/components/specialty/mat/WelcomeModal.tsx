"use client";

/**
 * WelcomeModal – first-time welcome for Mat Designer (4 steps).
 * Migrated from CustomFrameSizes-CODE client/src/features/mat/WelcomeModal.tsx.
 */

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Checkbox } from "../../ui/checkbox";
import { Label } from "../../ui/label";
import { Square, Palette, Maximize2, ShoppingCart } from "lucide-react";

const WELCOME_SHOWN_KEY = "mat-designer-welcome-shown";

export interface WelcomeModalProps {
  onClose?: () => void;
}

export function WelcomeModal({ onClose }: WelcomeModalProps) {
  const [open, setOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    if (typeof localStorage === "undefined") return;
    const hasSeenWelcome = localStorage.getItem(WELCOME_SHOWN_KEY);
    if (!hasSeenWelcome) setOpen(true);
  }, []);

  const handleClose = () => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(WELCOME_SHOWN_KEY, "true");
    }
    setOpen(false);
    onClose?.();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) handleClose();
      }}
    >
      <DialogContent
        className="max-w-2xl max-h-[90vh] flex flex-col p-4 sm:p-6"
        data-testid="welcome-modal"
      >
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-xl sm:text-2xl">Welcome to the Mat Designer!</DialogTitle>
          <DialogDescription className="sr-only">
            Learn how to use the mat designer in 4 easy steps
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="space-y-3 sm:space-y-4 py-4">
            <p className="text-foreground font-medium text-sm sm:text-base">
              Design custom mat boards in 4 easy steps:
            </p>

            <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary text-primary-foreground font-semibold shrink-0 text-sm">
                  1
                </div>
                <div>
                  <div className="flex items-center gap-2 font-medium text-foreground mb-0.5 sm:mb-1">
                    <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Choose Your Mat Size
                  </div>
                  <p className="text-muted-foreground leading-snug">
                    Start with a common size or enter custom dimensions. We&apos;ve loaded a popular
                    16×20&quot; mat with an 8×10&quot; opening as an example.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 sm:gap-3">
                <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary text-primary-foreground font-semibold shrink-0 text-sm">
                  2
                </div>
                <div>
                  <div className="flex items-center gap-2 font-medium text-foreground mb-0.5 sm:mb-1">
                    <Square className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Add Openings (Windows)
                  </div>
                  <p className="text-muted-foreground leading-snug">
                    Openings are the &quot;windows&quot; where your artwork shows through. Resize
                    and position them in the controls.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 sm:gap-3">
                <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary text-primary-foreground font-semibold shrink-0 text-sm">
                  3
                </div>
                <div>
                  <div className="flex items-center gap-2 font-medium text-foreground mb-0.5 sm:mb-1">
                    <Palette className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Pick Your Colors
                  </div>
                  <p className="text-muted-foreground leading-snug">
                    Choose from professional mat board colors. Try a double mat for added elegance!
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 sm:gap-3">
                <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary text-primary-foreground font-semibold shrink-0 text-sm">
                  4
                </div>
                <div>
                  <div className="flex items-center gap-2 font-medium text-foreground mb-0.5 sm:mb-1">
                    <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Add to Cart
                  </div>
                  <p className="text-muted-foreground leading-snug">
                    See your price update in real-time. When you&apos;re happy with your design, add
                    it to cart!
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-muted rounded-lg p-3 sm:p-4 mt-3 sm:mt-4">
              <p className="font-medium text-foreground mb-1.5 sm:mb-2 text-xs sm:text-sm">
                Pro Tips:
              </p>
              <ul className="text-xs sm:text-sm text-muted-foreground space-y-0.5 sm:space-y-1 list-disc list-inside leading-snug">
                <li>Use overall mat size and opening size for exact dimensions</li>
                <li>Enable &quot;Borders&quot; to see measurement lines on the preview</li>
                <li>Add a frame and glass for a complete custom frame package</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:justify-between pt-4 border-t shrink-0">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="dont-show"
              checked={dontShowAgain}
              onCheckedChange={(checked) => setDontShowAgain(checked === true)}
              data-testid="checkbox-dont-show-again"
            />
            <Label htmlFor="dont-show" className="text-xs sm:text-sm cursor-pointer">
              Don&apos;t show this again
            </Label>
          </div>
          <Button
            onClick={handleClose}
            size="default"
            className="w-full sm:w-auto"
            data-testid="button-get-started"
          >
            Get Started
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
