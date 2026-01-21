/**
 * usePrintFrame Hook
 *
 * Manages state and generation for the Print & Frame feature.
 * Handles image upload, resolution checking, and print file generation.
 */

import { useState, useCallback, useMemo } from "react";
import {
  calculatePrintDimensions,
  generatePrintFile,
  downloadPrintFile,
  checkImageResolution,
  estimatePrintFileSize,
  type PrintDimensions,
  type PrintFileResult,
} from "../services/print-compositor";

export interface ImageInfo {
  url: string;
  width: number;
  height: number;
  originalFilename?: string;
}

export interface PrintFrameConfig {
  artworkWidth: number;
  artworkHeight: number;
  matBorder: number;
  matType: "none" | "single" | "double";
  mouldingWidth: number;
  bottomWeighted?: boolean;
  bottomWeightedExtra?: number;
}

export interface PrintFrameState {
  image: ImageInfo | null;
  isGenerating: boolean;
  error: string | null;
  printResult: PrintFileResult | null;
}

export interface ResolutionCheck {
  sufficient: boolean;
  currentDpiW: number;
  currentDpiH: number;
  recommendedUpscale: 1 | 2 | 4 | 8 | 16;
  needsUpscaling: boolean;
}

export function usePrintFrame(config: PrintFrameConfig) {
  const [state, setState] = useState<PrintFrameState>({
    image: null,
    isGenerating: false,
    error: null,
    printResult: null,
  });

  // Calculate print dimensions based on config
  // matBorderSides = standard border, matBorderBottom = sides + bottom-weighted extra if applicable
  const printDimensions = useMemo((): PrintDimensions => {
    const matBorderBottom = config.bottomWeighted
      ? config.matBorder + (config.bottomWeightedExtra ?? 0.5)
      : config.matBorder;
    return calculatePrintDimensions(
      config.artworkWidth,
      config.artworkHeight,
      config.matBorder,
      matBorderBottom,
      config.matType
    );
  }, [config]);

  // Estimated file size
  const estimatedFileSize = useMemo(() => {
    return estimatePrintFileSize(printDimensions);
  }, [printDimensions]);

  // Check if current image has sufficient resolution
  const resolutionCheck = useMemo((): ResolutionCheck | null => {
    if (!state.image) return null;

    // Target print area is mat opening + bleed (1/2" each side)
    const targetWidth = config.artworkWidth + 1; // +1" total bleed
    const targetHeight = config.artworkHeight + 1;

    const check = checkImageResolution(
      state.image.width,
      state.image.height,
      targetWidth,
      targetHeight
    );

    return {
      ...check,
      needsUpscaling: check.recommendedUpscale > 1,
    };
  }, [state.image, config.artworkWidth, config.artworkHeight]);

  // Set image with resolution info
  const setImage = useCallback((imageInfo: ImageInfo | null) => {
    setState((prev) => ({
      ...prev,
      image: imageInfo,
      error: null,
      printResult: null,
    }));
  }, []);

  // Clear image
  const clearImage = useCallback(() => {
    setState((prev) => ({
      ...prev,
      image: null,
      error: null,
      printResult: null,
    }));
  }, []);

  // Generate print file
  const generatePrint = useCallback(async (): Promise<PrintFileResult | null> => {
    if (!state.image) {
      setState((prev) => ({ ...prev, error: "No image uploaded" }));
      return null;
    }

    setState((prev) => ({ ...prev, isGenerating: true, error: null }));

    try {
      const result = await generatePrintFile(state.image.url, printDimensions);
      setState((prev) => ({
        ...prev,
        isGenerating: false,
        printResult: result,
      }));
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to generate print file";
      setState((prev) => ({
        ...prev,
        isGenerating: false,
        error: errorMessage,
      }));
      return null;
    }
  }, [state.image, printDimensions]);

  // Generate and download print file
  const generateAndDownload = useCallback(async (): Promise<boolean> => {
    const result = await generatePrint();
    if (result) {
      downloadPrintFile(result);
      return true;
    }
    return false;
  }, [generatePrint]);

  // Get print summary for display
  const printSummary = useMemo(() => {
    if (!state.image) return null;

    return {
      paperSize: `${printDimensions.paperWidth.toFixed(1)} × ${printDimensions.paperHeight.toFixed(1)}"`,
      matOpening: `${printDimensions.matOpeningWidth.toFixed(1)} × ${printDimensions.matOpeningHeight.toFixed(1)}"`,
      printArea: `${(config.artworkWidth + 1).toFixed(1)} × ${(config.artworkHeight + 1).toFixed(1)}"`, // +1" bleed
      estimatedSize: `${estimatedFileSize.toFixed(1)} MB`,
      resolution: resolutionCheck
        ? `${resolutionCheck.currentDpiW} × ${resolutionCheck.currentDpiH} DPI`
        : "Unknown",
      needsUpscaling: resolutionCheck?.needsUpscaling ?? false,
      upscaleFactor: resolutionCheck?.recommendedUpscale ?? 1,
    };
  }, [state.image, printDimensions, config, estimatedFileSize, resolutionCheck]);

  return {
    // State
    image: state.image,
    isGenerating: state.isGenerating,
    error: state.error,
    printResult: state.printResult,

    // Computed
    printDimensions,
    estimatedFileSize,
    resolutionCheck,
    printSummary,

    // Actions
    setImage,
    clearImage,
    generatePrint,
    generateAndDownload,
  };
}
