/**
 * Store B Brand Configuration
 *
 * Complete brand identity configuration for Store B (ShadowBox Frames) including theme,
 * feature flags, navigation, and SEO settings.
 */

import type { BrandConfig } from "@framecraft/config";
import { env } from "./lib/env";

/** Absolute origin for checkout branding (Shopify checkout cannot use relative /assets URLs). */
const publicSiteOrigin = (env.siteOrigin ?? "https://www.shadowboxframes.com").replace(/\/$/, "");

export const brandConfig: BrandConfig = {
  storeId: "store-b",
  name: "ShadowboxFrames.com",
  domain: env.shopify.storeDomain || "www.shadowboxframes.com",

  shopify: {
    domain: env.shopify.storeDomain || "store-b.myshopify.com",
    storefrontAccessToken: env.shopify.storefrontAccessToken || "",
    apiVersion: env.shopify.apiVersion || "2024-01",
  },

  theme: {
    brandColors: {
      primary: "hsl(44 47% 37%)", // Warm olive/brown - earthy, premium
      secondary: "hsl(40 20% 93%)", // Light warm beige
      accent: "hsl(94 17% 38%)", // Sage green - natural, calming
    },
    typography: {
      fonts: {
        heading: "Cormorant Garamond",
        body: "Outfit",
        accent: "Outfit",
      },
    },
    logo: {
      /** Light header / light mode — avoids Logo falling back to store-a CDN filenames */
      src: "/assets/brand/logo-light.png",
      srcLight: "/assets/brand/logo-light.png",
      srcDark: "/assets/brand/logo-dark.png",
      alt: "ShadowboxFrames.com",
      width: "auto",
      height: "40px",
    },
  },

  features: {
    // Designer features
    FEATURE_MOULDING_PICKER: true,
    FEATURE_MAT_SET: true,
    FEATURE_JERSEY_MOUNT: false, // Store-B specific: focuses on shadowboxes

    // Application features
    showHomeTestimonial: true,
    enableAchievements: false,
    enableGallery: true,
    enableAIRecommendations: true,
    enableImageUpscaling: true,
  },

  navigation: {
    // Navigation will use defaults from @framecraft/config
    // Can be customized here if needed for store-b specific layout
  },

  seo: {
    title: "Custom Shadowbox Frames in Any Size | ShadowboxFrames.com",
    description: "Handcrafted shadow box frames built for what matters most. Design your custom shadowbox with real-time pricing and premium materials.",
    keywords: [
      "shadowbox frames",
      "custom shadow box",
      "display frames",
      "memorabilia frames",
      "ShadowboxFrames",
      "custom framing",
    ],
    canonicalUrl: `https://${env.shopify.storeDomain || "www.shadowboxframes.com"}`,
    ogImage: `https://${env.shopify.storeDomain || "www.shadowboxframes.com"}/assets/og-image.jpg`,
    twitterImage: `https://${env.shopify.storeDomain || "www.shadowboxframes.com"}/assets/og-image.jpg`,
  },

  checkout: {
    logoUrl: `${publicSiteOrigin}/assets/brand/logo-light.png`,
    homeUrl: `${publicSiteOrigin}/`,
    shipStationStoreCode: "SBF",
  },

  branding: {
    tagline: "Handcrafted Shadowbox Frames for What Matters Most",
    valueProposition: "Design your custom shadowbox with real-time pricing and premium materials",
    targetAudience: "Collectors, keepsake enthusiasts, and those who treasure memories",
  },

  metadata: {
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    contactPhone: "1 (888) 874-7156",
    contactEmail: "hello@ShadowboxFrames.com",
  },
};
