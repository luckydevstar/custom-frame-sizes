"use client";

import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle , Button } from "@framecraft/ui";

import { 
  Shield, 
  Palette, 
  Grid3x3, 
  Wrench, 
  Scale, 
  Ruler, 
  GraduationCap, 
  Trophy, 
  Baby,
  AlertCircle
} from 'lucide-react';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';

export default function ResourcesHub() {
  useScrollToTop();

  return (
    <>
      

      <div className="container mx-auto px-6 py-12 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6" data-testid="heading-resources">
            Professional Picture Framing Knowledge Center
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed" data-testid="text-hero-description">
            Comprehensive resources for professional framers, photographers, artists, and collectors. 
            Learn industry-standard techniques, conservation practices, design principles, and specialized 
            applications from certified picture framers and museum preparation specialists. Each guide provides 
            technical specifications, real-world examples, and professional standards used in galleries, 
            museums, and custom framing studios.
          </p>
        </div>

        {/* Conservation & Materials Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8" data-testid="heading-conservation">Conservation & Materials</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="hover-elevate" data-testid="card-conservation-standards">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Shield className="w-8 h-8 text-primary flex-shrink-0" />
                  <div>
                    <CardTitle className="text-xl mb-2">Conservation Framing Standards Guide</CardTitle>
                    <CardDescription className="text-base">
                      Complete overview of archival framing materials and professional-grade preservation standards. 
                      Learn archival construction, lignin-free materials, pH buffering, and PAT testing. 
                      Understand when conservation framing is required versus optional for long-term artwork protection.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Link href="/resources/conservation-framing-standards" data-testid="link-conservation-standards">
                  <Button variant="outline" className="w-full" data-testid="button-read-conservation">
                    Read Full Guide
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover-elevate" data-testid="card-mat-color-selection">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Palette className="w-8 h-8 text-primary flex-shrink-0" />
                  <div>
                    <CardTitle className="text-xl mb-2">Mat Board Color Selection Guide</CardTitle>
                    <CardDescription className="text-base">
                      Professional color theory for picture framing. Master neutral whites, dark mats, complementary 
                      color strategies, and double mat combinations. Learn how mat colors interact with artwork, 
                      undertones, temperature considerations, and common selection mistakes.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Link href="/resources/mat-color-selection-guide" data-testid="link-mat-color-guide">
                  <Button variant="outline" className="w-full" data-testid="button-read-color">
                    Read Full Guide
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover-elevate" data-testid="card-mounting-techniques">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Wrench className="w-8 h-8 text-primary flex-shrink-0" />
                  <div>
                    <CardTitle className="text-xl mb-2">Professional Mounting Techniques</CardTitle>
                    <CardDescription className="text-base">
                      Master hinge mounting, corner mounting, float mounting, and adhesive techniques. 
                      Detailed instructions for T-hinges, V-hinges, wheat starch paste application, and photo corners. 
                      Learn reversible versus permanent mounting and conservation attachment methods.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Link href="/resources/professional-mounting-techniques" data-testid="link-mounting-techniques">
                  <Button variant="outline" className="w-full" data-testid="button-read-mounting">
                    Read Full Guide
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover-elevate" data-testid="card-mat-vs-mounting">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Scale className="w-8 h-8 text-primary flex-shrink-0" />
                  <div>
                    <CardTitle className="text-xl mb-2">Mat Board vs. Mounting Board Comparison</CardTitle>
                    <CardDescription className="text-base">
                      Comprehensive comparison of mat board and mounting board construction, materials, and applications. 
                      Understand when to use each type, how they work together, cost considerations, and professional 
                      framing standards for both materials.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Link href="/resources/mat-board-vs-mounting-board" data-testid="link-mat-vs-mounting">
                  <Button variant="outline" className="w-full" data-testid="button-read-comparison">
                    Read Full Guide
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Design & Layout Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8" data-testid="heading-design">Design & Layout</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover-elevate" data-testid="card-multi-opening">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Grid3x3 className="w-8 h-8 text-primary flex-shrink-0" />
                  <div>
                    <CardTitle className="text-xl mb-2">Multi-Opening Layout Engineering</CardTitle>
                    <CardDescription className="text-base">
                      Grid layouts, hierarchical compositions, asymmetrical arrangements, and visual weight distribution. 
                      Learn rule of thirds, rhythm, negative space, and structural spacing requirements for professional 
                      multi-opening mat design.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Link href="/resources/multi-opening-layout-engineering" data-testid="link-multi-opening-layout">
                  <Button variant="outline" className="w-full" data-testid="button-read-layout">
                    Read Full Guide
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover-elevate" data-testid="card-border-proportions">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Ruler className="w-8 h-8 text-primary flex-shrink-0" />
                  <div>
                    <CardTitle className="text-xl mb-2">Border Width & Proportions</CardTitle>
                    <CardDescription className="text-base">
                      Professional border calculation formulas including rule of thirds, minimum border standards, 
                      weighted bottom borders, and proportional scaling. Border width examples for common artwork sizes 
                      with visual balance principles.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Link href="/resources/border-width-proportions" data-testid="link-border-proportions">
                  <Button variant="outline" className="w-full" data-testid="button-read-borders">
                    Read Full Guide
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover-elevate" data-testid="card-mat-mistakes">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-8 h-8 text-primary flex-shrink-0" />
                  <div>
                    <CardTitle className="text-xl mb-2">Common Mat Cutting Mistakes</CardTitle>
                    <CardDescription className="text-base">
                      Identify and avoid critical mat cutting errors including insufficient overlap, reversed measurements, 
                      improper spacing, grain direction problems, and bevel angle mistakes. Professional quality control 
                      checklist included.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Link href="/resources/common-mat-cutting-mistakes" data-testid="link-mat-mistakes">
                  <Button variant="outline" className="w-full" data-testid="button-read-mistakes">
                    Read Full Guide
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Specialized Applications Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8" data-testid="heading-specialized">Specialized Applications</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover-elevate" data-testid="card-school-pictures">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <GraduationCap className="w-8 h-8 text-primary flex-shrink-0" />
                  <div>
                    <CardTitle className="text-xl mb-2">School Picture Frame Layouts</CardTitle>
                    <CardDescription className="text-base">
                      Design kindergarten through 12th grade photo displays. Timeline layouts, graduation photo placement, 
                      standard school picture sizes, mat color recommendations, and archival preservation for educational 
                      milestone documentation.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Link href="/resources/school-picture-frames" data-testid="link-school-pictures">
                  <Button variant="outline" className="w-full" data-testid="button-read-school">
                    Read Full Guide
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover-elevate" data-testid="card-sports-team">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Trophy className="w-8 h-8 text-primary flex-shrink-0" />
                  <div>
                    <CardTitle className="text-xl mb-2">Sports Team Photography Framing</CardTitle>
                    <CardDescription className="text-base">
                      Team photo with individual player layouts, championship documentation, action shot collages, 
                      multi-year progression displays, and jersey number integration. Mat color coordination with school 
                      colors and team gift ideas.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Link href="/resources/sports-team-framing" data-testid="link-sports-team">
                  <Button variant="outline" className="w-full" data-testid="button-read-sports">
                    Read Full Guide
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover-elevate" data-testid="card-baby-first-year">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Baby className="w-8 h-8 text-primary flex-shrink-0" />
                  <div>
                    <CardTitle className="text-xl mb-2">Baby's First Year Memory Frames</CardTitle>
                    <CardDescription className="text-base">
                      Monthly milestone layouts with 12 openings, quarterly photo arrangements, birth announcement 
                      integration, hospital memorabilia display, twin configurations, and archival preservation for 
                      precious infant memories.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Link href="/resources/baby-first-year-frames" data-testid="link-baby-first-year">
                  <Button variant="outline" className="w-full" data-testid="button-read-baby">
                    Read Full Guide
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-muted rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4" data-testid="heading-cta">Ready to Design Your Custom Frame?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto" data-testid="text-cta-description">
            Apply what you've learned with our professional design tools. Create custom mats and collage frames 
            with precision measurements, conservation materials, and real-time pricing.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/designer" data-testid="link-mat-designer">
              <Button size="lg" data-testid="button-cta-mat-designer">
                Mat Board Designer
              </Button>
            </Link>
            <Link href="/designer" data-testid="link-collage-designer">
              <Button size="lg" variant="outline" data-testid="button-cta-collage-designer">
                Collage Frame Designer
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
