import { Clock, ShieldCheck, Tag, Trophy, type LucideIcon } from "lucide-react";
import { Card } from "../client/components/ui/card";
import { formatDays, formatPrice } from "./format";
import type { ScoredSupplier } from "./types";

export function SummaryCards({
  suppliers,
  currency,
}: {
  suppliers: ScoredSupplier[];
  currency: string;
}) {
  if (suppliers.length === 0) return null;

  const best = suppliers[0];
  const cheapest = minBy(suppliers, (s) => s.price);
  const fastest = minBy(suppliers, (s) => s.deliveryDays);
  const safest = minBy(suppliers, (s) => s.risk);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <SummaryCard
        icon={Trophy}
        label="Best overall"
        name={best.name}
        value={`Score ${best.total.toFixed(1)}`}
        highlight
      />
      <SummaryCard
        icon={Tag}
        label="Lowest price"
        name={cheapest.name}
        value={formatPrice(cheapest.price, currency)}
      />
      <SummaryCard
        icon={Clock}
        label="Fastest delivery"
        name={fastest.name}
        value={formatDays(fastest.deliveryDays)}
      />
      <SummaryCard
        icon={ShieldCheck}
        label="Lowest risk"
        name={safest.name}
        value={`Risk ${safest.risk}/100`}
      />
    </div>
  );
}

function minBy<T>(items: T[], key: (item: T) => number): T {
  return items.reduce((best, item) => (key(item) < key(best) ? item : best));
}

function SummaryCard({
  icon: Icon,
  label,
  name,
  value,
  highlight = false,
}: {
  icon: LucideIcon;
  label: string;
  name: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-3">
        <div
          className={
            highlight
              ? "bg-brand-subtle text-brand flex size-9 items-center justify-center rounded-md"
              : "bg-muted text-muted-foreground flex size-9 items-center justify-center rounded-md"
          }
        >
          <Icon className="size-4" aria-hidden="true" />
        </div>
        <span className="text-muted-foreground text-sm font-medium">{label}</span>
      </div>
      <p className="text-foreground mt-4 truncate text-lg font-semibold tracking-tight">
        {name}
      </p>
      <p className="text-muted-foreground mt-0.5 text-sm tabular-nums">{value}</p>
    </Card>
  );
}
