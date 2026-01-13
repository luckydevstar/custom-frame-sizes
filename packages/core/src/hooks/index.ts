/**
 * Hooks
 *
 * Shared React hooks for FrameCraft.
 *
 * Hooks exported:
 * - useIsMobile.ts: Mobile device detection hook
 * - useMobileViewToggle.ts: Mobile view toggle state management
 * - useIntersectionVisible.ts: Intersection observer hook
 *
 * TODO: Extract additional hooks:
 * - use-toast.ts: Toast notification hook (depends on UI components - may stay in app)
 * - use-mat-catalog.ts: Mat catalog data hook
 */

export * from "./useIsMobile";
export * from "./useMobileViewToggle";
export * from "./useIntersectionVisible";
export * from "./use-theme";
export * from "./use-feature-flag";
