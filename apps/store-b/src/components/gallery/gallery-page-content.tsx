"use client";

import { getSharedAssetUrl } from "@framecraft/core";
import { Search } from "lucide-react";
import { useEffect } from "react";

import { Input } from "@framecraft/ui/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@framecraft/ui/components/ui/select";

import { GalleryCard } from "./gallery-card";

/**
 * Image: origina-store-b `@assets/stock_images/photo_inserts/city_skyline_urban_a_08ab40a7.jpg`
 * → shared_assets `stock/photo_inserts/...`
 */
const mockDesignImageUrl = getSharedAssetUrl("stock/photo_inserts/city_skyline_urban_a_08ab40a7.jpg");

/** origina-store-b/client/src/pages/Gallery.tsx — mockDesigns unchanged (still marked todo in legacy) */
const mockDesigns = [
  {
    id: "1",
    imageUrl: mockDesignImageUrl,
    frameName: "Classic Oak Frame",
    size: '16" × 20"',
    createdAt: "2 days ago",
    price: 125.99,
  },
  {
    id: "2",
    imageUrl: mockDesignImageUrl,
    frameName: "Modern Walnut Frame",
    size: '11" × 14"',
    createdAt: "1 week ago",
    price: 95.5,
  },
  {
    id: "3",
    imageUrl: mockDesignImageUrl,
    frameName: "Black Metal Frame",
    size: '8" × 10"',
    createdAt: "2 weeks ago",
    price: 78.0,
  },
  {
    id: "4",
    imageUrl: mockDesignImageUrl,
    frameName: "Gold Ornate Frame",
    size: '18" × 24"',
    createdAt: "3 weeks ago",
    price: 185.0,
  },
  {
    id: "5",
    imageUrl: mockDesignImageUrl,
    frameName: "Silver Modern Frame",
    size: '24" × 36"',
    createdAt: "1 month ago",
    price: 245.0,
  },
  {
    id: "6",
    imageUrl: mockDesignImageUrl,
    frameName: "White Contemporary",
    size: '11" × 14"',
    createdAt: "1 month ago",
    price: 88.5,
  },
];

export function GalleryPageContent() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold mb-2" data-testid="text-gallery-title">
          Customer Stories & Shadow Box Gallery
        </h1>
        <p className="text-lg text-muted-foreground">Real Keepsakes, Real Stories</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search designs..."
            className="pl-10"
            data-testid="input-search"
          />
        </div>
        <Select defaultValue="recent">
          <SelectTrigger className="w-full sm:w-48" data-testid="select-sort">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockDesigns.map((design) => (
          <GalleryCard key={design.id} {...design} />
        ))}
      </div>
    </div>
  );
}
