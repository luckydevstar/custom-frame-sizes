"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
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
import { ShoppingCart, Ruler, Lock, Shield, Check, Star } from "lucide-react";

const PACK_SIZES = [
  { size: 1, label: "1 Set", price: 8.95, discount: 0 },
  { size: 10, label: "10 Sets", price: 79.95, discount: 0.11 },
  { size: 25, label: "25 Sets", price: 169.95, discount: 0.24 },
  { size: 100, label: "100 Sets", price: 499.95, discount: 0.44 },
];

const INCLUDED_ITEMS = [
  '1× 12" Wall Cleat Bar (pre-drilled slots for adjustability)',
  '1× 12" Frame Cleat Bar (mates perfectly with the wall cleat)',
  "Wood screws for frame mounting",
  "Drywall anchors for wall installation",
  "Heavy-duty mounting hardware",
  "Complete installation instructions",
];

const PERFECT_FOR_ITEMS = [
  "Frame shops & installers",
  "Interior designers",
  "Art galleries",
  "Hotels & hospitality",
  "Corporate art programs",
  "Large canvas installations",
  "Heavy shadowboxes",
  "DIY heavy-duty hanging",
];

export function CleatHangersClient() {
  const { toast } = useToast();
  const [selectedPackSize, setSelectedPackSize] = useState("1");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const currentPack =
    PACK_SIZES.find((p) => p.size.toString() === selectedPackSize) ?? PACK_SIZES[0];
  if (!currentPack) return null;

  const handleAddToCart = () => {
    toast({
      title: "Added to Cart",
      description: `12" Heavy-Duty Metal Cleat Bar Hanging System${currentPack.size > 1 ? ` - ${currentPack.label}` : ""}`,
    });
  };

  // Image: shared assets at components/cleat-hangers/cleat-hangers.png (or add to assets_to_use/shared_assets)
  const cleatHangersImage = getSharedAssetUrl("components/cleat-hangers/cleat-hangers.png");

  return (
    <div className="min-h-screen bg-background">
      {/* 1. Hero Section */}
      <section className="relative bg-gradient-to-b from-muted/50 to-background border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 md:py-8 lg:py-16">
          {/* Mobile-First Quick Purchase Card - Shows First on Mobile */}
          <Card className="p-4 mb-4 md:hidden">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Professional Grade</span>
            </div>
            <h1 className="text-xl font-bold mb-2">12&quot; Heavy-Duty Metal Cleat Bar System</h1>
            <div className="space-y-3 mb-4">
              <div>
                <label className="text-xs font-medium mb-1.5 block">Pack Size:</label>
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
            </div>

            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-2xl font-bold text-primary">
                ${currentPack.price.toFixed(2)}
              </span>
              {currentPack.discount > 0 && (
                <span className="text-xs text-green-600 font-medium">
                  Save {(currentPack.discount * 100).toFixed(0)}%
                </span>
              )}
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

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Left Column - Product Image */}
            <div className="aspect-square bg-white rounded-lg overflow-hidden border relative">
              <Image
                src={cleatHangersImage}
                alt="12-inch heavy-duty metal French cleat bar hanging system with wall anchors and mounting screws"
                fill
                className="object-contain p-8"
                unoptimized
              />
            </div>

            {/* Right Column - Product Info & Quick Add (Desktop) */}
            <div>
              <div className="hidden md:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Star className="w-4 h-4" />
                Professional Grade
              </div>
              <h1 className="hidden md:block text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                12&quot; Heavy-Duty Metal Cleat Bar Hanging System
              </h1>
              <p className="text-sm md:text-base lg:text-lg text-muted-foreground mb-6">
                Mount large or heavy picture frames with absolute confidence. This 12-inch
                heavy-duty metal cleat hanging system delivers rock-solid stability and perfect
                leveling for oversized frames and commercial displays.
              </p>

              {/* Quick Add to Cart Card - Desktop Only */}
              <Card className="p-6 hidden md:block">
                <div className="space-y-4 mb-6">
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
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-primary">
                      ${currentPack.price.toFixed(2)}
                    </span>
                    {currentPack.discount > 0 && (
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

      {/* 2. What's Included Section */}
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
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Heavy-Duty Weight Support</h3>
            <p className="text-sm text-muted-foreground">
              Engineered to support large, oversized, or heavy frames—ideal for gallery-grade
              installations and commercial displays.
            </p>
          </div>

          <div>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
              <Ruler className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Perfectly Level Every Time</h3>
            <p className="text-sm text-muted-foreground">
              Slotted holes allow micro-adjustments during installation to ensure your frame hangs
              straight, even on imperfect walls.
            </p>
          </div>

          <div>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Rock-Solid Interlocking Design</h3>
            <p className="text-sm text-muted-foreground">
              The metal cleat bars lock together to keep your frame pulled tight to the wall with
              zero forward tilt.
            </p>
          </div>
        </div>
      </section>

      {/* 4. About This Product / Product Details */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6">About This Product</h2>

        <div className="space-y-6 text-muted-foreground">
          <p>
            This 12-inch heavy-duty French cleat picture hanging system offers a secure, level, and
            professional solution for mounting large and heavy wall decor. Made from durable,
            rust-resistant metal, the interlocking cleat bars deliver superior strength and
            stability for oversized picture frames, shadowboxes, canvas panels, and art displays in
            both residential and commercial environments.
          </p>

          <p>
            Each cleat bar features elongated, pre-drilled slots for easy horizontal adjustment,
            allowing precise leveling even on uneven wall surfaces. The concealed mounting design
            keeps your artwork tight to the wall for a clean, modern, floating appearance.
          </p>

          <div className="bg-muted/50 rounded-lg p-6 mt-8">
            <h3 className="font-semibold text-foreground mb-3">Compatibility</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                Recommended for medium to extra-large frames, typically 16×20&quot; up to
                48×60&quot; and beyond
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                Works with wood frames, shadowboxes, canvas float frames, and MDF frames
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                Compatible with metal prints and acrylic wall art
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                For extremely heavy installations, two cleat sets may be used for added support
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

          <div className="bg-muted rounded-lg p-6 mt-8">
            <h3 className="font-semibold text-foreground mb-3">Why Choose French Cleat Hangers?</h3>
            <p className="text-sm mb-3">
              French cleat systems provide the strongest, most reliable hanging method for large and
              heavy artwork. Unlike traditional wire hangers or sawtooth brackets, cleat bars
              distribute weight evenly across the entire mounting surface and keep frames perfectly
              flush against the wall.
            </p>
            <p className="text-sm">
              The interlocking design means your frame cannot tip, shift, or fall—even in
              high-traffic areas or earthquake-prone regions. This is why professional installers
              and galleries rely on French cleats for their most valuable pieces.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
