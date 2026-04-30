"use client";

import Link from "next/link";

import { Button , Card, CardContent, CardDescription, CardHeader, CardTitle , 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@framecraft/ui";


import { Ruler, ArrowRight } from 'lucide-react';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';

export default function HowToMeasureArtworkForFraming() {
  useScrollToTop();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do I measure artwork for custom framing?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Use a metal ruler or measuring tape to measure artwork at its widest points, recording dimensions to the nearest 1/8 inch. For prints on paper, measure only the visible image area excluding white borders or deckled edges. For stretched canvas, measure the exact outer dimensions including wrapped edges. Add your desired mat border width to all four sides to calculate the required frame size. For example: 16×20 artwork + 3-inch mat borders = 22×26 frame (16+3+3 by 20+3+3)."
        }
      },
      {
        "@type": "Question",
        "name": "What mat border width should I use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Professional framing standards suggest 2.5 to 3.5 inch mat borders for most artwork. Small artwork (under 11×14) works well with 2 to 2.5 inch borders. Medium artwork (11×14 to 18×24) benefits from 2.5 to 3 inch borders. Large artwork (over 24×36) requires 3.5 to 4 inch borders. Use the rule of thirds as a starting point: mat border width should equal approximately one-third of the artwork's smallest dimension."
        }
      },
      {
        "@type": "Question",
        "name": "Should I measure the artwork or the paper it's printed on?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Measure the visible image area only, not the paper dimensions. Many prints have white borders or deckled edges that should be hidden under the mat. If you want to show any paper borders, include them in your measurement. For torn or irregular edges, measure to the furthest extent in each direction to determine minimum frame size needed."
        }
      },
      {
        "@type": "Question",
        "name": "How do I calculate total frame dimensions from artwork size?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Add your chosen mat border width twice to each artwork dimension. Formula: Frame Width = Artwork Width + (Mat Border × 2); Frame Height = Artwork Height + (Mat Border × 2). Example: 11×14 artwork with 3-inch mat borders = 17×20 frame (11+3+3 by 14+3+3). Always add border width to BOTH sides of each dimension."
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-8" data-testid="breadcrumb-measurement">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" data-testid="link-breadcrumb-home">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/resources" data-testid="link-breadcrumb-resources">Resources</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>How to Measure Artwork for Framing</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Hero Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Ruler className="w-10 h-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold" data-testid="heading-main">
              How to Measure Artwork for Custom Framing
            </h1>
          </div>
          <p className="text-xl text-muted-foreground leading-relaxed" data-testid="text-hero-description">
            Complete step-by-step guide to accurately measuring artwork and calculating custom frame dimensions. 
            Learn professional measurement techniques to ensure perfect fits for prints, canvas, textiles, and irregular artwork.
          </p>
        </div>

        {/* Main Content */}
        <article className="prose prose-slate dark:prose-invert max-w-none">
          <h2 data-testid="heading-intro">Why Precise Measurements Matter</h2>
          
          <p>
            Frame dimensions directly impact artwork presentation quality, with even minor measurement discrepancies causing visible gaps, artwork buckling, or improper mounting. Professional framers measure artwork precisely, to the nearest 1/8 inch, before ordering custom frames, understanding that seemingly small errors compound when calculating total frame dimensions including mats and mounting space. A 1/4 inch measurement error multiplied across all four border additions creates noticeable gaps or excessive tightness that compromises professional appearance.
          </p>

          <p>
            Custom framing requires understanding the relationship between artwork dimensions, mat border widths, and total frame size. Unlike ready-made frames that accommodate only standard print sizes, custom frames demand accurate measurements and dimensional calculations to guarantee exact fits. This guide walks through professional measurement techniques step-by-step, from initial artwork measurement through final frame dimension calculations, ensuring precise results regardless of artwork type or size.
          </p>

          <h2 data-testid="heading-step-1">Step 1: Gather Proper Measuring Tools</h2>

          <p>
            Accurate artwork measurement begins with appropriate tools. Metal rulers provide superior accuracy compared to cloth or plastic measuring tapes that can stretch or warp. A 24 to 36 inch metal ruler or carpenter's square enables measurement of most artwork sizes with consistent precision. Digital calipers offer extreme accuracy for miniature pieces but are unnecessary for standard framing applications where 1/8 inch tolerance suffices.
          </p>

          <p>
            Avoid using flexible measuring tapes from sewing kits or fabric stores, these tools introduce measurement variations through stretching and inconsistent tension. Wooden rulers can warp over time, introducing errors. Metal measuring tapes designed for carpentry work acceptably but rulers provide better precision for artwork under 36 inches. For large artwork exceeding ruler length, use a carpenter's measuring tape with clear 1/8 inch gradations, ensuring the tape remains taut and straight during measurement.
          </p>

          <h2 data-testid="heading-step-2">Step 2: Measure Artwork Dimensions</h2>

          <p>
            Measure artwork at its widest points, recording width (horizontal measurement) and height (vertical measurement) to the nearest 1/8 inch. Place the ruler or measuring tape parallel to edges, measuring from one extreme edge to the opposite edge. For prints on paper, determine whether you want to show white borders or hide them under the mat, this decision affects which dimensions to measure.
          </p>

          <p>
            <strong>For Prints on Paper:</strong> Measure only the visible image area if you intend to hide paper borders under the mat. Place the ruler at the edge of the printed image itself, not the paper edge. Many fine art prints include 1 to 2 inch white borders that should be concealed for professional presentation. If you prefer showing some white border (common with limited edition prints featuring artist signatures), include the desired border width in your artwork measurement.
          </p>

          <p>
            <strong>For Stretched Canvas:</strong> Measure the exact outer dimensions of the canvas stretcher bars, including wrapped edges. Canvas artwork typically displays without mats, so frame dimensions must precisely match canvas dimensions with minimal clearance. Measure width across the front face, not the depth. Measure at multiple points since handmade stretchers sometimes vary slightly, use the largest measurement to ensure clearance.
          </p>

          <p>
            <strong>For Textiles and Fabrics:</strong> Measure the finished dimensions after any trimming or edge finishing. Textiles may require backing board mounting before framing, so factor in mounting technique when planning measurements. Loose fabrics should be secured to backing boards first, then measured for frame sizing. Consider whether fabric edges will be visible or hidden under mat borders when calculating dimensions.
          </p>

          <p>
            <strong>For Irregular or Three-Dimensional Objects:</strong> Measure the maximum width and height to determine minimum frame size requirements. Irregular objects may need shadowbox framing with additional depth clearance. Measure thickness separately to specify required frame depth. For objects with protruding elements, measure the furthest protrusion points in all directions to ensure adequate frame dimensions.
          </p>

          <h2 data-testid="heading-step-3">Step 3: Determine Mat Border Width</h2>

          <p>
            Mat border width significantly affects artwork presentation and total frame dimensions. Professional framing standards suggest using the rule of thirds as a starting guideline: mat borders should equal approximately one-third of the artwork's smallest dimension. This formula ensures proportional relationships that work universally across different artwork sizes while preventing common errors of using identical border widths for all projects.
          </p>

          <p>
            <strong>Small Artwork (under 11×14 inches):</strong> Use 2 to 2.5 inch mat borders. An 8×10 print would calculate to 2.67 inch minimum border (8 ÷ 3), typically rounded to 3 inches for convenience. However, many framers use 2.5 inches for 8×10 artwork to keep total frame size manageable while maintaining professional proportions. Very small artwork (5×7 or smaller) may benefit from slightly wider borders approaching one-half of the smallest dimension to provide adequate presence.
          </p>

          <p>
            <strong>Medium Artwork (11×14 to 18×24 inches):</strong> Use 2.5 to 3.5 inch mat borders. An 11×14 print calculates to 3.67 inch minimum (11 ÷ 3), typically implemented as 3.5 to 4 inches. A 16×20 print yields 5.33 inch minimum, usually rounded to 5 inches for practical frame sizing. These proportions provide substantial breathing room while maintaining manageable overall dimensions and material costs.
          </p>

          <p>
            <strong>Large Artwork (over 24×36 inches):</strong> Use 3.5 to 4 inch mat borders, or apply modified proportions. Strict rule of thirds on very large artwork creates impractically wide borders, a 30×40 print would require 10 inch borders, yielding a massive 50×60 frame. Professional framers typically use 4 to 6 inch borders on large work, balancing adequate spacing against practical frame size constraints. Some large pieces frame better without mats, using floater frames or canvas wrapping instead.
          </p>

          <p>
            <strong>Viewing Distance Considerations:</strong> Artwork viewed from greater distances (10+ feet) benefits from wider mat borders to maintain visual impact. Close-viewing artwork (3-5 feet) such as hallway displays works effectively with narrower borders. Consider where the framed piece will hang when selecting mat widths, living room focal points justify generous borders while bedroom or office pieces may use moderate proportions.
          </p>

          <h2 data-testid="heading-step-4">Step 4: Calculate Total Frame Dimensions</h2>

          <p>
            Calculate total frame dimensions by adding mat border width to all four sides of the artwork measurement. This represents the most common error in frame ordering, forgetting to add border width to BOTH sides of each dimension. The calculation requires adding the mat border width twice per dimension: once for the left/top border and once for the right/bottom border.
          </p>

          <p>
            <strong>Basic Calculation Formula:</strong><br/>
            Frame Width = Artwork Width + (Mat Border Width × 2)<br/>
            Frame Height = Artwork Height + (Mat Border Width × 2)
          </p>

          <p>
            <strong>Example 1: Standard Print with Equal Borders</strong><br/>
            Artwork: 16×20 inches<br/>
            Mat Border: 3 inches (all sides)<br/>
            Frame Width: 16 + (3 × 2) = 16 + 6 = 22 inches<br/>
            Frame Height: 20 + (3 × 2) = 20 + 6 = 26 inches<br/>
            <strong>Required Frame Size: 22×26 inches</strong>
          </p>

          <p>
            <strong>Example 2: Photograph with Weighted Bottom Border</strong><br/>
            Artwork: 11×14 inches<br/>
            Mat Borders: 3 inches (top and sides), 3.5 inches (bottom)<br/>
            Frame Width: 11 + (3 × 2) = 11 + 6 = 17 inches<br/>
            Frame Height: 14 + 3 (top) + 3.5 (bottom) = 20.5 inches<br/>
            <strong>Required Frame Size: 17×20.5 inches</strong>
          </p>

          <p>
            <strong>Example 3: Large Poster</strong><br/>
            Artwork: 24×36 inches<br/>
            Mat Border: 4 inches (all sides)<br/>
            Frame Width: 24 + (4 × 2) = 24 + 8 = 32 inches<br/>
            Frame Height: 36 + (4 × 2) = 36 + 8 = 44 inches<br/>
            <strong>Required Frame Size: 32×44 inches</strong>
          </p>

          <p>
            Always double-check calculations by working backward: subtract border widths from calculated frame dimensions to verify you return to original artwork measurements. This reverse calculation catches common arithmetic errors before ordering frames. For weighted bottom borders, track top and bottom measurements separately to avoid confusion.
          </p>

          <h2 data-testid="heading-step-5">Step 5: Account for Frame Rabbet Depth and Mounting</h2>

          <p>
            The frame rabbet (pronounced "rabbit") is the recessed ledge inside the frame that holds the glazing, mat, artwork, and backing. Proper frame dimensions account not just for visible mat borders but also for the rabbet overlap that secures the frame package. Standard picture frame rabbets measure 3/8 to 1/2 inch deep, accommodating glazing, mat board, artwork, and backing with slight clearance.
          </p>

          <p>
            Most custom framing calculations include rabbet overlap automatically, when you order a 16×20 frame, manufacturers design it to accommodate a 16×20 mat/glazing package with appropriate rabbet depth. However, shadowboxes and deep frames for three-dimensional objects require specifying both outer frame dimensions and required depth clearance. Measure object thickness separately and add 1/4 inch minimum clearance to prevent glazing contact.
          </p>

          <p>
            Mounting considerations may affect frame dimensions slightly. Hinge mounting requires backing board slightly smaller than frame opening to allow hinges to attach without interference. Dry mounting can accommodate backing boards cut to exact frame opening dimensions. Discuss mounting technique with framers when ordering custom sizes to ensure compatible dimensions. For most applications, standard frame sizing accommodates typical mounting requirements without adjustment.
          </p>

          <h2 data-testid="heading-common-mistakes">Common Measurement Mistakes to Avoid</h2>

          <p>
            <strong>Measuring the Paper Instead of the Image:</strong> Many prints include white borders that should be hidden under the mat. Measure the actual image area you want to display, not the full paper dimensions. This mistake results in frames that are 1 to 2 inches too large, leaving visible paper borders that undermine professional presentation.
          </p>

          <p>
            <strong>Forgetting to Add Border to Both Sides:</strong> The most common calculation error involves adding mat border width to only one side per dimension. Remember that borders surround the artwork on all four sides, width calculations need left border + artwork + right border; height calculations need top border + artwork + bottom border. Always multiply mat border width by 2 when calculating frame dimensions.
          </p>

          <p>
            <strong>Inconsistent Units:</strong> Mixing inches and centimeters creates catastrophic errors. Most U.S. custom framing uses inches with fractional measurements (1/8 inch increments). Ensure all measurements use consistent units throughout calculations. If working with metric measurements, convert to inches before ordering from U.S. frame manufacturers (1 inch = 2.54 cm).
          </p>

          <p>
            <strong>Insufficient Precision:</strong> Rounding measurements to the nearest half-inch introduces accumulated errors. Professional framing requires 1/8 inch precision. A 16.25×20.125 inch artwork should be recorded as such rather than rounded to 16×20, the quarter-inch difference multiplied across border calculations creates visible gaps or excessive tightness in the final frame assembly.
          </p>

          <p>
            <strong>Ignoring Artwork Orientation:</strong> Verify whether your artwork displays vertically (portrait) or horizontally (landscape) before finalizing dimensions. Frame dimensions are always stated width × height, regardless of orientation. An 18×24 frame accommodates 18 inch wide by 24 inch tall content, ensure this matches your intended artwork orientation to avoid ordering frames in incorrect dimensions.
          </p>

          <h2 data-testid="heading-digital-tools">Using Digital Measurement and Visualization Tools</h2>

          <p>
            Modern frame designers include digital measurement calculators that automatically compute frame dimensions from artwork size and mat border preferences. These tools eliminate manual arithmetic errors while providing real-time visualization of total framed dimensions. Input your artwork measurements, select desired mat border widths, and the calculator instantly displays required frame size with visual mockup showing proportional relationships.
          </p>

          <p>
            Digital tools help visualize different mat border widths before committing to final dimensions. Compare 2.5 inch borders against 3 inch or 3.5 inch options to see how each affects total frame size and proportional balance. Many designers display actual-size previews on desktop monitors, allowing you to position physical artwork against the screen to judge border widths visually before ordering.
          </p>

          <p>
            Some advanced calculators include downloadable PDF templates at actual size. Print these templates, cut out the frame opening, and test mat border widths physically by laying your artwork within the cutout. This hands-on approach eliminates guesswork for valuable or irreplaceable artwork where measurement precision matters critically. Physical templates reveal whether chosen borders create the desired visual impact before manufacturing begins.
          </p>

          <h2>Professional Tips for Difficult Measurements</h2>

          <p>
            <strong>Warped or Buckled Artwork:</strong> Flatten artwork as much as possible before measuring, using weights or pressing under glass overnight. Measure the flattened dimensions since framing will compress artwork to flat mounting. Severely warped pieces may require restoration or specialized mounting techniques before framing, consult professional framers for valuable items with significant distortion.
          </p>

          <p>
            <strong>Torn or Irregular Edges:</strong> Measure to the furthest extent of tears or irregular edges in each direction, ensuring frame dimensions accommodate the maximum artwork envelope. Irregular edges typically hide under mat borders, so add standard border widths to the maximum measured dimensions. Ragged edges require adequate overlap to remain securely hidden without gaps.
          </p>

          <p>
            <strong>Artwork on Multiple Sheets:</strong> For diptychs, triptychs, or multi-panel artwork, measure each panel individually and calculate spacing between panels before determining overall frame dimensions. Add inter-panel spacing (typically 1/4 to 1/2 inch) to the sum of panel widths. Account for border additions around the entire composition, not individual panels, to create cohesive presentation.
          </p>

          <p>
            <strong>Delicate or Fragile Materials:</strong> Avoid placing metal rulers directly on delicate surfaces that might scratch or indent. Use clear acrylic rulers or measure from reverse side when possible. For extremely fragile items, consult professional framers who can measure without handling the artwork extensively, conservation framers have specialized tools and techniques for valuable or delicate pieces.
          </p>
        </article>

        {/* CTA Section */}
        <Card className="my-12 bg-primary/5 border-primary/20" data-testid="card-cta">
          <CardHeader>
            <CardTitle className="text-2xl">Design Your Custom Frame Now</CardTitle>
            <CardDescription className="text-base">
              Use our interactive frame designer with built-in measurement calculator to visualize your custom frame
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild size="lg" data-testid="button-start-designer">
              <Link href="/picture-frames">
                Start Frame Designer <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Related Resources */}
        <div className="mt-12 border-t pt-12">
          <h2 className="text-2xl font-bold mb-6">Related Resources</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/resources/border-width-proportions">
              <Card className="hover-elevate active-elevate-2 h-full" data-testid="card-related-borders">
                <CardHeader>
                  <CardTitle>Mat Border Width & Proportions</CardTitle>
                  <CardDescription>
                    Professional formulas for calculating perfect mat border widths using the rule of thirds
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
            <Link href="/frames/sizes">
              <Card className="hover-elevate active-elevate-2 h-full" data-testid="card-related-sizes">
                <CardHeader>
                  <CardTitle>Browse All Frame Sizes</CardTitle>
                  <CardDescription>
                    Explore our complete catalog of 100+ standard and custom frame dimensions
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
