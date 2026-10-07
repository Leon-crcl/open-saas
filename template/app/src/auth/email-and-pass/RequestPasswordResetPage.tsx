import { ForgotPasswordForm } from "wasp/client/auth";
import { Link as WaspRouterLink, routes } from "wasp/client/router";
import { authAppearance } from "../appearance";
import { AuthPageLayout } from "../AuthPageLayout";

export function RequestPasswordResetPage() {
  return (
    <AuthPageLayout
      title="Reset your password"
      description="Enter your email and we'll send you a reset link."
      footer={
        <p>
          Remembered it?{" "}
          <WaspRouterLink to={routes.LoginRoute.to}>
            Back to login
          </WaspRouterLink>
        </p>
      }
    >
      <ForgotPasswordForm appearance={authAppearance} />
    </AuthPageLayout>
  );
}
