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
import framesData from "./frames.json";
import matsData from "./mats.json";
import glassData from "./glass.json";
import pricingConfigData from "./pricing-config.json";
export { framesData };
export { matsData };
export { glassData };
export { pricingConfigData };
declare const _default: {
  frames: (
    | {
        id: string;
        name: string;
        material: string;
        color: string;
        colorName: string;
        pricePerInch: number;
        borderColor: string;
        mouldingWidth: number;
        usableDepth: number;
        category: string;
        shopifyVariantId: null;
        sku: string;
        thumbnail: string;
        featured: boolean;
        shortDescription: string;
        featuredDescription: string;
        dimensionalDiagram: string;
        alternateImages: {
          type: string;
          url: string;
          alt: string;
        }[];
        displayName?: undefined;
        rabbetInsetRatio?: undefined;
        topColor?: undefined;
        cornerImage?: undefined;
        profileImage?: undefined;
        lifestyleImage?: undefined;
        swatchImage?: undefined;
        photos?: undefined;
        theme?: undefined;
      }
    | {
        id: string;
        name: string;
        material: string;
        color: string;
        colorName: string;
        pricePerInch: number;
        borderColor: string;
        mouldingWidth: number;
        usableDepth: number;
        category: string;
        shopifyVariantId: null;
        sku: string;
        thumbnail: string;
        featured: boolean;
        shortDescription: string;
        featuredDescription: string;
        dimensionalDiagram: string;
        alternateImages: {
          type: string;
          url: string;
          alt: string;
        }[];
        displayName: string;
        rabbetInsetRatio?: undefined;
        topColor?: undefined;
        cornerImage?: undefined;
        profileImage?: undefined;
        lifestyleImage?: undefined;
        swatchImage?: undefined;
        photos?: undefined;
        theme?: undefined;
      }
    | {
        id: string;
        name: string;
        material: string;
        color: string;
        colorName: string;
        pricePerInch: number;
        borderColor: string;
        mouldingWidth: number;
        usableDepth: number;
        rabbetInsetRatio: number;
        category: string;
        shopifyVariantId: null;
        sku: string;
        thumbnail: string;
        featured: boolean;
        shortDescription: string;
        featuredDescription: string;
        dimensionalDiagram: string;
        alternateImages: {
          type: string;
          url: string;
          alt: string;
        }[];
        displayName: string;
        topColor?: undefined;
        cornerImage?: undefined;
        profileImage?: undefined;
        lifestyleImage?: undefined;
        swatchImage?: undefined;
        photos?: undefined;
        theme?: undefined;
      }
    | {
        id: string;
        name: string;
        material: string;
        color: string;
        colorName: string;
        topColor: string;
        pricePerInch: number;
        borderColor: string;
        mouldingWidth: number;
        usableDepth: number;
        category: string;
        shopifyVariantId: null;
        sku: string;
        thumbnail: null;
        featured: boolean;
        shortDescription: string;
        alternateImages: never[];
        dimensionalDiagram: string;
        cornerImage: string;
        profileImage: string;
        lifestyleImage: string;
        swatchImage: string;
        photos: {
          topUrl: string;
          bottomUrl: string;
          leftUrl: string;
          rightUrl: string;
        };
        featuredDescription?: undefined;
        displayName?: undefined;
        rabbetInsetRatio?: undefined;
        theme?: undefined;
      }
    | {
        id: string;
        name: string;
        material: string;
        color: string;
        colorName: string;
        topColor: string;
        pricePerInch: number;
        borderColor: string;
        mouldingWidth: number;
        usableDepth: number;
        category: string;
        theme: string;
        shopifyVariantId: null;
        sku: string;
        thumbnail: null;
        featured: boolean;
        shortDescription: string;
        alternateImages: never[];
        dimensionalDiagram: string;
        cornerImage: string;
        profileImage: string;
        lifestyleImage: string;
        swatchImage: string;
        photos: {
          topUrl: string;
          bottomUrl: string;
          leftUrl: string;
          rightUrl: string;
        };
        featuredDescription?: undefined;
        displayName?: undefined;
        rabbetInsetRatio?: undefined;
      }
  )[];
  mats: {
    mats: (
      | {
          id: string;
          lineNumber: number;
          type: string;
          name: string;
          swatchFile: string;
          sizes: {
            "32x40": {
              sku: string;
              price: number;
              vendor: string;
            };
            "40x60": {
              sku: string;
              price: number;
              vendor: string;
            };
          };
          coreColor: string;
          isRegular: boolean;
          isPremium: boolean;
          hexColor: string;
        }
      | {
          id: string;
          lineNumber: number;
          type: string;
          name: string;
          swatchFile: string;
          sizes: {
            "32x40": {
              sku: string;
              price: number;
              vendor: string;
            };
            "40x60": null;
          };
          coreColor: string;
          isRegular: boolean;
          isPremium: boolean;
          hexColor: string;
        }
    )[];
    displayOrder: {
      desktop: {
        regular: number[];
        premium: number[];
      };
      mobile: {
        regular: number[];
        premium: number[];
      };
    };
    metadata: {
      totalMats: number;
      regularCount: number;
      premiumCount: number;
      blackCoreCount: number;
    };
  };
  glass: {
    id: string;
    name: string;
    pricePerSqFt: number;
    shopifyVariantId: null;
  }[];
  pricingConfig: {
    printAndFrame: {
      pricePerSquareInch: number;
      description: string;
    };
    oversizeFees: {
      threshold75to99: {
        minDimension: number;
        maxDimension: number;
        fee: number;
        description: string;
      };
      threshold100Plus: {
        minDimension: number;
        blocked: boolean;
        description: string;
      };
    };
    matMultipliers: {
      none: number;
      single: number;
      double: number;
    };
  };
};
export default _default;
//# sourceMappingURL=index.d.ts.map
