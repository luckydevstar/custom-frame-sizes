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


import { Shield, ArrowRight } from 'lucide-react';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';

export default function ConservationFramingStandards() {
  useScrollToTop();
  
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is conservation framing?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Conservation framing uses archival materials to protect artwork from damage for 100+ years. Key features: archival and lignin-free mat boards, neutral pH mounting materials, and reversible techniques. Materials meet Library of Congress standards and pass the Photographic Activity Test (PAT) per ISO 18916."
        }
      },
      {
        "@type": "Question",
        "name": "What does archival mean in picture framing?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Archival means neutral or alkaline pH (7.0+) with no acidic compounds that cause yellowing. Wood pulp contains acids that migrate into artwork, creating brown mat burn. Archival boards use purified cotton fibers or treated wood pulp, buffered with calcium carbonate to neutralize environmental acids."
        }
      },
      {
        "@type": "Question",
        "name": "Why is lignin-free construction important?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Lignin oxidizes and becomes acidic when exposed to light and air, causing yellowing. Even if acids are removed initially, residual lignin keeps generating new acids over time. Lignin-free boards use purified cotton or chemically processed wood pulp with lignin completely removed for 100+ year stability."
        }
      },
      {
        "@type": "Question",
        "name": "What is the Photographic Activity Test (PAT)?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "PAT (ISO 18916) determines if framing materials will react with photographic emulsions. The test uses accelerated aging (elevated temperature and humidity) to check for staining, fading, or chemical changes. Materials must show zero detectable changes to pass. Critical for valuable photography."
        }
      },
      {
        "@type": "Question",
        "name": "When is conservation framing required versus optional?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Required for irreplaceable items: original artwork, limited editions, historical documents, family photographs, museum collections, signed memorabilia. Recommended for replaceable items with long-term display plans. Standard framing acceptable for temporary displays (1-5 years) and easily replaced items."
        }
      },
      {
        "@type": "Question",
        "name": "How long does conservation framing preserve artwork?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Conservation framing preserves artwork for 100+ years with minimal degradation. Museums display 200+ year old documents in conservation frames with excellent condition. Standard framing yellows in 10-20 years and becomes brittle in 30-50 years. Conservation lasts 5-10x longer."
        }
      },
      {
        "@type": "Question",
        "name": "What are museum framing standards?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Professional framing standards require: archival, lignin-free mats with 3% alkaline buffering; reversible mounting (wheat starch paste or photo corners); framer's grade acrylic (97%+ protection); sealed backing against dust and insects; proper artwork-to-glazing spacing. Guidelines from AIC, Library of Congress, ICOM."
        }
      },
      {
        "@type": "Question",
        "name": "What is pH buffering in mat boards?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Buffering adds alkaline reserves (3% calcium carbonate) to neutralize environmental acids over time. Maintains pH 7.0-8.5 despite atmospheric pollutants. Standard for most conservation work. Exception: certain photos (albumen prints, cyanotypes) need unbuffered boards at exactly pH 7.0."
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
        <Breadcrumb className="mb-8" data-testid="breadcrumb-conservation">
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
              <BreadcrumbPage>Conservation Framing Standards</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Hero Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-10 h-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold" data-testid="heading-main">
              Conservation Framing Standards Guide
            </h1>
          </div>
          <p className="text-xl text-muted-foreground leading-relaxed" data-testid="text-hero-description">
            Conservation framing protects valuable artwork from damage for 100+ years using archival materials. This guide explains archival mats, professional framing standards, and when conservation framing matters. All our frames use professional-grade materials custom-built to your exact size.
          </p>
        </div>

        {/* Main Content */}
        <article className="prose prose-slate dark:prose-invert max-w-none">
          <h2 data-testid="heading-what-is-conservation">What is Conservation Framing and Why It Matters</h2>
          
          <p>
            Conservation framing (also called archival or museum framing) uses materials that protect artwork from chemical damage over decades or centuries.
          </p>

          <p>
            Standard framing prioritizes cost. Conservation framing prioritizes preservation.
          </p>

          <p><strong>The difference:</strong></p>
          <ul>
            <li>Archival, lignin-free mat boards prevent yellowing</li>
            <li>Neutral pH materials stop deterioration</li>
            <li>Reversible mounting techniques protect originals</li>
            <li>Materials pass rigorous testing (Library of Congress, ISO standards)</li>
          </ul>

          <p><strong>Why it matters:</strong></p>
          <p>
            Standard framing yellows in 10-20 years. Conservation framing lasts 100+ years without degradation.
          </p>

          <p>
            Common framing materials contain acids and chemicals that migrate into your artwork over time. Wood pulp mats oxidize. Adhesive tapes leave stains. Conservation materials prevent these reactions while remaining reversible.
          </p>

          <h2 data-testid="heading-acid-free">Archival Materials Explained</h2>

          <p>
            Archival means neutral or alkaline pH (7.0 or higher) with no acidic compounds that cause yellowing and brittleness.
          </p>

          <p><strong>The problem:</strong></p>
          <p>
            Wood pulp naturally contains acids that migrate into your artwork over time. You've seen the result: yellowed newspapers, brown "mat burn" outlines on old prints.
          </p>

          <p><strong>Two approaches to archival mats:</strong></p>
          <ul>
            <li><strong>Cotton fiber (professional-grade):</strong> Naturally archival and lignin-free. Highest quality, used by custom frame shops.</li>
            <li><strong>Treated wood pulp (professional-grade):</strong> Acids chemically removed. Good archival properties at lower cost.</li>
          </ul>

          <p><strong>Rule of thumb:</strong> Use cotton fiber for irreplaceable items. Treated wood pulp works well for valuable but replaceable art.</p>

          <h2 data-testid="heading-lignin-free">Lignin-Free Construction Importance</h2>

          <p>
            Lignin oxidizes when exposed to light and air, generating acids that cause yellowing. Think old newspapers turning yellow in months.
          </p>

          <p><strong>Why "archival" isn't enough:</strong></p>
          <p>
            Manufacturers can remove acids during processing, making boards initially archival. But if lignin remains, it generates new acids over time. Within 10-20 years, the same yellowing returns.
          </p>

          <p><strong>True conservation requires both:</strong></p>
          <ul>
            <li>Archival (no acids now)</li>
            <li>Lignin-free (won't generate acids later)</li>
          </ul>

          <p>
            Cotton linters are naturally lignin-free. Treated wood pulp needs chemical processing to extract lignin completely. Both options maintain neutral pH for 100+ years.
          </p>

          <h2 data-testid="heading-ph-buffering">pH Levels and Buffering</h2>

          <p>
            Buffering adds alkaline reserves (typically 3% calcium carbonate) to neutralize environmental acids that penetrate frames over time.
          </p>

          <p><strong>How buffering works:</strong></p>
          <p>
            Atmospheric pollutants (sulfur dioxide, nitrogen oxides, ozone) slowly acidify unbuffered materials. Buffered boards neutralize these acids, maintaining pH 8.0-8.5 for 50-100 years.
          </p>

          <p><strong>Important exception:</strong></p>
          <p>
            Some materials deteriorate faster in alkaline environments:
          </p>
          <ul>
            <li>Albumen prints</li>
            <li>Cyanotypes (blueprints)</li>
            <li>Certain dye-based photographs</li>
          </ul>

          <p>
            These require unbuffered, lignin-free boards at exactly pH 7.0. Know your artwork type before choosing buffered or unbuffered mats.
          </p>

          <h2 data-testid="heading-pat-testing">Photographic Activity Test (PAT) - ISO 18916</h2>

          <p>
            PAT is the gold standard test for materials touching photographs. It determines whether framing materials will chemically react with photographic emulsions.
          </p>

          <p><strong>Why photos need special testing:</strong></p>
          <p>
            Silver halide crystals and color dyes react differently than paper fibers. Standard archival tests aren't enough.
          </p>

          <p><strong>How PAT works:</strong></p>
          <ul>
            <li>Exposes photo materials to framing products at 70°C and 86% humidity for 15 days</li>
            <li>Simulates years of aging in compressed timeframes</li>
            <li>Evaluators check for staining, fading, chemical changes</li>
            <li>Materials must show zero detectable changes to pass</li>
          </ul>

          <p><strong>What needs PAT certification:</strong></p>
          <ul>
            <li>Mat boards</li>
            <li>Backing boards</li>
            <li>Mounting corners</li>
            <li>Interleaving papers</li>
          </ul>

          <p>
            Use PAT-certified materials for all valuable photography: fine art prints, historical images, family photographs.
          </p>

          <h2 data-testid="heading-museum-standards">Museum and Library of Congress Standards</h2>

          <p>
            Museum standards are the highest preservation requirements in the industry, developed through decades of conservation research.
          </p>

          <p><strong>Core museum requirements:</strong></p>
          <ul>
            <li>Archival, lignin-free mat boards with 3% alkaline buffering (or unbuffered for acid-sensitive materials)</li>
            <li>Reversible mounting using wheat starch paste or archival photo corners</li>
            <li>UV-filtering glazing blocking 97%+ harmful radiation</li>
            <li>Sealed backing preventing dust, insects, and pollutants</li>
            <li>Proper spacing between artwork and glazing to prevent moisture transfer</li>
          </ul>

          <p><strong>Library of Congress additions:</strong></p>
          <ul>
            <li>Temperature: 65-70°F</li>
            <li>Humidity: 30-50%</li>
            <li>Low-light display (50 lux max for sensitive materials)</li>
            <li>Regular condition monitoring</li>
            <li>Documentation of all treatments</li>
          </ul>

          <p>
            You probably can't control temperature and humidity like a museum. But you can use professional-grade materials, which dramatically extends artwork lifespan.
          </p>

          <h2 data-testid="heading-material-specs">Material Specifications for Archival Preservation</h2>

          <p>
            Conservation materials must meet measurable technical standards.
          </p>

          <p><strong>Mat board requirements:</strong></p>
          <ul>
            <li>pH 7.0-8.5 (tested via cold water extraction)</li>
            <li>Maximum 1% lignin content</li>
            <li>Minimum 3% alkaline reserve (buffered grades)</li>
          </ul>

          <p><strong>Common mistake:</strong></p>
          <p>
            Using conservation mat boards with standard cardboard backing. Acids migrate from backing into artwork. Conservation requires archival materials throughout the entire assembly.
          </p>

          <p><strong>Mounting materials (reversible adhesives only):</strong></p>
          <ul>
            <li><strong>Wheat starch paste:</strong> Completely reversible with water. Archival standard.</li>
            <li><strong>Gummed linen tape:</strong> Wheat starch adhesive on archival linen fabric.</li>
            <li><strong>Archival mounting corners:</strong> No adhesive contact. Gold standard for valuable photos and documents.</li>
          </ul>

          <h2 data-testid="heading-timeline-comparison">Long-Term Preservation Timeline Comparisons</h2>

          <p><strong>Standard framing:</strong></p>
          <ul>
            <li><strong>10-20 years:</strong> Visible yellowing, "mat burn" discoloration</li>
            <li><strong>30-50 years:</strong> Brittleness, mat boards fragmenting, fading, acid damage</li>
          </ul>

          <p><strong>Conservation framing:</strong></p>
          <ul>
            <li><strong>100+ years:</strong> Minimal degradation beyond natural aging</li>
            <li>Museums display 200+ year old documents in conservation frames with excellent condition</li>
          </ul>

          <p><strong>The math:</strong></p>
          <p>
            Conservation materials cost 20-40% more. They last 5-10x longer.
          </p>

          <p>
            A $5,000 limited edition photograph in standard framing suffers irreversible damage in 20-30 years. The same photograph in conservation framing stays excellent for a century or more.
          </p>

          <p>
            The premium becomes negligible compared to replacement value.
          </p>

          <h2 data-testid="heading-required-vs-optional">When Conservation Framing is Required vs. Optional</h2>

          <p><strong>Use conservation framing (required):</strong></p>
          <ul>
            <li>Original artwork by recognized artists</li>
            <li>Limited edition prints with significant value</li>
            <li>Historical documents and ephemera</li>
            <li>Archival photographs, family heritage images</li>
            <li>Museum and gallery collections</li>
            <li>Signed memorabilia and autographs</li>
            <li>Diplomas and certificates with long-term importance</li>
            <li>Heirloom textiles and fabrics</li>
          </ul>

          <p><strong>Use conservation framing (recommended):</strong></p>
          <ul>
            <li>Replaceable commercial posters with long-term display plans</li>
            <li>Decorative art with moderate value</li>
            <li>Children's artwork being permanently preserved</li>
            <li>Any framed items displayed for 20+ years</li>
          </ul>

          <p><strong>Standard framing acceptable:</strong></p>
          <ul>
            <li>Temporary displays (1-5 years)</li>
            <li>Rental property décor, student housing</li>
            <li>Commercial posters easily replaced</li>
            <li>Seasonal decorations and rotating displays</li>
          </ul>

          <p>
            Balance item value, replaceability, and expected display duration.
          </p>

          <h2 data-testid="heading-faq">Questions we hear most</h2>

          <div className="space-y-6 my-8">
            <div>
              <h3 className="text-xl font-semibold mb-2" data-testid="heading-faq-what-is">What is conservation framing?</h3>
              <p>
                Conservation framing uses archival materials to protect artwork from damage for 100+ years. Key features: archival and lignin-free mat boards, neutral pH mounting materials, and reversible techniques. Materials meet Library of Congress standards and pass the Photographic Activity Test (PAT) per ISO 18916.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2" data-testid="heading-faq-acid-free">What does archival mean in picture framing?</h3>
              <p>
                Archival means neutral or alkaline pH (7.0+) with no acidic compounds that cause yellowing. Wood pulp contains acids that migrate into artwork, creating brown "mat burn." Archival boards use purified cotton fibers or treated wood pulp, buffered with calcium carbonate to neutralize environmental acids.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2" data-testid="heading-faq-lignin">Why is lignin-free construction important?</h3>
              <p>
                Lignin oxidizes and becomes acidic when exposed to light and air, causing yellowing. Even if acids are removed initially, residual lignin keeps generating new acids over time. Lignin-free boards use purified cotton or chemically processed wood pulp with lignin completely removed for 100+ year stability.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2" data-testid="heading-faq-pat">What is the Photographic Activity Test (PAT)?</h3>
              <p>
                PAT (ISO 18916) determines if framing materials will react with photographic emulsions. The test uses accelerated aging (elevated temperature and humidity) to check for staining, fading, or chemical changes. Materials must show zero detectable changes to pass. Critical for valuable photography.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2" data-testid="heading-faq-required">When is conservation framing required versus optional?</h3>
              <p>
                Required for irreplaceable items: original artwork, limited editions, historical documents, family photographs, museum collections, signed memorabilia. Recommended for replaceable items with long-term display plans. Standard framing acceptable for temporary displays (1-5 years) and easily replaced items.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2" data-testid="heading-faq-preservation">How long does conservation framing preserve artwork?</h3>
              <p>
                Conservation framing preserves artwork for 100+ years with minimal degradation. Museums display 200+ year old documents in conservation frames with excellent condition. Standard framing yellows in 10-20 years and becomes brittle in 30-50 years. Conservation lasts 5-10x longer.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2" data-testid="heading-faq-museum">What are museum framing standards?</h3>
              <p>
                Professional framing standards require: archival, lignin-free mats with 3% alkaline buffering; reversible mounting (wheat starch paste or photo corners); framer's grade acrylic (97%+ protection); sealed backing against dust and insects; proper artwork-to-glazing spacing. Guidelines from AIC, Library of Congress, ICOM.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2" data-testid="heading-faq-buffering">What is pH buffering in mat boards?</h3>
              <p>
                Buffering adds alkaline reserves (3% calcium carbonate) to neutralize environmental acids over time. Maintains pH 7.0-8.5 despite atmospheric pollutants. Standard for most conservation work. Exception: certain photos (albumen prints, cyanotypes) need unbuffered boards at exactly pH 7.0.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <Card className="my-12 bg-muted" data-testid="card-cta-conservation">
            <CardHeader>
              <CardTitle className="text-2xl">Design Your Conservation Mat Now</CardTitle>
              <CardDescription className="text-base">
                Apply conservation framing principles with our professional mat designer. Choose from 46 professional-grade, 
                archival mat colors with precision cutting and archival materials throughout.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              <Link href="/designer" data-testid="link-cta-mat-designer">
                <Button size="lg" data-testid="button-cta-mat-designer">
                  Mat Board Designer
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/designer" data-testid="link-cta-collage-designer">
                <Button size="lg" variant="outline" data-testid="button-cta-collage-designer">
                  Collage Frame Designer
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Related Articles */}
          <div className="mt-16 pt-8 border-t">
            <h2 className="text-2xl font-bold mb-6" data-testid="heading-related">Related Resources</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/resources/mat-color-selection-guide" data-testid="link-related-color">
                <Card className="hover-elevate h-full" data-testid="card-related-color">
                  <CardHeader>
                    <CardTitle className="text-lg">Mat Color Selection Guide</CardTitle>
                    <CardDescription>
                      Professional color theory for choosing mat colors that enhance artwork presentation
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
              <Link href="/resources/professional-mounting-techniques" data-testid="link-related-mounting">
                <Card className="hover-elevate h-full" data-testid="card-related-mounting">
                  <CardHeader>
                    <CardTitle className="text-lg">Professional Mounting Techniques</CardTitle>
                    <CardDescription>
                      Reversible mounting methods including hinge mounting and photo corners
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
              <Link href="/resources/mat-board-vs-mounting-board" data-testid="link-related-comparison">
                <Card className="hover-elevate h-full" data-testid="card-related-comparison">
                  <CardHeader>
                    <CardTitle className="text-lg">Mat Board vs. Mounting Board</CardTitle>
                    <CardDescription>
                      Understanding different backing materials and their conservation applications
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
