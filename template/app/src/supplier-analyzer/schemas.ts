import * as z from "zod";

export const SUPPORTED_CURRENCIES = [
  "EUR",
  "USD",
  "GBP",
  "CHF",
  "CAD",
  "AUD",
  "JPY",
  "CNY",
] as const;

const score0to100 = z.number().int().min(0).max(100);
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((value) => (value === "" ? undefined : value))
    .optional();

export const supplierInputSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  category: optionalText(80),
  country: optionalText(80),
  notes: optionalText(1000),
  price: z.number().min(0, "Price cannot be negative").max(1_000_000_000),
  quality: score0to100,
  deliveryDays: z.number().int().min(0).max(3650),
  risk: score0to100,
});

export type SupplierInput = z.infer<typeof supplierInputSchema>;

export const weightSchema = z.number().int().min(0).max(100);

export const supplierSettingsInputSchema = z.object({
  currency: z.enum(SUPPORTED_CURRENCIES),
  weightPrice: weightSchema,
  weightQuality: weightSchema,
  weightDelivery: weightSchema,
  weightRisk: weightSchema,
});

export type SupplierSettingsInput = z.infer<typeof supplierSettingsInputSchema>;
