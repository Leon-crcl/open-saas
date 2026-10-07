import { ArrowRight } from "lucide-react";
import { Link as WaspRouterLink, routes } from "wasp/client/router";
import { Button } from "../../client/components/ui/button";
import { cn } from "../../client/utils";
import { PlanCard } from "../../payment/PlanCard";
import { getSubscriptionPaymentPlanIds } from "../../payment/plans";
import {
  paymentPlanCards,
  recommendedPaymentPlanId,
} from "../../payment/planCards";
import { pricingSection } from "../contentSections";
import { Section, SectionHeading } from "./Section";

export function PricingSection() {
  return (
    <Section id="pricing" className="bg-muted/40 border-border border-y">
      <SectionHeading
        eyebrow="Pricing"
        title={pricingSection.title}
        description={pricingSection.description}
      />
      <div className="mx-auto mt-14 grid max-w-md grid-cols-1 gap-6 sm:mt-20 lg:max-w-4xl lg:grid-cols-2 lg:items-start">
        {getSubscriptionPaymentPlanIds().map((planId) => {
          const isRecommended = planId === recommendedPaymentPlanId;
          return (
            <PlanCard
              key={planId}
              planId={planId}
              isRecommended={isRecommended}
              className={cn(isRecommended && "order-first lg:order-none")}
              cta={
                <Button
                  size="lg"
                  variant={isRecommended ? "brand" : "outline"}
                  className="w-full"
                  asChild
                >
                  <WaspRouterLink to={routes.PricingPageRoute.to}>
                    Choose {paymentPlanCards[planId].name}
                  </WaspRouterLink>
                </Button>
              }
            />
          );
        })}
      </div>
      <p className="text-muted-foreground mt-10 text-center text-sm">
        Start free with up to 5 suppliers. No credit card required.
      </p>
      <p className="mt-3 text-center text-sm">
        <WaspRouterLink
          to={routes.PricingPageRoute.to}
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 font-medium transition-colors"
        >
          Compare plans in detail <ArrowRight className="size-3.5" />
        </WaspRouterLink>
      </p>
    </Section>
  );
}
