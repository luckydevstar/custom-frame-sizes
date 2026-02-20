"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Share2, Award, Maximize, Settings, Eye, Copy, ShoppingCart, Shield } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Input } from "../ui/input";
import { QuantitySelector } from "../ui/quantity-selector";
import { PriceBox } from "../ui/PriceBox";
import type { PriceLineItem } from "../ui/PriceBox";
import { useToast } from "../../hooks/use-toast";
import {
  getFramesByCategory,
  calculatePricing,
  parseFraction,
  computePreviewLayout,
  getStoreBaseAssetUrl,
  useIsMobile,
  useMobileViewToggle,
  useIntelligentPreviewSizing,
  getMilitaryLayout,
  getAllMilitaryLayouts,
  getMilitaryLayoutWithBrassNameplate,
  MILITARY_BRANCHES,
  getMilitaryBranchById,
  MILITARY_CUSTOM_SIZE_LIMITS,
  createCustomMilitaryLayout,
  validateMilitaryCustomDimensions,
  getRandomMilitaryPhoto,
  BRASS_PLAQUE_DIMENSIONS,
} from "@framecraft/core";
import type { FrameStyle, FrameConfiguration, BrassNameplateConfig } from "@framecraft/types";
import type { MilitaryLayoutType } from "@framecraft/core";
import { BRASS_NAMEPLATE_SPECS } from "@framecraft/types";
import { TrustBox } from "../marketing/TrustBox";
import { MilitaryPreviewCanvas } from "./MilitaryPreviewCanvas";
import { BrassNameplateSection } from "../brass-nameplate/BrassNameplateSection";
import { BottomWeightedMatting, BOTTOM_WEIGHTED_EXTRA } from "./shared/BottomWeightedMatting";
import { HangingHardwareSection } from "./shared/HangingHardwareSection";

const shadowboxFrames = getFramesByCategory("shadowbox");
const frameStyles = shadowboxFrames.length > 0 ? shadowboxFrames : [];

interface MilitaryFrameDesignerProps {
  defaultFrameId?: string;
  embedded?: boolean;
}

