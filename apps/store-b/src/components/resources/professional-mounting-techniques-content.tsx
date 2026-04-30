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


import { Wrench, ArrowRight } from 'lucide-react';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';

export default function ProfessionalMountingTechniques() {
  useScrollToTop();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is hinge mounting for artwork?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Hinge mounting attaches artwork to backing board using small paper hinges and reversible wheat starch paste, similar to how door hinges work. T-hinges attach at top edge allowing artwork to hang naturally, while V-hinges fold into inverted V-shapes for additional support. Hinge mounting is the conservation standard for valuable artwork because it's completely reversible, hinges can be removed with water without damaging the original piece. This technique suits works on paper including prints, drawings, watercolors, and photographs."
        }
      },
      {
        "@type": "Question",
        "name": "How do you use photo corners for mounting?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Photo corners are triangular pockets that slip over artwork corners, securing the piece without adhesives touching the artwork surface. Position corners at all four corners of the artwork, adhering only to the backing board. The artwork slides into corner pockets and remains completely unattached to mounting materials, making this the most reversible mounting method available. Photo corners work excellently for photographs, documents, certificates, and any artwork requiring maximum preservation flexibility. Use archival-quality corners made from archival materials for conservation applications."
        }
      },
      {
        "@type": "Question",
        "name": "What is float mounting?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Float mounting displays artwork so it appears to float above the backing, showing all four decorative edges including deckled borders, artist signatures, or torn edges. The artwork is hinged to a backing board positioned behind the mat opening, visible through the opening but not touching the mat. Float mounting creates dimensional, shadow-box-like presentations ideal for handmade papers, deckle-edge prints, and artwork where edges are integral to the design. This technique requires careful spacing to prevent artwork contact with glazing."
        }
      },
      {
        "@type": "Question",
        "name": "When should I use reversible mounting versus permanent mounting?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Use reversible mounting for valuable, irreplaceable, or original artwork including: limited edition prints, original drawings and watercolors, vintage photographs, historical documents, and family heirlooms. Reversible mounting uses wheat starch paste or photo corners that can be removed without artwork damage. Use permanent mounting only for replaceable items like commercial posters, mass-produced prints, digital reproductions, and temporary displays. Permanent mounting may use stronger adhesives or dry mount tissue that cannot be reversed without potential artwork damage."
        }
      },
      {
        "@type": "Question",
        "name": "What materials are needed for conservation mounting?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Conservation mounting requires: archival Japanese paper or linen tape for hinges; wheat starch paste or archival PVA adhesive; archival backing board (mounting board or foam board); clean workspace and bone folder for paste application; weights for drying; and clean, lint-free cloths. For photo corner mounting, use archival photo corners and archival backing. All materials must be pH neutral, lignin-free, and pass PAT (Photographic Activity Test) testing for photographic applications. Never use standard office tape, rubber cement, or acidic adhesives for conservation work."
        }
      },
      {
        "@type": "Question",
        "name": "How do you make wheat starch paste for hinge mounting?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Mix 1 tablespoon wheat starch powder with 1/4 cup cold water, stirring until smooth. Heat gently while stirring constantly until mixture thickens to yogurt-like consistency (approximately 140-150°F). Remove from heat and strain through fine mesh to remove lumps. Cool to room temperature before use. Wheat starch paste remains workable for several hours and can be stored refrigerated for 2-3 days. This traditional conservation adhesive provides strong bonds while remaining completely reversible with water, making it the gold standard for archival mounting. Pre-made conservation paste is available from archival suppliers."
        }
      },
      {
        "@type": "Question",
        "name": "What is the difference between T-hinges and V-hinges?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "T-hinges consist of two pieces: a pendant (vertical strip adhered to artwork back) and a cross piece (horizontal strip adhering pendant to backing board), forming a T-shape. T-hinges support lightweight to medium-weight artwork with minimal visibility. V-hinges fold a single paper strip into an inverted V-shape, with one leg adhered to artwork back and the other to backing board. V-hinges provide stronger support for heavier artwork and distribute weight more evenly. T-hinges suit most applications while V-hinges handle larger, heavier pieces."
        }
      },
      {
        "@type": "Question",
        "name": "Can you use dry mounting for conservation framing?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Traditional dry mounting using heat-activated adhesive tissue is NOT reversible and should never be used for conservation framing of valuable artwork. The high heat and permanent adhesive bond prevent future removal without artwork damage. However, modern cold-mounting alternatives using release adhesives provide temporary mounting suitable for some applications. For true conservation work, always use reversible techniques including hinge mounting with wheat starch paste or photo corners. Reserve dry mounting only for replaceable commercial posters and reproductions where reversibility is unnecessary."
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
        <Breadcrumb className="mb-8" data-testid="breadcrumb-mounting">
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
              <BreadcrumbPage>Professional Mounting Techniques</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Hero Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Wrench className="w-10 h-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold" data-testid="heading-main">
              Professional Mounting Techniques
            </h1>
          </div>
          <p className="text-xl text-muted-foreground leading-relaxed" data-testid="text-hero-description">
            Master archival mounting methods used by conservation framers and museums. Learn hinge mounting, photo corners, 
            float mounting, and reversible techniques for proper artwork preservation.
          </p>
        </div>

        {/* Main Content */}
        <article className="prose prose-slate dark:prose-invert max-w-none">
          <h2 data-testid="heading-hinge-mounting">Hinge Mounting with Wheat Starch Paste</h2>
          
          <p>
            Hinge mounting represents the conservation standard for attaching artwork to backing boards, used by museums, 
            galleries, and professional conservation framers worldwide. This technique attaches artwork using small paper 
            hinges and reversible wheat starch paste, functioning like door hinges that allow the artwork to hang naturally 
            while remaining removable without damage. Hinge mounting suits works on paper including prints, drawings, 
            watercolors, documents, and photographs.
          </p>

          <p>
            The fundamental principle behind hinge mounting emphasizes reversibility, all mounting materials can be removed 
            with water, returning the artwork to its original unmounted state. This reversibility proves essential for 
            valuable artwork because mounting preferences change over time, frames require updating, and conservation 
            standards evolve. Irreversible mounting techniques create permanent alterations that decrease artwork value 
            and eliminate future preservation options.
          </p>

          <p>
            Professional hinge mounting uses Japanese paper or linen tape cut into strips, adhered with wheat starch paste 
            to both artwork and backing board. The paper hinges provide strong yet flexible attachment that supports artwork 
            weight while accommodating natural paper expansion and contraction with humidity changes. Proper hinge placement 
            and paste application ensure secure mounting without buckling, cockling, or stress points that damage artwork 
            over time.
          </p>

          <h2 data-testid="heading-t-hinge">T-Hinge Construction and Application</h2>

          <p>
            T-hinges consist of two paper components forming a T-shape: the pendant (vertical strip) adheres directly to 
            the artwork's back surface near the top edge, while the cross piece (horizontal strip) adheres over the pendant, 
            bonding to the backing board. This configuration creates a hinge action where the artwork hangs from the top edge, 
            suspended by the pendant-cross piece connection. T-hinges provide clean mounting with minimal material touching 
            the artwork.
          </p>

          <p>
            To create T-hinges, cut Japanese paper or linen tape into two pieces per hinge: pendants measuring approximately 
            1 inch wide by 2 inches long, and cross pieces measuring 1.5 inches wide by 3 inches long. Apply wheat starch 
            paste thinly to the lower half of the pendant, then adhere it vertically to the artwork's back, approximately 
            1 inch from the top edge. Two hinges typically suffice for standard-size artwork (up to 16x20 inches), positioned 
            one-quarter width from each edge.
          </p>

          <p>
            After pendant placement, position the artwork face-down on the backing board in its desired final location. 
            Apply wheat starch paste to the cross piece and place it horizontally across the pendant, adhering firmly to 
            the backing board. The cross piece should extend equal distances on both sides of the pendant, creating the 
            T-shape. Allow complete drying (2-4 hours) under light weight before handling. The completed T-hinge allows 
            the artwork to hang naturally while remaining completely removable with water.
          </p>

          <h2 data-testid="heading-v-hinge">V-Hinge for Heavy Artwork</h2>

          <p>
            V-hinges provide stronger support than T-hinges, making them suitable for heavier artwork, large-format pieces, 
            or materials with substantial weight like thick watercolor paper or mounted photographs. The V-hinge folds a 
            single paper strip into an inverted V-shape, with one leg adhered to the artwork's back and the opposite leg 
            adhered to the backing board. This configuration distributes weight across a broader surface area than T-hinges.
          </p>

          <p>
            Create V-hinges by cutting Japanese paper strips approximately 1.5 inches wide by 4-5 inches long. Fold each 
            strip in half lengthwise, creating a sharp crease with a bone folder. Apply wheat starch paste to one leg of 
            the V (the inner surface of one half), then adhere this leg to the artwork's back, approximately 1 inch from 
            the top edge. The fold should run parallel to the top edge, creating a valley pointing downward.
          </p>

          <p>
            Position the artwork face-down on the backing board in final placement, ensuring the V-hinges extend beyond 
            the artwork's top edge. Apply wheat starch paste to the outer surface of the second leg, then press firmly 
            to the backing board. The V-shape should now stand upright between the artwork back and backing board, forming 
            a flexible bridge that supports weight while allowing movement. V-hinges handle artwork weighing several pounds 
            when properly executed with appropriate paper strength and paste application.
          </p>

          <h2 data-testid="heading-photo-corners">Corner Mounting with Photo Corners</h2>

          <p>
            Photo corners represent the most reversible mounting method available, requiring no adhesive contact with the 
            artwork surface whatsoever. Archival photo corners are triangular pockets, typically made from archival paper 
            or polyester, that slip over artwork corners, securing the piece entirely through mechanical means. The corners 
            themselves adhere to the backing board using adhesive or pre-attached sticky backs, but the artwork remains 
            completely free and removable.
          </p>

          <p>
            To mount using photo corners, position the artwork face-up on the backing board in desired final placement. 
            Mark corner positions lightly in pencil on the backing board. Remove the artwork and apply archival photo corners 
            at marked positions, corners may use wheat starch paste, archival double-sided tape, or pre-applied adhesive backs. 
            Ensure corners orient correctly with pockets opening inward to receive artwork edges.
          </p>

          <p>
            Slide the artwork back onto the backing board, carefully inserting each corner into its corresponding photo corner 
            pocket. The corners should grip the artwork firmly without excessive force that might bend or crease edges. For 
            maximum security, use corners at all four corners. For lighter-weight items, two diagonal corners (top-left and 
            bottom-right, or top-right and bottom-left) often suffice. Photo corners work excellently for photographs, 
            documents, certificates, lightweight prints, and any items requiring easy removal for examination or copying.
          </p>

          <h2 data-testid="heading-float-mounting">Float Mounting for Decorative Edges</h2>

          <p>
            Float mounting displays artwork so all four edges remain visible, appearing to float above the mat or backing 
            rather than being concealed beneath mat borders. This technique showcases decorative edges including deckled 
            borders on handmade paper, torn edges on certain prints, artist signatures extending beyond image areas, or 
            any situation where edge presentation enhances the work. Float mounting creates dimensional, shadow-box-like 
            presentations with visible space between artwork and mat.
          </p>

          <p>
            Execute float mounting by hinge-mounting the artwork to a backing board positioned behind the mat opening. The 
            mat opening must be larger than the artwork, typically by 1/2 to 1 inch on all sides, allowing the entire piece 
            to show including edges. The artwork remains visible through the opening but does not touch the mat, creating 
            the floating effect. Careful spacing ensures the artwork doesn't contact glazing, minimum 1/8 inch clearance 
            prevents moisture transfer and surface contact.
          </p>

          <p>
            Float mounting requires precise measurement and positioning. Calculate backing board placement so the artwork 
            centers within the mat opening when the assembly stacks together. Use spacers or filler board between the artwork 
            backing and the outer backing to bring the artwork forward toward the glazing plane, increasing the dimensional 
            effect. The shadow created by angled light enhances the floating appearance, making this technique particularly 
            effective for dramatic presentation of fine art prints and handmade papers.
          </p>

          <h2 data-testid="heading-adhesive-mounting">Adhesive Mounting for Reproductions</h2>

          <p>
            Adhesive mounting techniques, including spray adhesive, adhesive transfer sheets, and pressure-sensitive mounting 
            boards, provide permanent attachment suitable for replaceable reproductions, commercial posters, and temporary 
            displays. These methods offer convenience and strong bonding but lack reversibility, making them inappropriate 
            for valuable artwork. Use adhesive mounting only when artwork is readily replaceable and long-term preservation 
            is unnecessary.
          </p>

          <p>
            Spray adhesive application requires clean, well-ventilated workspace and protective covering for surrounding 
            areas. Position the artwork face-down on clean surface, then spray the back evenly with repositionable or 
            permanent spray adhesive per manufacturer instructions. Allow the adhesive to become tacky (typically 30-60 
            seconds), then carefully position the artwork onto backing board, pressing from center outward to eliminate 
            air bubbles. Smooth firmly with clean cloth or roller.
          </p>

          <p>
            Adhesive mounting boards use pressure-sensitive adhesive coating on rigid backing, covered by release liner. 
            Peel the liner, position artwork on exposed adhesive, then press firmly. These boards provide consistent adhesive 
            coverage without spray mess but cannot be repositioned once contact occurs. While convenient for commercial 
            applications, remember that adhesive mounting prevents future artwork removal and should never be used for 
            original or valuable pieces requiring conservation treatment.
          </p>

          <h2 data-testid="heading-when-to-use">When to Use Each Mounting Method</h2>

          <p>
            Method selection depends on artwork value, reversibility requirements, and presentation goals. Use hinge mounting 
            (T-hinges or V-hinges with wheat starch paste) for all valuable, original, or irreplaceable artwork including: 
            limited edition prints, original drawings and watercolors, vintage photographs, historical documents, signed 
            sports memorabilia, diplomas and certificates, and family heirlooms. Hinge mounting provides professional-grade 
            reversibility and represents best practice for professional conservation.
          </p>

          <p>
            Photo corner mounting suits: contemporary photographs requiring easy removal for reproduction; documents needing 
            periodic examination or copying; certificates displayed temporarily then stored; and lightweight artwork where 
            minimal contact is desired. Photo corners provide maximum reversibility with slightly less elegant presentation 
            than hinge mounting, corners remain visible at artwork edges.
          </p>

          <p>
            Float mounting works specifically for: artwork with decorative deckled edges; prints with artist signatures 
            outside image areas; handmade papers where edges are integral to design; and presentations requiring dimensional, 
            shadow-box effects. Adhesive mounting applies only to: readily replaceable commercial posters; mass-produced 
            reproductions; temporary displays with planned short lifespan (1-5 years); and situations where permanence and 
            convenience outweigh reversibility concerns.
          </p>

          <h2 data-testid="heading-reversible-vs-permanent">Reversible vs. Permanent Mounting</h2>

          <p>
            The distinction between reversible and permanent mounting fundamentally affects artwork preservation and future 
            value. Reversible mounting uses materials and techniques that can be completely undone without artwork damage, 
            wheat starch paste dissolves with water, Japanese paper hinges peel away cleanly, photo corners remove entirely. 
            Artwork mounted reversibly can be unmounted years later, returning to original condition as if never framed.
          </p>

          <p>
            Permanent mounting creates alterations that cannot be reversed without artwork damage or require extensive 
            conservation treatment for removal. Dry mounting heat-bonds tissue adhesive to artwork, making separation 
            difficult or impossible without professional intervention. Spray adhesives penetrate paper fibers, creating 
            permanent bonds. Pressure-sensitive adhesives may leave residues even when mechanically separated. These 
            permanent alterations decrease artwork value and eliminate preservation flexibility.
          </p>

          <p>
            Professional framers and conservators universally recommend reversible mounting for anything with value beyond 
            purely decorative function. The modest additional effort required for proper hinge mounting pays dividends over 
            decades as preservation standards evolve, frames require updating, or artwork needs conservation treatment. 
            Permanent mounting may seem convenient initially but creates long-term problems for valuable pieces requiring 
            professional standards.
          </p>

          <h2 data-testid="heading-materials-required">Materials Required for Conservation Mounting</h2>

          <p>
            Conservation mounting requires specific archival-grade materials meeting professional standards. Japanese paper 
            (kozo, gampi, or similar) provides ideal hinge material, strong yet flexible, with long fibers that create durable 
            bonds. Paper weight should match application: lightweight papers (12-20 gsm) suit delicate artwork; medium weights 
            (30-40 gsm) work for standard applications; heavier weights (50+ gsm) support large or heavy pieces. Linen tape 
            offers alternative hinge material with similar properties.
          </p>

          <p>
            Wheat starch paste remains the conservation standard for adhesives, valued for strength combined with complete 
            water reversibility. Purchase pre-made conservation paste or prepare from wheat starch powder, never use commercial 
            wheat paste containing additives or preservatives that compromise archival properties. Archival PVA (polyvinyl 
            acetate) adhesive provides alternative for certain applications, though wheat starch paste is preferred for most 
            conservation work.
          </p>

          <p>
            Backing boards must meet identical conservation standards as mat boards: archival, lignin-free, pH neutral, 
            with alkaline buffering for most applications. Mounting board (heavyweight conservation board) provides rigid 
            support; archival foam board offers lightweight alternative for temporary or less critical applications. All 
            materials contacting photographic materials must pass PAT (Photographic Activity Test) testing. Additional tools 
            include: bone folder for creasing and burnishing; clean workspace; weights for drying; lint-free cloths; and 
            clean water for paste preparation.
          </p>

          <h2 data-testid="heading-workflows">Step-by-Step Mounting Workflows</h2>

          <p>
            Professional T-hinge mounting workflow: First, prepare workspace with clean surface, tools, and materials. Cut 
            Japanese paper hinges: two pendants (1x2 inches) and two cross pieces (1.5x3 inches). Mix or prepare wheat starch 
            paste to proper consistency. Position artwork face-up on clean surface and mark hinge placement on back, typically 
            1 inch from top edge, one-quarter width from each side.
          </p>

          <p>
            Turn artwork face-down carefully. Apply thin paste layer to lower half of first pendant using small brush. Adhere 
            pendant vertically to artwork back at marked position, smoothing firmly with bone folder through clean paper. 
            Repeat for second pendant. Allow pendants to dry slightly (10-15 minutes) while preparing backing board positioning. 
            Place artwork face-down on backing board in desired final position.
          </p>

          <p>
            Apply wheat starch paste to cross pieces, then place each horizontally across its corresponding pendant, adhering 
            firmly to backing board. Ensure cross pieces center on pendants with equal extension on both sides. Smooth firmly, 
            then place clean paper over the entire assembly and weight lightly. Allow complete drying (2-4 hours minimum, 
            overnight preferred) before handling. Test hinge security gently before final assembly into frame package.
          </p>

          <h2 data-testid="heading-professional-standards">Professional Standards and Best Practices</h2>

          <p>
            Professional mounting adheres to strict standards ensuring artwork safety and preservation. Hinges should support 
            artwork weight without strain, two hinges for standard sizes, three to four for large or heavy pieces. Hinge 
            placement approximately 1 inch from top edge prevents stress concentration at attachment points. Never hinge 
            artwork at bottom edge, gravity should pull artwork against hinges, not away from them.
          </p>

          <p>
            Paste application requires skill, too little paste causes weak bonds; too much creates buckling and cockling. 
            Apply paste thinly and evenly, avoiding lumps or dry spots. Paste should soak slightly into paper fibers without 
            excessive saturation causing discoloration. Work quickly during paste application to prevent premature drying, 
            but allow adequate drying time before handling, rushing the process causes mount failure.
          </p>

          <p>
            Environmental conditions affect mounting success. Work in climate-controlled space with moderate humidity 
            (40-50% RH) and comfortable temperature (65-75°F). Extreme humidity causes paste to remain wet indefinitely; 
            excessive dryness makes paste skin over before bonding. Clean workspace prevents contamination, dirt, oils, and 
            debris transfer to artwork during mounting. Professional framers maintain dedicated mounting areas with proper 
            tools and materials stored in clean, organized fashion.
          </p>

          <h2 data-testid="heading-faq">Questions we hear most</h2>

          <div className="space-y-6 my-8">
            <div>
              <h3 className="text-xl font-semibold mb-2" data-testid="faq-question-1">What is hinge mounting for artwork?</h3>
              <p>
                Hinge mounting attaches artwork to backing board using small paper hinges and reversible wheat starch paste. 
                T-hinges attach at top edge allowing artwork to hang naturally, while V-hinges provide additional support. 
                This conservation standard technique is completely reversible, hinges can be removed with water without damaging 
                the original piece, making it ideal for valuable artwork.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2" data-testid="faq-question-2">How do you use photo corners for mounting?</h3>
              <p>
                Photo corners are triangular pockets that slip over artwork corners, securing the piece without adhesives 
                touching the artwork surface. Position corners at all four corners, adhering only to backing board. The 
                artwork slides into corner pockets and remains completely removable, making this the most reversible mounting 
                method available. Use archival-quality corners for conservation applications.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2" data-testid="faq-question-3">What is float mounting?</h3>
              <p>
                Float mounting displays artwork so it appears to float above the backing, showing all four decorative edges. 
                The artwork is hinged to a backing board positioned behind the mat opening, visible through the opening but 
                not touching the mat. This creates dimensional presentations ideal for deckle-edge prints, artist signatures, 
                and artwork where edges are integral to the design.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2" data-testid="faq-question-4">When should I use reversible mounting versus permanent mounting?</h3>
              <p>
                Use reversible mounting for valuable, irreplaceable, or original artwork including limited edition prints, 
                original drawings, vintage photographs, and historical documents. Reversible mounting uses wheat starch paste 
                or photo corners that can be removed without damage. Use permanent mounting only for replaceable commercial 
                posters and reproductions where reversibility is unnecessary.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2" data-testid="faq-question-5">What materials are needed for conservation mounting?</h3>
              <p>
                Conservation mounting requires: archival Japanese paper or linen tape for hinges; wheat starch paste or 
                archival PVA adhesive; archival backing board; clean workspace and bone folder; weights for drying; and 
                lint-free cloths. All materials must be pH neutral, lignin-free, and pass PAT testing for photographic 
                applications. Never use standard office tape or acidic adhesives for conservation work.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2" data-testid="faq-question-6">How do you make wheat starch paste for hinge mounting?</h3>
              <p>
                Mix 1 tablespoon wheat starch powder with 1/4 cup cold water until smooth. Heat gently while stirring constantly 
                until mixture thickens to yogurt consistency (140-150°F). Strain through fine mesh, cool to room temperature. 
                Wheat starch paste provides strong bonds while remaining completely reversible with water, the conservation 
                standard. Pre-made conservation paste is available from archival suppliers.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2" data-testid="faq-question-7">What is the difference between T-hinges and V-hinges?</h3>
              <p>
                T-hinges consist of a pendant (vertical strip adhered to artwork back) and cross piece (horizontal strip 
                adhering pendant to backing), forming a T-shape. T-hinges support lightweight to medium-weight artwork. 
                V-hinges fold a single strip into inverted V-shape, providing stronger support for heavier artwork by 
                distributing weight more evenly. Choose based on artwork weight and size.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2" data-testid="faq-question-8">Can you use dry mounting for conservation framing?</h3>
              <p>
                Traditional dry mounting using heat-activated adhesive is NOT reversible and should never be used for 
                conservation framing of valuable artwork. The high heat and permanent bond prevent future removal without 
                damage. For true conservation work, always use reversible techniques including hinge mounting with wheat 
                starch paste or photo corners. Reserve dry mounting only for replaceable commercial posters.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <Card className="my-12 bg-muted" data-testid="card-cta-mounting">
            <CardHeader>
              <CardTitle className="text-2xl">Design Your Custom Mat Now</CardTitle>
              <CardDescription className="text-base">
                Apply professional mounting techniques with professional-grade materials. Our mat designer provides 
                specifications for proper artwork mounting and preservation.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              <Link href="/designer" data-testid="link-cta-mat-designer">
                <Button size="lg">
                  Mat Board Designer
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/designer" data-testid="link-cta-collage-designer">
                <Button size="lg" variant="outline">
                  Collage Frame Designer
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Related Articles */}
          <div className="mt-16 pt-8 border-t">
            <h2 className="text-2xl font-bold mb-6">Related Resources</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/resources/conservation-framing-standards" data-testid="link-related-conservation">
                <Card className="hover-elevate h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">Conservation Framing Standards</CardTitle>
                    <CardDescription>
                      Archival materials and professional-grade preservation for long-term protection
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
              <Link href="/resources/mat-board-vs-mounting-board" data-testid="link-related-comparison">
                <Card className="hover-elevate h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">Mat Board vs. Mounting Board</CardTitle>
                    <CardDescription>
                      Understanding different backing materials and their mounting applications
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
              <Link href="/resources/common-mat-cutting-mistakes" data-testid="link-related-mistakes">
                <Card className="hover-elevate h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">Common Mat Cutting Mistakes</CardTitle>
                    <CardDescription>
                      Avoid mounting errors and quality control issues in professional framing
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
