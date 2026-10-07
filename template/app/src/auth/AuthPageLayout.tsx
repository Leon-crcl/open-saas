import { ArrowLeft } from "lucide-react";
import { ReactNode } from "react";
import { Link as WaspRouterLink, routes } from "wasp/client/router";
import { Logo } from "../client/components/Logo";
import { DarkModeSwitcher } from "../client/components/DarkModeSwitcher";

export function AuthPageLayout({
  title,
  description,
  footer,
  children,
}: {
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <header className="flex items-center justify-between px-5 py-5 sm:px-8">
        <WaspRouterLink
          to={routes.LandingPageRoute.to}
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to home
        </WaspRouterLink>
        <DarkModeSwitcher />
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-5 pb-16 pt-4">
        <div className="w-full max-w-[420px]">
          <div className="mb-8 flex flex-col items-center text-center">
            <WaspRouterLink to={routes.LandingPageRoute.to} aria-label="Home">
              <Logo showName={false} className="[&_svg]:size-10" />
            </WaspRouterLink>
            <h1 className="text-foreground mt-6 text-2xl font-semibold tracking-tight">
              {title}
            </h1>
            {description && (
              <p className="text-muted-foreground mt-2 text-sm leading-6">
                {description}
              </p>
            )}
          </div>

          {/* The auth form renders its own light inputs, so the surface stays
              light in both color modes to keep the form fully legible. */}
          <div className="rounded-xl border border-zinc-200 bg-white px-6 py-7 text-zinc-900 shadow-sm sm:px-8 [&_a]:text-zinc-900 [&_a]:underline-offset-4">
            {children}
          </div>

          {footer && (
            <div className="text-muted-foreground mt-6 space-y-2 text-center text-sm [&_a]:text-foreground [&_a]:font-medium [&_a]:underline-offset-4 hover:[&_a]:underline">
              {footer}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
