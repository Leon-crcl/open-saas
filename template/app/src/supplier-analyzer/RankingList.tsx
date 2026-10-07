import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Badge } from "../client/components/ui/badge";
import { Button } from "../client/components/ui/button";
import { Card, CardHeader, CardTitle } from "../client/components/ui/card";
import { Checkbox } from "../client/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../client/components/ui/dropdown-menu";
import { cn } from "../client/utils";
import { formatDays, formatPrice } from "./format";
import { ScoreBar } from "./ScoreBar";
import type { ScoredSupplier } from "./types";

export function RankingList({
  suppliers,
  currency,
  selectedIds,
  onToggleSelected,
  onEdit,
  onDelete,
}: {
  suppliers: ScoredSupplier[];
  currency: string;
  selectedIds: Set<string>;
  onToggleSelected: (id: string) => void;
  onEdit: (supplier: ScoredSupplier) => void;
  onDelete: (supplier: ScoredSupplier) => void;
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="text-base">Ranking</CardTitle>
        <p className="text-muted-foreground text-sm">
          Select suppliers to compare them side by side.
        </p>
      </CardHeader>
      <ul data-testid="supplier-ranking" className="divide-border border-t divide-y">
        {suppliers.map((supplier) => (
          <li
            key={supplier.id}
            data-testid="supplier-row"
            className="hover:bg-muted/30 px-5 py-4 transition-colors sm:px-6"
          >
            <div className="flex items-start gap-3">
              <Checkbox
                checked={selectedIds.has(supplier.id)}
                onCheckedChange={() => onToggleSelected(supplier.id)}
                aria-label={`Compare ${supplier.name}`}
                className="mt-1"
              />
              <RankBadge rank={supplier.rank} />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-foreground truncate text-sm font-semibold">
                      {supplier.name}
                    </p>
                    {(supplier.category || supplier.country) && (
                      <p className="text-muted-foreground truncate text-xs">
                        {[supplier.category, supplier.country]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    )}
                  </div>
                  <RowActions
                    supplier={supplier}
                    onEdit={() => onEdit(supplier)}
                    onDelete={() => onDelete(supplier)}
                  />
                </div>
                <ScoreBar score={supplier.total} className="mt-3" />
                <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs sm:grid-cols-4">
                  <Metric label="Price" value={formatPrice(supplier.price, currency)} />
                  <Metric label="Quality" value={`${supplier.quality}/100`} />
                  <Metric label="Delivery" value={formatDays(supplier.deliveryDays)} />
                  <Metric
                    label="Risk"
                    value={`${supplier.risk}/100`}
                    tone={supplier.risk >= 70 ? "danger" : undefined}
                  />
                </dl>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function RankBadge({ rank }: { rank: number }) {
  return (
    <Badge
      variant={rank === 1 ? "brand" : "default"}
      className="mt-0.5 min-w-8 justify-center tabular-nums"
      aria-label={`Rank ${rank}`}
    >
      #{rank}
    </Badge>
  );
}

function Metric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "danger";
}) {
  return (
    <div>
      <dt className="text-muted-foreground">{label}</dt>
      <dd
        className={cn(
          "text-foreground mt-0.5 font-medium tabular-nums",
          tone === "danger" && "text-destructive",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

function RowActions({
  supplier,
  onEdit,
  onDelete,
}: {
  supplier: ScoredSupplier;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="-mr-2 -mt-1.5 size-8 shrink-0"
          aria-label={`Actions for ${supplier.name}`}
        >
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={onEdit} className="cursor-pointer gap-2.5">
          <Pencil /> Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={onDelete}
          className="text-destructive focus:text-destructive cursor-pointer gap-2.5"
        >
          <Trash2 /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
