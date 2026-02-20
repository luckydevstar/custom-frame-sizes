"use client";

import { useState, useEffect, useMemo, useRef, lazy, Suspense } from "react";
// Removed wouter useLocation - not needed in Next.js
import { Maximize, X, Eye, Settings, Info, Smartphone, Copy, Flower2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Checkbox } from "../ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Input } from "../ui/input";
import { Slider } from "../ui/slider";
import { Separator } from "../ui/separator";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

// Lazy-load ARViewer so @google/model-viewer (uses `self`) is never loaded on the server
const ARViewer = lazy(() => import("../shared/ARViewer").then((m) => ({ default: m.ARViewer })));

import { PriceBox } from "../ui/PriceBox";
import { QuantitySelector } from "../ui/quantity-selector";
import type { PriceLineItem } from "../ui/PriceBox";
import { ColorSwatchesWithSeparator } from "../ui/ColorSwatches";
import { TrustBox } from "../marketing/TrustBox";
import { HangingHardwareSection } from "./shared/HangingHardwareSection";
import { BrassNameplateSection } from "../brass-nameplate/BrassNameplateSection";
import { BrassNameplatePreview } from "../brass-nameplate/BrassNameplatePreview";

// Types from @framecraft/types
import type { FrameStyle, FrameConfiguration } from "@framecraft/types";
import type { BrassNameplateConfig } from "@framecraft/types";
import { BRASS_NAMEPLATE_SPECS } from "@framecraft/types";

// Services, utils, hooks from @framecraft/core
import {
  getFramesByCategory,
  getMatColors,
  getGlassTypes,
  calculatePricing,
  parseFraction,
  validateArtworkSize,
  computePreviewLayout,
  addToCart,
  isShopifyEnabled,
  toShadowboxConfig,
  fromShadowboxConfig,
  getMatTilingStyle,
  getMatBevelColor,
  getStoreAssetUrl,
  getStoreBaseAssetUrl,
  resolveFramePhotoUrl,
  getRandomBouquetLifestyleImage,
  getBouquetLifestyleImages,
} from "@framecraft/core";

// Config from @framecraft/config
import {
  MAT_PALETTE,
  getMatsInDisplayOrder,
  getMatById,
  getMatTextureClass,
  ALL_MATS,
  type Mat,
} from "@framecraft/config";

import { useToast } from "../../hooks/use-toast";
import { useIsMobile, useMobileViewToggle } from "@framecraft/core";

// Bouquet-specific frame SKUs: Deep Black (10727), Deep White (10728), Deep Brown (10729)
const BOUQUET_FRAME_SKUS = ["10727", "10728", "10729"];
const allShadowboxFrames = getFramesByCategory("shadowbox");
const bouquetFramesRaw = allShadowboxFrames.filter((f) => BOUQUET_FRAME_SKUS.includes(f.sku ?? ""));

const bouquetFrames = bouquetFramesRaw.map((frame) => ({
  ...frame,
  name:
    frame.sku === "10727"
      ? "Deep Black Bouquet Frame"
      : frame.sku === "10728"
        ? "Deep White Bouquet Frame"
        : frame.sku === "10729"
          ? "Deep Brown Bouquet Frame"
          : frame.name,
  shortDescription:
    frame.sku === "10727"
      ? 'Matte black 2" deep frame for preserved bouquets'
      : frame.sku === "10728"
        ? 'Bright white 2" deep frame for wedding flowers'
        : frame.sku === "10729"
          ? 'Rich walnut 2" deep frame for floral preservation'
          : frame.shortDescription,
  featuredDescription:
    "Deep frame with 2 inch interior depth designed specifically for preserving and displaying wedding bouquets, dried flowers, and bridal florals. Museum-quality archival framing protects your precious blooms for decades.",
}));

const frameStyles = bouquetFrames.length === 3 ? bouquetFrames : allShadowboxFrames.slice(0, 3);
const matColors = getMatColors();
const glassTypes = getGlassTypes();

interface BouquetFrameDesignerProps {
  defaultFrameId?: string;
  embedded?: boolean;
  hideMobileSticky?: boolean;
  readonly?: boolean;
  initialConfig?: import("@framecraft/types").ShadowboxConfig | null;
  featureFlags?: import("@framecraft/types").ShadowboxFeatureFlags;
  onChange?: (config: import("@framecraft/types").ShadowboxConfig) => void;
  onSave?: (config: import("@framecraft/types").ShadowboxConfig) => void;
}

const PLYWOOD_TEXTURE_URL = getStoreAssetUrl("plywood-texture.png");

function getBackingStyles(
  selectedBacking: string,
  matPalette: typeof MAT_PALETTE,
  scale: number = 1
) {
  if (selectedBacking === "plywood") {
    return {
      backgroundColor: "#D4A574",
      backgroundImage: `url(${PLYWOOD_TEXTURE_URL})`,
      backgroundSize: "200px 200px",
      backgroundRepeat: "repeat" as const,
    };
  } else if (selectedBacking !== "none") {
    const matColor = matPalette.find((m) => m.id === selectedBacking);
    return getMatTilingStyle(matColor?.name || "", scale, matColor?.hexColor || "#F5F5F0");
  } else {
    return {
      backgroundColor: "#F5F5F0",
      backgroundImage: undefined,
      backgroundSize: undefined,
      backgroundRepeat: undefined,
    };
  }
}

function getBouquetFrameAltText(
  frameSku: string,
  viewType: "dimensional" | "corner" | "profile" | "lifestyle" | "edge"
): string {
  const frameName =
    frameSku === "10727"
      ? "Deep Black Bouquet Frame"
      : frameSku === "10728"
        ? "Deep White Bouquet Frame"
        : frameSku === "10729"
          ? "Deep Brown Bouquet Frame"
          : "Bouquet Frame";

  const viewText =
    viewType === "dimensional"
      ? "dimensional diagram"
      : viewType === "corner"
        ? "corner detail showing 1 inch moulding width and 2 inch depth perfect for preserved wedding bouquets"
        : viewType === "profile"
          ? "profile view showing deep frame construction for dried flowers"
          : viewType === "lifestyle"
            ? "lifestyle image with preserved bouquet display"
            : "edge view showing deep construction for floral preservation";

  return `${frameName} ${viewText}`;
}

