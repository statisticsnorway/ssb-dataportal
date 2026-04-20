export function getLoginUrl(pathname: string): string {
  const base = process.env.NEXT_PUBLIC_LOGIN_URL;
  if (!base) throw new Error('Missing LOGIN URL');
  return `${base}?redirect=${pathname}`;
}

export function getLogoutUrl(pathname: string): string {
  const base = process.env.NEXT_PUBLIC_LOGOUT_URL;
  if (!base) throw new Error('Missing LOGOUT URL');
  return `${base}?redirect=${pathname}`;
}

// pathname safety
