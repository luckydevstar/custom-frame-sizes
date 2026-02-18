import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Lock, Shield, Building2, Check, Wrench } from "lucide-react";
import { Card, CardContent, Button } from "@framecraft/ui";
import { RelatedProducts } from "@/components/RelatedProducts";

export const metadata: Metadata = {
  title:
    "Professional Security Hardware Kit for Wood Frames - Museum-Grade Anti-Theft System | Custom Frame Sizes",
  description:
    "Prevent frame theft with professional security hardware for wood frames. Museum-grade T-screws, locking brackets & tamper-resistant mounting. Trusted by galleries, hotels & commercial spaces. Bulk pricing available.",
  keywords:
    "picture frame security hardware, anti-theft frame hardware, museum grade hanging system, security T-screws, tamper proof frame mounting, gallery frame security, commercial frame hardware",
  openGraph: {
    title: "Professional Security Hardware Kit - Museum-Grade Anti-Theft",
    description:
      "Museum-grade T-screws, locking brackets, tamper-resistant mounting. Complete kit from $8.95.",
    type: "website",
  },
};

export default function SecurityHardwareKitPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 md:py-10">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/components"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            All Components
          </Link>

          <div className="grid md:grid-cols-2 gap-8 items-start mb-12">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden relative">
              <Image
                src="/images/blog/botanical-frame-hero.png"
                alt="Professional security hardware kit with tamper-proof T-screws and wall brackets"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Lock className="w-4 h-4" />
                Security Kit
              </div>
              <h1 className="text-2xl md:text-3xl font-bold">Professional Security Hardware Kit</h1>
              <p className="text-muted-foreground">
                Museum-grade anti-theft hanging system with T-screws and locking brackets. Prevents
                unauthorized removal in galleries, hotels, and commercial spaces.
              </p>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary">$8.95</span>
                <span className="text-muted-foreground">per kit</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Tamper-Proof T-Screws</span>
                </div>
                <div className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Museum-Grade Security</span>
                </div>
              </div>

              <Card className="p-4">
                <CardContent className="p-0 space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Complete kit includes wall brackets, T-screws, security wrench, and hardware.
                    Bulk pricing available for 10, 25, or 100 kits.
                  </p>
                  <Button className="w-full" size="lg" asChild>
                    <Link href="/contact">Add to Cart / Inquire</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          <section className="py-8 border-t">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Wrench className="h-5 w-5 text-primary" />
              How It Works
            </h2>
            <p className="text-muted-foreground mb-4">
              The kit uses T-screws that require a special security wrench to remove. Mount the wall
              brackets first, then attach the frame with the T-screws. Only someone with the
              included wrench can take the frame down—ideal for galleries, hotels, lobbies, and
              high-traffic areas.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>
                  Wall brackets mount to the wall; frame hardware attaches to the frame back.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>
                  Tamper-proof T-screws lock the frame to the bracket. Security wrench included.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>
                  Bulk pricing for 10, 25, or 100 kits—ideal for commercial installations.
                </span>
              </li>
            </ul>
          </section>

          <RelatedProducts
            productKeys={["cleat-hangers", "brass-nameplates", "acrylic"]}
            title="Related Components"
            columns={3}
          />
        </div>
      </div>
    </div>
  );
}
