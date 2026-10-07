import type { Supplier, SupplierSettings } from "wasp/entities";
import { HttpError } from "wasp/server";
import type {
  CreateSupplier,
  DeleteSupplier,
  GetSupplierWorkspace,
  SaveSupplierSettings,
  UpdateSupplier,
} from "wasp/server/operations";
import * as z from "zod";
import { ensureArgsSchemaOrThrowHttpError } from "../server/validation";
import { getSupplierLimit } from "./limits";
import { DEFAULT_WEIGHTS } from "./scoring";
import {
  supplierInputSchema,
  supplierSettingsInputSchema,
  type SupplierInput,
  type SupplierSettingsInput,
} from "./schemas";

export type SupplierWorkspaceSettings = Pick<
  SupplierSettings,
  "currency" | "weightPrice" | "weightQuality" | "weightDelivery" | "weightRisk"
>;

export interface SupplierWorkspace {
  suppliers: Supplier[];
  settings: SupplierWorkspaceSettings;
  /** Maximum number of suppliers the user's plan allows. */
  supplierLimit: number;
}

const DEFAULT_SETTINGS: SupplierWorkspaceSettings = {
  currency: "EUR",
  weightPrice: DEFAULT_WEIGHTS.price,
  weightQuality: DEFAULT_WEIGHTS.quality,
  weightDelivery: DEFAULT_WEIGHTS.delivery,
  weightRisk: DEFAULT_WEIGHTS.risk,
};

//#region Queries
export const getSupplierWorkspace: GetSupplierWorkspace<
  void,
  SupplierWorkspace
> = async (_args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const [suppliers, settings] = await Promise.all([
    context.entities.Supplier.findMany({
      where: { user: { id: context.user.id } },
      orderBy: { createdAt: "asc" },
    }),
    context.entities.SupplierSettings.findUnique({
      where: { userId: context.user.id },
    }),
  ]);

  return {
    suppliers,
    settings: settings
      ? {
          currency: settings.currency,
          weightPrice: settings.weightPrice,
          weightQuality: settings.weightQuality,
          weightDelivery: settings.weightDelivery,
          weightRisk: settings.weightRisk,
        }
      : DEFAULT_SETTINGS,
    supplierLimit: getSupplierLimit(context.user),
  };
};
//#endregion

//#region Actions
export const createSupplier: CreateSupplier<SupplierInput, Supplier> = async (
  rawArgs,
  context,
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const data = ensureArgsSchemaOrThrowHttpError(supplierInputSchema, rawArgs);

  // Note: count and create are two queries, so concurrent requests from the
  // same user could exceed the limit by a few suppliers. That is harmless
  // (it is a plan limit, not a security boundary), so we keep it simple.
  const supplierCount = await context.entities.Supplier.count({
    where: { user: { id: context.user.id } },
  });
  const supplierLimit = getSupplierLimit(context.user);
  if (supplierCount >= supplierLimit) {
    throw new HttpError(
      402,
      `Your plan allows up to ${supplierLimit} suppliers. Upgrade your plan to add more.`,
    );
  }

  return context.entities.Supplier.create({
    data: { ...data, user: { connect: { id: context.user.id } } },
  });
};

const updateSupplierInputSchema = supplierInputSchema.extend({
  id: z.string().nonempty(),
});

type UpdateSupplierInput = z.infer<typeof updateSupplierInputSchema>;

export const updateSupplier: UpdateSupplier<
  UpdateSupplierInput,
  Supplier
> = async (rawArgs, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const { id, ...data } = ensureArgsSchemaOrThrowHttpError(
    updateSupplierInputSchema,
    rawArgs,
  );

  // Optional text fields that the user cleared must be reset, not left as is.
  return context.entities.Supplier.update({
    where: { id, user: { id: context.user.id } },
    data: {
      ...data,
      category: data.category ?? null,
      country: data.country ?? null,
      notes: data.notes ?? null,
    },
  });
};

const deleteSupplierInputSchema = z.object({
  id: z.string().nonempty(),
});

type DeleteSupplierInput = z.infer<typeof deleteSupplierInputSchema>;

export const deleteSupplier: DeleteSupplier<
  DeleteSupplierInput,
  Supplier
> = async (rawArgs, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const { id } = ensureArgsSchemaOrThrowHttpError(
    deleteSupplierInputSchema,
    rawArgs,
  );

  return context.entities.Supplier.delete({
    where: { id, user: { id: context.user.id } },
  });
};

export const saveSupplierSettings: SaveSupplierSettings<
  SupplierSettingsInput,
  SupplierSettings
> = async (rawArgs, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const data = ensureArgsSchemaOrThrowHttpError(
    supplierSettingsInputSchema,
    rawArgs,
  );

  return context.entities.SupplierSettings.upsert({
    where: { userId: context.user.id },
    create: { ...data, user: { connect: { id: context.user.id } } },
    update: data,
  });
};
//#endregion
