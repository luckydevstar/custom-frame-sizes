/**
 * Server-Side Product Catalog Initializer (store-b)
 * 
 * Initializes the product catalog with store-b specific data at server startup.
 * This must be imported at the top level to ensure data is available for
 * server components and API routes during build and runtime.
 */

import { initializeProductCatalog } from "@framecraft/core/services/products";

// Import store-b specific data
import framesData from "@/data/frames.json";
import matsData from "@/data/mats.json";
import glassData from "@/data/glass.json";
import pricingConfigData from "@/data/pricing-config.json";

// Initialize on import (server-side, happens at build time and server startup)
initializeProductCatalog(framesData, matsData, glassData, pricingConfigData);

export {};
