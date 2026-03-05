"use client";

import { Button } from "@framecraft/ui";
import { ArrowDown } from "lucide-react";

export function ScrollToDesignerButton() {
  const scrollToDesigner = () => {
    const el = document.getElementById("military-designer");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <Button
      size="lg"
      onClick={scrollToDesigner}
      data-testid="button-design-now"
      className="text-lg"
    >
      <ArrowDown className="w-5 h-5 mr-2" />
      Design Your Frame
    </Button>
  );
}
