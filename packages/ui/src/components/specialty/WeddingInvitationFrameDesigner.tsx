"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Heart, LayoutTemplate, ImageIcon, Package, Upload, X, CheckCircle2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Checkbox } from "../ui/checkbox";
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
  parseFraction,
  useIsMobile,
  useMobileViewToggle,
  INVITATION_SIZES,
  WEDDING_LAYOUTS,
  DEFAULT_MAT_BORDER,
  PLAQUE_FRAME_EXTENSION,
  getInvitationSizeById,
  getDefaultInvitationSize,
  getSecondaryOpeningSizeById,
  getSecondaryOpeningSizesForLayout,
  getDefaultSecondarySize,
  calculateWeddingFrameConfig,
  calculateWeddingPreviewDimensions,
  validateCustomDimensions,
  createCustomInvitationSize,
  createCustomSecondarySize,
  type WeddingLayoutType,
  type InvitationSize,
  type SecondaryOpeningSize,
} from "@framecraft/core";
import { ALL_MATS, getMatById, getMatsInDisplayOrder, type Mat } from "@framecraft/config";
import { useToast } from "../../hooks/use-toast";
import { HangingHardwareSection } from "./shared/HangingHardwareSection";
import { BottomWeightedMatting, BOTTOM_WEIGHTED_EXTRA } from "./shared/BottomWeightedMatting";
import { BrassNameplateSection } from "../brass-nameplate/BrassNameplateSection";
import { ColorSwatchesWithSeparator } from "../ui/ColorSwatches";
import { WeddingInvitationPreview } from "./WeddingInvitationPreview";

const pictureFrames = getFramesByCategory("picture");
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

interface WeddingInvitationFrameDesignerProps {
  defaultFrameId?: string;
  embedded?: boolean;
}

