"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import {
  Share2,
  ShoppingCart,
  Settings,
  Eye,
  Copy,
  Maximize,
  X,
  Circle,
  Shield,
  Sparkles,
  Award,
  Layers,
  Package,
  Target,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { QuantitySelector } from "../ui/quantity-selector";
import { PriceBox } from "../ui/PriceBox";
import type { PriceLineItem } from "../ui/PriceBox";
import { useToast } from "../../hooks/use-toast";
import {
  useIsMobile,
  useMobileViewToggle,
  useIntelligentPreviewSizing,
  getFrameStyleById,
  calculatePricing,
  computePreviewLayout,
  getPuckLayoutById,
  getAllPuckLayouts,
  getRandomPuckLifestyleImage,
  getStoreBaseAssetUrl,
} from "@framecraft/core";
import type { PuckLayoutType } from "@framecraft/core";
import type { FrameStyle, FrameConfiguration } from "@framecraft/types";
import type { BrassNameplateConfig } from "@framecraft/types";
import { BRASS_NAMEPLATE_SPECS } from "@framecraft/types";
import { getMatsInDisplayOrder, getMatById, ALL_MATS, type Mat } from "@framecraft/config";
import { ColorSwatchesWithSeparator } from "../ui/ColorSwatches";
import { TrustBox } from "../marketing/TrustBox";
import { PuckPreviewCanvas } from "./PuckPreviewCanvas";
import { PuckLifestyleCarousel } from "./PuckLifestyleCarousel";
import { BrassNameplateSection } from "../brass-nameplate/BrassNameplateSection";
import { HangingHardwareSection } from "./shared/HangingHardwareSection";
import { BottomWeightedMatting, BOTTOM_WEIGHTED_EXTRA } from "./shared/BottomWeightedMatting";

const PUCK_FRAME_IDS = [
  "extra-deep-matte-black",
  "extra-deep-bright-white",
  "extra-deep-rich-walnut",
];
const puckFrames = PUCK_FRAME_IDS.map((id) => getFrameStyleById(id)).filter(
  Boolean
) as FrameStyle[];

const getPuckFrameName = (frameSku: string): string => {
  const mapping: Record<string, string> = {
    "10727": "Black Wood",
    "10728": "White Wood",
    "10729": "Brown Wood",
  };
  return mapping[frameSku] ?? frameSku;
};

interface PuckFrameDesignerProps {
  defaultFrameId?: string;
  embedded?: boolean;
}

