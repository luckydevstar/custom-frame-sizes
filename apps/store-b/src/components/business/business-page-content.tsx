"use client";

import Link from "next/link";
import { useState } from "react";

import {
  Badge,
  Button,
  Card,
  Checkbox,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@framecraft/ui";
import { 
  Shield, 
  Trophy, 
  Heart, 
  Building2,
  Users,
  Check,
  ArrowRight,
  Mail,
  Phone,
  Handshake,
  Layers,
  ChevronDown,
  ChevronUp,
  MapPin
} from 'lucide-react';

const faqItems = [
  {
    question: "How does volume pricing work for shadow box orders?",
    answer: "We quote based on quantity, size, depth, and materials. Share your specs and quantities, and we will build a custom price sheet. Reorders use the same pricing unless materials or specs change."
  },
  {
    question: "Can each shadow box in a batch be customized differently?",
    answer: "Yes. We can adjust backing colors, mat colors, nameplate text, and depth within the same order. Every box is built individually, so personalization is part of the process."
  },
  {
    question: "What is the typical turnaround for program orders?",
    answer: "Standard production ships in 5 to 7 business days. For larger orders or tight deadlines, contact us early so we can plan production around your schedule."
  },
  {
    question: "Do you handle the items being displayed, or do we send them separately?",
    answer: "We build the shadow box to your specifications. You arrange and mount the items yourself, or we can discuss assembly options for certain projects. Every frame ships with mounting hardware included."
  },
  {
    question: "Can we set up a standing reorder for recurring events?",
    answer: "Absolutely. We keep your specs on file so reorders are fast and consistent. Just tell us the quantity and any updates, and we handle the rest."
  },
  {
    question: "Are program orders returnable?",
    answer: "Because every shadow box is handcrafted to your exact specifications, program orders are final sale when produced correctly. If anything arrives damaged or has a defect, we make it right."
  }
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqItems.map(item => ({
    "@type": "Question",
    "name": item.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": item.answer
    }
  }))
};

