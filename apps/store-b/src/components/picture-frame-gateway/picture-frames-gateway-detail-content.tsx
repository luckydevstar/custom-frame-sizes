"use client";

import Link from "next/link";

import { Badge, Button, Card, CardContent } from "@framecraft/ui";
import { ArrowRight, CheckCircle } from "lucide-react";

import type { PictureFramesGatewayKind, PictureFramesGatewayItem } from "@/lib/picture-frames-gateway.types";
import { pictureFramesGatewayHeroSrc } from "@/lib/picture-frames-gateway.urls";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

export function PictureFramesGatewayDetailContent({
  gatewayKind,
  item,
}: {
  gatewayKind: PictureFramesGatewayKind;
  item: PictureFramesGatewayItem;
}) {
  useScrollToTop();

  const imageSrc = pictureFramesGatewayHeroSrc(item);
  const typeSegment = gatewayKind;

  const designPhrase =
    gatewayKind === "styles" ? "style" : gatewayKind === "colors" ? "color" : "size";

  return (
    <div className="container mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8">
        <Button variant="ghost" size="sm" className="mb-4 min-h-11" data-testid="button-back" asChild>
          <Link href={`/frames/${typeSegment}`}>← Back to {typeSegment}</Link>
        </Button>
      </div>

      <div className="grid gap-12 md:grid-cols-2">
        {imageSrc ? (
          <div className="aspect-[4/3] overflow-hidden rounded-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageSrc} alt={item.name} className="h-full w-full object-cover" data-testid="img-detail" />
          </div>
        ) : null}

        <div className={!imageSrc ? "md:col-span-2" : ""}>
          <h1 className="mb-4 font-serif text-4xl font-bold" data-testid="text-detail-title">
            {item.name}
          </h1>

          <p className="mb-6 text-lg text-muted-foreground" data-testid="text-detail-description">
            {item.description}
          </p>

          {gatewayKind === "styles" ? (
            <div className="mb-8 space-y-4">
              {item.material ? (
                <div className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Material</p>
                    <p className="text-sm text-muted-foreground">{item.material}</p>
                  </div>
                </div>
              ) : null}
              {item.finish ? (
                <div className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Finish</p>
                    <p className="text-sm text-muted-foreground">{item.finish}</p>
                  </div>
                </div>
              ) : null}
              {item.mouldingWidth ? (
                <div className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Moulding Width</p>
                    <p className="text-sm text-muted-foreground">{item.mouldingWidth}</p>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          {gatewayKind === "colors" && item.hex ? (
            <div className="mb-8">
              <div className="flex items-center gap-4">
                <div
                  className="h-20 w-20 rounded-lg border-2"
                  style={{ backgroundColor: item.hex }}
                  data-testid="color-swatch"
                />
                <div>
                  <p className="font-medium">Color Code</p>
                  <p className="font-mono text-sm text-muted-foreground">{item.hex}</p>
                </div>
              </div>
            </div>
          ) : null}

          {gatewayKind === "sizes" ? (
            <div className="mb-8 space-y-6">
              {item.range ? (
                <div>
                  <p className="mb-2 font-medium">Size Range</p>
                  <Badge variant="outline" className="text-sm">
                    {item.range}
                  </Badge>
                </div>
              ) : null}
              {item.dimensions && Array.isArray(item.dimensions) ? (
                <div>
                  <p className="mb-2 font-medium">Available Sizes</p>
                  <div className="flex flex-wrap gap-2">
                    {item.dimensions.map((dim) => (
                      <Badge key={dim} variant="secondary">
                        {dim}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : null}
              {item.useCases && Array.isArray(item.useCases) ? (
                <div>
                  <p className="mb-2 font-medium">Recommended For</p>
                  <ul className="space-y-1">
                    {item.useCases.map((useCase) => (
                      <li key={useCase} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        {useCase}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {item.note ? (
                <Card className="bg-muted">
                  <CardContent className="p-4">
                    <p className="text-sm">{item.note}</p>
                  </CardContent>
                </Card>
              ) : null}
            </div>
          ) : null}

          <Button size="lg" className="min-h-11" data-testid="button-design-cta" asChild>
            <Link href="/#designer">
              Design in this {designPhrase}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
