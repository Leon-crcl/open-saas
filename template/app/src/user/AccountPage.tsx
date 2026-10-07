import { getCustomerPortalUrl, useQuery } from "wasp/client/operations";
import { Link as WaspRouterLink, routes } from "wasp/client/router";
import type { User } from "wasp/entities";
import { Coins } from "lucide-react";
import { PageHeader } from "../client/components/layout/PageHeader";
import { Badge } from "../client/components/ui/badge";
import { Button } from "../client/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../client/components/ui/card";
import {
  PaymentPlanId,
  SubscriptionStatus,
  parsePaymentPlanId,
  prettyPaymentPlanName,
} from "../payment/plans";
import { UserAvatar, getUserDisplayName } from "./UserDropdown";

export function AccountPage({ user }: { user: User }) {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Account"
        description="Manage your profile, plan and credits."
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profile</CardTitle>
          <CardDescription>How you appear in the app.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <UserAvatar user={user} className="size-12 text-base" />
            <div className="min-w-0">
              <p className="text-foreground truncate text-sm font-medium">
                {getUserDisplayName(user)}
              </p>
              {!!user.email && user.email !== getUserDisplayName(user) && (
                <p className="text-muted-foreground truncate text-sm">
                  {user.email}
                </p>
              )}
            </div>
          </div>
          <dl className="divide-border mt-6 divide-y border-t">
            {!!user.email && (
              <AccountRow label="Email address">{user.email}</AccountRow>
            )}
            {!!user.username && (
              <AccountRow label="Username">{user.username}</AccountRow>
            )}
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Plan &amp; billing</CardTitle>
          <CardDescription>
            Your current subscription and payment details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="divide-border divide-y border-t">
            <UserCurrentSubscriptionPlan
              subscriptionPlan={user.subscriptionPlan}
              subscriptionStatus={user.subscriptionStatus}
              datePaid={user.datePaid}
            />
            <AccountRow
              label="Credits"
              action={
                <BuyMoreButton subscriptionStatus={user.subscriptionStatus} />
              }
            >
              <span className="inline-flex items-center gap-2">
                <Coins
                  className="text-muted-foreground size-4"
                  aria-hidden="true"
                />
                {user.credits} credits
              </span>
            </AccountRow>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}

function AccountRow({
  label,
  children,
  action,
}: {
  label: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 py-4 sm:grid sm:grid-cols-[180px_1fr_auto] sm:items-center sm:gap-4">
      <dt className="text-muted-foreground text-sm font-medium">{label}</dt>
      <dd className="text-foreground text-sm">{children}</dd>
      {action && <div className="mt-2 sm:mt-0">{action}</div>}
    </div>
  );
}

function UserCurrentSubscriptionPlan({
  subscriptionPlan,
  subscriptionStatus,
  datePaid,
}: Pick<User, "subscriptionPlan" | "subscriptionStatus" | "datePaid">) {
  let subscriptionPlanMessage = "Free Plan";
  if (
    subscriptionPlan !== null &&
    subscriptionStatus !== null &&
    datePaid !== null
  ) {
    subscriptionPlanMessage = formatSubscriptionStatusMessage(
      parsePaymentPlanId(subscriptionPlan),
      datePaid,
      subscriptionStatus as SubscriptionStatus,
    );
  }

  const isPaidPlan = subscriptionPlanMessage !== "Free Plan";

  return (
    <AccountRow label="Your plan" action={<CustomerPortalButton />}>
      <span className="inline-flex flex-wrap items-center gap-2">
        {subscriptionPlanMessage}
        {isPaidPlan && subscriptionStatus === SubscriptionStatus.Active && (
          <Badge variant="success">Active</Badge>
        )}
        {subscriptionStatus === SubscriptionStatus.PastDue && (
          <Badge variant="destructive">Past due</Badge>
        )}
      </span>
    </AccountRow>
  );
}

function formatSubscriptionStatusMessage(
  subscriptionPlan: PaymentPlanId,
  datePaid: Date,
  subscriptionStatus: SubscriptionStatus,
): string {
  const paymentPlanName = prettyPaymentPlanName(subscriptionPlan);
  const statusToMessage: Record<SubscriptionStatus, string> = {
    active: `${paymentPlanName}`,
    past_due: `Payment for your ${paymentPlanName} plan is past due! Please update your subscription payment information.`,
    cancel_at_period_end: `Your ${paymentPlanName} plan subscription has been canceled, but remains active until the end of the current billing period: ${prettyPrintEndOfBillingPeriod(
      datePaid,
    )}`,
    deleted: `Your previous subscription has been canceled and is no longer active.`,
  };

  if (!statusToMessage[subscriptionStatus]) {
    throw new Error(`Invalid subscription status: ${subscriptionStatus}`);
  }

  return statusToMessage[subscriptionStatus];
}

function prettyPrintEndOfBillingPeriod(datePaid: Date) {
  const lastDayOfNextMonth = new Date(datePaid);
  lastDayOfNextMonth.setMonth(lastDayOfNextMonth.getMonth() + 2, 0);
  // Clamped so e.g., Jan 31 + 1 month → Feb 28, not until March 3.
  const clampedDayOfMonth = Math.min(
    datePaid.getDate(),
    lastDayOfNextMonth.getDate(),
  );
  const endOfBillingPeriod = new Date(datePaid);
  endOfBillingPeriod.setMonth(
    endOfBillingPeriod.getMonth() + 1,
    clampedDayOfMonth,
  );
  return endOfBillingPeriod.toLocaleDateString();
}

function CustomerPortalButton() {
  const { data: customerPortalUrl, isLoading: isCustomerPortalUrlLoading } =
    useQuery(getCustomerPortalUrl);

  if (!customerPortalUrl) {
    return null;
  }

  return (
    <Button
      asChild
      variant="outline"
      size="sm"
      disabled={isCustomerPortalUrlLoading}
    >
      <a href={customerPortalUrl} target="_blank" rel="noopener noreferrer">
        Manage payment details
      </a>
    </Button>
  );
}

function BuyMoreButton({
  subscriptionStatus,
}: Pick<User, "subscriptionStatus">) {
  if (
    subscriptionStatus === SubscriptionStatus.Active ||
    subscriptionStatus === SubscriptionStatus.CancelAtPeriodEnd
  ) {
    return null;
  }

  return (
    <Button asChild variant="outline" size="sm">
      <WaspRouterLink to={routes.PricingPageRoute.to}>
        Buy more credits
      </WaspRouterLink>
    </Button>
  );
}
