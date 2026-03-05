"use client";

import { Button } from "@framecraft/ui";
import { Sparkles } from "lucide-react";

export function ScrollToDesignerButton() {
  const scrollToDesigner = () => {
    const el = document.getElementById("design-tool");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <Button
      size="lg"
      onClick={scrollToDesigner}
      data-testid="button-scroll-to-designer"
      className="gap-2"
    >
      Design Your Wedding Frame
      <Sparkles className="w-4 h-4" />
    </Button>
  );
}
