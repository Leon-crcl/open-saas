import {
  BarChart3,
  CreditCard,
  Moon,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  type LucideIcon,
} from "lucide-react";
import { brand } from "../shared/brand";
import { BlogUrl, DocsUrl } from "../shared/common";

// All landing page copy lives here so it can be edited without touching the
// layout components.

export const hero = {
  eyebrow: "AI day planning, built for focus",
  headline: "Turn your to-do list into a day that actually works.",
  subheadline: brand.description,
};

/** Placeholder customer names. Replace with real logos once you have them. */
export const socialProof = {
  statement: "Trusted by teams who protect their focus time",
  companies: [
    "Northwind",
    "Lumen",
    "Aperture",
    "Stackline",
    "Orbital",
    "Fieldnote",
  ],
};

export const benefits = {
  title: "Less planning. More doing.",
  description:
    "Cadence handles the part of the day nobody enjoys, so your attention goes to the work itself.",
  items: [
    {
      title: "From list to plan in seconds",
      description:
        "Dump your tasks, set your available hours and get a prioritized schedule, already broken down into concrete steps.",
    },
    {
      title: "Plans that respect reality",
      description:
        "Time estimates and priorities keep every day honest, so a full schedule never turns into an impossible one.",
    },
    {
      title: "Simple, predictable pricing",
      description:
        "A flat subscription or one-time credits. No seats, no usage surprises and no contracts to untangle.",
    },
  ],
};

export const showcase = [
  {
    id: "capture",
    eyebrow: "Capture",
    title: "Write it down once, in your own words",
    description:
      "Add tasks the way you think about them. Adjust the time each one needs, check off what is done and keep everything in a single, quiet list.",
    points: [
      "Fast task entry with inline time estimates",
      "Tasks sync across every device you sign in on",
      "Nothing to configure before you start",
    ],
  },
  {
    id: "plan",
    eyebrow: "Plan",
    title: "A schedule you will actually follow",
    description:
      "One click turns your list into an ordered plan. Every task is split into small steps with realistic durations and a clear priority.",
    points: [
      "Prioritized by urgency and effort",
      "Steps small enough to start immediately",
      "Regenerate whenever your day changes",
    ],
  },
  {
    id: "manage",
    eyebrow: "Manage",
    title: "Files, billing and usage in one place",
    description:
      "Keep supporting documents next to your plans and see exactly what you use. Upgrade, top up credits or cancel from your account, no support ticket required.",
    points: [
      "Secure file uploads with private downloads",
      "Transparent usage and credit balance",
      "Self-service subscription management",
    ],
  },
] as const;

export interface Feature {
  name: string;
  description: string;
  icon: LucideIcon;
}

export const featuresSection = {
  title: "Everything you need, nothing you don't",
  description:
    "A focused set of tools, polished end to end and ready for the way you work.",
};

export const features: Feature[] = [
  {
    name: "AI scheduling",
    description:
      "Structured, prioritized plans generated from a plain list of tasks.",
    icon: Sparkles,
  },
  {
    name: "Secure accounts",
    description: "Email sign-up with verification and password reset built in.",
    icon: ShieldCheck,
  },
  {
    name: "Flexible billing",
    description:
      "Monthly subscriptions or one-time credit packs, managed by you.",
    icon: CreditCard,
  },
  {
    name: "File storage",
    description:
      "Upload documents and download them securely whenever you need them.",
    icon: UploadCloud,
  },
  {
    name: "Usage insights",
    description:
      "Clear dashboards for signups, revenue and activity across your product.",
    icon: BarChart3,
  },
  {
    name: "Light and dark themes",
    description: "A comfortable interface at any hour, on any screen size.",
    icon: Moon,
  },
];

export const pricingSection = {
  title: "Pricing that scales with you",
  description:
    "Pick a plan, or buy credits only when you need them. Change anything later.",
};

export const faqs = [
  {
    id: 1,
    question: "How does Cadence create my schedule?",
    answer:
      "You add the tasks you want to get done and tell us how many hours you have. Cadence uses AI to prioritize the tasks, split each one into practical steps and estimate how long every step takes.",
  },
  {
    id: 2,
    question: "What is the difference between a plan and credits?",
    answer:
      "Plans are monthly subscriptions that include schedule generations. Credits are a one-time purchase: each schedule you generate uses one credit, and unused credits never expire.",
  },
  {
    id: 3,
    question: "Can I change or cancel my subscription?",
    answer:
      "Yes. You can upgrade, downgrade or cancel at any time from your account. When you cancel, your plan stays active until the end of the current billing period.",
  },
  {
    id: 4,
    question: "Is my data private and secure?",
    answer:
      "Your tasks and files are only available to your account. Uploaded files are stored privately and are only accessible through short-lived, signed links.",
  },
  {
    id: 5,
    question: "Which payment methods do you accept?",
    answer:
      "Payments are processed securely by our payment provider and accept all major credit and debit cards. Taxes are calculated automatically at checkout.",
  },
  {
    id: 6,
    question: "Where can I get help?",
    answer: `Browse the documentation or reach out at ${brand.supportEmail}. Pro subscribers receive priority support.`,
    href: DocsUrl,
  },
];

export const finalCta = {
  title: "Your best day starts with a plan.",
  description:
    "Create your account and generate your first schedule in under a minute.",
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
