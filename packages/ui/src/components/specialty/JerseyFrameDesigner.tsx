"use client";

import { useState, useEffect, useMemo, useRef } from "react";
// Removed wouter useLocation - using window.location directly in Next.js
import { Share2, Shirt, Info, Maximize, Settings, Eye, Copy, Palette, Shield } from "lucide-react";
import { useIntelligentPreviewSizing } from "@framecraft/core";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { QuantitySelector } from "../ui/quantity-selector";
// Import types from @framecraft/types
import type { FrameStyle, FrameConfiguration, AlternateImage } from "@framecraft/types";

// Import services from @framecraft/core
import { getFrameStyleById, calculatePricing } from "@framecraft/core";

// Import utilities from @framecraft/core
import {
  computePreviewLayout,
  getStoreBaseAssetUrl,
  getJerseyLifestyleImages,
} from "@framecraft/core";

// Import hooks from @framecraft/core
import { useIsMobile, useMobileViewToggle } from "@framecraft/core";

// Import config from @framecraft/config
import { getMatsInDisplayOrder, getMatById, type Mat } from "@framecraft/config";

// Import UI components from same package
import { ColorSwatchesWithSeparator } from "../ui/ColorSwatches";

// TODO: Extract these app-specific dependencies or make them injectable
// - useToast hook
// - TrustBox component
// - jerseyTeams utilities (MatOption)
// - jerseyLayouts utilities (getJerseyLayout, getAllJerseyLayouts, JERSEY_LAYOUTS)
// - JerseyPreviewCanvas, JerseyLifestyleCarousel components
// - BrassNameplateSection component
// - HangingHardwareSection, BottomWeightedMatting components
// - @shared/schema types
import { useToast } from "../../hooks/use-toast";
import { TrustBox } from "../marketing/TrustBox";
import { type MatOption } from "@framecraft/core";
import { getJerseyLayout, type JerseyLayoutType } from "@framecraft/core";
import { generateDoubleMatPaths } from "@framecraft/core";
import { JerseyPreviewCanvas } from "./JerseyPreviewCanvas";
import { JerseyLifestyleCarousel } from "./JerseyLifestyleCarousel";
import { BrassNameplateSection } from "../brass-nameplate/BrassNameplateSection";
import type { BrassNameplateConfig } from "@framecraft/types";
import { BRASS_NAMEPLATE_SPECS } from "@framecraft/types";
import { HangingHardwareSection } from "./shared/HangingHardwareSection";
import { BottomWeightedMatting, BOTTOM_WEIGHTED_EXTRA } from "./shared/BottomWeightedMatting";
import { PriceBox } from "../ui/PriceBox";
import type { PriceLineItem } from "../ui/PriceBox";

// Jersey frames: only 3 specific shadowbox frames allowed (extra deep with 2" usable depth)
const JERSEY_FRAME_IDS = [
  "extra-deep-matte-black",
  "extra-deep-bright-white",
  "extra-deep-rich-walnut",
];
const jerseyFrames = JERSEY_FRAME_IDS.map((id) => getFrameStyleById(id)).filter(
  Boolean
) as FrameStyle[];

// Frame name mapping for jersey designer (uses SKU numbers)
const getJerseyFrameName = (frameSku: string): string => {
  const mapping: Record<string, string> = {
    "10727": "Black Wood",
    "10728": "White Wood",
    "10729": "Brown Wood",
  };
  return mapping[frameSku] || frameSku;
};

function matToMatOption(mat: Mat): MatOption {
  return {
    sku: mat.id,
    hex: mat.hexColor || "#FFFFFF",
    name: mat.name,
  };
}

interface JerseyFrameDesignerProps {
  defaultFrameId?: string;
  embedded?: boolean;
}

