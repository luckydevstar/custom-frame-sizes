"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
// Removed wouter useLocation - not needed in Next.js
import { Copy, Maximize, Eye, Settings, Info } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
// Badge not currently used
// import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
// Select components not currently used
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
// Separator not currently used
// import { Separator } from "../ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
// Alert components not currently used
// import { Alert, AlertDescription } from "../ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { QuantitySelector } from "../ui/quantity-selector";
import { PriceBox } from "../ui/PriceBox";
import type { PriceLineItem } from "../ui/PriceBox";
// Import types from @framecraft/types
import type { FrameStyle, AlternateImage } from "@framecraft/types";

// Import services from @framecraft/core
import { getFramesByCategory, getGlassTypes, getSharedAssetUrl } from "@framecraft/core";

// Import hooks from @framecraft/core
import { useIsMobile, useMobileViewToggle } from "@framecraft/core";

// Import config from @framecraft/config
import { ALL_MATS, getMatById, type Mat } from "@framecraft/config";

// Import UI components from same package
import { ColorSwatchesWithSeparator } from "../ui/ColorSwatches";

// TODO: Extract these app-specific dependencies or make them injectable
// - useToast hook
// - useIntelligentPreviewSizing hook
// - BrassNameplateSection component
// - @shared/schema types
// - playbillLayouts utilities (PLAYBILL_LAYOUTS, PLAQUE_FRAME_EXTENSION)
// - PlaybillPreview component
// - usePlaybillPricing hook
// - PlaybillLayoutGallery component
// - TrustBadges component
// - PlaybillLifestyleCarousel component
// - HangingHardwareSection, BottomWeightedMatting components
import { useToast } from "../../hooks/use-toast";
import { useIntelligentPreviewSizing } from "@framecraft/core";
import { BrassNameplateSection } from "../brass-nameplate/BrassNameplateSection";
import type { BrassNameplateConfig } from "@framecraft/types";
// import { BRASS_NAMEPLATE_SPECS, getTypeABottomBorder } from "@framecraft/types";
import {
  PLAYBILL_LAYOUTS,
  PLAQUE_FRAME_EXTENSION,
  getRandomPlaybillInserts,
  getRandomTicketInserts,
  createPlaybillInsertSeed,
  type PlaybillLayoutType,
} from "@framecraft/core";
import { PlaybillPreview } from "./PlaybillPreview";
import { usePlaybillPricing } from "@framecraft/core";
import { PlaybillLayoutGallery } from "./PlaybillLayoutGallery";
import { PlaybillLifestyleCarousel } from "./PlaybillLifestyleCarousel";
import { TrustBadges } from "../marketing/TrustBadges";
import { HangingHardwareSection } from "./shared/HangingHardwareSection";
import { BottomWeightedMatting, BOTTOM_WEIGHTED_EXTRA } from "./shared/BottomWeightedMatting";

// Get product data from services
const shadowboxFrames = getFramesByCategory("shadowbox");
const allGlassTypes = getGlassTypes();
const glassTypes = allGlassTypes.filter((g) => g.id === "standard" || g.id === "non-glare");

