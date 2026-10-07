import { benefits } from "../contentSections";
import { Section, SectionHeading } from "./Section";

export function Benefits() {
  return (
    <Section>
      <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <SectionHeading
          align="left"
          title={benefits.title}
          description={benefits.description}
          className="lg:sticky lg:top-28 lg:self-start"
        />
        <ol className="divide-border border-border divide-y border-y">
          {benefits.items.map((item, index) => (
            <li key={item.title} className="flex gap-5 py-7 sm:gap-8 sm:py-9">
              <span className="text-muted-foreground pt-1 font-mono text-sm tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-foreground text-lg font-semibold tracking-tight">
                  {item.title}
                </h3>
                <p className="text-muted-foreground mt-2 text-base leading-7">
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
