import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import {
  Upload,
  Copy,
  Maximize,
  X,
  Eye,
  Settings,
  Info,
  Sparkles,
  Smartphone,
  Download,
  Puzzle,
  CheckCircle2,
} from "lucide-react";
import { TermsOfServiceModal } from "../shared/TermsOfServiceModal";
import { useMutation } from "@tanstack/react-query";
// Import UI components from same package (relative imports)
import { Button } from "../ui/button";
import { FrameSpinner } from "../ui/frame-spinner";
import { QuantitySelector } from "../ui/quantity-selector";
import { Card } from "../ui/card";
import { PriceBox } from "../ui/PriceBox";
import type { PriceLineItem } from "../ui/PriceBox";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
// Select components not currently used but may be needed in future
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Input } from "../ui/input";
import { Slider } from "../ui/slider";
import { Separator } from "../ui/separator";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Checkbox } from "../ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { PhotoUploadOptions } from "../shared/PhotoUploadOptions";
import type { UploadResult } from "@uppy/core";
import { apiRequest } from "@framecraft/core";
// Import types from @framecraft/types
import type { FrameStyle, FrameConfiguration } from "@framecraft/types";

// Import services from @framecraft/core
import { getFramesByCategory, getGlassTypes, getFrameStyleById } from "@framecraft/core";
import { calculatePricing } from "@framecraft/core";

// Import utilities from @framecraft/core
import { parseFraction, validateArtworkSize, computePreviewLayout } from "@framecraft/core";

// Import hooks from @framecraft/core
import { useIsMobile, useMobileViewToggle, useIntersectionVisible } from "@framecraft/core";

// Import palette config from @framecraft/config
import { ALL_MATS, getMatsInDisplayOrder, getMatById, type Mat } from "@framecraft/config";

// TODO: App-specific dependencies - these need to be extracted or made injectable
import { addToCart, isShopifyEnabled } from "@framecraft/core";
import { useToast } from "../../hooks/use-toast";
import { getRandomStockImage } from "@framecraft/core";
import { ColorSwatchesWithSeparator } from "../ui/ColorSwatches";
import { exportFramePreview, convertImageToDataURL, downloadImage } from "@framecraft/core";
import { RecommendationCarousel } from "../marketing/RecommendationCarousel";
import type { DesignRecommendation, DesignRecommendationResponse } from "@framecraft/types";
import { ARViewer } from "../shared/ARViewer";
import { getMatTilingStyle, getMatBevelColor } from "@framecraft/core";
import { BrassNameplateSection } from "../brass-nameplate/BrassNameplateSection";
import { BrassNameplatePreview } from "../brass-nameplate/BrassNameplatePreview";
import type { BrassNameplateConfig } from "@framecraft/types";
import { BRASS_NAMEPLATE_SPECS, getTypeBBottomBorder } from "@framecraft/types";
import { HangingHardwareSection } from "./shared/HangingHardwareSection";
import {
  calculatePrintDimensions,
  generatePrintFile,
  downloadPrintFile,
  checkImageResolution,
} from "@framecraft/core";

// Get product data from services
const frameStyles = getFramesByCategory("picture");
const glassTypes = getGlassTypes();

interface FrameDesignerProps {
  defaultFrameId?: string;
  embedded?: boolean;
  hideMobileSticky?: boolean;
}

