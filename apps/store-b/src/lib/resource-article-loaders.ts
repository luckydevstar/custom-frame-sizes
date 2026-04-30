import type { ComponentType } from "react";

/**
 * Lazily-loaded resource article bodies (see `src/app/resources/[slug]/page.tsx`).
 */

export const RESOURCE_ARTICLE_LOADERS = {
  "baby-first-year-frames": () =>
    import("@/components/resources/baby-first-year-frames-content"),
  "border-width-proportions": () =>
    import("@/components/resources/border-width-proportions-content"),
  "common-mat-cutting-mistakes": () =>
    import("@/components/resources/common-mat-cutting-mistakes-content"),
  "conservation-framing-standards": () =>
    import("@/components/resources/conservation-framing-standards-content"),
  "how-to-measure-artwork-for-framing": () =>
    import("@/components/resources/how-to-measure-artwork-for-framing-content"),
  "mat-board-vs-mounting-board": () =>
    import("@/components/resources/mat-board-vs-mounting-board-content"),
  "mat-color-selection-guide": () =>
    import("@/components/resources/mat-color-selection-guide-content"),
  "multi-opening-layout-engineering": () =>
    import("@/components/resources/multi-opening-layout-engineering-content"),
  "poster-frame-sizes-guide": () =>
    import("@/components/resources/poster-frame-sizes-guide-content"),
  "professional-mounting-techniques": () =>
    import("@/components/resources/professional-mounting-techniques-content"),
  "school-picture-frames": () =>
    import("@/components/resources/school-picture-frames-content"),
  "standard-vs-custom-frame-sizes": () =>
    import("@/components/resources/standard-vs-custom-frame-sizes-content"),
  "sports-team-framing": () => import("@/components/resources/sports-team-framing-content"),
} as const satisfies Record<string, () => Promise<{ default: ComponentType<object> }>>;

export type ResourceArticleSlug = keyof typeof RESOURCE_ARTICLE_LOADERS;

export const RESOURCE_ARTICLE_SLUGS = Object.keys(RESOURCE_ARTICLE_LOADERS).map(
  (slug) => slug as ResourceArticleSlug,
);
