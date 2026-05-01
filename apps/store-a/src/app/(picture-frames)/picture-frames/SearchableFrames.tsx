'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { FrameStyle } from '@framecraft/types';
import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { getStoreBaseAssetUrl } from '@framecraft/core';
import { Button } from '@framecraft/ui';
import { ArrowRight, Sparkles } from 'lucide-react';

/** Hides its children whenever a ?search= query param is active. */
export function HideOnSearch({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  if (searchParams.get('search')) return null;
  return <>{children}</>;
}

interface SearchableFramesProps {
  frames: FrameStyle[];
}

function getCornerOrThumbUrl(frame: {
  alternateImages?: { type: string; url: string }[];
  thumbnail?: string | null;
}) {
  const corner = frame.alternateImages?.find((img) => img.type === 'corner');
  if (corner) {
    const path = corner.url.startsWith('/') ? corner.url.slice(1) : corner.url;
    return getStoreBaseAssetUrl(path);
  }
  if (frame.thumbnail) {
    const path = frame.thumbnail.startsWith('/') ? frame.thumbnail.slice(1) : frame.thumbnail;
    return getStoreBaseAssetUrl(path);
  }
  return null;
}

export function SearchableFrames({ frames }: SearchableFramesProps) {
  const searchParams = useSearchParams();
  const query = searchParams.get('search')?.toLowerCase().trim();

  const filteredFrames = useMemo(() => {
    if (!query) return frames;

    return frames.filter((frame) => {
      const searchableText = [
        frame.name,
        frame.shortDescription,
        frame.featuredDescription,
        frame.material,
        frame.colorName,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return searchableText.includes(query);
    });
  }, [frames, query]);

  return (
    <>
      {filteredFrames.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No frames found matching your search.</p>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/picture-frames">Clear search</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredFrames.map((frame) => {
            const imgSrc = getCornerOrThumbUrl(frame);
            return (
              <Link
                key={frame.id}
                href={`/designer?frame=${frame.id}`}
                className="group relative overflow-hidden rounded-lg border bg-card hover:border-primary/30 transition-all cursor-pointer block"
                data-testid={`frame-${frame.id}`}
              >
                <div className="relative aspect-square overflow-hidden bg-muted/20">
                  {imgSrc ? (
                    <Image
                      src={imgSrc}
                      alt={
                        frame.alternateImages?.find((i) => i.type === 'corner')?.alt ??
                        `${frame.name} frame`
                      }
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 33vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Sparkles className="w-12 h-12 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm line-clamp-2 mb-2">{frame.name}</h3>
                  {frame.shortDescription && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                      {frame.shortDescription}
                    </p>
                  )}
                  <Button variant="ghost" size="sm" className="w-full">
                    View Frame
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
