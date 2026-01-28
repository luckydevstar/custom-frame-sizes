import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import {
  Upload,
  Copy,
  Maximize,
  X,
  ShoppingCart,
  Eye,
  Settings,
  Info,
  Smartphone,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "../ui/button";
import { QuantitySelector } from "../ui/quantity-selector";
import { Card } from "../ui/card";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
// Select components not currently used but may be needed in future
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Checkbox } from "../ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

// Import types from @framecraft/types
import type { FrameStyle, FrameConfiguration } from "@framecraft/types";

// Import services from @framecraft/core
import { getFramesByCategory, calculatePricing } from "@framecraft/core";

// Import utilities from @framecraft/core
import {
  parseFraction,
  validateArtworkSize,
  computePreviewLayout,
  getSharedAssetUrl,
} from "@framecraft/core";

// Import hooks from @framecraft/core
import { useIsMobile, useMobileViewToggle, useIntersectionVisible } from "@framecraft/core";

// TODO: Extract these app-specific dependencies or make them injectable
// - TermsOfServiceModal component
// - PhotoUploadOptions component
// - ARViewer component
// - shopify service (addToCart, isShopifyEnabled)
// - useToast hook
// - stockImages utilities (getRandomStockImage)
// - TrustBadges, TrustBox components
// - HangingHardwareSection component
// - CanvasLifestyleCarousel component
// - printCompositor service (calculateCanvasPrintDimensions, generateCanvasPrintFile, checkImageResolution)
// - apiRequest from queryClient
// - floaterFrameDiagram asset
// - @uppy/core types
import { TermsOfServiceModal } from "../shared/TermsOfServiceModal";
// Asset imports need to be handled at app level - placeholder for now
// TODO: Add canvas floater diagram image
// import floaterFrameDiagram from "@assets/image_1765893431262.png";
import { ARViewer } from "../shared/ARViewer";
import { PhotoUploadOptions } from "../shared/PhotoUploadOptions";
import type { UploadResult } from "@uppy/core";
import { apiRequest } from "@framecraft/core";
import { addToCart, isShopifyEnabled } from "@framecraft/core";
import { useToast } from "../../hooks/use-toast";
import { getRandomStockImage } from "@framecraft/core";
import { TrustBadges } from "../marketing/TrustBadges";
import { TrustBox } from "../marketing/TrustBox";
import { HangingHardwareSection } from "./shared/HangingHardwareSection";
import { CanvasLifestyleCarousel, CANVAS_LIFESTYLE_IMAGES } from "./CanvasLifestyleCarousel";
import {
  calculateCanvasPrintDimensions,
  generateCanvasPrintFile,
  checkImageResolution,
} from "@framecraft/core";

// Get canvas float frames from products service
const canvasFrames = getFramesByCategory("canvas");

// Define available depths and organize frames by depth
const CANVAS_DEPTHS = [1.0, 1.375, 1.5, 1.625] as const;
type CanvasDepth = (typeof CANVAS_DEPTHS)[number];

// Depth labels for display
const DEPTH_LABELS: Record<CanvasDepth, string> = {
  1.0: '1"',
  1.375: '1⅜"',
  1.5: '1½"',
  1.625: '1⅝"',
};

// Theme labels for 1.625" depth
const THEME_LABELS: Record<string, string> = {
  classic: "Classic",
  barnwood: "Barnwood",
  metallic: "Metallic",
};

// Unique copy for each canvas frame SKU (5th grade reading level)
const CANVAS_FRAME_COPY: Record<string, string> = {
  // Barnwood collection (1.625" depth)
  "10764":
    "This white barnwood frame has a cozy, beach-house feel. It looks great with bright, colorful canvas art.",
  "10765":
    "The soft gray barnwood finish works with almost any room. It adds a calm, modern touch to your canvas.",
  "10766":
    "Rich brown barnwood brings warmth to your space. This frame pairs well with nature scenes and earthy tones.",
  "10767":
    "Black barnwood gives you rustic charm with a bold edge. It makes colorful artwork really pop.",
  // Black frames (various depths)
  "10117":
    "A slim black frame for thinner canvases. Clean and simple, it lets your art take center stage.",
  "10426":
    "This black frame fits most standard canvas depths. Its sleek look works in any room style.",
  "10627":
    "A deeper black frame for thicker canvases. The extra depth creates a bold shadow effect.",
  // Black/Gold frames (various depths)
  "10494":
    "Black with a gold inner edge adds a touch of class. Perfect for art that deserves extra attention.",
  "10428":
    "The gold accent on this black frame catches the light. It brings a warm glow to your canvas.",
  "10564":
    "A deeper frame with gold trim for thicker canvases. It adds elegance without being too fancy.",
  "10104":
    "Our deepest black and gold frame for thick canvases. The gold edge creates a beautiful floating look.",
  "11345":
    "Brushed gold metal gives your canvas a gallery feel. This shiny finish works great in modern spaces.",
  // Black/Silver frames (various depths)
  "10495":
    "Black with a silver inner edge looks cool and modern. Great for black-and-white or blue-toned art.",
  "10427": "The silver accent brightens up this black frame. It adds shine without being too bold.",
  "10565":
    "A deeper frame with silver trim for thicker canvases. The metal touch feels fresh and clean.",
  "10105":
    "Our deepest black and silver frame for thick canvases. The silver edge makes your art appear to float.",
  "11351":
    "Brushed silver metal creates a sleek, modern look. This frame fits perfectly in contemporary homes.",
  // Natural wood (1.375" depth)
  "10694":
    "Natural wood shows off real grain patterns. This warm frame brings an organic, earthy feel to your art.",
};

