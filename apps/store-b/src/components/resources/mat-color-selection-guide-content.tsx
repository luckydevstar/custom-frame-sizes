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


import { Palette, ArrowRight } from 'lucide-react';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';

export default function MatColorSelectionGuide() {
  useScrollToTop();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do I choose the right mat color for my artwork?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Choose mat colors by identifying dominant colors in your artwork and selecting either complementary colors (opposite on color wheel) for visual tension or analogous colors (adjacent on color wheel) for harmony. Neutral whites and off-whites work universally and emphasize artwork over mat. Consider the room's décor, lighting conditions, and whether you want the mat to recede (neutrals) or enhance (coordinated colors). For photography, match mat undertones (warm/cool) to the photo's color temperature."
        }
      },
      {
        "@type": "Question",
        "name": "Should I use white or off-white mat board?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "White mat boards (bright white, polar white) provide maximum contrast and work well with contemporary art, black-and-white photography, and modern décor. Off-white mat boards (cream, antique white, natural white) offer softer presentation with less harsh contrast, ideal for vintage photographs, watercolors, traditional artwork, and warm-toned interiors. Off-whites prevent the 'floating' effect that bright white mats can create with certain artwork. Consider your artwork's age, style, and the room's color temperature."
        }
      },
      {
        "@type": "Question",
        "name": "When should I use black mat boards?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Black mat boards create dramatic, gallery-style presentations ideal for contemporary photography, graphic art, colorful artwork requiring strong framing, and exhibition displays. Black mats increase perceived contrast and make colors appear more vibrant. Use black mats with adequate border width (minimum 3 inches) to prevent overwhelming small artwork. Black works particularly well with silver or metallic frames and in modern, minimalist interiors. Avoid black mats with delicate watercolors or subtle pastels where softer neutrals work better."
        }
      },
      {
        "@type": "Question",
        "name": "What are the best double mat color combinations?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Classic double mat combinations include: white top mat with cream or black reveal for subtle depth; neutral top mat with colored reveal matching artwork accent colors; dark top mat (charcoal, navy) with white reveal for contemporary contrast; and complementary color pairs where top mat coordinates with artwork dominant color while reveal uses complementary color. The reveal should be 1/8 to 1/4 inch wide, enough to create visual interest without overwhelming. Test combinations by placing mat samples against artwork before cutting."
        }
      },
      {
        "@type": "Question",
        "name": "How do warm and cool undertones affect mat color selection?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Undertones dramatically affect mat appearance. Warm undertones (yellow, red, orange bases) work with golden-hour photography, earth-tone artwork, and traditional interiors. Cool undertones (blue, green bases) complement modern photography, cool-palette artwork, and contemporary spaces. Mismatched undertones create visual discord, cool mats with warm artwork appear grayish and lifeless. Examine mat samples under your actual lighting conditions as undertones shift dramatically between daylight, incandescent, and LED lighting."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use colored mat boards for fine art framing?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Colored mat boards work excellently for fine art when thoughtfully selected. Use colors that appear in the artwork to create cohesion, employ analogous colors for harmonious presentation, or select complementary colors for visual interest. Avoid overly saturated colors that compete with artwork, muted, sophisticated tones work best. Colored mats particularly enhance watercolors, pastels, and limited-palette artwork. Professional framers often use colored mats for children's art, decorative prints, and themed collections while reserving neutrals for photography and formal portraits."
        }
      },
      {
        "@type": "Question",
        "name": "What are common mat color selection mistakes?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Common mistakes include: choosing mat colors in store lighting rather than home lighting (colors shift dramatically); selecting saturated colors that overpower subtle artwork; mismatching undertones (cool mats with warm artwork); using insufficient border width with dark mats (causing visual heaviness); choosing trendy colors over timeless neutrals for valuable art; and making selections without testing samples against actual artwork. Always view mat samples next to your artwork under your home's lighting before final decisions."
        }
      },
      {
        "@type": "Question",
        "name": "How does mat color affect artwork appearance?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Mat color profoundly affects artwork perception through simultaneous contrast, colors appear different depending on surrounding colors. Light mats make artwork colors appear darker and more saturated. Dark mats increase perceived brightness and contrast. Colored mats enhance colors similar to the mat while suppressing complementary colors. Mat color also affects perceived artwork size: light mats make artwork appear larger, dark mats create intimate, focused presentations. Professional framers use these optical effects deliberately to enhance artwork impact."
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
        <Breadcrumb className="mb-8" data-testid="breadcrumb-color-guide">
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
              <BreadcrumbPage>Mat Color Selection Guide</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Hero Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Palette className="w-10 h-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold" data-testid="heading-main">
              Mat Board Color Selection Guide
            </h1>
          </div>
          <p className="text-xl text-muted-foreground leading-relaxed" data-testid="text-hero-description">
            Professional color theory for picture framing. Master the art of choosing mat colors that enhance artwork 
            presentation while understanding undertones, color relationships, and visual perception.
          </p>
        </div>

        {/* Main Content */}
        <article className="prose prose-slate dark:prose-invert max-w-none">
          <h2 data-testid="heading-color-theory-basics">Color Theory Basics for Picture Framing</h2>
          
          <p>
            Mat board color selection applies fundamental color theory principles to enhance artwork presentation while 
            respecting the artist's original intent. The mat serves as a transitional element between artwork and frame, 
            mediating visual relationships and directing viewer attention. Professional framers understand that mat color 
            choices create optical effects through simultaneous contrast, colors appear different depending on adjacent colors.
          </p>

          <p>
            The color wheel organizes hues into logical relationships: primary colors (red, yellow, blue) mix to create 
            secondary colors (orange, green, purple), which blend to form tertiary colors. These relationships inform mat 
            selection strategies. Complementary colors sit opposite on the color wheel (red/green, blue/orange, yellow/purple), 
            creating visual tension and vibrancy. Analogous colors sit adjacent (blue, blue-green, green), producing harmonious, 
            calming presentations.
          </p>

          <p>
            Beyond hue, framers must consider value (lightness/darkness) and saturation (color intensity). Light-value mats 
            make artwork appear darker and more saturated through contrast. Dark-value mats increase perceived artwork 
            brightness. Highly saturated mat colors compete with artwork, while muted, sophisticated tones allow art to 
            dominate. Professional mat selection balances these elements to enhance rather than overwhelm.
          </p>

          <h2 data-testid="heading-neutral-whites">Neutral Whites and Off-Whites Guide</h2>

          <p>
            White and off-white mat boards constitute 70-80% of professional framing because neutral colors work universally, 
            emphasizing artwork over mat. However, "white" encompasses significant variation, from cool, bright whites with 
            blue undertones to warm, creamy whites with yellow undertones. Understanding these nuances prevents mismatches 
            that create subtle visual discord.
          </p>

          <p>
            Bright white mat boards (polar white, super white) provide maximum contrast and crisp, contemporary presentation. 
            These work excellently with: black-and-white photography where stark contrast enhances tonal range; contemporary 
            art with bold colors; graphic design and digital art; and modern, minimalist interiors. Bright whites can appear 
            harsh with vintage photographs or delicate watercolors, creating excessive contrast that fights the artwork.
          </p>

          <p>
            Off-white mat boards (cream, antique white, natural white, eggshell) offer softer presentation with subdued contrast. 
            These excel with: vintage photographs where aging paper has developed patina; watercolors and pastels requiring 
            gentle framing; traditional artwork and historical documents; and warm-toned interiors with earth-tone décor. 
            Off-whites prevent the "floating" effect that bright white mats can create, where strong contrast makes artwork 
            appear to hover uncomfortably against the background.
          </p>

          <h2 data-testid="heading-black-dark-mats">Black and Dark Mats Applications</h2>

          <p>
            Black mat boards create dramatic, gallery-style presentations that increase perceived contrast and make colors 
            appear more vibrant through optical effects. Black works particularly well with: contemporary photography where 
            strong framing emphasizes subject matter; colorful artwork benefiting from bold containment; graphic art and 
            modern illustrations; and exhibition displays requiring professional presentation.
          </p>

          <p>
            When using black mats, border width becomes critical. Minimum 3-inch borders prevent overwhelming small artwork, 
            insufficient borders create visual heaviness where the mat dominates rather than enhances. Black mats also reveal 
            dust more readily than lighter colors, requiring more frequent cleaning under glazing. Consider dark charcoal or 
            navy as alternatives providing similar drama with slightly more forgiving maintenance.
          </p>

          <p>
            Black mats pair exceptionally well with metallic frames (silver, brushed aluminum) and work beautifully in modern, 
            minimalist interiors. Avoid black mats with: delicate watercolors or subtle pastels where contrast overwhelms; 
            small artwork lacking visual weight to balance strong framing; and traditional, ornate frames creating style 
            conflicts. Professional framers often use black mats for dramatic effect but recognize they demand careful 
            application.
          </p>

          <h2 data-testid="heading-color-matching">Color Matching Strategies</h2>

          <p>
            Professional color matching employs three primary strategies based on color wheel relationships. Complementary 
            color matching uses mat colors opposite artwork's dominant hue on the color wheel, orange mats with blue-dominant 
            artwork, purple mats with yellow-toned pieces. This creates visual tension and vibrancy, making both mat and 
            artwork appear more saturated. Complementary matching works well with bold, contemporary art but can overwhelm 
            subtle work.
          </p>

          <p>
            Analogous color matching selects mat colors adjacent to artwork's dominant hue, blue-green mats with blue artwork, 
            yellow-green mats with yellow pieces. This produces harmonious, calming presentations where mat and artwork blend 
            seamlessly. Analogous matching excels with: watercolors and pastels requiring gentle enhancement; monochromatic 
            artwork benefiting from tonal variation; and traditional art where cohesion trumps contrast.
          </p>

          <p>
            Extraction matching identifies accent colors within artwork and uses those for mat selection. Find minor colors 
            that complement the dominant hue, a sunset photograph with predominantly orange sky might use blue-gray mat 
            extracted from water reflections. Extraction matching creates sophisticated presentations that feel intentional 
            and coordinated while avoiding obvious color matching. This technique requires careful color selection, as 
            extracting the wrong accent can create unintended emphasis.
          </p>

          <h2 data-testid="heading-color-interaction">Mat Color and Artwork Interaction</h2>

          <p>
            Simultaneous contrast, the optical phenomenon where colors appear different based on surrounding colors, 
            fundamentally affects how viewers perceive artwork through matting. A gray square appears lighter on black 
            background than on white background, despite being identical. This effect operates continuously in framed 
            artwork, making mat color selection critical to perceived artwork appearance.
          </p>

          <p>
            Light-value mats make artwork colors appear darker and more saturated through increased contrast. This enhances 
            bold, colorful artwork but can deaden subtle pastels or light-toned pieces. Dark-value mats create the opposite 
            effect, artwork appears lighter and brighter. This lifts dark or low-contrast work but may reduce impact of 
            already-bright artwork. Understanding these effects allows framers to manipulate perceived artwork characteristics.
          </p>

          <p>
            Colored mats create complex interactions through chromatic simultaneous contrast. Warm-colored mats (reds, oranges, 
            yellows) enhance warm tones in artwork while suppressing cool tones. Cool-colored mats (blues, greens, purples) do 
            the inverse. A landscape with both warm sunlight and cool shadows will emphasize different elements depending on mat 
            color choice. Professional framers use these effects deliberately to guide viewer attention toward intended focal points.
          </p>

          <h2 data-testid="heading-double-mat-combinations">Double Mat Color Combinations</h2>

          <p>
            Double mat construction layers two mat boards with the bottom mat visible as a thin reveal (typically 1/8 to 1/4 inch), 
            adding depth and sophistication. The color combination creates visual interest while serving practical purposes, the 
            reveal prevents direct glazing contact and enhances perceived quality. Double mats represent professional-grade framing 
            preferred for valuable artwork and formal presentations.
          </p>

          <p>
            Classic double mat combinations include: white top mat with cream or off-white reveal for subtle warmth and depth; 
            white or cream top mat with black reveal for crisp, contemporary definition; neutral top mat (gray, taupe) with 
            colored reveal extracted from artwork; and dark top mat (charcoal, navy) with white reveal creating dramatic contrast. 
            These proven combinations work across diverse artwork styles and interior settings.
          </p>

          <p>
            Advanced double mat strategies use complementary color pairs, blue top mat with orange reveal, purple top with yellow 
            reveal, creating sophisticated visual tension. This technique works best with bold, contemporary artwork where strong 
            color relationships enhance impact. Alternatively, analogous combinations (blue top with blue-green reveal) produce 
            harmonious depth without dramatic contrast, ideal for watercolors and traditional art.
          </p>

          <h2 data-testid="heading-undertones">Undertones and Temperature Considerations</h2>

          <p>
            Color undertones, the subtle warm or cool bias in seemingly neutral colors, dramatically affect mat appearance and 
            artwork compatibility. A "white" mat may have warm undertones (slight yellow, pink, or cream cast) or cool undertones 
            (slight blue, gray, or green cast). These undertones become apparent when comparing samples side-by-side or viewing 
            under different lighting conditions.
          </p>

          <p>
            Matching undertones between mat and artwork prevents subtle visual discord that occurs when warm and cool tones clash. 
            Warm-undertone mats work with: golden-hour photography; earth-tone artwork; traditional paintings with warm palettes; 
            and interiors lit by incandescent bulbs. Cool-undertone mats suit: overcast photography; cool-palette artwork; 
            contemporary pieces with blue/green dominance; and spaces with natural daylight or LED lighting.
          </p>

          <p>
            Lighting conditions reveal undertones dramatically. Colors that appear neutral under store fluorescent lighting may 
            show strong warm or cool bias under home lighting. Professional framers recommend taking mat samples home and viewing 
            them next to artwork under actual display lighting, morning natural light, afternoon sun, and evening artificial light, 
            before final selection. Undertone mismatches create subtle dissatisfaction that viewers may not consciously recognize 
            but definitely perceive.
          </p>

          <h2 data-testid="heading-selection-workflow">Professional Color Selection Workflow</h2>

          <p>
            Professional framers follow systematic workflows to ensure optimal mat color selection. First, identify artwork's 
            dominant colors, accent colors, and overall temperature (warm/cool). Consider the artwork's style (contemporary, 
            traditional, modern), intended display location, and surrounding décor. Determine whether the goal emphasizes artwork 
            (neutral mats) or creates coordinated presentation (colored mats).
          </p>

          <p>
            Next, gather mat samples representing potential choices, typically 5-8 options spanning neutrals to coordinated colors. 
            Place samples against artwork edges, viewing from normal display distance (6-10 feet) rather than close inspection. 
            Eliminate obvious mismatches, then test remaining candidates under actual display lighting. Morning natural light often 
            differs dramatically from evening incandescent light, colors shift temperature significantly.
          </p>

          <p>
            For double mats, test top mat candidates first, then experiment with reveal colors. The reveal should enhance without 
            overwhelming, 1/8 inch provides subtle accent, 1/4 inch creates more dramatic definition. Take photographs of mat samples 
            against artwork and review later with fresh perspective, initial impressions may differ from considered evaluation. 
            Consult family members or clients for input, as personal color preferences vary significantly.
          </p>

          <h2 data-testid="heading-common-mistakes">Common Color Selection Mistakes</h2>

          <p>
            The most common mat color selection mistake involves choosing colors under inappropriate lighting. Store fluorescent 
            or LED lighting creates different color appearance than home incandescent, halogen, or natural lighting. Colors that 
            look perfect in the frame shop may appear wrong at home. Solution: always test mat samples under actual display lighting 
            before cutting.
          </p>

          <p>
            Selecting oversaturated colors that compete with artwork instead of enhancing it represents another frequent error. 
            Vivid, pure hues work occasionally with bold contemporary art but overwhelm most work. Muted, sophisticated tones allow 
            artwork to dominate while still providing color coordination. When uncertain, err toward less saturation, neutrals never 
            compete inappropriately.
          </p>

          <p>
            Mismatching undertones creates subtle visual discord, cool-toned mats with warm-toned artwork appear grayish and lifeless. 
            Using insufficient border width with dark mats causes visual heaviness where mat overwhelms artwork. Choosing trendy 
            colors over timeless neutrals for valuable art risks dated appearance. Making mat decisions without placing samples 
            directly against artwork under proper lighting leads to regrettable choices discovered only after cutting.
          </p>

          <h2 data-testid="heading-faq">Questions we hear most</h2>

          <div className="space-y-6 my-8">
            <div>
              <h3 className="text-xl font-semibold mb-2" data-testid="faq-question-1">How do I choose the right mat color for my artwork?</h3>
              <p>
                Choose mat colors by identifying dominant colors in your artwork and selecting either complementary colors 
                (opposite on color wheel) for visual tension or analogous colors (adjacent on color wheel) for harmony. 
                Neutral whites and off-whites work universally and emphasize artwork over mat. Consider the room's décor, 
                lighting conditions, and whether you want the mat to recede (neutrals) or enhance (coordinated colors).
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2" data-testid="faq-question-2">Should I use white or off-white mat board?</h3>
              <p>
                White mat boards (bright white, polar white) provide maximum contrast and work well with contemporary art, 
                black-and-white photography, and modern décor. Off-white mat boards (cream, antique white) offer softer 
                presentation ideal for vintage photographs, watercolors, traditional artwork, and warm-toned interiors. 
                Off-whites prevent the harsh 'floating' effect that bright white can create.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2" data-testid="faq-question-3">When should I use black mat boards?</h3>
              <p>
                Black mat boards create dramatic, gallery-style presentations ideal for contemporary photography, graphic art, 
                colorful artwork requiring strong framing, and exhibition displays. Use black mats with adequate border width 
                (minimum 3 inches) to prevent overwhelming small artwork. Black works particularly well with silver frames and 
                modern interiors. Avoid black with delicate watercolors or subtle pastels.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2" data-testid="faq-question-4">What are the best double mat color combinations?</h3>
              <p>
                Classic double mat combinations include: white top with cream or black reveal for subtle depth; neutral top 
                with colored reveal matching artwork accent colors; dark top (charcoal, navy) with white reveal for contemporary 
                contrast; and complementary color pairs where top coordinates with dominant color while reveal uses complementary 
                color. Keep reveals 1/8 to 1/4 inch wide for optimal impact.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2" data-testid="faq-question-5">How do warm and cool undertones affect mat color selection?</h3>
              <p>
                Undertones dramatically affect mat appearance. Warm undertones (yellow, red bases) work with golden-hour 
                photography, earth-tone artwork, and traditional interiors. Cool undertones (blue, green bases) complement 
                modern photography and contemporary spaces. Mismatched undertones create visual discord, cool mats with warm 
                artwork appear grayish. Examine samples under actual lighting conditions as undertones shift between different 
                light sources.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2" data-testid="faq-question-6">Can I use colored mat boards for fine art framing?</h3>
              <p>
                Colored mat boards work excellently for fine art when thoughtfully selected. Use colors appearing in the artwork, 
                analogous colors for harmony, or complementary colors for interest. Avoid oversaturated colors competing with 
                artwork, muted tones work best. Colored mats enhance watercolors, pastels, and limited-palette artwork while 
                professionals often reserve neutrals for photography and formal portraits.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2" data-testid="faq-question-7">What are common mat color selection mistakes?</h3>
              <p>
                Common mistakes include: choosing colors in store lighting rather than home lighting; selecting saturated colors 
                that overpower artwork; mismatching undertones (cool mats with warm artwork); using insufficient borders with dark 
                mats; choosing trendy over timeless colors for valuable art; and making selections without testing samples against 
                actual artwork under home lighting conditions.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2" data-testid="faq-question-8">How does mat color affect artwork appearance?</h3>
              <p>
                Mat color profoundly affects perception through simultaneous contrast. Light mats make artwork appear darker and 
                more saturated. Dark mats increase perceived brightness. Colored mats enhance similar colors while suppressing 
                complementary colors. Mat color affects perceived artwork size: light mats make art appear larger, dark mats create 
                intimate presentations. Professional framers use these optical effects deliberately.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <Card className="my-12 bg-muted" data-testid="card-cta-color">
            <CardHeader>
              <CardTitle className="text-2xl">Design Your Custom Mat Now</CardTitle>
              <CardDescription className="text-base">
                Apply professional color theory with our mat designer. Choose from 46 professional-grade mat colors with 
                real-time visualization to find the perfect color for your artwork.
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
              <Link href="/resources/border-width-proportions" data-testid="link-related-borders">
                <Card className="hover-elevate h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">Border Width & Proportions</CardTitle>
                    <CardDescription>
                      Professional border calculations and proportion guidelines for balanced presentation
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
              <Link href="/resources/common-mat-cutting-mistakes" data-testid="link-related-mistakes">
                <Card className="hover-elevate h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">Common Mat Cutting Mistakes</CardTitle>
                    <CardDescription>
                      Avoid critical errors in mat cutting and color selection
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
