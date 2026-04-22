import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Custom Shadowbox Frames | Handcrafted Design | ShadowboxFrames.com",
  description: "Handcrafted shadow box frames built for what matters most. Design your custom shadowbox with real-time pricing and premium materials.",
};

export default function Home() {
  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-card to-background px-4 py-20 md:py-32">
        <div className="mx-auto max-w-4xl space-y-6 text-center">
          <div className="space-y-2">
            <h1 className="font-serif text-5xl font-bold md:text-6xl tracking-tight">
              Handcrafted Shadow Box Frames
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Build custom display frames for what matters most
            </p>
          </div>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Design shadow box frames in any size, from compact 8×10 display cases to large-format 30×40 jersey frames. 
            Choose your size down to 1/8" increments, pick your depth, select from premium mat colors, and preview in real time.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <a 
              href="#designer" 
              className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Design Now
            </a>
            <a 
              href="/gallery" 
              className="inline-flex items-center justify-center rounded-lg border border-border px-8 py-3 font-medium hover:bg-secondary transition-colors"
            >
              View Gallery
            </a>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="border-y border-border bg-muted/50 px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">1/8"</div>
              <p className="text-sm text-muted-foreground">Precision to 1/8 inch increments</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">50+</div>
              <p className="text-sm text-muted-foreground">Premium mat colors available</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">US Made</div>
              <p className="text-sm text-muted-foreground">Handcrafted from our workshop</p>
            </div>
          </div>
        </div>
      </section>

      {/* Designer Section */}
      <section id="designer" className="px-4 py-16 md:py-24">
        <div className="mx-auto max-w-5xl space-y-8">
          <div className="text-center space-y-4">
            <h2 className="font-serif text-3xl md:text-4xl font-bold">Design Your Perfect Frame</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Customize every aspect of your shadow box frame with our interactive designer. 
              See your design in real-time before you order.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-lg border border-border p-8 bg-card">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground">Designer Preview</span>
              </div>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Customize Your Frame</h3>
                <p className="text-muted-foreground">
                  Start with your desired dimensions. We support custom sizes from 5×7 up to 36×48.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Choose Your Depth</h3>
                <p className="text-muted-foreground">
                  Select frame depth from ¾" to 3" depending on what you're displaying.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Select Mat & Glazing</h3>
                <p className="text-muted-foreground">
                  Pick from 50+ mat colors and choose UV-protective or standard glass.
                </p>
              </div>
              <a 
                href="#designer"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2 font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Get Started →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="bg-muted/50 px-4 py-16 md:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12 space-y-4">
            <h2 className="font-serif text-3xl md:text-4xl font-bold">Why Choose ShadowBoxFrames</h2>
            <p className="text-lg text-muted-foreground">Premium quality, precision craftsmanship, and exceptional value</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-background rounded-lg p-8 border border-border">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <span className="text-accent font-bold">🎨</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Custom Design</h3>
              <p className="text-muted-foreground">
                Create exactly what you envision. Real-time preview shows you exactly what you'll receive.
              </p>
            </div>

            <div className="bg-background rounded-lg p-8 border border-border">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <span className="text-accent font-bold">✨</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Premium Materials</h3>
              <p className="text-muted-foreground">
                Handcrafted with genuine hardwoods, museum-quality matting, and UV-protective glass options.
              </p>
            </div>

            <div className="bg-background rounded-lg p-8 border border-border">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <span className="text-accent font-bold">⚡</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Fast Turnaround</h3>
              <p className="text-muted-foreground">
                Built and shipped quickly from our US-based workshop. Most orders ship within 2-3 weeks.
              </p>
            </div>

            <div className="bg-background rounded-lg p-8 border border-border">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <span className="text-accent font-bold">🛡️</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Quality Guarantee</h3>
              <p className="text-muted-foreground">
                Every frame is inspected for quality. If you're not satisfied, we'll make it right.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center space-y-6">
          <h2 className="font-serif text-3xl md:text-4xl font-bold">Ready to Create Your Shadow Box?</h2>
          <p className="text-lg text-muted-foreground">
            Start designing your custom frame today. It only takes a few minutes to see your design in real-time.
          </p>
          <a 
            href="/designer"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Design Your Frame
          </a>
        </div>
      </section>
    </div>
  );
}
