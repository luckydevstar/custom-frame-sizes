import Link from "next/link";
import { ArrowRight, Frame, Layers } from "lucide-react";

/** b-shadow-box-frames-original/client/src/components/home/WeAlsoOffer.tsx */
export function WeAlsoOffer() {
  const offerings = [
    {
      id: "picture-frames",
      title: "Picture Frames",
      description:
        "24+ styles with the same artisanal care we put into every shadow box. Quality mouldings, clean lines, and custom sizing.",
      href: "/picture-frames",
      icon: Frame,
    },
    {
      id: "canvas-frames",
      title: "Canvas Float Frames",
      description:
        "Float frames that let your canvas breathe. A clean, modern look with a signature floating reveal on all sides.",
      href: "/canvas-frames",
      icon: Layers,
    },
  ];

  return (
    <section className="py-10 sm:py-12 border-t" data-testid="section-we-also-offer">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h2
            className="font-serif text-xl sm:text-2xl font-semibold text-center mb-6"
            data-testid="text-also-offer-heading"
          >
            We Also Offer
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {offerings.map((item) => (
              <Link key={item.id} href={item.href}>
                <div
                  className="group flex items-start gap-4 p-5 rounded-lg border bg-card hover-elevate cursor-pointer"
                  data-testid={`card-also-offer-${item.id}`}
                >
                  <div className="rounded-full bg-primary/10 p-2.5 flex-shrink-0">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-1" data-testid={`text-also-offer-title-${item.id}`}>
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                    <span className="text-sm font-medium text-primary inline-flex items-center gap-1">
                      Browse Collection
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
