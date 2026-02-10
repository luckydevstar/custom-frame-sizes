"use client";

import { useState, useEffect, useMemo } from "react";
// Removed wouter useLocation - not needed in Next.js
import { Info, Maximize, Settings, Eye, Copy } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { QuantitySelector } from "../ui/quantity-selector";
import { PriceBox } from "../ui/PriceBox";
import type { PriceLineItem } from "../ui/PriceBox";
// Import types from @framecraft/types
import type { FrameStyle, FrameConfiguration, AlternateImage } from "@framecraft/types";

// Import services from @framecraft/core
import {
  getFramesByCategory,
  getGlassTypes,
  calculatePricing,
  getStoreBaseAssetUrl,
} from "@framecraft/core";

// Import hooks from @framecraft/core
import { useIsMobile, useMobileViewToggle } from "@framecraft/core";

// Import config from @framecraft/config
import {
  getMatsInDisplayOrder,
  isMatAvailableForSize,
  ALL_MATS,
  type Mat,
} from "@framecraft/config";

// Import UI components from same package
import { ColorSwatchesWithSeparator } from "../ui/ColorSwatches";

// TODO: Extract these app-specific dependencies or make them injectable
// - useToast hook
// - useIntelligentPreviewSizing hook
// - TrustBox component
// - matRules utilities (isOversizeMat)
// - puzzleSizes utilities (PUZZLE_SIZES, getPuzzleSizesByCategory, etc.)
// - stockImages utilities (getRandomPuzzleImage)
// - puzzle-lifestyle-photos constants (getRandomPuzzlePhoto)
// - PuzzleLifestyleCarousel component
// - HangingHardwareSection, BottomWeightedMatting components
// - BrassNameplateSection, BrassNameplatePreview components
// - matTiling utilities (getMatTilingStyle, getMatBevelColor)
// - @shared/schema types
import { useToast } from "../../hooks/use-toast";
import { useIntelligentPreviewSizing } from "@framecraft/core";
import { TrustBox } from "../marketing/TrustBox";
import {
  isOversizeMat,
  getPuzzleSizeById,
  createRoundMatOpening,
  validatePuzzleDimensions,
  getRandomPuzzlePhoto as getDefaultRandomPuzzlePhoto,
  getRandomPuzzleImage as getDefaultRandomPuzzleImage,
  type PuzzleSize,
} from "@framecraft/core";
import { Slider } from "../ui/slider";
import { getMatBevelColor } from "@framecraft/core";
import { HangingHardwareSection } from "./shared/HangingHardwareSection";
import { BottomWeightedMatting, BOTTOM_WEIGHTED_EXTRA } from "./shared/BottomWeightedMatting";
import { BrassNameplateSection } from "../brass-nameplate/BrassNameplateSection";
import { BrassNameplatePreview } from "../brass-nameplate/BrassNameplatePreview";
import {
  BRASS_NAMEPLATE_SPECS,
  getTypeBBottomBorder,
  type BrassNameplateConfig,
} from "@framecraft/types";

// Get picture frames and glass types
const pictureFrames = getFramesByCategory("picture");

interface PuzzleLifestylePhoto {
  url: string;
  alt: string;
}

interface PuzzleFrameDesignerProps {
  defaultFrameId?: string;
  embedded?: boolean;
  /**
   * Optional. Defaults to core getRandomPuzzlePhoto when not provided.
   */
  getRandomPuzzlePhoto?: () => PuzzleLifestylePhoto;
  /**
   * Optional. Defaults to core getRandomPuzzleImage when not provided.
   */
  getRandomPuzzleImage?: (seed?: string | number) => string;
}

