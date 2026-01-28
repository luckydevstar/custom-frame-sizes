import { useState, useEffect } from "react";
import { getStoreAssetUrl } from "../utils/asset-urls";

export interface HeroImage {
  id: string;
  src: string;
  alt: string;
  weight: number;
  overlay: {
    title: string;
    subtitle: string;
  };
  credit: string;
  luminance: "bright" | "medium" | "dark";
  mediaType?: "image" | "video";
}

/**
 * Weighted random selection algorithm
 * Images with higher weight have higher probability of being selected
 */
function selectWeightedRandom(images: HeroImage[]): HeroImage {
  if (images.length === 0) {
    throw new Error("Cannot select from empty images array");
  }

  const totalWeight = images.reduce((sum, img) => sum + img.weight, 0);
  let random = Math.random() * totalWeight;

  for (const image of images) {
    random -= image.weight;
    if (random <= 0) {
      return image;
    }
  }

  // Fallback to first image (should never reach here, but TypeScript needs it)
  return images[0]!;
}

/**
 * Preload an image using Image object
 */
function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

/**
 * Prefetch next likely image with low priority using requestIdleCallback
 */
function prefetchNextImage(images: HeroImage[], currentImage: HeroImage) {
  if (typeof window === "undefined" || !("requestIdleCallback" in window)) {
    return;
  }

  const requestIdleCallback =
    (window as any).requestIdleCallback || ((cb: () => void) => setTimeout(cb, 1));

  requestIdleCallback(() => {
    const otherImages = images.filter((img) => img.id !== currentImage.id);
    if (otherImages.length === 0) return;

    const nextImage = selectWeightedRandom(otherImages);
    preloadImage(nextImage.src).catch(() => {
      // Silent fail for prefetch - not critical
    });
  });
}

/**
 * Hook for managing dynamic hero images with weighted random selection
 * - Selects one image on mount using weighted random
 * - Preloads selected image for instant display
 * - Prefetches next likely image with low priority
 * - Returns selected image with luminance for overlay calculation
 * - Converts local paths to CDN URLs using getSharedAssetUrl
 *
 * @param heroImagesData - Hero images data array (should be provided from store-specific data)
 */
export function useHeroImage(heroImagesData?: HeroImage[]) {
  const [selectedImage, setSelectedImage] = useState<HeroImage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Safety check for undefined heroImagesData
    if (!heroImagesData) {
      console.error(
        "heroImagesData is undefined. Provide hero images data from store-specific data source."
      );
      setError(new Error("Hero images data not available"));
      setIsLoading(false);
      return;
    }

    // Ensure heroImagesData is an array
    const dataArray = Array.isArray(heroImagesData)
      ? heroImagesData
      : (heroImagesData as any).default || heroImagesData;

    const images = (dataArray as HeroImage[]).map((img) => ({
      ...img,
      // Convert local paths to CDN URLs (hero assets are in store-specific bucket)
      // Path format: "assets/hero/workshop.mp4" -> use getStoreAssetUrl
      src: getStoreAssetUrl(img.src),
    }));

    if (!images || images.length === 0) {
      setError(new Error("No hero images available"));
      setIsLoading(false);
      return;
    }

    const selected = selectWeightedRandom(images);

    // Videos don't need preloading - they handle their own loading
    if (selected.mediaType === "video") {
      setSelectedImage(selected);
      setIsLoading(false);
      return;
    }

    // Preload the selected image before displaying
    preloadImage(selected.src)
      .then(() => {
        setSelectedImage(selected);
        setIsLoading(false);

        // Prefetch next likely image with low priority
        prefetchNextImage(images, selected);
      })
      .catch((err) => {
        console.error("Failed to preload hero image:", err);
        // Still set the image even if preload fails
        setSelectedImage(selected);
        setIsLoading(false);
      });
  }, [heroImagesData]);

  return {
    image: selectedImage,
    isLoading,
    error,
  };
}
