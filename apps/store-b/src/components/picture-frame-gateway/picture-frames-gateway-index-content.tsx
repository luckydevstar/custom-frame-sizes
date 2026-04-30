"use client";

import Link from "next/link";

import { Badge, Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@framecraft/ui";
import { ArrowRight } from "lucide-react";

import type { PictureFramesGatewayKind, PictureFramesGatewayItem } from "@/lib/picture-frames-gateway.types";
import { pictureFramesGatewayHeroSrc } from "@/lib/picture-frames-gateway.urls";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

export function PictureFramesGatewayIndexContent({
  gatewayKind,
  items,
  title,
  description,
}: {
  gatewayKind: PictureFramesGatewayKind;
  items: PictureFramesGatewayItem[];
  title: string;
  description: string;
}) {
  useScrollToTop();

  const featuredItems = items.filter((item) => item.featured || item.popular);
  const otherItems = items.filter((item) => !item.featured && !item.popular);

  return (
    <div className="container mx-auto max-w-7xl px-6 py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 font-serif text-3xl font-bold sm:text-4xl md:text-5xl" data-testid={`text-${gatewayKind}-title`}>
          {title}
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground" data-testid={`text-${gatewayKind}-description`}>
          {description}
        </p>
      </div>

      {featuredItems.length > 0 ? (
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-semibold" data-testid={`text-${gatewayKind}-featured-title`}>
            Popular {title}
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredItems.map((item) => (
              <GatewayCard key={item.id} gatewayKind={gatewayKind} item={item} />
            ))}
          </div>
        </div>
      ) : null}

      {otherItems.length > 0 ? (
        <div>
          <h2 className="mb-6 text-2xl font-semibold" data-testid={`text-${gatewayKind}-all-title`}>
            All {title}
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {otherItems.map((item) => (
              <GatewayCard key={item.id} gatewayKind={gatewayKind} item={item} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function GatewayCard({
  gatewayKind,
  item,
}: {
  gatewayKind: PictureFramesGatewayKind;
  item: PictureFramesGatewayItem;
}) {
  const imageSrc = pictureFramesGatewayHeroSrc(item);

  return (
    <Link href={`/frames/${gatewayKind}/${item.slug}`} className="block h-full">
      <Card className="hover-elevate active-elevate-2 h-full transition-all" data-testid={`card-${gatewayKind}-${item.id}`}>
        {imageSrc ? (
          <div className="aspect-[4/3] overflow-hidden rounded-t-lg">
            {/* eslint-disable-next-line @next/next/no-img-element -- gateway marketing tiles; CDN JPEG/PNG */}
            <img src={imageSrc} alt={item.name} className="h-full w-full object-cover" />
          </div>
        ) : null}
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-xl" data-testid={`text-${gatewayKind}-${item.id}-name`}>
              {item.name}
            </CardTitle>
            {item.featured || item.popular ? (
              <Badge variant="secondary" data-testid={`badge-${item.id}-featured`}>
                Popular
              </Badge>
            ) : null}
          </div>
          <CardDescription data-testid={`text-${gatewayKind}-${item.id}-description`}>{item.description}</CardDescription>
        </CardHeader>
        {gatewayKind === "colors" && item.hex ? (
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-md border" style={{ backgroundColor: item.hex }} />
              <span className="font-mono text-sm text-muted-foreground">{item.hex}</span>
            </div>
          </CardContent>
        ) : null}
        {gatewayKind === "sizes" && item.range ? (
          <CardContent>
            <Badge variant="outline">{item.range}</Badge>
          </CardContent>
        ) : null}
        <CardFooter>
          <Button variant="ghost" className="min-h-11 w-full" data-testid={`button-view-${item.id}`}>
            View Details <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
