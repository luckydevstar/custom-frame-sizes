import type { Metadata } from "next";
import { Suspense } from "react";
import { FrameDesigner } from "@framecraft/ui";

export const metadata: Metadata = {
  title: "Custom Frame Designer - Design Your Perfect Frame | CustomFrameSizes.com",
  description:
    "Design custom picture frames with our interactive designer. Choose your size, frame style, mat colors, and glazing options. See instant pricing and preview your design in real-time.",
  openGraph: {
    title: "Custom Frame Designer - Interactive Frame Builder",
    description:
      "Design and customize your perfect picture frame online. Any size, any style, instant pricing.",
    type: "website",
  },
};

export default function DesignerPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="font-serif text-4xl font-bold mb-4">Design Your Perfect Frame</h1>
        <p className="hidden md:block text-lg text-muted-foreground max-w-2xl mx-auto">
          Upload your image and customize every detail to create a frame that&apos;s uniquely yours
        </p>
        <p className="md:hidden text-base text-muted-foreground max-w-2xl mx-auto">
          Start by tapping Customize to adjust your size, mat, and finish. Switch to Preview anytime
          to see it in real time.
        </p>
      </div>
      <Suspense
        fallback={
          <div className="min-h-[600px] flex items-center justify-center">Loading designer...</div>
        }
      >
        <FrameDesigner />
      </Suspense>
    </div>
  );
}
