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
    description: "For individuals and small teams comparing suppliers.",
    features: [
      "Up to 25 suppliers",
      "Custom scoring weights",
      "Side-by-side comparison",
      "Document storage",
      "Email support",
    ],
  },
  [PaymentPlanId.Pro]: {
    name: prettyPaymentPlanName(PaymentPlanId.Pro),
    price: "$19.99",
    description: "For procurement teams that evaluate suppliers every day.",
    features: [
      "Up to 500 suppliers",
      "Custom scoring weights",
      "Side-by-side comparison",
      "Document storage",
      "Priority customer support",
    ],
  },
  [PaymentPlanId.Credits10]: {
    name: prettyPaymentPlanName(PaymentPlanId.Credits10),
    price: "$9.99",
    // Not offered in the UI yet. Reserved for pay-per-use features such as AI reports.
    description: "One-time credit pack.",
    features: ["10 credits", "No subscription required", "Credits never expire"],
  },
};
