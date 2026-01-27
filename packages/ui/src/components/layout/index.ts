/**
 * Layout Components
 *
 * Core layout components for FrameCraft applications:
 * - Header: Site header with navigation, search, cart, and theme toggle
 * - Footer: Site footer with links, newsletter signup, and contact info
 * - Hero: Hero section with background image/video and CTA
 *
 * Note: SEO is handled via Next.js metadata API in layout.tsx files.
 * The Seo component (react-helmet-async) is not exported here as it's
 * incompatible with Next.js App Router server components.
 * For SEO, use the metadata export in your page/layout files.
 */

export * from "./Header";
export * from "./Footer";
export * from "./Hero";
export { ThemeToggle } from "./ThemeToggle";
// Seo component not exported - use Next.js metadata API instead
// export * from "./Seo";
