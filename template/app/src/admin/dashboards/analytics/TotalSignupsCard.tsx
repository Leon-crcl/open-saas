import { ArrowUp, UsersRound } from "lucide-react";
import { useMemo } from "react";
import { type DailyStatsProps } from "../../../analytics/stats";
import {
  Card,
  CardContent,
  CardHeader,
} from "../../../client/components/ui/card";
import { cn } from "../../../client/utils";

export function TotalSignupsCard({ dailyStats, isLoading }: DailyStatsProps) {
  const isDeltaPositive = useMemo(() => {
    return !!dailyStats?.userDelta && dailyStats.userDelta > 0;
  }, [dailyStats]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="bg-muted text-muted-foreground flex size-9 items-center justify-center rounded-md">
          <UsersRound className="size-4" aria-hidden="true" />
        </div>
      </CardHeader>

      <CardContent className="flex items-end justify-between">
        <div>
          <h4 className="text-foreground text-2xl font-semibold tracking-tight tabular-nums">
            {dailyStats?.userCount}
          </h4>
          <span className="text-muted-foreground text-sm font-medium">
            Total Signups
          </span>
        </div>

        <span
          className={cn("flex items-center gap-1 text-sm font-medium", {
            "text-success": isDeltaPositive && !isLoading,
            "text-destructive":
              !isDeltaPositive && !isLoading && dailyStats?.userDelta !== 0,
            "text-muted-foreground": isLoading || !dailyStats?.userDelta,
          })}
        >
          {isLoading ? "..." : dailyStats?.userDelta ?? "-"}
          {!isLoading && (dailyStats?.userDelta ?? 0) > 0 && (
            <ArrowUp className="size-4" />
          )}
        </span>
      </CardContent>
    </Card>
  );
}
