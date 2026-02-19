"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Copy, X, Eye, Settings, Upload, CheckCircle2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { TooltipProvider } from "../ui/tooltip";
import { QuantitySelector } from "../ui/quantity-selector";
import { PriceBox } from "../ui/PriceBox";
import type { PriceLineItem } from "../ui/PriceBox";
import type { FrameStyle, FrameConfiguration } from "@framecraft/types";
import type { BrassNameplateConfig } from "@framecraft/types";
import { BRASS_NAMEPLATE_SPECS } from "@framecraft/types";
import {
  getFramesByCategory,
  getGlassTypes,
  getFrameStyleById,
  calculatePricing,
  addToCart,
  TICKET_STUB_LAYOUTS,
  useIntelligentPreviewSizing,
  useIsMobile,
  useMobileViewToggle,
  getStoreBaseAssetUrl,
  type TicketStubLayoutType,
} from "@framecraft/core";
import { ALL_MATS, getMatById, type Mat } from "@framecraft/config";
import { useToast } from "../../hooks/use-toast";
import { ColorSwatchesWithSeparator } from "../ui/ColorSwatches";
import { HangingHardwareSection } from "./shared/HangingHardwareSection";
import { BottomWeightedMatting, BOTTOM_WEIGHTED_EXTRA } from "./shared/BottomWeightedMatting";
import { BrassNameplateSection } from "../brass-nameplate/BrassNameplateSection";
import { TicketStubPreview } from "./TicketStubPreview";
import { TicketStubLayoutGallery } from "./TicketStubLayoutGallery";

const MAT_REVEAL = 0.25;
const MAT_SURCHARGE_PER_OPENING = 15;
const DOUBLE_MAT_SURCHARGE = 15;
const SECURITY_HARDWARE_UPCHARGE = 8.95;
const PRINT_PRICE_PER_PHOTO = 8;

const pictureFrames = getFramesByCategory("picture");
const shadowboxFrames = getFramesByCategory("shadowbox");
const allFrames: FrameStyle[] = [...pictureFrames, ...shadowboxFrames];
const glassTypes = getGlassTypes().filter((g) => g.id === "standard" || g.id === "non-glare");

const defaultNameplateConfig: BrassNameplateConfig = {
  enabled: false,
  line1: "",
  line2: "",
  line3: "",
  font: "georgia",
  color: "brass-black",
  includeFlag: false,
};

interface TicketStubFrameDesignerProps {
  defaultFrameId?: string;
  embedded?: boolean;
}

