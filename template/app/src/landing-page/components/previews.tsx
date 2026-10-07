import { Check, Plus } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../../client/utils";

/**
 * Lightweight, code-drawn previews of the product UI. They are decorative
 * (aria-hidden) and use the same design tokens as the real app, so they stay
 * in sync with the theme (including dark mode) without any image assets.
 */

export function WindowFrame({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "border-border bg-card overflow-hidden rounded-xl border shadow-[0_1px_2px_rgba(0,0,0,0.04),0_24px_48px_-12px_rgba(0,0,0,0.12)] dark:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.6)]",
        className,
      )}
    >
      <div className="border-border bg-muted/50 flex items-center gap-3 border-b px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="bg-border size-2.5 rounded-full" />
          <span className="bg-border size-2.5 rounded-full" />
          <span className="bg-border size-2.5 rounded-full" />
        </div>
        <div className="bg-background text-muted-foreground border-border mx-auto w-full max-w-[220px] truncate rounded-md border px-3 py-1 text-center text-[11px]">
          {title}
        </div>
        <div className="w-10" />
      </div>
      {children}
    </div>
  );
}

const demoSuppliers = [
  { name: "Northwind Components", meta: "Electronics · Germany", score: 87.4, price: "€4.20", quality: 92, days: 6, risk: 14 },
  { name: "Lumen Industrial", meta: "Mechanical · Poland", score: 74.1, price: "€3.60", quality: 78, days: 12, risk: 31 },
  { name: "Orbital Supply Co.", meta: "Electronics · Vietnam", score: 52.9, price: "€2.90", quality: 61, days: 28, risk: 58 },
] as const;

function scoreTone(score: number) {
  if (score >= 70) return { bar: "bg-success", text: "text-success" };
  if (score >= 40) return { bar: "bg-warning", text: "text-warning" };
  return { bar: "bg-destructive", text: "text-destructive" };
}

export function RankingPreview({ className }: { className?: string }) {
  return (
    <div className={cn("p-4 sm:p-5", className)}>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-foreground text-sm font-semibold">Ranking</p>
        <span className="text-muted-foreground text-[11px]">3 suppliers</span>
      </div>
      <div className="space-y-2.5">
        {demoSuppliers.map((supplier, index) => {
          const tone = scoreTone(supplier.score);
          return (
            <div
              key={supplier.name}
              className="border-border bg-background rounded-lg border p-3"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-[10px] font-medium tabular-nums",
                    index === 0
                      ? "border-brand/20 bg-brand-subtle text-brand"
                      : "border-border bg-muted text-muted-foreground",
                  )}
                >
                  #{index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold">{supplier.name}</p>
                  <p className="text-muted-foreground truncate text-[10px]">
                    {supplier.meta}
                  </p>
                </div>
              </div>
              <div className="mt-2.5 flex items-center gap-2.5">
                <div className="bg-muted h-1.5 flex-1 overflow-hidden rounded-full">
                  <div
                    className={cn("h-full rounded-full", tone.bar)}
                    style={{ width: `${supplier.score}%` }}
                  />
                </div>
                <span className={cn("text-xs font-semibold tabular-nums", tone.text)}>
                  {supplier.score.toFixed(1)}
                </span>
              </div>
              <div className="text-muted-foreground mt-2.5 grid grid-cols-4 gap-2 text-[10px] tabular-nums">
                <span>{supplier.price}</span>
                <span>Q {supplier.quality}</span>
                <span>{supplier.days} days</span>
                <span>Risk {supplier.risk}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const demoWeights = [
  ["Price", 35],
  ["Quality", 30],
  ["Delivery time", 20],
  ["Risk", 15],
] as const;

export function WeightsPreview({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-5 p-4 sm:p-5", className)}>
      <p className="text-foreground text-sm font-semibold">Scoring weights</p>
      {demoWeights.map(([label, value]) => (
        <div key={label} className="space-y-2">
          <div className="flex items-baseline justify-between text-xs">
            <span className="font-medium">{label}</span>
            <span className="font-semibold tabular-nums">{value}%</span>
          </div>
          <div className="bg-muted relative h-1.5 rounded-full">
            <div
              className="bg-brand h-full rounded-full"
              style={{ width: `${value * 2}%` }}
            />
            <span
              className="border-brand bg-background absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 shadow-sm"
              style={{ left: `${value * 2}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SupplierFormPreview({ className }: { className?: string }) {
  const fields = [
    ["Price per unit", "€ 4.20"],
    ["Delivery time", "6 days"],
    ["Quality", "92"],
    ["Risk", "14"],
  ];
  return (
    <div className={cn("space-y-4 p-4 sm:p-5", className)}>
      <p className="text-foreground text-sm font-semibold">Add supplier</p>
      <div className="space-y-1.5">
        <p className="text-xs font-medium">Supplier name</p>
        <div className="border-input bg-background flex h-9 items-center rounded-md border px-3 text-xs">
          Northwind Components
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {fields.map(([label, value]) => (
          <div key={label} className="space-y-1.5">
            <p className="text-xs font-medium">{label}</p>
            <div className="border-input bg-background flex h-9 items-center rounded-md border px-3 text-xs tabular-nums">
              {value}
            </div>
          </div>
        ))}
      </div>
      <div className="bg-primary text-primary-foreground flex h-9 items-center justify-center gap-1.5 rounded-md text-xs font-medium">
        <Plus className="size-3.5" /> Save supplier
      </div>
    </div>
  );
}

export function ComparisonPreview({ className }: { className?: string }) {
  const rows: [string, (string | number)[], number][] = [
    ["Price per unit", ["€4.20", "€3.60", "€2.90"], 2],
    ["Quality", ["92/100", "78/100", "61/100"], 0],
    ["Delivery time", ["6 days", "12 days", "28 days"], 0],
    ["Risk", ["14/100", "31/100", "58/100"], 0],
    ["Total score", ["87.4", "74.1", "52.9"], 0],
  ];
  const names = ["Northwind", "Lumen", "Orbital"];
  return (
    <div className={cn("p-4 sm:p-5", className)}>
      <p className="text-foreground mb-3 text-sm font-semibold">Comparison</p>
      <table className="w-full text-[11px]">
        <thead>
          <tr className="border-border border-b">
            <th className="py-2" />
            {names.map((name) => (
              <th key={name} className="py-2 pr-2 text-left font-semibold">
                {name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, values, bestIndex]) => (
            <tr key={label} className="border-border border-b last:border-b-0">
              <th className="text-muted-foreground py-2.5 pr-2 text-left font-medium">
                {label}
              </th>
              {values.map((value, index) => (
                <td
                  key={index}
                  className={cn(
                    "py-2.5 pr-2 tabular-nums",
                    index === bestIndex && "text-success font-semibold",
                  )}
                >
                  <span className="inline-flex items-center gap-1">
                    {value}
                    {index === bestIndex && <Check className="size-3" />}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
