"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Copy, Maximize, ShoppingCart, Eye, Settings, LayoutGrid, Info, Ruler } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Alert, AlertDescription } from "../ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { QuantitySelector } from "../ui/quantity-selector";
import { PriceBox } from "../ui/PriceBox";
import type { PriceLineItem } from "../ui/PriceBox";
import { useToast } from "../../hooks/use-toast";
import {
  getFramesByCategory,
  getGlassTypes,
  getSharedAssetUrl,
  getStoreBaseAssetUrl,
} from "@framecraft/core";
import { useIsMobile, useMobileViewToggle } from "@framecraft/core";
import type { FrameStyle } from "@framecraft/types";
import { ALL_MATS, getMatById, getAvailableMatsForSize, type Mat } from "@framecraft/config";
import { ColorSwatchesWithSeparator } from "../ui/ColorSwatches";
import { BrassNameplateSection } from "../brass-nameplate/BrassNameplateSection";
import type { BrassNameplateConfig } from "@framecraft/types";
import { MAGAZINE_SIZES, getMagazineSizeById, type MagazineSize } from "@framecraft/core";
import {
  MAGAZINE_LAYOUTS,
  getMagazineLayout,
  calculateMagazineFrameSize,
  getAvailableLayoutsForSize,
  type MagazineLayoutType,
} from "@framecraft/core";
import { getMagazineCoversForConfig } from "@framecraft/core";
import { MagazinePreviewCanvas, useMagazinePreviewState } from "./MagazinePreviewCanvas";
import { useMagazinePricing } from "@framecraft/core";
import { MagazineLayoutGallery } from "./MagazineLayoutGallery";
import { TrustBadges } from "../marketing/TrustBadges";
import { MagazineLifestyleCarousel, MAGAZINE_LIFESTYLE_IMAGES } from "./MagazineLifestyleCarousel";
import { HangingHardwareSection } from "./shared/HangingHardwareSection";
import { BottomWeightedMatting } from "./shared/BottomWeightedMatting";
import { getMagazinesForTooltip } from "@framecraft/core";

// Get product data from services
const shadowboxFrames = getFramesByCategory("shadowbox");
const allGlassTypes = getGlassTypes();
// Filter to only Regular and Non-glare for magazine frames
const glassTypes = allGlassTypes.filter((g) => g.id === "standard" || g.id === "non-glare");

interface MagazineFrameDesignerProps {
  defaultFrameId?: string;
  embedded?: boolean;
}

