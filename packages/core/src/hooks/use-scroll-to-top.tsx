"use client";

import { useEffect } from "react";
import { useLocation } from "wouter";

/**
 * Hook that scrolls to the top of the page when the route changes.
 * This ensures users always start at the top when navigating to a new page,
 * especially important on mobile devices.
 */
export function useScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    // Scroll to top of page
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto", // Use auto for standards-compliant immediate scroll
    });
  }, [location]); // Re-run when location changes
}
