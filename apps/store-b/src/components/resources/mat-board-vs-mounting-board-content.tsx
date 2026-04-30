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


import { Layers, ArrowRight } from 'lucide-react';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';

export default function MatBoardVsMountingBoard() {
  useScrollToTop();

  return (
    <>
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-8" data-testid="breadcrumb-mat-mounting">
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
              <BreadcrumbPage>Mat Board vs Mounting Board</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Hero Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Layers className="w-10 h-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold" data-testid="heading-main">
              Mat Board vs Mounting Board
            </h1>
          </div>
          <p className="text-xl text-muted-foreground leading-relaxed" data-testid="text-hero-description">
            Comprehensive guide to understanding the critical differences between mat board and mounting board in picture 
            framing. Learn construction materials, thickness standards, proper applications, and how both materials work 
            together in professional frame assemblies.
          </p>
        </div>

        {/* Main Content */}
        <article className="prose prose-slate dark:prose-invert max-w-none">
          <h2 data-testid="heading-mat-board-definition">What is Mat Board - Definition and Purpose</h2>
          
          <p>
            Mat board, also called matting or picture mat, is a specialized paperboard designed to serve as the visible border 
            surrounding artwork in picture frames. The mat creates visual separation between artwork and frame while providing 
            protective spacing that prevents artwork contact with glazing. Mat board appears in the finished frame as the colored 
            border visible through the glazing, making it a prominent aesthetic element that affects overall presentation.
          </p>

          <p>
            Professional mat board consists of multiple layers of paper laminated together to create rigid yet cuttable material. 
            The face surface (visible in the frame) features a colored or textured finish, while the core and backing layers 
            provide structural support. Beveled edges cut at 45-degree angles expose the core material, creating dimensional 
            shadow lines that enhance visual depth. Mat board thickness typically measures between 0.040 to 0.060 inches (1-ply 
            to 4-ply), with 4-ply being the professional standard.
          </p>

          <p>
            The primary purposes of mat board include: creating visual breathing room around artwork; preventing artwork contact 
            with glazing that could cause moisture transfer or sticking; providing decorative color coordination that enhances 
            artwork presentation; establishing professional proportions through border width ratios; and protecting artwork edges 
            from frame pressure. Professional-grade mat board additionally provides chemical protection through archival, 
            lignin-free construction that prevents artwork degradation over decades.
          </p>

          <h2 data-testid="heading-mounting-board-definition">What is Mounting Board - Definition and Purpose</h2>

          <p>
            Mounting board, also called backing board or foam board (when made from foam core), provides the rigid support layer 
            behind artwork in frame assemblies. Unlike mat board which appears visibly in the finished frame, mounting board 
            remains hidden behind the artwork, serving purely functional rather than aesthetic purposes. Mounting board supports 
            artwork weight, maintains flatness, prevents bowing or cockling, and provides a stable surface for attaching artwork 
            through various mounting techniques.
          </p>

          <p>
            Professional mounting boards come in several material types: solid paperboard (thick, compressed paper layers); 
            foam board (polystyrene foam core with paper facings); corrugated board (fluted paper construction); and 
            professional-grade museum board (archival, buffered paperboard). Each type offers different characteristics 
            regarding thickness, rigidity, weight, cost, and archival properties. Thickness ranges from 1/8 inch (thin 
            paperboard) to 3/16 inch (standard foam board) or thicker for specialized applications.
          </p>

          <p>
            The primary purposes of mounting board include: providing rigid backing that keeps artwork flat and dimensionally 
            stable; creating a mounting surface for hinge mounting, corner mounting, or adhesive attachment; adding thickness 
            to the frame assembly that prevents artwork contact with backing materials; supporting artwork weight without 
            sagging or bending; and protecting artwork from environmental factors entering from the frame back. Conservation 
            mounting boards additionally provide archival protection through archival, lignin-free materials that prevent 
            chemical migration into artwork.
          </p>

          <h2 data-testid="heading-construction-differences">Construction Material Differences</h2>

          <p>
            Mat board and mounting board differ fundamentally in construction materials, reflecting their different functional 
            requirements. Mat boards use high-quality colored papers on the face surface to provide attractive visual appearance, 
            with carefully selected core materials that cut cleanly to create smooth beveled edges. The face paper receives 
            special finish treatments, smooth, textured, linen-textured, or suede-textured, that enhance aesthetic appeal and 
            coordinate with various artwork styles.
          </p>

          <p>
            Conservation mat boards use cotton fiber (alpha cellulose) throughout all layers, providing chemical stability and 
            archival properties essential for artwork preservation. Standard commercial mat boards may use purified wood pulp 
            with chemical buffering, or less expensive wood pulp cores with surface papers. The core material quality dramatically 
            affects bevel appearance when cut, high-quality cores produce smooth, clean bevels while lower-grade cores create 
            rough, fuzzy edges.
          </p>

          <p>
            Mounting boards prioritize structural rigidity over appearance since they remain hidden in frame assemblies. Solid 
            paperboard mounting boards use compressed paper layers, providing excellent dimensional stability and cutting precision. 
            Foam board mounting boards sandwich polystyrene foam between paper facings, creating lightweight yet rigid support 
            with excellent flatness. Conservation mounting boards use archival, buffered papers throughout, ensuring long-term 
            chemical stability for valuable artwork. Corrugated mounting boards use fluted paper construction, providing economical 
            thickness and rigidity for less demanding applications.
          </p>

          <h2 data-testid="heading-thickness-comparisons">Thickness Comparisons</h2>

          <p>
            Mat board thickness follows an industry-standard ply system where 1-ply equals approximately 0.013 to 0.015 inches. 
            Standard mat board thicknesses include: 2-ply (approximately 0.030 inches), used occasionally for budget applications; 
            4-ply (approximately 0.055 to 0.060 inches), the professional standard for most framing; and 8-ply (approximately 
            0.120 inches), used for dramatic presentations requiring extra depth or specialty applications like museum framing.
          </p>

          <p>
            The 4-ply standard dominates professional picture framing because it provides ideal characteristics: sufficient 
            rigidity to maintain flatness; appropriate thickness for creating visible dimensional depth through beveled edges; 
            compatibility with standard mat cutting equipment; and proper spacing between artwork and glazing (when combined 
            with artwork thickness). Using thinner mats (2-ply) creates budget appearance and insufficient glazing clearance, 
            while unnecessarily thick mats (8-ply) increase material costs without proportional benefit for standard applications.
          </p>

          <p>
            Mounting board thickness varies widely based on material type and application requirements. Thin paperboard mounting 
            boards measure 1/8 inch (0.0625 inches), suitable for lightweight artwork in small frames. Standard foam board 
            measures 3/16 inch (0.1875 inches), providing excellent rigidity for most applications. Heavy-duty foam board or 
            solid paperboard mounting boards reach 1/4 inch or thicker, supporting large, heavy artwork or providing substantial 
            backing for shadowbox constructions. Conservation mounting boards typically use 2-ply to 4-ply paperboard thickness, 
            balancing rigidity with archival material availability.
          </p>

          <h2 data-testid="heading-when-mat-board">When to Use Mat Board</h2>

          <p>
            Mat board serves essential functions in traditional picture framing where visible borders around artwork enhance 
            presentation. Use mat board when: creating formal presentation of artwork, photographs, or documents; providing 
            color coordination that complements artwork and interior décor; establishing professional proportions through 
            calculated border widths; preventing glazing contact with artwork surfaces; or displaying work where protective 
            spacing and visual breathing room improve presentation quality.
          </p>

          <p>
            Specific applications requiring mat board include: photograph framing where mats create gallery-quality presentation; 
            print and poster framing where borders provide visual definition; document framing for diplomas, certificates, and 
            important papers; watercolor and drawing framing where mats protect delicate media; and multi-opening collage frames 
            where mats organize multiple images. Professional-grade mat board becomes essential for valuable artwork, limited 
            editions, vintage photographs, historical documents, and family heirlooms requiring archival preservation.
          </p>

          <p>
            Mat board provides particular value for smaller artwork (under 16x20 inches) where proportional borders increase 
            perceived size and importance. The colored borders create transition zones between artwork and frame, guiding viewer 
            attention while establishing visual hierarchy. Double mat construction, using two layered mat boards with visible 
            reveal, adds sophisticated depth and professional quality. Specialized mat board techniques including V-groove 
            designs, multi-opening layouts, and float mounting showcase mat board versatility for creative presentations.
          </p>

          <h2 data-testid="heading-when-mounting-board">When to Use Mounting Board</h2>

          <p>
            Mounting board provides essential backing support in virtually all picture frame assemblies, regardless of whether 
            mat board is also used. Use mounting board when: providing rigid support to prevent artwork sagging or bowing; 
            creating stable surface for artwork attachment through hinge mounting, corners, or adhesives; establishing thickness 
            behind artwork that prevents contact with frame backing; supporting artwork weight in frames larger than 8x10 inches; 
            or protecting artwork from environmental factors entering through frame backs.
          </p>

          <p>
            Specific applications requiring mounting board include: all standard picture framing as backing material behind 
            artwork or mat assemblies; canvas stretcher backing in floater frames; shadowbox backing supporting dimensional 
            objects; direct mounting surfaces for posters using adhesive attachment; and multi-layer assemblies where multiple 
            mounting boards create thickness for dimensional displays. Professional-grade mounting board becomes necessary for 
            valuable artwork, archival photographs, museum collections, and items requiring long-term chemical stability.
          </p>

          <p>
            Foam board mounting board excels in applications requiring maximum rigidity with minimum weight, including: large 
            format framing (over 24x36 inches); temporary displays or exhibition mounting; lightweight hanging requirements; and 
            situations requiring easy cutting with standard tools. Solid paperboard mounting boards work better for conservation 
            applications, small to medium frames, and projects requiring traditional materials. Corrugated mounting boards suit 
            budget-conscious applications, temporary framing, and situations where archival properties are unnecessary.
          </p>

          <h2 data-testid="heading-using-together">Using Mat Board and Mounting Board Together</h2>

          <p>
            Professional picture framing typically combines mat board and mounting board in layered assemblies that leverage 
            each material's strengths. The standard construction sequence from front to back includes: glazing (glass or acrylic); 
            mat board (providing visible border and spacing); artwork (positioned within mat opening or against mounting board); 
            mounting board (providing rigid backing); and dust cover (sealing frame back). This layered approach creates optimal 
            artwork presentation and protection.
          </p>

          <p>
            In typical mat-and-frame construction, artwork attaches to the mounting board through hinge mounting, photo corners, 
            or other techniques, then the mat board positions over the artwork with the mat opening revealing the image. The mat 
            provides colored borders and spacing from glazing while the mounting board supports artwork weight and maintains 
            flatness. The combined thickness of mat board (approximately 0.060 inches) plus mounting board (typically 0.1875 
            inches for foam board) creates sufficient depth to prevent artwork contact with frame backing.
          </p>

          <p>
            Conservation framing uses both archival mat boards and archival mounting boards to create complete archival 
            assemblies. The mat board prevents glazing contact while providing chemically stable borders, and the mounting board 
            offers archival backing support that prevents degradation. Using professional-grade materials for both components 
            ensures comprehensive protection, using conservation mat board with standard acidic mounting board compromises archival 
            integrity as acids migrate from mounting board into artwork over time.
          </p>

          <h2 data-testid="heading-cost-considerations">Cost Considerations</h2>

          <p>
            Mat board costs vary significantly based on quality grade, with standard commercial mat boards typically priced at 
            $8-15 per 32x40 inch sheet, while professional-grade mat boards range from $15-30 per sheet. Premium conservation 
            mat boards using 100% cotton throughout can exceed $40 per sheet. The price difference reflects material quality, 
            archival properties, color consistency, and bevel cutting characteristics. For valuable artwork requiring long-term 
            preservation, conservation mat board represents essential investment rather than optional upgrade.
          </p>

          <p>
            Mounting board costs depend on material type and thickness. Standard foam board costs $3-8 per 32x40 inch sheet, 
            providing economical backing for most applications. Professional-grade mounting boards (archival paperboard) range 
            from $10-25 per sheet, comparable to conservation mat boards. Solid paperboard mounting boards fall in between, 
            typically $5-12 per sheet. Corrugated mounting board offers budget option at $2-5 per sheet but lacks archival 
            properties and professional appearance.
          </p>

          <p>
            When planning framing budgets, consider that mat board represents visible, aesthetic component while mounting board 
            provides hidden, functional support. Investing in high-quality mat board affects presentation appearance directly, 
            while mounting board investment primarily affects longevity and structural integrity. For irreplaceable artwork, 
            using professional-grade materials for both mat and mounting boards ensures comprehensive protection. For replaceable 
            items like posters and prints, standard materials for both components provide acceptable service at lower cost.
          </p>

          <h2 data-testid="heading-professional-standards">Professional Framing Standards</h2>

          <p>
            Professional framers adhere to established standards for mat board selection and use. Industry standards specify 
            4-ply mat board thickness for standard framing applications, ensuring consistency and professional appearance. Mat 
            borders should follow the rule of thirds (minimum one-third of artwork's smallest dimension) to maintain proper 
            proportions. Beveled edges must maintain consistent 45-degree angles for clean appearance and adequate overlap. 
            Conservation applications require archival, lignin-free mat boards meeting or exceeding Library of Congress standards.
          </p>

          <p>
            Mounting board professional standards emphasize adequate thickness and rigidity to support artwork without sagging. 
            Minimum 1/8 inch thickness works for small frames (under 11x14 inches), while standard 3/16 inch foam board serves 
            most applications up to 24x36 inches. Larger frames may require 1/4 inch mounting board or multiple layers for 
            sufficient rigidity. Conservation framing requires archival, buffered mounting boards that pass Photographic Activity 
            Test (PAT) standards for contact with valuable artwork and photographs.
          </p>

          <p>
            Professional frame assembly standards specify proper material layering: glazing, mat board (if used), artwork, 
            mounting board, and sealed backing. All materials must remain compatible, mixing conservation mat boards with acidic 
            mounting boards compromises archival integrity. Mounting techniques must suit material types: hinge mounting with 
            wheat starch paste for conservation paperboard, photo corners for flexibility, appropriate adhesives matched to 
            mounting board surface characteristics. Following these standards ensures professional results and appropriate 
            longevity for artwork value.
          </p>

          <h2 data-testid="heading-common-misconceptions">Common Misconceptions</h2>

          <p>
            A prevalent misconception suggests mat board and mounting board serve interchangeable functions. In reality, they 
            fulfill distinct roles, mat board provides visible aesthetic borders while mounting board offers hidden structural 
            support. Using mat board as mounting board wastes expensive colored material on invisible backing, while using 
            mounting board as mat board creates rough, unprofessional appearance since mounting boards don't cut clean beveled 
            edges and lack attractive face surfaces.
          </p>

          <p>
            Another common misunderstanding claims foam board mounting boards aren't suitable for professional framing due to 
            inferior quality. While some inexpensive foam boards use non-archival materials inappropriate for conservation work, 
            professional-grade archival foam boards provide excellent mounting surfaces suitable for most applications. The 
            lightweight rigidity of foam board actually offers advantages for large-format framing where solid paperboard weight 
            becomes problematic. Choosing appropriate foam board grade for application requirements yields professional results.
          </p>

          <p>
            Many beginners believe thicker materials always provide better quality, leading to unnecessary use of 8-ply mat 
            boards or excessive mounting board thickness. Professional standards specify 4-ply mat board for typical applications 
            because it provides optimal balance of appearance, functionality, and cost. Similarly, standard 3/16 inch foam board 
            mounting provides adequate support for most frames, excessive thickness adds cost and weight without proportional 
            benefit. Understanding appropriate material selection prevents waste while ensuring professional quality.
          </p>
        </article>

        {/* CTA Section */}
        <Card className="my-12 bg-primary/5 border-primary/20" data-testid="card-cta">
          <CardHeader>
            <CardTitle className="text-2xl">Design Your Custom Frame Now</CardTitle>
            <CardDescription className="text-base">
              Choose the perfect mat board and configure professional framing with our interactive design tools.
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
            <Link href="/resources/conservation-framing-standards" data-testid="link-related-conservation">
              <Card className="hover-elevate h-full cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">Conservation Framing Standards</CardTitle>
                  <CardDescription>
                    Learn archival framing materials and professional-grade preservation standards for protecting valuable artwork.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/resources/professional-mounting-techniques" data-testid="link-related-mounting">
              <Card className="hover-elevate h-full cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">Professional Mounting Techniques</CardTitle>
                  <CardDescription>
                    Master hinge mounting, photo corners, and reversible conservation methods for artwork preservation.
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
