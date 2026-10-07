import { ArrowDown, ArrowUp, Eye } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
} from "../../../client/components/ui/card";
import { cn } from "../../../client/utils";

type PageViewsStats = {
  totalPageViews: number | undefined;
  prevDayViewsChangePercent: string | undefined;
};

export function TotalPageViewsCard({
  totalPageViews,
  prevDayViewsChangePercent,
}: PageViewsStats) {
  const prevDayViewsChangePercentValue = parseInt(
    prevDayViewsChangePercent || "",
  );
  const isDeltaPositive = prevDayViewsChangePercentValue > 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="bg-muted text-muted-foreground flex size-9 items-center justify-center rounded-md">
          <Eye className="size-4" aria-hidden="true" />
        </div>
      </CardHeader>

      <CardContent className="flex items-end justify-between">
        <div>
          <h4 className="text-foreground text-2xl font-semibold tracking-tight tabular-nums">
            {totalPageViews}
          </h4>
          <span className="text-muted-foreground text-sm font-medium">
            Total page views
          </span>
        </div>

        <span
          className={cn("flex items-center gap-1 text-sm font-medium", {
            "text-success":
              isDeltaPositive &&
              prevDayViewsChangePercent &&
              prevDayViewsChangePercentValue !== 0,
            "text-destructive":
              !isDeltaPositive &&
              prevDayViewsChangePercent &&
              prevDayViewsChangePercentValue !== 0,
            "text-muted-foreground":
              !prevDayViewsChangePercent ||
              prevDayViewsChangePercentValue === 0,
          })}
        >
          {prevDayViewsChangePercent && prevDayViewsChangePercentValue !== 0
            ? `${prevDayViewsChangePercent}%`
            : "-"}
          {prevDayViewsChangePercent &&
            prevDayViewsChangePercentValue !== 0 &&
            (isDeltaPositive ? (
              <ArrowUp className="size-4" />
            ) : (
              <ArrowDown className="size-4" />
            ))}
        </span>
      </CardContent>
    </Card>
  );
}
