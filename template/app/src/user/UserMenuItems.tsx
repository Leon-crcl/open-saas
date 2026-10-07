import { LogOut } from "lucide-react";
import { logout } from "wasp/client/auth";
import { Link as WaspRouterLink } from "wasp/client/router";
import { type User } from "wasp/entities";
import { userMenuItems } from "./constants";

const itemClassName =
  "text-foreground hover:bg-accent flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors";

export function UserMenuItems({
  user,
  onItemClick,
}: {
  user?: Partial<User>;
  onItemClick?: () => void;
}) {
  return (
    <>
      {userMenuItems.map((item) => {
        if (item.isAuthRequired && !user) return null;
        if (item.isAdminOnly && (!user || !user.isAdmin)) return null;

        return (
          <li key={item.name}>
            <WaspRouterLink
              to={item.to}
              onClick={onItemClick}
              className={itemClassName}
            >
              <item.icon className="text-muted-foreground size-4" />
              {item.name}
            </WaspRouterLink>
          </li>
        );
      })}
      <li>
        <button
          type="button"
          onClick={() => {
            logout();
            onItemClick?.();
          }}
          className={itemClassName}
        >
          <LogOut className="text-muted-foreground size-4" />
          Log out
        </button>
      </li>
    </>
  );
}
