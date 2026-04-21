/**
 * Builds an authentication URL (login or logout) using the provided env key.
 *
 * If `pathname` is provided, it is appended as a `redirect` query parameter.
 * Throws if the environment variable is missing or empty.
 *
 * @param envKey - Environment key for the base auth URL.
 * @param pathname - Optional redirect path.
 * @returns Auth URL.
 */
function buildAuthUrl(envKey: 'NEXT_PUBLIC_LOGIN_URL' | 'NEXT_PUBLIC_LOGOUT_URL', pathname?: string): string {
  const base = process.env[envKey];

  if (!base) {
    throw new Error(`Missing ${envKey}`);
  }

  if (pathname == null) {
    return base;
  }

  return `${base}?redirect=${pathname}`;
}

/**
 * Builds login URL using NEXT_PUBLIC_LOGIN_URL.
 * Optionally includes a redirect path after login.
 *
 * @param pathname - Optional redirect path after login.
 */
export function getLoginUrl(pathname: string): string {
  return buildAuthUrl('NEXT_PUBLIC_LOGIN_URL', pathname);
}

/**
 * Builds logout URL using NEXT_PUBLIC_LOGOUT_URL.
 * Optionally includes a redirect path after login.
 *
 * @param pathname - Optional redirect path after login.
 */
export function getLogoutUrl(pathname: string): string {
  return buildAuthUrl('NEXT_PUBLIC_LOGOUT_URL', pathname);
}