export function MilitaryFrameDesigner({
  defaultFrameId,
  embedded = false,
}: MilitaryFrameDesignerProps) {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { mobileView, setMobileView, showMobileBar, previewCardRef, controlsHeadingRef } =
    useMobileViewToggle({ isMobile });

  const urlParams = useMemo(() => new URLSearchParams(window.location.search), []);

  const initialFrame = useMemo(() => {
    if (defaultFrameId) {
      const f = frameStyles.find((x) => x.id === defaultFrameId || x.sku === defaultFrameId);
      return f ?? frameStyles[0];
    }
    const fp = urlParams.get("frame");
    if (fp) {
      const f = frameStyles.find((x) => x.id === fp || x.sku === fp);
      return f ?? frameStyles[0];
    }
    return frameStyles[0];
  }, [defaultFrameId, urlParams]);

  const [selectedLayout, setSelectedLayout] = useState<MilitaryLayoutType>(() => {
    const lp = urlParams.get("layout");
    const valid: MilitaryLayoutType[] = [
      "compact-11x14",
      "standard-16x20",
      "large-20x32",
      "custom",
    ];
    if (lp && valid.includes(lp as MilitaryLayoutType)) return lp as MilitaryLayoutType;
    return "standard-16x20";
  });

  const [customWidth, setCustomWidth] = useState(() => urlParams.get("customWidth") || "20");
  const [customHeight, setCustomHeight] = useState(() => urlParams.get("customHeight") || "16");

  const [selectedFrame, setSelectedFrame] = useState<FrameStyle | undefined>(initialFrame);

  const [selectedBranchId, setSelectedBranchId] = useState(() => {
    const bp = urlParams.get("branch");
    if (bp) {
      const b = getMilitaryBranchById(bp);
      return b ? b.id : (MILITARY_BRANCHES[0]?.id ?? "");
    }
    return MILITARY_BRANCHES[0]?.id ?? "";
  });

  const [hardware, setHardware] = useState<"standard" | "security">(
    (urlParams.get("hardware") as "standard" | "security") || "standard"
  );

  const [bottomWeighted, setBottomWeighted] = useState(
    () => urlParams.get("bottomWeighted") === "true"
  );

  const [brassNameplateConfig, setBrassNameplateConfig] = useState<BrassNameplateConfig>(() => {
    const np = new URLSearchParams(window.location.search);
    const enabled = np.get("nameplateEnabled") === "true" || np.get("plaqueEnabled") === "true";
    if (!enabled) {
      return {
        enabled: false,
        line1: "",
        line2: "",
        line3: "",
        font: "georgia",
        color: "brass-black",
        includeFlag: false,
      };
    }
    return {
      enabled: true,
      line1: np.get("nameplateLine1") || np.get("plaqueLine1") || "",
      line2: np.get("nameplateLine2") || np.get("plaqueLine2") || "",
      line3: np.get("nameplateLine3") || np.get("plaqueLine3") || "",
      font: (np.get("nameplateFont") ||
        np.get("plaqueFont") ||
        "georgia") as BrassNameplateConfig["font"],
      color: (np.get("nameplateColor") ||
        np.get("plaqueColor") ||
        "brass-black") as BrassNameplateConfig["color"],
      includeFlag: (np.get("nameplateFlag") || np.get("plaqueFlag")) === "true",
    };
  });

  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showFullscreenPreview, setShowFullscreenPreview] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const [framePhotos, setFramePhotos] = useState<{
    cornerUrl?: string;
    profileUrl?: string;
    topUrl?: string;
    bottomUrl?: string;
    leftUrl?: string;
    rightUrl?: string;
  }>({});

  const sentinelRef = useRef<HTMLDivElement>(null);

  const parsedCustomWidth = parseFraction(customWidth);
  const parsedCustomHeight = parseFraction(customHeight);

  const customDimensionValidation = useMemo(() => {
    if (selectedLayout !== "custom") return { valid: true };
    return validateMilitaryCustomDimensions(parsedCustomWidth, parsedCustomHeight);
  }, [selectedLayout, parsedCustomWidth, parsedCustomHeight]);

  const currentLayout = useMemo(() => {
    if (selectedLayout === "custom") {
      const w = customDimensionValidation.valid
        ? parsedCustomWidth
        : MILITARY_CUSTOM_SIZE_LIMITS.MIN_WIDTH;
      const h = customDimensionValidation.valid
        ? parsedCustomHeight
        : MILITARY_CUSTOM_SIZE_LIMITS.MIN_HEIGHT;
      return createCustomMilitaryLayout(w, h);
    }
    return getMilitaryLayout(selectedLayout)!;
  }, [selectedLayout, parsedCustomWidth, parsedCustomHeight, customDimensionValidation.valid]);

  const randomLifestylePhoto = useMemo(() => getRandomMilitaryPhoto(), []);

  const selectedBranch = useMemo(
    () => getMilitaryBranchById(selectedBranchId) ?? MILITARY_BRANCHES[0],
    [selectedBranchId]
  );

  const topMat = selectedBranch?.topMat;
  const bottomMat = selectedBranch?.bottomMat;
  const backing = selectedBranch?.backing;

  useEffect(() => {
    setFramePhotos({});
    if (!selectedFrame?.sku) return;
    fetch(`/api/frames/${selectedFrame.sku}/photos`)
      .then((r) => (r.ok ? r.json() : null))
      .then((photoSet) => {
        if (photoSet) {
          setFramePhotos({
            cornerUrl: photoSet.cornerUrl,
            profileUrl: photoSet.profileUrl,
            topUrl: photoSet.topUrl,
            bottomUrl: photoSet.bottomUrl,
            leftUrl: photoSet.leftUrl,
            rightUrl: photoSet.rightUrl,
          });
        }
      })
      .catch(() => setFramePhotos({}));
  }, [selectedFrame?.sku]);

  useEffect(() => {
    if (!selectedFrame?.sku) return;
    const params = new URLSearchParams();
    params.set("layout", selectedLayout);
    params.set("frame", selectedFrame.sku);
    params.set("branch", selectedBranchId);
    params.set("hardware", hardware);
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
    }
    if (bottomWeighted) params.set("bottomWeighted", "true");
    window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
  }, [
    selectedLayout,
    selectedFrame?.sku,
    selectedBranchId,
    hardware,
    brassNameplateConfig,
    bottomWeighted,
    customWidth,
    customHeight,
  ]);

  const bottomWeightedExtra = bottomWeighted ? BOTTOM_WEIGHTED_EXTRA : 0;

  const adjustedLayout = useMemo(() => {
    const base = getMilitaryLayoutWithBrassNameplate({
      layout: currentLayout,
      brassPlaqueEnabled: brassNameplateConfig.enabled,
    });
    return {
      ...base,
      frameHeight: base.frameHeight + bottomWeightedExtra,
      matBorderBottom: base.matBorderBottom + bottomWeightedExtra,
    };
  }, [currentLayout, brassNameplateConfig.enabled, bottomWeightedExtra]);

  const baseFrameWidth = currentLayout.frameWidth + 2 * (selectedFrame?.mouldingWidth ?? 0);
  const baseFrameHeight = currentLayout.frameHeight + 2 * (selectedFrame?.mouldingWidth ?? 0);

  const { containerRef, previewContainerHeight, containerWidth } = useIntelligentPreviewSizing({
    frameWidth: baseFrameWidth,
    frameHeight: baseFrameHeight,
    plaqueEnabled: brassNameplateConfig.enabled,
    plaqueExtension: BRASS_PLAQUE_DIMENSIONS.BOTTOM_SPACE_INCREASE,
    isMobile,
    minHeightMobile: 400,
    minHeightDesktop: 625,
  });

  const layout = useMemo(() => {
    return computePreviewLayout({
      artW: adjustedLayout.matOpeningWidth,
      artH: adjustedLayout.matOpeningHeight,
      matBorderTop: adjustedLayout.matBorderTop,
      matBorderRight: adjustedLayout.matBorderRight,
      matBorderBottom: adjustedLayout.matBorderBottom,
      matBorderLeft: adjustedLayout.matBorderLeft,
      matReveal: 0.25,
      frameFace: selectedFrame?.mouldingWidth ?? 1.5,
      containerWpx: containerWidth ?? 300,
      containerHpx: previewContainerHeight,
      paddingPx: 24,
    });
  }, [adjustedLayout, selectedFrame?.mouldingWidth, containerWidth, previewContainerHeight]);

  const pricing = useMemo(() => {
    const safeW = customDimensionValidation.valid
      ? parsedCustomWidth
      : MILITARY_CUSTOM_SIZE_LIMITS.MIN_WIDTH;
    const safeH = customDimensionValidation.valid
      ? parsedCustomHeight
      : MILITARY_CUSTOM_SIZE_LIMITS.MIN_HEIGHT;
    const artworkWidth =
      selectedLayout === "custom"
        ? safeW + MILITARY_CUSTOM_SIZE_LIMITS.DEFAULT_MAT_BORDER * 2
        : currentLayout.frameWidth;
    const artworkHeight =
      selectedLayout === "custom"
        ? safeH + MILITARY_CUSTOM_SIZE_LIMITS.DEFAULT_MAT_BORDER * 2
        : currentLayout.frameHeight;

    const config: FrameConfiguration = {
      artworkWidth,
      artworkHeight,
      frameStyleId: selectedFrame?.id ?? "",
      matType: "double",
      matBorderWidth: currentLayout.matBorderWidth,
      matRevealWidth: 0.25,
      matColorId: "mat-1",
      matInnerColorId: "mat-2",
      glassTypeId: "standard",
      serviceType: "frame-only",
    };

    let framePrice = 0;
    try {
      framePrice = calculatePricing(config).total;
    } catch {
      framePrice = 0;
    }

    const hardwarePrice = hardware === "security" ? 8.95 : 0;
    const nameplatePrice = brassNameplateConfig.enabled ? (BRASS_NAMEPLATE_SPECS.PRICE ?? 29) : 0;
    const total = framePrice + hardwarePrice + nameplatePrice;

    return { framePrice, hardwarePrice, nameplatePrice, total };
  }, [
    selectedLayout,
    selectedFrame?.id,
    currentLayout,
    hardware,
    brassNameplateConfig.enabled,
    parsedCustomWidth,
    parsedCustomHeight,
    customDimensionValidation.valid,
  ]);

  const priceItems = useMemo<PriceLineItem[]>(() => {
    const items: PriceLineItem[] = [
      { label: "Shadowbox Frame & Mats", amount: pricing.framePrice, testId: "text-frame-price" },
    ];
    items.push({
      label: hardware === "security" ? "Security Hardware" : "Standard Hardware",
      amount: pricing.hardwarePrice,
      isIncluded: hardware === "standard",
      testId: "text-hardware-price",
    });
    if (brassNameplateConfig.enabled) {
      items.push({
        label: "Engraved Brass Nameplate",
        amount: pricing.nameplatePrice,
        testId: "text-plaque-price",
      });
    }
    return items;
  }, [pricing, hardware, brassNameplateConfig.enabled]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied!",
      description: "Share this link to show your military frame configuration.",
    });
    setShowShareDialog(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: "Design link copied!", description: "Design link copied to clipboard." });
  };

  const handleAddToCart = () => {
    toast({
      title: "Feature coming soon",
      description: "Shopping cart integration will be available in the next update.",
    });
  };

  const availableLayouts = getAllMilitaryLayouts();

  if (!selectedFrame || frameStyles.length === 0) {
    return (
      <div className="container mx-auto px-6 py-16">
        <Card className="p-12 text-center">
          <div className="text-muted-foreground">
            <Award className="w-12 h-12 mx-auto mb-4 animate-pulse" />
            <p>Loading designer...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!topMat || !bottomMat || !backing) {
    return null;
  }

  return (
    <>
      <div ref={sentinelRef} className="h-px" aria-hidden="true" />
      <div className="min-h-screen bg-background">
        {!embedded && (
          <div className="hidden lg:block border-b bg-card/50">
            <div className="container mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">Military Frame Designer</h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    Custom shadowbox frames for military memorabilia with branch colors
                  </p>
                </div>
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
        )}

        {!embedded && isMobile && (
          <div className="lg:hidden border-b bg-card/50 sticky top-0 z-40">
            <div className="px-4 py-3">
              <h1 className="text-lg font-bold">Military Frame Designer</h1>
            </div>
          </div>
        )}

        <div className="container mx-auto px-4 lg:px-6 py-6 lg:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[9fr,8fr] gap-6 pb-24 lg:pb-8">
            <div
              className={
                isMobile && mobileView === "controls"
                  ? "hidden"
                  : "lg:sticky lg:top-[132px] lg:self-start"
              }
            >
              <Card ref={previewCardRef} className="p-6 lg:p-8" data-testid="card-preview">
                <div className="space-y-4">
                  <div className="lg:hidden">
                    <p className="text-xs text-muted-foreground text-center mb-2">
                      Select your display size
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {availableLayouts.map((lo) => (
                        <button
                          key={lo.id}
                          onClick={() => setSelectedLayout(lo.id)}
                          className={`flex-1 min-w-[80px] px-3 py-2.5 rounded-md border-2 text-center ${
                            selectedLayout === lo.id
                              ? "border-primary bg-primary/5 font-semibold"
                              : "border-border"
                          }`}
                          data-testid={`button-size-${lo.id}`}
                        >
                          <div className="text-sm font-medium">
                            {lo.displayName.replace(" Size", "")}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {lo.matOpeningWidth}×{lo.matOpeningHeight}&quot;
                          </div>
                        </button>
                      ))}
                      <button
                        onClick={() => setSelectedLayout("custom")}
                        className={`flex-1 min-w-[80px] px-3 py-2.5 rounded-md border-2 text-center ${
                          selectedLayout === "custom"
                            ? "border-primary bg-primary/5"
                            : "border-dashed"
                        }`}
                        data-testid="button-size-custom"
                      >
                        <div className="text-sm font-medium">Custom</div>
                        <div className="text-xs text-muted-foreground mt-0.5">Any Size</div>
                      </button>
                    </div>
                    {selectedLayout === "custom" && (
                      <div className="mt-4 p-4 bg-muted/30 rounded-lg border">
                        <p className="text-sm font-medium mb-3">Enter Display Dimensions</p>
                        <div className="flex gap-3">
                          <div className="flex-1">
                            <Label className="text-xs mb-1 block">Width (inches)</Label>
                            <Input
                              value={customWidth}
                              onChange={(e) => setCustomWidth(e.target.value)}
                              placeholder="e.g., 20"
                              className={
                                !customDimensionValidation.valid ? "border-destructive" : ""
                              }
                            />
                          </div>
                          <div className="flex items-end pb-0.5 text-muted-foreground">×</div>
                          <div className="flex-1">
                            <Label className="text-xs mb-1 block">Height (inches)</Label>
                            <Input
                              value={customHeight}
                              onChange={(e) => setCustomHeight(e.target.value)}
                              placeholder="e.g., 16"
                              className={
                                !customDimensionValidation.valid ? "border-destructive" : ""
                              }
                            />
                          </div>
                        </div>
                        {!customDimensionValidation.valid && customDimensionValidation.message && (
                          <p className="text-xs text-destructive mt-2">
                            {customDimensionValidation.message}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div
                    ref={containerRef}
                    className="preview-wrap bg-muted rounded-md flex items-center justify-center relative group"
                    style={{ minHeight: `${previewContainerHeight}px` }}
                    data-testid="preview-canvas"
                  >
                    <div className="absolute top-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setShowFullscreenPreview(true)}
                        className="bg-background/90 hover:bg-background p-2 rounded-md shadow-lg"
                        data-testid="button-fullscreen-preview"
                      >
                        <Maximize className="h-5 w-5" />
                      </button>
                    </div>
                    <MilitaryPreviewCanvas
                      layout={layout}
                      framePhotos={framePhotos}
                      adjustedLayout={adjustedLayout}
                      selectedFrame={selectedFrame}
                      topMatColor={topMat}
                      bottomMatColor={bottomMat}
                      backingColor={backing}
                      brassNameplateConfig={brassNameplateConfig}
                    />
                  </div>

                  <div className="mt-4 p-3 bg-muted/50 rounded-md text-sm">
                    <p className="font-medium">
                      Finished Size:{" "}
                      <span className="text-primary">
                        {(
                          adjustedLayout.frameWidth +
                          2 * (selectedFrame.mouldingWidth ?? 0)
                        ).toFixed(1)}
                        &quot; ×{" "}
                        {(
                          adjustedLayout.frameHeight +
                          2 * (selectedFrame.mouldingWidth ?? 0)
                        ).toFixed(1)}
                        &quot;
                      </span>
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Interior: {adjustedLayout.frameWidth}&quot; × {adjustedLayout.frameHeight}
                      &quot; × {selectedFrame.usableDepth}&quot; depth
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {framePhotos.cornerUrl ? (
                      <div className="aspect-square rounded-md border overflow-hidden bg-background">
                        <img
                          src={framePhotos.cornerUrl}
                          alt="Corner detail"
                          className="w-full h-full object-cover"
                          loading="lazy"
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
                          alt="Profile"
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="aspect-square rounded-md border-2 border-dashed border-border flex items-center justify-center bg-muted/30">
                        <p className="text-xs text-muted-foreground">Profile</p>
                      </div>
                    )}
                    <div className="aspect-square rounded-md border overflow-hidden bg-background">
                      <img
                        src={randomLifestylePhoto.url}
                        alt={randomLifestylePhoto.alt}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground text-center pt-4">
                    Color themes are inspired by the U.S. Armed Forces. No endorsement or official
                    affiliation is implied.
                  </p>
                </div>
              </Card>
            </div>

            <div className={isMobile && mobileView === "preview" ? "hidden" : ""}>
              <div className="space-y-6">
                <h2 ref={controlsHeadingRef} className="sr-only">
                  Customize Your Military Frame
                </h2>
                <div className="hidden lg:block mb-6">
                  <h3 className="text-sm font-semibold mb-3">Select Size</h3>
                  <div className="flex gap-2 mb-3">
                    {availableLayouts.map((lo) => (
                      <button
                        key={lo.id}
                        onClick={() => setSelectedLayout(lo.id)}
                        className={`flex-1 px-3 py-2.5 rounded-md border-2 text-center ${
                          selectedLayout === lo.id
                            ? "border-primary bg-primary/5 font-semibold"
                            : "border-border"
                        }`}
                        data-testid={`button-size-${lo.id}-desktop`}
                      >
                        <div className="text-sm font-medium">
                          {lo.displayName.replace(" Size", "")}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {lo.matOpeningWidth}×{lo.matOpeningHeight}&quot;
                        </div>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setSelectedLayout("custom")}
                    className={`w-full px-4 py-3 rounded-md border-2 text-center ${
                      selectedLayout === "custom" ? "border-primary bg-primary/5" : "border-dashed"
                    }`}
                    data-testid="button-size-custom-desktop"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Settings className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Custom Size</span>
                    </div>
                  </button>
                  {selectedLayout === "custom" && (
                    <div className="mt-4 p-4 bg-muted/30 rounded-lg border">
                      <div className="flex gap-4 items-end">
                        <div className="flex-1">
                          <Label className="text-sm mb-1.5 block">Display Width</Label>
                          <Input
                            value={customWidth}
                            onChange={(e) => setCustomWidth(e.target.value)}
                            placeholder="e.g., 20"
                            className={!customDimensionValidation.valid ? "border-destructive" : ""}
                          />
                        </div>
                        <div className="pb-2 text-xl text-muted-foreground">×</div>
                        <div className="flex-1">
                          <Label className="text-sm mb-1.5 block">Display Height</Label>
                          <Input
                            value={customHeight}
                            onChange={(e) => setCustomHeight(e.target.value)}
                            placeholder="e.g., 16"
                            className={!customDimensionValidation.valid ? "border-destructive" : ""}
                          />
                        </div>
                      </div>
                      {!customDimensionValidation.valid && customDimensionValidation.message && (
                        <p className="text-sm text-destructive mt-3">
                          {customDimensionValidation.message}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <Accordion
                  type="multiple"
                  defaultValue={["frame", "branch", "nameplate", "hardware"]}
                  className="space-y-4"
                >
                  <AccordionItem value="frame" className="border rounded-lg px-6">
                    <AccordionTrigger
                      className="hover:no-underline text-lg font-semibold"
                      data-testid="accordion-shadowbox"
                    >
                      Choose Your Shadowbox Style
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 pb-6">
                      <div className="grid grid-cols-2 gap-2 md:max-h-[400px] md:overflow-y-auto">
                        {frameStyles.map((frame) => (
                          <button
                            key={frame.id}
                            onClick={() => setSelectedFrame(frame)}
                            className={`p-3 rounded-md border-2 text-left ${
                              selectedFrame?.id === frame.id
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
                                  loading="lazy"
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
                            <p className="text-xs text-muted-foreground">
                              Width: {frame.mouldingWidth}&quot; · Depth: {frame.usableDepth}&quot;
                            </p>
                          </button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="branch" className="border rounded-lg px-6">
                    <AccordionTrigger className="hover:no-underline" data-testid="accordion-branch">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Award className="w-5 h-5 text-primary" />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold">
                            Color Themes Inspired by U.S. Military Branches
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {selectedBranch?.displayName} Colors
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 pb-6">
                      <p className="text-xs text-muted-foreground mb-4">
                        Color themes are inspired by the U.S. Armed Forces. No endorsement or
                        official affiliation is implied.
                      </p>
                      <Label>Select Color Theme</Label>
                      <Select value={selectedBranchId} onValueChange={setSelectedBranchId}>
                        <SelectTrigger data-testid="select-branch">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {MILITARY_BRANCHES.map((b) => (
                            <SelectItem
                              key={b.id}
                              value={b.id}
                              data-testid={`select-branch-${b.id}`}
                            >
                              {b.displayName} Colors
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="space-y-3 pt-4">
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <div
                            className="w-8 h-8 rounded-full border-2 border-border"
                            style={{ backgroundColor: topMat.hex }}
                          />
                          <div>
                            <div className="text-sm font-medium">Top Mat</div>
                            <div className="text-xs text-muted-foreground">{topMat.name}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <div
                            className="w-8 h-8 rounded-full border-2 border-border"
                            style={{ backgroundColor: bottomMat.hex }}
                          />
                          <div>
                            <div className="text-sm font-medium">Bottom Mat</div>
                            <div className="text-xs text-muted-foreground">{bottomMat.name}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <div
                            className="w-8 h-8 rounded-full border-2 border-border"
                            style={{ backgroundColor: backing.hex }}
                          />
                          <div>
                            <div className="text-sm font-medium">Backing</div>
                            <div className="text-xs text-muted-foreground">{backing.name}</div>
                          </div>
                        </div>
                        <BottomWeightedMatting
                          checked={bottomWeighted}
                          onCheckedChange={setBottomWeighted}
                          testIdPrefix="military"
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="nameplate" className="border rounded-lg px-6">
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
                        showFlagOption
                        embedded
                      />
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="hardware" className="border rounded-lg px-6">
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
                        frameWidth={baseFrameWidth}
                        frameHeight={baseFrameHeight}
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <PriceBox
                  totalPrice={pricing.total}
                  quantity={quantity}
                  onQuantityChange={setQuantity}
                  onAddToCart={handleAddToCart}
                  onCopyLink={handleCopyLink}
                  priceItems={priceItems}
                  testIdPrefix=""
                />

                <div className="hidden lg:block">
                  <TrustBox />
                </div>
              </div>
            </div>
          </div>
        </div>

        <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
          <DialogContent data-testid="dialog-share">
            <DialogHeader>
              <DialogTitle>Share Your Design</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <p className="text-sm text-muted-foreground">
                Copy the link below to share your military frame configuration:
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={typeof window !== "undefined" ? window.location.href : ""}
                  readOnly
                  className="flex-1 px-3 py-2 text-sm border rounded-md bg-muted"
                  data-testid="input-share-url"
                />
                <Button onClick={handleShare} data-testid="button-copy-link">
                  Copy Link
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showFullscreenPreview} onOpenChange={setShowFullscreenPreview}>
          <DialogContent
            className="max-w-[100vw] w-screen h-screen max-h-screen p-0 border-0"
            data-testid="dialog-fullscreen"
          >
            <DialogHeader className="sr-only">
              <DialogTitle>Frame Preview</DialogTitle>
            </DialogHeader>
            <div className="relative w-full h-full flex items-center justify-center bg-white">
              <div className="w-full h-full flex items-center justify-center p-8">
                <div style={{ filter: "drop-shadow(0 8px 32px rgba(0, 0, 0, 0.15))" }}>
                  <MilitaryPreviewCanvas
                    layout={layout}
                    framePhotos={framePhotos}
                    adjustedLayout={adjustedLayout}
                    selectedFrame={selectedFrame}
                    topMatColor={topMat}
                    bottomMatColor={bottomMat}
                    backingColor={backing}
                    brassNameplateConfig={brassNameplateConfig}
                  />
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isMobile && showMobileBar && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t p-3 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="text-lg font-bold" data-testid="text-mobile-price">
              ${pricing.total.toFixed(2)}
            </div>
            <QuantitySelector
              value={quantity}
              onChange={setQuantity}
              className="w-14 h-7 text-xs text-center p-0"
              testId="input-mobile-quantity"
            />
            <Button
              size="icon"
              variant="outline"
              onClick={handleCopyLink}
              className="h-11 w-11"
              data-testid="button-mobile-copy-link"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleAddToCart}
              className="flex-1 text-xs min-w-0 min-h-11"
              data-testid="button-mobile-add-to-cart"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      )}

      <Button
        size="lg"
        className={`fixed bottom-20 right-6 z-[60] lg:hidden shadow-lg rounded-full h-14 px-6 transition-all duration-300 ${
          isMobile ? "translate-y-0 opacity-100" : "translate-y-32 opacity-0 pointer-events-none"
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
