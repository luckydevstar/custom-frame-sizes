"use client";

import { getStoreAssetUrl } from "@framecraft/core";
import { Shield, Sparkles, Sun } from "lucide-react";

/** origina-store-b/client/src/components/home/GlazingShowcase.tsx (copy + structure) */

const glazingOptions = [
  {
    id: "standard",
    name: "Standard Frame-Grade Acrylic",
    tier: "Included",
    benefits: [
      { icon: Shield, text: "Shatter-resistant protection" },
      { icon: Sparkles, text: "Crystal clear clarity" },
      { icon: Shield, text: "Lightweight & durable" },
      { icon: Sun, text: "Basic UV filtering" },
    ],
    recommended: "Standard option included with every frame",
  },
  {
    id: "non-glare",
    name: "Non-Glare Frame-Grade Acrylic",
    tier: "Premium",
    benefits: [
      { icon: Sparkles, text: "Professional-grade clarity" },
      { icon: Sun, text: "Eliminates reflections & glare" },
      { icon: Shield, text: "99% UV protection" },
      { icon: Sun, text: "Ideal for bright rooms" },
    ],
    recommended: "Best for heirloom pieces",
    isPremium: true,
  },
  {
    id: "none",
    name: "No Glazing / Backing Only",
    tier: "Budget",
    benefits: [
      { icon: Sparkles, text: "Direct artwork viewing" },
      { icon: Shield, text: "Canvas & texture-friendly" },
      { icon: Shield, text: "Backing board included" },
      { icon: Shield, text: "No glass needed" },
    ],
    recommended: "For canvas or textured art",
  },
];

export function ShadowboxGlazingShowcase() {
  return (
    <section className="py-10 sm:py-12" data-testid="section-glazing">
      <div className="container mx-auto px-6">
        <div className="text-center mb-8">
          <h2 className="font-serif text-3xl font-semibold mb-2" data-testid="text-glazing-heading">
            Protecting what matters: glazing
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Choose the right acrylic protection for your shadowbox frame. Every option is
            lightweight, shatter-resistant, and designed to preserve what&apos;s inside.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto mb-8">
          <div className="relative group">
            <div className="aspect-[3/2] rounded-lg overflow-hidden bg-muted/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getStoreAssetUrl("glazing/standard-acrylic.jpg")}
                alt="Standard frame-grade acrylic with visible glare and reflections in bright lighting"
                className="w-full h-full object-contain"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h3 className="font-serif text-base font-semibold mb-0.5">Standard Acrylic</h3>
                <p className="text-xs text-white/90">May show reflections in bright lighting</p>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="aspect-[3/2] rounded-lg overflow-hidden ring-2 ring-primary/30 bg-muted/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getStoreAssetUrl("glazing/nonglare-acrylic.jpg")}
                alt="Non-glare frame-grade acrylic with crystal clear viewing, no reflections or glare"
                className="w-full h-full object-contain"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-2 right-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                  Premium
                </span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h3 className="font-serif text-base font-semibold mb-0.5">Non-Glare Acrylic</h3>
                <p className="text-xs text-white/90">Crystal clear viewing, zero reflections</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-8">
          {glazingOptions.map((option) => (
            <div
              key={option.id}
              className={[
                "relative rounded-lg border bg-card p-6 hover-elevate",
                option.isPremium ? "border-primary/30 ring-1 ring-primary/20" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              data-testid={`glazing-card-${option.id}`}
            >
              {option.isPremium ? (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                    Premium Choice
                  </span>
                </div>
              ) : null}

              <div className="text-center mb-5">
                <h3 className="font-serif text-xl font-semibold mb-1" data-testid={`text-glazing-name-${option.id}`}>
                  {option.name}
                </h3>
              </div>

              <ul className="space-y-3 mb-5">
                {option.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <benefit.icon className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{benefit.text}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-4 border-t">
                <p className="text-xs text-center text-muted-foreground/80">
                  <span className="font-medium text-foreground">Recommended:</span> {option.recommended}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center max-w-3xl mx-auto">
          <p className="text-sm text-muted-foreground leading-relaxed">
            All acrylic glazing options are shatter-resistant and significantly lighter than glass,
            making them safer for homes and easier to hang. Our non-glare acrylic features advanced
            micro-etching technology that eliminates reflections while maintaining exceptional
            clarity, reducing glare in bright rooms and near windows.
          </p>
        </div>
      </div>
    </section>
  );
}
