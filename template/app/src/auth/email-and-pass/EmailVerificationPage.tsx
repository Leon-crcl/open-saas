import { VerifyEmailForm } from "wasp/client/auth";
import { Link as WaspRouterLink, routes } from "wasp/client/router";
import { authAppearance } from "../appearance";
import { AuthPageLayout } from "../AuthPageLayout";

export function EmailVerificationPage() {
  return (
    <AuthPageLayout
      title="Verify your email"
      footer={
        <p>
          If everything is okay,{" "}
          <WaspRouterLink to={routes.LoginRoute.to}>go to login</WaspRouterLink>
        </p>
      }
    >
      <VerifyEmailForm appearance={authAppearance} />
    </AuthPageLayout>
  );
}
