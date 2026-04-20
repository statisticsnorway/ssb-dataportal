export function getVardefApiDocsUrl(): string {
  return process.env.VARDEF_API_DOCS_URL ?? 'https://metadata.ssb.no/docs/swagger/variable-definitions';
}

export function getLoginUrl(pathname: String): string {
  return `${process.env.NEXT_PUBLIC_LOGIN_URL}?redirect=${pathname}`;
}

export function getLogoutUrl(pathname: String): string {
  return `${process.env.NEXT_PUBLIC_LOGOUT_URL}?redirect=${pathname}`;
}