export function TicketStubFrameDesigner({
  defaultFrameId,
  embedded = false,
}: TicketStubFrameDesignerProps) {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { mobileView, setMobileView, showMobileBar, previewCardRef, controlsHeadingRef } =
    useMobileViewToggle({ isMobile });

  const urlParams = useMemo(() => {
    if (typeof window === "undefined") return new URLSearchParams();
    return new URLSearchParams(window.location.search);
  }, []);

  const initialFrame = useMemo((): FrameStyle => {
    if (defaultFrameId) {
      const f = allFrames.find((x) => x.id === defaultFrameId || x.sku === defaultFrameId);
      return f ?? allFrames[0]!;
    }
    const frameParam = urlParams.get("frame");
    if (frameParam) {
      const f = getFrameStyleById(frameParam) ?? allFrames.find((x) => x.sku === frameParam);
      return f ?? allFrames[0]!;
    }
    return pictureFrames[0] ?? allFrames[0]!;
  }, [defaultFrameId, urlParams]);

  const [selectedLayout, setSelectedLayout] = useState<TicketStubLayoutType>(() => {
    const urlLayout = urlParams.get("layout") as TicketStubLayoutType | null;
    if (urlLayout && TICKET_STUB_LAYOUTS.some((l) => l.id === urlLayout)) return urlLayout;
    return "ticket-photo-single-5x7";
  });
  const [selectedFrame, setSelectedFrame] = useState<FrameStyle>(initialFrame);
  const [selectedMat, setSelectedMat] = useState<Mat>(
    () => getMatById(urlParams.get("mat") ?? "mat-1") ?? ALL_MATS[0]!
  );
  const [selectedMatInner, setSelectedMatInner] = useState<Mat>(
    () => getMatById(urlParams.get("matInner") ?? "mat-2") ?? ALL_MATS[1]!
  );
  const [matType, setMatType] = useState<"single" | "double">(() =>
    urlParams.get("matType") === "double" ? "double" : "single"
  );
  const [selectedGlass, setSelectedGlass] = useState(
    () => glassTypes.find((g) => g.id === urlParams.get("glass")) ?? glassTypes[0]!
  );
  const [hardware, setHardware] = useState<"standard" | "security">(
    () => (urlParams.get("hardware") as "standard" | "security") || "standard"
  );
  const [bottomWeighted, setBottomWeighted] = useState(
    () => urlParams.get("bottomWeighted") === "true"
  );
  const [brassNameplateConfig, setBrassNameplateConfig] =
    useState<BrassNameplateConfig>(defaultNameplateConfig);
  const [quantity, setQuantity] = useState(1);
  const [serviceType, setServiceType] = useState<"frame-only" | "print-and-frame">(() =>
    urlParams.get("service") === "print-and-frame" ? "print-and-frame" : "frame-only"
  );
  const [copyrightAgreed, setCopyrightAgreed] = useState(false);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [framePhotos, setFramePhotos] = useState<Record<string, string>>({});
  const hardwareSectionRef = useRef<HTMLDivElement>(null);
  const [pricingSidebarExpanded, setPricingSidebarExpanded] = useState(false);

  const currentLayout = useMemo(
    () => TICKET_STUB_LAYOUTS.find((l) => l.id === selectedLayout) ?? TICKET_STUB_LAYOUTS[0]!,
    [selectedLayout]
  );
  const bottomWeightedExtra = bottomWeighted ? BOTTOM_WEIGHTED_EXTRA : 0;
  const plaqueFrameExtension = useMemo(() => {
    if (!brassNameplateConfig.enabled) return 0;
    const lowest = currentLayout.openings.reduce((max, o) => Math.max(max, o.y + o.height), 0);
    return Math.max(0, 3.75 - (currentLayout.frameHeight - lowest));
  }, [brassNameplateConfig.enabled, currentLayout]);

  const { containerRef, previewContainerHeight, containerWidth } = useIntelligentPreviewSizing({
    frameWidth: currentLayout.frameWidth,
    frameHeight: currentLayout.frameHeight + bottomWeightedExtra,
    plaqueEnabled: brassNameplateConfig.enabled,
    plaqueExtension: plaqueFrameExtension,
    isMobile,
    minHeightMobile: 400,
    maxHeightMobile: 600,
    minHeightDesktop: 400,
  });

  const printCount = useMemo(() => {
    if (!currentLayout.supportsPrintAndFrame || serviceType !== "print-and-frame") return 0;
    return userPhoto ? 1 : 0;
  }, [currentLayout.supportsPrintAndFrame, serviceType, userPhoto]);

  const pricing = useMemo(() => {
    const frameConfig: FrameConfiguration = {
      serviceType: serviceType === "print-and-frame" ? "print-and-frame" : "frame-only",
      artworkWidth: currentLayout.frameWidth,
      artworkHeight: currentLayout.frameHeight + bottomWeightedExtra + plaqueFrameExtension,
      frameStyleId: selectedFrame.id,
      matType,
      matBorderWidth: 0,
      matRevealWidth: MAT_REVEAL,
      matColorId: selectedMat.id,
      matInnerColorId: matType === "double" ? selectedMatInner.id : undefined,
      glassTypeId: selectedGlass?.id ?? "standard",
      imageUrl: serviceType === "print-and-frame" && userPhoto ? userPhoto : undefined,
      brassNameplateConfig: brassNameplateConfig.enabled ? brassNameplateConfig : undefined,
      bottomWeighted,
    };
    let framePrice = 0;
    try {
      const base = calculatePricing(frameConfig);
      framePrice = base.framePrice ?? 0;
    } catch {
      // ignore
    }
    const totalOpenings =
      (currentLayout.ticketCount ?? 0) +
      (currentLayout.photoCount ?? 0) +
      (currentLayout.posterCount ?? 0);
    let matPrice = totalOpenings > 1 ? (totalOpenings - 1) * MAT_SURCHARGE_PER_OPENING : 0;
    if (matType === "double") matPrice += DOUBLE_MAT_SURCHARGE;
    const hardwarePrice = hardware === "security" ? SECURITY_HARDWARE_UPCHARGE : 0;
    const nameplatePrice = brassNameplateConfig.enabled ? BRASS_NAMEPLATE_SPECS.PRICE : 0;
    const printPrice = printCount * PRINT_PRICE_PER_PHOTO;
    const total = framePrice + matPrice + hardwarePrice + nameplatePrice + printPrice;
    return {
      framePrice,
      matPrice,
      hardwarePrice,
      nameplatePrice,
      printPrice,
      total,
    };
  }, [
    selectedFrame,
    currentLayout,
    matType,
    selectedMat,
    selectedMatInner,
    selectedGlass,
    hardware,
    brassNameplateConfig,
    printCount,
    serviceType,
    userPhoto,
    bottomWeightedExtra,
    plaqueFrameExtension,
    bottomWeighted,
  ]);

  useEffect(() => {
    fetch(`/api/frames/${selectedFrame.sku}/photos`)
      .then((r) => (r.ok ? r.json() : {}))
      .then((data) => setFramePhotos(data))
      .catch(() => {});
  }, [selectedFrame.sku]);

  useEffect(() => {
    if (!isMobile || !hardwareSectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) setPricingSidebarExpanded(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "-100px 0px 0px 0px" }
    );
    observer.observe(hardwareSectionRef.current);
    return () => observer.disconnect();
  }, [isMobile]);

  useEffect(() => {
    if (!currentLayout.supportsPrintAndFrame && serviceType === "print-and-frame")
      setServiceType("frame-only");
  }, [currentLayout.supportsPrintAndFrame, serviceType]);

  const printAndFrameReady = useMemo(() => {
    if (!currentLayout.supportsPrintAndFrame || serviceType === "frame-only") return true;
    return !!userPhoto && copyrightAgreed;
  }, [currentLayout.supportsPrintAndFrame, serviceType, userPhoto, copyrightAgreed]);

  const handleShare = useCallback(() => {
    const params = new URLSearchParams();
    params.set("layout", selectedLayout);
    params.set("frame", selectedFrame.id);
    params.set("mat", selectedMat.id);
    if (matType === "double") params.set("matInner", selectedMatInner.id);
    params.set("matType", matType);
    params.set("glass", selectedGlass?.id ?? "standard");
    params.set("hardware", hardware);
    if (serviceType === "print-and-frame") params.set("service", "print-and-frame");
    if (bottomWeighted) params.set("bottomWeighted", "true");
    if (brassNameplateConfig.enabled) {
      params.set("nameplateEnabled", "true");
      if (brassNameplateConfig.line1) params.set("nameplateLine1", brassNameplateConfig.line1);
      if (brassNameplateConfig.line2) params.set("nameplateLine2", brassNameplateConfig.line2);
      if (brassNameplateConfig.line3) params.set("nameplateLine3", brassNameplateConfig.line3);
      params.set("nameplateFont", brassNameplateConfig.font);
      params.set("nameplateColor", brassNameplateConfig.color);
    }
    const url = `${typeof window !== "undefined" ? window.location.origin + window.location.pathname : ""}?${params.toString()}`;
    navigator.clipboard.writeText(url);
    toast({ title: "Link copied!", description: "Design link copied to clipboard" });
  }, [
    selectedLayout,
    selectedFrame,
    selectedMat,
    selectedMatInner,
    matType,
    selectedGlass,
    hardware,
    serviceType,
    bottomWeighted,
    brassNameplateConfig,
    toast,
  ]);

  const handlePhotoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setUserPhoto((ev.target?.result as string) ?? null);
    reader.readAsDataURL(file);
    e.target.value = "";
  }, []);

  const triggerPhotoUpload = useCallback(() => fileInputRef.current?.click(), []);

  const handleAddToCart = useCallback(async () => {
    if (currentLayout.supportsPrintAndFrame && serviceType === "print-and-frame") {
      if (!userPhoto) {
        toast({
          title: "Photo Required",
          description: "Please upload a photo for print and frame service.",
          variant: "destructive",
        });
        return;
      }
      if (!copyrightAgreed) {
        toast({
          title: "Copyright Agreement Required",
          description: "Please confirm you have the right to print this photo.",
          variant: "destructive",
        });
        return;
      }
    }
    const config: FrameConfiguration = {
      serviceType: serviceType === "print-and-frame" ? "print-and-frame" : "frame-only",
      artworkWidth: currentLayout.frameWidth,
      artworkHeight: currentLayout.frameHeight + bottomWeightedExtra + plaqueFrameExtension,
      frameStyleId: selectedFrame.id,
      matType,
      matBorderWidth: 0,
      matRevealWidth: MAT_REVEAL,
      matColorId: selectedMat.id,
      matInnerColorId: matType === "double" ? selectedMatInner.id : undefined,
      glassTypeId: selectedGlass?.id ?? "standard",
      imageUrl: serviceType === "print-and-frame" && userPhoto ? userPhoto : undefined,
      brassNameplateConfig: brassNameplateConfig.enabled ? brassNameplateConfig : undefined,
      bottomWeighted,
    };
    try {
      await addToCart(config, pricing.total * quantity, quantity);
      toast({
        title: "Added to cart!",
        description: `${quantity}× Ticket Frame – ${currentLayout.name}`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Could not add to cart",
        variant: "destructive",
      });
    }
  }, [
    currentLayout,
    serviceType,
    userPhoto,
    copyrightAgreed,
    quantity,
    pricing.total,
    selectedFrame,
    selectedMat,
    selectedMatInner,
    matType,
    selectedGlass,
    brassNameplateConfig,
    bottomWeighted,
    bottomWeightedExtra,
    plaqueFrameExtension,
    toast,
  ]);

  const priceItems: PriceLineItem[] = useMemo(() => {
    const items: PriceLineItem[] = [];
    items.push({
      label: `Frame + ${selectedGlass?.id === "non-glare" ? "Non-Glare Acrylic" : "Acrylic Glazing"}`,
      amount: pricing.framePrice,
      testId: "price-frame",
    });
    if (pricing.matPrice > 0) {
      const totalOpenings =
        (currentLayout.ticketCount ?? 0) +
        (currentLayout.photoCount ?? 0) +
        (currentLayout.posterCount ?? 0);
      items.push({
        label: `Mat Surcharge (${totalOpenings} openings)`,
        amount: pricing.matPrice,
        testId: "price-mat",
      });
    }
    items.push({
      label: hardware === "security" ? "Security Hardware" : "Standard Hardware",
      amount: pricing.hardwarePrice,
      isIncluded: hardware === "standard",
      testId: "price-hardware",
    });
    if (brassNameplateConfig.enabled)
      items.push({
        label: "Engraved Brass Nameplate",
        amount: pricing.nameplatePrice,
        testId: "price-nameplate",
      });
    if (pricing.printPrice > 0)
      items.push({
        label: "Photo Printing (1 print)",
        amount: pricing.printPrice,
        testId: "price-print",
      });
    return items;
  }, [pricing, currentLayout, selectedGlass, hardware, brassNameplateConfig.enabled]);

  const standardMats = ALL_MATS.filter((m) => !m.isPremium && m.lineNumber !== 28);
  const premiumMats = ALL_MATS.filter((m) => m.isPremium);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 pb-24 lg:pb-0">
        {isMobile && embedded && (
          <div className="lg:hidden border-b bg-card/50 sticky top-0 z-40">
            <div className="px-4 py-3">
              <h1 className="text-lg font-bold">Ticket Stub Frame Designer</h1>
            </div>
          </div>
        )}

        <div className="container mx-auto px-4 py-6 lg:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <div
              className={`${isMobile && mobileView === "controls" ? "hidden" : ""} lg:sticky lg:top-[132px] lg:self-start`}
            >
              <Card ref={previewCardRef} className="p-6" data-testid="card-preview">
                <div
                  ref={containerRef}
                  className="bg-muted/50 rounded p-2 md:p-4 flex items-center justify-center relative"
                  style={{ minHeight: `${previewContainerHeight}px` }}
                  data-testid="preview-container"
                >
                  <TicketStubPreview
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
                    userPhoto={serviceType === "print-and-frame" ? userPhoto : null}
                    onEditPhoto={userPhoto ? triggerPhotoUpload : undefined}
                  />
                </div>
                <p className="text-xs text-muted-foreground/60 text-center mt-2">
                  Sample image. Not included with purchase.
                </p>
                {currentLayout && (
                  <div className="mt-4 p-3 bg-muted/50 rounded-md text-sm">
                    <p className="font-medium">
                      Finished Size:{" "}
                      <span className="text-primary">
                        {currentLayout.frameWidth.toFixed(2)}&quot; ×{" "}
                        {(
                          currentLayout.frameHeight +
                          bottomWeightedExtra +
                          plaqueFrameExtension
                        ).toFixed(2)}
                        &quot;
                      </span>
                    </p>
                    <p className="text-muted-foreground text-xs">Layout: {currentLayout.name}</p>
                  </div>
                )}
              </Card>
            </div>

            <div className={`${isMobile && mobileView === "preview" ? "hidden" : ""} space-y-6`}>
              <h2 ref={controlsHeadingRef} className="text-2xl font-bold mb-2 lg:hidden">
                Customize Your Frame
              </h2>
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-4 hidden lg:block">
                  Configure Your Ticket Frame
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
                  <AccordionItem value="layout" className="border rounded-lg px-4 lg:px-6">
                    <AccordionTrigger
                      className="text-base font-semibold hover:no-underline py-4"
                      data-testid="accordion-layout"
                    >
                      Layout Selection
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <TicketStubLayoutGallery
                        selectedLayout={selectedLayout}
                        onLayoutChange={setSelectedLayout}
                        selectedPhotoSize={currentLayout.photoSize}
                        onPhotoSizeChange={() => {}}
                        selectedPosterSize={currentLayout.posterSize}
                        onPosterSizeChange={() => {}}
                        compact={isMobile}
                      />
                      {currentLayout.supportsPrintAndFrame && (
                        <Card className="mt-4 p-4">
                          <RadioGroup
                            value={serviceType}
                            onValueChange={(v: "frame-only" | "print-and-frame") =>
                              setServiceType(v)
                            }
                          >
                            <div className="grid grid-cols-2 gap-3">
                              <Label
                                htmlFor="ticket-frame-only"
                                className={`flex items-center justify-center p-4 rounded-md border-2 cursor-pointer ${serviceType === "frame-only" ? "border-primary bg-primary/5" : "border-border"}`}
                              >
                                <RadioGroupItem
                                  value="frame-only"
                                  id="ticket-frame-only"
                                  className="sr-only"
                                  data-testid="radio-service-frame-only"
                                />
                                <span className="font-semibold">Frame Only</span>
                              </Label>
                              <Label
                                htmlFor="ticket-print-and-frame"
                                className={`flex items-center justify-center p-4 rounded-md border-2 cursor-pointer ${serviceType === "print-and-frame" ? "border-primary bg-primary/5" : "border-border"}`}
                              >
                                <RadioGroupItem
                                  value="print-and-frame"
                                  id="ticket-print-and-frame"
                                  className="sr-only"
                                  data-testid="radio-service-print-and-frame"
                                />
                                <span className="font-semibold">Print and Frame</span>
                              </Label>
                            </div>
                          </RadioGroup>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="hidden"
                            data-testid="input-photo-upload"
                          />
                          {serviceType === "print-and-frame" && (
                            <div className="mt-3 space-y-3">
                              {!userPhoto ? (
                                <>
                                  <p className="text-xs text-muted-foreground">
                                    Upload an image to use Print and Frame service
                                  </p>
                                  <Button
                                    onClick={triggerPhotoUpload}
                                    className="w-full"
                                    data-testid="button-upload-photo"
                                  >
                                    <Upload className="h-4 w-4 mr-2" /> Click to Upload Your Image
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <div className="flex items-center justify-between p-3 rounded-md border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950">
                                    <div className="flex items-center gap-2">
                                      <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                                      <span className="text-sm text-green-800 dark:text-green-200">
                                        Image uploaded
                                      </span>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 text-xs"
                                      onClick={() => setUserPhoto(null)}
                                      data-testid="button-clear-image"
                                    >
                                      <X className="h-3 w-3 mr-1" /> Clear
                                    </Button>
                                  </div>
                                  <div className="flex items-start space-x-2 p-3 bg-muted/50 rounded-md">
                                    <input
                                      type="checkbox"
                                      id="ticket-copyright-agreement"
                                      checked={copyrightAgreed}
                                      onChange={(e) => setCopyrightAgreed(e.target.checked)}
                                      className="mt-0.5"
                                      data-testid="checkbox-copyright"
                                    />
                                    <Label
                                      htmlFor="ticket-copyright-agreement"
                                      className="text-xs cursor-pointer"
                                    >
                                      I confirm that I own or am authorized to reproduce this image
                                      and agree to the Terms of Service.
                                    </Label>
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </Card>
                      )}
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="frame-style" className="border rounded-lg px-4 lg:px-6">
                    <AccordionTrigger
                      className="text-base font-semibold hover:no-underline py-4"
                      data-testid="accordion-frame"
                    >
                      Frame Style
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <div className="max-h-[400px] overflow-y-auto pr-2 grid grid-cols-2 gap-2">
                        {allFrames.map((frame) => (
                          <button
                            key={frame.id}
                            type="button"
                            onClick={() => setSelectedFrame(frame)}
                            className={`p-3 rounded-md border-2 text-left hover-elevate ${selectedFrame.id === frame.id ? "border-primary" : "border-transparent"}`}
                            data-testid={`button-select-frame-${frame.sku}`}
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
                            <p className="font-medium text-sm">{frame.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Width: {frame.mouldingWidth}&quot; · Depth: {frame.usableDepth}&quot;
                            </p>
                          </button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="mat-options" className="border rounded-lg px-4 lg:px-6">
                    <AccordionTrigger
                      className="text-base font-semibold hover:no-underline py-4"
                      data-testid="accordion-mat"
                    >
                      Mat Options
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4 space-y-4">
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
                        testIdPrefix="ticket"
                      />
                      <div className="space-y-3">
                        <Label>
                          {matType === "double"
                            ? `Top Mat Color: ${selectedMat.name}`
                            : `Mat Color: ${selectedMat.name}`}
                        </Label>
                        <ColorSwatchesWithSeparator
                          standardColors={standardMats}
                          premiumColors={premiumMats}
                          selectedId={selectedMat.id}
                          onSelect={setSelectedMat}
                          testIdPrefix="mat"
                        />
                      </div>
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
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="brass-nameplate" className="border rounded-lg px-4 lg:px-6">
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

                  <AccordionItem value="glazing" className="border rounded-lg px-4 lg:px-6">
                    <AccordionTrigger
                      className="text-base font-semibold hover:no-underline py-4"
                      data-testid="accordion-glass"
                    >
                      Glazing
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <RadioGroup
                        value={selectedGlass?.id}
                        onValueChange={(value) => {
                          const g = glassTypes.find((x) => x.id === value);
                          if (g) setSelectedGlass(g);
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

              <PriceBox
                totalPrice={pricing.total}
                quantity={quantity}
                onQuantityChange={setQuantity}
                onAddToCart={handleAddToCart}
                onCopyLink={handleShare}
                priceItems={priceItems}
                disabled={!printAndFrameReady}
                testIdPrefix="ticket-"
                className={`transition-all ${pricingSidebarExpanded ? "top-6" : "top-20"}`}
              />
            </div>
          </div>
        </div>

        {isMobile && (
          <div
            className={`fixed left-0 right-0 bottom-0 bg-background/95 backdrop-blur-sm border-t border-border shadow-lg z-50 transition-all ${showMobileBar ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"}`}
          >
            <div className="px-4 py-3 space-y-2">
              {serviceType === "print-and-frame" && userPhoto && !copyrightAgreed && (
                <div className="flex items-start space-x-2 p-2 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md">
                  <input
                    type="checkbox"
                    id="mobile-sticky-copyright"
                    checked={copyrightAgreed}
                    onChange={(e) => setCopyrightAgreed(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded"
                    data-testid="checkbox-mobile-sticky-copyright"
                  />
                  <label htmlFor="mobile-sticky-copyright" className="text-xs leading-tight">
                    I confirm that I own or am authorized to reproduce this image and agree to the
                    Terms of Service.
                  </label>
                </div>
              )}
              <div className="flex items-center gap-2">
                <div className="flex flex-col gap-0.5 min-w-[60px]">
                  <span className="text-xs text-muted-foreground">Total</span>
                  <span
                    className="font-bold text-sm"
                    data-testid="text-ticket-mobile-sticky-total-price"
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
                    testId="input-ticket-quantity-sticky"
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleShare}
                  data-testid="button-ticket-mobile-copy-link"
                  className="h-11 w-11"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  size="default"
                  onClick={handleAddToCart}
                  disabled={!printAndFrameReady}
                  data-testid="button-ticket-mobile-add-to-cart"
                  className="flex-1 text-xs min-w-0 min-h-11"
                >
                  {printAndFrameReady ? "Add to Cart" : "Upload Photo"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {!embedded && (
          <Button
            size="lg"
            className={`fixed bottom-20 right-6 z-[60] lg:hidden shadow-lg rounded-full h-14 px-6 ${showMobileBar ? "visible opacity-100 translate-y-0" : "invisible opacity-0 translate-y-8"}`}
            onClick={() => setMobileView(mobileView === "preview" ? "controls" : "preview")}
            data-testid="button-toggle-mobile-view"
          >
            {mobileView === "preview" ? (
              <>
                <Settings className="w-5 h-5 mr-2" /> Customize
              </>
            ) : (
              <>
                <Eye className="w-5 h-5 mr-2" /> Preview
              </>
            )}
          </Button>
        )}
      </div>
    </TooltipProvider>
  );
}
