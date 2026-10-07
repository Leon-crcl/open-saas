import { Container } from "../../client/components/layout/Container";
import { socialProof } from "../contentSections";

export function SocialProof() {
  return (
    <section aria-labelledby="social-proof-heading" className="pb-6 sm:pb-10">
      <Container>
        <p
          id="social-proof-heading"
          className="text-muted-foreground text-center text-sm"
        >
          {socialProof.statement}
        </p>
        <ul className="mx-auto mt-8 grid max-w-3xl grid-cols-2 items-center gap-x-8 gap-y-6 sm:grid-cols-3 lg:max-w-none lg:grid-cols-6">
          {socialProof.companies.map((company, index) => (
            <li
              key={company}
              className="text-foreground/60 flex items-center justify-center gap-2 text-lg font-semibold tracking-tight"
            >
              <PlaceholderGlyph variant={index} />
              {company}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

// Simple geometric marks so the placeholder wordmarks read as logos.
function PlaceholderGlyph({ variant }: { variant: number }) {
  const common = "size-4 fill-current";
  switch (variant % 3) {
    case 0:
      return (
        <svg viewBox="0 0 16 16" className={common} aria-hidden="true">
          <circle cx="8" cy="8" r="7" />
        </svg>
      );
    case 1:
      return (
        <svg viewBox="0 0 16 16" className={common} aria-hidden="true">
          <path d="M8 1l7 14H1z" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 16 16" className={common} aria-hidden="true">
          <rect x="1.5" y="1.5" width="13" height="13" rx="3" />
        </svg>
      );
  }
}
