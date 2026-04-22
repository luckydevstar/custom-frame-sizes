import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Jersey Frames | ShadowboxFrames.com",
  description: "Custom jersey frames for sports memorabilia. Display your favorite team jersey or signed sports collectible.",
};

export default function JerseyFrames() {
  return (
    <div className="space-y-0">
      {/* Hero */}
      <section className="bg-gradient-to-b from-card to-background px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl text-center space-y-4">
          <h1 className="font-serif text-4xl md:text-5xl font-bold">Jersey Frames</h1>
          <p className="text-lg text-muted-foreground">
            Display your favorite sports jersey or signed sports memorabilia in a custom frame.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl space-y-12">
          {/* Hero Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="rounded-lg overflow-hidden bg-muted h-96 flex items-center justify-center text-6xl">
              🏈
            </div>
            <div className="space-y-6">
              <h2 className="font-serif text-3xl font-bold">Showcase Your Team Spirit</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Jersey frames are the perfect way to display and preserve your favorite sports memorabilia. 
                  Whether it's a signed jersey, team-worn collectible, or your favorite player's number, 
                  we'll create a frame that does it justice.
                </p>
                <p>
                  Our jersey frames feature premium shadow box construction with deep frames (typically 1.5" to 2.5") 
                  to accommodate the thickness of folded jerseys. We use museum-quality materials and UV-protective glass 
                  to ensure your memorabilia stays protected.
                </p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg border border-border bg-card">
              <div className="text-4xl mb-3">📏</div>
              <h3 className="font-semibold mb-2">Custom Sizing</h3>
              <p className="text-sm text-muted-foreground">
                From standard 24×36 jerseys to custom sizes that fit your specific memorabilia perfectly.
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-card">
              <div className="text-4xl mb-3">🛡️</div>
              <h3 className="font-semibold mb-2">UV Protection</h3>
              <p className="text-sm text-muted-foreground">
                Optional UV-protective glass preserves colors and prevents fading over time.
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-card">
              <div className="text-4xl mb-3">🎨</div>
              <h3 className="font-semibold mb-2">Custom Matting</h3>
              <p className="text-sm text-muted-foreground">
                Choose from 50+ mat colors to complement your jersey or create a custom layout.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center space-y-4 bg-muted/50 rounded-lg p-8">
            <h3 className="font-serif text-2xl font-bold">Ready to frame your jersey?</h3>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Start designing your custom jersey frame with our interactive designer. Get instant pricing and see your design in real-time.
            </p>
            <Link
              href="/designer"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Design Your Jersey Frame
            </Link>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="border-t border-border bg-muted/30 px-4 py-8">
        <div className="mx-auto max-w-4xl text-center space-y-4">
          <p className="text-sm text-muted-foreground">Browse other specialty frames:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/shadowbox" className="text-accent hover:text-accent/80 transition-colors">
              Shadowbox Frames
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/bouquets" className="text-accent hover:text-accent/80 transition-colors">
              Dried Bouquets
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/medals" className="text-accent hover:text-accent/80 transition-colors">
              Military Medals
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
