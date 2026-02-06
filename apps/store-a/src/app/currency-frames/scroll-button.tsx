"use client";

import { Button } from "@framecraft/ui";
import { ArrowDown } from "lucide-react";

export function ScrollToDesignerButton() {
  const scrollToDesigner = () => {
    const el = document.getElementById("currency-designer");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <Button size="lg" onClick={scrollToDesigner} data-testid="button-start-designing">
      Design Your Frame
      <ArrowDown className="w-4 h-4 ml-2" />
    </Button>
  );
}
