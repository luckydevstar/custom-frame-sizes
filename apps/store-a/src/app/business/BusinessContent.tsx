"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Store,
  Trophy,
  GraduationCap,
  Hotel,
  Palette,
  Users,
  Check,
  ArrowRight,
  Mail,
  Phone,
  DollarSign,
  Ruler,
  ChevronDown,
  ChevronUp,
  MapPin,
} from "lucide-react";
import {
  Button,
  Card,
  Badge,
  Input,
  Label,
  Textarea,
  Checkbox,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@framecraft/ui";

const faqItems = [
  {
    question: "Do you offer wholesale or volume pricing?",
    answer:
      "Yes. We offer volume pricing for businesses ordering in bulk or running repeat programs. Share your quantities, sizes, and timeline and we'll quote the best available pricing.",
  },
  {
    question: "Can we reorder the exact same frame later?",
    answer:
      "Yes. We can repeat the same specs for consistent results across reorders and ongoing programs.",
  },
  {
    question: "How fast can you produce business orders?",
    answer:
      "Standard production typically ships in 3–7 business days. Rush production may be available by request for an additional fee.",
  },
  {
    question: "Do you offer expedited shipping at checkout?",
    answer:
      "Not by default. If you have a deadline, we can quote rush production and expedited carrier options case-by-case.",
  },
  {
    question: "Do you offer local pickup or drop-off?",
    answer:
      "Yes. Free local pickup and drop-off are available at 6 Shirley Ave, Somerset NJ 08873. Appointments are preferred to ensure smooth access.",
  },
  {
    question: "Can you frame jerseys or customer-provided memorabilia?",
    answer:
      "Yes. We offer professional framing for jerseys and memorabilia. Contact us with details and we'll recommend the best build.",
  },
  {
    question: "Are custom business orders returnable?",
    answer:
      "Because items are custom-made, they're final sale when produced correctly to your specifications. If anything arrives damaged or has a defect, we will make it right.",
  },
];

export function BusinessContent() {
  const [formData, setFormData] = useState({
    fullName: "",
    company: "",
    email: "",
    phone: "",
    framingType: "",
    quantity: "",
    notes: "",
    needByDate: "",
    rushRequested: false,
    localPickup: false,
    company_website: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, framingType: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.company_website) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/business-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) setIsSubmitted(true);
    } catch {
      // On network error, leave form visible so user can retry
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-background border-b">
        <div className="container mx-auto px-4 py-12 lg:py-16">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Badge className="mb-2" data-testid="badge-b2b">
              Business Solutions
            </Badge>
            <h1 className="text-3xl lg:text-5xl font-bold tracking-tight">
              Scalable Custom Framing for Businesses
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
              Exact sizes. Consistent results. Built for bulk orders, reorders, and time-sensitive
              programs — without retail framing headaches.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground pt-2">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-primary" />
                Volume pricing &amp; repeatable specs
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-primary" />
                Oversize, certificates, jerseys &amp; memorabilia
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-primary" />
                Free local pickup in Somerset, NJ
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Button
                size="lg"
                onClick={() => scrollToSection("quote-form")}
                data-testid="button-get-quote"
              >
                Get a Business Quote
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollToSection("who-we-work-with")}
                data-testid="button-view-solutions"
              >
                View Business Solutions
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground pt-2">
              Standard production typically ships in 3–7 business days. Rush available by request.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 lg:py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-bold mb-3">What You Get</h2>
            <p className="text-muted-foreground">Real benefits for business customers</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Named Account Support</h3>
              <p className="text-sm text-muted-foreground">
                Work with a real person who learns your specs and helps you place orders faster —
                especially for repeat programs and bulk runs.
              </p>
            </Card>
            <Card className="p-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Predictable Volume Pricing</h3>
              <p className="text-sm text-muted-foreground">
                Get pricing built for 10, 100, or 1,000+ units. Reorder the same specs with
                consistent unit costs and fewer surprises.
              </p>
            </Card>
            <Card className="p-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Ruler className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Exact-Size Manufacturing</h3>
              <p className="text-sm text-muted-foreground">
                Fractional, odd, and oversized dimensions welcome. No rounding — we build to the
                size you specify, every time.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section id="who-we-work-with" className="bg-muted/30 py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl lg:text-3xl font-bold mb-3">Who We Work With</h2>
              <p className="text-muted-foreground">Businesses that need custom framing at scale</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Store className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Comic &amp; Collectible Shops</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Offer framing to your customers. Display graded slabs. Frame vintage covers.
                    </p>
                    <ul className="text-sm space-y-1.5">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>CGC/CBCS slab depths available</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Multi-comic layouts for wall displays</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Resell to customers or display inventory</span>
                      </li>
                    </ul>
                    <Link
                      href="/comic-book-frames"
                      className="text-primary hover:underline text-sm font-medium inline-flex items-center mt-3"
                      data-testid="link-learn-comic"
                    >
                      See Comic Framing <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </Card>
              <Card className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Trophy className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Sports Teams</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Frame jerseys for fundraisers. Display team history. Retirement gifts.
                    </p>
                    <ul className="text-sm space-y-1.5">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>All jersey sizes (youth to 5XL)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Team color mat options</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Brass plaques for names and dates</span>
                      </li>
                    </ul>
                    <Link
                      href="/jersey-frames"
                      className="text-primary hover:underline text-sm font-medium inline-flex items-center mt-3"
                      data-testid="link-learn-jersey"
                    >
                      See Jersey Framing <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </Card>
              <Card className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Schools &amp; Universities</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Diploma framing programs. Hall of fame displays. Award ceremonies.
                    </p>
                    <ul className="text-sm space-y-1.5">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>School color mat combinations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Bulk diploma frame orders</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Standard or custom diploma sizes</span>
                      </li>
                    </ul>
                    <Link
                      href="/diploma-certificate-frames"
                      className="text-primary hover:underline text-sm font-medium inline-flex items-center mt-3"
                      data-testid="link-learn-diploma"
                    >
                      See Diploma Framing <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </Card>
              <Card className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Hotel className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Hotels &amp; Restaurants</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Match your brand. Fill your walls. Consistent look across all locations.
                    </p>
                    <ul className="text-sm space-y-1.5">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Same frame style for 100+ pieces</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Any size for custom artwork</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Quick reorders for new properties</span>
                      </li>
                    </ul>
                    <Link
                      href="/"
                      className="text-primary hover:underline text-sm font-medium inline-flex items-center mt-3"
                      data-testid="link-learn-frames"
                    >
                      Browse All Frames <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </Card>
              <Card className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Palette className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Interior Designers</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Get exact sizes for client projects. No compromise. Professional results.
                    </p>
                    <ul className="text-sm space-y-1.5">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Match any design aesthetic</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Gallery wall coordination</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Fast turnaround for staging</span>
                      </li>
                    </ul>
                    <Link
                      href="/picture-frames"
                      className="text-primary hover:underline text-sm font-medium inline-flex items-center mt-3"
                      data-testid="link-learn-gallery"
                    >
                      Design Custom Frames <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </Card>
              <Card className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Corporate Offices</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Frame certificates, awards, and lobby art. Professional presentation.
                    </p>
                    <ul className="text-sm space-y-1.5">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Brand color mat options</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Employee recognition programs</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Recurring orders for new hires</span>
                      </li>
                    </ul>
                    <Link
                      href="/certificate-frames"
                      className="text-primary hover:underline text-sm font-medium inline-flex items-center mt-3"
                      data-testid="link-learn-certificate"
                    >
                      Browse Certificate Frames <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </Card>
            </div>
            <div className="mt-8 rounded-lg border bg-muted/50 p-4 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <p className="font-semibold">Need bulk pricing or repeatable specs?</p>
                <p className="text-sm text-muted-foreground">
                  Tell us quantities, sizes, and timeline — we&apos;ll reply within 1 business day.
                </p>
              </div>
              <Button
                onClick={() => scrollToSection("quote-form")}
                data-testid="button-inline-quote"
              >
                Request a Quote
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="quote-form" className="container mx-auto px-4 py-12 lg:py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-bold mb-3">Get a Business Quote</h2>
            <p className="text-muted-foreground">
              Tell us what you need — sizes, quantities, deadline, and any special requirements.
              We&apos;ll reply within 1 business day.
            </p>
          </div>
          {isSubmitted ? (
            <Card className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-primary" />
              </div>
              <p className="text-lg font-semibold mb-2">Thanks — we received your request.</p>
              <p className="text-muted-foreground">We&apos;ll respond within 1 business day.</p>
            </Card>
          ) : (
            <Card className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      data-testid="input-fullname"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company / Organization *</Label>
                    <Input
                      id="company"
                      name="company"
                      required
                      value={formData.company}
                      onChange={handleInputChange}
                      data-testid="input-company"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      data-testid="input-email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      data-testid="input-phone"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="framingType">What are you framing? *</Label>
                    <Select
                      value={formData.framingType}
                      onValueChange={handleSelectChange}
                      required
                    >
                      <SelectTrigger data-testid="select-framing-type">
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="certificates">Certificates</SelectItem>
                        <SelectItem value="posters-prints">Posters &amp; Prints</SelectItem>
                        <SelectItem value="jerseys">Jerseys</SelectItem>
                        <SelectItem value="memorabilia">Memorabilia</SelectItem>
                        <SelectItem value="slabbed-collectibles">Slabbed Collectibles</SelectItem>
                        <SelectItem value="artwork">Artwork</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity *</Label>
                    <Input
                      id="quantity"
                      name="quantity"
                      type="number"
                      min={1}
                      required
                      value={formData.quantity}
                      onChange={handleInputChange}
                      data-testid="input-quantity"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="notes">Size(s) or notes *</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      required
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Include dimensions, special requirements, or any other details"
                      className="min-h-[100px]"
                      data-testid="textarea-notes"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="needByDate">Need-by date</Label>
                    <Input
                      id="needByDate"
                      name="needByDate"
                      type="date"
                      value={formData.needByDate}
                      onChange={handleInputChange}
                      data-testid="input-needby-date"
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="rushRequested"
                        checked={formData.rushRequested}
                        onCheckedChange={(c) => handleCheckboxChange("rushRequested", c as boolean)}
                        data-testid="checkbox-rush"
                      />
                      <Label htmlFor="rushRequested" className="font-normal cursor-pointer">
                        Rush requested?
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="localPickup"
                        checked={formData.localPickup}
                        onCheckedChange={(c) => handleCheckboxChange("localPickup", c as boolean)}
                        data-testid="checkbox-pickup"
                      />
                      <Label htmlFor="localPickup" className="font-normal cursor-pointer">
                        Local pickup or drop-off?
                      </Label>
                    </div>
                  </div>
                </div>
                <input
                  type="text"
                  name="company_website"
                  value={formData.company_website}
                  onChange={handleInputChange}
                  style={{ position: "absolute", left: "-9999px" }}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden
                />
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                  data-testid="button-submit-quote"
                >
                  {isSubmitting ? "Submitting..." : "Request Quote"}
                </Button>
              </form>
            </Card>
          )}
          <p className="text-sm text-muted-foreground text-center mt-4">
            Custom-made items are final sale when produced correctly. We&apos;ll always fix defects
            or shipping damage.
          </p>
        </div>
      </section>

      <section className="bg-muted/30 py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl lg:text-3xl font-bold mb-3">How It Works</h2>
              <p className="text-muted-foreground">Simple process for business orders</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto font-bold text-lg">
                  1
                </div>
                <h3 className="font-semibold">Contact Us</h3>
                <p className="text-sm text-muted-foreground">
                  Email us with what you need. We&apos;ll respond same day with options and pricing.
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto font-bold text-lg">
                  2
                </div>
                <h3 className="font-semibold">Review Quote</h3>
                <p className="text-sm text-muted-foreground">
                  We send a detailed quote with volume pricing. Approve and we start production.
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto font-bold text-lg">
                  3
                </div>
                <h3 className="font-semibold">Receive Frames</h3>
                <p className="text-sm text-muted-foreground">
                  Production typically completes in 3–7 business days, then ships via standard
                  service. Rush options may be available by request.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 lg:py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-bold mb-3">Business FAQs</h2>
          </div>
          <div className="space-y-3">
            {faqItems.map((item, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <button
                  type="button"
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50"
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  data-testid={`faq-question-${index}`}
                >
                  <span className="font-medium pr-4">{item.question}</span>
                  {openFaqIndex === index ? (
                    <ChevronUp className="w-5 h-5 flex-shrink-0 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 flex-shrink-0 text-muted-foreground" />
                  )}
                </button>
                {openFaqIndex === index && (
                  <div className="px-4 pb-4">
                    <p className="text-sm text-muted-foreground">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-primary/10 via-background to-background border-t py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-2xl lg:text-3xl font-bold">
              Ready to standardize your framing program?
            </h2>
            <div className="flex flex-col items-center gap-2">
              <Button
                size="lg"
                onClick={() => scrollToSection("quote-form")}
                data-testid="button-final-quote"
              >
                Request a Quote
              </Button>
              <p className="text-sm text-muted-foreground">Reply within 1 business day.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 text-sm text-muted-foreground">
              <a
                href="mailto:hello@customframesizes.com"
                className="flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <Mail className="w-4 h-4" />
                hello@customframesizes.com
              </a>
              <a
                href="tel:+18888747156"
                className="flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <Phone className="w-4 h-4" />1 (888) 874-7156
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />6 Shirley Ave, Somerset NJ 08873
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
