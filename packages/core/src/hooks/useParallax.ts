/**
 * Parallax scroll effect hook
 * Provides parallax scrolling effects using requestAnimationFrame
 */

import { useEffect, useRef, useState } from "react";
import { animations } from "@framecraft/config";
import { usePrefersReducedMotion } from "./useScrollAnimation";

export interface ParallaxOptions {
  /**
   * Strength of parallax effect (0-1)
   * @default 0.015 (1.5% from config)
   */
  strength?: number;

  /**
   * Enable on mobile devices
   * @default false
   */
  enableOnMobile?: boolean;
}

/**
 * Hook for parallax scroll effects using requestAnimationFrame
 * @param options Parallax configuration options
 * @returns ref and transform styles for parallax element
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(options: ParallaxOptions = {}) {
  const { strength = animations.parallax.strength, enableOnMobile = animations.parallax.mobile } =
    options;

  const ref = useRef<T>(null);
  const [transform, setTransform] = useState("translateY(0)");
  const prefersReducedMotion = usePrefersReducedMotion();
  const rafId = useRef<number | null>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check if parallax should be disabled
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const shouldDisable =
      !animations.enabled ||
      !animations.parallax.enabled ||
      prefersReducedMotion ||
      (isMobile && !enableOnMobile);

    if (shouldDisable) {
      setTransform("translateY(0)");
      return;
    }

    let ticking = false;

    const updateParallax = () => {
      if (!element) return;

      const elementRect = element.getBoundingClientRect();
      const elementTop = elementRect.top;
      const elementHeight = elementRect.height;
      const windowHeight = window.innerHeight;

      // Calculate parallax offset
      // Only apply parallax when element is in viewport
      if (elementTop < windowHeight && elementTop + elementHeight > 0) {
        // Calculate how far through the viewport the element is (0 to 1)
        const progress = (windowHeight - elementTop) / (windowHeight + elementHeight);

        // Calculate transform based on progress and strength
        const offset = (progress - 0.5) * elementHeight * strength;
        setTransform(`translateY(${offset}px)`);
      }

      ticking = false;
    };

    const handleScroll = () => {
      lastScrollY.current = window.scrollY;

      if (!ticking) {
        rafId.current = requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    // Initial calculation
    updateParallax();

    // Add scroll listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Handle resize
    const handleResize = () => {
      if (!ticking) {
        rafId.current = requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);

      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [strength, enableOnMobile, prefersReducedMotion]);

  return { ref, transform };
}
