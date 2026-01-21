/**
 * Intelligent Preview Sizing Hook
 *
 * Provides dynamic preview container height calculation based on frame aspect ratio.
 * Allows portrait frames to use more vertical space for better visibility while preventing
 * landscape frames from becoming too tall.
 *
 * This hook should be used by ALL specialty frame designers for consistent preview sizing behavior.
 *
 * @example
 * ```tsx
 * const { containerRef, previewContainerHeight, containerWidth } = useIntelligentPreviewSizing({
 *   frameWidth: 11.5,
 *   frameHeight: 14.5,
 *   plaqueEnabled: false,
 *   isMobile: false,
 * });
 *
 * // Use in JSX:
 * <div
 *   ref={containerRef}
 *   style={{ minHeight: `${previewContainerHeight}px` }}
 * >
 *   <Preview containerWidth={containerWidth} containerHeight={previewContainerHeight} />
 * </div>
 * ```
 */

import { useState, useEffect, useRef, useMemo } from "react";

export interface IntelligentPreviewSizingOptions {
  /**
   * Frame width in inches
   */
  frameWidth: number;

  /**
   * Frame height in inches (base height, before plaque extension)
   */
  frameHeight: number;

  /**
   * Whether brass plaque is enabled (adds extension to bottom of frame)
   * @default false
   */
  plaqueEnabled?: boolean;

  /**
   * Height extension added when plaque is enabled (in inches)
   * @default 1.5 (standard for most designers)
   */
  plaqueExtension?: number;

  /**
   * Whether the device is mobile (affects height bounds)
   */
  isMobile: boolean;

  /**
   * Minimum container height in pixels (mobile)
   * @default 320
   */
  minHeightMobile?: number;

  /**
   * Minimum container height in pixels (desktop)
   * @default 420
   */
  minHeightDesktop?: number;

  /**
   * Maximum container height in pixels (desktop)
   * @default 900
   */
  maxHeightDesktop?: number;

  /**
   * Maximum container height in pixels (mobile)
   * @default 620
   */
  maxHeightMobile?: number;

  /**
   * Padding inside container (affects how much space preview takes)
   * Desktop: typically 64px (32px per side from p-4)
   * Mobile: typically 32px (16px per side from p-2)
   * @default { mobile: 32, desktop: 64 }
   */
  containerPadding?: {
    mobile: number;
    desktop: number;
  };
}

export interface IntelligentPreviewSizingResult {
  /**
   * Ref to attach to the preview container element
   */
  containerRef: React.RefObject<HTMLDivElement>;

  /**
   * Calculated optimal container height in pixels
   */
  previewContainerHeight: number;

  /**
   * Current container width in pixels (tracked via ResizeObserver)
   */
  containerWidth: number;
}

/**
 * Hook for intelligent preview container sizing
 *
 * Calculates optimal preview container height based on frame aspect ratio,
 * allowing portrait frames to use more vertical space while keeping reasonable bounds.
 *
 * Uses ResizeObserver to track container width (not height to avoid feedback loops).
 */
export function useIntelligentPreviewSizing(
  options: IntelligentPreviewSizingOptions
): IntelligentPreviewSizingResult {
  const {
    frameWidth,
    frameHeight,
    plaqueEnabled = false,
    plaqueExtension = 1.5,
    isMobile,
    minHeightMobile = 320,
    minHeightDesktop = 420,
    maxHeightDesktop = 900,
    maxHeightMobile = 620,
    containerPadding = { mobile: 32, desktop: 64 },
  } = options;

  // Container ref for ResizeObserver
  const containerRef = useRef<HTMLDivElement>(null);

  // Track container width (not height to avoid feedback loops)
  const [containerWidth, setContainerWidth] = useState(400); // Default estimate

  // Track container size (width only to avoid feedback loops with height)
  useEffect(() => {
    if (!containerRef.current) return;

    let timeoutId: NodeJS.Timeout;

    const resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        for (const entry of entries) {
          const newWidth = Math.round(entry.contentRect.width);
          // DO NOT track height - it creates a feedback loop with previewContainerHeight

          setContainerWidth((prev) => {
            // Tolerance threshold: only update if width change is > 2px
            const widthDiff = Math.abs(newWidth - prev);

            if (widthDiff > 2) {
              return newWidth;
            }
            return prev;
          });
        }
      }, 16); // Debounce for 1 frame
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, []);

  // Calculate intelligent preview container height based on frame aspect ratio
  const previewContainerHeight = useMemo(() => {
    // Get the adjusted frame height (includes plaque extension if enabled)
    const adjustedHeight = plaqueEnabled ? frameHeight + plaqueExtension : frameHeight;

    // Calculate frame aspect ratio (height / width)
    const frameAspectRatio = adjustedHeight / frameWidth;

    // Calculate responsive width (use container width if available, otherwise estimate)
    const availableWidth = containerWidth > 0 ? containerWidth : 400; // Default estimate

    // Calculate ideal height based on aspect ratio with padding
    const padding = isMobile ? containerPadding.mobile : containerPadding.desktop;
    const idealHeight = (availableWidth - padding) * frameAspectRatio + padding;

    // Set reasonable bounds (mobile vs desktop)
    const minHeight = isMobile ? minHeightMobile : minHeightDesktop;
    const maxHeight = isMobile ? maxHeightMobile : maxHeightDesktop;

    return Math.min(Math.max(idealHeight, minHeight), maxHeight);
  }, [
    frameWidth,
    frameHeight,
    plaqueEnabled,
    plaqueExtension,
    containerWidth,
    isMobile,
    minHeightMobile,
    minHeightDesktop,
    maxHeightDesktop,
    maxHeightMobile,
    containerPadding,
  ]);

  return {
    containerRef,
    previewContainerHeight,
    containerWidth,
  };
}
