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


import { Frame, ArrowRight } from 'lucide-react';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';

export default function StandardVsShadowboxFrames() {
  useScrollToTop();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What are the most common standard picture frame sizes?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The most common standard frame sizes include 4×6, 5×7, 8×10, 11×14, 16×20, 18×24, 24×36, and 27×40 inches. These dimensions correspond to standard photographic print sizes established by the photo industry. Small formats (4×6 to 8×10) suit family photos and small prints. Medium formats (11×14 to 18×24) accommodate artistic prints and portraits. Large formats (24×36 and above) are used for posters, fine art prints, and statement pieces."
        }
      },
      {
        "@type": "Question",
        "name": "When should I choose custom frame sizes instead of standard sizes?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Choose custom frame sizes when you have non-standard artwork dimensions, vintage posters with unique measurements, original paintings on irregular canvases, specific mat border width requirements, or when coordinating multiple frames in a gallery wall with precise spacing. Custom sizing ensures your artwork displays properly without forcing it into incorrect dimensions that create excessive borders or require trimming valuable pieces."
        }
      },
      {
        "@type": "Question",
        "name": "Are custom frames more expensive than standard sizes?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "At ShadowboxFrames, custom frames use the same per-square-inch pricing as standard sizes, there's no premium for custom dimensions. Traditional frame shops often charge 20-40% more for custom work due to manual cutting and individual production. Our precision manufacturing system produces any size from 4×4 to 48×72 inches at consistent pricing, with similar production timeframes regardless of whether you select standard or custom dimensions."
        }
      },
      {
        "@type": "Question",
        "name": "What is the ISO A-series sizing system?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The ISO A-series represents the international standard paper size system used globally except in North America. Based on a 1:√2 aspect ratio, the series includes A4 (8.3×11.7 inches), A3 (11.7×16.5 inches), A2 (16.5×23.4 inches), A1 (23.4×33.1 inches), and A0 (33.1×46.8 inches). Each size is exactly half the area of the next larger size. European artwork, international posters, and technical drawings often use A-series dimensions, requiring custom framing in the North American market."
        }
      },
      {
        "@type": "Question",
        "name": "Can I frame panoramic artwork in standard frames?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Panoramic artwork typically requires custom framing because standard frame proportions don't accommodate extreme aspect ratios. Common panoramic dimensions include 10×30, 12×36, 16×48, and 20×60 inches. While some manufacturers offer limited panoramic standard sizes (typically 12×36), most panoramic photography, smartphone panoramas, and landscape artwork need custom frame dimensions to display properly without excessive matting or awkward proportions."
        }
      },
      {
        "@type": "Question",
        "name": "What frame sizes do professional photographers use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Professional photographers primarily use standard sizes that match common print dimensions: 8×10 and 8×12 for portraits, 11×14 and 16×20 for display prints, 20×24 and 24×30 for gallery work, and 30×40 or larger for fine art photography. However, many professionals also use custom sizes to achieve specific aspect ratios (such as 1:1 square, 4:5 portrait, or 16:9 widescreen) or to accommodate mat borders that follow the rule of thirds for optimal presentation."
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
        <Breadcrumb className="mb-8" data-testid="breadcrumb-frame-sizes">
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
              <BreadcrumbPage>Standard vs. ShadowboxFrames</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Hero Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Frame className="w-10 h-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold" data-testid="heading-main">
              Standard vs. ShadowboxFrames
            </h1>
          </div>
          <p className="text-xl text-muted-foreground leading-relaxed" data-testid="text-hero-description">
            Complete reference guide to picture frame dimensions. Learn the differences between standard industry sizes 
            and custom framing options, with comprehensive size charts, international standards, and professional guidance 
            for selecting optimal frame dimensions for any artwork.
          </p>
        </div>

        {/* Main Content */}
        <article className="prose prose-slate dark:prose-invert max-w-none">
          <h2 data-testid="heading-history">Introduction: History of Standardized Frame Dimensions</h2>
          
          <p>
            Standard picture frame sizes emerged from the photographic industry's need for consistent print dimensions 
            during the late 19th and early 20th centuries. As photography transitioned from custom daguerreotypes to 
            mass-market gelatin silver prints, manufacturers established common print sizes based on paper manufacturing 
            capabilities and efficient material usage. The 4×6 inch print size, still ubiquitous today, derives from 
            quarter-plate camera formats and optimized paper cutting from standard sheet stock.
          </p>

          <p>
            These photographic standards influenced frame manufacturing, creating an ecosystem where pre-cut mats, 
            standard glass sizes, and volume-produced moldings reduced costs through economies of scale. Frame manufacturers 
            adopted the most common print dimensions, 4×6, 5×7, 8×10, 11×14, 16×20, and 24×36 inches, as their standard 
            offerings. This standardization benefited consumers through lower prices and wider availability while constraining 
            artwork that didn't conform to these predetermined dimensions.
          </p>

          <p>
            The relationship between paper sizes and frame dimensions extends beyond photography. The printing industry's 
            adoption of specific sheet sizes (such as 8.5×11 inch letter paper in North America) created corresponding 
            frame demands. Similarly, the poster industry established 18×24 and 24×36 inches as standard dimensions for 
            commercial printing, influencing frame manufacturing. These interrelated standards created a self-reinforcing 
            system where artwork conformed to available frame sizes, and frames accommodated prevalent artwork dimensions.
          </p>

          <p>
            Custom framing existed alongside standard sizes throughout this history, serving clients with non-standard 
            artwork, original paintings, vintage pieces, and premium presentation requirements. Traditional custom framing 
            involved manual measurement, individual mat cutting, and custom-cut frame moldings, creating significant price 
            premiums. Modern precision manufacturing and digital production systems have dramatically reduced these cost 
            differences, making custom dimensions accessible at prices approaching standard frame costs.
          </p>

          <h2 data-testid="heading-size-chart">Complete Standard Size Chart</h2>

          <p>
            Standard frame sizes fall into distinct categories based on their typical applications and artwork types. 
            Understanding these categories helps identify appropriate dimensions for different framing projects while 
            recognizing when custom sizes better serve specific requirements.
          </p>

          <p>
            <strong>Small Formats (4×6 to 8×10 inches):</strong> These dimensions accommodate family photographs, small 
            prints, and personal memorabilia. The 4×6 inch format matches standard photo lab prints and smartphone photo 
            aspect ratios (2:3). The 5×7 inch size provides slightly more presence while maintaining compact proportions 
            suitable for desks and small wall spaces. The 8×10 inch dimension represents the most popular general-purpose 
            frame size, accommodating school portraits, professional headshots, and medium-sized art prints. Small formats 
            typically use 2 to 2.5 inch mat borders when matted, though many display photographs directly without mats.
          </p>

          <p>
            <strong>Medium Formats (11×14 to 18×24 inches):</strong> Medium sizes serve artistic prints, certificate display, 
            and prominent photographic work. The 11×14 inch dimension accommodates 8×10 artwork with standard 1.5 to 2 inch 
            mat borders, making it extremely popular for matted photography. The 16×20 inch size represents a significant 
            visual presence suitable for living room and office display, commonly used for matted 11×14 prints or direct 
            display of 16×20 photographs. The 18×24 inch format matches small poster dimensions and provides substantial 
            impact for fine art prints. Medium formats generally use 2.5 to 3.5 inch mat borders, following the rule of 
            thirds for professional proportions.
          </p>

          <p>
            <strong>Large Formats (24×36 to 40×60 inches):</strong> Large dimensions accommodate posters, fine art prints, 
            and statement pieces requiring significant wall space. The 24×36 inch size represents the most common poster 
            dimension globally, used for movie posters, commercial prints, and large-format photography. The 27×40 inch 
            format specifically serves movie one-sheet posters (the standard theatrical poster size). Dimensions of 30×40 
            inches and larger typically frame original artwork, canvas prints, or premium photography intended as focal 
            points in residential or commercial spaces. Large formats often display without mats due to their substantial 
            size, though matted presentations may use 4 to 6 inch borders for formal gallery appearance.
          </p>

          <p>
            <strong>Square Formats (8×8 to 30×30 inches):</strong> Square frames accommodate Instagram prints, fine art 
            photography, album covers, and contemporary artwork that embraces the 1:1 aspect ratio. Common square dimensions 
            include 8×8, 10×10, 12×12, 16×16, 20×20, 24×24, and 30×30 inches. The rise of square-format social media 
            photography (particularly Instagram's original 1:1 format) has increased demand for square frame sizes. Traditional 
            fine art photography also uses square formats, notably the medium format 6×6cm negative's 1:1 ratio. Square frames 
            create balanced, modern presentations and work particularly well in grid gallery wall arrangements.
          </p>

          <p>
            <strong>Panoramic Formats (10×30 to 20×60 inches):</strong> Panoramic dimensions serve ultra-wide landscape 
            photography, smartphone panoramas, and specialty artwork. Common panoramic sizes include 10×30, 12×36, 16×48, 
            and 20×60 inches, though these dimensions have less standardization than other categories. The extreme aspect 
            ratios (ranging from 1:3 to 1:4 or wider) create dramatic horizontal emphasis suitable for landscape photography, 
            cityscape imagery, and architectural photography. Few manufacturers offer panoramic sizes as standard inventory, 
            making custom framing typically necessary for panoramic artwork.
          </p>

          <h2 data-testid="heading-standard-advantages">When to Choose Standard Sizes</h2>

          <p>
            Standard frame sizes offer distinct advantages in specific situations, particularly when cost efficiency, 
            replacement ease, and immediate availability outweigh the benefits of custom dimensions. Understanding these 
            advantages helps identify projects where standard sizes serve optimally.
          </p>

          <p>
            <strong>Cost Advantages:</strong> Traditional frame retailers offer standard sizes at lower prices than custom 
            dimensions because pre-cut mats, standard glass sheets, and volume-produced moldings reduce manufacturing costs. 
            Ready-made frames available at big-box retailers exclusively use standard dimensions, providing budget options 
            for casual framing. Pre-cut mat boards in standard sizes (such as 11×14 mats with 8×10 openings) cost significantly 
            less than custom-cut mats. However, these cost advantages apply primarily to mass-market framing; professional 
            custom frame shops increasingly use precision cutting systems that produce standard and custom sizes at similar 
            per-square-inch costs.
          </p>

          <p>
            <strong>Immediate Availability:</strong> Standard sizes stock shelves at craft stores, department stores, and 
            online retailers, enabling same-day purchases without waiting for custom production. This immediacy benefits 
            last-minute gifts, urgent project displays, and situations where framing timeline outweighs optimal sizing. 
            Replacement glass and mats for standard sizes also ship quickly from multiple suppliers, simplifying repairs 
            after damage. Custom frames typically require 1-2 week production times, though precision manufacturing has 
            shortened these timelines considerably compared to traditional 3-4 week custom frame waits.
          </p>

          <p>
            <strong>Common Applications:</strong> Standard sizes work excellently when artwork dimensions precisely match 
            standard formats. Professional photo labs print to standard sizes (4×6, 5×7, 8×10, etc.), ensuring perfect fits 
            without custom ordering. School portraits, team photos, and commercial photography typically ship in standard 
            dimensions designed for standard frames. Certificate framing often uses 8.5×11 or 11×14 frames to accommodate 
            standard document sizes. When artwork naturally conforms to standard dimensions, using matching standard frames 
            creates optimal presentation without custom sizing necessity.
          </p>

          <p>
            Standard sizes also facilitate gallery wall planning when using multiple identical frames. Purchasing six 
            11×14 frames from retail stock ensures perfect consistency in frame width, molding profile, and finish, important 
            for cohesive multi-frame displays. Mixing custom and standard sizes or using multiple custom frame vendors can 
            introduce subtle variations that disrupt visual uniformity in gallery arrangements.
          </p>

          <h2 data-testid="heading-custom-advantages">When to Choose Custom Sizes</h2>

          <p>
            Custom frame dimensions become essential when artwork doesn't conform to standard sizes or when presentation 
            requirements demand specific proportions. Modern custom framing eliminates traditional cost penalties while 
            providing precise fits that enhance artwork presentation and protect valuable pieces from improper sizing.
          </p>

          <p>
            <strong>Non-Standard Artwork Dimensions:</strong> Original paintings, hand-pulled prints, and artisan-created 
            pieces rarely conform to photographic standard sizes. A painting measuring 14×18 inches won't fit properly in 
            an 11×14 frame (too small) or 16×20 frame (too large with excessive borders). Custom framing this piece at 
            20×24 inches with 3 inch mat borders creates professional presentation matching the rule of thirds, whereas 
            forcing it into 16×20 standard dimensions produces cramped 1 inch borders that appear budget-quality. Original 
            artwork justifies custom framing investment to ensure optimal presentation.
          </p>

          <p>
            <strong>Vintage Posters and International Formats:</strong> Vintage concert posters, European movie posters, 
            and international print dimensions often use non-standard measurements. A vintage 1960s concert poster measuring 
            14×22 inches requires custom framing since no standard size accommodates these proportions without excessive 
            matting or trimming (which destroys value). International artwork using ISO A-series dimensions (A4, A3, A2) 
            similarly needs custom frames, an A3 print measuring 11.7×16.5 inches doesn't fit standard North American frame 
            sizes designed around different aspect ratios.
          </p>

          <p>
            <strong>Specific Mat Border Requirements:</strong> Professional presentation often requires mat borders following 
            the rule of thirds (border width equals one-third of artwork's smallest dimension). An 11×14 print following this 
            formula needs 3.67 inch borders, creating approximately 18.3×21.3 inch frame dimensions, not available in standard 
            sizes. Custom framing at 18×21 or 19×22 inches achieves proper proportions, whereas forcing the artwork into 
            16×20 standard frames requires inadequate 2.5 inch borders that appear cramped. Gallery-quality presentation 
            typically demands custom dimensions to achieve mathematically correct border proportions.
          </p>

          <p>
            <strong>Gallery Wall Coordination:</strong> Designing gallery walls with intentional spacing and visual rhythm 
            often requires custom frame dimensions to create specific relationships between pieces. A gallery wall might use 
            20×24, 16×20, and 12×16 inch frames to establish proportional stepping rather than limiting designs to available 
            standard sizes. Custom dimensions enable precise control over negative space, visual weight distribution, and 
            compositional balance, critical factors in professional gallery wall design that standard sizes may not accommodate.
          </p>

          <h2 data-testid="heading-manufacturing">Our Manufacturing Capabilities</h2>

          <p>
            Modern precision manufacturing eliminates traditional distinctions between standard and custom frame production, 
            enabling consistent quality and pricing across all dimensions within our production range. Understanding our 
            capabilities helps customers make informed decisions without artificial constraints imposed by outdated manufacturing 
            limitations.
          </p>

          <p>
            <strong>Size Range: 4×4 to 48×72 inches:</strong> Our production systems accommodate any rectangular dimension 
            from 4×4 inches (minimum) to 48×72 inches (maximum), with both dimensions fully variable within this range. 
            You can order a 13.25×19.75 inch frame as easily as a standard 11×14 frame, the manufacturing process remains 
            identical. This range covers approximately 95% of residential and commercial framing requirements, from small 
            memorabilia to large-format fine art prints. Dimensions exceeding 48×72 inches require specialty framing due 
            to glazing weight, structural requirements, and shipping constraints.
          </p>

          <p>
            <strong>Precision: 1/8 Inch Increments:</strong> Our computer-controlled cutting systems measure and cut to 
            1/8 inch precision (0.125 inches), ensuring accurate fits and professional appearance. This precision level 
            matches professional framing standards while exceeding mass-market frame tolerances. Customers can specify 
            dimensions like 14.375×18.5625 inches if calculations demand such precision, though most round to nearest 1/8 
            or 1/4 inch for practical purposes. The 1/8 inch tolerance ensures artwork fits properly with appropriate 
            reveal and that mats align correctly with frame rabbets.
          </p>

          <p>
            <strong>Consistent Pricing Structure:</strong> Unlike traditional custom frame shops that charge premiums for 
            non-standard sizes, our pricing calculates based on total frame perimeter and selected materials, standard and 
            custom sizes use identical per-inch rates. An 11×14 frame (50 inch perimeter) and a 12×13 frame (50 inch perimeter) 
            cost identically despite one being standard and one custom. This pricing transparency eliminates the penalty 
            historically associated with custom dimensions, encouraging customers to select optimal sizes for their artwork 
            rather than compromising for lower custom-frame surcharges.
          </p>

          <p>
            <strong>Production Timeframes:</strong> Standard and custom frames ship within similar timeframes, typically 5-10 
            business days for most orders regardless of dimensions. Our automated production systems cut standard 11×14 frames 
            and custom 13.75×17.25 frames in the same manufacturing run without time penalties. This contrasts with traditional 
            custom framing where standard sizes ship immediately from inventory while custom orders require 2-4 week production 
            waits. Modern manufacturing eliminates these delays, providing custom dimensions without timeline compromises.
          </p>

          <h2 data-testid="heading-international">International Size Standards</h2>

          <p>
            International artwork, imported prints, and European posters frequently use dimension standards that differ from 
            North American conventions, requiring custom framing in the U.S. market. Understanding these international standards 
            helps identify artwork requiring custom dimensions and explains why certain pieces don't fit standard American frames.
          </p>

          <p>
            <strong>ISO A-Series Paper Sizes:</strong> The ISO 216 standard defines the international paper size system used 
            globally except in North America. Based on a 1:√2 (approximately 1:1.414) aspect ratio, this system creates 
            mathematical relationships where each size is exactly half the area of the next larger size. The A-series progression 
            includes A5 (5.8×8.3 inches), A4 (8.3×11.7 inches), A3 (11.7×16.5 inches), A2 (16.5×23.4 inches), A1 (23.4×33.1 
            inches), and A0 (33.1×46.8 inches). European artwork, technical drawings, and international prints commonly use 
            A-series dimensions, requiring custom framing since standard American frame sizes follow different aspect ratios.
          </p>

          <p>
            The 1:√2 aspect ratio creates elegant mathematical properties, folding an A-series sheet in half produces the next 
            smaller size in the series while maintaining the same proportions. This consistency benefits printing and document 
            reproduction but creates framing challenges in North America where frames follow photographic aspect ratios (2:3, 
            4:5, etc.) incompatible with the 1:√2 ratio. An A4 print (8.3×11.7 inches) won't fit properly in an 8×10 frame 
            (different aspect ratio) or 8.5×11 frame (slightly too small), necessitating custom framing.
          </p>

          <p>
            <strong>European Poster Dimensions:</strong> European poster standards often use metric dimensions that convert 
            to non-standard inch measurements. Common European poster sizes include A2 (420×594mm = 16.5×23.4 inches), A1 
            (594×841mm = 23.4×33.1 inches), and B1 (707×1000mm = 27.8×39.4 inches). Movie posters in European markets may 
            use these dimensions rather than the American 27×40 inch one-sheet standard. Vintage European concert posters 
            and advertising prints similarly follow metric-based dimensions requiring custom framing for proper presentation.
          </p>

          <p>
            <strong>Japanese Print Formats:</strong> Traditional Japanese woodblock prints (ukiyo-e) use dimensions based 
            on Japanese paper manufacturing standards, typically measured in centimeters or the traditional shaku system. 
            Common formats include chūban (approximately 7×10 inches), ōban (approximately 10×15 inches), and various hashira-e 
            (pillar print) dimensions that are extremely vertical. These traditional sizes rarely align with Western standard 
            frames, requiring custom dimensions. Contemporary Japanese art prints may follow international standards, but 
            traditional and vintage Japanese prints almost universally need custom framing.
          </p>

          <h2 data-testid="heading-professional-use">Professional Use Cases</h2>

          <p>
            Different professional contexts prioritize standard versus custom frame sizes based on workflow requirements, 
            client expectations, and presentation standards. Understanding professional framing practices across various 
            industries helps inform appropriate size selection for different applications.
          </p>

          <p>
            <strong>Photography Studios:</strong> Professional photographers typically standardize their print offerings around 
            common frame sizes to simplify client ordering and maintain consistent product lines. Portrait studios might offer 
            8×10, 11×14, and 16×20 prints exclusively, knowing clients can easily find frames at retail. Wedding photographers 
            often provide 16×20 or 20×24 prints for wall display, using standard dimensions that balance impact with reasonable 
            costs. However, fine art photographers increasingly use custom dimensions to achieve specific aspect ratios, 1:1 
            square for formal compositions, 4:5 for classic portrait proportions, or 16:9 for cinematic landscape work. These 
            custom aspect ratios require custom framing but enable artistic vision unconstrained by standard size limitations.
          </p>

          <p>
            <strong>Art Galleries:</strong> Gallery presentation heavily favors custom framing because original artwork rarely 
            conforms to standard dimensions. A gallery framing a 22×30 inch watercolor will specify custom 28×36 inch frame 
            dimensions (assuming 3 inch mat borders) rather than forcing the work into ill-fitting 24×36 standard frames with 
            improper 1×3 inch borders. Gallery standards prioritize optimal presentation over cost savings, using custom 
            dimensions, professional-grade materials, and professional-grade glazing. The rule of thirds guides gallery mat border 
            calculations, typically requiring custom frame dimensions to achieve proper proportions. Gallery walls coordinate 
            multiple custom-sized pieces with intentional spacing and visual rhythm rather than limiting exhibitions to standard-sized 
            frames.
          </p>

          <p>
            <strong>Commercial Displays:</strong> Commercial environments (corporate offices, retail spaces, restaurants, hotels) 
            use both standard and custom sizes depending on procurement processes and design requirements. Large commercial 
            projects may standardize on limited frame sizes (such as 18×24 and 24×36 inches) to simplify ordering, installation, 
            and future replacement. However, custom commercial installations often specify exact dimensions to fit architectural 
            features, match corporate branding requirements, or create cohesive design schemes. Healthcare facilities frequently 
            use custom sizes to accommodate patient artwork programs, donor recognition displays, and wayfinding graphics with 
            specific dimensional requirements. Trade show graphics and retail point-of-purchase displays commonly require custom 
            sizes matching brand guidelines and display fixture specifications.
          </p>

          <p>
            <strong>Residential Collections:</strong> Home collectors accumulate artwork gradually, typically mixing standard 
            and custom frames based on individual piece requirements. Family photo walls might use consistent 8×10 or 11×14 
            frames throughout for visual uniformity, taking advantage of standard size availability and cost efficiency. However, 
            collecting original artwork, vintage posters, or international prints necessitates custom framing to accommodate 
            non-standard dimensions. Serious collectors prioritize proper presentation and conservation over cost savings, 
            using custom dimensions with appropriate mat borders and professional-grade materials. Gallery walls in residential 
            settings increasingly use custom sizes to achieve specific design visions rather than constraining layouts to 
            available standard frame inventory.
          </p>
        </article>

        {/* CTA Section */}
        <Card className="my-12" data-testid="card-cta">
          <CardHeader>
            <CardTitle>Design Your Custom Frame</CardTitle>
            <CardDescription>
              Create frames in any size from 4×4 to 48×72 inches with our interactive designer. 
              Standard and custom sizes at the same great prices.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/picture-frames">
              <Button size="lg" data-testid="button-design-frame">
                Start Designing
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Related Resources */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6" data-testid="heading-related">Related Resources</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/resources/poster-frame-sizes-guide">
              <Card className="hover-elevate h-full" data-testid="card-related-posters">
                <CardHeader>
                  <CardTitle>Poster Frame Sizes Guide</CardTitle>
                  <CardDescription>
                    Complete guide to framing movie posters, concert prints, and commercial posters. 
                    Includes standard dimensions, preservation techniques, and sizing for vintage pieces.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
            <Link href="/resources/border-width-proportions">
              <Card className="hover-elevate h-full" data-testid="card-related-borders">
                <CardHeader>
                  <CardTitle>Mat Border Width & Proportions</CardTitle>
                  <CardDescription>
                    Professional guide to calculating perfect mat border widths using the rule of thirds 
                    and proportional scaling formulas for different artwork sizes.
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
