import { Button } from '@digdir/designsystemet-react';
import { useAuthContext } from '@/app/authContext';
import { localization } from '@/libs/language/src/localization';

const LoginButton = () => {
  const { isAuthenticated } = useAuthContext();

  //GET /oauth2/session
  const redirectTo = encodeURIComponent(window.location.pathname);
  return isAuthenticated ? (
    <Button onClick={() => (window.location.href = `/oauth2/logout`)}>{localization.authentication.logOut}</Button>
  ) : (
    <Button onClick={() => (window.location.href = `/oauth2/login?redirect=${redirectTo}`)}>
      {localization.authentication.logIn}
    </Button>
  );
};

export { LoginButton };
