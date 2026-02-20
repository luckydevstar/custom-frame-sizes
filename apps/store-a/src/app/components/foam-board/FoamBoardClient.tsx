"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Button,
  Card,
  Label,
  Input,
  RadioGroup,
  RadioGroupItem,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  TrustBadges,
} from "@framecraft/ui";
import {
  parseFraction,
  calculateDedicatedPagePrice,
  COMPONENT_PRICING,
  getSharedAssetUrl,
} from "@framecraft/core";
import type { ComponentType } from "@framecraft/core";
import { useToast } from "@framecraft/ui/hooks/use-toast";
import { ShoppingCart, Minus, Plus, Layers, Package } from "lucide-react";

type FoamBoardType = "standard-white" | "standard-black" | "self-adhesive-white";
type PackSize = 1 | 10 | 100;

export function FoamBoardClient() {
  const { toast } = useToast();
  const [boardType, setBoardType] = useState<FoamBoardType>("standard-white");
  const [sheetWidth, setSheetWidth] = useState("16");
  const [sheetHeight, setSheetHeight] = useState("20");
  const [packSize, setPackSize] = useState<PackSize>(1);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [showMobileBar, setShowMobileBar] = useState(false);
  const configuratorRef = useRef<HTMLDivElement>(null);

  const width = parseFraction(sheetWidth);
  const height = parseFraction(sheetHeight);
  const isValidDimensions = width > 0 && height > 0 && width >= 4 && height >= 4;
  const totalDimensions = width + height;
  const isOversize = totalDimensions > 60 && totalDimensions <= 75;
  const isTooLarge = totalDimensions > 75;

  const componentTypeMap: Record<FoamBoardType, ComponentType> = {
    "standard-white": "STANDARD_WHITE_FOAM",
    "standard-black": "STANDARD_BLACK_FOAM",
    "self-adhesive-white": "SELF_ADHESIVE_WHITE_FOAM",
  };
  const componentType = componentTypeMap[boardType];
  const unitPrice = isValidDimensions
    ? calculateDedicatedPagePrice(width, height, componentType)
    : 0;
  let oversizeFee = 0;
  if (isOversize) oversizeFee = 20;
  let discount = 0;
  if (packSize === 10) discount = 0.25;
  if (packSize === 100) discount = 0.4;
  const subtotal = (unitPrice + oversizeFee) * packSize;
  const discountAmount = subtotal * discount;
  const total = subtotal - discountAmount;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get("type");
    const w = params.get("width");
    const h = params.get("height");
    const pack = params.get("pack");
    if (type === "standard-white" || type === "standard-black" || type === "self-adhesive-white") {
      setBoardType(type);
    }
    if (w) setSheetWidth(w);
    if (h) setSheetHeight(h);
    if (pack && (pack === "1" || pack === "10" || pack === "100")) {
      setPackSize(parseInt(pack) as PackSize);
    }
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!initialized) return;
    const params = new URLSearchParams();
    params.set("type", boardType);
    params.set("width", sheetWidth);
    params.set("height", sheetHeight);
    params.set("pack", packSize.toString());
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  }, [initialized, boardType, sheetWidth, sheetHeight, packSize]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const el = configuratorRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setShowMobileBar(Boolean(entry?.isIntersecting));
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleCheckout = () => {
    if (!isValidDimensions || isTooLarge) {
      toast({
        title: "Invalid Configuration",
        description: "Please check your board dimensions.",
        variant: "destructive",
      });
      return;
    }
    setIsCheckingOut(true);
    setTimeout(() => {
      toast({
        title: "Added to Cart",
        description: `${packSize} foam board${packSize > 1 ? "s" : ""} added to cart.`,
      });
      setIsCheckingOut(false);
    }, 800);
  };

  const getBoardTypeLabel = (type: FoamBoardType) => {
    const labels = {
      "standard-white": "Standard White",
      "standard-black": "Standard Black",
      "self-adhesive-white": "Self-Adhesive White",
    };
    return labels[type];
  };

  const popularSizes = [
    { w: "24", h: "36", label: '24×36"' },
    { w: "4", h: "6", label: '4×6"' },
    { w: "13", h: "19", label: '13×19"' },
    { w: "8", h: "10", label: '8×10"' },
    { w: "11", h: "17", label: '11×17"' },
    { w: "4", h: "4", label: '4×4"' },
    { w: "5", h: "7", label: '5×7"' },
    { w: "12", h: "18", label: '12×18"' },
    { w: "11", h: "14", label: '11×14"' },
    { w: "7", h: "7", label: '7×7"' },
    { w: "8", h: "11", label: '8×11"' },
    { w: "12", h: "12", label: '12×12"' },
    { w: "8", h: "8", label: '8×8"' },
    { w: "20", h: "30", label: '20×30"' },
    { w: "6", h: "18", label: '6×18"' },
    { w: "32", h: "40", label: '32×40"' },
    { w: "10", h: "15", label: '10×15"' },
    { w: "16", h: "16", label: '16×16"' },
    { w: "6", h: "6", label: '6×6"' },
    { w: "12", h: "24", label: '12×24"' },
    { w: "18", h: "24", label: '18×24"' },
  ];

  // Images: shared assets (local assets_to_use/shared_assets or R2 at components/foam-board/)
  const whiteFoamImg = getSharedAssetUrl("components/foam-board/standard-white.png");
  const blackFoamImg = getSharedAssetUrl("components/foam-board/standard-black.png");
  const adhesiveFoamImg = getSharedAssetUrl("components/foam-board/self-adhesive-white.png");

  return (
    <div className="min-h-screen bg-background">
      {/* 1. Hero Section */}
      <section className="relative bg-gradient-to-b from-muted/50 to-background border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-12">
          <div className="max-w-3xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
              Custom-Cut Foam Board
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              Professional mounting boards cut to your exact specifications. Popular sizes include
              24x36, 8x10, 13x19, 11x17, and 12x18 for standard photo mounting and backing.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Popular Sizes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 border-b bg-muted/20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">Popular Sizes</h2>
          <p className="text-sm sm:text-base text-muted-foreground text-center mb-6">
            Click any size below to instantly configure your foam board
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {popularSizes.map((size) => (
              <Button
                key={size.label}
                variant="outline"
                size="sm"
                onClick={() => {
                  setSheetWidth(size.w);
                  setSheetHeight(size.h);
                  configuratorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                data-testid={`button-size-${size.label.replace(/[×"]/g, "-")}`}
                className="text-xs sm:text-sm"
              >
                {size.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Designer Section */}
      <section
        ref={configuratorRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-12 pb-24 md:pb-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Your Configuration (desktop only) */}
          <Card className="hidden md:block p-6 md:sticky md:top-4 md:self-start">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Your Configuration</h2>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium">{getBoardTypeLabel(boardType)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Board Size:</span>
                    <span className="font-medium">
                      {isValidDimensions ? `${width.toFixed(2)}" × ${height.toFixed(2)}"` : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Pack Size:</span>
                    <span className="font-medium">
                      {packSize} board{packSize > 1 ? "s" : ""}
                    </span>
                  </div>
                  {isOversize && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Oversize Fee:</span>
                      <span className="font-medium">${oversizeFee.toFixed(2)}</span>
                    </div>
                  )}
                  {discount > 0 && (
                    <div className="flex justify-between py-2 border-b text-green-600">
                      <span>Bulk Discount ({(discount * 100).toFixed(0)}% off):</span>
                      <span className="font-medium">-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="pt-4 border-t">
                <div className="flex justify-between items-baseline mb-4">
                  <span className="text-2xl font-bold">Total:</span>
                  <span className="text-3xl font-bold text-primary">
                    ${isValidDimensions ? total.toFixed(2) : "0.00"}
                  </span>
                </div>
                <div className="mb-3">
                  <TrustBadges />
                </div>
                <Button
                  className="w-full min-h-11"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={!isValidDimensions || isTooLarge || isCheckingOut}
                  data-testid="button-add-to-cart"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {isCheckingOut ? "Adding..." : "Add to Cart"}
                </Button>
                {isTooLarge && (
                  <p className="text-sm text-destructive mt-2 text-center">
                    Maximum size: W + H must be 75&quot; or less
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Right: Configuration Controls */}
          <Card className="p-6">
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold mb-4">Your Size</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="width" className="text-sm font-medium">
                      Width
                    </Label>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const current = parseFraction(sheetWidth);
                          if (current > 4) setSheetWidth(String(Math.floor(current) - 1));
                        }}
                        disabled={width <= 4}
                        className="h-10 w-10 shrink-0"
                        data-testid="button-decrement-width"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <div className="relative flex-1">
                        <Input
                          id="width"
                          value={sheetWidth}
                          onChange={(e) => setSheetWidth(e.target.value)}
                          placeholder="16"
                          className="h-12 text-xl font-bold text-center pr-10"
                          data-testid="input-width"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                          in
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const current = parseFraction(sheetWidth);
                          if (current < 50) setSheetWidth(String(Math.floor(current) + 1));
                        }}
                        disabled={width >= 50}
                        className="h-10 w-10 shrink-0"
                        data-testid="button-increment-width"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height" className="text-sm font-medium">
                      Height
                    </Label>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const current = parseFraction(sheetHeight);
                          if (current > 4) setSheetHeight(String(Math.floor(current) - 1));
                        }}
                        disabled={height <= 4}
                        className="h-10 w-10 shrink-0"
                        data-testid="button-decrement-height"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <div className="relative flex-1">
                        <Input
                          id="height"
                          value={sheetHeight}
                          onChange={(e) => setSheetHeight(e.target.value)}
                          placeholder="20"
                          className="h-12 text-xl font-bold text-center pr-10"
                          data-testid="input-height"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                          in
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const current = parseFraction(sheetHeight);
                          if (current < 50) setSheetHeight(String(Math.floor(current) + 1));
                        }}
                        disabled={height >= 50}
                        className="h-10 w-10 shrink-0"
                        data-testid="button-increment-height"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  You can enter decimals (16.5) or fractions (16 1/2)
                </p>
                {isTooLarge && (
                  <p className="text-sm text-destructive mt-2 text-center">
                    Maximum size: W + H must be 75&quot; or less
                  </p>
                )}
              </div>
              <div className="border-t" />
              <div>
                <h3 className="text-xl font-bold mb-4">Board Type</h3>
                <RadioGroup
                  value={boardType}
                  onValueChange={(v) => setBoardType(v as FoamBoardType)}
                >
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 data-[state=checked]:border-primary data-[state=checked]:bg-primary/5">
                      <RadioGroupItem
                        value="standard-white"
                        id="standard-white"
                        data-testid="radio-standard-white"
                      />
                      <Label htmlFor="standard-white" className="flex-1 cursor-pointer">
                        <span className="font-semibold">Standard White</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          from $
                          {(
                            COMPONENT_PRICING as Record<string, { minimumPrice?: number }>
                          ).STANDARD_WHITE_FOAM?.minimumPrice?.toFixed(2) ?? "6.95"}
                        </span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 data-[state=checked]:border-primary data-[state=checked]:bg-primary/5">
                      <RadioGroupItem
                        value="standard-black"
                        id="standard-black"
                        data-testid="radio-standard-black"
                      />
                      <Label htmlFor="standard-black" className="flex-1 cursor-pointer">
                        <span className="font-semibold">Standard Black</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          from $
                          {(
                            COMPONENT_PRICING as Record<string, { minimumPrice?: number }>
                          ).STANDARD_BLACK_FOAM?.minimumPrice?.toFixed(2) ?? "7.95"}
                        </span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 data-[state=checked]:border-primary data-[state=checked]:bg-primary/5">
                      <RadioGroupItem
                        value="self-adhesive-white"
                        id="self-adhesive-white"
                        data-testid="radio-self-adhesive"
                      />
                      <Label htmlFor="self-adhesive-white" className="flex-1 cursor-pointer">
                        <span className="font-semibold">Self-Adhesive White</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          from $
                          {(
                            COMPONENT_PRICING as Record<string, { minimumPrice?: number }>
                          ).SELF_ADHESIVE_WHITE_FOAM?.minimumPrice?.toFixed(2) ?? "9.95"}
                        </span>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
              <div className="border-t" />
              <div>
                <h3 className="text-xl font-bold mb-4">Pack Size</h3>
                <TooltipProvider>
                  <div className="grid grid-cols-3 gap-3">
                    <Button
                      variant={packSize === 1 ? "default" : "outline"}
                      onClick={() => setPackSize(1)}
                      className="h-12"
                      data-testid="button-pack-1"
                    >
                      1 Board
                    </Button>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={packSize === 10 ? "default" : "outline"}
                          onClick={() => setPackSize(10)}
                          className="relative h-12"
                          data-testid="button-pack-10"
                        >
                          10 Boards
                          <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                            -25%
                          </span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Save 25% with pack of 10</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={packSize === 100 ? "default" : "outline"}
                          onClick={() => setPackSize(100)}
                          className="relative h-12"
                          data-testid="button-pack-100"
                        >
                          100 Boards
                          <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                            -40%
                          </span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Save 40% with pack of 100</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TooltipProvider>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* 4. Compare Foam Board Types */}
      <section className="max-w-7xl mx-auto px-6 py-12 border-b">
        <div className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Compare Foam Board Types</h2>
          <p className="text-muted-foreground">
            Learn about the different foam board types and choose the best option for your project.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2">
                <th className="text-left p-4 font-semibold" data-testid="table-header-feature">
                  Feature
                </th>
                <th className="text-center p-4 font-semibold" data-testid="table-header-white">
                  Standard White
                </th>
                <th className="text-center p-4 font-semibold" data-testid="table-header-black">
                  Standard Black
                </th>
                <th className="text-center p-4 font-semibold" data-testid="table-header-adhesive">
                  Self-Adhesive White
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-4 font-medium">Color</td>
                <td className="p-4 text-center">White</td>
                <td className="p-4 text-center">Black</td>
                <td className="p-4 text-center">White</td>
              </tr>
              <tr className="border-b">
                <td className="p-4 font-medium">Adhesive</td>
                <td className="p-4 text-center">No</td>
                <td className="p-4 text-center">No</td>
                <td className="p-4 text-center">Yes (Peel & stick)</td>
              </tr>
              <tr className="border-b">
                <td className="p-4 font-medium">Starting Price</td>
                <td className="p-4 text-center">
                  $
                  {(
                    COMPONENT_PRICING as Record<string, { minimumPrice?: number }>
                  ).STANDARD_WHITE_FOAM?.minimumPrice?.toFixed(2) ?? "6.95"}
                </td>
                <td className="p-4 text-center">
                  $
                  {(
                    COMPONENT_PRICING as Record<string, { minimumPrice?: number }>
                  ).STANDARD_BLACK_FOAM?.minimumPrice?.toFixed(2) ?? "7.95"}
                </td>
                <td className="p-4 text-center">
                  $
                  {(
                    COMPONENT_PRICING as Record<string, { minimumPrice?: number }>
                  ).SELF_ADHESIVE_WHITE_FOAM?.minimumPrice?.toFixed(2) ?? "9.95"}
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-4 font-medium">Best For</td>
                <td className="p-4 text-center">General mounting</td>
                <td className="p-4 text-center">Dark matting projects</td>
                <td className="p-4 text-center">Quick photo mounting</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. See the Options (Visual Comparison) */}
      <section className="max-w-7xl mx-auto px-6 py-12 border-b">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-2">See the Options</h2>
          <p className="text-muted-foreground">
            Choose the perfect foam board for your mounting needs and project requirements
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6" data-testid="card-white-foam-visual">
            <div className="aspect-[4/3] rounded-md overflow-hidden mb-4 bg-muted/20 relative">
              <Image
                src={whiteFoamImg}
                alt="Stack of standard white foam boards with bright white surface"
                fill
                className="object-contain"
                loading="lazy"
                unoptimized
              />
            </div>
            <h3 className="font-semibold text-xl mb-3">Standard White</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Classic white foam core board with a smooth, bright white surface. Lightweight yet
              rigid structure ideal for general mounting and matting projects.
            </p>
            <div className="space-y-3">
              <div className="border-t pt-3">
                <h4 className="font-medium text-sm mb-2">Best For:</h4>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>White & light-colored mats</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>General photo mounting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Budget-friendly projects</span>
                  </li>
                </ul>
              </div>
              <div className="border-t pt-3">
                <h4 className="font-medium text-sm mb-2">Features:</h4>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Acid-free core</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Bright white finish</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Won&apos;t warp or bow</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
          <Card className="p-6" data-testid="card-black-foam-visual">
            <div className="aspect-[4/3] rounded-md overflow-hidden mb-4 bg-muted/20 relative">
              <Image
                src={blackFoamImg}
                alt="Stack of standard black foam boards with deep black surface"
                fill
                className="object-contain"
                loading="lazy"
                unoptimized
              />
            </div>
            <h3 className="font-semibold text-xl mb-3">Standard Black</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Professional black foam core with a deep, rich black surface on both sides. Creates
              dramatic contrast and professional presentation for dark-toned artwork.
            </p>
            <div className="space-y-3">
              <div className="border-t pt-3">
                <h4 className="font-medium text-sm mb-2">Best For:</h4>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Black & dark-colored mats</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>High-contrast presentations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Professional portfolios</span>
                  </li>
                </ul>
              </div>
              <div className="border-t pt-3">
                <h4 className="font-medium text-sm mb-2">Features:</h4>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Acid-free core</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Deep black both sides</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Premium appearance</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
          <Card className="p-6" data-testid="card-adhesive-foam-visual">
            <div className="aspect-[4/3] rounded-md overflow-hidden mb-4 bg-muted/20 relative">
              <Image
                src={adhesiveFoamImg}
                alt="Stack of self-adhesive white foam boards with peel-and-stick backing"
                fill
                className="object-contain"
                loading="lazy"
                unoptimized
              />
            </div>
            <h3 className="font-semibold text-xl mb-3">Self-Adhesive White</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Convenient white foam board with permanent adhesive backing. Peel-and-stick
              application eliminates the need for spray adhesives or mounting tools.
            </p>
            <div className="space-y-3">
              <div className="border-t pt-3">
                <h4 className="font-medium text-sm mb-2">Best For:</h4>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Quick photo mounting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Production workflows</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Mess-free application</span>
                  </li>
                </ul>
              </div>
              <div className="border-t pt-3">
                <h4 className="font-medium text-sm mb-2">Features:</h4>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Permanent adhesive</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Easy peel-and-stick</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>No spray adhesive needed</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* 6. Why Choose Our Foam Board? */}
      <section className="max-w-7xl mx-auto px-6 py-12 border-t">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Foam Board?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Layers className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Lightweight & Rigid</h3>
            <p className="text-sm text-muted-foreground">
              Perfect balance of strength and weight for professional mounting
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Acid-Free Core</h3>
            <p className="text-sm text-muted-foreground">
              Archival quality, won&apos;t yellow or damage your artwork
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Bulk Discounts</h3>
            <p className="text-sm text-muted-foreground">Save up to 40% on pack of 100 boards</p>
          </div>
        </div>
      </section>

      {/* 7. Common Uses */}
      <section className="max-w-7xl mx-auto px-6 py-12 border-t bg-muted/30">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-2">Common Uses</h2>
          <p className="text-muted-foreground">
            Versatile mounting solutions for framing, displays, and creative projects
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-3">Picture Frame Backing</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Mount photos and artwork to foam board before inserting into frames. Provides rigid
              support and prevents artwork from touching the glazing. Most popular backing sizes are
              24x36, 8x10, 11x17, and 13x19 for standard frame dimensions.
            </p>
            <p className="text-xs text-primary font-medium">Standard White or Black</p>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold mb-3">Photo Mounting</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Permanently mount photos for display without frames. Self-adhesive option eliminates
              need for spray adhesive and mounting presses.
            </p>
            <p className="text-xs text-primary font-medium">Self-Adhesive White</p>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold mb-3">Trade Show Displays</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Create lightweight, portable signage and displays. Easy to transport and set up at
              events, conferences, and exhibitions.
            </p>
            <p className="text-xs text-primary font-medium">Standard White</p>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold mb-3">Matting Projects</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Use as backing board behind mat layers. Black foam board is essential for dark mats to
              prevent white edges showing through.
            </p>
            <p className="text-xs text-primary font-medium">Standard Black</p>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold mb-3">School & Office Projects</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Create presentations, science fair displays, and visual aids. Lightweight and easy to
              cut, perfect for educational projects.
            </p>
            <p className="text-xs text-primary font-medium">Standard White or Black</p>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold mb-3">Photography Studios</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Mount client photos quickly and efficiently. Self-adhesive boards speed up production
              workflow for high-volume labs.
            </p>
            <p className="text-xs text-primary font-medium">Self-Adhesive White</p>
          </Card>
        </div>
      </section>

      {/* 8. Professional Tips */}
      <section className="max-w-7xl mx-auto px-6 py-12 border-t">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-2">Professional Tips</h2>
          <p className="text-muted-foreground">
            Expert advice for working with foam board mounting materials
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Mounting Techniques
            </h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Always work on a clean, flat surface to prevent dents</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>For spray mounting, apply adhesive to foam board, not photo</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Use a brayer or roller to eliminate air bubbles</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Align photos carefully - repositioning can damage surface</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Cut foam board before mounting to ensure clean edges</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" />
              Storage & Handling
            </h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Store flat in a cool, dry place away from moisture</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Keep boards in original packaging until use</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Handle by edges to avoid denting or creasing surface</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Use sharp blades when cutting to prevent tearing</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Allow mounted pieces to cure flat for 24 hours</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 p-6 bg-primary/5 rounded-lg max-w-4xl mx-auto">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            Pro Tip: Choosing the Right Type
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            Match your foam board color to your mat board color for professional results. White foam
            shows through light-colored mats, while black foam prevents unsightly white edges with
            dark mats.
          </p>
          <p className="text-sm text-muted-foreground">
            For high-volume production work, self-adhesive boards can save significant time and
            eliminate mess from spray adhesives, making them worth the premium cost.
          </p>
        </div>
      </section>

      {/* 9. Mobile Sticky Bar */}
      <div
        className={`block md:hidden fixed left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border shadow-lg z-50 transition-transform duration-300 ease-in-out ${
          showMobileBar ? "bottom-0 translate-y-0" : "bottom-0 translate-y-full"
        }`}
      >
        <div className="px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Total</div>
              <div className="text-2xl font-bold">
                ${isValidDimensions ? total.toFixed(2) : "0.00"}
              </div>
            </div>
            <Button
              className="min-h-11 flex-1 max-w-[200px]"
              onClick={handleCheckout}
              disabled={!isValidDimensions || isTooLarge || isCheckingOut}
              data-testid="button-add-to-cart-mobile"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {isCheckingOut ? "Adding..." : "Add to Cart"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
