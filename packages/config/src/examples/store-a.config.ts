/**
 * Example Store Configuration: Store A
 *
 * This is an example of how to configure a store with theme overrides,
 * feature flags, and customizations.
 */

import type { BrandConfig } from "../types/brand-config";

export const storeAConfig: BrandConfig = {
  storeId: "store-a",
  name: "Store A",
  domain: "store-a.example.com",
  shopify: {
    domain: "store-a.myshopify.com",
    storefrontAccessToken: "SHOPIFY_STOREFRONT_TOKEN_STORE_A", // From env
    apiVersion: "2024-01",
  },
  theme: {
    brandColors: {
      primary: "#2563eb",
      secondary: "#0ea5e9",
      accent: "#8b5cf6",
    },
    logo: {
      src: "/logos/store-a-logo.svg",
      alt: "Store A Logo",
      width: "150px",
      height: "40px",
    },
  },
  features: {
    enableAIRecommendations: true,
    enableImageUpscaling: true,
    FEATURE_MOULDING_PICKER: true,
  },
  seo: {
    title: "Store A - Custom Picture Frames",
    description: "Premium custom picture frames from Store A",
    keywords: ["custom frames", "picture frames", "Store A"],
    canonicalUrl: "https://store-a.example.com",
  },
  branding: {
    tagline: "Premium Custom Framing",
    valueProposition: "Museum-quality frames with expert craftsmanship",
    targetAudience: "Art collectors and galleries",
  },
  metadata: {
    isActive: true,
    createdAt: new Date().toISOString(),
  },
};

