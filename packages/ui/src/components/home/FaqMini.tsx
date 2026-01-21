import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Button } from "../ui/button";
import { useIntersectionAnimation } from "@framecraft/core";

export interface FAQ {
  question: string;
  answer: string;
}

interface FaqMiniProps {
  faqs?: FAQ[];
  faqPageLink?: string;
}

const defaultFaqs: FAQ[] = [
  {
    question: "What sizes do you offer?",
    answer:
      "We offer all standard frame sizes from 5×7 to 32×40, plus custom sizing to any dimension you need for a perfect fit.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Standard orders are handcrafted and shipped within 5-7 business days. Expedited shipping options are available at checkout.",
  },
  {
    question: "What's your return policy?",
    answer:
      "We offer a 30-day satisfaction guarantee. If you're not completely happy with your frame, contact us for a hassle-free return or exchange.",
  },
  {
    question: "Do you offer bulk discounts?",
    answer:
      "Yes! Orders of 10+ frames qualify for volume pricing. Contact our team for a custom quote on larger projects.",
  },
  {
    question: "What materials do you use?",
    answer:
      "All our frames use premium materials: solid wood construction, archival matting, and professional-grade glazing options including framer's grade acrylic.",
  },
];

export function FaqMini({ faqs = defaultFaqs, faqPageLink = "/faq" }: FaqMiniProps) {
  const titleRef = useIntersectionAnimation({ animationClass: "motion-fade-rise" });
  const accordionRef = useIntersectionAnimation({ animationClass: "motion-slide-in" });

  // Generate FAQPage JSON-LD schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      {/* FAQPage JSON-LD Schema */}
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <section className="max-w-4xl mx-auto px-6 py-8 md:py-12" data-testid="section-faq-mini">
        <div ref={titleRef} className="text-center mb-12">
          <h2
            className="font-serif text-3xl md:text-4xl font-semibold mb-4"
            data-testid="text-faq-title"
          >
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Quick answers to common questions about our custom frames
          </p>
        </div>

        <Accordion
          ref={accordionRef}
          type="single"
          collapsible
          className="mb-8"
          data-testid="accordion-faq"
        >
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              data-testid={`accordion-item-${index + 1}`}
            >
              <AccordionTrigger data-testid={`accordion-trigger-${index + 1}`}>
                {faq.question}
              </AccordionTrigger>
              <AccordionContent data-testid={`accordion-content-${index + 1}`}>
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="text-center">
          <Button variant="outline" asChild>
            <Link href={faqPageLink} data-testid="button-view-full-faq">
              View All FAQs
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
