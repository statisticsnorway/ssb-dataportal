/**
 * Builds login URL using NEXT_PUBLIC_LOGIN_URL.
 * Optionally includes a redirect path after login.
 *
 * @param pathname - Optional redirect path after login.
 */
export function getLoginUrl(pathname: string): string {
  const base = process.env.NEXT_PUBLIC_LOGIN_URL;
  if (!base) {
    throw new Error(`Missing NEXT_PUBLIC_LOGIN_URL`);
  }
  if (pathname == null) {
    return base;
  }
  return `${base}?redirect=${pathname}`;
}

/**
 * Builds logout URL using NEXT_PUBLIC_LOGOUT_URL.
 * Optionally includes a redirect path after login.
 *
 * @param pathname - Optional redirect path after login.
 */
export function getLogoutUrl(pathname: string): string {
  const base = process.env.NEXT_PUBLIC_LOGOUT_URL;
  if (!base) {
    throw new Error(`Missing NEXT_PUBLIC_LOGOUT_URL`);
  }
  if (pathname == null) {
    return base;
  }
  return `${base}?redirect=${pathname}`;
}
