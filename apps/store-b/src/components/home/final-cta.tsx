"use client";

import { Button } from "@framecraft/ui/components/ui/button";
import { ArrowRight } from "lucide-react";

import { TrustBadge } from "./trust-badge";

/** b-shadow-box-frames-original/client/src/components/home/FinalCta.tsx */
export function FinalCta() {
  const scrollToDesigner = () => {
    const designer = document.getElementById("designer");
    if (designer) {
      designer.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-12 sm:py-16" data-testid="section-final-cta">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2
            className="font-serif text-2xl sm:text-3xl font-semibold mb-3"
            data-testid="text-final-cta-heading"
          >
            Ready to Build Your Shadow Box?
          </h2>
          <p className="text-base text-muted-foreground mb-6">
            Choose your size, pick your depth, and see it come together in real time. Every frame is handcrafted in
            our workshop and shipped ready to hang.
          </p>
          <Button size="lg" onClick={scrollToDesigner} data-testid="button-final-cta">
            Design Your Shadowbox
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <TrustBadge />
        </div>
      </div>
    </section>
  );
}
