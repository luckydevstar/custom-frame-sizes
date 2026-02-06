/**
 * @framecraft/data
 *
 * Product catalog and static data for FrameCraft.
 *
 * This package contains:
 * - frames.json: Frame styles with pricing and specifications
 * - mats.json: Mat board colors and pricing
 * - glass.json: Glass/acrylic options
 * - pricing-config.json: Pricing rules and fees
 *
 * @packageDocumentation
 */

// Import JSON data files
import framesData from "./frames.json";
import matsData from "./mats.json";
import glassData from "./glass.json";
import pricingConfigData from "./pricing-config.json";

// Frame class map (SKU → frameClass from xlsx)
export { getFrameClass, FRAME_CLASS_SKUS } from "./frame-class-map";
export type { FrameClass } from "./frame-class-map";

// Re-export data with proper typing
export { framesData };
export { matsData };
export { glassData };
export { pricingConfigData };

// Export as default for convenience
export default {
  frames: framesData,
  mats: matsData,
  glass: glassData,
  pricingConfig: pricingConfigData,
};
