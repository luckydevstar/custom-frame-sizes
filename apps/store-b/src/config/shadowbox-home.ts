import type { FAQ, HowItWorksConfig, WhyChooseUsConfig } from "@framecraft/ui";
import { Edit3, Eye, Flag, Package, RotateCcw, Ruler, ShoppingBag, Sparkles, Award } from "lucide-react";

/** b-shadow-box-frames-original/config/homeSections.config.ts — How It Works */
export const shadowboxHowItWorksConfig: HowItWorksConfig = {
  headline: "How We Build Your Shadow Box",
  subhead:
    "Every shadow box begins with a conversation. You tell us what you want to frame, and we guide you through depth, backing color, mat selection, and frame profile.",
  steps: [
    {
      icon: Edit3,
      title: "Set Your Dimensions",
      description:
        "Enter your exact width, height, and depth, down to 1/8 inch. We build the frame to fit.",
    },
    {
      icon: Sparkles,
      title: "Choose Your Materials",
      description:
        "Select your mat color, backing material, and glazing type to match what you're displaying.",
    },
    {
      icon: Eye,
      title: "Preview in Real Time",
      description: "Watch your shadow box frame update live as you customize every detail.",
    },
    {
      icon: ShoppingBag,
      title: "We Build & Ship",
      description:
        "We handcraft your shadow box frame and deliver it ready to hang with insured packaging.",
    },
  ],
};

/** b-shadow-box-frames-original — Value props / Our Story */
export const shadowboxValuePropsConfig: WhyChooseUsConfig = {
  headline: "Our Story: Why ShadowboxFrames.com",
  subhead: "We started ShadowboxFrames.com because shadow boxes deserve a specialist.",
  cards: [
    {
      icon: Flag,
      title: "Handcrafted in Our Workshop",
      description:
        "Every shadow box is built by hand with care and attention to detail, never mass-produced.",
    },
    {
      icon: Award,
      title: "Bespoke Depths & Sizes",
      description:
        "We build your shadow box around your keepsake, with the right depth and dimensions for a natural fit.",
    },
    {
      icon: Ruler,
      title: "Archival Protection",
      description:
        "Acid-free materials and UV-protective glazing keep your cherished items safe from fading and deterioration.",
    },
    {
      icon: Package,
      title: "Personal Design Guidance",
      description:
        "Our team helps you choose backing colors, mat options, and layouts that bring your story to life.",
    },
    {
      icon: RotateCcw,
      title: "Made in the USA",
      description:
        "Crafted with pride in our American workshop using responsibly sourced materials.",
    },
  ],
};

/** b-shadow-box-frames-original/client/src/components/home/FaqMini.tsx */
export const shadowboxHomeFaqs: FAQ[] = [
  {
    question: "What can I frame in a shadow box?",
    answer:
      "Almost anything with sentimental value. Popular items include military medals, sports jerseys, wedding keepsakes, baby shoes, travel souvenirs, dried flowers, concert tickets, and family heirlooms. If it matters to you, we can build a shadow box for it.",
  },
  {
    question: "How deep are your shadow box frames?",
    answer:
      "We offer shadow boxes in a range of depths from three-quarters of an inch to four inches, and we can create bespoke depths for bulkier items like baseballs, ballet shoes, or folded flags. Just tell us what you are framing and we will recommend the ideal depth.",
  },
  {
    question: "How do I know which shadow box size to order?",
    answer:
      "Share the dimensions of your keepsake with our team and we will help you choose a size that frames your items with the right amount of breathing room. We also offer bespoke sizing so your shadow box is built around your specific objects.",
  },
  {
    question: "Do your shadow boxes come with UV-protective glass?",
    answer:
      "Yes. Every shadow box includes UV-protective glazing to shield your keepsakes from light damage. We also offer upgraded acrylic glazing for lighter weight and added shatter resistance.",
  },
  {
    question: "How long does it take to receive my shadow box?",
    answer:
      "Most shadow boxes ship within seven to ten business days because each one is handcrafted to order. Bespoke sizes or complex projects may take a few additional days. We will keep you updated throughout the process.",
  },
];