export function BouquetFrameDesigner({
  defaultFrameId,
  embedded = false,
  hideMobileSticky = false,
  readonly = false,
  initialConfig = null,
  featureFlags = {},
  onChange,
  onSave,
}: BouquetFrameDesignerProps = {}) {
  void featureFlags;
  void onSave;

  const initialFrame = defaultFrameId
    ? frameStyles.find((f) => f.id === defaultFrameId) ||
      frameStyles.find((f) => f.sku === "10728") ||
      frameStyles[0]
    : frameStyles.find((f) => f.sku === "10728") || frameStyles[0];
  const [selectedFrame, setSelectedFrame] = useState<FrameStyle>(initialFrame!);
  const [selectedMat, setSelectedMat] = useState<Mat>(() => getMatById("mat-1") ?? MAT_PALETTE[0]!);
  const [selectedMatInner, setSelectedMatInner] = useState<Mat>(
    () => getMatById("mat-4") ?? MAT_PALETTE[1]!
  );
  const [selectedGlass, setSelectedGlass] = useState(() => glassTypes[0]!);
  const [matType, setMatType] = useState<"none" | "single" | "double">("single");
  const [matBorderWidth, setMatBorderWidth] = useState("2.5");
  const [matRevealWidth, setMatRevealWidth] = useState("0.25");
  const [bottomWeighted, setBottomWeighted] = useState(false);
  const [fullImageOpen, setFullImageOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [hangingHardware, setHangingHardware] = useState<"standard" | "security">("standard");
  const [brassNameplateConfig, setBrassNameplateConfig] = useState<BrassNameplateConfig>({
    enabled: false,
    line1: "",
    line2: "",
    line3: "",
    font: "georgia",
    color: "brass-black",
    includeFlag: false,
  });
  const [selectedBacking, setSelectedBacking] = useState<string>("mat-1");
  const [selectedBackingColor, setSelectedBackingColor] = useState<string | undefined>(undefined);
  const [depth, setDepth] = useState<number>(2.0);

  const [jerseyMount, setJerseyMount] = useState<
    import("@framecraft/types").ShadowboxJerseyMount | undefined
  >(undefined);
  const [accessories, setAccessories] = useState<
    import("@framecraft/types").ShadowboxAccessory[] | undefined
  >(undefined);
  const [rawMatColor, setRawMatColor] = useState<string | undefined>(undefined);
  const [rawMatInnerColor, setRawMatInnerColor] = useState<string | undefined>(undefined);
  const [unknownConfigFields, setUnknownConfigFields] = useState<Record<string, unknown>>({});

  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { mobileView, setMobileView, showMobileBar, previewCardRef, controlsHeadingRef } =
    useMobileViewToggle({ isMobile });

  const [artworkWidth, setArtworkWidth] = useState("16");
  const [artworkHeight, setArtworkHeight] = useState("20");
  const [containerSize, setContainerSize] = useState({ width: 600, height: 500 });
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const hardwareSectionRef = useRef<HTMLDivElement>(null);
  const configuratorRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const [showARViewer, setShowARViewer] = useState(false);
  const [lifestylePreviewImage, setLifestylePreviewImage] = useState(() =>
    getRandomBouquetLifestyleImage()
  );

  const [framePhotos, setFramePhotos] = useState<{
    topUrl?: string;
    bottomUrl?: string;
    leftUrl?: string;
    rightUrl?: string;
  }>({});

  const bouquetLifestyleImages = useMemo(() => getBouquetLifestyleImages(), []);

  // Load configuration from URL parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const frameId = params.get("frame");
    const width = params.get("width");
    const height = params.get("height");
    const mat = params.get("mat");
    const matColorId = params.get("matColor");
    const matInnerColorId = params.get("matInnerColor");
    const matBorder = params.get("matBorder");
    const bottomWeightedParam = params.get("bottomWeighted");
    const hardware = params.get("hardware");
    const backing = params.get("backing");

    if (!defaultFrameId && !embedded && frameId) {
      const frame = frameStyles.find((f) => f.id === frameId);
      if (frame) setSelectedFrame(frame);
    }
    if (width) setArtworkWidth(width);
    if (height) setArtworkHeight(height);
    if (mat === "none" || mat === "single" || mat === "double") setMatType(mat);
    if (matColorId) {
      const matObj = getMatById(matColorId);
      if (matObj) setSelectedMat(matObj);
    }
    if (matInnerColorId) {
      const innerMat = getMatById(matInnerColorId);
      if (innerMat) setSelectedMatInner(innerMat);
    }
    if (matBorder) setMatBorderWidth(matBorder);
    if (bottomWeightedParam === "true") setBottomWeighted(true);
    if (hardware === "standard" || hardware === "security") setHangingHardware(hardware);
    if (backing) setSelectedBacking(backing);
  }, [defaultFrameId, embedded]);

  // Load from initialConfig prop
  useEffect(() => {
    if (initialConfig) {
      const state = fromShadowboxConfig(initialConfig);
      setArtworkWidth(state.artworkWidth);
      setArtworkHeight(state.artworkHeight);
      setMatType(state.matType);
      setMatBorderWidth(state.matBorderWidth);
      setMatRevealWidth(state.matRevealWidth);
      setSelectedBacking(state.backing);
      setSelectedBackingColor(state.backingColor);
      setDepth(state.depth);
      if (state.hangingHardware) setHangingHardware(state.hangingHardware);
      if (state.jerseyMount) setJerseyMount(state.jerseyMount);
      if (state.accessories) setAccessories(state.accessories);
      if (state.rawMatColor) setRawMatColor(state.rawMatColor);
      if (state.rawMatInnerColor) setRawMatInnerColor(state.rawMatInnerColor);
      if (state.unknownFields) setUnknownConfigFields(state.unknownFields);

      const frame = frameStyles.find((f) => f.id === state.frameId);
      if (frame) setSelectedFrame(frame);

      const glass = glassTypes.find((g) => g.id === state.glassId);
      if (glass) setSelectedGlass(glass);

      if (state.matColorId) {
        const matObj = getMatById(state.matColorId);
        if (matObj) setSelectedMat(matObj);
      }
      if (state.matInnerColorId) {
        const innerMat = getMatById(state.matInnerColorId);
        if (innerMat) setSelectedMatInner(innerMat);
      }
      if (state.backing?.startsWith("#")) {
        const backingMatColor = matColors.find((m) => m.color === state.backing);
        if (backingMatColor) setSelectedBacking(backingMatColor.id);
      }
    }
  }, [initialConfig]);

  // Update URL when configuration changes
  useEffect(() => {
    if (readonly || embedded || defaultFrameId) return;
    const params = new URLSearchParams();
    params.set("frame", selectedFrame.id);
    params.set("width", artworkWidth);
    params.set("height", artworkHeight);
    params.set("mat", matType);
    if (matType !== "none") {
      params.set("matColor", selectedMat.id);
      params.set("matBorder", matBorderWidth);
      if (bottomWeighted) params.set("bottomWeighted", "true");
      else params.delete("bottomWeighted");
    }
    if (matType === "double") params.set("matInnerColor", selectedMatInner.id);
    params.set("hardware", hangingHardware);
    if (selectedBacking !== "none") params.set("backing", selectedBacking);
    const currentParams = new URLSearchParams(window.location.search);
    if (currentParams.has("readonly")) params.set("readonly", currentParams.get("readonly")!);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  }, [
    readonly,
    embedded,
    defaultFrameId,
    selectedFrame,
    artworkWidth,
    artworkHeight,
    matType,
    selectedMat,
    selectedMatInner,
    matBorderWidth,
    bottomWeighted,
    hangingHardware,
    selectedBacking,
  ]);

  // Call onChange when configuration changes
  useEffect(() => {
    if (onChange) {
      const config = toShadowboxConfig({
        artworkWidth,
        artworkHeight,
        selectedFrame,
        matType,
        selectedMat: { id: selectedMat.id, color: selectedMat.hexColor || "#FFFFFF" },
        selectedMatInner: {
          id: selectedMatInner.id,
          color: selectedMatInner.hexColor || "#FFFFFF",
        },
        matBorderWidth,
        matRevealWidth,
        selectedGlass: selectedGlass ?? glassTypes[0]!,
        selectedBacking,
        selectedBackingColor,
        hangingHardware,
        depth,
        matPalette: MAT_PALETTE.map((m) => ({
          id: m.id,
          color: m.hexColor || "#FFFFFF",
        })),
        jerseyMount,
        accessories,
        rawMatColor,
        rawMatInnerColor,
        unknownFields: unknownConfigFields,
      });
      onChange(config);
    }
  }, [
    onChange,
    artworkWidth,
    artworkHeight,
    selectedFrame,
    matType,
    selectedMat,
    selectedMatInner,
    matBorderWidth,
    matRevealWidth,
    selectedGlass,
    selectedBacking,
    selectedBackingColor,
    hangingHardware,
    depth,
    jerseyMount,
    accessories,
    rawMatColor,
    rawMatInnerColor,
    unknownConfigFields,
  ]);

  useEffect(() => {
    if (matType === "none" && bottomWeighted) setBottomWeighted(false);
  }, [matType, bottomWeighted]);

  // Fetch frame photos when frame changes
  useEffect(() => {
    async function fetchFramePhotos() {
      setFramePhotos({});
      try {
        const response = await fetch(`/api/frames/${selectedFrame.sku}/photos`);
        if (response.ok) {
          const photoSet = await response.json();
          setFramePhotos({
            topUrl: photoSet.topUrl,
            bottomUrl: photoSet.bottomUrl,
            leftUrl: photoSet.leftUrl,
            rightUrl: photoSet.rightUrl,
          });
        }
      } catch (error) {
        console.error("Failed to load frame photos:", error);
      }
    }
    fetchFramePhotos();
  }, [selectedFrame]);

  useEffect(() => {
    setLifestylePreviewImage(getRandomBouquetLifestyleImage());
  }, [selectedFrame]);

  useEffect(() => {
    const container = previewContainerRef.current;
    if (!container) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setContainerSize({ width, height });
      }
    });
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  const handleCheckout = async () => {
    if (!isValidDimensions || isTooLarge) {
      toast({
        title: "Invalid Configuration",
        description: "Please check your bouquet frame dimensions.",
        variant: "destructive",
      });
      return;
    }

    setIsCheckingOut(true);
    const frameConfig: FrameConfiguration = {
      serviceType: "frame-only",
      artworkWidth: parseFloat(artworkWidth) || 16,
      artworkHeight: parseFloat(artworkHeight) || 20,
      frameStyleId: selectedFrame.id,
      matType,
      matBorderWidth: matBorder,
      matRevealWidth: matReveal,
      matColorId: selectedMat.id,
      matInnerColorId: matType === "double" ? selectedMatInner.id : undefined,
      glassTypeId: (selectedGlass ?? glassTypes[0]!).id,
      bottomWeighted,
    };
    const pricing = calculatePricing(frameConfig);
    const totalPrice = pricing.total;
    const hardwarePrice = hangingHardware === "security" ? 8.95 : 0;
    const nameplatePrice =
      brassNameplateConfig.enabled && matType !== "none" ? BRASS_NAMEPLATE_SPECS.PRICE : 0;
    const finalTotal = totalPrice + hardwarePrice + nameplatePrice;

    try {
      await addToCart(frameConfig, finalTotal, quantity);
      if (!isShopifyEnabled()) {
        toast({
          title: "Mock Checkout Created",
          description: "Shopify is not configured. Check console for payload details.",
        });
      } else {
        toast({
          title: "Redirecting to Checkout",
          description: "Taking you to secure checkout...",
        });
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Checkout Error",
        description:
          error instanceof Error ? error.message : "Failed to create checkout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  const artWidth = parseFraction(artworkWidth);
  const artHeight = parseFraction(artworkHeight);
  const matBorder = parseFraction(matBorderWidth);
  const matReveal = parseFraction(matRevealWidth);

  const artworkSizeValidation = useMemo(() => {
    if (artWidth === 0 && artHeight === 0) return null;
    return validateArtworkSize(artWidth, artHeight);
  }, [artWidth, artHeight]);

  const standardMats = useMemo(() => {
    const deviceMats = getMatsInDisplayOrder(isMobile ? "mobile" : "desktop", true, false);
    return deviceMats.filter((mat) => {
      const frameWidth = artWidth + 2 * matBorder;
      const frameHeight = artHeight + 2 * matBorder;
      const shortSide = Math.min(frameWidth, frameHeight);
      const longSide = Math.max(frameWidth, frameHeight);
      if (shortSide > 32 || longSide > 40) return mat.sizes["40x60"] !== null;
      return mat.sizes["32x40"] !== null;
    });
  }, [isMobile, artWidth, artHeight, matBorder]);

  const premiumMats = useMemo(() => {
    const deviceMats = getMatsInDisplayOrder(isMobile ? "mobile" : "desktop", false, true);
    return deviceMats.filter((mat) => {
      const frameWidth = artWidth + 2 * matBorder;
      const frameHeight = artHeight + 2 * matBorder;
      const shortSide = Math.min(frameWidth, frameHeight);
      const longSide = Math.max(frameWidth, frameHeight);
      if (shortSide > 32 || longSide > 40) return mat.sizes["40x60"] !== null;
      return mat.sizes["32x40"] !== null;
    });
  }, [isMobile, artWidth, artHeight, matBorder]);

  const allAvailableMats = useMemo(
    () => [...standardMats, ...premiumMats],
    [standardMats, premiumMats]
  );

  useEffect(() => {
    if (!allAvailableMats.find((m) => m.id === selectedMat.id)) {
      const whiteMat = ALL_MATS.find((m) => m.id === "mat-1");
      if (whiteMat) {
        setSelectedMat(whiteMat);
        toast({
          title: "Mat color changed",
          description: `${selectedMat.name} is not available for this mat size. Switched to White.`,
          variant: "default",
        });
      }
    }
    if (matType === "double" && !allAvailableMats.find((m) => m.id === selectedMatInner.id)) {
      const ivoryMat = ALL_MATS.find((m) => m.id === "mat-4");
      if (ivoryMat) {
        setSelectedMatInner(ivoryMat);
        toast({
          title: "Inner mat color changed",
          description: `${selectedMatInner.name} is not available for this mat size. Switched to Ivory.`,
          variant: "default",
        });
      }
    }
    if (selectedBacking !== "plywood" && selectedBacking !== "none") {
      const backingMat = allAvailableMats.find((m) => m.id === selectedBacking);
      if (!backingMat) {
        const whiteMat = ALL_MATS.find((m) => m.id === "mat-1");
        if (whiteMat) {
          const previousBackingName =
            ALL_MATS.find((m) => m.id === selectedBacking)?.name || selectedBacking;
          setSelectedBacking(whiteMat.id);
          toast({
            title: "Backing color changed",
            description: `${previousBackingName} is not available for this mat size. Switched to White.`,
            variant: "default",
          });
        }
      }
    }
  }, [
    artWidth,
    artHeight,
    allAvailableMats,
    selectedMat,
    selectedMatInner,
    selectedBacking,
    matType,
    toast,
  ]);

  const isValidDimensions =
    artWidth > 0 && artHeight > 0 && (!artworkSizeValidation || artworkSizeValidation.valid);

  const frameConfig: FrameConfiguration = useMemo(
    () => ({
      serviceType: "frame-only",
      artworkWidth: artWidth,
      artworkHeight: artHeight,
      frameStyleId: selectedFrame.id,
      matType,
      matBorderWidth: matBorder,
      matRevealWidth: matReveal,
      matColorId: selectedMat.id,
      matInnerColorId: matType === "double" ? selectedMatInner.id : undefined,
      glassTypeId: (selectedGlass ?? glassTypes[0]!).id,
      bottomWeighted,
    }),
    [
      artWidth,
      artHeight,
      selectedFrame.id,
      matType,
      matBorder,
      matReveal,
      selectedMat.id,
      selectedMatInner.id,
      selectedGlass,
      bottomWeighted,
    ]
  );

  const pricing = useMemo(() => {
    if (!isValidDimensions) {
      return {
        framePrice: 0,
        matPrice: 0,
        glassPrice: 0,
        printPrice: 0,
        oversizeFee: 0,
        subtotal: 0,
        total: 0,
        isTooLarge: false,
        totalDimensions: 0,
      };
    }
    return calculatePricing(frameConfig);
  }, [frameConfig, isValidDimensions]);

  const { framePrice, matPrice, glassPrice, oversizeFee, total: totalPrice, isTooLarge } = pricing;
  const hardwarePrice = hangingHardware === "security" ? 8.95 : 0;
  const nameplatePrice =
    brassNameplateConfig.enabled && matType !== "none" ? BRASS_NAMEPLATE_SPECS.PRICE : 0;
  const finalTotalPrice = totalPrice + hardwarePrice + nameplatePrice;

  const priceItems = useMemo<PriceLineItem[]>(() => {
    const items: PriceLineItem[] = [
      { label: "Frame", amount: framePrice, testId: "text-frame-price" },
    ];
    if (matType !== "none") {
      items.push({
        label: `Mat Board (${matType})`,
        amount: matPrice,
        testId: "text-mat-price",
      });
    }
    const glass = selectedGlass ?? glassTypes[0]!;
    if (glass.id === "standard") {
      items.push({
        label: glass.name,
        amount: 0,
        isIncluded: true,
        testId: "text-glass-price",
      });
    } else if (glass.id === "none") {
      items.push({
        label: glass.name,
        amount: 0,
        isDiscount: true,
        testId: "text-glass-price",
      });
    } else {
      items.push({
        label: glass.name,
        amount: glassPrice,
        isDiscount: glassPrice < 0,
        testId: "text-glass-price",
      });
    }
    if (oversizeFee > 0) {
      items.push({
        label: "Oversize Fee",
        amount: oversizeFee,
        testId: "text-oversize-fee",
      });
    }
    if (hardwarePrice > 0) {
      items.push({
        label: "Security Hardware Kit",
        amount: hardwarePrice,
        testId: "text-hardware-price",
      });
    }
    if (nameplatePrice > 0) {
      items.push({
        label: "Brass Nameplate",
        amount: nameplatePrice,
        testId: "text-nameplate-price",
      });
    }
    return items;
  }, [
    framePrice,
    matType,
    matPrice,
    selectedGlass,
    glassPrice,
    oversizeFee,
    hardwarePrice,
    nameplatePrice,
  ]);

  const priceWarnings = useMemo(() => {
    const warnings: React.ReactNode[] = [];
    if (oversizeFee > 0) {
      warnings.push(
        <div
          key="oversize"
          className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-md p-3 text-sm text-yellow-800 dark:text-yellow-200"
          data-testid="warning-oversize"
        >
          The overall dimensions of your frame are oversized and will incur an oversize fee
        </div>
      );
    }
    if (isTooLarge) {
      warnings.push(
        <div
          key="too-large"
          className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md p-3 text-sm text-red-800 dark:text-red-200"
          data-testid="warning-too-large"
        >
          This frame is too large for online ordering – please contact us to discuss your project
        </div>
      );
    }
    return warnings;
  }, [oversizeFee, isTooLarge]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied!",
      description: "Design link copied to clipboard",
    });
  };

  const effectiveMatBorder = matType === "none" ? 0 : matBorder;
  const matOverlap = matType !== "none" ? 0.5 : 0;
  const matRevealAddition = matType === "double" ? matReveal * 2 : 0;
  const bottomWeightedExtra = bottomWeighted ? 0.5 : 0;
  const frameWidth = isValidDimensions
    ? artWidth +
      effectiveMatBorder * 2 +
      (selectedFrame.mouldingWidth ?? 1) * 2 -
      matOverlap +
      matRevealAddition
    : 0;
  const frameHeight = isValidDimensions
    ? artHeight +
      effectiveMatBorder * 2 +
      bottomWeightedExtra +
      (selectedFrame.mouldingWidth ?? 1) * 2 -
      matOverlap +
      matRevealAddition
    : 0;
  const layout = useMemo(() => {
    const effMatBorder = matType === "none" ? 0 : matBorder;
    const bottomExtra = bottomWeighted ? 0.5 : 0;
    return computePreviewLayout({
      artW: artWidth,
      artH: artHeight,
      matBorderTop: effMatBorder,
      matBorderRight: effMatBorder,
      matBorderBottom: effMatBorder + bottomExtra,
      matBorderLeft: effMatBorder,
      frameFace: selectedFrame.mouldingWidth ?? 1,
      containerWpx: containerSize.width,
      containerHpx: containerSize.height,
      paddingPx: 12,
    });
  }, [
    artWidth,
    artHeight,
    matBorder,
    bottomWeighted,
    matType,
    selectedFrame.mouldingWidth,
    containerSize,
  ]);

  const nameplatePosition = useMemo(() => {
    if (!brassNameplateConfig.enabled || matType === "none") return null;
    const targetNameplateWidthInches = 2.5;
    const nameplateScale =
      (layout.scale * targetNameplateWidthInches) /
      ((BRASS_NAMEPLATE_SPECS.NAMEPLATE_WIDTH * 150) / 96);
    return {
      scale: Math.max(0.3, Math.min(2.5, nameplateScale)),
    };
  }, [brassNameplateConfig.enabled, matType, layout]);

  const getMatTextureClassLocal = (_mat: Mat) => "mat-texture-standard";

  return (
    <>
      <div ref={sentinelRef} className="h-px" aria-hidden="true" />
      <div
        ref={configuratorRef}
        className="grid grid-cols-1 lg:grid-cols-[1.5fr,1fr] gap-6 pb-24 md:pb-12"
      >
        <Card
          ref={previewCardRef}
          className={`p-4 md:p-6 lg:sticky lg:top-24 lg:self-start ${mobileView === "controls" ? "hidden lg:block" : ""}`}
        >
          <div className="mb-3 flex justify-center md:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowARViewer(true)}
              disabled={readonly || !isValidDimensions || isTooLarge}
              className="h-8 text-sm px-4"
              data-testid="button-view-ar-bouquet-frame"
            >
              <Smartphone className="h-3.5 w-3.5 mr-2" />
              View on My Wall
            </Button>
          </div>

          <div
            ref={previewContainerRef}
            className="preview-wrap min-h-[400px] md:min-h-[500px] bg-muted rounded-md flex items-center justify-center relative group"
          >
            <div className="absolute top-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setFullImageOpen(true)}
                className="bg-background/90 hover:bg-background p-2 rounded-md shadow-lg hover-elevate active-elevate-2"
                data-testid="button-expand-preview"
                disabled={readonly}
              >
                <Maximize className="h-5 w-5" />
              </button>
            </div>

            {framePhotos.topUrl &&
            framePhotos.bottomUrl &&
            framePhotos.leftUrl &&
            framePhotos.rightUrl ? (
              <div
                className="preview-stage"
                style={{
                  width: `${layout.outerPx.w}px`,
                  height: `${layout.outerPx.h}px`,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: `${layout.frameFacePx}px`,
                    backgroundImage: `url(${resolveFramePhotoUrl(framePhotos.topUrl)})`,
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
                    height: `${layout.frameFacePx}px`,
                    backgroundImage: `url(${resolveFramePhotoUrl(framePhotos.bottomUrl)})`,
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
                    width: `${layout.frameFacePx}px`,
                    backgroundImage: `url(${resolveFramePhotoUrl(framePhotos.leftUrl)})`,
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
                    width: `${layout.frameFacePx}px`,
                    backgroundImage: `url(${resolveFramePhotoUrl(framePhotos.rightUrl)})`,
                    backgroundSize: "100% auto",
                    backgroundRepeat: "repeat-y",
                    backgroundPosition: "center top",
                    clipPath: `polygon(0 ${layout.frameFacePx}px, 100% 0, 100% 100%, 0 calc(100% - ${layout.frameFacePx}px))`,
                    boxShadow: "-2px 0 8px rgba(0,0,0,0.15)",
                  }}
                />
                <div
                  key={`preview-${selectedFrame.id}-${matType}-${selectedMat.id}-${selectedMatInner.id}-${selectedBacking}`}
                  className={matType !== "none" ? getMatTextureClassLocal(selectedMat) : ""}
                  style={{
                    position: "absolute",
                    top: `${layout.frameFacePx}px`,
                    left: `${layout.frameFacePx}px`,
                    right: `${layout.frameFacePx}px`,
                    bottom: `${layout.frameFacePx}px`,
                    boxShadow: "inset 0 0 20px rgba(0,0,0,0.3), inset 0 1px 3px rgba(0,0,0,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    ...(matType !== "none"
                      ? getMatTilingStyle(selectedMat.name, layout.scale, selectedMat.hexColor)
                      : selectedBacking !== "none"
                        ? getBackingStyles(selectedBacking, MAT_PALETTE, layout.scale)
                        : { backgroundColor: "#F5F5F0" }),
                    padding:
                      matType !== "none"
                        ? `${layout.matTopPx}px ${layout.matRightPx}px ${layout.matBottomPx}px ${layout.matLeftPx}px`
                        : "0",
                    transition: "background-color 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
                  }}
                  data-testid="preview-frame"
                >
                  {matType === "double" ? (
                    <div
                      className={getMatTextureClassLocal(selectedMatInner)}
                      style={{
                        width: `${layout.openingPx.w + matReveal * 2 * layout.scale}px`,
                        height: `${layout.openingPx.h + matReveal * 2 * layout.scale}px`,
                        padding: `${matReveal * layout.scale}px`,
                        ...getMatTilingStyle(
                          selectedMatInner.name,
                          layout.scale,
                          selectedMatInner.hexColor
                        ),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: `${Math.max(1.5, layout.scale * 0.06)}px solid #E0E0E0`,
                        transition: "background-color 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
                        position: "relative",
                      }}
                    >
                      <div
                        className={
                          selectedBacking !== "none" && selectedBacking !== "plywood"
                            ? getMatTextureClass(MAT_PALETTE.find((m) => m.id === selectedBacking))
                            : ""
                        }
                        style={{
                          position: "absolute",
                          top: `${matReveal * layout.scale + Math.max(1, layout.scale * 0.1)}px`,
                          left: `${matReveal * layout.scale + Math.max(1, layout.scale * 0.1)}px`,
                          right: `${matReveal * layout.scale + Math.max(1, layout.scale * 0.1)}px`,
                          bottom: `${matReveal * layout.scale + Math.max(1, layout.scale * 0.1)}px`,
                          ...getBackingStyles(selectedBacking, MAT_PALETTE, layout.scale),
                          boxShadow: `inset 0 0 0 ${Math.max(1, layout.scale * 0.1)}px ${getMatBevelColor(selectedMatInner.name)}, inset 0 4px 12px rgba(0,0,0,0.3), inset 0 1px 4px rgba(0,0,0,0.2)`,
                          transition: "background-color 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Flower2 className="w-20 h-20 text-muted-foreground/30" />
                      </div>
                    </div>
                  ) : matType === "single" ? (
                    <div
                      className={
                        selectedBacking !== "none" && selectedBacking !== "plywood"
                          ? getMatTextureClass(MAT_PALETTE.find((m) => m.id === selectedBacking))
                          : ""
                      }
                      style={{
                        width: `${layout.openingPx.w}px`,
                        height: `${layout.openingPx.h}px`,
                        ...getBackingStyles(selectedBacking, MAT_PALETTE, layout.scale),
                        boxShadow: `inset 0 0 0 ${Math.max(1, layout.scale * 0.1)}px ${getMatBevelColor(selectedMat.name)}, inset 0 4px 12px rgba(0,0,0,0.3), inset 0 1px 4px rgba(0,0,0,0.2)`,
                        transition: "background-color 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Flower2 className="w-20 h-20 text-muted-foreground/30" />
                    </div>
                  ) : (
                    <div
                      className={
                        selectedBacking !== "none" && selectedBacking !== "plywood"
                          ? getMatTextureClass(MAT_PALETTE.find((m) => m.id === selectedBacking))
                          : ""
                      }
                      style={{
                        width: `${layout.openingPx.w}px`,
                        height: `${layout.openingPx.h}px`,
                        ...getBackingStyles(selectedBacking, MAT_PALETTE, layout.scale),
                        boxShadow:
                          "inset 0 4px 12px rgba(0,0,0,0.3), inset 0 1px 4px rgba(0,0,0,0.2)",
                        transition: "background-color 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Flower2 className="w-20 h-20 text-muted-foreground/30" />
                    </div>
                  )}
                  {nameplatePosition && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: `${layout.matBottomPx * 0.35}px`,
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 10,
                      }}
                    >
                      <BrassNameplatePreview
                        config={brassNameplateConfig}
                        scale={nameplatePosition.scale}
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div
                className="preview-stage"
                style={{
                  width: `${layout.outerPx.w}px`,
                  height: `${layout.outerPx.h}px`,
                }}
              >
                <div
                  key={`preview-${selectedFrame.id}-${matType}-${selectedMat.id}-${selectedMatInner.id}-${selectedBacking}`}
                  className={matType !== "none" ? getMatTextureClassLocal(selectedMat) : ""}
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    borderTop: `${layout.frameFacePx}px solid ${selectedFrame.borderColor}`,
                    borderLeft: `${layout.frameFacePx}px solid ${selectedFrame.borderColor}`,
                    borderRight: `${layout.frameFacePx}px solid ${selectedFrame.color}`,
                    borderBottom: `${layout.frameFacePx}px solid ${selectedFrame.color}`,
                    boxShadow:
                      "inset 0 0 20px rgba(0,0,0,0.3), inset 0 1px 3px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    ...(matType !== "none"
                      ? getMatTilingStyle(selectedMat.name, layout.scale, selectedMat.hexColor)
                      : selectedBacking !== "none"
                        ? getBackingStyles(selectedBacking, MAT_PALETTE, layout.scale)
                        : { backgroundColor: "#F5F5F0" }),
                    padding:
                      matType !== "none"
                        ? `${layout.matTopPx}px ${layout.matRightPx}px ${layout.matBottomPx}px ${layout.matLeftPx}px`
                        : "0",
                    transition:
                      "border-color 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0), background-color 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
                  }}
                  data-testid="preview-frame"
                >
                  {matType === "double" ? (
                    <div
                      className={getMatTextureClassLocal(selectedMatInner)}
                      style={{
                        width: `${layout.openingPx.w + matReveal * 2 * layout.scale}px`,
                        height: `${layout.openingPx.h + matReveal * 2 * layout.scale}px`,
                        padding: `${matReveal * layout.scale}px`,
                        ...getMatTilingStyle(
                          selectedMatInner.name,
                          layout.scale,
                          selectedMatInner.hexColor
                        ),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: `${Math.max(1.5, layout.scale * 0.06)}px solid #E0E0E0`,
                        position: "relative",
                      }}
                    >
                      <div
                        className={
                          selectedBacking !== "none" && selectedBacking !== "plywood"
                            ? getMatTextureClass(MAT_PALETTE.find((m) => m.id === selectedBacking))
                            : ""
                        }
                        style={{
                          position: "absolute",
                          top: `${matReveal * layout.scale + Math.max(1, layout.scale * 0.1)}px`,
                          left: `${matReveal * layout.scale + Math.max(1, layout.scale * 0.1)}px`,
                          right: `${matReveal * layout.scale + Math.max(1, layout.scale * 0.1)}px`,
                          bottom: `${matReveal * layout.scale + Math.max(1, layout.scale * 0.1)}px`,
                          ...getBackingStyles(selectedBacking, MAT_PALETTE, layout.scale),
                          boxShadow: `inset 0 0 0 ${Math.max(1, layout.scale * 0.1)}px ${getMatBevelColor(selectedMatInner.name)}, inset 0 4px 12px rgba(0,0,0,0.3), inset 0 1px 4px rgba(0,0,0,0.2)`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Flower2 className="w-20 h-20 text-muted-foreground/30" />
                      </div>
                    </div>
                  ) : matType === "single" ? (
                    <div
                      className={
                        selectedBacking !== "none" && selectedBacking !== "plywood"
                          ? getMatTextureClass(MAT_PALETTE.find((m) => m.id === selectedBacking))
                          : ""
                      }
                      style={{
                        width: `${layout.openingPx.w}px`,
                        height: `${layout.openingPx.h}px`,
                        ...getBackingStyles(selectedBacking, MAT_PALETTE, layout.scale),
                        boxShadow: `inset 0 0 0 ${Math.max(1, layout.scale * 0.1)}px ${getMatBevelColor(selectedMat.name)}, inset 0 4px 12px rgba(0,0,0,0.3), inset 0 1px 4px rgba(0,0,0,0.2)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Flower2 className="w-20 h-20 text-muted-foreground/30" />
                    </div>
                  ) : (
                    <div
                      className={
                        selectedBacking !== "none" && selectedBacking !== "plywood"
                          ? getMatTextureClass(MAT_PALETTE.find((m) => m.id === selectedBacking))
                          : ""
                      }
                      style={{
                        width: `${layout.openingPx.w}px`,
                        height: `${layout.openingPx.h}px`,
                        ...getBackingStyles(selectedBacking, MAT_PALETTE, layout.scale),
                        boxShadow:
                          "inset 0 4px 12px rgba(0,0,0,0.3), inset 0 1px 4px rgba(0,0,0,0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Flower2 className="w-20 h-20 text-muted-foreground/30" />
                    </div>
                  )}
                  {nameplatePosition && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: `${layout.matBottomPx * 0.35}px`,
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 10,
                      }}
                    >
                      <BrassNameplatePreview
                        config={brassNameplateConfig}
                        scale={nameplatePosition.scale}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 p-3 bg-muted/50 rounded-md text-sm space-y-1">
            <div className="flex items-center gap-2">
              <p className="font-medium">
                Finished Size:{" "}
                <span className="text-muted-foreground">
                  {frameWidth.toFixed(2)}&quot; × {frameHeight.toFixed(2)}&quot;
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
                  <TooltipContent side="right" className="p-0 border-0 bg-transparent shadow-lg">
                    <img
                      src={selectedFrame.dimensionalDiagram}
                      alt={getBouquetFrameAltText(selectedFrame.sku ?? "", "dimensional")}
                      className="w-64 rounded-lg border-2 border-border bg-background"
                      data-testid="img-dimensional-diagram"
                    />
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            <div className="flex items-center gap-2">
              <p className="font-medium">
                Usable Interior:{" "}
                <span className="text-muted-foreground">
                  {(artWidth - 0.25).toFixed(2)}&quot; × {(artHeight - 0.25).toFixed(2)}&quot; ×{" "}
                  {selectedFrame.usableDepth}
                </span>
              </p>
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <button
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    data-testid="button-usable-interior-info"
                  >
                    <Info className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">
                    Actual space for your preserved bouquet due to frame spacers
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          <div className="mt-4">
            <div className="grid grid-cols-3 gap-2">
              {(() => {
                const cornerImage = selectedFrame.alternateImages?.find(
                  (img: { type: string; url: string }) =>
                    img.type === "corner" &&
                    (img.url.includes("corner_a") || img.url.includes("corner-a"))
                );
                return cornerImage ? (
                  <div className="aspect-square rounded-md border overflow-hidden bg-background">
                    <img
                      src={getStoreBaseAssetUrl(
                        cornerImage.url.startsWith("/") ? cornerImage.url.slice(1) : cornerImage.url
                      )}
                      alt={getBouquetFrameAltText(selectedFrame.sku ?? "", "corner")}
                      className="w-full h-full object-cover"
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
              {(() => {
                const profileImage = selectedFrame.alternateImages?.find(
                  (img: { type: string; url: string }) =>
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
                      alt={getBouquetFrameAltText(selectedFrame.sku ?? "", "profile")}
                      className="w-full h-full object-cover"
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
              <div className="aspect-square rounded-md border overflow-hidden bg-background">
                <img
                  src={lifestylePreviewImage.url}
                  alt={lifestylePreviewImage.alt}
                  className="w-full h-full object-cover"
                  data-testid="img-lifestyle-preview"
                />
              </div>
            </div>
          </div>

          <TrustBox />

          <div className="mt-4 p-3 bg-muted/50 rounded-md text-sm space-y-0.5">
            <div className="flex items-center gap-2">
              <p className="font-medium">
                Finished Size:{" "}
                <span className="text-primary">
                  {frameWidth.toFixed(2)}&quot; × {frameHeight.toFixed(2)}&quot;
                </span>
              </p>
              {selectedFrame.dimensionalDiagram && (
                <TooltipProvider>
                  <Tooltip delayDuration={200}>
                    <TooltipTrigger asChild>
                      <button
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        data-testid="button-dimensional-diagram"
                      >
                        <Info className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-[300px] p-0">
                      <img
                        src={getStoreBaseAssetUrl(
                          selectedFrame.dimensionalDiagram.startsWith("/")
                            ? selectedFrame.dimensionalDiagram.slice(1)
                            : selectedFrame.dimensionalDiagram
                        )}
                        alt="Frame dimensional diagram"
                        className="w-full h-auto"
                      />
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <p className="text-muted-foreground text-xs">
              Interior: {artWidth.toFixed(2)}&quot; × {artHeight.toFixed(2)}&quot; ×{" "}
              {selectedFrame.usableDepth}
              {matType !== "none" && ` • Mat Border: ${matBorder}\u0022`}
            </p>
          </div>
        </Card>

        <div className={`space-y-3 ${mobileView === "preview" ? "hidden lg:block" : ""}`}>
          <h2 ref={controlsHeadingRef} className="text-2xl font-bold mb-2 lg:hidden">
            Design Your Perfect Bouquet Frame
          </h2>

          <Accordion
            type="multiple"
            defaultValue={["size", "bouquet-frame", "mat", "backing", "glass", "hardware"]}
            className="w-full"
          >
            <AccordionItem value="size">
              <AccordionTrigger data-testid="accordion-size">Custom Size</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div className="flex items-end gap-4">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="width">Display Area Width (inches)</Label>
                    <Input
                      id="width"
                      value={artworkWidth}
                      onChange={(e) => setArtworkWidth(e.target.value)}
                      placeholder="e.g., 16 or 16 1/2"
                      className={!isValidDimensions && artworkWidth ? "border-destructive" : ""}
                      data-testid="input-width"
                      disabled={readonly}
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="height">Display Area Height (inches)</Label>
                    <Input
                      id="height"
                      value={artworkHeight}
                      onChange={(e) => setArtworkHeight(e.target.value)}
                      placeholder="e.g., 20 or 20 3/4"
                      className={!isValidDimensions && artworkHeight ? "border-destructive" : ""}
                      data-testid="input-height"
                      disabled={readonly}
                    />
                  </div>
                </div>
                {artworkSizeValidation && !artworkSizeValidation.valid && artworkWidth && (
                  <p className="text-xs text-destructive">{artworkSizeValidation.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Min 4&quot;. Decimals or fractions accepted (e.g., 16.5 or 16 1/2)
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="bouquet-frame">
              <AccordionTrigger data-testid="accordion-bouquet-frame">
                Frame Finish
              </AccordionTrigger>
              <AccordionContent>
                <div className="mb-3 p-2.5 bg-muted/50 rounded-md text-xs text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Moulding Width:</strong> The width of the
                    frame
                  </p>
                  <p className="mt-1">
                    <strong className="text-foreground">Usable Depth:</strong> The depth inside the
                    frame
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {frameStyles.map((frame) => (
                    <button
                      key={frame.id}
                      onClick={() => setSelectedFrame(frame)}
                      className={`p-2 rounded-lg border-2 transition-all hover-elevate active-elevate-2 ${
                        selectedFrame.id === frame.id
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card"
                      }`}
                      data-testid={`button-frame-${frame.id}`}
                      disabled={readonly}
                    >
                      {frame.thumbnail ? (
                        <div className="w-full aspect-square rounded mb-1.5 overflow-hidden border">
                          <img
                            src={getStoreBaseAssetUrl(
                              frame.thumbnail.startsWith("/")
                                ? frame.thumbnail.slice(1)
                                : frame.thumbnail
                            )}
                            alt={getBouquetFrameAltText(frame.sku ?? "", "edge")}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div
                          className="w-full aspect-square rounded mb-1.5 border"
                          style={{
                            background: `linear-gradient(135deg, ${frame.color} 0%, ${frame.borderColor} 100%)`,
                          }}
                        />
                      )}
                      <p className="text-xs font-medium text-center leading-tight">
                        {frame.name.replace("Deep ", "").replace(" Bouquet Frame", "")}
                      </p>
                    </button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="backing">
              <AccordionTrigger data-testid="accordion-backing">Backing</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div className="space-y-3">
                  <Label>
                    Backing Selection:{" "}
                    {selectedBacking === "plywood"
                      ? "Plywood Backing"
                      : MAT_PALETTE.find((m) => m.id === selectedBacking)?.name || "White"}
                  </Label>
                  <ColorSwatchesWithSeparator
                    standardColors={standardMats}
                    premiumColors={premiumMats}
                    selectedId={selectedBacking}
                    onSelect={(mat) => setSelectedBacking(mat.id)}
                    testIdPrefix="backing"
                    disabled={readonly}
                  />
                  <div className="pt-2">
                    <button
                      onClick={() => setSelectedBacking("plywood")}
                      className={`w-full p-3 rounded-md border-2 hover-elevate active-elevate-2 text-sm font-medium ${
                        selectedBacking === "plywood"
                          ? "border-primary bg-primary/5"
                          : "border-border"
                      }`}
                      data-testid="button-backing-plywood"
                      disabled={readonly}
                    >
                      Plywood Backing
                    </button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="mat">
              <AccordionTrigger data-testid="accordion-mat">Mat Board</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    type="button"
                    variant={matType === "none" ? "default" : "outline"}
                    onClick={() => setMatType("none")}
                    data-testid="button-mat-none"
                    disabled={readonly}
                  >
                    <span className="font-semibold">No Mat</span>
                  </Button>
                  <Button
                    type="button"
                    variant={matType === "single" ? "default" : "outline"}
                    onClick={() => setMatType("single")}
                    data-testid="button-mat-single"
                    disabled={readonly}
                  >
                    <span className="font-semibold">Single Mat</span>
                  </Button>
                  <Button
                    type="button"
                    variant={matType === "double" ? "default" : "outline"}
                    onClick={() => setMatType("double")}
                    data-testid="button-mat-double"
                    disabled={readonly}
                  >
                    <span className="font-semibold">Double Mat</span>
                  </Button>
                </div>

                {matType !== "none" && (
                  <>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="matBorder">Mat Border Width</Label>
                        <span className="text-sm font-medium" data-testid="text-mat-border-value">
                          {matBorder.toFixed(2)}&quot;
                        </span>
                      </div>
                      <Slider
                        id="matBorder"
                        min={1.5}
                        max={8}
                        step={0.25}
                        value={[matBorder]}
                        onValueChange={(values) => setMatBorderWidth((values[0] ?? 0).toString())}
                        data-testid="slider-mat-border"
                        disabled={readonly}
                      />
                      <p className="text-xs text-muted-foreground">
                        Border on each side of the artwork
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="bottom-weighted"
                        checked={bottomWeighted}
                        onCheckedChange={(checked) => setBottomWeighted(checked === true)}
                        data-testid="checkbox-bottom-weighted"
                        disabled={readonly}
                      />
                      <div className="flex items-center gap-1.5">
                        <Label htmlFor="bottom-weighted" className="cursor-pointer font-normal">
                          Bottom-Weighted Mat
                        </Label>
                        <TooltipProvider delayDuration={100}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="inline-flex">
                                <Info className="h-3.5 w-3.5 text-muted-foreground" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-[280px]">
                              <p className="text-xs leading-relaxed">
                                Professional standard: Adds 0.5&quot; to bottom border for visual
                                balance
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>

                    <div
                      className={`space-y-3 ${matType === "double" ? "pt-4 pb-3 px-3 md:px-0 bg-muted/40 md:bg-transparent rounded-lg" : ""}`}
                    >
                      {matType === "double" ? (
                        <Label className="text-base font-semibold">
                          Top Mat: {selectedMat.name}
                        </Label>
                      ) : (
                        <Label>Mat: {selectedMat.name}</Label>
                      )}
                      <ColorSwatchesWithSeparator
                        standardColors={standardMats}
                        premiumColors={premiumMats}
                        selectedId={selectedMat.id}
                        onSelect={(mat) => setSelectedMat(mat)}
                        testIdPrefix="mat"
                        disabled={readonly}
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
                              setMatRevealWidth((values[0] ?? 0).toString())
                            }
                            data-testid="slider-mat-reveal"
                            disabled={readonly}
                          />
                          <p className="text-xs text-muted-foreground">
                            The reveal is the inner mat border visible around the artwork
                          </p>
                        </div>
                        <div className="space-y-3 pt-4 pb-3 px-3 md:px-0 bg-muted/40 md:bg-transparent rounded-lg">
                          <Label className="text-base font-semibold">
                            Accent Mat: {selectedMatInner.name}
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            Thin border mat visible around the opening
                          </p>
                          <ColorSwatchesWithSeparator
                            standardColors={standardMats}
                            premiumColors={premiumMats}
                            selectedId={selectedMatInner.id}
                            onSelect={(mat) => setSelectedMatInner(mat)}
                            testIdPrefix="mat-inner"
                            disabled={readonly}
                          />
                        </div>
                      </>
                    )}
                  </>
                )}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="glass">
              <AccordionTrigger data-testid="accordion-glass">Glazing</AccordionTrigger>
              <AccordionContent>
                <RadioGroup
                  value={selectedGlass.id}
                  onValueChange={(id) => setSelectedGlass(glassTypes.find((g) => g.id === id)!)}
                  disabled={readonly}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {glassTypes
                      .filter((g) => g.id === "standard" || g.id === "none")
                      .map((glass) => (
                        <div key={glass.id} className="flex items-center space-x-2 py-2">
                          <RadioGroupItem
                            value={glass.id}
                            id={glass.id}
                            data-testid={`radio-glass-${glass.id}`}
                            disabled={readonly}
                          />
                          <Label htmlFor={glass.id}>{glass.name}</Label>
                        </div>
                      ))}
                  </div>
                </RadioGroup>
                <p className="text-xs text-muted-foreground mt-4">
                  Foam core board backing included.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="hardware" ref={hardwareSectionRef}>
              <AccordionTrigger data-testid="accordion-hardware">Hanging Hardware</AccordionTrigger>
              <AccordionContent className="pt-4 pb-6">
                <HangingHardwareSection
                  hardwareType={hangingHardware}
                  setHardwareType={setHangingHardware}
                  frameWidth={frameWidth}
                  frameHeight={frameHeight}
                />
              </AccordionContent>
            </AccordionItem>

            {matType !== "none" && (
              <AccordionItem value="nameplate">
                <AccordionTrigger data-testid="accordion-nameplate">
                  Personalized Nameplate
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-6">
                  <BrassNameplateSection
                    config={brassNameplateConfig}
                    onChange={setBrassNameplateConfig}
                    embedded={true}
                  />
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>

          <PriceBox
            totalPrice={finalTotalPrice}
            quantity={quantity}
            onQuantityChange={setQuantity}
            onAddToCart={handleCheckout}
            onCopyLink={handleCopyLink}
            isProcessing={isCheckingOut}
            disabled={readonly || !isValidDimensions || isTooLarge}
            priceItems={priceItems}
            warnings={priceWarnings}
            testIdPrefix=""
          />

          <Card className="p-4">
            <h3 className="font-semibold mb-2">{selectedFrame.name} Bouquet Frame</h3>
            {selectedFrame.shortDescription && (
              <p className="text-sm text-muted-foreground italic mb-2">
                {selectedFrame.shortDescription}
              </p>
            )}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {selectedFrame.featuredDescription ||
                selectedFrame.shortDescription ||
                "Deep bouquet frame with customizable dimensions for displaying your preserved wedding flowers and dried bouquets."}
            </p>
          </Card>
        </div>
      </div>

      <Dialog open={fullImageOpen} onOpenChange={setFullImageOpen}>
        <DialogContent
          className="max-w-[95vw] max-h-[95vh] p-0"
          aria-describedby="frame-preview-description"
        >
          <DialogTitle className="sr-only">Full Frame Preview</DialogTitle>
          <div
            className="relative w-full h-full flex items-center justify-center bg-background p-8"
            id="frame-preview-description"
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10"
              onClick={() => setFullImageOpen(false)}
              data-testid="button-close-full-image"
              aria-label="Close preview"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </Button>
            {isValidDimensions && (
              <div
                style={{
                  width: `${layout.outerPx.w * 2}px`,
                  height: `${layout.outerPx.h * 2}px`,
                  transform: "scale(1.5)",
                  transformOrigin: "center",
                }}
                data-testid="dialog-frame-preview"
              >
                {/* Simplified fullscreen preview - reuse main preview layout scaled up */}
                <div
                  style={{
                    width: `${layout.outerPx.w}px`,
                    height: `${layout.outerPx.h}px`,
                    borderTop: `${layout.frameFacePx}px solid ${selectedFrame.borderColor}`,
                    borderLeft: `${layout.frameFacePx}px solid ${selectedFrame.borderColor}`,
                    borderRight: `${layout.frameFacePx}px solid ${selectedFrame.color}`,
                    borderBottom: `${layout.frameFacePx}px solid ${selectedFrame.color}`,
                    boxShadow: "inset 0 0 20px rgba(0,0,0,0.3), 0 8px 32px rgba(0,0,0,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    ...(matType !== "none"
                      ? getMatTilingStyle(
                          selectedMat.name,
                          layout.scale * 1.5,
                          selectedMat.hexColor
                        )
                      : getBackingStyles(selectedBacking, MAT_PALETTE, layout.scale * 1.5)),
                    padding:
                      matType !== "none"
                        ? `${layout.matTopPx}px ${layout.matRightPx}px ${layout.matBottomPx}px ${layout.matLeftPx}px`
                        : "0",
                  }}
                >
                  <Flower2 className="w-32 h-32 text-muted-foreground/30" />
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {!hideMobileSticky && (
        <div
          className={`block md:hidden fixed left-0 right-0 bottom-0 bg-background/95 backdrop-blur-sm border-t border-border shadow-lg z-50 transition-all duration-300 ease-in-out ${
            showMobileBar
              ? "translate-y-0 opacity-100"
              : "translate-y-full opacity-0 pointer-events-none"
          }`}
        >
          <div className="px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex flex-col gap-0.5 min-w-[60px]">
                <span className="text-xs text-muted-foreground">Total</span>
                <span className="font-bold text-sm" data-testid="text-mobile-sticky-total-price">
                  ${(finalTotalPrice * quantity).toFixed(2)}
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
                  testId="input-quantity-sticky"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyLink}
                data-testid="button-mobile-copy-link"
                className="h-11 w-11"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                size="default"
                onClick={handleCheckout}
                disabled={readonly || !isValidDimensions || isTooLarge || isCheckingOut}
                data-testid="button-mobile-add-to-cart"
                className="flex-1 text-xs min-w-0 min-h-11"
              >
                {isCheckingOut ? "Adding..." : "Add to Cart"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {!hideMobileSticky && (
        <Button
          size="lg"
          className={`fixed bottom-20 right-6 z-[60] lg:hidden shadow-lg rounded-full h-14 px-6 transition-all duration-300 ${
            showMobileBar
              ? "translate-y-0 opacity-100"
              : "translate-y-32 opacity-0 pointer-events-none"
          }`}
          onClick={() => setMobileView(mobileView === "preview" ? "controls" : "preview")}
          data-testid="button-toggle-mobile-view"
          disabled={readonly}
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

      {showARViewer && (
        <Suspense fallback={<div>Loading AR...</div>}>
          <ARViewer
            config={{
              serviceType: "frame-only",
              artworkWidth: parseFloat(artworkWidth) || 16,
              artworkHeight: parseFloat(artworkHeight) || 20,
              frameStyleId: selectedFrame.id,
              matType,
              matBorderWidth: matBorder,
              matRevealWidth: matReveal,
              matColorId: selectedMat.id,
              matInnerColorId: matType === "double" ? selectedMatInner.id : undefined,
              glassTypeId: (selectedGlass ?? glassTypes[0]!).id,
              bottomWeighted,
            }}
            onClose={() => setShowARViewer(false)}
            onSizeUpdate={(newWidth, newHeight) => {
              setArtworkWidth(newWidth.toString());
              setArtworkHeight(newHeight.toString());
              toast({
                title: "Size Updated",
                description: `Bouquet frame size updated to ${newWidth}" × ${newHeight}" from AR preview`,
              });
            }}
          />
        </Suspense>
      )}

      <div className="mt-12 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-center">Frames in Your Home</h2>
        <p className="text-muted-foreground text-center mb-6 max-w-2xl mx-auto">
          See how wedding bouquet frames look in real homes. Preserve your special day forever.
        </p>
        <div className="relative">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-4 pb-4 px-4">
              {bouquetLifestyleImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setLifestylePreviewImage(image)}
                  className={`relative flex-shrink-0 rounded-lg overflow-hidden transition-all duration-200 ${
                    lifestylePreviewImage.url === image.url
                      ? "ring-2 ring-primary ring-offset-2 scale-105"
                      : "hover:scale-102 hover:shadow-lg"
                  }`}
                  style={{ width: "200px", height: "150px" }}
                  data-testid={`button-carousel-image-${index}`}
                >
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {lifestylePreviewImage.url === image.url && (
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
                          <polyline points="20 6 9 17 4 12"></polyline>
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
    </>
  );
}
