import { Check } from "lucide-react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Card, CardContent, CardHeader, CardTitle } from "../client/components/ui/card";
import { cn } from "../client/utils";
import { formatDays, formatPrice } from "./format";
import type { ScoredSupplier } from "./types";

const SERIES_COLORS = ["#4f46e5", "#0ea5e9", "#f59e0b", "#10b981"];
export const MAX_COMPARED_SUPPLIERS = SERIES_COLORS.length;

export function ComparisonPanel({
  suppliers,
  currency,
}: {
  suppliers: ScoredSupplier[];
  currency: string;
}) {
  if (suppliers.length < 2) return null;

  const options: ApexOptions = {
    chart: {
      type: "radar",
      toolbar: { show: false },
      fontFamily: "Inter Variable, system-ui, sans-serif",
    },
    colors: SERIES_COLORS,
    xaxis: { categories: ["Price", "Quality", "Delivery", "Risk"] },
    yaxis: { min: 0, max: 100, tickAmount: 4, labels: { show: false } },
    stroke: { width: 2 },
    fill: { opacity: 0.12 },
    markers: { size: 3 },
    legend: { position: "bottom" },
    dataLabels: { enabled: false },
  };
  const series = suppliers.map((s) => ({
    name: s.name,
    data: [s.scores.price, s.scores.quality, s.scores.delivery, s.scores.risk],
  }));

  const rows: {
    label: string;
    value: (s: ScoredSupplier) => string;
    best: (s: ScoredSupplier) => number;
    higherIsBetter: boolean;
  }[] = [
    {
      label: "Price per unit",
      value: (s) => formatPrice(s.price, currency),
      best: (s) => s.price,
      higherIsBetter: false,
    },
    {
      label: "Quality",
      value: (s) => `${s.quality}/100`,
      best: (s) => s.quality,
      higherIsBetter: true,
    },
    {
      label: "Delivery time",
      value: (s) => formatDays(s.deliveryDays),
      best: (s) => s.deliveryDays,
      higherIsBetter: false,
    },
    {
      label: "Risk",
      value: (s) => `${s.risk}/100`,
      best: (s) => s.risk,
      higherIsBetter: false,
    },
    {
      label: "Total score",
      value: (s) => s.total.toFixed(1),
      best: (s) => s.total,
      higherIsBetter: true,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Comparison</CardTitle>
        <p className="text-muted-foreground text-sm">
          Comparing {suppliers.length} suppliers. The best value in each row is
          highlighted.
        </p>
      </CardHeader>
      <CardContent className="grid items-center gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <div aria-hidden="true" className="min-w-0">
          <ReactApexChart options={options} series={series} type="radar" height={340} />
        </div>
        <div className="min-w-0 overflow-x-auto">
          <table className="w-full min-w-[420px] text-sm">
            <thead>
              <tr className="border-border border-b">
                <th className="text-muted-foreground py-2 pr-4 text-left text-xs font-medium">
                  <span className="sr-only">Criterion</span>
                </th>
                {suppliers.map((s, index) => (
                  <th
                    key={s.id}
                    className="py-2 pr-4 text-left text-xs font-semibold last:pr-0"
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className="size-2 shrink-0 rounded-full"
                        style={{ background: SERIES_COLORS[index] }}
                      />
                      <span className="truncate">{s.name}</span>
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const values = suppliers.map(row.best);
                const target = row.higherIsBetter
                  ? Math.max(...values)
                  : Math.min(...values);
                const allEqual = values.every((v) => v === values[0]);
                return (
                  <tr key={row.label} className="border-border border-b last:border-b-0">
                    <th
                      scope="row"
                      className="text-muted-foreground py-3 pr-4 text-left text-xs font-medium"
                    >
                      {row.label}
                    </th>
                    {suppliers.map((s) => {
                      const isBest = !allEqual && row.best(s) === target;
                      return (
                        <td
                          key={s.id}
                          className={cn(
                            "py-3 pr-4 tabular-nums last:pr-0",
                            isBest && "text-success font-semibold",
                          )}
                        >
                          <span className="inline-flex items-center gap-1">
                            {row.value(s)}
                            {isBest && (
                              <Check className="size-3.5" aria-label="Best value" />
                            )}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
