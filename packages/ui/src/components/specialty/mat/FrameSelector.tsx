"use client";

import { useState, useEffect } from "react";
import { getFramesByCategory } from "@framecraft/core";
import { useMatStore } from "./store";

/**
 * Frame Selector – exact migration from CustomFrameSizes-CODE client/src/features/mat/FrameSelector.tsx
 * Allows users to select a frame to bundle with their mat order.
 * Fetches frame bottom images from /api/frames/[sku]/photos when available.
 */
export interface FrameSelectorProps {
  hideNoFrame?: boolean;
}

export function FrameSelector({ hideNoFrame = false }: FrameSelectorProps) {
  const config = useMatStore((state) => state.config);
  const setSelectedFrame = useMatStore((state) => state.setSelectedFrame);

  const frames = getFramesByCategory("picture");
  const [frameBottomUrls, setFrameBottomUrls] = useState<Record<string, string>>({});

  // Fetch frame photos once on mount. Don't use [frames] as dependency: getFramesByCategory()
  // returns a new array reference every time, which would cause an infinite request loop.
  useEffect(() => {
    const framesToFetch = getFramesByCategory("picture").filter((f) => f.sku);
    if (framesToFetch.length === 0) return;
    let cancelled = false;
    const urls: Record<string, string> = {};
    Promise.all(
      framesToFetch.map(async (frame) => {
        try {
          const response = await fetch(`/api/frames/${frame.sku}/photos`);
          if (cancelled) return;
          if (response.ok) {
            const photoSet = await response.json();
            if (photoSet.bottomUrl) {
              urls[frame.id] = photoSet.bottomUrl;
            }
          }
        } catch {
          // Silently fail – use gradient fallback
        }
      })
    ).then(() => {
      if (!cancelled) setFrameBottomUrls(urls);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const selectedFrameId = config.selectedFrameId ?? null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        {!hideNoFrame && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSelectedFrame(null);
            }}
            className={`p-3 rounded-md border-2 text-left transition-colors hover:border-primary/50 ${
              selectedFrameId === null ? "border-primary bg-primary/5" : "border-transparent"
            }`}
            data-testid="button-frame-none"
          >
            <div className="h-12 w-full rounded mb-2 border-2 border-dashed border-muted-foreground/30 flex items-center justify-center bg-muted/30">
              <span className="text-xs text-muted-foreground font-medium">Mat Only</span>
            </div>
            <p className="font-medium text-sm mb-1.5">No Frame</p>
            <div className="space-y-0.5 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <svg
                  className="w-3 h-3 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <span>Mat board only</span>
              </div>
            </div>
          </button>
        )}
        {frames.map((frame) => {
          const frameId = String(frame.id);
          return (
            <button
              type="button"
              key={frame.id}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedFrame(frameId);
              }}
              className={`p-3 rounded-md border-2 text-left transition-colors hover:border-primary/50 ${
                selectedFrameId === frameId ? "border-primary bg-primary/5" : "border-transparent"
              }`}
              data-testid={`button-frame-${frame.id}`}
            >
              {frameBottomUrls[frame.id] ? (
                <div className="h-12 w-full rounded mb-2 overflow-hidden relative">
                  <img
                    src={frameBottomUrls[frame.id]}
                    alt={`${frame.name} frame`}
                    className="h-full w-full object-cover"
                    style={{ objectPosition: "center center" }}
                  />
                </div>
              ) : (
                <div
                  className="h-12 w-full rounded mb-2"
                  style={{
                    background: `linear-gradient(135deg, ${frame.color} 0%, ${frame.borderColor} 100%)`,
                  }}
                />
              )}
              <p className="font-medium text-sm mb-1.5">{frame.name}</p>
              <div className="space-y-0.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <svg
                    className="w-3 h-3 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                  <span>Width: {frame.mouldingWidth}&quot;</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
