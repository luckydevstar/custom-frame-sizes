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


import { AlertTriangle, ArrowRight } from 'lucide-react';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';

export default function CommonMatCuttingMistakes() {
  useScrollToTop();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is the most common mat cutting mistake?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The most common mat cutting mistake is insufficient overlap between mat opening and artwork, caused by cutting the opening too large. Professional mat cutting requires minimum 1/4 inch overlap on all sides to conceal artwork edges and prevent the artwork from falling through the opening. Many beginners make the opening exactly the same size as the artwork or only slightly smaller, resulting in visible gaps, artwork shifting, or the piece falling through during handling. Always subtract at least 1/2 inch from both width and height measurements (1/4 inch per side) when calculating mat opening dimensions."
        }
      },
      {
        "@type": "Question",
        "name": "How do you avoid reversed measurement calculations?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Avoid reversed measurements by following the correct calculation sequence: measure artwork first, subtract overlap allowance (typically 1/2 inch total for both dimensions), then mark the opening on the mat board. Common reversal errors include: adding overlap instead of subtracting it, confusing artwork size with opening size, or miscalculating which dimension is width versus height. Use the formula: Opening Width = Artwork Width - 0.5 inches; Opening Height = Artwork Height - 0.5 inches. Write down all measurements clearly before cutting, and always double-check calculations against the actual artwork using a ruler."
        }
      },
      {
        "@type": "Question",
        "name": "What spacing is required between openings in multi-opening mats?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Multi-opening mats require minimum 3/4 inch spacing between adjacent openings to maintain structural integrity. Mat board with less than 3/4 inch spacing becomes weak and prone to warping, bending, or tearing between openings. Professional framers typically use 1 to 2 inches of spacing for standard layouts, with larger spacing (2-3 inches) for formal presentations. Consistent spacing throughout the layout prevents visual irregularities and ensures sufficient mat board material between openings. Spacing under 3/4 inch compromises both aesthetics and structural stability."
        }
      },
      {
        "@type": "Question",
        "name": "Why does mat board grain direction matter?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Mat board grain direction affects cutting precision and long-term stability. Mat board has grain running in one direction, similar to wood. Cutting against the grain produces rougher edges and more ragged bevels than cutting with the grain. Additionally, mat boards are more prone to warping perpendicular to grain direction. Professional framers orient mat board so grain runs vertically in the final presentation, minimizing warping potential. Before cutting, test grain direction by gently flexing the mat board, it flexes more easily parallel to grain. Orient the mat so grain runs parallel to the longest dimension for optimal results."
        }
      },
      {
        "@type": "Question",
        "name": "What is the correct bevel angle for mat cutting?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The standard professional bevel angle for mat cutting is 45 degrees, measured from the mat board face. This angle creates clean, crisp edges that catch light attractively while maintaining adequate overlap for artwork support. Bevel angles that are too steep (over 50 degrees) create narrow, weak edges prone to crushing. Angles that are too shallow (under 40 degrees) create wide bevels that appear crude and reduce effective overlap. Maintain consistent 45-degree angles throughout all cuts using properly adjusted mat cutters and sharp blades. Replace blades frequently as dull blades cannot maintain precise angles."
        }
      },
      {
        "@type": "Question",
        "name": "How do you prevent border proportion mistakes?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Prevent border proportion mistakes by following the rule of thirds: mat borders should equal at least one-third of the artwork's smallest dimension. For example, an 8x10 inch print requires minimum 2.67-inch borders (one-third of 8 inches). Many framers use 3-4 inch borders for standard presentations. Avoid borders that are too narrow (under 2 inches for most artwork) which create cramped, budget appearances. Ensure border consistency, if top and side borders are 3 inches, the bottom border should be 3 inches (or slightly larger for weighted bottoms, typically 1/2 to 1 inch more). Measure and mark all borders before cutting to verify proportional balance."
        }
      },
      {
        "@type": "Question",
        "name": "Why are opening sizes inconsistent in multi-opening mats?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Opening size inconsistencies in multi-opening mats result from measurement errors, calculation mistakes, or accumulated cutting imprecision. Each opening requires independent measurement and calculation, errors compound across multiple openings. Common causes include: not accounting for artwork size variations, measuring from previous cut edges instead of reference marks, blade drift during cutting, and insufficient quality control between openings. Prevent inconsistencies by: measuring each opening independently, marking all openings before cutting any, using rigid straightedge guides, replacing blades regularly, and checking each opening against its intended artwork before proceeding to the next cut."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need to account for print size tolerances?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, always account for print size tolerances when cutting mats. Commercial prints, especially digital prints and photographs, vary slightly from nominal dimensions due to printing and trimming tolerances. An '8x10 inch' print might actually measure 7.875 x 9.875 inches or 8.125 x 10.125 inches. Always measure the actual artwork with a ruler before calculating mat openings, never assume nominal dimensions are accurate. Add standard 1/4 inch overlap per side, measuring from the actual artwork dimensions. For professional work, measure multiple prints from the same batch as sizes may vary within a production run. Undersized openings prevent artwork insertion; oversized openings create visible gaps."
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
        <Breadcrumb className="mb-8" data-testid="breadcrumb-mistakes">
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
              <BreadcrumbPage>Common Mat Cutting Mistakes</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Hero Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-10 h-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold" data-testid="heading-main">
              Common Mat Cutting Mistakes
            </h1>
          </div>
          <p className="text-xl text-muted-foreground leading-relaxed" data-testid="text-hero-description">
            Professional guide to avoiding costly mat cutting errors. Learn proper overlap calculations, spacing requirements, 
            grain direction, bevel angles, and quality control techniques for perfect results every time.
          </p>
        </div>

        {/* Main Content */}
        <article className="prose prose-slate dark:prose-invert max-w-none">
          <h2 data-testid="heading-insufficient-overlap">Insufficient Overlap Errors</h2>
          
          <p>
            The most prevalent and costly mat cutting mistake involves insufficient overlap between the mat opening and 
            artwork edges. Professional mat cutting requires minimum 1/4 inch overlap on all four sides to properly 
            conceal artwork edges and secure the piece within the opening. This means the mat opening should measure at 
            least 1/2 inch smaller than the artwork in both width and height, 1/4 inch per side times two sides equals 
            1/2 inch total reduction per dimension.
          </p>

          <p>
            Many beginners incorrectly cut the opening exactly the same size as the artwork, or only slightly smaller, 
            resulting in multiple problems. Insufficient overlap creates visible gaps where the mat doesn't fully cover 
            artwork edges, revealing rough cuts, uneven borders, or mounting materials. The artwork may shift within 
            the opening during handling or shipping, creating an unprofessional, loose appearance. In extreme cases with 
            openings cut too large, the artwork falls completely through the opening, requiring mat replacement.
          </p>

          <p>
            Correct overlap calculation follows this formula: For an 8x10 inch print, subtract 1/2 inch from width 
            (8 - 0.5 = 7.5) and 1/2 inch from height (10 - 0.5 = 9.5), yielding a 7.5 x 9.5 inch opening. This provides 
            1/4 inch concealment on all edges. Some framers prefer 3/8 inch overlap per side (3/4 inch total reduction) 
            for additional security, particularly with valuable artwork or thin paper stock. Test the opening size against 
            actual artwork before cutting, if in doubt, cut slightly smaller as openings can be carefully enlarged but never 
            reduced.
          </p>

          <h2 data-testid="heading-reversed-measurements">Reversed Measurement Calculations</h2>

          <p>
            Reversed measurement calculations represent a frustratingly common error where framers add overlap instead of 
            subtracting it, or confuse artwork dimensions with opening dimensions. The mental error typically occurs when 
            rushing through calculations or working from memory rather than written measurements. An 8x10 inch artwork 
            mistakenly receives an 8.5 x 10.5 inch opening (adding 1/2 inch instead of subtracting), creating a catastrophic 
            opening far too large for the artwork.
          </p>

          <p>
            Prevent reversal errors by following systematic calculation procedures. First, physically measure the artwork 
            with a ruler, never assume nominal dimensions are accurate. Record the actual measurements clearly: "Artwork: 
            8 inches wide x 10 inches high." Next, explicitly write the overlap calculation: "Opening = Artwork - Overlap. 
            Width: 8 - 0.5 = 7.5. Height: 10 - 0.5 = 9.5." Finally, verify the opening dimensions against the artwork using 
            a ruler before cutting. This three-step process eliminates mental calculation errors.
          </p>

          <p>
            Another common reversal mistake involves confusing which dimension represents width versus height, particularly 
            with horizontal versus vertical artwork orientations. Always establish a consistent reference system: width is 
            the horizontal measurement (left to right), height is the vertical measurement (top to bottom). Write dimensions 
            as "W x H" consistently to prevent transposition. Double-check orientation by physically comparing the artwork 
            to the marked mat board before cutting.
          </p>

          <h2 data-testid="heading-improper-spacing">Improper Multi-Opening Spacing</h2>

          <p>
            Multi-opening mats require adequate spacing between adjacent openings to maintain structural integrity and 
            visual appeal. The professional minimum spacing measures 3/4 inch between any two openings, less than this 
            creates weak points where mat board may bend, warp, or tear. Many beginners attempt to maximize image sizes 
            by minimizing spacing, not realizing they're compromising mat board strength and creating future stability 
            problems.
          </p>

          <p>
            Mat board with insufficient spacing between openings exhibits several failure modes. The narrow bridges between 
            openings lack rigidity, causing the mat to bow or flex when handled. During installation, the thin sections may 
            crack or tear, particularly at corners where stress concentrates. Over time, humidity changes cause mat board 
            expansion and contraction, insufficient spacing amplifies these dimensional changes, leading to warping that 
            distorts the frame assembly and creates glazing contact.
          </p>

          <p>
            Professional framers typically use 1 to 2 inches spacing for standard multi-opening layouts, balancing structural 
            requirements with aesthetic considerations. Larger formal presentations may use 2 to 3 inches, creating elegant 
            visual separation between images. The spacing should remain consistent throughout the layout unless asymmetrical 
            design intentionally varies distances. Calculate total mat dimensions accounting for all opening sizes, spacing 
            requirements, and border widths before cutting, cramming too many openings into insufficient mat board guarantees 
            spacing problems.
          </p>

          <h2 data-testid="heading-grain-direction">Grain Direction Mistakes</h2>

          <p>
            Mat board possesses inherent grain direction resulting from manufacturing processes where paper fibers align 
            predominantly in one direction, similar to wood grain. Cutting against the grain produces rougher bevel edges, 
            more ragged corners, and increased blade resistance compared to cutting with the grain. Additionally, mat boards 
            are more susceptible to warping perpendicular to grain direction, a mat with grain running horizontally tends to 
            warp vertically and vice versa.
          </p>

          <p>
            Professional framers test grain direction before cutting by gently flexing mat board samples. The board flexes 
            more easily when bent parallel to grain direction and resists flexing when bent perpendicular to grain. Once 
            grain direction is identified, orient the mat board so grain runs vertically in the final presentation, this 
            minimizes warping potential since most humidity-related expansion occurs horizontally across typical room 
            conditions.
          </p>

          <p>
            Grain direction particularly affects multi-opening layouts where multiple cuts occur in various directions. 
            Establish mat orientation before marking any openings, ensuring grain runs vertically. Accept that some cuts 
            will necessarily run against the grain in complex layouts, but the overall grain orientation prevents major 
            warping. Use extra care and sharp blades when cutting against grain to maintain clean bevels. Some professional 
            mat cutters mark grain direction arrows on the back of each mat board sheet during inventory to eliminate 
            confusion during layout.
          </p>

          <h2 data-testid="heading-bevel-angles">Incorrect Bevel Angles</h2>

          <p>
            The standard professional bevel angle for mat cutting measures exactly 45 degrees from the mat board face to 
            the opening edge. This angle creates visually appealing bevels that catch light attractively, provide adequate 
            overlap surface for artwork support, and maintain sufficient edge strength to resist crushing and damage. 
            Deviations from 45 degrees, whether too steep or too shallow, create noticeable quality issues that mark amateur 
            work.
          </p>

          <p>
            Bevel angles that are too steep (over 50 degrees) create narrow, knife-like edges that appear sharp but lack 
            structural strength. These steep bevels crush easily during handling, show damage readily, and provide minimal 
            overlap surface for supporting artwork. The narrow bevel also catches less light, reducing the dimensional effect 
            that makes beveled mats visually superior to straight cuts. Conversely, angles that are too shallow (under 40 
            degrees) create wide, crude-looking bevels that consume excessive overlap and appear unprofessional.
          </p>

          <p>
            Maintain consistent 45-degree angles by properly adjusting mat cutting equipment according to manufacturer 
            specifications and verifying angle accuracy with test cuts. Blade sharpness dramatically affects bevel quality, 
            dull blades cannot maintain precise angles and tear mat board fibers rather than cutting cleanly. Replace blades 
            every 20-30 linear feet of cutting, or sooner if bevels show roughness or tearing. Practice consistent pressure 
            and cutting speed, as variations create bevel irregularities even with correct angle settings.
          </p>

          <h2 data-testid="heading-color-errors">Color Selection Errors</h2>

          <p>
            Mat color selection mistakes often go unrecognized until the completed frame hangs on the wall, revealing 
            mismatches that detract from artwork presentation. The most common error involves choosing mat colors under 
            inappropriate lighting, store fluorescent or LED lighting creates different color appearance than home 
            incandescent, halogen, or natural lighting. A mat that looks perfect in the frame shop may appear wrong under 
            home lighting conditions.
          </p>

          <p>
            Oversaturated mat colors compete with artwork instead of enhancing it, creating visual conflict where viewers 
            notice the mat before the art. Vivid, pure hues work occasionally with bold contemporary pieces but overwhelm 
            most artwork. Professional framers favor muted, sophisticated tones that coordinate with artwork without demanding 
            attention. Undertone mismatches create another subtle error, cool-toned mats with warm-toned artwork (or vice versa) 
            appear grayish and lifeless despite otherwise appropriate color selection.
          </p>

          <p>
            Prevent color errors by testing mat samples against actual artwork under display lighting before cutting. Take 
            samples home and view them in morning natural light, afternoon sun, and evening artificial light, colors shift 
            dramatically between conditions. Place samples around artwork edges and step back 6-10 feet to viewing distance 
            rather than inspecting close-up. When uncertain between multiple options, choose the more neutral, less saturated 
            color, neutrals never compete inappropriately with artwork.
          </p>

          <h2 data-testid="heading-border-proportions">Border Proportion Mistakes</h2>

          <p>
            Border proportion errors include borders that are too narrow (creating cramped, budget appearances), too wide 
            (overwhelming the artwork), or inconsistent (destroying visual balance). The professional rule of thirds provides 
            reliable guidance: mat borders should equal at least one-third of the artwork's smallest dimension. For an 8x10 
            inch print, one-third of 8 inches equals approximately 2.67 inches, most framers round up to 3 inches as the minimum 
            professional border width.
          </p>

          <p>
            Borders under 2 inches appear cramped and cheap except for very small artwork (under 5x7 inches) where proportional 
            scaling requires narrower borders. The thin borders provide insufficient visual breathing room, making artwork feel 
            trapped and reducing perceived value. At the opposite extreme, excessively wide borders (over 6 inches for standard 
            artwork) make images appear lost in the mat, creating disproportionate framing that emphasizes mat over art.
          </p>

          <p>
            Border consistency proves equally critical, if top and side borders measure 3 inches, the bottom border must measure 
            3 inches (or slightly more for weighted bottoms, typically adding 1/2 to 1 inch). Inconsistent borders create visual 
            imbalance that appears accidental rather than intentional. Measure and mark all four borders before cutting, 
            verifying measurements sum correctly to overall mat dimensions. The formula "Mat Width = Artwork Width + Left Border 
            + Right Border + 1 inch (for overlap)" must balance precisely, as should the height calculation.
          </p>

          <h2 data-testid="heading-size-inconsistencies">Opening Size Inconsistencies in Multi-Opening Mats</h2>

          <p>
            Multi-opening mats amplify measurement errors because each opening requires independent calculation and cutting, 
            mistakes compound across multiple openings, creating visually obvious inconsistencies. An opening cut 1/8 inch too 
            small may go unnoticed in single-opening mats but becomes glaringly apparent in multi-opening layouts where viewers 
            compare multiple openings simultaneously. Professional quality demands precise consistency across all openings in a 
            layout.
          </p>

          <p>
            Common causes of inconsistencies include measuring from previous cut edges instead of established reference marks, 
            blade drift during long cuts, accumulated measurement errors from using flexible tape measures, and insufficient 
            quality control between openings. Each opening should be measured and marked independently from reference lines 
            rather than measuring from adjacent openings. Use rigid straightedge rules rather than flexible tapes for accurate 
            measurement. Replace blades before starting multi-opening projects to ensure consistent cutting quality.
          </p>

          <p>
            Implement systematic quality control by measuring each opening against its intended artwork immediately after cutting, 
            before proceeding to the next opening. This catch-as-you-go approach identifies errors while correction remains 
            possible, discovering inconsistencies after cutting all openings may require complete mat replacement. For complex 
            layouts with many openings, create a cutting sequence that allows verification of each opening before committing to 
            subsequent cuts that would prevent correction.
          </p>

          <h2 data-testid="heading-print-tolerances">Not Accounting for Print Size Tolerances</h2>

          <p>
            Commercial prints, photographs, and digital reproductions vary slightly from nominal dimensions due to printing and 
            trimming tolerances. An "8x10 inch" print might actually measure 7.875 x 9.875 inches, 8.125 x 10.125 inches, or 
            anywhere within typical manufacturing tolerances of ±1/8 inch. Framers who assume nominal dimensions are accurate 
            without measuring actual artwork create openings that either don't fit (too small) or create visible gaps (too large).
          </p>

          <p>
            Digital printing particularly exhibits size variation because automated trimming systems maintain acceptable 
            tolerances (typically ±1/8 inch) rather than exact dimensions. Professional photo labs may deliver prints 
            varying slightly from nominal sizes depending on paper stock, cutting equipment calibration, and production batch. 
            Even traditional darkroom prints show dimensional variation from exposure borders, cropping, and wet processing 
            shrinkage.
          </p>

          <p>
            Always measure actual artwork with a precision ruler before calculating mat openings, never assume nominal dimensions. 
            For commercial framing operations handling multiple prints from a single batch, measure several samples as sizes may 
            vary within the production run. Calculate mat openings from measured dimensions, applying standard overlap allowances 
            to the actual artwork size. When framing irreplaceable items, create the mat opening slightly smaller than calculated, 
            then test-fit the artwork and carefully enlarge the opening if needed, this conservative approach prevents unrepairable 
            oversized openings.
          </p>

          <h2 data-testid="heading-catch-errors">How to Catch Errors Before Cutting</h2>

          <p>
            Implementing systematic pre-cutting verification prevents most mat cutting mistakes, saving time, materials, and 
            frustration. The professional workflow begins with physical measurement of actual artwork using precision rulers, 
            never trust nominal dimensions or measurements from previous projects. Record measurements clearly, writing "Artwork: 
            W x H" to prevent dimension confusion. Measure twice, particularly for valuable artwork or expensive mat board.
          </p>

          <p>
            Calculate mat opening dimensions explicitly on paper, writing out the formula: "Opening Width = Artwork Width - 
            Overlap Allowance" and "Opening Height = Artwork Height - Overlap Allowance." Verify calculations by adding them 
            back: "Calculated Opening + Overlap Allowance = Original Artwork Size." This reverse-check catches arithmetic errors 
            before cutting. For multi-opening layouts, verify that all openings, spacing, and borders sum correctly to overall 
            mat dimensions.
          </p>

          <p>
            Mark the mat board completely before making any cuts, draw all borders, all openings, and all reference lines. Step 
            back and visually verify the layout appears balanced and proportional. Use a rigid straightedge to verify all 
            measurements on the marked mat board, checking border widths, opening sizes, and spacing. Place the actual artwork 
            over each marked opening to confirm adequate overlap on all sides. Only after complete verification should cutting 
            begin. This disciplined approach eliminates most errors before they become permanent.
          </p>

          <h2 data-testid="heading-quality-checklist">Professional Quality Control Checklist</h2>

          <p>
            Professional mat cutters follow systematic quality control procedures to ensure consistent results. Before cutting, 
            verify: actual artwork measurements recorded accurately; opening calculations correct and written down; overlap 
            allowance adequate (minimum 1/4 inch per side); border proportions follow rule of thirds; multi-opening spacing 
            meets minimum 3/4 inch; mat grain direction runs vertically; and all measurements marked clearly on mat board.
          </p>

          <p>
            During cutting, monitor: blade sharpness (replace if bevels appear rough); bevel angle consistency at 45 degrees; 
            straightedge positioning and stability; cutting pressure and speed uniformity; and corner intersections that meet 
            precisely. After cutting each opening in multi-opening layouts, immediately test-fit the intended artwork to verify 
            adequate overlap and proper sizing before proceeding to subsequent openings.
          </p>

          <p>
            After completing all cuts, perform final inspection: examine bevels for clean, consistent edges without tears or 
            roughness; verify corners meet precisely without overcuts or gaps; check that all openings accommodate their artwork 
            with proper overlap; confirm spacing consistency between openings; and ensure border widths match specifications. 
            Place artwork in each opening and view from normal display distance (6-10 feet) to verify professional appearance. 
            This comprehensive checklist prevents the majority of mat cutting mistakes while building skills for consistently 
            excellent results.
          </p>

          <h2 data-testid="heading-faq">Questions we hear most</h2>

          <div className="space-y-6 my-8">
            <div>
              <h3 className="text-xl font-semibold mb-2" data-testid="faq-question-1">What is the most common mat cutting mistake?</h3>
              <p>
                The most common mat cutting mistake is insufficient overlap between mat opening and artwork, caused by cutting 
                the opening too large. Professional mat cutting requires minimum 1/4 inch overlap on all sides to conceal artwork 
                edges and prevent the artwork from falling through the opening. Always subtract at least 1/2 inch from both width 
                and height measurements when calculating mat opening dimensions.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2" data-testid="faq-question-2">How do you avoid reversed measurement calculations?</h3>
              <p>
                Avoid reversed measurements by following the correct calculation sequence: measure artwork first, subtract overlap 
                allowance (typically 1/2 inch total), then mark the opening on the mat board. Use the formula: Opening Width = 
                Artwork Width - 0.5 inches; Opening Height = Artwork Height - 0.5 inches. Write down all measurements clearly 
                before cutting and always double-check calculations.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2" data-testid="faq-question-3">What spacing is required between openings in multi-opening mats?</h3>
              <p>
                Multi-opening mats require minimum 3/4 inch spacing between adjacent openings to maintain structural integrity. 
                Professional framers typically use 1 to 2 inches of spacing for standard layouts, with larger spacing (2-3 inches) 
                for formal presentations. Spacing under 3/4 inch compromises both aesthetics and structural stability.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2" data-testid="faq-question-4">Why does mat board grain direction matter?</h3>
              <p>
                Mat board grain direction affects cutting precision and long-term stability. Cutting with the grain produces 
                cleaner edges than cutting against it. Mat boards are also more prone to warping perpendicular to grain direction. 
                Professional framers orient mat board so grain runs vertically in the final presentation, minimizing warping 
                potential.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2" data-testid="faq-question-5">What is the correct bevel angle for mat cutting?</h3>
              <p>
                The standard professional bevel angle for mat cutting is 45 degrees, measured from the mat board face. This angle 
                creates clean, crisp edges that catch light attractively while maintaining adequate overlap for artwork support. 
                Maintain consistent 45-degree angles using properly adjusted mat cutters and sharp blades.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2" data-testid="faq-question-6">How do you prevent border proportion mistakes?</h3>
              <p>
                Prevent border proportion mistakes by following the rule of thirds: mat borders should equal at least one-third 
                of the artwork's smallest dimension. For an 8x10 inch print, use minimum 2.67-inch borders (typically 3 inches). 
                Ensure border consistency, if top and side borders are 3 inches, the bottom border should be 3 inches or slightly 
                larger for weighted presentations.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2" data-testid="faq-question-7">Why are opening sizes inconsistent in multi-opening mats?</h3>
              <p>
                Opening size inconsistencies result from measurement errors, calculation mistakes, or accumulated cutting imprecision. 
                Prevent inconsistencies by measuring each opening independently, marking all openings before cutting any, using rigid 
                straightedge guides, replacing blades regularly, and checking each opening against its intended artwork before 
                proceeding to the next cut.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2" data-testid="faq-question-8">Do I need to account for print size tolerances?</h3>
              <p>
                Yes, always account for print size tolerances when cutting mats. Commercial prints vary slightly from nominal 
                dimensions due to printing and trimming tolerances. Always measure the actual artwork with a ruler before calculating 
                mat openings, never assume nominal dimensions are accurate. An "8x10 inch" print might actually measure 7.875 x 9.875 
                inches or 8.125 x 10.125 inches.
              </p>
            </div>
          </div>
        </article>

        {/* CTA Section */}
        <Card className="my-12 bg-primary/5 border-primary/20" data-testid="card-cta">
          <CardHeader>
            <CardTitle className="text-2xl">Design Your Custom Frame Now</CardTitle>
            <CardDescription className="text-base">
              Avoid mat cutting mistakes with our professional design tools. Get perfect measurements and expert guidance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/designer" data-testid="link-cta-mat-designer">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Mat Designer
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/designer" data-testid="link-cta-collage-designer">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Frame Designer
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Related Articles */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/resources/multi-opening-layout-engineering" data-testid="link-related-multi-opening">
              <Card className="hover-elevate h-full cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">Multi-Opening Layout Engineering</CardTitle>
                  <CardDescription>
                    Master grid layouts, hierarchical compositions, and visual weight distribution for collage frames.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/resources/mat-color-selection-guide" data-testid="link-related-color">
              <Card className="hover-elevate h-full cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">Mat Color Selection Guide</CardTitle>
                  <CardDescription>
                    Professional color theory for choosing mat colors that enhance artwork presentation.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/resources/professional-mounting-techniques" data-testid="link-related-mounting">
              <Card className="hover-elevate h-full cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">Professional Mounting Techniques</CardTitle>
                  <CardDescription>
                    Learn hinge mounting, photo corners, and reversible conservation methods for artwork preservation.
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
