'use client';

import { useState } from 'react';
import type { Metadata } from 'next';

export const metadata = {
  title: "Contact Us | ShadowboxFrames.com",
  description: "Get in touch with ShadowboxFrames.com. Contact our team with questions about custom shadowbox frames.",
};

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrate with actual form submission service
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div className="space-y-0">
      {/* Page Header */}
      <section className="bg-gradient-to-b from-card to-background px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl text-center space-y-4">
          <h1 className="font-serif text-4xl md:text-5xl font-bold">Contact Us</h1>
          <p className="text-lg text-muted-foreground">
            Have questions? We'd love to hear from you. Get in touch with our team.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="font-serif text-2xl font-bold mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                  placeholder="Tell us more..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Send Message
              </button>

              {submitted && (
                <div className="p-4 rounded-lg bg-green-50 text-green-800 text-sm">
                  Thank you! We'll get back to you soon.
                </div>
              )}
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <h2 className="font-serif text-2xl font-bold">Get in Touch</h2>

            <div className="space-y-2">
              <h3 className="font-semibold">Phone</h3>
              <a href="tel:1-888-874-7156" className="text-accent hover:text-accent/80 transition-colors">
                1 (888) 874-7156
              </a>
              <p className="text-sm text-muted-foreground">
                Available Monday–Friday, 9 AM–5 PM EST
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Email</h3>
              <a href="mailto:hello@ShadowboxFrames.com" className="text-accent hover:text-accent/80 transition-colors">
                hello@ShadowboxFrames.com
              </a>
              <p className="text-sm text-muted-foreground">
                We typically respond within 24 hours
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Business Hours</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Monday–Friday: 9 AM–5 PM EST</p>
                <p>Saturday–Sunday: Closed</p>
              </div>
            </div>

            <div className="pt-6 border-t border-border space-y-4">
              <p className="text-sm text-muted-foreground">
                For custom frame inquiries, design consultations, or bulk orders, please reach out to us directly. 
                Our team is excited to help you create the perfect shadowbox frame.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