// Playbill lifestyle images (29 total) – paths under shared_assets/playbill/lifestyle
const PLAYBILL_LIFESTYLE_IMAGES: Array<{ url: string; alt: string }> = [
  {
    url: getSharedAssetUrl("playbill/lifestyle/playbill-lifestyle-1.jpg"),
    alt: "Hamilton, Lion King, and Wicked Playbills in black frame",
  },
  {
    url: getSharedAssetUrl("playbill/lifestyle/playbill-lifestyle-2.jpg"),
    alt: "Wicked Playbill in black frame",
  },
  {
    url: getSharedAssetUrl("playbill/lifestyle/playbill-lifestyle-3.jpg"),
    alt: "Hamilton Playbill in natural wood frame",
  },
  {
    url: getSharedAssetUrl("playbill/lifestyle/playbill-lifestyle-4.jpg"),
    alt: "Book of Mormon Playbill in black frame",
  },
  {
    url: getSharedAssetUrl("playbill/lifestyle/playbill-lifestyle-5.jpg"),
    alt: "Hamilton Playbill with ticket stub in dark frame",
  },
  {
    url: getSharedAssetUrl("playbill/lifestyle/playbill-lifestyle-6.jpg"),
    alt: "Twelve Playbill collection in black frame",
  },
  {
    url: getSharedAssetUrl("playbill/lifestyle/playbill-lifestyle-7.jpg"),
    alt: "Lion King Playbill in black frame",
  },
  {
    url: getSharedAssetUrl("playbill/lifestyle/playbill-lifestyle-8.jpg"),
    alt: "Wicked Playbill with ticket in black frame",
  },
  {
    url: getSharedAssetUrl("playbill/lifestyle/playbill-lifestyle-9.jpg"),
    alt: "Dear Evan Hansen, Hadestown, and Six Playbills in black frame",
  },
  {
    url: getSharedAssetUrl("playbill/lifestyle/playbill-lifestyle-10.jpg"),
    alt: "Hamilton Playbill in dark frame",
  },
  {
    url: getSharedAssetUrl("playbill/lifestyle/playbill-lifestyle-11.jpg"),
    alt: "Cats Playbill in natural wood frame",
  },
  {
    url: getSharedAssetUrl("playbill/lifestyle/playbill-lifestyle-12.jpg"),
    alt: "Wicked Playbill with ticket stub in black frame",
  },
  {
    url: getSharedAssetUrl("playbill/lifestyle/playbill-lifestyle-13.jpg"),
    alt: "Lion King Playbill in black frame greenhouse setting",
  },
  {
    url: getSharedAssetUrl("playbill/lifestyle/playbill-lifestyle-14.jpg"),
    alt: "Hamilton Playbill with ticket stub in black frame cafe setting",
  },
  {
    url: getSharedAssetUrl("playbill/lifestyle/playbill-lifestyle-15.jpg"),
    alt: "Hamilton, Wicked, Lion King triple Playbill in black frame",
  },
  {
    url: getSharedAssetUrl("playbill/lifestyle/playbill-lifestyle-16.jpg"),
    alt: "Phantom of the Opera Playbill with ticket in dark frame",
  },
  {
    url: getSharedAssetUrl("playbill/lifestyle/playbill-lifestyle-17.jpg"),
    alt: "Wicked Playbill with ticket in natural wood frame park setting",
  },
  {
    url: getSharedAssetUrl("playbill/lifestyle/playbill-lifestyle-18.jpg"),
    alt: "Les Miserables, Phantom, Chicago triple Playbill in black frame",
  },
  {
    url: getSharedAssetUrl("playbill/lifestyle/playbill-lifestyle-19.jpg"),
    alt: "Phantom, Wicked, Hamilton triple Playbill in black frame",
  },
  {
    url: getSharedAssetUrl("playbill/lifestyle/playbill-lifestyle-20.jpg"),
    alt: "Phantom of the Opera Playbill in natural wood frame library setting",
  },
  {
    url: getSharedAssetUrl("playbill/lifestyle/playbill-lifestyle-21.jpg"),
    alt: "Hamilton, Phantom, Hadestown triple Playbill in walnut frame outdoor cafe",
  },
  {
    url: getSharedAssetUrl("playbill/lifestyle/playbill-lifestyle-22.jpg"),
    alt: "Wicked Playbill in black frame cozy living room",
  },
  {
    url: getSharedAssetUrl("playbill/lifestyle/playbill-lifestyle-23.jpg"),
    alt: "Wicked Playbill in walnut frame Central Park setting",
  },
  {
    url: getSharedAssetUrl("playbill/lifestyle/playbill-lifestyle-24.jpg"),
    alt: "Phantom, Hadestown, Come From Away triple Playbill in walnut frame library",
  },
  {
    url: getSharedAssetUrl("playbill/lifestyle/playbill-lifestyle-25.jpg"),
    alt: "Phantom of the Opera Playbill with ticket in black frame art studio",
  },
  {
    url: getSharedAssetUrl("playbill/lifestyle/playbill-lifestyle-26.jpg"),
    alt: "Hamilton, Wicked, Lion King triple Playbill in black frame library",
  },
  {
    url: getSharedAssetUrl("playbill/lifestyle/playbill-lifestyle-27.jpg"),
    alt: "Wicked Playbill in black frame vintage theater decor",
  },
  {
    url: getSharedAssetUrl("playbill/lifestyle/playbill-lifestyle-28.jpg"),
    alt: "Hamilton Playbill in black frame Central Park",
  },
  {
    url: getSharedAssetUrl("playbill/lifestyle/playbill-lifestyle-29.jpg"),
    alt: "Phantom of the Opera Playbill in black frame coffee shop",
  },
];

