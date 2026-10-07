import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { Link as ReactRouterLink } from "react-router";
import { useAuth } from "wasp/client/auth";
import { Link as WaspRouterLink, routes } from "wasp/client/router";
import { throttleWithTrailingInvocation } from "../../../shared/utils";
import { UserDropdown } from "../../../user/UserDropdown";
import { UserMenuItems } from "../../../user/UserMenuItems";
import { cn } from "../../utils";
import { DarkModeSwitcher } from "../DarkModeSwitcher";
import { Logo } from "../Logo";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

export interface NavigationItem {
  name: string;
  to: string;
}

export function NavBar({
  navigationItems,
}: {
  navigationItems: NavigationItem[];
}) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const throttledHandler = throttleWithTrailingInvocation(() => {
      setIsScrolled(window.scrollY > 8);
    }, 50);
    throttledHandler();

    window.addEventListener("scroll", throttledHandler, { passive: true });
    return () => {
      window.removeEventListener("scroll", throttledHandler);
      throttledHandler.cancel();
    };
  }, []);

  return (
    <header
      className={cn(
        "bg-background/80 sticky top-0 z-50 border-b border-transparent backdrop-blur-md transition-colors duration-200",
        isScrolled && "border-border",
      )}
    >
      <nav
        className="mx-auto grid h-16 max-w-6xl grid-cols-[1fr_auto] items-center gap-4 px-5 sm:px-6 lg:grid-cols-[1fr_auto_1fr] lg:px-8"
        aria-label="Main"
      >
        <WaspRouterLink
          to={routes.LandingPageRoute.to}
          className="focus-visible:ring-ring -m-1 w-fit rounded-md p-1 focus-visible:outline-none focus-visible:ring-2"
          aria-label="Home"
        >
          <Logo />
        </WaspRouterLink>

        <ul className="hidden items-center gap-1 lg:flex">
          {navigationItems.map((item) => (
            <li key={item.name}>
              <NavLink item={item} />
            </li>
          ))}
        </ul>

        <NavBarActions />
        <NavBarMobileMenu navigationItems={navigationItems} />
      </nav>
    </header>
  );
}

function NavLink({
  item,
  onClick,
  className,
}: {
  item: NavigationItem;
  onClick?: () => void;
  className?: string;
}) {
  const isExternal = item.to.startsWith("http");
  return (
    <ReactRouterLink
      to={item.to}
      onClick={onClick}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={cn(
        "text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2",
        className,
      )}
    >
      {item.name}
    </ReactRouterLink>
  );
}

function NavBarActions() {
  const { data: user, isLoading: isUserLoading } = useAuth();

  return (
    <div className="hidden items-center justify-end gap-2 lg:flex">
      <DarkModeSwitcher />
      {isUserLoading ? null : !user ? (
        <>
          <Button variant="ghost" asChild>
            <WaspRouterLink to={routes.LoginRoute.to}>Log in</WaspRouterLink>
          </Button>
          <Button asChild>
            <WaspRouterLink to={routes.SignupRoute.to}>
              Get started
            </WaspRouterLink>
          </Button>
        </>
      ) : (
        <>
          <Button asChild>
            <WaspRouterLink to={routes.DemoAppRoute.to}>
              Open app
            </WaspRouterLink>
          </Button>
          <UserDropdown user={user} />
        </>
      )}
    </div>
  );
}

function NavBarMobileMenu({
  navigationItems,
}: {
  navigationItems: NavigationItem[];
}) {
  const { data: user, isLoading: isUserLoading } = useAuth();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="flex items-center justify-end gap-1 lg:hidden">
      <DarkModeSwitcher />
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Open main menu">
            <Menu className="size-5!" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="flex w-[300px] flex-col p-5">
          <SheetHeader className="text-left">
            <SheetTitle>
              <Logo />
            </SheetTitle>
          </SheetHeader>
          <ul className="mt-6 flex flex-col gap-1">
            {navigationItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  item={item}
                  onClick={close}
                  className="text-foreground block py-2.5 text-base"
                />
              </li>
            ))}
          </ul>
          <div className="border-border mt-auto flex flex-col gap-2 border-t pt-5">
            {isUserLoading ? null : !user ? (
              <>
                <Button size="lg" asChild onClick={close}>
                  <WaspRouterLink to={routes.SignupRoute.to}>
                    Get started
                  </WaspRouterLink>
                </Button>
                <Button size="lg" variant="outline" asChild onClick={close}>
                  <WaspRouterLink to={routes.LoginRoute.to}>
                    Log in
                  </WaspRouterLink>
                </Button>
              </>
            ) : (
              <ul className="flex flex-col gap-1">
                <UserMenuItems user={user} onItemClick={close} />
              </ul>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
