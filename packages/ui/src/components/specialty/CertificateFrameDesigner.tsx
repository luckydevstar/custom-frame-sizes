"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  Copy,
  Maximize,
  X,
  Eye,
  Settings,
  Info,
  Smartphone,
  Download,
  Link2,
  Loader2,
  ShoppingCart,
} from "lucide-react";
import { useIntelligentPreviewSizing } from "@framecraft/core";
import { Button } from "../ui/button";
import { QuantitySelector } from "../ui/quantity-selector";
import { Card } from "../ui/card";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Input } from "../ui/input";
import { Slider } from "../ui/slider";
import { Separator } from "../ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { PriceBox } from "../ui/PriceBox";
import type { PriceLineItem } from "../ui/PriceBox";
import type { FrameStyle, FrameConfiguration } from "@framecraft/types";
import {
  getFramesByCategory,
  getGlassTypes,
  getFrameStyleById,
  calculatePricing,
  parseFraction,
  validateArtworkSize,
  formatDimension,
  computePreviewLayout,
  addToCart,
  isShopifyEnabled,
  apiRequest,
  getRandomDiplomaInsert,
  getRandomDiplomaLifestyle,
  exportFramePreview,
  convertImageToDataURL,
  downloadImage,
  getMatTilingStyle,
} from "@framecraft/core";
import { CERTIFICATE_SIZES, getCertificateSizeById, type CertificateSize } from "@framecraft/core";
import { useIsMobile, useMobileViewToggle } from "@framecraft/core";
import {
  ALL_MATS,
  getMatsInDisplayOrder,
  getMatById,
  getAvailableColorsForSize,
  type Mat,
} from "@framecraft/config";
import { useToast } from "../../hooks/use-toast";
import { ColorSwatchesWithSeparator } from "../ui/ColorSwatches";
import { ARViewer } from "../shared/ARViewer";
import { HangingHardwareSection } from "./shared/HangingHardwareSection";
import { BrassNameplateSection } from "../brass-nameplate/BrassNameplateSection";
import type { BrassNameplateConfig } from "@framecraft/types";
import { BRASS_NAMEPLATE_SPECS } from "@framecraft/types";
import { BrassNameplatePreview } from "../brass-nameplate/BrassNameplatePreview";
import { BottomWeightedMatting } from "./shared/BottomWeightedMatting";
import { DiplomaLifestyleCarousel } from "./DiplomaLifestyleCarousel";

// Get product data from services
const frameStyles = getFramesByCategory("picture");
const allGlassTypes = getGlassTypes();
// Filter out "No Acrylic" options for certificate frames
const glassTypes = allGlassTypes.filter((g) => g.id !== "backing-only" && g.id !== "none");

interface CertificateFrameDesignerProps {
  defaultFrameId?: string;
  embedded?: boolean;
  hideMobileSticky?: boolean;
}

