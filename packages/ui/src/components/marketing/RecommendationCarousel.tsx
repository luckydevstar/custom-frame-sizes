import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, ShoppingCart, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "../ui/carousel";
import { FramePreview } from "./FramePreview";
import type { DesignRecommendation } from "@framecraft/types";
import { formatPrice } from "@framecraft/core";
import { cn } from "../../utils";

interface RecommendationCarouselProps {
  recommendations: DesignRecommendation[];
  onApply: (recommendation: DesignRecommendation, sizeIndex: number) => void;
  onAddToCart: (recommendation: DesignRecommendation, sizeIndex: number) => void;
  onClose: () => void;
  uploadedImage?: string | null;
  open: boolean;
}

export function RecommendationCarousel({
  recommendations,
  onApply,
  onAddToCart,
  onClose,
  uploadedImage,
  open,
}: RecommendationCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [selectedSizes, setSelectedSizes] = useState<Record<number, number>>({});

  // Track current slide
  useEffect(() => {
    if (!api) return;

    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", handleSelect);

    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  const handleApply = (recommendation: DesignRecommendation, index: number) => {
    const sizeIndex = selectedSizes[index] || 0;
    onApply(recommendation, sizeIndex);
  };

  const handleAddToCart = (recommendation: DesignRecommendation, index: number) => {
    const sizeIndex = selectedSizes[index] || 0;
    onAddToCart(recommendation, sizeIndex);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-4xl w-full max-h-[90vh] sm:w-[calc(100vw-2rem)] overflow-hidden p-0 gap-0 flex flex-col"
        data-testid="dialog-recommendations"
      >
        <DialogHeader className="p-3 md:p-6 pb-2 md:pb-4 border-b">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              <DialogTitle className="text-base md:text-2xl">Designer&apos;s Picks</DialogTitle>
            </div>
            {/* Recommendation counter on mobile */}
            <div className="flex sm:hidden items-center gap-1.5">
              {recommendations.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full transition-all",
                    current === index ? "bg-primary w-4" : "bg-muted-foreground/30"
                  )}
                />
              ))}
            </div>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground mt-1 md:mt-2">
            {recommendations.length} curated designs for your photo
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto min-h-0">
          <Carousel setApi={setApi} className="h-full" opts={{ align: "start", loop: true }}>
            <CarouselContent className="h-full">
              {recommendations.map((recommendation, index) => (
                <CarouselItem key={index}>
                  <RecommendationCard
                    recommendation={recommendation}
                    uploadedImage={uploadedImage}
                    index={index}
                    selectedSize={selectedSizes[index] || 0}
                    onSizeChange={(sizeIndex) =>
                      setSelectedSizes((prev) => ({ ...prev, [index]: sizeIndex }))
                    }
                    onApply={() => handleApply(recommendation, index)}
                    onAddToCart={() => handleAddToCart(recommendation, index)}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>

            {recommendations.length > 1 && (
              <>
                <CarouselPrevious
                  className="left-2 md:left-4 top-[45%] md:top-1/2"
                  data-testid="button-prev-recommendation"
                />
                <CarouselNext
                  className="right-2 md:right-4 top-[45%] md:top-1/2"
                  data-testid="button-next-recommendation"
                />
              </>
            )}
          </Carousel>

          {/* Navigation dots - desktop only */}
          {recommendations.length > 1 && (
            <div className="hidden sm:flex justify-center gap-2 py-4">
              {recommendations.map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    current === index ? "bg-primary w-8" : "bg-muted-foreground/30"
                  )}
                  data-testid={`dot-recommendation-${index}`}
                  aria-label={`Go to recommendation ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface RecommendationCardProps {
  recommendation: DesignRecommendation;
  uploadedImage?: string | null;
  index: number;
  selectedSize: number;
  onSizeChange: (sizeIndex: number) => void;
  onApply: () => void;
  onAddToCart: () => void;
}

function RecommendationCard({
  recommendation,
  uploadedImage,
  index,
  selectedSize,
  onSizeChange,
  onApply,
  onAddToCart,
}: RecommendationCardProps) {
  const selectedSizeOption = recommendation.sizes[selectedSize];

  return (
    <div className="overflow-y-auto scrollbar-thin" data-testid={`card-recommendation-${index}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="p-3 md:p-6 space-y-3 md:space-y-4"
      >
        {/* Frame Preview - Larger on mobile for better visibility */}
        <div className="w-full max-w-md md:max-w-lg mx-auto aspect-square md:aspect-[4/3] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.12)] dark:shadow-[0_4px_20px_-2px_rgba(0,0,0,0.4)] rounded-sm">
          <FramePreview
            frameSku={recommendation.frameSku}
            frameColor={recommendation.frameColor}
            topMatColor={recommendation.topMatColor}
            bottomMatColor={recommendation.bottomMatColor}
            matType="double"
            uploadedImage={uploadedImage}
            artworkWidth={selectedSizeOption.width}
            artworkHeight={selectedSizeOption.height}
            fillMatOpening={true}
            matBorderWidth={1.0}
            frameWidth={0.625}
          />
        </div>

        {/* Frame and Mat Info - Condensed on Mobile */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Frame:</span>
            <Badge variant="secondary" className="text-xs" data-testid={`badge-frame-${index}`}>
              {recommendation.frameName}
            </Badge>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground">Mats:</span>
            <Badge
              variant="secondary"
              className="gap-1 text-xs"
              data-testid={`badge-top-mat-${index}`}
            >
              <div
                className="w-2.5 h-2.5 rounded-full border"
                style={{ backgroundColor: recommendation.topMatColor }}
              />
              {recommendation.topMatName}
            </Badge>
            <span className="text-xs text-muted-foreground">+</span>
            <Badge
              variant="secondary"
              className="gap-1 text-xs"
              data-testid={`badge-bottom-mat-${index}`}
            >
              <div
                className="w-2.5 h-2.5 rounded-full border"
                style={{ backgroundColor: recommendation.bottomMatColor }}
              />
              {recommendation.bottomMatName}
            </Badge>
          </div>
        </div>

        {/* Designer's Recommendation */}
        <div className="space-y-2 md:space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-primary" />
            <h4 className="text-sm md:text-base font-semibold text-foreground">Why This Works</h4>
          </div>
          <p
            className="text-sm md:text-base text-foreground leading-relaxed"
            data-testid={`text-explanation-${index}`}
          >
            {recommendation.explanation}
          </p>
        </div>

        {/* Size Options */}
        <div className="space-y-2">
          <Label className="text-xs md:text-sm font-semibold">
            Artwork Size &amp; Price
            <span className="ml-1 text-[10px] md:text-xs font-normal text-muted-foreground">
              (frame adds ~5&quot; to each dimension)
            </span>
          </Label>
          <RadioGroup
            value={selectedSize.toString()}
            onValueChange={(val) => onSizeChange(parseInt(val))}
            className="grid grid-cols-3 gap-2"
          >
            {recommendation.sizes.map((size, sizeIndex) => (
              <div key={sizeIndex}>
                <RadioGroupItem
                  value={sizeIndex.toString()}
                  id={`size-${index}-${sizeIndex}`}
                  className="peer sr-only"
                  data-testid={`radio-size-${index}-${sizeIndex}`}
                />
                <Label
                  htmlFor={`size-${index}-${sizeIndex}`}
                  className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-card p-2 md:p-3 hover-elevate cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 min-h-[68px] md:min-h-[76px]"
                >
                  <div className="text-center space-y-0.5">
                    <div className="text-xs md:text-sm font-semibold">{size.label}</div>
                    <div className="text-[10px] md:text-xs text-muted-foreground whitespace-nowrap">
                      {size.width}&quot; × {size.height}&quot;
                    </div>
                    <div className="text-xs md:text-base font-bold text-primary">
                      {formatPrice(size.price)}
                    </div>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-1">
          <Button
            onClick={onAddToCart}
            variant="default"
            className="w-full"
            data-testid={`button-add-to-cart-${index}`}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart · {formatPrice(selectedSizeOption.price)}
          </Button>
          <Button
            onClick={onApply}
            variant="outline"
            className="w-full"
            size="sm"
            data-testid={`button-apply-${index}`}
          >
            <Check className="w-3.5 h-3.5 mr-2" />
            Edit Design
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
