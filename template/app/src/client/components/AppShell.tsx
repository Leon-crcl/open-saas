import {
  CreditCard,
  FileUp,
  Menu,
  Scale,
  Settings,
  Shield,
  type LucideIcon,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { useAuth } from "wasp/client/auth";
import { Link as WaspRouterLink, routes } from "wasp/client/router";
import { getSupplierWorkspace, useQuery } from "wasp/client/operations";
import { NavLink } from "react-router";
import { MAX_SUPPLIER_LIMIT } from "../../supplier-analyzer/limits";
import { UserDropdown } from "../../user/UserDropdown";
import { cn } from "../utils";
import { DarkModeSwitcher } from "./DarkModeSwitcher";
import { Logo } from "./Logo";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

interface AppNavItem {
  name: string;
  to: string;
  icon: LucideIcon;
  adminOnly?: boolean;
}

const appNavItems: AppNavItem[] = [
  {
    name: "Supplier Analyzer",
    to: routes.SupplierAnalyzerRoute.to,
    icon: Scale,
  },
  { name: "Documents", to: routes.FileUploadRoute.to, icon: FileUp },
  { name: "Account", to: routes.AccountRoute.to, icon: Settings },
  { name: "Plans & billing", to: routes.PricingPageRoute.to, icon: CreditCard },
  { name: "Admin", to: routes.AdminRoute.to, icon: Shield, adminOnly: true },
];

/** Authenticated application layout: sidebar on desktop, top bar + drawer below. */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background min-h-screen lg:grid lg:grid-cols-[248px_1fr]">
      <aside className="border-border bg-card sticky top-0 hidden h-screen flex-col border-r lg:flex">
        <SidebarContent />
      </aside>
      <div className="flex min-w-0 flex-col">
        <MobileTopBar />
        <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          {children}
        </main>
      </div>
    </div>
  );
}

function MobileTopBar() {
  const { data: user } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="border-border bg-background/80 sticky top-0 z-40 flex h-14 items-center justify-between border-b px-4 backdrop-blur-md lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Open navigation">
            <Menu className="size-5!" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex w-[280px] flex-col p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <SidebarContent onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
      <WaspRouterLink to={routes.SupplierAnalyzerRoute.to} aria-label="Home">
        <Logo />
      </WaspRouterLink>
      <div className="flex w-9 justify-end">
        {user && <UserDropdown user={user} />}
      </div>
    </header>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { data: user } = useAuth();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center px-5">
        <WaspRouterLink
          to={routes.LandingPageRoute.to}
          onClick={onNavigate}
          aria-label="Home"
        >
          <Logo />
        </WaspRouterLink>
      </div>

      <nav
        aria-label="Application"
        className="flex-1 overflow-y-auto px-3 py-2"
      >
        <ul className="space-y-0.5">
          {appNavItems
            .filter((item) => !item.adminOnly || user?.isAdmin)
            .map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.to}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      "focus-visible:ring-ring flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2",
                      isActive
                        ? "bg-accent text-foreground"
                        : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                    )
                  }
                >
                  <item.icon className="size-4 shrink-0" aria-hidden="true" />
                  {item.name}
                </NavLink>
              </li>
            ))}
        </ul>
      </nav>

      <div className="border-border space-y-3 border-t p-3">
        {user && <UsageCard onNavigate={onNavigate} />}
        <div className="flex items-center gap-1">
          <div className="min-w-0 flex-1">
            {user && <UserDropdown user={user} variant="full" />}
          </div>
          <DarkModeSwitcher />
        </div>
      </div>
    </div>
  );
}

function UsageCard({ onNavigate }: { onNavigate?: () => void }) {
  const { data: workspace } = useQuery(getSupplierWorkspace);
  if (!workspace) return null;

  const used = workspace.suppliers.length;
  const limit = workspace.supplierLimit;
  const canUpgrade = limit < MAX_SUPPLIER_LIMIT;
  const percent = Math.min(100, (used / limit) * 100);

  return (
    <div className="bg-muted/60 rounded-lg p-3">
      <div className="flex items-baseline justify-between">
        <span className="text-muted-foreground text-xs font-medium">
          Suppliers
        </span>
        <span className="text-foreground text-sm font-semibold tabular-nums">
          {used}
          <span className="text-muted-foreground font-normal">
            {" "}
            / {limit}
          </span>
        </span>
      </div>
      <Progress value={percent} className="mt-2" />
      {canUpgrade && (
        <>
          <WaspRouterLink
            to={routes.PricingPageRoute.to}
            onClick={onNavigate}
            className="text-brand mt-2 inline-block text-xs font-medium hover:underline"
          >
            Upgrade for more
          </WaspRouterLink>
        </>
      )}
    </div>
  );
}
