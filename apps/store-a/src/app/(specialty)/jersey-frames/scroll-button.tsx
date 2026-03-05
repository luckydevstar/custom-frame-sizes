"use client";

import { Button } from "@framecraft/ui";

export function ScrollToDesignerButton() {
  const scrollToDesigner = () => {
    const designerSection = document.getElementById("jersey-designer");
    if (designerSection) {
      designerSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <Button
      size="lg"
      onClick={scrollToDesigner}
      data-testid="button-design-now"
      className="rounded-full"
    >
      Design Your Frame
    </Button>
  );
}
