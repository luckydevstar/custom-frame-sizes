"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Info, Maximize, Settings, Eye, ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Separator } from "../ui/separator";
import { Slider } from "../ui/slider";
import { Checkbox } from "../ui/checkbox";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Input } from "../ui/input";
import { QuantitySelector } from "../ui/quantity-selector";
import { PriceBox } from "../ui/PriceBox";
import type { PriceLineItem } from "../ui/PriceBox";
import { useToast } from "../../hooks/use-toast";
import { useIsMobile, useMobileViewToggle, useIntelligentPreviewSizing } from "@framecraft/core";
import {
  getFramesByCategory,
  getGlassTypes,
  calculatePricing,
  parseFraction,
  computePreviewLayout,
} from "@framecraft/core";
import {
  getCurrencyLayout,
  getAllCurrencyLayouts,
  getCurrencyLayoutWithBrassNameplate,
  CURRENCY_CUSTOM_SIZE_LIMITS,
  createCustomCurrencyLayout,
  validateCurrencyCustomDimensions,
  CURRENCY_BACKING_OPTIONS,
  getCurrencyBackingById,
  getDefaultCurrencyBacking,
  getCurrencyLifestyleImages,
  getRandomCurrencyLifestyleImage,
  getStoreBaseAssetUrl,
} from "@framecraft/core";
import type { CurrencyLayoutType } from "@framecraft/core";
import type { FrameStyle, GlassType, FrameConfiguration } from "@framecraft/types";
import type { BrassNameplateConfig } from "@framecraft/types";
import { BRASS_NAMEPLATE_SPECS } from "@framecraft/types";
import { getMatsInDisplayOrder, getMatById, ALL_MATS, type Mat } from "@framecraft/config";
import { ColorSwatchesWithSeparator } from "../ui/ColorSwatches";
import { TrustBox } from "../marketing/TrustBox";
import { CurrencyPreviewCanvas } from "./CurrencyPreviewCanvas";
import { BrassNameplateSection } from "../brass-nameplate/BrassNameplateSection";
import { HangingHardwareSection } from "./shared/HangingHardwareSection";
import { BOTTOM_WEIGHTED_EXTRA } from "./shared/BottomWeightedMatting";

const shadowboxFrames = getFramesByCategory("shadowbox");
const availableLayouts = getAllCurrencyLayouts();
const glassTypes = getGlassTypes();

interface CurrencyFrameDesignerProps {
  defaultFrameId?: string;
  embedded?: boolean;
}

