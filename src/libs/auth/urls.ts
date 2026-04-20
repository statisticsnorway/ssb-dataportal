export function getLoginUrl(pathname: string): string {
  const base = process.env.NEXT_PUBLIC_LOGIN_URL;
  if (!base) throw new Error('Missing LOGIN URL');

  const url = new URL(base);
  url.searchParams.set('redirect', pathname.startsWith('/') ? pathname : '/');

  return url.toString();
}

export function getLogoutUrl(pathname: string): string {
  const base = process.env.NEXT_PUBLIC_LOGOUT_URL;
  if (!base) throw new Error('Missing LOGOUT URL');

  const url = new URL(base);
  url.searchParams.set('redirect', pathname.startsWith('/') ? pathname : '/');

  return url.toString();
}
