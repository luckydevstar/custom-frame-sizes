"use client";

import { useEffect } from "react";

export interface ProcessingOverlayProps {
  isOpen: boolean;
  /** Primary heading */
  message?: string;
  /** Current step (e.g. AI upscaling, saving to storage) */
  detail?: string;
}

export function ProcessingOverlay({
  isOpen,
  message = "Processing your order...",
  detail,
}: ProcessingOverlayProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      role="dialog"
      aria-busy="true"
      aria-live="polite"
      aria-label={message}
    >
      {/* Dark semi-transparent background overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Processing content */}
      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-4 rounded-lg bg-background p-8 shadow-xl mx-4">
        {/* Spinner */}
        <div className="relative h-12 w-12 shrink-0">
          <div className="absolute inset-0 rounded-full border-4 border-muted" />
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-r-primary border-t-primary" />
        </div>

        <div className="text-center space-y-3">
          <p className="text-lg font-medium text-foreground">{message}</p>
          <p className="min-h-[3rem] text-sm leading-snug text-muted-foreground">
            {detail ?? "Please wait…"}
          </p>
          <p className="text-xs text-muted-foreground/90">
            Please do not close this window or go back
          </p>
        </div>
      </div>
    </div>
  );
}
