"use client";

import { useState, useEffect, useMemo, useRef } from "react";
// Removed wouter useLocation - not needed in Next.js
import { Maximize, X, Eye, Settings, Info, Smartphone, Copy } from "lucide-react";
import { Button } from "../ui/button";
import { ARViewer } from "../shared/ARViewer";
import { Card } from "../ui/card";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Checkbox } from "../ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Input } from "../ui/input";
import { Slider } from "../ui/slider";
import { Separator } from "../ui/separator";
// Select components not currently used
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { PriceBox } from "../ui/PriceBox";
import { QuantitySelector } from "../ui/quantity-selector";
import type { PriceLineItem } from "../ui/PriceBox";
// Import types from @framecraft/types
import type {
  FrameStyle,
  FrameConfiguration,
  ShadowboxJerseyMount,
  ShadowboxAccessory,
  AlternateImage,
} from "@framecraft/types";

// Import services from @framecraft/core
import { getFramesByCategory, getMatColors, getGlassTypes } from "@framecraft/core";
import { calculatePricing } from "@framecraft/core";

// Import utilities from @framecraft/core
import { parseFraction, validateArtworkSize, computePreviewLayout } from "@framecraft/core";

// Import hooks from @framecraft/core
import { useIsMobile, useMobileViewToggle } from "@framecraft/core";

// Import config from @framecraft/config
import {
  getMatsInDisplayOrder,
  getMatById,
  ALL_MATS,
  MAT_PALETTE,
  type Mat,
} from "@framecraft/config";

// Import UI components from same package
import { ColorSwatchesWithSeparator } from "../ui/ColorSwatches";

import { TrustBox } from "../marketing/TrustBox";
import { addToCart, isShopifyEnabled } from "@framecraft/core";
import { useToast } from "../../hooks/use-toast";
import { toShadowboxConfig, fromShadowboxConfig } from "@framecraft/core";
import {
  getMatTilingStyle,
  getMatBevelColor,
  getStoreAssetUrl,
  getSharedAssetUrl,
} from "@framecraft/core";
import { BrassNameplateSection } from "../brass-nameplate/BrassNameplateSection";
import { BrassNameplatePreview } from "../brass-nameplate/BrassNameplatePreview";
import type { BrassNameplateConfig } from "@framecraft/types";
import { BRASS_NAMEPLATE_SPECS, getTypeBBottomBorder } from "@framecraft/types";
import { HangingHardwareSection } from "./shared/HangingHardwareSection";

// Get product data from services
// Note: Shadowbox frames need deeper rabbet depth than standard picture frames
const shadowboxFrames = getFramesByCategory("shadowbox");
const pictureFrames = getFramesByCategory("picture");
const deepRabbetFrames = pictureFrames.filter((f) => (f.usableDepth || 0) >= 0.5).slice(0, 20);
// Cascading fallback: shadowbox → deep-rabbet picture frames → any picture frames (guaranteed non-empty)
const frameStyles =
  shadowboxFrames.length > 0
    ? shadowboxFrames
    : deepRabbetFrames.length > 0
      ? deepRabbetFrames
      : pictureFrames.slice(0, 10);
const matColors = getMatColors();
const glassTypes = getGlassTypes();

interface ShadowboxDesignerProps {
  defaultFrameId?: string;
  embedded?: boolean;
  hideMobileSticky?: boolean;
  readonly?: boolean;
  initialConfig?: import("@framecraft/types").ShadowboxConfig | null;
  featureFlags?: import("@framecraft/types").ShadowboxFeatureFlags;
  onChange?: (config: import("@framecraft/types").ShadowboxConfig) => void;
  onSave?: (config: import("@framecraft/types").ShadowboxConfig) => void;
}

// Upscaled plywood texture for realistic backing (4x upscaled via Real-ESRGAN)
// Now served from CDN or locally for better performance and caching
const PLYWOOD_TEXTURE_URL = getStoreAssetUrl("plywood-texture.png");

