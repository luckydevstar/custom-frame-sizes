/**
 * Bundle Size Optimization Utilities
 *
 * This module provides utilities and recommendations for keeping bundle size small.
 */

/**
 * Recommended dynamic imports for heavy components
 * These should be imported via next/dynamic with loading fallback
 */
export const HEAVY_COMPONENTS = {
  // Designer tools - complex state management, large dependencies
  FrameDesigner: () => import("@framecraft/ui").then((m) => m.FrameDesigner),
  MatDesigner: () => import("@framecraft/ui").then((m) => m.MatDesigner),
  ShadowboxDesigner: () => import("@framecraft/ui").then((m) => m.ShadowboxDesigner),

  // Showcases - gallery components with many images
  ShadowboxShowcase: () => import("@framecraft/ui").then((m) => m.ShadowboxShowcase),
  CanvasFramesShowcase: () => import("@framecraft/ui").then((m) => m.CanvasFramesShowcase),
  MatDesignerShowcase: () => import("@framecraft/ui").then((m) => m.MatDesignerShowcase),
  SpecialtyDesignersShowcase: () =>
    import("@framecraft/ui").then((m) => m.SpecialtyDesignersShowcase),

  // 3D viewers - heavyweight libraries
  ModelViewer: () => import("@framecraft/ui").then((m) => m.ModelViewer),
};

/**
 * Bundle size targets per route
 * Used to monitor bundle growth
 */
export const BUNDLE_SIZE_TARGETS = {
  // Main app chunks (all pages)
  main: {
    target: 150, // KB
    description: "React + Next.js + UI framework",
  },

  // Homepage
  "pages/index": {
    target: 100, // KB
    description: "Homepage without designers",
  },

  // Designer pages
  "pages/designer": {
    target: 200, // KB
    description: "Designer page with frame config",
  },

  // Individual components/routes
  "components/FrameDesigner": {
    target: 120, // KB
    description: "Frame designer tool (dynamically loaded)",
  },
};

/**
 * Large dependencies to evaluate for tree-shaking or alternatives
 */
export const LARGE_DEPENDENCIES = [
  {
    name: "@google/model-viewer",
    size: 450, // KB minified
    purpose: "3D model viewer for specialty frames",
    alternatives: ["babylon.js (if 3D needed)", "lightweight viewer"],
    recommendation: "Keep but lazy load on demand",
  },
  {
    name: "@uppy/dashboard",
    size: 120, // KB
    purpose: "File upload UI",
    alternatives: ["html5 file input", "@uppy/core only"],
    recommendation: "Only import on upload pages",
  },
  {
    name: "@tanstack/react-query",
    size: 35, // KB
    purpose: "Data fetching & caching",
    alternatives: ["swr", "native fetch"],
    recommendation: "Keep - handles caching well",
  },
];

/**
 * Code splitting strategy
 */
export const CODE_SPLITTING = {
  strategy: "Route-based + Component-based",

  routeLevel: {
    description: "Next.js automatically code-splits per route",
    benefit: "Only homepage code loads on homepage",
  },

  componentLevel: {
    description: "Heavy components loaded on-demand via dynamic()",
    components: [
      "FrameDesigner (>80KB)",
      "MatDesigner (>60KB)",
      "Showcases (>100KB)",
      "ModelViewer (>400KB)",
    ],
    benefit: "Homepage stays <50KB",
  },

  vendorLevel: {
    description: "Split vendor chunks for caching",
    chunks: [
      "react.js (~40KB)",
      "next.js (~15KB)",
      "ui-components.js (~50KB)",
      "uppy.js (~120KB) - only on upload pages",
      "model-viewer.js (~450KB) - only on specialty pages",
    ],
  },
};

/**
 * Unused code detection
 * Run: npm run build:analyze
 *
 * Look for red areas in the visualization:
 * - Unused dependencies
 * - Duplicate packages
 * - Large libraries with small usage
 */
export const UNUSED_CODE_DETECTION = {
  howToAnalyze: "Run: npm run build:analyze",
  output: "Opens browser with interactive bundle visualization",
  lookFor: [
    "Large red areas = unused code",
    "Duplicate packages = version conflicts",
    "Unexpected dependencies = check imports",
  ],
};

/**
 * Optimization checklist
 */
export const OPTIMIZATION_CHECKLIST = [
  {
    task: "Run bundle analyzer",
    command: "npm run build:analyze",
    expected: "Interactive HTML visualization in browser",
  },
  {
    task: "Check for unused imports",
    how: 'Look for "unused dependencies" warnings',
    fix: "Remove unused imports, verify tree-shaking works",
  },
  {
    task: "Verify dynamic imports",
    how: "Search codebase for heavy components without dynamic()",
    fix: "Wrap in dynamic() with loading fallback",
  },
  {
    task: "Monitor chunk sizes",
    how: 'Check Next.js build output: "Compiled successfully"',
    expected: "Main: <200KB, Routes: <300KB each",
  },
  {
    task: "Tree-shake unused exports",
    how: "Use ESM syntax (import/export), no CommonJS",
    verify: "Check final bundle size after optimization",
  },
];
