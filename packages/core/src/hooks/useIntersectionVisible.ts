/**
 * Hook that uses IntersectionObserver to detect if an element is visible in the viewport.
 * Returns true if the element is visible, false if it's scrolled out of view.
 *
 * NOTE: This hook has been extracted to @framecraft/core.
 *
 * @param ref - React ref to the element to observe
 * @param options - IntersectionObserver options (optional)
 * @param deps - Optional dependency array to trigger re-evaluation when element might become available
 * @returns boolean indicating if the element is visible
 */

import { useState, useEffect, RefObject } from "react";

export function useIntersectionVisible(
  ref: RefObject<HTMLElement | null>,
  options: IntersectionObserverInit = { threshold: 0.4 },
  deps: unknown[] = []
): boolean {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check if IntersectionObserver is available (SSR guard)
    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setIsVisible(entry.isIntersecting);
      }
    }, options);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.threshold, options.root, options.rootMargin, ...deps]);

  return isVisible;
}