// Group frames by depth
function getFramesByDepth(depth: CanvasDepth): FrameStyle[] {
  return canvasFrames.filter((f) => f.usableDepth === depth);
}

// For 1.625" depth, group by theme
function getFramesByTheme(frames: FrameStyle[]): Record<string, FrameStyle[]> {
  const grouped: Record<string, FrameStyle[]> = {};
  frames.forEach((frame) => {
    const theme = (frame as { theme?: string }).theme || "other";
    if (!grouped[theme]) grouped[theme] = [];
    grouped[theme].push(frame);
  });
  return grouped;
}

interface CanvasFrameDesignerProps {
  hideMobileSticky?: boolean;
}

export function CanvasFrameDesigner({ hideMobileSticky = false }: CanvasFrameDesignerProps = {}) {
  const [serviceType, setServiceType] = useState<"frame-only" | "print-and-frame">("frame-only");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Depth-first selection: track selected depth tab (default to 1" depth)
  const [selectedDepth, setSelectedDepth] = useState<CanvasDepth>(1.0);

  // Get default frame for the initial depth (1" deep black frame)
  const defaultFrame =
    canvasFrames.find((f) => f.usableDepth === 1.0 && f.name.toLowerCase().includes("black")) ||
    canvasFrames.find((f) => f.usableDepth === 1.0) ||
    canvasFrames[0];
  const [selectedFrame, setSelectedFrame] = useState<FrameStyle>(defaultFrame ?? canvasFrames[0]!);
  const [copyrightAgreed, setCopyrightAgreed] = useState(false);
  const [uploadedImageAspectRatio, setUploadedImageAspectRatio] = useState<number | null>(null);
  const [uploadedImageDimensions, setUploadedImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [fullImageOpen, setFullImageOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isGeneratingPrint, setIsGeneratingPrint] = useState(false);
  const [previousImage, setPreviousImage] = useState<string | null>(null);
  const prevImageRef = useRef<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [hangingHardware, setHangingHardware] = useState<"standard" | "security">("standard");

  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Ref for copyright checkbox (must be declared before useIntersectionVisible hook)
  const copyrightCheckboxRef = useRef<HTMLDivElement>(null);

  // Mobile view toggle with scroll position memory
  const { mobileView, setMobileView, showMobileBar, previewCardRef, controlsHeadingRef } =
    useMobileViewToggle({ isMobile });

  // Track if copyright checkbox is visible (for sticky checkbox feature)
  const isCopyrightCheckboxVisible = useIntersectionVisible(
    copyrightCheckboxRef,
    { threshold: 0.4 },
    [selectedImage, serviceType]
  );

  // Custom dimensions - canvas size
  const [artworkWidth, setArtworkWidth] = useState("16");
  const [artworkHeight, setArtworkHeight] = useState("20");

  // Container size tracking for responsive preview
  const [containerSize, setContainerSize] = useState({ width: 600, height: 500 });
  const previewContainerRef = useRef<HTMLDivElement>(null);

  // Desktop pricing sidebar state - starts condensed, expands when scrolled
  const [pricingSidebarExpanded, setPricingSidebarExpanded] = useState(false);
  const hardwareSectionRef = useRef<HTMLDivElement>(null);

  // Generate stable random seed for placeholder image (only changes on page load)
  const [placeholderSeed] = useState(() => Math.floor(Math.random() * 1000));

  // Get stable placeholder image from canvas paintings
  const placeholderImage = useMemo(
    () => getRandomStockImage(placeholderSeed, "canvas_paintings"),
    [placeholderSeed]
  );

  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);

  // AR viewer state
  const [showARViewer, setShowARViewer] = useState(false);

  // Frame photos state (corner, profile, lifestyle)
  const [framePhotos, setFramePhotos] = useState<{
    cornerUrl?: string;
    profileUrl?: string;
    lifestyleUrl?: string;
  }>({});

  // Fullscreen image type for dialog
  const [fullscreenImage, setFullscreenImage] = useState<
    "preview" | "corner" | "profile" | "lifestyle"
  >("preview");

  // Get random lifestyle image from CANVAS_LIFESTYLE_IMAGES array
  const getRandomLifestyleImage = useCallback(() => {
    if (CANVAS_LIFESTYLE_IMAGES.length === 0) return "";
    const randomIndex = Math.floor(Math.random() * CANVAS_LIFESTYLE_IMAGES.length);
    return CANVAS_LIFESTYLE_IMAGES[randomIndex]?.url ?? "";
  }, []);

  const configuratorRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const [,] = useLocation();

  // Load configuration from URL parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const frameId = params.get("frame");
    const depth = params.get("depth");
    const width = params.get("width");
    const height = params.get("height");
    const service = params.get("service");
    const hardware = params.get("hardware");

    // Determine target depth and frame
    let targetDepth: CanvasDepth = 1.625; // Default
    let targetFrame: FrameStyle | null = null;

    // Try to find frame by ID first
    if (frameId) {
      const frame = canvasFrames.find((f) => f.id === frameId);
      if (frame && CANVAS_DEPTHS.includes(frame.usableDepth as CanvasDepth)) {
        targetDepth = frame.usableDepth as CanvasDepth;
        targetFrame = frame;
      }
    }

    // If frame wasn't found but depth is provided, use that depth
    if (!targetFrame && depth) {
      const depthNum = parseFloat(depth) as CanvasDepth;
      if (CANVAS_DEPTHS.includes(depthNum)) {
        targetDepth = depthNum;
      }
    }

    // If still no frame selected, pick first frame in target depth
    if (!targetFrame) {
      const framesInDepth = getFramesByDepth(targetDepth);
      if (framesInDepth.length > 0) {
        targetFrame = framesInDepth[0] ?? null;
      } else {
        // Fallback: find first depth with frames
        for (const d of CANVAS_DEPTHS) {
          const frames = getFramesByDepth(d);
          if (frames.length > 0) {
            targetDepth = d;
            targetFrame = frames[0] ?? null;
            break;
          }
        }
      }
    }

    // Apply the determined depth and frame
    setSelectedDepth(targetDepth);
    if (targetFrame) {
      setSelectedFrame(targetFrame);
    } else if (canvasFrames.length > 0) {
      // Ultimate fallback: use first available canvas frame
      const firstFrame = canvasFrames[0];
      if (firstFrame) {
        setSelectedFrame(firstFrame);
        if (CANVAS_DEPTHS.includes(firstFrame.usableDepth as CanvasDepth)) {
          setSelectedDepth(firstFrame.usableDepth as CanvasDepth);
        }
      }
    }

    if (width) setArtworkWidth(width);
    if (height) setArtworkHeight(height);
    if (service === "frame-only" || service === "print-and-frame") setServiceType(service);
    if (hardware === "standard" || hardware === "security") setHangingHardware(hardware);
  }, []);

  // Update URL when configuration changes
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("frame", selectedFrame.id);
    params.set("depth", selectedDepth.toString());
    params.set("width", artworkWidth);
    params.set("height", artworkHeight);
    params.set("service", serviceType);
    params.set("hardware", hangingHardware);

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  }, [selectedFrame, selectedDepth, artworkWidth, artworkHeight, serviceType, hangingHardware]);

  // Fetch frame photos from local storage when frame changes
  useEffect(() => {
    // Get random lifestyle image from CANVAS_LIFESTYLE_IMAGES immediately
    const randomLifestyle = getRandomLifestyleImage();

    // Set lifestyle image immediately while loading corner/profile
    setFramePhotos({
      lifestyleUrl: randomLifestyle,
    });

    if (!selectedFrame.sku) {
      return;
    }

    async function fetchFramePhotos() {
      try {
        const response = await fetch(`/api/frames/${selectedFrame.sku}/photos`);
        if (response.ok) {
          const photoSet = await response.json();
          // Prefer style-specific lifestyle from API, fallback to random generic
          setFramePhotos({
            cornerUrl: photoSet.cornerUrl,
            profileUrl: photoSet.profileUrl,
            lifestyleUrl: photoSet.lifestyleUrl || randomLifestyle,
          });
        } else {
          // API failed but keep lifestyle image
          setFramePhotos({
            lifestyleUrl: randomLifestyle,
          });
        }
      } catch (error) {
        console.error("Error fetching frame photos:", error);
        // Keep lifestyle image even on error
        setFramePhotos({
          lifestyleUrl: randomLifestyle,
        });
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
    return undefined;
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
  }, []);

  // Desktop pricing sidebar expansion - expands when user reaches hardware section
  useEffect(() => {
    // Only run on desktop/tablet (md and up)
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    if (!isDesktop) return;

    let scrollTimeout: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
      // Debounce scroll events for better performance
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;

        // Expand pricing sidebar when hardware section approaches the viewport
        // This keeps the sidebar condensed until user reaches the end of customization options
        if (hardwareSectionRef.current) {
          const hardwareTop =
            hardwareSectionRef.current.getBoundingClientRect().top + window.scrollY;
          // Expand when hardware section is about 1 screen away (windowHeight px before it)
          const expandThreshold = hardwareTop - windowHeight;

          if (scrollPosition > expandThreshold && !pricingSidebarExpanded) {
            setPricingSidebarExpanded(true);
          } else if (scrollPosition <= 100 && pricingSidebarExpanded) {
            // Collapse back when scrolling near the top
            setPricingSidebarExpanded(false);
          }
        }
      }, 50); // 50ms debounce
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearTimeout(scrollTimeout);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pricingSidebarExpanded]);

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
      if (!uploadedFile) return;
      // The upload URL was stored in file meta by PhotoUploadOptions
      const uploadURL = uploadedFile.meta?.uploadURL as string;

      if (uploadURL) {
        try {
          // Store the image URL for display and future order processing
          const response = await apiRequest("PUT", "/api/frame-images", { imageURL: uploadURL });
          const data = await response.json();

          // Calculate aspect ratio and dimensions from uploaded image
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

      // Calculate aspect ratio and dimensions from URL image
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

    // Validate Print and Frame requirements
    if (serviceType === "print-and-frame") {
      if (!selectedImage) {
        toast({
          title: "Image Required",
          description: "Please upload an image to use the Print and Frame service.",
          variant: "destructive",
        });
        return;
      }

      if (!copyrightAgreed) {
        toast({
          title: "Copyright Agreement Required",
          description: "Please agree to the copyright terms before proceeding.",
          variant: "destructive",
        });
        return;
      }
    }

    setIsCheckingOut(true);

    try {
      // Generate canvas print file for Print and Frame service
      if (serviceType === "print-and-frame" && selectedImage) {
        setIsGeneratingPrint(true);

        toast({
          title: "Generating Print File",
          description: "Creating your canvas print with gallery wrap edges...",
        });

        try {
          // Calculate canvas print dimensions
          const canvasDimensions = calculateCanvasPrintDimensions(artWidth, artHeight);

          // Check if upscaling is needed and request it
          if (uploadedImageDimensions) {
            const resolutionCheck = checkImageResolution(
              uploadedImageDimensions.width,
              uploadedImageDimensions.height,
              canvasDimensions.printedImageWidth,
              canvasDimensions.printedImageHeight
            );

            // Request upscaling if needed
            if (!resolutionCheck.sufficient && resolutionCheck.recommendedUpscale > 1) {
              toast({
                title: "AI Upscaling",
                description: `Enhancing image quality with ${resolutionCheck.recommendedUpscale}x AI upscaling for crisp 300 DPI printing...`,
              });

              // Call upscaling API
              const upscaleResponse = await apiRequest("POST", "/api/upscale", {
                imageUrl: selectedImage,
                targetWidth: canvasDimensions.printedImageWidth,
                targetHeight: canvasDimensions.printedImageHeight,
                currentWidth: uploadedImageDimensions.width,
                currentHeight: uploadedImageDimensions.height,
              });

              const upscaleResult = await upscaleResponse.json();

              if (upscaleResult.upscaledUrl) {
                // Generate print file with upscaled image
                await generateCanvasPrintFile(upscaleResult.upscaledUrl, canvasDimensions);
              } else {
                // Generate with original image if upscaling failed
                await generateCanvasPrintFile(selectedImage, canvasDimensions);
              }
            } else {
              // No upscaling needed - generate print file directly
              await generateCanvasPrintFile(selectedImage, canvasDimensions);
            }
          } else {
            // No dimension info - generate print file directly
            await generateCanvasPrintFile(selectedImage, canvasDimensions);
          }

          toast({
            title: "Print File Ready",
            description: "Your canvas print has been prepared with mirrored gallery wrap edges.",
          });
        } catch (printError) {
          console.error("Error generating canvas print file:", printError);
          toast({
            title: "Print Generation Warning",
            description: "Print file could not be generated, but order will proceed.",
            variant: "destructive",
          });
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

  // Parse dimensions with validation
  const artWidth = parseFraction(artworkWidth);
  const artHeight = parseFraction(artworkHeight);

  // Artwork size validation - minimum 4×4 inches
  const artworkSizeValidation = useMemo(() => {
    if (artWidth === 0 && artHeight === 0) return null; // Don't validate empty inputs
    return validateArtworkSize(artWidth, artHeight);
  }, [artWidth, artHeight]);

  // Validation - prevent invalid calculations
  const isValidDimensions =
    artWidth > 0 && artHeight > 0 && (!artworkSizeValidation || artworkSizeValidation.valid);

  // Create frame configuration for pricing calculation (always use matType='none' for canvas)
  const frameConfig: FrameConfiguration = useMemo(
    () => ({
      serviceType,
      artworkWidth: artWidth,
      artworkHeight: artHeight,
      frameStyleId: selectedFrame.id,
      matType: "none", // Always no mat for canvas float frames
      matBorderWidth: 0,
      matRevealWidth: 0,
      matColorId: "", // Empty string for no mat
      matInnerColorId: undefined,
      glassTypeId: "standard", // Default to standard for pricing
      imageUrl: selectedImage || undefined,
      copyrightAgreed,
    }),
    [serviceType, artWidth, artHeight, selectedFrame.id, selectedImage, copyrightAgreed]
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
  const { total: totalPrice, isTooLarge } = pricing;

  // Calculate hardware pricing (no puzzle glue for canvas)
  const hardwarePrice = hangingHardware === "security" ? 8.95 : 0;
  const finalTotalPrice = totalPrice + hardwarePrice;

  // Calculate overall frame dimensions for display (canvas float frame - minimal border)
  const frameWidth = isValidDimensions ? artWidth + selectedFrame.mouldingWidth * 2 : 0;
  const frameHeight = isValidDimensions ? artHeight + selectedFrame.mouldingWidth * 2 : 0;

  // Calculate aspect ratio for proportional display (needed for dialog)
  const aspectRatio = isValidDimensions ? artWidth / artHeight : 1;

  // Calculate canvas print dimensions for resolution checking
  const canvasPrintDimensions = useMemo(() => {
    if (!isValidDimensions) return null;
    return calculateCanvasPrintDimensions(artWidth, artHeight);
  }, [artWidth, artHeight, isValidDimensions]);

  // Check image resolution for canvas printing (needs to cover printed area + mirrored edges)
  // Note: resolutionStatus is calculated but not currently displayed in UI
  // TODO: Display resolution status in UI when needed
  // Calculated for future use - keeping the calculation but not storing result
  useMemo(() => {
    if (!uploadedImageDimensions || !canvasPrintDimensions) return null;

    // Check against the printed image size (which includes stretcher wrap)
    // Result will be used when UI is implemented
    return checkImageResolution(
      uploadedImageDimensions.width,
      uploadedImageDimensions.height,
      canvasPrintDimensions.printedImageWidth,
      canvasPrintDimensions.printedImageHeight
    );
  }, [uploadedImageDimensions, canvasPrintDimensions]);

  // Exaggerate display width for canvas float frames for better preview visibility
  // Maps SKU to exaggerated display width in inches
  const displayMouldingWidth = useMemo(() => {
    const frameWidthExaggerations: Record<string, number> = {
      // 0.25" actual → 0.75" display (1" depth frames)
      "10117": 0.75,
      "10494": 0.75,
      "10495": 0.75,
      // 1.375" depth frames → 0.75" display
      "10426": 0.75,
      "10427": 0.75,
      "10428": 0.75,
      "10694": 0.75,
      // 1.625" depth frames → 2" display
      "10564": 2,
      "10565": 2,
      "10627": 2,
      // 1.5" depth frames → 1.25" display
      "10104": 1.25,
      "10105": 1.25,
      // Barnwood and metal frames → 1.1" display
      "10764": 1.1,
      "10765": 1.1,
      "10766": 1.1,
      "10767": 1.1,
      "11345": 1.1,
      "11351": 1.1,
    };
    if (selectedFrame.sku && frameWidthExaggerations[selectedFrame.sku] !== undefined) {
      return frameWidthExaggerations[selectedFrame.sku];
    }
    return selectedFrame.mouldingWidth;
  }, [selectedFrame.sku, selectedFrame.mouldingWidth]);

  // Float gap constant - the space between canvas and frame inner edge
  const FLOAT_GAP_INCHES = 0.15;

  // Compute preview layout using single-scale containment system
  // For canvas float frames, use reduced frame width for visual effect
  const layout = useMemo(() => {
    return computePreviewLayout({
      artW: artWidth,
      artH: artHeight,
      matBorder: FLOAT_GAP_INCHES, // Float gap around canvas (simulates floating effect)
      frameFace: (displayMouldingWidth ?? selectedFrame.mouldingWidth) * 0.35, // Reduce frame width to 35% for float frame effect
      containerWpx: containerSize.width,
      containerHpx: containerSize.height,
      paddingPx: 12,
    });
  }, [artWidth, artHeight, displayMouldingWidth, containerSize, selectedFrame.mouldingWidth]);

  return (
    <>
      {/* Sentinel element for mobile sticky bar - triggers when scrolled out of view */}
      <div ref={sentinelRef} className="h-px" aria-hidden="true" />

      <div
        ref={configuratorRef}
        className="grid grid-cols-1 lg:grid-cols-[1.5fr,1fr] gap-6 pb-24 md:pb-12"
      >
        <div>
          <Card
            ref={previewCardRef}
            className={`p-4 md:p-6 lg:sticky lg:top-[132px] lg:self-start ${mobileView === "controls" ? "hidden lg:block" : ""}`}
          >
            {/* Upload and AR Buttons - Compact pills above preview */}
            <div className="mb-3 flex justify-center gap-2 flex-wrap">
              <Button
                onClick={() => setShowUploadModal(true)}
                className="h-8 text-sm px-4"
                data-testid="button-upload"
              >
                <Upload className="h-3.5 w-3.5 mr-2" />
                Upload Your Image to Preview or Print
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowARViewer(true)}
                disabled={!isValidDimensions || isTooLarge}
                className="h-8 text-sm px-4 md:hidden"
                data-testid="button-view-ar-canvas"
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
                  onClick={() => {
                    setFullscreenImage("preview");
                    setFullImageOpen(true);
                  }}
                  className="bg-background/90 hover:bg-background p-2 rounded-md shadow-lg hover-elevate active-elevate-2"
                  data-testid="button-expand-preview"
                >
                  <Maximize className="h-5 w-5" />
                </button>
              </div>

              <div
                className="preview-stage"
                style={{
                  width: `${layout.outerPx.w}px`,
                  height: `${layout.outerPx.h}px`,
                }}
              >
                {/* Canvas float frame - thin decorative border */}
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                    boxShadow: "inset 0 0 8px rgba(0,0,0,0.2), 0 2px 12px rgba(0,0,0,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "white",
                  }}
                  data-testid="preview-frame"
                >
                  {/* Frame texture images or fallback to solid borders */}
                  {selectedFrame.photos?.topUrl ? (
                    <>
                      {/* Top edge */}
                      <img
                        src={selectedFrame.photos.topUrl}
                        alt="Frame top"
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: `${layout.frameFacePx}px`,
                          objectFit: "cover",
                        }}
                      />
                      {/* Bottom edge */}
                      <img
                        src={selectedFrame.photos.bottomUrl}
                        alt="Frame bottom"
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          width: "100%",
                          height: `${layout.frameFacePx}px`,
                          objectFit: "cover",
                        }}
                      />
                      {/* Left edge */}
                      <img
                        src={selectedFrame.photos.leftUrl}
                        alt="Frame left"
                        style={{
                          position: "absolute",
                          top: `${layout.frameFacePx}px`,
                          left: 0,
                          width: `${layout.frameFacePx}px`,
                          height: `calc(100% - ${layout.frameFacePx * 2}px)`,
                          objectFit: "cover",
                        }}
                      />
                      {/* Right edge */}
                      <img
                        src={selectedFrame.photos.rightUrl}
                        alt="Frame right"
                        style={{
                          position: "absolute",
                          top: `${layout.frameFacePx}px`,
                          right: 0,
                          width: `${layout.frameFacePx}px`,
                          height: `calc(100% - ${layout.frameFacePx * 2}px)`,
                          objectFit: "cover",
                        }}
                      />
                    </>
                  ) : (
                    /* Fallback to solid color borders when no textures available */
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        borderTop: `${layout.frameFacePx}px solid ${selectedFrame.borderColor}`,
                        borderLeft: `${layout.frameFacePx}px solid ${selectedFrame.borderColor}`,
                        borderRight: `${layout.frameFacePx}px solid ${selectedFrame.color}`,
                        borderBottom: `${layout.frameFacePx}px solid ${selectedFrame.color}`,
                        pointerEvents: "none",
                        transition: "border-color 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
                      }}
                    />
                  )}
                  {/* Float gap layer - colored with frame base color to simulate floating effect */}
                  <div
                    style={{
                      width: `${layout.glassPx.w}px`,
                      height: `${layout.glassPx.h}px`,
                      backgroundColor: selectedFrame.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      transition: "background-color 450ms cubic-bezier(0.19, 1.0, 0.22, 1.0)",
                    }}
                    data-testid="preview-float-gap"
                  >
                    {/* Canvas image - centered within the float gap */}
                    <div
                      style={{
                        width: `${layout.openingPx.w}px`,
                        height: `${layout.openingPx.h}px`,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "white",
                        position: "relative",
                      }}
                    >
                      {selectedImage ? (
                        <>
                          {/* Previous image fading out */}
                          {previousImage && (
                            <img
                              src={previousImage}
                              alt="Previous"
                              className="image-fade-out"
                              style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          )}
                          {/* Current image fading in */}
                          <img
                            src={selectedImage}
                            alt="Preview"
                            className={previousImage ? "image-fade-in" : ""}
                            style={{
                              position: previousImage ? "absolute" : "static",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                            data-testid="img-preview"
                          />
                        </>
                      ) : (
                        <img
                          src={placeholderImage}
                          alt="Canvas Placeholder"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            opacity: 0.8,
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Caption shown only when displaying placeholder image */}
            {!selectedImage && (
              <p className="text-xs md:text-sm text-muted-foreground/70 text-center mt-2 leading-tight">
                Sample image shown for display only. Not included with purchase.
              </p>
            )}

            {/* Dimensions Display - matches Picture Frame Designer format */}
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
                Canvas: {artWidth}&quot; × {artHeight}&quot;
              </p>
            </div>

            {/* Corner, Profile, Lifestyle Photos Grid */}
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

            {/* Trust Indicators */}
            <TrustBox />
          </Card>

          {/* Trust Badges - Desktop only, placed under preview */}
          <div className="hidden lg:block mt-4">
            <TrustBadges />
          </div>
        </div>

        <div
          ref={controlsHeadingRef}
          className={`space-y-6 ${mobileView === "preview" ? "hidden lg:block" : ""}`}
        >
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
                    data-testid="radio-frame-only"
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
                    data-testid="radio-print-and-frame"
                  />
                  <span className="font-semibold">Print and Frame</span>
                </Label>
              </div>
            </RadioGroup>
            {serviceType === "print-and-frame" && !selectedImage && (
              <p className="text-xs text-muted-foreground mt-2">
                Upload an image to use Print and Frame service
              </p>
            )}
            {serviceType === "print-and-frame" && (
              <div className="mt-3 space-y-3">
                {!selectedImage ? (
                  <Button
                    onClick={() => setShowUploadModal(true)}
                    className="w-full"
                    data-testid="button-upload-canvas"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Click to Upload Your Image
                  </Button>
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
                    <div ref={copyrightCheckboxRef} className="flex items-start gap-3">
                      <Checkbox
                        id="copyright"
                        checked={copyrightAgreed}
                        onCheckedChange={(checked) => setCopyrightAgreed(!!checked)}
                        data-testid="checkbox-copyright"
                        className="mt-0.5"
                      />
                      <Label
                        htmlFor="copyright"
                        className="cursor-pointer text-sm text-muted-foreground leading-snug"
                      >
                        I confirm that I own or am authorized to reproduce this image and agree to
                        the <TermsOfServiceModal />.
                      </Label>
                    </div>
                  </>
                )}
              </div>
            )}
          </Card>

          {/* How Canvas Floater Frames Work - Educational Section */}
          <div
            className="p-4 bg-gradient-to-br from-muted/30 to-muted/50 rounded-xl border border-border"
            data-testid="info-float-frame"
          >
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Visual Image - TODO: Add diagram image */}
              {/* <div className="flex-shrink-0 w-full sm:w-56">
                <img
                  src={floaterFrameDiagram}
                  alt="Canvas floater frame diagram showing floating frame and stretched canvas"
                  className="w-full h-auto rounded-lg shadow-sm"
                />
              </div> */}

              {/* Text Content */}
              <div className="flex-1 space-y-2">
                <h4 className="text-sm font-semibold text-foreground">
                  How Canvas Floater Frames Work
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your canvas sits recessed within the frame. The gap between your canvas edge and
                  the frame&apos;s inner edge is automatically set to ¼&quot;, creating a floating
                  effect.
                </p>
              </div>
            </div>
          </div>

          <Accordion
            type="multiple"
            defaultValue={["dimensions", "frame", "hardware"]}
            className="space-y-2"
          >
            <AccordionItem value="dimensions">
              <AccordionTrigger data-testid="accordion-dimensions">
                Canvas Dimensions
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="width">Width (inches)</Label>
                    <Input
                      id="width"
                      value={artworkWidth}
                      onChange={(e) => handleWidthChange(e.target.value)}
                      placeholder="e.g., 16 or 16.5"
                      data-testid="input-width"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (inches)</Label>
                    <Input
                      id="height"
                      value={artworkHeight}
                      onChange={(e) => setArtworkHeight(e.target.value)}
                      placeholder="e.g., 20 or 20.5"
                      disabled={serviceType === "print-and-frame" && !!selectedImage}
                      data-testid="input-height"
                    />
                    {serviceType === "print-and-frame" && selectedImage && (
                      <p className="text-xs text-muted-foreground">
                        Height locked to maintain image aspect ratio
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Min 4&quot;. Decimals or fractions accepted (e.g., 16.5 or 16 1/2)
                </p>

                {artworkSizeValidation && !artworkSizeValidation.valid && (
                  <div
                    className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-md p-3 text-sm text-yellow-800 dark:text-yellow-200"
                    data-testid="warning-min-size"
                  >
                    {artworkSizeValidation.message}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="frame">
              <AccordionTrigger data-testid="accordion-frame">Frame Style</AccordionTrigger>
              <AccordionContent>
                {/* Canvas Depth Input Field */}
                <div className="mb-4 p-3 bg-muted/30 rounded-md border border-border">
                  <Label className="text-sm font-medium mb-2 block">
                    What is your canvas depth?
                  </Label>
                  <p className="text-xs text-muted-foreground mb-3">
                    Measure the thickness of your stretched canvas from front to back. Choose the
                    matching depth below.
                  </p>
                  <Tabs
                    value={selectedDepth.toString()}
                    onValueChange={(val) => {
                      const newDepth = parseFloat(val) as CanvasDepth;
                      setSelectedDepth(newDepth);
                      // Auto-select first frame in new depth if current selection isn't in this depth
                      const framesInDepth = getFramesByDepth(newDepth);
                      if (framesInDepth.length > 0 && selectedFrame.usableDepth !== newDepth) {
                        const firstFrame = framesInDepth[0];
                        if (firstFrame) {
                          setSelectedFrame(firstFrame);
                        }
                      }
                    }}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-4 h-auto">
                      {CANVAS_DEPTHS.map((depth) => (
                        <TabsTrigger
                          key={depth}
                          value={depth.toString()}
                          className="text-xs sm:text-sm py-2"
                          data-testid={`tab-depth-${depth}`}
                        >
                          {DEPTH_LABELS[depth]}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </div>

                {/* Frame Styles for Selected Depth */}
                <div className="md:max-h-[400px] md:overflow-y-auto md:pr-2">
                  {selectedDepth === 1.625 ? (
                    // Special themed layout for 1.625" depth
                    <div className="space-y-4">
                      {Object.entries(getFramesByTheme(getFramesByDepth(1.625))).map(
                        ([theme, frames]) => (
                          <div key={theme}>
                            <h4 className="text-sm font-medium text-muted-foreground mb-2">
                              {THEME_LABELS[theme] || theme}
                            </h4>
                            <div className="grid grid-cols-2 gap-2">
                              {frames.map((frame) => (
                                <button
                                  key={frame.id}
                                  onClick={() => setSelectedFrame(frame)}
                                  className={`p-3 rounded-md border-2 text-left hover-elevate active-elevate-2 ${
                                    selectedFrame.id === frame.id
                                      ? "border-primary"
                                      : "border-transparent"
                                  }`}
                                  data-testid={`button-frame-${frame.id}`}
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
                                  ) : frame.swatchImage ? (
                                    <div className="h-12 w-full rounded mb-2 overflow-hidden">
                                      <img
                                        src={getSharedAssetUrl(
                                          frame.swatchImage.startsWith("/")
                                            ? frame.swatchImage.slice(1)
                                            : frame.swatchImage
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
                                  <p className="font-medium text-sm mb-1">{frame.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    Top Width: {frame.mouldingWidth}&quot;
                                  </p>
                                </button>
                              ))}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    // Standard grid for other depths
                    <div className="grid grid-cols-2 gap-2">
                      {getFramesByDepth(selectedDepth).map((frame) => (
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
                                src={getSharedAssetUrl(
                                  frame.thumbnail.startsWith("/")
                                    ? frame.thumbnail.slice(1)
                                    : frame.thumbnail
                                )}
                                alt={frame.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ) : frame.swatchImage ? (
                            <div className="h-12 w-full rounded mb-2 overflow-hidden">
                              <img
                                src={getSharedAssetUrl(
                                  frame.swatchImage.startsWith("/")
                                    ? frame.swatchImage.slice(1)
                                    : frame.swatchImage
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
                          <p className="font-medium text-sm mb-1">{frame.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Top Width: {frame.mouldingWidth}&quot;
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
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

          {/* Minimal Sticky Price Box - Desktop Only */}
          <Card className="hidden md:block md:sticky md:bottom-4 p-4">
            <div className="space-y-3">
              {/* Quantity and Total */}
              <div className="flex justify-between items-center gap-4">
                <QuantitySelector
                  value={quantity}
                  onChange={setQuantity}
                  testId="quantity-selector-desktop"
                />
                <div className="flex flex-col items-end">
                  <span className="text-xs text-muted-foreground">Total</span>
                  <span className="text-xl font-semibold" data-testid="text-total-price">
                    ${(finalTotalPrice * quantity).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Sticky Copyright Checkbox - appears when original is scrolled out of view */}
              {serviceType === "print-and-frame" &&
                selectedImage &&
                !copyrightAgreed &&
                !isCopyrightCheckboxVisible && (
                  <div
                    className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md"
                    data-testid="sticky-copyright-checkbox"
                  >
                    <Checkbox
                      id="copyright-sticky"
                      checked={copyrightAgreed}
                      onCheckedChange={(checked) => setCopyrightAgreed(!!checked)}
                      data-testid="checkbox-copyright-sticky"
                      className="mt-0.5"
                    />
                    <Label
                      htmlFor="copyright-sticky"
                      className="cursor-pointer text-sm text-muted-foreground leading-snug"
                    >
                      I confirm that I own or am authorized to reproduce this image and agree to the{" "}
                      <TermsOfServiceModal />.
                    </Label>
                  </div>
                )}

              {/* Add to Cart Button */}
              <Button
                className="w-full"
                size="lg"
                onClick={handleCheckout}
                disabled={
                  !isValidDimensions ||
                  isTooLarge ||
                  isCheckingOut ||
                  isGeneratingPrint ||
                  (serviceType === "print-and-frame" && selectedImage !== null && !copyrightAgreed)
                }
                data-testid="button-add-to-cart"
              >
                {isGeneratingPrint ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Creating Canvas Print...
                  </>
                ) : isCheckingOut ? (
                  <>Processing...</>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* SEO Content for Selected Frame Style */}
          <Card className="p-4">
            <h3 className="font-semibold mb-2">{selectedFrame.name}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {(selectedFrame.sku && CANVAS_FRAME_COPY[selectedFrame.sku]) ||
                `This ${selectedFrame.colorName?.toLowerCase() || "wood"} canvas float frame creates a floating effect for your stretched canvas. Your artwork appears to hover inside the frame.`}
            </p>
          </Card>
        </div>
      </div>

      {/* Canvas Float Frames in Action - Lifestyle Carousel */}
      <div className="mt-8 mb-8">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold tracking-tight mb-2">Canvas Float Frames in Action</h3>
          <p className="text-base text-muted-foreground">
            See real canvas artwork in custom float frames
          </p>
        </div>
        <CanvasLifestyleCarousel />
      </div>

      {/* Full Frame Preview Dialog */}
      <Dialog open={fullImageOpen} onOpenChange={setFullImageOpen}>
        <DialogContent
          className="max-w-[95vw] max-h-[95vh] p-0"
          aria-describedby="frame-preview-description"
        >
          <DialogTitle className="sr-only">
            {fullscreenImage === "preview"
              ? "Full Canvas Float Frame Preview"
              : fullscreenImage === "corner"
                ? "Corner Detail"
                : fullscreenImage === "profile"
                  ? "Profile View"
                  : "Lifestyle Image"}
          </DialogTitle>
          <div
            className="relative w-full h-full flex items-center justify-center bg-black/95 p-8"
            id="frame-preview-description"
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
              onClick={() => setFullImageOpen(false)}
              data-testid="button-close-full-image"
              aria-label="Close preview"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </Button>

            {/* Show corner/profile/lifestyle images */}
            {fullscreenImage !== "preview" && (
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
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            )}

            {/* Render enlarged frame preview */}
            {fullscreenImage === "preview" &&
              isValidDimensions &&
              (() => {
                // Calculate larger display dimensions for dialog
                const dialogArtworkScale = 150;
                const dialogMaxWidth = window.innerWidth * 0.9;
                const dialogMaxHeight = window.innerHeight * 0.85;

                // For float frames, minimal frame border (use displayMouldingWidth for thin frame exaggeration)
                const dialogFrameBorderEstimate =
                  (((displayMouldingWidth ?? selectedFrame.mouldingWidth) * 0.35) /
                    ((artWidth + artHeight) / 2)) *
                  ((artWidth * dialogArtworkScale + artHeight * dialogArtworkScale) / 2);

                const dialogTotalBorderX = dialogFrameBorderEstimate * 2;
                const dialogTotalBorderY = dialogFrameBorderEstimate * 2;

                const dialogAvailableWidth = Math.max(100, dialogMaxWidth - dialogTotalBorderX);
                const dialogAvailableHeight = Math.max(100, dialogMaxHeight - dialogTotalBorderY);

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

                const mouldingWidth = displayMouldingWidth ?? selectedFrame.mouldingWidth;
                const dialogFrameBorder =
                  ((mouldingWidth * 0.35) / ((artWidth + artHeight) / 2)) *
                  ((dialogDisplayWidth + dialogDisplayHeight) / 2);

                return (
                  <div
                    style={{
                      width: `${dialogDisplayWidth + dialogFrameBorder * 2}px`,
                      height: `${dialogDisplayHeight + dialogFrameBorder * 2}px`,
                      borderTop: `${dialogFrameBorder}px solid ${selectedFrame.borderColor}`,
                      borderLeft: `${dialogFrameBorder}px solid ${selectedFrame.borderColor}`,
                      borderRight: `${dialogFrameBorder}px solid ${selectedFrame.color}`,
                      borderBottom: `${dialogFrameBorder}px solid ${selectedFrame.color}`,
                      boxShadow: "inset 0 0 30px rgba(0,0,0,0.4), 0 8px 40px rgba(0,0,0,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "white",
                    }}
                  >
                    <div
                      style={{
                        width: `${dialogDisplayWidth}px`,
                        height: `${dialogDisplayHeight}px`,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        position: "relative",
                      }}
                    >
                      {selectedImage ? (
                        <img
                          src={selectedImage}
                          alt="Full Preview"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <img
                          src={placeholderImage}
                          alt="Canvas Placeholder"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            opacity: 0.8,
                          }}
                        />
                      )}
                    </div>
                  </div>
                );
              })()}
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
                className="h-7 w-7"
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>

              {/* Add to Cart Button - Compact */}
              <Button
                size="default"
                onClick={handleCheckout}
                disabled={
                  !isValidDimensions ||
                  isTooLarge ||
                  isCheckingOut ||
                  isGeneratingPrint ||
                  (serviceType === "print-and-frame" && selectedImage !== null && !copyrightAgreed)
                }
                data-testid="button-mobile-add-to-cart"
                className="flex-1 text-xs min-w-0 min-h-11"
              >
                {isGeneratingPrint ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                    Generating...
                  </>
                ) : isCheckingOut ? (
                  "Adding..."
                ) : (
                  "Add to Cart"
                )}
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
            matType: "none", // Canvas frames don't have mats
            matBorderWidth: 0,
            matRevealWidth: 0,
            matColorId: "white-core", // Default mat color (not used for canvas)
            matInnerColorId: "white-core", // Default inner mat color (not used for canvas)
            glassTypeId: "clear", // Default glass (not used for canvas)
            imageUrl: selectedImage || undefined,
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
              description: `Canvas size updated to ${newWidth}" × ${newHeight}" from AR preview`,
            });
          }}
        />
      )}
    </>
  );
}
