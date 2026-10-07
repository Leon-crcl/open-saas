import { PaymentPlanId, prettyPaymentPlanName } from "./plans";

export const recommendedPaymentPlanId: PaymentPlanId = PaymentPlanId.Pro;

export interface PaymentPlanCard {
  name: string;
  price: string;
  description: string;
  features: string[];
}

export const paymentPlanCards: Record<PaymentPlanId, PaymentPlanCard> = {
  [PaymentPlanId.Hobby]: {
    name: prettyPaymentPlanName(PaymentPlanId.Hobby),
    price: "$9.99",
    description: "For individuals getting started with AI planning.",
    features: [
      "Limited monthly schedule generations",
      "File uploads",
      "Light and dark themes",
      "Email support",
    ],
  },
  [PaymentPlanId.Pro]: {
    name: prettyPaymentPlanName(PaymentPlanId.Pro),
    price: "$19.99",
    description: "For people who plan every day and want no limits.",
    features: [
      "Unlimited monthly schedule generations",
      "File uploads",
      "Priority customer support",
      "Early access to new features",
    ],
  },
  [PaymentPlanId.Credits10]: {
    name: prettyPaymentPlanName(PaymentPlanId.Credits10),
    price: "$9.99",
    description: "Pay as you go. Top up whenever you need more.",
    features: [
      "10 schedule generations",
      "No subscription required",
      "Credits never expire",
    ],
  },
};
