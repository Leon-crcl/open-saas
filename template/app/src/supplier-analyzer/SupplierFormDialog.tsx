import { useEffect, useState, type FormEvent } from "react";
import type { Supplier } from "wasp/entities";
import { createSupplier, updateSupplier } from "wasp/client/operations";
import { Link as WaspRouterLink, routes } from "wasp/client/router";
import { Button } from "../client/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../client/components/ui/dialog";
import { Input } from "../client/components/ui/input";
import { Label } from "../client/components/ui/label";
import { Textarea } from "../client/components/ui/textarea";
import { ToastAction } from "../client/components/ui/toast";
import { toast } from "../client/hooks/use-toast";
import { supplierInputSchema } from "./schemas";

interface FormState {
  name: string;
  category: string;
  country: string;
  notes: string;
  price: string;
  quality: string;
  deliveryDays: string;
  risk: string;
}

const emptyForm: FormState = {
  name: "",
  category: "",
  country: "",
  notes: "",
  price: "",
  quality: "",
  deliveryDays: "",
  risk: "",
};

function toFormState(supplier: Supplier | null): FormState {
  if (!supplier) return emptyForm;
  return {
    name: supplier.name,
    category: supplier.category ?? "",
    country: supplier.country ?? "",
    notes: supplier.notes ?? "",
    price: String(supplier.price),
    quality: String(supplier.quality),
    deliveryDays: String(supplier.deliveryDays),
    risk: String(supplier.risk),
  };
}

type FieldErrors = Partial<Record<keyof FormState, string>>;

export function SupplierFormDialog({
  open,
  onOpenChange,
  supplier,
  currency,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The supplier being edited, or `null` to create a new one. */
  supplier: Supplier | null;
  currency: string;
}) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(toFormState(supplier));
      setErrors({});
    }
  }, [open, supplier]);

  const setField = (field: keyof FormState) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    // Empty number inputs must fail validation instead of becoming 0.
    const toNumber = (value: string) => (value.trim() === "" ? NaN : Number(value));
    const parsed = supplierInputSchema.safeParse({
      name: form.name,
      category: form.category,
      country: form.country,
      notes: form.notes,
      price: toNumber(form.price),
      quality: toNumber(form.quality),
      deliveryDays: toNumber(form.deliveryDays),
      risk: toNumber(form.risk),
    });

    if (!parsed.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof FormState | undefined;
        if (field && !fieldErrors[field]) {
          fieldErrors[field] = fieldMessage(field, issue.message);
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setIsSaving(true);
    try {
      if (supplier) {
        await updateSupplier({ id: supplier.id, ...parsed.data });
      } else {
        await createSupplier(parsed.data);
      }
      toast({ title: supplier ? "Supplier updated" : "Supplier added" });
      onOpenChange(false);
    } catch (error) {
      const statusCode =
        error && typeof error === "object" && "statusCode" in error
          ? error.statusCode
          : undefined;
      toast({
        title:
          statusCode === 402 ? "Supplier limit reached" : "Could not save supplier",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
        action:
          statusCode === 402 ? (
            <ToastAction altText="View plans" asChild>
              <WaspRouterLink to={routes.PricingPageRoute.to}>
                View plans
              </WaspRouterLink>
            </ToastAction>
          ) : undefined,
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{supplier ? "Edit supplier" : "Add supplier"}</DialogTitle>
          <DialogDescription>
            Enter the key figures. Quality and risk use a scale from 0 to 100.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <Field label="Supplier name" error={errors.name}>
            {(id) => (
              <Input
                id={id}
                value={form.name}
                onChange={(e) => setField("name")(e.target.value)}
                placeholder="e.g. Northwind Components"
                autoFocus
                aria-invalid={!!errors.name}
              />
            )}
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Category (optional)" error={errors.category}>
              {(id) => (
                <Input
                  id={id}
                  value={form.category}
                  onChange={(e) => setField("category")(e.target.value)}
                  placeholder="e.g. Electronics"
                />
              )}
            </Field>
            <Field label="Country (optional)" error={errors.country}>
              {(id) => (
                <Input
                  id={id}
                  value={form.country}
                  onChange={(e) => setField("country")(e.target.value)}
                  placeholder="e.g. Germany"
                />
              )}
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Price per unit"
              hint={`In ${currency}. Lower is better.`}
              error={errors.price}
            >
              {(id) => (
                <Input
                  id={id}
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="any"
                  value={form.price}
                  onChange={(e) => setField("price")(e.target.value)}
                  aria-invalid={!!errors.price}
                />
              )}
            </Field>
            <Field
              label="Delivery time"
              hint="In days. Lower is better."
              error={errors.deliveryDays}
            >
              {(id) => (
                <Input
                  id={id}
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={1}
                  value={form.deliveryDays}
                  onChange={(e) => setField("deliveryDays")(e.target.value)}
                  aria-invalid={!!errors.deliveryDays}
                />
              )}
            </Field>
            <Field
              label="Quality"
              hint="0 to 100. Higher is better."
              error={errors.quality}
            >
              {(id) => (
                <Input
                  id={id}
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={100}
                  step={1}
                  value={form.quality}
                  onChange={(e) => setField("quality")(e.target.value)}
                  aria-invalid={!!errors.quality}
                />
              )}
            </Field>
            <Field
              label="Risk"
              hint="0 to 100. Lower is better."
              error={errors.risk}
            >
              {(id) => (
                <Input
                  id={id}
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={100}
                  step={1}
                  value={form.risk}
                  onChange={(e) => setField("risk")(e.target.value)}
                  aria-invalid={!!errors.risk}
                />
              )}
            </Field>
          </div>

          <Field label="Notes (optional)" error={errors.notes}>
            {(id) => (
              <Textarea
                id={id}
                value={form.notes}
                onChange={(e) => setField("notes")(e.target.value)}
                rows={3}
              />
            )}
          </Field>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save supplier"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function fieldMessage(field: keyof FormState, fallback: string): string {
  switch (field) {
    case "price":
      return "Enter a price of 0 or more.";
    case "quality":
    case "risk":
      return "Enter a whole number from 0 to 100.";
    case "deliveryDays":
      return "Enter a whole number of days (0 or more).";
    default:
      return fallback;
  }
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: (id: string) => React.ReactNode;
}) {
  const id = `supplier-${label.toLowerCase().replace(/[^a-z]+/g, "-")}`;
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children(id)}
      {error ? (
        <p className="text-destructive text-xs" role="alert">
          {error}
        </p>
      ) : (
        hint && <p className="text-muted-foreground text-xs">{hint}</p>
      )}
    </div>
  );
}
