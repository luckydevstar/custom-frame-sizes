import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

type FrameCardProps = {
  name: string;
  material: string;
  startingPrice: number;
  imageUrl: string;
  featured?: boolean;
};

export function FrameCard({ name, material, startingPrice, imageUrl, featured }: FrameCardProps) {
  return (
    <Card className="overflow-hidden hover-elevate group">
      <div className="aspect-square bg-muted relative overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
          data-testid="img-frame"
        />
        {featured && (
          <Badge className="absolute top-2 right-2" data-testid="badge-featured">
            Popular
          </Badge>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold mb-1" data-testid="text-frame-name">
          {name}
        </h3>
        <p className="text-sm text-muted-foreground mb-3">{material}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold" data-testid="text-price">
            From ${startingPrice}
          </span>
          <Button data-testid="button-customize">Customize</Button>
        </div>
      </div>
    </Card>
  );
}
