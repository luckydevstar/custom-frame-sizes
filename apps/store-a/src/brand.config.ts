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
  name: "CustomFrameSizes.com",
  domain: env.shopify.storeDomain || "store-a.example.com",

  shopify: {
    domain: env.shopify.storeDomain || "store-a.myshopify.com",
    storefrontAccessToken: env.shopify.storefrontAccessToken || "",
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
    // Using real logos from original CustomFrameSizes.com
    logo: {
      src: "/assets/brand/logo-blue.png", // Light mode logo
      alt: "CustomFrameSizes.com",
      width: "auto",
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
    title: "Custom Frame Sizes - Exact Dimensions | CustomFrameSizes",
    description: "Design picture frames in custom sizes with live preview, mats, and glazing options. Professional framing with exact measurements down to 1/8 inch and instant pricing.",
    keywords: [
      "custom frames",
      "picture frames",
      "custom framing",
      "frame designer",
      "exact dimensions",
      "CustomFrameSizes",
    ],
    canonicalUrl: `https://${env.shopify.storeDomain || "store-a.example.com"}`,
    ogImage: `https://${env.shopify.storeDomain || "store-a.example.com"}/assets/og-image.jpg`,
    twitterImage: `https://${env.shopify.storeDomain || "store-a.example.com"}/assets/og-image.jpg`,
  },

  branding: {
    tagline: "Custom Frame Sizes - Exact Dimensions",
    valueProposition: "Design picture frames in custom sizes with live preview, mats, and glazing options. Professional framing with exact measurements down to 1/8 inch and instant pricing.",
    targetAudience: "Art collectors, galleries, and framing enthusiasts",
  },

  metadata: {
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    // Contact information for header/footer
    contactPhone: "1 (888) 874-7156",
    contactEmail: "hello@CustomFrameSizes.com",
  },
};

