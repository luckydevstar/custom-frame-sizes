"use client";

import { Button } from "@framecraft/ui";
import { ArrowDown } from "lucide-react";

export function ScrollToDesignerButton() {
  const scrollToDesigner = () => {
    const el = document.getElementById("designer");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <Button size="lg" onClick={scrollToDesigner} data-testid="button-design-frame" className="px-8">
      Design Your Frame
      <ArrowDown className="ml-2 h-5 w-5" aria-hidden />
    </Button>
  );
}
