"use client";

import { useState, useEffect, useRef } from "react";
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
  getStoreAssetUrl,
} from "@framecraft/core";
import type { ComponentType } from "@framecraft/core";
import { useToast } from "@framecraft/ui/hooks/use-toast";
import { ShoppingCart, Minus, Plus, Sparkles, Info } from "lucide-react";

type AcrylicType = "regular" | "non-glare";
type PackSize = 1 | 10 | 100;

const POPULAR_SIZES = [
  { w: "11", h: "14", label: '11×14"' },
  { w: "8", h: "10", label: '8×10"' },
  { w: "24", h: "36", label: '24×36"' },
  { w: "5", h: "7", label: '5×7"' },
  { w: "4", h: "6", label: '4×6"' },
  { w: "12", h: "18", label: '12×18"' },
  { w: "13", h: "19", label: '13×19"' },
  { w: "16", h: "20", label: '16×20"' },
  { w: "20", h: "24", label: '20×24"' },
  { w: "18", h: "24", label: '18×24"' },
  { w: "12", h: "16", label: '12×16"' },
  { w: "11", h: "17", label: '11×17"' },
  { w: "12", h: "15", label: '12×15"' },
  { w: "20", h: "30", label: '20×30"' },
  { w: "8", h: "8", label: '8×8"' },
  { w: "22", h: "28", label: '22×28"' },
  { w: "18", h: "14", label: '18×14"' },
  { w: "30", h: "40", label: '30×40"' },
];

