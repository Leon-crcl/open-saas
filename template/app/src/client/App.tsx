import { useEffect, useMemo } from "react";
import { Outlet, useLocation } from "react-router";
import { routes } from "wasp/client/router";
import { Toaster } from "../client/components/ui/toaster";
import "./Main.css";
import { AppShell } from "./components/AppShell";
import { NavBar } from "./components/NavBar/NavBar";
import { marketingNavigationItems } from "./components/NavBar/constants";
import { CookieConsentBanner } from "./components/cookie-consent/Banner";
import { useColorMode } from "./hooks/useColorMode";

const appAreaRoutes = [
  routes.SupplierAnalyzerRoute.to,
  routes.FileUploadRoute.to,
  routes.AccountRoute.to,
];

const standaloneRoutes = [
  routes.LoginRoute.build(),
  routes.SignupRoute.build(),
];

/**
 * use this component to wrap all child components
 * this is useful for templates, themes, and context
 */
export function App() {
  const location = useLocation();
  // Keeps the persisted light/dark preference applied on every page.
  useColorMode();

  const isStandalonePage = useMemo(
    () => standaloneRoutes.includes(location.pathname),
    [location],
  );

  const isAppArea = useMemo(
    () => appAreaRoutes.some((route) => location.pathname.startsWith(route)),
    [location],
  );

  const isAdminDashboard = useMemo(() => {
    return location.pathname.startsWith(routes.AdminRoute.to);
  }, [location]);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView();
      }
    }
  }, [location]);

  return (
    <>
      <div className="bg-background text-foreground min-h-screen">
        {isAdminDashboard || isStandalonePage ? (
          <Outlet />
        ) : isAppArea ? (
          <AppShell>
            <Outlet />
          </AppShell>
        ) : (
          <>
            <NavBar navigationItems={marketingNavigationItems} />
            <Outlet />
          </>
        )}
      </div>
      <Toaster position="bottom-right" />
      <CookieConsentBanner />
    </>
  );
}
