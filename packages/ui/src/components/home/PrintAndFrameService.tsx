"use client";

import { Upload, Printer, Frame, CheckCircle } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

export function PrintAndFrameService() {
  const steps = [
    { icon: Upload, label: "Upload" },
    { icon: Printer, label: "Print" },
    { icon: Frame, label: "Frame" },
    { icon: CheckCircle, label: "Deliver" },
  ];

  return (
    <section className="py-10 sm:py-12 bg-primary/5" data-testid="section-print-and-frame">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-card rounded-lg border p-6 sm:p-8">
            <div className="text-center mb-6">
              <h2
                className="font-serif text-2xl sm:text-3xl font-semibold mb-2"
                data-testid="text-print-heading"
              >
                Don&apos;t Have a Print Yet?
              </h2>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto mb-4">
                We&apos;ll professionally print your digital photos or artwork at any custom size,
                then frame it exactly to your specifications
              </p>

              {/* Process Steps */}
              <div className="flex items-center justify-center gap-3 sm:gap-6 mb-4">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-center gap-3 sm:gap-6">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 text-primary mb-1.5">
                        <step.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <p className="text-xs sm:text-sm font-medium">{step.label}</p>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="hidden sm:block w-8 h-0.5 bg-border" />
                    )}
                  </div>
                ))}
              </div>

              <p className="text-sm text-muted-foreground/80 mb-5">
                Upload your digital files, we handle the printing and framing
              </p>
            </div>

            <div className="flex items-center justify-center">
              <Link href="/print-and-frame">
                <Button size="default" data-testid="button-print-and-frame">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
