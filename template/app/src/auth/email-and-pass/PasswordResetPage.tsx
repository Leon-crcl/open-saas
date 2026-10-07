import { ResetPasswordForm } from "wasp/client/auth";
import { Link as WaspRouterLink, routes } from "wasp/client/router";
import { authAppearance } from "../appearance";
import { AuthPageLayout } from "../AuthPageLayout";

export function PasswordResetPage() {
  return (
    <AuthPageLayout
      title="Choose a new password"
      footer={
        <p>
          If everything is okay,{" "}
          <WaspRouterLink to={routes.LoginRoute.to}>go to login</WaspRouterLink>
        </p>
      }
    >
      <ResetPasswordForm appearance={authAppearance} />
    </AuthPageLayout>
  );
}
