import { Info } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "wasp/client/auth";
import {
  generateCheckoutSession,
  getCustomerPortalUrl,
  useQuery,
} from "wasp/client/operations";
import { routes } from "wasp/client/router";
import { Alert, AlertDescription } from "../client/components/ui/alert";
import { Button } from "../client/components/ui/button";
import { cn } from "../client/utils";
import { PlanCard } from "./PlanCard";
import {
  SubscriptionStatus,
  getSubscriptionPaymentPlanIds,
  type PaymentPlanId,
} from "./plans";
import { recommendedPaymentPlanId } from "./planCards";

export function PricingPage() {
  const [isPaymentLoading, setIsPaymentLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data: user } = useAuth();
  const isUserSubscribed =
    !!user &&
    !!user.subscriptionStatus &&
    user.subscriptionStatus !== SubscriptionStatus.Deleted;

  const {
    data: customerPortalUrl,
    isLoading: isCustomerPortalUrlLoading,
    error: customerPortalUrlError,
  } = useQuery(getCustomerPortalUrl, { enabled: isUserSubscribed });

  const navigate = useNavigate();

  async function handleBuyNowClick(paymentPlanId: PaymentPlanId) {
    if (!user) {
      navigate(routes.LoginRoute.to);
      return;
    }
    try {
      setIsPaymentLoading(true);

      const checkoutSession = await generateCheckoutSession(paymentPlanId);

      if (checkoutSession?.sessionUrl) {
        window.open(checkoutSession.sessionUrl, "_self");
      } else {
        throw new Error("Error generating checkout session URL");
      }
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Error processing payment. Please try again later.");
      }
      setIsPaymentLoading(false); // We only set this to false here and not in the try block because we redirect to the checkout url within the same window
    }
  }

  const handleCustomerPortalClick = () => {
    if (!user) {
      navigate(routes.LoginRoute.to);
      return;
    }

    if (customerPortalUrlError) {
      setErrorMessage("Error fetching Customer Portal URL");
      return;
    }

    if (!customerPortalUrl) {
      setErrorMessage(`Customer Portal does not exist for user ${user.id}`);
      return;
    }

    window.open(customerPortalUrl, "_blank");
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div id="pricing" className="mx-auto max-w-2xl text-center">
        <h1 className="text-foreground text-4xl font-semibold tracking-tight sm:text-5xl">
          Simple, transparent pricing
        </h1>
        <p className="text-muted-foreground mt-4 text-base leading-7 sm:text-lg">
          Start with a plan that fits how you work. Upgrade, downgrade or cancel
          at any time.
        </p>
        {import.meta.env.DEV && (
          <p className="text-muted-foreground mt-4 inline-flex items-center gap-2 text-xs">
            <Info className="size-3.5" aria-hidden="true" />
            Test mode: pay with card number
            <code className="bg-muted rounded px-1.5 py-0.5 font-mono">
              4242 4242 4242 4242
            </code>
          </p>
        )}
      </div>
      {errorMessage && (
        <Alert variant="destructive" className="mx-auto mt-8 max-w-2xl">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      <div className="mx-auto mt-12 grid max-w-md grid-cols-1 gap-6 sm:mt-16 lg:max-w-4xl lg:grid-cols-2 lg:items-start">
        {getSubscriptionPaymentPlanIds().map((planId) => {
          const isRecommended = planId === recommendedPaymentPlanId;
          return (
            <PlanCard
              key={planId}
              planId={planId}
              isRecommended={isRecommended}
              className={cn(isRecommended && "order-first lg:order-none")}
              cta={
                isUserSubscribed ? (
                  <Button
                    onClick={handleCustomerPortalClick}
                    disabled={isCustomerPortalUrlLoading}
                    aria-describedby="manage-subscription"
                    variant={isRecommended ? "brand" : "outline"}
                    size="lg"
                    className="w-full"
                  >
                    Manage Subscription
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleBuyNowClick(planId)}
                    aria-describedby={planId}
                    variant={isRecommended ? "brand" : "outline"}
                    size="lg"
                    className="w-full"
                    disabled={isPaymentLoading}
                  >
                    {user ? "Buy plan" : "Log in to buy plan"}
                  </Button>
                )
              }
            />
          );
        })}
      </div>
      <p className="text-muted-foreground mt-10 text-center text-sm">
        Prices in USD. Taxes calculated at checkout. Secure payments, you can
        cancel anytime from your account.
      </p>
    </div>
  );
}
