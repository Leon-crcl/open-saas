import { Github, Linkedin, Twitter } from "lucide-react";
import { Link as ReactRouterLink } from "react-router";
import { Container } from "../../client/components/layout/Container";
import { Logo } from "../../client/components/Logo";
import { brand } from "../../shared/brand";
import type {
  FooterLink,
  footerNavigation as footerNavigationData,
} from "../contentSections";

const socialLinks = [
  { name: "X", href: brand.social.x, icon: Twitter },
  { name: "GitHub", href: brand.social.github, icon: Github },
  { name: "LinkedIn", href: brand.social.linkedin, icon: Linkedin },
];

const linkClassName =
  "text-muted-foreground hover:text-foreground text-sm transition-colors";

function FooterAnchor({ link }: { link: FooterLink }) {
  const isInternal = link.href.startsWith("/");
  if (isInternal) {
    return (
      <ReactRouterLink to={link.href} className={linkClassName}>
        {link.name}
      </ReactRouterLink>
    );
  }
  const isExternal = link.href.startsWith("http");
  return (
    <a
      href={link.href}
      className={linkClassName}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
    >
      {link.name}
    </a>
  );
}

export function Footer({
  footerNavigation,
}: {
  footerNavigation: typeof footerNavigationData;
}) {
  return (
    <footer aria-labelledby="footer-heading" className="border-border border-t">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <Container className="py-14 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <div className="max-w-xs">
            <Logo />
            <p className="text-muted-foreground mt-4 text-sm leading-6">
              {brand.tagline}
            </p>
            <ul className="mt-6 flex gap-1">
              {socialLinks.map(({ name, href, icon: Icon }) => (
                <li key={name}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                    className="text-muted-foreground hover:bg-accent hover:text-foreground flex size-9 items-center justify-center rounded-md transition-colors"
                  >
                    <Icon className="size-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
            {Object.values(footerNavigation).map((group) => (
              <div key={group.title}>
                <h3 className="text-foreground text-sm font-semibold">
                  {group.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.name}>
                      <FooterAnchor link={link} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="border-border text-muted-foreground mt-14 flex flex-col gap-2 border-t pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {brand.name}. All rights reserved.
          </p>
          <p>Built with care for focused people.</p>
        </div>
      </Container>
    </footer>
  );
}
