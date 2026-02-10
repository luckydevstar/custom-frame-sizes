"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  Copy,
  Eye,
  Settings,
  Package,
  ImageIcon,
  Heart,
  Square,
  Circle,
  CheckCircle2,
  Upload,
  X,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Slider } from "../ui/slider";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { Alert, AlertDescription } from "../ui/alert";
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
  useIntelligentPreviewSizing,
  useIsMobile,
  useMobileViewToggle,
  LIGHT_MAT_IDS,
  SIGNATURE_MAT_REVEAL,
  SIGNATURE_MAT_BORDER_MIN,
  SIGNATURE_MAT_BORDER_MAX,
  SIGNATURE_MAT_BORDER_DEFAULT,
  getSignatureOpeningSizeInches,
  type SignatureOpeningSize,
  type SignatureOpeningShape,
} from "@framecraft/core";
import { ALL_MATS, getMatById, type Mat } from "@framecraft/config";
import { useToast } from "../../hooks/use-toast";
import { HangingHardwareSection } from "./shared/HangingHardwareSection";
import { BottomWeightedMatting, BOTTOM_WEIGHTED_EXTRA } from "./shared/BottomWeightedMatting";
import { BrassNameplateSection } from "../brass-nameplate/BrassNameplateSection";
import { SignatureFramePreview } from "./SignatureFramePreview";

const pictureFrames = getFramesByCategory("picture");
const glassTypes = getGlassTypes().filter((g) => g.id === "standard" || g.id === "non-glare");
const MOBILE_EXCLUDED_LIGHT_MATS = ["mat-5", "mat-7"];

const defaultNameplateConfig: BrassNameplateConfig = {
  enabled: false,
  line1: "",
  line2: "",
  line3: "",
  font: "georgia",
  color: "brass-black",
  includeFlag: false,
};

interface SignatureFrameDesignerProps {
  defaultFrameId?: string;
  embedded?: boolean;
}

