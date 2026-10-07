import { CheckCircle2, XCircle } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Link, routes } from "wasp/client/router";
import { Button } from "../client/components/ui/button";

const ACCOUNT_PAGE_REDIRECT_DELAY_MS = 4000;

export enum CheckoutResult {
  Success = "success",
  Canceled = "canceled",
}

export function CheckoutResultPage() {
  const navigate = useNavigate();
  const [urlSearchParams] = useSearchParams();
  const status = urlSearchParams.get("status");

  useEffect(() => {
    const accountPageRedirectTimeoutId = setTimeout(() => {
      navigate(routes.AccountRoute.to);
    }, ACCOUNT_PAGE_REDIRECT_DELAY_MS);

    return () => {
      clearTimeout(accountPageRedirectTimeoutId);
    };
  }, [navigate]);

  if (
    status === null ||
    (status !== CheckoutResult.Success && status !== CheckoutResult.Canceled)
  ) {
    return <Link to={routes.AccountRoute.to} />;
  }

  const isSuccess = status === CheckoutResult.Success;
  const Icon = isSuccess ? CheckCircle2 : XCircle;

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-5 py-24 text-center">
      <div
        className={
          isSuccess
            ? "bg-success/10 text-success flex size-12 items-center justify-center rounded-full"
            : "bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-full"
        }
      >
        <Icon className="size-6" aria-hidden="true" />
      </div>
      <h1 className="text-foreground mt-6 text-2xl font-semibold tracking-tight">
        {isSuccess ? "Payment successful" : "Payment canceled"}
      </h1>
      <p className="text-muted-foreground mt-2 text-sm leading-6">
        {isSuccess
          ? "Thank you! Your account has been updated."
          : "No charge was made. You can try again whenever you are ready."}{" "}
        You will be redirected to your account in{" "}
        {ACCOUNT_PAGE_REDIRECT_DELAY_MS / 1000} seconds.
      </p>
      <Button asChild className="mt-6">
        <Link to={routes.AccountRoute.to}>Go to account now</Link>
      </Button>
    </div>
  );
}
