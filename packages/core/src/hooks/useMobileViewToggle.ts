/**
 * Mobile View Toggle Hook with Scroll Position Memory
 *
 * Provides smooth UX for mobile preview/controls toggle in frame designers.
 *
 * Behavior:
 * - When switching TO preview: Always scrolls to top of preview card
 * - When switching TO controls: Restores saved scroll position (or scrolls to heading on first visit)
 * - Scroll position in controls view is remembered across unlimited toggles
 * - Handles rapid toggles by cancelling pending scroll operations
 *
 * NOTE: This hook has been extracted to @framecraft/core.
 *
 * @example
 * ```tsx
 * const {
 *   mobileView,
 *   setMobileView,
 *   showMobileBar,
 *   previewCardRef,
 *   controlsHeadingRef
 * } = useMobileViewToggle({ isMobile });
 *
 * // Attach refs to elements:
 * <Card ref={previewCardRef}>...</Card>
 * <h2 ref={controlsHeadingRef}>Customize Your Frame</h2>
 *
 * // Toggle button:
 * <button onClick={() => setMobileView(mobileView === 'preview' ? 'controls' : 'preview')}>
 *   Toggle
 * </button>
 * ```
 */

import { useState, useEffect, useRef, useCallback } from "react";

export type MobileViewState = "preview" | "controls";

export interface UseMobileViewToggleOptions {
  /**
   * Whether the device is mobile (from useIsMobile hook)
   */
  isMobile: boolean;

  /**
   * Height of the mobile header in pixels
   * @default 56
   */
  headerHeight?: number;

  /**
   * Gap above preview card when scrolling to it
   * @default 12
   */
  previewTopGap?: number;

  /**
   * Gap above controls heading when scrolling to it
   * @default 16
   */
  controlsTopGap?: number;
}

export interface UseMobileViewToggleResult {
  /**
   * Current mobile view state
   */
  mobileView: MobileViewState;

  /**
   * Set the mobile view state (triggers scroll behavior)
   */
  setMobileView: (view: MobileViewState) => void;

  /**
   * Whether the mobile sticky bar should be visible
   */
  showMobileBar: boolean;

  /**
   * Ref to attach to the preview Card wrapper
   */
  previewCardRef: React.RefObject<HTMLDivElement>;

  /**
   * Ref to attach to the controls section heading
   */
  controlsHeadingRef: React.RefObject<HTMLHeadingElement>;
}

export function useMobileViewToggle(
  options: UseMobileViewToggleOptions
): UseMobileViewToggleResult {
  const { isMobile, headerHeight = 56, previewTopGap = 12, controlsTopGap = 16 } = options;

  // Current view state (start with preview on page load)
  const [mobileView, setMobileViewInternal] = useState<MobileViewState>("preview");

  // Track previous view to detect actual toggles
  const prevMobileView = useRef<MobileViewState>("preview");

  // Track if it's the first time visiting controls
  const [isFirstControlsVisit, setIsFirstControlsVisit] = useState(true);

  // Saved scroll position for controls view
  const savedControlsScrollPosition = useRef<number>(0);

  // Scroll-based visibility for mobile sticky bar
  const [showMobileBar, setShowMobileBar] = useState(false);

  // Refs for scroll targets
  const previewCardRef = useRef<HTMLDivElement>(null);
  const controlsHeadingRef = useRef<HTMLHeadingElement>(null);

  // Track pending RAF to cancel on rapid toggles
  const pendingRafId = useRef<number | null>(null);

  // Track if a scroll operation is in progress
  const isScrolling = useRef(false);

  // Show mobile bar after first scroll
  useEffect(() => {
    if (!isMobile) return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setShowMobileBar(true);
      }, 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, [isMobile]);

  // Custom setter that handles scroll logic
  const setMobileView = useCallback(
    (newView: MobileViewState) => {
      if (!isMobile) {
        setMobileViewInternal(newView);
        return;
      }

      // Cancel any pending RAF from previous toggle (handles rapid clicks)
      if (pendingRafId.current !== null) {
        cancelAnimationFrame(pendingRafId.current);
        pendingRafId.current = null;
      }

      const currentView = prevMobileView.current;

      // Don't do anything if view hasn't changed
      if (currentView === newView) return;

      // Save scroll position when LEAVING controls view
      // Only save if we're not in the middle of a scroll operation
      if (currentView === "controls" && newView === "preview" && !isScrolling.current) {
        savedControlsScrollPosition.current = window.scrollY;
      }

      // Update state
      setMobileViewInternal(newView);
    },
    [isMobile]
  );

  // Handle scroll after view change
  useEffect(() => {
    if (!isMobile) return;

    // Only scroll if mobile view actually changed
    if (prevMobileView.current === mobileView) return;

    // Cancel any pending RAF
    if (pendingRafId.current !== null) {
      cancelAnimationFrame(pendingRafId.current);
    }

    // Use requestAnimationFrame to ensure DOM has updated
    pendingRafId.current = requestAnimationFrame(() => {
      isScrolling.current = true;

      if (mobileView === "controls") {
        // Switching TO controls
        if (isFirstControlsVisit) {
          // First visit: scroll to controls heading
          setIsFirstControlsVisit(false);

          if (controlsHeadingRef.current) {
            const elementTop =
              controlsHeadingRef.current.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
              top: elementTop - headerHeight - controlsTopGap,
              behavior: "smooth",
            });
          }
        } else {
          // Subsequent visits: restore saved scroll position
          window.scrollTo({
            top: savedControlsScrollPosition.current,
            behavior: "smooth",
          });
        }
      } else {
        // Switching TO preview: always scroll to top of preview card
        if (previewCardRef.current) {
          const elementTop = previewCardRef.current.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: elementTop - headerHeight - previewTopGap,
            behavior: "smooth",
          });
        }
      }

      prevMobileView.current = mobileView;
      pendingRafId.current = null;

      // Reset scrolling flag after smooth scroll completes (approx 300ms)
      setTimeout(() => {
        isScrolling.current = false;
      }, 350);
    });

    // Cleanup on unmount
    return () => {
      if (pendingRafId.current !== null) {
        cancelAnimationFrame(pendingRafId.current);
      }
    };
  }, [mobileView, isMobile, isFirstControlsVisit, headerHeight, previewTopGap, controlsTopGap]);

  return {
    mobileView,
    setMobileView,
    showMobileBar,
    previewCardRef,
    controlsHeadingRef,
  };
}
