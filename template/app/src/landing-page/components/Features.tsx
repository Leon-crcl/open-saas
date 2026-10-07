import { featuresSection, features } from "../contentSections";
import { Section, SectionHeading } from "./Section";

export function Features() {
  return (
    <Section id="features">
      <SectionHeading
        eyebrow="Features"
        title={featuresSection.title}
        description={featuresSection.description}
      />
      <dl className="bg-border border-border mt-14 grid gap-px overflow-hidden rounded-xl border sm:mt-20 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <div key={feature.name} className="bg-background p-6 sm:p-8">
            <div className="border-border bg-card text-foreground flex size-10 items-center justify-center rounded-lg border shadow-xs">
              <feature.icon className="size-5" aria-hidden="true" />
            </div>
            <dt className="text-foreground mt-5 text-base font-semibold">
              {feature.name}
            </dt>
            <dd className="text-muted-foreground mt-2 text-sm leading-6">
              {feature.description}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
