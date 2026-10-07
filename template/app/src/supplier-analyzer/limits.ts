import { PaymentPlanId, SubscriptionStatus } from "../payment/plans";

/** Maximum number of suppliers per account, by subscription plan. */
export const SUPPLIER_LIMITS = {
  free: 5,
  [PaymentPlanId.Hobby]: 25,
  [PaymentPlanId.Pro]: 500,
} as const;

/** The highest limit; users on it have no higher plan to upgrade to. */
export const MAX_SUPPLIER_LIMIT = SUPPLIER_LIMITS[PaymentPlanId.Pro];

export function getSupplierLimit(user: {
  subscriptionPlan: string | null;
  subscriptionStatus: string | null;
}): number {
  const hasActiveSubscription =
    user.subscriptionStatus === SubscriptionStatus.Active ||
    user.subscriptionStatus === SubscriptionStatus.CancelAtPeriodEnd;

  if (!hasActiveSubscription) return SUPPLIER_LIMITS.free;
  if (user.subscriptionPlan === PaymentPlanId.Pro) {
    return SUPPLIER_LIMITS[PaymentPlanId.Pro];
  }
  if (user.subscriptionPlan === PaymentPlanId.Hobby) {
    return SUPPLIER_LIMITS[PaymentPlanId.Hobby];
  }
  return SUPPLIER_LIMITS.free;
}
