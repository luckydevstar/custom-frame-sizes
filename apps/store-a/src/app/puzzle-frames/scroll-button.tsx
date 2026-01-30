"use client";

import { Button } from "@framecraft/ui";

export function ScrollToDesignerButton() {
  const scrollToDesigner = () => {
    const designerElement = document.querySelector("[data-designer-anchor]");
    if (designerElement) {
      designerElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <Button
      size="lg"
      onClick={scrollToDesigner}
      data-testid="button-scroll-to-designer"
      className="gap-2"
    >
      Design Your Frame
    </Button>
  );
}
