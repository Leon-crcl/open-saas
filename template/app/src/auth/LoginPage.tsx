import { LoginForm } from "wasp/client/auth";
import { Link as WaspRouterLink, routes } from "wasp/client/router";
import { authAppearance } from "./appearance";
import { AuthPageLayout } from "./AuthPageLayout";
import { useRedirectIfLoggedIn } from "./hooks/useRedirectIfLoggedIn";

export function LoginPage() {
  useRedirectIfLoggedIn();

  return (
    <AuthPageLayout
      title="Welcome back"
      description="Log in to pick up where you left off."
      footer={
        <>
          <p>
            Don't have an account yet?{" "}
            <WaspRouterLink to={routes.SignupRoute.to}>Sign up</WaspRouterLink>
          </p>
          <p>
            Forgot your password?{" "}
            <WaspRouterLink to={routes.RequestPasswordResetRoute.to}>
              Reset it
            </WaspRouterLink>
          </p>
        </>
      }
    >
      <LoginForm appearance={authAppearance} />
    </AuthPageLayout>
  );
}