export function MagazineFrameDesigner({
  defaultFrameId,
  embedded = false,
}: MagazineFrameDesignerProps) {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { mobileView, setMobileView, showMobileBar, previewCardRef, controlsHeadingRef } =
    useMobileViewToggle({ isMobile });

  // Controlled accordion state - all sections expanded by default
  const [accordionValue, setAccordionValue] = useState<string[]>([
    "magazine-size-layout",
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

  // URL parameters (SSR-safe)
  const urlParams = useMemo(
    () =>
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search)
        : new URLSearchParams(),
    []
  );

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
  const [selectedSize, setSelectedSize] = useState<string>(() => {
    return urlParams.get("format") || "standard-8x105";
  });

  // Custom size state
  const [useCustomSize, setUseCustomSize] = useState<boolean>(() => {
    return urlParams.get("customSize") === "true";
  });
  const [customWidth, setCustomWidth] = useState<string>(() => {
    return urlParams.get("customWidth") || "8";
  });
  const [customHeight, setCustomHeight] = useState<string>(() => {
    return urlParams.get("customHeight") || "10";
  });

  // Listen for URL changes (popstate events) to update format selection
  useEffect(() => {
    const handlePopState = () => {
      const newParams = new URLSearchParams(window.location.search);
      const newFormat = newParams.get("format");
      if (newFormat && newFormat !== selectedSize) {
        setSelectedSize(newFormat);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [selectedSize]);

  const [selectedLayout, setSelectedLayout] = useState<MagazineLayoutType>(() => {
    const urlLayout = urlParams.get("layout");
    if (urlLayout && MAGAZINE_LAYOUTS.find((l) => l.id === urlLayout)) {
      return urlLayout as MagazineLayoutType;
    }
    // Start with empty string - desktop will get default via useEffect
    return "";
  });

  const [selectedFrame, setSelectedFrame] = useState<FrameStyle>(
    () => initialFrame ?? shadowboxFrames[0]!
  );

  // Mat configuration - defaults: White VB222 top, Black VB221 bottom
  const [selectedMat, setSelectedMat] = useState<Mat>(() => {
    const urlMat = urlParams.get("mat");
    return (urlMat ? getMatById(urlMat) : getMatById("mat-1")) ?? ALL_MATS[0]!; // White VB222
  });

  const [selectedMatInner, setSelectedMatInner] = useState<Mat>(() => {
    const urlMatInner = urlParams.get("matInner");
    return (urlMatInner ? getMatById(urlMatInner) : getMatById("mat-2")) ?? ALL_MATS[1]!; // Black VB221
  });

  const [matType, setMatType] = useState<"none" | "single" | "double">(() => {
    const urlMatType = urlParams.get("matType") as "none" | "single" | "double";
    return urlMatType || "single";
  });

  const [bottomWeighted, setBottomWeighted] = useState(() => {
    return urlParams.get("bottomWeighted") === "true";
  });

  // Fixed mat dimensions (not user-adjustable for magazine frames)
  const MAT_BORDER = 2.0; // inches
  const MAT_REVEAL = 0.25; // inches

  // Glazing and hardware
  const [selectedGlass, setSelectedGlass] = useState(() => {
    const urlGlass = urlParams.get("glass");
    return urlGlass ? glassTypes.find((g) => g.id === urlGlass) || glassTypes[0] : glassTypes[0];
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
      includeFlag: false, // No flag for magazine frames
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
        includeFlag: false, // Always false for magazine frames
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
  const [, _setPriceBoxExpanded] = useState(false);
  const customizationPaneRef = useRef<HTMLDivElement>(null);

  // New UX improvement states
  const [smartDefaultApplied, setSmartDefaultApplied] = useState<string | null>(null);
  const [, _setAdvancedOptionsExpanded] = useState(false);

  // Phase 2 Mobile Enhancement states
  const [, _setMatPresetSelected] = useState<string | null>(null);
  const [, _setShowCustomMatColors] = useState(false);
  const [, _setShowDimensionsOverlay] = useState(false);

  // Filter available layouts based on selected magazine size and 32×40" mat sheet constraint
  const availableLayouts = useMemo(() => {
    return getAvailableLayoutsForSize(selectedSize, MAT_BORDER);
  }, [selectedSize, MAT_BORDER]);

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  // Initialize with viewport-based width to avoid tiny previews on mobile
  const [containerSize, setContainerSize] = useState(() => {
    const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 400;
    // Use 90% of viewport width as initial estimate, with minimum of 320px
    const initialWidth = Math.max(320, Math.min(viewportWidth * 0.9, 600));
    return { width: initialWidth, height: 400 };
  });

  // Reset layout if it becomes unavailable when magazine size changes
  useEffect(() => {
    // Skip if no layout is selected (initial state)
    if (!selectedLayout) return;

    // Check if currently selected layout is still available
    const isLayoutAvailable = availableLayouts.some((layout) => layout.id === selectedLayout);

    // If not available, reset to 'single' or first available layout
    if (!isLayoutAvailable) {
      const singleLayout = availableLayouts.find((l) => l.id === "single");
      const fallbackLayout = singleLayout || availableLayouts[0];

      if (fallbackLayout) {
        setSelectedLayout(fallbackLayout.id);

        // Show toast to inform user
        toast({
          title: "Layout Changed",
          description: `The selected layout is not available for this magazine size. Switched to ${fallbackLayout.displayName}.`,
        });
      }
    }
  }, [selectedSize, availableLayouts, selectedLayout, toast]);

  // Calculate manufacturing dimensions using exact interior dimension lookup table
  // This provides accurate dimensions for pricing and "Overall Size" display text
  const bottomWeightedExtra = bottomWeighted ? 0.5 : 0;

  const manufacturingFrameDimensions = useMemo(() => {
    // Return default dimensions if no layout selected yet
    if (!selectedLayout) {
      return {
        width: 16,
        height: 20,
      };
    }

    return calculateMagazineFrameSize(
      selectedLayout,
      selectedSize,
      MAT_BORDER,
      brassNameplateConfig.enabled,
      bottomWeightedExtra
    );
  }, [selectedLayout, selectedSize, brassNameplateConfig.enabled, bottomWeightedExtra]);

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
    // Magazines can be quite tall with vertical layouts + plaque
    // Using 2.0 to ensure all layouts fit comfortably
    const maxAspectRatio = 2.0;

    // Calculate height based on maximum aspect ratio
    const calculatedHeight = availableWidth * maxAspectRatio;

    // Clamp height between reasonable bounds
    const minHeight = 220;
    const maxHeight = isMobile ? viewportHeight * 0.65 : viewportHeight * 0.8;

    return Math.max(minHeight, Math.min(calculatedHeight, maxHeight));
  }, [containerSize.width, isMobile]);

  // Get magazine covers for preview (relative paths from core, map to full CDN URLs)
  const magazineCovers = useMemo(() => {
    if (!selectedLayout) return [];
    const layout = getMagazineLayout(selectedLayout);
    const paths = getMagazineCoversForConfig(selectedSize, selectedLayout, layout.count);
    return paths.map((p) => getSharedAssetUrl(p));
  }, [selectedSize, selectedLayout]);

  // Deterministic first lifestyle photo (avoids hydration mismatch)
  const randomLifestylePhoto = useMemo(
    () => MAGAZINE_LIFESTYLE_IMAGES[0] ?? { url: "", alt: "Magazine display lifestyle photo" },
    []
  );

  // Get current format details
  const currentSize = useMemo(() => {
    if (useCustomSize) {
      const width = parseFloat(customWidth) || 8;
      const height = parseFloat(customHeight) || 10;
      return {
        id: "custom",
        width,
        height,
        description: "Custom Size",
        category: "large" as const,
      } as MagazineSize;
    }
    return getMagazineSizeById(selectedSize);
  }, [selectedSize, useCustomSize, customWidth, customHeight]);

  // Get current layout details
  const currentLayout = useMemo(() => {
    // Return null if no layout selected yet
    if (!selectedLayout) {
      return null;
    }
    return getMagazineLayout(selectedLayout);
  }, [selectedLayout]);

  // Track container WIDTH ONLY for preview scaling (height is fixed to prevent feedback loop)
  // This breaks the oscillation cycle that caused layout cards to bounce when plaque toggled
  useEffect(() => {
    if (!containerRef.current) return;

    // Immediately measure the container on mount/ref attachment
    const initialWidth = Math.round(containerRef.current.getBoundingClientRect().width);
    if (initialWidth > 0) {
      setContainerSize((prev) => ({ width: initialWidth, height: prev.height }));
    }

    let timeoutId: NodeJS.Timeout;

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
  }, []); // Run once on mount

  // Get preview state using the hook
  const previewState = useMagazinePreviewState({
    sizeId: selectedSize,
    layoutId: selectedLayout,
    matBorder: MAT_BORDER,
    matReveal: MAT_REVEAL,
    matType,
    matId: selectedMat.id,
    matInnerId: matType === "double" ? selectedMatInner.id : undefined,
    brassNameplateConfig,
    selectedFrame,
    containerWidth: containerSize.width,
    containerHeight: previewContainerHeight,
    bottomWeighted,
  });

  // Get fullscreen preview state with larger dimensions
  const fullscreenPreviewState = useMagazinePreviewState({
    sizeId: selectedSize,
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
    bottomWeighted,
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
      const fallback = blackMat ?? allAvailableMats[0];
      if (fallback) setSelectedMat(fallback);
    }

    // Check if bottom mat is still available (for double mat)
    if (matType === "double") {
      const isBottomMatAvailable = allAvailableMats.some((mat) => mat.id === selectedMatInner.id);
      if (!isBottomMatAvailable && allAvailableMats.length > 0) {
        // Default to white (mat-1) if available, otherwise first available mat
        const whiteMat = allAvailableMats.find((mat) => mat.id === "mat-1");
        const fallbackInner = whiteMat ?? allAvailableMats[0];
        if (fallbackInner) setSelectedMatInner(fallbackInner);
      }
    }
  }, [standardMats, premiumMats, selectedMat.id, selectedMatInner.id, matType]);

  // Reset bottomWeighted when mat type is none
  useEffect(() => {
    if (matType === "none" && bottomWeighted) {
      setBottomWeighted(false);
    }
  }, [matType, bottomWeighted]);

  // Calculate pricing using the hook
  const pricing = useMagazinePricing({
    frame: selectedFrame,
    layoutId: selectedLayout,
    sizeId: selectedSize,
    matType,
    matBorder: MAT_BORDER,
    glass: selectedGlass,
    hardware,
    brassPlaqueEnabled: brassNameplateConfig.enabled,
    bottomWeighted,
  });

  // Build itemized pricing for PriceBox
  const priceItems = useMemo<PriceLineItem[]>(() => {
    const items: PriceLineItem[] = [];

    // Frame (includes mat + glazing from new pricing engine v2)
    items.push({
      label: "Shadowbox Frame",
      amount: pricing.framePrice,
      testId: "text-price-frame",
    });

    // Mat surcharge (for multiple openings)
    if (currentLayout && currentLayout.count > 1) {
      items.push({
        label: `Mat Openings (${currentLayout.count - 1} additional)`,
        amount: pricing.matPrice,
        testId: "text-price-mat",
      });
    }

    // Glass (included in frame price from pricing engine)
    items.push({
      label: selectedGlass?.id === "non-glare" ? "Non-Glare Acrylic" : "Standard Acrylic",
      amount: 0,
      isIncluded: true,
      testId: "text-price-glass",
    });

    // Hardware
    if (hardware === "security") {
      items.push({
        label: "Security Hardware",
        amount: pricing.hardwarePrice,
        testId: "text-price-hardware",
      });
    } else {
      items.push({
        label: "Standard Hardware",
        amount: 0,
        isIncluded: true,
        testId: "text-price-hardware",
      });
    }

    // Brass plaque
    if (brassNameplateConfig.enabled) {
      items.push({
        label: "Engraved Brass Nameplate",
        amount: pricing.nameplatePrice,
        testId: "text-price-nameplate",
      });
    }

    return items;
  }, [pricing, currentLayout, selectedGlass, hardware, brassNameplateConfig.enabled]);

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
    const currentLayout = getMagazineLayout(selectedLayout);
    toast({
      title: "Added to cart!",
      description: `${quantity}× Magazine Frame - ${currentLayout?.displayName || "Custom"}`,
    });
  }, [quantity, selectedLayout, toast]);

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
    if (smartDefaultApplied === selectedSize) return;

    // Apply smart defaults based on format
    // All formats now use consistent mat defaults: White (VB222/mat-1) top + Black (VB221/mat-2) bottom
    if (selectedSize === "standard-8x105") {
      // Auto-select single magazine layout for all users (desktop + mobile)
      setSelectedLayout("single");
      const blackFrame = shadowboxFrames.find((f) => f.name.toLowerCase().includes("black"));
      if (blackFrame) setSelectedFrame(blackFrame);
      setMatType("single");
      const whiteMat = getMatById("mat-1"); // White VB222
      if (whiteMat) setSelectedMat(whiteMat);
      const blackMat = getMatById("mat-2"); // Black VB221
      if (blackMat) setSelectedMatInner(blackMat);
      setSmartDefaultApplied("standard-8x105");
    } else if (selectedSize === "standard-letter") {
      // Letter size format - auto-select single magazine layout for all users
      setSelectedLayout("single");
      const blackFrame = shadowboxFrames.find((f) => f.name.toLowerCase().includes("black"));
      if (blackFrame) setSelectedFrame(blackFrame);
      setMatType("single");
      const whiteMat = getMatById("mat-1"); // White VB222
      if (whiteMat) setSelectedMat(whiteMat);
      const blackMat = getMatById("mat-2"); // Black VB221
      if (blackMat) setSelectedMatInner(blackMat);
      setSmartDefaultApplied("standard-letter");
    }
  }, [selectedSize, smartDefaultApplied, isMobile, urlParams]);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background pb-24 lg:pb-0">
        {/* Mobile Header */}
        {isMobile && (
          <div className="lg:hidden border-b bg-card/50 sticky top-0 z-40">
            <div className="px-4 py-3">
              <h1 className="text-lg font-bold">Magazine Frame Designer</h1>
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
                    {/* Fullscreen button - top left */}
                    <div className="absolute top-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setFullscreenImage("preview");
                          setShowFullscreenPreview(true);
                        }}
                        className="bg-background/90 hover:bg-background p-2 rounded-md shadow-lg hover-elevate active-elevate-2"
                        data-testid="button-fullscreen"
                      >
                        <Maximize className="h-5 w-5" />
                      </button>
                    </div>
                    {selectedLayout ? (
                      <MagazinePreviewCanvas
                        framePhotos={previewState.framePhotos}
                        selectedFrame={selectedFrame}
                        topMatColor={selectedMat}
                        bottomMatColor={matType === "double" ? selectedMatInner : selectedMat}
                        backingColor={selectedMat}
                        matType={matType}
                        layout={selectedLayout}
                        sizeId={selectedSize}
                        matBorder={MAT_BORDER}
                        manifest={previewState.manifest}
                        previewScale={previewState.previewScale}
                        previewWidth={previewState.previewWidth}
                        previewHeight={previewState.previewHeight}
                        frameFaceWidth={previewState.frameFaceWidth}
                        isMobile={isMobile}
                        magazineCovers={magazineCovers}
                        brassNameplateConfig={brassNameplateConfig}
                        bottomWeightedExtra={bottomWeightedExtra}
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
                            accommodate your magazines with the selected mat border.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {currentSize
                        ? `Magazine: ${currentSize.width}\u0022 × ${currentSize.height}\u0022`
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
                        (img) => img.type === "corner" && img.url.includes("corner_a")
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
                            src={getStoreBaseAssetUrl(
                              cornerImage.url.startsWith("/")
                                ? cornerImage.url.slice(1)
                                : cornerImage.url
                            )}
                            alt={cornerImage.alt || `${selectedFrame.name} corner detail`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ) : previewState.framePhotos.cornerUrl ? (
                        <button
                          onClick={() => {
                            setFullscreenImage("corner");
                            setShowFullscreenPreview(true);
                          }}
                          className="aspect-square rounded-md border overflow-hidden bg-background hover-elevate active-elevate-2"
                        >
                          <img
                            src={previewState.framePhotos.cornerUrl}
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
                        (img) => img.type === "profile"
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
                            src={getStoreBaseAssetUrl(
                              profileImage.url.startsWith("/")
                                ? profileImage.url.slice(1)
                                : profileImage.url
                            )}
                            alt={profileImage.alt || `${selectedFrame.name} profile`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ) : previewState.framePhotos.profileUrl ? (
                        <button
                          onClick={() => {
                            setFullscreenImage("profile");
                            setShowFullscreenPreview(true);
                          }}
                          className="aspect-square rounded-md border overflow-hidden bg-background hover-elevate active-elevate-2"
                        >
                          <img
                            src={previewState.framePhotos.profileUrl}
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
                      All magazine covers displayed are for illustrative purposes only to show how
                      our frames look in use. We do not sell or reproduce any magazine artwork. All
                      characters, logos, and artwork remain the property of their respective
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
                  Configure Your Magazine Frame
                </h2>

                {/* Consolidated Accordions for Better Mobile Flow */}
                <Accordion
                  type="multiple"
                  value={accordionValue}
                  onValueChange={setAccordionValue}
                  className="space-y-4"
                >
                  {/* Section 1: Magazine Size & Layout */}
                  <AccordionItem
                    value="magazine-size-layout"
                    className="border rounded-lg px-4 lg:px-6"
                  >
                    <AccordionTrigger
                      className="text-base font-semibold hover:no-underline py-4"
                      data-testid="accordion-setup"
                    >
                      Magazine Size & Layout
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                      {/* Magazine Size Selection - Grouped by Category */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Label className="text-base font-semibold">Magazine Size</Label>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p>
                                  Select your magazine size. Choose from compact formats like digest
                                  size (8×10.5&quot;) to larger formats like Life Magazine
                                  (10.5×14&quot;).
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <a
                            href="/magazine-sizes-guide"
                            className="text-xs text-primary hover:underline"
                            data-testid="link-size-guide"
                          >
                            View Size Guide
                          </a>
                        </div>

                        {/* Measurement Instruction */}
                        <div className="flex items-start gap-2 p-3 rounded-md border bg-muted/30">
                          <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-muted-foreground">
                            Measure your magazine before ordering. Lay it flat and measure the full
                            width and height, edge to edge.
                          </p>
                        </div>

                        {/* Mobile: Grouped by Category */}
                        <div className="lg:hidden space-y-4">
                          {/* Compact Sizes */}
                          <div>
                            <h4 className="text-xs font-medium text-muted-foreground mb-2">
                              Compact Formats
                            </h4>
                            <div className="grid grid-cols-2 gap-1.5">
                              {MAGAZINE_SIZES.filter((s) => s.category === "compact").map(
                                (size) => (
                                  <Tooltip key={size.id}>
                                    <TooltipTrigger asChild>
                                      <Button
                                        type="button"
                                        variant={
                                          selectedSize === size.id && !useCustomSize
                                            ? "default"
                                            : "outline"
                                        }
                                        size="sm"
                                        onClick={() => {
                                          setSelectedSize(size.id);
                                          setUseCustomSize(false);
                                        }}
                                        className="flex-col h-auto py-2 px-2"
                                        aria-pressed={selectedSize === size.id}
                                        data-testid={`button-size-${size.id}-mobile`}
                                      >
                                        <span className="text-xs font-semibold leading-tight">
                                          {size.width}×{size.height}&quot;
                                        </span>
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="max-w-[280px] p-3">
                                      <div className="space-y-1.5">
                                        <div className="text-xs font-medium text-foreground mb-2">
                                          Popular magazines in this size:
                                        </div>
                                        {(() => {
                                          const { magazines, hasMore } = getMagazinesForTooltip(
                                            size.id
                                          );
                                          const midpoint = Math.ceil(magazines.length / 2);
                                          const column1 = magazines.slice(0, midpoint);
                                          const column2 = magazines.slice(midpoint);

                                          return (
                                            <>
                                              <div
                                                className={
                                                  magazines.length > 5
                                                    ? "grid grid-cols-2 gap-x-4 gap-y-0.5"
                                                    : "space-y-0.5"
                                                }
                                              >
                                                {magazines.length > 5 ? (
                                                  <>
                                                    <div className="space-y-0.5">
                                                      {column1.map((mag, idx) => (
                                                        <div
                                                          key={idx}
                                                          className="text-xs text-muted-foreground leading-tight"
                                                        >
                                                          • {mag}
                                                        </div>
                                                      ))}
                                                    </div>
                                                    <div className="space-y-0.5">
                                                      {column2.map((mag, idx) => (
                                                        <div
                                                          key={idx}
                                                          className="text-xs text-muted-foreground leading-tight"
                                                        >
                                                          • {mag}
                                                        </div>
                                                      ))}
                                                    </div>
                                                  </>
                                                ) : (
                                                  magazines.map((mag, idx) => (
                                                    <div
                                                      key={idx}
                                                      className="text-xs text-muted-foreground leading-tight"
                                                    >
                                                      • {mag}
                                                    </div>
                                                  ))
                                                )}
                                              </div>
                                              {hasMore && (
                                                <div className="text-xs text-muted-foreground italic mt-1.5 pt-1.5 border-t border-border">
                                                  + more magazines in this size
                                                </div>
                                              )}
                                            </>
                                          );
                                        })()}
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>
                                )
                              )}
                            </div>
                          </div>

                          {/* Standard Sizes */}
                          <div>
                            <h4 className="text-xs font-medium text-muted-foreground mb-2">
                              Standard Formats
                            </h4>
                            <div className="grid grid-cols-2 gap-1.5">
                              {MAGAZINE_SIZES.filter((s) => s.category === "standard").map(
                                (size) => (
                                  <Tooltip key={size.id}>
                                    <TooltipTrigger asChild>
                                      <Button
                                        type="button"
                                        variant={
                                          selectedSize === size.id && !useCustomSize
                                            ? "default"
                                            : "outline"
                                        }
                                        size="sm"
                                        onClick={() => {
                                          setSelectedSize(size.id);
                                          setUseCustomSize(false);
                                        }}
                                        className="flex-col h-auto py-2 px-2"
                                        aria-pressed={selectedSize === size.id}
                                        data-testid={`button-size-${size.id}-mobile`}
                                      >
                                        <span className="text-xs font-semibold leading-tight">
                                          {size.width}×{size.height}&quot;
                                        </span>
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="max-w-[280px] p-3">
                                      <div className="space-y-1.5">
                                        <div className="text-xs font-medium text-foreground mb-2">
                                          Popular magazines in this size:
                                        </div>
                                        {(() => {
                                          const { magazines, hasMore } = getMagazinesForTooltip(
                                            size.id
                                          );
                                          const midpoint = Math.ceil(magazines.length / 2);
                                          const column1 = magazines.slice(0, midpoint);
                                          const column2 = magazines.slice(midpoint);

                                          return (
                                            <>
                                              <div
                                                className={
                                                  magazines.length > 5
                                                    ? "grid grid-cols-2 gap-x-4 gap-y-0.5"
                                                    : "space-y-0.5"
                                                }
                                              >
                                                {magazines.length > 5 ? (
                                                  <>
                                                    <div className="space-y-0.5">
                                                      {column1.map((mag, idx) => (
                                                        <div
                                                          key={idx}
                                                          className="text-xs text-muted-foreground leading-tight"
                                                        >
                                                          • {mag}
                                                        </div>
                                                      ))}
                                                    </div>
                                                    <div className="space-y-0.5">
                                                      {column2.map((mag, idx) => (
                                                        <div
                                                          key={idx}
                                                          className="text-xs text-muted-foreground leading-tight"
                                                        >
                                                          • {mag}
                                                        </div>
                                                      ))}
                                                    </div>
                                                  </>
                                                ) : (
                                                  magazines.map((mag, idx) => (
                                                    <div
                                                      key={idx}
                                                      className="text-xs text-muted-foreground leading-tight"
                                                    >
                                                      • {mag}
                                                    </div>
                                                  ))
                                                )}
                                              </div>
                                              {hasMore && (
                                                <div className="text-xs text-muted-foreground italic mt-1.5 pt-1.5 border-t border-border">
                                                  + more magazines in this size
                                                </div>
                                              )}
                                            </>
                                          );
                                        })()}
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>
                                )
                              )}
                            </div>
                          </div>

                          {/* Large Sizes */}
                          <div>
                            <h4 className="text-xs font-medium text-muted-foreground mb-2">
                              Large Formats
                            </h4>
                            <div className="grid grid-cols-2 gap-1.5">
                              {MAGAZINE_SIZES.filter((s) => s.category === "large").map((size) => (
                                <Tooltip key={size.id}>
                                  <TooltipTrigger asChild>
                                    <Button
                                      type="button"
                                      variant={
                                        selectedSize === size.id && !useCustomSize
                                          ? "default"
                                          : "outline"
                                      }
                                      size="sm"
                                      onClick={() => {
                                        setSelectedSize(size.id);
                                        setUseCustomSize(false);
                                      }}
                                      className="flex-col h-auto py-2 px-2"
                                      aria-pressed={selectedSize === size.id}
                                      data-testid={`button-size-${size.id}-mobile`}
                                    >
                                      <span className="text-xs font-semibold leading-tight">
                                        {size.width}×{size.height}&quot;
                                      </span>
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="max-w-[280px] p-3">
                                    <div className="space-y-1.5">
                                      <div className="text-xs font-medium text-foreground mb-2">
                                        Popular magazines in this size:
                                      </div>
                                      {(() => {
                                        const { magazines, hasMore } = getMagazinesForTooltip(
                                          size.id
                                        );
                                        const midpoint = Math.ceil(magazines.length / 2);
                                        const column1 = magazines.slice(0, midpoint);
                                        const column2 = magazines.slice(midpoint);

                                        return (
                                          <>
                                            <div
                                              className={
                                                magazines.length > 5
                                                  ? "grid grid-cols-2 gap-x-4 gap-y-0.5"
                                                  : "space-y-0.5"
                                              }
                                            >
                                              {magazines.length > 5 ? (
                                                <>
                                                  <div className="space-y-0.5">
                                                    {column1.map((mag, idx) => (
                                                      <div
                                                        key={idx}
                                                        className="text-xs text-muted-foreground leading-tight"
                                                      >
                                                        • {mag}
                                                      </div>
                                                    ))}
                                                  </div>
                                                  <div className="space-y-0.5">
                                                    {column2.map((mag, idx) => (
                                                      <div
                                                        key={idx}
                                                        className="text-xs text-muted-foreground leading-tight"
                                                      >
                                                        • {mag}
                                                      </div>
                                                    ))}
                                                  </div>
                                                </>
                                              ) : (
                                                magazines.map((mag, idx) => (
                                                  <div
                                                    key={idx}
                                                    className="text-xs text-muted-foreground leading-tight"
                                                  >
                                                    • {mag}
                                                  </div>
                                                ))
                                              )}
                                            </div>
                                            {hasMore && (
                                              <div className="text-xs text-muted-foreground italic mt-1.5 pt-1.5 border-t border-border">
                                                + more magazines in this size
                                              </div>
                                            )}
                                          </>
                                        );
                                      })()}
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              ))}

                              {/* Custom Size Button (Mobile) */}
                              <Button
                                type="button"
                                variant={useCustomSize ? "default" : "outline"}
                                size="sm"
                                onClick={() => setUseCustomSize(true)}
                                className="flex-col h-auto py-2 px-2"
                                data-testid="button-size-custom-mobile"
                              >
                                <div className="flex items-center gap-1">
                                  <Ruler className="w-3 h-3" />
                                  <span className="text-xs font-semibold leading-tight">
                                    Custom
                                  </span>
                                </div>
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Custom Size Input Section (Mobile) - Slides out when selected */}
                        {useCustomSize && (
                          <div className="lg:hidden mt-4 p-4 rounded-lg border-2 border-primary bg-primary/5 space-y-3 animate-in slide-in-from-top-2 duration-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Ruler className="w-4 h-4 text-primary" />
                                <h4 className="font-semibold text-sm">Custom Magazine Size</h4>
                              </div>
                            </div>

                            <Alert className="py-2 bg-background">
                              <Info className="h-4 w-4" />
                              <AlertDescription className="text-xs">
                                Measure your magazine before ordering. Lay it flat and measure edge
                                to edge.
                              </AlertDescription>
                            </Alert>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1.5">
                                <Label htmlFor="custom-width-mobile" className="text-xs">
                                  Width (inches)
                                </Label>
                                <Input
                                  id="custom-width-mobile"
                                  type="number"
                                  step="0.25"
                                  min="4"
                                  max="20"
                                  value={customWidth}
                                  onChange={(e) => setCustomWidth(e.target.value)}
                                  placeholder="8"
                                  className="bg-background"
                                  data-testid="input-custom-width-mobile"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <Label htmlFor="custom-height-mobile" className="text-xs">
                                  Height (inches)
                                </Label>
                                <Input
                                  id="custom-height-mobile"
                                  type="number"
                                  step="0.25"
                                  min="4"
                                  max="20"
                                  value={customHeight}
                                  onChange={(e) => setCustomHeight(e.target.value)}
                                  placeholder="10"
                                  className="bg-background"
                                  data-testid="input-custom-height-mobile"
                                />
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Min 4&quot;. Decimals accepted (e.g., 8.5 or 10.25)
                            </p>
                          </div>
                        )}

                        {/* Desktop: Grouped by Category */}
                        <div className="hidden lg:space-y-4 lg:block">
                          {/* Compact Sizes */}
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-2">
                              Compact Formats
                            </h4>
                            <div className="grid grid-cols-2 gap-2">
                              {MAGAZINE_SIZES.filter((s) => s.category === "compact").map(
                                (size) => (
                                  <Tooltip key={size.id}>
                                    <TooltipTrigger asChild>
                                      <button
                                        onClick={() => {
                                          setSelectedSize(size.id);
                                          setUseCustomSize(false);
                                        }}
                                        className={`text-left p-3 rounded-lg border-2 transition-all hover-elevate active-elevate-2 ${
                                          selectedSize === size.id && !useCustomSize
                                            ? "border-primary bg-primary/5"
                                            : "border-border bg-card"
                                        }`}
                                        data-testid={`button-size-${size.id}`}
                                      >
                                        <p className="font-semibold text-sm">
                                          {size.width}×{size.height} inch
                                        </p>
                                      </button>
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className="max-w-[280px] p-3">
                                      <div className="space-y-1.5">
                                        <div className="text-xs font-medium text-foreground mb-2">
                                          Popular magazines in this size:
                                        </div>
                                        {(() => {
                                          const { magazines, hasMore } = getMagazinesForTooltip(
                                            size.id
                                          );
                                          const midpoint = Math.ceil(magazines.length / 2);
                                          const column1 = magazines.slice(0, midpoint);
                                          const column2 = magazines.slice(midpoint);

                                          return (
                                            <>
                                              <div
                                                className={
                                                  magazines.length > 5
                                                    ? "grid grid-cols-2 gap-x-4 gap-y-0.5"
                                                    : "space-y-0.5"
                                                }
                                              >
                                                {magazines.length > 5 ? (
                                                  <>
                                                    <div className="space-y-0.5">
                                                      {column1.map((mag, idx) => (
                                                        <div
                                                          key={idx}
                                                          className="text-xs text-muted-foreground leading-tight"
                                                        >
                                                          • {mag}
                                                        </div>
                                                      ))}
                                                    </div>
                                                    <div className="space-y-0.5">
                                                      {column2.map((mag, idx) => (
                                                        <div
                                                          key={idx}
                                                          className="text-xs text-muted-foreground leading-tight"
                                                        >
                                                          • {mag}
                                                        </div>
                                                      ))}
                                                    </div>
                                                  </>
                                                ) : (
                                                  magazines.map((mag, idx) => (
                                                    <div
                                                      key={idx}
                                                      className="text-xs text-muted-foreground leading-tight"
                                                    >
                                                      • {mag}
                                                    </div>
                                                  ))
                                                )}
                                              </div>
                                              {hasMore && (
                                                <div className="text-xs text-muted-foreground italic mt-1.5 pt-1.5 border-t border-border">
                                                  + more magazines in this size
                                                </div>
                                              )}
                                            </>
                                          );
                                        })()}
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>
                                )
                              )}
                            </div>
                          </div>

                          {/* Standard Sizes */}
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-2">
                              Standard Formats
                            </h4>
                            <div className="grid grid-cols-2 gap-2">
                              {MAGAZINE_SIZES.filter((s) => s.category === "standard").map(
                                (size) => (
                                  <Tooltip key={size.id}>
                                    <TooltipTrigger asChild>
                                      <button
                                        onClick={() => {
                                          setSelectedSize(size.id);
                                          setUseCustomSize(false);
                                        }}
                                        className={`text-left p-3 rounded-lg border-2 transition-all hover-elevate active-elevate-2 ${
                                          selectedSize === size.id && !useCustomSize
                                            ? "border-primary bg-primary/5"
                                            : "border-border bg-card"
                                        }`}
                                        data-testid={`button-size-${size.id}`}
                                      >
                                        <p className="font-semibold text-sm">
                                          {size.width}×{size.height} inch
                                        </p>
                                      </button>
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className="max-w-[280px] p-3">
                                      <div className="space-y-1.5">
                                        <div className="text-xs font-medium text-foreground mb-2">
                                          Popular magazines in this size:
                                        </div>
                                        {(() => {
                                          const { magazines, hasMore } = getMagazinesForTooltip(
                                            size.id
                                          );
                                          const midpoint = Math.ceil(magazines.length / 2);
                                          const column1 = magazines.slice(0, midpoint);
                                          const column2 = magazines.slice(midpoint);

                                          return (
                                            <>
                                              <div
                                                className={
                                                  magazines.length > 5
                                                    ? "grid grid-cols-2 gap-x-4 gap-y-0.5"
                                                    : "space-y-0.5"
                                                }
                                              >
                                                {magazines.length > 5 ? (
                                                  <>
                                                    <div className="space-y-0.5">
                                                      {column1.map((mag, idx) => (
                                                        <div
                                                          key={idx}
                                                          className="text-xs text-muted-foreground leading-tight"
                                                        >
                                                          • {mag}
                                                        </div>
                                                      ))}
                                                    </div>
                                                    <div className="space-y-0.5">
                                                      {column2.map((mag, idx) => (
                                                        <div
                                                          key={idx}
                                                          className="text-xs text-muted-foreground leading-tight"
                                                        >
                                                          • {mag}
                                                        </div>
                                                      ))}
                                                    </div>
                                                  </>
                                                ) : (
                                                  magazines.map((mag, idx) => (
                                                    <div
                                                      key={idx}
                                                      className="text-xs text-muted-foreground leading-tight"
                                                    >
                                                      • {mag}
                                                    </div>
                                                  ))
                                                )}
                                              </div>
                                              {hasMore && (
                                                <div className="text-xs text-muted-foreground italic mt-1.5 pt-1.5 border-t border-border">
                                                  + more magazines in this size
                                                </div>
                                              )}
                                            </>
                                          );
                                        })()}
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>
                                )
                              )}
                            </div>
                          </div>

                          {/* Large Sizes */}
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-2">
                              Large Formats
                            </h4>
                            <div className="grid grid-cols-2 gap-2">
                              {MAGAZINE_SIZES.filter((s) => s.category === "large").map((size) => (
                                <Tooltip key={size.id}>
                                  <TooltipTrigger asChild>
                                    <button
                                      onClick={() => {
                                        setSelectedSize(size.id);
                                        setUseCustomSize(false);
                                      }}
                                      className={`text-left p-3 rounded-lg border-2 transition-all hover-elevate active-elevate-2 ${
                                        selectedSize === size.id && !useCustomSize
                                          ? "border-primary bg-primary/5"
                                          : "border-border bg-card"
                                      }`}
                                      data-testid={`button-size-${size.id}`}
                                    >
                                      <p className="font-semibold text-sm">
                                        {size.width}×{size.height} inch
                                      </p>
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent side="right" className="max-w-[280px] p-3">
                                    <div className="space-y-1.5">
                                      <div className="text-xs font-medium text-foreground mb-2">
                                        Popular magazines in this size:
                                      </div>
                                      {(() => {
                                        const { magazines, hasMore } = getMagazinesForTooltip(
                                          size.id
                                        );
                                        const midpoint = Math.ceil(magazines.length / 2);
                                        const column1 = magazines.slice(0, midpoint);
                                        const column2 = magazines.slice(midpoint);

                                        return (
                                          <>
                                            <div
                                              className={
                                                magazines.length > 5
                                                  ? "grid grid-cols-2 gap-x-4 gap-y-0.5"
                                                  : "space-y-0.5"
                                              }
                                            >
                                              {magazines.length > 5 ? (
                                                <>
                                                  <div className="space-y-0.5">
                                                    {column1.map((mag, idx) => (
                                                      <div
                                                        key={idx}
                                                        className="text-xs text-muted-foreground leading-tight"
                                                      >
                                                        • {mag}
                                                      </div>
                                                    ))}
                                                  </div>
                                                  <div className="space-y-0.5">
                                                    {column2.map((mag, idx) => (
                                                      <div
                                                        key={idx}
                                                        className="text-xs text-muted-foreground leading-tight"
                                                      >
                                                        • {mag}
                                                      </div>
                                                    ))}
                                                  </div>
                                                </>
                                              ) : (
                                                magazines.map((mag, idx) => (
                                                  <div
                                                    key={idx}
                                                    className="text-xs text-muted-foreground leading-tight"
                                                  >
                                                    • {mag}
                                                  </div>
                                                ))
                                              )}
                                            </div>
                                            {hasMore && (
                                              <div className="text-xs text-muted-foreground italic mt-1.5 pt-1.5 border-t border-border">
                                                + more magazines in this size
                                              </div>
                                            )}
                                          </>
                                        );
                                      })()}
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              ))}

                              {/* Custom Size Button (Desktop) */}
                              <button
                                onClick={() => setUseCustomSize(true)}
                                className={`text-left p-3 rounded-lg border-2 transition-all hover-elevate active-elevate-2 ${
                                  useCustomSize
                                    ? "border-primary bg-primary/5"
                                    : "border-border bg-card"
                                }`}
                                data-testid="button-size-custom"
                              >
                                <div className="flex items-center gap-1.5">
                                  <Ruler className="w-4 h-4" />
                                  <p className="font-semibold text-sm">Custom Size</p>
                                </div>
                              </button>
                            </div>
                          </div>

                          {/* Custom Size Input Section (Desktop) - Slides out when selected */}
                          {useCustomSize && (
                            <div className="mt-4 p-4 rounded-lg border-2 border-primary bg-primary/5 space-y-3 animate-in slide-in-from-top-2 duration-200">
                              <div className="flex items-center gap-2">
                                <Ruler className="w-4 h-4 text-primary" />
                                <h4 className="font-semibold text-sm">Custom Magazine Size</h4>
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                  <Label htmlFor="custom-width" className="text-xs">
                                    Magazine Width (inches)
                                  </Label>
                                  <Input
                                    id="custom-width"
                                    type="number"
                                    step="0.25"
                                    min="4"
                                    max="20"
                                    value={customWidth}
                                    onChange={(e) => setCustomWidth(e.target.value)}
                                    placeholder="8"
                                    className="bg-background"
                                    data-testid="input-custom-width"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <Label htmlFor="custom-height" className="text-xs">
                                    Magazine Height (inches)
                                  </Label>
                                  <Input
                                    id="custom-height"
                                    type="number"
                                    step="0.25"
                                    min="4"
                                    max="20"
                                    value={customHeight}
                                    onChange={(e) => setCustomHeight(e.target.value)}
                                    placeholder="10"
                                    className="bg-background"
                                    data-testid="input-custom-height"
                                  />
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Min 4&quot;. Decimals accepted (e.g., 8.5 or 10.25)
                              </p>
                            </div>
                          )}
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
                                Choose how many magazines to display in your frame. Single magazine
                                layouts are most popular for showcasing valuable issues.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Choose how many magazines to display
                        </p>

                        {availableLayouts.length === 0 ? (
                          <Alert>
                            <Info className="h-4 w-4" />
                            <AlertDescription>
                              No layouts are available for this magazine size within the 32×40&quot;
                              mat sheet constraint. Please select a smaller magazine size.
                            </AlertDescription>
                          </Alert>
                        ) : (
                          <MagazineLayoutGallery
                            selectedLayout={selectedLayout}
                            onLayoutChange={setSelectedLayout}
                            compact={isMobile}
                            layouts={availableLayouts}
                          />
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Section 2: Frame Style */}
                  <AccordionItem value="frame-style" className="border rounded-lg px-4 lg:px-6">
                    <AccordionTrigger
                      className="text-base font-semibold hover:no-underline py-4"
                      data-testid="accordion-frame"
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
                                    src={getStoreBaseAssetUrl(
                                      frame.thumbnail.startsWith("/")
                                        ? frame.thumbnail.slice(1)
                                        : frame.thumbnail
                                    )}
                                    alt={frame.name}
                                    className="h-full w-full object-cover"
                                    loading="lazy"
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
                      data-testid="accordion-mat"
                    >
                      Mat Color Options
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4">
                      <div className="space-y-4">
                        {/* Mat Type Selection */}
                        {currentLayout?.count === 1 ? (
                          <div className="grid grid-cols-3 gap-2">
                            <Button
                              type="button"
                              variant={matType === "none" ? "default" : "outline"}
                              onClick={() => setMatType("none")}
                              data-testid="button-mat-none"
                            >
                              <span className="font-semibold">No Mat</span>
                            </Button>
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
                        ) : (
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
                        )}

                        {/* Bottom-Weighted Matting Option */}
                        <BottomWeightedMatting
                          checked={bottomWeighted}
                          onCheckedChange={setBottomWeighted}
                          testIdPrefix="magazine"
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

                  {/* Section 4: Brass Nameplate - Only shown when mat is selected */}
                  {matType !== "none" && (
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
                  )}

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
                        value={selectedGlass?.id ?? glassTypes[0]?.id ?? ""}
                        onValueChange={(id) =>
                          setSelectedGlass(glassTypes.find((g) => g.id === id) ?? glassTypes[0]!)
                        }
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

              {/* Desktop Pricing Summary */}
              <PriceBox
                totalPrice={pricing.total}
                quantity={quantity}
                onQuantityChange={setQuantity}
                onAddToCart={handleAddToCart}
                onCopyLink={handleShare}
                priceItems={priceItems}
                testIdPrefix="magazine-"
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

          {/* Magazine Lifestyle Carousel - hidden when embedded (page may show its own or none) */}
          {!embedded && (
            <div className="mt-12">
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold tracking-tight mb-2">
                  Magazine Display Inspiration
                </h2>
                <p className="text-muted-foreground">
                  Browse real customer frames showcasing magazines
                </p>
              </div>
              <MagazineLifestyleCarousel
                onImageClick={(url, alt) => {
                  setFullscreenLifestyleUrl(url);
                  setFullscreenLifestyleAlt(alt);
                  setFullscreenImage("lifestyle");
                  setShowFullscreenPreview(true);
                }}
              />
            </div>
          )}
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
                    <MagazinePreviewCanvas
                      framePhotos={fullscreenPreviewState.framePhotos}
                      selectedFrame={selectedFrame}
                      topMatColor={selectedMat}
                      bottomMatColor={matType === "double" ? selectedMatInner : selectedMat}
                      backingColor={selectedMat}
                      matType={matType}
                      layout={selectedLayout}
                      sizeId={selectedSize}
                      matBorder={MAT_BORDER}
                      manifest={fullscreenPreviewState.manifest}
                      previewScale={fullscreenPreviewState.previewScale}
                      previewWidth={fullscreenPreviewState.previewWidth}
                      previewHeight={fullscreenPreviewState.previewHeight}
                      frameFaceWidth={fullscreenPreviewState.frameFaceWidth}
                      isMobile={isMobile}
                      magazineCovers={magazineCovers}
                      brassNameplateConfig={brassNameplateConfig}
                      bottomWeightedExtra={bottomWeightedExtra}
                    />
                  </div>
                </div>
              )}
              {fullscreenImage === "corner" &&
                (() => {
                  const cornerImage = selectedFrame.alternateImages?.find(
                    (img) => img.type === "corner" && img.url.includes("corner_a")
                  );
                  const imageUrl = cornerImage?.url || previewState.framePhotos.cornerUrl;
                  const resolvedUrl = imageUrl?.startsWith("http")
                    ? imageUrl
                    : imageUrl
                      ? getStoreBaseAssetUrl(
                          imageUrl.startsWith("/") ? imageUrl.slice(1) : imageUrl
                        )
                      : undefined;
                  return resolvedUrl ? (
                    <img
                      src={resolvedUrl}
                      alt="Frame corner detail"
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : null;
                })()}
              {fullscreenImage === "profile" &&
                (() => {
                  const profileImage = selectedFrame.alternateImages?.find(
                    (img) => img.type === "profile"
                  );
                  const imageUrl = profileImage?.url || previewState.framePhotos.profileUrl;
                  const resolvedUrl = imageUrl?.startsWith("http")
                    ? imageUrl
                    : imageUrl
                      ? getStoreBaseAssetUrl(
                          imageUrl.startsWith("/") ? imageUrl.slice(1) : imageUrl
                        )
                      : undefined;
                  return resolvedUrl ? (
                    <img
                      src={resolvedUrl}
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
                  <span className="text-lg font-bold" data-testid="magazine-mobile-total-price">
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
                    testId="magazine-mobile-quantity"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleShare}
                    className="h-11 w-11"
                    data-testid="magazine-mobile-copy-link"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={handleAddToCart}
                    className="flex-1 text-xs min-w-0 min-h-11"
                    data-testid="magazine-mobile-add-to-cart"
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
