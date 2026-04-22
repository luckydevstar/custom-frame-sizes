import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shadowbox Frame Gallery | ShadowboxFrames.com",
  description: "Browse our collection of handcrafted shadowbox frames. See real examples of custom frames for memorabilia, jerseys, dried bouquets, and more.",
};

export default function Gallery() {
  const galleryItems = [
    {
      id: 1,
      title: "Jersey Display",
      description: "Custom 24×36 frame perfect for sports memorabilia",
      image: "🏈",
    },
    {
      id: 2,
      title: "Dried Bouquet",
      description: "Preserve your wedding bouquet in an elegant frame",
      image: "💐",
    },
    {
      id: 3,
      title: "Military Medals",
      description: "Honor service with a professional display frame",
      image: "🎖️",
    },
    {
      id: 4,
      title: "Memorabilia",
      description: "Showcase your collection with pride",
      image: "✨",
    },
  ];

  return (
    <div className="space-y-0">
      {/* Page Header */}
      <section className="bg-gradient-to-b from-card to-background px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl text-center space-y-4">
          <h1 className="font-serif text-4xl md:text-5xl font-bold">Gallery</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our collection of custom shadowbox frames and get inspired for your next project.
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="px-4 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {galleryItems.map((item) => (
              <div key={item.id} className="rounded-lg overflow-hidden border border-border hover:border-accent transition-colors">
                <div className="aspect-video bg-muted flex items-center justify-center text-6xl">
                  {item.image}
                </div>
                <div className="p-6 bg-card">
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{item.description}</p>
                  <a href="/designer" className="inline-flex text-accent hover:text-accent/80 text-sm font-medium">
                    Create Similar →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-muted/50 px-4 py-16">
        <div className="mx-auto max-w-3xl text-center space-y-6">
          <h2 className="font-serif text-3xl font-bold">Don&apos;t see what you&apos;re looking for?</h2>
          <p className="text-muted-foreground">
            Create a completely custom shadowbox frame tailored to your vision.
          </p>
          <a href="/designer" className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            Design Your Frame
          </a>
        </div>
      </section>
    </div>
  );
}
