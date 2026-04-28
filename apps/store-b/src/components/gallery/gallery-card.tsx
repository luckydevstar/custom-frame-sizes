import { Copy, Edit, MoreVertical, Trash2 } from "lucide-react";

import { Badge } from "@framecraft/ui/components/ui/badge";
import { Button } from "@framecraft/ui/components/ui/button";
import { Card } from "@framecraft/ui/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@framecraft/ui/components/ui/dropdown-menu";

/** origina-store-b/client/src/components/GalleryCard.tsx */
export type GalleryCardProps = {
  id: string;
  imageUrl: string;
  frameName: string;
  size: string;
  createdAt: string;
  price: number;
};

export function GalleryCard({ id, imageUrl, frameName, size, createdAt, price }: GalleryCardProps) {
  return (
    <Card className="overflow-hidden hover-elevate group">
      <div className="aspect-square bg-muted relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={`Design ${id}`}
          className="w-full h-full object-cover"
          data-testid={`img-design-${id}`}
        />
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                aria-label="Open design options menu"
                data-testid={`button-menu-${id}`}
              >
                <MoreVertical className="h-4 w-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem data-testid={`menu-edit-${id}`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Design
              </DropdownMenuItem>
              <DropdownMenuItem data-testid={`menu-duplicate-${id}`}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" data-testid={`menu-delete-${id}`}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold" data-testid={`text-frame-${id}`}>
              {frameName}
            </h3>
            <p className="text-sm text-muted-foreground" data-testid={`text-date-${id}`}>
              {createdAt}
            </p>
          </div>
          <Badge variant="secondary" data-testid={`badge-size-${id}`}>
            {size}
          </Badge>
        </div>
        <div className="flex items-center justify-between pt-2 border-t">
          <span className="font-semibold" data-testid={`text-price-${id}`}>
            ${price}
          </span>
          <Button size="sm" data-testid={`button-reorder-${id}`}>
            Reorder
          </Button>
        </div>
      </div>
    </Card>
  );
}
