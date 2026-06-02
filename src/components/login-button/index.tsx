'use client';

import { Button, Dialog, Heading } from '@digdir/designsystemet-react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthContext } from '@/app/authContext';
import { getLoginUrl, getLogoutUrl } from '@/libs/auth/urls';
import { localization } from '@/libs/language/src/localization';

/**
 * LoginButton component handles the display and behavior of the login/logout UI.
 *
 * - If the user is authenticated (`isAuthenticated` is true), it renders a "Log Out" button
 *   that navigates to the logout route when clicked.
 * - If the user is not authenticated, it renders a login dialog trigger. When opened, the dialog
 *   shows login information and a "Log In As SSB Employee" button that navigates to the login route.
 * - Redirects back to base page after login/logout
 *
 * @returns The logout button or login dialog trigger with login button.
 */
const LoginButton = () => {
  const { isAuthenticated } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();

  return isAuthenticated ? (
    <Button onClick={() => router.push(getLogoutUrl(pathname))}>{localization.authentication.logOut}</Button>
  ) : (
    <Dialog.TriggerContext>
      <Dialog.Trigger>{localization.authentication.logIn}</Dialog.Trigger>
      <Dialog>
        <Heading id='detailsHeading' className='infoHeadingPrimary' level={1}>
          {localization.authentication.loginHeading}
        </Heading>
        <p>{localization.authentication.loginInfo}</p>
        <Button onClick={() => router.push(getLoginUrl(pathname))}>
          {localization.authentication.logInSsbEmployee}
        </Button>
      </Dialog>
    </Dialog.TriggerContext>
  );
};

export { LoginButton };