export function FrameDesigner({
  defaultFrameId,
  embedded: _embedded = false,
  hideMobileSticky = false,
}: FrameDesignerProps = {}) {
  const [location] = useLocation();
  const [searchParams, setSearchParams] = useState(window.location.search);
  const [serviceType, setServiceType] = useState<"frame-only" | "print-and-frame">("frame-only");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Watch for URL changes (both path and query params)
  useEffect(() => {
    setSearchParams(window.location.search);
  }, [location]);

  // Initialize frame selection based on defaultFrameId prop or URL parameter
  const initialFrame = useMemo(() => {
    if (defaultFrameId) {
      return getFrameStyleById(defaultFrameId) || frameStyles[0];
    }
    const params = new URLSearchParams(window.location.search);
    const frameParam = params.get("frame");
    return frameParam ? getFrameStyleById(frameParam) || frameStyles[0] : frameStyles[0];
  }, [defaultFrameId]);

  const [selectedFrame, setSelectedFrame] = useState<FrameStyle>(initialFrame);
  const [selectedMat, setSelectedMat] = useState<Mat>(() => getMatById("mat-1") ?? ALL_MATS[0]);
  const [selectedMatInner, setSelectedMatInner] = useState<Mat>(
    () => getMatById("mat-4") ?? ALL_MATS[1]
  );
  const [selectedGlass, setSelectedGlass] = useState(glassTypes[0]);
  const [matType, setMatType] = useState<"none" | "single" | "double">("single");
  const [matBorderWidth, setMatBorderWidth] = useState("2.5");
  const [matRevealWidth, setMatRevealWidth] = useState("0.25");
  const [bottomWeighted, setBottomWeighted] = useState(false);
  const [copyrightAgreed, setCopyrightAgreed] = useState(false);
  const [uploadedImageAspectRatio, setUploadedImageAspectRatio] = useState<number | null>(null);
  const [uploadedImageDimensions, setUploadedImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [_isGeneratingPrint, setIsGeneratingPrint] = useState(false);
  const [fullImageOpen, setFullImageOpen] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<
    "preview" | "corner" | "profile" | "lifestyle"
  >("preview");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [previousImage, setPreviousImage] = useState<string | null>(null);
  const prevImageRef = useRef<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [hangingHardware, setHangingHardware] = useState<"standard" | "security">("standard");
  const [puzzleGlue, setPuzzleGlue] = useState(false);

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

  // Type B behavior note: We do NOT auto-clamp matBorderWidth. Instead:
  // - User's matBorderWidth applies to top, left, right borders
  // - Bottom border = max(matBorderWidth, 3.75") when nameplate is enabled
  // - This allows asymmetric mats where only the bottom is extended for the nameplate

  // AI Recommendations state
  const [recommendations, setRecommendations] = useState<DesignRecommendation[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);

  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);

  // AR Viewer state
  const [showARViewer, setShowARViewer] = useState(false);

  const { toast } = useToast();

  // Ref for copyright checkbox (must be declared before useIntersectionVisible hook)
  const copyrightCheckboxRef = useRef<HTMLDivElement>(null);

  // Mobile view toggle hook
  const isMobile = useIsMobile();
  const { mobileView, setMobileView, showMobileBar, previewCardRef, controlsHeadingRef } =
    useMobileViewToggle({ isMobile });

  // Track if copyright checkbox is visible (for sticky checkbox feature)
  const isCopyrightCheckboxVisible = useIntersectionVisible(
    copyrightCheckboxRef,
    { threshold: 0.4 },
    [selectedImage, serviceType]
  );

  // Custom dimensions - artwork size
  const [artworkWidth, setArtworkWidth] = useState("16");
  const [artworkHeight, setArtworkHeight] = useState("20");

  // Container size tracking for responsive preview
  const [containerSize, setContainerSize] = useState({ width: 600, height: 500 });
  const previewContainerRef = useRef<HTMLDivElement>(null);

  const hardwareSectionRef = useRef<HTMLDivElement>(null);

  // Generate stable random seed for placeholder image (only changes on page load)
  const [placeholderSeed] = useState(() => Math.floor(Math.random() * 1000));

  // Get stable placeholder image from local stock library
  const placeholderImage = useMemo(() => getRandomStockImage(placeholderSeed), [placeholderSeed]);

  // Use uploaded image if available, otherwise use placeholder
  const displayImage = selectedImage || placeholderImage;

  const configuratorRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Frame photos state (corner, profile, lifestyle, straight/framingengine)
  const [framePhotos, setFramePhotos] = useState<{
    cornerUrl?: string;
    profileUrl?: string;
    lifestyleUrl?: string;
    topUrl?: string; // Pre-oriented top piece (decorative edge facing down)
    bottomUrl?: string; // Pre-oriented bottom piece (decorative edge facing up)
    leftUrl?: string; // Pre-oriented left piece (decorative edge facing right)
    rightUrl?: string; // Pre-oriented right piece (decorative edge facing left)
  }>({});

  // Get random lifestyle image from alternateImages array
  const getRandomLifestyleImage = useCallback((frameId: string) => {
    const frame = frameStyles.find((f) => f.id === frameId);
    if (!frame?.alternateImages) return undefined;

    const lifestyleImages = frame.alternateImages.filter(
      (img: { type: string; url: string }) => img.type === "lifestyle"
    );
    if (lifestyleImages.length === 0) return undefined;

    const randomIndex = Math.floor(Math.random() * lifestyleImages.length);
    return lifestyleImages[randomIndex].url;
  }, []);

  // navigate not currently used but may be needed in future
  // const [, navigate] = useLocation();

  // Track if initial load is complete
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);

  // Load configuration from URL parameters on mount and when URL changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    const frameId = params.get("frame");
    const width = params.get("width");
    const height = params.get("height");
    const mat = params.get("mat") || params.get("matType"); // Support both 'mat' and 'matType' parameter names
    const matColorId = params.get("matColor");
    const matInnerColorId = params.get("matInnerColor");
    const matBorder = params.get("matBorder");
    const matReveal = params.get("matReveal");
    const bottomWeightedParam = params.get("bottomWeighted");
    const service = params.get("service");
    const hardware = params.get("hardware");
    const puzzleGlueParam = params.get("puzzleGlue");
    const imageUrl = params.get("imageUrl");
    const quantityParam = params.get("quantity");

    if (frameId) {
      const frame = frameStyles.find((f) => f.id === frameId);
      if (frame) setSelectedFrame(frame);
    }
    if (quantityParam) {
      const parsedQuantity = parseInt(quantityParam, 10);
      if (parsedQuantity >= 1) setQuantity(parsedQuantity);
    }
    if (width) setArtworkWidth(width);
    if (height) setArtworkHeight(height);
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
    if (matReveal !== null) {
      setMatRevealWidth(matReveal); // Apply matReveal even if it's "0"
    }
    if (bottomWeightedParam === "true") setBottomWeighted(true);
    if (service === "frame-only" || service === "print-and-frame") setServiceType(service);
    if (hardware === "standard" || hardware === "security") setHangingHardware(hardware);
    if (puzzleGlueParam === "true") setPuzzleGlue(true);

    // Load custom image from URL if provided (e.g., from Map Builder)
    if (imageUrl) {
      setSelectedImage(imageUrl);
    }

    // Mark initial load as complete after a delay to ensure all state updates are processed
    // This prevents the URL-writing useEffect from overwriting URL params during initial load
    setTimeout(() => {
      setIsInitialLoadComplete(true);
    }, 0);
  }, [searchParams]);

  // Update URL when configuration changes (but not during initial load)
  useEffect(() => {
    if (!isInitialLoadComplete) return;

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
      params.set("matReveal", matRevealWidth);
    }
    params.set("service", serviceType);
    params.set("hardware", hangingHardware);
    if (puzzleGlue) {
      params.set("puzzleGlue", "true");
    }
    if (quantity > 1) {
      params.set("quantity", quantity.toString());
    } else {
      params.delete("quantity");
    }

    // Preserve imageUrl if it exists (from Map Builder or other sources)
    if (
      selectedImage &&
      (selectedImage.includes("/tmp-maps/") || selectedImage.startsWith("http"))
    ) {
      params.set("imageUrl", selectedImage);
    }

    // Add brass nameplate config to URL
    if (brassNameplateConfig.enabled) {
      params.set("nameplateEnabled", "true");
      if (brassNameplateConfig.line1) params.set("nameplateLine1", brassNameplateConfig.line1);
      if (brassNameplateConfig.line2) params.set("nameplateLine2", brassNameplateConfig.line2);
      if (brassNameplateConfig.line3) params.set("nameplateLine3", brassNameplateConfig.line3);
      params.set("nameplateFont", brassNameplateConfig.font);
      params.set("nameplateColor", brassNameplateConfig.color);
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  }, [
    isInitialLoadComplete,
    selectedFrame,
    artworkWidth,
    artworkHeight,
    matType,
    selectedMat,
    selectedMatInner,
    matBorderWidth,
    matRevealWidth,
    bottomWeighted,
    serviceType,
    hangingHardware,
    puzzleGlue,
    selectedImage,
    quantity,
    brassNameplateConfig,
  ]);

  // Fetch frame photos from local storage when frame changes
  useEffect(() => {
    // CRITICAL: Clear frame photos IMMEDIATELY to prevent race condition
    // where old frame's photos show while new frame's photos are loading
    setFramePhotos({});

    if (!selectedFrame.sku) {
      return;
    }

    async function fetchFramePhotos() {
      try {
        const response = await fetch(`/api/frames/${selectedFrame.sku}/photos`);
        if (response.ok) {
          const photoSet = await response.json();
          // Get random lifestyle image from alternateImages array, fallback to API response
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
        // Note: No need to clear on error since we already cleared at the start
      } catch (error) {
        console.error("Error fetching frame photos:", error);
        // Note: Frame photos already cleared at start of effect
      }
    }

    fetchFramePhotos();
  }, [selectedFrame, getRandomLifestyleImage]);

  // Cross-fade animation when selectedImage changes
  useEffect(() => {
    // If we have a previous image, start cross-fade transition
    if (prevImageRef.current && prevImageRef.current !== selectedImage) {
      setPreviousImage(prevImageRef.current);

      // Clear previous image after transition duration (450ms per config)
      const timer = setTimeout(() => {
        setPreviousImage(null);
      }, 450);

      prevImageRef.current = selectedImage;

      return () => clearTimeout(timer);
    }

    // First image or same image - no transition needed
    prevImageRef.current = selectedImage;
  }, [selectedImage]);

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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset bottom-weighted when mat type changes to none (prevent hidden state from inflating pricing)
  useEffect(() => {
    if (matType === "none" && bottomWeighted) {
      setBottomWeighted(false);
    }
  }, [matType, bottomWeighted]);

  const handleGetUploadParameters = async () => {
    const response = await apiRequest("POST", "/api/objects/upload");
    const data = await response.json();
    return {
      method: "PUT" as const,
      url: data.uploadURL,
    };
  };

  const handleUploadComplete = async (
    result: UploadResult<Record<string, unknown>, Record<string, unknown>>
  ) => {
    if (result.successful && result.successful.length > 0) {
      const uploadedFile = result.successful[0];
      // The upload URL was stored in file meta by PhotoUploadOptions
      const uploadURL = uploadedFile.meta?.uploadURL as string;

      if (uploadURL) {
        try {
          // Store the image URL for display and future order processing
          const response = await apiRequest("PUT", "/api/frame-images", { imageURL: uploadURL });
          const data = await response.json();

          // Calculate aspect ratio and capture dimensions from uploaded image
          const img = new Image();
          img.onload = () => {
            const ratio = img.width / img.height;
            setUploadedImageAspectRatio(ratio);
            setUploadedImageDimensions({ width: img.width, height: img.height });

            // Always update dimensions to match uploaded photo's aspect ratio
            const defaultWidth = 16;
            const defaultHeight = defaultWidth / ratio;
            setArtworkWidth(defaultWidth.toString());
            setArtworkHeight(defaultHeight.toFixed(2));
          };
          img.src = data.objectPath;

          // Set the image to the object path for display
          setSelectedImage(data.objectPath);
        } catch (error) {
          console.error("Error storing uploaded image:", error);
        }
      }
    }
  };

  const handleUrlUpload = async (url: string) => {
    try {
      // Store the image URL for display
      const response = await apiRequest("PUT", "/api/frame-images", { imageURL: url });
      const data = await response.json();

      // Calculate aspect ratio and capture dimensions from URL image
      const img = new Image();
      img.onload = () => {
        const ratio = img.width / img.height;
        setUploadedImageAspectRatio(ratio);
        setUploadedImageDimensions({ width: img.width, height: img.height });

        // Always update dimensions to match uploaded photo's aspect ratio
        const defaultWidth = 16;
        const defaultHeight = defaultWidth / ratio;
        setArtworkWidth(defaultWidth.toString());
        setArtworkHeight(defaultHeight.toFixed(2));
      };
      img.crossOrigin = "anonymous";
      img.src = url;

      // Set the image to the object path for display
      setSelectedImage(data.objectPath || url);

      toast({
        title: "Success",
        description: "Image loaded successfully!",
      });
    } catch (error) {
      console.error("Error loading image from URL:", error);
      toast({
        title: "Error",
        description: "Failed to load image from URL.",
        variant: "destructive",
      });
    }
  };

  // Handle width change with aspect ratio locking for print-and-frame
  const handleWidthChange = (newWidth: string) => {
    setArtworkWidth(newWidth);

    // Lock aspect ratio for print-and-frame mode with uploaded image
    if (serviceType === "print-and-frame" && uploadedImageAspectRatio && selectedImage) {
      const width = parseFraction(newWidth);
      if (width > 0) {
        const newHeight = width / uploadedImageAspectRatio;
        setArtworkHeight(newHeight.toFixed(2));
      }
    }
  };

  // Handle checkout/add to cart
  const handleCheckout = async () => {
    if (!isValidDimensions || isTooLarge) {
      toast({
        title: "Invalid Configuration",
        description: "Please check your frame dimensions.",
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

    try {
      // Generate print file for print-and-frame orders
      if (serviceType === "print-and-frame" && selectedImage) {
        setIsGeneratingPrint(true);
        toast({
          title: "Generating Print File",
          description: "Creating your 300 DPI print-ready file...",
        });

        try {
          // Calculate print dimensions
          // Paper size = frame interior (artwork + mat borders)
          // Image bleeds 1/2" over mat opening on all sides (only when mat is present)
          //
          // Bottom border logic (mutually exclusive):
          // - If nameplate enabled: max(matBorder, 3.75") - nameplate takes precedence
          // - Else if bottomWeighted: matBorder + 0.5"
          // - Else: matBorder
          let effectiveBottomBorder = matBorder;
          if (matType !== "none") {
            if (brassNameplateConfig.enabled) {
              // Nameplate requires minimum 3.75" bottom border
              effectiveBottomBorder = getTypeBBottomBorder(true, matBorder);
            } else if (bottomWeighted) {
              // Bottom-weighted adds 0.5" to bottom border
              effectiveBottomBorder = matBorder + 0.5;
            }
          } else {
            effectiveBottomBorder = 0;
          }
          const printDimensions = calculatePrintDimensions(
            artWidth,
            artHeight,
            matBorder,
            effectiveBottomBorder,
            matType
          );

          // Generate the print file
          const printResult = await generatePrintFile(selectedImage, printDimensions);

          // Download the print file
          downloadPrintFile(printResult);

          toast({
            title: "Print File Ready",
            description: `Downloaded ${printResult.filename} (${printResult.widthPixels}×${printResult.heightPixels}px at 300 DPI)`,
          });
        } catch (printError) {
          console.error("Print file generation error:", printError);
          toast({
            title: "Print File Error",
            description:
              printError instanceof Error ? printError.message : "Failed to generate print file.",
            variant: "destructive",
          });
          // Continue with checkout even if print file fails
        } finally {
          setIsGeneratingPrint(false);
        }
      }

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

  // AI Designer's Recommendation mutation
  const recommendationsMutation = useMutation({
    mutationFn: async (data: { imageBase64: string; imageWidth: number; imageHeight: number }) => {
      // Get mime type from data URL
      const mimeMatch = data.imageBase64.match(/data:([^;]+);/);
      const imageMimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";

      // Remove data URL prefix to get just the base64 string
      const base64Data = data.imageBase64.replace(/^data:image\/\w+;base64,/, "");

      const response = await apiRequest("POST", "/api/design-recommendations", {
        imageBase64: base64Data,
        imageMimeType,
        imageWidth: data.imageWidth,
        imageHeight: data.imageHeight,
      });

      return (await response.json()) as DesignRecommendationResponse;
    },
    onSuccess: (data) => {
      setRecommendations(data.recommendations);
      setShowRecommendations(true);
      toast({
        title: "Recommendations Ready!",
        description: `Our AI designer created ${data.recommendations.length} custom framing options for you.`,
      });
    },
    onError: (error) => {
      console.error("Recommendations error:", error);
      toast({
        title: "Failed to Generate Recommendations",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    },
  });

  // Convert image URL to base64 with compression for AI analysis
  const convertImageToBase64 = async (
    imageUrl: string
  ): Promise<{ base64: string; width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        // Store original dimensions before resizing
        const originalWidth = img.width;
        const originalHeight = img.height;

        const canvas = document.createElement("canvas");

        // Resize for AI analysis (max 800px on longest side)
        const maxSize = 800;
        let width = originalWidth;
        let height = originalHeight;

        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Use lower quality for faster upload (0.7 = good balance)
        const dataURL = canvas.toDataURL("image/jpeg", 0.7);

        // Return base64 and ORIGINAL dimensions (not compressed dimensions)
        resolve({
          base64: dataURL,
          width: originalWidth,
          height: originalHeight,
        });
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = imageUrl;
    });
  };

  // Handle get AI recommendations
  const handleGetRecommendations = async () => {
    if (!selectedImage) {
      toast({
        title: "No Image Uploaded",
        description: "Please upload an image to get AI recommendations.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { base64, width, height } = await convertImageToBase64(selectedImage);
      recommendationsMutation.mutate({
        imageBase64: base64,
        imageWidth: width,
        imageHeight: height,
      });
    } catch (error) {
      console.error("Error converting image:", error);
      toast({
        title: "Image Processing Error",
        description: "Failed to process your image. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle apply recommendation
  const handleApplyRecommendation = (recommendation: DesignRecommendation, sizeIndex: number) => {
    const size = recommendation.sizes[sizeIndex];

    // Find and set frame
    const frame = getFrameStyleById(recommendation.frameId);
    if (frame) setSelectedFrame(frame);

    // Find and set top mat
    const topMat = ALL_MATS.find((m) => m.id === recommendation.topMatId);
    if (topMat) setSelectedMat(topMat);

    // Find and set bottom mat
    const bottomMat = ALL_MATS.find((m) => m.id === recommendation.bottomMatId);
    if (bottomMat) setSelectedMatInner(bottomMat);

    // Set mat type to double and standard mat border width
    setMatType("double");
    setMatBorderWidth("2.5");

    // Set dimensions
    setArtworkWidth(size.width.toString());
    setArtworkHeight(size.height.toString());

    // Close modal
    setShowRecommendations(false);

    toast({
      title: "Design Applied!",
      description: "Your custom framing design has been applied.",
    });
  };

  // Handle add recommendation to cart
  const handleAddRecommendationToCart = async (
    recommendation: DesignRecommendation,
    sizeIndex: number
  ) => {
    const size = recommendation.sizes[sizeIndex];

    // Create a frame configuration for this recommendation
    const recFrameConfig: FrameConfiguration = {
      serviceType,
      artworkWidth: size.width,
      artworkHeight: size.height,
      frameStyleId: recommendation.frameId,
      matType: "double",
      matBorderWidth: 2.5,
      matRevealWidth: 0.25,
      matColorId: recommendation.topMatId,
      matInnerColorId: recommendation.bottomMatId,
      glassTypeId: selectedGlass.id,
      imageUrl: selectedImage || undefined,
      copyrightAgreed,
      orderSource: "ai-recommendation",
    };

    try {
      await addToCart(recFrameConfig, size.price, 1);

      toast({
        title: "Added to Cart!",
        description: `${recommendation.frameName} with ${recommendation.topMatName} and ${recommendation.bottomMatName} mats`,
      });

      // Close modal
      setShowRecommendations(false);
    } catch (error) {
      console.error("Add to cart error:", error);
      toast({
        title: "Failed to Add to Cart",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
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
  }, [artWidth, artHeight, allAvailableMats, selectedMat, selectedMatInner, matType, toast]);

  // Validation - prevent invalid calculations
  const isValidDimensions =
    artWidth > 0 && artHeight > 0 && (!artworkSizeValidation || artworkSizeValidation.valid);

  // Print resolution check for print-and-frame mode
  const _printResolutionCheck = useMemo(() => {
    if (!uploadedImageDimensions || serviceType !== "print-and-frame" || !selectedImage) {
      return null;
    }
    // Target print area is artwork size + 1" bleed (1/2" on each side)
    const targetWidth = artWidth + 1;
    const targetHeight = artHeight + 1;
    return checkImageResolution(
      uploadedImageDimensions.width,
      uploadedImageDimensions.height,
      targetWidth,
      targetHeight
    );
  }, [uploadedImageDimensions, serviceType, selectedImage, artWidth, artHeight]);

  // Create frame configuration for pricing calculation
  const frameConfig: FrameConfiguration = useMemo(
    () => ({
      serviceType,
      artworkWidth: artWidth,
      artworkHeight: artHeight,
      frameStyleId: selectedFrame.id,
      matType,
      matBorderWidth: matBorder,
      matRevealWidth: matReveal,
      matColorId: selectedMat.id,
      matInnerColorId: matType === "double" ? selectedMatInner.id : undefined,
      glassTypeId: selectedGlass.id,
      imageUrl: selectedImage || undefined,
      copyrightAgreed,
      bottomWeighted,
    }),
    [
      serviceType,
      artWidth,
      artHeight,
      selectedFrame.id,
      matType,
      matBorder,
      matReveal,
      selectedMat.id,
      selectedMatInner.id,
      selectedGlass.id,
      selectedImage,
      copyrightAgreed,
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
  const {
    framePrice,
    matPrice,
    glassPrice,
    printPrice,
    oversizeFee,
    total: totalPrice,
    isTooLarge,
  } = pricing;

  // Calculate hardware, puzzle glue, and nameplate pricing
  // Nameplate only applies when mat is selected (not "none")
  const hardwarePrice = hangingHardware === "security" ? 8.95 : 0;
  const puzzleGluePrice = puzzleGlue ? 9.95 : 0;
  const nameplatePrice =
    brassNameplateConfig.enabled && matType !== "none" ? BRASS_NAMEPLATE_SPECS.PRICE : 0;
  const finalTotalPrice = totalPrice + hardwarePrice + puzzleGluePrice + nameplatePrice;

  // Build itemized pricing for PriceBox
  const priceItems: PriceLineItem[] = [
    { label: "Frame", amount: framePrice, testId: "text-frame-price" },
  ];

  if (matType !== "none") {
    priceItems.push({
      label: `Mat Board (${matType})`,
      amount: matPrice,
      testId: "text-mat-price",
    });
  }

  priceItems.push({
    label: selectedGlass.name,
    amount: glassPrice,
    isIncluded: selectedGlass.id === "standard",
    isDiscount: glassPrice < 0,
    testId: "text-glass-price",
  });

  if (selectedImage) {
    priceItems.push({
      label: "PRO Printing",
      amount: printPrice,
      testId: "text-print-price",
    });
  }

  if (oversizeFee > 0) {
    priceItems.push({
      label: "Oversize Fee",
      amount: oversizeFee,
      testId: "text-oversize-fee",
    });
  }

  if (hardwarePrice > 0) {
    priceItems.push({
      label: "Security Hardware Kit",
      amount: hardwarePrice,
      testId: "text-hardware-price",
    });
  }

  if (puzzleGluePrice > 0) {
    priceItems.push({
      label: "Puzzle Glue Sheets",
      amount: puzzleGluePrice,
      testId: "text-puzzle-glue-price",
    });
  }

  if (brassNameplateConfig.enabled && matType !== "none") {
    priceItems.push({
      label: "Engraved Brass Nameplate",
      amount: nameplatePrice,
      testId: "text-nameplate-price",
    });
  }

  // Build warnings array for PriceBox
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
        key="toolarge"
        className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md p-3 text-sm text-red-800 dark:text-red-200"
        data-testid="warning-too-large"
      >
        This frame is too large for online ordering – please contact us to discuss your project
      </div>
    );
  }

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
    const effectiveMatReveal = matType === "double" ? matReveal : 0;

    // Calculate individual mat borders for bottom-weighted mats
    const bottomWeightedExtra = bottomWeighted ? 0.5 : 0;

    // Type B behavior: Bottom border = max(userBorder, 3.75") when nameplate enabled
    const effectiveBottomBorder =
      matType !== "none" ? getTypeBBottomBorder(brassNameplateConfig.enabled, matBorder) : 0;
    const nameplateBottomExtra = effectiveBottomBorder - effectiveMatBorder;

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
    // Mat textures are now handled via actual swatch images in ColorSwatches component
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
        <div className={mobileView === "controls" ? "hidden lg:block" : ""}>
          <Card ref={previewCardRef} className="p-4 md:p-6 lg:sticky lg:top-20 lg:self-start">
            {/* Upload Button - Compact pill above preview */}
            <div className="mb-3 flex justify-center gap-2 flex-wrap">
              <Button
                onClick={() => setShowUploadModal(true)}
                className="h-8 text-sm px-4"
                data-testid="button-upload"
              >
                <Upload className="h-3.5 w-3.5 mr-2" />
                Upload Your Image to Preview or Print
              </Button>

              {selectedImage && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleGetRecommendations}
                  disabled={recommendationsMutation.isPending}
                  className="h-8 text-sm px-4"
                  data-testid="button-ai-recommendations"
                >
                  {recommendationsMutation.isPending ? (
                    <FrameSpinner size="sm" className="mr-2" />
                  ) : (
                    <Sparkles className="h-3.5 w-3.5 mr-2" />
                  )}
                  {recommendationsMutation.isPending ? "Analyzing..." : "Designer's Recommendation"}
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowARViewer(true)}
                disabled={!isValidDimensions || isTooLarge}
                className="h-8 text-sm px-4 md:hidden"
                data-testid="button-view-ar-preview"
              >
                <Smartphone className="h-3.5 w-3.5 mr-2" />
                View on My Wall
              </Button>
            </div>

            <div
              ref={previewContainerRef}
              className="preview-wrap h-[400px] md:h-[500px] bg-muted rounded-md flex items-center justify-center relative group"
            >
              {/* Preview control buttons - always visible */}
              <div className="absolute top-4 left-4 z-50 flex gap-2">
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

                      // Convert image to data URL if it exists and is not already a data URL
                      if (displayImage && !displayImage.startsWith("data:")) {
                        const { dismiss: dismissLoadingToast } = toast({
                          title: "Preparing Export",
                          description: "Converting image to safe format...",
                          duration: Infinity,
                        });

                        try {
                          imageDataUrl = await convertImageToDataURL(displayImage);
                          dismissLoadingToast();
                        } catch (conversionError) {
                          dismissLoadingToast();
                          console.error("Image conversion error:", conversionError);
                          toast({
                            title: "Export Failed",
                            description:
                              "Failed to process your image. Try uploading the image directly instead of using a URL.",
                            variant: "destructive",
                          });
                          return;
                        }
                      }

                      // Proceed with export using the new API
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

                      // Detect mobile for appropriate handling
                      const isMobileDevice =
                        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                          navigator.userAgent
                        );
                      const hasShareAPI = navigator.share !== undefined;

                      // Use Web Share API on mobile if available (shares actual image file, not blob URL)
                      if (isMobileDevice && hasShareAPI) {
                        try {
                          // Convert blob URL to actual File object
                          const response = await fetch(blobUrl);
                          const blob = await response.blob();
                          const file = new File([blob], `${selectedFrame.name}-preview.png`, {
                            type: "image/png",
                          });

                          await navigator.share({
                            files: [file],
                            title: "Custom Frame Preview",
                            text: `Check out this ${selectedFrame.name} custom frame design!`,
                          });

                          toast({
                            title: "Export Successful",
                            description:
                              "Image shared! Save to Photos or send to another app (1600px minimum size)",
                          });
                        } catch (shareError) {
                          // User cancelled or share failed - fall back to download
                          if ((shareError as Error).name !== "AbortError") {
                            console.error("Share failed, falling back to download:", shareError);
                            downloadImage(blobUrl, `${selectedFrame.name}-preview.png`);
                            toast({
                              title: "Export Successful",
                              description:
                                "Image opened in new tab. Long-press to save to Photos (1600px minimum size)",
                            });
                          }
                        }
                      } else {
                        // Desktop or no share API - use download
                        downloadImage(blobUrl, `${selectedFrame.name}-preview.png`);

                        toast({
                          title: "Export Successful",
                          description: isMobileDevice
                            ? "Image opened in new tab. Long-press to save to Photos (1600px minimum size)"
                            : "Preview image downloaded (1600px minimum size)",
                        });
                      }
                    } catch (error) {
                      const errorMessage =
                        error instanceof Error ? error.message : "Could not export preview image";
                      toast({
                        title: "Export Failed",
                        description: errorMessage,
                        variant: "destructive",
                      });
                    }
                  }}
                  className="bg-background/90 hover:bg-background p-2 rounded-md shadow-lg hover-elevate active-elevate-2"
                  data-testid="button-export-preview"
                  title="Export preview as high-resolution PNG (1600px)"
                >
                  <Download className="h-5 w-5" />
                </button>
              </div>

              {framePhotos.topUrl &&
              framePhotos.bottomUrl &&
              framePhotos.leftUrl &&
              framePhotos.rightUrl ? (
                // Photo-based 2D preview - four-piece frame construction with pre-oriented images
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

                  {/* Lighting blend overlays for smooth transitions at corners */}
                  {/* Top-left corner blend */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: `${layout.frameFacePx * 1.5}px`,
                      height: `${layout.frameFacePx * 1.5}px`,
                      background:
                        "radial-gradient(circle at top left, rgba(255,255,255,0.03) 0%, transparent 70%)",
                      pointerEvents: "none",
                      mixBlendMode: "overlay",
                    }}
                  />

                  {/* Top-right corner blend */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: `${layout.frameFacePx * 1.5}px`,
                      height: `${layout.frameFacePx * 1.5}px`,
                      background:
                        "radial-gradient(circle at top right, rgba(255,255,255,0.03) 0%, transparent 70%)",
                      pointerEvents: "none",
                      mixBlendMode: "overlay",
                    }}
                  />

                  {/* Bottom-left corner blend */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: `${layout.frameFacePx * 1.5}px`,
                      height: `${layout.frameFacePx * 1.5}px`,
                      background:
                        "radial-gradient(circle at bottom left, rgba(255,255,255,0.03) 0%, transparent 70%)",
                      pointerEvents: "none",
                      mixBlendMode: "overlay",
                    }}
                  />

                  {/* Bottom-right corner blend */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      width: `${layout.frameFacePx * 1.5}px`,
                      height: `${layout.frameFacePx * 1.5}px`,
                      background:
                        "radial-gradient(circle at bottom right, rgba(255,255,255,0.03) 0%, transparent 70%)",
                      pointerEvents: "none",
                      mixBlendMode: "overlay",
                    }}
                  />

                  {/* Mat/artwork area - adapted from ShadowboxDesigner */}
                  <div
                    key={`preview-${selectedFrame.id}-${matType}-${selectedMat.id}-${selectedMatInner.id}`}
                    className={matType !== "none" ? getMatTextureClass(selectedMat) : ""}
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
                        : {}),
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
                          border: `${Math.max(1.1, layout.scale * 0.08)}px solid ${getMatBevelColor(selectedMat.name)}`,
                          transition: "background-color 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
                          position: "relative",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            top: `${matReveal * layout.scale + Math.max(1, layout.scale * 0.1)}px`,
                            left: `${matReveal * layout.scale + Math.max(1, layout.scale * 0.1)}px`,
                            right: `${matReveal * layout.scale + Math.max(1, layout.scale * 0.1)}px`,
                            bottom: `${matReveal * layout.scale + Math.max(1, layout.scale * 0.1)}px`,
                            backgroundColor: "white",
                            border: `${Math.max(1.1, layout.scale * 0.08)}px solid ${getMatBevelColor(selectedMatInner.name)}`,
                            boxShadow: `inset 0 0 0 ${Math.max(1, layout.scale * 0.1)}px ${getMatBevelColor(selectedMatInner.name)}`,
                          }}
                        >
                          {previousImage && (
                            <img
                              src={previousImage}
                              alt="Previous"
                              className="image-fade-out"
                              style={{
                                position: "absolute",
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
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                            data-testid="img-preview"
                          />
                        </div>
                      </div>
                    ) : matType === "single" ? (
                      <div
                        style={{
                          width: `${layout.openingPx.w}px`,
                          height: `${layout.openingPx.h}px`,
                          position: "relative",
                          backgroundColor: getMatBevelColor(selectedMat.name),
                          border: `${Math.max(1.1, layout.scale * 0.08)}px solid ${getMatBevelColor(selectedMat.name)}`,
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            top: `${Math.max(1, layout.scale * 0.1)}px`,
                            left: `${Math.max(1, layout.scale * 0.1)}px`,
                            right: `${Math.max(1, layout.scale * 0.1)}px`,
                            bottom: `${Math.max(1, layout.scale * 0.1)}px`,
                            boxShadow: `inset 0 0 0 ${Math.max(1, layout.scale * 0.1)}px ${getMatBevelColor(selectedMat.name)}`,
                          }}
                        >
                          {previousImage && (
                            <img
                              src={previousImage}
                              alt="Previous"
                              className="image-fade-out"
                              style={{
                                position: "absolute",
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
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                            data-testid="img-preview"
                          />
                        </div>
                      </div>
                    ) : (
                      <div
                        style={{
                          width: `${layout.openingPx.w}px`,
                          height: `${layout.openingPx.h}px`,
                          position: "relative",
                          backgroundColor: "white",
                        }}
                      >
                        {previousImage && (
                          <img
                            src={previousImage}
                            alt="Previous"
                            className="image-fade-out"
                            style={{
                              position: "absolute",
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
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          data-testid="img-preview"
                        />
                      </div>
                    )}
                  </div>

                  {/* Brass nameplate preview (positioned below mat opening) */}
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
                // Synthetic 2D preview (fallback for frames without photos)
                <div
                  className="preview-stage"
                  style={{
                    width: `${layout.outerPx.w}px`,
                    height: `${layout.outerPx.h}px`,
                    position: "relative",
                  }}
                >
                  {/* Mat/artwork area - adapted from ShadowboxDesigner */}
                  <div
                    key={`preview-${selectedFrame.id}-${matType}-${selectedMat.id}-${selectedMatInner.id}`}
                    className={matType !== "none" ? getMatTextureClass(selectedMat) : ""}
                    style={{
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
                        : {}),
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
                          border: `${Math.max(1.1, layout.scale * 0.08)}px solid #E0E0E0`,
                          transition: "background-color 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
                          position: "relative",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            top: `${matReveal * layout.scale + Math.max(1, layout.scale * 0.1)}px`,
                            left: `${matReveal * layout.scale + Math.max(1, layout.scale * 0.1)}px`,
                            width: `calc(100% - ${2 * (matReveal * layout.scale + Math.max(1, layout.scale * 0.1))}px)`,
                            height: `calc(100% - ${2 * (matReveal * layout.scale + Math.max(1, layout.scale * 0.1))}px)`,
                            boxShadow: `inset 0 0 0 ${Math.max(1, layout.scale * 0.1)}px ${getMatBevelColor(selectedMatInner.name)}`,
                          }}
                        >
                          {previousImage && (
                            <img
                              src={previousImage}
                              alt="Previous"
                              className="image-fade-out"
                              style={{
                                position: "absolute",
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
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              opacity: selectedImage ? 1 : 0.8,
                            }}
                            data-testid="img-preview"
                          />
                        </div>
                      </div>
                    ) : matType === "single" ? (
                      <div
                        style={{
                          width: `${layout.openingPx.w}px`,
                          height: `${layout.openingPx.h}px`,
                          position: "relative",
                          border: `${Math.max(1.1, layout.scale * 0.08)}px solid #E0E0E0`,
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            top: `${Math.max(1, layout.scale * 0.1)}px`,
                            left: `${Math.max(1, layout.scale * 0.1)}px`,
                            right: `${Math.max(1, layout.scale * 0.1)}px`,
                            bottom: `${Math.max(1, layout.scale * 0.1)}px`,
                            boxShadow: `inset 0 0 0 ${Math.max(1, layout.scale * 0.1)}px ${getMatBevelColor(selectedMat.name)}`,
                          }}
                        >
                          {previousImage && (
                            <img
                              src={previousImage}
                              alt="Previous"
                              className="image-fade-out"
                              style={{
                                position: "absolute",
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
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              opacity: selectedImage ? 1 : 0.8,
                            }}
                            data-testid="img-preview"
                          />
                        </div>
                      </div>
                    ) : (
                      <div
                        style={{
                          width: `${layout.openingPx.w}px`,
                          height: `${layout.openingPx.h}px`,
                          position: "relative",
                        }}
                      >
                        {previousImage && (
                          <img
                            src={previousImage}
                            alt="Previous"
                            className="image-fade-out"
                            style={{
                              position: "absolute",
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
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            opacity: selectedImage ? 1 : 0.8,
                          }}
                          data-testid="img-preview"
                        />
                      </div>
                    )}
                  </div>

                  {/* Brass nameplate preview (positioned below mat opening) */}
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

            {/* Caption shown only when displaying placeholder image */}
            {!selectedImage && (
              <p className="text-xs text-muted-foreground/60 text-center mt-2">
                Sample image. Not included with purchase.
              </p>
            )}

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
                  </TooltipProvider>
                )}
              </div>
              <p className="text-muted-foreground text-xs">
                Artwork: {artWidth}&quot; × {artHeight}&quot;
                {matType !== "none" && <> • Mat Border: {matBorder.toFixed(2)}&quot;</>}
                {matType === "double" && <> • Reveal: {matReveal.toFixed(2)}&quot;</>}
              </p>
            </div>

            <div className="mt-4">
              <div className="grid grid-cols-3 gap-2">
                {/* Corner Detail Photo */}
                <div
                  className="aspect-square rounded-md border-2 border-border flex items-center justify-center bg-muted/30 overflow-hidden relative group hover-elevate active-elevate-2 cursor-pointer"
                  onClick={() => {
                    if (framePhotos.cornerUrl) {
                      setFullscreenImage("corner");
                      setFullImageOpen(true);
                    }
                  }}
                  data-testid="img-corner-detail"
                >
                  {framePhotos.cornerUrl ? (
                    <img
                      src={framePhotos.cornerUrl}
                      alt="Corner Detail"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-2">
                      <p className="text-xs text-muted-foreground">Corner Detail</p>
                      {selectedFrame.sku && (
                        <p className="text-xs text-muted-foreground mt-1">Loading...</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Profile View Photo */}
                <div
                  className="aspect-square rounded-md border-2 border-border flex items-center justify-center bg-muted/30 overflow-hidden relative group hover-elevate active-elevate-2 cursor-pointer"
                  onClick={() => {
                    if (framePhotos.profileUrl) {
                      setFullscreenImage("profile");
                      setFullImageOpen(true);
                    }
                  }}
                  data-testid="img-profile-view"
                >
                  {framePhotos.profileUrl ? (
                    <img
                      src={framePhotos.profileUrl}
                      alt="Profile View"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-2">
                      <p className="text-xs text-muted-foreground">Profile View</p>
                      {selectedFrame.sku && (
                        <p className="text-xs text-muted-foreground mt-1">Loading...</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Lifestyle Photo */}
                <div
                  className="aspect-square rounded-md border-2 border-border flex items-center justify-center bg-muted/30 overflow-hidden relative group hover-elevate active-elevate-2 cursor-pointer"
                  onClick={() => {
                    if (framePhotos.lifestyleUrl) {
                      setFullscreenImage("lifestyle");
                      setFullImageOpen(true);
                    }
                  }}
                  data-testid="img-lifestyle"
                >
                  {framePhotos.lifestyleUrl ? (
                    <img
                      src={framePhotos.lifestyleUrl}
                      alt="Lifestyle"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-2">
                      <p className="text-xs text-muted-foreground">Lifestyle</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className={`space-y-3 ${mobileView === "preview" ? "hidden lg:block" : ""}`}>
          <h2 ref={controlsHeadingRef} className="text-2xl font-bold mb-2 lg:hidden">
            Design Your Perfect Frame
          </h2>
          <Card className="p-4">
            <RadioGroup
              value={serviceType}
              onValueChange={(value: "frame-only" | "print-and-frame") => setServiceType(value)}
            >
              <div className="grid grid-cols-2 gap-3">
                <Label
                  htmlFor="frame-only"
                  className={`flex items-center justify-center p-4 rounded-md border-2 cursor-pointer hover-elevate active-elevate-2 ${
                    serviceType === "frame-only" ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  <RadioGroupItem
                    value="frame-only"
                    id="frame-only"
                    className="sr-only"
                    data-testid="radio-service-frame-only"
                  />
                  <span className="font-semibold">Frame Only</span>
                </Label>
                <Label
                  htmlFor="print-and-frame"
                  className={`flex items-center justify-center p-4 rounded-md border-2 cursor-pointer hover-elevate active-elevate-2 ${
                    serviceType === "print-and-frame"
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  }`}
                >
                  <RadioGroupItem
                    value="print-and-frame"
                    id="print-and-frame"
                    className="sr-only"
                    data-testid="radio-service-print-and-frame"
                  />
                  <span className="font-semibold">Print and Frame</span>
                </Label>
              </div>
            </RadioGroup>
            {serviceType === "print-and-frame" && (
              <div className="mt-3 space-y-3">
                {!selectedImage ? (
                  <>
                    <p className="text-xs text-muted-foreground">
                      Upload an image to use Print and Frame service
                    </p>
                    <Button
                      onClick={() => setShowUploadModal(true)}
                      className="w-full"
                      data-testid="button-upload-print"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Click to Upload Your Image
                    </Button>
                  </>
                ) : (
                  <>
                    {/* Image Uploaded Confirmation with Clear Button */}
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
                        onClick={() => {
                          setSelectedImage(null);
                          setUploadedImageAspectRatio(null);
                          setUploadedImageDimensions(null);
                          setCopyrightAgreed(false);
                        }}
                        data-testid="button-clear-image"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Clear
                      </Button>
                    </div>

                    {/* Copyright Agreement */}
                    <div
                      ref={copyrightCheckboxRef}
                      className="flex items-start space-x-2 p-3 bg-muted/50 rounded-md"
                    >
                      <input
                        type="checkbox"
                        id="copyright-agreement"
                        checked={copyrightAgreed}
                        onChange={(e) => setCopyrightAgreed(e.target.checked)}
                        className="mt-0.5"
                        data-testid="checkbox-copyright"
                      />
                      <Label htmlFor="copyright-agreement" className="text-xs cursor-pointer">
                        I confirm that I own or am authorized to reproduce this image and agree to
                        the <TermsOfServiceModal />.
                      </Label>
                    </div>
                  </>
                )}
              </div>
            )}
          </Card>

          <Accordion
            type="multiple"
            defaultValue={["size", "frame", "mat", "nameplate", "glass", "hardware"]}
            className="w-full"
          >
            <AccordionItem value="size">
              <AccordionTrigger data-testid="accordion-size">Custom Size</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div className="flex items-end gap-4">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="width">Artwork Width (inches)</Label>
                    <Input
                      id="width"
                      value={artworkWidth}
                      onChange={(e) => handleWidthChange(e.target.value)}
                      onFocus={(e) => {
                        setTimeout(() => {
                          e.target.scrollIntoView({ behavior: "smooth", block: "center" });
                        }, 300);
                      }}
                      placeholder="e.g., 16 or 16 1/2"
                      className={!isValidDimensions && artworkWidth ? "border-destructive" : ""}
                      data-testid="input-width"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="height">Artwork Height (inches)</Label>
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
                      disabled={
                        serviceType === "print-and-frame" &&
                        uploadedImageAspectRatio !== null &&
                        selectedImage !== null
                      }
                      data-testid="input-height"
                    />
                  </div>
                </div>
                {artworkSizeValidation && !artworkSizeValidation.valid && artworkWidth && (
                  <p className="text-xs text-destructive">{artworkSizeValidation.message}</p>
                )}
                {serviceType === "print-and-frame" &&
                  uploadedImageAspectRatio !== null &&
                  selectedImage !== null && (
                    <p className="text-xs text-muted-foreground">
                      Height is locked to maintain image aspect ratio
                    </p>
                  )}
                <p className="text-xs text-muted-foreground">
                  Min 4&quot;. Decimals or fractions accepted (e.g., 16.5 or 16 1/2)
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="frame">
              <AccordionTrigger data-testid="accordion-frame">Frame Style</AccordionTrigger>
              <AccordionContent>
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
                        {frame.shortDescription && (
                          <p
                            className="text-xs text-muted-foreground/80 mb-1.5 italic"
                            data-testid="text-frame-short-description"
                          >
                            {frame.shortDescription}
                          </p>
                        )}
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
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
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
                          Top Mat: {selectedMat.name}
                        </Label>
                      ) : (
                        <Label>Mat: {selectedMat.name}</Label>
                      )}

                      <ColorSwatchesWithSeparator
                        standardColors={standardMats}
                        premiumColors={premiumMats}
                        selectedId={selectedMat.id}
                        onSelect={(mat) => {
                          setSelectedMat(mat);
                        }}
                        testIdPrefix="mat"
                      />
                    </div>

                    {matType === "double" && (
                      <>
                        {/* Visual separator for double mat sections */}
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
                            Accent Mat: {selectedMatInner.name}
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            Thin border mat visible around the opening
                          </p>

                          <ColorSwatchesWithSeparator
                            standardColors={standardMats}
                            premiumColors={premiumMats}
                            selectedId={selectedMatInner.id}
                            onSelect={(mat) => {
                              setSelectedMatInner(mat);
                            }}
                            testIdPrefix="mat-inner"
                          />
                        </div>
                      </>
                    )}
                  </>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Brass Nameplate Section - Type B behavior - only shown when mat is selected */}
            {matType !== "none" && (
              <AccordionItem value="nameplate">
                <AccordionTrigger data-testid="accordion-nameplate">
                  Engraved Brass Nameplate
                </AccordionTrigger>
                <AccordionContent>
                  <BrassNameplateSection
                    config={brassNameplateConfig}
                    onChange={setBrassNameplateConfig}
                    data-testid="section-brass-nameplate"
                    embedded={true}
                  />
                </AccordionContent>
              </AccordionItem>
            )}

            <AccordionItem value="glass">
              <AccordionTrigger data-testid="accordion-glass">Glazing & Backing</AccordionTrigger>
              <AccordionContent>
                <RadioGroup
                  value={selectedGlass.id}
                  onValueChange={(id) => setSelectedGlass(glassTypes.find((g) => g.id === id)!)}
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
                <p className="text-xs text-muted-foreground mt-3">
                  Includes foam core backing board.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="hardware" ref={hardwareSectionRef}>
              <AccordionTrigger data-testid="accordion-hardware">
                Hanging Hardware & Extras
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <HangingHardwareSection
                  hardwareType={hangingHardware}
                  setHardwareType={setHangingHardware}
                  frameWidth={frameWidth}
                  frameHeight={frameHeight}
                />

                <Separator />

                <div
                  className={`rounded-lg border-2 p-3 transition-all cursor-pointer ${
                    puzzleGlue
                      ? "border-primary bg-primary/5"
                      : "border-dashed border-muted-foreground/30 hover:border-muted-foreground/50 hover:bg-muted/30"
                  }`}
                  onClick={() => setPuzzleGlue(!puzzleGlue)}
                  data-testid="card-puzzle-glue"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-md ${puzzleGlue ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                    >
                      <Puzzle className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="puzzle-glue" className="cursor-pointer font-medium">
                          Puzzle Glue Sheets
                        </Label>
                        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
                          +$9.95
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Secure your finished puzzle for framing - no mess, no liquid glue.
                      </p>
                    </div>
                    <Checkbox
                      id="puzzle-glue"
                      checked={puzzleGlue}
                      onCheckedChange={(checked) => setPuzzleGlue(!!checked)}
                      data-testid="checkbox-puzzle-glue"
                      className="mt-1"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <PriceBox
            totalPrice={finalTotalPrice}
            quantity={quantity}
            onQuantityChange={setQuantity}
            onAddToCart={handleCheckout}
            isProcessing={isCheckingOut}
            disabled={
              !isValidDimensions ||
              isTooLarge ||
              (serviceType === "print-and-frame" && selectedImage !== null && !copyrightAgreed)
            }
            priceItems={priceItems}
            warnings={warnings}
            beforeButtons={
              serviceType === "print-and-frame" &&
              selectedImage &&
              !copyrightAgreed &&
              !isCopyrightCheckboxVisible ? (
                <div
                  className="flex items-start space-x-2 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md"
                  data-testid="sticky-copyright-checkbox"
                >
                  <input
                    type="checkbox"
                    id="copyright-agreement-sticky"
                    checked={copyrightAgreed}
                    onChange={(e) => setCopyrightAgreed(e.target.checked)}
                    className="mt-0.5"
                    data-testid="checkbox-copyright-sticky"
                  />
                  <Label htmlFor="copyright-agreement-sticky" className="text-xs cursor-pointer">
                    I confirm that I own or am authorized to reproduce this image and agree to the{" "}
                    <TermsOfServiceModal />.
                  </Label>
                </div>
              ) : undefined
            }
          />

          {/* SEO Content for Selected Frame Style */}
          <Card className="p-4">
            <h3 className="font-semibold">{selectedFrame.name} Picture Frame</h3>
            {selectedFrame.shortDescription && (
              <p
                className="text-xs italic text-muted-foreground mt-1"
                data-testid="text-frame-short-description"
              >
                {selectedFrame.shortDescription}
              </p>
            )}
            {selectedFrame.featuredDescription && (
              <p
                className="text-sm text-muted-foreground leading-relaxed mt-2"
                data-testid="text-frame-featured-description"
              >
                {selectedFrame.featuredDescription}
              </p>
            )}
          </Card>
        </div>
      </div>

      {/* Full Frame Preview Dialog */}
      <Dialog
        open={fullImageOpen}
        onOpenChange={(open) => {
          setFullImageOpen(open);
          if (!open) {
            // Reset to preview when closing
            setTimeout(() => setFullscreenImage("preview"), 300);
          }
        }}
      >
        <DialogContent
          className="p-0 !max-w-none !w-[100vw] !h-[100vh] md:!w-[95vw] md:!h-[95vh]"
          aria-describedby="frame-preview-description"
          style={{
            maxWidth: "100vw",
            maxHeight: "100vh",
            width: "100vw",
            height: "100vh",
          }}
        >
          <DialogTitle className="sr-only">
            {fullscreenImage === "preview"
              ? "Full Frame Preview"
              : fullscreenImage === "corner"
                ? "Corner Detail"
                : fullscreenImage === "profile"
                  ? "Profile View"
                  : "Lifestyle Image"}
          </DialogTitle>
          <div
            className="relative w-full h-full flex items-center justify-center bg-white p-2 md:p-8"
            id="frame-preview-description"
            style={{
              touchAction: "pinch-zoom",
              WebkitUserSelect: "none",
              userSelect: "none",
            }}
          >
            {/* Show alternate image if selected */}
            {fullscreenImage !== "preview" ? (
              <img
                src={
                  fullscreenImage === "corner"
                    ? framePhotos.cornerUrl
                    : fullscreenImage === "profile"
                      ? framePhotos.profileUrl
                      : framePhotos.lifestyleUrl
                }
                alt={
                  fullscreenImage === "corner"
                    ? "Corner Detail"
                    : fullscreenImage === "profile"
                      ? "Profile View"
                      : "Lifestyle Image"
                }
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <>
                {/* Render enlarged frame preview */}
                {isValidDimensions &&
                  (() => {
                    // Calculate larger display dimensions for dialog - use much larger artwork scale
                    const isMobile = window.innerWidth < 768;
                    const dialogArtworkScale = isMobile ? 200 : 150; // Larger scale on mobile for bigger preview
                    const dialogBorderScale = 40; // Separate smaller scale for borders
                    const dialogMaxWidth = isMobile
                      ? window.innerWidth * 0.98
                      : window.innerWidth * 0.9;
                    const dialogMaxHeight = isMobile
                      ? window.innerHeight * 0.98
                      : window.innerHeight * 0.85;

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

                    // Calculate proper scale for beveled edges (pixels per inch)
                    const dialogScale = dialogDisplayWidth / artWidth;
                    // Use same bevel width as preview (0.10") for visibility
                    // const bevelWidthInches = 0.10;
                    // const bevelWidthPx = dialogScale * bevelWidthInches; // Not currently used

                    return framePhotos.topUrl &&
                      framePhotos.bottomUrl &&
                      framePhotos.leftUrl &&
                      framePhotos.rightUrl ? (
                      // Photo-based fullscreen preview - four-piece frame construction with pre-oriented images
                      <div
                        style={{
                          width: `${dialogDisplayWidth + dialogMatBorder * 2 + dialogFrameBorder * 2}px`,
                          height: `${dialogDisplayHeight + dialogMatBorder * 2 + dialogFrameBorder * 2}px`,
                          position: "relative",
                          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)",
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
                            zIndex: 10,
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
                            zIndex: 10,
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
                            zIndex: 10,
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
                            zIndex: 10,
                          }}
                        />

                        {/* Lighting blend overlays for smooth transitions at corners */}
                        {/* Top-left corner blend */}
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: `${dialogFrameBorder * 1.5}px`,
                            height: `${dialogFrameBorder * 1.5}px`,
                            background:
                              "radial-gradient(circle at top left, rgba(255,255,255,0.03) 0%, transparent 70%)",
                            pointerEvents: "none",
                            mixBlendMode: "overlay",
                          }}
                        />

                        {/* Top-right corner blend */}
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            width: `${dialogFrameBorder * 1.5}px`,
                            height: `${dialogFrameBorder * 1.5}px`,
                            background:
                              "radial-gradient(circle at top right, rgba(255,255,255,0.03) 0%, transparent 70%)",
                            pointerEvents: "none",
                            mixBlendMode: "overlay",
                          }}
                        />

                        {/* Bottom-left corner blend */}
                        <div
                          style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            width: `${dialogFrameBorder * 1.5}px`,
                            height: `${dialogFrameBorder * 1.5}px`,
                            background:
                              "radial-gradient(circle at bottom left, rgba(255,255,255,0.03) 0%, transparent 70%)",
                            pointerEvents: "none",
                            mixBlendMode: "overlay",
                          }}
                        />

                        {/* Bottom-right corner blend */}
                        <div
                          style={{
                            position: "absolute",
                            bottom: 0,
                            right: 0,
                            width: `${dialogFrameBorder * 1.5}px`,
                            height: `${dialogFrameBorder * 1.5}px`,
                            background:
                              "radial-gradient(circle at bottom right, rgba(255,255,255,0.03) 0%, transparent 70%)",
                            pointerEvents: "none",
                            mixBlendMode: "overlay",
                          }}
                        />

                        {/* Mat/artwork area - adapted from preview sections */}
                        <div
                          style={{
                            position: "absolute",
                            top: `${dialogFrameBorder}px`,
                            left: `${dialogFrameBorder}px`,
                            right: `${dialogFrameBorder}px`,
                            bottom: `${dialogFrameBorder}px`,
                            zIndex: 0,
                          }}
                        >
                          {matType === "double" ? (
                            <div
                              className={getMatTextureClass(selectedMat)}
                              style={{
                                width: `${dialogDisplayWidth + dialogMatRevealDisplay * 2 + dialogMatBorder * 2}px`,
                                height: `${dialogDisplayHeight + dialogMatRevealDisplay * 2 + dialogMatBorder * 2}px`,
                                ...getMatTilingStyle(
                                  selectedMat.name,
                                  dialogScale,
                                  selectedMat.hexColor
                                ),
                                padding: `${dialogMatBorder}px`,
                                transition:
                                  "background-color 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
                              }}
                            >
                              <div
                                className={getMatTextureClass(selectedMatInner)}
                                style={{
                                  width: `${dialogDisplayWidth + dialogMatRevealDisplay * 2}px`,
                                  height: `${dialogDisplayHeight + dialogMatRevealDisplay * 2}px`,
                                  padding: `${dialogMatRevealDisplay}px`,
                                  ...getMatTilingStyle(
                                    selectedMatInner.name,
                                    dialogScale,
                                    selectedMatInner.hexColor
                                  ),
                                  border: `${Math.max(1.1, dialogScale * 0.08)}px solid ${getMatBevelColor(selectedMat.name)}`,
                                  transition:
                                    "background-color 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
                                  position: "relative",
                                }}
                              >
                                <div
                                  style={{
                                    position: "absolute",
                                    top: `${dialogMatRevealDisplay + Math.max(1, dialogScale * 0.1)}px`,
                                    left: `${dialogMatRevealDisplay + Math.max(1, dialogScale * 0.1)}px`,
                                    width: `calc(100% - ${2 * (dialogMatRevealDisplay + Math.max(1, dialogScale * 0.1))}px)`,
                                    height: `calc(100% - ${2 * (dialogMatRevealDisplay + Math.max(1, dialogScale * 0.1))}px)`,
                                    border: `${Math.max(1.1, dialogScale * 0.08)}px solid ${getMatBevelColor(selectedMatInner.name)}`,
                                    boxShadow: `inset 0 0 0 ${Math.max(1, dialogScale * 0.1)}px ${getMatBevelColor(selectedMatInner.name)}`,
                                  }}
                                >
                                  <img
                                    src={selectedImage || placeholderImage}
                                    alt="Full Preview"
                                    style={{
                                      position: "absolute",
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                      opacity: selectedImage ? 1 : 0.8,
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          ) : matType === "single" ? (
                            <div
                              className={getMatTextureClass(selectedMat)}
                              style={{
                                width: `${dialogDisplayWidth + dialogMatBorder * 2}px`,
                                height: `${dialogDisplayHeight + dialogMatBorder * 2}px`,
                                ...getMatTilingStyle(
                                  selectedMat.name,
                                  dialogScale,
                                  selectedMat.hexColor
                                ),
                                padding: `${dialogMatBorder}px`,
                                transition:
                                  "background-color 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
                              }}
                            >
                              <div
                                style={{
                                  width: `${dialogDisplayWidth}px`,
                                  height: `${dialogDisplayHeight}px`,
                                  position: "relative",
                                  backgroundColor: getMatBevelColor(selectedMat.name),
                                  border: `${Math.max(1.1, dialogScale * 0.08)}px solid ${getMatBevelColor(selectedMat.name)}`,
                                }}
                              >
                                <div
                                  style={{
                                    position: "absolute",
                                    top: `${Math.max(1, dialogScale * 0.1)}px`,
                                    left: `${Math.max(1, dialogScale * 0.1)}px`,
                                    right: `${Math.max(1, dialogScale * 0.1)}px`,
                                    bottom: `${Math.max(1, dialogScale * 0.1)}px`,
                                    boxShadow: `inset 0 0 0 ${Math.max(1, dialogScale * 0.1)}px ${getMatBevelColor(selectedMat.name)}`,
                                  }}
                                >
                                  <img
                                    src={selectedImage || placeholderImage}
                                    alt="Full Preview"
                                    style={{
                                      position: "absolute",
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                      opacity: selectedImage ? 1 : 0.8,
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div
                              style={{
                                width: `${dialogDisplayWidth}px`,
                                height: `${dialogDisplayHeight}px`,
                                position: "relative",
                              }}
                            >
                              <img
                                src={selectedImage || placeholderImage}
                                alt="Full Preview"
                                style={{
                                  position: "absolute",
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                  opacity: selectedImage ? 1 : 0.8,
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      // Synthetic fallback - adapted from preview sections
                      (() => {
                        return (
                          <div
                            style={{
                              width: `${dialogDisplayWidth + dialogMatBorder * 2 + dialogFrameBorder * 2}px`,
                              height: `${dialogDisplayHeight + dialogMatBorder * 2 + dialogFrameBorder * 2}px`,
                              borderTop: `${dialogFrameBorder}px solid ${selectedFrame.borderColor}`,
                              borderLeft: `${dialogFrameBorder}px solid ${selectedFrame.borderColor}`,
                              borderRight: `${dialogFrameBorder}px solid ${selectedFrame.color}`,
                              borderBottom: `${dialogFrameBorder}px solid ${selectedFrame.color}`,
                              boxShadow:
                                "inset 0 0 20px rgba(0,0,0,0.3), inset 0 1px 3px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.25)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              position: "relative",
                            }}
                            data-testid="dialog-frame-preview"
                          >
                            {matType === "double" ? (
                              <div
                                className={getMatTextureClass(selectedMat)}
                                style={{
                                  width: `${dialogDisplayWidth + dialogMatRevealDisplay * 2 + dialogMatBorder * 2}px`,
                                  height: `${dialogDisplayHeight + dialogMatRevealDisplay * 2 + dialogMatBorder * 2}px`,
                                  ...getMatTilingStyle(
                                    selectedMat.name,
                                    dialogScale,
                                    selectedMat.hexColor
                                  ),
                                  padding: `${dialogMatBorder}px`,
                                  transition:
                                    "background-color 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
                                }}
                              >
                                <div
                                  className={getMatTextureClass(selectedMatInner)}
                                  style={{
                                    width: `${dialogDisplayWidth + dialogMatRevealDisplay * 2}px`,
                                    height: `${dialogDisplayHeight + dialogMatRevealDisplay * 2}px`,
                                    padding: `${dialogMatRevealDisplay}px`,
                                    ...getMatTilingStyle(
                                      selectedMatInner.name,
                                      dialogScale,
                                      selectedMatInner.hexColor
                                    ),
                                    border: `${Math.max(1.1, dialogScale * 0.08)}px solid ${getMatBevelColor(selectedMat.name)}`,
                                    transition:
                                      "background-color 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
                                    position: "relative",
                                  }}
                                >
                                  <div
                                    style={{
                                      position: "absolute",
                                      top: `${dialogMatRevealDisplay + Math.max(1, dialogScale * 0.1)}px`,
                                      left: `${dialogMatRevealDisplay + Math.max(1, dialogScale * 0.1)}px`,
                                      width: `calc(100% - ${2 * (dialogMatRevealDisplay + Math.max(1, dialogScale * 0.1))}px)`,
                                      height: `calc(100% - ${2 * (dialogMatRevealDisplay + Math.max(1, dialogScale * 0.1))}px)`,
                                      border: `${Math.max(1.1, dialogScale * 0.08)}px solid ${getMatBevelColor(selectedMatInner.name)}`,
                                      boxShadow: `inset 0 0 0 ${Math.max(1, dialogScale * 0.1)}px ${getMatBevelColor(selectedMatInner.name)}`,
                                    }}
                                  >
                                    <img
                                      src={selectedImage || placeholderImage}
                                      alt="Full Preview"
                                      style={{
                                        position: "absolute",
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        opacity: selectedImage ? 1 : 0.8,
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            ) : matType === "single" ? (
                              <div
                                className={getMatTextureClass(selectedMat)}
                                style={{
                                  width: `${dialogDisplayWidth + dialogMatBorder * 2}px`,
                                  height: `${dialogDisplayHeight + dialogMatBorder * 2}px`,
                                  ...getMatTilingStyle(
                                    selectedMat.name,
                                    dialogScale,
                                    selectedMat.hexColor
                                  ),
                                  padding: `${dialogMatBorder}px`,
                                  transition:
                                    "background-color 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
                                }}
                              >
                                <div
                                  style={{
                                    width: `${dialogDisplayWidth}px`,
                                    height: `${dialogDisplayHeight}px`,
                                    position: "relative",
                                    backgroundColor: getMatBevelColor(selectedMat.name),
                                    border: `${Math.max(1.1, dialogScale * 0.08)}px solid ${getMatBevelColor(selectedMat.name)}`,
                                  }}
                                >
                                  <div
                                    style={{
                                      position: "absolute",
                                      top: `${Math.max(1, dialogScale * 0.1)}px`,
                                      left: `${Math.max(1, dialogScale * 0.1)}px`,
                                      right: `${Math.max(1, dialogScale * 0.1)}px`,
                                      bottom: `${Math.max(1, dialogScale * 0.1)}px`,
                                      boxShadow: `inset 0 0 0 ${Math.max(1, dialogScale * 0.1)}px ${getMatBevelColor(selectedMat.name)}`,
                                    }}
                                  >
                                    <img
                                      src={selectedImage || placeholderImage}
                                      alt="Full Preview"
                                      style={{
                                        position: "absolute",
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        opacity: selectedImage ? 1 : 0.8,
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div
                                style={{
                                  width: `${dialogDisplayWidth}px`,
                                  height: `${dialogDisplayHeight}px`,
                                  position: "relative",
                                }}
                              >
                                <img
                                  src={selectedImage || placeholderImage}
                                  alt="Full Preview"
                                  style={{
                                    position: "absolute",
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    opacity: selectedImage ? 1 : 0.8,
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        );
                      })()
                    );
                  })()}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Mobile Sticky Bottom Bar - Shows when scrolled to configurator */}
      {!hideMobileSticky && (
        <div
          className={`block md:hidden fixed left-0 right-0 bottom-0 bg-background/95 backdrop-blur-sm border-t border-border shadow-lg z-50 transition-all duration-300 ease-in-out ${
            showMobileBar
              ? "translate-y-0 opacity-100"
              : "translate-y-full opacity-0 pointer-events-none"
          }`}
        >
          <div className="px-4 py-3 space-y-2">
            {/* Sticky Copyright Checkbox - appears when original is scrolled out of view */}
            {serviceType === "print-and-frame" &&
              selectedImage &&
              !copyrightAgreed &&
              !isCopyrightCheckboxVisible && (
                <div
                  className="flex items-start gap-2 p-2 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md"
                  data-testid="sticky-copyright-checkbox-mobile"
                >
                  <input
                    type="checkbox"
                    id="copyright-agreement-sticky-mobile"
                    checked={copyrightAgreed}
                    onChange={(e) => setCopyrightAgreed(e.target.checked)}
                    className="mt-0.5"
                    data-testid="checkbox-copyright-sticky-mobile"
                  />
                  <Label
                    htmlFor="copyright-agreement-sticky-mobile"
                    className="text-xs cursor-pointer leading-tight"
                  >
                    I confirm that I own or am authorized to reproduce this image and agree to the{" "}
                    <TermsOfServiceModal />.
                  </Label>
                </div>
              )}
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
                disabled={
                  !isValidDimensions ||
                  isTooLarge ||
                  isCheckingOut ||
                  (serviceType === "print-and-frame" && selectedImage !== null && !copyrightAgreed)
                }
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
      {!hideMobileSticky && !showRecommendations && !showARViewer && (
        <Button
          size="lg"
          className={`fixed bottom-20 right-6 z-[60] lg:hidden shadow-lg rounded-full h-14 px-6 transition-all duration-300 ${
            showMobileBar
              ? "translate-y-0 opacity-100"
              : "translate-y-32 opacity-0 pointer-events-none"
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

      {/* AI Designer's Recommendation Modal */}
      <RecommendationCarousel
        recommendations={recommendations}
        onApply={handleApplyRecommendation}
        onAddToCart={handleAddRecommendationToCart}
        onClose={() => setShowRecommendations(false)}
        uploadedImage={selectedImage}
        open={showRecommendations}
      />

      {/* Photo Upload Modal */}
      <PhotoUploadOptions
        open={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onGetUploadParameters={handleGetUploadParameters}
        onComplete={handleUploadComplete}
        onUrlSubmit={handleUrlUpload}
        onImageUpdate={(url: string) => setSelectedImage(url)}
      />

      {/* AR Viewer Modal */}
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
            glassTypeId: selectedGlass.id,
            imageUrl: displayImage,
            copyrightAgreed,
          }}
          onClose={() => setShowARViewer(false)}
          onSizeUpdate={(newWidth: number, newHeight: number) => {
            // Update dimensions from AR resize
            setArtworkWidth(newWidth.toString());
            setArtworkHeight(newHeight.toString());

            // Show success toast
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