export function CertificateFrameDesigner({
  defaultFrameId,
  embedded = false,
  hideMobileSticky = false,
}: CertificateFrameDesignerProps = {}) {
  const [searchParams, setSearchParams] = useState(
    typeof window !== "undefined" ? window.location.search : ""
  );
  const [serviceType, setServiceType] = useState<"frame-only" | "print-and-frame">("frame-only");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const { mobileView, setMobileView, showMobileBar, previewCardRef, controlsHeadingRef } =
    useMobileViewToggle({ isMobile });

  // Sync searchParams from URL on mount and when user navigates (e.g. Back)
  useEffect(() => {
    setSearchParams(window.location.search);
  }, []);
  useEffect(() => {
    const handler = () => setSearchParams(window.location.search);
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  // Initialize frame selection based on defaultFrameId prop or URL parameter
  const initialFrame = useMemo((): FrameStyle => {
    const fallback = frameStyles[0];
    if (!fallback) throw new Error("No frame styles available");
    if (defaultFrameId) {
      return getFrameStyleById(defaultFrameId) ?? fallback;
    }
    const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
    const frameParam = params.get("frame");
    return (
      (frameParam ? getFrameStyleById(frameParam) : getFrameStyleById("modern-black")) ?? fallback
    );
  }, [defaultFrameId]);

  const [selectedFrame, setSelectedFrame] = useState<FrameStyle>(initialFrame);
  const [selectedMat, setSelectedMat] = useState<Mat>(() => getMatById("mat-1") ?? ALL_MATS[0]!);
  const [selectedMatInner, setSelectedMatInner] = useState<Mat>(
    () => getMatById("mat-40") ?? ALL_MATS[1]!
  );
  const defaultGlass = glassTypes[0];
  const [selectedGlass, setSelectedGlass] = useState(defaultGlass ?? allGlassTypes[0]!);
  const [matType, setMatType] = useState<"none" | "single" | "double">("double");
  const [matBorderWidth, setMatBorderWidth] = useState("2.5");
  const [matRevealWidth, setMatRevealWidth] = useState("0.25");
  const [copyrightAgreed] = useState(false);
  const [uploadedImageAspectRatio] = useState<number | null>(null);
  const [fullImageOpen, setFullImageOpen] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<
    "preview" | "corner" | "profile" | "lifestyle"
  >("preview");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [previousImage, setPreviousImage] = useState<string | null>(null);
  const prevImageRef = useRef<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [hangingHardware, setHangingHardware] = useState<"standard" | "security">("standard");
  const [bottomWeighted, setBottomWeighted] = useState(false);

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
      const params = new URLSearchParams(window.location.search);
      const nameplateEnabled =
        params.get("nameplateEnabled") === "true" || params.get("plaqueEnabled") === "true";
      if (!nameplateEnabled) return defaultConfig;
      return {
        enabled: true,
        line1: params.get("nameplateLine1") || params.get("plaqueLine1") || "",
        line2: params.get("nameplateLine2") || params.get("plaqueLine2") || "",
        line3: params.get("nameplateLine3") || params.get("plaqueLine3") || "",
        font:
          (params.get("nameplateFont") as BrassNameplateConfig["font"]) ||
          params.get("plaqueFont") ||
          "georgia",
        color:
          (params.get("nameplateColor") as BrassNameplateConfig["color"]) ||
          params.get("plaqueColor") ||
          "brass-black",
        includeFlag: (params.get("nameplateFlag") || params.get("plaqueFlag")) === "true",
      };
    } catch {
      return defaultConfig;
    }
  });

  const [showARViewer, setShowARViewer] = useState(false);
  const { toast } = useToast();
  const [selectedCertificateSize, setSelectedCertificateSize] = useState<CertificateSize | null>(
    null
  );
  const [artworkWidth, setArtworkWidth] = useState("11");
  const [artworkHeight, setArtworkHeight] = useState("8.5");
  const [pricingSidebarExpanded, setPricingSidebarExpanded] = useState(false);
  const hardwareSectionRef = useRef<HTMLDivElement>(null);

  const randomSeed = useMemo(() => Math.floor(Math.random() * 10000), []);
  const placeholderImage = useMemo(() => getRandomDiplomaInsert(randomSeed), [randomSeed]);
  const displayImage = selectedImage || placeholderImage;

  const configuratorRef = useRef<HTMLDivElement>(null);
  const [framePhotos, setFramePhotos] = useState<{
    cornerUrl?: string;
    profileUrl?: string;
    lifestyleUrl?: string;
    topUrl?: string;
    bottomUrl?: string;
    leftUrl?: string;
    rightUrl?: string;
  }>({});

  const getRandomLifestyleImage = useCallback((frameId: string) => {
    return getRandomDiplomaLifestyle(frameId);
  }, []);

  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);

  // Load configuration from URL parameters on mount and when URL changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const frameId = params.get("frame");
    const width = params.get("width");
    const height = params.get("height");
    const mat = params.get("mat");
    const matColorId = params.get("matColor");
    const matInnerColorId = params.get("matInnerColor");
    const matBorder = params.get("matBorder");
    const service = params.get("service");
    const hardware = params.get("hardware");
    const imageUrl = params.get("imageUrl");
    const quantityParam = params.get("quantity");
    const certificateSizeId = params.get("certificateSize");

    if (frameId) {
      const frame = frameStyles.find((f) => f.id === frameId);
      if (frame) setSelectedFrame(frame);
    }
    if (quantityParam) {
      const parsedQuantity = parseInt(quantityParam, 10);
      if (parsedQuantity >= 1) setQuantity(parsedQuantity);
    }
    if (certificateSizeId) {
      const certificatePreset = getCertificateSizeById(certificateSizeId);
      if (certificatePreset) {
        setSelectedCertificateSize(certificatePreset);
        setArtworkWidth(certificatePreset.documentWidth.toString());
        setArtworkHeight(certificatePreset.documentHeight.toString());
      }
    } else {
      if (width) setArtworkWidth(width);
      if (height) setArtworkHeight(height);
    }
    if (mat === "none" || mat === "single" || mat === "double") setMatType(mat);
    if (matColorId) {
      const matColor = ALL_MATS.find((m) => m.id === matColorId);
      if (matColor) setSelectedMat(matColor);
    }
    if (matInnerColorId) {
      const innerMatColor = ALL_MATS.find((m) => m.id === matInnerColorId);
      if (innerMatColor) setSelectedMatInner(innerMatColor);
    }
    if (matBorder) setMatBorderWidth(matBorder);
    const bottomWeightedParam = params.get("bottomWeighted");
    if (bottomWeightedParam === "true") setBottomWeighted(true);
    if (service === "frame-only" || service === "print-and-frame") setServiceType(service);
    if (hardware === "standard" || hardware === "security") setHangingHardware(hardware);
    if (imageUrl) setSelectedImage(imageUrl);
    setIsInitialLoadComplete(true);
  }, [searchParams]);

  // Update URL when configuration changes (but not during initial load)
  useEffect(() => {
    if (!isInitialLoadComplete) return;
    const params = new URLSearchParams();
    params.set("frame", selectedFrame.id);
    if (selectedCertificateSize && selectedCertificateSize.id !== "custom") {
      params.set("certificateSize", selectedCertificateSize.id);
    } else {
      params.set("width", artworkWidth);
      params.set("height", artworkHeight);
    }
    params.set("mat", matType);
    if (matType !== "none") {
      params.set("matColor", selectedMat.id);
      params.set("matBorder", matBorderWidth);
      if (bottomWeighted) params.set("bottomWeighted", "true");
      else params.delete("bottomWeighted");
    }
    if (matType === "double") params.set("matInnerColor", selectedMatInner.id);
    params.set("service", serviceType);
    params.set("hardware", hangingHardware);
    if (quantity > 1) params.set("quantity", quantity.toString());
    else params.delete("quantity");
    if (brassNameplateConfig.enabled) {
      params.set("nameplateEnabled", "true");
      if (brassNameplateConfig.line1) params.set("nameplateLine1", brassNameplateConfig.line1);
      if (brassNameplateConfig.line2) params.set("nameplateLine2", brassNameplateConfig.line2);
      if (brassNameplateConfig.line3) params.set("nameplateLine3", brassNameplateConfig.line3);
      params.set("nameplateFont", brassNameplateConfig.font);
      params.set("nameplateColor", brassNameplateConfig.color);
    } else {
      params.delete("nameplateEnabled");
      params.delete("nameplateLine1");
      params.delete("nameplateLine2");
      params.delete("nameplateLine3");
      params.delete("nameplateFont");
      params.delete("nameplateColor");
    }
    if (
      selectedImage &&
      (selectedImage.includes("/tmp-maps/") || selectedImage.startsWith("http"))
    ) {
      params.set("imageUrl", selectedImage);
    }
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  }, [
    isInitialLoadComplete,
    selectedFrame,
    selectedCertificateSize,
    artworkWidth,
    artworkHeight,
    matType,
    selectedMat,
    selectedMatInner,
    matBorderWidth,
    bottomWeighted,
    serviceType,
    hangingHardware,
    selectedImage,
    quantity,
    brassNameplateConfig,
  ]);

  // Fetch frame photos from API when frame changes
  useEffect(() => {
    setFramePhotos({});
    if (!selectedFrame.sku) return;
    async function fetchFramePhotos() {
      try {
        const response = await fetch(`/api/frames/${selectedFrame.sku}/photos`);
        if (response.ok) {
          const photoSet = await response.json();
          const randomLifestyle = getRandomLifestyleImage(selectedFrame.id);
          setFramePhotos({
            topUrl: photoSet.topUrl,
            bottomUrl: photoSet.bottomUrl,
            leftUrl: photoSet.leftUrl,
            rightUrl: photoSet.rightUrl,
            cornerUrl: photoSet.cornerUrl,
            profileUrl: photoSet.profileUrl,
            lifestyleUrl: randomLifestyle || photoSet.lifestyleUrl,
          });
        }
      } catch (error) {
        console.error("Error fetching frame photos:", error);
      }
    }
    fetchFramePhotos();
  }, [selectedFrame, getRandomLifestyleImage]);

  // Cross-fade animation when selectedImage changes
  useEffect(() => {
    if (prevImageRef.current && prevImageRef.current !== selectedImage) {
      setPreviousImage(prevImageRef.current);
      const timer = setTimeout(() => setPreviousImage(null), 450);
      prevImageRef.current = selectedImage;
      return () => clearTimeout(timer);
    }
    prevImageRef.current = selectedImage;
    return undefined;
  }, [selectedImage]);

  // Desktop pricing sidebar expansion when user scrolls to hardware section
  useEffect(() => {
    const isDesktop =
      typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches;
    if (!isDesktop) return;
    let scrollTimeout: ReturnType<typeof setTimeout>;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollPosition = window.scrollY;
        if (hardwareSectionRef.current) {
          const hardwareTop =
            hardwareSectionRef.current.getBoundingClientRect().top + window.scrollY;
          const expandThreshold = hardwareTop - window.innerHeight;
          if (scrollPosition > expandThreshold && !pricingSidebarExpanded)
            setPricingSidebarExpanded(true);
          else if (scrollPosition <= 100 && pricingSidebarExpanded)
            setPricingSidebarExpanded(false);
        }
      }, 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      clearTimeout(scrollTimeout);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pricingSidebarExpanded]);

  // When brass nameplate is enabled, validate mat border minimum
  useEffect(() => {
    if (brassNameplateConfig.enabled && matType !== "none") {
      const currentBorder = parseFloat(matBorderWidth) || 0;
      const MIN_REQUIRED = BRASS_NAMEPLATE_SPECS.MIN_BOTTOM_BORDER;
      if (currentBorder < MIN_REQUIRED) {
        setMatBorderWidth(MIN_REQUIRED.toString());
        toast({
          title: "Mat Border Adjusted",
          description: `Brass plaque requires minimum ${MIN_REQUIRED}" mat border. Mat border increased from ${currentBorder}" to ${MIN_REQUIRED}".`,
          duration: 5000,
        });
      }
    }
  }, [brassNameplateConfig.enabled, matType, matBorderWidth, toast]);

  // Reset bottomWeighted when mat is removed
  useEffect(() => {
    if (matType === "none" && bottomWeighted) setBottomWeighted(false);
  }, [matType, bottomWeighted]);

  const handleWidthChange = (newWidth: string) => {
    setArtworkWidth(newWidth);
    if (serviceType === "print-and-frame" && uploadedImageAspectRatio && selectedImage) {
      const width = parseFraction(newWidth);
      if (width > 0) setArtworkHeight((width / uploadedImageAspectRatio).toFixed(2));
    }
  };

  const handleCheckout = async () => {
    if (!isValidDimensions || isTooLarge) {
      toast({
        title: "Invalid Configuration",
        description: "Please check your frame dimensions.",
        variant: "destructive",
      });
      return;
    }
    if (
      brassNameplateConfig.enabled &&
      matType !== "none" &&
      parseFloat(matBorderWidth) < BRASS_NAMEPLATE_SPECS.MIN_BOTTOM_BORDER
    ) {
      toast({
        title: "Invalid Configuration",
        description: `Brass plaque requires minimum ${BRASS_NAMEPLATE_SPECS.MIN_BOTTOM_BORDER}" mat border. Please adjust before adding to cart.`,
        variant: "destructive",
      });
      return;
    }
    if (serviceType === "print-and-frame" && selectedImage && !copyrightAgreed) {
      toast({
        title: "Copyright Agreement Required",
        description: "Please agree to the copyright terms before proceeding.",
        variant: "destructive",
      });
      return;
    }
    setIsCheckingOut(true);
    const shopifyEnabled = await isShopifyEnabled();
    const glass = selectedGlass ?? glassTypes[0];
    if (!glass) return;
    const config: FrameConfiguration = {
      serviceType,
      artworkWidth: parseFraction(artworkWidth),
      artworkHeight: parseFraction(artworkHeight),
      frameStyleId: selectedFrame.id,
      matType,
      matBorderWidth: parseFraction(matBorderWidth),
      matRevealWidth: parseFraction(matRevealWidth),
      matColorId: selectedMat.id,
      matInnerColorId: matType === "double" ? selectedMatInner.id : undefined,
      glassTypeId: glass.id,
      imageUrl: selectedImage || undefined,
      copyrightAgreed: serviceType === "frame-only" ? undefined : copyrightAgreed,
    };
    if (shopifyEnabled) {
      try {
        const result = await addToCart(config, finalTotalPrice * quantity, quantity);
        if (result.checkoutUrl) window.location.href = result.checkoutUrl;
        else throw new Error("Failed to create checkout");
      } catch (error) {
        setIsCheckingOut(false);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to add to cart",
          variant: "destructive",
        });
      }
    } else {
      try {
        const response = await apiRequest("POST", "/api/cart", config);
        await response.json();
        setIsCheckingOut(false);
        toast({
          title: "Added to Cart",
          description: "Your custom frame has been added. Cart checkout coming soon!",
        });
      } catch (error) {
        setIsCheckingOut(false);
        toast({ title: "Error", description: "Failed to add to cart", variant: "destructive" });
      }
    }
    return;
  };

  const handleShare = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: "Link copied!", description: "Design link copied to clipboard" });
  }, [toast]);

  const artW = parseFraction(artworkWidth);
  const artH = parseFraction(artworkHeight);
  const matBorder = parseFraction(matBorderWidth);
  const matReveal = parseFraction(matRevealWidth);
  const artworkSizeValidation = useMemo(() => validateArtworkSize(artW, artH), [artW, artH]);
  const isValidDimensions = artworkSizeValidation.valid;

  const bottomWeightedExtra = bottomWeighted ? 0.5 : 0;
  const effectiveMatBorders = useMemo(() => {
    const userBorder = parseFloat(matBorderWidth);
    const MIN_BOTTOM_FOR_PLAQUE = 3.75;
    if (brassNameplateConfig.enabled && matType !== "none") {
      return {
        top: userBorder,
        right: userBorder,
        bottom: Math.max(userBorder, MIN_BOTTOM_FOR_PLAQUE) + bottomWeightedExtra,
        left: userBorder,
      };
    }
    return {
      top: userBorder,
      right: userBorder,
      bottom: userBorder + bottomWeightedExtra,
      left: userBorder,
    };
  }, [matBorderWidth, brassNameplateConfig.enabled, matType, bottomWeightedExtra]);

  const frameWidth =
    artW +
    (matType !== "none" ? effectiveMatBorders.left + effectiveMatBorders.right : 0) +
    (matType === "double" ? matReveal * 2 : 0) +
    (selectedFrame.mouldingWidth || 1) * 2;
  const frameHeight = useMemo(() => {
    if (matType === "none") return artH + selectedFrame.mouldingWidth * 2;
    return (
      artH +
      effectiveMatBorders.top +
      effectiveMatBorders.bottom +
      (matType === "double" ? matReveal * 2 : 0) +
      selectedFrame.mouldingWidth * 2
    );
  }, [artH, selectedFrame.mouldingWidth, matType, effectiveMatBorders, matReveal]);

  const MAX_OVERALL = 60;
  const isTooLarge = frameWidth > MAX_OVERALL || frameHeight > MAX_OVERALL;

  const pricingResult = useMemo(() => {
    if (!isValidDimensions) {
      return {
        basePrice: 0,
        framePrice: 0,
        matPrice: 0,
        glassPrice: 0,
        printPrice: 0,
        oversizeFee: 0,
        hardwarePrice: 0,
        nameplatePrice: 0,
        subtotal: 0,
        tax: 0,
        total: 0,
      };
    }
    const effectiveMatBorderForPricing =
      matType !== "none"
        ? (effectiveMatBorders.top +
            effectiveMatBorders.right +
            effectiveMatBorders.bottom +
            effectiveMatBorders.left) /
          4
        : 0;
    const glassForPricing = selectedGlass ?? glassTypes[0];
    const config: FrameConfiguration = {
      serviceType,
      artworkWidth: artW,
      artworkHeight: artH,
      frameStyleId: selectedFrame.id,
      matType,
      matBorderWidth: effectiveMatBorderForPricing,
      matRevealWidth: matReveal,
      matColorId: selectedMat.id,
      matInnerColorId: matType === "double" ? selectedMatInner.id : undefined,
      glassTypeId: glassForPricing?.id ?? glassTypes[0]!.id,
    };
    const framePricing = calculatePricing(config);
    const hardwareCost = hangingHardware === "security" ? 8.95 : 0;
    const plaqueCost =
      brassNameplateConfig.enabled && matType !== "none" ? BRASS_NAMEPLATE_SPECS.PRICE : 0;
    const oversizeFee = frameWidth > 40 || frameHeight > 40 ? 100 : 0;
    const total = framePricing.total + hardwareCost + plaqueCost + oversizeFee;
    return {
      ...framePricing,
      hardwarePrice: hardwareCost,
      nameplatePrice: plaqueCost,
      oversizeFee,
      total,
    };
  }, [
    isValidDimensions,
    serviceType,
    artW,
    artH,
    selectedFrame.id,
    matType,
    effectiveMatBorders,
    matReveal,
    selectedMat.id,
    selectedMatInner.id,
    selectedGlass,
    hangingHardware,
    brassNameplateConfig.enabled,
    frameWidth,
    frameHeight,
  ]);

  const {
    framePrice,
    matPrice,
    glassPrice,
    printPrice,
    oversizeFee,
    hardwarePrice,
    total: subtotal,
  } = pricingResult;
  const nameplatePrice = "nameplatePrice" in pricingResult ? pricingResult.nameplatePrice : 0;
  const finalTotalPrice = subtotal;

  const priceItems: PriceLineItem[] = useMemo(() => {
    const items: PriceLineItem[] = [];
    const glass = selectedGlass ?? glassTypes[0];
    const glassName = glass?.name ?? "Glazing";
    if (framePrice > 0)
      items.push({ label: "Frame", amount: framePrice, testId: "text-frame-price" });
    if (matType !== "none" && matPrice > 0)
      items.push({
        label: matType === "double" ? "Mat Board (double)" : "Mat Board (single)",
        amount: matPrice,
        testId: "text-mat-price",
      });
    if (glassPrice > 0)
      items.push({ label: glassName, amount: glassPrice, testId: "text-glass-price" });
    else items.push({ label: glassName, amount: 0, isIncluded: true, testId: "text-glass-price" });
    if (serviceType === "print-and-frame" && printPrice > 0)
      items.push({ label: "Print", amount: printPrice, testId: "text-print-price" });
    if (hangingHardware === "security" && hardwarePrice > 0)
      items.push({
        label: "Security Hardware",
        amount: hardwarePrice,
        testId: "text-hardware-price",
      });
    if (brassNameplateConfig.enabled && nameplatePrice > 0)
      items.push({
        label: "Engraved Brass Nameplate",
        amount: nameplatePrice,
        testId: "text-plaque-price",
      });
    if (oversizeFee > 0)
      items.push({ label: "Oversize Fee", amount: oversizeFee, testId: "text-oversize-fee" });
    return items;
  }, [
    framePrice,
    matType,
    matPrice,
    selectedGlass,
    glassPrice,
    serviceType,
    printPrice,
    hangingHardware,
    hardwarePrice,
    brassNameplateConfig.enabled,
    nameplatePrice,
    oversizeFee,
  ]);

  const warnings = useMemo(() => {
    const warningElements: React.ReactNode[] = [];
    if (oversizeFee > 0) {
      warningElements.push(
        <div
          key="oversize"
          className="p-2 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded text-xs"
        >
          <p className="font-medium text-yellow-900 dark:text-yellow-100">Oversize Frame</p>
          <p className="text-yellow-800 dark:text-yellow-200">
            This frame exceeds standard shipping dimensions. Additional ${oversizeFee.toFixed(2)}{" "}
            fee applies for special handling and packaging.
          </p>
        </div>
      );
    }
    return warningElements;
  }, [oversizeFee]);

  const { containerRef, previewContainerHeight, containerWidth } = useIntelligentPreviewSizing({
    frameWidth,
    frameHeight,
    plaqueEnabled: brassNameplateConfig.enabled,
    plaqueExtension: BRASS_NAMEPLATE_SPECS.NAMEPLATE_FRAME_EXTENSION,
    isMobile,
    minHeightMobile: 400,
    minHeightDesktop: 500,
  });

  const layout = useMemo(() => {
    if (matType === "none") {
      return computePreviewLayout({
        artW,
        artH,
        matBorder: 0,
        frameFace: selectedFrame.mouldingWidth || 1,
        containerWpx: containerWidth,
        containerHpx: previewContainerHeight,
      });
    }
    return computePreviewLayout({
      artW,
      artH,
      matBorderTop: effectiveMatBorders.top,
      matBorderRight: effectiveMatBorders.right,
      matBorderBottom: effectiveMatBorders.bottom,
      matBorderLeft: effectiveMatBorders.left,
      matReveal: matType === "double" ? matReveal : 0,
      frameFace: selectedFrame.mouldingWidth || 1,
      containerWpx: containerWidth,
      containerHpx: previewContainerHeight,
    });
  }, [
    artW,
    artH,
    effectiveMatBorders,
    matType,
    matReveal,
    selectedFrame.mouldingWidth,
    containerWidth,
    previewContainerHeight,
  ]);

  const asymmetricMatLayout = useMemo(() => {
    if (matType === "none" || !brassNameplateConfig.enabled) {
      return {
        openingX: layout.frameFacePx + layout.matPx,
        openingY: layout.frameFacePx + layout.matPx,
        openingWidth: layout.openingPx.w,
        openingHeight: layout.openingPx.h,
      };
    }
    const topMatPx = effectiveMatBorders.top * layout.scale;
    const leftMatPx = effectiveMatBorders.left * layout.scale;
    return {
      openingX: layout.frameFacePx + leftMatPx,
      openingY: layout.frameFacePx + topMatPx,
      openingWidth: artW * layout.scale,
      openingHeight: artH * layout.scale,
    };
  }, [matType, brassNameplateConfig.enabled, layout, effectiveMatBorders, artW, artH]);

  const availableMats = useMemo(
    () => getAvailableColorsForSize(frameWidth, frameHeight),
    [frameWidth, frameHeight]
  );
  const standardMats = useMemo(() => {
    const viewport = isMobile ? "mobile" : "desktop";
    const matsInOrder = getMatsInDisplayOrder(viewport, true, false);
    const availableMatIds = new Set(availableMats.available.map((m) => m.id));
    return matsInOrder.filter((mat) => availableMatIds.has(mat.id));
  }, [availableMats, isMobile]);
  const premiumMats = useMemo(() => {
    const viewport = isMobile ? "mobile" : "desktop";
    const matsInOrder = getMatsInDisplayOrder(viewport, false, true);
    const availableMatIds = new Set(availableMats.available.map((m) => m.id));
    return matsInOrder.filter((mat) => availableMatIds.has(mat.id));
  }, [availableMats, isMobile]);
  const disabledMatIds = useMemo(() => {
    const availableMatIds = availableMats.available.map((m) => m.id);
    return ALL_MATS.map((m) => m.id).filter((id) => !availableMatIds.includes(id));
  }, [availableMats]);

  const plaquePositioning = useMemo(() => {
    if (!brassNameplateConfig.enabled || matType === "none") return null;
    const plaqueWidthPx = BRASS_NAMEPLATE_SPECS.NAMEPLATE_WIDTH * layout.scale;
    const plaqueHeightPx = BRASS_NAMEPLATE_SPECS.NAMEPLATE_HEIGHT * layout.scale;
    const clearanceTopPx = 1.0 * layout.scale;
    const matAreaTop = effectiveMatBorders.top * layout.scale;
    const matAreaBottom = effectiveMatBorders.bottom * layout.scale;
    const MIN_BOTTOM_CLEARANCE = 1.25 * layout.scale;
    const requiredBottomSpace = clearanceTopPx + plaqueHeightPx + MIN_BOTTOM_CLEARANCE;
    // Plaque wrapper is inside the mat area div (position relative to mat area), so X and Y are in mat-area coordinates.
    // Center plaque horizontally in mat area: mat area width = outerPx.w - 2*frameFacePx
    const matAreaWidthPx = layout.outerPx.w - 2 * layout.frameFacePx;
    const plaqueX = (matAreaWidthPx - plaqueWidthPx) / 2;
    // Y from top of mat area: top mat border + opening height + clearance
    const plaqueY = matAreaTop + layout.openingPx.h + clearanceTopPx;
    return {
      x: plaqueX,
      y: plaqueY,
      width: plaqueWidthPx,
      height: plaqueHeightPx,
      hasWarning: matAreaBottom < requiredBottomSpace,
    };
  }, [brassNameplateConfig.enabled, matType, layout, effectiveMatBorders]);

  return (
    <>
      <div ref={configuratorRef} className="min-h-screen bg-background">
        <div className="container mx-auto py-4 md:py-8 px-4">
          <div className="grid lg:grid-cols-2 gap-4 md:gap-8">
            {/* Left Column - Preview */}
            <div
              className={`space-y-4 ${mobileView === "controls" ? "hidden md:block" : "block"} lg:sticky lg:top-[132px] lg:self-start`}
            >
              <Card ref={previewCardRef} className="p-4 md:p-6">
                <div className="md:hidden mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowARViewer(true)}
                    disabled={!isValidDimensions || isTooLarge}
                    className="h-8 text-sm px-4 md:hidden"
                    data-testid="button-view-ar-preview"
                  >
                    <Smartphone className="h-3.5 w-3.5 mr-2" /> View on My Wall
                  </Button>
                </div>
                <div
                  ref={containerRef}
                  className="preview-wrap bg-muted rounded-md flex items-center justify-center relative group"
                  style={{ minHeight: `${previewContainerHeight}px` }}
                  data-testid="preview-container"
                  onMouseEnter={() => {}}
                >
                  <div className="absolute top-4 left-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setFullscreenImage("preview");
                        setFullImageOpen(true);
                      }}
                      className="bg-background/90 hover:bg-background p-2 rounded-md shadow-lg hover-elevate active-elevate-2"
                      data-testid="button-expand-preview"
                      title="Fullscreen preview"
                    >
                      <Maximize className="h-5 w-5" />
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          let imageDataUrl = displayImage;
                          if (displayImage && !displayImage.startsWith("data:")) {
                            const { dismiss } = toast({
                              title: "Preparing Export",
                              description: "Converting image to safe format...",
                              duration: Infinity,
                            });
                            try {
                              imageDataUrl = await convertImageToDataURL(displayImage);
                              dismiss();
                            } catch (e) {
                              dismiss();
                              toast({
                                title: "Export Failed",
                                description: "Failed to process your image.",
                                variant: "destructive",
                              });
                              return;
                            }
                          }
                          const blobUrl = await exportFramePreview(
                            {
                              framePhotos:
                                framePhotos.topUrl &&
                                framePhotos.bottomUrl &&
                                framePhotos.leftUrl &&
                                framePhotos.rightUrl
                                  ? framePhotos
                                  : undefined,
                              frameFacePx: layout.frameFacePx,
                              outerWidth: layout.outerPx.w,
                              outerHeight: layout.outerPx.h,
                              matPx: layout.matPx,
                              openingWidth: layout.openingPx.w,
                              openingHeight: layout.openingPx.h,
                              matType,
                              matColor: selectedMat.hexColor || "#FFFFFF",
                              matName: selectedMat.name,
                              matInnerColor:
                                matType === "double"
                                  ? selectedMatInner.hexColor || "#FFFFFF"
                                  : undefined,
                              matInnerName:
                                matType === "double" ? selectedMatInner.name || "White" : undefined,
                              matRevealWidth: matType === "double" ? parseFloat(matRevealWidth) : 0,
                              scale: layout.scale,
                              artworkUrl: imageDataUrl,
                            },
                            1600
                          );
                          const isMobileDevice =
                            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                              navigator.userAgent
                            );
                          if (isMobileDevice && navigator.share) {
                            try {
                              const r = await fetch(blobUrl);
                              const blob = await r.blob();
                              await navigator.share({
                                files: [
                                  new File([blob], `${selectedFrame.name}-preview.png`, {
                                    type: "image/png",
                                  }),
                                ],
                                title: "Custom Frame Preview",
                                text: `Check out this ${selectedFrame.name} custom frame design!`,
                              });
                              toast({ title: "Export Successful", description: "Image shared!" });
                            } catch (err) {
                              if ((err as Error).name !== "AbortError") {
                                downloadImage(blobUrl, `${selectedFrame.name}-preview.png`);
                                toast({
                                  title: "Export Successful",
                                  description: "Image opened in new tab. Long-press to save.",
                                });
                              }
                            }
                          } else {
                            downloadImage(blobUrl, `${selectedFrame.name}-preview.png`);
                            toast({
                              title: "Export Successful",
                              description: isMobileDevice
                                ? "Long-press to save to Photos"
                                : "Preview downloaded",
                            });
                          }
                        } catch (error) {
                          toast({
                            title: "Export Failed",
                            description:
                              error instanceof Error ? error.message : "Could not export",
                            variant: "destructive",
                          });
                        }
                      }}
                      className="bg-background/90 hover:bg-background p-2 rounded-md shadow-lg hover-elevate active-elevate-2"
                      data-testid="button-export-preview"
                      title="Export preview (1600px)"
                    >
                      <Download className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        toast({
                          title: "Link copied!",
                          description: "Design link copied to clipboard.",
                        });
                      }}
                      className="bg-background/90 hover:bg-background p-2 rounded-md shadow-lg hover-elevate active-elevate-2"
                      data-testid="button-copy-link"
                      title="Copy design link"
                    >
                      <Copy className="h-5 w-5" />
                    </button>
                  </div>
                  {framePhotos.topUrl &&
                  framePhotos.bottomUrl &&
                  framePhotos.leftUrl &&
                  framePhotos.rightUrl ? (
                    <div
                      className="preview-stage"
                      style={{
                        width: layout.outerPx.w,
                        height: layout.outerPx.h,
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          height: layout.frameFacePx,
                          backgroundImage: `url(${framePhotos.topUrl})`,
                          backgroundSize: "auto 100%",
                          backgroundRepeat: "repeat-x",
                          backgroundPosition: "left center",
                          clipPath: `polygon(0 0, 100% 0, calc(100% - ${layout.frameFacePx}px) 100%, ${layout.frameFacePx}px 100%)`,
                          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: layout.frameFacePx,
                          backgroundImage: `url(${framePhotos.bottomUrl})`,
                          backgroundSize: "auto 100%",
                          backgroundRepeat: "repeat-x",
                          backgroundPosition: "left center",
                          clipPath: `polygon(${layout.frameFacePx}px 0, calc(100% - ${layout.frameFacePx}px) 0, 100% 100%, 0 100%)`,
                          boxShadow: "0 -2px 8px rgba(0,0,0,0.15)",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          bottom: 0,
                          width: layout.frameFacePx,
                          backgroundImage: `url(${framePhotos.leftUrl})`,
                          backgroundSize: "100% auto",
                          backgroundRepeat: "repeat-y",
                          backgroundPosition: "center top",
                          clipPath: `polygon(0 0, 100% ${layout.frameFacePx}px, 100% calc(100% - ${layout.frameFacePx}px), 0 100%)`,
                          boxShadow: "2px 0 8px rgba(0,0,0,0.15)",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          bottom: 0,
                          width: layout.frameFacePx,
                          backgroundImage: `url(${framePhotos.rightUrl})`,
                          backgroundSize: "100% auto",
                          backgroundRepeat: "repeat-y",
                          backgroundPosition: "center top",
                          clipPath: `polygon(0 ${layout.frameFacePx}px, 100% 0, 100% 100%, 0 calc(100% - ${layout.frameFacePx}px))`,
                          boxShadow: "-2px 0 8px rgba(0,0,0,0.15)",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: layout.frameFacePx,
                          left: layout.frameFacePx,
                          right: layout.frameFacePx,
                          bottom: layout.frameFacePx,
                          boxShadow:
                            matType !== "none"
                              ? "inset 0 0 20px rgba(0,0,0,0.3), inset 0 1px 3px rgba(0,0,0,0.08)"
                              : "inset 0 0 20px rgba(0,0,0,0.3)",
                          ...(matType !== "none"
                            ? getMatTilingStyle(
                                selectedMat.name,
                                layout.scale,
                                selectedMat.hexColor
                              )
                            : { backgroundColor: "white" }),
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            top: asymmetricMatLayout.openingY - layout.frameFacePx,
                            left: asymmetricMatLayout.openingX - layout.frameFacePx,
                            width:
                              matType === "double"
                                ? asymmetricMatLayout.openingWidth + matReveal * 2 * layout.scale
                                : asymmetricMatLayout.openingWidth,
                            height:
                              matType === "double"
                                ? asymmetricMatLayout.openingHeight + matReveal * 2 * layout.scale
                                : asymmetricMatLayout.openingHeight,
                            padding: matType === "double" ? matReveal * layout.scale : 0,
                            ...(matType === "double"
                              ? getMatTilingStyle(
                                  selectedMatInner.name,
                                  layout.scale,
                                  selectedMatInner.hexColor
                                )
                              : { backgroundColor: "white" }),
                          }}
                        >
                          {previousImage && (
                            <img
                              src={previousImage}
                              alt="Previous"
                              className="image-fade-out"
                              style={{
                                position: "absolute",
                                inset: 0,
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          )}
                          <img
                            src={displayImage}
                            alt="Preview"
                            className={previousImage ? "image-fade-in" : ""}
                            style={{
                              position: "absolute",
                              inset: 0,
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                        {matType !== "none" && plaquePositioning && (
                          <div
                            style={{
                              position: "absolute",
                              left: plaquePositioning.x,
                              top: plaquePositioning.y,
                              zIndex: 15,
                            }}
                          >
                            <BrassNameplatePreview
                              config={brassNameplateConfig}
                              scale={(layout.scale ?? 1) / 150}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div
                      className="preview-stage"
                      style={{ width: layout.outerPx.w, height: layout.outerPx.h }}
                    >
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          borderTop: `${layout.frameFacePx}px solid ${selectedFrame.borderColor}`,
                          borderLeft: `${layout.frameFacePx}px solid ${selectedFrame.borderColor}`,
                          borderRight: `${layout.frameFacePx}px solid ${selectedFrame.color}`,
                          borderBottom: `${layout.frameFacePx}px solid ${selectedFrame.color}`,
                          ...(matType !== "none"
                            ? getMatTilingStyle(
                                selectedMat.name,
                                layout.scale,
                                selectedMat.hexColor
                              )
                            : { backgroundColor: "white" }),
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            top: asymmetricMatLayout.openingY - layout.frameFacePx,
                            left: asymmetricMatLayout.openingX - layout.frameFacePx,
                            width: asymmetricMatLayout.openingWidth,
                            height: asymmetricMatLayout.openingHeight,
                            backgroundColor: "white",
                          }}
                        >
                          <img
                            src={displayImage}
                            alt="Preview"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        </div>
                        {matType !== "none" && plaquePositioning && (
                          <div
                            style={{
                              position: "absolute",
                              left: plaquePositioning.x,
                              top: plaquePositioning.y,
                              zIndex: 15,
                            }}
                          >
                            <BrassNameplatePreview
                              config={brassNameplateConfig}
                              scale={(layout.scale ?? 1) / 150}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground/60 text-center mt-2">
                  Sample image. Not included with purchase.
                </p>
                <div className="mt-4 p-3 bg-muted/50 rounded-md text-sm space-y-0.5">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">
                      Finished Size:{" "}
                      <span className="text-primary">
                        {formatDimension(frameWidth)}&quot; × {formatDimension(frameHeight)}&quot;
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
                    {oversizeFee > 0 && (
                      <span className="text-xs text-yellow-600 dark:text-yellow-500 font-medium">
                        (Oversize Fee Applied)
                      </span>
                    )}
                    {isTooLarge && (
                      <span className="text-xs text-red-600 dark:text-red-500 font-medium">
                        (Too Large - Contact Us)
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Artwork: {formatDimension(artW)}&quot; × {formatDimension(artH)}&quot;
                    {matType !== "none" && ` • Mat Border: ${formatDimension(matBorder)}"`}
                    {matType === "double" && ` • Reveal: ${formatDimension(matReveal)}"`}
                  </p>
                </div>
              </Card>
              <div className="hidden lg:grid lg:grid-cols-3 gap-4">
                {framePhotos.cornerUrl && (
                  <Card
                    className="p-3 cursor-pointer hover-elevate active-elevate-2"
                    onClick={() => {
                      setFullscreenImage("corner");
                      setFullImageOpen(true);
                    }}
                  >
                    <img
                      src={framePhotos.cornerUrl}
                      alt="Frame corner detail"
                      className="w-full h-40 object-cover rounded-md mb-2"
                    />
                    <p className="text-xs text-center text-muted-foreground">Corner Detail</p>
                  </Card>
                )}
                {framePhotos.profileUrl && (
                  <Card
                    className="p-3 cursor-pointer hover-elevate active-elevate-2"
                    onClick={() => {
                      setFullscreenImage("profile");
                      setFullImageOpen(true);
                    }}
                  >
                    <img
                      src={framePhotos.profileUrl}
                      alt="Frame profile view"
                      className="w-full h-40 object-cover rounded-md mb-2"
                    />
                    <p className="text-xs text-center text-muted-foreground">Profile View</p>
                  </Card>
                )}
                {framePhotos.lifestyleUrl && (
                  <Card
                    className="p-3 cursor-pointer hover-elevate active-elevate-2"
                    onClick={() => {
                      setFullscreenImage("lifestyle");
                      setFullImageOpen(true);
                    }}
                  >
                    <img
                      src={framePhotos.lifestyleUrl}
                      alt="Frame lifestyle example"
                      className="w-full h-40 object-cover rounded-md mb-2"
                    />
                    <p className="text-xs text-center text-muted-foreground">Lifestyle Example</p>
                  </Card>
                )}
              </div>
            </div>
            {/* Right Column - Controls */}
            <div className={`space-y-4 ${mobileView === "preview" ? "hidden md:block" : "block"}`}>
              <h2 ref={controlsHeadingRef} className="text-xl md:text-2xl font-semibold mb-4">
                Customize Your Certificate Frame
              </h2>
              <Accordion
                type="multiple"
                defaultValue={[
                  "certificate-size",
                  "size",
                  "frame",
                  "mat",
                  "brass-nameplate",
                  "glass",
                  "hardware",
                ]}
                className="w-full"
              >
                <AccordionItem value="certificate-size">
                  <AccordionTrigger data-testid="accordion-certificate-size">
                    Certificate/License Size
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-2 gap-2">
                      {CERTIFICATE_SIZES.map((size) => (
                        <button
                          key={size.id}
                          onClick={() => {
                            setSelectedCertificateSize(size);
                            setArtworkWidth(size.documentWidth.toString());
                            setArtworkHeight(size.documentHeight.toString());
                          }}
                          className={`p-3 rounded-md border-2 text-center hover-elevate active-elevate-2 ${selectedCertificateSize?.id === size.id ? "border-primary bg-primary/5 font-semibold" : "border-border bg-background"}`}
                          data-testid={`button-certificate-${size.id}`}
                        >
                          <p className="font-semibold text-sm">
                            {size.documentWidth}&quot; × {size.documentHeight}&quot;
                          </p>
                        </button>
                      ))}
                      <button
                        onClick={() => setSelectedCertificateSize(null)}
                        className={`p-3 rounded-md border-2 text-center hover-elevate active-elevate-2 ${!selectedCertificateSize ? "border-primary bg-primary/5 font-semibold" : "border-border bg-background"}`}
                        data-testid="button-certificate-custom"
                      >
                        <p className="font-semibold text-sm">Custom Size</p>
                      </button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                {(!selectedCertificateSize || selectedCertificateSize.id === "custom") && (
                  <AccordionItem value="size">
                    <AccordionTrigger data-testid="accordion-size">Custom Size</AccordionTrigger>
                    <AccordionContent>
                      <div className="flex gap-3">
                        <div className="flex-1 space-y-2">
                          <Label htmlFor="width">Certificate Width (inches)</Label>
                          <Input
                            id="width"
                            value={artworkWidth}
                            onChange={(e) => handleWidthChange(e.target.value)}
                            placeholder="e.g., 11 or 11 1/2"
                            className={
                              !isValidDimensions && artworkWidth ? "border-destructive" : ""
                            }
                            data-testid="input-width"
                          />
                        </div>
                        <div className="flex-1 space-y-2">
                          <Label htmlFor="height">Certificate Height (inches)</Label>
                          <Input
                            id="height"
                            value={artworkHeight}
                            onChange={(e) => setArtworkHeight(e.target.value)}
                            placeholder="e.g., 20 or 20 3/4"
                            className={
                              !isValidDimensions && artworkHeight ? "border-destructive" : ""
                            }
                            disabled={
                              serviceType === "print-and-frame" &&
                              uploadedImageAspectRatio !== null &&
                              !!selectedImage
                            }
                            data-testid="input-height"
                          />
                        </div>
                      </div>
                      {artworkSizeValidation && !artworkSizeValidation.valid && artworkWidth && (
                        <p className="text-xs text-destructive">{artworkSizeValidation.message}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Minimum 4 inches. Enter whole numbers or fractions.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                )}
                <AccordionItem value="frame">
                  <AccordionTrigger data-testid="accordion-frame">Frame Style</AccordionTrigger>
                  <AccordionContent>
                    <div className="md:max-h-[400px] md:overflow-y-auto md:pr-2">
                      <div className="grid grid-cols-2 gap-2">
                        {frameStyles.map((frame) => (
                          <button
                            key={frame.id}
                            onClick={() => setSelectedFrame(frame)}
                            className={`p-3 rounded-md border-2 text-left hover-elevate active-elevate-2 ${selectedFrame.id === frame.id ? "border-primary" : "border-transparent"}`}
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
              </Accordion>
              <Accordion
                type="multiple"
                defaultValue={["mat", "brass-nameplate", "glass", "hardware"]}
                className="w-full"
              >
                <AccordionItem value="mat">
                  <AccordionTrigger data-testid="accordion-mat">Mat Board</AccordionTrigger>
                  <AccordionContent className="space-y-4">
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
                              {(matBorder ?? 0).toFixed(2)}&quot;
                            </span>
                          </div>
                          <Slider
                            id="matBorder"
                            min={
                              brassNameplateConfig.enabled
                                ? BRASS_NAMEPLATE_SPECS.MIN_BOTTOM_BORDER
                                : 1.5
                            }
                            max={8}
                            step={0.25}
                            value={[matBorder ?? 0]}
                            onValueChange={(values) => {
                              const minBorder = brassNameplateConfig.enabled
                                ? BRASS_NAMEPLATE_SPECS.MIN_BOTTOM_BORDER
                                : 1.5;
                              const clampedValue = Math.max(values[0] ?? 0, minBorder);
                              setMatBorderWidth(clampedValue.toString());
                            }}
                            data-testid="slider-mat-border"
                          />
                          <p className="text-xs text-muted-foreground">
                            {brassNameplateConfig.enabled
                              ? `Minimum ${BRASS_NAMEPLATE_SPECS.MIN_BOTTOM_BORDER}" required for brass plaque`
                              : 'Adjust the width of the mat border (1.5" - 8")'}
                          </p>
                          {brassNameplateConfig.enabled &&
                            parseFloat(matBorderWidth) <=
                              BRASS_NAMEPLATE_SPECS.MIN_BOTTOM_BORDER && (
                              <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-500">
                                <Info className="h-3 w-3" />
                                <span>
                                  Mat border locked to {BRASS_NAMEPLATE_SPECS.MIN_BOTTOM_BORDER}
                                  &quot; minimum for plaque clearance
                                </span>
                              </div>
                            )}
                        </div>

                        <BottomWeightedMatting
                          checked={bottomWeighted}
                          onCheckedChange={setBottomWeighted}
                        />

                        <div
                          className={`space-y-3 ${matType === "double" ? "pt-4 pb-3 px-3 md:px-0 bg-muted/40 md:bg-transparent rounded-lg" : ""}`}
                        >
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
                            onSelect={(mat) => {
                              if (disabledMatIds.includes(mat.id)) {
                                toast({
                                  title: "Color Not Available",
                                  description: "This color is not available for oversize mats.",
                                  variant: "destructive",
                                });
                                return;
                              }
                              setSelectedMat(mat);
                            }}
                            disabledColors={disabledMatIds}
                            disabledTooltip="Not available for oversize mats"
                            testIdPrefix="mat"
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
                                  {(Number.isFinite(matReveal) ? matReveal : 0.25).toFixed(2)}&quot;
                                </span>
                              </div>
                              <Slider
                                id="matReveal"
                                min={0.25}
                                max={1}
                                step={0.25}
                                value={[Number.isFinite(matReveal) ? matReveal : 0.25]}
                                onValueChange={(values) =>
                                  setMatRevealWidth(String(values[0] ?? 0.25))
                                }
                                data-testid="slider-mat-reveal"
                              />
                            </div>

                            <div className="space-y-3 pt-4 pb-3 px-3 md:px-0 bg-muted/40 md:bg-transparent rounded-lg">
                              <Label className="text-base font-semibold">
                                Bottom Mat Color (Reveal): {selectedMatInner?.name ?? "White"}
                              </Label>
                              <ColorSwatchesWithSeparator
                                standardColors={standardMats}
                                premiumColors={premiumMats}
                                selectedId={selectedMatInner.id}
                                onSelect={(mat) => {
                                  if (disabledMatIds.includes(mat.id)) {
                                    toast({
                                      title: "Color Not Available",
                                      description: "This color is not available for oversize mats.",
                                      variant: "destructive",
                                    });
                                    return;
                                  }
                                  setSelectedMatInner(mat);
                                }}
                                disabledColors={disabledMatIds}
                                disabledTooltip="Not available for oversize mats"
                                testIdPrefix="mat-inner"
                              />
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </AccordionContent>
                </AccordionItem>
                {matType !== "none" && (
                  <AccordionItem value="brass-nameplate">
                    <AccordionTrigger data-testid="accordion-nameplate">
                      Brass Nameplate
                    </AccordionTrigger>
                    <AccordionContent>
                      <BrassNameplateSection
                        config={brassNameplateConfig}
                        onChange={setBrassNameplateConfig}
                      />
                    </AccordionContent>
                  </AccordionItem>
                )}
                <AccordionItem value="glass">
                  <AccordionTrigger data-testid="accordion-glass">
                    Glazing & Backing
                  </AccordionTrigger>
                  <AccordionContent>
                    <RadioGroup
                      value={selectedGlass?.id ?? glassTypes[0]?.id ?? ""}
                      onValueChange={(id) => {
                        const g = glassTypes.find((gl) => gl.id === id);
                        if (g) setSelectedGlass(g);
                      }}
                    >
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
                    </RadioGroup>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="hardware" ref={hardwareSectionRef}>
                  <AccordionTrigger data-testid="accordion-hardware">
                    Hanging Hardware
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <HangingHardwareSection
                      hardwareType={hangingHardware}
                      setHardwareType={setHangingHardware}
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
                onAddToCart={handleCheckout}
                onCopyLink={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast({ title: "Link copied!", description: "Design link copied to clipboard." });
                }}
                isProcessing={isCheckingOut}
                disabled={
                  !isValidDimensions ||
                  isTooLarge ||
                  (serviceType === "print-and-frame" && !!selectedImage && !copyrightAgreed)
                }
                priceItems={priceItems}
                warnings={warnings}
                testIdPrefix=""
              />
            </div>
          </div>
          <DiplomaLifestyleCarousel />
        </div>
      </div>
      {!hideMobileSticky && isMobile && showMobileBar && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-3 z-50 lg:hidden">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg whitespace-nowrap" data-testid="text-mobile-total">
              ${finalTotalPrice.toFixed(2)}
            </span>
            <QuantitySelector
              value={quantity}
              onChange={setQuantity}
              className="w-14 h-7 text-xs text-center p-0"
              testId="input-mobile-quantity"
            />
            <Button
              size="icon"
              variant="outline"
              onClick={handleShare}
              className="h-11 w-11"
              data-testid="button-mobile-copy-link"
            >
              <Link2 className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleCheckout}
              disabled={
                isCheckingOut ||
                !isValidDimensions ||
                isTooLarge ||
                (serviceType === "print-and-frame" && !!selectedImage && !copyrightAgreed)
              }
              className="flex-1 text-xs min-w-0 min-h-11"
              data-testid="button-mobile-add-to-cart"
            >
              {isCheckingOut ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" /> Adding...
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 mr-1" /> Add to Cart
                </>
              )}
            </Button>
          </div>
        </div>
      )}
      {!embedded && (
        <Button
          size="lg"
          className={`fixed bottom-20 right-6 z-[60] lg:hidden shadow-lg rounded-full h-14 px-6 ${showMobileBar ? "visible pointer-events-auto" : "invisible pointer-events-none"}`}
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
      <Dialog open={fullImageOpen} onOpenChange={setFullImageOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle className="flex items-center justify-between">
              <span>
                {fullscreenImage === "preview" && "Frame Preview"}
                {fullscreenImage === "corner" && "Corner Detail"}
                {fullscreenImage === "profile" && "Profile View"}
                {fullscreenImage === "lifestyle" && "Lifestyle Example"}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setFullImageOpen(false)}
                data-testid="button-close-fullscreen"
              >
                <X className="h-5 w-5" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="p-4 overflow-auto">
            {fullscreenImage === "preview" && (
              <div className="flex items-center justify-center min-h-[500px]">
                <div
                  style={{
                    width: layout.outerPx?.w ?? 0,
                    height: layout.outerPx?.h ?? 0,
                    maxWidth: "100%",
                    maxHeight: "70vh",
                    margin: "0 auto",
                  }}
                >
                  <img
                    src={displayImage}
                    alt="Preview"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              </div>
            )}
            {fullscreenImage === "corner" && framePhotos.cornerUrl && (
              <div className="flex items-center justify-center">
                <img
                  src={framePhotos.cornerUrl}
                  alt="Corner detail"
                  style={{ maxWidth: "100%", maxHeight: "70vh", objectFit: "cover" }}
                />
              </div>
            )}
            {fullscreenImage === "profile" && framePhotos.profileUrl && (
              <div className="flex items-center justify-center">
                <img
                  src={framePhotos.profileUrl}
                  alt="Profile view"
                  style={{ maxWidth: "100%", maxHeight: "70vh", objectFit: "cover" }}
                />
              </div>
            )}
            {fullscreenImage === "lifestyle" && framePhotos.lifestyleUrl && (
              <div className="flex items-center justify-center">
                <img
                  src={framePhotos.lifestyleUrl}
                  alt="Lifestyle"
                  style={{ maxWidth: "100%", maxHeight: "70vh", objectFit: "contain" }}
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      {showARViewer && (
        <ARViewer
          config={{
            serviceType,
            artworkWidth: parseFraction(artworkWidth),
            artworkHeight: parseFraction(artworkHeight),
            frameStyleId: selectedFrame.id,
            matType,
            matBorderWidth: parseFraction(matBorderWidth),
            matRevealWidth: parseFraction(matRevealWidth),
            matColorId: selectedMat.id,
            matInnerColorId: matType === "double" ? selectedMatInner.id : undefined,
            glassTypeId: selectedGlass?.id ?? glassTypes[0]?.id ?? "",
            imageUrl: displayImage,
            copyrightAgreed,
            imageFit: "cover",
          }}
          onClose={() => setShowARViewer(false)}
          onSizeUpdate={(newWidth, newHeight) => {
            setArtworkWidth(newWidth.toString());
            setArtworkHeight(newHeight.toString());
            toast({
              title: "Size Updated",
              description: `Frame size updated to ${newWidth}" × ${newHeight}" from AR preview`,
            });
          }}
        />
      )}
    </>
  );
}
