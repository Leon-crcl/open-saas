import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../../client/utils";
import { showcase } from "../contentSections";
import {
  ComparisonPreview,
  RankingPreview,
  SupplierFormPreview,
  WeightsPreview,
  WindowFrame,
} from "./previews";
import { Section, SectionHeading } from "./Section";

const visuals: Record<(typeof showcase)[number]["id"], ReactNode> = {
  collect: (
    <WindowFrame title="app.supplyr.com/analyzer">
      <SupplierFormPreview />
    </WindowFrame>
  ),
  weigh: (
    <WindowFrame title="app.supplyr.com/analyzer">
      <div className="grid sm:grid-cols-[1fr_1.3fr]">
        <WeightsPreview className="border-border border-b sm:border-b-0 sm:border-r" />
        <RankingPreview />
      </div>
    </WindowFrame>
  ),
  compare: (
    <WindowFrame title="app.supplyr.com/analyzer">
      <ComparisonPreview />
    </WindowFrame>
  ),
};

export function ProductShowcase() {
  return (
    <Section id="how-it-works" className="bg-muted/40 border-border border-y">
      <SectionHeading
        eyebrow="How it works"
        title="From scattered data to a clear decision"
        description="Three simple steps, all in one calm, fast interface."
      />
      <div className="mt-16 space-y-20 sm:mt-24 sm:space-y-32">
        {showcase.map((item, index) => (
          <div
            key={item.id}
            className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20"
          >
            <div className={cn(index % 2 === 1 && "lg:order-2")}>
              <p className="text-brand text-sm font-medium">
                {String(index + 1).padStart(2, "0")} · {item.eyebrow}
              </p>
              <h3 className="text-foreground mt-3 text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
                {item.title}
              </h3>
              <p className="text-muted-foreground mt-4 text-base leading-7">
                {item.description}
              </p>
              <ul className="mt-6 space-y-3">
                {item.points.map((point) => (
                  <li key={point} className="flex gap-3 text-sm">
                    <Check
                      className="text-brand mt-0.5 size-4 shrink-0"
                      aria-hidden="true"
                    />
                    <span className="text-foreground">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div
              className="mx-auto w-full max-w-lg lg:max-w-none"
            >
              {visuals[item.id]}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
