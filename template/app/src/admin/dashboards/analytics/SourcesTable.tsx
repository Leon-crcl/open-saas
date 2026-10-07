import { type PageViewSource } from "wasp/entities";

export function SourcesTable({
  sources,
}: {
  sources: PageViewSource[] | undefined;
}) {
  return (
    <div className="border-border bg-card rounded-lg border p-5 shadow-xs sm:p-6">
      <h4 className="text-foreground mb-4 text-base font-semibold">
        Top Sources
      </h4>

      <div className="flex flex-col">
        <div className="bg-muted/60 grid grid-cols-3 rounded-md">
          <div className="px-3 py-3">
            <h5 className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
              Source
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
              Visitors
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
              Sales
            </h5>
          </div>
        </div>

        {sources && sources.length > 0 ? (
          sources.map((source) => (
            <div
              key={source.name}
              className="border-border grid grid-cols-3 border-b last:border-b-0"
            >
              <div className="flex items-center gap-3 px-3 py-3">
                <p className="text-foreground text-sm tabular-nums">
                  {source.name}
                </p>
              </div>

              <div className="flex items-center justify-center px-3 py-3">
                <p className="text-foreground text-sm tabular-nums">
                  {source.visitors}
                </p>
              </div>

              <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                <p className="text-foreground text-sm tabular-nums">--</p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center px-3 py-3">
            <p className="text-foreground text-sm tabular-nums">
              No data to display
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
