/**
 * Store A Brand Configuration
 *
 * Complete brand identity configuration for Store A including theme,
 * feature flags, navigation, and SEO settings.
 */

import type { BrandConfig } from "@framecraft/config";
import { env } from "./lib/env";

export const brandConfig: BrandConfig = {
  storeId: "store-a",
  name: "Store A",
  domain: env.shopify.storeDomain || "store-a.example.com",

  shopify: {
    domain: env.shopify.storeDomain || "store-a.myshopify.com",
    storefrontAccessToken: env.shopify.storefrontAccessToken,
    apiVersion: env.shopify.apiVersion || "2024-01",
  },

  theme: {
    brandColors: {
      primary: "#1D7BC7", // Blue - matches default theme
      secondary: "#0ea5e9", // Light blue
      accent: "#FF7A00", // Orange accent
    },
    typography: {
      fonts: {
        heading: "Playfair Display",
        body: "Inter",
        accent: "Montserrat",
      },
    },
    // Logo configuration
    // Using SVG placeholders for now - replace with actual logos when available
    // See ASSETS_SETUP.md for details on adding proper brand assets
    logo: {
      src: "/assets/brand/logo-blue.svg", // SVG placeholder - replace with PNG when available
      alt: "Store A Logo",
      width: "150px",
      height: "40px",
    },
  },

  features: {
    // Designer features
    FEATURE_MOULDING_PICKER: true,
    FEATURE_MAT_SET: true,
    FEATURE_JERSEY_MOUNT: true,

    // Application features
    showHomeTestimonial: true,
    enableAchievements: false,
    enableGallery: true,
    enableAIRecommendations: true,
    enableImageUpscaling: true,
  },

  navigation: {
    // Navigation will use defaults from @framecraft/config
    // Can be customized here if needed
  },

  seo: {
    title: "Store A - Custom Picture Frames",
    description: "Premium custom picture frames and framing services. Museum-quality frames with expert craftsmanship.",
    keywords: [
      "custom frames",
      "picture frames",
      "custom framing",
      "frame designer",
      "Store A",
    ],
    canonicalUrl: `https://${env.shopify.storeDomain || "store-a.example.com"}`,
    ogImage: `https://${env.shopify.storeDomain || "store-a.example.com"}/assets/brand/og-image.jpg`,
    twitterImage: `https://${env.shopify.storeDomain || "store-a.example.com"}/assets/brand/twitter-image.jpg`,
  },

  branding: {
    tagline: "Premium Custom Framing",
    valueProposition: "Museum-quality frames with expert craftsmanship",
    targetAudience: "Art collectors, galleries, and framing enthusiasts",
  },

  metadata: {
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

