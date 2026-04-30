"use client";

/**
 * Store-A Product Catalog Initializer
 * 
 * This client component initializes the @framecraft/core product catalog
 * with store-a specific data on app startup.
 * 
 * Must be rendered near the top of the app layout to ensure data is available
 * to all child components.
 */

import { useEffect } from "react";
import { initializeProductCatalog } from "@framecraft/core/services/products";

// Import store-a specific data
import framesData from "@/data/frames.json";
import matsData from "@/data/mats.json";
import glassData from "@/data/glass.json";
import pricingConfigData from "@/data/pricing-config.json";

export function ProductCatalogInitializer() {
  useEffect(() => {
    // Initialize catalog once on client mount
    // This ensures all subsequent calls to getFrameStyles(), getMatColors(), etc.
    // return store-a specific data
    initializeProductCatalog(framesData, matsData, glassData, pricingConfigData);
  }, []);

  return null; // This component doesn't render anything
}