export function CurrencyFrameDesigner({
  defaultFrameId,
  embedded: _embedded = false,
}: CurrencyFrameDesignerProps) {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const {
    mobileView,
    setMobileView,
    showMobileBar,
    previewCardRef,
    controlsHeadingRef: _controlsHeadingRef,
  } = useMobileViewToggle({ isMobile });

  const urlParams = useMemo(() => {
    if (typeof window === "undefined") return new URLSearchParams();
    return new URLSearchParams(window.location.search);
  }, []);

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
    return shadowboxFrames[0];
  }, [defaultFrameId, urlParams]);

  const [selectedLayout, setSelectedLayout] = useState<CurrencyLayoutType>(() => {
    const urlLayout = urlParams.get("layout");
    const validLayouts: CurrencyLayoutType[] = ["compact", "standard", "large", "custom"];
    if (urlLayout && validLayouts.includes(urlLayout as CurrencyLayoutType)) {
      return urlLayout as CurrencyLayoutType;
    }
    return "standard";
  });

  const [customWidth, setCustomWidth] = useState(() => urlParams.get("customWidth") ?? "20");
  const [customHeight, setCustomHeight] = useState(() => urlParams.get("customHeight") ?? "16");

  const [selectedFrame, setSelectedFrame] = useState<FrameStyle>(initialFrame);

  const [selectedBackingId, setSelectedBackingId] = useState(() => {
    const urlBacking = urlParams.get("backing");
    if (urlBacking && getCurrencyBackingById(urlBacking)) return urlBacking;
    return "black";
  });

  const [selectedGlass, setSelectedGlass] = useState<GlassType>(() => {
    const urlGlass = urlParams.get("glass");
    if (urlGlass) {
      const glass = glassTypes.find((g) => g.id === urlGlass);
      if (glass) return glass;
    }
    return glassTypes[0];
  });

  const [hardware, setHardware] = useState<"standard" | "security">(
    (urlParams.get("hardware") as "standard" | "security") ?? "standard"
  );

  const [bottomWeighted, setBottomWeighted] = useState(
    () => urlParams.get("bottomWeighted") === "true"
  );

  const [matType, setMatType] = useState<"none" | "single" | "double">(() => {
    const urlMatType = urlParams.get("matType");
    if (urlMatType === "none" || urlMatType === "single" || urlMatType === "double")
      return urlMatType;
    return "double";
  });

  const [matBorderWidth, setMatBorderWidth] = useState("2.5");
  const [matRevealWidth, setMatRevealWidth] = useState("0.25");
  const matBorder = parseFloat(matBorderWidth) || 2.5;
  const matReveal = parseFloat(matRevealWidth) || 0.25;

  const [selectedTopMat, setSelectedTopMat] = useState<Mat>(() => {
    const urlTopMat = urlParams.get("topMat");
    if (urlTopMat) {
      const mat = getMatById(urlTopMat);
      if (mat) return mat;
    }
    return getMatById("mat-1") ?? ALL_MATS[0]!;
  });

  const [selectedAccentMat, setSelectedAccentMat] = useState<Mat>(() => {
    const urlAccentMat = urlParams.get("accentMat");
    if (urlAccentMat) {
      const mat = getMatById(urlAccentMat);
      if (mat) return mat;
    }
    return getMatById("mat-2") ?? ALL_MATS[1]!;
  });

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
      if (urlParams.get("nameplateEnabled") !== "true") return defaultConfig;
      return {
        enabled: true,
        line1: urlParams.get("nameplateLine1") ?? "",
        line2: urlParams.get("nameplateLine2") ?? "",
        line3: urlParams.get("nameplateLine3") ?? "",
        font: (urlParams.get("nameplateFont") as BrassNameplateConfig["font"]) ?? "georgia",
        color: (urlParams.get("nameplateColor") as BrassNameplateConfig["color"]) ?? "brass-black",
        includeFlag: urlParams.get("nameplateFlag") === "true",
      };
    } catch {
      return defaultConfig;
    }
  });

  const [showFullscreenPreview, setShowFullscreenPreview] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [lifestylePreviewImage, setLifestylePreviewImage] = useState(() =>
    getRandomCurrencyLifestyleImage()
  );

  const currencyLifestyleImages = useMemo(() => getCurrencyLifestyleImages(), []);

  useEffect(() => {
    setLifestylePreviewImage(getRandomCurrencyLifestyleImage());
  }, [selectedFrame.id]);

  useEffect(() => {
    if (matType === "none" && bottomWeighted) setBottomWeighted(false);
  }, [matType, bottomWeighted]);

  const sentinelRef = useRef<HTMLDivElement>(null);

  const parsedCustomWidth = parseFraction(customWidth);
  const parsedCustomHeight = parseFraction(customHeight);

  const customDimensionValidation = useMemo(() => {
    if (selectedLayout !== "custom") return { valid: true };
    return validateCurrencyCustomDimensions(parsedCustomWidth, parsedCustomHeight);
  }, [selectedLayout, parsedCustomWidth, parsedCustomHeight]);

  const currentLayout = useMemo(() => {
    if (selectedLayout === "custom") {
      const safeWidth = customDimensionValidation.valid
        ? parsedCustomWidth
        : CURRENCY_CUSTOM_SIZE_LIMITS.MIN_WIDTH;
      const safeHeight = customDimensionValidation.valid
        ? parsedCustomHeight
        : CURRENCY_CUSTOM_SIZE_LIMITS.MIN_HEIGHT;
      return createCustomCurrencyLayout(safeWidth, safeHeight);
    }
    return getCurrencyLayout(selectedLayout)!;
  }, [selectedLayout, parsedCustomWidth, parsedCustomHeight, customDimensionValidation.valid]);

  const backing = useMemo(
    () => getCurrencyBackingById(selectedBackingId) ?? getDefaultCurrencyBacking(),
    [selectedBackingId]
  );

  const topMat = selectedTopMat;
  const bottomMat = selectedAccentMat;

  const standardMats = useMemo(
    () => getMatsInDisplayOrder(isMobile ? "mobile" : "desktop", true, false),
    [isMobile]
  );
  const premiumMats = useMemo(
    () => getMatsInDisplayOrder(isMobile ? "mobile" : "desktop", false, true),
    [isMobile]
  );

  const bottomWeightedExtra = bottomWeighted ? BOTTOM_WEIGHTED_EXTRA : 0;
  const adjustedLayout = useMemo(() => {
    const baseLayout = getCurrencyLayoutWithBrassNameplate({
      layout: currentLayout,
      brassPlaqueEnabled: brassNameplateConfig.enabled && matType !== "none",
    });
    return {
      ...baseLayout,
      frameHeight: baseLayout.frameHeight + bottomWeightedExtra,
      matBorderBottom: baseLayout.matBorderBottom + bottomWeightedExtra,
    };
  }, [currentLayout, brassNameplateConfig.enabled, matType, bottomWeightedExtra]);

  const [framePhotos, setFramePhotos] = useState<{
    cornerUrl?: string;
    profileUrl?: string;
    topUrl?: string;
    bottomUrl?: string;
    leftUrl?: string;
    rightUrl?: string;
  }>({});

  useEffect(() => {
    async function fetchFramePhotos() {
      if (!selectedFrame?.sku) return;
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

  useEffect(() => {
    if (!selectedFrame?.sku) return;
    const params = new URLSearchParams();
    params.set("layout", selectedLayout);
    params.set("frame", selectedFrame.sku);
    params.set("backing", selectedBackingId);
    params.set("glass", selectedGlass.id);
    params.set("hardware", hardware);
    params.set("matType", matType);
    if (matType !== "none") {
      params.set("topMat", selectedTopMat.id);
      params.set("accentMat", selectedAccentMat.id);
    }
    if (selectedLayout === "custom") {
      params.set("customWidth", customWidth);
      params.set("customHeight", customHeight);
    }
    if (brassNameplateConfig.enabled) {
      params.set("nameplateEnabled", "true");
      if (brassNameplateConfig.line1) params.set("nameplateLine1", brassNameplateConfig.line1);
      if (brassNameplateConfig.line2) params.set("nameplateLine2", brassNameplateConfig.line2);
      if (brassNameplateConfig.line3) params.set("nameplateLine3", brassNameplateConfig.line3);
      params.set("nameplateFont", brassNameplateConfig.font);
      params.set("nameplateColor", brassNameplateConfig.color);
      if (brassNameplateConfig.includeFlag) params.set("nameplateFlag", "true");
    }
    if (bottomWeighted) params.set("bottomWeighted", "true");
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  }, [
    selectedLayout,
    selectedFrame?.sku,
    selectedBackingId,
    selectedGlass.id,
    hardware,
    matType,
    selectedTopMat.id,
    selectedAccentMat.id,
    customWidth,
    customHeight,
    brassNameplateConfig,
    bottomWeighted,
  ]);

  const { containerRef, previewContainerHeight, containerWidth } = useIntelligentPreviewSizing({
    frameWidth: adjustedLayout.frameWidth,
    frameHeight: adjustedLayout.frameHeight,
    plaqueEnabled: brassNameplateConfig.enabled,
    isMobile,
  });

  const layout = useMemo(
    () =>
      computePreviewLayout({
        artW: adjustedLayout.matOpeningWidth,
        artH: adjustedLayout.matOpeningHeight,
        matBorderTop: adjustedLayout.matBorderTop,
        matBorderRight: adjustedLayout.matBorderRight,
        matBorderBottom: adjustedLayout.matBorderBottom,
        matBorderLeft: adjustedLayout.matBorderLeft,
        frameFace: selectedFrame.mouldingWidth ?? 1.5,
        containerWpx: containerWidth ?? 300,
        containerHpx: previewContainerHeight,
      }),
    [adjustedLayout, selectedFrame.mouldingWidth, previewContainerHeight, containerWidth]
  );

  const pricing = useMemo(() => {
    const frameConfig: FrameConfiguration = {
      serviceType: "frame-only",
      artworkWidth: adjustedLayout.matOpeningWidth,
      artworkHeight: adjustedLayout.matOpeningHeight,
      frameStyleId: selectedFrame.id,
      matType,
      matBorderWidth: adjustedLayout.matBorderTop,
      matRevealWidth: matReveal,
      matColorId: selectedTopMat.id,
      matInnerColorId: matType === "double" ? selectedAccentMat.id : undefined,
      glassTypeId: selectedGlass.id,
      bottomWeighted,
    };
    const pricingBreakdown = calculatePricing(frameConfig);
    const hardwarePrice = hardware === "security" ? 8.95 : 0;
    const nameplatePrice =
      brassNameplateConfig.enabled && matType !== "none" ? BRASS_NAMEPLATE_SPECS.PRICE : 0;
    const total = pricingBreakdown.total + hardwarePrice + nameplatePrice;
    return {
      framePrice: pricingBreakdown.framePrice,
      matPrice: pricingBreakdown.matPrice,
      glassPrice: pricingBreakdown.glassPrice,
      hardwarePrice,
      nameplatePrice,
      subtotal: pricingBreakdown.subtotal,
      total,
    };
  }, [
    adjustedLayout,
    selectedFrame.id,
    matType,
    matReveal,
    selectedTopMat.id,
    selectedAccentMat.id,
    selectedGlass.id,
    hardware,
    brassNameplateConfig.enabled,
    bottomWeighted,
  ]);

  const priceItems = useMemo<PriceLineItem[]>(() => {
    const items: PriceLineItem[] = [
      { label: `${currentLayout.displayName} Currency Frame`, amount: pricing.framePrice },
    ];
    if (pricing.matPrice > 0 && matType !== "none") {
      items.push({
        label: matType === "double" ? "Double Mat" : "Single Mat",
        amount: pricing.matPrice,
      });
    }
    if (pricing.glassPrice > 0) {
      items.push({ label: selectedGlass.name, amount: pricing.glassPrice });
    }
    if (pricing.hardwarePrice > 0) {
      items.push({ label: "Security Hardware", amount: pricing.hardwarePrice });
    }
    if (brassNameplateConfig.enabled && matType !== "none") {
      items.push({ label: "Brass Nameplate", amount: pricing.nameplatePrice });
    }
    return items;
  }, [
    currentLayout.displayName,
    pricing,
    brassNameplateConfig.enabled,
    selectedGlass.name,
    matType,
  ]);

  const handleAddToCart = () => {
    toast({
      title: "Added to Cart",
      description: `${quantity}× ${currentLayout.displayName} Currency Frame added to your cart.`,
    });
  };

  const brassNameplatePass = {
    ...brassNameplateConfig,
    enabled: brassNameplateConfig.enabled && matType !== "none",
  };

  return (
    <div className="min-h-screen bg-background">
      <div ref={sentinelRef} className="h-0 w-full" aria-hidden="true" />

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
              <div className="space-y-4">
                {/* Size Selector - Mobile only */}
                <div className="lg:hidden">
                  <p className="text-xs text-muted-foreground text-center mb-2">
                    Select your display size
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {availableLayouts.map((layoutOption) => (
                      <button
                        key={layoutOption.id}
                        onClick={() => setSelectedLayout(layoutOption.id)}
                        className={`flex-1 min-w-[80px] px-3 py-2.5 rounded-md border-2 text-center transition-all hover:shadow-md active:scale-[0.98] ${
                          selectedLayout === layoutOption.id
                            ? "border-primary bg-primary/5 font-semibold"
                            : "border-border bg-background"
                        }`}
                        data-testid={`button-size-${layoutOption.id}`}
                      >
                        <div className="text-sm font-medium">
                          {layoutOption.displayName.replace(" Size", "")}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {layoutOption.matOpeningWidth}×{layoutOption.matOpeningHeight}&quot;
                        </div>
                      </button>
                    ))}
                    <button
                      onClick={() => setSelectedLayout("custom")}
                      className={`flex-1 min-w-[80px] px-3 py-2.5 rounded-md border-2 text-center transition-all hover:shadow-md active:scale-[0.98] ${
                        selectedLayout === "custom"
                          ? "border-primary bg-primary/5 font-semibold"
                          : "border-dashed border-muted-foreground/40 bg-background"
                      }`}
                      data-testid="button-size-custom"
                    >
                      <div className="text-sm font-medium">Custom</div>
                      <div className="text-xs text-muted-foreground mt-0.5">Any Size</div>
                    </button>
                  </div>
                  {selectedLayout === "custom" && (
                    <div className="mt-4 p-4 bg-muted/30 rounded-lg border border-border">
                      <p className="text-sm font-medium mb-3">Enter Display Dimensions</p>
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <Label
                            htmlFor="customWidth-mobile"
                            className="text-xs text-muted-foreground mb-1 block"
                          >
                            Width (inches)
                          </Label>
                          <Input
                            id="customWidth-mobile"
                            value={customWidth}
                            onChange={(e) => setCustomWidth(e.target.value)}
                            placeholder="e.g., 20"
                            className={!customDimensionValidation.valid ? "border-destructive" : ""}
                            data-testid="input-custom-width-mobile"
                          />
                        </div>
                        <div className="flex items-end pb-0.5 text-muted-foreground">×</div>
                        <div className="flex-1">
                          <Label
                            htmlFor="customHeight-mobile"
                            className="text-xs text-muted-foreground mb-1 block"
                          >
                            Height (inches)
                          </Label>
                          <Input
                            id="customHeight-mobile"
                            value={customHeight}
                            onChange={(e) => setCustomHeight(e.target.value)}
                            placeholder="e.g., 16"
                            className={!customDimensionValidation.valid ? "border-destructive" : ""}
                            data-testid="input-custom-height-mobile"
                          />
                        </div>
                      </div>
                      {!customDimensionValidation.valid && customDimensionValidation.message && (
                        <p className="text-xs text-destructive mt-2">
                          {customDimensionValidation.message}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        Min {CURRENCY_CUSTOM_SIZE_LIMITS.MIN_WIDTH}&quot;. Decimals accepted (e.g.,
                        16.5)
                      </p>
                    </div>
                  )}
                </div>

                {/* Currency Frame Preview */}
                <div
                  ref={containerRef}
                  className="preview-wrap bg-muted rounded-md flex items-center justify-center relative group"
                  style={{ minHeight: `${previewContainerHeight}px` }}
                  data-testid="preview-canvas"
                >
                  <div className="absolute top-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setShowFullscreenPreview(true)}
                      className="bg-background/90 hover:bg-background p-2 rounded-md shadow-lg hover:shadow-md active:scale-95"
                      data-testid="button-fullscreen-preview"
                    >
                      <Maximize className="h-5 w-5" />
                    </button>
                  </div>
                  <CurrencyPreviewCanvas
                    layout={layout}
                    framePhotos={framePhotos}
                    adjustedLayout={adjustedLayout}
                    selectedFrame={selectedFrame}
                    topMatColor={topMat}
                    bottomMatColor={bottomMat}
                    backingColor={backing}
                    brassNameplateConfig={brassNameplatePass}
                    matType={matType}
                  />
                </div>

                {/* Dimension Display */}
                <div className="mt-4 p-3 bg-muted/50 rounded-md text-sm space-y-0.5">
                  <p className="font-medium">
                    Finished Size:{" "}
                    <span className="text-primary">
                      {(() => {
                        const interiorWidth = adjustedLayout.frameWidth;
                        const interiorHeight = adjustedLayout.frameHeight;
                        const mouldingWidth = selectedFrame.mouldingWidth ?? 0;
                        const overallWidth = interiorWidth + mouldingWidth * 2;
                        const overallHeight = interiorHeight + mouldingWidth * 2;
                        return `${overallWidth.toFixed(1)}" × ${overallHeight.toFixed(1)}"`;
                      })()}
                    </span>
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Display Area: {adjustedLayout.matOpeningWidth}&quot; ×{" "}
                    {adjustedLayout.matOpeningHeight}&quot; × {selectedFrame.usableDepth}&quot;
                    depth
                  </p>
                </div>

                {/* Frame Details: corner, profile, lifestyle */}
                <div className="grid grid-cols-3 gap-2">
                  {framePhotos.cornerUrl ? (
                    <div className="aspect-square rounded-md border overflow-hidden bg-background">
                      <img
                        src={framePhotos.cornerUrl}
                        alt="Frame corner detail"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-square rounded-md border-2 border-dashed border-border flex items-center justify-center bg-muted/30">
                      <p className="text-xs text-muted-foreground">Corner</p>
                    </div>
                  )}
                  {framePhotos.profileUrl ? (
                    <div className="aspect-square rounded-md border overflow-hidden bg-background">
                      <img
                        src={framePhotos.profileUrl}
                        alt="Frame profile view"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-square rounded-md border-2 border-dashed border-border flex items-center justify-center bg-muted/30">
                      <p className="text-xs text-muted-foreground">Profile</p>
                    </div>
                  )}
                  <div className="aspect-square rounded-md border overflow-hidden bg-background">
                    <img
                      src={lifestylePreviewImage}
                      alt="Currency frame in home setting"
                      className="w-full h-full object-cover"
                      data-testid="img-currency-lifestyle-preview"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Controls */}
          <div className={isMobile && mobileView === "preview" ? "hidden" : ""}>
            <div className="space-y-6">
              <div>
                {/* Size Selector - Desktop */}
                <div className="hidden lg:block mb-6">
                  <h3 className="text-sm font-semibold mb-3">
                    Select Size{" "}
                    <span className="text-muted-foreground font-normal">(Display area shown)</span>
                  </h3>
                  {selectedLayout !== "custom" && (
                    <p className="text-xs text-muted-foreground mb-3">
                      Popular sizes for currency collection displays
                    </p>
                  )}
                  <div className="flex gap-2 mb-3">
                    {availableLayouts.map((layoutOption) => (
                      <button
                        key={layoutOption.id}
                        onClick={() => setSelectedLayout(layoutOption.id)}
                        className={`flex-1 px-3 py-2.5 rounded-md border-2 text-center transition-all hover:shadow-md active:scale-[0.98] ${
                          selectedLayout === layoutOption.id
                            ? "border-primary bg-primary/5 font-semibold"
                            : "border-border bg-background"
                        }`}
                        data-testid={`button-size-${layoutOption.id}-desktop`}
                      >
                        <div className="text-sm font-medium">
                          {layoutOption.displayName.replace(" Size", "")}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {layoutOption.matOpeningWidth}×{layoutOption.matOpeningHeight}&quot;
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-dashed border-muted-foreground/30" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-3 bg-background text-xs text-muted-foreground">
                        or specify custom dimensions
                      </span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <button
                      onClick={() => setSelectedLayout("custom")}
                      className={`w-full px-4 py-3 rounded-md border-2 text-center transition-all hover:shadow-md active:scale-[0.98] ${
                        selectedLayout === "custom"
                          ? "border-primary bg-primary/5"
                          : "border-dashed border-muted-foreground/40 bg-muted/20"
                      }`}
                      data-testid="button-size-custom-desktop"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Settings className="w-4 h-4 text-muted-foreground" />
                        <span
                          className={`text-sm ${selectedLayout === "custom" ? "font-semibold" : ""}`}
                        >
                          Custom Size
                        </span>
                        <span className="text-xs text-muted-foreground">
                          For unique currency displays
                        </span>
                      </div>
                    </button>
                    {selectedLayout === "custom" && (
                      <div className="mt-4 p-4 bg-muted/30 rounded-lg border border-border">
                        <div className="flex items-center gap-2 mb-4">
                          <Info className="w-4 h-4 text-primary" />
                          <p className="text-sm text-muted-foreground">
                            Enter the display area dimensions for your currency
                          </p>
                        </div>
                        <div className="flex gap-4 items-end">
                          <div className="flex-1">
                            <Label htmlFor="customWidth-desktop" className="text-sm mb-1.5 block">
                              Display Width
                            </Label>
                            <div className="relative">
                              <Input
                                id="customWidth-desktop"
                                value={customWidth}
                                onChange={(e) => setCustomWidth(e.target.value)}
                                placeholder="e.g., 20"
                                className={`pr-12 ${!customDimensionValidation.valid ? "border-destructive" : ""}`}
                                data-testid="input-custom-width-desktop"
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                inches
                              </span>
                            </div>
                          </div>
                          <div className="pb-2 text-xl text-muted-foreground">×</div>
                          <div className="flex-1">
                            <Label htmlFor="customHeight-desktop" className="text-sm mb-1.5 block">
                              Display Height
                            </Label>
                            <div className="relative">
                              <Input
                                id="customHeight-desktop"
                                value={customHeight}
                                onChange={(e) => setCustomHeight(e.target.value)}
                                placeholder="e.g., 16"
                                className={`pr-12 ${!customDimensionValidation.valid ? "border-destructive" : ""}`}
                                data-testid="input-custom-height-desktop"
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                inches
                              </span>
                            </div>
                          </div>
                        </div>
                        {!customDimensionValidation.valid && customDimensionValidation.message && (
                          <p className="text-sm text-destructive mt-3">
                            {customDimensionValidation.message}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-3">
                          Min {CURRENCY_CUSTOM_SIZE_LIMITS.MIN_WIDTH}×
                          {CURRENCY_CUSTOM_SIZE_LIMITS.MIN_HEIGHT}&quot;. Max{" "}
                          {CURRENCY_CUSTOM_SIZE_LIMITS.MAX_WIDTH}×
                          {CURRENCY_CUSTOM_SIZE_LIMITS.MAX_HEIGHT}&quot;. Decimals accepted.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <Accordion
                  type="multiple"
                  defaultValue={[
                    "frame",
                    "backing",
                    "matType",
                    "topMat",
                    "accentMat",
                    "nameplate",
                    "glass",
                    "hardware",
                  ]}
                  className="space-y-4"
                >
                  <AccordionItem value="frame" className="border rounded-lg px-6">
                    <AccordionTrigger
                      className="hover:no-underline text-lg font-semibold"
                      data-testid="accordion-frame"
                    >
                      Choose Your Frame Style
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 pb-6">
                      <div className="mb-3 p-2.5 bg-muted/50 rounded-md text-xs text-muted-foreground">
                        <p>
                          <strong className="text-foreground">Moulding Width:</strong> The width of
                          the frame
                        </p>
                        <p className="mt-1">
                          <strong className="text-foreground">Usable Depth:</strong> The depth
                          inside for your currency
                        </p>
                      </div>
                      <div className="md:max-h-[400px] md:overflow-y-auto md:pr-2">
                        <div className="grid grid-cols-2 gap-2">
                          {shadowboxFrames.map((frame) => (
                            <button
                              key={frame.id}
                              onClick={() => setSelectedFrame(frame)}
                              className={`p-3 rounded-md border-2 text-left hover:shadow-md active:scale-[0.98] ${
                                selectedFrame.id === frame.id
                                  ? "border-primary"
                                  : "border-transparent"
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
                                <span>Width: {frame.mouldingWidth}&quot;</span>
                                <span>Depth: {frame.usableDepth}&quot;</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="backing" className="border rounded-lg px-6">
                    <AccordionTrigger
                      className="hover:no-underline text-lg font-semibold"
                      data-testid="accordion-backing"
                    >
                      Backing Color
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 pb-6">
                      <p className="text-sm text-muted-foreground mb-3">
                        Choose the background color for your currency display
                      </p>
                      <p className="text-xs text-muted-foreground mb-4 italic">
                        Compatible with standard archival currency holders used by collectors.
                      </p>
                      <RadioGroup
                        value={selectedBackingId}
                        onValueChange={setSelectedBackingId}
                        className="grid grid-cols-2 gap-3"
                      >
                        {CURRENCY_BACKING_OPTIONS.map((option) => (
                          <div key={option.id} className="flex items-center">
                            <RadioGroupItem
                              value={option.id}
                              id={`backing-${option.id}`}
                              className="sr-only"
                            />
                            <Label
                              htmlFor={`backing-${option.id}`}
                              className={`flex items-center gap-3 w-full p-3 rounded-md border-2 cursor-pointer hover:shadow-md active:scale-[0.98] ${
                                selectedBackingId === option.id
                                  ? "border-primary bg-primary/5"
                                  : "border-border"
                              }`}
                            >
                              <div
                                className="w-8 h-8 rounded-md border"
                                style={{ backgroundColor: option.hex }}
                              />
                              <span className="text-sm font-medium">{option.name}</span>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="matType" className="border rounded-lg px-6">
                    <AccordionTrigger
                      className="hover:no-underline text-lg font-semibold"
                      data-testid="accordion-mat-type"
                    >
                      Matting
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 pb-6 space-y-6">
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
                      {matType !== "none" && (
                        <>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="matBorder">Mat Border Width</Label>
                              <span
                                className="text-sm font-medium"
                                data-testid="text-mat-border-value"
                              >
                                {matBorder.toFixed(2)}&quot;
                              </span>
                            </div>
                            <Slider
                              id="matBorder"
                              min={1.5}
                              max={8}
                              step={0.25}
                              value={[matBorder]}
                              onValueChange={(values) =>
                                setMatBorderWidth((values[0] ?? matBorder).toString())
                              }
                              data-testid="slider-mat-border"
                            />
                            <p className="text-xs text-muted-foreground">Each side of artwork</p>
                            <div className="flex items-center space-x-2 pt-2">
                              <Checkbox
                                id="bottomWeighted"
                                checked={bottomWeighted}
                                onCheckedChange={(checked) => setBottomWeighted(checked === true)}
                                data-testid="checkbox-bottom-weighted"
                              />
                              <div className="flex items-center gap-2">
                                <Label
                                  htmlFor="bottomWeighted"
                                  className="text-sm font-medium leading-none cursor-pointer"
                                >
                                  Bottom-Weighted Matting
                                </Label>
                                <Tooltip delayDuration={200}>
                                  <TooltipTrigger asChild>
                                    <button
                                      type="button"
                                      className="text-muted-foreground hover:text-foreground transition-colors"
                                      data-testid="button-bottom-weighted-info"
                                    >
                                      <Info className="h-4 w-4" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-xs">
                                    <p className="text-sm">
                                      Adds 0.5&quot; to the bottom border for visual balance. This
                                      professional standard prevents artwork from appearing to sink.
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            </div>
                          </div>
                          <div
                            className={`space-y-3 ${matType === "double" ? "pt-4 pb-3 px-3 md:px-0 bg-muted/40 md:bg-transparent rounded-lg" : ""}`}
                          >
                            {matType === "double" ? (
                              <Label className="text-base font-semibold">
                                Top Mat: {selectedTopMat.name}
                              </Label>
                            ) : (
                              <Label>Mat: {selectedTopMat.name}</Label>
                            )}
                            <ColorSwatchesWithSeparator
                              standardColors={standardMats}
                              premiumColors={premiumMats}
                              selectedId={selectedTopMat.id}
                              onSelect={(mat) => setSelectedTopMat(mat)}
                              testIdPrefix="top-mat"
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
                                    setMatRevealWidth((values[0] ?? matReveal).toString())
                                  }
                                  data-testid="slider-mat-reveal"
                                />
                                <p className="text-xs text-muted-foreground">
                                  Inner mat border visible around artwork
                                </p>
                              </div>
                              <div className="space-y-3 pt-4 pb-3 px-3 md:px-0 bg-muted/40 md:bg-transparent rounded-lg">
                                <Label className="text-base font-semibold">
                                  Accent Mat: {selectedAccentMat.name}
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                  Thin border mat visible around the opening
                                </p>
                                <ColorSwatchesWithSeparator
                                  standardColors={standardMats}
                                  premiumColors={premiumMats}
                                  selectedId={selectedAccentMat.id}
                                  onSelect={(mat) => setSelectedAccentMat(mat)}
                                  testIdPrefix="accent-mat"
                                />
                              </div>
                            </>
                          )}
                        </>
                      )}
                    </AccordionContent>
                  </AccordionItem>

                  {matType !== "none" && (
                    <AccordionItem value="nameplate" className="border rounded-lg px-6">
                      <AccordionTrigger
                        className="hover:no-underline text-lg font-semibold"
                        data-testid="accordion-nameplate"
                      >
                        Brass Nameplate
                      </AccordionTrigger>
                      <AccordionContent className="pt-4 pb-6">
                        <BrassNameplateSection
                          config={brassNameplateConfig}
                          onChange={setBrassNameplateConfig}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  <AccordionItem value="glass" className="border rounded-lg px-6">
                    <AccordionTrigger
                      className="hover:no-underline text-lg font-semibold"
                      data-testid="accordion-glass"
                    >
                      Glazing & Backing
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 pb-6">
                      <RadioGroup
                        value={selectedGlass.id}
                        onValueChange={(id) =>
                          setSelectedGlass(glassTypes.find((g) => g.id === id)!)
                        }
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {glassTypes
                            .filter((g) => g.id === "standard" || g.id === "non-glare")
                            .map((glass) => (
                              <div key={glass.id} className="flex items-center space-x-2 py-2">
                                <RadioGroupItem
                                  value={glass.id}
                                  id={`glass-${glass.id}`}
                                  data-testid={`radio-glass-${glass.id}`}
                                />
                                <Label htmlFor={`glass-${glass.id}`}>{glass.name}</Label>
                              </div>
                            ))}
                        </div>
                      </RadioGroup>
                      <p className="text-xs text-muted-foreground mt-3">
                        Protects your currency with crystal-clear acrylic glazing.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="hardware" className="border rounded-lg px-6">
                    <AccordionTrigger
                      className="hover:no-underline text-lg font-semibold"
                      data-testid="accordion-hardware"
                    >
                      Hanging Hardware
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 pb-6">
                      <HangingHardwareSection
                        hardwareType={hardware}
                        setHardwareType={setHardware}
                        frameWidth={adjustedLayout.frameWidth}
                        frameHeight={adjustedLayout.frameHeight}
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              <div className="hidden lg:block">
                <PriceBox
                  totalPrice={pricing.total}
                  quantity={quantity}
                  onQuantityChange={setQuantity}
                  onAddToCart={handleAddToCart}
                  priceItems={priceItems}
                />
              </div>
              <div className="hidden lg:block">
                <TrustBox />
              </div>
            </div>
          </div>
        </div>

        {/* Currency Frames in Your Home */}
        <div className="mt-8 pt-6 border-t">
          <h3 className="text-lg font-semibold mb-4">Currency Frames in Your Home</h3>
          <p className="text-sm text-muted-foreground mb-4">
            See how our custom currency display frames look in real settings
          </p>
          <div className="relative">
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-4 pb-4 px-1">
                {currencyLifestyleImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setLifestylePreviewImage(img.url)}
                    className={`relative flex-shrink-0 rounded-lg overflow-hidden transition-all duration-200 ${
                      lifestylePreviewImage === img.url
                        ? "ring-2 ring-primary ring-offset-2 scale-105"
                        : "hover:scale-[1.02] hover:shadow-lg"
                    }`}
                    style={{ width: "200px", height: "150px" }}
                    data-testid={`button-currency-lifestyle-carousel-${index}`}
                  >
                    <img
                      src={img.url}
                      alt={img.alt}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {lifestylePreviewImage === img.url && (
                      <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                        <div className="bg-primary text-primary-foreground rounded-full p-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bar */}
      {isMobile && showMobileBar && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t shadow-lg p-3 safe-area-inset-bottom">
          <div className="flex items-center gap-3">
            <div className="flex rounded-md border overflow-hidden">
              <button
                onClick={() => setMobileView("preview")}
                className={`px-3 py-2 text-sm ${
                  mobileView === "preview" ? "bg-primary text-primary-foreground" : "bg-background"
                }`}
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => setMobileView("controls")}
                className={`px-3 py-2 text-sm ${
                  mobileView === "controls" ? "bg-primary text-primary-foreground" : "bg-background"
                }`}
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 text-center">
              <span className="text-lg font-bold">${(pricing.total * quantity).toFixed(2)}</span>
            </div>
            <QuantitySelector value={quantity} onChange={setQuantity} className="w-20" />
            <Button
              onClick={handleAddToCart}
              className="px-4"
              data-testid="button-add-to-cart-mobile"
            >
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      <Dialog open={showFullscreenPreview} onOpenChange={setShowFullscreenPreview}>
        <DialogContent className="max-w-[100vw] w-screen h-screen max-h-screen p-0 border-0">
          <DialogHeader className="sr-only">
            <DialogTitle>Frame Preview</DialogTitle>
          </DialogHeader>
          <div className="relative w-full h-full flex items-center justify-center bg-white">
            <div className="w-full h-full flex items-center justify-center p-8">
              <div style={{ filter: "drop-shadow(0 8px 32px rgba(0, 0, 0, 0.15))" }}>
                <CurrencyPreviewCanvas
                  layout={layout}
                  framePhotos={framePhotos}
                  adjustedLayout={adjustedLayout}
                  selectedFrame={selectedFrame}
                  topMatColor={topMat}
                  bottomMatColor={bottomMat}
                  backingColor={backing}
                  brassNameplateConfig={brassNameplatePass}
                  matType={matType}
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
