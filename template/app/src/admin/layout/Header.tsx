import { Menu } from "lucide-react";
import { type AuthUser } from "wasp/auth";
import { DarkModeSwitcher } from "../../client/components/DarkModeSwitcher";
import { Button } from "../../client/components/ui/button";
import { UserDropdown } from "../../user/UserDropdown";
import { MessageButton } from "../dashboards/messages/MessageButton";

export function Header(props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
  user: AuthUser;
}) {
  return (
    <header className="bg-background/80 border-border sticky top-0 z-10 flex w-full border-b backdrop-blur-md">
      <div className="flex grow items-center justify-between h-16 px-4 sm:justify-end sm:gap-3 sm:px-8">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          {/* <!-- Hamburger Toggle BTN --> */}

          <Button
            variant="ghost"
            size="icon"
            aria-controls="sidebar"
            aria-label="Toggle navigation"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
          >
            <Menu className="size-5!" />
          </Button>

          {/* <!-- Hamburger Toggle BTN --> */}
        </div>

        <ul className="2xsm:gap-4 flex items-center gap-2">
          {/* <!-- Dark Mode Toggler --> */}
          <DarkModeSwitcher />
          {/* <!-- Dark Mode Toggler --> */}

          {/* <!-- Chat Notification Area --> */}
          <MessageButton />
          {/* <!-- Chat Notification Area --> */}
        </ul>

        <div className="2xsm:gap-7 flex items-center gap-3">
          {/* <!-- User Area --> */}
          <UserDropdown user={props.user} />
          {/* <!-- User Area --> */}
        </div>
      </div>
    </header>
  );
}
