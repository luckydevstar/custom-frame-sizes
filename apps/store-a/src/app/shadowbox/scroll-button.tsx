"use client";

import { Button } from "@framecraft/ui";

export function ScrollToDesignerButton() {
  const scrollToDesigner = () => {
    const designerElement = document.getElementById("design-tool");
    if (designerElement) {
      designerElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <Button
      size="lg"
      onClick={scrollToDesigner}
      data-testid="button-design-frame"
      className="rounded-full"
    >
      Design Your Shadowbox
    </Button>
  );
}
