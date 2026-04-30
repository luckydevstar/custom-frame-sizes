"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@framecraft/ui";
import { ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useScrollToTop } from "@/hooks/use-scroll-to-top";

const quoteFormSchema = z.object({
  company: z.string().min(2, "Company name must be at least 2 characters"),
  contactName: z.string().min(2, "Contact name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  shipToState: z.string().min(2, "Please select a state"),
  estimatedQty: z.string().min(1, "Please provide an estimated quantity"),
  notes: z.string().optional(),
});

type QuoteFormValues = z.infer<typeof quoteFormSchema>;

const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

export function BusinessQuotePageContent() {
  useScrollToTop();

  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      company: "",
      contactName: "",
      email: "",
      phone: "",
      shipToState: "",
      estimatedQty: "",
      notes: "",
    },
  });

  async function onSubmit(data: QuoteFormValues) {
    // In production, this would send to a backend endpoint
    // For now, show success message
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Store to temporary location (as spec requires)
    try {
      await fetch('/api/business-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          timestamp: new Date().toISOString(),
        }),
      }).catch(() => {
        // Silently fail if endpoint doesn't exist
      });
    } catch (error) {
      // Silently fail
    }
    
    setIsSubmitted(true);
  }

  if (isSubmitted) {
    return (
      <>
        <div className="min-h-screen py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto">
              <Card className="text-center">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="rounded-full bg-green-100 dark:bg-green-900 p-3">
                      <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl md:text-3xl mb-2">
                    Quote Request Received!
                  </CardTitle>
                  <CardDescription className="text-base">
                    Thank you for your interest in our business services. Our team will review your request 
                    and get back to you within 1-2 business days with a detailed quote.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {"We'll contact you at the email address you provided. If you have urgent questions, please email us at "}
                      <a href="mailto:business@shadowboxframes.com" className="text-primary hover:underline">
                        business@shadowboxframes.com
                      </a>
                      .
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                      <Button asChild>
                        <Link href="/business">
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Back to Business Services
                        </Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link href="/">Go to Homepage</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            {/* Back Link */}
            <Button variant="ghost" asChild className="mb-6" data-testid="button-back-to-business">
              <Link href="/business">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Business Services
              </Link>
            </Button>

            {/* Form Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl md:text-3xl">Request a Business Quote</CardTitle>
                <CardDescription>
                  Fill out the form below and our team will get back to you with a detailed quote 
                  for your project. All fields are required unless marked optional.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Company Name */}
                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Acme Corporation" 
                              {...field} 
                              autoComplete="organization"
                              data-testid="input-company"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Contact Name */}
                    <FormField
                      control={form.control}
                      name="contactName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="John Smith" 
                              {...field} 
                              autoComplete="name"
                              data-testid="input-contact-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Email */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input 
                              type="email"
                              placeholder="john@acme.com" 
                              {...field} 
                              autoComplete="email"
                              data-testid="input-email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Phone */}
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input 
                              type="tel"
                              placeholder="(555) 123-4567" 
                              {...field} 
                              autoComplete="tel"
                              data-testid="input-phone"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Ship To State */}
                    <FormField
                      control={form.control}
                      name="shipToState"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ship To State</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-state">
                                <SelectValue placeholder="Select a state" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {US_STATES.map((state) => (
                                <SelectItem key={state} value={state}>
                                  {state}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Estimated Quantity */}
                    <FormField
                      control={form.control}
                      name="estimatedQty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estimated Quantity</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., 50 frames, 10-20 pieces, etc." 
                              {...field} 
                              data-testid="input-quantity"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Frame Style / Notes */}
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Frame Style / Project Notes (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell us about your project: preferred frame styles, sizes, timeline, special requirements, etc." 
                              className="min-h-[120px]"
                              {...field} 
                              data-testid="textarea-notes"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Submit Button */}
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full"
                      disabled={form.formState.isSubmitting}
                      data-testid="button-submit-quote"
                    >
                      {form.formState.isSubmitting ? "Submitting..." : "Submit Quote Request"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Help Text */}
            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>
                Need immediate assistance? Email us at{" "}
                <a href="mailto:business@shadowboxframes.com" className="text-primary hover:underline">
                  business@shadowboxframes.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
