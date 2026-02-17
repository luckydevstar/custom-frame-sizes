import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, SquareStack } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, Button } from "@framecraft/ui";

export const metadata: Metadata = {
  title:
    "Foam Board – Mounting Board for Frames | White, Black, Self-Adhesive | Custom Frame Sizes",
  description:
    "Professional foam board in white, black, and self-adhesive. Popular sizes 24x36, 8x10, 13x19, 11x17, 12x18. Photo mounting and frame backing with wholesale pricing.",
  openGraph: {
    title: "Foam Board – Mounting Board for Frames",
    description: "Professional foam board in white, black, and self-adhesive. Wholesale pricing.",
    type: "website",
  },
};

export default function FoamBoardPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/components"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            All Components
          </Link>

          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <SquareStack className="h-5 w-5" />
            <span className="text-sm font-medium">Components</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Foam Board</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Professional mounting boards in white, black, and self-adhesive options. Popular sizes
            like 24x36, 8x10, 13x19, 11x17, and 12x18 for photo mounting and frame backing.
          </p>

          <div className="grid gap-4 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Multiple Colors</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Standard white, black, and self-adhesive white. Archival-quality foam core for
                mounting photos and artwork. Cut to your exact dimensions.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Wholesale Pricing</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Bulk packs of 10 or 100 sheets with volume discounts. Same-day cutting available for
                frame shops and serious DIY framers.
              </CardContent>
            </Card>
          </div>

          <Button asChild size="lg">
            <Link href="/designer">Use in Frame Designer</Link>
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Add foam board when building a custom frame, or{" "}
            <Link href="/contact" className="text-primary underline hover:no-underline">
              contact us
            </Link>{" "}
            for standalone sheet orders.
          </p>
        </div>
      </div>
    </div>
  );
}
