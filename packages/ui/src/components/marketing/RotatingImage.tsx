"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "../../utils";

interface RotatingImageProps {
  src: string;
  alt: string;
  className?: string;
  overlayOpacity?: number;
  aspectRatio?: string;
  enableParallax?: boolean;
  priority?: boolean;
  "data-testid"?: string;
}

export function RotatingImage({
  src,
  alt,
  className,
  overlayOpacity = 0.25,
  aspectRatio = "16/9",
  enableParallax = true,
  priority = false,
  "data-testid": testId,
}: RotatingImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Listen for reduced motion preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setPrefersReducedMotion(e.matches);
      if (e.matches) {
        setParallaxOffset(0);
      }
    };

    // Set initial value
    handleChange(mediaQuery);

    // Listen for changes
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    // Feature detection for IntersectionObserver
    if (!("IntersectionObserver" in window)) {
      // Fallback: load image immediately if IntersectionObserver not supported
      setIsInView(true);
      return;
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observerRef.current?.disconnect();
          }
        });
      },
      { rootMargin: "50px" }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [priority]);

  useEffect(() => {
    if (!enableParallax || !isInView || prefersReducedMotion) return;

    const handleScroll = () => {
      if (!imgRef.current) return;

      const rect = imgRef.current.getBoundingClientRect();
      const scrollProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      const offset = (scrollProgress - 0.5) * 20;

      setParallaxOffset(offset);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [enableParallax, isInView, prefersReducedMotion]);

  const generateSrcSet = (baseSrc: string) => {
    const widths = [480, 768, 1200, 1800];
    return widths.map((w) => `${baseSrc}?w=${w} ${w}w`).join(", ");
  };

  return (
    <div
      ref={imgRef}
      className={cn("relative overflow-hidden rounded-md bg-muted", className)}
      style={{ aspectRatio }}
      data-testid={testId}
    >
      {isInView && (
        <>
          <img
            src={src}
            srcSet={generateSrcSet(src)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            alt={alt}
            loading={priority ? "eager" : "lazy"}
            onLoad={() => setIsLoaded(true)}
            className={cn(
              "h-full w-full object-cover transition-all duration-700",
              isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
            )}
            style={{
              transform: `translateY(${parallaxOffset}px)`,
            }}
            data-testid={testId ? `${testId}-img` : undefined}
          />

          {overlayOpacity > 0 && (
            <div
              className="absolute inset-0 bg-background/80 dark:bg-background/90 pointer-events-none"
              style={{ opacity: overlayOpacity }}
              aria-hidden="true"
              data-testid={testId ? `${testId}-overlay` : undefined}
            />
          )}

          {!isLoaded && (
            <div
              className="absolute inset-0 bg-gradient-to-br from-muted to-muted-foreground/20 animate-pulse"
              aria-hidden="true"
              data-testid={testId ? `${testId}-placeholder` : undefined}
            />
          )}
        </>
      )}
    </div>
  );
}