export function PuzzleFrameDesigner({
  defaultFrameId,
  embedded: _embedded = false,
  getRandomPuzzlePhoto: getRandomPuzzlePhotoProp,
  getRandomPuzzleImage: getRandomPuzzleImageProp,
}: PuzzleFrameDesignerProps) {
  const getRandomPuzzlePhoto = getRandomPuzzlePhotoProp ?? getDefaultRandomPuzzlePhoto;
  const getRandomPuzzleImage = getRandomPuzzleImageProp ?? getDefaultRandomPuzzleImage;

  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { mobileView, setMobileView, showMobileBar, previewCardRef, controlsHeadingRef } =
    useMobileViewToggle({ isMobile });

  // Read URL parameters (SSR-safe: no window on server)
  const urlParams = useMemo(
    () =>
      typeof window === "undefined"
        ? new URLSearchParams()
        : new URLSearchParams(window.location.search),
    []
  );

  // Initialize frame selection
  const initialFrame = useMemo(() => {
    if (defaultFrameId) {
      const frame = pictureFrames.find((f) => f.id === defaultFrameId || f.sku === defaultFrameId);
      return frame ?? pictureFrames[0]!;
    }
    const frameParam = urlParams.get("frame");
    if (frameParam) {
      const frame = pictureFrames.find((f) => f.id === frameParam || f.sku === frameParam);
      return frame ?? pictureFrames[0]!;
    }
    return pictureFrames[0] ?? pictureFrames[0]!;
  }, [defaultFrameId, urlParams]);

  // Designer state
  const [selectedPuzzleSize, setSelectedPuzzleSize] = useState<PuzzleSize | null>(() => {
    const sizeParam = urlParams.get("puzzleSize");
    if (sizeParam) {
      const presetSize = getPuzzleSizeById(sizeParam);
      if (presetSize) return presetSize;
    }
    // Check for custom size
    const customWidth = parseFloat(urlParams.get("customWidth") || "");
    const customHeight = parseFloat(urlParams.get("customHeight") || "");
    if (customWidth && customHeight) {
      return {
        id: "custom",
        pieces: 0,
        pieceLabel: "custom",
        width: customWidth,
        height: customHeight,
        isRound: false,
        isPanoramic: false,
        isSquare: false,
        category: "standard",
        aspectRatio: customWidth / customHeight,
        label: `Custom — ${customWidth}" × ${customHeight}"`,
      };
    }
    // Default to 1000 piece standard
    return getPuzzleSizeById("puzzle-1000") || null;
  });

  const [customWidth, setCustomWidth] = useState<string>(() => {
    if (selectedPuzzleSize?.id === "custom") {
      return selectedPuzzleSize.width.toString();
    }
    return "";
  });

  const [customHeight, setCustomHeight] = useState<string>(() => {
    if (selectedPuzzleSize?.id === "custom") {
      return (selectedPuzzleSize.height as number).toString();
    }
    return "";
  });

  // Track if user wants custom dimensions
  const [showCustomInputs, setShowCustomInputs] = useState(() => {
    return selectedPuzzleSize?.id === "custom";
  });

  // Accordion state - control which sections are open
  const [openAccordions, setOpenAccordions] = useState<string[]>(() => {
    const baseValues = ["frame", "mat", "nameplate", "glass", "hardware"];
    if (selectedPuzzleSize?.id === "custom") {
      return ["size", ...baseValues];
    }
    return baseValues;
  });

  const [selectedFrame, setSelectedFrame] = useState<FrameStyle>(() => {
    return initialFrame ?? pictureFrames[0]!;
  });

  const [matType, setMatType] = useState<"single" | "double" | "none">(() => {
    const urlMatType = urlParams.get("matType") as "single" | "double" | "none";
    // Force single mat for round puzzles
    const initialSize = selectedPuzzleSize;
    if (initialSize?.isRound) return "single";
    return urlMatType || "single";
  });

  const [matBorderWidth, setMatBorderWidth] = useState(() => {
    const urlMatBorder = urlParams.get("matBorder");
    // Round puzzles need 1.5" mat border for proper interior dimensions
    // 25" round + 1.5" mat = 28" interior, 27" round + 1.5" mat = 30" interior
    const defaultBorder = selectedPuzzleSize?.isRound ? "1.5" : "2.5";
    return urlMatBorder || defaultBorder;
  });

  const [matRevealWidth, setMatRevealWidth] = useState(() => {
    const urlMatReveal = urlParams.get("matReveal");
    return urlMatReveal !== null ? urlMatReveal : "0.25";
  });

  const [bottomWeighted, setBottomWeighted] = useState(() => {
    return urlParams.get("bottomWeighted") === "true";
  });

  const [selectedMatColor, setSelectedMatColor] = useState<Mat>(() => {
    const urlMat = urlParams.get("mat");
    if (urlMat) {
      const mat = ALL_MATS.find((m: Mat) => m.id === urlMat);
      if (mat) return mat;
    }
    return ALL_MATS[0]!; // Default to first mat (white)
  });

  const [selectedBottomMatColor, setSelectedBottomMatColor] = useState<Mat>(() => {
    const urlBottomMat = urlParams.get("bottomMat");
    if (urlBottomMat) {
      const mat = ALL_MATS.find((m: Mat) => m.id === urlBottomMat);
      if (mat) return mat;
    }
    return ALL_MATS[1]!; // Default to second mat
  });

  const [glassTypeState, setGlassTypeState] = useState(() => {
    const urlGlass = urlParams.get("glass");
    // Only allow 'standard' or 'non-glare' for puzzles (backward compat for old URLs)
    const allowedTypes = ["standard", "non-glare"];
    return allowedTypes.includes(urlGlass || "") ? urlGlass : "standard";
  });

  // Validated setter that only accepts allowed glass types
  const glassType = glassTypeState;
  const setGlassType = (value: string) => {
    const allowedTypes = ["standard", "non-glare"];
    setGlassTypeState(allowedTypes.includes(value) ? value : "standard");
  };

  const [hardware, setHardware] = useState<"standard" | "security">(() => {
    const urlHardware = urlParams.get("hardware") as "standard" | "security";
    return urlHardware || "standard";
  });

  const [brassNameplateConfig, setBrassNameplateConfig] = useState<BrassNameplateConfig>(() => ({
    enabled: urlParams.get("plaqueEnabled") === "true",
    line1: urlParams.get("plaqueLine1") || "",
    line2: urlParams.get("plaqueLine2") || "",
    line3: urlParams.get("plaqueLine3") || "",
    font: (urlParams.get("plaqueFont") as BrassNameplateConfig["font"]) || "georgia",
    color: "brass-black",
    includeFlag: false,
  }));

  // Random lifestyle photo - changes only on frame selection or page load
  const [lifestylePhoto, setLifestylePhoto] = useState(() => getRandomPuzzlePhoto());

  // Update lifestyle photo when frame changes
  useEffect(() => {
    setLifestylePhoto(getRandomPuzzlePhoto());
  }, [selectedFrame.id, getRandomPuzzlePhoto]);

  // Fetch frame photos when frame changes
  useEffect(() => {
    async function fetchFramePhotos() {
      try {
        const response = await fetch(`/api/frames/${selectedFrame.sku}/photos`);
        if (response.ok) {
          const photoSet = await response.json();
          setFramePhotos(photoSet);
        }
      } catch (error) {
        console.error("Failed to fetch frame photos:", error);
      }
    }

    fetchFramePhotos();
  }, [selectedFrame.sku]);

  // Update mat border width when puzzle size changes
  // Only update if the current value matches a default value (preserves user customization)
  useEffect(() => {
    if (!selectedPuzzleSize) return;

    const currentBorder = parseFloat(matBorderWidth);
    const newDefaultBorder = selectedPuzzleSize.isRound ? 1.5 : 2.5;

    // Only update if current value matches one of the default values
    // This preserves user customization while providing smart defaults
    if (currentBorder === 1.5 || currentBorder === 2.5) {
      if (currentBorder !== newDefaultBorder) {
        setMatBorderWidth(newDefaultBorder.toString());
      }
    }
  }, [selectedPuzzleSize, matBorderWidth]);

  // UI state
  const [_showShareDialog, _setShowShareDialog] = useState(false);
  const [showFullscreenPreview, setShowFullscreenPreview] = useState(false);
  const [quantity, setQuantity] = useState(() => {
    if (typeof window === "undefined") return 1;
    const params = new URLSearchParams(window.location.search);
    const qty = params.get("quantity");
    return qty ? Math.max(1, parseInt(qty, 10)) : 1;
  });
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Frame photos state (corner, profile images + texture slices)
  const [framePhotos, setFramePhotos] = useState<{
    cornerUrl?: string;
    profileUrl?: string;
    topUrl?: string;
    bottomUrl?: string;
    leftUrl?: string;
    rightUrl?: string;
  }>({});

  // Generate random seed once on component mount for insert image randomization
  // This makes images change on page load but stay consistent during the session
  const randomSeed = useMemo(() => Math.floor(Math.random() * 10000), []);

  // Puzzle image for preview (uses random seed for variety on page load)
  const puzzleImage = useMemo(() => {
    return getRandomPuzzleImage(randomSeed);
  }, [randomSeed, getRandomPuzzleImage]);

  // Parse mat border and reveal as numbers
  const matBorder = parseFloat(matBorderWidth) || 2.5;
  const matReveal = parseFloat(matRevealWidth) || 0.25;

  // Type B behavior: Calculate effective bottom border (auto-adjusted for nameplate)
  const effectiveBottomBorder =
    matType !== "none" ? getTypeBBottomBorder(brassNameplateConfig.enabled, matBorder) : 0;
  const nameplateBottomExtra = effectiveBottomBorder - matBorder;

  // Bottom-weighted matting adds extra to bottom border
  const bottomWeightedExtra = bottomWeighted ? BOTTOM_WEIGHTED_EXTRA : 0;

  // Calculate round mat opening dimensions (includes 1/16" reveal for round puzzles)
  const roundOpening = useMemo(() => {
    if (!selectedPuzzleSize?.isRound || matType === "none") return null;
    const diameter = selectedPuzzleSize.diameter ?? selectedPuzzleSize.width;
    return createRoundMatOpening(diameter);
  }, [selectedPuzzleSize, matType]);

  // Calculate total frame dimensions (puzzle + mat borders + reveal for double mat)
  const totalFrameWidth = useMemo(() => {
    if (!selectedPuzzleSize || matType === "none") return selectedPuzzleSize?.width || 0;

    // For round puzzles, use the roundOpening diameter + mat borders + double-mat reveal if applicable
    if (roundOpening) {
      const revealWidth = matType === "double" ? matReveal * 2 : 0;
      return roundOpening.diameter + matBorder * 2 + revealWidth;
    }

    // For rectangular puzzles, add mat borders and double-mat reveal
    const revealWidth = matType === "double" ? matReveal * 2 : 0;
    return selectedPuzzleSize.width + matBorder * 2 + revealWidth;
  }, [selectedPuzzleSize, matType, matBorder, matReveal, roundOpening]);

  const totalFrameHeight = useMemo(() => {
    if (!selectedPuzzleSize || matType === "none") return selectedPuzzleSize?.height || 0;

    // For round puzzles, use the roundOpening diameter + mat borders + double-mat reveal if applicable (same as width for circles)
    // Note: Round puzzles don't support brass nameplate or bottom-weighted (asymmetric borders don't work with circles)
    if (roundOpening) {
      const revealHeight = matType === "double" ? matReveal * 2 : 0;
      return roundOpening.diameter + matBorder * 2 + revealHeight;
    }

    // For rectangular puzzles, add mat borders, double-mat reveal, nameplate bottom extension, and bottom-weighted extra
    const revealHeight = matType === "double" ? matReveal * 2 : 0;
    return (
      selectedPuzzleSize.height +
      matBorder * 2 +
      revealHeight +
      nameplateBottomExtra +
      bottomWeightedExtra
    );
  }, [
    selectedPuzzleSize,
    matType,
    matBorder,
    matReveal,
    roundOpening,
    nameplateBottomExtra,
    bottomWeightedExtra,
  ]);

  // Calculate actual frame dimensions including moulding
  const frameWidth = totalFrameWidth + 2 * (selectedFrame.mouldingWidth || 0);
  const frameHeight = totalFrameHeight + 2 * (selectedFrame.mouldingWidth || 0);

  // Intelligent preview sizing hook - dynamically adjusts preview container height based on frame aspect ratio
  // For round puzzles, disable plaque since asymmetric borders don't work with circles
  const plaqueEnabledForPreview =
    brassNameplateConfig.enabled && matType !== "none" && !selectedPuzzleSize?.isRound;
  const { containerRef, previewContainerHeight, containerWidth } = useIntelligentPreviewSizing({
    frameWidth,
    frameHeight,
    plaqueEnabled: plaqueEnabledForPreview,
    plaqueExtension: 1.5,
    isMobile,
    // Custom overrides to match previous behavior (was min-h-[300px] md:min-h-[450px])
    minHeightMobile: 300,
    minHeightDesktop: 450,
  });

  // Check if mat is oversize (uses actual frame dimensions with mat)
  const isMatOversize = useMemo(() => {
    if (matType === "none" || !selectedPuzzleSize) return false;
    return isOversizeMat({ widthIn: totalFrameWidth, heightIn: totalFrameHeight });
  }, [matType, selectedPuzzleSize, totalFrameWidth, totalFrameHeight]);

  // Get available mats based on puzzle size, viewport, and oversize status
  const availableMats = useMemo(() => {
    const viewport = isMobile ? "mobile" : "desktop";
    const mats = getMatsInDisplayOrder(viewport);

    if (!selectedPuzzleSize || matType === "none") return mats;

    // For oversize mats, filter by color availability only (not by mat.sizes)
    if (isMatOversize) {
      // TODO: Extract getAvailableColorsForSize to @framecraft/config
      // For now, return all mats for oversize (will be filtered by availability in future)
      return mats;
    }

    // For standard size mats, filter by size availability
    return mats.filter((mat: Mat) => isMatAvailableForSize(mat, totalFrameWidth, totalFrameHeight));
  }, [selectedPuzzleSize, isMobile, matType, totalFrameWidth, totalFrameHeight, isMatOversize]);

  // Separate standard (regular) and premium mats
  const standardMats = useMemo(() => {
    return availableMats.filter((mat: Mat) => mat.isRegular);
  }, [availableMats]);

  const premiumMats = useMemo(() => {
    return availableMats.filter((mat: Mat) => mat.isPremium);
  }, [availableMats]);

  // Filter glass types to only show Standard and Non-glare for puzzles
  const filteredGlassTypes = useMemo(() => {
    return getGlassTypes().filter((g) => g.id === "standard" || g.id === "non-glare");
  }, []);

  // Force mat selection for round puzzles
  useEffect(() => {
    if (selectedPuzzleSize?.isRound && matType === "none") {
      setMatType("single");
    }
  }, [selectedPuzzleSize, matType]);

  // Reset bottom-weighted when mat is removed
  useEffect(() => {
    if (matType === "none") {
      setBottomWeighted(false);
    }
  }, [matType]);

  // Auto-change mat color to white when mat becomes oversize and current color is unavailable
  useEffect(() => {
    if (matType === "none" || !isMatOversize) return;

    // TODO: Extract getAvailableColorsForSize to @framecraft/config
    // For now, skip auto-switching (will be implemented when function is extracted)
    // const { available } = getAvailableColorsForSize({
    //   widthIn: totalFrameWidth,
    //   heightIn: totalFrameHeight
    // });

    // Check if current top mat color is unavailable for oversize
    // if (!available.includes(selectedMatColor.id)) {
    //   // Switch to white (first mat in palette)
    //   const whiteMat = ALL_MATS.find((m: Mat) => m.id === 'white') || ALL_MATS[0];
    //   setSelectedMatColor(whiteMat);
    // }

    // Check if current bottom mat color is unavailable for oversize (double mat only)
    // if (matType === 'double' && !available.includes(selectedBottomMatColor.id)) {
    //   // Switch to white for bottom mat as well
    //   const whiteMat = ALL_MATS.find((m: Mat) => m.id === 'white') || ALL_MATS[0];
    //   setSelectedBottomMatColor(whiteMat);
    // }
  }, [
    isMatOversize,
    matType,
    totalFrameWidth,
    totalFrameHeight,
    selectedMatColor.id,
    selectedBottomMatColor.id,
  ]);

  // Update URL when configuration changes
  useEffect(() => {
    const params = new URLSearchParams();

    if (selectedPuzzleSize) {
      if (selectedPuzzleSize.id === "custom") {
        params.set("customWidth", selectedPuzzleSize.width.toString());
        params.set("customHeight", selectedPuzzleSize.height.toString());
      } else {
        params.set("puzzleSize", selectedPuzzleSize.id);
      }
    }

    params.set("frame", selectedFrame.id);
    params.set("matType", matType);
    params.set("mat", selectedMatColor.id);
    if (matType !== "none") {
      params.set("matBorder", matBorderWidth);
      if (bottomWeighted) {
        params.set("bottomWeighted", "true");
      } else {
        params.delete("bottomWeighted");
      }
    }
    if (matType === "double") {
      params.set("bottomMat", selectedBottomMatColor.id);
      params.set("matReveal", matRevealWidth);
    }
    if (glassType) {
      params.set("glass", glassType);
    }
    params.set("hardware", hardware);
    if (quantity > 1) {
      params.set("quantity", quantity.toString());
    } else {
      params.delete("quantity");
    }

    if (brassNameplateConfig.enabled) {
      params.set("plaqueEnabled", "true");
      if (brassNameplateConfig.line1) params.set("plaqueLine1", brassNameplateConfig.line1);
      if (brassNameplateConfig.line2) params.set("plaqueLine2", brassNameplateConfig.line2);
      if (brassNameplateConfig.line3) params.set("plaqueLine3", brassNameplateConfig.line3);
      if (brassNameplateConfig.font) params.set("plaqueFont", brassNameplateConfig.font);
    } else {
      params.delete("plaqueEnabled");
      params.delete("plaqueLine1");
      params.delete("plaqueLine2");
      params.delete("plaqueLine3");
      params.delete("plaqueFont");
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  }, [
    selectedPuzzleSize,
    selectedFrame,
    matType,
    selectedMatColor,
    selectedBottomMatColor,
    matBorderWidth,
    matRevealWidth,
    bottomWeighted,
    glassType,
    hardware,
    quantity,
    brassNameplateConfig,
  ]);

  // Calculate pricing
  const pricing = useMemo(() => {
    if (!selectedPuzzleSize) return null;

    try {
      // Frame configuration for pricing calculation
      const effectiveMatBorder = matType === "none" ? 0 : matBorder;
      const effectiveMatReveal = matType === "double" ? matReveal : 0;
      const config: FrameConfiguration = {
        serviceType: "frame-only",
        artworkWidth: selectedPuzzleSize.width,
        artworkHeight: selectedPuzzleSize.height,
        matType: matType,
        matBorderWidth: effectiveMatBorder,
        matRevealWidth: effectiveMatReveal,
        frameStyleId: selectedFrame.id,
        matColorId: selectedMatColor.id,
        matInnerColorId: matType === "double" ? selectedBottomMatColor.id : undefined,
        glassTypeId: glassType || "standard",
      };

      const framePricing = calculatePricing(config);

      // Add hardware cost
      const hardwareCost = hardware === "security" ? 8.95 : 0;

      // Add nameplate cost (only when mat is selected and not a round puzzle)
      const nameplateEnabled =
        brassNameplateConfig.enabled && matType !== "none" && !selectedPuzzleSize?.isRound;
      const nameplateCost = nameplateEnabled ? BRASS_NAMEPLATE_SPECS.PRICE : 0;

      // Add puzzle sheets cost (auto-included with every puzzle frame - not shown as line item)
      const puzzleSheetsCost = 9.95;

      const total = framePricing.total + hardwareCost + nameplateCost + puzzleSheetsCost;

      return {
        ...framePricing,
        hardwareCost,
        nameplateCost,
        total,
      };
    } catch (error) {
      console.error("Error calculating pricing:", error);
      return null;
    }
  }, [
    selectedPuzzleSize,
    selectedFrame,
    matType,
    selectedMatColor,
    selectedBottomMatColor,
    glassType,
    hardware,
    brassNameplateConfig.enabled,
    matBorder,
    matReveal,
  ]);

  // Build itemized pricing structure for PriceBox
  const priceItems = useMemo((): PriceLineItem[] => {
    if (!pricing) return [];

    const items: PriceLineItem[] = [];

    // Frame
    if (pricing.framePrice) {
      items.push({
        label: "Frame",
        amount: pricing.framePrice,
        testId: "text-frame-cost",
      });
    }

    // Mat
    if (pricing.matPrice) {
      const matLabel = matType === "double" ? "Mat Board (double)" : "Mat Board (single)";
      items.push({
        label: matLabel,
        amount: pricing.matPrice,
        testId: "text-mat-cost",
      });
    }

    // Glass
    const selectedGlass = filteredGlassTypes.find((g) => g.id === glassType);
    const glassLabel = selectedGlass?.name || "Glass";
    if (pricing.glassPrice > 0) {
      items.push({
        label: glassLabel,
        amount: pricing.glassPrice,
        testId: "text-glass-cost",
      });
    } else {
      items.push({
        label: glassLabel,
        amount: 0,
        isIncluded: true,
        testId: "text-glass-cost",
      });
    }

    // Oversize fee
    if (pricing.oversizeFee) {
      items.push({
        label: "Oversize Fee",
        amount: pricing.oversizeFee,
        testId: "text-oversize-cost",
      });
    }

    // Hardware
    if (pricing.hardwareCost > 0) {
      items.push({
        label: "Security Hardware",
        amount: pricing.hardwareCost,
        testId: "text-hardware-cost",
      });
    } else {
      items.push({
        label: "Standard Hardware",
        amount: 0,
        isIncluded: true,
        testId: "text-hardware-cost",
      });
    }

    // Brass Nameplate (only when mat is selected)
    if (pricing.nameplateCost && pricing.nameplateCost > 0) {
      items.push({
        label: "Engraved Brass Nameplate",
        amount: pricing.nameplateCost,
        testId: "text-nameplate-cost",
      });
    }

    return items;
  }, [pricing, matType, glassType, filteredGlassTypes]);

  // Handle custom size changes
  const handleCustomSizeChange = (width: string, height: string) => {
    setCustomWidth(width);
    setCustomHeight(height);

    const w = parseFloat(width);
    const h = parseFloat(height);

    if (!isNaN(w) && !isNaN(h)) {
      const validation = validatePuzzleDimensions(w, h);
      if (validation.valid) {
        const customSize: PuzzleSize = {
          id: "custom",
          pieces: 0,
          pieceLabel: "custom",
          width: w,
          height: h,
          isRound: false,
          isPanoramic: false,
          isSquare: false,
          category: "standard",
          aspectRatio: w / h,
          label: `Custom — ${w}" × ${h}"`,
        };
        setSelectedPuzzleSize(customSize);
      }
    }
  };

  // Handle size selection from dropdown
  const handleSizeSelectChange = (value: string) => {
    if (value === "custom") {
      setShowCustomInputs(true);
      // Open the custom size accordion
      if (!openAccordions.includes("size")) {
        setOpenAccordions([...openAccordions, "size"]);
      }
    } else {
      setShowCustomInputs(false);
      setCustomWidth("");
      setCustomHeight("");
      // Close the custom size accordion
      setOpenAccordions(openAccordions.filter((v) => v !== "size"));
      const preset = getPuzzleSizeById(value);
      if (preset) {
        setSelectedPuzzleSize(preset);
      }
    }
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied!",
      description: "Design link copied to clipboard",
    });
  };

  const handleAddToCart = async () => {
    if (!selectedPuzzleSize || !pricing) return;

    setIsCheckingOut(true);
    try {
      // TODO: Implement Shopify cart integration
      toast({
        title: "Added to cart",
        description: `${quantity}× Puzzle Frame added to cart`,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add to cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Preview */}
          <div
            className={`space-y-6 ${isMobile && mobileView === "controls" ? "hidden" : ""} lg:sticky lg:top-[132px] lg:self-start`}
          >
            <Card ref={previewCardRef} className="p-6">
              <div className="space-y-4">
                {/* Preview Container */}
                <div
                  ref={containerRef}
                  className="relative bg-muted/30 rounded-md overflow-hidden"
                  style={{ minHeight: `${previewContainerHeight}px` }}
                  data-testid="preview-container"
                >
                  {/* Full Size Button - Top Left */}
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowFullscreenPreview(true)}
                    className="absolute top-3 left-3 z-10 shadow-md"
                    data-testid="button-fullscreen-preview"
                  >
                    <Maximize className="h-4 w-4" />
                  </Button>
                  {selectedPuzzleSize && (
                    <div className="flex items-center justify-center p-8">
                      <PuzzlePreview
                        puzzleSize={selectedPuzzleSize}
                        framePhotos={framePhotos}
                        frameSku={selectedFrame.sku}
                        matType={matType}
                        topMatColor={selectedMatColor.hexColor || selectedMatColor.id}
                        matBorderWidth={matBorder}
                        bottomMatBorderWidth={effectiveBottomBorder + bottomWeightedExtra}
                        matRevealWidth={matReveal}
                        bottomMatColor={
                          selectedBottomMatColor.hexColor || selectedBottomMatColor.id
                        }
                        puzzleImage={puzzleImage}
                        containerWidth={containerWidth}
                        containerHeight={previewContainerHeight}
                        topMatColorName={selectedMatColor.name}
                        roundOpening={roundOpening}
                        brassNameplateConfig={brassNameplateConfig}
                      />
                    </div>
                  )}
                </div>

                {/* Sample image caption */}
                <p className="text-xs text-muted-foreground/60 text-center mt-2">
                  Sample image. Not included with purchase.
                </p>

                {/* Dimensions Box */}
                <div className="mt-4 p-3 bg-muted/50 rounded-md text-sm space-y-0.5">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">
                      Finished Size:{" "}
                      <span className="text-primary">
                        {frameWidth.toFixed(2)}&quot; × {frameHeight.toFixed(2)}&quot;
                      </span>
                    </p>
                    {selectedFrame.dimensionalDiagram && (
                      <TooltipProvider>
                        <Tooltip delayDuration={200}>
                          <TooltipTrigger asChild>
                            <button
                              className="text-muted-foreground hover:text-foreground transition-colors"
                              data-testid="button-dimensional-diagram"
                            >
                              <Info className="h-4 w-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent
                            side="right"
                            className="p-0 border-0 bg-transparent shadow-lg"
                          >
                            <img
                              src={selectedFrame.dimensionalDiagram}
                              alt={`${selectedFrame.name} dimensional diagram`}
                              className="w-64 rounded-lg border-2 border-border bg-background"
                              data-testid="img-dimensional-diagram"
                            />
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Puzzle: {selectedPuzzleSize?.width}&quot; × {selectedPuzzleSize?.height}&quot;
                    {matType !== "none" && <> • Mat Border: {matBorder.toFixed(2)}&quot;</>}
                    {matType === "double" && <> • Reveal: {matReveal.toFixed(2)}&quot;</>}
                  </p>
                </div>

                {/* Frame Detail Photos + Rotating Lifestyle Photo */}
                {selectedFrame.alternateImages && selectedFrame.alternateImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 pt-4">
                    {/* First two alternate images */}
                    {selectedFrame.alternateImages
                      .slice(0, 2)
                      .map((image: AlternateImage, idx: number) => (
                        <div
                          key={idx}
                          className="aspect-square rounded-md overflow-hidden bg-muted"
                        >
                          <img
                            src={image.url}
                            alt={image.alt}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    {/* Third slot: Rotating lifestyle photo with fade transition */}
                    <div className="aspect-square rounded-md overflow-hidden bg-muted">
                      <img
                        key={lifestylePhoto.url}
                        src={lifestylePhoto.url}
                        alt={lifestylePhoto.alt}
                        className="w-full h-full object-cover animate-in fade-in duration-500"
                        data-testid="puzzle-lifestyle-image"
                      />
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Trust indicators */}
            <TrustBox />
          </div>

          {/* Right Column - Controls */}
          <div className={`space-y-6 ${isMobile && mobileView === "preview" ? "hidden" : ""}`}>
            <h1 ref={controlsHeadingRef} className="text-3xl font-bold">
              Puzzle Frame Designer
            </h1>
            <p className="text-muted-foreground">
              Preserve and display your completed puzzles with custom framing
            </p>

            {/* Glue Sheets Included Callout */}
            <div
              className="bg-primary/10 border-2 border-primary/20 rounded-lg p-4"
              data-testid="glue-sheet-callout"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Info className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-base mb-1">Complete Puzzle Framing Kit</h3>
                  <p className="text-sm text-muted-foreground">
                    Every puzzle frame includes professional puzzle glue sheets to permanently
                    preserve your completed puzzle before framing. No need to purchase glue
                    separately!
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Preset Puzzle Size Selection */}
            <Card className="p-6">
              <div className="space-y-4">
                <Label htmlFor="puzzle-size">Puzzle Size</Label>
                <Select
                  value={
                    selectedPuzzleSize?.id === "custom" || showCustomInputs
                      ? "custom"
                      : selectedPuzzleSize?.id
                  }
                  onValueChange={handleSizeSelectChange}
                >
                  <SelectTrigger id="puzzle-size" data-testid="select-puzzle-size">
                    <SelectValue placeholder="Select a size" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Standard Puzzles */}
                    <SelectItem value="puzzle-100" data-testid="select-size-100">
                      100 pieces — 14.25&quot; × 10.25&quot;
                    </SelectItem>
                    <SelectItem value="puzzle-150" data-testid="select-size-150">
                      150 pieces — 14.25&quot; × 10.25&quot;
                    </SelectItem>
                    <SelectItem value="puzzle-200" data-testid="select-size-200">
                      200 pieces — 19.25&quot; × 14.25&quot;
                    </SelectItem>
                    <SelectItem value="puzzle-300" data-testid="select-size-300">
                      300 pieces — 18&quot; × 24&quot;
                    </SelectItem>
                    <SelectItem value="puzzle-500" data-testid="select-size-500">
                      500 pieces — 19.25&quot; × 14.25&quot;
                    </SelectItem>
                    <SelectItem value="puzzle-750" data-testid="select-size-750">
                      750 pieces — 24&quot; × 18&quot;
                    </SelectItem>
                    <SelectItem value="puzzle-1000" data-testid="select-size-1000">
                      1000 pieces — 27&quot; × 20&quot;
                    </SelectItem>
                    <SelectItem value="puzzle-1500" data-testid="select-size-1500">
                      1500 pieces — 32&quot; × 24&quot;
                    </SelectItem>
                    <SelectItem value="puzzle-2000" data-testid="select-size-2000">
                      2000 pieces — 39&quot; × 27&quot;
                    </SelectItem>

                    <Separator className="my-2" />

                    {/* Panoramic Puzzles */}
                    <SelectItem
                      value="puzzle-500-panoramic"
                      data-testid="select-size-500-panoramic"
                    >
                      500 pieces (panoramic) — 26&quot; × 9&quot;
                    </SelectItem>
                    <SelectItem
                      value="puzzle-750-panoramic"
                      data-testid="select-size-750-panoramic"
                    >
                      750 pieces (panoramic) — 37&quot; × 12&quot;
                    </SelectItem>
                    <SelectItem
                      value="puzzle-1000-panoramic"
                      data-testid="select-size-1000-panoramic"
                    >
                      1000 pieces (panoramic) — 39&quot; × 13&quot;
                    </SelectItem>

                    <Separator className="my-2" />

                    {/* Square Puzzles */}
                    <SelectItem value="puzzle-500-square" data-testid="select-size-500-square">
                      500 pieces (square) — 21&quot; × 21&quot;
                    </SelectItem>
                    <SelectItem value="puzzle-1000-square" data-testid="select-size-1000-square">
                      1000 pieces (square) — 25&quot; × 25&quot;
                    </SelectItem>

                    <Separator className="my-2" />

                    {/* Round Puzzles */}
                    <SelectItem value="puzzle-500-round" data-testid="select-size-500-round">
                      500 pieces (round) — 25&quot; diameter
                    </SelectItem>
                    <SelectItem value="puzzle-1000-round" data-testid="select-size-1000-round">
                      1000 pieces (round) — 27&quot; diameter
                    </SelectItem>

                    <Separator className="my-2" />
                    <SelectItem value="custom" data-testid="select-size-custom">
                      Custom dimensions
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>

            <Accordion
              type="multiple"
              value={openAccordions}
              onValueChange={setOpenAccordions}
              className="w-full"
            >
              {showCustomInputs && (
                <AccordionItem value="size">
                  <AccordionTrigger data-testid="accordion-size">Custom Size</AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <div className="flex items-end gap-4">
                      <div className="flex-1 space-y-2">
                        <Label htmlFor="width">Puzzle Width (inches)</Label>
                        <Input
                          id="width"
                          value={customWidth}
                          onChange={(e) => handleCustomSizeChange(e.target.value, customHeight)}
                          onFocus={(e) => {
                            setTimeout(() => {
                              e.target.scrollIntoView({ behavior: "smooth", block: "center" });
                            }, 300);
                          }}
                          placeholder="e.g., 16 or 16 1/2"
                          data-testid="input-width"
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <Label htmlFor="height">Puzzle Height (inches)</Label>
                        <Input
                          id="height"
                          value={customHeight}
                          onChange={(e) => handleCustomSizeChange(customWidth, e.target.value)}
                          onFocus={(e) => {
                            setTimeout(() => {
                              e.target.scrollIntoView({ behavior: "smooth", block: "center" });
                            }, 300);
                          }}
                          placeholder="e.g., 20 or 20 3/4"
                          data-testid="input-height"
                        />
                      </div>
                    </div>
                    {customWidth &&
                      customHeight &&
                      (() => {
                        const w = parseFloat(customWidth);
                        const h = parseFloat(customHeight);
                        if (!isNaN(w) && !isNaN(h)) {
                          const validation = validatePuzzleDimensions(w, h);
                          if (!validation.valid) {
                            return <p className="text-xs text-destructive">{validation.error}</p>;
                          }
                        }
                        return null;
                      })()}
                    <p className="text-xs text-muted-foreground">
                      Minimum 4 inches. Enter whole numbers or fractions (e.g., 12.5 or 12 1/2)
                    </p>
                  </AccordionContent>
                </AccordionItem>
              )}

              <AccordionItem value="frame">
                <AccordionTrigger data-testid="accordion-frame">Frame Style</AccordionTrigger>
                <AccordionContent>
                  <div className="md:max-h-[400px] md:overflow-y-auto md:pr-2">
                    <div className="grid grid-cols-2 gap-2">
                      {pictureFrames.map((frame) => {
                        // Use bottom texture image for swatches (horizontal bar view)
                        const swatchImage = getStoreBaseAssetUrl(`frames/${frame.sku}/bottom.jpg`);

                        return (
                          <button
                            key={frame.id}
                            onClick={() => setSelectedFrame(frame)}
                            className={`p-3 rounded-md border-2 text-left hover-elevate active-elevate-2 ${
                              selectedFrame.id === frame.id
                                ? "border-primary"
                                : "border-transparent"
                            }`}
                            data-testid={`button-frame-${frame.id}`}
                          >
                            {swatchImage ? (
                              <div className="h-12 w-full rounded mb-2 overflow-hidden border">
                                <img
                                  src={swatchImage}
                                  alt={frame.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            ) : (
                              <div
                                className="h-12 w-full rounded mb-2"
                                style={{
                                  background: `linear-gradient(135deg, ${frame.color} 0%, ${frame.borderColor} 100%)`,
                                }}
                              />
                            )}
                            <p className="font-medium text-sm mb-1.5">{frame.name}</p>
                            <div className="space-y-0.5 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1.5">
                                <svg
                                  className="w-3 h-3 flex-shrink-0"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                  />
                                </svg>
                                <span>Width: {frame.mouldingWidth}&quot;</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <svg
                                  className="w-3 h-3 flex-shrink-0"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                                  />
                                </svg>
                                <span>Depth: {frame.usableDepth}&quot;</span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="mat">
                <AccordionTrigger data-testid="accordion-mat">Mat Board</AccordionTrigger>
                <AccordionContent className="space-y-4">
                  {/* Mat Type */}
                  <div
                    className={`grid gap-2 ${selectedPuzzleSize?.isRound ? "grid-cols-2" : "grid-cols-3"}`}
                  >
                    {!selectedPuzzleSize?.isRound && (
                      <Button
                        type="button"
                        variant={matType === "none" ? "default" : "outline"}
                        onClick={() => setMatType("none")}
                        data-testid="button-mat-none"
                      >
                        <span className="font-semibold">No Mat</span>
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant={matType === "single" ? "default" : "outline"}
                      onClick={() => setMatType("single")}
                      data-testid="button-mat-single"
                    >
                      <span className="font-semibold">Single Mat</span>
                    </Button>
                    <Button
                      type="button"
                      variant={matType === "double" ? "default" : "outline"}
                      onClick={() => setMatType("double")}
                      data-testid="button-mat-double"
                    >
                      <span className="font-semibold">Double Mat</span>
                    </Button>
                  </div>

                  {/* Mat Border Slider */}
                  {matType !== "none" && (
                    <>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="matBorder">Mat Border Width</Label>
                          <span className="text-sm font-medium" data-testid="text-mat-border-value">
                            {matBorder.toFixed(2)}&quot;
                          </span>
                        </div>
                        <Slider
                          id="matBorder"
                          min={1.5}
                          max={8}
                          step={0.25}
                          value={[matBorder]}
                          onValueChange={(values) => setMatBorderWidth((values[0] ?? 0).toString())}
                          data-testid="slider-mat-border"
                        />
                        <p className="text-xs text-muted-foreground">
                          Border on each side of the puzzle
                        </p>
                      </div>

                      {/* Oversize Mat Warning */}
                      {isMatOversize && (
                        <div
                          className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-md p-3 text-sm text-yellow-800 dark:text-yellow-200"
                          data-testid="warning-oversize"
                        >
                          <p>
                            This mat exceeds standard sheet size 32&quot;×40&quot;. Limited color
                            selection available.
                          </p>
                        </div>
                      )}

                      {/* Bottom-Weighted Matting - only for rectangular puzzles */}
                      {!selectedPuzzleSize?.isRound && (
                        <BottomWeightedMatting
                          checked={bottomWeighted}
                          onCheckedChange={setBottomWeighted}
                          testIdPrefix="puzzle"
                        />
                      )}

                      <div
                        className={`space-y-3 ${matType === "double" ? "pt-4 pb-3 px-3 md:px-0 bg-muted/40 md:bg-transparent rounded-lg" : ""}`}
                      >
                        {matType === "double" ? (
                          <Label className="text-base font-semibold">
                            Top Mat: {selectedMatColor.name}
                          </Label>
                        ) : (
                          <Label>Mat: {selectedMatColor.name}</Label>
                        )}
                        <ColorSwatchesWithSeparator
                          standardColors={standardMats}
                          premiumColors={premiumMats}
                          selectedId={selectedMatColor.id}
                          onSelect={(mat) => setSelectedMatColor(mat as Mat)}
                        />
                      </div>

                      {matType === "double" && (
                        <>
                          <Separator className="my-6" />

                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="matReveal">Mat Reveal Width</Label>
                              <span
                                className="text-sm font-medium"
                                data-testid="text-mat-reveal-value"
                              >
                                {matReveal.toFixed(2)}&quot;
                              </span>
                            </div>
                            <Slider
                              id="matReveal"
                              min={0.25}
                              max={1}
                              step={0.25}
                              value={[matReveal]}
                              onValueChange={(values) =>
                                setMatRevealWidth((values[0] ?? 0).toString())
                              }
                              data-testid="slider-mat-reveal"
                            />
                            <p className="text-xs text-muted-foreground">
                              The reveal is the inner mat border visible around the puzzle
                            </p>
                          </div>

                          <div className="space-y-3 pt-4 pb-3 px-3 md:px-0 bg-muted/40 md:bg-transparent rounded-lg">
                            <Label className="text-base font-semibold">
                              Accent Mat: {selectedBottomMatColor.name}
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              Thin border mat visible around the opening
                            </p>
                            <ColorSwatchesWithSeparator
                              standardColors={standardMats}
                              premiumColors={premiumMats}
                              selectedId={selectedBottomMatColor.id}
                              onSelect={(mat) => setSelectedBottomMatColor(mat as Mat)}
                            />
                          </div>
                        </>
                      )}
                    </>
                  )}
                </AccordionContent>
              </AccordionItem>

              {/* Engraved Brass Nameplate - only shown when mat is selected and not round puzzle */}
              {matType !== "none" && !selectedPuzzleSize?.isRound && (
                <AccordionItem value="nameplate" className="border rounded-lg px-4">
                  <AccordionTrigger
                    className="text-base font-semibold hover:no-underline py-4"
                    data-testid="accordion-nameplate"
                  >
                    Engraved Brass Nameplate
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4">
                    <BrassNameplateSection
                      config={brassNameplateConfig}
                      onChange={setBrassNameplateConfig}
                    />
                  </AccordionContent>
                </AccordionItem>
              )}

              <AccordionItem value="glass">
                <AccordionTrigger data-testid="accordion-glass">Glazing</AccordionTrigger>
                <AccordionContent>
                  <RadioGroup value={glassType || undefined} onValueChange={setGlassType}>
                    <div className="space-y-2">
                      {filteredGlassTypes.map((glass) => (
                        <div key={glass.id} className="flex items-center space-x-2">
                          <RadioGroupItem
                            value={glass.id}
                            id={`glass-${glass.id}`}
                            data-testid={`radio-glass-${glass.id}`}
                          />
                          <Label htmlFor={`glass-${glass.id}`} className="flex-1 cursor-pointer">
                            {glass.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="hardware">
                <AccordionTrigger data-testid="accordion-hardware">
                  Hanging Hardware
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <HangingHardwareSection
                    hardwareType={hardware}
                    setHardwareType={setHardware}
                    frameWidth={totalFrameWidth}
                    frameHeight={totalFrameHeight}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Desktop Price Box */}
            {pricing && (
              <PriceBox
                totalPrice={pricing.total}
                quantity={quantity}
                onQuantityChange={setQuantity}
                onAddToCart={handleAddToCart}
                onCopyLink={handleCopyLink}
                isProcessing={isCheckingOut}
                disabled={!selectedPuzzleSize}
                priceItems={priceItems}
                testIdPrefix="puzzle-"
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sticky Price Bar */}
      {isMobile && pricing && (
        <div
          className={`fixed left-0 right-0 bottom-0 bg-background/95 backdrop-blur-sm border-t border-border shadow-lg z-50 transition-all duration-300 ease-in-out ${
            showMobileBar
              ? "translate-y-0 opacity-100"
              : "translate-y-full opacity-0 pointer-events-none"
          }`}
        >
          <div className="px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex flex-col gap-0.5 min-w-[60px]">
                <span className="text-xs text-muted-foreground">Total</span>
                <span
                  className="font-bold text-sm"
                  data-testid="text-puzzle-mobile-sticky-total-price"
                >
                  ${(pricing.total * quantity).toFixed(2)}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <Label htmlFor="quantity-sticky" className="text-xs text-muted-foreground">
                  Qty
                </Label>
                <QuantitySelector
                  value={quantity}
                  onChange={setQuantity}
                  className="w-14 h-7 text-xs text-center p-0"
                  testId="input-puzzle-quantity-sticky"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyLink}
                data-testid="button-puzzle-mobile-copy-link"
                className="h-11 w-11"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                size="default"
                onClick={handleAddToCart}
                disabled={isCheckingOut || !selectedPuzzleSize}
                data-testid="button-puzzle-mobile-add-to-cart"
                className="flex-1 text-xs min-w-0 min-h-11"
              >
                {isCheckingOut ? "Adding..." : "Add to Cart"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toggle Button (Mobile Only) - Bottom Right, above price bar */}
      {
        <Button
          size="lg"
          className={`fixed bottom-20 right-6 z-[60] lg:hidden shadow-lg rounded-full h-14 px-6 transition-all duration-300 ${
            showMobileBar
              ? "translate-y-0 opacity-100"
              : "translate-y-32 opacity-0 pointer-events-none"
          }`}
          onClick={() => setMobileView(mobileView === "preview" ? "controls" : "preview")}
          data-testid="button-toggle-mobile-view"
        >
          {mobileView === "preview" ? (
            <>
              <Settings className="w-5 h-5 mr-2" />
              Customize
            </>
          ) : (
            <>
              <Eye className="w-5 h-5 mr-2" />
              Preview
            </>
          )}
        </Button>
      }

      {/* Fullscreen Preview Dialog */}
      <Dialog open={showFullscreenPreview} onOpenChange={setShowFullscreenPreview}>
        <DialogContent className="max-w-[100vw] w-screen h-screen max-h-screen p-0 border-0">
          <DialogHeader className="sr-only">
            <DialogTitle>Preview</DialogTitle>
          </DialogHeader>
          <div className="relative w-full h-full flex items-center justify-center bg-white">
            {selectedPuzzleSize && (
              <div className="w-full h-full flex items-center justify-center p-8">
                <div style={{ filter: "drop-shadow(0 8px 32px rgba(0, 0, 0, 0.15))" }}>
                  <PuzzlePreview
                    puzzleSize={selectedPuzzleSize}
                    framePhotos={framePhotos}
                    frameSku={selectedFrame.sku}
                    matType={matType}
                    topMatColor={selectedMatColor.hexColor || selectedMatColor.id}
                    matBorderWidth={matBorder}
                    bottomMatBorderWidth={effectiveBottomBorder + bottomWeightedExtra}
                    matRevealWidth={matReveal}
                    bottomMatColor={selectedBottomMatColor.hexColor || selectedBottomMatColor.id}
                    puzzleImage={puzzleImage}
                    containerWidth={800}
                    containerHeight={600}
                    topMatColorName={selectedMatColor.name}
                    roundOpening={roundOpening}
                    brassNameplateConfig={brassNameplateConfig}
                  />
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Puzzle preview component with proper mat beveling
function PuzzlePreview({
  puzzleSize,
  framePhotos,
  frameSku,
  matType,
  topMatColor,
  bottomMatColor,
  puzzleImage,
  containerWidth,
  containerHeight,
  topMatColorName,
  matBorderWidth = 2.5,
  bottomMatBorderWidth,
  matRevealWidth = 0.25,
  roundOpening = null,
  brassNameplateConfig,
}: {
  puzzleSize: PuzzleSize;
  framePhotos?: {
    cornerUrl?: string;
    profileUrl?: string;
    topUrl?: string;
    bottomUrl?: string;
    leftUrl?: string;
    rightUrl?: string;
  };
  frameSku?: string;
  matType: "single" | "double" | "none";
  topMatColor: string;
  bottomMatColor: string;
  puzzleImage: string;
  containerWidth: number;
  containerHeight: number;
  topMatColorName?: string;
  matBorderWidth?: number;
  bottomMatBorderWidth?: number;
  matRevealWidth?: number;
  roundOpening?: { type: "circle"; diameter: number; revealWidth: number } | null;
  brassNameplateConfig?: BrassNameplateConfig;
}) {
  const INCHES_TO_PX = 72;
  const MAT_BEVEL_WIDTH = 0.0625; // 1/16" mat beveled edge (corrected from 0.1)
  const MOLDING_WIDTH = 1.0; // 1" frame molding

  const matBorder = matType === "none" ? 0 : matBorderWidth;
  const matBottomBorder = matType === "none" ? 0 : (bottomMatBorderWidth ?? matBorderWidth);
  const matReveal = matType === "double" ? matRevealWidth : 0;

  // Frame INTERIOR dimensions - use roundOpening for circular puzzles
  let frameWidth, frameHeight;
  if (roundOpening && puzzleSize.isRound) {
    // For round puzzles: opening diameter + mat borders + double-mat reveal
    // The reveal is then applied as inset in the rendering to create the double-mat effect
    // Note: Round puzzles use symmetric borders (no nameplate support)
    frameWidth = roundOpening.diameter + matBorder * 2 + matReveal * 2;
    frameHeight = roundOpening.diameter + matBorder * 2 + matReveal * 2;
  } else {
    // For rectangular puzzles: puzzle size + mat borders + reveal (for double mat)
    // Uses asymmetric bottom border when nameplate is enabled
    frameWidth = puzzleSize.width + matBorder * 2 + matReveal * 2;
    frameHeight = puzzleSize.height + matBorder + matBottomBorder + matReveal * 2;
  }

  // Calculate total frame size including molding for scale calculation
  const totalFrameWidth = frameWidth + MOLDING_WIDTH * 2;
  const totalFrameHeight = frameHeight + MOLDING_WIDTH * 2;

  // Scale to fit container
  const scale = Math.min(
    (containerWidth - 40) / (totalFrameWidth * INCHES_TO_PX),
    (containerHeight - 40) / (totalFrameHeight * INCHES_TO_PX),
    1
  );

  const frameThickness = MOLDING_WIDTH * INCHES_TO_PX * scale; // 1" frame molding

  // Calculate interior dimensions (puzzle + mat, before adding molding)
  const interiorWidth = frameWidth * INCHES_TO_PX * scale;
  const interiorHeight = frameHeight * INCHES_TO_PX * scale;

  // Calculate total frame size for rendering (interior + molding)
  const scaledWidth = interiorWidth + frameThickness * 2;
  const scaledHeight = interiorHeight + frameThickness * 2;

  // Calculate bevel stroke width (1/16" = 0.1 inches)
  const bevelStrokeWidth = Math.max(2, MAT_BEVEL_WIDTH * INCHES_TO_PX * scale);

  // Get bevel color based on mat selection
  const bevelColor = topMatColorName ? getMatBevelColor(topMatColorName) : "#F5F3EE";

  // Calculate mat opening dimensions (puzzle size in pixels)
  const openingWidth = puzzleSize.width * INCHES_TO_PX * scale;
  const openingHeight = puzzleSize.height * INCHES_TO_PX * scale;

  // Mat border creates padding around puzzle - use asymmetric borders for Type B nameplate behavior
  const matBorderPx = matBorder * INCHES_TO_PX * scale;
  const bottomMatBorderPx = matBottomBorder * INCHES_TO_PX * scale;

  // Calculate brass nameplate positioning
  const plaquePositioning = (() => {
    if (!brassNameplateConfig?.enabled || matType === "none") return null;

    // Nameplate dimensions in preview pixels
    const plaqueWidthPx = BRASS_NAMEPLATE_SPECS.NAMEPLATE_WIDTH * INCHES_TO_PX * scale;
    const plaqueHeightPx = BRASS_NAMEPLATE_SPECS.NAMEPLATE_HEIGHT * INCHES_TO_PX * scale;
    const clearanceFromOpeningPx = 1.0 * INCHES_TO_PX * scale; // 1" below mat opening

    // BrassNameplatePreview uses 150 DPI internally, so we need to normalize
    const nameplateRenderScale = (INCHES_TO_PX * scale) / 150;

    // Calculate opening bottom position relative to frame
    // Opening is at frameThickness + topBorder from top, plus opening height
    const openingBottomY = frameThickness + matBorderPx + openingHeight;

    // Position plaque 1" below the opening bottom
    const plaqueY = openingBottomY + clearanceFromOpeningPx;

    // Center horizontally within the frame
    const plaqueX = (scaledWidth - plaqueWidthPx) / 2;

    return {
      x: plaqueX,
      y: plaqueY,
      width: plaqueWidthPx,
      height: plaqueHeightPx,
      renderScale: nameplateRenderScale,
    };
  })();

  return (
    <div
      className="relative"
      style={{
        width: scaledWidth,
        height: scaledHeight,
      }}
    >
      {/* Frame */}
      {framePhotos?.topUrl &&
      framePhotos?.bottomUrl &&
      framePhotos?.leftUrl &&
      framePhotos?.rightUrl ? (
        // Textured frame using images with proper 45° miter cuts via clipPath polygons
        <>
          {/* Top frame piece - clipped to trapezoid for 45° miters */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: frameThickness,
              backgroundImage: `url(${framePhotos.topUrl})`,
              backgroundSize: "auto 100%",
              backgroundRepeat: "repeat-x",
              backgroundPosition: "left center",
              zIndex: 20,
              clipPath: `polygon(
                0 0,
                100% 0,
                calc(100% - ${frameThickness}px) 100%,
                ${frameThickness}px 100%
              )`,
            }}
          />

          {/* Bottom frame piece - clipped to trapezoid for 45° miters */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: frameThickness,
              backgroundImage: `url(${framePhotos.bottomUrl})`,
              backgroundSize: "auto 100%",
              backgroundRepeat: "repeat-x",
              backgroundPosition: "left center",
              zIndex: 20,
              clipPath: `polygon(
                ${frameThickness}px 0,
                calc(100% - ${frameThickness}px) 0,
                100% 100%,
                0 100%
              )`,
            }}
          />

          {/* Left frame piece - behind top/bottom */}
          <div
            className="absolute top-0 bottom-0 left-0 z-10"
            style={{
              width: frameThickness,
              backgroundImage: `url(${framePhotos.leftUrl})`,
              backgroundSize: "100% auto",
              backgroundRepeat: "repeat-y",
              backgroundPosition: "center top",
            }}
          />

          {/* Right frame piece - behind top/bottom */}
          <div
            className="absolute top-0 bottom-0 right-0 z-10"
            style={{
              width: frameThickness,
              backgroundImage: `url(${framePhotos.rightUrl})`,
              backgroundSize: "100% auto",
              backgroundRepeat: "repeat-y",
              backgroundPosition: "center top",
            }}
          />
        </>
      ) : (
        // Fallback to solid color if textures not available
        <div
          className="absolute inset-0 rounded-sm"
          style={{
            backgroundColor: "#1a1a1a",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        />
      )}

      {/* Interior (mat or direct puzzle) */}
      <div
        className="absolute overflow-hidden"
        style={{
          inset: frameThickness,
        }}
      >
        {/* Mat opening / Puzzle */}
        {matType === "none" ? (
          // No mat - puzzle fills interior
          <img src={puzzleImage} alt="Puzzle" className="w-full h-full object-cover" />
        ) : matType === "double" ? (
          // Double mat - frame size includes reveal so puzzle stays at exact size
          // Top mat is OUTER layer (matBorder width), bottom mat shows reveal around puzzle
          // Uses asymmetric borders: top/left/right = matBorderPx, bottom = bottomMatBorderPx
          <div
            className="relative w-full h-full"
            style={{
              backgroundColor: topMatColor,
            }}
          >
            {/* Bottom mat layer - shows around puzzle with reveal width */}
            {/* Uses explicit positioning for asymmetric bottom border (Type B nameplate) */}
            <div
              className="absolute"
              style={{
                backgroundColor: bottomMatColor,
                top: matBorderPx,
                left: matBorderPx,
                right: matBorderPx,
                bottom: bottomMatBorderPx,
                border: `${0.08 * INCHES_TO_PX * scale}px solid #eeeeee`,
                borderRadius: puzzleSize.isRound ? "50%" : undefined,
              }}
            >
              {/* Puzzle opening - exact puzzle size (frame expanded to accommodate reveal) */}
              <div
                className="absolute"
                style={{
                  inset: matReveal * INCHES_TO_PX * scale,
                  borderRadius: puzzleSize.isRound ? "50%" : undefined,
                  overflow: "hidden",
                }}
              >
                {puzzleSize.isRound && roundOpening ? (
                  // Round opening - use SVG clipPath for proper circular masking
                  <svg
                    className="absolute"
                    style={{
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                    }}
                    viewBox="0 0 100 100"
                    preserveAspectRatio="xMidYMid slice"
                  >
                    <defs>
                      <clipPath
                        id={`round-puzzle-clip-${frameSku || "preview"}-double`}
                        clipPathUnits="objectBoundingBox"
                      >
                        <circle cx="0.5" cy="0.5" r="0.5" />
                      </clipPath>
                    </defs>
                    {/* Puzzle image clipped to circle */}
                    <image
                      href={puzzleImage}
                      x="0"
                      y="0"
                      width="100"
                      height="100"
                      preserveAspectRatio="xMidYMid slice"
                      clipPath={`url(#round-puzzle-clip-${frameSku || "preview"}-double)`}
                    />
                    {/* Bevel circle stroke - slightly inset to avoid overlapping puzzle */}
                    <circle
                      cx="50"
                      cy="50"
                      r={50 - bevelStrokeWidth / (openingWidth / 100) / 2}
                      fill="none"
                      stroke={bevelColor}
                      strokeWidth={bevelStrokeWidth / (openingWidth / 100)}
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                ) : (
                  // Rectangular opening - fills the opening area
                  <>
                    <img
                      src={puzzleImage}
                      alt="Puzzle"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* Bevel border */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        border: `${bevelStrokeWidth}px solid ${bevelColor}`,
                      }}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          // Single mat - explicit positioning approach
          // Uses asymmetric borders: top/left/right = matBorderPx, bottom = bottomMatBorderPx (Type B nameplate)
          <div
            className="relative w-full h-full"
            style={{
              backgroundColor: topMatColor,
            }}
          >
            {/* Puzzle opening - positioned with asymmetric borders */}
            <div
              className="absolute"
              style={{
                top: matBorderPx,
                left: matBorderPx,
                right: matBorderPx,
                bottom: bottomMatBorderPx,
                borderRadius: puzzleSize.isRound ? "50%" : undefined,
                overflow: "hidden",
              }}
            >
              {puzzleSize.isRound && roundOpening ? (
                // Round opening - use SVG clipPath for proper circular masking
                <svg
                  className="absolute"
                  style={{
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                  }}
                  viewBox="0 0 100 100"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <defs>
                    <clipPath
                      id={`round-puzzle-clip-${frameSku || "preview"}-single`}
                      clipPathUnits="objectBoundingBox"
                    >
                      <circle cx="0.5" cy="0.5" r="0.5" />
                    </clipPath>
                  </defs>
                  {/* Puzzle image clipped to circle */}
                  <image
                    href={puzzleImage}
                    x="0"
                    y="0"
                    width="100"
                    height="100"
                    preserveAspectRatio="xMidYMid slice"
                    clipPath={`url(#round-puzzle-clip-${frameSku || "preview"}-single)`}
                  />
                  {/* Bevel circle stroke - slightly inset to avoid overlapping puzzle */}
                  <circle
                    cx="50"
                    cy="50"
                    r={50 - bevelStrokeWidth / (openingWidth / 100) / 2}
                    fill="none"
                    stroke={bevelColor}
                    strokeWidth={bevelStrokeWidth / (openingWidth / 100)}
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              ) : (
                // Rectangular opening - fills the opening area
                <>
                  <img
                    src={puzzleImage}
                    alt="Puzzle"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* Bevel border */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      border: `${bevelStrokeWidth}px solid ${bevelColor}`,
                    }}
                  />
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Brass Nameplate Preview */}
      {plaquePositioning && brassNameplateConfig && (
        <div
          style={{
            position: "absolute",
            left: plaquePositioning.x,
            top: plaquePositioning.y,
            width: plaquePositioning.width,
            height: plaquePositioning.height,
            zIndex: 25,
          }}
          data-testid="preview-nameplate"
        >
          <BrassNameplatePreview
            config={brassNameplateConfig}
            scale={plaquePositioning.renderScale}
          />
        </div>
      )}
    </div>
  );
}
