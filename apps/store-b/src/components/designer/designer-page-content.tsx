"use client";

/**
 * Picture frame designer — origina-store-b/client/src/pages/Designer.tsx
 * FrameDesigner ships from @framecraft/ui (client-only internals).
 */

import { FrameDesigner } from "@framecraft/ui";

export function DesignerPageContent() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="font-serif text-4xl font-bold mb-4">Design Your Perfect Frame</h1>
        <p className="hidden md:block text-lg text-muted-foreground max-w-2xl mx-auto">
          Upload your image and customize every detail to create a frame that&apos;s uniquely yours
        </p>
        <p className="md:hidden text-base text-muted-foreground max-w-2xl mx-auto">
          Start by tapping Customize to adjust your size, mat, and finish. Switch to Preview anytime to see it in real
          time.
        </p>
      </div>
      <FrameDesigner />
    </div>
  );
}
