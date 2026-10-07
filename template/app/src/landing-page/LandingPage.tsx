import { Benefits } from "./components/Benefits";
import { FAQ } from "./components/FAQ";
import { Features } from "./components/Features";
import { FinalCta } from "./components/FinalCta";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { PricingSection } from "./components/PricingSection";
import { ProductShowcase } from "./components/ProductShowcase";
import { SchemaMarkup } from "./components/SchemaMarkup";
import { SocialProof } from "./components/SocialProof";
import { faqs, footerNavigation } from "./contentSections";

export function LandingPage() {
  return (
    <div className="bg-background text-foreground">
      <SchemaMarkup />
      <main className="isolate">
        <Hero />
        <SocialProof />
        <Benefits />
        <ProductShowcase />
        <Features />
        <PricingSection />
        <FAQ faqs={faqs} />
        <FinalCta />
      </main>
      <Footer footerNavigation={footerNavigation} />
    </div>
  );
}
