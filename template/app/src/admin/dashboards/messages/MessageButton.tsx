import { MessageCircleMore } from "lucide-react";
import { Link as WaspRouterLink, routes } from "wasp/client/router";
import { Button } from "../../../client/components/ui/button";

export function MessageButton() {
  return (
    <li className="relative">
      <Button variant="ghost" size="icon" asChild>
        <WaspRouterLink to={routes.AdminMessagesRoute.to} aria-label="Messages">
          <MessageCircleMore className="size-5!" />
          <span
            aria-hidden="true"
            className="bg-brand ring-background absolute right-1.5 top-1.5 size-2 rounded-full ring-2"
          />
        </WaspRouterLink>
      </Button>
    </li>
  );
}
