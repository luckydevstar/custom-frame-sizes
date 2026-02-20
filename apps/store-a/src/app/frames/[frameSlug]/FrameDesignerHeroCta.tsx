"use client";

import { Button } from "@framecraft/ui";
import { ArrowRight } from "lucide-react";

export function FrameDesignerHeroCta() {
  return (
    <div className="flex justify-center mt-6">
      <Button
        size="lg"
        className="min-h-11"
        onClick={() => {
          document.querySelector("[data-designer-anchor]")?.scrollIntoView({ behavior: "smooth" });
        }}
        data-testid="button-design-frame-hero"
      >
        Design Your Frame
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}
