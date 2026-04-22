import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About ShadowboxFrames.com | Our Story",
  description: "Learn about ShadowboxFrames - handcrafted custom display frames built for what matters most.",
};

export default function About() {
  return (
    <div className="space-y-0">
      {/* Page Header */}
      <section className="bg-gradient-to-b from-card to-background px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl text-center space-y-4">
          <h1 className="font-serif text-4xl md:text-5xl font-bold">Our Story</h1>
          <p className="text-lg text-muted-foreground">
            Handcrafted shadowbox frames built with precision and passion
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="rounded-lg overflow-hidden">
              <div className="aspect-square bg-muted flex items-center justify-center text-6xl">
                🎨
              </div>
            </div>
            <div className="space-y-6">
              <h2 className="font-serif text-3xl font-bold">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                At ShadowboxFrames.com, we believe that what matters most deserves to be displayed beautifully.
                Whether it&apos;s a cherished memory, a hard-earned achievement, or a treasured collection,
                we craft custom shadowbox frames that preserve and honor what&apos;s important to you.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Every frame is handcrafted in our US-based workshop with premium materials and attention to detail. 
                We work with you to create exactly what you envision, down to the 1/8 in. increment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-muted/50 px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-serif text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background rounded-lg p-8 border border-border">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="font-semibold text-lg mb-3">Precision</h3>
              <p className="text-muted-foreground text-sm">
                Custom sizes down to 1/8 in. increments. We build exactly what you want, not one size fits all.
              </p>
            </div>
            <div className="bg-background rounded-lg p-8 border border-border">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="font-semibold text-lg mb-3">Quality</h3>
              <p className="text-muted-foreground text-sm">
                Premium hardwoods, museum-quality matting, and UV-protective glass. Built to last generations.
              </p>
            </div>
            <div className="bg-background rounded-lg p-8 border border-border">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="font-semibold text-lg mb-3">Experience</h3>
              <p className="text-muted-foreground text-sm">
                Years of framing expertise. Our team is passionate about creating the perfect display solution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="px-4 py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center space-y-8">
          <div className="space-y-4">
            <h2 className="font-serif text-3xl font-bold">Get in Touch</h2>
            <p className="text-muted-foreground">
              Have questions? Our team is here to help you create the perfect frame.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a 
              href="tel:1-888-874-7156"
              className="p-6 rounded-lg border border-border hover:border-accent transition-colors text-left"
            >
              <div className="font-semibold mb-2">📞 Call Us</div>
              <div className="text-muted-foreground">1 (888) 874-7156</div>
            </a>
            <a 
              href="mailto:hello@ShadowboxFrames.com"
              className="p-6 rounded-lg border border-border hover:border-accent transition-colors text-left"
            >
              <div className="font-semibold mb-2">📧 Email Us</div>
              <div className="text-muted-foreground">hello@ShadowboxFrames.com</div>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
