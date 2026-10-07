import { ArrowRight } from "lucide-react";
import { Link as WaspRouterLink, routes } from "wasp/client/router";
import { Container } from "../../client/components/layout/Container";
import { Badge } from "../../client/components/ui/badge";
import { Button } from "../../client/components/ui/button";
import { hero } from "../contentSections";
import { RankingPreview, WeightsPreview, WindowFrame } from "./previews";

export function Hero() {
  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="from-brand/10 pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-gradient-to-b to-transparent [mask-image:radial-gradient(ellipse_60%_80%_at_50%_0%,black,transparent)]"
      />
      <Container className="relative pb-20 pt-14 sm:pb-28 sm:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <Badge
            variant="outline"
            className="bg-background/60 mb-6 py-1 pl-1.5 pr-3"
          >
            <span className="bg-brand-subtle text-brand rounded-full px-2 py-0.5 text-[11px]">
              New
            </span>
            {hero.eyebrow}
          </Badge>
          <h1 className="text-foreground text-4xl font-semibold leading-[1.08] tracking-tight text-balance sm:text-6xl">
            {hero.headline}
          </h1>
          <p className="text-muted-foreground mx-auto mt-6 max-w-xl text-base leading-7 text-pretty sm:text-lg sm:leading-8">
            {hero.subheadline}
          </p>
          <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Button size="lg" asChild>
              <WaspRouterLink to={routes.SignupRoute.to}>
                Get started <ArrowRight />
              </WaspRouterLink>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <WaspRouterLink to={routes.PricingPageRoute.to}>
                View pricing
              </WaspRouterLink>
            </Button>
          </div>
        </div>

        <div className="relative mx-auto mt-14 max-w-4xl sm:mt-20">
          <WindowFrame title="app.supplyr.com/analyzer">
            <div className="grid md:grid-cols-[1fr_1.4fr]">
              <WeightsPreview className="border-border hidden border-r md:block" />
              <RankingPreview />
            </div>
          </WindowFrame>
          <div
            aria-hidden="true"
            className="from-background pointer-events-none absolute inset-x-0 -bottom-px h-24 bg-gradient-to-t to-transparent sm:h-32"
          />
        </div>
      </Container>
    </div>
  );
}