interface PlaybillFrameDesignerProps {
  defaultFrameId?: string;
  embedded?: boolean;
}

export function PlaybillFrameDesigner({
  defaultFrameId,
  embedded = false,
}: PlaybillFrameDesignerProps) {
  // Removed useLocation() - not needed in Next.js
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { mobileView, setMobileView, showMobileBar, previewCardRef, controlsHeadingRef } =
    useMobileViewToggle({ isMobile });

  // URL parameters
  const urlParams = useMemo(() => new URLSearchParams(window.location.search), []);

  // Initialize frame selection
  const initialFrame = useMemo(() => {
    if (defaultFrameId) {
      const frame = shadowboxFrames.find(
        (f) => f.id === defaultFrameId || f.sku === defaultFrameId
      );
      return frame ?? shadowboxFrames[0];
    }
    const frameParam = urlParams.get("frame");
    if (frameParam) {
      const frame = shadowboxFrames.find((f) => f.id === frameParam || f.sku === frameParam);
      return frame ?? shadowboxFrames[0];
    }
    // Default to SKU 8693 (black shadowbox)
    return shadowboxFrames[0];
    const defaultFrame = shadowboxFrames.find((f) => f.sku === "8693");
    return defaultFrame || shadowboxFrames[0];
  }, [defaultFrameId, urlParams]);

  // Designer state
  const [selectedLayout, setSelectedLayout] = useState<PlaybillLayoutType>(() => {
    const urlLayout = urlParams.get("layout") as PlaybillLayoutType;
    if (urlLayout && PLAYBILL_LAYOUTS.find((l) => l.id === urlLayout)) {
      return urlLayout;
    }
    return "playbill-single";
  });

  const [selectedFrame, setSelectedFrame] = useState<FrameStyle>(
    () => initialFrame ?? shadowboxFrames[0]!
  );

  // Mat configuration
  const [selectedMat, setSelectedMat] = useState<Mat>(() => {
    const urlMat = urlParams.get("mat");
    const mat = urlMat ? getMatById(urlMat) : getMatById("mat-1");
    return mat ?? ALL_MATS[0]!; // Default: White
  });

  const [selectedMatInner, setSelectedMatInner] = useState<Mat>(() => {
    const urlMatInner = urlParams.get("matInner");
    const mat = urlMatInner ? getMatById(urlMatInner) : getMatById("mat-2");
    return mat ?? ALL_MATS[1]!; // Default: Black
  });

  const [matType, setMatType] = useState<"none" | "single" | "double">(() => {
    const urlMatType = urlParams.get("matType");
    // Sanitize: only accept "none", "single" or "double", default to "single" for legacy/invalid values
    return urlMatType === "none" || urlMatType === "single" || urlMatType === "double"
      ? urlMatType
      : "single";
  });

  const [bottomWeighted, setBottomWeighted] = useState(() => {
    return urlParams.get("bottomWeighted") === "true";
  });

  // Fixed mat dimensions
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
      includeFlag: false,
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
        includeFlag: false,
      };
    } catch {
      return defaultConfig;
    }
  });

  // UI state
  const [_showShareDialog, _setShowShareDialog] = useState(false);
  const [showFullscreenPreview, setShowFullscreenPreview] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<
    "preview" | "corner" | "profile" | "lifestyle"
  >("preview");
  const [fullscreenLifestyleUrl, setFullscreenLifestyleUrl] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [pricingSidebarExpanded, setPricingSidebarExpanded] = useState(false);
  // Frame photos state
  const [framePhotos, setFramePhotos] = useState<{
    cornerUrl?: string;
    profileUrl?: string;
    topUrl?: string;
    bottomUrl?: string;
    leftUrl?: string;
    rightUrl?: string;
  }>({});

  // Random lifestyle photo
  const [randomLifestylePhoto, setRandomLifestylePhoto] = useState<{ url: string; alt: string }>({
    url: "",
    alt: "Playbill display lifestyle photo",
  });

  // Refs
  const designerSectionRef = useRef<HTMLDivElement>(null);
  const hardwareSectionRef = useRef<HTMLDivElement>(null);

  // Scroll to designer function
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // @ts-expect-error - Unused function kept for potential future use
  const _scrollToDesigner = useCallback(() => {
    designerSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  // Load frame photos
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

  // Select random lifestyle photo on page load and frame selection change
  useEffect(() => {
    if (PLAYBILL_LIFESTYLE_IMAGES.length > 0) {
      const randomIndex = Math.floor(Math.random() * PLAYBILL_LIFESTYLE_IMAGES.length);
      const photo = PLAYBILL_LIFESTYLE_IMAGES[randomIndex];
      if (photo) setRandomLifestylePhoto(photo);
    }
  }, [selectedFrame.sku]);

  // Get current layout details
  const currentLayout = useMemo(() => {
    const layout = PLAYBILL_LAYOUTS.find((l) => l.id === selectedLayout);
    // Fallback to single playbill if layout not found (defensive guard)
    return layout || PLAYBILL_LAYOUTS.find((l) => l.id === "playbill-single")!;
  }, [selectedLayout]);

  const insertSeed = useMemo(
    () => createPlaybillInsertSeed(selectedLayout, selectedFrame.id, matType),
    [selectedLayout, selectedFrame.id, matType]
  );
  const playbillInserts = useMemo(
    () => getRandomPlaybillInserts(currentLayout.playbillCount, insertSeed),
    [currentLayout.playbillCount, insertSeed]
  );
  const ticketInserts = useMemo(
    () => getRandomTicketInserts(currentLayout.ticketCount, insertSeed),
    [currentLayout.ticketCount, insertSeed]
  );

  // Check if current layout is single-opening (allows No Mat option)
  const isSingleOpeningLayout = useMemo(() => {
    return (
      selectedLayout === "playbill-single" ||
      (currentLayout.playbillCount === 1 && currentLayout.ticketCount === 0)
    );
  }, [selectedLayout, currentLayout]);

  // Force matType to 'single' when switching from single-opening to multi-opening layout
  useEffect(() => {
    if (!isSingleOpeningLayout && matType === "none") {
      setMatType("single");
    }
  }, [isSingleOpeningLayout, matType]);

  // Bottom weighted matting adds 0.5" to the bottom mat border
  const bottomWeightedExtra = bottomWeighted ? BOTTOM_WEIGHTED_EXTRA : 0;

  // Use intelligent preview sizing hook for responsive container dimensions
  // Include bottomWeightedExtra in frameHeight for proper container sizing
  const { containerRef, previewContainerHeight, containerWidth } = useIntelligentPreviewSizing({
    frameWidth: currentLayout.frameWidth,
    frameHeight: currentLayout.frameHeight + bottomWeightedExtra,
    plaqueEnabled: brassNameplateConfig.enabled,
    plaqueExtension: PLAQUE_FRAME_EXTENSION, // 0.75" for playbill
    isMobile,
    // Custom overrides to match previous behavior (was minHeight: 400, maxHeight: isMobile ? 600 : 900)
    minHeightMobile: 400,
    maxHeightMobile: 600,
    minHeightDesktop: 400,
  });

  // Calculate pricing
  const pricing = usePlaybillPricing({
    frame: selectedFrame,
    layoutId: selectedLayout,
    matType,
    glass: selectedGlass,
    hardware,
    brassPlaqueEnabled: brassNameplateConfig.enabled,
  });

  // Desktop pricing sidebar scroll tracking
  useEffect(() => {
    if (isMobile || !hardwareSectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) {
          setPricingSidebarExpanded(!entry.isIntersecting);
        }
      },
      { threshold: 0, rootMargin: "-100px 0px 0px 0px" }
    );

    observer.observe(hardwareSectionRef.current);
    return () => observer.disconnect();
  }, [isMobile]);

  // Share configuration
  const handleShare = useCallback(() => {
    const params = new URLSearchParams();
    params.set("layout", selectedLayout);
    params.set("frame", selectedFrame.id);
    params.set("mat", selectedMat.id);
    if (matType === "double") params.set("matInner", selectedMatInner.id);
    params.set("matType", matType);
    params.set("glass", selectedGlass?.id ?? "");
    params.set("hardware", hardware);
    if (bottomWeighted) {
      params.set("bottomWeighted", "true");
    }
    if (brassNameplateConfig.enabled) {
      params.set("nameplateEnabled", "true");
      if (brassNameplateConfig.line1) params.set("nameplateLine1", brassNameplateConfig.line1);
      if (brassNameplateConfig.line2) params.set("nameplateLine2", brassNameplateConfig.line2);
      if (brassNameplateConfig.line3) params.set("nameplateLine3", brassNameplateConfig.line3);
      params.set("nameplateFont", brassNameplateConfig.font);
      params.set("nameplateColor", brassNameplateConfig.color);
    }

    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    navigator.clipboard.writeText(url);

    toast({
      title: "Link copied!",
      description: "Design link copied to clipboard",
    });

    _setShowShareDialog(false);
  }, [
    selectedLayout,
    selectedFrame,
    selectedMat,
    selectedMatInner,
    matType,
    selectedGlass,
    hardware,
    bottomWeighted,
    brassNameplateConfig,
    toast,
  ]);

  // Add to cart handler
  const handleAddToCart = useCallback(async () => {
    toast({
      title: "Added to cart!",
      description: `${quantity}× Playbill Frame - ${currentLayout?.name}`,
    });
  }, [quantity, currentLayout, toast]);

  // Split mats into standard and premium for color swatches
  // Hide Terracotta (lineNumber 28) on desktop
  const standardMats = ALL_MATS.filter((m) => !m.isPremium && m.lineNumber !== 28);
  const premiumMats = ALL_MATS.filter((m) => m.isPremium);

  // Build itemized pricing structure for PriceBox
  const priceItems: PriceLineItem[] = useMemo(() => {
    const items: PriceLineItem[] = [];

    // Frame + Glazing price (new pricing engine includes glazing in frame price)
    const glazingLabel = selectedGlass?.id === "non-glare" ? "Non-Glare" : "Standard";
    items.push({
      label: `Shadowbox Frame & ${glazingLabel} Glazing`,
      amount: pricing.framePrice,
      testId: "price-frame",
    });

    // Mat price
    if (pricing.matPrice > 0) {
      items.push({
        label: matType === "double" ? "Double Mat Board" : "Mat Board",
        amount: pricing.matPrice,
        testId: "price-mat",
      });
    }

    // Hardware
    if (hardware === "security") {
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
    if (brassNameplateConfig.enabled) {
      items.push({
        label: "Engraved Brass Nameplate",
        amount: pricing.nameplatePrice,
        testId: "price-nameplate",
      });
    }

    return items;
  }, [pricing, selectedGlass, hardware, matType, brassNameplateConfig.enabled]);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 pb-24 lg:pb-0">
        {/* Mobile Header */}
        {isMobile && embedded && (
          <div className="lg:hidden border-b bg-card/50 sticky top-0 z-40">
            <div className="px-4 py-3">
              <h1 className="text-lg font-bold">Playbill Frame Designer</h1>
            </div>
          </div>
        )}

        <div ref={designerSectionRef} className="container mx-auto px-4 py-6 lg:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Left: Preview */}
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

                    <PlaybillPreview
                      framePhotos={framePhotos}
                      selectedFrame={selectedFrame}
                      topMatColor={selectedMat}
                      bottomMatColor={matType === "double" ? selectedMatInner : selectedMat}
                      matType={matType}
                      matReveal={MAT_REVEAL}
                      layoutId={selectedLayout}
                      containerWidth={containerWidth}
                      containerHeight={previewContainerHeight}
                      brassNameplateConfig={brassNameplateConfig}
                      isMobile={isMobile}
                      bottomWeightedExtra={bottomWeightedExtra}
                      playbillInserts={playbillInserts}
                      ticketInserts={ticketInserts}
                    />
                  </div>

                  {/* Sample image caption */}
                  <p className="text-xs text-muted-foreground/60 text-center mt-2">
                    Sample image. Not included with purchase.
                  </p>

                  {/* Dimensions Box */}
                  {currentLayout && (
                    <div className="mt-4 p-3 bg-muted/50 rounded-md text-sm space-y-0.5">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          Finished Size:{" "}
                          <span className="text-primary">
                            {currentLayout.frameWidth.toFixed(2)}&quot; ×{" "}
                            {(
                              currentLayout.frameHeight +
                              bottomWeightedExtra +
                              (brassNameplateConfig.enabled ? PLAQUE_FRAME_EXTENSION : 0)
                            ).toFixed(2)}
                            &quot;
                          </span>
                        </p>
                        {selectedFrame.dimensionalDiagram && (
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
                        )}
                      </div>
                      <p className="text-muted-foreground text-xs">
                        Layout: {currentLayout.name} • Playbill: 5.5&quot; × 8.5&quot;
                        {matType === "double" && <> • Reveal: {MAT_REVEAL}&quot;</>}
                      </p>
                    </div>
                  )}

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
                          data-testid="button-view-corner"
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
                          data-testid="button-view-corner"
                        >
                          <img
                            src={framePhotos.cornerUrl}
                            alt="Frame corner detail"
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ) : (
                        <div className="aspect-square rounded-md border-2 border-dashed border-border flex items-center justify-center bg-muted/30">
                          <p className="text-xs text-muted-foreground text-center p-2">
                            Frame Corner
                          </p>
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
                          data-testid="button-view-profile"
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
                          data-testid="button-view-profile"
                        >
                          <img
                            src={framePhotos.profileUrl}
                            alt="Frame profile view"
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ) : (
                        <div className="aspect-square rounded-md border-2 border-dashed border-border flex items-center justify-center bg-muted/30">
                          <p className="text-xs text-muted-foreground text-center p-2">Profile</p>
                        </div>
                      );
                    })()}

                    {/* Lifestyle Photo */}
                    {randomLifestylePhoto.url ? (
                      <button
                        onClick={() => {
                          setFullscreenImage("lifestyle");
                          setFullscreenLifestyleUrl(randomLifestylePhoto.url);
                          setShowFullscreenPreview(true);
                        }}
                        className="aspect-square rounded-md border overflow-hidden bg-background hover-elevate active-elevate-2"
                        data-testid="button-view-lifestyle"
                      >
                        <img
                          src={randomLifestylePhoto.url}
                          alt={randomLifestylePhoto.alt}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ) : (
                      <div className="aspect-square rounded-md border-2 border-dashed border-border flex items-center justify-center bg-muted/30">
                        <p className="text-xs text-muted-foreground text-center p-2">Lifestyle</p>
                      </div>
                    )}
                  </div>

                  {/* Trust Badges */}
                  {!isMobile && <TrustBadges />}
                </div>
              </Card>
            </div>

            {/* Right: Controls */}
            <div className={`${isMobile && mobileView === "preview" ? "hidden" : ""} space-y-6`}>
              <h2 ref={controlsHeadingRef} className="text-2xl font-bold mb-2 lg:hidden">
                Customize Your Frame
              </h2>

              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-4 hidden lg:block">
                  Configure Your Playbill Frame
                </h2>

                <Accordion
                  type="multiple"
                  defaultValue={[
                    "layout",
                    "frame-style",
                    "mat-options",
                    "glazing",
                    "hardware",
                    "brass-nameplate",
                  ]}
                  className="space-y-4"
                >
                  {/* Section 1: Layout Selection */}
                  <AccordionItem value="layout" className="border rounded-lg px-4 lg:px-6">
                    <AccordionTrigger
                      className="text-base font-semibold hover:no-underline py-4"
                      data-testid="accordion-layout"
                    >
                      Layout Selection
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Label className="text-base font-semibold">Choose Your Layout</Label>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p>
                                Select a layout based on how many playbills and tickets you want to
                                display
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </div>

                        <PlaybillLayoutGallery
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
                      data-testid="accordion-frame"
                    >
                      Frame Style
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <div className="p-2.5 bg-muted/50 rounded-md text-xs text-muted-foreground">
                        <p>
                          <strong className="text-foreground">Moulding Width:</strong> The width of
                          the frame
                        </p>
                        <p className="mt-1">
                          <strong className="text-foreground">Usable Depth:</strong> The depth
                          inside the frame
                        </p>
                      </div>
                      <div className="max-h-[400px] overflow-y-auto pr-2">
                        <div className="grid grid-cols-2 gap-2">
                          {shadowboxFrames.map((frame) => (
                            <button
                              key={frame.id}
                              onClick={() => setSelectedFrame(frame)}
                              className={`p-3 rounded-md border-2 text-left hover-elevate active-elevate-2 ${
                                selectedFrame.id === frame.id
                                  ? "border-primary"
                                  : "border-transparent"
                              }`}
                              data-testid={`button-select-frame-${frame.sku}`}
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
                                  <span>Width: {frame.mouldingWidth}&quot;</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <span>Depth: {frame.usableDepth}&quot;</span>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Section 3: Mat Options */}
                  <AccordionItem value="mat-options" className="border rounded-lg px-4 lg:px-6">
                    <AccordionTrigger
                      className="text-base font-semibold hover:no-underline py-4"
                      data-testid="accordion-mat"
                    >
                      Mat Options
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4">
                      <div className="space-y-4">
                        {/* Mat Type Selection */}
                        <div
                          className={`grid gap-2 ${isSingleOpeningLayout ? "grid-cols-3" : "grid-cols-2"}`}
                        >
                          {isSingleOpeningLayout && (
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

                        {/* Bottom Weighted Matting */}
                        <BottomWeightedMatting
                          checked={bottomWeighted}
                          onCheckedChange={setBottomWeighted}
                          testIdPrefix="playbill"
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

                        {/* Bottom Mat Color (Double Mat Only) */}
                        {matType === "double" && (
                          <div className="space-y-3">
                            <Label className="text-base font-semibold">
                              Bottom Mat Color (Reveal): {selectedMatInner.name}
                            </Label>
                            <ColorSwatchesWithSeparator
                              standardColors={standardMats}
                              premiumColors={premiumMats}
                              selectedId={selectedMatInner.id}
                              onSelect={setSelectedMatInner}
                              testIdPrefix="mat-inner"
                            />
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Section 4: Brass Nameplate (hidden when No Mat selected) */}
                  {matType !== "none" && (
                    <AccordionItem
                      value="brass-nameplate"
                      className="border rounded-lg px-4 lg:px-6"
                    >
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
                        />
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {/* Section 5: Glazing */}
                  <AccordionItem value="glazing" className="border rounded-lg px-4 lg:px-6">
                    <AccordionTrigger
                      className="text-base font-semibold hover:no-underline py-4"
                      data-testid="accordion-glass"
                    >
                      Glazing
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <RadioGroup
                        value={selectedGlass?.id ?? ""}
                        onValueChange={(value) => {
                          const glass = glassTypes.find((g) => g.id === value);
                          if (glass) setSelectedGlass(glass);
                        }}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {glassTypes.map((glass) => (
                            <div key={glass.id} className="flex items-center space-x-2 py-2">
                              <RadioGroupItem
                                value={glass.id}
                                id={glass.id}
                                data-testid={`radio-glass-${glass.id}`}
                              />
                              <Label htmlFor={glass.id}>{glass.name}</Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Section 6: Hardware */}
                  <AccordionItem
                    value="hardware"
                    className="border rounded-lg px-4 lg:px-6"
                    ref={hardwareSectionRef}
                  >
                    <AccordionTrigger
                      className="text-base font-semibold hover:no-underline py-4"
                      data-testid="accordion-hardware"
                    >
                      Hanging Hardware
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <HangingHardwareSection
                        hardwareType={hardware}
                        setHardwareType={setHardware}
                        frameWidth={currentLayout.frameWidth}
                        frameHeight={currentLayout.frameHeight}
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </Card>

              {/* Pricing Summary Card - Desktop Only */}
              <PriceBox
                totalPrice={pricing.total}
                quantity={quantity}
                onQuantityChange={setQuantity}
                onAddToCart={handleAddToCart}
                onCopyLink={handleShare}
                priceItems={priceItems}
                testIdPrefix="playbill-"
                className={`transition-all ${pricingSidebarExpanded ? "top-6" : "top-20"}`}
              />
            </div>
          </div>

          {/* Lifestyle Photo Carousel (eyebrow + title in carousel) */}
          <section className="mt-12">
            <PlaybillLifestyleCarousel />
          </section>
        </div>

        {/* Mobile Sticky Price Bar - Inline Implementation */}
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
                    data-testid="text-playbill-mobile-sticky-total-price"
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
                    testId="input-playbill-quantity-sticky"
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleShare}
                  data-testid="button-playbill-mobile-copy-link"
                  className="h-11 w-11"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  size="default"
                  onClick={handleAddToCart}
                  data-testid="button-playbill-mobile-add-to-cart"
                  className="flex-1 text-xs min-w-0 min-h-11"
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Floating Toggle Button (Mobile Only) - Always render, visibility via CSS */}
        {!embedded && (
          <Button
            size="lg"
            className={`fixed bottom-20 right-6 z-[60] lg:hidden shadow-lg rounded-full h-14 px-6 transition-all duration-300 ${
              showMobileBar
                ? "visible opacity-100 translate-y-0"
                : "invisible opacity-0 translate-y-8"
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

        {/* Fullscreen Preview Dialog */}
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
                    <PlaybillPreview
                      framePhotos={framePhotos}
                      selectedFrame={selectedFrame}
                      topMatColor={selectedMat}
                      bottomMatColor={matType === "double" ? selectedMatInner : selectedMat}
                      matType={matType}
                      matReveal={MAT_REVEAL}
                      layoutId={selectedLayout}
                      containerWidth={window.innerWidth - 100}
                      containerHeight={window.innerHeight - 200}
                      brassNameplateConfig={brassNameplateConfig}
                      isMobile={false}
                      bottomWeightedExtra={bottomWeightedExtra}
                      playbillInserts={playbillInserts}
                      ticketInserts={ticketInserts}
                    />
                  </div>
                </div>
              )}
              {fullscreenImage === "corner" && framePhotos.cornerUrl && (
                <img
                  src={framePhotos.cornerUrl}
                  alt="Frame corner detail"
                  className="max-w-full max-h-full object-contain"
                />
              )}
              {fullscreenImage === "profile" && framePhotos.profileUrl && (
                <img
                  src={framePhotos.profileUrl}
                  alt="Frame profile view"
                  className="max-w-full max-h-full object-contain"
                />
              )}
              {fullscreenImage === "lifestyle" && fullscreenLifestyleUrl && (
                <img
                  src={fullscreenLifestyleUrl}
                  alt="Lifestyle photo"
                  className="max-w-full max-h-full object-contain"
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
