import { ChevronsUpDown, LogOut } from "lucide-react";
import { useState } from "react";
import { logout } from "wasp/client/auth";
import { Link as WaspRouterLink } from "wasp/client/router";
import { type User as UserEntity } from "wasp/entities";
import { Avatar, AvatarFallback } from "../client/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../client/components/ui/dropdown-menu";
import { cn } from "../client/utils";
import { userMenuItems } from "./constants";

export function getUserDisplayName(user: Partial<UserEntity>) {
  return user.username || user.email || "Account";
}

export function UserAvatar({
  user,
  className,
}: {
  user: Partial<UserEntity>;
  className?: string;
}) {
  const initial = getUserDisplayName(user).charAt(0).toUpperCase();
  return (
    <Avatar className={cn("size-8", className)}>
      <AvatarFallback className="bg-brand-subtle text-brand text-xs font-semibold">
        {initial}
      </AvatarFallback>
    </Avatar>
  );
}

export function UserDropdown({
  user,
  variant = "compact",
}: {
  user: Partial<UserEntity>;
  /** `compact`: avatar only (top navigation). `full`: avatar + name (sidebar). */
  variant?: "compact" | "full";
}) {
  const [open, setOpen] = useState(false);
  const displayName = getUserDisplayName(user);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        {variant === "full" ? (
          <button
            type="button"
            className="hover:bg-accent focus-visible:ring-ring flex w-full items-center gap-2.5 rounded-md p-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2"
          >
            <UserAvatar user={user} />
            <span className="text-foreground min-w-0 flex-1 truncate text-sm font-medium">
              {displayName}
            </span>
            <ChevronsUpDown className="text-muted-foreground size-4 shrink-0" />
          </button>
        ) : (
          <button
            type="button"
            aria-label="Open user menu"
            className="focus-visible:ring-ring rounded-full focus-visible:outline-none focus-visible:ring-2"
          >
            <UserAvatar user={user} />
          </button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={variant === "full" ? "start" : "end"}
        className="w-56"
      >
        <DropdownMenuLabel className="font-normal">
          <p className="text-foreground truncate text-sm font-medium">
            {displayName}
          </p>
          {user.email && user.email !== displayName && (
            <p className="text-muted-foreground truncate text-xs">
              {user.email}
            </p>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {userMenuItems.map((item) => {
          if (item.isAuthRequired && !user) return null;
          if (item.isAdminOnly && (!user || !user.isAdmin)) return null;

          return (
            <DropdownMenuItem key={item.name} asChild>
              <WaspRouterLink
                to={item.to}
                onClick={() => setOpen(false)}
                className="flex w-full cursor-pointer items-center gap-2.5"
              >
                <item.icon className="text-muted-foreground size-4" />
                {item.name}
              </WaspRouterLink>
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => logout()}
          className="cursor-pointer gap-2.5"
        >
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
