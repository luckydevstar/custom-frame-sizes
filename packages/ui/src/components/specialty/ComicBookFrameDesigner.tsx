import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import {
  Copy,
  Maximize,
  Eye,
  Settings,
  BookOpen,
  LayoutGrid,
  Award,
  Info,
  Shield,
  ShoppingCart,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
// Select components not currently used
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
// Alert components not currently used
// import { Alert, AlertDescription } from "../ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { QuantitySelector } from "../ui/quantity-selector";
import { PriceBox } from "../ui/PriceBox";
import type { PriceLineItem } from "../ui/PriceBox";
// Import types from @framecraft/types
import type { FrameStyle, GlassType, AlternateImage } from "@framecraft/types";

// Import services from @framecraft/core
import { getFramesByCategory, getGlassTypes, getSharedAssetUrl } from "@framecraft/core";

// Import hooks from @framecraft/core
import { useIsMobile, useMobileViewToggle } from "@framecraft/core";

// Import config from @framecraft/config
import { ALL_MATS, getMatById, getAvailableMatsForSize, type Mat } from "@framecraft/config";

// Import UI components from same package
import { ColorSwatchesWithSeparator } from "../ui/ColorSwatches";

// TODO: Extract these app-specific dependencies or make them injectable
// - useToast hook
// - BrassNameplateSection component
// - @shared/schema types
// - comicFormats utilities (COMIC_FORMATS, getComicFormatById)
// - comicLayouts utilities (COMIC_LAYOUTS, getComicLayout, etc.)
// - comic-cover-images constants (getCoversForConfig)
// - ComicPreviewCanvas component and useComicPreviewState hook
// - useComicPricing hook
// - ComicLayoutGallery component
// - TrustBadges component
// - ComicLifestyleCarousel component
// - HangingHardwareSection, BottomWeightedMatting components
import { useToast } from "../../hooks/use-toast";
import { BrassNameplateSection } from "../brass-nameplate/BrassNameplateSection";
import type { BrassNameplateConfig } from "@framecraft/types";
// import { BRASS_NAMEPLATE_SPECS, getTypeABottomBorder } from "@framecraft/types";
import { COMIC_FORMATS, getComicFormatById } from "@framecraft/core";
import {
  COMIC_LAYOUTS,
  getComicLayout,
  calculateComicFrameSize,
  calculateComicPreviewDimensions,
  type ComicLayoutType,
} from "@framecraft/core";
import { ComicPreviewCanvas, useComicPreviewState } from "./ComicPreviewCanvas";
import { useComicPricing } from "@framecraft/core";
import { ComicLayoutGallery } from "./ComicLayoutGallery";
import { TrustBadges } from "../marketing/TrustBadges";
import { ComicLifestyleCarousel } from "./ComicLifestyleCarousel";
import { HangingHardwareSection } from "./shared/HangingHardwareSection";
import { BottomWeightedMatting, BOTTOM_WEIGHTED_EXTRA } from "./shared/BottomWeightedMatting";

// Get product data from services
const shadowboxFrames = getFramesByCategory("shadowbox");
const allGlassTypes = getGlassTypes();
// Filter to only Regular and Non-glare for comic frames
const glassTypes = allGlassTypes.filter((g) => g.id === "standard" || g.id === "non-glare");

interface ComicBookFrameDesignerProps {
  defaultFrameId?: string;
  embedded?: boolean;
  /**
   * Function to get comic cover images for a given configuration.
   * Should be provided by the app level.
   *
   * @param formatId - Comic format ID (e.g., "modern-age", "slabbed-cgc")
   * @param layoutId - Layout ID (e.g., "comic-single", "comic-double")
   * @param count - Number of covers needed
   * @returns Array of cover image paths
   */
  getCoversForConfig: (formatId: string, layoutId: string, count: number) => string[];
}

export function ComicBookFrameDesigner({
  defaultFrameId,
  embedded = false,
  getCoversForConfig,
}: ComicBookFrameDesignerProps) {
  useLocation(); // Location hook - navigate not currently used
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { mobileView, setMobileView, showMobileBar, previewCardRef, controlsHeadingRef } =
    useMobileViewToggle({ isMobile });

  // Controlled accordion state - all sections expanded by default
  const [accordionValue, setAccordionValue] = useState<string[]>([
    "comic-format-layout",
    "frame-style",
    "mat-options",
    "nameplate",
    "glazing",
    "hardware",
  ]);

  // Auto-expand mat-options on mobile
  useEffect(() => {
    if (isMobile && !accordionValue.includes("mat-options")) {
      setAccordionValue((prev) => [...prev, "mat-options"]);
    }
  }, [isMobile, accordionValue]);

  // URL parameters
  const urlParams = useMemo(() => new URLSearchParams(window.location.search), []);

  // Initialize frame selection
  const initialFrame = useMemo(() => {
    if (defaultFrameId) {
      const frame = shadowboxFrames.find(
        (f) => f.id === defaultFrameId || f.sku === defaultFrameId
      );
      return frame || shadowboxFrames[0];
    }
    const frameParam = urlParams.get("frame");
    if (frameParam) {
      const frame = shadowboxFrames.find((f) => f.id === frameParam || f.sku === frameParam);
      return frame || shadowboxFrames[0];
    }
    // Default to SKU 8693
    const defaultFrame = shadowboxFrames.find((f) => f.sku === "8693");
    return defaultFrame || shadowboxFrames[0];
  }, [defaultFrameId, urlParams]);

  // Designer state - Three-step flow: Format → Layout → Presentation
  const [selectedFormat, setSelectedFormat] = useState<string>(() => {
    return urlParams.get("format") || "modern-age";
  });

  const [selectedLayout, setSelectedLayout] = useState<ComicLayoutType>(() => {
    const urlLayout = urlParams.get("layout");
    if (urlLayout && COMIC_LAYOUTS.find((l) => l.id === urlLayout)) {
      return urlLayout as ComicLayoutType;
    }
    // Start with empty string - desktop will get default via useEffect
    return "";
  });

  const [selectedFrame, setSelectedFrame] = useState<FrameStyle>(
    initialFrame ?? shadowboxFrames[0]!
  );

  // Mat configuration
  const [selectedMat, setSelectedMat] = useState<Mat>(() => {
    const urlMat = urlParams.get("mat");
    const mat = urlMat ? getMatById(urlMat) : getMatById("mat-2");
    return mat ?? ALL_MATS[1]!;
  });

  const [selectedMatInner, setSelectedMatInner] = useState<Mat>(() => {
    const urlMatInner = urlParams.get("matInner");
    const mat = urlMatInner ? getMatById(urlMatInner) : getMatById("mat-1");
    return mat ?? ALL_MATS[0]!;
  });

  const [matType, setMatType] = useState<"none" | "single" | "double">(() => {
    const urlMatType = urlParams.get("matType") as "none" | "single" | "double";
    return urlMatType || "double";
  });

  const [bottomWeighted, setBottomWeighted] = useState(() => {
    return urlParams.get("bottomWeighted") === "true";
  });

  // Fixed mat dimensions (not user-adjustable for comic frames)
  const MAT_BORDER = 2.0; // inches
  const MAT_REVEAL = 0.25; // inches

  // Glazing and hardware
  const [selectedGlass, setSelectedGlass] = useState<GlassType>(() => {
    const urlGlass = urlParams.get("glass");
    const found = urlGlass
      ? glassTypes.find((g) => g.id === urlGlass) || glassTypes[0]
      : glassTypes[0];
    if (!found) {
      throw new Error("No glass types available");
    }
    return found;
  });

  const [hardware, setHardware] = useState<"standard" | "security">(() => {
    return (urlParams.get("hardware") as "standard" | "security") || "standard";
  });

  // Brass nameplate configuration
  const [brassNameplateConfig, setBrassNameplateConfig] = useState<BrassNameplateConfig>(() => {
    const defaultConfig: BrassNameplateConfig = {
      enabled: false,
      line1: "",
      line2: "",
      line3: "",
      font: "georgia",
      color: "brass-black",
      includeFlag: false, // No flag for comic frames
    };

    try {
      const nameplateEnabled =
        urlParams.get("nameplateEnabled") === "true" || urlParams.get("plaqueEnabled") === "true";
      if (!nameplateEnabled) return defaultConfig;

      return {
        enabled: true,
        line1: urlParams.get("nameplateLine1") || urlParams.get("plaqueLine1") || "",
        line2: urlParams.get("nameplateLine2") || urlParams.get("plaqueLine2") || "",
        line3: urlParams.get("nameplateLine3") || urlParams.get("plaqueLine3") || "",
        font:
          (urlParams.get("nameplateFont") as BrassNameplateConfig["font"]) ||
          (urlParams.get("plaqueFont") as BrassNameplateConfig["font"]) ||
          "georgia",
        color:
          (urlParams.get("nameplateColor") as BrassNameplateConfig["color"]) ||
          (urlParams.get("plaqueColor") as BrassNameplateConfig["color"]) ||
          "brass-black",
        includeFlag: false, // Always false for comic frames
      };
    } catch {
      return defaultConfig;
    }
  });

  // UI state
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showFullscreenPreview, setShowFullscreenPreview] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<
    "preview" | "corner" | "profile" | "lifestyle"
  >("preview");
  const [fullscreenLifestyleUrl, setFullscreenLifestyleUrl] = useState<string>("");
  const [fullscreenLifestyleAlt, setFullscreenLifestyleAlt] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [_priceBoxExpanded, _setPriceBoxExpanded] = useState(false);
  const customizationPaneRef = useRef<HTMLDivElement>(null);

  // Track if initial load is complete (for URL writing)
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);

  // New UX improvement states
  const [smartDefaultApplied, setSmartDefaultApplied] = useState<string | null>(null);
  const [_advancedOptionsExpanded, _setAdvancedOptionsExpanded] = useState(false);

  // Phase 2 Mobile Enhancement states
  const [_matPresetSelected, _setMatPresetSelected] = useState<string | null>(null);
  const [_showCustomMatColors, _setShowCustomMatColors] = useState(false);
  const [_showDimensionsOverlay, _setShowDimensionsOverlay] = useState(false);

  // Frame photos state (corner, profile images + texture slices)
  const [framePhotos, setFramePhotos] = useState<{
    cornerUrl?: string;
    profileUrl?: string;
    topUrl?: string;
    bottomUrl?: string;
    leftUrl?: string;
    rightUrl?: string;
  }>({});

  // Random lifestyle photo - picked once on mount and when frame changes
  const [randomLifestylePhoto, setRandomLifestylePhoto] = useState<{ url: string; alt: string }>({
    url: "",
    alt: "Comic display lifestyle photo",
  });

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 400, height: 400 });

  // Mark initial load as complete after mount
  useEffect(() => {
    setIsInitialLoadComplete(true);
  }, []);

  // Update URL when configuration changes (for sharing)
  useEffect(() => {
    if (!isInitialLoadComplete) return;

    const params = new URLSearchParams();

    // Core settings
    if (selectedFormat !== "modern-age") params.set("format", selectedFormat);
    if (selectedLayout) params.set("layout", selectedLayout);
    if (initialFrame && selectedFrame.id !== initialFrame.id) params.set("frame", selectedFrame.id);

    // Mat settings
    if (matType !== "double") params.set("matType", matType);
    if (matType !== "none") {
      if (selectedMat.id !== "mat-2") params.set("mat", selectedMat.id);
      if (matType === "double" && selectedMatInner.id !== "mat-1")
        params.set("matInner", selectedMatInner.id);
      if (bottomWeighted) {
        params.set("bottomWeighted", "true");
      } else {
        params.delete("bottomWeighted");
      }
    }

    // Glazing and hardware
    if (selectedGlass && selectedGlass.id !== "standard") params.set("glass", selectedGlass.id);
    if (hardware !== "standard") params.set("hardware", hardware);

    // Brass nameplate
    if (brassNameplateConfig.enabled) {
      params.set("nameplateEnabled", "true");
      if (brassNameplateConfig.line1) params.set("nameplateLine1", brassNameplateConfig.line1);
      if (brassNameplateConfig.line2) params.set("nameplateLine2", brassNameplateConfig.line2);
      if (brassNameplateConfig.line3) params.set("nameplateLine3", brassNameplateConfig.line3);
      if (brassNameplateConfig.font !== "georgia")
        params.set("nameplateFont", brassNameplateConfig.font);
      if (brassNameplateConfig.color !== "brass-black")
        params.set("nameplateColor", brassNameplateConfig.color);
    }

    const paramString = params.toString();
    const newUrl = paramString
      ? `${window.location.pathname}?${paramString}`
      : window.location.pathname;
    window.history.replaceState({}, "", newUrl);
  }, [
    isInitialLoadComplete,
    selectedFormat,
    selectedLayout,
    selectedFrame.id,
    initialFrame,
    matType,
    selectedMat.id,
    selectedMatInner.id,
    bottomWeighted,
    selectedGlass,
    hardware,
    brassNameplateConfig,
  ]);

  // Load frame photos when selectedFrame changes
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

  // Select random lifestyle photo on mount and when frame changes
  useEffect(() => {
    // Get all comic_lifestyle images from all shadowbox frames
    const allLifestyleImages: Array<{ url: string; alt: string }> = [];

    shadowboxFrames.forEach((frame) => {
      const lifestyleImages =
        frame.alternateImages?.filter((img: AlternateImage) => img.type === "comic_lifestyle") ||
        [];
      lifestyleImages.forEach((img: AlternateImage) => {
        allLifestyleImages.push({
          url: img.url,
          alt: img.alt,
        });
      });
    });

    // Pick a random one
    if (allLifestyleImages.length > 0) {
      const randomIndex = Math.floor(Math.random() * allLifestyleImages.length);
      const selectedPhoto = allLifestyleImages[randomIndex];
      if (selectedPhoto) {
        setRandomLifestylePhoto(selectedPhoto);
      }
    }
  }, [selectedFrame.sku]);

  // Calculate bottom weighted extra height
  const bottomWeightedExtra = bottomWeighted ? BOTTOM_WEIGHTED_EXTRA : 0;

  // Calculate preview dimensions using dynamic layout calculation
  // This ensures comics display properly centered and sized in the preview
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // @ts-expect-error - Unused variable kept for potential future use
  const _previewFrameDimensions = useMemo(() => {
    // Return default dimensions if no layout selected yet
    if (!selectedLayout) {
      return {
        width: 16,
        height: 20 + bottomWeightedExtra,
      };
    }

    const dimensions = calculateComicPreviewDimensions(
      selectedLayout,
      selectedFormat,
      MAT_BORDER,
      brassNameplateConfig.enabled
    );

    return {
      width: dimensions.width,
      height: dimensions.height + bottomWeightedExtra,
    };
  }, [selectedLayout, selectedFormat, brassNameplateConfig.enabled, bottomWeightedExtra]);

  // Calculate manufacturing dimensions using exact interior dimension lookup table
  // This provides accurate dimensions for pricing and "Overall Size" display text
  const manufacturingFrameDimensions = useMemo(() => {
    // Return default dimensions if no layout selected yet
    if (!selectedLayout) {
      return {
        width: 16,
        height: 20 + bottomWeightedExtra,
      };
    }

    const dimensions = calculateComicFrameSize(
      selectedLayout,
      selectedFormat,
      MAT_BORDER,
      brassNameplateConfig.enabled
    );

    return {
      width: dimensions.width,
      height: dimensions.height + bottomWeightedExtra,
    };
  }, [selectedLayout, selectedFormat, brassNameplateConfig.enabled, bottomWeightedExtra]);

  // Calculate FIXED container height using MAXIMUM aspect ratio to prevent layout shifts
  // This prevents bouncing when brass plaque is toggled or layout changes
  // Strategy: Reserve space for tallest possible frame so container never resizes
  const previewContainerHeight = useMemo(() => {
    const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 800;
    const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1200;

    // Calculate responsive width (use container width if available, otherwise estimate)
    const availableWidth =
      containerSize.width > 0 ? containerSize.width : Math.min(viewportWidth * 0.94, 600);

    // Use MAXIMUM aspect ratio (tallest frame configuration with plaque)
    // Comics can be quite tall with vertical layouts + plaque
    // Using 2.0 to ensure all layouts fit comfortably
    const maxAspectRatio = 2.0;

    // Calculate height based on maximum aspect ratio
    const calculatedHeight = availableWidth * maxAspectRatio;

    // Clamp height between reasonable bounds
    const minHeight = 220;
    const maxHeight = isMobile ? viewportHeight * 0.65 : viewportHeight * 0.8;

    return Math.max(minHeight, Math.min(calculatedHeight, maxHeight));
  }, [containerSize.width, isMobile]);

  // Get comic covers for preview
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // @ts-expect-error - Unused variable kept for potential future use
  const _comicCovers = useMemo(() => {
    // Return empty array if no layout selected yet
    if (!selectedLayout) {
      return [];
    }

    const layout = getComicLayout(selectedLayout);
    return getCoversForConfig(selectedFormat, selectedLayout, layout.count);
  }, [selectedFormat, selectedLayout, getCoversForConfig]);

  // Get current format details
  const currentFormat = useMemo(() => getComicFormatById(selectedFormat), [selectedFormat]);

  // Get current layout details
  const currentLayout = useMemo(() => {
    // Return null if no layout selected yet
    if (!selectedLayout) {
      return null;
    }
    return getComicLayout(selectedLayout);
  }, [selectedLayout]);

  // Track container WIDTH ONLY for preview scaling (height is fixed to prevent feedback loop)
  // This breaks the oscillation cycle that caused layout cards to bounce when plaque toggled
  useEffect(() => {
    if (!containerRef.current) return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const resizeObserver = new ResizeObserver((entries) => {
      // Debounce to avoid processing every frame
      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        for (const entry of entries) {
          const newWidth = Math.round(entry.contentRect.width);
          // DO NOT track height - it creates a feedback loop with previewContainerHeight

          setContainerSize((prev) => {
            // Tolerance threshold: only update if width change is > 2px
            const widthDiff = Math.abs(newWidth - prev.width);

            if (widthDiff > 2) {
              return { width: newWidth, height: prev.height }; // Keep height stable
            }
            return prev;
          });
        }
      }, 16); // ~60fps, fast enough to feel instant but debounced
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, [selectedLayout]);

  // Get preview state using the hook
  const previewState = useComicPreviewState({
    formatId: selectedFormat,
    layoutId: selectedLayout,
    matBorder: MAT_BORDER,
    matReveal: MAT_REVEAL,
    matType,
    matId: selectedMat.id,
    matInnerId: matType === "double" ? selectedMatInner.id : undefined,
    brassNameplateConfig,
    selectedFrame,
    containerWidth: containerSize.width,
    containerHeight: containerSize.height,
    bottomWeightedExtra,
    getCoversForConfig,
  });

  // Get fullscreen preview state with larger dimensions
  const fullscreenPreviewState = useComicPreviewState({
    formatId: selectedFormat,
    layoutId: selectedLayout,
    matBorder: MAT_BORDER,
    matReveal: MAT_REVEAL,
    matType,
    matId: selectedMat.id,
    matInnerId: matType === "double" ? selectedMatInner.id : undefined,
    brassNameplateConfig,
    selectedFrame,
    containerWidth: typeof window !== "undefined" ? window.innerWidth - 100 : 1000,
    containerHeight: typeof window !== "undefined" ? window.innerHeight - 100 : 800,
    bottomWeightedExtra,
    getCoversForConfig,
  });

  // Get mats filtered by frame size to hide mats that don't have required sheet sizes
  // Hide Terracotta on desktop only (show on mobile)
  const standardMats = useMemo(() => {
    const availableMats = getAvailableMatsForSize(
      manufacturingFrameDimensions.width,
      manufacturingFrameDimensions.height,
      true, // include regular
      false // exclude premium
    );
    // Hide Terracotta on desktop only
    if (!isMobile) {
      return availableMats.filter((mat) => mat.name !== "Terracotta");
    }
    return availableMats;
  }, [manufacturingFrameDimensions.width, manufacturingFrameDimensions.height, isMobile]);

  const premiumMats = useMemo(() => {
    const availableMats = getAvailableMatsForSize(
      manufacturingFrameDimensions.width,
      manufacturingFrameDimensions.height,
      false, // exclude regular
      true // include premium
    );
    return availableMats;
  }, [manufacturingFrameDimensions.width, manufacturingFrameDimensions.height]);

  // Reset mat selection if current mat becomes unavailable due to size change
  useEffect(() => {
    const allAvailableMats = [...standardMats, ...premiumMats];

    // Check if top mat is still available
    const isTopMatAvailable = allAvailableMats.some((mat) => mat.id === selectedMat.id);
    if (!isTopMatAvailable && allAvailableMats.length > 0) {
      // Default to black (mat-2) if available, otherwise first available mat
      const blackMat = allAvailableMats.find((mat) => mat.id === "mat-2");
      if (blackMat) {
        setSelectedMat(blackMat);
      } else if (allAvailableMats[0]) {
        setSelectedMat(allAvailableMats[0]);
      }
    }

    // Check if bottom mat is still available (for double mat)
    if (matType === "double") {
      const isBottomMatAvailable = allAvailableMats.some((mat) => mat.id === selectedMatInner.id);
      if (!isBottomMatAvailable && allAvailableMats.length > 0) {
        // Default to white (mat-1) if available, otherwise first available mat
        const whiteMat = allAvailableMats.find((mat) => mat.id === "mat-1");
        if (whiteMat) {
          setSelectedMatInner(whiteMat);
        } else if (allAvailableMats[0]) {
          setSelectedMatInner(allAvailableMats[0]);
        }
      }
    }
  }, [standardMats, premiumMats, selectedMat.id, selectedMatInner.id, matType]);

  // Reset bottomWeighted when mat is disabled
  useEffect(() => {
    if (matType === "none" && bottomWeighted) {
      setBottomWeighted(false);
    }
  }, [matType, bottomWeighted]);

  // Calculate pricing using the hook
  const pricing = useComicPricing({
    frame: selectedFrame,
    layoutId: selectedLayout,
    formatId: selectedFormat,
    matType,
    matBorder: MAT_BORDER,
    glass: selectedGlass,
    hardware,
    brassPlaqueEnabled: brassNameplateConfig.enabled,
  });

  // Build itemized pricing breakdown for PriceBox
  const priceItems = useMemo((): PriceLineItem[] => {
    const items: PriceLineItem[] = [];

    // Frame base price
    items.push({
      label: "Shadowbox Frame",
      amount: pricing.framePrice,
      testId: "price-frame",
    });

    // Mat surcharge (for multi-opening layouts)
    if (pricing.matPrice > 0 && currentLayout) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      // @ts-expect-error - Unused variable kept for potential future use
      const _additionalOpenings = currentLayout.count - 1;
      items.push({
        label: `Mat Board (${currentLayout.count} openings)`,
        amount: pricing.matPrice,
        testId: "price-mat",
      });
    } else if (matType !== "none") {
      items.push({
        label: matType === "double" ? "Mat Board (double)" : "Mat Board (single)",
        amount: 0,
        isIncluded: true,
        testId: "price-mat",
      });
    }

    // Slab depth modifier (for graded comics)
    if (pricing.slabModifier > 0) {
      items.push({
        label: "Slab Depth Upgrade",
        amount: pricing.slabModifier,
        testId: "price-slab",
      });
    }

    // Glass upgrade
    if (pricing.glassPrice > 0) {
      items.push({
        label: selectedGlass?.name ?? "Standard",
        amount: pricing.glassPrice,
        testId: "price-glass",
      });
    } else {
      items.push({
        label: selectedGlass?.name ?? "Standard",
        amount: 0,
        isIncluded: true,
        testId: "price-glass",
      });
    }

    // Hardware upgrade
    if (pricing.hardwarePrice > 0) {
      items.push({
        label: "Security Hardware",
        amount: pricing.hardwarePrice,
        testId: "price-hardware",
      });
    } else {
      items.push({
        label: "Standard Hardware",
        amount: 0,
        isIncluded: true,
        testId: "price-hardware",
      });
    }

    // Brass plaque
    if (pricing.nameplatePrice > 0) {
      items.push({
        label: "Engraved Brass Nameplate",
        amount: pricing.nameplatePrice,
        testId: "price-nameplate",
      });
    }

    return items;
  }, [pricing, matType, selectedGlass, currentLayout]);

  // Share configuration
  const handleShare = useCallback(() => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied!",
      description: "Design link copied to clipboard",
    });
  }, [toast]);

  // Add to cart handler
  const handleAddToCart = useCallback(async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // @ts-expect-error - Unused variable kept for potential future use
    const _currentFormat = getComicFormatById(selectedFormat);
    const currentLayout = getComicLayout(selectedLayout);

    // Build complete frame specification for cart/checkout
    // manufacturingFrameDimensions already includes bottomWeightedExtra in height calculation
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // @ts-expect-error - Unused variable kept for potential future use
    const _frameSpec = {
      productType: "comic-frame",
      format: selectedFormat,
      layout: selectedLayout,
      frameId: selectedFrame.id,
      frameSku: selectedFrame.sku,
      // Frame dimensions include bottomWeightedExtra for accurate manufacturing
      frameWidth: manufacturingFrameDimensions.width,
      frameHeight: manufacturingFrameDimensions.height,
      // Mat configuration
      matType,
      matColorId: selectedMat.id,
      matInnerColorId: matType === "double" ? selectedMatInner.id : undefined,
      matBorder: MAT_BORDER,
      bottomWeighted, // Include bottom-weighted flag for manufacturing
      // Glass and hardware
      glassTypeId: selectedGlass?.id ?? "standard",
      hardware,
      // Brass nameplate
      brassNameplate: brassNameplateConfig.enabled
        ? {
            line1: brassNameplateConfig.line1,
            line2: brassNameplateConfig.line2,
            line3: brassNameplateConfig.line3,
            font: brassNameplateConfig.font,
            color: brassNameplateConfig.color,
          }
        : undefined,
      // Pricing
      unitPrice: pricing.total,
      quantity,
    };

    toast({
      title: "Added to cart!",
      description: `${quantity}× Comic Frame - ${currentLayout?.displayName || "Custom"} (${manufacturingFrameDimensions.width.toFixed(1)}" × ${manufacturingFrameDimensions.height.toFixed(1)}")`,
    });
  }, [
    quantity,
    selectedLayout,
    selectedFormat,
    selectedFrame,
    manufacturingFrameDimensions,
    matType,
    selectedMat,
    selectedMatInner,
    MAT_BORDER,
    bottomWeighted,
    selectedGlass,
    hardware,
    brassNameplateConfig,
    pricing.total,
    toast,
  ]);

  // Apply preset configuration
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // @ts-expect-error - Unused function kept for potential future use
  const _applyPreset = (presetName: "signature" | "vault") => {
    if (presetName === "signature") {
      // Signature Wall Display preset
      setSelectedFormat("modern-age");
      // Mobile: reset layout to force selection; Desktop: set it directly
      if (isMobile) {
        setSelectedLayout("");
      } else {
        setSelectedLayout("single");
      }
      // Find black frame
      const blackFrame = shadowboxFrames.find((f) => f.name.toLowerCase().includes("black"));
      if (blackFrame) setSelectedFrame(blackFrame);
      setMatType("double");
      // White top mat
      const whiteMat = getMatById("mat-1"); // White
      if (whiteMat) setSelectedMat(whiteMat);
      // Metallic gold bottom mat
      const goldMat = getMatById("mat-11"); // Metallic Gold (premium)
      if (goldMat) setSelectedMatInner(goldMat);
      // UV-protective glass (standard)
      const uvGlass = glassTypes.find((g) => g.id === "standard");
      if (uvGlass) setSelectedGlass(uvGlass);
      // Enable brass plaque
      setBrassNameplateConfig({
        enabled: true,
        line1: "",
        line2: "",
        line3: "",
        font: "georgia",
        color: "brass-black",
        includeFlag: false,
      });
      setHardware("standard");
      setSmartDefaultApplied(null); // Clear smart default banner
      toast({
        title: "Applied Signature Wall Display",
        description: isMobile
          ? "Preset applied. Now choose your layout."
          : "Premium configuration for showcase display",
      });
    } else if (presetName === "vault") {
      // Vault Preservation preset
      setSelectedFormat("slabbed-cgc");
      // Mobile: reset layout to force selection; Desktop: set it directly
      if (isMobile) {
        setSelectedLayout("");
      } else {
        setSelectedLayout("single");
      }
      // Find black frame
      const blackFrame = shadowboxFrames.find((f) => f.name.toLowerCase().includes("black"));
      if (blackFrame) setSelectedFrame(blackFrame);
      setMatType("single");
      // Black mat
      const blackMat = getMatById("mat-3"); // Black
      if (blackMat) setSelectedMat(blackMat);
      // Museum glass (non-glare)
      const museumGlass = glassTypes.find((g) => g.id === "non-glare");
      if (museumGlass) setSelectedGlass(museumGlass);
      // Disable brass plaque
      setBrassNameplateConfig({
        enabled: false,
        line1: "",
        line2: "",
        line3: "",
        font: "georgia",
        color: "brass-black",
        includeFlag: false,
      });
      setHardware("standard");
      setSmartDefaultApplied(null); // Clear smart default banner
      toast({
        title: "Applied Vault Preservation",
        description: isMobile
          ? "Preset applied. Now choose your layout."
          : "Museum-quality protection for graded slabs",
      });
    }
  };

  // Scroll detection for desktop price box expansion - expands when scrolling down page
  useEffect(() => {
    if (isMobile) return;

    const handleScroll = () => {
      const scrolled = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      const scrollPercentage = (scrolled + windowHeight) / docHeight;

      // Expand when scrolled past 50% of page
      _setPriceBoxExpanded(scrollPercentage > 0.5);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial state

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMobile]);

  // Default layout - set 'single' for all users if no selection (ensures preview on mobile)
  useEffect(() => {
    // Both desktop and mobile users get auto-default layout to ensure preview shows immediately
    if (!selectedLayout && !urlParams.get("layout")) {
      setSelectedLayout("single");
    }
  }, [selectedLayout, urlParams]);

  // Smart defaults system - auto-apply settings based on format selection
  useEffect(() => {
    // Skip if this is the initial load with URL params (don't override user's saved config)
    if (urlParams.get("format")) return;

    // Skip if smart defaults were just applied for this format (prevent infinite loops)
    if (smartDefaultApplied === selectedFormat) return;

    // Apply smart defaults based on format
    // All formats now use consistent mat defaults: Black (VB221/mat-2) top + White (VB222/mat-1) bottom
    if (selectedFormat === "modern-age") {
      // Auto-select single comic layout for all users (desktop + mobile)
      setSelectedLayout("single");
      // Use Matte Black Standard Depth (SKU 8693) as default
      const blackFrame =
        shadowboxFrames.find((f) => f.sku === "8693") ||
        shadowboxFrames.find((f) => f.name.toLowerCase().includes("black"));
      if (blackFrame) setSelectedFrame(blackFrame);
      setMatType("double");
      const blackMat = getMatById("mat-2"); // Black VB221
      if (blackMat) setSelectedMat(blackMat);
      const whiteMat = getMatById("mat-1"); // White VB222
      if (whiteMat) setSelectedMatInner(whiteMat);
      setSmartDefaultApplied("modern-age");
    } else if (
      selectedFormat === "golden-age" ||
      selectedFormat === "silver-age" ||
      selectedFormat === "bronze-age"
    ) {
      // Vintage formats - auto-select single comic layout for all users
      setSelectedLayout("single");
      // Use Matte Black Standard Depth (SKU 8693) as default for all formats
      const blackFrame =
        shadowboxFrames.find((f) => f.sku === "8693") ||
        shadowboxFrames.find((f) => f.name.toLowerCase().includes("black"));
      if (blackFrame) setSelectedFrame(blackFrame);
      setMatType("double");
      const blackMat = getMatById("mat-2"); // Black VB221
      if (blackMat) setSelectedMat(blackMat);
      const whiteMat = getMatById("mat-1"); // White VB222
      if (whiteMat) setSelectedMatInner(whiteMat);
      setSmartDefaultApplied(selectedFormat);
    } else if (selectedFormat === "slabbed-cgc") {
      // Slabbed format - auto-select single comic layout for all users
      setSelectedLayout("single");
      // Use Matte Black Standard Depth (SKU 8693) as default
      const blackFrame =
        shadowboxFrames.find((f) => f.sku === "8693") ||
        shadowboxFrames.find((f) => f.name.toLowerCase().includes("black"));
      if (blackFrame) setSelectedFrame(blackFrame);
      setMatType("double");
      const blackMat = getMatById("mat-2"); // Black VB221
      if (blackMat) setSelectedMat(blackMat);
      const whiteMat = getMatById("mat-1"); // White VB222
      if (whiteMat) setSelectedMatInner(whiteMat);
      setSmartDefaultApplied("slabbed-cgc");
    }
  }, [selectedFormat, smartDefaultApplied, isMobile, urlParams]);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background pb-24 lg:pb-0">
        {/* Mobile Header */}
        {isMobile && (
          <div className="lg:hidden border-b bg-card/50 sticky top-0 z-40">
            <div className="px-4 py-3">
              <h1 className="text-lg font-bold">Comic Frame Designer</h1>
            </div>
          </div>
        )}

        <div className="container mx-auto px-4 py-6 lg:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Left: Preview - Hidden on mobile when viewing controls */}
            <div
              className={`${isMobile && mobileView === "controls" ? "hidden" : ""} lg:sticky lg:top-[132px] lg:self-start`}
            >
              <Card ref={previewCardRef} className="p-6" data-testid="card-preview">
                <div className="space-y-4">
                  {/* Frame Preview */}
                  <div
                    ref={containerRef}
                    className="bg-muted/50 rounded p-2 md:p-4 flex items-center justify-center relative group"
                    style={{ minHeight: `${previewContainerHeight}px` }}
                    data-testid="preview-container"
                  >
                    {/* Desktop Fullscreen button */}
                    {!isMobile && (
                      <div className="absolute top-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setFullscreenImage("preview");
                            setShowFullscreenPreview(true);
                          }}
                          className="bg-background/90 hover:bg-background p-2 rounded-md shadow-lg hover-elevate active-elevate-2"
                          data-testid="button-expand-preview"
                        >
                          <Maximize className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                    {selectedLayout ? (
                      <ComicPreviewCanvas
                        framePhotos={previewState.framePhotos}
                        selectedFrame={selectedFrame}
                        topMatColor={selectedMat}
                        bottomMatColor={matType === "double" ? selectedMatInner : selectedMat}
                        backingColor={selectedMat}
                        matType={matType}
                        layout={selectedLayout}
                        formatId={selectedFormat}
                        matBorder={MAT_BORDER}
                        manifest={previewState.manifest}
                        previewScale={previewState.previewScale}
                        previewWidth={previewState.previewWidth}
                        previewHeight={previewState.previewHeight}
                        frameFaceWidth={previewState.frameFaceWidth}
                        isMobile={previewState.isMobile}
                        comicCovers={previewState.comicCovers}
                        brassNameplateConfig={brassNameplateConfig}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full min-h-[400px]">
                        <div className="text-center p-8">
                          <LayoutGrid className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                          <p className="text-lg font-medium text-muted-foreground">
                            Select a layout to preview your frame
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Dimensions Box */}
                  <div
                    className="p-3 bg-muted/50 rounded-md space-y-0.5"
                    data-testid="dimensions-box"
                  >
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-medium">
                        Finished Size:{" "}
                        <span className="text-primary">
                          {manufacturingFrameDimensions.width.toFixed(1)}&quot; ×{" "}
                          {manufacturingFrameDimensions.height.toFixed(1)}&quot;
                        </span>
                      </p>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>
                            Outer frame dimensions including moulding. Interior dimensions
                            accommodate your comics with the selected mat border.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {currentFormat
                        ? `Comic: ${currentFormat.comicWidth}&quot; × ${currentFormat.comicHeight}&quot;`
                        : ""}{" "}
                      • Mat Border: {MAT_BORDER}&quot;
                    </p>
                  </div>

                  {/* Sample Image Caption */}
                  <p className="text-xs text-muted-foreground text-center">
                    Sample image. Not included with purchase.
                  </p>

                  {/* Frame Details - 3 Small Boxes */}
                  <div className="grid grid-cols-3 gap-2">
                    {/* Corner Detail */}
                    {(() => {
                      const cornerImage = selectedFrame.alternateImages?.find(
                        (img: AlternateImage) =>
                          img.type === "corner" && img.url.includes("corner_a")
                      );
                      return cornerImage ? (
                        <button
                          onClick={() => {
                            setFullscreenImage("corner");
                            setShowFullscreenPreview(true);
                          }}
                          className="aspect-square rounded-md border overflow-hidden bg-background hover-elevate active-elevate-2"
                        >
                          <img
                            src={cornerImage.url}
                            alt={cornerImage.alt || `${selectedFrame.name} corner detail`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ) : framePhotos.cornerUrl ? (
                        <button
                          onClick={() => {
                            setFullscreenImage("corner");
                            setShowFullscreenPreview(true);
                          }}
                          className="aspect-square rounded-md border overflow-hidden bg-background hover-elevate active-elevate-2"
                        >
                          <img
                            src={framePhotos.cornerUrl}
                            alt="Frame corner detail"
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ) : (
                        <div className="aspect-square rounded-md border-2 border-dashed border-border flex items-center justify-center bg-muted/30">
                          <div className="text-center p-2">
                            <p className="text-xs text-muted-foreground">Frame Corner</p>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Profile View */}
                    {(() => {
                      const profileImage = selectedFrame.alternateImages?.find(
                        (img: AlternateImage) => img.type === "profile"
                      );
                      return profileImage ? (
                        <button
                          onClick={() => {
                            setFullscreenImage("profile");
                            setShowFullscreenPreview(true);
                          }}
                          className="aspect-square rounded-md border overflow-hidden bg-background hover-elevate active-elevate-2"
                        >
                          <img
                            src={profileImage.url}
                            alt={profileImage.alt || `${selectedFrame.name} profile`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ) : framePhotos.profileUrl ? (
                        <button
                          onClick={() => {
                            setFullscreenImage("profile");
                            setShowFullscreenPreview(true);
                          }}
                          className="aspect-square rounded-md border overflow-hidden bg-background hover-elevate active-elevate-2"
                        >
                          <img
                            src={framePhotos.profileUrl}
                            alt="Frame profile view"
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ) : (
                        <div className="aspect-square rounded-md border-2 border-dashed border-border flex items-center justify-center bg-muted/30">
                          <div className="text-center p-2">
                            <p className="text-xs text-muted-foreground">Profile</p>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Random Lifestyle Photo */}
                    {randomLifestylePhoto.url ? (
                      <button
                        onClick={() => {
                          setFullscreenImage("lifestyle");
                          setShowFullscreenPreview(true);
                        }}
                        className="aspect-square rounded-md border overflow-hidden bg-background hover-elevate active-elevate-2"
                      >
                        <img
                          src={randomLifestylePhoto.url}
                          alt={randomLifestylePhoto.alt}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ) : (
                      <div className="aspect-square rounded-md border-2 border-dashed border-border flex items-center justify-center bg-muted/30">
                        <div className="text-center p-2">
                          <p className="text-xs text-muted-foreground">Lifestyle</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Trust Badges - Hidden on mobile */}
                  {!isMobile && <TrustBadges />}

                  {/* Copyright Disclaimer */}
                  <div className="pt-4 mt-4 border-t">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      All comic book covers displayed are for illustrative purposes only to show how
                      our frames look in use. We do not sell or reproduce any comic book artwork.
                      All characters, logos, and artwork remain the property of their respective
                      copyright holders and are used here under fair use for demonstration.
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right: Controls - Hidden on mobile when viewing preview */}
            <div
              ref={customizationPaneRef}
              className={`${isMobile && mobileView === "preview" ? "hidden" : ""} space-y-6`}
            >
              <h2 ref={controlsHeadingRef} className="text-2xl font-bold mb-2 lg:hidden">
                Customize Your Frame
              </h2>
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-4 hidden lg:block">
                  Configure Your Comic Frame
                </h2>

                {/* Consolidated Accordions for Better Mobile Flow */}
                <Accordion
                  type="multiple"
                  value={accordionValue}
                  onValueChange={setAccordionValue}
                  className="space-y-4"
                >
                  {/* Section 1: Comic Format & Layout */}
                  <AccordionItem
                    value="comic-format-layout"
                    className="border rounded-lg px-4 lg:px-6"
                  >
                    <AccordionTrigger
                      className="text-base font-semibold hover:no-underline py-4"
                      data-testid="accordion-setup"
                    >
                      Comic Format & Layout
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                      {/* Format Selection - Hero Cards */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Label className="text-base font-semibold">Comic Era & Format</Label>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p>
                                Select your comic&apos;s era to ensure proper sizing. Different eras
                                have slightly different dimensions.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </div>

                        {/* Mobile: Compact 3-column Chip Selector (all eras accessible) */}
                        <div className="lg:hidden grid grid-cols-3 gap-1.5">
                          <Button
                            type="button"
                            variant={selectedFormat === "modern-age" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedFormat("modern-age")}
                            className="flex-col h-auto py-1.5 px-2"
                            aria-pressed={selectedFormat === "modern-age"}
                            data-testid="button-format-modern-mobile"
                          >
                            <span className="text-xs font-semibold leading-tight">Modern</span>
                            <span className="text-[0.6rem] opacity-70">1985+</span>
                          </Button>
                          <Button
                            type="button"
                            variant={selectedFormat === "golden-age" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedFormat("golden-age")}
                            className="flex-col h-auto py-1.5 px-2"
                            aria-pressed={selectedFormat === "golden-age"}
                            data-testid="button-format-golden-mobile"
                          >
                            <span className="text-xs font-semibold leading-tight">Golden</span>
                            <span className="text-[0.6rem] opacity-70">1938-56</span>
                          </Button>
                          <Button
                            type="button"
                            variant={selectedFormat === "silver-age" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedFormat("silver-age")}
                            className="flex-col h-auto py-1.5 px-2"
                            aria-pressed={selectedFormat === "silver-age"}
                            data-testid="button-format-silver-mobile"
                          >
                            <span className="text-xs font-semibold leading-tight">Silver</span>
                            <span className="text-[0.6rem] opacity-70">1956-70</span>
                          </Button>
                          <Button
                            type="button"
                            variant={selectedFormat === "bronze-age" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedFormat("bronze-age")}
                            className="flex-col h-auto py-1.5 px-2"
                            aria-pressed={selectedFormat === "bronze-age"}
                            data-testid="button-format-bronze-mobile"
                          >
                            <span className="text-xs font-semibold leading-tight">Bronze</span>
                            <span className="text-[0.6rem] opacity-70">1970-85</span>
                          </Button>
                          <Button
                            type="button"
                            variant={selectedFormat === "slabbed-cgc" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedFormat("slabbed-cgc")}
                            className="flex-col h-auto py-1.5 px-2 col-span-2"
                            aria-pressed={selectedFormat === "slabbed-cgc"}
                            data-testid="button-format-slabbed-mobile"
                          >
                            <span className="text-xs font-semibold leading-tight">
                              Graded Slabs
                            </span>
                            <span className="text-[0.6rem] opacity-70">CGC, PGX, CBCS</span>
                          </Button>
                        </div>

                        {/* Measurement Reminder */}
                        <div className="p-3 bg-muted/50 rounded-lg border border-border/50 text-sm text-muted-foreground italic">
                          <p>Please measure your comic before ordering.</p>
                          <p className="mt-1">
                            Comic sizes can vary, even from the same era. A quick check with a ruler
                            ensures your frame fits perfectly.
                          </p>
                        </div>

                        {/* Desktop: Hero Cards - Simplified Choice */}
                        <div className="hidden lg:grid grid-cols-1 gap-3">
                          {/* Modern (1985-Present) */}
                          <button
                            onClick={() => setSelectedFormat("modern-age")}
                            className={`text-left p-4 rounded-lg border-2 transition-all hover-elevate active-elevate-2 ${
                              selectedFormat === "modern-age"
                                ? "border-primary bg-primary/5"
                                : "border-border bg-card"
                            }`}
                            data-testid="button-format-modern"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-semibold flex items-center gap-2">
                                  <BookOpen className="w-4 h-4" />
                                  Modern (1985–Present)
                                </h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                  Contemporary comics and graphic novels
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  6.625&quot; × 10.25&quot;
                                </p>
                              </div>
                              <Badge variant="default" className="text-xs">
                                Most Popular
                              </Badge>
                            </div>
                          </button>

                          {/* Vintage Eras (Golden/Silver/Bronze) */}
                          {["golden-age", "silver-age", "bronze-age"].map((formatId) => {
                            const format = COMIC_FORMATS.find((f) => f.id === formatId);
                            if (!format) return null;
                            return (
                              <button
                                key={formatId}
                                onClick={() => setSelectedFormat(formatId)}
                                className={`text-left p-4 rounded-lg border-2 transition-all hover-elevate active-elevate-2 ${
                                  selectedFormat === formatId
                                    ? "border-primary bg-primary/5"
                                    : "border-border bg-card"
                                }`}
                                data-testid={`button-format-${formatId}`}
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h4 className="font-semibold flex items-center gap-2">
                                      <Award className="w-4 h-4" />
                                      {format.displayName}
                                    </h4>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {format.notes}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {format.comicWidth}&quot; × {format.comicHeight}&quot;
                                    </p>
                                  </div>
                                  {formatId === "golden-age" && (
                                    <Badge variant="secondary" className="text-xs">
                                      Collector&apos;s Choice
                                    </Badge>
                                  )}
                                </div>
                              </button>
                            );
                          })}

                          {/* Slabbed/Graded */}
                          <button
                            onClick={() => setSelectedFormat("slabbed-cgc")}
                            className={`text-left p-4 rounded-lg border-2 transition-all hover-elevate active-elevate-2 ${
                              selectedFormat === "slabbed-cgc"
                                ? "border-primary bg-primary/5"
                                : "border-border bg-card"
                            }`}
                            data-testid="button-format-slabbed"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-semibold flex items-center gap-2">
                                  <Shield className="w-4 h-4" />
                                  Slabbed/Graded
                                </h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                  CGC, CBCS, PGX graded comics
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  8.25&quot; × 13.0&quot; × 0.75&quot; depth
                                </p>
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                Premium Protection
                              </Badge>
                            </div>
                          </button>
                        </div>
                      </div>

                      <Separator />

                      {/* Layout Selection */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Label className="text-base font-semibold">Layout</Label>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p>
                                Choose how many comics to display in your frame. Single comic
                                layouts are most popular for showcasing valuable issues.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Choose how many comics to display
                        </p>
                        <ComicLayoutGallery
                          selectedLayout={selectedLayout}
                          onLayoutChange={setSelectedLayout}
                          compact={isMobile}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Section 2: Frame Style */}
                  <AccordionItem value="frame-style" className="border rounded-lg px-4 lg:px-6">
                    <AccordionTrigger
                      className="text-base font-semibold hover:no-underline py-4"
                      data-testid="accordion-frame-style"
                    >
                      Frame Style
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4">
                      <div className="mb-3 p-2.5 bg-muted/50 rounded-md text-xs text-muted-foreground">
                        <p>
                          <strong className="text-foreground">Shadowbox Depth:</strong> How deep the
                          frame is
                        </p>
                        <p className="mt-1">
                          <strong className="text-foreground">Moulding Width:</strong> The width of
                          the frame
                        </p>
                      </div>
                      <div className="lg:max-h-[400px] lg:overflow-y-auto lg:pr-2">
                        <div className="grid grid-cols-2 gap-2">
                          {shadowboxFrames.map((frame) => (
                            <button
                              key={frame.id}
                              onClick={() => setSelectedFrame(frame)}
                              className={`p-3 rounded-md border-2 text-left hover-elevate active-elevate-2 ${
                                selectedFrame.id === frame.id
                                  ? "border-primary bg-primary/5"
                                  : "border-border"
                              }`}
                              data-testid={`button-frame-${frame.id}`}
                            >
                              {frame.thumbnail ? (
                                <div className="h-12 w-full rounded mb-2 overflow-hidden">
                                  <img
                                    src={getSharedAssetUrl(
                                      frame.thumbnail.startsWith("/")
                                        ? frame.thumbnail.slice(1)
                                        : frame.thumbnail
                                    )}
                                    alt={frame.name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="h-12 w-full rounded mb-2 flex items-center justify-center bg-muted">
                                  <span className="text-xs text-muted-foreground">No preview</span>
                                </div>
                              )}
                              <p className="font-medium text-xs lg:text-sm">{frame.name}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {frame.mouldingWidth}&quot; wide × {frame.usableDepth}&quot; deep
                              </p>
                            </button>
                          ))}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Section 3: Mat Color Options */}
                  <AccordionItem value="mat-options" className="border rounded-lg px-4 lg:px-6">
                    <AccordionTrigger
                      className="text-base font-semibold hover:no-underline py-4"
                      data-testid="accordion-mat-options"
                    >
                      Mat Color Options
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4">
                      <div className="space-y-4">
                        {/* Mat Type Selection */}
                        <div className="grid grid-cols-2 gap-2">
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

                        {/* Bottom Weighted Matting */}
                        <BottomWeightedMatting
                          checked={bottomWeighted}
                          onCheckedChange={setBottomWeighted}
                          testIdPrefix="comic"
                        />

                        {/* Top Mat Color */}
                        <div className="space-y-3">
                          {matType === "double" ? (
                            <Label className="text-base font-semibold">
                              Top Mat Color: {selectedMat.name}
                            </Label>
                          ) : (
                            <Label>Mat Color: {selectedMat.name}</Label>
                          )}

                          <ColorSwatchesWithSeparator
                            standardColors={standardMats}
                            premiumColors={premiumMats}
                            selectedId={selectedMat.id}
                            onSelect={setSelectedMat}
                            testIdPrefix="mat"
                          />
                        </div>

                        {/* Bottom Mat Color (only for double mat) */}
                        {matType === "double" && (
                          <>
                            <Separator className="my-6" />
                            <div className="space-y-3">
                              <Label className="text-base font-semibold">
                                Bottom Mat Color: {selectedMatInner.name}
                              </Label>

                              <ColorSwatchesWithSeparator
                                standardColors={standardMats}
                                premiumColors={premiumMats}
                                selectedId={selectedMatInner.id}
                                onSelect={setSelectedMatInner}
                                testIdPrefix="bottom-mat"
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Section 4: Brass Nameplate */}
                  <AccordionItem value="nameplate" className="border rounded-lg px-4 lg:px-6">
                    <AccordionTrigger
                      className="text-base font-semibold hover:no-underline py-4"
                      data-testid="accordion-nameplate"
                    >
                      Brass Nameplate
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4">
                      <BrassNameplateSection
                        config={brassNameplateConfig}
                        onChange={setBrassNameplateConfig}
                        embedded={true}
                      />
                    </AccordionContent>
                  </AccordionItem>

                  {/* Section 5: Glazing Type */}
                  <AccordionItem value="glazing" className="border rounded-lg px-4 lg:px-6">
                    <AccordionTrigger
                      className="text-base font-semibold hover:no-underline py-4"
                      data-testid="accordion-glazing"
                    >
                      Glazing Type
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4">
                      <RadioGroup
                        value={selectedGlass?.id ?? glassTypes[0]?.id ?? "standard"}
                        onValueChange={(id) => {
                          const glass = glassTypes.find((g) => g.id === id) || glassTypes[0];
                          if (glass) {
                            setSelectedGlass(glass);
                          }
                        }}
                      >
                        <div className="flex flex-col md:flex-row flex-wrap gap-2">
                          {glassTypes.map((glass) => (
                            <div
                              key={glass.id}
                              className="flex items-center space-x-3 flex-1 min-w-[200px]"
                            >
                              <RadioGroupItem
                                value={glass.id}
                                id={`glass-${glass.id}`}
                                className="h-5 w-5"
                                data-testid={`radio-glass-${glass.id}`}
                              />
                              <Label
                                htmlFor={`glass-${glass.id}`}
                                className="cursor-pointer text-sm flex-1"
                              >
                                {glass.name}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Section 6: Hanging Hardware */}
                  <AccordionItem value="hardware" className="border rounded-lg px-4 lg:px-6">
                    <AccordionTrigger
                      className="text-base font-semibold hover:no-underline py-4"
                      data-testid="accordion-hardware"
                    >
                      Hanging Hardware
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4">
                      <HangingHardwareSection
                        hardwareType={hardware}
                        setHardwareType={setHardware}
                        frameWidth={manufacturingFrameDimensions.width}
                        frameHeight={manufacturingFrameDimensions.height}
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </Card>

              {/* Desktop Sticky Price Box */}
              <PriceBox
                totalPrice={pricing.total}
                quantity={quantity}
                onQuantityChange={setQuantity}
                onAddToCart={handleAddToCart}
                onCopyLink={handleShare}
                priceItems={priceItems}
                testIdPrefix="comic-"
              />
            </div>
          </div>

          {/* Floating Toggle Button (Mobile Only) - CSS visibility pattern */}
          {!embedded && (
            <Button
              size="lg"
              className={`fixed bottom-20 right-6 z-[60] lg:hidden shadow-lg rounded-full h-14 px-6 ${
                showMobileBar ? "visible" : "invisible pointer-events-none"
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
          )}

          {/* Share Dialog */}
          <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share Your Configuration</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Shareable Link</Label>
                  <div className="flex gap-2 mt-2">
                    <Input readOnly value={window.location.href} className="flex-1" />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        toast({
                          title: "Link copied!",
                          description: "Share this link to show your configuration",
                        });
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Comic Lifestyle Carousel */}
          <ComicLifestyleCarousel
            onImageClick={(url, alt) => {
              setFullscreenLifestyleUrl(url);
              setFullscreenLifestyleAlt(alt);
              setFullscreenImage("lifestyle");
              setShowFullscreenPreview(true);
            }}
          />
        </div>

        {/* Fullscreen Dialog */}
        <Dialog open={showFullscreenPreview} onOpenChange={setShowFullscreenPreview}>
          <DialogContent className="max-w-[100vw] w-screen h-screen max-h-screen p-0 border-0">
            <DialogHeader className="sr-only">
              <DialogTitle>
                {fullscreenImage === "preview" && "Frame Preview"}
                {fullscreenImage === "corner" && "Frame Corner Detail"}
                {fullscreenImage === "profile" && "Frame Profile View"}
                {fullscreenImage === "lifestyle" && "Lifestyle Photo"}
              </DialogTitle>
            </DialogHeader>
            <div className="relative w-full h-full flex items-center justify-center bg-white">
              {fullscreenImage === "preview" && (
                <div className="w-full h-full flex items-center justify-center p-8">
                  <div style={{ filter: "drop-shadow(0 8px 32px rgba(0, 0, 0, 0.15))" }}>
                    <ComicPreviewCanvas
                      framePhotos={fullscreenPreviewState.framePhotos}
                      selectedFrame={selectedFrame}
                      topMatColor={selectedMat}
                      bottomMatColor={matType === "double" ? selectedMatInner : selectedMat}
                      backingColor={selectedMat}
                      matType={matType}
                      layout={selectedLayout}
                      formatId={selectedFormat}
                      matBorder={MAT_BORDER}
                      manifest={fullscreenPreviewState.manifest}
                      previewScale={fullscreenPreviewState.previewScale}
                      previewWidth={fullscreenPreviewState.previewWidth}
                      previewHeight={fullscreenPreviewState.previewHeight}
                      frameFaceWidth={fullscreenPreviewState.frameFaceWidth}
                      isMobile={fullscreenPreviewState.isMobile}
                      comicCovers={fullscreenPreviewState.comicCovers}
                      brassNameplateConfig={brassNameplateConfig}
                    />
                  </div>
                </div>
              )}
              {fullscreenImage === "corner" &&
                (() => {
                  const cornerImage = selectedFrame.alternateImages?.find(
                    (img: AlternateImage) => img.type === "corner" && img.url.includes("corner_a")
                  );
                  const imageUrl = cornerImage?.url || framePhotos.cornerUrl;
                  return imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Frame corner detail"
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : null;
                })()}
              {fullscreenImage === "profile" &&
                (() => {
                  const profileImage = selectedFrame.alternateImages?.find(
                    (img: AlternateImage) => img.type === "profile"
                  );
                  const imageUrl = profileImage?.url || framePhotos.profileUrl;
                  return imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Frame profile view"
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : null;
                })()}
              {fullscreenImage === "lifestyle" && (
                <img
                  src={fullscreenLifestyleUrl || randomLifestylePhoto.url}
                  alt={fullscreenLifestyleAlt || randomLifestylePhoto.alt}
                  className="max-w-full max-h-full object-contain"
                />
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Mobile Sticky Action Bar - Inline Implementation */}
        {isMobile && (
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t shadow-lg lg:hidden">
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-col">
                  <span className="text-lg font-bold" data-testid="comic-mobile-total-price">
                    ${(pricing.total * quantity).toFixed(2)}
                  </span>
                  {quantity > 1 && (
                    <span className="text-xs text-muted-foreground">
                      ${pricing.total.toFixed(2)} each
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <QuantitySelector
                    value={quantity}
                    onChange={setQuantity}
                    className="w-14 h-7 text-xs text-center p-0"
                    testId="comic-mobile-quantity"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleShare}
                    className="h-11 w-11"
                    data-testid="comic-mobile-copy-link"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={handleAddToCart}
                    className="flex-1 text-xs min-w-0 min-h-11"
                    data-testid="comic-mobile-add-to-cart"
                  >
                    <ShoppingCart className="h-4 w-4 mr-1.5" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
