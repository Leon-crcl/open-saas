import { routes } from "wasp/client/router";
import { DocsUrl } from "../../../shared/common";
import type { NavigationItem } from "./NavBar";

export const marketingNavigationItems: NavigationItem[] = [
  { name: "Features", to: "/#features" },
  { name: "Pricing", to: routes.PricingPageRoute.to },
  { name: "FAQ", to: "/#faq" },
  { name: "Docs", to: DocsUrl },
] as const;
