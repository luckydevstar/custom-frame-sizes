"use client";

import { useState } from "react";
import { Button, Input, Label, Textarea } from "@framecraft/ui";

type ContactFormProps = {
  contactEmail: string;
  contactPhone: string;
};

export function ContactForm({
  contactEmail: _contactEmail,
  contactPhone: _contactPhone,
}: ContactFormProps) {
  const [formStartTime] = useState(Date.now());
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    honeypot: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const timeElapsed = Date.now() - formStartTime;
    if (timeElapsed < 2000) {
      setStatus("error");
      return;
    }
    if (formData.honeypot) return;

    setStatus("success");
    setFormData({ name: "", email: "", phone: "", subject: "", message: "", honeypot: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (status === "success") {
    return (
      <div className="p-6 rounded-lg border bg-card text-center">
        <p className="text-lg font-semibold text-foreground">Message Sent!</p>
        <p className="text-muted-foreground mt-2">We&apos;ll get back to you within 24 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input
        type="text"
        name="honeypot"
        value={formData.honeypot}
        onChange={handleChange}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
      />
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          minLength={2}
          value={formData.name}
          onChange={handleChange}
          data-testid="input-name"
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
          onChange={handleChange}
          data-testid="input-email"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone (optional)</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          data-testid="input-phone"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="subject">Subject *</Label>
        <Input
          id="subject"
          name="subject"
          type="text"
          required
          minLength={5}
          value={formData.subject}
          onChange={handleChange}
          data-testid="input-subject"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          name="message"
          required
          minLength={20}
          maxLength={2000}
          rows={6}
          value={formData.message}
          onChange={handleChange}
          data-testid="input-message"
        />
        <p className="text-xs text-muted-foreground">{formData.message.length} / 2000 characters</p>
      </div>
      {status === "error" && (
        <p className="text-sm text-destructive">Please take your time filling out the form.</p>
      )}
      <Button type="submit" className="w-full" data-testid="button-submit-contact">
        Send Message
      </Button>
    </form>
  );
}
