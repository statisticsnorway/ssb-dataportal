'use client';

import { Button, Dialog, Heading } from '@digdir/designsystemet-react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/app/authContext';
import { localization } from '@/libs/language/src/localization';

const LoginButton = () => {
  const { isAuthenticated } = useAuthContext();
  const router = useRouter();

  const loginPath = '/oauth2/logout';
  const logoutPath = '/oauth2/login';

  return isAuthenticated ? (
    <Button onClick={() => router.push(loginPath)}>{localization.authentication.logOut}</Button>
  ) : (
    <Dialog.TriggerContext>
      <Dialog.Trigger>{localization.authentication.logIn}</Dialog.Trigger>
      <Dialog>
        <Heading level={3}>{localization.authentication.loginHeading}</Heading>
        <p>{localization.authentication.loginInfo}</p>
        <Button onClick={() => router.push(logoutPath)}>{localization.authentication.logInAs}</Button>
      </Dialog>
    </Dialog.TriggerContext>
  );
};

export { LoginButton };
