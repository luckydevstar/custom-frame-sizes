"use client";

import Link from "next/link";
import { Square, Shield, Sparkles, Layers, Grid3x3, Award, SprayCan, Palette } from "lucide-react";

export function ComponentsMegaMenu() {
  const components = [
    {
      label: "Mat Board",
      href: "/mat-designer",
      icon: Square,
      description: "Custom cut mat boards",
    },
    {
      label: "Acrylic",
      href: "/components/acrylic",
      icon: Sparkles,
      description: "Clear protective glazing",
    },
    {
      label: "Foam Board",
      href: "/components/foam-board",
      icon: Layers,
      description: "Lightweight backing boards",
    },
    {
      label: "Security Hardware",
      href: "/components/security-hardware-kit",
      icon: Shield,
      description: "Heavy-duty hanging system",
    },
    {
      label: "Cleat Hangers",
      href: "/components/cleat-hangers",
      icon: Grid3x3,
      description: "French cleat wall hangers",
    },
    {
      label: "Brass Nameplates",
      href: "/components/brass-nameplates",
      icon: Award,
      description: "Custom engraved plaques",
    },
    {
      label: "Acrylic Cleaner",
      href: "/components/acrylic-cleaner",
      icon: SprayCan,
      description: "Safe cleaning solution",
    },
    {
      label: "Order Samples",
      href: "/samples",
      icon: Palette,
      description: "Try before you buy",
    },
  ];

  return (
    <div className="p-4" data-testid="megamenu-components-content">
      <div>
        <h3 className="font-semibold text-sm text-muted-foreground mb-3 px-3">Frame Components</h3>
        <div className="grid grid-cols-2 gap-2">
          {components.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                data-testid={`link-megamenu-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className="flex items-start gap-2 px-3 py-2.5 rounded-md hover-elevate active-elevate-2 w-40">
                  <Icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-sm">{item.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{item.description}</div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
