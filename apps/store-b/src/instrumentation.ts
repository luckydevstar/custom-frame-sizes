/**
 * Next.js Instrumentation Hook
 * 
 * This file runs once when the server starts up or during build initialization.
 * It's the earliest possible point to initialize the product catalog.
 * 
 * This ensures that:
 * 1. During `next build`, the catalog is available before static generation
 * 2. During server startup, the catalog is ready before any requests
 * 3. All pages can access product data without errors
 */

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Only initialize on the server side, not in edge runtime
    const { initializeProductCatalog } = await import("@framecraft/core/services/products");

    // Import store-b specific data
    const framesData = await import("./data/frames.json");
    const matsData = await import("./data/mats.json");
    const glassData = await import("./data/glass.json");
    const pricingConfigData = await import("./data/pricing-config.json");

    // Initialize the catalog before any pages are rendered
    initializeProductCatalog(
      framesData.default,
      matsData.default,
      glassData.default,
      pricingConfigData.default
    );
  }
}
