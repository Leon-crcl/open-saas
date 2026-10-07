import {
  BarChart3,
  CreditCard,
  FileText,
  LockKeyhole,
  Scale,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";
import { brand } from "../shared/brand";
import { BlogUrl, DocsUrl } from "../shared/common";

// All landing page copy lives here so it can be edited without touching the
// layout components.

export const hero = {
  eyebrow: "Supplier analysis, simplified",
  headline: "Choose the right supplier, backed by data.",
  subheadline: brand.description,
};

/** Placeholder customer names. Replace with real logos once you have them. */
export const socialProof = {
  statement: "Built for buyers and procurement teams who compare suppliers every day",
  companies: ["Northwind", "Lumen", "Aperture", "Stackline", "Orbital", "Fieldnote"],
};

export const benefits = {
  title: "From gut feeling to a clear decision.",
  description:
    "Stop juggling spreadsheets and email threads. Supplyr turns supplier data into a ranking you can explain to anyone.",
  items: [
    {
      title: "One place for every supplier",
      description:
        "Keep price, quality, delivery time and risk for all your suppliers together, always up to date and easy to compare.",
    },
    {
      title: "A score you can explain",
      description:
        "A weighted score reflects your priorities. Change the weights and watch the ranking update instantly.",
    },
    {
      title: "Simple, predictable pricing",
      description:
        "Start free with five suppliers and upgrade as your list grows. No per-seat fees and no contracts to untangle.",
    },
  ],
};

export const showcase = [
  {
    id: "collect",
    eyebrow: "Collect",
    title: "Capture every supplier in one place",
    description:
      "Enter the four numbers that matter for each supplier. Add notes, a category and a country to keep your list organized as it grows.",
    points: [
      "Price, quality, delivery time and risk at a glance",
      "Edit values any time as quotes change",
      "Store contracts and certificates next to your analysis",
    ],
  },
  {
    id: "weigh",
    eyebrow: "Weigh",
    title: "Weight what matters to your business",
    description:
      "Price is not always the priority. Set how much each criterion counts and see the ranking recalculate live, with clear scores for every supplier.",
    points: [
      "Adjustable weights, saved to your account",
      "Transparent 0 to 100 scores per criterion",
      "Highlights for best price, speed and lowest risk",
    ],
  },
  {
    id: "compare",
    eyebrow: "Compare",
    title: "Compare side by side and decide",
    description:
      "Put up to four suppliers next to each other. The best value in every row is highlighted, so the right choice is easy to spot and easy to justify.",
    points: [
      "Side-by-side table and radar chart",
      "Best value highlighted in every row",
      "Share the reasoning with your team",
    ],
  },
] as const;

export interface Feature {
  name: string;
  description: string;
  icon: LucideIcon;
}

export const featuresSection = {
  title: "Everything you need to evaluate suppliers",
  description:
    "A focused toolkit, polished end to end and ready for the way you work.",
};

export const features: Feature[] = [
  {
    name: "Weighted scoring",
    description:
      "A transparent score from 0 to 100 that follows your own priorities.",
    icon: Scale,
  },
  {
    name: "Side-by-side comparison",
    description:
      "Compare up to four suppliers in a table and a radar chart.",
    icon: BarChart3,
  },
  {
    name: "Risk awareness",
    description:
      "Rate supplier risk and see it reflected in every ranking.",
    icon: ShieldAlert,
  },
  {
    name: "Document storage",
    description:
      "Keep contracts, certificates and quotes next to your analysis.",
    icon: FileText,
  },
  {
    name: "Secure accounts",
    description:
      "Your supplier data is private to your account, with email verification and password reset built in.",
    icon: LockKeyhole,
  },
  {
    name: "Flexible plans",
    description:
      "Start free and upgrade when you need more suppliers. Manage billing yourself.",
    icon: CreditCard,
  },
];

export const pricingSection = {
  title: "Pricing that scales with your supplier list",
  description:
    "Start free, upgrade when you need more suppliers. Change or cancel anytime.",
};

export const faqs = [
  {
    id: 1,
    question: "How is the supplier score calculated?",
    answer:
      "Quality is used as you enter it, and risk is inverted so that lower risk scores higher. Price and delivery time are scored relative to the suppliers you compare: the cheapest and fastest get 100, the most expensive and slowest get 0. The four scores are then combined using your weights.",
  },
  {
    id: 2,
    question: "Can I change how much each criterion counts?",
    answer:
      "Yes. Adjust the weights for price, quality, delivery time and risk at any time. The ranking updates instantly, and you can save your preferred weights to your account.",
  },
  {
    id: 3,
    question: "What do the quality and risk scales mean?",
    answer:
      "Both use a scale from 0 to 100. You decide what goes into them, for example an audit result or defect rate for quality and financial stability or geopolitical exposure for risk. Higher quality is better, lower risk is better.",
  },
  {
    id: 4,
    question: "How many suppliers can I add?",
    answer:
      "The free plan includes up to 5 suppliers, Hobby up to 25 and Pro up to 500. You can upgrade at any time, and deleting suppliers frees up space immediately.",
  },
  {
    id: 5,
    question: "Can I change or cancel my subscription?",
    answer:
      "Yes. You can upgrade, downgrade or cancel at any time from your account. When you cancel, your plan stays active until the end of the current billing period.",
  },
  {
    id: 6,
    question: "Is my data private and secure?",
    answer:
      "Your suppliers and documents are only available to your account. Uploaded files are stored privately and are only accessible through short-lived, signed links.",
  },
  {
    id: 7,
    question: "Where can I get help?",
    answer: `Browse the documentation or reach out at ${brand.supportEmail}. Pro subscribers receive priority support.`,
    href: DocsUrl,
  },
];

export const finalCta = {
  title: "Make your next supplier decision with confidence.",
  description:
    "Create your account and compare your first suppliers in minutes.",
};

export interface FooterLink {
  name: string;
  href: string;
}

export const footerNavigation: Record<
  "product" | "company" | "resources" | "legal",
  { title: string; links: FooterLink[] }
> = {
  product: {
    title: "Product",
    links: [
      { name: "Features", href: "/#features" },
      { name: "Pricing", href: "/pricing" },
      { name: "FAQ", href: "/#faq" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { name: "About", href: "https://wasp.sh" },
      { name: "Contact", href: `mailto:${brand.supportEmail}` },
    ],
  },
  resources: {
    title: "Resources",
    links: [
      { name: "Documentation", href: DocsUrl },
      { name: "Blog", href: BlogUrl },
    ],
  },
  legal: {
    title: "Legal",
    links: [
      { name: "Privacy policy", href: "#" },
      { name: "Terms of service", href: "#" },
    ],
  },
};
