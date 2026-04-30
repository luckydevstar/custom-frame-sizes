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

export default function BorderWidthProportions() {
  useScrollToTop();

  return (
    <>
      

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-8" data-testid="breadcrumb-borders">
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
              <BreadcrumbPage>Border Width & Proportions</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Hero Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Ruler className="w-10 h-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold" data-testid="heading-main">
              Mat Border Width & Proportions
            </h1>
          </div>
          <p className="text-xl text-muted-foreground leading-relaxed" data-testid="text-hero-description">
            Professional guide to calculating perfect mat border widths using the rule of thirds, weighted bottom borders, 
            and proportional scaling formulas. Includes specific border width recommendations for common artwork sizes.
          </p>
        </div>

        {/* Main Content */}
        <article className="prose prose-slate dark:prose-invert max-w-none">
          <h2 data-testid="heading-border-width-importance">Introduction to Border Width Importance</h2>
          
          <p>
            Mat border width fundamentally affects artwork presentation, perceived value, and visual impact. Properly proportioned 
            borders create professional appearance, establish visual hierarchy, provide breathing room that enhances artwork 
            rather than overwhelming it, and communicate quality through appropriate spacing. Conversely, borders that are too 
            narrow create cramped, budget appearance while excessively wide borders make artwork appear lost and insignificant.
          </p>

          <p>
            Professional framers understand that border width calculations follow mathematical relationships between artwork 
            dimensions and surrounding space rather than arbitrary aesthetic preferences. These relationships, refined over 
            centuries of framing tradition and validated by visual perception studies, ensure consistent professional results 
            across diverse artwork sizes and styles. The primary formula, the rule of thirds, provides reliable foundation for 
            border width decisions in most applications.
          </p>

          <p>
            Border width affects multiple aspects of presentation: visual weight distribution (balanced borders create stable 
            compositions); perceived artwork size (appropriate borders make small artwork appear more substantial); frame cost 
            (border width directly determines frame dimensions and material requirements); and glazing protection (adequate borders 
            maintain spacing between artwork and glass). Understanding professional proportion formulas enables framers to make 
            informed decisions that enhance rather than detract from artwork presentation.
          </p>

          <h2 data-testid="heading-rule-of-thirds">Rule of Thirds Formula</h2>

          <p>
            The rule of thirds represents the fundamental professional standard for calculating minimum mat border width: borders 
            should equal at least one-third of the artwork's smallest dimension. This formula ensures proportional relationships 
            that work universally across different artwork sizes while preventing the common error of using identical border widths 
            for all projects regardless of artwork dimensions. The calculation process follows simple arithmetic accessible to 
            anyone planning picture framing.
          </p>

          <p>
            To apply the rule of thirds, first identify the artwork's smallest dimension. For an 8x10 inch print, the smallest 
            dimension measures 8 inches (width). Divide this by 3: 8 ÷ 3 = 2.67 inches. This calculation establishes the minimum 
            professional border width, in practice, most framers round up to 3 inches for convenience and slightly more generous 
            proportions. The formula works identically for any artwork size: 11x14 inch artwork has 11 inches as smallest dimension, 
            yielding 3.67 inch minimum border (typically rounded to 3.5 or 4 inches).
          </p>

          <p>
            The rule of thirds provides reliable guidance because it scales proportionally with artwork size. Small artwork (5x7 
            inches) receives minimum 1.67 inch borders (typically 2 inches), appropriate for the reduced scale. Large artwork 
            (24x36 inches) receives minimum 8 inch borders, creating substantial breathing room that prevents the large image 
            from overwhelming viewers. This proportional scaling ensures consistent professional appearance regardless of artwork 
            dimensions, unlike fixed-width approaches that appear cramped on large work or excessive on small pieces.
          </p>

          <h2 data-testid="heading-standard-formulas">Standard Border Formulas and Calculations</h2>

          <p>
            Beyond the basic rule of thirds minimum, professional framers use several standard formulas for different applications 
            and aesthetic preferences. The equal-border formula applies identical width to all four sides, creating symmetrical, 
            formal presentation. For 8x10 inch artwork with 3 inch borders, the frame dimensions calculate as: Width = 8 + 3 + 3 = 
            14 inches; Height = 10 + 3 + 3 = 16 inches, yielding a 14x16 inch frame.
          </p>

          <p>
            The weighted-bottom formula adds extra width to the bottom border, typically 1/2 to 1 inch more than top and side 
            borders. This traditional approach creates visual stability and compensates for optical illusions where equal borders 
            appear bottom-heavy. For 8x10 inch artwork with 3 inch top/sides and 3.5 inch bottom border: Width = 8 + 3 + 3 = 14 
            inches; Height = 10 + 3 + 3.5 = 16.5 inches. The modest bottom increase provides subtle visual balance without obvious 
            asymmetry.
          </p>

          <p>
            The proportional-increase formula multiplies the rule of thirds minimum by 1.25 to 1.5 for more generous, gallery-style 
            presentation. Starting with 8x10 inch artwork where rule of thirds suggests 2.67 inch minimum, multiply by 1.33 to 
            yield approximately 3.5 inches, or by 1.5 for 4 inch borders. This approach suits formal presentations, expensive 
            artwork, or situations requiring substantial visual impact. The increased borders add perceived value while maintaining 
            proportional relationships to artwork dimensions.
          </p>

          <h2 data-testid="heading-weighted-bottom">Weighted Bottom Borders Explained</h2>

          <p>
            Weighted bottom borders, making the bottom border slightly wider than top and side borders, represent traditional 
            framing practice based on visual perception principles. The human visual system processes compositions from top to 
            bottom, with bottom-weighted designs feeling more stable and grounded than perfectly symmetrical layouts. Additionally, 
            optical illusions make perfectly equal borders appear bottom-heavy due to how eyes perceive vertical versus horizontal 
            space, particularly in horizontal (landscape) artwork orientations.
          </p>

          <p>
            The standard weighted bottom increase ranges from 1/2 to 1 inch additional width beyond top and side borders. Conservative 
            weighting adds 1/2 inch (3 inch top/sides, 3.5 inch bottom), creating subtle stability without obvious asymmetry, most 
            viewers won't consciously notice the difference but will perceive better balance. Moderate weighting adds 3/4 inch (3 
            inch top/sides, 3.75 inch bottom), providing clear visual grounding for formal presentations. Traditional weighting 
            adds a full 1 inch (3 inch top/sides, 4 inch bottom), creating intentional asymmetry that's visibly apparent and 
            particularly suited to classical artwork and ornate frames.
          </p>

          <p>
            Weighted bottoms work particularly well with horizontal artwork where additional bottom border counterbalances the 
            wide format's inherent horizontal emphasis. Vertical (portrait) artwork benefits less from weighted bottoms since 
            the tall format already creates visual weight distribution. Some framers skip weighted bottoms entirely on vertical 
            work or use minimal 1/4 to 1/2 inch increases. Contemporary framing often favors equal borders for clean, modern 
            appearance, while traditional and classical framing embraces weighted bottoms as established convention.
          </p>

          <h2 data-testid="heading-proportional-scaling">Proportional Scaling for Different Artwork Sizes</h2>

          <p>
            Proportional scaling ensures border widths scale appropriately with artwork dimensions, preventing the common error 
            of applying identical border widths to all projects. The rule of thirds naturally creates proportional scaling, but 
            understanding the scaling principle enables informed adjustments for specific requirements. Small artwork requires 
            relatively narrower borders than large artwork to maintain balanced proportions and prevent excessive total frame 
            dimensions.
          </p>

          <p>
            For very small artwork (under 5x7 inches), strict rule of thirds application may suggest borders that are too narrow 
            for professional appearance. Example: 4x6 inch artwork yields 1.33 inch minimum border by rule of thirds, but many 
            framers prefer 2 to 2.5 inch borders to establish adequate presence and justify framing investment. The adjusted 
            borders represent approximately 1/2 of the smallest dimension rather than 1/3, creating better visual weight for tiny 
            pieces while avoiding excessive total frame size.
          </p>

          <p>
            For medium artwork (8x10 to 16x20 inches), the rule of thirds provides excellent guidance with minimal adjustment. 
            An 11x14 inch print calculates to 3.67 inch minimum border, typically rounded to 3.5 or 4 inches in practice. A 16x20 
            inch print yields 5.33 inch minimum, usually implemented as 5 or 5.5 inches. These borders provide substantial breathing 
            room while maintaining manageable overall frame dimensions and material costs. Most professional framing falls in this 
            size range where traditional formulas work optimally without modification.
          </p>

          <h2 data-testid="heading-large-artwork">Large Artwork Considerations (30x40"+)</h2>

          <p>
            Large artwork (30x40 inches and larger) requires modified approach to border proportions because strict rule of thirds 
            application creates impractically wide borders and enormous frame dimensions. A 30x40 inch artwork following rule of 
            thirds would require 10 inch borders (1/3 of 30 inches), yielding 50x60 inch frame, an enormous assembly that's difficult 
            to handle, expensive to glaze, and visually excessive. Professional framers modify the formula for large work while 
            maintaining proportional relationships.
          </p>

          <p>
            For large artwork, professional practice typically uses 1/4 to 1/5 of smallest dimension rather than 1/3, balancing 
            adequate borders against practical constraints. A 30x40 inch piece using 1/4 formula calculates: 30 ÷ 4 = 7.5 inch 
            borders, creating 45x55 inch frame, substantial but manageable. Some framers go further, using 1/5 formula: 30 ÷ 5 = 
            6 inch borders, yielding 42x52 inch frame. These modified proportions maintain professional appearance while controlling 
            frame size and cost.
          </p>

          <p>
            Very large artwork (over 40x60 inches) may use even narrower proportional borders, sometimes as small as 1/6 of smallest 
            dimension, particularly when budget or space constraints limit total frame dimensions. However, borders should never 
            drop below 4 inches regardless of artwork size, narrower borders on large work create cramped appearance that undermines 
            presentation quality. When extremely large artwork prohibits adequate borders, consider frameless mounting, gallery wrap 
            presentation, or floater frames that eliminate mat borders entirely while providing edge protection.
          </p>

          <h2>Small Artwork Requirements (Under 5x7")</h2>

          <p>
            Small artwork (under 5x7 inches) presents unique proportioning challenges because strict adherence to rule of thirds 
            produces borders that appear too narrow for professional presentation. A 4x6 inch photograph following rule of thirds 
            calculates to 1.33 inch minimum border, but such narrow borders create budget appearance and provide insufficient 
            visual weight to justify framing investment. Professional framers adjust the formula for small work to ensure adequate 
            presence and perceived value.
          </p>

          <p>
            For artwork smaller than 5x7 inches, professional practice typically uses approximately 1/2 of the smallest dimension 
            for border width calculation. A 4x6 inch print calculates: 4 ÷ 2 = 2 inch borders, creating an 8x10 inch frame, a 
            substantial increase from the 6.66x8.66 inch frame that rule of thirds would produce. The larger borders provide better 
            visual impact, justify framing costs, and create presentation that commands appropriate attention despite small image 
            size.
          </p>

          <p>
            Miniature artwork (under 3x4 inches) may benefit from even more generous borders approaching or equaling the artwork 
            dimensions themselves. A 2x3 inch miniature painting with 2.5 to 3 inch borders creates 7x8 to 8x9 inch frame, 
            transforming the tiny piece into substantial presentation that celebrates the artwork's delicate scale. Wide borders 
            on miniatures serve similar function to architectural niches, creating controlled viewing environment that focuses 
            attention and enhances perceived importance of small subjects.
          </p>

          <h2>Multi-Opening Border Calculations</h2>

          <p>
            Multi-opening mats require modified border calculations because the layout includes multiple images, spacing between 
            openings, and overall composition balance. The outer borders (frame edges to nearest openings) typically follow rule 
            of thirds based on individual image dimensions, while spacing between openings follows structural minimums (3/4 inch) 
            with aesthetic adjustments for visual balance. The complexity requires systematic calculation to prevent cramped 
            layouts or excessive total dimensions.
          </p>

          <p>
            For multi-opening layouts, calculate outer borders using rule of thirds applied to individual image size. Four 5x7 
            inch photographs in 2x2 grid would use approximately 1.67 to 2 inch outer borders (1/3 of 5 inches, rounded). Calculate 
            minimum spacing between openings at 3/4 inch for structural integrity, increasing to 1 to 2 inches for better visual 
            separation. Total mat width calculation: (2 × 5 inches for images) + (2 × 2 inches for outer borders) + (1 × 1.5 inches 
            for center spacing) = 15.5 inches wide.
          </p>

          <p>
            Complex multi-opening layouts with varying image sizes require iterative calculations balancing individual image 
            borders, inter-opening spacing, and overall composition proportions. Start with rule of thirds for outer borders, 
            minimum 3/4 inch for opening spacing, then verify the composition feels balanced when sketched. Adjust spacing and 
            borders as needed to prevent cramping or excessive gaps. Professional framers often increase spacing between different-sized 
            openings to 2 to 3 inches, creating clear visual separation that prevents confusion while maintaining coherent layouts.
          </p>

          <h2>Professional Proportion Guidelines</h2>

          <p>
            Professional framers follow established proportion guidelines ensuring consistent quality across diverse projects. 
            Primary guideline: borders should never be narrower than 2 inches except for very large artwork or special circumstances, 
            borders under 2 inches create budget appearance and insufficient spacing for most applications. Secondary guideline: 
            borders should not exceed 1/2 of the artwork's smallest dimension except for miniatures or intentional dramatic 
            presentation, excessive borders overwhelm artwork and waste materials.
          </p>

          <p>
            Border consistency within multi-sided presentations maintains professional appearance. All borders in single-opening 
            mats should measure equally (or bottom slightly larger for weighted presentation), inconsistent borders appear accidental 
            rather than intentional. Multi-opening layouts should maintain consistent outer borders on all sides unless asymmetrical 
            design intentionally creates variation. Inter-opening spacing should remain uniform throughout the layout to prevent 
            visual irregularities that suggest measurement errors.
          </p>

          <p>
            Color and value affect perceived border width, dark mats appear to expand visually while light mats recede. Professional 
            framers may adjust border widths when using very dark mats (black, navy, charcoal), adding 1/4 to 1/2 inch to compensate 
            for the visual weight that makes borders seem wider than physical measurements. Conversely, very light mats (bright 
            white, cream) may use slightly narrower borders since they appear to recede visually. These subtle adjustments ensure 
            consistent visual proportions despite material color variations.
          </p>

          <h2>Visual Balance Through Proper Borders</h2>

          <p>
            Visual balance, the distribution of visual weight creating stable, pleasing compositions, depends critically on border 
            proportions. Properly calculated borders create equilibrium where artwork commands attention without feeling cramped or 
            lost. The relationship between positive space (artwork) and negative space (mat borders) establishes visual rhythm that 
            guides viewer perception and creates professional presentation quality distinguishing expert framing from amateur work.
          </p>

          <p>
            Too-narrow borders create visual crowding where artwork feels trapped against frame edges, fighting for breathing room. 
            The lack of transitional space between art and frame creates tension rather than harmony, making viewers uncomfortable 
            even if they can't articulate why. Narrow borders also increase risk of artwork damage from frame edge contact and 
            reduce protective spacing that prevents glazing interaction. Professional framers avoid this budget appearance by 
            adhering to minimum border width standards derived from rule of thirds.
          </p>

          <p>
            Conversely, excessive borders make artwork appear lost in empty space, diminishing impact and suggesting the framer 
            couldn't afford properly-sized artwork for the frame. Wide borders work for miniatures where generous space celebrates 
            delicate scale, but standard artwork requires proportional borders that enhance rather than overwhelm. Visual balance 
            occurs when borders provide adequate breathing room without consuming so much area that the mat competes with artwork 
            for attention, typically when borders measure between 1/3 and 1/2 of artwork's smallest dimension.
          </p>

          <h2>Border Width Examples for Common Artwork Sizes</h2>

          <p>
            Specific border width examples for common artwork sizes demonstrate professional proportion formulas in practical 
            application. For 8x10 inch artwork (standard photograph size), rule of thirds calculates to 2.67 inch minimum border, 
            typically implemented as 3 inches (equal borders) or 3 inch top/sides with 3.5 to 4 inch bottom (weighted). This creates 
            14x16 inch frame (equal borders) or 14x16.5 to 14x17 inch frame (weighted), providing substantial presentation that 
            commands wall space appropriately for this popular size.
          </p>

          <p>
            For 11x14 inch artwork (common print size), rule of thirds yields 3.67 inch minimum border, usually rounded to 3.5 or 
            4 inches in practice. Equal 4 inch borders create 19x22 inch frame while weighted approach (4 inch top/sides, 4.5 inch 
            bottom) produces 19x22.5 inch frame. These generous borders suit the larger artwork format, providing breathing room 
            that enhances rather than overwhelms the increased image area.
          </p>

          <p>
            For 16x20 inch artwork (poster size), rule of thirds calculates to 5.33 inch minimum, typically rounded to 5 or 5.5 
            inches. Equal 5.5 inch borders yield 27x31 inch frame, a substantial assembly appropriate for the large artwork. Some 
            framers reduce borders to 5 inches (26x30 inch frame) for cost control while maintaining professional proportions. 
            For 24x36 inch posters, strict rule of thirds (8 inch minimum) creates impractically large 40x52 inch frames, so 
            professionals typically use 6 to 7 inch borders (36x48 to 38x50 inch frames) balancing proportions against practical 
            constraints.
          </p>
        </article>

        {/* CTA Section */}
        <Card className="my-12 bg-primary/5 border-primary/20" data-testid="card-cta">
          <CardHeader>
            <CardTitle className="text-2xl">Design Your Custom Frame Now</CardTitle>
            <CardDescription className="text-base">
              Calculate perfect border proportions automatically with our professional design tools and instant previews.
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

            <Link href="/resources/common-mat-cutting-mistakes" data-testid="link-related-mistakes">
              <Card className="hover-elevate h-full cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">Common Mat Cutting Mistakes</CardTitle>
                  <CardDescription>
                    Avoid costly mat cutting errors with professional error prevention techniques and quality control.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/resources/mat-color-selection-guide" data-testid="link-related-color">
              <Card className="hover-elevate h-full cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">Mat Color Selection Guide</CardTitle>
                  <CardDescription>
                    Professional color theory for choosing mat board colors that enhance artwork presentation.
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
