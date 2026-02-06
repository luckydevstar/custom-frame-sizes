"use client";

import { Button } from "@framecraft/ui";

export function ScrollToDesignerButton() {
  const scrollToDesigner = () => {
    const el = document.getElementById("design-tool");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <Button
      size="lg"
      onClick={scrollToDesigner}
      data-testid="button-design-frame"
      className="rounded-full"
    >
      Design Your Frame
    </Button>
  );
}
