import { useAuth } from "wasp/client/auth";
import { Link as WaspRouterLink, routes } from "wasp/client/router";
import { Button } from "./ui/button";

export function NotFoundPage() {
  const { data: user } = useAuth();

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-5">
      <div className="text-center">
        <p className="text-brand text-sm font-semibold">404</p>
        <h1 className="text-foreground mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Page not found
        </h1>
        <p className="text-muted-foreground mx-auto mt-4 max-w-sm text-base leading-7">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <Button asChild size="lg" className="mt-8">
          <WaspRouterLink
            to={user ? routes.DemoAppRoute.to : routes.LandingPageRoute.to}
          >
            {user ? "Back to the app" : "Back to home"}
          </WaspRouterLink>
        </Button>
      </div>
    </div>
  );
}
