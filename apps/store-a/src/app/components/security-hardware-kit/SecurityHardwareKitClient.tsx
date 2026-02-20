"use client";

import { useState, useEffect } from "react";
import {
  Button,
  Card,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@framecraft/ui";
import { getSharedAssetUrl } from "@framecraft/core";
import { useToast } from "@framecraft/ui/hooks/use-toast";
import { ShoppingCart, Shield, Building2, Lock, Check } from "lucide-react";

const PACK_SIZES = [
  { size: 1, label: "1 Kit", price: 8.95, discount: 0 },
  { size: 10, label: "10 Kits", price: 39.95, discount: 0.55 },
  { size: 25, label: "25 Kits", price: 89.95, discount: 0.6 },
  { size: 100, label: "100 Kits", price: 299.95, discount: 0.66 },
];

const INCLUDED_ITEMS = [
  "1× Offset Security Wrench - Precision-cut zinc steel",
  "1× T-Head Security Screw (tamper-proof)",
  "2× Wall Brackets",
  "3× Frame Plates - Slotted for micro-adjustment",
  "All Required Screws & Anchors",
  "Wood screws, wall anchors, and mounting fasteners",
];

const PERFECT_FOR_ITEMS = [
  "Art galleries & exhibitions",
  "Hotels & hospitality",
  "Office lobbies",
  "Healthcare facilities",
  "Educational institutions",
  "Retail environments",
  "Public spaces",
  "Corporate art programs",
];

const IMG = (name: string) => getSharedAssetUrl(`components/security-hardware/${name}`);

export function SecurityHardwareKitClient() {
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<"kit" | "wrench">("kit");
  const [selectedPackSize, setSelectedPackSize] = useState("1");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const currentPack =
    PACK_SIZES.find((p) => p.size.toString() === selectedPackSize) ?? PACK_SIZES[0];
  const price = selectedProduct === "kit" ? currentPack.price : 4.95;

  const handleAddToCart = () => {
    const productName =
      selectedProduct === "kit" ? "Professional Security Hardware Kit" : "Security Wrench Only";
    toast({
      title: "Added to Cart",
      description:
        selectedProduct === "kit" && currentPack.size > 1
          ? `${productName} - ${currentPack.label}`
          : productName,
    });
  };

  const componentsFlatLay = IMG("all-components-flat-lay.jpg");
  const hardwareKitLayout = IMG("complete-hardware-kit-layout.jpg");
  const screwComponents = IMG("security-screw-components.jpg");
  const frameBackHardware = IMG("frame-back-hardware-installed.jpg");
  const securityBracketsBack = IMG("security-brackets-frame-back.jpg");
  const bracketInstallation = IMG("security-bracket-installation.jpg");
  const wallMounting = IMG("wall-mounting-installation.jpg");

  return (
    <div className="min-h-screen bg-background">
      {/* 1. Hero Section */}
      <section className="relative bg-gradient-to-b from-muted/50 to-background border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 md:py-8 lg:py-16">
          {/* Mobile-First Layout */}
          <div className="grid grid-cols-2 gap-3 mb-4 md:hidden">
            <div className="aspect-square bg-white rounded-lg overflow-hidden border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={componentsFlatLay}
                alt="Anti-theft picture frame security hardware kit with tamper-proof mounting system"
                className="w-full h-full object-contain p-4"
              />
            </div>
            <Card className="p-3 flex flex-col">
              <div className="flex items-center gap-1.5 mb-2">
                <Lock className="w-3 h-3 text-primary flex-shrink-0" />
                <span className="text-xs font-medium text-primary leading-tight">Security Kit</span>
              </div>
              <div className="space-y-2 mb-3 flex-1">
                <div>
                  <label className="text-[10px] font-medium mb-1 block">Product:</label>
                  <Select
                    value={selectedProduct}
                    onValueChange={(value) => setSelectedProduct(value as "kit" | "wrench")}
                  >
                    <SelectTrigger data-testid="select-product" className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kit">Complete Kit</SelectItem>
                      <SelectItem value="wrench">Wrench Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {selectedProduct === "kit" && (
                  <div>
                    <label className="text-[10px] font-medium mb-1 block">Pack:</label>
                    <Select value={selectedPackSize} onValueChange={setSelectedPackSize}>
                      <SelectTrigger data-testid="select-pack" className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PACK_SIZES.map((pack) => (
                          <SelectItem key={pack.size} value={pack.size.toString()}>
                            {pack.label}
                            {pack.discount > 0 && ` (-${(pack.discount * 100).toFixed(0)}%)`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <div className="mb-2">
                <div className="text-xl font-bold text-primary">${price.toFixed(2)}</div>
                {selectedProduct === "kit" && currentPack.discount > 0 && (
                  <div className="text-[10px] text-green-600 font-medium">
                    Save {(currentPack.discount * 100).toFixed(0)}%
                  </div>
                )}
              </div>
              <Button
                className="w-full h-9 text-xs"
                onClick={handleAddToCart}
                data-testid="button-add-to-cart"
              >
                <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
                Add to Cart
              </Button>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Left Column - Product Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-white rounded-lg overflow-hidden border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={componentsFlatLay}
                  alt="Professional anti-theft frame security hardware kit with zinc steel T-screws, wall brackets, frame plates, security wrench, and mounting fasteners for museum-grade picture frame protection"
                  className="w-full h-full object-contain p-8"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 hidden md:grid">
                <div className="aspect-square bg-white rounded-lg overflow-hidden border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={hardwareKitLayout}
                    alt="Tamper-resistant frame security components including T-head security screws, wall mounting brackets, and frame attachment plates"
                    className="w-full h-full object-contain p-4"
                  />
                </div>
                <div className="aspect-square bg-white rounded-lg overflow-hidden border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={screwComponents}
                    alt="Close-up of security T-screw, wall anchor, and specialty wrench for anti-theft picture frame mounting system"
                    className="w-full h-full object-contain p-4"
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Desktop */}
            <div>
              <div className="hidden md:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Lock className="w-4 h-4" />
                Museum-Grade Security
              </div>
              <h1 className="hidden md:block text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                Professional Security Hardware Kit for Wood Frames
              </h1>
              <p className="text-sm md:text-base lg:text-lg text-muted-foreground mb-6">
                Keep your artwork and picture frames protected with this professional,
                theft-deterrent security hardware kit designed specifically for wood picture frames.
              </p>

              <Card className="p-6 hidden md:block">
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Product:</label>
                    <Select
                      value={selectedProduct}
                      onValueChange={(value) => setSelectedProduct(value as "kit" | "wrench")}
                    >
                      <SelectTrigger data-testid="select-product">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kit">Complete Security Hardware Kit - $8.95</SelectItem>
                        <SelectItem value="wrench">Security Wrench Only - $4.95</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {selectedProduct === "kit" && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">Pack Size:</label>
                      <Select value={selectedPackSize} onValueChange={setSelectedPackSize}>
                        <SelectTrigger data-testid="select-pack">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PACK_SIZES.map((pack) => (
                            <SelectItem key={pack.size} value={pack.size.toString()}>
                              {pack.label} - ${pack.price.toFixed(2)}
                              {pack.discount > 0 && (
                                <span className="text-green-600 ml-2">
                                  (Save {(pack.discount * 100).toFixed(0)}%)
                                </span>
                              )}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
                <div className="mb-6">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-primary">${price.toFixed(2)}</span>
                    {selectedProduct === "kit" && currentPack.discount > 0 && (
                      <span className="text-sm text-green-600 font-medium">
                        Save {(currentPack.discount * 100).toFixed(0)}%
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleAddToCart}
                  data-testid="button-add-to-cart"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 2. What's Included */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 border-b">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6">What&apos;s Included</h2>
        <Card className="p-6">
          <div className="grid sm:grid-cols-2 gap-4">
            {INCLUDED_ITEMS.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* 3. Key Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 border-b">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8">Key Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Ultimate Theft Deterrence</h3>
            <p className="text-sm text-muted-foreground">
              Security T-screws lock the frame to the wall, preventing lift-off or unauthorized
              removal in public settings.
            </p>
          </div>
          <div>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Museum-Grade Construction</h3>
            <p className="text-sm text-muted-foreground">
              Commercial-quality steel brackets and tamper-resistant fasteners trusted by galleries,
              museums, and corporate offices.
            </p>
          </div>
          <div>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Perfect for High-Traffic Environments</h3>
            <p className="text-sm text-muted-foreground">
              Ideal for art galleries, hotels, office lobbies, healthcare facilities, and retail
              environments.
            </p>
          </div>
        </div>
      </section>

      {/* 4. How It Works (Installation Guide) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 border-b">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="aspect-square bg-white rounded-lg overflow-hidden border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={frameBackHardware}
                alt="Security hardware brackets installed on back of wood picture frame showing tamper-proof mounting system"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Step 1: Attach Frame Plates</h3>
              <p className="text-sm text-muted-foreground">
                Mount slotted security plates to the back of your wood frame using the provided
                screws. Plates allow micro-adjustment for perfect leveling.
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="aspect-square bg-white rounded-lg overflow-hidden border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={wallMounting}
                alt="Installing wall bracket with security T-screw for theft-deterrent picture frame mounting"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Step 2: Install Wall Brackets</h3>
              <p className="text-sm text-muted-foreground">
                Secure wall brackets using included anchors and screws. Position brackets to align
                with frame plates for flush mounting.
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="aspect-square bg-white rounded-lg overflow-hidden border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={bracketInstallation}
                alt="Hand installing anti-theft security bracket with T-screw lock system on picture frame back"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Step 3: Lock with T-Screw</h3>
              <p className="text-sm text-muted-foreground">
                Use the specialty wrench to tighten the security T-screw, locking the frame to the
                wall bracket. Frame cannot be removed without the unique tool.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. About This Product */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6">About This Product</h2>
        <div className="space-y-6 text-muted-foreground">
          <div className="grid md:grid-cols-[2fr,1fr] gap-6 mb-8">
            <div className="space-y-4">
              <p>
                This professional-grade security hanging kit for wood picture frames delivers
                reliable theft prevention for artwork, photographs, certificates, and commercial
                displays. Featuring tamper-resistant T-screws, locking brackets, and heavy-duty wall
                anchors, this anti-theft frame hardware is engineered for public installations,
                museums, hotels, offices, and retail spaces.
              </p>
              <p>
                The system mounts flush to the wall and locks the frame in place so it cannot be
                lifted or removed without the specialty wrench. Perfect for high-traffic areas or
                locations where wall art must remain secure, this kit provides stable mounting,
                long-term durability, and micro-adjustability for perfectly level installation.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white rounded-lg overflow-hidden border aspect-square">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={securityBracketsBack}
                  alt="Close-up view of security T-screws and locking brackets mounted on picture frame back for anti-theft protection"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-6 mt-8">
            <h3 className="font-semibold text-foreground mb-3">Compatibility</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                Designed specifically for wood frames of all depths
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                Compatible with most standard, custom, and gallery-style mouldings
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                Recommended for medium to large frames (16×20 and up)
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                Use two kits for frames wider than 36 inches
              </li>
            </ul>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mt-8">
            <h3 className="font-semibold text-foreground mb-3">Perfect For</h3>
            <ul className="grid sm:grid-cols-2 gap-3 text-sm">
              {PERFECT_FOR_ITEMS.map((use, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  {use}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