export function WeddingInvitationFrameDesigner({
  defaultFrameId,
  embedded = false,
}: WeddingInvitationFrameDesignerProps) {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { mobileView, previewCardRef, controlsHeadingRef } = useMobileViewToggle({ isMobile });

  const urlParams = useMemo(() => {
    if (typeof window === "undefined") return new URLSearchParams();
    return new URLSearchParams(window.location.search);
  }, []);

  const initialFrame = useMemo((): FrameStyle => {
    if (defaultFrameId) {
      const f =
        getFrameStyleById(defaultFrameId) ?? pictureFrames.find((x) => x.sku === defaultFrameId);
      return f ?? pictureFrames.find((f) => f.sku === "8989") ?? pictureFrames[0]!;
    }
    const frameParam = urlParams.get("frame");
    const defaultFrame = pictureFrames.find((f) => f.sku === "8989") ?? pictureFrames[0];
    if (frameParam) {
      const f = getFrameStyleById(frameParam) ?? pictureFrames.find((x) => x.sku === frameParam);
      return f ?? defaultFrame ?? pictureFrames[0]!;
    }
    return defaultFrame ?? pictureFrames[0]!;
  }, [defaultFrameId, urlParams]);

  const [selectedLayout, setSelectedLayout] = useState<WeddingLayoutType>(() => {
    const urlLayout = urlParams.get("layout");
    const valid: WeddingLayoutType[] = ["invite-only", "invite-photo", "invite-rsvp"];
    if (urlLayout && valid.includes(urlLayout as WeddingLayoutType))
      return urlLayout as WeddingLayoutType;
    return "invite-photo";
  });
  const [selectedInvitationSizeId, setSelectedInvitationSizeId] = useState(() => {
    const urlSize = urlParams.get("inviteSize");
    if (urlSize && getInvitationSizeById(urlSize)) return urlSize;
    return "size-5x7";
  });
  const [useCustomInviteSize, setUseCustomInviteSize] = useState(
    () => urlParams.get("customInvite") === "true"
  );
  const [customInviteWidth, setCustomInviteWidth] = useState(
    () => urlParams.get("customInviteWidth") || "5"
  );
  const [customInviteHeight, setCustomInviteHeight] = useState(
    () => urlParams.get("customInviteHeight") || "7"
  );
  const [selectedSecondarySizeId, setSelectedSecondarySizeId] = useState(() => {
    const urlSecondary = urlParams.get("secondarySize");
    if (urlSecondary && getSecondaryOpeningSizeById(urlSecondary)) return urlSecondary;
    return "secondary-5x7";
  });
  const [useCustomSecondarySize, setUseCustomSecondarySize] = useState(
    () => urlParams.get("customSecondary") === "true"
  );
  const [customSecondaryWidth, setCustomSecondaryWidth] = useState(
    () => urlParams.get("customSecondaryWidth") || "5"
  );
  const [customSecondaryHeight, setCustomSecondaryHeight] = useState(
    () => urlParams.get("customSecondaryHeight") || "7"
  );
  const [customInviteError, setCustomInviteError] = useState<string | null>(null);
  const [customSecondaryError, setCustomSecondaryError] = useState<string | null>(null);

  const [selectedFrame, setSelectedFrame] = useState<FrameStyle>(initialFrame);
  const [matType, setMatType] = useState<"single" | "double">(() =>
    urlParams.get("matType") === "single" ? "single" : "double"
  );
  const [selectedTopMat, setSelectedTopMat] = useState<Mat>(() => {
    const urlTop = urlParams.get("topMat");
    if (urlTop) {
      const m = getMatById(urlTop);
      if (m) return m;
    }
    return getMatById("mat-1") ?? ALL_MATS[0]!;
  });
  const [selectedBottomMat, setSelectedBottomMat] = useState<Mat>(() => {
    const urlBottom = urlParams.get("bottomMat");
    if (urlBottom) {
      const m = getMatById(urlBottom);
      if (m) return m;
    }
    return getMatById("mat-17") ?? ALL_MATS[1]!;
  });
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
  const [serviceType, setServiceType] = useState<"frame-only" | "print-and-frame">(
    () => (urlParams.get("serviceType") as "frame-only" | "print-and-frame") || "frame-only"
  );
  const [photoImage, setPhotoImage] = useState<string | null>(null);
  const [copyrightAgreed, setCopyrightAgreed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [framePhotos, setFramePhotos] = useState<{
    topUrl?: string;
    bottomUrl?: string;
    leftUrl?: string;
    rightUrl?: string;
  }>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 400, height: 450 });

  const standardMats = useMemo(
    () => getMatsInDisplayOrder(isMobile ? "mobile" : "desktop", true, false),
    [isMobile]
  );
  const premiumMats = useMemo(
    () => getMatsInDisplayOrder(isMobile ? "mobile" : "desktop", false, true),
    [isMobile]
  );

  const invitationSize: InvitationSize = useMemo(() => {
    if (useCustomInviteSize) {
      const w = parseFraction(customInviteWidth) || 5;
      const h = parseFraction(customInviteHeight) || 7;
      return createCustomInvitationSize(w, h);
    }
    return getInvitationSizeById(selectedInvitationSizeId) ?? getDefaultInvitationSize();
  }, [useCustomInviteSize, customInviteWidth, customInviteHeight, selectedInvitationSizeId]);

  const secondarySize: SecondaryOpeningSize | undefined = useMemo(() => {
    if (selectedLayout === "invite-only") return undefined;
    if (useCustomSecondarySize) {
      const w = parseFraction(customSecondaryWidth) || 5;
      const h = parseFraction(customSecondaryHeight) || 7;
      const type = selectedLayout === "invite-photo" ? "photo" : "rsvp";
      return createCustomSecondarySize(w, h, type);
    }
    return (
      getSecondaryOpeningSizeById(selectedSecondarySizeId) ??
      getDefaultSecondarySize(selectedLayout)
    );
  }, [
    selectedLayout,
    useCustomSecondarySize,
    customSecondaryWidth,
    customSecondaryHeight,
    selectedSecondarySizeId,
  ]);

  const frameConfig = useMemo(
    () =>
      calculateWeddingFrameConfig(
        selectedLayout,
        invitationSize,
        secondarySize,
        DEFAULT_MAT_BORDER,
        selectedFrame.mouldingWidth ?? 1
      ),
    [selectedLayout, invitationSize, secondarySize, selectedFrame.mouldingWidth]
  );

  const bottomWeightedExtra = bottomWeighted ? BOTTOM_WEIGHTED_EXTRA : 0;
  const plaqueExtensionHeight = brassNameplateConfig.enabled ? PLAQUE_FRAME_EXTENSION : 0;
  const adjustedFrameHeight = frameConfig.frameHeight + bottomWeightedExtra + plaqueExtensionHeight;
  const adjustedFrameConfig = useMemo(
    () => ({ ...frameConfig, frameHeight: adjustedFrameHeight }),
    [frameConfig, adjustedFrameHeight]
  );

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height || 450 });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const previewDimensions = useMemo(
    () =>
      calculateWeddingPreviewDimensions(
        adjustedFrameConfig,
        containerSize.width,
        containerSize.height,
        selectedFrame.mouldingWidth ?? 1,
        20
      ),
    [adjustedFrameConfig, containerSize, selectedFrame.mouldingWidth]
  );

  const previewContainerHeight = useMemo(() => {
    const aspect = adjustedFrameConfig.frameWidth / adjustedFrameConfig.frameHeight;
    const base = isMobile ? 350 : 450;
    if (aspect > 1.5) return base * 0.7;
    if (aspect < 0.7) return base * 1.2;
    return base;
  }, [adjustedFrameConfig, isMobile]);

  useEffect(() => {
    setFramePhotos({});
    if (!selectedFrame?.sku) return;
    let cancelled = false;
    fetch(`/api/frames/${selectedFrame.sku}/photos`)
      .then((r) => (r.ok ? r.json() : null))
      .then((photoSet) => {
        if (cancelled || !photoSet) return;
        setFramePhotos({
          topUrl: photoSet.topUrl,
          bottomUrl: photoSet.bottomUrl,
          leftUrl: photoSet.leftUrl,
          rightUrl: photoSet.rightUrl,
        });
      })
      .catch(() => setFramePhotos({}));
    return () => {
      cancelled = true;
    };
  }, [selectedFrame?.sku]);

  useEffect(() => {
    if (useCustomInviteSize) {
      const w = parseFraction(customInviteWidth) || 0;
      const h = parseFraction(customInviteHeight) || 0;
      const v = validateCustomDimensions(w, h);
      setCustomInviteError(v.valid ? null : (v.error ?? null));
    } else setCustomInviteError(null);
  }, [useCustomInviteSize, customInviteWidth, customInviteHeight]);

  useEffect(() => {
    if (useCustomSecondarySize && selectedLayout !== "invite-only") {
      const w = parseFraction(customSecondaryWidth) || 0;
      const h = parseFraction(customSecondaryHeight) || 0;
      const v = validateCustomDimensions(w, h);
      setCustomSecondaryError(v.valid ? null : (v.error ?? null));
    } else setCustomSecondaryError(null);
  }, [useCustomSecondarySize, customSecondaryWidth, customSecondaryHeight, selectedLayout]);

  useEffect(() => {
    if (selectedLayout !== "invite-photo") {
      setServiceType("frame-only");
      setPhotoImage(null);
      setCopyrightAgreed(false);
    }
  }, [selectedLayout]);

  const pricing = useMemo(() => {
    const config: FrameConfiguration = {
      serviceType: "frame-only",
      artworkWidth: frameConfig.frameWidth,
      artworkHeight: adjustedFrameHeight,
      frameStyleId: selectedFrame.id,
      matType,
      matBorderWidth: 0,
      matRevealWidth: 0.25,
      matColorId: selectedTopMat.id,
      matInnerColorId: matType === "double" ? selectedBottomMat.id : undefined,
      glassTypeId: selectedGlass.id,
      bottomWeighted: false,
    };
    try {
      const result = calculatePricing(config);
      const nameplatePrice = brassNameplateConfig.enabled ? (BRASS_NAMEPLATE_SPECS.PRICE ?? 35) : 0;
      const hardwarePrice = hardware === "security" ? 8.95 : 0;
      const items: PriceLineItem[] = [
        {
          label: `${frameConfig.frameWidth.toFixed(1)}×${adjustedFrameHeight.toFixed(1)}" Frame`,
          amount: result.framePrice,
        },
      ];
      if (result.matPrice > 0)
        items.push({
          label: matType === "double" ? "Double Mat" : "Single Mat",
          amount: result.matPrice,
        });
      if (nameplatePrice > 0) items.push({ label: "Brass Nameplate", amount: nameplatePrice });
      if (hardwarePrice > 0) items.push({ label: "Security Hardware", amount: hardwarePrice });
      const total = result.framePrice + result.matPrice + nameplatePrice + hardwarePrice;
      return { items, total, subtotal: total };
    } catch {
      return null;
    }
  }, [
    frameConfig,
    adjustedFrameHeight,
    selectedFrame.id,
    matType,
    selectedTopMat.id,
    selectedBottomMat.id,
    selectedGlass.id,
    brassNameplateConfig.enabled,
    hardware,
  ]);

  const finalTotalPrice = pricing?.total ?? 0;
  const canAddToCart = useMemo(() => {
    if (serviceType === "print-and-frame") return !!photoImage && copyrightAgreed;
    return true;
  }, [serviceType, photoImage, copyrightAgreed]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("layout", selectedLayout);
    params.set("inviteSize", selectedInvitationSizeId);
    params.set("secondarySize", selectedSecondarySizeId);
    params.set("frame", selectedFrame.id);
    params.set("topMat", selectedTopMat.id);
    params.set("bottomMat", selectedBottomMat.id);
    params.set("matType", matType);
    params.set("glass", selectedGlass.id);
    params.set("hardware", hardware);
    params.set("quantity", quantity.toString());
    if (useCustomInviteSize) {
      params.set("customInvite", "true");
      params.set("customInviteWidth", customInviteWidth);
      params.set("customInviteHeight", customInviteHeight);
    }
    if (useCustomSecondarySize) {
      params.set("customSecondary", "true");
      params.set("customSecondaryWidth", customSecondaryWidth);
      params.set("customSecondaryHeight", customSecondaryHeight);
    }
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
    if (typeof window !== "undefined")
      window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
  }, [
    selectedLayout,
    selectedInvitationSizeId,
    selectedSecondarySizeId,
    selectedFrame,
    selectedTopMat,
    selectedBottomMat,
    matType,
    selectedGlass,
    hardware,
    quantity,
    useCustomInviteSize,
    customInviteWidth,
    customInviteHeight,
    useCustomSecondarySize,
    customSecondaryWidth,
    customSecondaryHeight,
    bottomWeighted,
    serviceType,
    brassNameplateConfig,
  ]);

  const handleLayoutChange = useCallback((layoutId: WeddingLayoutType) => {
    setSelectedLayout(layoutId);
    const defaultSecondary = getDefaultSecondarySize(layoutId);
    if (defaultSecondary) setSelectedSecondarySizeId(defaultSecondary.id);
    setUseCustomSecondarySize(false);
  }, []);

  const availableSecondarySizes = useMemo(
    () => getSecondaryOpeningSizesForLayout(selectedLayout),
    [selectedLayout]
  );

  const handlePhotoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoImage((ev.target?.result as string) ?? null);
    reader.readAsDataURL(file);
    e.target.value = "";
  }, []);

  const handleAddToCart = useCallback(async () => {
    if (!canAddToCart) {
      if (serviceType === "print-and-frame") {
        if (!photoImage)
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
      matColorId: selectedTopMat.id,
      matInnerColorId: matType === "double" ? selectedBottomMat.id : undefined,
      glassTypeId: selectedGlass.id,
      artworkWidth: frameConfig.frameWidth,
      artworkHeight: adjustedFrameHeight,
      matType,
      matBorderWidth: 0,
      matRevealWidth: 0.25,
      bottomWeighted: false,
      brassNameplateConfig: brassNameplateConfig.enabled ? brassNameplateConfig : undefined,
      imageUrl: serviceType === "print-and-frame" && photoImage ? photoImage : undefined,
      copyrightAgreed: serviceType === "print-and-frame" ? copyrightAgreed : undefined,
    };
    try {
      await addToCart(config, finalTotalPrice * quantity, quantity);
      toast({
        title: "Added to Cart!",
        description: `${quantity} × Wedding Invitation Frame${quantity > 1 ? "s" : ""}`,
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
    photoImage,
    copyrightAgreed,
    selectedFrame,
    selectedTopMat,
    selectedBottomMat,
    matType,
    selectedGlass,
    frameConfig.frameWidth,
    adjustedFrameHeight,
    brassNameplateConfig,
    finalTotalPrice,
    quantity,
    toast,
  ]);

  const hasValidCustomInvite = !useCustomInviteSize || !customInviteError;
  const hasValidCustomSecondary =
    selectedLayout === "invite-only" || !useCustomSecondarySize || !customSecondaryError;

  return (
    <div
      className="w-full min-h-screen bg-gradient-to-b from-background to-muted/30 pb-24 lg:pb-0"
      data-testid="wedding-invitation-frame-designer"
    >
      {isMobile && embedded && (
        <div className="lg:hidden border-b bg-card/50 sticky top-0 z-40">
          <div className="px-4 py-3">
            <h1 className="text-lg font-bold">Wedding Invitation Frame Designer</h1>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6 lg:py-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-6">
          <div
            ref={previewCardRef}
            className={`${isMobile && mobileView === "controls" ? "hidden lg:block" : ""} lg:sticky lg:top-[132px] lg:self-start space-y-4`}
          >
            <Card className="p-4">
              <div
                ref={containerRef}
                className="bg-muted/50 rounded p-2 flex items-center justify-center relative group"
                style={{ minHeight: `${previewContainerHeight}px` }}
              >
                <WeddingInvitationPreview
                  config={adjustedFrameConfig}
                  previewDimensions={previewDimensions}
                  framePhotos={framePhotos}
                  selectedFrame={selectedFrame}
                  topMatColor={selectedTopMat}
                  bottomMatColor={matType === "double" ? selectedBottomMat : selectedTopMat}
                  matType={matType}
                  brassNameplateConfig={brassNameplateConfig}
                  bottomWeightedExtra={bottomWeightedExtra}
                  invitationImage={null}
                  secondaryImage={
                    selectedLayout === "invite-photo" && serviceType === "print-and-frame"
                      ? photoImage
                      : null
                  }
                />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Finished size:{" "}
                <span className="font-medium text-foreground">
                  {frameConfig.frameWidth.toFixed(1)}&quot; × {adjustedFrameHeight.toFixed(1)}&quot;
                </span>
              </p>
            </Card>
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
                Design a keepsake for your wedding invitation
              </p>

              <RadioGroup
                value={serviceType}
                onValueChange={(v: string) => setServiceType(v as "frame-only" | "print-and-frame")}
                className="inline-flex w-full rounded-xl border p-1.5 bg-muted/40"
              >
                <div className="flex w-full gap-1">
                  <Label
                    htmlFor="wed-service-frame-only"
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium cursor-pointer ${serviceType === "frame-only" ? "bg-background border border-border shadow-md" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <RadioGroupItem
                      value="frame-only"
                      id="wed-service-frame-only"
                      className="sr-only"
                    />
                    <Package className="h-4 w-4" /> Frame Only
                  </Label>
                  <Label
                    htmlFor="wed-service-print-and-frame"
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium cursor-pointer ${serviceType === "print-and-frame" ? "bg-background border border-border shadow-md" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <RadioGroupItem
                      value="print-and-frame"
                      id="wed-service-print-and-frame"
                      className="sr-only"
                    />
                    <ImageIcon className="h-4 w-4" /> Print & Frame
                  </Label>
                </div>
              </RadioGroup>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                <Heart className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm">
                  <span className="font-medium text-foreground">
                    Display your invitation with an optional photo
                  </span>
                </span>
              </div>

              {serviceType === "print-and-frame" && selectedLayout === "invite-photo" && (
                <div className="space-y-3">
                  <Separator />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  {!photoImage ? (
                    <>
                      <p className="text-xs text-muted-foreground">
                        Upload a photo for the second opening
                      </p>
                      <Button onClick={() => fileInputRef.current?.click()} className="w-full">
                        <Upload className="h-4 w-4 mr-2" /> Upload Photo
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between p-3 rounded-md border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                          <span className="text-sm text-green-800 dark:text-green-200">
                            Photo uploaded
                          </span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setPhotoImage(null)}>
                          <X className="h-3 w-3 mr-1" /> Clear
                        </Button>
                      </div>
                      <div className="flex items-start space-x-2 p-3 bg-muted/50 rounded-md">
                        <Checkbox
                          id="wed-copyright"
                          checked={copyrightAgreed}
                          onCheckedChange={(c) => setCopyrightAgreed(c === true)}
                          className="mt-0.5"
                        />
                        <Label htmlFor="wed-copyright" className="text-xs cursor-pointer">
                          I confirm that I own or am authorized to reproduce this image and agree to
                          the Terms of Service.
                        </Label>
                      </div>
                    </>
                  )}
                </div>
              )}

              <Accordion
                type="multiple"
                defaultValue={[
                  "layout",
                  "invite-size",
                  "secondary-size",
                  "frame",
                  "mat",
                  "nameplate",
                  "glass",
                  "hardware",
                ]}
                className="space-y-4"
              >
                <AccordionItem value="layout" className="border rounded-lg px-4">
                  <AccordionTrigger className="text-base font-semibold hover:no-underline py-4">
                    Layout
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 pt-2 pb-4">
                    {WEDDING_LAYOUTS.map((layout) => (
                      <button
                        key={layout.id}
                        type="button"
                        onClick={() => handleLayoutChange(layout.id)}
                        className={`w-full p-4 rounded-xl border-2 text-left flex items-center gap-3 ${selectedLayout === layout.id ? "border-primary bg-primary/5" : "border-border"}`}
                      >
                        <LayoutTemplate className="h-5 w-5 shrink-0" />
                        <div>
                          <p className="font-semibold">{layout.displayName}</p>
                          <p className="text-sm text-muted-foreground">{layout.description}</p>
                        </div>
                      </button>
                    ))}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="invite-size" className="border rounded-lg px-4">
                  <AccordionTrigger className="text-base font-semibold hover:no-underline py-4">
                    Invitation Size
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 pt-2 pb-4">
                    <div className="grid grid-cols-2 gap-2">
                      {INVITATION_SIZES.filter(() => !useCustomInviteSize).map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            setUseCustomInviteSize(false);
                            setSelectedInvitationSizeId(s.id);
                          }}
                          className={`p-3 rounded-lg border-2 text-left text-sm ${selectedInvitationSizeId === s.id && !useCustomInviteSize ? "border-primary bg-primary/5" : "border-border"}`}
                        >
                          <span className="font-medium">{s.displayName}</span>
                          {s.isPopular && (
                            <span className="block text-xs text-primary">Popular</span>
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="wed-custom-invite"
                        checked={useCustomInviteSize}
                        onCheckedChange={(c) => setUseCustomInviteSize(c === true)}
                      />
                      <Label htmlFor="wed-custom-invite">Custom size</Label>
                    </div>
                    {useCustomInviteSize && (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">Width (in)</Label>
                          <Input
                            type="text"
                            value={customInviteWidth}
                            onChange={(e) => setCustomInviteWidth(e.target.value)}
                            placeholder="5"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Height (in)</Label>
                          <Input
                            type="text"
                            value={customInviteHeight}
                            onChange={(e) => setCustomInviteHeight(e.target.value)}
                            placeholder="7"
                          />
                        </div>
                        {customInviteError && (
                          <p className="text-sm text-destructive col-span-2">{customInviteError}</p>
                        )}
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>

                {selectedLayout !== "invite-only" && (
                  <AccordionItem value="secondary-size" className="border rounded-lg px-4">
                    <AccordionTrigger className="text-base font-semibold hover:no-underline py-4">
                      Second Opening Size
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 pt-2 pb-4">
                      <div className="grid grid-cols-2 gap-2">
                        {availableSecondarySizes
                          .filter(() => !useCustomSecondarySize)
                          .map((s) => (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => {
                                setUseCustomSecondarySize(false);
                                setSelectedSecondarySizeId(s.id);
                              }}
                              className={`p-3 rounded-lg border-2 text-left text-sm ${selectedSecondarySizeId === s.id && !useCustomSecondarySize ? "border-primary bg-primary/5" : "border-border"}`}
                            >
                              {s.displayName}
                            </button>
                          ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="wed-custom-secondary"
                          checked={useCustomSecondarySize}
                          onCheckedChange={(c) => setUseCustomSecondarySize(c === true)}
                        />
                        <Label htmlFor="wed-custom-secondary">Custom size</Label>
                      </div>
                      {useCustomSecondarySize && (
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-xs">Width (in)</Label>
                            <Input
                              type="text"
                              value={customSecondaryWidth}
                              onChange={(e) => setCustomSecondaryWidth(e.target.value)}
                              placeholder="5"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Height (in)</Label>
                            <Input
                              type="text"
                              value={customSecondaryHeight}
                              onChange={(e) => setCustomSecondaryHeight(e.target.value)}
                              placeholder="7"
                            />
                          </div>
                          {customSecondaryError && (
                            <p className="text-sm text-destructive col-span-2">
                              {customSecondaryError}
                            </p>
                          )}
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                )}

                <AccordionItem value="frame" className="border rounded-lg px-4">
                  <AccordionTrigger className="text-base font-semibold hover:no-underline py-4">
                    Frame
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {pictureFrames.slice(0, 12).map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setSelectedFrame(f)}
                          className={`p-3 rounded-lg border-2 text-left text-sm ${selectedFrame.id === f.id ? "border-primary bg-primary/5" : "border-border"}`}
                        >
                          <span className="font-medium truncate block">{f.name}</span>
                        </button>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="mat" className="border rounded-lg px-4">
                  <AccordionTrigger className="text-base font-semibold hover:no-underline py-4">
                    Mat
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2 pb-4">
                    <RadioGroup
                      value={matType}
                      onValueChange={(v: string) => setMatType(v as "single" | "double")}
                      className="flex gap-4"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="single" id="wed-mat-single" />
                        <Label htmlFor="wed-mat-single">Single</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="double" id="wed-mat-double" />
                        <Label htmlFor="wed-mat-double">Double</Label>
                      </div>
                    </RadioGroup>
                    <Label className="text-sm">Top mat</Label>
                    <ColorSwatchesWithSeparator
                      standardColors={standardMats}
                      premiumColors={premiumMats}
                      selectedId={selectedTopMat.id}
                      onSelect={setSelectedTopMat}
                    />
                    {matType === "double" && (
                      <>
                        <Label className="text-sm">Bottom / accent mat</Label>
                        <ColorSwatchesWithSeparator
                          standardColors={standardMats}
                          premiumColors={premiumMats}
                          selectedId={selectedBottomMat.id}
                          onSelect={setSelectedBottomMat}
                        />
                      </>
                    )}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="nameplate" className="border rounded-lg px-4">
                  <AccordionTrigger className="text-base font-semibold hover:no-underline py-4">
                    Brass Nameplate
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4">
                    <BrassNameplateSection
                      config={brassNameplateConfig}
                      onChange={setBrassNameplateConfig}
                    />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="glass" className="border rounded-lg px-4">
                  <AccordionTrigger className="text-base font-semibold hover:no-underline py-4">
                    Glass
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4">
                    <div className="flex flex-wrap gap-2">
                      {glassTypes.map((g) => (
                        <Button
                          key={g.id}
                          variant={selectedGlass.id === g.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedGlass(g)}
                        >
                          {g.name}
                        </Button>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="hardware" className="border rounded-lg px-4">
                  <AccordionTrigger className="text-base font-semibold hover:no-underline py-4">
                    Hardware
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4">
                    <HangingHardwareSection
                      hardwareType={hardware}
                      setHardwareType={setHardware}
                      frameWidth={frameConfig.frameWidth}
                      frameHeight={adjustedFrameHeight}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <BottomWeightedMatting checked={bottomWeighted} onCheckedChange={setBottomWeighted} />

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <QuantitySelector value={quantity} onChange={setQuantity} />
                <PriceBox
                  totalPrice={finalTotalPrice}
                  quantity={quantity}
                  onQuantityChange={setQuantity}
                  onAddToCart={handleAddToCart}
                  priceItems={pricing?.items}
                  disabled={!hasValidCustomInvite || !hasValidCustomSecondary}
                />
              </div>
              <Button
                className="w-full"
                size="lg"
                onClick={handleAddToCart}
                disabled={!hasValidCustomInvite || !hasValidCustomSecondary}
              >
                Add to Cart
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
