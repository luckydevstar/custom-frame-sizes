/**
 * Hooks
 *
 * Shared React hooks for FrameCraft.
 *
 * Hooks exported:
 * - useIsMobile.ts: Mobile device detection hook
 * - useMobileViewToggle.ts: Mobile view toggle state management
 * - useIntersectionVisible.ts: Intersection observer hook
 * - useIntelligentPreviewSizing.ts: Intelligent preview container sizing based on aspect ratio
 * - useScrollAnimation.ts: Scroll-triggered animations using IntersectionObserver
 * - useParallax.ts: Parallax scroll effects using requestAnimationFrame
 *
 * TODO: Extract additional hooks:
 * - use-toast.ts: Toast notification hook (depends on UI components - may stay in app)
 * - use-mat-catalog.ts: Mat catalog data hook
 * - useHeroImage.ts: Hero image selection and preloading
 * - useImageRegistry.ts: Image registry management
 * - use-scroll-to-top.tsx: Scroll to top on route change (depends on routing library)
 * - useRotatingImages.ts: Rotating image carousel
 * - useRotatingTestimonial.ts: Rotating testimonials
 * - usePrintFrame.ts: Print frame functionality
 */

export * from "./useIsMobile";
export * from "./useMobileViewToggle";
export * from "./useIntersectionVisible";
export * from "./use-theme";
export * from "./use-feature-flag";
export * from "./useIntelligentPreviewSizing";
export * from "./useScrollAnimation";
export * from "./useParallax";
export * from "./useComicPricing";
export * from "./usePlaybillPricing";
export * from "./use-scroll-to-top";
export * from "./use-print-frame";
export * from "./use-rotating-images";
export * from "./use-rotating-testimonial";
export * from "./use-hero-image";