export function SignatureFrameDesigner({
  defaultFrameId,
  embedded = false,
}: SignatureFrameDesignerProps) {
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
      const f =
        getFrameStyleById(defaultFrameId) ?? pictureFrames.find((x) => x.sku === defaultFrameId);
      return f ?? pictureFrames[0]!;
    }
    const frameParam = urlParams.get("frame");
    const defaultFrame = pictureFrames.find((f) => f.sku === "6711") ?? pictureFrames[0];
    if (frameParam) {
      const f = getFrameStyleById(frameParam) ?? pictureFrames.find((x) => x.sku === frameParam);
      return f ?? defaultFrame ?? pictureFrames[0]!;
    }
    return defaultFrame ?? pictureFrames[0]!;
  }, [defaultFrameId, urlParams]);

  const [matOpeningSize, setMatOpeningSize] = useState<SignatureOpeningSize>(
    () => (urlParams.get("openingSize") as SignatureOpeningSize) || "8x8"
  );
  const [openingShape, setOpeningShape] = useState<SignatureOpeningShape>(
    () => (urlParams.get("openingShape") as SignatureOpeningShape) || "square"
  );
  const [selectedFrame, setSelectedFrame] = useState<FrameStyle>(initialFrame);
  const lightColoredMats = useMemo(
    () =>
      ALL_MATS.filter((mat) => {
        if (!LIGHT_MAT_IDS.includes(mat.id)) return false;
        if (isMobile && MOBILE_EXCLUDED_LIGHT_MATS.includes(mat.id)) return false;
        return true;
      }),
    [isMobile]
  );
  const [topMat, setTopMat] = useState<Mat>(() => {
    const urlTop = urlParams.get("topMat");
    if (urlTop) {
      const m = getMatById(urlTop);
      if (m && LIGHT_MAT_IDS.includes(m.id)) return m;
    }
    return getMatById("mat-1") ?? ALL_MATS[0]!;
  });
  const [accentMat, setAccentMat] = useState<Mat>(
    () => getMatById(urlParams.get("accentMat") ?? "mat-2") ?? ALL_MATS[1]!
  );
  const [matBorder, setMatBorder] = useState<number>(() => {
    const urlBorder = urlParams.get("matBorder");
    if (urlBorder) {
      const n = parseFloat(urlBorder);
      if (!isNaN(n))
        return Math.max(SIGNATURE_MAT_BORDER_MIN, Math.min(SIGNATURE_MAT_BORDER_MAX, n));
    }
    return SIGNATURE_MAT_BORDER_DEFAULT;
  });
  const [bottomWeighted, setBottomWeighted] = useState(
    () => urlParams.get("bottomWeighted") === "true"
  );
  const [selectedGlass, setSelectedGlass] = useState(
    () => glassTypes.find((g) => g.id === urlParams.get("glass")) ?? glassTypes[0]!
  );
  const [hardware, setHardware] = useState<"standard" | "security">(
    () => (urlParams.get("hardware") as "standard" | "security") || "standard"
  );
  const [brassNameplateConfig, setBrassNameplateConfig] =
    useState<BrassNameplateConfig>(defaultNameplateConfig);
  const [quantity, setQuantity] = useState(1);
  const [serviceType, setServiceType] = useState<"frame-only" | "print-and-frame">(
    () => (urlParams.get("serviceType") as "frame-only" | "print-and-frame") || "frame-only"
  );
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [copyrightAgreed, setCopyrightAgreed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const calculateFrameDimensions = useCallback(() => {
    const openingSizeNum = getSignatureOpeningSizeInches(matOpeningSize);
    const bottomWeightedExtra = bottomWeighted ? BOTTOM_WEIGHTED_EXTRA : 0;
    const width = openingSizeNum + matBorder * 2;
    const height = openingSizeNum + matBorder * 2 + bottomWeightedExtra;
    const maxSize = 32;
    if (width > maxSize || height > maxSize) {
      return {
        width: maxSize,
        height: Math.min(height, maxSize),
        isOversize: true,
        bottomWeightedExtra,
      };
    }
    return { width, height, isOversize: false, bottomWeightedExtra };
  }, [matOpeningSize, matBorder, bottomWeighted]);

  const frameDimensions = calculateFrameDimensions();
  const frameWidth = frameDimensions.width + 2 * (selectedFrame.mouldingWidth ?? 0);
  const frameHeight = frameDimensions.height + 2 * (selectedFrame.mouldingWidth ?? 0);
  const openingSizeNum = getSignatureOpeningSizeInches(matOpeningSize);
  const plaqueExtension = brassNameplateConfig.enabled
    ? BRASS_NAMEPLATE_SPECS.NAMEPLATE_FRAME_EXTENSION
    : 0;

  const { containerRef, previewContainerHeight, containerWidth } = useIntelligentPreviewSizing({
    frameWidth,
    frameHeight,
    plaqueEnabled: brassNameplateConfig.enabled,
    plaqueExtension,
    isMobile,
  });

  const pricing = useMemo(() => {
    const config: FrameConfiguration = {
      serviceType: "frame-only",
      frameStyleId: selectedFrame.id,
      matColorId: topMat.id,
      matInnerColorId: accentMat.id,
      glassTypeId: selectedGlass.id,
      artworkWidth: openingSizeNum,
      artworkHeight: openingSizeNum,
      matType: "double",
      matBorderWidth: matBorder,
      matRevealWidth: SIGNATURE_MAT_REVEAL,
      bottomWeighted,
      brassNameplateConfig: brassNameplateConfig.enabled ? brassNameplateConfig : undefined,
    };
    try {
      const breakdown = calculatePricing(config);
      const hardwareSurcharge = hardware === "security" ? 8.95 : 0;
      const nameplatePrice = brassNameplateConfig.enabled ? BRASS_NAMEPLATE_SPECS.PRICE : 0;
      return {
        ...breakdown,
        total: breakdown.total + hardwareSurcharge + nameplatePrice,
        hardwareSurcharge,
        nameplatePrice,
      };
    } catch {
      return null;
    }
  }, [
    selectedFrame,
    topMat,
    accentMat,
    selectedGlass,
    matBorder,
    bottomWeighted,
    hardware,
    brassNameplateConfig,
    openingSizeNum,
  ]);

  const priceItems: PriceLineItem[] = useMemo(() => {
    if (!pricing) return [];
    const items: PriceLineItem[] = [];
    items.push({
      label: selectedFrame.name,
      amount: pricing.framePrice,
      testId: "text-price-frame",
    });
    items.push({ label: "Mat Board (double)", amount: pricing.matPrice, testId: "text-price-mat" });
    items.push({
      label: selectedGlass.name,
      amount: pricing.glassPrice,
      isIncluded: pricing.glassPrice === 0,
      testId: "text-price-glass",
    });
    if (pricing.oversizeFee > 0)
      items.push({
        label: "Oversize Fee",
        amount: pricing.oversizeFee,
        testId: "text-price-oversize",
      });
    if (pricing.hardwareSurcharge > 0)
      items.push({
        label: "Security Hardware",
        amount: pricing.hardwareSurcharge,
        testId: "text-price-hardware",
      });
    if (pricing.nameplatePrice > 0)
      items.push({
        label: "Brass Nameplate",
        amount: pricing.nameplatePrice,
        testId: "text-price-nameplate",
      });
    return items;
  }, [pricing, selectedFrame, selectedGlass]);

  const finalTotalPrice = pricing?.total ?? 0;

  const canAddToCart = useMemo(() => {
    if (serviceType === "print-and-frame") return !!selectedImage && copyrightAgreed;
    return true;
  }, [serviceType, selectedImage, copyrightAgreed]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("openingSize", matOpeningSize);
    params.set("openingShape", openingShape);
    params.set("frame", selectedFrame.id);
    params.set("topMat", topMat.id);
    params.set("accentMat", accentMat.id);
    params.set("matBorder", matBorder.toString());
    params.set("glass", selectedGlass.id);
    params.set("hardware", hardware);
    params.set("quantity", quantity.toString());
    if (bottomWeighted) params.set("bottomWeighted", "true");
    if (serviceType !== "frame-only") params.set("serviceType", serviceType);
    if (brassNameplateConfig.enabled) {
      params.set("nameplateEnabled", "true");
      if (brassNameplateConfig.line1) params.set("nameplateLine1", brassNameplateConfig.line1);
      if (brassNameplateConfig.line2) params.set("nameplateLine2", brassNameplateConfig.line2);
      if (brassNameplateConfig.line3) params.set("nameplateLine3", brassNameplateConfig.line3);
      params.set("nameplateFont", brassNameplateConfig.font);
      params.set("nameplateColor", brassNameplateConfig.color);
    }
    const newUrl = `${typeof window !== "undefined" ? window.location.pathname : ""}?${params.toString()}`;
    if (typeof window !== "undefined") window.history.replaceState({}, "", newUrl);
  }, [
    matOpeningSize,
    openingShape,
    selectedFrame,
    topMat,
    accentMat,
    matBorder,
    bottomWeighted,
    selectedGlass,
    hardware,
    quantity,
    brassNameplateConfig,
    serviceType,
  ]);

  const handleCopyLink = useCallback(() => {
    if (typeof window !== "undefined") navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied!",
      description: "Share this custom signature frame design with others.",
    });
  }, [toast]);

  const handlePhotoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setSelectedImage((ev.target?.result as string) ?? null);
    reader.readAsDataURL(file);
    e.target.value = "";
  }, []);

  const handleAddToCart = useCallback(async () => {
    if (!canAddToCart) {
      if (serviceType === "print-and-frame") {
        if (!selectedImage)
          toast({
            title: "Image Required",
            description: "Please upload an image for Print & Frame.",
            variant: "destructive",
          });
        else if (!copyrightAgreed)
          toast({
            title: "Copyright Required",
            description: "Please confirm you have rights to print this image.",
            variant: "destructive",
          });
      }
      return;
    }
    const config: FrameConfiguration = {
      serviceType: serviceType === "print-and-frame" ? "print-and-frame" : "frame-only",
      frameStyleId: selectedFrame.id,
      matColorId: topMat.id,
      matInnerColorId: accentMat.id,
      glassTypeId: selectedGlass.id,
      artworkWidth: openingSizeNum,
      artworkHeight: openingSizeNum,
      matType: "double",
      matBorderWidth: matBorder,
      matRevealWidth: SIGNATURE_MAT_REVEAL,
      bottomWeighted,
      brassNameplateConfig: brassNameplateConfig.enabled ? brassNameplateConfig : undefined,
      imageUrl: serviceType === "print-and-frame" && selectedImage ? selectedImage : undefined,
      copyrightAgreed: serviceType === "print-and-frame" ? copyrightAgreed : undefined,
    };
    try {
      await addToCart(config, finalTotalPrice * quantity, quantity);
      toast({
        title: "Added to Cart!",
        description: `${quantity} × Custom Signature Frame${quantity > 1 ? "s" : ""}`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Could not add to cart",
        variant: "destructive",
      });
    }
  }, [
    canAddToCart,
    serviceType,
    selectedImage,
    copyrightAgreed,
    selectedFrame,
    topMat,
    accentMat,
    selectedGlass,
    matBorder,
    bottomWeighted,
    brassNameplateConfig,
    openingSizeNum,
    finalTotalPrice,
    quantity,
    toast,
  ]);

  return (
    <div
      className="w-full min-h-screen bg-gradient-to-b from-background to-muted/30 pb-24 lg:pb-0"
      data-testid="signature-frame-designer"
    >
      {isMobile && embedded && (
        <div className="lg:hidden border-b bg-card/50 sticky top-0 z-40">
          <div className="px-4 py-3">
            <h1 className="text-lg font-bold">Signature Frame Designer</h1>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6 lg:py-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-6">
          <div
            ref={previewCardRef}
            className={`${isMobile && mobileView === "controls" ? "hidden lg:block" : ""} lg:sticky lg:top-[132px] lg:self-start space-y-4`}
          >
            <SignatureFramePreview
              openingSize={matOpeningSize}
              openingShape={openingShape}
              frame={selectedFrame}
              topMat={topMat}
              accentMat={accentMat}
              matBorder={matBorder}
              matReveal={SIGNATURE_MAT_REVEAL}
              brassNameplateConfig={brassNameplateConfig}
              frameDimensions={frameDimensions}
              containerRef={containerRef}
              containerWidth={containerWidth}
              previewContainerHeight={previewContainerHeight}
              uploadedImage={selectedImage}
            />
          </div>

          <div
            className={`${isMobile && mobileView === "preview" ? "hidden" : ""} space-y-5 p-4 lg:p-0`}
          >
            <h2 ref={controlsHeadingRef} className="text-2xl font-bold mb-2 lg:hidden">
              Customize Your Frame
            </h2>
            <Card className="rounded-xl border bg-gradient-to-br from-card to-muted/20 p-5 space-y-4 shadow-sm">
              <h3 className="font-semibold text-lg">Customize Your Frame</h3>
              <p className="text-sm text-muted-foreground">
                Design a unique keepsake for your special day
              </p>

              <RadioGroup
                value={serviceType}
                onValueChange={(v: string) => setServiceType(v as "frame-only" | "print-and-frame")}
                className="inline-flex w-full rounded-xl border p-1.5 bg-muted/40"
                data-testid="service-type-selector"
              >
                <div className="flex w-full gap-1">
                  <Label
                    htmlFor="sig-service-frame-only"
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium cursor-pointer ${serviceType === "frame-only" ? "bg-background border border-border shadow-md" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <RadioGroupItem
                      value="frame-only"
                      id="sig-service-frame-only"
                      className="sr-only"
                      data-testid="radio-service-frame-only"
                    />
                    <Package className="h-4 w-4" /> Frame Only
                  </Label>
                  <Label
                    htmlFor="sig-service-print-and-frame"
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium cursor-pointer ${serviceType === "print-and-frame" ? "bg-background border border-border shadow-md" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <RadioGroupItem
                      value="print-and-frame"
                      id="sig-service-print-and-frame"
                      className="sr-only"
                      data-testid="radio-service-print-and-frame"
                    />
                    <ImageIcon className="h-4 w-4" /> Print & Frame
                  </Label>
                </div>
              </RadioGroup>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                <Heart className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm">
                  <span className="font-medium text-foreground">
                    Includes colored signature pens
                  </span>
                  <span className="text-muted-foreground"> at no extra cost</span>
                </span>
              </div>

              {serviceType === "print-and-frame" && (
                <div className="space-y-3">
                  <Separator />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    data-testid="input-photo-upload"
                  />
                  {!selectedImage ? (
                    <>
                      <p className="text-xs text-muted-foreground">
                        Upload an image to use Print and Frame service
                      </p>
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full"
                        data-testid="button-upload-print"
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
                          onClick={() => setSelectedImage(null)}
                          data-testid="button-clear-image"
                        >
                          <X className="h-3 w-3 mr-1" /> Clear
                        </Button>
                      </div>
                      <div className="flex items-start space-x-2 p-3 bg-muted/50 rounded-md">
                        <Checkbox
                          id="sig-copyright"
                          checked={copyrightAgreed}
                          onCheckedChange={(c) => setCopyrightAgreed(c === true)}
                          className="mt-0.5"
                          data-testid="checkbox-copyright"
                        />
                        <Label htmlFor="sig-copyright" className="text-xs cursor-pointer">
                          I confirm that I own or am authorized to reproduce this image and agree to
                          the Terms of Service.
                        </Label>
                      </div>
                    </>
                  )}
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                Great for weddings, baby showers, graduation parties, and more.
              </p>
            </Card>

            <Accordion
              type="multiple"
              defaultValue={[
                "opening",
                "frame",
                "mat-border",
                "mat-colors",
                "nameplate",
                "glass",
                "hardware",
              ]}
              className="space-y-4"
            >
              <AccordionItem value="opening" className="border rounded-lg px-4 lg:px-6">
                <AccordionTrigger
                  className="text-base font-semibold hover:no-underline py-4"
                  data-testid="accordion-opening"
                >
                  Mat Opening
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <Label className="text-sm font-medium">Opening Size</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setMatOpeningSize("5x5")}
                      className={`p-4 rounded-xl border-2 text-left ${matOpeningSize === "5x5" ? "border-primary bg-primary/5" : "border-border"}`}
                      data-testid="button-opening-5x5"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${matOpeningSize === "5x5" ? "bg-primary/10" : "bg-muted"}`}
                        >
                          <Square className="h-4 w-4" />
                        </div>
                        <p className="font-semibold text-sm">5&quot; × 5&quot;</p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMatOpeningSize("8x8")}
                      className={`p-4 rounded-xl border-2 text-left ${matOpeningSize === "8x8" ? "border-primary bg-primary/5" : "border-border"}`}
                      data-testid="button-opening-8x8"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${matOpeningSize === "8x8" ? "bg-primary/10" : "bg-muted"}`}
                        >
                          <Square className="h-5 w-5" />
                        </div>
                        <p className="font-semibold text-sm">8&quot; × 8&quot;</p>
                      </div>
                    </button>
                  </div>
                  <Separator />
                  <Label className="text-sm font-medium">Opening Shape</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setOpeningShape("square")}
                      className={`p-3 rounded-xl border-2 text-center ${openingShape === "square" ? "border-primary bg-primary/5" : "border-border"}`}
                      data-testid="button-shape-square"
                    >
                      <div
                        className={`mx-auto w-8 h-8 rounded flex items-center justify-center mb-2 ${openingShape === "square" ? "bg-primary/10" : "bg-muted"}`}
                      >
                        <Square className="h-4 w-4" />
                      </div>
                      <p className="font-medium text-sm">Square</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setOpeningShape("circle")}
                      className={`p-3 rounded-xl border-2 text-center ${openingShape === "circle" ? "border-primary bg-primary/5" : "border-border"}`}
                      data-testid="button-shape-circle"
                    >
                      <div
                        className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center mb-2 ${openingShape === "circle" ? "bg-primary/10" : "bg-muted"}`}
                      >
                        <Circle className="h-4 w-4" />
                      </div>
                      <p className="font-medium text-sm">Circle</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setOpeningShape("heart")}
                      className={`p-3 rounded-xl border-2 text-center ${openingShape === "heart" ? "border-primary bg-primary/5" : "border-border"}`}
                      data-testid="button-shape-heart"
                    >
                      <div
                        className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center mb-2 ${openingShape === "heart" ? "bg-primary/10" : "bg-muted"}`}
                      >
                        <Heart className="h-4 w-4" />
                      </div>
                      <p className="font-medium text-sm">Heart</p>
                    </button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="frame" className="border rounded-lg px-4 lg:px-6">
                <AccordionTrigger
                  className="text-base font-semibold hover:no-underline py-4"
                  data-testid="accordion-frame"
                >
                  Frame Style
                </AccordionTrigger>
                <AccordionContent>
                  <div className="max-h-[400px] overflow-y-auto pr-2 grid grid-cols-2 gap-2 pt-4">
                    {pictureFrames.map((frame) => (
                      <button
                        key={frame.id}
                        type="button"
                        onClick={() => setSelectedFrame(frame)}
                        className={`p-3 rounded-md border-2 text-left ${selectedFrame.id === frame.id ? "border-primary" : "border-transparent"}`}
                        data-testid={`button-frame-${frame.id}`}
                      >
                        {frame.thumbnail ? (
                          <div className="h-12 w-full rounded mb-2 overflow-hidden">
                            <img
                              src={frame.thumbnail}
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
                        <p className="font-medium text-sm mb-1">{frame.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Width: {frame.mouldingWidth}&quot; · Depth: {frame.usableDepth}&quot;
                        </p>
                      </button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="mat-border" className="border rounded-lg px-4 lg:px-6">
                <AccordionTrigger
                  className="text-base font-semibold hover:no-underline py-4"
                  data-testid="accordion-mat-border"
                >
                  Mat Border Width
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <Label>Border Width: {matBorder}&quot;</Label>
                    <span className="text-sm text-muted-foreground">
                      Overall: {frameDimensions.width}&quot; × {frameDimensions.height}&quot;
                    </span>
                  </div>
                  <Slider
                    value={[matBorder]}
                    onValueChange={(v) => setMatBorder(v[0]!)}
                    min={SIGNATURE_MAT_BORDER_MIN}
                    max={SIGNATURE_MAT_BORDER_MAX}
                    step={1}
                    data-testid="slider-mat-border"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>4&quot; (Compact)</span>
                    <span>12&quot; (Spacious)</span>
                  </div>
                  {frameDimensions.isOversize && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertDescription className="text-xs">
                        Maximum frame size is 32&quot; × 32&quot;. Border has been limited.
                      </AlertDescription>
                    </Alert>
                  )}
                  <BottomWeightedMatting
                    checked={bottomWeighted}
                    onCheckedChange={setBottomWeighted}
                    testIdPrefix="signature"
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="mat-colors" className="border rounded-lg px-4 lg:px-6">
                <AccordionTrigger
                  className="text-base font-semibold hover:no-underline py-4"
                  data-testid="accordion-mat-colors"
                >
                  Mat Colors
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label className="text-base font-semibold">Top Mat: {topMat.name}</Label>
                    <p className="text-xs text-muted-foreground">
                      Light-colored mats for better signature visibility.
                    </p>
                    <div className="grid grid-cols-5 md:grid-cols-7 gap-1">
                      {lightColoredMats.map((mat) => (
                        <button
                          key={mat.id}
                          type="button"
                          onClick={() => setTopMat(mat)}
                          className={`aspect-square rounded-md border-2 overflow-hidden ${topMat.id === mat.id ? "border-primary ring-2 ring-primary/20" : "border-border"}`}
                          style={{ background: mat.hexColor ?? "#fff" }}
                          title={mat.name}
                          data-testid={`swatch-top-${mat.id}`}
                        />
                      ))}
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label className="text-base font-semibold">Accent Mat: {accentMat.name}</Label>
                    <div className="grid grid-cols-5 md:grid-cols-7 gap-1">
                      {ALL_MATS.slice(0, 28).map((mat) => (
                        <button
                          key={mat.id}
                          type="button"
                          onClick={() => setAccentMat(mat)}
                          className={`aspect-square rounded-md border-2 overflow-hidden ${accentMat.id === mat.id ? "border-primary ring-2 ring-primary/20" : "border-border"}`}
                          style={{ background: mat.hexColor ?? "#fff" }}
                          title={mat.name}
                          data-testid={`swatch-accent-${mat.id}`}
                        />
                      ))}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="nameplate" className="border rounded-lg px-4 lg:px-6">
                <AccordionTrigger
                  className="text-base font-semibold hover:no-underline py-4"
                  data-testid="accordion-nameplate"
                >
                  Brass Nameplate
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <BrassNameplateSection
                    config={brassNameplateConfig}
                    onChange={setBrassNameplateConfig}
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="glass" className="border rounded-lg px-4 lg:px-6">
                <AccordionTrigger
                  className="text-base font-semibold hover:no-underline py-4"
                  data-testid="accordion-glass"
                >
                  Glazing & Backing
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <RadioGroup
                    value={selectedGlass.id}
                    onValueChange={(id) => {
                      const g = glassTypes.find((x) => x.id === id);
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

              <AccordionItem value="hardware" className="border rounded-lg px-4 lg:px-6">
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
                    frameWidth={frameWidth}
                    frameHeight={frameHeight}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <PriceBox
              totalPrice={finalTotalPrice}
              quantity={quantity}
              onQuantityChange={setQuantity}
              onAddToCart={handleAddToCart}
              onCopyLink={handleCopyLink}
              disabled={!canAddToCart}
              priceItems={priceItems}
              testIdPrefix="signature-"
            />
          </div>
        </div>
      </div>

      {isMobile && showMobileBar && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg p-3 z-50">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <p className="text-lg font-bold" data-testid="mobile-total-price">
                ${(finalTotalPrice * quantity).toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">
                {frameDimensions.width}&quot; × {frameDimensions.height}&quot;
              </p>
            </div>
            <div className="flex items-center gap-2">
              <QuantitySelector
                value={quantity}
                onChange={setQuantity}
                className="w-14 h-7 text-xs text-center p-0"
                testId="input-quantity-sticky"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyLink}
                data-testid="button-mobile-copy-link"
                className="h-9 w-9"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleAddToCart}
                disabled={!canAddToCart}
                data-testid="button-mobile-add-to-cart"
                className="flex-1 min-w-0"
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      )}

      {!embedded && (
        <Button
          size="lg"
          className={`fixed bottom-20 right-6 z-[60] lg:hidden shadow-lg rounded-full h-14 px-6 ${showMobileBar ? "translate-y-0 opacity-100" : "translate-y-32 opacity-0 pointer-events-none"}`}
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
  );
}