export function BusinessPageContent() {
  const [formData, setFormData] = useState({
    fullName: '',
    company: '',
    email: '',
    phone: '',
    framingType: '',
    quantity: '',
    notes: '',
    needByDate: '',
    rushRequested: false,
    localPickup: false,
    company_website: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, framingType: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.company_website) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/business-quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        const submitEvent = new CustomEvent('business_form_submit');
        document.dispatchEvent(submitEvent);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/5 via-background to-background border-b">
          <div className="container mx-auto px-4 py-12 lg:py-16">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <Badge className="mb-2" data-testid="badge-b2b">Shadow Box Programs</Badge>
              <h1 className="text-3xl lg:text-5xl font-bold tracking-tight">
                Shadow Box Programs for Teams, Traditions, and Milestones
              </h1>
              <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
                Every shadow box holds a story. Whether you need ten for a retirement ceremony or two hundred for a season of champions, we handcraft each one with the same care and attention.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground pt-2">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-primary" />
                  Handcrafted to your exact specifications
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-primary" />
                  Volume pricing with bespoke options
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-primary" />
                  Free local pickup in Somerset, NJ
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <div className="flex flex-col items-center">
                  <Button 
                    size="lg" 
                    onClick={() => scrollToSection('quote-form')}
                    data-testid="button-get-quote"
                    data-event="business_cta_click"
                  >
                    Request a Program Quote
                  </Button>
                  <span className="text-xs text-muted-foreground mt-1.5">Response within 1 business day</span>
                </div>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => scrollToSection('who-orders')}
                  data-testid="button-view-solutions"
                >
                  See Who We Work With
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              <p className="text-sm text-muted-foreground pt-2">
                Standard production ships in 5 to 7 business days. Rush available by request.
              </p>
            </div>
          </div>
        </section>

        {/* What a Shadow Box Program Looks Like */}
        <section className="container mx-auto px-4 py-12 lg:py-16">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl lg:text-3xl font-bold mb-3">What a Shadow Box Program Looks Like</h2>
              <p className="text-muted-foreground">A curated process built around your needs</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">A Dedicated Contact</h3>
                <p className="text-sm text-muted-foreground">
                  One person learns your program, remembers your specs, and handles every order personally. No call centers. No ticket queues.
                </p>
              </Card>

              <Card className="p-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Layers className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Depth Options for Any Object</h3>
                <p className="text-sm text-muted-foreground">
                  From 0.875 inches for flat memorabilia to 3.5 inches for folded jerseys or thick keepsakes. We match the box to what goes inside.
                </p>
              </Card>

              <Card className="p-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Handshake className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Personalization at Volume</h3>
                <p className="text-sm text-muted-foreground">
                  Backing colors, mat choices, and nameplate text can differ from box to box within a single order. Each one is built individually.
                </p>
              </Card>

              <Card className="p-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Archival Materials</h3>
                <p className="text-sm text-muted-foreground">
                  Acid-free matting, UV-protective glazing, and solid wood construction protect the items inside for years to come.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Built by Hand, Consistent by Design */}
        <section className="bg-muted/30 py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-2xl lg:text-3xl font-bold mb-3">Built by Hand, Consistent by Design</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Volume does not mean assembly line. Every shadow box is handcrafted in our workshop, cut and assembled to the same standard whether it is the first in a batch or the fiftieth.
                  </p>
                  <p className="text-muted-foreground">
                    We keep detailed records of your specs so reorders match the originals exactly. Same moulding profile. Same mat color. Same depth. Your recipients see identical quality every time.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">Specs stored on file for fast, accurate reorders</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">Each box inspected individually before shipping</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">Solid wood frames, not particleboard or MDF</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">Protective packaging designed for safe delivery</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Who Orders Shadow Boxes in Volume */}
        <section id="who-orders" className="container mx-auto px-4 py-12 lg:py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl lg:text-3xl font-bold mb-3">Who Orders Shadow Boxes in Volume</h2>
              <p className="text-muted-foreground">Programs we have built for organizations like yours</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Military Units */}
              <Card className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Military Units and Veterans Organizations</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Retirement shadow boxes are a tradition. We build them with the depth and care the occasion deserves.
                    </p>
                    <ul className="text-sm space-y-1.5">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Branch-specific backing and mat colors</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Deep profiles for medals, patches, and rank insignia</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Brass nameplates with custom engraving</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Recurring orders for annual ceremonies</span>
                      </li>
                    </ul>
                    <Link 
                      href="/shadowbox" 
                      className="text-primary hover:underline text-sm font-medium inline-flex items-center mt-3"
                      data-testid="link-learn-military"
                    >
                      Design a Shadow Box <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </Card>

              {/* Sports Teams */}
              <Card className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Trophy className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Sports Teams and Athletic Programs</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Championship jerseys, team photos, game-worn gear. We frame the season so it lasts.
                    </p>
                    <ul className="text-sm space-y-1.5">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Jersey shadow boxes from youth to 5XL</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Team-colored mats and coordinated backing</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Batch orders for end-of-season awards</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>UV-protective glazing to prevent fading</span>
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

              {/* Event Planners */}
              <Card className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Heart className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Event Planners and Wedding Professionals</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Preserved bouquets, invitation keepsakes, ceremony mementos. We help your clients hold onto the day.
                    </p>
                    <ul className="text-sm space-y-1.5">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Extra-deep profiles for pressed bouquets</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Bespoke mat and backing combinations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Invitation and program framing add-ons</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Referral-friendly pricing for repeat clients</span>
                      </li>
                    </ul>
                    <Link 
                      href="/bouquet-frames" 
                      className="text-primary hover:underline text-sm font-medium inline-flex items-center mt-3"
                      data-testid="link-learn-bouquet"
                    >
                      See Bouquet Framing <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </Card>

              {/* Corporate Recognition */}
              <Card className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Corporate Recognition and Awards Programs</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Service milestones, employee awards, retirement gifts. A handcrafted shadow box says more than a plaque.
                    </p>
                    <ul className="text-sm space-y-1.5">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Company-branded mat and backing options</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Consistent styling across all recipients</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Recurring orders for quarterly or annual programs</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Personalized nameplates per box</span>
                      </li>
                    </ul>
                    <Link 
                      href="/shadowbox" 
                      className="text-primary hover:underline text-sm font-medium inline-flex items-center mt-3"
                      data-testid="link-learn-corporate"
                    >
                      Design a Shadow Box <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </Card>
            </div>

            {/* Inline CTA */}
            <div className="mt-8 rounded-lg border bg-muted/50 p-4 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <p className="font-semibold">Have a program in mind?</p>
                <p className="text-sm text-muted-foreground">Tell us quantities, sizes, and timeline. We will reply within 1 business day.</p>
              </div>
              <Button 
                onClick={() => scrollToSection('quote-form')}
                data-testid="button-inline-quote"
              >
                Request a Program Quote
              </Button>
            </div>
          </div>
        </section>

        {/* Request a Program Quote Form */}
        <section 
          id="quote-form" 
          className="bg-muted/30 py-12 lg:py-16"
          data-event="business_form_view"
        >
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-2xl lg:text-3xl font-bold mb-3">Request a Program Quote</h2>
                <p className="text-muted-foreground">Tell us what you are framing, how many you need, and when you need them. We will respond within 1 business day with pricing and options.</p>
              </div>

              {isSubmitted ? (
                <Card className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-lg font-semibold mb-2">Thanks, we received your request.</p>
                  <p className="text-muted-foreground">We will respond within 1 business day.</p>
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
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={handleInputChange}
                          data-testid="input-fullname"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="company">Organization *</Label>
                        <Input
                          id="company"
                          name="company"
                          type="text"
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
                        <Label htmlFor="framingType">What are you displaying? *</Label>
                        <Select
                          value={formData.framingType}
                          onValueChange={handleSelectChange}
                          required
                        >
                          <SelectTrigger data-testid="select-framing-type">
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="jerseys">Jerseys</SelectItem>
                            <SelectItem value="military-memorabilia">Military Memorabilia</SelectItem>
                            <SelectItem value="wedding-keepsakes">Wedding Keepsakes</SelectItem>
                            <SelectItem value="awards-recognition">Awards and Recognition</SelectItem>
                            <SelectItem value="sports-memorabilia">Sports Memorabilia</SelectItem>
                            <SelectItem value="collectibles">Collectibles</SelectItem>
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
                          min="1"
                          required
                          value={formData.quantity}
                          onChange={handleInputChange}
                          data-testid="input-quantity"
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="notes">Sizes, depths, or notes *</Label>
                        <Textarea
                          id="notes"
                          name="notes"
                          required
                          value={formData.notes}
                          onChange={handleInputChange}
                          placeholder="Include dimensions, depth needed, backing or mat preferences, and any other details"
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
                            onCheckedChange={(checked) => handleCheckboxChange('rushRequested', checked as boolean)}
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
                            onCheckedChange={(checked) => handleCheckboxChange('localPickup', checked as boolean)}
                            data-testid="checkbox-pickup"
                          />
                          <Label htmlFor="localPickup" className="font-normal cursor-pointer">
                            Local pickup or drop-off?
                          </Label>
                        </div>
                      </div>
                    </div>

                    {/* Honeypot field */}
                    <input
                      type="text"
                      name="company_website"
                      value={formData.company_website}
                      onChange={handleInputChange}
                      style={{ position: 'absolute', left: '-9999px' }}
                      tabIndex={-1}
                      autoComplete="off"
                    />

                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full"
                      disabled={isSubmitting}
                      data-testid="button-submit-quote"
                    >
                      {isSubmitting ? 'Submitting...' : 'Request a Program Quote'}
                    </Button>
                  </form>
                </Card>
              )}

              <p className="text-sm text-muted-foreground text-center mt-4">
                Every shadow box is handcrafted to order. Program orders are final sale when produced correctly. We always fix defects or shipping damage.
              </p>
            </div>
          </div>
        </section>

        {/* From First Order to Reorder */}
        <section className="container mx-auto px-4 py-12 lg:py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl lg:text-3xl font-bold mb-3">From First Order to Reorder</h2>
              <p className="text-muted-foreground">A simple, personal process</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto font-bold text-lg">
                  1
                </div>
                <h3 className="font-semibold">Tell Us the Story</h3>
                <p className="text-sm text-muted-foreground">
                  What are you framing, and how many do you need? Share sizes, depth requirements, and your timeline.
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto font-bold text-lg">
                  2
                </div>
                <h3 className="font-semibold">Review Your Quote</h3>
                <p className="text-sm text-muted-foreground">
                  We send a detailed quote with pricing, material options, and a production timeline. Approve when ready.
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto font-bold text-lg">
                  3
                </div>
                <h3 className="font-semibold">We Build by Hand</h3>
                <p className="text-sm text-muted-foreground">
                  Each shadow box is handcrafted individually. Production typically takes 5 to 7 business days.
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto font-bold text-lg">
                  4
                </div>
                <h3 className="font-semibold">Reorder Anytime</h3>
                <p className="text-sm text-muted-foreground">
                  Your specs stay on file. Next time, just tell us the quantity and any updates. Same quality, no setup.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Questions About Shadow Box Programs */}
        <section className="bg-muted/30 py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-2xl lg:text-3xl font-bold mb-3">Questions About Shadow Box Programs</h2>
              </div>

              <div className="space-y-3">
                {faqItems.map((item, index) => (
                  <div 
                    key={index} 
                    className="border rounded-lg overflow-hidden"
                  >
                    <button
                      className="w-full flex items-center justify-between p-4 text-left hover-elevate"
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
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-background border-t py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-2xl lg:text-3xl font-bold">Let Us Build Your Program</h2>
              <p className="text-muted-foreground">
                Every shadow box has a story. Let us help you tell yours, whether it is one box or five hundred.
              </p>
              <div className="flex flex-col items-center gap-2">
                <Button 
                  size="lg" 
                  onClick={() => scrollToSection('quote-form')}
                  data-testid="button-final-quote"
                >
                  Get Started
                </Button>
                <p className="text-sm text-muted-foreground">Reply within 1 business day.</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 text-sm text-muted-foreground">
                <a href="mailto:hello@shadowboxframes.com" className="flex items-center gap-2 hover:text-foreground transition-colors">
                  <Mail className="w-4 h-4" />
                  hello@shadowboxframes.com
                </a>
                <a href="tel:+18888747156" className="flex items-center gap-2 hover:text-foreground transition-colors">
                  <Phone className="w-4 h-4" />
                  1 (888) 874-7156
                </a>
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  6 Shirley Ave, Somerset NJ 08873
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
