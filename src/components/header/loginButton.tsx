import { Button } from '@digdir/designsystemet-react';
import { localization } from '@/libs/language/src/localization';

const LoginButton = () => {
  const { isAuthenticated } = useAuth();

  //GET /oauth2/session
  const redirectTo = encodeURIComponent(window.location.pathname);
  return isAuthenticated ? (
    <Button onClick={() => (window.location.href = `https://dataportal.test.ssb.no/oauth2/logout`)}>
      {localization.authentication.logOut}
    </Button>
  ) : (
    <Button
      onClick={() => (window.location.href = `https://dataportal.test.ssb.no/oauth2/login?redirect=${redirectTo}`)}
    >
      {localization.authentication.logIn}
    </Button>
  );
};

export { LoginButton };

// biome-ignore lint/suspicious/noExplicitAny: <temp>
function useAuth(): { isAuthenticated: any } {
  throw new Error('Function not implemented.');
}
