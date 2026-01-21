/**
 * Hook for rotating images with weighted random selection
 * Supports weighted random selection from image datasets
 * Used for home page sections (howItWorks, valueProps, inspiration, educationTeasers)
 *
 * NOTE: This hook depends on homeImages.json data file.
 * The data file should be available via @framecraft/data package or similar.
 */

import { useState, useEffect, useMemo } from "react";

// TODO: Import from @framecraft/data when data package is set up
// import homeImagesData from "@framecraft/data/homeImages.json";

type ImageData = {
  src: string;
  alt: string;
  weight: number;
  link?: string;
};

type SectionKey = "howItWorks" | "valueProps" | "inspiration" | "educationTeasers";

// Temporary type for data - will be replaced with actual import
type HomeImagesData = Record<SectionKey, ImageData[]>;

function weightedRandomSelection<T extends { weight: number }>(items: T[], count: number): T[] {
  if (items.length === 0) return [];
  if (count >= items.length) return items;

  const selected: T[] = [];
  const available = [...items];

  for (let i = 0; i < count; i++) {
    if (available.length === 0) break;

    const totalWeight = available.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;

    let selectedIndex = 0;
    for (let j = 0; j < available.length; j++) {
      const item = available[j];
      if (!item) continue;
      random -= item.weight;
      if (random <= 0) {
        selectedIndex = j;
        break;
      }
    }

    const selectedItem = available[selectedIndex];
    if (selectedItem) {
      selected.push(selectedItem);
      available.splice(selectedIndex, 1);
    }
  }

  return selected;
}

interface UseRotatingImagesOptions {
  count?: number;
  enableRotation?: boolean;
}

/**
 * Hook for rotating images with weighted random selection
 *
 * @param sectionKey - Section identifier (howItWorks, valueProps, inspiration, educationTeasers)
 * @param options - Configuration options
 * @param options.count - Number of images to select (default: 2)
 * @param options.enableRotation - Whether to enable automatic rotation (default: true)
 * @param homeImagesData - Image data object (will be injected from data package)
 */
export function useRotatingImages(
  sectionKey: SectionKey,
  options: UseRotatingImagesOptions = {},
  homeImagesData?: HomeImagesData
) {
  const { count = 2, enableRotation = true } = options;

  const allImages = useMemo(() => {
    if (!homeImagesData) return [];
    const sectionImages = homeImagesData[sectionKey] as ImageData[] | undefined;
    return sectionImages || [];
  }, [sectionKey, homeImagesData]);

  const [selectedImages, setSelectedImages] = useState<ImageData[]>(() =>
    weightedRandomSelection(allImages, count)
  );

  useEffect(() => {
    if (enableRotation && allImages.length > 0) {
      setSelectedImages(weightedRandomSelection(allImages, count));
    }
  }, [sectionKey, count, enableRotation, allImages]);

  const getNext = () => {
    if (allImages.length > 0) {
      setSelectedImages(weightedRandomSelection(allImages, count));
    }
  };

  const reset = () => {
    if (allImages.length > 0) {
      setSelectedImages(weightedRandomSelection(allImages, count));
    }
  };

  return {
    images: selectedImages,
    allImages,
    getNext,
    reset,
  };
}
