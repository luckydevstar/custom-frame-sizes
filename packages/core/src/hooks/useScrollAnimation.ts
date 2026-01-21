/**
 * Scroll animation hooks
 * Provides hooks for scroll-triggered animations using IntersectionObserver
 */

import { useEffect, useRef, useState } from "react";
import { animations } from "@framecraft/config";

/**
 * Hook to detect user's reduced motion preference
 * @returns true if user prefers reduced motion
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}

export interface IntersectionAnimationOptions {
  /**
   * Animation class to add when element is visible
   * @default "motion-fade-rise"
   */
  animationClass?: string;

  /**
   * Root margin for intersection observer
   * @default "0px 0px -100px 0px"
   */
  rootMargin?: string;

  /**
   * Threshold for intersection observer
   * @default 0.1
   */
  threshold?: number;

  /**
   * Enable stagger effect for child elements
   * @default false
   */
  stagger?: boolean;

  /**
   * Delay between staggered children (in ms)
   * Uses config value by default
   */
  staggerDelay?: number;

  /**
   * Trigger animation only once
   * @default true
   */
  triggerOnce?: boolean;
}

/**
 * Hook for scroll-triggered animations using IntersectionObserver
 * @param options Animation configuration options
 * @returns ref to attach to the animated element
 */
export function useIntersectionAnimation<T extends HTMLElement = HTMLDivElement>(
  options: IntersectionAnimationOptions = {}
) {
  const {
    animationClass = "motion-fade-rise",
    rootMargin = "0px 0px -50px 0px", // Trigger earlier for smoother feel
    threshold = 0.15, // Slightly higher threshold for better timing
    stagger = false,
    staggerDelay = animations.stagger.delay,
    triggerOnce = true,
  } = options;

  const ref = useRef<T>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Skip animations if disabled or user prefers reduced motion
    if (!animations.enabled || prefersReducedMotion) {
      // Ensure element is visible without animation
      element.style.opacity = "1";
      element.style.transform = "none";
      if (stagger) {
        const children = Array.from(element.children) as HTMLElement[];
        children.forEach((child) => {
          (child as HTMLElement).style.opacity = "1";
          (child as HTMLElement).style.transform = "none";
        });
      }
      return;
    }

    // Apply pending state initially to prevent flash
    const pendingClass = `motion-pending-${animationClass.replace("motion-", "")}`;

    if (stagger) {
      // Apply pending state to children
      const children = Array.from(element.children) as HTMLElement[];
      children.forEach((child) => {
        child.classList.add(pendingClass);
      });
    } else {
      // Apply pending state to element itself
      element.classList.add(pendingClass);
    }

    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry: IntersectionObserverEntry) => {
          if (entry.isIntersecting) {
            if (stagger) {
              // Apply staggered animation to children using CSS animation-delay
              const children = Array.from(element.children) as HTMLElement[];
              children.forEach((child, index) => {
                // Remove pending class and add animation class
                child.classList.remove(pendingClass);
                child.classList.add(animationClass);
                // Set animation delay via CSS for proper synchronization
                (child as HTMLElement).style.animationDelay = `${index * staggerDelay}ms`;
              });
            } else {
              // Remove pending class and add animation class
              element.classList.remove(pendingClass);
              element.classList.add(animationClass);
            }

            // Disconnect observer if triggerOnce is true
            if (triggerOnce) {
              observer.disconnect();
            }
          } else if (!triggerOnce) {
            // Remove animation class when out of view (only if not triggerOnce)
            if (stagger) {
              const children = Array.from(element.children) as HTMLElement[];
              children.forEach((child) => {
                child.classList.remove(animationClass);
                child.classList.add(pendingClass);
                (child as HTMLElement).style.animationDelay = "";
              });
            } else {
              element.classList.remove(animationClass);
              element.classList.add(pendingClass);
            }
          }
        });
      },
      {
        rootMargin,
        threshold,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [
    animationClass,
    rootMargin,
    threshold,
    stagger,
    staggerDelay,
    triggerOnce,
    prefersReducedMotion,
  ]);

  return ref;
}
