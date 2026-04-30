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


import { Grid3x3, ArrowRight } from 'lucide-react';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';

export default function MultiOpeningLayoutEngineering() {
  useScrollToTop();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What are grid-based layouts for multi-opening mats?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Grid-based layouts arrange multiple openings in regular rows and columns with consistent spacing, creating organized, systematic presentations. Common configurations include 2x2 (4 openings), 3x3 (9 openings), and 4x3 (12 openings) grids. Grid layouts work excellently for school pictures, family photo collections, and any application requiring equal visual weight for all images. Spacing between openings should be minimum 3/4 inch for structural integrity, with equal spacing horizontally and vertically creating balanced presentations."
        }
      },
      {
        "@type": "Question",
        "name": "How do I create hierarchical multi-opening layouts?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Hierarchical layouts establish visual importance through size variation, larger openings command more attention than smaller ones. Place the most important image in a larger central opening, surrounded by smaller supporting images. Common hierarchical patterns include: central large opening (8x10) with 4-6 smaller openings (4x6 or 5x7) arranged symmetrically; large opening at top with smaller images below; or asymmetrical compositions with one dominant image and varied supporting sizes. Hierarchical layouts excel for sports teams, wedding photography, and any collection with a clear primary subject."
        }
      },
      {
        "@type": "Question",
        "name": "What is the rule of thirds in multi-opening design?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The rule of thirds divides the mat into nine equal sections using two horizontal and two vertical lines. Placing important openings at line intersections creates visually pleasing, balanced compositions that feel natural to viewers. This principle, borrowed from photography and painting, prevents static, centered layouts while guiding viewer attention through the composition. Apply rule of thirds by positioning key openings where gridlines intersect and aligning opening edges with division lines when possible."
        }
      },
      {
        "@type": "Question",
        "name": "What spacing is required between openings in multi-opening mats?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Professional multi-opening mats require minimum 3/4 inch spacing between adjacent openings to maintain structural integrity. Mat board with insufficient spacing between openings becomes weak and prone to warping, bending, or tearing. Typical spacing ranges from 3/4 inch minimum to 2-3 inches for larger, more formal presentations. Greater spacing provides more mat board material between openings, increasing strength while creating visual separation. The spacing should be consistent throughout the layout unless asymmetrical design intentionally varies distances."
        }
      },
      {
        "@type": "Question",
        "name": "Should I use symmetrical or asymmetrical multi-opening layouts?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Symmetrical layouts create formal, organized presentations ideal for traditional applications like school pictures, family portraits, and professional documentation. Perfect symmetry provides visual stability and timeless appearance. Asymmetrical layouts offer dynamic, contemporary presentations suited for artistic photography, creative collections, and modern interiors. Asymmetry creates visual interest through intentional imbalance while requiring more design skill to maintain overall composition balance. Choose based on artwork style, display purpose, and personal preference."
        }
      },
      {
        "@type": "Question",
        "name": "How do I distribute visual weight in multi-opening designs?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Visual weight distribution balances compositional elements so the layout feels stable rather than heavy on one side. Larger openings carry more visual weight than smaller ones; darker images feel heavier than lighter images; and busy, detailed photos command more attention than simple images. Distribute weight by: balancing large openings on opposite sides; mixing image densities throughout the composition; varying opening sizes to create rhythm; and ensuring no single quadrant dominates excessively. Well-balanced designs feel cohesive when viewed from normal display distance."
        }
      },
      {
        "@type": "Question",
        "name": "What is negative space in multi-opening mat design?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Negative space refers to uncut mat board areas between and around openings. Adequate negative space prevents visual crowding, provides breathing room for images, and maintains structural integrity. Too little negative space makes compositions feel cramped and weakens mat board. Too much negative space wastes material and makes images feel disconnected. Professional designs balance negative space to create cohesive presentations where images relate visually while maintaining individual presence. Negative space also affects perceived formality, more space creates elegant, gallery-style presentations."
        }
      },
      {
        "@type": "Question",
        "name": "Can I mix opening shapes in one multi-opening mat?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Mixing opening shapes (rectangles with ovals or circles) can create sophisticated, custom presentations when done thoughtfully. Successful mixed-shape designs typically use one dominant shape (rectangles) with accent shapes (oval center opening). Keep the design cohesive by limiting to 2-3 shape types and maintaining consistent sizing within each shape category. Mixed shapes work particularly well for wedding photography (rectangular candids with oval portrait), memorial displays, and artistic collections. Avoid excessive shape variety creating visual chaos."
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
        <Breadcrumb className="mb-8" data-testid="breadcrumb-layout">
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
              <BreadcrumbPage>Multi-Opening Layout Engineering</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Hero Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Grid3x3 className="w-10 h-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold" data-testid="heading-main">
              Multi-Opening Mat Layout Engineering
            </h1>
          </div>
          <p className="text-xl text-muted-foreground leading-relaxed" data-testid="text-hero-description">
            Professional design principles for multi-opening collage frames. Master grid systems, hierarchical compositions, 
            visual weight distribution, and structural spacing for balanced, cohesive presentations.
          </p>
        </div>

        {/* Main Content */}
        <article className="prose prose-slate dark:prose-invert max-w-none">
          <h2 data-testid="heading-grid-based-layouts">Grid-Based Layout Principles</h2>
          
          <p>
            Grid-based layouts form the foundation of multi-opening mat design, arranging multiple openings in regular rows 
            and columns with consistent spacing. Grids create organized, systematic presentations where each opening receives 
            equal visual weight, the ideal approach for school pictures, family photo collections, sports team photography, 
            and any application requiring democratic presentation without hierarchy.
          </p>

          <p>
            Common grid configurations include: 2x2 grids (4 openings) for compact presentations; 3x3 grids (9 openings) 
            for comprehensive collections; 4x3 grids (12 openings) for monthly baby photos or full school year documentation; 
            and custom configurations like 5x2 (10 openings) or 6x2 (12 openings) accommodating specific photo counts. The 
            grid structure provides inherent organization that viewers understand intuitively, left to right, top to bottom 
            reading patterns create natural viewing sequences.
          </p>

          <p>
            Successful grid layouts maintain consistent spacing both horizontally and vertically. Minimum 3/4 inch spacing 
            between adjacent openings ensures structural integrity, insufficient spacing creates weak points where mat board 
            warps or tears. Typical spacing ranges from 1 to 2 inches for most applications, with larger presentations using 
            2-3 inch spacing for increased formality and visual separation. Equal spacing in all directions creates balanced, 
            harmonious compositions that feel professionally designed.
          </p>

          <h2 data-testid="heading-hierarchical-layouts">Hierarchical Layouts with Size Relationships</h2>

          <p>
            Hierarchical layouts establish visual importance through size variation, where larger openings command more viewer 
            attention than smaller openings. This approach suits collections with clear primary subjects: sports team photos 
            with central team photo surrounded by individual player portraits; wedding photography with large ceremony image 
            accompanied by smaller detail shots; or family displays featuring prominent recent portrait with smaller historical 
            photos.
          </p>

          <p>
            Effective hierarchical designs create size ratios that clearly communicate importance without overwhelming. Common 
            patterns include: central 8x10 inch opening surrounded by 4-6 smaller 4x6 or 5x7 inch openings; large 11x14 inch 
            top opening with 6-8 smaller 4x6 inch images arranged below in grid formation; or dominant vertical 16x20 inch 
            opening flanked by smaller openings on both sides. The size difference should be significant enough to establish 
            clear hierarchy, oversizing the primary image by 150-200% compared to supporting images creates effective visual 
            relationships.
          </p>

          <p>
            Hierarchical layouts work best with symmetrical arrangement of smaller openings around the dominant image. 
            Symmetry prevents the composition from feeling unbalanced while allowing the size difference to establish 
            importance. For example, a central 8x10 opening might have three 4x6 openings on each side, creating balanced 
            flanking that draws attention to the center without competing for visual dominance.
          </p>

          <h2 data-testid="heading-asymmetrical-arrangements">Organic and Asymmetrical Arrangements</h2>

          <p>
            Organic, asymmetrical layouts break from rigid grids and hierarchies to create dynamic, contemporary presentations. 
            These designs intentionally distribute openings irregularly across the mat surface, varying sizes, positions, and 
            spacing to create visual interest through controlled imbalance. Asymmetrical layouts suit artistic photography, 
            creative collections, modern interiors, and applications where traditional presentation feels too static.
          </p>

          <p>
            Despite appearing spontaneous, successful asymmetrical designs follow compositional principles ensuring overall 
            balance. Visual weight must distribute evenly, if large openings cluster on one side, smaller openings should 
            counterbalance on the opposite side. The rule of thirds provides guidance for positioning key elements at 
            intersection points rather than centered. Varied spacing between openings (while maintaining structural minimums) 
            creates rhythm and prevents monotony.
          </p>

          <p>
            Creating effective asymmetrical layouts requires more design skill than systematic grids. Start by positioning 
            the largest or most important opening according to rule of thirds, approximately one-third from left or right edge. 
            Add additional openings at varied distances, ensuring no single quadrant becomes too dense or too sparse. Step 
            back frequently during design to evaluate overall balance from normal viewing distance (6-10 feet) rather than 
            close inspection. If the composition feels heavy on one side, redistribute openings or adjust sizes.
          </p>

          <h2 data-testid="heading-symmetry-vs-asymmetry">Symmetry vs. Asymmetry in Multi-Opening Design</h2>

          <p>
            Symmetry and asymmetry represent fundamental design approaches with different aesthetic and practical implications. 
            Symmetrical layouts create formal, organized presentations through mirror-image balance or radial symmetry around 
            a central point. Perfect symmetry provides inherent visual stability, viewers perceive symmetrical compositions as 
            balanced, complete, and professionally designed without conscious analysis.
          </p>

          <p>
            Symmetrical multi-opening designs work excellently for: school picture progressions requiring systematic 
            organization; family photo walls emphasizing all members equally; memorial or tribute displays; and traditional 
            interiors where formal presentation feels appropriate. Symmetry suits subjects with clear organizational logic, 
            chronological sequences (school years), relationship structures (family trees), or team rosters (coach, captains, 
            players).
          </p>

          <p>
            Asymmetrical layouts offer dynamic, contemporary alternatives through intentional imbalance. Asymmetry creates 
            visual interest, movement, and modern aesthetic suited for: artistic photography portfolios; creative mixed-media 
            collections; contemporary interiors; and displays emphasizing individual image importance rather than systematic 
            organization. Asymmetry demands more design sophistication, maintaining overall balance while creating interesting 
            irregular arrangements requires understanding visual weight, proportion, and negative space.
          </p>

          <h2 data-testid="heading-rule-of-thirds">Rule of Thirds Application</h2>

          <p>
            The rule of thirds, borrowed from photography and painting composition, divides rectangular spaces into nine equal 
            sections using two equally-spaced horizontal lines and two equally-spaced vertical lines. Positioning important 
            elements at line intersections or along division lines creates balanced, visually pleasing compositions that feel 
            natural to viewers. This principle operates subconsciously, humans find off-center placement more interesting than 
            perfect centering.
          </p>

          <p>
            Apply rule of thirds to multi-opening mats by positioning key openings (largest or most important images) at 
            intersection points approximately one-third from edges rather than centered. For example, in a hierarchical layout 
            with one dominant image and several smaller supporting images, place the large opening at an upper or lower 
            intersection point, then arrange smaller openings to balance the composition.
          </p>

          <p>
            Rule of thirds also guides overall composition density. Divide the mat into thirds both horizontally and vertically, 
            then ensure each section contains roughly balanced visual weight. Avoid concentrating all openings in one-third of 
            the mat while leaving two-thirds empty, this creates unbalanced compositions that feel incomplete. Instead, 
            distribute openings across all sections while intentionally varying density to create interest.
          </p>

          <h2 data-testid="heading-visual-weight">Visual Weight Distribution</h2>

          <p>
            Visual weight refers to the perceived heaviness or lightness of compositional elements based on size, color, 
            detail, and position. Understanding visual weight allows designers to create balanced multi-opening layouts that 
            feel stable and cohesive. Elements with high visual weight include: large openings (size creates presence); dark 
            or high-contrast images (darkness feels heavier); busy, detailed photographs (complexity draws attention); and 
            warm colors (reds, oranges feel heavier than cool blues, greens).
          </p>

          <p>
            Distribute visual weight throughout the composition so no single area dominates excessively. If placing a large, 
            dark, detailed image on the left side, balance with multiple smaller openings or a moderately sized opening on 
            the right. Upper portions of compositions feel lighter than lower portions, viewers expect weight at the bottom. 
            Placing too much visual weight in upper regions creates top-heavy compositions that feel unstable.
          </p>

          <p>
            Test visual weight distribution by viewing the layout from normal display distance (6-10 feet) and squinting 
            slightly to blur details. The composition should feel balanced left-to-right and top-to-bottom without obvious 
            heavy or light areas. If one section dominates, redistribute openings, adjust sizes, or consider mat color 
            changes (lighter mats feel less heavy than darker mats) to achieve balance.
          </p>

          <h2 data-testid="heading-repetition-rhythm">Repetition and Rhythm in Layouts</h2>

          <p>
            Repetition creates rhythm in multi-opening designs through predictable patterns that guide viewer attention while 
            providing visual organization. Repeating elements include: consistent opening sizes (all 5x7 or all 4x6); regular 
            spacing intervals (1.5 inches between all openings); alternating patterns (large-small-large-small); or shape 
            repetition (all rectangles or mixing rectangles with consistent oval accents).
          </p>

          <p>
            Rhythm through repetition creates cohesion that unifies disparate photographs into single presentations. School 
            picture layouts use rhythm effectively, identical 3x4 inch openings arranged in regular grids create systematic 
            organization that viewers understand immediately. The repetition emphasizes the collection's chronological 
            narrative rather than individual photos, making the progression itself the subject.
          </p>

          <p>
            Varying rhythm intentionally creates visual interest while maintaining underlying pattern. Establish baseline 
            rhythm through consistent spacing or sizing, then introduce calculated variations, slightly larger final opening 
            in progression, varied spacing in one row, or accent shape interrupting rectangle pattern. These variations 
            provide focal points without destroying overall rhythmic structure. Excessive variation creates chaos rather 
            than rhythm, limit variations to 20-30% of openings.
          </p>

          <h2 data-testid="heading-negative-space">Negative Space Management</h2>

          <p>
            Negative space, uncut mat board areas between and around openings, serves critical compositional and structural 
            functions in multi-opening design. Adequate negative space prevents visual crowding, provides breathing room for 
            images, and maintains mat board integrity. The relationship between negative space (background) and positive space 
            (openings) fundamentally affects composition quality.
          </p>

          <p>
            Too little negative space creates cramped, busy compositions where images compete rather than complement. Minimum 
            spacing of 3/4 inch between openings addresses structural requirements but often feels visually tight. Professional 
            designs typically use 1.5-2.5 inch spacing for balanced presentations that give each image appropriate presence 
            without isolation. Greater spacing creates more formal, gallery-style presentations suited for fine art photography 
            and high-end framing.
          </p>

          <p>
            Border width around the entire composition represents critical negative space requiring careful consideration. 
            Multi-opening mats need larger borders than single-opening mats because multiple images create greater visual 
            complexity. Minimum 2.5-3 inch borders prevent compositions from feeling cramped against frame edges. Complex 
            layouts with many openings benefit from 3-4 inch borders providing visual containment and preventing overwhelming 
            density.
          </p>

          <h2 data-testid="heading-spacing-requirements">Opening Spacing Requirements for Structural Integrity</h2>

          <p>
            Structural spacing between openings ensures mat board strength and longevity. Mat board material between openings 
            provides essential structural support, insufficient spacing creates weak points prone to warping, bending, or 
            tearing. Professional multi-opening mats require minimum 3/4 inch spacing between adjacent opening edges, measured 
            from closest points.
          </p>

          <p>
            This minimum represents absolute structural requirement under ideal conditions, level mounting, quality mat board, 
            proper frame assembly. Real-world applications often benefit from greater spacing. Typical professional spacing 
            ranges from 1 to 2 inches between openings, providing comfortable structural margin while creating appropriate 
            visual separation. Layouts with many openings (9+) or large overall size (24x36 inches or larger) should use 
            1.5-2 inch minimum spacing for enhanced strength.
          </p>

          <p>
            Spacing requirements increase near mat edges where support decreases. Openings within 1.5 inches of mat edges 
            require larger surrounding borders for stability, minimum 2-inch borders even for small mats, 3-4 inches for 
            larger formats. Corner regions prove particularly vulnerable to stress, avoid placing opening corners within 2 
            inches of mat corners where structural support is weakest.
          </p>

          <h2 data-testid="heading-faq">Questions we hear most</h2>

          <div className="space-y-6 my-8">
            <div>
              <h3 className="text-xl font-semibold mb-2" data-testid="faq-question-1">What are grid-based layouts for multi-opening mats?</h3>
              <p>
                Grid-based layouts arrange multiple openings in regular rows and columns with consistent spacing, creating 
                organized presentations. Common configurations include 2x2, 3x3, and 4x3 grids. Grid layouts work excellently 
                for school pictures, family photos, and applications requiring equal visual weight for all images. Spacing 
                should be minimum 3/4 inch for structural integrity.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2" data-testid="faq-question-2">How do I create hierarchical multi-opening layouts?</h3>
              <p>
                Hierarchical layouts establish visual importance through size variation, larger openings command more attention. 
                Place the most important image in a larger central opening, surrounded by smaller supporting images. Common 
                patterns include central large opening (8x10) with 4-6 smaller openings (4x6 or 5x7) arranged symmetrically. 
                Hierarchical layouts excel for sports teams and wedding photography.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2" data-testid="faq-question-3">What is the rule of thirds in multi-opening design?</h3>
              <p>
                The rule of thirds divides the mat into nine equal sections using two horizontal and two vertical lines. 
                Placing important openings at line intersections creates visually pleasing, balanced compositions. This 
                principle prevents static, centered layouts while guiding viewer attention. Position key openings where 
                gridlines intersect and align edges with division lines.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2" data-testid="faq-question-4">What spacing is required between openings in multi-opening mats?</h3>
              <p>
                Professional multi-opening mats require minimum 3/4 inch spacing between adjacent openings for structural 
                integrity. Mat board with insufficient spacing becomes weak and prone to warping. Typical spacing ranges 
                from 3/4 inch minimum to 2-3 inches for larger, formal presentations. Greater spacing increases strength 
                and creates visual separation.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2" data-testid="faq-question-5">Should I use symmetrical or asymmetrical multi-opening layouts?</h3>
              <p>
                Symmetrical layouts create formal, organized presentations ideal for school pictures, family portraits, and 
                professional documentation. Asymmetrical layouts offer dynamic, contemporary presentations suited for artistic 
                photography and modern interiors. Choose based on artwork style, display purpose, and personal preference. 
                Symmetry provides timeless stability while asymmetry creates modern visual interest.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2" data-testid="faq-question-6">How do I distribute visual weight in multi-opening designs?</h3>
              <p>
                Visual weight distribution balances elements so the layout feels stable. Larger openings carry more weight 
                than smaller ones; darker images feel heavier than lighter images. Distribute weight by balancing large 
                openings on opposite sides, mixing image densities, varying opening sizes, and ensuring no single quadrant 
                dominates excessively. Well-balanced designs feel cohesive from normal viewing distance.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2" data-testid="faq-question-7">What is negative space in multi-opening mat design?</h3>
              <p>
                Negative space refers to uncut mat board areas between and around openings. Adequate negative space prevents 
                crowding, provides breathing room, and maintains structural integrity. Too little space makes compositions 
                cramped; too much makes images disconnected. Professional designs balance negative space for cohesive 
                presentations where images relate visually while maintaining individual presence.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2" data-testid="faq-question-8">Can I mix opening shapes in one multi-opening mat?</h3>
              <p>
                Mixing opening shapes (rectangles with ovals or circles) can create sophisticated presentations when done 
                thoughtfully. Use one dominant shape (rectangles) with accent shapes (oval center opening). Limit to 2-3 
                shape types and maintain consistent sizing within each category. Mixed shapes work well for wedding photography 
                and memorial displays. Avoid excessive variety creating visual chaos.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <Card className="my-12 bg-muted" data-testid="card-cta-layout">
            <CardHeader>
              <CardTitle className="text-2xl">Design Your Multi-Opening Frame Now</CardTitle>
              <CardDescription className="text-base">
                Apply professional layout principles with our collage frame designer. Create custom multi-opening frames 
                with precision positioning, structural validation, and real-time visualization.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              <Link href="/designer" data-testid="link-cta-collage-designer">
                <Button size="lg">
                  Collage Frame Designer
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/designer" data-testid="link-cta-mat-designer">
                <Button size="lg" variant="outline">
                  Mat Board Designer
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Related Articles */}
          <div className="mt-16 pt-8 border-t">
            <h2 className="text-2xl font-bold mb-6">Related Resources</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/resources/border-width-proportions" data-testid="link-related-borders">
                <Card className="hover-elevate h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">Border Width & Proportions</CardTitle>
                    <CardDescription>
                      Professional border calculations and proportion guidelines for balanced framing
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
              <Link href="/resources/mat-color-selection-guide" data-testid="link-related-color">
                <Card className="hover-elevate h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">Mat Color Selection Guide</CardTitle>
                    <CardDescription>
                      Color theory for choosing mat colors that unify multiple photographs
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
              <Link href="/resources/school-picture-frames" data-testid="link-related-school">
                <Card className="hover-elevate h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">School Picture Frame Layouts</CardTitle>
                    <CardDescription>
                      Practical applications for K-12 school picture progression displays
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}