export function PuckFrameDesigner({ defaultFrameId, embedded = false }: PuckFrameDesignerProps) {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { mobileView, setMobileView, showMobileBar, previewCardRef, controlsHeadingRef } =
    useMobileViewToggle({ isMobile });

  const urlParams = useMemo(() => {
    if (typeof window === "undefined") return new URLSearchParams();
    return new URLSearchParams(window.location.search);
  }, []);

  const standardMatsRaw = useMemo(
    () => getMatsInDisplayOrder(isMobile ? "mobile" : "desktop", true, false),
    [isMobile]
  );
  const premiumMatsRaw = useMemo(
    () => getMatsInDisplayOrder(isMobile ? "mobile" : "desktop", false, true),
    [isMobile]
  );
  const defaultWhiteMat = getMatById("mat-1") ?? ALL_MATS[0]!;
  const defaultBlackMat = getMatById("mat-2") ?? ALL_MATS[1] ?? ALL_MATS[0]!;

  const initialFrame = useMemo((): FrameStyle => {
    const fallback = puckFrames[0]!;
    if (defaultFrameId) return getFrameStyleById(defaultFrameId) ?? fallback;
    const frameParam = urlParams.get("frame");
    return frameParam ? (getFrameStyleById(frameParam) ?? fallback) : fallback;
  }, [defaultFrameId, urlParams]);

  const [selectedLayout, setSelectedLayout] = useState<PuckLayoutType>(() => {
    const urlLayout = urlParams.get("layout");
    const validLayouts = getAllPuckLayouts().map((l) => l.id);
    if (urlLayout && validLayouts.includes(urlLayout as PuckLayoutType))
      return urlLayout as PuckLayoutType;
    return "single";
  });

  const [selectedFrame, setSelectedFrame] = useState<FrameStyle>(initialFrame);
  const [matType, setMatType] = useState<"single" | "double">(() =>
    urlParams.get("matType") === "double" ? "double" : "single"
  );
  const [selectedMat, setSelectedMat] = useState<Mat>(() => {
    const urlMat = urlParams.get("mat");
    if (urlMat) {
      const mat = getMatById(urlMat);
      if (mat) return mat;
    }
    return defaultBlackMat;
  });
  const [selectedBottomMat, setSelectedBottomMat] = useState<Mat>(() => {
    const urlBottomMat = urlParams.get("bottomMat");
    if (urlBottomMat) {
      const mat = getMatById(urlBottomMat);
      if (mat) return mat;
    }
    return defaultWhiteMat;
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
  const [hardware, setHardware] = useState<"standard" | "security">(
    (urlParams.get("hardware") as "standard" | "security") ?? "standard"
  );
  const [bottomWeighted, setBottomWeighted] = useState(
    () => urlParams.get("bottomWeighted") === "true"
  );
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showFullscreenPreview, setShowFullscreenPreview] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [lifestylePreviewImage, setLifestylePreviewImage] = useState(() =>
    getRandomPuckLifestyleImage()
  );

  const sentinelRef = useRef<HTMLDivElement>(null);

  const currentLayout = useMemo(
    () => getPuckLayoutById(selectedLayout) ?? getAllPuckLayouts()[0]!,
    [selectedLayout]
  );

  const bottomWeightedExtra = bottomWeighted ? BOTTOM_WEIGHTED_EXTRA : 0;
  const PUCK_NAMEPLATE_EXTENSION = 0.75;
  const plaqueExtension = brassNameplateConfig.enabled ? PUCK_NAMEPLATE_EXTENSION : 0;
  const frameWidth = currentLayout.frameInteriorWidth + 2 * (selectedFrame.mouldingWidth ?? 1.25);
  const frameHeight =
    currentLayout.frameInteriorHeight +
    2 * (selectedFrame.mouldingWidth ?? 1.25) +
    bottomWeightedExtra +
    plaqueExtension;

  const { containerRef, previewContainerHeight, containerWidth } = useIntelligentPreviewSizing({
    frameWidth,
    frameHeight,
    plaqueEnabled: brassNameplateConfig.enabled,
    plaqueExtension: PUCK_NAMEPLATE_EXTENSION,
    isMobile,
    minHeightMobile: 350,
    minHeightDesktop: 500,
  });

  const [framePhotos, setFramePhotos] = useState<{
    cornerUrl?: string;
    profileUrl?: string;
    topUrl?: string;
    bottomUrl?: string;
    leftUrl?: string;
    rightUrl?: string;
  }>({});

  useEffect(() => {
    setLifestylePreviewImage(getRandomPuckLifestyleImage());
  }, [selectedFrame.id]);

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
        } else setFramePhotos({});
      } catch (err) {
        console.error("Error fetching frame photos:", err);
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
    params.set("matType", matType);
    params.set("mat", selectedMat.id);
    params.set("bottomMat", selectedBottomMat.id);
    params.set("hardware", hardware);
    params.set("bottomWeighted", String(bottomWeighted));
    if (brassNameplateConfig.enabled) {
      params.set("nameplateEnabled", "true");
      if (brassNameplateConfig.line1) params.set("nameplateLine1", brassNameplateConfig.line1);
      if (brassNameplateConfig.line2) params.set("nameplateLine2", brassNameplateConfig.line2);
      if (brassNameplateConfig.line3) params.set("nameplateLine3", brassNameplateConfig.line3);
      if (brassNameplateConfig.font) params.set("nameplateFont", brassNameplateConfig.font);
      if (brassNameplateConfig.color) params.set("nameplateColor", brassNameplateConfig.color);
      if (brassNameplateConfig.includeFlag) params.set("nameplateFlag", "true");
    }
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", newUrl);
  }, [
    selectedLayout,
    selectedFrame,
    matType,
    selectedMat,
    selectedBottomMat,
    hardware,
    bottomWeighted,
    brassNameplateConfig,
  ]);

  const layout = useMemo(() => {
    const adjustedInteriorHeight =
      currentLayout.frameInteriorHeight + bottomWeightedExtra + plaqueExtension;
    return computePreviewLayout({
      artW: currentLayout.frameInteriorWidth - 2 * currentLayout.matBorder,
      artH: adjustedInteriorHeight - 2 * currentLayout.matBorder,
      matBorderTop: currentLayout.matBorder,
      matBorderRight: currentLayout.matBorder,
      matBorderBottom: currentLayout.matBorder + bottomWeightedExtra + plaqueExtension,
      matBorderLeft: currentLayout.matBorder,
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
    plaqueExtension,
  ]);

  const pricing = useMemo(() => {
    const artWidth = currentLayout.frameInteriorWidth - 2 * currentLayout.matBorder;
    const artHeight = currentLayout.frameInteriorHeight - 2 * currentLayout.matBorder;
    const frameConfig: FrameConfiguration = {
      serviceType: "frame-only",
      artworkWidth: artWidth,
      artworkHeight: artHeight,
      frameStyleId: selectedFrame.id,
      matType,
      matBorderWidth: currentLayout.matBorder,
      matRevealWidth: 0.125,
      matColorId: selectedMat.id,
      matInnerColorId: matType === "double" ? selectedBottomMat.id : undefined,
      glassTypeId: "backing-only",
      bottomWeighted,
    };
    try {
      const pricingResult = calculatePricing(frameConfig);
      const nameplatePrice = brassNameplateConfig.enabled ? BRASS_NAMEPLATE_SPECS.PRICE : 0;
      return {
        framePrice: pricingResult.total,
        nameplatePrice,
        total: pricingResult.total + nameplatePrice,
      };
    } catch (err) {
      console.error("Pricing calculation error:", err);
      return { framePrice: 0, nameplatePrice: 0, total: 0 };
    }
  }, [
    currentLayout,
    selectedFrame.id,
    matType,
    selectedMat.id,
    selectedBottomMat.id,
    bottomWeighted,
    brassNameplateConfig.enabled,
  ]);

  const priceItems: PriceLineItem[] = useMemo(() => {
    const items: PriceLineItem[] = [
      { label: `${currentLayout.displayName} Frame`, amount: pricing.framePrice },
    ];
    if (pricing.nameplatePrice > 0)
      items.push({ label: "Brass Nameplate", amount: pricing.nameplatePrice });
    return items;
  }, [currentLayout.displayName, pricing]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Share this link to show your custom frame design.",
      });
      setShowShareDialog(false);
    } catch {
      toast({
        title: "Failed to copy",
        description: "Please copy the URL from your browser's address bar.",
        variant: "destructive",
      });
    }
  };

  const handleAddToCart = () => {
    toast({
      title: "Added to cart!",
      description: `${currentLayout.displayName} frame added to your cart.`,
    });
  };

  const finishedWidth = (
    currentLayout.frameInteriorWidth +
    2 * (selectedFrame.mouldingWidth ?? 1.25)
  ).toFixed(2);
  const finishedHeight = (
    currentLayout.frameInteriorHeight +
    2 * (selectedFrame.mouldingWidth ?? 1.25) +
    bottomWeightedExtra +
    plaqueExtension
  ).toFixed(2);

  const allLayouts = useMemo(() => getAllPuckLayouts(), []);

  const thumbnailUrl = (frame: FrameStyle) =>
    frame.thumbnail
      ? getStoreBaseAssetUrl(
          frame.thumbnail.startsWith("/") ? frame.thumbnail.slice(1) : frame.thumbnail
        )
      : undefined;

  return (
    <div className={`min-h-screen bg-background ${embedded ? "" : "py-4 md:py-8"}`}>
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <div
            className={`${isMobile && mobileView === "controls" ? "hidden" : ""} lg:sticky lg:top-20 lg:self-start space-y-4`}
          >
            <Card ref={previewCardRef} className="overflow-hidden">
              <div ref={sentinelRef} className="h-1" />
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="font-semibold flex items-center gap-2">
                  <Circle className="w-4 h-4" />
                  Hockey Puck Frame
                </h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowFullscreenPreview(true)}
                    data-testid="button-fullscreen"
                  >
                    <Maximize className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowShareDialog(true)}
                    data-testid="button-share"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div
                ref={containerRef}
                className="flex items-center justify-center p-6 bg-muted/30"
                style={{ minHeight: `${previewContainerHeight}px` }}
              >
                <PuckPreviewCanvas
                  layout={layout}
                  framePhotos={framePhotos}
                  currentLayout={currentLayout}
                  selectedFrame={selectedFrame}
                  topMatColor={selectedMat}
                  bottomMatColor={selectedBottomMat}
                  matType={matType}
                  brassNameplateConfig={brassNameplateConfig}
                  bottomWeightedExtra={bottomWeightedExtra}
                  plaqueExtension={plaqueExtension}
                />
              </div>
              <div className="p-4 border-t bg-muted/20 text-sm text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>
                    Finished Size: {finishedWidth}&quot; × {finishedHeight}&quot;
                  </span>
                  <span>
                    {currentLayout.puckCount} puck{currentLayout.puckCount > 1 ? "s" : ""}
                  </span>
                </div>
              </div>
              <div className="p-4 grid grid-cols-3 gap-2">
                {framePhotos.cornerUrl ? (
                  <div className="aspect-square rounded-md border overflow-hidden bg-background">
                    <img
                      src={framePhotos.cornerUrl}
                      alt="Frame corner"
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
                      alt="Frame profile"
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
                    alt="Puck frame in home setting"
                    className="w-full h-full object-cover"
                    data-testid="img-puck-lifestyle-preview"
                  />
                </div>
              </div>
            </Card>
            {isMobile && (
              <div className="flex gap-2">
                <Button
                  variant={mobileView === "preview" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setMobileView("preview")}
                  data-testid="button-view-preview"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button
                  variant={mobileView === "controls" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setMobileView("controls")}
                  data-testid="button-view-controls"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Customize
                </Button>
              </div>
            )}
          </div>

          <div className={`space-y-4 ${isMobile && mobileView === "preview" ? "hidden" : ""}`}>
            <Card className="p-4">
              <h2
                ref={controlsHeadingRef}
                className="text-xl font-bold mb-4 flex items-center gap-2"
              >
                <Settings className="w-5 h-5" />
                Customize Your Frame
              </h2>
              <Accordion
                type="multiple"
                defaultValue={["layout", "frame", "mat", "nameplate", "hardware"]}
                className="space-y-2"
              >
                <AccordionItem value="layout" className="border rounded-lg px-4">
                  <AccordionTrigger
                    className="text-base font-semibold hover:no-underline py-4"
                    data-testid="accordion-layout"
                  >
                    Layout
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {allLayouts.map((layoutOption) => (
                        <button
                          key={layoutOption.id}
                          onClick={() => setSelectedLayout(layoutOption.id)}
                          className={`p-3 rounded-lg border-2 text-left hover:border-primary/50 ${
                            selectedLayout === layoutOption.id
                              ? "border-primary bg-primary/5"
                              : "border-border"
                          }`}
                          data-testid={`button-layout-${layoutOption.id}`}
                        >
                          <div className="font-medium text-sm">{layoutOption.displayName}</div>
                          <div className="text-xs text-muted-foreground">
                            {layoutOption.puckCount} puck{layoutOption.puckCount > 1 ? "s" : ""}
                          </div>
                        </button>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="frame" className="border rounded-lg px-4">
                  <AccordionTrigger
                    className="text-base font-semibold hover:no-underline py-4"
                    data-testid="accordion-frame"
                  >
                    Frame Style
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <div className="grid grid-cols-3 gap-3">
                      {puckFrames.map((frame) => (
                        <button
                          key={frame.id}
                          onClick={() => setSelectedFrame(frame)}
                          className={`p-3 rounded-lg border-2 text-center hover:border-primary/50 ${
                            selectedFrame.id === frame.id
                              ? "border-primary bg-primary/5"
                              : "border-border"
                          }`}
                          data-testid={`button-frame-${frame.id}`}
                        >
                          {thumbnailUrl(frame) ? (
                            <img
                              src={thumbnailUrl(frame)}
                              alt={frame.name}
                              className="w-full h-12 object-cover rounded mb-2"
                            />
                          ) : (
                            <div
                              className="w-full h-12 rounded mb-2"
                              style={{
                                background: `linear-gradient(135deg, ${frame.color} 0%, ${frame.borderColor} 100%)`,
                              }}
                            />
                          )}
                          <div className="text-sm font-medium">
                            {getPuckFrameName(frame.sku ?? "")}
                          </div>
                        </button>
                      ))}
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">
                      Extra-deep shadowbox frames with 2&quot; usable depth for hockey pucks.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="mat" className="border rounded-lg px-4">
                  <AccordionTrigger
                    className="text-base font-semibold hover:no-underline py-4"
                    data-testid="accordion-mat"
                  >
                    Mat Colors
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 space-y-4">
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
                    <BottomWeightedMatting
                      checked={bottomWeighted}
                      onCheckedChange={setBottomWeighted}
                      testIdPrefix="puck"
                    />
                    <div
                      className={
                        matType === "double"
                          ? "pt-4 pb-3 px-3 bg-muted/40 rounded-lg space-y-3"
                          : "space-y-3"
                      }
                    >
                      <Label>
                        {matType === "double"
                          ? `Top Mat Color: ${selectedMat.name}`
                          : `Mat Color: ${selectedMat.name}`}
                      </Label>
                      <ColorSwatchesWithSeparator
                        standardColors={standardMatsRaw}
                        premiumColors={premiumMatsRaw}
                        selectedId={selectedMat.id}
                        onSelect={setSelectedMat}
                        testIdPrefix="mat"
                      />
                    </div>
                    {matType === "double" && (
                      <>
                        <Separator className="my-6" />
                        <div className="space-y-3 pt-4 pb-3 px-3 bg-muted/40 rounded-lg">
                          <Label className="font-semibold">
                            Bottom Mat Color: {selectedBottomMat.name}
                          </Label>
                          <ColorSwatchesWithSeparator
                            standardColors={standardMatsRaw}
                            premiumColors={premiumMatsRaw}
                            selectedId={selectedBottomMat.id}
                            onSelect={setSelectedBottomMat}
                            testIdPrefix="bottom-mat"
                          />
                        </div>
                      </>
                    )}
                  </AccordionContent>
                </AccordionItem>
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
                      embedded
                    />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="hardware" className="border rounded-lg px-4">
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
                      frameWidth={frameWidth}
                      frameHeight={frameHeight}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>
            <TrustBox />
            {!isMobile && (
              <div className="sticky bottom-4 z-10">
                <PriceBox
                  totalPrice={pricing.total}
                  priceItems={priceItems}
                  quantity={quantity}
                  onQuantityChange={setQuantity}
                  onAddToCart={handleAddToCart}
                  className="md:static md:bottom-auto"
                />
              </div>
            )}
          </div>
        </div>

        <PuckLifestyleCarousel onImageClick={(url) => setLifestylePreviewImage(url)} />

        <section className="py-12 md:py-16 border-t">
          <div className="max-w-7xl mx-auto">
            <h2
              className="text-2xl md:text-3xl font-bold mb-8 text-center"
              data-testid="heading-benefits"
            >
              Why Frame Your Hockey Pucks
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Shield,
                  title: "Extra-Deep Shadowbox",
                  text: '2" usable depth holds pucks securely without crushing or shifting.',
                },
                {
                  icon: Sparkles,
                  title: "Framer's Grade Acrylic",
                  text: "Helps prevent fading of autographs and team logos.",
                },
                {
                  icon: Award,
                  title: "Archival Materials",
                  text: "Professional-grade mat boards and backing keep your collection safe.",
                },
                {
                  icon: Target,
                  title: "Precision Circular Openings",
                  text: 'Each puck opening is cut to exactly 3" diameter for a snug fit.',
                },
                {
                  icon: Layers,
                  title: "Single or Double Mat",
                  text: "Choose a single mat or add a double mat for a color accent ring.",
                },
                {
                  icon: Package,
                  title: "Multiple Layout Options",
                  text: "Display 1 to 32 pucks in a single frame with optional photo openings.",
                },
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className="p-6 rounded-lg border bg-card">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {isMobile && showMobileBar && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-3 z-50 shadow-lg">
          <div className="container mx-auto flex items-center justify-between gap-3">
            <div className="flex-1">
              <div className="text-lg font-bold">${(pricing.total * quantity).toFixed(2)}</div>
              <div className="text-xs text-muted-foreground">
                {quantity > 1 ? `${quantity} × $${pricing.total.toFixed(2)}` : ""}
              </div>
            </div>
            <QuantitySelector value={quantity} onChange={setQuantity} />
            <Button
              onClick={handleAddToCart}
              className="flex-1"
              data-testid="button-mobile-add-to-cart"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      )}

      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Your Design</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Copy this link to share your custom puck frame design.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={typeof window !== "undefined" ? window.location.href : ""}
              className="flex-1 px-3 py-2 border rounded-md text-sm bg-muted"
            />
            <Button onClick={handleCopyLink} data-testid="button-copy-link">
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showFullscreenPreview} onOpenChange={setShowFullscreenPreview}>
        <DialogContent className="max-w-4xl h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Frame Preview</span>
              <Button variant="ghost" size="icon" onClick={() => setShowFullscreenPreview(false)}>
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 flex items-center justify-center p-4 bg-muted/30 rounded-lg">
            <PuckPreviewCanvas
              layout={computePreviewLayout({
                artW: currentLayout.frameInteriorWidth - 2 * currentLayout.matBorder,
                artH:
                  currentLayout.frameInteriorHeight +
                  bottomWeightedExtra +
                  plaqueExtension -
                  2 * currentLayout.matBorder,
                matBorderTop: currentLayout.matBorder,
                matBorderRight: currentLayout.matBorder,
                matBorderBottom: currentLayout.matBorder + bottomWeightedExtra + plaqueExtension,
                matBorderLeft: currentLayout.matBorder,
                frameFace: selectedFrame.mouldingWidth,
                containerWpx: 800,
                containerHpx: 600,
                paddingPx: 24,
              })}
              framePhotos={framePhotos}
              currentLayout={currentLayout}
              selectedFrame={selectedFrame}
              topMatColor={selectedMat}
              bottomMatColor={selectedBottomMat}
              matType={matType}
              brassNameplateConfig={brassNameplateConfig}
              bottomWeightedExtra={bottomWeightedExtra}
              plaqueExtension={plaqueExtension}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
