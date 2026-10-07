import { SignupForm } from "wasp/client/auth";
import { Link as WaspRouterLink, routes } from "wasp/client/router";
import { authAppearance } from "./appearance";
import { AuthPageLayout } from "./AuthPageLayout";
import { useRedirectIfLoggedIn } from "./hooks/useRedirectIfLoggedIn";

export function SignupPage() {
  useRedirectIfLoggedIn();

  return (
    <AuthPageLayout
      title="Create your account"
      description="Plan your first day in under a minute."
      footer={
        <p>
          Already have an account?{" "}
          <WaspRouterLink to={routes.LoginRoute.to}>Log in</WaspRouterLink>
        </p>
      }
    >
      <SignupForm appearance={authAppearance} />
    </AuthPageLayout>
  );
}
