"use client";

import { useEffect } from "react";

export interface ProcessingOverlayProps {
  isOpen: boolean;
  message?: string;
}

export function ProcessingOverlay({
  isOpen,
  message = "Processing your order...",
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Dark semi-transparent background overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Processing content */}
      <div className="relative z-10 flex flex-col items-center gap-4 bg-background rounded-lg shadow-xl p-8 max-w-sm mx-4">
        {/* Spinner */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-muted" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-primary animate-spin" />
        </div>

        {/* Message */}
        <div className="text-center space-y-2">
          <p className="text-lg font-medium text-foreground">{message}</p>
          <p className="text-sm text-muted-foreground">
            Please do not close this window or go back
          </p>
        </div>
      </div>
    </div>
  );
}
