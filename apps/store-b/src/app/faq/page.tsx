import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | ShadowboxFrames.com",
  description: "Frequently asked questions about custom shadowbox frames, sizing, materials, and ordering.",
};

export default function FAQ() {
  const faqs = [
    {
      question: "What sizes can I order?",
      answer: "We offer completely custom sizing from 5×7 up to 36×48 inches, with precision to 1/8 inch increments. This allows you to get exactly the size you need.",
    },
    {
      question: "How deep are shadowbox frames?",
      answer: "Choose your frame depth from ¾ inch to 3 inches depending on what you're displaying. Jerseys and memorabilia typically use 1.5\" or 2\" depth.",
    },
    {
      question: "What materials do you use?",
      answer: "We use premium hardwoods for frame construction, museum-quality matting, and offer both standard and UV-protective glass options. All materials are carefully selected for durability.",
    },
    {
      question: "How long does production take?",
      answer: "Most orders ship within 2-3 weeks from order confirmation. Rush options are available for an additional fee. Contact us for specific timeline needs.",
    },
    {
      question: "Can I see a preview before ordering?",
      answer: "Yes! Our online designer lets you customize your frame and see a real-time preview. What you see is what you'll receive.",
    },
    {
      question: "Do you offer custom matting?",
      answer: "Absolutely. We have 50+ mat colors available and can create custom mat layouts for your specific display.",
    },
    {
      question: "What's your return policy?",
      answer: "We stand behind our work. If you're not satisfied with your frame, contact us within 30 days. We'll make it right.",
    },
    {
      question: "Do you ship internationally?",
      answer: "Currently we ship within the United States. Contact us to discuss international shipping options for your specific order.",
    },
  ];

  return (
    <div className="space-y-0">
      {/* Page Header */}
      <section className="bg-gradient-to-b from-card to-background px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl text-center space-y-4">
          <h1 className="font-serif text-4xl md:text-5xl font-bold">Frequently Asked Questions</h1>
          <p className="text-lg text-muted-foreground">
            Find answers to common questions about our custom shadowbox frames.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="px-4 py-16 md:py-24">
        <div className="mx-auto max-w-3xl">
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group rounded-lg border border-border bg-card overflow-hidden hover:border-accent transition-colors"
              >
                <summary className="flex items-center justify-between px-6 py-4 cursor-pointer select-none">
                  <h3 className="font-semibold text-lg pr-4">{faq.question}</h3>
                  <span className="flex-shrink-0 text-accent transition-transform duration-300 group-open:rotate-180">
                    ▼
                  </span>
                </summary>
                <div className="px-6 pb-4 pt-0 text-muted-foreground">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>

          {/* Contact Prompt */}
          <div className="mt-12 p-8 rounded-lg bg-muted/50 border border-border text-center space-y-4">
            <h3 className="font-semibold text-lg">Didn't find your answer?</h3>
            <p className="text-muted-foreground">
              Have a specific question about your custom frame project? Our team is here to help.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2 font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
