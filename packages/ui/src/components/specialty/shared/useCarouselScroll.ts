import { useState, useRef, useLayoutEffect, useEffect, useCallback } from "react";

interface UseCarouselScrollReturn {
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  showPrevButton: boolean;
  showNextButton: boolean;
  scrollPrevious: () => void;
  scrollNext: () => void;
  handleScroll: () => void;
  handleImageLoad: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
}

export function useCarouselScroll(imageCount: number): UseCarouselScrollReturn {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showPrevButton, setShowPrevButton] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;

    const EPSILON = 5;
    if (scrollWidth <= clientWidth + EPSILON) {
      setShowPrevButton(false);
      setShowNextButton(false);
      return;
    }

    setShowPrevButton(scrollLeft > 10);
    setShowNextButton(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  const getScrollStep = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return 340;

    const firstChild = container.querySelector(".flex > div, .flex > button") as HTMLElement;
    if (!firstChild) return 340;

    const childWidth = firstChild.offsetWidth;
    const flexContainer = container.querySelector(".flex") as HTMLElement;
    const computedStyle = window.getComputedStyle(flexContainer);
    const gap = parseFloat(computedStyle.gap) || 20;

    return childWidth + gap;
  }, []);

  const scrollPrevious = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollWidth, clientWidth } = container;
    if (scrollWidth <= clientWidth + 5) return;

    const scrollStep = getScrollStep();
    container.scrollBy({ left: -scrollStep, behavior: "smooth" });
  }, [getScrollStep]);

  const scrollNext = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollWidth, clientWidth } = container;
    if (scrollWidth <= clientWidth + 5) return;

    const scrollStep = getScrollStep();
    container.scrollBy({ left: scrollStep, behavior: "smooth" });
  }, [getScrollStep]);

  const handleImageLoad = useCallback(() => {
    handleScroll();
  }, [handleScroll]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        scrollPrevious();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        scrollNext();
      }
    },
    [scrollPrevious, scrollNext]
  );

  useLayoutEffect(() => {
    handleScroll();
  }, [imageCount, handleScroll]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      handleScroll();
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [handleScroll]);

  useEffect(() => {
    window.addEventListener("resize", handleScroll);
    return () => window.removeEventListener("resize", handleScroll);
  }, [handleScroll]);

  return {
    scrollContainerRef,
    showPrevButton,
    showNextButton,
    scrollPrevious,
    scrollNext,
    handleScroll,
    handleImageLoad,
    handleKeyDown,
  };
}