// Helper function to get backing styles (DRY - eliminates code duplication)
// Returns style object with proper fallback color for graceful degradation
function getBackingStyles(
  selectedBacking: string,
  matPalette: typeof MAT_PALETTE,
  scale: number = 1
) {
  if (selectedBacking === "plywood") {
    return {
      backgroundColor: "#D4A574", // Fallback color if texture fails to load
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

export function ShadowboxDesigner({
  defaultFrameId,
  embedded = false,
  hideMobileSticky = false,
  readonly = false,
  initialConfig = null,
  featureFlags = {},
  onChange,
  onSave,
}: ShadowboxDesignerProps = {}) {
  // Mark unused parameters
  void featureFlags;
  void onSave;
  // Initialize selected frame with defaultFrameId if provided
  const initialFrame = defaultFrameId
    ? (frameStyles.find((f) => f.id === defaultFrameId) ?? frameStyles[0])
    : frameStyles[0];
  const [selectedFrame, setSelectedFrame] = useState<FrameStyle>(
    () => initialFrame ?? frameStyles[0]!
  );
  const [selectedMat, setSelectedMat] = useState<Mat>(() => getMatById("mat-1") ?? MAT_PALETTE[0]!);
  const [selectedMatInner, setSelectedMatInner] = useState<Mat>(
    () => getMatById("mat-4") ?? MAT_PALETTE[1]!
  );
  const [selectedGlass, setSelectedGlass] = useState(glassTypes[0]);
  const [matType, setMatType] = useState<"none" | "single" | "double">("single");
  const [matBorderWidth, setMatBorderWidth] = useState("2.5");
  const [matRevealWidth, setMatRevealWidth] = useState("0.25");
  const [bottomWeighted, setBottomWeighted] = useState(false);
  const [fullImageOpen, setFullImageOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [hangingHardware, setHangingHardware] = useState<"standard" | "security">("standard");
  const [selectedBacking, setSelectedBacking] = useState<string>("none");
  const [selectedBackingColor, setSelectedBackingColor] = useState<string | undefined>(undefined); // Preserve color for round-trip
  const [depth, setDepth] = useState<number>(1.25); // Shadowbox depth in inches

  // Brass nameplate configuration (Type B behavior)
  const [brassNameplateConfig, setBrassNameplateConfig] = useState<BrassNameplateConfig>(() => {
    const params = new URLSearchParams(window.location.search);
    const enabled = params.get("nameplateEnabled") === "true";
    return {
      enabled,
      line1: params.get("nameplateLine1") || "",
      line2: params.get("nameplateLine2") || "",
      line3: params.get("nameplateLine3") || "",
      font: (params.get("nameplateFont") as BrassNameplateConfig["font"]) || "georgia",
      color: (params.get("nameplateColor") as BrassNameplateConfig["color"]) || "brass-black",
      includeFlag: false,
    };
  });

  // Passthrough state for unsupported features (preserves lossless round-trip)
  const [jerseyMount, setJerseyMount] = useState<unknown>(undefined);
  const [accessories, setAccessories] = useState<unknown>(undefined);

  // Preserve raw color values for lossless round-trip (even if not in palette)
  const [rawMatColor, setRawMatColor] = useState<string | undefined>(undefined);
  const [rawMatInnerColor, setRawMatInnerColor] = useState<string | undefined>(undefined);

  // Preserve unknown config fields for forward compatibility
  const [unknownConfigFields, setUnknownConfigFields] = useState<Record<string, unknown>>({});

  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Mobile view toggle hook (handles scroll position memory and sticky bar visibility)
  const { mobileView, setMobileView, showMobileBar, previewCardRef, controlsHeadingRef } =
    useMobileViewToggle({ isMobile });

  // Custom dimensions - interior size (not artwork, as shadowboxes hold 3D objects)
  const [artworkWidth, setArtworkWidth] = useState("16");
  const [artworkHeight, setArtworkHeight] = useState("20");

  // Container size tracking for responsive preview
  const [containerSize, setContainerSize] = useState({ width: 600, height: 500 });
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const hardwareSectionRef = useRef<HTMLDivElement>(null);
  const configuratorRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // AR viewer state
  const [showARViewer, setShowARViewer] = useState(false);

  // Frame photos for realistic rendering (top, bottom, left, right edge images)
  const [framePhotos, setFramePhotos] = useState<{
    topUrl?: string;
    bottomUrl?: string;
    leftUrl?: string;
    rightUrl?: string;
  }>({});

  // Removed useLocation() - not needed in Next.js

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

    // Only load frame from URL if no defaultFrameId is provided (prevents URL params from overriding dedicated page defaults)
    if (!defaultFrameId && !embedded && frameId) {
      const frame = frameStyles.find((f) => f.id === frameId);
      if (frame) setSelectedFrame(frame);
    }
    if (width) setArtworkWidth(width);
    if (height) setArtworkHeight(height);
    if (mat === "none" || mat === "single" || mat === "double") setMatType(mat);
    if (matColorId) {
      const mat = getMatById(matColorId);
      if (mat) setSelectedMat(mat);
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

  // Load from initialConfig prop (for embed mode)
  useEffect(() => {
    if (initialConfig) {
      const state = fromShadowboxConfig(initialConfig);

      // Update dimensions and mat type
      setArtworkWidth(state.artworkWidth);
      setArtworkHeight(state.artworkHeight);
      setMatType(state.matType);
      setMatBorderWidth(state.matBorderWidth);
      setMatRevealWidth(state.matRevealWidth);
      setSelectedBacking(state.backing);
      setSelectedBackingColor(state.backingColor); // Preserve original color
      setDepth(state.depth);

      // Preserve unsupported features for passthrough
      if (state.hangingHardware) setHangingHardware(state.hangingHardware);
      if (state.jerseyMount) setJerseyMount(state.jerseyMount);
      if (state.accessories) setAccessories(state.accessories);

      // Preserve raw color values for lossless round-trip
      if (state.rawMatColor) setRawMatColor(state.rawMatColor);
      if (state.rawMatInnerColor) setRawMatInnerColor(state.rawMatInnerColor);

      // Preserve unknown fields
      if (state.unknownFields) setUnknownConfigFields(state.unknownFields);

      // Find and set frame
      const frame = frameStyles.find((f) => f.id === state.frameId);
      if (frame) setSelectedFrame(frame);

      // Find and set glass
      const glass = glassTypes.find((g) => g.id === state.glassId);
      if (glass) setSelectedGlass(glass);

      // Find and set mat colors by ID
      if (state.matColorId) {
        const mat = getMatById(state.matColorId);
        if (mat) setSelectedMat(mat);
      }

      if (state.matInnerColorId) {
        const innerMat = getMatById(state.matInnerColorId);
        if (innerMat) setSelectedMatInner(innerMat);
      }

      // Handle backing - if it's a hex color (from mat-color backing), find the mat ID
      if (state.backing && state.backing.startsWith("#")) {
        const backingMatColor = matColors.find((m) => m.color === state.backing);
        if (backingMatColor) {
          setSelectedBacking(backingMatColor.id);
        }
      }
    }
  }, [initialConfig]);

  // Update URL when configuration changes
  useEffect(() => {
    // Don't update URL when embedded or when defaultFrameId is provided (dedicated pages manage their own routing)
    if (readonly || embedded || defaultFrameId) return;

    const params = new URLSearchParams();
    params.set("frame", selectedFrame.id);
    params.set("width", artworkWidth);
    params.set("height", artworkHeight);
    params.set("mat", matType);
    if (matType !== "none") {
      params.set("matColor", selectedMat.id);
      params.set("matBorder", matBorderWidth);
      if (bottomWeighted) {
        params.set("bottomWeighted", "true");
      } else {
        params.delete("bottomWeighted");
      }
    }
    if (matType === "double") {
      params.set("matInnerColor", selectedMatInner.id);
    }
    params.set("hardware", hangingHardware);
    if (selectedBacking !== "none") {
      params.set("backing", selectedBacking);
    }

    // Nameplate configuration
    if (brassNameplateConfig.enabled) {
      params.set("nameplateEnabled", "true");
      if (brassNameplateConfig.line1) params.set("nameplateLine1", brassNameplateConfig.line1);
      if (brassNameplateConfig.line2) params.set("nameplateLine2", brassNameplateConfig.line2);
      if (brassNameplateConfig.line3) params.set("nameplateLine3", brassNameplateConfig.line3);
      params.set("nameplateFont", brassNameplateConfig.font);
      params.set("nameplateColor", brassNameplateConfig.color);
    }

    // Preserve readonly parameter if it exists
    const currentParams = new URLSearchParams(window.location.search);
    if (currentParams.has("readonly")) {
      params.set("readonly", currentParams.get("readonly")!);
    }

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
    brassNameplateConfig,
  ]);

  // Call onChange callback when configuration changes (for embed mode)
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
        selectedBackingColor, // Preserve original color for round-trip
        hangingHardware,
        depth,
        matPalette: MAT_PALETTE.map((m) => ({ id: m.id, color: m.hexColor || "#FFFFFF" })), // Pass palette for resolving backing colors
        jerseyMount: jerseyMount as ShadowboxJerseyMount | undefined, // Passthrough unsupported features
        accessories: accessories as ShadowboxAccessory[] | undefined, // Passthrough unsupported features
        rawMatColor, // Preserve raw color for round-trip
        rawMatInnerColor, // Preserve raw color for round-trip
        unknownFields: unknownConfigFields, // Forward compatibility
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

  // Reset bottom-weighted when mat type changes to none (prevent hidden state from inflating pricing)
  useEffect(() => {
    if (matType === "none" && bottomWeighted) {
      setBottomWeighted(false);
    }
  }, [matType, bottomWeighted]);

  // Type B behavior note: We do NOT auto-clamp matBorderWidth. Instead:
  // - User's matBorderWidth applies to top, left, right borders
  // - Bottom border = max(matBorderWidth, 3.75") when nameplate is enabled
  // - This allows asymmetric mats where only the bottom is extended for the nameplate

  // Fetch frame photos for realistic rendering when frame changes
  useEffect(() => {
    async function fetchFramePhotos() {
      // Clear existing photos first (prevents showing wrong frame momentarily)
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
        // Note: Silently fall back to hex color borders if API fails (no error toast needed)
      } catch (error) {
        console.error("Failed to load frame photos:", error);
        // Fall back to hex color borders (framePhotos will be empty)
      }
    }
    fetchFramePhotos();
  }, [selectedFrame]);

  // ResizeObserver for dynamic container sizing
  useEffect(() => {
    const container = previewContainerRef.current;
    if (!container) return;

    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;

        if (prefersReducedMotion) {
          // Update immediately without animation
          setContainerSize({ width, height });
        } else {
          // Allow smooth transitions
          setContainerSize({ width, height });
        }
      }
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Handle checkout/add to cart
  const handleCheckout = async () => {
    if (!isValidDimensions || isTooLarge) {
      toast({
        title: "Invalid Configuration",
        description: "Please check your shadowbox dimensions.",
        variant: "destructive",
      });
      return;
    }

    setIsCheckingOut(true);

    try {
      // Call Shopify checkout service
      await addToCart(frameConfig, finalTotalPrice, quantity);

      if (!isShopifyEnabled()) {
        // Mock checkout - show success message
        toast({
          title: "Mock Checkout Created",
          description: "Shopify is not configured. Check console for payload details.",
        });
      } else {
        // Real checkout - user will be redirected to Shopify
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

  // Parse dimensions with validation
  const artWidth = parseFraction(artworkWidth);
  const artHeight = parseFraction(artworkHeight);
  const matBorder = parseFraction(matBorderWidth);
  const matReveal = parseFraction(matRevealWidth);

  // Artwork size validation - minimum 4×4 inches
  const artworkSizeValidation = useMemo(() => {
    if (artWidth === 0 && artHeight === 0) return null; // Don't validate empty inputs
    return validateArtworkSize(artWidth, artHeight);
  }, [artWidth, artHeight]);

  // Get mats filtered by device (desktop omits Terracotta) and size availability
  // Only show mats available for TOTAL FRAME SIZE (artwork + mat borders)
  const standardMats = useMemo(() => {
    const deviceMats = getMatsInDisplayOrder(isMobile ? "mobile" : "desktop", true, false);
    return deviceMats.filter((mat) => {
      // Calculate total frame dimensions (artwork + mat borders on all sides)
      const frameWidth = artWidth + 2 * matBorder;
      const frameHeight = artHeight + 2 * matBorder;
      const shortSide = Math.min(frameWidth, frameHeight);
      const longSide = Math.max(frameWidth, frameHeight);

      // Check if frame size exceeds 32x40 mat sheet
      if (shortSide > 32 || longSide > 40) {
        return mat.sizes["40x60"] !== null;
      }
      return mat.sizes["32x40"] !== null;
    });
  }, [isMobile, artWidth, artHeight, matBorder]);

  const premiumMats = useMemo(() => {
    const deviceMats = getMatsInDisplayOrder(isMobile ? "mobile" : "desktop", false, true);
    return deviceMats.filter((mat) => {
      // Calculate total frame dimensions (artwork + mat borders on all sides)
      const frameWidth = artWidth + 2 * matBorder;
      const frameHeight = artHeight + 2 * matBorder;
      const shortSide = Math.min(frameWidth, frameHeight);
      const longSide = Math.max(frameWidth, frameHeight);

      // Check if frame size exceeds 32x40 mat sheet
      if (shortSide > 32 || longSide > 40) {
        return mat.sizes["40x60"] !== null;
      }
      return mat.sizes["32x40"] !== null;
    });
  }, [isMobile, artWidth, artHeight, matBorder]);

  const allAvailableMats = useMemo(
    () => [...standardMats, ...premiumMats],
    [standardMats, premiumMats]
  );

  // Auto-switch to white if selected mat becomes unavailable when size changes
  useEffect(() => {
    // Check if selected outer mat is still available
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

    // Check if selected inner mat is still available (for double mats)
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

    // Check if selected backing is a mat color and is still available
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

  // Validation - prevent invalid calculations
  const isValidDimensions =
    artWidth > 0 && artHeight > 0 && (!artworkSizeValidation || artworkSizeValidation.valid);

  // Create frame configuration for pricing calculation (shadowboxes are always frame-only, no prints)
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
      glassTypeId: selectedGlass?.id ?? "standard",
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
      selectedGlass?.id,
      bottomWeighted,
    ]
  );

  // Calculate pricing using the pricing service
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

  // Extract pricing values for use in component
  const { framePrice, matPrice, glassPrice, oversizeFee, total: totalPrice, isTooLarge } = pricing;

  // Calculate hardware pricing
  const hardwarePrice = hangingHardware === "security" ? 8.95 : 0;

  // Calculate nameplate pricing (only when mat is selected)
  const nameplatePrice =
    brassNameplateConfig.enabled && matType !== "none" ? BRASS_NAMEPLATE_SPECS.PRICE : 0;

  const finalTotalPrice = totalPrice + hardwarePrice + nameplatePrice;

  // Build itemized pricing for PriceBox component
  const priceItems: PriceLineItem[] = useMemo(() => {
    const items: PriceLineItem[] = [];

    // Frame
    items.push({
      label: "Frame",
      amount: framePrice,
      testId: "text-frame-price",
    });

    // Mat Board (only if mat is enabled)
    if (matType !== "none") {
      items.push({
        label: `Mat Board (${matType})`,
        amount: matPrice,
        testId: "text-mat-price",
      });
    }

    // Glass
    if (selectedGlass?.id === "standard") {
      items.push({
        label: selectedGlass.name ?? "Standard",
        amount: 0,
        isIncluded: true,
        testId: "text-glass-price",
      });
    } else if (selectedGlass?.id === "none") {
      items.push({
        label: selectedGlass.name ?? "No Glass",
        amount: 0,
        isDiscount: true,
        testId: "text-glass-price",
      });
    } else {
      items.push({
        label: selectedGlass?.name ?? "Glass",
        amount: glassPrice,
        isDiscount: glassPrice < 0,
        testId: "text-glass-price",
      });
    }

    // Oversize Fee (only if applicable)
    if (oversizeFee > 0) {
      items.push({
        label: "Oversize Fee",
        amount: oversizeFee,
        testId: "text-oversize-fee",
      });
    }

    // Security Hardware (only if selected)
    if (hardwarePrice > 0) {
      items.push({
        label: "Security Hardware Kit",
        amount: hardwarePrice,
        testId: "text-hardware-price",
      });
    }

    // Brass Nameplate (only if enabled and mat is selected)
    if (brassNameplateConfig.enabled && matType !== "none") {
      items.push({
        label: "Engraved Brass Nameplate",
        amount: BRASS_NAMEPLATE_SPECS.PRICE,
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
    brassNameplateConfig.enabled,
  ]);

  // Build warnings for PriceBox component
  const warnings = useMemo(() => {
    const warningsList: React.ReactNode[] = [];

    // Oversize warning
    if (oversizeFee > 0) {
      warningsList.push(
        <div
          key="oversize"
          className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-md p-3 text-sm text-yellow-800 dark:text-yellow-200"
          data-testid="warning-oversize"
        >
          The overall dimensions of your frame are oversized and will incur an oversize fee
        </div>
      );
    }

    // Too large warning
    if (isTooLarge) {
      warningsList.push(
        <div
          key="too-large"
          className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md p-3 text-sm text-red-800 dark:text-red-200"
          data-testid="warning-too-large"
        >
          This frame is too large for online ordering – please contact us to discuss your project
        </div>
      );
    }

    return warningsList;
  }, [oversizeFee, isTooLarge]);

  // Calculate overall frame dimensions for display
  // Double mats are STACKED (not side-by-side), so mat border is only counted once
  const effectiveMatBorder = matType === "none" ? 0 : matBorder;

  // Overall frame dimensions = artwork + mat borders + moulding - overlap (if mat)
  const matOverlap = matType !== "none" ? 0.5 : 0;
  const matRevealAddition = matType === "double" ? matReveal * 2 : 0;
  const bottomWeightedExtra = bottomWeighted ? 0.5 : 0;

  // Type B behavior: Calculate effective bottom border (auto-adjusted for nameplate)
  const effectiveBottomBorder =
    matType !== "none" ? getTypeBBottomBorder(brassNameplateConfig.enabled, matBorder) : 0;
  const nameplateBottomExtra = effectiveBottomBorder - effectiveMatBorder;

  const frameWidth = isValidDimensions
    ? artWidth +
      effectiveMatBorder * 2 +
      selectedFrame.mouldingWidth * 2 -
      matOverlap +
      matRevealAddition
    : 0;
  const frameHeight = isValidDimensions
    ? artHeight +
      effectiveMatBorder * 2 +
      bottomWeightedExtra +
      nameplateBottomExtra +
      selectedFrame.mouldingWidth * 2 -
      matOverlap +
      matRevealAddition
    : 0;

  // Calculate aspect ratio for proportional display (needed for dialog)
  const aspectRatio = isValidDimensions ? artWidth / artHeight : 1;

  // Compute preview layout using single-scale containment system
  const layout = useMemo(() => {
    const effectiveMatBorder = matType === "none" ? 0 : matBorder;
    const bottomWeightedExtra = bottomWeighted ? 0.5 : 0;

    // Type B behavior: Bottom border = max(userBorder, 3.75") when nameplate enabled
    const effectiveBottomBorder =
      matType !== "none" ? getTypeBBottomBorder(brassNameplateConfig.enabled, matBorder) : 0;
    const nameplateBottomExtra = effectiveBottomBorder - effectiveMatBorder;

    // For double mat, include mat reveal in layout calculation
    const effectiveMatReveal = matType === "double" ? matReveal : 0;

    return computePreviewLayout({
      artW: artWidth,
      artH: artHeight,
      matBorderTop: effectiveMatBorder,
      matBorderRight: effectiveMatBorder,
      matBorderBottom: effectiveMatBorder + bottomWeightedExtra + nameplateBottomExtra,
      matBorderLeft: effectiveMatBorder,
      matReveal: effectiveMatReveal,
      frameFace: selectedFrame.mouldingWidth,
      containerWpx: containerSize.width,
      containerHpx: containerSize.height,
      paddingPx: 12,
    });
  }, [
    artWidth,
    artHeight,
    matBorder,
    matReveal,
    bottomWeighted,
    matType,
    selectedFrame.mouldingWidth,
    containerSize,
    brassNameplateConfig.enabled,
  ]);

  // Calculate plaque positioning (only when plaque is enabled and mat exists)
  const plaquePositioning = useMemo(() => {
    if (!brassNameplateConfig.enabled || matType === "none") return null;

    // Nameplate dimensions in preview pixels
    const plaqueWidthPx = BRASS_NAMEPLATE_SPECS.NAMEPLATE_WIDTH * layout.scale;
    const plaqueHeightPx = BRASS_NAMEPLATE_SPECS.NAMEPLATE_HEIGHT * layout.scale;
    const clearanceFromOpeningPx = 1.0 * layout.scale; // 1" below mat opening

    // BrassNameplatePreview uses 150 DPI internally, so we need to normalize
    // the scale to convert from its 150 DPI base to our preview pixels
    const nameplateRenderScale = layout.scale / 150;

    // Calculate opening bottom position relative to preview-stage
    // For double mat, the outer mat opening includes the inner mat reveal around the artwork
    // Opening top = frameFace + matTop, Opening bottom = Opening top + reveal + artwork + reveal
    const openingBottomY =
      layout.frameFacePx + layout.matTopPx + layout.openingPx.h + 2 * layout.matRevealPx;

    // Position plaque 1" below the opening bottom
    const plaqueY = openingBottomY + clearanceFromOpeningPx;

    // Center horizontally within the frame
    const plaqueX = (layout.outerPx.w - plaqueWidthPx) / 2;

    return {
      x: plaqueX,
      y: plaqueY,
      width: plaqueWidthPx,
      height: plaqueHeightPx,
      renderScale: nameplateRenderScale,
    };
  }, [brassNameplateConfig.enabled, matType, layout]);

  // Helper function to get mat texture class based on type (legacy - no longer used for swatches)
  const getMatTextureClass = (_mat: Mat) => {
    // Mat textures are now handled via actual swatch images
    return "mat-texture-standard";
  };

  return (
    <>
      {/* Sentinel element for mobile sticky bar - triggers when scrolled out of view */}
      <div ref={sentinelRef} className="h-px" aria-hidden="true" />

      <div
        ref={configuratorRef}
        className="grid grid-cols-1 lg:grid-cols-[1.5fr,1fr] gap-6 pb-24 md:pb-12"
      >
        <Card
          ref={previewCardRef}
          className={`p-4 md:p-6 lg:sticky lg:top-24 lg:self-start ${mobileView === "controls" ? "hidden lg:block" : ""}`}
        >
          {/* AR Button - Above preview (mobile only) */}
          <div className="mb-3 flex justify-center md:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowARViewer(true)}
              disabled={readonly || !isValidDimensions || isTooLarge}
              className="h-8 text-sm px-4"
              data-testid="button-view-ar-shadowbox"
            >
              <Smartphone className="h-3.5 w-3.5 mr-2" />
              View on My Wall
            </Button>
          </div>

          <div
            ref={previewContainerRef}
            className="preview-wrap min-h-[400px] md:min-h-[500px] bg-muted rounded-md flex items-center justify-center relative group"
            onMouseEnter={() => {}}
          >
            {/* Mouseover icon for full preview */}
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
              // Photo-based 2D preview - four-piece frame construction with actual frame edge images
              <div
                className="preview-stage"
                style={{
                  width: `${layout.outerPx.w}px`,
                  height: `${layout.outerPx.h}px`,
                  position: "relative",
                }}
              >
                {/* Top frame piece - pre-oriented with decorative edge facing down */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: `${layout.frameFacePx}px`,
                    backgroundImage: `url(${framePhotos.topUrl})`,
                    backgroundSize: "auto 100%",
                    backgroundRepeat: "repeat-x",
                    backgroundPosition: "left center",
                    clipPath: `polygon(
                  0 0, 
                  100% 0, 
                  calc(100% - ${layout.frameFacePx}px) 100%, 
                  ${layout.frameFacePx}px 100%
                )`,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  }}
                />

                {/* Bottom frame piece - pre-oriented with decorative edge facing up */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: `${layout.frameFacePx}px`,
                    backgroundImage: `url(${framePhotos.bottomUrl})`,
                    backgroundSize: "auto 100%",
                    backgroundRepeat: "repeat-x",
                    backgroundPosition: "left center",
                    clipPath: `polygon(
                  ${layout.frameFacePx}px 0, 
                  calc(100% - ${layout.frameFacePx}px) 0, 
                  100% 100%, 
                  0 100%
                )`,
                    boxShadow: "0 -2px 8px rgba(0,0,0,0.15)",
                  }}
                />

                {/* Left frame piece - pre-oriented with decorative edge facing right */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: `${layout.frameFacePx}px`,
                    backgroundImage: `url(${framePhotos.leftUrl})`,
                    backgroundSize: "100% auto",
                    backgroundRepeat: "repeat-y",
                    backgroundPosition: "center top",
                    clipPath: `polygon(
                  0 0, 
                  100% ${layout.frameFacePx}px, 
                  100% calc(100% - ${layout.frameFacePx}px), 
                  0 100%
                )`,
                    boxShadow: "2px 0 8px rgba(0,0,0,0.15)",
                  }}
                />

                {/* Right frame piece - pre-oriented with decorative edge facing left */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: `${layout.frameFacePx}px`,
                    backgroundImage: `url(${framePhotos.rightUrl})`,
                    backgroundSize: "100% auto",
                    backgroundRepeat: "repeat-y",
                    backgroundPosition: "center top",
                    clipPath: `polygon(
                  0 ${layout.frameFacePx}px, 
                  100% 0, 
                  100% 100%, 
                  0 calc(100% - ${layout.frameFacePx}px)
                )`,
                    boxShadow: "-2px 0 8px rgba(0,0,0,0.15)",
                  }}
                />

                {/* Mat/backing area - sits inside the frame */}
                <div
                  key={`preview-${selectedFrame.id}-${matType}-${selectedMat.id}-${selectedMatInner.id}-${selectedBacking}`}
                  className={matType !== "none" ? getMatTextureClass(selectedMat) : ""}
                  style={{
                    position: "absolute",
                    top: `${layout.frameFacePx}px`,
                    left: `${layout.frameFacePx}px`,
                    right: `${layout.frameFacePx}px`,
                    bottom: `${layout.frameFacePx}px`,
                    // Lighter shadow between frame and mat (mat sits flush against acrylic) - matches FrameDesigner
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
                      className={getMatTextureClass(selectedMatInner)}
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
                            ? getMatTextureClass(MAT_PALETTE.find((m) => m.id === selectedBacking)!)
                            : ""
                        }
                        style={{
                          position: "absolute",
                          top: `${matReveal * layout.scale + Math.max(1, layout.scale * 0.1)}px`,
                          left: `${matReveal * layout.scale + Math.max(1, layout.scale * 0.1)}px`,
                          right: `${matReveal * layout.scale + Math.max(1, layout.scale * 0.1)}px`,
                          bottom: `${matReveal * layout.scale + Math.max(1, layout.scale * 0.1)}px`,
                          ...getBackingStyles(selectedBacking, MAT_PALETTE, layout.scale),
                          // Bottom mat beveled edge + depth shadow between bottom mat and backing
                          boxShadow: `inset 0 0 0 ${Math.max(1, layout.scale * 0.1)}px ${getMatBevelColor(selectedMatInner.name)}, inset 0 4px 12px rgba(0,0,0,0.3), inset 0 1px 4px rgba(0,0,0,0.2)`,
                          transition: "background-color 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
                        }}
                      />
                    </div>
                  ) : matType === "single" ? (
                    <div
                      className={
                        selectedBacking !== "none" && selectedBacking !== "plywood"
                          ? getMatTextureClass(MAT_PALETTE.find((m) => m.id === selectedBacking)!)
                          : ""
                      }
                      style={{
                        width: `${layout.openingPx.w}px`,
                        height: `${layout.openingPx.h}px`,
                        ...getBackingStyles(selectedBacking, MAT_PALETTE, layout.scale),
                        // Mat beveled edge (1/16" inner border - black for some mats, off-white for others) + depth shadow
                        boxShadow: `inset 0 0 0 ${Math.max(1, layout.scale * 0.1)}px ${getMatBevelColor(selectedMat.name)}, inset 0 4px 12px rgba(0,0,0,0.3), inset 0 1px 4px rgba(0,0,0,0.2)`,
                        transition: "background-color 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
                      }}
                    />
                  ) : (
                    <div
                      className={
                        selectedBacking !== "none" && selectedBacking !== "plywood"
                          ? getMatTextureClass(MAT_PALETTE.find((m) => m.id === selectedBacking)!)
                          : ""
                      }
                      style={{
                        width: `${layout.openingPx.w}px`,
                        height: `${layout.openingPx.h}px`,
                        ...getBackingStyles(selectedBacking, MAT_PALETTE, layout.scale),
                        // Depth shadow - simulate recessed interior
                        boxShadow:
                          "inset 0 4px 12px rgba(0,0,0,0.3), inset 0 1px 4px rgba(0,0,0,0.2)",
                        transition: "background-color 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
                      }}
                    />
                  )}
                </div>

                {/* Brass Nameplate Preview - positioned 1" below mat opening */}
                {plaquePositioning && (
                  <div
                    style={{
                      position: "absolute",
                      left: `${plaquePositioning.x}px`,
                      top: `${plaquePositioning.y}px`,
                      zIndex: 15,
                    }}
                    data-testid="preview-nameplate"
                  >
                    <BrassNameplatePreview
                      config={brassNameplateConfig}
                      scale={plaquePositioning.renderScale}
                    />
                  </div>
                )}
              </div>
            ) : (
              // Fallback: Hex color borders when frame photos aren't available
              <div
                className="preview-stage"
                style={{
                  width: `${layout.outerPx.w}px`,
                  height: `${layout.outerPx.h}px`,
                }}
              >
                <div
                  key={`preview-${selectedFrame.id}-${matType}-${selectedMat.id}-${selectedMatInner.id}-${selectedBacking}`}
                  className={matType !== "none" ? getMatTextureClass(selectedMat) : ""}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderTop: `${layout.frameFacePx}px solid ${selectedFrame.borderColor}`,
                    borderLeft: `${layout.frameFacePx}px solid ${selectedFrame.borderColor}`,
                    borderRight: `${layout.frameFacePx}px solid ${selectedFrame.color}`,
                    borderBottom: `${layout.frameFacePx}px solid ${selectedFrame.color}`,
                    // Lighter shadow between frame and mat (mat sits flush against acrylic) - matches FrameDesigner
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
                      className={getMatTextureClass(selectedMatInner)}
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
                            ? getMatTextureClass(MAT_PALETTE.find((m) => m.id === selectedBacking)!)
                            : ""
                        }
                        style={{
                          position: "absolute",
                          top: `${matReveal * layout.scale + Math.max(1, layout.scale * 0.1)}px`,
                          left: `${matReveal * layout.scale + Math.max(1, layout.scale * 0.1)}px`,
                          width: `calc(100% - ${2 * (matReveal * layout.scale + Math.max(1, layout.scale * 0.1))}px)`,
                          height: `calc(100% - ${2 * (matReveal * layout.scale + Math.max(1, layout.scale * 0.1))}px)`,
                          ...getBackingStyles(selectedBacking, MAT_PALETTE, layout.scale),
                          // Bottom mat beveled edge + depth shadow between bottom mat and backing
                          boxShadow: `inset 0 0 0 ${Math.max(1, layout.scale * 0.1)}px ${getMatBevelColor(selectedMatInner.name)}, inset 0 4px 12px rgba(0,0,0,0.3), inset 0 1px 4px rgba(0,0,0,0.2)`,
                          transition: "background-color 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
                        }}
                      />
                    </div>
                  ) : matType === "single" ? (
                    <div
                      className={
                        selectedBacking !== "none" && selectedBacking !== "plywood"
                          ? getMatTextureClass(MAT_PALETTE.find((m) => m.id === selectedBacking)!)
                          : ""
                      }
                      style={{
                        width: `${layout.openingPx.w}px`,
                        height: `${layout.openingPx.h}px`,
                        ...getBackingStyles(selectedBacking, MAT_PALETTE, layout.scale),
                        // Mat beveled edge (1/16" inner border - black for some mats, off-white for others) + depth shadow
                        boxShadow: `inset 0 0 0 ${Math.max(1, layout.scale * 0.1)}px ${getMatBevelColor(selectedMat.name)}, inset 0 4px 12px rgba(0,0,0,0.3), inset 0 1px 4px rgba(0,0,0,0.2)`,
                        transition: "background-color 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
                      }}
                    />
                  ) : (
                    <div
                      className={
                        selectedBacking !== "none" && selectedBacking !== "plywood"
                          ? getMatTextureClass(MAT_PALETTE.find((m) => m.id === selectedBacking)!)
                          : ""
                      }
                      style={{
                        width: `${layout.openingPx.w}px`,
                        height: `${layout.openingPx.h}px`,
                        ...getBackingStyles(selectedBacking, MAT_PALETTE, layout.scale),
                        // Depth shadow - simulate recessed interior
                        boxShadow:
                          "inset 0 4px 12px rgba(0,0,0,0.3), inset 0 1px 4px rgba(0,0,0,0.2)",
                        transition: "background-color 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
                      }}
                    />
                  )}
                </div>

                {/* Brass Nameplate Preview - positioned 1" below mat opening */}
                {plaquePositioning && (
                  <div
                    style={{
                      position: "absolute",
                      left: `${plaquePositioning.x}px`,
                      top: `${plaquePositioning.y}px`,
                      zIndex: 15,
                    }}
                    data-testid="preview-nameplate"
                  >
                    <BrassNameplatePreview
                      config={brassNameplateConfig}
                      scale={plaquePositioning.renderScale}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-4 p-3 bg-muted/50 rounded-md text-sm space-y-0.5">
            <div className="flex items-center gap-2">
              <p className="font-medium">
                Finished Size:{" "}
                <span className="text-primary">
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
                      alt={`${selectedFrame.name} dimensional diagram`}
                      className="w-64 rounded-lg border-2 border-border bg-background"
                      data-testid="img-dimensional-diagram"
                    />
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            <p className="text-muted-foreground text-xs">
              {matType === "none" ? (
                <>
                  Interior: {(artWidth - 0.25).toFixed(2)}&quot; × {(artHeight - 0.25).toFixed(2)}
                  &quot; × {selectedFrame.usableDepth}&quot;
                </>
              ) : (
                <>
                  Viewable Area: {artWidth}&quot; × {artHeight}&quot; • Mat Border:{" "}
                  {matBorder.toFixed(2)}&quot;
                </>
              )}
            </p>
          </div>

          <div className="mt-4">
            <div className="grid grid-cols-3 gap-2">
              {/* Corner Detail */}
              {(() => {
                const cornerImage = selectedFrame.alternateImages?.find(
                  (img: AlternateImage) =>
                    img.type === "corner" &&
                    (img.url.includes("corner_a") || img.url.includes("corner-a"))
                );
                return cornerImage ? (
                  <div className="aspect-square rounded-md border overflow-hidden bg-background">
                    <img
                      src={cornerImage.url}
                      alt={cornerImage.alt || `${selectedFrame.name} corner detail`}
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
                      src={profileImage.url}
                      alt={profileImage.alt || `${selectedFrame.name} profile view`}
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

              {/* Lifestyle */}
              {(() => {
                const lifestyleImage = selectedFrame.alternateImages?.find(
                  (img: AlternateImage) => img.type === "lifestyle"
                );
                return lifestyleImage ? (
                  <div className="aspect-square rounded-md border overflow-hidden bg-background">
                    <img
                      src={lifestyleImage.url}
                      alt={lifestyleImage.alt || `${selectedFrame.name} lifestyle`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-square rounded-md border-2 border-dashed border-border flex items-center justify-center bg-muted/30">
                    <div className="text-center p-2">
                      <p className="text-xs text-muted-foreground">Lifestyle</p>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Trust Indicators */}
          <TrustBox />
        </Card>

        <div className={`space-y-3 ${mobileView === "preview" ? "hidden lg:block" : ""}`}>
          <h2 ref={controlsHeadingRef} className="text-2xl font-bold mb-2 lg:hidden">
            Design Your Perfect Shadowbox
          </h2>

          <Accordion
            type="multiple"
            defaultValue={["size", "shadowbox", "backing", "mat", "nameplate", "glass", "hardware"]}
            className="w-full"
          >
            <AccordionItem value="size">
              <AccordionTrigger data-testid="accordion-size">Custom Size</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div className="flex items-end gap-4">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="width">Interior Width (inches)</Label>
                    <Input
                      id="width"
                      value={artworkWidth}
                      onChange={(e) => setArtworkWidth(e.target.value)}
                      onFocus={(e) => {
                        setTimeout(() => {
                          e.target.scrollIntoView({ behavior: "smooth", block: "center" });
                        }, 300);
                      }}
                      placeholder="e.g., 16 or 16 1/2"
                      className={!isValidDimensions && artworkWidth ? "border-destructive" : ""}
                      data-testid="input-width"
                      disabled={readonly}
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="height">Interior Height (inches)</Label>
                    <Input
                      id="height"
                      value={artworkHeight}
                      onChange={(e) => setArtworkHeight(e.target.value)}
                      onFocus={(e) => {
                        setTimeout(() => {
                          e.target.scrollIntoView({ behavior: "smooth", block: "center" });
                        }, 300);
                      }}
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

            <AccordionItem value="shadowbox">
              <AccordionTrigger data-testid="accordion-shadowbox">Shadowbox Style</AccordionTrigger>
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
                <div className="md:max-h-[400px] md:overflow-y-auto md:pr-2">
                  <div className="grid grid-cols-2 gap-2">
                    {frameStyles.map((frame) => (
                      <button
                        key={frame.id}
                        onClick={() => setSelectedFrame(frame)}
                        className={`p-3 rounded-md border-2 text-left hover-elevate active-elevate-2 ${
                          selectedFrame.id === frame.id ? "border-primary" : "border-transparent"
                        }`}
                        data-testid={`button-frame-${frame.id}`}
                        disabled={readonly}
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
                            <svg
                              className="w-3 h-3 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                              />
                            </svg>
                            <span>Width: {frame.mouldingWidth}&quot;</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <svg
                              className="w-3 h-3 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                              />
                            </svg>
                            <span>Depth: {frame.usableDepth}&quot;</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
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
                      : selectedBacking === "none"
                        ? "No Backing"
                        : MAT_PALETTE.find((m) => m.id === selectedBacking)?.name || "None"}
                  </Label>

                  <ColorSwatchesWithSeparator
                    standardColors={standardMats}
                    premiumColors={premiumMats}
                    selectedId={selectedBacking}
                    onSelect={(mat) => setSelectedBacking(mat.id)}
                    testIdPrefix="backing"
                    disabled={readonly}
                  />

                  {/* Plywood and No Backing Options */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button
                      onClick={() => setSelectedBacking("plywood")}
                      className={`p-3 rounded-md border-2 hover-elevate active-elevate-2 text-sm font-medium ${
                        selectedBacking === "plywood"
                          ? "border-primary bg-primary/5"
                          : "border-border"
                      }`}
                      data-testid="button-backing-plywood"
                      disabled={readonly}
                    >
                      Plywood Backing
                    </button>
                    <button
                      onClick={() => setSelectedBacking("none")}
                      className={`p-3 rounded-md border-2 hover-elevate active-elevate-2 text-sm font-medium ${
                        selectedBacking === "none" ? "border-primary bg-primary/5" : "border-border"
                      }`}
                      data-testid="button-backing-none"
                      disabled={readonly}
                    >
                      No Backing
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
                        onValueChange={(values) => setMatBorderWidth((values[0] ?? 2.5).toString())}
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
                              setMatRevealWidth((values[0] ?? 0.25).toString())
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

            {/* Brass Nameplate - Only visible when mat is selected (Type B behavior) */}
            {matType !== "none" && (
              <AccordionItem value="nameplate">
                <AccordionTrigger data-testid="accordion-nameplate">
                  Engraved Brass Nameplate
                </AccordionTrigger>
                <AccordionContent>
                  <BrassNameplateSection
                    config={brassNameplateConfig}
                    onChange={setBrassNameplateConfig}
                    embedded={true}
                    data-testid="section-brass-nameplate"
                  />
                </AccordionContent>
              </AccordionItem>
            )}

            <AccordionItem value="glass">
              <AccordionTrigger data-testid="accordion-glass">Glazing</AccordionTrigger>
              <AccordionContent>
                <RadioGroup
                  value={selectedGlass?.id ?? "standard"}
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
          </Accordion>

          {/* Sticky Price Box - Desktop Only */}
          <PriceBox
            totalPrice={finalTotalPrice}
            quantity={quantity}
            onQuantityChange={setQuantity}
            onAddToCart={handleCheckout}
            onCopyLink={() => {
              const url = window.location.href;
              navigator.clipboard.writeText(url);
              toast({
                title: "Link copied!",
                description: "Design link copied to clipboard",
              });
            }}
            isProcessing={isCheckingOut}
            disabled={readonly || !isValidDimensions || isTooLarge}
            priceItems={priceItems}
            warnings={warnings}
          />

          {/* SEO Content for Selected Frame Style */}
          <Card className="p-4">
            <h3 className="font-semibold mb-2">{selectedFrame.name} Shadowbox Frame</h3>
            {selectedFrame.shortDescription && (
              <p className="text-sm text-muted-foreground italic mb-2">
                {selectedFrame.shortDescription}
              </p>
            )}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {selectedFrame.featuredDescription ||
                selectedFrame.shortDescription ||
                "Professional shadowbox frame with customizable dimensions for displaying your treasured memorabilia and collectibles."}
            </p>
          </Card>
        </div>

        {/* Full Frame Preview Dialog */}
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
              {/* Render enlarged frame preview */}
              {isValidDimensions
                ? (() => {
                    // Calculate larger display dimensions for dialog - use much larger artwork scale
                    const dialogArtworkScale = 150; // Very large scale for artwork
                    const dialogBorderScale = 40; // Separate smaller scale for borders
                    const dialogMaxWidth = window.innerWidth * 0.9;
                    const dialogMaxHeight = window.innerHeight * 0.85;

                    // Calculate borders using smaller scale to prevent them eating up space
                    // If no mat, set mat border to 0
                    const dialogMatBorderEstimate =
                      matType !== "none"
                        ? (matBorder / artWidth) * (artWidth * dialogBorderScale)
                        : 0;
                    const dialogFrameBorderEstimate =
                      (selectedFrame.mouldingWidth / ((artWidth + artHeight) / 2)) *
                      ((artWidth * dialogBorderScale + artHeight * dialogBorderScale) / 2);

                    const dialogTotalBorderX =
                      dialogMatBorderEstimate * 2 + dialogFrameBorderEstimate * 2;
                    const dialogTotalBorderY =
                      dialogMatBorderEstimate * 2 + dialogFrameBorderEstimate * 2;

                    const dialogAvailableWidth = Math.max(100, dialogMaxWidth - dialogTotalBorderX);
                    const dialogAvailableHeight = Math.max(
                      100,
                      dialogMaxHeight - dialogTotalBorderY
                    );

                    // Use larger scale for artwork display
                    let dialogDisplayWidth = artWidth * dialogArtworkScale;
                    let dialogDisplayHeight = artHeight * dialogArtworkScale;

                    if (dialogDisplayWidth > dialogAvailableWidth) {
                      dialogDisplayWidth = dialogAvailableWidth;
                      dialogDisplayHeight = dialogDisplayWidth / aspectRatio;
                    }
                    if (dialogDisplayHeight > dialogAvailableHeight) {
                      dialogDisplayHeight = dialogAvailableHeight;
                      dialogDisplayWidth = dialogDisplayHeight * aspectRatio;
                    }

                    const dialogMatBorder =
                      matType !== "none" ? (matBorder / artWidth) * dialogDisplayWidth : 0;
                    const dialogFrameBorder =
                      (selectedFrame.mouldingWidth / ((artWidth + artHeight) / 2)) *
                      ((dialogDisplayWidth + dialogDisplayHeight) / 2);
                    const dialogMatRevealDisplay = (dialogMatBorder / matBorder) * matReveal;

                    // Calculate actual pixels-per-inch scale after viewport clamping (replaces stale dialogArtworkScale for V-groove)
                    const _dialogScalePxPerIn = dialogDisplayWidth / artWidth;
                    void _dialogScalePxPerIn; // Currently unused but may be needed for future enhancements

                    return framePhotos.topUrl &&
                      framePhotos.bottomUrl &&
                      framePhotos.leftUrl &&
                      framePhotos.rightUrl ? (
                      // Photo-based fullscreen preview - four-piece frame construction with actual frame edge images
                      <div
                        style={{
                          width: `${dialogDisplayWidth + dialogMatBorder * 2 + dialogFrameBorder * 2}px`,
                          height: `${dialogDisplayHeight + dialogMatBorder * 2 + dialogFrameBorder * 2}px`,
                          position: "relative",
                          filter:
                            "drop-shadow(0 8px 32px rgba(0, 0, 0, 0.15)) drop-shadow(0 2px 8px rgba(0, 0, 0, 0.1))",
                        }}
                        data-testid="dialog-frame-preview"
                      >
                        {/* Top frame piece - pre-oriented with decorative edge facing down */}
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: `${dialogFrameBorder}px`,
                            backgroundImage: `url(${framePhotos.topUrl})`,
                            backgroundSize: "auto 100%",
                            backgroundRepeat: "repeat-x",
                            backgroundPosition: "left center",
                            clipPath: `polygon(
                      0 0, 
                      100% 0, 
                      calc(100% - ${dialogFrameBorder}px) 100%, 
                      ${dialogFrameBorder}px 100%
                    )`,
                            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                          }}
                        />

                        {/* Bottom frame piece - pre-oriented with decorative edge facing up */}
                        <div
                          style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: `${dialogFrameBorder}px`,
                            backgroundImage: `url(${framePhotos.bottomUrl})`,
                            backgroundSize: "auto 100%",
                            backgroundRepeat: "repeat-x",
                            backgroundPosition: "left center",
                            clipPath: `polygon(
                      ${dialogFrameBorder}px 0, 
                      calc(100% - ${dialogFrameBorder}px) 0, 
                      100% 100%, 
                      0 100%
                    )`,
                            boxShadow: "0 -4px 12px rgba(0,0,0,0.2)",
                          }}
                        />

                        {/* Left frame piece - pre-oriented with decorative edge facing right */}
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            bottom: 0,
                            width: `${dialogFrameBorder}px`,
                            backgroundImage: `url(${framePhotos.leftUrl})`,
                            backgroundSize: "100% auto",
                            backgroundRepeat: "repeat-y",
                            backgroundPosition: "center top",
                            clipPath: `polygon(
                      0 0, 
                      100% ${dialogFrameBorder}px, 
                      100% calc(100% - ${dialogFrameBorder}px), 
                      0 100%
                    )`,
                            boxShadow: "4px 0 12px rgba(0,0,0,0.2)",
                          }}
                        />

                        {/* Right frame piece - pre-oriented with decorative edge facing left */}
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            bottom: 0,
                            width: `${dialogFrameBorder}px`,
                            backgroundImage: `url(${framePhotos.rightUrl})`,
                            backgroundSize: "100% auto",
                            backgroundRepeat: "repeat-y",
                            backgroundPosition: "center top",
                            clipPath: `polygon(
                      0 ${dialogFrameBorder}px, 
                      100% 0, 
                      100% 100%, 
                      0 calc(100% - ${dialogFrameBorder}px)
                    )`,
                            boxShadow: "-4px 0 12px rgba(0,0,0,0.2)",
                          }}
                        />

                        {/* Mat/backing area - sits inside the frame */}
                        <div
                          className={matType !== "none" ? getMatTextureClass(selectedMat) : ""}
                          style={{
                            position: "absolute",
                            top: `${dialogFrameBorder}px`,
                            left: `${dialogFrameBorder}px`,
                            right: `${dialogFrameBorder}px`,
                            bottom: `${dialogFrameBorder}px`,
                            // Lighter shadow between frame and mat (mat sits flush against acrylic) - matches FrameDesigner
                            boxShadow:
                              matType !== "none"
                                ? "inset 0 0 20px rgba(0,0,0,0.3), inset 0 1px 3px rgba(0,0,0,0.08)"
                                : "inset 0 0 20px rgba(0,0,0,0.3)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            ...(matType !== "none"
                              ? getMatTilingStyle(
                                  selectedMat.name,
                                  dialogArtworkScale,
                                  selectedMat.hexColor
                                )
                              : { backgroundColor: "white" }),
                            padding: matType !== "none" ? `${dialogMatBorder}px` : "0",
                          }}
                        >
                          {matType === "double" ? (
                            <div
                              className={getMatTextureClass(selectedMatInner)}
                              style={{
                                width: "100%",
                                height: "100%",
                                padding: `${dialogMatRevealDisplay}px`,
                                ...getMatTilingStyle(
                                  selectedMatInner.name,
                                  dialogArtworkScale,
                                  selectedMatInner.hexColor
                                ),
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: `${Math.max(0.375, dialogArtworkScale * 0.015625)}px solid #E0E0E0`,
                                position: "relative",
                              }}
                            >
                              <div
                                className={
                                  selectedBacking !== "none" && selectedBacking !== "plywood"
                                    ? getMatTextureClass(
                                        MAT_PALETTE.find((m) => m.id === selectedBacking)!
                                      )
                                    : ""
                                }
                                style={{
                                  position: "absolute",
                                  top: `${dialogMatRevealDisplay + Math.max(1, dialogArtworkScale * 0.1)}px`,
                                  left: `${dialogMatRevealDisplay + Math.max(1, dialogArtworkScale * 0.1)}px`,
                                  right: `${dialogMatRevealDisplay + Math.max(1, dialogArtworkScale * 0.1)}px`,
                                  bottom: `${dialogMatRevealDisplay + Math.max(1, dialogArtworkScale * 0.1)}px`,
                                  ...getBackingStyles(
                                    selectedBacking,
                                    MAT_PALETTE,
                                    dialogArtworkScale
                                  ),
                                  boxShadow: `inset 0 0 0 ${Math.max(1, dialogArtworkScale * 0.1)}px ${getMatBevelColor(selectedMatInner.name)}, inset 0 8px 24px rgba(0,0,0,0.4), inset 0 3px 10px rgba(0,0,0,0.3)`,
                                }}
                              />
                            </div>
                          ) : matType === "single" ? (
                            <div
                              className={
                                selectedBacking !== "none" && selectedBacking !== "plywood"
                                  ? getMatTextureClass(
                                      MAT_PALETTE.find((m) => m.id === selectedBacking)!
                                    )
                                  : ""
                              }
                              style={{
                                width: "100%",
                                height: "100%",
                                ...getBackingStyles(
                                  selectedBacking,
                                  MAT_PALETTE,
                                  dialogArtworkScale
                                ),
                                boxShadow: `inset 0 0 0 ${Math.max(1.5, dialogArtworkScale * 0.1)}px ${getMatBevelColor(selectedMat.name)}, inset 0 6px 16px rgba(0,0,0,0.3), inset 0 2px 6px rgba(0,0,0,0.2)`,
                              }}
                            />
                          ) : (
                            <div
                              className={
                                selectedBacking !== "none" && selectedBacking !== "plywood"
                                  ? getMatTextureClass(
                                      MAT_PALETTE.find((m) => m.id === selectedBacking)!
                                    )
                                  : ""
                              }
                              style={{
                                width: `${dialogDisplayWidth}px`,
                                height: `${dialogDisplayHeight}px`,
                                ...getBackingStyles(
                                  selectedBacking,
                                  MAT_PALETTE,
                                  dialogArtworkScale
                                ),
                                boxShadow:
                                  "inset 0 6px 16px rgba(0,0,0,0.3), inset 0 2px 6px rgba(0,0,0,0.2)",
                              }}
                            />
                          )}
                        </div>
                      </div>
                    ) : (
                      // Fallback: Hex color borders when frame photos aren't available
                      <>
                        <div
                          className={matType !== "none" ? getMatTextureClass(selectedMat) : ""}
                          style={{
                            width: `${dialogDisplayWidth + dialogMatBorder * 2 + dialogFrameBorder * 2}px`,
                            height: `${dialogDisplayHeight + dialogMatBorder * 2 + dialogFrameBorder * 2}px`,
                            borderTop: `${dialogFrameBorder}px solid ${selectedFrame.borderColor}`,
                            borderLeft: `${dialogFrameBorder}px solid ${selectedFrame.borderColor}`,
                            borderRight: `${dialogFrameBorder}px solid ${selectedFrame.color}`,
                            borderBottom: `${dialogFrameBorder}px solid ${selectedFrame.color}`,
                            // Lighter shadow between frame and mat (mat sits flush against acrylic) + outer drop shadow
                            boxShadow:
                              matType !== "none"
                                ? "inset 0 0 20px rgba(0,0,0,0.3), inset 0 1px 3px rgba(0,0,0,0.08), 0 8px 32px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.1)"
                                : "inset 0 0 20px rgba(0,0,0,0.3), 0 8px 32px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            ...(matType !== "none"
                              ? getMatTilingStyle(
                                  selectedMat.name,
                                  dialogArtworkScale,
                                  selectedMat.hexColor
                                )
                              : { backgroundColor: "white" }),
                            padding: matType !== "none" ? `${dialogMatBorder}px` : "0",
                          }}
                          data-testid="dialog-frame-preview"
                        >
                          {matType === "double" ? (
                            <div
                              className={getMatTextureClass(selectedMatInner)}
                              style={{
                                width: "100%",
                                height: "100%",
                                padding: `${dialogMatRevealDisplay}px`,
                                ...getMatTilingStyle(
                                  selectedMatInner.name,
                                  dialogArtworkScale,
                                  selectedMatInner.hexColor
                                ),
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: `${Math.max(0.375, dialogArtworkScale * 0.015625)}px solid #E0E0E0`,
                                position: "relative",
                              }}
                            >
                              <div
                                className={
                                  selectedBacking !== "none" && selectedBacking !== "plywood"
                                    ? getMatTextureClass(
                                        MAT_PALETTE.find((m) => m.id === selectedBacking)!
                                      )
                                    : ""
                                }
                                style={{
                                  position: "absolute",
                                  top: `${dialogMatRevealDisplay + Math.max(1, dialogArtworkScale * 0.1)}px`,
                                  left: `${dialogMatRevealDisplay + Math.max(1, dialogArtworkScale * 0.1)}px`,
                                  right: `${dialogMatRevealDisplay + Math.max(1, dialogArtworkScale * 0.1)}px`,
                                  bottom: `${dialogMatRevealDisplay + Math.max(1, dialogArtworkScale * 0.1)}px`,
                                  ...getBackingStyles(
                                    selectedBacking,
                                    MAT_PALETTE,
                                    dialogArtworkScale
                                  ),
                                  boxShadow: `inset 0 0 0 ${Math.max(1, dialogArtworkScale * 0.1)}px ${getMatBevelColor(selectedMatInner.name)}, inset 0 8px 24px rgba(0,0,0,0.4), inset 0 3px 10px rgba(0,0,0,0.3)`,
                                }}
                              />
                            </div>
                          ) : matType === "single" ? (
                            <div
                              className={
                                selectedBacking !== "none" && selectedBacking !== "plywood"
                                  ? getMatTextureClass(
                                      MAT_PALETTE.find((m) => m.id === selectedBacking)!
                                    )
                                  : ""
                              }
                              style={{
                                width: "100%",
                                height: "100%",
                                ...getBackingStyles(
                                  selectedBacking,
                                  MAT_PALETTE,
                                  dialogArtworkScale
                                ),
                                boxShadow: `inset 0 0 0 ${Math.max(1.5, dialogArtworkScale * 0.1)}px ${getMatBevelColor(selectedMat.name)}, inset 0 6px 16px rgba(0,0,0,0.3), inset 0 2px 6px rgba(0,0,0,0.2)`,
                              }}
                            />
                          ) : (
                            <div
                              className={
                                selectedBacking !== "none" && selectedBacking !== "plywood"
                                  ? getMatTextureClass(
                                      MAT_PALETTE.find((m) => m.id === selectedBacking)!
                                    )
                                  : ""
                              }
                              style={{
                                width: `${dialogDisplayWidth}px`,
                                height: `${dialogDisplayHeight}px`,
                                ...getBackingStyles(
                                  selectedBacking,
                                  MAT_PALETTE,
                                  dialogArtworkScale
                                ),
                                boxShadow:
                                  "inset 0 6px 16px rgba(0,0,0,0.3), inset 0 2px 6px rgba(0,0,0,0.2)",
                              }}
                            />
                          )}
                        </div>
                      </>
                    );
                  })()
                : null}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Mobile Sticky Bottom Bar - Shows when scrolled to configurator */}
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
              {/* Total Price Display */}
              <div className="flex flex-col gap-0.5 min-w-[60px]">
                <span className="text-xs text-muted-foreground">Total</span>
                <span className="font-bold text-sm" data-testid="text-mobile-sticky-total-price">
                  ${(finalTotalPrice * quantity).toFixed(2)}
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
                onClick={() => {
                  const url = window.location.href;
                  navigator.clipboard.writeText(url);
                  toast({
                    title: "Link copied!",
                    description: "Design link copied to clipboard",
                  });
                }}
                data-testid="button-mobile-copy-link"
                className="h-11 w-11"
              >
                <Copy className="h-4 w-4" />
              </Button>

              {/* Add to Cart Button - Compact */}
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

      {/* Floating Toggle Button (Mobile Only) - Shows when scrolled to configurator */}
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

      {/* AR Viewer Modal */}
      {showARViewer && (
        <ARViewer
          config={{
            serviceType: "frame-only",
            artworkWidth: parseFraction(artworkWidth),
            artworkHeight: parseFraction(artworkHeight),
            frameStyleId: selectedFrame.id,
            matType,
            matBorderWidth: parseFraction(matBorderWidth),
            matRevealWidth: parseFraction(matRevealWidth),
            matColorId: selectedMat.id,
            matInnerColorId: matType === "double" ? selectedMatInner.id : undefined,
            glassTypeId: selectedGlass?.id ?? "standard",
            imageUrl: undefined, // Shadowboxes typically don't have photos
            copyrightAgreed: true,
          }}
          onClose={() => setShowARViewer(false)}
          onSizeUpdate={(newWidth, newHeight) => {
            // Update dimensions from AR resize
            setArtworkWidth(newWidth.toString());
            setArtworkHeight(newHeight.toString());

            // Show success toast
            toast({
              title: "Size Updated",
              description: `Shadowbox size updated to ${newWidth}" × ${newHeight}" from AR preview`,
            });
          }}
        />
      )}
    </>
  );
}
