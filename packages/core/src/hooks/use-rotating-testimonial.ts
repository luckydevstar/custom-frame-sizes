/**
 * Hook for rotating testimonials with auto-advance and manual controls
 * Supports pause-on-hover and respects prefers-reduced-motion
 * Randomly selects 6 testimonials from the full set on each page load
 *
 * NOTE: This hook depends on testimonials.json data file.
 * The data file should be available via @framecraft/data package or similar.
 */

import { useState, useEffect, useMemo, useCallback } from "react";

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  location: string;
  rating: number;
}

/**
 * Hook for rotating testimonials with auto-advance and manual controls
 * Supports pause-on-hover and respects prefers-reduced-motion
 * Randomly selects 6 testimonials from the full set on each page load
 *
 * @param autoRotateInterval - Interval in milliseconds for auto-rotation (default: 7000)
 * @param testimonialsData - Testimonials data array (will be injected from data package)
 */
export function useRotatingTestimonial(
  autoRotateInterval = 7000,
  testimonialsData?: Testimonial[]
) {
  const allTestimonials = useMemo(() => testimonialsData || [], [testimonialsData]);

  // Randomly select 6 testimonials from the full set (once per page load)
  const testimonials = useMemo(() => {
    const shuffled = [...allTestimonials].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 6);
  }, [allTestimonials]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check prefers-reduced-motion
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Navigation functions
  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  const goToIndex = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Auto-rotation effect (only if motion is allowed)
  useEffect(() => {
    if (prefersReducedMotion || isPaused || testimonials.length === 0) {
      return;
    }

    const interval = setInterval(goToNext, autoRotateInterval);
    return () => clearInterval(interval);
  }, [prefersReducedMotion, isPaused, goToNext, autoRotateInterval, testimonials.length]);

  // Initialize
  useEffect(() => {
    if (testimonials.length > 0) {
      setIsLoading(false);
    }
  }, [testimonials.length]);

  return {
    testimonial: testimonials[currentIndex] || null,
    testimonials,
    currentIndex,
    isLoading,
    isPaused,
    prefersReducedMotion,
    goToNext,
    goToPrev,
    goToIndex,
    setPaused: setIsPaused,
    totalCount: testimonials.length,
  };
}
