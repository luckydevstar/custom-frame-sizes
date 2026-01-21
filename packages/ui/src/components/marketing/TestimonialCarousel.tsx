import { Helmet } from "react-helmet-async";
import { Star, ChevronLeft, ChevronRight, Shield, Flag, RotateCcw } from "lucide-react";
import { useRotatingTestimonial } from "@framecraft/core";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { useEffect } from "react";

export interface TestimonialCarouselProps {
  showTrustIndicators?: boolean;
  autoRotateInterval?: number;
}

export function TestimonialCarousel({
  showTrustIndicators = true,
  autoRotateInterval = 7000,
}: TestimonialCarouselProps) {
  const {
    testimonial,
    testimonials,
    currentIndex,
    isLoading,
    isPaused: _isPaused,
    prefersReducedMotion,
    goToNext,
    goToPrev,
    goToIndex,
    setPaused,
    totalCount: _totalCount,
  } = useRotatingTestimonial(autoRotateInterval);

  // Touch handling for swipe on mobile
  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0]?.screenX ?? 0;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0]?.screenX ?? 0;
      if (touchStartX && touchEndX) {
        handleSwipe();
      }
    };

    const handleSwipe = () => {
      const swipeThreshold = 50;
      if (touchStartX - touchEndX > swipeThreshold) {
        goToNext();
      } else if (touchEndX - touchStartX > swipeThreshold) {
        goToPrev();
      }
    };

    const section = document.querySelector('[data-testid="section-testimonial-carousel"]');
    if (section) {
      section.addEventListener("touchstart", handleTouchStart as EventListener);
      section.addEventListener("touchend", handleTouchEnd as EventListener);

      return () => {
        section.removeEventListener("touchstart", handleTouchStart as EventListener);
        section.removeEventListener("touchend", handleTouchEnd as EventListener);
      };
    }
    return undefined;
  }, [goToNext, goToPrev]);

  // Generate JSON-LD schema for active review
  const jsonLdSchema = testimonial
    ? {
        "@context": "https://schema.org",
        "@type": "Review",
        itemReviewed: {
          "@type": "Product",
          name: "Custom Frame",
        },
        author: {
          "@type": "Person",
          name: testimonial.author,
        },
        reviewRating: {
          "@type": "Rating",
          ratingValue: testimonial.rating,
          bestRating: 5,
        },
        reviewBody: testimonial.quote,
      }
    : null;

  if (isLoading || !testimonial) {
    return (
      <section className="py-6 md:py-8 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center space-y-3">
            <Skeleton className="h-5 w-28 mx-auto" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-4 w-20 mx-auto" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* JSON-LD Schema for active review */}
      {jsonLdSchema && (
        <Helmet>
          <script type="application/ld+json">{JSON.stringify(jsonLdSchema)}</script>
        </Helmet>
      )}

      <section
        className="py-6 md:py-8 bg-muted/30 relative"
        data-testid="section-testimonial-carousel"
        onMouseEnter={() => !prefersReducedMotion && setPaused(true)}
        onMouseLeave={() => !prefersReducedMotion && setPaused(false)}
      >
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto relative">
            {/* Previous Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 hidden md:flex z-10"
              onClick={goToPrev}
              aria-label="Previous testimonial"
              data-testid="button-prev-testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            {/* Testimonial Content */}
            <div
              className="text-center transition-opacity duration-300"
              style={{ minHeight: "140px" }}
            >
              {/* Star Rating */}
              <div
                className="flex items-center justify-center gap-0.5 mb-3"
                data-testid="rating-stars"
              >
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    aria-hidden="true"
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote
                className="text-base md:text-lg text-foreground/90 mb-3 italic"
                style={{ lineHeight: "1.5", maxWidth: "65ch", margin: "0 auto 0.75rem" }}
                data-testid="text-quote"
              >
                &quot;{testimonial.quote}&quot;
              </blockquote>

              {/* Author with Location */}
              <p className="text-sm font-medium text-muted-foreground" data-testid="text-author">
                {testimonial.author}, {testimonial.location}
              </p>
            </div>

            {/* Next Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 hidden md:flex z-10"
              onClick={goToNext}
              aria-label="Next testimonial"
              data-testid="button-next-testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>

            {/* Bullet Indicators */}
            <div
              className="flex items-center justify-center gap-2 mt-2"
              data-testid="carousel-indicators"
            >
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToIndex(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-200 ${
                    index === currentIndex
                      ? "w-6 bg-primary"
                      : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                  data-testid={`indicator-${index}`}
                />
              ))}
            </div>
          </div>

          {/* Trust Indicators */}
          {showTrustIndicators && (
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-6 pt-6 border-t max-w-2xl mx-auto">
              <div className="flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-primary" aria-hidden="true" />
                <span className="text-sm font-medium">Secure Checkout</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RotateCcw className="h-4 w-4 text-primary" aria-hidden="true" />
                <span className="text-sm font-medium">Money-Back Guarantee</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Flag className="h-4 w-4 text-primary" aria-hidden="true" />
                <span className="text-sm font-medium">Proudly Made in the USA</span>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
