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


import { GraduationCap, ArrowRight } from 'lucide-react';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';

export default function SchoolPictureFrames() {
  useScrollToTop();

  return (
    <>
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-8" data-testid="breadcrumb-school">
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
              <BreadcrumbPage>School Picture Frame Layout Guide</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Hero Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <GraduationCap className="w-10 h-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold" data-testid="heading-main">
              School Picture Frame Layout Guide
            </h1>
          </div>
          <p className="text-xl text-muted-foreground leading-relaxed" data-testid="text-hero-description">
            Professional guide to displaying school pictures from kindergarten through 12th grade. Master yearly timeline 
            layouts, graduation photo compositions, mat color selection, and creative variations for documenting academic 
            milestones and preserving childhood memories.
          </p>
        </div>

        {/* Main Content */}
        <article className="prose prose-slate dark:prose-invert max-w-none">
          <h2 data-testid="heading-k12-documentation">Kindergarten Through 12th Grade Documentation</h2>
          
          <p>
            School picture frames document thirteen years of academic progression from kindergarten through 12th grade, creating 
            cherished family heirlooms that capture childhood development and educational milestones. These multi-opening mat 
            layouts accommodate yearly portrait photographs in chronological sequence, preserving memories that parents, students, 
            and extended family treasure for decades. Professional framing transforms routine school pictures into meaningful 
            displays celebrating growth, achievement, and family bonds.
          </p>

          <p>
            The standard K-12 school picture frame contains thirteen openings arranged to display annual portraits from kindergarten 
            (typically age 5-6) through 12th grade (typically age 17-18), plus optional additional opening for preschool or graduation 
            portrait. Most layouts use uniform opening sizes for the yearly progression, maintaining visual consistency that emphasizes 
            the chronological documentation aspect rather than hierarchical importance. The sequential arrangement tells the student's 
            story through systematic progression rather than isolated moments.
          </p>

          <p>
            School picture framing serves multiple purposes beyond simple display: preserving irreplaceable childhood photographs in 
            archival-quality materials; creating tangible documentation of academic career that builds gradually year by year; 
            providing focal point for family pride and achievement celebration; establishing graduation gifts for students, parents, 
            and grandparents; and transforming ordinary school photos into meaningful family heirlooms. The investment in professional 
            framing elevates routine annual portraits into treasured keepsakes worthy of prominent display.
          </p>

          <h2 data-testid="heading-timeline-layouts">Yearly Timeline Layouts</h2>

          <p>
            Horizontal timeline layouts arrange school pictures in left-to-right chronological sequence, typically in one, two, or 
            three rows depending on total number of years documented. Single-row layouts work well for shorter spans (preschool through 
            5th grade, or 9th through 12th) measuring approximately 40 to 50 inches wide by 8 to 12 inches tall. Two-row layouts 
            accommodate full K-12 progression in more manageable width, typically 30 to 40 inches wide by 16 to 20 inches tall. 
            Three-row layouts create nearly square formats, measuring approximately 24 to 30 inches per dimension.
          </p>

          <p>
            Single-row horizontal layouts create dramatic timeline presentations particularly effective for hallways or above furniture 
            where horizontal format fits available wall space. Arrange kindergarten at far left, progressing chronologically rightward 
            to 12th grade at far right, the left-to-right reading direction makes chronological flow intuitive for viewers. Space openings 
            uniformly with 1 to 2 inches between each, maintaining consistent rhythm throughout. The extended horizontal format emphasizes 
            the journey from beginning to end, making passage of time visually apparent.
          </p>

          <p>
            Vertical timeline layouts stack school pictures in top-to-bottom chronological sequence, creating tall, narrow presentations 
            suitable for narrow wall spaces, beside doorways, or in hallway galleries. Single-column vertical arrangements measure 
            approximately 8 to 12 inches wide by 40 to 60 inches tall for full K-12 documentation. The top-to-bottom progression feels 
            natural, following gravity and reading convention. Vertical formats work particularly well in homes with limited horizontal 
            wall space but adequate vertical clearance, transforming narrow areas into meaningful display opportunities.
          </p>

          <h2 data-testid="heading-graduation-central">Central Graduation Photo with Surrounding Years</h2>

          <p>
            Hierarchical layouts feature enlarged graduation portrait as central focal point, surrounded by smaller yearly school pictures 
            arranged chronologically. This composition emphasizes the culminating achievement (graduation) while documenting the journey 
            (K-12 progression), creating visual hierarchy that directs viewer attention to the most significant milestone while maintaining 
            complete chronological documentation. The layout works excellently for graduation gifts, senior celebrations, and family displays 
            honoring academic completion.
          </p>

          <p>
            Typical hierarchical construction uses 8x10 inch or 5x7 inch central opening for graduation portrait, surrounded by wallet-size 
            (2.5x3.5 inch) or small (3x4 inch) openings for yearly progression photos. Position the graduation portrait at center, then 
            arrange K-12 photos around the perimeter in clockwise or counterclockwise chronological sequence starting from top-left. 
            Alternatively, arrange earlier years (K-5) on left side, later years (6-12) on right side, with graduation centered between, 
            this left-to-right progression maintains chronological reading while establishing central hierarchy.
          </p>

          <p>
            Advanced hierarchical variations include: graduation portrait at top with chronological progression below in two or three rows; 
            graduation portrait at bottom (inverted pyramid) with progression above; or graduation portrait offset to one side with L-shaped 
            or wraparound progression pattern. Some designs incorporate additional openings for elementary school graduation (5th or 6th grade) 
            and middle school graduation (8th grade) in slightly larger sizes than yearly photos but smaller than high school graduation, 
            creating three-tier hierarchy that acknowledges multiple educational milestones.
          </p>

          <h2 data-testid="heading-standard-sizes">Standard School Picture Sizes</h2>

          <p>
            School picture packages traditionally include multiple print sizes from the same annual portrait session. Standard packages 
            typically contain: one or two 8x10 inch prints (largest, most formal); two to four 5x7 inch prints (medium format); multiple 
            3x5 inch or 4x6 inch prints (small format); and sheets of wallet-size prints (2.5x3.5 inches, typically 8-16 wallets per sheet). 
            Understanding standard sizes enables framers to plan layouts accommodating available print formats without requiring custom 
            reprints.
          </p>

          <p>
            Wallet-size school pictures (2.5x3.5 inches) work excellently for K-12 timeline frames because their compact dimensions allow 
            thirteen openings to fit manageable overall frame sizes. A horizontal single-row layout using wallet photos with 2.5 inch borders 
            and 1.5 inch spacing measures approximately 48 inches wide by 10 inches tall, substantial but displayable in most homes. The uniform 
            small size emphasizes chronological documentation rather than individual photo importance, appropriate for yearly progression 
            displays.
          </p>

          <p>
            School picture sizes have evolved somewhat over decades, with older photos sometimes measuring slightly different from current 
            standards. 1970s-1990s school pictures may use 2x3 inch wallet size instead of current 2.5x3.5 inches, or 3.5x5 inch instead of 
            current 4x6 inches. When framing vintage school picture collections spanning multiple decades, measure actual photo dimensions 
            rather than assuming standard sizes, create slightly larger openings to accommodate size variations, or resize some photos 
            digitally to match others for consistent layout appearance.
          </p>

          <h2 data-testid="heading-mat-colors">Mat Color Recommendations</h2>

          <p>
            Mat color selection for school picture frames balances professional neutrality, personal preference, and coordination with 
            school colors or home décor. Neutral mat colors, white, off-white, cream, light gray, black, provide timeless, classic presentation 
            that works universally across diverse clothing colors, background colors, and portrait styles spanning thirteen years. Neutral 
            mats emphasize the photographs themselves rather than the framing, appropriate for documentary presentations where images take 
            priority.
          </p>

          <p>
            White and off-white mats create clean, fresh presentations that complement most school picture backgrounds and clothing choices. 
            Bright white works particularly well with modern color photography and contemporary interiors, while cream or antique white 
            provides softer, warmer presentation suited to traditional décor and older photographs. Light gray offers sophisticated neutral 
            alternative that coordinates with both warm and cool tones, creating contemporary appearance without stark white contrast.
          </p>

          <p>
            School color mats, incorporating institutional colors like navy blue, burgundy, forest green, or gold, create personalized 
            presentations celebrating specific school affiliation. Use school colors for the outer mat in double mat construction, with 
            neutral inner mat (white or cream) to maintain appropriate backdrop for facial tones. Alternatively, incorporate school colors 
            in mat corners, borders, or decorative elements while maintaining neutral colors surrounding the actual photo openings. School 
            color mats work especially well for graduation-focused layouts and frames intended as school spirit displays.
          </p>

          <h2 data-testid="heading-frame-sizes">Frame Size Recommendations for Different Grade Spans</h2>

          <p>
            Elementary school spans (K-5 or K-6) contain six to seven years requiring moderate frame dimensions. Using wallet-size photos 
            (2.5x3.5 inches) with 2.5 inch borders and 1.5 inch spacing, horizontal single-row layout measures approximately 30 to 35 inches 
            wide by 10 inches tall. Two-row layout creates nearly square format, approximately 18 to 20 inches wide by 16 to 18 inches tall. 
            These manageable sizes work well as ongoing projects, adding one opening each year as the student progresses through elementary 
            grades.
          </p>

          <p>
            Middle school spans (6th-8th or 7th-9th) require smaller frames, typically three to four openings. Horizontal layout using 
            wallet photos measures approximately 18 to 22 inches wide by 10 inches tall, while vertical layout creates 10 inches wide by 
            20 to 24 inches tall presentation. These compact dimensions suit hallway displays, bedroom walls, or groupings with other family 
            photographs. Some families create separate elementary, middle school, and high school frames rather than single K-12 frame, 
            allowing progressive display as children advance through educational system.
          </p>

          <p>
            High school spans (9th-12th) contain four years, the most manageable for frame size planning. Horizontal wallet-size layout 
            measures approximately 20 inches wide by 10 inches tall, suitable for most wall spaces. Consider using larger print sizes (3x4 
            or 4x6 inches) for high school frames since these later portraits often feature more mature subjects worthy of larger presentation. 
            Full K-12 frames using wallet-size photos typically measure 40 to 50 inches wide (single row) or 30 to 40 inches wide by 16 to 20 
            inches tall (two rows), substantial but achievable for dedicated wall space.
          </p>

          <h2>Adding Names, Years, or Grade Levels</h2>

          <p>
            Labeling enhancements add context and personalization to school picture frames, particularly valuable as years pass and specific 
            grade levels become less obvious. Professional options include: engraved or printed mat board with student name and "Kindergarten 
            through 12th Grade" text; individual grade labels below or beside each opening (K, 1st, 2nd, etc.); year labels indicating school 
            years (2010-2011, 2011-2012, etc.); or combination approaches using both grade and year information.
          </p>

          <p>
            Mat board printing or engraving creates permanent, professional labels integrated directly into the mat surface. Position student 
            name centered below or above the photo array, with grade/year labels aligned with individual openings. Use fonts that complement 
            frame style: serif fonts (Times, Garamond) for traditional presentations, sans-serif fonts (Arial, Helvetica) for contemporary 
            designs. Keep text sizes modest, 1/4 to 3/8 inch letter height for grade labels, 1/2 to 3/4 inch for student name. Excessive text 
            size competes with photographs rather than enhancing them.
          </p>

          <p>
            Alternative labeling approaches include small metal or plastic label holders attached to mat or frame, printed labels behind glass 
            positioned adjacent to openings, or handwritten calligraphy on mat board surface for personalized touch. Some families add 
            additional information like teacher names, school names, or notable achievements from each year. Balance comprehensive documentation 
            against visual simplicity, too much text clutters the presentation and detracts from the primary focus of showing student growth 
            through photographs.
          </p>

          <h2>Creative Layout Variations</h2>

          <p>
            Spiral layouts arrange school pictures in clockwise or counterclockwise spiral pattern, starting from center or edge and progressing 
            chronologically through the spiral path. This creative variation adds visual interest while maintaining chronological documentation. 
            Begin with kindergarten at spiral center, progressing outward through grades, or start with 12th grade at center and spiral outward 
            to kindergarten at perimeter. Spiral layouts work particularly well in square or nearly-square mat formats, measuring 24x24 to 30x30 
            inches for full K-12 documentation.
          </p>

          <p>
            Grid layouts arrange school pictures in perfect rows and columns without strict chronological reading order, creating organized, 
            systematic presentation. Use 3x4 grid (12 openings) for K-11, 4x4 grid (16 openings) for K-12 plus preschool/graduation/candids, 
            or custom grid dimensions matching available wall space. Grid arrangements emphasize the collection as unified whole rather than 
            progressive timeline, appropriate when visual organization takes priority over chronological narrative. Add grade labels to identify 
            each photo since grid reading order may not be intuitive.
          </p>

          <p>
            Ascending size layouts increase opening dimensions progressively from kindergarten (smallest) to 12th grade (largest), visually 
            representing student growth and development. Start with 2x2.5 inch openings for kindergarten, gradually increasing to 3x4 inches 
            for middle school, and 4x6 or 5x7 inches for senior portrait. This creative variation requires careful planning to ensure smooth 
            progression and balanced composition, but creates dramatic presentation that mirrors actual physical growth from small child to 
            young adult. Ascending layouts work especially well when culminating in prominent graduation portrait at largest opening size.
          </p>

          <h2>Preserving School Pictures Archivally</h2>

          <p>
            School picture preservation requires archival-quality materials protecting irreplaceable photographs from chemical degradation, 
            environmental damage, and physical deterioration over decades. Use archival, lignin-free conservation mat boards that won't 
            yellow, become brittle, or chemically damage photographs over time. Standard commercial mat boards contain acids that migrate 
            into photos, causing yellowing and deterioration within 10-20 years, conservation materials extend preservation to 100+ years 
            without significant degradation.
          </p>

          <p>
            Mount school pictures using reversible archival techniques: photo corners that hold pictures without adhesive contact, or hinge 
            mounting with wheat starch paste that can be removed with water if needed. Never use standard tape, rubber cement, or permanent 
            adhesives on original photographs, these create irreversible damage and chemical staining. Archival mounting board behind photos 
            provides rigid support while preventing chemical migration from frame backing materials. Some school pictures come printed on 
            paper stock containing acids, conservation framing prevents these inherent acids from accelerating deterioration.
          </p>

          <p>
            UV-filtering glazing (glass or acrylic) blocks ultraviolet radiation that fades photographs, particularly color prints susceptible 
            to fading from sunlight and indoor lighting. Professional-grade UV glazing blocks 97-99% of harmful UV radiation, significantly extending 
            photo lifespan. Regular glass provides no UV protection, while basic acrylic blocks approximately 45%. Display school picture frames 
            away from direct sunlight, which accelerates fading even with UV glazing. Well-preserved school picture frames become family heirlooms 
            passed to future generations, documenting family history for children and grandchildren decades hence.
          </p>

          <h2>Gift Options for Grandparents and Family</h2>

          <p>
            School picture frames make exceptional gifts for grandparents, celebrating grandchildren's academic progression and providing 
            tangible connection to milestones they may not experience in person. Create duplicate frames using extra school picture prints, 
            most packages include sufficient quantities to make multiple frames for parents, maternal grandparents, and paternal grandparents. 
            Grandparent gifts often receive prominent display in living rooms, offices, or hallways, reflecting family pride and maintaining 
            connection across distance.
          </p>

          <p>
            Graduation-themed school picture frames serve as perfect high school graduation gifts for the graduate, parents, and extended 
            family. The complete K-12 documentation celebrates thirteen years of academic achievement, suitable for prominent display in 
            graduate's college dorm or first apartment, parents' home, or grandparents' homes. Some families create senior year gifts early 
            (during fall or winter of 12th grade) to allow adequate framing time before graduation ceremonies in May or June.
          </p>

          <p>
            Extended family variations include frames for aunts/uncles, godparents, or other significant relatives who've followed the student's 
            educational journey. Consider smaller formats focusing on selected years rather than complete K-12 documentation, every other year, 
            or just elementary/middle/high school graduation years. Personalize gifts through mat color selection reflecting each recipient's 
            home décor, custom engraving with student name and dates, or special messages acknowledging recipient's role in student's life 
            (e.g., "For Grandma, with love").
          </p>

          <h2>Planning Ahead for Future Years</h2>

          <p>
            Progressive framing approaches add one opening each year as new school pictures arrive, gradually building complete K-12 collection 
            rather than waiting until graduation to create retrospective display. Purchase or commission mat with all thirteen openings at 
            kindergarten, filling openings progressively year by year. Empty openings may remain unfilled (showing mat backing board) or 
            contain placeholder text ("1st Grade - Coming Soon!") until photos arrive. This approach spreads costs over years while creating 
            ongoing family project that evolves annually.
          </p>

          <p>
            Alternative progressive approach uses modular frames that expand to accommodate additional openings. Start with single frame 
            containing kindergarten through 3rd grade, add second frame for 4th-6th grade, third frame for 7th-9th grade, and fourth frame 
            for 10th-12th grade. Display frames together as wall grouping that grows over time. Modular approach offers flexibility to 
            accommodate changing wall space availability and allows using different frame styles or mat colors for different educational phases.
          </p>

          <p>
            Digital backup creates insurance against lost or damaged school pictures. Scan each year's school photos at high resolution (300+ 
            DPI) immediately upon receipt, storing digital files on multiple devices and cloud backup services. Digital copies enable future 
            reprinting if original photos are damaged, lost, or needed for additional frames. Some families create digital slideshows or photo 
            books alongside physical frames, combining traditional framing with modern digital preservation and sharing capabilities. The dual 
            approach ensures precious childhood documentation survives for future generations regardless of format evolution.
          </p>

          <h2>Elementary vs High School Photos</h2>

          <p>
            Elementary school photos (K-5) capture dramatic physical and developmental changes from small children to pre-adolescents. These 
            early portraits often feature more playful expressions, varied clothing choices reflecting parental decisions, and backgrounds that 
            evolved from traditional mottled blue to more creative settings during the 1990s-2000s transition. Elementary photos are particularly 
            cherished by parents and grandparents who remember the small children depicted, creating emotional connections that intensify the 
            photos' value as keepsakes.
          </p>

          <p>
            Consider creating standalone elementary school frames (K-5) as interim projects while students progress through school, particularly 
            for families with multiple children where complete K-12 frames won't finish for many years. Elementary frames using larger print 
            sizes (3x4 or 4x6 inches) create more substantial presentation than waiting for K-12 wallet-size compilation. These standalone frames 
            can later incorporate into larger displays or maintain independent status as documentation of the elementary years that pass quickly 
            and hold particular nostalgia.
          </p>

          <p>
            High school photos (9-12) show more subtle physical changes as students mature into young adults, with increasing self-determination 
            in clothing choices, hairstyles, and expression. These later portraits document the transition from childhood to adulthood, holding 
            different emotional significance as graduates prepare for college, careers, and independence. High school photos often receive larger 
            opening sizes in school picture frames, reflecting both the more mature subjects and the approaching culmination of K-12 education. 
            Some families create separate high school frames alongside elementary frames, dividing the thirteen-year journey into meaningful 
            phases while maintaining complete chronological documentation across multiple displays.
          </p>
        </article>

        {/* CTA Section */}
        <Card className="my-12 bg-primary/5 border-primary/20" data-testid="card-cta">
          <CardHeader>
            <CardTitle className="text-2xl">Design Your Custom Frame Now</CardTitle>
            <CardDescription className="text-base">
              Create professional school picture layouts with our multi-opening mat designer. Ideal for K-12 memories.
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
                  Collage Frame Designer
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

            <Link href="/resources/baby-first-year-frames" data-testid="link-related-baby">
              <Card className="hover-elevate h-full cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">Baby's First Year Memory Frames</CardTitle>
                  <CardDescription>
                    Professional layouts for monthly milestone photos, birth announcements, and keepsake displays.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/resources/conservation-framing-standards" data-testid="link-related-conservation">
              <Card className="hover-elevate h-full cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">Conservation Framing Standards</CardTitle>
                  <CardDescription>
                    Learn archival framing materials for preserving irreplaceable family photographs.
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
