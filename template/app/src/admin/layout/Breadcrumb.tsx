import { Link as WaspRouterLink, routes } from "wasp/client/router";

interface BreadcrumbProps {
  pageName: string;
}

export function Breadcrumb({ pageName }: BreadcrumbProps) {
  return (
    <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="text-foreground text-2xl font-semibold tracking-tight">
        {pageName}
      </h1>

      <nav aria-label="Breadcrumb">
        <ol className="text-muted-foreground flex items-center gap-1.5 text-sm">
          <li>
            <WaspRouterLink
              to={routes.AdminRoute.to}
              className="hover:text-foreground transition-colors"
            >
              Dashboard
            </WaspRouterLink>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-foreground font-medium" aria-current="page">
            {pageName}
          </li>
        </ol>
      </nav>
    </div>
  );
}
