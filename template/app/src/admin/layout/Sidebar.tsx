import {
  Calendar,
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  LayoutTemplate,
  Settings,
  Sheet,
  X,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router";
import { Link, routes } from "wasp/client/router";
import { Logo } from "../../client/components/Logo";
import { cn } from "../../client/utils";
import { SidebarLinkGroup } from "./SidebarLinkGroup";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

export function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef<HTMLButtonElement>(null);
  const sidebar = useRef<HTMLElement>(null);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true",
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: PointerEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target as Node) ||
        trigger.current.contains(target as Node)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={cn(
        "bg-card border-border z-9999 w-64 absolute left-0 top-0 flex h-screen flex-col overflow-y-hidden border-r duration-300 ease-linear lg:static lg:translate-x-0",
        {
          "translate-x-0": sidebarOpen,
          "-translate-x-full": !sidebarOpen,
        },
      )}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex h-16 items-center justify-between gap-2 px-5">
        <Link to={routes.LandingPageRoute.to}>
          <Logo />
        </Link>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <X className="size-5" />
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="px-3 py-4">
          {/* <!-- Menu Group --> */}
          <div>
            <h3 className="text-muted-foreground mb-3 ml-3 text-xs font-medium uppercase tracking-wider">
              Menu
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              {/* <!-- Menu Item Dashboard --> */}
              <NavLink
                to={routes.AdminRoute.to}
                end
                className={({ isActive }) =>
                  cn(
                    "text-muted-foreground hover:bg-accent hover:text-accent-foreground group relative flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    {
                      "bg-accent text-foreground": isActive,
                    },
                  )
                }
              >
                <LayoutDashboard />
                Dashboard
              </NavLink>

              {/* <!-- Menu Item Dashboard --> */}

              {/* <!-- Menu Item Users --> */}
              <li>
                <NavLink
                  to={routes.AdminUsersRoute.to}
                  end
                  className={({ isActive }) =>
                    cn(
                      "text-muted-foreground hover:bg-accent hover:text-accent-foreground group relative flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      {
                        "bg-accent text-foreground": isActive,
                      },
                    )
                  }
                >
                  <Sheet />
                  Users
                </NavLink>
              </li>
              {/* <!-- Menu Item Users --> */}

              {/* <!-- Menu Item Settings --> */}
              <li>
                <NavLink
                  to={routes.AdminSettingsRoute.to}
                  end
                  className={({ isActive }) =>
                    cn(
                      "text-muted-foreground hover:bg-accent hover:text-accent-foreground group relative flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      {
                        "bg-accent text-foreground": isActive,
                      },
                    )
                  }
                >
                  <Settings />
                  Settings
                </NavLink>
              </li>
              {/* <!-- Menu Item Settings --> */}
            </ul>
          </div>

          {/* <!-- Others Group --> */}
          <div>
            <h3 className="text-muted-foreground mb-3 ml-3 text-xs font-medium uppercase tracking-wider">
              Extra Components
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              {/* <!-- Menu Item Calendar --> */}
              <li>
                <NavLink
                  to={routes.AdminCalendarRoute.to}
                  end
                  className={({ isActive }) =>
                    cn(
                      "text-muted-foreground hover:bg-accent hover:text-accent-foreground group relative flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      {
                        "bg-accent text-foreground": isActive,
                      },
                    )
                  }
                >
                  <Calendar />
                  Calendar
                </NavLink>
              </li>
              {/* <!-- Menu Item Calendar --> */}

              {/* <!-- Menu Item Ui Elements --> */}
              <SidebarLinkGroup
                activeCondition={pathname === "/ui" || pathname.includes("ui")}
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <NavLink
                        to="#"
                        className={cn(
                          "text-muted-foreground hover:bg-accent hover:text-accent-foreground group relative flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                          {
                            "bg-accent text-foreground":
                              pathname.includes("ui"),
                          },
                        )}
                        onClick={(e) => {
                          e.preventDefault();
                          if (sidebarExpanded) {
                            handleClick();
                          } else {
                            setSidebarExpanded(true);
                          }
                        }}
                      >
                        <LayoutTemplate />
                        UI Elements
                        {open ? <ChevronUp /> : <ChevronDown />}
                      </NavLink>
                      {/* <!-- Dropdown Menu Start --> */}
                      <div
                        className={cn("translate transform overflow-hidden", {
                          hidden: !open,
                        })}
                      >
                        <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                          <li>
                            <NavLink
                              to={routes.AdminUIButtonsRoute.to}
                              end
                              className={({ isActive }) =>
                                cn(
                                  "text-muted-foreground hover:text-accent group relative flex items-center gap-2.5 rounded-md px-4 font-medium duration-300 ease-in-out",
                                  { "text-accent!": isActive },
                                )
                              }
                            >
                              Buttons
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                      {/* <!-- Dropdown Menu End --> */}
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
              {/* <!-- Menu Item Ui Elements --> */}
            </ul>
          </div>
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
}
