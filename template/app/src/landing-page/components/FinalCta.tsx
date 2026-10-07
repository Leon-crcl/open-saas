import { ArrowRight } from "lucide-react";
import { Link as WaspRouterLink, routes } from "wasp/client/router";
import { Container } from "../../client/components/layout/Container";
import { Button } from "../../client/components/ui/button";
import { finalCta } from "../contentSections";

export function FinalCta() {
  return (
    <section className="pb-20 sm:pb-28">
      <Container>
        <div className="bg-primary text-primary-foreground relative overflow-hidden rounded-2xl px-6 py-14 text-center sm:px-16 sm:py-20">
          <div
            aria-hidden="true"
            className="from-brand/40 pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b to-transparent [mask-image:radial-gradient(ellipse_50%_100%_at_50%_0%,black,transparent)]"
          />
          <h2 className="relative mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {finalCta.title}
          </h2>
          <p className="text-primary-foreground/70 relative mx-auto mt-4 max-w-xl text-base leading-7 sm:text-lg">
            {finalCta.description}
          </p>
          <div className="relative mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Button
              size="lg"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              asChild
            >
              <WaspRouterLink to={routes.SignupRoute.to}>
                Create your account <ArrowRight />
              </WaspRouterLink>
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              asChild
            >
              <WaspRouterLink to={routes.PricingPageRoute.to}>
                View pricing
              </WaspRouterLink>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