export function JerseyFrameDesigner({
  defaultFrameId,
  embedded = false,
}: JerseyFrameDesignerProps) {
  // Removed useLocation() - not needed in Next.js, using window.location directly where needed
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { mobileView, setMobileView, showMobileBar, previewCardRef, controlsHeadingRef } =
    useMobileViewToggle({ isMobile });

  // Read URL parameters on mount (client-side only)
  const urlParams = useMemo(() => {
    if (typeof window !== "undefined" && window.location) {
      return new URLSearchParams(window.location.search);
    }
    return new URLSearchParams();
  }, []);

  // Initialize frame selection
  const initialFrame = useMemo(() => {
    if (defaultFrameId) {
      return getFrameStyleById(defaultFrameId) ?? jerseyFrames[0];
    }
    const frameParam = urlParams.get("frame");
    return frameParam ? (getFrameStyleById(frameParam) ?? jerseyFrames[0]) : jerseyFrames[0];
  }, [defaultFrameId, urlParams]);

  // Designer state
  const [selectedLayout, setSelectedLayout] = useState<JerseyLayoutType>(() => {
    const urlLayout = urlParams.get("layout");
    // Support legacy layout-a/layout-b parameters
    if (urlLayout === "layout-a") return "classic-regular";
    if (urlLayout === "layout-b") return "premium-regular";
    // Validate new layout types
    const validLayouts: JerseyLayoutType[] = [
      "classic-small",
      "classic-regular",
      "classic-large",
      "premium-small",
      "premium-regular",
      "premium-large",
    ];
    if (urlLayout && validLayouts.includes(urlLayout as JerseyLayoutType)) {
      return urlLayout as JerseyLayoutType;
    }
    return "classic-regular"; // Default to classic-regular
  });

  // Track layout type and size for two-step selection
  const selectedLayoutType: "classic" | "premium" = selectedLayout.startsWith("classic")
    ? "classic"
    : "premium";
  const selectedSize: "small" | "regular" | "large" = selectedLayout.includes("small")
    ? "small"
    : selectedLayout.includes("large")
      ? "large"
      : "regular";

  // Helper to update layout selection
  const selectLayoutType = (type: "classic" | "premium") => {
    // Keep the same size, change the layout type
    setSelectedLayout(`${type}-${selectedSize}` as JerseyLayoutType);
    // Reset bottom-weighted matting when switching to premium (not available for premium)
    if (type === "premium") {
      setBottomWeighted(false);
    }
  };

  const selectSize = (size: "small" | "regular" | "large") => {
    // Keep the same layout type, change the size
    setSelectedLayout(`${selectedLayoutType}-${size}` as JerseyLayoutType);
  };

  const [selectedFrame, setSelectedFrame] = useState<FrameStyle>(
    () => initialFrame ?? jerseyFrames[0]!
  );

  // Mat color selections (top, bottom, backing)
  const [selectedTopMat, setSelectedTopMat] = useState<MatOption>(() => {
    const urlTopMat = urlParams.get("topMat");
    if (urlTopMat) {
      const mat = getMatById(urlTopMat);
      if (mat) return matToMatOption(mat);
    }
    return { sku: "mat-1", hex: "#FFFFFF", name: "White" };
  });

  const [selectedBottomMat, setSelectedBottomMat] = useState<MatOption>(() => {
    const urlBottomMat = urlParams.get("bottomMat");
    if (urlBottomMat) {
      const mat = getMatById(urlBottomMat);
      if (mat) return matToMatOption(mat);
    }
    return { sku: "mat-2", hex: "#000000", name: "Black" };
  });

  const [selectedBacking, setSelectedBacking] = useState<MatOption>(() => {
    const urlBacking = urlParams.get("backing");
    if (urlBacking) {
      const mat = getMatById(urlBacking);
      if (mat) return matToMatOption(mat);
    }
    return { sku: "mat-1", hex: "#FFFFFF", name: "White" };
  });

  // Brass nameplate configuration (full config object)
  const [brassNameplateConfig, setBrassNameplateConfig] = useState<BrassNameplateConfig>(() => {
    const defaultConfig: BrassNameplateConfig = {
      enabled: false,
      line1: "",
      line2: "",
      line3: "",
      font: "georgia",
      color: "brass-black",
      includeFlag: false,
    };

    // Try to read from URL parameters
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
          urlParams.get("plaqueFont") ||
          "georgia",
        color:
          (urlParams.get("nameplateColor") as BrassNameplateConfig["color"]) ||
          urlParams.get("plaqueColor") ||
          "brass-black",
        includeFlag: (urlParams.get("nameplateFlag") || urlParams.get("plaqueFlag")) === "true",
      };
    } catch {
      return defaultConfig;
    }
  });

  const [hardware, setHardware] = useState<"standard" | "security">(
    (urlParams.get("hardware") as "standard" | "security") || "standard"
  );

  const [bottomWeighted, setBottomWeighted] = useState(() => {
    return urlParams.get("bottomWeighted") === "true";
  });

  // UI state
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showFullscreenPreview, setShowFullscreenPreview] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const currentLayout = useMemo(() => getJerseyLayout(selectedLayout), [selectedLayout]);

  // Calculate frame dimensions from layout
  const bottomWeightedExtra = bottomWeighted ? BOTTOM_WEIGHTED_EXTRA : 0;
  const frameWidth = currentLayout.frameInteriorWidth + 2 * (selectedFrame.mouldingWidth || 1.25);
  const frameHeight =
    currentLayout.frameInteriorHeight +
    2 * (selectedFrame.mouldingWidth || 1.25) +
    bottomWeightedExtra;

  // Intelligent preview sizing hook - dynamically adjusts preview container height based on frame aspect ratio
  const { containerRef, previewContainerHeight, containerWidth } = useIntelligentPreviewSizing({
    frameWidth,
    frameHeight,
    plaqueEnabled: brassNameplateConfig.enabled,
    plaqueExtension: BRASS_NAMEPLATE_SPECS.NAMEPLATE_FRAME_EXTENSION,
    isMobile,
    // Custom overrides to match previous behavior (was min-h-[400px] md:min-h-[625px])
    minHeightMobile: 400,
    minHeightDesktop: 625,
  });

  // Random jersey lifestyle image from shared assets (re-select when frame changes)
  const randomLifestyleImage = useMemo(() => {
    const images = getJerseyLifestyleImages();
    if (images.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex] ?? null;
  }, []);

  // Standard and premium mats for color selection
  const standardMats = useMemo(
    () => getMatsInDisplayOrder(isMobile ? "mobile" : "desktop", true, false),
    [isMobile]
  );
  const premiumMats = useMemo(
    () => getMatsInDisplayOrder(isMobile ? "mobile" : "desktop", false, true),
    [isMobile]
  );

  // Frame photos state (corner, profile images + texture slices)
  const [framePhotos, setFramePhotos] = useState<{
    cornerUrl?: string;
    profileUrl?: string;
    topUrl?: string;
    bottomUrl?: string;
    leftUrl?: string;
    rightUrl?: string;
  }>({});

  // Fetch frame photos when selected frame changes
  useEffect(() => {
    setFramePhotos({});

    if (!selectedFrame?.sku) return;

    async function fetchFramePhotos() {
      try {
        const response = await fetch(`/api/frames/${selectedFrame.sku}/photos`);
        if (response.ok) {
          const photoSet = await response.json();
          setFramePhotos({
            cornerUrl: photoSet.cornerUrl,
            profileUrl: photoSet.profileUrl,
            topUrl: photoSet.topUrl,
            bottomUrl: photoSet.bottomUrl,
            leftUrl: photoSet.leftUrl,
            rightUrl: photoSet.rightUrl,
          });
        } else {
          setFramePhotos({});
        }
      } catch (error) {
        console.error("Error fetching frame photos:", error);
        setFramePhotos({});
      }
    }

    fetchFramePhotos();
  }, [selectedFrame?.sku]);

  // Update URL when configuration changes
  useEffect(() => {
    if (!selectedFrame?.sku) return;

    const params = new URLSearchParams();
    params.set("layout", selectedLayout);
    params.set("frame", selectedFrame.sku);
    params.set("topMat", selectedTopMat.sku);
    params.set("bottomMat", selectedBottomMat.sku);
    params.set("backing", selectedBacking.sku);
    if (brassNameplateConfig.enabled) {
      params.set("nameplateEnabled", "true");
      if (brassNameplateConfig.line1) params.set("nameplateLine1", brassNameplateConfig.line1);
      if (brassNameplateConfig.line2) params.set("nameplateLine2", brassNameplateConfig.line2);
      if (brassNameplateConfig.line3) params.set("nameplateLine3", brassNameplateConfig.line3);
      params.set("nameplateFont", brassNameplateConfig.font);
      params.set("nameplateColor", brassNameplateConfig.color);
      if (brassNameplateConfig.includeFlag) params.set("nameplateFlag", "true");
    }
    params.set("hardware", hardware);
    if (bottomWeighted) {
      params.set("bottomWeighted", "true");
    } else {
      params.delete("bottomWeighted");
    }

    if (typeof window !== "undefined" && window.location) {
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({}, "", newUrl);
    }
  }, [
    selectedLayout,
    selectedFrame?.sku,
    selectedTopMat,
    selectedBottomMat,
    selectedBacking,
    brassNameplateConfig,
    hardware,
    bottomWeighted,
  ]);

  // Calculate pricing using new pricing engine v2
  const pricing = useMemo(() => {
    // Create FrameConfiguration for the new pricing engine
    const frameConfig: FrameConfiguration = {
      artworkWidth: currentLayout.frameInteriorWidth,
      artworkHeight: currentLayout.frameInteriorHeight,
      frameStyleId: selectedFrame.id,
      matType: "double",
      matBorderWidth: 2,
      matRevealWidth: currentLayout.matReveal,
      matColorId: selectedTopMat.sku,
      matInnerColorId: selectedBottomMat.sku,
      glassTypeId: "standard",
      serviceType: "frame-only",
      bottomWeighted,
    };

    // Calculate frame price using new pricing engine
    const pricingResult = calculatePricing(frameConfig);

    // Add-on prices (nameplate and hardware)
    const nameplatePrice = brassNameplateConfig.enabled && currentLayout.allowsPlaque ? 35 : 0;
    const hardwarePrice = hardware === "security" ? 8.95 : 0;

    return {
      framePrice: pricingResult.total,
      nameplatePrice,
      hardwarePrice,
      total: pricingResult.total + nameplatePrice + hardwarePrice,
    };
  }, [
    currentLayout,
    selectedFrame.id,
    selectedTopMat.sku,
    selectedBottomMat.sku,
    brassNameplateConfig.enabled,
    hardware,
    bottomWeighted,
  ]);

  // Build itemized price breakdown
  const priceItems = useMemo<PriceLineItem[]>(() => {
    const items: PriceLineItem[] = [];

    // Frame price from new pricing engine (includes frame + glazing)
    items.push({
      label: `${currentLayout.name} Frame`,
      amount: pricing.framePrice,
      testId: "text-frame-price",
    });

    // Brass plaque (if enabled and allowed)
    if (currentLayout.allowsPlaque) {
      if (brassNameplateConfig.enabled) {
        items.push({
          label: "Engraved Brass Nameplate",
          amount: pricing.nameplatePrice,
          testId: "text-plaque-price",
        });
      }
    }

    // Hardware upgrade (if security selected)
    if (hardware === "security") {
      items.push({
        label: "Security Hardware",
        amount: pricing.hardwarePrice,
        testId: "text-hardware-price",
      });
    } else {
      items.push({
        label: "Standard Hardware",
        amount: 0,
        isIncluded: true,
        testId: "text-hardware-price",
      });
    }

    return items;
  }, [pricing, currentLayout, brassNameplateConfig.enabled, hardware]);

  // Calculate preview layout for realistic frame rendering
  const layout = useMemo(() => {
    // CRITICAL: Use the full frame interior dimensions, not the jersey opening dimensions!
    // This ensures the SVG clip paths and preview container share the same coordinate system.
    // Layout A: 24×24" interior
    // Layout B: 24×30" interior
    //
    // Note: computePreviewLayout expects artW/artH to be the mat opening size, so we need
    // to calculate the mat opening from the frame interior dimensions.
    // For jersey frames, the mat border is uniform, so:
    // matOpening = frameInterior - (2 × matBorder)

    // Get the main jersey opening to determine mat border width
    const mainOpening = currentLayout.openings.find((o) => o.purpose === "jersey-display");
    const matBorder = mainOpening ? mainOpening.x : 2; // Mat border is the x position of the main opening

    // Calculate the full mat opening dimensions using frame interior
    // Note: When bottom-weighted, the interior height increases but the mat opening stays the same
    const matOpeningWidth = currentLayout.frameInteriorWidth - 2 * matBorder;
    const matOpeningHeight = currentLayout.frameInteriorHeight - 2 * matBorder;

    // Use asymmetric mat borders when bottom-weighted matting is enabled
    return computePreviewLayout({
      artW: matOpeningWidth, // Full mat opening width (20" for both layouts)
      artH: matOpeningHeight, // Full mat opening height (20" for Layout A, 26" for Layout B)
      matBorderTop: matBorder,
      matBorderRight: matBorder,
      matBorderBottom: matBorder + bottomWeightedExtra, // Add extra 0.5" to bottom when enabled
      matBorderLeft: matBorder,
      frameFace: selectedFrame.mouldingWidth,
      containerWpx: containerWidth,
      containerHpx: previewContainerHeight,
      paddingPx: 24,
    });
  }, [
    currentLayout,
    selectedFrame.mouldingWidth,
    containerWidth,
    previewContainerHeight,
    bottomWeightedExtra,
  ]);

  // Generate SVG clip paths for multi-opening Premium layouts
  const matPaths = useMemo(() => {
    // Only generate SVG paths for Premium layouts (multi-opening)
    const isPremium =
      selectedLayout === "premium-small" ||
      selectedLayout === "premium-regular" ||
      selectedLayout === "premium-large";
    if (!isPremium) {
      return null;
    }

    // Generate double-mat paths with all openings
    // Include bottomWeightedExtra in the frame interior height when bottom-weighted is enabled
    const paths = generateDoubleMatPaths(
      currentLayout.frameInteriorWidth,
      currentLayout.frameInteriorHeight + bottomWeightedExtra,
      currentLayout.openings,
      currentLayout.matReveal,
      layout.scale
    );

    return paths;
  }, [selectedLayout, currentLayout, layout.scale, bottomWeightedExtra]);

  const handleShare = () => {
    if (typeof window === "undefined" || !window.location) return;
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied!",
      description: "Share this link to show your jersey frame configuration.",
    });
    setShowShareDialog(false);
  };

  const handleCopyLink = () => {
    if (typeof window === "undefined" || !window.location) return;
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied!",
      description: "Design link copied to clipboard.",
    });
  };

  const handleAddToCart = () => {
    toast({
      title: "Feature coming soon",
      description: "Shopping cart integration will be available in the next update.",
    });
  };

  if (!selectedFrame) {
    return (
      <div className="container mx-auto px-6 py-16">
        <Card className="p-12 text-center">
          <div className="text-muted-foreground">
            <Shirt className="w-12 h-12 mx-auto mb-4 animate-pulse" />
            <p>Loading designer...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <>
      {/* Sentinel element for mobile floating button - triggers when scrolled out of view */}
      <div ref={sentinelRef} className="h-px" aria-hidden="true" />

      <div className="min-h-screen bg-background">
        {/* Desktop Header */}
        {!embedded && (
          <div className="hidden lg:block border-b bg-card/50">
            <div className="container mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">Jersey Frame Designer</h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    Custom sports jersey display frames with team colors
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowShareDialog(true)}
                    data-testid="button-share"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Header */}
        {!embedded && isMobile && (
          <div className="lg:hidden border-b bg-card/50 sticky top-0 z-40">
            <div className="px-4 py-3">
              <h1 className="text-lg font-bold">Jersey Frame Designer</h1>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="container mx-auto px-4 lg:px-6 py-6 lg:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[9fr,8fr] gap-6">
            {/* Left Column - Preview */}
            <div
              className={
                isMobile && mobileView === "controls"
                  ? "hidden"
                  : "lg:sticky lg:top-[132px] lg:self-start"
              }
            >
              <Card ref={previewCardRef} className="p-6 lg:p-8" data-testid="card-preview">
                {/* Jersey Frame Preview - Realistic Frame Rendering */}
                <div
                  ref={containerRef}
                  className="preview-wrap bg-muted rounded-md flex items-center justify-center relative group"
                  style={{ minHeight: `${previewContainerHeight}px` }}
                  data-testid="preview-canvas"
                >
                  {/* Mouseover icon for full preview */}
                  <div className="absolute top-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setShowFullscreenPreview(true)}
                      className="bg-background/90 hover:bg-background p-2 rounded-md shadow-lg hover-elevate active-elevate-2"
                      data-testid="button-expand-preview"
                    >
                      <Maximize className="h-5 w-5" />
                    </button>
                  </div>

                  <JerseyPreviewCanvas
                    layout={layout}
                    framePhotos={framePhotos}
                    matPaths={matPaths}
                    selectedLayout={selectedLayout}
                    currentLayout={currentLayout}
                    selectedFrame={selectedFrame}
                    topMatColor={selectedTopMat}
                    bottomMatColor={selectedBottomMat}
                    backingColor={selectedBacking}
                    brassNameplateConfig={brassNameplateConfig}
                    bottomWeightedExtra={bottomWeightedExtra}
                  />
                </div>

                {isMobile && (
                  <div className="space-y-4">
                    {/* Layout & Size Selection - Mobile Only */}
                    <div className="mt-4 space-y-4">
                      <h3 className="font-semibold text-sm mb-1">Choose Your Frame</h3>

                      {/* Step 1: Layout Type Selection */}
                      <div className="space-y-2">
                        <div className="flex items-baseline justify-between">
                          <Label className="text-xs font-semibold">Step 1: Layout Style</Label>
                          <span className="text-xs text-muted-foreground">
                            {selectedLayoutType === "classic" ? "Classic" : "Premium"} selected
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {(["classic", "premium"] as const).map((layoutType) => {
                            return (
                              <button
                                key={layoutType}
                                type="button"
                                onClick={() => selectLayoutType(layoutType)}
                                className={`
                                p-3 rounded-lg border-2 transition-all text-center hover-elevate active-elevate-2
                                ${
                                  selectedLayoutType === layoutType
                                    ? "border-primary bg-primary/5"
                                    : "border-border bg-card"
                                }
                              `}
                                data-testid={`button-layout-type-${layoutType}`}
                              >
                                <div className="font-semibold text-base capitalize">
                                  {layoutType}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Step 2: Size Selection - Mobile Only */}
                      <div className="space-y-2">
                        <div className="flex items-baseline justify-between">
                          <Label className="text-xs font-semibold">Step 2: Choose Size</Label>
                          <span className="text-xs text-muted-foreground capitalize">
                            {selectedSize} selected
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {(["small", "regular", "large"] as const).map((size) => {
                            // Clear, action-oriented labels
                            const headline =
                              size === "small"
                                ? "Youth Jerseys"
                                : size === "regular"
                                  ? "Adult Jerseys"
                                  : "Hockey & XL";
                            const description =
                              size === "small"
                                ? "Kids' and women's sizes"
                                : size === "regular"
                                  ? "Standard pro jerseys"
                                  : "Bulky or stitched jerseys";

                            return (
                              <button
                                key={size}
                                type="button"
                                onClick={() => selectSize(size)}
                                className={`
                                p-2 rounded-lg border-2 transition-all text-center hover-elevate active-elevate-2
                                ${
                                  selectedSize === size
                                    ? "border-primary bg-primary/5"
                                    : "border-border bg-card"
                                }
                              `}
                                data-testid={`button-size-${size}`}
                              >
                                <div className="font-semibold text-xs">{headline}</div>
                                <div className="text-[10px] text-muted-foreground mt-1">
                                  {description}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Helpful Sizing Guide */}
                      <div className="p-3 bg-muted/30 rounded-md">
                        <div className="text-xs">
                          <div className="font-semibold text-foreground mb-1.5">
                            Which size do I need?
                          </div>
                          <ul className="space-y-1 text-muted-foreground">
                            <li>
                              • <span className="font-medium text-foreground">Youth:</span>{" "}
                              Kids&apos; and women&apos;s jerseys
                            </li>
                            <li>
                              • <span className="font-medium text-foreground">Adult:</span> Standard
                              pro jerseys (NFL, NBA, MLB)
                            </li>
                            <li>
                              • <span className="font-medium text-foreground">Hockey & XL:</span>{" "}
                              Bulky or stitched jerseys
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Dimension Display - Desktop only */}
                {!isMobile && (
                  <>
                    <Separator />

                    {/* Dimension Display - Polished Two-Line Format */}
                    <div className="p-3 bg-muted/50 rounded-md text-sm space-y-0.5">
                      <p className="font-medium">
                        Finished Size:{" "}
                        <span className="text-primary">
                          {(() => {
                            const displayFrameWidth =
                              currentLayout.frameInteriorWidth +
                              2 * (selectedFrame.mouldingWidth || 1.25);
                            const displayFrameHeight =
                              currentLayout.frameInteriorHeight +
                              2 * (selectedFrame.mouldingWidth || 1.25) +
                              bottomWeightedExtra;
                            return `${displayFrameWidth.toFixed(2)}&quot; × ${displayFrameHeight.toFixed(2)}&quot;`;
                          })()}
                        </span>
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Interior: {currentLayout.frameInteriorWidth}&quot; ×{" "}
                        {(currentLayout.frameInteriorHeight + bottomWeightedExtra).toFixed(1)}&quot;
                        × {selectedFrame.usableDepth}&quot; depth
                        {bottomWeighted && (
                          <span className="ml-1 text-primary">(+0.5&quot; bottom-weighted)</span>
                        )}
                      </p>
                    </div>

                    {/* Frame Details - 3 Small Boxes */}
                    <div className="grid grid-cols-3 gap-2">
                      {/* Corner Detail */}
                      {(() => {
                        const cornerImage = selectedFrame.alternateImages?.find(
                          (img: AlternateImage) =>
                            img.type === "corner" && img.url.includes("corner_a")
                        );
                        return cornerImage ? (
                          <div className="aspect-square rounded-md border overflow-hidden bg-background">
                            <img
                              src={getStoreBaseAssetUrl(
                                cornerImage.url.startsWith("/")
                                  ? cornerImage.url.slice(1)
                                  : cornerImage.url
                              )}
                              alt={cornerImage.alt || `${selectedFrame.name} corner detail`}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        ) : framePhotos.cornerUrl ? (
                          <div className="aspect-square rounded-md border overflow-hidden bg-background">
                            <img
                              src={framePhotos.cornerUrl}
                              alt="Frame corner detail"
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        ) : (
                          <div className="aspect-square rounded-md border-2 border-dashed border-border flex items-center justify-center bg-muted/30">
                            <div className="text-center p-2">
                              <p className="text-xs text-muted-foreground">Corner Detail</p>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Profile View */}
                      {(() => {
                        const profileImage = selectedFrame.alternateImages?.find(
                          (img: AlternateImage) =>
                            img.type === "profile" &&
                            (img.url.includes("profile_a") ||
                              img.url.includes("pro-a") ||
                              img.url.includes("pro_a"))
                        );
                        return profileImage ? (
                          <div className="aspect-square rounded-md border overflow-hidden bg-background">
                            <img
                              src={getStoreBaseAssetUrl(
                                profileImage.url.startsWith("/")
                                  ? profileImage.url.slice(1)
                                  : profileImage.url
                              )}
                              alt={profileImage.alt || `${selectedFrame.name} profile view`}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        ) : framePhotos.profileUrl ? (
                          <div className="aspect-square rounded-md border overflow-hidden bg-background">
                            <img
                              src={framePhotos.profileUrl}
                              alt="Frame profile view"
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        ) : (
                          <div className="aspect-square rounded-md border-2 border-dashed border-border flex items-center justify-center bg-muted/30">
                            <div className="text-center p-2">
                              <p className="text-xs text-muted-foreground">Profile View</p>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Random Lifestyle Image */}
                      {randomLifestyleImage ? (
                        <div className="aspect-square rounded-md border overflow-hidden bg-background">
                          <img
                            src={randomLifestyleImage.url}
                            alt={randomLifestyleImage.alt || `${selectedFrame.name} lifestyle`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div className="aspect-square rounded-md border-2 border-dashed border-border flex items-center justify-center bg-muted/30">
                          <div className="text-center p-2">
                            <p className="text-xs text-muted-foreground">Lifestyle Image</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Trust Indicators */}
                    <TrustBox />

                    {/* Product Note */}
                    <p className="text-xs text-muted-foreground text-center pt-4">
                      Frame arrives ready to assemble. Professional framing tips included.
                    </p>
                  </>
                )}
              </Card>
            </div>

            {/* Right Column - Controls */}
            <div className={isMobile && mobileView === "preview" ? "hidden" : "block"}>
              <div className="space-y-6">
                <h2 ref={controlsHeadingRef} className="text-2xl font-bold mb-2 lg:hidden">
                  Customize Your Frame
                </h2>

                <Accordion
                  type="multiple"
                  defaultValue={[
                    "layout",
                    "size",
                    "frame",
                    "mats",
                    "hardware",
                    "nameplate",
                    "instructions",
                  ]}
                  className="space-y-4"
                >
                  {/* Layout Style Selection - Desktop Only */}
                  {!isMobile && (
                    <AccordionItem value="layout" className="border rounded-lg px-4 lg:px-6">
                      <AccordionTrigger
                        className="hover:no-underline"
                        data-testid="accordion-layout"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Palette className="w-5 h-5 text-primary" />
                          </div>
                          <div className="text-left">
                            <div className="font-semibold">Layout Style</div>
                            <div className="text-sm text-muted-foreground capitalize">
                              {selectedLayoutType}
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-2 pb-4">
                        <div className="grid grid-cols-2 gap-2">
                          {(["classic", "premium"] as const).map((layoutType) => {
                            return (
                              <button
                                key={layoutType}
                                type="button"
                                onClick={() => selectLayoutType(layoutType)}
                                className={`
                                p-3 rounded-lg border-2 transition-all text-center hover-elevate active-elevate-2
                                ${
                                  selectedLayoutType === layoutType
                                    ? "border-primary bg-primary/5"
                                    : "border-border bg-card"
                                }
                              `}
                                data-testid={`button-layout-type-${layoutType}`}
                              >
                                <div className="font-semibold text-base capitalize">
                                  {layoutType}
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {/* Overall dimensions display */}
                        <div className="text-xs text-muted-foreground">
                          <div className="font-semibold text-foreground mb-1">
                            Overall Frame Dimensions:{" "}
                            {(() => {
                              const frameWidth =
                                currentLayout.frameInteriorWidth +
                                2 * (selectedFrame.mouldingWidth || 1.25);
                              const frameHeight =
                                currentLayout.frameInteriorHeight +
                                2 * (selectedFrame.mouldingWidth || 1.25);
                              return `${frameWidth.toFixed(2)}" × ${frameHeight.toFixed(2)}"`;
                            })()}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {/* Jersey Size Selection - Desktop Only */}
                  {!isMobile && (
                    <AccordionItem value="size" className="border rounded-lg px-4 lg:px-6">
                      <AccordionTrigger className="hover:no-underline" data-testid="accordion-size">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Shirt className="w-5 h-5 text-primary" />
                          </div>
                          <div className="text-left">
                            <div className="font-semibold">Jersey Size</div>
                            <div className="text-sm text-muted-foreground capitalize">
                              {selectedSize === "small"
                                ? "Youth"
                                : selectedSize === "regular"
                                  ? "Adult"
                                  : "Hockey & XL"}
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-2 pb-4">
                        <div className="grid grid-cols-3 gap-2">
                          {(["small", "regular", "large"] as const).map((size) => {
                            const headline =
                              size === "small"
                                ? "Youth Jerseys"
                                : size === "regular"
                                  ? "Adult Jerseys"
                                  : "Hockey & XL";
                            const description =
                              size === "small"
                                ? "Kids' and women's sizes"
                                : size === "regular"
                                  ? "Standard pro jerseys"
                                  : "Bulky or stitched jerseys";

                            return (
                              <button
                                key={size}
                                type="button"
                                onClick={() => selectSize(size)}
                                className={`
                                p-3 rounded-lg border-2 transition-all text-center hover-elevate active-elevate-2
                                ${
                                  selectedSize === size
                                    ? "border-primary bg-primary/5"
                                    : "border-border bg-card"
                                }
                              `}
                                data-testid={`button-size-${size}`}
                              >
                                <div className="font-semibold text-sm">{headline}</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {description}
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {/* Help Text */}
                        <div className="text-xs">
                          <div className="font-semibold text-foreground mb-1.5">
                            Which size do I need?
                          </div>
                          <ul className="space-y-1 text-muted-foreground">
                            <li>
                              • <span className="font-medium text-foreground">Youth:</span>{" "}
                              Kids&apos; and women&apos;s jerseys
                            </li>
                            <li>
                              • <span className="font-medium text-foreground">Adult:</span> Standard
                              pro jerseys (NFL, NBA, MLB)
                            </li>
                            <li>
                              • <span className="font-medium text-foreground">Hockey & XL:</span>{" "}
                              Bulky or stitched jerseys
                            </li>
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {/* Frame Selection */}
                  <AccordionItem value="frame" className="border rounded-lg px-4 lg:px-6">
                    <AccordionTrigger className="hover:no-underline" data-testid="accordion-frame">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Maximize className="w-5 h-5 text-primary" />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold">Frame Style</div>
                          <div className="text-sm text-muted-foreground">
                            {getJerseyFrameName(selectedFrame.sku || "")}
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 pt-2 pb-4">
                      <div className="grid grid-cols-3 gap-2">
                        {jerseyFrames.map((frame) => {
                          // Find first corner image from alternateImages
                          const cornerImage = frame.alternateImages?.find(
                            (img: AlternateImage) => img.type === "corner"
                          );
                          const localPath = cornerImage?.url || frame.thumbnail;
                          const swatchImage = localPath
                            ? getStoreBaseAssetUrl(
                                localPath.startsWith("/") ? localPath.slice(1) : localPath
                              )
                            : "";

                          return (
                            <button
                              key={frame.sku}
                              onClick={() => setSelectedFrame(frame)}
                              className={`
                              p-2 rounded-lg border-2 transition-all hover-elevate active-elevate-2
                              ${
                                selectedFrame.sku === frame.sku
                                  ? "border-primary bg-primary/5"
                                  : "border-border bg-card"
                              }
                            `}
                              data-testid={`button-frame-${frame.sku}`}
                            >
                              {swatchImage ? (
                                <div className="w-full aspect-square rounded mb-1.5 overflow-hidden border">
                                  <img
                                    src={swatchImage}
                                    alt={getJerseyFrameName(frame.sku || "")}
                                    className="h-full w-full object-cover"
                                    loading="lazy"
                                  />
                                </div>
                              ) : (
                                <div
                                  className="w-full aspect-square rounded mb-1.5 border"
                                  style={{ backgroundColor: frame.color }}
                                />
                              )}
                              <p className="text-xs font-medium text-center">
                                {getJerseyFrameName(frame.sku || "")}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Mat Colors Selection */}
                  <AccordionItem value="mats" className="border rounded-lg px-4 lg:px-6">
                    <AccordionTrigger className="hover:no-underline" data-testid="accordion-mats">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Palette className="w-5 h-5 text-primary" />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold">Mat Colors</div>
                          <div className="text-sm text-muted-foreground">
                            Top mat, accent mat, and backing
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-2 pb-4" overflowVisible={true}>
                      {/* Top Mat */}
                      <div className="space-y-3">
                        <div>
                          <Label className="text-base font-semibold">Top Mat</Label>
                          <p className="text-sm text-muted-foreground">
                            Primary mat layer visible around jersey
                          </p>
                        </div>
                        <ColorSwatchesWithSeparator
                          standardColors={standardMats}
                          premiumColors={premiumMats}
                          selectedId={selectedTopMat.sku}
                          onSelect={(mat) => setSelectedTopMat(matToMatOption(mat))}
                          testIdPrefix="topmat"
                        />
                      </div>

                      {/* Accent Mat */}
                      <div className="space-y-3 pt-4 border-t border-border">
                        <div>
                          <Label className="text-base font-semibold">Accent Mat</Label>
                          <p className="text-sm text-muted-foreground">
                            Secondary mat layer showing through reveal
                          </p>
                        </div>
                        <ColorSwatchesWithSeparator
                          standardColors={standardMats}
                          premiumColors={premiumMats}
                          selectedId={selectedBottomMat.sku}
                          onSelect={(mat) => setSelectedBottomMat(matToMatOption(mat))}
                          testIdPrefix="bottommat"
                        />
                      </div>

                      {/* Backing Color */}
                      <div className="space-y-3 pt-4 border-t border-border">
                        <div>
                          <Label className="text-base font-semibold">Backing Color</Label>
                          <p className="text-sm text-muted-foreground">
                            Background color behind jersey and mats
                          </p>
                        </div>
                        <ColorSwatchesWithSeparator
                          standardColors={standardMats}
                          premiumColors={premiumMats}
                          selectedId={selectedBacking.sku}
                          onSelect={(mat) => setSelectedBacking(matToMatOption(mat))}
                          testIdPrefix="backing"
                        />
                      </div>

                      {/* Bottom-Weighted Matting Option - Classic layouts only */}
                      {selectedLayoutType === "classic" && (
                        <div className="pt-4 border-t border-border">
                          <BottomWeightedMatting
                            checked={bottomWeighted}
                            onCheckedChange={setBottomWeighted}
                            testIdPrefix="jersey"
                          />
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>

                  {/* Brass Nameplate - Premium layouts only (Type C behavior) */}
                  {currentLayout.allowsPlaque && (
                    <AccordionItem value="nameplate" className="border rounded-lg px-4 lg:px-6">
                      <AccordionTrigger
                        className="hover:no-underline"
                        data-testid="accordion-nameplate"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-primary font-bold text-sm">Aa</span>
                          </div>
                          <div className="text-left">
                            <div className="font-semibold">Brass Nameplate</div>
                            <div className="text-sm text-muted-foreground">
                              {brassNameplateConfig.enabled ? "Enabled" : "Optional engraving"}
                            </div>
                          </div>
                        </div>
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

                  {/* Hanging Hardware */}
                  <AccordionItem value="hardware" className="border rounded-lg px-4 lg:px-6">
                    <AccordionTrigger
                      className="hover:no-underline"
                      data-testid="accordion-hardware"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Shield className="w-5 h-5 text-primary" />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold">Hanging Hardware</div>
                          <div className="text-sm text-muted-foreground">Standard or Security</div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 pb-6">
                      <HangingHardwareSection
                        hardwareType={hardware}
                        setHardwareType={setHardware}
                        frameWidth={frameWidth}
                        frameHeight={frameHeight}
                      />
                    </AccordionContent>
                  </AccordionItem>

                  {/* Assembly Instructions */}
                  <AccordionItem value="instructions" className="border rounded-lg px-4 lg:px-6">
                    <AccordionTrigger
                      className="hover:no-underline"
                      data-testid="accordion-instructions"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Info className="w-5 h-5 text-primary" />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold">Assembly Instructions</div>
                          <div className="text-sm text-muted-foreground">
                            How to mount your jersey
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 pt-2 pb-4">
                      <p className="text-sm text-muted-foreground">
                        Professional jersey mounting instructions for optimal display:
                      </p>
                      <ol className="text-sm space-y-2 list-decimal list-inside">
                        <li>
                          <strong>Press or steam</strong> the jersey to remove any creases or
                          wrinkles
                        </li>
                        <li>
                          <strong>Trace the jersey</strong> over the included stiff insert board
                        </li>
                        <li>
                          <strong>Cut the board</strong> to match the jersey shape
                        </li>
                        <li>
                          <strong>Insert the cutout</strong> inside the jersey to keep it stiff
                        </li>
                        <li>
                          <strong>Stitch the mounted jersey</strong> onto the back of the mat
                        </li>
                      </ol>
                      <p className="text-xs text-muted-foreground italic mt-3">
                        Note: Following these steps prevents sagging and ensures your jersey
                        maintains its shape for years to come. Insert board included with every
                        jersey frame kit.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Standardized Price Box - Desktop Only */}
                <PriceBox
                  totalPrice={pricing.total}
                  quantity={quantity}
                  onQuantityChange={setQuantity}
                  onAddToCart={handleAddToCart}
                  onCopyLink={handleCopyLink}
                  priceItems={priceItems}
                  testIdPrefix=""
                />
              </div>
            </div>
          </div>

          {/* Style Inspiration - Full Width Jersey Lifestyle Carousel */}
          <div className="mt-12 space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Style Inspiration</h2>
              <p className="text-muted-foreground">
                Real jersey frame displays showing professional sports memorabilia framing
              </p>
            </div>
            <JerseyLifestyleCarousel />
          </div>
        </div>

        {/* Share Dialog */}
        <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share Your Design</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Share this link to show others your custom jersey frame configuration.
              </p>
              <div className="flex gap-2">
                <Input
                  value={
                    typeof window !== "undefined" && window.location ? window.location.href : ""
                  }
                  readOnly
                  className="flex-1"
                  data-testid="input-share-url"
                />
                <Button onClick={handleShare} data-testid="button-copy-link">
                  Copy Link
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Fullscreen Preview Dialog */}
        <Dialog open={showFullscreenPreview} onOpenChange={setShowFullscreenPreview}>
          <DialogContent
            className="max-w-[100vw] w-screen h-screen max-h-screen p-0 border-0"
            aria-describedby="fullscreen-preview-description"
          >
            <DialogHeader className="sr-only">
              <DialogTitle>Jersey Frame Preview</DialogTitle>
              <p id="fullscreen-preview-description">
                Full-size preview of your custom jersey frame design with team colors, mat
                selection, and layout configuration.
              </p>
            </DialogHeader>
            <div className="relative w-full h-full flex items-center justify-center bg-white">
              <div className="w-full h-full flex items-center justify-center p-8">
                <div style={{ filter: "drop-shadow(0 8px 32px rgba(0, 0, 0, 0.15))" }}>
                  <JerseyPreviewCanvas
                    layout={layout}
                    framePhotos={framePhotos}
                    matPaths={matPaths}
                    selectedLayout={selectedLayout}
                    currentLayout={currentLayout}
                    selectedFrame={selectedFrame}
                    topMatColor={selectedTopMat}
                    bottomMatColor={selectedBottomMat}
                    backingColor={selectedBacking}
                    brassNameplateConfig={brassNameplateConfig}
                    bottomWeightedExtra={bottomWeightedExtra}
                  />
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Mobile Sticky Bottom Bar - Inline Implementation */}
      <div
        className={`block md:hidden fixed left-0 right-0 bottom-0 bg-background/95 backdrop-blur-sm border-t border-border shadow-lg z-50 transition-all duration-300 ease-in-out ${
          showMobileBar
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="px-4 py-3">
          <div className="flex items-center gap-2">
            {/* Total Price Display */}
            <div className="flex flex-col gap-0.5 min-w-[60px]">
              <span className="text-xs text-muted-foreground">Total</span>
              <span className="font-bold text-sm" data-testid="text-mobile-sticky-total-price">
                ${(pricing.total * quantity).toFixed(2)}
              </span>
            </div>

            {/* Quantity Input */}
            <div className="flex flex-col gap-0.5">
              <Label htmlFor="quantity-sticky" className="text-xs text-muted-foreground">
                Qty
              </Label>
              <QuantitySelector
                value={quantity}
                onChange={setQuantity}
                className="w-14 h-7 text-xs text-center p-0"
                testId="input-quantity-sticky"
              />
            </div>

            {/* Copy Link Button - Icon Only */}
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopyLink}
              data-testid="button-mobile-copy-link"
              className="h-11 w-11"
            >
              <Copy className="h-4 w-4" />
            </Button>

            {/* Add to Cart Button - Compact */}
            <Button
              size="default"
              onClick={handleAddToCart}
              data-testid="button-mobile-add-to-cart"
              className="flex-1 text-xs min-w-0 min-h-11"
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>

      {/* Floating Toggle Button (Mobile Only) - Bottom Right, above price bar */}
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
    </>
  );
}
