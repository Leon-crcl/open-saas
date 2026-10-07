import type { ComponentProps, ReactNode } from "react";
import { Container } from "../../client/components/layout/Container";
import { cn } from "../../client/utils";

export function Section({
  className,
  children,
  ...props
}: ComponentProps<"section">) {
  return (
    <section
      className={cn("scroll-mt-20 py-20 sm:py-28", className)}
      {...props}
    >
      <Container>{children}</Container>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  as: Heading = "h2",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <p className="text-brand mb-3 text-sm font-medium">{eyebrow}</p>
      )}
      <Heading className="text-foreground text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        {title}
      </Heading>
      {description && (
        <p className="text-muted-foreground mt-4 text-base leading-7 text-pretty sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
