import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "../client/components/ui/badge";
import { cn } from "../client/utils";
import { PaymentPlanId, paymentPlans } from "./plans";
import { paymentPlanCards } from "./planCards";

/**
 * Presentational pricing card shared by the landing page and the pricing
 * page. The call to action is injected so each page can wire up its own
 * behavior (checkout, customer portal, or a link to sign up).
 */
export function PlanCard({
  planId,
  isRecommended = false,
  cta,
  className,
}: {
  planId: PaymentPlanId;
  isRecommended?: boolean;
  cta: ReactNode;
  className?: string;
}) {
  const card = paymentPlanCards[planId];
  const isSubscription = paymentPlans[planId].effect.kind === "subscription";

  return (
    <article
      className={cn(
        "bg-card relative flex flex-col rounded-xl border p-6 sm:p-7",
        isRecommended
          ? "border-brand shadow-lg ring-1 ring-brand"
          : "border-border shadow-xs",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 id={planId} className="text-foreground text-base font-semibold">
          {card.name}
        </h3>
        {isRecommended && <Badge variant="brand">Most popular</Badge>}
      </div>
      <p className="text-muted-foreground mt-2 text-sm leading-6">
        {card.description}
      </p>
      <p className="mt-6 flex items-baseline gap-1.5">
        <span className="text-foreground text-4xl font-semibold tracking-tight tabular-nums">
          {card.price}
        </span>
        <span className="text-muted-foreground text-sm">
          {isSubscription ? "per month" : "one-time"}
        </span>
      </p>
      <div className="mt-6">{cta}</div>
      <ul className="border-border mt-6 space-y-3 border-t pt-6 text-sm">
        {card.features.map((feature) => (
          <li key={feature} className="text-foreground flex gap-3">
            <Check
              className={cn(
                "mt-0.5 size-4 shrink-0",
                isRecommended ? "text-brand" : "text-muted-foreground",
              )}
              aria-hidden="true"
            />
            {feature}
          </li>
        ))}
      </ul>
    </article>
  );
}
