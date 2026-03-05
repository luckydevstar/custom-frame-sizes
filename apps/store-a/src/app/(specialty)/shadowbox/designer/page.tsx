import type { Metadata } from "next";
import nextDynamic from "next/dynamic";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@framecraft/ui";

const ShadowboxDesigner = nextDynamic(
  () => import("@framecraft/ui").then((m) => m.ShadowboxDesigner),
  { ssr: false }
);

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shadowbox Designer | Custom Frame Sizes",
  description:
    "Design your custom shadowbox frame. Choose size, depth, and style with real-time pricing.",
};

export default function ShadowboxDesignerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/shadowbox">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shadowbox Frames
          </Link>
        </Button>
        <div className="mb-6 text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Custom Shadowbox Designer</h1>
          <p className="text-muted-foreground">
            Design your perfect shadowbox frame with real-time pricing
          </p>
        </div>
        <Suspense
          fallback={
            <div className="min-h-[600px] flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Loading designer...</p>
              </div>
            </div>
          }
        >
          <ShadowboxDesigner />
        </Suspense>
      </div>
    </div>
  );
}
