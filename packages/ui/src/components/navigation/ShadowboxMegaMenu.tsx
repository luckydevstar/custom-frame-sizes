"use client";

import Link from "next/link";
import { Palette, Shirt, Award, ArrowRight, Heart, Banknote, Circle } from "lucide-react";
import { PostageStampIcon } from "../icons/PostageStampIcon";

export function ShadowboxMegaMenu() {
  const browseOptions = [
    {
      label: "Browse by Color",
      href: "/shadowboxes/colors",
      icon: Palette,
      description: "Shop shadowboxes by color",
    },
  ];

  const specialtyFrames = [
    {
      label: "Currency Frames",
      href: "/currency-frames",
      icon: Banknote,
      description: "Display currency collections",
    },
    {
      label: "Hockey Puck Frames",
      href: "/hockey-puck-frame-designer",
      icon: Circle,
      description: "Display hockey puck collections",
    },
    {
      label: "Jersey Frames",
      href: "/jersey-frames",
      icon: Shirt,
      description: "Display sports jerseys",
    },
    {
      label: "Military Frames",
      href: "/military-frames",
      icon: Award,
      description: "Honor military service",
    },
    {
      label: "Wedding Bouquet Frames",
      href: "/bouquet-frames",
      icon: Heart,
      description: "Preserve wedding bouquets",
    },
    {
      label: "Stamp Frames",
      href: "/stamp-frames",
      icon: PostageStampIcon,
      description: "Display stamp collections",
    },
  ];

  return (
    <div className="p-6" data-testid="megamenu-shadowbox-content">
      <div className="grid grid-cols-2 gap-8">
        {/* Browse Options */}
        <div>
          {/* View All - Featured Link */}
          <Link href="/shadowbox" data-testid="link-megamenu-view-all-shadowboxes">
            <div className="flex items-center justify-between px-3 py-3 mb-3 rounded-md bg-primary/5 border border-primary/20 hover-elevate active-elevate-2">
              <div>
                <div className="font-bold text-sm text-primary">View All Shadowboxes</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Browse our complete collection
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-primary flex-shrink-0" />
            </div>
          </Link>

          <h3 className="font-semibold text-sm text-muted-foreground mb-4 px-3">Browse By</h3>
          <div className="space-y-1">
            {browseOptions.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  data-testid={`link-megamenu-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <div className="flex items-start gap-3 px-3 py-2.5 rounded-md hover-elevate active-elevate-2">
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

        {/* Specialty Frames */}
        <div>
          <h3 className="font-semibold text-sm text-muted-foreground mb-4 px-3">
            Specialty Display
          </h3>
          <div className="space-y-1">
            {specialtyFrames.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  data-testid={`link-megamenu-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <div className="flex items-start gap-3 px-3 py-2.5 rounded-md hover-elevate active-elevate-2">
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
    </div>
  );
}