export function AcrylicClient() {
  const { toast } = useToast();
  const [acrylicType, setAcrylicType] = useState<AcrylicType>("regular");
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

  const componentType: ComponentType =
    acrylicType === "regular" ? "STANDARD_ACRYLIC" : "NON_GLARE_ACRYLIC";
  const unitPrice = isValidDimensions
    ? calculateDedicatedPagePrice(width, height, componentType)
    : 0;
  let oversizeFee = 0;
  if (isOversize) oversizeFee = 25;
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
    if (type === "regular" || type === "non-glare") setAcrylicType(type as AcrylicType);
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
    params.set("type", acrylicType);
    params.set("width", sheetWidth);
    params.set("height", sheetHeight);
    params.set("pack", packSize.toString());
    window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
  }, [initialized, acrylicType, sheetWidth, sheetHeight, packSize]);

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
        description: "Please check your sheet dimensions.",
        variant: "destructive",
      });
      return;
    }
    setIsCheckingOut(true);
    setTimeout(() => {
      toast({
        title: "Added to Cart",
        description: `${packSize} acrylic sheet${packSize > 1 ? "s" : ""} added to cart.`,
      });
      setIsCheckingOut(false);
    }, 800);
  };

  const pricing = COMPONENT_PRICING as Record<string, { minimumPrice?: number }>;
  const standardMin = pricing.STANDARD_ACRYLIC?.minimumPrice?.toFixed(2) ?? "9.95";
  const nonGlareMin = pricing.NON_GLARE_ACRYLIC?.minimumPrice?.toFixed(2) ?? "12.95";

  const standardAcrylicImg = getStoreAssetUrl("glazing/standard-acrylic.jpg");
  const nonglareAcrylicImg = getStoreAssetUrl("glazing/nonglare-acrylic.jpg");

  return (
    <div className="min-h-screen bg-background">
      {/* 1. Hero */}
      <section className="relative bg-gradient-to-b from-muted/50 to-background border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-12">
          <div className="max-w-3xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
              Custom-Cut Acrylic Sheets
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              Professional glazing cut to your exact specifications. Available in regular and
              non-glare finishes. Popular sizes include 11x14, 8x10, 24x36, 16x20, and more.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Popular Sizes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 border-b bg-muted/20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">Popular Sizes</h2>
          <p className="text-sm sm:text-base text-muted-foreground text-center mb-6">
            Click any size below to instantly configure your acrylic sheet
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {POPULAR_SIZES.map((size) => (
              <Button
                key={size.label}
                variant="outline"
                size="sm"
                onClick={() => {
                  setSheetWidth(size.w);
                  setSheetHeight(size.h);
                  configuratorRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
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
          <Card className="hidden md:block p-6 md:sticky md:top-4 md:self-start">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Your Configuration</h2>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium">
                      {acrylicType === "regular" ? "Regular Acrylic" : "Non-Glare Acrylic"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Sheet Size:</span>
                    <span className="font-medium">
                      {isValidDimensions ? `${width.toFixed(2)}" × ${height.toFixed(2)}"` : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Pack Size:</span>
                    <span className="font-medium">
                      {packSize} sheet{packSize > 1 ? "s" : ""}
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
                <h3 className="text-xl font-bold mb-4">Acrylic Type</h3>
                <RadioGroup
                  value={acrylicType}
                  onValueChange={(v) => setAcrylicType(v as AcrylicType)}
                >
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 data-[state=checked]:border-primary data-[state=checked]:bg-primary/5">
                      <RadioGroupItem value="regular" id="regular" data-testid="radio-regular" />
                      <Label htmlFor="regular" className="flex-1 cursor-pointer">
                        <span className="font-semibold">Standard Acrylic</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          from ${standardMin}
                        </span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 data-[state=checked]:border-primary data-[state=checked]:bg-primary/5">
                      <RadioGroupItem
                        value="non-glare"
                        id="non-glare"
                        data-testid="radio-non-glare"
                      />
                      <Label htmlFor="non-glare" className="flex-1 cursor-pointer">
                        <span className="font-semibold">Non-Glare Acrylic</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          from ${nonGlareMin}
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
                      1 Sheet
                    </Button>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={packSize === 10 ? "default" : "outline"}
                          onClick={() => setPackSize(10)}
                          className="relative h-12"
                          data-testid="button-pack-10"
                        >
                          10 Sheets
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
                          100 Sheets
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

      {/* 4. Compare Acrylic Types */}
      <section className="max-w-7xl mx-auto px-6 py-12 border-b">
        <div className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Compare Acrylic Types</h2>
          <p className="text-muted-foreground">
            Compare features and see the difference between regular and non-glare acrylic.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2">
                <th className="text-left p-4 font-semibold" data-testid="table-header-feature">
                  Feature
                </th>
                <th className="text-center p-4 font-semibold" data-testid="table-header-regular">
                  Regular Acrylic
                </th>
                <th className="text-center p-4 font-semibold" data-testid="table-header-nonglare">
                  Non-Glare Acrylic
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-4 font-medium">Clarity</td>
                <td className="p-4 text-center">Crystal clear</td>
                <td className="p-4 text-center">Slight matte finish</td>
              </tr>
              <tr className="border-b">
                <td className="p-4 font-medium">Reflections</td>
                <td className="p-4 text-center">Standard glare</td>
                <td className="p-4 text-center">Minimal reflections</td>
              </tr>
              <tr className="border-b">
                <td className="p-4 font-medium">Best For</td>
                <td className="p-4 text-center">Bright spaces</td>
                <td className="p-4 text-center">High-glare areas</td>
              </tr>
              <tr className="border-b">
                <td className="p-4 font-medium">Weight</td>
                <td className="p-4 text-center">Lightweight</td>
                <td className="p-4 text-center">Lightweight</td>
              </tr>
              <tr className="border-b">
                <td className="p-4 font-medium">UV Protection</td>
                <td className="p-4 text-center">Yes</td>
                <td className="p-4 text-center">Yes</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. See the Difference (2 cards with images - same assets as home) */}
      <section className="max-w-7xl mx-auto px-6 py-12 border-b">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-2">See the Difference</h2>
          <p className="text-muted-foreground">
            Choose the right glazing for your lighting conditions and display preferences
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6" data-testid="card-regular-acrylic-visual">
            <div className="aspect-[4/3] rounded-md overflow-hidden mb-4 bg-muted/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={standardAcrylicImg}
                alt="Standard frame-grade acrylic with visible glare and reflections in bright lighting"
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>
            <h3 className="font-semibold text-xl mb-3">Regular Acrylic</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Crystal clear glazing with maximum light transmission for vibrant color reproduction.
              Standard reflections similar to glass but with superior shatter resistance.
            </p>
            <div className="space-y-3">
              <div className="border-t pt-3">
                <h4 className="font-medium text-sm mb-2">Best For:</h4>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Bright, well-lit rooms</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Photography & fine art prints</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Budget-conscious projects</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Areas without direct lighting</span>
                  </li>
                </ul>
              </div>
              <div className="border-t pt-3">
                <h4 className="font-medium text-sm mb-2">Key Features:</h4>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>99% light transmission</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>UV-resistant formulation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Lightweight (half the weight of glass)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Superior impact resistance</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
          <Card className="p-6" data-testid="card-nonglare-acrylic-visual">
            <div className="aspect-[4/3] rounded-md overflow-hidden mb-4 bg-muted/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={nonglareAcrylicImg}
                alt="Non-glare frame-grade acrylic with crystal clear viewing, no reflections or glare"
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>
            <h3 className="font-semibold text-xl mb-3">Non-Glare Acrylic</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Professional-grade glazing with a special matte finish that virtually eliminates
              reflections. Provides unobstructed viewing from any angle, even in bright
              environments.
            </p>
            <div className="space-y-3">
              <div className="border-t pt-3">
                <h4 className="font-medium text-sm mb-2">Best For:</h4>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>High-glare environments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Rooms with overhead lighting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Museum & gallery displays</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Premium artwork & collectibles</span>
                  </li>
                </ul>
              </div>
              <div className="border-t pt-3">
                <h4 className="font-medium text-sm mb-2">Key Features:</h4>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Virtually eliminates reflections</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Museum-grade clarity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Enhanced UV protection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Easy to clean & maintain</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* 6. Why Choose Our Acrylic */}
      <section className="max-w-7xl mx-auto px-6 py-12 border-t">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Acrylic?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Crystal Clear</h3>
            <p className="text-sm text-muted-foreground">
              99% light transmission for true color accuracy
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Info className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Shatter-Resistant</h3>
            <p className="text-sm text-muted-foreground">
              10x stronger than glass, safer for homes and businesses
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Bulk Discounts</h3>
            <p className="text-sm text-muted-foreground">Save up to 40% on pack of 100 sheets</p>
          </div>
        </div>
      </section>

      {/* 7. Common Applications */}
      <section className="max-w-7xl mx-auto px-6 py-12 border-t bg-muted/30">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-2">Common Applications</h2>
          <p className="text-muted-foreground">
            Real-world uses for acrylic glazing in professional and personal projects
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-3">Picture Framing</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Protect photographs, prints, and artwork while maintaining clarity. Lighter weight
              makes handling large frames easier and safer. Most popular sizes are 11x14, 8x10,
              16x20, and 24x36 for standard prints and posters.
            </p>
            <p className="text-xs text-primary font-medium">Regular or Non-Glare</p>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold mb-3">Retail Displays</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Create professional signage and product displays. Shatter-resistant properties ideal
              for high-traffic commercial environments.
            </p>
            <p className="text-xs text-primary font-medium">Regular Acrylic</p>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold mb-3">Museum & Galleries</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Showcase valuable artwork with professional-grade protection. Non-glare finish ensures
              optimal viewing under gallery lighting.
            </p>
            <p className="text-xs text-primary font-medium">Non-Glare Acrylic</p>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold mb-3">Sports Memorabilia</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Display jerseys, signed items, and collectibles. UV protection helps preserve
              autographs and prevent fading over time.
            </p>
            <p className="text-xs text-primary font-medium">Regular or Non-Glare</p>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold mb-3">Home Offices</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Frame diplomas, certificates, and awards without window glare from natural light.
              Professional appearance for video calls.
            </p>
            <p className="text-xs text-primary font-medium">Non-Glare Acrylic</p>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold mb-3">DIY Projects</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Custom shadow boxes, craft projects, and protective covers. Easy to cut and safer to
              work with than glass at home.
            </p>
            <p className="text-xs text-primary font-medium">Regular Acrylic</p>
          </Card>
        </div>
      </section>

      {/* 8. Care & Handling */}
      <section className="max-w-7xl mx-auto px-6 py-12 border-t">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-2">Care & Handling</h2>
          <p className="text-muted-foreground">
            Keep your acrylic glazing looking pristine with proper maintenance
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Cleaning Tips
            </h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Use microfiber cloth or soft cotton to avoid scratches</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Clean with lukewarm water and mild soap solution</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Avoid ammonia-based cleaners (like Windex)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Dry with clean, lint-free cloth to prevent water spots</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>For stubborn marks, use acrylic-safe polish sparingly</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              Handling Best Practices
            </h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Keep protective film on until installation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Handle by edges to avoid fingerprints and scratches</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Store flat or upright, never at an angle</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Avoid extreme temperature changes (60-80°F ideal)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Keep away from sharp objects during transport</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Mobile Sticky Bar */}
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
