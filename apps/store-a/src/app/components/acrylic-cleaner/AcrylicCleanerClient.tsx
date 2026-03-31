"use client";

import { Button, Card, Label, QuantitySelector, TrustBadges } from "@framecraft/ui";
import { useToast } from "@framecraft/ui/hooks/use-toast";
import { ShoppingCart, Check, Sparkles, Shield, Droplets, Package } from "lucide-react";
import { addToCartOnly, createCartItemFromFrameConfig, useCartStore } from "@framecraft/core";
import Image from "next/image";
import { useState, useEffect } from "react";

const PRODUCT_IMAGES = [
  "https://novuspolish.com/cdn/shop/files/NPP-1---8-oz_Front_1946x.jpg?v=1731410582",
  "https://novuspolish.com/cdn/shop/files/NPP-1---8-oz-Back_1946x.jpg?v=1731410582",
  "https://novuspolish.com/cdn/shop/files/NPP1_Group_square_20240916_1946x.jpg?v=1731411664",
];

const PRICE = 9.95;
const SKU = "Decor_836";

export function AcrylicCleanerClient() {
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const total = PRICE * quantity;

  const handleCheckout = async () => {
    setIsCheckingOut(true);

    try {
      const cleanerConfig = {
        serviceType: "frame-only" as const,
        artworkWidth: 8,
        artworkHeight: 8,
        frameStyleId: "cleaner-product",
        matType: "none" as const,
        matBorderWidth: 0,
        matRevealWidth: 0,
        matColorId: "",
        glassTypeId: "standard",
        orderSource: "acrylic-cleaner",
      };

      const cartInput = createCartItemFromFrameConfig(cleanerConfig, total, quantity);
      useCartStore.getState().addItem(cartInput);
      await addToCartOnly(cleanerConfig, total, quantity);

      toast({
        title: "Added to Cart",
        description: `${quantity}x Acrylic Cleaner added to your cart.`,
      });
    } catch (error) {
      console.error("Error adding acrylic cleaner to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add to cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "NOVUS Acrylic Cleaner & Polish – 8oz",
    description:
      "Professional-grade acrylic cleaner and polish. Safe for framer's grade acrylic glazing. Anti-static formula resists dust and fingerprints.",
    sku: SKU,
    brand: {
      "@type": "Brand",
      name: "NOVUS",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: PRICE,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Custom Frame Sizes",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "663",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 md:py-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6 md:gap-10">
              {/* Product Images */}
              <div className="space-y-4">
                <div className="aspect-square rounded-lg overflow-hidden bg-white border relative">
                  <Image
                    src={PRODUCT_IMAGES[selectedImage]!}
                    alt="NOVUS Acrylic Cleaner 8oz bottle"
                    fill
                    className="object-contain p-4"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={selectedImage === 0}
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect fill='%23ffffff' width='400' height='400'/%3E%3C/svg%3E"
                    data-testid="img-product-main"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {PRODUCT_IMAGES.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImage(idx)}
                      className={`aspect-square rounded-lg overflow-hidden bg-white border-2 transition-colors relative ${
                        selectedImage === idx
                          ? "border-primary"
                          : "border-transparent hover:border-muted-foreground/30"
                      }`}
                      data-testid={`button-thumbnail-${idx}`}
                      aria-label={`Select product view ${idx + 1}`}
                    >
                      <Image
                        src={img}
                        alt={`Product view ${idx + 1}`}
                        fill
                        className="object-contain"
                        sizes="80px"
                        priority={false}
                        placeholder="blur"
                        blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'%3E%3Crect fill='%23ffffff' width='80' height='80'/%3E%3C/svg%3E"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">NOVUS Plastic Polish</p>
                  <h1
                    className="text-2xl md:text-3xl font-bold mb-2"
                    data-testid="text-product-title"
                  >
                    Acrylic Cleaner & Polish
                  </h1>
                  <p className="text-muted-foreground">8oz Bottle – Clean & Shine Formula</p>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold" data-testid="text-price">
                    ${PRICE.toFixed(2)}
                  </span>
                  <span className="text-muted-foreground">per bottle</span>
                </div>

                {/* Key Benefits */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Safe for Acrylic</p>
                      <p className="text-xs text-muted-foreground">No harsh chemicals</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Anti-Static</p>
                      <p className="text-xs text-muted-foreground">Resists dust</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Droplets className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Streak-Free</p>
                      <p className="text-xs text-muted-foreground">Crystal clear finish</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Package className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">8oz Bottle</p>
                      <p className="text-xs text-muted-foreground">Cleans 50+ frames</p>
                    </div>
                  </div>
                </div>

                {/* Quantity and Add to Cart */}
                <Card className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Quantity</Label>
                    <QuantitySelector value={quantity} onChange={setQuantity} />
                  </div>

                  <div className="flex items-center justify-between border-t pt-4">
                    <span className="font-medium">Total</span>
                    <span className="text-xl font-bold" data-testid="text-total">
                      ${total.toFixed(2)}
                    </span>
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    data-testid="button-add-to-cart"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {isCheckingOut ? "Adding..." : "Add to Cart"}
                  </Button>
                </Card>

                {/* Product Description */}
                <div className="space-y-4 pt-4 border-t">
                  <h2 className="font-semibold">The Right Cleaner for Acrylic Glazing</h2>
                  <p className="text-sm text-muted-foreground">
                    Regular glass cleaner can damage acrylic and cause cloudiness over time. This
                    professional-grade formula is designed specifically for acrylic and plastic
                    surfaces — the same glazing used in our picture frames.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    The anti-static formula repels dust and resists fingerprints, keeping your
                    framed artwork looking clean longer. Safe for all acrylic glazing including
                    framer&apos;s grade acrylic and non-glare acrylic.
                  </p>
                </div>

                {/* How to Use */}
                <div className="space-y-3 pt-4 border-t">
                  <h2 className="font-semibold">How to Use</h2>
                  <ol className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                        1
                      </span>
                      <span>
                        Spray cleaner onto a soft microfiber cloth (never directly on the acrylic)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                        2
                      </span>
                      <span>Wipe gently using long, sweeping strokes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                        3
                      </span>
                      <span>Polish with circular strokes using a clean section of the cloth</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                        4
                      </span>
                      <span>Buff to a streak-free shine</span>
                    </li>
                  </ol>
                </div>

                {/* What to Avoid */}
                <div className="space-y-3 pt-4 border-t">
                  <h2 className="font-semibold">What to Avoid</h2>
                  <ul className="text-sm text-muted-foreground space-y-1.5">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                      <span>Never use ammonia-based glass cleaners on acrylic</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                      <span>Avoid paper towels — they can scratch</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                      <span>Don&apos;t spray directly on the glazing surface</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-10 pt-6 border-t">
              <TrustBadges />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
