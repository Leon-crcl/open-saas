import { type AuthUser } from "wasp/auth";
import { getDailyStats, useQuery } from "wasp/client/operations";
import { cn } from "../../../client/utils";
import { DefaultLayout } from "../../layout/DefaultLayout";
import { RevenueAndProfitChart } from "./RevenueAndProfitChart";
import { SourcesTable } from "./SourcesTable";
import { TotalPageViewsCard } from "./TotalPageViewsCard";
import { TotalPayingUsersCard } from "./TotalPayingUsersCard";
import { TotalRevenueCard } from "./TotalRevenueCard";
import { TotalSignupsCard } from "./TotalSignupsCard";

export function AnalyticsDashboardPage({ user }: { user: AuthUser }) {
  const { data: stats, isLoading, error } = useQuery(getDailyStats);

  if (error) {
    return (
      <DefaultLayout user={user}>
        <div className="flex h-full items-center justify-center">
          <div className="bg-card border-border rounded-lg border p-8 shadow-sm">
            <p className="text-destructive text-xl font-semibold">Error</p>
            <p className="text-muted-foreground mt-2 text-sm">
              {error.message || "Something went wrong while fetching stats."}
            </p>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout user={user}>
      <div className="relative">
        <div
          className={cn({
            "opacity-25": !stats,
          })}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4">
            <TotalPageViewsCard
              totalPageViews={stats?.dailyStats.totalViews}
              prevDayViewsChangePercent={
                stats?.dailyStats.prevDayViewsChangePercent
              }
            />
            <TotalRevenueCard
              dailyStats={stats?.dailyStats}
              weeklyStats={stats?.weeklyStats}
              isLoading={isLoading}
            />
            <TotalPayingUsersCard
              dailyStats={stats?.dailyStats}
              isLoading={isLoading}
            />
            <TotalSignupsCard
              dailyStats={stats?.dailyStats}
              isLoading={isLoading}
            />
          </div>

          <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6">
            <RevenueAndProfitChart
              weeklyStats={stats?.weeklyStats}
              isLoading={isLoading}
            />

            <div className="col-span-12 xl:col-span-8">
              <SourcesTable sources={stats?.dailyStats?.sources} />
            </div>
          </div>
        </div>

        {!stats && (
          <div className="bg-background/50 absolute inset-0 flex items-start justify-center">
            <div className="bg-card border-border rounded-lg border p-8 shadow-sm">
              <p className="text-foreground text-xl font-semibold">
                No daily stats generated yet
              </p>
              <p className="text-muted-foreground mt-2 text-sm">
                Stats will appear here once the daily stats job has run
              </p>
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}
